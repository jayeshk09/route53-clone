import re

from pydantic import BaseModel, field_validator

VALID_RECORD_TYPES = {"A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"}


class CreateDNSRecordRequest(BaseModel):
    name: str
    type: str
    value: str
    ttl: int = 300
    routing_policy: str = "Simple"

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            return "@"
        if len(v) > 255:
            raise ValueError("Record name must be 255 characters or less")
        if not re.match(r"^[a-zA-Z0-9@._\-]+$", v):
            raise ValueError("Record name contains invalid characters")
        return v.lower()

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in VALID_RECORD_TYPES:
            raise ValueError(f"Invalid record type. Must be one of: {', '.join(sorted(VALID_RECORD_TYPES))}")
        return v

    @field_validator("value")
    @classmethod
    def validate_value(cls, v: str, info) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Value is required")
        if len(v) > 4096:
            raise ValueError("Value must be 4096 characters or less")

        record_type = info.data.get("type", "")
        if record_type == "A":
            pattern = r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
            if not re.match(pattern, v):
                raise ValueError("Please enter a valid IPv4 address")
        elif record_type == "CNAME" and v == "@":
            raise ValueError("CNAME records cannot be at the zone apex")

        return v

    @field_validator("ttl")
    @classmethod
    def validate_ttl(cls, v: int) -> int:
        if v < 60 or v > 86400:
            raise ValueError("TTL must be between 60 and 86400 seconds")
        return v


class UpdateDNSRecordRequest(BaseModel):
    value: str | None = None
    ttl: int | None = None
    routing_policy: str | None = None

    @field_validator("ttl")
    @classmethod
    def validate_ttl(cls, v: int | None) -> int | None:
        if v is not None and (v < 60 or v > 86400):
            raise ValueError("TTL must be between 60 and 86400 seconds")
        return v


class DNSRecordResponse(BaseModel):
    id: str
    hosted_zone_id: str
    name: str
    type: str
    value: str
    ttl: int
    routing_policy: str
    created_at: str
    updated_at: str