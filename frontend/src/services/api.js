import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Pass token dynamically inside headers if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  getMe: () => API.get('/auth/me'),
};

export const studentService = {
  getAll: (params) => API.get('/students', { params }),
  getOne: (id) => API.get(`/students/${id}`),
  create: (formData) => API.post('/students', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => API.put(`/students/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => API.delete(`/students/${id}`),
};

export const subjectService = {
  getAll: (params) => API.get('/subjects', { params }),
  create: (data) => API.post('/subjects', data),
  update: (id, data) => API.put(`/subjects/${id}`, data),
  delete: (id) => API.delete(`/subjects/${id}`),
};

export const facultyService = {
  getAll: (params) => API.get('/faculty', { params }),
  create: (data) => API.post('/faculty', data),
  update: (id, data) => API.put(`/faculty/${id}`, data),
  delete: (id) => API.delete(`/faculty/${id}`),
};

export const attendanceService = {
  getLogs: (params) => API.get('/attendance', { params }),
  record: (data) => API.post('/attendance', data),
  recordBulk: (data) => API.post('/attendance/bulk', data),
  getReport: (studentId) => API.get(`/attendance/report/${studentId}`),
};

export const dashboardService = {
  getStats: () => API.get('/dashboard/stats'),
};

export const logService = {
  getLogs: () => API.get('/logs'),
};

export default API;
