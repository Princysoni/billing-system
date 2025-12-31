import api from './client';
export async function mySubscriptions(page=1) {
  const { data } = await api.get(`/subscriptions/?page=${page}`);
  return data;
}
export async function subscribe(planId) {
  const { data } = await api.post('/subscriptions/', { plan: planId });
  return data;
}
export async function cancelSubscription(id) {
  const { data } = await api.post(`/subscriptions/${id}/cancel/`);
  return data;
}