from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS, DEBUG
from app.database import init_db
from app.auth.router import router as auth_router
from app.hosted_zones.router import router as hosted_zones_router
from app.dns_records.router import router as dns_records_router
from app.middleware.error_handler import error_handler

app = FastAPI(
    title="Route53 Clone API",
    description="AWS Route53 management console clone — REST API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

app.middleware("http")(error_handler)

app.include_router(auth_router)
app.include_router(hosted_zones_router)
app.include_router(dns_records_router)


@app.on_event("startup")
def startup():
    init_db()
    print("Database initialized.")


@app.get("/api/health")
def health_check():
    return {"success": True, "message": "Route53 Clone API is running"}