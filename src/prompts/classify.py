from langchain_core.prompts import ChatPromptTemplate

from db.models import MVP_TOPICS

classify_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Eres un clasificador de contenido legislativo para el MVP de vivienda. Asigna "
            f"el tema solo de esta lista fija: {', '.join(MVP_TOPICS)}. "
            "Elige solo temas de la lista y responde en JSON.",
        ),
        (
            "human",
            "Título: {title}\n\nTexto:\n{text}",
        ),
    ]
)
