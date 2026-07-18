from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    username: str


class SessionResponse(BaseModel):
    user_id: int
    email: str
    username: str
    is_authenticated: bool


class TokenResponse(BaseModel):
    user_id: int
    email: str
    username: str
    token: str