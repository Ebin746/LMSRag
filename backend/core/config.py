# app/core/config.py

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:

    # ----------------------------------------------------
    # Google Gemini
    # ----------------------------------------------------

    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

    CHAT_MODEL = os.getenv(
        "CHAT_MODEL",
        "gemini-3.5-flash"
    )

    EMBEDDING_MODEL = os.getenv(
        "EMBEDDING_MODEL",
        "gemini-embedding-2"
    )

    EMBEDDING_DIMENSION = int(
        os.getenv(
            "EMBEDDING_DIMENSION",
            768,
        )
    )
# ----------------------------------------------------
# Groq LLM
# ----------------------------------------------------

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    CHAT_MODEL = os.getenv(
    "CHAT_MODEL",
    "llama-3.3-70b-versatile"
    )
    # ----------------------------------------------------
    # JWT Authentication
    # ----------------------------------------------------

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    JWT_ALGORITHM = os.getenv(
        "JWT_ALGORITHM",
        "HS256"
    )

    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv(
            "ACCESS_TOKEN_EXPIRE_MINUTES",
            60,
        )
    )

    # ----------------------------------------------------
    # Supabase
    # ----------------------------------------------------

    SUPABASE_URL = os.getenv("SUPABASE_URL")

    SUPABASE_KEY = os.getenv("SUPABASE_KEY")

    # ----------------------------------------------------
    # ChromaDB
    # ----------------------------------------------------

    CHROMA_PERSIST_DIR = os.getenv(
        "CHROMA_PERSIST_DIR",
        "chroma_store"
    )

    CHROMA_COLLECTION_NAME = os.getenv(
        "CHROMA_COLLECTION_NAME",
        "lms_documents"
    )

    # ----------------------------------------------------
    # Upload
    # ----------------------------------------------------

    UPLOAD_DIR = os.getenv(
        "UPLOAD_DIR",
        "uploads"
    )

    MAX_FILE_SIZE = 20 * 1024 * 1024

    # ----------------------------------------------------
    # Chunking
    # ----------------------------------------------------

    CHUNK_SIZE = 800

    CHUNK_OVERLAP = 150

    # ----------------------------------------------------
    # Retrieval
    # ----------------------------------------------------

    TOP_K = 5

    # ----------------------------------------------------
    # CORS
    # ----------------------------------------------------

    ALLOWED_ORIGINS = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000",
    ).split(",")

    # ----------------------------------------------------
    # Validation
    # ----------------------------------------------------

    @staticmethod
    def validate():

        required = [

            "GOOGLE_API_KEY",
            "GROQ_API_KEY",
            "SUPABASE_URL",

            "SUPABASE_KEY",

            "JWT_SECRET_KEY",

        ]

        for key in required:

            if not os.getenv(key):

                raise Exception(
                    f"{key} is missing."
                )


settings = Settings()

settings.validate()