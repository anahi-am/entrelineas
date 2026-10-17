from datetime import date

import pytest

import httpx

from src.fuentes.boe import build_query, fetch_daily_summary, normalize_item


def test_build_query_requires_keywords() -> None:
    with pytest.raises(ValueError):
        build_query([])


def test_normalize_item_keeps_source_metadata() -> None:
    item = normalize_item(
        {
            "identificador": "BOE-A-2024-1",
            "fecha_publicacion": "20240102",
            "titulo": "Medidas de vivienda",
            "url_eli": "https://www.boe.es/eli/es/rd/2024/01/01/1",
            "ambito": {"texto": "Estatal"},
        },
        topics=["vivienda"],
    )
    assert item.id == "BOE-A-2024-1"
    assert item.date == date(2024, 1, 2)
    assert item.territory == "Estatal"
    assert item.topics == ["vivienda"]


def test_fetch_daily_summary_uses_official_json_endpoint() -> None:
    seen: dict[str, object] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["url"] = str(request.url)
        return httpx.Response(
            200,
            json={
                "data": [
                    {
                        "identificador": "BOE-A-2026-1",
                        "fecha_publicacion": "20261017",
                        "titulo": "Medidas de vivienda",
                        "url_eli": "https://www.boe.es/eli/es/rd/2026/10/17/1",
                        "ambito": {"texto": "Estatal"},
                    }
                ]
            },
        )

    items = fetch_daily_summary("20261017", client=httpx.Client(transport=httpx.MockTransport(handler)))
    assert items[0].id == "BOE-A-2026-1"
    assert seen["url"].endswith("/boe/sumario/20261017")
