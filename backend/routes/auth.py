import sqlite3

from fastapi import APIRouter, HTTPException, status

from backend.auth import create_access_token, hash_password, public_user, verify_password
from backend.database import create_user, get_user_by_email
from backend.schemas import SigninRequest, SignupRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
def signup(payload: SignupRequest):
    try:
        user = create_user(payload.name.strip(), payload.email.strip(), hash_password(payload.password))
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

    return {"token": create_access_token(user), "user": public_user(user)}


@router.post("/signin")
def signin(payload: SigninRequest):
    user = get_user_by_email(payload.email.strip())
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return {"token": create_access_token(user), "user": public_user(user)}
