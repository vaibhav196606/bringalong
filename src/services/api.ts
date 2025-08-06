import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  auth: {
    register: (userData: any) => api.post('/auth/register', userData),
    login: (credentials: any) => api.post('/auth/login', credentials),
    getCurrentUser: () => api.get('/auth/me'),
    updateProfile: (profileData: any) => api.put('/auth/profile', profileData),
    forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
    verifyResetToken: (token: string) => api.get(`/auth/verify-reset-token/${token}`),
    resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
  },

  // Trip endpoints
  trips: {
    getAll: (params?: any) => api.get('/trips', { params }),
    getById: (id: string) => api.get(`/trips/${id}`),
    create: (tripData: any) => api.post('/trips', tripData),
    update: (id: string, tripData: any) => api.put(`/trips/${id}`, tripData),
    delete: (id: string) => api.delete(`/trips/${id}`),
    getMyTrips: () => api.get('/trips/user/my-trips'),
  },

  // Request endpoints
  requests: {
    getMyRequests: () => api.get('/requests/my-requests'),
    updateStatus: (requestId: string, data: any) => api.put(`/requests/${requestId}`, data),
    create: (requestData: any) => api.post('/requests', requestData),
  },

  // User endpoints
  users: {
    getById: (id: string) => api.get(`/users/${id}`),
    updateProfile: (profileData: any) => api.put('/users/profile', profileData),
    getStats: (id: string) => api.get(`/users/${id}/stats`),
  },

  // Health check
  health: () => api.get('/health'),
};

export default apiService;
