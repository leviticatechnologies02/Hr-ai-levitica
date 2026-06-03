import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProbationManagement = () => {
  // ---------------- INITIAL DATA ----------------
  const initialProbationEmployees = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'Rajesh Kumar',
      designation: 'Software Engineer',
      department: 'Engineering',
      manager: 'Priya Sharma',
      hrBusinessPartner: 'Anita Verma',
      joiningDate: '2024-01-15',
      probationEndDate: '2024-04-15',
      probationPeriod: '90',
      daysRemaining: 75,
      status: 'in_progress',
      riskLevel: 'low',
      progress: 66,
      review30: { completed: true, date: '2024-02-15', rating: 'Exceeds Expectations' },
      review60: { completed: true, date: '2024-03-15', rating: 'Meets Expectations' },
      review90: { completed: false, date: '2024-04-01', rating: null },
      currentRating: 'Meets Expectations',
      nextReviewDate: '2024-04-01',
      contactEmail: 'rajesh@company.com',
      contactPhone: '+91-9876543210',
      lastReviewDate: '2024-03-15',
      extensionCount: 0,
      probationType: 'regular',
      noticePeriod: '60',
      workLocation: 'Bangalore',
      employmentType: 'Permanent',
      salary: '₹8,50,000',
      skills: ['React', 'Node.js', 'MongoDB'],
      trainingCompleted: ['Orientation', 'Code of Conduct', 'Security Training']
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
      probationEndDate: '2024-05-01',
      probationPeriod: '90',
      daysRemaining: 90,
      status: 'under_review',
      riskLevel: 'low',
      progress: 33,
      review30: { completed: true, date: '2024-03-03', rating: 'Exceeds Expectations' },
      review60: { completed: false, date: '2024-04-01', rating: null },
      review90: { completed: false, date: '2024-05-01', rating: null },
      currentRating: 'Exceeds Expectations',
      nextReviewDate: '2024-04-01',
      contactEmail: 'sneha@company.com',
      contactPhone: '+91-9876543211',
      lastReviewDate: '2024-03-03',
      extensionCount: 0,
      probationType: 'regular',
      noticePeriod: '60',
      workLocation: 'Mumbai',
      employmentType: 'Permanent',
      salary: '₹6,00,000',
      skills: ['Recruitment', 'Employee Relations', 'HR Policies'],
      trainingCompleted: ['Orientation', 'POSH Training']
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
      probationEndDate: '2024-03-01',
      probationPeriod: '90',
      daysRemaining: 15,
      status: 'extended',
      riskLevel: 'high',
      progress: 100,
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
      probationType: 'extended',
      noticePeriod: '60',
      workLocation: 'Delhi',
      employmentType: 'Permanent',
      salary: '₹7,00,000',
      skills: ['Sales', 'Negotiation', 'CRM'],
      trainingCompleted: ['Orientation', 'Sales Training']
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
      probationEndDate: '2024-04-01',
      probationPeriod: '90',
      daysRemaining: 30,
      status: 'at_risk',
      riskLevel: 'high',
      progress: 80,
      review30: { completed: false, date: null, rating: null },
      review60: { completed: true, date: '2024-02-20', rating: 'Unsatisfactory' },
      review90: { completed: false, date: null, rating: null },
      currentRating: 'Unsatisfactory',
      nextReviewDate: '2024-03-20',
      contactEmail: 'priya@company.com',
      contactPhone: '+91-9876543213',
      lastReviewDate: '2024-02-20',
      extensionCount: 0,
      probationType: 'regular',
      noticePeriod: '60',
      workLocation: 'Chennai',
      employmentType: 'Permanent',
      salary: '₹9,00,000',
      skills: ['Digital Marketing', 'Brand Management', 'SEO'],
      trainingCompleted: ['Orientation', 'Marketing Fundamentals']
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
      probationEndDate: '2024-05-15',
      probationPeriod: '90',
      daysRemaining: 105,
      status: 'in_progress',
      riskLevel: 'medium',
      progress: 25,
      review30: { completed: true, date: '2024-03-15', rating: 'Meets Expectations' },
      review60: { completed: false, date: null, rating: null },
      review90: { completed: false, date: null, rating: null },
      currentRating: 'Meets Expectations',
      nextReviewDate: '2024-03-30',
      contactEmail: 'suresh@company.com',
      contactPhone: '+91-9876543214',
      lastReviewDate: '2024-03-15',
      extensionCount: 0,
      probationType: 'regular',
      noticePeriod: '60',
      workLocation: 'Hyderabad',
      employmentType: 'Permanent',
      salary: '₹7,50,000',
      skills: ['Manual Testing', 'Automation', 'Selenium'],
      trainingCompleted: ['Orientation', 'QA Process']
    }
  ];

  const initialReviewHistory = [
    {
      id: 1,
      employeeId: 'EMP001',
      reviewType: '30 DAY REVIEW',
      reviewDate: '2024-02-15',
      reviewer: 'Priya Sharma',
      rating: 'Exceeds Expectations',
      managerComments: 'Excellent performance, quick learner. Shows great potential.',
      hrComments: 'Good cultural fit. Engages well with team.',
      selfAssessment: 'I have adapted well to the team and completed all assigned tasks.',
      recommendations: 'Continue current trajectory',
      status: 'completed',
      attachments: ['review_report_1.pdf'],
      actionItems: ['Complete advanced React course', 'Take ownership of login module']
    },
    {
      id: 2,
      employeeId: 'EMP001',
      reviewType: '60 DAY REVIEW',
      reviewDate: '2024-03-15',
      reviewer: 'Priya Sharma',
      rating: 'Meets Expectations',
      managerComments: 'Good progress overall. Needs improvement in documentation.',
      hrComments: 'Performance is satisfactory. Should work on time management.',
      selfAssessment: 'I have improved my coding skills but need to work on documentation.',
      recommendations: 'Focus on documentation skills',
      status: 'completed',
      attachments: ['review_report_2.pdf'],
      actionItems: ['Improve code documentation', 'Mentor new junior developer']
    }
  ];

  // ---------------- STATE VARIABLES ----------------
  const [probationEmployees, setProbationEmployees] = useState(initialProbationEmployees);
  const [reviewHistory, setReviewHistory] = useState(initialReviewHistory);

  // UI States
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
  const [reviewStep, setReviewStep] = useState('self'); // self, manager, skip_level, hr

  // Add to UI States section
const [showConfirmationLetterViewModal, setShowConfirmationLetterViewModal] = useState(false);
 
// Selected items
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Form States
const [newEmployee, setNewEmployee] = useState({
  name: '',
  employeeId: '',
  email: '',           // New field
  phone: '',           // New field
  designation: '',
  department: 'Engineering',
  manager: '',
  hrBusinessPartner: '', // New field
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

// Update the bulkAction state initialization
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

// Add these handler functions
const handleBulkActionSubmit = (e) => {
  e.preventDefault();
  
  const selectedEmployeesData = probationEmployees.filter(
    emp => selectedEmployees.includes(emp.id)
  );
  
  switch(bulkAction.action) {
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

// 1. Bulk Schedule Review
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
  showVisualFeedback(`Reviews scheduled for ${employees.length} employees`);
};

// 2. Bulk Send Reminder
const handleBulkSendReminder = (employees) => {
  // Simulate sending reminders
  const reminderData = {
    type: bulkAction.reminderType,
    count: employees.length,
    message: bulkAction.message,
    notifyEmployee: bulkAction.notifyEmployee,
    notifyManager: bulkAction.notifyManager,
    employees: employees.map(emp => ({
      name: emp.name,
      email: emp.contactEmail,
      manager: emp.manager,
      nextReviewDate: emp.nextReviewDate
    }))
  };
  
  // Log the reminder data (in real app, this would be an API call)
  console.log('Reminders sent:', reminderData);
  
  showVisualFeedback(`Reminders sent to ${employees.length} employees`);
};

// 3. Bulk Extend Probation
const handleBulkExtendProbation = (employees) => {
  const updatedEmployees = probationEmployees.map(emp => {
    if (selectedEmployees.includes(emp.id)) {
      const extensionDays = parseInt(bulkAction.extensionDays);
      const currentEndDate = new Date(emp.probationEndDate);
      currentEndDate.setDate(currentEndDate.getDate() + extensionDays);
      
      return {
        ...emp,
        status: 'extended',
        probationEndDate: currentEndDate.toISOString().split('T')[0],
        extensionCount: (emp.extensionCount || 0) + 1,
        extendedTo: currentEndDate.toISOString().split('T')[0],
        daysRemaining: calculateDaysRemaining(currentEndDate),
        riskLevel: 'high',
        progress: Math.min(100, emp.progress + 10)
      };
    }
    return emp;
  });
  
  setProbationEmployees(updatedEmployees);
  showVisualFeedback(`Probation extended for ${employees.length} employees`);
};

// 4. Bulk Confirm Employees
const handleBulkConfirmEmployees = (employees) => {
  const updatedEmployees = probationEmployees.map(emp => {
    if (selectedEmployees.includes(emp.id)) {
      const confirmationDate = bulkAction.effectiveDate || new Date().toISOString().split('T')[0];
      const letterId = bulkAction.generateLetters ? `CONF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}-${emp.employeeId}` : null;
      
      return {
        ...emp,
        status: 'completed',
        progress: 100,
        confirmationDate: confirmationDate,
        confirmationLetterId: letterId,
        currentRating: 'Meets Expectations'
      };
    }
    return emp;
  });
  
  setProbationEmployees(updatedEmployees);
  showVisualFeedback(`${employees.length} employees confirmed successfully`);
};

// 5. Bulk Export Data
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
      // Include additional data based on checkboxes
      ...(bulkAction.includePersonalInfo && {
        email: emp.contactEmail,
        phone: emp.contactPhone,
        manager: emp.manager,
        workLocation: emp.workLocation,
        joiningDate: emp.joiningDate,
        probationPeriod: emp.probationPeriod
      }),
      ...(bulkAction.includeProgressData && {
        review30: emp.review30,
        review60: emp.review60,
        review90: emp.review90,
        extensionCount: emp.extensionCount,
        nextReviewDate: emp.nextReviewDate
      }),
      ...(bulkAction.includeRatings && {
        allRatings: {
          current: emp.currentRating,
          review30: emp.review30.rating,
          review60: emp.review60.rating,
          review90: emp.review90.rating
        }
      }),
      ...(bulkAction.includeReviewHistory && {
        reviews: reviewHistory.filter(r => r.employeeId === emp.employeeId)
      })
    }))
  };
  
  // Generate and download PDF file
  generatePDFFile(exportData);
  
  showVisualFeedback(`Exported ${employees.length} employee records as PDF`);
};

