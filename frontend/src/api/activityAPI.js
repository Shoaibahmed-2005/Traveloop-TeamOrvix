import api from './axiosInstance.js';
export const activityAPI = {
  getActivities: (params) => api.get('/activities', { params }),
  getActivity: (id) => api.get(`/activities/${id}`),
  addToStop: (tripId, stopId, data) => api.post(`/trips/${tripId}/stops/${stopId}/activities`, data),
  removeFromStop: (tripId, stopId, id) => api.delete(`/trips/${tripId}/stops/${stopId}/activities/${id}`),
};
