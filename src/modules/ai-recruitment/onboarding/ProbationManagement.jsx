import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

import StatCard from '../../../shared/components/StatCard';

import AddEmployeeProbationModal from '../../hrms/modal/AddEmployeeProbationModal';
import ReviewProbationModal from '../../hrms/modal/ReviewProbationModal';
import ExtendProbationModal from '../../hrms/modal/ExtendProbationModal';
import ConfirmProbationModal from '../../hrms/modal/ConfirmProbationModal';
import TerminateProbationModal from '../../hrms/modal/TerminateProbationModal';
import { apiCall } from '../../../shared/utils/api';
import { API_ENDPOINTS } from '../../../shared/constants/api.config';

const ProbationManagement = () => {
  const initialProbationEmployees = [];


  const initialReviewHistory = [];


  const [probationEmployees, setProbationEmployees] = useState(initialProbationEmployees);
  const [reviewHistory, setReviewHistory] = useState(initialReviewHistory);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showSendReminderModal, setShowSendReminderModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMeetingScheduleModal, setShowMeetingScheduleModal] = useState(false);
  const [showConfirmationLetterModal, setShowConfirmationLetterModal] = useState(false);
  const [showSelfAssessmentModal, setShowSelfAssessmentModal] = useState(false);
  const [showConfirmationLetterViewModal, setShowConfirmationLetterViewModal] = useState(false);
  const [reviewStep, setReviewStep] = useState('self');

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    designation: '',
    department: 'Engineering',
    manager: '',
    hrBusinessPartner: '',
    joiningDate: '',
    probationPeriod: '90',
    probationType: 'regular',
    workLocation: 'Bangalore',
    employmentType: 'Permanent'
  });

  const [reviewForm, setReviewForm] = useState({
    reviewType: '30_day',
    reviewDate: new Date().toISOString().split('T')[0],
    rating: 'meets_expectations',
    managerComments: '',
    skipLevelManagerComments: '',
    skipLevelManager: '',
    hrComments: '',
    hrRecommendation: '',
    selfAssessment: '',
    selfRating: '',
    achievements: '',
    challenges: '',
    goals: '',
    recommendations: '',
    actionItems: [],
    attachments: [],
    sendToEmployee: false,
    notifyManager: true,
    notifySkipLevelManager: false,
    scheduleFollowup: false,
    followupDate: '',
    meetingScheduled: false,
    meetingDate: '',
    meetingTime: '',
    meetingLink: '',
    meetingAttendees: []
  });

  const [meetingForm, setMeetingForm] = useState({
    employeeId: null,
    reviewType: '',
    meetingDate: '',
    meetingTime: '',
    duration: '60',
    meetingType: 'in_person',
    meetingLink: '',
    location: '',
    attendees: [],
    agenda: '',
    sendCalendarInvite: true
  });

  const [confirmationLetterForm, setConfirmationLetterForm] = useState({
    employeeId: null,
    effectiveDate: '',
    designation: '',
    department: '',
    salary: '',
    reportingManager: '',
    workLocation: '',
    customMessage: '',
    includeTerms: true,
    digitalSignature: true
  });

  const [extensionForm, setExtensionForm] = useState({
    extensionDays: 30,
    reason: '',
    newEndDate: '',
    notifyEmployee: true,
    notifyManager: true,
    updateProbationPeriod: true
  });

  const [terminationForm, setTerminationForm] = useState({
    reason: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    noticePeriodWaived: false,
    severancePackage: false,
    comments: ''
  });

  const [bulkAction, setBulkAction] = useState({
    action: 'schedule_review',
    date: new Date().toISOString().split('T')[0],
    extensionDays: '30',
    reminderType: 'review_due',
    exportFormat: 'pdf',
    effectiveDate: new Date().toISOString().split('T')[0],
    generateLetters: true,
    includePersonalInfo: true,
    includeReviewHistory: true,
    includeProgressData: true,
    includeRatings: true,
    notifyEmployee: true,
    notifyManager: true,
    reason: '',
    message: '',
    templateId: ''
  });

  const [reportFilters, setReportFilters] = useState({
    startDate: '2024-01-01',
    endDate: new Date().toISOString().split('T')[0],
    department: 'all',
    status: 'all',
    exportFormat: 'pdf'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [kpi, setKpi] = useState(null);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loadingProbation, setLoadingProbation] = useState(true);
  const [probationLoadError, setProbationLoadError] = useState(null);

  // Backend field names (schema/onboarding/probation_management.py) are
  // already camelCase and match this component's existing field names
  // closely — mapped 1:1 below rather than needing a translation layer
  // like some of the other files in this pass.
  const mapEmployeeFromBackend = (e) => ({
    id: e.id,
    confirmationId: e.confirmationId ?? e.id,
    employeeId: e.employeeId,
    name: e.name,
    designation: e.designation,
    department: e.department,
    location: e.location,
    status: (e.probationStatus || '').toLowerCase().replace(/\s+/g, '_'),
    extensionCount: e.extensionCount,
    progress: e.progressPercent,
    riskLevel: (e.riskLevel || '').toLowerCase(),
    review30: { completed: e.milestone30Done, date: null, rating: null },
    review60: { completed: e.milestone60Done, date: null, rating: null },
    review90: { completed: e.milestone90Done, date: null, rating: null },
    nextReviewDate: e.nextReviewDate,
    daysRemaining: e.daysRemaining,
    probationEndDate: e.probationEndDate,
    currentRating: e.currentRating,
    probationStartDate: e.probationStartDate,
    joiningDate: e.joiningDate,
  });

  const loadProbationList = async () => {
    setLoadingProbation(true);
    setProbationLoadError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (filterDepartment !== 'all') params.set('department', filterDepartment);
      if (filterRisk !== 'all') params.set('risk_level', filterRisk);
      params.set('sort_by', sortBy);
      params.set('limit', '100');

      const data = await apiCall(`${API_ENDPOINTS.PROBATION.EMPLOYEES}?${params.toString()}`);
      const list = Array.isArray(data) ? data : (data.results || data.employees || []);
      setProbationEmployees(list.map(mapEmployeeFromBackend));
    } catch (err) {
      setProbationLoadError(err.message);
      setProbationEmployees([]);
    } finally {
      setLoadingProbation(false);
    }
  };

  useEffect(() => {
    apiCall(API_ENDPOINTS.PROBATION.KPI).then(setKpi).catch((err) => console.error('Failed to load probation KPIs:', err.message));
    apiCall(API_ENDPOINTS.PROBATION.DEPARTMENTS).then((d) => setDepartmentsList(d.departments || d || [])).catch((err) => console.error('Failed to load departments:', err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadProbationList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterStatus, filterDepartment, filterRisk, sortBy]);

  // Kept as a client-side fallback (used only if the KPI endpoint hasn't
  // loaded yet) — the real source of truth is `kpi` above, from
  // GET /probation-management/kpi.
  const stats = kpi ? {
    total: kpi.totalEmployees,
    inProgress: kpi.inProgress,
    atRisk: kpi.atRisk,
    endingThisWeek: kpi.endingThisWeek,
    completed: kpi.completed,
    highRisk: kpi.highRisk,
  } : {
    total: probationEmployees.length,
    inProgress: probationEmployees.filter(e => e.status === 'in_progress').length,
    underReview: probationEmployees.filter(e => e.status === 'under_review').length,
    extended: probationEmployees.filter(e => e.status === 'extended').length,
    atRisk: probationEmployees.filter(e => e.status === 'at_risk').length,
    completed: probationEmployees.filter(e => e.status === 'completed').length,
    terminated: probationEmployees.filter(e => e.status === 'terminated').length,
    endingThisWeek: probationEmployees.filter(e => e.daysRemaining <= 7 && e.daysRemaining > 0).length,
    overdue: probationEmployees.filter(e => e.daysRemaining < 0).length,
    highRisk: probationEmployees.filter(e => e.riskLevel === 'high').length,
    totalExtensions: probationEmployees.reduce((sum, e) => sum + (e.extensionCount || 0), 0)
  };

  const calculateDaysRemaining = (endDate) => {
    if (!isValidDate(endDate)) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const formatDate = (date) => {
    if (!date || !isValidDate(date)) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateNextReviewDate = (baseDate, daysToAdd) => {
    if (!isValidDate(baseDate)) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + daysToAdd);
      return defaultDate.toISOString().split('T')[0];
    }
    const date = new Date(baseDate);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
  };

  // NOTE: ProbationAddEmployeeSchema requires a real numeric employee_id
  // referencing an existing Employee record (created via POST /employees
  // in JoiningDayManagement.jsx) — it does not accept a freshly-typed
  // name/email/etc the way this form originally collected them. The
  // newEmployee.employeeId field below is now expected to be that real
  // numeric ID. A proper fix would turn this into a searchable employee
  // picker (like the reporting-manager dropdown in JoiningDayManagement.jsx)
  // inside the separate AddEmployeeProbationModal component — outside this
  // file's scope, so flagging rather than guessing at that modal's markup.
  const [addingEmployee, setAddingEmployee] = useState(false);

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (!isValidDate(newEmployee.joiningDate)) {
      alert('Please enter a valid joining date');
      return;
    }
    const employeeIdNum = Number(newEmployee.employeeId);
    if (!employeeIdNum) {
      alert('Please enter the employee\'s numeric Employee ID (from the Employee directory)');
      return;
    }

    const joiningDate = new Date(newEmployee.joiningDate);
    const probationEndDate = new Date(joiningDate);
    probationEndDate.setDate(probationEndDate.getDate() + parseInt(newEmployee.probationPeriod));

    setAddingEmployee(true);
    try {
      await apiCall(API_ENDPOINTS.PROBATION.EMPLOYEES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeIdNum,
          probation_start_date: newEmployee.joiningDate,
          probation_end_date: probationEndDate.toISOString().split('T')[0],
          reviewed_by: null,
          remarks: null,
        }),
      });
      await loadProbationList();
      setShowAddModal(false);
      setNewEmployee({
        name: '',
        employeeId: '',
        email: '',
        phone: '',
        designation: '',
        department: 'Engineering',
        manager: '',
        hrBusinessPartner: '',
        joiningDate: '',
        probationPeriod: '90',
        probationType: 'regular',
        workLocation: 'Bangalore',
        employmentType: 'Permanent'
      });
      alert(`Employee added to probation tracking`);
    } catch (err) {
      alert(`Failed to add employee to probation: ${err.message}`);
    } finally {
      setAddingEmployee(false);
    }
  };

  const handleBulkActionSubmit = (e) => {
    e.preventDefault();

    const selectedEmployeesData = probationEmployees.filter(
      emp => selectedEmployees.includes(emp.id)
    );

    switch (bulkAction.action) {
      case 'schedule_review':
        handleBulkScheduleReview(selectedEmployeesData);
        break;
      case 'send_reminder':
        handleBulkSendReminder(selectedEmployeesData);
        break;
      case 'extend_probation':
        handleBulkExtendProbation(selectedEmployeesData);
        break;
      case 'confirm_employees':
        handleBulkConfirmEmployees(selectedEmployeesData);
        break;
      case 'export_data':
        handleBulkExportData(selectedEmployeesData);
        break;
      default:
        break;
    }

    setShowBulkActionModal(false);
  };



  // NOTE: the backend's bulk-action endpoint only supports 4 actions —
  // "confirm", "extend", "terminate", "send_reminder" (confirmed by reading
  // bulk_action_probation in services/probation_management.py). There is no
  // "schedule_review" bulk action on the server; kept local-only rather
  // than fabricating an endpoint.
  const handleBulkScheduleReview = (employees) => {
    const updatedEmployees = probationEmployees.map(emp => {
      if (selectedEmployees.includes(emp.id)) {
        return {
          ...emp,
          nextReviewDate: bulkAction.date,
          status: emp.status === 'in_progress' ? 'under_review' : emp.status
        };
      }
      return emp;
    });
    setProbationEmployees(updatedEmployees);
    showVisualFeedback(`Reviews scheduled for ${employees.length} employees (not persisted — no backend bulk "schedule review" action exists)`);
  };

  const handleBulkSendReminder = async (employees) => {
    try {
      await apiCall(API_ENDPOINTS.PROBATION.BULK_ACTION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmation_ids: employees.map(e => e.confirmationId),
          action: 'send_reminder',
        }),
      });
      showVisualFeedback(`Reminders sent to ${employees.length} employees`);
    } catch (err) {
      alert(`Failed to send reminders: ${err.message}`);
    }
  };

  const handleBulkExtendProbation = async (employees) => {
    // NOTE: the backend's bulk "extend" action always adds a fixed 90 days
    // to probation_end_date (hardcoded in services/probation_management.py)
    // — it ignores bulkAction.extensionDays entirely. Flagging since this
    // UI lets HR pick a custom day count that the backend won't honor for
    // bulk extensions (the single-employee extend flow above does respect
    // a custom date).
    try {
      await apiCall(API_ENDPOINTS.PROBATION.BULK_ACTION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmation_ids: employees.map(e => e.confirmationId),
          action: 'extend',
        }),
      });
      await loadProbationList();
      showVisualFeedback(`Probation extended for ${employees.length} employees (backend applies a fixed 90-day extension)`);
    } catch (err) {
      alert(`Failed to extend probation: ${err.message}`);
    }
  };

  const handleBulkConfirmEmployees = async (employees) => {
    try {
      await apiCall(API_ENDPOINTS.PROBATION.BULK_ACTION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmation_ids: employees.map(e => e.confirmationId),
          action: 'confirm',
        }),
      });
      await loadProbationList();
      showVisualFeedback(`${employees.length} employees confirmed successfully`);
    } catch (err) {
      alert(`Failed to confirm employees: ${err.message}`);
    }
  };

  const handleBulkExportData = (employees) => {
    const exportData = {
      format: 'pdf',
      timestamp: new Date().toISOString(),
      employees: employees.map(emp => ({
        employeeId: emp.employeeId,
        name: emp.name,
        designation: emp.designation,
        department: emp.department,
        status: emp.status,
        progress: emp.progress,
        riskLevel: emp.riskLevel,
        currentRating: emp.currentRating,
        probationEndDate: emp.probationEndDate,
        daysRemaining: emp.daysRemaining,
        ...(bulkAction.includePersonalInfo && {
          email: emp.contactEmail,
          phone: emp.contactPhone,
          manager: emp.manager,
          workLocation: emp.workLocation,
          joiningDate: emp.joiningDate,
          probationPeriod: emp.probationPeriod
        })
      }))
    };
    showVisualFeedback(`Exported ${employees.length} employee records as PDF`);
  };

  const showVisualFeedback = (message) => {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'fixed top-0 right-0 p-4 z-[9999]';
    toastContainer.innerHTML = `
      <div class="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div class="flex items-center gap-2">
          <span class="text-green-600 font-medium">✓ Success</span>
          <span class="text-green-700 text-sm">${message}</span>
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);
    setTimeout(() => {
      if (toastContainer.parentNode) toastContainer.remove();
    }, 3000);
  };

  const handleStartReview = (employee, reviewType = null) => {
    setSelectedEmployee(employee);

    let nextReviewType = '30_day';
    if (reviewType) {
      nextReviewType = reviewType;
    } else if (!employee.review30.completed) {
      nextReviewType = '30_day';
    } else if (!employee.review60.completed) {
      nextReviewType = '60_day';
    } else if (!employee.review90.completed) {
      nextReviewType = '90_day';
    } else {
      nextReviewType = 'final';
    }

    setReviewForm({
      reviewType: nextReviewType,
      reviewDate: new Date().toISOString().split('T')[0],
      rating: 'meets_expectations',
      managerComments: '',
      skipLevelManagerComments: '',
      skipLevelManager: '',
      hrComments: '',
      hrRecommendation: '',
      selfAssessment: '',
      selfRating: '',
      achievements: '',
      challenges: '',
      goals: '',
      recommendations: '',
      actionItems: [],
      attachments: [],
      sendToEmployee: false,
      notifyManager: true,
      notifySkipLevelManager: false,
      scheduleFollowup: false,
      followupDate: '',
      meetingScheduled: false,
      meetingDate: '',
      meetingTime: '',
      meetingLink: '',
      meetingAttendees: []
    });

    setReviewStep('self');
    setShowReviewModal(true);
  };

  const handleSubmitSelfAssessment = () => {
    if (!reviewForm.selfAssessment || !reviewForm.selfRating) {
      alert('Please complete the self-assessment form');
      return;
    }
    setReviewStep('manager');
  };

  const [submittingReview, setSubmittingReview] = useState(false);

  const handleSubmitReview = async (e) => {
    if (e) e.preventDefault();

    const milestoneMap = { '30_day': '30', '60_day': '60', '90_day': '90', final: 'final' };
    const ratingLabel = reviewForm.rating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const combinedRemarks = [
      reviewForm.managerComments,
      reviewForm.hrComments,
      reviewForm.selfAssessment,
    ].filter(Boolean).join(' | ') || null;

    setSubmittingReview(true);
    try {
      // NOTE: reading services/probation_management.py's complete_milestone,
      // only milestone === "final" actually updates the employee's status/
      // rating on the server. Submitting a 30/60/90-day review logs a
      // review row (visible in reports) but does NOT flip the
      // milestone30Done/60Done/90Done flags shown elsewhere in this UI —
      // that's a real gap in the backend's own logic, not something fixable
      // from this file. Flagging rather than faking the checkbox update.
      await apiCall(API_ENDPOINTS.PROBATION.MILESTONE(selectedEmployee.confirmationId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmation_id: selectedEmployee.confirmationId,
          milestone: milestoneMap[reviewForm.reviewType] || reviewForm.reviewType,
          rating: ratingLabel,
          remarks: combinedRemarks,
        }),
      });
      await loadProbationList();

      // Local review-history entry for this session's UI — the backend's
      // ProbationReview row doesn't expose a GET endpoint to list history
      // back out, so this stays as an in-memory log rather than a real
      // synced read.
      setReviewHistory(prev => [...prev, {
        id: prev.length + 1,
        employeeId: selectedEmployee.employeeId,
        reviewType: reviewForm.reviewType.replace('_', ' ').toUpperCase(),
        reviewDate: reviewForm.reviewDate,
        reviewer: 'HR Manager',
        rating: ratingLabel,
        managerComments: reviewForm.managerComments,
        hrComments: reviewForm.hrComments,
        selfAssessment: reviewForm.selfAssessment,
        status: 'completed',
      }]);

      setShowReviewModal(false);
      alert('Review submitted successfully');
    } catch (err) {
      alert(`Failed to submit review: ${err.message}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleScheduleMeeting = (employee, reviewType) => {
    setSelectedEmployee(employee);
    setMeetingForm({
      employeeId: employee.id,
      reviewType: reviewType,
      meetingDate: '',
      meetingTime: '',
      duration: '60',
      meetingType: 'in_person',
      meetingLink: '',
      location: '',
      attendees: [employee.manager, 'HR Manager'],
      agenda: `${reviewType.replace('_', ' ').toUpperCase()} Review Meeting`,
      sendCalendarInvite: true
    });
    setShowMeetingScheduleModal(true);
  };

  const handleSubmitMeeting = (e) => {
    e.preventDefault();
    setReviewForm(prev => ({
      ...prev,
      meetingScheduled: true,
      meetingDate: meetingForm.meetingDate,
      meetingTime: meetingForm.meetingTime,
      meetingLink: meetingForm.meetingLink,
      meetingAttendees: meetingForm.attendees
    }));
    setShowMeetingScheduleModal(false);
    alert('Review meeting scheduled successfully! Calendar invites will be sent to all attendees.');
  };

  const handleExtendProbation = (employee) => {
    setSelectedEmployee(employee);
    const currentEndDate = employee.probationEndDate;
    if (!currentEndDate || isNaN(new Date(currentEndDate).getTime())) {
      alert('Invalid probation end date. Please check employee data.');
      return;
    }
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + 30);
    setExtensionForm({
      extensionDays: 30,
      reason: '',
      newEndDate: newEndDate.toISOString().split('T')[0],
      notifyEmployee: true,
      notifyManager: true,
      updateProbationPeriod: true
    });
    setShowExtendModal(true);
  };

  const handleSubmitExtension = async (e) => {
    e.preventDefault();
    if (!isValidDate(extensionForm.newEndDate)) {
      alert('Please select a valid new end date');
      return;
    }
    try {
      await apiCall(API_ENDPOINTS.PROBATION.STATUS(selectedEmployee.confirmationId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Extended',
          extended_till: extensionForm.newEndDate,
          remarks: extensionForm.reason || null,
        }),
      });
      await loadProbationList();
      setShowExtendModal(false);
      alert(`Probation extended for ${selectedEmployee.name} until ${formatDate(extensionForm.newEndDate)}`);
    } catch (err) {
      alert(`Failed to extend probation: ${err.message}`);
    }
  };

  const handleConfirmEmployee = async () => {
    // NOTE: confirmationLetterId generation stays client-side — there's no
    // letter/document model on the backend (same gap as the confirmation
    // letter modal flagged further below).
    const letterId = `CONF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    try {
      await apiCall(API_ENDPOINTS.PROBATION.STATUS(selectedEmployee.confirmationId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Completed',
          confirmation_date: new Date().toISOString().split('T')[0],
        }),
      });
      await loadProbationList();
      setShowConfirmModal(false);
      alert(`Employee confirmed successfully! Letter ID: ${letterId}`);
    } catch (err) {
      alert(`Failed to confirm employee: ${err.message}`);
    }
  };

  const handleEarlyConfirmation = (employee) => {
    setSelectedEmployee(employee);
    if (employee.progress >= 80) {
      setShowConfirmModal(true);
    } else {
      alert('Employee progress must be at least 80% for early confirmation. Current progress: ' + employee.progress + '%');
    }
  };

  const handleTerminateProbation = (employee) => {
    setSelectedEmployee(employee);
    setTerminationForm({
      reason: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      noticePeriodWaived: false,
      severancePackage: false,
      comments: ''
    });
    setShowTerminateModal(true);
  };

  const handleSubmitTermination = async (e) => {
    e.preventDefault();
    // NOTE: terminationForm.effectiveDate, noticePeriodWaived, and
    // severancePackage have no matching column on ProbationStatusUpdateSchema
    // — folded into remarks as free text, or not sent at all.
    try {
      await apiCall(API_ENDPOINTS.PROBATION.STATUS(selectedEmployee.confirmationId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Terminated',
          remarks: [terminationForm.reason, terminationForm.comments].filter(Boolean).join(' — ') || null,
        }),
      });
      await loadProbationList();
      setShowTerminateModal(false);
      alert(`Probation terminated for ${selectedEmployee.name}`);
    } catch (err) {
      alert(`Failed to terminate probation: ${err.message}`);
    }
  };

  const handleSelectEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === paginatedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(paginatedEmployees.map(emp => emp.id));
    }
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const filteredEmployees = probationEmployees
    .filter(emp => {
      const searchMatch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = filterStatus === 'all' || emp.status === filterStatus;
      const deptMatch = filterDepartment === 'all' || emp.department === filterDepartment;
      const riskMatch = filterRisk === 'all' || emp.riskLevel === filterRisk;
      const archivedMatch = filterStatus === 'archived' ? emp.isArchived === true : emp.isArchived !== true;

      return searchMatch && statusMatch && deptMatch && riskMatch && archivedMatch;
    })
    .sort((a, b) => {
      let A = a[sortBy], B = b[sortBy];
      if (sortBy === 'name' || sortBy === 'designation' || sortBy === 'department') {
        A = A.toLowerCase();
        B = B.toLowerCase();
      }
      if (sortBy === 'daysRemaining') {
        A = a.daysRemaining;
        B = b.daysRemaining;
      }
      if (sortBy === 'progress') {
        A = a.progress;
        B = b.progress;
      }
      if (sortBy === 'joiningDate' || sortBy === 'probationEndDate') {
        A = new Date(a[sortBy]);
        B = new Date(b[sortBy]);
      }
      return sortOrder === 'asc' ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const config = {
      in_progress: { label: 'In Progress', dotColor: 'bg-blue-500', bgClass: 'bg-blue-50/70 text-blue-700 border-blue-100' },
      under_review: { label: 'Under Review', dotColor: 'bg-amber-500', bgClass: 'bg-amber-50/70 text-amber-700 border-amber-100' },
      extended: { label: 'Extended', dotColor: 'bg-purple-500', bgClass: 'bg-purple-50/70 text-purple-700 border-purple-100' },
      at_risk: { label: 'At Risk', dotColor: 'bg-rose-500', bgClass: 'bg-rose-50/70 text-rose-700 border-rose-100' },
      completed: { label: 'Completed', dotColor: 'bg-emerald-500', bgClass: 'bg-emerald-50/70 text-emerald-700 border-emerald-100' },
      terminated: { label: 'Terminated', dotColor: 'bg-slate-500', bgClass: 'bg-slate-50/70 text-slate-700 border-slate-100' }
    };
    const { label, dotColor, bgClass } = config[status] || { label: status, dotColor: 'bg-slate-400', bgClass: 'bg-slate-50 text-slate-700 border-slate-100' };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bgClass}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        {label}
      </span>
    );
  };

  const getRiskBadge = (risk) => {
    const config = {
      low: { label: 'Low', bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      medium: { label: 'Medium', bgClass: 'bg-amber-50 text-amber-700 border-amber-100' },
      high: { label: 'High', bgClass: 'bg-rose-50 text-rose-700 border-rose-100' }
    };
    const { label, bgClass } = config[risk] || { label: risk, bgClass: 'bg-slate-50 text-slate-700 border-slate-100' };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${bgClass}`}>
        {label}
      </span>
    );
  };

  const getRatingBadge = (rating) => {
    const config = {
      'Exceeds Expectations': { bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      'Meets Expectations': { bgClass: 'bg-blue-50 text-blue-700 border-blue-100' },
      'Needs Improvement': { bgClass: 'bg-amber-50 text-amber-700 border-amber-100' },
      'Unsatisfactory': { bgClass: 'bg-rose-50 text-rose-700 border-rose-100' },
      'Not Rated': { bgClass: 'bg-slate-50 text-slate-400 border-slate-100' }
    };
    const { bgClass } = config[rating] || { bgClass: 'bg-slate-50 text-slate-700 border-slate-100' };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${bgClass}`}>
        {rating}
      </span>
    );
  };

  const ProgressBar = ({ percentage, showLabel = true }) => {
    const barColor = percentage >= 90 ? 'bg-emerald-500' : percentage >= 70 ? 'bg-blue-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500';
    return (
      <div className="flex flex-col gap-1 w-full max-w-[120px]">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-500`}
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          />
        </div>
      </div>
    );
  };

  const ReviewMilestones = ({ employee }) => {
    
    return (
      <div className="flex items-center justify-center gap-1">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold border transition-all ${step.completed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}
              title={`${step.label} Review: ${step.completed ? formatDate(step.date) : 'Pending'}`}
            >
              {step.label[0]}
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-[2px] w-3 ${step.completed && steps[idx + 1].completed ? 'bg-emerald-200' : 'bg-slate-100'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const [generatingReport, setGeneratingReport] = useState(false);

  const handleGenerateReport = async () => {
    // NOTE: GET /probation-management/reports returns aggregate report
    // data (confirmation rate, avg probation days, by-department/risk/
    // rating breakdowns) — real and fetched below. Actually rendering that
    // into a downloadable PDF/Excel file is a separate concern with no
    // backend endpoint for file generation; left as a browser alert as
    // a placeholder for that follow-up, same as before, but now backed
    // by real numbers logged to the console for verification.
    setGeneratingReport(true);
    try {
      const params = new URLSearchParams();
      if (reportFilters.department !== 'all') params.set('department', reportFilters.department);
      if (reportFilters.status !== 'all') params.set('status', reportFilters.status);
      const report = await apiCall(`${API_ENDPOINTS.PROBATION.REPORTS}?${params.toString()}`);
      console.log('Probation report data:', report);
      alert(`Report generated — ${report.totalOnProbation} on probation, ${report.confirmed} confirmed, ${report.confirmationRate}% confirmation rate. (Full PDF export not implemented — no file-generation endpoint on the backend yet.)`);
      setShowReportModal(false);
    } catch (err) {
      alert(`Failed to generate report: ${err.message}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className=" max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h5 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Icon icon='heroicons:clock' className="w-7 h-7 text-blue-600" />
            Probation Management
          </h5>
          <p className="text-sm text-gray-500 mt-1">Track, review, and manage employee probation periods</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={() => setShowReportModal(true)}
          >
            <Icon icon="heroicons:chart-bar" className="w-4 h-4" />
            Reports
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 ${selectedEmployees.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setShowBulkActionModal(true)}
            disabled={selectedEmployees.length === 0}
          >
            <Icon icon="heroicons:check-badge" className="w-4 h-4" />
            Bulk Actions ({selectedEmployees.length})
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Icon icon="heroicons:user-plus" className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard title="Total" value={stats.total} icon="heroicons:users" color="blue" />
        <StatCard title="In Progress" value={stats.inProgress} icon="heroicons:arrow-path" color="blue" />
        <StatCard title="At Risk" value={stats.atRisk} icon="heroicons:exclamation-triangle" color="red" />
        <StatCard title="Ending This Week" value={stats.endingThisWeek} icon="heroicons:calendar-days" color="purple" />
        <StatCard title="Completed" value={stats.completed} icon="heroicons:check-circle" color="green" />
        <StatCard title="High Risk" value={stats.highRisk} icon="heroicons:x-circle" color="red" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="in_progress">In Progress</option>
            <option value="under_review">Under Review</option>
            <option value="extended">Extended</option>
            <option value="at_risk">At Risk</option>
            <option value="completed">Completed</option>
            <option value="terminated">Terminated</option>
          </select>

          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">HR</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Quality Assurance">Quality Assurance</option>
          </select>

          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="daysRemaining">Sort by Days Remaining</option>
            <option value="progress">Sort by Progress</option>
            <option value="joiningDate">Sort by Joining Date</option>
          </select>
        </div>
      </div>

      {selectedEmployees.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons:check-circle" className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700">
              <strong className="font-semibold">{selectedEmployees.length} employees</strong> selected for bulk actions
            </span>
          </div>
          <button
            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            onClick={() => setSelectedEmployees([])}
          >
            Clear Selection
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-slate-50/70 border-b border-slate-200/80">
              <tr>
                <th className="w-12 px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    checked={selectedEmployees.length === paginatedEmployees.length && paginatedEmployees.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[220px]">Employee Details</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[140px]">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[150px]">Progress</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[120px]">Risk Level</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[180px]">Milestones</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[160px]">Time Remaining</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[140px]">Rating</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id} className={`hover:bg-slate-50/50 transition-colors ${selectedEmployees.includes(emp.id) ? 'bg-blue-50/40 hover:bg-blue-50/60' : ''}`}>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => handleSelectEmployee(emp.id)}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs flex-shrink-0">
                        {emp.name ? emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'EE'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-sm text-slate-800 truncate">{emp.name}</span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200/40">{emp.employeeId}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-normal mt-0.5 truncate">{emp.designation} &bull; {emp.department}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      {getStatusBadge(emp.status)}
                      {emp.extensionCount > 0 && (
                        <span className="text-[10px] font-medium text-slate-400">
                          {emp.extensionCount} Extension{emp.extensionCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <ProgressBar percentage={emp.progress} />
                  </td>

                  <td className="px-6 py-4 text-center">
                    {getRiskBadge(emp.riskLevel)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1.5">
                      <ReviewMilestones employee={emp} />
                      <span className="text-[10px] text-slate-400 font-medium">
                        Next: {emp.nextReviewDate ? formatDate(emp.nextReviewDate) : 'N/A'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${emp.daysRemaining <= 0 ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          emp.daysRemaining <= 7 ? 'bg-rose-50/70 text-rose-600 border-rose-100' :
                            emp.daysRemaining <= 30 ? 'bg-amber-50/70 text-amber-700 border-amber-100' :
                              'bg-emerald-50/70 text-emerald-700 border-emerald-100'
                        }`}>
                        <Icon icon={emp.daysRemaining <= 0 ? "heroicons:exclamation-triangle" : "heroicons:clock"} className="w-3.5 h-3.5" />
                        {emp.daysRemaining <= 0 ? `${Math.abs(emp.daysRemaining)}d overdue` : `${emp.daysRemaining} days`}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        Ends: {formatDate(emp.probationEndDate)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {getRatingBadge(emp.currentRating)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                        onClick={() => handleViewDetails(emp)}
                        title="View Details"
                      >
                        <Icon icon="heroicons:eye" className="w-4 h-4" />
                      </button>

                      {emp.status !== 'completed' && emp.status !== 'terminated' && (
                        <>
                          <button
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all border border-transparent hover:border-amber-100"
                            onClick={() => handleExtendProbation(emp)}
                            title="Extend Probation"
                          >
                            <Icon icon="heroicons:calendar" className="w-4 h-4" />
                          </button>

                          <button
                            className={`p-1.5 rounded-lg transition-all border border-transparent ${emp.progress >= 80
                                ? 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100'
                                : 'text-slate-300 cursor-not-allowed'
                              }`}
                            onClick={() => {
                              if (emp.progress >= 80 && emp.daysRemaining > 30) {
                                handleEarlyConfirmation(emp);
                              } else if (emp.progress >= 80) {
                                setSelectedEmployee(emp);
                                setShowConfirmModal(true);
                              }
                            }}
                            title={emp.progress >= 80 && emp.daysRemaining > 30 ? "Early Confirmation" : "Confirm Employee"}
                            disabled={emp.progress < 80}
                          >
                            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                          </button>

                          <div className="relative group flex items-center">
                            <button
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                              title="Conduct Review"
                            >
                              <Icon icon="heroicons:clipboard-document-check" className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 py-1.5">
                              {!emp.review30.completed && (
                                <button
                                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium"
                                  onClick={() => handleStartReview(emp, '30_day')}
                                >
                                  <Icon icon="heroicons:document-text" className="w-4 h-4 text-slate-400" />
                                  30 Day Review
                                </button>
                              )}
                              {emp.review30.completed && !emp.review60.completed && (
                                <button
                                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium"
                                  onClick={() => handleStartReview(emp, '60_day')}
                                >
                                  <Icon icon="heroicons:document-text" className="w-4 h-4 text-slate-400" />
                                  60 Day Review
                                </button>
                              )}
                              {emp.review60.completed && !emp.review90.completed && (
                                <button
                                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium"
                                  onClick={() => handleStartReview(emp, '90_day')}
                                >
                                  <Icon icon="heroicons:document-text" className="w-4 h-4 text-slate-400" />
                                  90 Day Review
                                </button>
                              )}
                              {emp.review90.completed && emp.status !== 'completed' && (
                                <button
                                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium"
                                  onClick={() => handleStartReview(emp, 'final')}
                                >
                                  <Icon icon="heroicons:document-text" className="w-4 h-4 text-slate-400" />
                                  Final Review
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      <button
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100"
                        onClick={() => handleTerminateProbation(emp)}
                        title="Terminate Probation"
                      >
                        <Icon icon="heroicons:x-circle" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Icon icon="heroicons:users" className="w-12 h-12 text-slate-300 mb-3" />
                      <h5 className="text-slate-500 font-medium mb-1">No probation employees found</h5>
                      <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {(totalPages > 1 || selectedEmployees.length > 0) && (
          <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                Showing <strong className="text-gray-700">{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong className="text-gray-700">{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</strong> of <strong className="text-gray-700">{filteredEmployees.length}</strong> employees
              </span>

              {selectedEmployees.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  <Icon icon="heroicons:check-circle" className="w-3 h-3 mr-1" />
                  {selectedEmployees.length} selected
                </span>
              )}
            </div>

            {totalPages > 1 && (
              <nav className="flex items-center gap-1">
                <button
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'} transition-colors flex items-center gap-1`}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <Icon icon="heroicons:chevron-left" className="w-4 h-4" />
                  Previous
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && (
                  <>
                    <span className="px-2 text-slate-400">...</span>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-100'} transition-colors flex items-center gap-1`}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <Icon icon="heroicons:chevron-right" className="w-4 h-4" />
                </button>
              </nav>
            )}
          </div>
        )}
      </div>

      <AddEmployeeProbationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        newEmployee={newEmployee}
        setNewEmployee={setNewEmployee}
        onSubmit={handleAddEmployee}
      />


      <ReviewProbationModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setReviewStep('self');
        }}
        selectedEmployee={selectedEmployee}
        reviewForm={reviewForm}
        setReviewForm={setReviewForm}
        reviewStep={reviewStep}
        setReviewStep={setReviewStep}
        onSubmit={handleSubmitReview}
        onSelfAssessmentSubmit={handleSubmitSelfAssessment}
        onScheduleMeeting={handleScheduleMeeting}
      />


      <ExtendProbationModal
        isOpen={showExtendModal}
        onClose={() => setShowExtendModal(false)}
        selectedEmployee={selectedEmployee}
        extensionForm={extensionForm}
        setExtensionForm={setExtensionForm}
        onSubmit={handleSubmitExtension}
        formatDate={formatDate}
      />


      <ConfirmProbationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        selectedEmployee={selectedEmployee}
        onConfirm={handleConfirmEmployee}
      />


      <TerminateProbationModal
        isOpen={showTerminateModal}
        onClose={() => setShowTerminateModal(false)}
        selectedEmployee={selectedEmployee}
        terminationForm={terminationForm}
        setTerminationForm={setTerminationForm}
        onSubmit={handleSubmitTermination}
      />

      {showMeetingScheduleModal && selectedEmployee && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
              <h5 className="text-lg font-bold text-slate-900">Schedule Review Meeting - {selectedEmployee.name}</h5>
              <button className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all" onClick={() => setShowMeetingScheduleModal(false)}>
                <Icon icon="heroicons:x-mark" className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSubmitMeeting}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Date *</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={meetingForm.meetingDate}
                      onChange={(e) => setMeetingForm({ ...meetingForm, meetingDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time *</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={meetingForm.meetingTime}
                      onChange={(e) => setMeetingForm({ ...meetingForm, meetingTime: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={meetingForm.duration}
                      onChange={(e) => setMeetingForm({ ...meetingForm, duration: e.target.value })}
                      required
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={meetingForm.meetingType}
                      onChange={(e) => setMeetingForm({ ...meetingForm, meetingType: e.target.value })}
                      required
                    >
                      <option value="in_person">In Person</option>
                      <option value="virtual">Virtual</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  {(meetingForm.meetingType === 'virtual' || meetingForm.meetingType === 'hybrid') ? (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link *</label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={meetingForm.meetingLink}
                        onChange={(e) => setMeetingForm({ ...meetingForm, meetingLink: e.target.value })}
                        placeholder="https://zoom.us/j/..."
                        required
                      />
                    </div>
                  ) : (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={meetingForm.location}
                        onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                        placeholder="Conference Room A, Building 2"
                        required
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={meetingForm.attendees.join(', ')}
                      onChange={(e) => setMeetingForm({
                        ...meetingForm,
                        attendees: e.target.value.split(',').map(a => a.trim())
                      })}
                      placeholder="Manager, HR Manager, Employee"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple attendees with commas</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Agenda</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      value={meetingForm.agenda}
                      onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                      placeholder="Review objectives, performance discussion, feedback..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={meetingForm.sendCalendarInvite}
                        onChange={(e) => setMeetingForm({ ...meetingForm, sendCalendarInvite: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Send calendar invites to all attendees</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setShowMeetingScheduleModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Icon icon="heroicons:calendar" className="w-4 h-4" />
                    Schedule Meeting
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {showBulkActionModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
              <h5 className="text-lg font-bold text-slate-900">Bulk Actions ({selectedEmployees.length} employees)</h5>
              <button className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all" onClick={() => setShowBulkActionModal(false)}>
                <Icon icon="heroicons:x-mark" className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleBulkActionSubmit}>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm">
                    Apply action to all selected employees
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Action *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={bulkAction.action}
                      onChange={(e) => setBulkAction({ ...bulkAction, action: e.target.value })}
                      required
                    >
                      <option value="">-- Choose an action --</option>
                      <option value="schedule_review">Schedule Review</option>
                      <option value="send_reminder">Send Reminder</option>
                      <option value="extend_probation">Extend Probation</option>
                      <option value="confirm_employees">Confirm Employees</option>
                      <option value="export_data">Export Data</option>
                    </select>
                  </div>

                  {bulkAction.action === 'schedule_review' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Review Date *</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={bulkAction.date}
                        onChange={(e) => setBulkAction({ ...bulkAction, date: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  {bulkAction.action === 'extend_probation' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Extension Days *</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={bulkAction.extensionDays}
                        onChange={(e) => setBulkAction({ ...bulkAction, extensionDays: e.target.value })}
                        required
                      >
                        <option value="15">15 Days</option>
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="2"
                      placeholder="Add a message for the action..."
                      value={bulkAction.message}
                      onChange={(e) => setBulkAction({ ...bulkAction, message: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setShowBulkActionModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Icon icon="heroicons:check" className="w-4 h-4" />
                    Apply Action
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
              <h5 className="text-lg font-bold text-slate-900">Generate Report</h5>
              <button className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all" onClick={() => setShowReportModal(false)}>
                <Icon icon="heroicons:x-mark" className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              <form onSubmit={(e) => { e.preventDefault(); handleGenerateReport(); }}>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm flex items-center gap-2">
                    <Icon icon="heroicons:information-circle" className="w-5 h-5 flex-shrink-0" />
                    Generate comprehensive PDF report for probation management
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={reportFilters.startDate}
                        onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={reportFilters.endDate}
                        onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={reportFilters.department}
                        onChange={(e) => setReportFilters({ ...reportFilters, department: e.target.value })}
                      >
                        <option value="all">All Departments</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">HR</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={reportFilters.status}
                        onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}
                      >
                        <option value="all">All Status</option>
                        <option value="in_progress">In Progress</option>
                        <option value="under_review">Under Review</option>
                        <option value="extended">Extended</option>
                        <option value="at_risk">At Risk</option>
                        <option value="completed">Completed</option>
                        <option value="terminated">Terminated</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setShowReportModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
                    Generate Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
              <h5 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Icon icon="heroicons:user" className="w-5 h-5" />
                Employee Details - {selectedEmployee.name}
              </h5>
              <button className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all" onClick={() => setShowDetailModal(false)}>
                <Icon icon="heroicons:x-mark" className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h6 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h6>
                  <p className="text-sm text-gray-500">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{selectedEmployee.employeeId}</span>
                    {getStatusBadge(selectedEmployee.status)}
                    {getRiskBadge(selectedEmployee.riskLevel)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleStartReview(selectedEmployee);
                    }}
                  >
                    <Icon icon="heroicons:clipboard-document-check" className="w-4 h-4" />
                    Conduct Review
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleScheduleMeeting(selectedEmployee, '30_day');
                    }}
                  >
                    <Icon icon="heroicons:calendar" className="w-4 h-4" />
                    Schedule Meeting
                  </button>
                  {selectedEmployee.status === 'completed' && selectedEmployee.confirmationLetterId && (
                    <button
                      className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1.5"
                      onClick={() => setShowConfirmationLetterViewModal(true)}
                    >
                      <Icon icon="heroicons:document" className="w-4 h-4" />
                      View Letter
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h6 className="text-sm font-semibold text-gray-700 mb-3">Probation Information</h6>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Joining Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(selectedEmployee.joiningDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Probation Ends</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(selectedEmployee.probationEndDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Days Remaining</p>
                      <p className={`text-sm font-medium ${selectedEmployee.daysRemaining <= 0 ? 'text-red-600' : selectedEmployee.daysRemaining <= 7 ? 'text-red-500' : selectedEmployee.daysRemaining <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {selectedEmployee.daysRemaining} days
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Progress</p>
                      <ProgressBar percentage={selectedEmployee.progress} showLabel={true} />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h6 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h6>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Manager</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEmployee.manager}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{selectedEmployee.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEmployee.contactPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEmployee.workLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h6 className="text-sm font-semibold text-gray-700">Review History</h6>
                  <ReviewMilestones employee={selectedEmployee} />
                </div>
                {reviewHistory.filter(r => r.employeeId === selectedEmployee.employeeId).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Review</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reviewer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reviewHistory
                          .filter(r => r.employeeId === selectedEmployee.employeeId)
                          .map(review => (
                            <tr key={review.id}>
                              <td className="px-3 py-2 text-sm text-gray-900">{review.reviewType}</td>
                              <td className="px-3 py-2 text-sm text-gray-500">{formatDate(review.reviewDate)}</td>
                              <td className="px-3 py-2">{getRatingBadge(review.rating)}</td>
                              <td className="px-3 py-2 text-sm text-gray-500">{review.reviewer}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No review history available</p>
                )}
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {showConfirmationLetterViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
              <div>
                <h5 className="text-lg font-bold text-slate-900">Confirmation Letter</h5>
                <p className="text-sm text-gray-500">Letter ID: {selectedEmployee.confirmationLetterId}</p>
              </div>
              <button className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all" onClick={() => setShowConfirmationLetterViewModal(false)}>
                <Icon icon="heroicons:x-mark" className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              <div className="border rounded-lg p-6 bg-white font-serif max-w-3xl mx-auto">
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-gray-900">CONFIRMATION LETTER</h4>
                  <div className="w-48 h-0.5 bg-blue-500 mx-auto mt-2" />
                </div>

                <div className="text-right mb-4 text-sm text-gray-600">
                  <p><strong>Letter ID:</strong> {selectedEmployee.confirmationLetterId}</p>
                  <p><strong>Date:</strong> {formatDate(selectedEmployee.confirmationDate || selectedEmployee.probationEndDate)}</p>
                </div>

                <div className="mb-4">
                  <p className="font-bold">To:</p>
                  <p>{selectedEmployee.name}</p>
                  <p>{selectedEmployee.designation}</p>
                  <p>{selectedEmployee.department}</p>
                  <p>{selectedEmployee.workLocation}</p>
                </div>

                <div className="mb-4">
                  <p className="font-bold text-gray-800">Subject: Confirmation of Employment</p>
                </div>

                <div className="space-y-3 text-gray-800 leading-relaxed">
                  <p>Dear {selectedEmployee.name},</p>

                  <p>
                    We are pleased to inform you that your probation period has been successfully completed,
                    and you are hereby confirmed as a permanent employee of the company effective
                    <strong> {formatDate(selectedEmployee.confirmationDate || selectedEmployee.probationEndDate)}</strong>.
                  </p>

                  <p>
                    Your performance during the probation period has been evaluated and found to be satisfactory.
                    The management appreciates your dedication, hard work, and commitment to the organization.
                  </p>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
                    <h6 className="font-bold mb-2">Employment Details:</h6>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><strong>Designation:</strong> {selectedEmployee.designation}</div>
                      <div><strong>Department:</strong> {selectedEmployee.department}</div>
                      <div><strong>Reporting Manager:</strong> {selectedEmployee.manager}</div>
                      <div><strong>Employment Type:</strong> {selectedEmployee.employmentType}</div>
                      <div><strong>Work Location:</strong> {selectedEmployee.workLocation}</div>
                      <div><strong>Date of Joining:</strong> {formatDate(selectedEmployee.joiningDate)}</div>
                    </div>
                  </div>

                  <p>
                    As a confirmed employee, you will be entitled to all benefits and privileges as per company policy.
                    Your salary, allowances, and other terms of employment remain unchanged unless otherwise notified.
                  </p>

                  <p>
                    We look forward to your continued contribution to the growth and success of the organization.
                    Please feel free to contact the HR department for any clarifications regarding your employment terms.
                  </p>

                  <p className="font-bold">Congratulations once again on your confirmation!</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-8 pt-4 border-t border-gray-200">
                  <div>
                    <p className="font-bold">For [Company Name]</p>
                    <div className="mt-8 border-t border-gray-400 pt-1">
                      <p className="text-sm">Authorized Signatory</p>
                      <p className="text-sm">Human Resources Department</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">Accepted by Employee</p>
                    <div className="mt-8 border-t border-gray-400 pt-1">
                      <p className="text-sm">Signature</p>
                      <p className="text-sm">Date: ___________</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">This is a system-generated confirmation letter. For any discrepancies, please contact HR department.</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setShowConfirmationLetterViewModal(false)}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  onClick={() => {
                    alert('Downloading PDF...');
                  }}
                >
                  <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProbationManagement;