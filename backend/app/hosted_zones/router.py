from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.hosted_zones.schemas import (
    CreateHostedZoneRequest,
    UpdateHostedZoneRequest,
)
from app.hosted_zones.service import (
    list_hosted_zones,
    create_hosted_zone,
    get_hosted_zone,
    update_hosted_zone,
    delete_hosted_zone,
)

router = APIRouter(prefix="/api/hosted-zones", tags=["hosted-zones"])


@router.get("")
def list_zones(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(""),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = list_hosted_zones(
        db, user,
        page=page, limit=limit,
        search=search, sort_by=sort_by, sort_order=sort_order,
    )
    return {"success": True, **result}


@router.post("", status_code=201)
def create_zone(
    body: CreateHostedZoneRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        zone = create_hosted_zone(db, user, body.domain_name, body.type, body.description)
        return {"success": True, "data": zone, "message": "Hosted zone created successfully"}
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.get("/{zone_id}")
def get_zone(
    zone_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        zone = get_hosted_zone(db, zone_id)
        return {"success": True, "data": zone}
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{zone_id}")
def update_zone(
    zone_id: str,
    body: UpdateHostedZoneRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        zone = update_hosted_zone(db, zone_id, body.domain_name, body.description)
        return {"success": True, "data": zone, "message": "Hosted zone updated successfully"}
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.delete("/{zone_id}", status_code=204)
def delete_zone(
    zone_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        delete_hosted_zone(db, zone_id)
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))