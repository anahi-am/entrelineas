"""Public read API for reviewed housing promises."""

from __future__ import annotations

from datetime import date, timedelta
import json
import os
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from db.client import get_supabase_client
from src.config import settings
from src.fuentes.boe import fetch_daily_summary, fetch_document_text

SEED_PATH = Path(__file__).resolve().parents[1] / "db" / "seeds" / "promises_seed.json"
HOUSING_FEED_TERMS = (
    "vivienda",
    "alquiler",
    "arrendamiento",
    "residencial",
    "habitacional",
    "suelo",
)

app = FastAPI(title="EntreLineas API", version="0.1.0")
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://frontend-one-indol-43.vercel.app",
]
if os.getenv("FRONTEND_ORIGIN"):
    allowed_origins.append(os.environ["FRONTEND_ORIGIN"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def _source(
    title: str,
    publisher: str,
    url: str,
    published_at: str | None = None,
    source_type: str | None = None,
) -> dict[str, Any]:
    result: dict[str, Any] = {"title": title, "publisher": publisher, "url": url}
    if published_at:
        result["publishedAt"] = published_at
    if source_type:
        result["sourceType"] = source_type
    return result


def _public_record(row: dict[str, Any], evidence: list[dict[str, Any]]) -> dict[str, Any]:
    status_map = {
        "hecho": "done",
        "en_tramite": "in_progress",
        "bloqueada": "blocked",
        "sin_rastro": "no_trace",
        "evidencia_insuficiente": "insufficient_evidence",
    }
    source_url = row.get("source_url", "")
    return {
        "id": row["id"],
        "originalText": row["text"],
        "party": {"name": row["party"]},
        "topic": "housing",
        "territory": row["territory"],
        "plainLanguageExplanation": row.get("plain_language_explanation", row["text"]),
        "officialSource": _source(
            "Fuente oficial de la promesa",
            row["party"],
            source_url,
            row.get("announcement_date"),
            "promise_source",
        ),
        "sourceVerification": row.get(
            "source_verification",
            {
                "status": "source_confirmed",
                "method": "official URL and exact quote check",
                "note": "Confirms that the promise was stated; it does not prove fulfilment.",
            },
        ),
        "reviewStatus": row.get("review_status", "source_verified"),
        "progressStatus": row.get("progress_status", "not_assessable"),
        "evidenceTier": row.get("evidence_tier"),
        "publicationStatus": row.get("publication_status", "pending_review"),
        "audienceDisclaimer": (
            "EntreLineas ayuda a entender información pública y sus fuentes; "
            "no es una fuente definitiva de verdad ni sustituye la consulta de los documentos originales."
        ),
        "status": status_map.get(row.get("status", "sin_rastro"), "insufficient_evidence"),
        "evidence": evidence,
        "unverifiedNotes": row.get("unverified_notes", []),
        "contextSources": row.get("validation_sources", []) or [],
        "contextMetrics": row.get("context_metrics", []) or [],
        "lastUpdatedAt": row.get("updated_at", row.get("created_at", date.today().isoformat())),
    }


def _public_evidence(link: dict[str, Any], boe: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(link.get("id", f"{link['promise_id']}-{link['boe_item_id']}")),
        "kind": "official_document",
        "date": boe["date"],
        "title": boe["title"],
        "summary": link.get("reasoning", "Evidencia oficial pendiente de revisión editorial."),
        "originalExcerpt": boe.get("raw_text", "")[:1000] or None,
        "source": _source("Boletín Oficial del Estado", "BOE", boe["original_url"], boe["date"]),
    }


def _fetch_public_records() -> list[dict[str, Any]]:
    if not settings.supabase_url or not settings.supabase_key:
        if not SEED_PATH.exists():
            return []
        seed_rows = json.loads(SEED_PATH.read_text(encoding="utf-8"))
        return [
            _public_record(row, row.get("evidence", []))
            for row in seed_rows
            if row.get("publication_status") == "approved"
        ]
    client = get_supabase_client()
    promises = (
        client.table("promises").select("*").eq("topic", "vivienda").execute().data or []
    )
    links = client.table("evidence_links").select("*").execute().data or []
    boe_items = client.table("boe_items").select("*").execute().data or []
    boe_by_id = {item["id"]: item for item in boe_items}
    evidence_by_promise: dict[str, list[dict[str, Any]]] = {}
    for link in links:
        if not link.get("reviewed_at"):
            continue
        boe = boe_by_id.get(link.get("boe_item_id"))
        if boe:
            evidence_by_promise.setdefault(link["promise_id"], []).append(
                _public_evidence(link, boe)
            )
    return [
        _public_record(row, evidence_by_promise.get(row["id"], []))
        for row in promises
        if row.get("publication_status") == "approved"
    ]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "scope": "housing", "territory": "Estatal"}


@app.get("/boe/feed")
def boe_feed(days: int = 7) -> dict[str, Any]:
    """Return recent Spain-wide BOE housing publications for the public feed."""
    days = max(1, min(days, 14))
    today = date.today()
    updates: list[dict[str, Any]] = []
    for offset in range(days):
        publication_date = today - timedelta(days=offset)
        try:
            items = fetch_daily_summary(publication_date.strftime("%Y%m%d"))
        except Exception:
            continue
        for item in items:
            if not any(term in item.title.casefold() for term in HOUSING_FEED_TERMS):
                continue
            updates.append(
                {
                    "id": item.id,
                    "date": item.date.isoformat(),
                    "title": item.title,
                    "summary": "Publicación oficial del BOE relacionada con vivienda; consulta el documento original para conocer su alcance.",
                    "source": {
                        "title": "Boletín Oficial del Estado",
                        "publisher": "BOE",
                        "url": item.original_url,
                        "publishedAt": item.date.isoformat(),
                        "sourceType": "official_document",
                    },
                    "territory": item.territory,
                    "isPromiseEvidence": False,
                }
            )
    updates.sort(key=lambda update: (update["date"], update["id"]), reverse=True)
    return {"items": updates}


def _recent_boe_item(identifier: str, days: int = 14):
    today = date.today()
    for offset in range(days):
        try:
            items = fetch_daily_summary((today - timedelta(days=offset)).strftime("%Y%m%d"))
        except Exception:
            continue
        for item in items:
            if item.id == identifier and any(term in item.title.casefold() for term in HOUSING_FEED_TERMS):
                return item
    return None


@app.get("/boe/feed/{item_id}")
def boe_feed_detail(item_id: str) -> dict[str, Any]:
    """Return a BOE feed item with a readable excerpt from the original document."""
    item = _recent_boe_item(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="BOE update not found")
    text = fetch_document_text(item)
    sentences = [part.strip() for part in text.split(". ") if len(part.strip()) > 40]
    excerpt = ". ".join(sentences[:2])
    return {
        "id": item.id,
        "date": item.date.isoformat(),
        "title": item.title,
        "summary": excerpt[:600] or "Consulta el documento original para conocer su alcance.",
        "originalExcerpt": excerpt[:1400] or None,
        "source": {
            "title": "Boletín Oficial del Estado",
            "publisher": "BOE",
            "url": item.original_url,
            "publishedAt": item.date.isoformat(),
            "sourceType": "official_document",
        },
        "territory": item.territory,
        "isPromiseEvidence": False,
    }


@app.get("/published/promises")
def list_published_promises() -> dict[str, Any]:
    try:
        return {"items": _fetch_public_records()}
    except Exception as exc:
        raise HTTPException(
            status_code=503, detail="Public data is temporarily unavailable"
        ) from exc


@app.get("/promises/{promise_id}")
def get_published_promise(promise_id: str) -> dict[str, Any]:
    try:
        records = _fetch_public_records()
    except Exception as exc:
        raise HTTPException(
            status_code=503, detail="Public data is temporarily unavailable"
        ) from exc
    for record in records:
        if record["id"] == promise_id:
            return record
    raise HTTPException(status_code=404, detail="Promise not found")
