from datetime import date
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field

Topic = Literal["vivienda", "educacion", "sanidad"]

MVP_TOPICS: tuple[Topic, ...] = ("vivienda",)
FUTURE_TOPICS: tuple[Topic, ...] = ("educacion", "sanidad")


class EvidenceStatus(str, Enum):
    HECHO = "hecho"
    EN_TRAMITE = "en_tramite"
    BLOQUEADA = "bloqueada"
    SIN_RASTRO = "sin_rastro"


class BoeItem(BaseModel):
    id: str
    date: date
    title: str
    original_url: str
    raw_text: str
    simplified_text: str = ""
    topics: list[str] = Field(default_factory=list)
    territory: str = ""


class Promise(BaseModel):
    id: str
    party: str
    text: str
    source_url: str
    topic: Topic
    territory: str


class EvidenceLink(BaseModel):
    promise_id: str
    boe_item_id: str
    status: EvidenceStatus
    reasoning: str
