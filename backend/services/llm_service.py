from langchain_groq import ChatGroq

from core.config import settings


llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model=settings.CHAT_MODEL,
    temperature=0.4,
)