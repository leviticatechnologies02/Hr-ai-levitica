import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewReportModal from "../modal/ViewReportModal";
import GenerateReportModal from "../modal/GenerateReportModal";
import ExportModal from "../modal/ExportModalReport";
import PatternModal from "../modal/PatternModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// import { 
//   fetchAttendanceData, 
//   fetchReports, 
//   fetchAlerts,
//   generateReport,
//   exportReport,
//   acknowledgeAlert,
//   fetchAnalytics
// } from "../../../services/attendanceService";

const AttendanceReports = () => {
  // ============================================================
  // STATE VARIABLES
  // ============================================================
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("manager");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExportingExceptions, setIsExportingExceptions] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showPatternModal, setShowPatternModal] = useState(false);
  const [selectedPatternAlert, setSelectedPatternAlert] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [patternAnalysis, setPatternAnalysis] = useState({
    days: [],
    trend: '',
    recommendation: ''
  });
  const [filters, setFilters] = useState({
    date: "month",
    department: "all",
    location: "all",
    employee: "all",
  });
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [reports, setReports] = useState([]);
  const [reportCategory, setReportCategory] = useState('all');
  const [exceptionType, setExceptionType] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================================
  // API DATA FETCHING
  // ============================================================
  
  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (attendanceData.length > 0) {
      loadAttendanceData();
    }
  }, [filters, search]);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadEmployees(),
        loadAttendanceData(),
        loadReports(),
        loadAlerts(),
        loadAnalytics()
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load initial data');
      toast.error('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      // Replace with actual API call
      // const response = await api.get('/employees');
      // setEmployees(response.data);
      
      // For now, using empty array
      setEmployees([]);
    } catch (err) {
      console.error('Failed to load employees:', err);
      toast.error('Failed to load employees');
    }
  };

  const loadAttendanceData = async () => {
    try {
      const params = {
        dateRange: filters.date,
        department: filters.department !== 'all' ? filters.department : undefined,
        location: filters.location !== 'all' ? filters.location : undefined,
        employeeId: filters.employee !== 'all' ? filters.employee : undefined,
        search: search || undefined
      };
      
      // Replace with actual API call
      // const response = await fetchAttendanceData(params);
      // setAttendanceData(response.data);
      
      // For now, using empty array
      setAttendanceData([]);
    } catch (err) {
      console.error('Failed to load attendance data:', err);
      toast.error('Failed to load attendance data');
    }
  };

  const loadReports = async () => {
    try {
      // Replace with actual API call
      // const response = await fetchReports();
      // setReports(response.data);
      
      // For now, using empty array
      setReports([]);
    } catch (err) {
      console.error('Failed to load reports:', err);
      toast.error('Failed to load reports');
    }
  };

  const loadAlerts = async () => {
    try {
      // Replace with actual API call
      // const response = await fetchAlerts();
      // setAlerts(response.data);
      
      // For now, using empty array
      setAlerts([]);
    } catch (err) {
      console.error('Failed to load alerts:', err);
      toast.error('Failed to load alerts');
    }
  };

  const loadAnalytics = async () => {
    try {
      // Replace with actual API call
      // const response = await fetchAnalytics();
      // setAnalyticsData(response.data);
      
      // For now, using empty object
      setAnalyticsData({
        trends: {
          daily: [],
          department: [],
          location: []
        },
        metrics: {
          absenteeismRate: 0,
          punctualityScore: 0,
          leaveUtilization: 0,
          overtimeRate: 0,
          attendanceConsistency: 0
        }
      });
    } catch (err) {
      console.error('Failed to load analytics:', err);
      toast.error('Failed to load analytics data');
    }
  };

  // ============================================================
  // CALCULATE STATISTICS
  // ============================================================
  const filteredData = useMemo(() => {
    if (!attendanceData.length) return [];
    
    let data = [...attendanceData];
    
    // Apply date filter
    const today = new Date();
    if (filters.date === "today") {
      const todayStr = today.toISOString().split("T")[0];
      data = data.filter(item => item.date === todayStr);
    } else if (filters.date === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split("T")[0];
      data = data.filter(item => item.date >= weekAgoStr);
    } else if (filters.date === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      const monthAgoStr = monthAgo.toISOString().split("T")[0];
      data = data.filter(item => item.date >= monthAgoStr);
    } else if (filters.date === "quarter") {
      const quarterAgo = new Date();
      quarterAgo.setMonth(today.getMonth() - 3);
      const quarterAgoStr = quarterAgo.toISOString().split("T")[0];
      data = data.filter(item => item.date >= quarterAgoStr);
    } else if (filters.date === "year") {
      const yearAgo = new Date();
      yearAgo.setFullYear(today.getFullYear() - 1);
      const yearAgoStr = yearAgo.toISOString().split("T")[0];
      data = data.filter(item => item.date >= yearAgoStr);
    }
    
    // Apply other filters
    if (filters.department !== "all") {
      data = data.filter(item => item.department === filters.department);
    }
    
    if (filters.location !== "all") {
      data = data.filter(item => item.location === filters.location);
    }
    
    if (filters.employee !== "all") {
      data = data.filter(item => item.employeeId === filters.employee);
    }
    
    // Apply search
    if (search) {
      const query = search.toLowerCase();
      data = data.filter(item =>
        (item.employeeName?.toLowerCase() || '').includes(query) ||
        (item.employeeId?.toLowerCase() || '').includes(query) ||
        (item.department?.toLowerCase() || '').includes(query)
      );
    }
    
    return data;
  }, [attendanceData, filters, search]);

  const statistics = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        totalRecords: 0,
        presentCount: 0,
        absentCount: 0,
        leaveCount: 0,
        lateCount: 0,
        presentRate: 0,
        absentRate: 0,
        lateRate: 0,
        leaveRate: 0,
        totalOvertime: 0,
        avgOvertime: 0
      };
    }
    
    const totalRecords = filteredData.length;
    const presentCount = filteredData.filter(x => x.status === "present").length;
    const absentCount = filteredData.filter(x => x.status === "absent").length;
    const leaveCount = filteredData.filter(x => x.status === "leave").length;
    const lateCount = filteredData.filter(x => (x.late || 0) > 0).length;
    const totalOvertime = filteredData.reduce((sum, x) => sum + (x.overtime || 0), 0);
    const avgOvertime = presentCount > 0 ? totalOvertime / presentCount : 0;
    
    return {
      totalRecords,
      presentCount,
      absentCount,
      leaveCount,
      lateCount,
      presentRate: totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0,
      absentRate: totalRecords > 0 ? ((absentCount / totalRecords) * 100).toFixed(1) : 0,
      lateRate: totalRecords > 0 ? ((lateCount / totalRecords) * 100).toFixed(1) : 0,
      leaveRate: totalRecords > 0 ? ((leaveCount / totalRecords) * 100).toFixed(1) : 0,
      totalOvertime,
      avgOvertime: avgOvertime.toFixed(1)
    };
  }, [filteredData]);

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  const getStatusBadge = (status) => {
    const config = {
      generated: { label: 'Generated', color: 'emerald' },
      pending: { label: 'Pending', color: 'amber' },
      failed: { label: 'Failed', color: 'rose' },
      Completed: { label: 'Completed', color: 'emerald' },
      Processing: { label: 'Processing', color: 'blue' },
    };
    const { label, color } = config[status] || { label: status || 'Unknown', color: 'gray' };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const config = {
      daily: { label: 'Daily', color: 'blue' },
      monthly: { label: 'Monthly', color: 'emerald' },
      exception: { label: 'Exception', color: 'amber' },
      compliance: { label: 'Compliance', color: 'cyan' },
      standard: { label: 'Standard', color: 'blue' },
      analytics: { label: 'Analytics', color: 'purple' },
    };
    const { label, color } = config[category] || { label: category || 'General', color: 'gray' };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  // ============================================================
  // HANDLER FUNCTIONS
  // ============================================================
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleExportReport = async (reportId) => {
    try {
      setIsGeneratingSingle(true);
      const report = reports.find(r => r.id === reportId);
      if (!report) {
        toast.error('Report not found');
        return;
      }

      // Replace with actual API call
      // const response = await exportReport(reportId, { format: 'xlsx' });
      // const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Simulate export
      const exportData = [{
        'Report Name': report.name,
        'Category': report.type,
        'Frequency': report.frequency,
        'Last Generated': report.lastGenerated,
        'Description': report.description,
      }];
      
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        `${report.name.toLowerCase().replace(/\s+/g, '-')}-${report.lastGenerated || new Date().toISOString().split('T')[0]}.xlsx`
      );
      
      toast.success('Report exported successfully!');
    } catch (err) {
      console.error('Failed to export report:', err);
      toast.error('Failed to export report');
    } finally {
      setIsGeneratingSingle(false);
    }
  };

  const handlePrintReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) {
      toast.error('Report not found');
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Please allow popups for printing');
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>${report.name}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
              .info { margin: 20px 0; background: #f8fafc; padding: 15px; border-radius: 8px; }
              .info-item { margin: 5px 0; }
              .footer { margin-top: 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            </style>
          </head>
          <body>
            <h1>${report.name}</h1>
            <div class="info">
              <div class="info-item"><strong>Type:</strong> ${report.type}</div>
              <div class="info-item"><strong>Frequency:</strong> ${report.frequency}</div>
              <div class="info-item"><strong>Last Generated:</strong> ${report.lastGenerated || 'N/A'}</div>
              <div class="info-item"><strong>Description:</strong> ${report.description}</div>
            </div>
            <div class="footer">
              <p>Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
              <p>© ${new Date().getFullYear()} HRM System - Confidential Report</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } catch (err) {
      console.error('Failed to print report:', err);
      toast.error('Failed to print report');
    }
  };

  const handleGenerateReport = async (reportId) => {
    try {
      // Replace with actual API call
      // await generateReport(reportId);
      
      const updatedReports = reports.map(report => {
        if (report.id === reportId) {
          toast.success(`Report "${report.name}" generated successfully!`);
          return { 
            ...report, 
            status: 'Completed',
            lastGenerated: new Date().toISOString().split('T')[0] 
          };
        }
        return report;
      });
      setReports(updatedReports);
    } catch (err) {
      console.error('Failed to generate report:', err);
      toast.error('Failed to generate report');
    }
  };

  const handleGenerateSubmit = async (formData) => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      // const response = await generateReport(formData);
      // const newReport = response.data;
      
      // Simulate new report
      const newReport = {
        id: reports.length + 1,
        name: formData.reportType,
        type: formData.category || 'standard',
        frequency: 'custom',
        description: `Generated report: ${formData.reportType}`,
        lastGenerated: new Date().toISOString().split('T')[0],
        status: 'Processing',
        columns: ['Employee', 'Department', 'Date', 'Status', 'Remarks']
      };
      
      setReports([newReport, ...reports]);
      toast.success(`Report "${formData.reportType}" generation started!`);
      setShowGenerateModal(false);
    } catch (err) {
      console.error('Failed to generate report:', err);
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAll = async () => {
    const filteredReports = reportCategory === 'all' 
      ? reports 
      : reports.filter(r => r.type === reportCategory);
    
    if (filteredReports.length === 0) {
      toast.error('No reports to export');
      return;
    }
    
    setIsExporting(true);
    try {
      const exportData = filteredReports.map(r => ({
        'Name': r.name,
        'Type': r.type,
        'Frequency': r.frequency,
        'Last Generated': r.lastGenerated,
        'Description': r.description
      }));
      
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reports');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        `all_reports_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      toast.success(`Exported ${filteredReports.length} reports successfully!`);
    } catch (err) {
      console.error('Failed to export all reports:', err);
      toast.error('Failed to export reports');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintAll = () => {
    const filteredReports = reportCategory === 'all' 
      ? reports 
      : reports.filter(r => r.type === reportCategory);
    
    if (filteredReports.length === 0) {
      toast.error('No reports to print');
      return;
    }
    
    setIsPrinting(true);
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Please allow popups for printing');
        setIsPrinting(false);
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Attendance Reports</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
              .report-item { margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; }
              .report-title { font-weight: bold; font-size: 16px; color: #1e293b; }
              .report-desc { color: #64748b; margin: 8px 0; }
              .footer { margin-top: 30px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            </style>
          </head>
          <body>
            <h1>Attendance Reports</h1>
            <p>Printed on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            ${filteredReports.map(r => `
              <div class="report-item">
                <div class="report-title">${r.name}</div>
                <div class="report-desc">${r.description}</div>
                <div style="font-size: 12px; color: #94a3b8;">
                  Type: ${r.type} | Frequency: ${r.frequency} | Last Generated: ${r.lastGenerated || 'N/A'}
                </div>
              </div>
            `).join('')}
            <div class="footer">© ${new Date().getFullYear()} HRM System - Confidential</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsPrinting(false);
      }, 500);
    } catch (err) {
      console.error('Failed to print all reports:', err);
      toast.error('Failed to print reports');
      setIsPrinting(false);
    }
  };

  // ============================================================
  // ALERT FUNCTIONS
  // ============================================================
  const handleAcknowledgeAlert = async (alertId) => {
    try {
      // Replace with actual API call
      // await acknowledgeAlert(alertId);
      
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true }
            : alert
        )
      );
      toast.success('Alert acknowledged successfully!');
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
      toast.error('Failed to acknowledge alert');
    }
  };

  const handleViewPattern = (alert) => {
    setSelectedPatternAlert(alert);
    
    // Generate pattern analysis from alert data
    const analysis = {
      days: alert.patternData?.days?.map((day, index) => ({
        date: day,
        status: alert.type || 'Alert',
        time: alert.patternData?.times?.[index] || 'N/A',
        details: alert.details || 'Pattern detected'
      })) || [],
      trend: alert.patternData?.pattern || 'Unknown pattern',
      recommendation: getRecommendation(alert.type)
    };
    
    setPatternAnalysis(analysis);
    setShowPatternModal(true);
  };

  const getRecommendation = (type) => {
    const recommendations = {
      anomaly: 'Consider flexible start time for this employee',
      pattern: 'Schedule check-in meeting on affected days',
      overtime: 'Review workload and consider redistribution',
      threshold: 'Review department policies and procedures',
      predictive: 'Monitor pattern and take preventive action'
    };
    return recommendations[type] || 'Review pattern and take appropriate action';
  };

  // ============================================================
  // EXCEPTION FUNCTIONS
  // ============================================================
  const getExceptionType = (item) => {
    if (item.status === 'absent') return 'Absent Without Leave';
    if ((item.late || 0) > 15) return 'Late Arrival';
    if ((item.overtime || 0) > 8) return 'Excessive Overtime';
    return 'Unknown';
  };

  const getExceptionDetails = (item) => {
    if (item.status === 'absent') return 'Full day absence';
    if ((item.late || 0) > 15) return `Late by ${item.late} minutes`;
    if ((item.overtime || 0) > 8) return `Overtime: ${item.overtime} hours`;
    return '';
  };

  const getExceptionDuration = (item) => {
    if (item.status === 'absent') return 'Full Day';
    if ((item.late || 0) > 15) return `${item.late} minutes`;
    if ((item.overtime || 0) > 8) return `${item.overtime} hours`;
    return '';
  };

  const getExceptionStatus = (item) => {
    if (item.status === 'absent') return 'Pending Review';
    if ((item.late || 0) > 15) return 'In Review';
    if ((item.overtime || 0) > 8) return 'Requires Approval';
    return '';
  };

  const exceptionData = useMemo(() => {
    return filteredData.filter(record => {
      if (exceptionType === 'all') {
        return record.status === 'absent' || (record.late || 0) > 15 || (record.overtime || 0) > 8;
      } else if (exceptionType === 'late') {
        return (record.late || 0) > 15;
      } else if (exceptionType === 'absent') {
        return record.status === 'absent';
      } else if (exceptionType === 'overtime') {
        return (record.overtime || 0) > 8;
      }
      return false;
    });
  }, [filteredData, exceptionType]);

  const handleExportExceptions = async () => {
    if (exceptionData.length === 0) {
      toast.error('No exceptions to export');
      return;
    }

    setIsExportingExceptions(true);
    setExportProgress(0);

    try {
      // Simulate export progress
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 200);

      // Wait for progress to complete
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const exportData = exceptionData.map(item => ({
        'Employee': item.employeeName,
        'Employee ID': item.employeeId,
        'Department': item.department,
        'Date': item.date,
        'Exception Type': getExceptionType(item),
        'Details': getExceptionDetails(item),
        'Duration': getExceptionDuration(item),
        'Status': getExceptionStatus(item)
      }));
      
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Exceptions');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(
        new Blob([wbout], { type: 'application/octet-stream' }),
        `attendance_exceptions_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      
      toast.success(`Exported ${exceptionData.length} exceptions successfully!`);
      setShowExportModal(false);
    } catch (err) {
      console.error('Failed to export exceptions:', err);
      toast.error('Failed to export exceptions');
    } finally {
      setIsExportingExceptions(false);
      setExportProgress(0);
    }
  };

  // ============================================================
  // LEAVE PATTERN ANALYSIS
  // ============================================================
  const leavePatterns = useMemo(() => {
    const leaveData = filteredData.filter(x => x.status === 'leave');
    const dayOfWeekCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const monthlyCounts = {};
    
    leaveData.forEach(record => {
      if (!record.date) return;
      const date = new Date(record.date);
      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      const month = date.toLocaleString('default', { month: 'short' });
      
      dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });
    
    return { dayOfWeekCounts, monthlyCounts };
  }, [filteredData]);

  // ============================================================
  // RENDER FUNCTIONS
  // ============================================================
  
  const renderDashboard = () => {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Dashboard Overview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Attendance Trends */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm sm:text-base">Attendance Trends</h4>
            {analyticsData.trends?.daily?.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.trends.daily.slice(-7).map((day, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm text-slate-600 min-w-[60px] sm:min-w-[80px]">
                      {day.date ? new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                    </span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${day.present || 0}%` }} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 min-w-[40px] text-right">
                      {day.present || 0}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Icon icon="heroicons:chart-bar" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No attendance data available</p>
              </div>
            )}
          </div>

          {/* Department Performance */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm sm:text-base">Department Performance</h4>
            {analyticsData.trends?.department?.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.trends.department.map((dept, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-medium text-slate-700">{dept.name || 'Unknown'}</span>
                      <span className="font-semibold text-emerald-600">{dept.present || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${dept.present || 0}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Icon icon="heroicons:building-office" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No department data available</p>
              </div>
            )}
          </div>

          {/* Key Metrics */}
          <div className="bg-slate-50 rounded-xl p-3 sm:p-5 border border-slate-200 lg:col-span-2">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm sm:text-base">Key Metrics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {[
                { label: 'Absentees', value: `${analyticsData.metrics?.absenteeismRate || 0}%` },
                { label: 'Punctuality', value: `${analyticsData.metrics?.punctualityScore || 0}%` },
                { label: 'Leave Utilization', value: `${analyticsData.metrics?.leaveUtilization || 0}%` },
                { label: 'Overtime Rate', value: `${analyticsData.metrics?.overtimeRate || 0}%` },
                { label: 'Consistency', value: `${analyticsData.metrics?.attendanceConsistency || 0}%` },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 text-center border border-slate-200">
                  <p className="text-[12px] sm:text-sm text-slate-500 tracking-wider">{metric.label}</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReports = () => {
    const filteredReports = reportCategory === 'all' 
      ? reports 
      : reports.filter(r => r.type === reportCategory);

    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">Reports Library</h3>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleExportAll}
              disabled={isExporting || filteredReports.length === 0}
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export All'}</span>
            </button>
            <button
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-200 transition flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePrintAll}
              disabled={isPrinting || filteredReports.length === 0}
            >
              <Icon icon="heroicons:printer" className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{isPrinting ? 'Printing...' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-nowrap sm:flex-wrap gap-1.5 sm:gap-2 mb-4 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'standard', 'exception', 'analytics'].map((cat) => (
            <button
              key={cat}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-sm font-semibold whitespace-nowrap transition ${
                reportCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              onClick={() => setReportCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({reports.filter(r => cat === 'all' || r.type === cat).length})
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 mt-2">Loading reports...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="border border-slate-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => handleViewReport(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-sm sm:text-base truncate">{report.name}</h4>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                      report.type === 'standard' ? 'bg-blue-100 text-blue-700' :
                      report.type === 'exception' ? 'bg-amber-100 text-amber-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {report.type?.toUpperCase() || 'STANDARD'}
                    </span>
                  </div>
                  <button
                    className="p-1.5 sm:p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportSingleReport(report);
                    }}
                    disabled={report.status === 'Processing'}
                  >
                    <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-2">{report.description}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-[10px] sm:text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Icon icon="heroicons:clock" className="w-3 h-3" />
                    {report.frequency || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="heroicons:calendar" className="w-3 h-3" />
                    {report.lastGenerated || 'N/A'}
                  </span>
                  {report.status && getStatusBadge(report.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-xl border border-slate-200">
            <Icon icon="heroicons:document-text" className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No reports found</p>
            <p className="text-sm text-slate-400">Try selecting a different category or generate a new report</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
              onClick={() => setShowGenerateModal(true)}
            >
              Generate New Report
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">Analytics & Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Department Performance */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm sm:text-base">Department Performance</h4>
            {analyticsData.trends?.department?.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.trends.department.map((dept, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="font-medium text-slate-700">{dept.name || 'Unknown'}</span>
                      <span className="font-semibold text-emerald-600">{dept.present || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${dept.present || 0}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mt-1">
                      <span>Absent: {dept.absent || 0}%</span>
                      <span>Late: {dept.late || 0}%</span>
                      <span>OT: {dept.overtime || 0}h</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Icon icon="heroicons:building-office" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No department data available</p>
              </div>
            )}
          </div>

          {/* Key Metrics */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm sm:text-base">Key Metrics</h4>
            <div className="space-y-3">
              {[
                { label: 'Absenteeism Rate', value: `${analyticsData.metrics?.absenteeismRate || 0}%`, color: 'text-rose-600' },
                { label: 'Punctuality Score', value: `${analyticsData.metrics?.punctualityScore || 0}%`, color: 'text-emerald-600' },
                { label: 'Leave Utilization', value: `${analyticsData.metrics?.leaveUtilization || 0}%`, color: 'text-amber-600' },
                { label: 'Overtime Rate', value: `${analyticsData.metrics?.overtimeRate || 0}%`, color: 'text-blue-600' },
              ].map((metric, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                  <span className="text-xs sm:text-sm text-slate-600">{metric.label}</span>
                  <span className={`text-sm sm:text-base font-bold ${metric.color}`}>{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Pattern Analysis */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 md:col-span-2">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm sm:text-base">Leave Pattern Analysis</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">Leave by Day of Week</p>
                {Object.entries(leavePatterns.dayOfWeekCounts).length > 0 ? (
                  Object.entries(leavePatterns.dayOfWeekCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([day, count]) => {
                      const maxCount = Math.max(...Object.values(leavePatterns.dayOfWeekCounts));
                      return (
                        <div key={day} className="flex items-center gap-2 mb-2">
                          <span className="text-xs sm:text-sm text-slate-600 min-w-[40px]">{day}</span>
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full" 
                              style={{ width: maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%' }} 
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 min-w-[30px] text-right">{count}</span>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">No leave data available</p>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Leave by Month</p>
                {Object.entries(leavePatterns.monthlyCounts).length > 0 ? (
                  Object.entries(leavePatterns.monthlyCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([month, count]) => {
                      const maxCount = Math.max(...Object.values(leavePatterns.monthlyCounts));
                      return (
                        <div key={month} className="flex items-center gap-2 mb-2">
                          <span className="text-xs sm:text-sm text-slate-600 min-w-[40px]">{month}</span>
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full" 
                              style={{ width: maxCount > 0 ? `${(count / maxCount) * 100}%` : '0%' }} 
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 min-w-[30px] text-right">{count}</span>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-sm text-slate-400 text-center py-4">No leave data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExceptions = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">Exception Reports</h3>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <select
              value={exceptionType}
              onChange={(e) => setExceptionType(e.target.value)}
              className="flex-1 sm:flex-none h-10 px-3 sm:px-4 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Exceptions</option>
              <option value="late">Late Arrivals</option>
              <option value="absent">Absent</option>
              <option value="overtime">Overtime</option>
            </select>
            <button
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowExportModal(true)}
              disabled={exceptionData.length === 0 || isExportingExceptions}
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{isExportingExceptions ? 'Exporting...' : `Export (${exceptionData.length})`}</span>
            </button>
          </div>
        </div>

        {/* Exception Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          <div className="bg-rose-50 rounded-xl p-3 sm:p-4 border border-rose-200">
            <p className="text-[10px] sm:text-xs text-rose-700">Total Exceptions</p>
            <p className="text-lg sm:text-2xl font-bold text-rose-900">{exceptionData.length}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 sm:p-4 border border-amber-200">
            <p className="text-[10px] sm:text-xs text-amber-700">Late Arrivals</p>
            <p className="text-lg sm:text-2xl font-bold text-amber-900">{exceptionData.filter(r => (r.late || 0) > 15).length}</p>
          </div>
          <div className="bg-rose-50 rounded-xl p-3 sm:p-4 border border-rose-200">
            <p className="text-[10px] sm:text-xs text-rose-700">Absent</p>
            <p className="text-lg sm:text-2xl font-bold text-rose-900">{exceptionData.filter(r => r.status === 'absent').length}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-200">
            <p className="text-[10px] sm:text-xs text-blue-700">Overtime</p>
            <p className="text-lg sm:text-2xl font-bold text-blue-900">{exceptionData.filter(r => (r.overtime || 0) > 8).length}</p>
          </div>
        </div>

        {/* Exception Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 mt-2">Loading exceptions...</p>
            </div>
          ) : exceptionData.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-2 sm:p-3 font-semibold text-slate-600">Employee</th>
                  <th className="p-2 sm:p-3 font-semibold text-slate-600 hidden sm:table-cell">Department</th>
                  <th className="p-2 sm:p-3 font-semibold text-slate-600">Type</th>
                  <th className="p-2 sm:p-3 font-semibold text-slate-600 hidden md:table-cell">Date</th>
                  <th className="p-2 sm:p-3 font-semibold text-slate-600 hidden lg:table-cell">Duration</th>
                  <th className="p-2 sm:p-3 font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exceptionData.slice(0, 10).map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="p-2 sm:p-3 font-medium text-xs sm:text-sm">{item.employeeName || 'Unknown'}</td>
                    <td className="p-2 sm:p-3 hidden sm:table-cell text-xs sm:text-sm">{item.department || 'N/A'}</td>
                    <td className="p-2 sm:p-3">
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                        item.status === 'absent' ? 'bg-rose-100 text-rose-700' :
                        (item.late || 0) > 15 ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {getExceptionType(item)}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 hidden md:table-cell text-xs sm:text-sm">{item.date || 'N/A'}</td>
                    <td className="p-2 sm:p-3 hidden lg:table-cell text-xs sm:text-sm">{getExceptionDuration(item)}</td>
                    <td className="p-2 sm:p-3">
                      <span className="text-[10px] sm:text-xs text-slate-600">{getExceptionStatus(item)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Icon icon="heroicons:check-circle" className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No exceptions found</p>
              <p className="text-sm text-slate-400">All attendance records are normal</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAlerts = () => {
    const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
    
    return (
      <div>
        <div className="flex flex-wrap justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">Alerts & Anomalies</h3>
            <p className="text-xs sm:text-sm text-slate-500">{unacknowledgedAlerts.length} unacknowledged alerts</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 mt-2">Loading alerts...</p>
          </div>
        ) : unacknowledgedAlerts.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-slate-50 rounded-xl border border-slate-200">
            <Icon icon="heroicons:check-circle" className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">All alerts have been acknowledged</p>
            <p className="text-sm text-slate-400">No pending alerts requiring your attention</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {unacknowledgedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-xl p-3 sm:p-4 ${
                  alert.severity === 'high' ? 'border-rose-200 bg-rose-50' :
                  alert.severity === 'medium' ? 'border-amber-200 bg-amber-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon 
                      icon="heroicons:exclamation-triangle" 
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        alert.severity === 'high' ? 'text-rose-600' :
                        alert.severity === 'medium' ? 'text-amber-600' :
                        'text-blue-600'
                      }`}
                    />
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">
                      {alert.employee || alert.department || 'Alert'}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-500">{alert.date || 'N/A'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mt-2">{alert.message}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-white rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-50 transition border border-slate-200 flex items-center justify-center gap-1"
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                  >
                    <Icon icon="heroicons:check" className="w-3 h-3 sm:w-4 sm:h-4" />
                    Acknowledge
                  </button>
                  <button
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-white rounded-lg text-xs sm:text-sm font-medium hover:bg-slate-50 transition border border-slate-200 flex items-center justify-center gap-1"
                    onClick={() => handleViewPattern(alert)}
                  >
                    <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4" />
                    View Pattern
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 md:px-3">
      {/* Error Display */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <Icon icon="heroicons:exclamation-circle" className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-rose-800">Error loading data</p>
            <p className="text-sm text-rose-600">{error}</p>
            <button
              className="mt-2 px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-200 transition"
              onClick={() => { setError(null); loadInitialData(); }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
              <Icon icon="heroicons:chart-bar" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
                Attendance Reports
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 flex flex-wrap items-center gap-1 sm:gap-2">
                <span>HRMS Dashboard</span>
                <span className="w-0.5 h-0.5 rounded-full bg-slate-300"></span>
                <span>v3.8</span>
                <span className="w-0.5 h-0.5 rounded-full bg-slate-300 hidden xs:inline"></span>
                <span className="hidden xs:inline">Analytics & Insights</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial min-w-[120px] sm:min-w-[180px]">
              <Icon icon="heroicons:magnifying-glass" className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 sm:h-10 pl-8 sm:pl-10 pr-3 sm:pr-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              />
            </div>

            {/* Role Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="h-8 sm:h-10 px-2 sm:px-4 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 hover:bg-slate-50 transition-colors"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              >
                <Icon icon="heroicons:user-circle" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                <span className="hidden xs:inline capitalize">{role}</span>
                <Icon icon="heroicons:chevron-down" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
              </button>
              
              {showRoleDropdown && (
                <div className="absolute right-0 mt-1 w-32 sm:w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-10">
                  {['employee', 'manager', 'hr', 'admin'].map((r) => (
                    <button
                      key={r}
                      className={`w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-slate-50 transition first:rounded-t-xl last:rounded-b-xl ${
                        role === r ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'
                      }`}
                      onClick={() => { setRole(r); setShowRoleDropdown(false); }}
                    >
                      <span className="capitalize">{r}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4 md:p-5">
        {/* Mobile Filter Toggle */}
        <button
          className="w-full sm:hidden flex items-center justify-between py-2 text-sm font-semibold text-slate-700"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <span className="flex items-center gap-2">
            <Icon icon="heroicons:funnel" className="w-4 h-4" />
            Filters
          </span>
          <Icon icon={showMobileFilters ? "heroicons:chevron-up" : "heroicons:chevron-down"} className="w-4 h-4" />
        </button>

        <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 mt-2 sm:mt-0">
            <div className="relative col-span-2 sm:col-span-1">
              <select
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative col-span-2 sm:col-span-1">
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Depts</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
              <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative col-span-2 sm:col-span-1">
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Locations</option>
                <option value="HQ">HQ</option>
                <option value="Branch A">Branch A</option>
                <option value="Branch B">Branch B</option>
                <option value="Remote">Remote</option>
              </select>
              <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative col-span-2 sm:col-span-1">
              <select
                value={filters.employee}
                onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
                className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Employees</option>
                {employees.slice(0, 5).map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
              <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            </div>

            <button
              type="button"
              className="h-8 sm:h-10 px-3 sm:px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1 sm:gap-2 col-span-2 sm:col-span-1"
              onClick={() => {
                setFilters({ date: "month", department: "all", location: "all", employee: "all" });
                setSearch("");
                setShowMobileFilters(false);
              }}
            >
              <Icon icon="heroicons:arrow-path" className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-2 sm:gap-3">
        {[
          { label: 'Present', value: `${statistics.presentRate || 0}%`, icon: 'heroicons:check-circle', color: 'emerald' },
          { label: 'Absent', value: `${statistics.absentRate || 0}%`, icon: 'heroicons:x-circle', color: 'rose' },
          { label: 'Late', value: `${statistics.lateRate || 0}%`, icon: 'heroicons:clock', color: 'amber' },
          { label: 'Overtime', value: `${statistics.totalOvertime || 0}h`, icon: 'heroicons:bolt', color: 'blue' },
          { label: 'Punctuality', value: `${analyticsData.metrics?.punctualityScore || 0}%`, icon: 'heroicons:bullseye', color: 'cyan' },
          { label: 'Consistency', value: `${analyticsData.metrics?.attendanceConsistency || 0}%`, icon: 'heroicons:chart-pie', color: 'purple' },
          { label: 'Alerts', value: alerts.filter(a => !a.acknowledged).length, icon: 'heroicons:bell', color: 'amber' },
          { label: 'Leave', value: `${analyticsData.metrics?.leaveUtilization || 0}%`, icon: 'heroicons:calendar', color: 'indigo' },
        ].map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-2 sm:p-3 hover:shadow-md transition">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-${kpi.color}-50 flex-shrink-0`}>
                <Icon icon={kpi.icon} className={`w-3 h-3 sm:w-4 sm:h-4 text-${kpi.color}-600`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-[12px] font-semibold text-slate-500 tracking-wider truncate">{kpi.label}</p>
                <p className="text-sm sm:text-lg font-bold text-slate-900 leading-tight">{kpi.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-0 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: 'heroicons:home' },
          { id: 'reports', label: 'Reports', icon: 'heroicons:document-text' },
          { id: 'analytics', label: 'Analytics', icon: 'heroicons:chart-bar' },
          { id: 'exceptions', label: 'Exceptions', icon: 'heroicons:exclamation-triangle' },
          { id: 'alerts', label: 'Alerts', icon: 'heroicons:bell' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 text-[14px] font-semibold transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon icon={tab.icon} className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4 md:p-6">
        {isLoading && !attendanceData.length ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 mt-2">Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'exceptions' && renderExceptions()}
            {activeTab === 'alerts' && renderAlerts()}
          </>
        )}
      </div>

      {/* Modals */}
      <ViewReportModal
        isOpen={showViewModal}
        onClose={() => { setShowViewModal(false); setSelectedReport(null); }}
        report={selectedReport}
        onExport={handleExportReport}
        onPrint={handlePrintReport}
        onGenerate={handleGenerateReport}
      />

      <GenerateReportModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onSubmit={handleGenerateSubmit}
        reportTypes={{
          daily: ['Daily Attendance Summary', 'Late Arrivals List', 'Early Departures List'],
          monthly: ['Monthly Attendance Register', 'Consolidated Monthly Report'],
          exception: ['Exception Report', 'Continuous Absence Report'],
          analytics: ['Overtime Analysis', 'Department-wise Statistics'],
          standard: ['Muster Roll', 'Employee-wise Summary']
        }}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportExceptions}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        isExporting={isExportingExceptions}
        exportProgress={exportProgress}
        itemCount={exceptionData.length}
      />

      <PatternModal
        isOpen={showPatternModal}
        onClose={() => { setShowPatternModal(false); setSelectedPatternAlert(null); }}
        alert={selectedPatternAlert}
        patternAnalysis={patternAnalysis}
        onAcknowledge={handleAcknowledgeAlert}
      />

      {/* Toast */}
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

export default AttendanceReports;