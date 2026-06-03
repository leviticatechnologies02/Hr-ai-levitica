import React, { useState, useEffect, useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Clock,
  Calendar,
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
  RefreshCw,
  Calendar as CalendarIcon,
  ArrowLeftRight,
  Bell,
  FileText,
  BarChart3,
  Filter,
  Search,
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
} from "lucide-react";

// ==================== REDUCER FOR STATE MANAGEMENT ====================
const shiftReducer = (state, action) => {
  switch (action.type) {
    case "SET_SHIFTS":
      return { ...state, shifts: action.payload };
    case "ADD_SHIFT":
      return { ...state, shifts: [...state.shifts, action.payload] };
    case "UPDATE_SHIFT":
      return {
        ...state,
        shifts: state.shifts.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case "DELETE_SHIFT":
      return {
        ...state,
        shifts: state.shifts.filter((s) => s.id !== action.payload),
      };
    case "SET_SHIFT_ASSIGNMENTS":
      return { ...state, shiftAssignments: action.payload };
    case "ADD_SHIFT_ASSIGNMENT":
      return {
        ...state,
        shiftAssignments: [...state.shiftAssignments, action.payload],
      };
    case "UPDATE_SHIFT_ASSIGNMENT":
      return {
        ...state,
        shiftAssignments: state.shiftAssignments.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case "SET_ROSTERS":
      return { ...state, rosters: action.payload };
    case "ADD_ROSTER":
      return { ...state, rosters: [...state.rosters, action.payload] };
    case "SET_SWAP_REQUESTS":
      return { ...state, swapRequests: action.payload };
    case "ADD_SWAP_REQUEST":
      return {
        ...state,
        swapRequests: [...state.swapRequests, action.payload],
      };
    case "UPDATE_SWAP_REQUEST":
      return {
        ...state,
        swapRequests: state.swapRequests.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case "SET_FLEXIBLE_ARRANGEMENTS":
      return { ...state, flexibleArrangements: action.payload };
    case "ADD_FLEXIBLE_ARRANGEMENT":
      return {
        ...state,
        flexibleArrangements: [...state.flexibleArrangements, action.payload],
      };
    case "SET_RULES":
      return { ...state, rules: action.payload };
    case "UPDATE_RULES":
      return { ...state, rules: { ...state.rules, ...action.payload } };
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

const initialShifts = [
  {
    id: 1,
    name: "General Shift",
    code: "GEN",
    type: "general",
    startTime: "09:00",
    endTime: "18:00",
    duration: 9,
    gracePeriod: 15,
    breakTimes: [
      { name: "Lunch Break", start: "13:00", end: "14:00", duration: 60, paid: false },
    ],
    weekOffs: ["Sunday"],
    differentialPay: 1.0,
    isActive: true,
    description: "Standard office hours",
    allowMultiplePerDay: false,
  },
  {
    id: 2,
    name: "Night Shift",
    code: "NIGHT",
    type: "night",
    startTime: "22:00",
    endTime: "06:00",
    duration: 8,
    gracePeriod: 15,
    breakTimes: [
      { name: "Dinner Break", start: "01:00", end: "01:30", duration: 30, paid: false },
    ],
    weekOffs: ["Sunday"],
    differentialPay: 1.25,
    isActive: true,
    description: "Night shift with differential pay",
    allowMultiplePerDay: false,
  },
  {
    id: 3,
    name: "Rotational Shift A",
    code: "ROT-A",
    type: "rotational",
    startTime: "08:00",
    endTime: "16:00",
    duration: 8,
    gracePeriod: 15,
    breakTimes: [
      { name: "Lunch Break", start: "12:00", end: "13:00", duration: 60, paid: false },
    ],
    weekOffs: ["Saturday", "Sunday"],
    differentialPay: 1.0,
    isActive: true,
    description: "Rotational shift pattern A",
    allowMultiplePerDay: false,
    rotationPattern: "weekly",
  },
  {
    id: 4,
    name: "Flexible Shift",
    code: "FLEX",
    type: "flexible",
    startTime: "08:00",
    endTime: "20:00",
    coreHours: { start: "10:00", end: "16:00" },
    duration: 8,
    gracePeriod: 15,
    breakTimes: [
      { name: "Lunch Break", start: "13:00", end: "14:00", duration: 60, paid: false },
    ],
    weekOffs: ["Sunday"],
    differentialPay: 1.0,
    isActive: true,
    description: "Flexible working hours",
    allowMultiplePerDay: true,
  },
];

const ShiftManagement = () => {
  const [activeTab, setActiveTab] = useState("shifts");
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showFlexibleModal, setShowFlexibleModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [rosterPeriod, setRosterPeriod] = useState("weekly");
  const [rosterStartDate, setRosterStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showNotifications, setShowNotifications] = useState(false);

  // Form states
  const [shiftForm, setShiftForm] = useState({
    name: "",
    code: "",
    type: "general",
    startTime: "09:00",
    endTime: "18:00",
    duration: 8,
    gracePeriod: 15,
    breakTimes: [],
    weekOffs: [],
    differentialPay: 1.0,
    isActive: true,
    description: "",
    allowMultiplePerDay: false,
    coreHours: { start: "10:00", end: "16:00" },
    rotationPattern: "weekly",
  });

  const [rosterForm, setRosterForm] = useState({
    name: "",
    period: "weekly",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    assignments: [],
  });

  const [swapForm, setSwapForm] = useState({
    employeeId: "",
    currentShiftId: "",
    requestedShiftId: "",
    swapDate: "",
    reason: "",
    swapWithEmployeeId: "",
  });

  const [flexibleForm, setFlexibleForm] = useState({
    employeeId: "",
    arrangementType: "flexible",
    coreHours: { start: "10:00", end: "16:00" },
    flexibleStart: "08:00",
    flexibleEnd: "20:00",
    remoteWorkDays: [],
    hybridSchedule: { officeDays: [], remoteDays: [] },
    compressedWeek: { enabled: false, workDays: 4, hoursPerDay: 10 },
  });

  // Load from localStorage
  const loadFromStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const initialState = {
    shifts: loadFromStorage("shiftMaster", initialShifts),
    shiftAssignments: loadFromStorage("shiftAssignments", []),
    rosters: loadFromStorage("shiftRosters", []),
    swapRequests: loadFromStorage("shiftSwapRequests", []),
    flexibleArrangements: loadFromStorage("flexibleArrangements", []),
    rules: loadFromStorage("shiftRules", {
      attendanceRules: {
        lateArrival: {
          gracePeriod: 15,
          deductionType: "perMinute",
          deductionAmount: 0.5,
          enabled: true,
          maxAllowed: 3,
          monthlyLimit: 30,
        },
        earlyDeparture: {
          allowed: false,
          penaltyType: "salaryDeduction",
          penaltyAmount: 1,
          requireApproval: true,
          gracePeriod: 10,
        },
        minWorkHours: 8,
        halfDayCriteria: {
          hours: 4,
          considerAsHalfDay: true,
          applyAfterHours: 5,
          markAsAbsentBelow: 3,
        },
        shortLeave: {
          maxDuration: 2,
          maxFrequency: 2,
          requiresApproval: true,
          autoDeduct: true,
        },
        continuousAbsence: {
          threshold: 3,
          autoAlert: true,
          escalationLevels: ["Manager", "HR", "Director"],
          notifyAfterDays: 2,
        },
        weekendWorking: {
          requiresApproval: true,
          compensationType: "extraPay",
          rate: 1.5,
          maxHours: 8,
          advanceNotice: 24,
        },
        holidayWorking: {
          requiresApproval: true,
          compensationType: "doublePay",
          rate: 2.0,
          canTakeCompOff: true,
          compOffValidity: 90,
          advanceApproval: true,
        },
      },
      overtime: {
        eligibility: {
          minWorkHours: 8,
          excludeWeekends: false,
          employeeLevels: ["permanent", "contract"],
          departments: ["all"],
          probationPeriod: 90,
          includeWFH: false,
        },
        calculation: {
          method: "multiplier",
          weekdayRate: 1.5,
          weekendRate: 2.0,
          holidayRate: 3.0,
          fixedRate: 0,
          nightShiftBonus: 0.25,
          roundToNearest: 0.25,
        },
        approvalWorkflow: {
          levels: ["Manager", "HR"],
          autoApproveAfter: 24,
          requireDocumentation: true,
          maxApprovalDays: 7,
        },
        caps: {
          daily: 4,
          weekly: 20,
          monthly: 48,
          quarterly: 120,
          yearly: 480,
        },
        compensation: {
          type: "pay",
          compOffValidity: 90,
          autoConvertToCompOff: false,
          conversionRate: 1.0,
          paymentCycle: "monthly",
        },
      },
      breakManagement: {
        breaks: [
          {
            name: "Lunch Break",
            start: "13:00",
            end: "14:00",
            duration: 60,
            paid: false,
            mandatory: true,
            autoDeduct: true,
          },
        ],
        multipleBreaks: true,
        maxBreakDuration: 120,
        breakPunchRequired: false,
        unpaidBreakThreshold: 30,
      },
    }),
  };

  const [state, dispatch] = useReducer(shiftReducer, initialState);
  const {
    shifts,
    shiftAssignments,
    rosters,
    swapRequests,
    flexibleArrangements,
    rules,
  } = state;

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("shiftMaster", JSON.stringify(shifts));
    localStorage.setItem("shiftAssignments", JSON.stringify(shiftAssignments));
    localStorage.setItem("shiftRosters", JSON.stringify(rosters));
    localStorage.setItem("shiftSwapRequests", JSON.stringify(swapRequests));
    localStorage.setItem("flexibleArrangements", JSON.stringify(flexibleArrangements));
    localStorage.setItem("shiftRules", JSON.stringify(rules));
  }, [state]);

  // ==================== SHIFT MASTER FUNCTIONS ====================
  const handleAddShift = () => {
    if (!shiftForm.name || !shiftForm.code) {
      alert("Please enter shift name and code");
      return;
    }

    const newShift = {
      id: editingShift ? editingShift.id : Date.now(),
      ...shiftForm,
      breakTimes: shiftForm.breakTimes || [],
    };

    if (editingShift) {
      dispatch({ type: "UPDATE_SHIFT", payload: newShift });
      alert("Shift updated successfully");
    } else {
      dispatch({ type: "ADD_SHIFT", payload: newShift });
      alert("Shift added successfully");
    }

    setShowShiftModal(false);
    setEditingShift(null);
    setShiftForm({
      name: "",
      code: "",
      type: "general",
      startTime: "09:00",
      endTime: "18:00",
      duration: 8,
      gracePeriod: 15,
      breakTimes: [],
      weekOffs: [],
      differentialPay: 1.0,
      isActive: true,
      description: "",
      allowMultiplePerDay: false,
      coreHours: { start: "10:00", end: "16:00" },
      rotationPattern: "weekly",
    });
  };

  const handleEditShift = (shift) => {
    setEditingShift(shift);
    setShiftForm({
      name: shift.name,
      code: shift.code,
      type: shift.type,
      startTime: shift.startTime,
      endTime: shift.endTime,
      duration: shift.duration,
      gracePeriod: shift.gracePeriod,
      breakTimes: shift.breakTimes || [],
      weekOffs: shift.weekOffs || [],
      differentialPay: shift.differentialPay,
      isActive: shift.isActive,
      description: shift.description || "",
      allowMultiplePerDay: shift.allowMultiplePerDay || false,
      coreHours: shift.coreHours || { start: "10:00", end: "16:00" },
      rotationPattern: shift.rotationPattern || "weekly",
    });
    setShowShiftModal(true);
  };

  const handleDeleteShift = (shiftId) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      dispatch({ type: "DELETE_SHIFT", payload: shiftId });
      alert("Shift deleted successfully");
    }
  };

  const addBreakTime = () => {
    setShiftForm({
      ...shiftForm,
      breakTimes: [
        ...shiftForm.breakTimes,
        {
          name: "Break",
          start: "13:00",
          end: "14:00",
          duration: 60,
          paid: false,
        },
      ],
    });
  };

  const updateBreakTime = (index, field, value) => {
    const updatedBreaks = [...shiftForm.breakTimes];
    updatedBreaks[index] = { ...updatedBreaks[index], [field]: value };
    setShiftForm({ ...shiftForm, breakTimes: updatedBreaks });
  };

  const removeBreakTime = (index) => {
    setShiftForm({
      ...shiftForm,
      breakTimes: shiftForm.breakTimes.filter((_, i) => i !== index),
    });
  };

  // ==================== SHIFT ASSIGNMENT FUNCTIONS ====================
  const handleBulkAssignShift = (shiftId, employeeIds) => {
    const shift = shifts.find(s => s.id === shiftId);
    const assignments = employeeIds.map((empId) => ({
      id: Date.now() + Math.random(),
      employeeId: empId,
      shiftId: shiftId,
      startDate: new Date().toISOString().split("T")[0],
      endDate: null,
      isActive: true,
      assignedBy: "Admin",
      assignedAt: new Date().toISOString(),
    }));

    assignments.forEach((assignment) => {
      dispatch({ type: "ADD_SHIFT_ASSIGNMENT", payload: assignment });
      
      // Send notification to each employee
      sendShiftChangeNotification('shift_assigned', {
        employeeId: assignment.employeeId,
        shiftId: shiftId,
        shiftName: shift?.name || "Unknown",
        startDate: assignment.startDate,
        message: `You have been assigned to ${shift?.name || "shift"} starting ${assignment.startDate}`,
      });
    });

    alert(`Shift assigned to ${assignments.length} employees. Notifications sent.`);
  };

  const handleIndividualAssignShift = (shiftId, employeeId, startDate, endDate) => {
    const shift = shifts.find(s => s.id === shiftId);
    const assignment = {
      id: Date.now(),
      employeeId,
      shiftId,
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: endDate || null,
      isActive: true,
      assignedBy: "Admin",
      assignedAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_SHIFT_ASSIGNMENT", payload: assignment });
    
    // Send notification
    sendShiftChangeNotification('shift_assigned', {
      employeeId,
      shiftId,
      shiftName: shift?.name || "Unknown",
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      message: `You have been assigned to ${shift?.name || "shift"} starting ${assignment.startDate}${assignment.endDate ? ` until ${assignment.endDate}` : ''}`,
    });
    
    alert("Shift assigned successfully. Notification sent to employee.");
  };

  // ==================== ROSTER FUNCTIONS ====================
  // Rotational shift scheduling function
  const generateRotationalRoster = (shift, startDate, period, rotationShifts = []) => {
    if (!shift || shift.type !== "rotational") {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(start);
    
    if (period === "weekly") {
      end.setDate(end.getDate() + 6);
    } else {
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }

    // Get all rotational shifts if not provided
    const availableShifts = rotationShifts.length > 0 
      ? rotationShifts 
      : shifts.filter(s => s.type === "rotational" && s.isActive);

    if (availableShifts.length === 0) {
      return null;
    }

    const rosterDays = [];
    const currentDate = new Date(start);
    let shiftIndex = 0;
    const rotationPattern = shift.rotationPattern || "weekly";
    let weekCounter = 0;

    while (currentDate <= end) {
      const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });
      const isWeekOff = shift.weekOffs.includes(dayOfWeek);
      
      // Determine which shift to assign based on rotation pattern
      let assignedShift = shift;
      
      if (rotationPattern === "weekly" && availableShifts.length > 1) {
        // Rotate weekly
        const weekNumber = Math.floor((currentDate - start) / (7 * 24 * 60 * 60 * 1000));
        shiftIndex = weekNumber % availableShifts.length;
        assignedShift = availableShifts[shiftIndex];
      } else if (rotationPattern === "daily" && availableShifts.length > 1) {
        // Rotate daily
        const dayNumber = Math.floor((currentDate - start) / (24 * 60 * 60 * 1000));
        shiftIndex = dayNumber % availableShifts.length;
        assignedShift = availableShifts[shiftIndex];
      } else if (rotationPattern === "biweekly" && availableShifts.length > 1) {
        // Rotate bi-weekly
        const weekNumber = Math.floor((currentDate - start) / (7 * 24 * 60 * 60 * 1000));
        shiftIndex = Math.floor(weekNumber / 2) % availableShifts.length;
        assignedShift = availableShifts[shiftIndex];
      }

      rosterDays.push({
        date: new Date(currentDate).toISOString().split("T")[0],
        day: dayOfWeek,
        shiftId: assignedShift.id,
        shiftName: assignedShift.name,
        shiftCode: assignedShift.code,
        isWeekOff,
        employees: [],
        rotationSequence: shiftIndex + 1,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      id: Date.now(),
      name: `${shift.name} Rotational Roster - ${startDate}`,
      shiftId: shift.id,
      period: period,
      startDate: startDate,
      endDate: end.toISOString().split("T")[0],
      days: rosterDays,
      status: "draft",
      published: false,
      rotationPattern: rotationPattern,
      rotationShifts: availableShifts.map(s => s.id),
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };
  };

  const generateRoster = () => {
    if (!selectedShift) {
      alert("Please select a shift");
      return;
    }

    // Check if it's a rotational shift
    if (selectedShift.type === "rotational") {
      const rotationalRoster = generateRotationalRoster(selectedShift, rosterStartDate, rosterPeriod);
      if (rotationalRoster) {
        dispatch({ type: "ADD_ROSTER", payload: rotationalRoster });
        alert(`Rotational roster generated successfully with ${selectedShift.rotationPattern || "weekly"} rotation pattern`);
        return;
      }
    }

    const startDate = new Date(rosterStartDate);
    const endDate = new Date(startDate);
    
    if (rosterPeriod === "weekly") {
      endDate.setDate(endDate.getDate() + 6);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0); // Last day of month
    }

    const rosterDays = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });
      const isWeekOff = selectedShift.weekOffs.includes(dayOfWeek);
      
      rosterDays.push({
        date: new Date(currentDate).toISOString().split("T")[0],
        day: dayOfWeek,
        shiftId: selectedShift.id,
        shiftName: selectedShift.name,
        isWeekOff,
        employees: [],
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const roster = {
      id: Date.now(),
      name: `${selectedShift.name} Roster - ${rosterStartDate}`,
      shiftId: selectedShift.id,
      period: rosterPeriod,
      startDate: rosterStartDate,
      endDate: endDate.toISOString().split("T")[0],
      days: rosterDays,
      status: "draft",
      published: false,
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };

    dispatch({ type: "ADD_ROSTER", payload: roster });
    setShowRosterModal(true);
    alert("Roster generated successfully");
  };

  // Notification system for shift changes
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('shiftNotifications');
    return stored ? JSON.parse(stored) : [];
  });

  const sendShiftChangeNotification = (type, data) => {
    const notification = {
      id: Date.now(),
      type, // 'shift_assigned', 'shift_swapped', 'roster_published', 'shift_changed'
      timestamp: new Date().toISOString(),
      ...data,
      read: false,
    };

    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, 100); // Keep last 100
      localStorage.setItem('shiftNotifications', JSON.stringify(updated));
      return updated;
    });

    // In production, this would send email/SMS notifications
    console.log('Notification sent:', notification);
  };

  const publishRoster = (rosterId) => {
    const roster = rosters.find((r) => r.id === rosterId);
    if (!roster) return;

    const updatedRoster = {
      ...roster,
      published: true,
      publishedAt: new Date().toISOString(),
      publishedBy: "Admin",
    };

    dispatch({ type: "SET_ROSTERS", payload: rosters.map((r) => r.id === rosterId ? updatedRoster : r) });
    
    // Get employees assigned to this roster
    const assignedEmployees = roster.days.reduce((acc, day) => {
      day.employees.forEach(empId => {
        if (!acc.includes(empId)) acc.push(empId);
      });
      return acc;
    }, []);

    // Send notifications to all assigned employees
    assignedEmployees.forEach(employeeId => {
      sendShiftChangeNotification('roster_published', {
        employeeId,
        rosterId: roster.id,
        rosterName: roster.name,
        startDate: roster.startDate,
        endDate: roster.endDate,
        message: `Your shift roster "${roster.name}" has been published for ${roster.startDate} to ${roster.endDate}`,
      });
    });
    
    alert(`Roster "${roster.name}" published successfully. Notifications sent to ${assignedEmployees.length} employees.`);
  };

  // ==================== SWAP REQUEST FUNCTIONS ====================
  const handleSwapRequest = () => {
    if (!swapForm.employeeId || !swapForm.currentShiftId || !swapForm.requestedShiftId || !swapForm.swapDate) {
      alert("Please fill all required fields");
      return;
    }

    const swapRequest = {
      id: Date.now(),
      ...swapForm,
      status: "pending",
      requestedAt: new Date().toISOString(),
      approvedBy: null,
      approvedAt: null,
      rejectedBy: null,
      rejectedAt: null,
      rejectionReason: null,
    };

    dispatch({ type: "ADD_SWAP_REQUEST", payload: swapRequest });
    setShowSwapModal(false);
    setSwapForm({
      employeeId: "",
      currentShiftId: "",
      requestedShiftId: "",
      swapDate: "",
      reason: "",
      swapWithEmployeeId: "",
    });
    alert("Shift swap request submitted successfully");
  };

  const handleSwapApproval = (requestId, approved) => {
    const request = swapRequests.find((r) => r.id === requestId);
    if (!request) return;

    const updatedRequest = {
      ...request,
      status: approved ? "approved" : "rejected",
      [approved ? "approvedBy" : "rejectedBy"]: "Manager",
      [approved ? "approvedAt" : "rejectedAt"]: new Date().toISOString(),
      rejectionReason: approved ? null : "Not approved by manager",
    };

    dispatch({ type: "UPDATE_SWAP_REQUEST", payload: updatedRequest });

    if (approved) {
      // Update shift assignment
      const assignment = shiftAssignments.find(
        (a) => a.employeeId === request.employeeId && a.isActive
      );
      if (assignment) {
        const oldShift = shifts.find(s => s.id === assignment.shiftId);
        const newShift = shifts.find(s => s.id === request.requestedShiftId);
        
        dispatch({
          type: "UPDATE_SHIFT_ASSIGNMENT",
          payload: { ...assignment, shiftId: request.requestedShiftId },
        });

        // Send notification to employee about shift swap approval
        sendShiftChangeNotification('shift_swapped', {
          employeeId: request.employeeId,
          requestId: request.id,
          oldShiftId: assignment.shiftId,
          oldShiftName: oldShift?.name || "Unknown",
          newShiftId: request.requestedShiftId,
          newShiftName: newShift?.name || "Unknown",
          swapDate: request.swapDate,
          message: `Your shift swap request has been approved. You will be on ${newShift?.name || "new shift"} starting ${request.swapDate}`,
        });

        // If swapping with another employee, notify them too
        if (request.swapWithEmployeeId) {
          sendShiftChangeNotification('shift_swapped', {
            employeeId: request.swapWithEmployeeId,
            requestId: request.id,
            oldShiftId: request.requestedShiftId,
            oldShiftName: newShift?.name || "Unknown",
            newShiftId: assignment.shiftId,
            newShiftName: oldShift?.name || "Unknown",
            swapDate: request.swapDate,
            message: `You have been swapped to ${oldShift?.name || "shift"} starting ${request.swapDate}`,
          });
        }
      }
      alert("Shift swap approved and assignment updated. Notifications sent.");
    } else {
      // Send rejection notification
      sendShiftChangeNotification('shift_swap_rejected', {
        employeeId: request.employeeId,
        requestId: request.id,
        reason: "Not approved by manager",
        message: `Your shift swap request for ${request.swapDate} has been rejected.`,
      });
      alert("Shift swap rejected. Notification sent to employee.");
    }
  };

  // ==================== FLEXIBLE ARRANGEMENT FUNCTIONS ====================
  const handleFlexibleArrangement = () => {
    if (!flexibleForm.employeeId) {
      alert("Please select an employee");
      return;
    }

    const arrangement = {
      id: Date.now(),
      ...flexibleForm,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };

    dispatch({ type: "ADD_FLEXIBLE_ARRANGEMENT", payload: arrangement });
    setShowFlexibleModal(false);
    setFlexibleForm({
      employeeId: "",
      arrangementType: "flexible",
      coreHours: { start: "10:00", end: "16:00" },
      flexibleStart: "08:00",
      flexibleEnd: "20:00",
      remoteWorkDays: [],
      hybridSchedule: { officeDays: [], remoteDays: [] },
      compressedWeek: { enabled: false, workDays: 4, hoursPerDay: 10 },
    });
    alert("Flexible work arrangement saved successfully");
  };

  // ==================== FILTERED DATA ====================
  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch =
      shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || shift.type === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  // ==================== RENDER FUNCTIONS ====================
  const renderShiftMaster = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <Clock size={20} className="me-2 text-primary" />
                Shift Master Setup
              </h5>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditingShift(null);
                  setShiftForm({
                    name: "",
                    code: "",
                    type: "general",
                    startTime: "09:00",
                    endTime: "18:00",
                    duration: 8,
                    gracePeriod: 15,
                    breakTimes: [],
                    weekOffs: [],
                    differentialPay: 1.0,
                    isActive: true,
                    description: "",
                    allowMultiplePerDay: false,
                    coreHours: { start: "10:00", end: "16:00" },
                    rotationPattern: "weekly",
                  });
                  setShowShiftModal(true);
                }}
              >
                <Plus size={16} className="me-2" />
                Add Shift
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search shifts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="general">General</option>
                  <option value="night">Night</option>
                  <option value="rotational">Rotational</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Shift Name</th>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Timing</th>
                    <th>Duration</th>
                    <th>Week Offs</th>
                    <th>Differential Pay</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShifts.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        <p className="text-muted mb-0">No shifts found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredShifts.map((shift) => (
                      <tr key={shift.id}>
                        <td>
                          <div className="fw-medium">{shift.name}</div>
                          {shift.description && (
                            <small className="text-muted">{shift.description}</small>
                          )}
                        </td>
                        <td>
                          <code>{shift.code}</code>
                        </td>
                        <td>
                          <span className={`badge bg-${
                            shift.type === "general" ? "primary" :
                            shift.type === "night" ? "dark" :
                            shift.type === "rotational" ? "info" :
                            "success"
                          }`}>
                            {shift.type}
                          </span>
                        </td>
                        <td>
                          <small>
                            {shift.startTime} - {shift.endTime}
                          </small>
                        </td>
                        <td>{shift.duration} hrs</td>
                        <td>
                          <small>{shift.weekOffs.join(", ") || "None"}</small>
                        </td>
                        <td>{shift.differentialPay}x</td>
                        <td>
                          <span className={`badge bg-${shift.isActive ? "success" : "secondary"}`}>
                            {shift.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditShift(shift)}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteShift(shift.id)}
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

  const renderShiftAssignment = () => (
    <div className="row g-4">
      <div className="col-12 col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <Users size={20} className="me-2 text-primary" />
              Bulk Shift Assignment
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Select Shift</label>
              <select
                className="form-select"
                onChange={(e) => setSelectedShift(shifts.find((s) => s.id === parseInt(e.target.value)))}
              >
                <option value="">Choose a shift...</option>
                {shifts.filter((s) => s.isActive).map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name} ({shift.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Select Employees</label>
              <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #dee2e6", borderRadius: "0.375rem", padding: "0.5rem" }}>
                {initialEmployees.map((emp) => (
                  <div key={emp.id} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`emp-${emp.id}`}
                      onChange={(e) => {
                        if (e.target.checked && selectedShift) {
                          handleBulkAssignShift(selectedShift.id, [emp.id]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor={`emp-${emp.id}`}>
                      {emp.name} ({emp.department})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <User size={20} className="me-2 text-primary" />
              Individual Assignment
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Employee</label>
              <select className="form-select">
                <option value="">Select employee...</option>
                {initialEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Shift</label>
              <select className="form-select">
                <option value="">Select shift...</option>
                {shifts.filter((s) => s.isActive).map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-control" />
              </div>
              <div className="col-6">
                <label className="form-label">End Date (Optional)</label>
                <input type="date" className="form-control" />
              </div>
            </div>
            <button className="btn btn-primary w-100">Assign Shift</button>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <Calendar size={20} className="me-2 text-primary" />
              Current Shift Assignments
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Shift</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shiftAssignments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <p className="text-muted mb-0">No shift assignments yet</p>
                      </td>
                    </tr>
                  ) : (
                    shiftAssignments.map((assignment) => {
                      const employee = initialEmployees.find((e) => e.id === assignment.employeeId);
                      const shift = shifts.find((s) => s.id === assignment.shiftId);
  return (
                        <tr key={assignment.id}>
                          <td>{employee?.name || assignment.employeeId}</td>
                          <td>{shift?.name || "Unknown"}</td>
                          <td>{assignment.startDate}</td>
                          <td>{assignment.endDate || "Ongoing"}</td>
                          <td>
                            <span className={`badge bg-${assignment.isActive ? "success" : "secondary"}`}>
                              {assignment.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <Edit size={14} />
                            </button>
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

  const renderRostering = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <CalendarCheck size={20} className="me-2 text-primary" />
              Create Shift Roster
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Select Shift</label>
                <select
                  className="form-select"
                  value={selectedShift?.id || ""}
                  onChange={(e) => setSelectedShift(shifts.find((s) => s.id === parseInt(e.target.value)))}
                >
                  <option value="">Choose a shift...</option>
                  {shifts.filter((s) => s.isActive).map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name} ({shift.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Period</label>
                <select
                  className="form-select"
                  value={rosterPeriod}
                  onChange={(e) => setRosterPeriod(e.target.value)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              {selectedShift?.type === "rotational" && (
                <div className="col-md-4">
                  <label className="form-label">Rotation Pattern</label>
                  <select
                    className="form-select"
                    value={selectedShift.rotationPattern || "weekly"}
                    onChange={(e) => {
                      const updatedShift = { ...selectedShift, rotationPattern: e.target.value };
                      setSelectedShift(updatedShift);
                      // Update shift in state
                      dispatch({ type: "UPDATE_SHIFT", payload: updatedShift });
                    }}
                  >
                    <option value="daily">Daily Rotation</option>
                    <option value="weekly">Weekly Rotation</option>
                    <option value="biweekly">Bi-Weekly Rotation</option>
                  </select>
                  <small className="text-muted">How often shifts rotate</small>
                </div>
              )}
              <div className="col-md-4">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={rosterStartDate}
                  onChange={(e) => setRosterStartDate(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-primary" onClick={generateRoster}>
              <CalendarIcon size={16} className="me-2" />
              Generate Roster
            </button>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <FileText size={20} className="me-2 text-primary" />
              Shift Rosters
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Roster Name</th>
                    <th>Shift</th>
                    <th>Period</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rosters.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <p className="text-muted mb-0">No rosters created yet</p>
                      </td>
                    </tr>
                  ) : (
                    rosters.map((roster) => {
                      const shift = shifts.find((s) => s.id === roster.shiftId);
                      return (
                        <tr key={roster.id}>
                          <td>{roster.name}</td>
                          <td>{shift?.name || "Unknown"}</td>
                          <td>
                            <span className="badge bg-info">{roster.period}</span>
                          </td>
                          <td>{roster.startDate}</td>
                          <td>{roster.endDate}</td>
                          <td>
                            <span className={`badge bg-${roster.status === "published" ? "success" : "warning"}`}>
                              {roster.status}
                            </span>
                            {roster.rotationPattern && (
                              <div className="mt-1">
                                <small className="badge bg-info">
                                  {roster.rotationPattern} rotation
                                </small>
                              </div>
                            )}
                          </td>
                          <td>
                            {roster.published ? (
                              <CheckCircle size={16} className="text-success" />
                            ) : (
                              <XCircle size={16} className="text-muted" />
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => publishRoster(roster.id)}
                                disabled={roster.published}
                              >
                                <Bell size={14} className="me-1" />
                                Publish
                              </button>
                              <button className="btn btn-sm btn-outline-primary">
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

  const renderSwapRequests = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <ArrowLeftRight size={20} className="me-2 text-primary" />
                Shift Swap Requests
              </h5>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowSwapModal(true)}
              >
                <Plus size={16} className="me-2" />
                New Swap Request
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Current Shift</th>
                    <th>Requested Shift</th>
                    <th>Swap Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {swapRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <p className="text-muted mb-0">No swap requests</p>
                      </td>
                    </tr>
                  ) : (
                    swapRequests.map((request) => {
                      const employee = initialEmployees.find((e) => e.id === request.employeeId);
                      const currentShift = shifts.find((s) => s.id === request.currentShiftId);
                      const requestedShift = shifts.find((s) => s.id === request.requestedShiftId);
                      return (
                        <tr key={request.id}>
                          <td>{employee?.name || request.employeeId}</td>
                          <td>{currentShift?.name || "Unknown"}</td>
                          <td>{requestedShift?.name || "Unknown"}</td>
                          <td>{request.swapDate}</td>
                          <td>
                            <small>{request.reason || "N/A"}</small>
                          </td>
                          <td>
                            <span className={`badge bg-${
                              request.status === "approved" ? "success" :
                              request.status === "rejected" ? "danger" :
                              "warning"
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td>
                            {request.status === "pending" && (
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleSwapApproval(request.id, true)}
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleSwapApproval(request.id, false)}
                                >
                                  <X size={14} />
                                </button>
                              </div>
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

  const renderFlexibleArrangements = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <Briefcase size={20} className="me-2 text-primary" />
                Flexible Work Arrangements
              </h5>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowFlexibleModal(true)}
              >
                <Plus size={16} className="me-2" />
                Add Arrangement
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Core Hours</th>
                    <th>Flexible Window</th>
                    <th>Remote Days</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flexibleArrangements.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <p className="text-muted mb-0">No flexible arrangements configured</p>
                      </td>
                    </tr>
                  ) : (
                    flexibleArrangements.map((arrangement) => {
                      const employee = initialEmployees.find((e) => e.id === arrangement.employeeId);
                      return (
                        <tr key={arrangement.id}>
                          <td>{employee?.name || arrangement.employeeId}</td>
                          <td>
                            <span className="badge bg-info">{arrangement.arrangementType}</span>
                          </td>
                          <td>
                            {arrangement.coreHours?.start} - {arrangement.coreHours?.end}
                          </td>
                          <td>
                            {arrangement.flexibleStart} - {arrangement.flexibleEnd}
                          </td>
                          <td>
                            {arrangement.arrangementType === "hybrid" ? (
                              <div>
                                <small className="d-block">Office: {arrangement.hybridSchedule?.officeDays?.length || 0} days</small>
                                <small className="d-block">Remote: {arrangement.hybridSchedule?.remoteDays?.length || 0} days</small>
                              </div>
                            ) : arrangement.arrangementType === "compressed" ? (
                              <div>
                                <small className="d-block">{arrangement.compressedWeek?.workDays || 0} days/week</small>
                                <small className="d-block">{arrangement.compressedWeek?.hoursPerDay || 0} hrs/day</small>
                              </div>
                            ) : (
                              <span>{arrangement.remoteWorkDays?.length || 0} days</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge bg-${arrangement.isActive ? "success" : "secondary"}`}>
                              {arrangement.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <Edit size={14} />
                            </button>
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

  const renderWorkHourRules = () => (
    <div className="row g-4">
      <div className="col-12 col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <Settings size={20} className="me-2 text-primary" />
              Attendance Rules
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Late Arrival Grace Period (minutes)</label>
              <input
                type="number"
                className="form-control"
                value={rules.attendanceRules.lateArrival.gracePeriod}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RULES",
                    payload: {
                      attendanceRules: {
                        ...rules.attendanceRules,
                        lateArrival: {
                          ...rules.attendanceRules.lateArrival,
                          gracePeriod: parseInt(e.target.value),
                        },
                      },
                    },
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Minimum Work Hours</label>
              <input
                type="number"
                className="form-control"
                value={rules.attendanceRules.minWorkHours}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RULES",
                    payload: {
                      attendanceRules: {
                        ...rules.attendanceRules,
                        minWorkHours: parseInt(e.target.value),
                      },
                    },
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Half-Day Threshold (hours)</label>
              <input
                type="number"
                step="0.5"
                className="form-control"
                value={rules.attendanceRules.halfDayCriteria.hours}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RULES",
                    payload: {
                      attendanceRules: {
                        ...rules.attendanceRules,
                        halfDayCriteria: {
                          ...rules.attendanceRules.halfDayCriteria,
                          hours: parseFloat(e.target.value),
                        },
                      },
                    },
                  })
                }
              />
            </div>
            <div className="mb-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={rules.attendanceRules.weekendWorking.requiresApproval}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_RULES",
                      payload: {
                        attendanceRules: {
                          ...rules.attendanceRules,
                          weekendWorking: {
                            ...rules.attendanceRules.weekendWorking,
                            requiresApproval: e.target.checked,
                          },
                        },
                      },
                    })
                  }
                />
                <label className="form-check-label">Weekend Working Requires Approval</label>
              </div>
            </div>
            <div className="mb-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={rules.attendanceRules.holidayWorking.requiresApproval}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_RULES",
                      payload: {
                        attendanceRules: {
                          ...rules.attendanceRules,
                          holidayWorking: {
                            ...rules.attendanceRules.holidayWorking,
                            requiresApproval: e.target.checked,
                          },
                        },
                      },
                    })
                  }
                />
                <label className="form-check-label">Holiday Working Requires Approval</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <Clock size={20} className="me-2 text-primary" />
              Overtime Rules
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Weekday Overtime Rate</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={rules.overtime.calculation.weekdayRate}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RULES",
                    payload: {
                      overtime: {
                        ...rules.overtime,
                        calculation: {
                          ...rules.overtime.calculation,
                          weekdayRate: parseFloat(e.target.value),
                        },
                      },
                    },
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Weekend Overtime Rate</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={rules.overtime.calculation.weekendRate}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RULES",
                    payload: {
                      overtime: {
                        ...rules.overtime,
                        calculation: {
                          ...rules.overtime.calculation,
                          weekendRate: parseFloat(e.target.value),
                        },
                      },
                    },
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Holiday Overtime Rate</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                value={rules.overtime.calculation.holidayRate}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RULES",
                    payload: {
                      overtime: {
                        ...rules.overtime,
                        calculation: {
                          ...rules.overtime.calculation,
                          holidayRate: parseFloat(e.target.value),
                        },
                      },
                    },
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Daily Overtime Cap (hours)</label>
              <input
                type="number"
                step="0.5"
                className="form-control"
                value={rules.overtime.caps.daily}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RULES",
                    payload: {
                      overtime: {
                        ...rules.overtime,
                        caps: {
                          ...rules.overtime.caps,
                          daily: parseFloat(e.target.value),
                        },
                      },
                    },
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Weekly Overtime Cap (hours)</label>
              <input
                type="number"
                step="0.5"
                className="form-control"
                value={rules.overtime.caps.weekly}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_RULES",
                    payload: {
                      overtime: {
                        ...rules.overtime,
                        caps: {
                          ...rules.overtime.caps,
                          weekly: parseFloat(e.target.value),
                        },
                      },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <Coffee size={20} className="me-2 text-primary" />
              Break Management
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={rules.breakManagement.multipleBreaks}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_RULES",
                        payload: {
                          breakManagement: {
                            ...rules.breakManagement,
                            multipleBreaks: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                  <label className="form-check-label">Allow Multiple Breaks</label>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Max Break Duration (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={rules.breakManagement.maxBreakDuration}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_RULES",
                      payload: {
                        breakManagement: {
                          ...rules.breakManagement,
                          maxBreakDuration: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={rules.breakManagement.breakPunchRequired}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_RULES",
                        payload: {
                          breakManagement: {
                            ...rules.breakManagement,
                            breakPunchRequired: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                  <label className="form-check-label">Break Punch Required</label>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Unpaid Break Threshold (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={rules.breakManagement.unpaidBreakThreshold}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_RULES",
                      payload: {
                        breakManagement: {
                          ...rules.breakManagement,
                          unpaidBreakThreshold: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                />
              </div>
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
          <h4 className="mb-2">Shift Management & Rostering</h4>
          <p className="text-muted">
            Manage shifts, rosters, flexible work arrangements, and work hour rules
          </p>
        </div>
      </div>

      {/* Notifications Badge */}
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-outline-primary position-relative"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={16} className="me-2" />
          Notifications
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Shift Change Notifications</h6>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                localStorage.setItem('shiftNotifications', JSON.stringify(notifications.map(n => ({ ...n, read: true }))));
              }}
            >
              Mark All Read
            </button>
          </div>
          <div className="card-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <p className="text-muted text-center mb-0">No notifications</p>
            ) : (
              notifications.slice(0, 20).map((notification) => (
                <div
                  key={notification.id}
                  className={`alert alert-${notification.read ? 'light' : 'info'} mb-2`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setNotifications(prev =>
                      prev.map(n =>
                        n.id === notification.id ? { ...n, read: true } : n
                      )
                    );
                    localStorage.setItem('shiftNotifications', JSON.stringify(
                      notifications.map(n =>
                        n.id === notification.id ? { ...n, read: true } : n
                      )
                    ));
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{notification.type.replace(/_/g, ' ').toUpperCase()}</strong>
                      <p className="mb-0 mt-1">{notification.message}</p>
                      <small className="text-muted">
                        {new Date(notification.timestamp).toLocaleString()}
                      </small>
                    </div>
                    {!notification.read && (
                      <span className="badge bg-primary">New</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "shifts" ? "active" : ""}`}
            onClick={() => setActiveTab("shifts")}
          >
            <Clock size={16} className="me-2" />
            Shift Master
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "assignment" ? "active" : ""}`}
            onClick={() => setActiveTab("assignment")}
          >
            <Users size={16} className="me-2" />
            Shift Assignment
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "rostering" ? "active" : ""}`}
            onClick={() => setActiveTab("rostering")}
          >
            <CalendarCheck size={16} className="me-2" />
            Rostering
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "swap" ? "active" : ""}`}
            onClick={() => setActiveTab("swap")}
          >
            <ArrowLeftRight size={16} className="me-2" />
            Shift Swap
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "flexible" ? "active" : ""}`}
            onClick={() => setActiveTab("flexible")}
          >
            <Briefcase size={16} className="me-2" />
            Flexible Work
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "rules" ? "active" : ""}`}
            onClick={() => setActiveTab("rules")}
          >
            <Settings size={16} className="me-2" />
            Work Hour Rules
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "shifts" && renderShiftMaster()}
        {activeTab === "assignment" && renderShiftAssignment()}
        {activeTab === "rostering" && renderRostering()}
        {activeTab === "swap" && renderSwapRequests()}
        {activeTab === "flexible" && renderFlexibleArrangements()}
        {activeTab === "rules" && renderWorkHourRules()}
      </div>

      {/* Shift Modal */}
      {showShiftModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingShift ? "Edit Shift" : "Add New Shift"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowShiftModal(false);
                    setEditingShift(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Shift Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shiftForm.name}
                      onChange={(e) =>
                        setShiftForm({ ...shiftForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Shift Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shiftForm.code}
                      onChange={(e) =>
                        setShiftForm({ ...shiftForm, code: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Shift Type</label>
                    <select
                      className="form-select"
                      value={shiftForm.type}
                      onChange={(e) =>
                        setShiftForm({ ...shiftForm, type: e.target.value })
                      }
                    >
                      <option value="general">General</option>
                      <option value="night">Night</option>
                      <option value="rotational">Rotational</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  {shiftForm.type === "rotational" && (
                    <div className="col-md-6">
                      <label className="form-label">Rotation Pattern</label>
                      <select
                        className="form-select"
                        value={shiftForm.rotationPattern || "weekly"}
                        onChange={(e) =>
                          setShiftForm({ ...shiftForm, rotationPattern: e.target.value })
                        }
                      >
                        <option value="daily">Daily Rotation</option>
                        <option value="weekly">Weekly Rotation</option>
                        <option value="biweekly">Bi-Weekly Rotation</option>
                      </select>
                      <small className="text-muted">How often shifts rotate (daily, weekly, or bi-weekly)</small>
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="form-label">Duration (hours)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={shiftForm.duration}
                      onChange={(e) =>
                        setShiftForm({
                          ...shiftForm,
                          duration: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={shiftForm.startTime}
                      onChange={(e) =>
                        setShiftForm({ ...shiftForm, startTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={shiftForm.endTime}
                      onChange={(e) =>
                        setShiftForm({ ...shiftForm, endTime: e.target.value })
                      }
                    />
                  </div>
                  {shiftForm.type === "flexible" && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Core Hours Start</label>
                        <input
                          type="time"
                          className="form-control"
                          value={shiftForm.coreHours.start}
                          onChange={(e) =>
                            setShiftForm({
                              ...shiftForm,
                              coreHours: {
                                ...shiftForm.coreHours,
                                start: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Core Hours End</label>
                        <input
                          type="time"
                          className="form-control"
                          value={shiftForm.coreHours.end}
                          onChange={(e) =>
                            setShiftForm({
                              ...shiftForm,
                              coreHours: {
                                ...shiftForm.coreHours,
                                end: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                  <div className="col-md-6">
                    <label className="form-label">Grace Period (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={shiftForm.gracePeriod}
                      onChange={(e) =>
                        setShiftForm({
                          ...shiftForm,
                          gracePeriod: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Differential Pay Multiplier</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={shiftForm.differentialPay}
                      onChange={(e) =>
                        setShiftForm({
                          ...shiftForm,
                          differentialPay: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Week Offs</label>
                    <div className="d-flex flex-wrap gap-2">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={shiftForm.weekOffs.includes(day)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setShiftForm({
                                  ...shiftForm,
                                  weekOffs: [...shiftForm.weekOffs, day],
                                });
                              } else {
                                setShiftForm({
                                  ...shiftForm,
                                  weekOffs: shiftForm.weekOffs.filter((d) => d !== day),
                                });
                              }
                            }}
                          />
                          <label className="form-check-label">{day}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label mb-0">Break Times</label>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={addBreakTime}
                      >
                        <Plus size={14} className="me-1" />
                        Add Break
                      </button>
                    </div>
                    {shiftForm.breakTimes.map((breakTime, index) => (
                      <div key={index} className="card mb-2">
                        <div className="card-body">
                          <div className="row g-2">
                            <div className="col-md-3">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Break Name"
                                value={breakTime.name}
                                onChange={(e) =>
                                  updateBreakTime(index, "name", e.target.value)
                                }
                              />
                            </div>
                            <div className="col-md-3">
                              <input
                                type="time"
                                className="form-control form-control-sm"
                                value={breakTime.start}
                                onChange={(e) =>
                                  updateBreakTime(index, "start", e.target.value)
                                }
                              />
                            </div>
                            <div className="col-md-3">
                              <input
                                type="time"
                                className="form-control form-control-sm"
                                value={breakTime.end}
                                onChange={(e) =>
                                  updateBreakTime(index, "end", e.target.value)
                                }
                              />
                            </div>
                            <div className="col-md-2">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={breakTime.paid}
                                  onChange={(e) =>
                                    updateBreakTime(index, "paid", e.target.checked)
                                  }
                                />
                                <label className="form-check-label small">Paid</label>
                              </div>
                            </div>
                            <div className="col-md-1">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeBreakTime(index)}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={shiftForm.description}
                      onChange={(e) =>
                        setShiftForm({ ...shiftForm, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={shiftForm.allowMultiplePerDay}
                        onChange={(e) =>
                          setShiftForm({
                            ...shiftForm,
                            allowMultiplePerDay: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label">
                        Allow Multiple Shifts Per Day
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={shiftForm.isActive}
                        onChange={(e) =>
                          setShiftForm({ ...shiftForm, isActive: e.target.checked })
                        }
                      />
                      <label className="form-check-label">Active</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowShiftModal(false);
                    setEditingShift(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddShift}
                >
                  <Save size={16} className="me-2" />
                  {editingShift ? "Update" : "Save"} Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Shift Swap Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSwapModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Employee</label>
                  <select
                    className="form-select"
                    value={swapForm.employeeId}
                    onChange={(e) =>
                      setSwapForm({ ...swapForm, employeeId: e.target.value })
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
                <div className="mb-3">
                  <label className="form-label">Current Shift</label>
                  <select
                    className="form-select"
                    value={swapForm.currentShiftId}
                    onChange={(e) =>
                      setSwapForm({ ...swapForm, currentShiftId: e.target.value })
                    }
                  >
                    <option value="">Select shift...</option>
                    {shifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Requested Shift</label>
                  <select
                    className="form-select"
                    value={swapForm.requestedShiftId}
                    onChange={(e) =>
                      setSwapForm({ ...swapForm, requestedShiftId: e.target.value })
                    }
                  >
                    <option value="">Select shift...</option>
                    {shifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Swap Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={swapForm.swapDate}
                    onChange={(e) =>
                      setSwapForm({ ...swapForm, swapDate: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Reason</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={swapForm.reason}
                    onChange={(e) =>
                      setSwapForm({ ...swapForm, reason: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSwapModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSwapRequest}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flexible Arrangement Modal */}
      {showFlexibleModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Flexible Work Arrangement</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFlexibleModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Employee</label>
                    <select
                      className="form-select"
                      value={flexibleForm.employeeId}
                      onChange={(e) =>
                        setFlexibleForm({ ...flexibleForm, employeeId: e.target.value })
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
                    <label className="form-label">Arrangement Type</label>
                    <select
                      className="form-select"
                      value={flexibleForm.arrangementType}
                      onChange={(e) =>
                        setFlexibleForm({
                          ...flexibleForm,
                          arrangementType: e.target.value,
                        })
                      }
                    >
                      <option value="flexible">Flexible Timing</option>
                      <option value="hybrid">Hybrid Work</option>
                      <option value="compressed">Compressed Week</option>
                      <option value="remote">Remote Work</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Core Hours Start</label>
                    <input
                      type="time"
                      className="form-control"
                      value={flexibleForm.coreHours.start}
                      onChange={(e) =>
                        setFlexibleForm({
                          ...flexibleForm,
                          coreHours: {
                            ...flexibleForm.coreHours,
                            start: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Core Hours End</label>
                    <input
                      type="time"
                      className="form-control"
                      value={flexibleForm.coreHours.end}
                      onChange={(e) =>
                        setFlexibleForm({
                          ...flexibleForm,
                          coreHours: {
                            ...flexibleForm.coreHours,
                            end: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Flexible Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={flexibleForm.flexibleStart}
                      onChange={(e) =>
                        setFlexibleForm({
                          ...flexibleForm,
                          flexibleStart: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Flexible End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={flexibleForm.flexibleEnd}
                      onChange={(e) =>
                        setFlexibleForm({
                          ...flexibleForm,
                          flexibleEnd: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* Remote Work Day Marking */}
                  {(flexibleForm.arrangementType === "remote" || flexibleForm.arrangementType === "flexible") && (
                    <div className="col-12">
                      <label className="form-label">Remote Work Days</label>
                      <div className="d-flex flex-wrap gap-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <div key={day} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={flexibleForm.remoteWorkDays.includes(day)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFlexibleForm({
                                    ...flexibleForm,
                                    remoteWorkDays: [...flexibleForm.remoteWorkDays, day],
                                  });
                                } else {
                                  setFlexibleForm({
                                    ...flexibleForm,
                                    remoteWorkDays: flexibleForm.remoteWorkDays.filter((d) => d !== day),
                                  });
                                }
                              }}
                            />
                            <label className="form-check-label">{day}</label>
                          </div>
                        ))}
                      </div>
                      <small className="text-muted">Select days when employee works remotely</small>
                    </div>
                  )}

                  {/* Hybrid Work Schedule Management */}
                  {flexibleForm.arrangementType === "hybrid" && (
                    <>
                      <div className="col-12">
                        <label className="form-label">Office Days</label>
                        <div className="d-flex flex-wrap gap-2">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <div key={day} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={flexibleForm.hybridSchedule.officeDays.includes(day)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFlexibleForm({
                                      ...flexibleForm,
                                      hybridSchedule: {
                                        ...flexibleForm.hybridSchedule,
                                        officeDays: [...flexibleForm.hybridSchedule.officeDays, day],
                                        remoteDays: flexibleForm.hybridSchedule.remoteDays.filter((d) => d !== day),
                                      },
                                    });
                                  } else {
                                    setFlexibleForm({
                                      ...flexibleForm,
                                      hybridSchedule: {
                                        ...flexibleForm.hybridSchedule,
                                        officeDays: flexibleForm.hybridSchedule.officeDays.filter((d) => d !== day),
                                      },
                                    });
                                  }
                                }}
                              />
                              <label className="form-check-label">{day}</label>
                            </div>
                          ))}
                        </div>
                        <small className="text-muted">Select days when employee works from office</small>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Remote Days</label>
                        <div className="d-flex flex-wrap gap-2">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <div key={day} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={flexibleForm.hybridSchedule.remoteDays.includes(day)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFlexibleForm({
                                      ...flexibleForm,
                                      hybridSchedule: {
                                        ...flexibleForm.hybridSchedule,
                                        remoteDays: [...flexibleForm.hybridSchedule.remoteDays, day],
                                        officeDays: flexibleForm.hybridSchedule.officeDays.filter((d) => d !== day),
                                      },
                                    });
                                  } else {
                                    setFlexibleForm({
                                      ...flexibleForm,
                                      hybridSchedule: {
                                        ...flexibleForm.hybridSchedule,
                                        remoteDays: flexibleForm.hybridSchedule.remoteDays.filter((d) => d !== day),
                                      },
                                    });
                                  }
                                }}
                              />
                              <label className="form-check-label">{day}</label>
                            </div>
                          ))}
                        </div>
                        <small className="text-muted">Select days when employee works remotely</small>
                      </div>
                    </>
                  )}

                  {/* Compressed Work Week Support */}
                  {flexibleForm.arrangementType === "compressed" && (
                    <>
                      <div className="col-12">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={flexibleForm.compressedWeek.enabled}
                            onChange={(e) =>
                              setFlexibleForm({
                                ...flexibleForm,
                                compressedWeek: {
                                  ...flexibleForm.compressedWeek,
                                  enabled: e.target.checked,
                                },
                              })
                            }
                          />
                          <label className="form-check-label">Enable Compressed Work Week</label>
                        </div>
                      </div>
                      {flexibleForm.compressedWeek.enabled && (
                        <>
                          <div className="col-md-6">
                            <label className="form-label">Work Days Per Week</label>
                            <input
                              type="number"
                              className="form-control"
                              min="3"
                              max="5"
                              value={flexibleForm.compressedWeek.workDays}
                              onChange={(e) =>
                                setFlexibleForm({
                                  ...flexibleForm,
                                  compressedWeek: {
                                    ...flexibleForm.compressedWeek,
                                    workDays: parseInt(e.target.value) || 4,
                                  },
                                })
                              }
                            />
                            <small className="text-muted">Typically 4 days (e.g., Mon-Thu)</small>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Hours Per Day</label>
                            <input
                              type="number"
                              className="form-control"
                              min="8"
                              max="12"
                              value={flexibleForm.compressedWeek.hoursPerDay}
                              onChange={(e) =>
                                setFlexibleForm({
                                  ...flexibleForm,
                                  compressedWeek: {
                                    ...flexibleForm.compressedWeek,
                                    hoursPerDay: parseInt(e.target.value) || 10,
                                  },
                                })
                              }
                            />
                            <small className="text-muted">Hours to work per day (e.g., 10 hours)</small>
                          </div>
                          <div className="col-12">
                            <div className="alert alert-info">
                              <strong>Total Weekly Hours:</strong> {flexibleForm.compressedWeek.workDays * flexibleForm.compressedWeek.hoursPerDay} hours
                              <br />
                              <small>This arrangement allows working {flexibleForm.compressedWeek.workDays} days per week with {flexibleForm.compressedWeek.hoursPerDay} hours per day.</small>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowFlexibleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleFlexibleArrangement}
                >
                  Save Arrangement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManagement;