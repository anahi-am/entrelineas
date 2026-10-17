import pytest

from src.promises.extract import validate_promise_candidate
from db.models import EvidenceStatus


def test_promise_candidate_requires_housing() -> None:
    candidate = {
        "id": "p-1",
        "party": "Ejemplo",
        "text": "Construiremos vivienda pública.",
        "source_url": "https://example.org/source",
        "topic": "educacion",
        "territory": "España",
    }
    with pytest.raises(ValueError, match="housing"):
        validate_promise_candidate(candidate)


def test_promise_defaults_to_explicit_unverified_state() -> None:
    promise = validate_promise_candidate(
        {
            "id": "p-2",
            "party": "Ejemplo",
            "text": "Crearemos vivienda pública.",
            "source_url": "https://example.org/source",
            "topic": "vivienda",
            "territory": "España",
        }
    )
    assert promise.status is EvidenceStatus.SIN_RASTRO
    assert promise.plain_language_explanation == ""
    assert promise.unverified_notes == []
