"""
KIRMA V2 — Router Admin: Gestión de Productos
GET    /api/admin/products           — Lista admin (todos los estados)
POST   /api/admin/products           — Crear producto
GET    /api/admin/products/{id}      — Detalle completo
PATCH  /api/admin/products/{id}      — Actualizar producto
DELETE /api/admin/products/{id}      — Archivar producto (nunca eliminar)
GET    /api/admin/products/{id}/price-history — Historial de precios
GET    /api/admin/inventory/stats    — Dashboard de inventario
"""
import uuid
import json
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, Query
from auth import require_admin
from database import get_db
from models import ProductCreate, ProductUpdate, APIResponse

router = APIRouter(prefix="/api/admin", tags=["admin-products"])


def _format_price(price) -> str:
    if not price:
        return "Consultar"
    return f"${price:,.0f} COP".replace(",", ".")


@router.get("/products")
def list_products_admin(
    status: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0),
    user: dict = Depends(require_admin)
):
    conn = get_db()
    try:
        query = "SELECT * FROM products WHERE 1=1"
        params = []
        if status:
            query += " AND status = ?"
            params.append(status)
        if brand:
            query += " AND LOWER(brand) = LOWER(?)"
            params.append(brand)
        if search:
            s = f"%{search.lower()}%"
            query += " AND (LOWER(brand) LIKE ? OR LOWER(model) LIKE ? OR id LIKE ?)"
            params.extend([s, s, s])
        query += " ORDER BY updated_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        rows = conn.execute(query, params).fetchall()
        total = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]
        return {"total": total, "products": [dict(r) for r in rows]}
    finally:
        conn.close()


