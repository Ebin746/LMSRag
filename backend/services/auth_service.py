# app/services/auth_service.py

from fastapi import HTTPException
from database.supabase_client import supabase

from core.security import(
    verify_password,
    create_access_token
)
from models.auth_schema import (
    LoginResponse,
    UserResponse
)

def login_user(
        email:str,
        password:str
)->LoginResponse:
    response=(
        supabase.table("users")
        .select("*")
        .eq("email",email)
        .limit(1)
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    user=response.data[0]

    if not verify_password(
        password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="invalid email or password"
        )
    

    access_toke=create_access_token(
        {
            "user_id":user["id"],
            "email":user["email"],
            "role":user["role"],
        }
    )


    return LoginResponse(
        access_token=access_toke,
        user=UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            role=user["role"]
        )
    )