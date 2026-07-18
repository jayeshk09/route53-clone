from math import ceil

from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc

from app.models.hosted_zone import HostedZone
from app.models.dns_record import DNSRecord
from app.models.user import User


def list_hosted_zones(
    db: Session,
    user: User,
    page: int = 1,
    limit: int = 10,
    search: str = "",
    sort_by: str = "created_at",
    sort_order: str = "desc",
):
    query = db.query(HostedZone).filter(
        HostedZone.user_id == user.id,
        HostedZone.is_active == True,
    )

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            HostedZone.domain_name.ilike(search_term)
            | HostedZone.description.ilike(search_term)
        )

    sortable = {
        "domain_name": HostedZone.domain_name,
        "created_at": HostedZone.created_at,
    }
    order_col = sortable.get(sort_by, HostedZone.created_at)
    query = query.order_by(desc(order_col) if sort_order == "desc" else asc(order_col))

    total = query.count()
    pages = max(1, ceil(total / limit))
    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()

    def format_zone(zone: HostedZone):
        record_count = db.query(func.count(DNSRecord.id)).filter(
            DNSRecord.hosted_zone_id == zone.id
        ).scalar()

        return {
            "id": zone.id,
            "domain_name": zone.domain_name,
            "type": zone.type,
            "description": zone.description,
            "record_count": record_count,
            "created_by": zone.created_by,
            "created_at": zone.created_at.isoformat() if zone.created_at else "",
            "updated_at": zone.updated_at.isoformat() if zone.updated_at else "",
        }

    return {
        "data": [format_zone(z) for z in items],
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages,
        },
    }


def create_hosted_zone(db: Session, user: User, domain_name: str, zone_type: str, description: str | None):
    existing = db.query(HostedZone).filter(
        HostedZone.domain_name == domain_name,
        HostedZone.is_active == True,
    ).first()

    if existing:
        raise ValueError(f"Hosted zone '{domain_name}' already exists")

    zone = HostedZone(
        user_id=user.id,
        domain_name=domain_name,
        type=zone_type,
        description=description,
    )
    db.add(zone)
    db.commit()
    db.refresh(zone)

    return {
        "id": zone.id,
        "domain_name": zone.domain_name,
        "type": zone.type,
        "description": zone.description,
        "record_count": 0,
        "created_by": zone.created_by,
        "created_at": zone.created_at.isoformat() if zone.created_at else "",
        "updated_at": zone.updated_at.isoformat() if zone.updated_at else "",
    }


def get_hosted_zone(db: Session, zone_id: str):
    zone = db.query(HostedZone).filter(
        HostedZone.id == zone_id,
        HostedZone.is_active == True,
    ).first()

    if not zone:
        raise LookupError("Hosted zone not found")

    record_count = db.query(func.count(DNSRecord.id)).filter(
        DNSRecord.hosted_zone_id == zone.id
    ).scalar()

    return {
        "id": zone.id,
        "domain_name": zone.domain_name,
        "type": zone.type,
        "description": zone.description,
        "record_count": record_count,
        "created_by": zone.created_by,
        "created_at": zone.created_at.isoformat() if zone.created_at else "",
        "updated_at": zone.updated_at.isoformat() if zone.updated_at else "",
    }


def update_hosted_zone(db: Session, zone_id: str, domain_name: str | None = None, description: str | None = None):
    zone = db.query(HostedZone).filter(
        HostedZone.id == zone_id,
        HostedZone.is_active == True,
    ).first()

    if not zone:
        raise LookupError("Hosted zone not found")

    if domain_name is not None:
        existing = db.query(HostedZone).filter(
            HostedZone.domain_name == domain_name,
            HostedZone.id != zone_id,
            HostedZone.is_active == True,
        ).first()
        if existing:
            raise ValueError(f"Hosted zone '{domain_name}' already exists")
        zone.domain_name = domain_name

    if description is not None:
        zone.description = description

    db.commit()
    db.refresh(zone)

    record_count = db.query(func.count(DNSRecord.id)).filter(
        DNSRecord.hosted_zone_id == zone.id
    ).scalar()

    return {
        "id": zone.id,
        "domain_name": zone.domain_name,
        "type": zone.type,
        "description": zone.description,
        "record_count": record_count,
        "created_by": zone.created_by,
        "created_at": zone.created_at.isoformat() if zone.created_at else "",
        "updated_at": zone.updated_at.isoformat() if zone.updated_at else "",
    }


def delete_hosted_zone(db: Session, zone_id: str):
    zone = db.query(HostedZone).filter(
        HostedZone.id == zone_id,
        HostedZone.is_active == True,
    ).first()

    if not zone:
        raise LookupError("Hosted zone not found")

    db.delete(zone)
    db.commit()