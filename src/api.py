"""Public read API for reviewed housing promises."""

from __future__ import annotations

from datetime import date
import json
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from db.client import get_supabase_client
from src.config import settings

SEED_PATH = Path(__file__).resolve().parents[1] / "db" / "seeds" / "promises_seed.json"

app = FastAPI(title="EntreLineas API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def _source(
    title: str, publisher: str, url: str, published_at: str | None = None
) -> dict[str, Any]:
    result: dict[str, Any] = {"title": title, "publisher": publisher, "url": url}
    if published_at:
        result["publishedAt"] = published_at
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
        ),
        "status": status_map.get(row.get("status", "sin_rastro"), "insufficient_evidence"),
        "evidence": evidence,
        "unverifiedNotes": row.get("unverified_notes", []),
        "validationSources": row.get("validation_sources", []) or [],
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
        return [_public_record(row, row.get("evidence", [])) for row in seed_rows]
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
    return [_public_record(row, evidence_by_promise.get(row["id"], [])) for row in promises]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "scope": "housing", "territory": "Estatal"}


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
