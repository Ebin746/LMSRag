# services/rag_service.py

from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI

from core.config import settings
from services.embedding_service import embed_text
from services.prompt_service import build_prompt
from services.vector_service import query as vector_query


llm = ChatGoogleGenerativeAI(
    model=settings.CHAT_MODEL,
    temperature=0,
)


def retrieve_documents(
    question: str,
    course_id: Optional[str] = None,
    module_id: Optional[str] = None,
    batch_id: Optional[str] = None,
) -> list:
    """
    Retrieve relevant chunks from ChromaDB using vector similarity.

    Optional LMS metadata filters narrow the search to a specific
    course / module / batch so students only see their own material.
    """

    query_embedding = embed_text(question)

    # Build metadata filter for ChromaDB (only applied when provided)
    where_filter: Optional[dict] = None

    conditions = []
    if course_id:
        conditions.append({"course_id": course_id})
    if module_id:
        conditions.append({"module_id": module_id})
    if batch_id:
        conditions.append({"batch_id": batch_id})

    if len(conditions) == 1:
        where_filter = conditions[0]
    elif len(conditions) > 1:
        where_filter = {"$and": conditions}

    return vector_query(
        query_embedding=query_embedding,
        top_k=settings.TOP_K,
        where_filter=where_filter,
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
    course_id: Optional[str] = None,
    module_id: Optional[str] = None,
    batch_id: Optional[str] = None,
) -> dict:
    """
    Complete RAG pipeline.

    Question
        ↓
    Embed Query  (Gemini RETRIEVAL_QUERY)
        ↓
    ChromaDB similarity search  (optionally filtered by LMS metadata)
        ↓
    Build Prompt
        ↓
    Gemini LLM
        ↓
    Sources + Answer
    """

    retrieved_chunks = retrieve_documents(
        question,
        course_id=course_id,
        module_id=module_id,
        batch_id=batch_id,
    )

    print("=" * 50)
    print("Retrieved Chunks")
    for c in retrieved_chunks:
        print(f"  [{c['score']:.3f}] {c['filename']} p{c['page']} chunk{c['chunk_index']}")
    print("=" * 50)

    answer = generate_answer(question, retrieved_chunks)

    sources = extract_sources(retrieved_chunks)

    return {
        "answer":  answer,
        "sources": sources,
    }