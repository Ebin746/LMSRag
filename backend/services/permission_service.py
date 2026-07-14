from database.supabase_client import supabase


# ---------------------------------------------------------
# Student Permissions
# ---------------------------------------------------------

def get_student_course_ids(student_id: str) -> list[str]:

    response = (
        supabase
        .table("enrollments")
        .select("course_id")
        .eq("student_id", student_id)
        .execute()
    )

    if not response.data:
        return []

    return [row["course_id"] for row in response.data]


# ---------------------------------------------------------
# Teacher Permissions
# ---------------------------------------------------------

def get_teacher_course_ids(teacher_id: str) -> list[str]:

    response = (
        supabase
        .table("teacher_assignments")
        .select("course_id")
        .eq("teacher_id", teacher_id)
        .execute()
    )

    if not response.data:
        return []

    return [row["course_id"] for row in response.data]


# ---------------------------------------------------------
# Permission Filter
# ---------------------------------------------------------

def build_permission_filter(current_user, course_id: str = None):
    if current_user is None:
        if course_id:
            return {"$and": [{"visibility": "public"}, {"course_id": course_id}]}
        return {"visibility": "public"}

    role = current_user["role"]
    user_id = current_user["id"]

    if role == "admin":
        if course_id:
            return {"course_id": course_id}
        return None

    if role == "student":
        course_ids = get_student_course_ids(user_id)
        
        if course_id:
            if course_id in course_ids:
                return {"course_id": course_id}
            else:
                return {"course_id": "invalid_access"}

        clauses = [{"visibility": "public"}]
        if course_ids:
            clauses.append({
                "$and": [
                    {"visibility": "course"},
                    {"course_id": {"$in": course_ids}}
                ]
            })
        return clauses[0] if len(clauses) == 1 else {"$or": clauses}

    if role == "teacher":
        course_ids = get_teacher_course_ids(user_id)
        
        if course_id:
            if course_id in course_ids:
                return {"course_id": course_id}
            else:
                return {"course_id": "invalid_access"}

        clauses = [{"visibility": "public"}, {"visibility": "teacher"}]
        if course_ids:
            clauses.append({
                "$and": [
                    {"visibility": "course"},
                    {"course_id": {"$in": course_ids}}
                ]
            })
        return {"$or": clauses}

    if course_id:
        return {"$and": [{"visibility": "public"}, {"course_id": course_id}]}
    return {"visibility": "public"}