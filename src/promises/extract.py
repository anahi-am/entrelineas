"""Conservative promise-record helpers."""

from __future__ import annotations

from typing import Any

from db.models import Promise

PROMISE_EXTRACTION_INSTRUCTIONS = """Extract only explicit housing commitments from the source.
Return JSON with an array named promises. Each item must contain: id, party,
text (exact quotation), source_url, topic=vivienda, and territory. Do not
invent a promise or paraphrase the quotation. Mark uncertain candidates for
human review rather than treating them as verified."""


def build_extraction_prompt(source_text: str, source_url: str) -> str:
    """Create the constrained prompt used by the LLM extraction step."""
    return f"{PROMISE_EXTRACTION_INSTRUCTIONS}\nSource URL: {source_url}\n\nSource:\n{source_text}"


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
