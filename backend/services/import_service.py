"""
KIRMA V2 — Servicio de Importación de Listas de Precios
Flujo: CARGAR → EXTRAER → COMPARAR → CLASIFICAR → REVISAR → APROBAR → ACTUALIZAR → REGISTRAR
"""
import uuid
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from database import get_db
from services.ocr_service import extract_from_file, normalize_product_data


def next_import_id(conn) -> str:
    """Genera el próximo IMP-YYYY-MM-NNNN"""
    now = datetime.now(timezone.utc)
    year = now.year
    month = str(now.month).zfill(2)
    row = conn.execute("SELECT value FROM system_config WHERE key = 'import_counter'").fetchone()
    counter = int(row["value"] if row else 0) + 1
    conn.execute(
        "INSERT OR REPLACE INTO system_config (key, value, updated_at) VALUES ('import_counter', ?, ?)",
        (str(counter), datetime.now(timezone.utc).isoformat())
    )
    return f"IMP-{year}-{month}-{str(counter).zfill(4)}"


def find_matching_product(conn, extracted: dict) -> tuple[Optional[str], str]:
    """
    Busca un producto existente que coincida con los datos extraídos.
    Retorna (product_id | None, status)
    status: NUEVO | ACTUALIZAR | SIN_CAMBIOS | POSIBLE_DUPLICADO | REVISION
    """
    brand = (extracted.get("brand") or "").lower().strip()
    model = (extracted.get("model") or "").lower().strip()
    sku = (extracted.get("sku") or "").lower().strip()
    new_price = extracted.get("price")

    if not brand and not model and not sku:
        return None, "REVISION"

    candidates = []

    # Buscar por SKU exacto
    if sku:
        row = conn.execute(
            "SELECT id, sale_price FROM products WHERE LOWER(sku) = ?", (sku,)
        ).fetchone()
        if row:
            candidates.append(dict(row))

    # Buscar por marca + modelo
    if brand and model:
        rows = conn.execute(
            "SELECT id, sale_price FROM products WHERE LOWER(brand) = ? AND LOWER(model) LIKE ?",
            (brand, f"%{model}%")
        ).fetchall()
        for r in rows:
            if not any(c["id"] == r["id"] for c in candidates):
                candidates.append(dict(r))

    if len(candidates) == 0:
        return None, "NUEVO"
    elif len(candidates) > 1:
        return candidates[0]["id"], "POSIBLE_DUPLICADO"
    else:
        match = candidates[0]
        existing_price = match.get("sale_price")
        if new_price and existing_price and abs(new_price - existing_price) < 100:
            return match["id"], "SIN_CAMBIOS"
        return match["id"], "ACTUALIZAR"


