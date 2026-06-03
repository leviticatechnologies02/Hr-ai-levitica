import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
  useContext,
  createContext,
} from "react";


import * as XLSX from 'xlsx';

const data = [
  { Name: "Keerthi", Age: 25, City: "Hyderabad" },
  { Name: "Ravi", Age: 28, City: "Bangalore" },
  // your table or data here
];
const exportToExcel = () => {
  const data = [
    { Name: "Keerthi", Age: 25, City: "Hyderabad" },
    { Name: "Ravi", Age: 28, City: "Bangalore" },
    // Replace with your actual table data
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, "ExportData.xlsx");
};


// ==============================
// CONTEXT FOR GLOBAL STATE
// ==============================
const WorkHourContext = createContext();

// ==============================
// INITIAL STATE
// ==============================
const initialState = {
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
      categories: [
        { id: 1, name: "Medical", maxDuration: 4, requiresDoc: true },
        { id: 2, name: "Personal", maxDuration: 2, requiresDoc: false },
      ],
    },
    continuousAbsence: {
      threshold: 3,
      autoAlert: true,
      escalationLevels: ["Manager", "HR", "Director"],
      currentLevel: "Manager",
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
    workFromHome: {
      allowed: true,
      maxDaysPerWeek: 2,
      requireApproval: true,
      trackProductivity: true,
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
      notifyIfPending: true,
      escalationAfterHours: 48,
    },
    caps: {
      daily: 4,
      weekly: 20,
      monthly: 48,
      quarterly: 120,
      yearly: 480,
      consecutiveDays: 5,
    },
    compensation: {
      type: "pay",
      compOffValidity: 90,
      autoConvertToCompOff: false,
      conversionRate: 1.0,
      paymentCycle: "monthly",
      taxDeductible: true,
    },
    categories: [
      {
        id: 1,
        name: "Regular Overtime",
        rate: 1.5,
        caps: { daily: 3, weekly: 10 },
        requiresApproval: true,
      },
      {
        id: 2,
        name: "Emergency Overtime",
        rate: 2.0,
        caps: { daily: 4, weekly: 16 },
        requiresApproval: false,
      },
    ],
  },
  breakManagement: {
    breaks: [
      {
        id: 1,
        name: "Lunch Break",
        type: "unpaid",
        duration: 60,
        autoDeduct: true,
        mandatory: true,
        windowStart: "12:00",
        windowEnd: "14:00",
        flexibleWindow: 30,
        maxDelay: 15,
        minGapAfter: 180,
      },
      {
        id: 2,
        name: "Tea Break",
        type: "paid",
        duration: 15,
        autoDeduct: false,
        mandatory: false,
        windowStart: "15:30",
        windowEnd: "16:00",
        flexibleWindow: 60,
        maxDelay: 30,
        minGapAfter: 120,
      },
      {
        id: 3,
        name: "Evening Break",
        type: "paid",
        duration: 10,
        autoDeduct: false,
        mandatory: false,
        windowStart: "17:00",
        windowEnd: "17:30",
        flexibleWindow: 45,
        maxDelay: 20,
        minGapAfter: 90,
      },
    ],
    enforcement: {
      strictMode: false,
      allowMultipleBreaks: true,
      maxBreaksPerDay: 4,
      trackBreakPunches: true,
      deductFromWorkHours: true,
      enforceSequence: false,
      autoLogBreaks: true,
      breakReminders: true,
      reminderBefore: 5,
    },
    policies: {
      minBreakDuration: 5,
      maxBreakDuration: 120,
      totalBreakLimit: 90,
      mealBreakRequired: true,
      mealBreakAfterHours: 5,
      consecutiveWorkLimit: 4,
      mandatoryRestAfterOvertime: 11,
    },
  },
  analytics: {
    complianceReports: [],
    overtimeReports: [],
    breakReports: [],
    violationTrends: [],
  },
  settings: {
    currency: "USD",
    timeFormat: "24h",
    dateFormat: "DD/MM/YYYY",
    weekStart: "Monday",
    fiscalYearStart: "April",
    autoSave: true,
    backupFrequency: "daily",
    notificationEmails: true,
    smsAlerts: false,
  },
};

// ==============================
// REDUCER FUNCTION
// ==============================
const rulesReducer = (state, action) => {
  switch (action.type) {
    // ATTENDANCE RULES
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

    case "UPDATE_SHORT_LEAVE_CATEGORY":
      return {
        ...state,
        attendanceRules: {
          ...state.attendanceRules,
          shortLeave: {
            ...state.attendanceRules.shortLeave,
            categories: state.attendanceRules.shortLeave.categories.map((cat) =>
              cat.id === action.payload.id
                ? { ...cat, ...action.payload.data }
                : cat
            ),
          },
        },
      };

    case "ADD_SHORT_LEAVE_CATEGORY":
      return {
        ...state,
        attendanceRules: {
          ...state.attendanceRules,
          shortLeave: {
            ...state.attendanceRules.shortLeave,
            categories: [
              ...state.attendanceRules.shortLeave.categories,
              {
                id: Date.now(),
                name: action.payload.name || "New Category",
                maxDuration: 2,
                requiresDoc: false,
              },
            ],
          },
        },
      };

    // OVERTIME RULES
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

    case "UPDATE_OVERTIME_CATEGORY":
      return {
        ...state,
        overtime: {
          ...state.overtime,
          categories: state.overtime.categories.map((cat) =>
            cat.id === action.payload.id
              ? { ...cat, ...action.payload.data }
              : cat
          ),
        },
      };

    case "ADD_OVERTIME_CATEGORY":
      return {
        ...state,
        overtime: {
          ...state.overtime,
          categories: [
            ...state.overtime.categories,
            {
              id: Date.now(),
              name: action.payload.name || "New Category",
              rate: 1.5,
              caps: { daily: 3, weekly: 10 },
              requiresApproval: true,
            },
          ],
        },
      };

    // BREAK MANAGEMENT
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
              name: "New Break",
              type: "unpaid",
              duration: 15,
              autoDeduct: false,
              mandatory: false,
              windowStart: "10:00",
              windowEnd: "11:00",
              flexibleWindow: 30,
              maxDelay: 15,
              minGapAfter: 60,
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

    case "UPDATE_ENFORCEMENT":
      return {
        ...state,
        breakManagement: {
          ...state.breakManagement,
          enforcement: {
            ...state.breakManagement.enforcement,
            ...action.payload,
          },
        },
      };

    case "UPDATE_POLICIES":
      return {
        ...state,
        breakManagement: {
          ...state.breakManagement,
          policies: {
            ...state.breakManagement.policies,
            ...action.payload,
          },
        },
      };

    // SETTINGS
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    // ANALYTICS
    case "ADD_COMPLIANCE_REPORT":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          complianceReports: [
            ...state.analytics.complianceReports,
            action.payload,
          ],
        },
      };

    // RESET
    case "RESET_RULES":
      return initialState;

    case "LOAD_RULES":
      return action.payload;

    default:
      return state;
  }
};

// ==============================
// CUSTOM HOOKS
// ==============================
const useWorkHourRules = () => {
  const context = useContext(WorkHourContext);
  if (!context) {
    throw new Error("useWorkHourRules must be used within WorkHourProvider");
  }
  return context;
};

// ==============================
// MAIN COMPONENT
// ==============================
const WHR = () => {
  const [state, dispatch] = useReducer(rulesReducer, initialState);
  const [activeTab, setActiveTab] = useState("attendance");
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const savedRules = localStorage.getItem("workHourRules");
    if (savedRules) {
      try {
        dispatch({ type: "LOAD_RULES", payload: JSON.parse(savedRules) });
        showNotification("Rules loaded successfully!", "success");
      } catch (error) {
        showNotification("Error loading saved rules", "error");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (state.settings.autoSave) {
      localStorage.setItem("workHourRules", JSON.stringify(state));
    }
  }, [state]);

  // Show notification
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Statistics calculation
  const statistics = useMemo(() => {
    const totalBreaks = state.breakManagement.breaks.length;
    const activeBreaks = state.breakManagement.breaks.filter(
      (b) => b.mandatory
    ).length;
    const totalOvertimeCategories = state.overtime.categories.length;
    const totalShortLeaveCategories =
      state.attendanceRules.shortLeave.categories.length;

    return {
      totalRules: 42,
      activeRules:
        Object.values(state.attendanceRules).filter((v) => v.enabled !== false)
          .length +
        Object.values(state.overtime).filter((v) => v.enabled !== false)
          .length +
        state.breakManagement.breaks.length,
      complianceScore: 95,
      totalBreaks,
      activeBreaks,
      totalOvertimeCategories,
      totalShortLeaveCategories,
      totalViolations: 28,
      pendingApprovals: 12,
    };
  }, [state]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showNotification("Rules saved successfully!", "success");
      // Force save to localStorage
      localStorage.setItem("workHourRules", JSON.stringify(state));
    }, 1000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all rules to default? This action cannot be undone."
      )
    ) {
      dispatch({ type: "RESET_RULES" });
      showNotification("Rules reset to default", "warning");
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `work-hour-rules-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    showNotification("Rules exported successfully!", "success");
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          dispatch({ type: "LOAD_RULES", payload: data });
          setShowImportModal(false);
          showNotification("Rules imported successfully!", "success");
        } catch (error) {
          showNotification(
            "Error importing rules: Invalid JSON format",
            "error"
          );
        }
      };
      reader.readAsText(file);
    }
  };

  // Tabs configuration
  const tabs = [
    { id: "attendance", name: "Attendance Rules", icon: "bi-calendar-check" },
    { id: "overtime", name: "Overtime Management", icon: "bi-clock-history" },
    { id: "breaks", name: "Break Management", icon: "bi-cup-straw" },
    // { id: 'reports', name: 'Reports & Analytics', icon: 'bi-graph-up' },
    { id: "settings", name: "Settings", icon: "bi-gear" },
  ];

  return (
    <WorkHourContext.Provider value={{ state, dispatch, showNotification }}>
      <div className="container-fluid py-4">
        {/* Notification */}
        {notification && (
          <div
            className={`alert alert-${
              notification.type === "error" ? "danger" : notification.type
            } alert-dismissible fade show`}
            role="alert"
          >
            {notification.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setNotification(null)}
            ></button>
          </div>
        )}

        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 gap-sm-0 mb-3">
              {/* Title - Always on top */}
             <div className="d-flex align-items-center gap-2">
  {/* Icon */}
  <i className="bi bi-clock-history text-dark fs-5"></i>

  {/* Heading */}
  <h2 className="fw-bold h5 h4-sm h3-lg mb-0">
    Work Hour Rules & Policies
  </h2>
</div>


              {/* Action Buttons - Responsive Layout */}
              <div className="d-flex flex-wrap align-items-center gap-2">
                {/* Small screen: Icon-only buttons */}
                <div className="btn-group d-sm-none">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowImportModal(true)}
                    title="Import"
                  >
                    <i className="bi bi-upload"></i>
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowExportModal(true)}
                    title="Export"
                  >
                    <i className="bi bi-download"></i>
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleReset}
                    title="Reset"
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>

                {/* Medium+ screens: Full buttons */}
       <div className="d-none d-sm-block btn-group me-2">
  <button
    className="btn btn-primary"
    onClick={() => setShowImportModal(true)}
  >
    <i className="bi bi-upload me-2"></i>Import
  </button>
  <button
  className="btn btn-primary"
  onClick={exportToExcel}
>
  <i className="bi bi-download me-2"></i>Export
</button>

  <button
    className="btn btn-primary"
    onClick={handleReset}
  >
    <i className="bi bi-arrow-clockwise me-2"></i>Reset
  </button>
</div>



                {/* Save Button - Responsive text */}
                <button
                  className="btn btn-primary btn-sm btn-md-normal"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      <span className="d-none d-sm-inline">Saving...</span>
                      <span className="d-sm-none">Save</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-1 me-sm-2"></i>
                      <span className="d-none d-sm-inline">Save Changes</span>
                      <span className="d-sm-none">Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body p-1 p-sm-2">
                <div className="d-flex overflow-auto">
                  <div
                    className="d-flex flex-nowrap w-100"
                    style={{ gap: "4px" }}
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`btn btn-sm d-flex flex-column align-items-center justify-content-center flex-grow-1 border-0 ${
                          activeTab === tab.id
                            ? "bg-primary text-white"
                            : "bg-light text-dark"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          minHeight: "60px",
                          minWidth: "70px",
                          padding: "8px 4px",
                          fontSize: "0.75rem",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <i
                          className={`bi ${tab.icon} mb-1`}
                          style={{ fontSize: "1rem" }}
                        ></i>
                        <span className="text-nowrap">
                          {tab.name === "Attendance Rules"
                            ? "Attendance"
                            : tab.name === "Overtime Management"
                            ? "Overtime"
                            : tab.name === "Break Management"
                            ? "Breaks"
                            : //  tab.name === 'Reports & Analytics' ? 'Reports' :
                            tab.name === "Settings"
                            ? "Settings"
                            : tab.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tab Content */}
        <div className="row">
          <div className="col-12">
            {activeTab === "attendance" && <AttendanceRules />}

            {activeTab === "overtime" && <OvertimeManagement />}

            {activeTab === "breaks" && <BreakManagement />}

            {activeTab === "settings" && <Settings />}
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Export Rules</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowExportModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Export all work hour rules as a JSON file?</p>
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    This will include all attendance, overtime, break rules, and
                    settings.
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowExportModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleExport}>
                    <i className="bi bi-download me-2"></i>Export Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Import Rules</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowImportModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Select a JSON file to import rules:</p>
                  <input
                    type="file"
                    className="form-control"
                    accept=".json"
                    onChange={handleImport}
                  />
                  <div className="alert alert-warning mt-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Warning: This will overwrite all existing rules.
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowImportModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </WorkHourContext.Provider>
  );
};

// ==============================
// ATTENDANCE RULES COMPONENT
// ==============================
const AttendanceRules = () => {
  // Load rules from localStorage or use defaults
  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem("attendanceRules");
    if (savedRules) {
      return JSON.parse(savedRules);
    }
    // Default rules structure
    return {
      lateArrival: {
        enabled: true,
        gracePeriod: 15,
        deductionType: "perMinute",
        deductionAmount: 10,
        monthlyLimit: 120,
        maxAllowed: 5,
        autoDeduct: true,
        deductionOptions: [
          { value: "perMinute", label: "Per Minute", icon: "bi-clock" },
          { value: "perHour", label: "Per Hour", icon: "bi-clock-history" },
          { value: "fixed", label: "Fixed Amount", icon: "bi-currency-dollar" },
          {
            value: "leave",
            label: "Leave Deduction",
            icon: "bi-calendar-minus",
          },
          {
            value: "warning",
            label: "Warning Only",
            icon: "bi-exclamation-triangle",
          },
        ],
      },
      earlyDeparture: {
        allowed: true,
        penaltyType: "salaryDeduction",
        penaltyAmount: 100,
        gracePeriod: 10,
        requireApproval: true,
        maxInstances: 3,
        penaltyOptions: [
          {
            value: "salaryDeduction",
            label: "Salary Deduction",
            icon: "bi-cash",
          },
          {
            value: "leaveDeduction",
            label: "Leave Deduction",
            icon: "bi-calendar-minus",
          },
          {
            value: "warning",
            label: "Warning Notice",
            icon: "bi-exclamation-circle",
          },
          {
            value: "both",
            label: "Both Salary & Leave",
            icon: "bi-cash-stack",
          },
          { value: "none", label: "No Penalty", icon: "bi-x-circle" },
        ],
      },
      minWorkHours: 8,
      halfDayCriteria: {
        hours: 4,
        considerAsHalfDay: true,
        markAsAbsentBelow: true,
        applyAfterHours: 3,
        autoDeduct: true,
      },
      shortLeave: {
        maxDuration: 2,
        maxFrequency: 4,
        requiresApproval: true,
        autoDeduct: false,
        categories: [
          {
            id: 1,
            name: "Medical",
            maxDuration: 4,
            requiresDoc: true,
            icon: "bi-heart-pulse",
            color: "danger",
          },
          {
            id: 2,
            name: "Personal",
            maxDuration: 2,
            requiresDoc: false,
            icon: "bi-person",
            color: "primary",
          },
          {
            id: 3,
            name: "Family",
            maxDuration: 3,
            requiresDoc: false,
            icon: "bi-people-fill",
            color: "success",
          },
          {
            id: 4,
            name: "Emergency",
            maxDuration: 6,
            requiresDoc: true,
            icon: "bi-exclamation-triangle",
            color: "warning",
          },
        ],
      },
      continuousAbsence: {
        threshold: 3,
        escalationLevels: ["Manager", "HR", "Director", "CEO"],
        notifyAfterDays: 2,
        currentLevel: "Manager",
        autoAlert: true,
        emailAlerts: true,
        smsAlerts: false,
      },
      weekendWorking: {
        requiresApproval: true,
        rate: 1.5,
        maxHours: 8,
        advanceNotice: 48,
        compOffAllowed: true,
        compOffValidity: 30,
      },
      holidayWorking: {
        requiresApproval: true,
        rate: 2.0,
        canTakeCompOff: true,
        compOffValidity: 60,
        advanceApproval: true,
        mandatoryRate: 2.5,
      },
    };
  });

  // Save to localStorage whenever rules change
  useEffect(() => {
    localStorage.setItem("attendanceRules", JSON.stringify(rules));
  }, [rules]);

  const handleChange = (section, data) => {
    setRules((prev) => ({
      ...prev,
      [section]:
        typeof data === "object" ? { ...prev[section], ...data } : data,
    }));
  };

  const addShortLeaveCategory = () => {
    const newId =
      rules.shortLeave.categories.length > 0
        ? Math.max(...rules.shortLeave.categories.map((c) => c.id)) + 1
        : 1;

    const newCategory = {
      id: newId,
      name: `New Category ${newId}`,
      maxDuration: 2,
      requiresDoc: false,
      icon: "bi-clock",
      color: "secondary",
    };

    setRules((prev) => ({
      ...prev,
      shortLeave: {
        ...prev.shortLeave,
        categories: [...prev.shortLeave.categories, newCategory],
      },
    }));
  };

  const updateShortLeaveCategory = (id, data) => {
    setRules((prev) => ({
      ...prev,
      shortLeave: {
        ...prev.shortLeave,
        categories: prev.shortLeave.categories.map((cat) =>
          cat.id === id ? { ...cat, ...data } : cat
        ),
      },
    }));
  };

  const deleteShortLeaveCategory = (id) => {
    if (rules.shortLeave.categories.length <= 1) {
      alert("At least one category must remain");
      return;
    }

    if (window.confirm("Are you sure you want to delete this category?")) {
      setRules((prev) => ({
        ...prev,
        shortLeave: {
          ...prev.shortLeave,
          categories: prev.shortLeave.categories.filter((cat) => cat.id !== id),
        },
      }));
    }
  };

  const resetToDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all rules to defaults? This cannot be undone."
      )
    ) {
      localStorage.removeItem("attendanceRules");
      window.location.reload();
    }
  };

  const exportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "attendance-rules-backup.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importRules = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedRules = JSON.parse(e.target.result);
        setRules(importedRules);
        alert("Rules imported successfully!");
      } catch (error) {
        alert("Error importing rules. Invalid JSON format.");
      }
    };
    reader.readAsText(file);
  };

  // Calculate statistics
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
    complianceScore: Math.round(
      (Object.keys(rules).reduce((acc, key) => {
        if (typeof rules[key] === "object" && rules[key] !== null) {
          return acc + Object.keys(rules[key]).length;
        }
        return acc + 1;
      }, 0) /
        30) *
        100
    ),
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-gradient-light text-dark">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 gap-sm-0">
                {/* Title */}
                <div>
                  <h5 className="fw-semibold mb-0 h6 h5-sm h4-md">
                    Attendance Rules Engine
                  </h5>
                </div>

                {/* Action Buttons */}
                <div className="d-flex align-items-center">
                  {/* Mobile: Icon-only */}
                  <div className="btn-group d-sm-none">
                    <button
                      className="btn btn-sm btn-light"
                      onClick={exportRules}
                      title="Export Rules"
                    >
                      <i className="bi bi-download"></i>
                    </button>
                    <label
                      className="btn btn-sm btn-light position-relative"
                      title="Import Rules"
                    >
                      <i className="bi bi-upload"></i>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importRules}
                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                        style={{ cursor: "pointer" }}
                      />
                    </label>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={resetToDefaults}
                      title="Reset to Defaults"
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>

                  {/* Desktop: Full buttons with group styling */}
            <div className="d-none d-sm-flex btn-group">
  <button
    className="btn btn-sm btn-primary d-flex align-items-center"
    onClick={exportRules}
    title="Export Rules"
  >
    <i className="bi bi-download me-1 me-md-2"></i>
    <span className="d-none d-md-inline">Export</span>
  </button>

  <label
    className="btn btn-sm btn-primary d-flex align-items-center position-relative"
    title="Import Rules"
  >
    <i className="bi bi-upload me-1 me-md-2"></i>
    <span className="d-none d-md-inline">Import</span>
    <input
      type="file"
      accept=".json"
      onChange={importRules}
      className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
      style={{ cursor: "pointer" }}
    />
  </label>

  <button
    className="btn btn-sm btn-primary d-flex align-items-center"
    onClick={resetToDefaults}
    title="Reset to Defaults"
  >
    <i className="bi bi-arrow-clockwise me-1 me-md-2"></i>
    <span className="d-none d-md-inline">Reset</span>
  </button>
