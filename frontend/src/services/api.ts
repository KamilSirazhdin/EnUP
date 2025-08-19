import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          localStorage.setItem('accessToken', access_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.put('/user/profile', data),
  
  getProgress: () => api.get('/progress'),
  
  completeTopic: (data: { topic_id: string; score: number }) =>
    api.post('/progress/complete', data),
};

// Course API
export const courseAPI = {
  getLevels: () => api.get('/levels'),
  
  getLevel: (id: string) => api.get(`/levels/${id}`),
  
  getTopics: (levelId: string) => api.get(`/levels/${levelId}/topics`),
  
  getTopic: (id: string) => api.get(`/topics/${id}`),
  
  getExercise: (id: string) => api.get(`/exercises/${id}`),
  
  submitExercise: (id: string, data: { answer: string }) =>
    api.post(`/exercises/${id}/attempt`, data),
};

// AI Chat API
export const chatAPI = {
  getSessions: () => api.get('/chat/sessions'),
  
  createSession: (data: { topic_id?: string; title: string }) =>
    api.post('/chat/sessions', data),
  
  getMessages: (sessionId: string) => api.get(`/chat/sessions/${sessionId}/messages`),
  
  sendMessage: (sessionId: string, data: { content: string }) =>
    api.post(`/chat/sessions/${sessionId}/messages`, data),
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard'),
};

// Admin API
export const adminAPI = {
  createLevel: (data: any) => api.post('/admin/levels', data),
  updateLevel: (id: string, data: any) => api.put(`/admin/levels/${id}`, data),
  deleteLevel: (id: string) => api.delete(`/admin/levels/${id}`),
  
  createTopic: (data: any) => api.post('/admin/topics', data),
  updateTopic: (id: string, data: any) => api.put(`/admin/topics/${id}`, data),
  deleteTopic: (id: string) => api.delete(`/admin/topics/${id}`),
  
  createExercise: (data: any) => api.post('/admin/exercises', data),
  updateExercise: (id: string, data: any) => api.put(`/admin/exercises/${id}`, data),
  deleteExercise: (id: string) => api.delete(`/admin/exercises/${id}`),
};

export default api;
