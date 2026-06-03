import React, { useState, useEffect, useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  FileText,
  Bell,
  Search,
  Filter,
  Save,
  X,
  Check,
  User,
  Building,
  CalendarCheck,
  Coffee,
  Moon,
  Sun,
  RotateCw,
  Home,
  Briefcase,
  Eye,
  Send,
  RefreshCw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CalendarDays,
  UserCheck,
  UserX,
  FileCheck,
  FileX,
  Mail,
  MessageSquare,
  CreditCard,
  Gift,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";



// ==================== REDUCER FOR STATE MANAGEMENT ====================
const leaveReducer = (state, action) => {
  switch (action.type) {
    case "SET_LEAVE_TYPES":
      return { ...state, leaveTypes: action.payload };
    case "ADD_LEAVE_TYPE":
      return { ...state, leaveTypes: [...state.leaveTypes, action.payload] };
    case "UPDATE_LEAVE_TYPE":
      return {
        ...state,
        leaveTypes: state.leaveTypes.map((lt) =>
          lt.id === action.payload.id ? action.payload : lt
        ),
      };
    case "DELETE_LEAVE_TYPE":
      return {
        ...state,
        leaveTypes: state.leaveTypes.filter((lt) => lt.id !== action.payload),
      };
    case "SET_LEAVE_BALANCES":
      return { ...state, leaveBalances: action.payload };
    case "UPDATE_LEAVE_BALANCE":
      return {
        ...state,
        leaveBalances: state.leaveBalances.map((lb) =>
          lb.id === action.payload.id ? action.payload : lb
        ),
      };
    case "SET_LEAVE_APPLICATIONS":
      return { ...state, leaveApplications: action.payload };
    case "ADD_LEAVE_APPLICATION":
      return {
        ...state,
        leaveApplications: [...state.leaveApplications, action.payload],
      };
    case "UPDATE_LEAVE_APPLICATION":
      return {
        ...state,
        leaveApplications: state.leaveApplications.map((la) =>
          la.id === action.payload.id ? action.payload : la
        ),
      };
    case "SET_COMP_OFFS":
      return { ...state, compOffs: action.payload };
    case "ADD_COMP_OFF":
      return { ...state, compOffs: [...state.compOffs, action.payload] };
    case "UPDATE_COMP_OFF":
      return {
        ...state,
        compOffs: state.compOffs.map((co) =>
          co.id === action.payload.id ? action.payload : co
        ),
      };
    case "SET_LEAVE_ADJUSTMENTS":
      return { ...state, leaveAdjustments: action.payload };
    case "ADD_LEAVE_ADJUSTMENT":
      return {
        ...state,
        leaveAdjustments: [...state.leaveAdjustments, action.payload],
      };
    default:
      return state;
  }
};

// ==================== INITIAL DATA ====================
const initialEmployees = [
  { id: "EMP001", name: "Khuswanth Rao", department: "IT", position: "Developer" },
  { id: "EMP002", name: "John Smith", department: "HR", position: "Manager" },
  { id: "EMP003", name: "Sarah Johnson", department: "Finance", position: "Analyst" },
  { id: "EMP004", name: "Mike Brown", department: "Sales", position: "Executive" },
  { id: "EMP005", name: "Emma Wilson", department: "IT", position: "Tester" },
];

const initialLeaveTypes = [
  {
    id: 1,
    name: "Casual Leave",
    code: "CL",
    isPaid: true,
    accrualType: "monthly",
    accrualAmount: 1.5,
    maxAccrual: 12,
    carryForward: { enabled: true, maxDays: 3, expiryMonths: 3 },
    encashment: { enabled: true, maxDays: 5, rate: 1.0 },
    allowNegative: false,
    probationApplicable: false,
    sandwichLeave: true,
    allowBackdated: false,
    allowHalfDay: true,
    allowShortLeave: true,
    isOptional: false,
    usageLimit: null,
    description: "Casual leave for personal work",
  },
  {
    id: 2,
    name: "Sick Leave",
    code: "SL",
    isPaid: true,
    accrualType: "monthly",
    accrualAmount: 1,
    maxAccrual: 12,
    carryForward: { enabled: true, maxDays: 5, expiryMonths: 6 },
    encashment: { enabled: false, maxDays: 0, rate: 0 },
    allowNegative: false,
    probationApplicable: true,
    sandwichLeave: false,
    allowBackdated: true,
    allowHalfDay: false,
    allowShortLeave: false,
    isOptional: false,
    usageLimit: null,
    description: "Medical leave with certificate requirement",
  },
  {
    id: 3,
    name: "Earned Leave",
    code: "EL",
    isPaid: true,
    accrualType: "monthly",
    accrualAmount: 1.25,
    maxAccrual: 15,
    carryForward: { enabled: true, maxDays: 10, expiryMonths: 12 },
    encashment: { enabled: true, maxDays: 10, rate: 1.0 },
    allowNegative: false,
    probationApplicable: false,
    sandwichLeave: true,
    allowBackdated: false,
    allowHalfDay: true,
    allowShortLeave: false,
    isOptional: false,
    usageLimit: null,
    description: "Earned leave with encashment option",
  },
  {
    id: 4,
    name: "Maternity Leave",
    code: "ML",
    isPaid: true,
    accrualType: "on-joining",
    accrualAmount: 26,
    maxAccrual: 26,
    carryForward: { enabled: false, maxDays: 0, expiryMonths: 0 },
    encashment: { enabled: false, maxDays: 0, rate: 0 },
    allowNegative: false,
    probationApplicable: false,
    sandwichLeave: false,
    allowBackdated: false,
    allowHalfDay: false,
    allowShortLeave: false,
    isOptional: false,
    usageLimit: 1,
    description: "Maternity leave for female employees",
  },
  {
    id: 5,
    name: "Paternity Leave",
    code: "PL",
    isPaid: true,
    accrualType: "on-joining",
    accrualAmount: 5,
    maxAccrual: 5,
    carryForward: { enabled: false, maxDays: 0, expiryMonths: 0 },
    encashment: { enabled: false, maxDays: 0, rate: 0 },
    allowNegative: false,
    probationApplicable: false,
    sandwichLeave: false,
    allowBackdated: false,
    allowHalfDay: false,
    allowShortLeave: false,
    isOptional: false,
    usageLimit: 1,
    description: "Paternity leave for male employees",
  },
  {
    id: 6,
    name: "Bereavement Leave",
    code: "BL",
    isPaid: true,
    accrualType: "annual",
    accrualAmount: 3,
    maxAccrual: 3,
    carryForward: { enabled: false, maxDays: 0, expiryMonths: 0 },
    encashment: { enabled: false, maxDays: 0, rate: 0 },
    allowNegative: false,
    probationApplicable: true,
    sandwichLeave: false,
    allowBackdated: true,
    allowHalfDay: false,
    allowShortLeave: false,
    isOptional: false,
    usageLimit: null,
    description: "Leave for family bereavement",
  },
];

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState("leaveTypes");
  const [showLeaveTypeModal, setShowLeaveTypeModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showCompOffModal, setShowCompOffModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [calendarView, setCalendarView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDept, setSelectedDept] = useState("All");
  const [planningStartDate, setPlanningStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [planningEndDate, setPlanningEndDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split("T")[0];
  });
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    period: "quarterly",
    startDate: "",
    endDate: "",
    targetDepartment: "All",
    message: "",
    status: "active",
  });
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  const [delegationForm, setDelegationForm] = useState({
    fromApprover: "",
    toApprover: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Form states
  const [leaveTypeForm, setLeaveTypeForm] = useState({
    name: "",
    code: "",
    isPaid: true,
    accrualType: "monthly",
    accrualAmount: 1,
    maxAccrual: 12,
    carryForward: { enabled: true, maxDays: 3, expiryMonths: 3 },
    encashment: { enabled: false, maxDays: 0, rate: 0 },
    allowNegative: false,
    probationApplicable: false,
    sandwichLeave: true,
    allowBackdated: false,
    allowHalfDay: true,
    allowShortLeave: false,
    isOptional: false,
    usageLimit: null,
    description: "",
    proration: { enabled: true, method: "proportional" }, // proportional, none, full
    approvalWorkflow: { levels: 1, approvers: [{ level: 1, role: "Manager", required: true }] },
  });

  const [applicationForm, setApplicationForm] = useState({
    employeeId: "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    halfDay: false,
    halfDayType: "first", // first, second
    reason: "",
    attachment: null,
    isBulk: false,
    bulkEmployees: [],
  });

  const [balanceForm, setBalanceForm] = useState({
    employeeId: "",
    leaveTypeId: "",
    openingBalance: 0,
    adjustmentType: "credit", // credit, debit
    adjustmentAmount: 0,
    reason: "",
    effectiveDate: new Date().toISOString().split("T")[0],
  });

  const [compOffForm, setCompOffForm] = useState({
    employeeId: "",
    earnedDate: "",
    hours: 0,
    expiryDate: "",
    source: "holiday", // holiday, weekend
    description: "",
    policyType: "compOff", // compOff, overtime
  });

  // Approval delegation state
  const [approvalDelegations, setApprovalDelegations] = useState(() => {
    const stored = localStorage.getItem('approvalDelegations');
    return stored ? JSON.parse(stored) : [];
  });

  // Leave planning campaign state
  const [leavePlanningCampaigns, setLeavePlanningCampaigns] = useState(() => {
    const stored = localStorage.getItem('leavePlanningCampaigns');
    return stored ? JSON.parse(stored) : [];
  });

  // Load from localStorage
  const loadFromStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const initialState = {
    leaveTypes: loadFromStorage("leaveTypes", initialLeaveTypes),
    leaveBalances: loadFromStorage("leaveBalances", []),
    leaveApplications: loadFromStorage("leaveApplications", []),
    compOffs: loadFromStorage("compOffs", []),
    leaveAdjustments: loadFromStorage("leaveAdjustments", []),
  };

  const [state, dispatch] = useReducer(leaveReducer, initialState);
  const {
    leaveTypes,
    leaveBalances,
    leaveApplications,
    compOffs,
    leaveAdjustments,
  } = state;

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("leaveTypes", JSON.stringify(leaveTypes));
    localStorage.setItem("leaveBalances", JSON.stringify(leaveBalances));
    localStorage.setItem("leaveApplications", JSON.stringify(leaveApplications));
    localStorage.setItem("compOffs", JSON.stringify(compOffs));
    localStorage.setItem("leaveAdjustments", JSON.stringify(leaveAdjustments));
  }, [state]);

  useEffect(() => {
    localStorage.setItem("approvalDelegations", JSON.stringify(approvalDelegations));
  }, [approvalDelegations]);

  useEffect(() => {
    localStorage.setItem("leavePlanningCampaigns", JSON.stringify(leavePlanningCampaigns));
  }, [leavePlanningCampaigns]);

  // ==================== LEAVE TYPE FUNCTIONS ====================
  const handleAddLeaveType = () => {
    if (!leaveTypeForm.name || !leaveTypeForm.code) {
      alert("Please enter leave type name and code");
      return;
    }

    const newLeaveType = {
      id: editingLeaveType ? editingLeaveType.id : Date.now(),
      ...leaveTypeForm,
    };

    if (editingLeaveType) {
      dispatch({ type: "UPDATE_LEAVE_TYPE", payload: newLeaveType });
      alert("Leave type updated successfully");
    } else {
      dispatch({ type: "ADD_LEAVE_TYPE", payload: newLeaveType });
      alert("Leave type added successfully");
    }

    setShowLeaveTypeModal(false);
    setEditingLeaveType(null);
    setLeaveTypeForm({
      name: "",
      code: "",
      isPaid: true,
      accrualType: "monthly",
      accrualAmount: 1,
      maxAccrual: 12,
      carryForward: { enabled: true, maxDays: 3, expiryMonths: 3 },
      encashment: { enabled: false, maxDays: 0, rate: 0 },
      allowNegative: false,
      probationApplicable: false,
      sandwichLeave: true,
      allowBackdated: false,
      allowHalfDay: true,
      allowShortLeave: false,
      isOptional: false,
      usageLimit: null,
      description: "",
      proration: { enabled: true, method: "proportional" },
      approvalWorkflow: { levels: 1, approvers: [{ level: 1, role: "Manager", required: true }] },
    });
  };

  const handleEditLeaveType = (leaveType) => {
    setEditingLeaveType(leaveType);
    setLeaveTypeForm(leaveType);
    setShowLeaveTypeModal(true);
  };

  const handleDeleteLeaveType = (id) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      dispatch({ type: "DELETE_LEAVE_TYPE", payload: id });
      alert("Leave type deleted successfully");
    }
  };

  // ==================== LEAVE APPLICATION FUNCTIONS ====================
  const handleSubmitApplication = () => {
    if (
      !applicationForm.employeeId ||
      !applicationForm.leaveTypeId ||
      !applicationForm.startDate
    ) {
      alert("Please fill all required fields");
      return;
    }

    const leaveType = leaveTypes.find((lt) => lt.id === applicationForm.leaveTypeId);
    const employee = initialEmployees.find((e) => e.id === applicationForm.employeeId);

    // Calculate days
    let days = 1;
    if (applicationForm.endDate) {
      const start = new Date(applicationForm.startDate);
      const end = new Date(applicationForm.endDate);
      days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }
    if (applicationForm.halfDay) days = 0.5;

    // Check balance
    const balance = leaveBalances.find(
      (b) =>
        b.employeeId === applicationForm.employeeId &&
        b.leaveTypeId === applicationForm.leaveTypeId
    );
    const availableBalance = balance?.balance || 0;

    if (availableBalance < days && !leaveType?.allowNegative) {
      alert(`Insufficient leave balance. Available: ${availableBalance} days`);
      return;
    }

    // Check for overlapping leaves
    const overlaps = detectOverlappingLeaves(
      applicationForm.employeeId,
      applicationForm.startDate,
      applicationForm.endDate || applicationForm.startDate
    );
    if (overlaps.length > 0) {
      const proceed = window.confirm(
        `Warning: You have ${overlaps.length} overlapping leave(s). Do you want to proceed?`
      );
      if (!proceed) return;
    }

    // Check auto-approval
    const shouldAutoApprove = checkAutoApproval({
      ...applicationForm,
      days,
    });

    // Build multi-level approval workflow
    const workflowLevels = leaveType?.approvalWorkflow?.levels || 1;
    const approvalWorkflow = [];
    for (let i = 1; i <= workflowLevels; i++) {
      const workflowConfig = leaveType?.approvalWorkflow?.approvers?.find(a => a.level === i);
      if (workflowConfig) {
        const effectiveApprover = getEffectiveApprover(workflowConfig.role, applicationForm.startDate);
        approvalWorkflow.push({
          level: i,
          approver: effectiveApprover,
          originalApprover: workflowConfig.role,
          status: shouldAutoApprove ? "approved" : "pending",
          required: workflowConfig.required !== false,
          delegated: effectiveApprover !== workflowConfig.role,
        });
      } else {
        // Default single level workflow
        approvalWorkflow.push({
          level: 1,
          approver: getEffectiveApprover("Manager", applicationForm.startDate),
          originalApprover: "Manager",
          status: shouldAutoApprove ? "approved" : "pending",
          required: true,
          delegated: false,
        });
        break;
      }
    }

    const application = {
      id: Date.now(),
      ...applicationForm,
      days,
      status: shouldAutoApprove ? "approved" : "pending",
      appliedAt: new Date().toISOString(),
      appliedBy: employee?.name || applicationForm.employeeId,
      leaveTypeName: leaveType?.name || "Unknown",
      currentBalance: availableBalance,
      approvalWorkflow,
      isAutoApproved: shouldAutoApprove,
    };

    dispatch({ type: "ADD_LEAVE_APPLICATION", payload: application });

    // If auto-approved, update balance immediately
    if (shouldAutoApprove) {
      const balance = leaveBalances.find(
        (b) =>
          b.employeeId === applicationForm.employeeId &&
          b.leaveTypeId === applicationForm.leaveTypeId
      );

      if (balance) {
        const updatedBalance = {
          ...balance,
          balance: balance.balance - days,
          used: balance.used + days,
        };
        dispatch({ type: "UPDATE_LEAVE_BALANCE", payload: updatedBalance });
      }
    }

    // Send notification to approver (if not auto-approved)
    if (!shouldAutoApprove) {
      sendNotification(
        "email",
        "Manager",
        `New leave application from ${employee?.name || applicationForm.employeeId}`
      );
    }
    setShowApplicationModal(false);
    setApplicationForm({
      employeeId: "",
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      halfDay: false,
      halfDayType: "first",
      reason: "",
      attachment: null,
      isBulk: false,
      bulkEmployees: [],
    });
    alert("Leave application submitted successfully");
  };

  const handleApproveApplication = (applicationId, approved) => {
    const application = leaveApplications.find((a) => a.id === applicationId);
    if (!application) return;

    // Check for overlapping leaves
    if (approved) {
      const overlaps = detectOverlappingLeaves(
        application.employeeId,
        application.startDate,
        application.endDate || application.startDate
      );
      if (overlaps.length > 0) {
        const confirmApproval = window.confirm(
          `Warning: Overlapping leave detected! ${overlaps.length} existing leave(s) found. Continue with approval?`
        );
        if (!confirmApproval) return;
      }
    }

    const updatedApplication = {
      ...application,
      status: approved ? "approved" : "rejected",
      approvedAt: new Date().toISOString(),
      approvedBy: "Manager",
      rejectionReason: approved ? null : "Not approved by manager",
    };

    dispatch({ type: "UPDATE_LEAVE_APPLICATION", payload: updatedApplication });

    // Send notification
    const employee = initialEmployees.find((e) => e.id === application.employeeId);
    sendNotification(
      "email",
      employee?.name || application.employeeId,
      `Your leave application has been ${approved ? "approved" : "rejected"}`
    );

    if (approved) {
      // Update leave balance
      const balance = leaveBalances.find(
        (b) =>
          b.employeeId === application.employeeId &&
          b.leaveTypeId === application.leaveTypeId
      );

      if (balance) {
        const updatedBalance = {
          ...balance,
          balance: balance.balance - application.days,
          used: balance.used + application.days,
        };
        dispatch({ type: "UPDATE_LEAVE_BALANCE", payload: updatedBalance });
      } else {
        // Create new balance record
        const newBalance = {
          id: Date.now(),
          employeeId: application.employeeId,
          leaveTypeId: application.leaveTypeId,
          balance: -application.days,
          used: application.days,
          accrued: 0,
          carryForward: 0,
          encashed: 0,
        };
        dispatch({ type: "SET_LEAVE_BALANCES", payload: [...leaveBalances, newBalance] });
      }
    }

    alert(`Leave application ${approved ? "approved" : "rejected"}`);
  };

  // ==================== LEAVE BALANCE FUNCTIONS ====================
  const handleAddBalance = () => {
    if (!balanceForm.employeeId || !balanceForm.leaveTypeId) {
      alert("Please select employee and leave type");
      return;
    }

    const balance = leaveBalances.find(
      (b) =>
        b.employeeId === balanceForm.employeeId &&
        b.leaveTypeId === balanceForm.leaveTypeId
    );

    if (balance) {
      const updatedBalance = {
        ...balance,
        balance:
          balanceForm.adjustmentType === "credit"
            ? balance.balance + balanceForm.adjustmentAmount
            : balance.balance - balanceForm.adjustmentAmount,
        openingBalance: balanceForm.openingBalance || balance.openingBalance,
      };
      dispatch({ type: "UPDATE_LEAVE_BALANCE", payload: updatedBalance });
    } else {
      const newBalance = {
        id: Date.now(),
        employeeId: balanceForm.employeeId,
        leaveTypeId: balanceForm.leaveTypeId,
        balance:
          balanceForm.openingBalance +
          (balanceForm.adjustmentType === "credit"
            ? balanceForm.adjustmentAmount
            : -balanceForm.adjustmentAmount),
        used: 0,
        accrued: 0,
        carryForward: 0,
        encashed: 0,
        openingBalance: balanceForm.openingBalance,
      };
      dispatch({ type: "SET_LEAVE_BALANCES", payload: [...leaveBalances, newBalance] });
    }

    // Add adjustment record
    const adjustment = {
      id: Date.now(),
      employeeId: balanceForm.employeeId,
      leaveTypeId: balanceForm.leaveTypeId,
      type: balanceForm.adjustmentType,
      amount: balanceForm.adjustmentAmount,
      reason: balanceForm.reason,
      effectiveDate: balanceForm.effectiveDate,
      approvedBy: "Admin",
      approvedAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_LEAVE_ADJUSTMENT", payload: adjustment });

    setShowBalanceModal(false);
    setBalanceForm({
      employeeId: "",
      leaveTypeId: "",
      openingBalance: 0,
      adjustmentType: "credit",
      adjustmentAmount: 0,
      reason: "",
      effectiveDate: new Date().toISOString().split("T")[0],
    });
    alert("Leave balance updated successfully");
  };

  // ==================== COMP-OFF FUNCTIONS ====================
  const handleAddCompOff = () => {
    if (!compOffForm.employeeId || !compOffForm.earnedDate || !compOffForm.hours) {
      alert("Please fill all required fields");
      return;
    }

    const compOff = {
      id: Date.now(),
      ...compOffForm,
      status: "available",
      applied: false,
      createdAt: new Date().toISOString(),
      policyType: compOffForm.policyType || "compOff", // Differentiate from overtime
    };

    dispatch({ type: "ADD_COMP_OFF", payload: compOff });
    setShowCompOffModal(false);
    setCompOffForm({
      employeeId: "",
      earnedDate: "",
      hours: 0,
      expiryDate: "",
      source: "holiday",
      description: "",
      policyType: "compOff",
    });
    alert(`Comp-off added successfully (Policy: ${compOffForm.policyType})`);
  };

  const handleApplyCompOff = (compOffId) => {
    const compOff = compOffs.find((co) => co.id === compOffId);
    if (!compOff) return;

    const today = new Date().toISOString().split("T")[0];

    const application = {
      id: Date.now(),
      employeeId: compOff.employeeId,
      leaveTypeId: "COMP_OFF",        // 🔴 important (not null)
      leaveTypeName: "Comp-Off",
      startDate: today,
      endDate: today,
      days: Number((compOff.hours / 8).toFixed(2)),
      status: "pending",              // 🔴 always string
      appliedAt: new Date().toISOString(),
      reason: `Comp-off application for ${compOff.hours} hours`,
      isCompOff: true,
      compOffId: compOffId,
    };

    // Add leave application
    dispatch({
      type: "ADD_LEAVE_APPLICATION",
      payload: application,
    });

    // Update comp-off safely
    dispatch({
      type: "UPDATE_COMP_OFF",
      payload: {
        ...compOff,
        applied: true,
        status: "applied",             // 🔴 always exists
      },
    });

    alert("Comp-off application submitted");
  };


  // ==================== UTILITY FUNCTIONS ====================
  const calculateProjectedBalance = (employeeId, leaveTypeId) => {
    const balance = leaveBalances.find(
      (b) => b.employeeId === employeeId && b.leaveTypeId === leaveTypeId
    );
    const leaveType = leaveTypes.find((lt) => lt.id === leaveTypeId);
    if (!balance || !leaveType) return 0;

    // Calculate projected accrual for remaining months
    const currentMonth = new Date().getMonth();
    const remainingMonths = 12 - currentMonth;
    const projectedAccrual =
      leaveType.accrualType === "monthly"
        ? leaveType.accrualAmount * remainingMonths
        : 0;

    return balance.balance + projectedAccrual;
  };

  const detectOverlappingLeaves = (employeeId, startDate, endDate) => {
    return leaveApplications.filter(
      (app) =>
        app.employeeId === employeeId &&
        app.status === "approved" &&
        ((new Date(app.startDate) <= new Date(endDate) &&
          new Date(app.endDate) >= new Date(startDate)) ||
          (app.startDate === startDate && app.endDate === endDate))
    );
  };

  // Calculate prorated leave based on joining/exit date
  const calculateProratedLeave = (leaveType, employee, joiningDate, exitDate) => {
    if (!leaveType.proration?.enabled || leaveType.proration.method === "none") {
      return leaveType.accrualAmount;
    }

    if (leaveType.proration.method === "full") {
      return leaveType.accrualAmount;
    }

    // Proportional proration
    const today = new Date();
    const startDate = exitDate ? new Date(exitDate) : (joiningDate ? new Date(joiningDate) : new Date(today.getFullYear(), 0, 1));
    const endDate = exitDate ? new Date(exitDate) : new Date(today.getFullYear(), 11, 31);

    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const fullYearDays = 365;
    const proratedAmount = (leaveType.accrualAmount * totalDays) / fullYearDays;

    return Math.round(proratedAmount * 100) / 100; // Round to 2 decimal places
  };

  // Auto-accrual function (should be called periodically)
  const processAutoAccrual = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    leaveTypes.forEach((leaveType) => {
      if (leaveType.accrualType === "monthly") {
        initialEmployees.forEach((employee) => {
          const balance = leaveBalances.find(
            (b) => b.employeeId === employee.id && b.leaveTypeId === leaveType.id
          );

          if (balance) {
            // Check if already accrued this month
            const lastAccrual = balance.lastAccrualDate
              ? new Date(balance.lastAccrualDate)
              : null;
            const shouldAccrue =
              !lastAccrual ||
              lastAccrual.getMonth() + 1 !== currentMonth ||
              lastAccrual.getFullYear() !== currentYear;

            if (shouldAccrue) {
              // Apply proration if enabled
              let accrualAmount = leaveType.accrualAmount;
              if (leaveType.proration?.enabled && balance.joiningDate) {
                accrualAmount = calculateProratedLeave(leaveType, employee, balance.joiningDate, balance.exitDate);
              }

              const newAccrued = Math.min(
                accrualAmount,
                leaveType.maxAccrual - (balance.accrued || 0)
              );

              if (newAccrued > 0) {
                const updatedBalance = {
                  ...balance,
                  balance: (balance.balance || 0) + newAccrued,
                  accrued: (balance.accrued || 0) + newAccrued,
                  lastAccrualDate: today.toISOString(),
                };
                dispatch({ type: "UPDATE_LEAVE_BALANCE", payload: updatedBalance });
              }
            }
          } else {
            // Create new balance with initial accrual (consider proration for new joiners)
            let initialAccrual = leaveType.accrualAmount;
            // Note: In real scenario, you'd get employee joining date
            // For now, using full accrual, but structure supports proration

            const newBalance = {
              id: Date.now(),
              employeeId: employee.id,
              leaveTypeId: leaveType.id,
              balance: initialAccrual,
              used: 0,
              accrued: initialAccrual,
              carryForward: 0,
              encashed: 0,
              openingBalance: 0,
              lastAccrualDate: today.toISOString(),
            };
            dispatch({ type: "SET_LEAVE_BALANCES", payload: [...leaveBalances, newBalance] });
          }
        });
      }
    });

    alert("Auto-accrual processed successfully");
  };

  // Process leave lapse (expired carry-forward leaves)
  const processLeaveLapse = () => {
    const today = new Date();
    let lapsedCount = 0;

    leaveBalances.forEach((balance) => {
      const leaveType = leaveTypes.find((lt) => lt.id === balance.leaveTypeId);
      if (!leaveType || !leaveType.carryForward.enabled) return;

      if (balance.carryForward > 0) {
        const expiryDate = new Date(balance.lastCarryForwardDate || today);
        expiryDate.setMonth(
          expiryDate.getMonth() + leaveType.carryForward.expiryMonths
        );

        if (expiryDate < today) {
          const updatedBalance = {
            ...balance,
            balance: balance.balance - balance.carryForward,
            carryForward: 0,
          };
          dispatch({ type: "UPDATE_LEAVE_BALANCE", payload: updatedBalance });
          lapsedCount++;
        }
      }
    });

    alert(`Processed ${lapsedCount} lapsed leave(s)`);
  };

  // Process leave encashment
  const processLeaveEncashment = (employeeId, leaveTypeId, days) => {
    const balance = leaveBalances.find(
      (b) => b.employeeId === employeeId && b.leaveTypeId === leaveTypeId
    );
    const leaveType = leaveTypes.find((lt) => lt.id === leaveTypeId);

    if (!balance || !leaveType || !leaveType.encashment.enabled) {
      alert("Leave encashment not allowed for this leave type");
      return;
    }

    if (days > leaveType.encashment.maxDays) {
      alert(`Maximum ${leaveType.encashment.maxDays} days can be encashed`);
      return;
    }

    if (balance.balance < days) {
      alert("Insufficient leave balance for encashment");
      return;
    }

    const updatedBalance = {
      ...balance,
      balance: balance.balance - days,
      encashed: (balance.encashed || 0) + days,
    };
    dispatch({ type: "UPDATE_LEAVE_BALANCE", payload: updatedBalance });

    const encashmentAmount = days * leaveType.encashment.rate;
    alert(
      `Leave encashment processed: ${days} days @ ${leaveType.encashment.rate}x = ${encashmentAmount} days equivalent`
    );
  };

  // Check auto-approval rules
  const checkAutoApproval = (application) => {
    const leaveType = leaveTypes.find((lt) => lt.id === application.leaveTypeId);
    if (!leaveType) return false;

    // Auto-approve if duration is within threshold (example: 1 day)
    if (application.days <= 1) {
      return true;
    }

    return false;
  };

  // Get effective approver considering delegation
  const getEffectiveApprover = (originalApprover, applicationDate) => {
    const delegation = approvalDelegations.find(
      d => d.fromApprover === originalApprover &&
        new Date(d.startDate) <= new Date(applicationDate) &&
        new Date(d.endDate) >= new Date(applicationDate) &&
        d.isActive
    );
    return delegation ? delegation.toApprover : originalApprover;
  };

  // Setup approval delegation
  const setupApprovalDelegation = (fromApprover, toApprover, startDate, endDate, reason) => {
    const delegation = {
      id: Date.now(),
      fromApprover,
      toApprover,
      startDate,
      endDate,
      reason,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setApprovalDelegations(prev => {
      const updated = [...prev, delegation];
      localStorage.setItem('approvalDelegations', JSON.stringify(updated));
      return updated;
    });
    alert("Approval delegation setup successfully");
  };

  // Export leave balance statement
  const exportLeaveBalanceStatement = (employeeId, format = 'csv') => {
    const balances = employeeId
      ? leaveBalances.filter(b => b.employeeId === employeeId)
      : leaveBalances;

    if (format === 'csv') {
      const headers = ['Employee', 'Leave Type', 'Opening Balance', 'Accrued', 'Used', 'Carry Forward', 'Encashed', 'Current Balance'];
      const rows = balances.map(balance => {
        const employee = initialEmployees.find(e => e.id === balance.employeeId);
        const leaveType = leaveTypes.find(lt => lt.id === balance.leaveTypeId);
        return [
          employee?.name || balance.employeeId,
          leaveType?.name || 'Unknown',
          balance.openingBalance || 0,
          balance.accrued || 0,
          balance.used || 0,
          balance.carryForward || 0,
          balance.encashed || 0,
          balance.balance || 0,
        ];
      });

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leave_balance_statement_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      alert('Leave balance statement exported successfully');
    } else {
      // PDF/Print functionality would go here
      window.print();
    }
  };

  // Leave coverage planning
  const calculateLeaveCoverage = (department, startDate, endDate) => {
    const departmentEmployees = initialEmployees.filter(e => e.department === department);
    const leavesInPeriod = leaveApplications.filter(app => {
      const appStart = new Date(app.startDate);
      const appEnd = new Date(app.endDate || app.startDate);
      return app.status === 'approved' &&
        appStart <= new Date(endDate) &&
        appEnd >= new Date(startDate);
    });

    const employeeLeaves = {};
    departmentEmployees.forEach(emp => {
      employeeLeaves[emp.id] = leavesInPeriod.filter(l => l.employeeId === emp.id);
    });

    return {
      totalEmployees: departmentEmployees.length,
      employeesOnLeave: Object.keys(employeeLeaves).filter(id => employeeLeaves[id].length > 0).length,
      coverage: ((departmentEmployees.length - Object.keys(employeeLeaves).filter(id => employeeLeaves[id].length > 0).length) / departmentEmployees.length * 100).toFixed(1),
      leaveDetails: employeeLeaves,
    };
  };

  // Handle leave application withdrawal
  const handleWithdrawApplication = (applicationId) => {
    const application = leaveApplications.find((a) => a.id === applicationId);
    if (!application) return;

    if (application.status !== "pending") {
      alert("Only pending applications can be withdrawn");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to withdraw this leave application?"
      )
    ) {
      dispatch({
        type: "UPDATE_LEAVE_APPLICATION",
        payload: { ...application, status: "withdrawn", withdrawnAt: new Date().toISOString() },
      });
      alert("Leave application withdrawn successfully");
    }
  };

  // Send notification (simulated)
  const sendNotification = (type, recipient, message) => {
    // In production, this would send actual email/push notifications
    console.log(`Notification [${type}] to ${recipient}: ${message}`);
    return true;
  };

  // ==================== FILTERED DATA ====================
  const safeLower = (v) => (v || "").toLowerCase();

  const filteredApplications = leaveApplications.filter((app) => {
    const search = safeLower(searchTerm);

    const matchesSearch =
      safeLower(app.appliedBy).includes(search) ||
      safeLower(app.leaveTypeName).includes(search);

    const matchesStatus =
      filterStatus === "All" ||
      safeLower(app.status) === safeLower(filterStatus);

    return matchesSearch && matchesStatus;
  });


  // ==================== RENDER FUNCTIONS ====================
  const renderLeaveTypes = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">

              {/* Title */}
              <h5 className="mb-0 d-flex align-items-center fw-semibold text-dark fs-4">
                <Settings size={18} className="me-2 text-primary" />
                Leave Type Configuration
              </h5>
              {/* Action Button */}
              <button
                className="btn btn-primary btn-sm d-flex align-items-center fw-medium"
                onClick={() => {
                  setEditingLeaveType(null);
                  setLeaveTypeForm({
                    name: "",
                    code: "",
                    isPaid: true,
                    accrualType: "monthly",
                    accrualAmount: 1,
                    maxAccrual: 12,
                    carryForward: { enabled: true, maxDays: 3, expiryMonths: 3 },
                    encashment: { enabled: false, maxDays: 0, rate: 0 },
                    allowNegative: false,
                    probationApplicable: false,
                    sandwichLeave: true,
                    allowBackdated: false,
                    allowHalfDay: true,
                    allowShortLeave: false,
                    isOptional: false,
                    usageLimit: null,
                    description: "",
                  });
                  setShowLeaveTypeModal(true);
                }}
              >
                <Plus size={16} className="me-2" />
                Add Leave Type
              </button>

            </div>

          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Leave Type</th>
                    <th>Code</th>
                    <th>Paid</th>
                    <th>Accrual</th>
                    <th>Carry Forward</th>
                    <th>Encashment</th>
                    <th>Half Day</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveTypes.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        <p className="text-muted mb-0">No leave types configured</p>
                      </td>
                    </tr>
                  ) : (
                    leaveTypes.map((lt) => (
                      <tr key={lt.id}>
                        <td>
                          <div className="fw-medium">{lt.name}</div>
                          {lt.description && (
                            <small className="text-muted">{lt.description}</small>
                          )}
                        </td>
                        <td>
                          <code>{lt.code}</code>
                        </td>
                        <td>
                          <span className={`badge bg-${lt.isPaid ? "success" : "secondary"}`}>
                            {lt.isPaid ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td>
                          <small>
                            {lt.accrualAmount}/{lt.accrualType === "monthly" ? "month" : "year"}
                          </small>
                        </td>
                        <td>
                          {lt.carryForward.enabled ? (
                            <small>
                              {lt.carryForward.maxDays} days ({lt.carryForward.expiryMonths}M)
                            </small>
                          ) : (
                            <span className="text-muted">No</span>
                          )}
                        </td>
                        <td>
                          {lt.encashment.enabled ? (
                            <small>
                              {lt.encashment.maxDays} days @ {lt.encashment.rate}x
                            </small>
                          ) : (
                            <span className="text-muted">No</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge bg-${lt.allowHalfDay ? "info" : "secondary"}`}>
                            {lt.allowHalfDay ? "Yes" : "No"}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success">Active</span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditLeaveType(lt)}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteLeaveType(lt.id)}
                            >
                              <Trash2 size={14} />
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
        </div>
      </div>
    </div>
  );

  const renderLeaveBalance = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center fw-semibold text-dark fs-4">
                <BarChart3 size={20} className="me-2 text-dark" />
                Leave Balance Management
              </h5>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm d-flex align-items-center"
                  onClick={processAutoAccrual}
                  title="Process monthly accrual"
                >
                  <RefreshCw size={16} className="me-2" />
                  <span>Auto Accrual</span>
                </button>

                <button
                  className="btn btn-warning btn-sm d-flex align-items-center"
                  onClick={processLeaveLapse}
                  title="Process expired carry-forward leaves"
                >
                  <AlertTriangle size={16} className="me-2" />
                  <span>Process Lapse</span>
                </button>

                <button
                  className="btn btn-info btn-sm d-flex align-items-center"
                  onClick={() => exportLeaveBalanceStatement(null, "csv")}
                  title="Export leave balance statement"
                >
                  <Download size={16} className="me-2" />
                  <span>Export Statement</span>
                </button>

                <button
                  className="btn btn-primary btn-sm d-flex align-items-center"
                  onClick={() => setShowBalanceModal(true)}
                >
                  <Plus size={16} className="me-2" />
                  <span>Adjust Balance</span>
                </button>
              </div>

            </div>
          </div>
          <div className="card-body">
            {leaveBalances.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5">
                <BarChart3 size={48} className="text-muted mb-3" />

                <p className="text-muted mb-3">No leave balances recorded</p>

                <button
                  className="btn btn-primary"
                  onClick={() => setShowBalanceModal(true)}
                >
                  Add Opening Balance
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Employee</th>
                      <th>Leave Type</th>
                      <th>Opening</th>
                      <th>Accrued</th>
                      <th>Used</th>
                      <th>Carry Forward</th>
                      <th>Encashed</th>
                      <th>Balance</th>
                      <th>Projected</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveBalances.map((balance) => {
                      const employee = initialEmployees.find(
                        (e) => e.id === balance.employeeId
                      );
                      const leaveType = leaveTypes.find(
                        (lt) => lt.id === balance.leaveTypeId
                      );
                      const projected = calculateProjectedBalance(
                        balance.employeeId,
                        balance.leaveTypeId
                      );

                      return (
                        <tr key={balance.id}>
                          <td>{employee?.name || balance.employeeId}</td>
                          <td>{leaveType?.name || "Unknown"}</td>
                          <td>{balance.openingBalance || 0}</td>
                          <td>
                            <span className="text-success">
                              <TrendingUp size={14} className="me-1" />
                              {balance.accrued || 0}
                            </span>
                          </td>
                          <td>
                            <span className="text-danger">
                              <TrendingDown size={14} className="me-1" />
                              {balance.used || 0}
                            </span>
                          </td>
                          <td>
                            <span className="text-info">
                              {balance.carryForward || 0}
                            </span>
                          </td>
                          <td>
                            <span className="text-warning">
                              <DollarSign size={14} className="me-1" />
                              {balance.encashed || 0}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${balance.balance >= 0 ? "success" : "danger"
                                }`}
                            >
                              {balance.balance || 0}
                            </span>
                          </td>
                          <td>
                            <small className="text-info">{projected.toFixed(1)}</small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                  setBalanceForm({
                                    ...balanceForm,
                                    employeeId: balance.employeeId,
                                    leaveTypeId: balance.leaveTypeId,
                                  });
                                  setShowBalanceModal(true);
                                }}
                                title="Edit Balance"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => exportLeaveBalanceStatement(balance.employeeId, 'csv')}
                                title="Export Statement"
                              >
                                <Download size={14} />
                              </button>
                              {leaveType?.encashment?.enabled && balance.balance > 0 && (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => {
                                    const days = prompt(
                                      `Enter days to encash (Max: ${leaveType.encashment.maxDays}):`
                                    );
                                    if (days) {
                                      processLeaveEncashment(
                                        balance.employeeId,
                                        balance.leaveTypeId,
                                        parseFloat(days)
                                      );
                                    }
                                  }}
                                  title="Encash Leave"
                                >
                                  <DollarSign size={14} />
                                </button>
                              )}
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
  );

  const renderLeaveApplications = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center fw-semibold text-dark fs-4">
              <FileText size={20} className="me-2 text-dark" />
              Leave Applications & Approval
            </h5>

            <button
              className="btn btn-primary btn-sm d-flex align-items-center"
              onClick={() => setShowApplicationModal(true)}
            >
              <Plus size={16} className="me-2" />
              <span>New Application</span>
            </button>
          </div>

          <div className="card-body">
            {/* Search & Filter - using the main component's state */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <p className="text-muted mb-0">No leave applications</p>
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => {
                      const employee = initialEmployees.find(
                        (e) => e.id === app.employeeId
                      );
                      return (
                        <tr key={app.id}>
                          <td>{employee?.name || app.employeeId}</td>
                          <td>
                            <span className="badge bg-info">
                              {app.leaveTypeName}
                            </span>
                          </td>
                          <td>
                            <small>
                              {app.startDate}
                              {app.endDate && app.endDate !== app.startDate
                                ? ` - ${app.endDate}`
                                : ""}
                              {app.halfDay && ` (${app.halfDayType} half)`}
                            </small>
                          </td>
                          <td>{app.days}</td>
                          <td>
                            <small>{app.reason || "N/A"}</small>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${app.status === "approved"
                                ? "success"
                                : app.status === "rejected"
                                  ? "danger"
                                  : "warning"
                                }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2 align-items-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                                onClick={() =>
                                  handleApproveApplication(app.id, true)
                                }
                                disabled={app.status === "approved"}
                                data-bs-toggle="tooltip"
                                title="Approve"
                              >
                                <Check size={14} />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleApproveApplication(app.id, false)
                                }
                                disabled={app.status === "rejected"}
                                data-bs-toggle="tooltip"
                                title="Reject"
                              >
                                <X size={14} />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleWithdrawApplication(app.id)}
                                data-bs-toggle="tooltip"
                                title="Withdraw"
                              >
                                <XCircle size={14} />
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                disabled={!app.attachment}
                                data-bs-toggle="tooltip"
                                title="View Attachment"
                                onClick={() =>
                                  app.attachment &&
                                  window.open(app.attachment, "_blank")
                                }
                              >
                                <Eye size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderLeaveCalendar = () => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    const getLeavesForDate = (day) => {
      if (!day) return [];
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return leaveApplications.filter(
        (app) =>
          app.status === "approved" &&
          app.startDate <= dateStr &&
          (app.endDate || app.startDate) >= dateStr
      );
    };

    // Get department-wise leave statistics
    const getDepartmentLeaves = () => {
      const deptMap = {};
      leaveApplications
        .filter((app) => app.status === "approved")
        .forEach((app) => {
          const employee = initialEmployees.find((e) => e.id === app.employeeId);
          const dept = employee?.department || "Unknown";
          if (!deptMap[dept]) {
            deptMap[dept] = { count: 0, employees: new Set() };
          }
          deptMap[dept].count += app.days;
          deptMap[dept].employees.add(app.employeeId);
        });
      return deptMap;
    };

    const departmentStats = getDepartmentLeaves();

    return (
      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center fw-semibold text-dark fs-4">
                  <Calendar size={20} className="me-2 text-dark" />
                  Leave Calendar & Planning
                </h5>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      const prevMonth = new Date(selectedDate);
                      prevMonth.setMonth(prevMonth.getMonth() - 1);
                      setSelectedDate(prevMonth);
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="align-self-center">
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      const nextMonth = new Date(selectedDate);
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      setSelectedDate(nextMonth);
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            </div>
            <div className="card-body">
              {/* Department-wise Statistics */}
              <div className="mb-4">
                <h6 className="mb-3 text-dark">
                  Department-wise Leave Summary
                </h6>


                <div className="dept-grid">
                  {Object.entries(departmentStats).map(([dept, stats]) => (
                    <div key={dept} className="dept-card">
                      <div className="fw-bold text-primary">{dept}</div>
                      <div className="small text-muted">
                        {stats.employees.size} employees,{" "}
                        {stats.count.toFixed(1)} days
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="calendar-wrapper">
                {/* Week Header */}
                <div className="calendar-header">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="calendar-day-name">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Body */}
                <div className="calendar-grid">
                  {calendarDays.map((day, index) => {
                    const leaves = getLeavesForDate(day);
                    const hasOverlap = leaves.length > 3;

                    return (
                      <div
                        key={index}
                        className={`calendar-cell ${hasOverlap ? "overlap" : ""
                          }`}
                      >
                        {day && (
                          <>
                            <div className="calendar-date">
                              <span>{day}</span>
                              {hasOverlap && (
                                <AlertTriangle
                                  size={12}
                                  className="warning-icon"
                                  title="High leave overlap"
                                />
                              )}
                            </div>

                            <div className="leave-list">
                              {leaves.slice(0, 3).map((leave) => {
                                const emp = initialEmployees.find(
                                  (e) => e.id === leave.employeeId
                                );

                                return (
                                  <div
                                    key={leave.id}
                                    className="leave-badge"
                                    title={`${emp?.name || leave.employeeId} - ${leave.leaveTypeName}`}
                                  >
                                    {(emp?.name?.split(" ")[0] ||
                                      leave.employeeId)}{" "}
                                    - {leave.leaveTypeName}
                                  </div>
                                );
                              })}

                              {leaves.length > 3 && (
                                <div className="more-text">
                                  +{leaves.length - 3} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CSS */}
              <style>{`
        /* Department cards */
        .dept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .dept-card {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 12px;
          background: #fff;
        }

        /* Calendar */
        .calendar-wrapper {
          margin-top: 16px;
        }

        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 8px;
        }

        .calendar-day-name {
          text-align: center;
          font-weight: 600;
          font-size: 13px;
          color: #6c757d;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }

        .calendar-cell {
          min-height: 110px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 6px;
          background: #fff;
        }

        .calendar-cell.overlap {
          background: rgba(255, 193, 7, 0.1);
        }

        .calendar-date {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .warning-icon {
          color: #ffc107;
        }

        .leave-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .leave-badge {
          background: #0dcaf0;
          color: #fff;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .more-text {
          font-size: 10px;
          font-weight: 600;
          color: #ffc107;
        }
      `}</style>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLeavePlanning = () => {
    const departments = [...new Set(initialEmployees.map(e => e.department))];
    const coverage = selectedDept === "All"
      ? departments.map(dept => calculateLeaveCoverage(dept, planningStartDate, planningEndDate))
      : [calculateLeaveCoverage(selectedDept, planningStartDate, planningEndDate)];

    const handleCreateCampaign = () => {
      const campaign = {
        id: Date.now(),
        ...campaignForm,
        createdAt: new Date().toISOString(),
        createdBy: "Admin",
      };
      setLeavePlanningCampaigns(prev => {
        const updated = [...prev, campaign];
        localStorage.setItem('leavePlanningCampaigns', JSON.stringify(updated));
        return updated;
      });
      setShowCampaignModal(false);
      setCampaignForm({
        name: "",
        period: "quarterly",
        startDate: "",
        endDate: "",
        targetDepartment: "All",
        message: "",
        status: "active",
      });
      alert("Leave planning campaign created successfully");
    };

    return (
      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center fw-semibold text-dark fs-4">
                  <CalendarDays size={20} className="me-2 text-dark" />
                  Leave Planning & Coverage
                </h5>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
                    onClick={() => setShowCampaignModal(true)}
                  >
                    <Plus size={16} />
                    <span>Create Campaign</span>
                  </button>

                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label
                    className="form-label mb-3 fw-semibold"
                    style={{ color: "#000000" }}
                  >
                    Department
                  </label>


                  <select
                    className="form-select"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label mb-3 fw-semibold"
                    style={{ color: "#000000" }} >Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={planningStartDate}
                    onChange={(e) => setPlanningStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label mb-3 fw-semibold"
                    style={{ color: "#000000" }}>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={planningEndDate}
                    onChange={(e) => setPlanningEndDate(e.target.value)}
                  />
                </div>
              </div>

              <h6 className="mb-0 d-flex align-items-center">
                Coverage Analysis
              </h6><br></br>

              <div className="row g-3 mb-4">
                {coverage.map((cov, idx) => (
                  <div key={idx} className="col-md-3">
                    <div className="card border">
                      <div className="card-body">
                        <div className="fw-bold text-primary">
                          {selectedDept === "All" ? departments[idx] : selectedDept}
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">Total Employees: {cov.totalEmployees}</small>
                          <br />
                          <small className="text-muted">On Leave: {cov.employeesOnLeave}</small>
                          <br />
                          <div className={`mt-2 badge bg-${parseFloat(cov.coverage) >= 80 ? 'success' : parseFloat(cov.coverage) >= 60 ? 'warning' : 'danger'}`}>
                            Coverage: {cov.coverage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h6 className="mb-0 d-flex align-items-center">
                Active Planning Campaigns
              </h6><br></br>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Campaign Name</th>
                      <th>Period</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leavePlanningCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <p className="text-muted mb-0">No planning campaigns</p>
                        </td>
                      </tr>
                    ) : (
                      leavePlanningCampaigns.map(campaign => (
                        <tr key={campaign.id}>
                          <td>{campaign.name}</td>
                          <td><span className="badge bg-info">{campaign.period}</span></td>
                          <td>{campaign.startDate}</td>
                          <td>{campaign.endDate}</td>
                          <td>{campaign.targetDepartment}</td>
                          <td>
                            <span className={`badge bg-${campaign.status === 'active' ? 'success' : 'secondary'}`}>
                              {campaign.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Modal */}
        {showCampaignModal && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Leave Planning Campaign</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCampaignModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Campaign Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={campaignForm.name}
                        onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Period *</label>
                      <select
                        className="form-select"
                        value={campaignForm.period}
                        onChange={(e) => setCampaignForm({ ...campaignForm, period: e.target.value })}
                      >
                        <option value="quarterly">Quarterly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Target Department</label>
                      <select
                        className="form-select"
                        value={campaignForm.targetDepartment}
                        onChange={(e) => setCampaignForm({ ...campaignForm, targetDepartment: e.target.value })}
                      >
                        <option value="All">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Start Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={campaignForm.startDate}
                        onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">End Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={campaignForm.endDate}
                        onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={campaignForm.message}
                        onChange={(e) => setCampaignForm({ ...campaignForm, message: e.target.value })}
                        placeholder="Campaign message to employees..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCampaignModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreateCampaign}
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderApprovalDelegation = () => {
    return (
      <div className="row g-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center fw-semibold text-dark fs-4">
                  <Users size={20} className="me-2 text-dark" />
                  Approval Delegation Management
                </h5>

                <button
                  className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
                  onClick={() => setShowDelegationModal(true)}
                >
                  <Plus size={16} />
                  <span>Setup Delegation</span>
                </button>

              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>From Approver</th>
                      <th>To Approver</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvalDelegations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <p className="text-muted mb-0">No approval delegations configured</p>
                        </td>
                      </tr>
                    ) : (
                      approvalDelegations.map(delegation => {
                        const isActive = delegation.isActive &&
                          new Date(delegation.startDate) <= new Date() &&
                          new Date(delegation.endDate) >= new Date();
                        return (
                          <tr key={delegation.id}>
                            <td>{delegation.fromApprover}</td>
                            <td>{delegation.toApprover}</td>
                            <td>{delegation.startDate}</td>
                            <td>{delegation.endDate}</td>
                            <td><small>{delegation.reason}</small></td>
                            <td>
                              <span className={`badge bg-${isActive ? 'success' : 'secondary'}`}>
                                {isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Delegation Modal */}
        {showDelegationModal && (
          <div
            className="modal show d-block"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1050,
            }}
          >
            <div className="modal-dialog modal-dialog-centered"> {/* Centered here */}
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Setup Approval Delegation</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDelegationModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">From Approver (Role) *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={delegationForm.fromApprover}
                        onChange={(e) =>
                          setDelegationForm({
                            ...delegationForm,
                            fromApprover: e.target.value,
                          })
                        }
                        placeholder="e.g., Manager, HR"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">To Approver (Role) *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={delegationForm.toApprover}
                        onChange={(e) =>
                          setDelegationForm({
                            ...delegationForm,
                            toApprover: e.target.value,
                          })
                        }
                        placeholder="e.g., Deputy Manager, HR Manager"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Start Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={delegationForm.startDate}
                        onChange={(e) =>
                          setDelegationForm({
                            ...delegationForm,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">End Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={delegationForm.endDate}
                        onChange={(e) =>
                          setDelegationForm({
                            ...delegationForm,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Reason *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={delegationForm.reason}
                        onChange={(e) =>
                          setDelegationForm({
                            ...delegationForm,
                            reason: e.target.value,
                          })
                        }
                        placeholder="Reason for delegation (e.g., On leave, Out of office)"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDelegationModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setupApprovalDelegation(
                        delegationForm.fromApprover,
                        delegationForm.toApprover,
                        delegationForm.startDate,
                        delegationForm.endDate,
                        delegationForm.reason
                      );
                      setShowDelegationModal(false);
                      setDelegationForm({
                        fromApprover: "",
                        toApprover: "",
                        startDate: "",
                        endDate: "",
                        reason: "",
                      });
                    }}
                  >
                    Setup Delegation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };

  const renderCompOff = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center fw-semibold text-dark fs-4">
                <Gift size={20} className="me-2 text-dark" />
                Compensatory Off Management
              </h5>

              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                onClick={() => setShowCompOffModal(true)}
              >
                <Plus size={16} />
                <span>Add Comp-Off</span>
              </button>

            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Earned Date</th>
                    <th>Hours</th>
                    <th>Source</th>
                    <th>Policy Type</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {compOffs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <p className="text-muted mb-0">No comp-off records</p>
                      </td>
                    </tr>
                  ) : (
                    compOffs.map((co) => {
                      const employee = initialEmployees.find((e) => e.id === co.employeeId);
                      const isExpired = co.expiryDate && new Date(co.expiryDate) < new Date();
                      return (
                        <tr key={co.id}>
                          <td>{employee?.name || co.employeeId}</td>
                          <td>{co.earnedDate}</td>
                          <td>
                            <span className="badge bg-success">{co.hours} hrs</span>
                          </td>
                          <td>
                            <span className="badge bg-info">{co.source}</span>
                          </td>
                          <td>
                            <span className={`badge bg-${co.policyType === 'compOff' ? 'success' : 'warning'}`}>
                              {co.policyType === 'compOff' ? 'Comp-Off' : 'Overtime'}
                            </span>
                          </td>
                          <td>
                            {co.expiryDate ? (
                              <small className={isExpired ? "text-danger" : "text-muted"}>
                                {co.expiryDate}
                                {isExpired && (
                                  <AlertTriangle size={12} className="ms-1" />
                                )}
                              </small>
                            ) : (
                              <span className="text-muted">No expiry</span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge bg-${co.status === "applied"
                                ? "secondary"
                                : isExpired
                                  ? "danger"
                                  : "success"
                                }`}
                            >
                              {co.status === "applied"
                                ? "Applied"
                                : isExpired
                                  ? "Expired"
                                  : "Available"}
                            </span>
                          </td>
                          <td>
                            {co.status === "available" && !co.applied && !isExpired ? (
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleApplyCompOff(co.id)}
                              >
                                Apply
                              </button>
                            ) : (
                              <span className="badge bg-secondary">Applied</span>
                            )}
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
            <CalendarDays size={22} className="me-2 text-dark" />
            Leave Management System
          </h5>

          <p className="text-muted">
            Manage leave types, balances, applications, calendar, and comp-off
          </p>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === "leaveTypes" ? "active" : ""
              }`}
            onClick={() => setActiveTab("leaveTypes")}
          >
            <Settings size={16} className="me-2" />
            <span>Leave Types</span>
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === "balance" ? "active" : ""
              }`}
            onClick={() => setActiveTab("balance")}
          >
            <BarChart3 size={16} className="me-2" />
            <span>Leave Balance</span>
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === "applications" ? "active" : ""
              }`}
            onClick={() => setActiveTab("applications")}
          >
            <FileText size={16} className="me-2" />
            <span>Applications</span>
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === "calendar" ? "active" : ""
              }`}
            onClick={() => setActiveTab("calendar")}
          >
            <Calendar size={16} className="me-2" />
            <span>Calendar</span>
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === "compOff" ? "active" : ""
              }`}
            onClick={() => setActiveTab("compOff")}
          >
            <Gift size={16} className="me-2" />
            <span>Comp-Off</span>
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === "planning" ? "active" : ""
              }`}
            onClick={() => setActiveTab("planning")}
          >
            <CalendarDays size={16} className="me-2" />
            <span>Planning</span>
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link d-flex align-items-center ${activeTab === "delegation" ? "active" : ""
              }`}
            onClick={() => setActiveTab("delegation")}
          >
            <Users size={16} className="me-2" />
            <span>Delegation</span>
          </button>
        </li>
      </ul>


      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "leaveTypes" && renderLeaveTypes()}
        {activeTab === "balance" && renderLeaveBalance()}
        {activeTab === "applications" && renderLeaveApplications()}
        {activeTab === "calendar" && renderLeaveCalendar()}
        {activeTab === "compOff" && renderCompOff()}
        {activeTab === "planning" && renderLeavePlanning()}
        {activeTab === "delegation" && renderApprovalDelegation()}
      </div>

      {/* Leave Type Modal */}
      {showLeaveTypeModal && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            overflowY: "auto",
            padding: "1rem",
          }}
        >
          {/* Smaller Modal Card */}
          <div className="modal-content shadow-lg rounded-4 w-100" style={{ maxWidth: "500px" }}>
            {/* Header */}
            <div className="modal-header bg-light">
              <h5 className="modal-title">
                {editingLeaveType ? "Edit Leave Type" : "Add New Leave Type"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowLeaveTypeModal(false);
                  setEditingLeaveType(null);
                }}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-3" style={{ maxHeight: "80vh", overflowY: "auto" }}>
              <div className="row g-3">

                {/* Leave Type Name */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Leave Type Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={leaveTypeForm.name}
                    onChange={(e) =>
                      setLeaveTypeForm({ ...leaveTypeForm, name: e.target.value })
                    }
                  />
                </div>

                {/* Code */}
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={leaveTypeForm.code}
                    onChange={(e) =>
                      setLeaveTypeForm({ ...leaveTypeForm, code: e.target.value })
                    }
                  />
                </div>

                {/* Accrual Type */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Accrual Type</label>
                  <select
                    className="form-select"
                    value={leaveTypeForm.accrualType}
                    onChange={(e) =>
                      setLeaveTypeForm({
                        ...leaveTypeForm,
                        accrualType: e.target.value,
                      })
                    }
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                    <option value="on-joining">On Joining</option>
                  </select>
                </div>

                {/* Accrual Amount */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Accrual Amount</label>
                  <input
                    type="number"
                    step="0.25"
                    className="form-control"
                    value={leaveTypeForm.accrualAmount}
                    onChange={(e) =>
                      setLeaveTypeForm({
                        ...leaveTypeForm,
                        accrualAmount: Number(e.target.value),
                      })
                    }
                  />
                </div>

                {/* Max Accrual */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Max Accrual (days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={leaveTypeForm.maxAccrual}
                    onChange={(e) =>
                      setLeaveTypeForm({
                        ...leaveTypeForm,
                        maxAccrual: Number(e.target.value),
                      })
                    }
                  />
                </div>

              </div>
            </div>


            {/* Footer */}
            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowLeaveTypeModal(false);
                  setEditingLeaveType(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center"
                onClick={handleAddLeaveType}
              >
                <Save size={16} className="me-2" />
                <span>{editingLeaveType ? "Update" : "Save"} Leave Type</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Leave Application Modal */}
      {showApplicationModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="card shadow-lg" style={{ maxWidth: "700px", width: "100%" }}>

            {/* Header */}
            <div className="card-header d-flex justify-content-between align-items-center border-bottom">
              <h6 className="mb-0 fw-semibold text-dark">
                New Leave Application
              </h6>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowApplicationModal(false)}
              />
            </div>

            {/* Body */}
            <div className="card-body">
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Employee <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select fs-6"
                    value={applicationForm.employeeId}
                    onChange={(e) =>
                      setApplicationForm({ ...applicationForm, employeeId: e.target.value })
                    }
                  >
                    <option value="">Select employee...</option>
                    {initialEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select fs-6"
                    value={applicationForm.leaveTypeId}
                    onChange={(e) =>
                      setApplicationForm({ ...applicationForm, leaveTypeId: e.target.value })
                    }
                  >
                    <option value="">Select leave type...</option>
                    {leaveTypes.map((lt) => (
                      <option key={lt.id} value={lt.id}>
                        {lt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Start Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control fs-6"
                    value={applicationForm.startDate}
                    onChange={(e) =>
                      setApplicationForm({ ...applicationForm, startDate: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium">End Date</label>
                  <input
                    type="date"
                    className="form-control fs-6"
                    value={applicationForm.endDate}
                    onChange={(e) =>
                      setApplicationForm({ ...applicationForm, endDate: e.target.value })
                    }
                  />
                </div>

                {applicationForm.leaveTypeId &&
                  leaveTypes.find((lt) => lt.id === applicationForm.leaveTypeId)?.allowHalfDay && (
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={applicationForm.halfDay}
                          onChange={(e) =>
                            setApplicationForm({ ...applicationForm, halfDay: e.target.checked })
                          }
                        />
                        <label className="form-check-label fw-medium">
                          Half Day Leave
                        </label>
                      </div>

                      {applicationForm.halfDay && (
                        <div className="mt-2">
                          <select
                            className="form-select fs-6"
                            value={applicationForm.halfDayType}
                            onChange={(e) =>
                              setApplicationForm({
                                ...applicationForm,
                                halfDayType: e.target.value,
                              })
                            }
                          >
                            <option value="first">First Half</option>
                            <option value="second">Second Half</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                <div className="col-12">
                  <label className="form-label fw-medium">
                    Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control fs-6"
                    rows="3"
                    value={applicationForm.reason}
                    onChange={(e) =>
                      setApplicationForm({ ...applicationForm, reason: e.target.value })
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-medium text-muted">
                    Attachment <small>(Medical Certificate, etc.)</small>
                  </label>
                  <input
                    type="file"
                    className="form-control fs-6"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        attachment: e.target.files[0],
                      })
                    }
                  />
                  {applicationForm.attachment && (
                    <small className="text-muted mt-1 d-block">
                      Selected: {applicationForm.attachment.name}
                    </small>
                  )}
                </div>

                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={applicationForm.isBulk}
                      onChange={(e) =>
                        setApplicationForm({ ...applicationForm, isBulk: e.target.checked })
                      }
                    />
                    <label className="form-check-label fw-medium text-muted">
                      Bulk Leave Application (Team Outing)
                    </label>
                  </div>

                  {applicationForm.isBulk && (
                    <div className="mt-2 border rounded p-2" style={{ maxHeight: "150px", overflowY: "auto" }}>
                      {initialEmployees.map((emp) => (
                        <div key={emp.id} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={applicationForm.bulkEmployees.includes(emp.id)}
                            onChange={(e) =>
                              setApplicationForm({
                                ...applicationForm,
                                bulkEmployees: e.target.checked
                                  ? [...applicationForm.bulkEmployees, emp.id]
                                  : applicationForm.bulkEmployees.filter((id) => id !== emp.id),
                              })
                            }
                          />
                          <label className="form-check-label">{emp.name}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="card-footer d-flex justify-content-end gap-2 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowApplicationModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                onClick={handleSubmitApplication}
              >
                <Send size={16} />
                Submit Application
              </button>
            </div>

          </div>
        </div>

      )}


      {/* Leave Balance Modal */}
      {showBalanceModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header border-bottom">
                <h6 className="modal-title fw-semibold text-dark d-flex align-items-center">
                  Adjust Leave Balance
                </h6>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBalanceModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row g-3">

                  <div className="col-12">
                    <label className="form-label fw-medium">
                      Employee <span className="text-danger">*</span>
                    </label>
                    <select className="form-select fs-6">
                      ...
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">
                      Leave Type <span className="text-danger">*</span>
                    </label>
                    <select className="form-select fs-6">
                      ...
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium text-muted">
                      Opening Balance <small>(for new joiners)</small>
                    </label>
                    <input className="form-control fs-6" type="number" />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">Adjustment Type</label>
                    <select className="form-select fs-6">
                      ...
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">Adjustment Amount</label>
                    <input className="form-control fs-6" type="number" />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">Effective Date</label>
                    <input className="form-control fs-6" type="date" />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">
                      Reason <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control fs-6"
                      rows="3"
                      placeholder="Reason for adjustment (e.g., Opening balance for mid-year joiner, Leave lapse, etc.)"
                    />
                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBalanceModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center gap-2"
                  onClick={handleAddBalance}
                >
                  <Save size={16} />
                  <span>Save Balance</span>
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comp-Off Modal */}
      {showCompOffModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Compensatory Off</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCompOffModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Employee *</label>
                    <select
                      className="form-select"
                      value={compOffForm.employeeId}
                      onChange={(e) =>
                        setCompOffForm({
                          ...compOffForm,
                          employeeId: e.target.value,
                        })
                      }
                    >
                      <option value="">Select employee...</option>
                      {initialEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Earned Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={compOffForm.earnedDate}
                      onChange={(e) =>
                        setCompOffForm({
                          ...compOffForm,
                          earnedDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Hours Earned *</label>
                    <input
                      type="number"
                      step="0.5"
                      className="form-control"
                      value={compOffForm.hours}
                      onChange={(e) =>
                        setCompOffForm({
                          ...compOffForm,
                          hours: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Source</label>
                    <select
                      className="form-select"
                      value={compOffForm.source}
                      onChange={(e) =>
                        setCompOffForm({
                          ...compOffForm,
                          source: e.target.value,
                        })
                      }
                    >
                      <option value="holiday">Holiday Working</option>
                      <option value="weekend">Weekend Working</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Policy Type *</label>
                    <select
                      className="form-select"
                      value={compOffForm.policyType}
                      onChange={(e) =>
                        setCompOffForm({
                          ...compOffForm,
                          policyType: e.target.value,
                        })
                      }
                    >
                      <option value="compOff">Compensatory Off (Leave Credit)</option>
                      <option value="overtime">Overtime (Monetary Payment)</option>
                    </select>
                    <small className="text-muted">
                      Comp-Off: Leave credit that can be used later. Overtime: Paid as monetary compensation.
                    </small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      className="form-control"
                      value={compOffForm.expiryDate}
                      onChange={(e) =>
                        setCompOffForm({
                          ...compOffForm,
                          expiryDate: e.target.value,
                        })
                      }
                    />
                    <small className="text-muted">
                      Leave empty for no expiry
                    </small>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={compOffForm.description}
                      onChange={(e) =>
                        setCompOffForm({
                          ...compOffForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Details about comp-off earning (e.g., Worked on Republic Day)"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCompOffModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center gap-2"
                  onClick={handleAddCompOff}
                >
                  <Save size={16} />
                  <span>Add Comp-Off</span>
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
