import api from './axiosInstance.js';
export const budgetAPI = {
  getBudget: (tripId) => api.get(`/trips/${tripId}/budget`),
  getExpenses: (tripId) => api.get(`/trips/${tripId}/expenses`),
  addExpense: (tripId, data) => api.post(`/trips/${tripId}/expenses`, data),
  updateExpense: (tripId, id, data) => api.put(`/trips/${tripId}/expenses/${id}`, data),
  deleteExpense: (tripId, id) => api.delete(`/trips/${tripId}/expenses/${id}`),
};
