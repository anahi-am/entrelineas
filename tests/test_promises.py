import pytest

from src.promises.extract import validate_promise_candidate


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
