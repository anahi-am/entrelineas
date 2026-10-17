"""Small Supabase persistence boundary for reviewed MVP records."""

from __future__ import annotations

from collections.abc import Iterable

from db.models import BoeItem, EvidenceLink, Promise


def upsert_promises(client: object, promises: Iterable[Promise]) -> None:
    rows = [promise.model_dump(mode="json") for promise in promises]
    if rows:
        client.table("promises").upsert(rows, on_conflict="id").execute()


def upsert_boe_items(client: object, items: Iterable[BoeItem]) -> None:
    rows = [item.model_dump(mode="json") for item in items]
    if rows:
        client.table("boe_items").upsert(rows, on_conflict="id").execute()


def insert_evidence_links(client: object, links: Iterable[EvidenceLink]) -> None:
    rows = [link.model_dump(mode="json") for link in links]
    if rows:
        client.table("evidence_links").insert(rows).execute()
