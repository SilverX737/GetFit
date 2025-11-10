import { api, setToken, clearToken } from './apiClient';

export async function login(email, password) {
  const { token, user } = await api('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setToken(token);
  localStorage.setItem('token', token);
  return user;
}

export async function register(payload) {
  return api('/api/auth/register', { method: 'POST', body: payload });
}

export async function me() {
  return api('/api/me');
}

export function logout() {
  clearToken();
  localStorage.removeItem('token');
}
