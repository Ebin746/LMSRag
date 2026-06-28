# app/api/auth.py

from fastapi import APIRouter

from models.auth_schema import (
    LoginRequest,
    LoginResponse,
)

from services.auth_service import login_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=LoginResponse,
)
async def login(
    request: LoginRequest,
):
    return login_user(
        email=request.email,
        password=request.password,
    )