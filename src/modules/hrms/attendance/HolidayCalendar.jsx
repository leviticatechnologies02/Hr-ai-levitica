import React, { useState, useEffect, useReducer } from "react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Eye,
  Settings,
  CheckSquare,
  AlertCircle,
  Search,
  Filter,
  Download,
  Printer,
  Menu,
  Grid,
  List,
  Building,
  Users,
  ArrowLeftRight,
  RefreshCw,
  MapPin,
  Gift,
  FileText,
  BarChart3,
} from "lucide-react";

const daysShort = ["S", "M", "T", "W", "T", "F", "S"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ==================== REDUCER FOR STATE MANAGEMENT ====================
const holidayReducer = (state, action) => {
  switch (action.type) {
    case "SET_HOLIDAYS":
      return { ...state, holidays: action.payload };
    case "ADD_HOLIDAY":
      return { ...state, holidays: [...state.holidays, action.payload] };
    case "UPDATE_HOLIDAY":
      return {
        ...state,
        holidays: state.holidays.map((h) =>
          h.id === action.payload.id ? action.payload : h
        ),
      };
    case "DELETE_HOLIDAY":
      return {
        ...state,
        holidays: state.holidays.filter((h) => h.id !== action.payload),
      };
    case "SET_APPLICATIONS":
      return { ...state, optionalApplications: action.payload };
    case "ADD_APPLICATION":
      return {
        ...state,
        optionalApplications: [...state.optionalApplications, action.payload],
      };
    case "UPDATE_APPLICATION":
      return {
        ...state,
        optionalApplications: state.optionalApplications.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case "SET_CALENDARS":
      return { ...state, calendars: action.payload };
    case "ADD_CALENDAR":
      return { ...state, calendars: [...state.calendars, action.payload] };
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
        swapRequests: state.swapRequests.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case "SET_CARRY_FORWARD":
      return { ...state, carryForward: action.payload };

    case "UPDATE_CALENDAR":
      return {
        ...state,
        calendars: state.calendars.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

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
    location: "Bangalore",
    employeeGroup: "IT_Group",
  },
  {
    id: "EMP002",
    name: "John Smith",
    department: "HR",
    location: "Mumbai",
    employeeGroup: "HR_Group",
  },
  {
    id: "EMP003",
    name: "Sarah Johnson",
    department: "Finance",
    location: "Delhi",
    employeeGroup: "Finance_Group",
  },
  {
    id: "EMP004",
    name: "Mike Brown",
    department: "Sales",
    location: "Bangalore",
    employeeGroup: "Sales_Group",
  },
  {
    id: "EMP005",
    name: "Emma Wilson",
    department: "IT",
    location: "Mumbai",
    employeeGroup: "IT_Group",
  },
];

const initialLocations = [
  {
    id: "LOC001",
    name: "Bangalore",
    code: "BLR",
    country: "India",
    state: "Karnataka",
  },
  {
    id: "LOC002",
    name: "Mumbai",
    code: "MUM",
    country: "India",
    state: "Maharashtra",
  },
  {
    id: "LOC003",
    name: "Delhi",
    code: "DEL",
    country: "India",
    state: "Delhi",
  },
  {
    id: "LOC004",
    name: "Hyderabad",
    code: "HYD",
    country: "India",
    state: "Telangana",
  },
];

const initialEmployeeGroups = [
  {
    id: "IT_Group",
    name: "IT Department",
    description: "IT and Engineering teams",
  },
  {
    id: "HR_Group",
    name: "HR Department",
    description: "Human Resources team",
  },
  {
    id: "Finance_Group",
    name: "Finance Department",
    description: "Finance and Accounting",
  },
  {
    id: "Sales_Group",
    name: "Sales Department",
    description: "Sales and Business Development",
  },
];

const HolidayCalendar = () => {
  const today = new Date();

  // Load from localStorage
  const loadFromStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const initialState = {
    holidays: loadFromStorage("holidays", []),
    optionalApplications: loadFromStorage("optionalApplications", []),
    calendars: loadFromStorage("holidayCalendars", [
      {
        id: 1,
        name: "India - National Calendar",
        location: "All",
        employeeGroups: ["all"],
        isDefault: true,
      },
    ]),
    swapRequests: loadFromStorage("holidaySwapRequests", []),
    carryForward: loadFromStorage("holidayCarryForward", []),
  };

  const [state, dispatch] = useReducer(holidayReducer, initialState);
  const {
    holidays,
    optionalApplications,
    calendars,
    swapRequests,
    carryForward,
  } = state;

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("holidays", JSON.stringify(holidays));
    localStorage.setItem(
      "optionalApplications",
      JSON.stringify(optionalApplications)
    );
    localStorage.setItem("holidayCalendars", JSON.stringify(calendars));
    localStorage.setItem("holidaySwapRequests", JSON.stringify(swapRequests));
    localStorage.setItem("holidayCarryForward", JSON.stringify(carryForward));
  }, [state]);

  // -------------------------------
  // VIEW STATE
  // -------------------------------
  const [viewMode, setViewMode] = useState("month"); // "month" or "list"
  const [isMobileView, setIsMobileView] = useState(false);
  /*Edit Holiday Calendar*/
  const [isEditCalendar, setIsEditCalendar] = useState(false);
  const [editingCalendarId, setEditingCalendarId] = useState(null);

  // -------------------------------
  // NOTIFICATION STATE
  // -------------------------------
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // -------------------------------
  // SEARCH & FILTER STATES
  // -------------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setViewMode("list"); // Default to list view on mobile
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // -------------------------------
  // SHOW NOTIFICATION
  // -------------------------------
  const showNotification = (message, type = "info") => {
    setNotification({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "info",
      });
    }, 3000);
  };

  // -------------------------------
  // SAVE TO LOCALSTORAGE
  // -------------------------------
  useEffect(() => {
    localStorage.setItem("holidays", JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem(
      "optionalApplications",
      JSON.stringify(optionalApplications)
    );
  }, [optionalApplications]);

  // -------------------------------
  // MODAL STATES
  // -------------------------------
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showOptionalModal, setShowOptionalModal] = useState(false);
  const [showEditHolidayModal, setShowEditHolidayModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  // -------------------------------
  // ACTIVE TAB STATE
  // -------------------------------
  const [activeTab, setActiveTab] = useState("holidayMaster");
  const [activeSubTab, setActiveSubTab] = useState("master"); // master, calendars, swap, carryForward

  // -------------------------------
  // NEW HOLIDAY FORM FIELDS
  // -------------------------------
  const [newHoliday, setNewHoliday] = useState({
    name: "",
    date: "",
    location: "All",
    category: "",
    holidayType: "gazetted", // gazetted, restricted, festival
    optional: false,
    applicableCalendars: ["all"],
    applicableGroups: ["all"],
    advanceBookingDays: 0,
    allowCarryForward: false,
    carryForwardLimit: 0,
  });

  const [editHoliday, setEditHoliday] = useState({
    id: null,
    name: "",
    date: "",
    location: "All",
    category: "",
    holidayType: "gazetted",
    optional: false,
    applicableCalendars: ["all"],
    applicableGroups: ["all"],
    advanceBookingDays: 0,
    allowCarryForward: false,
    carryForwardLimit: 0,
  });

  // Calendar management
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarForm, setCalendarForm] = useState({
    name: "",
    location: "",
    employeeGroups: [],
    isDefault: false,
  });

  // Holiday swap
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapForm, setSwapForm] = useState({
    employeeId: "",
    holidayDate: "",
    workDate: "",
    reason: "",
  });

  // Carry forward
  const [showCarryForwardModal, setShowCarryForwardModal] = useState(false);
  const [carryForwardForm, setCarryForwardForm] = useState({
    employeeId: "",
    fromYear: new Date().getFullYear() - 1,
    toYear: new Date().getFullYear(),
    holidays: [],
  });

  const [optionalReason, setOptionalReason] = useState("");
  const [selectedOptionalHoliday, setSelectedOptionalHoliday] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);

  // -------------------------------
  // DROPDOWN MENU STATE
  // -------------------------------
  const [openDropdown, setOpenDropdown] = useState(null);

  // -------------------------------
  // CALENDAR STATE
  // -------------------------------
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  // -------------------------------
  // STATISTICS
  // -------------------------------
  const stats = {
    totalHolidays: holidays.length,
    optionalHolidays: holidays.filter((h) => h.optional).length,
    totalApplications: optionalApplications.length,
    pendingApplications: optionalApplications.filter(
      (app) => app.status === "Pending"
    ).length,
    approvedApplications: optionalApplications.filter(
      (app) => app.status === "Approved"
    ).length,
    rejectedApplications: optionalApplications.filter(
      (app) => app.status === "Rejected"
    ).length,
  };

  // -------------------------------
  // FILTERED DATA
  // -------------------------------
  const filteredHolidays = holidays.filter((holiday) => {
    const matchesSearch =
      holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || holiday.category === categoryFilter;
    const matchesType =
      typeFilter === "All" ||
      (typeFilter === "optional" && holiday.optional) ||
      (typeFilter === "mandatory" && !holiday.optional);

    return matchesSearch && matchesCategory && matchesType;
  });

  const filteredApplications = optionalApplications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // -------------------------------
  // CALENDAR FUNCTIONS (From reference code)
  // -------------------------------
  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0);
  const startDay = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();

  // Create holiday map for quick lookup
  const holidayMap = holidays.reduce((acc, h) => {
    acc[h.date] = h;
    return acc;
  }, {});

  // Check if a date is today
  const isToday = (d) =>
    d === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  // Check if date has holiday
  const isHoliday = (d) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(d).padStart(2, "0")}`;
    return holidayMap[dateKey];
  };

  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get month name
  const monthName = monthNames[currentMonth];

  // Go to today
  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today.getDate());
  };

  // -------------------------------
  // DATA MANIPULATION FUNCTIONS
  // -------------------------------
  const saveHoliday = () => {
    if (!newHoliday.name || !newHoliday.date || !newHoliday.category) {
      showNotification("Please fill all required fields", "warning");
      return;
    }

    const newHolidayWithId = {
      id: Date.now(),
      ...newHoliday,
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };

    dispatch({ type: "ADD_HOLIDAY", payload: newHolidayWithId });
    setShowHolidayModal(false);

    setNewHoliday({
      name: "",
      date: "",
      location: "All",
      category: "",
      holidayType: "gazetted",
      optional: false,
      applicableCalendars: ["all"],
      applicableGroups: ["all"],
      advanceBookingDays: 0,
      allowCarryForward: false,
      carryForwardLimit: 0,
    });

    showNotification("Holiday added successfully!", "success");
  };

  const openEditCalendarModal = (calendar) => {
    setCalendarForm({
      name: calendar.name,
      location: calendar.location,
      employeeGroups: calendar.employeeGroups || ["all"],
      isDefault: calendar.isDefault || false,
    });

    setEditingCalendarId(calendar.id);
    setIsEditCalendar(true);
    setShowCalendarModal(true);
  };

  const openEditModal = (holiday) => {
    setEditHoliday({ ...holiday });
    setShowEditHolidayModal(true);
    setOpenDropdown(null);
  };

  const updateHoliday = () => {
    if (!editHoliday.name || !editHoliday.date || !editHoliday.category) {
      showNotification("Please fill all required fields", "warning");
      return;
    }

    dispatch({ type: "UPDATE_HOLIDAY", payload: editHoliday });
    setShowEditHolidayModal(false);
    setEditHoliday({
      id: null,
      name: "",
      date: "",
      location: "All",
      category: "",
      holidayType: "gazetted",
      optional: false,
      applicableCalendars: ["all"],
      applicableGroups: ["all"],
      advanceBookingDays: 0,
      allowCarryForward: false,
      carryForwardLimit: 0,
    });

    showNotification("Holiday updated successfully!", "success");
  };

  const applyOptionalHoliday = () => {
    if (!selectedOptionalHoliday) {
      showNotification("Please select an optional holiday", "warning");
      return;
    }

    const selectedHoliday = holidays.find(
      (h) => h.name === selectedOptionalHoliday
    );

    if (!selectedHoliday) {
      showNotification("Selected holiday not found", "error");
      return;
    }

    // Check advance booking requirement
    const holidayDate = new Date(selectedHoliday.date);
    const today = new Date();
    const daysDiff = Math.ceil((holidayDate - today) / (1000 * 60 * 60 * 24));

    if (
      selectedHoliday.advanceBookingDays > 0 &&
      daysDiff < selectedHoliday.advanceBookingDays
    ) {
      showNotification(
        `This holiday requires ${selectedHoliday.advanceBookingDays} days advance booking`,
        "warning"
      );
      return;
    }

    const newApplication = {
      id: Date.now(),
      name: selectedOptionalHoliday,
      date: selectedHoliday?.date || "",
      holidayId: selectedHoliday.id,
      employeeId: "EMP001", // In real app, get from auth
      employeeName: "Khuswanth Rao",
      status: "Pending",
      approvalRequired: true,
      reason: optionalReason,
      appliedDate: new Date().toISOString().split("T")[0],
      advanceBookingDays: selectedHoliday.advanceBookingDays || 0,
      approvalWorkflow: [
        { level: 1, approver: "Manager", status: "pending", required: true },
        { level: 2, approver: "HR", status: "pending", required: true },
      ],
    };

    dispatch({ type: "ADD_APPLICATION", payload: newApplication });
    setShowOptionalModal(false);
    setSelectedOptionalHoliday("");
    setOptionalReason("");

    showNotification("Optional holiday application submitted!", "success");
  };

  // Holiday swap function
  const handleHolidaySwap = () => {
    if (
      !swapForm.employeeId ||
      !swapForm.holidayDate ||
      !swapForm.workDate ||
      !swapForm.reason
    ) {
      showNotification("Please fill all required fields", "warning");
      return;
    }

    const swapRequest = {
      id: Date.now(),
      ...swapForm,
      status: "pending",
      submittedAt: new Date().toISOString(),
      approvalWorkflow: [
        { level: 1, approver: "Manager", status: "pending", required: true },
        { level: 2, approver: "HR", status: "pending", required: true },
      ],
    };

    dispatch({ type: "ADD_SWAP_REQUEST", payload: swapRequest });
    setShowSwapModal(false);
    setSwapForm({
      employeeId: "",
      holidayDate: "",
      workDate: "",
      reason: "",
    });

    showNotification("Holiday swap request submitted!", "success");
  };

  // Process carry forward
  const handleCarryForward = () => {
    if (
      !carryForwardForm.employeeId ||
      carryForwardForm.holidays.length === 0
    ) {
      showNotification(
        "Please select employee and holidays to carry forward",
        "warning"
      );
      return;
    }

    const carryForwardRecord = {
      id: Date.now(),
      ...carryForwardForm,
      status: "processed",
      processedAt: new Date().toISOString(),
      processedBy: "HR Admin",
    };

    dispatch({
      type: "SET_CARRY_FORWARD",
      payload: [...carryForward, carryForwardRecord],
    });
    setShowCarryForwardModal(false);
    setCarryForwardForm({
      employeeId: "",
      fromYear: new Date().getFullYear() - 1,
      toYear: new Date().getFullYear(),
      holidays: [],
    });

    showNotification("Holiday carry forward processed!", "success");
  };

  const openStatusModal = (application) => {
    setSelectedApplication(application);
    setShowStatusModal(true);
    setOpenDropdown(null);
  };

  const updateApplicationStatus = (newStatus) => {
    if (!selectedApplication) return;

    const updatedApplication = {
      ...selectedApplication,
      status: newStatus,
      [newStatus === "Approved"
        ? "approvedAt"
        : newStatus === "Rejected"
        ? "rejectedAt"
        : "updatedAt"]: new Date().toISOString(),
      [newStatus === "Approved"
        ? "approvedBy"
        : newStatus === "Rejected"
        ? "rejectedBy"
        : "updatedBy"]: "Manager",
    };

    dispatch({ type: "UPDATE_APPLICATION", payload: updatedApplication });

    setShowStatusModal(false);
    setSelectedApplication(null);

    showNotification(`Application status updated to ${newStatus}`, "success");
  };

  const confirmDelete = (type, id, name) => {
    setConfirmAction({
      title: `Delete ${type === "holiday" ? "Holiday" : "Application"}`,
      message: `Are you sure you want to delete "${name}"?`,
      onConfirm: () => performDelete(type, id),
      onCancel: () => setShowConfirmModal(false),
    });
    setShowConfirmModal(true);
    setOpenDropdown(null);
  };

  const performDelete = (type, id) => {
    if (type === "holiday") {
      dispatch({ type: "DELETE_HOLIDAY", payload: id });
      showNotification("Holiday deleted successfully", "success");
    } else {
      dispatch({
        type: "SET_APPLICATIONS",
        payload: optionalApplications.filter((a) => a.id !== id),
      });
      showNotification("Application deleted successfully", "success");
    }
    setShowConfirmModal(false);
  };

  // Approve/Reject swap request
  const handleSwapApproval = (swapId, approved) => {
    const swap = swapRequests.find((s) => s.id === swapId);
    if (!swap) return;

    const updatedSwap = {
      ...swap,
      status: approved ? "approved" : "rejected",
      [approved ? "approvedAt" : "rejectedAt"]: new Date().toISOString(),
      [approved ? "approvedBy" : "rejectedBy"]: "Manager",
    };

    dispatch({ type: "UPDATE_SWAP_REQUEST", payload: updatedSwap });
    showNotification(
      `Swap request ${approved ? "approved" : "rejected"}`,
      "success"
    );
  };

  // -------------------------------
  // EXPORT & PRINT FUNCTIONS
  // -------------------------------
  const exportToCSV = () => {
    const data =
      activeTab === "holidayMaster" ? filteredHolidays : filteredApplications;
    const headers =
      activeTab === "holidayMaster"
        ? ["Holiday Name", "Date", "Category", "Type", "Location"]
        : ["Holiday", "Date", "Applied On", "Status", "Reason"];

    const csvData = data.map((item) => {
      if (activeTab === "holidayMaster") {
        return [
          item.name,
          item.date,
          item.category,
          item.optional ? "Optional" : "Mandatory",
          item.location || "India",
        ];
      } else {
        return [
          item.name,
          item.date,
          item.appliedDate || "",
          item.status,
          item.reason || "",
        ];
      }
    });

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `holiday-calendar-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification(`Data exported successfully!`, "success");
  };

  const printData = () => {
    const data =
      activeTab === "holidayMaster" ? filteredHolidays : filteredApplications;
    const title =
      activeTab === "holidayMaster" ? "Holidays List" : "Optional Applications";

    const printContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .badge-success { background-color: #d4edda; color: #155724; }
            .badge-warning { background-color: #fff3cd; color: #856404; }
            .badge-danger { background-color: #f8d7da; color: #721c24; }
            .badge-info { background-color: #d1ecf1; color: #0c5460; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              ${
                activeTab === "holidayMaster"
                  ? "<tr><th>Holiday Name</th><th>Date</th><th>Category</th><th>Type</th><th>Location</th></tr>"
                  : "<tr><th>Holiday</th><th>Date</th><th>Applied On</th><th>Status</th><th>Reason</th></tr>"
              }
            </thead>
            <tbody>
              ${data
                .map(
                  (item) => `
                <tr>
                  ${
                    activeTab === "holidayMaster"
                      ? `<td>${item.name}</td>
                       <td>${item.date}</td>
                       <td><span class="badge badge-info">${
                         item.category
                       }</span></td>
                       <td><span class="badge ${
                         item.optional ? "badge-success" : ""
                       }">${
                          item.optional ? "Optional" : "Mandatory"
                        }</span></td>
                       <td>${item.location || "India"}</td>`
                      : `<td>${item.name}</td>
                       <td>${item.date}</td>
                       <td>${item.appliedDate || ""}</td>
                       <td><span class="badge ${
                         item.status === "Approved"
                           ? "badge-success"
                           : item.status === "Rejected"
                           ? "badge-danger"
                           : "badge-warning"
                       }">${item.status}</span></td>
                       <td>${item.reason || "-"}</td>`
                  }
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // -------------------------------
  // CALENDAR RENDERING (From reference code)
  // -------------------------------
  const renderCalendar = () => {
    let calendarCells = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      calendarCells.push(
        <div
          key={`empty-${i}`}
          className="text-center p-2"
          style={{ opacity: 0.3 }}
        >
          {""}
        </div>
      );
    }

    // Add cells for each day of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const holiday = isHoliday(d);

      calendarCells.push(
        <div
          key={d}
          className={`text-center p-2 rounded ${
            isToday(d) ? "bg-primary text-white" : ""
          } ${holiday ? "text-danger fw-bold" : ""} ${
            selectedDate === d ? "border border-primary" : ""
          }`}
          onClick={() => setSelectedDate(d)}
          style={{
            cursor: "pointer",
            aspectRatio: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {d}
        </div>
      );
    }

    // Add empty cells to complete the last row (if needed)
    const totalCells = calendarCells.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42 cells max
    for (let i = 0; i < remainingCells; i++) {
      calendarCells.push(
        <div
          key={`empty-end-${i}`}
          className="text-center p-2"
          style={{ opacity: 0.3 }}
        >
          {""}
        </div>
      );
    }

    return calendarCells;
  };

  // -------------------------------
  // RENDER UI
  // -------------------------------
  return (
    <div className="container-fluid py-3 py-md-4">
      {/* NOTIFICATION */}
      {notification.show && (
        <div
          className={`alert alert-${notification.type} alert-dismissible fade show position-fixed top-0 end-0 m-2 m-md-3`}
          style={{ zIndex: 1060, minWidth: "280px", maxWidth: "90vw" }}
          role="alert"
        >
          <div className="d-flex align-items-center">
            {notification.type === "success" && (
              <CheckCircle size={16} className="me-2" />
            )}
            {notification.type === "warning" && (
              <AlertCircle size={16} className="me-2" />
            )}
            {notification.type === "danger" && (
              <XCircle size={16} className="me-2" />
            )}
            <span style={{ fontSize: "0.9rem" }}>{notification.message}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setNotification({ ...notification, show: false })}
          ></button>
        </div>
      )}

      {/* PAGE HEADER - WITH LARGE ICON AND TITLE */}
      <div className="row mb-4">
        <div className="col-12">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Calendar Icon Container */}
            <div
              style={{
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Calendar size={28} style={{ color: "#1e293b" }} />
            </div>

            {/* Title and Description */}
            <div>
              <h7
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "4px",
                }}
              >
                Holiday Calendar
              </h7>
              <div style={{ fontSize: "14px", color: "#64748b" }}>
                Manage holidays, applications, swap requests and calendars
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW TOGGLE & SEARCH BAR - FIXED SECTION */}
      <div className="card border shadow-none mb-3 mb-md-4">
        <div className="card-body p-2 p-md-3">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 gap-sm-3">
            {/* View Toggle */}
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-sm ${
                  viewMode === "month" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("month")}
              >
                <Grid size={14} className="me-sm-1" />
                <span className="d-none d-sm-inline">Calendar</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  viewMode === "list" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List size={14} className="me-sm-1" />
                <span className="d-none d-sm-inline">List</span>
              </button>
            </div>

            {/* Search and Filters - Main content area */}
            <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center flex-grow-1 gap-2">
              {/* Search Input */}
              <div className="flex-grow-1 min-width-0">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <Search size={14} />
                  </span>
                  <input
                    className="form-control border-start-0"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
              </div>

              {/* Filters and Actions - Now properly aligned */}
              <div className="d-flex flex-wrap gap-2 align-items-center">
                {activeTab === "holidayMaster" ? (
                  <>
                    {/* Mobile: Stacked, Desktop: Inline */}
                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <select
                        className="form-select form-select-sm"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{
                          fontSize: "0.9rem",
                          minWidth: "140px",
                        }}
                      >
                        <option value="All">All Categories</option>
                        <option value="Public Holiday">Public Holiday</option>
                        <option value="National Holiday">
                          National Holiday
                        </option>
                        <option value="Festival">Festival</option>
                        <option value="State Holiday">State Holiday</option>
                        <option value="Regional Holiday">
                          Regional Holiday
                        </option>
                        <option value="Local Holiday">Local Holiday</option>
                        <option value="Company Holiday">Company Holiday</option>
                        <option value="Restricted Holiday">
                          Restricted Holiday
                        </option>
                      </select>

                      <select
                        className="form-select form-select-sm"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        style={{
                          fontSize: "0.9rem",
                          minWidth: "120px",
                        }}
                      >
                        <option value="All">All Types</option>
                        <option value="mandatory">Mandatory</option>
                        <option value="optional">Optional</option>
                      </select>
                    </div>
                  </>
                ) : activeTab === "optionalApplications" && (
                  <select
                    className="form-select form-select-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      fontSize: "0.9rem",
                      minWidth: "120px",
                    }}
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                )}

                {/* Export & Print Buttons - Always in same line */}
                <div className="d-flex gap-2">
                  {/* Mobile: Icon-only */}
                  <div className="d-sm-none d-flex gap-1">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={exportToCSV}
                      title="Export to CSV"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={printData}
                      title="Print"
                    >
                      <Printer size={14} />
                    </button>
                  </div>

                  {/* Desktop: Full buttons */}
                  <div className="d-none d-sm-flex gap-2">
                    <button
                      className="btn btn-success btn-sm d-flex align-items-center"
                      onClick={exportToCSV}
                      title="Export to CSV"
                      style={{ minWidth: "80px" }}
                    >
                      <Download size={14} className="me-1 me-md-2" />
                      <span className="d-none d-md-inline">Export</span>
                    </button>
                    <button
                      className="btn btn-dark btn-sm d-flex align-items-center"
                      onClick={printData}
                      title="Print"
                      style={{ minWidth: "80px" }}
                    >
                      <Printer size={14} className="me-1 me-md-2" />
                      <span className="d-none d-md-inline">Print</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {viewMode === "month" ? (
        <div className="row g-3">
          {/* CALENDAR COLUMN - Using reference code layout */}
          <div className="col-xl-3 col-lg-4 col-md-6 col-12">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                {/* Calendar Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={prevMonth}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <h5 className="fw-bold mb-0 text-center">
                    {monthName} {currentYear}
                  </h5>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={nextMonth}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Days of Week Header */}
                <div className="row mb-2">
                  {daysShort.map((d) => (
                    <div
                      key={d}
                      className="col text-center fw-bold small text-muted"
                      style={{ padding: "4px 0" }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid - 6 rows × 7 columns */}
                {(() => {
                  const totalCells = 42; // 6 rows × 7 days
                  let allCells = [];

                  // Create array with empty cells + date cells + trailing empty cells
                  for (let i = 0; i < totalCells; i++) {
                    if (i < startDay || i >= startDay + daysInMonth) {
                      // Empty cell (before or after month)
                      allCells.push(null);
                    } else {
                      // Date cell
                      const dateNum = i - startDay + 1;
                      allCells.push(dateNum);
                    }
                  }

                  // Split into 6 rows (weeks) with 7 columns (days) each
                  const weeks = [];
                  for (let week = 0; week < 6; week++) {
                    const weekCells = allCells.slice(week * 7, (week + 1) * 7);

                    weeks.push(
                      <div key={`week-${week}`} className="row g-1">
                        {weekCells.map((dateNum, dayIndex) => {
                          const dayOfWeek = daysShort[dayIndex];

                          if (dateNum === null) {
                            return (
                              <div
                                key={`${week}-${dayIndex}`}
                                className="col p-0"
                              >
                                <div
                                  className="text-center p-2"
                                  style={{ opacity: 0.3 }}
                                >
                                  {/* Empty cell */}
                                </div>
                              </div>
                            );
                          }

                          const holiday = isHoliday(dateNum);
                          return (
                            <div key={dateNum} className="col p-0">
                              <div
                                className={`text-center p-2 rounded ${
                                  isToday(dateNum)
                                    ? "bg-primary text-white"
                                    : ""
                                } ${holiday ? "text-danger fw-bold" : ""} ${
                                  selectedDate === dateNum
                                    ? "border border-primary"
                                    : ""
                                }`}
                                onClick={() => setSelectedDate(dateNum)}
                                style={{
                                  cursor: "pointer",
                                  aspectRatio: "1",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                data-weekday={dayOfWeek}
                              >
                                {dateNum}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  return <div>{weeks}</div>;
                })()}

                {/* Selected Date Info */}
                {selectedDate && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    <h6 className="fw-bold mb-2">Selected Date:</h6>
                    <p className="mb-1">
                      {monthName} {selectedDate}, {currentYear}
                    </p>
                    {(() => {
                      const dateKey = `${currentYear}-${String(
                        currentMonth + 1
                      ).padStart(2, "0")}-${String(selectedDate).padStart(
                        2,
                        "0"
                      )}`;
                      return holidayMap[dateKey] ? (
                        <div className="alert alert-danger p-2 mb-0">
                          <strong>{holidayMap[dateKey].name}</strong>
                          <div className="small">
                            {holidayMap[dateKey].category}
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-secondary p-2 mb-0">
                          No Holiday
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DATA COLUMN */}
          <div className="col-12 col-lg-7 col-xl-8">
            {/* TAB SWITCHER */}
            <div className="card border shadow-none mb-3">
              <div className="card-body p-1 p-md-2">
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className={`btn flex-grow-1 d-flex align-items-center justify-content-center ${
                      activeTab === "holidayMaster"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setActiveTab("holidayMaster")}
                    style={{
                      padding: isMobileView ? "0.5rem" : "0.75rem",
                      fontSize: isMobileView ? "0.8rem" : "0.9rem",
                    }}
                  >
                    <Calendar
                      size={isMobileView ? 14 : 18}
                      className="me-1 me-md-2"
                    />
                    <div className="text-start">
                      <div className="fw-bold">Holiday Master</div>
                      <div className="small">
                        {stats.totalHolidays} Holidays
                      </div>
                    </div>
                  </button>
                  <button
                    className={`btn flex-grow-1 d-flex align-items-center justify-content-center ${
                      activeTab === "optionalApplications"
                        ? "btn-success"
                        : "btn-outline-success"
                    }`}
                    onClick={() => setActiveTab("optionalApplications")}
                    style={{
                      padding: isMobileView ? "0.5rem" : "0.75rem",
                      fontSize: isMobileView ? "0.8rem" : "0.9rem",
                    }}
                  >
                    <CheckSquare
                      size={isMobileView ? 14 : 18}
                      className="me-1 me-md-2"
                    />
                    <div className="text-start">
                      <div className="fw-bold">Optional Apps</div>
                      <div className="small">
                        {stats.totalApplications} Apps
                      </div>
                    </div>
                  </button>
                  <button
                    className={`btn flex-grow-1 d-flex align-items-center justify-content-center ${
                      activeTab === "calendars"
                        ? "btn-info"
                        : "btn-outline-info"
                    }`}
                    onClick={() => setActiveTab("calendars")}
                    style={{
                      padding: isMobileView ? "0.5rem" : "0.75rem",
                      fontSize: isMobileView ? "0.8rem" : "0.9rem",
                    }}
                  >
                    <Building
                      size={isMobileView ? 14 : 18}
                      className="me-1 me-md-2"
                    />
                    <div className="text-start">
                      <div className="fw-bold">Calendars</div>
                      <div className="small">{calendars.length} Calendars</div>
                    </div>
                  </button>
                  <button
                    className={`btn flex-grow-1 d-flex align-items-center justify-content-center ${
                      activeTab === "swap"
                        ? "btn-warning"
                        : "btn-outline-warning"
                    }`}
                    onClick={() => setActiveTab("swap")}
                    style={{
                      padding: isMobileView ? "0.5rem" : "0.75rem",
                      fontSize: isMobileView ? "0.8rem" : "0.9rem",
                    }}
                  >
                    <ArrowLeftRight
                      size={isMobileView ? 14 : 18}
                      className="me-1 me-md-2"
                    />
                    <div className="text-start">
                      <div className="fw-bold">Holiday Swap</div>
                      <div className="small">
                        {swapRequests.length} Requests
                      </div>
                    </div>
                  </button>
                  <button
                    className={`btn flex-grow-1 d-flex align-items-center justify-content-center ${
                      activeTab === "carryForward"
                        ? "btn-secondary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setActiveTab("carryForward")}
                    style={{
                      padding: isMobileView ? "0.5rem" : "0.75rem",
                      fontSize: isMobileView ? "0.8rem" : "0.9rem",
                    }}
                  >
                    <RefreshCw
                      size={isMobileView ? 14 : 18}
                      className="me-1 me-md-2"
                    />
                    <div className="text-start">
                      <div className="fw-bold">Carry Forward</div>
                      <div className="small">{carryForward.length} Records</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* TAB CONTENT */}
            {activeTab === "calendars" ? (
              <div className="card border shadow-none">
                <div className="card-header bg-white border-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-2 py-md-3">
                  <h5 className="fw-bold mb-2 mb-md-0 d-flex align-items-center">
                    <Building
                      size={isMobileView ? 16 : 18}
                      className="me-2 text-info"
                    />
                    Holiday Calendars
                  </h5>
                  <button
                    className="btn btn-info btn-sm d-flex align-items-center"
                    onClick={() => {
                      setIsEditCalendar(false); // ✅ RESET EDIT MODE
                      setEditingCalendarId(null); // ✅ CLEAR ID
                      setCalendarForm({
                        name: "",
                        location: "",
                        employeeGroups: [],
                        isDefault: false,
                      });
                      setShowCalendarModal(true);
                    }}
                  >
                    <Plus size={isMobileView ? 12 : 16} className="me-1" />
                    {!isMobileView && "Add Calendar"}
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Calendar Name</th>
                          <th>Location</th>
                          <th>Employee Groups</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calendars.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              <p className="text-muted">
                                No calendars configured
                              </p>
                            </td>
                          </tr>
                        ) : (
                          calendars.map((cal) => (
                            <tr key={cal.id}>
                              <td>
                                <div className="fw-medium">{cal.name}</div>
                                {cal.isDefault && (
                                  <small className="badge bg-primary">
                                    Default
                                  </small>
                                )}
                              </td>
                              <td>{cal.location}</td>
                              <td>
                                <small>
                                  {cal.employeeGroups.includes("all")
                                    ? "All Groups"
                                    : cal.employeeGroups.join(", ")}
                                </small>
                              </td>
                              <td>
                                <span className="badge bg-success">Active</span>
                              </td>
                              <td>
                                <div className="d-flex gap-1 justify-content-center">
                                  {/* Edit */}
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => openEditCalendarModal(cal)}
                                    title="Edit Calendar"
                                  >
                                    <Edit size={14} />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    title="Delete Calendar"
                                    onClick={() =>
                                      setConfirmAction({
                                        title: "Delete Holiday Calendar",
                                        message: `Are you sure you want to delete "${cal.name}"?`,
                                        onConfirm: () => {
                                          dispatch({
                                            type: "SET_CALENDARS",
                                            payload: calendars.filter(
                                              (c) => c.id !== cal.id
                                            ),
                                          });
                                          setShowConfirmModal(false);
                                          showNotification(
                                            "Calendar deleted successfully!",
                                            "success"
                                          );
                                        },
                                        onCancel: () =>
                                          setShowConfirmModal(false),
                                      }) || setShowConfirmModal(true)
                                    }
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
            ) : activeTab === "swap" ? (
              <div className="card border shadow-none">
                <div className="card-header bg-white border-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-2 py-md-3">
                  <h5 className="fw-bold mb-2 mb-md-0 d-flex align-items-center">
                    <ArrowLeftRight
                      size={isMobileView ? 16 : 18}
                      className="me-2 text-warning"
                    />
                    Holiday Swap Requests
                  </h5>
                  <button
                    className="btn btn-warning btn-sm d-flex align-items-center"
                    onClick={() => setShowSwapModal(true)}
                  >
                    <Plus size={isMobileView ? 12 : 16} className="me-1" />
                    {!isMobileView && "New Swap Request"}
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Employee</th>
                          <th>Holiday Date</th>
                          <th>Work Date</th>
                          <th>Reason</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {swapRequests.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              <p className="text-muted">No swap requests</p>
                            </td>
                          </tr>
                        ) : (
                          swapRequests.map((swap) => {
                            const employee = initialEmployees.find(
                              (e) => e.id === swap.employeeId
                            );
                            return (
                              <tr key={swap.id}>
                                <td>{employee?.name || swap.employeeId}</td>
                                <td>{swap.holidayDate}</td>
                                <td>{swap.workDate}</td>
                                <td>
                                  <small>{swap.reason}</small>
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      swap.status === "approved"
                                        ? "success"
                                        : swap.status === "rejected"
                                        ? "danger"
                                        : "warning"
                                    }`}
                                  >
                                    {swap.status}
                                  </span>
                                </td>
                                <td>
                                  {swap.status === "pending" && (
                                    <div className="d-flex gap-1">
                                      <button
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() =>
                                          handleSwapApproval(swap.id, true)
                                        }
                                      >
                                        <CheckCircle size={14} />
                                      </button>
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                          handleSwapApproval(swap.id, false)
                                        }
                                      >
                                        <XCircle size={14} />
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
            ) : activeTab === "carryForward" ? (
              <div className="card border shadow-none">
                <div className="card-header bg-white border-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-2 py-md-3">
                  <h5 className="fw-bold mb-2 mb-md-0 d-flex align-items-center">
                    <RefreshCw
                      size={isMobileView ? 16 : 18}
                      className="me-2 text-secondary"
                    />
                    Holiday Carry Forward
                  </h5>
                  <button
                    className="btn btn-secondary btn-sm d-flex align-items-center"
                    onClick={() => setShowCarryForwardModal(true)}
                  >
                    <Plus size={isMobileView ? 12 : 16} className="me-1" />
                    {!isMobileView && "Process Carry Forward"}
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Employee</th>
                          <th>From Year</th>
                          <th>To Year</th>
                          <th>Holidays</th>
                          <th>Status</th>
                          <th>Processed By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {carryForward.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              <p className="text-muted">
                                No carry forward records
                              </p>
                            </td>
                          </tr>
                        ) : (
                          carryForward.map((cf) => {
                            const employee = initialEmployees.find(
                              (e) => e.id === cf.employeeId
                            );
                            return (
                              <tr key={cf.id}>
                                <td>{employee?.name || cf.employeeId}</td>
                                <td>{cf.fromYear}</td>
                                <td>{cf.toYear}</td>
                                <td>{cf.holidays.length} holidays</td>
                                <td>
                                  <span className="badge bg-success">
                                    {cf.status}
                                  </span>
                                </td>
                                <td>{cf.processedBy}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : activeTab === "holidayMaster" ? (
              <div className="card border shadow-none">
                <div className="card-header bg-white border-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-2 py-md-3">
                  <h5
                    className="fw-bold mb-2 mb-md-0 d-flex align-items-center"
                    style={{ fontSize: isMobileView ? "0.9rem" : "1rem" }}
                  >
                    <Calendar
                      size={isMobileView ? 16 : 18}
                      className="me-2 text-primary"
                    />
                    Holiday Master
                  </h5>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm d-flex align-items-center"
                      onClick={() => setShowHolidayModal(true)}
                      style={{ fontSize: isMobileView ? "0.75rem" : "0.85rem" }}
                    >
                      <Plus size={isMobileView ? 12 : 16} className="me-1" />
                      {!isMobileView && "Add Holiday"}
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div
                    className="table-responsive"
                    style={{ maxHeight: isMobileView ? "300px" : "400px" }}
                  >
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th
                            style={{
                              fontSize: isMobileView ? "0.75rem" : "0.85rem",
                            }}
                          >
                            HOLIDAY NAME
                          </th>
                          <th
                            style={{
                              fontSize: isMobileView ? "0.75rem" : "0.85rem",
                            }}
                          >
                            DATE
                          </th>
                          {!isMobileView && (
                            <th
                              style={{
                                fontSize: isMobileView ? "0.75rem" : "0.85rem",
                              }}
                            >
                              CATEGORY
                            </th>
                          )}
                          {!isMobileView && (
                            <th
                              style={{
                                fontSize: isMobileView ? "0.75rem" : "0.85rem",
                              }}
                            >
                              HOLIDAY TYPE
                            </th>
                          )}
                          <th
                            style={{
                              fontSize: isMobileView ? "0.75rem" : "0.85rem",
                            }}
                          >
                            TYPE
                          </th>
                          {!isMobileView && (
                            <th
                              style={{
                                fontSize: isMobileView ? "0.75rem" : "0.85rem",
                              }}
                            >
                              LOCATION
                            </th>
                          )}
                          <th
                            style={{
                              fontSize: isMobileView ? "0.75rem" : "0.85rem",
                            }}
                          >
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHolidays.length === 0 ? (
                          <tr>
                            <td
                              colSpan={isMobileView ? 4 : 6}
                              className="text-center text-muted py-4"
                            >
                              <Calendar
                                size={isMobileView ? 24 : 32}
                                className="mb-2 opacity-50"
                              />
                              <div
                                style={{
                                  fontSize: isMobileView ? "0.85rem" : "0.9rem",
                                }}
                              >
                                {searchTerm
                                  ? "No matching holidays found"
                                  : "No holidays added yet"}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredHolidays.map((h) => (
                            <tr key={h.id}>
                              <td
                                className="fw-medium"
                                style={{
                                  fontSize: isMobileView ? "0.8rem" : "0.9rem",
                                }}
                              >
                                {isMobileView && h.name.length > 15
                                  ? `${h.name.substring(0, 15)}...`
                                  : h.name}
                                {!isMobileView && h.name}
                              </td>
                              <td
                                className="text-danger fw-bold"
                                style={{
                                  fontSize: isMobileView ? "0.8rem" : "0.9rem",
                                }}
                              >
                                {h.date}
                              </td>
                              {!isMobileView && (
                                <td>
                                  <span
                                    className="badge bg-info"
                                    style={{
                                      fontSize: isMobileView
                                        ? "0.7rem"
                                        : "0.75rem",
                                    }}
                                  >
                                    {h.category}
                                  </span>
                                </td>
                              )}
                              {!isMobileView && (
                                <td>
                                  <span
                                    className={`badge ${
                                      h.holidayType === "gazetted"
                                        ? "bg-primary"
                                        : h.holidayType === "restricted"
                                        ? "bg-warning"
                                        : "bg-success"
                                    }`}
                                    style={{
                                      fontSize: isMobileView
                                        ? "0.7rem"
                                        : "0.75rem",
                                    }}
                                  >
                                    {h.holidayType || "gazetted"}
                                  </span>
                                </td>
                              )}
                              <td className="text-center">
                                {h.optional ? (
                                  <span
                                    className="badge bg-success d-flex align-items-center justify-content-center"
                                    style={{
                                      fontSize: isMobileView
                                        ? "0.7rem"
                                        : "0.75rem",
                                    }}
                                  >
                                    {!isMobileView && (
                                      <CheckSquare size={10} className="me-1" />
                                    )}
                                    Optional
                                  </span>
                                ) : (
                                  <span
                                    className="badge bg-secondary"
                                    style={{
                                      fontSize: isMobileView
                                        ? "0.7rem"
                                        : "0.75rem",
                                    }}
                                  >
                                    Mandatory
                                  </span>
                                )}
                              </td>
                              {!isMobileView && (
                                <td>
                                  <small className="text-muted">
                                    {h.location || "India"}
                                  </small>
                                </td>
                              )}
                              <td className="text-center">
                                <div className="d-flex gap-1 justify-content-center">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-icon btn-light"
                                    onClick={() => openEditModal(h)}
                                    title="Edit"
                                    style={{
                                      padding: isMobileView
                                        ? "0.25rem"
                                        : "0.375rem",
                                    }}
                                  >
                                    <Edit size={isMobileView ? 12 : 16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-icon btn-light text-danger"
                                    onClick={() =>
                                      confirmDelete("holiday", h.id, h.name)
                                    }
                                    title="Delete"
                                    style={{
                                      padding: isMobileView
                                        ? "0.25rem"
                                        : "0.375rem",
                                    }}
                                  >
                                    <Trash2 size={isMobileView ? 12 : 16} />
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
            ) : (
              <div className="card border shadow-none">
                <div className="card-header bg-white border-bottom d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-2 py-md-3">
                  <h5
                    className="fw-bold mb-2 mb-md-0 d-flex align-items-center"
                    style={{ fontSize: isMobileView ? "0.9rem" : "1rem" }}
                  >
                    <CheckSquare
                      size={isMobileView ? 16 : 18}
                      className="me-2 text-success"
                    />
                    Optional Applications
                  </h5>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm d-flex align-items-center"
                      onClick={() => {
                        if (stats.optionalHolidays === 0) {
                          showNotification(
                            "No optional holidays available. Add optional holidays first.",
                            "warning"
                          );
                          return;
                        }
                        setShowOptionalModal(true);
                      }}
                      style={{ fontSize: isMobileView ? "0.75rem" : "0.85rem" }}
                    >
                      <Plus size={isMobileView ? 12 : 16} className="me-1" />
                      {!isMobileView && "Apply Holiday"}
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div
                    className="table-responsive"
                    style={{ maxHeight: isMobileView ? "300px" : "400px" }}
                  >
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th
                            style={{
                              fontSize: isMobileView ? "0.75rem" : "0.85rem",
                            }}
                          >
                            HOLIDAY
                          </th>
                          <th
                            style={{
                              fontSize: isMobileView ? "0.75rem" : "0.85rem",
                            }}
                          >
                            DATE
                          </th>
                          {!isMobileView && (
                            <th
                              style={{
                                fontSize: isMobileView ? "0.75rem" : "0.85rem",
                              }}
                            >
                              APPLIED ON
                            </th>
                          )}
                          <th
                            style={{
                              fontSize: isMobileView ? "0.75rem" : "0.85rem",
                            }}
                          >
                            STATUS
                          </th>
                          {!isMobileView && (
                            <th
                              style={{
                                fontSize: isMobileView ? "0.75rem" : "0.85rem",
                              }}
                            >
                              REASON
                            </th>
                          )}
                          <th
                            style={{
                              fontSize: isMobileView ? "0.75rem" : "0.85rem",
                            }}
                          >
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.length === 0 ? (
                          <tr>
                            <td
                              colSpan={isMobileView ? 4 : 6}
                              className="text-center text-muted py-4"
                            >
                              <CheckSquare
                                size={isMobileView ? 24 : 32}
                                className="mb-2 opacity-50"
                              />
                              <div
                                style={{
                                  fontSize: isMobileView ? "0.85rem" : "0.9rem",
                                }}
                              >
                                {searchTerm
                                  ? "No matching applications found"
                                  : "No applications submitted yet"}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredApplications.map((app) => (
                            <tr key={app.id}>
                              <td
                                className="fw-medium"
                                style={{
                                  fontSize: isMobileView ? "0.8rem" : "0.9rem",
                                }}
                              >
                                {isMobileView && app.name.length > 15
                                  ? `${app.name.substring(0, 15)}...`
                                  : app.name}
                                {!isMobileView && app.name}
                              </td>
                              <td
                                style={{
                                  fontSize: isMobileView ? "0.8rem" : "0.9rem",
                                }}
                              >
                                {app.date}
                              </td>
                              {!isMobileView && (
                                <td
                                  className="text-center"
                                  style={{
                                    fontSize: isMobileView
                                      ? "0.8rem"
                                      : "0.9rem",
                                  }}
                                >
                                  {app.appliedDate || ""}
                                </td>
                              )}
                              <td className="text-center">
                                <span
                                  className={`badge d-flex align-items-center justify-content-center ${
                                    app.status === "Approved"
                                      ? "bg-success"
                                      : app.status === "Rejected"
                                      ? "bg-danger"
                                      : "bg-warning"
                                  }`}
                                  style={{
                                    fontSize: isMobileView
                                      ? "0.7rem"
                                      : "0.75rem",
                                  }}
                                >
                                  {!isMobileView && (
                                    <>
                                      {app.status === "Approved" && (
                                        <CheckCircle
                                          size={10}
                                          className="me-1"
                                        />
                                      )}
                                      {app.status === "Rejected" && (
                                        <XCircle size={10} className="me-1" />
                                      )}
                                      {app.status === "Pending" && (
                                        <Clock size={10} className="me-1" />
                                      )}
                                    </>
                                  )}
                                  {app.status}
                                </span>
                              </td>
                              {!isMobileView && (
                                <td className="text-center">
                                  <small className="text-muted">
                                    {app.reason || "-"}
                                  </small>
                                </td>
                              )}
                              <td className="text-center">
                                <div className="d-flex gap-1 justify-content-center">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-icon btn-light"
                                    onClick={() => openStatusModal(app)}
                                    title="Update Status"
                                    style={{
                                      padding: isMobileView
                                        ? "0.25rem"
                                        : "0.375rem",
                                    }}
                                  >
                                    <Settings size={isMobileView ? 12 : 16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-icon btn-light text-danger"
                                    onClick={() =>
                                      confirmDelete(
                                        "application",
                                        app.id,
                                        app.name
                                      )
                                    }
                                    title="Delete"
                                    style={{
                                      padding: isMobileView
                                        ? "0.25rem"
                                        : "0.375rem",
                                    }}
                                  >
                                    <Trash2 size={isMobileView ? 12 : 16} />
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
            )}

            {/* QUICK ACTIONS */}
            <div className="card border shadow-none mt-3">
              <div className="card-body">
                <h6
                  className="fw-bold mb-3 d-flex align-items-center"
                  style={{ fontSize: isMobileView ? "0.85rem" : "0.95rem" }}
                >
                  <AlertCircle
                    size={isMobileView ? 14 : 18}
                    className="me-2 text-primary"
                  />
                  Quick Actions
                </h6>
                <div className="row g-2">
                  <div className="col-4">
                    <button
                      className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                      onClick={() => setShowHolidayModal(true)}
                      style={{
                        fontSize: isMobileView ? "0.75rem" : "0.85rem",
                        padding: isMobileView ? "0.375rem" : "0.5rem",
                      }}
                    >
                      <Plus size={isMobileView ? 12 : 16} className="me-1" />
                      Add
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center"
                      onClick={() => {
                        if (stats.optionalHolidays === 0) {
                          showNotification(
                            "No optional holidays available",
                            "warning"
                          );
                          return;
                        }
                        setShowOptionalModal(true);
                      }}
                      style={{
                        fontSize: isMobileView ? "0.75rem" : "0.85rem",
                        padding: isMobileView ? "0.375rem" : "0.5rem",
                      }}
                    >
                      <CheckSquare
                        size={isMobileView ? 12 : 16}
                        className="me-1"
                      />
                      Apply
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center"
                      onClick={goToToday}
                      style={{
                        fontSize: isMobileView ? "0.75rem" : "0.85rem",
                        padding: isMobileView ? "0.375rem" : "0.5rem",
                      }}
                    >
                      <CalendarIcon
                        size={isMobileView ? 12 : 16}
                        className="me-1"
                      />
                      Today
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="card border shadow-none">
          <div className="card-body">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
              <h5
                className="fw-bold mb-2 mb-md-0"
                style={{ fontSize: isMobileView ? "0.9rem" : "1.1rem" }}
              >
                {activeTab === "holidayMaster"
                  ? "Holidays List"
                  : "Applications List"}
              </h5>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    activeTab === "holidayMaster"
                      ? setShowHolidayModal(true)
                      : setShowOptionalModal(true)
                  }
                >
                  <Plus size={14} className="me-1" />
                  {activeTab === "holidayMaster"
                    ? "Add Holiday"
                    : "Apply Holiday"}
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setViewMode("month")}
                >
                  <Grid size={14} className="me-1" />
                  Switch to Calendar
                </button>
              </div>
            </div>

            {/* List Content */}
            <div className="row g-3">
              {(activeTab === "holidayMaster"
                ? filteredHolidays
                : filteredApplications
              ).map((item) => (
                <div key={item.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card border shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6
                          className="fw-bold mb-0"
                          style={{
                            fontSize: isMobileView ? "0.85rem" : "0.9rem",
                          }}
                        >
                          {item.name}
                        </h6>
                        {activeTab === "holidayMaster" ? (
                          <span
                            className={`badge ${
                              item.optional ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            {item.optional ? "Optional" : "Mandatory"}
                          </span>
                        ) : (
                          <span
                            className={`badge ${
                              item.status === "Approved"
                                ? "bg-success"
                                : item.status === "Rejected"
                                ? "bg-danger"
                                : "bg-warning"
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                      <div className="mb-3">
                        <div className="small text-muted mb-1">
                          <Calendar size={12} className="me-1" />
                          Date: {item.date}
                        </div>
                        {activeTab === "holidayMaster" ? (
                          <>
                            <div className="small">
                              <span className="badge bg-info">
                                {item.category}
                              </span>
                            </div>
                            <div className="small text-muted mt-1">
                              Location: {item.location || "India"}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="small text-muted mb-1">
                              Applied: {item.appliedDate || "N/A"}
                            </div>
                            <div className="small text-muted">
                              Reason: {item.reason || "No reason provided"}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        {activeTab === "holidayMaster" ? (
                          <>
                            <button
                              className="btn btn-outline-primary btn-sm flex-fill"
                              onClick={() => openEditModal(item)}
                            >
                              <Edit size={12} className="me-1" />
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                confirmDelete("holiday", item.id, item.name)
                              }
                            >
                              <Trash2 size={12} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-outline-primary btn-sm flex-fill"
                              onClick={() => openStatusModal(item)}
                            >
                              <Settings size={12} className="me-1" />
                              Status
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                confirmDelete("application", item.id, item.name)
                              }
                            >
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(activeTab === "holidayMaster"
                ? filteredHolidays
                : filteredApplications
              ).length === 0 && (
                <div className="col-12">
                  <div className="text-center py-5">
                    {activeTab === "holidayMaster" ? (
                      <Calendar
                        size={48}
                        className="mb-3 text-muted opacity-50"
                      />
                    ) : (
                      <CheckSquare
                        size={48}
                        className="mb-3 text-muted opacity-50"
                      />
                    )}
                    <h6 className="text-muted">
                      {searchTerm
                        ? "No matching items found"
                        : "No items available"}
                    </h6>
                    <button
                      className="btn btn-primary btn-sm mt-3"
                      onClick={() =>
                        activeTab === "holidayMaster"
                          ? setShowHolidayModal(true)
                          : setShowOptionalModal(true)
                      }
                    >
                      <Plus size={14} className="me-1" />
                      Add{" "}
                      {activeTab === "holidayMaster"
                        ? "Holiday"
                        : "Application"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALS - Keep existing modal code but update to include location */}
      {/* Add Holiday Modal */}
      {showHolidayModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <Plus size={18} className="me-2" />
                  Add New Holiday
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowHolidayModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Holiday Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newHoliday.name}
                      onChange={(e) =>
                        setNewHoliday({ ...newHoliday, name: e.target.value })
                      }
                      placeholder="Enter holiday name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newHoliday.date}
                      onChange={(e) =>
                        setNewHoliday({ ...newHoliday, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={newHoliday.category}
                      onChange={(e) =>
                        setNewHoliday({
                          ...newHoliday,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Category</option>
                      <option>Public Holiday</option>
                      <option>National Holiday</option>
                      <option>Festival</option>
                      <option>State Holiday</option>
                      <option>Regional Holiday</option>
                      <option>Local Holiday</option>
                      <option>Company Holiday</option>
                      <option>Restricted Holiday</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Holiday Type *</label>
                    <select
                      className="form-select"
                      value={newHoliday.holidayType}
                      onChange={(e) =>
                        setNewHoliday({
                          ...newHoliday,
                          holidayType: e.target.value,
                        })
                      }
                    >
                      <option value="gazetted">Gazetted</option>
                      <option value="restricted">Restricted</option>
                      <option value="festival">Festival</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location *</label>
                    <select
                      className="form-select"
                      value={newHoliday.location}
                      onChange={(e) =>
                        setNewHoliday({
                          ...newHoliday,
                          location: e.target.value,
                        })
                      }
                    >
                      <option value="All">All Locations</option>
                      {initialLocations.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Optional Holiday?</label>
                    <select
                      className="form-select"
                      value={newHoliday.optional ? "Yes" : "No"}
                      onChange={(e) =>
                        setNewHoliday({
                          ...newHoliday,
                          optional: e.target.value === "Yes",
                        })
                      }
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  {newHoliday.optional && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">
                          Advance Booking (Days)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={newHoliday.advanceBookingDays}
                          onChange={(e) =>
                            setNewHoliday({
                              ...newHoliday,
                              advanceBookingDays: parseInt(e.target.value) || 0,
                            })
                          }
                          min="0"
                          placeholder="Days in advance"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Allow Carry Forward?
                        </label>
                        <select
                          className="form-select"
                          value={newHoliday.allowCarryForward ? "Yes" : "No"}
                          onChange={(e) =>
                            setNewHoliday({
                              ...newHoliday,
                              allowCarryForward: e.target.value === "Yes",
                            })
                          }
                        >
                          <option>No</option>
                          <option>Yes</option>
                        </select>
                      </div>
                      {newHoliday.allowCarryForward && (
                        <div className="col-md-6">
                          <label className="form-label">
                            Carry Forward Limit (days)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={newHoliday.carryForwardLimit}
                            onChange={(e) =>
                              setNewHoliday({
                                ...newHoliday,
                                carryForwardLimit:
                                  parseInt(e.target.value) || 0,
                              })
                            }
                            min="0"
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="col-md-6">
                    <label className="form-label">
                      Applicable Employee Group
                    </label>
                    <select
                      className="form-select"
                      value={newHoliday.applicableGroups[0] || "all"}
                      onChange={(e) =>
                        setNewHoliday({
                          ...newHoliday,
                          applicableGroups: [e.target.value],
                        })
                      }
                    >
                      <option value="all">All Groups</option>
                      {initialEmployeeGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">
                      Holiday will apply to the selected employee group
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowHolidayModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={saveHoliday}
                >
                  <CheckCircle size={16} className="me-1" />
                  Save Holiday
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Holiday Modal */}
      {showEditHolidayModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <Edit size={18} className="me-2" />
                  Edit Holiday
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditHolidayModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Holiday Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editHoliday.name}
                      onChange={(e) =>
                        setEditHoliday({ ...editHoliday, name: e.target.value })
                      }
                      placeholder="Enter holiday name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editHoliday.date}
                      onChange={(e) =>
                        setEditHoliday({ ...editHoliday, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={editHoliday.category}
                      onChange={(e) =>
                        setEditHoliday({
                          ...editHoliday,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Category</option>
                      <option>Public Holiday</option>
                      <option>National Holiday</option>
                      <option>Festival</option>
                      <option>State Holiday</option>
                      <option>Regional Holiday</option>
                      <option>Local Holiday</option>
                      <option>Company Holiday</option>
                      <option>Restricted Holiday</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Holiday Type *</label>
                    <select
                      className="form-select"
                      value={editHoliday.holidayType}
                      onChange={(e) =>
                        setEditHoliday({
                          ...editHoliday,
                          holidayType: e.target.value,
                        })
                      }
                    >
                      <option value="gazetted">Gazetted</option>
                      <option value="restricted">Restricted</option>
                      <option value="festival">Festival</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location *</label>
                    <select
                      className="form-select"
                      value={editHoliday.location}
                      onChange={(e) =>
                        setEditHoliday({
                          ...editHoliday,
                          location: e.target.value,
                        })
                      }
                    >
                      <option value="All">All Locations</option>
                      {initialLocations.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Optional Holiday?</label>
                    <select
                      className="form-select"
                      value={editHoliday.optional ? "Yes" : "No"}
                      onChange={(e) =>
                        setEditHoliday({
                          ...editHoliday,
                          optional: e.target.value === "Yes",
                        })
                      }
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  {editHoliday.optional && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">
                          Advance Booking (Days)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={editHoliday.advanceBookingDays}
                          onChange={(e) =>
                            setEditHoliday({
                              ...editHoliday,
                              advanceBookingDays: parseInt(e.target.value) || 0,
                            })
                          }
                          min="0"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Allow Carry Forward?
                        </label>
                        <select
                          className="form-select"
                          value={editHoliday.allowCarryForward ? "Yes" : "No"}
                          onChange={(e) =>
                            setEditHoliday({
                              ...editHoliday,
                              allowCarryForward: e.target.value === "Yes",
                            })
                          }
                        >
                          <option>No</option>
                          <option>Yes</option>
                        </select>
                      </div>
                      {editHoliday.allowCarryForward && (
                        <div className="col-md-6">
                          <label className="form-label">
                            Carry Forward Limit (days)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={editHoliday.carryForwardLimit}
                            onChange={(e) =>
                              setEditHoliday({
                                ...editHoliday,
                                carryForwardLimit:
                                  parseInt(e.target.value) || 0,
                              })
                            }
                            min="0"
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="col-md-6">
                    <label className="form-label">
                      Applicable Employee Group
                    </label>
                    <select
                      className="form-select"
                      value={editHoliday.applicableGroups?.[0] || "all"}
                      onChange={(e) =>
                        setEditHoliday({
                          ...editHoliday,
                          applicableGroups: [e.target.value],
                        })
                      }
                    >
                      <option value="all">All Groups</option>
                      {initialEmployeeGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">
                      Holiday will apply to the selected employee group
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditHolidayModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={updateHoliday}
                >
                  <CheckCircle size={16} className="me-1" />
                  Update Holiday
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Optional Holiday Modal */}
      {showOptionalModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <CheckSquare size={18} className="me-2" />
                  Apply Optional Holiday
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowOptionalModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Select Holiday *</label>
                  <select
                    className="form-select"
                    value={selectedOptionalHoliday}
                    onChange={(e) => setSelectedOptionalHoliday(e.target.value)}
                  >
                    <option value="">Select a holiday</option>
                    {holidays
                      .filter((h) => h.optional)
                      .map((opt) => (
                        <option key={opt.id} value={opt.name}>
                          {opt.name} ({opt.date})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Reason (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={optionalReason}
                    onChange={(e) => setOptionalReason(e.target.value)}
                    placeholder="Enter reason for applying this optional holiday..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowOptionalModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success d-flex align-items-center"
                  onClick={applyOptionalHoliday}
                  disabled={!selectedOptionalHoliday}
                >
                  <CheckCircle size={16} className="me-1" />
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedApplication && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <Settings size={18} className="me-2" />
                  Update Application Status
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowStatusModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p className="mb-2">
                    <strong>Holiday:</strong> {selectedApplication.name}
                  </p>
                  <p className="mb-3">
                    <strong>Current Status:</strong>{" "}
                    <span
                      className={`badge ${
                        selectedApplication.status === "Approved"
                          ? "bg-success"
                          : selectedApplication.status === "Rejected"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {selectedApplication.status}
                    </span>
                  </p>
                  <label className="form-label mb-3">Update Status To:</label>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-warning flex-fill d-flex align-items-center justify-content-center"
                      onClick={() => updateApplicationStatus("Pending")}
                    >
                      <Clock size={16} className="me-1" />
                      Pending
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success flex-fill d-flex align-items-center justify-content-center"
                      onClick={() => updateApplicationStatus("Approved")}
                    >
                      <CheckCircle size={16} className="me-1" />
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger flex-fill d-flex align-items-center justify-content-center"
                      onClick={() => updateApplicationStatus("Rejected")}
                    >
                      <XCircle size={16} className="me-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <Trash2 size={18} className="me-2 text-danger" />
                  {confirmAction.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{confirmAction.message}</p>
                <p className="text-muted small">
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center"
                  onClick={confirmAction.onConfirm}
                >
                  <Trash2 size={16} className="me-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Management Modal */}
      {showCalendarModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditCalendar
                    ? "Edit Holiday Calendar"
                    : "Add Holiday Calendar"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCalendarModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Calendar Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={calendarForm.name}
                      onChange={(e) =>
                        setCalendarForm({
                          ...calendarForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g., Bangalore Office Calendar"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Location *</label>
                    <select
                      className="form-select"
                      value={calendarForm.location}
                      onChange={(e) =>
                        setCalendarForm({
                          ...calendarForm,
                          location: e.target.value,
                        })
                      }
                    >
                      <option value="">Select location...</option>
                      {initialLocations.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Employee Group</label>
                    <select
                      className="form-select"
                      value={calendarForm.employeeGroups?.[0] || "all"}
                      onChange={(e) =>
                        setCalendarForm({
                          ...calendarForm,
                          employeeGroups: [e.target.value],
                        })
                      }
                    >
                      <option value="all">All Groups</option>
                      {initialEmployeeGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">
                      Calendar will apply to the selected employee group
                    </small>
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={calendarForm.isDefault}
                        onChange={(e) =>
                          setCalendarForm({
                            ...calendarForm,
                            isDefault: e.target.checked,
                          })
                        }
                      />
                      <label className="form-check-label">
                        Set as Default Calendar
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCalendarModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (!calendarForm.name || !calendarForm.location) {
                      showNotification(
                        "Please fill all required fields",
                        "warning"
                      );
                      return;
                    }

                    if (isEditCalendar) {
                      dispatch({
                        type: "UPDATE_CALENDAR",
                        payload: {
                          id: editingCalendarId,
                          ...calendarForm,
                        },
                      });

                      showNotification(
                        "Calendar updated successfully!",
                        "success"
                      );
                    } else {
                      dispatch({
                        type: "ADD_CALENDAR",
                        payload: {
                          id: Date.now(),
                          ...calendarForm,
                        },
                      });

                      showNotification(
                        "Calendar added successfully!",
                        "success"
                      );
                    }

                    setShowCalendarModal(false);
                    setIsEditCalendar(false);
                    setEditingCalendarId(null);
                    setCalendarForm({
                      name: "",
                      location: "",
                      employeeGroups: [],
                      isDefault: false,
                    });
                  }}
                >
                  {isEditCalendar ? "Update Calendar" : "Save Calendar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Holiday Swap Modal */}
      {showSwapModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <ArrowLeftRight size={18} className="me-2" />
                  Holiday Swap Request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSwapModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Employee *</label>
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
                  <div className="col-md-6">
                    <label className="form-label">Holiday Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={swapForm.holidayDate}
                      onChange={(e) =>
                        setSwapForm({
                          ...swapForm,
                          holidayDate: e.target.value,
                        })
                      }
                    />
                    <small className="text-muted">Date you want to work</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Work Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={swapForm.workDate}
                      onChange={(e) =>
                        setSwapForm({ ...swapForm, workDate: e.target.value })
                      }
                    />
                    <small className="text-muted">
                      Date you want to take off
                    </small>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Reason *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={swapForm.reason}
                      onChange={(e) =>
                        setSwapForm({ ...swapForm, reason: e.target.value })
                      }
                      placeholder="Enter reason for holiday swap"
                    />
                  </div>
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
                  className="btn btn-warning"
                  onClick={handleHolidaySwap}
                >
                  Submit Swap Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carry Forward Modal */}
      {showCarryForwardModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <RefreshCw size={18} className="me-2" />
                  Process Holiday Carry Forward
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCarryForwardModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Employee *</label>
                    <select
                      className="form-select"
                      value={carryForwardForm.employeeId}
                      onChange={(e) =>
                        setCarryForwardForm({
                          ...carryForwardForm,
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
                  <div className="col-md-3">
                    <label className="form-label">From Year</label>
                    <input
                      type="number"
                      className="form-control"
                      value={carryForwardForm.fromYear}
                      onChange={(e) =>
                        setCarryForwardForm({
                          ...carryForwardForm,
                          fromYear: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">To Year</label>
                    <input
                      type="number"
                      className="form-control"
                      value={carryForwardForm.toYear}
                      onChange={(e) =>
                        setCarryForwardForm({
                          ...carryForwardForm,
                          toYear: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      Select Unused Optional Holidays
                    </label>
                    <div
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid #dee2e6",
                        borderRadius: "0.375rem",
                        padding: "0.5rem",
                      }}
                    >
                      {holidays
                        .filter((h) => h.optional && h.allowCarryForward)
                        .map((holiday) => (
                          <div key={holiday.id} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={carryForwardForm.holidays.includes(
                                holiday.id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCarryForwardForm({
                                    ...carryForwardForm,
                                    holidays: [
                                      ...carryForwardForm.holidays,
                                      holiday.id,
                                    ],
                                  });
                                } else {
                                  setCarryForwardForm({
                                    ...carryForwardForm,
                                    holidays: carryForwardForm.holidays.filter(
                                      (id) => id !== holiday.id
                                    ),
                                  });
                                }
                              }}
                            />
                            <label className="form-check-label">
                              {holiday.name} ({holiday.date})
                            </label>
                          </div>
                        ))}
                    </div>
                    {holidays.filter((h) => h.optional && h.allowCarryForward)
                      .length === 0 && (
                      <p className="text-muted mt-2">
                        No optional holidays with carry forward enabled
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCarryForwardModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCarryForward}
                >
                  Process Carry Forward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayCalendar;