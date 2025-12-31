import { useEffect, useState } from 'react';
import { listInvoices } from '../api/invoices';
import { payInvoice } from '../api/payments';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    listInvoices(page).then(setInvoices).catch(err=>setError(err.message));
  }, [page]);

  async function handlePay(id) {
    try {
      await payInvoice(id, 'MOCK-REF-' + Date.now());
      alert('Payment successful');
      listInvoices(page).then(setInvoices);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {(invoices.results || invoices).map((inv) => (
        <div key={inv.id} style={{ border: '1px solid #ddd', margin: 8, padding: 8 }}>
          <div><b>Number:</b> {inv.number}</div>
          <div><b>Amount:</b> {inv.amount} {inv.currency}</div>
          <div><b>Status:</b> {inv.status}</div>
          <button onClick={()=>handlePay(inv.id)} disabled={inv.status==='PAID'}>Pay</button>
        </div>
      ))}
      <div>
        <button disabled={page<=1} onClick={()=>setPage(page-1)}>Prev</button>
        <button onClick={()=>setPage(page+1)}>Next</button>
      </div>
    </div>
  );
}