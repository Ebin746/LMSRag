from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
)

from models.schemas import QuestionRequest
from fastapi.security import HTTPBearer
from services.rag_service import ask_rag

from core.dependencies import require_authenticated_user


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("")
async def chat(
    request: QuestionRequest,
    current_user: dict = Depends(require_authenticated_user),
):
    """
    Ask questions to the LMS RAG.
    Authentication required.
    """
    question = request.question.strip()
    print("question",question)
    if not question:

        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    try:

        result = ask_rag(
            question=question,

            # These are placeholders for now.
            # We'll fetch the actual values from
            # enrollments later.
            course_id=None,
            module_id=None,
            batch_id=None,
        )

        return {
            "success": True,
            "user": {
                "id": current_user["id"],
                "role": current_user["role"],
                "name": current_user["name"],
            },
            "answer": result["answer"],
            "sources": result["sources"],
        }

    except Exception as e:
        print(e.__cause__)
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )