import React, { useState, useEffect, useReducer } from "react";
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HolidayAddModal from "../modal/HolidayAddModal";
import HolidayEditModal from "../modal/HolidayEditModal";
import HolidayOptionalModal from "../modal/HolidayOptionalModal";
import HolidayStatusModal from "../modal/HolidayStatusModal";
import HolidayCalendarModal from "../modal/HolidayCalendarModal";
import HolidaySwapModal from "../modal/HolidaySwapModal";
import HolidayCarryForwardModal from "../modal/HolidayCarryForwardModal";
import HolidayConfirmModal from "../modal/HolidayConfirmModal";

const daysShort = ["S", "M", "T", "W", "T", "F", "S"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
    case "UPDATE_CALENDAR":
      return {
        ...state,
        calendars: state.calendars.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case "DELETE_CALENDAR":
      return {
        ...state,
        calendars: state.calendars.filter((c) => c.id !== action.payload),
      };
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
    default:
      return state;
  }
};

const HolidayCalendar = () => {
  const today = new Date();

  const loadFromStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const initialState = {
    holidays: loadFromStorage("holidays", []),
    optionalApplications: loadFromStorage("optionalApplications", []),
    calendars: loadFromStorage("holidayCalendars", []),
    swapRequests: loadFromStorage("holidaySwapRequests", []),
    carryForward: loadFromStorage("holidayCarryForward", []),
  };

  const [state, dispatch] = useReducer(holidayReducer, initialState);
  const { holidays, optionalApplications, calendars, swapRequests, carryForward } = state;

  useEffect(() => {
    localStorage.setItem("holidays", JSON.stringify(holidays));
    localStorage.setItem("optionalApplications", JSON.stringify(optionalApplications));
    localStorage.setItem("holidayCalendars", JSON.stringify(calendars));
    localStorage.setItem("holidaySwapRequests", JSON.stringify(swapRequests));
    localStorage.setItem("holidayCarryForward", JSON.stringify(carryForward));
  }, [state]);

  const [viewMode, setViewMode] = useState("month");
  const [isMobileView, setIsMobileView] = useState(false);

  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showEditHolidayModal, setShowEditHolidayModal] = useState(false);
  const [showOptionalModal, setShowOptionalModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showCarryForwardModal, setShowCarryForwardModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [newHoliday, setNewHoliday] = useState({
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

  const [calendarForm, setCalendarForm] = useState({
    name: "",
    location: "",
    employeeGroups: [],
    isDefault: false,
  });

  const [swapForm, setSwapForm] = useState({
    employeeId: "",
    holidayDate: "",
    workDate: "",
    reason: "",
  });

  const [carryForwardForm, setCarryForwardForm] = useState({
    employeeId: "",
    fromYear: new Date().getFullYear() - 1,
    toYear: new Date().getFullYear(),
    holidays: [],
  });

  const [optionalReason, setOptionalReason] = useState("");
  const [selectedOptionalHoliday, setSelectedOptionalHoliday] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editingCalendarId, setEditingCalendarId] = useState(null);
  const [isEditCalendar, setIsEditCalendar] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("holidayMaster");

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const [confirmAction, setConfirmAction] = useState({
    title: "",
    message: "",
    onConfirm: () => { },
    onCancel: () => { },
  });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) setViewMode("list");
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const stats = {
    totalHolidays: holidays.length,
    optionalHolidays: holidays.filter((h) => h.optional).length,
    totalApplications: optionalApplications.length,
    pendingApplications: optionalApplications.filter((app) => app.status === "Pending").length,
    approvedApplications: optionalApplications.filter((app) => app.status === "Approved").length,
    rejectedApplications: optionalApplications.filter((app) => app.status === "Rejected").length,
  };

  const filteredHolidays = holidays.filter((holiday) => {
    const matchesSearch =
      holiday.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || holiday.category === categoryFilter;
    const matchesType =
      typeFilter === "All" ||
      (typeFilter === "optional" && holiday.optional) ||
      (typeFilter === "mandatory" && !holiday.optional);
    return matchesSearch && matchesCategory && matchesType;
  });

  const filteredApplications = optionalApplications.filter((app) => {
    const matchesSearch =
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isToday = (d) =>
    d === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today.getDate());
  };

  const saveHoliday = () => {
    if (!newHoliday.name || !newHoliday.date || !newHoliday.category) {
      toast.warning("Please fill all required fields");
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
    toast.success("Holiday added successfully!");
  };

  const updateHoliday = () => {
    if (!editHoliday.name || !editHoliday.date || !editHoliday.category) {
      toast.warning("Please fill all required fields");
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
    toast.success("Holiday updated successfully!");
  };

  const openEditModal = (holiday) => {
    setEditHoliday({ ...holiday });
    setShowEditHolidayModal(true);
  };

  const performDelete = (id) => {
    dispatch({ type: "DELETE_HOLIDAY", payload: id });
    setShowConfirmModal(false);
    toast.success("Holiday deleted successfully");
  };

  const applyOptionalHoliday = () => {
    if (!selectedOptionalHoliday) {
      toast.warning("Please select an optional holiday");
      return;
    }

    const selectedHoliday = holidays.find((h) => h.name === selectedOptionalHoliday);
    if (!selectedHoliday) {
      toast.error("Selected holiday not found");
      return;
    }

    const holidayDate = new Date(selectedHoliday.date);
    const todayDate = new Date();
    const daysDiff = Math.ceil((holidayDate - todayDate) / (1000 * 60 * 60 * 24));

    if (selectedHoliday.advanceBookingDays > 0 && daysDiff < selectedHoliday.advanceBookingDays) {
      toast.warning(`This holiday requires ${selectedHoliday.advanceBookingDays} days advance booking`);
      return;
    }

    const newApplication = {
      id: Date.now(),
      name: selectedOptionalHoliday,
      date: selectedHoliday.date,
      holidayId: selectedHoliday.id,
      employeeId: "",
      employeeName: "",
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
    toast.success("Optional holiday application submitted!");
  };

  const updateApplicationStatus = (newStatus) => {
    if (!selectedApplication) return;

    const updatedApplication = {
      ...selectedApplication,
      status: newStatus,
      [newStatus === "Approved" ? "approvedAt" : newStatus === "Rejected" ? "rejectedAt" : "updatedAt"]: new Date().toISOString(),
      [newStatus === "Approved" ? "approvedBy" : newStatus === "Rejected" ? "rejectedBy" : "updatedBy"]: "Manager",
    };

    dispatch({ type: "UPDATE_APPLICATION", payload: updatedApplication });
    setShowStatusModal(false);
    setSelectedApplication(null);
    toast.success(`Application status updated to ${newStatus}`);
  };

  const openStatusModal = (application) => {
    setSelectedApplication(application);
    setShowStatusModal(true);
  };

  const handleHolidaySwap = () => {
    if (!swapForm.employeeId || !swapForm.holidayDate || !swapForm.workDate || !swapForm.reason) {
      toast.warning("Please fill all required fields");
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
    setSwapForm({ employeeId: "", holidayDate: "", workDate: "", reason: "" });
    toast.success("Holiday swap request submitted!");
  };

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
    toast.success(`Swap request ${approved ? "approved" : "rejected"}`);
  };

  const handleCarryForward = () => {
    if (!carryForwardForm.employeeId || carryForwardForm.holidays.length === 0) {
      toast.warning("Please select employee and holidays to carry forward");
      return;
    }

    const carryForwardRecord = {
      id: Date.now(),
      ...carryForwardForm,
      status: "processed",
      processedAt: new Date().toISOString(),
      processedBy: "HR Admin",
    };

    dispatch({ type: "SET_CARRY_FORWARD", payload: [...carryForward, carryForwardRecord] });
    setShowCarryForwardModal(false);
    setCarryForwardForm({
      employeeId: "",
      fromYear: new Date().getFullYear() - 1,
      toYear: new Date().getFullYear(),
      holidays: [],
    });
    toast.success("Holiday carry forward processed!");
  };

  const exportToCSV = () => {
    const data = activeTab === "holidayMaster" ? filteredHolidays : filteredApplications;

    if (data.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const headers = activeTab === "holidayMaster"
      ? ["Holiday Name", "Date", "Category", "Type", "Location"]
      : ["Holiday", "Date", "Applied On", "Status", "Reason"];

    const csvData = data.map((item) => {
      if (activeTab === "holidayMaster") {
        return [item.name, item.date, item.category, item.optional ? "Optional" : "Mandatory", item.location || "N/A"];
      } else {
        return [item.name, item.date, item.appliedDate || "", item.status, item.reason || ""];
      }
    });

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `holiday-calendar-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const printData = () => {
    const data = activeTab === "holidayMaster" ? filteredHolidays : filteredApplications;
    const title = activeTab === "holidayMaster" ? "Holidays List" : "Optional Applications";

    if (data.length === 0) {
      toast.warning("No data to print");
      return;
    }

    const printContent = `
      <html><head><title>${title}</title>
      <style>body{font-family:Arial,sans-serif;margin:20px;}h1{color:#333;}table{width:100%;border-collapse:collapse;margin-top:20px;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background:#f5f5f5;}.badge{padding:4px 8px;border-radius:4px;font-size:12px;}.badge-success{background:#d4edda;color:#155724;}.badge-warning{background:#fff3cd;color:#856404;}.badge-danger{background:#f8d7da;color:#721c24;}.badge-info{background:#d1ecf1;color:#0c5460;}</style></head>
      <body><h1>${title}</h1><p>Generated on: ${new Date().toLocaleDateString()}</p>
      <table><thead>${activeTab === "holidayMaster" ? "<tr><th>Holiday Name</th><th>Date</th><th>Category</th><th>Type</th><th>Location</th></tr>" : "<tr><th>Holiday</th><th>Date</th><th>Applied On</th><th>Status</th><th>Reason</th></tr>"}</thead>
      <tbody>${data.map((item) => `<tr>${activeTab === "holidayMaster" ? `<td>${item.name}</td><td>${item.date}</td><td><span class="badge badge-info">${item.category}</span></td><td><span class="badge ${item.optional ? "badge-success" : ""}">${item.optional ? "Optional" : "Mandatory"}</span></td><td>${item.location || "N/A"}</td>` : `<td>${item.name}</td><td>${item.date}</td><td>${item.appliedDate || ""}</td><td><span class="badge ${item.status === "Approved" ? "badge-success" : item.status === "Rejected" ? "badge-danger" : "badge-warning"}">${item.status}</span></td><td>${item.reason || "-"}</td>`}</tr>`).join("")}</tbody></table></body></html>`;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  };

  const getStatusBadge = (status) => {
    const config = {
      Pending: { label: 'Pending', color: 'yellow' },
      Approved: { label: 'Approved', color: 'green' },
      Rejected: { label: 'Rejected', color: 'red' },
      active: { label: 'Active', color: 'green' },
    };
    const { label, color } = config[status] || { label: status, color: 'gray' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const getHolidayTypeBadge = (type) => {
    const config = {
      gazetted: { label: 'Gazetted', color: 'blue' },
      restricted: { label: 'Restricted', color: 'amber' },
      festival: { label: 'Festival', color: 'purple' },
    };
    const { label, color } = config[type] || { label: type, color: 'gray' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const renderCalendar = () => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    const startDay = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();

    const holidayMap = holidays.reduce((acc, h) => {
      acc[h.date] = h;
      return acc;
    }, {});

    const weeks = [];
    let days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const lastWeek = weeks[weeks.length - 1];
    if (lastWeek && lastWeek.length < 7) {
      while (lastWeek.length < 7) {
        lastWeek.push(null);
      }
    }

    return (
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((dateNum, dayIndex) => {
              if (dateNum === null) {
                return <div key={`${weekIndex}-${dayIndex}`} className="p-1 sm:p-2" />;
              }

              const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dateNum).padStart(2, "0")}`;
              const holiday = holidayMap[dateKey];
              const isTodayDate =
                dateNum === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <div
                  key={dateNum}
                  className={`p-1 sm:p-2 text-center rounded-lg cursor-pointer transition-all ${isTodayDate ? 'bg-blue-600 text-white' : ''
                    } ${holiday ? 'text-rose-600 font-bold' : ''} ${selectedDate === dateNum ? 'ring-2 ring-blue-500' : ''
                    } hover:bg-slate-50`}
                  onClick={() => setSelectedDate(dateNum)}
                >
                  <span className="text-xs sm:text-sm">{dateNum}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto max-w-7xl space-y-4 sm:space-y-6 md:px-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Icon icon="heroicons:calendar" className="w-6 h-6 text-blue-600" />
            Holiday Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage holidays, applications, swap requests and calendars
          </p>
        </div>
      </div>

      <div className="border border-slate-200 bg-white rounded-xl shadow-sm p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <button
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "month" ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              onClick={() => setViewMode("month")}
            >
              <Icon icon="heroicons:calendar" className="w-4 h-4 inline mr-1" />
              <span className="hidden xs:inline">Calendar</span>
            </button>
          </div>

          <div className="flex-1 flex flex-wrap gap-2">
            <div className="flex-1 min-w-[120px]">
              <div className="relative">
                <Icon icon="heroicons:magnifying-glass" className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-1.5 sm:py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {activeTab === "holidayMaster" ? (
              <>
                <select
                  className="px-2 py-1.5 sm:py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Public Holiday">Public Holiday</option>
                  <option value="National Holiday">National Holiday</option>
                  <option value="Festival">Festival</option>
                  <option value="State Holiday">State Holiday</option>
                  <option value="Company Holiday">Company Holiday</option>
                  <option value="Restricted Holiday">Restricted Holiday</option>
                </select>
                <select
                  className="px-2 py-1.5 sm:py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="mandatory">Mandatory</option>
                  <option value="optional">Optional</option>
                </select>
              </>
            ) : (
              <select
                className="px-2 py-1.5 sm:py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            )}

            <button
              className="px-3 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
              onClick={exportToCSV}
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              <span className="hidden xs:inline">Export</span>
            </button>
            <button
              className="px-3 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
              onClick={printData}
            >
              <Icon icon="heroicons:printer" className="w-4 h-4" />
              <span className="hidden xs:inline">Print</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "month" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1 border border-slate-200 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" onClick={prevMonth}>
                <Icon icon="heroicons:chevron-left" className="w-5 h-5" />
              </button>
              <h5 className="font-bold text-slate-800">{monthNames[currentMonth]} {currentYear}</h5>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" onClick={nextMonth}>
                <Icon icon="heroicons:chevron-right" className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysShort.map((d) => (
                <div key={d} className="text-center text-xs font-bold text-slate-400">{d}</div>
              ))}
            </div>

            {renderCalendar()}

            {selectedDate && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-700 mb-1">Selected Date:</p>
                <p className="text-sm text-slate-600">{monthNames[currentMonth]} {selectedDate}, {currentYear}</p>
                {(() => {
                  const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
                  const holiday = holidays.find(h => h.date === dateKey);
                  return holiday ? (
                    <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg">
                      <p className="text-sm font-bold text-rose-700">{holiday.name}</p>
                      <p className="text-xs text-rose-600">{holiday.category}</p>
                    </div>
                  ) : (
                    <div className="mt-2 p-2 bg-slate-100 rounded-lg">
                      <p className="text-sm text-slate-500">No Holiday</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="border border-slate-200 rounded-2xl bg-white p-2 shadow-sm overflow-x-auto">
              <div className="flex gap-1 min-w-[400px]">
                {[
                  { id: "holidayMaster", name: "Holiday Master", icon: "heroicons:calendar", count: stats.totalHolidays },
                  { id: "optionalApplications", name: "Optional Apps", icon: "heroicons:check-square", count: stats.totalApplications },
                  { id: "calendars", name: "Calendars", icon: "heroicons:building-office", count: calendars.length },
                  { id: "swap", name: "Holiday Swap", icon: "heroicons:arrows-right-left", count: swapRequests.length },
                  { id: "carryForward", name: "Carry Forward", icon: "heroicons:arrow-path", count: carryForward.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon icon={tab.icon} className="w-4 h-4 inline mr-1" />
                    <span className="hidden xs:inline">{tab.name}</span>
                    <span className="xs:hidden">{tab.name.split(" ")[0]}</span>
                    <span className="ml-1 text-[8px] opacity-70">({tab.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "calendars" && (
              <div className="border border-slate-200 rounded-2xl bg-white shadow-sm">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                  <h5 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Icon icon="heroicons:building-office" className="w-4 h-4 text-blue-600" />
                    Holiday Calendars
                  </h5>
                  <button
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    onClick={() => {
                      setIsEditCalendar(false);
                      setEditingCalendarId(null);
                      setCalendarForm({ name: "", location: "", employeeGroups: [], isDefault: false });
                      setShowCalendarModal(true);
                    }}
                  >
                    <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
                    <span className="hidden xs:inline">Add Calendar</span>
                  </button>
                </div>
                <div className="p-3 sm:p-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2 sm:p-3">Calendar Name</th>
                        <th className="p-2 sm:p-3 hidden sm:table-cell">Location</th>
                        <th className="p-2 sm:p-3 hidden md:table-cell">Employee Groups</th>
                        <th className="p-2 sm:p-3">Status</th>
                        <th className="p-2 sm:p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {calendars.length === 0 ? (
                        <tr><td colSpan="5" className="p-4 text-center text-slate-400">No calendars configured</td></tr>
                      ) : (
                        calendars.map((cal) => (
                          <tr key={cal.id} className="hover:bg-slate-50/50">
                            <td className="p-2 sm:p-3 font-medium">
                              {cal.name}
                              {cal.isDefault && <span className="ml-2 text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Default</span>}
                            </td>
                            <td className="p-2 sm:p-3 hidden sm:table-cell">{cal.location}</td>
                            <td className="p-2 sm:p-3 hidden md:table-cell">
                              <span className="text-xs">{cal.employeeGroups?.includes("all") ? "All Groups" : cal.employeeGroups?.join(", ")}</span>
                            </td>
                            <td className="p-2 sm:p-3">{getStatusBadge("active")}</td>
                            <td className="p-2 sm:p-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                  onClick={() => {
                                    setIsEditCalendar(true);
                                    setEditingCalendarId(cal.id);
                                    setCalendarForm({
                                      name: cal.name,
                                      location: cal.location,
                                      employeeGroups: cal.employeeGroups || ["all"],
                                      isDefault: cal.isDefault || false,
                                    });
                                    setShowCalendarModal(true);
                                  }}
                                >
                                  <Icon icon="heroicons:pencil" className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  className="p-1.5 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                                  onClick={() => {
                                    dispatch({ type: "DELETE_CALENDAR", payload: cal.id });
                                    toast.success("Calendar deleted successfully!");
                                  }}
                                >
                                  <Icon icon="heroicons:trash" className="w-3.5 h-3.5" />
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
            )}

            {activeTab === "swap" && (
              <div className="border border-slate-200 rounded-2xl bg-white shadow-sm">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                  <h5 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Icon icon="heroicons:arrows-right-left" className="w-4 h-4 text-amber-500" />
                    Holiday Swap Requests
                  </h5>
                  <button
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    onClick={() => setShowSwapModal(true)}
                  >
                    <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
                    <span className="hidden xs:inline">New Swap Request</span>
                  </button>
                </div>
                <div className="p-3 sm:p-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2 sm:p-3">Employee</th>
                        <th className="p-2 sm:p-3">Holiday Date</th>
                        <th className="p-2 sm:p-3">Work Date</th>
                        <th className="p-2 sm:p-3 hidden sm:table-cell">Reason</th>
                        <th className="p-2 sm:p-3">Status</th>
                        <th className="p-2 sm:p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {swapRequests.length === 0 ? (
                        <tr><td colSpan="6" className="p-4 text-center text-slate-400">No swap requests</td></tr>
                      ) : (
                        swapRequests.map((swap) => {
                          return (
                            <tr key={swap.id} className="hover:bg-slate-50/50">
                              <td className="p-2 sm:p-3 font-medium">{swap.employeeId}</td>
                              <td className="p-2 sm:p-3">{swap.holidayDate}</td>
                              <td className="p-2 sm:p-3">{swap.workDate}</td>
                              <td className="p-2 sm:p-3 hidden sm:table-cell text-slate-500">{swap.reason}</td>
                              <td className="p-2 sm:p-3">{getStatusBadge(swap.status)}</td>
                              <td className="p-2 sm:p-3 text-right">
                                {swap.status === "pending" && (
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                                      onClick={() => handleSwapApproval(swap.id, true)}
                                    >
                                      <Icon icon="heroicons:check" className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      className="p-1.5 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                                      onClick={() => handleSwapApproval(swap.id, false)}
                                    >
                                      <Icon icon="heroicons:x-mark" className="w-3.5 h-3.5" />
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
            )}

            {activeTab === "carryForward" && (
              <div className="border border-slate-200 rounded-2xl bg-white shadow-sm">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                  <h5 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Icon icon="heroicons:arrow-path" className="w-4 h-4 text-slate-500" />
                    Holiday Carry Forward
                  </h5>
                  <button
                    className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    onClick={() => setShowCarryForwardModal(true)}
                  >
                    <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
                    <span className="hidden xs:inline">Process Carry Forward</span>
                  </button>
                </div>
                <div className="p-3 sm:p-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2 sm:p-3">Employee</th>
                        <th className="p-2 sm:p-3">From Year</th>
                        <th className="p-2 sm:p-3">To Year</th>
                        <th className="p-2 sm:p-3">Holidays</th>
                        <th className="p-2 sm:p-3">Status</th>
                        <th className="p-2 sm:p-3">Processed By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {carryForward.length === 0 ? (
                        <tr><td colSpan="6" className="p-4 text-center text-slate-400">No carry forward records</td></tr>
                      ) : (
                        carryForward.map((cf) => {
                          return (
                            <tr key={cf.id} className="hover:bg-slate-50/50">
                              <td className="p-2 sm:p-3 font-medium">{cf.employeeId}</td>
                              <td className="p-2 sm:p-3">{cf.fromYear}</td>
                              <td className="p-2 sm:p-3">{cf.toYear}</td>
                              <td className="p-2 sm:p-3">{cf.holidays.length} holidays</td>
                              <td className="p-2 sm:p-3">{getStatusBadge("active")}</td>
                              <td className="p-2 sm:p-3">{cf.processedBy}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "holidayMaster" && (
              <div className="border border-slate-200 rounded-2xl bg-white shadow-sm">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                  <h5 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Icon icon="heroicons:calendar" className="w-4 h-4 text-blue-600" />
                    Holiday Master
                  </h5>
                  <button
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    onClick={() => setShowHolidayModal(true)}
                  >
                    <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
                    <span className="hidden xs:inline">Add Holiday</span>
                  </button>
                </div>
                <div className="p-3 sm:p-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2 sm:p-3">Holiday Name</th>
                        <th className="p-2 sm:p-3">Date</th>
                        <th className="p-2 sm:p-3 hidden sm:table-cell">Category</th>
                        <th className="p-2 sm:p-3 hidden md:table-cell">Type</th>
                        <th className="p-2 sm:p-3">Optional</th>
                        <th className="p-2 sm:p-3 hidden lg:table-cell">Location</th>
                        <th className="p-2 sm:p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHolidays.length === 0 ? (
                        <tr><td colSpan="7" className="p-4 text-center text-slate-400">No holidays found</td></tr>
                      ) : (
                        filteredHolidays.map((h) => (
                          <tr key={h.id} className="hover:bg-slate-50/50">
                            <td className="p-2 sm:p-3 font-medium">{h.name}</td>
                            <td className="p-2 sm:p-3 text-rose-600 font-bold">{h.date}</td>
                            <td className="p-2 sm:p-3 hidden sm:table-cell">
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">{h.category}</span>
                            </td>
                            <td className="p-2 sm:p-3 hidden md:table-cell">{getHolidayTypeBadge(h.holidayType)}</td>
                            <td className="p-2 sm:p-3">
                              {h.optional ? (
                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Optional</span>
                              ) : (
                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">Mandatory</span>
                              )}
                            </td>
                            <td className="p-2 sm:p-3 hidden lg:table-cell text-slate-500">{h.location || "N/A"}</td>
                            <td className="p-2 sm:p-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                  onClick={() => openEditModal(h)}
                                >
                                  <Icon icon="heroicons:pencil" className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  className="p-1.5 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                                  onClick={() => {
                                    setConfirmAction({
                                      title: "Delete Holiday",
                                      message: `Are you sure you want to delete "${h.name}"?`,
                                      onConfirm: () => performDelete(h.id),
                                      onCancel: () => setShowConfirmModal(false),
                                    });
                                    setShowConfirmModal(true);
                                  }}
                                >
                                  <Icon icon="heroicons:trash" className="w-3.5 h-3.5" />
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
            )}

            {activeTab === "optionalApplications" && (
              <div className="border border-slate-200 rounded-2xl bg-white shadow-sm">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                  <h5 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Icon icon="heroicons:check-square" className="w-4 h-4 text-emerald-600" />
                    Optional Applications
                  </h5>
                  <button
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    onClick={() => {
                      if (stats.optionalHolidays === 0) {
                        toast.warning("No optional holidays available");
                        return;
                      }
                      setShowOptionalModal(true);
                    }}
                  >
                    <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
                    <span className="hidden xs:inline">Apply Holiday</span>
                  </button>
                </div>
                <div className="p-3 sm:p-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-2 sm:p-3">Holiday</th>
                        <th className="p-2 sm:p-3">Date</th>
                        <th className="p-2 sm:p-3 hidden sm:table-cell">Applied On</th>
                        <th className="p-2 sm:p-3">Status</th>
                        <th className="p-2 sm:p-3 hidden md:table-cell">Reason</th>
                        <th className="p-2 sm:p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApplications.length === 0 ? (
                        <tr><td colSpan="6" className="p-4 text-center text-slate-400">No applications found</td></tr>
                      ) : (
                        filteredApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/50">
                            <td className="p-2 sm:p-3 font-medium">{app.name}</td>
                            <td className="p-2 sm:p-3">{app.date}</td>
                            <td className="p-2 sm:p-3 hidden sm:table-cell">{app.appliedDate || ""}</td>
                            <td className="p-2 sm:p-3">{getStatusBadge(app.status)}</td>
                            <td className="p-2 sm:p-3 hidden md:table-cell text-slate-500">{app.reason || "-"}</td>
                            <td className="p-2 sm:p-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                  onClick={() => openStatusModal(app)}
                                >
                                  <Icon icon="heroicons:cog-6-tooth" className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  className="p-1.5 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100"
                                  onClick={() => {
                                    dispatch({ type: "SET_APPLICATIONS", payload: optionalApplications.filter((a) => a.id !== app.id) });
                                    toast.success("Application deleted successfully");
                                  }}
                                >
                                  <Icon icon="heroicons:trash" className="w-3.5 h-3.5" />
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
            )}

            <div className="border border-slate-200 rounded-2xl bg-white p-4 shadow-sm">
              <h6 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
                <Icon icon="heroicons:bolt" className="w-4 h-4 text-amber-500" />
                Quick Actions
              </h6>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                  onClick={() => setShowHolidayModal(true)}
                >
                  <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
                  Add
                </button>
                <button
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                  onClick={() => {
                    if (stats.optionalHolidays === 0) {
                      toast.warning("No optional holidays available");
                      return;
                    }
                    setShowOptionalModal(true);
                  }}
                >
                  <Icon icon="heroicons:check-square" className="w-4 h-4" />
                  Apply
                </button>
                <button
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                  onClick={goToToday}
                >
                  <Icon icon="heroicons:calendar" className="w-4 h-4" />
                  Today
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h5 className="text-sm font-bold text-slate-800">
              {activeTab === "holidayMaster" ? "Holidays List" : "Applications List"}
            </h5>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                onClick={() => activeTab === "holidayMaster" ? setShowHolidayModal(true) : setShowOptionalModal(true)}
              >
                <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
                {activeTab === "holidayMaster" ? "Add Holiday" : "Apply Holiday"}
              </button>
              <button
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1"
                onClick={() => setViewMode("month")}
              >
                <Icon icon="heroicons:calendar" className="w-4 h-4" />
                Calendar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(activeTab === "holidayMaster" ? filteredHolidays : filteredApplications).map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h6 className="text-sm font-bold text-slate-800">{item.name}</h6>
                  {activeTab === "holidayMaster" ? (
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${item.optional ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.optional ? "Optional" : "Mandatory"}
                    </span>
                  ) : (
                    getStatusBadge(item.status)
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-slate-600"><Icon icon="heroicons:calendar" className="w-3 h-3 inline mr-1" />Date: {item.date}</p>
                  {activeTab === "holidayMaster" ? (
                    <>
                      <p className="text-xs text-slate-600"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">{item.category}</span></p>
                      <p className="text-xs text-slate-500">Location: {item.location || "N/A"}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-slate-500">Applied: {item.appliedDate || "N/A"}</p>
                      <p className="text-xs text-slate-500">Reason: {item.reason || "No reason provided"}</p>
                    </>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  {activeTab === "holidayMaster" ? (
                    <>
                      <button className="flex-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold" onClick={() => openEditModal(item)}>
                        <Icon icon="heroicons:pencil" className="w-3 h-3 inline mr-1" />Edit
                      </button>
                      <button className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold" onClick={() => {
                        setConfirmAction({
                          title: "Delete Holiday",
                          message: `Are you sure you want to delete "${item.name}"?`,
                          onConfirm: () => performDelete(item.id),
                          onCancel: () => setShowConfirmModal(false),
                        });
                        setShowConfirmModal(true);
                      }}>
                        <Icon icon="heroicons:trash" className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold" onClick={() => openStatusModal(item)}>
                        <Icon icon="heroicons:cog-6-tooth" className="w-3 h-3 inline mr-1" />Status
                      </button>
                      <button className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold" onClick={() => {
                        dispatch({ type: "SET_APPLICATIONS", payload: optionalApplications.filter((a) => a.id !== item.id) });
                        toast.success("Application deleted successfully");
                      }}>
                        <Icon icon="heroicons:trash" className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {(activeTab === "holidayMaster" ? filteredHolidays : filteredApplications).length === 0 && (
              <div className="col-span-full text-center py-8">
                <Icon icon="heroicons:inbox" className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No items found</p>
                <button
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                  onClick={() => activeTab === "holidayMaster" ? setShowHolidayModal(true) : setShowOptionalModal(true)}
                >
                  <Icon icon="heroicons:plus-circle" className="w-4 h-4 inline mr-1" />
                  Add {activeTab === "holidayMaster" ? "Holiday" : "Application"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showHolidayModal && (
        <HolidayAddModal
          isOpen={showHolidayModal}
          onClose={() => setShowHolidayModal(false)}
          newHoliday={newHoliday}
          setNewHoliday={setNewHoliday}
          saveHoliday={saveHoliday}
          locations={[]}
          employeeGroups={[]}
        />
      )}

      {showEditHolidayModal && (
        <HolidayEditModal
          isOpen={showEditHolidayModal}
          onClose={() => setShowEditHolidayModal(false)}
          editHoliday={editHoliday}
          setEditHoliday={setEditHoliday}
          updateHoliday={updateHoliday}
          locations={[]}
          employeeGroups={[]}
        />
      )}

      {showOptionalModal && (
        <HolidayOptionalModal
          isOpen={showOptionalModal}
          onClose={() => setShowOptionalModal(false)}
          holidays={holidays}
          selectedOptionalHoliday={selectedOptionalHoliday}
          setSelectedOptionalHoliday={setSelectedOptionalHoliday}
          optionalReason={optionalReason}
          setOptionalReason={setOptionalReason}
          applyOptionalHoliday={applyOptionalHoliday}
        />
      )}

      {showStatusModal && selectedApplication && (
        <HolidayStatusModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          selectedApplication={selectedApplication}
          updateApplicationStatus={updateApplicationStatus}
        />
      )}

      {showCalendarModal && (
        <HolidayCalendarModal
          isOpen={showCalendarModal}
          onClose={() => setShowCalendarModal(false)}
          calendarForm={calendarForm}
          setCalendarForm={setCalendarForm}
          isEditCalendar={isEditCalendar}
          editingCalendarId={editingCalendarId}
          dispatch={dispatch}
          locations={[]}
          employeeGroups={[]}
          showNotification={toast.success}
        />
      )}

      {showSwapModal && (
        <HolidaySwapModal
          isOpen={showSwapModal}
          onClose={() => setShowSwapModal(false)}
          swapForm={swapForm}
          setSwapForm={setSwapForm}
          handleHolidaySwap={handleHolidaySwap}
          employees={[]}
        />
      )}

      {showCarryForwardModal && (
        <HolidayCarryForwardModal
          isOpen={showCarryForwardModal}
          onClose={() => setShowCarryForwardModal(false)}
          carryForwardForm={carryForwardForm}
          setCarryForwardForm={setCarryForwardForm}
          handleCarryForward={handleCarryForward}
          holidays={holidays}
          employees={[]}
        />
      )}

      {showConfirmModal && (
        <HolidayConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          confirmAction={confirmAction}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        className="text-xs"
      />
    </div>
  );
};

export default HolidayCalendar;