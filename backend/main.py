"""
KIRMA V2 — Aplicación FastAPI Principal
Monta el frontend estático y todos los routers de API.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from config import ALLOWED_ORIGINS, FRONTEND_DIR
from database import init_db
from routers.admin_auth import router as auth_router, ensure_admin_exists
from routers.public import router as public_router
from routers.admin_products import router as admin_products_router
from routers.admin_imports import router as admin_imports_router

# ── Inicializar DB ────────────────────────────────────────────────────────
init_db()
ensure_admin_exists()

# ── App FastAPI ───────────────────────────────────────────────────────────
app = FastAPI(
    title="KIRMA V2 API",
    description="Plataforma de gestión de equipos corporativos remanufacturados",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url=None,
    openapi_url="/api/openapi.json"
)

# ── CORS ──────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ── Security Headers Middleware ───────────────────────────────────────────
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    # Nunca ejecutar archivos subidos como código
    if request.url.path.startswith("/uploads"):
        response.headers["Content-Disposition"] = "attachment"
        response.headers["X-Content-Type-Options"] = "nosniff"
    return response

# ── Routers API ───────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(public_router)
app.include_router(admin_products_router)
app.include_router(admin_imports_router)

# Alias de ruta para /api/admin/import-items/{item_id}
from routers.admin_imports import update_import_item
app.add_api_route("/api/admin/import-items/{item_id}", update_import_item, methods=["PATCH"], tags=["admin-imports"])

# ── API Health Check ──────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "version": "2.0.0", "platform": "KIRMA V2"}

# ── Archivos estáticos del frontend ──────────────────────────────────────
FRONTEND_DIR_PATH = Path(__file__).parent.parent / "frontend"
if FRONTEND_DIR_PATH.exists():
    app.mount("/css", StaticFiles(directory=str(FRONTEND_DIR_PATH / "css") if (FRONTEND_DIR_PATH / "css").exists() else str(Path(__file__).parent.parent / "css")), name="css")
    app.mount("/js", StaticFiles(directory=str(FRONTEND_DIR_PATH / "js") if (FRONTEND_DIR_PATH / "js").exists() else str(Path(__file__).parent.parent / "js")), name="js")
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR_PATH / "assets") if (FRONTEND_DIR_PATH / "assets").exists() else str(Path(__file__).parent.parent / "assets")), name="assets")

# Montar también desde la raíz del proyecto (donde están css/, js/, assets/)
ROOT_DIR = Path(__file__).parent.parent
for static_dir in ["css", "js", "assets"]:
    full_path = ROOT_DIR / static_dir
    if full_path.exists():
        app.mount(f"/{static_dir}", StaticFiles(directory=str(full_path)), name=f"root_{static_dir}")

# ── SPA Routing: servir index.html para rutas del frontend ────────────────
@app.get("/admin", include_in_schema=False)
@app.get("/admin/", include_in_schema=False)
async def admin_panel():
    admin_path = ROOT_DIR / "admin.html"
    if admin_path.exists():
        return FileResponse(str(admin_path))
    return JSONResponse({"error": "Admin panel not found"}, status_code=404)

@app.get("/", include_in_schema=False)
async def root():
    index_path = ROOT_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return JSONResponse({"status": "KIRMA V2 API running", "docs": "/api/docs"})

@app.get("/{path:path}", include_in_schema=False)
async def catch_all(path: str):
    # Intentar servir el archivo como estático
    for base in [ROOT_DIR, ROOT_DIR / "frontend"]:
        target = base / path
        if target.exists() and target.is_file():
            return FileResponse(str(target))
    # Fallback: index.html
    index_path = ROOT_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return JSONResponse({"error": "Not found"}, status_code=404)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
