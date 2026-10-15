"""
KIRMA V2 — Base de Datos SQLite
Crea todas las tablas con integridad referencial.
"""
import sqlite3
import json
from pathlib import Path
from config import DB_PATH, UPLOADS_DIR

def get_db():
    """Retorna una conexión a la base de datos con WAL y FK habilitados."""
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.execute("PRAGMA synchronous=NORMAL")
    return conn

def init_db():
    """Inicializa la base de datos y crea todas las tablas."""
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    conn = get_db()
    c = conn.cursor()

    # ── USUARIOS ──────────────────────────────────────────────────────────
    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id          TEXT PRIMARY KEY,
        username    TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role        TEXT NOT NULL DEFAULT 'admin',
        active      INTEGER NOT NULL DEFAULT 1,
        created_at  TEXT NOT NULL DEFAULT (datetime('now')),
        last_login  TEXT
    )""")

    # ── PROVEEDORES ───────────────────────────────────────────────────────
    c.execute("""
    CREATE TABLE IF NOT EXISTS suppliers (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        contact     TEXT,
        email       TEXT,
        phone       TEXT,
        notes       TEXT,
        active      INTEGER NOT NULL DEFAULT 1,
        created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )""")

    # ── PRODUCTOS ─────────────────────────────────────────────────────────
    c.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id              TEXT PRIMARY KEY,
        sku             TEXT UNIQUE,
        brand           TEXT,
        model           TEXT,
        category        TEXT DEFAULT 'Portátil Corporativo',
        subcategory     TEXT,
        description     TEXT,
        line            TEXT,
        processor       TEXT,
        processor_detail TEXT,
        generation      TEXT,
        ram_gb          INTEGER,
        ram_label       TEXT,
        ram_detail      TEXT,
        storage_gb      INTEGER,
        storage_label   TEXT,
        storage_detail  TEXT,
        screen_size     REAL,
        screen_label    TEXT,
        screen_detail   TEXT,
        gpu             TEXT,
        os              TEXT,
        weight          REAL,
        ports           TEXT,  -- JSON array
        aesthetic_grade TEXT,
        aesthetic_summary TEXT,
        aesthetic_details TEXT,
        aesthetic_marks TEXT,   -- JSON array
        particularities TEXT,
        battery_pct     INTEGER,
        battery_status  TEXT,
        battery_detail  TEXT,
        battery_note    TEXT,
        charger         TEXT,
        charger_type    TEXT,
        includes        TEXT,   -- JSON array
        warranty        TEXT,
        cost_price      INTEGER,
        sale_price      INTEGER,
        margin_pct      REAL,
        price_format    TEXT,
        stock           INTEGER DEFAULT 0,
        availability    TEXT DEFAULT 'DISPONIBLE',
        status          TEXT DEFAULT 'borrador', -- activo | borrador | archivado
        badge           TEXT,
        profiles        TEXT,   -- JSON array
        ideal_for       TEXT,   -- JSON array
        supplier_id     TEXT REFERENCES suppliers(id),
        created_at      TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
    )""")

    c.execute("CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability)")

    # ── KIRMA CHECK ───────────────────────────────────────────────────────
    c.execute("""
    CREATE TABLE IF NOT EXISTS kirma_checks (
        id          TEXT PRIMARY KEY,
        product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        check_key   TEXT NOT NULL,
        ok          INTEGER NOT NULL DEFAULT 1,
        label       TEXT,
        note        TEXT,
        checked_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )""")

    c.execute("CREATE INDEX IF NOT EXISTS idx_kirma_checks_product ON kirma_checks(product_id)")

    # ── IMÁGENES ──────────────────────────────────────────────────────────
    c.execute("""
    CREATE TABLE IF NOT EXISTS product_images (
        id          TEXT PRIMARY KEY,
        product_id  TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        view        TEXT NOT NULL, -- front | keyboard | ports | lid
        path        TEXT NOT NULL,
        is_primary  INTEGER NOT NULL DEFAULT 0
    )""")

    c.execute("CREATE INDEX IF NOT EXISTS idx_images_product ON product_images(product_id)")

    # ── HISTORIAL DE PRECIOS ──────────────────────────────────────────────
    c.execute("""
    CREATE TABLE IF NOT EXISTS price_history (
        id          TEXT PRIMARY KEY,
        product_id  TEXT NOT NULL REFERENCES products(id),
        old_cost    INTEGER,
        new_cost    INTEGER,
        old_sale    INTEGER,
        new_sale    INTEGER,
        changed_by  TEXT,
        import_id   TEXT,
        source_file TEXT,
        supplier_id TEXT,
        reason      TEXT,
        changed_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )""")

    c.execute("CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(product_id)")

    # ── IMPORTACIONES ─────────────────────────────────────────────────────
    c.execute("""
    CREATE TABLE IF NOT EXISTS imports (
        id              TEXT PRIMARY KEY,  -- IMP-2026-10-0001
        filename        TEXT NOT NULL,
        file_path       TEXT,
        file_type       TEXT,
        file_size       INTEGER,
        supplier_id     TEXT REFERENCES suppliers(id),
        uploaded_by     TEXT,
        uploaded_at     TEXT NOT NULL DEFAULT (datetime('now')),
        processed_at    TEXT,
        status          TEXT NOT NULL DEFAULT 'procesando',
        total_records   INTEGER DEFAULT 0,
        new_count       INTEGER DEFAULT 0,
        update_count    INTEGER DEFAULT 0,
        unchanged_count INTEGER DEFAULT 0,
        review_count    INTEGER DEFAULT 0,
        rejected_count  INTEGER DEFAULT 0,
        gemini_key_used TEXT,  -- 'env' | 'panel' (nunca la clave real)
        raw_text        TEXT,  -- Texto extraído del archivo
        error_message   TEXT
    )""")

    c.execute("CREATE INDEX IF NOT EXISTS idx_imports_status ON imports(status)")

    # ── ÍTEMS DE IMPORTACIÓN ─────────────────────────────────────────────
    c.execute("""
    CREATE TABLE IF NOT EXISTS import_items (
        id                  TEXT PRIMARY KEY,
        import_id           TEXT NOT NULL REFERENCES imports(id) ON DELETE CASCADE,
        line_number         INTEGER,
        raw_text            TEXT,
        extracted_brand     TEXT,
        extracted_model     TEXT,
        extracted_processor TEXT,
        extracted_ram       TEXT,
        extracted_storage   TEXT,
        extracted_price     INTEGER,
        extracted_stock     INTEGER,
        extracted_sku       TEXT,
        confidence          REAL DEFAULT 0.0,
        matched_product_id  TEXT REFERENCES products(id),
        status              TEXT NOT NULL DEFAULT 'REVISION',
        review_reason       TEXT,
        admin_action        TEXT,   -- approved | rejected | edited | ignored
        final_price         INTEGER,
        final_cost          INTEGER,
        processed_at        TEXT
    )""")

    c.execute("CREATE INDEX IF NOT EXISTS idx_items_import ON import_items(import_id)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_items_status ON import_items(status)")

    # ── AUDITORÍA ─────────────────────────────────────────────────────────
    c.execute("""
    CREATE TABLE IF NOT EXISTS audit_log (
        id          TEXT PRIMARY KEY,
        user_id     TEXT,
        action      TEXT NOT NULL,
        resource    TEXT,
        resource_id TEXT,
        old_value   TEXT,
        new_value   TEXT,
        import_id   TEXT,
        ip          TEXT,
        created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )""")

    c.execute("CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_log(resource, resource_id)")

    # ── CONFIGURACIÓN DEL SISTEMA ─────────────────────────────────────────
    c.execute("""
    CREATE TABLE IF NOT EXISTS system_config (
        key     TEXT PRIMARY KEY,
        value   TEXT,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )""")

    # Valores por defecto
    c.execute("""
    INSERT OR IGNORE INTO system_config (key, value) VALUES
        ('whatsapp_number', '+57 314 881 3857'),
        ('whatsapp_raw', '573148813857'),
        ('email', 'kirmatechquindio@gmail.com'),
        ('city', 'Armenia, Quindío, Colombia'),
        ('linkedin', 'https://www.linkedin.com/in/jmtechquindio/'),
        ('default_margin_pct', '30'),
        ('gemini_api_key_panel', ''),
        ('import_counter', '0')
    """)

    conn.commit()
    conn.close()
    print("[OK] Base de datos KIRMA V2 inicializada.")

if __name__ == "__main__":
    init_db()
