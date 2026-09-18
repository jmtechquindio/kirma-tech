/**
 * KIRMA — Modal de Ficha Técnica Individual ("FICHA KIRMA").
 * Presenta inspección punto por punto, Kirma Check honesto,
 * estado físico real sin ocultar imperfecciones, qué incluye y conversión a WhatsApp.
 */

import { INVENTORY, getLiveInventory } from "../data/inventory.js";
import { WhatsAppService } from "./whatsapp.js";

export const ProductModalService = {
  currentProduct: null,

  open(productId) {
    const product = getLiveInventory().find(item => item.id === productId);
    if (!product) return;

    this.currentProduct = product;
    const modalBackdrop = document.getElementById("product-detail-modal");
    const modalBody = document.getElementById("product-detail-content");

    if (!modalBackdrop || !modalBody) return;

    const waProductUrl = WhatsAppService.forProduct(product);

    modalBody.innerHTML = `
      <div class="ficha-kirma-container">
        <!-- Barra de Cabecera Asset Tag -->
        <div class="ficha-header-bar">
          <div>
            <span class="ficha-brand-tag">[ FICHA TÉCNICA KIRMA ]</span>
            <span style="font-family: var(--font-mono); font-size: 0.8125rem; margin-left: 8px; color: #d1fae5;">CORPORATE REFURBISHED</span>
          </div>
          <span class="asset-tag" style="background: #ffffff; color: var(--kirma-green-900);">${product.tag}</span>
        </div>

        <!-- Título y Modelo -->
        <div class="ficha-title-block">
          <h2 class="ficha-model">${product.marca} ${product.modelo}</h2>
          <div class="ficha-meta">
            <span><strong>Línea:</strong> ${product.linea}</span>
            <span>•</span>
            <span><strong>Estado:</strong> ${product.estado}</span>
            <span>•</span>
            <span><strong>Garantía:</strong> 6 Meses</span>
            <span>•</span>
            <span class="badge badge-disponible">${product.disponibilidad}</span>
          </div>
        </div>

        <!-- Cuerpo de la Ficha en dos columnas -->
        <div style="padding: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          
          <!-- Columna Izquierda: Galería y Fotos Reales del Equipo -->
          <div>
            <div style="background: #ffffff; border: 1px solid var(--kirma-border-main); border-radius: var(--radius-sm); padding: 1rem; text-align: center; margin-bottom: 1rem;">
              <img id="main-product-image" 
                   src="assets/images/laptops/${product.id.toLowerCase()}-front.svg" 
                   alt="${product.marca} ${product.modelo} frontal" 
                   style="max-height: 240px; margin: 0 auto;" />
            </div>

            <!-- Miniaturas de Inspección Visual -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1.5rem;">
              <button class="gallery-thumb active" data-src="assets/images/laptops/${product.id.toLowerCase()}-front.svg" style="border: 2px solid var(--kirma-green-700); padding: 4px; background: #fff; cursor: pointer; border-radius: 2px;">
                <span style="font-family: var(--font-mono); font-size: 0.625rem; display: block;">FRONTAL</span>
              </button>
              <button class="gallery-thumb" data-src="assets/images/laptops/${product.id.toLowerCase()}-keyboard.svg" style="border: 1px solid var(--kirma-border-main); padding: 4px; background: #fff; cursor: pointer; border-radius: 2px;">
                <span style="font-family: var(--font-mono); font-size: 0.625rem; display: block;">TECLADO</span>
              </button>
              <button class="gallery-thumb" data-src="assets/images/laptops/${product.id.toLowerCase()}-ports.svg" style="border: 1px solid var(--kirma-border-main); padding: 4px; background: #fff; cursor: pointer; border-radius: 2px;">
                <span style="font-family: var(--font-mono); font-size: 0.625rem; display: block;">PUERTOS</span>
              </button>
              <button class="gallery-thumb" data-src="assets/images/laptops/${product.id.toLowerCase()}-lid.svg" style="border: 1px solid var(--kirma-border-main); padding: 4px; background: #fff; cursor: pointer; border-radius: 2px;">
                <span style="font-family: var(--font-mono); font-size: 0.625rem; display: block;">TAPA</span>
              </button>
            </div>

            <!-- Qué Incluye la Entrega -->
            <div style="background: var(--kirma-bg-main); border: 1px solid var(--kirma-border-main); border-radius: var(--radius-sm); padding: 1.25rem;">
              <h4 style="font-size: 0.875rem; text-transform: uppercase; font-family: var(--font-mono); color: var(--kirma-green-700); margin-bottom: 0.75rem;">
                ¿QUÉ INCLUYE ESTA UNIDAD?
              </h4>
              <ul style="list-style: none; font-size: 0.8125rem; color: var(--kirma-text-body); display: flex; flex-direction: column; gap: 6px;">
                ${product.incluye.map(item => `
                  <li style="display: flex; align-items: flex-start; gap: 8px;">
                    <span style="color: var(--kirma-green-700); font-weight: bold;">✓</span>
                    <span>${item}</span>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>

          <!-- Columna Derecha: Ficha Técnica Editorial y Precios -->
          <div>
            <!-- Especificaciones Técnicas Principales -->
            <div style="background: var(--kirma-bg-cream); border: 1px solid var(--kirma-border-main); border-radius: var(--radius-sm); padding: 1.25rem; margin-bottom: 1.25rem;">
              <h4 style="font-size: 0.8125rem; font-family: var(--font-mono); text-transform: uppercase; color: var(--kirma-text-muted); margin-bottom: 0.75rem; letter-spacing: 0.04em;">
                ESPECIFICACIONES DEL FABRICANTE
              </h4>
              <table style="width: 100%; font-size: 0.8125rem; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
                  <td style="padding: 6px 0; color: var(--kirma-text-muted); width: 35%;">Procesador</td>
                  <td style="padding: 6px 0; font-weight: 600;">${product.procesador} (${product.procesador_detalle})</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
                  <td style="padding: 6px 0; color: var(--kirma-text-muted);">Memoria RAM</td>
                  <td style="padding: 6px 0; font-weight: 600;">${product.ram} (${product.ram_detalle})</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
                  <td style="padding: 6px 0; color: var(--kirma-text-muted);">Almacenamiento</td>
                  <td style="padding: 6px 0; font-weight: 600;">${product.almacenamiento} (${product.almacenamiento_detalle})</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
                  <td style="padding: 6px 0; color: var(--kirma-text-muted);">Pantalla</td>
                  <td style="padding: 6px 0; font-weight: 600;">${product.pantalla} — ${product.pantalla_detalle}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
                  <td style="padding: 6px 0; color: var(--kirma-text-muted);">Gráficos</td>
                  <td style="padding: 6px 0; font-weight: 600;">${product.gpu}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
                  <td style="padding: 6px 0; color: var(--kirma-text-muted);">Sistema Operativo</td>
                  <td style="padding: 6px 0; font-weight: 600;">${product.sistema_operativo}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: var(--kirma-text-muted);">Peso y Chasis</td>
                  <td style="padding: 6px 0; font-weight: 600;">${product.peso} • ${product.material}</td>
                </tr>
              </table>
            </div>

            <!-- Condición Física Honesta y Transparente -->
            <div style="background: var(--kirma-bg-surface); border: 1px solid var(--kirma-earth-500); border-left: 4px solid var(--kirma-earth-700); border-radius: var(--radius-sm); padding: 1.25rem; margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h4 style="font-size: 0.8125rem; font-family: var(--font-mono); text-transform: uppercase; color: var(--kirma-earth-900); font-weight: 700;">
                  ESTADO ESTÉTICO HONESTO
                </h4>
                <span class="badge badge-grado">${product.condicion_estetica.grado}</span>
              </div>
              <p style="font-size: 0.8125rem; color: var(--kirma-text-body); margin-bottom: 0.5rem;">
                ${product.condicion_estetica.detalles}
              </p>
              ${product.condicion_estetica.marcas_visibles && product.condicion_estetica.marcas_visibles.length > 0 ? `
                <div style="font-size: 0.75rem; color: var(--kirma-text-muted); background: var(--kirma-bg-main); padding: 6px 10px; border-radius: 2px;">
                  <strong>Marcas visibles reportadas:</strong>
                  <ul style="margin-left: 1rem; margin-top: 4px;">
                    ${product.condicion_estetica.marcas_visibles.map(m => `<li>${m}</li>`).join("")}
                  </ul>
                </div>
              ` : ''}
            </div>

            <!-- Estado de Batería y Cargador -->
            <div style="background: var(--kirma-bg-main); border: 1px solid var(--kirma-border-main); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.5rem;">
              <h4 style="font-size: 0.8125rem; font-family: var(--font-mono); text-transform: uppercase; color: var(--kirma-text-muted); margin-bottom: 0.5rem;">
                BATERÍA & CARGADOR
              </h4>
              <p style="font-size: 0.8125rem; margin-bottom: 4px;">
                <strong>Salud de Batería:</strong> ${product.bateria.salud} (${product.bateria.estado_general})
              </p>
              <p style="font-size: 0.75rem; color: var(--kirma-text-muted); margin-bottom: 8px;">
                <em>${product.bateria.observacion}</em>
              </p>
              <p style="font-size: 0.8125rem;">
                <strong>Cargador:</strong> ${product.cargador}
              </p>
            </div>

            <!-- Bloque de Precio y Conversión -->
            <div style="padding: 1.25rem; background: var(--kirma-green-50); border: 1px solid var(--kirma-green-700); border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span class="price-label">Precio Final Colombia:</span>
                <div class="price-amount" style="color: var(--kirma-green-900);">${product.precio_formato}</div>
              </div>
              <p style="font-size: 0.75rem; color: var(--kirma-text-muted); margin: 0;">
                ✓ 6 Meses de garantía por escrito (Ley 1480 de 2011).<br>
                ✓ Envíos nacionales con guía de rastreo y embalaje industrial seguro.
              </p>
              <a href="${waProductUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg" style="width: 100%; text-align: center;">
                QUIERO ESTE EQUIPO (WHATSAPP)
              </a>
            </div>

          </div>
        </div>

        <!-- Sección KIRMA CHECK Punto por Punto -->
        <div style="padding: 0 1.5rem 1.5rem 1.5rem;">
          <div class="kirma-check-box">
            <div class="kirma-check-header">
              <span class="kirma-check-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                KIRMA CHECK — REPORTE DE COMPROBACIÓN TÉCNICA (10/10)
              </span>
              <span class="kirma-check-disclaimer">
                Solo se certifican pruebas efectivamente realizadas en laboratorio
              </span>
            </div>

            <div class="kirma-check-grid">
              ${Object.entries(product.kirma_check).map(([k, test]) => `
                <div class="check-item">
                  <span class="check-icon">✓</span>
                  <div class="check-text">
                    <strong>${test.etiqueta || k.toUpperCase()}</strong>
                    <span>${test.nota}</span>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

      </div>
    `;

    // Conectar galería de imágenes
    const mainImg = modalBody.querySelector("#main-product-image");
    modalBody.querySelectorAll(".gallery-thumb").forEach(thumb => {
      thumb.addEventListener("click", (e) => {
        modalBody.querySelectorAll(".gallery-thumb").forEach(t => {
          t.style.borderColor = "var(--kirma-border-main)";
        });
        thumb.style.borderColor = "var(--kirma-green-700)";
        const newSrc = thumb.getAttribute("data-src");
        if (mainImg && newSrc) {
          mainImg.src = newSrc;
        }
      });
    });

    modalBackdrop.classList.add("open");

    const closeBtn = document.getElementById("btn-close-product-modal");
    if (closeBtn) {
      closeBtn.onclick = () => modalBackdrop.classList.remove("open");
    }
  }
};
