import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: dynamically inject X-User-Id header from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const currentUserId = localStorage.getItem('scholarhub_user_id') || '1';
    config.headers['X-User-Id'] = currentUserId;
    return config;
  },
  (error) => Promise.reject(error)
);

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

// Projects & Collaboration API Endpoints
export const projectApi = {
  getProjects: () => apiClient.get('/api/projects'),
  getInvitations: () => apiClient.get('/api/projects/invitations'),
  getProject: (id) => apiClient.get(`/api/projects/${id}`),
  createProject: (data) => apiClient.post('/api/projects', data),
  inviteMember: (projectId, userId) => apiClient.post(`/api/projects/${projectId}/invite`, { userId }),
  acceptInvitation: (projectId) => apiClient.post(`/api/projects/${projectId}/accept`),
  rejectInvitation: (projectId) => apiClient.post(`/api/projects/${projectId}/reject`),
  updateOverallTask: (projectId, memberId, data) =>
    apiClient.patch(`/api/projects/${projectId}/members/${memberId}/task`, data),
  completeOverallTask: (projectId, memberId) =>
    apiClient.patch(`/api/projects/${projectId}/members/${memberId}/task/complete`),
  addSubtask: (projectId, memberId, data) =>
    apiClient.post(`/api/projects/${projectId}/members/${memberId}/subtasks`, data),
  completeSubtask: (projectId, memberId, subtaskId) =>
    apiClient.patch(`/api/projects/${projectId}/members/${memberId}/subtasks/${subtaskId}/complete`),
  deleteSubtask: (projectId, memberId, subtaskId) =>
    apiClient.delete(`/api/projects/${projectId}/members/${memberId}/subtasks/${subtaskId}`),
  getMessages: (projectId) => apiClient.get(`/api/projects/${projectId}/messages`),
  sendMessage: (projectId, content) => apiClient.post(`/api/projects/${projectId}/messages`, { content }),
};

// Notification Endpoints
export const notificationApi = {
  getNotifications: () => apiClient.get('/api/notifications'),
  getUnreadCount: () => apiClient.get('/api/notifications/unread-count'),
  markAsRead: (id) => apiClient.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/api/notifications/mark-all-read'),
};

// User / Student Directory Endpoints
export const userApi = {
  getUsers: (query = '') => apiClient.get('/api/users', { params: query ? { query } : {} }),
  getCurrentUser: () => apiClient.get('/api/users/current'),
  getUserById: (id) => apiClient.get(`/api/users/${id}`),
};

export default apiClient;
