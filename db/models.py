from datetime import date, datetime
from enum import Enum
from typing import Any, Literal

from pydantic import BaseModel, Field

Topic = Literal["vivienda", "educacion", "sanidad"]

MVP_TOPICS: tuple[Topic, ...] = ("vivienda",)
FUTURE_TOPICS: tuple[Topic, ...] = ("educacion", "sanidad")


class EvidenceStatus(str, Enum):
    HECHO = "hecho"
    EN_TRAMITE = "en_tramite"
    BLOQUEADA = "bloqueada"
    SIN_RASTRO = "sin_rastro"
    EVIDENCIA_INSUFICIENTE = "evidencia_insuficiente"


class BoeItem(BaseModel):
    id: str
    date: date
    title: str
    original_url: str
    raw_text: str = ""
    simplified_text: str = ""
    topics: list[str] = Field(default_factory=list)
    territory: str = ""


class Promise(BaseModel):
    id: str
    party: str
    text: str
    source_url: str
    announcement_date: date | None = None
    validation_sources: list[dict[str, str]] = Field(default_factory=list)
    source_verification: dict[str, str] = Field(default_factory=dict)
    context_metrics: list[dict[str, Any]] = Field(default_factory=list)
    topic: Topic
    territory: str
    status: EvidenceStatus = EvidenceStatus.SIN_RASTRO
    plain_language_explanation: str = ""
    unverified_notes: list[str] = Field(default_factory=list)
    updated_at: datetime | None = None


class EvidenceLink(BaseModel):
    promise_id: str
    boe_item_id: str
    status: EvidenceStatus
    reasoning: str
    reviewed_at: datetime | None = None
    reviewer: str | None = None
