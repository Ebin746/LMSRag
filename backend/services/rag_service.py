# app/services/rag_service.py

from langchain_google_genai import ChatGoogleGenerativeAI

from core.config import settings
from database.supabase_client import supabase

from services.embedding_service import embed_text
from services.prompt_service import build_prompt


llm = ChatGoogleGenerativeAI(
    model=settings.CHAT_MODEL,
    temperature=0,
)


def retrieve_documents(question: str):
    """
    Retrieve relevant chunks using pgvector.
    """

    query_embedding = embed_text(question)

    response = supabase.rpc(
        "match_documents",
        {
            "query_embedding": query_embedding,
            "match_count": settings.TOP_K,
        },
    ).execute()

    return response.data


def generate_answer(
    question: str,
    retrieved_chunks: list[dict]
) -> str:
    """
    Generate answer from retrieved chunks.
    """

    prompt = build_prompt(
        question,
        retrieved_chunks,
    )

    response = llm.invoke(prompt)

    if isinstance(response.content, str):
        return response.content

    return response.content[0]["text"]


def extract_sources(
    retrieved_chunks: list[dict]
):
    """
    Remove duplicate citations.
    """

    unique = set()

    sources = []

    for chunk in retrieved_chunks:

        key = (
            chunk["filename"],
            chunk["page"],
        )

        if key in unique:
            continue

        unique.add(key)

        sources.append(
            {
                "filename": chunk["filename"],
                "page": chunk["page"],
                "chunk": chunk["chunk_index"],
            }
        )

    return sources


def ask_rag(question: str):
    """
    Complete RAG pipeline.

    Question
        ↓
    Embed Query
        ↓
    Vector Search
        ↓
    Prompt
        ↓
    Gemini
        ↓
    Sources
    """

    retrieved_chunks = retrieve_documents(question)

    answer = generate_answer(
        question,
        retrieved_chunks,
    )

    sources = extract_sources(
        retrieved_chunks,
    )

    return {
        "answer": answer,
        "sources": sources,
    }