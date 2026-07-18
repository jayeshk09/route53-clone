import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/route53.db")
SECRET_KEY = os.getenv("SECRET_KEY", "route53-clone-secret-key")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
SESSION_TIMEOUT = int(os.getenv("SESSION_TIMEOUT", "86400"))