# services/rag_service.py

from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from services.permission_service import build_permission_filter
from core.config import settings
from services.embedding_service import embed_text
from services.prompt_service import build_prompt
from services.vector_service import query as vector_query


llm = ChatGoogleGenerativeAI(
    model=settings.CHAT_MODEL,
    temperature=0.4,
)


def retrieve_documents(
    question: str,
    current_user=dict
) -> list:
    query_embedding = embed_text(question)

    # Build metadata filter for ChromaDB (only applied when provided)
    where_filter=build_permission_filter(current_user)
    return vector_query(
        query_embedding=query_embedding,
        top_k=settings.TOP_K,
        where_filter=where_filter
    )
    

def generate_answer(
    question: str,
    retrieved_chunks: list[dict],
) -> str:
    """
    Generate answer from retrieved chunks using Gemini.
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
    retrieved_chunks: list[dict],
) -> list[dict]:
    """
    Deduplicate citations from retrieved chunks.
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
                "filename":    chunk["filename"],
                "page":        chunk["page"],
                "chunk":       chunk["chunk_index"],
                "score":       chunk.get("score"),
                "document_id": chunk.get("document_id"),
            }
        )

    return sources



def ask_rag(
    question: str,
    current_user: dict,
) -> dict:
    retrieved_chunks = retrieve_documents(
        question=question,
        current_user=current_user,
    )

    print("=" * 60)
    print("Retrieved Chunks")

    for chunk in retrieved_chunks:
        print(
            f"[{chunk['score']:.3f}] "
            f"{chunk['filename']} "
            f"(page {chunk['page']})"
        )

    print("=" * 60)

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