from math import ceil

from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.models.dns_record import DNSRecord
from app.models.hosted_zone import HostedZone


def list_dns_records(
    db: Session,
    zone_id: str,
    page: int = 1,
    limit: int = 10,
    search: str = "",
    record_type: str = "",
    sort_by: str = "name",
    sort_order: str = "asc",
):
    query = db.query(DNSRecord).filter(DNSRecord.hosted_zone_id == zone_id)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            DNSRecord.name.ilike(search_term) | DNSRecord.value.ilike(search_term)
        )

    if record_type:
        query = query.filter(DNSRecord.type == record_type)

    sortable = {
        "name": DNSRecord.name,
        "type": DNSRecord.type,
        "ttl": DNSRecord.ttl,
        "created_at": DNSRecord.created_at,
    }
    order_col = sortable.get(sort_by, DNSRecord.name)
    query = query.order_by(desc(order_col) if sort_order == "desc" else asc(order_col))

    total = query.count()
    pages = max(1, ceil(total / limit))
    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()

    def format_record(record: DNSRecord):
        return {
            "id": record.id,
            "hosted_zone_id": record.hosted_zone_id,
            "name": record.name,
            "type": record.type,
            "value": record.value,
            "ttl": record.ttl,
            "routing_policy": record.routing_policy,
            "weight": record.weight,
            "region": record.region,
            "is_alias": record.is_alias,
            "created_at": record.created_at.isoformat() if record.created_at else "",
            "updated_at": record.updated_at.isoformat() if record.updated_at else "",
        }

    return {
        "data": [format_record(r) for r in items],
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages,
        },
    }


def create_dns_record(
    db: Session,
    zone_id: str,
    name: str,
    record_type: str,
    value: str,
    ttl: int,
    routing_policy: str = "Simple",
):
    zone = db.query(HostedZone).filter(HostedZone.id == zone_id, HostedZone.is_active == True).first()
    if not zone:
        raise LookupError("Hosted zone not found")

    existing = db.query(DNSRecord).filter(
        DNSRecord.hosted_zone_id == zone_id,
        DNSRecord.name == name,
        DNSRecord.type == record_type,
    ).first()

    if existing:
        raise ValueError(f"Record '{name}' of type '{record_type}' already exists")

    record = DNSRecord(
        hosted_zone_id=zone_id,
        name=name,
        type=record_type,
        value=value,
        ttl=ttl,
        routing_policy=routing_policy,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "hosted_zone_id": record.hosted_zone_id,
        "name": record.name,
        "type": record.type,
        "value": record.value,
        "ttl": record.ttl,
        "routing_policy": record.routing_policy,
        "created_at": record.created_at.isoformat() if record.created_at else "",
        "updated_at": record.updated_at.isoformat() if record.updated_at else "",
    }


def get_dns_record(db: Session, record_id: str):
    record = db.query(DNSRecord).filter(DNSRecord.id == record_id).first()

    if not record:
        raise LookupError("DNS record not found")

    return {
        "id": record.id,
        "hosted_zone_id": record.hosted_zone_id,
        "name": record.name,
        "type": record.type,
        "value": record.value,
        "ttl": record.ttl,
        "routing_policy": record.routing_policy,
        "weight": record.weight,
        "region": record.region,
        "is_alias": record.is_alias,
        "created_at": record.created_at.isoformat() if record.created_at else "",
        "updated_at": record.updated_at.isoformat() if record.updated_at else "",
    }


def update_dns_record(
    db: Session,
    record_id: str,
    value: str | None = None,
    ttl: int | None = None,
    routing_policy: str | None = None,
):
    record = db.query(DNSRecord).filter(DNSRecord.id == record_id).first()

    if not record:
        raise LookupError("DNS record not found")

    if value is not None:
        record.value = value
    if ttl is not None:
        record.ttl = ttl
    if routing_policy is not None:
        record.routing_policy = routing_policy

    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "hosted_zone_id": record.hosted_zone_id,
        "name": record.name,
        "type": record.type,
        "value": record.value,
        "ttl": record.ttl,
        "routing_policy": record.routing_policy,
        "weight": record.weight,
        "region": record.region,
        "is_alias": record.is_alias,
        "created_at": record.created_at.isoformat() if record.created_at else "",
        "updated_at": record.updated_at.isoformat() if record.updated_at else "",
    }


def delete_dns_record(db: Session, record_id: str):
    record = db.query(DNSRecord).filter(DNSRecord.id == record_id).first()

    if not record:
        raise LookupError("DNS record not found")

    db.delete(record)
    db.commit()