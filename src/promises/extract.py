"""Conservative promise-record helpers."""

from __future__ import annotations

import json
import re
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


def parse_extraction_response(content: str, source_url: str) -> list[Promise]:
    """Parse and validate an LLM response without accepting unverified output."""
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", content.strip())
    payload = json.loads(cleaned)
    candidates = payload.get("promises", []) if isinstance(payload, dict) else []
    if not isinstance(candidates, list):
        raise ValueError("Promise extraction response must contain a promises array")
    validated: list[Promise] = []
    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue
        candidate.setdefault("source_url", source_url)
        validated.append(validate_promise_candidate(candidate))
    return validated


def extract_promise_candidates(source_text: str, source_url: str) -> list[Promise]:
    """Extract housing candidates with Groq; all results remain review candidates."""
    from src.llm.groq import get_groq_chat_model

    response = get_groq_chat_model().invoke(build_extraction_prompt(source_text, source_url))
    content = response.content if isinstance(response.content, str) else str(response.content)
    return parse_extraction_response(content, source_url)


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
