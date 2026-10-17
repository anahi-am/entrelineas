"""Small, typed client for the official BOE consolidated-legislation API."""

from __future__ import annotations

import json
import re
from datetime import date
from html.parser import HTMLParser
from typing import Any

import httpx

from db.models import BoeItem
from src.config import BOE_MVP_TERRITORY, MVP_TOPIC, settings

CONSOLIDATED_PATH = "/legislacion-consolidada"


def build_query(
    keywords: list[str], *, start: str = "20110101", end: str = "20261231"
) -> dict[str, Any]:
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


def _territory(raw: Any) -> str:
    if isinstance(raw, dict):
        return _text(raw.get("texto"))
    return _text(raw)


def _date(value: str) -> date:
    for candidate in (value[:10], f"{value[:4]}-{value[4:6]}-{value[6:8]}"):
        try:
            return date.fromisoformat(candidate)
        except ValueError:
            continue
    raise ValueError(f"Invalid BOE publication date: {value!r}")


def normalize_item(raw: dict[str, Any], *, topics: list[str] | None = None) -> BoeItem:
    """Normalize one BOE API result into the application model."""
    identifier = _text(raw.get("identificador"))
    published = _text(raw.get("fecha_publicacion"))
    published_date = _date(published)
    eli = _text(raw.get("url_eli"))
    territory = _territory(raw.get("ambito"))
    return BoeItem(
        id=identifier,
        date=published_date,
        title=_text(raw.get("titulo")),
        original_url=eli or f"https://www.boe.es/diario_boe/txt.php?id={identifier}",
        raw_text="",
        topics=topics or [],
        territory=territory,
    )


class _TextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
        self.parts.append(data)


def fetch_document_text(item: BoeItem, *, client: httpx.Client | None = None) -> str:
    """Fetch and strip readable text from the official BOE document URL."""
    if not item.original_url:
        return ""
    owns_client = client is None
    http = client or httpx.Client(timeout=60.0)
    try:
        response = http.get(
            item.original_url,
            headers={"Accept": "text/html", "User-Agent": "Entrelineas/0.1"},
        )
        response.raise_for_status()
        parser = _TextParser()
        parser.feed(response.text)
        return re.sub(r"\s+", " ", " ".join(parser.parts)).strip()
    finally:
        if owns_client:
            http.close()


def search_housing(
    keywords: list[str], *, client: httpx.Client | None = None, limit: int = 20
) -> list[BoeItem]:
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
        items: list[BoeItem] = []
        normalized_keywords = [word.casefold() for word in keywords if word.strip()]
        for raw in raw_items:
            if not isinstance(raw, dict):
                continue
            title = _text(raw.get("titulo")).casefold()
            territory = _territory(raw.get("ambito"))
            if territory != BOE_MVP_TERRITORY:
                continue
            if not any(keyword in title for keyword in normalized_keywords):
                continue
            try:
                items.append(normalize_item(raw, topics=[MVP_TOPIC]))
            except ValueError:
                continue
        return items
    finally:
        if owns_client:
            http.close()
