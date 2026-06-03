// src\components\HRMS\PayrollManagement\PayrollReports.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const PayrollReports = () => {
  // UI & navigation state
  const [activeSection, setActiveSection] = useState('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterGrade, setFilterGrade] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [filters, setFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [exportFormat, setExportFormat] = useState('csv');
  const [scheduleSettings, setScheduleSettings] = useState(null);

  // Enhanced state based on HRMS specification
  const [employeeData, setEmployeeData] = useState([]);
  const [payrollTransactions, setPayrollTransactions] = useState([]);
  const [statutoryData, setStatutoryData] = useState([]);
  const [complianceDeadlines, setComplianceDeadlines] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  // Add/Edit modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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

  // Report builder state
  const [reportBuilder, setReportBuilder] = useState({
    step: 1,
    name: '',
    description: '',
    category: 'Payroll',
    dataSource: 'payroll',
    selectedColumns: [],
    selectedFilters: [],
    grouping: [],
    calculations: [],
    format: ['pdf', 'excel'],
    schedule: 'none',
    recipients: [],
    dashboardWidget: false
  });

  // Chart configurations
  const [chartConfig, setChartConfig] = useState({
    chartType: 'bar',
    colorScheme: 'corporate',
    showTrendLines: true,
    showDataLabels: true,
    comparePeriod: true,
    drillDownEnabled: true
  });

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState({ id: null, category: null, name: '' });

  // Configuration state
  const [configSettings, setConfigSettings] = useState({
    defaultFormat: 'PDF',
    retentionPeriod: '12',
    autoGenerate: true,
    emailNotification: true
  });

  // Constants from HRMS specification
  const departments = ['All', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Product', 'Customer Support'];
  const locations = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
  const grades = ['All', 'A', 'B', 'C', 'D', 'E', 'Executive', 'Management'];
  const periods = ['All', 'Current Month', 'Last Month', 'Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4', 'Year to Date', 'Last Year'];
  const salaryComponents = ['Basic', 'HRA', 'Conveyance', 'Special Allowance', 'Performance Bonus', 'PF', 'ESI', 'PT', 'TDS', 'Loan EMI', 'Advance Recovery'];

  const itemsPerPage = 8;

  // Data lists
  const [standardReports, setStandardReports] = useState([]);
  const [complianceReports, setComplianceReports] = useState([]);
  const [analyticsDashboards, setAnalyticsDashboards] = useState([]);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [reportTemplates, setReportTemplates] = useState([]);
  const [customReports, setCustomReports] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [builderStep, setBuilderStep] = useState(1);

  // Helper functions
  const formatCurrency = (value) => {
    if (value == null) return '-';
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
    const badges = {
      'generated': 'bg-success-subtle text-success',
      'pending': 'bg-warning-subtle text-warning',
      'submitted': 'bg-info-subtle text-info',
      'in-progress': 'bg-primary-subtle text-primary',
      'approved': 'bg-success',
      'rejected': 'bg-danger',
      'overdue': 'bg-danger-subtle text-danger',
      'active': 'bg-success-subtle text-success',
      'paused': 'bg-secondary-subtle text-secondary'
    };
    return <span className={`badge ${badges[status] || 'bg-light text-dark'}`}>{status}</span>;
  };
  const [expandedReportId, setExpandedReportId] = React.useState(null);

  const toggleExpand = (id) => {
    setExpandedReportId(prev => (prev === id ? null : id));
  };

  // KPI calculations from actual data
  const kpis = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthData = payrollTransactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalPayrollCost = currentMonthData.reduce((sum, t) => sum + (t.grossSalary || 0), 0);
    const statutoryDeductions = currentMonthData.reduce((sum, t) =>
      sum + (t.pf || 0) + (t.esi || 0) + (t.pt || 0) + (t.tds || 0), 0);
    const netPayroll = totalPayrollCost - statutoryDeductions;
    const avgSalary = currentMonthData.length > 0 ? totalPayrollCost / currentMonthData.length : 0;

    const departmentBreakdown = employeeData.reduce((acc, emp) => {
      const dept = emp.department || 'Unknown';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    return {
      totalReports: standardReports.length + complianceReports.length + analyticsDashboards.length + customReports.length,
      generatedCount: generatedReports.length,
      scheduledCount: scheduledReports.length,
      overdueCompliance: complianceDeadlines.filter(d => new Date(d.dueDate) < new Date() && d.status !== 'submitted').length,
      totalPayrollCost,
      avgSalary,
      statutoryDeductions,
      netPayroll,
      employeeCount: employeeData.length,
      departmentBreakdown
    };
  }, [employeeData, payrollTransactions, standardReports, complianceReports, analyticsDashboards, customReports, generatedReports, scheduledReports, complianceDeadlines]);

  // Enhanced filtering logic
  const getFilteredData = () => {
    let data = [];
    const term = searchTerm.trim().toLowerCase();

    switch (activeSection) {
      case 'standard':
        data = standardReports.filter(r =>
          r.name.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term) ||
          (r.category || '').toLowerCase().includes(term)
        );
        break;
      case 'compliance':
        data = complianceReports.filter(r =>
          r.name.toLowerCase().includes(term) ||
          r.type.toLowerCase().includes(term) ||
          (r.formType || '').toLowerCase().includes(term)
        );
        break;
      case 'analytics':
        data = analyticsDashboards.filter(r =>
          r.name.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term)
        );
        break;
      case 'generated':
        data = generatedReports.filter(r =>
          r.reportName.toLowerCase().includes(term) ||
          r.period.toLowerCase().includes(term) ||
          (r.generatedBy || '').toLowerCase().includes(term)
        );
        break;
      case 'scheduled':
        data = scheduledReports.filter(r =>
          r.reportName.toLowerCase().includes(term) ||
          r.schedule.toLowerCase().includes(term)
        );
        break;
      case 'configure':
        data = [...reportTemplates, ...customReports].filter(r =>
          r.name.toLowerCase().includes(term) ||
          r.category.toLowerCase().includes(term)
        );
        break;
      default:
        data = [];
    }

    // Apply additional filters
    if (filterPeriod !== 'All' && activeSection === 'generated') {
      data = data.filter(item => item.period === filterPeriod);
    }
    if (filterDepartment !== 'All' && activeSection === 'standard') {
      data = data.filter(item => item.department === filterDepartment || item.department === 'All');
    }
    if (dateRange.start && dateRange.end && activeSection === 'generated') {
      data = data.filter(item => {
        const genDate = new Date(item.generatedDate);
        return genDate >= new Date(dateRange.start) && genDate <= new Date(dateRange.end);
      });
    }

    return data;
  };

  // FIXED: Enhanced Export Data Handler
  const handleExportData = (format = 'excel', data = null) => {
    try {
      const exportData = data || getFilteredData();

      if (exportData.length === 0) {
        alert('No data to export');
        return;
      }

      if (format === 'excel') {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report Data');
        XLSX.writeFile(wb, `Payroll_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      } else if (format === 'pdf') {
        const doc = new jsPDF();
        doc.text(`Payroll Report - ${new Date().toLocaleDateString()}`, 10, 10);

        const headers = Object.keys(exportData[0] || {}).map(key => ({
          title: key.toUpperCase(),
          dataKey: key
        }));

        if (headers.length > 0) {
          doc.autoTable({
            head: [headers.map(h => h.title)],
            body: exportData.map(row => headers.map(h => row[h.dataKey])),
            startY: 20
          });
        }

        doc.save(`Payroll_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting data: ' + error.message);
    }
  };

  // FIXED: Handle Download Generated Report
  const handleDownloadGeneratedReport = (report) => {
    setIsLoading(true);

    // Simulate download
    setTimeout(() => {
      const updatedReports = generatedReports.map(r =>
        r.id === report.id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r
      );
      setGeneratedReports(updatedReports);

      // Create and download sample data
      const sampleData = [{
        'Report Name': report.reportName,
        'Period': report.period,
        'Generated Date': formatDate(report.generatedDate),
        'Generated By': report.generatedBy,
        'File Format': report.format,
        'File Size': report.size
      }];

      const ws = XLSX.utils.json_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, `${report.reportName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`);

      setIsLoading(false);
    }, 1000);
  };

  // FIXED: Handle View Dashboard
  const handleViewDashboard = (dashboard) => {
    setSelectedReport(dashboard);
    setShowModal(true);
    alert(`Opening dashboard: ${dashboard.name}`);
  };

  // FIXED: Handle View Insight Details
  const handleViewInsightDetails = (insight) => {
    alert(`AI Insight Details:\n\nTitle: ${insight.title}\nSeverity: ${insight.severity}\nDescription: ${insight.description}\nRecommended Action: ${insight.recommendedAction}`);
  };

  // FIXED: Handle Edit Scheduled Report
  const handleEditScheduledReport = (report) => {
    setIsEditMode(true);
    setReportForm({
      id: report.id,
      name: report.reportName,
      category: 'scheduled',
      description: `Scheduled report running ${report.frequency}`,
      frequency: report.frequency,
      format: report.format.split(' & '),
      department: 'All',
      scheduleType: 'auto',
      recipients: report.recipients,
      parameters: {}
    });
    setShowReportModal(true);
  };

  // FIXED: Handle Toggle Schedule Status
  const handleToggleScheduleStatus = (report) => {
    const updatedReports = scheduledReports.map(r =>
      r.id === report.id
        ? { ...r, status: r.status === 'active' ? 'paused' : 'active' }
        : r
    );
    setScheduledReports(updatedReports);
    alert(`Schedule ${report.status === 'active' ? 'paused' : 'activated'} for "${report.reportName}"`);
  };

  // FIXED: Handle Download Compliance Report
  const handleDownloadComplianceReport = (report) => {
    setIsLoading(true);

    setTimeout(() => {
      // Create compliance report data
      const complianceData = [{
        'Report Name': report.name,
        'Type': report.type,
        'Form Type': report.formType,
        'Period': report.month || report.year || report.quarter,
        'Due Date': formatDate(report.dueDate),
        'Status': report.status,
        'Generated Date': new Date().toISOString()
      }];

      const ws = XLSX.utils.json_to_sheet(complianceData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Compliance Report');
      XLSX.writeFile(wb, `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`);

      setIsLoading(false);
    }, 1000);
  };

  // FIXED: Handle Generate Report
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
        size: `${Math.random() * 2 + 0.5} MB`,
        status: 'completed',
        downloadCount: 0,
        parameters: {
          department: filterDepartment,
          period: filterPeriod,
          ...dateRange
        }
      };

      setGeneratedReports(prev => [newGenerated, ...prev]);
      setIsLoading(false);

      // Auto-download the generated report
      handleDownloadGeneratedReport(newGenerated);
    }, 1500);
  };

  // FIXED: Handle Schedule Report
  const handleScheduleReport = (report) => {
    const scheduleEntry = {
      id: `SRC_${Date.now()}`,
      reportName: report.reportName || report.name,
      schedule: '1st of every month',
      nextRun: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      format: Array.isArray(report.format) ? report.format.join(' & ') : report.format,
      recipients: ['hr@company.com', 'finance@company.com'],
      status: 'active',
      lastRun: null,
      frequency: 'Monthly'
    };

    setScheduledReports(prev => [scheduleEntry, ...prev]);
    alert(`Report "${report.name}" scheduled successfully.`);
  };

  // FIXED: Handle Add Report
  const handleAddReport = () => {
    setIsEditMode(false);
    setReportForm({
      id: 'NEW-' + Date.now(),
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
    setShowReportModal(true);
  };

  // FIXED: Handle Edit Report
  const handleEditReport = (report, category) => {
    setIsEditMode(true);
    setReportForm({
      id: report.id,
      name: report.name,
      category: category || report.category,
      description: report.description,
      frequency: report.frequency || 'Monthly',
      format: Array.isArray(report.format) ? report.format : [report.format],
      department: report.department || 'All',
      scheduleType: 'manual',
      recipients: report.recipients || [],
      parameters: report.parameters || {}
    });
    setShowReportModal(true);
  };

  // FIXED: Handle Delete Report with confirmation modal
  const handleDeleteReport = (reportId, category, reportName = '') => {
    setReportToDelete({ id: reportId, category, name: reportName });
    setShowDeleteModal(true);
  };

  // FIXED: Confirm Delete Report
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

    setShowDeleteModal(false);
    setReportToDelete({ id: null, category: null, name: '' });
    alert('Report deleted successfully.');
  };

  // FIXED: Handle Save Report
  const handleSaveReport = () => {
    if (!reportForm.name.trim()) {
      alert('Report name is required');
      return;
    }

    const payload = {
      ...reportForm,
      lastModified: new Date().toISOString(),
      modifiedBy: 'System'
    };

    // Update appropriate state based on category
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
      case 'scheduled':
        setScheduledReports(prev => {
          const exists = prev.find(r => r.id === payload.id);
          return exists ? prev.map(r => r.id === payload.id ? {
            ...r,
            reportName: payload.name,
            frequency: payload.frequency,
            recipients: payload.recipients
          } : r) : prev;
        });
        break;
    }

    setShowReportModal(false);
    alert(isEditMode ? 'Report updated successfully.' : 'Report added successfully.');

    // Navigate to the relevant section
    setActiveSection(payload.category);
    setSearchTerm('');
    setCurrentPage(1);
  };

  // FIXED: Handle Reset Configuration
  const handleResetConfiguration = () => {
    setConfigSettings({
      defaultFormat: 'PDF',
      retentionPeriod: '12',
      autoGenerate: true,
      emailNotification: true
    });
    alert('Configuration reset to default values.');
  };

  // Initialize with comprehensive data from HRMS specification
  const loadInitialData = () => {
    // Load employee data
    const employees = Array.from({ length: 150 }, (_, i) => ({
      id: `EMP${String(i + 1).padStart(4, '0')}`,
      name: `Employee ${i + 1}`,
      department: departments[Math.floor(Math.random() * (departments.length - 1)) + 1],
      location: locations[Math.floor(Math.random() * (locations.length - 1)) + 1],
      grade: grades[Math.floor(Math.random() * (grades.length - 1)) + 1],
      basicSalary: Math.floor(Math.random() * 50000) + 30000,
      grossSalary: Math.floor(Math.random() * 80000) + 40000,
      netSalary: Math.floor(Math.random() * 70000) + 35000,
      pf: Math.floor(Math.random() * 6000),
      esi: Math.floor(Math.random() * 2000),
      pt: Math.floor(Math.random() * 200),
      tds: Math.floor(Math.random() * 8000),
      status: ['active', 'inactive', 'notice_period'][Math.floor(Math.random() * 3)]
    }));
    setEmployeeData(employees);

    // Standard Reports (from HRMS spec section 4.9)
    setStandardReports([
      { id: 'SR001', name: 'Monthly Payroll Register', category: 'standard', description: 'Detailed monthly payroll register with employee-wise breakdown', frequency: 'Monthly', department: 'All', lastGenerated: '2024-03-31', status: 'generated', format: ['pdf', 'excel'], size: '2.4 MB', statutory: false, scheduleEnabled: true },
      { id: 'SR002', name: 'Department-wise Payroll Summary', category: 'standard', description: 'Summary of payroll costs by department', frequency: 'Monthly', department: 'All', lastGenerated: '2024-03-31', status: 'generated', format: ['pdf', 'excel'], size: '1.8 MB', statutory: false, scheduleEnabled: true },
      { id: 'SR003', name: 'Location-wise Payroll Summary', category: 'standard', description: 'Payroll summary grouped by location', frequency: 'Monthly', department: 'All', lastGenerated: '2024-03-31', status: 'generated', format: ['pdf', 'excel'], size: '1.4 MB', statutory: false, scheduleEnabled: true },
      { id: 'SR004', name: 'Grade-wise Salary Analysis', category: 'standard', description: 'Salary distribution across grades', frequency: 'Quarterly', department: 'All', lastGenerated: '2024-03-31', status: 'generated', format: ['pdf', 'excel'], size: '1.2 MB', statutory: false, scheduleEnabled: true },
      { id: 'SR005', name: 'Bank Transfer Summary', category: 'standard', description: 'Summary of bank transfers for salary payments', frequency: 'Monthly', department: 'All', lastGenerated: '2024-03-31', status: 'pending', format: ['pdf', 'excel'], size: '0.9 MB', statutory: false, scheduleEnabled: true },
      { id: 'SR006', name: 'Statutory Reports (PF, ESI, PT, TDS)', category: 'standard', description: 'All statutory deduction summaries', frequency: 'Monthly/Quarterly', department: 'Finance', lastGenerated: '2024-03-31', status: 'generated', format: ['pdf', 'excel'], size: '3.0 MB', statutory: true, scheduleEnabled: true },
      { id: 'SR007', name: 'Cost Center Wise Payroll', category: 'standard', description: 'Payroll cost allocation by cost center', frequency: 'Monthly', department: 'Finance', lastGenerated: '2024-03-31', status: 'generated', format: ['pdf', 'excel'], size: '1.5 MB', statutory: false, scheduleEnabled: true },
      { id: 'SR008', name: 'Arrear Register', category: 'standard', description: 'Register of arrears and recoveries', frequency: 'Monthly', department: 'Finance', lastGenerated: '2024-03-31', status: 'generated', format: ['pdf'], size: '0.8 MB', statutory: false, scheduleEnabled: true },
      { id: 'SR009', name: 'Payroll Variance Report (Month-over-Month)', category: 'standard', description: 'Month-over-month payroll variance analysis', frequency: 'Monthly', department: 'All', lastGenerated: '2024-03-31', status: 'generated', format: ['pdf', 'excel'], size: '1.7 MB', statutory: false, scheduleEnabled: true },
      { id: 'SR010', name: 'Headcount and Payroll Cost Trends', category: 'standard', description: 'Historical trends of headcount and payroll costs', frequency: 'Monthly', department: 'HR', lastGenerated: '2024-03-31', status: 'generated', format: ['pdf', 'excel'], size: '2.1 MB', statutory: false, scheduleEnabled: true }
    ]);

    // Compliance Reports (from HRMS spec section 4.9)
    setComplianceReports([
      { id: 'CR001', name: 'Form 24Q (TDS quarterly return)', type: 'TDS', category: 'compliance', description: 'Quarterly TDS return for salaried employees (Form 24Q)', frequency: 'Quarterly', dueDate: '2024-04-30', status: 'generated', formType: 'TDS', year: '2023-24', quarter: 'Q4', statutory: true, autoGenerated: true },
      { id: 'CR002', name: 'ECR (PF monthly return)', type: 'PF', category: 'compliance', description: 'ECR file for monthly PF contributions', frequency: 'Monthly', dueDate: '2024-04-15', status: 'submitted', formType: 'PF', month: 'March 2024', statutory: true, autoGenerated: true },
      { id: 'CR003', name: 'ESI Monthly Return', type: 'ESI', category: 'compliance', description: 'Monthly ESI contribution return', frequency: 'Monthly', dueDate: '2024-04-15', status: 'generated', formType: 'ESI', month: 'March 2024', statutory: true, autoGenerated: true },
      { id: 'CR004', name: 'PT Challan Reports', type: 'Professional Tax', category: 'compliance', description: 'Professional Tax challan and payment reports', frequency: 'Monthly', dueDate: '2024-04-21', status: 'generated', formType: 'PT', month: 'March 2024', statutory: true, autoGenerated: true },
      { id: 'CR005', name: 'Form 16 (Annual TDS certificate)', type: 'TDS Certificate', category: 'compliance', description: 'Form 16 annual TDS certificate for employees', frequency: 'Annual', dueDate: '2024-06-15', status: 'in-progress', formType: 'TDS', year: '2023-24', statutory: true, autoGenerated: true },
      { id: 'CR006', name: 'Salary Certificate', type: 'Certificate', category: 'compliance', description: 'Employee salary certificate for various purposes', frequency: 'On Demand', dueDate: 'N/A', status: 'available', formType: 'Certificate', statutory: false, autoGenerated: false },
      { id: 'CR007', name: 'PF Annual Return (Form 3A, 6A)', type: 'PF', category: 'compliance', description: 'Annual PF return (Form 3A, 6A)', frequency: 'Annual', dueDate: '2024-05-30', status: 'pending', formType: 'PF', year: '2023-24', statutory: true, autoGenerated: true }
    ]);

    // Analytics Dashboards (from HRMS spec section 4.9)
    setAnalyticsDashboards([
      { id: 'AD001', name: 'Total Payroll Cost Visualization', description: 'Interactive visualization of total payroll costs', category: 'analytics', metrics: ['Total Cost', 'Cost per Employee', 'Department Breakdown'], refreshRate: 'Real-time', accessLevel: 'Manager+', lastUpdated: '2024-03-31', chartType: 'bar', drillDown: true },
      { id: 'AD002', name: 'Average Salary by Department/Grade', description: 'Average salary analysis across departments and grades', category: 'analytics', metrics: ['Average Salary', 'Median Salary', 'Salary Range'], refreshRate: 'Daily', accessLevel: 'HR+', lastUpdated: '2024-03-31', chartType: 'combo', drillDown: true },
      { id: 'AD003', name: 'Salary Distribution Analysis', description: 'Analysis of salary distribution across organization', category: 'analytics', metrics: ['Distribution Curve', 'Percentiles', 'Outliers'], refreshRate: 'Monthly', accessLevel: 'HR+', lastUpdated: '2024-03-31', chartType: 'histogram', drillDown: true },
      { id: 'AD004', name: 'Statutory Contribution Trends', description: 'Trend analysis of statutory contributions (PF, ESI, PT)', category: 'analytics', metrics: ['PF Trends', 'ESI Trends', 'PT Trends'], refreshRate: 'Monthly', accessLevel: 'Finance+', lastUpdated: '2024-03-31', chartType: 'line', drillDown: false },
      { id: 'AD005', name: 'Payroll Cost Forecasting', description: 'Forecast future payroll costs based on trends', category: 'analytics', metrics: ['3-Month Forecast', '6-Month Forecast', 'Variance Analysis'], refreshRate: 'Monthly', accessLevel: 'Executive', lastUpdated: '2024-03-31', chartType: 'line', drillDown: true },
      { id: 'AD006', name: 'Budget vs Actual Payroll Comparison', description: 'Comparison of budgeted vs actual payroll costs', category: 'analytics', metrics: ['Variance %', 'Budget Utilization', 'Department Performance'], refreshRate: 'Monthly', accessLevel: 'Manager+', lastUpdated: '2024-03-31', chartType: 'combo', drillDown: true },
      { id: 'AD007', name: 'Attrition Impact on Payroll Costs', description: 'Analysis of attrition impact on payroll', category: 'analytics', metrics: ['Cost of Attrition', 'Replacement Cost', 'Productivity Loss'], refreshRate: 'Quarterly', accessLevel: 'HR+', lastUpdated: '2024-03-31', chartType: 'bar', drillDown: true }
    ]);

    // Generated reports history
    setGeneratedReports([
      { id: 'GR001', reportName: 'Monthly Payroll Register', period: 'March 2024', generatedDate: '2024-04-01', generatedBy: 'System', format: 'PDF', size: '2.4 MB', status: 'completed', downloadCount: 15, parameters: { department: 'All', location: 'All' } },
      { id: 'GR002', reportName: 'Department-wise Summary', period: 'March 2024', generatedDate: '2024-04-01', generatedBy: 'HR Manager', format: 'Excel', size: '1.8 MB', status: 'completed', downloadCount: 8, parameters: { department: 'Engineering', location: 'Bangalore' } },
      { id: 'GR003', reportName: 'Form 24Q', period: 'Q4 FY 2023-24', generatedDate: '2024-04-10', generatedBy: 'Finance', format: 'Excel', size: '3.2 MB', status: 'completed', downloadCount: 3, parameters: { year: '2023-24', quarter: 'Q4' } }
    ]);

    // Scheduled reports
    setScheduledReports([
      { id: 'SRC001', reportName: 'Monthly Payroll Register', schedule: '1st of every month', nextRun: '2024-05-01', format: 'PDF & Excel', recipients: ['hr@company.com', 'finance@company.com'], status: 'active', frequency: 'Monthly', lastRun: '2024-04-01', errorCount: 0 },
      { id: 'SRC002', reportName: 'Bank Transfer Summary', schedule: '28th of every month', nextRun: '2024-04-28', format: 'Excel', recipients: ['finance@company.com'], status: 'active', frequency: 'Monthly', lastRun: '2024-03-28', errorCount: 0 }
    ]);

    // AI Insights based on HRMS spec section 8.8
    setAiInsights([
      { id: 'AI001', type: 'anomaly', title: 'Unusual Overtime Pattern', description: 'Sales department showing 300% overtime increase', severity: 'high', recommendedAction: 'Review overtime approvals' },
      { id: 'AI002', type: 'prediction', title: 'Attrition Risk Alert', description: '5 employees in Engineering show high flight risk', severity: 'medium', recommendedAction: 'Schedule retention meetings' },
      { id: 'AI003', type: 'recommendation', title: 'Salary Benchmarking', description: 'Market parity suggests 8-12% salary adjustment for Grade B', severity: 'low', recommendedAction: 'Consider in next cycle' }
    ]);

    // Report templates
    setReportTemplates([
      { id: 'template001', name: 'Basic Payroll Summary', category: 'Payroll', description: 'Basic payroll summary with essential columns', columns: ['Employee ID', 'Name', 'Basic Salary', 'Gross Salary', 'Net Salary'], filters: ['department', 'date_range'], format: ['pdf', 'excel'], isCustom: false, usageCount: 45 },
      { id: 'template002', name: 'Detailed Salary Breakup', category: 'Salary', description: 'Detailed salary breakup with all components', columns: ['Employee ID', 'Name', 'Basic', 'HRA', 'Allowances', 'Deductions', 'Net'], filters: ['department', 'grade', 'date_range'], format: ['excel'], isCustom: false, usageCount: 32 },
      { id: 'template003', name: 'Statutory Compliance Report', category: 'Compliance', description: 'All statutory deductions in one report', columns: ['Employee ID', 'Name', 'PF', 'ESI', 'PT', 'TDS', 'Total'], filters: ['date_range', 'location'], format: ['pdf', 'excel'], isCustom: false, usageCount: 28 }
    ]);

    // Available columns for report builder
    setAvailableColumns([
      { id: 'emp_id', name: 'Employee ID', category: 'Basic', type: 'text', description: 'Unique employee identifier' },
      { id: 'name', name: 'Name', category: 'Basic', type: 'text', description: 'Employee full name' },
      { id: 'department', name: 'Department', category: 'Basic', type: 'text', description: 'Department assignment' },
      { id: 'designation', name: 'Designation', category: 'Basic', type: 'text', description: 'Job title/position' },
      { id: 'location', name: 'Location', category: 'Basic', type: 'text', description: 'Work location' },
      { id: 'grade', name: 'Grade', category: 'Basic', type: 'text', description: 'Employee grade/level' },
      { id: 'basic_salary', name: 'Basic Salary', category: 'Salary', type: 'currency', description: 'Basic salary component' },
      { id: 'gross_salary', name: 'Gross Salary', category: 'Salary', type: 'currency', description: 'Total earnings before deductions' },
      { id: 'net_salary', name: 'Net Salary', category: 'Salary', type: 'currency', description: 'Take-home salary' },
      { id: 'pf_employee', name: 'PF (Employee)', category: 'Deductions', type: 'currency', description: 'Employee PF contribution' },
      { id: 'pf_employer', name: 'PF (Employer)', category: 'Deductions', type: 'currency', description: 'Employer PF contribution' },
      { id: 'esi_employee', name: 'ESI (Employee)', category: 'Deductions', type: 'currency', description: 'Employee ESI contribution' },
      { id: 'esi_employer', name: 'ESI (Employer)', category: 'Deductions', type: 'currency', description: 'Employer ESI contribution' },
      { id: 'tds', name: 'TDS', category: 'Deductions', type: 'currency', description: 'Tax deducted at source' },
      { id: 'pt', name: 'Professional Tax', category: 'Deductions', type: 'currency', description: 'State professional tax' },
      { id: 'leave_balance', name: 'Leave Balance', category: 'Attendance', type: 'number', description: 'Available leave balance' },
      { id: 'attendance_days', name: 'Attendance Days', category: 'Attendance', type: 'number', description: 'Number of days present' },
      { id: 'overtime_hours', name: 'Overtime Hours', category: 'Attendance', type: 'number', description: 'Total overtime worked' }
    ]);

    // Available filters
    setAvailableFilters([
      { id: 'department', name: 'Department', type: 'multi-select', options: departments.slice(1), description: 'Filter by department' },
      { id: 'location', name: 'Location', type: 'multi-select', options: locations.slice(1), description: 'Filter by work location' },
      { id: 'grade', name: 'Grade', type: 'multi-select', options: grades.slice(1), description: 'Filter by employee grade' },
      { id: 'date_range', name: 'Date Range', type: 'date-range', description: 'Filter by date range' },
      { id: 'salary_range', name: 'Salary Range', type: 'range', min: 0, max: 500000, description: 'Filter by salary range' },
      { id: 'employment_type', name: 'Employment Type', type: 'multi-select', options: ['Permanent', 'Contract', 'Intern', 'Consultant'], description: 'Filter by employment type' },
      { id: 'status', name: 'Employment Status', type: 'multi-select', options: ['Active', 'Inactive', 'Notice Period', 'Suspended'], description: 'Filter by employment status' }
    ]);

    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Get icon for compliance report type
  const getComplianceIcon = (formType) => {
    switch (formType) {
      case 'TDS': return 'heroicons:document-currency';
      case 'PF': return 'heroicons:banknotes';
      case 'ESI': return 'heroicons:heart';
      case 'PT': return 'heroicons:receipt-percent';
      case 'Certificate': return 'heroicons:document-check';
      default: return 'heroicons:document-text';
    }
  };

  // Group columns by category for better organization
  const groupedColumns = useMemo(() => {
    return availableColumns.reduce((groups, column) => {
      if (!groups[column.category]) {
        groups[column.category] = [];
      }
      groups[column.category].push(column);
      return groups;
    }, {});
  }, [availableColumns]);

  // Render components
  const renderKPICards = () => {
    const statutoryPercentage =
      kpis?.totalPayrollCost > 0
        ? ((kpis.statutoryDeductions / kpis.totalPayrollCost) * 100).toFixed(1)
        : "0.0";

    const kpiData = [
      {
        title: "Total Payroll Cost",
        value: formatCurrency(kpis?.totalPayrollCost || 0),
        icon: "heroicons:banknotes",
        color: "#0d6efd",
        footerText: "2.3% from last month",
        footerIcon: "heroicons:arrow-trending-down",
        footerClass: "text-success",
        bg: "linear-gradient(135deg, #f4f8ff, #ffffff)",
      },
      {
        title: "Statutory Deductions",
        value: formatCurrency(kpis?.statutoryDeductions || 0),
        icon: "heroicons:shield-check",
        color: "#198754",
        footerText: `${statutoryPercentage}% of total`,
        footerIcon: "heroicons:chart-pie",
        footerClass: "text-muted",
        bg: "linear-gradient(135deg, #f2fbf6, #ffffff)",
      },
      {
        title: "Average Salary",
        value: formatCurrency(kpis?.avgSalary || 0),
        icon: "heroicons:chart-bar",
        color: "#ffc107",
        footerText: "+5.2% year-on-year",
        footerIcon: "heroicons:arrow-trending-up",
        footerClass: "text-warning",
        bg: "linear-gradient(135deg, #fff9e6, #ffffff)",
      },
      {
        title: "Compliance Status",
        value:
          kpis?.overdueCompliance === 0
            ? "100%"
            : `${(
              ((complianceReports.length - kpis?.overdueCompliance) /
                complianceReports.length) *
              100
            ).toFixed(0)}%`,
        icon: "heroicons:document-check",
        color: "#0dcaf0",
        footerText:
          kpis?.overdueCompliance > 0
            ? `${kpis.overdueCompliance} overdue`
            : "All compliant",
        footerIcon: "heroicons:exclamation-circle",
        footerClass:
          kpis?.overdueCompliance > 0 ? "text-danger" : "text-success",
        bg: "linear-gradient(135deg, #e9f9fc, #ffffff)",
      },
    ];

    return (
      <div className="row g-4 mb-4">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="col-md-3">
            <div
              className="h-100 p-3 rounded-4 shadow-sm"
              style={{
                background: kpi.bg,
                position: "relative",
              }}
            >
              {/* Left Accent Bar */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  bottom: 12,
                  left: 0,
                  width: "4px",
                  background: kpi.color,
                  borderRadius: "0 4px 4px 0",
                }}
              />

              {/* Icon */}
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-pill mb-3"
                style={{
                  background: `${kpi.color}1A`,
                  color: kpi.color,
                  width: 42,
                  height: 42,
                }}
              >
                <Icon icon={kpi.icon} width="20" />
              </div>

              {/* Title */}
              <h6
                className="mb-1"
                style={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#212529",
                }}
              >
                {kpi.title}
              </h6>

              {/* Value */}
              <h4
                className="mb-2"
                style={{
                  fontWeight: 600,
                  color: "#2c3e50",
                  letterSpacing: "0.3px",
                }}
              >
                {kpi.value}
              </h4>

              {/* Footer */}
              <div
                className={`small d-flex align-items-center ${kpi.footerClass}`}
              >
                <Icon icon={kpi.footerIcon} className="me-1" width="14" />
                <span>{kpi.footerText}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAIInsights = () => (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-transparent border-0">
        <h5
          className="mb-1 d-flex align-items-center fw-bold"
          style={{ color: '#000' }}
        >
          <Icon
            icon="heroicons:light-bulb"
            className="me-2"
            width="20"
            style={{ color: '#000' }}
          />
          AI-Driven Insights
        </h5>

      </div>

      <div className="card-body">
        <div className="d-flex flex-column gap-3">
          {aiInsights.map(insight => {
            const severityColor =
              insight.severity === "high"
                ? "danger"
                : insight.severity === "medium"
                  ? "warning"
                  : "info";

            return (
              <div
                key={insight.id}
                className="d-flex align-items-center p-3 rounded-3 shadow-sm"
                style={{
                  background: "#fff",
                  borderLeft: `6px solid var(--bs-${severityColor})`,
                }}
              >
                {/* Icon */}
                <div
                  className={`me-3 d-flex align-items-center justify-content-center rounded-circle bg-${severityColor}-subtle`}
                  style={{ width: 42, height: 42 }}
                >
                  <Icon
                    icon={`heroicons:${insight.severity === "high"
                      ? "exclamation-triangle"
                      : insight.severity === "medium"
                        ? "exclamation-circle"
                        : "information-circle"
                      }`}
                    className={`text-${severityColor}`}
                    width="20"
                  />
                </div>

                {/* Content */}
                <div className="flex-grow-1">
                  <h6 className="fw-semibold mb-1">{insight.title}</h6>
                  <p className="small text-muted mb-0">
                    {insight.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="d-flex align-items-center gap-3 ms-3">
                  <span
                    className={`badge bg-${severityColor}-subtle text-${severityColor}`}
                  >
                    {insight.severity.toUpperCase()}
                  </span>

                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleViewInsightDetails(insight)}
                  >
                    <Icon icon="heroicons:eye" className="me-1" width="14" />

                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const reportCardColors = [
    { bg: "#F0F6FF", accent: "#3B82F6" }, // Blue
    { bg: "#F0FDF4", accent: "#22C55E" }, // Green
    { bg: "#FAF5FF", accent: "#A855F7" }, // Purple
    { bg: "#FFF7ED", accent: "#F97316" }, // Orange
    { bg: "#F0FDFA", accent: "#14B8A6" }, // Teal
    { bg: "#FDF2F8", accent: "#EC4899" }, // Pink
  ];


  const renderStandardReportsSection = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border shadow-none rounded-4">

          {/* ================= Header ================= */}
          <div className="card-header bg-transparent d-flex justify-content-between align-items-center px-4 pt-4 pb-3">
            <div>
              <h5
                className="mb-1 d-flex align-items-center fw-bold"
                style={{ color: '#000' }}
              >
                <Icon
                  icon="heroicons:document-text"
                  className="me-2"
                  width="20"
                  style={{ color: '#000' }}
                />
                Standard Payroll Reports
              </h5>


              <div className="small text-muted">
                Core payroll & operational reports as per HRMS spec 4.9
              </div>
            </div>

            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={handleAddReport}
            >
              <Icon icon="heroicons:plus" className="me-2" />
              Add Report
            </button>
          </div>


          {/* ================= Filters ================= */}
          <div className="px-4 pb-3 pt-3 border-bottom">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  {departments.map(d => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                >
                  {periods.map(p => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <button
                  className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                  onClick={() => handleExportData("excel")}
                >
                  <Icon icon="heroicons:document-arrow-down" className="me-2" width="16" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* ================= Table ================= */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 40 }} />
                  <th>Report Name</th>
                  <th>Department</th>
                  <th>Frequency</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {standardReports.map((report) => (
                  <React.Fragment key={report.id}>
                    {/* ================= Main Row ================= */}
                    <tr>
                      <td>
                        <button
                          className="btn btn-sm btn-light"
                          onClick={() => toggleExpand(report.id)}
                        >
                          <Icon
                            icon={
                              expandedReportId === report.id
                                ? "heroicons:chevron-down"
                                : "heroicons:chevron-right"
                            }
                          />
                        </button>
                      </td>

                      <td className="fw-semibold">{report.name}</td>
                      <td>{report.department}</td>
                      <td>{report.frequency}</td>
                      <td>{getStatusBadge(report.status)}</td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleGenerateReport(report)}
                        >
                          <Icon icon="heroicons:play" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleEditReport(report, "standard")}
                        >
                          <Icon icon="heroicons:pencil-square" />
                        </button>
                      </td>
                    </tr>

                    {/* ================= Expanded Row ================= */}
                    {expandedReportId === report.id && (
                      <tr className="bg-light">
                        <td colSpan="6">
                          <div className="p-3 rounded-3 bg-white shadow-sm">

                            <p className="mb-2 text-muted">
                              {report.description}
                            </p>

                            <div className="d-flex flex-wrap gap-4 small text-muted mb-3">
                              <div>
                                <Icon icon="heroicons:clock" className="me-1" />
                                Last Generated: {formatDate(report.lastGenerated)}
                              </div>
                              <div>
                                <Icon icon="heroicons:document-text" className="me-1" />
                                Format: {Array.isArray(report.format)
                                  ? report.format.join(", ")
                                  : report.format}
                              </div>
                            </div>

                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleGenerateReport(report)}
                              >
                                Generate
                              </button>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleScheduleReport(report)}
                              >
                                Schedule
                              </button>
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEditReport(report, "standard")}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDeleteReport(
                                    report.id,
                                    "standard",
                                    report.name
                                  )
                                }
                              >
                                Delete
                              </button>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= Empty State ================= */}
          {standardReports.length === 0 && (
            <div className="text-center py-5 text-muted">
              <Icon icon="heroicons:document-text" className="display-6 mb-3" />
              <h6 className="fw-semibold text-dark">No reports found</h6>
              <p>Try adjusting filters or search keywords</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );



  const renderComplianceReportsSection = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border shadow-none rounded-4">

          {/* ================= Header ================= */}
          <div className="card-header bg-transparent d-flex justify-content-between align-items-center px-4 pt-4 pb-3">
            <div>
              <h5
                className="mb-1 d-flex align-items-center fw-bold"
                style={{ color: '#000' }}
              >
                <Icon
                  icon="heroicons:shield-check"
                  className="me-2"
                  width="20"
                  style={{ color: '#000' }}
                />
                Statutory Compliance Reports
              </h5>
              <div className="small text-muted">
                PF, ESI, PT, TDS filings and certificates
              </div>
            </div>

            <button className="btn btn-outline-danger d-flex align-items-center">
              <Icon
                icon="heroicons:exclamation-triangle"
                className="me-2"
                width="16"
              />
              {kpis.overdueCompliance} Overdue
            </button>
          </div>

          {/* Body */}
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">

                {/* Table Head – NO BACKGROUND COLOR */}
                <thead className="border-bottom">
                  <tr>
                    <th className="fw-bold " style={{ width: '25%' }}>
                      Report Name
                    </th>
                    <th className="fw-bold " style={{ width: '10%' }}>
                      Type
                    </th>
                    <th className="fw-bold " style={{ width: '10%' }}>
                      Frequency
                    </th>
                    <th className="fw-bold " style={{ width: '12%' }}>
                      Due Date
                    </th>
                    <th className="fw-bold " style={{ width: '10%' }}>
                      Status
                    </th>
                    <th className="fw-bold " style={{ width: '10%' }}>
                      Period
                    </th>
                    <th className="fw-bold  text-center" style={{ width: '8%' }}>
                      Auto
                    </th>
                    <th className="fw-bold  text-end" style={{ width: '15%' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complianceReports.map((report) => {
                    const isOverdue =
                      report.dueDate !== 'N/A' &&
                      new Date(report.dueDate) < new Date() &&
                      report.status !== 'submitted';

                    const typeIcon =
                      getComplianceIcon(report.formType) || 'heroicons:document-text';

                    return (
                      <tr key={report.id}>

                        {/* Report Name */}
                        <td className="align-middle">
                          <div className="fw-semibold d-flex align-items-center">
                            <Icon
                              icon="heroicons:shield-check"
                              className="me-2 text-muted"
                              width="16"
                            />
                            {report.name}
                          </div>
                        </td>

                        {/* Type */}
                        <td className="align-middle">
                          <span className="badge bg-light text-dark border d-inline-flex align-items-center">
                            <Icon icon={typeIcon} className="me-1" width="14" />
                            {report.formType || report.type}
                          </span>
                        </td>

                        {/* Frequency */}
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <Icon
                              icon="heroicons:calendar"
                              className="me-2 text-muted"
                              width="14"
                            />
                            {report.frequency}
                          </div>
                        </td>

                        {/* Due Date */}
                        <td className="align-middle">
                          <div
                            className={`d-flex align-items-center fw-semibold ${isOverdue ? 'text-danger' : ''
                              }`}
                          >
                            <Icon
                              icon="heroicons:calendar-days"
                              className="me-2"
                              width="14"
                            />
                            {formatDate(report.dueDate)}
                          </div>

                          {isOverdue && (
                            <div className="small text-danger d-flex align-items-center mt-1">
                              <Icon
                                icon="heroicons:exclamation-circle"
                                className="me-1"
                                width="14"
                              />
                              Overdue
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="align-middle">
                          {getStatusBadge(report.status)}
                        </td>

                        {/* Period */}
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <Icon
                              icon="heroicons:clock"
                              className="me-2 text-muted"
                              width="14"
                            />
                            {report.month ||
                              report.year ||
                              report.quarter ||
                              'N/A'}
                          </div>
                        </td>
                        <td className="align-middle">
                          <div className="d-flex justify-content-center align-items-center">
                            {report.autoGenerated ? (
                              <Icon
                                icon="heroicons:check-circle"
                                className="text-success"
                                width="18"
                              />
                            ) : (
                              <Icon
                                icon="heroicons:x-circle"
                                className="text-muted"
                                width="18"
                              />
                            )}
                          </div>
                        </td>


                        {/* Actions */}
                        <td className="align-middle">
                          <div className="d-flex justify-content-center pe-3 gap-2">
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleDownloadComplianceReport(report)}
                              title="Download"
                            >
                              <Icon icon="heroicons:arrow-down-tray" width="14" />
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDeleteReport(report.id, 'compliance', report.name)
                              }
                              title="Delete"
                            >
                              <Icon icon="heroicons:trash" width="14" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}

                  {/* Empty State */}
                  {complianceReports.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        <Icon
                          icon="heroicons:shield-check"
                          width="36"
                          className="mb-2"
                        />
                        <div className="fw-semibold text-dark">
                          No compliance reports found
                        </div>
                        <div className="small">
                          Compliance reports will appear here
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  const cardColors = [
    { bg: "#F0F6FF", accent: "#3B82F6" }, // Blue
    { bg: "#F0FDF4", accent: "#22C55E" }, // Green
    { bg: "#FAF5FF", accent: "#A855F7" }, // Purple
    { bg: "#FFF7ED", accent: "#F97316" }, // Orange
    { bg: "#F0FDFA", accent: "#14B8A6" }, // Teal
    { bg: "#FDF2F8", accent: "#EC4899" }, // Pink
  ];

  const renderAnalyticsSection = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm rounded-4">
          {/* ================= Header ================= */}
          <div className="card-header bg-transparent d-flex justify-content-between align-items-center px-4 pt-4 pb-3">
            <div>
              <h5
                className="mb-1 d-flex align-items-center fw-bold"
                style={{ color: '#000' }}
              >
                <Icon
                  icon="heroicons:chart-bar"
                  className="me-2"
                  width="20"
                  style={{ color: '#000' }}
                />
                Payroll Analytics Dashboards
              </h5>
              <div className="small text-muted">
                Interactive dashboards and forecasts
              </div>
            </div>

          </div>

          {/* ================= Body ================= */}
          <div className="card-body px-4 pb-4">
            <div className="row g-4">
              {analyticsDashboards.map((dashboard, index) => {
                const color = cardColors[index % cardColors.length];

                return (
                  <div key={dashboard.id} className="col-md-6">
                    <div
                      className="card h-100 border-0 rounded-4"
                      style={{
                        backgroundColor: color.bg,
                        position: "relative",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        transition: "all 0.25s ease",
                      }}
                      onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(0,0,0,0.1)")
                      }
                      onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.06)")
                      }
                    >
                      {/* Accent bar */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "5px",
                          backgroundColor: color.accent,
                          borderTopLeftRadius: "1rem",
                          borderBottomLeftRadius: "1rem",
                        }}
                      />

                      <div className="card-body p-4">
                        {/* ================= Title ================= */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 className="fw-semibold mb-1 d-flex align-items-center">
                              <Icon
                                icon="heroicons:chart-bar"
                                className="me-2"
                                width="18"
                                style={{ color: color.accent }}
                              />
                              {dashboard.name}
                            </h6>
                            <p className="small text-muted mb-0">
                              {dashboard.description}
                            </p>
                          </div>

                          {/* Dropdown */}
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-light rounded-circle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <Icon icon="heroicons:ellipsis-vertical" width="18" />
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() =>
                                    handleEditReport(dashboard, "analytics")
                                  }
                                >
                                  <Icon icon="heroicons:pencil-square" className="me-2" width="16" />
                                  Edit Dashboard
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() => handleScheduleReport(dashboard)}
                                >
                                  <Icon icon="heroicons:clock" className="me-2" width="16" />
                                  Schedule
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button
                                  className="dropdown-item text-danger d-flex align-items-center"
                                  onClick={() =>
                                    handleDeleteReport(
                                      dashboard.id,
                                      "analytics",
                                      dashboard.name
                                    )
                                  }
                                >
                                  <Icon icon="heroicons:trash" className="me-2" width="16" />
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* ================= Meta ================= */}
                        <div className="d-flex flex-wrap gap-3 mb-3 small text-muted">
                          <div className="d-flex align-items-center">
                            <Icon icon="heroicons:chart-bar" className="me-1" width="14" />
                            {dashboard.chartType}
                          </div>
                          <div className="d-flex align-items-center">
                            <Icon icon="heroicons:arrow-path" className="me-1" width="14" />
                            {dashboard.refreshRate}
                          </div>
                          <div className="d-flex align-items-center">
                            <Icon icon="heroicons:lock-closed" className="me-1" width="14" />
                            {dashboard.accessLevel}
                          </div>
                        </div>

                        {/* ================= Footer ================= */}
                        <div className="d-flex justify-content-between align-items-center small text-muted">
                          <div>
                            Metrics:{" "}
                            {(dashboard.metrics || []).slice(0, 3).join(", ")}
                            {(dashboard.metrics || []).length > 3 && "…"}
                          </div>
                          <div className="d-flex align-items-center">
                            <Icon icon="heroicons:calendar" className="me-1" width="14" />
                            {formatDate(dashboard.lastUpdated)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  const renderReportBuilder = () => (
    <div className="card mt-3 border shadow-none">
      {/* ================= Header ================= */}
      <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-4 pt-4 pb-3">
        <div>
          <h5
            className="mb-1 d-flex align-items-center fw-bold"
            style={{ color: '#000' }}
          >
            <Icon
              icon="heroicons:wrench-screwdriver"
              className="me-2"
              width="20"
              style={{ color: '#000' }}
            />
            Custom Report Builder
          </h5>
          <div className="small text-muted">
            Build custom reports by selecting columns, filters, and formatting options
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-3">
            <div className="list-group mb-3">
              <button
                className={`list-group-item list-group-item-action d-flex align-items-center ${builderStep === 1 ? 'active' : ''}`}
                onClick={() => setBuilderStep(1)}
              >
                <div className="me-3">
                  <div className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${builderStep === 1 ? 'bg-white text-primary' : 'bg-primary-subtle text-primary'}`}
                    style={{ width: '36px', height: '36px' }}>
                    <Icon icon="heroicons:document-text" width="18" />
                  </div>
                </div>
                <div className="text-start">
                  <div className="fw-semibold">Report Details</div>
                  <div className="small text-muted">Name, category, description</div>
                </div>
              </button>

              <button
                className={`list-group-item list-group-item-action d-flex align-items-center ${builderStep === 2 ? 'active' : ''}`}
                onClick={() => {
                  setBuilderStep(2);
                  // Reset checkbox selections for step 2
                  setSelectedColumns([]);
                }}
              >
                <div className="me-3">
                  <div className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${builderStep === 2 ? 'bg-white text-primary' : 'bg-primary-subtle text-primary'}`}
                    style={{ width: '36px', height: '36px' }}>
                    <Icon icon="heroicons:table-cells" width="18" />
                  </div>
                </div>
                <div className="text-start">
                  <div className="fw-semibold">Columns & Data</div>
                  <div className="small text-muted">Select data fields</div>
                </div>
              </button>

              <button
                className={`list-group-item list-group-item-action d-flex align-items-center ${builderStep === 3 ? 'active' : ''}`}
                onClick={() => {
                  setBuilderStep(3);
                  // Reset filter selections for step 3
                  setFilters([]);
                  setSorting([]);
                }}
              >
                <div className="me-3">
                  <div className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${builderStep === 3 ? 'bg-white text-primary' : 'bg-primary-subtle text-primary'}`}
                    style={{ width: '36px', height: '36px' }}>
                    <Icon icon="heroicons:funnel" width="18" />
                  </div>
                </div>
                <div className="text-start">
                  <div className="fw-semibold">Filters & Sorting</div>
                  <div className="small text-muted">Apply filters and sorting</div>
                </div>
              </button>

              <button
                className={`list-group-item list-group-item-action d-flex align-items-center ${builderStep === 4 ? 'active' : ''}`}
                onClick={() => {
                  setBuilderStep(4);
                  // Reset format and schedule selections for step 4
                  setExportFormat('csv');
                  setScheduleSettings(null);
                }}
              >
                <div className="me-3">
                  <div className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${builderStep === 4 ? 'bg-white text-primary' : 'bg-primary-subtle text-primary'}`}
                    style={{ width: '36px', height: '36px' }}>
                    <Icon icon="heroicons:cog" width="18" />
                  </div>
                </div>
                <div className="text-start">
                  <div className="fw-semibold">Format & Schedule</div>
                  <div className="small text-muted">Export and scheduling options</div>
                </div>
              </button>
            </div>
          </div>

          <div className="col-md-9">
            <div className="border rounded p-4 h-100">
              {builderStep === 1 && (
                <div>
                  <h6 className="mb-4 d-flex align-items-center" style={{ color: '#212529', fontSize: '1rem' }}>
                    <Icon icon="heroicons:document-text" className="me-2 text-primary" width="20" />
                    <b>Report Details</b>
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label className="form-label d-flex align-items-center fw-semibold" style={{ color: '#495057' }}>
                        <Icon icon="heroicons:tag" className="me-2 text-muted" width="16" />
                        Report Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter report name"
                        value={reportBuilder.name}
                        onChange={(e) => setReportBuilder({ ...reportBuilder, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label d-flex align-items-center fw-semibold" style={{ color: '#495057' }}>
                        <Icon icon="heroicons:pencil" className="me-2 text-muted" width="16" />
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Describe this report"
                        value={reportBuilder.description}
                        onChange={(e) => setReportBuilder({ ...reportBuilder, description: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center fw-semibold" style={{ color: '#495057' }}>
                        <Icon icon="heroicons:folder" className="me-2 text-muted" width="16" />
                        Category
                      </label>
                      <select
                        className="form-select"
                        value={reportBuilder.category}
                        onChange={(e) => setReportBuilder({ ...reportBuilder, category: e.target.value })}
                      >
                        <option value="Payroll">Payroll</option>
                        <option value="Compliance">Compliance</option>
                        <option value="Analytics">Analytics</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center fw-semibold" style={{ color: '#495057' }}>
                        <Icon icon="heroicons:database" className="me-2 text-muted" width="16" />
                        Data Source
                      </label>
                      <select
                        className="form-select"
                        value={reportBuilder.dataSource}
                        onChange={(e) => setReportBuilder({ ...reportBuilder, dataSource: e.target.value })}
                      >
                        <option value="payroll">Payroll Data</option>
                        <option value="employee">Employee Master</option>
                        <option value="attendance">Attendance Records</option>
                        <option value="compliance">Compliance Data</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {builderStep === 2 && (
                <div>
                  <h6
                    className="mb-4 d-flex align-items-center"
                    style={{ color: '#212529', fontSize: '1rem' }}
                  >
                    <Icon icon="heroicons:table-cells" className="me-2 text-primary" width="20" />
                    <b>Select Data Columns</b>
                  </h6>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">
                        Select columns to include in your report
                      </span>
                      <span className="badge bg-primary">
                        {selectedColumns.length} column(s) selected
                      </span>
                    </div>

                    {Object.entries(groupedColumns).map(([category, columns]) => (
                      <div key={category} className="mb-4">
                        {/* Category Header (count removed) */}
                        <div className="d-flex align-items-center mb-3">
                          <h6 className="mb-0 fw-semibold text-primary">
                            {category}
                          </h6>
                        </div>

                        <div className="row g-2">
                          {columns.map((column) => (
                            <div key={column.id} className="col-md-6">
                              <div
                                className="border rounded p-3 mb-2 d-flex align-items-start"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  if (selectedColumns.includes(column.id)) {
                                    setSelectedColumns(
                                      selectedColumns.filter((id) => id !== column.id)
                                    );
                                  } else {
                                    setSelectedColumns([...selectedColumns, column.id]);
                                  }
                                }}
                              >
                                {/* Custom checkbox */}
                                <div
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px',
                                    marginTop: '2px',
                                    backgroundColor: selectedColumns.includes(column.id)
                                      ? '#0d6efd'
                                      : '#fff',
                                    flexShrink: 0
                                  }}
                                >
                                  {selectedColumns.includes(column.id) && (
                                    <svg width="12" height="12" viewBox="0 0 12 12">
                                      <path
                                        d="M10 3L4.5 8.5L2 6"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>

                                <div className="w-100">
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="fw-semibold d-flex align-items-center">
                                      <Icon
                                        icon={`heroicons:${column.category === 'Salary'
                                          ? 'banknotes'
                                          : column.category === 'Deductions'
                                            ? 'minus-circle'
                                            : column.category === 'Attendance'
                                              ? 'calendar'
                                              : 'user'
                                          }`}
                                        className="me-2 text-muted"
                                        width="16"
                                      />
                                      {column.name}
                                    </div>

                                    <span className="badge bg-info-subtle text-info small">
                                      {column.type}
                                    </span>
                                  </div>

                                  <div className="small text-muted">
                                    {column.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {builderStep === 3 && (
                <div>
                  <h6 className="mb-4 d-flex align-items-center" style={{ color: '#212529', fontSize: '1rem' }}>
                    <Icon icon="heroicons:funnel" className="me-2 text-primary" width="20" />
                    <b>Apply Filters</b>
                  </h6>
                  <div className="row g-4">
                    <div className="col-md-12">
                      <div className="card border">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center" style={{ color: '#212529' }}>
                            <Icon icon="heroicons:building-office" className="me-2" width="16" />
                            <b>Department Filter</b>
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            {departments.slice(1).map(dept => (
                              <div key={dept} className="col-md-4 mb-2">
                                <div
                                  className="d-flex align-items-center"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    if (selectedFilters.includes(dept)) {
                                      setSelectedFilters(selectedFilters.filter(f => f !== dept));
                                    } else {
                                      setSelectedFilters([...selectedFilters, dept]);
                                    }
                                  }}
                                >
                                  {/* Custom checkbox with tick mark */}
                                  <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px',
                                    backgroundColor: selectedFilters.includes(dept) ? '#0d6efd' : 'white',
                                    flexShrink: 0
                                  }}>
                                    {selectedFilters.includes(dept) && (
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>
                                  <span>{dept}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center" style={{ color: '#212529' }}>
                            <Icon icon="heroicons:calendar" className="me-2" width="16" />
                            <b>Date Range</b>
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label small" style={{ color: '#495057' }}>Start Date</label>
                              <input type="date" className="form-control" />
                            </div>
                            <div className="col-12">
                              <label className="form-label small" style={{ color: '#495057' }}>End Date</label>
                              <input type="date" className="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center" style={{ color: '#212529' }}>
                            <Icon icon="heroicons:currency-rupee" className="me-2" width="16" />
                            <b>Salary Range</b>
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label small" style={{ color: '#495057' }}>Minimum Salary</label>
                              <input type="number" className="form-control" placeholder="0" min="0" />
                            </div>
                            <div className="col-12">
                              <label className="form-label small" style={{ color: '#495057' }}>Maximum Salary</label>
                              <input type="number" className="form-control" placeholder="500000" min="0" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {builderStep === 4 && (
                <div>
                  <h6 className="mb-4 d-flex align-items-center" style={{ color: '#212529', fontSize: '1rem' }}>
                    <Icon icon="heroicons:cog" className="me-2 text-primary" width="20" />
                    <b>Format & Schedule</b>
                  </h6>
                  <div className="row g-4">
                    <div className="col-md-12">
                      <div className="card border">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center" style={{ color: '#212529' }}>
                            <Icon icon="heroicons:document-arrow-down" className="me-2" width="16" />
                            <b>Export Format</b>
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-4">
                              <div
                                className="border rounded p-3 h-100 d-flex flex-column"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  if (reportBuilder.format.includes('pdf')) {
                                    setReportBuilder({ ...reportBuilder, format: reportBuilder.format.filter(f => f !== 'pdf') });
                                  } else {
                                    setReportBuilder({ ...reportBuilder, format: [...reportBuilder.format, 'pdf'] });
                                  }
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                  {/* Custom checkbox with tick mark */}
                                  <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px',
                                    backgroundColor: reportBuilder.format.includes('pdf') ? '#0d6efd' : 'white',
                                    flexShrink: 0
                                  }}>
                                    {reportBuilder.format.includes('pdf') && (
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>

                                  <div className="d-flex align-items-center">
                                    <Icon icon="heroicons:document-text" className="me-2 text-danger" width="24" />
                                    <span className="fw-semibold">PDF</span>
                                  </div>
                                </div>
                                <div className="small text-muted">Portable Document Format</div>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div
                                className="border rounded p-3 h-100 d-flex flex-column"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  if (reportBuilder.format.includes('excel')) {
                                    setReportBuilder({ ...reportBuilder, format: reportBuilder.format.filter(f => f !== 'excel') });
                                  } else {
                                    setReportBuilder({ ...reportBuilder, format: [...reportBuilder.format, 'excel'] });
                                  }
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                  {/* Custom checkbox with tick mark */}
                                  <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px',
                                    backgroundColor: reportBuilder.format.includes('excel') ? '#0d6efd' : 'white',
                                    flexShrink: 0
                                  }}>
                                    {reportBuilder.format.includes('excel') && (
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>

                                  <div className="d-flex align-items-center">
                                    <Icon icon="heroicons:table-cells" className="me-2 text-success" width="24" />
                                    <span className="fw-semibold">Excel</span>
                                  </div>
                                </div>
                                <div className="small text-muted">Microsoft Excel Format</div>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div
                                className="border rounded p-3 h-100 d-flex flex-column"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  if (reportBuilder.format.includes('csv')) {
                                    setReportBuilder({ ...reportBuilder, format: reportBuilder.format.filter(f => f !== 'csv') });
                                  } else {
                                    setReportBuilder({ ...reportBuilder, format: [...reportBuilder.format, 'csv'] });
                                  }
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                  {/* Custom checkbox with tick mark */}
                                  <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #dee2e6',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '12px',
                                    backgroundColor: reportBuilder.format.includes('csv') ? '#0d6efd' : 'white',
                                    flexShrink: 0
                                  }}>
                                    {reportBuilder.format.includes('csv') && (
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    )}
                                  </div>

                                  <div className="d-flex align-items-center">
                                    <Icon icon="heroicons:document" className="me-2 text-primary" width="24" />
                                    <span className="fw-semibold">CSV</span>
                                  </div>
                                </div>
                                <div className="small text-muted">Comma Separated Values</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="card border">
                        <div className="card-header bg-light">
                          <h6 className="mb-0 d-flex align-items-center" style={{ color: '#212529' }}>
                            <Icon icon="heroicons:clock" className="me-2" width="16" />
                            <b>Schedule Frequency</b>
                          </h6>
                        </div>
                        <div className="card-body">
                          <select
                            className="form-select"
                            value={reportBuilder.schedule}
                            onChange={(e) => setReportBuilder({ ...reportBuilder, schedule: e.target.value })}
                          >
                            <option value="none">Don't schedule</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annually">Annually</option>
                          </select>
                          {reportBuilder.schedule !== 'none' && (
                            <div className="alert alert-warning mt-3">
                              <div className="d-flex align-items-center">
                                <Icon icon="heroicons:information-circle" className="me-2" width="18" />
                                <span>Report will be automatically generated and sent to recipients on the scheduled frequency.</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div
                        className="d-flex align-items-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setReportBuilder({ ...reportBuilder, dashboardWidget: !reportBuilder.dashboardWidget })}
                      >
                        {/* Custom checkbox with tick mark */}
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid #dee2e6',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          backgroundColor: reportBuilder.dashboardWidget ? '#0d6efd' : 'white',
                          flexShrink: 0
                        }}>
                          {reportBuilder.dashboardWidget && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>

                        <div className="d-flex align-items-center">
                          <Icon icon="heroicons:chart-bar" className="me-2" width="16" />
                          <span>Add as dashboard widget</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={() => setBuilderStep(prev => Math.max(1, prev - 1))}
                  disabled={builderStep === 1}
                >
                  <Icon icon="heroicons:arrow-left" className="me-2" width="16" />
                  Previous
                </button>

                <div>
                  {builderStep < 4 && (
                    <button
                      className="btn btn-primary d-flex align-items-center"
                      onClick={() => setBuilderStep(prev => Math.min(4, prev + 1))}
                    >
                      Next
                      <Icon icon="heroicons:arrow-right" className="ms-2" width="16" />
                    </button>
                  )}
                  {builderStep === 4 && (
                    <button
                      className="btn btn-success d-flex align-items-center"
                      onClick={() => {
                        const newCustomReport = {
                          id: `CUSTOM_${Date.now()}`,
                          name: reportBuilder.name || 'New Custom Report',
                          description: reportBuilder.description,
                          category: reportBuilder.category,
                          columns: selectedColumns,
                          filters: selectedFilters,
                          format: reportBuilder.format,
                          schedule: reportBuilder.schedule,
                          createdDate: new Date().toISOString(),
                          isCustom: true,
                          dashboardWidget: reportBuilder.dashboardWidget
                        };
                        setCustomReports([...customReports, newCustomReport]);
                        setActiveSection('configure');
                        alert('Custom report created successfully!');

                        // Reset builder
                        setReportBuilder({
                          step: 1,
                          name: '',
                          description: '',
                          category: 'Payroll',
                          dataSource: 'payroll',
                          selectedColumns: [],
                          selectedFilters: [],
                          grouping: [],
                          calculations: [],
                          format: ['pdf', 'excel'],
                          schedule: 'none',
                          recipients: [],
                          dashboardWidget: false
                        });
                        setSelectedColumns([]);
                        setSelectedFilters([]);
                        setBuilderStep(1);
                      }}
                    >
                      <Icon icon="heroicons:check" className="me-2" width="16" />
                      Create Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <div className="mb-4">
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button className={`btn ${activeSection === 'standard' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
          onClick={() => setActiveSection('standard')}>
          <Icon icon="heroicons:document-text" className="me-2" width="16" />
          Standard Reports
        </button>
        <button className={`btn ${activeSection === 'compliance' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
          onClick={() => setActiveSection('compliance')}>
          <Icon icon="heroicons:shield-check" className="me-2" width="16" />
          Compliance
        </button>
        <button className={`btn ${activeSection === 'analytics' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
          onClick={() => setActiveSection('analytics')}>
          <Icon icon="heroicons:chart-bar" className="me-2" width="16" />
          Analytics
        </button>
        <button className={`btn ${activeSection === 'generated' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
          onClick={() => setActiveSection('generated')}>
          <Icon icon="heroicons:archive-box" className="me-2" width="16" />
          Generated
        </button>
        <button className={`btn ${activeSection === 'scheduled' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
          onClick={() => setActiveSection('scheduled')}>
          <Icon icon="heroicons:clock" className="me-2" width="16" />
          Scheduled
        </button>
        <button className={`btn ${activeSection === 'configure' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
          onClick={() => setActiveSection('configure')}>
          <Icon icon="heroicons:cog" className="me-2" width="16" />
          Configuration
        </button>
        <button className={`btn ${activeSection === 'builder' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
          onClick={() => setActiveSection('builder')}>
          <Icon icon="heroicons:wrench-screwdriver" className="me-2" width="16" />
          Report Builder
        </button>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1 d-flex align-items-center" style={{ color: '#212529' }}>
              <Icon icon="heroicons:chart-bar" className="me-2" width="22" />
              <b>Payroll Reports & Analytics</b>
            </h5>
            <p className="text-muted mb-0 d-flex align-items-center">
              <Icon icon="heroicons:information-circle" className="me-1" width="16" />
              Comprehensive payroll reporting system with AI-driven insights
            </p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary d-flex align-items-center" onClick={handleAddReport}>
              <Icon icon="heroicons:plus" className="me-2" width="16" />
              Add Report
            </button>
            <button
              className="btn btn-outline-primary d-flex align-items-center"
              onClick={() => handleExportData('excel')}
            >
              <Icon icon="heroicons:document-arrow-down" className="me-2" width="16" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {renderKPICards()}

      {/* AI Insights */}
      {renderAIInsights()}

      {/* Navigation */}
      {renderNavigation()}

      {/* Main Content Area */}
      <div className="row">
        <div className="col-12">
          {activeSection === 'standard' && renderStandardReportsSection()}
          {activeSection === 'compliance' && renderComplianceReportsSection()}
          {activeSection === 'analytics' && renderAnalyticsSection()}
          {activeSection === 'builder' && renderReportBuilder()}
          {activeSection === 'generated' && (
            <div className="card border shadow-none rounded-4">
              {/* ================= Header ================= */}
              <div className="card-header bg-transparent d-flex justify-content-between align-items-center px-4 pt-4 pb-3">
                <div>
                  <h5
                    className="mb-1 d-flex align-items-center fw-bold"
                    style={{ color: '#000' }}
                  >
                    <Icon
                      icon="heroicons:archive-box"
                      className="me-2"
                      width="20"
                      style={{ color: '#000' }}
                    />
                    Generated Reports
                  </h5>
                  <div className="small text-muted">
                    History of generated reports
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">


                    <thead className="border-bottom">
                      <tr>
                        <th className="fw-bold" style={{ width: '20%' }}>
                          Report Name
                        </th>
                        <th className="fw-bold" style={{ width: '15%' }}>
                          Period
                        </th>
                        <th className="fw-bold" style={{ width: '15%' }}>
                          Generated Date
                        </th>
                        <th className="fw-bold" style={{ width: '15%' }}>
                          Generated By
                        </th>
                        <th className="fw-bold" style={{ width: '10%' }}>
                          Format
                        </th>
                        <th className="fw-bold" style={{ width: '10%' }}>
                          Size
                        </th>
                        <th className="fw-bold" style={{ width: '10%' }}>
                          Downloads
                        </th>
                        <th className="fw-bold text-end" style={{ width: '15%' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {generatedReports.map((report) => (
                        <tr key={report.id}>
                          <td>
                            <div className="fw-semibold d-flex align-items-center">
                              <Icon
                                icon="heroicons:document-text"
                                className="me-2 text-muted"
                                width="16"
                              />
                              {report.reportName}
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <Icon
                                icon="heroicons:calendar"
                                className="me-1 text-muted"
                                width="14"
                              />
                              {report.period}
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <Icon
                                icon="heroicons:clock"
                                className="me-1 text-muted"
                                width="14"
                              />
                              {formatDate(report.generatedDate)}
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <Icon
                                icon="heroicons:user"
                                className="me-1 text-muted"
                                width="14"
                              />
                              {report.generatedBy}
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <Icon
                                icon={`heroicons:${report.format === 'PDF'
                                  ? 'document-text'
                                  : 'table-cells'
                                  }`}
                                className="me-1 text-muted"
                                width="14"
                              />
                              {report.format}
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <Icon
                                icon="heroicons:archive-box"
                                className="me-1 text-muted"
                                width="14"
                              />
                              {report.size}
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <Icon
                                icon="heroicons:arrow-down-tray"
                                className="me-1 text-muted"
                                width="14"
                              />
                              {report.downloadCount}
                            </div>
                          </td>

                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center"
                              onClick={() =>
                                handleDownloadGeneratedReport(report)
                              }
                            >
                              <Icon
                                icon="heroicons:arrow-down-tray"
                                width="14"
                                className="me-1"
                              />

                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* Empty State */}
                      {generatedReports.length === 0 && (
                        <tr>
                          <td colSpan="8" className="text-center py-5 text-muted">
                            <Icon
                              icon="heroicons:document-text"
                              width="36"
                              className="mb-2"
                            />
                            <div className="fw-semibold text-dark">
                              No generated reports
                            </div>
                            <div className="small">
                              Generated reports will appear here
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'scheduled' && (
            <div className="card border shadow-none rounded-4">
              {/* ================= Header ================= */}
              <div className="card-header bg-transparent d-flex justify-content-between align-items-center px-4 pt-4 pb-3">
                <div>
                  <h5
                    className="mb-1 d-flex align-items-center fw-bold"
                    style={{ color: '#000' }}
                  >
                    <Icon
                      icon="heroicons:clock"
                      className="me-2"
                      width="20"
                      style={{ color: '#000' }}
                    />
                    Scheduled Reports
                  </h5>
                  <div className="small text-muted">
                    Automatically scheduled reports with email delivery
                  </div>
                </div>
              </div>

              {/* ================= Body ================= */}
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    {/* ================= Table Head ================= */}
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "20%" }}>Report Name</th>
                        <th style={{ width: "15%" }}>Schedule</th>
                        <th style={{ width: "15%" }}>Next Run</th>
                        <th style={{ width: "20%" }}>Recipients</th>
                        <th style={{ width: "10%" }}>Format</th>
                        <th style={{ width: "10%" }}>Status</th>
                        <th style={{ width: "10%" }} className="text-end">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    {/* ================= Table Body ================= */}
                    <tbody>
                      {scheduledReports.map((report) => (
                        <tr key={report.id}>
                          {/* Report Name */}
                          <td>
                            <div className="fw-semibold d-flex align-items-center">
                              <Icon
                                icon="heroicons:document-text"
                                className="me-2 text-muted"
                                width="16"
                              />
                              {report.reportName}
                            </div>
                          </td>

                          {/* Schedule */}
                          <td>
                            <div className="d-flex align-items-center text-muted">
                              <Icon
                                icon="heroicons:calendar-days"
                                className="me-1"
                                width="14"
                              />
                              {report.schedule}
                            </div>
                          </td>

                          {/* Next Run */}
                          <td>
                            <div className="d-flex align-items-center text-muted">
                              <Icon
                                icon="heroicons:clock"
                                className="me-1"
                                width="14"
                              />
                              {formatDate(report.nextRun)}
                            </div>
                          </td>

                          {/* Recipients */}
                          <td>
                            <div className="small text-muted">
                              {report.recipients.map((r, i) => (
                                <div key={i} className="d-flex align-items-center">
                                  <Icon
                                    icon="heroicons:envelope"
                                    className="me-1"
                                    width="12"
                                  />
                                  {r}
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Format */}
                          <td>
                            <div className="d-flex align-items-center text-muted">
                              <Icon
                                icon="heroicons:document-text"
                                className="me-1"
                                width="14"
                              />
                              {report.format}
                            </div>
                          </td>

                          {/* Status */}
                          <td>{getStatusBadge(report.status)}</td>

                          {/* Actions */}
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEditScheduledReport(report)}
                                title="Edit"
                              >
                                <Icon icon="heroicons:pencil-square" width="14" />
                              </button>

                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleToggleScheduleStatus(report)}
                                title={report.status === "active" ? "Pause" : "Activate"}
                              >
                                <Icon
                                  icon={
                                    report.status === "active"
                                      ? "heroicons:pause"
                                      : "heroicons:play"
                                  }
                                  width="14"
                                />
                              </button>

                              <button
                                className="btn btn-outline-danger"
                                onClick={() =>
                                  handleDeleteReport(
                                    report.id,
                                    "scheduled",
                                    report.reportName
                                  )
                                }
                                title="Delete"
                              >
                                <Icon icon="heroicons:trash" width="14" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {activeSection === 'configure' && (
            <div className="row">
              {/* Quick Actions - Now placed above configuration */}
              <div className="col-12 mb-4">
                <div className="card border shadow-none">
                  {/* ================= Header ================= */}
                  <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-4 pt-4 pb-3">
                    <div>
                      <h5
                        className="mb-1 d-flex align-items-center fw-bold"
                        style={{ color: '#000' }}
                      >
                        <Icon
                          icon="heroicons:bolt"
                          className="me-2"
                          width="20"
                          style={{ color: '#000' }}
                        />
                        Quick Actions
                      </h5>
                      <div className="small text-muted">
                        Common configuration tasks and operations
                      </div>
                    </div>
                  </div>
                  <div className="card-body pt-2">
                    <div className="row g-4">

                      {/* Create Report */}
                      <div className="col-md-4">
                        <div
                          className="h-100 p-3 rounded-3 border"
                          style={{
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #e7f1ff, #f8fbff)',
                            transition: 'all 0.25s ease'
                          }}
                          onClick={() => setActiveSection('builder')}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <div className="d-flex align-items-center mb-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle me-3"
                              style={{
                                width: 42,
                                height: 42,
                                backgroundColor: '#0d6efd',
                                color: '#fff'
                              }}
                            >
                              <Icon icon="heroicons:plus" width="20" />
                            </div>
                            <h6 className="fw-bold mb-0">Create Report</h6>
                          </div>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                            Build and configure a new report template
                          </p>
                        </div>
                      </div>

                      {/* Export Configuration */}
                      <div className="col-md-4">
                        <div
                          className="h-100 p-3 rounded-3 border"
                          style={{
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #e6fff5, #f9fffc)',
                            transition: 'all 0.25s ease'
                          }}
                          onClick={() => handleExportData('excel', reportTemplates)}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <div className="d-flex align-items-center mb-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle me-3"
                              style={{
                                width: 42,
                                height: 42,
                                backgroundColor: '#198754',
                                color: '#fff'
                              }}
                            >
                              <Icon icon="heroicons:document-arrow-down" width="20" />
                            </div>
                            <h6 className="fw-bold mb-0">Export Config</h6>
                          </div>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                            Download all configurations as Excel
                          </p>
                        </div>
                      </div>

                      {/* Reset Configuration */}
                      <div className="col-md-4">
                        <div
                          className="h-100 p-3 rounded-3 border"
                          style={{
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #fff4e5, #fffaf3)',
                            transition: 'all 0.25s ease'
                          }}
                          onClick={handleResetConfiguration}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <div className="d-flex align-items-center mb-2">
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle me-3"
                              style={{
                                width: 42,
                                height: 42,
                                backgroundColor: '#fd7e14',
                                color: '#fff'
                              }}
                            >
                              <Icon icon="heroicons:arrow-path" width="20" />
                            </div>
                            <h6 className="fw-bold mb-0">Reset Settings</h6>
                          </div>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                            Restore default configuration values
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* Custom Reports Display */}
              <div className="col-12 mb-4">
                <div className="card border shadow-none">
                  {/* ================= Header ================= */}
                  <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-4 pt-4 pb-3">
                    <div>
                      <h5
                        className="mb-1 d-flex align-items-center fw-bold"
                        style={{ color: '#000' }}
                      >
                        <Icon
                          icon="heroicons:document-text"
                          className="me-2"
                          width="20"
                          style={{ color: '#000' }}
                        />
                        Custom Reports
                      </h5>
                      <div className="small text-muted">
                        Reports created using the report builder
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Report Name</th>
                            <th>Category</th>
                            <th>Columns</th>
                            <th>Format</th>
                            <th>Schedule</th>
                            <th>Created Date</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customReports.map((report) => (
                            <tr key={report.id}>
                              <td>
                                <div className="fw-semibold d-flex align-items-center">
                                  <Icon icon="heroicons:document-text" className="me-2 text-muted" width="16" />
                                  {report.name}
                                </div>
                                <div className="small text-muted">{report.description}</div>
                              </td>
                              <td>
                                <span className="badge bg-info-subtle text-info">{report.category}</span>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark">
                                  {Array.isArray(report.columns) ? report.columns.length : 0}
                                </span>
                              </td>

                              <td>
                                <div className="d-flex align-items-center">
                                  {Array.isArray(report.format) && report.format.includes('pdf') && (
                                    <Icon icon="heroicons:document-text" className="me-1 text-danger" width="14" />
                                  )}
                                  {Array.isArray(report.format) && report.format.includes('excel') && (
                                    <Icon icon="heroicons:table-cells" className="me-1 text-success" width="14" />
                                  )}
                                  {Array.isArray(report.format) ? report.format.join(', ') : report.format}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Icon icon="heroicons:clock" className="me-1 text-muted" width="14" />
                                  {report.schedule === 'none' ? 'Manual' : report.schedule}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Icon icon="heroicons:calendar" className="me-1 text-muted" width="14" />
                                  {formatDate(report.createdDate)}
                                </div>
                              </td>
                              <td className="text-end">
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-primary"
                                    onClick={() => handleGenerateReport(report)}
                                    title="Generate"
                                  >
                                    <Icon icon="heroicons:play" width="14" />
                                  </button>
                                  <button
                                    className="btn btn-outline-warning"
                                    onClick={() => handleEditReport(report, 'custom')}
                                    title="Edit"
                                  >
                                    <Icon icon="heroicons:pencil-square" width="14" />
                                  </button>
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDeleteReport(report.id, 'custom', report.name)}
                                    title="Delete"
                                  >
                                    <Icon icon="heroicons:trash" width="14" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {customReports.length === 0 && (
                            <tr>
                              <td colSpan="7">
                                <div
                                  className="d-flex flex-column align-items-center justify-content-center text-center text-muted"
                                  style={{ minHeight: '220px' }}
                                >
                                  <Icon
                                    icon="heroicons:document-text"
                                    width="40"
                                    className="mb-3"
                                    style={{ color: '#000' }}
                                  />
                                  <div className="fw-bold text-dark mb-1">
                                    No custom reports yet
                                  </div>
                                  <div className="small">
                                    Use the Report Builder to create custom reports
                                  </div>
                                </div>
                              </td>

                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Configuration */}
              <div className="col-12">
                <div className="card border shadow-none">
                  {/* ================= Header ================= */}
                  <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center px-4 pt-4 pb-3">
                    <div>
                      <h5
                        className="mb-1 d-flex align-items-center fw-bold"
                        style={{ color: '#000' }}
                      >
                        <Icon
                          icon="heroicons:cog"
                          className="me-2"
                          width="20"
                          style={{ color: '#000' }}
                        />
                        Report Configuration
                      </h5>
                      <div className="small text-muted">
                        System-wide report settings and preferences
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label d-flex align-items-center fw-semibold" style={{ color: '#495057' }}>
                            <Icon icon="heroicons:document-text" className="me-2 text-primary" width="18" />
                            Default Report Format
                          </label>
                          <select className="form-select"
                            value={configSettings.defaultFormat}
                            onChange={(e) => setConfigSettings({ ...configSettings, defaultFormat: e.target.value })}>
                            <option value="PDF">PDF</option>
                            <option value="Excel">Excel</option>
                            <option value="CSV">CSV</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label d-flex align-items-center fw-semibold" style={{ color: '#495057' }}>
                            <Icon icon="heroicons:archive-box" className="me-2 text-primary" width="18" />
                            Retention Period (months)
                          </label>
                          <select className="form-select"
                            value={configSettings.retentionPeriod}
                            onChange={(e) => setConfigSettings({ ...configSettings, retentionPeriod: e.target.value })}>
                            <option value="3">3</option>
                            <option value="6">6</option>
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="36">36</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-12">
                        <div className="form-check form-switch mb-3 d-flex align-items-center">
                          <input className="form-check-input" type="checkbox" id="autoGenerate"
                            checked={configSettings.autoGenerate}
                            onChange={(e) => setConfigSettings({ ...configSettings, autoGenerate: e.target.checked })} />
                          <label className="form-check-label d-flex align-items-center fw-semibold ms-2" htmlFor="autoGenerate" style={{ color: '#495057' }}>
                            <Icon icon="heroicons:play-circle" className="me-2" width="18" />
                            Auto-generate scheduled reports
                          </label>
                        </div>
                        <div className="form-check form-switch mb-3 d-flex align-items-center">
                          <input className="form-check-input" type="checkbox" id="emailNotification"
                            checked={configSettings.emailNotification}
                            onChange={(e) => setConfigSettings({ ...configSettings, emailNotification: e.target.checked })} />
                          <label className="form-check-label d-flex align-items-center fw-semibold ms-2" htmlFor="emailNotification" style={{ color: '#495057' }}>
                            <Icon icon="heroicons:envelope" className="me-2" width="18" />
                            Email notifications for completed reports
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Add/Edit Report Modal - Centered */}
      {showReportModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          style={{
            display: "flex",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">

              {/* Header */}
              <div className="modal-header">
                <h5
                  className="modal-title d-flex align-items-center"
                  style={{ fontSize: "1.3rem", fontWeight: 600 }}
                >
                  <Icon
                    icon={isEditMode ? "heroicons:pencil-square" : "heroicons:plus"}
                    className="me-2"
                    width="22"
                  />
                  {isEditMode ? "Edit Report" : "Add New Report"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReportModal(false)}
                />
              </div>

              {/* Body */}
              <div className="modal-body">
                <div className="row g-3">

                  {/* Report Name */}
                  <div className="col-md-12">
                    <label
                      className="form-label d-flex align-items-center"
                      style={{ color: "#212529", fontWeight: 600, fontSize: "1.15rem" }}
                    >

                      Report Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={reportForm.name}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, name: e.target.value })
                      }
                    />
                  </div>

                  {/* Category */}
                  <div className="col-md-6">
                    <label
                      className="form-label d-flex align-items-center"
                      style={{ color: "#212529", fontWeight: 600, fontSize: "1.15rem" }}
                    >

                      Category
                    </label>
                    <select
                      className="form-select"
                      value={reportForm.category}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, category: e.target.value })
                      }
                    >
                      <option value="standard">Standard Report</option>
                      <option value="compliance">Compliance Report</option>
                      <option value="analytics">Analytics Dashboard</option>
                      <option value="scheduled">Scheduled Report</option>
                    </select>
                  </div>

                  {/* Frequency */}
                  <div className="col-md-6">
                    <label
                      className="form-label d-flex align-items-center"
                      style={{ color: "#212529", fontWeight: 600, fontSize: "1.15rem" }}
                    >

                      Frequency
                    </label>
                    <select
                      className="form-select"
                      value={reportForm.frequency}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, frequency: e.target.value })
                      }
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Yearly</option>
                      <option>On Demand</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="col-md-12">
                    <label
                      className="form-label d-flex align-items-center"
                      style={{ color: "#212529", fontWeight: 600, fontSize: "1.15rem" }}
                    >

                      Description
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={reportForm.description}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, description: e.target.value })
                      }
                    />
                  </div>

                  {/* Default Format */}
                  <div className="col-md-6">
                    <label
                      className="form-label d-flex align-items-center"
                      style={{ color: "#212529", fontWeight: 600, fontSize: "1.15rem" }}
                    >

                      Default Format
                    </label>
                    <select
                      className="form-select"
                      value={
                        Array.isArray(reportForm.format)
                          ? reportForm.format[0]
                          : reportForm.format
                      }
                      onChange={(e) =>
                        setReportForm({ ...reportForm, format: [e.target.value] })
                      }
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div className="col-md-6">
                    <label
                      className="form-label d-flex align-items-center"
                      style={{ color: "#212529", fontWeight: 600, fontSize: "1.15rem" }}
                    >

                      Target Department
                    </label>
                    <select
                      className="form-select"
                      value={reportForm.department}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, department: e.target.value })
                      }
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Auto Schedule */}
                  <div className="col-md-12">
                    <div className="form-check form-switch d-flex align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={reportForm.scheduleType === "auto"}
                        onChange={(e) =>
                          setReportForm({
                            ...reportForm,
                            scheduleType: e.target.checked ? "auto" : "manual",
                          })
                        }
                      />
                      <label
                        className="form-check-label d-flex align-items-center ms-2"
                        style={{ color: "#212529", fontWeight: 600, fontSize: "0.95rem" }}
                      >
                        <Icon icon="heroicons:clock" className="me-2" width="18" />
                        Enable Auto-Scheduling
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary d-flex align-items-center"
                  onClick={() => setShowReportModal(false)}
                >
                  <Icon icon="heroicons:x-mark" className="me-2" width="16" />
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleSaveReport}
                >
                  <Icon icon="heroicons:check" className="me-2" width="16" />
                  {isEditMode ? "Update Report" : "Save Report"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-flex align-items-center justify-content-center" style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title d-flex align-items-center fw-bold text-danger">
                  <Icon icon="heroicons:exclamation-triangle" className="me-2" width="22" />
                  Confirm Delete
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body text-center py-4">

                <h6 className="fw-bold mb-3">Are you sure you want to delete this report?</h6>
                <p className="text-muted mb-0">
                  Report: <span className="fw-semibold text-dark">{reportToDelete.name}</span>
                </p>
                <p className="text-muted small mt-2">This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger px-4 d-flex align-items-center" onClick={confirmDeleteReport}>
                  <Icon icon="heroicons:trash" className="me-2" width="16" />
                  Delete Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: 9999 }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="d-flex align-items-center">
              <Icon icon="heroicons:arrow-path" className="me-2 animate-spin" />
              Processing report...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollReports;