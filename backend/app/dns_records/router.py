from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.dns_records.schemas import (
    CreateDNSRecordRequest,
    UpdateDNSRecordRequest,
)
from app.dns_records.service import (
    list_dns_records,
    create_dns_record,
    get_dns_record,
    update_dns_record,
    delete_dns_record,
)

router = APIRouter(prefix="/api/hosted-zones/{zone_id}/records", tags=["dns-records"])


@router.get("")
def list_records(
    zone_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(""),
    type: str = Query(""),
    sort_by: str = Query("name"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = list_dns_records(
        db, zone_id,
        page=page, limit=limit,
        search=search, record_type=type,
        sort_by=sort_by, sort_order=sort_order,
    )
    return {"success": True, **result}


@router.post("", status_code=201)
def create_record(
    zone_id: str,
    body: CreateDNSRecordRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        record = create_dns_record(
            db, zone_id,
            body.name, body.type, body.value, body.ttl, body.routing_policy,
        )
        return {"success": True, "data": record, "message": "DNS record created successfully"}
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.get("/{record_id}")
def get_record(
    zone_id: str,
    record_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        record = get_dns_record(db, record_id)
        return {"success": True, "data": record}
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{record_id}")
def update_record(
    zone_id: str,
    record_id: str,
    body: UpdateDNSRecordRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        record = update_dns_record(db, record_id, body.value, body.ttl, body.routing_policy)
        return {"success": True, "data": record, "message": "DNS record updated successfully"}
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{record_id}", status_code=204)
def delete_record(
    zone_id: str,
    record_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        delete_dns_record(db, record_id)
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))