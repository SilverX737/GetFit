import { setToken, clearToken } from '../api/apiClient';

export function bootstrapAuth() {
  try {
    const saved = localStorage.getItem('token');
    if (saved) setToken(saved);
  } catch (_) {
    // ignore storage errors
  }
}

export function setAuthToken(tok) {
  localStorage.setItem('token', tok);
  setToken(tok);
}

export function clearAuthToken() {
  localStorage.removeItem('token');
  clearToken();
}