async def process_import(
    import_id: str,
    file_path: Path,
    file_type: str,
    panel_api_key: str = "",
    uploaded_by: str = "admin"
):
    """
    Proceso completo de extracción e interpretación.
    Llama a OCR y carga los ítems en import_items.
    """
    conn = get_db()
    try:
        # Marcar como procesando
        conn.execute(
            "UPDATE imports SET status = 'procesando', processed_at = ? WHERE id = ?",
            (datetime.now(timezone.utc).isoformat(), import_id)
        )
        conn.commit()

        # Extraer datos con OCR
        try:
            ocr_result = await extract_from_file(file_path, panel_api_key)
        except Exception as e:
            conn.execute(
                "UPDATE imports SET status = 'error', error_message = ? WHERE id = ?",
                (str(e), import_id)
            )
            conn.commit()
            return

        raw_products = ocr_result.get("products", [])
        key_source = ocr_result.get("key_source", "unknown")
        raw_text = ocr_result.get("source_type", "")

        # Guardar texto extraído
        conn.execute(
            "UPDATE imports SET raw_text = ?, gemini_key_used = ? WHERE id = ?",
            (json.dumps(ocr_result, ensure_ascii=False), key_source, import_id)
        )

        # Procesar cada ítem
        counts = {"NUEVO": 0, "ACTUALIZAR": 0, "SIN_CAMBIOS": 0, "REVISION": 0, "POSIBLE_DUPLICADO": 0}

        for raw in raw_products:
            normalized = normalize_product_data(raw)
            matched_id, status = find_matching_product(conn, normalized)

            # Si necesita revisión por OCR
            if raw.get("needs_review") or raw.get("confidence", 1.0) < 0.7:
                status = "REVISION"
                reason = raw.get("review_reason") or f"Confianza OCR baja: {raw.get('confidence', 0):.0%}"
            else:
                reason = None

            conn.execute(
                """INSERT INTO import_items (
                    id, import_id, line_number, raw_text,
                    extracted_brand, extracted_model, extracted_processor,
                    extracted_ram, extracted_storage, extracted_price,
                    extracted_stock, extracted_sku, confidence,
                    matched_product_id, status, review_reason
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    str(uuid.uuid4()), import_id,
                    normalized.get("line_number"),
                    normalized.get("raw_text"),
                    normalized.get("brand"),
                    normalized.get("model"),
                    normalized.get("processor"),
                    normalized.get("ram"),
                    normalized.get("storage"),
                    normalized.get("price"),
                    normalized.get("stock"),
                    normalized.get("sku"),
                    normalized.get("confidence", 0.0),
                    matched_id,
                    status,
                    reason
                )
            )

            key = status if status in counts else "REVISION"
            counts[key] = counts.get(key, 0) + 1

        total = len(raw_products)
        conn.execute(
            """UPDATE imports SET
                status = 'revision',
                total_records = ?,
                new_count = ?,
                update_count = ?,
                unchanged_count = ?,
                review_count = ?
            WHERE id = ?""",
            (
                total,
                counts.get("NUEVO", 0),
                counts.get("ACTUALIZAR", 0),
                counts.get("SIN_CAMBIOS", 0),
                counts.get("REVISION", 0) + counts.get("POSIBLE_DUPLICADO", 0),
                import_id
            )
        )
        conn.commit()

    except Exception as e:
        conn.execute(
            "UPDATE imports SET status = 'error', error_message = ? WHERE id = ?",
            (str(e), import_id)
        )
        conn.commit()
    finally:
        conn.close()


def apply_import_item(conn, item: dict, action_user: str) -> bool:
    """
    Aplica un ítem aprobado al inventario.
    Retorna True si se aplicó correctamente.
    """
    import_id = item["import_id"]
    final_price = item.get("final_price") or item.get("extracted_price")
    product_id = item.get("matched_product_id")
    status = item["status"]

    if not final_price:
        return False

    # Obtener metadatos de la importación
    imp_meta = conn.execute("SELECT filename, supplier_id FROM imports WHERE id = ?", (import_id,)).fetchone()
    source_file = imp_meta["filename"] if imp_meta else None
    supplier_id = imp_meta["supplier_id"] if imp_meta else None

    if status == "NUEVO":
        # Generar KIRMA ID estructurado: KIRMA-XXXXXX
        new_id = f"KIRMA-{str(uuid.uuid4())[:6].upper()}"
        conn.execute(
            """INSERT INTO products (id, sku, brand, model, processor, ram_gb, ram_label,
               storage_gb, storage_label, sale_price, price_format, availability, status, supplier_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DISPONIBLE', 'borrador', ?)""",
            (
                new_id,
                item.get("extracted_sku") or new_id,
                item.get("extracted_brand"),
                item.get("extracted_model"),
                item.get("extracted_processor"),
                _parse_int(item.get("extracted_ram")),
                item.get("extracted_ram"),
                _parse_int(item.get("extracted_storage")),
                item.get("extracted_storage"),
                final_price,
                _format_price(final_price),
                supplier_id
            )
        )
        # Historial de precios
        _record_price_change(conn, new_id, None, final_price, action_user, import_id, source_file, supplier_id, "Creación por importación")

    elif status == "ACTUALIZAR" and product_id:
        # Obtener precio anterior
        old = conn.execute("SELECT sale_price FROM products WHERE id = ?", (product_id,)).fetchone()
        old_price = old["sale_price"] if old else None

        conn.execute(
            "UPDATE products SET sale_price = ?, price_format = ?, updated_at = ? WHERE id = ?",
            (final_price, _format_price(final_price), datetime.now(timezone.utc).isoformat(), product_id)
        )
        _record_price_change(conn, product_id, old_price, final_price, action_user, import_id, source_file, supplier_id, "Actualización por lista de precios")

    return True


def _parse_int(val) -> Optional[int]:
    if val is None:
        return None
    try:
        import re
        m = re.search(r"\d+", str(val))
        return int(m.group()) if m else None
    except Exception:
        return None


def _format_price(price: int) -> str:
    if not price:
        return "Consultar"
    return f"${price:,.0f} COP".replace(",", ".")


def _record_price_change(conn, product_id, old_price, new_price, user, import_id, source_file=None, supplier_id=None, reason="Importación"):
    conn.execute(
        """INSERT INTO price_history (id, product_id, old_sale, new_sale, changed_by, import_id, source_file, supplier_id, reason, changed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (str(uuid.uuid4()), product_id, old_price, new_price, user, import_id,
         source_file, supplier_id, reason, datetime.now(timezone.utc).isoformat())
    )
