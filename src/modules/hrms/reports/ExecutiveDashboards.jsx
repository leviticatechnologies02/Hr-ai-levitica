import React, { useState } from "react";
import RecruiterDashboardLayout from "../../../app/layouts/RecruiterDashboardLayout";
import {
  Search,
  Download,
  Eye,
  Check,
  X,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  BarChart3,
  UserCheck
} from "lucide-react";

/**************** SIDEBAR ****************/
const sidebarContent = (
  <nav className="space-y-1 p-3">
    <h6 className="text-uppercase text-muted mb-2 small">Dashboard Views</h6>

    <a className="nav-link d-block py-2 px-3 rounded hover-bg-light active" href="#">
      <Users size={16} className="me-2" /> HR Leadership
    </a>

    <a className="nav-link d-block py-2 px-3 rounded hover-bg-light" href="#">
      <UserCheck size={16} className="me-2" /> Manager
    </a>

    <a className="nav-link d-block py-2 px-3 rounded hover-bg-light" href="#">
      <Calendar size={16} className="me-2" /> Employee
    </a>

    <hr className="my-2" />

    <h6 className="text-uppercase text-muted small mb-2">Analytics</h6>

    <a className="nav-link d-block py-2 px-3 rounded hover-bg-light" href="#">
      <BarChart3 size={16} className="me-2" /> AI Insights
    </a>

    <a className="nav-link d-block py-2 px-3 rounded hover-bg-light" href="#">
      <FileText size={16} className="me-2" /> Reports
    </a>
  </nav>
);

const userInfo = {
  name: "Sarah Johnson",
  role: "HR Director",
  email: "sarah.johnson@company.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJohnson",
};

