/**
 * KIRMA — "Encuentra tu equipo".
 * Motor de recomendación por necesidades reales de trabajo, estudio y productividad.
 */

import { INVENTORY, getLiveInventory } from "../data/inventory.js";
import { WhatsAppService } from "./whatsapp.js";
import { ProductModalService } from "./product_modal.js";

export const FinderService = {
  selectedNeed: "trabajar",

  needs: {
    estudiar: {
      label: "Estudio & Universidad",
      icon: "🎓",
      desc: "Navegación web, redacción de documentos, videoclases y multitarea ligera a moderada.",
      requisitos_minimos: "Intel Core i5 o AMD Ryzen equivalente, mínimo 16 GB RAM, 256/512 GB SSD NVMe.",
      justificacion: "Prioriza ligereza para transporte en morral, autonomía confiable y teclado cómodo para redacción continua."
    },
    trabajar: {
      label: "Trabajo Remoto & Productividad",
      icon: "💼",
      desc: "Hojas de cálculo complejas, videollamadas en Teams/Meet, navegación pesada y ERP corporativo.",
      requisitos_minimos: "Intel Core i5/i7 o Ryzen PRO, 16 GB RAM, 512 GB SSD NVMe, Wi-Fi estable y webcam con privacidad.",
      justificacion: "Chasis corporativo resistente para jornadas prolongadas de más de 8 horas continuas sin recalentamiento."
    },
    oficina: {
      label: "Oficina, Contabilidad & Negocios",
      icon: "📊",
      desc: "Facturación electrónica, software contable (Siigo, World Office), Excel avanzado y gestión comercial.",
      requisitos_minimos: "Teclado amplio o numérico dedicado, puertos HDMI y RJ-45 nativos, mínimo 16 GB RAM.",
      justificacion: "Gran durabilidad, facilidad para conectar periféricos de oficina (impresoras, doble monitor y red cableada)."
    },
    programar: {
      label: "Programación & Desarrollo de Software",
      icon: "💻",
      desc: "VS Code, Docker, servidores locales, bases de datos PostgreSQL/MySQL y compilación de código.",
      requisitos_minimos: "4 a 6 núcleos físicos, mínimo 16 GB a 32 GB RAM, 512 GB SSD NVMe de alta tasa de lectura.",
      justificacion: "Excelente respuesta térmica sostenida, teclado ergonómico de alta precisión y soporte nativo para Linux o WSL2."
    },
    diseño: {
      label: "Diseño Gráfico 2D & Contenido",
      icon: "🎨",
      desc: "Figma, Adobe Photoshop, Illustrator, maquetación editorial y diseño publicitario.",
      requisitos_minimos: "Pantalla IPS de alta fidelidad o 400 nits, 16 GB a 32 GB RAM, gráficos integrados avanzados (Iris Xe / Vega).",
      justificacion: "Paneles nítidos con buen ángulo de visión, amplio espacio de memoria para capas múltiples y renderizado vectorial fluido."
    },
    alto_rendimiento: {
      label: "Alto Rendimiento & Multitarea Masiva",
      icon: "⚡",
      desc: "Máquinas virtuales simultáneas, modelado pesado, análisis masivo de datos y carga extrema.",
      requisitos_minimos: "32 GB RAM en canal doble o procesador AMD PRO de 6 núcleos / 12 hilos, refrigeración eficiente.",
      justificacion: "Equipos de gama ejecutiva superior concebidos para no saturarse frente a flujos de trabajo profesionales pesados."
    }
  },

  init() {
    this.renderSelectors();
    this.renderResults();
  },

  renderSelectors() {
    const container = document.getElementById("finder-needs-grid");
    if (!container) return;

    container.innerHTML = Object.entries(this.needs).map(([key, item]) => {
      const isActive = this.selectedNeed === key;
      return `
        <div class="need-card ${isActive ? 'active' : ''}" data-need="${key}" tabindex="0" role="button" aria-pressed="${isActive}">
          <div class="need-icon">${item.icon}</div>
          <div class="need-name">${item.label}</div>
          <div class="need-hint">${item.desc}</div>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".need-card").forEach(card => {
      card.addEventListener("click", (e) => {
        const need = e.currentTarget.getAttribute("data-need");
        this.selectNeed(need);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const need = e.currentTarget.getAttribute("data-need");
          this.selectNeed(need);
        }
      });
    });
  },

  selectNeed(needKey) {
    this.selectedNeed = needKey;
    this.renderSelectors();
    this.renderResults();
  },

  renderResults() {
    const resultsContainer = document.getElementById("finder-results");
    if (!resultsContainer) return;

    const currentNeed = this.needs[this.selectedNeed];
    const matches = getLiveInventory().filter(item => {
      return item.perfiles_compatibles && item.perfiles_compatibles.includes(this.selectedNeed);
    });

    const waHelpUrl = WhatsAppService.forNeed(this.selectedNeed, currentNeed.label);

    resultsContainer.innerHTML = `
      <div class="finder-criteria-summary">
        <p><strong>Criterio Técnico Validado para ${currentNeed.label}:</strong></p>
        <p style="margin-top: 4px; color: var(--kirma-text-body);">${currentNeed.requisitos_minimos}</p>
        <p style="font-size: 0.8125rem; color: var(--kirma-text-muted); margin-top: 4px;"><em>Fundamento: ${currentNeed.justificacion}</em></p>
      </div>

      <div class="catalog-grid" style="margin-top: 1.5rem;">
        ${matches.map(item => `
          <article class="product-card" data-id="${item.id}">
            <header class="product-card-header">
              <span class="asset-tag">${item.tag}</span>
              <span class="badge badge-disponible">${item.disponibilidad}</span>
            </header>
            <div class="product-card-visual">
              <img src="assets/images/laptops/${item.id.toLowerCase()}-front.svg" 
                   alt="Portátil corporativo ${item.marca} ${item.modelo}" 
                   loading="lazy" />
            </div>
            <div class="product-card-body">
              <h3 class="product-card-title">${item.marca} ${item.modelo}</h3>
              <p class="product-card-subtitle">${item.procesador} • ${item.ram} • ${item.almacenamiento}</p>
              <div class="product-card-condition">
                <strong>¿Por qué encaja?</strong> ${item.ideal_para[0]}
              </div>
              <div class="product-card-pricing">
                <div>
                  <span class="price-label">Precio final</span>
                  <div class="price-amount">${item.precio_formato}</div>
                </div>
                <span class="badge badge-grado">${item.condicion_estetica.grado}</span>
              </div>
              <div class="product-card-actions" style="grid-template-columns: 1fr;">
                <button class="btn btn-primary btn-finder-view" data-id="${item.id}">
                  Ver Ficha Completa
                </button>
              </div>
            </div>
          </article>
        `).join("")}
      </div>

      <div style="margin-top: 2rem; text-align: center; padding: 1.5rem; background: var(--kirma-bg-surface); border: 1px solid var(--kirma-border-main); border-radius: var(--radius-sm);">
        <p style="margin-bottom: 0.75rem; font-size: 0.9375rem;">¿Tienes un requerimiento de software o presupuesto específico?</p>
        <a href="${waHelpUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp">
          Consultar por WhatsApp para este perfil
        </a>
      </div>
    `;

    resultsContainer.querySelectorAll(".btn-finder-view").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        ProductModalService.open(id);
      });
    });
  }
};
