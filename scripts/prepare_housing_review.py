#!/usr/bin/env python3
"""Prepare a human-review queue from official promises and BOE candidates.

Dry-run is the default. Use --persist only after Supabase credentials and the
schema have been reviewed. This script never creates a public evidence link.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from db.client import get_supabase_client
from db.models import Promise
from db.repositories import upsert_boe_items, upsert_promises
from src.config import settings
from src.pipeline.housing_mvp import prepare_review_queue, retrieve_boe_candidates
from src.promises.verify import verify_promise_source

DEFAULT_PROMISES = ROOT / "db" / "seeds" / "promises_seed.json"
DEFAULT_OUTPUT = ROOT / "db" / "seeds" / "housing_review_queue.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--promises", type=Path, default=DEFAULT_PROMISES)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--keywords", nargs="+", default=["vivienda"])
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--skip-boe", action="store_true")
    parser.add_argument(
        "--persist",
        action="store_true",
        help="Upsert promises and BOE documents to Supabase; evidence remains pending review.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    promises = [Promise.model_validate(row) for row in json.loads(args.promises.read_text())]
    checks = {promise.id: verify_promise_source(promise) for promise in promises}
    boe_items = [] if args.skip_boe else retrieve_boe_candidates(args.keywords, limit=args.limit)
    queue = prepare_review_queue(promises, boe_items)
    payload = {
        "source_checks": {
            promise_id: {
                "reachable": check.reachable,
                "quote_found": check.quote_found,
                "issues": check.issues,
            }
            for promise_id, check in checks.items()
        },
        "boe_items": [item.model_dump(mode="json") for item in boe_items],
        "candidate_matches": [
            {"promise_id": promise.id, "boe_item_id": item.id}
            for promise, item in queue
        ],
        "review_required": True,
        "public_evidence_created": False,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")

    if args.persist:
        if not settings.supabase_url or not settings.supabase_key:
            raise SystemExit("--persist requires SUPABASE_URL and SUPABASE_KEY")
        client = get_supabase_client()
        upsert_promises(client, promises)
        upsert_boe_items(client, boe_items)

    print(f"Wrote review queue: {args.output}")
    print(f"Promises checked: {len(promises)}; BOE candidates: {len(boe_items)}; matches: {len(queue)}")
    print("No evidence links were published; human review is required.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
