// Activity / Monitoring API service
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
 * GET /api/productivity/admin/monitoring  (Admin only)
 * Returns: { items: [{ employee_id, name, email, apps: [...], activities: [...] }], hasMore, page, limit, date }
 */
export const getAdminMonitoring = async (page = 1, limit = 15, employeeId = null) => {
  const res = await fetch(
    `${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.ADMIN_MONITORING(page, limit, employeeId)}`,
    { headers: authHeaders() }
  );
  return handleResponse(res, 'Failed to fetch monitoring data');
};