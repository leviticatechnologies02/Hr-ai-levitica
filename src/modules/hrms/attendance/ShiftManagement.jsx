import React, { useState, useEffect, useReducer } from "react";
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ShiftModal from "../modal/ShiftModal";
import SwapRequestModal from "../modal/SwapRequestModal";
import FlexibleArrangementModal from "../modal/FlexibleArrangementModal";
import { attendanceAPI, employeeAPI } from "../../../shared/utils/api";

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

const ShiftManagement = () => {
  const [activeTab, setActiveTab] = useState("shifts");
  const [showShiftModal, setShowShiftModal] = useState(false);
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
  const [notifications, setNotifications] = useState([]);

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

  const loadFromStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const initialState = {
    shifts: loadFromStorage("shiftMaster", []),
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
        minWorkHours: 8,
        halfDayCriteria: {
          hours: 4,
          considerAsHalfDay: true,
          applyAfterHours: 5,
          markAsAbsentBelow: 3,
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
        calculation: {
          method: "multiplier",
          weekdayRate: 1.5,
          weekendRate: 2.0,
          holidayRate: 3.0,
          nightShiftBonus: 0.25,
        },
        caps: {
          daily: 4,
          weekly: 20,
          monthly: 48,
          quarterly: 120,
          yearly: 480,
        },
      },
      breakManagement: {
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

  const [employeesList, setEmployeesList] = useState([]);
  const [loadingShifts, setLoadingShifts] = useState(true);

  // Backend ShiftResponse (shift_name/shift_code/shift_type/start_time/
  // end_time/duration_hours/week_offs [single string]/differential_pay/
  // break_duration_minutes [single int]/grace_period_minutes/
  // is_night_shift/is_active) -> local shape. NOTE: breakTimes here is a
  // rich array of named break objects (start/end/paid per break) — the
  // backend only tracks one total break_duration_minutes. Per-break detail
  // has nowhere to persist; kept in local form state only, summed into a
  // single number when sent to the backend.
  const mapShiftFromBackend = (s) => ({
    id: s.id,
    name: s.shift_name,
    code: s.shift_code,
    type: s.shift_type,
    startTime: s.start_time?.slice(0, 5),
    endTime: s.end_time?.slice(0, 5),
    duration: s.duration_hours,
    gracePeriod: s.grace_period_minutes,
    breakTimes: [],
    totalBreakMinutes: s.break_duration_minutes,
    weekOffs: s.week_offs ? s.week_offs.split(',').map((w) => w.trim()) : [],
    differentialPay: s.differential_pay,
    isActive: s.is_active,
    isNightShift: s.is_night_shift,
    description: s.description || '',
    allowMultiplePerDay: false, // no backend field
    coreHours: { start: "10:00", end: "16:00" }, // no backend field
    rotationPattern: "weekly", // no backend field
  });

  const mapAssignmentFromBackend = (a) => ({
    id: a.id,
    employeeId: a.employee_id,
    employeeName: a.employee_name,
    employeeCode: a.employee_code,
    shiftId: a.shift_id,
    shiftName: a.shift_name,
    startDate: a.start_date,
    endDate: a.end_date,
    isActive: a.status === 'active',
    status: a.status,
  });

  const mapRosterFromBackend = (r) => ({
    id: r.id,
    name: r.roster_name,
    shiftId: r.shift_id,
    shiftName: r.shift_name,
    period: r.period,
    startDate: r.start_date,
    endDate: r.end_date,
    status: r.status,
    published: r.published,
    createdAt: r.created_at,
    days: [], // backend doesn't return a day-by-day breakdown
  });

  const mapSwapFromBackend = (s) => ({
    id: s.id,
    employeeId: s.employee_id,
    employeeName: s.employee_name,
    currentShift: s.current_shift,
    requestedShift: s.requested_shift,
    swapDate: s.swap_date,
    reason: s.reason,
    status: s.status,
    createdAt: s.created_at,
  });

  const mapFlexibleFromBackend = (f) => ({
    id: f.id,
    employeeId: f.employee_id,
    employeeName: f.employee_name,
    arrangementType: f.arrangement_type,
    coreHours: f.core_hours,
    flexibleWindow: f.flexible_window,
    remoteDays: f.remote_days,
    status: f.status,
    isActive: f.status === 'active',
    createdAt: f.created_at,
  });

  const loadAllShiftData = async () => {
    setLoadingShifts(true);
    try {
      const [shiftsData, assignmentsData, rostersData, swapsData, flexData, notifData, empData] = await Promise.all([
        attendanceAPI.listShifts(),
        attendanceAPI.listShiftAssignments(),
        attendanceAPI.listRosters(),
        attendanceAPI.listShiftSwaps(),
        attendanceAPI.listFlexibleArrangements(),
        attendanceAPI.getShiftNotifications(),
        attendanceAPI.getEmployeesForShiftAssignment(),
      ]);
      dispatch({ type: "SET_SHIFTS", payload: (shiftsData || []).map(mapShiftFromBackend) });
      dispatch({ type: "SET_SHIFT_ASSIGNMENTS", payload: (assignmentsData || []).map(mapAssignmentFromBackend) });
      dispatch({ type: "SET_ROSTERS", payload: (rostersData || []).map(mapRosterFromBackend) });
      dispatch({ type: "SET_SWAP_REQUESTS", payload: (swapsData || []).map(mapSwapFromBackend) });
      dispatch({ type: "SET_FLEXIBLE_ARRANGEMENTS", payload: (flexData || []).map(mapFlexibleFromBackend) });
      setNotifications(notifData || []);
      setEmployeesList(empData || []);
    } catch (err) {
      console.error('Failed to load shift management data:', err);
      toast.error(err.message || 'Failed to load shift data');
    } finally {
      setLoadingShifts(false);
    }
  };

  useEffect(() => {
    loadAllShiftData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [savingShift, setSavingShift] = useState(false);

  const handleAddShift = async () => {
    if (!shiftForm.name || !shiftForm.code) {
      toast.error("Please enter shift name and code");
      return;
    }

    // NOTE: allowMultiplePerDay, coreHours, and rotationPattern have no
    // backend column at all — stay local-only in the form. breakTimes
    // (named breaks with individual start/end/paid flags) also has no
    // per-break storage on the backend; summed into one
    // break_duration_minutes number instead.
    const totalBreakMinutes = (shiftForm.breakTimes || []).reduce(
      (sum, b) => sum + (Number(b.duration) || 0), 0
    );

    const payload = {
      shift_name: shiftForm.name,
      shift_code: shiftForm.code,
      shift_type: shiftForm.type,
      description: shiftForm.description || null,
      start_time: shiftForm.startTime,
      end_time: shiftForm.endTime,
      duration_hours: Number(shiftForm.duration) || 8,
      week_offs: (shiftForm.weekOffs || []).join(', ') || 'Sunday',
      differential_pay: Number(shiftForm.differentialPay) || 1.0,
      break_duration_minutes: totalBreakMinutes || 30,
      grace_period_minutes: Number(shiftForm.gracePeriod) || 10,
      is_night_shift: shiftForm.type === 'night',
      is_active: shiftForm.isActive,
    };

    setSavingShift(true);
    try {
      if (editingShift) {
        const updated = await attendanceAPI.updateShift(editingShift.id, payload);
        dispatch({ type: "UPDATE_SHIFT", payload: mapShiftFromBackend(updated) });
        toast.success("Shift updated successfully");
      } else {
        const created = await attendanceAPI.createShift(payload);
        dispatch({ type: "ADD_SHIFT", payload: mapShiftFromBackend(created) });
        toast.success("Shift added successfully");
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save shift');
      setSavingShift(false);
      return;
    }
    setSavingShift(false);

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

  const handleDeleteShift = async (shiftId) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      try {
        await attendanceAPI.deleteShift(shiftId);
        dispatch({ type: "DELETE_SHIFT", payload: shiftId });
        toast.success("Shift deleted successfully");
      } catch (err) {
        toast.error(err.message || 'Failed to delete shift');
      }
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

  const handleBulkAssignShift = async (shiftId, employeeIds) => {
    try {
      const result = await attendanceAPI.assignShiftBulk({
        shift_id: shiftId,
        employee_ids: employeeIds,
        start_date: new Date().toISOString().split("T")[0],
      });
      await loadAllShiftData();
      toast.success(result.message || `Shift assigned to ${employeeIds.length} employees.`);
      if ((result.errors || []).length > 0) {
        toast.warning(`${result.errors.length} assignment(s) failed — check console for details`);
        console.warn('Bulk shift assignment errors:', result.errors);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to assign shift');
    }
  };

  const [generatingRoster, setGeneratingRoster] = useState(false);

  // NOTE: the backend's roster model doesn't store a day-by-day breakdown
  // or per-day employee assignments at all — it only tracks
  // name/shift/period/date-range/status. The detailed day-by-day preview
  // built below stays a client-side-only display; only the roster record
  // itself (name, dates, status) is actually persisted.
  const generateRoster = async () => {
    if (!selectedShift) {
      toast.error("Please select a shift");
      return;
    }

    const startDate = new Date(rosterStartDate);
    const endDate = new Date(startDate);

    if (rosterPeriod === "weekly") {
      endDate.setDate(endDate.getDate() + 6);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
    }

    const rosterDays = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.toLocaleDateString("en-US", { weekday: "long" });
      const isWeekOff = selectedShift.weekOffs?.includes(dayOfWeek) || false;

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

    setGeneratingRoster(true);
    try {
      const created = await attendanceAPI.generateRoster({
        shift_id: selectedShift.id,
        period: rosterPeriod === 'weekly' ? 'Weekly' : 'Monthly',
        start_date: rosterStartDate,
      });
      dispatch({ type: "ADD_ROSTER", payload: { ...mapRosterFromBackend(created), days: rosterDays } });
      toast.success("Roster generated successfully");
    } catch (err) {
      toast.error(err.message || 'Failed to generate roster');
    } finally {
      setGeneratingRoster(false);
    }
  };

  const [publishingRosterId, setPublishingRosterId] = useState(null);

  const publishRoster = async (rosterId) => {
    const roster = rosters.find((r) => r.id === rosterId);
    if (!roster) return;

    setPublishingRosterId(rosterId);
    try {
      const updated = await attendanceAPI.updateRoster(rosterId, { published: true });
      dispatch({
        type: "SET_ROSTERS",
        payload: rosters.map((r) => r.id === rosterId ? { ...mapRosterFromBackend(updated), days: r.days } : r),
      });
      toast.success(`Roster "${roster.name}" published successfully.`);
    } catch (err) {
      toast.error(err.message || 'Failed to publish roster');
    } finally {
      setPublishingRosterId(null);
    }
  };

  const [submittingSwap, setSubmittingSwap] = useState(false);

  const handleSwapRequest = async () => {
    if (!swapForm.employeeId || !swapForm.currentShiftId || !swapForm.requestedShiftId || !swapForm.swapDate) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmittingSwap(true);
    try {
      const created = await attendanceAPI.createShiftSwap({
        employee_id: Number(swapForm.employeeId),
        current_shift_id: Number(swapForm.currentShiftId),
        requested_shift_id: Number(swapForm.requestedShiftId),
        swap_date: swapForm.swapDate,
        reason: swapForm.reason || null,
      });
      dispatch({ type: "ADD_SWAP_REQUEST", payload: mapSwapFromBackend(created) });
      setShowSwapModal(false);
      setSwapForm({
        employeeId: "",
        currentShiftId: "",
        requestedShiftId: "",
        swapDate: "",
        reason: "",
        swapWithEmployeeId: "",
      });
      toast.success("Shift swap request submitted successfully");
    } catch (err) {
      toast.error(err.message || 'Failed to submit swap request');
    } finally {
      setSubmittingSwap(false);
    }
  };

  const handleSwapApproval = async (requestId, approved) => {
    const request = swapRequests.find((r) => r.id === requestId);
    if (!request) return;

    try {
      const updated = await attendanceAPI.updateShiftSwap(requestId, {
        status: approved ? 'approved' : 'rejected',
        remarks: approved ? null : 'Not approved by manager',
      });
      dispatch({ type: "UPDATE_SWAP_REQUEST", payload: mapSwapFromBackend(updated) });

      if (approved) {
        // The backend already updates the employee's active assignment to
        // the requested shift server-side when a swap is approved — just
        // refresh assignments to reflect it, rather than guessing the
        // update client-side.
        const assignmentsData = await attendanceAPI.listShiftAssignments();
        dispatch({ type: "SET_SHIFT_ASSIGNMENTS", payload: (assignmentsData || []).map(mapAssignmentFromBackend) });
        toast.success("Shift swap approved and assignment updated.");
      } else {
        toast.info("Shift swap rejected.");
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update swap request');
    }
  };

  const [savingFlexible, setSavingFlexible] = useState(false);

  const handleFlexibleArrangement = async () => {
    if (!flexibleForm.employeeId) {
      toast.error("Please select an employee");
      return;
    }

    // NOTE: hybridSchedule (officeDays/remoteDays) and compressedWeek
    // (enabled/workDays/hoursPerDay) have no backend columns —
    // FlexibleArrangement only has arrangement_type/core_hours/
    // flexible_window/remote_days/status. Folding remoteWorkDays into
    // remote_days as a comma-joined string; the rest stays local-only.
    const coreHoursStr = `${flexibleForm.coreHours?.start || '10:00'}-${flexibleForm.coreHours?.end || '16:00'}`;
    const flexWindowStr = `${flexibleForm.flexibleStart || '08:00'}-${flexibleForm.flexibleEnd || '20:00'}`;

    setSavingFlexible(true);
    try {
      const created = await attendanceAPI.createFlexibleArrangement({
        employee_id: Number(flexibleForm.employeeId),
        arrangement_type: flexibleForm.arrangementType,
        core_hours: coreHoursStr,
        flexible_window: flexWindowStr,
        remote_days: (flexibleForm.remoteWorkDays || []).join(', ') || 'None',
        status: 'active',
      });
      dispatch({ type: "ADD_FLEXIBLE_ARRANGEMENT", payload: mapFlexibleFromBackend(created) });
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
      toast.success("Flexible work arrangement saved successfully");
    } catch (err) {
      toast.error(err.message || 'Failed to save flexible arrangement');
    } finally {
      setSavingFlexible(false);
    }
  };

  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch =
      shift.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || shift.type === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status) => {
    const config = {
      active: { label: 'Active', color: 'emerald' },
      inactive: { label: 'Inactive', color: 'gray' },
      draft: { label: 'Draft', color: 'yellow' },
      published: { label: 'Published', color: 'green' },
      pending: { label: 'Pending', color: 'yellow' },
      approved: { label: 'Approved', color: 'green' },
      rejected: { label: 'Rejected', color: 'red' },
    };
    const { label, color } = config[status] || { label: status, color: 'gray' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const getShiftTypeBadge = (type) => {
    const config = {
      general: { label: 'General', color: 'blue' },
      night: { label: 'Night', color: 'indigo' },
      rotational: { label: 'Rotational', color: 'purple' },
      flexible: { label: 'Flexible', color: 'cyan' },
    };
    const { label, color } = config[type] || { label: type, color: 'gray' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const renderShiftMaster = () => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:clock" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          Shift Master Setup
        </h5>
        <button
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
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
          <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
          Add Shift
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Icon icon="heroicons:magnifying-glass" className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
                placeholder="Search shifts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm bg-white"
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[10px] sm:text-xs">
              <tr>
                <th className="p-2 sm:p-3">Shift Name</th>
                <th className="p-2 sm:p-3 hidden sm:table-cell">Code</th>
                <th className="p-2 sm:p-3 hidden md:table-cell">Type</th>
                <th className="p-2 sm:p-3 hidden lg:table-cell">Timing</th>
                <th className="p-2 sm:p-3 hidden xl:table-cell">Duration</th>
                <th className="p-2 sm:p-3">Status</th>
                <th className="p-2 sm:p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredShifts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400">
                    <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No shifts found
                  </td>
                </tr>
              ) : (
                filteredShifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3">
                      <div className="font-bold text-slate-800 text-xs sm:text-sm">{shift.name}</div>
                      {shift.description && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px] sm:max-w-[200px]">{shift.description}</div>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 hidden sm:table-cell">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">{shift.code}</code>
                    </td>
                    <td className="p-2 sm:p-3 hidden md:table-cell">
                      {getShiftTypeBadge(shift.type)}
                    </td>
                    <td className="p-2 sm:p-3 hidden lg:table-cell text-slate-600">
                      {shift.startTime} - {shift.endTime}
                    </td>
                    <td className="p-2 sm:p-3 hidden xl:table-cell text-slate-600">
                      {shift.duration} hrs
                    </td>
                    <td className="p-2 sm:p-3">
                      {getStatusBadge(shift.isActive ? "active" : "inactive")}
                    </td>
                    <td className="p-2 sm:p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          onClick={() => handleEditShift(shift)}
                          title="Edit Shift"
                        >
                          <Icon icon="heroicons:pencil" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          className="p-1.5 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                          onClick={() => handleDeleteShift(shift.id)}
                          title="Delete Shift"
                        >
                          <Icon icon="heroicons:trash" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
  );

  const renderShiftAssignment = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
          <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:users" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Bulk Shift Assignment
          </h5>
        </div>
        <div className="p-3 sm:p-4">
          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Shift</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Employees</label>
            <div className="border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto">
              <div className="text-xs text-slate-400 text-center py-4">
                Employee list will be loaded from API
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
          <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:user" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Individual Assignment
          </h5>
        </div>
        <div className="p-3 sm:p-4">
          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Employee</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white">
              <option value="">Select employee...</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Shift</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white">
              <option value="">Select shift...</option>
              {shifts.filter((s) => s.isActive).map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
              <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date (Optional)</label>
              <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm" />
            </div>
          </div>
          <button className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10">
            Assign Shift
          </button>
        </div>
      </div>

      <div className="lg:col-span-2 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
          <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:calendar" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Current Shift Assignments
          </h5>
        </div>
        <div className="p-3 sm:p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[10px] sm:text-xs">
                <tr>
                  <th className="p-2 sm:p-3">Employee</th>
                  <th className="p-2 sm:p-3 hidden sm:table-cell">Shift</th>
                  <th className="p-2 sm:p-3 hidden md:table-cell">Start Date</th>
                  <th className="p-2 sm:p-3 hidden lg:table-cell">End Date</th>
                  <th className="p-2 sm:p-3">Status</th>
                  <th className="p-2 sm:p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {shiftAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-400">
                      <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      No shift assignments yet
                    </td>
                  </tr>
                ) : (
                  shiftAssignments.map((assignment) => {
                    const shift = shifts.find((s) => s.id === assignment.shiftId);
                    return (
                      <tr key={assignment.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-2 sm:p-3 font-medium">{assignment.employeeId}</td>
                        <td className="p-2 sm:p-3 hidden sm:table-cell">{shift?.name || "Unknown"}</td>
                        <td className="p-2 sm:p-3 hidden md:table-cell">{assignment.startDate}</td>
                        <td className="p-2 sm:p-3 hidden lg:table-cell">{assignment.endDate || "Ongoing"}</td>
                        <td className="p-2 sm:p-3">{getStatusBadge(assignment.isActive ? "active" : "inactive")}</td>
                        <td className="p-2 sm:p-3 text-right">
                          <button className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                            <Icon icon="heroicons:pencil" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
  );

  const renderRostering = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
          <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:calendar-check" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Create Shift Roster
          </h5>
        </div>
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Shift</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
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
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Period</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                value={rosterPeriod}
                onChange={(e) => setRosterPeriod(e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={rosterStartDate}
                onChange={(e) => setRosterStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 flex items-center justify-center gap-2"
                onClick={generateRoster}
              >
                <Icon icon="heroicons:calendar" className="w-4 h-4" />
                Generate Roster
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
          <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:document-text" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Shift Rosters
          </h5>
        </div>
        <div className="p-3 sm:p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[10px] sm:text-xs">
                <tr>
                  <th className="p-2 sm:p-3">Roster Name</th>
                  <th className="p-2 sm:p-3 hidden sm:table-cell">Shift</th>
                  <th className="p-2 sm:p-3 hidden md:table-cell">Period</th>
                  <th className="p-2 sm:p-3 hidden lg:table-cell">Start Date</th>
                  <th className="p-2 sm:p-3">Status</th>
                  <th className="p-2 sm:p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rosters.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-400">
                      <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      No rosters created yet
                    </td>
                  </tr>
                ) : (
                  rosters.map((roster) => {
                    const shift = shifts.find((s) => s.id === roster.shiftId);
                    return (
                      <tr key={roster.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-2 sm:p-3 font-medium">{roster.name}</td>
                        <td className="p-2 sm:p-3 hidden sm:table-cell">{shift?.name || "Unknown"}</td>
                        <td className="p-2 sm:p-3 hidden md:table-cell">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${roster.period === "weekly" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                            {roster.period}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 hidden lg:table-cell">{roster.startDate}</td>
                        <td className="p-2 sm:p-3">{getStatusBadge(roster.status)}</td>
                        <td className="p-2 sm:p-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                              onClick={() => publishRoster(roster.id)}
                              disabled={roster.published}
                              title="Publish Roster"
                            >
                              <Icon icon="heroicons:bell" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors" title="View Roster">
                              <Icon icon="heroicons:eye" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
  );

  const renderSwapRequests = () => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:arrow-left-right" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          Shift Swap Requests
        </h5>
        <button
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
          onClick={() => setShowSwapModal(true)}
        >
          <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
          New Swap Request
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[10px] sm:text-xs">
              <tr>
                <th className="p-2 sm:p-3">Employee</th>
                <th className="p-2 sm:p-3 hidden sm:table-cell">Current Shift</th>
                <th className="p-2 sm:p-3 hidden md:table-cell">Requested Shift</th>
                <th className="p-2 sm:p-3 hidden lg:table-cell">Swap Date</th>
                <th className="p-2 sm:p-3">Status</th>
                <th className="p-2 sm:p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {swapRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-400">
                    <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No swap requests
                  </td>
                </tr>
              ) : (
                swapRequests.map((request) => {
                  const currentShift = shifts.find((s) => s.id === request.currentShiftId);
                  const requestedShift = shifts.find((s) => s.id === request.requestedShiftId);
                  return (
                    <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2 sm:p-3 font-medium">{request.employeeId}</td>
                      <td className="p-2 sm:p-3 hidden sm:table-cell">{currentShift?.name || "Unknown"}</td>
                      <td className="p-2 sm:p-3 hidden md:table-cell">{requestedShift?.name || "Unknown"}</td>
                      <td className="p-2 sm:p-3 hidden lg:table-cell">{request.swapDate}</td>
                      <td className="p-2 sm:p-3">{getStatusBadge(request.status)}</td>
                      <td className="p-2 sm:p-3 text-right">
                        {request.status === "pending" && (
                          <div className="flex justify-end gap-1.5">
                            <button
                              className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                              onClick={() => handleSwapApproval(request.id, true)}
                              title="Approve"
                            >
                              <Icon icon="heroicons:check" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              className="p-1.5 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                              onClick={() => handleSwapApproval(request.id, false)}
                              title="Reject"
                            >
                              <Icon icon="heroicons:x-mark" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
  );

  const renderFlexibleArrangements = () => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:briefcase" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          Flexible Work Arrangements
        </h5>
        <button
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
          onClick={() => setShowFlexibleModal(true)}
        >
          <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
          Add Arrangement
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[10px] sm:text-xs">
              <tr>
                <th className="p-2 sm:p-3">Employee</th>
                <th className="p-2 sm:p-3 hidden sm:table-cell">Type</th>
                <th className="p-2 sm:p-3 hidden md:table-cell">Core Hours</th>
                <th className="p-2 sm:p-3 hidden lg:table-cell">Flexible Window</th>
                <th className="p-2 sm:p-3">Status</th>
                <th className="p-2 sm:p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {flexibleArrangements.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-400">
                    <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No flexible arrangements configured
                  </td>
                </tr>
              ) : (
                flexibleArrangements.map((arrangement) => (
                  <tr key={arrangement.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3 font-medium">{arrangement.employeeId}</td>
                    <td className="p-2 sm:p-3 hidden sm:table-cell">
                      {getShiftTypeBadge(arrangement.arrangementType)}
                    </td>
                    <td className="p-2 sm:p-3 hidden md:table-cell">
                      {arrangement.coreHours?.start} - {arrangement.coreHours?.end}
                    </td>
                    <td className="p-2 sm:p-3 hidden lg:table-cell">
                      {arrangement.flexibleStart} - {arrangement.flexibleEnd}
                    </td>
                    <td className="p-2 sm:p-3">{getStatusBadge(arrangement.isActive ? "active" : "inactive")}</td>
                    <td className="p-2 sm:p-3 text-right">
                      <button className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <Icon icon="heroicons:pencil" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWorkHourRules = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
          <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:settings" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Attendance Rules
          </h5>
        </div>
        <div className="p-3 sm:p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Late Arrival Grace Period (minutes)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Minimum Work Hours</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Half-Day Threshold (hours)</label>
            <input
              type="number"
              step="0.5"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
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
              <span className="text-xs text-slate-700">Weekend Working Requires Approval</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
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
              <span className="text-xs text-slate-700">Holiday Working Requires Approval</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
          <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:clock" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Overtime Rules
          </h5>
        </div>
        <div className="p-3 sm:p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Weekday Overtime Rate</label>
            <input
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Weekend Overtime Rate</label>
            <input
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Holiday Overtime Rate</label>
            <input
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Daily Overtime Cap (hours)</label>
            <input
              type="number"
              step="0.5"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Weekly Overtime Cap (hours)</label>
            <input
              type="number"
              step="0.5"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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

      <div className="lg:col-span-2 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
          <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:coffee" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Break Management
          </h5>
        </div>
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
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
                <span className="text-xs text-slate-700">Allow Multiple Breaks</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Max Break Duration (minutes)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
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
                <span className="text-xs text-slate-700">Break Punch Required</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Unpaid Break Threshold (minutes)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
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
  );

  return (
    <div className="w-full mx-auto max-w-7xl space-y-4 sm:space-y-6 md:px-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Icon icon="heroicons:clock" className="w-6 h-6 text-blue-600" />
            Shift Management & Rostering
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage shifts, rosters, flexible work arrangements, and work hour rules
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Icon icon="heroicons:bell" className="w-4 h-4" />
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {showNotifications && (
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h6 className="text-xs font-bold text-slate-800">Shift Change Notifications</h6>
            <button
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              onClick={() => {
                const updated = notifications.map(n => ({ ...n, read: true }));
                setNotifications(updated);
                localStorage.setItem('shiftNotifications', JSON.stringify(updated));
              }}
            >
              Mark All Read
            </button>
          </div>
          <div className="p-3 sm:p-4 max-h-80 overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-4">No notifications</p>
            ) : (
              notifications.slice(0, 20).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-xl border ${notification.read ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-200'} cursor-pointer transition-all hover:shadow-sm`}
                  onClick={() => {
                    const updated = notifications.map(n =>
                      n.id === notification.id ? { ...n, read: true } : n
                    );
                    setNotifications(updated);
                    localStorage.setItem('shiftNotifications', JSON.stringify(updated));
                  }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {notification.type?.replace(/_/g, ' ').toUpperCase() || 'Notification'}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-[8px] font-bold">New</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm rounded-2xl p-1.5 sm:p-2 overflow-x-auto">
        <div className="flex flex-wrap gap-1 min-w-[420px]">
          {[
            { id: "shifts", label: "Shift Master", icon: "heroicons:clock" },
            { id: "assignment", label: "Shift Assignment", icon: "heroicons:users" },
            { id: "rostering", label: "Rostering", icon: "heroicons:calendar-check" },
            { id: "swap", label: "Shift Swap", icon: "heroicons:arrow-left-right" },
            { id: "flexible", label: "Flexible Work", icon: "heroicons:briefcase" },
            { id: "rules", label: "Work Hour Rules", icon: "heroicons:settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon icon={tab.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {activeTab === "shifts" && renderShiftMaster()}
        {activeTab === "assignment" && renderShiftAssignment()}
        {activeTab === "rostering" && renderRostering()}
        {activeTab === "swap" && renderSwapRequests()}
        {activeTab === "flexible" && renderFlexibleArrangements()}
        {activeTab === "rules" && renderWorkHourRules()}
      </div>

      {showShiftModal && (
        <ShiftModal
          isOpen={showShiftModal}
          onClose={() => {
            setShowShiftModal(false);
            setEditingShift(null);
          }}
          editingShift={editingShift}
          shiftForm={shiftForm}
          setShiftForm={setShiftForm}
          handleAddShift={handleAddShift}
          addBreakTime={addBreakTime}
          updateBreakTime={updateBreakTime}
          removeBreakTime={removeBreakTime}
        />
      )}

      {showSwapModal && (
        <SwapRequestModal
          isOpen={showSwapModal}
          onClose={() => setShowSwapModal(false)}
          swapForm={swapForm}
          setSwapForm={setSwapForm}
          handleSwapRequest={handleSwapRequest}
          shifts={shifts}
          employees={[]}
        />
      )}

      {showFlexibleModal && (
        <FlexibleArrangementModal
          isOpen={showFlexibleModal}
          onClose={() => setShowFlexibleModal(false)}
          flexibleForm={flexibleForm}
          setFlexibleForm={setFlexibleForm}
          handleFlexibleArrangement={handleFlexibleArrangement}
          employees={[]}
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

export default ShiftManagement;