import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Icon } from "@iconify/react/dist/iconify.js";


const InductionOrientation = () => {

  // ==================== INITIAL DATA ====================
const initialPrograms = [
  {
    id: 1,
    name: 'Q1 2024 New Hire Orientation',
    description: 'Comprehensive onboarding for Q1 2024 hires',
    type: 'batch',
    status: 'upcoming',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    duration: '5 days',
    location: 'Main Auditorium',
    meetingLink: '',
    totalSessions: 12,
    completedSessions: 0,
    totalParticipants: 25, // Rahul and Amit
    confirmedParticipants: 22, // Both are assigned
    attendanceRate: 50, // 1 present, 1 late out of 2
    overallRating: 0,
    schedule: [
      {
        id: 1,
        title: 'Welcome & Company Overview',
        date: '2024-04-01',
        startTime: '09:00',
        endTime: '10:30',
        agenda: 'Introduction to company culture, values, and history',
        trainer: 'John Doe',
        meetingLink: 'https://zoom.us/j/123456789',
        venue: 'Main Auditorium',
        isVirtual: false,
        materials: ['Company Handbook.pdf', 'Welcome Package.zip']
      }
    ],
    participants: [
      {
        id: 1,
        employeeId: 'EMP001',
        employeeName: 'Rahul Sharma',
        department: 'Engineering',
        email: 'rahul.sharma@company.com'
      },
      {
        id: 3,
        employeeId: 'EMP003',
        employeeName: 'Amit Kumar',
        department: 'Sales',
        email: 'amit.kumar@company.com'
      }
    ],
    trainers: [],
    materials: [
      { id: 1, name: 'Company Handbook.pdf', type: 'document', uploadedDate: '2024-03-28' },
      { id: 2, name: 'Welcome Package.zip', type: 'archive', uploadedDate: '2024-03-28' }
    ],
    feedback: [],
    certificates: []
  },
  {
    id: 2,
    name: 'March 2024 Individual Onboarding',
    description: 'Individual onboarding for March hires',
    type: 'individual',
    status: 'ongoing',
    startDate: '2024-03-25',
    endDate: '2024-03-29',
    duration: '5 days',
    location: 'Virtual',
    totalSessions: 8,
    completedSessions: 3,
    totalParticipants: 1, // Priya
    confirmedParticipants: 1,
    attendanceRate: 100,
    overallRating: 4.8,
    schedule: [],
    participants: [
      {
        id: 2,
        employeeId: 'EMP002',
        employeeName: 'Priya Patel',
        department: 'Marketing',
        email: 'priya.patel@company.com'
      }
    ],
    trainers: [],
    materials: [],
    feedback: [],
    certificates: []
  }
];

  const initialPolicies = [
    {
      id: 1,
      name: 'Employee Code of Conduct',
      category: 'general',
      description: 'Standards of behavior expected from all employees',
      version: '3.2',
      effectiveDate: '2024-01-01',
      readTime: '15 minutes',
      status: 'published',
      acknowledgments: 145,
      lastAcknowledged: '2024-03-20',
      required: true,
      content: 'Full policy content here...',
      modules: [
        { id: 1, title: 'Introduction', content: 'Introduction to code of conduct...', read: false },
        { id: 2, title: 'Professional Behavior', content: 'Standards for professional behavior...', read: false },
        { id: 3, title: 'Ethical Guidelines', content: 'Ethical guidelines and principles...', read: false }
      ],
      quiz: [
        {
          id: 1,
          question: 'What is the primary purpose of the Code of Conduct?',
          options: ['To restrict employees', 'To guide ethical behavior', 'To enforce rules', 'To limit creativity'],
          correctAnswer: 1
        },
        {
          id: 2,
          question: 'Who should you report violations to?',
          options: ['HR Department', 'Your Manager', 'Compliance Officer', 'All of the above'],
          correctAnswer: 3
        }
      ],
      passingScore: 70,
      documents: ['Code_of_Conduct_v3.2.pdf'],
      completionTracking: {
        totalEmployees: 150,
        completed: 145,
        pending: 5,
        averageScore: 85.5
      }
    },
    {
      id: 2,
      name: 'POSH Policy',
      category: 'compliance',
      description: 'Prevention of Sexual Harassment at Workplace',
      version: '2.1',
      effectiveDate: '2024-01-15',
      readTime: '20 minutes',
      status: 'mandatory',
      acknowledgments: 150,
      lastAcknowledged: '2024-03-22',
      required: true,
      content: 'Full POSH policy content...',
      modules: [
        { id: 1, title: 'Definition & Scope', content: 'Definition of sexual harassment...', read: false },
        { id: 2, title: 'Prevention Measures', content: 'Measures to prevent harassment...', read: false },
        { id: 3, title: 'Complaint Procedure', content: 'How to file complaints...', read: false }
      ],
      quiz: [
        {
          id: 1,
          question: 'What constitutes sexual harassment?',
          options: ['Physical advances', 'Verbal comments', 'Non-verbal gestures', 'All of the above'],
          correctAnswer: 3
        }
      ],
      passingScore: 80,
      documents: ['POSH_Policy_v2.1.pdf'],
      completionTracking: {
        totalEmployees: 150,
        completed: 150,
        pending: 0,
        averageScore: 92.3
      }
    },
    {
      id: 3,
      name: 'Data Privacy & Confidentiality Agreement',
      category: 'security',
      description: 'Data privacy and confidentiality requirements',
      version: '1.0',
      effectiveDate: '2024-02-01',
      readTime: '10 minutes',
      status: 'mandatory',
      acknowledgments: 148,
      lastAcknowledged: '2024-03-25',
      required: true,
      content: 'Full data privacy policy content...',
      modules: [
        { id: 1, title: 'Data Classification', content: 'Types of data and classification...', read: false },
        { id: 2, title: 'Confidentiality Obligations', content: 'Employee obligations...', read: false }
      ],
      quiz: [
        {
          id: 1,
          question: 'Can you share confidential data with external parties?',
          options: ['Yes, if needed', 'No, never without authorization', 'Only with friends', 'Sometimes'],
          correctAnswer: 1
        }
      ],
      passingScore: 75,
      documents: ['Data_Privacy_Policy_v1.0.pdf'],
      completionTracking: {
        totalEmployees: 150,
        completed: 148,
        pending: 2,
        averageScore: 88.7
      }
    }
  ];

  // ==================== USER INFO ====================
const userInfo = {
  name: 'Sarah Johnson',
  role: 'HR Head',
  email: 'sarah.johnson@company.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
};

  // ==================== STATE MANAGEMENT ====================
  const [inductionPrograms, setInductionPrograms] = useState(initialPrograms);
  const [policies, setPolicies] = useState(initialPolicies);
  const [showCreateProgram, setShowCreateProgram] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  
  // Enhanced states
  const [showTrainerAssignmentModal, setShowTrainerAssignmentModal] = useState(false);
  const [showBulkAttendanceModal, setShowBulkAttendanceModal] = useState(false);
  const [showPolicyUploadModal, setShowPolicyUploadModal] = useState(false);
  const [showMaterialDistributionModal, setShowMaterialDistributionModal] = useState(false);
  const [showVenueBookingModal, setShowVenueBookingModal] = useState(false);
  const [showSessionAgendaModal, setShowSessionAgendaModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPolicyQuizModal, setShowPolicyQuizModal] = useState(false);
  const [showPolicyModuleModal, setShowPolicyModuleModal] = useState(false);
  // Add this to your state declarations
const [showProgramDetailsModal, setShowProgramDetailsModal] = useState(false);

  const [policyCompletionData, setPolicyCompletionData] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [currentPolicyModule, setCurrentPolicyModule] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [feedbackData, setFeedbackData] = useState({});

// Add these to your state declarations
const [sessions, setSessions] = useState([]);
const [showEditSessionModal, setShowEditSessionModal] = useState(false);
const [editingSession, setEditingSession] = useState(null);
const [selectedSessionForDelete, setSelectedSessionForDelete] = useState(null);
// ==================== EMPLOYEES DATA & STATE ====================

// ==================== STATE ADDITIONS ====================
// Add these to your state declarations
const [selectedProgramForAttendance, setSelectedProgramForAttendance] = useState(null);
const [attendanceDate, setAttendanceDate] = useState('');
const [employees, setEmployees] = useState([
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@company.com',
    phone: '+91 9876543210',
    employeeId: 'EMP001',
    department: 'Engineering',
    designation: 'Software Engineer',
    joiningDate: '2024-03-20',
    programAssigned: 1, // Reference to program ID
    attendanceStatus: 'present',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@company.com',
    phone: '+91 8765432109',
    employeeId: 'EMP002',
    department: 'Marketing',
    designation: 'Marketing Manager',
    joiningDate: '2024-03-15',
    programAssigned: 1,
    attendanceStatus: 'present',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit.kumar@company.com',
    phone: '+91 7654321098',
    employeeId: 'EMP003',
    department: 'Sales',
    designation: 'Sales Executive',
    joiningDate: '2024-03-22',
    programAssigned: null,
    attendanceStatus: 'not_started',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Sneha Verma',
    email: 'sneha.verma@company.com',
    phone: '+91 6543210987',
    employeeId: 'EMP004',
    department: 'HR',
    designation: 'HR Executive',
    joiningDate: '2024-04-01',
    programAssigned: null,
    attendanceStatus: 'not_started',
    status: 'Active'
  }
]);

const [selectedEmployees, setSelectedEmployees] = useState([]);
const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
const [employeeDepartmentFilter, setEmployeeDepartmentFilter] = useState('all');

// Add departments array
const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];


// Filter employees based on search term and department
const filteredEmployees = employees.filter(employee => {
  // Search filter
  const searchMatch = 
    employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(employeeSearchTerm.toLowerCase());

  // Department filter
  const departmentMatch = 
    employeeDepartmentFilter === 'all' || 
    employee.department === employeeDepartmentFilter;

  return searchMatch && departmentMatch;
});

// Get unique departments for filter


  // Form states
  const [programForm, setProgramForm] = useState({
    name: '',
    description: '',
    type: 'batch',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: 30
  });

  const [trainerAssignmentData, setTrainerAssignmentData] = useState({
    programId: null,
    sessionId: null,
    trainerName: '',
    trainerEmail: '',
    trainerRole: ''
  });

  const [sessionAgendaForm, setSessionAgendaForm] = useState({
    programId: null,
    sessionTitle: '',
    sessionDate: '',
    startTime: '',
    endTime: '',
    agenda: '',
    meetingLink: '',
    venue: '',
    isVirtual: false
  });

  const [materialForm, setMaterialForm] = useState({
    programId: null,
    materialName: '',
    materialType: 'document',
    file: null,
    description: ''
  });

  const [venueForm, setVenueForm] = useState({
    programId: null,
    venueName: '',
    address: '',
    capacity: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    amenities: []
  });



// Add these states to your existing state declarations
const [attendanceRecords, setAttendanceRecords] = useState([
  {
    id: 1,
    employeeId: 'EMP001',
    employeeName: 'Rahul Sharma',
    department: 'Engineering',
    programId: 1,
    programName: 'Q1 2024 New Hire Orientation',
    sessionDate: '2024-04-01',
    status: 'present',
    checkInTime: '09:00',
    checkOutTime: '17:00',
    remarks: 'On time',
    recordedBy: 'Sarah Johnson',
    recordedAt: '2024-04-01 09:05'
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employeeName: 'Priya Patel',
    department: 'Marketing',
    programId: 1,
    programName: 'Q1 2024 New Hire Orientation',
    sessionDate: '2024-04-01',
    status: 'late',
    checkInTime: '09:25',
    checkOutTime: '17:00',
    remarks: 'Traffic delay',
    recordedBy: 'Sarah Johnson',
    recordedAt: '2024-04-01 09:30'
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employeeName: 'Amit Kumar',
    department: 'Sales',
    programId: 2,
    programName: 'March 2024 Individual Onboarding',
    sessionDate: '2024-03-28',
    status: 'absent',
    checkInTime: '--',
    checkOutTime: '--',
    remarks: 'Medical leave',
    recordedBy: 'John Doe',
    recordedAt: '2024-03-28 09:00'
  }
]);

const [showAttendanceHistoryModal, setShowAttendanceHistoryModal] = useState(false);
const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState(null);
const [attendanceFilter, setAttendanceFilter] = useState('all');

// Add modal states for employee progress
const [showEmployeeProgressModal, setShowEmployeeProgressModal] = useState(false);
const [showAssignProgramModal, setShowAssignProgramModal] = useState(false);
const [showUpdateProgressModal, setShowUpdateProgressModal] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState(null);

// Form state for assigning programs
const [assignProgramForm, setAssignProgramForm] = useState({
  employeeId: '',
  programId: '',
  startDate: '',
  endDate: ''
});

// Initialize sessions from programs when component mounts
useEffect(() => {
  const allSessions = [];
  inductionPrograms.forEach(program => {
    if (program.schedule && program.schedule.length > 0) {
      program.schedule.forEach(session => {
        allSessions.push({
          ...session,
          programName: program.name,
          programId: program.id
        });
      });
    }
  });
  setSessions(allSessions);
}, [inductionPrograms]);


