from langchain_core.prompts import ChatPromptTemplate

from db.models import TOPICS

classify_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Eres un clasificador de contenido legislativo. Asigna al menos un y como máximo "
            f"tres temas de esta lista fija: {', '.join(TOPICS)}. "
            "Elige solo temas de la lista y responde en JSON.",
        ),
        (
            "human",
            "Título: {title}\n\nTexto:\n{text}",
        ),
    ]
)
