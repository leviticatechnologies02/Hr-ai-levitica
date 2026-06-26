import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import StatCard from '../../../shared/components/StatCard';
import EmployeeDetailModal from '../modal/EmployeeDetailsModal';
import CalendarModal from '../modal/CalendarModal';
import VarianceModal from '../modal/VarianceModal';
import InterventionModal from '../modal/InterventionModal';
import HoldSalaryModal from '../modal/HoldSalaryModal';
import DetailsModal from '../modal/DetailsModal';
import PayrollRunModal from '../modal/PayrollRunModal';
import PayrollConfigModal from '../modal/PayrollConfigModal';

const PayrollProcessingEngine = () => {
  const [activeSection, setActiveSection] = useState('configuration');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [payrollLocked, setPayrollLocked] = useState(false);

  const [showRunModal, setShowRunModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showVarianceModal, setShowVarianceModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showHoldSalaryModal, setShowHoldSalaryModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [payrollConfig, setPayrollConfig] = useState({
    cycleType: 'monthly',
    payPeriod: 'standard_month',
    customStartDate: '',
    customEndDate: '',
    salaryFreezeDate: '',
    payrollSchedule: { processingDay: 25, paymentDay: 30 },
    payrollCalendar: [],
    advanceScheduling: { enabled: false, advanceDays: 7 },
    offCycleEnabled: true,
    salesConfig: { commissionEnabled: true, commissionRate: 5, bonusThreshold: 100000 },
    statutorySettings: { taxEnabled: true, epfEnabled: true, esiEnabled: true, tdsEnabled: true }
  });

  const [payrollRuns, setPayrollRuns] = useState([]);
  const [currentPayrollRun, setCurrentPayrollRun] = useState(null);
  const [validationResults, setValidationResults] = useState([]);
  const [calculationResults, setCalculationResults] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [salaryComponents, setSalaryComponents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [arrearsData, setArrearsData] = useState([]);
  const [heldEmployees, setHeldEmployees] = useState([]);
  const [salaryRevisions, setSalaryRevisions] = useState([]);
  const [previousMonthPayroll, setPreviousMonthPayroll] = useState(null);
  const [varianceAlerts, setVarianceAlerts] = useState([]);
  const [manualInterventions, setManualInterventions] = useState([]);
  const [approvalWorkflow, setApprovalWorkflow] = useState([]);

  const [calculationSettings, setCalculationSettings] = useState({
    daysCalculation: true,
    daysCalculationMethod: 'days_worked',
    prorateCalculation: true,
    prorateForJoiners: true,
    prorateForExits: true,
    prorateForTransfers: true,
    leaveEncashment: false,
    leaveEncashmentRate: 1.0,
    overtimeCalculation: true,
    overtimeRate: 1.5,
    lossOfPayCalculation: true,
    lossOfPayThreshold: 0.5,
    arrearsCalculation: true,
    arrearsInclusion: 'previous_month',
    reimbursementProcessing: true,
    loanRecovery: true,
    advanceRecovery: true,
    finalSettlement: true,
    componentDependencies: true,
    taxDependencies: true,
    statutoryDependencies: true,
    salaryRevisionEffectuation: true
  });

  const itemsPerPage = 6;

  const kpis = useMemo(() => {
    const pendingApprovals = approvalWorkflow.filter(a => a.status === 'pending').length;
    const failedValidations = validationResults.filter(v => v.status === 'failed').length;
    const completedRuns = payrollRuns.filter(r => r.status === 'completed').length;
    const inProgressRuns = payrollRuns.filter(r => r.status === 'processing').length;

    return {
      pendingApprovals,
      failedValidations,
      completedRuns,
      inProgressRuns,
      totalEmployees: employees.length,
      totalAmount: payrollRuns.reduce((sum, run) => sum + (run.totalAmount || 0), 0)
    };
  }, [approvalWorkflow, validationResults, payrollRuns, employees]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setPayrollRuns([]);
    setValidationResults([]);
    setEmployees([]);
    setSalaryComponents([]);
    setAttendanceData([]);
    setLeaveData([]);
    setLoanData([]);
    setReimbursements([]);
    setArrearsData([]);
    setHeldEmployees([]);
    setSalaryRevisions([]);
    setPreviousMonthPayroll(null);
    setVarianceAlerts([]);
    setManualInterventions([]);
    setApprovalWorkflow([]);
    setCalculationResults([]);
    setIsLoading(false);
  };

  const getStatusBadge = (status) => {
    const config = {
      'completed': { label: 'Completed', color: 'emerald' },
      'processing': { label: 'Processing', color: 'amber' },
      'pending': { label: 'Pending', color: 'blue' },
      'failed': { label: 'Failed', color: 'rose' },
      'passed': { label: 'Passed', color: 'emerald' },
      'warning': { label: 'Warning', color: 'amber' },
      'approved': { label: 'Approved', color: 'emerald' },
      'rejected': { label: 'Rejected', color: 'rose' },
      'locked': { label: 'Locked', color: 'gray' },
      'unlocked': { label: 'Unlocked', color: 'emerald' },
      'calculated': { label: 'Calculated', color: 'emerald' },
      'scheduled': { label: 'Scheduled', color: 'blue' },
    };
    const { label, color } = config[status] || { label: status || 'Unknown', color: 'gray' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const config = {
      'regular': { label: 'Regular', color: 'blue' },
      'off-cycle': { label: 'Off-Cycle', color: 'purple' },
      'bonus': { label: 'Bonus', color: 'emerald' },
      'advance': { label: 'Advance', color: 'amber' },
      'settlement': { label: 'Settlement', color: 'rose' }
    };
    const { label, color } = config[type] || { label: type || 'N/A', color: 'gray' };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleRunPayroll = () => {
    if (payrollLocked) {
      toast.error('Payroll is locked. Please unlock to run payroll.');
      return;
    }
    setShowRunModal(true);
  };

  const handleStartPayrollProcessing = (type = 'regular') => {
    if (payrollLocked) {
      toast.error('Payroll is locked. Please unlock to run payroll.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newRun = {
        id: `PAY${String(payrollRuns.length + 1).padStart(3, '0')}`,
        month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        status: 'processing',
        totalAmount: 1250000,
        employeesCount: 85,
        processedDate: new Date().toISOString().split('T')[0],
        paidDate: '',
        type: type,
        details: {
          totalEarnings: 1500000,
          totalDeductions: 250000,
          taxAmount: 150000,
          pfAmount: 75000,
          esiAmount: 25000,
          arrearsIncluded: 0,
          loanEMI: 5000,
          advanceRecovery: 2000,
          heldEmployeesCount: 0
        }
      };

      setPayrollRuns([newRun, ...payrollRuns]);
      setCurrentPayrollRun(newRun);
      setShowRunModal(false);
      setIsProcessing(false);

      const newApproval = {
        id: approvalWorkflow.length + 1,
        payrollId: newRun.id,
        approver: 'Finance Manager',
        role: 'Finance',
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
        comments: 'Awaiting review'
      };

      setApprovalWorkflow([newApproval, ...approvalWorkflow]);
      toast.success(`Payroll ${type} run started successfully!`);
    }, 2000);
  };

  const handleApprovePayroll = (approvalId) => {
    setApprovalWorkflow(approvalWorkflow.map(approval =>
      approval.id === approvalId
        ? {
          ...approval,
          status: 'approved',
          approvedDate: new Date().toISOString().split('T')[0],
          comments: 'Approved by Finance Manager'
        }
        : approval
    ));

    const approval = approvalWorkflow.find(a => a.id === approvalId);
    if (approval) {
      const relatedApprovals = approvalWorkflow.filter(a => a.payrollId === approval.payrollId);
      const allApproved = relatedApprovals.every(a => a.status === 'approved');

      if (allApproved) {
        setPayrollRuns(runs =>
          runs.map(run =>
            run.id === approval.payrollId
              ? { ...run, status: 'completed', paidDate: new Date().toISOString().split('T')[0] }
              : run
          )
        );
      }
    }
    toast.success('Payroll approved successfully!');
  };

  const handleRejectPayroll = (approvalId) => {
    const comment = window.prompt('Please enter rejection reason:');
    if (!comment) return;

    setApprovalWorkflow(approvalWorkflow.map(approval =>
      approval.id === approvalId
        ? {
          ...approval,
          status: 'rejected',
          rejectedDate: new Date().toISOString().split('T')[0],
          comments: comment
        }
        : approval
    ));
    toast.info('Payroll rejected!');
  };

  const handleTogglePayrollLock = () => {
    const newLockedState = !payrollLocked;
    setPayrollLocked(newLockedState);
    toast.success(`Payroll ${newLockedState ? 'locked' : 'unlocked'} successfully!`);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadInitialData();
      setCurrentPage(1);
      setSearchTerm('');
      setFilterType('All');
      toast.info('Data refreshed successfully');
      setIsLoading(false);
    }, 1000);
  };

  const handleExportReport = () => {
    toast.info('Export functionality would download data as CSV');
  };

  const getFilteredData = () => {
    let data = [];
    const lowerSearch = searchTerm.toLowerCase();

    switch (activeSection) {
      case 'runs':
        data = payrollRuns.filter(item =>
          item.month?.toLowerCase().includes(lowerSearch) ||
          item.id?.toLowerCase().includes(lowerSearch)
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'validation':
        data = validationResults.filter(item =>
          item.checkName?.toLowerCase().includes(lowerSearch) ||
          item.description?.toLowerCase().includes(lowerSearch)
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'approvals':
        data = approvalWorkflow.filter(item =>
          item.approver?.toLowerCase().includes(lowerSearch) ||
          item.payrollId?.toLowerCase().includes(lowerSearch)
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'employees':
        data = employees.filter(item =>
          item.name?.toLowerCase().includes(lowerSearch) ||
          item.department?.toLowerCase().includes(lowerSearch)
        );
        break;
      default:
        data = [];
    }
    return data;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const menuItems = [
    { id: 'configuration', label: 'Configuration', icon: 'heroicons:cog' },
    { id: 'runs', label: 'Payroll Runs', icon: 'heroicons:play-circle', badge: kpis.inProgressRuns },
    { id: 'validation', label: 'Validation', icon: 'heroicons:shield-check', badge: kpis.failedValidations },
    { id: 'calculations', label: 'Calculations', icon: 'heroicons:calculator' },
    { id: 'approvals', label: 'Approvals', icon: 'heroicons:document-check', badge: kpis.pendingApprovals },
    { id: 'employees', label: 'Employee Data', icon: 'heroicons:users' },
    { id: 'reports', label: 'Reports & Analytics', icon: 'heroicons:chart-bar' },
  ];

  const renderTopActions = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <div className="relative flex-1 min-w-[120px]">
        <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full h-8 sm:h-10 pl-8 sm:pl-10 pr-3 sm:pr-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
        />
      </div>

      <div className="relative flex-1 min-w-[120px]">
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
          className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
        >
          <option value="All">All</option>
          {activeSection === 'runs' && (
            <>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
            </>
          )}
          {activeSection === 'validation' && (
            <>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </>
          )}
          {activeSection === 'approvals' && (
            <>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </>
          )}
        </select>
        <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
      </div>

      <button
        onClick={handleRefreshData}
        className="px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
      >
        <Icon icon="heroicons:arrow-path" className="w-3 h-3 sm:w-4 sm:h-4" />
        Refresh
      </button>

      <button
        onClick={handleExportReport}
        className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
      >
        <Icon icon="heroicons:document-arrow-down" className="w-3 h-3 sm:w-4 sm:h-4" />
        Export
      </button>
    </div>
  );

  const renderPagination = (total, page, listLength) => (
    <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-[10px] sm:text-xs text-slate-500">
        Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, listLength)} of {listLength} items
      </div>
      <nav className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon icon="heroicons:chevron-left" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
        </button>
        {[...Array(Math.min(total, 5))].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={i}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-semibold transition ${currentPage === pageNum
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/15'
                : 'hover:bg-slate-50 text-slate-600'
                }`}
            >
              {pageNum}
            </button>
          );
        })}
        {total > 5 && <span className="text-slate-400 text-xs">...</span>}
        <button
          onClick={() => setCurrentPage(p => Math.min(total, p + 1))}
          disabled={page === total}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon icon="heroicons:chevron-right" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
        </button>
      </nav>
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
      <StatCard title="Total Employees" value={kpis.totalEmployees} subtitle="Active workforce" icon="heroicons:users" color="blue" />
      <StatCard title="Pending Approvals" value={kpis.pendingApprovals} subtitle="Awaiting action" icon="heroicons:document-check" color="yellow" />
      <StatCard title="Failed Validations" value={kpis.failedValidations} subtitle="Need attention" icon="heroicons:exclamation-triangle" color="red" />
      <StatCard title="Completed Runs" value={kpis.completedRuns} subtitle="Successful payrolls" icon="heroicons:check-circle" color="green" />
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-sm font-bold text-slate-800">Payroll Configuration</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleTogglePayrollLock}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1 ${payrollLocked
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
          >
            <Icon icon={payrollLocked ? "heroicons:lock-open" : "heroicons:lock-closed"} className="w-3 h-3 sm:w-4 sm:h-4" />
            {payrollLocked ? 'Unlock Payroll' : 'Lock Payroll'}
          </button>
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
          >
            <Icon icon="heroicons:pencil" className="w-3 h-3 sm:w-4 sm:h-4" />
            Configure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Payroll Cycle Settings</h6>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Cycle Type</span>
              <span className="font-medium text-slate-800 capitalize">{payrollConfig.cycleType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Pay Period</span>
              <span className="font-medium text-slate-800 capitalize">{payrollConfig.payPeriod.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Processing Day</span>
              <span className="font-medium text-slate-800">{payrollConfig.payrollSchedule.processingDay}th</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Payment Day</span>
              <span className="font-medium text-slate-800">{payrollConfig.payrollSchedule.paymentDay}th</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Off-cycle Payroll</span>
              <span className={`font-medium ${payrollConfig.offCycleEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {payrollConfig.offCycleEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Advance Scheduling</span>
              <span className={`font-medium ${payrollConfig.advanceScheduling.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {payrollConfig.advanceScheduling.enabled ? `${payrollConfig.advanceScheduling.advanceDays} days` : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Statutory & Compliance</h6>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tax Calculation</span>
              <span className={`font-medium ${payrollConfig.statutorySettings.taxEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {payrollConfig.statutorySettings.taxEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">EPF Contribution</span>
              <span className={`font-medium ${payrollConfig.statutorySettings.epfEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {payrollConfig.statutorySettings.epfEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">ESI Contribution</span>
              <span className={`font-medium ${payrollConfig.statutorySettings.esiEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {payrollConfig.statutorySettings.esiEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">TDS Deduction</span>
              <span className={`font-medium ${payrollConfig.statutorySettings.tdsEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {payrollConfig.statutorySettings.tdsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Sales Commission</span>
              <span className={`font-medium ${payrollConfig.salesConfig.commissionEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {payrollConfig.salesConfig.commissionEnabled ? `${payrollConfig.salesConfig.commissionRate}%` : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Salary Components</h6>
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
          >
            <Icon icon="heroicons:plus" className="w-3 h-3" />
            Add Component
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
              <tr>
                <th className="p-3 text-left min-w-[140px]">Component</th>
                <th className="p-3 text-left min-w-[100px]">Type</th>
                <th className="p-3 text-left min-w-[100px]">Calculation</th>
                <th className="p-3 text-center min-w-[100px]">Value</th>
                <th className="p-3 text-center min-w-[100px]">Taxable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salaryComponents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    <Icon icon="heroicons:cube" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">No components configured</p>
                  </td>
                </tr>
              ) : (
                salaryComponents.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-medium text-slate-700">{comp.name}</td>
                    <td className="p-3">{getTypeBadge(comp.type)}</td>
                    <td className="p-3 text-slate-600 capitalize">{comp.calculation}</td>
                    <td className="p-3 text-center font-semibold text-slate-700">
                      {comp.calculation === 'percentage' ? `${comp.value}%` : formatCurrency(comp.value)}
                    </td>
                    <td className="p-3 text-center">
                      {comp.taxable ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Yes</span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">No</span>
                      )}
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

  const renderPayrollRuns = () => {
    const { data, total, page } = { data: paginatedData, total: totalPages, page: currentPage };

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">Payroll Runs</h3>
          <div className="flex flex-wrap items-center gap-2">
            {renderTopActions()}
            <button
              onClick={handleRunPayroll}
              disabled={isProcessing || payrollLocked}
              className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="heroicons:play" className="w-3 h-3 sm:w-4 sm:h-4" />
              Run Payroll
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 text-left min-w-[80px]">ID</th>
                  <th className="p-3 text-left min-w-[120px]">Month</th>
                  <th className="p-3 text-left min-w-[100px] hidden sm:table-cell">Type</th>
                  <th className="p-3 text-center min-w-[80px] hidden md:table-cell">Employees</th>
                  <th className="p-3 text-center min-w-[120px]">Amount</th>
                  <th className="p-3 text-center min-w-[100px]">Status</th>
                  <th className="p-3 text-center min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.length > 0 ? (
                  data.map((run) => (
                    <tr key={run.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-medium text-slate-700">{run.id}</td>
                      <td className="p-3 text-slate-600">{run.month}</td>
                      <td className="p-3 hidden sm:table-cell">{getTypeBadge(run.type)}</td>
                      <td className="p-3 text-center hidden md:table-cell text-slate-600">{run.employeesCount}</td>
                      <td className="p-3 text-center font-semibold text-slate-700">{formatCurrency(run.totalAmount)}</td>
                      <td className="p-3 text-center">{getStatusBadge(run.status)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleViewDetails(run)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                            title="View"
                          >
                            <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                          </button>
                          {run.status === 'completed' && (
                            <button className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition" title="Export">
                              <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-400">
                      <Icon icon="heroicons:play-circle" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">No payroll runs found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {total > 1 && renderPagination(total, page, filteredData.length)}
        </div>
      </div>
    );
  };

  const renderValidation = () => {
    const { data, total, page } = { data: paginatedData, total: totalPages, page: currentPage };

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">Validation Results</h3>
          {renderTopActions()}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 text-left min-w-[180px]">Check Name</th>
                  <th className="p-3 text-left min-w-[100px]">Status</th>
                  <th className="p-3 text-left min-w-[200px] hidden md:table-cell">Description</th>
                  <th className="p-3 text-center min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.length > 0 ? (
                  data.map((check) => (
                    <tr key={check.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${check.status === 'passed' ? 'bg-emerald-500' :
                            check.status === 'failed' ? 'bg-rose-500' :
                              check.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                          <span className="font-medium text-slate-700">{check.checkName}</span>
                        </div>
                      </td>
                      <td className="p-3">{getStatusBadge(check.status)}</td>
                      <td className="p-3 hidden md:table-cell text-slate-600">{check.description}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleViewDetails(check)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                          title="View"
                        >
                          <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400">
                      <Icon icon="heroicons:shield-check" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">No validation results found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {total > 1 && renderPagination(total, page, filteredData.length)}
        </div>
      </div>
    );
  };

  const renderCalculations = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-sm font-bold text-slate-800">Payroll Calculations</h3>
        <div className="flex flex-wrap gap-2">
          {renderTopActions()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Calculation Settings</h6>
          <div className="space-y-2">
            {[
              { key: 'daysCalculation', label: 'Days Worked Calculation' },
              { key: 'prorateCalculation', label: 'Prorate Salary' },
              { key: 'leaveEncashment', label: 'Leave Encashment' },
              { key: 'overtimeCalculation', label: 'Overtime Pay' },
              { key: 'arrearsCalculation', label: 'Arrears Payment' },
              { key: 'reimbursementProcessing', label: 'Reimbursements' },
              { key: 'loanRecovery', label: 'Loan Recovery' },
              { key: 'advanceRecovery', label: 'Advance Recovery' },
              { key: 'finalSettlement', label: 'Final Settlement' },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600">{setting.label}</span>
                <span className={`text-sm font-medium ${calculationSettings[setting.key] ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {calculationSettings[setting.key] ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Calculation Results</h6>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="p-2 font-semibold text-slate-600">Employee</th>
                  <th className="p-2 font-semibold text-slate-600 text-right">Net Salary</th>
                  <th className="p-2 font-semibold text-slate-600 text-right hidden sm:table-cell">Tax</th>
                  <th className="p-2 font-semibold text-slate-600 text-right hidden md:table-cell">PF</th>
                  <th className="p-2 font-semibold text-slate-600 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculationResults.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400">
                      <Icon icon="heroicons:calculator" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">No calculations performed</p>
                    </td>
                  </tr>
                ) : (
                  calculationResults.slice(0, 6).map((result) => (
                    <tr key={result.employeeId} className="hover:bg-slate-50">
                      <td className="p-2">
                        <div className="font-medium text-slate-700">{result.name}</div>
                        <div className="text-[10px] text-slate-400">{result.employeeId}</div>
                      </td>
                      <td className="p-2 text-right font-semibold text-emerald-600">{formatCurrency(result.netSalary)}</td>
                      <td className="p-2 text-right hidden sm:table-cell text-slate-600">{formatCurrency(result.tax)}</td>
                      <td className="p-2 text-right hidden md:table-cell text-slate-600">{formatCurrency(result.pf)}</td>
                      <td className="p-2 text-center">{getStatusBadge(result.status)}</td>
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

  const renderApprovals = () => {
    const { data, total, page } = { data: paginatedData, total: totalPages, page: currentPage };

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">Approval Workflow</h3>
          {renderTopActions()}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 text-left min-w-[100px]">Payroll ID</th>
                  <th className="p-3 text-left min-w-[140px]">Approver</th>
                  <th className="p-3 text-left min-w-[100px] hidden sm:table-cell">Role</th>
                  <th className="p-3 text-center min-w-[100px]">Status</th>
                  <th className="p-3 text-center min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.length > 0 ? (
                  data.map((approval) => (
                    <tr key={approval.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-medium text-slate-700">{approval.payrollId}</td>
                      <td className="p-3 text-slate-600">{approval.approver}</td>
                      <td className="p-3 hidden sm:table-cell">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {approval.role}
                        </span>
                      </td>
                      <td className="p-3 text-center">{getStatusBadge(approval.status)}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {approval.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprovePayroll(approval.id)}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                title="Approve"
                              >
                                <Icon icon="heroicons:check" className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleRejectPayroll(approval.id)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                title="Reject"
                              >
                                <Icon icon="heroicons:x-mark" className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleViewDetails(approval)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                            title="View"
                          >
                            <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400">
                      <Icon icon="heroicons:document-check" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">No approvals found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {total > 1 && renderPagination(total, page, filteredData.length)}
        </div>
      </div>
    );
  };

  const renderEmployeeData = () => {
    const { data, total, page } = { data: paginatedData, total: totalPages, page: currentPage };

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">Employee Data</h3>
          {renderTopActions()}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 text-left min-w-[140px]">Employee</th>
                  <th className="p-3 text-left min-w-[120px] hidden sm:table-cell">Department</th>
                  <th className="p-3 text-center min-w-[120px]">Base Salary</th>
                  <th className="p-3 text-center min-w-[100px] hidden md:table-cell">Type</th>
                  <th className="p-3 text-center min-w-[100px]">Status</th>
                  <th className="p-3 text-center min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.length > 0 ? (
                  data.map((employee) => (
                    <tr key={employee.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{employee.name}</div>
                        <div className="text-[10px] text-slate-400">{employee.id}</div>
                      </td>
                      <td className="p-3 hidden sm:table-cell text-slate-600">{employee.department}</td>
                      <td className="p-3 text-center font-semibold text-slate-700">{formatCurrency(employee.baseSalary)}</td>
                      <td className="p-3 text-center hidden md:table-cell">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {employee.employmentType}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {employee.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowEmployeeModal(true);
                            }}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                            title="View"
                          >
                            <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                          </button>
                          <button className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition" title="Adjust Salary">
                            <Icon icon="heroicons:pencil" className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      <Icon icon="heroicons:users" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-slate-600">No employees found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {total > 1 && renderPagination(total, page, filteredData.length)}
        </div>
      </div>
    );
  };

  const renderReports = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800">Reports & Analytics</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Monthly Payroll Summary', icon: 'heroicons:currency-dollar', color: 'blue', desc: 'Complete summary of monthly payroll' },
          { title: 'Tax Compliance Report', icon: 'heroicons:document-check', color: 'emerald', desc: 'Tax calculations and compliance details' },
          { title: 'Department-wise Analysis', icon: 'heroicons:chart-bar', color: 'purple', desc: 'Payroll analysis by department' },
          { title: 'Employee Earnings Statement', icon: 'heroicons:user-circle', color: 'amber', desc: 'Detailed earnings statement per employee' },
          { title: 'Statutory Compliance Report', icon: 'heroicons:shield-check', color: 'rose', desc: 'PF, ESI, PT, and other statutory reports' },
          { title: 'Year-to-Date Analysis', icon: 'heroicons:chart-pie', color: 'cyan', desc: 'Complete YTD payroll analysis' },
        ].map((report, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm md:p-4 p-3 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${report.color}-50`}>
                <Icon icon={report.icon} className={`w-5 h-5 text-${report.color}-600`} />
              </div>
              <div className="flex-1">
                <h6 className="text-sm font-semibold text-slate-800">{report.title}</h6>
                <p className="text-xs text-slate-500">{report.desc}</p>
              </div>
              <button
                onClick={() => toast.info(`Generating ${report.title}`)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'configuration': return renderConfiguration();
      case 'runs': return renderPayrollRuns();
      case 'validation': return renderValidation();
      case 'calculations': return renderCalculations();
      case 'approvals': return renderApprovals();
      case 'employees': return renderEmployeeData();
      case 'reports': return renderReports();
      default: return renderConfiguration();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 min-h-screen pb-8 sm:pb-10">
      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
              <Icon icon="heroicons:cog" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
                Payroll Processing Engine
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 flex flex-wrap items-center gap-1 sm:gap-2">
                <span>Automated payroll processing</span>
                <span className="w-0.5 h-0.5 rounded-full bg-slate-300 hidden xs:inline"></span>
                <span className="hidden xs:inline">Configuration, calculation, validation & approval</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${payrollLocked
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
              <div className={`w-2 h-2 rounded-full ${payrollLocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              {payrollLocked ? 'Locked' : 'Active'}
            </div>
            <button
              onClick={handleTogglePayrollLock}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1 ${payrollLocked
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
            >
              <Icon icon={payrollLocked ? "heroicons:lock-open" : "heroicons:lock-closed"} className="w-3 h-3 sm:w-4 sm:h-4" />
              {payrollLocked ? 'Unlock' : 'Lock'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {renderStats()}

      <button
        className="w-full sm:hidden flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        <span className="text-sm font-semibold text-slate-700">
          {menuItems.find(item => item.id === activeSection)?.label || 'Menu'}
        </span>
        <Icon icon={showMobileMenu ? "heroicons:chevron-up" : "heroicons:chevron-down"} className="w-5 h-5 text-slate-400" />
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className={`${showMobileMenu ? 'block' : 'hidden'} sm:block sm:col-span-3 lg:col-span-2`}>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeSection === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  onClick={() => { setActiveSection(item.id); setShowMobileMenu(false); }}
                >
                  <Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="sm:col-span-9 lg:col-span-10">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 sm:p-4 md:p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-xs text-slate-500 mt-2">Loading...</p>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>

      <PayrollRunModal
        isOpen={showRunModal}
        onClose={() => setShowRunModal(false)}
        onSubmit={handleStartPayrollProcessing}
        isProcessing={isProcessing}
        payrollLocked={payrollLocked}
      />

      <PayrollConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSubmit={(data) => {
          setPayrollConfig(data);
          toast.success('Configuration updated successfully');
          setShowConfigModal(false);
        }}
        config={payrollConfig}
        payrollLocked={payrollLocked}
      />

      <EmployeeDetailModal
        isOpen={showEmployeeModal}
        onClose={() => { setShowEmployeeModal(false); setSelectedEmployee(null); }}
        employee={selectedEmployee}
        calculationResults={calculationResults}
        formatCurrency={formatCurrency}
      />

      <CalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        calendar={payrollConfig.payrollCalendar}
      />

      <VarianceModal
        isOpen={showVarianceModal}
        onClose={() => setShowVarianceModal(false)}
        variances={varianceAlerts}
        previousMonth={previousMonthPayroll}
        formatCurrency={formatCurrency}
      />

      <InterventionModal
        isOpen={showInterventionModal}
        onClose={() => setShowInterventionModal(false)}
        interventions={manualInterventions}
        onResolve={(id) => {
          setManualInterventions(prev => prev.map(m =>
            m.id === id ? { ...m, status: 'resolved' } : m
          ));
          toast.success('Intervention resolved');
        }}
      />

      <HoldSalaryModal
        isOpen={showHoldSalaryModal}
        onClose={() => setShowHoldSalaryModal(false)}
        heldEmployees={heldEmployees}
        onRelease={(id) => {
          setHeldEmployees(prev => prev.filter(h => h.id !== id));
          toast.success('Salary hold released');
        }}
      />

      <DetailsModal
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedItem(null); }}
        item={selectedItem}
        section={activeSection}
        getStatusBadge={getStatusBadge}
        getTypeBadge={getTypeBadge}
        formatCurrency={formatCurrency}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        className="text-xs sm:text-sm"
        toastClassName="rounded-xl shadow-lg"
      />
    </div>
  );
};

export default PayrollProcessingEngine;