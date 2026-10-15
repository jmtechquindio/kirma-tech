import { WhatsAppService } from "./whatsapp.js";
import { ComparatorService } from "./comparator.js";

/**
 * Resuelve una ruta de asset relativa a la raíz del documento.
 */
function getAssetPath(relativePath) {
  const base = document.querySelector("base")?.href || 
    window.location.href.replace(/\/[^/]*$/, "/");
  return new URL(relativePath, base).href;
}

export const FinderService = {
  items: [],
  containerId: "finder-results",
  currentProfile: null,

  async init() {
    this.container = document.getElementById(this.containerId);
    
    // Cargar inventario desde la API
    try {
      const res = await fetch('/api/products?status=activo&limit=100');
      if (res.ok) {
        const data = await res.json();
        this.items = (data.products || []).map(p => ({
          ...p,
          marca: p.brand,
          modelo: p.model,
          precio: p.sale_price,
          etiqueta: p.badge,
          perfiles: p.profiles || [],
          especificaciones: {
            procesador: p.processor,
            ram: p.ram_label,
            almacenamiento: p.storage_label
          },
          imagenes: {
            principal: p.images && p.images.length > 0 ? getAssetPath(p.images[0].path) : getAssetPath(`assets/images/laptops/${p.id.toLowerCase()}-front.svg`)
          }
        }));
      }
    } catch (e) {
      console.error("Finder API Error:", e);
    }

    this.bindButtons();
  },

  bindButtons() {
    const btns = document.querySelectorAll('.finder-btn');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        btns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        this.currentProfile = e.currentTarget.getAttribute('data-profile');
        this.renderResults();
      });
    });
  },

  renderResults() {
    if (!this.container || !this.currentProfile) return;

    const matches = this.items.filter(item => 
      item.perfiles && item.perfiles.includes(this.currentProfile)
    );

    if (matches.length === 0) {
      this.container.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <p style="color: var(--kirma-text-muted);">No tenemos equipos para este perfil en este momento.</p>
        </div>
      `;
      this.container.classList.add('active');
      return;
    }

    // Ordenar: primero los recomendados, luego por precio (menor a mayor)
    matches.sort((a, b) => {
      if (a.etiqueta && !b.etiqueta) return -1;
      if (!a.etiqueta && b.etiqueta) return 1;
      return (a.precio || Infinity) - (b.precio || Infinity);
    });

    const html = matches.slice(0, 3).map(item => `
      <div class="finder-card">
        ${item.etiqueta ? `<div class="product-badge">${item.etiqueta}</div>` : ''}
        
        <div class="finder-card-content">
          <img src="${item.imagenes.principal}" alt="${item.marca} ${item.modelo}" loading="lazy">
          
          <div class="finder-card-info">
            <span class="product-sku" style="font-size: 0.75rem;">${item.id}</span>
            <h4 style="margin: 0.25rem 0; font-size: 1.125rem;">${item.marca} ${item.modelo}</h4>
            
            <ul class="specs-list" style="margin-top: 0.5rem; gap: 0.25rem;">
              <li style="font-size: 0.75rem;">${item.especificaciones.procesador}</li>
              <li style="font-size: 0.75rem;">${item.especificaciones.ram} | ${item.especificaciones.almacenamiento}</li>
            </ul>
            
            <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: flex-end;">
              <div>
                <div class="price-value" style="font-size: 1.125rem;">${item.price_format || 'Consultar'}</div>
              </div>
              <button class="btn btn-primary btn-sm btn-finder-buy" data-id="${item.id}">Consultar</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
        ${html}
      </div>
    `;
    
    this.container.classList.add('active');
    this.bindActions();
  },

  bindActions() {
    const buyBtns = this.container.querySelectorAll('.btn-finder-buy');
    buyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const product = this.items.find(p => p.id === id);
        if (product) WhatsAppService.openChat(product);
      });
    });
  }
};
