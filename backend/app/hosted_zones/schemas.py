from pydantic import BaseModel, field_validator
import re


class CreateHostedZoneRequest(BaseModel):
    domain_name: str
    type: str = "Public"
    description: str | None = None

    @field_validator("domain_name")
    @classmethod
    def validate_domain(cls, v: str) -> str:
        v = v.strip().lower()
        if len(v) < 5:
            raise ValueError("Domain name must be at least 5 characters")
        if len(v) > 255:
            raise ValueError("Domain name must be 255 characters or less")
        pattern = r"^[a-z0-9]([a-z0-9-]*\.)*[a-z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Please enter a valid domain name")
        return v

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ("Public", "Private"):
            raise ValueError("Type must be 'Public' or 'Private'")
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str | None) -> str | None:
        if v and len(v) > 500:
            raise ValueError("Description must be 500 characters or less")
        return v


class UpdateHostedZoneRequest(BaseModel):
    domain_name: str | None = None
    description: str | None = None

    @field_validator("domain_name")
    @classmethod
    def validate_domain(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip().lower()
        if len(v) < 5:
            raise ValueError("Domain name must be at least 5 characters")
        if len(v) > 255:
            raise ValueError("Domain name must be 255 characters or less")
        pattern = r"^[a-z0-9]([a-z0-9-]*\.)*[a-z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Please enter a valid domain name")
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str | None) -> str | None:
        if v and len(v) > 500:
            raise ValueError("Description must be 500 characters or less")
        return v


class HostedZoneResponse(BaseModel):
    id: str
    domain_name: str
    type: str
    description: str | None
    record_count: int
    created_by: str
    created_at: str
    updated_at: str