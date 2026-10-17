from src.promises.extract import parse_extraction_response


def test_parse_extraction_response_validates_candidates() -> None:
    result = parse_extraction_response(
        '{"promises":[{"id":"p-1","party":"Ejemplo",'
        '"text":"Crearemos vivienda pública.","topic":"vivienda",'
        '"territory":"España"}]}',
        "https://example.org/source",
    )
    assert result[0].source_url == "https://example.org/source"
