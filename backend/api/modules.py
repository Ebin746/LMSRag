from fastapi import APIRouter, Depends

from database.supabase_client import supabase
from core.dependencies import require_admin

router = APIRouter(
    prefix="/modules",
    tags=["Modules"],
)


@router.get("/{course_id}")
def get_modules(
    course_id: str,
    current_user: dict = Depends(require_admin),
):
    """
    Return all modules belonging to a course.
    """

    response = (
        supabase
        .table("modules")
        .select("id,title,course_id")
        .eq("course_id", course_id)
        .order("module_order")
        .execute()
    )

    return response.data