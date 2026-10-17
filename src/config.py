import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel

ROOT_DIR = Path(__file__).resolve().parents[1]
SEEDS_DIR = ROOT_DIR / "db" / "seeds"

# Hackathon MVP scope. Keep future topics explicit so expanding the product is
# an intentional decision rather than an accidental classifier change.
MVP_TOPIC = "vivienda"
FUTURE_TOPICS = ("educacion", "sanidad")
BOE_MVP_TERRITORY = "Estatal"

load_dotenv(ROOT_DIR / ".env")


class Settings(BaseModel):
    groq_api_key: str
    supabase_url: str
    supabase_key: str
    groq_model: str = "llama-3.3-70b-versatile"
    boe_api_base: str = "https://www.boe.es/datosabiertos/api"
    max_boe_items: int = 20


def load_settings() -> Settings:
    return Settings(
        groq_api_key=os.getenv("GROQ_API_KEY", ""),
        supabase_url=os.getenv("SUPABASE_URL", ""),
        supabase_key=os.getenv("SUPABASE_KEY", ""),
        groq_model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        max_boe_items=int(os.getenv("MAX_BOE_ITEMS", "20")),
    )


settings = load_settings()
