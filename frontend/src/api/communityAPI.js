import api from './axiosInstance.js';
export const communityAPI = {
  getPosts: (params) => api.get('/community', { params }),
  getPost: (postId) => api.get(`/community/${postId}`),
  publishTrip: (tripId, data) => api.post(`/community/${tripId}/publish`, data),
  likePost: (postId) => api.post(`/community/${postId}/like`),
  getPublicItinerary: (shareToken) => api.get(`/public/itinerary/${shareToken}`),
};