// Generate PDF File (HTML-based PDF)
const generatePDFFile = (exportData) => {
  // Create a detailed HTML report that can be saved as PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Probation Management Report</title>
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .report-header {
          background-color: #2c3e50;
          color: white;
          padding: 20px;
          margin-bottom: 30px;
          border-radius: 5px;
        }
        .report-title {
          font-size: 28px;
          margin: 0;
          padding: 0;
        }
        .report-subtitle {
          font-size: 16px;
          margin: 5px 0 0 0;
          opacity: 0.9;
        }
        .report-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 14px;
        }
        .summary-section {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          border-left: 4px solid #3498db;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .summary-item {
          text-align: center;
          padding: 10px;
          background: white;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-number {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
        }
        .summary-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 5px;
        }
        .employee-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-size: 12px;
        }
        .employee-table th {
          background-color: #34495e;
          color: white;
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
        }
        .employee-table td {
          padding: 8px;
          border: 1px solid #ddd;
          vertical-align: top;
        }
        .employee-table tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        .status-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
        }
        .status-in_progress { background-color: #e3f2fd; color: #1976d2; }
        .status-completed { background-color: #e8f5e9; color: #388e3c; }
        .status-extended { background-color: #e1f5fe; color: #0288d1; }
        .status-at_risk { background-color: #ffebee; color: #d32f2f; }
        .status-terminated { background-color: #f5f5f5; color: #616161; }
        .progress-bar {
          width: 100%;
          height: 6px;
          background-color: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background-color: #4caf50;
        }
        .risk-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
        }
        .risk-low { background-color: #e8f5e9; color: #388e3c; }
        .risk-medium { background-color: #fff3e0; color: #f57c00; }
        .risk-high { background-color: #ffebee; color: #d32f2f; }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #eee;
          font-size: 12px;
          color: #7f8c8d;
          text-align: center;
        }
        .page-break {
          page-break-before: always;
        }
        .section-title {
          font-size: 18px;
          color: #2c3e50;
          margin: 25px 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <h1 class="report-title">Probation Management Report</h1>
        <p class="report-subtitle">Employee Probation Status Report</p>
        <div class="report-meta">
          <div>
            <strong>Generated:</strong> ${new Date().toLocaleString()}
          </div>
          <div>
            <strong>Total Employees:</strong> ${exportData.employees.length}
          </div>
        </div>
      </div>
  
      
      <div class="section-title">Employee Probation Details</div>
      
      <table class="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Risk Level</th>
            <th>Current Rating</th>
            <th>Probation End Date</th>
            <th>Days Remaining</th>
          </tr>
        </thead>
        <tbody>
          ${exportData.employees.map(emp => `
            <tr>
              <td><strong>${emp.employeeId}</strong></td>
              <td>${emp.name}</td>
              <td>${emp.department}</td>
              <td>${emp.designation}</td>
              <td>
                <span class="status-badge status-${emp.status}">
                  ${emp.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </td>
              <td>
                <div>${emp.progress}%</div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${emp.progress}%"></div>
                </div>
              </td>
              <td>
                <span class="risk-badge risk-${emp.riskLevel}">
                  ${emp.riskLevel.replace(/\b\w/g, l => l.toUpperCase())} Risk
                </span>
              </td>
              <td>${emp.currentRating}</td>
              <td>${emp.probationEndDate}</td>
              <td>
                <strong style="color: ${
                  emp.daysRemaining <= 0 ? '#d32f2f' :
                  emp.daysRemaining <= 7 ? '#f57c00' :
                  emp.daysRemaining <= 30 ? '#fbc02d' : '#388e3c'
                }">
                  ${emp.daysRemaining <= 0 ? `${Math.abs(emp.daysRemaining)} days overdue` : `${emp.daysRemaining} days`}
                </strong>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      ${bulkAction.includePersonalInfo ? `
        <div class="page-break"></div>
        <div class="section-title">Personal Information</div>
        <table class="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Manager</th>
              <th>Work Location</th>
              <th>Joining Date</th>
              <th>Probation Period</th>
            </tr>
          </thead>
          <tbody>
            ${exportData.employees.map(emp => `
              <tr>
                <td>${emp.employeeId}</td>
                <td>${emp.name}</td>
                <td>${emp.email || 'N/A'}</td>
                <td>${emp.phone || 'N/A'}</td>
                <td>${emp.manager || 'N/A'}</td>
                <td>${emp.workLocation || 'N/A'}</td>
                <td>${emp.joiningDate || 'N/A'}</td>
                <td>${emp.probationPeriod || 'N/A'} days</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
      
      ${bulkAction.includeProgressData ? `
        <div class="page-break"></div>
        <div class="section-title">Progress & Review Data</div>
        <table class="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>30-Day Review</th>
              <th>60-Day Review</th>
              <th>90-Day Review</th>
              <th>Next Review Date</th>
              <th>Extensions</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            ${exportData.employees.map(emp => `
              <tr>
                <td>${emp.employeeId}</td>
                <td>${emp.name}</td>
                <td>
                  ${emp.review30?.completed ? '✓ Completed' : 'Pending'}
                  ${emp.review30?.rating ? `<br><small>Rating: ${emp.review30.rating}</small>` : ''}
                </td>
                <td>
                  ${emp.review60?.completed ? '✓ Completed' : 'Pending'}
                  ${emp.review60?.rating ? `<br><small>Rating: ${emp.review60.rating}</small>` : ''}
                </td>
                <td>
                  ${emp.review90?.completed ? '✓ Completed' : 'Pending'}
                  ${emp.review90?.rating ? `<br><small>Rating: ${emp.review90.rating}</small>` : ''}
                </td>
                <td>${emp.nextReviewDate || 'N/A'}</td>
                <td>${emp.extensionCount || 0}</td>
                <td>${emp.progress}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
      
      ${bulkAction.includeRatings ? `
        <div class="page-break"></div>
        <div class="section-title">Performance Ratings</div>
        <table class="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Current Rating</th>
              <th>30-Day Rating</th>
              <th>60-Day Rating</th>
              <th>90-Day Rating</th>
              <th>Performance Trend</th>
            </tr>
          </thead>
          <tbody>
            ${exportData.employees.map(emp => {
              const ratings = [
                emp.allRatings?.review30,
                emp.allRatings?.review60,
                emp.allRatings?.review90,
                emp.allRatings?.current
              ].filter(r => r && r !== 'Not Rated');
              
              const trend = ratings.length >= 2 ? 
                (ratings[ratings.length - 1] === ratings[ratings.length - 2] ? 'Stable' :
                 ratings[ratings.length - 1] > ratings[ratings.length - 2] ? 'Improving' : 'Declining') : 
                'Insufficient Data';
              
              return `
                <tr>
                  <td>${emp.employeeId}</td>
                  <td>${emp.name}</td>
                  <td><strong>${emp.currentRating}</strong></td>
                  <td>${emp.allRatings?.review30 || 'Not Rated'}</td>
                  <td>${emp.allRatings?.review60 || 'Not Rated'}</td>
                  <td>${emp.allRatings?.review90 || 'Not Rated'}</td>
                  <td>${trend}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      ` : ''}
      

    </body>
    </html>
  `;
  
  // Create and download the HTML file (users can save as PDF)
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Probation_Report_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


// Visual Feedback System (No Popups)
const showVisualFeedback = (message) => {
  // Create a toast notification
  const toastContainer = document.createElement('div');
  toastContainer.className = 'position-fixed top-0 end-0 p-3';
  toastContainer.style.zIndex = '9999';
  
  const toastId = `toast-${Date.now()}`;
  toastContainer.innerHTML = `
    <div id="${toastId}" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-success text-white">
        <strong class="me-auto">Success</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `;
  
  document.body.appendChild(toastContainer);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    const toastElement = document.getElementById(toastId);
    if (toastElement) {
      toastElement.classList.remove('show');
      setTimeout(() => {
        if (toastContainer.parentNode) {
          toastContainer.remove();
        }
      }, 300);
    }
  }, 3000);
  
  // Close button functionality
  const closeBtn = toastContainer.querySelector('.btn-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (toastContainer.parentNode) {
        toastContainer.remove();
      }
    });
  }
};
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
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ---------------- STATISTICS ----------------
  const stats = {
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

  // ---------------- HELPER FUNCTIONS ----------------
// Update calculateDaysRemaining
const calculateDaysRemaining = (endDate) => {
  if (!isValidDate(endDate)) return 0;
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};


// Update formatDate to use safeFormatDate
const formatDate = (date) => {
  return safeFormatDate(date);
};

// Update calculateNextReviewDate
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

const handleAddEmployee = (e) => {
  e.preventDefault();
  
  // Validate joining date
  if (!isValidDate(newEmployee.joiningDate)) {
    alert('Please enter a valid joining date');
    return;
  }
  
  // Calculate probation end date safely
  const joiningDate = new Date(newEmployee.joiningDate);
  const probationEndDate = new Date(joiningDate);
  probationEndDate.setDate(probationEndDate.getDate() + parseInt(newEmployee.probationPeriod));
  
  // Calculate progress based on days passed since joining
  const today = new Date();
  const daysSinceJoining = Math.max(0, Math.floor((today - joiningDate) / (1000 * 60 * 60 * 24)));
  const totalProbationDays = parseInt(newEmployee.probationPeriod);
  const calculatedProgress = Math.min(100, Math.round((daysSinceJoining / totalProbationDays) * 100));
  
  // Calculate days remaining
  const daysRemaining = calculateDaysRemaining(probationEndDate);
  
  // Calculate initial risk level based on days remaining
  let initialRiskLevel = 'low';
  if (daysRemaining <= 30) {
    initialRiskLevel = 'medium';
  }
  if (daysRemaining <= 7) {
    initialRiskLevel = 'high';
  }
  
  // Check if reviews should be auto-completed based on days since joining
  const review30Completed = daysSinceJoining >= 30;
  const review60Completed = daysSinceJoining >= 60;
  const review90Completed = daysSinceJoining >= 90;
  
  const newEmp = {
    ...newEmployee,
    id: probationEmployees.length + 1,
    employeeId: newEmployee.employeeId || `EMP${String(probationEmployees.length + 1).padStart(3, '0')}`,
    status: 'in_progress',
    riskLevel: initialRiskLevel, // Set based on days remaining
    progress: calculatedProgress, // Calculate based on days passed
    review30: { 
      completed: review30Completed, 
      date: review30Completed ? calculateNextReviewDate(newEmployee.joiningDate, 30) : null, 
      rating: review30Completed ? 'Not Rated' : null 
    },
    review60: { 
      completed: review60Completed, 
      date: review60Completed ? calculateNextReviewDate(newEmployee.joiningDate, 60) : null, 
      rating: review60Completed ? 'Not Rated' : null 
    },
    review90: { 
      completed: review90Completed, 
      date: review90Completed ? calculateNextReviewDate(newEmployee.joiningDate, 90) : null, 
      rating: review90Completed ? 'Not Rated' : null 
    },
    currentRating: 'Not Rated',
    nextReviewDate: calculateNextReviewDate(newEmployee.joiningDate, 30),
    probationEndDate: probationEndDate.toISOString().split('T')[0],
    daysRemaining: daysRemaining,
    extensionCount: 0,
    hrBusinessPartner: 'Anita Verma', // Default HR
    contactEmail: `${newEmployee.name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
    contactPhone: '+91-9876543210',
    lastReviewDate: null,
    probationType: 'regular',
    noticePeriod: '60',
    workLocation: newEmployee.workLocation || 'Bangalore',
    employmentType: newEmployee.employmentType || 'Permanent',
    salary: `₹${(Math.floor(Math.random() * 500000) + 500000).toLocaleString('en-IN')}`,
    skills: [],
    trainingCompleted: ['Orientation']
  };
  
  setProbationEmployees([...probationEmployees, newEmp]);
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
  
  alert(`Employee ${newEmp.name} added to probation tracking`);
};

// Function to generate and download confirmation letter as PDF
const generateConfirmationLetterPDF = (employee) => {
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Confirmation Letter - ${employee.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman:wght@400;700&display=swap');
        
        body {
          font-family: 'Times New Roman', serif;
          margin: 0;
          padding: 0;
          color: #333;
          line-height: 1.6;
          text-align: justify;
        }
        
        .page {
          padding: 60px 80px;
          min-height: 100vh;
          box-sizing: border-box;
        }
        
        .letter-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #2c3e50;
        }
        
        .letter-title {
          font-size: 28px;
          font-weight: bold;
          color: #2c3e50;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        
        .company-info {
          text-align: right;
          margin-bottom: 30px;
          font-size: 14px;
          color: #666;
        }
        
        .company-info p {
          margin: 4px 0;
        }
        
        .recipient-section {
          margin-bottom: 25px;
        }
        
        .recipient-label {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 16px;
        }
        
        .recipient-details {
          margin-left: 30px;
          line-height: 1.6;
        }
        
        .recipient-details p {
          margin: 4px 0;
          text-align: left;
        }
        
        .subject-line {
          font-weight: bold;
          color: #2c3e50;
          margin: 25px 0 20px 0;
          font-size: 17px;
          padding-bottom: 8px;
          border-bottom: 1px solid #eee;
          text-align: center;
        }
        
        .letter-body {
          margin-bottom: 40px;
          text-align: justify;
        }
        
        .letter-body p {
          margin-bottom: 15px;
          text-indent: 40px;
        }
        
        .employment-details-box {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .details-title {
          color: #2c3e50;
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 15px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #ddd;
          text-align: center;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .detail-item {
          margin-bottom: 12px;
          text-align: left;
        }
        
        .detail-label {
          font-weight: bold;
          color: #555;
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
        }
        
        .detail-value {
          font-size: 14px;
          color: #333;
          display: block;
        }
        
        .signature-section {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }
        
        .signature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 30px;
        }
        
        .signature-block {
          text-align: center;
        }
        
        .signature-title {
          font-weight: bold;
          margin-bottom: 30px;
          font-size: 15px;
          text-align: center;
        }
        
        .signature-line {
          width: 250px;
          height: 1px;
          background-color: #333;
          margin: 0 auto 8px auto;
        }
        
        .signature-details {
          margin-top: 15px;
          font-size: 13px;
        }
        
        .signature-details p {
          margin: 4px 0;
          text-align: center;
        }
        
        .footer-note {
          margin-top: 40px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 11px;
          color: #666;
        }
        
        .footer-note p {
          margin: 3px 0;
        }
        
        .page-break {
          page-break-before: always;
          padding-top: 40px;
        }
        
        .status-header {
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 12px;
          margin-bottom: 25px;
          text-align: center;
          font-size: 22px;
        }
        
        .status-table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          font-size: 13px;
        }
        
        .status-table th {
          background-color: #f8f9fa;
          padding: 10px;
          text-align: left;
          border: 1px solid #dee2e6;
          font-weight: bold;
          color: #495057;
          width: 35%;
        }
        
        .status-table td {
          padding: 10px;
          border: 1px solid #dee2e6;
          vertical-align: top;
          text-align: left;
        }
        
        .status-table tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        
        h3 {
          color: #2c3e50;
          margin-bottom: 15px;
          font-size: 16px;
          text-align: left;
        }
        
        .notes-box {
          margin-top: 30px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 6px;
          border-left: 4px solid #3498db;
        }
        
        .notes-title {
          color: #2c3e50;
          margin: 0 0 12px 0;
          font-size: 15px;
          font-weight: bold;
          text-align: left;
        }
        
        .notes-list {
          margin: 0;
          padding-left: 20px;
          text-align: left;
        }
        
        .notes-list li {
          margin-bottom: 8px;
          line-height: 1.4;
        }
        
        /* Alignment classes */
        .text-left {
          text-align: left;
        }
        
        .text-center {
          text-align: center;
        }
        
        .text-right {
          text-align: right;
        }
        
        .text-justify {
          text-align: justify;
        }
        
        .mb-10 {
          margin-bottom: 10px;
        }
        
        .mb-20 {
          margin-bottom: 20px;
        }
        
        .mb-30 {
          margin-bottom: 30px;
        }
        
        .mt-20 {
          margin-top: 20px;
        }
        
        .mt-30 {
          margin-top: 30px;
        }
        
        @media print {
          .page {
            padding: 40px 60px;
          }
          .page-break {
            padding-top: 20px;
          }
        }
      </style>
    </head>
    <body>
      <!-- Page 1: Confirmation Letter -->
      <div class="page">
        <div class="letter-header">
          <h1 class="letter-title">CONFIRMATION LETTER</h1>
          <p style="color: #666; margin: 5px 0; font-size: 14px;">Official Employment Confirmation Document</p>
        </div>
        
        <div class="company-info">
          <p><strong>Letter ID:</strong> ${employee.confirmationLetterId}</p>
          <p><strong>Date:</strong> ${formatDate(employee.confirmationDate || employee.probationEndDate)}</p>
          <p><strong>Ref No:</strong> CL/${new Date().getFullYear()}/${String(Date.now()).slice(-6)}</p>
        </div>
        
        <div class="recipient-section">
          <div class="recipient-label">To:</div>
          <div class="recipient-details">
            <p style="font-size: 16px; font-weight: bold; margin: 0 0 4px 0;">${employee.name}</p>
            <p style="margin: 4px 0;">${employee.designation}</p>
            <p style="margin: 4px 0;">${employee.department}</p>
            <p style="margin: 4px 0;">${employee.workLocation}</p>
            <p style="margin: 4px 0;">Employee ID: ${employee.employeeId}</p>
          </div>
        </div>
        
        <div class="subject-line">
          Subject: Confirmation of Permanent Employment
        </div>
        
        <div class="letter-body">
          <p>Dear ${employee.name.split(' ')[0] || employee.name},</p>
          
          <p>
            We are pleased to inform you that your probation period has been successfully completed, 
            and you are hereby confirmed as a permanent employee of the company effective 
            <strong style="color: #2c3e50;">${formatDate(employee.confirmationDate || employee.probationEndDate)}</strong>.
          </p>
          
          <p>
            Your performance during the probation period has been thoroughly evaluated and found to be satisfactory. 
            The management appreciates your dedication, professionalism, and commitment to the organization's goals 
            and values.
          </p>
          
          <div class="employment-details-box">
            <h3 class="details-title">EMPLOYMENT DETAILS</h3>
            <div class="details-grid">
              <div class="text-left">
                <div class="detail-item">
                  <span class="detail-label">Designation</span>
                  <span class="detail-value">${employee.designation}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Department</span>
                  <span class="detail-value">${employee.department}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Reporting Manager</span>
                  <span class="detail-value">${employee.manager}</span>
                </div>
              </div>
              <div class="text-left">
                <div class="detail-item">
                  <span class="detail-label">Employment Type</span>
                  <span class="detail-value">${employee.employmentType}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Work Location</span>
                  <span class="detail-value">${employee.workLocation}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date of Joining</span>
                  <span class="detail-value">${formatDate(employee.joiningDate)}</span>
                </div>
              </div>
            </div>
            ${employee.salary ? `
            <div class="detail-item" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #ddd; text-align: center;">
              <span class="detail-label">Salary (Confirmed)</span>
              <span class="detail-value" style="font-size: 15px; color: #2c3e50; font-weight: bold;">${employee.salary}</span>
            </div>
            ` : ''}
          </div>
          
          <p>
            As a confirmed permanent employee, you are now entitled to all benefits and privileges as per the 
            company's policies and procedures. Your current salary, allowances, and other terms of employment 
            remain unchanged unless formally notified in writing by the Human Resources Department.
          </p>
          
          <p>
            We look forward to your continued contribution to the growth and success of our organization. 
            Your skills and dedication are valuable assets, and we are confident that you will continue to 
            excel in your role and contribute positively to our team.
          </p>
          
          <p>
            Should you have any questions or require clarification regarding your employment terms, benefits, 
            or any other matter, please do not hesitate to contact your HR Business Partner or the 
            Human Resources Department.
          </p>
          
          <p style="font-weight: bold; color: #2c3e50; margin-top: 20px; text-align: center;">
            Congratulations once again on your confirmation as a permanent employee!
          </p>
        </div>
        
        <div class="signature-section">
          <div class="signature-grid">
            <div class="signature-block">
              <div class="signature-title">FOR THE COMPANY</div>
              <div class="signature-line"></div>
              <div class="signature-details">
                <p>Authorized Signatory</p>
                <p>Human Resources Department</p>
                <p>[Company Name]</p>
                <p>Date: ${formatDate(new Date().toISOString().split('T')[0])}</p>
              </div>
            </div>
            
            <div class="signature-block">
              <div class="signature-title">ACCEPTED BY EMPLOYEE</div>
              <div class="signature-line"></div>
              <div class="signature-details">
                <p>Signature</p>
                <p>Name: ${employee.name}</p>
                <p>Employee ID: ${employee.employeeId}</p>
                <p>Date: ________________</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer-note">
          <p>This is an official system-generated confirmation letter. For any discrepancies or verification, 
          please contact the Human Resources Department with the Letter ID mentioned above.</p>
          <p style="margin-top: 8px;">Document Version: 1.0 | Generated by Probation Management System</p>
        </div>
      </div>
      
      <!-- Page 2: Status and Details -->
      <div class="page page-break">
        <h2 class="status-header">CONFIRMATION LETTER STATUS & DETAILS</h2>
        
        <div class="mb-30">
          <h3>Document Information</h3>
          <table class="status-table">
            <tr>
              <th>Document Type</th>
              <td>Employment Confirmation Letter</td>
            </tr>
            <tr>
              <th>Letter ID</th>
              <td>${employee.confirmationLetterId}</td>
            </tr>
            <tr>
              <th>Employee Name</th>
              <td>${employee.name}</td>
            </tr>
            <tr>
              <th>Employee ID</th>
              <td>${employee.employeeId}</td>
            </tr>
            <tr>
              <th>Designation</th>
              <td>${employee.designation}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>${employee.department}</td>
            </tr>
          </table>
        </div>
        
        <div class="mb-30">
          <h3>Timeline Information</h3>
          <table class="status-table">
            <tr>
              <th>Date of Joining</th>
              <td>${formatDate(employee.joiningDate)}</td>
            </tr>
            <tr>
              <th>Probation Period</th>
              <td>${employee.probationPeriod} days</td>
            </tr>
            <tr>
              <th>Probation End Date</th>
              <td>${formatDate(employee.probationEndDate)}</td>
            </tr>
            <tr>
              <th>Confirmation Effective Date</th>
              <td>${formatDate(employee.confirmationDate || employee.probationEndDate)}</td>
            </tr>
            <tr>
              <th>Letter Generated On</th>
              <td>${formatDate(new Date().toISOString().split('T')[0])}</td>
            </tr>
          </table>
        </div>
        
        <div class="mb-30">
          <h3>Delivery & Acknowledgment Status</h3>
          <table class="status-table">
            <tr>
              <th>Document Status</th>
              <td><span style="color: #28a745; font-weight: bold;">✓ ACTIVE & DELIVERED</span></td>
            </tr>
            <tr>
              <th>Delivery Method</th>
              <td>Email & Employee Self-Service Portal</td>
            </tr>
            <tr>
              <th>Sent To (Email)</th>
              <td>${employee.contactEmail}</td>
            </tr>
            <tr>
              <th>Copy To (Manager)</th>
              <td>${employee.manager}</td>
            </tr>
            <tr>
              <th>Employee Acknowledgment</th>
              <td>
                <span style="color: #dc3545; font-weight: bold;">⏳ PENDING ACKNOWLEDGMENT</span><br>
                <small style="font-size: 12px;">Awaiting employee signature acceptance</small>
              </td>
            </tr>
            <tr>
              <th>HR Representative</th>
              <td>${employee.hrBusinessPartner || 'HR Manager'}</td>
            </tr>
            <tr>
              <th>Work Location</th>
              <td>${employee.workLocation}</td>
            </tr>
          </table>
        </div>
        
        <div class="notes-box">
          <h4 class="notes-title">IMPORTANT NOTES & INSTRUCTIONS</h4>
          <ol class="notes-list">
            <li>This confirmation letter is a legally binding document that serves as official proof of your permanent employment status.</li>
            <li>Please sign and return one copy of this letter to the Human Resources Department within 7 working days for our records.</li>
            <li>Keep this document in a safe place as it may be required for future reference, loan applications, or visa processing.</li>
            <li>Any changes to your employment terms will be communicated through official written communication from the HR Department.</li>
            <li>Your benefits and entitlements as a permanent employee become effective from the confirmation date mentioned above.</li>
            <li>For verification purposes, always quote the Letter ID when corresponding with the HR Department regarding this confirmation.</li>
          </ol>
        </div>
        
        <div class="mt-30" style="padding: 15px; background-color: #fff; border: 1px solid #dee2e6; border-radius: 6px;">
          <h4 style="color: #2c3e50; margin: 0 0 12px 0; font-size: 15px;">Contact Information</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="text-left">
              <p style="margin: 4px 0; font-size: 13px;"><strong>HR Department:</strong></p>
              <p style="margin: 4px 0; font-size: 13px;">Email: hr@company.com</p>
              <p style="margin: 4px 0; font-size: 13px;">Phone: +91-XX-XXXX-XXXX</p>
            </div>
            <div class="text-left">
              <p style="margin: 4px 0; font-size: 13px;"><strong>Your HR Business Partner:</strong></p>
              <p style="margin: 4px 0; font-size: 13px;">${employee.hrBusinessPartner || 'To be assigned'}</p>
              <p style="margin: 4px 0; font-size: 13px;">Email: ${employee.contactEmail.replace(/(\w+\.\w+)@/, 'hr.bp@')}</p>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #666; padding-top: 15px; border-top: 1px solid #eee;">
          <p>--- End of Document ---</p>
          <p>Page 2 of 2 | ${employee.confirmationLetterId} | Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Create and download the HTML file (users can save as PDF from browser print)
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Confirmation_Letter_${employee.employeeId}_${employee.confirmationLetterId}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Show success message
  showVisualFeedback(`Confirmation letter downloaded for ${employee.name}`);
};
  // ---------------- FILTER + SORT ----------------
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
   // Exclude archived employees by default (unless specifically filtered)
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

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  // Start Review
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

  // Schedule Review Meeting
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

  // Generate Confirmation Letter
  const handleGenerateConfirmationLetter = (employee) => {
    setSelectedEmployee(employee);
    const today = new Date();
    today.setDate(today.getDate() + 1); // Effective from tomorrow
    
    setConfirmationLetterForm({
      employeeId: employee.id,
      effectiveDate: today.toISOString().split('T')[0],
      designation: employee.designation,
      department: employee.department,
      salary: employee.salary,
      reportingManager: employee.manager,
      workLocation: employee.workLocation,
      customMessage: `Congratulations! We are pleased to confirm your employment with the company effective from ${formatDate(today.toISOString().split('T')[0])}.`,
      includeTerms: true,
      digitalSignature: true
    });
    setShowConfirmationLetterModal(true);
  };

  const handleSubmitConfirmationLetter = (e) => {
    e.preventDefault();
    
    const letterId = `CONF-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    // Update employee status
    const updatedEmployees = probationEmployees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          status: 'completed',
          progress: 100,
          confirmationDate: confirmationLetterForm.effectiveDate,
          confirmationLetterId: letterId
        };
      }
      return emp;
    });
    
    setProbationEmployees(updatedEmployees);
    setShowConfirmationLetterModal(false);
        
    // Generate the letter (in real implementation, this would call an API)
    console.log('Confirmation Letter Generated:', {
      letterId,
      employee: selectedEmployee.name,
      effectiveDate: confirmationLetterForm.effectiveDate,
      ...confirmationLetterForm
    });
  };

  // Submit Self Assessment
  const handleSubmitSelfAssessment = () => {
    if (!reviewForm.selfAssessment || !reviewForm.selfRating) {
      alert('Please complete the self-assessment form');
      return;
    }
    setReviewStep('manager');
  };

  // Submit Review
  const handleSubmitReview = (e) => {
    if (e) e.preventDefault();
    
    const updatedEmployees = probationEmployees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        const updatedEmp = { ...emp };
        
        // Update review milestones
        const reviewKey = `review${reviewForm.reviewType === '30_day' ? '30' : reviewForm.reviewType === '60_day' ? '60' : '90'}`;
        if (reviewForm.reviewType !== 'final') {
          updatedEmp[reviewKey] = {
            completed: true,
            date: reviewForm.reviewDate,
            rating: reviewForm.rating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
          };
        }
        
        // Update rating and progress
        updatedEmp.currentRating = reviewForm.rating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        updatedEmp.progress = Math.min(100, updatedEmp.progress + 25);
        
        // Update status
        if (reviewForm.reviewType === 'final') {
          if (reviewForm.recommendation === 'confirm') {
            updatedEmp.status = 'completed';
            updatedEmp.progress = 100;
          } else if (reviewForm.recommendation === 'extend') {
            updatedEmp.status = 'extended';
            updatedEmp.riskLevel = 'high';
          }
        } else if (reviewForm.recommendation === 'extend' || reviewForm.rating === 'needs_improvement' || reviewForm.rating === 'unsatisfactory') {
          updatedEmp.status = 'at_risk';
          updatedEmp.riskLevel = 'high';
        }
        
        // Update dates
        updatedEmp.lastReviewDate = reviewForm.reviewDate;
        if (reviewForm.reviewType === '30_day') {
          updatedEmp.nextReviewDate = calculateNextReviewDate(reviewForm.reviewDate, 30);
        } else if (reviewForm.reviewType === '60_day') {
          updatedEmp.nextReviewDate = calculateNextReviewDate(reviewForm.reviewDate, 30);
        } else if (reviewForm.reviewType === '90_day') {
          updatedEmp.nextReviewDate = calculateNextReviewDate(reviewForm.reviewDate, 0);
        }
        
        return updatedEmp;
      }
      return emp;
    });
    
    setProbationEmployees(updatedEmployees);
    
    // Add to review history
    const newReview = {
      id: reviewHistory.length + 1,
      employeeId: selectedEmployee.employeeId,
      reviewType: reviewForm.reviewType.replace('_', ' ').toUpperCase(),
      reviewDate: reviewForm.reviewDate,
      reviewer: 'HR Manager',
      rating: reviewForm.rating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      managerComments: reviewForm.managerComments,
      skipLevelManagerComments: reviewForm.skipLevelManagerComments,
      skipLevelManager: reviewForm.skipLevelManager,
      hrComments: reviewForm.hrComments,
      hrRecommendation: reviewForm.hrRecommendation,
      selfAssessment: reviewForm.selfAssessment,
      selfRating: reviewForm.selfRating,
      achievements: reviewForm.achievements,
      challenges: reviewForm.challenges,
      goals: reviewForm.goals,
      recommendations: reviewForm.recommendations,
      status: 'completed',
      attachments: reviewForm.attachments.map(f => f.name || f),
      actionItems: reviewForm.actionItems,
      meetingScheduled: reviewForm.meetingScheduled,
      meetingDate: reviewForm.meetingDate,
      meetingTime: reviewForm.meetingTime
    };
    
    setReviewHistory([newReview, ...reviewHistory]);
    setShowReviewModal(false);
    setReviewStep('self');
    
  };

// Update the handleExtendProbation function
const handleExtendProbation = (employee) => {
  setSelectedEmployee(employee);
  
  // Validate the probationEndDate
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

// ---------------- DATE HELPER FUNCTIONS ----------------
const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const safeFormatDate = (date) => {
  if (!date || !isValidDate(date)) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const handleSubmitExtension = (e) => {
  e.preventDefault();
  
  // Validate new end date
  if (!isValidDate(extensionForm.newEndDate)) {
    alert('Please select a valid new end date');
    return;
  }
  
  const updatedEmployees = probationEmployees.map(emp => {
    if (emp.id === selectedEmployee.id) {
      const newEndDate = new Date(extensionForm.newEndDate);
      const daysRemaining = calculateDaysRemaining(newEndDate);
      
      return {
        ...emp,
        status: 'extended',
        probationEndDate: extensionForm.newEndDate,
        extensionCount: (emp.extensionCount || 0) + 1,
        extendedTo: extensionForm.newEndDate,
        daysRemaining: daysRemaining,
        probationType: 'extended',
        riskLevel: 'high',
        progress: Math.min(100, emp.progress + 10)
      };
    }
    return emp;
  });
  
  setProbationEmployees(updatedEmployees);
  setShowExtendModal(false);
  alert(`Probation extended for ${selectedEmployee.name} until ${formatDate(extensionForm.newEndDate)}`);
};

  // Confirm Employee
  const handleConfirmEmployee = () => {
    // Generate confirmation letter first
    handleGenerateConfirmationLetter(selectedEmployee);
    setShowConfirmModal(false);
  };

  // Early Confirmation
  const handleEarlyConfirmation = (employee) => {
    setSelectedEmployee(employee);
    if (employee.progress >= 80) {
      setShowConfirmModal(true);
    } else {
      alert('Employee progress must be at least 80% for early confirmation. Current progress: ' + employee.progress + '%');
    }
  };

  // Terminate Probation
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

  const handleSubmitTermination = (e) => {
    e.preventDefault();
    
    const updatedEmployees = probationEmployees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          status: 'terminated',
          terminationDate: terminationForm.effectiveDate,
          terminationReason: terminationForm.reason,
          terminationComments: terminationForm.comments,
          progress: 0
        };
      }
      return emp;
    });
    
    setProbationEmployees(updatedEmployees);
    setShowTerminateModal(false);
    alert(`Probation terminated for ${selectedEmployee.name}`);
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


  // Get milestone reminder type for an employee
  const getMilestoneReminderType = (employee) => {
    const today = new Date();
    const joiningDate = new Date(employee.joiningDate);
    const daysSinceJoining = Math.floor((today - joiningDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceJoining >= 25 && daysSinceJoining <= 35 && !employee.review30.completed) {
      return '30 Day Review Reminder';
    }
    if (daysSinceJoining >= 55 && daysSinceJoining <= 65 && !employee.review60.completed) {
      return '60 Day Review Reminder';
    }
    if (daysSinceJoining >= 85 && daysSinceJoining <= 95 && !employee.review90.completed) {
      return '90 Day Review Reminder';
    }
    if (employee.daysRemaining <= 14 && employee.daysRemaining > 0) {
      return 'Probation End Reminder';
    }
    return 'General Reminder';
  };

  const handleSubmitReminders = () => {
    alert(`Reminders sent to ${probationEmployees.length} employees and their managers`);
    setShowSendReminderModal(false);
  };

  const handleSubmitExport = () => {
    const format = reportFilters.exportFormat;
    const count = filteredEmployees.length;
    alert(`Exporting ${count} records in ${format.toUpperCase()} format...`);
    setShowExportModal(false);
  };

const handleGenerateReport = () => {
  // Filter employees based on report filters
  const filteredReportEmployees = probationEmployees.filter(emp => {
    // Date filter
    const joiningDate = new Date(emp.joiningDate);
    const startDate = new Date(reportFilters.startDate);
    const endDate = new Date(reportFilters.endDate);
    
    const dateMatch = joiningDate >= startDate && joiningDate <= endDate;
    
    // Department filter
    const deptMatch = reportFilters.department === 'all' || emp.department === reportFilters.department;
    
    // Status filter
    const statusMatch = reportFilters.status === 'all' || emp.status === reportFilters.status;
    
    return dateMatch && deptMatch && statusMatch;
  });
  
  // Generate report data
  const reportData = {
    reportType: reportFilters.reportType || 'probation_summary',
    exportFormat: reportFilters.exportFormat || 'pdf',
    filters: reportFilters,
    generatedAt: new Date().toISOString(),
    stats: {
      totalEmployees: filteredReportEmployees.length,
      departments: [...new Set(filteredReportEmployees.map(emp => emp.department))],
      statusDistribution: filteredReportEmployees.reduce((acc, emp) => {
        acc[emp.status] = (acc[emp.status] || 0) + 1;
        return acc;
      }, {}),
      riskDistribution: filteredReportEmployees.reduce((acc, emp) => {
        acc[emp.riskLevel] = (acc[emp.riskLevel] || 0) + 1;
        return acc;
      }, {}),
      reviewCompletion: {
        review30: filteredReportEmployees.filter(emp => emp.review30.completed).length,
        review60: filteredReportEmployees.filter(emp => emp.review60.completed).length,
        review90: filteredReportEmployees.filter(emp => emp.review90.completed).length
      },
      averageProgress: filteredReportEmployees.length > 0 ? 
        Math.round(filteredReportEmployees.reduce((sum, emp) => sum + emp.progress, 0) / filteredReportEmployees.length) : 0,
      extensionCount: filteredReportEmployees.reduce((sum, emp) => sum + (emp.extensionCount || 0), 0)
    },
    employees: filteredReportEmployees.map(emp => ({
      id: emp.id,
      employeeId: emp.employeeId,
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      manager: emp.manager,
      status: emp.status,
      riskLevel: emp.riskLevel,
      progress: emp.progress,
      currentRating: emp.currentRating,
      joiningDate: emp.joiningDate,
      probationEndDate: emp.probationEndDate,
      daysRemaining: emp.daysRemaining,
      extensionCount: emp.extensionCount || 0,
      review30: emp.review30,
      review60: emp.review60,
      review90: emp.review90,
      nextReviewDate: emp.nextReviewDate,
      workLocation: emp.workLocation,
      contactEmail: emp.contactEmail
    }))
  };
  
  // Generate and download the report based on format
  generateReportFile(reportData);
  
  // Show visual feedback
  showReportSuccessFeedback(reportData);
  
  setShowReportModal(false);
};

// Generate report file - PDF only
const generateReportFile = (reportData) => {
  generatePDFReport(reportData);
};

// Generate PDF Report (HTML that can be saved as PDF)
const generatePDFReport = (reportData) => {
  const htmlContent = createReportHTML(reportData);
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Probation_Report_${reportData.reportType}_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Create Report HTML Content
const createReportHTML = (reportData) => {
  const reportTitle = reportData.reportType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${reportTitle} - Probation Management System</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .report-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; margin-bottom: 30px; border-radius: 8px; }
        .report-title { font-size: 32px; margin: 0 0 10px 0; }
        .report-subtitle { font-size: 16px; opacity: 0.9; margin: 0 0 20px 0; }
        .report-meta { display: flex; justify-content: space-between; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 5px; }
        .summary-section { background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 30px; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 20px; }
        .summary-item { background: white; padding: 20px; border-radius: 6px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .summary-number { font-size: 32px; font-weight: bold; color: #667eea; }
        .summary-label { font-size: 14px; color: #666; margin-top: 8px; }
        .section-title { font-size: 24px; color: #333; margin: 40px 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #667eea; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #667eea; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border: 1px solid #ddd; }
        tr:nth-child(even) { background: #f8f9fa; }
        .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .status-in_progress { background: #e3f2fd; color: #1976d2; }
        .status-completed { background: #e8f5e9; color: #388e3c; }
        .status-extended { background: #fff3e0; color: #f57c00; }
        .status-at_risk { background: #ffebee; color: #d32f2f; }
        .status-terminated { background: #f5f5f5; color: #616161; }
        .risk-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .risk-low { background: #e8f5e9; color: #388e3c; }
        .risk-medium { background: #fff3e0; color: #f57c00; }
        .risk-high { background: #ffebee; color: #d32f2f; }
        .chart-container { margin: 30px 0; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="report-header">
        <h1 class="report-title">${reportTitle}</h1>
        <p class="report-subtitle">Probation Management System Report</p>
        <div class="report-meta">
          <div>
            <strong>Generated:</strong> ${new Date(reportData.generatedAt).toLocaleString()}<br>
            <strong>Report Period:</strong> ${formatDate(reportData.filters.startDate)} to ${formatDate(reportData.filters.endDate)}
          </div>
          <div>
            <strong>Department:</strong> ${reportData.filters.department === 'all' ? 'All Departments' : reportData.filters.department}<br>
            <strong>Status:</strong> ${reportData.filters.status === 'all' ? 'All Status' : reportData.filters.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>
      </div>
      
      <div class="summary-section">
        <h2>Executive Summary</h2>
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-number">${reportData.stats.totalEmployees}</div>
            <div class="summary-label">Total Employees</div>
          </div>
          <div class="summary-item">
            <div class="summary-number">${reportData.stats.statusDistribution.completed || 0}</div>
            <div class="summary-label">Completed Probation</div>
          </div>
          <div class="summary-item">
            <div class="summary-number">${reportData.stats.reviewCompletion.review90 || 0}</div>
            <div class="summary-label">90-Day Reviews Completed</div>
          </div>
          <div class="summary-item">
            <div class="summary-number">${reportData.stats.riskDistribution.high || 0}</div>
            <div class="summary-label">High Risk Employees</div>
          </div>
        </div>
      </div>
      
      <h2 class="section-title">Employee Probation Details</h2>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Risk Level</th>
            <th>Progress</th>
            <th>Current Rating</th>
            <th>Probation End</th>
            <th>Days Remaining</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.employees.map(emp => `
            <tr>
              <td><strong>${emp.employeeId}</strong></td>
              <td>${emp.name}</td>
              <td>${emp.department}</td>
              <td>${emp.designation}</td>
              <td>
                <span class="status-badge status-${emp.status}">
                  ${emp.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </td>
              <td>
                <span class="risk-badge risk-${emp.riskLevel}">
                  ${emp.riskLevel.replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </td>
              <td>
                <div>${emp.progress}%</div>
                <div style="width: 100px; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden;">
                  <div style="width: ${emp.progress}%; height: 100%; background: #4caf50;"></div>
                </div>
              </td>
              <td>${emp.currentRating}</td>
              <td>${formatDate(emp.probationEndDate)}</td>
              <td style="color: ${
                emp.daysRemaining <= 0 ? '#d32f2f' :
                emp.daysRemaining <= 7 ? '#f57c00' :
                emp.daysRemaining <= 30 ? '#fbc02d' : '#388e3c'
              }">
                <strong>${emp.daysRemaining <= 0 ? Math.abs(emp.daysRemaining) + ' days overdue' : emp.daysRemaining + ' days'}</strong>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p><strong>Confidential - Probation Management System Report</strong></p>
        <p>Generated on ${new Date().toLocaleDateString()} | Page 1</p>
      </div>
    </body>
    </html>
  `;
};

// Show visual feedback for report generation
const showReportSuccessFeedback = (reportData) => {
  // Create toast notification
  const toastContainer = document.createElement('div');
  toastContainer.className = 'position-fixed top-0 end-0 p-3';
  toastContainer.style.zIndex = '9999';
  
  const toastId = `toast-${Date.now()}`;
  toastContainer.innerHTML = `
    <div id="${toastId}" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-success text-white">
        <strong class="me-auto">Report Generated Successfully</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        <strong>${reportData.reportType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong><br>
        ${reportData.stats.totalEmployees} employees exported in ${reportData.exportFormat.toUpperCase()} format<br>
        <small>File download has started automatically</small>
      </div>
    </div>
  `;
  
  document.body.appendChild(toastContainer);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    const toastElement = document.getElementById(toastId);
    if (toastElement) {
      toastElement.classList.remove('show');
      setTimeout(() => {
        if (toastContainer.parentNode) {
          toastContainer.remove();
        }
      }, 300);
    }
  }, 5000);
  
  // Close button functionality
  const closeBtn = toastContainer.querySelector('.btn-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (toastContainer.parentNode) {
        toastContainer.remove();
      }
    });
  }
};

  // View Details
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  // ---------------- UI COMPONENTS ----------------
  const getStatusBadge = (status) => {
    const config = {
      in_progress: { label: 'In Progress', color: 'primary' },
      under_review: { label: 'Under Review', color: 'warning' },
      extended: { label: 'Extended', color: 'info' },
      at_risk: { label: 'At Risk', color: 'danger' },
      completed: { label: 'Completed', color: 'success' },
      terminated: { label: 'Terminated', color: 'secondary' }
    };
    
    const { label, color } = config[status] || { label: status, color: 'secondary' };
    
    return (
      <span className={`badge bg-${color}-subtle text-${color}`}>
        {label}
      </span>
    );
  };

  const getRiskBadge = (risk) => {
    const config = {
      low: { label: 'Low Risk', color: 'success' },
      medium: { label: 'Medium Risk', color: 'warning' },
      high: { label: 'High Risk', color: 'danger' }
    };
    
    const { label, color } = config[risk] || { label: risk, color: 'secondary' };
    
    return (
      <span className={`badge bg-${color}-subtle text-${color}`}>
        {label}
      </span>
    );
  };

  const getRatingBadge = (rating) => {
    const config = {
      'Exceeds Expectations': { color: 'success' },
      'Meets Expectations': { color: 'primary' },
      'Needs Improvement': { color: 'warning' },
      'Unsatisfactory': { color: 'danger' },
      'Not Rated': { color: 'secondary' }
    };
    
    const { color } = config[rating] || { color: 'secondary' };
    
    return (
      <span className={`badge bg-${color}-subtle text-${color}`}>
        {rating}
      </span>
    );
  };

const ProgressBar = ({ percentage, showLabel = true }) => {
  const colorClass = 
    percentage >= 90 ? 'success' :
    percentage >= 70 ? 'primary' :
    percentage >= 50 ? 'warning' : 'danger';
  
  return (
    <div className="d-flex align-items-center gap-2">
      <div className="progress flex-grow-1" style={{ height: '6px' }}>
        <div 
          className={`progress-bar bg-${colorClass}`}
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        ></div>
      </div>
      {showLabel && <small className="text-muted" style={{ minWidth: '35px' }}>{percentage}%</small>}
    </div>
  );
};

  const ReviewMilestones = ({ employee }) => {
    return (
      <div className="d-flex gap-1">
        <span 
          className={`badge ${employee.review30.completed ? 'bg-success' : 'bg-light text-muted'}`}
          title={`30 Day: ${employee.review30.completed ? formatDate(employee.review30.date) : 'Pending'}`}
        >
          30
        </span>
        <span 
          className={`badge ${employee.review60.completed ? 'bg-success' : 'bg-light text-muted'}`}
          title={`60 Day: ${employee.review60.completed ? formatDate(employee.review60.date) : 'Pending'}`}
        >
          60
        </span>
        <span 
          className={`badge ${employee.review90.completed ? 'bg-success' : 'bg-light text-muted'}`}
          title={`90 Day: ${employee.review90.completed ? formatDate(employee.review90.date) : 'Pending'}`}
        >
          90
        </span>
        <span 
          className={`badge ${employee.status === 'completed' ? 'bg-success' : 'bg-light text-muted'}`}
          title="Final Review"
        >
          F
        </span>
      </div>
    );
  };



  return (
    <>
      <div className="container-fluid p-4">
        
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
<h5 className="text-3xl fw-bold text-dark mb-2 d-flex align-items-center gap-1">
  <Icon icon='heroicons:clock'/>
  Probation Management
</h5>

            <p className="text-muted">Track, review, and manage employee probation periods</p>
          </div>
          
          <div className="d-flex gap-2">
            <button
              className="create-job-btn"
              onClick={() => setShowReportModal(true)}
            >
              Reports
            </button>
            <button
              className="record-communication-btn"
              onClick={() => setShowBulkActionModal(true)}
              disabled={selectedEmployees.length === 0}
            >
              Bulk Actions ({selectedEmployees.length})
            </button>
            <button
              className="create-job-btn"
              onClick={() => setShowAddModal(true)}
            >
              Add Employee
            </button>
          </div>
        </div>

{/* Statistics */}
<div className="kpi-row">
  {[
    {
      title: "Total Employees",
      value: stats.total,
      icon: "heroicons:users",
      bg: "kpi-primary",
      color: "kpi-primary-text",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: "heroicons:arrow-path",
      bg: "kpi-info",
      color: "kpi-info-text",
    },
    {
      title: "At Risk",
      value: stats.atRisk,
      icon: "heroicons:exclamation-triangle",
      bg: "kpi-warning",
      color: "kpi-warning-text",
    },
    {
      title: "Ending This Week",
      value: stats.endingThisWeek,
      icon: "heroicons:calendar-days",
      bg: "kpi-info",
      color: "kpi-info-text",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: "heroicons:check-circle",
      bg: "kpi-success",
      color: "kpi-success-text",
    },
    {
      title: "High Risk",
      value: stats.highRisk,
      icon: "heroicons:x-circle",
      bg: "kpi-warning",
      color: "kpi-warning-text",
    },
  ].map((item, index) => (
    <div className="kpi-col" key={index}>
      <div className="kpi-card">
        <div className="kpi-card-body">
          {/* Icon */}
          <div className={`kpi-icon ${item.bg}`}>
            <Icon
              icon={item.icon}
              className={`kpi-icon-style ${item.color}`}
            />
          </div>

          {/* Content */}
          <div className="kpi-content">
            <div className="kpi-title">{item.title}</div>
            <div className="kpi-value">{item.value}</div>
          </div>

        </div>
      </div>
    </div>
  ))}
</div>


        {/* FILTERS */}
        <div className="card p-3 mb-4">
          <div className="row g-2">
            <div className="col-md-3">
              <input
                type="text"
                placeholder="Search employees..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="col-md-2">
              <select 
                className="form-select" 
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
            </div>
            
            <div className="col-md-2">
              <select 
                className="form-select" 
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">HR</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            
            <div className="col-md-2">
              <select 
                className="form-select" 
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="col-md-3 d-flex gap-2">
              <select
                className="form-select"
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
        </div>


{/* SELECTION INFO */}
{selectedEmployees.length > 0 && (
  <div className="alert alert-info d-flex justify-content-between align-items-center mb-3">
    <div>
      <strong>{selectedEmployees.length} employees</strong> selected for bulk actions
    </div>
    <div className="d-flex gap-2">
         <button 
        className="delete-btn"
        onClick={() => {
          // Filter out selected employees without confirmation
          const updatedEmployees = probationEmployees.filter(
            emp => !selectedEmployees.includes(emp.id)
          );
          
          // Also filter out review history for deleted employees
          const updatedReviewHistory = reviewHistory.filter(
            review => {
              const employee = probationEmployees.find(emp => emp.employeeId === review.employeeId);
              return employee && !selectedEmployees.includes(employee.id);
            }
          );
          
          setProbationEmployees(updatedEmployees);
          setReviewHistory(updatedReviewHistory);
          setSelectedEmployees([]); // Clear selection after deletion
        }}
      >
        <i className="bi bi-trash me-1"></i>
          Clear Selection
      </button>

    </div>
  </div>
)}

        {/* MAIN TABLE */}
<div className="card">
  <div className="table-responsive">
    <table className="table table-hover align-middle" style={{ minWidth: '1600px' }}>
      <thead className="table-light">
        <tr>
          <th style={{ width: '90px' }}>
            <div className="d-flex flex-column align-items-center">
              <label 
                htmlFor="selectAllCheckbox" 
                className="form-check-label small text-muted"
                style={{ cursor: 'pointer', fontSize: '1rem' }}
              >
                Select All
              </label>
              <input
                type="checkbox"
                className="form-check-input mb-1"
                checked={selectedEmployees.length === paginatedEmployees.length && paginatedEmployees.length > 0}
                onChange={handleSelectAll}
                id="selectAllCheckbox"
              />

              
            </div>
          </th>
          <th style={{ minWidth: '70px' }}>Employee Details</th>
          <th className="text-center" style={{ minWidth: '150px' }}>Probation Status</th>
          <th className="text-center" style={{ minWidth: '150px' }}>Progress</th>
          <th className="text-center" style={{ minWidth: '130px' }}>Risk Level</th>
          <th className="text-center" style={{ minWidth: '180px' }}>Review Milestones</th>
          <th className="text-center" style={{ minWidth: '160px' }}>Time Remaining</th>
          <th className="text-center" style={{ minWidth: '150px' }}>Current Rating</th>
          <th className="text-center" style={{ minWidth: '150px' }}>Actions</th>
        </tr>
      </thead>
      
      <tbody>
        {paginatedEmployees.map((emp) => (
          <tr key={emp.id} className={selectedEmployees.includes(emp.id) ? 'table-active' : ''}>
            <td className="align-middle">
              <div className="d-flex justify-content-center">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedEmployees.includes(emp.id)}
                  onChange={() => handleSelectEmployee(emp.id)}
                />
              </div>
            </td>
            
            <td className="align-middle">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <strong className="d-block fs-6">{emp.name}</strong>
                  <small className="badge bg-primary">{emp.employeeId}</small>
                </div>
                <small className="text-muted d-block mb-2">{emp.designation}</small>
                <div className="d-flex align-items-center gap-2">
                  <small className="text-muted">{emp.department}</small>
                  <i className="bi bi-geo-alt text-muted"></i>
                  <small className="text-muted">{emp.workLocation}</small>
                </div>
              </div>
            </td>
            
            <td className="text-center align-middle">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-1">{getStatusBadge(emp.status)}</div>
                {emp.extensionCount > 0 && (
                  <div className="small text-muted">
                    Extended {emp.extensionCount} time{emp.extensionCount > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </td>
            
            <td className="text-center align-middle">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-2" style={{ width: '120px' }}>
                  <ProgressBar percentage={emp.progress} showLabel={false} />
                </div>
                <div className="small fw-medium">
                  <span className={`${
                    emp.progress >= 90 ? 'text-success' :
                    emp.progress >= 70 ? 'text-primary' :
                    emp.progress >= 50 ? 'text-warning' : 'text-danger'
                  }`}>
                    {emp.progress}% complete
                  </span>
                </div>
              </div>
            </td>
            
            <td className="text-center align-middle">
              <div className="d-flex justify-content-center">
                {getRiskBadge(emp.riskLevel)}
              </div>
            </td>
            
            <td className="text-center align-middle">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-2">
                  <ReviewMilestones employee={emp} />
                </div>
                <div className="small text-muted">
                  Next: {emp.nextReviewDate ? formatDate(emp.nextReviewDate) : 'N/A'}
                </div>
              </div>
            </td>
            
            <td className="text-center align-middle">
              <div className="d-flex flex-column align-items-center">
                <div className={`fw-bold fs-6 mb-1 ${
                  emp.daysRemaining <= 0 ? 'text-danger' :
                  emp.daysRemaining <= 7 ? 'text-danger' :
                  emp.daysRemaining <= 30 ? 'text-warning' : 'text-success'
                }`}>
                  {emp.daysRemaining <= 0 ? 
                    <span className="d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-1"></i>
                      {Math.abs(emp.daysRemaining)} days overdue
                    </span> : 
                    <span className="d-flex align-items-center">
                      <i className="bi bi-clock me-1"></i>
                      {emp.daysRemaining} days
                    </span>
                  }
                </div>
                <div className="small text-muted">
                  Ends: {formatDate(emp.probationEndDate)}
                </div>
              </div>
            </td>
            
            <td className="text-center align-middle">
              <div className="d-flex justify-content-center">
                {getRatingBadge(emp.currentRating)}
              </div>
            </td>
            
            <td className="text-center align-middle">
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                {/* View Details Button - Always visible */}
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleViewDetails(emp)}
                  title="View Details"
                  style={{ 
                    width: '40px', 
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="bi bi-eye"></i>
                </button>
                
                {/* Action Buttons for Active Probations */}
                {emp.status !== 'completed' && emp.status !== 'terminated' && (
                  <>
                    {/* Extend Button */}
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => handleExtendProbation(emp)}
                      title="Extend Probation"
                      style={{ 
                        width: '40px', 
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="bi bi-calendar-plus"></i>
                    </button>
                    
                    {/* Confirm Button */}
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => {
                        if (emp.progress >= 80 && emp.daysRemaining > 30) {
                          handleEarlyConfirmation(emp);
                        } else {
                          setSelectedEmployee(emp);
                          setShowConfirmModal(true);
                        }
                      }}
                      title={emp.progress >= 80 && emp.daysRemaining > 30 ? "Early Confirmation" : "Confirm Employee"}
                      disabled={emp.progress < 80}
                      style={{ 
                        width: '40px', 
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className={emp.progress >= 80 && emp.daysRemaining > 30 ? "bi bi-award" : "bi bi-check-circle"}></i>
                    </button>

                    
                    {/* Review Dropdown - Separated with margin */}
                    <div className="dropdown ms-1">
                      <button
                        className="btn btn-outline-success btn-sm dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        title="Conduct Review"
                        style={{ 
                          width: '40px', 
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i className="bi bi-clipboard-check"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        {!emp.review30.completed && (
                          <li>
                            <button 
                              className="dropdown-item d-flex align-items-center"
                              onClick={() => handleStartReview(emp, '30_day')}
                            >
                              30 Day Review
                            </button>
                          </li>
                        )}
                        {emp.review30.completed && !emp.review60.completed && (
                          <li>
                            <button 
                              className="dropdown-item d-flex align-items-center"
                              onClick={() => handleStartReview(emp, '60_day')}
                            >
                              60 Day Review
                            </button>
                          </li>
                        )}
                        {emp.review60.completed && !emp.review90.completed && (
                          <li>
                            <button 
                              className="dropdown-item d-flex align-items-center"
                              onClick={() => handleStartReview(emp, '90_day')}
                            >
                              90 Day Review
                            </button>
                          </li>
                        )}
                        {emp.review90.completed && emp.status !== 'completed' && (
                          <li>
                            <button 
                              className="dropdown-item d-flex align-items-center"
                              onClick={() => handleStartReview(emp, 'final')}
                            >
                              Final Review
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
                                    {/* Terminate Button */}
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleTerminateProbation(emp)}
                      title="Terminate Probation"
                      style={{ 
                        width: '40px', 
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
              </div>
            </td>
          </tr>
        ))}
        
        {paginatedEmployees.length === 0 && (
          <tr>
            <td colSpan="9" className="text-center py-5">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <i className="bi bi-people fs-1 text-muted mb-3"></i>
                <h5 className="text-muted mb-2">No probation employees found</h5>
                <p className="text-muted mb-0">Try adjusting your search or filters</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  
  {/* PAGINATION WITH SELECT ALL AT BOTTOM */}
  {(totalPages > 1 || selectedEmployees.length > 0) && (
    <div className="card-footer">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-3">
          
          <div className="text-muted small">
            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</strong> of <strong>{filteredEmployees.length}</strong> employees
          </div>
          
          {selectedEmployees.length > 0 && (
            <div className="badge bg-info text-dark">
              <i className="bi bi-check-circle me-1"></i>
              {selectedEmployees.length} selected
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link d-flex align-items-center"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left me-1"></i>
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
                  className="page-link d-flex align-items-center"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  )}
</div>

        {/* ----------------- MODALS ----------------- */}

        {/* ADD EMPLOYEE MODAL */}
{showAddModal && (
  <div
       className="hrms-modal-overlay"
  >
          <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">
       
        {/* Header */}
    <div className="hrms-modal-header">
       <h5 className="hrms-modal-title d-flex align-items-center">
  Add Employee to Probation Tracking
</h5>

          <button
            className="btn-close"
            onClick={() => setShowAddModal(false)}
          />
        </div>
<div className="hrms-modal-body hrms-modal-body-scroll">
        {/* Form */}
<form onSubmit={handleAddEmployee}>

    <div className="row g-3">
      {/* Required Fields with Dark Label and Red Asterisk */}
      <div className="col-md-6">
        <label className="form-label text-dark">
          Full Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          required
          value={newEmployee.name}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, name: e.target.value })
          }
          placeholder="Enter full name"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label text-dark">
          Employee ID <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          required
          value={newEmployee.employeeId}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, employeeId: e.target.value })
          }
          placeholder="EMP001"
        />
      </div>

      {/* Contact Information */}
      <div className="col-md-6">
        <label className="form-label text-dark">
          Email Address <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          className="form-control"
          required
          value={newEmployee.email || ''}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, email: e.target.value })
          }
          placeholder="employee@company.com"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label text-dark">
          Phone Number <span className="text-danger">*</span>
        </label>
        <input
          type="tel"
          className="form-control"
          required
          value={newEmployee.phone || ''}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, phone: e.target.value })
          }
          placeholder="+91-9876543210"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label text-dark">
          Designation <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          required
          value={newEmployee.designation}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, designation: e.target.value })
          }
          placeholder="Software Engineer"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label text-dark">
          Department <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          required
          value={newEmployee.department}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, department: e.target.value })
          }
        >
          <option value="">Select Department</option>
          <option value="Engineering">Engineering</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Quality Assurance">Quality Assurance</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label text-dark">
          Reporting Manager <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className="form-control"
          required
          value={newEmployee.manager}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, manager: e.target.value })
          }
          placeholder="Manager's full name"
        />
      </div>

      {/* Optional Fields with Normal Label */}
      <div className="col-md-6">
        <label className="form-label">HR Business Partner</label>
        <input
          type="text"
          className="form-control"
          value={newEmployee.hrBusinessPartner || ''}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, hrBusinessPartner: e.target.value })
          }
          placeholder="HR representative name"
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Employment Type</label>
        <select
          className="form-select"
          value={newEmployee.employmentType}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, employmentType: e.target.value })
          }
        >
          <option value="Permanent">Permanent</option>
          <option value="Contract">Contract</option>
          <option value="Intern">Intern</option>
          <option value="Temporary">Temporary</option>
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label">Work Location</label>
        <select
          className="form-select"
          value={newEmployee.workLocation}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, workLocation: e.target.value })
          }
        >
          <option value="Bangalore">Bangalore</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Chennai">Chennai</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Kolkata">Kolkata</option>
        </select>
      </div>

      {/* Required Fields */}
      <div className="col-md-6">
        <label className="form-label text-dark">
          Joining Date <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className="form-control"
          required
          value={newEmployee.joiningDate}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, joiningDate: e.target.value })
          }
        />
      </div>

      <div className="col-md-6">
        <label className="form-label text-dark">
          Probation Period (Days) <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          required
          value={newEmployee.probationPeriod}
          onChange={(e) => setNewEmployee({...newEmployee, probationPeriod: e.target.value})}
        >
          <option value="30">30 Days</option>
          <option value="60">60 Days</option>
          <option value="90">90 Days</option>
          <option value="180">180 Days</option>
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label">Probation Type</label>
        <select
          className="form-select"
          value={newEmployee.probationType || 'regular'}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, probationType: e.target.value })
          }
        >
          <option value="regular">Regular</option>
          <option value="extended">Extended</option>
          <option value="probation_waived">Probation Waived</option>
        </select>
      </div>
    </div>

</form>
</div>

  {/* Footer */}
    <div className="modal-footer bg-white border-top d-flex">
    <button
      type="button"
      className="cancel-btn"
      onClick={() => setShowAddModal(false)}
    >
      Cancel
    </button>
    <button type="submit" className="create-job-btn">
      <i className="bi bi-person-plus me-2"></i>
      Add Employee
    </button>
  </div>
        
      </div>
    </div>

)}

        {/* REVIEW MODAL */}
{showReviewModal && selectedEmployee && (
  <div
className="hrms-modal-overlay"
  >
    <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

              {/* HEADER */}
              <div className="hrms-modal-header">
          <div className="d-flex align-items-center justify-content-between w-100">
            <div>
               <h5 className="hrms-modal-title d-flex align-items-center gap-2">
                <Icon 
                  icon={reviewStep === 'self' ? "heroicons:user" : 
                         reviewStep === 'manager' ? "heroicons:briefcase" :
                         reviewStep === 'skip_level' ? "heroicons:users" :
                         "heroicons:building-office"} 
                  style={{ fontSize: 24 }} 
                />
                {reviewForm.reviewType.replace('_', ' ').toUpperCase()} Review - {selectedEmployee.name}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
                {selectedEmployee.designation} • {selectedEmployee.department}
              </p>
            </div>
            <button
              className="btn btn-light fw-bold p-1 d-flex align-items-center justify-content-center"
              onClick={() => {
                setShowReviewModal(false);
                setReviewStep('self');
              }}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "1px solid #E5E7EB"
              }}
            >
              <Icon
                icon="heroicons:x-mark"
                className="text-dark"
                style={{ fontSize: "18px" }}
              />
            </button>
          </div>
        </div>

        {/* Review Steps Indicator */}
      <div className="hrms-modal-body hrms-modal-body-scroll">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex gap-2 flex-wrap">
            <span 
              className={`badge p-2 d-flex align-items-center gap-1 ${reviewStep === 'self' ? 'bg-primary' : 'bg-success'}`}
              style={{ fontSize: "0.875rem" }}
            >
              <Icon icon="heroicons:user" style={{ fontSize: 14 }} />
                1. Self-Assessment
              </span>
              <span 
                className={`badge p-2 d-flex align-items-center gap-1 ${reviewStep === 'manager' ? 'bg-primary' : reviewStep === 'skip_level' || reviewStep === 'hr' ? 'bg-success' : 'bg-secondary'}`}
                style={{ fontSize: "0.9rem" }}
              >
                <Icon icon="heroicons:briefcase" style={{ fontSize: 14 }} />
                2. Manager Review
              </span>
              <span 
                className={`badge p-2 d-flex align-items-center gap-1 ${reviewStep === 'skip_level' ? 'bg-primary' : reviewStep === 'hr' ? 'bg-success' : 'bg-secondary'}`}
                style={{ fontSize: "0.9rem" }}
              >
                <Icon icon="heroicons:users" style={{ fontSize: 14 }} />
                3. Skip-Level
              </span>
              <span 
                className={`badge p-2 d-flex align-items-center gap-1 ${reviewStep === 'hr' ? 'bg-primary' : 'bg-secondary'}`}
                style={{ fontSize: "0.9rem" }}
              >
                <Icon icon="heroicons:building-office" style={{ fontSize: 14 }} />
                4. HR Review
              </span>
            </div>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
              onClick={() => handleScheduleMeeting(selectedEmployee, reviewForm.reviewType)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: "0.875rem"
              }}
            >
              <Icon icon="heroicons:calendar" style={{ fontSize: 16 }} />
              Schedule Meeting
            </button>
          </div>
           <form onSubmit={handleSubmitReview}>
          <div className="modal-body p-4">
            {/* Step 1: Self-Assessment */}
            {reviewStep === 'self' && (
              <>
                <div className="alert alert-info d-flex align-items-center gap-2 mb-4" style={{ borderRadius: 8 }}>
                  <Icon icon="heroicons:information-circle" style={{ fontSize: 20 }} />
                  <strong>Step 1: Self-Assessment</strong> - Employee completes self-assessment
                </div>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-3">
 <label className="form-label text-dark">
  Self Rating <span className="text-danger">*</span>
</label>
  <select
    className="form-select"
    required
    value={reviewForm.selfRating}
    onChange={(e) => setReviewForm({...reviewForm, selfRating: e.target.value})}
  >
    <option value="">Select rating...</option>
    <option value="exceeds_expectations">Exceeds Expectations</option>
    <option value="meets_expectations">Meets Expectations</option>
    <option value="needs_improvement">Needs Improvement</option>
    <option value="unsatisfactory">Unsatisfactory</option>
  </select>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        Key Achievements
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="List your key achievements..."
                        value={reviewForm.achievements}
                        onChange={(e) => setReviewForm({...reviewForm, achievements: e.target.value})}
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        Challenges Faced
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Describe challenges and how you addressed them..."
                        value={reviewForm.challenges}
                        onChange={(e) => setReviewForm({...reviewForm, challenges: e.target.value})}
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
<label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
  Self Assessment <span className="text-danger">*</span>
</label>
                      <textarea
                        className="form-control"
                        rows="8"
                        placeholder="Describe your performance, achievements, and areas of growth..."
                        value={reviewForm.selfAssessment}
                        onChange={(e) => setReviewForm({...reviewForm, selfAssessment: e.target.value})}
                        required
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        Goals for Next Period
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="What are your goals for the next review period?"
                        value={reviewForm.goals}
                        onChange={(e) => setReviewForm({...reviewForm, goals: e.target.value})}
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Step 2: Manager Review */}
            {reviewStep === 'manager' && (
              <>
                <div className="alert alert-info d-flex align-items-center gap-2 mb-4" style={{ borderRadius: 8 }}>
                  <Icon icon="heroicons:information-circle" style={{ fontSize: 20 }} />
                  <strong>Step 2: Manager Review</strong> - Direct manager assessment
                </div>
                
                {reviewForm.selfAssessment && (
                  <div className="card mb-4 bg-light border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="fw-bold d-flex align-items-center gap-2 mb-3">
                        <Icon icon="heroicons:user-circle" style={{ fontSize: 18 }} />
                        Employee Self-Assessment
                      </h6>
                      <div className="row">
                        <div className="col-md-4 mb-2">
                          <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Self Rating</small>
                          <strong>{reviewForm.selfRating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
                        </div>
                        <div className="col-md-8">
                          <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Assessment</small>
                          <p className="mb-0" style={{ fontSize: "0.875rem" }}>{reviewForm.selfAssessment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        Review Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={reviewForm.reviewDate}
                        onChange={(e) => setReviewForm({...reviewForm, reviewDate: e.target.value})}
                        required
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
  <label className="form-label fw-semibold text-dark">
    Performance Rating <span className="text-danger">*</span>
  </label>
  <select
    className="form-select form-select-sm"
    required
    value={reviewForm.rating}
    onChange={(e) => setReviewForm({...reviewForm, rating: e.target.value})}
  >
    <option value="exceeds_expectations">Exceeds Expectations</option>
    <option value="meets_expectations">Meets Expectations</option>
    <option value="needs_improvement">Needs Improvement</option>
    <option value="unsatisfactory">Unsatisfactory</option>
  </select>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        Review Type
                      </label>
  <select
    className="form-select form-select-sm"
    value={reviewForm.reviewType}
    onChange={(e) => setReviewForm({...reviewForm, reviewType: e.target.value})}
  >
    <option value="30_day">30 Day Review</option>
    <option value="60_day">60 Day Review</option>
    <option value="90_day">90 Day Review</option>
    <option value="final">Final Review</option>
  </select>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        Manager Assessment <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows="6"
                        placeholder="Enter detailed feedback from manager..."
                        value={reviewForm.managerComments}
                        onChange={(e) => setReviewForm({...reviewForm, managerComments: e.target.value})}
                        required
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Step 3: Skip-Level Manager Review */}
            {reviewStep === 'skip_level' && (
              <>
                <div className="alert alert-info d-flex align-items-center gap-2 mb-4" style={{ borderRadius: 8 }}>
                  <Icon icon="heroicons:information-circle" style={{ fontSize: 20 }} />
                  <strong>Step 3: Skip-Level Manager Review</strong> - Senior manager assessment
                </div>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        Skip-Level Manager Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={reviewForm.skipLevelManager}
                        onChange={(e) => setReviewForm({...reviewForm, skipLevelManager: e.target.value})}
                        placeholder="Enter skip-level manager name"
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        Skip-Level Manager Comments
                      </label>
                      <textarea
                        className="form-control"
                        rows="6"
                        placeholder="Enter skip-level manager's observations and feedback..."
                        value={reviewForm.skipLevelManagerComments}
                        onChange={(e) => setReviewForm({...reviewForm, skipLevelManagerComments: e.target.value})}
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                  
<div className="col-12" style={{ marginTop: "16px" }}>
  <label
    style={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: reviewForm.notifySkipLevelManager ? "#2563eb" : "#4B5563",
      transition: "color 0.3s ease",
      fontSize: "0.875rem"
    }}
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${reviewForm.notifySkipLevelManager ? "#2563eb" : "#9CA3AF"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "10px",
        transition: "all 0.3s ease",
        background: reviewForm.notifySkipLevelManager ? "#2563eb" : "transparent",
      }}
    >
      {reviewForm.notifySkipLevelManager && (
        <span
          style={{
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            lineHeight: 1,
          }}
        >
          ✓
        </span>
      )}
    </div>
    <input
      type="checkbox"
      checked={reviewForm.notifySkipLevelManager}
      onChange={(e) => setReviewForm({...reviewForm, notifySkipLevelManager: e.target.checked})}
      style={{ display: "none" }}
    />
    <span>Notify skip-level manager about this review</span>
  </label>
</div>
                  
                </div>
              </>
            )}
            
            {/* Step 4: HR Review */}
            {reviewStep === 'hr' && (
              <>
                <div className="alert alert-info d-flex align-items-center gap-2 mb-4" style={{ borderRadius: 8 }}>
                  <Icon icon="heroicons:information-circle" style={{ fontSize: 20 }} />
                  <strong>Step 4: HR Review & Recommendation</strong> - Final review and decision
                </div>
                
                <div className="row g-4">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                        HR Assessment <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows="6"
                        placeholder="Enter HR's observations and feedback..."
                        value={reviewForm.hrComments}
                        onChange={(e) => setReviewForm({...reviewForm, hrComments: e.target.value})}
                        required
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        HR Recommendation <span className="text-danger">*</span>
                      </label>
  <select
    className="form-select"
    required
    value={reviewForm.recommendation}
    onChange={(e) => setReviewForm({...reviewForm, recommendation: e.target.value})}
  >
    <option value="">Select recommendation...</option>
    <option value="continue">Continue Probation</option>
    <option value="confirm">Confirm Employment</option>
    <option value="extend">Extend Probation</option>
    <option value="terminate">Terminate Probation</option>
  </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        Attachments (Optional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        onChange={(e) => setReviewForm({...reviewForm, attachments: Array.from(e.target.files)})}
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark" style={{ fontSize: "0.875rem" }}>
                        Additional Recommendations
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Any additional recommendations or action items..."
                        value={reviewForm.recommendations}
                        onChange={(e) => setReviewForm({...reviewForm, recommendations: e.target.value})}
                        style={{
                          borderRadius: 8,
                          border: "1px solid #D1D5DB",
                          padding: "10px 12px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                  
                  {reviewForm.meetingScheduled && (
                    <div className="col-12">
                      <div className="alert alert-success d-flex align-items-center gap-2" style={{ borderRadius: 8 }}>
                        <Icon icon="heroicons:calendar-days" style={{ fontSize: 20 }} />
                        <div>
                          <strong>Meeting Scheduled:</strong> {reviewForm.meetingDate} at {reviewForm.meetingTime}
                          {reviewForm.meetingLink && (
                            <div className="mt-1">
                              <a href={reviewForm.meetingLink} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                <Icon icon="heroicons:link" className="me-1" />
                                Join Meeting
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </form>
        </div>

                  {/* Modal Footer */}
  <div className="modal-footer bg-white border-top d-flex justify-content-between">
  <div className="d-flex justify-content-end w-100">
    <div className="d-flex gap-3">

<button 
  type="button" 
  className={`d-flex align-items-center gap-2 ${reviewStep === 'self' ? 'cancel-btn' : 'close-btn'}`}
  onClick={() => {
    if (reviewStep === 'self') {
      setShowReviewModal(false);
      setReviewStep('self');
    } else if (reviewStep === 'manager') {
      setReviewStep('self');
    } else if (reviewStep === 'skip_level') {
      setReviewStep('manager');
    } else {
      setReviewStep('skip_level');
    }
  }}
  style={{
    borderRadius: 8,
    padding: "10px 24px",
    fontWeight: 500,
    fontSize: "0.875rem"
  }}
>

  {reviewStep === 'self' ? 'Cancel' : 'Previous'}
</button>
      {reviewStep === 'self' && (
        <button 
          type="button" 
          className="create-job-btn"
          onClick={handleSubmitSelfAssessment}
          disabled={!reviewForm.selfAssessment || !reviewForm.selfRating}
          style={{
            borderRadius: 8,
            padding: "10px 30px",
            fontWeight: 500,
            fontSize: "0.875rem"
          }}
        >
          Next: Manager Review
          <Icon icon="heroicons:arrow-right" style={{ fontSize: 18 }} />
        </button>
      )}

      {reviewStep === 'manager' && (
        <button 
          type="button" 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setReviewStep('skip_level')}
          disabled={!reviewForm.managerComments || !reviewForm.rating}
          style={{
            borderRadius: 8,
            padding: "10px 30px",
            fontWeight: 500,
            fontSize: "0.875rem"
          }}
        >
          Next: Skip-Level Review
          <Icon icon="heroicons:arrow-right" style={{ fontSize: 18 }} />
        </button>
      )}

      {reviewStep === 'skip_level' && (
        <button 
          type="button" 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setReviewStep('hr')}
          style={{
            borderRadius: 8,
            padding: "10px 30px",
            fontWeight: 500,
            fontSize: "0.875rem"
          }}
        >
          Next: HR Review
          <Icon icon="heroicons:arrow-right" style={{ fontSize: 18 }} />
        </button>
      )}

      {reviewStep === 'hr' && (
        <button 
          type="submit" 
          className="btn btn-success d-flex align-items-center gap-2"
          disabled={!reviewForm.hrComments || !reviewForm.recommendation}
          style={{
            borderRadius: 8,
            padding: "10px 30px",
            fontWeight: 500,
            fontSize: "0.875rem"
          }}
        >
          <Icon icon="heroicons:check-circle" style={{ fontSize: 18 }} />
          Submit Review
        </button>
      )}

    </div>
  </div>
</div>
      </div>
    </div>

)}
        {/* EXTENSION MODAL */}
        {showExtendModal && selectedEmployee && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content border-0 shadow-lg rounded-3">
                <div className="modal-header">
                  <h5 className="modal-title">Extend Probation Period</h5>
                  <button className="btn-close" onClick={() => setShowExtendModal(false)}></button>
                </div>

                  <div className="modal-body">           
                 <form onSubmit={handleSubmitExtension}>
                    <div className="alert alert-warning mb-3">
                      Extending probation for <strong>{selectedEmployee.name}</strong>
                    </div>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Current End Date</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formatDate(selectedEmployee.probationEndDate)}
                          disabled
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label">Extension Duration *</label>
                        <select
                          className="form-select"
                          value={extensionForm.extensionDays}
                          onChange={(e) => {
                            const days = parseInt(e.target.value);
                            const newDate = new Date(selectedEmployee.probationEndDate);
                            newDate.setDate(newDate.getDate() + days);
                            setExtensionForm({
                              ...extensionForm,
                              extensionDays: days,
                              newEndDate: newDate.toISOString().split('T')[0]
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
                      
                      <div className="col-md-6">
                        <label className="form-label">New End Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={extensionForm.newEndDate}
                          onChange={(e) => setExtensionForm({...extensionForm, newEndDate: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label">Reason for Extension *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Provide detailed reason for probation extension..."
                          value={extensionForm.reason}
                          onChange={(e) => setExtensionForm({...extensionForm, reason: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                </form>
                </div>

                   <div className="modal-footer">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setShowExtendModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="help-btn">
                      Extend Probation
                    </button>
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM EMPLOYEE MODAL */}
        {showConfirmModal && selectedEmployee && (
             <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Employee</h5>
                  <button className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                </div>
                
                <div className="modal-body text-center">
                  <div className="mb-4">
                    <div className="rounded-circle bg-success d-inline-flex p-3 mb-3">
                      ✓
                    </div>
                    <h4>Confirm Employment</h4>
                    <p className="text-muted">
                      Confirm <strong>{selectedEmployee.name}</strong> as a permanent employee?
                    </p>
                  </div>
                  
                  <div className="alert alert-success text-start">
                    <strong>Success:</strong> This employee has completed probation successfully.
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="add-employee"
                    onClick={handleConfirmEmployee}
                  >
                    Confirm Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

{showTerminateModal && selectedEmployee && (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered modal-md">
      <div className="modal-content border-0 shadow-lg rounded-3">
        <div className="modal-header">
          <h5 className="modal-title">Terminate Probation</h5>
          <button className="btn-close" onClick={() => setShowTerminateModal(false)}></button>
        </div>
        
        {/* MOVED: Form now wraps the entire modal body AND footer */}
        <form onSubmit={handleSubmitTermination}>
          <div className="modal-body">
            <div className="alert alert-danger mb-3">
              Terminating probation for <strong>{selectedEmployee.name}</strong> ({selectedEmployee.employeeId})
            </div>
            
            <div className="mb-3">
              <label className="form-label">Reason for Termination <span className='text-danger'>*</span></label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Provide detailed reason for probation termination..."
                value={terminationForm.reason}
                onChange={(e) => setTerminationForm({...terminationForm, reason: e.target.value})}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Effective Date <span className='text-danger'>*</span></label>
              <input
                type="date"
                className="form-control"
                value={terminationForm.effectiveDate}
                onChange={(e) => setTerminationForm({...terminationForm, effectiveDate: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setShowTerminateModal(false)}
            >
              Cancel
            </button>
            {/* FIXED: Button is now inside the form with type="submit" */}
            <button type="submit" className="delete-btn">
              Terminate Probation
            </button>
          </div>
        </form>
        {/* Form closes here - now wrapping everything */}
      </div>
    </div>
  </div>
)}

        {/* BULK ACTION MODAL */}
        {showBulkActionModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content border-0 shadow-lg rounded-3">
                <div className="modal-header">
                  <h5 className="modal-title">Bulk Actions ({selectedEmployees.length} employees)</h5>
                  <button className="btn-close" onClick={() => setShowBulkActionModal(false)}></button>
                </div>
            <div className="modal-body">    
                <form onSubmit={handleBulkActionSubmit}>
                    <div className="alert alert-info mb-3">
                      Apply action to all selected employees
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Select Action *</label>
                      <select
                        className="form-select"
                        value={bulkAction.action}
                        onChange={(e) => setBulkAction({...bulkAction, action: e.target.value})}
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
                      <div className="mb-3">
                        <label className="form-label">Review Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={bulkAction.date}
                          onChange={(e) => setBulkAction({...bulkAction, date: e.target.value})}
                          required
                        />
                      </div>
                    )}
                    
                    {bulkAction.action === 'extend_probation' && (
                      <div className="mb-3">
                        <label className="form-label">Extension Days *</label>
                        <select
                          className="form-select"
                          value={bulkAction.extensionDays}
                          onChange={(e) => setBulkAction({...bulkAction, extensionDays: e.target.value})}
                          required
                        >
                          <option value="15">15 Days</option>
                          <option value="30">30 Days</option>
                          <option value="60">60 Days</option>
                          <option value="90">90 Days</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <label className="form-label">Message (Optional)</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Add a message for the action..."
                        value={bulkAction.message}
                        onChange={(e) => setBulkAction({...bulkAction, message: e.target.value})}
                      />
                    </div>

                </form>
                </div>
                                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setShowBulkActionModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="create-job-btn">
                      Apply Action
                    </button>
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* SEND REMINDER MODAL */}
        {showSendReminderModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Send Milestone Reminders</h5>
                  <button className="btn-close" onClick={() => setShowSendReminderModal(false)}></button>
                </div>
                
                <div className="modal-body">
                  <div className="alert alert-info mb-3">
                    <strong>Review Milestone Reminders (30-60-90 days)</strong>
                    <p className="mb-0">Sending automated reminders for upcoming probation review milestones</p>
                  </div>
                  
                  <div className="table-responsive mb-3">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Milestone</th>
                          <th>Days Since Joining</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {probationEmployees
                          .filter(emp => {
                            if (emp.status === 'completed' || emp.status === 'terminated') return false;
                            const today = new Date();
                            const joiningDate = new Date(emp.joiningDate);
                            const daysSinceJoining = Math.floor((today - joiningDate) / (1000 * 60 * 60 * 24));
                            return (daysSinceJoining >= 25 && daysSinceJoining <= 35 && !emp.review30.completed) ||
                                   (daysSinceJoining >= 55 && daysSinceJoining <= 65 && !emp.review60.completed) ||
                                   (daysSinceJoining >= 85 && daysSinceJoining <= 95 && !emp.review90.completed) ||
                                   (emp.daysRemaining <= 14 && emp.daysRemaining > 0);
                          })
                          .map(emp => {
                            const today = new Date();
                            const joiningDate = new Date(emp.joiningDate);
                            const daysSinceJoining = Math.floor((today - joiningDate) / (1000 * 60 * 60 * 24));
                            return (
                              <tr key={emp.id}>
                                <td>{emp.name} ({emp.employeeId})</td>
                                <td>{getMilestoneReminderType(emp)}</td>
                                <td>{daysSinceJoining} days</td>
                                <td>{getStatusBadge(emp.status)}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Reminder Message Template</label>
                    <select className="form-select mb-2">
                      <option>30 Day Review Reminder</option>
                      <option>60 Day Review Reminder</option>
                      <option>90 Day Review Reminder</option>
                      <option>Probation End Reminder</option>
                      <option>Custom Message</option>
                    </select>
                    <textarea
                      className="form-control"
                      rows="4"
                      defaultValue="This is a reminder about your upcoming probation review milestone. Please ensure all necessary documents and self-assessments are completed before the review date. Contact your manager or HR if you have any questions."
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" defaultChecked />
                        <label className="form-check-label">
                          Send to employees
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" defaultChecked />
                        <label className="form-check-label">
                          Send to managers
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label">
                          Send to HR Business Partners
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" defaultChecked />
                        <label className="form-check-label">
                          Include review checklist
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowSendReminderModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleSubmitReminders}
                  >
                    Send Reminders ({probationEmployees.filter(emp => {
                      if (emp.status === 'completed' || emp.status === 'terminated') return false;
                      const today = new Date();
                      const joiningDate = new Date(emp.joiningDate);
                      const daysSinceJoining = Math.floor((today - joiningDate) / (1000 * 60 * 60 * 24));
                      return (daysSinceJoining >= 25 && daysSinceJoining <= 35 && !emp.review30.completed) ||
                             (daysSinceJoining >= 55 && daysSinceJoining <= 65 && !emp.review60.completed) ||
                             (daysSinceJoining >= 85 && daysSinceJoining <= 95 && !emp.review90.completed) ||
                             (emp.daysRemaining <= 14 && emp.daysRemaining > 0);
                    }).length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EXPORT MODAL */}
        {showExportModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Export Data</h5>
                  <button className="btn-close" onClick={() => setShowExportModal(false)}></button>
                </div>
                
                <div className="modal-body">
                  <div className="alert alert-info mb-3">
                    Export probation data for reporting and analysis
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Export Format *</label>
                    <select
                      className="form-select"
                      value={reportFilters.exportFormat}
                      onChange={(e) => setReportFilters({...reportFilters, exportFormat: e.target.value})}
                    >
                      <option value="excel">Excel (.xlsx)</option>
                      <option value="pdf">PDF Document</option>
                      <option value="csv">CSV File</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Date Range</label>
                    <div className="row g-2">
                      <div className="col-6">
                        <input
                          type="date"
                          className="form-control"
                          value={reportFilters.startDate}
                          onChange={(e) => setReportFilters({...reportFilters, startDate: e.target.value})}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="date"
                          className="form-control"
                          value={reportFilters.endDate}
                          onChange={(e) => setReportFilters({...reportFilters, endDate: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowExportModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleSubmitExport}
                  >
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORT MODAL */}
{showReportModal && (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content border-0 shadow-lg rounded-3">
        <div className="modal-header">
          <h5 className="modal-title">Generate PDF Report</h5>
          <button className="btn-close" onClick={() => setShowReportModal(false)}></button>
        </div>
        <div className="modal-body">
        <form onSubmit={(e) => { e.preventDefault(); handleGenerateReport(); }}>
          
            <div className="row g-3">
              <div className="col-md-12">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Generate comprehensive PDF report for probation management
                </div>
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Report Type</label>
                <select
                  className="form-select"
                  value={reportFilters.reportType || 'probation_summary'}
                  onChange={(e) => setReportFilters({...reportFilters, reportType: e.target.value})}
                >
                  <option value="probation_summary">Probation Summary Report</option>
                  <option value="review_completion">Review Completion Report</option>
                  <option value="risk_analysis">Risk Analysis Report</option>
                  <option value="department_performance">Department Performance</option>
                  <option value="probation_timeline">Probation Timeline Report</option>
                  <option value="extension_analysis">Extension Analysis Report</option>
                  <option value="completion_rate">Completion Rate Report</option>
                </select>
              </div>
              
              
              <div className="col-md-6">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={reportFilters.startDate}
                  onChange={(e) => setReportFilters({...reportFilters, startDate: e.target.value})}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={reportFilters.endDate}
                  onChange={(e) => setReportFilters({...reportFilters, endDate: e.target.value})}
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={reportFilters.department}
                  onChange={(e) => setReportFilters({...reportFilters, department: e.target.value})}
                >
                  <option value="all">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={reportFilters.status}
                  onChange={(e) => setReportFilters({...reportFilters, status: e.target.value})}
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

        </form>
         </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setShowReportModal(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="create-job-btn"
              disabled={filteredEmployees.length === 0}
            >
              <i className="bi bi-file-earmark-pdf me-2"></i>
              Generate PDF Report
            </button>
          </div>
      </div>
    </div>
  </div>
)}

        {/* SELF ASSESSMENT MODAL */}
        {showSelfAssessmentModal && selectedEmployee && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Self-Assessment - {selectedEmployee.name}</h5>
                  <button className="btn-close" onClick={() => setShowSelfAssessmentModal(false)}></button>
                </div>
                
                <div className="modal-body">
                  <div className="alert alert-info mb-3">
                    Please complete your self-assessment for the probation review. This will be shared with your manager and HR.
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Self Rating *</label>
                    <select
                      className="form-select"
                      value={reviewForm.selfRating}
                      onChange={(e) => setReviewForm({...reviewForm, selfRating: e.target.value})}
                      required
                    >
                      <option value="">Select rating...</option>
                      <option value="exceeds_expectations">Exceeds Expectations</option>
                      <option value="meets_expectations">Meets Expectations</option>
                      <option value="needs_improvement">Needs Improvement</option>
                      <option value="unsatisfactory">Unsatisfactory</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Self Assessment *</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Describe your performance, achievements, and areas of growth..."
                      value={reviewForm.selfAssessment}
                      onChange={(e) => setReviewForm({...reviewForm, selfAssessment: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Key Achievements</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="List your key achievements during this period..."
                      value={reviewForm.achievements}
                      onChange={(e) => setReviewForm({...reviewForm, achievements: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Challenges Faced</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Describe any challenges you faced and how you addressed them..."
                      value={reviewForm.challenges}
                      onChange={(e) => setReviewForm({...reviewForm, challenges: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Goals for Next Period</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="What are your goals for the next review period?"
                      value={reviewForm.goals}
                      onChange={(e) => setReviewForm({...reviewForm, goals: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowSelfAssessmentModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="create-job-btn"
                    onClick={handleSubmitSelfAssessment}
                    disabled={!reviewForm.selfAssessment || !reviewForm.selfRating}
                  >
                    Submit Self-Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REVIEW MEETING SCHEDULE MODAL */}
{showMeetingScheduleModal && selectedEmployee && (
  <div className="hrms-modal-overlay">
    <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

 
              {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">Schedule Review Meeting - {selectedEmployee.name}</h5>
          <button className="btn-close" onClick={() => setShowMeetingScheduleModal(false)}></button>
        </div>
                 <div className="hrms-modal-body hrms-modal-body-scroll">

                <form onSubmit={handleSubmitMeeting}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Meeting Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={meetingForm.meetingDate}
                          onChange={(e) => setMeetingForm({...meetingForm, meetingDate: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label">Meeting Time *</label>
                        <input
                          type="time"
                          className="form-control"
                          value={meetingForm.meetingTime}
                          onChange={(e) => setMeetingForm({...meetingForm, meetingTime: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label">Duration (minutes) *</label>
                        <select
                          className="form-select"
                          value={meetingForm.duration}
                          onChange={(e) => setMeetingForm({...meetingForm, duration: e.target.value})}
                          required
                        >
                          <option value="30">30 minutes</option>
                          <option value="60">60 minutes</option>
                          <option value="90">90 minutes</option>
                          <option value="120">120 minutes</option>
                        </select>
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label">Meeting Type *</label>
                        <select
                          className="form-select"
                          value={meetingForm.meetingType}
                          onChange={(e) => setMeetingForm({...meetingForm, meetingType: e.target.value})}
                          required
                        >
                          <option value="in_person">In Person</option>
                          <option value="virtual">Virtual</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                      
                      {meetingForm.meetingType === 'virtual' || meetingForm.meetingType === 'hybrid' ? (
                        <div className="col-12">
                          <label className="form-label">Meeting Link *</label>
                          <input
                            type="url"
                            className="form-control"
                            value={meetingForm.meetingLink}
                            onChange={(e) => setMeetingForm({...meetingForm, meetingLink: e.target.value})}
                            placeholder="https://zoom.us/j/..."
                            required
                          />
                        </div>
                      ) : (
                        <div className="col-12">
                          <label className="form-label">Location *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={meetingForm.location}
                            onChange={(e) => setMeetingForm({...meetingForm, location: e.target.value})}
                            placeholder="Conference Room A, Building 2"
                            required
                          />
                        </div>
                      )}
                      
                      <div className="col-12">
                        <label className="form-label">Attendees</label>
                        <input
                          type="text"
                          className="form-control"
                          value={meetingForm.attendees.join(', ')}
                          onChange={(e) => setMeetingForm({
                            ...meetingForm,
                            attendees: e.target.value.split(',').map(a => a.trim())
                          })}
                          placeholder="Manager, HR Manager, Employee"
                        />
                        <small className="text-muted">Separate multiple attendees with commas</small>
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label">Meeting Agenda</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={meetingForm.agenda}
                          onChange={(e) => setMeetingForm({...meetingForm, agenda: e.target.value})}
                          placeholder="Review objectives, performance discussion, feedback..."
                        />
                      </div>
                      
<div className="col-12">
  <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        color: meetingForm.sendCalendarInvite ? "#2563eb" : "#4B5563",
        transition: "color 0.3s ease",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "4px",
          border: `2px solid ${meetingForm.sendCalendarInvite ? "#2563eb" : "#9CA3AF"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "10px",
          transition: "all 0.3s ease",
          background: meetingForm.sendCalendarInvite ? "#2563eb" : "transparent",
        }}
      >
        {meetingForm.sendCalendarInvite && (
          <span
            style={{
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              lineHeight: 1,
            }}
          >
            ✓
          </span>
        )}
      </div>
      <input
        type="checkbox"
        checked={meetingForm.sendCalendarInvite}
        onChange={(e) => setMeetingForm({...meetingForm, sendCalendarInvite: e.target.checked})}
        style={{ display: "none" }}
      />
      <span>Send calendar invites to all attendees</span>
    </label>
  </div>
</div>
                    </div>
                </form>

                </div>
                <div className="modal-footer bg-white border-top d-flex">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setShowMeetingScheduleModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="create-job-btn">
                      Schedule Meeting
                    </button>
                  </div>
      </div>
    </div>

)}

        {/* CONFIRMATION LETTER MODAL */}
        {showConfirmationLetterModal && selectedEmployee && (
   <div
    className="modal fade show d-block"
    tabIndex="-1"
    style={{
      backgroundColor: "rgba(0,0,0,0.5)",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1055,
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) setShowDetailModal(false);
    }}
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div 
        className="modal-content border-0 shadow-lg rounded-3"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
                <div className="modal-header">
                  <h5 className="modal-title">Generate Confirmation Letter - {selectedEmployee.name}</h5>
                  <button className="btn-close" onClick={() => setShowConfirmationLetterModal(false)}></button>
                </div>
                
                <form onSubmit={handleSubmitConfirmationLetter}>
                  <div className="modal-body">
                    <div className="alert alert-success mb-3">
                      <strong>Congratulations!</strong> Generating confirmation letter for {selectedEmployee.name}
                    </div>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Effective Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={confirmationLetterForm.effectiveDate}
                          onChange={(e) => setConfirmationLetterForm({...confirmationLetterForm, effectiveDate: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label">Designation *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={confirmationLetterForm.designation}
                          onChange={(e) => setConfirmationLetterForm({...confirmationLetterForm, designation: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label">Department *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={confirmationLetterForm.department}
                          onChange={(e) => setConfirmationLetterForm({...confirmationLetterForm, department: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label">Salary</label>
                        <input
                          type="text"
                          className="form-control"
                          value={confirmationLetterForm.salary}
                          onChange={(e) => setConfirmationLetterForm({...confirmationLetterForm, salary: e.target.value})}
                          placeholder="₹X,XX,XXX"
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label">Reporting Manager *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={confirmationLetterForm.reportingManager}
                          onChange={(e) => setConfirmationLetterForm({...confirmationLetterForm, reportingManager: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label">Work Location *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={confirmationLetterForm.workLocation}
                          onChange={(e) => setConfirmationLetterForm({...confirmationLetterForm, workLocation: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label">Custom Message</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={confirmationLetterForm.customMessage}
                          onChange={(e) => setConfirmationLetterForm({...confirmationLetterForm, customMessage: e.target.value})}
                          placeholder="Additional message to include in the confirmation letter..."
                        />
                      </div>
                      
                <div style={{ display: "flex", gap: "40px", alignItems: "center", marginBottom: "20px" }}>
                  {/* Include Terms & Conditions Checkbox */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      color: confirmationLetterForm.includeTerms ? "#2563eb" : "#4B5563",
                      transition: "color 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        border: `2px solid ${confirmationLetterForm.includeTerms ? "#2563eb" : "#9CA3AF"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                        transition: "all 0.3s ease",
                        background: confirmationLetterForm.includeTerms ? "#2563eb" : "transparent",
                      }}
                    >
                      {confirmationLetterForm.includeTerms && (
                        <span
                          style={{
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold",
                            lineHeight: 1,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={confirmationLetterForm.includeTerms}
                      onChange={(e) => setConfirmationLetterForm({...confirmationLetterForm, includeTerms: e.target.checked})}
                      style={{ display: "none" }}
                    />
                    <span>Include Terms & Conditions</span>
                  </label>

                  {/* Apply Digital Signature Checkbox */}
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      color: confirmationLetterForm.digitalSignature ? "#2563eb" : "#4B5563",
                      transition: "color 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        border: `2px solid ${confirmationLetterForm.digitalSignature ? "#2563eb" : "#9CA3AF"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                        transition: "all 0.3s ease",
                        background: confirmationLetterForm.digitalSignature ? "#2563eb" : "transparent",
                      }}
                    >
                      {confirmationLetterForm.digitalSignature && (
                        <span
                          style={{
                            color: "white",
                            fontSize: "12px",
                            fontWeight: "bold",
                            lineHeight: 1,
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={confirmationLetterForm.digitalSignature}
                      onChange={(e) => setConfirmationLetterForm({...confirmationLetterForm, digitalSignature: e.target.checked})}
                      style={{ display: "none" }}
                    />
                    <span>Apply Digital Signature</span>
                  </label>
                </div>
                      
                    </div>
                  </div>
                  
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setShowConfirmationLetterModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="add-employee">
                      Generate & Send Letter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}


        {/* DETAILS MODAL */}
        {showDetailModal && selectedEmployee && (
   <div
  className="hrms-modal-overlay"
  >
    <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">
             {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">Employee Details - {selectedEmployee.name}</h5>
                  <button className="btn-close" onClick={() => setShowDetailModal(false)}></button>
                </div>
                
              {/* BODY */}
              <div className="hrms-modal-body hrms-modal-body-scroll">
                  <div className="row mb-4">
                    <div className="col-md-8">
                      <div>
                        <h6 className="mb-1">{selectedEmployee.name}</h6>
                        <p className="text-muted mb-1">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                        <div className="d-flex gap-2">
                          <span className="badge bg-primary">{selectedEmployee.employeeId}</span>
                          {getStatusBadge(selectedEmployee.status)}
                          {getRiskBadge(selectedEmployee.riskLevel)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex gap-2">
                          <button 
                            className="create-job-btn"
                            onClick={() => {
                              setShowDetailModal(false);
                              handleStartReview(selectedEmployee);
                            }}
                             style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                          >
                            Conduct Review
                          </button>
                          <button
                            className="job-listings-btn"
                            onClick={() => {
                              setShowDetailModal(false);
                              handleScheduleMeeting(selectedEmployee, '30_day');
                            }}
                             style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                          >
                            Schedule Meeting
                          </button>
{selectedEmployee.status === 'completed' && selectedEmployee.confirmationLetterId && (
  <button
    className="btn btn-outline-success btn-sm"
    onClick={() => {
      setSelectedEmployee(selectedEmployee);
      setShowConfirmationLetterViewModal(true);
    }}
    style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
  >                               
    View Letter
  </button>
)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card mb-2">
                        <div className="card-header bg-light">
                          <strong>Probation Information</strong>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-6">
                              <small className="text-muted d-block">Joining Date</small>
                              <strong>{formatDate(selectedEmployee.joiningDate)}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Probation Ends</small>
                              <strong>{formatDate(selectedEmployee.probationEndDate)}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Days Remaining</small>
                              <strong className={
                                selectedEmployee.daysRemaining <= 0 ? 'text-danger' :
                                selectedEmployee.daysRemaining <= 7 ? 'text-danger' :
                                selectedEmployee.daysRemaining <= 30 ? 'text-warning' : 'text-success'
                              }>
                                {selectedEmployee.daysRemaining} days
                              </strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Progress</small>
                              <ProgressBar percentage={selectedEmployee.progress} showLabel={false} />
                              <div className="small text-muted">{selectedEmployee.progress}% complete</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card mb-2">
                        <div className="card-header bg-light">
                          <strong>Contact Information</strong>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-6">
                              <small className="text-muted d-block">Manager</small>
                              <strong>{selectedEmployee.manager}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Email</small>
                              <strong>{selectedEmployee.contactEmail}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Phone</small>
                              <strong>{selectedEmployee.contactPhone}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Location</small>
                              <strong>{selectedEmployee.workLocation}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                      <strong>Review History</strong>
                      <ReviewMilestones employee={selectedEmployee} />
                    </div>
                    <div className="card-body">
                      {reviewHistory.filter(r => r.employeeId === selectedEmployee.employeeId).length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Review</th>
                                <th>Date</th>
                                <th>Rating</th>
                                <th>Reviewer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reviewHistory
                                .filter(r => r.employeeId === selectedEmployee.employeeId)
                                .map(review => (
                                  <tr key={review.id}>
                                    <td>{review.reviewType}</td>
                                    <td>{formatDate(review.reviewDate)}</td>
                                    <td>{getRatingBadge(review.rating)}</td>
                                    <td>{review.reviewer}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-muted text-center mb-0">No review history available</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer bg-white border-top d-flex">
                  <button 
                    type="button" 
                    className="close-btn"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

        )}
        
{/* CONFIRMATION LETTER VIEW MODAL */}
{showConfirmationLetterViewModal && selectedEmployee && (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div 
        className="modal-content border-0 shadow-lg rounded-3"
        style={{
          maxWidth: "850px",
          margin: "0 auto",
        }}
      >
        <div className="modal-header">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <h5 className="modal-title mb-0">Confirmation Letter</h5>
              <small className="text-muted">Letter ID: {selectedEmployee.confirmationLetterId}</small>
            </div>
            <div className="d-flex gap-2">
              <button className="btn-close" onClick={() => setShowConfirmationLetterViewModal(false)}></button>
            </div>
          </div>
        </div>
        
        <div className="modal-body">
          {/* Letter Content */}
          <div id="confirmation-letter-content" className="border p-4" style={{ fontFamily: 'Times New Roman, serif' }}>
            {/* Letter Header */}
            <div className="text-center mb-4">
              <h4 className="fw-bold" style={{ color: '#2c3e50' }}>CONFIRMATION LETTER</h4>
              <div className="border-bottom mx-auto" style={{ width: '200px', borderColor: '#3498db' }}></div>
            </div>
            
            {/* Company Header */}
            <div className="text-end mb-4">
              <p className="mb-1"><strong>Letter ID:</strong> {selectedEmployee.confirmationLetterId}</p>
              <p className="mb-1"><strong>Date:</strong> {formatDate(selectedEmployee.confirmationDate || selectedEmployee.probationEndDate)}</p>
            </div>
            
            {/* Employee Details */}
            <div className="mb-4">
              <p className="mb-2"><strong>To:</strong></p>
              <p className="mb-1">{selectedEmployee.name}</p>
              <p className="mb-1">{selectedEmployee.designation}</p>
              <p className="mb-1">{selectedEmployee.department}</p>
              <p className="mb-1">{selectedEmployee.workLocation}</p>
            </div>
            
            {/* Subject */}
            <div className="mb-4">
              <p className="fw-bold" style={{ color: '#2c3e50' }}>Subject: Confirmation of Employment</p>
            </div>
            
            {/* Letter Body */}
            <div className="mb-4">
              <p className="mb-3">Dear {selectedEmployee.name},</p>
              
              <p className="mb-3">
                We are pleased to inform you that your probation period has been successfully completed, 
                and you are hereby confirmed as a permanent employee of the company effective 
                <strong> {formatDate(selectedEmployee.confirmationDate || selectedEmployee.probationEndDate)}</strong>.
              </p>
              
              <p className="mb-3">
                Your performance during the probation period has been evaluated and found to be satisfactory. 
                The management appreciates your dedication, hard work, and commitment to the organization.
              </p>
              
              <div className="card bg-light border-0 p-3 mb-3">
                <h6 className="fw-bold mb-2">Employment Details:</h6>
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Designation:</strong> {selectedEmployee.designation}</p>
                    <p className="mb-1"><strong>Department:</strong> {selectedEmployee.department}</p>
                    <p className="mb-1"><strong>Reporting Manager:</strong> {selectedEmployee.manager}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Employment Type:</strong> {selectedEmployee.employmentType}</p>
                    <p className="mb-1"><strong>Work Location:</strong> {selectedEmployee.workLocation}</p>
                    <p className="mb-1"><strong>Date of Joining:</strong> {formatDate(selectedEmployee.joiningDate)}</p>
                  </div>
                </div>
              </div>
              
              <p className="mb-3">
                As a confirmed employee, you will be entitled to all benefits and privileges as per company policy. 
                Your salary, allowances, and other terms of employment remain unchanged unless otherwise notified.
              </p>
              
              <p className="mb-3">
                We look forward to your continued contribution to the growth and success of the organization. 
                Please feel free to contact the HR department for any clarifications regarding your employment terms.
              </p>
              
              <p className="mb-0">Congratulations once again on your confirmation!</p>
            </div>
            
            {/* Signatures */}
            <div className="row mt-5">
              <div className="col-md-6">
                <div className="border-top pt-3">
                  <p className="mb-1"><strong>For [Company Name]</strong></p>
                  <p className="mb-1">Authorized Signatory</p>
                  <p className="mb-0">Human Resources Department</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border-top pt-3">
                  <p className="mb-1"><strong>Accepted by Employee</strong></p>
                  <p className="mb-1">__________________________</p>
                  <p className="mb-0">Signature</p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-4 pt-3 border-top text-center">
              <p className="text-muted small mb-0">
                This is a system-generated confirmation letter. For any discrepancies, please contact HR department.
              </p>
            </div>
          </div>
          
          {/* Letter Status */}
          <div className="card mt-3">
            <div className="card-body">
              <h6 className="card-title">Letter Status</h6>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Generated On:</strong> {formatDate(selectedEmployee.confirmationDate || selectedEmployee.probationEndDate)}</p>
                  <p className="mb-1"><strong>Status:</strong> <span className="badge bg-success">Delivered</span></p>
                  <p className="mb-1"><strong>Delivery Method:</strong> Email & Employee Portal</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Employee Acknowledged:</strong> <span className="badge bg-success">Yes</span></p>
                  <p className="mb-1"><strong>Acknowledged Date:</strong> {formatDate(new Date().toISOString().split('T')[0])}</p>
                  <p className="mb-0"><strong>HR Representative:</strong> {selectedEmployee.hrBusinessPartner || 'HR Manager'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
<div className="modal-footer">
  <div className="d-flex justify-content-end w-100">
    <div className="d-flex gap-2">


      <button
        className="btn btn-outline-success btn-sm"
        onClick={() => generateConfirmationLetterPDF(selectedEmployee)}
      >
        <i className="bi bi-download me-1"></i> Download PDF
      </button>

              <button 
                type="button" 
                className="close-btn"
                onClick={() => setShowConfirmationLetterViewModal(false)}
              >
                Close
              </button>
              
    </div>
  </div>
</div>

        
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default ProbationManagement;