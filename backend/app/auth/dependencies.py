from fastapi import Depends, HTTPException
from fastapi.security import APIKeyCookie

from app.database import get_db
from sqlalchemy.orm import Session

from app.auth.service import verify_session, get_user_by_id

cookie_scheme = APIKeyCookie(name="session_token", auto_error=False)


def get_current_user(
    token: str | None = Depends(cookie_scheme),
    db: Session = Depends(get_db),
):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = verify_session(db, token)
    if not session:
        raise HTTPException(status_code=401, detail="Session expired")

    user = get_user_by_id(db, session.user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    return user