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

def signup_user(
        name: str,
        email: str,
        phone: str,
        password: str
) -> LoginResponse:
    # Check if user exists
    existing = supabase.table("users").select("*").eq("email", email).limit(1).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    from core.security import hash_password
    import uuid

    user_id = str(uuid.uuid4())
    hashed_password = hash_password(password)

    new_user = {
        "id": user_id,
        "name": name,
        "email": email,
        "phone": phone,
        "password": hashed_password,
        "role": "student"
    }

    # Insert user
    supabase.table("users").insert(new_user).execute()

    # Generate token
    access_token = create_access_token(
        {
            "user_id": user_id,
            "email": email,
            "role": "student",
        }
    )

    return LoginResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            name=name,
            email=email,
            role="student"
        )
    )