import React, { useState, useMemo } from "react";
import {
  Plus,
  Eye,
  Edit,
  Home,
  Trash2,
  Filter,
  Download,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Clock,
  FolderCheck,
  XCircle,
  FileText,
  Shield,
  User,
  Calendar,
  Search,
  BarChart3,
  FileCheck,
  X,
  Save,
  Building,
  Award,
  MessageSquare,
  MapPin,
  Globe,
  CreditCard,
  DollarSign,
  Calculator,
  FileSpreadsheet,
  File,
  ChevronDown,
  AlertTriangle, // ADD THIS
  Flag, // ADD THIS
} from "lucide-react";

// Import export libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Status badge component
const StatusBadge = ({ status }) => {
  const statusMap = {
    Pending: {
      bg: "bg-warning-subtle",
      text: "text-warning",
      icon: <Clock size={14} />,
    },
    Compliant: {
      bg: "bg-success-subtle",
      text: "text-success",
      icon: <CheckCircle size={14} />,
    },
    "Non-Compliant": {
      bg: "bg-danger-subtle",
      text: "text-danger",
      icon: <XCircle size={14} />,
    },
    Missing: {
      bg: "bg-secondary-subtle",
      text: "text-secondary",
      icon: <AlertCircle size={14} />,
    },
    Expired: {
      bg: "bg-dark-subtle",
      text: "text-dark",
      icon: <AlertCircle size={14} />,
    },
    Alert: {
      bg: "bg-danger-subtle",
      text: "text-danger-emphasis",
      icon: <AlertCircle size={14} />,
    },
    "In Progress": {
      bg: "bg-info-subtle",
      text: "text-info",
      icon: <Clock size={14} />,
    },
  };

  const statusConfig = statusMap[status] || {
    bg: "bg-light",
    text: "text-muted",
    icon: null,
  };

  return (
    <span
      className={`badge ${statusConfig.bg} ${statusConfig.text} d-inline-flex align-items-center gap-1`}
    >
      {statusConfig.icon}
      {status}
    </span>
  );
};

// Currency options component
const CurrencyDropdown = ({ value, onChange, disabled = false }) => {
  const currencies = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
  ];

  return (
    <div className="input-group">
      <select
        className="form-select w-auto flex-grow-0"
        value={value?.currency || "INR"}
        onChange={(e) => onChange({ ...value, currency: e.target.value })}
        disabled={disabled}
        style={{ maxWidth: "120px" }}
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.symbol} {curr.code}
          </option>
        ))}
      </select>
      <input
        type="number"
        className="form-control"
        placeholder="Amount"
        value={value?.amount || ""}
        onChange={(e) => onChange({ ...value, amount: e.target.value })}
        disabled={disabled}
        min="0"
        step="0.01"
      />
    </div>
  );
};

