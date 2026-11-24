import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected server error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Attendance, Subject & Student API Endpoints
export const attendanceApi = {
  getSummary: () => apiClient.get('/api/attendance/summary'),
  bulkMark: (data) => apiClient.post('/api/attendance/mark', data),
  addSubject: (data) => apiClient.post('/api/subjects', data),
  updateSubject: (id, data) => apiClient.put(`/api/subjects/${id}`, data),
  deleteSubject: (id) => apiClient.delete(`/api/subjects/${id}`),
  increment: (id, type) => apiClient.patch(`/api/subjects/${id}/increment`, { type }),
  checkHealth: () => apiClient.get('/api/health'),
  getStudents: () => apiClient.get('/api/students'),
  getCurrentStudent: () => apiClient.get('/api/students/current'),
};

export default apiClient;
