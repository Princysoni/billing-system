import api from './client';
export async function payInvoice(invoiceId, reference='') {
  const { data } = await api.post('/payments/pay/', { invoice_id: invoiceId, reference });
  return data;
}