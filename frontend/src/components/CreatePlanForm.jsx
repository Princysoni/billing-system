import { useState } from 'react';
import { createPlan } from '../api/plans';

export default function CreatePlanForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [active, setActive] = useState(true);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const plan = await createPlan({ name, price, currency, active });
      setMessage(`Plan created: ${plan.name} (${plan.price} ${plan.currency})`);
      setName('');
      setPrice('');
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && <div style={{ marginBottom: '10px' }}>{message}</div>}
      <div>
        <label>Name</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} required />
      </div>
      <div>
        <label>Price</label>
        <input type="number" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} required />
      </div>
      <div>
        <label>Currency</label>
        <input value={currency} onChange={(e)=>setCurrency(e.target.value)} />
      </div>
      <div>
        <label>Active</label>
        <input type="checkbox" checked={active} onChange={(e)=>setActive(e.target.checked)} />
      </div>
      <button type="submit">Create Plan</button>
    </form>
  );
}