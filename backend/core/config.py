
# app/core/config.py

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:

    # Google
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    CHAT_MODEL = os.getenv("CHAT_MODEL", "gemini-2.5-flash")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "gemini-embedding-001")
    EMBEDDING_DIMENSION = int(os.getenv("EMBEDDING_DIMENSION", 768))

    # Supabase
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")

    # Upload
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE = 20 * 1024 * 1024

    # Chunking
    CHUNK_SIZE = 800
    CHUNK_OVERLAP = 150

    # Retrieval
    TOP_K = 5

    # CORS
    ALLOWED_ORIGINS = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173"
    ).split(",")

    @staticmethod
    def validate():

        required = [
            "GOOGLE_API_KEY",
            "SUPABASE_URL",
            "SUPABASE_KEY"
        ]

        for key in required:
            if not os.getenv(key):
                raise Exception(f"{key} is missing.")


settings = Settings()
settings.validate()