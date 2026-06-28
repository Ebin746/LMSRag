# app/api/chat.py

from fastapi import APIRouter, HTTPException

from models.schemas import QuestionRequest
from service.rag_service import ask_rag


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post("/")
async def chat(
    request: QuestionRequest
):
    """
    Ask questions to the RAG system.
    """

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    try:

        result = ask_rag(question)

        return {
            "success": True,
            "answer": result["answer"],
            "sources": result["sources"]
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )