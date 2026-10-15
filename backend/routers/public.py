"""
KIRMA V2 — API Pública (sin autenticación)
GET /api/products           — Catálogo completo con filtros
GET /api/products/{id}      — Ficha de producto con Kirma Check
GET /api/config/contact     — Datos de contacto (WhatsApp, email)
"""
import json
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from database import get_db

router = APIRouter(prefix="/api", tags=["public"])


def format_price(price: int) -> str:
    """Formatea precio COP: 1890000 → '$1.890.000 COP'"""
    if not price:
        return "Consultar"
    return f"${price:,.0f} COP".replace(",", ".")


@router.get("/products")
def get_products(
    brand: Optional[str] = Query(None),
    min_ram: Optional[int] = Query(None),
    min_storage: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
    availability: Optional[str] = Query(None),
    status: str = Query("activo"),
    search: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    offset: int = Query(0),
):
    conn = get_db()
    try:
        query = "SELECT * FROM products WHERE status = ?"
        params = [status]

        if brand:
            query += " AND LOWER(brand) = LOWER(?)"
            params.append(brand)
        if min_ram:
            query += " AND ram_gb >= ?"
            params.append(min_ram)
        if min_storage:
            query += " AND storage_gb >= ?"
            params.append(min_storage)
        if max_price:
            query += " AND sale_price <= ?"
            params.append(max_price)
        if availability:
            query += " AND availability = ?"
            params.append(availability)
        if search:
            s = f"%{search.lower()}%"
            query += """ AND (
                LOWER(brand) LIKE ? OR LOWER(model) LIKE ?
                OR LOWER(processor) LIKE ? OR id LIKE ?
                OR LOWER(line) LIKE ?
            )"""
            params.extend([s, s, s, s, s])

        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        rows = conn.execute(query, params).fetchall()
        products = []

        for row in rows:
            p = dict(row)
            p["price_format"] = format_price(p.get("sale_price"))

            # Imágenes
            imgs = conn.execute(
                "SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC",
                (p["id"],)
            ).fetchall()
            p["images"] = [dict(i) for i in imgs]

            # Kirma Check (solo resumen para el catálogo)
            checks = conn.execute(
                "SELECT check_key, ok, label FROM kirma_checks WHERE product_id = ?",
                (p["id"],)
            ).fetchall()
            p["kirma_check_summary"] = {"total": len(checks), "passed": sum(1 for c in checks if c["ok"])}

            # Parsear JSON fields
            for field in ["ports", "includes", "profiles", "ideal_for", "aesthetic_marks"]:
                if p.get(field) and isinstance(p[field], str):
                    try:
                        p[field] = json.loads(p[field])
                    except Exception:
                        p[field] = []

            products.append(p)

        total = conn.execute(
            "SELECT COUNT(*) FROM products WHERE status = ?", [status]
        ).fetchone()[0]

        return {"total": total, "products": products}
    finally:
        conn.close()


@router.get("/products/{product_id}")
def get_product(product_id: str):
    conn = get_db()
    try:
        row = conn.execute(
            "SELECT * FROM products WHERE id = ? AND status = 'activo'",
            (product_id,)
        ).fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Producto no encontrado.")

        p = dict(row)
        p["price_format"] = format_price(p.get("sale_price"))

        # Imágenes
        imgs = conn.execute(
            "SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC",
            (p["id"],)
        ).fetchall()
        p["images"] = [dict(i) for i in imgs]

        # Kirma Check completo
        checks = conn.execute(
            "SELECT * FROM kirma_checks WHERE product_id = ?",
            (p["id"],)
        ).fetchall()
        p["kirma_check"] = [dict(c) for c in checks]

        # Parsear JSON fields
        for field in ["ports", "includes", "profiles", "ideal_for", "aesthetic_marks"]:
            if p.get(field) and isinstance(p[field], str):
                try:
                    p[field] = json.loads(p[field])
                except Exception:
                    p[field] = []

        return p
    finally:
        conn.close()


@router.get("/config/contact")
def get_contact_config():
    """Expone solo los datos de contacto públicos."""
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT key, value FROM system_config WHERE key IN (?, ?, ?, ?)",
            ("whatsapp_number", "whatsapp_raw", "email", "city")
        ).fetchall()
        return {r["key"]: r["value"] for r in rows}
    finally:
        conn.close()
