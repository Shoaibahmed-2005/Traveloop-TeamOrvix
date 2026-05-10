import api from './axiosInstance.js';
export const tripAPI = {
  getTrips: () => api.get('/trips'),
  getTrip: (id) => api.get(`/trips/${id}`),
  createTrip: (data) => api.post('/trips', data),
  updateTrip: (id, data) => api.put(`/trips/${id}`, data),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  getSummary: (id) => api.get(`/trips/${id}/summary`),
  toggleVisibility: (id) => api.patch(`/trips/${id}/visibility`),
};
