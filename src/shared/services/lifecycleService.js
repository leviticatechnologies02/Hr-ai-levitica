// services/lifecycleService.js

// Employee endpoints
export const fetchEmployees = async (params) => {
  const response = await api.get('/lifecycle/employees', { params });
  return response.data;
};

export const fetchOnboardingChecklist = async (params) => {
  const response = await api.get('/lifecycle/onboarding', { params });
  return response.data;
};

export const fetchProbationReviews = async (params) => {
  const response = await api.get('/lifecycle/probation', { params });
  return response.data;
};

export const fetchTransferRequests = async (params) => {
  const response = await api.get('/lifecycle/transfers', { params });
  return response.data;
};

export const fetchExitProcesses = async (params) => {
  const response = await api.get('/lifecycle/exits', { params });
  return response.data;
};

export const fetchContractRenewals = async (params) => {
  const response = await api.get('/lifecycle/contracts', { params });
  return response.data;
};

export const fetchLifecycleStats = async () => {
  const response = await api.get('/lifecycle/stats');
  return response.data;
};

// Mutation endpoints
export const updateOnboardingTask = async (taskId, data) => {
  const response = await api.put(`/lifecycle/onboarding/${taskId}`, data);
  return response.data;
};

export const approveTransferRequest = async (id) => {
  const response = await api.post(`/lifecycle/transfers/${id}/approve`);
  return response.data;
};

export const rejectTransferRequest = async (id) => {
  const response = await api.post(`/lifecycle/transfers/${id}/reject`);
  return response.data;
};

export const startProbationReview = async (reviewId) => {
  const response = await api.post(`/lifecycle/probation/${reviewId}/start`);
  return response.data;
};

export const completeProbationReview = async (reviewId, rating) => {
  const response = await api.post(`/lifecycle/probation/${reviewId}/complete`, { rating });
  return response.data;
};

export const initiateExitProcess = async (employeeId, data) => {
  const response = await api.post(`/lifecycle/exits`, { employeeId, ...data });
  return response.data;
};

export const createTransferRequest = async (data) => {
  const response = await api.post('/lifecycle/transfers', data);
  return response.data;
};

export const createProbationReview = async (data) => {
  const response = await api.post('/lifecycle/probation', data);
  return response.data;
};

export const createContractRenewal = async (data) => {
  const response = await api.post('/lifecycle/contracts', data);
  return response.data;
};

export const processConfirmation = async (data) => {
  const response = await api.post('/lifecycle/confirmation', data);
  return response.data;
};

export const exportLifecycleData = async (type) => {
  const response = await api.get(`/lifecycle/export/${type}`, { responseType: 'blob' });
  return response.data;
};