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
from database.supabase_client import supabase


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
    print("=" * 80)
    print("CHROMA FILTER")
    print(kwargs.get("where"))
    print("=" * 80)
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

def get_metadata_by_document_id(document_id: str) -> list:
    """
    Retrieve metadata for all chunks of a specific document directly from ChromaDB.
    """
    collection = get_collection()
    results = collection.get(
        where={"document_id": str(document_id)},
        include=["metadatas"]
    )
    
    # Return the list of metadata dictionaries
    return results.get("metadatas", [])

def get_all_document_metadata() -> list:
    """
    Retrieve distinct document metadata from ChromaDB and enrich with titles from Supabase.
    Groups chunk metadata by document_id.
    """
    collection = get_collection()
    results = collection.get(include=["metadatas"])
    
    metadatas = results.get("metadatas", [])
    
    # Group by document_id to return unique documents rather than every chunk
    documents = {}
    course_ids = set()
    module_ids = set()

    for meta in metadatas:
        doc_id = meta.get("document_id")
        if not doc_id:
            continue
            
        c_id = meta.get("course_id", "")
        m_id = meta.get("module_id", "")
        
        if c_id:
            course_ids.add(c_id)
        if m_id:
            module_ids.add(m_id)
        
        if doc_id not in documents:
            documents[doc_id] = {
                "document_id": doc_id,
                "filename": meta.get("filename", "Unknown"),
                "visibility": meta.get("visibility", "public"),
                "course_id": c_id,
                "module_id": m_id,
                "course_title": c_id,  # Default to ID, replace later
                "module_title": m_id,  # Default to ID, replace later
                "uploaded_by": meta.get("uploaded_by", ""),
                "chunks": 1,
                "chroma_metadata": [meta]
            }
        else:
            documents[doc_id]["chunks"] += 1
            if len(documents[doc_id]["chroma_metadata"]) < 3:
                documents[doc_id]["chroma_metadata"].append(meta)
                
    # Fetch course titles from Supabase
    course_map = {}
    if course_ids:
        try:
            course_res = supabase.table("courses").select("id,title").in_("id", list(course_ids)).execute()
            for c in course_res.data:
                course_map[c["id"]] = c["title"]
        except Exception as e:
            print("Error fetching courses:", e)

    # Fetch module titles from Supabase
    module_map = {}
    if module_ids:
        try:
            module_res = supabase.table("modules").select("id,title").in_("id", list(module_ids)).execute()
            for m in module_res.data:
                module_map[m["id"]] = m["title"]
        except Exception as e:
            print("Error fetching modules:", e)

    # Enrich documents with titles
    docs_list = list(documents.values())
    for doc in docs_list:
        if doc["course_id"] in course_map:
            doc["course_title"] = course_map[doc["course_id"]]
        if doc["module_id"] in module_map:
            doc["module_title"] = module_map[doc["module_id"]]

    return docs_list
