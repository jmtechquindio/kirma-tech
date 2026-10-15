import { api } from './api-client.js';

document.addEventListener('DOMContentLoaded', async () => {
  const viewLogin = document.getElementById('view-login');
  const viewAdmin = document.getElementById('view-admin');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const navItems = document.querySelectorAll('.admin-nav-item[data-target]');
  const subviews = document.querySelectorAll('.subview');
  
  // ── INIT ─────────────────────────────────────────────────────────────
  
  if (api.token) {
    try {
      const me = await api.getMe();
      if (me) {
        showAdmin();
        loadDashboard();
      } else {
        showLogin();
      }
    } catch (e) {
      showLogin();
    }
  } else {
    showLogin();
  }

  // ── NAVEGACIÓN ───────────────────────────────────────────────────────
  
  navItems.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      
      navItems.forEach(n => n.classList.remove('active'));
      btn.classList.add('active');
      
      subviews.forEach(s => {
        if (s.id === targetId) s.style.display = 'block';
        else s.style.display = 'none';
      });

      if (targetId === 'subview-dashboard') loadDashboard();
      if (targetId === 'subview-products') loadProducts();
      if (targetId === 'subview-imports') loadImportsHistory();
    });
  });

  function showLogin() {
    viewLogin.classList.add('active');
    viewAdmin.classList.remove('active');
  }

  function showAdmin() {
    viewLogin.classList.remove('active');
    viewAdmin.classList.add('active');
  }

  // ── LOGIN / LOGOUT ───────────────────────────────────────────────────
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    
    try {
      const btn = loginForm.querySelector('button');
      btn.disabled = true;
      btn.textContent = 'Verificando...';
      
      await api.login(user, pass);
      showAdmin();
      loadDashboard();
    } catch (err) {
      loginError.textContent = err.message || 'Error de autenticación';
    } finally {
      const btn = loginForm.querySelector('button');
      btn.disabled = false;
      btn.textContent = 'Iniciar Sesión';
    }
  });

  document.getElementById('btn-logout').addEventListener('click', (e) => {
    e.preventDefault();
    api.logout();
  });

  // ── DASHBOARD ────────────────────────────────────────────────────────
  
  async function loadDashboard() {
    const container = document.getElementById('dashboard-stats');
    container.innerHTML = 'Cargando estadísticas...';
    try {
      const stats = await api.getStats();
      container.innerHTML = `
        <div class="stat-card"><div class="stat-value">${stats.total}</div><div class="stat-label">Total Productos</div></div>
        <div class="stat-card"><div class="stat-value" style="color:#10b981;">${stats.activo}</div><div class="stat-label">Activos en Catálogo</div></div>
        <div class="stat-card"><div class="stat-value" style="color:#f59e0b;">${stats.borrador}</div><div class="stat-label">Borradores (Revisión)</div></div>
        <div class="stat-card"><div class="stat-value" style="color:#ef4444;">${stats.agotado}</div><div class="stat-label">Agotados</div></div>
        <div class="stat-card"><div class="stat-value" style="color:#6366f1;">${stats.cambios_pendientes}</div><div class="stat-label">Precios Pendientes OCR</div></div>
      `;
    } catch (e) {
      container.innerHTML = `<div style="color:red;">Error cargando stats: ${e.message}</div>`;
    }
  }

  // ── INVENTARIO ───────────────────────────────────────────────────────
  
  const filterStatus = document.getElementById('filter-status');
  filterStatus.addEventListener('change', loadProducts);

  async function loadProducts() {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = '<tr><td colspan="7" style="padding: 2rem; text-align:center;">Cargando inventario...</td></tr>';
    
    try {
      const status = filterStatus.value;
      const res = await api.getAdminProducts(status);
      
      if (res.products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="padding: 2rem; text-align:center;">No se encontraron productos.</td></tr>';
        return;
      }

      tbody.innerHTML = res.products.map(p => `
        <tr style="border-bottom: 1px solid var(--kirma-border);">
          <td style="padding: 1rem; font-family: monospace;">${p.id}<br><small style="color:var(--kirma-text-muted)">${p.sku || 'Sin SKU'}</small></td>
          <td style="padding: 1rem;"><strong>${p.brand}</strong><br>${p.model}</td>
          <td style="padding: 1rem; font-size: 0.875rem; color:var(--kirma-text-muted)">
            ${p.processor || 'CPU?'} | ${p.ram_gb || '?'}GB | ${p.storage_gb || '?'}GB
          </td>
          <td style="padding: 1rem; font-weight:600;">${p.price_format}</td>
          <td style="padding: 1rem;">${p.stock}</td>
          <td style="padding: 1rem;">
            <span style="padding:0.25rem 0.5rem; border-radius:1rem; font-size:0.75rem; font-weight:600; 
              background: ${p.status === 'activo' ? '#d1fae5' : (p.status === 'borrador' ? '#fef3c7' : '#f3f4f6')};
              color: ${p.status === 'activo' ? '#065f46' : (p.status === 'borrador' ? '#92400e' : '#374151')};">
              ${p.status.toUpperCase()}
            </span>
          </td>
          <td style="padding: 1rem;">
            <button class="btn btn-outline btn-publish" data-id="${p.id}" ${p.status==='activo' ? 'disabled' : ''} style="padding:0.25rem 0.5rem; font-size:0.75rem;">Publicar</button>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('.btn-publish').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          if (confirm(`¿Publicar ${id} en el catálogo principal?`)) {
            e.target.disabled = true;
            e.target.textContent = 'Publicando...';
            try {
              await api.updateProduct(id, { status: 'activo' });
              loadProducts();
            } catch (err) {
              alert(err.message);
              e.target.disabled = false;
              e.target.textContent = 'Publicar';
            }
          }
        });
      });

    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" style="color:red; text-align:center;">Error: ${e.message}</td></tr>`;
    }
  }

  // ── OCR IMPORTACIÓN ──────────────────────────────────────────────────
  
  const fileInput = document.getElementById('import-file');
  const fileDisplay = document.getElementById('file-name-display');
  const btnUpload = document.getElementById('btn-upload-import');
  const importForm = document.getElementById('import-form');
  const importStatus = document.getElementById('import-status');

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      fileDisplay.textContent = e.target.files[0].name;
      btnUpload.disabled = false;
    } else {
      fileDisplay.textContent = '';
      btnUpload.disabled = true;
    }
  });

  importForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (fileInput.files.length === 0) return;
    
    const file = fileInput.files[0];
    const apiKey = document.getElementById('gemini-key').value;
    
    const formData = new FormData();
    formData.append('file', file);
    if (apiKey) formData.append('gemini_api_key', apiKey);

    btnUpload.disabled = true;
    btnUpload.textContent = 'Subiendo...';
    importStatus.textContent = '';

    try {
      const res = await api._fetch('/admin/imports', {
        method: 'POST',
        body: formData 
      });
      
      importStatus.innerHTML = `<span style="color:#10b981;">✅ ${res.message}</span>`;
      fileInput.value = '';
      fileDisplay.textContent = '';
      setTimeout(loadImportsHistory, 1000);
    } catch (err) {
      importStatus.innerHTML = `<span style="color:red;">❌ Error: ${err.message}</span>`;
      btnUpload.disabled = false;
      btnUpload.textContent = 'Subir y Procesar';
    }
  });

  async function loadImportsHistory() {
    const tbody = document.getElementById('imports-history-body');
    try {
      const res = await api._fetch('/admin/imports');
      if (res.imports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="padding: 2rem; text-align:center;">No hay importaciones.</td></tr>';
        return;
      }

      tbody.innerHTML = res.imports.map(imp => `
        <tr style="border-bottom: 1px solid var(--kirma-border);">
          <td style="padding: 1rem; font-family: monospace;">${imp.id}</td>
          <td style="padding: 1rem;">${imp.filename}</td>
          <td style="padding: 1rem;">${new Date(imp.uploaded_at).toLocaleString()}</td>
          <td style="padding: 1rem;">
            <span style="font-weight:600; color: ${imp.status === 'procesando' ? '#f59e0b' : (imp.status === 'revision' ? '#3b82f6' : (imp.status === 'aprobada' ? '#10b981' : '#ef4444'))};">
              ${imp.status.toUpperCase()}
            </span>
          </td>
          <td style="padding: 1rem;">
            ${imp.total_records} detectados<br>
            <small style="color:var(--kirma-text-muted)">N:${imp.new_count} | U:${imp.update_count}</small>
          </td>
          <td style="padding: 1rem;">
            <button class="btn btn-outline btn-sm btn-view-import" data-id="${imp.id}">Ver Detalle</button>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('.btn-view-import').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          openImportDetails(id);
        });
      });
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Error cargando historial</td></tr>`;
    }
  }

  async function openImportDetails(importId) {
    const container = document.getElementById('ocr-results-container');
    const tbody = document.getElementById('ocr-tbody');
    document.getElementById('ocr-count').textContent = '...';
    
    container.style.display = 'block';
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem;">Cargando ítems...</td></tr>';
    
    try {
      const res = await api._fetch(`/admin/imports/${importId}/items`);
      const imp = await api._fetch(`/admin/imports/${importId}`);
      
      document.getElementById('ocr-count').textContent = res.total;
      
      // Mostrar botones de acción masiva
      const btnApproveAll = document.getElementById('btn-ocr-apply');
      const btnRejectAll = document.getElementById('btn-ocr-discard');
      
      btnApproveAll.onclick = async () => {
        if(confirm(`¿Aprobar todos los cambios válidos de la importación ${importId}?`)){
          await api._fetch(`/admin/imports/${importId}/approve`, { method: 'POST', body: JSON.stringify({}) });
          openImportDetails(importId);
          loadDashboard();
        }
      };

      btnRejectAll.onclick = async () => {
        if(confirm(`¿Rechazar por completo la importación ${importId}?`)){
          await api._fetch(`/admin/imports/${importId}/reject`, { method: 'POST' });
          openImportDetails(importId);
          loadDashboard();
        }
      };

      if (res.items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem;">No hay ítems en esta importación.</td></tr>';
        return;
      }

      tbody.innerHTML = res.items.map(item => `
        <tr style="border-bottom: 1px solid var(--kirma-border); background: ${item.admin_action ? '#f9fafb' : 'white'};">
          <td style="padding: 1rem;"><input type="checkbox" ${item.admin_action ? 'disabled' : ''}></td>
          <td style="padding: 1rem;">
            <strong>${item.extracted_brand || ''} ${item.extracted_model || 'Desconocido'}</strong><br>
            <small style="color:var(--kirma-text-muted)">${item.extracted_processor || ''} | ${item.extracted_ram || ''} | ${item.extracted_storage || ''}</small>
          </td>
          <td style="padding: 1rem;">
            <span style="padding:0.25rem 0.5rem; border-radius:1rem; font-size:0.75rem; font-weight:600; 
              background: ${item.status === 'NUEVO' ? '#d1fae5' : (item.status === 'ACTUALIZAR' ? '#dbeafe' : (item.status === 'REVISION' ? '#fef3c7' : '#f3f4f6'))};
              color: ${item.status === 'NUEVO' ? '#065f46' : (item.status === 'ACTUALIZAR' ? '#1e40af' : (item.status === 'REVISION' ? '#92400e' : '#374151'))};">
              ${item.status}
            </span><br>
            <small style="color:var(--kirma-text-muted)">Confianza: ${Math.round(item.confidence * 100)}%</small>
          </td>
          <td style="padding: 1rem;">${item.extracted_price ? '$'+item.extracted_price.toLocaleString() : 'N/A'}</td>
          <td style="padding: 1rem;">
            <input type="number" class="form-control form-control-sm price-input" value="${item.final_price || item.extracted_price || ''}" data-id="${item.id}" ${item.admin_action ? 'disabled' : ''}>
          </td>
          <td style="padding: 1rem;">
            ${item.admin_action ? `
              <span style="color: ${item.admin_action === 'approved' ? 'green' : 'red'}; font-weight: bold;">
                ${item.admin_action.toUpperCase()}
              </span>
            ` : `
              <button class="btn btn-outline btn-sm btn-item-approve" data-id="${item.id}">Aprobar</button>
            `}
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('.btn-item-approve').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const itemId = e.target.getAttribute('data-id');
          const row = e.target.closest('tr');
          const priceInput = row.querySelector('.price-input');
          const finalPrice = parseInt(priceInput.value, 10);

          try {
            await api._fetch(`/admin/import-items/${itemId}`, {
              method: 'PATCH',
              body: JSON.stringify({ action: 'approved', final_price: finalPrice })
            });
            openImportDetails(importId);
          } catch (err) {
            alert('Error al aprobar: ' + err.message);
          }
        });
      });

    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Error cargando detalles: ${e.message}</td></tr>`;
    }
  }

});
