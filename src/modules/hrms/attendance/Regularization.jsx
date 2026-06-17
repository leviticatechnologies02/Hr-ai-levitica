import React, { useState, useEffect, useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Clock,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Send,
  RefreshCw,
  Settings,
  User,
  Building,
  Home,
  Briefcase,
  Mail,
  Bell,
  AlertTriangle,
  Check,
  X,
  FileCheck,
  CalendarDays,
  BarChart3,
} from "lucide-react";

// ==================== REDUCER FOR STATE MANAGEMENT ====================
const regularizationReducer = (state, action) => {
  switch (action.type) {
    case "SET_REQUESTS":
      return { ...state, requests: action.payload };
    case "ADD_REQUEST":
      return { ...state, requests: [...state.requests, action.payload] };
    case "UPDATE_REQUEST":
      return {
        ...state,
        requests: state.requests.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case "DELETE_REQUEST":
      return {
        ...state,
        requests: state.requests.filter((r) => r.id !== action.payload),
      };
    case "SET_AUTO_REJECT_RULES":
      return { ...state, autoRejectRules: action.payload };
    case "ADD_AUTO_REJECT_RULE":
      return {
        ...state,
        autoRejectRules: [...state.autoRejectRules, action.payload],
      };
    case "SET_BULK_PROCESSING":
      return { ...state, bulkProcessing: action.payload };
    case "ADD_REPORT":
      return { ...state, reports: [...state.reports, action.payload] };
    default:
      return state;
  }
};

// ==================== INITIAL DATA ====================


const Regularization = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestType, setRequestType] = useState("missing");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Form states
  const [requestForm, setRequestForm] = useState({
    employeeId: "",
    requestType: "missing",
    dateTime: "",
    originalTime: "",
    correctedTime: "",
    date: "",
    punchType: "IN",
    approxTime: "",
    location: "",
    fromTime: "",
    toTime: "",
    dutyType: "",
    purpose: "",
    reason: "",
    remarks: "",
    summary: "",
    attachment: null,
  });

  const [approvalForm, setApprovalForm] = useState({
    action: "",
    remarks: "",
  });

  const [bulkForm, setBulkForm] = useState({
    fromDate: "",
    toDate: "",
    issueType: "",
    employees: [],
    file: null,
  });

  // Report form state
  const [reportForm, setReportForm] = useState({
    fromDate: "",
    toDate: "",
    requestType: "",
    format: "pdf",
  });

  // Load from localStorage
  const loadFromStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const initialState = {
    requests: loadFromStorage("regularizationRequests", []),
    autoRejectRules: loadFromStorage("autoRejectRules", [
      { id: 1, requestType: "missing", days: 7, enabled: true },
      { id: 2, requestType: "forgot", days: 5, enabled: true },
    ]),
    bulkProcessing: loadFromStorage("bulkProcessing", []),
    reports: loadFromStorage("regularizationReports", []),
  };

  const [state, dispatch] = useReducer(regularizationReducer, initialState);
  const { requests, autoRejectRules, bulkProcessing, reports } = state;

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("regularizationRequests", JSON.stringify(requests));
    localStorage.setItem("autoRejectRules", JSON.stringify(autoRejectRules));
    localStorage.setItem("bulkProcessing", JSON.stringify(bulkProcessing));
    localStorage.setItem("regularizationReports", JSON.stringify(reports));
  }, [state]);

  // Auto-reject processing
  useEffect(() => {
    const processAutoReject = () => {
      const today = new Date();
      let rejectedCount = 0;

      requests.forEach((request) => {
        if (request.status === "pending") {
          const rule = autoRejectRules.find(
            (r) => r.requestType === request.requestType && r.enabled
          );
          if (rule) {
            const requestDate = new Date(request.submittedAt);
            const daysDiff = Math.floor((today - requestDate) / (1000 * 60 * 60 * 24));

            if (daysDiff >= rule.days) {
              const updatedRequest = {
                ...request,
                status: "auto-rejected",
                rejectedAt: today.toISOString(),
                rejectedBy: "System",
                rejectionReason: `Auto-rejected after ${rule.days} days`,
                isAutoRejected: true,
              };
              dispatch({ type: "UPDATE_REQUEST", payload: updatedRequest });
              rejectedCount++;
            }
          }
        }
      });

      if (rejectedCount > 0) {
        console.log(`Auto-rejected ${rejectedCount} request(s)`);
      }
    };

    // Check every hour
    const interval = setInterval(processAutoReject, 3600000);
    processAutoReject(); // Run immediately

    return () => clearInterval(interval);
  }, [requests, autoRejectRules]);

  // ==================== REQUEST FUNCTIONS ====================
  const handleSubmitRequest = () => {
    if (!requestForm.employeeId || !requestForm.reason || !requestForm.remarks) {
      alert("Please fill all required fields (Employee, Reason, Remarks)");
      return;
    }

    const employee = initialEmployees.find((e) => e.id === requestForm.employeeId);
    const request = {
      id: Date.now(),
      ...requestForm,
      employeeName: employee?.name || requestForm.employeeId,
      department: employee?.department || "Unknown",
      status: "pending",
      submittedAt: new Date().toISOString(),
      submittedBy: employee?.name || requestForm.employeeId,
      approvalWorkflow: [
        { level: 1, approver: "Manager", status: "pending", required: true },
        { level: 2, approver: "HR", status: "pending", required: true },
      ],
      attachments: requestForm.attachment ? [requestForm.attachment.name] : [],
    };

    dispatch({ type: "ADD_REQUEST", payload: request });
    setShowRequestModal(false);
    setRequestForm({
      employeeId: "",
      requestType: "missing",
      dateTime: "",
      originalTime: "",
      correctedTime: "",
      date: "",
      punchType: "IN",
      approxTime: "",
      location: "",
      fromTime: "",
      toTime: "",
      dutyType: "",
      purpose: "",
      reason: "",
      remarks: "",
      summary: "",
      attachment: null,
    });
    alert("Regularization request submitted successfully");
  };

  const handleApproveRequest = (requestId, approved) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    const updatedRequest = {
      ...request,
      status: approved ? "approved" : "rejected",
      [approved ? "approvedAt" : "rejectedAt"]: new Date().toISOString(),
      [approved ? "approvedBy" : "rejectedBy"]: "Manager",
      rejectionReason: approved ? null : approvalForm.remarks || "Not approved",
      approvalWorkflow: request.approvalWorkflow.map((w) =>
        w.status === "pending"
          ? { ...w, status: approved ? "approved" : "rejected" }
          : w
      ),
    };

    dispatch({ type: "UPDATE_REQUEST", payload: updatedRequest });
    setShowApprovalModal(false);
    setApprovalForm({ action: "", remarks: "" });
    alert(`Request ${approved ? "approved" : "rejected"} successfully`);
  };

  const handleBulkProcess = () => {
    if (!bulkForm.fromDate || !bulkForm.toDate || !bulkForm.issueType) {
      alert("Please fill all required fields");
      return;
    }

    // Simulate bulk processing
    const processedCount = bulkForm.employees.length || 10;
    const bulkProcess = {
      id: Date.now(),
      ...bulkForm,
      processedCount,
      status: "completed",
      processedAt: new Date().toISOString(),
      processedBy: "HR Admin",
    };

    dispatch({ type: "SET_BULK_PROCESSING", payload: [...bulkProcessing, bulkProcess] });
    setShowBulkModal(false);
    setBulkForm({
      fromDate: "",
      toDate: "",
      issueType: "",
      employees: [],
      file: null,
    });
    alert(`Bulk regularization processed for ${processedCount} employees`);
  };

  // ==================== REPORT FUNCTIONS ====================
  const handleGenerateReport = () => {
    if (!reportForm.fromDate || !reportForm.toDate) {
      alert("Please select both From Date and To Date");
      return;
    }

    // Filter requests based on report criteria
    let filteredReportData = requests.filter((req) => {
      const requestDate = new Date(req.submittedAt);
      const fromDate = new Date(reportForm.fromDate);
      const toDate = new Date(reportForm.toDate);
      toDate.setHours(23, 59, 59, 999); // Include entire end day

      // Date range filter
      if (requestDate < fromDate || requestDate > toDate) {
        return false;
      }

      // Request type filter
      if (reportForm.requestType && reportForm.requestType !== "" && req.requestType !== reportForm.requestType) {
        return false;
      }

      return true;
    });

    // Generate report summary
    const reportSummary = {
      totalRequests: filteredReportData.length,
      pending: filteredReportData.filter(r => r.status === "pending").length,
      approved: filteredReportData.filter(r => r.status === "approved").length,
      rejected: filteredReportData.filter(r => r.status === "rejected" || r.status === "auto-rejected").length,
      byType: filteredReportData.reduce((acc, req) => {
        acc[req.requestType] = (acc[req.requestType] || 0) + 1;
        return acc;
      }, {}),
      byDepartment: filteredReportData.reduce((acc, req) => {
        acc[req.department] = (acc[req.department] || 0) + 1;
        return acc;
      }, {})
    };

    // Create report object
    const report = {
      id: Date.now(),
      ...reportForm,
      generatedAt: new Date().toISOString(),
      generatedBy: "HR Admin",
      data: filteredReportData,
      summary: reportSummary,
      fileName: `regularization-report-${Date.now()}.${reportForm.format}`
    };

    // Save report
    dispatch({ type: "ADD_REPORT", payload: report });

    // Simulate file download
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = report.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show success message
    alert(`Report generated successfully!\n\nDownloaded: ${report.fileName}\n\nStatistics:\n• Total Requests: ${reportSummary.totalRequests}\n• Pending: ${reportSummary.pending}\n• Approved: ${reportSummary.approved}\n• Rejected: ${reportSummary.rejected}`);

    // Reset form
    setReportForm({
      fromDate: "",
      toDate: "",
      requestType: "",
      format: "pdf",
    });
  };

  // ==================== FILTERED DATA ====================
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || req.status === filterStatus.toLowerCase();
    const matchesType =
      filterType === "All" || req.requestType === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  // ==================== RENDER FUNCTIONS ====================
  const renderRequests = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h7 className="mb-0 d-flex align-items-center fw-bold">
                <FileText size={20} className="me-2 text-primary" />
                Regularization Requests
              </h7>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setRequestType("missing");
                  setRequestForm({ ...requestForm, requestType: "missing" });
                  setShowRequestModal(true);
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px'
                }}
              >
                <Plus size={18} />
                <span>New Request</span>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="auto-rejected">Auto-Rejected</option>
                </select>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="missing">Missing Punch</option>
                  <option value="incorrect">Incorrect Time</option>
                  <option value="forgot">Forgot Punch</option>
                  <option value="wfh">WFH</option>
                  <option value="on_duty">On-Duty</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Date/Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '60px 0',
                          minHeight: '300px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{ 
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px'
                          }}>
                            <FileText size={40} color="#64748b" />
                          </div>
                          <h5 style={{ color: '#475569', marginBottom: '8px', fontWeight: '600' }}>
                            No Regularization Requests Found
                          </h5>
                          <p style={{ color: '#94a3b8', marginBottom: '24px', maxWidth: '400px' }}>
                            When you submit regularization requests, they will appear here for review and approval.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <div className="fw-medium">{req.employeeName}</div>
                          <small className="text-muted">{req.department}</small>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {req.requestType === "missing"
                              ? "Missing Punch"
                              : req.requestType === "incorrect"
                              ? "Incorrect Time"
                              : req.requestType === "forgot"
                              ? "Forgot Punch"
                              : req.requestType === "wfh"
                              ? "WFH"
                              : "On-Duty"}
                          </span>
                        </td>
                        <td>
                          <small>
                            {req.dateTime || req.date || req.originalTime || "N/A"}
                          </small>
                        </td>
                        <td>
                          <small className="text-truncate d-inline-block" style={{ maxWidth: "200px" }}>
                            {req.reason}
                          </small>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              req.status === "approved"
                                ? "success"
                                : req.status === "rejected" || req.status === "auto-rejected"
                                ? "danger"
                                : "warning"
                            }`}
                          >
                            {req.status === "auto-rejected" ? "Auto-Rejected" : req.status}
                          </span>
                        </td>
                        <td>
                          <small>
                            {new Date(req.submittedAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {req.status === "pending" && (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleApproveRequest(req.id, true)}
                                  title="Approve"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    setSelectedRequest(req);
                                    setShowApprovalModal(true);
                                  }}
                                  title="Reject"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setSelectedRequest(req);
                                setShowApprovalModal(true);
                              }}
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            {req.attachments && req.attachments.length > 0 && (
                              <button
                                className="btn btn-sm btn-outline-info"
                                title="View Attachments"
                              >
                                <FileText size={14} />
                              </button>
                            )}
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
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="row g-3">
      <div className="col-12 col-md-8">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-header bg-white py-3">
            <h7 className="mb-0 d-flex align-items-center fw-bold">
              <Settings size={18} className="me-2 text-primary" />
              Auto-Reject Rules
            </h7>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Request Type</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {autoRejectRules.map((rule) => (
                    <tr key={rule.id}>
                      <td>
                        {rule.requestType === "missing"
                          ? "Missing Punch"
                          : rule.requestType === "forgot"
                          ? "Forgot Punch"
                          : rule.requestType}
                      </td>
                      <td>{rule.days} days</td>
                      <td>
                        <span className={`badge bg-${rule.enabled ? "success" : "secondary"}`}>
                          {rule.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            const updated = {
                              ...rule,
                              enabled: !rule.enabled,
                            };
                            dispatch({
                              type: "SET_AUTO_REJECT_RULES",
                              payload: autoRejectRules.map((r) =>
                                r.id === rule.id ? updated : r
                              ),
                            });
                          }}
                        >
                          {rule.enabled ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-header bg-white py-3">
            <h7 className="mb-0 d-flex align-items-center fw-bold">
              <BarChart3 size={18} className="me-2 text-primary" />
              Request Statistics
            </h7>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <div className="text-center p-3 border rounded bg-light">
                  <div className="h4 mb-0 text-primary fw-bold">{requests.length}</div>
                  <small className="text-muted">Total Requests</small>
                </div>
              </div>
              <div className="col-12">
                <div className="text-center p-3 border rounded bg-light">
                  <div className="h4 mb-0 text-warning fw-bold">
                    {requests.filter((r) => r.status === "pending").length}
                  </div>
                  <small className="text-muted">Pending</small>
                </div>
              </div>
              <div className="col-12">
                <div className="text-center p-3 border rounded bg-light">
                  <div className="h4 mb-0 text-success fw-bold">
                    {requests.filter((r) => r.status === "approved").length}
                  </div>
                  <small className="text-muted">Approved</small>
                </div>
              </div>
              <div className="col-12">
                <div className="text-center p-3 border rounded bg-light">
                  <div className="h4 mb-0 text-danger fw-bold">
                    {requests.filter((r) => r.status === "rejected" || r.status === "auto-rejected").length}
                  </div>
                  <small className="text-muted">Rejected</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBulkProcessing = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h8 className="mb-0 d-flex align-items-center fw-bold">
                <Upload size={20} className="me-2 text-primary" />
                Bulk Regularization Processing
              </h8>
              <button
                className="btn btn-primary"
                onClick={() => setShowBulkModal(true)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px'
                }}
              >
                <Plus size={18} />
                <span>Process Bulk</span>
              </button>
            </div>
          </div>
          <div className="card-body">
            <p className="text-muted">
              Use bulk processing for system-wide issues like device malfunctions,
              sync errors, or network failures affecting multiple employees.
            </p>
            {bulkProcessing.length > 0 && (
              <div className="table-responsive mt-3">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Date Range</th>
                      <th>Issue Type</th>
                      <th>Processed</th>
                      <th>Status</th>
                      <th>Processed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkProcessing.map((process) => (
                      <tr key={process.id}>
                        <td>
                          {process.fromDate} to {process.toDate}
                        </td>
                        <td>{process.issueType}</td>
                        <td>{process.processedCount} employees</td>
                        <td>
                          <span className="badge bg-success">{process.status}</span>
                        </td>
                        <td>{process.processedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h7 className="mb-0 d-flex align-items-center fw-bold">
              <BarChart3 size={20} className="me-2 text-primary" />
              Regularization Reports
            </h7>
          </div>
          <div className="card-body">
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label className="form-label">From Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={reportForm.fromDate}
                  onChange={(e) => setReportForm({...reportForm, fromDate: e.target.value})}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">To Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={reportForm.toDate}
                  onChange={(e) => setReportForm({...reportForm, toDate: e.target.value})}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Request Type</label>
                <select 
                  className="form-select"
                  value={reportForm.requestType}
                  onChange={(e) => setReportForm({...reportForm, requestType: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="missing">Missing Punch</option>
                  <option value="incorrect">Incorrect Time</option>
                  <option value="forgot">Forgot Punch</option>
                  <option value="wfh">WFH</option>
                  <option value="on_duty">On-Duty</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Format</label>
                <select 
                  className="form-select"
                  value={reportForm.format}
                  onChange={(e) => setReportForm({...reportForm, format: e.target.value})}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleGenerateReport}
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px'
              }}
            >
              <Download size={18} />
              <span>Generate Report</span>
            </button>
            
            {reports.length > 0 && (
              <div className="mt-4">
                <h6 className="mb-3 fw-bold">Generated Reports</h6>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Date Range</th>
                        <th>Type</th>
                        <th>Format</th>
                        <th>Generated At</th>
                        <th>File Name</th>
                        <th>Total Records</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.slice().reverse().map((report) => (
                        <tr key={report.id}>
                          <td>{report.fromDate} to {report.toDate}</td>
                          <td>{report.requestType || "All Types"}</td>
                          <td><span className="badge bg-info">{report.format.toUpperCase()}</span></td>
                          <td>{new Date(report.generatedAt).toLocaleString()}</td>
                          <td>{report.fileName}</td>
                          <td>{report.summary.totalRecords || report.data?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      {/* HEADER - ONLY "Regularization Workflow" IN BOLD */}
      <div className="row mb-4">
        <div className="col-12">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="bi bi-clock-history" style={{ fontSize: '24px', color: '#1e293b' }}></i>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
                Regularization Workflow
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                Manage attendance regularization requests, approvals, and settings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            <FileText size={16} className="me-2" />
            <span className="fw-medium">Requests</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={16} className="me-2" />
            <span className="fw-medium">Settings</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "bulk" ? "active" : ""}`}
            onClick={() => setActiveTab("bulk")}
          >
            <Upload size={16} className="me-2" />
            <span className="fw-medium">Bulk Processing</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            <BarChart3 size={16} className="me-2" />
            <span className="fw-medium">Reports</span>
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "requests" && renderRequests()}
        {activeTab === "settings" && renderSettings()}
        {activeTab === "bulk" && renderBulkProcessing()}
        {activeTab === "reports" && renderReports()}
      </div>

      {/* Request Modal - FORM PAGE CENTERED FOR DESKTOP */}
      {showRequestModal && (
        <div
          className="modal show d-block"
          style={{ 
            backgroundColor: "rgba(0,0,0,0.5)",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title d-flex align-items-center fw-bold">
                  <Plus size={20} className="me-2" />
                  New Regularization Request
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRequestModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Request Type *</label>
                    <select
                      className="form-select"
                      value={requestForm.requestType}
                      onChange={(e) => {
                        setRequestType(e.target.value);
                        setRequestForm({ ...requestForm, requestType: e.target.value });
                      }}
                    >
                      <option value="missing">Missing Punch</option>
                      <option value="incorrect">Incorrect Time</option>
                      <option value="forgot">Forgot Punch</option>
                      <option value="wfh">WFH Regularization</option>
                      <option value="on_duty">On-Duty</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Employee *</label>
                    <select
                      className="form-select"
                      value={requestForm.employeeId}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, employeeId: e.target.value })
                      }
                    >
                      <option value="">Select employee...</option>
                      {initialEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {requestType === "missing" && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Date & Time *</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={requestForm.dateTime}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, dateTime: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}

                  {requestType === "incorrect" && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Original Time *</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={requestForm.originalTime}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, originalTime: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Corrected Time *</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={requestForm.correctedTime}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, correctedTime: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}

                  {requestType === "forgot" && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={requestForm.date}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, date: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Punch Type</label>
                        <select
                          className="form-select"
                          value={requestForm.punchType}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, punchType: e.target.value })
                          }
                        >
                          <option value="IN">IN</option>
                          <option value="OUT">OUT</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Approx Time *</label>
                        <input
                          type="time"
                          className="form-control"
                          value={requestForm.approxTime}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, approxTime: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}

                  {requestType === "wfh" && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={requestForm.date}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, date: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Location *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={requestForm.location}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, location: e.target.value })
                          }
                          placeholder="Work location"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Work Summary *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={requestForm.summary}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, summary: e.target.value })
                          }
                          placeholder="Enter work summary"
                        />
                      </div>
                    </>
                  )}

                  {requestType === "on_duty" && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          value={requestForm.date}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, date: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">From Time *</label>
                        <input
                          type="time"
                          className="form-control"
                          value={requestForm.fromTime}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, fromTime: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">To Time *</label>
                        <input
                          type="time"
                          className="form-control"
                          value={requestForm.toTime}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, toTime: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Duty Type *</label>
                        <select
                          className="form-select"
                          value={requestForm.dutyType}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, dutyType: e.target.value })
                          }
                        >
                          <option value="">Select...</option>
                          <option value="client_visit">Client Visit</option>
                          <option value="training">Training</option>
                          <option value="business_travel">Business Travel</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Purpose/Location *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={requestForm.purpose}
                          onChange={(e) =>
                            setRequestForm({ ...requestForm, purpose: e.target.value })
                          }
                          placeholder="Enter purpose/location"
                        />
                      </div>
                    </>
                  )}

                  <div className="col-12">
                    <label className="form-label">Reason *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={requestForm.reason}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, reason: e.target.value })
                      }
                      placeholder="Enter reason"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Remarks *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={requestForm.remarks}
                      onChange={(e) =>
                        setRequestForm({ ...requestForm, remarks: e.target.value })
                      }
                      placeholder="Enter remarks"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Attachment (Travel bills, Client emails, etc.)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          attachment: e.target.files[0],
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={handleSubmitRequest}
                >
                  <Send size={16} />
                  <span className="ms-2">Submit Request</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div
          className="modal show d-block"
          style={{ 
            backgroundColor: "rgba(0,0,0,0.5)",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title d-flex align-items-center fw-bold">
                  <Eye size={20} className="me-2" />
                  Request Details & Approval
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedRequest(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Employee:</strong> {selectedRequest.employeeName}
                </div>
                <div className="mb-3">
                  <strong>Type:</strong> {selectedRequest.requestType}
                </div>
                <div className="mb-3">
                  <strong>Reason:</strong> {selectedRequest.reason}
                </div>
                <div className="mb-3">
                  <strong>Remarks:</strong> {selectedRequest.remarks}
                </div>
                {selectedRequest.status === "pending" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Action *</label>
                      <select
                        className="form-select"
                        value={approvalForm.action}
                        onChange={(e) =>
                          setApprovalForm({ ...approvalForm, action: e.target.value })
                        }
                      >
                        <option value="">Select action...</option>
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                        <option value="request_changes">Request Changes</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Remarks</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={approvalForm.remarks}
                        onChange={(e) =>
                          setApprovalForm({ ...approvalForm, remarks: e.target.value })
                        }
                        placeholder="Enter approval remarks"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedRequest(null);
                  }}
                >
                  Close
                </button>
                {selectedRequest.status === "pending" && (
                  <>
                    <button
                      type="button"
                      className="btn btn-success d-inline-flex align-items-center"
                      onClick={() => handleApproveRequest(selectedRequest.id, true)}
                    >
                      <Check size={16} className="me-2" />
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger d-inline-flex align-items-center"
                      onClick={() => handleApproveRequest(selectedRequest.id, false)}
                    >
                      <X size={16} className="me-2" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Processing Modal */}
      {showBulkModal && (
        <div
          className="modal show d-block"
          style={{ 
            backgroundColor: "rgba(0,0,0,0.5)",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title d-flex align-items-center fw-bold">
                  <Upload size={20} className="me-2" />
                  Bulk Regularization Processing
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBulkModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">From Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={bulkForm.fromDate}
                      onChange={(e) =>
                        setBulkForm({ ...bulkForm, fromDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">To Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={bulkForm.toDate}
                      onChange={(e) =>
                        setBulkForm({ ...bulkForm, toDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Issue Type *</label>
                    <select
                      className="form-select"
                      value={bulkForm.issueType}
                      onChange={(e) =>
                        setBulkForm({ ...bulkForm, issueType: e.target.value })
                      }
                    >
                      <option value="">Select issue type...</option>
                      <option value="system">System Failure</option>
                      <option value="device">Device Malfunction</option>
                      <option value="sync">Sync Error</option>
                      <option value="network">Network Failure</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Upload Employee List (CSV/Excel)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) =>
                        setBulkForm({ ...bulkForm, file: e.target.files[0] })
                      }
                    />
                    <small className="text-muted">
                      Upload file with employee IDs or process all employees for the date range
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBulkModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={handleBulkProcess}
                >
                  <Upload size={16} className="me-2" />
                  Process Bulk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Regularization;