// Modal component for CRUD operations
const ComplianceModal = ({ isOpen, onClose, mode, data, onSave, onEdit }) => {
  const initialFormData = {
    name: "",
    category: "Statutory",
    lastUpdated: new Date().toISOString().split("T")[0],
    status: "Pending",
    employeeName: "",
    department: "",
    designation: "",
    comments: "",
    reason: "", // New field
    issueDate: "", // New field
    resolveDate: "", // New field
    additionalNotes: "", // New field
    bonus: { currency: "INR", amount: "" },
    location: "",
    state: "",
    salary: { currency: "INR", amount: "" },
    deduction: { currency: "INR", amount: "" },
  };

  const [formData, setFormData] = useState(initialFormData);

  // Update form data when data prop changes
  React.useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      setFormData(initialFormData);
    }
  }, [data, isOpen]);

  const categories = ["Statutory", "Document", "Policy"];
  const statuses = [
    "Pending",
    "Compliant",
    "Non-Compliant",
    "Missing",
    "Expired",
    "Alert",
    "In Progress",
  ];
  const departments = [
    "HR",
    "Finance",
    "IT",
    "Sales",
    "Marketing",
    "Operations",
    "Legal",
    "Admin",
  ];
  const designations = [
    "Manager",
    "Executive",
    "Senior Executive",
    "Assistant Manager",
    "Director",
    "Consultant",
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Determine modal styling based on mode
  const modalConfig = {
    view: {
      headerBg: "bg-primary",
      headerText: "text-white",
      titleIcon: <Eye size={20} />,
      title: "View Compliance Report",
      submitText: "Close",
      submitVariant: "btn-secondary",
    },
    edit: {
      headerBg: "bg-warning",
      headerText: "text-dark",
      titleIcon: <Edit size={20} />,
      title: "Edit Compliance Report",
      submitText: "Save Changes",
      submitVariant: "btn-warning",
    },
    create: {
      headerBg: "bg-primary",
      headerText: "text-white",
      titleIcon: <Plus size={20} />,
      title: "Create New Compliance Report",
      submitText: "Create",
      submitVariant: "btn-success",
    },
  };

  const config = modalConfig[mode] || modalConfig.create;
  const isViewMode = mode === "view";

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-lg">
          {/* Modal Header with colored background */}
          <div
            className={`modal-header ${config.headerBg} ${config.headerText} rounded-top py-3`}
          >
            <div className="d-flex align-items-center gap-2 w-100">
              <div
                className={`p-2 rounded-circle ${
                  isViewMode
                    ? "bg-white bg-opacity-25"
                    : "bg-white bg-opacity-20"
                }`}
              >
                {config.titleIcon}
              </div>
              <div className="flex-grow-1">
                <h5 className="modal-title mb-0 fw-bold">{config.title}</h5>
                <small className="opacity-75">
                  {isViewMode
                    ? "Read-only view"
                    : mode === "edit"
                    ? "Modify existing report"
                    : "Add new compliance report"}
                </small>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                {/* Report Name & Category */}
                <div className="col-md-8">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <FileText size={16} className="me-2 text-primary" />
                    Report Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${isViewMode ? "bg-light" : ""}`}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={isViewMode}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <FolderCheck size={16} className="me-2 text-primary" />
                    Category
                  </label>
                  <select
                    className={`form-select ${isViewMode ? "bg-light" : ""}`}
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    disabled={isViewMode}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employee Details */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <User size={16} className="me-2 text-primary" />
                    Employee Name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${isViewMode ? "bg-light" : ""}`}
                    value={formData.employeeName}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeName: e.target.value })
                    }
                    required
                    disabled={isViewMode}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <Building size={16} className="me-2 text-primary" />
                    Department
                  </label>
                  <select
                    className={`form-select ${isViewMode ? "bg-light" : ""}`}
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    disabled={isViewMode}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <Award size={16} className="me-2 text-primary" />
                    Designation
                  </label>
                  <select
                    className={`form-select ${isViewMode ? "bg-light" : ""}`}
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    disabled={isViewMode}
                  >
                    <option value="">Select Designation</option>
                    {designations.map((desg) => (
                      <option key={desg} value={desg}>
                        {desg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location & State */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <MapPin size={16} className="me-2 text-primary" />
                    Location
                  </label>
                  <input
                    type="text"
                    className={`form-control ${isViewMode ? "bg-light" : ""}`}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    disabled={isViewMode}
                    placeholder="Enter location"
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <Globe size={16} className="me-2 text-primary" />
                    State
                  </label>
                  <input
                    type="text"
                    className={`form-control ${isViewMode ? "bg-light" : ""}`}
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    disabled={isViewMode}
                    placeholder="Enter state"
                  />
                </div>

                {/* Salary, Bonus & Deduction */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <DollarSign size={16} className="me-2 text-primary" />
                    Salary
                  </label>
                  <CurrencyDropdown
                    value={formData.salary}
                    onChange={(salary) => setFormData({ ...formData, salary })}
                    disabled={isViewMode}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <CreditCard size={16} className="me-2 text-primary" />
                    Bonus
                  </label>
                  <CurrencyDropdown
                    value={formData.bonus}
                    onChange={(bonus) => setFormData({ ...formData, bonus })}
                    disabled={isViewMode}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <Calculator size={16} className="me-2 text-primary" />
                    Deduction
                  </label>
                  <CurrencyDropdown
                    value={formData.deduction}
                    onChange={(deduction) =>
                      setFormData({ ...formData, deduction })
                    }
                    disabled={isViewMode}
                  />
                </div>

                {/* Last Updated & Status */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <Calendar size={16} className="me-2 text-primary" />
                    Last Updated
                  </label>
                  <input
                    type="date"
                    className={`form-control ${isViewMode ? "bg-light" : ""}`}
                    value={formData.lastUpdated}
                    onChange={(e) =>
                      setFormData({ ...formData, lastUpdated: e.target.value })
                    }
                    disabled={isViewMode}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <BarChart3 size={16} className="me-2 text-primary" />
                    Status
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className={`form-select ${isViewMode ? "bg-light" : ""}`}
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      disabled={isViewMode}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {isViewMode && (
                      <div className="ms-2">
                        <StatusBadge status={formData.status} />
                      </div>
                    )}
                  </div>
                </div>

                {/* New: Reason Field - Text Input */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <AlertCircle size={16} className="me-2 text-warning" />
                    Reason
                  </label>
                  <input
                    type="text"
                    className={`form-control ${isViewMode ? "bg-light" : ""}`}
                    value={formData.reason || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    disabled={isViewMode}
                    placeholder="Enter the reason for compliance issue"
                  />
                </div>
                {/* New: Date of Issue */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <Calendar size={16} className="me-2 text-danger" />
                    Date of Issue
                  </label>
                  <input
                    type="date"
                    className={`form-control ${isViewMode ? "bg-light" : ""}`}
                    value={formData.issueDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, issueDate: e.target.value })
                    }
                    disabled={isViewMode}
                  />
                </div>

                {/* New: Resolve Issue Date */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <Calendar size={16} className="me-2 text-success" />
                    Resolve Issue Date
                  </label>
                  <input
                    type="date"
                    className={`form-control ${isViewMode ? "bg-light" : ""}`}
                    value={formData.resolveDate || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, resolveDate: e.target.value })
                    }
                    disabled={isViewMode}
                  />
                </div>
                {/* Comments - Updated to show Reason Details when Other is selected */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <MessageSquare size={16} className="me-2 text-primary" />
                    {formData.reason === "Other"
                      ? "Reason Details"
                      : "Comments"}
                  </label>
                  <textarea
                    className={`form-control ${isViewMode ? "bg-light" : ""}`}
                    value={formData.comments}
                    onChange={(e) =>
                      setFormData({ ...formData, comments: e.target.value })
                    }
                    disabled={isViewMode}
                    rows="3"
                    placeholder={
                      formData.reason === "Other"
                        ? "Please specify the reason..."
                        : "Enter comments or notes"
                    }
                  />
                </div>

                {/* New: Additional Notes Field */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <FileText size={16} className="me-2 text-info" />
                    Additional Notes
                  </label>
                  <textarea
                    className={`form-control ${isViewMode ? "bg-light" : ""}`}
                    value={formData.additionalNotes || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalNotes: e.target.value,
                      })
                    }
                    disabled={isViewMode}
                    rows="2"
                    placeholder="Enter any additional notes or observations"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer border-top py-3">
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center gap-2 px-4"
                onClick={onClose}
              >
                <X size={16} />
                Cancel
              </button>

              {isViewMode ? (
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-2 px-4"
                  onClick={() => {
                    onClose(true, data);
                  }}
                >
                  <Edit size={16} />
                  Edit Report
                </button>
              ) : (
                <button
                  type="submit"
                  className={`btn ${config.submitVariant} d-flex align-items-center gap-2 px-4`}
                >
                  {mode === "create" ? <Plus size={16} /> : <Save size={16} />}
                  {config.submitText}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Format currency display
const formatCurrency = (value) => {
  if (!value || !value.amount || value.amount === "") return "-";

  const symbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  try {
    const amount = parseFloat(value.amount);
    if (isNaN(amount)) return "-";

    return `${symbols[value.currency] || ""}${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } catch (error) {
    return "-";
  }
};

// Export Dropdown Component
const ExportDropdown = ({ onExportPDF, onExportExcel }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary d-flex align-items-center gap-2 dropdown-toggle"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Download size={18} />
        Export
      </button>
      <div className={`dropdown-menu ${isOpen ? "show" : ""}`}>
        <button className="dropdown-item" onClick={onExportPDF}>
          <File size={16} className="me-2 text-primary" />
          Export as PDF
        </button>
        <button className="dropdown-item" onClick={onExportExcel}>
          <FileSpreadsheet size={16} className="me-2 text-success" />
          Export as Excel
        </button>
      </div>
    </div>
  );
};

// Main component
const ComplianceReports = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    location: "",
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create",
    data: null,
  });
  const [selectedReports, setSelectedReports] = useState([]);

  const [complianceData, setComplianceData] = useState([
    {
      id: 1,
      name: "PF compliance dashboard",
      category: "Statutory",
      type: "Regulatory",
      lastUpdated: "2025-10-10",
      status: "Compliant",
      employeeName: "John Doe",
      department: "HR",
      designation: "Manager",
      comments: "All PF contributions processed for Q4 2025",
      reason: "Quarterly filing requirement",
      issueDate: "2025-09-01",
      resolveDate: "2025-10-10",
      additionalNotes: "All employees covered under PF scheme",
      bonus: { currency: "INR", amount: "25000" },
      location: "Mumbai",
      state: "Maharashtra",
      salary: { currency: "INR", amount: "75000" },
      deduction: { currency: "INR", amount: "12000" },
    },
    {
      id: 2,
      name: "ESI compliance dashboard",
      category: "Statutory",
      type: "Regulatory",
      lastUpdated: "2025-09-05",
      status: "Pending",
      employeeName: "Jane Smith",
      department: "Finance",
      designation: "Executive",
      comments: "Pending verification from state authority",
      reason: "State verification pending",
      issueDate: "2025-08-15",
      resolveDate: "",
      additionalNotes: "Submitted on time, awaiting confirmation",
      bonus: { currency: "USD", amount: "3000" },
      location: "Bangalore",
      state: "Karnataka",
      salary: { currency: "USD", amount: "5000" },
      deduction: { currency: "USD", amount: "800" },
    },
    {
      id: 3,
      name: "PT compliance tracker",
      category: "Statutory",
      type: "Financial",
      lastUpdated: "2025-11-01",
      status: "Alert",
      employeeName: "Robert Johnson",
      department: "IT",
      designation: "Senior Executive",
      comments: "Professional tax filing overdue by 15 days",
      reason: "Missed deadline",
      issueDate: "2025-10-15",
      resolveDate: "2025-11-05",
      additionalNotes: "Penalty of ₹5000 applicable",
      bonus: { currency: "EUR", amount: "2000" },
      location: "Delhi",
      state: "Delhi",
      salary: { currency: "EUR", amount: "4000" },
      deduction: { currency: "EUR", amount: "600" },
    },
    {
      id: 4,
      name: "TDS compliance status",
      category: "Statutory",
      type: "Financial",
      lastUpdated: "2025-08-25",
      status: "Compliant",
      employeeName: "Michael Brown",
      department: "Finance",
      designation: "Manager",
      comments: "TDS deposited for all employees",
      reason: "Quarterly TDS deposit",
      issueDate: "2025-07-01",
      resolveDate: "2025-08-25",
      additionalNotes: "All challans generated and deposited",
      bonus: { currency: "INR", amount: "35000" },
      location: "Chennai",
      state: "Tamil Nadu",
      salary: { currency: "INR", amount: "85000" },
      deduction: { currency: "INR", amount: "15000" },
    },
    {
      id: 5,
      name: "Gratuity liability report",
      category: "Statutory",
      type: "Financial",
      lastUpdated: "2025-07-18",
      status: "In Progress",
      employeeName: "Sarah Williams",
      department: "HR",
      designation: "Assistant Manager",
      comments: "Calculating gratuity for departing employees",
      reason: "Employee resignation",
      issueDate: "2025-06-30",
      resolveDate: "2025-07-25",
      additionalNotes: "3 employees leaving this quarter",
      bonus: { currency: "INR", amount: "18000" },
      location: "Hyderabad",
      state: "Telangana",
      salary: { currency: "INR", amount: "65000" },
      deduction: { currency: "INR", amount: "9000" },
    },
    {
      id: 6,
      name: "Bonus Act compliance",
      category: "Statutory",
      type: "Operational",
      lastUpdated: "2025-09-01",
      status: "Non-Compliant",
      employeeName: "David Miller",
      department: "Operations",
      designation: "Director",
      comments: "Bonus not paid to contract workers",
      reason: "Contract worker exclusion",
      issueDate: "2025-08-15",
      resolveDate: "",
      additionalNotes: "Legal review required for contract terms",
      bonus: { currency: "INR", amount: "45000" },
      location: "Pune",
      state: "Maharashtra",
      salary: { currency: "INR", amount: "120000" },
      deduction: { currency: "INR", amount: "20000" },
    },
    {
      id: 7,
      name: "Labour law compliance checklist",
      category: "Statutory",
      type: "Regulatory",
      lastUpdated: "2025-11-20",
      status: "Compliant",
      employeeName: "Lisa Anderson",
      department: "Legal",
      designation: "Consultant",
      comments: "All labour law requirements met",
      reason: "Annual compliance check",
      issueDate: "2025-10-01",
      resolveDate: "2025-11-20",
      additionalNotes: "All factories and offices inspected",
      bonus: { currency: "GBP", amount: "5000" },
      location: "Gurgaon",
      state: "Haryana",
      salary: { currency: "GBP", amount: "8000" },
      deduction: { currency: "GBP", amount: "1200" },
    },
    {
      id: 8,
      name: "Missing document report",
      category: "Document",
      type: "Operational",
      lastUpdated: "2025-11-22",
      status: "Missing",
      employeeName: "Kevin Taylor",
      department: "Admin",
      designation: "Executive",
      comments: "PAN card and address proof missing",
      reason: "Document not submitted by employee",
      issueDate: "2025-11-01",
      resolveDate: "",
      additionalNotes: "Follow-up email sent 3 times",
      bonus: { currency: "INR", amount: "15000" },
      location: "Ahmedabad",
      state: "Gujarat",
      salary: { currency: "INR", amount: "55000" },
      deduction: { currency: "INR", amount: "7000" },
    },
    {
      id: 9,
      name: "Document expiry alerts",
      category: "Document",
      type: "Operational",
      lastUpdated: "2025-10-14",
      status: "Expired",
      employeeName: "Amanda Clark",
      department: "HR",
      designation: "Executive",
      comments: "Employee contracts expired, renewal pending",
      reason: "Contract expiry",
      issueDate: "2025-09-30",
      resolveDate: "",
      additionalNotes: "15 contracts need renewal this month",
      bonus: { currency: "USD", amount: "2500" },
      location: "Kolkata",
      state: "West Bengal",
      salary: { currency: "USD", amount: "4500" },
      deduction: { currency: "USD", amount: "700" },
    },
    {
      id: 10,
      name: "Pending document approvals",
      category: "Document",
      type: "Operational",
      lastUpdated: "2025-11-18",
      status: "Pending",
      employeeName: "Brian Wilson",
      department: "Sales",
      designation: "Manager",
      comments: "NDA approvals pending from legal team",
      reason: "Legal department backlog",
      issueDate: "2025-11-01",
      resolveDate: "2025-11-20",
      additionalNotes: "25 NDAs awaiting approval",
      bonus: { currency: "INR", amount: "30000" },
      location: "Noida",
      state: "Uttar Pradesh",
      salary: { currency: "INR", amount: "90000" },
      deduction: { currency: "INR", amount: "14000" },
    },
    {
      id: 11,
      name: "KYC completion status",
      category: "Document",
      type: "Security",
      lastUpdated: "2025-11-10",
      status: "Compliant",
      employeeName: "Rachel Lee",
      department: "Finance",
      designation: "Senior Executive",
      comments: "All employee KYC documents verified",
      reason: "Annual KYC update",
      issueDate: "2025-10-01",
      resolveDate: "2025-11-10",
      additionalNotes: "100% compliance achieved",
      bonus: { currency: "EUR", amount: "3500" },
      location: "Chandigarh",
      state: "Punjab",
      salary: { currency: "EUR", amount: "6000" },
      deduction: { currency: "EUR", amount: "900" },
    },
    {
      id: 12,
      name: "Policy acknowledgment status",
      category: "Policy",
      type: "Security",
      lastUpdated: "2025-11-02",
      status: "Non-Compliant",
      employeeName: "James Martin",
      department: "IT",
      designation: "Manager",
      comments: "10 employees haven't acknowledged new IT policy",
      reason: "Policy non-acknowledgment",
      issueDate: "2025-10-15",
      resolveDate: "",
      additionalNotes: "Reminder emails sent twice",
      bonus: { currency: "INR", amount: "28000" },
      location: "Jaipur",
      state: "Rajasthan",
      salary: { currency: "INR", amount: "95000" },
      deduction: { currency: "INR", amount: "16000" },
    },
    {
      id: 13,
      name: "Training completion status",
      category: "Policy",
      type: "Training Required",
      lastUpdated: "2025-09-28",
      status: "In Progress",
      employeeName: "Sophia Garcia",
      department: "Marketing",
      designation: "Director",
      comments: "Cybersecurity training 70% completed",
      reason: "Mandatory security training",
      issueDate: "2025-08-01",
      resolveDate: "2025-10-15",
      additionalNotes: "Target: 100% completion by Oct 15",
      bonus: { currency: "USD", amount: "4000" },
      location: "Lucknow",
      state: "Uttar Pradesh",
      salary: { currency: "USD", amount: "7000" },
      deduction: { currency: "USD", amount: "1000" },
    },
    {
      id: 14,
      name: "Code of conduct acceptance",
      category: "Policy",
      type: "Quality",
      lastUpdated: "2025-10-15",
      status: "Compliant",
      employeeName: "Daniel Thompson",
      department: "Legal",
      designation: "Consultant",
      comments: "100% acceptance from all employees",
      reason: "Annual code of conduct update",
      issueDate: "2025-09-01",
      resolveDate: "2025-10-15",
      additionalNotes: "All 250 employees have signed",
      bonus: { currency: "GBP", amount: "6000" },
      location: "Bhopal",
      state: "Madhya Pradesh",
      salary: { currency: "GBP", amount: "9000" },
      deduction: { currency: "GBP", amount: "1400" },
    },
    {
      id: 15,
      name: "POSH training completion",
      category: "Policy",
      type: "Training Required",
      lastUpdated: "2025-09-09",
      status: "Pending",
      employeeName: "Emma Davis",
      department: "HR",
      designation: "Manager",
      comments: "Scheduled for next month, invites sent",
      reason: "Annual POSH training",
      issueDate: "2025-08-15",
      resolveDate: "2025-10-30",
      additionalNotes: "External trainer booked for Oct 30",
      bonus: { currency: "INR", amount: "32000" },
      location: "Coimbatore",
      state: "Tamil Nadu",
      salary: { currency: "INR", amount: "80000" },
      deduction: { currency: "INR", amount: "13000" },
    },
  ]);

  // Filter data based on active tab, search, and filters - using useMemo for performance
  const filteredData = useMemo(() => {
    return complianceData.filter((item) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "statutory" && item.category === "Statutory") ||
        (activeTab === "document" && item.category === "Document") ||
        (activeTab === "policy" && item.category === "Policy");

      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.reason &&
          item.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.comments &&
          item.comments.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.additionalNotes &&
          item.additionalNotes
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesFilters =
        (!filters.department || item.department === filters.department) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.location ||
          item.location.toLowerCase().includes(filters.location.toLowerCase()));

      return matchesTab && matchesSearch && matchesFilters;
    });
  }, [complianceData, activeTab, searchTerm, filters]);

  // Get unique values for filters
  const departments = [
    ...new Set(complianceData.map((item) => item.department).filter(Boolean)),
  ];
  const statuses = [
    ...new Set(complianceData.map((item) => item.status).filter(Boolean)),
  ];
  const locations = [
    ...new Set(complianceData.map((item) => item.location).filter(Boolean)),
  ];

  // Open modal for different modes
  const openModal = (mode, data = null) => {
    setModalState({ isOpen: true, mode, data });
  };

  // Close modal
  const closeModal = (openEdit = false, editData = null) => {
    setModalState({ isOpen: false, mode: "create", data: null });

    if (openEdit && editData) {
      setTimeout(() => {
        setModalState({ isOpen: true, mode: "edit", data: editData });
      }, 50);
    }
  };

  // Handle save
  const handleSave = (data) => {
    if (modalState.mode === "create") {
      const newId =
        complianceData.length > 0
          ? Math.max(...complianceData.map((d) => d.id)) + 1
          : 1;
      setComplianceData([...complianceData, { ...data, id: newId }]);
    } else if (modalState.mode === "edit" && modalState.data) {
      setComplianceData(
        complianceData.map((item) =>
          item.id === modalState.data.id ? { ...data, id: item.id } : item
        )
      );
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this compliance report?")
    ) {
      setComplianceData(complianceData.filter((item) => item.id !== id));
      setSelectedReports(selectedReports.filter((reportId) => reportId !== id));
    }
  };

  // Handle approve
  const handleApprove = (id) => {
    if (
      window.confirm("Are you sure you want to approve this compliance report?")
    ) {
      setComplianceData(
        complianceData.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "Compliant",
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : item
        )
      );
    }
  };

  // Handle reject
  const handleReject = (id) => {
    if (
      window.confirm("Are you sure you want to reject this compliance report?")
    ) {
      setComplianceData(
        complianceData.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "Non-Compliant",
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : item
        )
      );
    }
  };

  // Toggle report selection
  const toggleReportSelection = (id) => {
    setSelectedReports((prev) =>
      prev.includes(id)
        ? prev.filter((reportId) => reportId !== id)
        : [...prev, id]
    );
  };

  // Select all filtered reports
  const selectAllReports = () => {
    if (selectedReports.length === filteredData.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredData.map((report) => report.id));
    }
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Statutory":
        return <BarChart3 size={18} className="text-primary" />;
      case "Document":
        return <FileText size={18} className="text-success" />;
      case "Policy":
        return <Shield size={18} className="text-warning" />;
      default:
        return <FileCheck size={18} className="text-secondary" />;
    }
  };

  // Calculate statistics
  const stats = {
    total: complianceData.length,
    compliant: complianceData.filter((d) => d.status === "Compliant").length,
    nonCompliant: complianceData.filter(
      (d) => d.status === "Non-Compliant" || d.status === "Alert"
    ).length,
    pending: complianceData.filter(
      (d) => d.status === "Pending" || d.status === "In Progress"
    ).length,
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ department: "", status: "", location: "" });
    setSearchTerm("");
    setSelectedReports([]);
  };

  // ==================== EXPORT FUNCTIONS ====================

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Compliance Reports", 105, 20, { align: "center" });

    // Subtitle with filter info
    doc.setFontSize(10);
    let subtitle = "All Reports";
    if (activeTab !== "all") {
      subtitle = `${
        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
      } Reports`;
    }
    if (searchTerm) subtitle += ` | Search: "${searchTerm}"`;
    doc.text(subtitle, 105, 30, { align: "center" });

    doc.text(
      `Generated: ${new Date().toLocaleDateString()} | Total: ${
        filteredData.length
      } reports`,
      105,
      35,
      { align: "center" }
    );

    // Prepare table data - updated with new fields
    const tableColumn = [
      "ID",
      "Report Name",
      "Employee",
      "Department",
      "Status",
      "Last Updated",
      "Reason",
      "Issue Date",
      "Resolve Date",
      "Location",
    ];

    const tableRows = filteredData.map((report) => [
      report.id,
      report.name,
      report.employeeName,
      report.department,
      report.status,
      report.lastUpdated,
      report.reason || "-",
      report.issueDate || "-",
      report.resolveDate || "-",
      report.location,
    ]);

    // Add table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 40 },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 10 }, // ID
        1: { cellWidth: 25 }, // Report Name
        2: { cellWidth: 20 }, // Employee
        3: { cellWidth: 18 }, // Department
        4: { cellWidth: 15 }, // Status
        5: { cellWidth: 15 }, // Last Updated
        6: { cellWidth: 25 }, // Reason
        7: { cellWidth: 15 }, // Issue Date
        8: { cellWidth: 15 }, // Resolve Date
        9: { cellWidth: 15 }, // Location
      },
    });

    // Get final Y position and add summary
    const finalY = doc.lastAutoTable.finalY || 200;

    doc.setFontSize(11);
    doc.text("Summary Statistics:", 14, finalY + 10);
    doc.setFontSize(10);
    doc.text(`• Total Reports: ${filteredData.length}`, 14, finalY + 20);
    doc.text(
      `• Compliant: ${
        filteredData.filter((r) => r.status === "Compliant").length
      }`,
      14,
      finalY + 27
    );
    doc.text(
      `• Non-Compliant: ${
        filteredData.filter(
          (r) => r.status === "Non-Compliant" || r.status === "Alert"
        ).length
      }`,
      14,
      finalY + 34
    );
    doc.text(
      `• Pending/In Progress: ${
        filteredData.filter(
          (r) => r.status === "Pending" || r.status === "In Progress"
        ).length
      }`,
      14,
      finalY + 41
    );

    // Add additional summary for new fields
    const resolvedCount = filteredData.filter(
      (r) => r.resolveDate && r.resolveDate !== ""
    ).length;
    doc.text(`• Resolved Issues: ${resolvedCount}`, 14, finalY + 48);
    doc.text(
      `• Open Issues: ${filteredData.length - resolvedCount}`,
      14,
      finalY + 55
    );

    // Footer
    doc.setFontSize(8);
    doc.text("Confidential - Compliance Department", 14, 280);
    doc.text(`Page 1 of 1`, 190, 280, { align: "right" });

    doc.save(`Compliance_Reports_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Export to Excel
  const exportToExcel = () => {
    // Prepare data for Excel - updated with new fields
    const excelData = filteredData.map((report) => ({
      "Report ID": report.id,
      "Report Name": report.name,
      Category: report.category,
      "Employee Name": report.employeeName,
      Department: report.department,
      Designation: report.designation,
      Location: report.location,
      State: report.state,
      Reason: report.reason || "",
      "Issue Date": report.issueDate || "",
      "Resolve Date": report.resolveDate || "",
      Comments: report.comments,
      "Additional Notes": report.additionalNotes || "",
      Salary: formatCurrency(report.salary),
      Bonus: formatCurrency(report.bonus),
      Deduction: formatCurrency(report.deduction),
      "Last Updated": report.lastUpdated,
      Status: report.status,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Compliance Reports");

    // Set column widths
    const wscols = [
      { wch: 8 }, // Report ID
      { wch: 30 }, // Report Name
      { wch: 12 }, // Category
      { wch: 20 }, // Employee Name
      { wch: 15 }, // Department
      { wch: 18 }, // Designation
      { wch: 15 }, // Location
      { wch: 15 }, // State
      { wch: 25 }, // Reason
      { wch: 12 }, // Issue Date
      { wch: 12 }, // Resolve Date
      { wch: 40 }, // Comments
      { wch: 40 }, // Additional Notes
      { wch: 15 }, // Salary
      { wch: 15 }, // Bonus
      { wch: 15 }, // Deduction
      { wch: 12 }, // Last Updated
      { wch: 15 }, // Status
    ];
    worksheet["!cols"] = wscols;

    // Add header styling (optional - makes headers bold)
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cell_address]) continue;

      // Make headers bold
      worksheet[cell_address].s = {
        font: { bold: true },
        alignment: { vertical: "center", horizontal: "center" },
      };
    }

    // Add conditional formatting for Status column (column Q/17)
    // Note: This is a basic example - Excel conditional formatting would need additional libraries
    const statusColIndex = 17; // Status is column R (0-indexed 17)
    for (let R = 1; R <= filteredData.length; ++R) {
      const cell_address = XLSX.utils.encode_cell({ r: R, c: statusColIndex });
      if (worksheet[cell_address]) {
        const status = worksheet[cell_address].v;
        let fillColor = "";

        // Set background colors based on status
        switch (status) {
          case "Compliant":
            fillColor = "C6EFCE"; // Light green
            break;
          case "Non-Compliant":
          case "Alert":
            fillColor = "FFC7CE"; // Light red
            break;
          case "Pending":
          case "In Progress":
            fillColor = "FFEB9C"; // Light yellow
            break;
          case "Missing":
          case "Expired":
            fillColor = "F2F2F2"; // Light gray
            break;
        }

        if (fillColor) {
          worksheet[cell_address].s = {
            ...worksheet[cell_address].s,
            fill: { fgColor: { rgb: fillColor } },
          };
        }
      }
    }

    // Save file
    XLSX.writeFile(
      workbook,
      `Compliance_Reports_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // Export selected reports to PDF
  const exportSelectedToPDF = () => {
    if (selectedReports.length === 0) {
      alert("Please select at least one report to export");
      return;
    }

    const selectedData = filteredData.filter((report) =>
      selectedReports.includes(report.id)
    );

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Selected Compliance Reports", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(
      `Exported: ${new Date().toLocaleDateString()} | Selected: ${
        selectedData.length
      } reports`,
      105,
      30,
      { align: "center" }
    );

    // Detailed table for selected reports - updated with new fields
    const tableColumn = [
      "ID",
      "Report Name",
      "Employee",
      "Department",
      "Designation",
      "Reason",
      "Issue Date",
      "Resolve Date",
      "Location",
      "Status",
    ];

    const tableRows = selectedData.map((report) => [
      report.id,
      report.name,
      report.employeeName,
      report.department,
      report.designation,
      report.reason || "-",
      report.issueDate || "-",
      report.resolveDate || "-",
      report.location,
      report.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      headStyles: { fillColor: [51, 102, 153] },
      margin: { top: 40 },
      styles: { fontSize: 7 },
      columnStyles: {
        0: { cellWidth: 10 }, // ID
        1: { cellWidth: 25 }, // Report Name
        2: { cellWidth: 20 }, // Employee
        3: { cellWidth: 15 }, // Department
        4: { cellWidth: 18 }, // Designation
        5: { cellWidth: 25 }, // Reason
        6: { cellWidth: 15 }, // Issue Date
        7: { cellWidth: 15 }, // Resolve Date
        8: { cellWidth: 15 }, // Location
        9: { cellWidth: 15 }, // Status
      },
    });

    // Add summary for selected reports
    const finalY = doc.lastAutoTable.finalY || 200;

    doc.setFontSize(10);
    doc.text("Selected Reports Summary:", 14, finalY + 10);
    doc.setFontSize(9);

    // Calculate status counts for selected reports
    const selectedCompliant = selectedData.filter(
      (r) => r.status === "Compliant"
    ).length;
    const selectedNonCompliant = selectedData.filter(
      (r) => r.status === "Non-Compliant" || r.status === "Alert"
    ).length;
    const selectedPending = selectedData.filter(
      (r) => r.status === "Pending" || r.status === "In Progress"
    ).length;
    const selectedResolved = selectedData.filter(
      (r) => r.resolveDate && r.resolveDate !== ""
    ).length;

    doc.text(`• Compliant: ${selectedCompliant}`, 14, finalY + 20);
    doc.text(`• Non-Compliant: ${selectedNonCompliant}`, 14, finalY + 27);
    doc.text(`• Pending/In Progress: ${selectedPending}`, 14, finalY + 34);
    doc.text(`• Resolved Issues: ${selectedResolved}`, 14, finalY + 41);
    doc.text(
      `• Open Issues: ${selectedData.length - selectedResolved}`,
      14,
      finalY + 48
    );

    doc.save(
      `Selected_Compliance_Reports_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        {/* Main Content */}
        <div className="col-lg-12">
          {/* Header with Stats */}
          <div className="row mb-4">
            <div className="col-12">
              {/* Page Header */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded">
                    <FileCheck className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Compliance Dashboard</h5>
                    <p className="text-muted mb-0">
                      Monitor and manage all compliance reports
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-primary d-flex align-items-center gap-2 px-3 px-md-4 ms-md-auto"
                  onClick={() => openModal("create")}
                >
                  <Plus size={20} />
                  <span>Create New Report</span>
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="row g-3 mb-4">
                <div className="col-md-3 col-sm-6">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body d-flex flex-column justify-content-between p-3">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="text-muted mb-1 small">
                              Total Reports
                            </h6>
                            <h4 className="mb-0 fw-bold">{stats.total}</h4>
                          </div>
                          <div className="bg-primary bg-opacity-10 p-1 rounded">
                            <FileCheck className="text-primary" size={20} />
                          </div>
                        </div>
                      </div>
                      <div className="text-muted small">
                        All compliance categories
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body d-flex flex-column justify-content-between p-3">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="text-muted mb-1 small">Compliant</h6>
                            <h4 className="mb-0 fw-bold text-success">
                              {stats.compliant}
                            </h4>
                          </div>
                          <div className="bg-success bg-opacity-10 p-1 rounded">
                            <CheckCircle className="text-success" size={20} />
                          </div>
                        </div>
                      </div>
                      <div className="text-success small">
                        {stats.total > 0
                          ? `${Math.round(
                              (stats.compliant / stats.total) * 100
                            )}% compliance rate`
                          : "No reports"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body d-flex flex-column justify-content-between p-3">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="text-muted mb-1 small">
                              Non-Compliant
                            </h6>
                            <h4 className="mb-0 fw-bold text-danger">
                              {stats.nonCompliant}
                            </h4>
                          </div>
                          <div className="bg-danger bg-opacity-10 p-1 rounded">
                            <AlertCircle className="text-danger" size={20} />
                          </div>
                        </div>
                      </div>
                      <div className="text-danger small">
                        {stats.nonCompliant > 0
                          ? "Requires attention"
                          : "All compliant"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body d-flex flex-column justify-content-between p-3">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="text-muted mb-1 small">Pending</h6>
                            <h4 className="mb-0 fw-bold text-warning">
                              {stats.pending}
                            </h4>
                          </div>
                          <div className="bg-warning bg-opacity-10 p-1 rounded">
                            <Clock className="text-warning" size={20} />
                          </div>
                        </div>
                      </div>
                      <div className="text-warning small">
                        {stats.pending > 0
                          ? "In progress / Awaiting review"
                          : "All processed"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="col-12 mb-4">
                <div className="d-flex overflow-auto">
                  <div className="d-flex flex-nowrap gap-2 w-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab("all")}
                      className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${
                        activeTab === "all"
                          ? "btn-primary text-white"
                          : "btn-outline-primary"
                      }`}
                    >
                      <Home size={18} />
                      <span>All Reports</span>
                      <span className="badge bg-light text-dark ms-2">
                        {stats.total}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("statutory")}
                      className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${
                        activeTab === "statutory"
                          ? "btn-primary text-white"
                          : "btn-outline-primary"
                      }`}
                    >
                      <Briefcase size={18} />
                      <span>Statutory</span>
                      <span className="badge bg-light text-dark ms-2">
                        {
                          complianceData.filter(
                            (item) => item.category === "Statutory"
                          ).length
                        }
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("document")}
                      className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${
                        activeTab === "document"
                          ? "btn-primary text-white"
                          : "btn-outline-primary"
                      }`}
                    >
                      <FolderCheck size={18} />
                      <span>Document</span>
                      <span className="badge bg-light text-dark ms-2">
                        {
                          complianceData.filter(
                            (item) => item.category === "Document"
                          ).length
                        }
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("policy")}
                      className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${
                        activeTab === "policy"
                          ? "btn-primary text-white"
                          : "btn-outline-primary"
                      }`}
                    >
                      <Shield size={18} />
                      <span>Policy</span>
                      <span className="badge bg-light text-dark ms-2">
                        {
                          complianceData.filter(
                            (item) => item.category === "Policy"
                          ).length
                        }
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="row mb-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search reports, employees, departments, locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {selectedReports.length > 0 && (
                      <button
                        className="btn btn-success"
                        onClick={exportSelectedToPDF}
                      >
                        <Download size={18} className="me-1" />
                        Export Selected ({selectedReports.length})
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary d-flex align-items-center gap-2"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#filterPanel"
                    >
                      <Filter size={18} />
                      Filter
                    </button>

                    {/* Export Dropdown */}
                    <ExportDropdown
                      onExportPDF={exportToPDF}
                      onExportExcel={exportToExcel}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              <div className="collapse mb-3" id="filterPanel">
                <div className="card">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">
                          Department
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={filters.department}
                          onChange={(e) =>
                            handleFilterChange("department", e.target.value)
                          }
                        >
                          <option value="">All Departments</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">
                          Status
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={filters.status}
                          onChange={(e) =>
                            handleFilterChange("status", e.target.value)
                          }
                        >
                          <option value="">All Status</option>
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">
                          Location
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={filters.location}
                          onChange={(e) =>
                            handleFilterChange("location", e.target.value)
                          }
                        >
                          <option value="">All Locations</option>
                          {locations.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small text-muted">
                            {filteredData.length} reports found
                          </span>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={selectAllReports}
                            >
                              {selectedReports.length === filteredData.length
                                ? "Deselect All"
                                : "Select All"}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={clearFilters}
                            >
                              Clear Filters
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Reports Table */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th width="50">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            selectedReports.length === filteredData.length &&
                            filteredData.length > 0
                          }
                          onChange={selectAllReports}
                        />
                      </th>
                      <th width="50">SN</th>
                      <th>Report Name</th>
                      <th>Employee Name</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Location</th>
                      <th>State</th>
                      <th>Reason</th>
                      <th>Date of Issue</th>
                      <th>Resolve Date</th>
                      <th>Comments</th>
                      <th>Additional Notes</th>
                      <th>Salary</th>
                      <th>Bonus</th>
                      <th>Deduction</th>
                      <th>Last Updated</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedReports.includes(item.id)}
                              onChange={() => toggleReportSelection(item.id)}
                            />
                          </td>
                          <td className="text-center">
                            <span className="badge bg-secondary">
                              {index + 1}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {getCategoryIcon(item.category)}
                              <div>
                                <strong>{item.name}</strong>
                                <div className="small text-muted">
                                  <span className="badge bg-light text-dark">
                                    {item.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <User size={14} className="text-muted" />
                              <span>{item.employeeName}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info bg-opacity-10 text-info">
                              {item.department}
                            </span>
                          </td>
                          <td>
                            <span className="small">{item.designation}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <MapPin size={12} className="text-muted" />
                              <span className="small">{item.location}</span>
                            </div>
                          </td>
                          <td>
                            <span className="small">{item.state}</span>
                          </td>
                          {/* New: Reason Field */}
                          <td>
                            <div
                              className="small text-truncate"
                              style={{ maxWidth: "150px" }}
                              title={item.reason}
                            >
                              {item.reason}
                            </div>
                          </td>

                          {/* New: Date of Issue Field */}
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <Calendar size={12} className="text-danger" />
                              <span className="small">{item.issueDate}</span>
                            </div>
                          </td>

                          {/* New: Resolve Issue Date Field */}
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <Calendar size={12} className="text-success" />
                              <span className="small">{item.resolveDate}</span>
                            </div>
                          </td>

                          {/* New: Comments Field */}
                          <td>
                            <div
                              className="small text-truncate"
                              style={{ maxWidth: "150px" }}
                              title={item.comments}
                            >
                              {item.comments}
                            </div>
                          </td>

                          {/* New: Additional Notes Field */}
                          <td>
                            <div
                              className="small text-truncate"
                              style={{ maxWidth: "150px" }}
                              title={item.additionalNotes}
                            >
                              {item.additionalNotes}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <DollarSign size={12} className="text-success" />
                              <span className="small fw-semibold">
                                {formatCurrency(item.salary)}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <CreditCard size={12} className="text-warning" />
                              <span className="small">
                                {formatCurrency(item.bonus)}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <Calculator size={12} className="text-danger" />
                              <span className="small">
                                {formatCurrency(item.deduction)}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <Calendar size={12} className="text-muted" />
                              <span className="small">{item.lastUpdated}</span>
                            </div>
                          </td>
                          <td>
                            <StatusBadge status={item.status} />
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => openModal("view", item)}
                                title="View"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => openModal("edit", item)}
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>

                              {[
                                "Pending",
                                "Alert",
                                "In Progress",
                                "Missing",
                                "Expired",
                              ].includes(item.status) && (
                                <>
                                  <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => handleApprove(item.id)}
                                    title="Approve"
                                  >
                                    <CheckCircle size={14} />
                                  </button>
                                  <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={() => handleReject(item.id)}
                                    title="Reject"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                </>
                              )}

                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(item.id)}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="14" className="text-center py-4">
                          <div className="text-muted">
                            <FileCheck size={48} className="mb-3 opacity-50" />
                            <h5>No compliance reports found</h5>
                            <p>Try adjusting your search or filter criteria</p>
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

      {/* Modal */}
      {modalState.isOpen && (
        <ComplianceModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          mode={modalState.mode}
          data={modalState.data}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ComplianceReports;
