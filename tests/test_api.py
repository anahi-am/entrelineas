from fastapi.testclient import TestClient

from src.api import app


def test_health_and_empty_local_public_feed() -> None:
    client = TestClient(app)
    assert client.get("/health").json() == {
        "status": "ok",
        "scope": "housing",
        "territory": "Estatal",
    }
    assert client.get("/published/promises").json() == {"items": []}
