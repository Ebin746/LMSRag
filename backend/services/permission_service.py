from database.supabase_client import supabase


# ---------------------------------------------------------
# Student Permissions
# ---------------------------------------------------------

def get_student_course_ids(student_id: str) -> list[str]:
    """
    Returns all course_ids the student is enrolled in.
    """

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

def get_teacher_course_ids(teacher_id: str) -> list[str]:
    """
    Returns all course_ids assigned to the teacher.
    """

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


def build_permission_filter(current_user:dict):
    if current_user is None:
        return {
            "visibility": "public"
        }
    role=current_user["role"]
    user_id=current_user["id"]


    if role=="admin":
        return None
    
    if role=="student":
        course_ids=get_student_course_ids(user_id)

        if not course_ids:
            return{
                "visibility":"public"
            }
        
        return {
            "$or":[
                {
                    "visibility":"public"
                },
                {
                    "$and":[
                        {
                            "visibility":"course"
                        },
                        {
                             "course_id":{
                                 "$in":course_ids
                             }
                        }
                    ]
                }
            ]

        }
        
    if role=="teacher":
        course_ids=get_teacher_course_ids(user_id)
        if not course_ids:
            return {
                "$or":[
                    {
                        "visibility":"public"
                    },{
                        "visibility":"teacher"
                    },
                    {
                        "$and":[
                            {
                                "visibility":"course"
                            },
                            {
                                "course_id":{
                                    "$in":course_ids
                                }
                            }
                        ]
                    }
                ]
            }
   

    
