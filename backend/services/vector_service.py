# services/vector_service.py
#
# Abstraction layer for all vector store operations.
# Currently backed by ChromaDB.  To swap to Qdrant / Pinecone later:
#   1. Create a new client module in database/
#   2. Re-implement the three public functions below
#   3. Nothing else in the codebase needs to change.

from typing import Optional
from uuid import uuid4
from database.chroma_client import get_collection


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _safe_meta(value: Optional[str]) -> str:

    return value if value is not None else ""


def _chroma_to_chunk(doc: str, meta: dict, distance: float) -> dict:

    return {
        "content":     doc,
        "filename":    meta.get("filename", ""),
        "page":        int(meta.get("page", 0)),
        "chunk_index": int(meta.get("chunk_index", 0)),
        "document_id": meta.get("document_id", ""),
        "course_id":   meta.get("course_id", "") or None,
        "module_id":   meta.get("module_id", "") or None,
        "batch_id":    meta.get("batch_id", "") or None,
        # ChromaDB cosine distance: 0 = identical, 2 = opposite.
        # Convert to a similarity score ∈ [0, 1].
        "score":       round(1 - distance / 2, 4),
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------
def add_chunks(
    chunks: list,
    embeddings: list,
    document_id: str,
    filename: str,
    course_id: Optional[str] = None,
    module_id: Optional[str] = None,
    batch_id: Optional[str] = None,
    visibility: str = "public",
    teacher_id: Optional[str] = None,
    uploaded_by: Optional[str] = None,
) -> int:

    collection = get_collection()

    ids = []
    documents = []
    metadatas = []
    embeds = []

    for chunk, embedding in zip(chunks, embeddings):

        chunk_id = str(uuid4())

        ids.append(chunk_id)

        documents.append(chunk["content"])

        embeds.append(embedding)

        metadatas.append(
            {
                "document_id": str(document_id),

                "filename": filename,

                "page": int(chunk["page"]),

                "chunk_index": int(chunk["chunk_index"]),

                "visibility": visibility,

                "course_id": _safe_meta(course_id),

                "module_id": _safe_meta(module_id),

                "batch_id": _safe_meta(batch_id),

                "teacher_id": _safe_meta(teacher_id),

                "uploaded_by": _safe_meta(uploaded_by),
            }
        )

    collection.upsert(
        ids=ids,
        documents=documents,
        embeddings=embeds,
        metadatas=metadatas,
    )

    return len(ids)

def query(
    query_embedding: list,
    top_k: int = 5,
    where_filter: Optional[dict] = None,
) -> list:

    collection = get_collection()

    kwargs: dict = {
        "query_embeddings": [query_embedding],
        "n_results":        min(top_k, max(collection.count(), 1)),
        "include":          ["documents", "metadatas", "distances"],
    }

    if where_filter:
        kwargs["where"] = where_filter

    results = collection.query(**kwargs)

    chunks = []
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for doc, meta, dist in zip(documents, metadatas, distances):
        chunks.append(_chroma_to_chunk(doc, meta, dist))

    return chunks


def delete_by_document_id(document_id: str) -> None:

    collection = get_collection()
    collection.delete(where={"document_id": str(document_id)})
