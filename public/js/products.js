'use strict';

const Products = {
  authHeaders() {
    const token = Auth.getToken();
    return { 'Authorization': `Bearer ${token}` };
  },
  async getAll() {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },
  async getById(id) {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },
  async create(formData) {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: this.authHeaders(),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Create failed');
    return data;
  },
  async update(id, formData) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');
    return data;
  },
  async delete(id) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: this.authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Delete failed');
    return data;
  }
};
