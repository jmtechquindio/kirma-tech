# KIRMA — Tecnología que renace.

Plataforma digital profesional para **KIRMA**, empresa colombiana especializada en la comercialización de **equipos corporativos remanufacturados** (Dell Latitude, Lenovo ThinkPad, HP EliteBook), acompañados de servicio técnico especializado, diagnóstico de laboratorio y garantía por escrito.

---

## 1. Identidad de Marca y Dirección de Arte

* **Concepto central:** «Tecnología que renace.»
* **Eje comercial:** «Equipos corporativos remanufacturados, seleccionados para volver a trabajar.»
* **Hero Headline:** «EQUIPOS CORPORATIVOS. LISTOS PARA TRABAJAR.»
* **Subtítulo:** «Tecnología que renace. Equipos corporativos remanufacturados, soporte técnico y acompañamiento real.»
* **Personalidad visual:** Corporativa, técnica, editorial, sobria, humana y transparente.
* **Paleta visual:**
  * **Verde KIRMA** (`#164e39` / `#2a8a65`): Identidad, acento y señalización técnica.
  * **Marrón / Tierra** (`#6e4626` / `#8b5b33`): Durabilidad, materia y tags de inventario.
  * **Blanco / Crema** (`#fbfbfa` / `#f4f1ea`): Fondos limpios tipo hoja de especificaciones.
  * **Carbón suave** (`#171918` / `#2e3330`): Tipografía de alto contraste descansado.
* **Inspiración de diseño:** Fichas técnicas de fabricantes, etiquetas de inventario corporativo (`KIRMA / 024`), asset tags y catálogos editoriales contemporáneos. Cero estética genérica de IA, fondos oscuros ni promesas vacías.

---

## 2. Módulos y Características Implementadas

1. **Header & Navegación Responsiva:**
   - Logotipo con concepto oficial «Tecnología que renace.»
   - Navegación clara y drawer móvil táctil accesible.
   - CTA permanente: **HABLAR POR WHATSAPP**.
2. **Sección Educativa:**
   - Explicación honesta de qué es un equipo remanufacturado.
   - Comparativa directa: **Nuevo vs. Usado vs. Remanufacturado**.
   - Justificación técnica: ¿Por qué equipos corporativos? (Chasis, puertos, refrigeración, mantenimiento).
3. **Catálogo de Equipos:**
   - Filtros dinámicos en tiempo real (Marca, RAM, Almacenamiento, Rango de Precio en COP).
   - Búsqueda instantánea de texto libre.
   - Badges de disponibilidad transparente (`DISPONIBLE`, `ÚLTIMAS UNIDADES`, `AGOTADO`).
4. **Ficha KIRMA (Asset Tag):**
   - Nomenclatura corporativa numerada (ej. `KIRMA / 024`).
   - Especificaciones exactas del fabricante (CPU, RAM, SSD NVMe, Pantalla IPS, GPU).
   - Estado físico honesto y desglosado (Funcionamiento vs. Condición estética vs. Particularidades).
   - Salud de batería evaluada en diagnóstico y cargador especificado.
   - Desglose de «¿Qué incluye esta unidad?».
   - Precios claros en pesos colombianos (COP).
   - CTA directo a WhatsApp: «QUIERO ESTE EQUIPO».
5. **Protocolo KIRMA CHECK (10/10):**
   - Verificación de 10 puntos de laboratorio (Encendido, Pantalla, Teclado, Touchpad, Puertos, Conectividad, Almacenamiento, RAM, Cargador, Batería).
   - Cláusula de transparencia: solo se marcan pruebas efectivamente realizadas.
6. **Encuentra tu Equipo (Buscador por Necesidad):**
   - Quiz interactivo basado en tareas: *Estudiar*, *Trabajar*, *Oficina*, *Programar*, *Diseño*, *Alto rendimiento*.
   - Muestra el criterio técnico mínimo y los equipos recomendados.
7. **Comparador KIRMA:**
   - Bandeja flotante persistente con slots de selección (hasta 3 equipos).
   - Modal tabular lado a lado con todas las especificaciones y diferencias clave.
8. **Cómo Trabajamos & Envíos Nacionales:**
   - Proceso en 5 pasos: *01 Selección*, *02 Revisión*, *03 Preparación*, *04 Entrega*, *05 Acompañamiento*.
   - Sección especial para compradores en otras ciudades de Colombia (transportadoras aliadas, tiempos variables y costos transparentes).
9. **Centro de Soporte Técnico:**
   - Flujo paso a paso (01 a 04) para asistencia remota supervisada.
   - Enlaces oficiales a instaladores de AnyDesk y TeamViewer.
   - **Aviso fundamental de seguridad:** advertencia de copia de seguridad (backup) antes de cualquier restauración o formateo de Windows para prevenir pérdida de datos.
10. **Garantía KIRMA (6 Meses):**
    - Cobertura legal conforme a la Ley 1480 de 2011 (Estatuto del Consumidor de Colombia).
    - Distinción entre garantía y soporte técnico.
    - Exclusiones causales legales (líquidos, golpes, sobretensiones externas).
    - Regla de suspensión del término de garantía durante el tiempo privado de uso.
    - Procedimiento para falla repetida.
