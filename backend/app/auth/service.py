import hashlib
import secrets
from datetime import datetime, timedelta

import bcrypt
from sqlalchemy.orm import Session

from app.config import SESSION_TIMEOUT
from app.models.user import User
from app.models.session import Session as SessionModel


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_user(db: Session, username: str, email: str, password: str) -> User:
    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def create_session(db: Session, user_id: int) -> SessionModel:
    token = secrets.token_hex(32)
    expires_at = datetime.utcnow() + timedelta(seconds=SESSION_TIMEOUT)
    session = SessionModel(user_id=user_id, token=token, expires_at=expires_at)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def verify_session(db: Session, token: str) -> SessionModel | None:
    session = db.query(SessionModel).filter(SessionModel.token == token).first()
    if not session:
        return None
    if session.expires_at < datetime.utcnow():
        db.delete(session)
        db.commit()
        return None
    return session


def delete_session(db: Session, token: str) -> None:
    session = db.query(SessionModel).filter(SessionModel.token == token).first()
    if session:
        db.delete(session)
        db.commit()