const DashboardPage = () => {
  const [filter, setFilter] = useState("");
  const [dashboardType, setDashboardType] = useState("HR Leadership");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  // 🔥 Added State For Metrics (To Update Approve/Reject)
  const [metricsState, setMetricsState] = useState({});

  /*********** DASHBOARD DATA ************/
  const dashboardData = {
    "HR Leadership": {
      kpis: [
        { id: 1, title: "Total Headcount", value: "1,243", change: "+2.3%", icon: Users, color: "primary" },
        { id: 2, title: "Monthly Attrition", value: "4.2%", change: "-0.8%", icon: TrendingDown, color: "success" },
        { id: 3, title: "Open Positions", value: "87", change: "+12", icon: TrendingUp, color: "warning" },
        { id: 4, title: "Payroll Cost", value: "$4.2M", change: "+5.1%", icon: DollarSign, color: "info" },
        { id: 5, title: "Avg. Attendance", value: "94.7%", change: "+1.2%", icon: Clock, color: "secondary" },
        { id: 6, title: "Pending Approvals", value: "156", change: "+23", icon: AlertTriangle, color: "danger" },
      ],
      metrics: [
        { id: 1, name: "Headcount Trend (6 months)", category: "Trend", status: "Stable", value: "↑ 8.2%", lastUpdated: "2025-11-25" },
        { id: 2, name: "Attrition by Department", category: "Analysis", status: "Alert", value: "IT: 6.7%", lastUpdated: "2025-11-28" },
        { id: 3, name: "Hiring Pipeline Status", category: "Recruitment", status: "On Track", value: "78% filled", lastUpdated: "2025-11-27" },
        { id: 4, name: "Payroll Cost Analysis", category: "Finance", status: "Review", value: "$4.2M", lastUpdated: "2025-11-20" },
        { id: 5, name: "Leave Pattern Analysis", category: "Attendance", status: "Normal", value: "Avg 2.1 days", lastUpdated: "2025-11-22" },
        { id: 6, name: "Compliance Status", category: "Compliance", status: "Compliant", value: "98%", lastUpdated: "2025-11-29" },
        { id: 7, name: "Top Concerns", category: "Alerts", status: "Critical", value: "3 urgent", lastUpdated: "2025-11-30" },
        { id: 8, name: "Training Completion", category: "Development", status: "Behind", value: "67%", lastUpdated: "2025-11-24" },
      ]
    },

    "Manager": {
      kpis: [
        { id: 1, title: "Team Size", value: "24", change: "+2", icon: Users, color: "primary" },
        { id: 2, title: "Team Attrition", value: "1.8%", change: "-0.3%", icon: TrendingDown, color: "success" },
        { id: 3, title: "Avg. Performance", value: "4.2/5", change: "+0.3", icon: TrendingUp, color: "warning" },
        { id: 4, title: "Pending Approvals", value: "18", change: "+5", icon: AlertTriangle, color: "danger" },
      ],
      metrics: [
        { id: 1, name: "Team Composition", category: "Demographics", status: "Updated", value: "5 roles", lastUpdated: "2025-11-29" },
        { id: 2, name: "Attendance Summary", category: "Attendance", status: "Good", value: "96%", lastUpdated: "2025-11-28" },
        { id: 3, name: "Team Leave Calendar", category: "Calendar", status: "View", value: "3 on leave", lastUpdated: "2025-11-30" },
        { id: 4, name: "Performance Indicators", category: "Performance", status: "Above Target", value: "4.2/5", lastUpdated: "2025-11-25" },
        { id: 5, name: "New Hires in Team", category: "Onboarding", status: "In Progress", value: "2 new", lastUpdated: "2025-11-27" },
        { id: 6, name: "Upcoming Milestones", category: "Events", status: "Upcoming", value: "4 events", lastUpdated: "2025-11-26" },
      ]
    },

    "Employee": {
      kpis: [
        { id: 1, title: "Leave Balance", value: "18 days", change: "-2", icon: Calendar, color: "primary" },
        { id: 2, title: "Attendance This Month", value: "100%", change: "0%", icon: Clock, color: "success" },
        { id: 3, title: "Pending Requests", value: "3", change: "+1", icon: AlertTriangle, color: "warning" },
        { id: 4, title: "Upcoming Holidays", value: "2", change: "-", icon: Calendar, color: "info" },
      ],
      metrics: [
        { id: 1, name: "Personal Attendance", category: "Summary", status: "Perfect", value: "100%", lastUpdated: "2025-11-30" },
        { id: 2, name: "Leave History", category: "Leaves", status: "View All", value: "Taken: 7 days", lastUpdated: "2025-11-29" },
        { id: 3, name: "Pending Payslips", category: "Payroll", status: "Available", value: "Nov 2025", lastUpdated: "2025-11-28" },
        { id: 4, name: "Request Status", category: "Requests", status: "Processing", value: "3 pending", lastUpdated: "2025-11-27" },
        { id: 5, name: "Team Calendar", category: "Calendar", status: "View", value: "Team events", lastUpdated: "2025-11-30" },
        { id: 6, name: "Quick Actions", category: "Actions", status: "Available", value: "5 actions", lastUpdated: "2025-11-26" },
      ]
    }
  };

  /*********** STATUS BADGES ************/
  const statusBadge = (status) => {
    const map = {
      "Stable": "bg-success-subtle text-success",
      "Alert": "bg-danger-subtle text-danger",
      "On Track": "bg-primary-subtle text-primary",
      "Review": "bg-warning-subtle text-warning",
      "Normal": "bg-secondary-subtle text-secondary",
      "Compliant": "bg-success-subtle text-success",
      "Critical": "bg-danger text-white",
      "Behind": "bg-warning-subtle text-warning",
      "Updated": "bg-success-subtle text-success",
      "Good": "bg-info-subtle text-info",
      "View": "bg-primary-subtle text-primary",
      "Above Target": "bg-success-subtle text-success",
      "In Progress": "bg-info-subtle text-info",
      "Upcoming": "bg-warning-subtle text-warning",
      "Perfect": "bg-success-subtle text-success",
      "View All": "bg-info-subtle text-info",
      "Available": "bg-success-subtle text-success",
      "Processing": "bg-warning-subtle text-warning",

      // Added new statuses for approve / reject
      "Approved": "bg-success text-white",
      "Rejected": "bg-danger text-white",
    };

    return map[status] || "bg-light text-muted";
  };

  // merge metric changes inside metricsState
  const currentData = {
    ...dashboardData[dashboardType],
    metrics: dashboardData[dashboardType].metrics.map((m) => ({
      ...m,
      status: metricsState[m.id]?.status || m.status,
    }))
  };

  /*********** FILTER + PAGINATION ************/
  const perPage = 6;

  const filteredMetrics = currentData.metrics.filter(
    (m) =>
      m.name.toLowerCase().includes(filter.toLowerCase()) ||
      m.category.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMetrics.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const displayMetrics = filteredMetrics.slice(startIndex, startIndex + perPage);

  const openMetricModal = (metric) => {
    setSelectedMetric(metric);
    setModalOpen(true);
  };

  /*********** APPROVE FUNCTION ************/
  const handleApprove = (metric) => {
    setMetricsState((prev) => ({
      ...prev,
      [metric.id]: { ...metric, status: "Approved" }
    }));
  };

  /*********** REJECT FUNCTION ************/
  const handleReject = (metric) => {
    setMetricsState((prev) => ({
      ...prev,
      [metric.id]: { ...metric, status: "Rejected" }
    }));
  };

  /*********** EXPORT ************/
  const exportDashboardData = () => {
    const headers = ["Metric Name", "Category", "Status", "Value", "Last Updated"];
    const rows = filteredMetrics.map((m) => [
      m.name,
      m.category,
      m.status,
      m.value,
      m.lastUpdated,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${dashboardType.toLowerCase().replace(" ", "_")}_dashboard.csv`;
    link.click();
  };

  /*********** UI RENDER ************/
  return (
    <div
      sidebarContent={sidebarContent}
      userInfo={userInfo}
      appName="Executive Dashboard"
    >
      <div className="container-fluid p-4">

        {/******** HEADER *********/}
        <div className="d-flex justify-content-between align-items-center mb-4">

           <div className="mb-4">
                    <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
                      {/* <Icon icon="heroicons: Pencil-Edit" /> */}
                    {dashboardType} Dashboard
                    </h5>
                    <p className="text-muted"> Real-time HR metrics and analytics</p>
                  </div>
          
         

          <div className="d-flex gap-2">
            <select
              className="form-select w-auto"
              value={dashboardType}
              onChange={(e) => {
                setDashboardType(e.target.value);
                setCurrentPage(1);
                setFilter("");
              }}
            >
              <option value="HR Leadership">HR Leadership View</option>
              <option value="Manager">Manager View</option>
              <option value="Employee">Employee View</option>
            </select>

           <button
  className="btn btn-info btn-sm d-flex align-items-center justify-content-center gap-1"
  onClick={exportDashboardData}
>
  <Download size={14} />
  <span>Export</span>
</button>

          </div>
        </div>

        {/******** KPI CARDS *********/}
        <div className="row g-3 mb-4">
          {currentData.kpis.map((kpi) => {
            const Icon = kpi.icon;
            const isPositive = kpi.change.includes("+");
            const isNegative = kpi.change.includes("-");

            return (
              <div key={kpi.id} className="col-xl-4 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-muted small mb-1">{kpi.title}</p>
                        <h5 className="mb-2">{kpi.value}</h5>

                        <span
                          className={`small ${
                            isPositive ? "text-success" :
                            isNegative ? "text-danger" :
                            "text-muted"
                          }`}
                        >
                          {kpi.change} from last month
                        </span>
                      </div>

                      <div className={`bg-${kpi.color}-subtle p-3 rounded-circle`}>
                        <Icon size={24} className={`text-${kpi.color}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/******** METRICS TABLE *********/}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Key Metrics & Insights</h6>

            <div className="input-group" style={{ maxWidth: 300 }}>
              <span className="input-group-text bg-white border-end-0">
                <Search size={14} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search metrics..."
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Metric</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Last Updated</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {displayMetrics.map((metric) => (
                  <tr key={metric.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded p-2 me-3">
                          <FileText size={16} />
                        </div>
                        <strong>{metric.name}</strong>
                      </div>
                    </td>

                    <td>{metric.category}</td>

                    <td>
                      <span className={`badge ${statusBadge(metric.status)}`}>
                        {metric.status}
                      </span>
                    </td>

                    <td>
                      <strong>{metric.value}</strong>
                    </td>

                    <td className="text-muted">{metric.lastUpdated}</td>

                    <td className="text-center">
                      <div className="btn-group btn-group-sm">

                        {/* VIEW */}
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => openMetricModal(metric)}
                        >
                          <Eye size={14} />
                        </button>

                        {/* APPROVE */}
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleApprove(metric)}
                        >
                          <Check size={14} />
                        </button>

                        {/* REJECT */}
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleReject(metric)}
                        >
                          <X size={14} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}

                {displayMetrics.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="text-muted">
                        <BarChart3 size={48} className="opacity-25 mb-2" />
                        <p>No metrics found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/******** PAGINATION *********/}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Showing <strong>{startIndex + 1}</strong> –{" "}
              <strong>{Math.min(startIndex + perPage, filteredMetrics.length)}</strong>{" "}
              of <strong>{filteredMetrics.length}</strong> metrics
            </small>

            <div className="btn-group">
              <button
                className="btn btn-outline-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  className={`btn ${
                    currentPage === idx + 1 ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                className="btn btn-outline-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/******** METRIC MODAL *********/}
      {modalOpen && selectedMetric && (
        <div className="modal-backdrop-custom" style={backdropStyle} onClick={() => setModalOpen(false)}>
          <div
            className="modal-content-custom"
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-3">Metric Details</h5>

            <div className="d-flex align-items-center mb-3">
              <div className="bg-light rounded p-3 me-3">
                <FileText size={24} />
              </div>

              <div>
                <h6 className="mb-0">{selectedMetric.name}</h6>
                <small className="text-muted">{selectedMetric.category}</small>
              </div>
            </div>

            <div className="mb-3">
              <strong>Current Value:</strong>
              <div className="h4 mt-1">{selectedMetric.value}</div>
            </div>

            <div className="row mb-3">
              <div className="col-6">
                <strong>Status:</strong>
                <div className="mt-1">
                  <span className={`badge ${statusBadge(selectedMetric.status)}`}>
                    {selectedMetric.status}
                  </span>
                </div>
              </div>

              <div className="col-6">
                <strong>Last Updated:</strong>
                <div className="mt-1">{selectedMetric.lastUpdated}</div>
              </div>
            </div>

            <div className="mb-3">
              <strong>Description:</strong>
              <p className="mt-1 small text-muted">
                This is a detailed insight for this metric. Automated real-time updates from the HR analytics engine.
              </p>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="btn btn-primary">View Full Report</button>

              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/************ MODAL STYLES **************/
const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "10px",
  width: "500px",
  maxWidth: "90vw",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
};

export default DashboardPage;