</div>

                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Storage Status Indicator */}
              <div className="alert alert-info mb-4 p-3">
                <div className="container-fluid p-0">
                  <div className="row align-items-center g-2 g-md-3">
                    {/* Icon Column */}
                    <div className="col-auto">
                      <i className="bi bi-database fs-3 fs-md-4 text-info"></i>
                    </div>

                    {/* Content Column */}
                    <div className="col-12 col-md">
                      <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <div className="mb-1 mb-md-0 me-md-3">
                          <h6 className="fw-semibold mb-0 d-inline me-2">
                            Data Auto-Saved to Local Storage
                          </h6>
                          <span className="badge bg-info d-none d-md-inline">
                            Auto-save
                          </span>
                          <span className="badge bg-success d-md-none ms-2">
                            {featureStats.complianceScore}%
                          </span>
                        </div>
                        <div className="text-muted small flex-grow-1">
                          <span>
                            Changes saved automatically. Last:{" "}
                            {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Compliance Badge Column - Desktop only */}
                    <div className="col-auto d-none d-md-block">
                      <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 p-2 px-3 d-flex align-items-center">
                        <i className="bi bi-shield-check fs-5 me-2"></i>
                        <div>
                          <div className="small">Compliance Score</div>
                          <div className="fw-bold fs-6">
                            {featureStats.complianceScore}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Statistics */}
            <div className="row mb-4">
  <div className="col-12">
    <div className="card border">
      <div className="card-body p-2 p-sm-3 p-md-4">
        <div className="row g-0 text-center">
          {[
            {
              title: "Active Rules",
              value: featureStats.activeRules,
              color: "success",
              icon: "bi-check-circle",
              subtitle: "Enabled configurations",
              shortTitle: "Active",
            },
            {
              title: "Grace Period",
              value: `${rules.lateArrival.gracePeriod} min`,
              color: "warning",
              icon: "bi-clock",
              subtitle: "Late arrival allowance",
              shortTitle: "Grace",
            },
            {
              title: "Min Hours",
              value: `${rules.minWorkHours}h`,
              color: "primary",
              icon: "bi-hourglass",
              subtitle: "Daily requirement",
              shortTitle: "Min Hours",
            },
            {
              title: "Short Leave",
              value: rules.shortLeave.categories.length,
              color: "info",
              icon: "bi-calendar-minus",
              subtitle: "Categories",
              shortTitle: "Leave",
            },
            {
              title: "Absence Alert",
              value: `${rules.continuousAbsence.threshold}d`,
              color: "danger",
              icon: "bi-exclamation-triangle",
              subtitle: "Days threshold",
              shortTitle: "Absence",
            },
            {
              title: "Weekend Rate",
              value: `${rules.weekendWorking.rate}x`,
              color: "dark",
              icon: "bi-calendar2-week",
              subtitle: "Compensation",
              shortTitle: "Weekend",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="col-6 col-md-4 col-lg-2 mb-2 mb-md-0"
            >
              <div
                className={`
                  h-100 py-2 py-sm-3
                  ${index > 0 ? "border-start border-light" : ""}
                  ${index === 2 || index === 5 ? "border-md-none" : ""}
                `}
                style={{ borderColor: "rgba(0,0,0,0.1)" }}
              >
                {/* Title with responsive icon */}
                <div className="fw-semibold text-secondary small mb-1 mb-sm-2">
                  <i
                    className={`bi ${stat.icon} d-none d-sm-inline me-1 me-sm-2`}
                  ></i>
                  <i className={`bi ${stat.icon} d-sm-none me-1`}></i>
                  <span className="d-none d-sm-inline">{stat.title}</span>
                  <span className="d-sm-none">{stat.shortTitle}</span>
                </div>

                {/* Value with responsive size */}
                <div
                  className={`text-${stat.color} fw-bold`}
                  style={{ fontSize: "clamp(1rem, 4vw, 1.75rem)" }}
                >
                  {stat.value}
                </div>

                {/* Subtitle with responsive icon */}
                <div className="small text-muted mb-0">
                  <i className="bi bi-info-circle d-none d-sm-inline me-1"></i>
                  <span className="d-none d-sm-inline">{stat.subtitle}</span>
                  <span className="d-sm-none">{stat.shortTitle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>


              {/* Main Rules Container */}
              <div className="row g-4">
                {/* ✅ 1. Late arrival definition and grace period */}
                <div className="col-lg-6">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-clock-history text-warning me-2"></i>
                          <h6 className="mb-0">Late Arrival Rules</h6>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={rules.lateArrival.enabled}
                            onChange={(e) =>
                              handleChange("lateArrival", {
                                enabled: e.target.checked,
                              })
                            }
                            id="lateArrivalToggle"
                          />
                          <label
                            className="form-check-label small"
                            htmlFor="lateArrivalToggle"
                          >
                            {rules.lateArrival.enabled ? (
                              <>
                                <i className="bi bi-check-circle text-success me-1"></i>
                                Allowed
                              </>
                            ) : (
                              <>
                                <i className="bi bi-x-circle text-danger me-1"></i>
                                Not Allowed
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="alert alert-light border mb-3">
                        <i className="bi bi-info-circle text-info me-2"></i>
                        <small>
                          Defines grace period, penalties, and limits for late
                          arrivals. Late arrivals beyond grace period will
                          trigger configured deductions.
                        </small>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-alarm text-secondary me-1"></i>
                            Grace Period
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              value={rules.lateArrival.gracePeriod}
                              onChange={(e) =>
                                handleChange("lateArrival", {
                                  gracePeriod: parseInt(e.target.value),
                                })
                              }
                              min="0"
                              max="60"
                              disabled={!rules.lateArrival.enabled}
                            />
                            <span className="input-group-text">
                              <i className="bi bi-clock"></i>
                            </span>
                          </div>
                          <div className="form-text">
                            <i className="bi bi-info-circle me-1"></i>No penalty
                            if late within this period
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-cash-coin text-secondary me-1"></i>
                            Deduction Type
                          </label>
                          <select
                            className="form-select"
                            value={rules.lateArrival.deductionType}
                            onChange={(e) =>
                              handleChange("lateArrival", {
                                deductionType: e.target.value,
                              })
                            }
                            disabled={!rules.lateArrival.enabled}
                          >
                            {rules.lateArrival.deductionOptions.map(
                              (option) => (
                                <option key={option.value} value={option.value}>
                                  <i className={`bi ${option.icon} me-1`}></i>
                                  {option.label}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-currency-dollar text-secondary me-1"></i>
                            Deduction Amount
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-cash"></i>
                            </span>
                            <input
                              type="number"
                              className="form-control"
                              value={rules.lateArrival.deductionAmount}
                              onChange={(e) =>
                                handleChange("lateArrival", {
                                  deductionAmount: parseFloat(e.target.value),
                                })
                              }
                              step="0.5"
                              min="0"
                              disabled={!rules.lateArrival.enabled}
                            />
                            <span className="input-group-text">per min</span>
                          </div>
                          <div className="form-text">
                            <i className="bi bi-calculator me-1"></i>Amount
                            deducted per minute late
                          </div>
                        </div>
<div className="col-md-6">
  <label className="form-label">
    <i className="bi bi-calendar-month text-secondary me-1"></i>
    Monthly Limit
  </label>

  <div className="input-group">
    <input
      type="month"   // 👈 calendar (month picker)
      className="form-control"
      value={rules.lateArrival.monthlyLimit}
      onChange={(e) =>
        handleChange("lateArrival", {
          monthlyLimit: e.target.value,
        })
      }
      disabled={!rules.lateArrival.enabled}
    />
    
  </div>

  <div className="form-text">
    <i className="bi bi-graph-up me-1"></i>
    Select month for late arrival limit
  </div>
</div>


<div className="col-md-6">
  <label className="form-label">
    <i className="bi bi-calendar-x text-secondary me-1"></i>
    Max Instances / Month
  </label>

  <div className="input-group">
    <input
      type="month"   // 👈 calendar (month + year)
      className="form-control"
      value={rules.lateArrival.maxAllowed}
      onChange={(e) =>
        handleChange("lateArrival", {
          maxAllowed: e.target.value,
        })
      }
      disabled={!rules.lateArrival.enabled}
    />
 
  </div>

  <div className="form-text">
    <i className="bi bi-info-circle me-1"></i>
    Select month for max late instances
  </div>
</div>


                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-robot text-secondary me-1"></i>
                            Auto-Deduction
                          </label>
                          <div className="form-check form-switch mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rules.lateArrival.autoDeduct}
                              onChange={(e) =>
                                handleChange("lateArrival", {
                                  autoDeduct: e.target.checked,
                                })
                              }
                              disabled={!rules.lateArrival.enabled}
                              id="autoDeductLate"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="autoDeductLate"
                            >
                              Auto-deduct from salary
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ 2. Early departure rules */}
                <div className="col-lg-6">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-clock text-danger me-2"></i>
                          <h6 className="mb-0">Early Departure Rules</h6>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={rules.earlyDeparture.allowed}
                            onChange={(e) =>
                              handleChange("earlyDeparture", {
                                allowed: e.target.checked,
                              })
                            }
                            id="earlyDepartureToggle"
                          />
                          <label
                            className="form-check-label small"
                            htmlFor="earlyDepartureToggle"
                          >
                            {rules.earlyDeparture.allowed ? (
                              <>
                                <i className="bi bi-check-circle text-success me-1"></i>
                                Allowed
                              </>
                            ) : (
                              <>
                                <i className="bi bi-x-circle text-danger me-1"></i>
                                Not Allowed
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="alert alert-light border mb-3">
                        <i className="bi bi-info-circle text-info me-2"></i>
                        <small>
                          Controls whether early departure is allowed and what
                          penalties apply. Can require manager approval and
                          apply salary deductions.
                        </small>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-exclamation-triangle text-secondary me-1"></i>
                            Penalty Type
                          </label>
                          <select
                            className="form-select"
                            value={rules.earlyDeparture.penaltyType}
                            onChange={(e) =>
                              handleChange("earlyDeparture", {
                                penaltyType: e.target.value,
                              })
                            }
                            disabled={!rules.earlyDeparture.allowed}
                          >
                            {rules.earlyDeparture.penaltyOptions.map(
                              (option) => (
                                <option key={option.value} value={option.value}>
                                  <i className={`bi ${option.icon} me-1`}></i>
                                  {option.label}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-currency-dollar text-secondary me-1"></i>
                            Penalty Amount
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-cash"></i>
                            </span>
                            <input
                              type="number"
                              className="form-control"
                              value={rules.earlyDeparture.penaltyAmount}
                              onChange={(e) =>
                                handleChange("earlyDeparture", {
                                  penaltyAmount: parseFloat(e.target.value),
                                })
                              }
                              step="0.5"
                              min="0"
                              disabled={!rules.earlyDeparture.allowed}
                            />
                          </div>
                          <div className="form-text">
                            <i className="bi bi-calculator me-1"></i>Fixed
                            penalty amount per occurrence
                          </div>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">
                            <i className="bi bi-alarm text-secondary me-1"></i>
                            Grace Period
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              value={rules.earlyDeparture.gracePeriod}
                              onChange={(e) =>
                                handleChange("earlyDeparture", {
                                  gracePeriod: parseInt(e.target.value),
                                })
                              }
                              min="0"
                              max="60"
                              disabled={!rules.earlyDeparture.allowed}
                            />
                            <span className="input-group-text">
                              <i className="bi bi-clock"></i>
                            </span>
                          </div>
                          <div className="form-text">
                            <i className="bi bi-hourglass me-1"></i>No penalty
                            if leaving within grace period
                          </div>
                        </div>

                        <div className="col-md-6 d-flex align-items-end">
                          <div className="form-check form-switch w-100">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rules.earlyDeparture.requireApproval}
                              onChange={(e) =>
                                handleChange("earlyDeparture", {
                                  requireApproval: e.target.checked,
                                })
                              }
                              disabled={!rules.earlyDeparture.allowed}
                              id="requireApprovalEarly"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="requireApprovalEarly"
                            >
                              <i className="bi bi-shield-check me-1"></i>
                              Require Manager Approval
                            </label>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="card bg-light border-0 mt-2">
                            <div className="card-body p-3">
                              <h6 className="card-title small">
                                <i className="bi bi-graph-up text-secondary me-2"></i>
                                Early Departure Impact
                              </h6>
                              <div className="row">
                                <div className="col-6">
                                  <div className="small text-muted">
                                    <i className="bi bi-calendar-day me-1"></i>
                                    Daily
                                  </div>
                                  <div className="fw-bold">
                                    <i className="bi bi-cash text-warning me-1"></i>
                                    Salary Deduction
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="small text-muted">
                                    <i className="bi bi-calendar-month me-1"></i>
                                    Monthly
                                  </div>
                                  <div className="fw-bold">
                                    <i className="bi bi-exclamation-triangle text-danger me-1"></i>
                                    Warning after{" "}
                                    {rules.earlyDeparture.maxInstances}{" "}
                                    instances
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

                {/* ✅ 3. Minimum work hours requirement & ✅ 4. Half-day criteria configuration */}
                <div className="col-lg-8">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-hourglass-split text-primary me-2"></i>
                        <h6 className="mb-0">
                          Work Hours & Half-Day Configuration
                        </h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-4">
                            <label className="form-label">
                              <i className="bi bi-clock-history text-secondary me-1"></i>
                              Minimum Work Hours per Day
                            </label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                value={rules.minWorkHours}
                                onChange={(e) =>
                                  handleChange(
                                    "minWorkHours",
                                    parseFloat(e.target.value)
                                  )
                                }
                                min="1"
                                max="12"
                                step="0.5"
                              />
                              <span className="input-group-text">
                                <i className="bi bi-clock"></i>
                              </span>
                            </div>
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>
                              Employees must work at least this many hours for a
                              full day
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="form-label">
                              <i className="bi bi-calendar-day text-secondary me-1"></i>
                              Half-Day Criteria (hours)
                            </label>
                            <div className="input-group mb-2">
                              <input
                                type="number"
                                className="form-control"
                                value={rules.halfDayCriteria.hours}
                                onChange={(e) =>
                                  handleChange("halfDayCriteria", {
                                    ...rules.halfDayCriteria,
                                    hours: parseFloat(e.target.value),
                                  })
                                }
                                min="1"
                                max="8"
                                step="0.5"
                              />
                              <span className="input-group-text">
                                <i className="bi bi-clock-half"></i>
                              </span>
                            </div>
                            <div className="form-text">
                              <i className="bi bi-hourglass-split me-1"></i>
                              Work between {
                                rules.halfDayCriteria.hours
                              } and {rules.minWorkHours} hours is considered
                              half-day
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="card bg-light border-0 h-100">
                            <div className="card-body">
                              <h6 className="card-title mb-3">
                                <i className="bi bi-info-circle text-info me-2"></i>
                                Work Hours Guide
                              </h6>

                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="small">
                                    <i className="bi bi-check-circle text-success me-1"></i>
                                    Full Day
                                  </span>
                                  <span className="badge bg-success">
                                    <i className="bi bi-check me-1"></i>
                                    {rules.minWorkHours}+ hours
                                  </span>
                                </div>
                                <div
                                  className="progress"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-success"
                                    style={{ width: "100%" }}
                                  ></div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="small">
                                    <i className="bi bi-exclamation-triangle text-warning me-1"></i>
                                    Half Day
                                  </span>
                                  <span className="badge bg-warning">
                                    <i className="bi bi-hourglass-split me-1"></i>
                                    {rules.halfDayCriteria.hours} -{" "}
                                    {rules.minWorkHours} hours
                                  </span>
                                </div>
                                <div
                                  className="progress"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-warning"
                                    style={{ width: "60%" }}
                                  ></div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="small">
                                    <i className="bi bi-x-circle text-danger me-1"></i>
                                    Short Day
                                  </span>
                                  <span className="badge bg-danger">
                                    <i className="bi bi-hourglass-bottom me-1"></i>
                                    Below {rules.halfDayCriteria.hours} hours
                                  </span>
                                </div>
                                <div
                                  className="progress"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-danger"
                                    style={{ width: "30%" }}
                                  ></div>
                                </div>
                              </div>

 <>
  <style>
    {`
      .custom-check {
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        font-size: 15px;
        margin-bottom: 10px;
      }

      .custom-check input {
        display: none;
      }

      .check-box {
        width: 18px;
        height: 18px;
        border: 2px solid #0d6efd;
        border-radius: 4px;
        display: flex;
        align-items: center;sss
        justify-content: center;
        margin-right: 8px;
        background: #fff;
        transition: all 0.2s ease;
        position: relative;
      }

      .custom-check input:checked + .check-box {
        background: #0d6efd;
        border-color: #0d6efd;
      }

      .custom-check input:checked + .check-box::after {
        content: "✔";
        color: #f8f2f2;      
        font-size: 13px;
        font-weight: bold;
        position: absolute;
      }
    `}
  </style>

  <div className="mt-4">
    {/* Consider Half Day */}
    <label className="custom-check">
      <input
        type="checkbox"
        checked={rules.halfDayCriteria.considerAsHalfDay}
        onChange={(e) =>
          handleChange("halfDayCriteria", {
            ...rules.halfDayCriteria,
            considerAsHalfDay: e.target.checked,
          })
        }
      />
      <span className="check-box"></span>
      <span>
        <i className="bi bi-calendar-check me-1"></i>
        Consider as Half-Day Leave
      </span>
    </label>

    {/* Mark Absent */}
    <label className="custom-check">
      <input
        type="checkbox"
        checked={rules.halfDayCriteria.markAsAbsentBelow}
        onChange={(e) =>
          handleChange("halfDayCriteria", {
            ...rules.halfDayCriteria,
            markAsAbsentBelow: e.target.checked,
          })
        }
      />
      <span className="check-box"></span>
      <span>
        <i className="bi bi-calendar-x me-1"></i>
        Mark as Absent below {rules.halfDayCriteria.applyAfterHours || 3} hours
      </span>
    </label>

    {/* Auto Deduct */}
    <label className="custom-check">
      <input
        type="checkbox"
        checked={rules.halfDayCriteria.autoDeduct}
        onChange={(e) =>
          handleChange("halfDayCriteria", {
            ...rules.halfDayCriteria,
            autoDeduct: e.target.checked,
          })
        }
      />
      <span className="check-box"></span>
      <span>
        <i className="bi bi-robot me-1"></i>
        Auto-deduct from leaves
      </span>
    </label>
  </div>
</>

 

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ 5. Short leave policies */}
                <div className="col-lg-4">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                     <div className="d-flex align-items-center gap-1">
  {/* Left side: icon + text */}
  <i className="bi bi-clock text-info"></i>
  <h6 className="text-nowrap mb-0">Short Leave Policies</h6>

 
</div>


                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-hourglass-split text-secondary me-1"></i>
                          Max Duration per Instance
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={rules.shortLeave.maxDuration}
                            onChange={(e) =>
                              handleChange("shortLeave", {
                                ...rules.shortLeave,
                                maxDuration: parseFloat(e.target.value),
                              })
                            }
                            min="0.5"
                            max="8"
                            step="0.5"
                          />
                          <span className="input-group-text">
                            <i className="bi bi-clock"></i>
                          </span>
                        </div>
                        <div className="form-text">
                          <i className="bi bi-stopwatch me-1"></i>Maximum
                          allowed duration for one short leave
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-calendar-month text-secondary me-1"></i>
                          Max Frequency per Month
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={rules.shortLeave.maxFrequency}
                            onChange={(e) =>
                              handleChange("shortLeave", {
                                ...rules.shortLeave,
                                maxFrequency: parseInt(e.target.value),
                              })
                            }
                            min="0"
                            max="31"
                          />
                          <span className="input-group-text">
                            <i className="bi bi-calendar-check"></i>
                          </span>
                        </div>
                        <div className="form-text">
                          <i className="bi bi-123 me-1"></i>Maximum short leave
                          instances per month
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={rules.shortLeave.requiresApproval}
                            onChange={(e) =>
                              handleChange("shortLeave", {
                                ...rules.shortLeave,
                                requiresApproval: e.target.checked,
                              })
                            }
                            id="shortLeaveApproval"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="shortLeaveApproval"
                          >
                            <i className="bi bi-shield-check me-1"></i>
                            Requires Manager Approval
                          </label>
                        </div>

                        <div className="form-check form-switch mt-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={rules.shortLeave.autoDeduct}
                            onChange={(e) =>
                              handleChange("shortLeave", {
                                ...rules.shortLeave,
                                autoDeduct: e.target.checked,
                              })
                            }
                            id="shortLeaveAutoDeduct"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="shortLeaveAutoDeduct"
                          >
                            <i className="bi bi-robot me-1"></i>
                            Auto-deduct from leaves
                          </label>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h6 className="small text-muted mb-3">
                          <i className="bi bi-list-check me-2"></i>
                          Short Leave Categories
                        </h6>
                        <div className="list-group list-group-flush">
                          {rules.shortLeave.categories.map(
                            (category, index) => (
                              <div
                                key={category.id}
                                className="list-group-item px-0 py-2"
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <div className="d-flex align-items-center">
                                      <i
                                        className={`bi ${category.icon} text-${category.color} me-2`}
                                      ></i>
                                      <span className="fw-bold">
                                        {category.name}
                                      </span>
                                    </div>
                                    <div className="small text-muted mt-1">
                                      <i className="bi bi-clock-history me-1"></i>
                                      Max: {category.maxDuration} hours •
                                      <i className="bi bi-file-text ms-2 me-1"></i>
                                      Docs:{" "}
                                      {category.requiresDoc ? (
                                        <span className="text-danger">
                                          <i className="bi bi-exclamation-circle me-1"></i>{" "}
                                          Required
                                        </span>
                                      ) : (
                                        <span className="text-success">
                                          <i className="bi bi-check-circle me-1"></i>{" "}
                                          Not Required
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="btn-group btn-group-sm">
                                    <button
                                      className="btn btn-outline-secondary"
                                      onClick={() => {
                                        const newName = prompt(
                                          "Enter new category name:",
                                          category.name
                                        );
                                        if (newName) {
                                          updateShortLeaveCategory(
                                            category.id,
                                            { name: newName }
                                          );
                                        }
                                      }}
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-danger"
                                      onClick={() =>
                                        deleteShortLeaveCategory(category.id)
                                      }
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ 6. Continuous absence detection */}
                <div className="col-md-6">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calendar-x text-danger me-2"></i>
                        <h6 className="mb-0">Continuous Absence Detection</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="alert alert-light border mb-3">
                        <i className="bi bi-bell text-warning me-2"></i>
                        <small>
                          Automatically detects and escalates continuous absence
                          patterns. Sends alerts and escalates to higher
                          management levels.
                        </small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-calendar-range text-secondary me-1"></i>
                          Alert Threshold (consecutive days)
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={rules.continuousAbsence.threshold}
                            onChange={(e) =>
                              handleChange("continuousAbsence", {
                                ...rules.continuousAbsence,
                                threshold: parseInt(e.target.value),
                              })
                            }
                            min="1"
                            max="30"
                          />
                          <span className="input-group-text">
                            <i className="bi bi-calendar"></i>
                          </span>
                        </div>
                        <div className="form-text">
                          <i className="bi bi-graph-up me-1"></i>Trigger alert
                          after this many consecutive absent days
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-bell text-secondary me-1"></i>
                          Notify After (days)
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={rules.continuousAbsence.notifyAfterDays}
                            onChange={(e) =>
                              handleChange("continuousAbsence", {
                                ...rules.continuousAbsence,
                                notifyAfterDays: parseInt(e.target.value),
                              })
                            }
                            min="1"
                            max="7"
                          />
                          <span className="input-group-text">
                            <i className="bi bi-calendar-day"></i>
                          </span>
                        </div>
                        <div className="form-text">
                          <i className="bi bi-clock-history me-1"></i>Send
                          initial notification after this many days
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-shield text-secondary me-1"></i>
                          Current Escalation Level
                        </label>
                        <select
                          className="form-select"
                          value={rules.continuousAbsence.currentLevel}
                          onChange={(e) =>
                            handleChange("continuousAbsence", {
                              ...rules.continuousAbsence,
                              currentLevel: e.target.value,
                            })
                          }
                        >
                          {rules.continuousAbsence.escalationLevels.map(
                            (level) => (
                              <option key={level} value={level}>
                                <i className="bi bi-person-badge me-1"></i>
                                {level}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={rules.continuousAbsence.autoAlert}
                          onChange={(e) =>
                            handleChange("continuousAbsence", {
                              ...rules.continuousAbsence,
                              autoAlert: e.target.checked,
                            })
                          }
                          id="autoAlertAbsence"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="autoAlertAbsence"
                        >
                          <i className="bi bi-robot me-1"></i>
                          Send Automatic Alerts
                        </label>
                      </div>

                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={rules.continuousAbsence.emailAlerts}
                          onChange={(e) =>
                            handleChange("continuousAbsence", {
                              ...rules.continuousAbsence,
                              emailAlerts: e.target.checked,
                            })
                          }
                          id="emailAlerts"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="emailAlerts"
                        >
                          <i className="bi bi-envelope me-1"></i>
                          Email Alerts
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ 7. Weekend working approval requirement & ✅ 8. Holiday working approval and compensation rules */}
                <div className="col-md-6">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calendar-week text-success me-2"></i>
                        <h6 className="mb-0">Weekend & Holiday Working</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {/* Weekend Working */}
                        <div className="col-md-6 mb-4">
                          <div className="card bg-light border-0 h-100">
                            <div className="card-body">
                              <h6 className="card-title mb-3">
                                <i className="bi bi-calendar2-week text-primary me-2"></i>
                                Weekend Working
                              </h6>

                              <div className="mb-3">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={
                                      rules.weekendWorking.requiresApproval
                                    }
                                    onChange={(e) =>
                                      handleChange("weekendWorking", {
                                        ...rules.weekendWorking,
                                        requiresApproval: e.target.checked,
                                      })
                                    }
                                    id="weekendApproval"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="weekendApproval"
                                  >
                                    <i className="bi bi-shield-check me-1"></i>
                                    Requires Approval
                                  </label>
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="form-label small">
                                  <i className="bi bi-cash-coin me-1"></i>
                                  Compensation Rate
                                </label>
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text">
                                    <i className="bi bi-arrow-up-right"></i>
                                  </span>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={rules.weekendWorking.rate}
                                    onChange={(e) =>
                                      handleChange("weekendWorking", {
                                        ...rules.weekendWorking,
                                        rate: parseFloat(e.target.value),
                                      })
                                    }
                                    min="1"
                                    step="0.25"
                                  />
                                  <span className="input-group-text">x</span>
                                </div>
                                <div className="form-text small">
                                  <i className="bi bi-percent me-1"></i>
                                  Multiplier of regular pay rate
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="form-label small">
                                  <i className="bi bi-clock me-1"></i>
                                  Max Hours per Day
                                </label>
                                <div className="input-group input-group-sm">
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={rules.weekendWorking.maxHours}
                                    onChange={(e) =>
                                      handleChange("weekendWorking", {
                                        ...rules.weekendWorking,
                                        maxHours: parseInt(e.target.value),
                                      })
                                    }
                                    min="1"
                                    max="12"
                                  />
                                  <span className="input-group-text">
                                    <i className="bi bi-clock"></i>
                                  </span>
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="form-label small">
                                  <i className="bi bi-alarm me-1"></i>
                                  Advance Notice (hours)
                                </label>
                                <div className="input-group input-group-sm">
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={rules.weekendWorking.advanceNotice}
                                    onChange={(e) =>
                                      handleChange("weekendWorking", {
                                        ...rules.weekendWorking,
                                        advanceNotice: parseInt(e.target.value),
                                      })
                                    }
                                    min="1"
                                    max="168"
                                  />
                                  <span className="input-group-text">
                                    <i className="bi bi-clock-history"></i>
                                  </span>
                                </div>
                              </div>

                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={rules.weekendWorking.compOffAllowed}
                                  onChange={(e) =>
                                    handleChange("weekendWorking", {
                                      ...rules.weekendWorking,
                                      compOffAllowed: e.target.checked,
                                    })
                                  }
                                  id="weekendCompOff"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="weekendCompOff"
                                >
                                  <i className="bi bi-calendar-plus me-1"></i>
                                  Allow Compensatory Off
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Holiday Working */}
                        <div className="col-md-6">
                          <div className="card bg-light border-0 h-100">
                            <div className="card-body">
                              <h6 className="card-title mb-3">
                                <i className="bi bi-calendar-event text-warning me-2"></i>
                                Holiday Working
                              </h6>

                              <div className="mb-3">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={
                                      rules.holidayWorking.requiresApproval
                                    }
                                    onChange={(e) =>
                                      handleChange("holidayWorking", {
                                        ...rules.holidayWorking,
                                        requiresApproval: e.target.checked,
                                      })
                                    }
                                    id="holidayApproval"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="holidayApproval"
                                  >
                                    <i className="bi bi-shield-check me-1"></i>
                                    Requires Approval
                                  </label>
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="form-label small">
                                  <i className="bi bi-cash-stack me-1"></i>
                                  Compensation Rate
                                </label>
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text">
                                    <i className="bi bi-arrow-up-right"></i>
                                  </span>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={rules.holidayWorking.rate}
                                    onChange={(e) =>
                                      handleChange("holidayWorking", {
                                        ...rules.holidayWorking,
                                        rate: parseFloat(e.target.value),
                                      })
                                    }
                                    min="1"
                                    step="0.25"
                                  />
                                  <span className="input-group-text">x</span>
                                </div>
                                <div className="form-text small">
                                  <i className="bi bi-percent me-1"></i>Double
                                  pay or higher for holidays
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={
                                      rules.holidayWorking.canTakeCompOff
                                    }
                                    onChange={(e) =>
                                      handleChange("holidayWorking", {
                                        ...rules.holidayWorking,
                                        canTakeCompOff: e.target.checked,
                                      })
                                    }
                                    id="canTakeCompOff"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="canTakeCompOff"
                                  >
                                    <i className="bi bi-calendar-plus me-1"></i>
                                    Can Take Compensatory Off
                                  </label>
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="form-label small">
                                  <i className="bi bi-calendar-check me-1"></i>
                                  Comp-Off Validity
                                </label>
                                <div className="input-group input-group-sm">
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={rules.holidayWorking.compOffValidity}
                                    onChange={(e) =>
                                      handleChange("holidayWorking", {
                                        ...rules.holidayWorking,
                                        compOffValidity: parseInt(
                                          e.target.value
                                        ),
                                      })
                                    }
                                    min="1"
                                    max="365"
                                  />
                                  <span className="input-group-text">
                                    <i className="bi bi-calendar"></i>
                                  </span>
                                </div>
                              </div>

                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={rules.holidayWorking.advanceApproval}
                                  onChange={(e) =>
                                    handleChange("holidayWorking", {
                                      ...rules.holidayWorking,
                                      advanceApproval: e.target.checked,
                                    })
                                  }
                                  id="advanceApproval"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="advanceApproval"
                                >
                                  <i className="bi bi-clock-history me-1"></i>
                                  Advance Approval Required
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-top">
                        <div className="small text-muted mb-2">
                          <i className="bi bi-graph-up me-1"></i>
                          Compensation Comparison
                        </div>
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="small text-muted">
                              <i className="bi bi-clock me-1"></i>Regular
                            </div>
                            <div className="fw-bold">1.0x</div>
                          </div>
                          <div className="col-4">
                            <div className="small text-muted">
                              <i className="bi bi-calendar2-week me-1"></i>
                              Weekend
                            </div>
                            <div className="fw-bold text-warning">
                              <i className="bi bi-arrow-up-right me-1"></i>
                              {rules.weekendWorking.rate}x
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="small text-muted">
                              <i className="bi bi-calendar-event me-1"></i>
                              Holiday
                            </div>
                            <div className="fw-bold text-danger">
                              <i className="bi bi-arrow-up-right me-1"></i>
                              {rules.holidayWorking.rate}x
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
        </div>
      </div>
    </div>
  );
};

// ==============================
// OVERTIME MANAGEMENT COMPONENT
// ==============================
const OvertimeManagement = () => {
  // Load rules from localStorage or use defaults
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem("overtimeManagementRules");
    if (savedRules) {
      return JSON.parse(savedRules);
    }

    // Default rules structure
    return {
      eligibility: {
        minWorkHours: 8,
        probationPeriod: 90,
        employeeLevels: ["permanent"],
        excludeWeekends: false,
        includeWFH: false,
        minServiceMonths: 3,
        departmentEligibility: ["IT", "Operations", "Support"],
      },
      calculation: {
        method: "multiplier",
        weekdayRate: 1.5,
        weekendRate: 2.0,
        holidayRate: 2.5,
        nightShiftBonus: 0.25,
        fixedRate: 25,
        roundToNearest: 0.25,
        includeHolidays: true,
        includeNightShift: true,
      },
      caps: {
        daily: 4,
        weekly: 20,
        monthly: 80,
        yearly: 300,
        consecutiveDays: 7,
      },
      approvalWorkflow: {
        levels: ["Manager", "HR"],
        autoApproveAfter: 2,
        maxApprovalDays: 7,
        requireDocumentation: true,
        notifyIfPending: true,
        escalationHours: 24,
        multipleApprovers: false,
      },
      compensation: {
        type: "both",
        compOffValidity: 90,
        paymentCycle: "monthly",
        conversionRate: 1.0,
        autoConvertToCompOff: true,
        taxDeductible: true,
        minHoursForPay: 1,
        minHoursForCompOff: 4,
      },
      reports: {
        autoGenerate: true,
        frequency: "monthly",
        notifyManagers: true,
        retentionPeriod: 3,
        includeAnalytics: true,
        reportTypes: ["summary", "detailed", "compliance"],
      },
      categories: [
        {
          id: 1,
          name: "Regular Overtime",
          rate: 1.5,
          caps: { daily: 4, weekly: 20, monthly: 80 },
          requiresApproval: true,
          compensationType: "both",
          description: "Standard overtime for extra work",
        },
        {
          id: 2,
          name: "Emergency Overtime",
          rate: 2.0,
          caps: { daily: 8, weekly: 40, monthly: 160 },
          requiresApproval: false,
          compensationType: "pay",
          description: "Urgent/critical business needs",
        },
        {
          id: 3,
          name: "Weekend Work",
          rate: 2.0,
          caps: { daily: 8, weekly: 16, monthly: 64 },
          requiresApproval: true,
          compensationType: "compOff",
          description: "Special weekend assignments",
        },
        {
          id: 4,
          name: "Holiday Work",
          rate: 2.5,
          caps: { daily: 8, weekly: 16, monthly: 64 },
          requiresApproval: true,
          compensationType: "pay",
          description: "Work on official holidays",
        },
      ],
      analytics: {
        enabled: true,
        trackTrends: true,
        predictiveAnalysis: false,
        alertThreshold: 85,
        benchmarkHours: 20,
      },
    };
  });

  // Save to localStorage whenever rules change
  useEffect(() => {
    localStorage.setItem("overtimeManagementRules", JSON.stringify(rules));
  }, [rules]);

  const handleChange = (section, data) => {
    setRules((prev) => ({
      ...prev,
      [section]:
        typeof data === "object" ? { ...prev[section], ...data } : data,
    }));
  };

  const handleCategoryChange = (id, data) => {
    setRules((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === id ? { ...cat, ...data } : cat
      ),
    }));
  };

  const addOvertimeCategory = () => {
    const newId =
      rules.categories.length > 0
        ? Math.max(...rules.categories.map((c) => c.id)) + 1
        : 1;

    const newCategory = {
      id: newId,
      name: `New Category ${newId}`,
      rate: 1.5,
      caps: { daily: 4, weekly: 20, monthly: 80 },
      requiresApproval: true,
      compensationType: "both",
      description: "",
    };

    setRules((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const deleteOvertimeCategory = (id) => {
    if (rules.categories.length <= 1) {
      alert("At least one category must remain");
      return;
    }

    if (window.confirm("Are you sure you want to delete this category?")) {
      setRules((prev) => ({
        ...prev,
        categories: prev.categories.filter((cat) => cat.id !== id),
      }));
    }
  };

  const resetToDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all overtime rules to defaults?"
      )
    ) {
      localStorage.removeItem("overtimeManagementRules");
      window.location.reload();
    }
  };

  const exportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "overtime-rules-backup.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importRules = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedRules = JSON.parse(e.target.result);
        setRules(importedRules);
        alert("Overtime rules imported successfully!");
      } catch (error) {
        alert("Error importing rules. Invalid JSON format.");
      }
    };
    reader.readAsText(file);
  };

  // Calculate statistics
  const stats = {
    totalCategories: rules.categories.length,
    avgOvertimeRate: (
      rules.categories.reduce((sum, cat) => sum + cat.rate, 0) /
      rules.categories.length
    ).toFixed(2),
    totalMonthlyCap: rules.caps.monthly,
    totalAnnualCap: rules.caps.yearly,
    approvalRate:
      rules.approvalWorkflow.levels.length > 1 ? "Multi-level" : "Single-level",
    compensationTypes: [
      ...new Set(rules.categories.map((cat) => cat.compensationType)),
    ],
  };
  // Add this function for duplicating categories
  const duplicateCategory = (id) => {
    const categoryToDuplicate = rules.categories.find((cat) => cat.id === id);
    if (!categoryToDuplicate) return;

    const newId =
      rules.categories.length > 0
        ? Math.max(...rules.categories.map((c) => c.id)) + 1
        : 1;

    const duplicatedCategory = {
      ...categoryToDuplicate,
      id: newId,
      name: `${categoryToDuplicate.name} (Copy)`,
      description: categoryToDuplicate.description
        ? `${categoryToDuplicate.description} - Copy`
        : "",
    };

    setRules((prev) => ({
      ...prev,
      categories: [...prev.categories, duplicatedCategory],
    }));
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-gradient-light text-dark">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 gap-sm-0">
                {/* Title */}
                <div>
                  <h5 className="fw-semibold mb-0 h6 h5-sm h4-md">
                    Overtime Management System
                  </h5>
                </div>

                {/* Action Buttons */}
                <div className="d-flex align-items-center">
                  {/* Small screen: Icon-only buttons */}
                  <div className="btn-group d-sm-none me-1">
                    <button
                      className="btn btn-sm btn-light"
                      onClick={exportRules}
                      title="Export Overtime Rules"
                    >
                      <i className="bi bi-download"></i>
                    </button>
                    <label
                      className="btn btn-sm btn-light position-relative"
                      title="Import Overtime Rules"
                    >
                      <i className="bi bi-upload"></i>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importRules}
                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                        style={{ cursor: "pointer" }}
                      />
                    </label>
                    <button
                      className="btn btn-sm btn-light"
                      onClick={resetToDefaults}
                      title="Reset to Defaults"
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>

                  {/* Medium+ screens: Full buttons with group */}
                    <div className="d-none d-sm-flex btn-group">
  <button
    className="btn btn-sm btn-primary d-flex align-items-center"
    onClick={exportRules}
    title="Export Rules"
  >
    <i className="bi bi-download me-1 me-md-2"></i>
    <span className="d-none d-md-inline">Export</span>
  </button>

  <label
    className="btn btn-sm btn-primary d-flex align-items-center position-relative"
    title="Import Rules"
  >
    <i className="bi bi-upload me-1 me-md-2"></i>
    <span className="d-none d-md-inline">Import</span>
    <input
      type="file"
      accept=".json"
      onChange={importRules}
      className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
      style={{ cursor: "pointer" }}
    />
  </label>

  <button
    className="btn btn-sm btn-primary d-flex align-items-center"
    onClick={resetToDefaults}
    title="Reset to Defaults"
  >
    <i className="bi bi-arrow-clockwise me-1 me-md-2"></i>
    <span className="d-none d-md-inline">Reset</span>
  </button>
</div>

                  {/* Optional: Add a Save button like in your reference if needed */}
                  {/* <button className="btn btn-sm btn-primary">Save</button> */}
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Storage Status & Stats */}
              <div className="alert alert-info mb-4 p-3">
                <div className="container-fluid p-0">
                  <div className="row align-items-center g-2 g-md-3">
                    {/* Icon Column */}
                    <div className="col-auto">
                      <i className="bi bi-database fs-3 fs-md-4 text-info"></i>
                    </div>

                    {/* Content Column */}
                    <div className="col-12 col-md">
                      <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <div className="mb-1 mb-md-0 me-md-3">
                          <h6 className="fw-semibold mb-0 d-inline me-2">
                          
                            Overtime Rules Auto-Saved to Local Storage
                          </h6>
                          <span className="badge bg-info d-none d-md-inline">
                            Auto-save
                          </span>
                          <span className="badge bg-success d-md-none ms-2">
                            {stats.totalCategories}
                          </span>
                        </div>
                        <div className="text-muted small flex-grow-1">
                          <span>
                            All overtime configurations are automatically saved
                            and persist across sessions. Last updated:{" "}
                            {new Date().toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Categories Badge Column - Desktop only */}
                    <div className="col-auto d-none d-md-block">
                      <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 p-2 px-3 d-flex align-items-center">
                        <i className="bi bi-cash-coin fs-5 me-2"></i>
                        <div>
                          <div className="small">Overtime Categories</div>
                          <div className="fw-bold fs-6">
                            {stats.totalCategories}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border">
                    <div className="card-body p-2 p-sm-3">
                      <div className="row g-0 text-center">
                        {[
                          {
                            title: "Avg Overtime Rate",
                            value: `${stats.avgOvertimeRate}x`,
                            color: "primary",
                            icon: "bi-graph-up",
                            subtitle: "Average multiplier",
                            shortTitle: "Avg Rate",
                          },
                          {
                            title: "Monthly Cap",
                            value: `${stats.totalMonthlyCap}h`,
                            color: "warning",
                            icon: "bi-speedometer",
                            subtitle: "Maximum per month",
                            shortTitle: "Monthly",
                          },
                          {
                            title: "Annual Cap",
                            value: `${stats.totalAnnualCap}h`,
                            color: "info",
                            icon: "bi-calendar",
                            subtitle: "Yearly limit",
                            shortTitle: "Annual",
                          },
                          {
                            title: "Approval Type",
                            value: stats.approvalRate,
                            color: "success",
                            icon: "bi-clipboard-check",
                            subtitle: "Workflow levels",
                            shortTitle: "Approval",
                          },
                          {
                            title: "Compensation",
                            value: stats.compensationTypes.length,
                            color: "dark",
                            icon: "bi-cash-stack",
                            subtitle: "Payment types",
                            shortTitle: "Payment",
                          },
                          {
                            title: "Auto-Save",
                            value: "Active",
                            color: "success",
                            icon: "bi-database",
                            subtitle: "Storage status",
                            shortTitle: "Auto-Save",
                          },
                        ].map((stat, index) => (
                          <div key={index} className="col-6 col-md-4 col-lg-2">
                            <div
                              className={`
                  h-100 py-2 py-sm-3
                  ${index > 0 ? "border-start border-light" : ""}
                  ${index === 2 || index === 5 ? "border-md-none" : ""}
                `}
                            >
                              {/* Title with responsive icon */}
                              <div className="fw-semibold text-secondary small mb-1 mb-sm-2">
                                <i
                                  className={`bi ${stat.icon} d-none d-sm-inline me-1 me-sm-2`}
                                ></i>
                                <i
                                  className={`bi ${stat.icon} d-sm-none me-1`}
                                ></i>
                                <span className="d-none d-sm-inline">
                                  {stat.title}
                                </span>
                                <span className="d-sm-none">
                                  {stat.shortTitle}
                                </span>
                              </div>

                              {/* Value with responsive size */}
                             <div
  className={`h6 h5-sm h4-lg mb-1 mb-sm-2 text-${stat.color} fw-semibold`}
>
  {stat.value}
</div>


                              {/* Subtitle with responsive icon */}
                              <div className="small text-muted mb-0">
                                <i className="bi bi-info-circle d-none d-sm-inline me-1"></i>
                                <span className="d-none d-sm-inline">
                                  {stat.subtitle}
                                </span>
                                <span className="d-sm-none">
                                  {stat.shortTitle}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Configuration Section */}
              <div className="row g-4">
                {/* ✅ 1. Overtime eligibility criteria */}
                <div className="col-lg-6">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-person-check text-primary me-2"></i>
                        <h6 className="mb-0">Eligibility Criteria</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-clock text-secondary me-1"></i>
                          Minimum Daily Work Hours
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={rules.eligibility.minWorkHours}
                            onChange={(e) =>
                              handleChange("eligibility", {
                                minWorkHours: parseInt(e.target.value),
                              })
                            }
                            min="1"
                            max="12"
                          />
                          <span className="input-group-text">
                            <i className="bi bi-clock-history"></i>
                          </span>
                        </div>
                        <div className="form-text">
                          <i className="bi bi-info-circle me-1"></i>
                          Must complete regular hours before overtime counts
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-calendar-range text-secondary me-1"></i>
                          Probation Period
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={rules.eligibility.probationPeriod}
                            onChange={(e) =>
                              handleChange("eligibility", {
                                probationPeriod: parseInt(e.target.value),
                              })
                            }
                            min="0"
                            max="180"
                          />
                          <span className="input-group-text">
                            <i className="bi bi-calendar"></i>
                          </span>
                        </div>
                        <div className="form-text">
                          <i className="bi bi-shield me-1"></i>
                          Employees must complete probation to be eligible
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-people text-secondary me-1"></i>
                          Employee Levels
                        </label>
                        <div className="input-group">
                          <select
                            className="form-select"
                            value={
                              rules.eligibility.employeeLevels[0] || "permanent"
                            }
                            onChange={(e) => {
                              handleChange("eligibility", {
                                employeeLevels: [e.target.value],
                              });
                            }}
                          >
                            <option value="permanent">
                              <i className="bi bi-briefcase me-1"></i> Permanent
                              Employees Only
                            </option>
                            <option value="contract">
                              <i className="bi bi-file-earmark-text me-1"></i>{" "}
                              Contract Employees
                            </option>
                            <option value="probation">
                              <i className="bi bi-hourglass-split me-1"></i>{" "}
                              Probation Employees
                            </option>
                            <option value="intern">
                              <i className="bi bi-mortarboard me-1"></i> Interns
                            </option>
                            <option value="temporary">
                              <i className="bi bi-clock me-1"></i> Temporary
                              Employees
                            </option>
                            <option value="all">
                              <i className="bi bi-check-circle me-1"></i> All
                              Employees
                            </option>
                          </select>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => {
                              const currentLevel =
                                rules.eligibility.employeeLevels[0];
                              const allLevels = [
                                "permanent",
                                "contract",
                                "probation",
                                "intern",
                                "temporary",
                              ];
                              if (currentLevel === "all") {
                                handleChange("eligibility", {
                                  employeeLevels: [],
                                });
                              } else {
                                handleChange("eligibility", {
                                  employeeLevels: allLevels,
                                });
                              }
                            }}
                            title={
                              rules.eligibility.employeeLevels[0] === "all"
                                ? "Clear Selection"
                                : "Select All"
                            }
                          >
                            <i
                              className={
                                rules.eligibility.employeeLevels[0] === "all"
                                  ? "bi bi-x-circle"
                                  : "bi bi-check-all"
                              }
                            ></i>
                          </button>
                        </div>
                        <div className="form-text">
                          <i className="bi bi-info-circle me-1"></i>
                          Selected:{" "}
                          {rules.eligibility.employeeLevels.length === 1 &&
                          rules.eligibility.employeeLevels[0] === "all"
                            ? "All employee types"
                            : rules.eligibility.employeeLevels
                                .map((level) => {
                                  const names = {
                                    permanent: "Permanent",
                                    contract: "Contract",
                                    probation: "Probation",
                                    intern: "Intern",
                                    temporary: "Temporary",
                                    all: "All Employees",
                                  };
                                  return names[level];
                                })
                                .join(", ")}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-building text-secondary me-1"></i>
                          Eligible Departments
                        </label>
                        <div className="input-group">
                          <select
                            className="form-select"
                            value={
                              rules.eligibility.departmentEligibility[0] || "IT"
                            }
                            onChange={(e) => {
                              handleChange("eligibility", {
                                departmentEligibility: [e.target.value],
                              });
                            }}
                          >
                            <option value="IT">IT Department Only</option>
                            <option value="Operations">Operations Only</option>
                            <option value="Support">Support Only</option>
                            <option value="Sales">Sales Only</option>
                            <option value="Marketing">Marketing Only</option>
                            <option value="HR">Human Resources Only</option>
                            <option value="Finance">Finance Only</option>
                            <option value="all">All Departments</option>
                          </select>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => {
                              const currentDept =
                                rules.eligibility.departmentEligibility[0];
                              const allDepts = [
                                "IT",
                                "Operations",
                                "Support",
                                "Sales",
                                "Marketing",
                                "HR",
                                "Finance",
                              ];
                              if (currentDept === "all") {
                                handleChange("eligibility", {
                                  departmentEligibility: [],
                                });
                              } else {
                                handleChange("eligibility", {
                                  departmentEligibility: allDepts,
                                });
                              }
                            }}
                            title={
                              rules.eligibility.departmentEligibility[0] ===
                              "all"
                                ? "Clear Selection"
                                : "Select All"
                            }
                          >
                            <i
                              className={
                                rules.eligibility.departmentEligibility[0] ===
                                "all"
                                  ? "bi bi-x-circle"
                                  : "bi bi-check-all"
                              }
                            ></i>
                          </button>
                        </div>
                        <div className="form-text">
                          <i className="bi bi-info-circle me-1"></i>
                          Selected:{" "}
                          {rules.eligibility.departmentEligibility.length ===
                            1 &&
                          rules.eligibility.departmentEligibility[0] === "all"
                            ? "All departments"
                            : rules.eligibility.departmentEligibility.join(
                                ", "
                              )}
                        </div>
                      </div>

                      {/* Additional Eligibility Settings */}
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-calendar-month text-secondary me-1"></i>
                          Minimum Service Months
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={rules.eligibility.minServiceMonths || 0}
                            onChange={(e) =>
                              handleChange("eligibility", {
                                minServiceMonths: parseInt(e.target.value),
                              })
                            }
                            min="0"
                            max="60"
                          />
                          <span className="input-group-text">
                            <i className="bi bi-calendar-check"></i>
                          </span>
                        </div>
                        <div className="form-text">
                          <i className="bi bi-clock-history me-1"></i>
                          Minimum months of service required for overtime
                        </div>
                      </div>

                   <div className="row g-2 mb-3">

  <style>
    {`
      /* Big blue checkbox with bold white tick for all checkboxes */
      .form-check-input {
        width: 1.6rem;
        height: 1.6rem;
        cursor: pointer;
        position: relative;
        appearance: none;
        -webkit-appearance: none;
        background-color: #fff;
        border: 2px solid #0d6efd;
        border-radius: 0.25rem;
        transition: all 0.15s;
      }

      .form-check-input:checked {
        background-color: #0d6efd;
        border-color: #0d6efd;
      }

      /* Bold white tick */
      .form-check-input:checked::after {
        content: "";
        position: absolute;
        left: 5px;
        top: 3px;
        width: 6px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
      }

      .form-check-label {
        margin-left: 0.6rem;
        cursor: pointer;
        font-weight: 500;
      }
    `}
  </style>

  <div className="col-6">
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={rules.eligibility.excludeWeekends}
        onChange={(e) =>
          handleChange("eligibility", { excludeWeekends: e.target.checked })
        }
        id="excludeWeekends"
      />
      <label className="form-check-label" htmlFor="excludeWeekends">
        <i className="bi bi-calendar-week me-1"></i>
        Exclude Weekends
      </label>
    </div>
  </div>

  <div className="col-6">
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={rules.eligibility.includeWFH}
        onChange={(e) =>
          handleChange("eligibility", { includeWFH: e.target.checked })
        }
        id="includeWFH"
      />
      <label className="form-check-label" htmlFor="includeWFH">
        <i className="bi bi-house me-1"></i>
        Include WFH
      </label>
    </div>
  </div>

</div>


                      {/* Eligibility Summary */}
                      <div className="card bg-light border-0 mt-4">
                        <div className="card-body p-3">
                          <h6 className="card-title small mb-3">
                            <i className="bi bi-info-circle text-primary me-2"></i>
                            Eligibility Summary
                          </h6>
                          <div className="row">
                            <div className="col-6">
                              <div className="small text-muted">
                                <i className="bi bi-clock me-1"></i>Min Hours
                              </div>
                              <div className="fw-bold">
                                {rules.eligibility.minWorkHours}h
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="small text-muted">
                                <i className="bi bi-calendar me-1"></i>Probation
                              </div>
                              <div className="fw-bold">
                                {rules.eligibility.probationPeriod}d
                              </div>
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-12">
                              <div className="small text-muted">
                                <i className="bi bi-people me-1"></i>Eligible
                                Types
                              </div>
                              <div className="fw-bold small">
                                {rules.eligibility.employeeLevels.length ===
                                  1 &&
                                rules.eligibility.employeeLevels[0] === "all"
                                  ? "All employees"
                                  : rules.eligibility.employeeLevels
                                      .map((level) => {
                                        const names = {
                                          permanent: "Permanent",
                                          contract: "Contract",
                                          probation: "Probation",
                                          intern: "Intern",
                                          temporary: "Temporary",
                                        };
                                        return names[level];
                                      })
                                      .join(", ")}
                              </div>
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-12">
                              <div className="small text-muted">
                                <i className="bi bi-building me-1"></i>
                                Departments
                              </div>
                              <div className="fw-bold small">
                                {rules.eligibility.departmentEligibility
                                  .length === 1 &&
                                rules.eligibility.departmentEligibility[0] ===
                                  "all"
                                  ? "All departments"
                                  : rules.eligibility.departmentEligibility.join(
                                      ", "
                                    )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ 2. Overtime calculation methods */}
                <div className="col-lg-6">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calculator text-info me-2"></i>
                        <h6 className="mb-0">Calculation Methods</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-calculator-fill text-secondary me-1"></i>
                          Calculation Method
                        </label>
                        <select
                          className="form-select"
                          value={rules.calculation.method}
                          onChange={(e) =>
                            handleChange("calculation", {
                              method: e.target.value,
                            })
                          }
                        >
                          <option value="multiplier">
                            <i className="bi bi-percent me-1"></i> Multiplier
                            Rate
                          </option>
                          <option value="fixed">
                            <i className="bi bi-currency-dollar me-1"></i> Fixed
                            Rate
                          </option>
                          <option value="hybrid">
                            <i className="bi bi-arrow-left-right me-1"></i>{" "}
                            Hybrid (Both)
                          </option>
                        </select>
                      </div>

                      {rules.calculation.method === "multiplier" && (
                        <div className="card bg-light border-0 p-3 mb-3">
                          <h6 className="small text-muted mb-3">
                            <i className="bi bi-lightning-charge text-warning me-1"></i>
                            Multiplier Rates
                          </h6>
                          <div className="row g-2">
                            <div className="col-12">
                              <label className="form-label small">
                                Weekday Rate
                              </label>
                              <div className="input-group input-group-sm">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={rules.calculation.weekdayRate}
                                  onChange={(e) =>
                                    handleChange("calculation", {
                                      weekdayRate: parseFloat(e.target.value),
                                    })
                                  }
                                  min="1"
                                  step="0.25"
                                />
                                <span className="input-group-text">
                                  <i className="bi bi-x"></i>
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <label className="form-label small">
                                Weekend Rate
                              </label>
                              <div className="input-group input-group-sm">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={rules.calculation.weekendRate}
                                  onChange={(e) =>
                                    handleChange("calculation", {
                                      weekendRate: parseFloat(e.target.value),
                                    })
                                  }
                                  min="1"
                                  step="0.25"
                                />
                                <span className="input-group-text">
                                  <i className="bi bi-x"></i>
                                </span>
                              </div>
                            </div>
                            <div className="col-12">
                              <label className="form-label small">
                                Holiday Rate
                              </label>
                              <div className="input-group input-group-sm">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={rules.calculation.holidayRate}
                                  onChange={(e) =>
                                    handleChange("calculation", {
                                      holidayRate: parseFloat(e.target.value),
                                    })
                                  }
                                  min="1"
                                  step="0.25"
                                />
                                <span className="input-group-text">
                                  <i className="bi bi-x"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {rules.calculation.method === "fixed" && (
                        <div className="mb-3">
                          <label className="form-label">
                            Fixed Rate per Hour
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-currency-dollar"></i>
                            </span>
                            <input
                              type="number"
                              className="form-control"
                              value={rules.calculation.fixedRate}
                              onChange={(e) =>
                                handleChange("calculation", {
                                  fixedRate: parseFloat(e.target.value),
                                })
                              }
                              min="0"
                              step="0.5"
                            />
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-clock-history text-secondary me-1"></i>
                          Round to Nearest
                        </label>
                        <select
                          className="form-select"
                          value={rules.calculation.roundToNearest}
                          onChange={(e) =>
                            handleChange("calculation", {
                              roundToNearest: parseFloat(e.target.value),
                            })
                          }
                        >
                          <option value="0.25">
                            <i className="bi bi-clock me-1"></i> 15 minutes
                            (0.25 hours)
                          </option>
                          <option value="0.5">
                            <i className="bi bi-clock-half me-1"></i> 30 minutes
                            (0.5 hours)
                          </option>
                          <option value="1">
                            <i className="bi bi-clock-fill me-1"></i> 1 hour
                          </option>
                          <option value="0">
                            <i className="bi bi-calculator me-1"></i> Exact
                            calculation
                          </option>
                        </select>
                      </div>

                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={rules.calculation.includeHolidays}
                          onChange={(e) =>
                            handleChange("calculation", {
                              includeHolidays: e.target.checked,
                            })
                          }
                          id="includeHolidays"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="includeHolidays"
                        >
                          <i className="bi bi-calendar-event me-1"></i>
                          Include Holidays in Calculation
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={rules.calculation.includeNightShift}
                          onChange={(e) =>
                            handleChange("calculation", {
                              includeNightShift: e.target.checked,
                            })
                          }
                          id="includeNightShift"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="includeNightShift"
                        >
                          <i className="bi bi-moon me-1"></i>
                          Include Night Shift Hours
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ 3. Overtime caps */}
                <div className="col-12 col-md-6 col-lg-4 col-xl-6">
                  <div className="card border h-100">
                    <div className="card-header bg-light py-2 py-sm-3">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-speedometer text-warning me-2 fs-6 fs-sm-5"></i>
                        <h6 className="mb-0 fs-6 fs-sm-5">Overtime Caps</h6>
                      </div>
                    </div>
                    <div className="card-body p-2 p-sm-3">
                      {/* Caps Inputs - Responsive Grid */}
                      <div className="row g-2 g-sm-3">
                        {Object.entries(rules.caps).map(([key, value]) => (
                          <div
                            key={key}
                            className="col-12 col-sm-6 col-md-12 col-lg-6 col-xl-12"
                          >
                            <div className="mb-2 mb-sm-3">
                              <label className="form-label small fw-semibold mb-1 mb-sm-2">
                                <i
                                  className={`bi ${
                                    key === "daily"
                                      ? "bi-calendar-day"
                                      : key === "weekly"
                                      ? "bi-calendar-week"
                                      : key === "monthly"
                                      ? "bi-calendar-month"
                                      : key === "yearly"
                                      ? "bi-calendar"
                                      : "bi-calendar-range"
                                  } text-secondary me-1`}
                                ></i>
                                <span className="d-inline d-sm-none">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </span>
                                <span className="d-none d-sm-inline">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                                  Cap
                                </span>
                                {key === "consecutiveDays" ? "" : " (h)"}
                              </label>
                              <div className="input-group input-group-sm input-group-md">
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={value}
                                  onChange={(e) =>
                                    handleChange("caps", {
                                      [key]: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  min="1"
                                  max={
                                    key === "daily"
                                      ? 24
                                      : key === "weekly"
                                      ? 168
                                      : key === "monthly"
                                      ? 744
                                      : 365
                                  }
                                  style={{ minHeight: "38px" }}
                                />
                                <span
                                  className="input-group-text"
                                  style={{ minHeight: "38px" }}
                                >
                                  {key === "consecutiveDays" ? "days" : "h"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary Alert */}
                      <div className="alert alert-warning mt-3 p-2 p-sm-3">
                        <div className="d-flex align-items-start">
                          <i className="bi bi-exclamation-triangle me-2 flex-shrink-0"></i>
                          <div className="small">
                            <div className="fw-semibold mb-1">Caps Summary</div>
                            <div className="row g-2">
                              <div className="col-6">
                                <span className="text-muted">Annual:</span>
                                <span className="fw-bold ms-1">
                                  {rules.caps.yearly}h
                                </span>
                              </div>
                              <div className="col-6">
                                <span className="text-muted">Monthly Avg:</span>
                                <span className="fw-bold ms-1">
                                  {(rules.caps.yearly / 12).toFixed(1)}h
                                </span>
                              </div>
                              <div className="col-6">
                                <span className="text-muted">Weekly:</span>
                                <span className="fw-bold ms-1">
                                  {rules.caps.weekly}h
                                </span>
                              </div>
                              <div className="col-6">
                                <span className="text-muted">Daily:</span>
                                <span className="fw-bold ms-1">
                                  {rules.caps.daily}h
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Distribution Card */}
                      <div className="card bg-light border-0 mt-3">
                        <div className="card-body p-2 p-sm-3">
                          <div className="d-flex align-items-center mb-2 mb-sm-3">
                            <i className="bi bi-graph-up text-muted me-2"></i>
                            <h6 className="small text-muted mb-0">
                              Overtime Distribution
                            </h6>
                          </div>

                          {/* Progress Bar */}
                          <div
                            className="progress mb-2 mb-sm-3"
                            style={{ height: "8px" }}
                          >
                            <div
                              className="progress-bar bg-primary"
                              style={{ width: "20%" }}
                              title="Daily"
                            ></div>
                            <div
                              className="progress-bar bg-warning"
                              style={{ width: "30%" }}
                              title="Weekly"
                            ></div>
                            <div
                              className="progress-bar bg-info"
                              style={{ width: "40%" }}
                              title="Monthly"
                            ></div>
                            <div
                              className="progress-bar bg-success"
                              style={{ width: "10%" }}
                              title="Yearly"
                            ></div>
                          </div>

                          {/* Distribution Stats */}
                          <div className="row g-1 g-sm-2 text-center">
                            <div className="col-3">
                              <div className="small text-muted d-block d-sm-none">
                                D
                              </div>
                              <div className="small text-muted d-none d-sm-block">
                                Daily
                              </div>
                              <div className="fw-bold fs-6 fs-sm-5">
                                {rules.caps.daily}h
                              </div>
                            </div>
                            <div className="col-3">
                              <div className="small text-muted d-block d-sm-none">
                                W
                              </div>
                              <div className="small text-muted d-none d-sm-block">
                                Weekly
                              </div>
                              <div className="fw-bold fs-6 fs-sm-5">
                                {rules.caps.weekly}h
                              </div>
                            </div>
                            <div className="col-3">
                              <div className="small text-muted d-block d-sm-none">
                                M
                              </div>
                              <div className="small text-muted d-none d-sm-block">
                                Monthly
                              </div>
                              <div className="fw-bold fs-6 fs-sm-5">
                                {rules.caps.monthly}h
                              </div>
                            </div>
                            <div className="col-3">
                              <div className="small text-muted d-block d-sm-none">
                                Y
                              </div>
                              <div className="small text-muted d-none d-sm-block">
                                Yearly
                              </div>
                              <div className="fw-bold fs-6 fs-sm-5">
                                {rules.caps.yearly}h
                              </div>
                            </div>
                          </div>

                          {/* Legend - Desktop only */}
                          <div className="d-none d-sm-flex justify-content-center gap-3 mt-2">
                            <div className="d-flex align-items-center">
                              <span
                                className="d-inline-block bg-primary rounded-circle me-1"
                                style={{ width: "8px", height: "8px" }}
                              ></span>
                              <small className="text-muted">Daily</small>
                            </div>
                            <div className="d-flex align-items-center">
                              <span
                                className="d-inline-block bg-warning rounded-circle me-1"
                                style={{ width: "8px", height: "8px" }}
                              ></span>
                              <small className="text-muted">Weekly</small>
                            </div>
                            <div className="d-flex align-items-center">
                              <span
                                className="d-inline-block bg-info rounded-circle me-1"
                                style={{ width: "8px", height: "8px" }}
                              ></span>
                              <small className="text-muted">Monthly</small>
                            </div>
                            <div className="d-flex align-items-center">
                              <span
                                className="d-inline-block bg-success rounded-circle me-1"
                                style={{ width: "8px", height: "8px" }}
                              ></span>
                              <small className="text-muted">Yearly</small>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions - Mobile Only */}
                      <div className="d-flex d-sm-none gap-2 mt-3">
                        <button
                          className="btn btn-sm btn-outline-primary flex-fill"
                          onClick={() => {
                            const standardCaps = {
                              daily: 4,
                              weekly: 20,
                              monthly: 80,
                              yearly: 960,
                              consecutiveDays: 7,
                            };
                            handleChange("caps", standardCaps);
                          }}
                        >
                          <i className="bi bi-arrow-clockwise me-1"></i> Reset
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success flex-fill"
                          onClick={() => {
                            // Calculate suggested caps based on yearly
                            const yearly = rules.caps.yearly;
                            const suggestedCaps = {
                              daily: Math.min(4, Math.floor(yearly / 240)),
                              weekly: Math.min(20, Math.floor(yearly / 48)),
                              monthly: Math.floor(yearly / 12),
                              yearly: yearly,
                              consecutiveDays: 7,
                            };
                            handleChange("caps", suggestedCaps);
                          }}
                        >
                          <i className="bi bi-lightbulb me-1"></i> Suggest
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ 4. Overtime approval workflow */}
                <div className="col-lg-6">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-clipboard-check text-success me-2"></i>
                        <h6 className="mb-0">Approval Workflow</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      {/* Approval Level Selection */}
                      <div className="mb-4">
                        <label className="form-label">
                          <i className="bi bi-diagram-3 text-secondary me-1"></i>
                          Approval Levels
                        </label>

                        {/* Single Level Selection */}
                        <div className="mb-3">
                          <label className="form-label small">
                            Select Level
                          </label>
                          <div className="input-group">
                            <select
                              className="form-select"
                              value={
                                rules.approvalWorkflow.selectedLevel ||
                                "Manager"
                              }
                              onChange={(e) => {
                                handleChange("approvalWorkflow", {
                                  selectedLevel: e.target.value,
                                });
                              }}
                            >
                              <option value="Manager">
                                <i className="bi bi-person-badge me-1"></i>{" "}
                                Manager
                              </option>
                              <option value="HR">
                                <i className="bi bi-people me-1"></i> HR
                                Department
                              </option>
                              <option value="Director">
                                <i className="bi bi-person-badge-fill me-1"></i>{" "}
                                Director
                              </option>
                              <option value="Finance">
                                <i className="bi bi-cash-coin me-1"></i> Finance
                              </option>
                              <option value="CEO">
                                <i className="bi bi-trophy me-1"></i> CEO
                              </option>
                            </select>
                         
                          </div>
                          <div className="form-text">
                            <i className="bi bi-info-circle me-1"></i>
                            Select a level and click Add to include in workflow
                          </div>
                        </div>

                        {/* Selected Levels Display */}
                        {rules.approvalWorkflow.levels.length > 0 && (
                          <div className="mb-3">
                            <label className="form-label small">
                              Workflow Sequence
                            </label>
                            <div className="card border">
                              <div className="card-body p-3">
                                <div className="d-flex flex-wrap gap-2 align-items-center">
                                  {rules.approvalWorkflow.levels.map(
                                    (level, index) => (
                                      <div
                                        key={index}
                                        className="d-flex align-items-center bg-light p-2 rounded"
                                      >
                                        <span className="badge bg-primary me-2">
                                          Step {index + 1}
                                        </span>
                                        <span className="fw-medium">
                                          {level === "Manager" && (
                                            <i className="bi bi-person-badge me-1 text-primary"></i>
                                          )}
                                          {level === "HR" && (
                                            <i className="bi bi-people me-1 text-info"></i>
                                          )}
                                          {level === "Director" && (
                                            <i className="bi bi-person-badge-fill me-1 text-warning"></i>
                                          )}
                                          {level === "Finance" && (
                                            <i className="bi bi-cash-coin me-1 text-success"></i>
                                          )}
                                          {level === "CEO" && (
                                            <i className="bi bi-trophy me-1 text-danger"></i>
                                          )}
                                          {level}
                                        </span>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-link text-danger ms-2"
                                          onClick={() => {
                                            const newLevels =
                                              rules.approvalWorkflow.levels.filter(
                                                (_, i) => i !== index
                                              );
                                            handleChange("approvalWorkflow", {
                                              levels: newLevels,
                                            });
                                          }}
                                          title="Remove from workflow"
                                        >
                                          <i className="bi bi-x"></i>
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                                {rules.approvalWorkflow.levels.length > 1 && (
                                  <div className="text-center mt-2">
                                    <small className="text-muted">
                                      <i className="bi bi-arrow-down me-1"></i>
                                      Requests flow in this sequence
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Workflow Actions */}
                        <div className="d-flex gap-2 mb-3">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              const allLevels = [
                                "Manager",
                                "HR",
                                "Director",
                                "Finance",
                                "CEO",
                              ];
                              handleChange("approvalWorkflow", {
                                levels: allLevels,
                              });
                            }}
                            disabled={
                              rules.approvalWorkflow.levels.length === 5
                            }
                          >
                            <i className="bi bi-check-all me-1"></i> Select All
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleChange("approvalWorkflow", { levels: [] })
                            }
                            disabled={
                              rules.approvalWorkflow.levels.length === 0
                            }
                          >
                            <i className="bi bi-x-circle me-1"></i> Clear All
                          </button>
                        </div>
                      </div>

                      {/* Approval Settings */}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              <i className="bi bi-clock text-secondary me-1"></i>
                              Auto-Approve After
                            </label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                value={rules.approvalWorkflow.autoApproveAfter}
                                onChange={(e) =>
                                  handleChange("approvalWorkflow", {
                                    autoApproveAfter: parseInt(e.target.value),
                                  })
                                }
                                min="0"
                                max="168"
                              />
                              <span className="input-group-text">hours</span>
                            </div>
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>0 = No
                              auto-approval
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              <i className="bi bi-calendar-x text-secondary me-1"></i>
                              Max Approval Days
                            </label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                value={rules.approvalWorkflow.maxApprovalDays}
                                onChange={(e) =>
                                  handleChange("approvalWorkflow", {
                                    maxApprovalDays: parseInt(e.target.value),
                                  })
                                }
                                min="1"
                                max="30"
                              />
                              <span className="input-group-text">days</span>
                            </div>
                            <div className="form-text">
                              <i className="bi bi-clock-history me-1"></i>
                              Maximum days to approve/reject
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              <i className="bi bi-alarm text-secondary me-1"></i>
                              Escalation Time
                            </label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                value={rules.approvalWorkflow.escalationHours}
                                onChange={(e) =>
                                  handleChange("approvalWorkflow", {
                                    escalationHours: parseInt(e.target.value),
                                  })
                                }
                                min="1"
                                max="168"
                              />
                              <span className="input-group-text">hours</span>
                            </div>
                            <div className="form-text">
                              <i className="bi bi-arrow-up-right me-1"></i>
                              Escalate to next level after this time
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              <i className="bi bi-shield-check text-secondary me-1"></i>
                              Workflow Type
                            </label>
                            <select
                              className="form-select"
                              value={
                                rules.approvalWorkflow.multipleApprovers
                                  ? "parallel"
                                  : "sequential"
                              }
                              onChange={(e) =>
                                handleChange("approvalWorkflow", {
                                  multipleApprovers:
                                    e.target.value === "parallel",
                                })
                              }
                            >
                              <option value="sequential">
                                <i className="bi bi-arrow-right me-1"></i>{" "}
                                Sequential (One after another)
                              </option>
                              <option value="parallel">
                                <i className="bi bi-arrows-angle-expand me-1"></i>{" "}
                                Parallel (All at once)
                              </option>
                            </select>
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>
                              {rules.approvalWorkflow.multipleApprovers
                                ? "All approvers review simultaneously"
                                : "Approvers review in sequence"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Settings */}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-check form-switch mb-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={
                                rules.approvalWorkflow.requireDocumentation
                              }
                              onChange={(e) =>
                                handleChange("approvalWorkflow", {
                                  requireDocumentation: e.target.checked,
                                })
                              }
                              id="requireDocumentation"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="requireDocumentation"
                            >
                              <i className="bi bi-file-text me-1"></i>
                              Require Documentation
                            </label>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-check form-switch mb-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rules.approvalWorkflow.notifyIfPending}
                              onChange={(e) =>
                                handleChange("approvalWorkflow", {
                                  notifyIfPending: e.target.checked,
                                })
                              }
                              id="notifyIfPending"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="notifyIfPending"
                            >
                              <i className="bi bi-bell me-1"></i>
                              Notify if Pending
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Workflow Summary */}
                      {rules.approvalWorkflow.levels.length > 0 && (
                        <div className="card bg-light border-0 mt-4">
                          <div className="card-body p-3">
                            <h6 className="card-title small mb-3">
                              <i className="bi bi-info-circle text-primary me-2"></i>
                              Workflow Summary
                            </h6>
                            <div className="row">
                              <div className="col-6">
                                <div className="small text-muted">
                                  <i className="bi bi-diagram-3 me-1"></i>Levels
                                </div>
                                <div className="fw-bold">
                                  {rules.approvalWorkflow.levels.length}
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="small text-muted">
                                  <i className="bi bi-clock me-1"></i>
                                  Auto-approve
                                </div>
                                <div className="fw-bold">
                                  {rules.approvalWorkflow.autoApproveAfter > 0
                                    ? `${rules.approvalWorkflow.autoApproveAfter}h`
                                    : "No"}
                                </div>
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-6">
                                <div className="small text-muted">
                                  <i className="bi bi-arrows-angle-expand me-1"></i>
                                  Type
                                </div>
                                <div className="fw-bold small">
                                  {rules.approvalWorkflow.multipleApprovers
                                    ? "Parallel"
                                    : "Sequential"}
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="small text-muted">
                                  <i className="bi bi-calendar-x me-1"></i>Max
                                  Days
                                </div>
                                <div className="fw-bold">
                                  {rules.approvalWorkflow.maxApprovalDays}d
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="small text-muted">
                                <i className="bi bi-list-ol me-1"></i>Sequence
                              </div>
                              <div className="fw-bold small">
                                {rules.approvalWorkflow.levels.join(" → ")}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ 5. Overtime compensation */}
                <div className="col-lg-6">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-cash text-success me-2"></i>
                        <h6 className="mb-0">Compensation Settings</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              <i className="bi bi-currency-dollar text-secondary me-1"></i>
                              Compensation Type
                            </label>
                            <select
                              className="form-select"
                              value={rules.compensation.type}
                              onChange={(e) =>
                                handleChange("compensation", {
                                  type: e.target.value,
                                })
                              }
                            >
                              <option value="pay">
                                <i className="bi bi-cash me-1"></i> Extra Pay
                              </option>
                              <option value="compOff">
                                <i className="bi bi-calendar-plus me-1"></i>{" "}
                                Compensatory Off
                              </option>
                              <option value="both">
                                <i className="bi bi-arrow-left-right me-1"></i>{" "}
                                Both (Employee Choice)
                              </option>
                              <option value="bonus">
                                <i className="bi bi-gift me-1"></i> Bonus Points
                              </option>
                            </select>
                          </div>

                          {rules.compensation.type !== "pay" && (
                            <div className="mb-3">
                              <label className="form-label">
                                <i className="bi bi-calendar-check text-secondary me-1"></i>
                                Comp-Off Validity (days)
                              </label>
                              <div className="input-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={rules.compensation.compOffValidity}
                                  onChange={(e) =>
                                    handleChange("compensation", {
                                      compOffValidity: parseInt(e.target.value),
                                    })
                                  }
                                  min="1"
                                  max="365"
                                />
                                <span className="input-group-text">
                                  <i className="bi bi-calendar"></i>
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="mb-3">
                            <label className="form-label">
                              <i className="bi bi-arrow-repeat text-secondary me-1"></i>
                              Payment Cycle
                            </label>
                            <select
                              className="form-select"
                              value={rules.compensation.paymentCycle}
                              onChange={(e) =>
                                handleChange("compensation", {
                                  paymentCycle: e.target.value,
                                })
                              }
                            >
                              <option value="weekly">
                                <i className="bi bi-calendar-week me-1"></i>{" "}
                                Weekly
                              </option>
                              <option value="biweekly">
                                <i className="bi bi-calendar-range me-1"></i>{" "}
                                Bi-weekly
                              </option>
                              <option value="monthly">
                                <i className="bi bi-calendar-month me-1"></i>{" "}
                                Monthly
                              </option>
                              <option value="quarterly">
                                <i className="bi bi-calendar3 me-1"></i>{" "}
                                Quarterly
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              <i className="bi bi-arrow-left-right text-secondary me-1"></i>
                              Conversion Rate
                            </label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                value={rules.compensation.conversionRate}
                                onChange={(e) =>
                                  handleChange("compensation", {
                                    conversionRate: parseFloat(e.target.value),
                                  })
                                }
                                min="0.5"
                                max="2"
                                step="0.1"
                              />
                              <span className="input-group-text">
                                <i className="bi bi-x"></i>
                              </span>
                            </div>
                            <div className="form-text">
                              <i className="bi bi-calculator me-1"></i>1
                              overtime hour = ? comp-off hours
                            </div>
                          </div>

                          <div className="form-check mb-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rules.compensation.autoConvertToCompOff}
                              onChange={(e) =>
                                handleChange("compensation", {
                                  autoConvertToCompOff: e.target.checked,
                                })
                              }
                              disabled={rules.compensation.type === "pay"}
                              id="autoConvertToCompOff"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="autoConvertToCompOff"
                            >
                              <i className="bi bi-robot me-1"></i>
                              Auto-Convert to Comp-Off
                            </label>
                            <div className="form-text">
                              <i className="bi bi-clock me-1"></i>
                              Automatically convert unpaid overtime after 30
                              days
                            </div>
                          </div>

                          <div className="row g-2">
                            <div className="col-6">
                              <label className="form-label small">
                                <i className="bi bi-hourglass-split me-1"></i>
                                Min Hours for Pay
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={rules.compensation.minHoursForPay}
                                onChange={(e) =>
                                  handleChange("compensation", {
                                    minHoursForPay: parseFloat(e.target.value),
                                  })
                                }
                                min="0"
                                step="0.5"
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label small">
                                <i className="bi bi-hourglass me-1"></i>
                                Min Hours for Comp-Off
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={rules.compensation.minHoursForCompOff}
                                onChange={(e) =>
                                  handleChange("compensation", {
                                    minHoursForCompOff: parseFloat(
                                      e.target.value
                                    ),
                                  })
                                }
                                min="0"
                                step="0.5"
                              />
                            </div>
                          </div>

                          <div className="form-check mt-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rules.compensation.taxDeductible}
                              onChange={(e) =>
                                handleChange("compensation", {
                                  taxDeductible: e.target.checked,
                                })
                              }
                              id="taxDeductible"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="taxDeductible"
                            >
                              <i className="bi bi-receipt me-1"></i>
                              Tax Deductible
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-top">
                        <h6 className="small text-muted mb-2">
                          <i className="bi bi-info-circle me-2"></i>
                          Compensation Summary
                        </h6>
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="small text-muted">
                              <i className="bi bi-cash me-1"></i>Type
                            </div>
                            <div className="fw-bold text-capitalize">
                              {rules.compensation.type}
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="small text-muted">
                              <i className="bi bi-calendar me-1"></i>Cycle
                            </div>
                            <div className="fw-bold text-capitalize">
                              {rules.compensation.paymentCycle}
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="small text-muted">
                              <i className="bi bi-arrow-left-right me-1"></i>
                              Conversion
                            </div>
                            <div className="fw-bold">
                              {rules.compensation.conversionRate}x
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ 6. Overtime reports and analytics */}
                <div className="col-lg-6">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-bar-chart text-info me-2"></i>
                        <h6 className="mb-0">Reports & Analytics</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      {/* Auto-Generation Settings */}
                      <div className="mb-4">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={rules.reports.autoGenerate}
                            onChange={(e) =>
                              handleChange("reports", {
                                autoGenerate: e.target.checked,
                              })
                            }
                            id="autoGenerate"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="autoGenerate"
                          >
                            <i className="bi bi-robot me-1"></i>
                            Auto-Generate Reports
                          </label>
                        </div>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                <i className="bi bi-calendar-event text-secondary me-1"></i>
                                Report Frequency
                              </label>
                              <select
                                className="form-select"
                                value={rules.reports.frequency}
                                onChange={(e) =>
                                  handleChange("reports", {
                                    frequency: e.target.value,
                                  })
                                }
                              >
                                <option value="daily">
                                  <i className="bi bi-calendar-day me-1"></i>{" "}
                                  Daily
                                </option>
                                <option value="weekly">
                                  <i className="bi bi-calendar-week me-1"></i>{" "}
                                  Weekly
                                </option>
                                <option value="monthly">
                                  <i className="bi bi-calendar-month me-1"></i>{" "}
                                  Monthly
                                </option>
                                <option value="quarterly">
                                  <i className="bi bi-calendar3 me-1"></i>{" "}
                                  Quarterly
                                </option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">
                                <i className="bi bi-clock-history text-secondary me-1"></i>
                                Retention Period
                              </label>
                              <div className="input-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={rules.reports.retentionPeriod}
                                  onChange={(e) =>
                                    handleChange("reports", {
                                      retentionPeriod: parseInt(e.target.value),
                                    })
                                  }
                                  min="1"
                                  max="60"
                                />
                                <span className="input-group-text">months</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Report Types Selection */}
                      <div className="mb-4">
                        <label className="form-label">
                          <i className="bi bi-file-earmark-text text-secondary me-1"></i>
                          Report Types
                        </label>

                        {/* Report Type Selector */}
                        <div className="mb-3">
                          <label className="form-label small">
                            Select Report Type
                          </label>
                          <div className="input-group">
                            <select
                              className="form-select"
                              value={rules.reports.selectedType || "summary"}
                              onChange={(e) => {
                                handleChange("reports", {
                                  selectedType: e.target.value,
                                });
                              }}
                            >
                              <option value="summary">
                                <i className="bi bi-file-text me-1"></i> Summary
                                Report
                              </option>
                              <option value="detailed">
                                <i className="bi bi-file-earmark-text me-1"></i>{" "}
                                Detailed Report
                              </option>
                              <option value="compliance">
                                <i className="bi bi-shield-check me-1"></i>{" "}
                                Compliance Report
                              </option>
                              <option value="analytics">
                                <i className="bi bi-graph-up me-1"></i>{" "}
                                Analytics Report
                              </option>
                              <option value="cost">
                                <i className="bi bi-cash-coin me-1"></i> Cost
                                Analysis
                              </option>
                              <option value="trend">
                                <i className="bi bi-lightning-charge me-1"></i>{" "}
                                Trend Analysis
                              </option>
                            </select>
                        s
                          </div>
                          <div className="form-text">
                            <i className="bi bi-info-circle me-1"></i>
                            Select a report type and click Add to include
                          </div>
                        </div>

                        {/* Selected Report Types Display */}
                        {rules.reports.reportTypes.length > 0 && (
                          <div className="mb-3">
                            <label className="form-label small">
                              Enabled Reports
                            </label>
                            <div className="card border">
                              <div className="card-body p-3">
                                <div className="d-flex flex-wrap gap-2">
                                  {rules.reports.reportTypes.map(
                                    (type, index) => (
                                      <div
                                        key={index}
                                        className="d-flex align-items-center bg-light p-2 rounded"
                                      >
                                        <span className="fw-medium">
                                          {type === "summary" && (
                                            <i className="bi bi-file-text me-1 text-primary"></i>
                                          )}
                                          {type === "detailed" && (
                                            <i className="bi bi-file-earmark-text me-1 text-info"></i>
                                          )}
                                          {type === "compliance" && (
                                            <i className="bi bi-shield-check me-1 text-success"></i>
                                          )}
                                          {type === "analytics" && (
                                            <i className="bi bi-graph-up me-1 text-warning"></i>
                                          )}
                                          {type === "cost" && (
                                            <i className="bi bi-cash-coin me-1 text-danger"></i>
                                          )}
                                          {type === "trend" && (
                                            <i className="bi bi-lightning-charge me-1 text-purple"></i>
                                          )}
                                          {type.charAt(0).toUpperCase() +
                                            type.slice(1)}
                                        </span>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-link text-danger ms-2"
                                          onClick={() => {
                                            const newTypes =
                                              rules.reports.reportTypes.filter(
                                                (_, i) => i !== index
                                              );
                                            handleChange("reports", {
                                              reportTypes: newTypes,
                                            });
                                          }}
                                          title="Remove report type"
                                        >
                                          <i className="bi bi-x"></i>
                                        </button>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Report Type Actions */}
                        <div className="d-flex gap-2 mb-3">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              const allTypes = [
                                "summary",
                                "detailed",
                                "compliance",
                                "analytics",
                                "cost",
                                "trend",
                              ];
                              handleChange("reports", {
                                reportTypes: allTypes,
                              });
                            }}
                            disabled={rules.reports.reportTypes.length === 6}
                          >
                            <i className="bi bi-check-all me-1"></i> Select All
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleChange("reports", { reportTypes: [] })
                            }
                            disabled={rules.reports.reportTypes.length === 0}
                          >
                            <i className="bi bi-x-circle me-1"></i> Clear All
                          </button>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rules.reports.notifyManagers}
                              onChange={(e) =>
                                handleChange("reports", {
                                  notifyManagers: e.target.checked,
                                })
                              }
                              id="notifyManagers"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="notifyManagers"
                            >
                              <i className="bi bi-bell me-1"></i>
                              Notify Managers
                            </label>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rules.reports.includeAnalytics}
                              onChange={(e) =>
                                handleChange("reports", {
                                  includeAnalytics: e.target.checked,
                                })
                              }
                              id="includeAnalytics"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="includeAnalytics"
                            >
                              <i className="bi bi-graph-up me-1"></i>
                              Include Analytics
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Analytics Settings */}
                      <div className="card bg-light border-0">
                        <div className="card-body p-3">
                          <h6 className="small text-muted mb-3">
                            <i className="bi bi-graph-up me-1"></i>
                            Analytics Settings
                          </h6>

                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={rules.analytics.trackTrends}
                                  onChange={(e) =>
                                    handleChange("analytics", {
                                      trackTrends: e.target.checked,
                                    })
                                  }
                                  id="trackTrends"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="trackTrends"
                                >
                                  <i className="bi bi-bar-chart me-1"></i>
                                  Track Trends
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={rules.analytics.predictiveAnalysis}
                                  onChange={(e) =>
                                    handleChange("analytics", {
                                      predictiveAnalysis: e.target.checked,
                                    })
                                  }
                                  id="predictiveAnalysis"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="predictiveAnalysis"
                                >
                                  <i className="bi bi-lightning-charge me-1"></i>
                                  Predictive Analysis
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Analytics Threshold */}
                          <div className="mt-3">
                            <label className="form-label small">
                              <i className="bi bi-speedometer text-secondary me-1"></i>
                              Alert Threshold
                            </label>
                            <div className="input-group input-group-sm">
                              <input
                                type="number"
                                className="form-control"
                                value={rules.analytics.alertThreshold}
                                onChange={(e) =>
                                  handleChange("analytics", {
                                    alertThreshold: parseInt(e.target.value),
                                  })
                                }
                                min="0"
                                max="100"
                              />
                              <span className="input-group-text">%</span>
                            </div>
                            <div className="form-text">
                              <i className="bi bi-info-circle me-1"></i>
                              Send alerts when overtime exceeds this percentage
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reports Summary */}
                      {rules.reports.reportTypes.length > 0 && (
                        <div className="card border-0 bg-primary bg-opacity-10 mt-4">
                          <div className="card-body p-3">
                            <h6 className="card-title small mb-3">
                              <i className="bi bi-info-circle text-primary me-2"></i>
                              Reports Configuration
                            </h6>
                            <div className="row">
                              <div className="col-6">
                                <div className="small text-muted">
                                  <i className="bi bi-calendar-event me-1"></i>
                                  Frequency
                                </div>
                                <div className="fw-bold text-capitalize">
                                  {rules.reports.frequency}
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="small text-muted">
                                  <i className="bi bi-clock-history me-1"></i>
                                  Retention
                                </div>
                                <div className="fw-bold">
                                  {rules.reports.retentionPeriod} months
                                </div>
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-6">
                                <div className="small text-muted">
                                  <i className="bi bi-file-earmark-text me-1"></i>
                                  Report Types
                                </div>
                                <div className="fw-bold">
                                  {rules.reports.reportTypes.length}
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="small text-muted">
                                  <i className="bi bi-bell me-1"></i>
                                  Notifications
                                </div>
                                <div className="fw-bold">
                                  {rules.reports.notifyManagers
                                    ? "Enabled"
                                    : "Disabled"}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="small text-muted">
                                <i className="bi bi-robot me-1"></i>
                                Auto-Generation
                              </div>
                              <div className="fw-bold small">
                                {rules.reports.autoGenerate
                                  ? "Active"
                                  : "Manual"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ✅ Overtime Categories */}
                <div className="col-lg-12">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-list-check text-primary me-2"></i>
                          <h6 className="mb-0">Overtime Categories</h6>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={addOvertimeCategory}
                            title="Add New Category"
                          >
                            <i className="bi bi-plus-circle me-1"></i> Add
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => setShowCategoryModal(true)}
                            title="Manage Category Descriptions"
                          >
                            <i className="bi bi-card-text me-1"></i>{" "}
                            Descriptions
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover table-sm mb-0">
                          <thead>
                            <tr>
                              <th className="ps-3">Category</th>
                              <th>Rate</th>
                              <th>Daily</th>
                              <th>Weekly</th>
                              <th>Monthly</th>
                              <th className="text-center">Approval</th>
                              <th>Compensation</th>
                              <th className="pe-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rules.categories.map((category) => (
                              <tr key={category.id}>
                                <td className="ps-3">
                                  <div className="d-flex flex-column">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm border-0 bg-transparent px-0 mb-1"
                                      value={category.name}
                                      onChange={(e) =>
                                        handleCategoryChange(category.id, {
                                          name: e.target.value,
                                        })
                                      }
                                      placeholder="Category name"
                                      style={{ minWidth: "120px" }}
                                    />
                                    {category.description && (
                                      <small
                                        className="text-muted"
                                        title={category.description}
                                      >
                                        <i className="bi bi-info-circle me-1"></i>
                                        {category.description.length > 25
                                          ? `${category.description.substring(
                                              0,
                                              25
                                            )}...`
                                          : category.description}
                                      </small>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    style={{ width: "65px" }}
                                    value={category.rate}
                                    onChange={(e) =>
                                      handleCategoryChange(category.id, {
                                        rate: parseFloat(e.target.value),
                                      })
                                    }
                                    min="1"
                                    step="0.25"
                                    title="Overtime rate multiplier"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    style={{ width: "55px" }}
                                    value={category.caps.daily}
                                    onChange={(e) =>
                                      handleCategoryChange(category.id, {
                                        caps: {
                                          ...category.caps,
                                          daily: parseInt(e.target.value),
                                        },
                                      })
                                    }
                                    min="1"
                                    max="24"
                                    title="Daily cap in hours"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    style={{ width: "55px" }}
                                    value={category.caps.weekly}
                                    onChange={(e) =>
                                      handleCategoryChange(category.id, {
                                        caps: {
                                          ...category.caps,
                                          weekly: parseInt(e.target.value),
                                        },
                                      })
                                    }
                                    min="1"
                                    max="168"
                                    title="Weekly cap in hours"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    style={{ width: "55px" }}
                                    value={category.caps.monthly}
                                    onChange={(e) =>
                                      handleCategoryChange(category.id, {
                                        caps: {
                                          ...category.caps,
                                          monthly: parseInt(e.target.value),
                                        },
                                      })
                                    }
                                    min="1"
                                    max="744"
                                    title="Monthly cap in hours"
                                  />
                                </td>
                                <td className="text-center">
                                  <div className="form-check form-switch d-inline-block">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={category.requiresApproval}
                                      onChange={(e) =>
                                        handleCategoryChange(category.id, {
                                          requiresApproval: e.target.checked,
                                        })
                                      }
                                      title="Requires approval"
                                    />
                                  </div>
                                </td>
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    style={{ width: "85px" }}
                                    value={category.compensationType}
                                    onChange={(e) =>
                                      handleCategoryChange(category.id, {
                                        compensationType: e.target.value,
                                      })
                                    }
                                    title="Compensation type"
                                  >
                                    <option value="pay">Pay</option>
                                    <option value="compOff">Comp-Off</option>
                                    <option value="both">Both</option>
                                    <option value="bonus">Bonus</option>
                                  </select>
                                </td>
                                <td className="pe-3">
                                  <div className="btn-group btn-group-sm">
                                    <button
                                      className="btn btn-outline-info border-0"
                                      onClick={() =>
                                        setEditingCategoryId(category.id)
                                      }
                                      title="Edit Description"
                                    >
                                      <i className="bi bi-card-text"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-secondary border-0"
                                      onClick={() =>
                                        duplicateCategory(category.id)
                                      }
                                      title="Duplicate Category"
                                    >
                                      <i className="bi bi-copy"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-danger border-0"
                                      onClick={() =>
                                        deleteOvertimeCategory(category.id)
                                      }
                                      title="Delete Category"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {rules.categories.length === 0 && (
                        <div className="text-center py-5">
                          <i className="bi bi-folder-plus display-6 text-muted mb-3"></i>
                          <p className="text-muted mb-2">
                            No overtime categories added yet.
                          </p>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={addOvertimeCategory}
                          >
                            <i className="bi bi-plus-circle me-1"></i>
                            Add Your First Category
                          </button>
                        </div>
                      )}

                      {/* Category Statistics */}
                      {rules.categories.length > 0 && (
                        <div className="border-top mt-0">
                          <div className="row g-0">
                            <div className="col-6 col-md-3 border-end">
                              <div className="p-3 text-center">
                                <div className="small text-muted mb-1">
                                  Avg Rate
                                </div>
                                <div className="fw-bold text-primary fs-6">
                                  {(
                                    rules.categories.reduce(
                                      (sum, cat) => sum + cat.rate,
                                      0
                                    ) / rules.categories.length
                                  ).toFixed(2)}
                                </div>
                              </div>
                            </div>
                            <div className="col-6 col-md-3 border-end">
                              <div className="p-3 text-center">
                                <div className="small text-muted mb-1">
                                  Total Categories
                                </div>
                                <div className="fw-bold text-info fs-6">
                                  {rules.categories.length}
                                </div>
                              </div>
                            </div>
                            <div className="col-6 col-md-3 border-end">
                              <div className="p-3 text-center">
                                <div className="small text-muted mb-1">
                                  Approval Required
                                </div>
                                <div className="fw-bold text-warning fs-6">
                                  {
                                    rules.categories.filter(
                                      (cat) => cat.requiresApproval
                                    ).length
                                  }
                                </div>
                              </div>
                            </div>
                            <div className="col-6 col-md-3">
                              <div className="p-3 text-center">
                                <div className="small text-muted mb-1">
                                  Compensation Types
                                </div>
                                <div className="fw-bold text-success fs-6">
                                  {
                                    [
                                      ...new Set(
                                        rules.categories.map(
                                          (cat) => cat.compensationType
                                        )
                                      ),
                                    ].length
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category Description Modal */}
                  {showCategoryModal && (
                    <div
                      className="modal fade show"
                      style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header bg-light">
                            <h5 className="modal-title">
                              <i className="bi bi-card-text text-primary me-2"></i>
                              Manage Category Descriptions
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => setShowCategoryModal(false)}
                            ></button>
                          </div>
                          <div className="modal-body p-0">
                            <div className="list-group list-group-flush">
                              {rules.categories.map((category) => (
                                <div
                                  key={category.id}
                                  className="list-group-item"
                                >
                                  <div className="row align-items-center">
                                    <div className="col-md-3">
                                      <div className="fw-bold">
                                        {category.name}
                                      </div>
                                      <div className="small text-muted">
                                        Rate: {category.rate} • Daily:{" "}
                                        {category.caps.daily}h
                                      </div>
                                    </div>
                                    <div className="col-md-7">
                                      <textarea
                                        className="form-control"
                                        rows="2"
                                        value={category.description || ""}
                                        onChange={(e) =>
                                          handleCategoryChange(category.id, {
                                            description: e.target.value,
                                          })
                                        }
                                        placeholder="Enter category description..."
                                      />
                                    </div>
                                    <div className="col-md-2 text-center">
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                          handleCategoryChange(category.id, {
                                            description: "",
                                          })
                                        }
                                        disabled={!category.description}
                                        title="Clear Description"
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowCategoryModal(false)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inline Description Editor Modal */}
                  {editingCategoryId && (
                    <div
                      className="modal fade show"
                      style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header bg-light">
                            <h5 className="modal-title">
                              <i className="bi bi-pencil text-primary me-2"></i>
                              Edit Category
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => setEditingCategoryId(null)}
                            ></button>
                          </div>
                          <div className="modal-body">
                            {(() => {
                              const category = rules.categories.find(
                                (c) => c.id === editingCategoryId
                              );
                              return category ? (
                                <div>
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Category Name
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={category.name}
                                      onChange={(e) =>
                                        handleCategoryChange(category.id, {
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Description
                                    </label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      value={category.description || ""}
                                      onChange={(e) =>
                                        handleCategoryChange(category.id, {
                                          description: e.target.value,
                                        })
                                      }
                                      placeholder="Describe this overtime category..."
                                    />
                                  </div>
                                  <div className="row g-3">
                                    <div className="col-6">
                                      <label className="form-label">Rate</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={category.rate}
                                        onChange={(e) =>
                                          handleCategoryChange(category.id, {
                                            rate: parseFloat(e.target.value),
                                          })
                                        }
                                        min="1"
                                        step="0.25"
                                      />
                                    </div>
                                    <div className="col-6">
                                      <label className="form-label">
                                        Daily Cap
                                      </label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={category.caps.daily}
                                        onChange={(e) =>
                                          handleCategoryChange(category.id, {
                                            caps: {
                                              ...category.caps,
                                              daily: parseInt(e.target.value),
                                            },
                                          })
                                        }
                                        min="1"
                                        max="24"
                                      />
                                    </div>
                                    <div className="col-6">
                                      <label className="form-label">
                                        Weekly Cap
                                      </label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={category.caps.weekly}
                                        onChange={(e) =>
                                          handleCategoryChange(category.id, {
                                            caps: {
                                              ...category.caps,
                                              weekly: parseInt(e.target.value),
                                            },
                                          })
                                        }
                                        min="1"
                                        max="168"
                                      />
                                    </div>
                                    <div className="col-6">
                                      <label className="form-label">
                                        Monthly Cap
                                      </label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={category.caps.monthly}
                                        onChange={(e) =>
                                          handleCategoryChange(category.id, {
                                            caps: {
                                              ...category.caps,
                                              monthly: parseInt(e.target.value),
                                            },
                                          })
                                        }
                                        min="1"
                                        max="744"
                                      />
                                    </div>
                                    <div className="col-6">
                                      <div className="form-check mt-3">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={category.requiresApproval}
                                          onChange={(e) =>
                                            handleCategoryChange(category.id, {
                                              requiresApproval:
                                                e.target.checked,
                                            })
                                          }
                                          id={`approval-${category.id}`}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`approval-${category.id}`}
                                        >
                                          Requires Approval
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <label className="form-label">
                                        Compensation
                                      </label>
                                      <select
                                        className="form-select"
                                        value={category.compensationType}
                                        onChange={(e) =>
                                          handleCategoryChange(category.id, {
                                            compensationType: e.target.value,
                                          })
                                        }
                                      >
                                        <option value="pay">Pay</option>
                                        <option value="compOff">
                                          Compensatory Off
                                        </option>
                                        <option value="both">Both</option>
                                        <option value="bonus">
                                          Bonus Points
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setEditingCategoryId(null)}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => setEditingCategoryId(null)}
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================
// BREAK MANAGEMENT COMPONENT
// ==============================
const BreakManagement = () => {
  // Load rules from localStorage or use defaults
  const [rules, setRules] = useState(() => {
    const savedRules = localStorage.getItem("breakManagementRules");
    if (savedRules) {
      return JSON.parse(savedRules);
    }
    // Default rules structure
    return {
      breaks: [
        {
          id: 1,
          name: "Morning Tea",
          type: "paid",
          duration: 15,
          autoDeduct: false,
          mandatory: false,
          windowStart: "10:30",
          windowEnd: "11:00",
          flexibleWindow: 15,
          maxDelay: 10,
          minGapAfter: 120,
          punchRequired: true,
          autoPunchOut: true,
          gracePeriod: 5,
          maxExtension: 10,
          description: "Short morning break",
        },
        {
          id: 2,
          name: "Lunch Break",
          type: "unpaid",
          duration: 60,
          autoDeduct: true,
          mandatory: true,
          windowStart: "13:00",
          windowEnd: "14:00",
          flexibleWindow: 30,
          maxDelay: 15,
          minGapAfter: 240,
          punchRequired: true,
          autoPunchOut: true,
          gracePeriod: 10,
          maxExtension: 30,
          description: "Main meal break",
        },
        {
          id: 3,
          name: "Evening Break",
          type: "paid",
          duration: 10,
          autoDeduct: false,
          mandatory: false,
          windowStart: "16:00",
          windowEnd: "16:30",
          flexibleWindow: 10,
          maxDelay: 5,
          minGapAfter: 90,
          punchRequired: false,
          autoPunchOut: true,
          gracePeriod: 5,
          maxExtension: 5,
          description: "Quick afternoon break",
        },
      ],
      enforcement: {
        trackBreakPunches: true,
        autoLogBreaks: true,
        breakReminders: true,
        enforceSequence: true,
        reminderBefore: 15,
        maxBreaksPerDay: 4,
        punchGracePeriod: 5,
        strictMode: false,
        deductFromWorkHours: true,
        allowMultipleBreaks: true,
        requirePunchForPaidBreaks: true,
        requirePunchForUnpaidBreaks: false,
        autoEndBreaks: true,
        breakOvertimeAlert: true,
      },
      policies: {
        mealBreakRequired: true,
        mealBreakAfterHours: 5,
        autoDeductDuration: 60,
        maxAutoExtension: 15,
        minBreakBetweenShifts: 11,
        breakCarryForward: false,
        breakAccrual: false,
        breakExpiryDays: 30,
        holidayBreakRules: "sameAsWorkingDay",
        weekendBreakRules: "sameAsWorkingDay",
      },
    };
  });

  const [viewingBreakId, setViewingBreakId] = useState(null);
  const [selectedBreak, setSelectedBreak] = useState(null);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [editingBreakId, setEditingBreakId] = useState(null);
  const [breakLogs, setBreakLogs] = useState([]);

  // Save to localStorage whenever rules change
  useEffect(() => {
    localStorage.setItem("breakManagementRules", JSON.stringify(rules));
  }, [rules]);

  // Initialize break logs
  useEffect(() => {
    const mockLogs = [
      {
        id: 1,
        breakId: 1,
        employeeName: "John Doe",
        startTime: "2024-03-15T10:30:00",
        endTime: "2024-03-15T10:45:00",
        duration: 15,
        status: "completed",
        type: "manual",
        notes: "Morning tea break",
      },
      {
        id: 2,
        breakId: 2,
        employeeName: "Jane Smith",
        startTime: "2024-03-15T13:00:00",
        endTime: "2024-03-15T14:00:00",
        duration: 60,
        status: "completed",
        type: "auto",
        notes: "Lunch break",
      },
      {
        id: 3,
        breakId: 3,
        employeeName: "John Doe",
        startTime: "2024-03-15T16:15:00",
        endTime: "2024-03-15T16:25:00",
        duration: 10,
        status: "completed",
        type: "manual",
        notes: "Evening break",
      },
    ];
    setBreakLogs(mockLogs);
  }, []);

  const handleBreakChange = (id, data) => {
    setRules((prev) => ({
      ...prev,
      breaks: prev.breaks.map((breakItem) =>
        breakItem.id === id ? { ...breakItem, ...data } : breakItem
      ),
    }));
  };

  const handleEnforcementChange = (data) => {
    setRules((prev) => ({
      ...prev,
      enforcement: { ...prev.enforcement, ...data },
    }));
  };

  const handlePoliciesChange = (data) => {
    setRules((prev) => ({
      ...prev,
      policies: { ...prev.policies, ...data },
    }));
  };

  const handleAddBreak = () => {
    const newBreak = {
      id: Date.now(),
      name: "New Break",
      type: "unpaid",
      duration: 15,
      autoDeduct: false,
      mandatory: false,
      windowStart: "12:00",
      windowEnd: "13:00",
      flexibleWindow: 15,
      maxDelay: 10,
      minGapAfter: 60,
      punchRequired: true,
      autoPunchOut: true,
      gracePeriod: 5,
      maxExtension: 10,
      description: "",
    };

    setRules((prev) => ({
      ...prev,
      breaks: [...prev.breaks, newBreak],
    }));
  };

  const handleEditBreak = (breakItem) => {
    setSelectedBreak(breakItem);
    setShowBreakModal(true);
  };

  const handleEditDescription = (breakItem) => {
    setSelectedBreak(breakItem);
    setShowDescriptionModal(true);
  };

  const handleRemoveBreak = (id) => {
    if (rules.breaks.length <= 1) {
      alert("At least one break must be configured");
      return;
    }

    if (window.confirm("Are you sure you want to remove this break?")) {
      setRules((prev) => ({
        ...prev,
        breaks: prev.breaks.filter((breakItem) => breakItem.id !== id),
      }));
    }
  };

  const handleDuplicateBreak = (id) => {
    const breakToDuplicate = rules.breaks.find(
      (breakItem) => breakItem.id === id
    );
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
  };

  const handleSaveBreak = () => {
    if (selectedBreak) {
      handleBreakChange(selectedBreak.id, selectedBreak);
    }
    setShowBreakModal(false);
    setSelectedBreak(null);
  };

  const handleSaveDescription = () => {
    if (selectedBreak) {
      handleBreakChange(selectedBreak.id, {
        description: selectedBreak.description,
      });
    }
    setShowDescriptionModal(false);
    setSelectedBreak(null);
  };

  // Calculate total paid/unpaid break time
  const breakStats = useMemo(() => {
    const paidBreaks = rules.breaks.filter((b) => b.type === "paid");
    const unpaidBreaks = rules.breaks.filter((b) => b.type === "unpaid");
    const flexibleBreaks = rules.breaks.filter((b) => b.type === "flexible");

    const totalPaidTime = paidBreaks.reduce((sum, b) => sum + b.duration, 0);
    const totalUnpaidTime = unpaidBreaks.reduce(
      (sum, b) => sum + b.duration,
      0
    );

    return {
      totalBreaks: rules.breaks.length,
      paidBreaks: paidBreaks.length,
      unpaidBreaks: unpaidBreaks.length,
      flexibleBreaks: flexibleBreaks.length,
      totalPaidTime,
      totalUnpaidTime,
      mandatoryBreaks: rules.breaks.filter((b) => b.mandatory).length,
      autoDeductBreaks: rules.breaks.filter((b) => b.autoDeduct).length,
      totalBreakTime: totalPaidTime + totalUnpaidTime,
      punchRequiredBreaks: rules.breaks.filter((b) => b.punchRequired).length,
    };
  }, [rules.breaks]);

  // Calculate break compliance
  const complianceData = useMemo(() => {
    const totalLogs = breakLogs.length;
    const completedLogs = breakLogs.filter(
      (log) => log.status === "completed"
    ).length;
    const lateLogs = breakLogs.filter((log) => {
      // Simplified late detection
      return log.type === "manual" && log.duration > 15;
    }).length;

    return {
      totalLogs,
      completedLogs,
      completionRate:
        totalLogs > 0 ? ((completedLogs / totalLogs) * 100).toFixed(1) : 0,
      lateLogs,
      averageDuration:
        totalLogs > 0
          ? (
              breakLogs.reduce((sum, log) => sum + log.duration, 0) / totalLogs
            ).toFixed(1)
          : 0,
      autoBreaks: breakLogs.filter((log) => log.type === "auto").length,
      manualBreaks: breakLogs.filter((log) => log.type === "manual").length,
    };
  }, [breakLogs]);

  const resetToDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all break rules to defaults?"
      )
    ) {
      localStorage.removeItem("breakManagementRules");
      window.location.reload();
    }
  };

  const exportRules = () => {
    const dataStr = JSON.stringify(rules, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "break-rules-backup.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importRules = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedRules = JSON.parse(e.target.result);
        setRules(importedRules);
        alert("Break rules imported successfully!");
      } catch (error) {
        alert("Error importing rules. Invalid JSON format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-light text-dark">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 gap-sm-0">
                {/* Title with responsive icon sizing */}
                <div className="d-flex align-items-center">
                  <i className="bi bi-cup-hot text-primary me-1 me-sm-2 fs-5 fs-sm-4"></i>
                  <div>
                    <h5 className="fw-semibold mb-0 h6 h5-sm h4-md">
                      Break Management System
                    </h5>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex align-items-center">
                  {/* Small screen: Icon-only buttons + optional Save */}
                  <div className="d-flex d-sm-none align-items-center gap-1">
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-light"
                        onClick={exportRules}
                        title="Export Break Rules"
                      >
                        <i className="bi bi-download"></i>
                      </button>
                      <label
                        className="btn btn-sm btn-light position-relative"
                        title="Import Break Rules"
                      >
                        <i className="bi bi-upload"></i>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importRules}
                          className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
                          style={{ cursor: "pointer" }}
                        />
                      </label>
                      <button
                        className="btn btn-sm btn-light"
                        onClick={resetToDefaults}
                        title="Reset to Defaults"
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                    </div>

                  </div>

                  {/* Medium+ screens: Full buttons with group */}
            <div className="d-none d-sm-flex btn-group">

  <style>
    {`
      .custom-btn {
        background-color: #0d6efd;  /* base blue */
        color: #fff;                 /* text color white */
        border: none;
        transition: background 0.2s;
      }

      .custom-btn:hover {
        background-color: #0b5ed7;  /* darker blue on hover */
      }

      .custom-btn i {
        font-size: 0.9rem;
      }
    `}
  </style>

  <button
    className="btn btn-sm custom-btn d-flex align-items-center"
    onClick={exportRules}
    title="Export Rules"
  >
    <i className="bi bi-download me-1 me-md-2"></i>
    <span className="d-none d-md-inline">Export</span>
  </button>

  <label
    className="btn btn-sm custom-btn d-flex align-items-center position-relative"
    title="Import Rules"
  >
    <i className="bi bi-upload me-1 me-md-2"></i>
    <span className="d-none d-md-inline">Import</span>
    <input
      type="file"
      accept=".json"
      onChange={importRules}
      className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
      style={{ cursor: "pointer" }}
    />
  </label>

  <button
    className="btn btn-sm custom-btn d-flex align-items-center"
    onClick={resetToDefaults}
    title="Reset to Defaults"
  >
    <i className="bi bi-arrow-clockwise me-1 me-md-2"></i>
    <span className="d-none d-md-inline">Reset</span>
  </button>

</div>


                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Storage Status */}
              <div className="alert alert-info mb-4 p-3">
                <div className="container-fluid p-0">
                  <div className="row align-items-center g-2 g-md-3">
                    {/* Icon Column */}
                    <div className="col-auto">
                      <i className="bi bi-database fs-3 fs-md-4 text-info"></i>
                    </div>

                    {/* Content Column */}
                    <div className="col-12 col-md">
                      <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <div className="mb-1 mb-md-0 me-md-3">
                          <h6 className="fw-semibold mb-0 d-inline me-2">
                          
                            Break Rules Auto-Saved to Local Storage
                          </h6>
                          <span className="badge bg-info d-none d-md-inline">
                            Auto-save
                          </span>
                          <span className="badge bg-success d-md-none ms-2">
                            <i className="bi bi-cup-hot me-1"></i>
                            {breakStats.totalBreaks}
                          </span>
                        </div>
                        <div className="text-muted small flex-grow-1">
                          <span>
                            All break configurations are automatically saved and
                            persist across sessions.
                            <span className="d-block d-md-inline mt-1 mt-md-0 ms-md-2">
                              Last updated: {new Date().toLocaleTimeString()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Breaks Badge Column - Desktop only */}
                    <div className="col-auto d-none d-md-block">
                      <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 p-2 px-3 d-flex align-items-center">
                        <i className="bi bi-cup-hot fs-5 me-2"></i>
                        <div>
                          <div className="small">Total Breaks</div>
                          <div className="fw-bold fs-6">
                            {breakStats.totalBreaks}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Break Statistics */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card border">
                    <div className="card-body p-2 p-sm-3 p-md-4">
                      <div className="row g-0 text-center">
                        {[
                          {
                            title: "Total Breaks",
                            value: breakStats.totalBreaks,
                            color: "primary",
                            icon: "bi-list-check",
                            subtitle: "Configured breaks",
                            shortTitle: "Breaks",
                          },
                          {
                            title: "Paid Time",
                            value: `${breakStats.totalPaidTime}m`,
                            color: "success",
                            icon: "bi-cash-coin",
                            subtitle: "Total paid minutes",
                            shortTitle: "Paid",
                          },
                          {
                            title: "Unpaid Time",
                            value: `${breakStats.totalUnpaidTime}m`,
                            color: "warning",
                            icon: "bi-clock",
                            subtitle: "Total unpaid minutes",
                            shortTitle: "Unpaid",
                          },
                          {
                            title: "Total Break Time",
                            value: `${breakStats.totalBreakTime}m`,
                            color: "info",
                            icon: "bi-clock-history",
                            subtitle: "Combined duration",
                            shortTitle: "Total",
                          },
                          {
                            title: "Mandatory",
                            value: breakStats.mandatoryBreaks,
                            color: "danger",
                            icon: "bi-star-fill",
                            subtitle: "Required breaks",
                            shortTitle: "Required",
                          },
                          {
                            title: "Auto-Deduct",
                            value: breakStats.autoDeductBreaks,
                            color: "secondary",
                            icon: "bi-robot",
                            subtitle: "Auto-deduct breaks",
                            shortTitle: "Auto",
                          },
                        ].map((stat, index) => (
                          <div
                            key={index}
                            className="col-6 col-md-4 col-lg-2 mb-2 mb-sm-0"
                          >
                            <div
                              className={`
                  h-100 py-2 py-sm-3
                  ${index > 0 ? "border-start border-light" : ""}
                  ${index === 2 || index === 5 ? "border-md-none" : ""}
                `}
                              style={{
                                borderColor: "rgba(0,0,0,0.1) !important",
                              }}
                            >
                              {/* Title with responsive icon */}
                              <div className="fw-semibold text-secondary small mb-1 mb-sm-2">
                                <i
                                  className={`bi ${stat.icon} d-none d-sm-inline me-1 me-sm-2`}
                                ></i>
                                <i
                                  className={`bi ${stat.icon} d-sm-none me-1`}
                                ></i>
                                <span className="d-none d-sm-inline">
                                  {stat.title}
                                </span>
                                <span className="d-sm-none">
                                  {stat.shortTitle}
                                </span>
                              </div>

                              {/* Value with responsive size */}
                        <div
  className={`h6 h5-sm h4-lg mb-1 mb-sm-2 text-${stat.color} fw-semibold`}
>
  {stat.value}
</div>


                              {/* Subtitle with responsive icon */}
                              <div className="small text-muted mb-0">
                                <i className="bi bi-info-circle d-none d-sm-inline me-1"></i>
                                <span className="d-none d-sm-inline">
                                  {stat.subtitle}
                                </span>
                                <span className="d-sm-none">
                                  {stat.shortTitle}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

        
             
                {/* Break Configuration */}
              <div className="row g-3">
  {/* Break Configuration - Compact */}
<div className="col-12">
  <div className="card border">
    <div className="card-header bg-light py-2">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <i className="bi bi-cup-hot text-primary me-2 fs-5"></i>
          <h6 className="mb-0">Break Configuration</h6>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm btn-primary" onClick={handleAddBreak}>
            <i className="bi bi-plus me-1"></i>Add Break
          </button>
          <span className="badge bg-secondary">{rules.breaks.length} breaks</span>
        </div>
      </div>
    </div>

    <div className="card-body p-3">
      {rules.breaks.length > 0 ? (
        <div className="row g-3">
          {rules.breaks.map((breakItem) => (
            <div className="col-md-6 col-lg-4" key={breakItem.id}>
              <div className={`card h-100 ${breakItem.mandatory ? 'border-warning' : ''}`}>
                <div className="card-body">

                  {/* Header with Blue Box Tick */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center">
                      {/* Blue box with tick */}
                      <div
                        className="d-flex align-items-center justify-content-center me-2 rounded"
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          backgroundColor: breakItem.confirmed ? '#0d6efd' : '#cce5ff', // solid blue if confirmed, light blue if not
                          color: breakItem.confirmed ? '#fff' : '#0d6efd',
                          transition: 'all 0.2s',
                        }}
                        onClick={() => handleBreakChange(breakItem.id, { confirmed: !breakItem.confirmed })}
                      >
                        {breakItem.confirmed ? (
                          <i className="bi bi-check-lg" style={{ fontSize: '14px' }}></i>
                        ) : (
                          <i className="bi bi-circle" style={{ fontSize: '14px' }}></i>
                        )}
                      </div>
                      <h6 className="mb-0 text-truncate" style={{ maxWidth: '120px' }}>
                        {breakItem.name}
                      </h6>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditBreak(breakItem)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveBreak(breakItem.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>

                  {/* Type & Duration */}
                  <div className="d-flex justify-content-between mb-2">
                    <span className={`badge ${breakItem.type === 'paid' ? 'bg-success' : breakItem.type === 'unpaid' ? 'bg-warning' : 'bg-info'}`}>
                      {breakItem.type.charAt(0).toUpperCase() + breakItem.type.slice(1)}
                    </span>
                    <span className="text-muted">{breakItem.duration}m</span>
                  </div>

                  {/* Time */}
                  <div className="mb-2">
                    <small className="text-muted">Time:</small>
                    <div className="d-flex justify-content-between">
                      <span>{breakItem.windowStart}</span>
                      <span>to</span>
                      <span>{breakItem.windowEnd}</span>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="d-flex gap-3 mb-2">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={breakItem.autoDeduct}
                        onChange={(e) => handleBreakChange(breakItem.id, { autoDeduct: e.target.checked })}
                      />
                      <label className="form-check-label small">Auto</label>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={breakItem.punchRequired}
                        onChange={(e) => handleBreakChange(breakItem.id, { punchRequired: e.target.checked })}
                      />
                      <label className="form-check-label small">Punch</label>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="small text-muted">
                    <div className="d-flex justify-content-between">
                      <span>Max Delay: {breakItem.maxDelay}m</span>
                      <span>Min Gap: {breakItem.minGapAfter}m</span>
                      <span>Grace: {breakItem.gracePeriod || 5}m</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <i className="bi bi-cup-hot fs-1 text-muted mb-2"></i>
          <p className="text-muted">No breaks configured</p>
          <button className="btn btn-primary" onClick={handleAddBreak}>
            Add First Break
          </button>
        </div>
      )}
    </div>
  </div>
</div>




  
  {/* Settings Section */}
  <div className="col-12">
    <div className="card border">
      <div className="card-header bg-light py-2">
        <h6 className="mb-0">Break Settings</h6>
      </div>
   
 
    <div className="card-body">

      <style>
        {`
          /* Big blue checkbox with bold white tick */
          .form-check-input {
            width: 1.6rem;
            height: 1.6rem;
            cursor: pointer;
            position: relative;
            appearance: none;
            -webkit-appearance: none;
            background-color: #fff;
            border: 2px solid #0d6efd;
            border-radius: 0.25rem;
            transition: all 0.15s;
          }

          .form-check-input:checked {
            background-color: #0d6efd;
            border-color: #0d6efd;
          }

          /* Big white tick */
          .form-check-input:checked::after {
            content: "";
            position: absolute;
            left: 5px;
            top: 3px;
            width: 6px;
            height: 10px;
            border: solid white;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
          }

          .form-check-label {
            margin-left: 0.6rem;
            cursor: pointer;
            font-weight: 500;
          }

          .form-control {
            margin-top: 0.25rem;
          }

          h6.border-bottom {
            border-bottom: 1px solid #dee2e6;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
          }
        `}
      </style>

      <div className="row">

        {/* Enforcement */}
        <div className="col-md-6">
          <h6 className="border-bottom">Enforcement & Tracking</h6>

          {[
            { key: "trackBreakPunches", label: "Track Break Punches" },
            { key: "breakReminders", label: "Break Reminders" },
            { key: "enforceSequence", label: "Enforce Break Sequence" },
            { key: "strictMode", label: "Strict Mode" },
            { key: "deductFromWorkHours", label: "Deduct from Work Hours" },
            { key: "allowMultipleBreaks", label: "Allow Multiple Breaks" },
          ].map(({ key, label }) => (
            <div className="form-check mb-3" key={key}>
              <input
                type="checkbox"
                className="form-check-input"
                checked={rules.enforcement[key]}
                onChange={(e) => handleEnforcementChange({ [key]: e.target.checked })}
              />
              <label className="form-check-label">{label}</label>
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Reminder Before (minutes)</label>
            <input
              type="number"
              className="form-control"
              value={rules.enforcement.reminderBefore}
              onChange={(e) =>
                handleEnforcementChange({ reminderBefore: parseInt(e.target.value) })
              }
              min="1"
              max="60"
              disabled={!rules.enforcement.breakReminders}
            />
          </div>
        </div>

        {/* Policies */}
        <div className="col-md-6">
          <h6 className="border-bottom">Auto-Deduction Policies</h6>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={rules.policies.mealBreakRequired}
              onChange={(e) =>
                handlePoliciesChange({ mealBreakRequired: e.target.checked })
              }
            />
            <label className="form-check-label">Meal Break Required</label>
          </div>

          {rules.policies.mealBreakRequired && (
            <div className="mb-3">
              <label className="form-label">Required After (hours)</label>
              <input
                type="number"
                className="form-control"
                value={rules.policies.mealBreakAfterHours}
                onChange={(e) =>
                  handlePoliciesChange({ mealBreakAfterHours: parseInt(e.target.value) })
                }
                min="1"
                max="12"
              />
            </div>
          )}
        </div>
      </div>
    </div>
 
  
    </div>
  </div>
  
  {/* Break Logs - Simplified */}
  <div className="col-12">
    <div className="card border">
      <div className="card-header bg-light py-2">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Break Logs & Compliance</h6>
          <span className="badge bg-success">{complianceData.completionRate}% compliance</span>
        </div>
      </div>
      
      <div className="card-body p-0">
        {/* Stats Row */}
        <div className="row g-2 p-3 border-bottom">
          {[
            { title: 'Total Logs', value: complianceData.totalLogs, color: 'primary' },
            { title: 'Completed', value: complianceData.completedLogs, color: 'success' },
            { title: 'Avg Duration', value: `${complianceData.averageDuration}m`, color: 'info' },
            { title: 'Auto Breaks', value: complianceData.autoBreaks, color: 'secondary' },
          ].map((stat, index) => (
            <div className="col-6 col-md-3" key={index}>
              <div className="text-center p-2 bg-light rounded">
                <div className={`fw-bold text-${stat.color}`}>{stat.value}</div>
                <div className="small text-muted">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Break</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {breakLogs.length > 0 ? (
                breakLogs.map((log) => {
                  const breakItem = rules.breaks.find(b => b.id === log.breakId);
                  return (
                    <tr key={log.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm me-2">
                            <div className="avatar-title bg-light rounded-circle text-primary">
                              {log.employeeName.charAt(0)}
                            </div>
                          </div>
                          <span>{log.employeeName}</span>
                        </div>
                      </td>
                      <td>{breakItem?.name || 'Unknown'}</td>
                      <td>
                        {new Date(log.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                      <td>
                        {log.endTime ? (
                          new Date(log.endTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        ) : (
                          <span className="badge bg-secondary">Ongoing</span>
                        )}
                      </td>
                      <td>{log.duration}m</td>
                      <td>
                        <span className={`badge ${
                          log.status === 'completed' ? 'bg-success' :
                          log.status === 'missed' ? 'bg-danger' :
                          log.status === 'late' ? 'bg-warning' :
                          'bg-secondary'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <i className="bi bi-clipboard-data fs-1 text-muted mb-2 d-block"></i>
                    <p className="text-muted">No break logs available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Stats */}
        {breakLogs.length > 0 && (
          <div className="border-top p-3">
            <div className="d-flex flex-wrap justify-content-center gap-4">
              <div className="text-center">
                <div className="small text-muted">Total Employees</div>
                <div className="fw-bold text-primary">{complianceData.totalEmployees || 0}</div>
              </div>
              <div className="text-center">
                <div className="small text-muted">Missed Breaks</div>
                <div className="fw-bold text-danger">{complianceData.missedBreaks || 0}</div>
              </div>
              <div className="text-center">
                <div className="small text-muted">Late Breaks</div>
                <div className="fw-bold text-warning">{complianceData.lateBreaks || 0}</div>
              </div>
              <div className="text-center">
                <div className="small text-muted">Avg Compliance</div>
                <div className="fw-bold text-success">{complianceData.completionRate}%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>


{/* View Break Details Modal - Simplified */}
{viewingBreakId && (
  <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-md">
      <div className="modal-content">
        <div className="modal-header bg-light py-2">
          <h6 className="modal-title mb-0">Break Details</h6>
          <button type="button" className="btn-close" onClick={() => setViewingBreakId(null)}></button>
        </div>
        <div className="modal-body p-3">
          {(() => {
            const breakItem = rules.breaks.find(b => b.id === viewingBreakId);
            if (!breakItem) return null;
            
            return (
              <div>
                <div className="text-center mb-3">
                  <h5>{breakItem.name}</h5>
                  <span className={`badge ${breakItem.type === 'paid' ? 'bg-success' : breakItem.type === 'unpaid' ? 'bg-warning' : 'bg-info'}`}>
                    {breakItem.type} • {breakItem.duration}m
                  </span>
                </div>
                
                <div className="row mb-3">
                  <div className="col-6">
                    <div className="card bg-light">
                      <div className="card-body p-2 text-center">
                        <div className="fw-bold">{breakItem.duration}m</div>
                        <small className="text-muted">Duration</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card bg-light">
                      <div className="card-body p-2 text-center">
                        <div className="fw-bold">{breakItem.flexibleWindow}m</div>
                        <small className="text-muted">Flexible Window</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Time Window</label>
                  <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded">
                    <span className="fw-bold">{breakItem.windowStart}</span>
                    <i className="bi bi-arrow-right"></i>
                    <span className="fw-bold">{breakItem.windowEnd}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Settings</label>
                  <div className="d-flex flex-wrap gap-3">
                    <span className={`badge ${breakItem.autoDeduct ? 'bg-success' : 'bg-secondary'}`}>
                      Auto-Deduct: {breakItem.autoDeduct ? 'Yes' : 'No'}
                    </span>
                    <span className={`badge ${breakItem.punchRequired ? 'bg-success' : 'bg-secondary'}`}>
                      Punch Required: {breakItem.punchRequired ? 'Yes' : 'No'}
                    </span>
                    <span className={`badge ${breakItem.mandatory ? 'bg-warning' : 'bg-secondary'}`}>
                      Mandatory: {breakItem.mandatory ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                
                {breakItem.description && (
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <p className="mb-0">{breakItem.description}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        <div className="modal-footer py-2">
          <button type="button" className="btn btn-secondary" onClick={() => setViewingBreakId(null)}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={() => {
            const breakItem = rules.breaks.find(b => b.id === viewingBreakId);
            if (breakItem) {
              setViewingBreakId(null);
              setTimeout(() => handleEditBreak(breakItem), 100);
            }
          }}>
            Edit Break
          </button>
        </div>
      </div>
    </div>
  </div>
)}

                {/* Break Enforcement & Tracking */}
                <div className="col-lg-8">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-shield-check text-success me-2"></i>
                        <h6 className="mb-0">Break Enforcement & Tracking</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="mb-3">
                            <i className="bi bi-clipboard-check me-2"></i>
                            Tracking Settings
                          </h6>
                          <div className="mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={rules.enforcement.trackBreakPunches}
                                onChange={(e) =>
                                  handleEnforcementChange({
                                    trackBreakPunches: e.target.checked,
                                  })
                                }
                                id="trackBreakPunches"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="trackBreakPunches"
                              >
                                <i className="bi bi-clipboard-data me-1"></i>
                                Track Break Punches
                              </label>
                              <div className="form-text small">
                                Record exact break start/end times
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={rules.enforcement.breakReminders}
                                onChange={(e) =>
                                  handleEnforcementChange({
                                    breakReminders: e.target.checked,
                                  })
                                }
                                id="breakReminders"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="breakReminders"
                              >
                                <i className="bi bi-bell me-1"></i>
                                Break Reminders
                              </label>
                              <div className="form-text small">
                                Send reminders before break windows
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={rules.enforcement.enforceSequence}
                                onChange={(e) =>
                                  handleEnforcementChange({
                                    enforceSequence: e.target.checked,
                                  })
                                }
                                id="enforceSequence"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="enforceSequence"
                              >
                                <i className="bi bi-list-ol me-1"></i>
                                Enforce Break Sequence
                              </label>
                              <div className="form-text small">
                                Require breaks in configured order
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={rules.enforcement.strictMode}
                                onChange={(e) =>
                                  handleEnforcementChange({
                                    strictMode: e.target.checked,
                                  })
                                }
                                id="strictMode"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="strictMode"
                              >
                                <i className="bi bi-shield-exclamation me-1"></i>
                                Strict Mode
                              </label>
                              <div className="form-text small">
                                Enforce breaks exactly within configured windows
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <h6 className="mb-3">
                            <i className="bi bi-clock me-2"></i>
                            Duration Enforcement
                          </h6>
                          <div className="mb-3">
                            <label className="form-label">
                              <i className="bi bi-alarm text-secondary me-1"></i>
                              Reminder Before Break
                            </label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                value={rules.enforcement.reminderBefore}
                                onChange={(e) =>
                                  handleEnforcementChange({
                                    reminderBefore: parseInt(e.target.value),
                                  })
                                }
                                min="1"
                                max="60"
                                disabled={!rules.enforcement.breakReminders}
                              />
                              <span className="input-group-text">mins</span>
                            </div>
                            <div className="form-text small">
                              Send reminder this many minutes before break
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">
                              <i className="bi bi-calendar-day text-secondary me-1"></i>
                              Max Breaks per Day
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={rules.enforcement.maxBreaksPerDay}
                              onChange={(e) =>
                                handleEnforcementChange({
                                  maxBreaksPerDay: parseInt(e.target.value),
                                })
                              }
                              min="1"
                              max="10"
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">
                              <i className="bi bi-hourglass text-secondary me-1"></i>
                              Punch Grace Period
                            </label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                value={rules.enforcement.punchGracePeriod}
                                onChange={(e) =>
                                  handleEnforcementChange({
                                    punchGracePeriod: parseInt(e.target.value),
                                  })
                                }
                                min="0"
                                max="15"
                              />
                              <span className="input-group-text">mins</span>
                            </div>
                            <div className="form-text small">
                              Allowance for late break punches
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auto-Deduction Rules */}
                <div className="col-lg-4">
                  <div className="card border h-100">
                    <div className="card-header bg-light">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-robot text-info me-2"></i>
                        <h6 className="mb-0">Auto-Deduction Rules</h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-4">
                        <h6 className="mb-3">
                          <i className="bi bi-egg-fried me-2"></i>
                          Lunch Break Rules
                        </h6>
                        <div className="mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rules.policies.mealBreakRequired}
                              onChange={(e) =>
                                handlePoliciesChange({
                                  mealBreakRequired: e.target.checked,
                                })
                              }
                              id="mealBreakRequired"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="mealBreakRequired"
                            >
                              Meal Break Required
                            </label>
                          </div>
                          <div className="form-text small">
                            If working more than{" "}
                            {rules.policies.mealBreakAfterHours} hours
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">
                            <i className="bi bi-clock-history text-secondary me-1"></i>
                            Auto-Deduct Duration
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              value={rules.policies.autoDeductDuration}
                              onChange={(e) =>
                                handlePoliciesChange({
                                  autoDeductDuration: parseInt(e.target.value),
                                })
                              }
                              min="15"
                              max="120"
                            />
                            <span className="input-group-text">mins</span>
                          </div>
                          <div className="form-text small">
                            Standard lunch break duration for auto-deduction
                          </div>
                        </div>
                      </div>

                      <div className="border-top pt-3">
                        <h6 className="mb-3">
                          <i className="bi bi-gear me-2"></i>
                          Deduction Policies
                        </h6>
                        <div className="mb-3">
                          <label className="form-label">
                            <i className="bi bi-arrows-angle-expand text-secondary me-1"></i>
                            Max Auto-Extension
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              value={rules.policies.maxAutoExtension}
                              onChange={(e) =>
                                handlePoliciesChange({
                                  maxAutoExtension: parseInt(e.target.value),
                                })
                              }
                              min="0"
                              max="60"
                            />
                            <span className="input-group-text">mins</span>
                          </div>
                          <div className="form-text small">
                            Maximum allowed extension beyond scheduled break
                          </div>
                        </div>

                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={rules.enforcement.deductFromWorkHours}
                            onChange={(e) =>
                              handleEnforcementChange({
                                deductFromWorkHours: e.target.checked,
                              })
                            }
                            id="deductFromWorkHours"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="deductFromWorkHours"
                          >
                            <i className="bi bi-calculator me-1"></i>
                            Deduct from Work Hours
                          </label>
                          <div className="form-text small">
                            Automatically subtract break time from total work
                            hours
                          </div>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={rules.enforcement.allowMultipleBreaks}
                            onChange={(e) =>
                              handleEnforcementChange({
                                allowMultipleBreaks: e.target.checked,
                              })
                            }
                            id="allowMultipleBreaks"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="allowMultipleBreaks"
                          >
                            <i className="bi bi-collection me-1"></i>
                            Allow Multiple Breaks
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Break Logs & Compliance */}
                <div className="col-12">
                  <div className="card border">
                    {/* Card Header - Responsive */}
                    <div className="card-header bg-light py-2 py-sm-3">
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 gap-sm-0">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-clipboard-data text-primary me-2 fs-6 fs-sm-5"></i>
                          <h6 className="mb-0 fs-6 fs-sm-5">
                            Break Logs & Compliance
                          </h6>
                        </div>
                        <div className="badge bg-success fs-6 p-2">
                          <i className="bi bi-check-circle me-1"></i>
                          <span className="d-none d-sm-inline">
                            Compliance Rate:
                          </span>
                          <span className="d-sm-none">Rate:</span>{" "}
                          {complianceData.completionRate}%
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body p-2 p-sm-3 p-md-4">
                      {/* Stats Cards - Responsive Grid */}
                    <div className="row g-2 g-sm-3 g-md-4 mb-4">
  {[
    {
      title: "Total Logs",
      value: complianceData.totalLogs,
      color: "primary",
      subtitle: "This week",
      icon: "bi-journal-text",
      shortTitle: "Logs",
    },
    {
      title: "Completed",
      value: complianceData.completedLogs,
      color: "success",
      subtitle: "Break sessions",
      icon: "bi-check-circle",
      shortTitle: "Done",
    },
    {
      title: "Avg Duration",
      value: `${complianceData.averageDuration} min`,
      color: "info",
      subtitle: "Per break",
      icon: "bi-clock-history",
      shortTitle: "Avg Time",
    },
    {
      title: "Auto Breaks",
      value: complianceData.autoBreaks,
      color: "secondary",
      subtitle: "Automatically logged",
      icon: "bi-robot",
      shortTitle: "Auto",
    },
  ].map((stat, index) => (
    <div
      key={index}
      className="col-6 col-md-3 mb-2 mb-md-0"
    >
      <div className="card bg-light border-0 h-100">
        <div className="card-body text-center p-2 p-sm-3">

          {/* Mobile Layout - Horizontal */}
          <div className="d-flex d-md-none align-items-center justify-content-start">
            <div className={`text-${stat.color} me-2`}>
              <i className={`bi ${stat.icon} fs-5`}></i>
            </div>
            <div className="text-start flex-grow-1">
              <div className={`fw-bold text-${stat.color} fs-6`}>
                {stat.value}
              </div>
              <div className="small text-muted">
                {stat.shortTitle}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Vertical */}
          <div className="d-none d-md-block">
            <div className="fw-bold text-secondary-light small mb-2">
              <i className={`bi ${stat.icon} me-1`}></i>
              {stat.title}
            </div>

            {/* ✅ Smaller middle number */}
            <div className={`fs-5 fw-bold mb-1 text-${stat.color}`}>
              {stat.value}
            </div>

            <div className="small text-muted">
              {stat.subtitle}
            </div>
          </div>

        </div>
      </div>
    </div>
  ))}
</div>


                      {/* Table Section */}
                      <div className="table-responsive">
                        <table className="table table-hover table-sm">
                          <thead>
                            <tr>
                              <th className="d-none d-sm-table-cell">
                                Employee
                              </th>
                              <th className="d-sm-none">Emp</th>

                              <th className="d-none d-md-table-cell">
                                Break Type
                              </th>
                              <th className="d-md-none">Type</th>

                              <th className="d-none d-lg-table-cell">
                                Start Time
                              </th>
                              <th className="d-lg-none">Start</th>

                              <th className="d-none d-lg-table-cell">
                                End Time
                              </th>
                              <th className="d-lg-none">End</th>

                              <th>Duration</th>

                              <th className="d-none d-md-table-cell">Type</th>
                              <th className="d-md-none d-none d-sm-table-cell">
                                T
                              </th>

                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {breakLogs.map((log) => {
                              const breakItem = rules.breaks.find(
                                (b) => b.id === log.breakId
                              );
                              return (
                                <tr key={log.id}>
                                  {/* Employee Column */}
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="d-none d-sm-flex avatar-sm me-2">
                                        <div className="avatar-title bg-light rounded-circle text-primary fs-7">
                                          {log.employeeName.charAt(0)}
                                        </div>
                                      </div>
                                      <span className="d-none d-sm-inline">
                                        {log.employeeName}
                                      </span>
                                      <span
                                        className="d-sm-none text-truncate"
                                        style={{ maxWidth: "60px" }}
                                      >
                                        {log.employeeName
                                          .split(" ")
                                          .map((n) => n.charAt(0))
                                          .join("")}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Break Type Column */}
                                  <td>
                                    <span
                                      className={`badge ${
                                        breakItem?.type === "paid"
                                          ? "bg-success"
                                          : breakItem?.type === "unpaid"
                                          ? "bg-warning"
                                          : "bg-info"
                                      } fs-7`}
                                      title={breakItem?.name || "Unknown"}
                                    >
                                      <span className="d-none d-md-inline">
                                        {breakItem?.name || "Unknown"}
                                      </span>
                                      <span className="d-md-none">
                                        {breakItem?.name
                                          ? breakItem.name.charAt(0)
                                          : "U"}
                                      </span>
                                    </span>
                                  </td>

                                  {/* Start Time Column */}
                                  <td>
                                    <span className="d-none d-sm-inline">
                                      {new Date(
                                        log.startTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                    <span className="d-sm-none small">
                                      {new Date(
                                        log.startTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      })}
                                    </span>
                                  </td>

                                  {/* End Time Column */}
                                  <td>
                                    {log.endTime ? (
                                      <>
                                        <span className="d-none d-sm-inline">
                                          {new Date(
                                            log.endTime
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                        <span className="d-sm-none small">
                                          {new Date(
                                            log.endTime
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                          })}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="badge bg-secondary fs-7">
                                        Ongoing
                                      </span>
                                    )}
                                  </td>

                                  {/* Duration Column */}
                                  <td>
                                    <span className="badge bg-primary fs-7">
                                      {log.duration}m
                                    </span>
                                  </td>

                                  {/* Type Column */}
                                  <td>
                                    <span
                                      className={`badge ${
                                        log.type === "auto"
                                          ? "bg-info"
                                          : "bg-secondary"
                                      } fs-7`}
                                      title={log.type}
                                    >
                                      <span className="d-none d-md-inline">
                                        {log.type}
                                      </span>
                                      <span className="d-md-none">
                                        {log.type.charAt(0)}
                                      </span>
                                    </span>
                                  </td>

                                  {/* Status Column */}
                                  <td>
                                    <span
                                      className={`badge ${
                                        log.status === "completed"
                                          ? "bg-success"
                                          : log.status === "missed"
                                          ? "bg-danger"
                                          : log.status === "late"
                                          ? "bg-warning"
                                          : "bg-secondary"
                                      } fs-7`}
                                      title={log.status}
                                    >
                                      <span className="d-none d-sm-inline">
                                        {log.status}
                                      </span>
                                      <span className="d-sm-none">
                                        {log.status === "completed"
                                          ? "✓"
                                          : log.status === "missed"
                                          ? "✗"
                                          : log.status === "late"
                                          ? "⌛"
                                          : "○"}
                                      </span>
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Only: Summary View */}
                      <div className="d-md-none mt-3">
                        <div className="accordion" id="breakLogsAccordion">
                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#breakLogsSummary"
                                aria-expanded="false"
                              >
                                <i className="bi bi-list-check me-2"></i>
                                Break Logs Summary ({breakLogs.length} records)
                              </button>
                            </h2>
                            <div
                              id="breakLogsSummary"
                              className="accordion-collapse collapse"
                            >
                              <div className="accordion-body p-0">
                                <div className="list-group list-group-flush">
                                  {breakLogs.slice(0, 3).map((log) => {
                                    const breakItem = rules.breaks.find(
                                      (b) => b.id === log.breakId
                                    );
                                    return (
                                      <div
                                        key={log.id}
                                        className="list-group-item"
                                      >
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div>
                                            <div className="fw-bold small">
                                              {log.employeeName}
                                            </div>
                                            <div className="small text-muted">
                                              {breakItem?.name} • {log.duration}
                                              m
                                            </div>
                                          </div>
                                          <div className="text-end">
                                            <span
                                              className={`badge ${
                                                log.status === "completed"
                                                  ? "bg-success"
                                                  : log.status === "missed"
                                                  ? "bg-danger"
                                                  : log.status === "late"
                                                  ? "bg-warning"
                                                  : "bg-secondary"
                                              }`}
                                            >
                                              {log.status}
                                            </span>
                                            <div className="small text-muted mt-1">
                                              {new Date(
                                                log.startTime
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  {breakLogs.length > 3 && (
                                    <div className="list-group-item text-center">
                                      <small className="text-muted">
                                        + {breakLogs.length - 3} more records
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Stats */}
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="d-flex flex-wrap justify-content-center gap-2 gap-sm-3 gap-md-4">
                            <div className="text-center">
                              <div className="small text-muted">
                                Total Employees
                              </div>
                              <div className="fw-bold text-primary">
                                {complianceData.totalEmployees || 0}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="small text-muted">
                                Avg Compliance
                              </div>
                              <div className="fw-bold text-success">
                                {complianceData.completionRate}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="small text-muted">
                                Missed Breaks
                              </div>
                              <div className="fw-bold text-danger">
                                {complianceData.missedBreaks || 0}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="small text-muted">
                                Late Breaks
                              </div>
                              <div className="fw-bold text-warning">
                                {complianceData.lateBreaks || 0}
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
          </div>
        </div>
      </div>

      {/* Break Configuration Modal */}
      {showBreakModal && selectedBreak && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  <i className="bi bi-gear text-primary me-2"></i>
                  Configure Break: {selectedBreak.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBreakModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="bi bi-card-text text-secondary me-1"></i>
                      Break Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedBreak.name}
                      onChange={(e) =>
                        setSelectedBreak({
                          ...selectedBreak,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="bi bi-tag text-secondary me-1"></i>
                      Type
                    </label>
                    <select
                      className="form-select"
                      value={selectedBreak.type}
                      onChange={(e) =>
                        setSelectedBreak({
                          ...selectedBreak,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="bi bi-clock text-secondary me-1"></i>
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedBreak.duration}
                      onChange={(e) =>
                        setSelectedBreak({
                          ...selectedBreak,
                          duration: parseInt(e.target.value),
                        })
                      }
                      min="5"
                      max="180"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="bi bi-clock-history text-secondary me-1"></i>
                      Max Delay (minutes)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedBreak.maxDelay}
                      onChange={(e) =>
                        setSelectedBreak({
                          ...selectedBreak,
                          maxDelay: parseInt(e.target.value),
                        })
                      }
                      min="0"
                      max="60"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="bi bi-sun text-secondary me-1"></i>
                      Window Start
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={selectedBreak.windowStart}
                      onChange={(e) =>
                        setSelectedBreak({
                          ...selectedBreak,
                          windowStart: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="bi bi-moon text-secondary me-1"></i>
                      Window End
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={selectedBreak.windowEnd}
                      onChange={(e) =>
                        setSelectedBreak({
                          ...selectedBreak,
                          windowEnd: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="bi bi-arrows-angle-expand text-secondary me-1"></i>
                      Flexible Window (minutes)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedBreak.flexibleWindow}
                      onChange={(e) =>
                        setSelectedBreak({
                          ...selectedBreak,
                          flexibleWindow: parseInt(e.target.value),
                        })
                      }
                      min="0"
                      max="120"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="bi bi-hourglass text-secondary me-1"></i>
                      Min Gap After (minutes)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedBreak.minGapAfter}
                      onChange={(e) =>
                        setSelectedBreak({
                          ...selectedBreak,
                          minGapAfter: parseInt(e.target.value),
                        })
                      }
                      min="15"
                      max="240"
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedBreak.autoDeduct}
                        onChange={(e) =>
                          setSelectedBreak({
                            ...selectedBreak,
                            autoDeduct: e.target.checked,
                          })
                        }
                        id="modal-autoDeduct"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="modal-autoDeduct"
                      >
                        <i className="bi bi-robot me-1"></i>
                        Auto-Deduct
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedBreak.mandatory}
                        onChange={(e) =>
                          setSelectedBreak({
                            ...selectedBreak,
                            mandatory: e.target.checked,
                          })
                        }
                        id="modal-mandatory"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="modal-mandatory"
                      >
                        <i className="bi bi-star-fill me-1"></i>
                        Mandatory
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedBreak.punchRequired}
                        onChange={(e) =>
                          setSelectedBreak({
                            ...selectedBreak,
                            punchRequired: e.target.checked,
                          })
                        }
                        id="modal-punchRequired"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="modal-punchRequired"
                      >
                        <i className="bi bi-clipboard-check me-1"></i>
                        Punch Required
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBreakModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveBreak}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description Editor Modal */}
      {showDescriptionModal && selectedBreak && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  <i className="bi bi-card-text text-primary me-2"></i>
                  Break Description
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDescriptionModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Break Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedBreak.name}
                    onChange={(e) =>
                      setSelectedBreak({
                        ...selectedBreak,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={selectedBreak.description || ""}
                    onChange={(e) =>
                      setSelectedBreak({
                        ...selectedBreak,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter break description..."
                  />
                  <div className="form-text">
                    <i className="bi bi-info-circle me-1"></i>
                    This description helps employees understand the purpose of
                    this break
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDescriptionModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveDescription}
                >
                  Save Description
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

//====================================================
// Settings Component
//====================================================
const Settings = () => {
  const { state, dispatch, showNotification } = useWorkHourRules();
  const settings = state.settings;

  const handleSettingsChange = (data) => {
    dispatch({
      type: "UPDATE_SETTINGS",
      payload: data,
    });
    showNotification("Settings updated", "success");
  };

  // Calculate storage usage for each module
  const calculateStorageUsage = () => {
    const modules = {
      attendanceRules: localStorage.getItem("attendanceRules"),
      overtimeRules: localStorage.getItem("overtimeRules"),
      breakRules: localStorage.getItem("breakRules"),
      settings: localStorage.getItem("workHourSettings"),
    };

    const storageData = {
      attendanceRules: {
        name: "Attendance Rules",
        size: modules.attendanceRules
          ? (modules.attendanceRules.length * 2) / 1024
          : 0,
        items: modules.attendanceRules
          ? JSON.parse(modules.attendanceRules)
          : null,
        color: "primary",
      },
      overtimeRules: {
        name: "Overtime Management",
        size: modules.overtimeRules
          ? (modules.overtimeRules.length * 2) / 1024
          : 0,
        items: modules.overtimeRules ? JSON.parse(modules.overtimeRules) : null,
        color: "warning",
      },
      breakRules: {
        name: "Break Management",
        size: modules.breakRules ? (modules.breakRules.length * 2) / 1024 : 0,
        items: modules.breakRules ? JSON.parse(modules.breakRules) : null,
        color: "success",
      },
      settings: {
        name: "System Settings",
        size: modules.settings ? (modules.settings.length * 2) / 1024 : 0,
        items: modules.settings ? JSON.parse(modules.settings) : null,
        color: "info",
      },
    };

    // Calculate total size
    const totalSize = Object.values(storageData).reduce(
      (total, module) => total + module.size,
      0
    );

    // Calculate percentage of each module
    Object.keys(storageData).forEach((key) => {
      storageData[key].percentage =
        totalSize > 0
          ? Math.round((storageData[key].size / totalSize) * 100)
          : 0;
    });

    return {
      modules: storageData,
      totalSize: totalSize,
      lastBackup: localStorage.getItem("lastBackup") || "Never",
      rulesVersion: "v3.2.1",
    };
  };

  const storageInfo = calculateStorageUsage();

  // Backup function
  const handleBackup = () => {
    const backupData = {
      attendanceRules: localStorage.getItem("attendanceRules"),
      overtimeRules: localStorage.getItem("overtimeRules"),
      breakRules: localStorage.getItem("breakRules"),
      settings: localStorage.getItem("workHourSettings"),
      backupDate: new Date().toISOString(),
    };

    const backupStr = JSON.stringify(backupData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(backupStr);
    const fileName = `work-hours-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    localStorage.setItem("lastBackup", new Date().toLocaleString());
    showNotification("Backup created successfully!", "success");
  };

  // Clear cache function
  const handleClearCache = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all cache data? This will reset all rules to defaults."
      )
    ) {
      localStorage.removeItem("attendanceRules");
      localStorage.removeItem("overtimeRules");
      localStorage.removeItem("breakRules");
      localStorage.removeItem("workHourSettings");
      localStorage.removeItem("lastBackup");
      showNotification("Cache cleared successfully!", "warning");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // Check for updates
  const handleCheckUpdates = () => {
    showNotification("Checking for updates...", "info");
    // Simulate update check
    setTimeout(() => {
      showNotification("You have the latest version!", "success");
    }, 1500);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">
          <i className="bi bi-sliders text-primary me-2"></i>
          System Settings & Storage Management
        </h5>

      <div className="row g-4">

  {/* ================= General Settings ================= */}
  <div className="col-lg-6">
    <div className="card h-100">
      <div className="card-header bg-light">
        <h6 className="mb-0 fw-semibold">
          <i className="bi bi-gear text-primary me-2"></i>
          General Settings
        </h6>
      </div>

      <div className="card-body">
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label">Currency</label>
            <select
              className="form-select"
              value={settings.currency}
              onChange={(e) =>
                handleSettingsChange({ currency: e.target.value })
              }
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>INR</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Time Format</label>
            <select
              className="form-select"
              value={settings.timeFormat}
              onChange={(e) =>
                handleSettingsChange({ timeFormat: e.target.value })
              }
            >
              <option value="24h">24 Hour</option>
              <option value="12h">12 Hour</option>
            </select>
          </div>

          {/* Date Card */}
          <div className="col-md-6">
            <label className="form-label">Current Date</label>
            <div className="card bg-light border-0">
              <div className="card-body text-center py-3">
                <div className="small text-muted mb-1">Today</div>
                <div className="fs-5 fw-bold text-primary">
                  {new Date().toLocaleDateString("en-GB")}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label">Week Start</label>
            <select
              className="form-select"
              value={settings.weekStart}
              onChange={(e) =>
                handleSettingsChange({ weekStart: e.target.value })
              }
            >
              <option>Monday</option>
              <option>Sunday</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  </div>

  {/* ================= Notifications ================= */}
  <div className="col-lg-6">
    <div className="card h-100">
      <div className="card-header bg-light">
        <h6 className="mb-0 fw-semibold">
          <i className="bi bi-bell text-warning me-2"></i>
          Backup & Notifications
        </h6>
      </div>

      <div className="card-body">

        <label className="form-label">Backup Frequency</label>
        <select
          className="form-select mb-3"
          value={settings.backupFrequency}
          onChange={(e) =>
            handleSettingsChange({ backupFrequency: e.target.value })
          }
        >
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>

<>
  <style>
    {`
      /* Remove default checkbox */
      .custom-check {
        appearance: none;
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border: 1.5px solid #ccc;
        border-radius: 3px;
        background-color: #fff; /* unchecked white */
        cursor: pointer;
        position: relative;
      }

      /* Checked state: FULL blue box */
      .custom-check:checked {
        background-color: #0d6efd; /* blue */
        border-color: #0d6efd;
      }

      /* White tick */
      .custom-check:checked::after {
        content: "✓";
        position: absolute;
        top: -1px;
        left: 3px;
        font-size: 13px;
        color: #fff;
        font-weight: bold;
      }

      /* Remove focus glow */
      .custom-check:focus {
        outline: none;
        box-shadow: none;
      }
    `}
  </style>

  {[
    { label: "Auto Save", key: "autoSave" },
    { label: "Email Alerts", key: "notificationEmails" },
    { label: "SMS Alerts", key: "smsAlerts" },
  ].map((item) => (
    <div className="d-flex align-items-center mb-2" key={item.key}>
      <input
        type="checkbox"
        id={item.key}
        className="custom-check"
        checked={!!settings[item.key]}
        onChange={(e) =>
          handleSettingsChange({ [item.key]: e.target.checked })
        }
      />
      <label htmlFor={item.key} className="ms-2">
        {item.label}
      </label>
    </div>
  ))}
</>

      </div>
    </div>
  </div>

  {/* ================= Storage ================= */}
  <div className="col-12">
    <div className="card">
      <div className="card-header bg-light">
        <h6 className="mb-0 fw-semibold">
          <i className="bi bi-hdd text-info me-2"></i>
          Storage Usage
        </h6>
      </div>

      <div className="card-body">

        {/* Top Summary */}
        <div className="d-flex justify-content-between mb-3">
          <div className="small text-muted">Total Used</div>
          <div className="fw-bold fs-5">
            {storageInfo.totalSize.toFixed(2)} KB
          </div>
        </div>

        {/* Progress */}
        <div className="progress mb-4" style={{ height: 10 }}>
          {Object.values(storageInfo.modules).map((m, i) => (
            <div
              key={i}
              className={`progress-bar bg-${m.color}`}
              style={{ width: `${m.percentage}%` }}
            />
          ))}
        </div>

        {/* Module Cards */}
        <div className="row g-3 mb-4">
          {Object.entries(storageInfo.modules).map(([k, m]) => (
            <div key={k} className="col-6 col-md-3">
              <div className="card bg-light border-0 text-center">
                <div className="card-body py-3">
                  <div className="small text-muted">{m.name}</div>
                  <div className="fw-bold fs-6">
                    {m.size.toFixed(2)} KB
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-primary btn-sm" onClick={handleBackup}>
            Backup
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            Check Updates
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleClearCache}
          >
            Clear Cache
          </button>
        </div>

      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default WHR;
