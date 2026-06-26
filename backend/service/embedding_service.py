# app/services/embedding_service.py

from langchain_google_genai import GoogleGenerativeAIEmbeddings

from core.config import settings


embedding_model = GoogleGenerativeAIEmbeddings(
    model=settings.EMBEDDING_MODEL,
    output_dimensionality=settings.EMBEDDING_DIMENSION,
)

def embed_text(text: str) -> list[float]:
    return embedding_model.embed_query(text)

def embed_documents(texts: list[str]) -> list[list[float]]:
    return embedding_model.embed_documents(texts)