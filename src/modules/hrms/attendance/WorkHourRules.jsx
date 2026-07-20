import React, { useState, useEffect, useReducer, useContext, createContext } from "react";
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx';

import ExportModal from "../modal/ExportModal";
import ImportModal from "../modal/ImportModal";
import { attendanceAPI } from "../../../shared/utils/api";

const WorkHourContext = createContext();

const useWorkHourRules = () => {
  const context = useContext(WorkHourContext);
  if (!context) {
    throw new Error("useWorkHourRules must be used within WorkHourProvider");
  }
  return context;
};

const initialState = {
  attendanceRules: {
    lateArrival: {
      gracePeriod: 0,
      deductionType: "",
      deductionAmount: 0,
      enabled: false,
      maxAllowed: 0,
      monthlyLimit: 0,
    },
    earlyDeparture: {
      allowed: false,
      penaltyType: "",
      penaltyAmount: 0,
      requireApproval: false,
      gracePeriod: 0,
    },
    minWorkHours: 0,
    halfDayCriteria: {
      hours: 0,
      considerAsHalfDay: false,
      applyAfterHours: 0,
      markAsAbsentBelow: 0,
    },
    shortLeave: {
      maxDuration: 0,
      maxFrequency: 0,
      requiresApproval: false,
      autoDeduct: false,
      categories: [],
    },
    continuousAbsence: {
      threshold: 0,
      autoAlert: false,
      escalationLevels: [],
      currentLevel: "",
      notifyAfterDays: 0,
    },
    weekendWorking: {
      requiresApproval: false,
      compensationType: "",
      rate: 0,
      maxHours: 0,
      advanceNotice: 0,
    },
    holidayWorking: {
      requiresApproval: false,
      compensationType: "",
      rate: 0,
      canTakeCompOff: false,
      compOffValidity: 0,
      advanceApproval: false,
    },
    workFromHome: {
      allowed: false,
      maxDaysPerWeek: 0,
      requireApproval: false,
      trackProductivity: false,
    },
  },
  overtime: {
    eligibility: {
      minWorkHours: 0,
      excludeWeekends: false,
      employeeLevels: [],
      departments: [],
      probationPeriod: 0,
      includeWFH: false,
    },
    calculation: {
      method: "",
      weekdayRate: 0,
      weekendRate: 0,
      holidayRate: 0,
      fixedRate: 0,
      nightShiftBonus: 0,
      roundToNearest: 0,
    },
    approvalWorkflow: {
      levels: [],
      autoApproveAfter: 0,
      requireDocumentation: false,
      maxApprovalDays: 0,
      notifyIfPending: false,
      escalationAfterHours: 0,
    },
    caps: {
      daily: 0,
      weekly: 0,
      monthly: 0,
      quarterly: 0,
      yearly: 0,
      consecutiveDays: 0,
    },
    compensation: {
      type: "",
      compOffValidity: 0,
      autoConvertToCompOff: false,
      conversionRate: 0,
      paymentCycle: "",
      taxDeductible: false,
    },
    categories: [],
  },
  breakManagement: {
    breaks: [],
    enforcement: {
      strictMode: false,
      allowMultipleBreaks: false,
      maxBreaksPerDay: 0,
      trackBreakPunches: false,
      deductFromWorkHours: false,
      enforceSequence: false,
      autoLogBreaks: false,
      breakReminders: false,
      reminderBefore: 0,
    },
    policies: {
      minBreakDuration: 0,
      maxBreakDuration: 0,
      totalBreakLimit: 0,
      mealBreakRequired: false,
      mealBreakAfterHours: 0,
      consecutiveWorkLimit: 0,
      mandatoryRestAfterOvertime: 0,
    },
  },
  analytics: {
    complianceReports: [],
    overtimeReports: [],
    breakReports: [],
    violationTrends: [],
  },
  settings: {
    currency: "",
    timeFormat: "",
    dateFormat: "",
    weekStart: "",
    fiscalYearStart: "",
    autoSave: false,
    backupFrequency: "",
    notificationEmails: false,
    smsAlerts: false,
  },
};

const rulesReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_ATTENDANCE_RULE":
      return {
        ...state,
        attendanceRules: {
          ...state.attendanceRules,
          [action.section]: {
            ...state.attendanceRules[action.section],
            ...action.payload,
          },
        },
      };
    case "UPDATE_OVERTIME_RULE":
      return {
        ...state,
        overtime: {
          ...state.overtime,
          [action.section]: {
            ...state.overtime[action.section],
            ...action.payload,
          },
        },
      };
    case "UPDATE_BREAK":
      return {
        ...state,
        breakManagement: {
          ...state.breakManagement,
          breaks: state.breakManagement.breaks.map((breakItem) =>
            breakItem.id === action.payload.id
              ? { ...breakItem, ...action.payload.data }
              : breakItem
          ),
        },
      };
    case "ADD_BREAK":
      return {
        ...state,
        breakManagement: {
          ...state.breakManagement,
          breaks: [
            ...state.breakManagement.breaks,
            {
              id: Date.now(),
              name: "",
              type: "unpaid",
              duration: 0,
              autoDeduct: false,
              mandatory: false,
              windowStart: "",
              windowEnd: "",
              flexibleWindow: 0,
              maxDelay: 0,
              minGapAfter: 0,
            },
          ],
        },
      };
    case "REMOVE_BREAK":
      return {
        ...state,
        breakManagement: {
          ...state.breakManagement,
          breaks: state.breakManagement.breaks.filter(
            (breakItem) => breakItem.id !== action.payload
          ),
        },
      };
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    case "RESET_RULES":
      return initialState;
    case "LOAD_RULES":
      return action.payload;
    default:
      return state;
  }
};

