import { WhatsAppService } from "./whatsapp.js";
import { ComparatorService } from "./comparator.js";
import { ProductModalService } from "./product_modal.js";
import { getLiveInventory } from "../data/inventory.js";

/**
 * Resuelve una ruta de asset relativa a la raíz del documento.
 */
function getAssetPath(relativePath) {
  const base = document.querySelector("base")?.href || 
    window.location.href.replace(/\/[^/]*$/, "/");
  return new URL(relativePath, base).href;
}

export const CatalogService = {
  items: [],
  filteredItems: [],
  containerId: "catalog-grid",

  async init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) return;

    try {
      this.container.innerHTML = '<div style="text-align:center; padding: 2rem; grid-column: 1/-1;">Cargando catálogo...</div>';
      
      const res = await fetch('/api/products?status=activo&limit=100');
      if (!res.ok) throw new Error('API no disponible');
      
      const data = await res.json();
      
      // Adaptar el formato de la DB al formato esperado por el frontend
      this.items = (data.products || []).map(p => ({
        id: p.id,
        marca: p.brand,
        modelo: p.model,
        etiqueta: p.badge,
        precio: p.sale_price,
        price_format: p.price_format,
        especificaciones: {
          procesador: p.processor,
          ram: p.ram_label,
          almacenamiento: p.storage_label,
          pantalla: p.screen_label
        },
        imagenes: {
          principal: (p.images && p.images.length > 0) 
            ? getAssetPath(p.images[0].path) 
            : getAssetPath(`assets/images/laptops/${p.id.toLowerCase()}-front.svg`)
        }
      }));
      
    } catch (err) {
      // Fallback estático para GitHub Pages o modo offline
      const staticInv = getLiveInventory();
      this.items = staticInv.map(p => ({
        id: p.id,
        marca: p.marca,
        modelo: p.modelo,
        etiqueta: p.condicion_estetica?.grado || 'DISPONIBLE',
        precio: p.precio_cop,
        price_format: p.precio_formato,
        especificaciones: {
          procesador: p.procesador,
          ram: p.ram,
          almacenamiento: p.almacenamiento,
          pantalla: p.pantalla
        },
        imagenes: {
          principal: getAssetPath(`assets/images/laptops/${p.id.toLowerCase()}-front.svg`)
        }
      }));
    }
    
    this.filteredItems = [...this.items];
    this.bindFilters();
    this.render();
  },

  bindFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const filter = e.target.getAttribute('data-filter');
        this.filterByBrand(filter);
      });
    });
  },

  filterByBrand(brand) {
    if (brand === 'all' || !brand) {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item => 
        item.marca.toLowerCase() === brand.toLowerCase()
      );
    }
    this.render();
  },

  render() {
    if (!this.container) return;

    if (this.filteredItems.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--kirma-surface); border-radius: 1rem;">
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">No hay equipos disponibles</h3>
          <p style="color: var(--kirma-text-muted);">Intenta seleccionar otra marca o contáctanos por WhatsApp para disponibilidad futura.</p>
        </div>
      `;
      return;
    }

    const html = this.filteredItems.map(item => {
      const badgeHtml = item.etiqueta ? `<div class="product-badge">${item.etiqueta}</div>` : '';
      const formattedPrice = item.price_format || 'Consultar';

      return `
        <article class="product-card" data-id="${item.id}">
          ${badgeHtml}
          
          <header class="product-card-header">
            <span class="product-sku">${item.id}</span>
            <h3 class="product-title">${item.marca} ${item.modelo}</h3>
          </header>

          <div class="product-card-visual">
            <img src="${item.imagenes.principal}" 
                 alt="Portátil corporativo ${item.marca} ${item.modelo} remanufacturado" 
                 loading="lazy"
                 onerror="this.style.display='none'; this.parentElement.innerHTML += '<div style=\'display:flex;align-items:center;justify-content:center;height:160px;font-family:var(--font-mono);font-size:0.75rem;color:var(--kirma-text-muted);text-align:center;\'>'+this.alt+'</div>'; this.remove();" />
          </div>

          <div class="product-card-body">
            <ul class="specs-list">
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/></svg>
                ${item.especificaciones.procesador}
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                ${item.especificaciones.ram}
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                ${item.especificaciones.almacenamiento}
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                ${item.especificaciones.pantalla}
              </li>
            </ul>

            <div class="product-card-footer">
              <div class="price-block">
                <span class="price-value">${formattedPrice}</span>
                <span class="price-label">Con garantía de 6 meses</span>
              </div>
              <div class="card-actions">
                <button class="btn btn-outline btn-sm btn-compare" data-id="${item.id}" title="Comparar equipo">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
                </button>
                <button class="btn btn-outline btn-sm btn-details" data-id="${item.id}" title="Ver Ficha Técnica">
                  Ficha KIRMA
                </button>
                <button class="btn btn-primary btn-sm btn-buy" data-id="${item.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Consultar
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    this.container.innerHTML = html;
    this.bindActions();
  },

  bindActions() {
    const buyBtns = this.container.querySelectorAll('.btn-buy');
    buyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const product = this.items.find(p => p.id === id);
        if (product) WhatsAppService.openChat(product);
      });
    });

    const compareBtns = this.container.querySelectorAll('.btn-compare');
    compareBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const product = this.items.find(p => p.id === id);
        if (product) ComparatorService.addProduct(product);
      });
    });

    const detailsBtns = this.container.querySelectorAll('.btn-details');
    detailsBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        ProductModalService.open(id);
      });
    });
  }
};
