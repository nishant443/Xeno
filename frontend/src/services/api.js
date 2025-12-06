import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('xeno-auth');
  if (stored) {
    try {
      const { authToken } = JSON.parse(stored);
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.warn('Failed to parse auth cache', error);
    }
  }
  return config;
});

export default api;
