import httpx

from src.fuentes.ine import get_table


def test_get_table_uses_bounded_official_request() -> None:
    transport = httpx.MockTransport(lambda request: httpx.Response(200, json=[{"COD": "x"}]))
    with httpx.Client(transport=transport) as client:
        result = get_table(80270, nult=1, client=client)
    assert result == [{"COD": "x"}]
