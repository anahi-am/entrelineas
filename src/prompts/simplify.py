from langchain_core.prompts import ChatPromptTemplate

simplify_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Eres un redactor de información pública. Recibe texto original de un boletín "
            "oficial y reescríbelo en español claro y llano, sin tecnicismos, para una persona "
            "sin conocimientos jurídicos. Máximo 150 palabras. Devuelve solo el texto reescrito, "
            "sin preámbulos ni comentarios.",
        ),
        (
            "human",
            "Título: {title}\n\nTexto original:\n{raw_text}",
        ),
    ]
)
