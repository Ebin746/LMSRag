from fastapi import APIRouter, Depends

from database.supabase_client import supabase
from core.dependencies import require_admin

router = APIRouter(
    prefix="/courses",
    tags=["Courses"],
)


@router.get("")
def get_courses(
    current_user: dict = Depends(require_admin),
):
    """
    Return all available courses.
    """

    response = (
        supabase
        .table("courses")
        .select("id,title")
        .order("title")
        .execute()
    )

    return response.data