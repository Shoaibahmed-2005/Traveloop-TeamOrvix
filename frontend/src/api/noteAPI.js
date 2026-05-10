import api from './axiosInstance.js';
export const noteAPI = {
  getNotes: (tripId, params) => api.get(`/trips/${tripId}/notes`, { params }),
  addNote: (tripId, data) => api.post(`/trips/${tripId}/notes`, data),
  updateNote: (tripId, id, data) => api.put(`/trips/${tripId}/notes/${id}`, data),
  deleteNote: (tripId, id) => api.delete(`/trips/${tripId}/notes/${id}`),
};
