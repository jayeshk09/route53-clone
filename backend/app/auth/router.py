from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.schemas import LoginRequest, RegisterRequest, UserResponse, SessionResponse
from app.auth.service import (
    create_user, get_user_by_email, verify_password,
    create_session, delete_session, verify_session, get_user_by_id
)
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register")
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, body.email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = create_user(db, body.username, body.email, body.password)
    return {
        "success": True,
        "data": {"id": user.id, "email": user.email, "username": user.username},
        "message": "User registered successfully",
    }


@router.post("/login")
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = get_user_by_email(db, body.email)
    if not user:
        raise HTTPException(status_code=401, detail="No user found with this email")

    if not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")

    session = create_session(db, user.id)

    response.set_cookie(
        key="session_token",
        value=session.token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=86400,
        path="/",
    )

    return {
        "success": True,
        "data": {
            "user_id": user.id,
            "email": user.email,
            "username": user.username,
            "token": session.token,
        },
        "message": "Login successful",
    }


@router.post("/logout")
def logout(response: Response, db: Session = Depends(get_db), token: str | None = None):
    if token:
        delete_session(db, token)
    response.delete_cookie(key="session_token")
    return {"success": True, "message": "Logged out successfully"}


@router.get("/session")
def get_session(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return {
        "success": True,
        "data": {
            "user_id": user.id,
            "email": user.email,
            "username": user.username,
            "is_authenticated": True,
        },
    }