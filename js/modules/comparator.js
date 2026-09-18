/**
 * KIRMA — Comparador Técnico de Equipos.
 * Permite seleccionar hasta 3 computadores y contrastar especificaciones reales lado a lado.
 */

import { INVENTORY, getLiveInventory } from "../data/inventory.js";
import { WhatsAppService } from "./whatsapp.js";
import { ProductModalService } from "./product_modal.js";

export const ComparatorService = {
  selectedIds: [],
  maxSlots: 3,

  init() {
    this.renderDrawer();
    this.bindDrawerEvents();
  },

  isSelected(id) {
    return this.selectedIds.includes(id);
  },

  toggle(id) {
    if (this.isSelected(id)) {
      this.selectedIds = this.selectedIds.filter(item => item !== id);
    } else {
      if (this.selectedIds.length >= this.maxSlots) {
        alert(`Puedes comparar un máximo de ${this.maxSlots} equipos a la vez.`);
        return;
      }
      this.selectedIds.push(id);
    }
    this.renderDrawer();
  },

  remove(id) {
    this.selectedIds = this.selectedIds.filter(item => item !== id);
    this.renderDrawer();
  },

  clear() {
    this.selectedIds = [];
    this.renderDrawer();
  },

  renderDrawer() {
    const drawer = document.getElementById("compare-drawer");
    const slotsContainer = document.getElementById("compare-drawer-slots");
    const countText = document.getElementById("compare-count-text");

    if (!drawer || !slotsContainer) return;

    if (this.selectedIds.length === 0) {
      drawer.classList.remove("visible");
      return;
    }

    drawer.classList.add("visible");
    if (countText) {
      countText.textContent = `${this.selectedIds.length} de ${this.maxSlots} equipos seleccionados`;
    }

    const items = this.selectedIds.map(id => getLiveInventory().find(item => item.id === id)).filter(Boolean);

    slotsContainer.innerHTML = items.map(item => `
      <div class="compare-chip">
        <span>${item.marca} ${item.modelo}</span>
        <span class="compare-chip-remove" data-id="${item.id}" title="Quitar">×</span>
      </div>
    `).join("");

    slotsContainer.querySelectorAll(".compare-chip-remove").forEach(el => {
      el.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        this.remove(id);
      });
    });
  },

  bindDrawerEvents() {
    const openBtn = document.getElementById("btn-open-comparator");
    if (openBtn) {
      openBtn.addEventListener("click", () => this.openModal());
    }

    const clearBtn = document.getElementById("btn-clear-comparator");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clear());
    }
  },

  openModal() {
    if (this.selectedIds.length < 2) {
      alert("Selecciona al menos 2 equipos en el catálogo para compararlos lado a lado.");
      return;
    }

    const modalBackdrop = document.getElementById("comparator-modal");
    const modalContent = document.getElementById("comparator-modal-table");
    if (!modalBackdrop || !modalContent) return;

    const items = this.selectedIds.map(id => getLiveInventory().find(item => item.id === id)).filter(Boolean);

    modalContent.innerHTML = `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--kirma-border-main); background: var(--kirma-bg-main);">
              <th style="padding: 1rem; text-align: left; width: 22%; font-family: var(--font-mono); color: var(--kirma-text-muted);">CARACTERÍSTICA</th>
              ${items.map(item => `
                <th style="padding: 1rem; text-align: left; width: ${78 / items.length}%;">
                  <span class="asset-tag" style="margin-bottom: 4px;">${item.tag}</span>
                  <div style="font-size: 1.125rem; font-weight: 800; color: var(--kirma-text-main);">${item.marca} ${item.modelo}</div>
                  <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--kirma-text-muted);">${item.linea}</div>
                </th>
              `).join("")}
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
              <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">PRECIO (COP)</td>
              ${items.map(item => `
                <td style="padding: 0.75rem 1rem; font-size: 1.125rem; font-weight: 800; color: var(--kirma-text-main);">
                  ${item.precio_formato}
                </td>
              `).join("")}
            </tr>

            <tr style="border-bottom: 1px solid var(--kirma-border-subtle); background: var(--kirma-bg-cream);">
              <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">PROCESADOR</td>
              ${items.map(item => `
                <td style="padding: 0.75rem 1rem;">
                  <strong>${item.procesador}</strong>
                  <div style="font-size: 0.75rem; color: var(--kirma-text-muted);">${item.procesador_detalle}</div>
                </td>
              `).join("")}
            </tr>

            <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
              <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">MEMORIA RAM</td>
              ${items.map(item => `
                <td style="padding: 0.75rem 1rem;">
                  <strong>${item.ram}</strong>
                  <div style="font-size: 0.75rem; color: var(--kirma-text-muted);">${item.ram_detalle}</div>
                </td>
              `).join("")}
            </tr>

            <tr style="border-bottom: 1px solid var(--kirma-border-subtle); background: var(--kirma-bg-cream);">
              <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">ALMACENAMIENTO</td>
              ${items.map(item => `
                <td style="padding: 0.75rem 1rem;">
                  <strong>${item.almacenamiento}</strong>
                  <div style="font-size: 0.75rem; color: var(--kirma-text-muted);">${item.almacenamiento_detalle}</div>
                </td>
              `).join("")}
            </tr>

            <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
              <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">PANTALLA</td>
              ${items.map(item => `
                <td style="padding: 0.75rem 1rem;">
                  <strong>${item.pantalla}</strong>
                  <div style="font-size: 0.75rem; color: var(--kirma-text-muted);">${item.pantalla_detalle}</div>
                </td>
              `).join("")}
            </tr>

            <tr style="border-bottom: 1px solid var(--kirma-border-subtle); background: var(--kirma-bg-cream);">
              <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">GRÁFICOS</td>
              ${items.map(item => `
                <td style="padding: 0.75rem 1rem;">${item.gpu}</td>
              `).join("")}
            </tr>

            <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
              <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">PESO Y CHASIS</td>
              ${items.map(item => `
                <td style="padding: 0.75rem 1rem;">
                  <strong>${item.peso}</strong>
                  <div style="font-size: 0.75rem; color: var(--kirma-text-muted);">${item.material}</div>
                </td>
              `).join("")}
            </tr>

            <tr style="border-bottom: 1px solid var(--kirma-border-subtle); background: var(--kirma-bg-cream);">
              <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">ESTADO Y CONDICIÓN</td>
              ${items.map(item => `
                <td style="padding: 0.75rem 1rem;">
                  <span class="badge badge-grado" style="margin-bottom: 4px;">${item.condicion_estetica.grado}</span>
                  <div style="font-size: 0.75rem; color: var(--kirma-text-body);">${item.condicion_estetica.resumen}</div>
                </td>
              `).join("")}
            </tr>

            <tr style="border-bottom: 1px solid var(--kirma-border-subtle);">
              <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">BATERÍA</td>
              ${items.map(item => `
                <td style="padding: 0.75rem 1rem;">
                  <strong>${item.bateria.salud}</strong>
                  <div style="font-size: 0.75rem; color: var(--kirma-text-muted);">${item.bateria.estado_general}</div>
                </td>
              `).join("")}
            </tr>

            <tr style="border-bottom: 1px solid var(--kirma-border-subtle); background: var(--kirma-bg-cream);">
              <td style="padding: 0.75rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">GARANTÍA</td>
              ${items.map(item => `
                <td style="padding: 0.75rem 1rem; font-weight: 700; color: var(--kirma-green-700);">
                  6 Meses de Garantía Legal
                </td>
              `).join("")}
            </tr>

            <tr>
              <td style="padding: 1.25rem 1rem; font-weight: 600; color: var(--kirma-text-muted); font-family: var(--font-mono); font-size: 0.75rem;">ACCIÓN</td>
              ${items.map(item => `
                <td style="padding: 1.25rem 1rem;">
                  <button class="btn btn-primary btn-sm btn-modal-view-from-comp" data-id="${item.id}" style="width: 100%; margin-bottom: 0.5rem;">
                    Ver Ficha
                  </button>
                  <a href="${WhatsAppService.forProduct(item)}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="width: 100%;">
                    Consultar
                  </a>
                </td>
              `).join("")}
            </tr>
          </tbody>
        </table>
      </div>
    `;

    modalContent.querySelectorAll(".btn-modal-view-from-comp").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        modalBackdrop.classList.remove("open");
        ProductModalService.open(id);
      });
    });

    modalBackdrop.classList.add("open");

    const closeBtn = document.getElementById("btn-close-comparator-modal");
    if (closeBtn) {
      closeBtn.onclick = () => modalBackdrop.classList.remove("open");
    }
  }
};
