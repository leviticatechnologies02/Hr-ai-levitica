// Time Tracking API service
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
 * GET /api/productivity/time-tracking/overview?period={period}
 */
export const getTimeTrackingOverview = async (period = 'today') => {
  const res = await fetch(
    `${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.TIME_TRACKING_OVERVIEW(period)}`,
    { headers: authHeaders() }
  );
  return handleResponse(res, 'Failed to fetch time tracking overview');
};

/**
 * GET /api/productivity/time-tracking/entries?period={period}&project_id={projectId}
 */
export const getTimeEntries = async (period = 'today', projectId = null) => {
  const res = await fetch(
    `${BASE_URL}${API_ENDPOINTS.PRODUCTIVITY.TIME_TRACKING_ENTRIES(period, projectId)}`,
    { headers: authHeaders() }
  );
  return handleResponse(res, 'Failed to fetch time entries');
};