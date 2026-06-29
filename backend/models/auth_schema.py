# app/models/auth_schema.py

from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str


class LoginRequest(BaseModel):

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """
    Basic user information returned after authentication.
    """

    id: str
    name: str
    email: EmailStr
    role: str


class LoginResponse(BaseModel):
    """
    Response returned after successful login.
    """

    access_token: str
    token_type: str = "Bearer"
    user: UserResponse