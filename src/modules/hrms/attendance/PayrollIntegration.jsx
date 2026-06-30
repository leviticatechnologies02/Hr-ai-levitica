import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import CorrectionModal from '../modal/CorrectionModal';
import DetailsModal from '../modal/DetailsModal';
import ExportModal from '../modal/ExportModal';
import RuleEditModal from '../modal/RuleEditModal';
import SettingsModal from '../modal/SettingsModal';

const PayrollIntegration = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('payroll-admin');
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [filters, setFilters] = useState({
    period: 'current-month',
    department: 'all',
    location: 'all',
    employee: 'all',
    status: 'all'
  });

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [integrationStatus, setIntegrationStatus] = useState({
    attendanceSync: { status: '', lastSync: '', syncFrequency: '' },
    payrollSync: { status: '', lastSync: '', syncFrequency: '' },
    dataFreshness: { status: '', hoursAgo: 0, latency: '' }
  });
  const [alerts, setAlerts] = useState([]);
  const [freezeStatus, setFreezeStatus] = useState({
    isFrozen: false,
    freezeStartDate: '',
    freezeEndDate: '',
    frozenBy: ''
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentStep, setCurrentStep] = useState(2);
  const [correctionForm, setCorrectionForm] = useState({
    employeeId: '',
    date: '',
    correctionType: 'Status Change',
    originalValue: '',
    correctedValue: '',
    reason: '',
    impact: 0
  });

  const [calculationRules, setCalculationRules] = useState([]);
  const [editingRule, setEditingRule] = useState(null);
  const [integrationSettings, setIntegrationSettings] = useState({
    apiEndpoint: '',
    apiKey: '',
    webhookUrl: '',
    autoBackup: true,
    auditLogging: true
  });

  const openModal = (type, data = null) => {
    setModalState({ type, isOpen: true, data });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false, data: null });
  };

  const showNotification = (message, type = 'success') => {
    const options = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      default:
        toast(message, options);
    }
  };

  const formatCurrency = (amount) => {
    if (amount == null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      'processed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'pending': 'bg-amber-50 text-amber-700 border border-amber-200',
      'frozen': 'bg-blue-50 text-blue-700 border border-blue-200',
      'error': 'bg-rose-50 text-rose-700 border border-rose-200',
      'active': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'inactive': 'bg-slate-50 text-slate-700 border border-slate-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : 'N/A'}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      'high': 'bg-rose-50 text-rose-700 border border-rose-200',
      'medium': 'bg-amber-50 text-amber-700 border border-amber-200',
      'low': 'bg-blue-50 text-blue-700 border border-blue-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {priority || 'N/A'}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      'regular': 'bg-blue-50 text-blue-700 border border-blue-200',
      'bonus': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'advance': 'bg-amber-50 text-amber-700 border border-amber-200',
      'settlement': 'bg-purple-50 text-purple-700 border border-purple-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {type || 'N/A'}
      </span>
    );
  };

  const kpis = useMemo(() => {
    const totalEmployees = payrollData.length;
    const totalNetPay = payrollData.reduce((sum, x) => sum + (x.netPay || 0), 0);
    const totalLossOfPay = payrollData.reduce((sum, x) => sum + (x.lossOfPay || 0), 0);
    const totalOvertimePay = payrollData.reduce((sum, x) => sum + (x.overtimePay || 0), 0);
    const totalCorrections = payrollData.filter(x => x.status === 'pending').length;
    const avgOvertimeHours = totalEmployees > 0 ? payrollData.reduce((sum, x) => sum + (x.totalOvertime || 0), 0) / totalEmployees : 0;
    const leaveWithoutPayTotal = payrollData.reduce((sum, x) => sum + (x.leaveWithoutPayDeduction || 0), 0);

    return {
      totalEmployees,
      totalNetPay,
      totalLossOfPay,
      totalOvertimePay,
      totalCorrections,
      avgOvertimeHours: parseFloat(avgOvertimeHours.toFixed(1)),
      totalDeductions: parseFloat((totalLossOfPay + leaveWithoutPayTotal).toFixed(2)),
      totalAdditions: parseFloat((totalOvertimePay + 0).toFixed(2)),
      syncStatus: integrationStatus.dataFreshness?.status || 'unknown'
    };
  }, [payrollData, integrationStatus]);

  const loadInitialData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const filteredData = useMemo(() => {
    let data = [...payrollData];

    if (filters.department !== 'all') {
      data = data.filter(item => item.department === filters.department);
    }
    if (filters.location !== 'all') {
      data = data.filter(item => item.location === filters.location);
    }
    if (filters.status !== 'all') {
      data = data.filter(item => item.status === filters.status);
    }
    if (search) {
      const query = search.toLowerCase();
      data = data.filter(item =>
        item.employeeName.toLowerCase().includes(query) ||
        item.employeeId.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
      );
    }

    return data;
  }, [payrollData, filters, search]);

  const handleToggleFreeze = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (freezeStatus.isFrozen) {
      setFreezeStatus(prev => ({ ...prev, isFrozen: false, freezeStartDate: '', freezeEndDate: '', frozenBy: '' }));
      showNotification('Attendance data unfrozen successfully', 'success');
    } else {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 3);
      setFreezeStatus({
        isFrozen: true,
        freezeStartDate: today.toISOString().split('T')[0],
        freezeEndDate: endDate.toISOString().split('T')[0],
        frozenBy: 'Admin User'
      });
      showNotification('Attendance data frozen for payroll processing', 'warning');
    }
    setIsLoading(false);
  };

  const handleRunPayroll = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPayrollData(prev => prev.map(item => ({
      ...item,
      status: 'processed',
      processedBy: 'System Admin',
      processedDate: new Date().toISOString().split('T')[0]
    })));
    setIsLoading(false);
    showNotification('Payroll processing completed successfully', 'success');
  };

  const handleExportPayrollData = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    showNotification(`Payroll data exported as ${data.format} successfully`, 'success');
    closeModal();
    setIsLoading(false);
  };

  const handleExportRules = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const rulesData = JSON.stringify(calculationRules, null, 2);
    const blob = new Blob([rulesData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `work-hour-rules-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeModal();
    showNotification('Rules exported successfully', 'success');
    setIsLoading(false);
  };

  const handleSubmitCorrection = async (data) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCorrectionForm({
      employeeId: '',
      date: '',
      correctionType: 'Status Change',
      originalValue: '',
      correctedValue: '',
      reason: '',
      impact: 0
    });
    closeModal();
    showNotification('Correction submitted successfully', 'success');
    setIsLoading(false);
  };

  const handleSaveRule = async (data) => {
    setCalculationRules(prev => prev.map(rule => {
      if (rule.id === data.id) {
        return { ...rule, ...data };
      }
      return rule;
    }));
    closeModal();
    showNotification(`Rule "${data.feature}" updated successfully`, 'success');
  };

  const handleToggleRule = (ruleId) => {
    setCalculationRules(prev => prev.map(rule => {
      if (rule.id === ruleId) {
        const updated = { ...rule, enabled: !rule.enabled, status: !rule.enabled ? 'active' : 'inactive' };
        showNotification(`${rule.feature} ${updated.enabled ? 'enabled' : 'disabled'}`, updated.enabled ? 'success' : 'warning');
        return updated;
      }
      return rule;
    }));
  };

  const handleSaveIntegrationSettings = async (data) => {
    setIntegrationSettings(data);
    closeModal();
    showNotification('Integration settings saved successfully', 'success');
  };

  const handleApplyFilters = () => {
    showNotification('Filters applied successfully', 'success');
  };

  const handleResetFilters = () => {
    setFilters({ period: 'current-month', department: 'all', location: 'all', employee: 'all', status: 'all' });
    showNotification('Filters reset', 'success');
  };

  const handleRefreshStatus = async () => {
    setIsLoading(true);
    await loadInitialData();
    setIsLoading(false);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    openModal('details', record);
  };

  const handleEditRecord = (record) => {
    setCorrectionForm({
      employeeId: record.employeeId,
      date: new Date().toISOString().split('T')[0],
      correctionType: 'Status Change',
      originalValue: 'Absent',
      correctedValue: 'Present',
      reason: 'Correction requested',
      impact: 150
    });
    openModal('correction', record);
  };

  const handleExportRecord = (record) => {
    showNotification(`Exporting details for ${record.employeeName}`, 'success');
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Real-time Sync"
        value={`${integrationStatus.dataFreshness?.hoursAgo || 0}h`}
        subtitle="Last sync: Just now"
        icon="heroicons:arrow-path"
        color="blue"
      />
      <StatCard
        title="Data Status"
        value={freezeStatus.isFrozen ? 'Frozen' : 'Live'}
        subtitle={freezeStatus.isFrozen ? 'For payroll processing' : 'Ready for updates'}
        icon={freezeStatus.isFrozen ? 'heroicons:lock-closed' : 'heroicons:lock-open'}
        color={freezeStatus.isFrozen ? 'red' : 'green'}
      />
      <StatCard
        title="Total Loss of Pay"
        value={formatCurrency(kpis.totalLossOfPay)}
        subtitle={`Affects ${payrollData.filter(x => x.lossOfPay > 0).length} employees`}
        icon="heroicons:trending-down"
        color="red"
      />
      <StatCard
        title="Processed Payroll"
        value={formatCurrency(kpis.totalNetPay)}
        subtitle={`For ${kpis.totalEmployees} employees`}
        icon="heroicons:check-circle"
        color="green"
      />
    </div>
  );

  const renderTabs = () => (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
      {[
        { id: 'dashboard', label: 'Dashboard', icon: 'heroicons:home' },
        { id: 'payroll-calculation', label: 'Payroll Calculation', icon: 'heroicons:calculator' },
        { id: 'integration', label: 'Integration', icon: 'heroicons:database' },
        { id: 'corrections', label: 'Corrections', icon: 'heroicons:pencil' },
        { id: 'reports', label: 'Reports', icon: 'heroicons:document-text' },
        { id: 'settings', label: 'Settings', icon: 'heroicons:cog-6-tooth' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Icon icon={tab.icon} className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.period}
          onChange={(e) => setFilters({ ...filters, period: e.target.value })}
        >
          <option value="current-month">Current Month</option>
          <option value="last-month">Last Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="all">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        >
          <option value="all">All Locations</option>
          <option value="HQ">Headquarters</option>
          <option value="Branch A">Branch A</option>
          <option value="Remote">Remote</option>
        </select>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processed">Processed</option>
          <option value="frozen">Frozen</option>
          <option value="error">Error</option>
        </select>

        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
          onClick={handleApplyFilters}
        >
          <Icon icon="heroicons:funnel" className="w-4 h-4" />
          Apply Filters
        </button>

        <button
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
          onClick={handleResetFilters}
        >
          <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );

  const renderFreezeStatus = () => (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${freezeStatus.isFrozen ? 'bg-rose-100' : 'bg-emerald-100'}`}>
          <Icon icon={freezeStatus.isFrozen ? 'heroicons:lock-closed' : 'heroicons:lock-open'} className={`w-6 h-6 ${freezeStatus.isFrozen ? 'text-rose-600' : 'text-emerald-600'}`} />
        </div>
        <div>
          <h6 className="font-bold text-slate-800">Attendance Data Status: {freezeStatus.isFrozen ? 'Frozen' : 'Open'}</h6>
          <p className="text-sm text-slate-600">
            {freezeStatus.isFrozen
              ? `Data frozen for payroll processing until ${freezeStatus.freezeEndDate}`
              : 'Attendance data is live and updating in real-time'}
          </p>
        </div>
      </div>
      <button
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
          freezeStatus.isFrozen
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-amber-600 hover:bg-amber-700 text-white'
        }`}
        onClick={handleToggleFreeze}
        disabled={isLoading}
      >
        <Icon icon={freezeStatus.isFrozen ? 'heroicons:lock-open' : 'heroicons:lock-closed'} className="w-4 h-4" />
        {freezeStatus.isFrozen ? 'Unfreeze Data' : 'Freeze for Payroll'}
      </button>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {renderFreezeStatus()}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:chart-bar" className="w-5 h-5 text-blue-500" />
            Payroll Impact Analysis
          </h5>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-xl p-4">
              <h6 className="font-semibold text-sm text-slate-700 mb-3 flex items-center gap-2">
                <Icon icon="heroicons:trending-down" className="w-4 h-4 text-rose-500" />
                Deductions
              </h6>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-rose-50 rounded-lg">
                  <span className="text-sm text-slate-600">Loss of Pay</span>
                  <span className="font-semibold text-rose-600">{formatCurrency(kpis.totalLossOfPay)}</span>
                </div>
              </div>
            </div>
            <div className="border border-slate-200 rounded-xl p-4">
              <h6 className="font-semibold text-sm text-slate-700 mb-3 flex items-center gap-2">
                <Icon icon="heroicons:trending-up" className="w-4 h-4 text-emerald-500" />
                Additions
              </h6>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg">
                  <span className="text-sm text-slate-600">Overtime Pay</span>
                  <span className="font-semibold text-emerald-600">{formatCurrency(kpis.totalOvertimePay)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:database" className="w-5 h-5 text-blue-500" />
            Integration Status
          </h5>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-slate-100 flex items-center justify-center">
                <Icon icon="heroicons:question-mark-circle" className="w-8 h-8 text-slate-400" />
              </div>
              <h6 className="font-semibold text-slate-800">Attendance Sync</h6>
              <p className="text-sm text-slate-500">Not configured</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-slate-100 flex items-center justify-center">
                <Icon icon="heroicons:question-mark-circle" className="w-8 h-8 text-slate-400" />
              </div>
              <h6 className="font-semibold text-slate-800">Payroll Sync</h6>
              <p className="text-sm text-slate-500">Not configured</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-slate-100 flex items-center justify-center">
                <Icon icon="heroicons:question-mark-circle" className="w-8 h-8 text-slate-400" />
              </div>
              <h6 className="font-semibold text-slate-800">Data Freshness</h6>
              <p className="text-sm text-slate-500">No data</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 text-center hover:shadow-md transition">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-emerald-100 flex items-center justify-center">
                <Icon icon="heroicons:check" className="w-8 h-8 text-emerald-600" />
              </div>
              <h6 className="font-semibold text-slate-800">System Health</h6>
              <p className="text-sm text-slate-500">0 issues found</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:bell" className="w-5 h-5 text-amber-500" />
            Action Required
          </h5>
        </div>
        <div className="p-4">
          <div className="text-center py-8">
            <Icon icon="heroicons:check-circle" className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
            <p className="text-slate-600">No pending alerts</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayrollCalculation = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:calculator" className="w-5 h-5 text-blue-500" />
            Payroll Calculation Details
          </h5>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={handleRunPayroll}
              disabled={isLoading}
            >
              <Icon icon="heroicons:play" className="w-4 h-4" />
              Run Payroll
            </button>
            <button
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={() => openModal('export')}
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Employee</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Department</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Present Days</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Absent Days</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">Basic Salary</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">Net Pay</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-500">
                    <Icon icon="heroicons:users" className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p>No payroll data available</p>
                  </td>
                </tr>
              ) : (
                filteredData.slice(0, 15).map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-800">{record.employeeName}</div>
                      <div className="text-xs text-slate-500">{record.employeeId}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{record.department}</td>
                    <td className="px-3 py-3 text-center font-semibold text-emerald-600">{record.totalPresent}</td>
                    <td className="px-3 py-3 text-center font-semibold text-rose-600">{record.totalAbsent}</td>
                    <td className="px-3 py-3 text-right font-medium text-slate-700">{formatCurrency(record.basicSalary)}</td>
                    <td className="px-3 py-3 text-right font-bold text-blue-600">{formatCurrency(record.netPay)}</td>
                    <td className="px-3 py-3 text-center">{getStatusBadge(record.status)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          onClick={() => handleViewDetails(record)}
                          title="View Details"
                        >
                          <Icon icon="heroicons:eye" className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                          onClick={() => handleEditRecord(record)}
                          title="Edit"
                        >
                          <Icon icon="heroicons:pencil" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredData.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm text-slate-500">
              Showing {Math.min(15, filteredData.length)} of {filteredData.length} employees
            </span>
            <span className="text-sm font-semibold text-slate-700">
              Total: {formatCurrency(filteredData.reduce((sum, x) => sum + x.netPay, 0))}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderIntegration = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:database" className="w-5 h-5 text-blue-500" />
            Attendance-Payroll Integration Features
          </h5>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Icon icon="heroicons:database" className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h6 className="font-semibold text-slate-800">Real-time Attendance Data</h6>
                  <p className="text-sm text-slate-500">Live sync with payroll system</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sync Frequency:</span>
                  <span className="font-semibold text-slate-600">Not configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Sync:</span>
                  <span className="font-medium text-slate-700">Never</span>
                </div>
              </div>
              <button
                className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                onClick={() => showNotification('Sync initiated successfully', 'success')}
              >
                Sync Now
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Icon icon="heroicons:lock-open" className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h6 className="font-semibold text-slate-800">Attendance Freeze</h6>
                  <p className="text-sm text-slate-500">Secure payroll processing</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-semibold text-emerald-600">Unfrozen</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Freeze Window:</span>
                  <span className="font-medium text-slate-700">3 days</span>
                </div>
              </div>
              <button
                className="w-full mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition"
                onClick={handleToggleFreeze}
                disabled={isLoading}
              >
                Freeze Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:calculator" className="w-5 h-5 text-blue-500" />
              Calculation Rules & Configuration
            </h5>
            <button
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={() => openModal('settings')}
            >
              <Icon icon="heroicons:cog-6-tooth" className="w-4 h-4" />
              Configure
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="text-center py-8">
            <Icon icon="heroicons:calculator" className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500">No calculation rules configured</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCorrections = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:pencil" className="w-5 h-5 text-amber-500" />
            Attendance Corrections & Post-Payroll Handling
          </h5>
          <button
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
            onClick={() => openModal('correction')}
          >
            <Icon icon="heroicons:plus" className="w-4 h-4" />
            Add Correction
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Employee</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Correction Type</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Original Value</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Corrected Value</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Payroll Impact</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-500">
                  <Icon icon="heroicons:pencil" className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p>No corrections found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <h5 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:cog-6-tooth" className="w-5 h-5 text-slate-500" />
          Integration Settings & Configuration
        </h5>
      </div>
      <div className="p-4">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
          onClick={() => openModal('settings')}
        >
          <Icon icon="heroicons:cog-6-tooth" className="w-4 h-4" />
          Open Settings
        </button>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:document-text" className="w-5 h-5 text-blue-500" />
            Payroll Integration Reports
          </h5>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={() => openModal('exportRules')}
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              Export Rules
            </button>
            <button
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={() => openModal('export')}
            >
              <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Icon icon="heroicons:document-text" className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h6 className="font-semibold text-slate-800">Payroll-Attendance Reconciliation</h6>
                <p className="text-xs text-slate-500">Monthly reconciliation report</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Last Generated:</span>
              <span className="font-medium text-slate-700">No data</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <Icon icon="heroicons:trending-down" className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h6 className="font-semibold text-slate-800">Loss of Pay Report</h6>
                <p className="text-xs text-slate-500">Detailed deduction analysis</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Last Generated:</span>
              <span className="font-medium text-slate-700">No data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'payroll-calculation':
        return renderPayrollCalculation();
      case 'integration':
        return renderIntegration();
      case 'corrections':
        return renderCorrections();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  if (isLoading && payrollData.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
            <Icon icon="heroicons:calculator" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Attendance-Payroll Integration</h1>
            <p className="text-sm text-slate-500">HRMS Dashboard • Seamless Integration • Real-time Data Sync</p>
          </div>
        </div>
      </div>

      {renderStats()}
      {renderTabs()}
      {renderFilters()}

      {renderContent()}

      <CorrectionModal
        isOpen={modalState.isOpen && modalState.type === 'correction'}
        onClose={closeModal}
        onSubmit={handleSubmitCorrection}
        employees={employees}
        correctionData={modalState.data || {}}
        formatCurrency={formatCurrency}
        isLoading={isLoading}
      />

      <ExportModal
        isOpen={modalState.isOpen && modalState.type === 'export'}
        onClose={closeModal}
        onExport={handleExportPayrollData}
        dataCount={filteredData.length}
        title="Export Payroll Data"
        mode="payroll"
        isLoading={isLoading}
      />

      <ExportModal
        isOpen={modalState.isOpen && modalState.type === 'exportRules'}
        onClose={closeModal}
        onExport={handleExportRules}
        title="Export Work Hour Rules"
        description="Export all work hour rules as a JSON file?"
        subDescription="This will include all attendance, overtime, break rules, and settings."
        mode="rules"
        isLoading={isLoading}
      />

      <RuleEditModal
        isOpen={modalState.isOpen && modalState.type === 'ruleEdit'}
        onClose={closeModal}
        onSave={handleSaveRule}
        rule={modalState.data || null}
        isLoading={isLoading}
      />

      <SettingsModal
        isOpen={modalState.isOpen && modalState.type === 'settings'}
        onClose={closeModal}
        onSaveIntegrationSettings={handleSaveIntegrationSettings}
        integrationSettings={integrationSettings}
        mode="integration"
        isLoading={isLoading}
      />

      <DetailsModal
        isOpen={modalState.isOpen && modalState.type === 'details'}
        onClose={closeModal}
        record={modalState.data}
        getStatusBadge={getStatusBadge}
        formatCurrency={formatCurrency}
        onExport={handleExportRecord}
        mode="integration"
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

export default PayrollIntegration;