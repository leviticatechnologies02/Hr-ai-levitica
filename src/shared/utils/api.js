// API Utility for Backend Communication
import { BASE_URL } from "../constants/api.config";

// Get JWT token from localStorage
const getToken = () => localStorage.getItem('token');

// Generic API call function with error handling
export const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    // Handle successful responses
    if (response.ok) {
      // 204 No Content (e.g. DELETE) has no body - do not call .json()
      if (response.status === 204) {
        return null;
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (!text || !text.trim()) return null;
        try {
          return JSON.parse(text);
        } catch (_) {
          return null;
        }
      }
      return null;
    } else {
      // Handle error responses
      const errorData = await response.json().catch(() => ({}));
      let message = errorData.message || `API Error: ${response.status} ${response.statusText}`;
      const detail = errorData.detail;
      if (detail != null) {
        if (typeof detail === 'string') {
          message = detail;
        } else if (Array.isArray(detail)) {
          message = detail.map((d) => (d && d.msg) ? `${d.msg}${d.loc && d.loc.length ? ` (${d.loc.join('.')})` : ''}` : String(d)).filter(Boolean).join('; ') || message;
        } else if (typeof detail === 'object') {
          message = JSON.stringify(detail);
        }
      }
      throw new Error(message);
    }
  } catch (err) {
    console.error('API Call Error:', err);
    // If it's a network error, provide more helpful message
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(`Failed to connect to backend at ${BASE_URL}. Please ensure the backend server is running.`);
    }
    throw err;
  }
};

