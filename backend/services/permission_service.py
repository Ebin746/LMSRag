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

def build_permission_filter(current_user):

    if current_user is None:

        return {
            "visibility": "public"
        }

    role = current_user["role"]
    user_id = current_user["id"]

    # -----------------------------------------------------
    # ADMIN
    # -----------------------------------------------------

    if role == "admin":
        return None

    # -----------------------------------------------------
    # STUDENT
    # -----------------------------------------------------

    if role == "student":

        course_ids = get_student_course_ids(user_id)

        print("Student Courses:", course_ids)

        filters = [
            {
                "visibility": "public"
            }
        ]

        for course in course_ids:

            filters.append(
                {
                    "$and": [
                        {
                            "visibility": "course"
                        },
                        {
                            "course_id": course
                        }
                    ]
                }
            )

        return {
            "$or": filters
        }

    # -----------------------------------------------------
    # TEACHER
    # -----------------------------------------------------

    if role == "teacher":

        course_ids = get_teacher_course_ids(user_id)

        print("Teacher Courses:", course_ids)

        filters = [

            {
                "visibility": "public"
            },

            {
                "visibility": "teacher"
            }

        ]

        for course in course_ids:

            filters.append(

                {
                    "$and": [

                        {
                            "visibility": "course"
                        },

                        {
                            "course_id": course
                        }

                    ]
                }

            )

        return {

            "$or": filters

        }

    # -----------------------------------------------------
    # Unknown Role
    # -----------------------------------------------------

    return {
        "visibility": "public"
    }