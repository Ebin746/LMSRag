# app/api/chat.py

from fastapi import APIRouter, HTTPException

from models.schemas import QuestionRequest
from services.rag_service import ask_rag


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
        print("question",question)
        print("type",type(question))
        result = ask_rag(question)
        print(result["answer"])
        return {
            "success": True,
            "answer": result["answer"],
            "sources": result["sources"]
        }

    except Exception as e:

        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))