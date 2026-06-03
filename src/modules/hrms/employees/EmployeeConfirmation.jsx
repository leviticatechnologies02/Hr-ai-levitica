import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import 'bootstrap/dist/css/bootstrap.min.css';


const EmployeeConfirmation = () => {
  // ---------------- INITIAL DATA ----------------
  const initialEmployees = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Rajesh Kumar',
      designation: 'Software Engineer',
      department: 'Engineering',
      manager: 'Priya Sharma',
      hrBusinessPartner: 'Anita Verma',
      joiningDate: '2024-01-15',
      confirmationDueDate: '2024-04-15',
      probationPeriod: '90',
      daysRemaining: 10,
      status: 'pending_review',
      riskLevel: 'low',
      confirmationEligibility: 'eligible',
      review30: { completed: true, date: '2024-02-15', rating: 'Exceeds Expectations' },
      review60: { completed: true, date: '2024-03-15', rating: 'Meets Expectations' },
      review90: { completed: true, date: '2024-04-01', rating: 'Meets Expectations' },
      currentRating: 'Meets Expectations',
      nextReviewDate: '2024-04-01',
      contactEmail: 'rajesh@company.com',
      contactPhone: '+91-9876543210',
      lastReviewDate: '2024-03-15',
      extensionCount: 0,
      workLocation: 'Bangalore',
      employmentType: 'Permanent',
      salary: '₹8,50,000',
      skills: ['React', 'Node.js', 'MongoDB'],
      trainingCompleted: ['Orientation', 'Code of Conduct', 'Security Training'],
      managerRecommendation: 'recommended',
      managerComments: 'Excellent performance throughout probation period.',
      hrRecommendation: 'pending',
      hrComments: '',
      departmentHeadApproval: 'pending',
      confirmationAuthority: 'pending',
      confirmationDate: null,
      confirmationLetterGenerated: false,
      confirmationEffectiveDate: null,
      confirmationStatus: 'in_progress'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      name: 'Sneha Patel',
      designation: 'HR Executive',
      department: 'Human Resources',
      manager: 'Rahul Mehta',
      hrBusinessPartner: 'Anita Verma',
      joiningDate: '2024-02-01',
      confirmationDueDate: '2024-05-01',
      probationPeriod: '90',
      daysRemaining: 45,
      status: 'in_progress',
      riskLevel: 'low',
      confirmationEligibility: 'eligible',
      review30: { completed: true, date: '2024-03-03', rating: 'Exceeds Expectations' },
      review60: { completed: false, date: '2024-04-01', rating: null },
      review90: { completed: false, date: '2024-05-01', rating: null },
      currentRating: 'Exceeds Expectations',
      nextReviewDate: '2024-04-01',
      contactEmail: 'sneha@company.com',
      contactPhone: '+91-9876543211',
      lastReviewDate: '2024-03-03',
      extensionCount: 0,
      workLocation: 'Mumbai',
      employmentType: 'Permanent',
      salary: '₹6,00,000',
      skills: ['Recruitment', 'Employee Relations', 'HR Policies'],
      trainingCompleted: ['Orientation', 'POSH Training'],
      managerRecommendation: 'pending',
      managerComments: '',
      hrRecommendation: 'pending',
      hrComments: '',
      departmentHeadApproval: 'pending',
      confirmationAuthority: 'pending',
      confirmationDate: null,
      confirmationLetterGenerated: false,
      confirmationEffectiveDate: null,
      confirmationStatus: 'pending_review'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      name: 'Amit Singh',
      designation: 'Sales Executive',
      department: 'Sales',
      manager: 'Anita Desai',
      hrBusinessPartner: 'Rohit Sharma',
      joiningDate: '2023-12-01',
      confirmationDueDate: '2024-03-01',
      probationPeriod: '90',
      daysRemaining: -5,
      status: 'overdue',
      riskLevel: 'high',
      confirmationEligibility: 'conditional',
      review30: { completed: true, date: '2023-12-31', rating: 'Meets Expectations' },
      review60: { completed: true, date: '2024-01-30', rating: 'Needs Improvement' },
      review90: { completed: true, date: '2024-02-29', rating: 'Needs Improvement' },
      currentRating: 'Needs Improvement',
      nextReviewDate: '2024-03-25',
      contactEmail: 'amit@company.com',
      contactPhone: '+91-9876543212',
      lastReviewDate: '2024-02-29',
      extensionCount: 1,
      extendedTo: '2024-04-01',
      workLocation: 'Delhi',
      employmentType: 'Permanent',
      salary: '₹7,00,000',
      skills: ['Sales', 'Negotiation', 'CRM'],
      trainingCompleted: ['Orientation', 'Sales Training'],
      managerRecommendation: 'not_recommended',
      managerComments: 'Performance below expectations. Needs additional training.',
      hrRecommendation: 'pending',
      hrComments: '',
      departmentHeadApproval: 'pending',
      confirmationAuthority: 'pending',
      confirmationDate: null,
      confirmationLetterGenerated: false,
      confirmationEffectiveDate: null,
      confirmationStatus: 'requires_extension'
    },
    {
      id: 4,
      employeeId: 'EMP004',
      name: 'Priya Nair',
      designation: 'Marketing Manager',
      department: 'Marketing',
      manager: 'Vikram Joshi',
      hrBusinessPartner: 'Rohit Sharma',
      joiningDate: '2024-01-01',
      confirmationDueDate: '2024-04-01',
      probationPeriod: '90',
      daysRemaining: 15,
      status: 'under_review',
      riskLevel: 'medium',
      confirmationEligibility: 'eligible',
      review30: { completed: false, date: null, rating: null },
      review60: { completed: true, date: '2024-02-20', rating: 'Unsatisfactory' },
      review90: { completed: false, date: null, rating: null },
      currentRating: 'Unsatisfactory',
      nextReviewDate: '2024-03-20',
      contactEmail: 'priya@company.com',
      contactPhone: '+91-9876543213',
      lastReviewDate: '2024-02-20',
      extensionCount: 0,
      workLocation: 'Chennai',
      employmentType: 'Permanent',
      salary: '₹9,00,000',
      skills: ['Digital Marketing', 'Brand Management', 'SEO'],
      trainingCompleted: ['Orientation', 'Marketing Fundamentals'],
      managerRecommendation: 'pending',
      managerComments: '',
      hrRecommendation: 'pending',
      hrComments: '',
      departmentHeadApproval: 'pending',
      confirmationAuthority: 'pending',
      confirmationDate: null,
      confirmationLetterGenerated: false,
      confirmationEffectiveDate: null,
      confirmationStatus: 'under_review'
    },
    {
      id: 5,
      employeeId: 'EMP005',
      name: 'Suresh Reddy',
      designation: 'QA Engineer',
      department: 'Quality Assurance',
      manager: 'Neha Gupta',
      hrBusinessPartner: 'Anita Verma',
      joiningDate: '2024-02-15',
      confirmationDueDate: '2024-05-15',
      probationPeriod: '90',
      daysRemaining: 60,
      status: 'in_progress',
      riskLevel: 'low',
      confirmationEligibility: 'eligible',
      review30: { completed: true, date: '2024-03-15', rating: 'Meets Expectations' },
      review60: { completed: false, date: null, rating: null },
      review90: { completed: false, date: null, rating: null },
      currentRating: 'Meets Expectations',
      nextReviewDate: '2024-03-30',
      contactEmail: 'suresh@company.com',
      contactPhone: '+91-9876543214',
      lastReviewDate: '2024-03-15',
      extensionCount: 0,
      workLocation: 'Hyderabad',
      employmentType: 'Permanent',
      salary: '₹7,50,000',
      skills: ['Manual Testing', 'Automation', 'Selenium'],
      trainingCompleted: ['Orientation', 'QA Process'],
      managerRecommendation: 'pending',
      managerComments: '',
      hrRecommendation: 'pending',
      hrComments: '',
      departmentHeadApproval: 'pending',
      confirmationAuthority: 'pending',
      confirmationDate: null,
      confirmationLetterGenerated: false,
      confirmationEffectiveDate: null,
      confirmationStatus: 'pending_review'
    },
    {
      id: 6,
      employeeId: 'EMP006',
      name: 'Arun Mehta',
      designation: 'DevOps Engineer',
      department: 'Engineering',
      manager: 'Sanjay Verma',
      hrBusinessPartner: 'Rohit Sharma',
      joiningDate: '2023-11-15',
      confirmationDueDate: '2024-02-15',
      probationPeriod: '90',
      daysRemaining: -25,
      status: 'confirmed',
      riskLevel: 'low',
      confirmationEligibility: 'eligible',
      review30: { completed: true, date: '2023-12-15', rating: 'Exceeds Expectations' },
      review60: { completed: true, date: '2024-01-15', rating: 'Exceeds Expectations' },
      review90: { completed: true, date: '2024-02-10', rating: 'Exceeds Expectations' },
      currentRating: 'Exceeds Expectations',
      nextReviewDate: null,
      contactEmail: 'arun@company.com',
      contactPhone: '+91-9876543215',
      lastReviewDate: '2024-02-10',
      extensionCount: 0,
      workLocation: 'Bangalore',
      employmentType: 'Permanent',
      salary: '₹9,50,000',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      trainingCompleted: ['Orientation', 'Security Training', 'Cloud Certification'],
      managerRecommendation: 'recommended',
      managerComments: 'Outstanding performance. Quick learner and team player.',
      hrRecommendation: 'approved',
      hrComments: 'All probation reviews completed successfully.',
      departmentHeadApproval: 'approved',
      confirmationAuthority: 'approved',
      confirmationDate: '2024-02-15',
      confirmationLetterGenerated: true,
      confirmationEffectiveDate: '2024-02-15',
      confirmationStatus: 'confirmed'
    },
    {
      id: 7,
      employeeId: 'EMP007',
      name: 'Meera Iyer',
      designation: 'Finance Executive',
      department: 'Finance',
      manager: 'Rajeev Kapoor',
      hrBusinessPartner: 'Anita Verma',
      joiningDate: '2023-10-01',
      confirmationDueDate: '2024-01-01',
      probationPeriod: '90',
      daysRemaining: -60,
      status: 'extended',
      riskLevel: 'medium',
      confirmationEligibility: 'conditional',
      review30: { completed: true, date: '2023-10-31', rating: 'Meets Expectations' },
      review60: { completed: true, date: '2023-11-30', rating: 'Needs Improvement' },
      review90: { completed: true, date: '2023-12-20', rating: 'Needs Improvement' },
      currentRating: 'Needs Improvement',
      nextReviewDate: '2024-03-01',
      contactEmail: 'meera@company.com',
      contactPhone: '+91-9876543216',
      lastReviewDate: '2023-12-20',
      extensionCount: 1,
      extendedTo: '2024-04-01',
      workLocation: 'Mumbai',
      employmentType: 'Permanent',
      salary: '₹6,50,000',
      skills: ['Accounting', 'Taxation', 'Financial Reporting'],
      trainingCompleted: ['Orientation', 'Finance Process'],
      managerRecommendation: 'recommended_with_conditions',
      managerComments: 'Extension required for skill improvement.',
      hrRecommendation: 'approved_extension',
      hrComments: 'Extended by 90 days for additional training.',
      departmentHeadApproval: 'approved',
      confirmationAuthority: 'approved_extension',
      confirmationDate: null,
      confirmationLetterGenerated: false,
      confirmationEffectiveDate: '2024-04-01',
      confirmationStatus: 'extended'
    },
    {
      id: 8,
      employeeId: 'EMP008',
      name: 'Karthik Reddy',
      designation: 'Product Manager',
      department: 'Product',
      manager: 'Deepa Sharma',
      hrBusinessPartner: 'Rohit Sharma',
      joiningDate: '2024-01-20',
      confirmationDueDate: '2024-04-20',
      probationPeriod: '90',
      daysRemaining: 25,
      status: 'pending_approval',
      riskLevel: 'low',
      confirmationEligibility: 'eligible',
      review30: { completed: true, date: '2024-02-20', rating: 'Exceeds Expectations' },
      review60: { completed: true, date: '2024-03-20', rating: 'Exceeds Expectations' },
      review90: { completed: true, date: '2024-04-10', rating: 'Exceeds Expectations' },
      currentRating: 'Exceeds Expectations',
      nextReviewDate: null,
      contactEmail: 'karthik@company.com',
      contactPhone: '+91-9876543217',
      lastReviewDate: '2024-04-10',
      extensionCount: 0,
      workLocation: 'Hyderabad',
      employmentType: 'Permanent',
      salary: '₹12,00,000',
      skills: ['Product Strategy', 'Roadmapping', 'User Research'],
      trainingCompleted: ['Orientation', 'Product Management'],
      managerRecommendation: 'recommended',
      managerComments: 'Exceptional performance. Ready for confirmation.',
      hrRecommendation: 'approved',
      hrComments: 'All criteria met. Recommend confirmation.',
      departmentHeadApproval: 'approved',
      confirmationAuthority: 'pending',
      confirmationDate: null,
      confirmationLetterGenerated: false,
      confirmationEffectiveDate: null,
      confirmationStatus: 'pending_authority_approval'
    }
  ];

  // ---------------- STATE VARIABLES ----------------
  const [employees, setEmployees] = useState(initialEmployees);

  // UI States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Selected items
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Form States
  const [reviewForm, setReviewForm] = useState({
    reviewType: 'final',
    reviewDate: new Date().toISOString().split('T')[0],
    managerAssessment: '',
    hrAssessment: '',
    recommendations: '',
    rating: 'meets_expectations',
    decision: 'confirm',
    comments: '',
    attachments: []
  });

  const [confirmationForm, setConfirmationForm] = useState({
    confirmationDate: new Date().toISOString().split('T')[0],
    effectiveDate: new Date().toISOString().split('T')[0],
    salaryRevision: false,
    newSalary: '',
    designationChange: false,
    newDesignation: '',
    additionalComments: '',
    generateLetter: true,
    notifyEmployee: true,
    notifyManager: true
  });

  const [extensionForm, setExtensionForm] = useState({
    extensionDays: 30,
    newConfirmationDate: '',
    reason: '',
    performancePlan: '',
    reviewMilestones: [],
    notifyEmployee: true,
    notifyManager: true
  });

  const [rejectionForm, setRejectionForm] = useState({
    reason: '',
    terminationDate: new Date().toISOString().split('T')[0],
    noticePeriod: 'serving',
    severance: 'none',
    comments: '',
    exitInterview: true
  });

  const [bulkAction, setBulkAction] = useState({
    action: 'confirm',
    date: new Date().toISOString().split('T')[0],
    extensionDays: '30',
    templateId: '',
    notifyEmployees: true,
    notifyManagers: true,
    generateLetters: true,
    message: ''
  });

  const [reportFilters, setReportFilters] = useState({
    startDate: '2024-01-01',
    endDate: new Date().toISOString().split('T')[0],
    department: 'all',
    status: 'all',
    exportFormat: 'pdf'
  });

  // Filter and Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterEligibility, setFilterEligibility] = useState('all');
  const [sortBy, setSortBy] = useState('confirmationDueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Auto-trigger states
  const [autoTriggerEnabled, setAutoTriggerEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState([7, 3, 1]); // Days before due date to send reminders

  // ---------------- STATISTICS ----------------
  const stats = {
    total: employees.length,
    pendingReview: employees.filter(e => e.status === 'pending_review' || e.status === 'under_review').length,
    pendingApproval: employees.filter(e => e.status === 'pending_approval').length,
    confirmed: employees.filter(e => e.status === 'confirmed').length,
    extended: employees.filter(e => e.status === 'extended').length,
    overdue: employees.filter(e => e.daysRemaining < 0 && e.status !== 'confirmed' && e.status !== 'extended').length,
    dueThisWeek: employees.filter(e => e.daysRemaining <= 7 && e.daysRemaining >= 0).length,
    highRisk: employees.filter(e => e.riskLevel === 'high').length,
    eligible: employees.filter(e => e.confirmationEligibility === 'eligible').length,
    conditional: employees.filter(e => e.confirmationEligibility === 'conditional').length,
    notEligible: employees.filter(e => e.confirmationEligibility === 'not_eligible').length
  };

  // ---------------- HELPER FUNCTIONS ----------------
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // ---------------- FILTER + SORT ----------------
  const filteredEmployees = employees
    .filter(emp => {
      const searchMatch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = filterStatus === 'all' || emp.status === filterStatus;
      const deptMatch = filterDepartment === 'all' || emp.department === filterDepartment;
      const eligibilityMatch = filterEligibility === 'all' || emp.confirmationEligibility === filterEligibility;

      return searchMatch && statusMatch && deptMatch && eligibilityMatch;
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

      if (sortBy === 'confirmationDueDate' || sortBy === 'joiningDate' || sortBy === 'confirmationDate') {
        A = new Date(a[sortBy]);
        B = new Date(b[sortBy]);
      }

      return sortOrder === 'asc' ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ---------------- AUTO-TRIGGER FUNCTIONALITY ----------------
  useEffect(() => {
    if (!autoTriggerEnabled) return;

    // Check for employees due for confirmation and auto-trigger reviews
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employeesToReview = employees.filter(emp => {
      if (emp.status === 'confirmed' || emp.status === 'terminated' || emp.status === 'extended') {
        return false;
      }

      const dueDate = new Date(emp.confirmationDueDate);
      dueDate.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      // Auto-trigger review if due date is within 7 days and no review initiated
      return daysUntilDue <= 7 && daysUntilDue >= 0 &&
        (emp.status === 'in_progress' || emp.status === 'pending_review');
    });

    // Auto-trigger reminders based on reminder days
    reminderDays.forEach(reminderDay => {
      const reminderDate = new Date(today);
      reminderDate.setDate(reminderDate.getDate() + reminderDay);

      const employeesToRemind = employees.filter(emp => {
        if (emp.status === 'confirmed' || emp.status === 'terminated') {
          return false;
        }

        const dueDate = new Date(emp.confirmationDueDate);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate.getTime() === reminderDate.getTime() &&
          (emp.status === 'in_progress' || emp.status === 'pending_review');
      });

      if (employeesToRemind.length > 0) {
        // In a real application, this would send emails/notifications
        console.log(`Auto-reminder: ${employeesToRemind.length} employees due in ${reminderDay} days`);
      }
    });

  }, [employees, autoTriggerEnabled, reminderDays]);

  // ---------------- EVENT HANDLERS ----------------

  // Initiate Review
  const handleInitiateReview = (employee) => {
    setSelectedEmployee(employee);
    setReviewForm({
      reviewType: 'final',
      reviewDate: new Date().toISOString().split('T')[0],
      managerAssessment: employee.managerComments || '',
      hrAssessment: employee.hrComments || '',
      recommendations: '',
      rating: employee.currentRating.toLowerCase().replace(' ', '_'),
      decision: 'confirm',
      comments: '',
      attachments: []
    });
    setShowReviewModal(true);
  };

  // Submit Review
  const handleSubmitReview = (e) => {
    e.preventDefault();

    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        const updatedEmp = { ...emp };

        // Update review data
        updatedEmp.managerComments = reviewForm.managerAssessment;
        updatedEmp.hrComments = reviewForm.hrAssessment;
        updatedEmp.currentRating = reviewForm.rating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Update recommendations based on decision
        if (reviewForm.decision === 'confirm') {
          updatedEmp.managerRecommendation = 'recommended';
          updatedEmp.hrRecommendation = 'approved';
          updatedEmp.status = 'pending_approval';
        } else if (reviewForm.decision === 'extend') {
          updatedEmp.managerRecommendation = 'recommended_with_conditions';
          updatedEmp.hrRecommendation = 'approved_extension';
          updatedEmp.status = 'pending_approval';
        } else if (reviewForm.decision === 'reject') {
          updatedEmp.managerRecommendation = 'not_recommended';
          updatedEmp.hrRecommendation = 'rejected';
          updatedEmp.status = 'pending_approval';
        }

        // Update final review completion
        updatedEmp.review90 = {
          completed: true,
          date: reviewForm.reviewDate,
          rating: reviewForm.rating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        };

        return updatedEmp;
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setShowReviewModal(false);
    alert(`Final review submitted for ${selectedEmployee.name}`);
  };

  // Confirm Employee
  const handleConfirmEmployee = (employee) => {
    setSelectedEmployee(employee);
    setConfirmationForm({
      confirmationDate: new Date().toISOString().split('T')[0],
      effectiveDate: new Date().toISOString().split('T')[0],
      salaryRevision: false,
      newSalary: '',
      designationChange: false,
      newDesignation: '',
      additionalComments: '',
      generateLetter: true,
      notifyEmployee: true,
      notifyManager: true
    });
    setShowConfirmationModal(true);
  };

  const handleSubmitConfirmation = (e) => {
    e.preventDefault();

    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          status: 'confirmed',
          confirmationDate: confirmationForm.confirmationDate,
          confirmationEffectiveDate: confirmationForm.effectiveDate,
          confirmationLetterGenerated: confirmationForm.generateLetter,
          departmentHeadApproval: 'approved',
          confirmationAuthority: 'approved',
          confirmationStatus: 'confirmed'
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setShowConfirmationModal(false);
    alert(`${selectedEmployee.name} has been confirmed as permanent employee`);
  };

  // Extend Probation
  const handleExtendProbation = (employee) => {
    setSelectedEmployee(employee);
    const newDate = new Date(employee.confirmationDueDate);
    newDate.setDate(newDate.getDate() + 30);

    setExtensionForm({
      extensionDays: 30,
      newConfirmationDate: newDate.toISOString().split('T')[0],
      reason: '',
      performancePlan: '',
      reviewMilestones: [],
      notifyEmployee: true,
      notifyManager: true
    });
    setShowExtensionModal(true);
  };

  const handleSubmitExtension = (e) => {
    e.preventDefault();

    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        const newDate = new Date(extensionForm.newConfirmationDate);
        const daysRemaining = calculateDaysRemaining(newDate);

        return {
          ...emp,
          status: 'extended',
          confirmationDueDate: extensionForm.newConfirmationDate,
          daysRemaining: daysRemaining,
          extensionCount: (emp.extensionCount || 0) + 1,
          extendedTo: extensionForm.newConfirmationDate,
          confirmationEligibility: 'conditional',
          riskLevel: 'high',
          departmentHeadApproval: 'approved',
          confirmationAuthority: 'approved_extension',
          confirmationStatus: 'extended'
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setShowExtensionModal(false);
    alert(`Probation extended for ${selectedEmployee.name} until ${formatDate(extensionForm.newConfirmationDate)}`);
  };

  // Reject Confirmation
  const handleRejectConfirmation = (employee) => {
    setSelectedEmployee(employee);
    setRejectionForm({
      reason: '',
      terminationDate: new Date().toISOString().split('T')[0],
      noticePeriod: 'serving',
      severance: 'none',
      comments: '',
      exitInterview: true
    });
    setShowRejectionModal(true);
  };

  const handleSubmitRejection = (e) => {
    e.preventDefault();

    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          status: 'terminated',
          confirmationEligibility: 'not_eligible',
          departmentHeadApproval: 'rejected',
          confirmationAuthority: 'rejected',
          confirmationStatus: 'rejected',
          terminationDate: rejectionForm.terminationDate
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setShowRejectionModal(false);
    alert(`Confirmation rejected for ${selectedEmployee.name}. Termination initiated.`);
  };

  // Generate Confirmation Letter
  const handleGenerateLetter = (employee) => {
    setSelectedEmployee(employee);
    setShowLetterModal(true);
  };

  const handleSubmitLetter = () => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          confirmationLetterGenerated: true
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setShowLetterModal(false);
    alert(`Confirmation letter generated for ${selectedEmployee.name}`);
  };

  // Bulk Actions
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

  const handleBulkActionSubmit = (e) => {
    e.preventDefault();

    switch (bulkAction.action) {
      case 'confirm':
        const confirmedEmployees = employees.map(emp => {
          if (selectedEmployees.includes(emp.id)) {
            return {
              ...emp,
              status: 'confirmed',
              confirmationDate: bulkAction.date,
              confirmationEffectiveDate: bulkAction.date,
              confirmationLetterGenerated: bulkAction.generateLetters || false,
              departmentHeadApproval: 'approved',
              confirmationAuthority: 'approved',
              confirmationStatus: 'confirmed'
            };
          }
          return emp;
        });
        setEmployees(confirmedEmployees);
        const letterText = bulkAction.generateLetters ? ' with confirmation letters' : '';
        const notificationText = bulkAction.notifyEmployees ? ' and notifications sent' : '';
        alert(`${selectedEmployees.length} employees confirmed${letterText}${notificationText}`);
        break;

      case 'extend':
        const extendedEmployees = employees.map(emp => {
          if (selectedEmployees.includes(emp.id)) {
            const newDate = new Date(emp.confirmationDueDate);
            newDate.setDate(newDate.getDate() + parseInt(bulkAction.extensionDays || 30));
            return {
              ...emp,
              status: 'extended',
              confirmationDueDate: newDate.toISOString().split('T')[0],
              daysRemaining: calculateDaysRemaining(newDate),
              extensionCount: (emp.extensionCount || 0) + 1,
              confirmationEligibility: 'conditional',
              riskLevel: 'high'
            };
          }
          return emp;
        });
        setEmployees(extendedEmployees);
        alert(`Probation extended for ${selectedEmployees.length} employees`);
        break;

      case 'remind_managers':
        alert(`Reminders sent to managers of ${selectedEmployees.length} employees`);
        break;

      case 'export_data':
        alert(`Exporting data for ${selectedEmployees.length} employees`);
        break;
    }

    setShowBulkActionModal(false);
    setSelectedEmployees([]);
  };

  // Quick Actions
  const handleSendReminders = () => {
    const pendingReviews = employees.filter(
      emp => emp.status === 'pending_review' || emp.status === 'under_review'
    );

    if (pendingReviews.length === 0) {
      alert('No pending reviews at this time');
      return;
    }

    alert(`Reminders sent to managers of ${pendingReviews.length} employees for pending reviews`);
  };

  const handleApprovePending = () => {
    const pendingApprovals = employees.filter(emp => emp.status === 'pending_approval');

    if (pendingApprovals.length === 0) {
      alert('No pending approvals at this time');
      return;
    }

    const updatedEmployees = employees.map(emp => {
      if (emp.status === 'pending_approval') {
        return {
          ...emp,
          departmentHeadApproval: 'approved',
          confirmationAuthority: 'approved',
          status: 'confirmed',
          confirmationDate: new Date().toISOString().split('T')[0]
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    alert(`${pendingApprovals.length} pending approvals confirmed`);
  };

  const handleGenerateReport = () => {
    alert(`Report generated for period ${formatDate(reportFilters.startDate)} to ${formatDate(reportFilters.endDate)}`);
    setShowReportModal(false);
  };

  const handleExportData = () => {
    setShowReportModal(true);
  };

  // View Details
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  // Auto-trigger review for employees due soon
  const handleAutoTriggerReviews = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employeesToReview = employees.filter(emp => {
      if (emp.status === 'confirmed' || emp.status === 'terminated' || emp.status === 'extended') {
        return false;
      }

      const dueDate = new Date(emp.confirmationDueDate);
      dueDate.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      return daysUntilDue <= 7 && daysUntilDue >= 0 &&
        (emp.status === 'in_progress' || emp.status === 'pending_review');
    });

    if (employeesToReview.length === 0) {
      alert('No employees require auto-triggered reviews at this time');
      return;
    }

    alert(`Auto-triggered reviews for ${employeesToReview.length} employees due within 7 days`);
  };

  // ---------------- UI COMPONENTS ----------------
  const getStatusBadge = (status) => {
    const config = {
      pending_review: { label: 'Pending Review', color: 'warning' },
      under_review: { label: 'Under Review', color: 'info' },
      pending_approval: { label: 'Pending Approval', color: 'primary' },
      confirmed: { label: 'Confirmed', color: 'success' },
      extended: { label: 'Extended', color: 'secondary' },
      overdue: { label: 'Overdue', color: 'danger' },
      terminated: { label: 'Terminated', color: 'dark' }
    };

    const { label, color } = config[status] || { label: status, color: 'secondary' };

    return (
      <span className={`badge bg-${color}-subtle text-${color}`}>
        {label}
      </span>
    );
  };

  const getEligibilityBadge = (eligibility) => {
    const config = {
      eligible: { label: 'Eligible', color: 'success' },
      conditional: { label: 'Conditional', color: 'warning' },
      not_eligible: { label: 'Not Eligible', color: 'danger' }
    };

    const { label, color } = config[eligibility] || { label: eligibility, color: 'secondary' };

    return (
      <span className={`badge bg-${color}-subtle text-${color}`}>
        {label}
      </span>
    );
  };

  const getRecommendationBadge = (recommendation) => {
    const config = {
      recommended: { label: 'Recommended', color: 'success' },
      recommended_with_conditions: { label: 'Conditional', color: 'warning' },
      not_recommended: { label: 'Not Recommended', color: 'danger' },
      pending: { label: 'Pending', color: 'secondary' },
      approved: { label: 'Approved', color: 'success' },
      approved_extension: { label: 'Extension Approved', color: 'info' },
      rejected: { label: 'Rejected', color: 'danger' }
    };

    const { label, color } = config[recommendation] || { label: recommendation, color: 'secondary' };

    return (
      <span className={`badge bg-${color}-subtle text-${color}`}>
        {label}
      </span>
    );
  };

  const ApprovalWorkflow = ({ employee }) => {
    const steps = [
      { key: 'managerRecommendation', label: 'Manager', value: employee.managerRecommendation, icon: 'heroicons-solid:user-circle' },
      { key: 'hrRecommendation', label: 'HR', value: employee.hrRecommendation, icon: 'heroicons-solid:briefcase' },
      { key: 'departmentHeadApproval', label: 'Dept Head', value: employee.departmentHeadApproval, icon: 'heroicons-solid:user-group' },
      { key: 'confirmationAuthority', label: 'Authority', value: employee.confirmationAuthority, icon: 'heroicons-solid:check-circle' }
    ];

    const getStepStatus = (value) => {
      if (value === 'approved' || value === 'recommended' || value === 'approved_extension') {
        return 'completed';
      } else if (value === 'pending') {
        return 'pending';
      } else if (value === 'recommended_with_conditions') {
        return 'conditional';
      } else {
        return 'rejected';
      }
    };

    return (
      <div className="d-flex gap-2 align-items-center flex-wrap">
        {steps.map((step, index) => {
          const status = getStepStatus(step.value);
          return (
            <div key={step.key} className="d-flex align-items-center">
              <div className="text-center">
                <div
                  className={`rounded-circle d-inline-flex align-items-center justify-content-center ${status === 'completed' ? 'bg-success text-white' :
                    status === 'conditional' ? 'bg-warning text-white' :
                      status === 'rejected' ? 'bg-danger text-white' :
                        'bg-light text-muted'
                    }`}
                  style={{ width: '32px', height: '32px', fontSize: '14px' }}
                  title={`${step.label}: ${step.value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                >
                  {status === 'completed' ? '✓' : status === 'rejected' ? '✗' : step.label.charAt(0)}
                </div>
                <small className="d-block text-muted mt-1" style={{ fontSize: '10px' }}>
                  {step.label}
                </small>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-1">
                  <Icon icon="heroicons-solid:arrow-right" width={16} height={16} className="text-muted" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ---------------- SIDEBAR MENU ----------------
  const menuItems = [
    {
      title: 'Dashboard',
      link: '/hr/dashboard',
      active: false
    },
    {
      title: 'Employee Master',
      link: '/hr/employees'
    },
    {
      title: 'Probation Management',
      link: '/hr/probation'
    },
    {
      title: 'Employee Confirmation',
      link: '/hr/confirmation',
      active: true
    },
    {
      title: 'Attendance',
      link: '/hr/attendance'
    },
    {
      title: 'Leave Management',
      link: '/hr/leave'
    },
    {
      title: 'Payroll',
      link: '/hr/payroll'
    },
    {
      title: 'Performance',
      link: '/hr/performance'
    },
    {
      title: 'Reports',
      link: '/hr/reports'
    },
    {
      title: 'Settings',
      link: '/hr/settings'
    }
  ];

  const userInfo = {
    name: 'HR Manager',
    role: 'Human Resources',
    email: 'hr@company.com'
  };

  return (
    <>
      <div className="container-fluid p-3 p-md-4">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-2 d-flex align-items-center">
              <Icon icon="heroicons-solid:document-check" className="me-2" width={24} height={24} />
              <div className="fw-bold h5 h2-md">   Employee Confirmation Management</div>
            </h5>

            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              Manage employee confirmation processes after probation period
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-primary btn-sm d-flex align-items-center"
              onClick={() => setShowReportModal(true)}
            >
              <Icon icon="heroicons-solid:chart-bar" className="me-1" />
              Reports
            </button>

            <button
              className="btn btn-outline-primary btn-sm d-flex align-items-center"
              onClick={() => setShowBulkActionModal(true)}
              disabled={selectedEmployees.length === 0}
            >
              <Icon icon="heroicons-solid:collection" className="me-1" />
              Bulk ({selectedEmployees.length})
            </button>
          </div>

        </div>

        {/* STATISTICS */}
        <div className="row g-2 g-md-3 mb-4">
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border shadow-sm h-100">
              <div className="card-body text-center p-2 p-md-3">
                <div className="fw-bold text-secondary-light small">Total</div>
                <div className="fw-bold fs-6 fs-md-5 text-primary">{stats.total}</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border shadow-sm h-100">
              <div className="card-body text-center p-2 p-md-3">
                <div className="fw-bold text-secondary-light small">Pending Review</div>
                <div className="fw-bold fs-6 fs-md-5 text-warning">{stats.pendingReview}</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border shadow-sm h-100">
              <div className="card-body text-center p-2 p-md-3">
                <div className="fw-bold text-secondary-light small">Pending Approval</div>
                <div className="fw-bold fs-6 fs-md-5 text-info">{stats.pendingApproval}</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border shadow-sm h-100">
              <div className="card-body text-center p-2 p-md-3">
                <div className="fw-bold text-secondary-light small">Confirmed</div>
                <div className="fw-bold fs-6 fs-md-5 text-success">{stats.confirmed}</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border shadow-sm h-100">
              <div className="card-body text-center p-2 p-md-3">
                <div className="fw-bold text-secondary-light small">Overdue</div>
                <div className="fw-bold fs-6 fs-md-5 text-danger">{stats.overdue}</div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <div className="card border shadow-sm h-100">
              <div className="card-body text-center p-2 p-md-3">
                <div className="fw-bold text-secondary-light small">Due This Week</div>
                <div className="fw-bold fs-6 fs-md-5 text-warning">{stats.dueThisWeek}</div>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="card p-3 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            {/* Left Section */}
            <div>
              <strong className="d-block">Quick Actions</strong>
              <p className="text-muted mb-0 small">
                Common confirmation management tasks
              </p>
            </div>

            {/* Right Section */}
            <div className="d-flex flex-wrap gap-2 align-items-center">

              <button
                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                onClick={handleSendReminders}
              >
                Send Reminders
              </button>

              <button
                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                onClick={handleApprovePending}
              >
                Approve Pending
              </button>

              <button
                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                onClick={handleExportData}
              >
                Export Data
              </button>

              <button
                className="btn btn-sm btn-outline-success d-flex align-items-center"
                onClick={handleAutoTriggerReviews}
              >
                <Icon icon="heroicons-solid:clock" className="me-1" />
                Auto-Trigger Reviews
              </button>

            </div>
          </div>
        </div>


        {/* FILTERS */}
        <div className="card p-2 p-md-3 mb-4">
          <div className="row g-2">
            <div className="col-md-4 col-lg-3">
              <input
                type="text"
                placeholder="Search employees..."
                className="form-control form-control-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-md-3 col-lg-2">
              <select
                className="form-select form-select-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="under_review">Under Review</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="confirmed">Confirmed</option>
                <option value="extended">Extended</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="col-md-3 col-lg-2">
              <select
                className="form-select form-select-sm"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">HR</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Product">Product</option>
                <option value="Quality Assurance">QA</option>
              </select>
            </div>

            <div className="col-md-3 col-lg-2">
              <select
                className="form-select form-select-sm"
                value={filterEligibility}
                onChange={(e) => setFilterEligibility(e.target.value)}
              >
                <option value="all">All Eligibility</option>
                <option value="eligible">Eligible</option>
                <option value="conditional">Conditional</option>
                <option value="not_eligible">Not Eligible</option>
              </select>
            </div>

            <div className="col-md-6 col-lg-3 d-flex gap-2">
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="confirmationDueDate">Sort by Due Date</option>
                <option value="name">Sort by Name</option>
                <option value="daysRemaining">Sort by Days Remaining</option>
                <option value="joiningDate">Sort by Joining Date</option>
              </select>

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* SELECTION INFO */}
        {selectedEmployees.length > 0 && (
          <div className="alert alert-info d-flex justify-content-between align-items-center mb-3 py-2">
            <div>
              <strong>{selectedEmployees.length} employees</strong> selected for bulk actions
            </div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => setSelectedEmployees([])}
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* MAIN TABLE */}
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedEmployees.length === paginatedEmployees.length && paginatedEmployees.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ minWidth: '200px' }}>Employee Details</th>
                  <th className="text-center d-none d-lg-table-cell" style={{ minWidth: '100px' }}>Confirmation Status</th>
                  <th className="text-center" style={{ minWidth: '100px' }}>Eligibility</th>
                  <th className="text-center d-none d-md-table-cell" style={{ minWidth: '120px' }}>Approval Workflow</th>
                  <th className="text-center" style={{ minWidth: '100px' }}>Time Status</th>
                  <th className="text-center" style={{ minWidth: '150px' }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className={selectedEmployees.includes(emp.id) ? 'table-active' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => handleSelectEmployee(emp.id)}
                      />
                    </td>

                    <td>
                      <div>
                        <div className="d-flex align-items-center gap-1">
                          <strong className="d-block">{emp.name}</strong>
                          <small className="badge bg-secondary d-none d-sm-inline">{emp.employeeId}</small>
                        </div>
                        <small className="text-muted d-block">{emp.designation}</small>
                        <div className="d-flex gap-1">
                          <small className="text-muted">{emp.department}</small>
                          <small className="text-muted d-none d-sm-inline">•</small>
                          <small className="text-muted d-none d-sm-inline">{emp.workLocation}</small>
                        </div>
                      </div>
                    </td>

                    <td className="text-center d-none d-lg-table-cell">
                      {getStatusBadge(emp.status)}
                      {emp.confirmationDate && (
                        <div className="small text-muted mt-1">
                          Confirmed: {formatDate(emp.confirmationDate)}
                        </div>
                      )}
                    </td>

                    <td className="text-center">
                      {getEligibilityBadge(emp.confirmationEligibility)}
                      <div className="small text-muted mt-1">
                        {emp.extensionCount > 0 ? `Extended ${emp.extensionCount}x` : 'Regular'}
                      </div>
                    </td>

                    <td className="text-center d-none d-md-table-cell">
                      <ApprovalWorkflow employee={emp} />
                      <div className="small text-muted mt-1">
                        Manager: {getRecommendationBadge(emp.managerRecommendation)}
                      </div>
                    </td>

                    <td className="text-center">
                      <div className={`fw-bold ${emp.daysRemaining <= 0 ? 'text-danger' :
                        emp.daysRemaining <= 7 ? 'text-danger' :
                          emp.daysRemaining <= 30 ? 'text-warning' : 'text-success'
                        }`}>
                        {emp.daysRemaining <= 0 ? Math.abs(emp.daysRemaining) + ' days overdue' : emp.daysRemaining + ' days'}
                      </div>
                      <div className="small text-muted">
                        Due: {formatDate(emp.confirmationDueDate)}
                      </div>
                    </td>

                    <td className="text-center">
                      <div className="btn-group btn-group-sm flex-wrap">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleViewDetails(emp)}
                          title="View Details"
                        >
                          <Icon icon="heroicons-solid:eye" />
                        </button>

                        {emp.status !== 'confirmed' && emp.status !== 'terminated' && (
                          <>
                            {emp.status === 'pending_review' || emp.status === 'under_review' ? (
                              <button
                                className="btn btn-outline-info"
                                onClick={() => handleInitiateReview(emp)}
                                title="Initiate Review"
                              >
                                Review
                              </button>
                            ) : null}

                            {emp.status === 'pending_approval' ? (
                              <>
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => handleConfirmEmployee(emp)}
                                  title="Confirm Employee"
                                >
                                  <Icon icon="mdi:check-circle-outline" width="20" />
                                </button>

                                <button
                                  className="btn btn-outline-warning"
                                  onClick={() => handleExtendProbation(emp)}
                                  title="Extend Probation"
                                >
                                  <Icon icon="mdi:clock-outline" width="20" />
                                </button>

                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleRejectConfirmation(emp)}
                                  title="Reject Confirmation"
                                >
                                  <Icon icon="mdi:close-circle-outline" width="20" />
                                </button>
                              </>

                            ) : null}
                          </>
                        )}

                        {emp.status === 'confirmed' && !emp.confirmationLetterGenerated && (
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleGenerateLetter(emp)}
                            title="Generate Letter"
                          >
                            Letter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedEmployees.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <h5 className="mb-2">No employees found</h5>
                      <p className="mb-0">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="card-footer d-flex justify-content-between align-items-center py-2">
              <div className="text-muted small d-none d-md-block">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
              </div>

              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
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

                  {totalPages > 5 && (
                    <>
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                      <li className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>

        {/* ----------------- MODALS ----------------- */}

        {/* REVIEW MODAL */}
        {showReviewModal && selectedEmployee && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Final Confirmation Review - {selectedEmployee.name}</h5>
                  <button className="btn-close" onClick={() => setShowReviewModal(false)}></button>
                </div>

                <form onSubmit={handleSubmitReview}>
                  <div className="modal-body">
                    <div className="alert alert-info mb-3">
                      Reviewing <strong>{selectedEmployee.name}</strong> ({selectedEmployee.employeeId}) for confirmation
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Review Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={reviewForm.reviewDate}
                          onChange={(e) => setReviewForm({ ...reviewForm, reviewDate: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Performance Rating *</label>
                        <select
                          className="form-select"
                          value={reviewForm.rating}
                          onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                          required
                        >
                          <option value="exceeds_expectations">Exceeds Expectations</option>
                          <option value="meets_expectations">Meets Expectations</option>
                          <option value="needs_improvement">Needs Improvement</option>
                          <option value="unsatisfactory">Unsatisfactory</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Manager Assessment *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Enter manager's final assessment..."
                          value={reviewForm.managerAssessment}
                          onChange={(e) => setReviewForm({ ...reviewForm, managerAssessment: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">HR Assessment *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Enter HR's final assessment..."
                          value={reviewForm.hrAssessment}
                          onChange={(e) => setReviewForm({ ...reviewForm, hrAssessment: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Recommendation *</label>
                        <select
                          className="form-select"
                          value={reviewForm.decision}
                          onChange={(e) => setReviewForm({ ...reviewForm, decision: e.target.value })}
                          required
                        >
                          <option value="confirm">Confirm Employment</option>
                          <option value="extend">Extend Probation</option>
                          <option value="reject">Reject Confirmation</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Additional Comments</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Any additional comments..."
                          value={reviewForm.comments}
                          onChange={(e) => setReviewForm({ ...reviewForm, comments: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowReviewModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRMATION MODAL */}
        {showConfirmationModal && selectedEmployee && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Employee - {selectedEmployee.name}</h5>
                  <button className="btn-close" onClick={() => setShowConfirmationModal(false)}></button>
                </div>

                <form onSubmit={handleSubmitConfirmation}>
                  <div className="modal-body">
                    <div className="alert alert-success mb-3">
                      Confirming <strong>{selectedEmployee.name}</strong> as permanent employee
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirmation Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={confirmationForm.confirmationDate}
                        onChange={(e) => setConfirmationForm({ ...confirmationForm, confirmationDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Effective Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={confirmationForm.effectiveDate}
                        onChange={(e) => setConfirmationForm({ ...confirmationForm, effectiveDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Additional Comments</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Any additional comments..."
                        value={confirmationForm.additionalComments}
                        onChange={(e) => setConfirmationForm({ ...confirmationForm, additionalComments: e.target.value })}
                      />
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={confirmationForm.generateLetter}
                        onChange={(e) => setConfirmationForm({ ...confirmationForm, generateLetter: e.target.checked })}
                      />
                      <label className="form-check-label">
                        Generate confirmation letter
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={confirmationForm.notifyEmployee}
                        onChange={(e) => setConfirmationForm({ ...confirmationForm, notifyEmployee: e.target.checked })}
                      />
                      <label className="form-check-label">
                        Notify employee
                      </label>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowConfirmationModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      Confirm Employee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* EXTENSION MODAL */}
        {showExtensionModal && selectedEmployee && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Extend Probation - {selectedEmployee.name}</h5>
                  <button className="btn-close" onClick={() => setShowExtensionModal(false)}></button>
                </div>

                <form onSubmit={handleSubmitExtension}>
                  <div className="modal-body">
                    <div className="alert alert-warning mb-3">
                      Extending probation period for <strong>{selectedEmployee.name}</strong>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Extension Duration (Days) *</label>
                      <select
                        className="form-select"
                        value={extensionForm.extensionDays}
                        onChange={(e) => {
                          const days = parseInt(e.target.value);
                          const newDate = new Date(selectedEmployee.confirmationDueDate);
                          newDate.setDate(newDate.getDate() + days);
                          setExtensionForm({
                            ...extensionForm,
                            extensionDays: days,
                            newConfirmationDate: newDate.toISOString().split('T')[0]
                          });
                        }}
                        required
                      >
                        <option value="15">15 Days</option>
                        <option value="30">30 Days</option>
                        <option value="60">60 Days</option>
                        <option value="90">90 Days</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Confirmation Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={extensionForm.newConfirmationDate}
                        onChange={(e) => setExtensionForm({ ...extensionForm, newConfirmationDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Reason for Extension *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Provide detailed reason for extension..."
                        value={extensionForm.reason}
                        onChange={(e) => setExtensionForm({ ...extensionForm, reason: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Performance Improvement Plan</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Outline performance improvement plan..."
                        value={extensionForm.performancePlan}
                        onChange={(e) => setExtensionForm({ ...extensionForm, performancePlan: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowExtensionModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-warning">
                      Extend Probation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* REJECTION MODAL */}
        {showRejectionModal && selectedEmployee && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reject Confirmation - {selectedEmployee.name}</h5>
                  <button className="btn-close" onClick={() => setShowRejectionModal(false)}></button>
                </div>

                <form onSubmit={handleSubmitRejection}>
                  <div className="modal-body">
                    <div className="alert alert-danger mb-3">
                      Rejecting confirmation for <strong>{selectedEmployee.name}</strong>. This will initiate termination.
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Reason for Rejection *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Provide detailed reason for rejection..."
                        value={rejectionForm.reason}
                        onChange={(e) => setRejectionForm({ ...rejectionForm, reason: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Termination Effective Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={rejectionForm.terminationDate}
                        onChange={(e) => setRejectionForm({ ...rejectionForm, terminationDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Notice Period</label>
                      <select
                        className="form-select"
                        value={rejectionForm.noticePeriod}
                        onChange={(e) => setRejectionForm({ ...rejectionForm, noticePeriod: e.target.value })}
                      >
                        <option value="serving">Serving Notice Period</option>
                        <option value="waived">Notice Period Waived</option>
                        <option value="payment_in_lieu">Payment in Lieu</option>
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowRejectionModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-danger">
                      Reject Confirmation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* BULK ACTION MODAL */}
        {showBulkActionModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Bulk Actions ({selectedEmployees.length} employees)</h5>
                  <button className="btn-close" onClick={() => setShowBulkActionModal(false)}></button>
                </div>

                <form onSubmit={handleBulkActionSubmit}>
                  <div className="modal-body">
                    <div className="alert alert-info mb-3">
                      Apply action to all selected employees
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Select Action *</label>
                      <select
                        className="form-select"
                        value={bulkAction.action}
                        onChange={(e) => setBulkAction({ ...bulkAction, action: e.target.value })}
                        required
                      >
                        <option value="confirm">Confirm Employees</option>
                        <option value="extend">Extend Probation</option>
                        <option value="remind_managers">Remind Managers</option>
                        <option value="export_data">Export Data</option>
                      </select>
                    </div>

                    {bulkAction.action === 'confirm' && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Confirmation Date *</label>
                          <input
                            type="date"
                            className="form-control"
                            value={bulkAction.date}
                            onChange={(e) => setBulkAction({ ...bulkAction, date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={bulkAction.generateLetters}
                            onChange={(e) => setBulkAction({ ...bulkAction, generateLetters: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Generate confirmation letters for all
                          </label>
                        </div>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={bulkAction.notifyEmployees}
                            onChange={(e) => setBulkAction({ ...bulkAction, notifyEmployees: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Notify all employees via email
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={bulkAction.notifyManagers}
                            onChange={(e) => setBulkAction({ ...bulkAction, notifyManagers: e.target.checked })}
                          />
                          <label className="form-check-label">
                            Notify all managers
                          </label>
                        </div>
                      </>
                    )}

                    {bulkAction.action === 'extend' && (
                      <div className="mb-3">
                        <label className="form-label">Extension Days *</label>
                        <select
                          className="form-select"
                          value={bulkAction.extensionDays}
                          onChange={(e) => setBulkAction({ ...bulkAction, extensionDays: e.target.value })}
                          required
                        >
                          <option value="30">30 Days</option>
                          <option value="60">60 Days</option>
                          <option value="90">90 Days</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowBulkActionModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Apply Action
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* LETTER GENERATION MODAL */}
        {showLetterModal && selectedEmployee && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Generate Confirmation Letter - {selectedEmployee.name}</h5>
                  <button className="btn-close" onClick={() => setShowLetterModal(false)}></button>
                </div>

                <div className="modal-body">
                  <div className="alert alert-success mb-3">
                    Generating confirmation letter for <strong>{selectedEmployee.name}</strong> ({selectedEmployee.employeeId})
                  </div>

                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <strong>Letter Details</strong>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Confirmation Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={selectedEmployee.confirmationDate || new Date().toISOString().split('T')[0]}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Effective Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={selectedEmployee.confirmationEffectiveDate || new Date().toISOString().split('T')[0]}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Employee Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.name}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Employee ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.employeeId}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Designation</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.designation}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Department</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.department}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">Joining Date</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formatDate(selectedEmployee.joiningDate)}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Salary</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedEmployee.salary}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-3">
                    <div className="card-header bg-light">
                      <strong>Letter Options</strong>
                    </div>
                    <div className="card-body">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked
                          id="includeSalary"
                        />
                        <label className="form-check-label" htmlFor="includeSalary">
                          Include salary details
                        </label>
                      </div>

                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked
                          id="includeTerms"
                        />
                        <label className="form-check-label" htmlFor="includeTerms">
                          Include terms and conditions
                        </label>
                      </div>

                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked
                          id="sendEmail"
                        />
                        <label className="form-check-label" htmlFor="sendEmail">
                          Send letter via email to employee
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked
                          id="ccManager"
                        />
                        <label className="form-check-label" htmlFor="ccManager">
                          CC Manager ({selectedEmployee.manager})
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <strong>Letter Preview:</strong> The confirmation letter will be generated in PDF format and include:
                    <ul className="mb-0 mt-2">
                      <li>Official confirmation of permanent employment</li>
                      <li>Employee details and confirmation date</li>
                      <li>Designation, department, and work location</li>
                      <li>Salary details (if selected)</li>
                      <li>Terms and conditions of permanent employment</li>
                      <li>Company letterhead and authorized signatures</li>
                    </ul>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowLetterModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmitLetter}
                  >
                    <Icon icon="heroicons-solid:document-download" className="me-1" />
                    Generate & Download Letter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORT MODAL */}
        {showReportModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmation Reports</h5>
                  <button className="btn-close" onClick={() => setShowReportModal(false)}></button>
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={reportFilters.startDate}
                        onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={reportFilters.endDate}
                        onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Department</label>
                      <select
                        className="form-select"
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

                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={reportFilters.status}
                        onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}
                      >
                        <option value="all">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending_approval">Pending Approval</option>
                        <option value="extended">Extended</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <div className="card">
                        <div className="card-header bg-light">
                          <strong>Report Preview</strong>
                        </div>
                        <div className="card-body">
                          <p>This report will include:</p>
                          <ul>
                            <li>Confirmation statistics and analytics</li>
                            <li>Employee-wise confirmation status</li>
                            <li>Department-wise confirmation rates</li>
                            <li>Extension analysis</li>
                            <li>Time-to-confirmation metrics</li>
                          </ul>
                          <p className="mb-0">
                            Total records: <strong>{filteredEmployees.length}</strong> employees
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowReportModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleGenerateReport}
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

       {/* DETAILS MODAL */}
{showDetailModal && selectedEmployee && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}
  >
    <div
      style={{
        width: "95%",
        maxWidth: "1200px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        maxHeight: "95vh",
        overflowY: "auto"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h3 style={{ margin: 0 }}>
          Employee Details - {selectedEmployee.name}
        </h3>
        <button
          onClick={() => setShowDetailModal(false)}
          style={{
            border: "none",
            background: "none",
            fontSize: "20px",
            cursor: "pointer"
          }}
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div style={{ padding: "20px" }}>
        {/* Top Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginBottom: "20px"
          }}
        >
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h2 style={{ marginBottom: "5px" }}>
              {selectedEmployee.name}
            </h2>
            <p style={{ color: "#666", marginBottom: "10px" }}>
              {selectedEmployee.designation} • {selectedEmployee.department}
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {getStatusBadge(selectedEmployee.status)}
              {getEligibilityBadge(selectedEmployee.confirmationEligibility)}
            </div>
          </div>

          <div style={{ minWidth: "200px" }}>
            {selectedEmployee.status !== "confirmed" &&
              selectedEmployee.status !== "terminated" && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleInitiateReview(selectedEmployee);
                  }}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#0d6efd",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%"
                  }}
                >
                  Initiate Review
                </button>
              )}
          </div>
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "20px"
          }}
        >
          {/* Probation Card */}
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "15px"
            }}
          >
            <h4>Probation & Confirmation Details</h4>
            <p><strong>Joining:</strong> {formatDate(selectedEmployee.joiningDate)}</p>
            <p><strong>Confirmation Due:</strong> {formatDate(selectedEmployee.confirmationDueDate)}</p>
            <p><strong>Days Remaining:</strong> {selectedEmployee.daysRemaining} days</p>
            <p><strong>Probation Period:</strong> {selectedEmployee.probationPeriod} days</p>
          </div>

          {/* Workflow Card */}
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "15px"
            }}
          >
            <h4>Approval Workflow</h4>
            <div>{getRecommendationBadge(selectedEmployee.managerRecommendation)}</div>
            <div>{getRecommendationBadge(selectedEmployee.hrRecommendation)}</div>
            <div>{getRecommendationBadge(selectedEmployee.departmentHeadApproval)}</div>
            <div>{getRecommendationBadge(selectedEmployee.confirmationAuthority)}</div>
          </div>
        </div>

        {/* Review History */}
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "15px"
          }}
        >
          <h4>Review History</h4>
          <p>30 Day: {selectedEmployee.review30.completed ? "Completed" : "Pending"}</p>
          <p>60 Day: {selectedEmployee.review60.completed ? "Completed" : "Pending"}</p>
          <p>90 Day: {selectedEmployee.review90.completed ? "Completed" : "Pending"}</p>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "15px 20px",
          borderTop: "1px solid #ddd",
          textAlign: "right"
        }}
      >
        <button
          onClick={() => setShowDetailModal(false)}
          style={{
            padding: "8px 14px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default EmployeeConfirmation;