// ==========================================
// AUTHENTICATION APIs
// ==========================================
export const authAPI = {
  // Login
  login: (email, password) => 
    apiCall('/api/auth/login-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),

  // Signup
  signup: (userData) => 
    apiCall('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }),

  // Get current user
  getCurrentUser: () => 
    apiCall('/api/auth/me'),

  // Forgot password
  forgotPassword: (email) => 
    apiCall('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }),

  // Reset password
  resetPassword: (token, newPassword) => 
    apiCall('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword })
    })
};

// ==========================================
// JOB APIs
// ==========================================
export const jobAPI = {
  // Create job (with file upload)
  create: (formData) => 
    apiCall('/api/jobs/create', {
      method: 'POST',
      body: formData // FormData for file upload
    }),

  // List all jobs
  list: () => 
    apiCall('/api/jobs/list'),

  // Get job by ID
  getById: (id) => 
    apiCall(`/api/jobs/${id}`),

  // Update job
  update: (id, formData) => 
    apiCall(`/api/jobs/update/${id}`, {
      method: 'PUT',
      body: formData
    }),

  // Delete job
  delete: (id) => 
    apiCall(`/api/jobs/delete/${id}`, {
      method: 'DELETE'
    }),

  // Search jobs
  search: (query) => 
    apiCall(`/api/jobs/search?q=${encodeURIComponent(query)}`)
};

// ==========================================
// ASSET MANAGEMENT APIs (HR Operations)
// ==========================================
export const assetsAPI = {
  // Assets
  listAssets: () => apiCall('/assets'),
  getAsset: (id) => apiCall(`/assets/${id}`),
  createAsset: (data) =>
    apiCall('/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  updateAsset: (id, data) =>
    apiCall(`/assets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  deleteAsset: (id) =>
    apiCall(`/assets/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(id),
     }),

  // Allocations
  listAllocations: () => apiCall('/asset-allocations'),
  createAllocation: (data) =>
    apiCall('/asset-allocations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  // Returns
  listReturns: () => apiCall('/asset-returns'),
  createReturn: (data) =>
    apiCall('/asset-returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  // Maintenances
  listMaintenances: () => apiCall('/asset-maintenances'),
  createMaintenance: (data) =>
    apiCall('/asset-maintenances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  // Insurance Policies (asset-insurances)
  listInsurances: () => apiCall('/asset-insurances'),
  getInsurance: (policy_id) => apiCall(`/asset-insurances/${policy_id}`),
  createInsurance: (data) =>
    apiCall('/asset-insurances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  deleteInsurance: (policy_id) =>
    apiCall(`/asset-insurances/${policy_id}`, {
      method: 'DELETE',
    }),
};

// ==========================================
// CANDIDATE APIs
// ==========================================
export const candidateAPI = {
  // List all candidates
  list: () => 
    apiCall('/api/candidates/list'),

  // Get candidate by ID
  getById: (id) => 
    apiCall(`/api/candidates/${id}`),

  // Apply to job
  apply: (jobId, applicationData) => 
    apiCall(`/api/candidates/apply/${jobId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    }),

  // Get candidate profile
  getProfile: () => 
    apiCall('/api/candidates/profile'),

  // Update candidate profile
  updateProfile: (profileData) => 
    apiCall('/api/candidates/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    }),

  // Get job applications
  getApplications: () => 
    apiCall('/api/candidates/applications'),

  // Get saved jobs
  getSavedJobs: () => 
    apiCall('/api/candidates/saved-jobs'),

  // Save job
  saveJob: (jobId) => 
    apiCall(`/api/candidates/save-job/${jobId}`, {
      method: 'POST'
    })
};

// ==========================================
// PIPELINE APIs
// ==========================================
export const pipelineAPI = {
  // Get pipeline stages
  getStages: () => 
    apiCall('/api/pipeline/stages'),

  // Create stage
  createStage: (stageName, order) => 
    apiCall('/api/pipeline/stages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: stageName, order })
    }),

  // Update stage
  updateStage: (stageId, stageData) => 
    apiCall(`/api/pipeline/stages/${stageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stageData)
    }),

  // Delete stage
  deleteStage: (stageId) => 
    apiCall(`/api/pipeline/stages/${stageId}`, {
      method: 'DELETE'
    }),

  // Get candidates in pipeline
  getCandidates: (jobId) => 
    apiCall(`/api/pipeline/candidates?job_id=${jobId}`),

  // Move candidate to stage
  moveCandidate: (candidateId, stageId) => 
    apiCall(`/api/pipeline/candidates/${candidateId}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage_id: stageId })
    })
};

// ==========================================
// ANALYTICS APIs
// ==========================================
export const analyticsAPI = {
  // Get hiring funnel data
  getHiringFunnel: () => 
    apiCall('/api/hiring_funnel'),

  // Get time to hire metrics
  getTimeToHire: () => 
    apiCall('/api/time_to_hire'),

  // Get recruiter dashboard stats
  getRecruiterStats: () => 
    apiCall('/api/recruiter_dashboard/analytics'),

  // Get applications over time
  getApplicationsOverTime: (days = 30) => 
    apiCall(`/api/recruiter_dashboard/analytics/applications-over-time?days=${days}`),

  // ==========================================
  // CRM ANALYTICS APIs
  // ==========================================
  // Get all deals (for analytics)
  getDeals: (q = null) => {
    const url = q ? `/analytics/deals?q=${encodeURIComponent(q)}` : '/analytics/deals';
    return apiCall(url);
  },

  // Get deal by ID (for analytics)
  getDeal: (id) =>
    apiCall(`/analytics/deals/${id}`),

  // Get all leads (for analytics)
  getLeads: (skip = 0, limit = 100) =>
    apiCall(`/analytics/leads?skip=${skip}&limit=${limit}`),

  // Get lead by ID (for analytics)
  getLead: (id) =>
    apiCall(`/analytics/leads/${id}`),

  // Get recent contacts
  getRecentContacts: (limit = 10) =>
    apiCall(`/analytics/recent-contacts?limit=${limit}`),

  // Get recent companies
  getRecentCompanies: (limit = 10) =>
    apiCall(`/analytics/recent-companies?limit=${limit}`),

  // Get all activities (for analytics)
  getActivities: (skip = 0, limit = 100) =>
    apiCall(`/analytics/activities?skip=${skip}&limit=${limit}`),

  // Get recent activities
  getRecentActivities: (limit = 10) =>
    apiCall(`/analytics/recent-activities?limit=${limit}`)
};

// ==========================================
// ASSESSMENT APIs
// ==========================================
export const assessmentAPI = {
  // List assessments
  list: () => 
    apiCall('/assessments'),

  // Create assessment
  create: (assessmentData) => 
    apiCall('/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessmentData)
    }),

  // Get assessment by ID
  getById: (id) =>
    apiCall(`/assessments/${id}`),

  // Update assessment
  update: (id, assessmentData) =>
    apiCall(`/assessments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessmentData)
    }),

  // Delete assessment
  delete: (id) =>
    apiCall(`/assessments/${id}`, {
      method: 'DELETE'
    }),

  // Assign assessment to candidate
  assign: (candidateId, assessmentId, dueDate) => 
    apiCall('/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate_id: candidateId,
        assessment_id: assessmentId,
        due_date: dueDate
      })
    }),

  // List assignments
  listAssignments: () =>
    apiCall('/assignments'),

  // Resume screening preselected candidates (user-scoped)
  savePreselectedCandidates: (candidateIds = [], candidateEmails = []) =>
    apiCall('/assignments/preselect-candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidate_ids: candidateIds,
        candidate_emails: candidateEmails
      })
    }),

  getPreselectedCandidates: () =>
    apiCall('/assignments/preselect-candidates'),

  clearPreselectedCandidates: () =>
    apiCall('/assignments/preselect-candidates', {
      method: 'DELETE'
    }),

  // List assignments with actual completion status
  listAssignmentsWithStatus: () =>
    apiCall('/assignments/with-status'),

  // Get all assessment results directly from result tables
  getAllResults: () =>
    apiCall('/assignments/all-results'),

  // Get test results
  getTestResults: {
    // Get all aptitude test results
    aptitude: () =>
      apiCall('/api/assessment/aptitude/results/all'),
    
    // Get aptitude result by email
    aptitudeByEmail: (email) =>
      apiCall(`/api/assessment/aptitude/results/by-email/${email}`),
    
    // Get aptitude statistics
    aptitudeStats: () =>
      apiCall('/api/assessment/aptitude/results/statistics')
  },

  // Get assessment results
  getResults: (candidateId) => 
    apiCall(`/api/assessment_results/candidates/${candidateId}`),

  // Aptitude Test APIs
  aptitude: {
    sendOTP: (name, email) =>
      apiCall('/api/assessment/aptitude/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      }),
    
    verifyOTP: (email, otp) =>
      apiCall('/api/assessment/aptitude/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      }),
    
    getInstructions: (email = null) => {
      const url = email 
        ? `/api/assessment/aptitude/instructions?email=${encodeURIComponent(email)}`
        : '/api/assessment/aptitude/instructions';
      return apiCall(url);
    },
    
    startExam: (studentId, email) =>
      apiCall('/api/assessment/aptitude/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, email: email })
      }),
    
    submitExam: (studentId, answers) =>
      apiCall('/api/assessment/aptitude/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, answers })
      })
  },

  // Coding Test APIs
  coding: {
    sendOTP: (name, email) =>
      apiCall('/coding/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      }),
    
    verifyOTP: (email, otp) =>
      apiCall('/coding/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      }),
    
    getQuestions: () =>
      apiCall('/coding/questions'),
    
    runCode: (name, email, questionTitle, language, code) =>
      apiCall('/coding/run_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, question_title: questionTitle, language, code })
      }),
    
    submitCode: (name, email, questionTitle, language, code) =>
      apiCall('/coding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, question_title: questionTitle, language, code })
      }),
    
    finalize: (name, email) =>
      apiCall('/coding/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      })
  },

  // Communication Test APIs
  communication: {
    sendOTP: (name, email) =>
      apiCall('/comm/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      }),
    
    verifyOTP: (email, otp) =>
      apiCall('/comm/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      }),
    
    getExam: (name, email) =>
      apiCall(`/comm/exam?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`),
    
    submit: (name, email, writingAnswer, listeningAnswer, mcqAnswers) =>
      apiCall('/comm/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          writing_answer: writingAnswer,
          listening_answer: listeningAnswer,
          mcq_answers: mcqAnswers
        })
      })
  }
};

