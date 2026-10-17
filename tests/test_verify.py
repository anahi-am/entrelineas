import httpx

from db.models import Promise
from src.promises.verify import verify_promise_source


def test_verify_source_checks_literal_quote() -> None:
    promise = Promise(
        id="p1",
        party="Test",
        text="habilitación de 183.000 viviendas",
        source_url="https://example.org/source",
        topic="vivienda",
        territory="España",
    )

    transport = httpx.MockTransport(lambda request: httpx.Response(200, text="La habilitación de 183.000 viviendas públicas."))
    with httpx.Client(transport=transport) as client:
        result = verify_promise_source(promise, client=client)

    assert result.reachable is True
    assert result.quote_found is True
    assert result.issues == []
