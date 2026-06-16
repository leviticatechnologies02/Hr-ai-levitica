import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import StatCard from '../../../shared/components/StatCard';
import AttendanceDetailsModal from '../../hrms/modal/AttendanceDetailsModal';
import PolicyUploadModal from '../../hrms/modal/PolicyUploadModal';
import TrainerAssignmentModal from '../../hrms/modal/TrainerAssignmentModal';
import ProgramDetailsModal from '../../hrms/modal/ProgramDetailsModal';
import BulkAttendanceModal from '../../hrms/modal/BulkAttendanceModal';
import InductionAddEmployeeModal from '../../hrms/modal/InductionAddEmployeeModal';
import InductionEditEmployeeModal from '../../hrms/modal/InductionEditEmployeeModal';
import PolicyModal from '../../hrms/modal/PolicyModal';
import MaterialDistributionModal from '../../hrms/modal/MaterialDistributionModal';
import VenueBookingModal from '../../hrms/modal/VenueBookingModal';
import FeedbackModal from '../../hrms/modal/FeedbackModal';
import PolicyModuleModal from '../../hrms/modal/PolicyModuleModal';
import PolicyQuizModal from '../../hrms/modal/PolicyQuizModal';
import CreateProgramModal from '../../hrms/modal/CreateProgramModal';
import CreateSessionModal from '../../hrms/modal/CreateSessionModal';
import EditSessionModal from '../../hrms/modal/EditSessionModal';
import SessionDetailsModal from '../../hrms/modal/SessionDetailsModal';

