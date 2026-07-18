from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.sqlite import INTEGER
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import utcnow


class Session(Base):
    __tablename__ = "sessions"

    id = Column(INTEGER(), primary_key=True, autoincrement=True)
    user_id = Column(INTEGER(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=utcnow)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="sessions")