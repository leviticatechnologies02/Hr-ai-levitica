import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search,  Filter,  Download,  Printer,  Plus,  Edit,  Eye,  Home,  Calendar,  Trash2,  Clock,  CheckCircle,  XCircle,  AlertCircle,  MapPin,
        Camera,  Wifi,  WifiOff,  Smartphone,  LogOut,  Monitor,  Fingerprint,  BarChart3,  Users,  Calendar as CalendarIcon,  Settings,  RefreshCw,
        Upload,  FileText,  ExternalLink,  MoreVertical,  User,} from "lucide-react";
import { Icon } from "@iconify/react";

// ==================== CONTEXT API ====================
const AttendanceContext = React.createContext();

// ==================== REDUCER FOR STATE MANAGEMENT ====================
const attendanceReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ATTENDANCE":
      return {
        ...state,
        attendanceRecords: [...state.attendanceRecords, action.payload],
      };
    case "UPDATE_ATTENDANCE":
      return {
        ...state,
        attendanceRecords: state.attendanceRecords.map((record) =>
          record.id === action.payload.id ? action.payload : record
        ),
      };
    case "DELETE_ATTENDANCE":
      return {
        ...state,
        attendanceRecords: state.attendanceRecords.filter(
          (record) => record.id !== action.payload
        ),
      };
    case "SET_DEVICES":
      return { ...state, biometricDevices: action.payload };
    case "ADD_DEVICE":
      return {
        ...state,
        biometricDevices: [...state.biometricDevices, action.payload],
      };
    case "UPDATE_DEVICE":
      return {
        ...state,
        biometricDevices: state.biometricDevices.map((device) =>
          device.id === action.payload.id ? action.payload : device
        ),
      };
    case "SET_LOCATIONS":
      return { ...state, geoLocations: action.payload };
    case "ADD_LOCATION":
      return {
        ...state,
        geoLocations: [...state.geoLocations, action.payload],
      };
    case "UPDATE_LOCATION":
      return {
        ...state,
        geoLocations: state.geoLocations.map((location) =>
          location.id === action.payload.id ? action.payload : location
        ),
      };
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload };
    case "ADD_EMPLOYEE":
      return { ...state, employees: [...state.employees, action.payload] };
    case "SET_WHITELIST_IPS":
      return { ...state, whitelistIPs: action.payload };
    case "ADD_WHITELIST_IP":
      return {
        ...state,
        whitelistIPs: [...state.whitelistIPs, action.payload],
      };
    case "SET_SYNC_LOGS":
      return { ...state, syncLogs: action.payload };
    case "ADD_SYNC_LOG":
      return {
        ...state,
        syncLogs: [action.payload, ...state.syncLogs.slice(0, 99)],
      };
    case "SET_SETTINGS":
      return { ...state, settings: action.payload };
    case "UPDATE_SETTING":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case "SET_OFFLINE_DATA":
      return { ...state, offlineData: action.payload };
    case "ADD_OFFLINE_RECORD":
      return { ...state, offlineData: [...state.offlineData, action.payload] };
    case "CLEAR_OFFLINE_DATA":
      return { ...state, offlineData: [] };
    case "SYNC_DATA":
      return { ...state, lastSync: new Date().toISOString() };
    case "ADD_PUNCH":
      return {
        ...state,
        punches: [...state.punches, action.payload],
      };
    case "SET_PUNCHES":
      return { ...state, punches: action.payload };
    case "ADD_HOLIDAY":
      return { ...state, holidays: [...state.holidays, action.payload] };
    case "SET_HOLIDAYS":
      return { ...state, holidays: action.payload };
    case "ADD_LEAVE":
      return { ...state, leaves: [...state.leaves, action.payload] };

    default:
      return state;
  }
};

// ==================== INITIAL DATA ====================
const initialEmployees = [
  {
    id: "EMP001",
    name: "Khuswanth Rao",
    department: "IT",
    position: "Developer",
    status: "Active",
  },
  {
    id: "EMP002",
    name: "John Smith",
    department: "HR",
    position: "Manager",
    status: "Active",
  },
  {
    id: "EMP003",
    name: "Sarah Johnson",
    department: "Finance",
    position: "Analyst",
    status: "Active",
  },
  {
    id: "EMP004",
    name: "Mike Brown",
    department: "Sales",
    position: "Executive",
    status: "Active",
  },
  {
    id: "EMP005",
    name: "Emma Wilson",
    department: "IT",
    position: "Tester",
    status: "Active",
  },
  {
    id: "EMP006",
    name: "David Lee",
    department: "Engineering",
    position: "Lead",
    status: "Active",
  },
  {
    id: "EMP007",
    name: "Lisa Wang",
    department: "Marketing",
    position: "Specialist",
    status: "Active",
  },
  {
    id: "EMP008",
    name: "Robert Chen",
    department: "Operations",
    position: "Coordinator",
    status: "Active",
  },
];

const initialDevices = [
  {
    id: 1,
    vendor: "ZKTeco",
    model: "iClock 880",
    ipAddress: "192.168.1.100",
    status: "Online",
    lastSync: new Date().toISOString(),
    employees: 50,
    health: 95,
    type: "fingerprint",
  },
  {
    id: 2,
    vendor: "eSSL",
    model: "BioTime 8.0",
    ipAddress: "192.168.1.101",
    status: "Syncing",
    lastSync: new Date(Date.now() - 300000).toISOString(),
    employees: 45,
    health: 70,
    type: "face",
  },
  {
    id: 3,
    vendor: "Honeywell",
    model: "Pro-Watch 3.0",
    ipAddress: "192.168.1.102",
    status: "Offline",
    lastSync: new Date(Date.now() - 600000).toISOString(),
    employees: 30,
    health: 40,
    type: "rfid",
  },
  {
    id: 4,
    vendor: "ZKTeco",
    model: "ZK4500",
    ipAddress: "192.168.1.103",
    status: "Online",
    lastSync: new Date(Date.now() - 120000).toISOString(),
    employees: 60,
    health: 85,
    type: "iris",
  },
];

const initialLocations = [
  {
    id: 1,
    name: "Main Office",
    radius: 100,
    lat: 17.385,
    lng: 78.4867,
    address: "123 Main Street, Hyderabad",
    employees: 45,
  },
  {
    id: 2,
    name: "Branch Office",
    radius: 150,
    lat: 17.4065,
    lng: 78.4772,
    address: "456 Branch Road, Hyderabad",
    employees: 25,
  },
  {
    id: 3,
    name: "Remote Work",
    radius: 500,
    lat: 17.4254,
    lng: 78.5075,
    address: "Work From Home Zone",
    employees: 15,
  },
];

const initialHolidays = [
  { id: 1, date: "2024-01-26", name: "Republic Day", type: "National Holiday" },
  { id: 2, date: "2024-03-25", name: "Holi", type: "Festival" },
  {
    id: 3,
    date: "2024-08-15",
    name: "Independence Day",
    type: "National Holiday",
  },
];

const initialSettings = {
  geoFencing: true,
  requireSelfie: false,
  maxGeoRadius: 500,
  workStartTime: "09:00",
  workEndTime: "18:00",
  breakDuration: 60,
  minWorkHours: 8,
  overtimeRate: 1.5,
  weekendOvertimeRate: 2.0,
  holidayOvertimeRate: 2.5,
  nightShiftBonus: 0.25,
  overtimeDailyCap: 4,
  overtimeWeeklyCap: 20,
  overtimeMonthlyCap: 80,
  nightShiftStart: "22:00",
  nightShiftEnd: "06:00",
  weekendWorking: false,
  holidayWorking: true,
  duplicatePunchWindow: 5,
  offlineMode: true,
  autoCalculateWorkHours: true,
  autoFirstInLastOut: true,
  multiplePunchHandling: true,
  lateThreshold: 15,
  earlyCheckoutThreshold: 30,
  halfDayThreshold: 4,
  shortLeaveThreshold: 2,
};

