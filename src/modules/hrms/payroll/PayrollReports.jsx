import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import StatCard from '../../../shared/components/StatCard';
import AddEditReportModal from '../modal/AddEditReportModal';
import DeleteConfirmationModal from '../modal/DeleteConfirmationModal';
import InsightDetailsModal from '../modal/InsightDetailsModal';
import ReportBuilderModal from '../modal/ReportBuilderModal';

const PayrollReports = () => {
  const [activeSection, setActiveSection] = useState('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [expandedReportId, setExpandedReportId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const itemsPerPage = 8;

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const [reportForm, setReportForm] = useState({
    id: '',
    name: '',
    category: 'standard',
    description: '',
    frequency: 'Monthly',
    format: ['pdf'],
    department: 'All',
    scheduleType: 'manual',
    recipients: [],
    parameters: {}
  });

  const [reportToDelete, setReportToDelete] = useState({ id: null, category: null, name: '' });

  const [configSettings, setConfigSettings] = useState({
    defaultFormat: 'PDF',
    retentionPeriod: '12',
    autoGenerate: true,
    emailNotification: true
  });

  const departments = ['All', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Product', 'Customer Support'];

  const [employeeData, setEmployeeData] = useState([]);
  const [payrollTransactions, setPayrollTransactions] = useState([]);
  const [complianceDeadlines, setComplianceDeadlines] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  const [standardReports, setStandardReports] = useState([]);
  const [complianceReports, setComplianceReports] = useState([]);
  const [analyticsDashboards, setAnalyticsDashboards] = useState([]);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [customReports, setCustomReports] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);

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

  const formatCurrency = (value) => {
    if (value == null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
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
      'generated': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'pending': 'bg-amber-50 text-amber-700 border border-amber-200',
      'submitted': 'bg-blue-50 text-blue-700 border border-blue-200',
      'in-progress': 'bg-cyan-50 text-cyan-700 border border-cyan-200',
      'approved': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'rejected': 'bg-rose-50 text-rose-700 border border-rose-200',
      'overdue': 'bg-rose-50 text-rose-700 border border-rose-200',
      'active': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'paused': 'bg-slate-50 text-slate-700 border border-slate-200',
      'available': 'bg-cyan-50 text-cyan-700 border border-cyan-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : 'N/A'}
      </span>
    );
  };

  const kpis = useMemo(() => {
    const totalPayrollCost = payrollTransactions.reduce((sum, t) => sum + (t.grossSalary || 0), 0);
    const statutoryDeductions = payrollTransactions.reduce((sum, t) =>
      sum + (t.pf || 0) + (t.esi || 0) + (t.pt || 0) + (t.tds || 0), 0);
    const avgSalary = employeeData.length > 0 ? totalPayrollCost / employeeData.length : 0;

    return {
      totalReports: standardReports.length + complianceReports.length + analyticsDashboards.length + customReports.length,
      generatedCount: generatedReports.length,
      scheduledCount: scheduledReports.length,
      overdueCompliance: complianceDeadlines.filter(d => new Date(d.dueDate) < new Date() && d.status !== 'submitted').length,
      totalPayrollCost,
      avgSalary,
      statutoryDeductions,
      employeeCount: employeeData.length
    };
  }, [employeeData, payrollTransactions, standardReports, complianceReports, analyticsDashboards, customReports, generatedReports, scheduledReports, complianceDeadlines]);

  const getFilteredData = () => {
    let data = [];
    const term = searchTerm.trim().toLowerCase();

    switch (activeSection) {
      case 'standard':
        data = standardReports.filter(r =>
          r.name.toLowerCase().includes(term) ||
          (r.description || '').toLowerCase().includes(term)
        );
        break;
      case 'compliance':
        data = complianceReports.filter(r =>
          r.name.toLowerCase().includes(term) ||
          (r.type || '').toLowerCase().includes(term)
        );
        break;
      case 'analytics':
        data = analyticsDashboards.filter(r =>
          r.name.toLowerCase().includes(term) ||
          (r.description || '').toLowerCase().includes(term)
        );
        break;
      case 'generated':
        data = generatedReports.filter(r =>
          (r.reportName || '').toLowerCase().includes(term) ||
          (r.period || '').toLowerCase().includes(term)
        );
        break;
      case 'scheduled':
        data = scheduledReports.filter(r =>
          (r.reportName || '').toLowerCase().includes(term) ||
          (r.schedule || '').toLowerCase().includes(term)
        );
        break;
      default:
        data = [];
    }

    if (filterPeriod !== 'All' && activeSection === 'generated') {
      data = data.filter(item => item.period === filterPeriod);
    }
    if (filterDepartment !== 'All' && activeSection === 'standard') {
      data = data.filter(item => item.department === filterDepartment || item.department === 'All');
    }

    return data;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const loadInitialData = () => {
    setEmployeeData([]);
    setStandardReports([]);
    setComplianceReports([]);
    setAnalyticsDashboards([]);
    setGeneratedReports([]);
    setScheduledReports([]);
    setAiInsights([]);
    setAvailableColumns([
      { id: 'emp_id', name: 'Employee ID', category: 'Basic', type: 'text' },
      { id: 'name', name: 'Name', category: 'Basic', type: 'text' },
      { id: 'department', name: 'Department', category: 'Basic', type: 'text' },
      { id: 'basic_salary', name: 'Basic Salary', category: 'Salary', type: 'currency' },
      { id: 'gross_salary', name: 'Gross Salary', category: 'Salary', type: 'currency' },
      { id: 'net_salary', name: 'Net Salary', category: 'Salary', type: 'currency' }
    ]);
    setAvailableFilters([
      { id: 'department', name: 'Department', type: 'multi-select', options: departments.slice(1) },
      { id: 'date_range', name: 'Date Range', type: 'date-range' }
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleAddReport = () => {
    setIsEditMode(false);
    setReportForm({
      id: '',
      name: '',
      category: 'standard',
      description: '',
      frequency: 'Monthly',
      format: ['pdf'],
      department: 'All',
      scheduleType: 'manual',
      recipients: [],
      parameters: {}
    });
    openModal('addEdit');
  };

  const handleEditReport = (report, category) => {
    setIsEditMode(true);
    setReportForm({
      id: report.id,
      name: report.name,
      category: category || report.category,
      description: report.description || '',
      frequency: report.frequency || 'Monthly',
      format: Array.isArray(report.format) ? report.format : [report.format],
      department: report.department || 'All',
      scheduleType: report.scheduleType || 'manual',
      recipients: report.recipients || [],
      parameters: report.parameters || {}
    });
    openModal('addEdit');
  };

  const handleSaveReport = (data) => {
    const payload = { ...data, id: reportForm.id || `RPT_${Date.now()}`, lastModified: new Date().toISOString() };

    switch (payload.category) {
      case 'standard':
        setStandardReports(prev => {
          const exists = prev.find(r => r.id === payload.id);
          return exists ? prev.map(r => r.id === payload.id ? payload : r) : [...prev, payload];
        });
        break;
      case 'compliance':
        setComplianceReports(prev => {
          const exists = prev.find(r => r.id === payload.id);
          return exists ? prev.map(r => r.id === payload.id ? payload : r) : [...prev, payload];
        });
        break;
      case 'analytics':
        setAnalyticsDashboards(prev => {
          const exists = prev.find(r => r.id === payload.id);
          return exists ? prev.map(r => r.id === payload.id ? payload : r) : [...prev, payload];
        });
        break;
    }

    closeModal();
    showNotification(isEditMode ? 'Report updated successfully!' : 'Report added successfully!', 'success');
    setActiveSection(payload.category);
  };

  const handleDeleteReport = (reportId, category, reportName = '') => {
    setReportToDelete({ id: reportId, category, name: reportName });
    openModal('delete');
  };

  const confirmDeleteReport = () => {
    const { id, category } = reportToDelete;

    const setters = {
      'standard': setStandardReports,
      'compliance': setComplianceReports,
      'analytics': setAnalyticsDashboards,
      'scheduled': setScheduledReports,
      'custom': setCustomReports
    };

    const setter = setters[category];
    if (setter) {
      setter(prev => prev.filter(r => r.id !== id));
    }

    closeModal();
    setDeleting(false);
    showNotification('Report deleted successfully!', 'success');
  };

  const handleGenerateReport = (report) => {
    setIsLoading(true);
    setTimeout(() => {
      const newGenerated = {
        id: `GR_${Date.now()}`,
        reportName: report.name || report.reportName,
        period: 'Current Month',
        generatedDate: new Date().toISOString(),
        generatedBy: 'System',
        format: Array.isArray(report.format) ? report.format[0] : report.format,
        size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
        downloadCount: 0
      };
      setGeneratedReports(prev => [newGenerated, ...prev]);
      setIsLoading(false);
      showNotification(`Report generated successfully!`, 'success');
    }, 1500);
  };

  const handleDownloadGeneratedReport = (report) => {
    setIsLoading(true);
    setTimeout(() => {
      setGeneratedReports(prev =>
        prev.map(r => r.id === report.id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r)
      );
      const sampleData = [{ 'Report Name': report.reportName, 'Period': report.period, 'Generated Date': formatDate(report.generatedDate) }];
      const ws = XLSX.utils.json_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, `${report.reportName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`);
      setIsLoading(false);
      showNotification('Report downloaded successfully!', 'success');
    }, 1000);
  };

  const handleScheduleReport = (report) => {
    const scheduleEntry = {
      id: `SRC_${Date.now()}`,
      reportName: report.reportName || report.name,
      schedule: '1st of every month',
      nextRun: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      format: Array.isArray(report.format) ? report.format.join(' & ') : report.format,
      recipients: ['hr@company.com', 'finance@company.com'],
      status: 'active',
      frequency: 'Monthly'
    };
    setScheduledReports(prev => [scheduleEntry, ...prev]);
    showNotification(`Report scheduled successfully!`, 'success');
  };

  const handleToggleScheduleStatus = (report) => {
    setScheduledReports(prev =>
      prev.map(r => r.id === report.id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r)
    );
    showNotification(`Schedule ${report.status === 'active' ? 'paused' : 'activated'}`, 'info');
  };

  const handleExportData = (format = 'excel') => {
    const data = getFilteredData();
    if (data.length === 0) {
      showNotification('No data to export', 'warning');
      return;
    }

    if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report Data');
      XLSX.writeFile(wb, `Payroll_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      showNotification('Data exported successfully!', 'success');
    }
  };

  const handleResetConfiguration = () => {
    setConfigSettings({
      defaultFormat: 'PDF',
      retentionPeriod: '12',
      autoGenerate: true,
      emailNotification: true
    });
    showNotification('Configuration reset to default values!', 'success');
  };

  const handleViewInsightDetails = (insight) => {
    openModal('insight', insight);
  };

  const handleCreateCustomReport = (data) => {
    const newReport = {
      id: `CUSTOM_${Date.now()}`,
      name: data.name,
      description: data.description,
      category: data.category,
      columns: data.selectedColumns || [],
      filters: data.selectedFilters || [],
      format: data.format || ['pdf', 'excel'],
      schedule: data.schedule || 'none',
      createdDate: new Date().toISOString(),
      isCustom: true,
      dashboardWidget: data.dashboardWidget || false
    };
    setCustomReports(prev => [...prev, newReport]);
    closeModal();
    showNotification('Custom report created successfully!', 'success');
    setActiveSection('configure');
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Payroll Cost"
        value={formatCurrency(kpis.totalPayrollCost)}
        subtitle="Current period"
        icon="heroicons:banknotes"
        color="blue"
      />
      <StatCard
        title="Statutory Deductions"
        value={formatCurrency(kpis.statutoryDeductions)}
        subtitle="PF, ESI, PT, TDS"
        icon="heroicons:shield-check"
        color="green"
      />
      <StatCard
        title="Average Salary"
        value={formatCurrency(kpis.avgSalary)}
        subtitle="Per employee"
        icon="heroicons:chart-bar"
        color="yellow"
      />
      <StatCard
        title="Compliance Status"
        value={kpis.overdueCompliance === 0 ? '100%' : `${((complianceReports.length - kpis.overdueCompliance) / complianceReports.length * 100).toFixed(0)}%`}
        subtitle={kpis.overdueCompliance > 0 ? `${kpis.overdueCompliance} overdue` : 'All compliant'}
        icon="heroicons:document-check"
        color="cyan"
      />
    </div>
  );

  const renderAIInsights = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <h5 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:light-bulb" className="w-5 h-5 text-amber-500" />
          AI-Driven Insights
        </h5>
      </div>
      <div className="p-4 space-y-3">
        {aiInsights.map(insight => {
          const severityColor = insight.severity === 'high' ? 'rose' : insight.severity === 'medium' ? 'amber' : 'blue';
          return (
            <div key={insight.id} className={`p-4 rounded-xl border border-${severityColor}-200 bg-${severityColor}-50 flex items-center justify-between`}>
              <div className="flex items-start gap-3 flex-1">
                <Icon icon={insight.severity === 'high' ? 'heroicons:exclamation-triangle' : insight.severity === 'medium' ? 'heroicons:exclamation-circle' : 'heroicons:information-circle'} className={`w-5 h-5 text-${severityColor}-500 mt-0.5`} />
                <div>
                  <h6 className="font-semibold text-slate-800">{insight.title}</h6>
                  <p className="text-sm text-slate-600">{insight.description}</p>
                </div>
              </div>
              <button
                className={`px-3 py-1.5 bg-${severityColor}-600 hover:bg-${severityColor}-700 text-white rounded-lg text-xs font-semibold transition ml-4 flex items-center gap-1`}
                onClick={() => handleViewInsightDetails(insight)}
              >
                <Icon icon="heroicons:eye" className="w-3 h-3" />
                View
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
      {[
        { id: 'standard', label: 'Standard Reports', icon: 'heroicons:document-text' },
        { id: 'compliance', label: 'Compliance', icon: 'heroicons:shield-check' },
        { id: 'analytics', label: 'Analytics', icon: 'heroicons:chart-bar' },
        { id: 'generated', label: 'Generated', icon: 'heroicons:archive-box' },
        { id: 'scheduled', label: 'Scheduled', icon: 'heroicons:clock' },
        { id: 'configure', label: 'Configuration', icon: 'heroicons:cog' },
        { id: 'builder', label: 'Report Builder', icon: 'heroicons:wrench-screwdriver' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveSection(tab.id);
            setCurrentPage(1);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeSection === tab.id
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

  const renderStandardReports = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:document-text" className="w-5 h-5 text-blue-500" />
            Standard Payroll Reports
          </h5>
          <button
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
            onClick={handleAddReport}
          >
            <Icon icon="heroicons:plus" className="w-4 h-4" />
            Add Report
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={() => handleExportData('excel')}
          >
            <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Report Name</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Department</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Frequency</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {standardReports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">
                    <Icon icon="heroicons:document-text" className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p>No standard reports available</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-800">{report.name}</div>
                      <div className="text-xs text-slate-500">{report.description}</div>
                    </td>
                    <td className="px-3 py-3">{report.department}</td>
                    <td className="px-3 py-3">{report.frequency}</td>
                    <td className="px-3 py-3 text-center">{getStatusBadge(report.status)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          onClick={() => handleGenerateReport(report)}
                          title="Generate"
                        >
                          <Icon icon="heroicons:play" className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                          onClick={() => handleEditReport(report, 'standard')}
                          title="Edit"
                        >
                          <Icon icon="heroicons:pencil" className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          onClick={() => handleDeleteReport(report.id, 'standard', report.name)}
                          title="Delete"
                        >
                          <Icon icon="heroicons:trash" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} reports
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderComplianceReports = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:shield-check" className="w-5 h-5 text-emerald-500" />
            Statutory Compliance Reports
          </h5>
          {kpis.overdueCompliance > 0 && (
            <button className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2">
              <Icon icon="heroicons:exclamation-triangle" className="w-4 h-4" />
              {kpis.overdueCompliance} Overdue
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Report Name</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Type</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Due Date</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complianceReports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">
                    <Icon icon="heroicons:shield-check" className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p>No compliance reports available</p>
                  </td>
                </tr>
              ) : (
                complianceReports.map(report => {
                  const isOverdue = report.dueDate !== 'N/A' && new Date(report.dueDate) < new Date() && report.status !== 'submitted';
                  return (
                    <tr key={report.id} className="hover:bg-slate-50/50">
                      <td className="px-3 py-3">
                        <div className="font-medium text-slate-800">{report.name}</div>
                        <div className="text-xs text-slate-500">{report.description}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {report.formType || report.type}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={isOverdue ? 'text-rose-600 font-semibold' : ''}>
                          {formatDate(report.dueDate)}
                          {isOverdue && <span className="ml-2 text-rose-600 text-xs">(Overdue)</span>}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">{getStatusBadge(report.status)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                            onClick={() => {
                              const ws = XLSX.utils.json_to_sheet([{ 'Report': report.name, 'Type': report.type, 'Status': report.status }]);
                              const wb = XLSX.utils.book_new();
                              XLSX.utils.book_append_sheet(wb, ws, 'Compliance');
                              XLSX.writeFile(wb, `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`);
                              showNotification('Compliance report downloaded!', 'success');
                            }}
                            title="Download"
                          >
                            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                            onClick={() => handleDeleteReport(report.id, 'compliance', report.name)}
                            title="Delete"
                          >
                            <Icon icon="heroicons:trash" className="w-4 h-4" />
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

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {analyticsDashboards.length === 0 ? (
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <Icon icon="heroicons:chart-bar" className="w-16 h-16 mx-auto text-slate-300 mb-3" />
          <h6 className="text-slate-600 font-medium">No analytics dashboards available</h6>
          <p className="text-sm text-slate-400">Create a new dashboard to get started</p>
        </div>
      ) : (
        analyticsDashboards.map(dashboard => (
          <div key={dashboard.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
              <h6 className="font-bold text-slate-800 flex items-center gap-2">
                <Icon icon="heroicons:chart-bar" className="w-4 h-4 text-blue-500" />
                {dashboard.name}
              </h6>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-600 mb-3">{dashboard.description}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Chart: {dashboard.chartType}</span>
                <span className="inline-flex px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">Refresh: {dashboard.refreshRate}</span>
                <span className="inline-flex px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{dashboard.accessLevel}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                  onClick={() => {
                    showNotification(`Opening dashboard: ${dashboard.name}`, 'info');
                  }}
                >
                  <Icon icon="heroicons:eye" className="w-3 h-3" />
                  View
                </button>
                <button
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                  onClick={() => handleDeleteReport(dashboard.id, 'analytics', dashboard.name)}
                >
                  <Icon icon="heroicons:trash" className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderGeneratedReports = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <h5 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:archive-box" className="w-5 h-5 text-amber-500" />
          Generated Reports
        </h5>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Report Name</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Period</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Generated Date</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Format</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Downloads</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {generatedReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    <Icon icon="heroicons:archive-box" className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p>No generated reports available</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-3 font-medium text-slate-800">{report.reportName}</td>
                    <td className="px-3 py-3">{report.period}</td>
                    <td className="px-3 py-3">{formatDate(report.generatedDate)}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {report.format}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">{report.downloadCount}</td>
                    <td className="px-3 py-3">
                      <button
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                        onClick={() => handleDownloadGeneratedReport(report)}
                        title="Download"
                      >
                        <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
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

  const renderScheduledReports = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <h5 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:clock" className="w-5 h-5 text-blue-500" />
          Scheduled Reports
        </h5>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Report Name</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Schedule</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Next Run</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scheduledReports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">
                    <Icon icon="heroicons:clock" className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p>No scheduled reports available</p>
                  </td>
                </tr>
              ) : (
                scheduledReports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-3 font-medium text-slate-800">{report.reportName}</td>
                    <td className="px-3 py-3">{report.schedule}</td>
                    <td className="px-3 py-3">{formatDate(report.nextRun)}</td>
                    <td className="px-3 py-3 text-center">{getStatusBadge(report.status)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                          onClick={() => handleToggleScheduleStatus(report)}
                          title={report.status === 'active' ? 'Pause' : 'Activate'}
                        >
                          <Icon icon={report.status === 'active' ? 'heroicons:pause' : 'heroicons:play'} className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          onClick={() => handleDeleteReport(report.id, 'scheduled', report.reportName)}
                          title="Delete"
                        >
                          <Icon icon="heroicons:trash" className="w-4 h-4" />
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

  const renderConfiguration = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon="heroicons:plus" className="w-4 h-4 text-blue-500" />
              Create Report
            </h6>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-600 mb-3">Build and configure a new report template</p>
            <button
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
              onClick={() => setActiveSection('builder')}
            >
              <Icon icon="heroicons:plus" className="w-4 h-4" />
              Create Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon="heroicons:document-arrow-down" className="w-4 h-4 text-emerald-500" />
              Export Config
            </h6>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-600 mb-3">Download all configurations as Excel</p>
            <button
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
              onClick={() => handleExportData('excel')}
            >
              <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
              Export Config
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon="heroicons:arrow-path" className="w-4 h-4 text-amber-500" />
              Reset Settings
            </h6>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-600 mb-3">Restore default configuration values</p>
            <button
              className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
              onClick={handleResetConfiguration}
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
              Reset Settings
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:cog" className="w-5 h-5 text-slate-500" />
            Report Configuration
          </h5>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Default Report Format</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                value={configSettings.defaultFormat}
                onChange={(e) => setConfigSettings({ ...configSettings, defaultFormat: e.target.value })}
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Retention Period (months)</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                value={configSettings.retentionPeriod}
                onChange={(e) => setConfigSettings({ ...configSettings, retentionPeriod: e.target.value })}
              >
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="36">36</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={configSettings.autoGenerate}
                onChange={(e) => setConfigSettings({ ...configSettings, autoGenerate: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Auto-generate scheduled reports</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={configSettings.emailNotification}
                onChange={(e) => setConfigSettings({ ...configSettings, emailNotification: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Email notifications for completed reports</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportBuilder = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <h5 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:wrench-screwdriver" className="w-5 h-5 text-purple-500" />
          Custom Report Builder
        </h5>
      </div>
      <div className="p-4">
        <button
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
          onClick={() => openModal('builder')}
        >
          <Icon icon="heroicons:plus" className="w-4 h-4" />
          Build Custom Report
        </button>
        <p className="text-xs text-slate-500 text-center mt-2">Create custom reports by selecting columns, filters, and formatting options</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'standard':
        return renderStandardReports();
      case 'compliance':
        return renderComplianceReports();
      case 'analytics':
        return renderAnalytics();
      case 'generated':
        return renderGeneratedReports();
      case 'scheduled':
        return renderScheduledReports();
      case 'configure':
        return renderConfiguration();
      case 'builder':
        return renderReportBuilder();
      default:
        return renderStandardReports();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto">
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
            <Icon icon="heroicons:chart-bar" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Payroll Reports & Analytics</h1>
            <p className="text-sm text-slate-500">Comprehensive payroll reporting system with AI-driven insights</p>
          </div>
        </div>
      </div>

      {renderStats()}
      {renderAIInsights()}
      {renderNavigation()}

      {renderContent()}

      <AddEditReportModal
        isOpen={modalState.isOpen && modalState.type === 'addEdit'}
        onClose={closeModal}
        onSave={handleSaveReport}
        report={modalState.data || reportForm}
        isEditMode={isEditMode}
        departments={departments}
      />

      <DeleteConfirmationModal
        isOpen={modalState.isOpen && modalState.type === 'delete'}
        onClose={closeModal}
        onConfirmDelete={confirmDeleteReport}
        reportToDelete={reportToDelete}
        reportName={reportToDelete.name}
        deleting={deleting}
        setDeleting={setDeleting}
      />

      <InsightDetailsModal
        isOpen={modalState.isOpen && modalState.type === 'insight'}
        onClose={closeModal}
        insight={modalState.data}
      />

      <ReportBuilderModal
        isOpen={modalState.isOpen && modalState.type === 'builder'}
        onClose={closeModal}
        onSave={handleCreateCustomReport}
        availableColumns={availableColumns}
        availableFilters={availableFilters}
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

export default PayrollReports;