# database/chroma_client.py
#
# Singleton ChromaDB PersistentClient.
# All vector operations go through vector_service.py — this module only
# exposes the raw client and collection getter.

from typing import Optional

import chromadb
from chromadb.config import Settings as ChromaSettings

from core.config import settings

# ---------------------------------------------------------------------------
# Client (module-level singleton)
# ---------------------------------------------------------------------------

_client: Optional[chromadb.PersistentClient] = None


def get_chroma_client() -> chromadb.PersistentClient:
    """Return the module-level ChromaDB PersistentClient, creating it once."""
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIR,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return _client


# ---------------------------------------------------------------------------
# Collection getter
# ---------------------------------------------------------------------------

def get_collection() -> chromadb.Collection:
    """
    Return (or create) the LMS documents collection.
    Uses cosine distance — best suited for normalised Gemini embeddings.
    """
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=settings.CHROMA_COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )
