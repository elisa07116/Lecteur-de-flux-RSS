import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const feedsAPI = {
  getAll: () => api.get('/feeds'),
  getById: (id) => api.get(`/feeds/${id}`),
  create: (feedData) => api.post('/feeds', feedData),
  update: (id, feedData) => api.put(`/feeds/${id}`, feedData),
  delete: (id) => api.delete(`/feeds/${id}`),
  fetchAll: () => api.post('/feeds/fetch_all'),
};

export const feedItemsAPI = {
  getByFeedId: (feedId, page = 1, perPage = 5) => 
    api.get(`/feeds/${feedId}/feed_items?page=${page}&per_page=${perPage}`),
  getById: (id) => api.get(`/feed_items/${id}`),
  toggleRead: (id) => api.post(`/feed_items/${id}/toggle_read`),
};

export default api; 