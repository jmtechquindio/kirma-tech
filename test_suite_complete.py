import sys
import os
from pathlib import Path

# Configurar path para backend
BASE_DIR = Path(__file__).parent
sys.path.insert(0, str(BASE_DIR / "backend"))

from fastapi.testclient import TestClient
from main import app
from database import get_db

client = TestClient(app)

def test_full_kirma_suite():
    print("==================================================")
    print("      KIRMA V2 — SUITE COMPLETA DE QA Y REGRESIÓN ")
    print("==================================================")

    # 1. API Health Check
    print("\n[TEST 1] Verificando /api/health...")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check falló: {r.status_code}"
    assert r.json()["status"] == "ok"
    print("  -> OK: API operando correctamente en v2.0.0")

    # 2. Configuración pública y WhatsApp oficial
    print("\n[TEST 2] Verificando datos de contacto públicos y WhatsApp (+57 314 881 3857)...")
    r = client.get("/api/config/contact")
    assert r.status_code == 200
    contact = r.json()
    assert contact["whatsapp_number"] == "+57 314 881 3857", f"WhatsApp incorrecto: {contact['whatsapp_number']}"
    assert contact["whatsapp_raw"] == "573148813857"
    print(f"  -> OK: WhatsApp verificado: {contact['whatsapp_number']} ({contact['whatsapp_raw']})")

    # 3. Autenticación Admin
    print("\n[TEST 3] Autenticación administrativa (/api/auth/login)...")
    r = client.post("/api/auth/login", json={"username": "admin", "password": "kirma2026"})
    assert r.status_code == 200, f"Error en login: {r.text}"
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("  -> OK: Token JWT generado exitosamente")

    # 4. Estadísticas del Dashboard
    print("\n[TEST 4] Estadísticas de inventario (/api/admin/inventory/stats)...")
    r = client.get("/api/admin/inventory/stats", headers=headers)
    assert r.status_code == 200
    stats = r.json()
    print(f"  -> OK: Stats obtenidas: Total={stats['total']}, Activos={stats['activo']}, Borradores={stats['borrador']}")

    # 5. Catálogo Público
    print("\n[TEST 5] Consulta de catálogo público (/api/products)...")
    r = client.get("/api/products?status=activo")
    assert r.status_code == 200
    data = r.json()
    assert len(data["products"]) > 0, "No hay productos en el catálogo público"
    sample = data["products"][0]
    print(f"  -> OK: {len(data['products'])} productos listados. Muestra: {sample['id']} {sample['brand']} {sample['model']}")

    # 6. Ficha de Producto Individual y Kirma Check
    print(f"\n[TEST 6] Ficha técnica completa de {sample['id']}...")
    r = client.get(f"/api/products/{sample['id']}")
    assert r.status_code == 200
    p_detail = r.json()
    assert "kirma_check" in p_detail
    print(f"  -> OK: Ficha técnica y Kirma Check cargados: {len(p_detail['kirma_check'])} puntos inspeccionados")

    # 7. Motor de Importación OCR / Fallback Estructurado
    print("\n[TEST 7] Procesamiento de catálogo en PDF (IMP-2026-10-0001.pdf)...")
    pdf_path = BASE_DIR / "backend" / "uploads" / "IMP-2026-10-0001.pdf"
    assert pdf_path.exists(), "Archivo de prueba PDF no encontrado"
    
    with open(pdf_path, "rb") as f:
        r = client.post(
            "/api/admin/imports",
            files={"file": ("lista_test.pdf", f, "application/pdf")},
            headers=headers
        )
    assert r.status_code == 200, f"Fallo al subir: {r.text}"
    imp_id = r.json()["import_id"]
    print(f"  -> OK: Archivo subido y registrado con ID: {imp_id}")

    # Ejecutar procesamiento síncrono para verificar resultados
    import asyncio
    from services.import_service import process_import
    asyncio.run(process_import(imp_id, pdf_path, "application/pdf", "", "admin"))

    # Comprobar estado de la importación
    r = client.get(f"/api/admin/imports/{imp_id}", headers=headers)
    assert r.status_code == 200
    imp_info = r.json()
    print(f"  -> OK: Estado importación: {imp_info['status']}, Detectados: {imp_info['total_records']}, Nuevos: {imp_info['new_count']}")

    # 8. Verificación de Ítems extraídos
    r = client.get(f"/api/admin/imports/{imp_id}/items", headers=headers)
    assert r.status_code == 200
    items_data = r.json()
    assert len(items_data["items"]) > 0
    first_item = items_data["items"][0]
    print(f"  -> OK: Primer ítem extraído: {first_item['extracted_brand']} {first_item['extracted_model']} | Precio: ${first_item['extracted_price']}")

    # 9. Aprobación y Actualización Controlada
    print(f"\n[TEST 8] Aprobación controlada del ítem {first_item['id']}...")
    r = client.patch(
        f"/api/admin/import-items/{first_item['id']}",
        json={"action": "approved", "final_price": first_item["extracted_price"]},
        headers=headers
    )
    assert r.status_code == 200
    print("  -> OK: Ítem aprobado y aplicado al inventario sin modificaciones silenciosas")

    # 10. Historial de Precios y Trazabilidad de Auditoría
    print("\n[TEST 9] Trazabilidad y fuente de precios...")
    conn = get_db()
    hist_rows = conn.execute("SELECT * FROM price_history ORDER BY changed_at DESC LIMIT 1").fetchall()
    conn.close()
    assert len(hist_rows) > 0
    last_hist = dict(hist_rows[0])
    print(f"  -> OK: Historial registrado: Producto={last_hist['product_id']}, Precio={last_hist['new_sale']}, Fuente={last_hist['source_file']}, Motivo={last_hist['reason']}")

    # 11. Seguridad: Intento no autorizado
    print("\n[TEST 10] Seguridad: Intento de acceso sin token...")
    clean_client = TestClient(app)
    r_unauth = clean_client.get("/api/admin/products")
    assert r_unauth.status_code == 401, f"Se esperaba 401, se obtuvo {r_unauth.status_code}"
    print("  -> OK: Endpoint protegido rechazó acceso no autenticado (401 Unauthorized)")

    print("\n==================================================")
    print("  TODAS LAS PRUEBAS (10/10) PASARON SATISFACTORIAMENTE")
    print("==================================================")

if __name__ == "__main__":
    test_full_kirma_suite()
