// Productivity API service
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
  return res.json();
};

/**
 * GET /api/productivity/productivity/summary
 * Returns: { overall_score, average_hours, tasks_completed }
 */
export const getProductivitySummary = async () => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.SUMMARY}`, {
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to fetch productivity summary');
};

/**
 * GET /api/productivity/productivity/employee/{employeeId}
 * Returns: [{ id, employee_id, department_id, team_id, score, date, created_at }]
 */
export const getEmployeeProductivity = async (employeeId) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.EMPLOYEE(employeeId)}`, {
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to fetch employee productivity');
};

/**
 * GET /api/productivity/admin/productivity/overview  (Admin only)
 * Returns: { average_productivity_score, total_tasks_completed, average_hours_logged }
 */
export const getOrgSummary = async () => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.ORG_OVERVIEW}`, {
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to fetch organization productivity summary');
};

/**
 * GET /api/productivity/admin/productivity/team/{teamId}  (Admin only)
 * Returns: { team_id, average_productivity_score, total_tasks_completed, average_hours_logged }
 */
export const getTeamSummary = async (teamId) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.TEAM_SUMMARY(teamId)}`, {
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to fetch team productivity summary');
};

/**
 * GET /api/productivity/admin/productivity/department/{departmentId}  (Admin only)
 * Returns: { department_id, average_productivity_score, total_tasks_completed, average_hours_logged }
 */
export const getDepartmentSummary = async (departmentId) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.DEPARTMENT_SUMMARY(departmentId)}`, {
    headers: authHeaders(),
  });
  return handleResponse(res, 'Failed to fetch department productivity summary');
};