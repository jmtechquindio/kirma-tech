"""
KIRMA V2 — Migración de inventory.js a kirma.db
Carga los 8 productos existentes como 'borrador' para revisión.
"""
import sys, os, uuid, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
from database import init_db, get_db

# Datos del inventory.js (extraídos de forma limpia)
PRODUCTS = [
    {
        "id": "KIRMA-024", "sku": "KIRMA-024", "brand": "Dell", "model": "Latitude 5420",
        "line": "Latitude 5000 Series (Empresarial)", "processor": "Intel Core i5-1135G7",
        "processor_detail": "4 núcleos, 8 hilos, 2.40 GHz hasta 4.20 GHz Turbo, 8 MB Caché",
        "generation": "11ª Generación", "ram_gb": 16, "ram_label": "16 GB DDR4",
        "storage_gb": 512, "storage_label": "512 GB SSD NVMe M.2",
        "screen_size": 14.0, "screen_label": '14.0" FHD (1920 x 1080)',
        "gpu": "Intel Iris Xe Graphics",
        "os": "Windows 11 Pro 64 bits", "weight": 1.37,
        "aesthetic_grade": "Grado A-", "aesthetic_summary": "Muy buen estado físico general con mínimos signos normales de uso anterior.",
        "battery_pct": 88, "warranty": "6 meses conforme a Ley 1480 de 2011",
        "cost_price": None, "sale_price": 1890000, "stock": 4, "availability": "DISPONIBLE",
        "badge": "RECOMENDADO PRODUCTIVIDAD & OFICINA",
        "profiles": ["trabajar", "estudiar", "oficina", "programar"],
        "kirma_check": {
            "encendido": {"ok": True, "label": "Encendido", "note": "Arranque en frío en 9 segundos"},
            "pantalla": {"ok": True, "label": "Pantalla", "note": "Sin píxeles muertos ni sangrado"},
            "teclado": {"ok": True, "label": "Teclado", "note": "100% teclas operativas"},
            "touchpad": {"ok": True, "label": "Touchpad", "note": "Multitáctil verificado"},
            "puertos": {"ok": True, "label": "Puertos", "note": "USB-C, USB-A, HDMI, RJ-45 probados"},
            "conectividad": {"ok": True, "label": "Conectividad", "note": "Wi-Fi 6 y BT 5.1 estables"},
            "almacenamiento": {"ok": True, "label": "Almacenamiento", "note": "SMART 97%, sin errores"},
            "memoria": {"ok": True, "label": "Memoria RAM", "note": "MemTest 0 errores"},
            "cargador": {"ok": True, "label": "Cargador", "note": "20V/3.25A comprobado"},
            "bateria": {"ok": True, "label": "Batería", "note": "Curva de descarga lineal"},
        }
    },
    {
        "id": "KIRMA-031", "sku": "KIRMA-031", "brand": "Lenovo", "model": "ThinkPad T490",
        "line": "ThinkPad Serie T (Alta durabilidad empresarial)", "processor": "Intel Core i7-8665U",
        "generation": "8ª Generación", "ram_gb": 16, "ram_label": "16 GB DDR4",
        "storage_gb": 512, "storage_label": "512 GB SSD NVMe M.2",
        "screen_size": 14.0, "screen_label": '14.0" FHD (1920 x 1080)',
        "gpu": "Intel UHD Graphics 620", "os": "Windows 11 Pro 64 bits", "weight": 1.55,
        "aesthetic_grade": "Grado A", "aesthetic_summary": "Excelente condición estética con acabado mate clásico ThinkPad.",
        "battery_pct": 79, "warranty": "6 meses conforme a Ley 1480 de 2011",
        "cost_price": None, "sale_price": 1650000, "stock": 2, "availability": "DISPONIBLE",
        "badge": "RECOMENDADO DURABILIDAD & PROGRAMACIÓN",
        "profiles": ["trabajar", "programar", "diseñar"],
        "kirma_check": {
            "encendido": {"ok": True, "label": "Encendido", "note": "Boot en 12s"},
            "pantalla": {"ok": True, "label": "Pantalla", "note": "IPS sin defectos"},
            "teclado": {"ok": True, "label": "Teclado", "note": "ThinkPad ergonómico verificado"},
            "touchpad": {"ok": True, "label": "Touchpad", "note": "TrackPoint calibrado"},
            "puertos": {"ok": True, "label": "Puertos", "note": "Todos operativos"},
            "conectividad": {"ok": True, "label": "Conectividad", "note": "Wi-Fi y BT OK"},
            "almacenamiento": {"ok": True, "label": "Almacenamiento", "note": "SMART OK"},
            "memoria": {"ok": True, "label": "Memoria RAM", "note": "0 errores"},
            "cargador": {"ok": True, "label": "Cargador", "note": "USB-C 65W OK"},
            "bateria": {"ok": True, "label": "Batería", "note": "Descarga estable"},
        }
    },
    {
        "id": "KIRMA-042", "sku": "KIRMA-042", "brand": "HP", "model": "EliteBook 840 G6",
        "line": "EliteBook 800 Series (Chasis unibody de aluminio)", "processor": "Intel Core i5-8365U",
        "generation": "8ª Generación", "ram_gb": 16, "ram_label": "16 GB DDR4",
        "storage_gb": 256, "storage_label": "256 GB SSD NVMe M.2",
        "screen_size": 14.0, "screen_label": '14.0" FHD IPS',
        "gpu": "Intel UHD Graphics 620", "os": "Windows 11 Pro 64 bits",
        "aesthetic_grade": "Grado A-", "aesthetic_summary": "Muy buen estado con chasis de aluminio intacto.",
        "battery_pct": 72, "warranty": "6 meses conforme a Ley 1480 de 2011",
        "cost_price": None, "sale_price": 1450000, "stock": 1, "availability": "DISPONIBLE",
        "badge": None, "profiles": ["trabajar", "estudiar", "oficina"], "kirma_check": {}
    },
    {
        "id": "KIRMA-055", "sku": "KIRMA-055", "brand": "Dell", "model": "Latitude 5510",
        "line": "Latitude 5000 Series (Empresarial)", "processor": "Intel Core i5-10210U",
        "generation": "10ª Generación", "ram_gb": 16, "ram_label": "16 GB DDR4",
        "storage_gb": 512, "storage_label": "512 GB SSD NVMe M.2",
        "screen_size": 15.6, "screen_label": '15.6" FHD IPS',
        "gpu": "Intel UHD Graphics", "os": "Windows 11 Pro 64 bits",
        "aesthetic_grade": "Grado B+", "aesthetic_summary": "Buen estado general con marcas normales de uso corporativo.",
        "battery_pct": 65, "warranty": "6 meses conforme a Ley 1480 de 2011",
        "cost_price": None, "sale_price": 1590000, "stock": 3, "availability": "DISPONIBLE",
        "badge": None, "profiles": ["trabajar", "oficina"], "kirma_check": {}
    },
    {
        "id": "KIRMA-067", "sku": "KIRMA-067", "brand": "Lenovo", "model": "ThinkPad T14 Gen 1",
        "line": "ThinkPad Serie T (Alta durabilidad empresarial)", "processor": "AMD Ryzen 5 Pro 4650U",
        "generation": "1ª Generación AMD", "ram_gb": 16, "ram_label": "16 GB DDR4",
        "storage_gb": 512, "storage_label": "512 GB SSD NVMe M.2",
        "screen_size": 14.0, "screen_label": '14.0" FHD IPS',
        "gpu": "AMD Radeon Graphics", "os": "Windows 11 Pro 64 bits",
        "aesthetic_grade": "Grado A", "aesthetic_summary": "Excelente estado físico.",
        "battery_pct": 82, "warranty": "6 meses conforme a Ley 1480 de 2011",
        "cost_price": None, "sale_price": 1780000, "stock": 2, "availability": "DISPONIBLE",
        "badge": "RECOMENDADO MULTITAREA", "profiles": ["trabajar", "programar", "diseñar"], "kirma_check": {}
    },
    {
        "id": "KIRMA-078", "sku": "KIRMA-078", "brand": "HP", "model": "EliteBook 850 G7",
        "line": "EliteBook 800 Series", "processor": "Intel Core i7-10510U",
        "generation": "10ª Generación", "ram_gb": 32, "ram_label": "32 GB DDR4",
        "storage_gb": 512, "storage_label": "512 GB SSD NVMe M.2",
        "screen_size": 15.6, "screen_label": '15.6" FHD IPS',
        "gpu": "Intel UHD Graphics", "os": "Windows 11 Pro 64 bits",
        "aesthetic_grade": "Grado A-", "aesthetic_summary": "Muy buen estado con pantalla de gran formato.",
        "battery_pct": 77, "warranty": "6 meses conforme a Ley 1480 de 2011",
        "cost_price": None, "sale_price": 2250000, "stock": 1, "availability": "DISPONIBLE",
        "badge": "RECOMENDADO 32GB RAM", "profiles": ["trabajar", "diseñar", "programar"], "kirma_check": {}
    },
    {
        "id": "KIRMA-089", "sku": "KIRMA-089", "brand": "Dell", "model": "Latitude 7400",
        "line": "Latitude 7000 Series (Ejecutivo Premium)", "processor": "Intel Core i7-8665U",
        "generation": "8ª Generación", "ram_gb": 16, "ram_label": "16 GB DDR4",
        "storage_gb": 512, "storage_label": "512 GB SSD NVMe M.2",
        "screen_size": 14.0, "screen_label": '14.0" FHD IPS',
        "gpu": "Intel UHD Graphics 620", "os": "Windows 11 Pro 64 bits", "weight": 1.25,
        "aesthetic_grade": "Grado A", "aesthetic_summary": "Excelente estado. Chasis de fibra de carbono intacto.",
        "battery_pct": 91, "warranty": "6 meses conforme a Ley 1480 de 2011",
        "cost_price": None, "sale_price": 2050000, "stock": 1, "availability": "DISPONIBLE",
        "badge": "PREMIUM EJECUTIVO", "profiles": ["trabajar", "oficina"], "kirma_check": {}
    },
    {
        "id": "KIRMA-018", "sku": "KIRMA-018", "brand": "Lenovo", "model": "ThinkPad X1 Carbon Gen 7",
        "line": "ThinkPad X1 Series (Ultrabook empresarial)", "processor": "Intel Core i7-8565U",
        "generation": "8ª Generación", "ram_gb": 16, "ram_label": "16 GB LPDDR3",
        "storage_gb": 512, "storage_label": "512 GB SSD NVMe M.2",
        "screen_size": 14.0, "screen_label": '14.0" FHD IPS',
        "gpu": "Intel UHD Graphics 620", "os": "Windows 11 Pro 64 bits", "weight": 1.09,
        "aesthetic_grade": "Grado A", "aesthetic_summary": "Ultrabook ejecutiva en excelente estado.",
        "battery_pct": 84, "warranty": "6 meses conforme a Ley 1480 de 2011",
        "cost_price": None, "sale_price": 2380000, "stock": 1, "availability": "ÚLTIMAS UNIDADES",
        "badge": "ULTRABOOK EJECUTIVA", "profiles": ["trabajar", "oficina"], "kirma_check": {}
    },
]


