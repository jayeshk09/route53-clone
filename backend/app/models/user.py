from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.dialects.sqlite import INTEGER
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin, utcnow


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(INTEGER(), primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    hosted_zones = relationship("HostedZone", back_populates="user", cascade="all, delete-orphan", lazy="dynamic")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")