import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PlanList from './components/PlanList';
import InvoiceList from './components/InvoiceList';
import { setAuthToken } from './api/client';

function Protected({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm onSuccess={() => setLogged(true)} />} />
        <Route path="/" element={
          <Protected>
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ flex: 1 }}>
                <h3>Plans</h3>
                <PlanList />
              </div>
              <div style={{ flex: 1 }}>
                <h3>Invoices</h3>
                <InvoiceList />
              </div>
            </div>
          </Protected>
        } />
      </Routes>
    </BrowserRouter>
  );
}