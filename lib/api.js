import axios from 'axios';

const API_URL = 'https://unientry-server-production.up.railway.app/api' || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('unientry_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('unientry_token');
        localStorage.removeItem('unientry_admin');
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/admin/login', data),
  getMe: () => api.get('/admin/me'),
  logout: () => api.post('/admin/logout'),
};

// University APIs
export const universityAPI = {
  getAll: (params) => api.get('/universities', { params }),
  getFeatured: () => api.get('/universities/featured'),
  getById: (id) => api.get(`/universities/${id}`),
  getCountries: () => api.get('/universities/countries'),
  create: (data) => api.post('/universities', data),
  update: (id, data) => api.put(`/universities/${id}`, data),
  delete: (id) => api.delete(`/universities/${id}`),
};

// Internship APIs
export const internshipAPI = {
  getAll: (params) => api.get('/internships', { params }),
  getAllAdmin: () => api.get('/internships/all'),
  getById: (id) => api.get(`/internships/${id}`),
  create: (data) => api.post('/internships', data),
  update: (id, data) => api.put(`/internships/${id}`, data),
  delete: (id) => api.delete(`/internships/${id}`),
};

// Inquiry APIs
export const inquiryAPI = {
  create: (data) => api.post('/inquiry/create', data),
  getAll: (params) => api.get('/inquiry/all', { params }),
  update: (id, data) => api.put(`/inquiry/${id}`, data),
  delete: (id) => api.delete(`/inquiry/${id}`),
};

// Settings APIs
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  getStats: () => api.get('/settings/stats'),
};

export default api;
