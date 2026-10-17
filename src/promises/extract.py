"""Conservative promise-record helpers."""

from __future__ import annotations

from typing import Any

from db.models import Promise


def validate_promise_candidate(candidate: dict[str, Any]) -> Promise:
    """Validate the minimum evidence required for a housing promise."""
    promise = Promise.model_validate(candidate)
    if promise.topic != "vivienda":
        raise ValueError("Only housing promises are in the MVP")
    if not promise.source_url.startswith(("https://", "http://")):
        raise ValueError("A promise must retain its public source URL")
    if not promise.text.strip():
        raise ValueError("A promise must retain its exact text")
    return promise
