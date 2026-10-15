import httpx
import sys

base_url = "http://localhost:8000"

def run_tests():
    print("--- INICIANDO VALIDACIÓN DEL BACKEND KIRMA V2 ---")
    
    print("\n1. Probando Autenticación (Login)...")
    r = httpx.post(f"{base_url}/api/auth/login", json={"username": "admin", "password": "kirma2026"})
    if r.status_code != 200:
        print(f"[ERROR] Error de Login: {r.text}")
        sys.exit(1)
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Login exitoso. Token JWT obtenido.")

    print("\n2. Probando Estadísticas del Dashboard...")
    r = httpx.get(f"{base_url}/api/admin/inventory/stats", headers=headers)
    if r.status_code == 200:
        print(f"[OK] Estadísticas: {r.json()}")
    else:
        print(f"[ERROR] Error Stats: {r.text}")

    print("\n3. Probando Inventario Admin...")
    r = httpx.get(f"{base_url}/api/admin/products", headers=headers)
    products = r.json().get("products", [])
    print(f"[OK] Se encontraron {len(products)} productos en el panel admin.")

    if products:
        first_id = products[0]["id"]
        status = products[0]["status"]
        print(f"\n4. Publicando el producto {first_id} (actual: {status})...")
        r = httpx.patch(f"{base_url}/api/admin/products/{first_id}", json={"status": "activo"}, headers=headers)
        if r.status_code == 200:
            print(f"[OK] Producto {first_id} publicado exitosamente.")
        else:
            print(f"[ERROR] Error al publicar: {r.text}")

    print("\n5. Comprobando Catálogo Público...")
    r = httpx.get(f"{base_url}/api/products?status=activo")
    pub_prods = r.json().get("products", [])
    print(f"[OK] Se encontraron {len(pub_prods)} productos activos en el catálogo público.")
    for p in pub_prods:
        print(f"   - {p['id']}: {p['brand']} {p['model']} -> {p['price_format']}")

    print("\n--- VALIDACIÓN COMPLETADA ---")

if __name__ == "__main__":
    run_tests()
