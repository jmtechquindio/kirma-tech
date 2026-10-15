"""
KIRMA V2 — Schemas Pydantic (Validación de Datos)
"""
from typing import Optional, List, Any
from pydantic import BaseModel, field_validator
import re


# ── AUTH ──────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    role: str


# ── PRODUCTOS ─────────────────────────────────────────────────────────────
class ProductBase(BaseModel):
    sku: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    category: str = "Portátil Corporativo"
    subcategory: Optional[str] = None
    description: Optional[str] = None
    line: Optional[str] = None
    processor: Optional[str] = None
    processor_detail: Optional[str] = None
    generation: Optional[str] = None
    ram_gb: Optional[int] = None
    ram_label: Optional[str] = None
    storage_gb: Optional[int] = None
    storage_label: Optional[str] = None
    screen_size: Optional[float] = None
    screen_label: Optional[str] = None
    gpu: Optional[str] = None
    os: Optional[str] = None
    weight: Optional[float] = None
    aesthetic_grade: Optional[str] = None
    aesthetic_summary: Optional[str] = None
    battery_pct: Optional[int] = None
    warranty: Optional[str] = None
    cost_price: Optional[int] = None
    sale_price: Optional[int] = None
    margin_pct: Optional[float] = None
    stock: int = 0
    availability: str = "DISPONIBLE"
    status: str = "borrador"
    badge: Optional[str] = None
    supplier_id: Optional[str] = None


class ProductCreate(ProductBase):
    id: str  # KIRMA-000001


class ProductUpdate(BaseModel):
    """Todos los campos son opcionales para actualizaciones parciales."""
    sku: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    description: Optional[str] = None
    processor: Optional[str] = None
    ram_gb: Optional[int] = None
    storage_gb: Optional[int] = None
    aesthetic_grade: Optional[str] = None
    aesthetic_summary: Optional[str] = None
    battery_pct: Optional[int] = None
    cost_price: Optional[int] = None
    sale_price: Optional[int] = None
    stock: Optional[int] = None
    availability: Optional[str] = None
    status: Optional[str] = None
    warranty: Optional[str] = None
    supplier_id: Optional[str] = None


class ProductPublic(BaseModel):
    id: str
    sku: Optional[str]
    brand: Optional[str]
    model: Optional[str]
    line: Optional[str]
    processor: Optional[str]
    ram_gb: Optional[int]
    ram_label: Optional[str]
    storage_gb: Optional[int]
    storage_label: Optional[str]
    screen_label: Optional[str]
    gpu: Optional[str]
    aesthetic_grade: Optional[str]
    aesthetic_summary: Optional[str]
    battery_pct: Optional[int]
    sale_price: Optional[int]
    price_format: Optional[str]
    availability: str
    stock: int
    warranty: Optional[str]
    badge: Optional[str]
    images: List[dict] = []
    kirma_check: List[dict] = []

    class Config:
        from_attributes = True


# ── IMPORTACIONES ─────────────────────────────────────────────────────────
class ImportCreate(BaseModel):
    supplier_id: Optional[str] = None
    gemini_api_key: Optional[str] = None  # Si no está en env, se puede pasar desde el panel


class ImportItemAction(BaseModel):
    action: str  # approved | rejected | edited | ignored
    final_price: Optional[int] = None
    final_cost: Optional[int] = None


class BulkApproveRequest(BaseModel):
    item_ids: Optional[List[str]] = None  # None = aprobar todos los válidos


# ── HISTORIAL ─────────────────────────────────────────────────────────────
class PriceHistoryEntry(BaseModel):
    id: str
    product_id: str
    old_sale: Optional[int]
    new_sale: Optional[int]
    old_cost: Optional[int]
    new_cost: Optional[int]
    changed_by: Optional[str]
    import_id: Optional[str]
    source_file: Optional[str]
    reason: Optional[str]
    changed_at: str


# ── CONFIGURACIÓN ─────────────────────────────────────────────────────────
class ConfigUpdate(BaseModel):
    key: str
    value: str


# ── RESPUESTAS GENÉRICAS ──────────────────────────────────────────────────
class APIResponse(BaseModel):
    ok: bool
    message: str
    data: Optional[Any] = None
