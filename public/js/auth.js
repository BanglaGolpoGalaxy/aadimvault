'use strict';

const Auth = {
  getToken() {
    return localStorage.getItem('aadimvault_token');
  },
  getUser() {
    const u = localStorage.getItem('aadimvault_user');
    return u ? JSON.parse(u) : null;
  },
  saveAuth(token, user) {
    localStorage.setItem('aadimvault_token', token);
    localStorage.setItem('aadimvault_user', JSON.stringify(user));
  },
  clearAuth() {
    localStorage.removeItem('aadimvault_token');
    localStorage.removeItem('aadimvault_user');
  },
  isLoggedIn() {
    return !!this.getToken();
  },
  logout() {
    this.clearAuth();
    window.location.href = 'index.html';
  },
  async login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    this.saveAuth(data.token, data.user);
    return data;
  },
  async register(name, email, password) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  }
};
