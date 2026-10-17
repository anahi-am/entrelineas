from datetime import date

import pytest

from src.fuentes.boe import build_query, normalize_item


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
        }
    )
    assert item.id == "BOE-A-2024-1"
    assert item.date == date(2024, 1, 2)
    assert item.territory == "Estatal"
    assert item.topics == ["vivienda"]
