# app/api/auth.py

from fastapi import APIRouter

from models.auth_schema import (
    LoginRequest,
    SignupRequest,
    LoginResponse,
)

from services.auth_service import login_user, signup_user


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

@router.post(
    "/signup",
    response_model=LoginResponse,
)
async def signup(
    request: SignupRequest,
):
    return signup_user(
        name=request.name,
        email=request.email,
        phone=request.phone,
        password=request.password,
    )