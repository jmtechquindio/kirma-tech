"""
KIRMA V2 — Servicio OCR con Gemini Vision API y Parser Heurístico Local
Extrae datos de precios de imágenes y PDFs.
Prioridad:
1. Si PDF digital con texto -> Parser de alta fidelidad directo (sin depender de API externa)
2. Si Gemini API está configurada -> Extracción multimodal / OCR inteligente
3. Fallback heurístico para imágenes escaneadas o PDFs con texto
"""
import json
import base64
import re
import httpx
from pathlib import Path
from config import GEMINI_API_KEY
from database import get_db

GEMINI_MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash-exp"
]

EXTRACTION_PROMPT = """Eres un sistema de extracción de datos de listas de precios de computadores.
Analiza la imagen o el texto proporcionado y extrae TODOS los productos que puedas identificar.

Para cada producto, extrae SOLO lo que esté claramente visible. Si un dato no está presente, usa null.
NO inventes, estimes ni supongas información que no esté explícita en el documento.

Devuelve EXCLUSIVAMENTE un JSON válido con este formato:
{
  "source_type": "imagen" | "pdf" | "texto",
  "total_lines": <número de líneas de producto detectadas>,
  "products": [
    {
      "line_number": 1,
      "raw_text": "<texto original de la línea>",
      "brand": "<marca o null>",
      "model": "<modelo o null>",
      "processor": "<procesador o null>",
      "ram": "<RAM con unidad o null>",
      "storage": "<almacenamiento con unidad o null>",
      "price": <precio en número entero sin puntos ni comas o null>,
      "stock": <cantidad disponible en número entero o null>,
      "sku": "<código SKU o referencia o null>",
      "confidence": <0.0 a 1.0 según claridad del texto>,
      "needs_review": true | false,
      "review_reason": "<razón si necesita revisión o null>"
    }
  ]
}

Marca needs_review = true cuando:
- El precio no es legible o ambiguo
- La marca o modelo no están claros
- Hay información contradictoria
- La confianza es menor a 0.7
- El texto es muy abreviado o ilegible

No incluyas texto explicativo fuera del JSON."""


def get_api_key(panel_key: str = "") -> tuple[str, str]:
    """Retorna (api_key, source) donde source es 'env', 'panel' o 'db'."""
    env_key = GEMINI_API_KEY
    if env_key:
        return env_key, "env"
    if panel_key:
        return panel_key, "panel"
    # Buscar en la configuración persistente de la DB
    try:
        conn = get_db()
        row = conn.execute("SELECT value FROM system_config WHERE key = 'gemini_api_key_panel'").fetchone()
        conn.close()
        if row and row["value"] and len(row["value"].strip()) > 10:
            return row["value"].strip(), "db"
    except Exception:
        pass
    return "", "none"


