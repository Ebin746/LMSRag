import os
import sys

# --------------------------------------------------
# Add backend folder to Python path
# --------------------------------------------------

BACKEND_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

sys.path.insert(0, BACKEND_DIR)

# --------------------------------------------------
# Imports
# --------------------------------------------------

from database.supabase_client import supabase
from core.security import hash_password

# --------------------------------------------------
# Fetch all users
# --------------------------------------------------

response = (
    supabase
    .table("users")
    .select("*")
    .execute()
)

users = response.data

print(f"Found {len(users)} users\n")

# --------------------------------------------------
# Update passwords
# --------------------------------------------------

for user in users:

    role = user["role"]

    if role == "student":
        plain_password = "student123"

    elif role == "teacher":
        plain_password = "teacher123"

    elif role == "admin":
        plain_password = "admin123"

    else:
        continue

    hashed_password = hash_password(plain_password)

    (
        supabase
        .table("users")
        .update(
            {
                "password": hashed_password
            }
        )
        .eq("id", user["id"])
        .execute()
    )

    print(
        f"✓ Updated {user['email']} ({role})"
    )

print("\nAll passwords updated successfully.")