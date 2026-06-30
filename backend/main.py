# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings

# Routers
from api.auth import router as auth_router
from api.upload import router as upload_router
from api.chat import router as chat_router
from api.courses import router as courses_router
from api.modules import router as modules_router


app = FastAPI(
    title="LMS RAG API",
    description="Production Ready Role-Based LMS RAG Backend",
    version="1.1.0",
)


# --------------------------------------------------------
# CORS
# --------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------------
# Register Routers
# --------------------------------------------------------

app.include_router(auth_router)

app.include_router(upload_router)

app.include_router(chat_router)

app.include_router(courses_router)

app.include_router(modules_router)

# --------------------------------------------------------
# Root
# --------------------------------------------------------

@app.get("/")
async def home():
    
    return {
        "status": "running",
        "project": "LMS Role-Based RAG",
        "version": "1.1.0",
    }


# --------------------------------------------------------
# Health Check
# --------------------------------------------------------

@app.get("/health")
async def health():

    return {
        "status": "healthy"
    }