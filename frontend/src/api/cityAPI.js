import api from './axiosInstance.js';
export const cityAPI = {
  getCities: (params) => api.get('/cities', { params }),
  getPopular: () => api.get('/cities/popular'),
  getRegions: () => api.get('/cities/regions'),
  getCity: (id) => api.get(`/cities/${id}`),
};
