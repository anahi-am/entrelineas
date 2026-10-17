from fastapi.testclient import TestClient

from src.api import app


def test_health_and_empty_local_public_feed() -> None:
    client = TestClient(app)
    assert client.get("/health").json() == {
        "status": "ok",
        "scope": "housing",
        "territory": "Estatal",
    }
    response = client.get("/published/promises")
    assert response.status_code == 200
    assert response.json()["items"][0]["id"] == "promise-housing-sanchez-2023-183k"
    assert response.json()["items"][0]["status"] == "insufficient_evidence"
    assert response.json()["items"][0]["officialSource"]["publishedAt"] == "2023-11-15"
    assert response.json()["items"][0]["validationSources"][0]["url"].startswith("https://www.boe.es/")
    assert response.json()["items"][0]["validationSources"][0]["relationship"] == "related_context"
