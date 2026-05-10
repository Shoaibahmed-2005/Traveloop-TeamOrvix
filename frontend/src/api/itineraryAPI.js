import api from './axiosInstance.js';
export const itineraryAPI = {
  getStops: (tripId) => api.get(`/trips/${tripId}/stops`),
  addStop: (tripId, data) => api.post(`/trips/${tripId}/stops`, data),
  updateStop: (tripId, stopId, data) => api.put(`/trips/${tripId}/stops/${stopId}`, data),
  deleteStop: (tripId, stopId) => api.delete(`/trips/${tripId}/stops/${stopId}`),
  reorderStops: (tripId, stops) => api.put(`/trips/${tripId}/stops/reorder`, { stops }),
  getSections: (tripId, stopId) => api.get(`/trips/${tripId}/stops/${stopId}/sections`),
  addSection: (tripId, stopId, data) => api.post(`/trips/${tripId}/stops/${stopId}/sections`, data),
  updateSection: (tripId, stopId, sectionId, data) => api.put(`/trips/${tripId}/stops/${stopId}/sections/${sectionId}`, data),
  deleteSection: (tripId, stopId, sectionId) => api.delete(`/trips/${tripId}/stops/${stopId}/sections/${sectionId}`),
};
