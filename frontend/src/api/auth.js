import api from './client';

export async function login(username, password) {
  const { data } = await api.post('/auth/token/', { username, password });
  return data; // { access, refresh }
}