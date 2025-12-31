import api from './client';
export async function listInvoices(page=1) {
  const { data } = await api.get(`/invoices/?page=${page}`);
  return data;
}
export async function createInvoice(payload) {
  const { data } = await api.post('/invoices/', payload);
  return data;
}