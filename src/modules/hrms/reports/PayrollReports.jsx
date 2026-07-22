import React, { useState, useEffect } from 'react';
import { 
  Search, Download, Filter, X, ChevronLeft, ChevronRight, Printer, Eye, 
  Copy, ArrowRight, Calendar, RefreshCw, CheckCircle, AlertCircle, 
  FileText, FileJson, FileSpreadsheet, File, Share2, Mail, ExternalLink,
  Clock, User, Building, DollarSign, Percent, Layers, BarChart3, PieChart
} from 'lucide-react';
import RecruiterDashboardLayout from "../../../app/layouts/RecruiterDashboardLayout";

import { reportsPayrollAPI } from '../../../shared/utils/api';

const PayrollReports = () => {
  const [selectedReports, setSelectedReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    period: ''
  });
  
  // ADDED: New states for functionality
  const [generatingReport, setGeneratingReport] = useState(null);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(null);
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31'
  });
  const [notification, setNotification] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  
  // ADDED: Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // ADDED: Export options
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportOptions, setExportOptions] = useState({
    includeHeaders: true,
    includeMetadata: true,
    compress: false
  });
  
  // ADDED: Generate options
  const [generateOptions, setGenerateOptions] = useState({
    dateRange: 'current-month',
    includeHistorical: false,
    sendNotification: true
  });
  
  // ADDED: Schedule options
  const [scheduleOptions, setScheduleOptions] = useState({
    frequency: 'monthly',
    time: '09:00',
    recipients: '',
    format: 'pdf'
  });

  // Backend PayrollReportItem -> local UI shape. Backend has no id field
  // at all (it's a fixed server-side catalogue), so one is synthesized
  // from the report name.
  const [reports, setReports] = useState([]);
  const [reportStats, setReportStats] = useState(null);
  const [categorySummaries, setCategorySummaries] = useState([]);

  const mapReport = (r) => ({
    id: r.report_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: r.report_name,
    description: r.description,
    category: r.category,
    type: r.type,
    frequency: r.frequency,
    status: r.status,
    lastGenerated: r.last_generated,
    columns: [],
    dataSize: 'N/A',
  });

  // Only these 8 catalogue entries have a real underlying data endpoint —
  // everything else in the catalogue is a name/description only, with no
  // live data behind it anywhere in the backend.
  const REPORT_DATA_SOURCES = {
    'Monthly Payroll Summary': { fetch: reportsPayrollAPI.getMonthlyPayrollSummary, columns: ['run_id', 'month', 'year', 'total_employees', 'total_gross', 'total_deductions', 'total_net_pay', 'status', 'run_date'] },
    'Department-wise Payroll Cost': { fetch: reportsPayrollAPI.getDepartmentWisePayroll, columns: ['department', 'headcount', 'total_gross', 'total_deductions', 'total_net_pay'] },
    'Grade-wise Salary Analysis': { fetch: reportsPayrollAPI.getGradeWiseSalary, columns: ['grade', 'headcount', 'avg_ctc'] },
    'Bank-wise Payment Summary': { fetch: reportsPayrollAPI.getBankTransferSummary, columns: ['bank_name', 'transaction_count', 'total_amount', 'failed_count'] },
    'Loan Outstanding Report': { fetch: reportsPayrollAPI.getLoanOutstanding, columns: ['employee_id', 'loan_type', 'amount', 'approved_amount', 'emi_amount', 'total_installments', 'paid_installments', 'outstanding'] },
    'PF Remittance Report': { fetch: reportsPayrollAPI.getPfRemittance, columns: ['employee_id', 'employee_name', 'department', 'basic', 'pf_employee', 'pf_employer', 'total_pf'] },
    'TDS Deduction Report': { fetch: reportsPayrollAPI.getTdsReport, columns: ['employee_id', 'employee_name', 'gross_salary', 'tds_deducted'] },
    'Payroll Variance Report': { fetch: reportsPayrollAPI.getPayrollVariance, columns: ['month', 'year', 'total_gross', 'total_net_pay', 'gross_variance', 'net_variance'] },
  };

  const loadPayrollReportsData = () => {
    Promise.all([
      reportsPayrollAPI.listReports().catch((err) => { console.error('Failed to load report catalogue:', err); return []; }),
      reportsPayrollAPI.getStats().catch((err) => { console.error('Failed to load report stats:', err); return null; }),
      reportsPayrollAPI.getCategorySummary().catch((err) => { console.error('Failed to load category summary:', err); return []; }),
      reportsPayrollAPI.getRecentActivity().catch((err) => { console.error('Failed to load recent activity:', err); return []; }),
    ]).then(([reportsData, stats, categoryData, activityData]) => {
      setReports((Array.isArray(reportsData) ? reportsData : []).map(mapReport));
      setReportStats(stats);
      setCategorySummaries(Array.isArray(categoryData) ? categoryData : []);
      setRecentActivity((Array.isArray(activityData) ? activityData : []).map((a) => ({
        id: `${a.report_name}-${a.time}`,
        action: a.action,
        reportName: a.report_name,
        timestamp: a.time,
      })));
    });
  };

  useEffect(() => {
    loadPayrollReportsData();
  }, []);

  // ADDED: Show notification function
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ADDED: Add to recent activity
  const addToRecentActivity = (action, reportName) => {
    const activity = {
      id: Date.now(),
      action,
      reportName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRecentActivity(prev => [activity, ...prev.slice(0, 4)]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReports(filteredReports.map(r => r.id));
      showNotification(`Selected ${filteredReports.length} reports`, 'info');
    } else {
      setSelectedReports([]);
      showNotification('Cleared all selections', 'info');
    }
  };

  const handleSelectReport = (id) => {
    setSelectedReports(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(rId => rId !== id)
        : [...prev, id];
      
      if (newSelection.length === 0) {
        showNotification('No reports selected', 'info');
      } else {
        showNotification(`${newSelection.length} report${newSelection.length > 1 ? 's' : ''} selected`, 'info');
      }
      
      return newSelection;
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Salary': 'bg-primary-subtle text-primary',
      'Statutory': 'bg-warning-subtle text-warning',
      'Deduction': 'bg-info-subtle text-info',
      'Bank Transfer': 'bg-success-subtle text-success'
    };
    return colors[category] || 'bg-secondary-subtle text-secondary';
  };

  const getFrequencyColor = (frequency) => {
    const colors = {
      'Daily': 'badge bg-danger-light text-danger',
      'Monthly': 'badge bg-primary-light text-primary',
      'Quarterly': 'badge bg-warning-light text-warning',
      'Annual': 'badge bg-success-light text-success'
    };
    return colors[frequency] || 'badge bg-secondary-light text-secondary';
  };

  // ADDED: Get status based on last generated date
  const getReportStatus = (lastGenerated) => {
    const today = new Date();
    const lastGenDate = new Date(lastGenerated);
    const diffDays = Math.floor((today - lastGenDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return { status: 'Fresh', icon: <CheckCircle size={14} className="text-success" /> };
    if (diffDays <= 7) return { status: 'Recent', icon: <CheckCircle size={14} className="text-primary" /> };
    return { status: 'Stale', icon: <AlertCircle size={14} className="text-warning" /> };
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filters.category || report.category.toLowerCase() === filters.category.toLowerCase();
    
    const matchesType = !filters.type || report.type.toLowerCase() === filters.type.toLowerCase();
    
    const matchesPeriod = !filters.period || report.frequency.toLowerCase() === filters.period.toLowerCase();
    
    // ADDED: Date range filter
    let matchesDateRange = true;
    if (showDateRange && dateRange.start && dateRange.end) {
      const reportDate = new Date(report.lastGenerated);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = reportDate >= startDate && reportDate <= endDate;
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesPeriod && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, showDateRange, dateRange]);

  // ADDED: Open view modal
  const handleViewReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setShowViewModal(true);
    }
  };

  // ADDED: Open export modal
  const handleOpenExportModal = () => {
    if (selectedReports.length === 0) {
      showNotification('Please select reports to export', 'warning');
      return;
    }
    setShowExportModal(true);
  };

  // ADDED: Open generate modal
  const handleOpenGenerateModal = () => {
    if (selectedReports.length === 0) {
      showNotification('Please select reports to generate', 'warning');
      return;
    }
    setShowGenerateModal(true);
  };

  // ADDED: Open schedule modal
  // NOTE: Schedule / Share / Delete have NO backend support whatsoever —
  // there is no scheduling, sharing, or deletion concept anywhere in
  // routers/Reports/payroll_reports.py (it's a read-only catalogue + 8
  // data endpoints). Whatever these modals do on "confirm" is local-only
  // and cannot persist; flagging here rather than at each modal since none
  // of the three do anything real regardless of which one opens.
  const handleOpenScheduleModal = (reportId = null) => {
    if (reportId) {
      const report = reports.find(r => r.id === reportId);
      setSelectedReport(report);
    }
    setShowScheduleModal(true);
  };

  // ADDED: Open share modal
  const handleOpenShareModal = (reportId = null) => {
    if (reportId) {
      const report = reports.find(r => r.id === reportId);
      setSelectedReport(report);
    }
    setShowShareModal(true);
  };

  // ADDED: Open delete modal
  const handleOpenDeleteModal = (reportId = null) => {
    if (reportId) {
      const report = reports.find(r => r.id === reportId);
      setSelectedReport(report);
    }
    setShowDeleteModal(true);
  };

  // NOTE: there is no generate/create endpoint anywhere on this backend —
  // /list is a fixed, read-only catalogue. This can't actually trigger
  // report generation server-side; it only logs a local "activity" entry
  // (recent-activity has no POST either, so this never persists beyond
  // the current session) rather than pretending a real report got produced.
  const handleGenerateReport = async (reportId = null, options = generateOptions) => {
    const reportsToGenerate = reportId ? [reportId] : selectedReports;
    
    if (reportsToGenerate.length === 0) {
      showNotification('Please select reports to generate', 'warning');
      return;
    }

    setGeneratingReport(reportId);
    if (!reportId) setBulkGenerating(true);

    reportsToGenerate.forEach(id => {
      const report = reports.find(r => r.id === id);
      if (report) {
        addToRecentActivity('Generated (local only — no backend generation exists)', report.name);
      }
    });

    setGeneratingReport(null);
    setBulkGenerating(false);
    setShowGenerateModal(false);

    showNotification(`Note: this backend has no report-generation endpoint — logged locally only, no report was actually produced server-side.`, 'warning');
  };

  // FIXED: Enhanced export function
  const handleExport = async (format = exportFormat, options = exportOptions) => {
    if (selectedReports.length === 0) {
      showNotification('Please select reports to export', 'warning');
      return;
    }

    try {
      showNotification(`Preparing export for ${selectedReports.length} reports...`, 'info');

      const dataBundles = await Promise.all(selectedReports.map(async (id) => {
        const report = reports.find(r => r.id === id);
        if (!report) return null;
        const source = REPORT_DATA_SOURCES[report.name];
        let rows = null;
        if (source) {
          try {
            rows = await source.fetch();
          } catch (err) {
            console.error(`Failed to fetch live data for ${report.name}:`, err);
          }
        }
        return { report, rows };
      }));

      let content, filename, mimeType;

      switch (format) {
        case 'csv': {
          const sections = dataBundles.filter(Boolean).map(({ report, rows }) => {
            const header = `# ${report.name} (${report.category} / ${report.type} / ${report.frequency})`;
            if (Array.isArray(rows) && rows.length > 0) {
              const cols = Object.keys(rows[0]);
              const csvHeader = cols.join(',');
              const csvRows = rows.map((row) => cols.map((c) => row[c]).join(','));
              return [header, csvHeader, ...csvRows].join('\n');
            }
            return `${header}\n# No live data source available for this report type — catalogue entry only.`;
          });
          content = sections.join('\n\n');
          filename = `payroll-reports-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        }

        case 'json': {
          content = JSON.stringify(dataBundles.filter(Boolean).map(({ report, rows }) => ({
            name: report.name,
            category: report.category,
            type: report.type,
            frequency: report.frequency,
            lastGenerated: report.lastGenerated,
            description: report.description,
            hasLiveData: !!(rows && rows.length),
            data: rows || null,
          })), null, 2);
          filename = `payroll-reports-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;
        }

        default:
          showNotification(`${format.toUpperCase()} export isn't implemented for real data yet — use CSV or JSON.`, 'warning');
          return;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      addToRecentActivity('Exported', `${selectedReports.length} reports`);
      setShowExportModal(false);
      showNotification(`Exported ${selectedReports.length} reports as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Failed to export reports. Please try again.', 'danger');
    }
  };

  // ADDED: Download report function
  const handleDownloadReport = async (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    setDownloadingReport(reportId);
    showNotification(`Downloading ${report.name}...`, 'info');

    try {
      const source = REPORT_DATA_SOURCES[report.name];
      let content;

      if (source) {
        const rows = await source.fetch();
        if (Array.isArray(rows) && rows.length > 0) {
          const cols = Object.keys(rows[0]);
          content = [cols.join(','), ...rows.map((row) => cols.map((c) => row[c]).join(','))].join('\n');
        } else {
          content = `Report: ${report.name}\nNo data currently available for this period.`;
        }
      } else {
        content = `Report: ${report.name}\nCategory: ${report.category}\nType: ${report.type}\nFrequency: ${report.frequency}\nLast Generated: ${report.lastGenerated}\nDescription: ${report.description}\n\nNote: this report type has no live data source in the backend yet — this is catalogue metadata only.`;
      }

      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.name.replace(/\s+/g, '_')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setDownloadingReport(null);
      addToRecentActivity('Downloaded', report.name);
      showNotification(`${report.name} downloaded successfully!`, 'success');
    } catch (error) {
      console.error('Download error:', error);
      setDownloadingReport(null);
      showNotification('Failed to download report. Please try again.', 'danger');
    }
  };

 

  // ADDED: Clear filters function
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ category: '', type: '', period: '' });
    setDateRange({ start: '2024-01-01', end: '2024-01-31' });
    setShowDateRange(false);
    showNotification('All filters cleared', 'info');
  };

  // ADDED: Quick filter by category
  const handleQuickFilter = (category) => {
    setFilters(prev => ({ ...prev, category }));
    showNotification(`Filtered by ${category} reports`, 'info');
  };

  const handlePrint = () => {
    window.print();
    showNotification('Printing reports...', 'info');
  };

  // ADDED: Initialize recent activity
  useEffect(() => {
    setRecentActivity([]);
  }, []);

  // FIXED: Handle page size change
  const handleItemsPerPageChange = (e) => {
    const newValue = parseInt(e.target.value);
    setItemsPerPage(newValue);
    setCurrentPage(1);
    showNotification(`Showing ${newValue} reports per page`, 'info');
  };

  // ADDED: Close all modals
  const closeAllModals = () => {
    setShowViewModal(false);
    setShowExportModal(false);
    setShowGenerateModal(false);
    setShowScheduleModal(false);
    setShowShareModal(false);
    setShowDeleteModal(false);
    setSelectedReport(null);
  };

  return (
    
      <div className="container-fluid py-4">
        {/* ADDED: Notification */}
        {notification && (
          <div className={`alert alert-${notification.type === 'danger' ? 'danger' : notification.type} alert-dismissible fade show mb-4`} role="alert">
            {notification.message}
            <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-2"><i className='ri-file-chart-line m-2'></i>Payroll Reports</h5>
              <p className="text-secondary-light mb-0">Generate and manage payroll reports for salary, statutory, deductions, and bank transfers.</p>
            </div>
            
          </div>
          
          {/* ADDED: Quick Stats */}
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <div className="card border shadow-none">
                <div className="card-body py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">Total Reports</small>
                      <h6 className="mb-0">{reports.length}</h6>
                    </div>
                    <FileText size={20} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border shadow-none">
                <div className="card-body py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">Filtered</small>
                      <h6 className="mb-0">{filteredReports.length}</h6>
                    </div>
                    <Filter size={20} className="text-info" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border shadow-none">
                <div className="card-body py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">Selected</small>
                      <h6 className="mb-0">{selectedReports.length}</h6>
                    </div>
                    <CheckCircle size={20} className="text-success" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border shadow-none">
                <div className="card-body py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">Active Filters</small>
                      <h6 className="mb-0">
                        {[filters.category, filters.type, filters.period, showDateRange ? 'Date' : '']
                          .filter(Boolean).length}
                      </h6>
                    </div>
                    <AlertCircle size={20} className="text-warning" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ADDED: Quick Filter Buttons */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button className="btn btn-sm btn-outline-primary" onClick={() => handleQuickFilter('Salary')}>
            Salary Reports
          </button>
          <button className="btn btn-sm btn-outline-warning" onClick={() => handleQuickFilter('Statutory')}>
            Statutory Reports
          </button>
          <button className="btn btn-sm btn-outline-info" onClick={() => handleQuickFilter('Deduction')}>
            Deduction Reports
          </button>
          <button className="btn btn-sm btn-outline-success" onClick={() => handleQuickFilter('Bank Transfer')}>
            Bank Transfers
          </button>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>

        {/* Filters */}
        <div className="card border shadow-none mb-4">
          <div className="card-body d-flex gap-2 align-items-center">
            <div className="flex-grow-1">
              <div className="input-group" style={{maxWidth: '400px'}}>
                <span className="input-group-text bg-white border-end-0">
                  <Search size={16} className="text-muted" />
                </span>
                <input 
                  className="form-control border-start-0" 
                  placeholder="Search reports by name, category, or description..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: '14px', padding: '8px 12px' }}
                />
              </div>
            </div>

            <select 
              className="form-select w-auto" 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              <option value="salary">Salary Reports</option>
              <option value="statutory">Statutory Reports</option>
              <option value="deduction">Deduction Reports</option>
              <option value="bank transfer">Bank Transfer Reports</option>
            </select>

            <select 
              className="form-select w-auto"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">All Types</option>
              <option value="summary">Summary</option>
              <option value="analysis">Analysis</option>
              <option value="detailed">Detailed</option>
              <option value="statutory">Statutory</option>
              <option value="form">Form</option>
              <option value="log">Log</option>
              <option value="tracking">Tracking</option>
              <option value="reconciliation">Reconciliation</option>
            </select>

            <select 
              className="form-select w-auto"
              value={filters.period}
              onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
            >
              <option value="">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>

            {/* ADDED: Date Range Toggle */}
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setShowDateRange(!showDateRange)}
            >
              <Calendar size={16} />
            </button>

            
          </div>

          {/* ADDED: Date Range Picker */}
          {showDateRange && (
            <div className="card-body border-top">
              <div className="row g-2">
                <div className="col-md-4">
                  <label className="form-label">From Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">To Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setDateRange({ start: '2024-01-01', end: '2024-01-31' });
                      showNotification('Date range reset', 'info');
                    }}
                  >
                    Reset Dates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedReports.length > 0 && (
          <div className="alert alert-info d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
              <span className="fw-medium">
                {selectedReports.length} report{selectedReports.length > 1 ? 's' : ''} selected
              </span>
              <div className="vr"></div>
              <button className="btn btn-danger btn-sm" onClick={() => {
                setSelectedReports([]);
                showNotification('Selection cleared', 'info');
              }}>
                <X size={14} className="me-1" />
                Clear
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => {
                showNotification('Duplicating selected reports...', 'info');
                addToRecentActivity('Duplicated', `${selectedReports.length} reports`);
              }}>
                <Copy size={14} className="me-1" />
                Duplicate
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleOpenExportModal} disabled={selectedReports.length === 0}>
                <Download size={14} className="me-1" />
                Export Options
              </button>
              <button className="btn btn-success btn-sm" onClick={handleOpenGenerateModal} disabled={selectedReports.length === 0}>
                {bulkGenerating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <ArrowRight size={14} className="me-1" />
                    Generate All
                  </>
                )}
              </button>
            </div>
            <button
              onClick={() => setSelectedReports([])}
              className="btn btn-link p-0 text-decoration-none"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Reports Table */}
        <div className="card border shadow-none mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{width: 40}} className="text-center">
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      checked={selectedReports.length === currentReports.length && currentReports.length > 0} 
                      onChange={handleSelectAll} 
                    />
                  </th>
                  <th className="text-start">REPORT NAME</th>
                  <th className="text-start">CATEGORY</th>
                  <th className="text-start">TYPE</th>
                  <th className="text-center">FREQUENCY</th>
                  <th className="text-center">STATUS</th>
                  <th className="text-center">LAST GENERATED</th>
                  <th className="text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map(report => {
                  const status = getReportStatus(report.lastGenerated);
                  return (
                    <tr key={report.id}>
                      <td className="text-center">
                        <input 
                          type="checkbox" 
                          className="form-check-input"
                          checked={selectedReports.includes(report.id)} 
                          onChange={() => handleSelectReport(report.id)} 
                        />
                      </td>
                      <td className="text-start">
                        <div className="fw-medium">{report.name}</div>
                        <small className="text-muted d-block">{report.description.substring(0, 60)}...</small>
                      </td>
                      <td className="text-start">
                        <span className={`badge ${getCategoryColor(report.category)}`}>
                          {report.category}
                        </span>
                      </td>
                      <td className="text-start text-muted">{report.type}</td>
                      <td className="text-center">
                        <span className={getFrequencyColor(report.frequency)}>
                          {report.frequency}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1">
                          {status.icon}
                          <small className="text-muted">{status.status}</small>
                        </div>
                      </td>
                      <td className="text-center text-muted">{report.lastGenerated}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button 
                            type="button" 
                            className="btn btn-sm btn-icon btn-light" 
                            title="View Details"
                            onClick={() => handleViewReport(report.id)}
                          >
                            <Eye size={16} />
                          </button>
                          
                          <button 
                            type="button" 
                            className="btn btn-sm btn-icon btn-light" 
                            title="Download"
                            onClick={() => handleDownloadReport(report.id)}
                            disabled={downloadingReport === report.id}
                          >
                            {downloadingReport === report.id ? (
                              <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : (
                              <Download size={16} />
                            )}
                          </button>
                          {/* ADDED: More options dropdown */}
                          <div className="dropdown">
                            <button className="btn btn-sm btn-icon btn-light" type="button" data-bs-toggle="dropdown">
                              <i className="ri-more-2-line"></i>
                            </button>
                            <ul className="dropdown-menu">
                             
                              <li>
                                <button className="dropdown-item" onClick={() => handleOpenScheduleModal(report.id)}>
                                  <Calendar size={14} className="me-2" /> Schedule
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" onClick={() => handleOpenShareModal(report.id)}>
                                  <Share2 size={14} className="me-2" /> Share
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button className="dropdown-item text-danger" onClick={() => handleOpenDeleteModal(report.id)}>
                                  <X size={14} className="me-2" /> Delete
                                </button>
                              </li>
                            </ul>
                          </div>
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
              Showing <strong>{startIndex+1}</strong> to <strong>{Math.min(endIndex, filteredReports.length)}</strong> of <strong>{filteredReports.length}</strong> reports
            </small>
            {/* ADDED: Page size selector */}
            <div className="d-inline-block ms-3">
              <small className="text-secondary-light me-2">Show:</small>
              <select 
                className="form-select form-select-sm d-inline-block w-auto" 
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="btn-group" role="group">
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  showNotification('Previous page', 'info');
                }} 
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                const maxVisiblePages = 5;
                const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
                if (pageNum < startPage || pageNum > endPage) {
                  if (pageNum === 1 || pageNum === totalPages) {
                    return <span key={pageNum} className="btn btn-outline-secondary disabled">...</span>;
                  }
                  return null;
                }
                
                return (
                  <button 
                    key={pageNum}
                    className={pageNum === currentPage ? 'btn btn-primary' : 'btn btn-outline-secondary'} 
                    onClick={() => {
                      setCurrentPage(pageNum);
                      showNotification(`Page ${pageNum}`, 'info');
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  showNotification('Next page', 'info');
                }} 
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body">
                <h6 className="card-title"><i className="ri-money-dollar-circle-line me-2"></i>Salary Reports</h6>
                <p className="card-text small text-secondary">Monthly payroll, cost analysis, salary breakdowns</p>
                <div className="d-flex justify-content-between align-items-center">
                  <button 
                    className="btn btn-sm btn-outline-primary "
                    onClick={() => handleQuickFilter('Salary')}
                  >
                    View All
                  </button>
                  <span className="badge bg-primary">
                    {reports.filter(r => r.category === 'Salary').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body">
                <h6 className="card-title"><i className="ri-government-line me-2"></i>Statutory Reports</h6>
                <p className="card-text small text-secondary">PF, ESI, TDS, PT returns and compliance forms</p>
                <div className="d-flex justify-content-between align-items-center">
                  <button 
                    className="btn btn-sm btn-outline-warning mt-4"
                    onClick={() => handleQuickFilter('Statutory')}
                  >
                    View All
                  </button>
                  <span className="badge bg-warning mt-4">
                    {reports.filter(r => r.category === 'Statutory').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body">
                <h6 className="card-title"><i className="ri-bank-card-line me-2"></i>Deduction Reports</h6>
                <p className="card-text small text-secondary">Loan, advances, arrears and other deductions</p>
                <div className="d-flex justify-content-between align-items-center">
                  <button 
                    className="btn btn-sm btn-outline-info mt-4"
                    onClick={() => handleQuickFilter('Deduction')}
                  >
                    View All
                  </button>
                  <span className="badge bg-info mt-4">
                    {reports.filter(r => r.category === 'Deduction').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body">
                <h6 className="card-title"><i className="ri-bank-line me-2"></i>Bank Transfers</h6>
                <p className="card-text small text-secondary">Payment summaries, reconciliation, failed payments</p>
                <div className="d-flex justify-content-between align-items-center">
                  <button 
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleQuickFilter('Bank Transfer')}
                  >
                    View All
                  </button>
                  <span className="badge bg-success">
                    {reports.filter(r => r.category === 'Bank Transfer').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ADDED: Recent Activity Section */}
        <div className="card border shadow-none">
          <div className="card-header bg-transparent">
            <h6 className="mb-0">Recent Activity</h6>
          </div>
          <div className="card-body">
            {recentActivity.length > 0 ? (
              <div className="list-group list-group-flush">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <span className={`badge ${
                        activity.action === 'Generated' ? 'bg-success' :
                        activity.action === 'Downloaded' ? 'bg-primary' :
                        activity.action === 'Exported' ? 'bg-info' :
                        'bg-secondary'
                      } me-2`}>
                        {activity.action}
                      </span>
                      {activity.reportName}
                    </div>
                    <small className="text-muted">{activity.timestamp}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">No recent activity</p>
            )}
          </div>
          <div className="card-footer bg-transparent">
            <button 
              className="btn btn-sm btn-link p-0"
              onClick={() => {
                setRecentActivity([]);
                showNotification('Activity cleared', 'info');
              }}
            >
              Clear Activity
            </button>
          </div>
        </div>

        {/* =============== MODALS =============== */}

        {/* View Report Modal */}
        {showViewModal && selectedReport && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <Eye size={18} className="me-2" />
                    {selectedReport.name}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeAllModals}></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Category</label>
                        <div>
                          <span className={`badge ${getCategoryColor(selectedReport.category)}`}>
                            {selectedReport.category}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Type</label>
                        <div className="fw-medium">{selectedReport.type}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Frequency</label>
                        <div>
                          <span className={getFrequencyColor(selectedReport.frequency)}>
                            {selectedReport.frequency}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Last Generated</label>
                        <div className="fw-medium">{selectedReport.lastGenerated}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Data Size</label>
                        <div className="fw-medium">{selectedReport.dataSize}</div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Estimated Generation Time</label>
                        <div className="fw-medium">{selectedReport.estimatedTime}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label text-muted small mb-1">Description</label>
                    <div className="border rounded p-3 bg-light">
                      {selectedReport.description}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label text-muted small mb-1">Report Columns</label>
                    <div className="border rounded p-3">
                      <div className="d-flex flex-wrap gap-2">
                        {selectedReport.columns.map((column, index) => (
                          <span key={index} className="badge bg-secondary">
                            {column}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Available Formats</label>
                        <div className="fw-medium">{selectedReport.format}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Access Level</label>
                        <div className="fw-medium">{selectedReport.accessLevel}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeAllModals}>
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => {
                      handleGenerateReport(selectedReport.id);
                      closeAllModals();
                    }}
                    disabled={generatingReport === selectedReport.id}
                  >
                    {generatingReport === selectedReport.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <ArrowRight size={16} className="me-2" />
                        Generate Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <Download size={18} className="me-2" />
                    Export Reports ({selectedReports.length})
                  </h5>
                  <button type="button" className="btn-close" onClick={closeAllModals}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <label className="form-label mb-3">Select Export Format</label>
                    <div className="row g-3">
                      <div className="col-6">
                        <div className={`card border cursor-pointer ${exportFormat === 'csv' ? 'border-primary' : ''}`} 
                             onClick={() => setExportFormat('csv')}>
                          <div className="card-body text-center">
                            <FileText size={32} className="mb-2 text-primary" />
                            <div className="fw-medium">CSV</div>
                            <small className="text-muted">Comma separated values</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={`card border cursor-pointer ${exportFormat === 'excel' ? 'border-primary' : ''}`} 
                             onClick={() => setExportFormat('excel')}>
                          <div className="card-body text-center">
                            <FileSpreadsheet size={32} className="mb-2 text-success" />
                            <div className="fw-medium">Excel</div>
                            <small className="text-muted">Microsoft Excel format</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={`card border cursor-pointer ${exportFormat === 'json' ? 'border-primary' : ''}`} 
                             onClick={() => setExportFormat('json')}>
                          <div className="card-body text-center">
                            <FileJson size={32} className="mb-2 text-warning" />
                            <div className="fw-medium">JSON</div>
                            <small className="text-muted">JavaScript Object Notation</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={`card border cursor-pointer ${exportFormat === 'pdf' ? 'border-primary' : ''}`} 
                             onClick={() => setExportFormat('pdf')}>
                          <div className="card-body text-center">
                            <File size={32} className="mb-2 text-danger" />
                            <div className="fw-medium">PDF</div>
                            <small className="text-muted">Portable Document Format</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label mb-3">Export Options</label>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={exportOptions.includeHeaders}
                        onChange={(e) => setExportOptions({...exportOptions, includeHeaders: e.target.checked})}
                      />
                      <label className="form-check-label">
                        Include column headers
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={exportOptions.includeMetadata}
                        onChange={(e) => setExportOptions({...exportOptions, includeMetadata: e.target.checked})}
                      />
                      <label className="form-check-label">
                        Include report metadata
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={exportOptions.compress}
                        onChange={(e) => setExportOptions({...exportOptions, compress: e.target.checked})}
                      />
                      <label className="form-check-label">
                        Compress file (ZIP)
                      </label>
                    </div>
                  </div>
                  
                  <div className="alert alert-info">
                    <small>
                      <i className="ri-information-line me-1"></i>
                      The export will include {selectedReports.length} selected report{selectedReports.length > 1 ? 's' : ''}.
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeAllModals}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => handleExport(exportFormat, exportOptions)}
                  >
                    <Download size={16} className="me-2" />
                    Export Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Modal */}
        {showGenerateModal && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <ArrowRight size={18} className="me-2" />
                    Generate Reports ({selectedReports.length})
                  </h5>
                  <button type="button" className="btn-close" onClick={closeAllModals}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <label className="form-label mb-3">Data Range</label>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className={`card border cursor-pointer ${generateOptions.dateRange === 'current-month' ? 'border-primary' : ''}`} 
                             onClick={() => setGenerateOptions({...generateOptions, dateRange: 'current-month'})}>
                          <div className="card-body py-2 text-center">
                            <div className="fw-medium">Current Month</div>
                            <small className="text-muted">Jan 2024</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={`card border cursor-pointer ${generateOptions.dateRange === 'previous-month' ? 'border-primary' : ''}`} 
                             onClick={() => setGenerateOptions({...generateOptions, dateRange: 'previous-month'})}>
                          <div className="card-body py-2 text-center">
                            <div className="fw-medium">Previous Month</div>
                            <small className="text-muted">Dec 2023</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={`card border cursor-pointer ${generateOptions.dateRange === 'current-quarter' ? 'border-primary' : ''}`} 
                             onClick={() => setGenerateOptions({...generateOptions, dateRange: 'current-quarter'})}>
                          <div className="card-body py-2 text-center">
                            <div className="fw-medium">Current Quarter</div>
                            <small className="text-muted">Q1 2024</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className={`card border cursor-pointer ${generateOptions.dateRange === 'custom' ? 'border-primary' : ''}`} 
                             onClick={() => setGenerateOptions({...generateOptions, dateRange: 'custom'})}>
                          <div className="card-body py-2 text-center">
                            <div className="fw-medium">Custom Range</div>
                            <small className="text-muted">Select dates</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label mb-3">Generation Options</label>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={generateOptions.includeHistorical}
                        onChange={(e) => setGenerateOptions({...generateOptions, includeHistorical: e.target.checked})}
                      />
                      <label className="form-check-label">
                        Include historical data comparison
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={generateOptions.sendNotification}
                        onChange={(e) => setGenerateOptions({...generateOptions, sendNotification: e.target.checked})}
                      />
                      <label className="form-check-label">
                        Send email notification when complete
                      </label>
                    </div>
                  </div>
                  
                  <div className="alert alert-warning">
                    <small>
                      <i className="ri-alert-line me-1"></i>
                      Generating {selectedReports.length} reports may take approximately {selectedReports.length * 2} minutes.
                    </small>
                  </div>
                  
                  <div className="mt-3">
                    <small className="text-muted">Selected Reports:</small>
                    <div className="border rounded p-2 mt-1 max-h-100 overflow-auto">
                      {selectedReports.map(id => {
                        const report = reports.find(r => r.id === id);
                        return report ? (
                          <div key={id} className="d-flex justify-content-between align-items-center mb-1">
                            <span>{report.name}</span>
                            <small className="text-muted">{report.estimatedTime}</small>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeAllModals}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => handleGenerateReport(null, generateOptions)}
                    disabled={bulkGenerating}
                  >
                    {bulkGenerating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <ArrowRight size={16} className="me-2" />
                        Generate Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <Calendar size={18} className="me-2" />
                    Schedule Report{selectedReport ? `: ${selectedReport.name}` : 's'}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeAllModals}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Frequency</label>
                    <select 
                      className="form-select"
                      value={scheduleOptions.frequency}
                      onChange={(e) => setScheduleOptions({...scheduleOptions, frequency: e.target.value})}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input 
                      type="time" 
                      className="form-control"
                      value={scheduleOptions.time}
                      onChange={(e) => setScheduleOptions({...scheduleOptions, time: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Recipients (Email)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Enter email addresses separated by commas"
                      value={scheduleOptions.recipients}
                      onChange={(e) => setScheduleOptions({...scheduleOptions, recipients: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Output Format</label>
                    <select 
                      className="form-select"
                      value={scheduleOptions.format}
                      onChange={(e) => setScheduleOptions({...scheduleOptions, format: e.target.value})}
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                  
                  <div className="alert alert-info">
                    <small>
                      <i className="ri-information-line me-1"></i>
                      The scheduled report will be automatically generated and sent to the specified recipients.
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeAllModals}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => {
                      showNotification(`Report scheduled for ${scheduleOptions.frequency} generation`, 'success');
                      closeAllModals();
                    }}
                  >
                    <Calendar size={16} className="me-2" />
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <Share2 size={18} className="me-2" />
                    Share {selectedReport ? selectedReport.name : 'Selected Reports'}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeAllModals}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Share via Email</label>
                    <input 
                      type="email" 
                      className="form-control mb-2"
                      placeholder="Enter email address"
                    />
                    <textarea 
                      className="form-control"
                      rows="3"
                      placeholder="Add a message (optional)"
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Generate Shareable Link</label>
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control"
                        value={selectedReport ? `https://payroll.com/reports/${selectedReport.id}` : 'https://payroll.com/reports/share'}
                        readOnly
                      />
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedReport ? `https://payroll.com/reports/${selectedReport.id}` : 'https://payroll.com/reports/share');
                          showNotification('Link copied to clipboard', 'success');
                        }}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Share Options</label>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" />
                      <label className="form-check-label">
                        Allow download
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" />
                      <label className="form-check-label">
                        Set expiration date (7 days)
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeAllModals}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => {
                      showNotification('Report shared successfully', 'success');
                      closeAllModals();
                    }}
                  >
                    <Share2 size={16} className="me-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-danger">
                    <AlertCircle size={18} className="me-2" />
                    Delete {selectedReport ? selectedReport.name : 'Selected Reports'}?
                  </h5>
                  <button type="button" className="btn-close" onClick={closeAllModals}></button>
                </div>
                <div className="modal-body text-center">
                  <AlertCircle size={48} className="text-danger mb-3" />
                  <h5 className="mb-3">Are you sure?</h5>
                  <p className="text-muted">
                    {selectedReport 
                      ? `You are about to delete "${selectedReport.name}". This action cannot be undone.`
                      : `You are about to delete ${selectedReports.length} reports. This action cannot be undone.`
                    }
                  </p>
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="confirmDelete" />
                    <label className="form-check-label" htmlFor="confirmDelete">
                      I understand this action is permanent
                    </label>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={closeAllModals}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => {
                      showNotification(
                        selectedReport 
                          ? `"${selectedReport.name}" deleted successfully` 
                          : `${selectedReports.length} reports deleted successfully`, 
                        'success'
                      );
                      closeAllModals();
                    }}
                  >
                    <X size={16} className="me-2" />
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default PayrollReports;