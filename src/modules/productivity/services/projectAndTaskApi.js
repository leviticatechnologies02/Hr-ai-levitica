// Project & Task API service
// Plain fetch wrappers (no Redux/RTK Query) to match Levitica's existing pattern
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (res, errorMessage) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || errorMessage);
  }
  // DELETE endpoints may return a simple message body
  return res.json().catch(() => ({}));
};

// ---------------- PROJECTS ----------------

export const listProjects = async () => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.PROJECTS}`, {
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to fetch projects');
};

export const createProject = async (body) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.PROJECTS}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res, 'Failed to create project');
};

export const updateProject = async (id, body) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.PROJECTS}/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res, 'Failed to update project');
};

export const deleteProject = async (id) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.PROJECTS}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to delete project');
};

// ---------------- TASKS ----------------

export const listTasks = async () => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.TASKS}`, {
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to fetch tasks');
};

export const createTask = async (body) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.TASKS}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res, 'Failed to create task');
};

export const updateTask = async (id, body) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.TASKS}/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res, 'Failed to update task');
};

export const completeTask = async (id) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.TASKS}/${id}/complete`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to complete task');
};

export const reopenTask = async (id) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.TASKS}/${id}/reopen`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to reopen task');
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.TASKS}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to delete task');
};