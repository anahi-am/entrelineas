"""Small, typed client for the official BOE consolidated-legislation API."""

from __future__ import annotations

import json
from datetime import date
from typing import Any

import httpx

from db.models import BoeItem
from src.config import BOE_MVP_TERRITORY, MVP_TOPIC, settings

CONSOLIDATED_PATH = "/legislacion-consolidada"


def build_query(keywords: list[str], *, start: str = "20110101", end: str = "20261231") -> dict[str, Any]:
    """Build the official API payload used for the housing MVP."""
    terms = [f'titulo:"{word.strip()}"' for word in keywords if word.strip()]
    if not terms:
        raise ValueError("At least one BOE keyword is required")
    return {
        "query": {
            "query_string": {"query": "(" + " or ".join(terms) + ")"},
            "range": {"fecha_publicacion": {"gte": start, "lte": end}},
        },
        "sort": [{"fecha_publicacion": "desc"}],
    }


def _text(value: Any) -> str:
    return value.strip() if isinstance(value, str) else ""


def normalize_item(raw: dict[str, Any]) -> BoeItem:
    """Normalize one BOE API result into the application model."""
    identifier = _text(raw.get("identificador"))
    published = _text(raw.get("fecha_publicacion"))
    try:
        published_date = date.fromisoformat(published[:10])
    except ValueError:
        try:
            published_date = date.fromisoformat(
                f"{published[:4]}-{published[4:6]}-{published[6:8]}"
            )
        except ValueError:
            published_date = date(1970, 1, 1)
    eli = _text(raw.get("url_eli"))
    territory = _text((raw.get("ambito") or {}).get("texto")) or BOE_MVP_TERRITORY
    return BoeItem(
        id=identifier,
        date=published_date,
        title=_text(raw.get("titulo")),
        original_url=eli or f"https://www.boe.es/diario_boe/txt.php?id={identifier}",
        raw_text="",
        topics=[MVP_TOPIC],
        territory=territory,
    )


def search_housing(keywords: list[str], *, client: httpx.Client | None = None, limit: int = 20) -> list[BoeItem]:
    """Search official BOE records, retaining only national housing records."""
    owns_client = client is None
    http = client or httpx.Client(timeout=60.0)
    try:
        response = http.get(
            f"{settings.boe_api_base}{CONSOLIDATED_PATH}",
            params={"query": json.dumps(build_query(keywords), ensure_ascii=False), "limit": limit},
            headers={"Accept": "application/json", "User-Agent": "Entrelineas/0.1"},
        )
        response.raise_for_status()
        payload = response.json()
        raw_items = payload.get("data", []) if isinstance(payload, dict) else []
        items = [normalize_item(item) for item in raw_items if isinstance(item, dict)]
        return [item for item in items if item.territory == BOE_MVP_TERRITORY]
    finally:
        if owns_client:
            http.close()
