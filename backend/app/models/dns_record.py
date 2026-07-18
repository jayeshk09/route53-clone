from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin, generate_uuid


class DNSRecord(Base, TimestampMixin):
    __tablename__ = "dns_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    hosted_zone_id = Column(String(36), ForeignKey("hosted_zones.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    type = Column(String(10), nullable=False, index=True)
    value = Column(String(4096), nullable=False)
    ttl = Column(Integer, default=300)
    routing_policy = Column(String(20), default="Simple")
    weight = Column(Integer, nullable=True)
    region = Column(String(50), nullable=True)
    is_alias = Column(Boolean, default=False)
    set_identifier = Column(String(255), nullable=True)

    hosted_zone = relationship("HostedZone", back_populates="dns_records")