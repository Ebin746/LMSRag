# app/core/dependencies.py

from fastapi import (
    Depends,
    HTTPException,
    status,
)

from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)

from jose import JWTError

from core.security import decode_access_token
from database.supabase_client import supabase


# --------------------------------------------------------
# Bearer Token Scheme
# --------------------------------------------------------

security = HTTPBearer()


# --------------------------------------------------------
# Get Current User
# --------------------------------------------------------

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Extract the JWT token from the Authorization header,
    decode it, and return the authenticated user.
    """

    token = credentials.credentials

    try:

        payload = decode_access_token(token)

        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
            )

    except JWTError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )

    # ----------------------------------------------------
    # Fetch user from database
    # ----------------------------------------------------

    response = (
        supabase
        .table("users")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    if not response.data:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )

    return response.data[0]


# --------------------------------------------------------
# Role Guards
# --------------------------------------------------------

def require_student(
    current_user: dict = Depends(get_current_user),
):
    """
    Allow only students.
    """

    if current_user["role"] != "student":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required.",
        )

    return current_user


def require_teacher(
    current_user: dict = Depends(get_current_user),
):
    """
    Allow only teachers.
    """

    if current_user["role"] != "teacher":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher access required.",
        )

    return current_user


def require_admin(
    current_user: dict = Depends(get_current_user),
):
    """
    Allow only admins.
    """

    if current_user["role"] != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user


def require_teacher_or_admin(
    current_user: dict = Depends(get_current_user),
):
    """
    Allow teachers and admins.
    """

    if current_user["role"] not in [
        "teacher",
        "admin",
    ]:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher or Admin access required.",
        )

    return current_user


def require_authenticated_user(
    current_user: dict = Depends(get_current_user),
):
    """
    Any authenticated user.
    """

    return current_user