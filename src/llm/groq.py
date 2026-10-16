from langchain_groq import ChatGroq

from src.config import settings


def get_groq_chat_model(temperature: float = 0.0) -> ChatGroq:
    return ChatGroq(
        api_key=settings.groq_api_key,
        model=settings.groq_model,
        temperature=temperature,
    )
