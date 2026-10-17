"""Housing MVP pipeline: source promises, retrieve BOE candidates, review."""

from __future__ import annotations

from collections.abc import Iterable
import re

from db.models import BoeItem, Promise
from src.fuentes.boe import fetch_document_text, search_housing
from src.scope import filter_mvp_boe_items


def retrieve_boe_candidates(keywords: list[str], *, limit: int = 20) -> list[BoeItem]:
    """Retrieve national BOE records and hydrate their official text."""
    items = filter_mvp_boe_items(search_housing(keywords, limit=limit))
    return [item.model_copy(update={"raw_text": fetch_document_text(item)}) for item in items]


def prepare_review_queue(
    promises: Iterable[Promise], boe_items: Iterable[BoeItem]
) -> list[tuple[Promise, BoeItem]]:
    """Return lexically relevant candidate pairs for human review.

    This is retrieval, not a fulfilment decision. A human must review every
    pair before an evidence link is created or published.
    """
    items = list(boe_items)
    queue: list[tuple[Promise, BoeItem]] = []
    for promise in promises:
        if promise.topic != "vivienda":
            continue
        promise_terms = _terms(promise.text)
        for item in items:
            item_terms = _terms(item.title + " " + item.raw_text)
            if promise_terms & item_terms:
                queue.append((promise, item))
    return queue


def _terms(text: str) -> set[str]:
    stopwords = {"para", "por", "con", "una", "los", "las", "del", "que", "de", "y"}
    return {
        term
        for term in re.findall(r"[a-záéíóúüñ]{4,}", text.casefold())
        if term not in stopwords
    }
