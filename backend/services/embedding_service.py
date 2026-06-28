# app/services/embedding_service.py

from langchain_google_genai import GoogleGenerativeAIEmbeddings

from core.config import settings

print(settings.EMBEDDING_MODEL, settings.EMBEDDING_DIMENSION)

embedding_model = GoogleGenerativeAIEmbeddings(
    model=settings.EMBEDDING_MODEL,
    output_dimensionality=settings.EMBEDDING_DIMENSION,
)


def embed_text(text: str) -> list[float]:
    """
    Used for query embeddings (chat questions).
    """
    return embedding_model.embed_query(text)


def embed_documents(texts: list[str]) -> list[list[float]]:
    """
    Used for document chunk embeddings (upload).

    gemini-embedding-001 is an ASYMMETRIC model:
      - Documents must be embedded with RETRIEVAL_DOCUMENT task type (embed_documents)
      - Queries must be embedded with RETRIEVAL_QUERY task type (embed_query)
    Using embed_query for both gives ~0.065 cosine similarity → zero retrieval results.
    """
    return embedding_model.embed_documents(texts)