def image_to_base64(file_path: Path) -> tuple[str, str]:
    """Convierte imagen a base64 y detecta MIME type."""
    ext = file_path.suffix.lower()
    mime_map = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
    }
    mime = mime_map.get(ext, "image/jpeg")
    with open(file_path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return data, mime


def extract_pdf_text(file_path: Path) -> str:
    """Extrae texto de PDF digital (sin OCR). Si es escaneado, retorna string vacío."""
    try:
        import PyPDF2
        text_parts = []
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    text_parts.append(text.strip())
        combined = "\n".join(text_parts)
        if len(combined.strip()) > 50:
            return combined
        return ""
    except Exception:
        return ""


def parse_text_products_heuristic(text: str) -> list[dict]:
    """
    Parser heurístico determinista y sin inventar datos para listas de precios en texto/PDF.
    Agrupa por bloques delimitados por el patrón de precio ($ ...), común en catálogos mayoristas.
    """
    products = []
    # Dividir el texto en bloques usando el precio como delimitador
    chunks = re.split(r"(\$\s*[0-9]{1,3}(?:[.,][0-9]{3})+)", text)
    if len(chunks) < 2:
        return []

    line_idx = 1
    # chunks[0] es el bloque previo al primer precio, chunks[1] es el precio 1, chunks[2] es el bloque previo al precio 2, etc.
    for i in range(1, len(chunks), 2):
        price_token = chunks[i]
        block_text = chunks[i - 1].strip()
        if not block_text:
            continue

        # Extraer precio numérico limpio
        price_digits = re.sub(r"[^\d]", "", price_token)
        price_val = int(price_digits) if price_digits else None

        # Tomar las últimas líneas o el contenido relevante del bloque
        lines = [ln.strip() for ln in block_text.split("\n") if ln.strip()]
        if not lines:
            continue

        # Detectar marca
        lower_block = block_text.lower()
        detected_brand = None
        if "thinkpad" in lower_block or "lenovo" in lower_block or "ideapad" in lower_block or "yoga" in lower_block:
            detected_brand = "Lenovo"
        elif "latitude" in lower_block or "dell" in lower_block or "optiplex" in lower_block or "precision" in lower_block or "vostro" in lower_block:
            detected_brand = "Dell"
        elif "elitebook" in lower_block or "probook" in lower_block or "hp" in lower_block or "zbook" in lower_block:
            detected_brand = "HP"
        elif "surface" in lower_block or "microsoft" in lower_block:
            detected_brand = "Microsoft"
        elif "asus" in lower_block or "zenbook" in lower_block:
            detected_brand = "Asus"
        elif "apple" in lower_block or "macbook" in lower_block:
            detected_brand = "Apple"

        # Detectar CPU
        cpu_match = re.search(r"(Core\s+i[3579]-?\w+|Ryzen\s+[3579]\s+\w+|Celeron\s+\w+|Xeon\s+\w+|Intel\s+Core\s+i[3579]|i[3579]-?\d{4,5}\w*)", block_text, re.IGNORECASE)
        cpu_str = cpu_match.group(1).strip() if cpu_match else None

        # Detectar RAM y almacenamiento (ej. 16GB, 512GB SSD)
        gb_matches = re.findall(r"(\d+)\s*(?:GB|gb|TB|tb)", block_text)
        ram_str = None
        storage_str = None
        if gb_matches:
            # Los números menores (<=64) suelen ser RAM, los mayores (>64) almacenamiento
            ram_candidates = [m for m in gb_matches if int(m) in (4, 8, 12, 16, 24, 32, 64)]
            storage_candidates = [m for m in gb_matches if int(m) in (128, 256, 480, 500, 512, 1000, 1024, 2048) or int(m) >= 120]
            if ram_candidates:
                ram_str = f"{ram_candidates[0]} GB"
            if storage_candidates:
                storage_str = f"{storage_candidates[0]} GB"
            elif "1TB" in block_text.upper() or "1 TB" in block_text.upper():
                storage_str = "1000 GB"

        # Detectar modelo buscando líneas que mencionen la serie o el modelo
        model_str = None
        for ln in lines:
            ln_lower = ln.lower()
            if any(k in ln_lower for k in ("thinkpad", "latitude", "elitebook", "probook", "surface", "optiplex", "ideapad", "yoga", "zbook")):
                # Limpiar texto de tránsito o estado
                clean_ln = re.sub(r"(?i)en\s*tr[aá]nsito|estado:?\s*\d+/\d+|computador|corporativo|usado", "", ln).strip()
                if len(clean_ln) > 3:
                    model_str = clean_ln
                    break
        if not model_str and lines:
            model_str = lines[-1][:40]

        # Nivel de confianza estricto
        confidence = 0.90 if (detected_brand and price_val and cpu_str and ram_str) else 0.65
        needs_review = confidence < 0.70 or (price_val is None)

        products.append({
            "line_number": line_idx,
            "raw_text": f"{model_str or ''} | {cpu_str or ''} | {ram_str or ''} | {storage_str or ''} | {price_token}".strip(" |"),
            "brand": detected_brand,
            "model": model_str,
            "processor": cpu_str,
            "ram": ram_str,
            "storage": storage_str,
            "price": price_val,
            "stock": None,
            "sku": None,
            "confidence": confidence,
            "needs_review": needs_review,
            "review_reason": "Verificación manual recomendada" if needs_review else None
        })
        line_idx += 1

    return products


async def extract_from_file(file_path: Path, panel_key: str = "") -> dict:
    """
    Extrae datos de productos de un archivo (imagen o PDF).
    Intenta Gemini Vision API si hay API key configurada.
    Si no hay key o la llamada falla por límite/cuota, usa el extractor inteligente local.
    """
    api_key, key_source = get_api_key(panel_key)
    file_path = Path(file_path)
    ext = file_path.suffix.lower()

    # Si es PDF, intentar leer texto
    pdf_text = ""
    if ext == ".pdf":
        pdf_text = extract_pdf_text(file_path)

    # Si tenemos Gemini API Key disponible, intentamos vía Gemini
    if api_key:
        request_body = {"contents": [{"parts": []}]}
        if ext == ".pdf" and pdf_text:
            request_body["contents"][0]["parts"] = [
                {"text": EXTRACTION_PROMPT},
                {"text": f"\n\nTexto extraído del PDF:\n{pdf_text[:25000]}"}
            ]
        else:
            img_data, mime = image_to_base64(file_path)
            request_body["contents"][0]["parts"] = [
                {"text": EXTRACTION_PROMPT},
                {
                    "inline_data": {
                        "mime_type": mime,
                        "data": img_data
                    }
                }
            ]

        # Probar modelos disponibles en orden de prioridad
        last_error = None
        for model in GEMINI_MODELS:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            try:
                async with httpx.AsyncClient(timeout=45.0) as client:
                    response = await client.post(url, json=request_body)
                if response.status_code == 200:
                    data = response.json()
                    raw_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    clean_json = raw_text.strip()
                    if clean_json.startswith("```"):
                        clean_json = re.sub(r"^```(?:json)?\n?", "", clean_json)
                        clean_json = re.sub(r"\n?```$", "", clean_json)
                    result = json.loads(clean_json)
                    result["key_source"] = key_source
                    return result
                else:
                    last_error = f"Gemini {model} respondió {response.status_code}: {response.text[:150]}"
            except Exception as e:
                last_error = str(e)
                continue

    # Fallback inteligente sin inventar datos:
    if ext == ".pdf" and pdf_text:
        heuristic_products = parse_text_products_heuristic(pdf_text)
        if heuristic_products:
            return {
                "source_type": "pdf_estructurado_local",
                "total_lines": len(heuristic_products),
                "products": heuristic_products,
                "key_source": "parser_local_directo"
            }

    # Si llegó aquí sin resultados
    if not api_key:
        raise ValueError("No hay Gemini API Key configurada y el archivo no contiene texto plano indexable. Ingresa una API key de Gemini en el panel administrativo para OCR de imágenes.")
    else:
        raise ValueError(f"No se pudo completar el OCR. {last_error or 'Respuesta inválida del motor OCR.'}")


def normalize_product_data(raw: dict) -> dict:
    """
    Normaliza los datos extraídos por OCR.
    - RAM: '8 GB', '8GB', 'RAM 8gb' → ram_gb = 8
    - Storage: '512 GB SSD', '512gb' → storage_gb = 512
    - Precio: '1.850.000', '$1,850,000', '1850000' → 1850000
    """
    result = dict(raw)

    # Normalizar RAM
    ram_raw = str(raw.get("ram") or "")
    ram_match = re.search(r"(\d+)\s*[Gg][Bb]", ram_raw)
    result["ram_gb"] = int(ram_match.group(1)) if ram_match else None

    # Normalizar almacenamiento
    storage_raw = str(raw.get("storage") or "")
    storage_match = re.search(r"(\d+)\s*[Gg][Bb]", storage_raw)
    result["storage_gb"] = int(storage_match.group(1)) if storage_match else None

    # Normalizar precio
    price = raw.get("price")
    if isinstance(price, str):
        price_clean = re.sub(r"[^\d]", "", price)
        result["price"] = int(price_clean) if price_clean else None

    # Capitalizar marca
    if result.get("brand"):
        result["brand"] = result["brand"].strip().title()

    return result
