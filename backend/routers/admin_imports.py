"""
KIRMA V2 — Router Admin: Importaciones de Listas de Precios
POST /api/admin/imports              — Subir archivo
GET  /api/admin/imports              — Listar importaciones
GET  /api/admin/imports/{id}         — Detalle de importación
GET  /api/admin/imports/{id}/items   — Ítems con paginación
PATCH /api/admin/import-items/{id}   — Acción sobre ítem individual
POST /api/admin/imports/{id}/approve — Aprobar lote
POST /api/admin/imports/{id}/reject  — Rechazar importación
"""
import uuid
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import aiofiles
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, BackgroundTasks, Query

from auth import require_admin
from database import get_db
from models import ImportItemAction, BulkApproveRequest, APIResponse
from config import UPLOADS_DIR, MAX_UPLOAD_SIZE_MB, ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS
from services.import_service import next_import_id, process_import, apply_import_item

router = APIRouter(prefix="/api/admin/imports", tags=["admin-imports"])

MAX_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024


@router.post("")
async def upload_import(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    supplier_id: Optional[str] = Form(None),
    gemini_api_key: Optional[str] = Form(None),
    user: dict = Depends(require_admin)
):
    """Sube un archivo (PDF/imagen) e inicia el procesamiento OCR en segundo plano."""
    # ── Validaciones de seguridad ──────────────────────────────────────
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Extensión no permitida: {ext}. Permitidas: {', '.join(ALLOWED_EXTENSIONS)}")

    content_type = file.content_type or ""
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(400, f"Tipo de archivo no permitido: {content_type}")

    # Leer con límite de tamaño
    content = await file.read()
    if len(content) > MAX_SIZE_BYTES:
        raise HTTPException(400, f"Archivo muy grande. Máximo: {MAX_UPLOAD_SIZE_MB} MB")
    if len(content) == 0:
        raise HTTPException(400, "El archivo está vacío.")

    # ── Guardar archivo de forma segura ───────────────────────────────
    conn = get_db()
    try:
        import_id = next_import_id(conn)
        safe_name = f"{import_id}{ext}"
        save_path = UPLOADS_DIR / safe_name
        save_path.parent.mkdir(parents=True, exist_ok=True)

        async with aiofiles.open(save_path, "wb") as f:
            await f.write(content)

        # Crear registro de importación
        conn.execute(
            """INSERT INTO imports (id, filename, file_path, file_type, file_size,
               supplier_id, uploaded_by, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'procesando')""",
            (import_id, file.filename, str(save_path), content_type,
             len(content), supplier_id, user["username"])
        )
        conn.execute(
            """INSERT INTO audit_log (id, user_id, action, resource, resource_id, created_at)
               VALUES (?, ?, 'IMPORT_UPLOAD', 'imports', ?, ?)""",
            (str(uuid.uuid4()), user["username"], import_id, datetime.now(timezone.utc).isoformat())
        )
        conn.commit()
    finally:
        conn.close()

    # Procesar en segundo plano (no bloquea la respuesta)
    background_tasks.add_task(
        process_import, import_id, save_path, content_type, gemini_api_key or "", user["username"]
    )

    return {
        "ok": True,
        "import_id": import_id,
        "message": f"Archivo recibido. Procesando con OCR... Consulta el estado en /api/admin/imports/{import_id}",
        "filename": file.filename,
        "size_kb": round(len(content) / 1024, 1)
    }


@router.get("")
def list_imports(
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    user: dict = Depends(require_admin)
):
    conn = get_db()
    try:
        rows = conn.execute(
            """SELECT id, filename, file_type, file_size, supplier_id, uploaded_by,
                      uploaded_at, processed_at, status, total_records, new_count,
                      update_count, unchanged_count, review_count, rejected_count
               FROM imports ORDER BY uploaded_at DESC LIMIT ? OFFSET ?""",
            (limit, offset)
        ).fetchall()
        total = conn.execute("SELECT COUNT(*) FROM imports").fetchone()[0]
        return {"total": total, "imports": [dict(r) for r in rows]}
    finally:
        conn.close()


@router.get("/{import_id}")
def get_import(import_id: str, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM imports WHERE id = ?", (import_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Importación no encontrada.")
        return dict(row)
    finally:
        conn.close()


@router.get("/{import_id}/items")
def get_import_items(
    import_id: str,
    status: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0),
    user: dict = Depends(require_admin)
):
    conn = get_db()
    try:
        query = "SELECT * FROM import_items WHERE import_id = ?"
        params = [import_id]
        if status:
            query += " AND status = ?"
            params.append(status)
        query += " ORDER BY line_number ASC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        rows = conn.execute(query, params).fetchall()
        total = conn.execute(
            "SELECT COUNT(*) FROM import_items WHERE import_id = ?", (import_id,)
        ).fetchone()[0]
        return {"total": total, "items": [dict(r) for r in rows]}
    finally:
        conn.close()


