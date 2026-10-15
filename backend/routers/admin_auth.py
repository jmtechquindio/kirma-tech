"""
KIRMA V2 — Router de Autenticación
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
"""
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Response, Depends, Request
from database import get_db
from auth import hash_password, verify_password, create_access_token, require_admin, get_current_user
from models import LoginRequest, TokenResponse, APIResponse
from config import ADMIN_USERNAME, ADMIN_PASSWORD

router = APIRouter(prefix="/api/auth", tags=["auth"])


def ensure_admin_exists():
    """Crea el usuario admin por defecto si no existe."""
    conn = get_db()
    try:
        existing = conn.execute(
            "SELECT id FROM users WHERE username = ?", (ADMIN_USERNAME,)
        ).fetchone()
        if not existing:
            conn.execute(
                "INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)",
                (str(uuid.uuid4()), ADMIN_USERNAME, hash_password(ADMIN_PASSWORD), "admin")
            )
            conn.commit()
            print(f"[OK] Usuario admin creado: {ADMIN_USERNAME}")
    finally:
        conn.close()


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, response: Response, request: Request):
    conn = get_db()
    try:
        user = conn.execute(
            "SELECT id, username, password_hash, role, active FROM users WHERE username = ?",
            (body.username,)
        ).fetchone()
    finally:
        conn.close()

    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas.")

    if not user["active"]:
        raise HTTPException(status_code=403, detail="Usuario desactivado.")

    token = create_access_token({"sub": user["username"], "role": user["role"]})

    # Cookie httpOnly para el panel web (más segura que localStorage)
    response.set_cookie(
        key="kirma_token",
        value=token,
        httponly=True,
        secure=False,  # True en producción con HTTPS
        samesite="lax",
        max_age=28800  # 8 horas
    )

    # Registrar último login
    conn2 = get_db()
    try:
        conn2.execute(
            "UPDATE users SET last_login = ? WHERE id = ?",
            (datetime.now(timezone.utc).isoformat(), user["id"])
        )
        conn2.execute(
            """INSERT INTO audit_log (id, user_id, action, ip, created_at)
               VALUES (?, ?, 'LOGIN', ?, ?)""",
            (str(uuid.uuid4()), user["username"],
             request.client.host if request.client else "unknown",
             datetime.now(timezone.utc).isoformat())
        )
        conn2.commit()
    finally:
        conn2.close()

    return TokenResponse(
        access_token=token,
        username=user["username"],
        role=user["role"]
    )


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("kirma_token")
    return APIResponse(ok=True, message="Sesión cerrada.")


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {"username": user["username"], "role": user["role"]}


@router.post("/change-password")
def change_password(
    body: dict,
    user: dict = Depends(require_admin)
):
    new_password = body.get("new_password", "")
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 8 caracteres.")

    conn = get_db()
    try:
        conn.execute(
            "UPDATE users SET password_hash = ? WHERE username = ?",
            (hash_password(new_password), user["username"])
        )
        conn.execute(
            """INSERT INTO audit_log (id, user_id, action, resource, created_at)
               VALUES (?, ?, 'CHANGE_PASSWORD', 'users', ?)""",
            (str(uuid.uuid4()), user["username"], datetime.now(timezone.utc).isoformat())
        )
        conn.commit()
    finally:
        conn.close()

    return APIResponse(ok=True, message="Contraseña actualizada.")
