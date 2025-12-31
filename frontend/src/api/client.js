import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.detail || 'Request error';
    return Promise.reject(new Error(msg));
  }
);

export default api;