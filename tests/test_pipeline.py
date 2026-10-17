from datetime import date

from db.models import BoeItem, Promise
from src.pipeline.housing_mvp import prepare_review_queue


def test_review_queue_requires_relevant_terms() -> None:
    promise = Promise(
        id="p-1",
        party="Ejemplo",
        text="Ampliaremos el parque público de vivienda.",
        source_url="https://example.org/promise",
        topic="vivienda",
        territory="España",
    )
    relevant = BoeItem(
        id="b-1",
        date=date(2024, 1, 1),
        title="Parque público de vivienda",
        original_url="https://example.org/boe",
        territory="Estatal",
    )
    unrelated = relevant.model_copy(update={"id": "b-2", "title": "Calendario tributario"})
    assert prepare_review_queue([promise], [relevant, unrelated]) == [(promise, relevant)]
