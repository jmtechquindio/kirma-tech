import { WhatsAppService } from "./whatsapp.js";

/**
 * Resuelve una ruta de asset relativa a la raíz del documento.
 */
function getAssetPath(relativePath) {
  const base = document.querySelector("base")?.href || 
    window.location.href.replace(/\/[^/]*$/, "/");
  return new URL(relativePath, base).href;
}

export const ProductModalService = {
  modalId: "product-modal",
  
  async open(productId) {
    let product;
    
    // Fetch product detail from API
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error('Producto no encontrado');
      
      const p = await res.json();
      
      // Mapear al formato que espera el frontend
      product = {
        id: p.id,
        marca: p.brand,
        modelo: p.model,
        linea: p.line,
        precio: p.sale_price,
        price_format: p.price_format,
        garantia: p.warranty,
        estado: {
          grado: p.aesthetic_grade,
          resumen: p.aesthetic_summary
        },
        especificaciones: {
          procesador: p.processor,
          detalle_cpu: p.processor_detail,
          ram: p.ram_label,
          almacenamiento: p.storage_label,
          pantalla: p.screen_label,
          graficos: p.gpu,
          so: p.os
        },
        kirma_check: {},
        imagenes: {
          principal: p.images && p.images.length > 0 ? getAssetPath(p.images[0].path) : getAssetPath(`assets/images/laptops/${p.id.toLowerCase()}-front.svg`),
          teclado: getAssetPath(`assets/images/laptops/${p.id.toLowerCase()}-open.svg`),
          puertos: getAssetPath(`assets/images/laptops/${p.id.toLowerCase()}-ports.svg`)
        }
      };

      // Mapear Kirma Check
      if (p.kirma_check) {
        p.kirma_check.forEach(chk => {
          product.kirma_check[chk.check_key] = {
            ok: chk.ok === 1,
            label: chk.label,
            note: chk.note
          };
        });
      }

    } catch (err) {
      console.error(err);
      alert('Error al cargar la ficha del producto.');
      return;
    }

    this.render(product);
    this.bindEvents(product);
  },

  render(product) {
    const modal = document.getElementById(this.modalId);
    if (!modal) return;
    
    // Generar badges de Kirma Check
    const checks = Object.values(product.kirma_check || {});
    const checksHtml = checks.map(check => `
      <div class="check-item ${check.ok ? 'ok' : 'warn'}">
        <div class="check-icon">
          ${check.ok 
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' 
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'}
        </div>
        <div class="check-content">
          <span class="check-label">${check.label}</span>
          ${check.note ? `<span class="check-note">${check.note}</span>` : ''}
        </div>
      </div>
    `).join('');

    // Prevenir undefined
    const detailCpu = product.especificaciones.detalle_cpu || product.especificaciones.procesador;

    // Actualizar contenido
    const content = `
      <div class="modal-header">
        <div>
          <h2 class="modal-title">${product.marca} ${product.modelo}</h2>
          <span class="modal-subtitle">${product.id} | ${product.linea || ''}</span>
        </div>
        <button class="btn-close-modal" aria-label="Cerrar modal">&times;</button>
      </div>

      <div class="modal-body">
        <div class="modal-gallery">
          <img src="${product.imagenes.principal}" alt="Vista frontal" class="gallery-main" id="modal-main-img">
          <div class="gallery-thumbs">
            <button class="thumb-btn active"><img src="${product.imagenes.principal}" alt="Frontal"></button>
            <button class="thumb-btn"><img src="${product.imagenes.teclado}" alt="Teclado" onerror="this.parentElement.style.display='none'"></button>
            <button class="thumb-btn"><img src="${product.imagenes.puertos}" alt="Puertos" onerror="this.parentElement.style.display='none'"></button>
          </div>
        </div>

        <div class="modal-info">
          
          <div class="info-card grade-card">
            <div class="grade-header">
              <h3>Estado Estético</h3>
              <span class="grade-badge">${product.estado.grado}</span>
            </div>
            <p>${product.estado.resumen}</p>
          </div>

          <div class="info-card specs-detailed">
            <h3>Especificaciones Técnicas</h3>
            <dl>
              <dt>Procesador</dt><dd>${detailCpu}</dd>
              <dt>Memoria RAM</dt><dd>${product.especificaciones.ram}</dd>
              <dt>Almacenamiento</dt><dd>${product.especificaciones.almacenamiento}</dd>
              <dt>Pantalla</dt><dd>${product.especificaciones.pantalla}</dd>
              <dt>Gráficos</dt><dd>${product.especificaciones.graficos || 'Integrados'}</dd>
              <dt>Sistema</dt><dd>${product.especificaciones.so}</dd>
            </dl>
          </div>

          <div class="info-card kirma-check-card">
            <h3><span style="color:var(--kirma-primary)">KIRMA</span> Check</h3>
            <p style="font-size:0.875rem; color:var(--kirma-text-muted); margin-bottom:1rem;">Certificación de calidad técnica. Todo probado y funcional.</p>
            <div class="checks-grid">
              ${checksHtml}
            </div>
          </div>

        </div>
      </div>

      <div class="modal-footer">
        <div class="modal-price">
          <span class="price-val">${product.price_format || 'Consultar'}</span>
          <span class="price-lbl">${product.garantia || 'Garantía 6 Meses'}</span>
        </div>
        <button class="btn btn-primary" id="btn-modal-whatsapp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Me interesa este equipo
        </button>
      </div>
    `;

    modal.querySelector('.modal-content').innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  bindEvents(product) {
    const modal = document.getElementById(this.modalId);
    
    // Cerrar
    const closeBtn = modal.querySelector('.btn-close-modal');
    const closeAction = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeAction);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAction();
    });

    // Añadir soporte para cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeAction();
      }
    }, { once: true });

    // WhatsApp
    const waBtn = modal.querySelector('#btn-modal-whatsapp');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        WhatsAppService.openChat(product);
      });
    }

    // Galería
    const mainImg = modal.querySelector('#modal-main-img');
    const thumbs = modal.querySelectorAll('.thumb-btn');
    
    thumbs.forEach(btn => {
      btn.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        mainImg.src = btn.querySelector('img').src;
      });
    });
  }
};