// ==================== MAIN COMPONENT ====================
const AttendanceCapture = () => {
  const [activeTab, setActiveTab] = useState("biometric");
  const [userLocation, setUserLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedEmployee, setSelectedEmployee] = useState("EMP001");
  const [manualEntryData, setManualEntryData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    checkIn: "09:00",
    checkOut: "18:00",
    status: "Present",
    reason: "",
    overtime: 0,
    breakTime: 60,
    nightShift: false,
    weekend: false,
    holiday: false,
  });
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [importHistory, setImportHistory] = useState([]);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [importSource, setImportSource] = useState("excel"); // excel, csv, external_system
  const [newDevice, setNewDevice] = useState({
    vendor: "ZKTeco",
    model: "",
    ipAddress: "",
    type: "fingerprint",
  });
  const [newIP, setNewIP] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNightShift, setIsNightShift] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processingAttendance, setProcessingAttendance] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [punchType, setPunchType] = useState("checkin");
  const [breakTime, setBreakTime] = useState({
    start: null,
    end: null,
    duration: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editFormData, setEditFormData] = useState({
    employeeId: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "",
    reason: "",
    overtime: 0,
    breakTime: 60,
  });
  // Add these state variables after your existing states in the main component:
  // In your main AttendanceCapture component, make sure you have:
  const [gpsState, setGpsState] = useState({
    isCapturing: false,
    isCheckingIn: false,
    isCheckingOut: false,
    address: "",
    spoofingDetected: false,
    spoofingDetails: "",
    error: "",
  });

  // And other required states:
  const [selfieImage, setSelfieImage] = useState(null);
  const [gpsOfflineQueue, setGpsOfflineQueue] = useState([]);
  const [currentGeoFence, setCurrentGeoFence] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: "",
    radius: "100",
    address: "",
  });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mapRef = useRef(null);
  // Add these state variables with your other states
  // Add these state variables at the top of your component with other states
  const [webState, setWebState] = useState({
    isCapturingWebcam: false,
    isWebCheckin: false,
    isWebCheckout: false,
    webcamImage: null,
    currentIP: "192.168.1.100", // Simulated IP
    ipAllowed: true,
    wfhRequests: [],
    fieldEmployees: [
      {
        id: "FE001",
        name: "Alex Johnson",
        location: "Client Site A",
        status: "Active",
        lastCheckIn: "09:30",
        type: "Field Sales",
      },
      {
        id: "FE002",
        name: "Maria Garcia",
        location: "On Route",
        status: "Traveling",
        lastCheckIn: "08:45",
        type: "Service Engineer",
      },
      {
        id: "FE003",
        name: "David Chen",
        location: "Remote Site",
        status: "Working",
        lastCheckIn: "10:15",
        type: "Site Supervisor",
      },
      {
        id: "FE004",
        name: "Sarah Wilson",
        location: "Warehouse",
        status: "Active",
        lastCheckIn: "09:00",
        type: "Inventory Manager",
      },
    ],
    showWebcamModal: false,
    fieldLocations: [],
  });
  // Load from localStorage
  const loadFromStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  // Scheduled sync state - must be declared early
  const [scheduledSyncs, setScheduledSyncs] = useState(() => {
    const stored = localStorage.getItem('biometricScheduledSyncs');
    return stored ? JSON.parse(stored) : [];
  });

  const initialState = {
    attendanceRecords: loadFromStorage("attendanceRecords", []),
    biometricDevices: loadFromStorage("biometricDevices", initialDevices),
    geoLocations: loadFromStorage("geoLocations", initialLocations),
    employees: loadFromStorage("employees", initialEmployees),
    whitelistIPs: loadFromStorage("whitelistIPs", [
      "192.168.1.1",
      "192.168.1.2",
      "192.168.1.100",
    ]),
    syncLogs: loadFromStorage("syncLogs", []),
    settings: loadFromStorage("settings", initialSettings),
    offlineData: loadFromStorage("offlineData", []),
    punches: loadFromStorage("punches", []),
    holidays: loadFromStorage("holidays", initialHolidays),
    leaves: loadFromStorage("leaves", []),
    lastSync: localStorage.getItem("lastSync") || null,
  };

  const [state, dispatch] = useReducer(attendanceReducer, initialState);
  const {
    attendanceRecords,
    biometricDevices,
    geoLocations,
    employees,
    whitelistIPs,
    syncLogs,
    settings,
    offlineData,
    punches,
    holidays,
    leaves,
  } = state;

  // Add these state variables after your existing states
  const [webAttendanceState, setWebAttendanceState] = useState({
    isCapturingWebcam: false,
    isCheckingIn: false,
    isCheckingOut: false,
    webcamImage: null,
    currentIP: "",
    ipAllowed: true,
  });

  const [fieldEmployees, setFieldEmployees] = useState([]);
  const [wfhRequests, setWfhRequests] = useState([]);
  // ==================== EFFECTS ====================
  useEffect(() => {
    localStorage.setItem(
      "attendanceRecords",
      JSON.stringify(attendanceRecords)
    );
    localStorage.setItem("biometricDevices", JSON.stringify(biometricDevices));
    localStorage.setItem("geoLocations", JSON.stringify(geoLocations));
    localStorage.setItem("employees", JSON.stringify(employees));
    localStorage.setItem("whitelistIPs", JSON.stringify(whitelistIPs));
    localStorage.setItem("syncLogs", JSON.stringify(syncLogs));
    localStorage.setItem("settings", JSON.stringify(settings));
    localStorage.setItem("offlineData", JSON.stringify(offlineData));
    localStorage.setItem("punches", JSON.stringify(punches));
    localStorage.setItem("holidays", JSON.stringify(holidays));
    localStorage.setItem("leaves", JSON.stringify(leaves));
    localStorage.setItem("lastSync", state.lastSync || "");
  }, [state]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (offlineData.length > 0) {
        syncOfflineData();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [offlineData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkNightShift();
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Update device health metrics periodically
  useEffect(() => {
    if (biometricDevices.length > 0) {
      updateDeviceHealthMetrics();
      
      const healthUpdateInterval = setInterval(() => {
        updateDeviceHealthMetrics();
      }, 5 * 60 * 1000); // Update every 5 minutes

      return () => clearInterval(healthUpdateInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biometricDevices.length, syncLogs.length]);

  // Initialize scheduled syncs on mount and when scheduledSyncs changes
  useEffect(() => {
    if (scheduledSyncs.length === 0) return;
    
    const enabledSyncs = scheduledSyncs.filter(s => s.enabled);
    const intervalIds = [];
    
    enabledSyncs.forEach(schedule => {
      const intervalId = startScheduledSync(schedule);
      if (intervalId) {
        intervalIds.push(intervalId);
      }
    });
    
    return () => {
      intervalIds.forEach(id => {
        if (id && typeof id === 'number') {
          clearInterval(id);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduledSyncs.length]);

  // ==================== UTILITY FUNCTIONS ====================
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isNightShiftTime = (date) => {
    if (!settings.nightShiftStart || !settings.nightShiftEnd) return false;

    const time = date.getHours() * 60 + date.getMinutes();
    const startTime = parseTime(settings.nightShiftStart);
    const endTime = parseTime(settings.nightShiftEnd);

    if (startTime < endTime) {
      return time >= startTime && time < endTime;
    } else {
      return time >= startTime || time < endTime;
    }
  };

  const checkNightShift = () => {
    const now = new Date();
    setIsNightShift(isNightShiftTime(now));
  };

  const getAddressFromCoords = (lat, lng) => {
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  };

  // ==================== ENHANCED ATTENDANCE PROCESSING ====================
  
  // Check if date is a weekend
  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  // Check if date is a holiday
  const isHoliday = (date) => {
    const dateStr = new Date(date).toISOString().split("T")[0];
    return holidays.some((h) => h.date === dateStr);
  };

  // Check if date is a week-off (customizable per employee)
  const isWeekOff = (date, employeeId) => {
    // In production, this would check employee-specific week-off settings
    // For now, using default weekend check
    return isWeekend(date);
  };

  // Get holiday name if date is a holiday
  const getHolidayName = (date) => {
    const dateStr = new Date(date).toISOString().split("T")[0];
    const holiday = holidays.find((h) => h.date === dateStr);
    return holiday ? holiday.name : null;
  };

  // Calculate first-in and last-out from multiple punches
  const calculateFirstInLastOut = (employeeId, date) => {
    const dateStr = typeof date === 'string' ? date : new Date(date).toISOString().split("T")[0];
    
    // Get all punches for the employee on this date
    const dayPunches = punches
      .filter((p) => {
        const punchDate = new Date(p.timestamp).toISOString().split("T")[0];
        return p.employeeId === employeeId && punchDate === dateStr;
      })
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (dayPunches.length === 0) return null;

    const firstIn = dayPunches.find((p) => 
      p.type === "checkin" || p.type === "breakend"
    );
    const lastOut = [...dayPunches]
      .reverse()
      .find((p) => p.type === "checkout" || p.type === "breakstart");

    return {
      firstIn: firstIn ? firstIn.timestamp : null,
      lastOut: lastOut ? lastOut.timestamp : null,
      allPunches: dayPunches,
      punchCount: dayPunches.length,
    };
  };

  // Calculate work hours from multiple punches with break deduction
  const calculateWorkHoursFromPunches = (employeeId, date) => {
    const punchData = calculateFirstInLastOut(employeeId, date);
    if (!punchData || !punchData.firstIn) return 0;

    const punches = punchData.allPunches;
    let totalWorkTime = 0;
    let breakTime = 0;
    let lastCheckIn = null;
    let lastBreakStart = null;

    punches.forEach((punch) => {
      const punchTime = new Date(punch.timestamp);

      if (punch.type === "checkin" || punch.type === "breakend") {
        if (lastBreakStart) {
          // Calculate break duration
          const breakDuration = (punchTime - new Date(lastBreakStart)) / (1000 * 60); // minutes
          breakTime += breakDuration;
          lastBreakStart = null;
        }
        lastCheckIn = punchTime;
      } else if (punch.type === "checkout" || punch.type === "breakstart") {
        if (lastCheckIn) {
          // Calculate work duration before break/checkout
          const workDuration = (punchTime - lastCheckIn) / (1000 * 60 * 60); // hours
          totalWorkTime += workDuration;
        }
        if (punch.type === "breakstart") {
          lastBreakStart = punchTime;
        }
        lastCheckIn = null;
      }
    });

    // If still checked in, calculate until now or scheduled end time
    if (lastCheckIn) {
      const endTime = punchData.lastOut 
        ? new Date(punchData.lastOut)
        : new Date();
      const workDuration = (endTime - lastCheckIn) / (1000 * 60 * 60);
      totalWorkTime += workDuration;
    }

    // Convert break time to hours and deduct
    const breakHours = breakTime / 60;
    const netWorkHours = Math.max(0, totalWorkTime - breakHours);

    return {
      totalWorkHours: totalWorkTime.toFixed(2),
      breakHours: breakHours.toFixed(2),
      netWorkHours: parseFloat(netWorkHours.toFixed(2)),
      punchCount: punches.length,
    };
  };

  // Enhanced overtime calculation with rules
  const calculateOvertimeWithRules = (workHours, date, isNightShift = false) => {
    const standardHours = settings.minWorkHours || 8;
    const baseOvertime = Math.max(0, workHours - standardHours);

    if (baseOvertime <= 0) return { hours: 0, rate: 0, amount: 0 };

    let rate = settings.overtimeRate || 1.5;
    let overtimeHours = baseOvertime;

    // Weekend overtime rate
    if (isWeekend(date)) {
      rate = settings.weekendOvertimeRate || 2.0;
    }

    // Holiday overtime rate
    if (isHoliday(date)) {
      rate = settings.holidayOvertimeRate || 2.5;
    }

    // Night shift bonus
    if (isNightShift) {
      rate += settings.nightShiftBonus || 0.25;
    }

    // Apply daily cap if configured
    const dailyCap = settings.overtimeDailyCap || 4;
    overtimeHours = Math.min(overtimeHours, dailyCap);

    return {
      hours: parseFloat(overtimeHours.toFixed(2)),
      rate: parseFloat(rate.toFixed(2)),
      amount: parseFloat((overtimeHours * rate).toFixed(2)),
      isWeekend: isWeekend(date),
      isHoliday: isHoliday(date),
      isNightShift,
      holidayName: getHolidayName(date),
    };
  };

  // Enhanced attendance status calculation
  const calculateAttendanceStatus = (workHours, record, date = null) => {
    const recordDate = date || record.date || new Date();
    const dateObj = typeof recordDate === 'string' ? new Date(recordDate) : recordDate;

    // Check leave status first
    if (record.onLeave) return "On Leave";
    
    // Check holiday status
    if (isHoliday(dateObj)) {
      // If working on holiday, mark as "Holiday Working"
      if (workHours > 0) return "Holiday Working";
      return "Holiday";
    }
    
    // Check week-off status
    if (isWeekOff(dateObj, record.employeeId)) {
      // If working on week-off, mark as "Weekend Working"
      if (workHours > 0) return "Weekend Working";
      return "Week Off";
    }

    // Calculate status based on work hours
    if (workHours >= 7) return "Present";
    if (workHours >= settings.halfDayThreshold) return "Half Day";
    if (workHours >= settings.shortLeaveThreshold) return "Short Leave";
    return "Absent";
  };

  // Process attendance record with all calculations
  const processAttendanceRecord = (employeeId, date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const dateStr = dateObj.toISOString().split("T")[0];
    
    // Get punch data
    const punchData = calculateFirstInLastOut(employeeId, dateStr);
    if (!punchData || !punchData.firstIn) {
      return {
        status: "Absent",
        workHours: 0,
        overtime: 0,
        firstIn: null,
        lastOut: null,
        punchCount: 0,
      };
    }

    // Calculate work hours
    const workHoursData = calculateWorkHoursFromPunches(employeeId, dateStr);
    
    // Check for night shift
    const firstInTime = new Date(punchData.firstIn);
    const isNightShiftDay = isNightShiftTime(firstInTime);

    // Calculate overtime
    const overtimeData = calculateOvertimeWithRules(
      workHoursData.netWorkHours,
      dateObj,
      isNightShiftDay
    );

    // Get existing record or create base
    const existingRecord = attendanceRecords.find(
      (r) => r.employeeId === employeeId && r.date === dateStr
    );

    // Determine status
    const status = calculateAttendanceStatus(
      workHoursData.netWorkHours,
      existingRecord || { employeeId, date: dateStr },
      dateObj
    );

    return {
      status,
      workHours: workHoursData.netWorkHours,
      totalWorkHours: parseFloat(workHoursData.totalWorkHours),
      breakHours: parseFloat(workHoursData.breakHours),
      overtime: overtimeData.hours,
      overtimeRate: overtimeData.rate,
      overtimeAmount: overtimeData.amount,
      firstIn: punchData.firstIn,
      lastOut: punchData.lastOut,
      punchCount: workHoursData.punchCount,
      allPunches: punchData.allPunches,
      isWeekend: isWeekend(dateObj),
      isHoliday: isHoliday(dateObj),
      isNightShift: isNightShiftDay,
      holidayName: getHolidayName(dateObj),
      weekOff: isWeekOff(dateObj, employeeId),
    };
  };

  // Get device-wise attendance reports
  const getDeviceWiseReports = (deviceId = null, startDate = null, endDate = null) => {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    // Filter punches by device and date range
    let devicePunches = punches.filter((p) => {
      const punchDate = new Date(p.timestamp);
      return (
        punchDate >= start &&
        punchDate <= end &&
        (deviceId ? p.deviceId === deviceId : true) &&
        p.method === "biometric"
      );
    });

    // Group by device
    const deviceGroups = {};
    devicePunches.forEach((punch) => {
      const deviceKey = punch.deviceId || "unknown";
      if (!deviceGroups[deviceKey]) {
        const device = biometricDevices.find((d) => d.id === deviceKey);
        deviceGroups[deviceKey] = {
          deviceId: deviceKey,
          deviceName: device?.model || "Unknown Device",
          vendor: device?.vendor || "Unknown",
          punches: [],
          employees: new Set(),
          checkIns: 0,
          checkOuts: 0,
        };
      }
      deviceGroups[deviceKey].punches.push(punch);
      deviceGroups[deviceKey].employees.add(punch.employeeId);
      if (punch.type === "checkin") deviceGroups[deviceKey].checkIns++;
      if (punch.type === "checkout") deviceGroups[deviceKey].checkOuts++;
    });

    // Convert to array and calculate statistics
    return Object.values(deviceGroups).map((group) => ({
      ...group,
      employees: Array.from(group.employees),
      employeeCount: group.employees.size,
      totalPunches: group.punches.length,
      dateRange: {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
      },
    }));
  };

  // Enhanced device health monitoring
  const calculateDeviceHealth = (device) => {
    const metrics = {
      connectivity: device.status === "Online" ? 100 : 0,
      syncFrequency: calculateSyncFrequencyScore(device),
      errorRate: calculateErrorRate(device),
      storageUsage: calculateStorageUsage(device),
      uptime: calculateUptimeScore(device),
    };

    // Weighted average for overall health
    const weights = {
      connectivity: 0.3,
      syncFrequency: 0.25,
      errorRate: 0.2,
      storageUsage: 0.15,
      uptime: 0.1,
    };

    const overallHealth = Math.round(
      metrics.connectivity * weights.connectivity +
      metrics.syncFrequency * weights.syncFrequency +
      (100 - metrics.errorRate) * weights.errorRate +
      metrics.storageUsage * weights.storageUsage +
      metrics.uptime * weights.uptime
    );

    return {
      overall: overallHealth,
      metrics,
      status: overallHealth >= 80 ? "Healthy" : overallHealth >= 60 ? "Warning" : "Critical",
      lastUpdated: new Date().toISOString(),
    };
  };

  const calculateSyncFrequencyScore = (device) => {
    if (!device.lastSync) return 0;
    const lastSyncTime = new Date(device.lastSync);
    const timeSinceSync = (Date.now() - lastSyncTime.getTime()) / 1000 / 60; // minutes
    
    // Score based on how recent the last sync was
    if (timeSinceSync < 15) return 100;
    if (timeSinceSync < 60) return 80;
    if (timeSinceSync < 240) return 60;
    if (timeSinceSync < 480) return 40;
    return 20;
  };

  const calculateErrorRate = (device) => {
    // Calculate error rate from sync logs (simulated)
    const deviceLogs = syncLogs.filter(log => log.deviceId === device.id);
    if (deviceLogs.length === 0) return 0;
    
    const failedLogs = deviceLogs.filter(log => log.status === "Failed" || log.status === "Error");
    const errorRate = (failedLogs.length / deviceLogs.length) * 100;
    return Math.min(100, errorRate); // Cap at 100%
  };

  const calculateStorageUsage = (device) => {
    // Simulated storage usage calculation
    const usage = device.storageUsage || Math.random() * 30 + 50; // 50-80% simulated
    return Math.max(0, 100 - usage * 2); // Higher usage = lower score
  };

  const calculateUptimeScore = (device) => {
    // Simulated uptime calculation (would check actual uptime in production)
    if (device.status === "Online") {
      return device.uptime || Math.random() * 20 + 80; // 80-100% simulated
    }
    return 0;
  };

  // Update device health for all devices
  const updateDeviceHealthMetrics = () => {
    const updatedDevices = biometricDevices.map(device => {
      const healthData = calculateDeviceHealth(device);
      return {
        ...device,
        health: healthData.overall,
        healthMetrics: healthData.metrics,
        healthStatus: healthData.status,
        healthLastUpdated: healthData.lastUpdated,
      };
    });
    
    dispatch({ type: "SET_DEVICES", payload: updatedDevices });
    localStorage.setItem("biometricDevices", JSON.stringify(updatedDevices));
  };

  // ==================== BIOMETRIC FUNCTIONS ====================
  const addBiometricDevice = () => {
    if (!newDevice.model || !newDevice.ipAddress) {
      alert("Please enter model and IP address");
      return;
    }

    const device = {
      id: Date.now(),
      vendor: newDevice.vendor,
      model: newDevice.model,
      ipAddress: newDevice.ipAddress,
      type: newDevice.type,
      status: "Online",
      lastSync: new Date().toISOString(),
      employees: 0,
      health: 100,
      healthMetrics: {
        connectivity: 100,
        syncFrequency: 100,
        errorRate: 0,
        storageUsage: 70,
        uptime: 100,
      },
      healthStatus: "Healthy",
      storageUsage: 30,
      uptime: 99.9,
    };

    dispatch({ type: "ADD_DEVICE", payload: device });
    setNewDevice({
      vendor: "ZKTeco",
      model: "",
      ipAddress: "",
      type: "fingerprint",
    });
    addSyncLog(
      "device",
      "Success",
      `Added device ${device.vendor} ${device.model}`
    );
  };

  const syncBiometricData = async (deviceId = null) => {
    setProcessingAttendance(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const syncLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        deviceId,
        type: "biometric",
        status: "Success",
        records: Math.floor(Math.random() * 50) + 10,
      };

      dispatch({ type: "ADD_SYNC_LOG", payload: syncLog });
      dispatch({ type: "SYNC_DATA" });

      if (deviceId) {
        const device = biometricDevices.find((d) => d.id === deviceId);
        if (device) {
          dispatch({
            type: "UPDATE_DEVICE",
            payload: {
              ...device,
              lastSync: new Date().toISOString(),
              status: "Online",
              health: 95,
            },
          });
        }
      }

      addSyncLog("biometric", "Success", `Synced ${syncLog.records} records`);
    } catch (error) {
      addSyncLog("biometric", "Failed", error.message);
    } finally {
      setProcessingAttendance(false);
    }
  };

  // Scheduled sync functionality for biometric devices
  const addScheduledSync = (deviceId, schedule) => {
    const newSchedule = {
      id: Date.now(),
      deviceId,
      scheduleType: schedule.type, // 'realtime', 'interval', 'daily', 'weekly'
      interval: schedule.interval || null, // minutes for interval type
      time: schedule.time || null, // HH:MM for daily/weekly
      days: schedule.days || [], // ['monday', 'tuesday'] for weekly
      enabled: schedule.enabled !== false,
      lastRun: null,
      nextRun: calculateNextRun(schedule),
    };

    setScheduledSyncs(prevSyncs => {
      const updated = [...prevSyncs, newSchedule];
      localStorage.setItem('biometricScheduledSyncs', JSON.stringify(updated));
      return updated;
    });
    
    // Start the sync if enabled
    if (newSchedule.enabled) {
      startScheduledSync(newSchedule);
    }

    addSyncLog("scheduled_sync", "Success", `Scheduled sync added for device ${deviceId}`);
  };

  const calculateNextRun = (schedule) => {
    const now = new Date();
    
    if (schedule.type === 'realtime') {
      return null; // Continuous
    } else if (schedule.type === 'interval') {
      const next = new Date(now.getTime() + (schedule.interval || 60) * 60 * 1000);
      return next.toISOString();
    } else if (schedule.type === 'daily') {
      const [hours, minutes] = (schedule.time || '09:00').split(':');
      const next = new Date(now);
      next.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
      return next.toISOString();
    } else if (schedule.type === 'weekly') {
      // Calculate next occurrence based on selected days
      const days = schedule.days || [];
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayNumbers = days.map(d => dayNames.indexOf(d.toLowerCase()));
      dayNumbers.sort();
      
      for (let dayNum of dayNumbers) {
        const next = new Date(now);
        const daysUntil = (dayNum - now.getDay() + 7) % 7 || 7;
        next.setDate(next.getDate() + daysUntil);
        const [hours, minutes] = (schedule.time || '09:00').split(':');
        next.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        if (next > now) {
          return next.toISOString();
        }
      }
    }
    return null;
  };

  const startScheduledSync = (schedule) => {
    if (schedule.type === 'realtime') {
      // Real-time sync - check every 5 minutes
      const intervalId = setInterval(() => {
        syncBiometricData(schedule.deviceId);
      }, 5 * 60 * 1000);
      return intervalId;
    } else if (schedule.type === 'interval') {
      const intervalId = setInterval(() => {
        syncBiometricData(schedule.deviceId);
        setScheduledSyncs(prevSyncs => {
          const updated = prevSyncs.map(s => 
            s.id === schedule.id 
              ? { ...s, lastRun: new Date().toISOString(), nextRun: calculateNextRun(schedule) }
              : s
          );
          localStorage.setItem('biometricScheduledSyncs', JSON.stringify(updated));
          return updated;
        });
      }, (schedule.interval || 60) * 60 * 1000);
      return intervalId;
    } else if (schedule.type === 'daily' || schedule.type === 'weekly') {
      const checkInterval = setInterval(() => {
        const now = new Date();
        const nextRun = new Date(schedule.nextRun);
        
        if (now >= nextRun) {
          syncBiometricData(schedule.deviceId);
          setScheduledSyncs(prevSyncs => {
            const updated = prevSyncs.map(s => 
              s.id === schedule.id 
                ? { ...s, lastRun: new Date().toISOString(), nextRun: calculateNextRun(schedule) }
                : s
            );
            localStorage.setItem('biometricScheduledSyncs', JSON.stringify(updated));
            return updated;
          });
        }
      }, 60 * 1000); // Check every minute
      return checkInterval;
    }
    return null;
  };

  // Enhanced duplicate punch detection
  const detectDuplicatePunch = (employeeId, punchType, timestamp) => {
    const punchTime = new Date(timestamp);
    const windowMinutes = settings.duplicatePunchWindow || 5;
    const windowStart = new Date(punchTime.getTime() - windowMinutes * 60 * 1000);
    
    // Check for duplicate punches within the time window
    const recentPunches = punches.filter(p => {
      const pTime = new Date(p.timestamp);
      return p.employeeId === employeeId && 
             p.type === punchType &&
             pTime >= windowStart && 
             pTime <= punchTime;
    });

    if (recentPunches.length > 0) {
      const lastPunch = recentPunches[recentPunches.length - 1];
      const timeDiff = Math.abs(punchTime - new Date(lastPunch.timestamp)) / 1000 / 60; // minutes
      
      return {
        isDuplicate: true,
        lastPunchTime: lastPunch.timestamp,
        timeDifference: timeDiff.toFixed(2),
        message: `Duplicate ${punchType} detected. Last punch was ${timeDiff.toFixed(1)} minutes ago. Please wait at least ${windowMinutes} minutes between ${punchType}s.`
      };
    }

    // Check for invalid sequence (e.g., checkout before checkin)
    if (punchType === 'checkout') {
      const dayPunches = punches.filter(p => {
        const pDate = new Date(p.timestamp).toISOString().split('T')[0];
        const punchDate = new Date(timestamp).toISOString().split('T')[0];
        return p.employeeId === employeeId && pDate === punchDate;
      });
      
      const hasCheckIn = dayPunches.some(p => p.type === 'checkin' || p.type === 'breakend');
      if (!hasCheckIn) {
        return {
          isDuplicate: false,
          isInvalidSequence: true,
          message: 'Cannot checkout without checking in first'
        };
      }
    }

    return { isDuplicate: false };
  };

  // ==================== GPS FUNCTIONS ====================
  // Replace your existing getCurrentLocation function with this:
  const getCurrentLocation = () => {
    setGpsState((prev) => ({ ...prev, isCapturing: true }));

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setGpsState((prev) => ({ ...prev, isCapturing: false }));
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: new Date().toISOString(),
          };

          // Address capture (simulated reverse geocoding)
          const address = await getAddressFromCoordinates(
            location.lat,
            location.lng
          );
          setGpsState((prev) => ({ ...prev, address }));
          location.address = address;

          // Location spoofing detection
          const spoofingCheck = detectSpoofing(position, location);
          if (spoofingCheck.isSpoofed) {
            setGpsState((prev) => ({
              ...prev,
              spoofingDetected: true,
              spoofingDetails: spoofingCheck.details,
            }));
          } else {
            setGpsState((prev) => ({
              ...prev,
              spoofingDetected: false,
              spoofingDetails: null,
            }));
          }

          // Geo-fence check
          const geoFenceCheck = checkGeoFence(location.lat, location.lng);
          setCurrentGeoFence(geoFenceCheck);

          setUserLocation(location);
          setGpsState((prev) => ({ ...prev, isCapturing: false }));

          resolve({
            location,
            address,
            accuracy: position.coords.accuracy,
            spoofingCheck,
            geoFenceCheck,
          });
        },
        (error) => {
          setGpsState((prev) => ({ ...prev, isCapturing: false }));
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // Add these helper functions:
  const getAddressFromCoordinates = async (lat, lng) => {
    // Simulated reverse geocoding - replace with actual API in production
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)} (Address simulated)`;
  };

  const detectSpoofing = (position, locationData) => {
    const checks = [];
    let confidence = 0;
    let isSpoofed = false;

    // Check 1: Accuracy too high (spoofed locations often have perfect accuracy)
    if (position.coords.accuracy < 1) {
      checks.push("Suspiciously high accuracy");
      confidence += 20;
    }

    // Check 2: Impossible speed
    if (position.coords.speed && position.coords.speed > 300) {
      checks.push("Impossible speed detected");
      confidence += 50;
      isSpoofed = true;
    }

    // Check 3: Mock provider
    if (position.coords.provider && position.coords.provider === "mock") {
      checks.push("Mock location provider");
      confidence += 80;
      isSpoofed = true;
    }

    // Check 4: Compare with previous location
    if (userLocation) {
      const timeDiff =
        (Date.now() - new Date(userLocation.timestamp).getTime()) / 1000;
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        locationData.lat,
        locationData.lng
      );

      if (timeDiff < 60 && distance > 50000) {
        checks.push("Impossible location change");
        confidence += 70;
        isSpoofed = true;
      }
    }

    return {
      isSpoofed: isSpoofed || confidence > 60,
      confidence,
      checks,
      details: `Security score: ${100 - confidence}/100${
        checks.length ? ` (${checks.join(", ")})` : ""
      }`,
    };
  };

  const checkGeoFence = (lat, lng) => {
    if (!geoLocations.length || !settings.geoFencing) {
      return { withinFence: true, matchedLocation: null, distance: 0 };
    }

    let closest = null;
    let minDistance = Infinity;

    for (const location of geoLocations) {
      const distance = calculateDistance(lat, lng, location.lat, location.lng);

      if (distance < minDistance) {
        minDistance = distance;
        closest = location;
      }

      if (distance <= location.radius) {
        return {
          withinFence: true,
          matchedLocation: location,
          distance: distance.toFixed(2),
        };
      }
    }

    return {
      withinFence: false,
      matchedLocation: closest,
      distance: minDistance.toFixed(2),
    };
  };

  // Add these functions for selfie capture:
  const captureSelfie = () => {
    setShowCamera(true);
  };

  const handleSelfieCapture = () => {
    // In production, use actual camera API
    const simulatedImage = "data:image/jpeg;base64,simulated_selfie_data";
    setSelfieImage(simulatedImage);
    setShowCamera(false);
    alert("Selfie captured successfully!");
  };

  // Replace your markAttendance function for GPS with this:
  const markGPSAttendance = async (type = "checkin") => {
    const actionKey = type === "checkin" ? "isCheckingIn" : "isCheckingOut";
    setGpsState((prev) => ({ ...prev, [actionKey]: true }));

    try {
      // Capture location
      const locationResult = await getCurrentLocation();

      // Check spoofing
      if (gpsState.spoofingDetected) {
        alert("Location spoofing detected! Attendance cannot be recorded.");
        setGpsState((prev) => ({ ...prev, [actionKey]: false }));
        return;
      }

      // Check geo-fence
      if (settings.geoFencing && !currentGeoFence?.withinFence) {
        alert(`Outside geo-fence! Distance: ${currentGeoFence?.distance}m`);
        setGpsState((prev) => ({ ...prev, [actionKey]: false }));
        return;
      }

      // Check selfie requirement
      if (settings.requireSelfie && !selfieImage) {
        const capture = window.confirm("Selfie required. Capture now?");
        if (capture) {
          captureSelfie();
          setGpsState((prev) => ({ ...prev, [actionKey]: false }));
          return;
        } else {
          alert("Selfie required for GPS attendance.");
          setGpsState((prev) => ({ ...prev, [actionKey]: false }));
          return;
        }
      }

      const selectedEmp = employees.find((e) => e.id === selectedEmployee);
      const now = new Date();

      const attendanceRecord = {
        id: Date.now(),
        employeeId: selectedEmployee,
        employeeName: selectedEmp?.name || "Unknown",
        date: now.toISOString().split("T")[0],
        timestamp: now.toISOString(),
        type: type,
        method: "gps",
        location: locationResult.location,
        selfie: selfieImage,
        address: locationResult.address,
        spoofingCheck: locationResult.spoofingCheck,
        geoFence: currentGeoFence,
        status: type === "checkin" ? "Present" : "Checked Out",
        syncStatus: isOnline ? "synced" : "pending",
      };

      // Offline mode handling
      if (!isOnline && settings.offlineMode) {
        // Add to offline queue
        const newQueue = [...gpsOfflineQueue, attendanceRecord];
        setGpsOfflineQueue(newQueue);
        localStorage.setItem("gpsOfflineQueue", JSON.stringify(newQueue));

        alert(`✅ ${type} recorded offline (${newQueue.length} pending sync)`);
      } else {
        // Online storage
        dispatch({ type: "ADD_ATTENDANCE", payload: attendanceRecord });

        // Add punch record
        const punch = {
          id: Date.now(),
          employeeId: selectedEmployee,
          employeeName: selectedEmp?.name,
          timestamp: now.toISOString(),
          type: type,
          method: "gps",
          location: locationResult.location,
          verified: true,
        };
        dispatch({ type: "ADD_PUNCH", payload: punch });

        alert(`✅ GPS ${type} successful!`);
      }

      // Clear selfie after use
      if (settings.requireSelfie) {
        setSelfieImage(null);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setGpsState((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  // Add this function after your other functions but before renderGPSTab
  const addGeoLocation = () => {
    if (!userLocation || !newLocation.name) {
      alert("Please capture location and enter location name");
      return;
    }

    const location = {
      id: Date.now(),
      name: newLocation.name,
      radius: parseInt(newLocation.radius) || 100,
      lat: userLocation.lat,
      lng: userLocation.lng,
      address:
        newLocation.address ||
        `Location near ${userLocation.lat.toFixed(
          4
        )}, ${userLocation.lng.toFixed(4)}`,
      employees: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_LOCATION", payload: location });
    setNewLocation({ name: "", radius: 100, address: "" });
    alert("Geo-fence added successfully!");
  };

  // Add this function to sync offline data:
  const syncGPSOfflineData = () => {
    if (gpsOfflineQueue.length === 0) {
      alert("No offline GPS data to sync");
      return;
    }

    // Sync each record
    gpsOfflineQueue.forEach((record) => {
      dispatch({
        type: "ADD_ATTENDANCE",
        payload: { ...record, syncStatus: "synced" },
      });
    });

    // Clear queue
    setGpsOfflineQueue([]);
    localStorage.removeItem("gpsOfflineQueue");

    // Add sync log
    const syncLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: "gps_offline_sync",
      status: "Success",
      message: `Synced ${gpsOfflineQueue.length} GPS records`,
      records: gpsOfflineQueue.length,
    };
    dispatch({ type: "ADD_SYNC_LOG", payload: syncLog });

    alert(`✅ Synced ${gpsOfflineQueue.length} offline records!`);
  };

  // Add this function for webcam capture
  const captureWebcamImage = () => {
    setWebState((prev) => ({ ...prev, isCapturingWebcam: true }));

    // Simulate webcam capture
    setTimeout(() => {
      const simulatedImage = "data:image/jpeg;base64,simulated_webcam_data";
      setWebState((prev) => ({
        ...prev,
        webcamImage: simulatedImage,
        isCapturingWebcam: false,
      }));
      alert("Webcam image captured successfully!");
    }, 1000);
  };

  // Add this function for web-based attendance
  const markWebAttendance = async (type = "checkin") => {
    const actionKey = type === "checkin" ? "isWebCheckin" : "isWebCheckout";
    setWebState((prev) => ({ ...prev, [actionKey]: true }));

    try {
      // Check IP whitelisting
      const ipAllowed = whitelistIPs.includes(webState.currentIP);
      if (!ipAllowed) {
        alert(`IP ${webState.currentIP} is not whitelisted. Access denied.`);
        setWebState((prev) => ({ ...prev, [actionKey]: false }));
        return;
      }

      // Check webcam requirement
      if (settings.requireSelfie && !webState.webcamImage) {
        const capture = window.confirm("Webcam capture required. Capture now?");
        if (capture) {
          captureWebcamImage();
          setWebState((prev) => ({ ...prev, [actionKey]: false }));
          return;
        } else {
          alert("Webcam capture required for web attendance.");
          setWebState((prev) => ({ ...prev, [actionKey]: false }));
          return;
        }
      }

      const selectedEmp = employees.find((e) => e.id === selectedEmployee);
      const now = new Date();

      const attendanceRecord = {
        id: Date.now(),
        employeeId: selectedEmployee,
        employeeName: selectedEmp?.name || "Unknown",
        date: now.toISOString().split("T")[0],
        timestamp: now.toISOString(),
        type: type,
        method: "web",
        ipAddress: webState.currentIP,
        webcamImage: webState.webcamImage,
        status: type === "checkin" ? "Present" : "Checked Out",
        syncStatus: isOnline ? "synced" : "pending",
        location: "Web Portal",
        isWFH: false,
        isField: false,
      };

      dispatch({ type: "ADD_ATTENDANCE", payload: attendanceRecord });

      // Add punch record
      const punch = {
        id: Date.now(),
        employeeId: selectedEmployee,
        employeeName: selectedEmp?.name,
        timestamp: now.toISOString(),
        type: type,
        method: "web",
        ipAddress: webState.currentIP,
        verified: true,
      };
      dispatch({ type: "ADD_PUNCH", payload: punch });

      alert(`✅ Web ${type} successful from IP: ${webState.currentIP}`);

      // Clear webcam image after use
      if (settings.requireSelfie) {
        setWebState((prev) => ({ ...prev, webcamImage: null }));
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setWebState((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  // Add this function for WFH attendance
  const markWFHAttendance = () => {
    const selectedEmp = employees.find((e) => e.id === selectedEmployee);
    const now = new Date();

    const attendanceRecord = {
      id: Date.now(),
      employeeId: selectedEmployee,
      employeeName: selectedEmp?.name || "Unknown",
      date: now.toISOString().split("T")[0],
      timestamp: now.toISOString(),
      type: "checkin",
      method: "web",
      status: "WFH",
      syncStatus: isOnline ? "synced" : "pending",
      location: "Work From Home",
      isWFH: true,
      isField: false,
      notes: "Working from home",
    };

    dispatch({ type: "ADD_ATTENDANCE", payload: attendanceRecord });

    // Add to WFH requests
    const wfhRequest = {
      id: Date.now(),
      employeeId: selectedEmployee,
      employeeName: selectedEmp?.name,
      date: now.toISOString().split("T")[0],
      timestamp: now.toISOString(),
      status: "Approved",
      type: "WFH",
    };

    setWebState((prev) => ({
      ...prev,
      wfhRequests: [wfhRequest, ...prev.wfhRequests],
    }));

    alert("✅ Work From Home attendance marked!");
  };

  // Add this function for field employee attendance
  const markFieldAttendance = (fieldEmpId) => {
    const fieldEmp = webState.fieldEmployees.find((e) => e.id === fieldEmpId);
    if (!fieldEmp) return;

    const now = new Date();

    const attendanceRecord = {
      id: Date.now(),
      employeeId: fieldEmpId,
      employeeName: fieldEmp.name,
      date: now.toISOString().split("T")[0],
      timestamp: now.toISOString(),
      type: "checkin",
      method: "field",
      status: "Field Work",
      syncStatus: isOnline ? "synced" : "pending",
      location: fieldEmp.location,
      isWFH: false,
      isField: true,
      fieldType: fieldEmp.type,
    };

    dispatch({ type: "ADD_ATTENDANCE", payload: attendanceRecord });

    // Update field employee last check-in
    setWebState((prev) => ({
      ...prev,
      fieldEmployees: prev.fieldEmployees.map((emp) =>
        emp.id === fieldEmpId
          ? {
              ...emp,
              lastCheckIn: now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : emp
      ),
    }));

    alert(
      `✅ Field attendance marked for ${fieldEmp.name} at ${fieldEmp.location}`
    );
  };

  // ==================== WEB ATTENDANCE FUNCTIONS ====================
  const handleWebAttendance = async (type = "checkin") => {
    const actionKey = type === "checkin" ? "isCheckingIn" : "isCheckingOut";
    setWebState((prev) => ({ ...prev, [actionKey]: true }));

    try {
      // Check IP whitelist
      const currentIP = webState.currentIP || "192.168.1.100";
      const isIPAllowed = whitelistIPs.includes(currentIP);

      if (!isIPAllowed && !settings.offlineMode) {
        alert(`Access denied: IP ${currentIP} is not in whitelist`);
        setWebState((prev) => ({ ...prev, [actionKey]: false }));
        return;
      }

      // Check selfie requirement
      if (
        settings.requireSelfie &&
        type === "checkin" &&
        !webState.webcamImage
      ) {
        const capture = window.confirm(
          "Selfie verification required. Open webcam now?"
        );
        if (capture) {
          setWebState((prev) => ({ ...prev, showWebcamModal: true }));
          setWebState((prev) => ({ ...prev, [actionKey]: false }));
          return;
        } else {
          alert("Selfie verification required for web check-in.");
          setWebState((prev) => ({ ...prev, [actionKey]: false }));
          return;
        }
      }

      const selectedEmp = employees.find((e) => e.id === selectedEmployee);
      const now = new Date();

      const attendanceRecord = {
        id: Date.now(),
        employeeId: selectedEmployee,
        employeeName: selectedEmp?.name || "Unknown",
        date: now.toISOString().split("T")[0],
        timestamp: now.toISOString(),
        type: type,
        method: "web",
        ipAddress: currentIP,
        webcamImage: webState.webcamImage,
        status: type === "checkin" ? "Present" : "Checked Out",
        location: "Web Portal",
        syncStatus: isOnline ? "synced" : "pending",
      };

      if (!isOnline && settings.offlineMode) {
        dispatch({ type: "ADD_OFFLINE_RECORD", payload: attendanceRecord });
        alert(`✅ ${type} recorded offline via web portal`);
      } else {
        dispatch({ type: "ADD_ATTENDANCE", payload: attendanceRecord });
        alert(`✅ Web ${type} successful!`);
      }

      // Add punch record
      const punch = {
        id: Date.now(),
        employeeId: selectedEmployee,
        employeeName: selectedEmp?.name,
        timestamp: now.toISOString(),
        type: type,
        method: "web",
        ipAddress: currentIP,
        verified: true,
      };
      dispatch({ type: "ADD_PUNCH", payload: punch });

      // Clear webcam image after check-in
      if (type === "checkin" && settings.requireSelfie) {
        setWebState((prev) => ({ ...prev, webcamImage: null }));
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setWebState((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  // ==================== ATTENDANCE FUNCTIONS ====================
  const markAttendance = async (method) => {
    setProcessingAttendance(true);

    try {
      let locationData = null;
      let selfieData = null;

      if (method === "gps") {
        try {
          const locationResult = await getCurrentLocation();
          locationData = locationResult.location;
        } catch (error) {
          alert(`Location error: ${error.message}`);
          setProcessingAttendance(false);
          return;
        }
      }

      if (method === "web" && settings.requireSelfie) {
        // Simulate camera access
        await new Promise((resolve) => setTimeout(resolve, 1000));
        selfieData = "data:image/simulated;base64,simulated";
      }

      const selectedEmp = employees.find((e) => e.id === selectedEmployee);
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      const newAttendance = {
        id: Date.now(),
        employeeId: selectedEmployee,
        employeeName: selectedEmp?.name || "Unknown",
        date: today,
        checkIn: now.toISOString(),
        checkOut: null,
        method: method,
        location: locationData,
        selfie: selfieData,
        status: "Present",
        workHours: 0,
        overtime: 0,
        breakTime: settings.breakDuration,
        nightShift: isNightShift,
        syncStatus: isOnline ? "synced" : "pending",
        ipAddress: method === "web" ? "192.168.1.100" : null,
      };

      if (!isOnline && settings.offlineMode) {
        dispatch({ type: "ADD_OFFLINE_RECORD", payload: newAttendance });
        alert(
          `Attendance marked offline (${method.toUpperCase()}). Will sync when online.`
        );
      } else {
        dispatch({ type: "ADD_ATTENDANCE", payload: newAttendance });
        alert(`Attendance marked via ${method.toUpperCase()}`);
      }

      const punch = {
        id: Date.now(),
        employeeId: selectedEmployee,
        employeeName: selectedEmp?.name || "Unknown",
        timestamp: now.toISOString(),
        type: "checkin",
        method: method,
        location: locationData,
        verified: true,
      };
      dispatch({ type: "ADD_PUNCH", payload: punch });
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setProcessingAttendance(false);
    }
  };

  const markCheckOut = (recordId) => {
    const record = attendanceRecords.find((r) => r.id === recordId);
    if (!record) return;

    const checkOutTime = new Date();
    const checkInTime = new Date(record.checkIn);
    
    // Use enhanced processing if auto calculation is enabled
    if (settings.autoCalculateWorkHours && settings.autoFirstInLastOut) {
      const processedData = processAttendanceRecord(record.employeeId, record.date);
      
      const updatedRecord = {
        ...record,
        checkOut: checkOutTime.toISOString(),
        workHours: processedData.workHours,
        totalWorkHours: processedData.totalWorkHours,
        breakHours: processedData.breakHours,
        overtime: processedData.overtime,
        overtimeRate: processedData.overtimeRate,
        overtimeAmount: processedData.overtimeAmount,
        status: processedData.status,
        firstIn: processedData.firstIn,
        lastOut: processedData.lastOut || checkOutTime.toISOString(),
        punchCount: processedData.punchCount,
        isWeekend: processedData.isWeekend,
        isHoliday: processedData.isHoliday,
        isNightShift: processedData.isNightShift,
        holidayName: processedData.holidayName,
        weekOff: processedData.weekOff,
      };

      dispatch({ type: "UPDATE_ATTENDANCE", payload: updatedRecord });
    } else {
      // Legacy calculation
      const workHoursMs = checkOutTime - checkInTime;
      const workHours = workHoursMs / (1000 * 60 * 60);
      const breakHours = (record.breakTime || settings.breakDuration) / 60;
      const netWorkHours = Math.max(0, workHours - breakHours);

      const overtimeData = calculateOvertimeWithRules(
        netWorkHours,
        new Date(record.date),
        record.nightShift || false
      );

      const updatedRecord = {
        ...record,
        checkOut: checkOutTime.toISOString(),
        workHours: netWorkHours.toFixed(2),
        overtime: overtimeData.hours,
        overtimeRate: overtimeData.rate,
        overtimeAmount: overtimeData.amount,
        status: calculateAttendanceStatus(netWorkHours, record, new Date(record.date)),
        isWeekend: isWeekend(new Date(record.date)),
        isHoliday: isHoliday(new Date(record.date)),
        isNightShift: record.nightShift || false,
        holidayName: getHolidayName(new Date(record.date)),
      };

      dispatch({ type: "UPDATE_ATTENDANCE", payload: updatedRecord });
    }

    // Add checkout punch
    const punch = {
      id: Date.now(),
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      timestamp: checkOutTime.toISOString(),
      type: "checkout",
      method: record.method,
      verified: true,
    };
    dispatch({ type: "ADD_PUNCH", payload: punch });

    alert("Check-out recorded successfully");
  };

  // ==================== SYNC & EXPORT FUNCTIONS ====================
  const syncOfflineData = () => {
    if (offlineData.length === 0) {
      alert("No offline data to sync");
      return;
    }

    offlineData.forEach((record) => {
      dispatch({
        type: "ADD_ATTENDANCE",
        payload: { ...record, syncStatus: "synced" },
      });
    });

    dispatch({ type: "CLEAR_OFFLINE_DATA" });
    dispatch({ type: "SYNC_DATA" });

    alert(`Synced ${offlineData.length} offline records`);
  };

  const addSyncLog = (type, status, message) => {
    const log = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type,
      status,
      message,
      device: "System",
    };
    dispatch({ type: "ADD_SYNC_LOG", payload: log });
  };

  const handleExport = (type = "attendance") => {
    let data, filename;

    switch (type) {
      case "attendance":
        data = filteredRecords;
        filename = `attendance_${new Date().toISOString().split("T")[0]}.csv`;
        break;
      case "devices":
        data = biometricDevices;
        filename = `devices_${new Date().toISOString().split("T")[0]}.csv`;
        break;
      case "sync":
        data = syncLogs;
        filename = `sync_logs_${new Date().toISOString().split("T")[0]}.csv`;
        break;
      default:
        data = attendanceRecords;
        filename = `attendance_export_${
          new Date().toISOString().split("T")[0]
        }.csv`;
    }

    const csv = [
      Object.keys(data[0] || {}),
      ...data.map((item) => Object.values(item)),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  {
    /* Add this helper function at the top with other utility functions */
  }
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "present":
        return "bg-success";
      case "traveling":
      case "syncing":
        return "bg-info";
      case "working":
      case "processing":
        return "bg-primary";
      case "offline":
      case "inactive":
        return "bg-secondary";
      case "warning":
      case "pending":
        return "bg-warning";
      case "error":
      case "absent":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Function to save manual entry
  const saveManualEntry = () => {
    if (!manualEntryData.employeeId) {
      alert("Please select an employee");
      return;
    }

    const selectedEmp = employees.find(
      (e) => e.id === manualEntryData.employeeId
    );
    const now = new Date();

    // Calculate work hours
    const checkInTime = parseTime(manualEntryData.checkIn);
    const checkOutTime = parseTime(manualEntryData.checkOut);
    const workHours =
      checkOutTime > checkInTime ? (checkOutTime - checkInTime) / 60 : 0;
    const breakHours = (manualEntryData.breakTime || 60) / 60;
    const netWorkHours = Math.max(0, workHours - breakHours);

    // Enhanced overtime calculation with rules
    const dateObj = new Date(manualEntryData.date);
    const overtimeData = calculateOvertimeWithRules(
      netWorkHours,
      dateObj,
      manualEntryData.nightShift || false
    );
    
    // Determine status with enhanced calculation
    const baseRecord = {
      employeeId: manualEntryData.employeeId,
      date: manualEntryData.date,
      onLeave: manualEntryData.status === "On Leave",
      holiday: isHoliday(dateObj),
      weekOff: isWeekOff(dateObj, manualEntryData.employeeId),
    };
    const calculatedStatus = calculateAttendanceStatus(netWorkHours, baseRecord, dateObj);

    const manualRecord = {
      id: Date.now(),
      employeeId: manualEntryData.employeeId,
      employeeName: selectedEmp?.name || "Unknown",
      date: manualEntryData.date,
      checkIn: `${manualEntryData.date}T${manualEntryData.checkIn}:00`,
      checkOut: `${manualEntryData.date}T${manualEntryData.checkOut}:00`,
      method: "manual",
      status: calculatedStatus || manualEntryData.status,
      workHours: netWorkHours.toFixed(2),
      totalWorkHours: workHours.toFixed(2),
      breakHours: breakHours.toFixed(2),
      overtime: overtimeData.hours,
      overtimeRate: overtimeData.rate,
      overtimeAmount: overtimeData.amount,
      breakTime: manualEntryData.breakTime || 60,
      reason: manualEntryData.reason,
      approvedBy: "Admin",
      approvedAt: now.toISOString(),
      entryType: "single",
      isVerified: true,
      verifiedBy: "HR",
      verificationDate: now.toISOString(),
      notes: manualEntryData.reason,
      // Enhanced tracking
      isWeekend: isWeekend(dateObj),
      isHoliday: isHoliday(dateObj),
      isNightShift: manualEntryData.nightShift || false,
      holidayName: getHolidayName(dateObj),
      weekOff: isWeekOff(dateObj, manualEntryData.employeeId),
      // Audit trail
      createdBy: "Admin",
      createdAt: now.toISOString(),
      lastModifiedBy: "Admin",
      lastModifiedAt: now.toISOString(),
      changeLog: [
        {
          timestamp: now.toISOString(),
          action: "Created",
          user: "Admin",
          details: "Manual attendance entry created",
        },
      ],
    };

    dispatch({ type: "ADD_ATTENDANCE", payload: manualRecord });

    // Add to audit log
    const auditLog = {
      id: Date.now(),
      timestamp: now.toISOString(),
      action: "CREATE_MANUAL_ENTRY",
      user: "Admin",
      employeeId: manualEntryData.employeeId,
      employeeName: selectedEmp?.name,
      date: manualEntryData.date,
      details: `Manual entry: ${manualEntryData.status} - ${
        manualEntryData.reason || "No reason provided"
      }`,
      ipAddress: "192.168.1.100",
    };

    // Add to sync logs
    dispatch({
      type: "ADD_SYNC_LOG",
      payload: {
        id: Date.now(),
        timestamp: now.toISOString(),
        type: "manual_entry",
        status: "Success",
        message: `Manual attendance entry created for ${selectedEmp?.name}`,
        records: 1,
      },
    });

    alert(`Manual entry saved for ${selectedEmp?.name}`);

    // Reset form
    setManualEntryData({
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      checkIn: "09:00",
      checkOut: "18:00",
      status: "Present",
      reason: "",
      overtime: 0,
      breakTime: 60,
      nightShift: false,
      weekend: false,
      holiday: false,
    });
  };

  // Function to handle bulk upload
  const handleBulkUpload = (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setBulkUploadFile(file);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          processBulkFile(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Function to process bulk file
  const processBulkFile = (file) => {
    // Simulate processing
    setTimeout(() => {
      const records = [
        {
          id: Date.now() + 1,
          employeeId: "EMP001",
          employeeName: "Khuswanth Rao",
          date: new Date().toISOString().split("T")[0],
          status: "Present",
          method: "manual",
          approvedBy: "Admin",
          importedFrom: file.name,
          importType: "bulk_upload",
        },
        {
          id: Date.now() + 2,
          employeeId: "EMP002",
          employeeName: "John Smith",
          date: new Date().toISOString().split("T")[0],
          status: "Present",
          method: "manual",
          approvedBy: "Admin",
          importedFrom: file.name,
          importType: "bulk_upload",
        },
      ];

      // Add records
      records.forEach((record) => {
        dispatch({ type: "ADD_ATTENDANCE", payload: record });
      });

      // Add to import history
      const importRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        recordsImported: records.length,
        status: "Success",
        importedBy: "Admin",
        source: "bulk_upload",
      };

      setImportHistory((prev) => [importRecord, ...prev]);
      localStorage.setItem(
        "importHistory",
        JSON.stringify([importRecord, ...importHistory])
      );

      // Add audit log
      const auditLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action: "BULK_UPLOAD",
        user: "Admin",
        fileName: file.name,
        recordsCount: records.length,
        details: `Bulk upload completed: ${records.length} records imported`,
        ipAddress: "192.168.1.100",
      };

      setIsUploading(false);
      setUploadProgress(0);
      setBulkUploadFile(null);
      alert(`Bulk upload completed! ${records.length} records imported.`);
    }, 1000);
  };

  // Function to download template
  const downloadTemplate = (format = "csv") => {
    let template, filename, mimeType;

    if (format === "csv") {
      template = [
        [
          "Employee ID",
          "Date",
          "Check In",
          "Check Out",
          "Status",
          "Overtime Hours",
          "Reason",
          "Approved By",
        ],
        [
          "EMP001",
          "2024-01-15",
          "09:00",
          "18:00",
          "Present",
          "2",
          "Regular work",
          "Admin",
        ],
        [
          "EMP002",
          "2024-01-15",
          "09:30",
          "17:30",
          "Present",
          "1",
          "Regular work",
          "Admin",
        ],
        ["EMP003", "2024-01-15", "", "", "Absent", "0", "Sick leave", "HR"],
        [
          "EMP004",
          "2024-01-15",
          "09:00",
          "13:00",
          "Half Day",
          "0",
          "Medical appointment",
          "Manager",
        ],
      ]
        .map((row) => row.join(","))
        .join("\n");
      filename = "attendance_template.csv";
      mimeType = "text/csv";
    } else if (format === "excel") {
      // Simplified Excel template (in real app, use a library like xlsx)
      template =
        "Employee ID,Date,Check In,Check Out,Status,Overtime Hours,Reason,Approved By\nEMP001,2024-01-15,09:00,18:00,Present,2,Regular work,Admin";
      filename = "attendance_template.xlsx";
      mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    const blob = new Blob([template], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Enhanced function to import from external system
  const importFromExternalSystem = (system, config = {}) => {
    setIsUploading(true);

    // Supported external systems
    const supportedSystems = {
      'sap': { name: 'SAP SuccessFactors', apiEndpoint: '/api/sap/attendance' },
      'oracle': { name: 'Oracle HCM Cloud', apiEndpoint: '/api/oracle/attendance' },
      'workday': { name: 'Workday', apiEndpoint: '/api/workday/attendance' },
      'adp': { name: 'ADP Workforce Now', apiEndpoint: '/api/adp/attendance' },
      'bamboohr': { name: 'BambooHR', apiEndpoint: '/api/bamboohr/attendance' },
      'zenefits': { name: 'Zenefits', apiEndpoint: '/api/zenefits/attendance' },
      'gusto': { name: 'Gusto', apiEndpoint: '/api/gusto/attendance' },
      'paycom': { name: 'Paycom', apiEndpoint: '/api/paycom/attendance' },
      'paychex': { name: 'Paychex', apiEndpoint: '/api/paychex/attendance' },
      'kronos': { name: 'Kronos Workforce Central', apiEndpoint: '/api/kronos/attendance' },
      'ultipro': { name: 'UltiPro', apiEndpoint: '/api/ultipro/attendance' },
      'paylocity': { name: 'Paylocity', apiEndpoint: '/api/paylocity/attendance' },
      'api': { name: 'Custom API', apiEndpoint: config.apiEndpoint || '/api/custom/attendance' },
    };

    const systemConfig = supportedSystems[system.toLowerCase()] || { name: system, apiEndpoint: '/api/external/attendance' };

    // Simulate external system import with enhanced data mapping
    setTimeout(() => {
      const records = [
        {
          id: Date.now() + 100,
          employeeId: "EXT001",
          employeeName: "External Employee 1",
          date: new Date().toISOString().split("T")[0],
          status: "Present",
          method: "external",
          sourceSystem: systemConfig.name,
          sourceSystemId: system,
          importedAt: new Date().toISOString(),
          approvedBy: "System Admin",
          apiEndpoint: systemConfig.apiEndpoint,
          syncType: config.syncType || 'manual', // 'manual', 'scheduled', 'realtime'
          mappingConfig: config.mappingConfig || {},
        },
        {
          id: Date.now() + 200,
          employeeId: "EXT002",
          employeeName: "External Employee 2",
          date: new Date().toISOString().split("T")[0],
          status: "Absent",
          method: "external",
          sourceSystem: systemConfig.name,
          sourceSystemId: system,
          importedAt: new Date().toISOString(),
          approvedBy: "System Admin",
          apiEndpoint: systemConfig.apiEndpoint,
          syncType: config.syncType || 'manual',
          mappingConfig: config.mappingConfig || {},
        },
      ];

      // Add records with validation
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      records.forEach((record) => {
        try {
          // Validate record before adding
          if (record.employeeId && record.date) {
            dispatch({ type: "ADD_ATTENDANCE", payload: record });
            successCount++;
          } else {
            errors.push(`Invalid record: Missing employee ID or date`);
            errorCount++;
          }
        } catch (error) {
          errors.push(`Error importing record: ${error.message}`);
          errorCount++;
        }
      });

      // Add to import history with detailed information
      const importRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        systemName: systemConfig.name,
        systemId: system,
        recordsImported: successCount,
        recordsFailed: errorCount,
        totalRecords: records.length,
        status: errorCount === 0 ? "Success" : errorCount === records.length ? "Failed" : "Partial",
        importedBy: config.user || "System",
        source: "external_system",
        apiEndpoint: systemConfig.apiEndpoint,
        syncType: config.syncType || 'manual',
        errors: errors.length > 0 ? errors : undefined,
      };

      setImportHistory((prev) => [importRecord, ...prev]);
      localStorage.setItem('importHistory', JSON.stringify([importRecord, ...importHistory]));

      // Add audit log
      const auditLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action: "EXTERNAL_IMPORT",
        user: config.user || "System",
        systemName: systemConfig.name,
        systemId: system,
        recordsCount: successCount,
        recordsFailed: errorCount,
        details: `Imported ${successCount} records from ${systemConfig.name}${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        ipAddress: "192.168.1.100",
        apiEndpoint: systemConfig.apiEndpoint,
      };

      setIsUploading(false);
      if (errorCount === 0) {
        alert(`✅ Successfully imported ${successCount} records from ${systemConfig.name}`);
      } else {
        alert(`⚠️ Import completed: ${successCount} succeeded, ${errorCount} failed from ${systemConfig.name}`);
      }
    }, 1500);
  };

  // Function to preview bulk data
  const previewBulkData = (data) => {
    setPreviewData(data);
    setShowPreviewModal(true);
  };

  // Enhanced manual entries audit trail
  const getAuditTrail = (filters = {}) => {
    const { employeeId = null, startDate = null, endDate = null, action = null } = filters;
    
    let auditRecords = attendanceRecords
      .filter((r) => {
        if (r.method !== "manual") return false;
        if (employeeId && r.employeeId !== employeeId) return false;
        if (startDate && r.date < startDate) return false;
        if (endDate && r.date > endDate) return false;
        return true;
      })
      .map((record) => ({
        id: record.id,
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        date: record.date,
        action: "CREATE_MANUAL_ENTRY",
        timestamp: record.createdAt || record.date,
        user: record.createdBy || "Admin",
        details: `Manual entry created: ${record.status}`,
        ipAddress: record.ipAddress || "N/A",
        changeLog: record.changeLog || [],
        auditEvents: [
          {
            timestamp: record.createdAt || record.date,
            action: "Created",
            user: record.createdBy || "Admin",
            details: `Manual attendance entry created with status: ${record.status}`,
          },
          ...(record.changeLog || []),
          ...(record.lastModifiedAt ? [{
            timestamp: record.lastModifiedAt,
            action: "Modified",
            user: record.lastModifiedBy || "Admin",
            details: "Record was last modified",
          }] : []),
        ],
        status: record.status,
        method: record.method,
        approvedBy: record.approvedBy,
        verifiedBy: record.verifiedBy,
        isVerified: record.isVerified,
      }));

    if (action) {
      auditRecords = auditRecords.filter(r => r.action === action);
    }

    return auditRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Add audit log entry
  const addAuditLogEntry = (entry) => {
    const auditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry,
    };

    // Store in localStorage for audit trail
    const auditTrail = loadFromStorage('auditTrail', []);
    auditTrail.unshift(auditLog);
    
    // Keep only last 1000 entries
    const trimmedTrail = auditTrail.slice(0, 1000);
    localStorage.setItem('auditTrail', JSON.stringify(trimmedTrail));

    return auditLog;
  };

  // Update audit trail when manual entry is modified
  const updateRecordAuditTrail = (recordId, action, user, details) => {
    const record = attendanceRecords.find(r => r.id === recordId);
    if (!record) return;

    const changeLogEntry = {
      timestamp: new Date().toISOString(),
      action,
      user,
      details,
    };

    const updatedRecord = {
      ...record,
      changeLog: [...(record.changeLog || []), changeLogEntry],
      lastModifiedBy: user,
      lastModifiedAt: new Date().toISOString(),
    };

    dispatch({ type: "UPDATE_ATTENDANCE", payload: updatedRecord });
    addAuditLogEntry({
      action: `UPDATE_MANUAL_ENTRY_${action}`,
      user,
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      recordId,
      details,
    });
  };
  // ==================== FILTERING & PAGINATION ====================
  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || record.status === statusFilter;
    const matchesMethod =
      methodFilter === "All" || record.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, methodFilter]);

  // ==================== SELECTION HANDLERS ====================
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRecords(currentRecords.map((record) => record.id));
    } else {
      setSelectedRecords([]);
    }
  };

  const handleSelectRecord = (recordId, e) => {
    if (e) e.stopPropagation();
    if (selectedRecords.includes(recordId)) {
      setSelectedRecords(selectedRecords.filter((id) => id !== recordId));
    } else {
      setSelectedRecords([...selectedRecords, recordId]);
    }
  };

  // ==================== DELETE HANDLERS ====================
  const handleDelete = (recordId) => {
    setRecordToDelete(recordId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      dispatch({ type: "DELETE_ATTENDANCE", payload: recordToDelete });
      setSelectedRecords(selectedRecords.filter((id) => id !== recordToDelete));
      setShowDeleteModal(false);
      setRecordToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  // ==================== VIEW/EDIT HANDLERS ====================
  const handleView = (recordId) => {
    const record = attendanceRecords.find((r) => r.id === recordId);
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const handleEdit = (recordId) => {
    const record = attendanceRecords.find((r) => r.id === recordId);
    setEditingRecord(record);
    setEditFormData({
      employeeId: record.employeeId,
      date: record.date,
      checkIn: record.checkIn
        ? new Date(record.checkIn).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      checkOut: record.checkOut
        ? new Date(record.checkOut).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      status: record.status,
      reason: record.reason || "",
      overtime: record.overtime || 0,
      breakTime: record.breakTime || 60,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingRecord) {
      const updatedRecord = {
        ...editingRecord,
        ...editFormData,
      };
      dispatch({ type: "UPDATE_ATTENDANCE", payload: updatedRecord });
      
      // Update audit trail
      updateRecordAuditTrail(
        editingRecord.id,
        "EDIT",
        "Admin",
        `Record updated: Status changed to ${editFormData.status}`
      );
      
      setShowEditModal(false);
      setEditingRecord(null);
      alert("Attendance record updated successfully!");
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingRecord(null);
  };

  // ==================== STATS CALCULATION ====================
  const stats = {
    totalRecords: attendanceRecords.length,
    present: attendanceRecords.filter((r) => r.status === "Present").length,
    absent: attendanceRecords.filter((r) => r.status === "Absent").length,
    halfDay: attendanceRecords.filter((r) => r.status === "Half Day").length,
    onLeave: attendanceRecords.filter((r) => r.status === "On Leave").length,
    late: attendanceRecords.filter((r) => {
      if (!r.checkIn || r.lateArrival <= 0) return false;
      return r.lateArrival > 0;
    }).length,
    totalOvertime: attendanceRecords
      .reduce((sum, r) => sum + (parseFloat(r.overtime) || 0), 0)
      .toFixed(1),
  };

  // ==================== RENDER FUNCTIONS ====================

  const renderBiometricTab = () => (
    <div className="row g-4">
      {/* Left Column - Device Management & Controls */}
      <div className="col-12 col-lg-6">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div>
            <h6 className="h6 mb-1">Biometric Integration</h6>
            <p className="text-secondary mb-0">
              Support for fingerprint, face recognition, iris, RFID devices
            </p>
          </div>
          <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                localStorage.removeItem("biometricDevices");
                localStorage.removeItem("syncLogs");
                dispatch({ type: "SET_DEVICES", payload: initialDevices });
                dispatch({ type: "SET_SYNC_LOGS", payload: [] });
                alert("Biometric data reset to defaults");
              }}
              title="Reset Data"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Device Add Section */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <Fingerprint size={20} className="me-2 text-primary" />
              Add New Biometric Device
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <label className="form-label">Vendor</label>
                <select
                  className="form-select"
                  value={newDevice.vendor}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, vendor: e.target.value })
                  }
                >
                  <option value="ZKTeco">ZKTeco</option>
                  <option value="eSSL">eSSL</option>
                  <option value="Honeywell">Honeywell</option>
                  <option value="Suprema">Suprema</option>
                  <option value="HID">HID Global</option>
                  <option value="Mantra">Mantra</option>
                  <option value="Matrix">Matrix</option>
                  <option value="BioEnable">BioEnable</option>
                  <option value="Pegasus">Pegasus</option>
                  <option value="Starlight">Starlight</option>
                  <option value="IDTECH">ID TECH</option>
                  <option value="RealTime">RealTime</option>
                  <option value="BioMax">BioMax</option>
                  <option value="Kimaldi">Kimaldi</option>
                  <option value="Other">Other Vendor</option>
                </select>
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label">Device Type</label>
                <select
                  className="form-select"
                  value={newDevice.type}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, type: e.target.value })
                  }
                >
                  <option value="fingerprint">Fingerprint</option>
                  <option value="face">Face Recognition</option>
                  <option value="iris">Iris Scanner</option>
                  <option value="rfid">RFID/Card</option>
                  <option value="palm">Palm Scanner</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Model Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., iClock 880, BioTime 8.0"
                  value={newDevice.model}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, model: e.target.value })
                  }
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">IP Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="192.168.1.100"
                  value={newDevice.ipAddress}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, ipAddress: e.target.value })
                  }
                />
              </div>

              <div className="col-12">
                <div className="d-grid gap-2 d-md-flex">
                 <button
                  type="button"
                  className="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
                  onClick={addBiometricDevice}
                  disabled={!newDevice.model || !newDevice.ipAddress}