const InductionOrientation = () => {

  const initialPrograms = [];

  const initialPolicies = [];
  const userInfo = {
    name: '',
    role: '',
    email: '',
    avatar: ''
  };

  const [inductionPrograms, setInductionPrograms] = useState(initialPrograms);
  const [policies, setPolicies] = useState(initialPolicies);
  const [showCreateProgram, setShowCreateProgram] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const [showTrainerAssignmentModal, setShowTrainerAssignmentModal] = useState(false);
  const [showBulkAttendanceModal, setShowBulkAttendanceModal] = useState(false);
  const [showPolicyUploadModal, setShowPolicyUploadModal] = useState(false);
  const [showMaterialDistributionModal, setShowMaterialDistributionModal] = useState(false);
  const [showVenueBookingModal, setShowVenueBookingModal] = useState(false);
  const [showSessionAgendaModal, setShowSessionAgendaModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPolicyQuizModal, setShowPolicyQuizModal] = useState(false);
  const [showPolicyModuleModal, setShowPolicyModuleModal] = useState(false);
  const [showProgramDetailsModal, setShowProgramDetailsModal] = useState(false);

  const [policyCompletionData, setPolicyCompletionData] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [currentPolicyModule, setCurrentPolicyModule] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [feedbackData, setFeedbackData] = useState({});

  const [sessions, setSessions] = useState([]);
  const [showEditSessionModal, setShowEditSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [selectedSessionForDelete, setSelectedSessionForDelete] = useState(null);
  const [selectedProgramForAttendance, setSelectedProgramForAttendance] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState('');
  const [employees, setEmployees] = useState([]);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [employeeDepartmentFilter, setEmployeeDepartmentFilter] = useState('all');

  const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];


  const filteredEmployees = employees.filter(employee => {
    const searchMatch =
      employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(employeeSearchTerm.toLowerCase());

    const departmentMatch =
      employeeDepartmentFilter === 'all' ||
      employee.department === employeeDepartmentFilter;

    return searchMatch && departmentMatch;
  });



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



  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [showAttendanceHistoryModal, setShowAttendanceHistoryModal] = useState(false);
  const [selectedAttendanceRecord, setSelectedAttendanceRecord] = useState(null);
  const [attendanceFilter, setAttendanceFilter] = useState('all');


  const [showEmployeeProgressModal, setShowEmployeeProgressModal] = useState(false);
  const [showAssignProgramModal, setShowAssignProgramModal] = useState(false);
  const [showUpdateProgressModal, setShowUpdateProgressModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  const [assignProgramForm, setAssignProgramForm] = useState({
    employeeId: '',
    programId: '',
    startDate: '',
    endDate: ''
  });


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



  const handleCreateProgram = () => {

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
      status: 'upcoming',
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

    setSessions(prev => [...prev, {
      ...newSession,
      programName: inductionPrograms.find(p => p.id === sessionAgendaForm.programId)?.name || 'Unknown'
    }]);


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


  const handleEditSession = () => {
    if (!editingSession || !editingSession.sessionTitle) {
      alert('Please fill all required fields');
      return;
    }

    setSessions(prev => prev.map(session =>
      session.id === editingSession.id ? { ...editingSession } : session
    ));


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


  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {

      const sessionToDelete = sessions.find(s => s.id === sessionId);

      setSessions(prev => prev.filter(session => session.id !== sessionId));

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


  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };


  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '';

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    let diff = (end - start) / (1000 * 60 * 60);

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
        const allRead = updatedModules.every(m => m.read);

        return {
          ...policy,
          modules: updatedModules,
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


  const handleUpdateProgramStatus = (programId) => {
    setInductionPrograms(prev => prev.map(program => {
      if (program.id === programId) {
        let newStatus;
        switch (program.status) {
          case 'upcoming':
            newStatus = 'ongoing';
            break;
          case 'ongoing':
            newStatus = 'completed';
            break;
          case 'completed':
            newStatus = 'upcoming';
            break;
          default:
            newStatus = 'upcoming';
        }

        const updatedProgram = {
          ...program,
          status: newStatus
        };

        if (newStatus === 'completed') {
          updatedProgram.endDate = new Date().toISOString().split('T')[0];
          updatedProgram.completedSessions = updatedProgram.totalSessions;
        }

        if (newStatus === 'ongoing' && new Date(program.startDate) > new Date()) {
          updatedProgram.startDate = new Date().toISOString().split('T')[0];
        }

        return updatedProgram;
      }
      return program;
    }));


    const program = inductionPrograms.find(p => p.id === programId);
    if (program) {
      let nextStatus;
      switch (program.status) {
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


  const handleEditEmployee = () => {
    if (!editingEmployee || !editingEmployee.name || !editingEmployee.email) {
      alert('Please fill in all required fields');
      return;
    }

    const oldProgramId = employees.find(e => e.id === editingEmployee.id)?.programAssigned;
    const newProgramId = editingEmployee.programAssigned;

    setEmployees(prev => prev.map(emp =>
      emp.id === editingEmployee.id ? editingEmployee : emp
    ));
    if (oldProgramId !== newProgramId) {
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

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const employeeToDelete = employees.find(e => e.id === employeeId);

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

      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
      alert('Employee deleted successfully!');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ongoing': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Ongoing</span>;
      case 'upcoming': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">Upcoming</span>;
      case 'completed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Completed</span>;
      case 'draft': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-650 border border-slate-205">Draft</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">{status}</span>;
    }
  };

  const filteredPrograms = inductionPrograms.filter(program => {
    if (activeTab === 'all') return true;
    return program.status === activeTab;
  }).filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-2 py-2 space-y-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
              <Icon icon="heroicons:academic-cap" className="w-8 h-8 text-blue-550" />
              Induction & Orientation
            </h1>
            <p className="text-sm text-slate-500 mt-1">Complete onboarding management with policy acknowledgment</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-sm"
              onClick={() => setShowBulkAttendanceModal(true)}
            >
              <Icon icon="heroicons:users" className="w-4 h-4 text-slate-500" />
              <span>Bulk Attendance</span>
            </button>

            <button
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-sm"
              onClick={() => setShowPolicyUploadModal(true)}
            >
              <Icon icon="heroicons:arrow-up-tray" className="w-4 h-4 text-slate-500" />
              <span>Upload Policy</span>
            </button>

            <button
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2 shadow-sm"
              onClick={() => setShowCreateProgram(true)}
            >
              <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
              <span>Create Program</span>
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Programs"
            value={inductionPrograms.length}
            subtitle="Active & upcoming induction programs"
            icon="heroicons:calendar-days"
            color="blue"
          />
          <StatCard
            title="Total Participants"
            value={inductionPrograms.reduce((sum, program) => sum + program.totalParticipants, 0)}
            subtitle="Enrolled new employees"
            icon="heroicons:users"
            color="green"
          />
          <StatCard
            title="Policy Completion"
            value={(() => {
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
            })()}
            subtitle="Averages across required policies"
            icon="heroicons:document-check"
            color="yellow"
          />
          <StatCard
            title="Avg. Rating"
            value={(() => {
              if (inductionPrograms.length === 0) return "0.0/5";

              const totalRating = inductionPrograms.reduce(
                (sum, program) => sum + program.overallRating,
                0
              );

              const averageRating = totalRating / inductionPrograms.length;

              return `${Math.round(averageRating * 10) / 10}/5`;
            })()}
            subtitle="Overall satisfaction rating"
            icon="heroicons:star"
            color="purple"
          />
        </div>


        <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-150 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Induction Programs</h3>
              <p className="text-sm text-slate-500 mt-0.5">Track and manage onboarding status</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              {filteredPrograms.length} programs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider">
                  <th className="px-6 py-4">Program Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4 text-center">Participants</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrograms.map(program => (
                  <tr key={program.id} className="hover:bg-slate-50/55 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{program.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{program.description}</div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${program.type === 'batch' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        program.type === 'individual' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                        {program.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {program.status === 'ongoing' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Ongoing</span>
                      ) : program.status === 'upcoming' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">Upcoming</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Completed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-middle text-sm text-slate-650">
                      <div className="font-semibold">{program.startDate} to {program.endDate}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{program.duration}</div>
                    </td>
                    <td className="px-6 py-4 align-middle text-center">
                      <div className="font-semibold text-slate-800">
                        {program.confirmedParticipants || 0}/{program.totalParticipants || 0}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {program.participants?.length || 0} enrolled
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-800">{program.overallRating}</span>
                        <Icon icon="heroicons:star-solid" className="w-4 h-4 text-amber-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          className="p-1.5 hover:bg-blue-100 text-blue-500 hover:text-blue-700 rounded-lg transition-all"
                          onClick={() => {
                            setSelectedProgram(program);
                            setShowProgramDetailsModal(true);
                          }}
                          title="View Details"
                        >
                          <Icon icon="heroicons:eye" className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-blue-100 text-blue-500 hover:text-blue-700 rounded-lg transition-all"
                          onClick={() => {
                            setSessionAgendaForm({ ...sessionAgendaForm, programId: program.id });
                            setShowSessionAgendaModal(true);
                          }}
                          title="Add Session"
                        >
                          <Icon icon="heroicons:calendar-days" className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-yellow-100 text-yellow-500 hover:text-yellow-700 rounded-lg transition-all"
                          onClick={() => {
                            setSelectedProgramForAttendance(program.id);
                            setShowBulkAttendanceModal(true);
                          }}
                          title="Attendance"
                        >
                          <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-all"
                          onClick={() => {
                            setSelectedProgram(program);
                            setShowFeedbackModal(true);
                          }}
                          title="Feedback"
                        >
                          <Icon icon="heroicons:star" className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-1.5 rounded-lg transition-all ${program.status === 'upcoming' ? 'hover:bg-amber-50 text-amber-600' :
                            program.status === 'ongoing' ? 'hover:bg-emerald-50 text-emerald-600' :
                              'hover:bg-slate-100 text-slate-500'
                            }`}
                          onClick={() => handleUpdateProgramStatus(program.id)}
                          title={
                            program.status === 'upcoming' ? 'Activate Program' :
                              program.status === 'ongoing' ? 'Conclude Program' :
                                'Reactivate Program'
                          }
                        >
                          <Icon
                            icon={
                              program.status === 'upcoming' ? 'heroicons:play' :
                                program.status === 'ongoing' ? 'heroicons:stop' :
                                  'heroicons:arrow-path'
                            }
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Showing {filteredPrograms.length} of {inductionPrograms.length} programs</span>
          </div>
        </div>

        <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Employees List</h3>
              <p className="text-sm text-slate-500 mt-0.5">Manage employee induction program assignments</p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
                onClick={() => setShowAddEmployeeModal(true)}
              >
                <Icon icon="heroicons:user-plus" className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
              <button
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (selectedEmployees.length === 0) {
                    alert('Please select employees first');
                    return;
                  }
                  setShowBulkAttendanceModal(true);
                }}
                disabled={selectedEmployees.length === 0}
              >
                <Icon icon="heroicons:check-badge" className="w-4 h-4" />
                <span>Mark Attendance ({selectedEmployees.length})</span>
              </button>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-slate-100 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 tracking-wider mb-1.5">Search Employees</label>
                <div className="relative">
                  <Icon icon="heroicons:magnifying-glass" className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-400"
                    placeholder="Search by name, ID, department..."
                    value={employeeSearchTerm}
                    onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 tracking-wider mb-1.5">Filter by Department</label>
                <select
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white text-slate-700"
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

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider">
                  <th className="px-6 py-4 text-center w-12">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                      onChange={handleSelectAllEmployees}
                      className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Joining Date</th>
                  <th className="px-6 py-4">Program Assigned</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-slate-500">
                      <Icon icon="heroicons:users" className="w-10 h-10 mx-auto text-slate-300 mb-2.5" />
                      <div className="font-semibold">No employees found</div>
                      <div className="text-xs text-slate-400 mt-0.5">Try adjusting your search or filter criteria</div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(employee => (
                    <tr key={employee.id} className="hover:bg-slate-50/55 transition-colors">
                      <td className="px-6 py-4 align-middle text-center">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleSelectEmployee(employee.id)}
                          className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="font-semibold text-slate-800">{employee.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">ID: {employee.employeeId}</div>
                      </td>
                      <td className="px-6 py-4 align-middle text-sm text-slate-650">
                        <div className="font-semibold">{employee.email}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{employee.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 align-middle text-sm text-slate-650">
                        <div className="font-semibold">{employee.department}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{employee.designation}</div>
                      </td>
                      <td className="px-6 py-4 align-middle text-sm text-slate-650">
                        {new Date(employee.joiningDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {employee.programAssigned ? (
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-100">
                              {getProgramName(employee.programAssigned)}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">Program #{employee.programAssigned}</div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {employee.attendanceStatus === 'present' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Present</span>
                        ) : employee.attendanceStatus === 'absent' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">Absent</span>
                        ) : employee.attendanceStatus === 'late' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">Late</span>
                        ) : employee.attendanceStatus === 'half_day' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">Half Day</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200">Not Marked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            className="p-1.5 hover:bg-yellow-100 text-yellow-500 hover:text-yellow-700 rounded-lg transition-all"
                            onClick={() => {
                              setEditingEmployee(employee);
                              setShowEditEmployeeModal(true);
                            }}
                            title="Edit Employee"
                          >
                            <Icon icon="heroicons:pencil-square" className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-rose-100 text-rose-500 hover:text-rose-700 rounded-lg transition-all"
                            onClick={() => handleDeleteEmployee(employee.id)}
                            title="Delete Employee"
                          >
                            <Icon icon="heroicons:trash" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Showing {filteredEmployees.length} of {employees.length} employees{selectedEmployees.length > 0 && ` (${selectedEmployees.length} selected)`}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Sessions Management</h3>
              <p className="text-sm text-slate-500 mt-0.5">Track and manage program schedules</p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
                onClick={() => setShowSessionAgendaModal(true)}
              >
                <Icon icon="heroicons:plus" className="w-4 h-4" />
                <span>Add Session</span>
              </button>
              <button
                className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
                onClick={() => {
                  if (sessions.length === 0) {
                    alert('No sessions to export');
                    return;
                  }

                  const headers = ['Session Title', 'Program', 'Date', 'Time', 'Duration', 'Trainer', 'Type', 'Venue/Link', 'Status'];
                  const data = sessions.map(session => [
                    session.sessionTitle,
                    session.programName,
                    session.sessionDate,
                    `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`,
                    calculateDuration(session.startTime, session.endTime),
                    session.trainer || '-',
                    session.isVirtual ? 'Virtual' : 'In-person',
                    session.isVirtual ? session.meetingLink : session.venue,
                    session.status || '-'
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
                <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4 text-slate-500" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {sessions.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500 bg-white">
                <Icon icon="heroicons:calendar" className="w-12 h-12 mx-auto text-slate-350 mb-3" />
                <h5 className="font-bold text-slate-700 text-base">No sessions found</h5>
                <p className="text-sm text-slate-400 mt-1 mb-4">Create your first session to get started</p>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
                  onClick={() => setShowSessionAgendaModal(true)}
                >
                  <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
                  <span>Create Session</span>
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider">
                    <th className="px-6 py-4">Session</th>
                    <th className="px-6 py-4">Program</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Mode</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((session, index) => {
                    const isPast = new Date(session.sessionDate) < new Date();

                    return (
                      <tr key={session.id || index} className="hover:bg-slate-50/55 transition-colors">
                        <td className="px-6 py-4 align-middle">
                          <div className="font-semibold text-slate-800">{session.sessionTitle}</div>
                          {session.agenda && (
                            <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{session.agenda}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 align-middle text-sm text-slate-650">
                          <div className="font-semibold text-slate-800">{session.programName}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{calculateDuration(session.startTime, session.endTime)}</div>
                        </td>
                        <td className="px-6 py-4 align-middle text-sm text-slate-650">
                          <div className="font-semibold text-slate-800">{session.sessionDate}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{formatTime(session.startTime)} - {formatTime(session.endTime)}</div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          {session.isVirtual ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">Virtual</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">On-site</span>
                          )}
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${session.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            session.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              session.status === 'rescheduled' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                isPast ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                                  'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                            {session.status || (isPast ? 'Past' : 'Upcoming')}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-middle text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              className="p-1.5 hover:bg-blue-100 text-blue-500 hover:text-blue-700 rounded-lg transition-all"
                              onClick={() => setSelectedSession(session)}
                              title="View Details"
                            >
                              <Icon icon="heroicons:eye" className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 hover:bg-yellow-100 text-yellow-500 hover:text-yellow-700 rounded-lg transition-all"
                              onClick={() => {
                                setEditingSession(session);
                                setShowEditSessionModal(true);
                              }}
                              title="Edit Session"
                            >
                              <Icon icon="heroicons:pencil-square" className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 hover:bg-slate-150 text-rose-500 hover:text-rose-700 rounded-lg transition-all"
                              onClick={() => handleDeleteSession(session.id)}
                              title="Delete Session"
                            >
                              <Icon icon="heroicons:trash" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Policy Acknowledgment</h3>
              <p className="text-sm text-slate-500 mt-0.5">Track and manage policy compliance across employees</p>
            </div>
            <button
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-sm"
              onClick={() => setShowPolicyUploadModal(true)}
            >
              <Icon icon="heroicons:plus" className="w-4 h-4" />
              <span>Add Policy</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50 text-slate-500 font-semibold text-xs tracking-wider">
                  <th className="px-6 py-4">Policy</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Completion</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {policies.map(policy => {
                  const completion = policyCompletionData[policy.id] || {};
                  const progress = (policy.completionTracking.completed / policy.completionTracking.totalEmployees) * 100;
                  const modulesRead = policy.modules?.filter(m => m.read).length || 0;
                  const totalModules = policy.modules?.length || 0;
                  const modulesProgress = totalModules > 0 ? (modulesRead / totalModules) * 100 : 100;

                  return (
                    <tr key={policy.id} className="hover:bg-slate-50/55 transition-colors">
                      <td className="px-6 py-4 align-middle">
                        <div className="font-semibold text-slate-800">{policy.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Version {policy.version} • Effective: {policy.effectiveDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${policy.category === 'compliance' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          policy.category === 'security' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            policy.category === 'hr' ? 'bg-info-50 text-info-700 border border-info-100' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                          {policy.category}
                        </span>
                      </td>
                      <td className="px-3 align-middle">
                        {policy.status === 'mandatory' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                            <Icon icon="heroicons:exclamation-triangle" className="w-3.5 h-3.5" />
                            Mandatory
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <Icon icon="heroicons:check-circle" className="w-3.5 h-3.5" />
                            Published
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle w-56">
                        <div className="py-1">
                          <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                            <span className="text-slate-500">
                              {policy.completionTracking.completed}/{policy.completionTracking.totalEmployees}
                            </span>
                            <span className={
                              progress >= 90 ? 'text-emerald-600' :
                                progress >= 70 ? 'text-amber-600' : 'text-rose-600'
                            }>
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-300 ${progress >= 90 ? 'bg-emerald-500' :
                                progress >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle w-48">
                        {policy.modules && policy.modules.length > 0 ? (
                          <div className="py-1">
                            <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                              <span className="text-slate-500">
                                {modulesRead}/{totalModules} modules
                              </span>
                              <span className={
                                modulesProgress === 100 ? 'text-emerald-600' :
                                  modulesProgress >= 50 ? 'text-amber-600' : 'text-rose-600'
                              }>
                                {modulesProgress.toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-300 ${modulesProgress === 100 ? 'bg-emerald-500' :
                                  modulesProgress >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                  }`}
                                style={{ width: `${modulesProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">No modules</span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            className="p-1.5 hover:bg-blue-100 text-blue-500 hover:text-blue-700 rounded-lg transition-all"
                            onClick={() => {
                              setSelectedPolicy(policy);
                              setShowPolicyModal(true);
                            }}
                            title="View Policy Details"
                          >
                            <Icon icon="heroicons:eye" className="w-4 h-4" />
                          </button>

                          {policy.modules && policy.modules.length > 0 && (
                            <button
                              className={`p-1.5 rounded-lg transition-all ${modulesRead === totalModules && totalModules > 0
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'hover:bg-emerald-100 text-emerald-500 hover:text-emerald-700'
                                }`}
                              onClick={() => {
                                setSelectedPolicy(policy);
                                setCurrentPolicyModule(0);
                                setShowPolicyModuleModal(true);
                              }}
                              title={modulesRead === totalModules && totalModules > 0
                                ? "All modules completed ✓"
                                : "Read Modules"}
                            >
                              <Icon
                                icon={
                                  modulesRead === totalModules && totalModules > 0
                                    ? 'heroicons:check-circle-solid'
                                    : 'heroicons:book-open'
                                }
                                className="w-4 h-4"
                              />
                            </button>
                          )}

                          {policy.quiz && policy.quiz.length > 0 && (
                            <button
                              className={`p-1.5 rounded-lg transition-all ${completion.quizPassed
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'hover:bg-rose-100 text-rose-500 hover:text-rose-700'
                                }`}
                              onClick={() => {
                                setSelectedPolicy(policy);
                                setQuizAnswers({});
                                setShowPolicyQuizModal(true);
                              }}
                              title={completion.quizPassed
                                ? "Quiz completed ✓"
                                : "Take Quiz"}
                            >
                              <Icon
                                icon={
                                  completion.quizPassed
                                    ? 'heroicons:check-circle-solid'
                                    : 'heroicons:question-mark-circle'
                                }
                                className="w-4 h-4"
                              />
                            </button>
                          )}

                          <button
                            className={`p-1.5 rounded-lg transition-all ${completion.completed
                              ? 'bg-emerald-50 text-emerald-600 cursor-default'
                              : 'hover:bg-emerald-100 text-emerald-500 hover:text-emerald-700'
                              }`}
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
                            <Icon
                              icon={
                                completion.completed
                                  ? 'heroicons:check-circle-solid'
                                  : 'heroicons:check-circle'
                              }
                              className="w-4 h-4"
                            />
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


        {showCreateProgram && (
          <CreateProgramModal
            showCreateProgram={showCreateProgram}
            setShowCreateProgram={setShowCreateProgram}
            programForm={programForm}
            setProgramForm={setProgramForm}
            handleCreateProgram={handleCreateProgram}
          />
        )}

        {showTrainerAssignmentModal && (
          <TrainerAssignmentModal
            showTrainerAssignmentModal={showTrainerAssignmentModal}
            setShowTrainerAssignmentModal={setShowTrainerAssignmentModal}
            trainerAssignmentData={trainerAssignmentData}
            setTrainerAssignmentData={setTrainerAssignmentData}
            inductionPrograms={inductionPrograms}
            handleAssignTrainer={handleAssignTrainer}
          />
        )}

        {showBulkAttendanceModal && (
          <BulkAttendanceModal
            showBulkAttendanceModal={showBulkAttendanceModal}
            setShowBulkAttendanceModal={setShowBulkAttendanceModal}
            selectedEmployees={selectedEmployees}
            setSelectedEmployees={setSelectedEmployees}
            employees={employees}
            setEmployees={setEmployees}
            attendanceDate={attendanceDate}
            setAttendanceDate={setAttendanceDate}
            selectedProgramForAttendance={selectedProgramForAttendance}
            setSelectedProgramForAttendance={setSelectedProgramForAttendance}
            inductionPrograms={inductionPrograms}
            setInductionPrograms={setInductionPrograms}
            userInfo={userInfo}
            setGlobalAttendanceRecords={setAttendanceRecords}
          />
        )}

        {showPolicyModal && (
          <PolicyModal
            showPolicyModal={showPolicyModal}
            setShowPolicyModal={setShowPolicyModal}
            selectedPolicy={selectedPolicy}
            policies={policies}
            setSelectedPolicy={setSelectedPolicy}
            setCurrentPolicyModule={setCurrentPolicyModule}
            setShowPolicyModuleModal={setShowPolicyModuleModal}
            setShowPolicyQuizModal={setShowPolicyQuizModal}
            handleCompletePolicy={handleCompletePolicy}
          />
        )}

        {showSessionAgendaModal && (
          <CreateSessionModal
            showSessionAgendaModal={showSessionAgendaModal}
            setShowSessionAgendaModal={setShowSessionAgendaModal}
            sessionAgendaForm={sessionAgendaForm}
            setSessionAgendaForm={setSessionAgendaForm}
            inductionPrograms={inductionPrograms}
            handleCreateSession={handleCreateSession}
          />
        )}

        {showEditSessionModal && (
          <EditSessionModal
            showEditSessionModal={showEditSessionModal}
            setShowEditSessionModal={setShowEditSessionModal}
            editingSession={editingSession}
            setEditingSession={setEditingSession}
            inductionPrograms={inductionPrograms}
            handleEditSession={handleEditSession}
          />
        )}

        {selectedSession && (
          <SessionDetailsModal
            selectedSession={selectedSession}
            setSelectedSession={setSelectedSession}
          />
        )}

        {showProgramDetailsModal && selectedProgram && (
          <ProgramDetailsModal
            showProgramDetailsModal={showProgramDetailsModal}
            setSelectedProgram={(val) => {
              setSelectedProgram(val);
              if (!val) setShowProgramDetailsModal(false);
            }}
            selectedProgram={selectedProgram}
            sessionAgendaForm={sessionAgendaForm}
            setSessionAgendaForm={setSessionAgendaForm}
            setShowSessionAgendaModal={setShowSessionAgendaModal}
          />
        )}

        {showAttendanceHistoryModal && (
          <AttendanceDetailsModal
            showAttendanceHistoryModal={showAttendanceHistoryModal}
            setShowAttendanceHistoryModal={setShowAttendanceHistoryModal}
            selectedAttendanceRecord={selectedAttendanceRecord}
          />
        )}

        {showPolicyUploadModal && (
          <PolicyUploadModal
            showPolicyUploadModal={showPolicyUploadModal}
            setShowPolicyUploadModal={setShowPolicyUploadModal}
            policies={policies}
            setPolicies={setPolicies}
          />
        )}

        {showMaterialDistributionModal && (
          <MaterialDistributionModal
            showMaterialDistributionModal={showMaterialDistributionModal}
            setShowMaterialDistributionModal={setShowMaterialDistributionModal}
            materialForm={materialForm}
            setMaterialForm={setMaterialForm}
            inductionPrograms={inductionPrograms}
            handleDistributeMaterial={handleDistributeMaterial}
          />
        )}

        {showVenueBookingModal && (
          <VenueBookingModal
            showVenueBookingModal={showVenueBookingModal}
            setShowVenueBookingModal={setShowVenueBookingModal}
            venueForm={venueForm}
            setVenueForm={setVenueForm}
            inductionPrograms={inductionPrograms}
            handleBookVenue={handleBookVenue}
          />
        )}

        {showFeedbackModal && (
          <FeedbackModal
            showFeedbackModal={showFeedbackModal}
            setShowFeedbackModal={setShowFeedbackModal}
            selectedProgram={selectedProgram}
            feedbackData={feedbackData}
            setFeedbackData={setFeedbackData}
            inductionPrograms={inductionPrograms}
            setInductionPrograms={setInductionPrograms}
            userInfo={userInfo}
          />
        )}

        {showPolicyModuleModal && (
          <PolicyModuleModal
            showPolicyModuleModal={showPolicyModuleModal}
            setShowPolicyModuleModal={setShowPolicyModuleModal}
            selectedPolicy={selectedPolicy}
            policies={policies}
            setSelectedPolicy={setSelectedPolicy}
            currentPolicyModule={currentPolicyModule}
            setCurrentPolicyModule={setCurrentPolicyModule}
            setPolicies={setPolicies}
            setShowPolicyQuizModal={setShowPolicyQuizModal}
            handleCompletePolicy={handleCompletePolicy}
          />
        )}

        {showPolicyQuizModal && (
          <PolicyQuizModal
            showPolicyQuizModal={showPolicyQuizModal}
            setShowPolicyQuizModal={setShowPolicyQuizModal}
            selectedPolicy={selectedPolicy}
            policies={policies}
            quizAnswers={quizAnswers}
            setQuizAnswers={setQuizAnswers}
            handleSubmitQuiz={handleSubmitQuiz}
          />
        )}

        {showAddEmployeeModal && (
          <InductionAddEmployeeModal
            showAddEmployeeModal={showAddEmployeeModal}
            setShowAddEmployeeModal={setShowAddEmployeeModal}
            employeeForm={employeeForm}
            setEmployeeForm={setEmployeeForm}
            handleAddEmployee={handleAddEmployee}
            inductionPrograms={inductionPrograms}
          />
        )}


        {showEditEmployeeModal && editingEmployee && (
          <InductionEditEmployeeModal
            showEditEmployeeModal={showEditEmployeeModal}
            setShowEditEmployeeModal={setShowEditEmployeeModal}
            editingEmployee={editingEmployee}
            setEditingEmployee={setEditingEmployee}
            handleEditEmployee={handleEditEmployee}
            inductionPrograms={inductionPrograms}
          />
        )}
      </div>
    </>
  );
};

export default InductionOrientation;