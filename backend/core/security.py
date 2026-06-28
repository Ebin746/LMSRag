# app/core/security.py

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from core.config import settings


# ------------------------------------------------------------------
# Password Hashing Configuration
# ------------------------------------------------------------------

pwd_context = CryptContext(
    schemes=["bcrypt"],
   deprecated="auto"
)


# ------------------------------------------------------------------
# Password Functions
# ------------------------------------------------------------------

def hash_password(password: str) -> str:
    """
    Hash a plain-text password before storing it in the database.
    """
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify whether the given password matches
    the stored hashed password.
    """
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


# ------------------------------------------------------------------
# JWT Functions
# ------------------------------------------------------------------

def create_access_token(
    data: dict[str, Any],
) -> str:
    """
    Create a JWT access token.

    'data' should contain only safe information,
    e.g.:
        {
            "user_id": "...",
            "email": "...",
            "role": "student"
        }
    """

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update(
        {
            "exp": expire
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

    return encoded_jwt


def decode_access_token(
    token: str,
) -> dict:
    """
    Decode a JWT token.

    Raises JWTError if:
        - Token is invalid
        - Token expired
        - Signature mismatch
    """

    payload = jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )

    return payload