const AttendanceRules = () => {
  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem("attendanceRules");
    if (savedRules) {
      return JSON.parse(savedRules);
    }
    return {
      lateArrival: {
        enabled: false,
        gracePeriod: 0,
        deductionType: "perMinute",
        deductionAmount: 0,
        monthlyLimit: 0,
        maxAllowed: 0,
        autoDeduct: false,
        deductionOptions: [
          { value: "perMinute", label: "Per Minute" },
          { value: "perHour", label: "Per Hour" },
          { value: "fixed", label: "Fixed Amount" },
          { value: "leave", label: "Leave Deduction" },
          { value: "warning", label: "Warning Only" },
        ],
      },
      earlyDeparture: {
        allowed: false,
        penaltyType: "salaryDeduction",
        penaltyAmount: 0,
        gracePeriod: 0,
        requireApproval: false,
        maxInstances: 0,
        penaltyOptions: [
          { value: "salaryDeduction", label: "Salary Deduction" },
          { value: "leaveDeduction", label: "Leave Deduction" },
          { value: "warning", label: "Warning Notice" },
          { value: "both", label: "Both Salary & Leave" },
          { value: "none", label: "No Penalty" },
        ],
      },
      minWorkHours: 0,
      halfDayCriteria: {
        hours: 0,
        considerAsHalfDay: false,
        markAsAbsentBelow: false,
        applyAfterHours: 0,
        autoDeduct: false,
      },
      shortLeave: {
        maxDuration: 0,
        maxFrequency: 0,
        requiresApproval: false,
        autoDeduct: false,
        categories: [],
      },
      continuousAbsence: {
        threshold: 0,
        escalationLevels: ["Manager", "HR", "Director", "CEO"],
        notifyAfterDays: 0,
        currentLevel: "",
        autoAlert: false,
        emailAlerts: false,
        smsAlerts: false,
      },
      weekendWorking: {
        requiresApproval: false,
        rate: 0,
        maxHours: 0,
        advanceNotice: 0,
        compOffAllowed: false,
        compOffValidity: 0,
      },
      holidayWorking: {
        requiresApproval: false,
        rate: 0,
        canTakeCompOff: false,
        compOffValidity: 0,
        advanceApproval: false,
        mandatoryRate: 0,
      },
    };
  });

  useEffect(() => {
    localStorage.setItem("attendanceRules", JSON.stringify(rules));
  }, [rules]);

  // Backend WorkHourRule stores each of these as a flexible JSON column
  // (late_arrival_rules, early_departure_rules, work_hours_half_day_config,
  // short_leave_policies, continuous_absence_detection, weekend_working,
  // holiday_working) — a near 1:1 match to this tab's local object shape,
  // so whole objects pass through rather than needing field-by-field
  // translation. Overwrites the localStorage defaults above with real
  // saved values once the fetch resolves.
  useEffect(() => {
    attendanceAPI.getActiveWorkHourPolicy()
      .then((policy) => {
        setRules((prev) => ({
          ...prev,
          lateArrival: { ...prev.lateArrival, ...(policy.late_arrival_rules || {}), gracePeriod: policy.grace_period_minutes ?? prev.lateArrival.gracePeriod },
          earlyDeparture: { ...prev.earlyDeparture, ...(policy.early_departure_rules || {}) },
          minWorkHours: policy.min_daily_hours ?? prev.minWorkHours,
          halfDayCriteria: { ...prev.halfDayCriteria, ...(policy.work_hours_half_day_config || {}) },
          shortLeave: { ...prev.shortLeave, ...(policy.short_leave_policies || {}) },
          continuousAbsence: { ...prev.continuousAbsence, ...(policy.continuous_absence_detection || {}), notifyAfterDays: policy.absence_alert_days ?? prev.continuousAbsence.notifyAfterDays },
          weekendWorking: { ...prev.weekendWorking, ...(policy.weekend_working || {}), rate: policy.weekend_rate_multiplier ?? prev.weekendWorking.rate },
          holidayWorking: { ...prev.holidayWorking, ...(policy.holiday_working || {}) },
        }));
      })
      .catch((err) => console.error('Failed to load attendance rules from backend:', err));
  }, []);

  const handleChange = (section, data) => {
    setRules((prev) => ({
      ...prev,
      [section]: typeof data === "object" ? { ...prev[section], ...data } : data,
    }));
  };

  const featureStats = {
    activeRules: [
      rules.lateArrival.enabled,
      rules.earlyDeparture.allowed,
      rules.shortLeave.requiresApproval,
      rules.continuousAbsence.autoAlert,
      rules.weekendWorking.requiresApproval,
      rules.holidayWorking.requiresApproval,
    ].filter(Boolean).length,
    totalConfigurations: 8,
    complianceScore: 0,
  };

  return (
    <div className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:calendar" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span className="hidden xs:inline">Attendance Rules Engine</span>
          <span className="xs:hidden">Attendance</span>
        </h5>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10">
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            <span className="hidden xs:inline">Export</span>
          </button>
          <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg sm:rounded-xl text-xs font-bold transition-all">
            <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
            <span className="hidden xs:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Icon icon="heroicons:database" className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-blue-700">
              <span className="font-semibold">Auto-Saved:</span> Changes saved automatically.
              <span className="hidden xs:inline"> Last updated: {new Date().toLocaleTimeString()}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-700 font-medium hidden xs:inline">Compliance:</span>
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {featureStats.complianceScore}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {[
            { title: "Active Rules", value: featureStats.activeRules, color: "emerald", short: "Rules" },
            { title: "Grace Period", value: `${rules.lateArrival.gracePeriod} min`, color: "amber", short: "Grace" },
            { title: "Min Hours", value: `${rules.minWorkHours}h`, color: "blue", short: "Min Hrs" },
            { title: "Short Leave", value: rules.shortLeave.categories.length, color: "cyan", short: "Leave" },
            { title: "Absence Alert", value: `${rules.continuousAbsence.threshold}d`, color: "rose", short: "Alert" },
            { title: "Weekend Rate", value: `${rules.weekendWorking.rate}x`, color: "slate", short: "Weekend" },
          ].map((stat, index) => (
            <div key={index} className="bg-slate-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 text-center">
              <p className="text-[8px] sm:text-[10px] md:text-xs font-medium text-slate-500">
                <span className="hidden sm:inline">{stat.title}</span>
                <span className="sm:hidden">{stat.short}</span>
              </p>
              <p className={`text-xs sm:text-sm md:text-base font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Icon icon="heroicons:clock" className="w-4 h-4 text-amber-500" />
                <span className="hidden xs:inline">Late Arrival Rules</span>
                <span className="xs:hidden">Late Arrival</span>
              </h6>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  checked={rules.lateArrival.enabled}
                  onChange={(e) => handleChange("lateArrival", { enabled: e.target.checked })}
                />
                <span className="text-[10px] sm:text-xs font-medium text-slate-700">
                  {rules.lateArrival.enabled ? "Active" : "Inactive"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Grace Period</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.lateArrival.gracePeriod}
                    onChange={(e) => handleChange("lateArrival", { gracePeriod: parseInt(e.target.value) })}
                    min="0"
                    max="60"
                    disabled={!rules.lateArrival.enabled}
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500">min</span>
                </div>
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Deduction Type</label>
                <select
                  className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                  value={rules.lateArrival.deductionType}
                  onChange={(e) => handleChange("lateArrival", { deductionType: e.target.value })}
                  disabled={!rules.lateArrival.enabled}
                >
                  <option value="perMinute">Per Min</option>
                  <option value="perHour">Per Hour</option>
                  <option value="fixed">Fixed</option>
                  <option value="leave">Leave</option>
                </select>
              </div>
              <div className="col-span-1 xs:col-span-2">
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Deduction Amount</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] sm:text-xs text-slate-500">$</span>
                  <input
                    type="number"
                    className="flex-1 px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.lateArrival.deductionAmount}
                    onChange={(e) => handleChange("lateArrival", { deductionAmount: parseFloat(e.target.value) })}
                    step="0.5"
                    min="0"
                    disabled={!rules.lateArrival.enabled}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Icon icon="heroicons:clock" className="w-4 h-4 text-rose-500" />
                <span className="hidden xs:inline">Early Departure Rules</span>
                <span className="xs:hidden">Early Departure</span>
              </h6>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  checked={rules.earlyDeparture.allowed}
                  onChange={(e) => handleChange("earlyDeparture", { allowed: e.target.checked })}
                />
                <span className="text-[10px] sm:text-xs font-medium text-slate-700">
                  {rules.earlyDeparture.allowed ? "Active" : "Inactive"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Penalty Type</label>
                <select
                  className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                  value={rules.earlyDeparture.penaltyType}
                  onChange={(e) => handleChange("earlyDeparture", { penaltyType: e.target.value })}
                  disabled={!rules.earlyDeparture.allowed}
                >
                  <option value="salaryDeduction">Salary</option>
                  <option value="leaveDeduction">Leave</option>
                  <option value="warning">Warning</option>
                  <option value="both">Both</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Grace Period</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.earlyDeparture.gracePeriod}
                    onChange={(e) => handleChange("earlyDeparture", { gracePeriod: parseInt(e.target.value) })}
                    min="0"
                    max="60"
                    disabled={!rules.earlyDeparture.allowed}
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500">min</span>
                </div>
              </div>
              <div className="col-span-1 xs:col-span-2">
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Penalty Amount</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] sm:text-xs text-slate-500">$</span>
                  <input
                    type="number"
                    className="flex-1 px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.earlyDeparture.penaltyAmount}
                    onChange={(e) => handleChange("earlyDeparture", { penaltyAmount: parseFloat(e.target.value) })}
                    step="0.5"
                    min="0"
                    disabled={!rules.earlyDeparture.allowed}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:hourglass" className="w-4 h-4 text-blue-500" />
              <span className="hidden xs:inline">Work Hours</span>
              <span className="xs:hidden">Hours</span>
            </h6>
            <div>
              <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Minimum Work Hours</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={rules.minWorkHours}
                  onChange={(e) => handleChange("minWorkHours", parseFloat(e.target.value))}
                  min="0"
                  max="12"
                  step="0.5"
                />
                <span className="text-[10px] sm:text-xs text-slate-500">hrs</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:calendar" className="w-4 h-4 text-amber-500" />
              <span className="hidden xs:inline">Half-Day Criteria</span>
              <span className="xs:hidden">Half-Day</span>
            </h6>
            <div>
              <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Hours Threshold</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={rules.halfDayCriteria.hours}
                  onChange={(e) => handleChange("halfDayCriteria", { ...rules.halfDayCriteria, hours: parseFloat(e.target.value) })}
                  min="0"
                  max="8"
                  step="0.5"
                />
                <span className="text-[10px] sm:text-xs text-slate-500">hrs</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:check-badge" className="w-4 h-4 text-emerald-500" />
              <span className="hidden xs:inline">Settings</span>
              <span className="xs:hidden">Settings</span>
            </h6>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  checked={rules.halfDayCriteria.considerAsHalfDay}
                  onChange={(e) => handleChange("halfDayCriteria", { ...rules.halfDayCriteria, considerAsHalfDay: e.target.checked })}
                />
                <span className="text-[10px] sm:text-xs text-slate-700">Consider Half-Day</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  checked={rules.halfDayCriteria.autoDeduct}
                  onChange={(e) => handleChange("halfDayCriteria", { ...rules.halfDayCriteria, autoDeduct: e.target.checked })}
                />
                <span className="text-[10px] sm:text-xs text-slate-700">Auto-Deduct</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:calendar" className="w-4 h-4 text-cyan-500" />
              <span className="hidden xs:inline">Short Leave Categories</span>
              <span className="xs:hidden">Leave Categories</span>
            </h6>
            <span className="text-[10px] sm:text-xs text-slate-500">{rules.shortLeave.categories.length} categories</span>
          </div>
          {rules.shortLeave.categories.length === 0 ? (
            <div className="text-center py-4">
              <Icon icon="heroicons:folder-open" className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No leave categories configured</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
              {rules.shortLeave.categories.map((cat) => (
                <div key={cat.id} className="bg-slate-50 rounded-lg p-2 text-center">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">{cat.name}</p>
                  <p className="text-[8px] sm:text-[10px] text-slate-500">{cat.maxDuration}h • {cat.requiresDoc ? "Doc ✓" : "No Doc"}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:calendar-days" className="w-4 h-4 text-emerald-500" />
              <span className="hidden xs:inline">Weekend Working</span>
              <span className="xs:hidden">Weekend</span>
            </h6>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Rate</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.weekendWorking.rate}
                    onChange={(e) => handleChange("weekendWorking", { ...rules.weekendWorking, rate: parseFloat(e.target.value) })}
                    min="0"
                    step="0.25"
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500">x</span>
                </div>
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Max Hours</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.weekendWorking.maxHours}
                    onChange={(e) => handleChange("weekendWorking", { ...rules.weekendWorking, maxHours: parseInt(e.target.value) })}
                    min="0"
                    max="12"
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500">hrs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:calendar" className="w-4 h-4 text-rose-500" />
              <span className="hidden xs:inline">Holiday Working</span>
              <span className="xs:hidden">Holiday</span>
            </h6>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Rate</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.holidayWorking.rate}
                    onChange={(e) => handleChange("holidayWorking", { ...rules.holidayWorking, rate: parseFloat(e.target.value) })}
                    min="0"
                    step="0.25"
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500">x</span>
                </div>
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Comp-Off Validity</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.holidayWorking.compOffValidity}
                    onChange={(e) => handleChange("holidayWorking", { ...rules.holidayWorking, compOffValidity: parseInt(e.target.value) })}
                    min="0"
                    max="365"
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500">days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OvertimeManagement = () => {
  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem("overtimeManagementRules");
    if (savedRules) {
      return JSON.parse(savedRules);
    }
    return {
      eligibility: {
        minWorkHours: 0,
        probationPeriod: 0,
        employeeLevels: [],
        excludeWeekends: false,
        includeWFH: false,
        minServiceMonths: 0,
        departmentEligibility: [],
      },
      calculation: {
        method: "multiplier",
        weekdayRate: 0,
        weekendRate: 0,
        holidayRate: 0,
        nightShiftBonus: 0,
        fixedRate: 0,
        roundToNearest: 0,
        includeHolidays: false,
        includeNightShift: false,
      },
      caps: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
        consecutiveDays: 0,
      },
      approvalWorkflow: {
        levels: [],
        autoApproveAfter: 0,
        maxApprovalDays: 0,
        requireDocumentation: false,
        notifyIfPending: false,
        escalationHours: 0,
        multipleApprovers: false,
      },
      compensation: {
        type: "both",
        compOffValidity: 0,
        paymentCycle: "monthly",
        conversionRate: 0,
        autoConvertToCompOff: false,
        taxDeductible: false,
        minHoursForPay: 0,
        minHoursForCompOff: 0,
      },
      reports: {
        autoGenerate: false,
        frequency: "monthly",
        notifyManagers: false,
        retentionPeriod: 0,
        includeAnalytics: false,
        reportTypes: [],
      },
      categories: [],
      analytics: {
        enabled: false,
        trackTrends: false,
        predictiveAnalysis: false,
        alertThreshold: 0,
        benchmarkHours: 0,
      },
    };
  });

  useEffect(() => {
    localStorage.setItem("overtimeManagementRules", JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    attendanceAPI.getActiveWorkHourPolicy()
      .then((policy) => {
        setRules((prev) => ({
          ...prev,
          eligibility: { ...prev.eligibility, ...(policy.overtime_eligibility || {}) },
          calculation: { ...prev.calculation, ...(policy.overtime_calculation || {}) },
          caps: { ...prev.caps, ...(policy.overtime_caps || {}) },
          approvalWorkflow: { ...prev.approvalWorkflow, ...(policy.overtime_approval_workflow || {}) },
          compensation: { ...prev.compensation, ...(policy.overtime_compensation_settings || {}) },
          reports: { ...prev.reports, ...(policy.overtime_reports_settings || {}) },
          categories: policy.overtime_categories?.length ? policy.overtime_categories : prev.categories,
        }));
      })
      .catch((err) => console.error('Failed to load overtime rules from backend:', err));
  }, []);

  const handleChange = (section, data) => {
    setRules((prev) => ({
      ...prev,
      [section]: typeof data === "object" ? { ...prev[section], ...data } : data,
    }));
  };

  const stats = {
    totalCategories: rules.categories.length,
    avgOvertimeRate: 0,
    totalMonthlyCap: rules.caps.monthly,
    totalAnnualCap: rules.caps.yearly,
    approvalRate: rules.approvalWorkflow.levels.length > 1 ? "Multi-level" : "Single-level",
  };

  return (
    <div className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:clock" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span className="hidden xs:inline">Overtime Management System</span>
          <span className="xs:hidden">Overtime</span>
        </h5>
      </div>

      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { title: "Categories", value: stats.totalCategories, color: "blue" },
            { title: "Avg Rate", value: `${stats.avgOvertimeRate}x`, color: "amber" },
            { title: "Monthly Cap", value: `${stats.totalMonthlyCap}h`, color: "emerald" },
            { title: "Annual Cap", value: `${stats.totalAnnualCap}h`, color: "purple" },
          ].map((stat, index) => (
            <div key={index} className="bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-500">
                <span className="">{stat.title}</span>
              </p>
              <p className={`text-xs sm:text-sm font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:user-group" className="w-4 h-4 text-blue-500" />
              <span className="hidden xs:inline">Eligibility Criteria</span>
              <span className="xs:hidden">Eligibility</span>
            </h6>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Min Work Hours</label>
                <input
                  type="number"
                  className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={rules.eligibility.minWorkHours}
                  onChange={(e) => handleChange("eligibility", { minWorkHours: parseInt(e.target.value) })}
                  min="0"
                  max="12"
                />
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Probation</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.eligibility.probationPeriod}
                    onChange={(e) => handleChange("eligibility", { probationPeriod: parseInt(e.target.value) })}
                    min="0"
                    max="180"
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500">days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:calculator" className="w-4 h-4 text-amber-500" />
              <span className="hidden xs:inline">Calculation</span>
              <span className="xs:hidden">Calc</span>
            </h6>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Weekday Rate</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.calculation.weekdayRate}
                    onChange={(e) => handleChange("calculation", { weekdayRate: parseFloat(e.target.value) })}
                    min="0"
                    step="0.25"
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500">x</span>
                </div>
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500">Weekend Rate</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={rules.calculation.weekendRate}
                    onChange={(e) => handleChange("calculation", { weekendRate: parseFloat(e.target.value) })}
                    min="0"
                    step="0.25"
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500">x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
          <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:chart-bar" className="w-4 h-4 text-purple-500" />
            <span className="hidden xs:inline">Overtime Caps</span>
            <span className="xs:hidden">Caps</span>
          </h6>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {Object.entries(rules.caps).map(([key, value]) => (
              <div key={key}>
                <label className="block text-[9px] sm:text-[10px] font-semibold text-slate-500 capitalize">{key}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={value}
                    onChange={(e) => handleChange("caps", { [key]: parseInt(e.target.value) })}
                    min="0"
                  />
                  <span className="text-[10px] sm:text-xs text-slate-500">{key === "consecutiveDays" ? "days" : "h"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden">
          <div className="px-3 sm:px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:list-bullet" className="w-4 h-4 text-blue-500" />
              <span className="hidden xs:inline">Overtime Categories</span>
              <span className="xs:hidden">Categories</span>
            </h6>
            <span className="text-[10px] sm:text-xs text-slate-500">{rules.categories.length} categories</span>
          </div>
          {rules.categories.length === 0 ? (
            <div className="text-center py-8">
              <Icon icon="heroicons:folder-open" className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No overtime categories configured</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[10px] sm:text-xs md:text-sm">
                <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[8px] sm:text-[10px]">
                  <tr>
                    <th className="p-2 sm:p-3">Category</th>
                    <th className="p-2 sm:p-3">Rate</th>
                    <th className="p-2 sm:p-3 hidden xs:table-cell">Daily</th>
                    <th className="p-2 sm:p-3 hidden sm:table-cell">Weekly</th>
                    <th className="p-2 sm:p-3 hidden md:table-cell">Monthly</th>
                    <th className="p-2 sm:p-3">Approval</th>
                    <th className="p-2 sm:p-3 hidden lg:table-cell">Comp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rules.categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50">
                      <td className="p-2 sm:p-3 font-medium text-[10px] sm:text-xs">{cat.name}</td>
                      <td className="p-2 sm:p-3 text-[10px] sm:text-xs">{cat.rate}x</td>
                      <td className="p-2 sm:p-3 hidden xs:table-cell text-[10px] sm:text-xs">{cat.caps.daily}h</td>
                      <td className="p-2 sm:p-3 hidden sm:table-cell text-[10px] sm:text-xs">{cat.caps.weekly}h</td>
                      <td className="p-2 sm:p-3 hidden md:table-cell text-[10px] sm:text-xs">{cat.caps.monthly}h</td>
                      <td className="p-2 sm:p-3">
                        <span className={`inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${cat.requiresApproval ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                          <span className="hidden xs:inline">{cat.requiresApproval ? "Required" : "Not Required"}</span>
                          <span className="xs:hidden">{cat.requiresApproval ? "✓" : "✗"}</span>
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 hidden lg:table-cell">
                        <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium bg-blue-50 text-blue-700">
                          {cat.compensationType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BreakManagement = () => {
  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem("breakManagementRules");
    if (savedRules) {
      return JSON.parse(savedRules);
    }
    return {
      breaks: [],
      enforcement: {
        trackBreakPunches: false,
        autoLogBreaks: false,
        breakReminders: false,
        enforceSequence: false,
        reminderBefore: 0,
        maxBreaksPerDay: 0,
        punchGracePeriod: 0,
        strictMode: false,
        deductFromWorkHours: false,
        allowMultipleBreaks: false,
        requirePunchForPaidBreaks: false,
        requirePunchForUnpaidBreaks: false,
        autoEndBreaks: false,
        breakOvertimeAlert: false,
      },
      policies: {
        mealBreakRequired: false,
        mealBreakAfterHours: 0,
        autoDeductDuration: 0,
        maxAutoExtension: 0,
        minBreakBetweenShifts: 0,
        breakCarryForward: false,
        breakAccrual: false,
        breakExpiryDays: 0,
        holidayBreakRules: "",
        weekendBreakRules: "",
      },
    };
  });

  const [showBreakModal, setShowBreakModal] = useState(false);
  const [editingBreak, setEditingBreak] = useState(null);
  const [breakForm, setBreakForm] = useState({
    name: "",
    type: "paid",
    duration: 0,
    autoDeduct: false,
    mandatory: false,
    windowStart: "",
    windowEnd: "",
    flexibleWindow: 0,
    maxDelay: 0,
    minGapAfter: 0,
    punchRequired: false,
    autoPunchOut: false,
    gracePeriod: 0,
    maxExtension: 0,
    description: "",
  });

  useEffect(() => {
    localStorage.setItem("breakManagementRules", JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    attendanceAPI.getActiveWorkHourPolicy()
      .then((policy) => {
        setRules((prev) => ({
          ...prev,
          breaks: policy.break_configurations?.length ? policy.break_configurations : prev.breaks,
          enforcement: { ...prev.enforcement, ...(policy.break_settings || {}) },
          policies: { ...prev.policies, ...(policy.break_auto_deduction_rules || {}) },
        }));
      })
      .catch((err) => console.error('Failed to load break rules from backend:', err));
  }, []);

  const handleAddBreak = () => {
    if (!breakForm.name) {
      toast.error("Please enter a break name");
      return;
    }

    const newBreak = {
      id: Date.now(),
      ...breakForm,
    };

    setRules((prev) => ({
      ...prev,
      breaks: [...prev.breaks, newBreak],
    }));

    setShowBreakModal(false);
    setEditingBreak(null);
    resetBreakForm();
    toast.success("Break added successfully!");
  };

  const handleEditBreak = (breakItem) => {
    setEditingBreak(breakItem);
    setBreakForm({
      name: breakItem.name,
      type: breakItem.type,
      duration: breakItem.duration,
      autoDeduct: breakItem.autoDeduct,
      mandatory: breakItem.mandatory,
      windowStart: breakItem.windowStart,
      windowEnd: breakItem.windowEnd,
      flexibleWindow: breakItem.flexibleWindow,
      maxDelay: breakItem.maxDelay,
      minGapAfter: breakItem.minGapAfter,
      punchRequired: breakItem.punchRequired,
      autoPunchOut: breakItem.autoPunchOut,
      gracePeriod: breakItem.gracePeriod || 0,
      maxExtension: breakItem.maxExtension || 0,
      description: breakItem.description || "",
    });
    setShowBreakModal(true);
  };

  const handleUpdateBreak = () => {
    if (!breakForm.name) {
      toast.error("Please enter a break name");
      return;
    }

    setRules((prev) => ({
      ...prev,
      breaks: prev.breaks.map((b) =>
        b.id === editingBreak.id ? { ...b, ...breakForm } : b
      ),
    }));

    setShowBreakModal(false);
    setEditingBreak(null);
    resetBreakForm();
    toast.success("Break updated successfully!");
  };

  const handleDeleteBreak = (id) => {
    if (rules.breaks.length <= 1) {
      toast.warning("At least one break must remain");
      return;
    }

    if (window.confirm("Are you sure you want to delete this break?")) {
      setRules((prev) => ({
        ...prev,
        breaks: prev.breaks.filter((b) => b.id !== id),
      }));
      toast.success("Break deleted successfully!");
    }
  };

  const handleDuplicateBreak = (id) => {
    const breakToDuplicate = rules.breaks.find((b) => b.id === id);
    if (!breakToDuplicate) return;

    const duplicatedBreak = {
      ...breakToDuplicate,
      id: Date.now(),
      name: `${breakToDuplicate.name} (Copy)`,
      description: breakToDuplicate.description
        ? `${breakToDuplicate.description} - Copy`
        : "",
    };

    setRules((prev) => ({
      ...prev,
      breaks: [...prev.breaks, duplicatedBreak],
    }));
    toast.success("Break duplicated successfully!");
  };

  const resetBreakForm = () => {
    setBreakForm({
      name: "",
      type: "paid",
      duration: 0,
      autoDeduct: false,
      mandatory: false,
      windowStart: "",
      windowEnd: "",
      flexibleWindow: 0,
      maxDelay: 0,
      minGapAfter: 0,
      punchRequired: false,
      autoPunchOut: false,
      gracePeriod: 0,
      maxExtension: 0,
      description: "",
    });
  };

  const breakStats = {
    totalBreaks: rules.breaks.length,
    paidBreaks: rules.breaks.filter(b => b.type === "paid").length,
    unpaidBreaks: rules.breaks.filter(b => b.type === "unpaid").length,
    totalPaidTime: rules.breaks.filter(b => b.type === "paid").reduce((sum, b) => sum + b.duration, 0),
    totalUnpaidTime: rules.breaks.filter(b => b.type === "unpaid").reduce((sum, b) => sum + b.duration, 0),
    mandatoryBreaks: rules.breaks.filter(b => b.mandatory).length,
    autoDeductBreaks: rules.breaks.filter(b => b.autoDeduct).length,
  };

  return (
    <div className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:coffee" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span className="hidden xs:inline">Break Management System</span>
          <span className="xs:hidden">Breaks</span>
        </h5>
        <button
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
          onClick={() => {
            setEditingBreak(null);
            resetBreakForm();
            setShowBreakModal(true);
          }}
        >
          <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
          <span className="hidden xs:inline">Add Break</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { title: "Total Breaks", value: breakStats.totalBreaks, color: "blue" },
            { title: "Paid Time", value: `${breakStats.totalPaidTime}m`, color: "emerald" },
            { title: "Unpaid Time", value: `${breakStats.totalUnpaidTime}m`, color: "amber" },
            { title: "Mandatory", value: breakStats.mandatoryBreaks, color: "rose" },
          ].map((stat, index) => (
            <div key={index} className="bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-500">
                <span className="">{stat.title}</span>
              </p>
              <p className={`text-xs sm:text-sm font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {rules.breaks.length === 0 ? (
          <div className="text-center py-8">
            <Icon icon="heroicons:coffee" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No breaks configured</p>
            <button
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
              onClick={() => {
                setEditingBreak(null);
                resetBreakForm();
                setShowBreakModal(true);
              }}
            >
              <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
              Add Your First Break
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3">
            {rules.breaks.map((breakItem) => (
              <div
                key={breakItem.id}
                className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <h6 className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[100px] xs:max-w-[120px] sm:max-w-full">
                    {breakItem.name}
                  </h6>
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${
                      breakItem.type === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {breakItem.type}
                    </span>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <p className="text-[10px] sm:text-xs text-slate-600">
                    <Icon icon="heroicons:clock" className="w-3 h-3 inline mr-1" />
                    Duration: {breakItem.duration}m
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-600">
                    <Icon icon="heroicons:calendar" className="w-3 h-3 inline mr-1" />
                    Window: {breakItem.windowStart} - {breakItem.windowEnd}
                  </p>
                  {breakItem.description && (
                    <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">
                      {breakItem.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {breakItem.mandatory && (
                      <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium bg-rose-100 text-rose-700">Mandatory</span>
                    )}
                    {breakItem.autoDeduct && (
                      <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium bg-blue-100 text-blue-700">Auto</span>
                    )}
                    {breakItem.punchRequired && (
                      <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium bg-purple-100 text-purple-700">Punch</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  <button
                    className="flex-1 xs:flex-none inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    onClick={() => handleEditBreak(breakItem)}
                  >
                    <Icon icon="heroicons:pencil" className="w-3 h-3" />
                    <span className="hidden xs:inline">Edit</span>
                  </button>
                  <button
                    className="flex-1 xs:flex-none inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    onClick={() => handleDuplicateBreak(breakItem.id)}
                  >
                    <Icon icon="heroicons:document-duplicate" className="w-3 h-3" />
                    <span className="hidden xs:inline">Duplicate</span>
                  </button>
                  <button
                    className="flex-1 xs:flex-none inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                    onClick={() => handleDeleteBreak(breakItem.id)}
                    disabled={rules.breaks.length <= 1}
                  >
                    <Icon icon="heroicons:trash" className="w-3 h-3" />
                    <span className="hidden xs:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBreakModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
              <h5 className="text-sm sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Icon icon="heroicons:coffee" className="w-5 h-5 text-blue-600" />
                {editingBreak ? "Edit Break" : "Add New Break"}
              </h5>
              <button
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
                onClick={() => {
                  setShowBreakModal(false);
                  setEditingBreak(null);
                  resetBreakForm();
                }}
              >
                <Icon icon="heroicons:x-mark" className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">
                    Break Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={breakForm.name}
                    onChange={(e) => setBreakForm({ ...breakForm, name: e.target.value })}
                    placeholder="Enter break name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                    value={breakForm.type}
                    onChange={(e) => setBreakForm({ ...breakForm, type: e.target.value })}
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={breakForm.duration}
                    onChange={(e) => setBreakForm({ ...breakForm, duration: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="180"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Window Start</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={breakForm.windowStart}
                    onChange={(e) => setBreakForm({ ...breakForm, windowStart: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Window End</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={breakForm.windowEnd}
                    onChange={(e) => setBreakForm({ ...breakForm, windowEnd: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Flexible Window (minutes)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={breakForm.flexibleWindow}
                    onChange={(e) => setBreakForm({ ...breakForm, flexibleWindow: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Max Delay (minutes)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={breakForm.maxDelay}
                    onChange={(e) => setBreakForm({ ...breakForm, maxDelay: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Min Gap After (minutes)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={breakForm.minGapAfter}
                    onChange={(e) => setBreakForm({ ...breakForm, minGapAfter: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="240"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Grace Period (minutes)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={breakForm.gracePeriod}
                    onChange={(e) => setBreakForm({ ...breakForm, gracePeriod: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="15"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Max Extension (minutes)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={breakForm.maxExtension}
                    onChange={(e) => setBreakForm({ ...breakForm, maxExtension: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        checked={breakForm.autoDeduct}
                        onChange={(e) => setBreakForm({ ...breakForm, autoDeduct: e.target.checked })}
                      />
                      <span className="text-[10px] sm:text-xs text-slate-700">Auto-Deduct</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        checked={breakForm.mandatory}
                        onChange={(e) => setBreakForm({ ...breakForm, mandatory: e.target.checked })}
                      />
                      <span className="text-[10px] sm:text-xs text-slate-700">Mandatory</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        checked={breakForm.punchRequired}
                        onChange={(e) => setBreakForm({ ...breakForm, punchRequired: e.target.checked })}
                      />
                      <span className="text-[10px] sm:text-xs text-slate-700">Punch Required</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        checked={breakForm.autoPunchOut}
                        onChange={(e) => setBreakForm({ ...breakForm, autoPunchOut: e.target.checked })}
                      />
                      <span className="text-[10px] sm:text-xs text-slate-700">Auto Punch Out</span>
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-y"
                    rows="2"
                    value={breakForm.description}
                    onChange={(e) => setBreakForm({ ...breakForm, description: e.target.value })}
                    placeholder="Enter break description..."
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                onClick={() => {
                  setShowBreakModal(false);
                  setEditingBreak(null);
                  resetBreakForm();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10"
                onClick={editingBreak ? handleUpdateBreak : handleAddBreak}
              >
                <Icon icon="heroicons:check" className="w-4 h-4" />
                {editingBreak ? "Update Break" : "Add Break"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("workHourSettings");
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      currency: "USD",
      timeFormat: "24h",
      dateFormat: "DD/MM/YYYY",
      weekStart: "Monday",
      fiscalYearStart: "April",
      autoSave: false,
      backupFrequency: "daily",
      notificationEmails: false,
      smsAlerts: false,
    };
  });

  useEffect(() => {
    localStorage.setItem("workHourSettings", JSON.stringify(settings));
  }, [settings]);

  // NOTE: dateFormat and fiscalYearStart have no backend column
  // (WorkHourRule only has currency/time_format/week_start_day/
  // backup_frequency/auto_save/email_alerts/sms_alerts) — stay
  // local-only.
  useEffect(() => {
    attendanceAPI.getActiveWorkHourPolicy()
      .then((policy) => {
        setSettings((prev) => ({
          ...prev,
          currency: policy.currency ?? prev.currency,
          timeFormat: policy.time_format === '24-Hour' ? '24h' : (policy.time_format === '12-Hour' ? '12h' : prev.timeFormat),
          weekStart: policy.week_start_day ?? prev.weekStart,
          autoSave: policy.auto_save ?? prev.autoSave,
          backupFrequency: policy.backup_frequency?.toLowerCase() ?? prev.backupFrequency,
          notificationEmails: policy.email_alerts ?? prev.notificationEmails,
          smsAlerts: policy.sms_alerts ?? prev.smsAlerts,
        }));
      })
      .catch((err) => console.error('Failed to load settings from backend:', err));
  }, []);

  const handleSettingsChange = (data) => {
    setSettings((prev) => ({ ...prev, ...data }));
    toast.success("Settings updated");
  };

  return (
    <div className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:cog-6-tooth" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span className="hidden xs:inline">System Settings</span>
          <span className="xs:hidden">Settings</span>
        </h5>
      </div>

      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800">General Settings</h6>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-600">Currency</label>
                <select
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm bg-white"
                  value={settings.currency}
                  onChange={(e) => handleSettingsChange({ currency: e.target.value })}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-600">Time Format</label>
                <select
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm bg-white"
                  value={settings.timeFormat}
                  onChange={(e) => handleSettingsChange({ timeFormat: e.target.value })}
                >
                  <option value="24h">24 Hour</option>
                  <option value="12h">12 Hour</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 bg-white">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800">Notifications</h6>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingsChange({ autoSave: e.target.checked })}
                />
                <span className="text-[10px] sm:text-xs text-slate-700">Auto Save</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  checked={settings.notificationEmails}
                  onChange={(e) => handleSettingsChange({ notificationEmails: e.target.checked })}
                />
                <span className="text-[10px] sm:text-xs text-slate-700">Email Alerts</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  checked={settings.smsAlerts}
                  onChange={(e) => handleSettingsChange({ smsAlerts: e.target.checked })}
                />
                <span className="text-[10px] sm:text-xs text-slate-700">SMS Alerts</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-slate-50">
          <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:database" className="w-4 h-4 text-blue-500" />
            <span className="hidden xs:inline">Storage Status</span>
            <span className="xs:hidden">Storage</span>
          </h6>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3">
            <div className="text-center">
              <p className="text-[8px] sm:text-[10px] text-slate-500">
                <span className="hidden xs:inline">Attendance Rules</span>
                <span className="xs:hidden">Attendance</span>
              </p>
              <p className="text-xs sm:text-sm font-bold text-blue-600">
                {localStorage.getItem("attendanceRules") ? "✓" : "—"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] sm:text-[10px] text-slate-500">
                <span className="hidden xs:inline">Overtime Rules</span>
                <span className="xs:hidden">Overtime</span>
              </p>
              <p className="text-xs sm:text-sm font-bold text-amber-600">
                {localStorage.getItem("overtimeManagementRules") ? "✓" : "—"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] sm:text-[10px] text-slate-500">
                <span className="hidden xs:inline">Break Rules</span>
                <span className="xs:hidden">Breaks</span>
              </p>
              <p className="text-xs sm:text-sm font-bold text-emerald-600">
                {localStorage.getItem("breakManagementRules") ? "✓" : "—"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] sm:text-[10px] text-slate-500">
                <span className="hidden xs:inline">Settings</span>
                <span className="xs:hidden">Settings</span>
              </p>
              <p className="text-xs sm:text-sm font-bold text-purple-600">
                {localStorage.getItem("workHourSettings") ? "✓" : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WHR = () => {
  const [state, dispatch] = useReducer(rulesReducer, initialState);
  const [activeTab, setActiveTab] = useState("attendance");
  const [isSaving, setIsSaving] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const savedRules = localStorage.getItem("workHourRules");
    if (savedRules) {
      try {
        dispatch({ type: "LOAD_RULES", payload: JSON.parse(savedRules) });
        toast.success("Rules loaded successfully!");
      } catch (error) {
        toast.error("Error loading saved rules");
      }
    }
  }, []);

  useEffect(() => {
    if (state.settings?.autoSave) {
      localStorage.setItem("workHourRules", JSON.stringify(state));
    }
  }, [state]);

  const [activePolicyId, setActivePolicyId] = useState(null);

  useEffect(() => {
    attendanceAPI.getActiveWorkHourPolicy()
      .then((policy) => setActivePolicyId(policy.id))
      .catch((err) => console.error('Failed to load active work-hour policy id:', err));
  }, []);

  // THE REAL BUG FIXED HERE: this Save button previously wrote
  // `state` (from a completely separate, always-empty `rulesReducer` /
  // `initialState` that none of the 4 tabs ever read from or wrote to)
  // to localStorage — meaning clicking Save had literally no effect on
  // anything the user could see or edit. The 4 tabs each already persist
  // their own real edits to their own localStorage keys on every change;
  // this now reads those real values and actually sends them to the
  // backend's 4 tab-scoped PATCH endpoints.
  const handleSave = async () => {
    setIsSaving(true);
    try {
      let ruleId = activePolicyId;
      if (!ruleId) {
        const policy = await attendanceAPI.getActiveWorkHourPolicy();
        ruleId = policy.id;
        setActivePolicyId(ruleId);
      }

      const attendanceRules = JSON.parse(localStorage.getItem("attendanceRules") || "{}");
      const overtimeRules = JSON.parse(localStorage.getItem("overtimeManagementRules") || "{}");
      const breakRules = JSON.parse(localStorage.getItem("breakManagementRules") || "{}");
      const settingsData = JSON.parse(localStorage.getItem("workHourSettings") || "{}");

      await Promise.all([
        attendanceAPI.updateWorkHourAttendanceTab(ruleId, {
          late_arrival_rules: attendanceRules.lateArrival,
          early_departure_rules: attendanceRules.earlyDeparture,
          min_daily_hours: attendanceRules.minWorkHours,
          work_hours_half_day_config: attendanceRules.halfDayCriteria,
          short_leave_policies: attendanceRules.shortLeave,
          continuous_absence_detection: attendanceRules.continuousAbsence,
          weekend_working: attendanceRules.weekendWorking,
          holiday_working: attendanceRules.holidayWorking,
          grace_period_minutes: attendanceRules.lateArrival?.gracePeriod,
          absence_alert_days: attendanceRules.continuousAbsence?.notifyAfterDays,
          weekend_rate_multiplier: attendanceRules.weekendWorking?.rate,
        }),
        attendanceAPI.updateWorkHourOvertimeTab(ruleId, {
          overtime_eligibility: overtimeRules.eligibility,
          overtime_calculation: overtimeRules.calculation,
          overtime_caps: overtimeRules.caps,
          overtime_approval_workflow: overtimeRules.approvalWorkflow,
          overtime_compensation_settings: overtimeRules.compensation,
          overtime_reports_settings: overtimeRules.reports,
          overtime_categories: overtimeRules.categories,
        }),
        attendanceAPI.updateWorkHourBreaksTab(ruleId, {
          break_configurations: breakRules.breaks,
          break_settings: breakRules.enforcement,
          break_auto_deduction_rules: breakRules.policies,
        }),
        attendanceAPI.updateWorkHourSettingsTab(ruleId, {
          currency: settingsData.currency,
          time_format: settingsData.timeFormat === '24h' ? '24-Hour' : '12-Hour',
          week_start_day: settingsData.weekStart,
          backup_frequency: settingsData.backupFrequency
            ? settingsData.backupFrequency.charAt(0).toUpperCase() + settingsData.backupFrequency.slice(1)
            : undefined,
          auto_save: settingsData.autoSave,
          email_alerts: settingsData.notificationEmails,
          sms_alerts: settingsData.smsAlerts,
        }),
      ]);

      toast.success("Rules saved successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to save rules to the backend");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all rules to default?")) {
      dispatch({ type: "RESET_RULES" });
      toast.warning("Rules reset to default");
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `work-hour-rules-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    toast.success("Rules exported successfully!");
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        dispatch({ type: "LOAD_RULES", payload: data });
        setShowImportModal(false);
        toast.success("Rules imported successfully!");
      } catch (error) {
        toast.error("Error importing rules: Invalid JSON format");
      }
    };
    reader.readAsText(file);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "ExportData.xlsx");
    toast.success("Excel exported successfully!");
  };

  const statistics = {
    totalRules: 0,
    activeRules: 0,
    complianceScore: 0,
  };

  const tabs = [
    { id: "attendance", name: "Attendance Rules", icon: "heroicons:calendar-check" },
    { id: "overtime", name: "Overtime Management", icon: "heroicons:clock" },
    { id: "breaks", name: "Break Management", icon: "heroicons:coffee" },
    { id: "settings", name: "Settings", icon: "heroicons:cog-6-tooth" },
  ];

  return (
    <WorkHourContext.Provider value={{ state, dispatch }}>
      <div className="w-full mx-auto max-w-7xl space-y-4 sm:space-y-6 md:px-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Icon icon="heroicons:clock" className="w-6 h-6 text-blue-600" />
              Work Hour Rules & Policies
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure attendance, overtime, break rules, and system settings
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              onClick={() => setShowImportModal(true)}
            >
              <Icon icon="heroicons:arrow-up-tray" className="w-4 h-4" />
              <span className="hidden xs:inline">Import</span>
            </button>
            <button
              type="button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              onClick={() => setShowExportModal(true)}
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              <span className="hidden xs:inline">Export</span>
            </button>
            <button
              type="button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              onClick={exportToExcel}
            >
              <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
              <span className="hidden xs:inline">Excel</span>
            </button>
            <button
              type="button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all"
              onClick={handleReset}
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
              <span className="hidden xs:inline">Reset</span>
            </button>
            <button
              type="button"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Icon icon="svg-spinners:180-ring" className="w-4 h-4 animate-spin" />
                  <span className="hidden xs:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Icon icon="heroicons:check" className="w-4 h-4" />
                  <span className="hidden xs:inline">Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg bg-blue-50 flex-shrink-0">
                <Icon icon="heroicons:check-badge" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 truncate">Total Rules</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{statistics.totalRules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-50 flex-shrink-0">
                <Icon icon="heroicons:check-circle" className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 truncate">Active Rules</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{statistics.activeRules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg bg-amber-50 flex-shrink-0">
                <Icon icon="heroicons:chart-bar" className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 truncate">Compliance</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{statistics.complianceScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg bg-purple-50 flex-shrink-0">
                <Icon icon="heroicons:cpu-chip" className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 truncate">Auto-Save</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {state.settings?.autoSave ? "On" : "Off"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm rounded-2xl p-1.5 sm:p-2 overflow-x-auto">
          <div className="flex flex-wrap gap-1 min-w-[320px]">
            {tabs.map((tab) => (
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
                <span className="hidden xs:inline">{tab.name}</span>
                <span className="xs:hidden">{tab.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {activeTab === "attendance" && <AttendanceRules />}
          {activeTab === "overtime" && <OvertimeManagement />}
          {activeTab === "breaks" && <BreakManagement />}
          {activeTab === "settings" && <Settings />}
        </div>

        {showExportModal && (
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            onExport={handleExport}
          />
        )}

        {showImportModal && (
          <ImportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImport={handleImport}
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
    </WorkHourContext.Provider>
  );
};

export default WHR;