/**
 * KIRMA V2 - API Client
 * Maneja las peticiones al backend y la autenticación
 */

const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.token = this._getCookie('kirma_token');
  }

  _getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  async _fetch(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Permitir enviar FormData sin Content-Type predefinido
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && endpoint !== '/auth/login') {
      window.location.href = '/admin.html'; // Redirigir si el token expira
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error((data && data.detail) || `Error ${response.status}`);
    }

    return data;
  }

  // --- Auth ---
  async login(username, password) {
    const data = await this._fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    this.token = data.access_token; // Aunque también está en la cookie HTTPOnly
    return data;
  }

  async logout() {
    await this._fetch('/auth/logout', { method: 'POST' });
    this.token = null;
    window.location.href = '/admin.html';
  }

  async getMe() {
    return await this._fetch('/auth/me');
  }

  // --- Admin Products ---
  async getAdminProducts(status = '') {
    const qs = status ? `?status=${status}` : '';
    return await this._fetch(`/admin/products${qs}`);
  }

  async getProduct(id) {
    return await this._fetch(`/admin/products/${id}`);
  }

  async updateProduct(id, updates) {
    return await this._fetch(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // --- Dashboard ---
  async getStats() {
    return await this._fetch('/admin/inventory/stats');
  }
}

export const api = new ApiClient();
