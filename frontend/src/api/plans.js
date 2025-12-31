import api from './client';
export async function listPlans(page=1) {
  const { data } = await api.get(`/plans/?page=${page}`);
  return data;
}
export async function createPlan(payload) {
  const { data } = await api.post('/plans/', payload);
  return data;
}