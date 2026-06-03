import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  Edit,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Zap,
  Bot,
  Brain,
  Sparkles,
  Target,
  Users,
  FileText,
  Calculator,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Settings,
  MoreVertical,
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Bell,
  UserCheck,
  FileCheck,
  Mail,
  Phone,
  Briefcase,
  Award,
  Crown,
  X,
  Check,
  File,
  Trash2,
  Copy,
  Share2,
  Info,
  Star,
  Heart,
  FolderPlus,
  Upload,
  Save,
  Lock,
  Unlock,
  Volume2,
  Mic,
  Video,
  PhoneCall,
  MapPin,
  Globe,
  Link,
  FileUp,
  UserX,
  Scale,
  CalendarDays
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NoticePeriodTracking = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCases, setSelectedCases] = useState([]);
  const [showResignationModal, setShowResignationModal] = useState(false);
  const [showBuyoutModal, setShowBuyoutModal] = useState(false);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false);
  const [showHRInterviewModal, setShowHRInterviewModal] = useState(false);
  const [showExitFormalitiesModal, setShowExitFormalitiesModal] = useState(false);
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [aiChatMessage, setAiChatMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [lwdDate, setLwdDate] = useState('');
  const [buyoutAmount, setBuyoutAmount] = useState(0);
  const [shortfallAmount, setShortfallAmount] = useState(0);

  // New states for added functionality
  const [showAIFilterModal, setShowAIFilterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [viewingCase, setViewingCase] = useState(null);

  // Filtered cases state
  const [filteredCases, setFilteredCases] = useState([]);

  // AI Filter states
  const [aiFilterCriteria, setAiFilterCriteria] = useState({
    riskLevel: 'all',
    department: 'all',
    daysRemaining: 'all',
    status: 'all',
    hasPendingActions: false,
    highPriority: false
  });

  // Calculator states
  const [calculatorData, setCalculatorData] = useState({
    resignationDate: new Date().toISOString().split('T')[0],
    noticePeriod: '60',
    monthlySalary: '₹1,50,000',
    buyoutDays: '30',
    currentLWD: '',
    extensionDays: '15',
    waiverDays: '15'
  });

  // Calculator results state
  const [calculatorResults, setCalculatorResults] = useState({
    lwdResult: '',
    buyoutResult: '',
    extensionResult: '',
    daysRemainingResult: '',
    waiverResult: ''
  });

  const [automationStatus, setAutomationStatus] = useState({
    resignationWorkflow: true,
    autoCalculation: true,
    smartNotifications: true,
    predictiveAnalytics: true,
    autoApprovals: false
  });

  // ==================== DATA ====================
  const menuItems = [
    { title: 'Dashboard', link: '/recruiter/dashboard', active: false },
    { title: 'Job Openings', link: '/recruiter/jobs', active: false },
    { title: 'Candidates', link: '/recruiter/candidates' },
    { title: 'Interviews', link: '/recruiter/interviews' },
    { title: 'Pre-Joining', link: '/recruiter/pre-joining' },
    { title: 'Onboarding', link: '/recruiter/onboarding' },
    { title: 'Reports', link: '/recruiter/reports' },
    { title: 'Exit Management', link: '/recruiter/exit-management', active: true }
  ];

  const userInfo = {
    name: 'Sarah Johnson',
    role: 'HR Head',
    email: 'sarah.johnson@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  };

  const [noticePeriodCases, setNoticePeriodCases] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      department: 'Engineering',
      role: 'Senior Software Engineer',
      resignationDate: '2024-03-01',
      submittedDate: '2024-02-28',
      noticePeriod: '60 days',
      noticePeriodDays: 60,
      lastWorkingDay: '2024-04-30',
      daysRemaining: 15,
      status: 'Active',
      managerAcknowledged: true,
      managerAckDate: '2024-03-01',
      managerEmail: 'manager@company.com',
      hrInterviewScheduled: '2024-03-05',
      hrInterviewCompleted: false,
      counterOfferStatus: 'Pending',
      buyoutRequested: false,
      waiverRequested: false,
      extensionRequested: false,
      retentionAttempted: true,
      retentionSuccess: false,
      resignationReason: 'Better opportunity',
      resignationComments: 'Received offer with 40% hike',
      exitInterviewScheduled: false,
      acceptanceLetterSent: false,
      exitFormalitiesStarted: false,
      dailyTracker: [
        { date: '2024-03-01', status: 'Resignation Submitted', completed: true },
        { date: '2024-03-02', status: 'Manager Acknowledged', completed: true },
        { date: '2024-03-05', status: 'HR Interview', completed: false }
      ]
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Priya Patel',
      department: 'Marketing',
      role: 'Marketing Manager',
      resignationDate: '2024-02-25',
      submittedDate: '2024-02-24',
      noticePeriod: '45 days',
      noticePeriodDays: 45,
      lastWorkingDay: '2024-04-10',
      daysRemaining: 0,
      status: 'Completed',
      managerAcknowledged: true,
      managerAckDate: '2024-02-26',
      managerEmail: 'marketing.head@company.com',
      hrInterviewScheduled: '2024-02-28',
      hrInterviewCompleted: true,
      counterOfferStatus: 'Accepted',
      buyoutRequested: true,
      waiverRequested: false,
      extensionRequested: false,
      retentionAttempted: true,
      retentionSuccess: true,
      resignationReason: 'Career growth',
      resignationComments: 'Leadership role opportunity',
      exitInterviewScheduled: true,
      acceptanceLetterSent: true,
      exitFormalitiesStarted: true,
      dailyTracker: [
        { date: '2024-02-24', status: 'Resignation Submitted', completed: true },
        { date: '2024-02-26', status: 'Manager Acknowledged', completed: true },
        { date: '2024-02-28', status: 'HR Interview', completed: true },
        { date: '2024-03-01', status: 'Counter Offer Accepted', completed: true },
        { date: '2024-04-10', status: 'Exit Completed', completed: true }
      ]
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Amit Kumar',
      department: 'Sales',
      role: 'Sales Executive',
      resignationDate: '2024-03-05',
      submittedDate: '2024-03-05',
      noticePeriod: '30 days',
      noticePeriodDays: 30,
      lastWorkingDay: '2024-04-04',
      daysRemaining: 25,
      status: 'Active',
      managerAcknowledged: false,
      managerAckDate: null,
      managerEmail: 'sales.head@company.com',
      hrInterviewScheduled: null,
      hrInterviewCompleted: false,
      counterOfferStatus: 'Not Started',
      buyoutRequested: false,
      waiverRequested: false,
      extensionRequested: false,
      retentionAttempted: false,
      retentionSuccess: false,
      resignationReason: 'Relocation',
      resignationComments: 'Moving to another city',
      exitInterviewScheduled: false,
      acceptanceLetterSent: false,
      exitFormalitiesStarted: false,
      dailyTracker: [
        { date: '2024-03-05', status: 'Resignation Submitted', completed: true }
      ]
    },
    {
      id: 4,
      employeeId: 'EMP004',
      employeeName: 'Sneha Reddy',
      department: 'HR',
      role: 'HR Executive',
      resignationDate: '2024-03-10',
      submittedDate: '2024-03-09',
      noticePeriod: '60 days',
      noticePeriodDays: 60,
      lastWorkingDay: '2024-05-09',
      daysRemaining: 45,
      status: 'Active',
      managerAcknowledged: false,
      managerAckDate: null,
      managerEmail: 'hr.head@company.com',
      hrInterviewScheduled: null,
      hrInterviewCompleted: false,
      counterOfferStatus: 'Not Started',
      buyoutRequested: false,
      waiverRequested: true,
      extensionRequested: false,
      retentionAttempted: false,
      retentionSuccess: false,
      resignationReason: 'Higher studies',
      resignationComments: 'Pursuing MBA abroad',
      exitInterviewScheduled: false,
      acceptanceLetterSent: false,
      exitFormalitiesStarted: false,
      dailyTracker: [
        { date: '2024-03-09', status: 'Resignation Submitted', completed: true }
      ]
    }
  ]);

  // Initialize filtered cases
  useEffect(() => {
    setFilteredCases([...noticePeriodCases]);
  }, []);

  // Update filtered cases when search term or filter criteria changes
  useEffect(() => {
    let filtered = [...noticePeriodCases];

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(caseItem =>
        caseItem.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply AI filter criteria
    filtered = applyAIFilters(filtered, aiFilterCriteria);

    setFilteredCases(filtered);
  }, [searchTerm, noticePeriodCases, aiFilterCriteria]);

  const [buyoutRequests, setBuyoutRequests] = useState([
    {
      id: 1,
      employeeId: 'EMP005',
      employeeName: 'Rajesh Verma',
      department: 'Finance',
      buyoutAmount: '₹75,000',
      requestedDate: '2024-03-05',
      status: 'Pending',
      approvalLevel: 'Manager',
      reason: 'Early joining at new company',
      daysToBuyout: 45,
      monthlySalary: '₹2,00,000',
      calculatedAmount: '₹75,000',
      approvedByManager: false,
      approvedByHR: false,
      approvedByFinance: false
    }
  ]);

  const [waiverRequests, setWaiverRequests] = useState([
    {
      id: 1,
      employeeId: 'EMP004',
      employeeName: 'Sneha Reddy',
      department: 'HR',
      requestedDate: '2024-03-10',
      status: 'Pending',
      reason: 'University admission deadline approaching',
      supportingDocs: ['Admission_Letter.pdf', 'Visa_Application.pdf', 'Fee_Receipt.pdf'],
      waiverDays: 30,
      waiverReason: 'Higher studies abroad',
      waiverDetails: 'MBA program starting in May 2024',
      approvedByManager: false,
      approvedByHR: false,
      approvedByDirector: false
    },
    {
      id: 2,
      employeeId: 'EMP006',
      employeeName: 'Arjun Mehta',
      department: 'Engineering',
      requestedDate: '2024-03-08',
      status: 'Approved',
      reason: 'Medical emergency in family',
      supportingDocs: ['Medical_Certificate.pdf', 'Doctor_Note.pdf'],
      waiverDays: 20,
      waiverReason: 'Family emergency',
      waiverDetails: 'Father undergoing heart surgery',
      approvedByManager: true,
      approvedByHR: true,
      approvedByDirector: true
    }
  ]);

  const [counterOffers, setCounterOffers] = useState([
    {
      id: 1,
      employeeId: 'EMP002',
      employeeName: 'Priya Patel',
      department: 'Marketing',
      offeredSalary: '₹18,00,000',
      currentSalary: '₹14,40,000',
      salaryHike: '25%',
      additionalBenefits: 'Performance bonus, Stock options, Flexible hours',
      status: 'Accepted',
      decisionDate: '2024-03-01',
      retentionProbability: '85%',
      managerApproved: true,
      hrApproved: true,
      offeredRole: 'Senior Marketing Manager',
      counterOfferDate: '2024-02-28',
      employeeResponse: 'Accepted with gratitude',
      notes: 'Employee was looking for career growth, offered leadership role'
    },
    {
      id: 2,
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      department: 'Engineering',
      offeredSalary: '₹25,00,000',
      currentSalary: '₹18,00,000',
      salaryHike: '38%',
      additionalBenefits: 'Remote work option, Additional leave, Conference budget',
      status: 'Pending',
      decisionDate: null,
      retentionProbability: '65%',
      managerApproved: false,
      hrApproved: false,
      offeredRole: 'Tech Lead',
      counterOfferDate: '2024-03-03',
      employeeResponse: 'Considering the offer',
      notes: 'Employee has competing offer from FAANG company'
    },
    {
      id: 3,
      employeeId: 'EMP007',
      employeeName: 'Kavya Singh',
      department: 'Product',
      offeredSalary: '₹22,00,000',
      currentSalary: '₹17,00,000',
      salaryHike: '29%',
      additionalBenefits: 'Product ownership, Team lead role',
      status: 'Rejected',
      decisionDate: '2024-03-05',
      retentionProbability: '45%',
      managerApproved: true,
      hrApproved: true,
      offeredRole: 'Product Lead',
      counterOfferDate: '2024-03-01',
      employeeResponse: 'Declined - pursuing entrepreneurship',
      notes: 'Employee starting own startup, not interested in counter offer'
    }
  ]);

  const [extensionRequests, setExtensionRequests] = useState([
    {
      id: 1,
      employeeId: 'EMP003',
      employeeName: 'Amit Kumar',
      department: 'Sales',
      currentLWD: '2024-04-04',
      requestedLWD: '2024-04-18',
      extensionDays: 14,
      reason: 'Project handover requires more time',
      status: 'Pending',
      managerApproval: 'Pending',
      hrApproval: 'Pending',
      extensionReason: 'Critical project transition',
      extensionDetails: 'Training new team member on key accounts',
      approvedByManager: false,
      approvedByHR: false
    },
    {
      id: 2,
      employeeId: 'EMP008',
      employeeName: 'Neha Gupta',
      department: 'Operations',
      currentLWD: '2024-04-15',
      requestedLWD: '2024-05-01',
      extensionDays: 16,
      reason: 'Client project completion',
      status: 'Approved',
      managerApproval: 'Approved',
      hrApproval: 'Approved',
      extensionReason: 'Client request for continuity',
      extensionDetails: 'Key client requested employee to stay until project completion',
      approvedByManager: true,
      approvedByHR: true
    }
  ]);

  const resignationReasons = [
    'Better opportunity',
    'Career growth',
    'Higher studies',
    'Relocation',
    'Personal reasons',
    'Health issues',
    'Work-life balance',
    'Compensation',
    'Management issues',
    'Retirement',
    'Entrepreneurship',
    'Other'
  ];

  const aiPredictions = {
    highRiskDepartments: ['Engineering', 'Sales'],
    predictedResignations: 3,
    avgNoticePeriod: '54 days',
    retentionSuccessRate: '68%',
    riskFactors: ['Compensation gap', 'Career growth', 'Workload']
  };

  const aiInsights = [
    {
      id: 1,
      type: 'risk',
      title: 'Engineering Department High Risk',
      description: '45% higher resignation rate than company average',
      confidence: '92%',
      recommendedAction: 'Conduct retention workshops',
      icon: <AlertCircle className="text-danger" />
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'Counter Offer Success High',
      description: '78% acceptance rate for offers above 20% hike',
      confidence: '88%',
      recommendedAction: 'Pre-approve counter offer budget',
      icon: <TrendingUp className="text-success" />
    },
    {
      id: 3,
      type: 'efficiency',
      title: 'Automate 60% of Workflows',
      description: 'AI can automate interview scheduling and follow-ups',
      confidence: '95%',
      recommendedAction: 'Enable smart automation',
      icon: <Zap className="text-warning" />
    }
  ];

  const statistics = {
    totalActiveCases: noticePeriodCases.filter(c => c.status === 'Active').length,
    pendingManagerAck: noticePeriodCases.filter(c => c.status === 'Active' && !c.managerAcknowledged).length,
    pendingBuyout: buyoutRequests.filter(r => r.status === 'Pending').length,
    pendingWaiver: waiverRequests.filter(r => r.status === 'Pending').length,
    pendingCounter: counterOffers.filter(r => r.status === 'Pending').length,
    averageNoticeDays: 56,
    retentionSuccess: 2,
    todayResignations: 1,
    weekResignations: 3,
    autoProcessed: 12,
    timeSaved: '42 hours'
  };

  // ==================== UTILITY FUNCTIONS ====================
  const calculateLastWorkingDay = (resignationDate, noticePeriodDays) => {
    const date = new Date(resignationDate);
    date.setDate(date.getDate() + parseInt(noticePeriodDays));
    return date.toISOString().split('T')[0];
  };

  const calculateDaysRemaining = (lastWorkingDay) => {
    const today = new Date();
    const lwd = new Date(lastWorkingDay);
    const diffTime = lwd - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const calculateBuyoutAmount = (monthlySalary, daysToBuyout) => {
    const salary = parseInt(monthlySalary.replace(/[^0-9]/g, ''));
    const dailyRate = salary / 30;
    return Math.round(dailyRate * daysToBuyout);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <span className="badge bg-warning text-dark">Active</span>;
      case 'Completed': return <span className="badge bg-success">Completed</span>;
      case 'Pending': return <span className="badge bg-secondary">Pending</span>;
      case 'Approved': return <span className="badge bg-success">Approved</span>;
      case 'Rejected': return <span className="badge bg-danger">Rejected</span>;
      case 'Accepted': return <span className="badge bg-success">Accepted</span>;
      case 'Not Started': return <span className="badge bg-light text-dark">Not Started</span>;
      default: return <span className="badge bg-info">{status}</span>;
    }
  };

  const getRiskLevel = (daysRemaining) => {
    if (daysRemaining <= 7) return { level: 'High', color: 'danger' };
    if (daysRemaining <= 14) return { level: 'Medium', color: 'warning' };
    return { level: 'Low', color: 'success' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // ==================== NOTIFICATION FUNCTIONS ====================
  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    alert(`${type.toUpperCase()}: ${message}`);
  };

  // ==================== FILTER FUNCTIONS ====================
  const applyAIFilters = (cases, criteria) => {
    let filtered = [...cases];

    if (criteria.riskLevel !== 'all') {
      filtered = filtered.filter(caseItem => {
        const risk = getRiskLevel(caseItem.daysRemaining);
        return risk.level === criteria.riskLevel;
      });
    }

    if (criteria.department !== 'all') {
      filtered = filtered.filter(caseItem =>
        caseItem.department === criteria.department
      );
    }

    if (criteria.daysRemaining !== 'all') {
      switch (criteria.daysRemaining) {
        case 'critical':
          filtered = filtered.filter(c => c.daysRemaining <= 7);
          break;
        case 'urgent':
          filtered = filtered.filter(c => c.daysRemaining <= 14);
          break;
        case 'moderate':
          filtered = filtered.filter(c => c.daysRemaining > 14 && c.daysRemaining <= 30);
          break;
        case 'normal':
          filtered = filtered.filter(c => c.daysRemaining > 30);
          break;
      }
    }

    if (criteria.status !== 'all') {
      filtered = filtered.filter(c => c.status === criteria.status);
    }

    if (criteria.hasPendingActions) {
      filtered = filtered.filter(c =>
        !c.managerAcknowledged ||
        !c.hrInterviewCompleted ||
        c.counterOfferStatus === 'Pending'
      );
    }

    if (criteria.highPriority) {
      filtered = filtered.filter(c =>
        c.daysRemaining <= 7 ||
        !c.managerAcknowledged ||
        c.resignationReason.includes('Better opportunity')
      );
    }

    return filtered;
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setAiFilterCriteria({
      riskLevel: 'all',
      department: 'all',
      daysRemaining: 'all',
      status: 'all',
      hasPendingActions: false,
      highPriority: false
    });
    showNotification('All filters cleared', 'info');
  };

  const generateAIFilterInsights = (filteredCases) => {
    if (filteredCases.length === 0) return "No cases match your criteria.";

    const insights = [];
    const highRiskCount = filteredCases.filter(c => c.daysRemaining <= 7).length;
    const pendingManagerAck = filteredCases.filter(c => !c.managerAcknowledged).length;
    const pendingCounterOffers = filteredCases.filter(c => c.counterOfferStatus === 'Pending').length;

    if (highRiskCount > 0) insights.push(`${highRiskCount} high-risk cases`);
    if (pendingManagerAck > 0) insights.push(`${pendingManagerAck} pending manager acknowledgments`);
    if (pendingCounterOffers > 0) insights.push(`${pendingCounterOffers} pending counter offers`);

    return insights.length > 0 ? `Insights: ${insights.join(', ')}` : "All cases are on track.";
  };

  const handleAIFilterApply = () => {
    setSearchTerm(''); // Clear search term when applying AI filter

    const insights = generateAIFilterInsights(
      applyAIFilters(noticePeriodCases, aiFilterCriteria)
    );
    showNotification(`AI filter applied. ${insights}`, 'info');

    setShowAIFilterModal(false);
  };

  // ==================== CALCULATOR FUNCTIONS ====================
  const handleCalculateLWD = () => {
    const lastWorkingDay = calculateLastWorkingDay(calculatorData.resignationDate, parseInt(calculatorData.noticePeriod));
    setCalculatorResults(prev => ({
      ...prev,
      lwdResult: `Last Working Day: ${lastWorkingDay}`
    }));
    showNotification(`Last Working Day: ${lastWorkingDay}`, 'info');
  };

  const handleCalculateBuyout = () => {
    const amount = calculateBuyoutAmount(calculatorData.monthlySalary, parseInt(calculatorData.buyoutDays));
    setCalculatorResults(prev => ({
      ...prev,
      buyoutResult: `Buyout Amount: ${formatCurrency(amount)}`
    }));
    showNotification(`Buyout Amount: ${formatCurrency(amount)}`, 'info');
  };

  const handleCalculateExtension = () => {
    if (calculatorData.currentLWD) {
      const newLWD = new Date(new Date(calculatorData.currentLWD).getTime() + (parseInt(calculatorData.extensionDays) * 24 * 60 * 60 * 1000));
      setCalculatorResults(prev => ({
        ...prev,
        extensionResult: `New Last Working Day: ${newLWD.toISOString().split('T')[0]}`
      }));
      showNotification(`New Last Working Day: ${newLWD.toISOString().split('T')[0]}`, 'info');
    } else {
      showNotification('Please select a current LWD date', 'warning');
    }
  };

  const handleCalculateDaysRemaining = () => {
    if (lwdDate) {
      const daysRemaining = calculateDaysRemaining(lwdDate);
      setCalculatorResults(prev => ({
        ...prev,
        daysRemainingResult: `Days Remaining: ${daysRemaining} days`
      }));
      showNotification(`Days remaining until ${lwdDate}: ${daysRemaining} days`, 'info');
    } else {
      showNotification('Please select a Last Working Day', 'warning');
    }
  };

  const handleCalculateWaiver = () => {
    const newNoticePeriod = parseInt(calculatorData.noticePeriod) - parseInt(calculatorData.waiverDays);
    setCalculatorResults(prev => ({
      ...prev,
      waiverResult: `New Notice Period: ${newNoticePeriod} days`
    }));
    showNotification(`After waiver: ${newNoticePeriod} days notice period`, 'info');
  };

  // ==================== ACTION HANDLERS ====================
  const handleResignationSubmit = (formData) => {
    const lastWorkingDay = calculateLastWorkingDay(formData.resignationDate, formData.noticePeriod);
    const daysRemaining = calculateDaysRemaining(lastWorkingDay);

    const newCase = {
      id: noticePeriodCases.length + 1,
      ...formData,
      noticePeriodDays: parseInt(formData.noticePeriod),
      lastWorkingDay,
      daysRemaining,
      status: 'Active',
      managerAcknowledged: false,
      managerAckDate: null,
      hrInterviewScheduled: null,
      hrInterviewCompleted: false,
      counterOfferStatus: 'Not Started',
      buyoutRequested: false,
      waiverRequested: false,
      extensionRequested: false,
      retentionAttempted: false,
      retentionSuccess: false,
      resignationComments: '',
      exitInterviewScheduled: false,
      acceptanceLetterSent: false,
      exitFormalitiesStarted: false,
      dailyTracker: [
        { date: formData.resignationDate, status: 'Resignation Submitted', completed: true }
      ]
    };

    setNoticePeriodCases(prev => [...prev, newCase]);
    setShowResignationModal(false);
    showNotification(`Resignation submitted for ${formData.employeeName}. Last Working Day: ${lastWorkingDay}`, 'success');
  };

  const handleBuyoutRequest = (formData) => {
    const calculatedAmount = calculateBuyoutAmount(formData.monthlySalary, parseInt(formData.daysToBuyout));

    const newRequest = {
      id: buyoutRequests.length + 1,
      ...formData,
      buyoutAmount: formatCurrency(calculatedAmount),
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      approvalLevel: 'Manager',
      calculatedAmount: formatCurrency(calculatedAmount),
      approvedByManager: false,
      approvedByHR: false,
      approvedByFinance: false
    };

    setBuyoutRequests(prev => [...prev, newRequest]);

    setNoticePeriodCases(prev => prev.map(emp =>
      emp.employeeId === formData.employeeId
        ? { ...emp, buyoutRequested: true }
        : emp
    ));

    setShowBuyoutModal(false);
    showNotification(`Buyout request submitted for ${formData.employeeName}. Amount: ${formatCurrency(calculatedAmount)}`, 'success');
  };

  const handleWaiverRequest = (formData) => {
    const newRequest = {
      id: waiverRequests.length + 1,
      ...formData,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      approvedByManager: false,
      approvedByHR: false,
      approvedByDirector: false
    };

    setWaiverRequests(prev => [...prev, newRequest]);

    setNoticePeriodCases(prev => prev.map(emp =>
      emp.employeeId === formData.employeeId
        ? { ...emp, waiverRequested: true }
        : emp
    ));

    setShowWaiverModal(false);
    showNotification(`Waiver request submitted for ${formData.employeeName}`, 'success');
  };

  const handleWaiverApprove = (id) => {
    setWaiverRequests(prev => prev.map(req =>
      req.id === id
        ? {
          ...req,
          status: 'Approved',
          approvedByManager: true,
          approvedByHR: true,
          approvedByDirector: true
        }
        : req
    ));

    const waiver = waiverRequests.find(w => w.id === id);
    if (waiver) {
      const employee = noticePeriodCases.find(e => e.employeeId === waiver.employeeId);
      if (employee) {
        const newLWD = new Date(employee.lastWorkingDay);
        newLWD.setDate(newLWD.getDate() - waiver.waiverDays);
        const updatedEmployee = {
          ...employee,
          lastWorkingDay: newLWD.toISOString().split('T')[0],
          daysRemaining: calculateDaysRemaining(newLWD.toISOString().split('T')[0])
        };
        setNoticePeriodCases(prev => prev.map(e =>
          e.id === employee.id ? updatedEmployee : e
        ));
      }
    }

    showNotification('Waiver request approved and notice period updated', 'success');
  };

  const handleWaiverReject = (id) => {
    setWaiverRequests(prev => prev.map(req =>
      req.id === id
        ? { ...req, status: 'Rejected' }
        : req
    ));
    showNotification('Waiver request rejected', 'warning');
  };

  const handleCounterOffer = (formData) => {
    const hikePercentage = ((parseInt(formData.offeredSalary.replace(/[^0-9]/g, '')) -
      parseInt(formData.currentSalary.replace(/[^0-9]/g, ''))) /
      parseInt(formData.currentSalary.replace(/[^0-9]/g, ''))) * 100;

    const newOffer = {
      id: counterOffers.length + 1,
      ...formData,
      salaryHike: `${Math.round(hikePercentage)}%`,
      status: 'Pending',
      decisionDate: null,
      retentionProbability: `${Math.min(90, Math.round(hikePercentage * 2))}%`,
      managerApproved: false,
      hrApproved: false,
      counterOfferDate: new Date().toISOString().split('T')[0]
    };

    setCounterOffers(prev => [...prev, newOffer]);

    setNoticePeriodCases(prev => prev.map(emp =>
      emp.employeeId === formData.employeeId
        ? {
          ...emp,
          counterOfferStatus: 'Pending',
          retentionAttempted: true
        }
        : emp
    ));

    setShowCounterOfferModal(false);
    showNotification(`Counter offer submitted for ${formData.employeeName} with ${Math.round(hikePercentage)}% hike`, 'success');
  };

  const handleCounterOfferApprove = (id) => {
    setCounterOffers(prev => prev.map(offer =>
      offer.id === id
        ? {
          ...offer,
          status: 'Accepted',
          decisionDate: new Date().toISOString().split('T')[0],
          managerApproved: true,
          hrApproved: true
        }
        : offer
    ));

    const offer = counterOffers.find(c => c.id === id);
    if (offer) {
      setNoticePeriodCases(prev => prev.map(emp =>
        emp.employeeId === offer.employeeId
          ? {
            ...emp,
            counterOfferStatus: 'Accepted',
            retentionSuccess: true,
            status: 'Withdrawn'
          }
          : emp
      ));
    }

    showNotification('Counter offer accepted and employee retention successful', 'success');
  };

  const handleCounterOfferReject = (id) => {
    setCounterOffers(prev => prev.map(offer =>
      offer.id === id
        ? {
          ...offer,
          status: 'Rejected',
          decisionDate: new Date().toISOString().split('T')[0]
        }
        : offer
    ));
    showNotification('Counter offer rejected', 'warning');
  };

  const handleExtensionRequest = (formData) => {
    const currentLWD = new Date(formData.currentLWD);
    const requestedLWD = new Date(formData.requestedLWD);
    const extensionDays = Math.ceil((requestedLWD - currentLWD) / (1000 * 60 * 60 * 24));

    const newRequest = {
      id: extensionRequests.length + 1,
      ...formData,
      extensionDays,
      status: 'Pending',
      managerApproval: 'Pending',
      hrApproval: 'Pending',
      approvedByManager: false,
      approvedByHR: false
    };

    setExtensionRequests(prev => [...prev, newRequest]);

    setNoticePeriodCases(prev => prev.map(emp =>
      emp.employeeId === formData.employeeId
        ? {
          ...emp,
          extensionRequested: true,
          lastWorkingDay: formData.requestedLWD,
          daysRemaining: calculateDaysRemaining(formData.requestedLWD)
        }
        : emp
    ));

    setShowExtensionModal(false);
    showNotification(`Extension request submitted for ${formData.employeeName}. New LWD: ${formData.requestedLWD}`, 'success');
  };

  const handleExtensionApprove = (id) => {
    setExtensionRequests(prev => prev.map(req =>
      req.id === id
        ? {
          ...req,
          status: 'Approved',
          managerApproval: 'Approved',
          hrApproval: 'Approved',
          approvedByManager: true,
          approvedByHR: true
        }
        : req
    ));
    showNotification('Extension request approved', 'success');
  };

  const handleExtensionReject = (id) => {
    setExtensionRequests(prev => prev.map(req =>
      req.id === id
        ? {
          ...req,
          status: 'Rejected',
          managerApproval: 'Rejected',
          hrApproval: 'Rejected'
        }
        : req
    ));

    const extension = extensionRequests.find(e => e.id === id);
    if (extension) {
      const employee = noticePeriodCases.find(e => e.employeeId === extension.employeeId);
      if (employee) {
        setNoticePeriodCases(prev => prev.map(e =>
          e.id === employee.id
            ? {
              ...e,
              lastWorkingDay: extension.currentLWD,
              daysRemaining: calculateDaysRemaining(extension.currentLWD)
            }
            : e
        ));
      }
    }

    showNotification('Extension request rejected', 'warning');
  };

  const handleSendAcceptanceLetter = () => {
    if (selectedEmployee) {
      const updatedCases = noticePeriodCases.map(caseItem =>
        caseItem.id === selectedEmployee.id
          ? { ...caseItem, acceptanceLetterSent: true }
          : caseItem
      );
      setNoticePeriodCases(updatedCases);
      setShowAcceptanceModal(false);
      showNotification(`Acceptance letter sent to ${selectedEmployee.employeeName}`, 'success');
    }
  };

  const handleManagerAcknowledgment = (caseId) => {
    const updatedCases = noticePeriodCases.map(caseItem =>
      caseItem.id === caseId
        ? {
          ...caseItem,
          managerAcknowledged: true,
          managerAckDate: new Date().toISOString().split('T')[0]
        }
        : caseItem
    );
    setNoticePeriodCases(updatedCases);
    showNotification('Manager acknowledgment recorded', 'success');
  };

  const handleScheduleHRInterview = (caseId, date) => {
    const updatedCases = noticePeriodCases.map(caseItem =>
      caseItem.id === caseId
        ? { ...caseItem, hrInterviewScheduled: date }
        : caseItem
    );
    setNoticePeriodCases(updatedCases);
    setShowHRInterviewModal(false);
    showNotification(`HR Interview scheduled for ${date}`, 'success');
  };

  const handleStartExitFormalities = (caseId) => {
    const updatedCases = noticePeriodCases.map(caseItem =>
      caseItem.id === caseId
        ? { ...caseItem, exitFormalitiesStarted: true }
        : caseItem
    );
    setNoticePeriodCases(updatedCases);
    setShowExitFormalitiesModal(false);
    showNotification('Exit formalities started', 'success');
  };

  const handleRetentionConversation = (caseId) => {
    const updatedCases = noticePeriodCases.map(caseItem =>
      caseItem.id === caseId
        ? { ...caseItem, retentionAttempted: true }
        : caseItem
    );
    setNoticePeriodCases(updatedCases);
    setShowRetentionModal(false);
    showNotification('Retention conversation recorded', 'success');
  };

  const handleExportReports = () => {
    const data = {
      noticePeriodCases,
      buyoutRequests,
      waiverRequests,
      counterOffers,
      extensionRequests,
      statistics,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notice-period-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportModal(false);
    showNotification('Report exported successfully', 'success');
  };

  const handlePrintReport = () => {
    window.print();
    showNotification('Printing report...', 'info');
  };

  const handleSendReminders = () => {
    const pendingCases = noticePeriodCases.filter(c =>
      c.status === 'Active' && !c.managerAcknowledged
    );

    if (pendingCases.length > 0) {
      showNotification(`Reminders sent to ${pendingCases.length} managers`, 'info');
    } else {
      showNotification('No pending acknowledgments', 'info');
    }
  };

  const handleRefreshData = () => {
    showNotification('Data refreshed successfully', 'success');
  };

  // Calculator handler
  const handleCalculatorChange = (field, value) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ==================== EDIT FUNCTIONS ====================
  const handleEditCase = (caseItem) => {
    setEditingCase(caseItem);
    setShowEditModal(true);
  };

  const handleUpdateCase = (updatedData) => {
    setNoticePeriodCases(prev => prev.map(caseItem =>
      caseItem.id === editingCase.id ? { ...caseItem, ...updatedData } : caseItem
    ));
    setShowEditModal(false);
    setEditingCase(null);
    showNotification('Case updated successfully', 'success');
  };

  // ==================== VIEW FUNCTIONS ====================
  const handleViewCase = (caseItem) => {
    setViewingCase(caseItem);
    setShowViewModal(true);
  };

  // ==================== DELETE FUNCTION ====================
  const handleDeleteCase = (caseId) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      setNoticePeriodCases(prev => prev.filter(caseItem => caseItem.id !== caseId));
      showNotification('Case deleted successfully', 'success');
    }
  };

  const handleAddEmployee = (employeeData) => {
    // Calculate last working day
    const lastWorkingDay = calculateLastWorkingDay(
      employeeData.resignationDate,
      employeeData.noticePeriodDays
    );

    // Calculate days remaining
    const daysRemaining = calculateDaysRemaining(lastWorkingDay);

    const newCase = {
      id: noticePeriodCases.length + 1,
      employeeId: `EMP${String(noticePeriodCases.length + 1).padStart(3, '0')}`,
      ...employeeData,
      lastWorkingDay: lastWorkingDay,
      daysRemaining: daysRemaining,
      noticePeriod: `${employeeData.noticePeriodDays} days`,
      status: 'Active',
      managerAcknowledged: false,
      hrInterviewCompleted: false,
      counterOfferStatus: 'Not Started',
      buyoutRequested: false,
      waiverRequested: false,
      extensionRequested: false,
      retentionAttempted: false,
      retentionSuccess: false,
      exitInterviewScheduled: false,
      acceptanceLetterSent: false,
      exitFormalitiesStarted: false,
      dailyTracker: [
        { date: employeeData.resignationDate, status: 'Resignation Submitted', completed: true }
      ]
    };

    setNoticePeriodCases(prev => [...prev, newCase]);
    setShowAddEmployeeModal(false);
    showNotification(`New employee ${employeeData.employeeName} added successfully`, 'success');
  };

  // ==================== BUYOUT FUNCTIONS ====================
  const handleBuyoutApprove = (id) => {
    setBuyoutRequests(prev => prev.map(req =>
      req.id === id
        ? {
          ...req,
          status: 'Approved',
          approvedByManager: true,
          approvedByHR: true,
          approvedByFinance: true
        }
        : req
    ));
    showNotification('Buyout request approved', 'success');
  };

  const handleBuyoutReject = (id) => {
    setBuyoutRequests(prev => prev.map(req =>
      req.id === id
        ? { ...req, status: 'Rejected' }
        : req
    ));
    showNotification('Buyout request rejected', 'warning');
  };

  // ==================== RENDER ACTION BUTTONS ====================
  const renderActionButtons = (caseItem) => {
    return (
      <div className="btn-group btn-group-sm">
        <button
          className="btn btn-outline-warning"
          onClick={() => handleEditCase(caseItem)}
          title="Edit"
        >
          <Edit size={12} />
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => handleViewCase(caseItem)}
          title="View Details"
        >
          <Eye size={12} />
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={() => handleDeleteCase(caseItem.id)}
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
        <button
          className="btn btn-outline-success"
          onClick={() => {
            setSelectedEmployee(caseItem);
            setShowAcceptanceModal(true);
          }}
          disabled={caseItem.acceptanceLetterSent}
          title="Send Acceptance Letter"
        >
          <FileCheck size={12} />
        </button>
      </div>
    );
  };

  const renderRequestActionButtons = (item, type) => {
    return (
      <div className="btn-group btn-group-sm">
        {type === 'buyout' && item.status === 'Pending' && (
          <>
            <button
              className="btn btn-outline-success"
              onClick={() => handleBuyoutApprove(item.id)}
              title="Approve"
            >
              <Check size={12} />
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleBuyoutReject(item.id)}
              title="Reject"
            >
              <X size={12} />
            </button>
          </>
        )}

        {type === 'waiver' && item.status === 'Pending' && (
          <>
            <button
              className="btn btn-outline-success"
              onClick={() => handleWaiverApprove(item.id)}
              title="Approve"
            >
              <Check size={12} />
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleWaiverReject(item.id)}
              title="Reject"
            >
              <X size={12} />
            </button>
          </>
        )}

        {type === 'counter' && item.status === 'Pending' && (
          <>
            <button
              className="btn btn-outline-success"
              onClick={() => handleCounterOfferApprove(item.id)}
              title="Approve"
            >
              <Check size={12} />
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleCounterOfferReject(item.id)}
              title="Reject"
            >
              <X size={12} />
            </button>
          </>
        )}

        {type === 'extension' && item.status === 'Pending' && (
          <>
            <button
              className="btn btn-outline-success"
              onClick={() => handleExtensionApprove(item.id)}
              title="Approve"
            >
              <Check size={12} />
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleExtensionReject(item.id)}
              title="Reject"
            >
              <X size={12} />
            </button>
          </>
        )}

        {/* View details button for all */}
        <button
          className="btn btn-outline-info"
          onClick={() => {
            setViewingCase(item);
            setShowViewModal(true);
          }}
          title="View Details"
        >
          <Eye size={12} />
        </button>
      </div>
    );
  };

  // ==================== MODAL COMPONENTS ====================

  const ResignationSubmissionModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      employeeName: '',
      department: 'Engineering',
      role: '',
      resignationDate: new Date().toISOString().split('T')[0],
      noticePeriod: '60',
      resignationReason: '',
      comments: '',
      managerEmail: ''
    });

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                Online Resignation Submission
              </h5>
              <button className="btn-close" onClick={() => setShowResignationModal(false)}></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Employee ID <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    required
                    placeholder="EMPXXX"
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Employee Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label fw" style={{ color: "#000" }}>Department <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Role <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Resignation Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.resignationDate}
                    onChange={(e) => setFormData({ ...formData, resignationDate: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">Notice Period <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                    required
                  >
                    <option value="30">30 Days</option>
                    <option value="45">45 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Resignation Reason <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  value={formData.resignationReason}
                  onChange={(e) => setFormData({ ...formData, resignationReason: e.target.value })}
                  required
                >
                  <option value="">Select Reason</option>
                  {resignationReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Additional Comments</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Provide additional details or feedback..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Reporting Manager Email <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.managerEmail}
                  onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                  required
                  placeholder="manager@company.com"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowResignationModal(false)}>
                Cancel
              </button>

              <button
                className="btn d-flex align-items-center"
                style={{ backgroundColor: '#083ed2', color: '#fff' }}
                onClick={() => handleResignationSubmit(formData)}
                disabled={!formData.employeeId || !formData.employeeName || !formData.department || !formData.role}
              >
                <Send size={16} className="me-2" />
                Submit Resignation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BuyoutRequestModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      employeeName: '',
      department: '',
      monthlySalary: '',
      daysToBuyout: '',
      reason: '',
      urgency: 'Normal'
    });

    const calculatedAmount = formData.monthlySalary && formData.daysToBuyout
      ? calculateBuyoutAmount(formData.monthlySalary, parseInt(formData.daysToBuyout))
      : 0;

    return (
      <div className="modal show d-block bg-dark bg-opacity-50">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg rounded-4">

            {/* ================= HEADER ================= */}
            <div className="modal-header bg-light">
              <h4 className="modal-title fw-bold text-dark">
                Notice Period Buyout Request
              </h4>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowBuyoutModal(false)}
              ></button>
            </div>

            {/* ================= BODY ================= */}
            <div className="modal-body">

              {/* Info */}
              <div className="alert alert-info fw-semibold">
                <strong>AI Calculation:</strong>{" "}
                Buyout amount = (Monthly Salary ÷ 30) × Days to Buyout
              </div>

              {/* Select Employee */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Select Employee <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.employeeId}
                  onChange={(e) => {
                    const employee = noticePeriodCases.find(
                      c => c.employeeId === e.target.value
                    );
                    setFormData({
                      ...formData,
                      employeeId: e.target.value,
                      employeeName: employee?.employeeName || "",
                      department: employee?.department || "",
                    });
                  }}
                  required
                >
                  <option value="">Select Employee</option>
                  {noticePeriodCases
                    .filter(c => c.status === "Active")
                    .map(employee => (
                      <option key={employee.id} value={employee.employeeId}>
                        {employee.employeeName} ({employee.employeeId}) – {employee.department}
                      </option>
                    ))}
                </select>
              </div>

              {/* Salary & Days */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Monthly Salary (₹) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.monthlySalary}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlySalary: e.target.value })
                    }
                    placeholder="₹1,50,000"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Days to Buyout <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.daysToBuyout}
                    onChange={(e) =>
                      setFormData({ ...formData, daysToBuyout: e.target.value })
                    }
                    placeholder="30"
                    required
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Reason for Buyout <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Explain why buyout is required..."
                  required
                />
              </div>

              {/* Urgency */}
              <div className="mb-4">
                <label className="form-label fw-bold">Urgency Level</label>
                <select
                  className="form-select"
                  value={formData.urgency}
                  onChange={(e) =>
                    setFormData({ ...formData, urgency: e.target.value })
                  }
                >
                  <option value="Normal">Normal (7 days approval)</option>
                  <option value="High">High (3 days approval)</option>
                  <option value="Urgent">Urgent (24 hours approval)</option>
                </select>
              </div>

              {/* ================= BUYOUT SUMMARY ================= */}
              <div className="d-flex justify-content-center">
                <div className="card w-100 shadow-sm" style={{ maxWidth: "520px" }}>
                  <div className="card-body">

                    <h6 className="fw-bold text-center mb-3">
                      Buyout Summary
                    </h6>

                    <div className="row text-center">
                      {/* Amount */}
                      <div className="col-6 mb-3">
                        <small className="text-muted d-block">
                          Calculated Amount
                        </small>
                        <div className="h4 fw-bold text-success mt-2">
                          {formatCurrency(calculatedAmount)}
                        </div>
                      </div>

                      {/* Approval Workflow */}
                      <div className="col-6 mb-3">
                        <small className="text-muted d-block mb-2">
                          Approval Workflow
                        </small>

                        <div className="bg-light rounded-3 p-2">
                          <div className="badge bg-primary w-100 mb-1">
                            Manager Approval
                          </div>
                          <div className="badge bg-info text-dark w-100 mb-1">
                            HR Approval
                          </div>
                          <div className="badge bg-success w-100">
                            Finance Approval
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* ================= FOOTER ================= */}
            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowBuyoutModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary fw-bold"
                onClick={() => handleBuyoutRequest(formData)}
                disabled={
                  !formData.employeeId ||
                  !formData.monthlySalary ||
                  !formData.daysToBuyout ||
                  !formData.reason
                }
              >
                Submit for Approval
              </button>
            </div>

          </div>
        </div>
      </div>

    );
  };

  const WaiverRequestModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      employeeName: '',
      department: '',
      waiverDays: '',
      waiverReason: '',
      waiverDetails: '',
      supportingDocs: []
    });

    const [docName, setDocName] = useState('');

    const addDocument = () => {
      if (docName.trim()) {
        setFormData(prev => ({
          ...prev,
          supportingDocs: [...prev.supportingDocs, `${docName}.pdf`]
        }));
        setDocName('');
      }
    };

    const removeDocument = (index) => {
      setFormData(prev => ({
        ...prev,
        supportingDocs: prev.supportingDocs.filter((_, i) => i !== index)
      }));
    };

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                Notice Period Waiver Request
              </h5>
              <button
                className="btn-close"
                onClick={() => setShowWaiverModal(false)}
              ></button>
            </div>

            <div className="modal-body">
              <div className="alert alert-warning d-flex align-items-center">
                <AlertCircle size={20} className="me-2 flex-shrink-0" />
                <div>
                  <strong>Note:</strong> Waiver requests require director-level approval and valid supporting documents.
                </div>
              </div>

              {/* Select Employee */}
              <div className="mb-3">
                <label className="form-label">
                  Select Employee <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.employeeId}
                  onChange={(e) => {
                    const employee = noticePeriodCases.find(
                      c => c.employeeId === e.target.value
                    );
                    setFormData({
                      ...formData,
                      employeeId: e.target.value,
                      employeeName: employee?.employeeName || '',
                      department: employee?.department || ''
                    });
                  }}
                  required
                >
                  <option value="">Select Employee</option>
                  {noticePeriodCases
                    .filter(c => c.status === 'Active')
                    .map(employee => (
                      <option key={employee.id} value={employee.employeeId}>
                        {employee.employeeName} ({employee.employeeId}) - {employee.department}
                      </option>
                    ))}
                </select>
              </div>

              {/* Waiver Days & Reason */}
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">
                    Waiver Days <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.waiverDays}
                    onChange={(e) =>
                      setFormData({ ...formData, waiverDays: e.target.value })
                    }
                    required
                    min="1"
                    max="90"
                    placeholder="Number of days to waive"
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">
                    Waiver Reason <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.waiverReason}
                    onChange={(e) =>
                      setFormData({ ...formData, waiverReason: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Reason</option>
                    <option value="Higher studies">Higher studies</option>
                    <option value="Medical emergency">Medical emergency</option>
                    <option value="Family emergency">Family emergency</option>
                    <option value="Relocation">Relocation</option>
                    <option value="Personal reasons">Personal reasons</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Waiver Details */}
              <div className="mb-3">
                <label className="form-label">
                  Waiver Details <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.waiverDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, waiverDetails: e.target.value })
                  }
                  required
                  placeholder="Provide detailed explanation for waiver request..."
                />
              </div>

              {/* Supporting Documents */}
              <div className="mb-3">
                <label className="form-label">Supporting Documents</label>

                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Document name (without extension)"
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={addDocument}
                  >
                    Add Document
                  </button>
                </div>

                {formData.supportingDocs.length > 0 ? (
                  <div className="card border">
                    <div className="card-body">
                      <h6 className="card-title">Uploaded Documents</h6>
                      <ul className="list-group list-group-flush">
                        {formData.supportingDocs.map((doc, index) => (
                          <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <span>
                              <FileText size={14} className="me-2" />
                              {doc}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeDocument(index)}
                            >
                              <X size={12} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-info d-flex align-items-center">
                    <Info size={16} className="me-2 flex-shrink-0" />
                    <span>Add supporting documents for waiver approval</span>
                  </div>
                )}
              </div>

              {/* Approval Workflow */}
              <div className="card border">
                <div className="card-body">
                  <h6 className="card-title">Approval Workflow</h6>
                  <div className="d-flex justify-content-between">
                    <div className="text-center">
                      <div
                        className={`badge ${formData.employeeId ? 'bg-primary' : 'bg-secondary'
                          } p-2 mb-1`}
                      >
                        Manager
                      </div>
                      <div className="small">Level 1</div>
                    </div>

                    <div className="text-center">
                      <div className="badge bg-secondary p-2 mb-1">HR Head</div>
                      <div className="small">Level 2</div>
                    </div>

                    <div className="text-center">
                      <div className="badge bg-secondary p-2 mb-1">Director</div>
                      <div className="small">Level 3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowWaiverModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-warning"
                onClick={() => handleWaiverRequest(formData)}
                disabled={
                  !formData.employeeId ||
                  !formData.waiverDays ||
                  !formData.waiverReason ||
                  !formData.waiverDetails
                }
              >
                Submit Waiver Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CounterOfferModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      employeeName: '',
      department: '',
      currentSalary: '',
      offeredSalary: '',
      offeredRole: '',
      additionalBenefits: '',
      notes: ''
    });

    const hikePercentage = formData.currentSalary && formData.offeredSalary
      ? ((parseInt(formData.offeredSalary.replace(/[^0-9]/g, '')) -
        parseInt(formData.currentSalary.replace(/[^0-9]/g, ''))) /
        parseInt(formData.currentSalary.replace(/[^0-9]/g, ''))) * 100
      : 0;

    const retentionProbability = Math.min(95, Math.max(30, Math.round(hikePercentage * 2)));

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                Counter Offer Proposal
              </h5>
              <button
                className="btn-close"
                onClick={() => setShowCounterOfferModal(false)}
              ></button>
            </div>

            <div className="modal-body">
              <div className="alert alert-info d-flex align-items-center">
                <TrendingUp size={20} className="me-2 flex-shrink-0" />
                <div>
                  <strong>AI Prediction:</strong>{" "}
                  {hikePercentage > 0
                    ? `${retentionProbability}% retention probability`
                    : "Enter salary details"}
                </div>
              </div>

              {/* Select Employee */}
              <div className="mb-3">
                <label className="form-label">
                  Select Employee <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.employeeId}
                  onChange={(e) => {
                    const employee = noticePeriodCases.find(
                      c => c.employeeId === e.target.value
                    );
                    setFormData({
                      ...formData,
                      employeeId: e.target.value,
                      employeeName: employee?.employeeName || '',
                      department: employee?.department || ''
                    });
                  }}
                  required
                >
                  <option value="">Select Employee</option>
                  {noticePeriodCases
                    .filter(
                      c => c.status === 'Active' && c.counterOfferStatus !== 'Accepted'
                    )
                    .map(employee => (
                      <option key={employee.id} value={employee.employeeId}>
                        {employee.employeeName} ({employee.employeeId}) - {employee.department}
                      </option>
                    ))}
                </select>
              </div>

              {/* Salaries */}
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">
                    Current Salary (₹) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.currentSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, currentSalary: e.target.value })
                    }
                    required
                    placeholder="₹14,40,000"
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">
                    Offered Salary (₹) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.offeredSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, offeredSalary: e.target.value })
                    }
                    required
                    placeholder="₹18,00,000"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="mb-3">
                <label className="form-label">
                  Offered Role / Position <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.offeredRole}
                  onChange={(e) =>
                    setFormData({ ...formData, offeredRole: e.target.value })
                  }
                  required
                  placeholder="e.g., Senior Manager, Tech Lead"
                />
              </div>

              {/* Optional Fields */}
              <div className="mb-3">
                <label className="form-label">Additional Benefits</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.additionalBenefits}
                  onChange={(e) =>
                    setFormData({ ...formData, additionalBenefits: e.target.value })
                  }
                  placeholder="Stock options, bonus, flexible hours, remote work, etc."
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Notes & Strategy</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Retention strategy, key points to discuss, timing, etc."
                />
              </div>

              {/* Summary */}
              <div className="card border">
                <div className="card-body">
                  <h6 className="card-title">Counter Offer Summary</h6>

                  <div className="row">
                    <div className="col-4">
                      <small className="text-muted">Salary Hike</small>
                      <div
                        className={`h4 fw-bold ${hikePercentage > 0 ? 'text-success' : 'text-muted'
                          }`}
                      >
                        {hikePercentage > 0 ? `${Math.round(hikePercentage)}%` : '--'}
                      </div>
                    </div>

                    <div className="col-4">
                      <small className="text-muted">Retention Probability</small>
                      <div
                        className={`h4 fw-bold ${retentionProbability > 70
                          ? 'text-success'
                          : retentionProbability > 50
                            ? 'text-warning'
                            : 'text-danger'
                          }`}
                      >
                        {hikePercentage > 0 ? `${retentionProbability}%` : '--'}
                      </div>
                    </div>

                    <div className="col-4">
                      <small className="text-muted">Approval Required</small>
                      <div className="d-flex flex-column">
                        <span className="badge bg-secondary mb-1">Manager</span>
                        <span className="badge bg-secondary">HR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowCounterOfferModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={() => handleCounterOffer(formData)}
                disabled={
                  !formData.employeeId ||
                  !formData.currentSalary ||
                  !formData.offeredSalary ||
                  !formData.offeredRole
                }
              >
                Create Counter Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExtensionRequestModal = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      employeeName: '',
      department: '',
      currentLWD: '',
      requestedLWD: '',
      extensionReason: '',
      extensionDetails: ''
    });

    const extensionDays = formData.currentLWD && formData.requestedLWD
      ? Math.ceil((new Date(formData.requestedLWD) - new Date(formData.currentLWD)) / (1000 * 60 * 60 * 24))
      : 0;

    useEffect(() => {
      if (formData.employeeId) {
        const employee = noticePeriodCases.find(c => c.employeeId === formData.employeeId);
        if (employee) {
          setFormData(prev => ({
            ...prev,
            currentLWD: employee.lastWorkingDay,
            employeeName: employee.employeeName,
            department: employee.department
          }));
        }
      }
    }, [formData.employeeId]);

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                Notice Period Extension Request
              </h5>
              <button
                className="btn-close"
                onClick={() => setShowExtensionModal(false)}
              ></button>
            </div>

            <div className="modal-body">
              <div className="alert alert-info d-flex align-items-center">
                <Calendar size={20} className="me-2 flex-shrink-0" />
                <div>
                  <strong>Note:</strong> Extension requests should have valid business reasons and project requirements.
                </div>
              </div>

              {/* Select Employee */}
              <div className="mb-3">
                <label className="form-label">
                  Select Employee <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  required
                >
                  <option value="">Select Employee</option>
                  {noticePeriodCases
                    .filter(c => c.status === 'Active')
                    .map(employee => (
                      <option key={employee.id} value={employee.employeeId}>
                        {employee.employeeName} ({employee.employeeId}) - {employee.department}
                      </option>
                    ))}
                </select>
              </div>

              {/* Dates */}
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">
                    Current Last Working Day <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.currentLWD}
                    onChange={(e) =>
                      setFormData({ ...formData, currentLWD: e.target.value })
                    }
                    required
                    disabled
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <label className="form-label">
                    Requested Last Working Day <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.requestedLWD}
                    onChange={(e) =>
                      setFormData({ ...formData, requestedLWD: e.target.value })
                    }
                    required
                    min={formData.currentLWD}
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="mb-3">
                <label className="form-label">
                  Extension Reason <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.extensionReason}
                  onChange={(e) =>
                    setFormData({ ...formData, extensionReason: e.target.value })
                  }
                  required
                >
                  <option value="">Select Reason</option>
                  <option value="Project handover">Project handover</option>
                  <option value="Client request">Client request</option>
                  <option value="Knowledge transfer">Knowledge transfer</option>
                  <option value="Critical timeline">Critical timeline</option>
                  <option value="Successor training">Successor training</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Details */}
              <div className="mb-3">
                <label className="form-label">
                  Extension Details <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.extensionDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, extensionDetails: e.target.value })
                  }
                  required
                  placeholder="Detailed explanation of why extension is required..."
                />
              </div>

              {/* Summary Card - Centered with margin auto */}
              <div className="mx-auto" style={{ width: '500px', maxWidth: '100%' }}>
                <div className="card border shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title text-center mb-3">Extension Summary</h6>

                    <div className="row">
                      <div className="col-4 text-center">
                        <small className="text-muted d-block">Extension Days</small>
                        <div className={`h5 fw-bold mt-1 ${extensionDays > 0 ? 'text-primary' : 'text-muted'}`}>
                          {extensionDays > 0 ? `${extensionDays} days` : '--'}
                        </div>
                      </div>

                      <div className="col-4 text-center">
                        <small className="text-muted d-block">New Notice Period</small>
                        <div className="h5 fw-bold mt-1">
                          {formData.employeeId && extensionDays > 0
                            ? `${noticePeriodCases.find(e => e.employeeId === formData.employeeId)?.noticePeriodDays + extensionDays} days`
                            : '--'}
                        </div>
                      </div>

                      <div className="col-4 text-center">
                        <small className="text-muted d-block">Approval Required</small>
                        <div className="mt-2">
                          <div className="badge bg-secondary mb-1 d-inline-block mx-1">Manager</div>
                          <div className="badge bg-secondary d-inline-block mx-1">HR</div>
                        </div>
                      </div>
                    </div>

                    {extensionDays > 30 && (
                      <div className="alert alert-warning mt-3 mb-0 text-center">
                        <AlertCircle size={16} className="me-1" />
                        Extensions over 30 days require additional justification and director approval.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowExtensionModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-info"
                onClick={() => handleExtensionRequest(formData)}
                disabled={
                  !formData.employeeId ||
                  !formData.currentLWD ||
                  !formData.requestedLWD ||
                  !formData.extensionReason ||
                  !formData.extensionDetails
                }
              >
                Submit Extension Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AcceptanceLetterModal = () => {
    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content mx-auto" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                Send Resignation Acceptance Letter
              </h5>
              <button className="btn-close" onClick={() => setShowAcceptanceModal(false)}></button>
            </div>

            <div className="modal-body">
              <div
                className="alert alert-success mx-auto d-flex align-items-center"
                style={{ maxWidth: '600px' }}
              >
                <CheckCircle size={20} className="me-2 flex-shrink-0" />
                <span>
                  This will send an official resignation acceptance letter to <strong>{selectedEmployee?.employeeName}</strong>
                </span>
              </div>

              <div className="card mx-auto mb-4 shadow-sm" style={{ maxWidth: '600px', borderRadius: '12px' }}>
                <div className="card-body">
                  <h5 className="fw-bold mb-3 text-primary">Letter Preview</h5>
                  <div className="border p-4 bg-light rounded" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                    <p className="mb-2"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p className="mb-2"><strong>To:</strong> {selectedEmployee?.employeeName}</p>
                    <p className="mb-2"><strong>Employee ID:</strong> {selectedEmployee?.employeeId}</p>
                    <p className="mb-2"><strong>Department:</strong> {selectedEmployee?.department}</p>
                    <p className="mb-2"><strong>Subject:</strong> Acceptance of Resignation</p>
                    <p className="mb-2">
                      This letter is to formally acknowledge and accept your resignation submitted on <strong>{selectedEmployee?.resignationDate}</strong>.
                      Your last working day will be <strong>{selectedEmployee?.lastWorkingDay}</strong>.
                    </p>
                    <p className="mb-2">Please complete all exit formalities before your last working day.</p>
                    <p className="mt-4">Sincerely,<br /><strong>HR Department</strong></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-end">
              <button
                className="btn btn-outline-secondary me-3"
                onClick={() => setShowAcceptanceModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={handleSendAcceptanceLetter}
              >
                <Send size={16} className="me-2" />
                <span>Send Acceptance Letter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ExportModal = () => {
    const [exportFormat, setExportFormat] = useState('json');
    const [includeData, setIncludeData] = useState({
      cases: true,
      requests: true,
      statistics: true,
      analytics: true
    });

    // Function to handle export based on format
    const handleExport = () => {
      const exportData = {
        cases: includeData.cases ? noticePeriodCases : [],
        buyoutRequests: includeData.requests ? buyoutRequests : [],
        waiverRequests: includeData.requests ? waiverRequests : [],
        counterOffers: includeData.requests ? counterOffers : [],
        extensionRequests: includeData.requests ? extensionRequests : [],
        statistics: includeData.statistics ? statistics : {},
        aiPredictions: includeData.analytics ? aiPredictions : {},
        exportedAt: new Date().toISOString(),
        exportedBy: userInfo.name
      };

      switch (exportFormat) {
        case 'json':
          exportJSON(exportData);
          break;
        case 'csv':
          exportCSV(exportData);
          break;
        case 'pdf':
          exportPDF(exportData);
          break;
        case 'excel':
          exportExcel(exportData);
          break;
        default:
          exportJSON(exportData);
      }

      setShowExportModal(false);
      showNotification(`Report exported as ${exportFormat.toUpperCase()} successfully`, 'success');
    };

    // JSON Export Function
    const exportJSON = (data) => {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notice-period-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    // CSV Export Function
    const exportCSV = (data) => {
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add header
      csvContent += "Notice Period Management Report\r\n";
      csvContent += `Generated on: ${new Date().toLocaleDateString()}\r\n`;
      csvContent += `Generated by: ${userInfo.name}\r\n\r\n`;

      // Cases data
      if (data.cases.length > 0) {
        csvContent += "ACTIVE CASES\r\n";
        csvContent += "Employee ID,Employee Name,Department,Role,Resignation Date,Notice Period,Last Working Day,Days Remaining,Status,Manager Acknowledged\r\n";

        data.cases.forEach(caseItem => {
          csvContent += `"${caseItem.employeeId}","${caseItem.employeeName}","${caseItem.department}","${caseItem.role}","${caseItem.resignationDate}","${caseItem.noticePeriod}","${caseItem.lastWorkingDay}",${caseItem.daysRemaining},"${caseItem.status}","${caseItem.managerAcknowledged ? 'Yes' : 'No'}"\r\n`;
        });
        csvContent += "\r\n";
      }

      // Buyout requests
      if (data.buyoutRequests.length > 0) {
        csvContent += "BUYOUT REQUESTS\r\n";
        csvContent += "Employee ID,Employee Name,Department,Buyout Amount,Requested Date,Status,Days to Buyout\r\n";

        data.buyoutRequests.forEach(req => {
          csvContent += `"${req.employeeId}","${req.employeeName}","${req.department}","${req.buyoutAmount}","${req.requestedDate}","${req.status}",${req.daysToBuyout}\r\n`;
        });
        csvContent += "\r\n";
      }

      // Statistics
      if (Object.keys(data.statistics).length > 0) {
        csvContent += "STATISTICS\r\n";
        csvContent += "Metric,Value\r\n";
        Object.entries(data.statistics).forEach(([key, value]) => {
          csvContent += `"${key}","${value}"\r\n`;
        });
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `notice-period-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // PDF Export Function (simplified - in production you'd use a PDF library)
    const exportPDF = (data) => {
      // Create a simple HTML representation for PDF
      let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Notice Period Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2c3e50; }
          h2 { color: #34495e; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; }
          .header { background-color: #3498db; color: white; padding: 20px; border-radius: 5px; }
          .footer { margin-top: 50px; color: #7f8c8d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Notice Period Management Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Generated by: ${userInfo.name}</p>
        </div>
    `;

      // Add cases data
      if (data.cases.length > 0) {
        htmlContent += `<h2>Active Cases (${data.cases.length})</h2>`;
        htmlContent += `<table>
        <tr>
          <th>Employee ID</th>
          <th>Employee Name</th>
          <th>Department</th>
          <th>Resignation Date</th>
          <th>Notice Period</th>
          <th>Last Working Day</th>
          <th>Days Remaining</th>
          <th>Status</th>
        </tr>`;

        data.cases.forEach(caseItem => {
          htmlContent += `<tr>
          <td>${caseItem.employeeId}</td>
          <td>${caseItem.employeeName}</td>
          <td>${caseItem.department}</td>
          <td>${caseItem.resignationDate}</td>
          <td>${caseItem.noticePeriod}</td>
          <td>${caseItem.lastWorkingDay}</td>
          <td>${caseItem.daysRemaining}</td>
          <td>${caseItem.status}</td>
        </tr>`;
        });
        htmlContent += `</table>`;
      }

      // Add statistics
      if (Object.keys(data.statistics).length > 0) {
        htmlContent += `<h2>Statistics</h2>`;
        htmlContent += `<table>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>`;

        Object.entries(data.statistics).forEach(([key, value]) => {
          htmlContent += `<tr>
          <td>${key}</td>
          <td>${value}</td>
        </tr>`;
        });
        htmlContent += `</table>`;
      }

      htmlContent += `
        <div class="footer">
          <p>Report ID: NOTICE-${Date.now()}</p>
          <p>Confidential - For Internal Use Only</p>
        </div>
      </body>
      </html>
    `;

      // For PDF, we'll create a new window and print it
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print
      printWindow.onload = function () {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };
    };

    // Excel Export Function (using CSV with .xls extension for simplicity)
    const exportExcel = (data) => {
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add metadata
      csvContent += "Notice Period Management Report\r\n";
      csvContent += `Generated on: ${new Date().toLocaleDateString()}\r\n`;
      csvContent += `Generated by: ${userInfo.name}\r\n\r\n`;

      // Cases sheet
      csvContent += "ACTIVE CASES\r\n";
      csvContent += "Employee ID\tEmployee Name\tDepartment\tRole\tResignation Date\tNotice Period\tLast Working Day\tDays Remaining\tStatus\tManager Acknowledged\r\n";

      data.cases.forEach(caseItem => {
        csvContent += `${caseItem.employeeId}\t${caseItem.employeeName}\t${caseItem.department}\t${caseItem.role}\t${caseItem.resignationDate}\t${caseItem.noticePeriod}\t${caseItem.lastWorkingDay}\t${caseItem.daysRemaining}\t${caseItem.status}\t${caseItem.managerAcknowledged ? 'Yes' : 'No'}\r\n`;
      });

      // Add separator for multiple sheets (using multiple CSV rows with sheet markers)
      csvContent += "\r\n\r\n";
      csvContent += "BUYOUT REQUESTS\r\n";
      csvContent += "Employee ID\tEmployee Name\tDepartment\tBuyout Amount\tRequested Date\tStatus\tDays to Buyout\r\n";

      data.buyoutRequests.forEach(req => {
        csvContent += `${req.employeeId}\t${req.employeeName}\t${req.department}\t${req.buyoutAmount}\t${req.requestedDate}\t${req.status}\t${req.daysToBuyout}\r\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `notice-period-report-${new Date().toISOString().split('T')[0]}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold d-flex align-items-center">
                <Download className="me-2" size={20} />
                Export Reports
              </h5>
              <button className="btn-close" onClick={() => setShowExportModal(false)}></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Export Format</label>
                <div className="d-flex flex-wrap gap-3">
                  {['json', 'csv', 'pdf', 'excel'].map(format => (
                    <div key={format} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="exportFormat"
                        id={format}
                        checked={exportFormat === format}
                        onChange={() => setExportFormat(format)}
                      />
                      <label className="form-check-label fw-medium" htmlFor={format}>
                        {format.toUpperCase()}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Include Data</label>

                <div className="row">
                  {Object.entries(includeData).map(([key, value]) => (
                    <div key={key} className="col-6 mb-2">
                      <div className="form-check custom-checkbox">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`include-${key}`}
                          checked={value}
                          onChange={(e) =>
                            setIncludeData(prev => ({
                              ...prev,
                              [key]: e.target.checked,
                            }))
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`include-${key}`}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <style>
                  {`
                  .custom-checkbox .form-check-input {
                    width: 1.1em;
                    height: 1.1em;
                    border: 2px solid #0d6efd;
                    background-color: #fff;
                    cursor: pointer;
                    position: relative;
                  }

                  .custom-checkbox .form-check-input:checked {
                    background-color: #0d6efd;   /* BLUE BOX */
                    border-color: #0d6efd;
                  }

                  .custom-checkbox .form-check-input:checked::after {
                    content: "✓";
                    color: #fff;                 /* WHITE TICK */
                    font-size: 0.9rem;
                    font-weight: bold;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -55%);
                  }
                `}
                </style>
              </div>

              {/* Format Information */}
              <div className="card border">
                <div className="card-body">
                  <h6 className="card-title mb-3">Format Information</h6>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <small className="text-muted d-block">JSON</small>
                      <div className="small">Full data with structure</div>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted d-block">CSV</small>
                      <div className="small">Spreadsheet compatible</div>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted d-block">PDF</small>
                      <div className="small">Print-ready format</div>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted d-block">Excel</small>
                      <div className="small">Excel compatible (.xls)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Summary */}
              <div className="card border mt-3">
                <div className="card-body">
                  <h6 className="card-title mb-3">Export Summary</h6>
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted">Format</small>
                      <div className="fw-bold">{exportFormat.toUpperCase()}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Items Included</small>
                      <div className="fw-bold">
                        {Object.values(includeData).filter(v => v).length} / 4
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <small className="text-muted">Estimated Size</small>
                      <div className="fw-bold">
                        {exportFormat === 'json' ? '~500KB' :
                          exportFormat === 'csv' ? '~300KB' :
                            exportFormat === 'pdf' ? '~1MB' : '~400KB'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={handleExport}
                disabled={!Object.values(includeData).some(v => v)}
              >
                <Download size={16} />
                <span>Export Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== NEW MODALS ====================

  const AIFilterModal = () => {
    const departments = [...new Set(noticePeriodCases.map(c => c.department))];

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold d-flex align-items-center">
                <Brain className="me-2" size={20} />
                AI Smart Filter
              </h5>
              <button className="btn-close" onClick={() => setShowAIFilterModal(false)}></button>
            </div>

            <div className="modal-body">
              <div className="alert alert-info d-flex align-items-center">
                <Sparkles size={16} className="me-2" />
                <span>AI will analyze and prioritize cases based on multiple factors</span>
              </div>

              <div className="mb-3">
                <label className="form-label">Risk Level</label>
                <select
                  className="form-select"
                  value={aiFilterCriteria.riskLevel}
                  onChange={(e) => setAiFilterCriteria({ ...aiFilterCriteria, riskLevel: e.target.value })}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="High">High Risk (≤7 days)</option>
                  <option value="Medium">Medium Risk (8-14 days)</option>
                  <option value="Low">{'Low Risk (>14 days)'}</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={aiFilterCriteria.department}
                  onChange={(e) => setAiFilterCriteria({ ...aiFilterCriteria, department: e.target.value })}
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Days Remaining</label>
                <select
                  className="form-select"
                  value={aiFilterCriteria.daysRemaining}
                  onChange={(e) => setAiFilterCriteria({ ...aiFilterCriteria, daysRemaining: e.target.value })}
                >
                  <option value="all">All Timeframes</option>
                  <option value="critical">Critical (≤7 days)</option>
                  <option value="urgent">Urgent (8-14 days)</option>
                  <option value="moderate">Moderate (15-30 days)</option>
                  <option value="normal">{'Normal (>30 days)'}</option>

                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={aiFilterCriteria.status}
                  onChange={(e) => setAiFilterCriteria({ ...aiFilterCriteria, status: e.target.value })}
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="mb-3">
                <div className="form-check custom-checkbox">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="pendingActions"
                    checked={aiFilterCriteria.hasPendingActions}
                    onChange={(e) =>
                      setAiFilterCriteria({
                        ...aiFilterCriteria,
                        hasPendingActions: e.target.checked
                      })
                    }
                  />
                  <label className="form-check-label" htmlFor="pendingActions">
                    Show only cases with pending actions
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <div className="form-check custom-checkbox">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="highPriority"
                    checked={aiFilterCriteria.highPriority}
                    onChange={(e) =>
                      setAiFilterCriteria({
                        ...aiFilterCriteria,
                        highPriority: e.target.checked
                      })
                    }
                  />
                  <label className="form-check-label" htmlFor="highPriority">
                    High priority only (AI recommended)
                  </label>
                </div>
              </div>

              <style>
                {`
  .custom-checkbox .form-check-input {
    width: 1.2em;
    height: 1.2em;
    border: 2px solid #4a6bdf;
    background-color: #f0f5ff;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;
  }

  .custom-checkbox .form-check-input:hover {
    border-color: #083ed2;
    background-color: #e6eeff;
  }

  .custom-checkbox .form-check-input:checked {
    background-color: #083ed2;  /* Blue background when checked */
    border-color: #083ed2;
  }

  .custom-checkbox .form-check-input:checked::after {
    content: "✓";
    color: white;               /* White tick mark */
    font-size: 0.9rem;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
  }

  .custom-checkbox .form-check-label {
    cursor: pointer;
    user-select: none;
    padding-left: 0.5rem;
    color: #2c3e50;
  }
`}
              </style>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowAIFilterModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary d-flex align-items-center" onClick={handleAIFilterApply}>
                <Filter size={16} className="me-2" />
                Apply AI Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditCaseModal = () => {
    const [formData, setFormData] = useState(editingCase || {});

    useEffect(() => {
      if (editingCase) {
        setFormData(editingCase);
      }
    }, [editingCase]);

    const handleSubmit = () => {
      handleUpdateCase(formData);
    };

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content mx-auto" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h5 className="modal-title fw-bold d-flex align-items-center">
                Edit Case - {editingCase?.employeeName}
              </h5>
              <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Employee Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.employeeName || ''}
                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Resignation Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.resignationDate || ''}
                    onChange={(e) => setFormData({ ...formData, resignationDate: e.target.value })}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Notice Period (days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.noticePeriodDays || ''}
                    onChange={(e) => setFormData({ ...formData, noticePeriodDays: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Manager Acknowledged</label>
                  <select
                    className="form-select"
                    value={formData.managerAcknowledged || false}
                    onChange={(e) => setFormData({ ...formData, managerAcknowledged: e.target.value === 'true' })}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Resignation Reason</label>
                <select
                  className="form-select"
                  value={formData.resignationReason || ''}
                  onChange={(e) => setFormData({ ...formData, resignationReason: e.target.value })}
                >
                  {resignationReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Comments</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.resignationComments || ''}
                  onChange={(e) => setFormData({ ...formData, resignationComments: e.target.value })}
                  placeholder="Additional comments..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary d-flex align-items-center" onClick={handleSubmit}>
                <Save size={16} className="me-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ViewCaseModal = () => {
    if (!viewingCase) return null;

    return (


      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content mx-auto" style={{ maxWidth: '800px', width: '100%' }}>
            <div className="modal-header">
              <h5 className="modal-title fw-bold d-flex align-items-center">
                <FileText size={20} className="me-2" />
                Case Details - {viewingCase.employeeName}
              </h5>
              <button className="btn-close" onClick={() => setShowViewModal(false)}></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Employee ID</label>
                    <div className="form-control-plaintext border-bottom pb-2">{viewingCase.employeeId}</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Name</label>
                    <div className="form-control-plaintext border-bottom pb-2">{viewingCase.employeeName}</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Department</label>
                    <div className="form-control-plaintext border-bottom pb-2">{viewingCase.department}</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Role</label>
                    <div className="form-control-plaintext border-bottom pb-2">{viewingCase.role}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Resignation Date</label>
                    <div className="form-control-plaintext border-bottom pb-2">
                      <div className="d-flex align-items-center">
                        <Calendar size={16} className="me-2 text-muted" />
                        {viewingCase.resignationDate}
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Notice Period</label>
                    <div className="form-control-plaintext border-bottom pb-2">
                      <div className="d-flex align-items-center">
                        <Clock size={16} className="me-2 text-muted" />
                        {viewingCase.noticePeriod}
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Last Working Day</label>
                    <div className="form-control-plaintext border-bottom pb-2">
                      <div className="d-flex align-items-center">
                        <CalendarDays size={16} className="me-2 text-muted" />
                        {viewingCase.lastWorkingDay}
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">Days Remaining</label>
                    <div className="form-control-plaintext border-bottom pb-2">
                      <div className="d-flex align-items-center">
                        <AlertCircle size={16} className="me-2 text-muted" />
                        {viewingCase.daysRemaining} days
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-primary">Resignation Reason</label>
                <div className="form-control-plaintext border-bottom pb-2">
                  <div className="d-flex align-items-center">
                    <Info size={16} className="me-2 text-muted" />
                    {viewingCase.resignationReason}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-primary">Comments</label>
                <div className="form-control-plaintext border p-3 rounded bg-light">
                  {viewingCase.resignationComments || 'No comments'}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-primary">Status</label>
                <div className="d-flex align-items-center gap-2">
                  {getStatusBadge(viewingCase.status)}
                  {viewingCase.managerAcknowledged ? (
                    <span className="badge bg-success d-flex align-items-center">
                      <Check size={14} className="me-1" />
                      Manager Acknowledged
                    </span>
                  ) : (
                    <span className="badge bg-warning d-flex align-items-center">
                      <AlertCircle size={14} className="me-1" />
                      Awaiting Manager Ack
                    </span>
                  )}
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold mb-3 text-primary">Additional Information</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-2">
                      <small className="text-muted d-block">Manager Email</small>
                      <div>{viewingCase.managerEmail || 'Not specified'}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">HR Interview Scheduled</small>
                      <div>{viewingCase.hrInterviewScheduled || 'Not scheduled'}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-2">
                      <small className="text-muted d-block">Counter Offer Status</small>
                      <div>{viewingCase.counterOfferStatus}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Retention Attempted</small>
                      <div>{viewingCase.retentionAttempted ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={() => {
                  setShowViewModal(false);
                  handleEditCase(viewingCase);
                }}
              >
                <Edit size={16} className="me-2" />
                Edit Case
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddEmployeeModal = () => {
    const [formData, setFormData] = useState({
      employeeName: '',
      department: 'Engineering',
      role: '',
      resignationDate: new Date().toISOString().split('T')[0],
      noticePeriodDays: 60,
      noticePeriodType: 'Serving',
      lastWorkingDay: '',
      resignationReason: 'Better opportunity',
      resignationComments: ''
    });

    const handleSubmit = () => {
      handleAddEmployee(formData);
    };

    // Calculate LWD when resignation date or notice period changes
    useEffect(() => {
      if (formData.resignationDate && formData.noticePeriodDays) {
        const lwd = calculateLastWorkingDay(formData.resignationDate, formData.noticePeriodDays);
        setFormData(prev => ({ ...prev, lastWorkingDay: lwd }));
      }
    }, [formData.resignationDate, formData.noticePeriodDays]);

    return (
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold d-flex align-items-center">
                <FolderPlus size={16} className="me-2" />
                Add New Employee
              </h5>
              <button className="btn-close" onClick={() => setShowAddEmployeeModal(false)}></button>
            </div>

            <div className="modal-body">
              {/* Employee Name */}
              <div className="mb-3">
                <label className="form-label">
                  Employee Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.employeeName}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeName: e.target.value })
                  }
                  placeholder="Enter employee name"
                  required
                />
              </div>

              {/* Department & Role */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Department <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Role <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="Enter role"
                    required
                  />
                </div>
              </div>

              {/* Resignation Date & Notice Period */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Resignation Date <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.resignationDate}
                    onChange={(e) =>
                      setFormData({ ...formData, resignationDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Notice Period (days) <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.noticePeriodDays}
                    onChange={(e) =>
                      setFormData({ ...formData, noticePeriodDays: parseInt(e.target.value) })
                    }
                  >
                    <option value="30">30 Days</option>
                    <option value="45">45 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>
              </div>

              {/* Notice Period Type & Last Working Day */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Notice Period Type <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.noticePeriodType}
                    onChange={(e) =>
                      setFormData({ ...formData, noticePeriodType: e.target.value })
                    }
                  >
                    <option value="Serving">Serving</option>
                    <option value="Buyout">Buyout</option>
                    <option value="Waived">Waived</option>
                    <option value="Garden Leave">Garden Leave</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Last Working Day <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.lastWorkingDay}
                    onChange={(e) =>
                      setFormData({ ...formData, lastWorkingDay: e.target.value })
                    }
                    required
                    readOnly
                  />
                </div>
              </div>

              {/* Resignation Reason */}
              <div className="mb-3">
                <label className="form-label">Resignation Reason</label>
                <select
                  className="form-select"
                  value={formData.resignationReason}
                  onChange={(e) =>
                    setFormData({ ...formData, resignationReason: e.target.value })
                  }
                >
                  {resignationReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comments */}
              <div className="mb-3">
                <label className="form-label">Comments</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.resignationComments}
                  onChange={(e) =>
                    setFormData({ ...formData, resignationComments: e.target.value })
                  }
                  placeholder="Additional comments..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={() => setShowAddEmployeeModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={handleSubmit}
                disabled={!formData.employeeName || !formData.role || !formData.lastWorkingDay}
              >
                <FolderPlus size={16} className="me-2" />
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== MAIN COMPONENT ====================
  const mainContent = (
    <div className="container-fluid px-3 px-md-4 py-3">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h5 className="fw-bold mb-2 d-flex align-items-center">
              <Clock size={22} className="me-2 text-dark" />
              Notice Period Tracking & Management
            </h5>
            <p className="text-muted mb-0 d-flex align-items-center">
              <span>
                AI-powered resignation workflow with predictive analytics and automated processing
              </span>
            </p>
          </div>

          <div className="d-flex flex-nowrap gap-2">
            <button
              className="btn btn-primary d-flex align-items-center gap-2 text-nowrap"
              onClick={() => setShowResignationModal(true)}
            >
              <FileText size={16} />
              <span>Submit Resignation</span>
            </button>

            <button
              className="btn btn-primary d-flex align-items-center gap-2 text-nowrap"
              onClick={() => setShowExportModal(true)}
            >
              <Download size={16} />
              <span>Export Reports</span>
            </button>

            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-2 text-nowrap"
              onClick={handlePrintReport}
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* AI Status Bar */}
        <div className="p-3 bg-primary bg-opacity-10 rounded mb-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="spinner-grow spinner-grow-sm text-success" role="status"></div>
                  <span className="fw-medium">AI System Active</span>
                </div>
                <div className="vr"></div>
                <span className="text-muted small">Processing real-time analytics</span>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="d-flex align-items-center gap-3 justify-content-end">
                <span className="badge bg-success bg-opacity-10 text-success d-flex align-items-center">
                  <Zap size={14} className="me-1" />
                  <span>95% Prediction Accuracy</span>
                </span>
                <span className="badge bg-info bg-opacity-10 text-info d-flex align-items-center">
                  <Sparkles size={14} className="me-1" />
                  <span>Auto-processing Enabled</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row g-2 mb-3">
        {/* Active Cases */}
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small fw-bold text-dark mb-1">
                  Active Cases
                </div>
                <div className="fw-bold h5 text-primary mb-0">
                  {filteredCases.filter(c => c.status === 'Active').length}
                </div>
              </div>
              <Clock size={20} className="text-primary opacity-75" />
            </div>
            <div className="small text-success mt-1 d-flex align-items-center">
              <TrendingUp size={12} className="me-1" />
              +{statistics.weekResignations} this week
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small fw-bold text-dark mb-1">
                  Pending Approvals
                </div>
                <div className="fw-bold h5 text-warning mb-0">
                  {
                    filteredCases.filter(
                      c => !c.managerAcknowledged && c.status === 'Active'
                    ).length
                  }
                </div>
              </div>
              <AlertCircle size={20} className="text-warning opacity-75" />
            </div>
            <div className="small fw-semibold text-warning mt-1">
              Requires attention
            </div>
          </div>
        </div>

        {/* AI Time Saved */}
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small fw-bold text-dark mb-1">
                  AI Time Saved
                </div>
                <div className="fw-bold h5 text-success mb-0">
                  {statistics.timeSaved}
                </div>
              </div>
              <Zap size={20} className="text-success opacity-75" />
            </div>
            <div className="small text-muted mt-1">
              Through automation
            </div>
          </div>
        </div>

        {/* Retention Success */}
        <div className="col-6 col-md-3">
          <div className="p-3 bg-white border rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small fw-bold text-dark mb-1">
                  Retention Success
                </div>
                <div className="fw-bold h5 text-info mb-0">
                  {statistics.retentionSuccess}
                </div>
              </div>
              <TrendingUp size={20} className="text-info opacity-75" />
            </div>
            <div className="small fw-semibold text-success mt-1">
              {aiPredictions.retentionSuccessRate} success rate
            </div>
          </div>
        </div>
      </div>


      {/* Navigation Tabs */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          {[
            { key: 'dashboard', label: 'AI Dashboard', icon: <BarChart3 size={16} /> },
            { key: 'cases', label: 'Active Cases', icon: <Users size={16} /> },
            { key: 'buyout', label: 'Buyout Requests', icon: <DollarSign size={16} /> },
            { key: 'waiver', label: 'Waiver Requests', icon: <Shield size={16} /> },
            { key: 'counter', label: 'Counter Offers', icon: <Percent size={16} /> },
            { key: 'extension', label: 'Extension Requests', icon: <CalendarDays size={16} /> },
            { key: 'workflow', label: 'Resignation Workflow', icon: <Zap size={16} /> },
            { key: 'calculators', label: 'Calculators', icon: <Calculator size={16} /> }
          ].map(section => (
            <button
              key={section.key}
              className={`btn ${activeSection === section.key ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
              onClick={() => setActiveSection(section.key)}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-4">
        <div className="row g-3">
          <div className="col-12 col-md-8">
            <div className="d-flex">
              <div className="flex-grow-1 me-2">
                <div className="input-group h-100">
                  <span className="input-group-text bg-white">
                    <Search size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search employees, departments, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {(searchTerm || aiFilterCriteria.riskLevel !== 'all' || aiFilterCriteria.department !== 'all' || aiFilterCriteria.hasPendingActions || aiFilterCriteria.highPriority) && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleClearFilters}
                      title="Clear all filters"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={() => setShowAIFilterModal(true)}
              >
                <Filter size={16} className="me-2" />
                AI Filter
                {(aiFilterCriteria.riskLevel !== 'all' || aiFilterCriteria.department !== 'all' || aiFilterCriteria.hasPendingActions || aiFilterCriteria.highPriority) && (
                  <span className="ms-1 badge bg-danger">Active</span>
                )}
              </button>
            </div>

            {/* Show active filter tags */}
            {(aiFilterCriteria.riskLevel !== 'all' || aiFilterCriteria.department !== 'all' || aiFilterCriteria.hasPendingActions || aiFilterCriteria.highPriority) && (
              <div className="mt-2">
                <small className="text-muted me-2">Active filters:</small>
                {aiFilterCriteria.riskLevel !== 'all' && (
                  <span className="badge bg-info me-1">
                    Risk: {aiFilterCriteria.riskLevel}
                    <button
                      className="btn btn-sm btn-link text-white p-0 ms-1"
                      onClick={() => setAiFilterCriteria({ ...aiFilterCriteria, riskLevel: 'all' })}
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {aiFilterCriteria.department !== 'all' && (
                  <span className="badge bg-info me-1">
                    Dept: {aiFilterCriteria.department}
                    <button
                      className="btn btn-sm btn-link text-white p-0 ms-1"
                      onClick={() => setAiFilterCriteria({ ...aiFilterCriteria, department: 'all' })}
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {aiFilterCriteria.hasPendingActions && (
                  <span className="badge bg-warning me-1">
                    Pending Actions
                    <button
                      className="btn btn-sm btn-link text-white p-0 ms-1"
                      onClick={() => setAiFilterCriteria({ ...aiFilterCriteria, hasPendingActions: false })}
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
                {aiFilterCriteria.highPriority && (
                  <span className="badge bg-danger me-1">
                    High Priority
                    <button
                      className="btn btn-sm btn-link text-white p-0 ms-1"
                      onClick={() => setAiFilterCriteria({ ...aiFilterCriteria, highPriority: false })}
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            )}
            {filteredCases.length < noticePeriodCases.length && (
              <div className="mt-2 text-muted small">
                Showing {filteredCases.length} of {noticePeriodCases.length} cases
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calculators Section */}
      {activeSection === 'calculators' && (
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-header bg-primary text-white d-flex align-items-center">
                <Calculator className="me-2" />
                <h6 className="fw-bold mb-0">
                  Last Working Day Calculator
                </h6>
              </div>

              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Resignation Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={calculatorData.resignationDate}
                    onChange={(e) => setCalculatorData({ ...calculatorData, resignationDate: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Notice Period (Days) *</label>
                  <select
                    className="form-select"
                    value={calculatorData.noticePeriod}
                    onChange={(e) => setCalculatorData({ ...calculatorData, noticePeriod: e.target.value })}
                  >
                    <option value="30">30 Days</option>
                    <option value="45">45 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>
                <button className="btn btn-primary w-100" onClick={handleCalculateLWD}>
                  Calculate LWD
                </button>
                {calculatorResults.lwdResult && (
                  <div className="mt-3 alert alert-primary d-flex align-items-center w-100 rounded-3">
                    <Calendar className="me-2" size={16} />
                    <strong>{calculatorResults.lwdResult}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-header bg-success text-white d-flex align-items-center">
                <DollarSign className="me-2" />
                <h6 className="fw-bold mb-0">
                  Buyout Calculator
                </h6>
              </div>

              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Monthly Salary (₹) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="₹1,50,000"
                    value={calculatorData.monthlySalary}
                    onChange={(e) => setCalculatorData({ ...calculatorData, monthlySalary: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Days to Buyout *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="30"
                    value={calculatorData.buyoutDays}
                    onChange={(e) => setCalculatorData({ ...calculatorData, buyoutDays: e.target.value })}
                  />
                </div>
                <button className="btn btn-success w-100" onClick={handleCalculateBuyout}>
                  Calculate Buyout
                </button>
                {calculatorResults.buyoutResult && (
                  <div className="mt-3 alert alert-success d-flex align-items-center">
                    <DollarSign className="me-2" size={16} />
                    <strong>{calculatorResults.buyoutResult}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-header bg-danger text-white d-flex align-items-center">
                <Shield className="me-2" />
                <h6 className="fw-bold mb-0">
                  Waiver Calculator
                </h6>
              </div>

              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Current Notice Period (Days) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="60"
                    value={calculatorData.noticePeriod}
                    onChange={(e) => setCalculatorData({
                      ...calculatorData,
                      noticePeriod: e.target.value
                    })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Waiver Days Requested *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="15"
                    value={calculatorData.waiverDays}
                    onChange={(e) => setCalculatorData({
                      ...calculatorData,
                      waiverDays: e.target.value
                    })}
                  />
                </div>

                <button
                  className="btn btn-danger w-100"
                  onClick={handleCalculateWaiver}
                >
                  Calculate After Waiver
                </button>

                {calculatorResults.waiverResult && (
                  <div className="mt-3 alert alert-danger d-flex align-items-center w-100 rounded-3">
                    <Shield className="me-2" size={16} />
                    <strong>{calculatorResults.waiverResult}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-header bg-secondary text-white d-flex align-items-center">
                <Calculator className="me-2" />
                <h6 className="fw-bold mb-0">
                  Shortfall Calculator
                </h6>
              </div>

              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Required Notice Period (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="60"
                    value={calculatorData.noticePeriod}
                    onChange={(e) => setCalculatorData({
                      ...calculatorData,
                      noticePeriod: e.target.value
                    })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Actual Service Days</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="45"
                    value={calculatorData.buyoutDays}
                    onChange={(e) => setCalculatorData({
                      ...calculatorData,
                      buyoutDays: e.target.value
                    })}
                  />
                </div>

                <button
                  className="btn btn-secondary w-100 fw-semibold"
                  onClick={() => {
                    const shortfall = parseInt(calculatorData.noticePeriod) - parseInt(calculatorData.buyoutDays);
                    if (shortfall > 0) {
                      setShortfallAmount(shortfall);
                      showNotification(`Shortfall: ${shortfall} days`, 'info');
                    } else {
                      showNotification('No shortfall - service completed', 'success');
                    }
                  }}
                >
                  Calculate Shortfall
                </button>

                {shortfallAmount > 0 && (
                  <div className="mt-3 alert alert-secondary d-flex align-items-center w-100 rounded-3">
                    <AlertCircle className="me-2" size={16} />
                    <strong>Shortfall: {shortfallAmount} days</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h6 className="fw-bold mb-0 d-flex align-items-center">
                  <Info className="me-2" />
                  Calculator Quick Reference
                </h6>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-primary rounded-circle p-2 me-3">
                        <Calculator size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="fw-bold">LWD Calculator</div>
                        <small className="text-muted">Resignation Date + Notice Period</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-success rounded-circle p-2 me-3">
                        <DollarSign size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="fw-bold">Buyout Calculator</div>
                        <small className="text-muted">(Monthly Salary ÷ 30) × Days</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-info rounded-circle p-2 me-3">
                        <CalendarDays size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="fw-bold">Extension Calculator</div>
                        <small className="text-muted">Current LWD + Extension Days</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div><br></br>
        </div>
      )}

      {/* Active Cases Section */}
      {activeSection === 'cases' && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0 d-flex align-items-center" style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#000"
                }}>
                  <FileText size={20} className="me-2" />
                  Active Notice Period Cases
                  {filteredCases.length < noticePeriodCases.length && (
                    <span className="ms-2 text-muted small">
                      (Filtered: {filteredCases.filter(c => c.status === 'Active').length} of {noticePeriodCases.filter(c => c.status === 'Active').length})
                    </span>
                  )}
                </h6>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary d-flex justify-content-center align-items-center">
                    {filteredCases.filter(c => c.status === 'Active').length} cases
                  </span>
                  <button
                    className="btn btn-sm btn-primary d-flex align-items-center"
                    onClick={() => setShowAddEmployeeModal(true)}
                  >
                    <FolderPlus size={14} className="me-1" />
                    <span>Add New</span>
                  </button>
                </div>
              </div>
              <div className="card-body">
                {filteredCases.filter(c => c.status === 'Active').length === 0 ? (
                  <div className="text-center py-5">
                    <AlertCircle size={48} className="text-muted mb-3" />
                    <h5>No cases found</h5>
                    <p className="text-muted">
                      {searchTerm || aiFilterCriteria.riskLevel !== 'all' || aiFilterCriteria.department !== 'all' ?
                        "No cases match your current filters. Try clearing filters or adjusting your search." :
                        "No active cases found. Add a new employee to get started."}
                    </p>
                    {(searchTerm || aiFilterCriteria.riskLevel !== 'all' || aiFilterCriteria.department !== 'all') && (
                      <button className="btn btn-primary mt-2" onClick={handleClearFilters}>
                        Clear All Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCases(filteredCases.filter(c => c.status === 'Active').map(c => c.id));
                                } else {
                                  setSelectedCases([]);
                                }
                              }}
                            />
                          </th>
                          <th>Employee</th>
                          <th>Department</th>
                          <th>Resignation Date</th>
                          <th>Notice Period</th>
                          <th>Last Working Day</th>
                          <th>Days Left</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCases.filter(c => c.status === 'Active').map(caseItem => {
                          const risk = getRiskLevel(caseItem.daysRemaining);
                          return (
                            <tr key={caseItem.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={selectedCases.includes(caseItem.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedCases(prev => [...prev, caseItem.id]);
                                    } else {
                                      setSelectedCases(prev => prev.filter(id => id !== caseItem.id));
                                    }
                                  }}
                                />
                              </td>
                              <td>
                                <div className="fw-medium">{caseItem.employeeName}</div>
                                <small className="text-muted">{caseItem.employeeId}</small>
                              </td>
                              <td>
                                <span className="badge bg-info bg-opacity-10 text-info">{caseItem.department}</span>
                              </td>
                              <td>{caseItem.resignationDate}</td>
                              <td>
                                <span className="badge bg-light text-dark">{caseItem.noticePeriod}</span>
                              </td>
                              <td>{caseItem.lastWorkingDay}</td>
                              <td>
                                <div className={`fw-bold text-${risk.color}`}>
                                  {caseItem.daysRemaining} days
                                </div>
                              </td>
                              <td>{getStatusBadge(caseItem.status)}</td>
                              <td>
                                {renderActionButtons(caseItem)}
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
      )}

      {/* Buyout Requests Section */}
      {activeSection === 'buyout' && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0 d-flex align-items-center" style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#000"
                }}>
                  <DollarSign size={20} className="me-2" />
                  Buyout Requests
                </h6>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary d-inline-flex justify-content-center align-items-center">
                    {buyoutRequests.filter(r => r.status === 'Pending').length} pending
                  </span>
                  <button
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => setShowBuyoutModal(true)}
                  >
                    <DollarSign size={14} className="me-1" />
                    <span>New Buyout Request</span>
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Requested Date</th>
                        <th>Buyout Amount</th>
                        <th>Days to Buyout</th>
                        <th>Status</th>
                        <th>Approval Level</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyoutRequests.map(request => (
                        <tr key={request.id}>
                          <td>
                            <div className="fw-medium">{request.employeeName}</div>
                            <small className="text-muted">{request.employeeId}</small>
                          </td>
                          <td>{request.department}</td>
                          <td>{request.requestedDate}</td>
                          <td className="fw-bold text-success">{request.buyoutAmount}</td>
                          <td>{request.daysToBuyout}</td>
                          <td>{getStatusBadge(request.status)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <span className={`badge ${request.approvedByManager ? 'bg-success' : 'bg-secondary'}`}>M</span>
                              <span className={`badge ${request.approvedByHR ? 'bg-success' : 'bg-secondary'}`}>HR</span>
                              <span className={`badge ${request.approvedByFinance ? 'bg-success' : 'bg-secondary'}`}>F</span>
                            </div>
                          </td>
                          <td>
                            {renderRequestActionButtons(request, 'buyout')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waiver Requests Section */}
      {activeSection === 'waiver' && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="d-flex align-items-center mb-0 " style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#000"
                }}>
                  <Shield className="me-2" />
                  Notice Period Waiver Requests
                </h6>
                <div className="d-flex gap-2">
                  <div className="d-flex justify-content-center">
                    <span className="badge bg-primary d-inline-flex justify-content-center align-items-center">
                      {waiverRequests.filter(r => r.status === 'Pending').length} pending
                    </span>
                  </div>
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => setShowWaiverModal(true)}
                  >
                    <Shield size={14} className="me-2" />
                    New Waiver Request
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Requested Date</th>
                        <th>Waiver Days</th>
                        <th>Reason</th>
                        <th>Documents</th>
                        <th>Status</th>
                        <th>Approvals</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waiverRequests.map(request => (
                        <tr key={request.id}>
                          <td>
                            <div className="fw-medium">{request.employeeName}</div>
                            <small className="text-muted">{request.employeeId}</small>
                          </td>
                          <td>{request.department}</td>
                          <td>{request.requestedDate}</td>
                          <td className="fw-bold">{request.waiverDays} days</td>
                          <td>
                            <div className="small text-truncate" style={{ maxWidth: '150px' }} title={request.reason}>
                              {request.reason}
                            </div>
                          </td>
                          <td>
                            {request.supportingDocs.length > 0 ? (
                              <span className="badge bg-info d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                <span className="fw-bold">{request.supportingDocs.length}</span>
                                <span>docs</span>
                              </span>
                            ) : (
                              <span className="badge bg-secondary">No docs</span>
                            )}
                          </td>
                          <td>{getStatusBadge(request.status)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <span className={`badge ${request.approvedByManager ? 'bg-success' : 'bg-secondary'}`} title="Manager">M</span>
                              <span className={`badge ${request.approvedByHR ? 'bg-success' : 'bg-secondary'}`} title="HR">HR</span>
                              <span className={`badge ${request.approvedByDirector ? 'bg-success' : 'bg-secondary'}`} title="Director">D</span>
                            </div>
                          </td>
                          <td>
                            {renderRequestActionButtons(request, 'waiver')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Counter Offers Section */}
      {activeSection === 'counter' && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="d-flex align-items-center mb-0" style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#000"
                }}>
                  <Percent className="me-2" />
                  Counter Offers & Retention
                </h6>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary d-inline-flex justify-content-center align-items-center">
                    {counterOffers.filter(r => r.status === 'Pending').length} pending
                  </span>
                  <button
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => setShowCounterOfferModal(true)}
                  >
                    <Percent size={14} className="me-2" />
                    New Counter Offer
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Current Salary</th>
                        <th>Offered Salary</th>
                        <th>Hike %</th>
                        <th>Retention Probability</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {counterOffers.map(offer => (
                        <tr key={offer.id}>
                          <td>
                            <div className="fw-medium">{offer.employeeName}</div>
                            <small className="text-muted">{offer.employeeId}</small>
                            <div className="small text-muted">{offer.offeredRole}</div>
                          </td>
                          <td>{offer.department}</td>
                          <td className="fw-bold">{offer.currentSalary}</td>
                          <td className={`fw-bold ${offer.status === 'Accepted' ? 'text-success' : 'text-primary'}`}>
                            {offer.offeredSalary}
                          </td>
                          <td>
                            <span className={`badge ${parseFloat(offer.salaryHike) > 30 ? 'bg-success' : parseFloat(offer.salaryHike) > 20 ? 'bg-warning' : 'bg-info'}`}>
                              {offer.salaryHike}
                            </span>
                          </td>
                          <td>
                            <div className="progress" style={{ height: '20px' }}>
                              <div
                                className={`progress-bar ${parseInt(offer.retentionProbability) > 70 ? 'bg-success' : parseInt(offer.retentionProbability) > 50 ? 'bg-warning' : 'bg-danger'}`}
                                style={{ width: `${offer.retentionProbability}` }}
                              >
                                {offer.retentionProbability}
                              </div>
                            </div>
                          </td>
                          <td>{getStatusBadge(offer.status)}</td>
                          <td>
                            {renderRequestActionButtons(offer, 'counter')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extension Requests Section */}
      {activeSection === 'extension' && (
        <div className="row g-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className=" mb-0 d-flex align-items-center" style={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#000"
                }}>
                  <CalendarDays size={18} className="me-2" />
                  <span>Notice Period Extension Requests</span>
                </h6>

                <div className="d-flex gap-2">
                  <span className="badge bg-primary d-inline-flex justify-content-center align-items-center">
                    {extensionRequests.filter(r => r.status === 'Pending').length} pending
                  </span>
                  <button
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => setShowExtensionModal(true)}
                  >
                    <CalendarDays size={14} className="me-1" />
                    New Extension Request
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Current LWD</th>
                        <th>Requested LWD</th>
                        <th>Extension Days</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Approvals</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extensionRequests.map(request => (
                        <tr key={request.id}>
                          <td>
                            <div className="fw-medium">{request.employeeName}</div>
                            <small className="text-muted">{request.employeeId}</small>
                          </td>
                          <td>{request.department}</td>
                          <td>{request.currentLWD}</td>
                          <td className="fw-bold">{request.requestedLWD}</td>
                          <td>
                            <span className={`badge ${request.extensionDays > 30 ? 'bg-warning' : 'bg-primary'}`}>
                              {request.extensionDays} days
                            </span>
                          </td>
                          <td>
                            <div className="small text-truncate" style={{ maxWidth: '150px' }} title={request.reason}>
                              {request.reason}
                            </div>
                          </td>
                          <td>{getStatusBadge(request.status)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <span className={`badge ${request.approvedByManager ? 'bg-success' : 'bg-secondary'}`} title="Manager">M</span>
                              <span className={`badge ${request.approvedByHR ? 'bg-success' : 'bg-secondary'}`} title="HR">HR</span>
                            </div>
                          </td>
                          <td>
                            {renderRequestActionButtons(request, 'extension')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Countdown Tracker */}
      <div
        className="mt-4 pt-3 border-top"
        style={{
          background: "#dce4f4",          // 👈 section background
          borderRadius: "16px",
          padding: "20px",
        }}
      >
        <h6
          className="mb-3 d-flex align-items-center"
          style={{
            fontWeight: 500,
            fontSize: "14px",
            color: "#000"
          }}
        >
          <Clock size={22} className="me-2 text-primary" />
          Daily Countdown Tracker

          {filteredCases.length < noticePeriodCases.length && (
            <span
              style={{
                marginLeft: "8px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#6b7280",
              }}
            >
              (Showing {filteredCases.filter(c => c.status === "Active").length} filtered cases)
            </span>
          )}
        </h6>

        <div className="row g-3">
          {filteredCases.filter(c => c.status === "Active").map(caseItem => {
            const risk = getRiskLevel(caseItem.daysRemaining);
            const progress =
              ((caseItem.noticePeriodDays - caseItem.daysRemaining) /
                caseItem.noticePeriodDays) *
              100;

            return (
              <div key={caseItem.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100"
                  style={{
                    background: "#ffffff",          // 👈 card background
                    borderRadius: "14px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6
                          style={{
                            fontWeight: 600,
                            fontSize: "15px",
                            marginBottom: "2px",
                            color: "#111827",
                          }}
                        >
                          {caseItem.employeeName}
                        </h6>
                        <small style={{ color: "#6b7280" }}>
                          {caseItem.department} • {caseItem.employeeId}
                        </small>
                      </div>

                      <span
                        style={{
                          background: "#ecfdf5",
                          color: "#047857",
                          fontWeight: 700,
                          fontSize: "12px",
                          padding: "4px 10px",
                          borderRadius: "20px",
                        }}
                      >
                        {caseItem.daysRemaining} days left
                      </span>
                    </div>

                    {/* Progress */}
                    <div
                      style={{
                        height: "6px",
                        background: "#e5e7eb",
                        borderRadius: "6px",
                        margin: "10px 0",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          background:
                            risk.color === "danger"
                              ? "#dc2626"
                              : risk.color === "warning"
                                ? "#f59e0b"
                                : "#16a34a",
                          borderRadius: "6px",
                        }}
                      />
                    </div>

                    {/* Dates */}
                    <div
                      className="d-flex justify-content-between"
                      style={{ fontSize: "12px", color: "#6b7280" }}
                    >
                      <span>Started: {caseItem.resignationDate}</span>
                      <span>Ends: {caseItem.lastWorkingDay}</span>
                    </div>

                    {/* Status Badges */}
                    <div className="mt-auto pt-3 d-flex flex-wrap gap-1">
                      {caseItem.waiverRequested && (
                        <span
                          style={{
                            background: "#fef3c7",
                            color: "#92400e",
                            fontSize: "12px",
                            fontWeight: 600,
                            padding: "4px 8px",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Shield size={12} /> Waiver Requested
                        </span>
                      )}

                      {caseItem.counterOfferStatus === "Pending" && (
                        <span
                          style={{
                            background: "#e0f2fe",
                            color: "#075985",
                            fontSize: "12px",
                            fontWeight: 600,
                            padding: "4px 8px",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Percent size={12} /> Counter Offer
                        </span>
                      )}

                      {caseItem.extensionRequested && (
                        <span
                          style={{
                            background: "#ecfeff",
                            color: "#155e75",
                            fontSize: "12px",
                            fontWeight: 600,
                            padding: "4px 8px",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <CalendarDays size={12} /> Extension
                        </span>
                      )}

                      {!caseItem.managerAcknowledged && (
                        <span
                          style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            fontSize: "12px",
                            fontWeight: 600,
                            padding: "4px 8px",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <AlertCircle size={12} /> Manager Ack Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {filteredCases.filter(c => c.status === "Active").length === 0 && (
            <div className="col-12 text-center py-4">
              <p style={{ color: "#6b7280", fontWeight: 600 }}>
                No active cases match your current filters.
              </p>
              <button className="btn btn-primary" onClick={handleClearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Modals */}
      {showResignationModal && <ResignationSubmissionModal />}
      {showBuyoutModal && <BuyoutRequestModal />}
      {showWaiverModal && <WaiverRequestModal />}
      {showCounterOfferModal && <CounterOfferModal />}
      {showExtensionModal && <ExtensionRequestModal />}
      {showAcceptanceModal && selectedEmployee && <AcceptanceLetterModal />}
      {showExportModal && <ExportModal />}
      {showAIFilterModal && <AIFilterModal />}
      {showEditModal && editingCase && <EditCaseModal />}
      {showViewModal && viewingCase && <ViewCaseModal />}
      {showAddEmployeeModal && <AddEmployeeModal />}
    </div>
  );

  return mainContent;
};

export default NoticePeriodTracking;