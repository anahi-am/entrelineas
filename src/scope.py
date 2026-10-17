"""MVP scope guards for the first national housing vertical slice."""

from collections.abc import Iterable

from db.models import BoeItem, MVP_TOPICS
from src.config import BOE_MVP_TERRITORY


def is_mvp_boe_item(item: BoeItem) -> bool:
    """Return whether a BOE item belongs in the housing/national MVP."""
    return item.territory == BOE_MVP_TERRITORY and any(
        topic in MVP_TOPICS for topic in item.topics
    )


def filter_mvp_boe_items(items: Iterable[BoeItem]) -> list[BoeItem]:
    """Keep only national housing items for the first demo."""
    return [item for item in items if is_mvp_boe_item(item)]