def migrate():
    print("[*] Iniciando migración de inventory.js -> kirma.db ...")
    init_db()
    conn = get_db()

    migrated = 0
    skipped = 0

    for p in PRODUCTS:
        existing = conn.execute("SELECT id FROM products WHERE id = ?", (p["id"],)).fetchone()
        if existing:
            print(f"  [WARN] {p['id']} ya existe - omitido")
            skipped += 1
            continue

        price_fmt = f"${p['sale_price']:,.0f} COP".replace(",", ".") if p.get("sale_price") else "Consultar"

        conn.execute(
            """INSERT INTO products (
                id, sku, brand, model, line, processor, processor_detail, generation,
                ram_gb, ram_label, storage_gb, storage_label, screen_size, screen_label,
                gpu, os, weight, aesthetic_grade, aesthetic_summary, battery_pct,
                warranty, cost_price, sale_price, price_format, stock, availability,
                status, badge, profiles
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                p["id"], p["sku"], p["brand"], p["model"], p.get("line"), p.get("processor"),
                p.get("processor_detail"), p.get("generation"),
                p.get("ram_gb"), p.get("ram_label"), p.get("storage_gb"), p.get("storage_label"),
                p.get("screen_size"), p.get("screen_label"), p.get("gpu"), p.get("os"),
                p.get("weight"), p.get("aesthetic_grade"), p.get("aesthetic_summary"),
                p.get("battery_pct"), p.get("warranty"), p.get("cost_price"), p.get("sale_price"),
                price_fmt, p.get("stock", 0), p.get("availability", "DISPONIBLE"),
                "borrador",  # Marcar como borrador para revisión
                p.get("badge"),
                json.dumps(p.get("profiles", []), ensure_ascii=False)
            )
        )

        # Kirma Check
        kirma_check = p.get("kirma_check", {})
        for key, check in kirma_check.items():
            conn.execute(
                """INSERT INTO kirma_checks (id, product_id, check_key, ok, label, note)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (str(uuid.uuid4()), p["id"], key,
                 1 if check.get("ok") else 0,
                 check.get("label"), check.get("note"))
            )

        # Imagen principal (SVG existente)
        img_path = f"assets/images/laptops/{p['id'].lower()}-front.svg"
        conn.execute(
            """INSERT INTO product_images (id, product_id, view, path, is_primary)
               VALUES (?, ?, 'front', ?, 1)""",
            (str(uuid.uuid4()), p["id"], img_path)
        )

        migrated += 1
        print(f"  [OK] {p['id']} - {p['brand']} {p['model']} (borrador)")

    conn.commit()
    conn.close()
    print(f"\n[OK] Migración completa: {migrated} productos migrados, {skipped} omitidos.")
    print("[INFO] Todos los productos están en estado 'borrador'. Revísalos desde el admin panel.")


if __name__ == "__main__":
    migrate()
