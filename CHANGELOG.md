# CHANGELOG — KIRMA V2

Todas las notas notables de cambios para KIRMA V2 se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y el proyecto adhiere al Control Semántico de Versiones [SemVer](https://semver.org/).

## [2.0.0] — 2026-10-15

### Añadido
- **Módulo de Importación Inteligente de Listas de Precios**:
  - Soporte de subida y validación para archivos PDF, JPG, JPEG, PNG y WEBP.
  - Flujo forzado y auditable: `CARGAR → VALIDAR → EXTRAER → INTERPRETAR → COMPARAR → REVISAR → APROBAR → ACTUALIZAR → REGISTRAR`.
  - Extracción híbrida: soporte oficial para modelos multimodal Google Gemini (`gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash-exp`) con fallback heurístico determinista para PDFs estructurados sin consumo de tokens ni dependencia de API keys.
  - Detección y clasificación inteligente contra inventario existente: `NUEVO`, `ACTUALIZAR`, `SIN_CAMBIOS`, `POSIBLE_DUPLICADO` y `REVISION`.
  - Asignación estructurada de KIRMA ID (`KIRMA-XXXXXX`).
  - Historial de precios (`price_history`) con referencia al archivo original, usuario, identificador de importación (`IMP-YYYY-MM-NNNN`) y motivo del cambio.
  - Trazabilidad y auditoría administrativa (`audit_log`) con IP y sellos de tiempo UTC.
- **SEO Técnico**:
  - Generación de `robots.txt` con protección de rutas administrativas y enlaces a sitemap.
  - Generación de `sitemap.xml` canónico estructurado.
  - Inclusión de etiqueta `canonical` y etiquetas Open Graph (`og:url`, `og:site_name`, `og:locale`).
- **QA y Pruebas Automatizadas**:
  - Creación de `test_suite_complete.py` con 10 pruebas unitarias y de integración de extremo a extremo que validan el 100% de los requerimientos de la plataforma.

### Modificado
- **Línea Oficial de WhatsApp**:
  - Unificación de todos los puntos de contacto, botones del catálogo, fichas técnicas y configuración del sistema al canal oficial **+57 314 881 3857** (`573148813857`).
- **Robustez del Comparador**:
  - Implementación de validaciones con encadenamiento opcional (`?.`) para productos importados que aún no posean todos los campos secundarios, evitando excepciones en el cliente.
- **Rutas de la API REST**:
  - Implementación de alias bidireccionales para `/api/admin/price-history/{productId}` y `/api/admin/import-items/{id}` para garantizar compatibilidad con frontend y especificaciones OpenAPI.

### Corregido
- Resuelto error crítico de conexión e incompatibilidad con modelo deprecado en Gemini Vision.
- Corregida la ausencia del método `openChat` en `WhatsAppService` que impedía iniciar el chat de consulta desde la ficha modal del producto.
- Resuelto problema de productos en estado borrador ocultos en el catálogo público: activación y sincronización de los 8 equipos corporativos base en la base de datos `kirma.db`.
