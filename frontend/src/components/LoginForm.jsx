import { useState } from 'react';
import { login } from '../api/auth';
import { setAuthToken } from '../api/client';

export default function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { access } = await login(username, password);
      setAuthToken(access);
      localStorage.setItem('token', access);
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>Username</label>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}