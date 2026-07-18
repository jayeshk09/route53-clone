import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.sqlite import INTEGER
from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


def utcnow():
    return datetime.utcnow()


class TimestampMixin:
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)