>
                  <Plus size={16} className="me-2" />
                  Add Device
</button>

                <button
                  type="button"
                  className="btn btn-success flex-fill d-inline-flex align-items-center justify-content-center"
                  onClick={() => syncBiometricData()}
>
                  <RefreshCw size={16} className="me-2" />
                  Sync All Devices
</button>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Health Monitoring */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <BarChart3 size={20} className="me-2 text-primary" />
              Device Health Monitor
            </h5>
          </div>
          <div className="card-body">
            {biometricDevices.length === 0 ? (
              <div className="text-center py-5">
                <BarChart3 size={48} className="text-muted mb-3" />
                <p className="text-muted">No biometric devices configured</p>
                <p className="text-muted small">
                  Add devices to monitor their health status
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {biometricDevices.map((device) => {
                  const healthStatus =
                    device.health >= 80
                      ? "Healthy"
                      : device.health >= 60
                      ? "Warning"
                      : "Critical";
                  const statusColor =
                    device.health >= 80
                      ? "success"
                      : device.health >= 60
                      ? "warning"
                      : "danger";

                  return (
                    <div key={device.id} className="col-12 col-md-6">
                      <div className="border rounded p-3 h-100">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1">{device.model}</h6>
                            <small className="text-muted d-block">
                              {device.vendor}
                            </small>
                            <small className="d-block">
                              <code>{device.ipAddress}</code>
                            </small>
                          </div>
                          <span className={`badge bg-${statusColor}`}>
                            {device.health}%
                          </span>
                        </div>

                        <div className="mb-2">
                          <div className="d-flex justify-content-between small text-muted mb-1">
                            <span>Health Status</span>
                            <span>{healthStatus}</span>
                          </div>
                          <div className="progress" style={{ height: "6px" }}>
                            <div
                              className={`progress-bar bg-${statusColor}`}
                              style={{ width: `${device.health}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between small text-muted">
                          <span>
                            <Users size={12} className="me-1" />
                            {device.employees || 0} employees
                          </span>
                          <span>
                            {new Date(device.lastSync).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Biometric Punch Simulation */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <Clock size={20} className="me-2 text-primary" />
              Biometric Punch Simulation
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Employee</label>
                <select
                  className="form-select"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Punch Type</label>
                <select
                  className="form-select"
                  value={punchType}
                  onChange={(e) => setPunchType(e.target.value)}
                >
                  <option value="checkin">Check In</option>
                  <option value="checkout">Check Out</option>
                  <option value="breakstart">Break Start</option>
                  <option value="breakend">Break End</option>
                  <option value="overtime">Overtime Start</option>
                  <option value="overtimeend">Overtime End</option>
                </select>
              </div>

              <div className="col-12">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      const selectedEmp = employees.find(
                        (e) => e.id === selectedEmployee
                      );
                      const now = new Date();

                      // Check for duplicate punch within configured window
                      const duplicateWindow =
                        settings.duplicatePunchWindow || 5; // minutes
                      const lastPunch = punches
                        .filter(
                          (p) =>
                            p.employeeId === selectedEmployee &&
                            p.method === "biometric"
                        )
                        .sort(
                          (a, b) =>
                            new Date(b.timestamp) - new Date(a.timestamp)
                        )[0];

                      if (lastPunch) {
                        const lastPunchTime = new Date(lastPunch.timestamp);
                        const timeDiff = (now - lastPunchTime) / (1000 * 60); // minutes

                        if (
                          timeDiff < duplicateWindow &&
                          punchType === lastPunch.type
                        ) {
                          alert(
                            `Duplicate punch detected! Please wait ${
                              duplicateWindow - Math.ceil(timeDiff)
                            } more minutes.`
                          );
                          return;
                        }
                      }

                      // Simulate biometric punch
                      const punch = {
                        id: Date.now(),
                        employeeId: selectedEmployee,
                        employeeName: selectedEmp?.name || "Unknown",
                        timestamp: now.toISOString(),
                        type: punchType,
                        method: "biometric",
                        deviceId: biometricDevices[0]?.id || null,
                        deviceModel: biometricDevices[0]?.model || "Simulated",
                        verified: true,
                        duplicateCheck: lastPunch ? "Passed" : "First Punch",
                      };

                      dispatch({ type: "ADD_PUNCH", payload: punch });

                      // If it's a checkin/checkout, also add attendance record
                      if (punchType === "checkin" || punchType === "checkout") {
                        const today = now.toISOString().split("T")[0];
                        
                        // Use enhanced processing if enabled
                        let attendanceRecord;
                        if (settings.autoCalculateWorkHours && settings.autoFirstInLastOut) {
                          // Process after adding punch to get accurate calculations
                          setTimeout(() => {
                            const processedData = processAttendanceRecord(selectedEmployee, today);
                            const existingRecord = attendanceRecords.find(
                              (r) => r.employeeId === selectedEmployee && r.date === today
                            );
                            
                            if (existingRecord) {
                              const updatedRecord = {
                                ...existingRecord,
                                ...processedData,
                                method: "biometric",
                                deviceId: biometricDevices[0]?.id,
                                deviceModel: biometricDevices[0]?.model,
                                syncStatus: "synced",
                              };
                              dispatch({ type: "UPDATE_ATTENDANCE", payload: updatedRecord });
                            } else {
                              attendanceRecord = {
                                id: Date.now(),
                                employeeId: selectedEmployee,
                                employeeName: selectedEmp?.name || "Unknown",
                                date: today,
                                timestamp: now.toISOString(),
                                type: punchType,
                                method: "biometric",
                                deviceId: biometricDevices[0]?.id,
                                deviceModel: biometricDevices[0]?.model,
                                status: processedData.status,
                                workHours: processedData.workHours,
                                firstIn: processedData.firstIn,
                                lastOut: processedData.lastOut,
                                punchCount: processedData.punchCount,
                                isWeekend: processedData.isWeekend,
                                isHoliday: processedData.isHoliday,
                                isNightShift: processedData.isNightShift,
                                holidayName: processedData.holidayName,
                                syncStatus: "synced",
                              };
                              dispatch({ type: "ADD_ATTENDANCE", payload: attendanceRecord });
                            }
                          }, 100);
                        } else {
                          // Legacy simple record
                          attendanceRecord = {
                            id: Date.now(),
                            employeeId: selectedEmployee,
                            employeeName: selectedEmp?.name || "Unknown",
                            date: today,
                            timestamp: now.toISOString(),
                            type: punchType,
                            method: "biometric",
                            deviceId: biometricDevices[0]?.id,
                            deviceModel: biometricDevices[0]?.model,
                            status:
                              punchType === "checkin" ? "Present" : "Checked Out",
                            syncStatus: "synced",
                          };
                          dispatch({ type: "ADD_ATTENDANCE", payload: attendanceRecord });
                        }

                        // Add to sync log
                        const syncLog = {
                          id: Date.now(),
                          timestamp: now.toISOString(),
                          deviceId: biometricDevices[0]?.id,
                          type: "biometric_punch",
                          status: "Success",
                          message: `${punchType} recorded for ${selectedEmp?.name}`,
                          records: 1,
                        };
                        dispatch({ type: "ADD_SYNC_LOG", payload: syncLog });
                      }

                      alert(
                        `✅ Biometric ${punchType} simulated for ${selectedEmp?.name}`
                      );
                    }}
                  >
                   <span className="d-inline-flex align-items-center">
  <Fingerprint size={20} className="me-2" />
  Simulate Biometric{" "}
  {punchType.replace(/([A-Z])/g, " $1").toUpperCase()}
</span>

                  </button>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      const count = punches.filter(
                        (p) => p.method === "biometric"
                      ).length;
                      alert(
                        `Total biometric punches: ${count}\nLast 24h: ${
                          punches.filter(
                            (p) =>
                              p.method === "biometric" &&
                              new Date(p.timestamp) >
                                new Date(Date.now() - 24 * 60 * 60 * 1000)
                          ).length
                        }`
                      );
                    }}
                  >
                    View Punch Statistics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Device Status & Monitoring */}
      <div className="col-12 col-lg-6">
        {/* Real-time Sync Control */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <RefreshCw size={20} className="me-2 text-primary" />
                Real-time Sync Control
              </h5>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoSyncToggle"
                  checked={localStorage.getItem("biometricAutoSync") === "true"}
                  onChange={(e) => {
                    localStorage.setItem("biometricAutoSync", e.target.checked);
                    if (e.target.checked) {
                      alert(
                        "Auto sync enabled. Devices will sync every 5 minutes."
                      );
                    } else {
                      alert("Auto sync disabled.");
                    }
                  }}
                />
                <label
                  className="form-check-label small"
                  htmlFor="autoSyncToggle"
                >
                  Auto Sync
                </label>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-2 mb-3">
              <div className="col-6">
                <button
                  className="btn btn-outline-success w-100"
                  onClick={() => {
                    const onlineDevices = biometricDevices.filter(
                      (d) => d.status === "Online"
                    );
                    onlineDevices.forEach((device) => {
                      syncBiometricData(device.id);
                    });
                    alert(`Syncing ${onlineDevices.length} online devices...`);
                  }}
                >
                  Sync Online Devices
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-outline-warning w-100"
                  onClick={() => {
                    const offlineDevices = biometricDevices.filter(
                      (d) => d.status === "Offline"
                    );
                    if (offlineDevices.length > 0) {
                      alert(
                        `Trying to reconnect ${offlineDevices.length} offline devices...`
                      );
                      // Simulate reconnection attempt
                      offlineDevices.forEach((device) => {
                        setTimeout(() => {
                          dispatch({
                            type: "UPDATE_DEVICE",
                            payload: {
                              ...device,
                              status: "Online",
                              health: 85,
                            },
                          });
                        }, 1000);
                      });
                    } else {
                      alert("All devices are online!");
                    }
                  }}
                >
                  Reconnect Offline
                </button>
              </div>
            </div>

            {state.lastSync && (
              <div className="alert alert-info py-2 mb-0">
                <div className="d-flex align-items-center">
                  <Clock size={14} className="me-2" />
                  <span className="small">
                    Last sync: {new Date(state.lastSync).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Device Status Table */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <Settings size={20} className="me-2 text-primary" />
              Device Status Dashboard
              <span className="badge bg-primary ms-2">
                {biometricDevices.length} devices
              </span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "40px" }}>#</th>
                    <th>Device</th>
                    <th className="text-center">Type</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Last Sync</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {biometricDevices.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="text-muted">
                          <Fingerprint size={32} className="mb-2" />
                          <p className="mb-0">No devices configured</p>
                          <small>Add biometric devices to get started</small>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    biometricDevices.map((device, index) => {
                      const statusConfig = {
                        Online: { color: "success", icon: "●" },
                        Offline: { color: "danger", icon: "●" },
                        Syncing: { color: "warning", icon: "↻" },
                      }[device.status] || { color: "secondary", icon: "●" };

                      return (
                        <tr key={device.id}>
                          <td className="text-muted">{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className={`bg-${statusConfig.color} bg-opacity-10 text-${statusConfig.color} rounded-circle d-flex align-items-center justify-content-center me-3`}
                                style={{ width: "36px", height: "36px" }}
                              >
                                {device.type === "fingerprint" ? (
                                  <Fingerprint size={16} />
                                ) : device.type === "face" ? (
                                  <User size={16} />
                                ) : device.type === "iris" ? (
                                  <Eye size={16} />
                                ) : (
                                  <Fingerprint size={16} />
                                )}
                              </div>
                              <div>
                                <div className="fw-medium">{device.model}</div>
                                <small className="text-muted d-block">
                                  {device.vendor} • {device.ipAddress}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge bg-${statusConfig.color} bg-opacity-25 text-${statusConfig.color} border border-${statusConfig.color} border-opacity-25`}
                            >
                              {device.type}
                            </span>
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge bg-${statusConfig.color} ${
                                device.status === "Syncing"
                                  ? "progress-bar-striped progress-bar-animated"
                                  : ""
                              }`}
                            >
                              {statusConfig.icon} {device.status}
                            </span>
                          </td>
                          <td className="text-center">
                            <small className="text-muted">
                              {new Date(device.lastSync).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </small>
                          </td>
                          <td className="text-center">
                            <div className="d-flex gap-2 justify-content-center">
                             
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                  const newStatus =
                                    device.status === "Online"
                                      ? "Offline"
                                      : "Online";
                                  dispatch({
                                    type: "UPDATE_DEVICE",
                                    payload: { ...device, status: newStatus },
                                  });
                                }}
                                title="Toggle Status"
                              >
                                {device.status === "Online" ? (
                                  <WifiOff size={12} />
                                ) : (
                                  <Wifi size={12} />
                                )}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Remove ${device.vendor} ${device.model}?`
                                    )
                                  ) {
                                    dispatch({
                                      type: "SET_DEVICES",
                                      payload: biometricDevices.filter(
                                        (d) => d.id !== device.id
                                      ),
                                    });
                                  }
                                }}
                                title="Remove Device"
                              >
                                <Trash2 size={12} />
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

        {/* Device-wise Attendance Reports */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 d-flex align-items-center">
                <BarChart3 size={20} className="me-2 text-primary" />
                Device-wise Reports
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  const reports = getDeviceWiseReports();
                  if (reports.length === 0) {
                    alert("No device attendance data available");
                    return;
                  }
                  
                  let reportText = "Device-wise Attendance Reports\n";
                  reportText += "=".repeat(50) + "\n\n";
                  
                  reports.forEach((report, index) => {
                    reportText += `${index + 1}. ${report.deviceName} (${report.vendor})\n`;
                    reportText += `   Total Punches: ${report.totalPunches}\n`;
                    reportText += `   Check-ins: ${report.checkIns}\n`;
                    reportText += `   Check-outs: ${report.checkOuts}\n`;
                    reportText += `   Employees: ${report.employeeCount}\n`;
                    reportText += `   Date Range: ${report.dateRange.start} to ${report.dateRange.end}\n\n`;
                  });
                  
                  alert(reportText);
                }}
              >
               <span className="d-inline-flex align-items-center">
  <Download size={14} className="me-1" />
  Generate Report
</span>

              </button>
            </div>
          </div>
          <div className="card-body">
            {biometricDevices.length === 0 ? (
              <div className="text-center py-3">
                <p className="text-muted small mb-0">
                  No devices configured. Add devices to view reports.
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {biometricDevices.map((device) => {
                  const deviceReports = getDeviceWiseReports(device.id);
                  const report = deviceReports[0] || {
                    totalPunches: 0,
                    checkIns: 0,
                    checkOuts: 0,
                    employeeCount: 0,
                  };
                  
                  return (
                    <div key={device.id} className="col-12">
                      <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1">{device.model}</h6>
                            <small className="text-muted d-block">
                              {device.vendor} • {device.ipAddress}
                            </small>
                          </div>
                          <span className={`badge bg-${device.health >= 80 ? 'success' : device.health >= 60 ? 'warning' : 'danger'}`}>
                            {device.health}%
                          </span>
                        </div>
                        <div className="row g-2 mt-2">
                          <div className="col-6">
                            <div className="text-center p-2 bg-light rounded">
                              <div className="fw-bold text-primary">{report.totalPunches}</div>
                              <small className="text-muted">Total Punches</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-2 bg-light rounded">
                              <div className="fw-bold text-success">{report.checkIns}</div>
                              <small className="text-muted">Check-ins</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-2 bg-light rounded">
                              <div className="fw-bold text-info">{report.checkOuts}</div>
                              <small className="text-muted">Check-outs</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center p-2 bg-light rounded">
                              <div className="fw-bold text-warning">{report.employeeCount}</div>
                              <small className="text-muted">Employees</small>
                            </div>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary w-100 mt-2"
                          onClick={() => {
                            const deviceReport = getDeviceWiseReports(device.id);
                            if (deviceReport.length > 0) {
                              const report = deviceReport[0];
                              const csv = [
                                ["Employee ID", "Employee Name", "Timestamp", "Type", "Method"],
                                ...report.punches.map(p => [
                                  p.employeeId,
                                  p.employeeName,
                                  new Date(p.timestamp).toLocaleString(),
                                  p.type,
                                  p.method
                                ])
                              ].map(row => row.join(",")).join("\n");
                              
                              const blob = new Blob([csv], { type: "text/csv" });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `${device.model.replace(/\s+/g, '_')}_attendance_${new Date().toISOString().split('T')[0]}.csv`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              window.URL.revokeObjectURL(url);
                            } else {
                              alert(`No attendance data available for ${device.model}`);
                            }
                          }}
                        >
                        <span className="d-inline-flex align-items-center">
  <Download size={14} className="me-1" />
  Export Device Report
</span>

                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Syncing Activity */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 d-flex align-items-center">
              <FileText size={20} className="me-2 text-primary" />
              Recent Syncing Activity
              <span className="badge bg-info ms-2">
                {syncLogs.filter((l) => l.type === "biometric").length} logs
              </span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table table-sm align-middle mb-0">
                <thead className="sticky-top bg-white" style={{ top: "-1px" }}>
                  <tr>
                    <th className="small text-muted">Time</th>
                    <th className="small text-muted">Device</th>
                    <th className="small text-muted">Type</th>
                    <th className="small text-muted text-center">Status</th>
                    <th className="small text-muted text-center">Records</th>
                  </tr>
                </thead>
                <tbody>
                  {syncLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-3">
                        <small className="text-muted">
                          No sync activity yet
                        </small>
                      </td>
                    </tr>
                  ) : (
                    syncLogs
                      .filter(
                        (log) =>
                          log.type === "biometric" ||
                          log.type === "biometric_punch"
                      )
                      .sort(
                        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                      )
                      .slice(0, 10)
                      .map((log) => (
                        <tr
                          key={log.id}
                          className={
                            log.status === "Failed" ? "table-danger" : ""
                          }
                        >
                          <td className="small">
                            {new Date(log.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="small">
                            {log.deviceId
                              ? biometricDevices.find(
                                  (d) => d.id === log.deviceId
                                )?.model || "Device"
                              : "System"}
                          </td>
                          <td className="small">
                            {log.type === "biometric_punch"
                              ? "Punch"
                              : "Data Sync"}
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge bg-${
                                log.status === "Success" ? "success" : "danger"
                              } bg-opacity-25 text-${
                                log.status === "Success" ? "success" : "danger"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="text-center small">
                            {log.records || "N/A"}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer bg-white border-0">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing{" "}
                {Math.min(
                  10,
                  syncLogs.filter(
                    (l) =>
                      l.type === "biometric" || l.type === "biometric_punch"
                  ).length
                )}{" "}
                recent logs
              </small>
              <button
                className="btn btn-sm btn-link"
                onClick={() => {
                  const biometricLogs = syncLogs.filter(
                    (l) =>
                      l.type === "biometric" || l.type === "biometric_punch"
                  );
                  const csv = [
                    [
                      "Timestamp",
                      "Device",
                      "Type",
                      "Status",
                      "Records",
                      "Message",
                    ],
                    ...biometricLogs.map((log) => [
                      new Date(log.timestamp).toLocaleString(),
                      biometricDevices.find((d) => d.id === log.deviceId)
                        ?.model || "System",
                      log.type,
                      log.status,
                      log.records || "0",
                      log.message || "",
                    ]),
                  ]
                    .map((row) => row.join(","))
                    .join("\n");

                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `biometric_sync_logs_${
                    new Date().toISOString().split("T")[0]
                  }.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
              >
                <span className="d-inline-flex align-items-center">
  <Download size={14} className="me-1" />
  Export Logs
</span>

              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGPSTab = () => {
    // Add safety check for gpsState
    const safeGpsState = gpsState || {
      isCapturing: false,
      isCheckingIn: false,
      isCheckingOut: false,
      address: "",
      spoofingDetected: false,
      spoofingDetails: "",
      error: "",
    };

    // Ensure other states have default values
    const safeUserLocation = userLocation || null;
    const safeCurrentGeoFence = currentGeoFence || null;
    const safeSelfieImage = selfieImage || null;
    const safeSelectedEmployee = selectedEmployee || "";
    const safeNewLocation = newLocation || {
      name: "",
      radius: "100",
      address: "",
    };
    const safeGpsOfflineQueue = gpsOfflineQueue || [];
    const safeIsOnline = isOnline || navigator.onLine;

    // LocalStorage keys
    const LS_KEYS = {
      GPS_ATTENDANCE: "gps_attendance_records",
      GPS_OFFLINE_QUEUE: "gps_offline_queue",
      GEO_FENCES: "geo_fence_locations",
      GPS_SETTINGS: "gps_settings",
      LOCATION_HISTORY: "gps_location_history",
      SELFIE_HISTORY: "gps_selfie_history",
      SPOOFING_ATTEMPTS: "gps_spoofing_attempts",
      ADDRESS_CACHE: "gps_address_cache",
      DAILY_CHECKINS: "daily_checkins_tracker",
      EMPLOYEE_SESSIONS: "employee_active_sessions",
    };

    // Define localStorage helper functions
    const saveToLocalStorage = (key, data) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    };

    const loadFromLocalStorage = (key, defaultValue) => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        return defaultValue;
      }
    };

    // Initialize LocalStorage if empty (called on demand)
    const initializeLocalStorage = () => {
      try {
        // Initialize GPS attendance records if not exists
        if (!localStorage.getItem(LS_KEYS.GPS_ATTENDANCE)) {
          localStorage.setItem(LS_KEYS.GPS_ATTENDANCE, JSON.stringify([]));
        }

        // Initialize offline queue if not exists
        if (!localStorage.getItem(LS_KEYS.GPS_OFFLINE_QUEUE)) {
          localStorage.setItem(LS_KEYS.GPS_OFFLINE_QUEUE, JSON.stringify([]));
        }

        // Initialize geo-fences if not exists
        if (!localStorage.getItem(LS_KEYS.GEO_FENCES)) {
          localStorage.setItem(LS_KEYS.GEO_FENCES, JSON.stringify([]));
        }

        // Initialize GPS settings if not exists
        if (!localStorage.getItem(LS_KEYS.GPS_SETTINGS)) {
          const defaultSettings = {
            geoFencing: true,
            requireSelfie: false,
            spoofingDetection: true,
            enableOffline: true,
            defaultRadius: 100,
            highAccuracy: true,
            autoSync: true,
            vibrationFeedback: true,
            workingHours: 8,
            gracePeriod: 15,
            autoCheckout: false,
            checkinReminder: true,
            overtimeTracking: true,
          };
          localStorage.setItem(
            LS_KEYS.GPS_SETTINGS,
            JSON.stringify(defaultSettings)
          );
        }

        // Initialize other storages if not exists
        if (!localStorage.getItem(LS_KEYS.LOCATION_HISTORY)) {
          localStorage.setItem(LS_KEYS.LOCATION_HISTORY, JSON.stringify([]));
        }

        if (!localStorage.getItem(LS_KEYS.SELFIE_HISTORY)) {
          localStorage.setItem(LS_KEYS.SELFIE_HISTORY, JSON.stringify([]));
        }

        if (!localStorage.getItem(LS_KEYS.SPOOFING_ATTEMPTS)) {
          localStorage.setItem(LS_KEYS.SPOOFING_ATTEMPTS, JSON.stringify([]));
        }

        if (!localStorage.getItem(LS_KEYS.ADDRESS_CACHE)) {
          localStorage.setItem(LS_KEYS.ADDRESS_CACHE, JSON.stringify({}));
        }

        if (!localStorage.getItem(LS_KEYS.DAILY_CHECKINS)) {
          localStorage.setItem(LS_KEYS.DAILY_CHECKINS, JSON.stringify({}));
        }

        if (!localStorage.getItem(LS_KEYS.EMPLOYEE_SESSIONS)) {
          localStorage.setItem(LS_KEYS.EMPLOYEE_SESSIONS, JSON.stringify({}));
        }

        return true;
      } catch (error) {
        console.error("Error initializing localStorage:", error);
        return false;
      }
    };

    // Check if employee has already checked in today
    const getEmployeeCheckinStatus = (employeeId) => {
      const dailyCheckins = loadFromLocalStorage(LS_KEYS.DAILY_CHECKINS, {});
      const today = new Date().toISOString().split("T")[0];

      if (dailyCheckins[today] && dailyCheckins[today][employeeId]) {
        return dailyCheckins[today][employeeId];
      }

      return null;
    };

    // Calculate work hours between checkin and checkout
    const calculateWorkHours = (checkinTime, checkoutTime) => {
      if (!checkinTime || !checkoutTime) return 0;

      const checkin = new Date(checkinTime);
      const checkout = new Date(checkoutTime);
      const diffMs = checkout - checkin;
      const diffHours = diffMs / (1000 * 60 * 60);

      return diffHours.toFixed(2);
    };

    // Check if checkin is within grace period
    const isWithinGracePeriod = (checkinTime, scheduledTime = "09:00") => {
      const [scheduledHour, scheduledMinute] = scheduledTime
        .split(":")
        .map(Number);
      const scheduledDate = new Date();
      scheduledDate.setHours(scheduledHour, scheduledMinute, 0, 0);

      const checkinDate = new Date(checkinTime);
      const diffMinutes = (checkinDate - scheduledDate) / (1000 * 60);

      const gracePeriod = state.settings.gracePeriod || 15;
      return diffMinutes <= gracePeriod;
    };

    // Calculate overtime hours
    const calculateOvertime = (workHours) => {
      const standardHours = state.settings.workingHours || 8;
      const overtime = parseFloat(workHours) - standardHours;
      return overtime > 0 ? overtime.toFixed(2) : 0;
    };

    // Enhanced getCurrentLocation with localStorage
    const enhancedGetCurrentLocation = async () => {
      // Ensure LocalStorage is initialized
      initializeLocalStorage();

      // Update gpsState for capturing
      if (setGpsState && typeof setGpsState === "function") {
        setGpsState((prev) => ({ ...prev, isCapturing: true }));
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });

        const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: new Date().toISOString(),
          deviceTime: new Date().getTime(),
        };

        // Save location to history in localStorage
        const locationHistory = loadFromLocalStorage(
          LS_KEYS.LOCATION_HISTORY,
          []
        );
        locationHistory.unshift({
          ...locationData,
          id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          capturedAt: new Date().toISOString(),
          purpose: "attendance",
          employeeId: safeSelectedEmployee,
        });

        // Keep only last 100 locations
        if (locationHistory.length > 100) {
          locationHistory.pop();
        }

        saveToLocalStorage(LS_KEYS.LOCATION_HISTORY, locationHistory);

        // Get address
        let address = "Address not available";
        const cachedAddress = loadFromLocalStorage(LS_KEYS.ADDRESS_CACHE, {});
        const addressKey = `${locationData.lat.toFixed(
          6
        )},${locationData.lng.toFixed(6)}`;

        if (cachedAddress[addressKey]) {
          address = cachedAddress[addressKey] + " (cached)";
        } else if (safeIsOnline) {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationData.lat}&lon=${locationData.lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            address = data.display_name || "Address not found";

            // Cache address
            cachedAddress[addressKey] = address;
            saveToLocalStorage(LS_KEYS.ADDRESS_CACHE, cachedAddress);
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        }

        // Check for spoofing
        let spoofingDetected = false;
        let spoofingDetails = "";
        if (state.settings.spoofingDetection) {
          const spoofingCheck = detectSpoofing(position, locationData);
          if (spoofingCheck.isSpoofed) {
            spoofingDetected = true;
            spoofingDetails = spoofingCheck.details;

            // Save spoofing attempt
            const spoofingAttempts = loadFromLocalStorage(
              LS_KEYS.SPOOFING_ATTEMPTS,
              []
            );
            spoofingAttempts.unshift({
              ...locationData,
              address,
              detectedAt: new Date().toISOString(),
              checks: spoofingCheck.checks,
              employeeId: safeSelectedEmployee,
              confidence: spoofingCheck.confidence,
            });
            saveToLocalStorage(LS_KEYS.SPOOFING_ATTEMPTS, spoofingAttempts);
          }
        }

        // Check geo-fencing
        let geoFenceResult = null;
        if (state.settings.geoFencing) {
          const geoFences = loadFromLocalStorage(LS_KEYS.GEO_FENCES, []);
          if (geoFences.length > 0) {
            geoFenceResult = checkGeoFence(
              locationData.lat,
              locationData.lng,
              geoFences
            );
            if (
              setCurrentGeoFence &&
              typeof setCurrentGeoFence === "function"
            ) {
              setCurrentGeoFence(geoFenceResult);
            }
          }
        }

        if (setUserLocation && typeof setUserLocation === "function") {
          setUserLocation(locationData);
        }

        if (setGpsState && typeof setGpsState === "function") {
          setGpsState({
            isCapturing: false,
            isCheckingIn: false,
            isCheckingOut: false,
            address,
            spoofingDetected,
            spoofingDetails,
            error: "",
          });
        }
      } catch (error) {
        console.error("Error getting location:", error);
        if (setGpsState && typeof setGpsState === "function") {
          setGpsState((prev) => ({
            ...prev,
            isCapturing: false,
            error: error.message,
          }));
        }
      }
    };

    // Enhanced markGPSAttendance with localStorage
    const enhancedMarkGPSAttendance = async (type) => {
      // Ensure LocalStorage is initialized
      initializeLocalStorage();

      if (!safeUserLocation) {
        alert("Please capture location first");
        return;
      }

      if (
        state.settings.geoFencing &&
        safeCurrentGeoFence &&
        !safeCurrentGeoFence.withinFence
      ) {
        alert(
          `You are outside the allowed zone. Distance: ${safeCurrentGeoFence.distance}m`
        );
        return;
      }

      if (safeGpsState.spoofingDetected && state.settings.spoofingDetection) {
        alert("Location spoofing detected! Attendance not allowed.");
        return;
      }

      // Set loading state
      if (setGpsState && typeof setGpsState === "function") {
        setGpsState((prev) => ({
          ...prev,
          [type === "checkin" ? "isCheckingIn" : "isCheckingOut"]: true,
        }));
      }

      const employee = state.employees.find(
        (emp) => emp.id === safeSelectedEmployee
      );
      if (!employee) {
        alert("Please select an employee");
        if (setGpsState && typeof setGpsState === "function") {
          setGpsState((prev) => ({
            ...prev,
            isCheckingIn: false,
            isCheckingOut: false,
          }));
        }
        return;
      }

      const now = new Date();
      const currentTime = now.toISOString();
      const today = now.toISOString().split("T")[0];
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Check if employee has already checked in today for checkout
      if (type === "checkout") {
        const dailyCheckins = loadFromLocalStorage(LS_KEYS.DAILY_CHECKINS, {});
        const todayCheckins = dailyCheckins[today] || {};
        const employeeCheckin = todayCheckins[safeSelectedEmployee];

        if (!employeeCheckin || !employeeCheckin.checkinTime) {
          alert("You need to check in first before checking out");
          if (setGpsState && typeof setGpsState === "function") {
            setGpsState((prev) => ({ ...prev, isCheckingOut: false }));
          }
          return;
        }
      }

      // Check if employee has already checked out today for checkin
      if (type === "checkin") {
        const dailyCheckins = loadFromLocalStorage(LS_KEYS.DAILY_CHECKINS, {});
        const todayCheckins = dailyCheckins[today] || {};
        const employeeCheckin = todayCheckins[safeSelectedEmployee];

        if (employeeCheckin && employeeCheckin.checkoutTime) {
          alert("You have already checked out today. Check-in not allowed.");
          if (setGpsState && typeof setGpsState === "function") {
            setGpsState((prev) => ({ ...prev, isCheckingIn: false }));
          }
          return;
        }
      }

      const attendanceRecord = {
        id: `gps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        employeeId: safeSelectedEmployee,
        employeeName: employee.name,
        employeeDepartment: employee.department,
        type: type,
        timestamp: currentTime,
        date: today,
        time: timeString,
        location: {
          lat: safeUserLocation.lat,
          lng: safeUserLocation.lng,
          accuracy: safeUserLocation.accuracy,
          address: safeGpsState.address,
          timestamp: safeUserLocation.timestamp,
        },
        selfieImage: state.settings.requireSelfie ? safeSelfieImage : null,
        geoFenceStatus: safeCurrentGeoFence,
        spoofingDetected: safeGpsState.spoofingDetected,
        spoofingDetails: safeGpsState.spoofingDetails,
        method: "gps",
        syncStatus: safeIsOnline ? "synced" : "pending",
        syncedAt: safeIsOnline ? currentTime : null,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          online: safeIsOnline,
        },
      };

      // For checkin, set checkIn time
      if (type === "checkin") {
        attendanceRecord.checkIn = currentTime;
        attendanceRecord.checkInTime = timeString;
        attendanceRecord.lateCheckin = !isWithinGracePeriod(currentTime);

        // Update daily checkins
        const dailyCheckins = loadFromLocalStorage(LS_KEYS.DAILY_CHECKINS, {});
        if (!dailyCheckins[today]) dailyCheckins[today] = {};
        dailyCheckins[today][safeSelectedEmployee] = {
          checkinTime: currentTime,
          checkinLocation: attendanceRecord.location,
          checkinSelfie: attendanceRecord.selfieImage,
        };
        saveToLocalStorage(LS_KEYS.DAILY_CHECKINS, dailyCheckins);

        // Update active sessions
        const activeSessions = loadFromLocalStorage(
          LS_KEYS.EMPLOYEE_SESSIONS,
          {}
        );
        activeSessions[safeSelectedEmployee] = {
          checkinTime: currentTime,
          checkinLocation: attendanceRecord.location,
          employeeName: employee.name,
        };
        saveToLocalStorage(LS_KEYS.EMPLOYEE_SESSIONS, activeSessions);
      }

      // For checkout, set checkOut time and calculate work hours
      if (type === "checkout") {
        const dailyCheckins = loadFromLocalStorage(LS_KEYS.DAILY_CHECKINS, {});
        const todayCheckins = dailyCheckins[today] || {};
        const employeeCheckin = todayCheckins[safeSelectedEmployee];

        if (employeeCheckin && employeeCheckin.checkinTime) {
          const workHours = calculateWorkHours(
            employeeCheckin.checkinTime,
            currentTime
          );
          const overtime = calculateOvertime(workHours);

          attendanceRecord.checkOut = currentTime;
          attendanceRecord.checkOutTime = timeString;
          attendanceRecord.checkIn = employeeCheckin.checkinTime;
          attendanceRecord.checkInTime = new Date(
            employeeCheckin.checkinTime
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          attendanceRecord.workHours = workHours;
          attendanceRecord.overtime = overtime;
          attendanceRecord.lateCheckin = !isWithinGracePeriod(
            employeeCheckin.checkinTime
          );

          // Update daily checkins with checkout info
          dailyCheckins[today][safeSelectedEmployee].checkoutTime = currentTime;
          dailyCheckins[today][safeSelectedEmployee].workHours = workHours;
          dailyCheckins[today][safeSelectedEmployee].overtime = overtime;
          saveToLocalStorage(LS_KEYS.DAILY_CHECKINS, dailyCheckins);

          // Remove from active sessions
          const activeSessions = loadFromLocalStorage(
            LS_KEYS.EMPLOYEE_SESSIONS,
            {}
          );
          delete activeSessions[safeSelectedEmployee];
          saveToLocalStorage(LS_KEYS.EMPLOYEE_SESSIONS, activeSessions);
        }
      }

      if (safeIsOnline) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add to attendance records in state
        if (dispatch && typeof dispatch === "function") {
          dispatch({ type: "ADD_ATTENDANCE", payload: attendanceRecord });
        }

        // Save to localStorage GPS records
        const gpsAttendanceRecords = loadFromLocalStorage(
          LS_KEYS.GPS_ATTENDANCE,
          []
        );
        gpsAttendanceRecords.unshift(attendanceRecord);
        saveToLocalStorage(LS_KEYS.GPS_ATTENDANCE, gpsAttendanceRecords);

        // Also save to main attendance list localStorage
        const mainAttendanceRecords = loadFromLocalStorage(
          "attendanceRecords",
          []
        );
        mainAttendanceRecords.unshift(attendanceRecord);
        saveToLocalStorage("attendanceRecords", mainAttendanceRecords);

        alert(
          `${
            type === "checkin" ? "Check-in" : "Check-out"
          } successful at ${timeString}!`
        );
      } else {
        // Save to offline queue
        const offlineQueue = loadFromLocalStorage(
          LS_KEYS.GPS_OFFLINE_QUEUE,
          []
        );
        offlineQueue.unshift(attendanceRecord);
        saveToLocalStorage(LS_KEYS.GPS_OFFLINE_QUEUE, offlineQueue);

        // Update state
        if (setGpsOfflineQueue && typeof setGpsOfflineQueue === "function") {
          setGpsOfflineQueue(offlineQueue);
        }

        alert(
          `${
            type === "checkin" ? "Check-in" : "Check-out"
          } saved offline at ${timeString}!`
        );
      }

      // Reset states
      if (setGpsState && typeof setGpsState === "function") {
        setGpsState((prev) => ({
          ...prev,
          isCheckingIn: false,
          isCheckingOut: false,
        }));
      }

      if (
        state.settings.requireSelfie &&
        setSelfieImage &&
        typeof setSelfieImage === "function"
      ) {
        setSelfieImage(null);
      }
    };

    // Enhanced syncGPSOfflineData
    const enhancedSyncGPSOfflineData = async () => {
      if (!safeIsOnline) {
        alert("You are offline. Cannot sync.");
        return;
      }

      const offlineQueue = loadFromLocalStorage(LS_KEYS.GPS_OFFLINE_QUEUE, []);
      if (offlineQueue.length === 0) {
        alert("No offline records to sync");
        return;
      }

      try {
        // Load current attendance records
        const mainRecords = loadFromLocalStorage("attendanceRecords", []);
        const gpsRecords = loadFromLocalStorage(LS_KEYS.GPS_ATTENDANCE, []);

        for (const record of [...offlineQueue]) {
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Update record
          record.syncStatus = "synced";
          record.syncedAt = new Date().toISOString();

          // Add to state
          if (dispatch && typeof dispatch === "function") {
            dispatch({ type: "ADD_ATTENDANCE", payload: record });
          }

          // Add to both localStorage collections
          gpsRecords.unshift(record);
          mainRecords.unshift(record);
        }

        // Save updated records to localStorage
        saveToLocalStorage(LS_KEYS.GPS_ATTENDANCE, gpsRecords);
        saveToLocalStorage("attendanceRecords", mainRecords);

        // Clear offline queue
        if (setGpsOfflineQueue && typeof setGpsOfflineQueue === "function") {
          setGpsOfflineQueue([]);
        }
        saveToLocalStorage(LS_KEYS.GPS_OFFLINE_QUEUE, []);

        alert(`Successfully synced ${offlineQueue.length} record(s)`);
      } catch (error) {
        alert("Failed to sync offline data. Please try again.");
      }
    };

    // Enhanced addGeoLocation with localStorage
    const enhancedAddGeoLocation = () => {
      // Ensure LocalStorage is initialized
      initializeLocalStorage();

      if (!safeUserLocation) {
        alert("Please capture location first");
        return;
      }

      const newGeoFence = {
        id: `geo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name:
          safeNewLocation.name || `Location ${state.geoLocations.length + 1}`,
        lat: safeUserLocation.lat,
        lng: safeUserLocation.lng,
        radius: parseInt(safeNewLocation.radius) || 100,
        address:
          safeNewLocation.address || safeGpsState.address || "Unknown address",
        createdAt: new Date().toISOString(),
        createdBy: safeSelectedEmployee || "admin",
        active: true,
        color: "#3B82F6", // Default blue color
        icon: "map-pin",
      };

      // Add to state
      if (dispatch && typeof dispatch === "function") {
        dispatch({ type: "ADD_LOCATION", payload: newGeoFence });
      }

      // Save to localStorage
      const geoLocations = loadFromLocalStorage(LS_KEYS.GEO_FENCES, []);
      geoLocations.unshift(newGeoFence);
      saveToLocalStorage(LS_KEYS.GEO_FENCES, geoLocations);

      // Reset form
      if (setNewLocation && typeof setNewLocation === "function") {
        setNewLocation({ name: "", radius: "100", address: "" });
      }

      alert("Geo-fence location added successfully!");
    };

    // Enhanced capture selfie with localStorage
    const enhancedCaptureSelfie = () => {
      if (!safeUserLocation) {
        alert("Please capture location first");
        return;
      }
      if (setShowCamera && typeof setShowCamera === "function") {
        setShowCamera(true);
      }
    };

    const enhancedHandleSelfieCapture = () => {
      // Generate a placeholder selfie
      const fakeSelfie = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <rect width="200" height="200" fill="#4a90e2"/>
        <circle cx="100" cy="80" r="30" fill="#fff"/>
        <circle cx="85" cy="75" r="5" fill="#000"/>
        <circle cx="115" cy="75" r="5" fill="#000"/>
        <path d="M80 110 Q100 130 120 110" stroke="#000" fill="transparent" stroke-width="3"/>
        <text x="100" y="180" text-anchor="middle" fill="white" font-size="12">${new Date().toLocaleTimeString()}</text>
      </svg>
    `)}`;

      if (setSelfieImage && typeof setSelfieImage === "function") {
        setSelfieImage(fakeSelfie);
      }

      if (setShowCamera && typeof setShowCamera === "function") {
        setShowCamera(false);
      }

      // Save selfie to localStorage
      const selfieHistory = loadFromLocalStorage(LS_KEYS.SELFIE_HISTORY, []);
      selfieHistory.unshift({
        id: `selfie_${Date.now()}`,
        image: fakeSelfie,
        timestamp: new Date().toISOString(),
        location: safeUserLocation,
        employeeId: safeSelectedEmployee,
        employeeName:
          state.employees.find((e) => e.id === safeSelectedEmployee)?.name ||
          "Unknown",
      });

      // Keep only last 20 selfies
      if (selfieHistory.length > 20) selfieHistory.pop();
      saveToLocalStorage(LS_KEYS.SELFIE_HISTORY, selfieHistory);

      alert("Selfie captured successfully!");
    };

    // Helper function for spoofing detection
    const detectSpoofing = (position, locationData) => {
      const checks = [];
      let confidence = 0;
      let isSpoofed = false;

      // Check 1: Accuracy too high (less than 1 meter is suspicious)
      if (position.coords.accuracy < 1) {
        checks.push("Suspiciously high accuracy (<1m)");
        confidence += 20;
      }

      // Check 2: Impossible speed (>300 m/s = 1080 km/h)
      if (position.coords.speed && position.coords.speed > 300) {
        checks.push("Impossible speed detected");
        confidence += 50;
        isSpoofed = true;
      }

      // Check 3: Check location history for impossible jumps
      const locationHistory = loadFromLocalStorage(
        LS_KEYS.LOCATION_HISTORY,
        []
      );
      if (locationHistory.length > 0) {
        const lastLocation = locationHistory[0];
        const timeDiff =
          (new Date(locationData.timestamp).getTime() -
            new Date(lastLocation.timestamp).getTime()) /
          1000;
        const distance = calculateDistance(
          locationData.lat,
          locationData.lng,
          lastLocation.lat,
          lastLocation.lng
        );

        // If moved more than 50km in less than 60 seconds
        if (timeDiff < 60 && distance > 50000) {
          checks.push("Impossible location change");
          confidence += 70;
          isSpoofed = true;
        }
      }

      // Check 4: Common mock location patterns
      if (locationData.lat === 0 && locationData.lng === 0) {
        checks.push("Null Island coordinates (0,0)");
        confidence += 30;
        isSpoofed = true;
      }

      // Check 5: Unusual altitude accuracy
      if (
        position.coords.altitudeAccuracy &&
        position.coords.altitudeAccuracy > 10000
      ) {
        checks.push("Poor altitude accuracy");
        confidence += 15;
      }

      return {
        isSpoofed: isSpoofed || confidence > 60,
        confidence,
        checks,
        details: `Security score: ${100 - confidence}/100${
          checks.length ? ` (${checks.join(", ")})` : ""
        }`,
      };
    };

    // Calculate distance between two coordinates
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c * 1000; // Distance in meters
    };

    // Check geo-fence
    const checkGeoFence = (lat, lng, geoFences) => {
      let matchedLocation = null;
      let minDistance = Infinity;
      let withinAnyFence = false;

      geoFences.forEach((fence) => {
        const distance = calculateDistance(lat, lng, fence.lat, fence.lng);

        if (distance <= fence.radius) {
          withinAnyFence = true;
          if (distance < minDistance) {
            minDistance = distance;
            matchedLocation = fence;
          }
        }
      });

      return {
        withinFence: withinAnyFence,
        distance: minDistance !== Infinity ? Math.round(minDistance) : null,
        matchedLocation,
      };
    };

    // Handle setting updates
    const handleSettingUpdate = (key, value) => {
      // Ensure LocalStorage is initialized
      initializeLocalStorage();

      // Update in state
      if (dispatch && typeof dispatch === "function") {
        dispatch({ type: "UPDATE_SETTING", payload: { [key]: value } });
      }

      // Update in localStorage
      const currentSettings = loadFromLocalStorage(LS_KEYS.GPS_SETTINGS, {});
      currentSettings[key] = value;
      saveToLocalStorage(LS_KEYS.GPS_SETTINGS, currentSettings);
    };

    // Get employee's current session status
    const getEmployeeSessionStatus = () => {
      if (!safeSelectedEmployee) return null;

      const activeSessions = loadFromLocalStorage(
        LS_KEYS.EMPLOYEE_SESSIONS,
        {}
      );
      const employeeSession = activeSessions[safeSelectedEmployee];

      if (employeeSession) {
        const checkinTime = new Date(employeeSession.checkinTime);
        const now = new Date();
        const hoursWorked = ((now - checkinTime) / (1000 * 60 * 60)).toFixed(2);

        return {
          isCheckedIn: true,
          checkinTime: checkinTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          hoursWorked: hoursWorked,
          location: employeeSession.checkinLocation,
        };
      }

      return { isCheckedIn: false };
    };

    // Load GPS statistics with time tracking
    const getGPSStatistics = () => {
      initializeLocalStorage();

      const gpsRecords = loadFromLocalStorage(LS_KEYS.GPS_ATTENDANCE, []);
      const today = new Date().toISOString().split("T")[0];

      const todayCount = gpsRecords.filter((r) => r.date === today).length;
      const weekCount = gpsRecords.filter((r) => {
        const recordDate = new Date(r.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return recordDate >= weekAgo;
      }).length;

      const offlineQueue = loadFromLocalStorage(LS_KEYS.GPS_OFFLINE_QUEUE, []);
      const geoFences = loadFromLocalStorage(LS_KEYS.GEO_FENCES, []);

      // Calculate average work hours for today
      const todayRecords = gpsRecords.filter(
        (r) => r.date === today && r.workHours
      );
      const totalWorkHours = todayRecords.reduce(
        (sum, record) => sum + parseFloat(record.workHours || 0),
        0
      );
      const avgWorkHours =
        todayRecords.length > 0
          ? (totalWorkHours / todayRecords.length).toFixed(2)
          : 0;

      return {
        today: todayCount,
        thisWeek: weekCount,
        pending: offlineQueue.length,
        locations: geoFences.length,
        avgWorkHours: avgWorkHours,
      };
    };

    const gpsStats = getGPSStatistics();
    const employeeSession = getEmployeeSessionStatus();

    return (
      <div className="row">
        {/* Selfie Camera Modal */}
        {showCamera && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.9)", zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Capture Selfie</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCamera(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <div
                    className="camera-preview bg-dark rounded mb-3"
                    style={{ height: "300px" }}
                  >
                    <div className="h-100 d-flex align-items-center justify-content-center">
                      <div className="text-center">
                        <Camera size={48} className="text-white mb-3" />
                        <p className="text-white">Camera Preview</p>
                        <small className="text-white-50">
                          Position face in frame
                        </small>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={enhancedHandleSelfieCapture}
                  >
                    <Camera size={16} className="me-2" />
                    Capture Selfie
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="col-12 col-md-6">
          <h6>GPS-Based Mobile Attendance</h6>

          {/* Current Time Display */}
          <div className="card border shadow-none mb-3">
            <div className="card-body py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <Clock size={20} className="text-primary me-2" />
                    <div>
                      <div className="small text-muted">Current Time</div>
                      <div className="h5 mb-0">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <Calendar size={20} className="text-success me-2" />
                    <div>
                      <div className="small text-muted">Today's Date</div>
                      <div className="h6 mb-0">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Session Status */}
          {employeeSession && safeSelectedEmployee && (
            <div className="card border shadow-none mb-3">
              <div className="card-body py-3">
                <h6 className="mb-3">Current Session Status</h6>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div
                        className={`rounded-circle ${
                          employeeSession.isCheckedIn
                            ? "bg-success"
                            : "bg-secondary"
                        } p-2 me-3`}
                      >
                        {employeeSession.isCheckedIn ? (
                          <CheckCircle size={20} className="text-white" />
                        ) : (
                          <Clock size={20} className="text-white" />
                        )}
                      </div>
                      <div>
                        <div className="small text-muted">Status</div>
                        <div className="h6 mb-0">
                          {employeeSession.isCheckedIn
                            ? "Checked In"
                            : "Not Checked In"}
                        </div>
                      </div>
                    </div>
                  </div>
                  {employeeSession.isCheckedIn && (
                    <>
                      <div className="col-md-6 mb-2">
                        <div className="small text-muted">Check-in Time</div>
                        <div className="h6 mb-0 text-success">
                          {employeeSession.checkinTime}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="small text-muted">Hours Worked</div>
                        <div className="h6 mb-0 text-primary">
                          {employeeSession.hoursWorked} hrs
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Toggles */}
          <div className="card border shadow-none mb-3">
            <div className="card-body py-3">
              <h6 className="mb-3">Time & Attendance Settings</h6>
              <div className="row">
                <div className="col-md-4 mb-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={state.settings.geoFencing || false}
                      onChange={(e) =>
                        handleSettingUpdate("geoFencing", e.target.checked)
                      }
                    />
                    <label className="form-check-label small">
                      Geo-fencing
                    </label>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={state.settings.requireSelfie || false}
                      onChange={(e) =>
                        handleSettingUpdate("requireSelfie", e.target.checked)
                      }
                    />
                    <label className="form-check-label small">
                      Require Selfie
                    </label>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={state.settings.spoofingDetection || false}
                      onChange={(e) =>
                        handleSettingUpdate(
                          "spoofingDetection",
                          e.target.checked
                        )
                      }
                    />
                    <label className="form-check-label small">
                      Spoofing Detection
                    </label>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={state.settings.autoCheckout || false}
                      onChange={(e) =>
                        handleSettingUpdate("autoCheckout", e.target.checked)
                      }
                    />
                    <label className="form-check-label small">
                      Auto Checkout
                    </label>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={state.settings.overtimeTracking || true}
                      onChange={(e) =>
                        handleSettingUpdate(
                          "overtimeTracking",
                          e.target.checked
                        )
                      }
                    />
                    <label className="form-check-label small">
                      Overtime Tracking
                    </label>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={state.settings.checkinReminder || true}
                      onChange={(e) =>
                        handleSettingUpdate("checkinReminder", e.target.checked)
                      }
                    />
                    <label className="form-check-label small">
                      Check-in Reminder
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <div
                className={`alert ${
                  safeIsOnline ? "alert-success" : "alert-warning"
                } py-2 mb-0`}
              >
                <div className="d-flex align-items-center">
                  {safeIsOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                  <span className="ms-2 small">
                    {safeIsOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className={`alert ${
                  state.settings.geoFencing ? "alert-info" : "alert-secondary"
                } py-2 mb-0`}
              >
                <div className="d-flex align-items-center">
                  <MapPin size={14} />
                  <span className="ms-2 small">
                    {state.settings.geoFencing
                      ? "Geo-fence ON"
                      : "Geo-fence OFF"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Selection */}
          <div className="card border shadow-none mb-3">
            <div className="card-body py-3">
              <label className="form-label small mb-2">Select Employee</label>
              <select
                className="form-select form-select-sm"
                value={safeSelectedEmployee}
                onChange={(e) =>
                  setSelectedEmployee && setSelectedEmployee(e.target.value)
                }
              >
                <option value="">Select an employee</option>
                {state.employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card border shadow-none mb-4">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6 mb-2">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={enhancedGetCurrentLocation}
                    disabled={safeGpsState.isCapturing}
                  >
                    {safeGpsState.isCapturing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Capturing...
                      </>
                    ) : (
                      <>
                        <MapPin size={14} className="me-2" />
                        Capture Location
                      </>
                    )}
                  </button>
                </div>

                {/* Selfie Capture Button */}
                {state.settings.requireSelfie && (
                  <div className="col-md-6 mb-2">
                    <button
                      type="button"
                      className={`btn w-100 ${
                        safeSelfieImage ? "btn-success" : "btn-info"
                      }`}
                      onClick={enhancedCaptureSelfie}
                      disabled={!safeUserLocation}
                    >
                      <Camera size={14} className="me-2" />
                      {safeSelfieImage ? "Selfie Ready" : "Capture Selfie"}
                    </button>
                  </div>
                )}
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-2">
                  <button
                    type="button"
                    className={`btn w-100 ${
                      employeeSession?.isCheckedIn
                        ? "btn-secondary"
                        : "btn-success"
                    }`}
                    onClick={() => enhancedMarkGPSAttendance("checkin")}
                    disabled={
                      safeGpsState.isCheckingIn ||
                      !safeUserLocation ||
                      !safeSelectedEmployee ||
                      employeeSession?.isCheckedIn
                    }
                  >
                    {safeGpsState.isCheckingIn ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : employeeSession?.isCheckedIn ? (
                      <>
                        <CheckCircle size={14} className="me-2" />
                        Already Checked In
                      </>
                    ) : (
                      <>
                        <Smartphone size={14} className="me-2" />
                        GPS Check In
                      </>
                    )}
                  </button>
                  {employeeSession?.isCheckedIn && (
                    <small className="text-muted d-block mt-1">
                      Checked in at: {employeeSession.checkinTime}
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <button
                    type="button"
                    className={`btn w-100 ${
                      employeeSession?.isCheckedIn
                        ? "btn-warning"
                        : "btn-secondary"
                    }`}
                    onClick={() => enhancedMarkGPSAttendance("checkout")}
                    disabled={
                      safeGpsState.isCheckingOut ||
                      !safeUserLocation ||
                      !safeSelectedEmployee ||
                      !employeeSession?.isCheckedIn
                    }
                  >
                    {safeGpsState.isCheckingOut ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : employeeSession?.isCheckedIn ? (
                      <>
                        <LogOut size={14} className="me-2" />
                        GPS Check Out
                      </>
                    ) : (
                      <>
                        <Smartphone size={14} className="me-2" />
                        Check In First
                      </>
                    )}
                  </button>
                  {employeeSession?.isCheckedIn && (
                    <small className="text-muted d-block mt-1">
                      Current session: {employeeSession.hoursWorked} hrs
                    </small>
                  )}
                </div>
              </div>

              {/* Offline Sync Button */}
              {safeGpsOfflineQueue.length > 0 && (
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={enhancedSyncGPSOfflineData}
                    disabled={!safeIsOnline}
                  >
                    <RefreshCw size={14} className="me-2" />
                    Sync {safeGpsOfflineQueue.length} Offline Record
                    {safeGpsOfflineQueue.length !== 1 ? "s" : ""}
                  </button>
                </div>
              )}

              {safeUserLocation && (
                <div className="p-3 bg-light rounded">
                  <h6>Current Location Details</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Coordinates:</strong>
                        <br />
                        {safeUserLocation.lat.toFixed(6)},{" "}
                        {safeUserLocation.lng.toFixed(6)}
                      </p>
                      <p className="mb-1">
                        <strong>Accuracy:</strong>{" "}
                        {safeUserLocation.accuracy?.toFixed(2)} meters
                      </p>
                      <p className="mb-1">
                        <strong>Time:</strong>{" "}
                        {new Date(
                          safeUserLocation.timestamp
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1">
                        <strong>Address:</strong>
                        <br />
                        <span className="text-muted">
                          {safeGpsState.address || "Loading..."}
                        </span>
                      </p>
                      {safeCurrentGeoFence && (
                        <p className="mb-1">
                          <strong>Geo-fence Status:</strong>
                          <br />
                          {safeCurrentGeoFence.withinFence ? (
                            <span className="badge bg-success">
                              Within Zone ✓
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              Outside Zone ({safeCurrentGeoFence.distance}m)
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Spoofing Detection Alert */}
                  {safeGpsState.spoofingDetected && (
                    <div className="alert alert-danger mt-2 py-2">
                      <div className="d-flex align-items-center">
                        <AlertCircle size={16} className="me-2" />
                        <strong>Location Spoofing Detected!</strong>
                      </div>
                      <small className="d-block mt-1">
                        {safeGpsState.spoofingDetails}
                      </small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="card border shadow-none">
            <div className="card-body">
              <h6>Add Geo-fence Location</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Location Name"
                    value={safeNewLocation.name}
                    onChange={(e) =>
                      setNewLocation &&
                      setNewLocation({
                        ...safeNewLocation,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Radius (meters)"
                    min="10"
                    max="5000"
                    value={safeNewLocation.radius}
                    onChange={(e) =>
                      setNewLocation &&
                      setNewLocation({
                        ...safeNewLocation,
                        radius: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Address"
                    value={safeNewLocation.address}
                    onChange={(e) =>
                      setNewLocation &&
                      setNewLocation({
                        ...safeNewLocation,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-primary w-100 btn-sm"
                    onClick={enhancedAddGeoLocation}
                    disabled={!safeUserLocation}
                  >
                    <Plus size={14} className="me-2" />
                    Add Geo-fence at Current Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card border shadow-none mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Geo-fence Locations</h6>
                <span className="badge bg-info">
                  {state.geoLocations.length} zones
                </span>
              </div>
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Radius</th>
                      <th>Coordinates</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.geoLocations.map((location) => (
                      <tr key={location.id}>
                        <td>
                          <div>
                            <strong>{location.name}</strong>
                            <small className="d-block text-muted">
                              {location.address?.substring(0, 25)}...
                            </small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {location.radius}m
                          </span>
                        </td>
                        <td>
                          <small>
                            {location.lat?.toFixed(4)},{" "}
                            {location.lng?.toFixed(4)}
                          </small>
                        </td>
                        <td>
                          {safeCurrentGeoFence?.matchedLocation?.id ===
                          location.id ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-light text-dark">
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* GPS Statistics Card with Time Tracking */}
          <div className="card border shadow-none mb-4">
            <div className="card-body">
              <h6 className="mb-3">GPS Statistics</h6>
              <div className="row text-center">
                <div className="col-3 mb-3">
                  <div className="text-muted small mb-1">Today</div>
                  <div className="h5 mb-0 text-primary">{gpsStats.today}</div>
                  <small className="text-muted">check-ins</small>
                </div>
                <div className="col-3 mb-3">
                  <div className="text-muted small mb-1">This Week</div>
                  <div className="h5 mb-0 text-success">
                    {gpsStats.thisWeek}
                  </div>
                  <small className="text-muted">records</small>
                </div>
                <div className="col-3 mb-3">
                  <div className="text-muted small mb-1">Pending</div>
                  <div className="h5 mb-0 text-warning">{gpsStats.pending}</div>
                  <small className="text-muted">offline</small>
                </div>
                <div className="col-3 mb-3">
                  <div className="text-muted small mb-1">Avg Hours</div>
                  <div className="h5 mb-0 text-info">
                    {gpsStats.avgWorkHours}
                  </div>
                  <small className="text-muted">today</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card border shadow-none">
            <div className="card-body">
              <h6>Recent GPS Activity</h6>
              <div
                className="table-responsive"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const gpsRecords = loadFromLocalStorage(
                        LS_KEYS.GPS_ATTENDANCE,
                        []
                      );
                      return gpsRecords
                        .sort(
                          (a, b) =>
                            new Date(b.timestamp) - new Date(a.timestamp)
                        )
                        .slice(0, 5)
                        .map((record) => (
                          <tr key={record.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    fontSize: "10px",
                                  }}
                                >
                                  {record.employeeName?.charAt(0) || "E"}
                                </div>
                                <span>{record.employeeName}</span>
                              </div>
                            </td>
                            <td>
                              {record.time ||
                                (record.timestamp
                                  ? new Date(
                                      record.timestamp
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "N/A")}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  record.type === "checkin"
                                    ? "bg-success"
                                    : "bg-warning"
                                }`}
                              >
                                {record.type || "checkin"}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  record.workHours > 8
                                    ? "bg-warning"
                                    : "bg-info"
                                }`}
                              >
                                {record.workHours || "--"}h
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  record.syncStatus === "synced"
                                    ? "bg-success"
                                    : record.syncStatus === "pending"
                                    ? "bg-warning"
                                    : "bg-secondary"
                                }`}
                              >
                                {record.syncStatus || "synced"}
                              </span>
                            </td>
                          </tr>
                        ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderManualTab = () => {
    // LocalStorage keys for manual attendance
    const LS_KEYS = {
      MANUAL_ATTENDANCE: "manual_attendance_records",
      IMPORT_HISTORY: "manual_import_history",
      AUDIT_TRAIL: "manual_audit_trail",
      DRAFT_ENTRIES: "manual_draft_entries",
      TEMPLATE_HISTORY: "manual_template_history",
    };

    // LocalStorage helper functions
    const saveToLocalStorage = (key, data) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    };

    const loadFromLocalStorage = (key, defaultValue) => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        return defaultValue;
      }
    };

    // Initialize LocalStorage for manual tab
    const initializeLocalStorage = () => {
      try {
        if (!localStorage.getItem(LS_KEYS.MANUAL_ATTENDANCE)) {
          localStorage.setItem(LS_KEYS.MANUAL_ATTENDANCE, JSON.stringify([]));
        }
        if (!localStorage.getItem(LS_KEYS.IMPORT_HISTORY)) {
          localStorage.setItem(LS_KEYS.IMPORT_HISTORY, JSON.stringify([]));
        }
        if (!localStorage.getItem(LS_KEYS.AUDIT_TRAIL)) {
          localStorage.setItem(LS_KEYS.AUDIT_TRAIL, JSON.stringify([]));
        }
        if (!localStorage.getItem(LS_KEYS.DRAFT_ENTRIES)) {
          localStorage.setItem(LS_KEYS.DRAFT_ENTRIES, JSON.stringify([]));
        }
        if (!localStorage.getItem(LS_KEYS.TEMPLATE_HISTORY)) {
          localStorage.setItem(LS_KEYS.TEMPLATE_HISTORY, JSON.stringify([]));
        }
        return true;
      } catch (error) {
        console.error("Error initializing manual localStorage:", error);
        return false;
      }
    };

    // Enhanced save manual entry with localStorage
    const enhancedSaveManualEntry = () => {
      initializeLocalStorage();

      if (!manualEntryData.employeeId) {
        alert("Please select an employee");
        return;
      }

      const selectedEmp = employees.find(
        (e) => e.id === manualEntryData.employeeId
      );
      if (!selectedEmp) {
        alert("Employee not found");
        return;
      }

      const now = new Date();
      const today = now.toISOString().split("T")[0];

      // Calculate work hours
      const checkInTime = parseTime(manualEntryData.checkIn);
      const checkOutTime = parseTime(manualEntryData.checkOut);
      const workHours =
        checkOutTime > checkInTime ? (checkOutTime - checkInTime) / 60 : 0;
      const breakHours = (manualEntryData.breakTime || 60) / 60;
      const netWorkHours = Math.max(0, workHours - breakHours);

      // Calculate overtime
      let overtime = 0;
      const standardHours = 8;
      if (netWorkHours > standardHours) {
        overtime =
          (netWorkHours - standardHours) * (settings.overtimeRate || 1.5);
      }

      const manualRecord = {
        id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        employeeId: manualEntryData.employeeId,
        employeeName: selectedEmp.name,
        employeeDepartment: selectedEmp.department,
        date: manualEntryData.date,
        checkIn: `${manualEntryData.date}T${manualEntryData.checkIn}:00`,
        checkOut: `${manualEntryData.date}T${manualEntryData.checkOut}:00`,
        method: "manual",
        status: manualEntryData.status,
        workHours: netWorkHours.toFixed(2),
        overtime: overtime.toFixed(2),
        breakTime: manualEntryData.breakTime || 60,
        reason: manualEntryData.reason,
        approvedBy: "Admin",
        approvedAt: now.toISOString(),
        entryType: "single",
        isVerified: true,
        verifiedBy: "HR",
        verificationDate: now.toISOString(),
        notes: manualEntryData.reason,
        canCheckOut:
          manualEntryData.status === "Present" && !manualEntryData.checkOut,
        checkedOut: !!manualEntryData.checkOut,
        syncStatus: "synced",

        // Audit trail
        createdBy: "Admin",
        createdAt: now.toISOString(),
        lastModifiedBy: "Admin",
        lastModifiedAt: now.toISOString(),
        changeLog: [
          {
            timestamp: now.toISOString(),
            action: "Created",
            user: "Admin",
            details: "Manual attendance entry created",
          },
        ],
      };

      // Add to state
      dispatch({ type: "ADD_ATTENDANCE", payload: manualRecord });

      // Save to localStorage
      const manualRecords = loadFromLocalStorage(LS_KEYS.MANUAL_ATTENDANCE, []);
      manualRecords.unshift(manualRecord);
      saveToLocalStorage(LS_KEYS.MANUAL_ATTENDANCE, manualRecords);

      // Add audit log
      const auditLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: now.toISOString(),
        action: "CREATE_MANUAL_ENTRY",
        user: "Admin",
        employeeId: manualEntryData.employeeId,
        employeeName: selectedEmp.name,
        date: manualEntryData.date,
        details: `Manual entry: ${manualEntryData.status} - ${
          manualEntryData.reason || "No reason provided"
        }`,
        ipAddress: "192.168.1.100",
      };

      const auditTrail = loadFromLocalStorage(LS_KEYS.AUDIT_TRAIL, []);
      auditTrail.unshift(auditLog);
      saveToLocalStorage(LS_KEYS.AUDIT_TRAIL, auditTrail);

      // Add to sync logs
      dispatch({
        type: "ADD_SYNC_LOG",
        payload: {
          id: Date.now(),
          timestamp: now.toISOString(),
          type: "manual_entry",
          status: "Success",
          message: `Manual attendance entry created for ${selectedEmp.name}`,
          records: 1,
        },
      });

      alert(`✅ Manual entry saved for ${selectedEmp.name}`);

      // Reset form
      setManualEntryData({
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
        checkIn: "09:00",
        checkOut: "18:00",
        status: "Present",
        reason: "",
        overtime: 0,
        breakTime: 60,
        nightShift: false,
        weekend: false,
        holiday: false,
      });
    };

    // Function to handle manual check-out
    const handleManualCheckOut = (recordId) => {
      initializeLocalStorage();

      // Find the record in localStorage first
      const manualRecords = loadFromLocalStorage(LS_KEYS.MANUAL_ATTENDANCE, []);
      const record = manualRecords.find((r) => r.id === recordId);

      if (!record) {
        // Fallback to state if not in localStorage
        const stateRecord = attendanceRecords.find((r) => r.id === recordId);
        if (!stateRecord) {
          alert("Record not found");
          return;
        }
        processCheckOut(stateRecord);
        return;
      }

      processCheckOut(record);
    };

    const processCheckOut = (record) => {
      if (record.checkedOut) {
        alert("This entry already has check-out time");
        return;
      }

      const now = new Date();
      const checkOutTime = now.toISOString();
      const checkOutTimeDisplay = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Parse check-in time
      const checkInDate = new Date(record.checkIn);
      const checkOutDate = new Date(checkOutTime);

      // Calculate work hours
      const workHoursMs = checkOutDate - checkInDate;
      const workHours = workHoursMs / (1000 * 60 * 60);
      const breakHours = (record.breakTime || settings.breakDuration) / 60;
      const netWorkHours = Math.max(0, workHours - breakHours);

      // Calculate overtime
      let overtime = 0;
      const standardHours = 8;
      if (netWorkHours > standardHours) {
        overtime = (netWorkHours - standardHours) * settings.overtimeRate;
      }

      // Update record
      const updatedRecord = {
        ...record,
        checkOut: checkOutTime,
        checkOutTime: checkOutTimeDisplay,
        workHours: netWorkHours.toFixed(2),
        overtime: overtime.toFixed(2),
        canCheckOut: false,
        checkedOut: true,
        lastModifiedAt: now.toISOString(),
        lastModifiedBy: "Admin",
        changeLog: [
          ...(record.changeLog || []),
          {
            timestamp: now.toISOString(),
            action: "Check-out",
            user: "Admin",
            details: `Check-out recorded at ${checkOutTimeDisplay}`,
          },
        ],
      };

      // Update state
      dispatch({ type: "UPDATE_ATTENDANCE", payload: updatedRecord });

      // Update localStorage
      const manualRecords = loadFromLocalStorage(LS_KEYS.MANUAL_ATTENDANCE, []);
      const recordIndex = manualRecords.findIndex((r) => r.id === record.id);
      if (recordIndex !== -1) {
        manualRecords[recordIndex] = updatedRecord;
        saveToLocalStorage(LS_KEYS.MANUAL_ATTENDANCE, manualRecords);
      }

      // Add audit log
      const auditLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: now.toISOString(),
        action: "MANUAL_CHECKOUT",
        user: "Admin",
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        checkOutTime: checkOutTimeDisplay,
        workHours: netWorkHours.toFixed(2),
        details: `Manual check-out for ${record.employeeName} at ${checkOutTimeDisplay}`,
        ipAddress: "192.168.1.100",
      };

      const auditTrail = loadFromLocalStorage(LS_KEYS.AUDIT_TRAIL, []);
      auditTrail.unshift(auditLog);
      saveToLocalStorage(LS_KEYS.AUDIT_TRAIL, auditTrail);

      alert(
        `✅ Check-out recorded for ${record.employeeName} at ${checkOutTimeDisplay}`
      );
    };

    // Enhanced bulk upload with localStorage
    const enhancedHandleBulkUpload = (file) => {
      if (!file) return;

      setIsUploading(true);
      setUploadProgress(0);
      setBulkUploadFile(file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            enhancedProcessBulkFile(file);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    };

    const enhancedProcessBulkFile = (file) => {
      initializeLocalStorage();

      // Simulate processing
      setTimeout(() => {
        const now = new Date();
        const records = [
          {
            id: `bulk_${Date.now() + 1}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            employeeId: "EMP001",
            employeeName: "Khuswanth Rao",
            employeeDepartment: "IT",
            date: now.toISOString().split("T")[0],
            checkIn: `${now.toISOString().split("T")[0]}T09:00:00`,
            checkOut: `${now.toISOString().split("T")[0]}T18:00:00`,
            status: "Present",
            method: "manual",
            workHours: 8.5,
            overtime: 0.5,
            approvedBy: "Admin",
            importedFrom: file.name,
            importType: "bulk_upload",
            canCheckOut: false,
            checkedOut: true,
            syncStatus: "synced",
            createdAt: now.toISOString(),
            createdBy: "System",
          },
          {
            id: `bulk_${Date.now() + 2}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            employeeId: "EMP002",
            employeeName: "John Smith",
            employeeDepartment: "HR",
            date: now.toISOString().split("T")[0],
            checkIn: `${now.toISOString().split("T")[0]}T09:30:00`,
            checkOut: `${now.toISOString().split("T")[0]}T17:30:00`,
            status: "Present",
            method: "manual",
            workHours: 7.5,
            overtime: 0,
            approvedBy: "Admin",
            importedFrom: file.name,
            importType: "bulk_upload",
            canCheckOut: false,
            checkedOut: true,
            syncStatus: "synced",
            createdAt: now.toISOString(),
            createdBy: "System",
          },
        ];

        // Add records to state
        records.forEach((record) => {
          dispatch({ type: "ADD_ATTENDANCE", payload: record });
        });

        // Save to localStorage
        const manualRecords = loadFromLocalStorage(
          LS_KEYS.MANUAL_ATTENDANCE,
          []
        );
        records.forEach((record) => manualRecords.unshift(record));
        saveToLocalStorage(LS_KEYS.MANUAL_ATTENDANCE, manualRecords);

        // Add to import history
        const importRecord = {
          id: `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: now.toISOString(),
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          recordsImported: records.length,
          status: "Success",
          importedBy: "Admin",
          source: "bulk_upload",
          details: `Bulk upload completed: ${records.length} records imported`,
        };

        const importHistory = loadFromLocalStorage(LS_KEYS.IMPORT_HISTORY, []);
        importHistory.unshift(importRecord);
        saveToLocalStorage(LS_KEYS.IMPORT_HISTORY, importHistory);

        // Update state
        setImportHistory(importHistory);

        // Add to template history
        const templateHistory = loadFromLocalStorage(
          LS_KEYS.TEMPLATE_HISTORY,
          []
        );
        templateHistory.unshift({
          id: `template_${Date.now()}`,
          fileName: file.name,
          downloadedAt: now.toISOString(),
          downloadedBy: "Admin",
          format: file.name.split(".").pop(),
        });
        saveToLocalStorage(LS_KEYS.TEMPLATE_HISTORY, templateHistory);

        // Add audit log
        const auditLog = {
          id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: now.toISOString(),
          action: "BULK_UPLOAD",
          user: "Admin",
          fileName: file.name,
          recordsCount: records.length,
          details: `Bulk upload completed: ${records.length} records imported`,
          ipAddress: "192.168.1.100",
        };

        const auditTrail = loadFromLocalStorage(LS_KEYS.AUDIT_TRAIL, []);
        auditTrail.unshift(auditLog);
        saveToLocalStorage(LS_KEYS.AUDIT_TRAIL, auditTrail);

        setIsUploading(false);
        setUploadProgress(0);
        setBulkUploadFile(null);
        alert(`✅ Bulk upload completed! ${records.length} records imported.`);
      }, 1000);
    };

    // Enhanced download template with localStorage tracking
    const enhancedDownloadTemplate = (format = "csv") => {
      initializeLocalStorage();

      let template, filename, mimeType;

      if (format === "csv") {
        template = [
          [
            "Employee ID",
            "Date",
            "Check In",
            "Check Out",
            "Status",
            "Overtime Hours",
            "Reason",
            "Approved By",
          ],
          [
            "EMP001",
            "2024-01-15",
            "09:00",
            "18:00",
            "Present",
            "2",
            "Regular work",
            "Admin",
          ],
          [
            "EMP002",
            "2024-01-15",
            "09:30",
            "17:30",
            "Present",
            "1",
            "Regular work",
            "Admin",
          ],
          ["EMP003", "2024-01-15", "", "", "Absent", "0", "Sick leave", "HR"],
          [
            "EMP004",
            "2024-01-15",
            "09:00",
            "13:00",
            "Half Day",
            "0",
            "Medical appointment",
            "Manager",
          ],
        ]
          .map((row) => row.join(","))
          .join("\n");
        filename = "attendance_template.csv";
        mimeType = "text/csv";
      }

      const blob = new Blob([template], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Save template download history
      const templateHistory = loadFromLocalStorage(
        LS_KEYS.TEMPLATE_HISTORY,
        []
      );
      templateHistory.unshift({
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fileName: filename,
        format: format,
        downloadedAt: new Date().toISOString(),
        downloadedBy: "Admin",
      });
      saveToLocalStorage(LS_KEYS.TEMPLATE_HISTORY, templateHistory);
    };

    // View audit trail
    const viewAuditTrail = () => {
      initializeLocalStorage();
      const auditTrail = loadFromLocalStorage(LS_KEYS.AUDIT_TRAIL, []);

      if (auditTrail.length === 0) {
        alert("No audit trail entries found");
        return;
      }

      let message = "📋 Manual Entry Audit Trail\n\n";
      auditTrail.slice(0, 10).forEach((log) => {
        message += `[${new Date(log.timestamp).toLocaleString()}]\n`;
        message += `Action: ${log.action}\n`;
        message += `Employee: ${log.employeeName || "N/A"}\n`;
        message += `Details: ${log.details}\n`;
        message += `User: ${log.user}\n`;
        message += `─`.repeat(50) + "\n\n";
      });

      alert(message);
    };

    // View import history
    const viewImportHistory = () => {
      initializeLocalStorage();
      const importHistory = loadFromLocalStorage(LS_KEYS.IMPORT_HISTORY, []);

      if (importHistory.length === 0) {
        alert("No import history found");
        return;
      }

      let message = "📁 Import History\n\n";
      importHistory.slice(0, 10).forEach((record) => {
        message += `[${new Date(record.timestamp).toLocaleString()}]\n`;
        message += `File: ${record.fileName}\n`;
        message += `Status: ${record.status}\n`;
        message += `Records: ${record.recordsImported}\n`;
        message += `User: ${record.importedBy}\n`;
        message += `─`.repeat(50) + "\n\n";
      });

      alert(message);
    };

    // Get manual entries from localStorage
    const getManualEntries = () => {
      initializeLocalStorage();
      const manualRecords = loadFromLocalStorage(LS_KEYS.MANUAL_ATTENDANCE, []);

      // If localStorage is empty, fallback to state
      if (manualRecords.length === 0) {
        return attendanceRecords.filter((r) => r.method === "manual");
      }

      return manualRecords.filter((r) => r.method === "manual");
    };

    // Calculate manual statistics
    const getManualStatistics = () => {
      const manualEntries = getManualEntries();
      const today = new Date().toISOString().split("T")[0];

      const todayEntries = manualEntries.filter((r) => r.date === today);
      const pendingCheckOuts = manualEntries.filter(
        (r) =>
          r.status === "Present" && r.canCheckOut !== false && !r.checkedOut
      ).length;

      const recentEntries = manualEntries
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      return {
        total: manualEntries.length,
        today: todayEntries.length,
        pendingCheckOuts,
        recentEntries,
      };
    };

    const manualStats = getManualStatistics();

    return (
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6>Manual Attendance Entry</h6>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-info"
                onClick={viewAuditTrail}
                title="View Audit Trail"
              >
                <FileText size={14} />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={viewImportHistory}
                title="Import History"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="card border shadow-none mb-3">
            <div className="card-body py-2">
              <div className="row text-center">
                <div className="col-4">
                  <div className="text-muted small mb-1">Total Entries</div>
                  <div className="h5 mb-0 text-primary">
                    {manualStats.total}
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-muted small mb-1">Today</div>
                  <div className="h5 mb-0 text-success">
                    {manualStats.today}
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-muted small mb-1">
                    Pending Check-outs
                  </div>
                  <div className="h5 mb-0 text-warning">
                    {manualStats.pendingCheckOuts}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border shadow-none mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Single Entry</h6>
                {manualEntryData.employeeId && (
                  <span className="badge bg-info">
                    {
                      employees.find((e) => e.id === manualEntryData.employeeId)
                        ?.name
                    }
                  </span>
                )}
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small">Employee *</label>
                  <select
                    className="form-select"
                    value={manualEntryData.employeeId}
                    onChange={(e) =>
                      setManualEntryData({
                        ...manualEntryData,
                        employeeId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={manualEntryData.date}
                    onChange={(e) =>
                      setManualEntryData({
                        ...manualEntryData,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Check In Time *</label>
                  <input
                    type="time"
                    className="form-control"
                    value={manualEntryData.checkIn}
                    onChange={(e) =>
                      setManualEntryData({
                        ...manualEntryData,
                        checkIn: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Check Out Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={manualEntryData.checkOut}
                    onChange={(e) =>
                      setManualEntryData({
                        ...manualEntryData,
                        checkOut: e.target.value,
                      })
                    }
                  />
                  <small className="text-muted">
                    Leave empty for pending check-out
                  </small>
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Status *</label>
                  <select
                    className="form-select"
                    value={manualEntryData.status}
                    onChange={(e) =>
                      setManualEntryData({
                        ...manualEntryData,
                        status: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Short Leave">Short Leave</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small">Overtime Hours</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    min="0"
                    step="0.5"
                    value={manualEntryData.overtime}
                    onChange={(e) =>
                      setManualEntryData({
                        ...manualEntryData,
                        overtime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small">Reason/Notes</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter reason for manual entry..."
                    rows="3"
                    value={manualEntryData.reason}
                    onChange={(e) =>
                      setManualEntryData({
                        ...manualEntryData,
                        reason: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="col-12">
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={enhancedSaveManualEntry}
                      disabled={
                        !manualEntryData.employeeId || !manualEntryData.date
                      }
                    >
                      <Plus size={14} className="me-2" />
                      Save Manual Entry
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        // Save as draft
                        initializeLocalStorage();
                        const draftEntries = loadFromLocalStorage(
                          LS_KEYS.DRAFT_ENTRIES,
                          []
                        );
                        draftEntries.push({
                          ...manualEntryData,
                          savedAt: new Date().toISOString(),
                          id: `draft_${Date.now()}`,
                        });
                        saveToLocalStorage(LS_KEYS.DRAFT_ENTRIES, draftEntries);
                        alert("Entry saved as draft");
                      }}
                    >
                      <FileText size={14} className="me-2" />
                      Save as Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card border shadow-none mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Bulk Upload</h6>
                <span className="badge bg-secondary">
                  {importHistory.length} imports
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label small">
                  Upload Attendance File
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      enhancedHandleBulkUpload(file);
                    }
                  }}
                  disabled={isUploading}
                />
                <small className="text-muted">
                  Upload Excel/CSV file with attendance data (max 5MB)
                </small>
              </div>

              {isUploading && (
                <div className="alert alert-info mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Processing {bulkUploadFile?.name}...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="progress mt-2" style={{ height: "6px" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => enhancedDownloadTemplate("csv")}
                >
                  <Download size={14} className="me-2" />
                  Download CSV Template
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => enhancedDownloadTemplate("excel")}
                >
                  <Download size={14} className="me-2" />
                  Download Excel Template
                </button>
              </div>
            </div>
          </div>

          <div className="card border shadow-none">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Recent Manual Entries</h6>
                <span className="badge bg-primary">
                  {manualStats.recentEntries.length}
                </span>
              </div>
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualStats.recentEntries.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                              style={{
                                width: "24px",
                                height: "24px",
                                fontSize: "10px",
                              }}
                            >
                              {record.employeeName?.charAt(0) || "E"}
                            </div>
                            <div>
                              <div className="fw-medium small">
                                {record.employeeName}
                              </div>
                              <small className="text-muted">
                                {record.employeeId}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="small">{record.date}</td>
                        <td className="small">
                          {record.checkIn
                            ? new Date(record.checkIn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--:--"}
                        </td>
                        <td className="small">
                          {record.checkOut
                            ? new Date(record.checkOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--:--"}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              record.status === "Present"
                                ? "bg-success"
                                : record.status === "Absent"
                                ? "bg-danger"
                                : record.status === "Half Day"
                                ? "bg-warning"
                                : "bg-info"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {record.status === "Present" &&
                              !record.checkedOut && (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() =>
                                    handleManualCheckOut(record.id)
                                  }
                                  title="Check Out"
                                >
                                  <LogOut size={12} />
                                </button>
                              )}
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                // Edit record
                                setEditingRecord(record);
                                setEditFormData({
                                  employeeId: record.employeeId,
                                  date: record.date,
                                  checkIn: record.checkIn
                                    ? new Date(
                                        record.checkIn
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "",
                                  checkOut: record.checkOut
                                    ? new Date(
                                        record.checkOut
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "",
                                  status: record.status,
                                  reason: record.reason || "",
                                  overtime: record.overtime || 0,
                                  breakTime: record.breakTime || 60,
                                });
                                setShowEditModal(true);
                              }}
                              title="Edit"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Delete entry for ${record.employeeName}?`
                                  )
                                ) {
                                  // Delete from localStorage
                                  const manualRecords = loadFromLocalStorage(
                                    LS_KEYS.MANUAL_ATTENDANCE,
                                    []
                                  );
                                  const updatedRecords = manualRecords.filter(
                                    (r) => r.id !== record.id
                                  );
                                  saveToLocalStorage(
                                    LS_KEYS.MANUAL_ATTENDANCE,
                                    updatedRecords
                                  );

                                  // Delete from state
                                  dispatch({
                                    type: "DELETE_ATTENDANCE",
                                    payload: record.id,
                                  });

                                  alert("Entry deleted successfully");
                                }
                              }}
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {manualStats.recentEntries.length === 0 && (
                <div className="text-center py-4">
                  <FileText size={32} className="text-muted mb-2" />
                  <p className="text-muted mb-0">No manual entries found</p>
                  <small className="text-muted">
                    Create your first manual entry above
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendanceList = () => (
    <div>
      <div className="card border shadow-none mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 40 }} className="text-center">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={
                      selectedRecords.length === currentRecords.length &&
                      currentRecords.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="text-start">EMPLOYEE</th>
                <th className="text-start">DATE</th>
                <th className="text-start">CHECK IN</th>
                <th className="text-start">CHECK OUT</th>
                <th className="text-center">METHOD</th>
                <th className="text-center">STATUS</th>
                <th className="text-center">HOURS</th>
                <th className="text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => {
                const employee = employees.find(
                  (e) => e.id === record.employeeId
                );
                return (
                  <tr key={record.id}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedRecords.includes(record.id)}
                        onChange={(e) => handleSelectRecord(record.id, e)}
                      />
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: "30px",
                            height: "30px",
                            fontSize: "12px",
                          }}
                        >
                          {employee?.name?.charAt(0) || "E"}
                        </div>
                        <div>
                          <div className="fw-medium">{record.employeeName}</div>
                          <small className="text-muted">
                            {record.employeeId}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted">{record.date}</td>
                    <td className="text-muted">
                      {record.checkIn
                        ? new Date(record.checkIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="text-muted">
                      {record.checkOut
                        ? new Date(record.checkOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          record.method === "biometric"
                            ? "bg-primary-subtle text-primary"
                            : record.method === "gps"
                            ? "bg-success-subtle text-success"
                            : record.method === "web"
                            ? "bg-info-subtle text-info"
                            : "bg-secondary-subtle text-secondary"
                        }`}
                      >
                        {record.method.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          record.status === "Present"
                            ? "bg-success-subtle text-success"
                            : record.status === "Absent"
                            ? "bg-danger-subtle text-danger"
                            : record.status === "Half Day"
                            ? "bg-warning-subtle text-warning"
                            : record.status === "On Leave"
                            ? "bg-info-subtle text-info"
                            : "bg-secondary-subtle text-secondary"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`fw-medium ${
                          (parseFloat(record.workHours) || 0) > 8
                            ? "text-warning"
                            : "text-success"
                        }`}
                      >
                        {record.workHours || "0.00"}h
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-icon btn-light"
                          onClick={() => handleEdit(record.id)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        {!record.checkOut && (
                          <button
                            type="button"
                            className="btn btn-sm btn-icon btn-light text-success"
                            onClick={() => markCheckOut(record.id)}
                            title="Check Out"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-icon btn-light text-danger"
                          onClick={() => handleDelete(record.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

      {/* Pagination */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <small className="text-secondary-light">
            Showing <strong>{indexOfFirstRecord + 1}</strong> to{" "}
            <strong>
              {Math.min(indexOfLastRecord, filteredRecords.length)}
            </strong>{" "}
            of <strong>{filteredRecords.length}</strong> records
          </small>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="btn-group" role="group">
            <button
              className="btn btn-outline-secondary"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className={
                1 === currentPage
                  ? "btn btn-primary"
                  : "btn btn-outline-secondary"
              }
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            <button
              className={
                2 === currentPage
                  ? "btn btn-primary"
                  : "btn btn-outline-secondary"
              }
              onClick={() => handlePageChange(2)}
            >
              2
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          <select
            className="form-select w-auto"
            value={itemsPerPage}
            onChange={(e) => {
              handleItemsPerPageChange(Number(e.target.value));
            }}
            style={{ minWidth: "60px" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <AttendanceContext.Provider value={{ state, dispatch }}>
      <div className="container-fluid py-4">
        {/* Page Header */}
     <div className="mb-4">
  <h4 className="fw-bold h4 h2-md d-flex align-items-center">
   <Icon
  icon="heroicons:clipboard-document-check"
  className="me-2 fs-4"
  style={{ color: "#000" }}
/>

    Attendance Capture & Tracking
  </h4>
  <p className="text-secondary-light mb-0">
    Multiple check-in methods including biometric, GPS mobile, web
    portal, and manual entry.
  </p>
</div>


        {/* Status Bar */}
        <div className="d-flex align-items-center gap-3 mb-4">
        
          {offlineData.length > 0 && (
            <span className="badge bg-warning">
              <AlertCircle size={12} className="me-1" />
              {offlineData.length} pending sync
            </span>
          )}
          {isNightShift && (
            <span className="badge bg-dark">
              <Clock size={12} className="me-1" />
              Night Shift Active
            </span>
          )}
        
        </div>

        {/* KPI Summary */}
        <div className="card border shadow-none mb-4">
          <div className="card-body d-flex">
            <div className="text-center w-25">
              <div className="fw-bold text-secondary-light small">
                Total Records
              </div>
              <div className="h4 mb-0 text-primary">{stats.totalRecords}</div>
            </div>
            <div className="text-center w-25 border-start ps-4">
              <div className="fw-bold text-secondary-light small">
                Present Today
              </div>
              <div className="h4 mb-0 text-success">{stats.present}</div>
            </div>
            <div className="text-center w-25 border-start ps-4">
              <div className="fw-bold text-secondary-light small">
                Late Arrivals
              </div>
              <div className="h4 mb-0 text-warning">{stats.late}</div>
            </div>
            <div className="text-center w-25 border-start ps-4">
              <div className="fw-bold text-secondary-light small">
                Overtime Hours
              </div>
              <div className="h4 mb-0 text-danger">{stats.totalOvertime}h</div>
            </div>
          </div>
        </div>

        {/* Quick Check-in Section */}
       
        {/* Filters */}
        <div className="card border shadow-none mb-4">
          <div className="card-body d-flex gap-3 align-items-center">
            <div className="flex-grow-1">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={16} />
                </span>
                <input
                  className="form-control border-start-0"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <select
              className="form-select w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Half Day</option>
              <option>On Leave</option>
            </select>

            <select
              className="form-select w-auto"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option>All Methods</option>
              <option>biometric</option>
              <option>gps</option>
              <option>web</option>
              <option>manual</option>
            </select>

            <select
              className="form-select w-auto"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option>All Dates</option>
              <option>Today</option>
              <option>Yesterday</option>
              <option>This Week</option>
              <option>Last Week</option>
            </select>

            <div className="d-flex gap-2">
             <button
  className="btn btn-success d-inline-flex align-items-center"
  onClick={() => handleExport("attendance")}
>
  <Download size={14} className="me-2" />
  Export
</button>

             <button
  className="btn btn-dark d-inline-flex align-items-center"
  onClick={handlePrint}
>
  <Printer size={14} className="me-2" />
  Print
</button>

            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedRecords.length > 0 && (
          <div className="alert alert-info d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
              <span className="fw-medium">
                {selectedRecords.length} record
                {selectedRecords.length > 1 ? "s" : ""} selected
              </span>
              <div className="vr"></div>
              <button
                onClick={() =>
                  alert(`Processing ${selectedRecords.length} records`)
                }
                className="btn btn-warning btn-sm"
              >
                <Filter size={14} className="me-1" />
                Process Selected
              </button>
              <button
                onClick={() => handleExport("attendance")}
                className="btn btn-success btn-sm"
              >
                <Download size={14} className="me-1" />
                Export Selected
              </button>
            </div>
            <button
              onClick={() => setSelectedRecords([])}
              className="btn btn-link p-0 text-decoration-none"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Main Tabs */}
        <div className="card border shadow-none mb-4">
          <div className="card-body p-3">
            <div className="d-flex flex-column flex-sm-row gap-3">
              {[
                {
                  id: "biometric",
                  name: "Biometric",
                  desc: "Fingerprint/Face",
                  icon: Fingerprint,
                },
                {
                  id: "gps",
                  name: "GPS Mobile",
                  desc: "Location Based",
                  icon: Smartphone,
                },
                {
                  id: "web",
                  name: "Web Portal",
                  desc: "Browser Based",
                  icon: Monitor,
                },
                {
                  id: "settings",
                  name: "Settings",
                  desc: "Configuration",
                  icon: Settings,
                },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`btn flex-fill d-flex flex-column align-items-center justify-content-center ${
                      isActive
                        ? `bg-white text-dark border-primary border-2 shadow-sm`
                        : `bg-white text-primary border`
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      minHeight: "100px",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      padding: "16px 12px",
                    }}
                  >
                    <div className="d-flex justify-content-center mb-2" style={{ height: "32px", alignItems: "center" }}>
                      <IconComponent 
                        size={24} 
                        className={isActive ? "text-dark" : "text-primary"}
                        style={{ display: "block" }}
                      />
                    </div>
                    <div className={`fw-bold mb-1 ${isActive ? "text-dark" : "text-primary"}`} style={{ fontSize: "1rem" }}>
                      {tab.name}
                    </div>
                    <div className="small text-muted" style={{ fontSize: "0.75rem" }}>
                      {tab.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="row">
          <div className="col-12">
            <div className="card border shadow-none">
              <div className="card-body">
                {activeTab === "attendance" && renderAttendanceList()}
                {activeTab === "biometric" && renderBiometricTab()}
                {activeTab === "gps" && renderGPSTab()}
                {activeTab === "manual" && renderManualTab()}
                {activeTab === "web" && (
                  <div>
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6>Web Portal & Field Attendance</h6>
                            <p className="text-secondary-light mb-0">
                              Browser-based check-in/out with IP whitelisting,
                              webcam capture, and field employee support
                            </p>
                          </div>
                          <div className="d-flex gap-2">
                            <span
                              className={`badge ${
                                isOnline ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {isOnline ? (
                                <>
                                  <Wifi size={12} className="me-1" />
                                  Online
                                </>
                              ) : (
                                <>
                                  <WifiOff size={12} className="me-1" />
                                  Offline
                                </>
                              )}
                            </span>
                            <span className="badge bg-info">
                              IP: {webState.currentIP || "192.168.1.100"}
                            </span>
                            <span className="badge bg-primary">
                              <Users size={12} className="me-1" />
                              {webState.fieldEmployees.length} Field Staff
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions Bar */}
                    <div className="card border shadow-none mb-4">
                      <div className="card-body py-3">
                        <div className="d-flex flex-wrap gap-3 align-items-center">
                          <button
                            type="button"
                            className="btn btn-light text-primary d-flex align-items-center"
                            onClick={() => handleWebAttendance("checkin")}
                            disabled={webState.isCheckingIn}
                          >
                            {webState.isCheckingIn ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} className="me-2" />
                                Quick Check-in
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-light text-primary d-flex align-items-center"
                            onClick={() => handleWebAttendance("checkout")}
                            disabled={webState.isCheckingOut}
                          >
                            {webState.isCheckingOut ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} className="me-2" />
                                Quick Check-out
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-light text-primary d-flex align-items-center"
                            onClick={markWFHAttendance}
                          >
                            <Home size={16} className="me-2" />
                            Mark WFH
                          </button>
                          <div className="vr"></div>
                          <button
                            type="button"
                            className="btn btn-outline-primary d-flex align-items-center"
                            onClick={() =>
                              setWebState((prev) => ({
                                ...prev,
                                showWebcamModal: true,
                              }))
                            }
                          >
                            <Camera size={16} className="me-2" />
                            Capture Webcam
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger d-flex align-items-center"
                            onClick={() => {
                              if (typeof getCurrentLocation === 'function') {
                                getCurrentLocation().catch((error) => {
                                  console.error('Error getting location:', error);
                                  alert('Unable to get location. Please check your browser permissions.');
                                });
                              } else {
                                alert('Location function not available');
                              }
                            }}
                          >
                            <MapPin size={16} className="me-2" />
                            Get Location
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      {/* Left Column - Main Attendance Functions */}
                      <div className="col-md-8">
                        {/* Main Web Attendance Card */}
                        <div className="card border shadow-none mb-4">
                          <div className="card-header bg-white">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="mb-0">
                                <Monitor
                                  size={20}
                                  className="me-2 text-primary"
                                />
                                Web Portal Attendance
                              </h5>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => {
                                    const ip = prompt(
                                      "Enter test IP address:",
                                      webState.currentIP
                                    );
                                    if (ip) {
                                      setWebState((prev) => ({
                                        ...prev,
                                        currentIP: ip,
                                      }));
                                    }
                                  }}
                                >
                                  Change IP
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() =>
                                    alert(
                                      `IP Check: ${
                                        whitelistIPs.includes(
                                          webState.currentIP
                                        )
                                          ? "Allowed ✓"
                                          : "Blocked ✗"
                                      }`
                                    )
                                  }
                                >
                                  Verify IP
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                {/* Employee Selection */}
                                <div className="mb-4">
                                  <label className="form-label fw-bold">
                                    Select Employee
                                  </label>
                                  <select
                                    className="form-select"
                                    value={selectedEmployee}
                                    onChange={(e) =>
                                      setSelectedEmployee(e.target.value)
                                    }
                                    style={{
                                      fontSize: "1.1rem",
                                      padding: "0.75rem",
                                    }}
                                  >
                                    {employees.map((emp) => (
                                      <option key={emp.id} value={emp.id}>
                                        {emp.name} - {emp.department} ({emp.id})
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* IP Status Display */}
                                <div className="alert alert-info mb-4">
                                  <div className="d-flex align-items-center">
                                    <Wifi
                                      size={18}
                                      className="me-3 flex-shrink-0"
                                    />
                                    <div className="flex-grow-1">
                                      <div className="fw-bold mb-1">
                                        Current Network Status
                                      </div>
                                      <div className="d-flex justify-content-between align-items-center">
                                        <code className="fs-6">
                                          {webState.currentIP ||
                                            "192.168.1.100"}
                                        </code>
                                        <span
                                          className={`badge ${
                                            whitelistIPs.includes(
                                              webState.currentIP
                                            )
                                              ? "bg-success"
                                              : "bg-danger"
                                          }`}
                                        >
                                          {whitelistIPs.includes(
                                            webState.currentIP
                                          )
                                            ? "Whitelisted"
                                            : "Not Whitelisted"}
                                        </span>
                                      </div>
                                      <small className="text-muted d-block mt-1">
                                        {whitelistIPs.includes(
                                          webState.currentIP
                                        )
                                          ? "Your IP is allowed to access attendance portal"
                                          : "Contact admin to add your IP to whitelist"}
                                      </small>
                                    </div>
                                  </div>
                                </div>

                                {/* Webcam Preview Section */}
                                {settings.requireSelfie && (
                                  <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <label className="form-label fw-bold">
                                        Webcam Verification
                                      </label>
                                      {webState.webcamImage && (
                                        <span className="badge bg-success">
                                          <CheckCircle
                                            size={12}
                                            className="me-1"
                                          />
                                          Verified
                                        </span>
                                      )}
                                    </div>
                                    {webState.webcamImage ? (
                                      <div className="text-center border rounded p-3">
                                        <img
                                          src={webState.webcamImage}
                                          alt="Captured"
                                          className="img-fluid rounded mb-3"
                                          style={{
                                            maxHeight: "200px",
                                            width: "100%",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <div className="d-flex gap-2">
                                          <button
                                            className="btn btn-outline-primary btn-sm flex-fill"
                                            onClick={() =>
                                              setWebState((prev) => ({
                                                ...prev,
                                                showWebcamModal: true,
                                              }))
                                            }
                                          >
                                            <Camera
                                              size={14}
                                              className="me-1"
                                            />
                                            Retake Photo
                                          </button>
                                          <button
                                            className="btn btn-outline-danger btn-sm flex-fill"
                                            onClick={() =>
                                              setWebState((prev) => ({
                                                ...prev,
                                                webcamImage: null,
                                              }))
                                            }
                                          >
                                            <Trash2
                                              size={14}
                                              className="me-1"
                                            />
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-center border rounded p-5 bg-light">
                                        <Camera
                                          size={48}
                                          className="text-muted mb-3"
                                        />
                                        <p className="text-muted mb-3">
                                          No photo captured yet
                                        </p>
                                        <button
                                          className="btn btn-primary"
                                          onClick={() =>
                                            setWebState((prev) => ({
                                              ...prev,
                                              showWebcamModal: true,
                                            }))
                                          }
                                        >
                                          <Camera size={16} className="me-2" />
                                          Open Webcam & Capture
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="col-md-6">
                                {/* Check-in/out Actions */}
                                <div className="d-flex flex-column h-100">
                                  <div className="mb-4">
                                    <h6 className="text-primary mb-3">
                                      Attendance Actions
                                    </h6>
                                    <div className="d-grid gap-3">
                                      <button
                                        className={`btn btn-lg ${
                                          settings.requireSelfie &&
                                          !webState.webcamImage
                                            ? "btn-outline-primary"
                                            : "btn-primary"
                                        }`}
                                        onClick={() =>
                                          handleWebAttendance("checkin")
                                        }
                                        disabled={
                                          webState.isCheckingIn ||
                                          (settings.requireSelfie &&
                                            !webState.webcamImage)
                                        }
                                      >
                                        {webState.isCheckingIn ? (
                                          <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Processing Check-in...
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle
                                              size={20}
                                              className="me-2"
                                            />
                                            Web Check-in
                                          </>
                                        )}
                                      </button>

                                      <button
                                        className="btn btn-lg btn-warning"
                                        onClick={() =>
                                          handleWebAttendance("checkout")
                                        }
                                        disabled={webState.isCheckingOut}
                                      >
                                        {webState.isCheckingOut ? (
                                          <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Processing Check-out...
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle
                                              size={20}
                                              className="me-2"
                                            />
                                            Web Check-out
                                          </>
                                        )}
                                      </button>

                                      <button
                                        className="btn btn-lg btn-success"
                                        onClick={markWFHAttendance}
                                      >
                                        <Home size={20} className="me-2" />
                                        Mark as Work From Home
                                      </button>
                                    </div>
                                  </div>

                                  {/* Status Indicators */}
                                  <div className="mt-auto">
                                    <div className="alert bg-light border">
                                      <div className="d-flex">
                                        <div className="flex-shrink-0">
                                          <Clock
                                            size={20}
                                            className="text-primary"
                                          />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                          <strong>Current Status:</strong>
                                          <div className="mt-1">
                                            {settings.requireSelfie ? (
                                              webState.webcamImage ? (
                                                <span className="badge bg-success">
                                                  Ready to check-in
                                                </span>
                                              ) : (
                                                <span className="badge bg-warning">
                                                  Webcam required
                                                </span>
                                              )
                                            ) : (
                                              <span className="badge bg-info">
                                                Ready
                                              </span>
                                            )}
                                            {!whitelistIPs.includes(
                                              webState.currentIP
                                            ) && (
                                              <span className="badge bg-danger ms-2">
                                                IP not allowed
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Field Employee Management */}
                        <div className="card border shadow-none mb-4">
                          <div className="card-header bg-white">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="mb-0">
                                <Users size={20} className="me-2 text-danger" />
                                Field Employee Management
                              </h5>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  const name = prompt(
                                    "Enter field employee name:"
                                  );
                                  if (name) {
                                    const newEmployee = {
                                      id: `FE${String(
                                        webState.fieldEmployees.length + 1
                                      ).padStart(3, "0")}`,
                                      name: name,
                                      location: "Field Assignment",
                                      status: "Active",
                                      lastCheckIn:
                                        new Date().toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }),
                                      type: "Field Staff",
                                      department: "Field Operations",
                                    };
                                    setWebState((prev) => ({
                                      ...prev,
                                      fieldEmployees: [
                                        ...prev.fieldEmployees,
                                        newEmployee,
                                      ],
                                    }));
                                    alert(
                                      `Field employee ${name} added successfully!`
                                    );
                                  }
                                }}
                              >
                                <Plus size={14} className="me-2" />
                                Add Field Employee
                              </button>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-hover">
                                <thead>
                                  <tr>
                                    <th>Employee</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Last Activity</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {webState.fieldEmployees.map((employee) => (
                                    <tr key={employee.id}>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <div
                                            className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{
                                              width: "36px",
                                              height: "36px",
                                              fontSize: "14px",
                                            }}
                                          >
                                            {employee.name.charAt(0)}
                                          </div>
                                          <div>
                                            <div className="fw-medium">
                                              {employee.name}
                                            </div>
                                            <small className="text-muted">
                                              {employee.id} • {employee.type}
                                            </small>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <MapPin
                                            size={16}
                                            className="me-2 text-danger flex-shrink-0"
                                          />
                                          <div>
                                            <div>{employee.location}</div>
                                            <small className="text-muted">
                                              Field Assignment
                                            </small>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <span
                                          className={`badge ${getStatusBadgeColor(
                                            employee.status
                                          )}`}
                                        >
                                          {employee.status}
                                        </span>
                                      </td>
                                      <td>
                                        <div className="d-flex align-items-center">
                                          <Clock
                                            size={16}
                                            className="me-2 text-muted flex-shrink-0"
                                          />
                                          <div>
                                            <div>{employee.lastCheckIn}</div>
                                            <small className="text-muted">
                                              Last check-in
                                            </small>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex gap-2">
                                          <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() =>
                                              markFieldAttendance(employee.id)
                                            }
                                            title="Mark Field Attendance"
                                          >
                                            <CheckCircle size={14} />
                                          </button>
                                          <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => {
                                              setSelectedEmployee(employee.id);
                                              alert(
                                                `Selected ${employee.name} for attendance`
                                              );
                                            }}
                                            title="Select Employee"
                                          >
                                            <User size={14} />
                                          </button>
                                          <button
                                            className="btn btn-sm btn-outline-info"
                                            onClick={() => {
                                              const location = prompt(
                                                "Update location:",
                                                employee.location
                                              );
                                              if (location) {
                                                setWebState((prev) => ({
                                                  ...prev,
                                                  fieldEmployees:
                                                    prev.fieldEmployees.map(
                                                      (emp) =>
                                                        emp.id === employee.id
                                                          ? { ...emp, location }
                                                          : emp
                                                    ),
                                                }));
                                              }
                                            }}
                                            title="Update Location"
                                          >
                                            <MapPin size={14} />
                                          </button>
                                          <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => {
                                              if (
                                                window.confirm(
                                                  `Remove ${employee.name} from field employees?`
                                                )
                                              ) {
                                                setWebState((prev) => ({
                                                  ...prev,
                                                  fieldEmployees:
                                                    prev.fieldEmployees.filter(
                                                      (emp) =>
                                                        emp.id !== employee.id
                                                    ),
                                                }));
                                              }
                                            }}
                                            title="Remove"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Side Panels */}
                      <div className="col-md-4">
                        {/* IP Whitelist Management */}
                        <div className="card border shadow-none mb-4">
                          <div className="card-body">
                            <h6 className="card-title d-flex align-items-center">
                              <Wifi size={18} className="me-2 text-primary" />
                              IP Whitelist Management
                            </h6>
                            <p className="text-muted small mb-3">
                              Allow access only from trusted IP addresses.
                              Office network IPs should be added here.
                            </p>

                            <div className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., 192.168.1.100"
                                value={newIP}
                                onChange={(e) => setNewIP(e.target.value)}
                                pattern="\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
                              />
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  if (
                                    newIP &&
                                    /^(\d{1,3}\.){3}\d{1,3}$/.test(newIP)
                                  ) {
                                    dispatch({
                                      type: "ADD_WHITELIST_IP",
                                      payload: newIP,
                                    });
                                    setNewIP("");
                                    addSyncLog(
                                      "ip_whitelist",
                                      "Success",
                                      `Added IP ${newIP} to whitelist`
                                    );
                                    alert(`IP ${newIP} added to whitelist`);
                                  } else {
                                    alert(
                                      "Please enter a valid IP address (format: xxx.xxx.xxx.xxx)"
                                    );
                                  }
                                }}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <div
                              className="table-responsive"
                              style={{ maxHeight: "200px", overflowY: "auto" }}
                            >
                              <table className="table table-sm">
                                <thead>
                                  <tr>
                                    <th>IP Address</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {whitelistIPs.map((ip, index) => (
                                    <tr
                                      key={index}
                                      className={
                                        ip === webState.currentIP
                                          ? "table-info"
                                          : ""
                                      }
                                    >
                                      <td>
                                        <code>{ip}</code>
                                        {ip === webState.currentIP && (
                                          <small className="text-primary d-block">
                                            Current
                                          </small>
                                        )}
                                      </td>
                                      <td>
                                        <span
                                          className={`badge ${
                                            whitelistIPs.includes(ip)
                                              ? "bg-success"
                                              : "bg-danger"
                                          }`}
                                        >
                                          {whitelistIPs.includes(ip)
                                            ? "Allowed"
                                            : "Blocked"}
                                        </span>
                                      </td>
                                      <td>
                                        <button
                                          className="btn btn-sm btn-outline-danger"
                                          onClick={() => {
                                            if (
                                              window.confirm(
                                                `Remove IP ${ip} from whitelist?`
                                              )
                                            ) {
                                              dispatch({
                                                type: "SET_WHITELIST_IPS",
                                                payload: whitelistIPs.filter(
                                                  (i) => i !== ip
                                                ),
                                              });
                                              addSyncLog(
                                                "ip_whitelist",
                                                "Removed",
                                                `Removed IP ${ip} from whitelist`
                                              );
                                            }
                                          }}
                                          disabled={ip === webState.currentIP}
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="alert alert-warning mt-3">
                              <small>
                                <AlertCircle size={12} className="me-1" />
                                <strong>Security Note:</strong> Only whitelisted
                                IPs can access the web portal. Add office
                                network IP ranges for secure access.
                              </small>
                            </div>
                          </div>
                        </div>

                        {/* Work From Home Section */}
                        <div className="card border shadow-none mb-4">
                          <div className="card-body">
                            <h6 className="card-title d-flex align-items-center">
                              <Home size={18} className="me-2 text-success" />
                              Work From Home Management
                            </h6>

                            <div className="mb-3">
                              <label className="form-label">
                                Submit WFH Request
                              </label>
                              <div className="input-group mb-2">
                                <input
                                  type="date"
                                  className="form-control"
                                  defaultValue={
                                    new Date().toISOString().split("T")[0]
                                  }
                                />
                                <button
                                  className="btn btn-success"
                                  onClick={() => {
                                    const reason = prompt("Reason for WFH:");
                                    if (reason) {
                                      const request = {
                                        id: Date.now(),
                                        employeeId: selectedEmployee,
                                        employeeName: employees.find(
                                          (e) => e.id === selectedEmployee
                                        )?.name,
                                        date: new Date()
                                          .toISOString()
                                          .split("T")[0],
                                        status: "Pending Approval",
                                        type: "WFH",
                                        reason: reason,
                                        submittedAt: new Date().toISOString(),
                                        approvedBy: null,
                                        approvedAt: null,
                                      };
                                      setWebState((prev) => ({
                                        ...prev,
                                        wfhRequests: [
                                          ...prev.wfhRequests,
                                          request,
                                        ],
                                      }));
                                      alert(
                                        "WFH request submitted for manager approval"
                                      );
                                    }
                                  }}
                                >
                                  <FileText size={14} className="me-2" />
                                  Request
                                </button>
                              </div>
                            </div>

                            {/* Quick WFH Actions */}
                            <div className="row mb-3">
                              <div className="col-6">
                                <button
                                  className="btn btn-outline-success w-100 mb-2"
                                  onClick={markWFHAttendance}
                                >
                                  <Home size={14} className="me-1" />
                                  Mark WFH
                                </button>
                              </div>
                              <div className="col-6">
                                <button
                                  className="btn btn-outline-primary w-100 mb-2"
                                  onClick={() => {
                                    // View WFH requests
                                    const pending = webState.wfhRequests.filter(
                                      (r) => r.status === "Pending Approval"
                                    );
                                    alert(
                                      `${pending.length} pending WFH requests`
                                    );
                                  }}
                                >
                                  <Eye size={14} className="me-1" />
                                  View Requests
                                </button>
                              </div>
                            </div>

                            {/* WFH Statistics */}
                            <div className="bg-light rounded p-3">
                              <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">
                                  Today's WFH:
                                </span>
                                <span className="fw-bold text-success">
                                  {
                                    attendanceRecords.filter(
                                      (r) =>
                                        r.status === "WFH" &&
                                        r.date ===
                                          new Date().toISOString().split("T")[0]
                                    ).length
                                  }
                                </span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span className="text-muted small">
                                  Pending Requests:
                                </span>
                                <span className="fw-bold text-warning">
                                  {
                                    webState.wfhRequests.filter(
                                      (r) => r.status === "Pending Approval"
                                    ).length
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Field Tools */}
                        <div className="card border shadow-none">
                          <div className="card-body">
                            <h6 className="card-title d-flex align-items-center">
                              <MapPin size={18} className="me-2 text-danger" />
                              Field Employee Tools
                            </h6>

                            <div className="d-grid gap-2 mb-3">
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => {
                                  getCurrentLocation().then((location) => {
                                    const employee =
                                      webState.fieldEmployees.find(
                                        (e) => e.id === selectedEmployee
                                      );
                                    if (employee) {
                                      setWebState((prev) => ({
                                        ...prev,
                                        fieldEmployees: prev.fieldEmployees.map(
                                          (emp) =>
                                            emp.id === selectedEmployee
                                              ? {
                                                  ...emp,
                                                  location: location.address,
                                                }
                                              : emp
                                        ),
                                      }));
                                      alert(
                                        `Location updated for ${employee.name}: ${location.address}`
                                      );
                                    }
                                  });
                                }}
                              >
                                <MapPin size={16} className="me-2" />
                                Update Field Location
                              </button>

                              <button
                                className="btn btn-outline-warning"
                                onClick={() => {
                                  // Open field report template
                                  const report = {
                                    employeeId: selectedEmployee,
                                    employeeName: employees.find(
                                      (e) => e.id === selectedEmployee
                                    )?.name,
                                    date: new Date().toISOString(),
                                    location:
                                      userLocation?.address || "Field Location",
                                    tasks: "",
                                    notes: "",
                                    photos: [],
                                  };
                                  const reportStr = JSON.stringify(
                                    report,
                                    null,
                                    2
                                  );
                                  alert(`Field Report Template:\n${reportStr}`);
                                }}
                              >
                                <FileText size={16} className="me-2" />
                                Submit Field Report
                              </button>
                            </div>

                            {/* Field Employee Quick Stats */}
                            <div className="border-top pt-3">
                              <h6 className="small fw-bold mb-2">
                                Field Activity Summary
                              </h6>
                              <div className="row text-center">
                                <div className="col-6 mb-2">
                                  <div className="text-muted small">Active</div>
                                  <div className="h5 mb-0 text-primary">
                                    {
                                      webState.fieldEmployees.filter(
                                        (e) => e.status === "Active"
                                      ).length
                                    }
                                  </div>
                                </div>
                                <div className="col-6 mb-2">
                                  <div className="text-muted small">
                                    On Site
                                  </div>
                                  <div className="h5 mb-0 text-success">
                                    {
                                      attendanceRecords.filter(
                                        (r) =>
                                          r.status === "Field Work" &&
                                          r.date ===
                                            new Date()
                                              .toISOString()
                                              .split("T")[0]
                                      ).length
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activity Dashboard */}
                    <div className="row mt-4">
                      <div className="col-12">
                        <div className="card border shadow-none">
                          <div className="card-header bg-white">
                            <h5 className="mb-0">
                              Today's Web & Field Activity
                            </h5>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                <h6 className="mb-3">Recent Web Attendance</h6>
                                <div className="table-responsive">
                                  <table className="table table-sm">
                                    <thead>
                                      <tr>
                                        <th>Employee</th>
                                        <th>Time</th>
                                        <th>Type</th>
                                        <th>IP</th>
                                        <th>Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {attendanceRecords
                                        .filter(
                                          (r) =>
                                            r.method === "web" &&
                                            r.date ===
                                              new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        )
                                        .sort(
                                          (a, b) =>
                                            new Date(b.checkIn) -
                                            new Date(a.checkIn)
                                        )
                                        .slice(0, 5)
                                        .map((record) => (
                                          <tr key={record.id}>
                                            <td>
                                              <div className="d-flex align-items-center">
                                                <div
                                                  className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                                  style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    fontSize: "10px",
                                                  }}
                                                >
                                                  {record.employeeName?.charAt(
                                                    0
                                                  ) || "E"}
                                                </div>
                                                <span className="small">
                                                  {record.employeeName}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="small">
                                              {new Date(
                                                record.checkIn
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                            </td>
                                            <td>
                                              <span className="badge bg-primary small">
                                                Web
                                              </span>
                                            </td>
                                            <td className="small">
                                              <code>
                                                {record.ipAddress?.substring(
                                                  0,
                                                  10
                                                )}
                                                ...
                                              </code>
                                            </td>
                                            <td>
                                              <span
                                                className={`badge ${
                                                  record.checkOut
                                                    ? "bg-secondary"
                                                    : "bg-success"
                                                } small`}
                                              >
                                                {record.checkOut
                                                  ? "Out"
                                                  : "Active"}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              <div className="col-md-6">
                                <h6 className="mb-3">Field Activity Today</h6>
                                <div className="table-responsive">
                                  <table className="table table-sm">
                                    <thead>
                                      <tr>
                                        <th>Employee</th>
                                        <th>Location</th>
                                        <th>Check-in</th>
                                        <th>Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {attendanceRecords
                                        .filter(
                                          (r) =>
                                            r.status === "Field Work" &&
                                            r.date ===
                                              new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        )
                                        .slice(0, 5)
                                        .map((record) => (
                                          <tr key={record.id}>
                                            <td>
                                              <div className="d-flex align-items-center">
                                                <div
                                                  className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                                  style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    fontSize: "10px",
                                                  }}
                                                >
                                                  {record.employeeName?.charAt(
                                                    0
                                                  ) || "F"}
                                                </div>
                                                <span className="small">
                                                  {record.employeeName}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="small">
                                              <MapPin
                                                size={12}
                                                className="me-1 text-danger"
                                              />
                                              {record.location?.substring(
                                                0,
                                                20
                                              )}
                                              ...
                                            </td>
                                            <td className="small">
                                              {new Date(
                                                record.checkIn
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                            </td>
                                            <td>
                                              <span className="badge bg-danger small">
                                                Field
                                              </span>
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
                      </div>
                    </div>

                    {/* Webcam Capture Modal */}
                    {webState.showWebcamModal && (
                      <div
                        className="modal fade show d-block"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.9)",
                          zIndex: 1050,
                        }}
                      >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">
                                <Camera size={20} className="me-2" />
                                Webcam Capture for Attendance
                              </h5>
                              <button
                                className="btn-close"
                                onClick={() =>
                                  setWebState((prev) => ({
                                    ...prev,
                                    showWebcamModal: false,
                                  }))
                                }
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div className="row">
                                <div className="col-md-8">
                                  <div
                                    className="camera-preview bg-dark rounded mb-3"
                                    style={{
                                      height: "400px",
                                      position: "relative",
                                    }}
                                  >
                                    <div className="h-100 d-flex align-items-center justify-content-center">
                                      <div className="text-center">
                                        <Camera
                                          size={64}
                                          className="text-white mb-3"
                                        />
                                        <p className="text-white fs-5">
                                          Webcam Preview
                                        </p>
                                        <small className="text-white-50 d-block">
                                          Position yourself in the frame
                                        </small>
                                        <small className="text-white-50 d-block">
                                          Face should be clearly visible
                                        </small>

                                        {/* Simulated face overlay */}
                                        <div className="position-absolute top-50 start-50 translate-middle">
                                          <div
                                            className="border-warning rounded"
                                            style={{
                                              width: "200px",
                                              height: "250px",
                                              opacity: 0.3,
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="d-flex flex-column h-100">
                                    <div className="mb-4">
                                      <h6 className="text-primary">
                                        Instructions
                                      </h6>
                                      <ul className="small text-muted">
                                        <li>Ensure good lighting</li>
                                        <li>Face the camera directly</li>
                                        <li>Remove sunglasses/hat</li>
                                        <li>Stay still while capturing</li>
                                      </ul>
                                    </div>

                                    <div className="mb-4">
                                      <h6 className="text-primary">
                                        Verification Details
                                      </h6>
                                      <div className="small">
                                        <div className="mb-2">
                                          <strong>Employee:</strong>
                                          <br />
                                          {
                                            employees.find(
                                              (e) => e.id === selectedEmployee
                                            )?.name
                                          }
                                        </div>
                                        <div className="mb-2">
                                          <strong>Time:</strong>
                                          <br />
                                          {new Date().toLocaleTimeString()}
                                        </div>
                                        <div>
                                          <strong>Purpose:</strong>
                                          <br />
                                          {settings.requireSelfie
                                            ? "Mandatory Verification"
                                            : "Optional Verification"}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mt-auto">
                                      <div className="d-grid gap-2">
                                        <button
                                          className="btn btn-primary"
                                          onClick={() => {
                                            const simulatedImage =
                                              "data:image/jpeg;base64,webcam_simulated_data_" +
                                              Date.now();
                                            setWebState((prev) => ({
                                              ...prev,
                                              webcamImage: simulatedImage,
                                              showWebcamModal: false,
                                            }));
                                            alert(
                                              "Photo captured successfully!"
                                            );
                                          }}
                                        >
                                          <Camera size={16} className="me-2" />
                                          Capture Photo
                                        </button>
                                        <button
                                          className="btn btn-outline-secondary"
                                          onClick={() => {
                                            setWebState((prev) => ({
                                              ...prev,
                                              showWebcamModal: false,
                                            }));
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "settings" && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0">Attendance Settings</h4>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            const defaultSettings = {
                              geoFencing: true,
                              requireSelfie: false,
                              maxGeoRadius: 500,
                              workStartTime: "09:00",
                              workEndTime: "18:00",
                              breakDuration: 60,
                              overtimeRate: 1.5,
                              nightShiftStart: "22:00",
                              nightShiftEnd: "06:00",
                              weekendWorking: false,
                              holidayWorking: true,
                              duplicatePunchWindow: 5,
                              offlineMode: true,
                              autoCalculateWorkHours: true,
                              lateThreshold: 15,
                              earlyCheckoutThreshold: 30,
                              halfDayThreshold: 4,
                              shortLeaveThreshold: 2,
                              // Field employee settings
                              fieldTracking: true,
                              fieldReports: true,
                              locationUpdates: false,
                              locationInterval: 30,
                              maxFieldRadius: 50,
                              reportDeadline: "18:00",
                            };
                            dispatch({
                              type: "SET_SETTINGS",
                              payload: defaultSettings,
                            });
                            alert("Settings reset to defaults!");
                          }}
                        >
                          Reset to Defaults
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            localStorage.setItem(
                              "settings",
                              JSON.stringify(settings)
                            );
                            alert("Settings saved successfully!");
                          }}
                        >
                          Save Settings
                        </button>
                      </div>
                    </div>

                    {/* General Settings */}
                    <div className="card border shadow-none mb-4">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">General Settings</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={settings.geoFencing || false}
                                onChange={(e) =>
                                  dispatch({
                                    type: "UPDATE_SETTING",
                                    payload: { geoFencing: e.target.checked },
                                  })
                                }
                              />
                              <label className="form-check-label">
                                Geo-fencing
                              </label>
                              <small className="form-text text-muted d-block">
                                Enable location-based attendance
                              </small>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={settings.requireSelfie || false}
                                onChange={(e) =>
                                  dispatch({
                                    type: "UPDATE_SETTING",
                                    payload: {
                                      requireSelfie: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <label className="form-check-label">
                                Require Selfie
                              </label>
                              <small className="form-text text-muted d-block">
                                Require photo for web check-in
                              </small>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={settings.offlineMode || true}
                                onChange={(e) =>
                                  dispatch({
                                    type: "UPDATE_SETTING",
                                    payload: { offlineMode: e.target.checked },
                                  })
                                }
                              />
                              <label className="form-check-label">
                                Offline Mode
                              </label>
                              <small className="form-text text-muted d-block">
                                Allow attendance without internet
                              </small>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={settings.weekendWorking || false}
                                onChange={(e) =>
                                  dispatch({
                                    type: "UPDATE_SETTING",
                                    payload: {
                                      weekendWorking: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <label className="form-check-label">
                                Weekend Working
                              </label>
                              <small className="form-text text-muted d-block">
                                Allow attendance on weekends
                              </small>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={settings.holidayWorking || true}
                                onChange={(e) =>
                                  dispatch({
                                    type: "UPDATE_SETTING",
                                    payload: {
                                      holidayWorking: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <label className="form-check-label">
                                Holiday Working
                              </label>
                              <small className="form-text text-muted d-block">
                                Allow attendance on holidays
                              </small>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                  settings.autoCalculateWorkHours || true
                                }
                                onChange={(e) =>
                                  dispatch({
                                    type: "UPDATE_SETTING",
                                    payload: {
                                      autoCalculateWorkHours: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <label className="form-check-label">
                                Auto Calculate Hours
                              </label>
                              <small className="form-text text-muted d-block">
                                Automatically calculate work hours
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Work Hours Settings */}
                    <div className="card border shadow-none mb-4">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">Work Hours & Timing</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Work Start Time
                            </label>
                            <input
                              type="time"
                              className="form-control"
                              value={settings.workStartTime || "09:00"}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: { workStartTime: e.target.value },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Standard work start time
                            </small>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Work End Time</label>
                            <input
                              type="time"
                              className="form-control"
                              value={settings.workEndTime || "18:00"}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: { workEndTime: e.target.value },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Standard work end time
                            </small>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Break Duration (min)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={settings.breakDuration || 60}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: {
                                    breakDuration:
                                      parseInt(e.target.value) || 60,
                                  },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Daily break duration in minutes
                            </small>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Overtime Rate</label>
                            <input
                              type="number"
                              step="0.1"
                              className="form-control"
                              value={settings.overtimeRate || 1.5}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: {
                                    overtimeRate:
                                      parseFloat(e.target.value) || 1.5,
                                  },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Overtime multiplier rate
                            </small>
                          </div>
                        </div>

                        <div className="row mt-3">
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Night Shift Start
                            </label>
                            <input
                              type="time"
                              className="form-control"
                              value={settings.nightShiftStart || "22:00"}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: { nightShiftStart: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Night Shift End
                            </label>
                            <input
                              type="time"
                              className="form-control"
                              value={settings.nightShiftEnd || "06:00"}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: { nightShiftEnd: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Max Geo Radius (m)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={settings.maxGeoRadius || 500}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: {
                                    maxGeoRadius:
                                      parseInt(e.target.value) || 500,
                                  },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Maximum allowed distance from workplace
                            </small>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Duplicate Punch Window (min)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={settings.duplicatePunchWindow || 5}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: {
                                    duplicatePunchWindow:
                                      parseInt(e.target.value) || 5,
                                  },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Time between duplicate punches
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Threshold Settings */}
                    <div className="card border shadow-none mb-4">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">Attendance Thresholds</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Late Arrival Threshold (min)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={settings.lateThreshold || 15}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: {
                                    lateThreshold:
                                      parseInt(e.target.value) || 15,
                                  },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Minutes after start time considered late
                            </small>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Early Check-out Threshold (min)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={settings.earlyCheckoutThreshold || 30}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: {
                                    earlyCheckoutThreshold:
                                      parseInt(e.target.value) || 30,
                                  },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Minutes before end time considered early
                            </small>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Half Day Threshold (hrs)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={settings.halfDayThreshold || 4}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: {
                                    halfDayThreshold:
                                      parseInt(e.target.value) || 4,
                                  },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Hours required for half day
                            </small>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label">
                              Short Leave Threshold (hrs)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={settings.shortLeaveThreshold || 2}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: {
                                    shortLeaveThreshold:
                                      parseInt(e.target.value) || 2,
                                  },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Hours required for short leave
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Field Employee Settings */}
                    <div className="card border shadow-none">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">Field Employee Settings</h5>
                      </div>
                      <div className="card-body">
                        <div className="row mb-4">
                          <div className="col-md-4 mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={settings.fieldTracking || true}
                                onChange={(e) =>
                                  dispatch({
                                    type: "UPDATE_SETTING",
                                    payload: {
                                      fieldTracking: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <label className="form-check-label">
                                Enable Field Tracking
                              </label>
                              <small className="form-text text-muted d-block">
                                Track field employee locations
                              </small>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={settings.fieldReports || true}
                                onChange={(e) =>
                                  dispatch({
                                    type: "UPDATE_SETTING",
                                    payload: { fieldReports: e.target.checked },
                                  })
                                }
                              />
                              <label className="form-check-label">
                                Require Daily Reports
                              </label>
                              <small className="form-text text-muted d-block">
                                Field employees must submit daily reports
                              </small>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={settings.locationUpdates || false}
                                onChange={(e) =>
                                  dispatch({
                                    type: "UPDATE_SETTING",
                                    payload: {
                                      locationUpdates: e.target.checked,
                                    },
                                  })
                                }
                              />
                              <label className="form-check-label">
                                Auto Location Updates
                              </label>
                              <small className="form-text text-muted d-block">
                                Automatically update field locations
                              </small>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label className="form-label">
                              Location Update Interval
                            </label>
                            <select
                              className="form-select"
                              value={settings.locationInterval || 30}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: {
                                    locationInterval: parseInt(e.target.value),
                                  },
                                })
                              }
                            >
                              <option value={15}>15 minutes</option>
                              <option value={30}>30 minutes</option>
                              <option value={60}>1 hour</option>
                              <option value={120}>2 hours</option>
                              <option value={240}>4 hours</option>
                            </select>
                            <small className="form-text text-muted">
                              How often to update field locations
                            </small>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">
                              Max Field Radius (km)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={settings.maxFieldRadius || 50}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: {
                                    maxFieldRadius:
                                      parseInt(e.target.value) || 50,
                                  },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Maximum allowed distance from assigned location
                            </small>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">
                              Report Deadline
                            </label>
                            <input
                              type="time"
                              className="form-control"
                              value={settings.reportDeadline || "18:00"}
                              onChange={(e) =>
                                dispatch({
                                  type: "UPDATE_SETTING",
                                  payload: { reportDeadline: e.target.value },
                                })
                              }
                            />
                            <small className="form-text text-muted">
                              Daily deadline for field reports
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Settings Actions */}
                    <div className="d-flex justify-content-end gap-3 mt-4">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          // Export settings
                          const settingsData = JSON.stringify(
                            settings,
                            null,
                            2
                          );
                          const blob = new Blob([settingsData], {
                            type: "application/json",
                          });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `attendance_settings_${
                            new Date().toISOString().split("T")[0]
                          }.json`;
                          a.click();
                          window.URL.revokeObjectURL(url);
                          alert("Settings exported successfully!");
                        }}
                      >
                        <Download size={16} className="me-2" />
                        Export Settings
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          const fileInput = document.createElement("input");
                          fileInput.type = "file";
                          fileInput.accept = ".json";
                          fileInput.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                try {
                                  const importedSettings = JSON.parse(
                                    event.target.result
                                  );
                                  dispatch({
                                    type: "SET_SETTINGS",
                                    payload: importedSettings,
                                  });
                                  localStorage.setItem(
                                    "settings",
                                    JSON.stringify(importedSettings)
                                  );
                                  alert("Settings imported successfully!");
                                } catch (error) {
                                  alert(
                                    "Error importing settings: Invalid file format"
                                  );
                                }
                              };
                              reader.readAsText(file);
                            }
                          };
                          fileInput.click();
                        }}
                      >
                        <Upload size={16} className="me-2" />
                        Import Settings
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          localStorage.setItem(
                            "settings",
                            JSON.stringify(settings)
                          );
                          alert("Settings saved successfully!");
                        }}
                      >
                        <CheckCircle size={16} className="me-2" />
                        Save All Settings
                      </button>
                    </div>

                    {/* Current Settings Preview */}
                    <div className="card border shadow-none mt-4">
                      <div className="card-header bg-white">
                        <h6 className="mb-0">Current Settings Preview</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">
                              Enabled Features
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                              {settings.geoFencing && (
                                <span className="badge bg-primary">
                                  Geo-fencing
                                </span>
                              )}
                              {settings.offlineMode && (
                                <span className="badge bg-success">
                                  Offline Mode
                                </span>
                              )}
                              {settings.requireSelfie && (
                                <span className="badge bg-info">
                                  Selfie Required
                                </span>
                              )}
                              {settings.fieldTracking && (
                                <span className="badge bg-warning">
                                  Field Tracking
                                </span>
                              )}
                              {settings.fieldReports && (
                                <span className="badge bg-danger">
                                  Field Reports
                                </span>
                              )}
                              {settings.autoCalculateWorkHours && (
                                <span className="badge bg-secondary">
                                  Auto Calculate
                                </span>
                              )}
                              {settings.weekendWorking && (
                                <span className="badge bg-dark">
                                  Weekend Working
                                </span>
                              )}
                              {settings.holidayWorking && (
                                <span className="badge bg-primary">
                                  Holiday Working
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Key Values</h6>
                            <div className="row">
                              <div className="col-6 mb-2">
                                <small className="text-muted">
                                  Work Hours:
                                </small>
                                <div className="fw-bold">
                                  {settings.workStartTime || "09:00"} -{" "}
                                  {settings.workEndTime || "18:00"}
                                </div>
                              </div>
                              <div className="col-6 mb-2">
                                <small className="text-muted">
                                  Break Duration:
                                </small>
                                <div className="fw-bold">
                                  {settings.breakDuration || 60} minutes
                                </div>
                              </div>
                              <div className="col-6 mb-2">
                                <small className="text-muted">
                                  Overtime Rate:
                                </small>
                                <div className="fw-bold">
                                  {settings.overtimeRate || 1.5}x
                                </div>
                              </div>
                              <div className="col-6 mb-2">
                                <small className="text-muted">
                                  Late Threshold:
                                </small>
                                <div className="fw-bold">
                                  {settings.lateThreshold || 15} minutes
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={cancelDelete}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this attendance record?</p>
                  <p className="text-muted small">
                    This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDelete}
                  >
                    Delete Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingRecord && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Attendance Record</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCancelEdit}
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Employee</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingRecord.employeeName}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={editFormData.date}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Check In</label>
                        <input
                          type="time"
                          className="form-control"
                          value={editFormData.checkIn}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              checkIn: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Check Out</label>
                        <input
                          type="time"
                          className="form-control"
                          value={editFormData.checkOut}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              checkOut: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          value={editFormData.status}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Half Day">Half Day</option>
                          <option value="On Leave">On Leave</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Overtime Hours</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editFormData.overtime}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              overtime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Reason</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editFormData.reason}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            reason: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveEdit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AttendanceContext.Provider>
  );
};

export default AttendanceCapture;
