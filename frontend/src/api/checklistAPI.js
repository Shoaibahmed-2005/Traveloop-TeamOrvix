import api from './axiosInstance.js';
export const checklistAPI = {
  getChecklist: (tripId) => api.get(`/trips/${tripId}/checklist`),
  addItem: (tripId, data) => api.post(`/trips/${tripId}/checklist`, data),
  toggleItem: (tripId, id) => api.patch(`/trips/${tripId}/checklist/${id}`),
  deleteItem: (tripId, id) => api.delete(`/trips/${tripId}/checklist/${id}`),
  resetChecklist: (tripId) => api.delete(`/trips/${tripId}/checklist/reset`),
};
