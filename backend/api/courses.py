from fastapi import APIRouter, Depends

from database.supabase_client import supabase
from core.dependencies import require_admin, require_student

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

@router.get("/enrolled")
def get_enrolled_courses(
    current_user: dict = Depends(require_student),
):
    """
    Return enrolled courses for the current student.
    """

    response = (
        supabase
        .table("enrollments")
        .select("course_id, courses(id, title)")
        .eq("student_id", current_user["id"])
        .execute()
    )

    if not response.data:
        return []

    return [row["courses"] for row in response.data]