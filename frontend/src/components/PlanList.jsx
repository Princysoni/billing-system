import { useEffect, useState } from 'react';
import { listPlans } from '../api/plans';
import { subscribe } from '../api/subscriptions';

export default function PlanList() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    listPlans(page).then(setPlans).catch(err => setError(err.message));
  }, [page]);

  async function handleSubscribe(planId) {
    try {
      await subscribe(planId);
      alert('Subscribed!');
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {(plans.results || plans).map((p) => (
        <div key={p.id} style={{ border: '1px solid #ddd', margin: 8, padding: 8 }}>
          <div><b>Name:</b> {p.name}</div>
          <div><b>Price:</b> {p.price} {p.currency}</div>
          <div><b>Active:</b> {String(p.active)}</div>
          <button onClick={() => handleSubscribe(p.id)} disabled={!p.active}>Subscribe</button>
        </div>
      ))}
      <div>
        <button disabled={page<=1} onClick={()=>setPage(page-1)}>Prev</button>
        <button onClick={()=>setPage(page+1)}>Next</button>
      </div>
    </div>
  );
}