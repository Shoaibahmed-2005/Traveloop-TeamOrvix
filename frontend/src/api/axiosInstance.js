import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('traveloop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('traveloop_token');
      localStorage.removeItem('traveloop_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
