# app/main.py

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from core.config import settings

from api.upload import router as upload_router
from api.chat import router as chat_router


app = FastAPI(
    title="LMS RAG API",
    description="Production Ready RAG Backend",
    version="1.0.0"
)


# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Routers
# -----------------------------

app.include_router(upload_router)

app.include_router(chat_router)


# -----------------------------
# Health Check
# -----------------------------

@app.get("/")
async def home():

    return {
        "status": "running",
        "message": "LMS RAG Backend",
        "version": "1.0.0"
    }


@app.get("/health")
async def health():

    return {
        "status": "healthy"
    }