// ==========================================
// AI INTERVIEW APIs
// ==========================================
export const aiInterviewAPI = {
  // Send OTP to candidate
  sendOTP: (email, name) => 
    apiCall('/api/interviews/send_otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    }),

  // Verify OTP
  verifyOTP: (email, otp) => 
    apiCall('/api/interviews/verify_otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    }),

  // Get interview templates
  getTemplates: () => 
    apiCall('/api/interviews/templates'),

  // Get interview questions (from template)
  getQuestions: (templateId = null) => {
    const url = templateId 
      ? `/api/interviews/get_questions?template_id=${templateId}`
      : '/api/interviews/get_questions';
    return apiCall(url);
  },

  // Submit answer (FormData for video upload)
  submitAnswer: (formData) => 
    fetch(`${BASE_URL}/api/interviews/submit_answer`, {
      method: 'POST',
      body: formData
    }).then(res => {
      if (!res.ok) {
        return res.json().then(err => Promise.reject(err));
      }
      return res.json();
    }),

  // Get all interview results
  getResults: () => 
    apiCall('/api/interviews/results'),

  // Get specific candidate interview result
  getCandidateResult: (candidateId) => 
    apiCall(`/api/interviews/results/${candidateId}`)
};

// ==========================================
// HR AUTOMATION APIs
// ==========================================
export const hrAPI = {
  // Attendance
  attendance: {
    mark: (date, status) => 
      apiCall('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, status })
      }),
    
    list: () => 
      apiCall('/api/attendance')
  },

  // Leave Management
  leave: {
    request: (leaveData) => 
      apiCall('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveData)
      }),
    
    list: () => 
      apiCall('/api/leave'),
    
    approve: (leaveId) => 
      apiCall(`/api/leave/${leaveId}/approve`, {
        method: 'PATCH'
      }),
    
    reject: (leaveId) => 
      apiCall(`/api/leave/${leaveId}/reject`, {
        method: 'PATCH'
      })
  },

  // Tasks
  tasks: {
    create: (taskData) => 
      apiCall('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      }),
    
    list: () => 
      apiCall('/api/tasks'),
    
    update: (taskId, taskData) => 
      apiCall(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
  },

  // Onboarding
  onboarding: {
    getCandidates: () => 
      apiCall('/api/candidates'),
    
    uploadDocument: (candidateId, documentData) => 
      apiCall(`/api/uploads/${candidateId}`, {
        method: 'POST',
        body: documentData // FormData
      })
  }
};

// ==========================================
// RESUME PARSING API
// ==========================================
export const resumeAPI = {
  // Parse resume
  parse: (resumeFile) => {
    const formData = new FormData();
    formData.append('file', resumeFile);
    
    return apiCall('/api/resume/parse', {
      method: 'POST',
      body: formData
    });
  },

  // Match resume with job
  matchWithJob: (resumeId, jobId) => 
    apiCall('/api/resume/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_id: resumeId, job_id: jobId })
    })
};

// ==========================================
// CRM ACTIVITIES API
// ==========================================
export const activitiesAPI = {
  // Get all activities
  list: (type = null) => {
    const url = type ? `/activities/?type=${type}` : '/activities/';
    return apiCall(url);
  },

  // Get activity by ID
  getById: (id) =>
    apiCall(`/activities/${id}`),

  // Create activity
  create: (activityData) =>
    apiCall('/activities/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData)
    }),

  // Update activity
  update: (id, activityData) =>
    apiCall(`/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activityData)
    }),

  // Delete activity
  delete: (id) =>
    apiCall(`/activities/${id}`, {
      method: 'DELETE'
    }),

  // Delete multiple activities (if backend supports it, otherwise delete one by one)
  deleteMultiple: (ids) => {
    // Backend doesn't have delete-multiple endpoint, so delete one by one
    return Promise.all(ids.map(id => apiCall(`/activities/${id}`, { method: 'DELETE' })));
  }
};

// ==========================================
// CRM CONTACTS API
// ==========================================
export const contactsAPI = {
  // Get all contacts
  list: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.company) params.append('company', filters.company);
    if (filters.industry) params.append('industry', filters.industry);
    if (filters.owner) params.append('owner', filters.owner);
    const queryString = params.toString();
    const url = queryString ? `/contacts/?${queryString}` : '/contacts/';
    return apiCall(url);
  },

  // Get contact by ID
  getById: (id) =>
    apiCall(`/contacts/${id}`),

  // Create contact
  create: (contactData) =>
    apiCall('/contacts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    }),

  // Update contact
  update: (id, contactData) =>
    apiCall(`/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    }),

  // Delete contact
  delete: (id) =>
    apiCall(`/contacts/${id}`, {
      method: 'DELETE'
    }),

  // Delete multiple contacts (if backend supports it, otherwise delete one by one)
  deleteMultiple: (ids) => {
    // Backend doesn't have delete-multiple endpoint, so delete one by one
    return Promise.all(ids.map(id => apiCall(`/contacts/${id}`, { method: 'DELETE' })));
  },

  // Upload profile photo
  uploadProfilePhoto: async (contactId, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
        // Don't set Content-Type, let browser set it with boundary for FormData
      },
      body: formData
    };

    try {
      const response = await fetch(`${BASE_URL}/contacts/${contactId}/profile-photo`, config);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        return null;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }
    } catch (err) {
      console.error('API Call Error:', err);
      throw err;
    }
  }
};