// ==================== ATTENDANCE DETAILS MODAL ====================
const AttendanceDetailsModal = () => {
  if (!selectedAttendanceRecord) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Attendance Details</h5>
            <button className="btn-close" onClick={() => setShowAttendanceHistoryModal(false)}></button>
          </div>
          
          <div className="modal-body pt-0">
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Employee Information</h6>
                    <div className="mb-2">
                      <small className="text-muted">Name</small>
                      <div className="fw-bold">{selectedAttendanceRecord.employeeName}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Employee ID</small>
                      <div className="fw-bold">{selectedAttendanceRecord.employeeId}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Department</small>
                      <div className="fw-bold">{selectedAttendanceRecord.department}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Attendance Information</h6>
                    <div className="mb-2">
                      <small className="text-muted">Status</small>
                      <div>
                        {selectedAttendanceRecord.status === 'present' ? (
                          <span className="badge bg-success">Present</span>
                        ) : selectedAttendanceRecord.status === 'absent' ? (
                          <span className="badge bg-danger">Absent</span>
                        ) : (
                          <span className="badge bg-warning">{selectedAttendanceRecord.status}</span>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Date</small>
                      <div className="fw-bold">{selectedAttendanceRecord.sessionDate}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Session Time</small>
                      <div className="fw-bold">
                        {selectedAttendanceRecord.checkInTime} - {selectedAttendanceRecord.checkOutTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Program Information</h6>
                    <div className="mb-2">
                      <small className="text-muted">Program</small>
                      <div className="fw-bold">{selectedAttendanceRecord.programName}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Session Title</small>
                      <div className="fw-bold">{selectedAttendanceRecord.sessionTitle}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Record Information</h6>
                    <div className="mb-2">
                      <small className="text-muted">Recorded By</small>
                      <div className="fw-bold">{selectedAttendanceRecord.recordedBy}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Recorded At</small>
                      <div className="fw-bold">{selectedAttendanceRecord.recordedAt}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold mb-3">Remarks</h6>
              <div className="card border">
                <div className="card-body">
                  {selectedAttendanceRecord.remarks || 'No remarks provided'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer border-0">
            <button className="btn btn-outline-secondary" onClick={() => setShowAttendanceHistoryModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  // ==================== HANDLERS ====================
const handleCreateProgram = () => {
  // Calculate duration if not provided
  let duration = programForm.duration;
  if (!duration && programForm.startDate && programForm.endDate) {
    const start = new Date(programForm.startDate);
    const end = new Date(programForm.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    duration = `${diffDays} days`;
  }

  const newProgram = {
    id: inductionPrograms.length + 1,
    name: programForm.name,
    description: programForm.description,
    type: programForm.type,
    status: 'upcoming', // Default status
    startDate: programForm.startDate,
    endDate: programForm.endDate,
    duration: duration || '5 days',
    location: programForm.location,
    meetingLink: programForm.meetingLink || '',
    maxParticipants: programForm.maxParticipants || 30,
    department: programForm.department || 'all',
    programLead: programForm.programLead || '',
    autoAssign: programForm.autoAssign || false,
    sendNotifications: programForm.sendNotifications || false,
    generateCertificate: programForm.generateCertificate !== false,
    totalSessions: 0,
    completedSessions: 0,
    totalParticipants: 0,
    confirmedParticipants: 0,
    attendanceRate: 0,
    overallRating: 0,
    schedule: [],
    participants: [],
    trainers: [],
    materials: [],
    feedback: [],
    certificates: [],
    createdAt: new Date().toISOString().split('T')[0]
  };

  setInductionPrograms([...inductionPrograms, newProgram]);
  setShowCreateProgram(false);
  
  // Reset form
  setProgramForm({
    name: '',
    description: '',
    type: 'batch',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: 30
  });
  
  alert(`Program "${newProgram.name}" created successfully!`);
};

  const handleAssignTrainer = () => {
    const { programId, sessionId, trainerName } = trainerAssignmentData;
    
    if (!programId || !sessionId || !trainerName) {
      alert('Please fill all required fields');
      return;
    }

    alert(`Trainer ${trainerName} assigned successfully!`);
    setShowTrainerAssignmentModal(false);
    setTrainerAssignmentData({
      programId: null,
      sessionId: null,
      trainerName: ''
    });
  };

  const handleCompletePolicy = (policyId) => {
    setPolicyCompletionData(prev => ({
      ...prev,
      [policyId]: {
        completed: true,
        completionDate: new Date().toISOString().split('T')[0]
      }
    }));

    setPolicies(prev => prev.map(p => 
      p.id === policyId 
        ? { 
            ...p, 
            acknowledgments: p.acknowledgments + 1,
            lastAcknowledged: new Date().toISOString().split('T')[0],
            completionTracking: {
              ...p.completionTracking,
              completed: p.completionTracking.completed + 1,
              pending: p.completionTracking.pending - 1
            }
          }
        : p
    ));

    alert('Policy completed successfully!');
  };

const handleCreateSession = () => {
  if (!sessionAgendaForm.programId || !sessionAgendaForm.sessionTitle) {
    alert('Please fill all required fields');
    return;
  }

const newSession = {
  id: Date.now(),
  ...sessionAgendaForm,
  materials: [],
  trainer: sessionAgendaForm.trainer || '',
  status: 'scheduled',
  createdAt: new Date().toISOString().split('T')[0],
  updatedAt: new Date().toISOString().split('T')[0]
};

  // Add to sessions state
  setSessions(prev => [...prev, {
    ...newSession,
    programName: inductionPrograms.find(p => p.id === sessionAgendaForm.programId)?.name || 'Unknown'
  }]);

  // Update the program's schedule
  setInductionPrograms(prev => prev.map(program => 
    program.id === sessionAgendaForm.programId
      ? {
          ...program,
          schedule: [...(program.schedule || []), newSession],
          totalSessions: (program.totalSessions || 0) + 1
        }
      : program
  ));

  setShowSessionAgendaModal(false);
  setSessionAgendaForm({
    programId: null,
    sessionTitle: '',
    sessionDate: '',
    startTime: '',
    endTime: '',
    agenda: '',
    meetingLink: '',
    venue: '',
    trainer: '',
    isVirtual: false
  });
  alert('Session created successfully!');
};

// Edit session function
const handleEditSession = () => {
  if (!editingSession || !editingSession.sessionTitle) {
    alert('Please fill all required fields');
    return;
  }

  setSessions(prev => prev.map(session => 
    session.id === editingSession.id ? { ...editingSession } : session
  ));

  // Update in program schedule
  setInductionPrograms(prev => prev.map(program => 
    program.id === editingSession.programId
      ? {
          ...program,
          schedule: program.schedule.map(s => 
            s.id === editingSession.id ? { ...editingSession } : s
          )
        }
      : program
  ));

  setShowEditSessionModal(false);
  setEditingSession(null);
  alert('Session updated successfully!');
};

// Delete session function
const handleDeleteSession = (sessionId) => {
  if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
    // Find the session to get programId
    const sessionToDelete = sessions.find(s => s.id === sessionId);
    
    // Remove from sessions state
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    // Remove from program schedule
    if (sessionToDelete) {
      setInductionPrograms(prev => prev.map(program => 
        program.id === sessionToDelete.programId
          ? {
              ...program,
              schedule: program.schedule.filter(s => s.id !== sessionId),
              totalSessions: Math.max(0, program.totalSessions - 1)
            }
          : program
      ));
    }
    
    setSelectedSessionForDelete(null);
    alert('Session deleted successfully!');
  }
};

// Format time function
const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Calculate session duration
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '';

  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);

  let diff = (end - start) / (1000 * 60 * 60); // hours

  // Round to 2 decimal places
  diff = Math.round(diff * 100) / 100;

  return `${diff} hr${diff !== 1 ? 's' : ''}`;
};

  const handleDistributeMaterial = () => {
    if (!materialForm.programId || !materialForm.materialName) {
      alert('Please fill all required fields');
      return;
    }

    const newMaterial = {
      id: Date.now(),
      ...materialForm,
      uploadedDate: new Date().toISOString().split('T')[0]
    };

    setInductionPrograms(prev => prev.map(program => 
      program.id === materialForm.programId
        ? {
            ...program,
            materials: [...(program.materials || []), newMaterial]
          }
        : program
    ));

    setShowMaterialDistributionModal(false);
    setMaterialForm({
      programId: null,
      materialName: '',
      materialType: 'document',
      file: null,
      description: ''
    });
    alert('Material distributed successfully!');
  };

  const handleBookVenue = () => {
    if (!venueForm.programId || !venueForm.venueName || !venueForm.bookingDate) {
      alert('Please fill all required fields');
      return;
    }

    setInductionPrograms(prev => prev.map(program => 
      program.id === venueForm.programId
        ? {
            ...program,
            location: venueForm.venueName,
            venueDetails: venueForm
          }
        : program
    ));

    setShowVenueBookingModal(false);
    setVenueForm({
      programId: null,
      venueName: '',
      address: '',
      capacity: '',
      bookingDate: '',
      startTime: '',
      endTime: '',
      amenities: []
    });
    alert('Venue booked successfully!');
  };

const handleSubmitFeedback = (programId) => {
  const feedback = feedbackData[programId];
  if (!feedback || !feedback.rating || feedback.rating === 0) {
    alert('Please provide a rating');
    return;
  }

  const newFeedback = {
    id: Date.now(),
    ...feedback,
    submittedDate: new Date().toISOString().split('T')[0],
    programName: inductionPrograms.find(p => p.id === programId)?.name
  };

  setInductionPrograms(prev => prev.map(program => 
    program.id === programId
      ? {
          ...program,
          feedback: [...(program.feedback || []), newFeedback],
          overallRating: calculateAverageRating(program.id, feedback.rating)
        }
      : program
  ));

  setShowFeedbackModal(false);
  setFeedbackData(prev => ({ ...prev, [programId]: null }));
  alert('Feedback submitted successfully!');
};

const calculateAverageRating = (programId, newRating) => {
  const program = inductionPrograms.find(p => p.id === programId);
  if (!program || !program.feedback || program.feedback.length === 0) {
    return newRating;
  }
  
  const totalRatings = program.feedback.reduce((sum, f) => sum + (f.rating || 0), 0) + newRating;
  const averageRating = totalRatings / (program.feedback.length + 1);
  return parseFloat(averageRating.toFixed(1));
};

  const handleGenerateCertificate = (programId, participantId) => {
    const certificate = {
      id: Date.now(),
      programId,
      participantId,
      issuedDate: new Date().toISOString().split('T')[0],
      certificateNumber: `CERT-${Date.now()}`
    };

    setInductionPrograms(prev => prev.map(program => 
      program.id === programId
        ? {
            ...program,
            certificates: [...(program.certificates || []), certificate]
          }
        : program
    ));

    alert('Certificate generated successfully!');
  };

const handleCompletePolicyModule = (policyId, moduleId) => {
  setPolicies(prev => prev.map(policy => {
    if (policy.id === policyId) {
      const updatedModules = policy.modules.map(module => 
        module.id === moduleId ? { ...module, read: true } : module
      );
      
      // Fast check for all modules read
      const allRead = updatedModules.every(m => m.read);
      
      return {
        ...policy,
        modules: updatedModules,
        // Add completion tracking if all modules are read
        ...(allRead && {
          completionTracking: {
            ...policy.completionTracking,
            completed: policy.completionTracking.completed + 1,
            pending: Math.max(0, policy.completionTracking.pending - 1)
          }
        })
      };
    }
    return policy;
  }));
};


// Add this handler function to your existing handlers section
const handleUpdateProgramStatus = (programId) => {
  setInductionPrograms(prev => prev.map(program => {
    if (program.id === programId) {
      // Status cycle: Upcoming -> Ongoing -> Completed
      let newStatus;
      switch(program.status) {
        case 'upcoming':
          newStatus = 'ongoing';
          break;
        case 'ongoing':
          newStatus = 'completed';
          break;
        case 'completed':
          newStatus = 'upcoming'; // Optional: cycle back to start
          break;
        default:
          newStatus = 'upcoming';
      }
      
      // If moving to completed, you might want to set end date to today
      const updatedProgram = {
        ...program,
        status: newStatus
      };
      
      if (newStatus === 'completed') {
        updatedProgram.endDate = new Date().toISOString().split('T')[0];
        // Update completed sessions to match total sessions
        updatedProgram.completedSessions = updatedProgram.totalSessions;
      }
      
      // If moving to ongoing, set start date to today if it's in the future
      if (newStatus === 'ongoing' && new Date(program.startDate) > new Date()) {
        updatedProgram.startDate = new Date().toISOString().split('T')[0];
      }
      
      return updatedProgram;
    }
    return program;
  }));
  
  // Optional: Show notification
  const program = inductionPrograms.find(p => p.id === programId);
  if (program) {
    let nextStatus;
    switch(program.status) {
      case 'upcoming': nextStatus = 'Ongoing'; break;
      case 'ongoing': nextStatus = 'Completed'; break;
      case 'completed': nextStatus = 'Upcoming'; break;
      default: nextStatus = 'upcoming';
    }
    alert(`Program "${program.name}" status updated to ${nextStatus}`);
  }
};
  const handleSubmitQuiz = (policyId) => {
    const policy = policies.find(p => p.id === policyId);
    if (!policy || !policy.quiz) return;

    let correctAnswers = 0;
    policy.quiz.forEach((question, index) => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / policy.quiz.length) * 100;
    const passed = score >= policy.passingScore;

    if (passed) {
      handleCompletePolicy(policyId);
      alert(`Quiz passed! Score: ${score.toFixed(1)}%`);
    } else {
      alert(`Quiz failed. Score: ${score.toFixed(1)}%. Passing score: ${policy.passingScore}%`);
    }

    setShowPolicyQuizModal(false);
    setQuizAnswers({});
  };


const getProgramName = (programId) => {
  const program = inductionPrograms.find(p => p.id === programId);
  return program ? program.name : `Program ${programId}`;
};

const handleSelectEmployee = (employeeId) => {
  setSelectedEmployees(prev => {
    if (prev.includes(employeeId)) {
      return prev.filter(id => id !== employeeId);
    } else {
      return [...prev, employeeId];
    }
  });
};

const handleSelectAllEmployees = () => {
  if (selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0) {
    setSelectedEmployees([]);
  } else {
    setSelectedEmployees(filteredEmployees.map(emp => emp.id));
  }
};


// Add this modal component to your file (after the other modals)
const PolicyUploadModal = () => {
  const [policyForm, setPolicyForm] = useState({
    name: '',
    category: 'general',
    description: '',
    version: '1.0',
    effectiveDate: '',
    readTime: '',
    status: 'published',
    required: true,
    addQuiz: false,
    addModules: false,
    passingScore: 70
  });

  const [quizQuestions, setQuizQuestions] = useState([
    { id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const [readingModules, setReadingModules] = useState([
    { id: 1, title: '', content: '' }
  ]);

  const handleAddQuizQuestion = () => {
    setQuizQuestions([...quizQuestions, {
      id: quizQuestions.length + 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]);
  };

  const handleRemoveQuizQuestion = (id) => {
    if (quizQuestions.length > 1) {
      setQuizQuestions(quizQuestions.filter(q => q.id !== id));
    }
  };

  const handleQuizQuestionChange = (id, field, value) => {
    setQuizQuestions(quizQuestions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleQuizOptionChange = (questionId, optionIndex, value) => {
    setQuizQuestions(quizQuestions.map(q => 
      q.id === questionId 
        ? {
            ...q,
            options: q.options.map((opt, idx) => 
              idx === optionIndex ? value : opt
            )
          }
        : q
    ));
  };

  const handleAddModule = () => {
    setReadingModules([...readingModules, {
      id: readingModules.length + 1,
      title: '',
      content: ''
    }]);
  };

  const handleRemoveModule = (id) => {
    if (readingModules.length > 1) {
      setReadingModules(readingModules.filter(m => m.id !== id));
    }
  };

  const handleModuleChange = (id, field, value) => {
    setReadingModules(readingModules.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleUploadPolicy = () => {
    if (!policyForm.name || !policyForm.effectiveDate || !policyForm.version) {
      alert('Please fill all required fields');
      return;
    }

    // Validate quiz questions if quiz is added
    if (policyForm.addQuiz) {
      const invalidQuestions = quizQuestions.filter(q => 
        !q.question.trim() || q.options.some(opt => !opt.trim())
      );
      if (invalidQuestions.length > 0) {
        alert('Please fill all quiz questions and options');
        return;
      }
    }

    // Validate reading modules if modules are added
    if (policyForm.addModules) {
      const invalidModules = readingModules.filter(m => 
        !m.title.trim() || !m.content.trim()
      );
      if (invalidModules.length > 0) {
        alert('Please fill all module titles and content');
        return;
      }
    }

    const newPolicy = {
      id: policies.length + 1,
      ...policyForm,
      acknowledgments: 0,
      lastAcknowledged: '',
      modules: policyForm.addModules ? readingModules.map(m => ({ ...m, read: false })) : [],
      quiz: policyForm.addQuiz ? quizQuestions : [],
      passingScore: policyForm.passingScore,
      documents: [],
      completionTracking: {
        totalEmployees: 150,
        completed: 0,
        pending: 150,
        averageScore: 0
      }
    };

    setPolicies([...policies, newPolicy]);
    setShowPolicyUploadModal(false);
    
    // Reset form
    setPolicyForm({
      name: '',
      category: 'general',
      description: '',
      version: '1.0',
      effectiveDate: '',
      readTime: '',
      status: 'published',
      required: true,
      addQuiz: false,
      addModules: false,
      passingScore: 70
    });
    setQuizQuestions([{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    setReadingModules([{ id: 1, title: '', content: '' }]);
    
    alert('Policy uploaded successfully!');
  };

  return (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

      {/* Header */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">Upload New Policy</h5>
            <button className="btn-close" onClick={() => setShowPolicyUploadModal(false)}></button>
          </div>
          
    {/* BODY */}
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">
            <div className="mb-3">
              <label className="form-label fw-bold">Policy Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                value={policyForm.name}
                onChange={(e) => setPolicyForm({...policyForm, name: e.target.value})}
                placeholder="e.g., Social Media Policy"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Category <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  value={policyForm.category}
                  onChange={(e) => setPolicyForm({...policyForm, category: e.target.value})}
                >
                  <option value="general">General</option>
                  <option value="compliance">Compliance</option>
                  <option value="security">Security</option>
                  <option value="hr">HR</option>
                  <option value="it">IT</option>
                </select>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Version <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={policyForm.version}
                  onChange={(e) => setPolicyForm({...policyForm, version: e.target.value})}
                  placeholder="e.g., 1.0"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={policyForm.description}
                onChange={(e) => setPolicyForm({...policyForm, description: e.target.value})}
                placeholder="Brief description of the policy"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Effective Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  value={policyForm.effectiveDate}
                  onChange={(e) => setPolicyForm({...policyForm, effectiveDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Estimated Read Time</label>
                <input
                  type="text"
                  className="form-control"
                  value={policyForm.readTime}
                  onChange={(e) => setPolicyForm({...policyForm, readTime: e.target.value})}
                  placeholder="e.g., 15 minutes"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Status</label>
                <select
                  className="form-select"
                  value={policyForm.status}
                  onChange={(e) => setPolicyForm({...policyForm, status: e.target.value})}
                >
                  <option value="published">Published</option>
                  <option value="mandatory">Mandatory</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Passing Score (%)</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="100"
                  value={policyForm.passingScore}
                  onChange={(e) => setPolicyForm({...policyForm, passingScore: parseInt(e.target.value) || 70})}
                />
                <small className="text-muted">Minimum score required to pass the quiz</small>
              </div>
            </div>

            {/* Required Checkbox */}
            <div className="mb-3">
              <label
                htmlFor="required"
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: policyForm.required ? "#3B82F6" : "#4B5563",
                  transition: "color 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    border: `2px solid ${
                      policyForm.required ? "#3B82F6" : "#9CA3AF"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    background: policyForm.required ? "#3B82F6" : "transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  {policyForm.required && (
                    <span style={{ color: "white", fontSize: "12px" }}>✓</span>
                  )}
                </div>

                <input
                  type="checkbox"
                  name="required"
                  id="required"
                  checked={policyForm.required}
                  onChange={(e) => setPolicyForm({...policyForm, required: e.target.checked})}
                  style={{ display: "none" }}
                />

                <span className="fw-semibold">Required for all employees</span>
              </label>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="form-label fw-bold">Upload Policy Document</label>
              <input
                type="file"
                className="form-control"
                accept=".pdf,.doc,.docx"
              />
              <small className="text-muted">Supported formats: PDF, DOC, DOCX (Max 10MB)</small>
            </div>

            {/* Add Quiz Checkbox */}
            <div className="mb-3">
              <label
                htmlFor="addQuiz"
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: policyForm.addQuiz ? "#3B82F6" : "#4B5563",
                  transition: "color 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    border: `2px solid ${
                      policyForm.addQuiz ? "#3B82F6" : "#9CA3AF"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    background: policyForm.addQuiz ? "#3B82F6" : "transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  {policyForm.addQuiz && (
                    <span style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>✓</span>
                  )}
                </div>

                <input
                  type="checkbox"
                  name="addQuiz"
                  id="addQuiz"
                  checked={policyForm.addQuiz}
                  onChange={(e) => setPolicyForm({ ...policyForm, addQuiz: e.target.checked })}
                  style={{ display: "none" }}
                />

                <span className="fw-semibold">Add quiz for this policy</span>
              </label>
            </div>

            {/* Quiz Questions Section (Shows when addQuiz is checked) */}
            {policyForm.addQuiz && (
              <div className="mb-4 p-3 border rounded bg-light">
                <h6 className="fw-bold mb-3">Quiz Questions</h6>
                {quizQuestions.map((question, index) => (
                  <div key={question.id} className="mb-4 p-3 border rounded bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Question {index + 1}</h6>
                      {quizQuestions.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveQuizQuestion(question.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Question</label>
                      <input
                        type="text"
                        className="form-control"
                        value={question.question}
                        onChange={(e) => handleQuizQuestionChange(question.id, 'question', e.target.value)}
                        placeholder="Enter the question"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Options</label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="input-group mb-2">
                          <span className="input-group-text">{String.fromCharCode(65 + optIndex)}</span>
                          <input
                            type="text"
                            className="form-control"
                            value={option}
                            onChange={(e) => handleQuizOptionChange(question.id, optIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                          />
                          <button
                            type="button"
                            className={`btn ${question.correctAnswer === optIndex ? 'btn-success' : 'btn-outline-secondary'}`}
                            onClick={() => handleQuizQuestionChange(question.id, 'correctAnswer', optIndex)}
                          >
                            {question.correctAnswer === optIndex ? 'Correct' : 'Mark Correct'}
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-muted small">
                      Selected correct answer: {String.fromCharCode(65 + question.correctAnswer)}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="job-listings-btn"
                  onClick={handleAddQuizQuestion}
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Another Question
                </button>
              </div>
            )}

            {/* Add Reading Modules Checkbox */}
            <div className="mb-3">
              <label
                htmlFor="addModules"
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: policyForm.addModules ? "#3B82F6" : "#4B5563",
                  transition: "color 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    border: `2px solid ${
                      policyForm.addModules ? "#3B82F6" : "#9CA3AF"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    background: policyForm.addModules ? "#3B82F6" : "transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  {policyForm.addModules && (
                    <span style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>✓</span>
                  )}
                </div>

                <input
                  type="checkbox"
                  name="addModules"
                  id="addModules"
                  checked={policyForm.addModules}
                  onChange={(e) => setPolicyForm({ ...policyForm, addModules: e.target.checked })}
                  style={{ display: "none" }}
                />

                <span className="fw-semibold">Add reading modules</span>
              </label>
            </div>

            {/* Reading Modules Section (Shows when addModules is checked) */}
            {policyForm.addModules && (
              <div className="mb-4 p-3 border rounded bg-light">
                <h6 className="fw-bold mb-3">Reading Modules</h6>
                {readingModules.map((module, index) => (
                  <div key={module.id} className="mb-4 p-3 border rounded bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">Module {index + 1}</h6>
                      {readingModules.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveModule(module.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Module Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={module.title}
                        onChange={(e) => handleModuleChange(module.id, 'title', e.target.value)}
                        placeholder="Enter module title"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Content</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={module.content}
                        onChange={(e) => handleModuleChange(module.id, 'content', e.target.value)}
                        placeholder="Enter module content"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="job-listings-btn"
                  onClick={handleAddModule}
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Another Module
                </button>
              </div>
            )}
          </div>
          
          <div className="modal-footer border-0 bg-light">
            <button className="cancel-btn" onClick={() => setShowPolicyUploadModal(false)}>
              Cancel
            </button>
            <button 
              className="create-job-btn" 
              onClick={handleUploadPolicy}
              disabled={!policyForm.name || !policyForm.effectiveDate || !policyForm.version}
            >
              Upload Policy
            </button>
          </div>
        </div>
      </div>

  );
};
  // 2. Trainer Assignment Modal
  const TrainerAssignmentModal = () => {
    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Assign Trainer</h5>
              <button className="btn-close" onClick={() => setShowTrainerAssignmentModal(false)}></button>
            </div>
            
            <div className="modal-body pt-0">
              <div className="mb-3">
                <label className="form-label fw-bold">Select Program</label>
                <select 
                  className="form-select"
                  value={trainerAssignmentData.programId || ''}
                  onChange={(e) => setTrainerAssignmentData({
                    ...trainerAssignmentData, 
                    programId: parseInt(e.target.value)
                  })}
                >
                  <option value="">Choose program...</option>
                  {inductionPrograms.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Trainer Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={trainerAssignmentData.trainerName}
                  onChange={(e) => setTrainerAssignmentData({...trainerAssignmentData, trainerName: e.target.value})}
                  placeholder="Enter trainer name"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Trainer Role</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., HR Manager"
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Trainer Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="trainer@company.com"
                />
              </div>
            </div>
            
            <div className="modal-footer border-0">
              <button className="btn btn-outline-secondary" onClick={() => setShowTrainerAssignmentModal(false)}>
                Cancel
              </button>
              <button 
                className="create-job-btn" 
                onClick={handleAssignTrainer}
                disabled={!trainerAssignmentData.programId || !trainerAssignmentData.trainerName}
              >
                Assign Trainer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
    // Program Details Modal (Replaces View Details functionality)
  const ProgramDetailsModal = () => {
  if (!selectedProgram || !showProgramDetailsModal) return null;

  // Calculate attendance statistics
  const getAttendanceStats = () => {
    if (selectedProgram.attendance && selectedProgram.attendance.length > 0) {
      const latestAttendance = selectedProgram.attendance[selectedProgram.attendance.length - 1];
      return {
        date: latestAttendance.date,
        present: selectedProgram.attendanceStats?.present || 0,
        absent: selectedProgram.attendanceStats?.absent || 0,
        late: selectedProgram.attendanceStats?.late || 0,
        rate: selectedProgram.attendanceRate || 0
      };
    }
    return null;
  };

  const attendanceStats = getAttendanceStats();

    return (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">{selectedProgram.name}</h5>
              <button className="btn-close" onClick={() => setSelectedProgram(null)}></button>
            </div>
            
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">
              <div className="row mb-12">
                <div className="col-md-6">
                  <div className="card border h-100">
                    <div className="card-body">
                      <h6 className="fw-bold mb-3 text-muted">Program Details</h6>
                      <div className="mb-2">
                        <small className="text-muted">Description</small>
                        <div>{selectedProgram.description}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Type</small>
                        <div><span className={`badge ${
                          selectedProgram.type === 'batch' ? 'bg-primary' : 
                          selectedProgram.type === 'individual' ? 'bg-info' : 'bg-success'
                        }`}>{selectedProgram.type}</span></div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Status</small>
                        <div>{getStatusBadge(selectedProgram.status)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border h-100">
                    <div className="card-body">
                      <h6 className="fw-bold mb-3 text-muted">Schedule</h6>
                      <div className="mb-2">
                        <small className="text-muted">Duration</small>
                        <div>{selectedProgram.duration}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Start Date</small>
                        <div>{selectedProgram.startDate}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">End Date</small>
                        <div>{selectedProgram.endDate}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Location</small>
                        <div>{selectedProgram.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card border h-100">
                    <div className="card-body">
                      <h6 className="fw-bold mb-3 text-muted">Participants</h6>
                      <div className="mb-2">
                        <small className="text-muted">Total Participants</small>
                        <div>{selectedProgram.totalParticipants}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Confirmed</small>
                        <div>{selectedProgram.confirmedParticipants}</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Attendance Rate</small>
                        <div>{selectedProgram.attendanceRate}%</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border h-100">
                    <div className="card-body">
                      <h6 className="fw-bold mb-3 text-muted">Progress</h6>
                      <div className="mb-2">
                        <small className="text-muted">Sessions</small>
                        <div>{selectedProgram.completedSessions}/{selectedProgram.totalSessions} completed</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Rating</small>
                        <div className="d-flex align-items-center">
                          <span className="fw-bold me-2">{selectedProgram.overallRating}/5</span>
                          <div className="text-warning">
                            {'★'.repeat(Math.floor(selectedProgram.overallRating))}
                            {'☆'.repeat(5 - Math.floor(selectedProgram.overallRating))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedProgram.schedule && selectedProgram.schedule.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-muted">Upcoming Sessions</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th className="text-muted">Session</th>
                          <th className="text-muted">Date</th>
                          <th className="text-muted">Time</th>
                          <th className="text-muted">Trainer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProgram.schedule.slice(0, 3).map(session => (
                          <tr key={session.id}>
                            <td>{session.title}</td>
                            <td>{session.date}</td>
                            <td>{session.startTime} - {session.endTime}</td>
                            <td>{session.trainer || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            
              <div className="modal-footer border-0 bg-light">
              <button className="close-btn" onClick={() => setSelectedProgram(null)}>
                Close
              </button>
              <button 
                className="create-job-btn"
                onClick={() => {
                  setSelectedProgram(null);
                  setSessionAgendaForm({...sessionAgendaForm, programId: selectedProgram.id});
                  setShowSessionAgendaModal(true);
                }}
              >
                Add Session
              </button>
            </div>
          </div>
        </div>

    );
  };
  // 3. Bulk Attendance Modal
const BulkAttendanceModal = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize attendance records when modal opens
  useEffect(() => {
    if (selectedEmployees.length > 0) {
      const initialRecords = selectedEmployees.map(empId => {
        const employee = employees.find(e => e.id === empId);
        return {
          employeeId: empId,
          name: employee?.name || 'Unknown',
          employeeCode: employee?.employeeId || '',
          department: employee?.department || '',
          status: employee?.attendanceStatus || 'present',
          remarks: '',
          checkInTime: '09:00',
          checkOutTime: '17:00'
        };
      });
      setAttendanceRecords(initialRecords);
      
      // Set default date to today
      if (!attendanceDate) {
        setAttendanceDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [selectedEmployees]);

  // Handle attendance status change for a specific employee
  const handleAttendanceChange = (empId, field, value) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.employeeId === empId 
          ? { 
              ...record, 
              [field]: value,
              // Auto-update times based on status
              ...(field === 'status' ? { 
                checkInTime: value === 'present' ? '09:00' : '',
                checkOutTime: value === 'present' ? '17:00' : ''
              } : {})
            }
          : record
      )
    );
  };

  // Handle bulk status change for all selected employees
  const handleBulkStatusChange = (status) => {
    setAttendanceRecords(prev => 
      prev.map(record => ({
        ...record,
        status: status,
        checkInTime: status === 'present' || status === 'late' ? '09:00' : '',
        checkOutTime: status === 'present' || status === 'late' ? '17:00' : ''
      }))
    );
  };

  // Handle Save Attendance
  const handleSaveAttendance = () => {
    if (attendanceRecords.length === 0) {
      alert('Please select at least one employee');
      return;
    }

    if (!attendanceDate) {
      alert('Please select attendance date');
      return;
    }

    if (!selectedProgramForAttendance) {
      alert('Please select a program');
      return;
    }

    setIsSaving(true);

    // Create new attendance records
    const newAttendanceData = attendanceRecords.map(record => {
      const employee = employees.find(e => e.id === record.employeeId);
      return {
        id: Date.now() + record.employeeId,
        employeeId: employee.employeeId,
        employeeName: employee.name,
        department: employee.department,
        programId: selectedProgramForAttendance.id,
        programName: selectedProgramForAttendance.name,
        sessionDate: attendanceDate,
        status: record.status,
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        remarks: record.remarks,
        recordedBy: userInfo?.name || 'System Admin',
        recordedAt: new Date().toISOString()
      };
    });

    // IMPORTANT: Update employee's program assignment in main employees array
    setEmployees(prev => 
      prev.map(employee => {
        const attendanceRecord = attendanceRecords.find(r => r.employeeId === employee.id);
        if (attendanceRecord) {
          return {
            ...employee,
            // Update program assignment to the selected program
            programAssigned: selectedProgramForAttendance.id,
            // Update attendance status
            attendanceStatus: attendanceRecord.status,
            lastAttendanceDate: attendanceDate,
            // Update program name for quick reference
            assignedProgramName: selectedProgramForAttendance.name
          };
        }
        return employee;
      })
    );

    // Update program statistics - only update participants for employees newly assigned
    setInductionPrograms(prev => prev.map(program => {
      if (program.id === selectedProgramForAttendance.id) {
        // Count how many employees were newly assigned to this program
        const newlyAssignedCount = attendanceRecords.filter(record => {
          const employee = employees.find(e => e.id === record.employeeId);
          return employee && employee.programAssigned !== selectedProgramForAttendance.id;
        }).length;

        const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
        const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
        const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
        const total = attendanceRecords.length;
        
        const newAttendanceRate = total > 0 ? ((presentCount + lateCount) / total) * 100 : 0;
        const newConfirmedParticipants = (program.confirmedParticipants || 0) + presentCount + lateCount;
        const newTotalParticipants = (program.totalParticipants || 0) + newlyAssignedCount;

        return {
          ...program,
          totalParticipants: newTotalParticipants,
          confirmedParticipants: newConfirmedParticipants,
          attendanceRate: Math.round(newAttendanceRate * 10) / 10,
          attendanceStats: {
            present: (program.attendanceStats?.present || 0) + presentCount,
            absent: (program.attendanceStats?.absent || 0) + absentCount,
            late: (program.attendanceStats?.late || 0) + lateCount,
            total: (program.attendanceStats?.total || 0) + total
          },
          // Add employees to program's participant list
          participants: [
            ...(program.participants || []),
            ...attendanceRecords.map(record => {
              const employee = employees.find(e => e.id === record.employeeId);
              return {
                employeeId: employee.employeeId,
                employeeName: employee.name,
                department: employee.department,
                assignedDate: new Date().toISOString().split('T')[0],
                attendanceStatus: record.status
              };
            }).filter(emp => 
              !program.participants?.some(p => p.employeeId === emp.employeeId)
            )
          ]
        };
      }
      return program;
    }));

    // Add to global attendance records
    setAttendanceRecords(prev => [...prev, ...newAttendanceData]);

    // Show success message
    setTimeout(() => {
      setIsSaving(false);
      const assignedProgramName = selectedProgramForAttendance.name;
      const assignedCount = attendanceRecords.length;
      // Reset and close modal
      setSelectedEmployees([]);
      setAttendanceRecords([]);
      setAttendanceDate('');
      setSelectedProgramForAttendance(null);
      setShowBulkAttendanceModal(false);
    }, 1000);
  };

  // Add a function to get participant details for a program
const getProgramParticipants = (programId) => {
  const program = inductionPrograms.find(p => p.id === programId);
  if (!program) return [];
  
  // Return participants from program data, or filter employees if not in program data
  if (program.participants && program.participants.length > 0) {
    return program.participants;
  }
  
  // Fallback: filter employees by program assignment
  return employees
    .filter(emp => emp.programAssigned === programId)
    .map(emp => ({
      id: emp.id,
      employeeId: emp.employeeId,
      employeeName: emp.name,
      department: emp.department,
      email: emp.email
    }));
};
  // Get program summary for selected program
  const getProgramSummary = () => {
    if (!selectedProgramForAttendance) return null;
    
    const programEmployees = employees.filter(emp => 
      emp.programAssigned === selectedProgramForAttendance.id
    );
    
    return {
      totalAssigned: programEmployees.length,
      present: programEmployees.filter(emp => emp.attendanceStatus === 'present').length,
      absent: programEmployees.filter(emp => emp.attendanceStatus === 'absent').length,
      notStarted: programEmployees.filter(emp => emp.attendanceStatus === 'not_started').length
    };
  };

  const programSummary = getProgramSummary();

  return (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">
        <i className="bi bi-people me-2"></i>
        Bulk Attendance Management
      </h5>
      <button
        className="btn-close"
        onClick={() => setShowBulkAttendanceModal(false)}
      ></button>
    </div>

    {/* BODY */}
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">

            {/* Summary Alert */}
            <div className="alert alert-info mb-4">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Note:</strong> Mark attendance for {selectedEmployees.length} selected employees.
                  {selectedProgramForAttendance && (
                    <div className="mt-1">
                      <small>
                        This will also assign selected employees to the chosen program.
                      </small>
                    </div>
                  )}
                </div>
                <div className="col-md-6 text-md-end">
                  <div className="badge bg-light text-dark">
                    <i className="bi bi-calendar me-1"></i>
                    {attendanceDate || 'Select date'}
                  </div>
                </div>
              </div>
            </div>

            {/* Program and Date Selection */}
            <div className="row mb-4">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">
                  <i className="bi bi-calendar-event me-1"></i>
                  Select Program <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={selectedProgramForAttendance?.id || ''}
                  onChange={(e) => {
                    const programId = parseInt(e.target.value);
                    const program = inductionPrograms.find(p => p.id === programId);
                    setSelectedProgramForAttendance(program);
                  }}
                  required
                >
                  <option value="">Choose program...</option>
                  {inductionPrograms.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">
                  <i className="bi bi-calendar-date me-1"></i>
                  Attendance Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>


            {/* Quick Actions */}
<div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
  <span className="fw-bold me-2">Mark All:</span>

  {/* Dropdown */}
  <div className="dropdown">
    <button
      className="btn btn-sm btn-outline-primary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      disabled={attendanceRecords.length === 0}
    >
      Select Status
    </button>

    <ul className="dropdown-menu shadow">
      <li>
        <button
          className="dropdown-item text-success"
          onClick={() => handleBulkStatusChange('present')}
        >
          <i className="bi bi-check-circle me-2"></i> Present
        </button>
      </li>

      <li>
        <button
          className="dropdown-item text-danger"
          onClick={() => handleBulkStatusChange('absent')}
        >
          <i className="bi bi-x-circle me-2"></i> Absent
        </button>
      </li>

      <li>
        <button
          className="dropdown-item text-warning"
          onClick={() => handleBulkStatusChange('late')}
        >
          <i className="bi bi-clock-history me-2"></i> Late
        </button>
      </li>

      <li>
        <button
          className="dropdown-item text-info"
          onClick={() => handleBulkStatusChange('half_day')}
        >
          <i className="bi bi-arrow-down-up me-2"></i> Half Day
        </button>
      </li>
    </ul>
  </div>

  {/* Selected Count */}
  <div className="ms-auto">
    <span className="badge bg-primary">
      <i className="bi bi-people me-1"></i>
      {attendanceRecords.length} employees selected
    </span>
  </div>
</div>

            
            {/* Attendance Table */}
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Current Program</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="text-muted">
                          <i className="bi bi-people fs-4"></i>
                          <p className="mb-1 fw-medium">No employees selected</p>
                          <small>Select employees from the Employees Table first</small>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    attendanceRecords.map((record) => {
                      const employee = employees.find(e => e.id === record.employeeId);
                      const currentProgram = employee?.programAssigned ? 
                        inductionPrograms.find(p => p.id === employee.programAssigned) : null;
                      
                      return (
                        <tr key={record.employeeId}>
                          <td>
                            <div className="fw-bold">{record.name}</div>
                            <small className="text-muted">ID: {record.employeeCode}</small>
                          </td>
                          <td>
                            {currentProgram ? (
                              <div>
                                <span className="badge bg-info">
                                  {currentProgram.name}
                                </span>
                                <div className="small text-muted mt-1">
                                  {selectedProgramForAttendance?.id === currentProgram.id ? 
                                    '✓ Will remain assigned' : 
                                    `→ Will change to: ${selectedProgramForAttendance?.name || 'New Program'}`
                                  }
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span className="badge bg-light text-dark">Not Assigned</span>
                                <div className="small text-success mt-1">
                                  ✓ Will be assigned to {selectedProgramForAttendance?.name || 'selected program'}
                                </div>
                              </div>
                            )}
                          </td>
                          <td>{record.department}</td>
                          <td>
                            <select
                              className={`form-select form-select-sm ${
                                record.status === 'present' ? 'border-success' :
                                record.status === 'absent' ? 'border-danger' :
                                record.status === 'late' ? 'border-warning' :
                                record.status === 'half_day' ? 'border-info' : ''
                              }`}
                              value={record.status}
                              onChange={(e) => handleAttendanceChange(record.employeeId, 'status', e.target.value)}
                            >
                              <option value="present">Present</option>
                              <option value="absent">Absent</option>
                              <option value="late">Late</option>
                              <option value="half_day">Half Day</option>
                              <option value="on_leave">On Leave</option>
                            </select>
                          </td>
                          <td className="d-none d-lg-table-cell">
                            <div className="row g-1">
                              <div className="col-6">
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={record.checkInTime}
                                  onChange={(e) => handleAttendanceChange(record.employeeId, 'checkInTime', e.target.value)}
                                  disabled={record.status === 'absent' || record.status === 'on_leave'}
                                />
                              </div>
                              <div className="col-6">
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={record.checkOutTime}
                                  onChange={(e) => handleAttendanceChange(record.employeeId, 'checkOutTime', e.target.value)}
                                  disabled={record.status === 'absent' || record.status === 'on_leave'}
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={record.remarks}
                              onChange={(e) => handleAttendanceChange(record.employeeId, 'remarks', e.target.value)}
                              placeholder="Add remarks..."
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {attendanceRecords.length > 0 && (
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan="6">
                        <div className="row text-center">
                          <div className="col-3">
                            <span className="badge bg-primary">
                              <i className="bi bi-people me-1"></i>
                              {attendanceRecords.length} Total
                            </span>
                          </div>
                          <div className="col-2">
                            <span className="badge bg-success">
                              {attendanceRecords.filter(r => r.status === 'present').length} Present
                            </span>
                          </div>
                          <div className="col-2">
                            <span className="badge bg-danger">
                              {attendanceRecords.filter(r => r.status === 'absent').length} Absent
                            </span>
                          </div>
                          <div className="col-2">
                            <span className="badge bg-warning">
                              {attendanceRecords.filter(r => r.status === 'late').length} Late
                            </span>
                          </div>
                          <div className="col-3">
                            <span className="badge bg-info">
                              {attendanceRecords.filter(r => r.status === 'half_day').length} Half Day
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

    </div>

    {/* FOOTER */}
          <div className="modal-footer border-0 bg-light">
            <button 
              className="cancel-btn" 
              onClick={() => {
                setShowBulkAttendanceModal(false);
                setSelectedEmployees([]);
                setAttendanceRecords([]);
              }}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              className="create-job-btn" 
              onClick={handleSaveAttendance}
              disabled={
                isSaving || 
                attendanceRecords.length === 0 || 
                !attendanceDate || 
                !selectedProgramForAttendance
              }
            >
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                <>
                  Save Attendance
                </>
              )}
            </button>
          </div>

  </div>
</div>

  );
};


  
// ==================== EMPLOYEES TABLE COMPONENT ====================

const EmployeesTable = () => {
  // State for add/edit employee modal
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    joiningDate: '',
    employeeId: '',
    programAssigned: null,
    attendanceStatus: 'not_started'
  });

  // Handle add new employee
const handleAddEmployee = () => {
  if (!employeeForm.name || !employeeForm.email || !employeeForm.employeeId) {
    alert('Please fill in all required fields');
    return;
  }

  const newEmployee = {
    id: employees.length + 1,
    ...employeeForm,
    status: 'Active',
    attendanceStatus: 'not_started'
  };

  setEmployees(prev => [...prev, newEmployee]);
  
  // If program is assigned, update the program participants
  if (employeeForm.programAssigned) {
    const programId = employeeForm.programAssigned;
    const program = inductionPrograms.find(p => p.id === programId);
    
    if (program) {
      setInductionPrograms(prev => prev.map(p => 
        p.id === programId
          ? {
              ...p,
              totalParticipants: (p.totalParticipants || 0) + 1,
              participants: [
                ...(p.participants || []),
                {
                  id: newEmployee.id,
                  employeeId: newEmployee.employeeId,
                  employeeName: newEmployee.name,
                  department: newEmployee.department,
                  email: newEmployee.email
                }
              ]
            }
          : p
      ));
    }
  }

  setShowAddEmployeeModal(false);
  setEmployeeForm({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    joiningDate: '',
    employeeId: '',
    programAssigned: null,
    attendanceStatus: 'not_started'
  });
  alert(`Employee ${employeeForm.name} added successfully!`);
};

  // Handle edit employee
const handleEditEmployee = () => {
  if (!editingEmployee || !editingEmployee.name || !editingEmployee.email) {
    alert('Please fill in all required fields');
    return;
  }

  const oldProgramId = employees.find(e => e.id === editingEmployee.id)?.programAssigned;
  const newProgramId = editingEmployee.programAssigned;

  // Update employee
  setEmployees(prev => prev.map(emp => 
    emp.id === editingEmployee.id ? editingEmployee : emp
  ));

  // Update program participants if program assignment changed
  if (oldProgramId !== newProgramId) {
    // Remove from old program
    if (oldProgramId) {
      setInductionPrograms(prev => prev.map(program => 
        program.id === oldProgramId
          ? {
              ...program,
              totalParticipants: Math.max(0, (program.totalParticipants || 0) - 1),
              participants: (program.participants || []).filter(p => p.id !== editingEmployee.id)
            }
          : program
      ));
    }

    // Add to new program
    if (newProgramId) {
      setInductionPrograms(prev => prev.map(program => 
        program.id === newProgramId
          ? {
              ...program,
              totalParticipants: (program.totalParticipants || 0) + 1,
              participants: [
                ...(program.participants || []),
                {
                  id: editingEmployee.id,
                  employeeId: editingEmployee.employeeId,
                  employeeName: editingEmployee.name,
                  department: editingEmployee.department,
                  email: editingEmployee.email
                }
              ]
            }
          : program
      ));
    }
  }

  setShowEditEmployeeModal(false);
  setEditingEmployee(null);
  alert('Employee updated successfully!');
};

  // Handle delete employee
const handleDeleteEmployee = (employeeId) => {
  if (window.confirm('Are you sure you want to delete this employee?')) {
    const employeeToDelete = employees.find(e => e.id === employeeId);
    
    // Remove from program participants if assigned
    if (employeeToDelete?.programAssigned) {
      setInductionPrograms(prev => prev.map(program => 
        program.id === employeeToDelete.programAssigned
          ? {
              ...program,
              totalParticipants: Math.max(0, (program.totalParticipants || 0) - 1),
              participants: (program.participants || []).filter(p => p.id !== employeeId)
            }
          : program
      ));
    }

    // Remove employee
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
    alert('Employee deleted successfully!');
  }
};


  return (
    <>
      <div className="card border mb-4">
        <div className="card-header bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div>
            <h6 className="mb-2 mb-md-0 fw-bold fs-4">Employees List</h6>
            <small className="text-muted d-none d-md-block">
              Manage employee induction program assignments
            </small>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-success"
              onClick={() => setShowAddEmployeeModal(true)}
            >
              <i className="bi bi-person-plus me-1"></i> 
              Add Employee
            </button>
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => {
                if (selectedEmployees.length === 0) {
                  alert('Please select employees first');
                  return;
                }
                setShowBulkAttendanceModal(true);
              }}
              disabled={selectedEmployees.length === 0}
            >
              <i className="bi bi-people me-1"></i> 
              Mark Attendance ({selectedEmployees.length})
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="card-body border-bottom">
          <div className="row g-2 align-items-end">
            {/* Search Field */}
            <div className="col-12 col-sm-12 col-md-4 col-lg-6">
              <label className="form-label small fw-bold mb-1">Search Employees</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, ID, department..."
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Department Filter */}
            <div className="col-12 col-sm-4 col-md-4 col-lg-2">
              <label className="form-label small fw-bold mb-1">Filter by Department</label>
              <select 
                className="form-select form-select-sm"
                value={employeeDepartmentFilter}
                onChange={(e) => setEmployeeDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
            </div>

          </div>
        </div>
        
        {/* Employees Table */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
      <thead className="table-light">
        <tr>
          <th className="text-center" style={{ minWidth: '80px' }}>
            <div className="d-flex flex-column align-items-center justify-content-center">
                <label 
                htmlFor="selectAllCheckbox" 
                className="form-check-label small text-muted mb-0"
                style={{ cursor: 'pointer' }}
              >
                Select All
              </label>
              <input
                type="checkbox"
                id="selectAllCheckbox"
                checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                onChange={handleSelectAllEmployees}
                className="form-check-input mb-1"
                style={{ cursor: "pointer" }}
              />
    
            </div>
          </th>
          <th className="text-muted" style={{ minWidth: '170px' }}>Employee</th>
          <th className="text-muted" style={{ minWidth: '160px' }}>Contact</th>
          <th className="text-muted" style={{ minWidth: '140px' }}>Department</th>
          <th className="text-muted" style={{ minWidth: '140px' }}>Joining Date</th>
          <th className="text-muted" style={{ minWidth: '150px' }}>Program Assigned</th>
          <th className="text-muted" style={{ minWidth: '120px' }}>Attendance</th>
          <th style={{ minWidth: '80px' }} >Actions</th>
        </tr>
      </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="text-muted">
                        <i className="bi bi-people fs-1"></i>
                        <p className="mb-1 fw-medium">No employees found</p>
                        <small>Try adjusting your search or filter criteria</small>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee, idx) => (
                    <tr key={employee.id} className={idx % 2 === 1 ? "table-light" : ""}>
                <td className="text-center align-middle">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <input
                    type="checkbox"
                    id={`employeeCheckbox-${employee.id}`}
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectEmployee(employee.id);
                    }}
                    className="form-check-input mb-1"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </td>
                      <td className="align-middle">
                        <div className="fw-semibold">{employee.name}</div>
                        <small className="text-muted">
                          ID: {employee.employeeId}
                        </small>
                      </td>
                      <td className="align-middle">
                        <div className="text-truncate" style={{ maxWidth: "150px" }}>
                          {employee.email}
                        </div>
                        <small className="text-muted">
                          {employee.phone || "N/A"}
                        </small>
                      </td>
                      <td className="align-middle">
                        <div>{employee.department}</div>
                        <small className="text-muted">
                          {employee.designation}
                        </small>
                      </td>
                      <td className="align-middle">
                        {new Date(employee.joiningDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="align-middle">
                        {employee.programAssigned ? (
                          <div>
                            <span className="badge bg-info">
                              {getProgramName(employee.programAssigned)}
                            </span>
                            <div className="small text-muted mt-1">
                              Program #{employee.programAssigned}
                            </div>
                          </div>
                        ) : (
                          <span className="badge bg-light text-dark">Not Assigned</span>
                        )}
                      </td>
                      <td className="align-middle">
                        {employee.attendanceStatus === 'present' ? (
                          <span className="badge bg-success">Present</span>
                        ) : employee.attendanceStatus === 'absent' ? (
                          <span className="badge bg-danger">Absent</span>
                        ) : employee.attendanceStatus === 'late' ? (
                          <span className="badge bg-warning">Late</span>
                        ) : employee.attendanceStatus === 'half_day' ? (
                          <span className="badge bg-info">Half Day</span>
                        ) : (
                          <span className="badge bg-secondary">Not Marked</span>
                        )}
                      </td>
                      <td className="align-middle">
                        <div className=" btn-group btn-group-sm gap-2">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setEditingEmployee(employee);
                              setShowEditEmployeeModal(true);
                            }}
                            title="Edit Employee"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            title="Delete Employee"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card-footer bg-light d-flex flex-column flex-md-row justify-content-between align-items-center">
          <small className="text-muted">
            Showing {filteredEmployees.length} of {employees.length} employees
            {selectedEmployees.length > 0 && ` (${selectedEmployees.length} selected)`}
          </small>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
 <div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">Add New Employee</h5>
                <button className="btn-close" onClick={() => setShowAddEmployeeModal(false)}></button>
              </div>
                  {/* BODY */}
               <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Employee Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={employeeForm.name}
                      onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                      required
                      placeholder="e.g., John Doe"
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Employee ID <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={employeeForm.employeeId}
                      onChange={(e) => setEmployeeForm({...employeeForm, employeeId: e.target.value})}
                      required
                      placeholder="e.g., EMP001"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Email <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                      required
                      placeholder="e.g., john.doe@company.com"
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={employeeForm.phone}
                      onChange={(e) => setEmployeeForm({...employeeForm, phone: e.target.value})}
                      placeholder="e.g., +91 9876543210"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Department <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={employeeForm.department}
                      onChange={(e) => setEmployeeForm({...employeeForm, department: e.target.value})}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={employeeForm.designation}
                      onChange={(e) => setEmployeeForm({...employeeForm, designation: e.target.value})}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Joining Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={employeeForm.joiningDate}
                      onChange={(e) => setEmployeeForm({...employeeForm, joiningDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Assign to Program</label>
                    <select
                      className="form-select"
                      value={employeeForm.programAssigned || ''}
                      onChange={(e) => setEmployeeForm({...employeeForm, programAssigned: e.target.value ? parseInt(e.target.value) : null})}
                    >
                      <option value="">Not Assigned</option>
                      {inductionPrograms.map(program => (
                        <option key={program.id} value={program.id}>
                          {program.name} ({program.status})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
                {/* FOOTER */}
          <div className="modal-footer border-0 bg-light">
                <button className="cancel-btn" onClick={() => setShowAddEmployeeModal(false)}>
                  Cancel
                </button>
                <button 
                  className="create-job-btn" 
                  onClick={handleAddEmployee}
                  disabled={!employeeForm.name || !employeeForm.email || !employeeForm.employeeId}
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>

      )}

      {/* Edit Employee Modal */}
      {showEditEmployeeModal && editingEmployee && (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">Edit Employee</h5>
                <button className="btn-close" onClick={() => setShowEditEmployeeModal(false)}></button>
              </div>
              
      {/* BODY */}
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Employee Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingEmployee.name}
                      onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Employee ID <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingEmployee.employeeId}
                      onChange={(e) => setEditingEmployee({...editingEmployee, employeeId: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Email <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      value={editingEmployee.email}
                      onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={editingEmployee.phone}
                      onChange={(e) => setEditingEmployee({...editingEmployee, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Department <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={editingEmployee.department}
                      onChange={(e) => setEditingEmployee({...editingEmployee, department: e.target.value})}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingEmployee.designation}
                      onChange={(e) => setEditingEmployee({...editingEmployee, designation: e.target.value})}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Joining Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editingEmployee.joiningDate}
                      onChange={(e) => setEditingEmployee({...editingEmployee, joiningDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Assign to Program</label>
                    <select
                      className="form-select"
                      value={editingEmployee.programAssigned || ''}
                      onChange={(e) => setEditingEmployee({...editingEmployee, programAssigned: e.target.value ? parseInt(e.target.value) : null})}
                    >
                      <option value="">Not Assigned</option>
                      {inductionPrograms.map(program => (
                        <option key={program.id} value={program.id}>
                          {program.name} ({program.status})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Attendance Status</label>
                    <select
                      className="form-select"
                      value={editingEmployee.attendanceStatus}
                      onChange={(e) => setEditingEmployee({...editingEmployee, attendanceStatus: e.target.value})}
                    >
                      <option value="not_started">Not Marked</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="half_day">Half Day</option>
                    </select>
                  </div>
                  
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-bold">Status</label>
                    <select
                      className="form-select"
                      value={editingEmployee.status || 'Active'}
                      onChange={(e) => setEditingEmployee({...editingEmployee, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>
              
         {/* FOOTER */}
          <div className="modal-footer border-0 bg-light">
                <button className="cancel-btn" onClick={() => setShowEditEmployeeModal(false)}>
                  Cancel
                </button>
                <button 
                  className="create-job-btn" 
                  onClick={handleEditEmployee}
                  disabled={!editingEmployee.name || !editingEmployee.email || !editingEmployee.employeeId}
                >
                  Update Employee
                </button>
              </div>

            </div>
          </div>

      )}
      
    </>
  );
};

  // 4. Policy Modal
  const PolicyModal = () => {
    const policy = selectedPolicy || policies[0];
    
    return (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">{policy?.name}</h5>
              <button className="btn-close" onClick={() => setShowPolicyModal(false)}></button>
            </div>
            
    {/* BODY */}
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">

              <div className="alert alert-light mb-4">
                <div className="row">
                  <div className="col-6 col-md-3">
                    <small className="text-muted">Version</small>
                    <div className="fw-bold">{policy?.version}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <small className="text-muted">Effective Date</small>
                    <div className="fw-bold">{policy?.effectiveDate}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <small className="text-muted">Read Time</small>
                    <div className="fw-bold">{policy?.readTime}</div>
                  </div>
                  <div className="col-6 col-md-3">
                    <small className="text-muted">Status</small>
                    <div>
                      {policy?.status === 'mandatory' ? (
                        <span className="badge bg-danger">Mandatory</span>
                      ) : (
                        <span className="badge bg-success">Published</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h6 className="fw-bold">Policy Content</h6>
                <p>{policy?.description}</p>
              </div>
              
              <div className="card border">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Completion Statistics</h6>
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="fw-bold">{policy?.completionTracking.completed}</div>
                      <div className="text-muted small">Completed</div>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold">{policy?.completionTracking.pending}</div>
                      <div className="text-muted small">Pending</div>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold">{policy?.completionTracking.averageScore.toFixed(1)}</div>
                      <div className="text-muted small">Avg Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    {/* FOOTER */}
          <div className="modal-footer border-0 bg-light">
              <button className="close-btn" onClick={() => setShowPolicyModal(false)}>
                Close
              </button>
              {policy?.modules && policy.modules.length > 0 && (
                <button 
                  className="read-modules-btn"
                  onClick={() => {
                    setSelectedPolicy(policy);
                    setCurrentPolicyModule(0);
                    setShowPolicyModuleModal(true);
                    setShowPolicyModal(false);
                  }}
                >
                  Read Modules
                </button>
              )}
              {policy?.quiz && policy.quiz.length > 0 && (
                <button 
                  className="take-quiz-btn"
                  onClick={() => {
                    setSelectedPolicy(policy);
                    setShowPolicyQuizModal(true);
                    setShowPolicyModal(false);
                  }}
                >
                  Take Quiz
                </button>
              )}
              <button 
                className="add-employee"
                onClick={() => handleCompletePolicy(policy?.id)}
              >
                Acknowledge Policy
              </button>
            </div>
          </div>
        </div>
    );
  };

  // 6. Material Distribution Modal
  const MaterialDistributionModal = () => {
    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Distribute Materials</h5>
              <button className="btn-close" onClick={() => setShowMaterialDistributionModal(false)}></button>
            </div>
            
            <div className="modal-body pt-0">
              <div className="mb-3">
                <label className="form-label fw-bold">Select Program *</label>
                <select 
                  className="form-select"
                  value={materialForm.programId || ''}
                  onChange={(e) => setMaterialForm({
                    ...materialForm, 
                    programId: parseInt(e.target.value)
                  })}
                >
                  <option value="">Choose program...</option>
                  {inductionPrograms.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-12 col-md-8 mb-3">
                  <label className="form-label fw-bold">Material Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={materialForm.materialName}
                    onChange={(e) => setMaterialForm({...materialForm, materialName: e.target.value})}
                    placeholder="e.g., Company Handbook"
                    required
                  />
                </div>
                
                <div className="col-12 col-md-4 mb-3">
                  <label className="form-label fw-bold">Material Type *</label>
                  <select
                    className="form-select"
                    value={materialForm.materialType}
                    onChange={(e) => setMaterialForm({...materialForm, materialType: e.target.value})}
                  >
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="presentation">Presentation</option>
                    <option value="archive">Archive</option>
                    <option value="link">Link</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})}
                  placeholder="Material description"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Upload File</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setMaterialForm({...materialForm, file: e.target.files[0]})}
                />
                <small className="text-muted">Supported formats: PDF, DOCX, PPTX, ZIP, MP4</small>
              </div>
            </div>
            
            <div className="modal-footer border-0">
              <button className="cancel-btn" onClick={() => setShowMaterialDistributionModal(false)}>
                Cancel
              </button>
              <button 
                className="create-job-btn" 
                onClick={handleDistributeMaterial}
                disabled={!materialForm.programId || !materialForm.materialName}
              >
                Distribute Material
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 7. Venue Booking Modal
  const VenueBookingModal = () => {
    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Book Venue</h5>
              <button className="btn-close" onClick={() => setShowVenueBookingModal(false)}></button>
            </div>
            
            <div className="modal-body pt-0">
              <div className="mb-3">
                <label className="form-label fw-bold">Select Program *</label>
                <select 
                  className="form-select"
                  value={venueForm.programId || ''}
                  onChange={(e) => setVenueForm({
                    ...venueForm, 
                    programId: parseInt(e.target.value)
                  })}
                >
                  <option value="">Choose program...</option>
                  {inductionPrograms.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw-bold">Venue Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={venueForm.venueName}
                    onChange={(e) => setVenueForm({...venueForm, venueName: e.target.value})}
                    placeholder="e.g., Main Auditorium"
                    required
                  />
                </div>
                
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw-bold">Capacity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={venueForm.capacity}
                    onChange={(e) => setVenueForm({...venueForm, capacity: e.target.value})}
                    placeholder="Number of seats"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Address</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={venueForm.address}
                  onChange={(e) => setVenueForm({...venueForm, address: e.target.value})}
                  placeholder="Venue address"
                />
              </div>

              <div className="row">
                <div className="col-12 col-md-4 mb-3">
                  <label className="form-label fw-bold">Booking Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={venueForm.bookingDate}
                    onChange={(e) => setVenueForm({...venueForm, bookingDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="col-12 col-md-4 mb-3">
                  <label className="form-label fw-bold">Start Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={venueForm.startTime}
                    onChange={(e) => setVenueForm({...venueForm, startTime: e.target.value})}
                  />
                </div>
                
                <div className="col-12 col-md-4 mb-3">
                  <label className="form-label fw-bold">End Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={venueForm.endTime}
                    onChange={(e) => setVenueForm({...venueForm, endTime: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer border-0">
              <button className="cancel-btn" onClick={() => setShowVenueBookingModal(false)}>
                Cancel
              </button>
              <button 
                className="create-job-btn" 
                onClick={handleBookVenue}
                disabled={!venueForm.programId || !venueForm.venueName || !venueForm.bookingDate}
              >
                Book Venue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 8. Feedback Modal
const FeedbackModal = () => {
  const [selectedFeedbackProgram, setSelectedFeedbackProgram] = useState(selectedProgram || null);
  const [localFeedback, setLocalFeedback] = useState({
    rating: 0,
    comments: '',
    likedMost: '',
    suggestions: '',
    additionalFeedback: '',
    submittedBy: userInfo?.name || 'System User',
    anonymous: false
  });

  // Update local feedback when program changes
  useEffect(() => {
    if (selectedFeedbackProgram) {
      const existingFeedback = feedbackData[selectedFeedbackProgram.id] || {
        rating: 0,
        comments: '',
        likedMost: '',
        suggestions: '',
        additionalFeedback: '',
        submittedBy: userInfo?.name || 'System User',
        anonymous: false
      };
      setLocalFeedback(existingFeedback);
    }
  }, [selectedFeedbackProgram, feedbackData]);

  const handleInputChange = (field, value) => {
    setLocalFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!selectedFeedbackProgram) {
      alert('Please select a program first');
      return;
    }

    if (!localFeedback.rating || localFeedback.rating === 0) {
      alert('Please provide a rating (1-5 stars)');
      return;
    }

    // Create complete feedback object
    const completeFeedback = {
      id: Date.now(),
      programId: selectedFeedbackProgram.id,
      programName: selectedFeedbackProgram.name,
      ...localFeedback,
      submittedDate: new Date().toISOString().split('T')[0],
      submittedTime: new Date().toLocaleTimeString(),
      status: 'submitted'
    };

    // Update feedback data state
    setFeedbackData(prev => ({
      ...prev,
      [selectedFeedbackProgram.id]: completeFeedback
    }));

    // Update programs with new feedback
    setInductionPrograms(prev => prev.map(program => {
      if (program.id === selectedFeedbackProgram.id) {
        const updatedFeedback = [...(program.feedback || []), completeFeedback];
        
        // Calculate new average rating
        const totalRating = updatedFeedback.reduce((sum, f) => sum + f.rating, 0);
        const averageRating = updatedFeedback.length > 0 
          ? parseFloat((totalRating / updatedFeedback.length).toFixed(1))
          : 0;

        return {
          ...program,
          feedback: updatedFeedback,
          overallRating: averageRating,
          lastFeedbackDate: new Date().toISOString().split('T')[0]
        };
      }
      return program;
    }));

    // Show success message
    alert(`Feedback submitted successfully for "${selectedFeedbackProgram.name}"!`);
    
    // Reset and close modal
    setShowFeedbackModal(false);
    setSelectedFeedbackProgram(null);
    setLocalFeedback({
      rating: 0,
      comments: '',
      likedMost: '',
      suggestions: '',
      additionalFeedback: '',
      submittedBy: userInfo?.name || 'System User',
      anonymous: false
    });
  };

  return (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
          <h5 className="hrms-modal-title d-flex align-items-center">
              <i className="bi bi-star me-2"></i>
              Program Feedback
            </h5>
            <button 
              type="button"
              className="btn-close btn-close" 
              onClick={() => setShowFeedbackModal(false)}
              aria-label="Close"
            ></button>
          </div>
          
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">
            {/* Program Selection */}
            <div className="mb-4">
              <label className="form-label fw-bold">
                Select Program <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={selectedFeedbackProgram?.id || ''}
                onChange={(e) => {
                  const programId = e.target.value ? parseInt(e.target.value) : null;
                  const program = inductionPrograms.find(p => p.id === programId);
                  setSelectedFeedbackProgram(program);
                }}
                required
              >
                <option value="">Choose a program...</option>
                {inductionPrograms.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.name} ({program.status})
                  </option>
                ))}
              </select>
            </div>


            {/* Feedback Form */}
              <div>
                {/* Rating Section */}
<div className="mb-3">
  <label className="form-label fw-bold d-flex align-items-center justify-content-center">
    Overall Rating <span className="text-danger ms-1">*</span>
  </label>
  
  {/* Star Rating - Compact */}
  <div className="d-flex justify-content-center align-items-center mb-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`btn ${localFeedback.rating >= star ? 'btn-warning' : 'btn-outline-warning'} border-0 mx-1`}
        onClick={() => handleInputChange('rating', star)}
        style={{ 
          width: '38px', 
          height: '38px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          transition: 'all 0.2s ease'
        }}
      >
        <i className="bi bi-star-fill fs-5"></i>
      </button>
    ))}
  </div>
  
  {/* Rating Description - Compact */}
  <div className="text-center">
    <span className={`fw-bold small ${
      localFeedback.rating >= 4 ? 'text-success' :
      localFeedback.rating >= 3 ? 'text-warning' : 'text-danger'
    }`}>
      {(() => {
        const ratings = {
          1: 'Poor',
          2: 'Fair',
          3: 'Good',
          4: 'Very Good',
          5: 'Excellent'
        };
        const descriptions = {
          1: 'Very dissatisfied',
          2: 'Needs improvement',
          3: 'Met expectations',
          4: 'Exceeded expectations',
          5: 'Outstanding experience'
        };
        return localFeedback.rating > 0 
          ? `${ratings[localFeedback.rating]} - ${descriptions[localFeedback.rating]}`
          : 'Select a rating';
      })()}
    </span>
  </div>
</div>


                {/* Comments Section */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Overall Comments</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={localFeedback.comments}
                    onChange={(e) => handleInputChange('comments', e.target.value)}
                    placeholder="Share your overall feedback about the program. What did you like? What could be better?"
                  />
                </div>

                {/* Liked Most Section */}

                  <div className=" mb-3">
                    <label className="form-label fw-bold">What did you like most?</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={localFeedback.likedMost}
                      onChange={(e) => handleInputChange('likedMost', e.target.value)}
                      placeholder="Specific sessions, trainers, materials, or activities..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Suggestions for improvement</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={localFeedback.suggestions}
                      onChange={(e) => handleInputChange('suggestions', e.target.value)}
                      placeholder="How can we make this program better?"
                    />
                  </div>


                {/* Additional Feedback */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Additional Feedback (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={localFeedback.additionalFeedback}
                    onChange={(e) => handleInputChange('additionalFeedback', e.target.value)}
                    placeholder="Any other comments, suggestions, or feedback..."
                  />
                </div>

                {/* Anonymous Submission */}
<div className="mb-3">
  <label
    htmlFor="anonymousFeedback"
    style={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: localFeedback.anonymous ? "#3B82F6" : "#4B5563",
      transition: "color 0.3s ease",
    }}
  >
    {/* Custom checkbox box */}
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${localFeedback.anonymous ? "#3B82F6" : "#9CA3AF"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "10px",
        background: localFeedback.anonymous ? "#3B82F6" : "transparent",
        transition: "all 0.3s ease",
      }}
    >
      {localFeedback.anonymous && (
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

    {/* Hidden input */}
    <input
      type="checkbox"
      id="anonymousFeedback"
      checked={localFeedback.anonymous}
      onChange={(e) => handleInputChange('anonymous', e.target.checked)}
      style={{ display: "none" }}
    />

    <span className="fw-medium">Submit feedback anonymously</span>
  </label>
</div>


              </div>
          </div>
          
          <div className="modal-footer border-0 bg-light">
            <button 
              type="button"
              className="cancel-btn" 
              onClick={() => {
                setShowFeedbackModal(false);
                setSelectedFeedbackProgram(null);
                setLocalFeedback({
                  rating: 0,
                  comments: '',
                  likedMost: '',
                  suggestions: '',
                  additionalFeedback: '',
                  submittedBy: userInfo?.name || 'System User',
                  anonymous: false
                });
              }}
            >
              Cancel
            </button>  
            <button 
              type="button"
              className="create-job-btn" 
              onClick={handleSubmit}
              disabled={!selectedFeedbackProgram || !localFeedback.rating || localFeedback.rating === 0}
            >
               Submit Feedback
            </button>
          </div>
        </div>
      </div>

  );
};

  // 9. Policy Module Reading Modal
const PolicyModuleModal = () => {
  const policy = selectedPolicy || policies[0];
  const currentModule = policy?.modules?.[currentPolicyModule];

  if (!policy || !currentModule) return null;

  // Calculate allModulesRead based on the latest policy data
  const allModulesRead = policy.modules?.every(m => m.read) || false;
  const isLastModule = currentPolicyModule === policy.modules.length - 1;
  const modulesReadCount = policy.modules?.filter(m => m.read).length || 0;
  const totalModules = policy.modules?.length || 0;

  // Handler for marking module as read WITHOUT auto-redirect
  const handleMarkAsRead = () => {
    // Immediately update the policy state
    const updatedModules = policy.modules.map(module => 
      module.id === currentModule.id ? { ...module, read: true } : module
    );
    
    // Update policies state
    setPolicies(prev => prev.map(p => 
      p.id === policy.id ? { ...p, modules: updatedModules } : p
    ));
    
    // Update selectedPolicy for immediate UI feedback
    setSelectedPolicy(prev => prev ? { ...prev, modules: updatedModules } : null);
  };

  // Handle Next Module with optional mark as read
  const handleNextModule = () => {
    if (!currentModule.read) {
      // Mark current module as read first
      handleMarkAsRead();
    }
    // Move to next module
    setCurrentPolicyModule(currentPolicyModule + 1);
  };

  // Handle Quiz Button Click
  const handleQuizClick = () => {
    setShowPolicyModuleModal(false);
    setShowPolicyQuizModal(true);
  };

  // Handle Complete Policy Click (no quiz)
  const handleCompleteClick = () => {
    setShowPolicyModuleModal(false);
    handleCompletePolicy(policy.id);
  };

  return (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">
              <i className="bi bi-book me-2"></i>
              {policy.name}
            </h5>
            <button className="btn-close" onClick={() => setShowPolicyModuleModal(false)}></button>
          </div>
          
    {/* BODY */}
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">

            {/* Progress bar */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Module {currentPolicyModule + 1} of {totalModules}</h6>
                <span className="badge bg-primary">
                  {Math.round(((currentPolicyModule + 1) / totalModules) * 100)}% Complete
                </span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated" 
                  style={{ width: `${((currentPolicyModule + 1) / totalModules) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Module Content */}
            <div className="card border mb-4">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">
                  <i className="bi bi-journal-text me-2"></i>
                  {currentModule.title}
                </h6>
                {currentModule.read && (
                  <span className="badge bg-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Read
                  </span>
                )}
              </div>
              <div className="card-body">
                <p className="mb-0">{currentModule.content}</p>
              </div>
            </div>

            {/* Mark as Read Checkbox */}
<div className="mb-4">

  {/* Custom Mark As Read Checkbox */}
  <label
    htmlFor={`module-${currentModule.id}`}
    style={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: currentModule.read ? "#3B82F6" : "#4B5563",
      transition: "color 0.3s ease",
    }}
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${
          currentModule.read ? "#3B82F6" : "#9CA3AF"
        }`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "10px",
        background: currentModule.read ? "#3B82F6" : "transparent",
        transition: "all 0.3s ease",
      }}
    >
      {currentModule.read && (
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
      id={`module-${currentModule.id}`}
      checked={currentModule.read}
      onChange={handleMarkAsRead}
      style={{ display: "none" }}
    />

    <span className="fw-medium">Mark this module as read</span>
  </label>

  {/* Success Message */}
  {currentModule.read && (
    <div className="alert alert-success mt-2 py-2" role="alert">
      <i className="bi bi-check-circle-fill me-2"></i>
      Module marked as read
    </div>
  )}

</div>


            {/* Module Completion Summary */}
            <div className="card border">
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="fw-bold fs-3">{modulesReadCount}/{totalModules}</div>
                    <small className="text-muted">Modules Read</small>
                  </div>
                  <div className="col-6">
                    <div className={`fw-bold fs-3 ${allModulesRead ? 'text-success' : 'text-warning'}`}>
                      {allModulesRead ? '✓' : `${Math.round((modulesReadCount / totalModules) * 100)}%`}
                    </div>
                    <small className="text-muted">Progress</small>
                  </div>
                </div>
                {allModulesRead && (
                  <div className="alert alert-success mt-3 mb-0 py-2 text-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <strong>All modules completed!</strong>
                    <div className="mt-1">
                      {policy.quiz ? 'You can now take the quiz' : 'You can now acknowledge the policy'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer with Clear Action Buttons */}

    {/* FOOTER */}
          <div className="modal-footer border-0 bg-light">
            {/* Previous/Close Button */}
            <button 
              className="close-btn" 
              onClick={() => {
                if (currentPolicyModule > 0) {
                  setCurrentPolicyModule(currentPolicyModule - 1);
                } else {
                  setShowPolicyModuleModal(false);
                }
              }}
            >
              <i className="bi bi-arrow-left me-1"></i>
              {currentPolicyModule > 0 ? 'Previous' : 'Close'}
            </button>

            {/* Dynamic Action Button */}
            {!isLastModule ? (
              // Next Module Button - for non-last modules
              <button 
                className="create-job-btn"
                onClick={handleNextModule}
                disabled={!currentModule.read}
              >
                <i className="bi bi-arrow-right me-1"></i>
                Next Module
              </button>
            ) : (
              // Last Module - Show appropriate action buttons
              <div className="d-flex gap-2">
                {/* First, mark as read button if not marked */}
                {!currentModule.read && (
                  <button 
                    className="create-job-btn"
                    onClick={handleMarkAsRead}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    Mark as Read
                  </button>
                )}

                {/* Quiz button appears ONLY when user clicks it */}
                {allModulesRead && policy.quiz && policy.quiz.length > 0 && (
                  <button 
                    className="btn btn-warning"
                    onClick={handleQuizClick}
                  >
                    <i className="bi bi-lightning me-1"></i>
                    Take Quiz
                  </button>
                )}

                {/* Complete button appears ONLY when user clicks it */}
                {allModulesRead && (!policy.quiz || policy.quiz.length === 0) && (
                  <button 
                    className="btn btn-success"
                    onClick={handleCompleteClick}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    Complete Policy
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

  );
};
  // 10. Policy Quiz Modal
  const PolicyQuizModal = () => {
    const policy = selectedPolicy || policies[0];

    if (!policy || !policy.quiz || policy.quiz.length === 0) return null;

    return (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">{policy.name} - Quiz</h5>
              <button className="btn-close" onClick={() => setShowPolicyQuizModal(false)}></button>
            </div>
            
                {/* BODY */}
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">

              <div className="alert alert-info mb-3">
                <strong>Instructions:</strong> Answer all questions. Passing score: {policy.passingScore}%
              </div>

{policy.quiz.map((question, index) => (
  <div key={question.id} className="card border mb-3">
    <div className="card-body">
      <h6 className="fw-bold mb-2 text-dark fs-5">
        Question {index + 1}: {question.question}
      </h6>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {question.options.map((option, optIndex) => (
          <label
            key={optIndex}
            className="text-muted"
            htmlFor={`option-${question.id}-${optIndex}`}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color:
                quizAnswers[question.id] === optIndex
                  ? "#2563eb"
                  : "#4B5563",
              transition: "color 0.3s ease",
            }}
          >
            {/* Custom radio circle */}
            <div
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                border: `2px solid ${
                  quizAnswers[question.id] === optIndex
                    ? "#2563eb"
                    : "#9CA3AF"
                }`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "8px",
                transition: "all 0.3s ease",
              }}
            >
              {quizAnswers[question.id] === optIndex && (
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#2563eb",
                  }}
                />
              )}
            </div>

            {/* Hidden input */}
            <input
              type="radio"
              name={`question-${question.id}`}
              id={`option-${question.id}-${optIndex}`}
              checked={quizAnswers[question.id] === optIndex}
              onChange={() =>
                setQuizAnswers({
                  ...quizAnswers,
                  [question.id]: optIndex,
                })
              }
              style={{ display: "none" }}
            />

            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
))}

              
            </div>
            
            
    {/* FOOTER */}
          <div className="modal-footer border-0 bg-light">
              <button className="cancel-btn" onClick={() => setShowPolicyQuizModal(false)}>
                Cancel
              </button>
              <button 
                className="create-job-btn" 
                onClick={() => handleSubmitQuiz(policy.id)}
                disabled={Object.keys(quizAnswers).length < policy.quiz.length}
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>

    );
  };


// Session Details Modal
const SessionDetailsModal = () => {
  if (!selectedSession) return null;

  return (
  <div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">Session Details</h5>
            <button className="btn-close" onClick={() => setSelectedSession(null)}></button>
          </div>
          
          {/* BODY */}
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">

            <div className="card border mb-3">
              <div className="card-body">
                <div className="mb-2">
                  <small className="text-muted">Program</small>
                  <div className="fw-bold">{selectedSession.programName || 'N/A'}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Date & Time</small>
                  <div>
                    {selectedSession.sessionDate} | {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}
                  </div>
                  <small className="text-muted">
                    Duration: {calculateDuration(selectedSession.startTime, selectedSession.endTime)}
                  </small>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Location</small>
                  <div>
                    {selectedSession.isVirtual ? (
                      <a href={selectedSession.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary">
                        <i className="bi bi-camera-video me-1"></i>
                        Virtual Meeting
                      </a>
                    ) : (
                      <span>
                        <i className="bi bi-geo-alt me-1"></i>
                        {selectedSession.venue}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedSession.agenda && (
              <div className="card border mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Agenda</h6>
                  <p className="mb-0">{selectedSession.agenda}</p>
                </div>
              </div>
            )}

            <div className="card border">
              <div className="card-body">
                <h6 className="fw-bold mb-3">Session Information</h6>
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">Created</small>
                    <div>{selectedSession.createdAt || 'N/A'}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Last Updated</small>
                    <div>{selectedSession.updatedAt || 'N/A'}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-muted">Status</small>
                  <div>
                    <span className={`badge ${
                      selectedSession.status === 'completed' ? 'bg-success' :
                      selectedSession.status === 'cancelled' ? 'bg-danger' :
                      selectedSession.status === 'rescheduled' ? 'bg-warning' : 'bg-primary'
                    }`}>
                      {selectedSession.status || 'scheduled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
    {/* FOOTER */}
          <div className="modal-footer border-0 bg-light">
            <button className="close-btn" onClick={() => setSelectedSession(null)}>
              Close
            </button>
          </div>
        </div>
      </div>

  );
};
  // ==================== HELPER FUNCTIONS ====================
  const filteredPrograms = inductionPrograms.filter(program => {
    if (activeTab === 'all') return true;
    return program.status === activeTab;
  }).filter(program => 
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'ongoing': return <span className="badge bg-success">Ongoing</span>;
      case 'upcoming': return <span className="badge bg-warning">Upcoming</span>;
      case 'completed': return <span className="badge bg-secondary">Completed</span>;
      case 'draft': return <span className="badge bg-light text-dark">Draft</span>;
      default: return <span className="badge bg-info">{status}</span>;
    }
  };

  // ==================== RENDER ====================
  return (
    <>
      <div className="container-fluid px-2 px-md-3 px-lg-4 py-3">
        {/* Header */}
<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
  {/* Left side - Title and description */}
  <div className="flex-shrink-1 mb-3 mb-md-0">
  <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
    <Icon icon="heroicons:academic-cap" />
    Induction & Orientation
  </h5>

    <p className="text-muted mb-0">Complete onboarding management with policy acknowledgment</p>
  </div>

  {/* Right side - Action buttons */}
  <div className="d-flex flex-wrap justify-content-end gap-2 ms-md-auto">
    <button 
      className="job-listings-btn"
      onClick={() => setShowBulkAttendanceModal(true)}
    >
      <i className="bi bi-people d-none d-md-inline"></i>
      <span>Bulk Attendance</span>
    </button>
    
    <button 
      className="upload-policy-btn"
      onClick={() => setShowPolicyUploadModal(true)}
    >
      <i className="bi bi-upload d-none d-md-inline"></i>
      <span>Upload Policy</span>
    </button>
    
    <button 
      className="create-job-btn"
      onClick={() => setShowCreateProgram(true)}
    >
      <i className="bi bi-plus-circle d-none d-md-inline"></i>
      <span>Create Program</span>
    </button>
  </div>

  
</div>

{/* Statistics Cards */}
<div className="kpi-row">
  {[
    {
      title: "Total Programs",
      value: inductionPrograms.length,
      icon: "heroicons:calendar-days",
      bg: "kpi-primary",
      color: "kpi-primary-text",
    },
    {
      title: "Total Participants",
      value: inductionPrograms.reduce(
        (sum, program) => sum + program.totalParticipants,
        0
      ),
      icon: "heroicons:users",
      bg: "kpi-success",
      color: "kpi-success-text",
    },
    {
      title: "Policy Completion",
      value: (() => {
        const requiredPolicies = policies.filter((p) => p.required);
        if (requiredPolicies.length === 0) return "0%";

        const totalCompletion = requiredPolicies.reduce((sum, policy) => {
          const rate =
            policy.completionTracking.completed /
            policy.completionTracking.totalEmployees;
          return sum + rate;
        }, 0);

        const averageCompletion =
          (totalCompletion / requiredPolicies.length) * 100;

        return `${Math.round(averageCompletion * 10) / 10}%`;
      })(),
      icon: "heroicons:document-check",
      bg: "kpi-warning",
      color: "kpi-warning-text",
    },
    {
      title: "Avg. Rating",
      value: (() => {
        if (inductionPrograms.length === 0) return "0.0/5";

        const totalRating = inductionPrograms.reduce(
          (sum, program) => sum + program.overallRating,
          0
        );

        const averageRating = totalRating / inductionPrograms.length;

        return `${Math.round(averageRating * 10) / 10}/5`;
      })(),
      icon: "heroicons:star",
      bg: "kpi-info",
      color: "kpi-info-text",
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



        {/* Induction Programs Table - Responsive */}
        <div className="card border mb-4">
          <div className="card-header bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <h6 className="mb-2 mb-md-0 fw-bold fs-4">Induction Programs</h6>
            <span className="badge bg-primary">{filteredPrograms.length} programs</span>
          </div>
          
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-muted ps-4">Program Name</th>
                    <th className="text-muted">Type</th>
                    <th className="text-muted">Status</th>

                    <th className="text-muted">Schedule</th>
                    <th className="text-muted">Participants</th>
                    <th className="text-muted">Rating</th>
                    <th className="text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrograms.map(program => (
                    <tr key={program.id}>
                      <td className="ps-4">
                        <div className="fw-bold ">{program.name}</div>
                        <small className="text-muted ">{program.description.substring(0, 50)}...</small>
                      </td>
                      <td className="align-middle">
                        <span className={`badge ${
                          program.type === 'batch' ? 'bg-primary' :
                          program.type === 'individual' ? 'bg-info' : 'bg-success'
                        }`}>
                          {program.type}
                        </span>
                      </td>
                     <td className="align-middle">{getStatusBadge(program.status)}</td>
                      <td> 
                        <div>{program.startDate} to {program.endDate}</div>
                        <small className="text-muted">{program.duration}</small>
                      </td>
<td className="align-middle">
  <div className="text-center">
    <div className="fw-bold">
      {program.confirmedParticipants || 0}/{program.totalParticipants || 0}
    </div>
    <small className="text-muted">
      {program.participants?.length || 0} enrolled
    </small>
  </div>
</td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <span className="fw-bold me-1">{program.overallRating}</span>
                          <div className="text-warning">
                            {'★'.repeat(Math.floor(program.overallRating))}
                          </div>
                        </div>
                      </td>
                      
<td className="align-middle">
   <div className=" btn-group btn-group-sm gap-2">
    <button 
      className="btn btn-outline-primary"

      onClick={() => {
        setSelectedProgram(program);
        setShowProgramDetailsModal(true);
      }}
      title="View Details"
    >
      <i className="bi bi-eye"></i>
    </button>
    <button 
      className="btn btn-outline-info "
      onClick={() => {
        setShowSessionAgendaModal(true);
      }}
      title="Add Session"
    >
      <i className="bi bi-calendar-plus"></i>
    </button>
    <button 
      className="btn btn-outline-success"

      onClick={() => {
        setShowBulkAttendanceModal(true);
      }}
      title="Attendance"
    >
      <i className="bi bi-check-circle"></i>
    </button>
    <button 
      className="btn btn-outline-warning"
      onClick={() => {
        setShowFeedbackModal(true);
      }}
      title="Feedback"
    >
      <i className="bi bi-star"></i>
    </button>
    <button 
      className={`btn ${
        program.status === 'upcoming' ? 'btn-outline-warning' :
        program.status === 'ongoing' ? 'btn-outline-success' :
        'btn-outline-secondary'
      }`}
      onClick={() => handleUpdateProgramStatus(program.id)}
      title={
        program.status === 'upcoming' ? 'Activate Program' :
        program.status === 'ongoing' ? 'Conclude Program' :
        'Reactivate Program'
      }
    >
      <i className={`bi ${
        program.status === 'upcoming' ? 'bi-play-circle' :
        program.status === 'ongoing' ? 'bi-stop-circle-fill' :
        'bi-arrow-counterclockwise'
      }`}></i>
    </button>
  </div>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card-footer bg-light d-none d-md-block">
            <small className="text-muted">
              Showing {filteredPrograms.length} of {inductionPrograms.length} programs
            </small>
          </div>
        </div>

        

  <EmployeesTable/>
  
  <div className="row mt-4">
  <div className="col-12">
    <div className="card border">
      <div className="card-header bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <h6 className="mb-2 mb-md-0 fw-bold fs-4">Sessions Management</h6>
        <div className="d-flex gap-2">
          <button 
            className="job-listings-btn"
            onClick={() => setShowSessionAgendaModal(true)}
          >
            <i className="bi bi-plus me-1"></i> Add Session
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              // Export sessions to CSV
              if (sessions.length === 0) {
                alert('No sessions to export');
                return;
              }
              
              const headers = ['Session Title', 'Program', 'Date', 'Time', 'Duration', 'Trainer', 'Type', 'Venue/Link', '	Status'];
              const data = sessions.map(session => [
                session.sessionTitle,
                session.programName,
                session.sessionDate,
                `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`,
                calculateDuration(session.startTime, session.endTime),
                session.trainer || '-',
                session.isVirtual ? 'Virtual' : 'In-person',
                session.isVirtual ? session.meetingLink : session.venue,
                session.status || '-'  // Adding Status field here
              ]);

              const csvContent = [
                headers.join(','),
                ...data.map(row => row.map(cell => `"${cell}"`).join(','))
              ].join('\n');

              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `sessions_export_${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
          >
            <i className="bi bi-download me-1"></i> Export
          </button>
        </div>
      </div>
      
      <div className="card-body p-0">
        {sessions.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
            <h5 className="text-muted">No sessions found</h5>
            <p className="text-muted mb-4">Create your first session to get started</p>
            <button 
              className="create-job-btn"
              onClick={() => setShowSessionAgendaModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Session
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-muted ps-4">Session</th>
                  <th className="text-muted">Program</th>
                  <th className="text-muted">Date & Time</th>
                  <th className="text-muted">Mode</th>
                  <th className="text-muted">Status</th>
                  <th className="text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, index) => {
                  const isUpcoming = new Date(session.sessionDate) >= new Date();
                  const isPast = new Date(session.sessionDate) < new Date();
                  
                  return (
                    <tr key={session.id || index}>
                      <td className="ps-4">
                        <div className="fw-bold">{session.sessionTitle}</div>
                        <small className="text-muted d-block d-md-none">
                          {session.programName}
                        </small>
                        {session.agenda && (
                          <small className="text-muted d-block">
                            {session.agenda.substring(0, 40)}...
                          </small>
                        )}
                      </td>
                      <td>
                        <div className="fw-bold">{session.programName}</div>
                        <small className="text-muted">
                          {calculateDuration(session.startTime, session.endTime)}
                        </small>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{session.sessionDate}</div>
                          <small className="text-muted">
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </small>
                        </div>
                      </td>

                      <td className="align-middle">
                        {session.isVirtual ? (
                          <span className="badge bg-success">
                            Virtual
                          </span>
                        ) : (
                          <span className="badge bg-secondary">
                            on-site
                          </span>
                        )}
                      </td>
                      <td className="align-middle">
                        <span className={`badge ${
                          session.status === 'completed' ? 'bg-success' :
                          session.status === 'cancelled' ? 'bg-danger' :
                          session.status === 'rescheduled' ? 'bg-warning' :
                          isPast ? 'bg-secondary' : 'bg-primary'
                        }`}>
                          {session.status || (isPast ? 'Past' : 'Upcoming')}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="btn-group btn-group-sm gap-2">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => setSelectedSession(session)}
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => {
                              setEditingSession(session);
                              setShowEditSessionModal(true);
                            }}
                            title="Edit Session"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteSession(session.id)}
                            title="Delete Session"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
    </div>
  </div>
</div>
        {/* Policy Acknowledgment Section - Responsive */}
<div className="row mt-4">
  <div className="col-12">
    <div className="card border">
      <div className="card-header bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div>
          <h6 className="mb-2 mb-md-0 fw-bold fs-4">Policy Acknowledgment</h6>
          <small className="text-muted d-none d-md-block">
            Track and manage policy compliance across employees
          </small>
        </div>
        <button 
          className="job-listings-btn"
          onClick={() => setShowPolicyUploadModal(true)}
        >
          <i className="bi bi-plus me-1"></i> Add Policy
        </button>
      </div>
      
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4 pe-4 text-muted">Policy</th>
                <th className="px-3 text-muted">Category</th>
                <th className="px-3 text-muted">Status</th>
                <th className="px-4 text-muted">Completion</th>
                <th className="px-4 text-muted">Progress</th>
                <th className="px-4 pe-4 text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map(policy => {
                const completion = policyCompletionData[policy.id] || {};
                const progress = (policy.completionTracking.completed / policy.completionTracking.totalEmployees) * 100;
                const modulesRead = policy.modules?.filter(m => m.read).length || 0;
                const totalModules = policy.modules?.length || 0;
                const modulesProgress = totalModules > 0 ? (modulesRead / totalModules) * 100 : 100;
                
                return (
                  <tr key={policy.id}>
                    <td className="ps-4 pe-4 align-middle"> 
                      <div>
                        <div className="fw-bold">{policy.name}</div>
                        <div className="small text-muted">
                          Version {policy.version} • Effective: {policy.effectiveDate}
                        </div>
                        <div className="d-block d-md-none mt-2">
                          <small className={`badge ${
                            policy.category === 'compliance' ? 'bg-danger' :
                            policy.category === 'security' ? 'bg-warning' : 'bg-secondary'
                          }`}>
                            {policy.category}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      <span className={`badge ${
                        policy.category === 'compliance' ? 'bg-danger' :
                        policy.category === 'security' ? 'bg-warning' :
                        policy.category === 'hr' ? 'bg-info' : 'bg-secondary'
                      }`}>
                        {policy.category}
                      </span>
                    </td>
                    <td className="px-3 align-middle">
                      {policy.status === 'mandatory' ? (
                        <span className="badge bg-danger d-inline-flex align-items-center">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          Mandatory
                        </span>
                      ) : (
                        <span className="badge bg-success d-inline-flex align-items-center">
                          <i className="bi bi-check-circle me-1"></i>
                          Published
                        </span>
                      )}
                    </td>
                    <td className="px-4 align-middle">
                      <div className="py-1">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="fw-medium">
                            {policy.completionTracking.completed}/{policy.completionTracking.totalEmployees}
                          </small>
                          <small className={`fw-bold ${
                            progress >= 90 ? 'text-success' :
                            progress >= 70 ? 'text-warning' : 'text-danger'
                          }`}>
                            {progress.toFixed(1)}%
                          </small>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className={`progress-bar ${
                              progress >= 90 ? 'bg-success' :
                              progress >= 70 ? 'bg-warning' : 'bg-danger'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 align-middle">
                      {policy.modules && policy.modules.length > 0 ? (
                        <div className="py-1">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="fw-medium">
                              {modulesRead}/{totalModules} modules
                            </small>
                            <small className={`fw-bold ${
                              modulesProgress === 100 ? 'text-success' :
                              modulesProgress >= 50 ? 'text-warning' : 'text-danger'
                            }`}>
                              {modulesProgress.toFixed(0)}%
                            </small>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className={`progress-bar ${
                                modulesProgress === 100 ? 'bg-success' :
                                modulesProgress >= 50 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${modulesProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2">
                          <span className="badge bg-info">No modules</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 align-middle text-end pe-4">
                      <div className="d-flex justify-content-start gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                          style={{ width: '36px', height: '36px' }}
                          onClick={() => {
                            setSelectedPolicy(policy);
                            setShowPolicyModal(true);
                          }}
                          title="View Policy Details"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        
                        {policy.modules && policy.modules.length > 0 && (
                          <button
                            className={`btn btn-sm d-flex align-items-center justify-content-center ${
                              modulesRead === totalModules && totalModules > 0 
                                ? 'btn-success' 
                                : 'btn-outline-info'
                            }`}
                            style={{ width: '36px', height: '36px' }}
                            onClick={() => {
                              setSelectedPolicy(policy);
                              setCurrentPolicyModule(0);
                              setShowPolicyModuleModal(true);
                            }}
                            title={modulesRead === totalModules && totalModules > 0 
                              ? "All modules completed ✓" 
                              : "Read Modules"}
                          >
                            <i className={`bi ${
                              modulesRead === totalModules && totalModules > 0 
                                ? 'bi-check-circle-fill' 
                                : 'bi-book'
                            }`}></i>
                          </button>
                        )}
                        
                        {policy.quiz && policy.quiz.length > 0 && (
                          <button
                            className={`btn btn-sm d-flex align-items-center justify-content-center ${
                              completion.quizPassed 
                                ? 'btn-success' 
                                : 'btn-outline-warning'
                            }`}
                            style={{ width: '36px', height: '36px' }}
                            onClick={() => {
                              setSelectedPolicy(policy);
                              setQuizAnswers({});
                              setShowPolicyQuizModal(true);
                            }}
                            title={completion.quizPassed 
                              ? "Quiz completed ✓" 
                              : "Take Quiz"}
                          >
                            <i className={`bi ${
                              completion.quizPassed 
                                ? 'bi-check-circle-fill' 
                                : 'bi-question-circle'
                            }`}></i>
                          </button>
                        )}
                        
                        <button
                          className={`btn btn-sm d-flex align-items-center justify-content-center ${
                            completion.completed 
                              ? 'btn-success' 
                              : 'btn-outline-success'
                          }`}
                          style={{ width: '36px', height: '36px' }}
                          onClick={() => {
                            if (!completion.completed) {
                              handleCompletePolicy(policy.id);
                            }
                          }}
                          disabled={completion.completed}
                          title={completion.completed 
                            ? "Policy acknowledged ✓" 
                            : "Acknowledge Policy"}
                        >
                          <i className={`bi ${
                            completion.completed 
                              ? 'bi-check-circle-fill' 
                              : 'bi-check-circle'
                          }`}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
        
        {/* Enhanced Modals */}
        {showCreateProgram && (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">Create New Induction Program</h5>
                  <button className="btn-close" onClick={() => setShowCreateProgram(false)}></button>
                </div>
                
                    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">

                  <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                      <label className="form-label fw-bold">Program Name  <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={programForm.name}
                        onChange={(e) => setProgramForm({...programForm, name: e.target.value})}
                        required
                        placeholder="e.g., Q2 2024 Orientation"
                      />
                    </div>
                    
                    <div className="col-12 col-md-6 mb-3">
                      <label className="form-label fw-bold">Program Type  <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        value={programForm.type}
                        onChange={(e) => setProgramForm({...programForm, type: e.target.value})}
                      >
                        <option value="batch">Batch Program</option>
                        <option value="individual">Individual</option>
                        <option value="virtual">Virtual</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={programForm.description}
                      onChange={(e) => setProgramForm({...programForm, description: e.target.value})}
                      placeholder="Program description"
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                      <label className="form-label fw-bold">Start Date  <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        value={programForm.startDate}
                        onChange={(e) => setProgramForm({...programForm, startDate: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="col-12 col-md-6 mb-3">
                      <label className="form-label fw-bold">End Date  <span className="text-danger">*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        value={programForm.endDate}
                        onChange={(e) => setProgramForm({...programForm, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-12 col-md-8 mb-3">
                      <label className="form-label fw-bold">Location  <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={programForm.location}
                        onChange={(e) => setProgramForm({...programForm, location: e.target.value})}
                        required
                        placeholder="e.g., Main Auditorium"
                      />
                    </div>
                    
                    <div className="col-12 col-md-4 mb-3">
                      <label className="form-label fw-bold">Max Participants</label>
                      <input
                        type="number"
                        className="form-control"
                        value={programForm.maxParticipants}
                        onChange={(e) => setProgramForm({...programForm, maxParticipants: parseInt(e.target.value) || 0})}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                
               <div className="modal-footer border-0 bg-light">
                  <button className="cancel-btn" onClick={() => setShowCreateProgram(false)}>
                    Cancel
                  </button>
                  <button 
                    className="create-job-btn" 
                    onClick={handleCreateProgram}
                    disabled={!programForm.name || !programForm.startDate || !programForm.endDate || !programForm.location}
                  >
                    Create Program
                  </button>
                </div>
              </div>
            </div>
        )}
          {showTrainerAssignmentModal && <TrainerAssignmentModal />}
        {showBulkAttendanceModal && <BulkAttendanceModal />}
        {showPolicyModal && <PolicyModal />}
        {showSessionAgendaModal && (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">Create Session Agenda</h5>
              <button className="btn-close" onClick={() => setShowSessionAgendaModal(false)}></button>
            </div>
     {/* BODY */}
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">

              
<div className="row mb-3">
  {/* First card - Program Select */}
  <div className="col-md-6">
    <div className="mb-3">
      <label className="form-label fw-bold">Select Program <span className="text-danger">*</span></label>
      <select 
        className="form-select"
        value={sessionAgendaForm.programId || ''}
        onChange={(e) => setSessionAgendaForm({
          ...sessionAgendaForm, 
          programId: parseInt(e.target.value)
        })}
      >
        <option value="">Choose program...</option>
        {inductionPrograms.map(program => (
          <option key={program.id} value={program.id}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  </div>
  
  {/* Second card - Session Title */}
  <div className="col-md-6">
    <div className="mb-3">
      <label className="form-label fw-bold">Session Title <span className="text-danger">*</span></label>
      <input
        type="text"
        className="form-control"
        value={sessionAgendaForm.sessionTitle}
        onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, sessionTitle: e.target.value})}
        placeholder="e.g., Company Culture & Values"
        required
      />
    </div>
  </div>
</div>

              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw-bold">Session Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={sessionAgendaForm.sessionDate}
                    onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, sessionDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="col-12 col-md-3 mb-3">
                  <label className="form-label fw-bold">Start Time <span className="text-danger">*</span></label>
                  <input
                    type="time"
                    className="form-control"
                    value={sessionAgendaForm.startTime}
                    onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, startTime: e.target.value})}
                    required
                  />
                </div>
                
                <div className="col-12 col-md-3 mb-3">
                  <label className="form-label fw-bold">End Time <span className="text-danger">*</span></label>
                  <input
                    type="time"
                    className="form-control"
                    value={sessionAgendaForm.endTime}
                    onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Agenda/Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={sessionAgendaForm.agenda}
                  onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, agenda: e.target.value})}
                  placeholder="Detailed agenda for this session"
                />
              </div>




              {sessionAgendaForm.isVirtual ? (
                <div className="mb-3">
                  <label className="form-label fw-bold">Meeting Link <span className="text-danger">*</span></label>
                  <input
                    type="url"
                    className="form-control"
                    value={sessionAgendaForm.meetingLink}
                    onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, meetingLink: e.target.value})}
                    placeholder="https://zoom.us/j/..."
                    required={sessionAgendaForm.isVirtual}
                  />
                </div>
              ) : (
                <div className="mb-3">
                  <label className="form-label fw-bold">Venue <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={sessionAgendaForm.venue}
                    onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, venue: e.target.value})}
                    placeholder="e.g., Conference Room A"
                    required={!sessionAgendaForm.isVirtual}
                  />
                </div>
              )}
              <div className="mb-3">
  <label
    htmlFor="session-isVirtual"
    style={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: sessionAgendaForm.isVirtual ? "#3B82F6" : "#4B5563",
      transition: "color 0.3s ease",
    }}
  >
    {/* Custom checkbox box */}
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${sessionAgendaForm.isVirtual ? "#3B82F6" : "#9CA3AF"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "10px",
        background: sessionAgendaForm.isVirtual ? "#3B82F6" : "transparent",
        transition: "all 0.3s ease",
      }}
    >
      {sessionAgendaForm.isVirtual && (
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

    {/* Hidden input */}
    <input
      type="checkbox"
      id="session-isVirtual"
      checked={sessionAgendaForm.isVirtual}
      onChange={(e) =>
        setSessionAgendaForm({
          ...sessionAgendaForm,
          isVirtual: e.target.checked,
        })
      }
      style={{ display: "none" }}
    />

    <span className="fw-medium">Virtual Session</span>
  </label>
</div>
            </div>
            
    {/* FOOTER */}
          <div className="modal-footer border-0 bg-light">
              <button className="cancel-btn" onClick={() => setShowSessionAgendaModal(false)}>
                Cancel
              </button>
              <button 
                className="create-job-btn" 
                onClick={handleCreateSession}
                disabled={!sessionAgendaForm.programId || !sessionAgendaForm.sessionTitle}
              >
                Create Session
              </button>
            </div>

          </div>
        </div>

    )}
    {showEditSessionModal && (
<div className="hrms-modal-overlay">
  <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

    {/* HEADER */}
    <div className="hrms-modal-header">
      <h5 className="hrms-modal-title d-flex align-items-center">Edit Session</h5>
            <button className="btn-close" onClick={() => setShowEditSessionModal(false)}></button>
          </div>
          
    {/* BODY */}
    <div className="hrms-modal-body hrms-modal-body-scroll flex-grow-1">

            {/* Program Selection */}
<div className="row mb-2">
  {/* First column - Select Program */}
  <div className="col-md-6">
    <div className="mb-3">
      <label className="form-label fw-bold">Select Program <span className="text-danger">*</span></label>
      <select 
        className="form-select"
        value={editingSession.programId || ''}
        onChange={(e) => setEditingSession({
          ...editingSession, 
          programId: parseInt(e.target.value)
        })}
        required
      >
        <option value="">Choose program...</option>
        {inductionPrograms.map(program => (
          <option key={program.id} value={program.id}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  </div>
  
  {/* Second column - Session Title */}
  <div className="col-md-6">
    <div className="mb-3">
      <label className="form-label fw-bold">Session Title <span className="text-danger">*</span></label>
      <input
        type="text"
        className="form-control"
        value={editingSession.sessionTitle || ''}
        onChange={(e) => setEditingSession({...editingSession, sessionTitle: e.target.value})}
        placeholder="e.g., Company Culture & Values"
        required
      />
    </div>
  </div>
</div>

            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-bold">Session Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  className="form-control"
                  value={editingSession.sessionDate || ''}
                  onChange={(e) => setEditingSession({...editingSession, sessionDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="col-12 col-md-3 mb-3">
                <label className="form-label fw-bold">Start Time <span className="text-danger">*</span></label>
                <input
                  type="time"
                  className="form-control"
                  value={editingSession.startTime || ''}
                  onChange={(e) => setEditingSession({...editingSession, startTime: e.target.value})}
                  required
                />
              </div>
              
              <div className="col-12 col-md-3 mb-3">
                <label className="form-label fw-bold">End Time <span className="text-danger">*</span></label>
                <input
                  type="time"
                  className="form-control"
                  value={editingSession.endTime || ''}
                  onChange={(e) => setEditingSession({...editingSession, endTime: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label fw-bold">Agenda/Description</label>
              <textarea
                className="form-control"
                rows="4"
                value={editingSession.agenda || ''}
                onChange={(e) => setEditingSession({...editingSession, agenda: e.target.value})}
                placeholder="Detailed agenda for this session"
              />
            </div>

            {/* Virtual Session Checkbox */}


 <div className="row mb-2">
  {/* First column - Meeting Link / Venue */}
  <div className="col-md-6">
    {editingSession.isVirtual ? (
      <div className="mb-3">
        <label className="form-label fw-bold">Meeting Link <span className="text-danger">*</span></label>
        <input
          type="url"
          className="form-control"
          value={editingSession.meetingLink || ''}
          onChange={(e) => setEditingSession({...editingSession, meetingLink: e.target.value})}
          placeholder="https://zoom.us/j/..."
          required={editingSession.isVirtual}
        />
      </div>
    ) : (
      <div className="mb-3">
        <label className="form-label fw-bold">Venue <span className="text-danger">*</span></label>
        <input
          type="text"
          className="form-control"
          value={editingSession.venue || ''}
          onChange={(e) => setEditingSession({...editingSession, venue: e.target.value})}
          placeholder="e.g., Conference Room A"
          required={!editingSession.isVirtual}
        />
      </div>
    )}
                <div className="mb-3">
              <label
                htmlFor="edit-session-isVirtual"
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: editingSession.isVirtual ? "#3B82F6" : "#4B5563",
                  transition: "color 0.3s ease",
                }}
              >
                {/* Custom checkbox box */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    border: `2px solid ${editingSession.isVirtual ? "#3B82F6" : "#9CA3AF"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    background: editingSession.isVirtual ? "#3B82F6" : "transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  {editingSession.isVirtual && (
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

                {/* Hidden input */}
                <input
                  type="checkbox"
                  id="edit-session-isVirtual"
                  checked={editingSession.isVirtual || false}
                  onChange={(e) => setEditingSession({
                    ...editingSession,
                    isVirtual: e.target.checked
                  })}
                  style={{ display: "none" }}
                />

                <span className="fw-medium">Virtual Session</span>
              </label>
            </div>
  </div>
  
  {/* Second column - Session Status */}
  <div className="col-md-6">
    <div className="mb-3">
      <label className="form-label fw-bold">Session Status</label>
      <select
        className="form-select"
        value={editingSession.status || 'scheduled'}
        onChange={(e) => setEditingSession({...editingSession, status: e.target.value})}
      >
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="postponed">Postponed</option>
      </select>
    </div>
  </div>
</div>

          </div>
          
    {/* FOOTER */}
          <div className="modal-footer border-0 bg-light">
            <button className="cancel-btn" onClick={() => setShowEditSessionModal(false)}>
              Cancel
            </button>
            <button 
              className="create-job-btn" 
              onClick={() => {
                // Handle edit session function
                handleEditSession(editingSession);
              }}
              disabled={!editingSession.sessionTitle || !editingSession.sessionDate || !editingSession.startTime || !editingSession.endTime}
            >
              Update Session
            </button>
          </div>
        </div>
      </div>
    )}
{selectedSession && <SessionDetailsModal />}
        {/* Session Schedules Section */}
        {selectedProgram && <ProgramDetailsModal />}
         {/* Add this with your other modal conditions */}
         {showAttendanceHistoryModal && <AttendanceDetailsModal />}
        {showPolicyUploadModal && <PolicyUploadModal />}
        {showMaterialDistributionModal && <MaterialDistributionModal />}
        {showVenueBookingModal && <VenueBookingModal />}
        {showFeedbackModal && <FeedbackModal />}
        {showPolicyModuleModal && <PolicyModuleModal />}
        {showPolicyQuizModal && <PolicyQuizModal />}
      </div>
    </>
  );
};

export default InductionOrientation;