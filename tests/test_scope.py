from datetime import date

from db.models import BoeItem, FUTURE_TOPICS, MVP_TOPICS
from src.config import BOE_MVP_TERRITORY, MVP_TOPIC
from src.scope import filter_mvp_boe_items


def test_mvp_is_housing_only() -> None:
    assert MVP_TOPIC == "vivienda"
    assert MVP_TOPICS == ("vivienda",)


def test_future_topics_are_explicitly_reserved() -> None:
    assert FUTURE_TOPICS == ("educacion", "sanidad")


def test_boe_mvp_scope_is_national() -> None:
    assert BOE_MVP_TERRITORY == "Estatal"


def test_boe_filter_keeps_only_national_housing_items() -> None:
    items = [
        BoeItem(
            id="national-housing",
            date=date(2026, 1, 1),
            title="Housing law",
            original_url="https://example.test/1",
            raw_text="",
            topics=["vivienda"],
            territory="Estatal",
        ),
        BoeItem(
            id="regional-housing",
            date=date(2026, 1, 1),
            title="Regional housing law",
            original_url="https://example.test/2",
            raw_text="",
            topics=["vivienda"],
            territory="Comunidad de Madrid",
        ),
        BoeItem(
            id="national-health",
            date=date(2026, 1, 1),
            title="Health law",
            original_url="https://example.test/3",
            raw_text="",
            topics=["sanidad"],
            territory="Estatal",
        ),
    ]

    assert [item.id for item in filter_mvp_boe_items(items)] == ["national-housing"]
