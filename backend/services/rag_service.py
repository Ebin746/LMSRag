# services/rag_service.py

from typing import Optional
from services.permission_service import build_permission_filter
from core.config import settings
from services.embedding_service import embed_text
from services.prompt_service import build_prompt
from services.vector_service import query as vector_query
from services.llm_service import llm

def retrieve_documents(
    question: str,
    current_user=dict
) -> list:
    query_embedding = embed_text(question)

    # Build metadata filter for ChromaDB (only applied when provided)
    where_filter=build_permission_filter(current_user)
    print("filer:",where_filter)
    return vector_query(
        query_embedding=query_embedding,
        top_k=settings.TOP_K,
        where_filter=where_filter
    )
    

def generate_answer(
    question: str,
    retrieved_chunks: list[dict],
    history: list[dict] = None
) -> str:
    """
    Generate answer from retrieved chunks using Gemini.
    """

    prompt = build_prompt(
        question,
        retrieved_chunks,
        history
    )

    response = llm.invoke(prompt)
    print(response)
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


from services.prompt_service import build_standalone_query_prompt

def ask_rag(
    question: str,
    current_user: dict,
    history: list[dict] = None
) -> dict:
    
    standalone_query = question
    
    if history and len(history) > 0:
        rewrite_prompt = build_standalone_query_prompt(question, history)
        rewrite_response = llm.invoke(rewrite_prompt)
        
        if isinstance(rewrite_response.content, str):
            standalone_query = rewrite_response.content.strip()
        else:
            standalone_query = rewrite_response.content[0]["text"].strip()
            
        print(f"Original Query: {question}")
        print(f"Standalone Query: {standalone_query}")

    retrieved_chunks = retrieve_documents(
        question=standalone_query,
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
        history
    )

    sources = extract_sources(
        retrieved_chunks,
    )

    return {
        "answer": answer,
        "sources": sources,
    }