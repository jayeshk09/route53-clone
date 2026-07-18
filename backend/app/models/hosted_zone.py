from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin, generate_uuid


class HostedZone(Base, TimestampMixin):
    __tablename__ = "hosted_zones"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    domain_name = Column(String(255), unique=True, nullable=False, index=True)
    type = Column(String(10), default="Public")
    description = Column(String(500), nullable=True)
    created_by = Column(String(100), default="Route 53")
    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates="hosted_zones")
    dns_records = relationship("DNSRecord", back_populates="hosted_zone", cascade="all, delete-orphan", lazy="dynamic")