@router.post("/products")
def create_product(body: ProductCreate, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        existing = conn.execute("SELECT id FROM products WHERE id = ?", (body.id,)).fetchone()
        if existing:
            raise HTTPException(400, f"Ya existe un producto con ID {body.id}")

        price_fmt = _format_price(body.sale_price)
        now = datetime.now(timezone.utc).isoformat()

        conn.execute(
            """INSERT INTO products (id, sku, brand, model, category, description, line,
               processor, generation, ram_gb, ram_label, storage_gb, storage_label,
               screen_size, screen_label, gpu, os, weight, aesthetic_grade, aesthetic_summary,
               battery_pct, warranty, cost_price, sale_price, margin_pct, price_format,
               stock, availability, status, badge, supplier_id, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (body.id, body.sku, body.brand, body.model, body.category, body.description,
             body.line, body.processor, body.generation, body.ram_gb, body.ram_label,
             body.storage_gb, body.storage_label, body.screen_size, body.screen_label,
             body.gpu, body.os, body.weight, body.aesthetic_grade, body.aesthetic_summary,
             body.battery_pct, body.warranty, body.cost_price, body.sale_price,
             body.margin_pct, price_fmt, body.stock, body.availability, body.status,
             body.badge, body.supplier_id, now, now)
        )

        conn.execute(
            """INSERT INTO audit_log (id, user_id, action, resource, resource_id, new_value, created_at)
               VALUES (?, ?, 'CREATE_PRODUCT', 'products', ?, ?, ?)""",
            (str(uuid.uuid4()), user["username"], body.id,
             f"{body.brand} {body.model}", now)
        )
        conn.commit()
        return APIResponse(ok=True, message=f"Producto {body.id} creado.", data={"id": body.id})
    finally:
        conn.close()


@router.get("/products/{product_id}")
def get_product_admin(product_id: str, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Producto no encontrado.")
        p = dict(row)
        # Kirma Check
        checks = conn.execute("SELECT * FROM kirma_checks WHERE product_id = ?", (product_id,)).fetchall()
        p["kirma_check"] = [dict(c) for c in checks]
        # Imágenes
        imgs = conn.execute("SELECT * FROM product_images WHERE product_id = ?", (product_id,)).fetchall()
        p["images"] = [dict(i) for i in imgs]
        return p
    finally:
        conn.close()


@router.patch("/products/{product_id}")
def update_product(product_id: str, body: ProductUpdate, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        existing = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        if not existing:
            raise HTTPException(404, "Producto no encontrado.")

        existing = dict(existing)
        updates = body.model_dump(exclude_none=True)

        if "sale_price" in updates:
            updates["price_format"] = _format_price(updates["sale_price"])
            # Registrar cambio de precio
            if existing.get("sale_price") != updates["sale_price"]:
                conn.execute(
                    """INSERT INTO price_history (id, product_id, old_sale, new_sale, changed_by, reason, changed_at)
                       VALUES (?, ?, ?, ?, ?, 'Edición manual', ?)""",
                    (str(uuid.uuid4()), product_id, existing.get("sale_price"),
                     updates["sale_price"], user["username"], datetime.now(timezone.utc).isoformat())
                )

        updates["updated_at"] = datetime.now(timezone.utc).isoformat()
        set_clause = ", ".join([f"{k} = ?" for k in updates.keys()])
        conn.execute(
            f"UPDATE products SET {set_clause} WHERE id = ?",
            list(updates.values()) + [product_id]
        )
        conn.execute(
            """INSERT INTO audit_log (id, user_id, action, resource, resource_id, new_value, created_at)
               VALUES (?, ?, 'UPDATE_PRODUCT', 'products', ?, ?, ?)""",
            (str(uuid.uuid4()), user["username"], product_id,
             json.dumps(updates, ensure_ascii=False), updates["updated_at"])
        )
        conn.commit()
        return APIResponse(ok=True, message=f"Producto {product_id} actualizado.")
    finally:
        conn.close()


@router.delete("/products/{product_id}")
def archive_product(product_id: str, user: dict = Depends(require_admin)):
    """Archiva el producto (nunca elimina datos)."""
    conn = get_db()
    try:
        conn.execute(
            "UPDATE products SET status = 'archivado', updated_at = ? WHERE id = ?",
            (datetime.now(timezone.utc).isoformat(), product_id)
        )
        conn.execute(
            """INSERT INTO audit_log (id, user_id, action, resource, resource_id, created_at)
               VALUES (?, ?, 'ARCHIVE_PRODUCT', 'products', ?, ?)""",
            (str(uuid.uuid4()), user["username"], product_id, datetime.now(timezone.utc).isoformat())
        )
        conn.commit()
        return APIResponse(ok=True, message=f"Producto {product_id} archivado.")
    finally:
        conn.close()


@router.get("/products/{product_id}/price-history")
@router.get("/price-history/{product_id}")
def get_price_history(product_id: str, user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT * FROM price_history WHERE product_id = ? ORDER BY changed_at DESC",
            (product_id,)
        ).fetchall()
        return {"product_id": product_id, "history": [dict(r) for r in rows]}
    finally:
        conn.close()


@router.get("/inventory/stats")
def get_inventory_stats(user: dict = Depends(require_admin)):
    conn = get_db()
    try:
        stats = {
            "total": conn.execute("SELECT COUNT(*) FROM products").fetchone()[0],
            "activo": conn.execute("SELECT COUNT(*) FROM products WHERE status='activo'").fetchone()[0],
            "borrador": conn.execute("SELECT COUNT(*) FROM products WHERE status='borrador'").fetchone()[0],
            "archivado": conn.execute("SELECT COUNT(*) FROM products WHERE status='archivado'").fetchone()[0],
            "disponible": conn.execute("SELECT COUNT(*) FROM products WHERE availability='DISPONIBLE' AND status='activo'").fetchone()[0],
            "agotado": conn.execute("SELECT COUNT(*) FROM products WHERE availability='AGOTADO'").fetchone()[0],
            "sin_precio": conn.execute("SELECT COUNT(*) FROM products WHERE sale_price IS NULL OR sale_price = 0").fetchone()[0],
            "sin_imagen": conn.execute(
                "SELECT COUNT(*) FROM products WHERE id NOT IN (SELECT DISTINCT product_id FROM product_images)"
            ).fetchone()[0],
            "importaciones_pendientes": conn.execute(
                "SELECT COUNT(*) FROM imports WHERE status='revision'"
            ).fetchone()[0],
            "cambios_pendientes": conn.execute(
                "SELECT COUNT(*) FROM import_items WHERE admin_action IS NULL AND status IN ('NUEVO','ACTUALIZAR')"
            ).fetchone()[0],
        }
        return stats
    finally:
        conn.close()


@router.get("/audit-log")
def get_audit_log(
    limit: int = Query(50, le=200),
    offset: int = Query(0),
    user: dict = Depends(require_admin)
):
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ? OFFSET ?",
            (limit, offset)
        ).fetchall()
        total = conn.execute("SELECT COUNT(*) FROM audit_log").fetchone()[0]
        return {"total": total, "log": [dict(r) for r in rows]}
    finally:
        conn.close()
