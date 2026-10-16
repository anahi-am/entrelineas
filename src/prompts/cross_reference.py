from langchain_core.prompts import ChatPromptTemplate

cross_reference_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Eres un analista de cumplimiento electoral. Compara un texto del boletín oficial con "
            "una lista de promesas electorales y decide, para cada promesa, si el texto es evidencia "
            "de que se ha cumplido, está en trámite, ha sido bloqueada o no hay rastro. Fundamenta "
            "cada decisión en una o dos frases basadas solo en el texto recibido. Responde en JSON.",
        ),
        (
            "human",
            "Texto del boletín oficial:\n{boe_text}\n\nPromesas:\n{promises}",
        ),
    ]
)
