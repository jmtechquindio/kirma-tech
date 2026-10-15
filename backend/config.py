"""
KIRMA V2 — Configuración Central
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DB_PATH = BASE_DIR / "kirma.db"
UPLOADS_DIR = BASE_DIR / "backend" / "uploads"
FRONTEND_DIR = BASE_DIR / "frontend"

# JWT
SECRET_KEY = os.environ.get("KIRMA_SECRET_KEY", "kirma-v2-secret-key-change-in-production-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 horas

# Admin
ADMIN_USERNAME = os.environ.get("KIRMA_ADMIN_USER", "admin")
ADMIN_PASSWORD = os.environ.get("KIRMA_ADMIN_PASS", "kirma2026")

# Gemini
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")  # fallback: ingresado desde panel admin

# Seguridad de uploads
MAX_UPLOAD_SIZE_MB = 20
ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/jpg", "image/png", "image/webp",
    "application/pdf"
}
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".webp"}

# CORS
ALLOWED_ORIGINS = [
    "https://kirma-tech.lat",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# Contadores de importación
IMPORT_ID_PREFIX = "IMP"
