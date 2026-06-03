// src/components/HRMS/HROperations/PromotionsCareer.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import 'bootstrap/dist/css/bootstrap.min.css';



const PromotionsCareer = () => {  // ---------------- ENHANCED INITIAL DATA ----------------  
  // Enhanced Probation Employees Data

  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showEarlyConfirmModal, setShowEarlyConfirmModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);


  const initialProbationEmployees = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Rajesh Kumar',
      designation: 'Software Engineer',
      department: 'Engineering',
      manager: 'Priya Sharma',
      skipLevelManager: 'Sanjay Verma',
      hrBusinessPartner: 'Anita Verma',
      buddy: 'Arun Mehta',
      buddyStatus: 'assigned',
      buddyRating: 4.5,
      joiningDate: '2024-01-15',
      probationEndDate: '2024-04-15',
      probationPeriod: '90',
      daysRemaining: 75,
      status: 'in_progress',
      riskLevel: 'low',
      progress: 66,
      review30: { completed: true, date: '2024-02-15', rating: 'Exceeds Expectations' },
      review60: { completed: true, date: '2024-03-15', rating: 'Meets Expectations' },
      review90: { completed: false, scheduled: '2024-04-01', rating: null },
      currentRating: 'Meets Expectations',
      nextReviewDate: '2024-04-01',
      extensionCount: 0,
      probationType: 'regular',
      noticePeriod: '60',
      workLocation: 'Bangalore',
      employmentType: 'Permanent',
      salary: '₹8,50,000',
      skills: ['React', 'Node.js', 'MongoDB'],
      trainingCompleted: ['Orientation', 'Code of Conduct', 'Security Training'],
      probationReviews: [
        {
          id: 1,
          type: '30_day',
          date: '2024-02-15',
          selfAssessment: 'I have adapted well to the team and completed all assigned tasks.',
          managerAssessment: 'Excellent performance, quick learner. Shows great potential.',
          skipLevelAssessment: 'Good progress, meeting expectations.',
          hrAssessment: 'Good cultural fit. Engages well with team.',
          rating: 'Exceeds Expectations',
          recommendations: 'Continue current trajectory',
          meetingScheduled: true,
          meetingDate: '2024-02-14',
          actionItems: ['Complete advanced React course', 'Take ownership of login module']
        }
      ],
      attachments: [
        { name: '30_day_review.pdf', type: 'review', date: '2024-02-15' },
        { name: 'self_assessment.docx', type: 'assessment', date: '2024-02-10' }
      ],
      email: 'rajesh.kumar@company.com',
      phone: '+91 9876543210',
      performanceScore: 4.2,
      engagementScore: 4.5
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Priya Sharma',
      designation: 'Junior HR Executive',
      department: 'Human Resources',
      manager: 'Rahul Mehta',
      skipLevelManager: 'Anita Verma',
      hrBusinessPartner: 'Sanjay Verma',
      buddy: 'Anita Desai',
      buddyStatus: 'assigned',
      buddyRating: 4.8,
      joiningDate: '2024-02-01',
      probationEndDate: '2024-05-01',
      probationPeriod: '90',
      daysRemaining: 45,
      status: 'at_risk',
      riskLevel: 'high',
      progress: 50,
      review30: { completed: true, date: '2024-03-01', rating: 'Needs Improvement' },
      review60: { completed: true, date: '2024-04-01', rating: 'Needs Improvement' },
      review90: { completed: false, scheduled: '2024-04-15', rating: null },
      currentRating: 'Needs Improvement',
      nextReviewDate: '2024-04-15',
      extensionCount: 1,
      probationType: 'extended',
      noticePeriod: '60',
      workLocation: 'Mumbai',
      employmentType: 'Permanent',
      salary: '₹5,50,000',
      skills: ['Recruitment', 'Employee Relations', 'HRMS'],
      trainingCompleted: ['Orientation', 'HR Compliance'],
      probationReviews: [
        {
          id: 2,
          type: '30_day',
          date: '2024-03-01',
          selfAssessment: 'Learning the processes, need more time to adapt.',
          managerAssessment: 'Performance needs improvement. Requires more guidance.',
          skipLevelAssessment: 'Concerns about performance. Monitor closely.',
          hrAssessment: 'Needs additional training and support.',
          rating: 'Needs Improvement',
          recommendations: 'Provide additional training and mentoring',
          meetingScheduled: true,
          meetingDate: '2024-03-02',
          actionItems: ['Complete HR compliance training', 'Shadow senior HR executive']
        }
      ],
      attachments: [
        { name: 'performance_plan.pdf', type: 'plan', date: '2024-03-05' }
      ],
      email: 'priya.sharma@company.com',
      phone: '+91 9876543211',
      performanceScore: 2.8,
      engagementScore: 3.5
    },
    // ... more probation employees
  ];

  // Enhanced Confirmation Employees Data
  const initialConfirmationEmployees = [
    {
      id: 101,
      employeeId: 'EMP006',
      name: 'Arun Mehta',
      designation: 'DevOps Engineer',
      department: 'Engineering',
      manager: 'Sanjay Verma',
      hrBusinessPartner: 'Rohit Sharma',
      joiningDate: '2023-11-15',
      probationEndDate: '2024-02-15',
      confirmationDueDate: '2024-02-15',
      daysRemaining: -25,
      status: 'confirmed',
      confirmationStatus: 'confirmed',
      riskLevel: 'low',
      probationReviewCompleted: true,
      review30: { completed: true, date: '2023-12-15', rating: 'Exceeds Expectations' },
      review60: { completed: true, date: '2024-01-15', rating: 'Exceeds Expectations' },
      review90: { completed: true, date: '2024-02-10', rating: 'Exceeds Expectations' },
      currentRating: 'Exceeds Expectations',
      managerReviewDate: '2024-02-12',
      managerRecommendation: 'recommended',
      managerComments: 'Outstanding performance. Quick learner and team player.',
      hrReviewDate: '2024-02-14',
      hrRecommendation: 'approved',
      hrComments: 'All probation reviews completed successfully.',
      departmentHeadReviewDate: '2024-02-15',
      departmentHeadApproval: 'approved',
      confirmationAuthorityReviewDate: '2024-02-15',
      confirmationAuthorityApproval: 'approved',
      confirmationDate: '2024-02-15',
      confirmationEffectiveDate: '2024-02-15',
      confirmationLetterGenerated: true,
      confirmationLetterSent: true,
      autoTriggered: true,
      workLocation: 'Bangalore',
      employmentType: 'Permanent',
      salary: '₹9,50,000',
      email: 'arun.mehta@company.com',
      phone: '+91 9876543212',
      performanceScore: 4.8
    },
    {
      id: 102,
      employeeId: 'EMP007',
      name: 'Sneha Patel',
      designation: 'Marketing Executive',
      department: 'Marketing',
      manager: 'Ravi Kumar',
      hrBusinessPartner: 'Anita Verma',
      joiningDate: '2023-12-01',
      probationEndDate: '2024-03-01',
      confirmationDueDate: '2024-03-01',
      daysRemaining: 5,
      status: 'pending_approval',
      confirmationStatus: 'pending_approval',
      riskLevel: 'medium',
      probationReviewCompleted: true,
      review30: { completed: true, date: '2024-01-01', rating: 'Meets Expectations' },
      review60: { completed: true, date: '2024-02-01', rating: 'Meets Expectations' },
      review90: { completed: true, date: '2024-02-20', rating: 'Meets Expectations' },
      currentRating: 'Meets Expectations',
      managerReviewDate: '2024-02-25',
      managerRecommendation: 'recommended',
      managerComments: 'Good performance, meeting all expectations.',
      hrReviewDate: '2024-02-28',
      hrRecommendation: 'approved',
      hrComments: 'All requirements met.',
      departmentHeadReviewDate: null,
      departmentHeadApproval: null,
      confirmationAuthorityReviewDate: null,
      confirmationAuthorityApproval: null,
      confirmationDate: null,
      confirmationEffectiveDate: null,
      confirmationLetterGenerated: false,
      confirmationLetterSent: false,
      autoTriggered: true,
      workLocation: 'Delhi',
      employmentType: 'Permanent',
      salary: '₹6,50,000',
      email: 'sneha.patel@company.com',
      phone: '+91 9876543213',
      performanceScore: 3.9
    },
    // ... more confirmation employees
  ];

  // Enhanced Promotion Employees Data
  const initialPromotionEmployees = [
    {
      id: 201,
      employeeId: 'EMP020',
      name: 'Priya Sharma',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      manager: 'Sanjay Verma',
      hrBusinessPartner: 'Anita Verma',
      currentGrade: 'P3',
      proposedGrade: 'P4',
      currentDesignation: 'Senior Software Engineer',
      proposedDesignation: 'Tech Lead',
      currentSalary: '₹12,00,000',
      proposedSalary: '₹14,50,000',
      tenure: '3.5 years',
      lastPromotionDate: '2022-06-15',
      performanceRating: 'Exceeds Expectations',
      promotionCycle: 'Annual',
      nominationDate: '2024-03-01',
      nominationBy: 'Sanjay Verma',
      eligibilityStatus: 'eligible',
      promotionCommitteeReview: 'pending',
      approvalWorkflow: [
        { id: 1, level: 'Manager', status: 'approved', date: '2024-03-05', approver: 'Sanjay Verma' },
        { id: 2, level: 'Department Head', status: 'approved', date: '2024-03-10', approver: 'Rahul Jain' },
        { id: 3, level: 'HR', status: 'pending', date: null, approver: null },
        { id: 4, level: 'Promotion Committee', status: 'pending', date: null, approver: null },
        { id: 5, level: 'Leadership', status: 'pending', date: null, approver: null }
      ],
      promotionStatus: 'under_review',
      promotionLetterGenerated: false,
      announcementDate: null,
      effectiveDate: null,
      skills: ['React', 'Node.js', 'Team Leadership', 'Architecture'],
      achievements: ['Led team of 5 developers', 'Reduced system latency by 40%'],
      workLocation: 'Bangalore',
      email: 'priya.sharma@company.com',
      phone: '+91 9876543220',
      promotionScore: 8.5,
      budgetAllocation: 'Approved',
      trainingRequired: ['Leadership Training', 'Advanced Architecture'],
      competitorOffer: '₹15,00,000',
      retentionRisk: 'Medium'
    },
    // ... more promotion employees
  ];

  // Enhanced Buddy Program Data
  const initialBuddies = [
    {
      id: 1,
      buddyId: 'BUD001',
      name: 'Arun Mehta',
      designation: 'DevOps Engineer',
      department: 'Engineering',
      experience: '3 years',
      newJoinerCount: 2,
      averageRating: 4.7,
      status: 'active',
      assignedNewJoiners: [
        { id: 'EMP001', name: 'Rajesh Kumar', startDate: '2024-01-15', status: 'active' },
        { id: 'EMP005', name: 'Amit Singh', startDate: '2024-02-01', status: 'active' }
      ],
      responsibilities: [
        'Orientation guidance',
        'Technical onboarding',
        'Team introduction',
        'Process documentation',
        'Regular check-ins'
      ],
      feedback: [
        { newJoinerId: 'EMP001', rating: 5, comments: 'Very helpful and supportive', date: '2024-02-15' }
      ],
      joinDate: '2021-06-15',
      email: 'arun.mehta@company.com',
      phone: '+91 9876543212',
      maxCapacity: 3,
      currentLoad: '67%',
      nextAvailableDate: '2024-04-15',
      buddyRewards: ['Spot Award Q4-2023', 'Best Buddy 2023']
    },
    {
      id: 2,
      buddyId: 'BUD002',
      name: 'Anita Desai',
      designation: 'Senior HR Executive',
      department: 'Human Resources',
      experience: '4 years',
      newJoinerCount: 1,
      averageRating: 4.9,
      status: 'active',
      assignedNewJoiners: [
        { id: 'EMP002', name: 'Priya Sharma', startDate: '2024-02-01', status: 'active' }
      ],
      responsibilities: [
        'HR onboarding',
        'Policy guidance',
        'Team introduction',
        'Compliance training'
      ],
      feedback: [
        { newJoinerId: 'EMP002', rating: 5, comments: 'Excellent guidance on company policies', date: '2024-03-01' }
      ],
      joinDate: '2020-03-10',
      email: 'anita.desai@company.com',
      phone: '+91 9876543214',
      maxCapacity: 2,
      currentLoad: '50%',
      nextAvailableDate: '2024-03-25',
      buddyRewards: ['Best Buddy 2022', 'Quarterly Excellence Award']
    },
    // ... more buddies
  ];

  // ---------------- ENHANCED STATE VARIABLES ----------------
  const [activeTab, setActiveTab] = useState('probation');
  const [probationEmployees, setProbationEmployees] = useState(initialProbationEmployees);
  const [confirmationEmployees, setConfirmationEmployees] = useState(initialConfirmationEmployees);
  const [promotionEmployees, setPromotionEmployees] = useState(initialPromotionEmployees);
  const [buddies, setBuddies] = useState(initialBuddies);

  // Enhanced UI States
  const [showProbationReviewModal, setShowProbationReviewModal] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showEarlyConfirmationModal, setShowEarlyConfirmationModal] = useState(false);
  const [showTerminationModal, setShowTerminationModal] = useState(false);
  const [showBuddyAssignmentModal, setShowBuddyAssignmentModal] = useState(false);
  const [showConfirmationWorkflowModal, setShowConfirmationWorkflowModal] = useState(false);
  const [showPromotionNominationModal, setShowPromotionNominationModal] = useState(false);
  const [showPromotionReviewModal, setShowPromotionReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Enhanced Filter States
  const [filters, setFilters] = useState({
    search: '',
    department: 'All',
    location: 'All',
    status: 'All',
    dateRange: 'All',
    riskLevel: 'All',
    manager: 'All'
  });

  // Selected items
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // View and Layout States
  const [viewMode, setViewMode] = useState('table'); // 'table', 'card', 'timeline'
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Analytics Data
  const [analytics, setAnalytics] = useState({
    probation: {
      total: 0,
      inProgress: 0,
      atRisk: 0,
      extended: 0,
      avgProgress: 0,
      endingSoon: 0
    },
    confirmation: {
      total: 0,
      confirmed: 0,
      pending: 0,
      overdue: 0,
      avgTimeToConfirm: 0
    },
    promotions: {
      total: 0,
      approved: 0,
      pending: 0,
      successRate: 0,
      avgIncrease: 0
    },
    buddy: {
      active: 0,
      avgRating: 0,
      satisfaction: 0,
      assignments: 0
    }
  });

  // ---------------- ENHANCED HELPER FUNCTIONS ----------------
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status) => {
    const colors = {
      in_progress: 'primary',
      under_review: 'warning',
      extended: 'info',
      at_risk: 'danger',
      completed: 'success',
      terminated: 'secondary',
      confirmed: 'success',
      pending_review: 'warning',
      pending_approval: 'primary',
      overdue: 'danger',
      approved: 'success',
      rejected: 'danger',
      active: 'success',
      inactive: 'secondary'
    };
    return colors[status] || 'secondary';
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return colors[riskLevel] || 'secondary';
  };

  const calculateProgress = (employee) => {
    const start = new Date(employee.joiningDate);
    const end = new Date(employee.probationEndDate);
    const today = new Date();
    const total = end - start;
    const elapsed = today - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  // ---------------- ENHANCED UI COMPONENTS ----------------
  const getStatusBadge = (status) => {
    const config = {
      in_progress: { label: 'In Progress', color: 'primary' },
      under_review: { label: 'Under Review', color: 'warning' },
      extended: { label: 'Extended', color: 'info' },
      at_risk: { label: 'At Risk', color: 'danger' },
      completed: { label: 'Completed', color: 'success' },
      terminated: { label: 'Terminated', color: 'secondary' },
      confirmed: { label: 'Confirmed', color: 'success' },
      pending_review: { label: 'Pending Review', color: 'warning' },
      pending_approval: { label: 'Pending Approval', color: 'primary' },
      overdue: { label: 'Overdue', color: 'danger' },
      approved: { label: 'Approved', color: 'success' },
      rejected: { label: 'Rejected', color: 'danger' },
      active: { label: 'Active', color: 'success' },
      inactive: { label: 'Inactive', color: 'secondary' }
    };

    const { label, color } = config[status] || { label: status, color: 'secondary' };

    return (
      <span className={`badge bg-${color}-subtle text-${color} border border-${color}-subtle`}>
        {label}
      </span>
    );
  };

  const ProgressBar = ({ progress, size = 'sm', showLabel = true }) => {
    const getColor = (value) => {
      if (value >= 80) return 'success';
      if (value >= 60) return 'info';
      if (value >= 40) return 'warning';
      return 'danger';
    };

    const color = getColor(progress);

    return (
      <div className="d-flex align-items-center gap-2">
        <div className={`progress flex-grow-1 ${size === 'sm' ? 'progress-sm' : ''}`}>
          <div
            className={`progress-bar bg-${color}`}
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
          </div>
        </div>
        {showLabel && (
          <small className="text-nowrap" style={{ minWidth: '40px' }}>
            {progress.toFixed(0)}%
          </small>
        )}
      </div>
    );
  };

  const RatingStars = ({ rating, max = 5, size = 'sm' }) => {
    const stars = [];
    for (let i = 1; i <= max; i++) {
      stars.push(
        <Icon
          key={i}
          icon="heroicons:star"
          className={i <= rating ? 'text-warning' : 'text-secondary'}
          width={size === 'sm' ? 16 : 20}
          height={size === 'sm' ? 16 : 20}
        />
      );
    }
    return <div className="d-flex align-items-center">{stars}</div>;
  };

  const ReviewMilestones = ({ employee }) => {
    const milestones = [
      { key: 'review30', label: '30', milestone: employee.review30 },
      { key: 'review60', label: '60', milestone: employee.review60 },
      { key: 'review90', label: '90', milestone: employee.review90 }
    ];

    return (
      <div className="d-flex gap-2">
        {milestones.map(({ key, label, milestone }) => (
          <div key={key} className="text-center">
            <div
              className={`badge ${milestone.completed ? 'bg-success' : 'bg-light text-muted border'} rounded-circle d-flex align-items-center justify-content-center`}
              style={{ width: '32px', height: '32px' }}
              title={`${label} Day: ${milestone.completed ? formatDate(milestone.date) : 'Pending'}`}
            >
              {label}
            </div>
            {milestone.completed && milestone.rating && (
              <div className="small mt-1">
                <small className="text-muted">{milestone.rating.split(' ')[0]}</small>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const EnhancedConfirmationWorkflow = ({ employee }) => {
    const steps = [
      {
        key: 'probationReview',
        label: 'P',
        status: employee.probationReviewCompleted ? 'completed' : 'pending',
        tooltip: `Probation Review: ${employee.probationReviewCompleted ? 'Completed' : 'Pending'}`,
        date: employee.probationReviewCompleted ? employee.probationEndDate : null
      },
      {
        key: 'managerReview',
        label: 'M',
        status: employee.managerRecommendation ? 'completed' : 'pending',
        tooltip: `Manager: ${employee.managerRecommendation || 'Pending'}`,
        date: employee.managerReviewDate
      },
      {
        key: 'hrReview',
        label: 'H',
        status: employee.hrRecommendation ? 'completed' : 'pending',
        tooltip: `HR: ${employee.hrRecommendation || 'Pending'}`,
        date: employee.hrReviewDate
      },
      {
        key: 'deptHead',
        label: 'D',
        status: employee.departmentHeadApproval ? 'completed' : 'pending',
        tooltip: `Dept Head: ${employee.departmentHeadApproval || 'Pending'}`,
        date: employee.departmentHeadReviewDate
      },
      {
        key: 'authority',
        label: 'A',
        status: employee.confirmationAuthorityApproval ? 'completed' : 'pending',
        tooltip: `Authority: ${employee.confirmationAuthorityApproval || 'Pending'}`,
        date: employee.confirmationAuthorityReviewDate
      }
    ];

    const completedCount = steps.filter(s => s.status === 'completed').length;
    const totalCount = steps.length;
    const progress = (completedCount / totalCount) * 100;

    return (
      <div className="d-flex flex-column gap-2">
        <div className="d-flex align-items-center justify-content-between">
          <small className="text-muted">Workflow Progress</small>
          <small className="fw-bold">{completedCount}/{totalCount}</small>
        </div>
        <ProgressBar progress={progress} size="sm" showLabel={false} />
        <div className="d-flex gap-1 align-items-center justify-content-center">
          {steps.map((step, index) => (
            <div key={step.key} className="d-flex align-items-center">
              <span
                className={`badge rounded-circle ${step.status === 'completed' ? 'bg-success' : 'bg-light text-muted border'
                  }`}
                title={`${step.tooltip}${step.date ? ` - ${formatDate(step.date)}` : ''}`}
                style={{ width: '24px', height: '24px', fontSize: '10px' }}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="mx-1" style={{ width: '15px', height: '1px', backgroundColor: '#dee2e6' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const EnhancedPromotionWorkflow = ({ employee }) => {
    const steps = employee.approvalWorkflow;
    const completedCount = steps.filter(s => s.status === 'approved' || s.status === 'rejected').length;
    const totalCount = steps.length;
    const progress = (completedCount / totalCount) * 100;

    return (
      <div className="d-flex flex-column gap-2">
        <div className="d-flex align-items-center justify-content-between">
          <small className="text-muted">Approval Progress</small>
          <small className="fw-bold">{completedCount}/{totalCount}</small>
        </div>
        <ProgressBar progress={progress} size="sm" showLabel={false} />
        <div className="d-flex gap-1 align-items-center justify-content-center flex-wrap">
          {steps.map((step, index) => (
            <div key={step.id} className="d-flex align-items-center">
              <span
                className={`badge ${step.status === 'approved' ? 'bg-success' :
                  step.status === 'rejected' ? 'bg-danger' :
                    'bg-light text-muted border'
                  }`}
                title={`${step.level}: ${step.status}${step.approver ? ` by ${step.approver}` : ''}${step.date ? ` on ${formatDate(step.date)}` : ''}`}
                style={{ fontSize: '10px', padding: '4px 8px' }}
              >
                {step.level.charAt(0)}
              </span>
              {index < steps.length - 1 && (
                <small className="mx-1 text-muted" style={{ fontSize: '10px' }}>→</small>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RiskIndicator = ({ riskLevel }) => {
    const config = {
      low: { color: 'success', icon: 'heroicons:check-circle' },
      medium: { color: 'warning', icon: 'heroicons:exclamation-circle' },
      high: { color: 'danger', icon: 'heroicons:x-circle' }
    };

    const { color, icon } = config[riskLevel] || { color: 'secondary', icon: 'heroicons:question-mark-circle' };

    return (
      <div className={`d-flex align-items-center gap-1 text-${color}`}>
        <Icon icon={icon} width={16} height={16} />
        <small className="text-capitalize">{riskLevel}</small>
      </div>
    );
  };

  const EmployeeAvatar = ({ name, size = 'sm' }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const sizeClass = size === 'sm' ? 'avatar-sm' : size === 'lg' ? 'avatar-lg' : '';

    return (
      <div className={`avatar ${sizeClass} bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold`}>
        {initials}
      </div>
    );
  };

  // ---------------- FILTERING AND SORTING ----------------
  const filteredEmployees = useMemo(() => {
    let filtered = [];

    switch (activeTab) {
      case 'probation':
        filtered = probationEmployees;
        break;
      case 'confirmation':
        filtered = confirmationEmployees;
        break;
      case 'promotions':
        filtered = promotionEmployees;
        break;
      case 'buddy':
        filtered = buddies;
        break;
      default:
        filtered = [];
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchLower) ||
        emp.employeeId.toLowerCase().includes(searchLower) ||
        emp.designation.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply department filter
    if (filters.department !== 'All') {
      filtered = filtered.filter(emp => emp.department === filters.department);
    }

    // Apply location filter
    if (filters.location !== 'All') {
      filtered = filtered.filter(emp => emp.workLocation === filters.location);
    }

    // Apply status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter(emp => emp.status === filters.status || emp.confirmationStatus === filters.status);
    }

    // Apply risk filter
    if (filters.riskLevel !== 'All') {
      filtered = filtered.filter(emp => emp.riskLevel === filters.riskLevel);
    }

    // Sort if configured
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [activeTab, probationEmployees, confirmationEmployees, promotionEmployees, buddies, filters, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(startIndex, startIndex + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  // ---------------- ACTION HANDLERS ----------------
  const handleSelectRow = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(emp => emp.id));
    }
  };

  const handleBulkAction = (action) => {
    const selectedData = filteredEmployees.filter(emp => selectedRows.includes(emp.id));

    switch (action) {
      case 'send_reminder':
        alert(`Send reminders to ${selectedData.length} selected employees`);
        break;
      case 'schedule_review':
        alert(`Schedule reviews for ${selectedData.length} selected employees`);
        break;
      case 'export_data':
        alert(`Export data for ${selectedData.length} selected employees`);
        break;
      case 'assign_buddy':
        setShowBuddyAssignmentModal(true);
        break;
      default:
        break;
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // ---------------- ANALYTICS CALCULATION ----------------
  useEffect(() => {
    // Calculate probation analytics
    const probationAnalytics = {
      total: probationEmployees.length,
      inProgress: probationEmployees.filter(e => e.status === 'in_progress').length,
      atRisk: probationEmployees.filter(e => e.riskLevel === 'high').length,
      extended: probationEmployees.filter(e => e.status === 'extended').length,
      avgProgress: probationEmployees.reduce((sum, emp) => sum + calculateProgress(emp), 0) / probationEmployees.length || 0,
      endingSoon: probationEmployees.filter(e => e.daysRemaining <= 30 && e.daysRemaining > 0).length
    };

    // Calculate confirmation analytics
    const confirmationAnalytics = {
      total: confirmationEmployees.length,
      confirmed: confirmationEmployees.filter(e => e.confirmationStatus === 'confirmed').length,
      pending: confirmationEmployees.filter(e => e.confirmationStatus !== 'confirmed').length,
      overdue: confirmationEmployees.filter(e => e.daysRemaining < 0 && e.confirmationStatus !== 'confirmed').length,
      avgTimeToConfirm: 0 // You can calculate this based on actual data
    };

    // Calculate promotions analytics
    const promotionAnalytics = {
      total: promotionEmployees.length,
      approved: promotionEmployees.filter(e => e.promotionStatus === 'approved').length,
      pending: promotionEmployees.filter(e => e.promotionStatus === 'under_review').length,
      successRate: (promotionEmployees.filter(e => e.promotionStatus === 'approved').length / promotionEmployees.length) * 100 || 0,
      avgIncrease: 0 // Calculate average salary increase
    };

    // Calculate buddy analytics
    const buddyAnalytics = {
      active: buddies.filter(b => b.status === 'active').length,
      avgRating: buddies.reduce((sum, b) => sum + b.averageRating, 0) / buddies.length || 0,
      satisfaction: 0, // Calculate from feedback
      assignments: buddies.reduce((sum, b) => sum + b.newJoinerCount, 0)
    };

    setAnalytics({
      probation: probationAnalytics,
      confirmation: confirmationAnalytics,
      promotions: promotionAnalytics,
      buddy: buddyAnalytics
    });
  }, [probationEmployees, confirmationEmployees, promotionEmployees, buddies]);

  // ---------------- ENHANCED MENU ITEMS ----------------
  const menuItems = [
    {
      title: 'Dashboard',
      link: '/hr/dashboard',
      icon: 'heroicons:home'
    },
    {
      title: 'Employee Master',
      link: '/hr/employees',
      icon: 'heroicons:users'
    },
    {
      title: 'HR Operations',
      link: '/hr/operations',
      active: true,
      icon: 'heroicons:cog-6-tooth',
      children: [
        { title: 'Probation Management', link: '#probation' },
        { title: 'Employee Confirmation', link: '#confirmation' },
        { title: 'Promotions', link: '#promotions' },
        { title: 'Transfers', link: '#transfers' },
        { title: 'Exit Management', link: '#exit' }
      ]
    },
    {
      title: 'Attendance',
      link: '/hr/attendance',
      icon: 'heroicons:calendar'
    },
    {
      title: 'Leave Management',
      link: '/hr/leave',
      icon: 'heroicons:calendar-days'
    },
    {
      title: 'Payroll',
      link: '/hr/payroll',
      icon: 'heroicons:banknotes'
    },
    {
      title: 'Performance',
      link: '/hr/performance',
      icon: 'heroicons:chart-bar'
    },
    {
      title: 'Reports',
      link: '/hr/reports',
      icon: 'heroicons:document-chart-bar'
    },
    {
      title: 'Settings',
      link: '/hr/settings',
      icon: 'heroicons:cog-8-tooth'
    }
  ];

  const userInfo = {
    name: 'HR Manager',
    role: 'Human Resources',
    email: 'hr@company.com',
    avatar: 'HM'
  };

  // ---------------- ENHANCED COMPONENT ----------------
  return (
    <div
      menuItems={menuItems}
      userInfo={userInfo}
      appName="HRMS - HR Operations"
    >
      <div className="container-fluid p-4">

        {/* ENHANCED HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-2 d-flex align-items-center">
              <Icon
                icon="heroicons:arrow-trending-up"
                className="me-2"
                width={24}
                height={24}
              />
              Promotions & Career Progression
            </h5>
            <p className="text-muted mb-0">
              Manage probation, confirmation, promotions and buddy programs
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary d-flex align-items-center"
              onClick={() => setShowAnalyticsModal(true)}
            >
              <Icon icon="heroicons:chart-bar" className="me-1" />
              Analytics
            </button>
            <button
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={() => setShowReportModal(true)}
            >
              <Icon icon="heroicons:document-text" className="me-1" />
              Reports
            </button>
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={() => setShowSettingsModal(true)}
            >
              <Icon icon="heroicons:cog-6-tooth" className="me-1" />
              Settings
            </button>
          </div>
        </div>

        {/* ENHANCED TABS */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'probation' ? 'active' : ''} d-flex align-items-center`}
              onClick={() => setActiveTab('probation')}
            >
              <Icon icon="heroicons:document-search" className="me-1" />
              Probation Management
              {analytics.probation.atRisk > 0 && (
                <span className="badge bg-danger ms-2">{analytics.probation.atRisk}</span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'confirmation' ? 'active' : ''} d-flex align-items-center`}
              onClick={() => setActiveTab('confirmation')}
            >
              <Icon icon="heroicons:document-check" className="me-1" />
              Employee Confirmation
              {analytics.confirmation.overdue > 0 && (
                <span className="badge bg-danger ms-2">{analytics.confirmation.overdue}</span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'promotions' ? 'active' : ''} d-flex align-items-center`}
              onClick={() => setActiveTab('promotions')}
            >
              <Icon icon="heroicons:trophy" className="me-1" />
              Promotions
              <span className="badge bg-primary ms-2">{analytics.promotions.total}</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'buddy' ? 'active' : ''} d-flex align-items-center`}
              onClick={() => setActiveTab('buddy')}
            >
              <Icon icon="heroicons:user-group" className="me-1" />
              Buddy Program
              <span className="badge bg-success ms-2">{analytics.buddy.active}</span>
            </button>
          </li>
        </ul>

        {/* ENHANCED TOOLBAR */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <Icon icon="heroicons:magnifying-glass" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search employees..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.department}
                  onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                >
                  <option value="All">All Locations</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="All">All Status</option>
                  {activeTab === 'probation' && (
                    <>
                      <option value="in_progress">In Progress</option>
                      <option value="at_risk">At Risk</option>
                      <option value="extended">Extended</option>
                    </>
                  )}
                  {activeTab === 'confirmation' && (
                    <>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending_approval">Pending Approval</option>
                    </>
                  )}
                  {activeTab === 'promotions' && (
                    <>
                      <option value="approved">Approved</option>
                      <option value="under_review">Under Review</option>
                      <option value="rejected">Rejected</option>
                    </>
                  )}
                  {activeTab === 'buddy' && (
                    <>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </>
                  )}
                </select>
              </div>

              <div className="col-md-3">
                <div className="d-flex justify-content-end align-items-center gap-3 flex-wrap">

                  {/* View Mode Toggle */}
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn btn-outline-secondary d-flex align-items-center justify-content-center ${viewMode === 'table' ? 'active' : ''}`}
                      onClick={() => setViewMode('table')}
                    >
                      <Icon icon="heroicons:table-cells" width="18" />
                    </button>

                    <button
                      type="button"
                      className={`btn btn-outline-secondary d-flex align-items-center justify-content-center ${viewMode === 'card' ? 'active' : ''}`}
                      onClick={() => setViewMode('card')}
                    >
                      <Icon icon="heroicons:squares-2x2" width="18" />
                    </button>

                    <button
                      type="button"
                      className={`btn btn-outline-secondary d-flex align-items-center justify-content-center ${viewMode === 'timeline' ? 'active' : ''}`}
                      onClick={() => setViewMode('timeline')}
                    >
                      <Icon icon="heroicons:chart-bar" width="18" />
                    </button>
                  </div>

                  {/* Bulk Action Button */}
                  <button
                    type="button"
                    className="btn btn-outline-primary d-flex align-items-center"
                    onClick={() => setShowBulkActionModal(true)}
                    disabled={selectedRows.length === 0}
                  >
                    <Icon icon="heroicons:check-circle" width="18" className="me-2" />
                    Bulk Actions ({selectedRows.length})
                  </button>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ENHANCED STATISTICS CARDS */}
        <div className="row g-3 mb-4">
          {activeTab === 'probation' && (
            <>
              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-primary bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-primary mb-1">
                      <Icon icon="heroicons:users" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Total Probation</div>
                    <div className="fw-bold fs-5">{analytics.probation.total}</div>
                    <div className="small text-muted">{analytics.probation.inProgress} in progress</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-danger bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-danger mb-1">
                      <Icon icon="heroicons:exclamation-triangle" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">At Risk</div>
                    <div className="fw-bold fs-5">{analytics.probation.atRisk}</div>
                    <div className="small text-muted">Require attention</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-warning bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-warning mb-1">
                      <Icon icon="heroicons:clock" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Ending Soon</div>
                    <div className="fw-bold fs-5">{analytics.probation.endingSoon}</div>
                    <div className="small text-muted">Within 30 days</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-info bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-info mb-1">
                      <Icon icon="heroicons:arrows-pointing-out" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Extended</div>
                    <div className="fw-bold fs-5">{analytics.probation.extended}</div>
                    <div className="small text-muted">Probation extended</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-success bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-success mb-1">
                      <Icon icon="heroicons:chart-bar" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Avg Progress</div>
                    <div className="fw-bold fs-5">{analytics.probation.avgProgress.toFixed(1)}%</div>
                    <div className="small text-muted">Overall progress</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-secondary bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-secondary mb-1">
                      <Icon icon="heroicons:calendar-days" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Reviews Due</div>
                    <div className="fw-bold fs-5">{probationEmployees.filter(e => e.nextReviewDate && new Date(e.nextReviewDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}</div>
                    <div className="small text-muted">Next 7 days</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'confirmation' && (
            <>
              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-primary bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-primary mb-1">
                      <Icon icon="heroicons:user-plus" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">For Confirmation</div>
                    <div className="fw-bold fs-5">{analytics.confirmation.total}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-success bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-success mb-1">
                      <Icon icon="heroicons:check-circle" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Confirmed</div>
                    <div className="fw-bold fs-5">{analytics.confirmation.confirmed}</div>
                    <div className="small text-muted">{((analytics.confirmation.confirmed / analytics.confirmation.total) * 100 || 0).toFixed(0)}% rate</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-warning bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-warning mb-1">
                      <Icon icon="heroicons:clock" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Pending</div>
                    <div className="fw-bold fs-5">{analytics.confirmation.pending}</div>
                    <div className="small text-muted">Awaiting approval</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-danger bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-danger mb-1">
                      <Icon icon="heroicons:exclamation-circle" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Overdue</div>
                    <div className="fw-bold fs-5">{analytics.confirmation.overdue}</div>
                    <div className="small text-muted">Past due date</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-info bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-info mb-1">
                      <Icon icon="heroicons:rocket-launch" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Auto-Triggered</div>
                    <div className="fw-bold fs-5">{confirmationEmployees.filter(e => e.autoTriggered).length}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-secondary bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-secondary mb-1">
                      <Icon icon="heroicons:envelope" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Letters Sent</div>
                    <div className="fw-bold fs-5">{confirmationEmployees.filter(e => e.confirmationLetterSent).length}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'promotions' && (
            <>
              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-primary bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-primary mb-1">
                      <Icon icon="heroicons:trophy" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Nominations</div>
                    <div className="fw-bold fs-5">{analytics.promotions.total}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-success bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-success mb-1">
                      <Icon icon="heroicons:check-circle" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Approved</div>
                    <div className="fw-bold fs-5">{analytics.promotions.approved}</div>
                    <div className="small text-muted">{analytics.promotions.successRate.toFixed(0)}% success</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-warning bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-warning mb-1">
                      <Icon icon="heroicons:clock" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Under Review</div>
                    <div className="fw-bold fs-5">{analytics.promotions.pending}</div>
                    <div className="small text-muted">In committee review</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-info bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-info mb-1">
                      <Icon icon="heroicons:chart-bar" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Avg Salary Inc</div>
                    <div className="fw-bold fs-5">18.5%</div>
                    <div className="small text-muted">Average increase</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-secondary bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-secondary mb-1">
                      <Icon icon="heroicons:document-text" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Letters Generated</div>
                    <div className="fw-bold fs-5">{promotionEmployees.filter(e => e.promotionLetterGenerated).length}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-danger bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-danger mb-1">
                      <Icon icon="heroicons:x-circle" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Rejected</div>
                    <div className="fw-bold fs-5">{promotionEmployees.filter(e => e.promotionStatus === 'rejected').length}</div>
                    <div className="small text-muted">Not approved</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'buddy' && (
            <>
              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-primary bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-primary mb-1">
                      <Icon icon="heroicons:user-group" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Active Buddies</div>
                    <div className="fw-bold fs-5">{analytics.buddy.active}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-success bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-success mb-1">
                      <Icon icon="heroicons:star" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Avg Rating</div>
                    <div className="fw-bold fs-5">{analytics.buddy.avgRating.toFixed(1)}/5</div>
                    <div className="small text-muted">Buddy performance</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-info bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-info mb-1">
                      <Icon icon="heroicons:user-plus" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Assignments</div>
                    <div className="fw-bold fs-5">{analytics.buddy.assignments}</div>
                    <div className="small text-muted">Total assignments</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-warning bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-warning mb-1">
                      <Icon icon="heroicons:chat-bubble-left-right" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Feedback</div>
                    <div className="fw-bold fs-5">{buddies.reduce((sum, b) => sum + b.feedback.length, 0)}</div>
                    <div className="small text-muted">Feedback collected</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-secondary bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-secondary mb-1">
                      <Icon icon="heroicons:chart-bar" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Avg Experience</div>
                    <div className="fw-bold fs-5">3.5 yrs</div>
                    <div className="small text-muted">Buddy experience</div>
                  </div>
                </div>
              </div>

              <div className="col-md-2 col-6">
                <div className="card border-0 shadow-sm h-100 bg-danger bg-opacity-10">
                  <div className="card-body text-center">
                    <div className="text-danger mb-1">
                      <Icon icon="heroicons:exclamation-triangle" width={24} height={24} />
                    </div>
                    <div className="fw-bold text-secondary-light small">Capacity Used</div>
                    <div className="fw-bold fs-5">75%</div>
                    <div className="small text-muted">Buddy capacity</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* QUICK ACTIONS BAR */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong className="me-2">
                  {activeTab === 'probation' && 'Probation Quick Actions'}
                  {activeTab === 'confirmation' && 'Confirmation Quick Actions'}
                  {activeTab === 'promotions' && 'Promotion Quick Actions'}
                  {activeTab === 'buddy' && 'Buddy Program Quick Actions'}
                </strong>
                <span className="text-muted small">
                  Common management tasks
                </span>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {activeTab === 'probation' && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => alert('Auto-schedule reviews for all employees')}
                    >
                      <Icon icon="heroicons:calendar" className="me-1" />
                      Auto-Schedule
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => alert('Send milestone reminders')}
                    >
                      <Icon icon="heroicons:bell" className="me-1" />
                      Send Reminders
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => setShowBuddyAssignmentModal(true)}
                    >
                      <Icon icon="heroicons:user-plus" className="me-1" />
                      Assign Buddies
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => setShowImportModal(true)}
                    >
                      <Icon icon="heroicons:arrow-up-tray" className="me-1" />
                      Import Data
                    </button>
                  </>
                )}

                {activeTab === 'confirmation' && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => alert('Auto-trigger confirmation process')}
                    >
                      <Icon icon="heroicons:play" className="me-1" />
                      Auto-Trigger
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => alert('Send approval reminders')}
                    >
                      <Icon icon="heroicons:envelope" className="me-1" />
                      Send Reminders
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => setShowBulkActionModal(true)}
                    >
                      <Icon icon="heroicons:check-circle" className="me-1" />
                      Bulk Process
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => alert('Generate confirmation letters')}
                    >
                      <Icon icon="heroicons:document-text" className="me-1" />
                      Generate Letters
                    </button>
                  </>
                )}

                {activeTab === 'promotions' && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => setShowPromotionNominationModal(true)}
                    >
                      <Icon icon="heroicons:plus" className="me-1" />
                      New Nomination
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => alert('Run eligibility check')}
                    >
                      <Icon icon="heroicons:check-circle" className="me-1" />
                      Check Eligibility
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => alert('Schedule committee review')}
                    >
                      <Icon icon="heroicons:calendar" className="me-1" />
                      Schedule Review
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => alert('Generate promotion letters')}
                    >
                      <Icon icon="heroicons:document-text" className="me-1" />
                      Generate Letters
                    </button>
                  </>
                )}

                {activeTab === 'buddy' && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => setShowBuddyAssignmentModal(true)}
                    >
                      <Icon icon="heroicons:user-plus" className="me-1" />
                      Assign Buddies
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => alert('Auto-assign based on rules')}
                    >
                      <Icon icon="heroicons:cog" className="me-1" />
                      Auto-Assign
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => alert('Collect feedback')}
                    >
                      <Icon icon="heroicons:chat-bubble-left-right" className="me-1" />
                      Collect Feedback
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => setShowReportModal(true)}
                    >
                      <Icon icon="heroicons:chart-bar" className="me-1" />
                      Program Report
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DATA VIEW - TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="card border-0 shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    {activeTab === 'probation' && (
                      <>
                        <th style={{ width: '40px' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedRows.length === paginatedData.length}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th style={{ minWidth: '250px' }}>Employee Details</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Probation Status</th>
                        <th className="text-center" style={{ minWidth: '120px' }}>Review Milestones</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Progress</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Time Remaining</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Risk Level</th>
                        <th className="text-center" style={{ minWidth: '250px' }}>Actions</th>
                      </>
                    )}
                    {activeTab === 'confirmation' && (
                      <>
                        <th style={{ width: '40px' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedRows.length === paginatedData.length}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th style={{ minWidth: '250px' }}>Employee Details</th>
                        <th className="text-center" style={{ minWidth: '120px' }}>Confirmation Status</th>
                        <th className="text-center" style={{ minWidth: '150px' }}>Workflow Progress</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Time Status</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Rating</th>
                        <th className="text-center" style={{ minWidth: '250px' }}>Actions</th>
                      </>
                    )}
                    {activeTab === 'promotions' && (
                      <>
                        <th style={{ width: '40px' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedRows.length === paginatedData.length}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th style={{ minWidth: '250px' }}>Employee Details</th>
                        <th className="text-center" style={{ minWidth: '120px' }}>Current → Proposed</th>
                        <th className="text-center" style={{ minWidth: '150px' }}>Approval Workflow</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Status</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Salary Impact</th>
                        <th className="text-center" style={{ minWidth: '250px' }}>Actions</th>
                      </>
                    )}
                    {activeTab === 'buddy' && (
                      <>
                        <th style={{ width: '40px' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedRows.length === paginatedData.length}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th style={{ minWidth: '200px' }}>Buddy Details</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Status</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Assigned New Joiners</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Experience</th>
                        <th className="text-center" style={{ minWidth: '100px' }}>Rating</th>
                        <th className="text-center" style={{ minWidth: '150px' }}>Capacity</th>
                        <th className="text-center" style={{ minWidth: '200px' }}>Actions</th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'buddy' ? 8 : 7} className="text-center py-5">
                        <div className="text-muted">
                          <Icon icon="heroicons:inbox" width={48} height={48} className="mb-3" />
                          <p>No data found with current filters</p>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setFilters({
                              search: '',
                              department: 'All',
                              location: 'All',
                              status: 'All',
                              dateRange: 'All',
                              riskLevel: 'All',
                              manager: 'All'
                            })}
                          >
                            Clear Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item) => (
                      <tr key={item.id} className={selectedRows.includes(item.id) ? 'table-active' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedRows.includes(item.id)}
                            onChange={() => handleSelectRow(item.id)}
                          />
                        </td>

                        {activeTab === 'probation' && (
                          <>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <EmployeeAvatar name={item.name} />
                                <div>
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <strong className="d-block">{item.name}</strong>
                                    <small className="badge bg-secondary">{item.employeeId}</small>
                                  </div>
                                  <small className="text-muted d-block">{item.designation}</small>
                                  <div className="d-flex gap-2 align-items-center">
                                    <small className="text-muted">{item.department}</small>
                                    <small className="text-muted">•</small>
                                    <small className="text-muted">{item.workLocation}</small>
                                  </div>
                                  <div className="small mt-1">
                                    <Icon icon="heroicons:envelope" className="me-1" width={12} height={12} />
                                    <small className="text-muted">{item.email}</small>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="text-center">
                              {getStatusBadge(item.status)}
                            </td>

                            <td className="text-center">
                              <ReviewMilestones employee={item} />
                            </td>

                            <td>
                              <ProgressBar progress={calculateProgress(item)} />
                            </td>

                            <td className="text-center">
                              <div className={`fw-bold ${item.daysRemaining <= 0 ? 'text-danger' :
                                item.daysRemaining <= 7 ? 'text-danger' :
                                  item.daysRemaining <= 30 ? 'text-warning' : 'text-success'
                                }`}>
                                {item.daysRemaining <= 0 ? Math.abs(item.daysRemaining) + ' days overdue' : item.daysRemaining + ' days'}
                              </div>
                              <div className="small text-muted">
                                Ends: {formatDate(item.probationEndDate)}
                              </div>
                            </td>

                            <td className="text-center">
                              <RiskIndicator riskLevel={item.riskLevel} />
                            </td>

                            <td className="text-center align-middle">
                              <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">

                                {/* View */}
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    setShowViewModal(true);
                                  }}

                                  title="View Details"
                                >
                                  <Icon icon="heroicons:eye" width="16" />
                                </button>

                                {/* Review */}
                                <button
                                  type="button"
                                  className="btn btn-outline-info btn-sm d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    setShowReviewModal(true);
                                  }}

                                  title="Conduct Review"
                                >
                                  <Icon icon="heroicons:clipboard-document-check" width="16" />
                                </button>

                                {/* Extend */}
                                <button
                                  type="button"
                                  className="btn btn-outline-warning btn-sm d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    setShowExtendModal(true);
                                  }}

                                  title="Extend Probation"
                                >
                                  <Icon icon="heroicons:arrows-pointing-out" width="16" />
                                </button>

                                {/* Early Confirm */}
                                <button
                                  type="button"
                                  className="btn btn-outline-success btn-sm d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    setShowEarlyConfirmModal(true);
                                  }}

                                  title="Early Confirmation"
                                >
                                  <Icon icon="heroicons:check-circle" width="16" />
                                </button>

                                {/* Dropdown */}
                                <div className="dropdown">
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
                                    data-bs-toggle="dropdown"
                                  >
                                    <Icon icon="heroicons:ellipsis-vertical" width="16" />
                                  </button>

                                  <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                                    <li>
                                      <button
                                        className="dropdown-item d-flex align-items-center gap-2"
                                        onClick={() => {
                                          setSelectedEmployee(item);
                                          setShowEmailModal(true);
                                        }}
                                      >
                                        <Icon icon="heroicons:envelope" width="16" />
                                        Send Email
                                      </button>
                                    </li>

                                    <li>
                                      <button
                                        className="dropdown-item d-flex align-items-center gap-2"
                                        onClick={() => {
                                          setSelectedEmployee(item);
                                          setShowNoteModal(true);
                                        }}
                                      >
                                        <Icon icon="heroicons:chat-bubble-left" width="16" />
                                        Add Note
                                      </button>
                                    </li>

                                    <li><hr className="dropdown-divider" /></li>

                                    <li>
                                      <button
                                        className="dropdown-item text-danger d-flex align-items-center gap-2"
                                        onClick={() => {
                                          setSelectedEmployee(item);
                                          setShowTerminationModal(true);
                                        }}
                                      >
                                        <Icon icon="heroicons:x-circle" width="16" />
                                        Terminate
                                      </button>
                                    </li>
                                  </ul>
                                </div>

                              </div>
                            </td>

                          </>
                        )}

                        {activeTab === 'confirmation' && (
                          <>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <EmployeeAvatar name={item.name} />
                                <div>
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <strong className="d-block">{item.name}</strong>
                                    <small className="badge bg-secondary">{item.employeeId}</small>
                                  </div>
                                  <small className="text-muted d-block">{item.designation}</small>
                                  <div className="d-flex gap-2 align-items-center">
                                    <small className="text-muted">{item.department}</small>
                                    <small className="text-muted">•</small>
                                    <small className="text-muted">{item.workLocation}</small>
                                  </div>
                                  <div className="small mt-1">
                                    <small className="text-muted">Joined: {formatDate(item.joiningDate)}</small>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="text-center">
                              {getStatusBadge(item.confirmationStatus)}
                            </td>

                            <td>
                              <EnhancedConfirmationWorkflow employee={item} />
                            </td>

                            <td className="text-center">
                              <div className={`fw-bold ${item.daysRemaining <= 0 ? 'text-danger' :
                                item.daysRemaining <= 7 ? 'text-danger' :
                                  item.daysRemaining <= 30 ? 'text-warning' : 'text-success'
                                }`}>
                                {item.daysRemaining <= 0 ? Math.abs(item.daysRemaining) + ' days overdue' : item.daysRemaining + ' days'}
                              </div>
                              <div className="small text-muted">
                                Due: {formatDate(item.confirmationDueDate)}
                              </div>
                            </td>

                            <td className="text-center">
                              <RatingStars rating={Math.floor(item.performanceScore)} />
                              <small className="text-muted d-block mt-1">{item.currentRating}</small>
                            </td>

                            <td className="text-center">
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    setShowDetailModal(true);
                                  }}
                                  title="View Details"
                                >
                                  <Icon icon="heroicons:eye" />
                                </button>

                                {!item.managerRecommendation && (
                                  <button
                                    className="btn btn-outline-warning"
                                    onClick={() => {
                                      setSelectedEmployee(item);
                                      alert('Initiate manager review');
                                    }}
                                    title="Manager Review"
                                  >
                                    <Icon icon="heroicons:user" />
                                  </button>
                                )}

                                {item.managerRecommendation && !item.hrRecommendation && (
                                  <button
                                    className="btn btn-outline-info"
                                    onClick={() => {
                                      setSelectedEmployee(item);
                                      alert('Initiate HR review');
                                    }}
                                    title="HR Review"
                                  >
                                    <Icon icon="heroicons:shield-check" />
                                  </button>
                                )}

                                {item.hrRecommendation && !item.confirmationAuthorityApproval && (
                                  <button
                                    className="btn btn-outline-success"
                                    onClick={() => {
                                      setSelectedEmployee(item);
                                      setShowConfirmationWorkflowModal(true);
                                    }}
                                    title="Authority Approval"
                                  >
                                    <Icon icon="heroicons:lock-closed" />
                                  </button>
                                )}

                                <div className="dropdown">
                                  <button
                                    className="btn btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                  >
                                    <Icon icon="heroicons:ellipsis-vertical" />
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button className="dropdown-item" onClick={() => alert('Send reminder')}>
                                        <Icon icon="heroicons:bell" className="me-2" />
                                        Send Reminder
                                      </button>
                                    </li>
                                    <li>
                                      <button className="dropdown-item" onClick={() => alert('Generate confirmation letter')}>
                                        <Icon icon="heroicons:document-text" className="me-2" />
                                        Generate Letter
                                      </button>
                                    </li>
                                    <li>
                                      <button className="dropdown-item" onClick={() => alert('View probation reviews')}>
                                        <Icon icon="heroicons:clipboard-document-list" className="me-2" />
                                        View Reviews
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                          </>
                        )}

                        {activeTab === 'promotions' && (
                          <>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <EmployeeAvatar name={item.name} />
                                <div>
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <strong className="d-block">{item.name}</strong>
                                    <small className="badge bg-secondary">{item.employeeId}</small>
                                  </div>
                                  <small className="text-muted d-block">{item.designation}</small>
                                  <div className="d-flex gap-2 align-items-center">
                                    <small className="text-muted">{item.department}</small>
                                    <small className="text-muted">•</small>
                                    <small className="text-muted">{item.workLocation}</small>
                                  </div>
                                  <div className="small mt-1">
                                    <small className="text-muted">Tenure: {item.tenure}</small>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="text-center">
                              <div className="fw-bold">
                                <span className="text-secondary">{item.currentGrade}</span>
                                <Icon icon="heroicons:arrow-right" className="mx-1" width={16} height={16} />
                                <span className="text-primary">{item.proposedGrade}</span>
                              </div>
                              <div className="small text-muted">
                                {item.currentDesignation} → {item.proposedDesignation}
                              </div>
                            </td>

                            <td>
                              <EnhancedPromotionWorkflow employee={item} />
                            </td>

                            <td className="text-center">
                              {getStatusBadge(item.promotionStatus)}
                              <div className="small text-muted mt-1">
                                {item.eligibilityStatus === 'eligible' ? (
                                  <span className="text-success">✓ Eligible</span>
                                ) : (
                                  <span className="text-danger">✗ Not Eligible</span>
                                )}
                              </div>
                            </td>

                            <td className="text-center">
                              <div className="fw-bold text-success">
                                +{Math.round((parseInt(item.proposedSalary.replace(/[^0-9]/g, '')) - parseInt(item.currentSalary.replace(/[^0-9]/g, ''))) / parseInt(item.currentSalary.replace(/[^0-9]/g, '')) * 100)}%
                              </div>
                              <div className="small text-muted">
                                {item.currentSalary} → {item.proposedSalary}
                              </div>
                            </td>

                            <td className="text-center">
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    setShowDetailModal(true);
                                  }}
                                  title="View Details"
                                >
                                  <Icon icon="heroicons:eye" />
                                </button>

                                <button
                                  className="btn btn-outline-info"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    setShowPromotionReviewModal(true);
                                  }}
                                  title="Review Nomination"
                                >
                                  <Icon icon="heroicons:clipboard-document-check" />
                                </button>

                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    alert('Approve promotion');
                                  }}
                                  title="Approve"
                                  disabled={item.promotionStatus === 'approved'}
                                >
                                  <Icon icon="heroicons:check-circle" />
                                </button>

                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    alert('Reject promotion');
                                  }}
                                  title="Reject"
                                  disabled={item.promotionStatus === 'rejected'}
                                >
                                  <Icon icon="heroicons:x-circle" />
                                </button>

                                <div className="dropdown">
                                  <button
                                    className="btn btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                  >
                                    <Icon icon="heroicons:ellipsis-vertical" />
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button className="dropdown-item" onClick={() => alert('View eligibility criteria')}>
                                        <Icon icon="heroicons:clipboard-document-list" className="me-2" />
                                        View Eligibility
                                      </button>
                                    </li>
                                    <li>
                                      <button className="dropdown-item" onClick={() => alert('Generate promotion letter')}>
                                        <Icon icon="heroicons:document-text" className="me-2" />
                                        Generate Letter
                                      </button>
                                    </li>
                                    <li>
                                      <button className="dropdown-item" onClick={() => alert('Schedule announcement')}>
                                        <Icon icon="heroicons:megaphone" className="me-2" />
                                        Schedule Announcement
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                          </>
                        )}

                        {activeTab === 'buddy' && (
                          <>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <EmployeeAvatar name={item.name} />
                                <div>
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <strong className="d-block">{item.name}</strong>
                                    <small className="badge bg-secondary">{item.buddyId}</small>
                                  </div>
                                  <small className="text-muted d-block">{item.designation}</small>
                                  <small className="text-muted">{item.department}</small>
                                  <div className="small mt-1">
                                    <Icon icon="heroicons:envelope" className="me-1" width={12} height={12} />
                                    <small className="text-muted">{item.email}</small>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="text-center">
                              {item.status === 'active' ? (
                                <span className="badge bg-success-subtle text-success border border-success-subtle">
                                  Active
                                </span>
                              ) : (
                                <span className="badge bg-secondary-subtle text-secondary border">
                                  Inactive
                                </span>
                              )}
                            </td>

                            <td className="text-center">
                              <div className="fw-bold">{item.newJoinerCount}</div>
                              <div className="small text-muted">
                                {item.assignedNewJoiners.slice(0, 2).map((nj, idx) => (
                                  <span key={nj.id} className="badge bg-info-subtle text-info me-1">
                                    {nj.id}
                                  </span>
                                ))}
                                {item.newJoinerCount > 2 && (
                                  <span className="text-muted">+{item.newJoinerCount - 2} more</span>
                                )}
                              </div>
                            </td>

                            <td className="text-center">
                              <div className="fw-bold">{item.experience}</div>
                              <div className="small text-muted">
                                Joined {formatDate(item.joinDate)}
                              </div>
                            </td>

                            <td className="text-center">
                              <RatingStars rating={Math.floor(item.averageRating)} />
                              <div className="small text-muted">
                                {item.averageRating.toFixed(1)}/5
                              </div>
                            </td>

                            <td className="text-center">
                              <ProgressBar progress={parseInt(item.currentLoad)} />
                              <div className="small text-muted">
                                {item.currentLoad} capacity
                              </div>
                            </td>

                            <td className="text-center">
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    setShowDetailModal(true);
                                  }}
                                  title="View Details"
                                >
                                  <Icon icon="heroicons:eye" />
                                </button>

                                <button
                                  className="btn btn-outline-info"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    alert('Assign new joiner');
                                  }}
                                  title="Assign New Joiner"
                                >
                                  <Icon icon="heroicons:user-plus" />
                                </button>

                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => {
                                    setSelectedEmployee(item);
                                    alert('Collect feedback');
                                  }}
                                  title="Collect Feedback"
                                >
                                  <Icon icon="heroicons:chat-bubble-left-right" />
                                </button>

                                <div className="dropdown">
                                  <button
                                    className="btn btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                  >
                                    <Icon icon="heroicons:ellipsis-vertical" />
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button className="dropdown-item" onClick={() => alert('View feedback')}>
                                        <Icon icon="heroicons:chat-bubble-left" className="me-2" />
                                        View Feedback
                                      </button>
                                    </li>
                                    <li>
                                      <button className="dropdown-item" onClick={() => alert('Update responsibilities')}>
                                        <Icon icon="heroicons:clipboard-document-list" className="me-2" />
                                        Update Responsibilities
                                      </button>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                      <button
                                        className="dropdown-item text-danger"
                                        onClick={() => {
                                          setSelectedEmployee(item);
                                          alert('Deactivate buddy');
                                        }}
                                      >
                                        <Icon icon="heroicons:x-circle" className="me-2" />
                                        Deactivate
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {filteredEmployees.length > 0 && (
              <div className="card-footer border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">
                      Showing {Math.min((currentPage - 1) * pageSize + 1, filteredEmployees.length)} to {Math.min(currentPage * pageSize, filteredEmployees.length)} of {filteredEmployees.length} entries
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <small className="text-muted">Rows per page:</small>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: '70px' }}
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </select>
                    </div>
                    <nav>
                      <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(pageNum)}
                              >
                                {pageNum}
                              </button>
                            </li>
                          );
                        })}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DATA VIEW - CARD VIEW */}
        {viewMode === 'card' && (
          <div className="row g-3">
            {paginatedData.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="text-muted">
                  <Icon icon="heroicons:inbox" width={48} height={48} className="mb-3" />
                  <p>No data found with current filters</p>
                </div>
              </div>
            ) : (
              paginatedData.map((item) => (
                <div key={item.id} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      {activeTab === 'probation' && (
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center gap-3">
                              <EmployeeAvatar name={item.name} />
                              <div>
                                <h6 className="mb-0">{item.name}</h6>
                                <small className="text-muted">{item.designation}</small>
                              </div>
                            </div>
                            {getStatusBadge(item.status)}
                          </div>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <small className="text-muted">Progress</small>
                              <small className="fw-bold">{calculateProgress(item).toFixed(0)}%</small>
                            </div>
                            <ProgressBar progress={calculateProgress(item)} />
                          </div>

                          <div className="row g-2 mb-3">
                            <div className="col-6">
                              <small className="text-muted d-block">Department</small>
                              <small className="fw-bold">{item.department}</small>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Location</small>
                              <small className="fw-bold">{item.workLocation}</small>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Days Remaining</small>
                              <small className={`fw-bold ${item.daysRemaining <= 0 ? 'text-danger' :
                                item.daysRemaining <= 7 ? 'text-danger' :
                                  item.daysRemaining <= 30 ? 'text-warning' : 'text-success'
                                }`}>
                                {item.daysRemaining}
                              </small>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Risk Level</small>
                              <RiskIndicator riskLevel={item.riskLevel} />
                            </div>
                          </div>

                          <div className="d-flex justify-content-between">
                            <ReviewMilestones employee={item} />
                            <div className="btn-group">
                              <button className="btn btn-sm btn-outline-primary">
                                <Icon icon="heroicons:eye" />
                              </button>
                              <button className="btn btn-sm btn-outline-success">
                                <Icon icon="heroicons:pencil" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showViewModal && selectedEmployee && (
          <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Employee Details</h5>
                  <button className="btn-close" onClick={() => setShowViewModal(false)} />
                </div>

                <div className="modal-body">
                  <p><strong>Name:</strong> {selectedEmployee.name}</p>
                  <p><strong>Department:</strong> {selectedEmployee.department}</p>
                  <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showReviewModal && selectedEmployee && (
          <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Conduct Review</h5>
                  <button className="btn-close" onClick={() => setShowReviewModal(false)} />
                </div>

                <div className="modal-body">
                  <label className="form-label">Rating</label>
                  <select className="form-select">
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Average</option>
                    <option>Poor</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>Cancel</button>
                  <button className="btn btn-info">Submit</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showExtendModal && selectedEmployee && (
          <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Extend Probation</h5>
                  <button className="btn-close" onClick={() => setShowExtendModal(false)} />
                </div>

                <div className="modal-body">
                  <label className="form-label">Extension Days</label>
                  <input type="number" className="form-control" />
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowExtendModal(false)}>Cancel</button>
                  <button className="btn btn-warning">Extend</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEarlyConfirmModal && selectedEmployee && (
          <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Early Confirmation</h5>
                  <button className="btn-close btn-close-white" onClick={() => setShowEarlyConfirmModal(false)} />
                </div>

                <div className="modal-body">
                  <p>Are you sure you want to confirm <strong>{selectedEmployee.name}</strong> early?</p>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowEarlyConfirmModal(false)}>Cancel</button>
                  <button className="btn btn-success">Confirm</button>
                </div>
              </div>
            </div>
          </div>
        )}


        {showEmailModal && selectedEmployee && (
          <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">
                    Send Email - {selectedEmployee.name}
                  </h5>
                  <button className="btn-close" onClick={() => setShowEmailModal(false)} />
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input type="text" className="form-control" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows="4" />
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowEmailModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary">
                    Send
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}


        {showNoteModal && selectedEmployee && (
          <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">
                    Add Note - {selectedEmployee.name}
                  </h5>
                  <button className="btn-close" onClick={() => setShowNoteModal(false)} />
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Note</label>
                    <textarea className="form-control" rows="4" />
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowNoteModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-success">
                    Save Note
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PromotionsCareer;