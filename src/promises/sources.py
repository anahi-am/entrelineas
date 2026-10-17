"""Official source registry for extracting public housing commitments."""

from dataclasses import dataclass


@dataclass(frozen=True)
class PromiseSource:
    name: str
    source_type: str
    url: str
    authority: str


OFFICIAL_PROMISE_SOURCES = (
    PromiseSource(
        "Investiture speeches",
        "investiture_speech",
        "https://www.congreso.es/en/cem/sesiones-de-investidura",
        "Congress of Deputies",
    ),
    PromiseSource(
        "La Moncloa investiture archive",
        "government_speech",
        "https://www.lamoncloa.gob.es/presidente/presidentes/investiduras/Paginas/index.aspx",
        "Government of Spain",
    ),
    PromiseSource(
        "Cumpliendo progress reports",
        "government_progress_report",
        "https://www.lamoncloa.gob.es/presidente/actividades/Paginas/2023/230223-cumpliendo.aspx",
        "Government of Spain",
    ),
)
