"""Small client for official INE JSON table data."""

from __future__ import annotations

from typing import Any

import httpx

INE_BASE_URL = "https://servicios.ine.es/wstempus/js"


def get_table(
    table_id: int,
    *,
    nult: int = 1,
    language: str = "ES",
    client: httpx.Client | None = None,
) -> list[dict[str, Any]]:
    """Fetch a bounded INE table response; callers must interpret its metrics."""
    if table_id <= 0:
        raise ValueError("table_id must be positive")
    if nult <= 0 or nult > 100:
        raise ValueError("nult must be between 1 and 100")
    if language not in {"ES", "EN"}:
        raise ValueError("language must be ES or EN")
    url = f"{INE_BASE_URL}/{language}/DATOS_TABLA/{table_id}"
    owns_client = client is None
    http_client = client or httpx.Client(timeout=20, follow_redirects=True)
    try:
        response = http_client.get(url, params={"nult": nult, "tip": "AM"})
        response.raise_for_status()
        payload = response.json()
        if not isinstance(payload, list):
            raise ValueError("INE table response must be a list")
        return payload
    finally:
        if owns_client:
            http_client.close()
