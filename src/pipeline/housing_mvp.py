"""Housing MVP pipeline: source promises, retrieve BOE candidates, review."""

from __future__ import annotations

from collections.abc import Iterable

from db.models import BoeItem, Promise
from src.fuentes.boe import search_housing
from src.scope import filter_mvp_boe_items


def retrieve_boe_candidates(keywords: list[str], *, limit: int = 20) -> list[BoeItem]:
    """Retrieve national BOE records for a reviewed housing promise."""
    return filter_mvp_boe_items(search_housing(keywords, limit=limit))


def prepare_review_queue(promises: Iterable[Promise], boe_items: Iterable[BoeItem]) -> list[tuple[Promise, BoeItem]]:
    """Return candidate pairs for human review; no pair is auto-published."""
    items = list(boe_items)
    return [
        (promise, item)
        for promise in promises
        for item in items
        if promise.topic == "vivienda" and item.territory == "Estatal"
    ]