11. **Módulo de Administración con IA (`admin.html`):**
    - Subida y lectura inteligente de listas o fotos de inventario en JPG/PNG.
    - Reconocimiento multimodal con Gemini Vision API (opcional) y motor estructurado integrado.
    - Generador procedimental de diagramas vectoriales SVG por referencia de marca y modelo.
    - Tabla de revisión y validación previa (Staging) con edición directa de precios en COP.
    - Publicación inmediata al catálogo activo (`index.html`) y descarga del código `inventory.js`.
12. **Documentación Interna KIRMA (Admin / Laboratory Architecture):**
    - Visor interactivo de formatos operacionales: Ficha de Condición (FOR-TEC-001), Kirma Check Lab (FOR-TEC-002), Recepción de Garantía (FOR-GAR-001), Diagnóstico Técnico (FOR-GAR-002) y Acta de Entrega (FOR-GAR-003).
13. **Integración Contextual con WhatsApp:**
    - Generador de enlaces `https://wa.me/...` con mensajes preconfigurados según el contexto del usuario (consulta de producto, asesoría, comparador, soporte o garantía).
13. **Preguntas Frecuentes (FAQ):**
    - 12 preguntas y respuestas honestas sobre baterías, cargadores, envíos y garantías.
14. **Nosotros & Contacto:**
    - Manifiesto sobrio sin cifras inventadas.
    - Canales de atención con base de operaciones en Armenia, Quindío, Colombia

---

## 3. Estructura de Archivos

```text
kirma-tech/
├── index.html                   # Entrada principal semántica y accesible (Schema.org JSON-LD, ARIA)
├── README.md                    # Documentación técnica y comercial del proyecto
├── css/
│   ├── variables.css            # Tokens de diseño (Verde KIRMA, Tierra, Crema, Carbón)
│   ├── base.css                 # Reset, tipografía editorial y contenedores
│   ├── components.css           # Botones, Ficha KIRMA, Kirma Check, Badges, Modales, Drawer
│   ├── sections.css             # Hero, Educativo, Catálogo, Finder, Soporte, Garantía, FAQ, Footer
│   └── responsive.css           # Adaptaciones mobile-first y navegación táctil
├── js/
│   ├── app.js                   # Orquestador principal, navegación y eventos globales
│   ├── data/
│   │   ├── inventory.js         # Base de datos estructurada de laptops corporativas reales
│   │   └── internal_records.js  # Esquemas de formatos técnicos y actas de garantía
│   └── modules/
│       ├── catalog.js           # Búsqueda, filtros por facetas y renderizado reactivo
│       ├── finder.js            # Recomendador interactivo según necesidades de uso
│       ├── comparator.js        # Lógica de comparación multi-equipo lado a lado
│       ├── product_modal.js     # Modal de Ficha KIRMA con Kirma Check y fotos detalladas
│       ├── support.js           # Guías de soporte remoto, links oficiales y avisos de backup
│       ├── warranty.js          # Guía legal interactiva y flujo de solicitud de garantía
│       ├── internal_docs.js     # Visor de formatos técnicos de laboratorio
│       └── whatsapp.js          # Generación de URLs de WhatsApp con copy humano
└── assets/
    ├── icons/                   # Iconografía técnica SVG (CPU, RAM, SSD, Screen, Battery, Shield)
    └── images/
        └── laptops/             # Ilustraciones vectoriales técnicas de hardware (Dell, Lenovo, HP)
```

---

## 4. Cómo Ejecutar el Proyecto Localmente

El proyecto está construido con estándares web modernos nativos (HTML5 semántico, CSS3 modular con variables y JavaScript ES Modules), lo que garantiza **cero dependencias frágiles, carga instantánea y máxima compatibilidad**:

### Opción 1: Servidor Local con Python (Recomendado)
Desde la terminal en el directorio del proyecto:
```powershell
python -m http.server 8000
```
Luego abre en tu navegador:
```text
http://localhost:8000
```

### Opción 2: Apertura directa
Puedes abrir directamente el archivo `index.html` en cualquier navegador moderno (Chrome, Edge, Firefox, Safari).

---

## 5. Hoja de Ruta para Ecommerce y Panel Administrativo

La arquitectura de datos (`inventory.js` e `internal_records.js`) ha sido diseñada para una fácil migración a un backend de producción (Node.js/Express, FastAPI o base de datos PostgreSQL/Supabase):
1. **Pasarela de pagos colombiana:** Integración con Wompi, ePayco o PayU para transacciones con PSE, tarjetas de crédito y transferencias bancarias.
2. **Panel de administración:** CRUD para alta de nuevos lotes, edición de precios en COP, actualización de estados de disponibilidad (`DISPONIBLE` -> `AGOTADO`) y carga de fotos reales por unidad.
3. **Gestión de garantías y seriales:** Módulo de radicación de casos vinculado a los formatos técnicos internos (FOR-GAR-001 a 003).
