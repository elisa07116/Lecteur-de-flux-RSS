import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Configuration axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Service pour les flux RSS
export const feedsAPI = {
  // Récupérer tous les flux
  getAll: () => api.get('/feeds'),
  
  // Récupérer un flux par ID
  getById: (id) => api.get(`/feeds/${id}`),
  
  // Créer un nouveau flux
  create: (feedData) => api.post('/feeds', feedData),
  
  // Mettre à jour un flux
  update: (id, feedData) => api.put(`/feeds/${id}`, feedData),
  
  // Supprimer un flux
  delete: (id) => api.delete(`/feeds/${id}`),
  
  // Récupérer tous les flux RSS
  fetchAll: () => api.post('/feeds/fetch_all'),
};

// Service pour les éléments de flux
export const feedItemsAPI = {
  // Récupérer les éléments d'un flux avec pagination
  getByFeedId: (feedId, page = 1, perPage = 5) => 
    api.get(`/feeds/${feedId}/feed_items?page=${page}&per_page=${perPage}`),
  
  // Récupérer un élément par ID
  getById: (id) => api.get(`/feed_items/${id}`),
  
  // Changer le statut de lecture
  toggleRead: (id) => api.post(`/feed_items/${id}/toggle_read`),
};

export default api; 