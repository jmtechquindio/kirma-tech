/**
 * KIRMA — Catálogo de Equipos Corporativos.
 * Filtrado dinámico, búsqueda instantánea, cálculo de facetas y renderizado.
 */

import { INVENTORY, getLiveInventory } from "../data/inventory.js";
import { WhatsAppService } from "./whatsapp.js";
import { ComparatorService } from "./comparator.js";
import { ProductModalService } from "./product_modal.js";

export const CatalogService = {
  items: getLiveInventory(),
  filteredItems: getLiveInventory(),
  activeFilters: {
    search: "",
    marca: "todas",
    ram: "todas",
    almacenamiento: "todas",
    pantalla: "todas",
    precio_max: "todos",
    disponibilidad: "todas"
  },

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    const searchInput = document.getElementById("catalog-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.activeFilters.search = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    const brandFilter = document.getElementById("filter-brand");
    if (brandFilter) {
      brandFilter.addEventListener("change", (e) => {
        this.activeFilters.marca = e.target.value;
        this.applyFilters();
      });
    }

    const ramFilter = document.getElementById("filter-ram");
    if (ramFilter) {
      ramFilter.addEventListener("change", (e) => {
        this.activeFilters.ram = e.target.value;
        this.applyFilters();
      });
    }

    const storageFilter = document.getElementById("filter-storage");
    if (storageFilter) {
      storageFilter.addEventListener("change", (e) => {
        this.activeFilters.almacenamiento = e.target.value;
        this.applyFilters();
      });
    }

    const priceFilter = document.getElementById("filter-price");
    if (priceFilter) {
      priceFilter.addEventListener("change", (e) => {
        this.activeFilters.precio_max = e.target.value;
        this.applyFilters();
      });
    }

    const resetBtn = document.getElementById("btn-reset-filters");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetFilters());
    }
  },

  applyFilters() {
    this.filteredItems = this.items.filter(item => {
      // Búsqueda de texto libre
      if (this.activeFilters.search) {
        const query = this.activeFilters.search;
        const textBlob = `${item.marca} ${item.modelo} ${item.tag} ${item.procesador} ${item.ram} ${item.almacenamiento} ${item.linea}`.toLowerCase();
        if (!textBlob.includes(query)) return false;
      }

      // Marca
      if (this.activeFilters.marca !== "todas" && item.marca.toLowerCase() !== this.activeFilters.marca.toLowerCase()) {
        return false;
      }

      // RAM
      if (this.activeFilters.ram !== "todas") {
        const requiredRam = parseInt(this.activeFilters.ram, 10);
        if (item.ram_gb < requiredRam) return false;
      }

      // Almacenamiento
      if (this.activeFilters.almacenamiento !== "todas") {
        const requiredStorage = parseInt(this.activeFilters.almacenamiento, 10);
        if (item.almacenamiento_gb < requiredStorage) return false;
      }

      // Precio Máximo en COP
      if (this.activeFilters.precio_max !== "todos") {
        const maxPrice = parseInt(this.activeFilters.precio_max, 10);
        if (item.precio_cop > maxPrice) return false;
      }

      return true;
    });

    this.render();
  },

  resetFilters() {
    this.activeFilters = {
      search: "",
      marca: "todas",
      ram: "todas",
      almacenamiento: "todas",
      pantalla: "todas",
      precio_max: "todos",
      disponibilidad: "todas"
    };

    const searchInput = document.getElementById("catalog-search");
    if (searchInput) searchInput.value = "";
    const brandFilter = document.getElementById("filter-brand");
    if (brandFilter) brandFilter.value = "todas";
    const ramFilter = document.getElementById("filter-ram");
    if (ramFilter) ramFilter.value = "todas";
    const storageFilter = document.getElementById("filter-storage");
    if (storageFilter) storageFilter.value = "todas";
    const priceFilter = document.getElementById("filter-price");
    if (priceFilter) priceFilter.value = "todos";

    this.items = getLiveInventory(); this.filteredItems = [...this.items];
    this.render();
  },

  render() {
    const grid = document.getElementById("catalog-grid");
    const countEl = document.getElementById("catalog-count");

    if (countEl) {
      countEl.textContent = `${this.filteredItems.length} de ${this.items.length} equipos corporativos disponibles`;
    }

    if (!grid) return;

    if (this.filteredItems.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: var(--kirma-bg-surface); border: 1px dashed var(--kirma-border-main); border-radius: var(--radius-sm);">
          <p style="font-family: var(--font-mono); color: var(--kirma-text-muted); margin-bottom: 0.5rem;">[ INVENTARIO KIRMA ]</p>
          <h3 style="margin-bottom: 0.5rem;">No se encontraron equipos con los filtros seleccionados</h3>
          <p style="color: var(--kirma-text-muted); max-width: 480px; margin: 0 auto 1.5rem auto;">Intenta ajustar el rango de precios o restablecer los filtros para ver las unidades corporativas actualmente revisadas.</p>
          <button class="btn btn-secondary" id="empty-reset-btn">Restablecer todos los filtros</button>
        </div>
      `;
      const emptyBtn = document.getElementById("empty-reset-btn");
      if (emptyBtn) emptyBtn.addEventListener("click", () => this.resetFilters());
      return;
    }

    grid.innerHTML = this.filteredItems.map(item => {
      const isComparing = ComparatorService.isSelected(item.id);
      const badgeClass = item.disponibilidad === "DISPONIBLE" ? "badge-disponible" : (item.disponibilidad === "ÚLTIMAS UNIDADES" ? "badge-ultimas" : "badge-agotado");
      const waUrl = WhatsAppService.forProduct(item);

      return `
        <article class="product-card" data-id="${item.id}">
          <header class="product-card-header">
            <span class="asset-tag">${item.tag}</span>
            <span class="badge ${badgeClass}">${item.disponibilidad}</span>
          </header>

          <div class="product-card-visual">
            <img src="${item.imagenes ? item.imagenes.principal : 'assets/images/laptops/' + item.id.toLowerCase() + '-front.svg'}" 
                 alt="Portátil corporativo ${item.marca} ${item.modelo} remanufacturado" 
                 loading="lazy" />
          </div>

          <div class="product-card-body">
            <h3 class="product-card-title">${item.marca} ${item.modelo}</h3>
            <p class="product-card-subtitle">${item.linea}</p>

            <div class="specs-grid">
              <div class="spec-item">
                <span class="spec-key">Procesador</span>
                <span class="spec-val">${item.procesador}</span>
              </div>
              <div class="spec-item">
                <span class="spec-key">Memoria RAM</span>
                <span class="spec-val">${item.ram}</span>
              </div>
              <div class="spec-item">
                <span class="spec-key">Disco SSD</span>
                <span class="spec-val">${item.almacenamiento}</span>
              </div>
              <div class="spec-item">
                <span class="spec-key">Pantalla</span>
                <span class="spec-val">${item.pantalla}</span>
              </div>
            </div>

            <div class="product-card-condition">
              <strong>Estado físico:</strong> ${item.condicion_estetica.resumen}
            </div>

            <div class="product-card-pricing">
              <div>
                <span class="price-label">Precio final</span>
                <div class="price-amount">${item.precio_formato}</div>
              </div>
              <span class="badge badge-grado">${item.condicion_estetica.grado}</span>
            </div>

            <div class="product-card-actions">
              <button class="btn btn-primary btn-view-product" data-id="${item.id}">
                Ver Ficha Kirma
              </button>
              <button class="btn-compare-toggle ${isComparing ? 'active' : ''}" 
                      data-id="${item.id}" 
                      title="${isComparing ? 'Quitar del comparador' : 'Añadir al comparador'}"
                      aria-label="Comparar este equipo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Conectar eventos de botones
    grid.querySelectorAll(".btn-view-product").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        ProductModalService.open(id);
      });
    });

    grid.querySelectorAll(".btn-compare-toggle").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        ComparatorService.toggle(id);
        this.render(); // Actualiza el estado visual del botón
      });
    });
  }
};