@router.patch("/items/{item_id}")
def update_import_item(
    item_id: str,
    body: ImportItemAction,
    user: dict = Depends(require_admin)
):
    """Aprobar, rechazar, editar o ignorar un ítem individualmente."""
    valid_actions = {"approved", "rejected", "edited", "ignored"}
    if body.action not in valid_actions:
        raise HTTPException(400, f"Acción inválida. Permitidas: {valid_actions}")

    conn = get_db()
    try:
        item = conn.execute("SELECT * FROM import_items WHERE id = ?", (item_id,)).fetchone()
        if not item:
            raise HTTPException(404, "Ítem no encontrado.")

        item = dict(item)
        item["admin_action"] = body.action
        if body.final_price:
            item["final_price"] = body.final_price
        if body.final_cost:
            item["final_cost"] = body.final_cost

        conn.execute(
            """UPDATE import_items SET admin_action = ?, final_price = ?,
               final_cost = ?, processed_at = ? WHERE id = ?""",
            (body.action, body.final_price, body.final_cost,
             datetime.now(timezone.utc).isoformat(), item_id)
        )

        # Si se aprueba, aplicar al inventario
        if body.action == "approved":
            apply_import_item(conn, item, user["username"])

        conn.execute(
            """INSERT INTO audit_log (id, user_id, action, resource, resource_id, new_value, import_id, created_at)
               VALUES (?, ?, ?, 'import_items', ?, ?, ?, ?)""",
            (str(uuid.uuid4()), user["username"], f"ITEM_{body.action.upper()}",
             item_id, body.action, item.get("import_id"), datetime.now(timezone.utc).isoformat())
        )
        conn.commit()
        return APIResponse(ok=True, message=f"Ítem marcado como: {body.action}")
    finally:
        conn.close()


@router.post("/{import_id}/approve")
def approve_import(
    import_id: str,
    body: BulkApproveRequest,
    user: dict = Depends(require_admin)
):
    """Aprobar masivamente todos los ítems válidos (NUEVO + ACTUALIZAR con confianza >= 0.7)."""
    conn = get_db()
    try:
        imp = conn.execute("SELECT status FROM imports WHERE id = ?", (import_id,)).fetchone()
        if not imp:
            raise HTTPException(404, "Importación no encontrada.")

        # Seleccionar ítems aprobables
        if body.item_ids:
            placeholders = ",".join(["?"] * len(body.item_ids))
            items = conn.execute(
                f"SELECT * FROM import_items WHERE import_id = ? AND id IN ({placeholders})",
                [import_id] + body.item_ids
            ).fetchall()
        else:
            # Solo los que tengan estado válido y confianza suficiente
            items = conn.execute(
                """SELECT * FROM import_items WHERE import_id = ?
                   AND status IN ('NUEVO', 'ACTUALIZAR')
                   AND (needs_review IS NULL OR needs_review = 0)
                   AND confidence >= 0.7
                   AND admin_action IS NULL""",
                (import_id,)
            ).fetchall()

        applied = 0
        skipped = 0
        for item in items:
            item_dict = dict(item)
            item_dict["final_price"] = item_dict.get("final_price") or item_dict.get("extracted_price")
            success = apply_import_item(conn, item_dict, user["username"])
            if success:
                conn.execute(
                    "UPDATE import_items SET admin_action = 'approved', processed_at = ? WHERE id = ?",
                    (datetime.now(timezone.utc).isoformat(), item_dict["id"])
                )
                applied += 1
            else:
                skipped += 1

        conn.execute(
            "UPDATE imports SET status = 'aprobada' WHERE id = ?", (import_id,)
        )
        conn.execute(
            """INSERT INTO audit_log (id, user_id, action, resource, resource_id, new_value, created_at)
               VALUES (?, ?, 'IMPORT_APPROVE', 'imports', ?, ?, ?)""",
            (str(uuid.uuid4()), user["username"], import_id,
             f"applied={applied},skipped={skipped}", datetime.now(timezone.utc).isoformat())
        )
        conn.commit()
        return APIResponse(
            ok=True,
            message=f"Importación aprobada. {applied} cambios aplicados, {skipped} omitidos.",
            data={"applied": applied, "skipped": skipped}
        )
    finally:
        conn.close()


@router.post("/{import_id}/reject")
def reject_import(import_id: str, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        conn.execute(
            "UPDATE imports SET status = 'rechazada' WHERE id = ?", (import_id,)
        )
        conn.execute(
            "UPDATE import_items SET admin_action = 'rejected' WHERE import_id = ? AND admin_action IS NULL",
            (import_id,)
        )
        conn.execute(
            """INSERT INTO audit_log (id, user_id, action, resource, resource_id, created_at)
               VALUES (?, ?, 'IMPORT_REJECT', 'imports', ?, ?)""",
            (str(uuid.uuid4()), user["username"], import_id, datetime.now(timezone.utc).isoformat())
        )
        conn.commit()
        return APIResponse(ok=True, message="Importación rechazada.")
    finally:
        conn.close()