// ==========================================
// CRM LEADS API
// ==========================================
export const leadsAPI = {
  // Get all leads
  list: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.company) params.append('company', filters.company);
    if (filters.owner) params.append('owner', filters.owner);
    const queryString = params.toString();
    const url = queryString ? `/api/leads/?${queryString}` : '/api/leads/';
    return apiCall(url);
  },

  // Get lead by ID
  getById: (id) =>
    apiCall(`/api/leads/${id}`),

  // Create lead
  create: (leadData) =>
    apiCall('/api/leads/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    }),

  // Update lead
  update: (id, leadData) =>
    apiCall(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    }),

  // Delete lead
  delete: (id) =>
    apiCall(`/api/leads/${id}`, {
      method: 'DELETE'
    })
};

// ==========================================
// CRM DEALS API
// ==========================================
export const dealsAPI = {
  // Get all deals
  list: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.stage) params.append('stage', filters.stage);
    if (filters.owner) params.append('owner', filters.owner);
    if (filters.q) params.append('q', filters.q); // Search query
    const queryString = params.toString();
    const url = queryString ? `/deals/?${queryString}` : '/deals/';
    return apiCall(url);
  },

  // Get deal by ID
  getById: (id) =>
    apiCall(`/deals/${id}`),

  // Create deal
  create: (dealData) =>
    apiCall('/deals/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dealData)
    }),

  // Update deal (backend uses PATCH, not PUT)
  update: (id, dealData) =>
    apiCall(`/deals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dealData)
    }),

  // Delete deal
  delete: (id) =>
    apiCall(`/deals/${id}`, {
      method: 'DELETE'
    })
};

// ==========================================
// CRM COMPANIES API
// ==========================================
export const companiesAPI = {
  // Get all companies
  list: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.industry) params.append('industry', filters.industry);
    if (filters.owner) params.append('owner', filters.owner);
    const queryString = params.toString();
    const url = queryString ? `/companies/?${queryString}` : '/companies/';
    return apiCall(url);
  },

  // Get company by ID
  getById: (id) =>
    apiCall(`/companies/${id}`),

  // Create company (backend uses FormData, not JSON)
  create: (companyData, logoFile = null) => {
    const formData = new FormData();
    
    // Append all company fields to FormData
    Object.keys(companyData).forEach(key => {
      if (companyData[key] !== null && companyData[key] !== undefined) {
        if (key === 'tags' && Array.isArray(companyData[key])) {
          // Convert tags array to comma-separated string
          formData.append(key, companyData[key].join(','));
        } else {
          formData.append(key, companyData[key]);
        }
      }
    });
    
    // Append logo file if provided
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    
    return fetch(`${BASE_URL}/companies/`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header - browser will set it with boundary for FormData
        ...(getToken() && { 'Authorization': `Bearer ${getToken()}` })
      }
    }).then(async (response) => {
      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }
    });
  },

  // Update company (backend uses FormData, not JSON)
  update: (id, companyData, logoFile = null) => {
    const formData = new FormData();
    
    // Append all company fields to FormData
    Object.keys(companyData).forEach(key => {
      if (companyData[key] !== null && companyData[key] !== undefined) {
        if (key === 'tags' && Array.isArray(companyData[key])) {
          // Convert tags array to comma-separated string
          formData.append(key, companyData[key].join(','));
        } else {
          formData.append(key, companyData[key]);
        }
      }
    });
    
    // Append logo file if provided
    if (logoFile) {
      formData.append('logo', logoFile);
    }
    
    return fetch(`${BASE_URL}/companies/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        // Don't set Content-Type header - browser will set it with boundary for FormData
        ...(getToken() && { 'Authorization': `Bearer ${getToken()}` })
      }
    }).then(async (response) => {
      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }
    });
  },

  // Delete company
  delete: (id) =>
    apiCall(`/companies/${id}`, {
      method: 'DELETE'
    }),

  // Upload company logo
  uploadLogo: async (companyId, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
        // Don't set Content-Type, let browser set it with boundary for FormData
      },
      body: formData
    };

    try {
      const response = await fetch(`${BASE_URL}/companies/${companyId}/logo`, config);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        return null;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }
    } catch (err) {
      console.error('API Call Error:', err);
      throw err;
    }
  }
};

