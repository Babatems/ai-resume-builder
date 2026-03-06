import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  signup: (name, email, password) =>
    api.post('/auth/signup', { name, email, password }),
  signin: (email, password) =>
    api.post('/auth/signin', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Resume endpoints
export const resumeAPI = {
  uploadResume: (file, name) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAllResumes: () => api.get('/resumes'),
  getResume: (id) => api.get(`/resumes/${id}`),
  optimizeResume: (resumeId, jobDescription) =>
    api.post('/resumes/optimize', { resumeId, jobDescription }),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
};

export default api;
