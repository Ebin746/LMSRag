from fastapi import APIRouter, Depends

from models.schemas import QuestionRequest

from core.dependencies import get_optional_user

from services.rag_service import ask_rag

router = APIRouter()


@router.post("/chat")
def chat(
    request: QuestionRequest,
    current_user=Depends(get_optional_user),
):

    return ask_rag(
        question=request.question,
        current_user=current_user,
    )