"""Checks that a promise source is publicly inspectable before review."""

from __future__ import annotations

import re
from dataclasses import dataclass

import httpx

from db.models import Promise


@dataclass(frozen=True)
class SourceCheck:
    reachable: bool
    quote_found: bool
    issues: list[str]


def _normalise(value: str) -> str:
    return re.sub(r"\s+", " ", value.casefold()).strip()


def verify_promise_source(
    promise: Promise, *, client: httpx.Client | None = None
) -> SourceCheck:
    """Check URL reachability and whether the literal promise appears in its source."""
    owns_client = client is None
    http_client = client or httpx.Client(follow_redirects=True, timeout=20)
    try:
        response = http_client.get(promise.source_url)
        response.raise_for_status()
        quote_found = _normalise(promise.text) in _normalise(response.text)
        issues = [] if quote_found else ["The literal promise text was not found in the source page."]
        return SourceCheck(reachable=True, quote_found=quote_found, issues=issues)
    except httpx.HTTPError as exc:
        return SourceCheck(reachable=False, quote_found=False, issues=[f"Source unavailable: {exc}"])
    finally:
        if owns_client:
            http_client.close()
