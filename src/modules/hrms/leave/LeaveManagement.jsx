import React, { useState, useEffect, useReducer } from "react";
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LeaveTypeModal from "../modal/LeaveTypeModal";
import LeaveApplicationModal from "../modal/LeaveApplicationModal";
import LeaveBalanceModal from "../modal/LeaveBalanceModal";
import CompOffModal from "../modal/CompOffModal";
import LeaveCampaignModal from "../modal/LeaveCampaignModal";
import LeaveDelegationModal from "../modal/LeaveDelegationModal";

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

const initialEmployees = [
];

const initialLeaveTypes = [];

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState("leaveTypes");
  const [showLeaveTypeModal, setShowLeaveTypeModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showCompOffModal, setShowCompOffModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDept, setSelectedDept] = useState("All");
  const [planningStartDate, setPlanningStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [planningEndDate, setPlanningEndDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split("T")[0];
  });

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
    proration: { enabled: true, method: "proportional" },
    approvalWorkflow: { levels: 1, approvers: [{ level: 1, role: "Manager", required: true }] },
  });

  const [applicationForm, setApplicationForm] = useState({
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

  const [balanceForm, setBalanceForm] = useState({
    employeeId: "",
    leaveTypeId: "",
    openingBalance: 0,
    adjustmentType: "credit",
    adjustmentAmount: 0,
    reason: "",
    effectiveDate: new Date().toISOString().split("T")[0],
  });

  const [compOffForm, setCompOffForm] = useState({
    employeeId: "",
    earnedDate: "",
    hours: 0,
    expiryDate: "",
    source: "holiday",
    description: "",
    policyType: "compOff",
  });

  const [campaignForm, setCampaignForm] = useState({
    name: "",
    period: "quarterly",
    startDate: "",
    endDate: "",
    targetDepartment: "All",
    message: "",
    status: "active",
  });

  const [delegationForm, setDelegationForm] = useState({
    fromApprover: "",
    toApprover: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [approvalDelegations, setApprovalDelegations] = useState([]);
  const [leavePlanningCampaigns, setLeavePlanningCampaigns] = useState([]);

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

  const handleAddLeaveType = () => {
    if (!leaveTypeForm.name || !leaveTypeForm.code) {
      toast.error("Please enter leave type name and code");
      return;
    }

    const newLeaveType = {
      id: editingLeaveType ? editingLeaveType.id : Date.now(),
      ...leaveTypeForm,
    };

    if (editingLeaveType) {
      dispatch({ type: "UPDATE_LEAVE_TYPE", payload: newLeaveType });
      toast.success("Leave type updated successfully");
    } else {
      dispatch({ type: "ADD_LEAVE_TYPE", payload: newLeaveType });
      toast.success("Leave type added successfully");
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
      toast.success("Leave type deleted successfully");
    }
  };

  const handleSubmitApplication = () => {
    if (!applicationForm.employeeId || !applicationForm.leaveTypeId || !applicationForm.startDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const leaveType = leaveTypes.find((lt) => lt.id === applicationForm.leaveTypeId);
    const employee = initialEmployees.find((e) => e.id === applicationForm.employeeId);

    let days = 1;
    if (applicationForm.endDate) {
      const start = new Date(applicationForm.startDate);
      const end = new Date(applicationForm.endDate);
      days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }
    if (applicationForm.halfDay) days = 0.5;

    const balance = leaveBalances.find(
      (b) => b.employeeId === applicationForm.employeeId && b.leaveTypeId === applicationForm.leaveTypeId
    );
    const availableBalance = balance?.balance || 0;

    if (availableBalance < days && !leaveType?.allowNegative) {
      toast.error(`Insufficient leave balance. Available: ${availableBalance} days`);
      return;
    }

    const application = {
      id: Date.now(),
      ...applicationForm,
      days,
      status: days <= 1 ? "approved" : "pending",
      appliedAt: new Date().toISOString(),
      appliedBy: employee?.name || applicationForm.employeeId,
      leaveTypeName: leaveType?.name || "Unknown",
      currentBalance: availableBalance,
    };

    dispatch({ type: "ADD_LEAVE_APPLICATION", payload: application });

    if (days <= 1) {
      const balance = leaveBalances.find(
        (b) => b.employeeId === applicationForm.employeeId && b.leaveTypeId === applicationForm.leaveTypeId
      );
      if (balance) {
        const updatedBalance = {
          ...balance,
          balance: balance.balance - days,
          used: balance.used + days,
        };
        dispatch({ type: "UPDATE_LEAVE_BALANCE", payload: updatedBalance });
      }
      toast.success("Leave application auto-approved!");
    } else {
      toast.success("Leave application submitted for approval");
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
  };

  const handleApproveApplication = (applicationId, approved) => {
    const application = leaveApplications.find((a) => a.id === applicationId);
    if (!application) return;

    const updatedApplication = {
      ...application,
      status: approved ? "approved" : "rejected",
      approvedAt: new Date().toISOString(),
      approvedBy: "Manager",
      rejectionReason: approved ? null : "Not approved by manager",
    };

    dispatch({ type: "UPDATE_LEAVE_APPLICATION", payload: updatedApplication });

    if (approved) {
      const balance = leaveBalances.find(
        (b) => b.employeeId === application.employeeId && b.leaveTypeId === application.leaveTypeId
      );
      if (balance) {
        const updatedBalance = {
          ...balance,
          balance: balance.balance - application.days,
          used: balance.used + application.days,
        };
        dispatch({ type: "UPDATE_LEAVE_BALANCE", payload: updatedBalance });
      }
      toast.success("Leave application approved");
    } else {
      toast.info("Leave application rejected");
    }
  };

  const handleAddBalance = () => {
    if (!balanceForm.employeeId || !balanceForm.leaveTypeId) {
      toast.error("Please select employee and leave type");
      return;
    }

    const balance = leaveBalances.find(
      (b) => b.employeeId === balanceForm.employeeId && b.leaveTypeId === balanceForm.leaveTypeId
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
          (balanceForm.adjustmentType === "credit" ? balanceForm.adjustmentAmount : -balanceForm.adjustmentAmount),
        used: 0,
        accrued: 0,
        carryForward: 0,
        encashed: 0,
        openingBalance: balanceForm.openingBalance,
      };
      dispatch({ type: "SET_LEAVE_BALANCES", payload: [...leaveBalances, newBalance] });
    }

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
    toast.success("Leave balance updated successfully");
  };

  const handleAddCompOff = () => {
    if (!compOffForm.employeeId || !compOffForm.earnedDate || !compOffForm.hours) {
      toast.error("Please fill all required fields");
      return;
    }

    const compOff = {
      id: Date.now(),
      ...compOffForm,
      status: "available",
      applied: false,
      createdAt: new Date().toISOString(),
      policyType: compOffForm.policyType || "compOff",
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
    toast.success("Comp-off added successfully");
  };

  const handleApplyCompOff = (compOffId) => {
    const compOff = compOffs.find((co) => co.id === compOffId);
    if (!compOff) return;

    const today = new Date().toISOString().split("T")[0];

    const application = {
      id: Date.now(),
      employeeId: compOff.employeeId,
      leaveTypeId: "COMP_OFF",
      leaveTypeName: "Comp-Off",
      startDate: today,
      endDate: today,
      days: Number((compOff.hours / 8).toFixed(2)),
      status: "pending",
      appliedAt: new Date().toISOString(),
      reason: `Comp-off application for ${compOff.hours} hours`,
      isCompOff: true,
      compOffId: compOffId,
    };

    dispatch({ type: "ADD_LEAVE_APPLICATION", payload: application });
    dispatch({
      type: "UPDATE_COMP_OFF",
      payload: { ...compOff, applied: true, status: "applied" },
    });

    toast.success("Comp-off application submitted");
  };

  const calculateProjectedBalance = (employeeId, leaveTypeId) => {
    const balance = leaveBalances.find(
      (b) => b.employeeId === employeeId && b.leaveTypeId === leaveTypeId
    );
    const leaveType = leaveTypes.find((lt) => lt.id === leaveTypeId);
    if (!balance || !leaveType) return 0;

    const currentMonth = new Date().getMonth();
    const remainingMonths = 12 - currentMonth;
    const projectedAccrual = leaveType.accrualType === "monthly" ? leaveType.accrualAmount * remainingMonths : 0;

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
            const lastAccrual = balance.lastAccrualDate ? new Date(balance.lastAccrualDate) : null;
            const shouldAccrue =
              !lastAccrual ||
              lastAccrual.getMonth() + 1 !== currentMonth ||
              lastAccrual.getFullYear() !== currentYear;

            if (shouldAccrue) {
              const newAccrued = Math.min(
                leaveType.accrualAmount,
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
            const newBalance = {
              id: Date.now(),
              employeeId: employee.id,
              leaveTypeId: leaveType.id,
              balance: leaveType.accrualAmount,
              used: 0,
              accrued: leaveType.accrualAmount,
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

    toast.success("Auto-accrual processed successfully");
  };

  const processLeaveLapse = () => {
    const today = new Date();
    let lapsedCount = 0;

    leaveBalances.forEach((balance) => {
      const leaveType = leaveTypes.find((lt) => lt.id === balance.leaveTypeId);
      if (!leaveType || !leaveType.carryForward.enabled) return;

      if (balance.carryForward > 0) {
        const expiryDate = new Date(balance.lastCarryForwardDate || today);
        expiryDate.setMonth(expiryDate.getMonth() + leaveType.carryForward.expiryMonths);

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

    toast.success(`Processed ${lapsedCount} lapsed leave(s)`);
  };

  const processLeaveEncashment = (employeeId, leaveTypeId, days) => {
    const balance = leaveBalances.find(
      (b) => b.employeeId === employeeId && b.leaveTypeId === leaveTypeId
    );
    const leaveType = leaveTypes.find((lt) => lt.id === leaveTypeId);

    if (!balance || !leaveType || !leaveType.encashment.enabled) {
      toast.error("Leave encashment not allowed for this leave type");
      return;
    }

    if (days > leaveType.encashment.maxDays) {
      toast.error(`Maximum ${leaveType.encashment.maxDays} days can be encashed`);
      return;
    }

    if (balance.balance < days) {
      toast.error("Insufficient leave balance for encashment");
      return;
    }

    const updatedBalance = {
      ...balance,
      balance: balance.balance - days,
      encashed: (balance.encashed || 0) + days,
    };
    dispatch({ type: "UPDATE_LEAVE_BALANCE", payload: updatedBalance });

    const encashmentAmount = days * leaveType.encashment.rate;
    toast.success(`Leave encashment processed: ${days} days @ ${leaveType.encashment.rate}x = ${encashmentAmount} days equivalent`);
  };

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
    toast.success("Approval delegation setup successfully");
  };

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
      toast.success('Leave balance statement exported successfully');
    }
  };

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

  const handleWithdrawApplication = (applicationId) => {
    const application = leaveApplications.find((a) => a.id === applicationId);
    if (!application) return;

    if (application.status !== "pending") {
      toast.warning("Only pending applications can be withdrawn");
      return;
    }

    if (window.confirm("Are you sure you want to withdraw this leave application?")) {
      dispatch({
        type: "UPDATE_LEAVE_APPLICATION",
        payload: { ...application, status: "withdrawn", withdrawnAt: new Date().toISOString() },
      });
      toast.success("Leave application withdrawn successfully");
    }
  };

  const handleCreateCampaign = () => {
    if (!campaignForm.name || !campaignForm.startDate || !campaignForm.endDate) {
      toast.error("Please fill all required fields");
      return;
    }

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
    toast.success("Leave planning campaign created successfully");
  };

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

  const getStatusBadge = (status) => {
    const config = {
      active: { label: 'Active', color: 'emerald' },
      inactive: { label: 'Inactive', color: 'gray' },
      pending: { label: 'Pending', color: 'yellow' },
      approved: { label: 'Approved', color: 'green' },
      rejected: { label: 'Rejected', color: 'red' },
      withdrawn: { label: 'Withdrawn', color: 'gray' },
      applied: { label: 'Applied', color: 'blue' },
      available: { label: 'Available', color: 'green' },
    };
    const { label, color } = config[status] || { label: status, color: 'gray' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const getLeaveTypeBadge = (type) => {
    const config = {
      CL: { label: 'Casual Leave', color: 'blue' },
      SL: { label: 'Sick Leave', color: 'red' },
      EL: { label: 'Earned Leave', color: 'green' },
      ML: { label: 'Maternity Leave', color: 'purple' },
      PL: { label: 'Paternity Leave', color: 'indigo' },
      BL: { label: 'Bereavement Leave', color: 'gray' },
    };
    const { label, color } = config[type] || { label: type, color: 'gray' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const renderLeaveTypes = () => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:cog-6-tooth" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span className="hidden xs:inline">Leave Type Configuration</span>
          <span className="xs:hidden">Leave Types</span>
        </h5>
        <button
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
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
              proration: { enabled: true, method: "proportional" },
              approvalWorkflow: { levels: 1, approvers: [{ level: 1, role: "Manager", required: true }] },
            });
            setShowLeaveTypeModal(true);
          }}
        >
          <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
          <span className="hidden xs:inline">Add Leave Type</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-2 sm:p-3">Leave Type</th>
                <th className="p-2 sm:p-3 hidden sm:table-cell">Code</th>
                <th className="p-2 sm:p-3">Paid</th>
                <th className="p-2 sm:p-3 hidden md:table-cell">Accrual</th>
                <th className="p-2 sm:p-3 hidden lg:table-cell">Carry Forward</th>
                <th className="p-2 sm:p-3 hidden xl:table-cell">Encashment</th>
                <th className="p-2 sm:p-3">Half Day</th>
                <th className="p-2 sm:p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaveTypes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-slate-400">
                    <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No leave types configured
                  </td>
                </tr>
              ) : (
                leaveTypes.map((lt) => (
                  <tr key={lt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3">
                      <div className="font-bold text-slate-800 text-xs sm:text-sm">{lt.name}</div>
                      {lt.description && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px] sm:max-w-[200px]">{lt.description}</div>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 hidden sm:table-cell">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">{lt.code}</code>
                    </td>
                    <td className="p-2 sm:p-3">
                      {getStatusBadge(lt.isPaid ? "active" : "inactive")}
                    </td>
                    <td className="p-2 sm:p-3 hidden md:table-cell text-slate-600">
                      {lt.accrualAmount}/{lt.accrualType === "monthly" ? "month" : "year"}
                    </td>
                    <td className="p-2 sm:p-3 hidden lg:table-cell text-slate-600">
                      {lt.carryForward.enabled ? (
                        <span className="text-xs">{lt.carryForward.maxDays} days ({lt.carryForward.expiryMonths}M)</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 hidden xl:table-cell text-slate-600">
                      {lt.encashment.enabled ? (
                        <span className="text-xs">{lt.encashment.maxDays} days @ {lt.encashment.rate}x</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3">
                      {lt.allowHalfDay ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">Yes</span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">No</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          onClick={() => handleEditLeaveType(lt)}
                          title="Edit"
                        >
                          <Icon icon="heroicons:pencil" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          className="p-1.5 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                          onClick={() => handleDeleteLeaveType(lt.id)}
                          title="Delete"
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

  const renderLeaveBalance = () => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:chart-bar" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span className="hidden xs:inline">Leave Balance Management</span>
          <span className="xs:hidden">Balance</span>
        </h5>
        <div className="flex flex-wrap gap-2">
          <button
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm"
            onClick={processAutoAccrual}
            title="Process monthly accrual"
          >
            <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
            <span className="hidden xs:inline">Auto Accrual</span>
            <span className="xs:hidden">Accrual</span>
          </button>
          <button
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm"
            onClick={processLeaveLapse}
            title="Process expired carry-forward leaves"
          >
            <Icon icon="heroicons:exclamation-triangle" className="w-4 h-4" />
            <span className="hidden xs:inline">Process Lapse</span>
            <span className="xs:hidden">Lapse</span>
          </button>
          <button
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
            onClick={() => exportLeaveBalanceStatement(null, "csv")}
            title="Export leave balance statement"
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            <span className="hidden xs:inline">Export</span>
            <span className="xs:hidden">Export</span>
          </button>
          <button
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
            onClick={() => setShowBalanceModal(true)}
          >
            <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
            <span className="hidden xs:inline">Adjust Balance</span>
            <span className="xs:hidden">Adjust</span>
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        {leaveBalances.length === 0 ? (
          <div className="text-center py-8">
            <Icon icon="heroicons:chart-bar" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No leave balances recorded</p>
            <button
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
              onClick={() => setShowBalanceModal(true)}
            >
              <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
              Add Opening Balance
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-2 sm:p-3">Employee</th>
                  <th className="p-2 sm:p-3">Leave Type</th>
                  <th className="p-2 sm:p-3">Opening</th>
                  <th className="p-2 sm:p-3 hidden sm:table-cell">Accrued</th>
                  <th className="p-2 sm:p-3 hidden md:table-cell">Used</th>
                  <th className="p-2 sm:p-3 hidden lg:table-cell">Carry Forward</th>
                  <th className="p-2 sm:p-3 hidden xl:table-cell">Encashed</th>
                  <th className="p-2 sm:p-3">Balance</th>
                  <th className="p-2 sm:p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leaveBalances.map((balance) => {
                  const employee = initialEmployees.find((e) => e.id === balance.employeeId);
                  const leaveType = leaveTypes.find((lt) => lt.id === balance.leaveTypeId);
                  const projected = calculateProjectedBalance(balance.employeeId, balance.leaveTypeId);

                  return (
                    <tr key={balance.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2 sm:p-3 font-medium">{employee?.name || balance.employeeId}</td>
                      <td className="p-2 sm:p-3">{leaveType?.name || "Unknown"}</td>
                      <td className="p-2 sm:p-3">{balance.openingBalance || 0}</td>
                      <td className="p-2 sm:p-3 hidden sm:table-cell">
                        <span className="text-emerald-600">{balance.accrued || 0}</span>
                      </td>
                      <td className="p-2 sm:p-3 hidden md:table-cell">
                        <span className="text-rose-600">{balance.used || 0}</span>
                      </td>
                      <td className="p-2 sm:p-3 hidden lg:table-cell">
                        <span className="text-cyan-600">{balance.carryForward || 0}</span>
                      </td>
                      <td className="p-2 sm:p-3 hidden xl:table-cell">
                        <span className="text-amber-600">{balance.encashed || 0}</span>
                      </td>
                      <td className="p-2 sm:p-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${balance.balance >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {balance.balance || 0}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3">
                        <div className="flex gap-1.5">
                          <button
                            className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
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
                            <Icon icon="heroicons:pencil" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          {leaveType?.encashment?.enabled && balance.balance > 0 && (
                            <button
                              className="p-1.5 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                              onClick={() => {
                                const days = prompt(`Enter days to encash (Max: ${leaveType.encashment.maxDays}):`);
                                if (days) {
                                  processLeaveEncashment(balance.employeeId, balance.leaveTypeId, parseFloat(days));
                                }
                              }}
                              title="Encash Leave"
                            >
                              <Icon icon="heroicons:currency-dollar" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
  );

  const renderLeaveApplications = () => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:document-text" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span className="hidden xs:inline">Leave Applications & Approval</span>
          <span className="xs:hidden">Applications</span>
        </h5>
        <button
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
          onClick={() => setShowApplicationModal(true)}
        >
          <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
          <span className="hidden xs:inline">New Application</span>
          <span className="xs:hidden">Apply</span>
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
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm bg-white"
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-2 sm:p-3">Employee</th>
                <th className="p-2 sm:p-3">Leave Type</th>
                <th className="p-2 sm:p-3">Dates</th>
                <th className="p-2 sm:p-3">Days</th>
                <th className="p-2 sm:p-3 hidden sm:table-cell">Reason</th>
                <th className="p-2 sm:p-3">Status</th>
                <th className="p-2 sm:p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400">
                    <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No leave applications
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const employee = initialEmployees.find((e) => e.id === app.employeeId);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2 sm:p-3 font-medium">{employee?.name || app.employeeId}</td>
                      <td className="p-2 sm:p-3">
                        {getLeaveTypeBadge(app.leaveTypeName?.substring(0, 2) || 'CL')}
                      </td>
                      <td className="p-2 sm:p-3">
                        <small>
                          {app.startDate}
                          {app.endDate && app.endDate !== app.startDate ? ` - ${app.endDate}` : ""}
                          {app.halfDay && ` (${app.halfDayType} half)`}
                        </small>
                      </td>
                      <td className="p-2 sm:p-3 font-bold">{app.days}</td>
                      <td className="p-2 sm:p-3 hidden sm:table-cell">
                        <small className="text-slate-500">{app.reason || "N/A"}</small>
                      </td>
                      <td className="p-2 sm:p-3">{getStatusBadge(app.status)}</td>
                      <td className="p-2 sm:p-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                            onClick={() => handleApproveApplication(app.id, true)}
                            disabled={app.status === "approved"}
                            title="Approve"
                          >
                            <Icon icon="heroicons:check" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            className="p-1.5 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                            onClick={() => handleApproveApplication(app.id, false)}
                            disabled={app.status === "rejected"}
                            title="Reject"
                          >
                            <Icon icon="heroicons:x-mark" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            className="p-1.5 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                            onClick={() => handleWithdrawApplication(app.id)}
                            title="Withdraw"
                          >
                            <Icon icon="heroicons:minus-circle" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

    return (
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:calendar" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="hidden xs:inline">Leave Calendar & Planning</span>
              <span className="xs:hidden">Calendar</span>
            </h5>
            <div className="flex items-center gap-2">
              <button
                className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => {
                  const prevMonth = new Date(selectedDate);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setSelectedDate(prevMonth);
                }}
              >
                <Icon icon="heroicons:chevron-left" className="w-4 h-4 text-slate-600" />
              </button>
              <span className="text-xs sm:text-sm font-bold text-slate-700 min-w-[120px] text-center">
                {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button
                className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={() => {
                  const nextMonth = new Date(selectedDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setSelectedDate(nextMonth);
                }}
              >
                <Icon icon="heroicons:chevron-right" className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-slate-500 py-1">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              const leaves = getLeavesForDate(day);
              return (
                <div
                  key={index}
                  className={`min-h-[60px] sm:min-h-[80px] border border-slate-200 rounded-lg p-1 sm:p-2 ${day ? 'bg-white' : 'bg-slate-50'} ${leaves.length > 0 ? 'border-blue-200 bg-blue-50/30' : ''}`}
                >
                  {day && (
                    <>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-700">{day}</div>
                      {leaves.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {leaves.slice(0, 2).map((leave) => {
                            const emp = initialEmployees.find((e) => e.id === leave.employeeId);
                            return (
                              <div
                                key={leave.id}
                                className="text-[8px] sm:text-[10px] bg-blue-100 text-blue-700 rounded px-1 truncate"
                                title={`${emp?.name || leave.employeeId} - ${leave.leaveTypeName}`}
                              >
                                {emp?.name?.split(" ")[0] || leave.employeeId}
                              </div>
                            );
                          })}
                          {leaves.length > 2 && (
                            <div className="text-[8px] sm:text-[10px] text-slate-400 font-medium">
                              +{leaves.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCompOff = () => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:gift" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span className="hidden xs:inline">Compensatory Off Management</span>
          <span className="xs:hidden">Comp-Off</span>
        </h5>
        <button
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
          onClick={() => setShowCompOffModal(true)}
        >
          <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
          <span className="hidden xs:inline">Add Comp-Off</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-2 sm:p-3">Employee</th>
                <th className="p-2 sm:p-3">Earned Date</th>
                <th className="p-2 sm:p-3">Hours</th>
                <th className="p-2 sm:p-3 hidden sm:table-cell">Source</th>
                <th className="p-2 sm:p-3 hidden md:table-cell">Policy Type</th>
                <th className="p-2 sm:p-3 hidden lg:table-cell">Expiry</th>
                <th className="p-2 sm:p-3">Status</th>
                <th className="p-2 sm:p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {compOffs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-slate-400">
                    <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No comp-off records
                  </td>
                </tr>
              ) : (
                compOffs.map((co) => {
                  const employee = initialEmployees.find((e) => e.id === co.employeeId);
                  const isExpired = co.expiryDate && new Date(co.expiryDate) < new Date();
                  return (
                    <tr key={co.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2 sm:p-3 font-medium">{employee?.name || co.employeeId}</td>
                      <td className="p-2 sm:p-3">{co.earnedDate}</td>
                      <td className="p-2 sm:p-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          {co.hours} hrs
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 hidden sm:table-cell">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 capitalize">
                          {co.source}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 hidden md:table-cell">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${co.policyType === 'compOff' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {co.policyType === 'compOff' ? 'Comp-Off' : 'Overtime'}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 hidden lg:table-cell">
                        {co.expiryDate ? (
                          <span className={`text-xs ${isExpired ? 'text-rose-600' : 'text-slate-500'}`}>
                            {co.expiryDate}
                            {isExpired && <Icon icon="heroicons:exclamation-triangle" className="w-3 h-3 inline ml-1 text-rose-500" />}
                          </span>
                        ) : (
                          <span className="text-slate-400">No expiry</span>
                        )}
                      </td>
                      <td className="p-2 sm:p-3">
                        {getStatusBadge(co.status === "applied" ? "applied" : isExpired ? "inactive" : "available")}
                      </td>
                      <td className="p-2 sm:p-3 text-right">
                        {co.status === "available" && !co.applied && !isExpired ? (
                          <button
                            className="px-2 sm:px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all"
                            onClick={() => handleApplyCompOff(co.id)}
                          >
                            Apply
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Applied</span>
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

  const renderLeavePlanning = () => {
    const departments = [...new Set(initialEmployees.map(e => e.department))];
    const coverage = selectedDept === "All"
      ? departments.map(dept => calculateLeaveCoverage(dept, planningStartDate, planningEndDate))
      : [calculateLeaveCoverage(selectedDept, planningStartDate, planningEndDate)];

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:calendar-days" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="hidden xs:inline">Leave Planning & Coverage</span>
              <span className="xs:hidden">Planning</span>
            </h5>
            <button
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
              onClick={() => setShowCampaignModal(true)}
            >
              <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
              <span className="hidden xs:inline">Create Campaign</span>
              <span className="xs:hidden">Campaign</span>
            </button>
          </div>

          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={planningStartDate}
                  onChange={(e) => setPlanningStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={planningEndDate}
                  onChange={(e) => setPlanningEndDate(e.target.value)}
                />
              </div>
            </div>

            <h6 className="text-xs font-bold text-slate-800 mb-3">Coverage Analysis</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {coverage.map((cov, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-white">
                  <p className="text-xs font-bold text-blue-600">{selectedDept === "All" ? departments[idx] : selectedDept}</p>
                  <div className="mt-2 text-xs text-slate-500">
                    <p>Total Employees: {cov.totalEmployees}</p>
                    <p>On Leave: {cov.employeesOnLeave}</p>
                  </div>
                  <div className={`mt-2 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${parseFloat(cov.coverage) >= 80 ? 'bg-emerald-100 text-emerald-700' : parseFloat(cov.coverage) >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                    Coverage: {cov.coverage}%
                  </div>
                </div>
              ))}
            </div>

            <h6 className="text-xs font-bold text-slate-800 mb-3">Active Planning Campaigns</h6>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-2 sm:p-3">Campaign Name</th>
                    <th className="p-2 sm:p-3">Period</th>
                    <th className="p-2 sm:p-3">Start Date</th>
                    <th className="p-2 sm:p-3">End Date</th>
                    <th className="p-2 sm:p-3">Department</th>
                    <th className="p-2 sm:p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leavePlanningCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-slate-400">
                        <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        No planning campaigns
                      </td>
                    </tr>
                  ) : (
                    leavePlanningCampaigns.map(campaign => (
                      <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-2 sm:p-3 font-medium">{campaign.name}</td>
                        <td className="p-2 sm:p-3">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 capitalize">{campaign.period}</span>
                        </td>
                        <td className="p-2 sm:p-3">{campaign.startDate}</td>
                        <td className="p-2 sm:p-3">{campaign.endDate}</td>
                        <td className="p-2 sm:p-3">{campaign.targetDepartment}</td>
                        <td className="p-2 sm:p-3">{getStatusBadge(campaign.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderApprovalDelegation = () => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:users" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <span className="hidden xs:inline">Approval Delegation Management</span>
          <span className="xs:hidden">Delegation</span>
        </h5>
        <button
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
          onClick={() => setShowDelegationModal(true)}
        >
          <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
          <span className="hidden xs:inline">Setup Delegation</span>
          <span className="xs:hidden">Delegation</span>
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-2 sm:p-3">From Approver</th>
                <th className="p-2 sm:p-3">To Approver</th>
                <th className="p-2 sm:p-3">Start Date</th>
                <th className="p-2 sm:p-3">End Date</th>
                <th className="p-2 sm:p-3">Reason</th>
                <th className="p-2 sm:p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {approvalDelegations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-400">
                    <Icon icon="heroicons:inbox" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No approval delegations configured
                  </td>
                </tr>
              ) : (
                approvalDelegations.map(delegation => {
                  const isActive = delegation.isActive &&
                    new Date(delegation.startDate) <= new Date() &&
                    new Date(delegation.endDate) >= new Date();
                  return (
                    <tr key={delegation.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2 sm:p-3 font-medium">{delegation.fromApprover}</td>
                      <td className="p-2 sm:p-3">{delegation.toApprover}</td>
                      <td className="p-2 sm:p-3">{delegation.startDate}</td>
                      <td className="p-2 sm:p-3">{delegation.endDate}</td>
                      <td className="p-2 sm:p-3"><small className="text-slate-500">{delegation.reason}</small></td>
                      <td className="p-2 sm:p-3">{getStatusBadge(isActive ? "active" : "inactive")}</td>
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

  return (
    <div className="w-full mx-auto max-w-7xl space-y-4 sm:space-y-6 md:px-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Icon icon="heroicons:calendar-days" className="w-6 h-6 text-blue-600" />
            Leave Management System
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage leave types, balances, applications, calendar, and comp-off
          </p>
        </div>
      </div>

      <div className="border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm rounded-2xl p-1.5 sm:p-2 overflow-x-auto">
        <div className="flex flex-wrap gap-1 min-w-[420px]">
          {[
            { id: "leaveTypes", name: "Leave Types", icon: "heroicons:cog-6-tooth" },
            { id: "balance", name: "Leave Balance", icon: "heroicons:chart-bar" },
            { id: "applications", name: "Applications", icon: "heroicons:document-text" },
            { id: "calendar", name: "Calendar", icon: "heroicons:calendar" },
            { id: "compOff", name: "Comp-Off", icon: "heroicons:gift" },
            { id: "planning", name: "Planning", icon: "heroicons:calendar-days" },
            { id: "delegation", name: "Delegation", icon: "heroicons:users" },
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
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {activeTab === "leaveTypes" && renderLeaveTypes()}
        {activeTab === "balance" && renderLeaveBalance()}
        {activeTab === "applications" && renderLeaveApplications()}
        {activeTab === "calendar" && renderLeaveCalendar()}
        {activeTab === "compOff" && renderCompOff()}
        {activeTab === "planning" && renderLeavePlanning()}
        {activeTab === "delegation" && renderApprovalDelegation()}
      </div>

      {showLeaveTypeModal && (
        <LeaveTypeModal
          isOpen={showLeaveTypeModal}
          onClose={() => {
            setShowLeaveTypeModal(false);
            setEditingLeaveType(null);
          }}
          editingLeaveType={editingLeaveType}
          leaveTypeForm={leaveTypeForm}
          setLeaveTypeForm={setLeaveTypeForm}
          handleAddLeaveType={handleAddLeaveType}
        />
      )}

      {showApplicationModal && (
        <LeaveApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          applicationForm={applicationForm}
          setApplicationForm={setApplicationForm}
          handleSubmitApplication={handleSubmitApplication}
          employees={initialEmployees}
          leaveTypes={leaveTypes}
        />
      )}

      {showBalanceModal && (
        <LeaveBalanceModal
          isOpen={showBalanceModal}
          onClose={() => setShowBalanceModal(false)}
          balanceForm={balanceForm}
          setBalanceForm={setBalanceForm}
          handleAddBalance={handleAddBalance}
          employees={initialEmployees}
          leaveTypes={leaveTypes}
        />
      )}

      {showCompOffModal && (
        <CompOffModal
          isOpen={showCompOffModal}
          onClose={() => setShowCompOffModal(false)}
          compOffForm={compOffForm}
          setCompOffForm={setCompOffForm}
          handleAddCompOff={handleAddCompOff}
          employees={initialEmployees}
        />
      )}

      {showCampaignModal && (
        <LeaveCampaignModal
          isOpen={showCampaignModal}
          onClose={() => setShowCampaignModal(false)}
          campaignForm={campaignForm}
          setCampaignForm={setCampaignForm}
          handleCreateCampaign={handleCreateCampaign}
          departments={[...new Set(initialEmployees.map(e => e.department))]}
        />
      )}

      {showDelegationModal && (
        <LeaveDelegationModal
          isOpen={showDelegationModal}
          onClose={() => setShowDelegationModal(false)}
          delegationForm={delegationForm}
          setDelegationForm={setDelegationForm}
          setupApprovalDelegation={setupApprovalDelegation}
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

export default LeaveManagement;