// ==========================================
// CRM PIPELINES API
// ==========================================
export const crmPipelinesAPI = {
  // Get all pipelines
  list: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.stage) params.append('stage', filters.stage);
    const queryString = params.toString();
    const url = queryString ? `/pipelines/?${queryString}` : '/pipelines/';
    return apiCall(url);
  },

  // Get pipeline by ID
  getById: (id) =>
    apiCall(`/pipelines/${id}`),

  // Create pipeline
  create: (pipelineData) =>
    apiCall('/pipelines/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pipelineData)
    }),

  // Update pipeline
  update: (id, pipelineData) =>
    apiCall(`/pipelines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pipelineData)
    }),

  // Delete pipeline
  delete: (id) =>
    apiCall(`/pipelines/${id}`, {
      method: 'DELETE'
    })
};

// ==========================================
// ADMIN APIs
// ==========================================
export const adminAPI = {
  // Compatibility users list: preferred legacy path, then current API path
  listUsersCompat: async () => {
    try {
      const legacyUsers = await apiCall('/admin/user/list');
      if (Array.isArray(legacyUsers)) return legacyUsers;
    } catch (_) {
      // Fallback to current API contract
    }
    return apiCall('/api/admin/superadmin/users');
  },

  // Get all users
  getUsers: () => 
    apiCall('/api/admin/users'),

  // Get system summary
  getSummary: () => 
    apiCall('/api/admin/superadmin/summary'),

  // Create user
  createUser: (userData) => 
    apiCall('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }),

  // Update user
  updateUser: (userId, userData) => 
    apiCall(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }),

  // Delete user
  deleteUser: (userId) => 
    apiCall(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    })
};

// Export default for convenience
const apiServices = {
  authAPI,
  jobAPI,
  candidateAPI,
  pipelineAPI,
  analyticsAPI,
  assessmentAPI,
  aiInterviewAPI,
  hrAPI,
  resumeAPI,
  contactsAPI,
  leadsAPI,
  dealsAPI,
  companiesAPI,
  crmPipelinesAPI,
  adminAPI
};

export default apiServices;

