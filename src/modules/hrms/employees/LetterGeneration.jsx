import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Trash2, // For delete button
  Lightbulb,
  FileCheck,
  FileSpreadsheet,
  File,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  Edit,
  Eye,
  ArrowUpDown,
  Calendar,
  Clock,
  User,
  Building,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Shield,
  MapPin,
  Briefcase,
  Users,
  Send,
  Search,
  Filter,
  ChevronRight,
  Save,
  RefreshCw,
  Settings,
  BarChart3,
  Archive,
  Bot,
  Sparkles,
  Zap,
  FileSignature,
  Info,
  Plus,
  X as XIcon,
  Check as CheckIcon,
  CreditCard,
  GitBranch,
  ClipboardList,
  AlertTriangle,
  UserCheck,
  FileEdit,
  FileClock as FileClockIcon,
  Mail as MailIcon,
  Square as SquareIcon,
  CreditCard as CreditCardIcon,
  FileWarning as FileWarningIcon,
  Menu,
  X,
  HelpCircle, // Add this import
} from "lucide-react";
// Import these at the top of your file if not already imported
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";

// Add these state variables with the existing ones at the top
const LetterGeneration = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showLetterDetailsCard, setShowLetterDetailsCard] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add with other state declarations
  const [selectedRequestForEdit, setSelectedRequestForEdit] = useState(null);
  const [editingRequestData, setEditingRequestData] = useState({});
  const [showEditRequestCard, setShowEditRequestCard] = useState(false);
  // Add these state variables
  const [showAuditTrailModal, setShowAuditTrailModal] = useState(false);
  const [selectedAuditTrail, setSelectedAuditTrail] = useState([]);
  const [selectedAuditRequest, setSelectedAuditRequest] = useState(null);
  const [showAuditTrailCard, setShowAuditTrailCard] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  // Add these state variables
  const [generatedLetters, setGeneratedLetters] = useState([]);
  const [editingLetter, setEditingLetter] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // Add these state variables with your other useState declarations
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLetterToDelete, setSelectedLetterToDelete] = useState(null);
  const [showRejectCard, setShowRejectCard] = useState(false);
  const [selectedLetterToReject, setSelectedLetterToReject] = useState(null);
  // Add these state variables at the beginning of your component, after the other useState declarations
  const [formData, setFormData] = useState({});
  // Add these state variables
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  // Add these state variables with your other useState declarations
  const [showExportCard, setShowExportCard] = useState(false);
  // Add these state variables
  const [templateNotification, setTemplateNotification] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });
  const [selectedTemplateForEdit, setSelectedTemplateForEdit] = useState(null);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);

  // Add these with your other useState declarations
  const [workflowRequests, setWorkflowRequests] = useState([]);
  const [showDigitalSignatureCard, setShowDigitalSignatureCard] =
    useState(false);
  const [selectedSignatureRequest, setSelectedSignatureRequest] =
    useState(null);
  const [showWorkflowReport, setShowWorkflowReport] = useState(false);
  const [showBulkApproveConfirm, setShowBulkApproveConfirm] = useState(false);
  const [showRejectReasonCard, setShowRejectReasonCard] = useState(false);
  const [selectedRequestToReject, setSelectedRequestToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);
  const [terminatedCount, setTerminatedCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [newWorkflowTemplate, setNewWorkflowTemplate] = useState("");
  const [newWorkflowPriority, setNewWorkflowPriority] = useState("Medium");
  const [newWorkflowPurpose, setNewWorkflowPurpose] = useState("");
  const [workflowView, setWorkflowView] = useState("all");
  const [workflowFilter, setWorkflowFilter] = useState({
    templateType: "",
    priority: "",
    search: "",
  });
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showWorkflowDetails, setShowWorkflowDetails] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  // Add these state variables at the beginning
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: "",
    priority: "",
    templateType: "",
    department: "",
    employeeId: "",
    startDate: "",
    endDate: "",
  });

  // Add these state variables with your other useState declarations
  const [newWorkflowEmployee, setNewWorkflowEmployee] = useState("");
  const [newWorkflowEmployeeName, setNewWorkflowEmployeeName] = useState("");
  const [newWorkflowDesignation, setNewWorkflowDesignation] = useState("");
  const [newWorkflowDepartment, setNewWorkflowDepartment] = useState("");
  const [newWorkflowEmployeeEmail, setNewWorkflowEmployeeEmail] = useState("");

  // Add these state variables at the beginning
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  // Add this notification state at the top
  const [actionNotification, setActionNotification] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  // Ref for SLA inputs
  const slaHighRef = useRef(null);
  const slaMediumRef = useRef(null);
  const slaLowRef = useRef(null);

  // Update your workflowRequests initialization to include the new fields
  useEffect(() => {
    if (workflowRequests.length === 0) {
      const initialWorkflows = letterRequests.map((request) => ({
        ...request,
        // Add these three fields with data from letterRequests
        designation: request.designation || "Senior Developer",
        department: request.department || "Engineering",
        lastPromoted: request.lastPromoted || "2023-06-15",
        workflowStatus:
          request.status === "approved"
            ? "completed"
            : request.status === "rejected"
            ? "terminated"
            : "in_progress",
        currentStep: request.currentStep || "Request Submission",
        steps:
          letterTemplates.find((t) => t.templateType === request.templateType)
            ?.workflowSteps || [],
        progress: 0,
        digitalSignature: request.digitalSignature || false,
        hrArchived: false,
        auditTrail: request.auditTrail || [],
      }));
      setWorkflowRequests(initialWorkflows);
    }
  }, []);

  // Menu items for the dashboard layout
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart3 size={20} />,
      active: true,
    },
    { id: "templates", label: "Templates", icon: <FileText size={20} /> },
    { id: "generator", label: "Generator", icon: <FileEdit size={20} /> },
    { id: "requests", label: "Requests", icon: <ClipboardList size={20} /> },
    { id: "workflow", label: "Workflow", icon: <GitBranch size={20} /> },
    { id: "employee", label: "Employees", icon: <User size={20} /> },
    { id: "archive", label: "Archive", icon: <Archive size={20} /> },
    { id: "reports", label: "Reports", icon: <FileText size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // User info for the dashboard layout
  const userInfo = {
    name: "HR Manager",
    role: "Human Resources",
    avatar: "HR",
  };

  // Letter Templates Data with all 12 templates
  const [letterTemplates, setLetterTemplates] = useState([
    {
      id: 1,
      templateId: "TMP001",
      templateName: "Experience Certificate",
      templateType: "experience",
      category: "Employment",
      description:
        "Certifies employment duration and role with performance details",
      icon: "FileCheck",
      usageCount: 245,
      lastUsed: "2024-03-15",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["Manager", "HR"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
        },
        {
          name: "joiningDate",
          label: "Joining Date",
          type: "date",
          required: true,
        },
        {
          name: "relievingDate",
          label: "Relieving Date",
          type: "date",
          required: false,
        },
        {
          name: "employmentDuration",
          label: "Employment Duration",
          type: "text",
          required: true,
        },
        {
          name: "responsibilities",
          label: "Key Responsibilities",
          type: "textarea",
          required: true,
        },
        {
          name: "achievements",
          label: "Achievements",
          type: "textarea",
          required: false,
        },
        {
          name: "performanceRating",
          label: "Performance Rating",
          type: "select",
          options: ["Excellent", "Good", "Average", "Below Average"],
        },
        {
          name: "reasonForLeaving",
          label: "Reason for Leaving",
          type: "text",
          required: false,
        },
      ],
      workflowSteps: [
        "Request Submission",
        "Manager Approval",
        "HR Approval",
        "Generation",
        "Digital Signature",
      ],
      sla: "24 hours",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 2,
      templateId: "TMP002",
      templateName: "Relieving Letter",
      templateType: "relieving",
      category: "Exit",
      description:
        "Confirms employment termination with clearance verification",
      icon: "CheckCircle",
      usageCount: 189,
      lastUsed: "2024-03-18",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["Manager", "HR", "Finance", "IT"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
        },
        {
          name: "joiningDate",
          label: "Joining Date",
          type: "date",
          required: true,
        },
        {
          name: "lastWorkingDate",
          label: "Last Working Date",
          type: "date",
          required: true,
        },
        {
          name: "relievingDate",
          label: "Relieving Date",
          type: "date",
          required: true,
        },
        {
          name: "noticePeriod",
          label: "Notice Period Served",
          type: "text",
          required: true,
        },
        {
          name: "clearanceStatus",
          label: "Clearance Status",
          type: "select",
          options: ["Completed", "Pending", "Partial"],
          required: true,
        },
        {
          name: "assetsReturned",
          label: "Assets Returned",
          type: "textarea",
          required: true,
        },
        {
          name: "duesCleared",
          label: "Dues Cleared",
          type: "select",
          options: ["Yes", "No", "Partial"],
          required: true,
        },
        {
          name: "finalSettlement",
          label: "Final Settlement Details",
          type: "textarea",
          required: false,
        },
      ],
      workflowSteps: [
        "Request Submission",
        "Department Clearance",
        "Finance Clearance",
        "IT Clearance",
        "HR Approval",
        "Generation",
      ],
      sla: "48 hours",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 3,
      templateId: "TMP003",
      templateName: "Salary Certificate",
      templateType: "salary",
      category: "Financial",
      description: "Official salary verification for banks and loans",
      icon: "DollarSign",
      usageCount: 312,
      lastUsed: "2024-03-20",
      status: "Active",
      autoApprove: true,
      requiredApprovals: ["HR", "Finance"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
        },
        {
          name: "joiningDate",
          label: "Joining Date",
          type: "date",
          required: true,
        },
        {
          name: "salaryEffectiveDate",
          label: "Salary Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "monthlyCTC",
          label: "Monthly CTC (₹)",
          type: "number",
          required: true,
        },
        {
          name: "annualCTC",
          label: "Annual CTC (₹)",
          type: "number",
          required: true,
        },
        {
          name: "basicSalary",
          label: "Basic Salary (₹)",
          type: "number",
          required: true,
        },
        { name: "hra", label: "HRA (₹)", type: "number", required: true },
        {
          name: "specialAllowance",
          label: "Special Allowance (₹)",
          type: "number",
          required: true,
        },
        {
          name: "otherAllowances",
          label: "Other Allowances (₹)",
          type: "number",
          required: false,
        },
        {
          name: "pfDeduction",
          label: "PF Deduction (₹)",
          type: "number",
          required: true,
        },
        {
          name: "professionalTax",
          label: "Professional Tax (₹)",
          type: "number",
          required: true,
        },
        {
          name: "takeHomeSalary",
          label: "Take Home Salary (₹)",
          type: "number",
          required: true,
        },
        {
          name: "incomeTax",
          label: "Income Tax (₹)",
          type: "number",
          required: true,
        },
      ],
      workflowSteps: [
        "Request Submission",
        "Auto-Approval",
        "Generation",
        "Digital Signature",
      ],
      sla: "2 hours",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 4,
      templateId: "TMP004",
      templateName: "No Objection Certificate (NOC)",
      templateType: "noc",
      category: "Legal",
      description:
        "Permission for external activities with compliance checking",
      icon: "Shield",
      usageCount: 78,
      lastUsed: "2024-03-10",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["Manager", "HR", "Legal"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
        },
        {
          name: "activityType",
          label: "Activity Type",
          type: "select",
          options: [
            "Part-time Course",
            "Freelance Work",
            "Business Activity",
            "Consulting",
            "Other",
          ],
          required: true,
        },
        {
          name: "activityDescription",
          label: "Activity Description",
          type: "textarea",
          required: true,
        },
        {
          name: "activityDuration",
          label: "Activity Duration",
          type: "text",
          required: true,
        },
        {
          name: "startDate",
          label: "Start Date",
          type: "date",
          required: true,
        },
        { name: "endDate", label: "End Date", type: "date", required: true },
        { name: "purpose", label: "Purpose", type: "textarea", required: true },
        {
          name: "conflictCheck",
          label: "Conflict of Interest Check",
          type: "select",
          options: ["No Conflict", "Potential Conflict", "Requires Review"],
          required: true,
        },
        {
          name: "nonDisclosure",
          label: "Non-Disclosure Required",
          type: "checkbox",
          required: false,
        },
        {
          name: "complianceCheck",
          label: "Compliance Check Status",
          type: "select",
          options: ["Approved", "Pending", "Rejected"],
          required: true,
        },
      ],
      workflowSteps: [
        "Request Submission",
        "Manager Review",
        "Legal Review",
        "HR Approval",
        "Generation",
      ],
      sla: "72 hours",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 5,
      templateId: "TMP005",
      templateName: "Employment Verification Letter",
      templateType: "verification",
      category: "Employment",
      description:
        "Verifies current employment status for external verification",
      icon: "UserCheck",
      usageCount: 156,
      lastUsed: "2024-03-12",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["HR", "Manager"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
        },
        {
          name: "joiningDate",
          label: "Joining Date",
          type: "date",
          required: true,
        },
        {
          name: "employmentStatus",
          label: "Employment Status",
          type: "select",
          options: ["Active", "Probation", "Contract", "Intern"],
          required: true,
        },
        {
          name: "currentSalary",
          label: "Current Salary (₹)",
          type: "number",
          required: false,
        },
        {
          name: "verificationPurpose",
          label: "Verification Purpose",
          type: "select",
          options: [
            "Bank Loan",
            "Visa Application",
            "Rental Agreement",
            "Other",
          ],
          required: true,
        },
        {
          name: "verifierName",
          label: "Verifier Name",
          type: "text",
          required: true,
        },
        {
          name: "verifierContact",
          label: "Verifier Contact",
          type: "text",
          required: true,
        },
        {
          name: "verificationDate",
          label: "Verification Date",
          type: "date",
          required: true,
        },
      ],
      workflowSteps: [
        "Request Submission",
        "Manager Verification",
        "HR Approval",
        "Generation",
      ],
      sla: "24 hours",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 6,
      templateId: "TMP006",
      templateName: "Promotion Letter",
      templateType: "promotion",
      category: "Career",
      description: "Official promotion notification with new responsibilities",
      icon: "TrendingUp",
      usageCount: 45,
      lastUsed: "2024-02-28",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["Manager", "HR", "Department Head"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "currentDesignation",
          label: "Current Designation",
          type: "text",
          required: true,
        },
        {
          name: "newDesignation",
          label: "New Designation",
          type: "text",
          required: true,
        },
        {
          name: "currentDepartment",
          label: "Current Department",
          type: "text",
          required: true,
        },
        {
          name: "newDepartment",
          label: "New Department",
          type: "text",
          required: false,
        },
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "currentSalary",
          label: "Current Salary (₹)",
          type: "number",
          required: true,
        },
        {
          name: "newSalary",
          label: "New Salary (₹)",
          type: "number",
          required: true,
        },
        {
          name: "percentageIncrease",
          label: "Percentage Increase (%)",
          type: "number",
          required: true,
        },
        {
          name: "newResponsibilities",
          label: "New Responsibilities",
          type: "textarea",
          required: true,
        },
        {
          name: "performanceBasis",
          label: "Performance Basis",
          type: "textarea",
          required: true,
        },
        {
          name: "probationPeriod",
          label: "Probation Period",
          type: "text",
          required: false,
        },
        {
          name: "reportingManager",
          label: "Reporting Manager",
          type: "text",
          required: true,
        },
      ],
      workflowSteps: [
        "Initiation",
        "Performance Review",
        "Department Head Approval",
        "HR Approval",
        "Generation",
        "Employee Acceptance",
      ],
      sla: "5 days",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 7,
      templateId: "TMP007",
      templateName: "Transfer Letter",
      templateType: "transfer",
      category: "Career",
      description: "Official transfer notification to new location/department",
      icon: "MapPin",
      usageCount: 32,
      lastUsed: "2024-02-15",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["Manager", "HR", "Department Head"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "currentDesignation",
          label: "Current Designation",
          type: "text",
          required: true,
        },
        {
          name: "currentLocation",
          label: "Current Location",
          type: "text",
          required: true,
        },
        {
          name: "newLocation",
          label: "New Location",
          type: "text",
          required: true,
        },
        {
          name: "currentDepartment",
          label: "Current Department",
          type: "text",
          required: true,
        },
        {
          name: "newDepartment",
          label: "New Department",
          type: "text",
          required: false,
        },
        {
          name: "transferType",
          label: "Transfer Type",
          type: "select",
          options: ["Permanent", "Temporary", "Project-based"],
          required: true,
        },
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "transferReason",
          label: "Transfer Reason",
          type: "textarea",
          required: true,
        },
        {
          name: "relocationAllowance",
          label: "Relocation Allowance (₹)",
          type: "number",
          required: false,
        },
        {
          name: "reportingManager",
          label: "New Reporting Manager",
          type: "text",
          required: true,
        },
        {
          name: "noticePeriod",
          label: "Notice Period",
          type: "text",
          required: true,
        },
        {
          name: "handoverRequirements",
          label: "Handover Requirements",
          type: "textarea",
          required: true,
        },
      ],
      workflowSteps: [
        "Initiation",
        "Department Approval",
        "HR Approval",
        "Employee Consent",
        "Generation",
      ],
      sla: "3 days",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 8,
      templateId: "TMP008",
      templateName: "Confirmation Letter",
      templateType: "confirmation",
      category: "Employment",
      description: "Confirms permanent employment after probation period",
      icon: "CheckCircle",
      usageCount: 89,
      lastUsed: "2024-03-05",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["Manager", "HR"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
        },
        {
          name: "joiningDate",
          label: "Joining Date",
          type: "date",
          required: true,
        },
        {
          name: "probationEndDate",
          label: "Probation End Date",
          type: "date",
          required: true,
        },
        {
          name: "confirmationDate",
          label: "Confirmation Date",
          type: "date",
          required: true,
        },
        {
          name: "performanceReview",
          label: "Performance Review",
          type: "select",
          options: ["Excellent", "Good", "Satisfactory", "Needs Improvement"],
          required: true,
        },
        {
          name: "confirmedSalary",
          label: "Confirmed Salary (₹)",
          type: "number",
          required: true,
        },
        {
          name: "newBenefits",
          label: "New Benefits",
          type: "textarea",
          required: false,
        },
        {
          name: "noticePeriod",
          label: "Notice Period",
          type: "text",
          required: true,
        },
        {
          name: "nextReviewDate",
          label: "Next Review Date",
          type: "date",
          required: false,
        },
        {
          name: "reportingManager",
          label: "Reporting Manager",
          type: "text",
          required: true,
        },
      ],
      workflowSteps: [
        "Performance Review",
        "Manager Recommendation",
        "HR Approval",
        "Generation",
        "Employee Acknowledgment",
      ],
      sla: "2 days",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 9,
      templateId: "TMP009",
      templateName: "Increment Letter",
      templateType: "increment",
      category: "Financial",
      description: "Official salary increment notification",
      icon: "TrendingUp",
      usageCount: 67,
      lastUsed: "2024-03-01",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["Manager", "HR", "Finance"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
        },
        {
          name: "currentSalary",
          label: "Current Salary (₹)",
          type: "number",
          required: true,
        },
        {
          name: "newSalary",
          label: "New Salary (₹)",
          type: "number",
          required: true,
        },
        {
          name: "incrementAmount",
          label: "Increment Amount (₹)",
          type: "number",
          required: true,
        },
        {
          name: "percentageIncrease",
          label: "Percentage Increase (%)",
          type: "number",
          required: true,
        },
        {
          name: "effectiveDate",
          label: "Effective Date",
          type: "date",
          required: true,
        },
        {
          name: "appraisalCycle",
          label: "Appraisal Cycle",
          type: "text",
          required: true,
        },
        {
          name: "performanceRating",
          label: "Performance Rating",
          type: "select",
          options: [
            "A - Outstanding",
            "B - Excellent",
            "C - Good",
            "D - Average",
            "E - Below Average",
          ],
          required: true,
        },
        {
          name: "performanceHighlights",
          label: "Performance Highlights",
          type: "textarea",
          required: true,
        },
        {
          name: "nextReviewDate",
          label: "Next Review Date",
          type: "date",
          required: true,
        },
      ],
      workflowSteps: [
        "Appraisal Review",
        "Manager Recommendation",
        "Finance Approval",
        "HR Approval",
        "Generation",
      ],
      sla: "3 days",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 10,
      templateId: "TMP010",
      templateName: "Loan Sanction Letter",
      templateType: "loan",
      category: "Financial",
      description: "Approval for employee loan with terms and conditions",
      icon: "CreditCard",
      usageCount: 23,
      lastUsed: "2024-02-20",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["Manager", "HR", "Finance"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
        },
        {
          name: "loanType",
          label: "Loan Type",
          type: "select",
          options: [
            "Personal Loan",
            "Vehicle Loan",
            "Home Loan",
            "Education Loan",
            "Medical Loan",
          ],
          required: true,
        },
        {
          name: "loanAmount",
          label: "Loan Amount (₹)",
          type: "number",
          required: true,
        },
        {
          name: "interestRate",
          label: "Interest Rate (%)",
          type: "number",
          required: true,
        },
        {
          name: "tenure",
          label: "Tenure (Months)",
          type: "number",
          required: true,
        },
        {
          name: "emiAmount",
          label: "EMI Amount (₹)",
          type: "number",
          required: true,
        },
        {
          name: "sanctionDate",
          label: "Sanction Date",
          type: "date",
          required: true,
        },
        {
          name: "disbursementDate",
          label: "Disbursement Date",
          type: "date",
          required: true,
        },
        {
          name: "collateral",
          label: "Collateral Details",
          type: "textarea",
          required: false,
        },
        {
          name: "repaymentStartDate",
          label: "Repayment Start Date",
          type: "date",
          required: true,
        },
        {
          name: "processingFees",
          label: "Processing Fees (₹)",
          type: "number",
          required: false,
        },
        {
          name: "insuranceRequired",
          label: "Insurance Required",
          type: "checkbox",
          required: false,
        },
      ],
      workflowSteps: [
        "Application Submission",
        "Credit Check",
        "Manager Approval",
        "Finance Approval",
        "HR Approval",
        "Generation",
      ],
      sla: "5 days",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 11,
      templateId: "TMP011",
      templateName: "Warning Letter",
      templateType: "warning",
      category: "Disciplinary",
      description: "Formal warning for policy violations or performance issues",
      icon: "AlertTriangle",
      usageCount: 12,
      lastUsed: "2024-02-10",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["Manager", "HR", "Legal"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
        },
        {
          name: "issueDate",
          label: "Issue Date",
          type: "date",
          required: true,
        },
        {
          name: "warningType",
          label: "Warning Type",
          type: "select",
          options: ["Verbal", "First Written", "Final Written", "Show Cause"],
          required: true,
        },
        {
          name: "violationCategory",
          label: "Violation Category",
          type: "select",
          options: [
            "Attendance",
            "Performance",
            "Behavior",
            "Policy Violation",
            "Security Breach",
          ],
          required: true,
        },
        {
          name: "incidentDescription",
          label: "Incident Description",
          type: "textarea",
          required: true,
        },
        {
          name: "incidentDate",
          label: "Incident Date",
          type: "date",
          required: true,
        },
        {
          name: "policyViolated",
          label: "Policy Violated",
          type: "textarea",
          required: true,
        },
        {
          name: "expectedBehavior",
          label: "Expected Behavior",
          type: "textarea",
          required: true,
        },
        {
          name: "improvementPeriod",
          label: "Improvement Period",
          type: "text",
          required: true,
        },
        {
          name: "nextReviewDate",
          label: "Next Review Date",
          type: "date",
          required: true,
        },
        {
          name: "consequences",
          label: "Consequences of Non-compliance",
          type: "textarea",
          required: true,
        },
        {
          name: "employeeAcknowledgment",
          label: "Employee Acknowledgment Required",
          type: "checkbox",
          required: true,
        },
      ],
      workflowSteps: [
        "Incident Report",
        "Manager Review",
        "HR Review",
        "Legal Review",
        "Generation",
        "Employee Acknowledgment",
      ],
      sla: "3 days",
      digitalSignature: true,
      verificationCode: true,
    },
    {
      id: 12,
      templateId: "TMP012",
      templateName: "Termination Letter",
      templateType: "termination",
      category: "Exit",
      description:
        "Official termination of employment with reasons and settlements",
      icon: "XCircle",
      usageCount: 8,
      lastUsed: "2024-02-05",
      status: "Active",
      autoApprove: false,
      requiredApprovals: ["Manager", "HR", "Legal", "Finance"],
      aiOptimized: true,
      defaultFields: [
        {
          name: "employeeName",
          label: "Employee Name",
          type: "text",
          required: true,
        },
        {
          name: "employeeId",
          label: "Employee ID",
          type: "text",
          required: true,
        },
        {
          name: "designation",
          label: "Designation",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "text",
          required: true,
        },
        {
          name: "joiningDate",
          label: "Joining Date",
          type: "date",
          required: true,
        },
        {
          name: "terminationDate",
          label: "Termination Date",
          type: "date",
          required: true,
        },
        {
          name: "lastWorkingDate",
          label: "Last Working Date",
          type: "date",
          required: true,
        },
        {
          name: "terminationType",
          label: "Termination Type",
          type: "select",
          options: [
            "Voluntary",
            "Involuntary",
            "Retrenchment",
            "Resignation Accepted",
            "Termination for Cause",
          ],
          required: true,
        },
        {
          name: "terminationReason",
          label: "Termination Reason",
          type: "textarea",
          required: true,
        },
        {
          name: "noticePeriod",
          label: "Notice Period",
          type: "text",
          required: true,
        },
        {
          name: "severancePackage",
          label: "Severance Package (₹)",
          type: "number",
          required: false,
        },
        {
          name: "finalSettlement",
          label: "Final Settlement Details",
          type: "textarea",
          required: true,
        },
        {
          name: "assetsReturn",
          label: "Assets to be Returned",
          type: "textarea",
          required: true,
        },
        {
          name: "exitInterview",
          label: "Exit Interview Required",
          type: "checkbox",
          required: true,
        },
        {
          name: "nonCompete",
          label: "Non-compete Clause",
          type: "textarea",
          required: false,
        },
        {
          name: "confidentiality",
          label: "Confidentiality Agreement",
          type: "checkbox",
          required: true,
        },
      ],
      workflowSteps: [
        "Termination Initiation",
        "Manager Approval",
        "HR Review",
        "Legal Review",
        "Finance Settlement",
        "Generation",
      ],
      sla: "5 days",
      digitalSignature: true,
      verificationCode: true,
    },
  ]);

  // Letter Requests Data with workflow status
  const [letterRequests, setLetterRequests] = useState([
    {
      id: 1,
      requestId: "LTR-REQ-2024-001",
      employeeId: "EMP001",
      employeeName: "RAHUL SHARMA",
      employeeEmail: "rahul.sharma@company.com",
      // New fields added
      designation: "Senior Software Engineer",
      department: "Engineering",
      lastPromoted: "2023-06-15",
      // Existing fields
      templateType: "experience",
      templateName: "Experience Certificate",
      requestDate: "2024-03-15",
      purpose: "CANADA VISA APPLICATION",
      priority: "High",
      status: "approved",
      statusColor: "success",
      workflowStatus: "completed",
      approvedBy: ["Manager", "HR"],
      approvalDate: "2024-03-15",
      generatedDate: "2024-03-15",
      downloadDate: "2024-03-16",
      downloadCount: 1,
      digitalSignature: true,
      verificationCode: "VER-2024-001",
      auditTrail: [
        {
          action: "Employee Request Submitted",
          by: "RAHUL SHARMA",
          timestamp: "2024-03-15 10:30:00",
          step: "Request Submission",
        },
        {
          action: "Manager Approved",
          by: "PRIYA VERMA",
          timestamp: "2024-03-15 14:20:00",
          step: "Manager Approval",
        },
        {
          action: "HR Approved",
          by: "HR DEPARTMENT",
          timestamp: "2024-03-15 16:45:00",
          step: "HR Approval",
        },
        {
          action: "Letter Generated",
          by: "SYSTEM",
          timestamp: "2024-03-15 16:50:00",
          step: "Generation",
        },
        {
          action: "Digital Signature Applied",
          by: "SYSTEM",
          timestamp: "2024-03-15 16:51:00",
          step: "Digital Signature",
        },
        {
          action: "Downloaded by Employee",
          by: "RAHUL SHARMA",
          timestamp: "2024-03-16 09:15:00",
          step: "Download",
        },
      ],
    },
    {
      id: 2,
      requestId: "LTR-REQ-2024-002",
      employeeId: "EMP002",
      employeeName: "PRIYA PATEL",
      employeeEmail: "priya.patel@company.com",
      // New fields added
      designation: "Lead Developer",
      department: "Technology",
      lastPromoted: "2023-03-10",
      // Existing fields
      templateType: "salary",
      templateName: "Salary Certificate",
      requestDate: "2024-03-18",
      purpose: "HOME LOAN",
      priority: "Medium",
      status: "approved",
      statusColor: "success",
      workflowStatus: "completed",
      approvedBy: ["HR", "Finance"],
      approvalDate: "2024-03-18",
      generatedDate: "2024-03-18",
      downloadDate: "2024-03-18",
      downloadCount: 2,
      digitalSignature: true,
      verificationCode: "VER-2024-002",
      auditTrail: [
        {
          action: "Employee Request Submitted",
          by: "PRIYA PATEL",
          timestamp: "2024-03-18 11:20:00",
          step: "Request Submission",
        },
        {
          action: "Auto-Approved by System",
          by: "AI SYSTEM",
          timestamp: "2024-03-18 11:20:00",
          step: "Auto-Approval",
        },
        {
          action: "Letter Generated",
          by: "SYSTEM",
          timestamp: "2024-03-18 11:21:00",
          step: "Generation",
        },
        {
          action: "Digital Signature Applied",
          by: "SYSTEM",
          timestamp: "2024-03-18 11:21:30",
          step: "Digital Signature",
        },
        {
          action: "Downloaded by Employee",
          by: "PRIYA PATEL",
          timestamp: "2024-03-18 11:30:00",
          step: "Download",
        },
        {
          action: "Downloaded for Bank Verification",
          by: "PRIYA PATEL",
          timestamp: "2024-03-18 15:45:00",
          step: "Download",
        },
      ],
    },
    {
      id: 3,
      requestId: "LTR-REQ-2024-003",
      employeeId: "EMP003",
      employeeName: "AMIT KUMAR",
      employeeEmail: "amit.kumar@company.com",
      // New fields added
      designation: "Project Manager",
      department: "Operations",
      lastPromoted: "2023-09-22",
      // Existing fields
      templateType: "relieving",
      templateName: "Relieving Letter",
      requestDate: "2024-03-20",
      purpose: "EXIT FORMALITIES",
      priority: "High",
      status: "pending",
      statusColor: "warning",
      workflowStatus: "in_progress",
      approvedBy: [],
      approvalDate: null,
      generatedDate: null,
      downloadDate: null,
      downloadCount: 0,
      currentStep: "Department Clearance",
      auditTrail: [
        {
          action: "Employee Request Submitted",
          by: "AMIT KUMAR",
          timestamp: "2024-03-20 09:45:00",
          step: "Request Submission",
        },
        {
          action: "Department Clearance Initiated",
          by: "SYSTEM",
          timestamp: "2024-03-20 09:46:00",
          step: "Department Clearance",
        },
      ],
    },
    {
      id: 4,
      requestId: "LTR-REQ-2024-004",
      employeeId: "EMP004",
      employeeName: "SNEHA REDDY",
      employeeEmail: "sneha.reddy@company.com",
      // New fields added
      designation: "HR Manager",
      department: "Human Resources",
      lastPromoted: "2023-11-05",
      // Existing fields
      templateType: "noc",
      templateName: "No Objection Certificate (NOC)",
      requestDate: "2024-03-22",
      purpose: "PART-TIME COURSE",
      priority: "Low",
      status: "rejected",
      statusColor: "danger",
      workflowStatus: "terminated",
      approvedBy: [],
      approvalDate: null,
      generatedDate: null,
      downloadDate: null,
      downloadCount: 0,
      rejectionReason: "Course conflicts with working hours",
      auditTrail: [
        {
          action: "Employee Request Submitted",
          by: "SNEHA REDDY",
          timestamp: "2024-03-22 14:20:00",
          step: "Request Submission",
        },
        {
          action: "Manager Review Completed",
          by: "MANAGER",
          timestamp: "2024-03-22 16:30:00",
          step: "Manager Review",
        },
        {
          action: "Request Rejected - Conflict with Work Schedule",
          by: "MANAGER",
          timestamp: "2024-03-22 16:35:00",
          step: "Rejection",
        },
      ],
    },
    {
      id: 5,
      requestId: "LTR-REQ-2024-005",
      employeeId: "EMP005",
      employeeName: "RAJESH KUMAR",
      employeeEmail: "rajesh.kumar@company.com",
      // New fields added
      designation: "Senior Manager",
      department: "Business Development",
      lastPromoted: "2023-12-18",
      // Existing fields
      templateType: "promotion",
      templateName: "Promotion Letter",
      requestDate: "2024-03-25",
      purpose: "PROMOTION TO SENIOR MANAGER",
      priority: "High",
      status: "pending",
      statusColor: "warning",
      workflowStatus: "in_progress",
      approvedBy: [],
      approvalDate: null,
      generatedDate: null,
      downloadDate: null,
      downloadCount: 0,
      currentStep: "Department Head Approval",
      auditTrail: [
        {
          action: "HR Initiated Promotion Process",
          by: "HR DEPARTMENT",
          timestamp: "2024-03-25 11:00:00",
          step: "Initiation",
        },
        {
          action: "Performance Review Completed",
          by: "MANAGER",
          timestamp: "2024-03-25 14:30:00",
          step: "Performance Review",
        },
      ],
    },
    {
      id: 6,
      requestId: "LTR-REQ-2024-006",
      employeeId: "EMP006",
      employeeName: "VIKAS SINGH",
      employeeEmail: "vikas.singh@company.com",
      // New fields added
      designation: "Technical Architect",
      department: "Engineering",
      lastPromoted: "2023-08-30",
      // Existing fields
      templateType: "verification",
      templateName: "Employment Verification Letter",
      requestDate: "2024-03-24",
      purpose: "BANK LOAN VERIFICATION",
      priority: "Medium",
      status: "approved",
      statusColor: "success",
      workflowStatus: "completed",
      approvedBy: ["HR", "Manager"],
      approvalDate: "2024-03-24",
      generatedDate: "2024-03-24",
      downloadDate: "2024-03-24",
      downloadCount: 1,
      digitalSignature: true,
      verificationCode: "VER-2024-004",
      auditTrail: [
        {
          action: "Employee Request Submitted",
          by: "VIKAS SINGH",
          timestamp: "2024-03-24 09:15:00",
          step: "Request Submission",
        },
        {
          action: "Manager Verification Completed",
          by: "MANAGER",
          timestamp: "2024-03-24 11:30:00",
          step: "Manager Verification",
        },
        {
          action: "HR Approved",
          by: "HR DEPARTMENT",
          timestamp: "2024-03-24 14:45:00",
          step: "HR Approval",
        },
        {
          action: "Letter Generated",
          by: "SYSTEM",
          timestamp: "2024-03-24 14:50:00",
          step: "Generation",
        },
        {
          action: "Downloaded for Bank",
          by: "VIKAS SINGH",
          timestamp: "2024-03-24 16:20:00",
          step: "Download",
        },
      ],
    },
    {
      id: 7,
      requestId: "LTR-REQ-2024-007",
      employeeId: "EMP007",
      employeeName: "ANITA DESAI",
      employeeEmail: "anita.desai@company.com",
      // New fields added
      designation: "Finance Analyst",
      department: "Finance",
      lastPromoted: "2023-05-12",
      // Existing fields
      templateType: "increment",
      templateName: "Increment Letter",
      requestDate: "2024-03-26",
      purpose: "SALARY INCREMENT",
      priority: "Medium",
      status: "pending",
      statusColor: "warning",
      workflowStatus: "in_progress",
      approvedBy: [],
      approvalDate: null,
      generatedDate: null,
      downloadDate: null,
      downloadCount: 0,
      currentStep: "Finance Approval",
      auditTrail: [
        {
          action: "Appraisal Review Completed",
          by: "MANAGER",
          timestamp: "2024-03-26 10:00:00",
          step: "Appraisal Review",
        },
        {
          action: "Manager Recommendation Submitted",
          by: "MANAGER",
          timestamp: "2024-03-26 10:30:00",
          step: "Manager Recommendation",
        },
      ],
    },
    {
      id: 8,
      requestId: "LTR-REQ-2024-008",
      employeeId: "EMP008",
      employeeName: "SANJAY VERMA",
      employeeEmail: "sanjay.verma@company.com",
      // New fields added
      designation: "Marketing Head",
      department: "Marketing",
      lastPromoted: "2023-10-08",
      // Existing fields
      templateType: "loan",
      templateName: "Loan Sanction Letter",
      requestDate: "2024-03-27",
      purpose: "HOME LOAN SANCTION",
      priority: "High",
      status: "pending",
      statusColor: "warning",
      workflowStatus: "in_progress",
      approvedBy: [],
      approvalDate: null,
      generatedDate: null,
      downloadDate: null,
      downloadCount: 0,
      currentStep: "Credit Check",
      auditTrail: [
        {
          action: "Application Submitted",
          by: "SANJAY VERMA",
          timestamp: "2024-03-27 09:00:00",
          step: "Application Submission",
        },
      ],
    },
  ]);

  useEffect(() => {
    // Initialize workflowRequests if empty
    if (workflowRequests.length === 0 && letterRequests.length > 0) {
      const initialWorkflows = letterRequests.map((request) => {
        const template = letterTemplates.find(
          (t) => t.templateType === request.templateType
        );
        return {
          ...request,
          workflowStatus:
            request.status === "approved"
              ? "completed"
              : request.status === "rejected"
              ? "terminated"
              : "in_progress",
          currentStep: request.currentStep || "Request Submission",
          steps: template?.workflowSteps || [],
          progress: 0,
          digitalSignature: request.digitalSignature || false,
          hrArchived: false,
          auditTrail: request.auditTrail || [],
        };
      });
      setWorkflowRequests(initialWorkflows);
    }
  }, [letterRequests, letterTemplates]);
  // Generated Letters Archive
  const [letterArchive, setLetterArchive] = useState([
    {
      id: 1,
      letterId: "LTR-2024-001",
      templateName: "Experience Certificate",
      employeeName: "RAHUL SHARMA",
      employeeId: "EMP001",
      employeeEmail: "rahul.sharma@company.com",
      generationDate: "2024-03-15",
      purpose: "CANADA VISA APPLICATION",
      downloadCount: 3,
      lastAccessed: "2024-03-16",
      fileSize: "245 KB",
      status: "Active",
      digitalSignature: true,
      verificationCode: "VER-2024-001",
      format: "PDF",
      version: "1.0",
      workflowId: "WF-2024-001",
    },
    {
      id: 2,
      letterId: "LTR-2024-002",
      templateName: "Salary Certificate",
      employeeName: "PRIYA PATEL",
      employeeId: "EMP002",
      employeeEmail: "priya.patel@company.com",
      generationDate: "2024-03-18",
      purpose: "HOME LOAN",
      downloadCount: 2,
      lastAccessed: "2024-03-18",
      fileSize: "189 KB",
      status: "Active",
      digitalSignature: true,
      verificationCode: "VER-2024-002",
      format: "PDF",
      version: "1.0",
      workflowId: "WF-2024-002",
    },
    {
      id: 3,
      letterId: "LTR-2024-004",
      templateName: "Employment Verification Letter",
      employeeName: "VIKAS SINGH",
      employeeId: "EMP006",
      employeeEmail: "vikas.singh@company.com",
      generationDate: "2024-03-24",
      purpose: "BANK LOAN VERIFICATION",
      downloadCount: 1,
      lastAccessed: "2024-03-24",
      fileSize: "198 KB",
      status: "Active",
      digitalSignature: true,
      verificationCode: "VER-2024-004",
      format: "PDF",
      version: "1.0",
      workflowId: "WF-2024-006",
    },
    {
      id: 4,
      letterId: "LTR-2024-005",
      templateName: "Confirmation Letter",
      employeeName: "ROHAN MEHTA",
      employeeId: "EMP009",
      employeeEmail: "rohan.mehta@company.com",
      generationDate: "2024-03-20",
      purpose: "PROBATION COMPLETION",
      downloadCount: 1,
      lastAccessed: "2024-03-20",
      fileSize: "175 KB",
      status: "Active",
      digitalSignature: true,
      verificationCode: "VER-2024-005",
      format: "PDF",
      version: "1.0",
      workflowId: "WF-2024-009",
    },
  ]);

  // Statistics
  const statistics = {
    totalTemplates: letterTemplates.length,
    totalRequests: letterRequests.length,
    approvedRequests: letterRequests.filter((r) => r.status === "approved")
      .length,
    pendingRequests: letterRequests.filter((r) => r.status === "pending")
      .length,
    rejectedRequests: letterRequests.filter((r) => r.status === "rejected")
      .length,
    totalDownloads: letterRequests.reduce(
      (sum, req) => sum + req.downloadCount,
      0
    ),
    aiOptimized: letterTemplates.filter((t) => t.aiOptimized).length,
    autoApprove: letterTemplates.filter((t) => t.autoApprove).length,
    digitalSignatures: letterRequests.filter((r) => r.digitalSignature).length,
    avgProcessingTime: "4.2 hours",
  };

  // Handle editing a request
  const handleEditRequest = (request) => {
    setSelectedRequestForEdit(request);
    setEditingRequestData({
      purpose: request.purpose,
      priority: request.priority,
      designation: request.designation,
      department: request.department,
      employeeEmail: request.employeeEmail,
      lastPromoted: request.lastPromoted,
    });
    setShowEditRequestCard(true);
  };

  // Add this helper function near your other utility functions
  const updateAllStatesOnRejection = (request, rejectReason) => {
    const currentDate = new Date().toISOString().split("T")[0];

    // Update letterArchive if exists
    setLetterArchive((prev) =>
      prev.map((letter) =>
        letter.employeeId === request.employeeId &&
        letter.templateName === request.templateName
          ? {
              ...letter,
              status: "rejected",
              rejectionReason: rejectReason,
              rejectionDate: currentDate,
            }
          : letter
      )
    );

    // Update letterRequests if exists
    setLetterRequests((prev) =>
      prev.map((req) =>
        req.employeeId === request.employeeId &&
        req.templateName === request.templateName
          ? {
              ...req,
              status: "rejected",
              statusColor: "danger",
              workflowStatus: "terminated",
              rejectionReason: rejectReason,
              auditTrail: [
                ...req.auditTrail,
                {
                  action: "Rejected from Dashboard",
                  by: "HR Manager",
                  timestamp: new Date().toLocaleString(),
                  step: "Rejection",
                  details: `Reason: ${rejectReason}`,
                },
              ],
            }
          : req
      )
    );

    // Update workflowRequests if exists
    setWorkflowRequests((prev) =>
      prev.map((wf) =>
        wf.employeeId === request.employeeId &&
        wf.templateName === request.templateName
          ? {
              ...wf,
              status: "rejected",
              workflowStatus: "terminated",
              rejectionReason: rejectReason,
              auditTrail: [
                ...wf.auditTrail,
                {
                  action: "Rejected from Dashboard",
                  by: "HR Manager",
                  timestamp: new Date().toLocaleString(),
                  step: "Rejection",
                  details: `Reason: ${rejectReason}`,
                },
              ],
            }
          : wf
      )
    );
  };
  // Handle using a template (navigates to generator with template selected)
  const handleUseTemplate = (template) => {
    setSelectedLetter(template);
    setShowLetterModal(true);

    // Navigate to generator section if not already there
    if (activeSection !== "generator") {
      setActiveSection("generator");
    }
  };

  // Handle editing a template
  const handleEditTemplate = (template) => {
    setSelectedTemplateForEdit(template);
    setShowEditTemplateModal(true);
  };

  // Handle deleting a template
  const handleDeleteTemplate = (templateId) => {
    // Find the template
    const template = letterTemplates.find((t) => t.id === templateId);

    // Remove the template
    setLetterTemplates((prev) => prev.filter((t) => t.id !== templateId));

    // Show success notification
    setTemplateNotification({
      show: true,
      type: "success",
      title: "Template Deleted",
      message: `Template "${template?.templateName}" has been deleted successfully.`,
    });
  };

  // Handle saving edited template
  const handleSaveEditedTemplate = (updatedTemplate) => {
    setLetterTemplates((prev) =>
      prev.map((template) =>
        template.id === updatedTemplate.id ? updatedTemplate : template
      )
    );

    setShowEditTemplateModal(false);
    setSelectedTemplateForEdit(null);

    setTemplateNotification({
      show: true,
      type: "success",
      title: "Template Updated",
      message: `Template "${updatedTemplate.templateName}" has been updated successfully.`,
    });
  };

  // Download Letter Usage Report as PDF
  const downloadLetterUsageReportPDF = () => {
    try {
      const report = generateLetterUsageReport();

      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("LETTER USAGE REPORT", 105, 30, { align: "center" });

      // Report Info
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 45);
      doc.text(`Report Period: ${formatDate(report.generatedDate)}`, 14, 52);

      // Summary Statistics
      const statsY = 65;
      doc.setFontSize(12);
      doc.text("SUMMARY STATISTICS", 14, statsY);
      doc.setFontSize(10);

      const summary = [
        ["Total Templates:", report.summary.totalTemplates.toString()],
        ["Total Requests:", report.summary.totalRequests.toString()],
        ["Approved Requests:", report.summary.approvedRequests.toString()],
        ["Pending Requests:", report.summary.pendingRequests.toString()],
        ["Rejected Requests:", report.summary.rejectedRequests.toString()],
        ["Approval Rate:", `${report.summary.approvalRate}%`],
        ["Total Downloads:", report.summary.totalDownloads.toString()],
      ];

      summary.forEach(([label, value], index) => {
        doc.text(label, 14, statsY + 10 + index * 7);
        doc.text(value, 100, statsY + 10 + index * 7);
      });

      // Template Details Table
      const tableY = statsY + 10 + summary.length * 7 + 15;
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("TEMPLATE USAGE DETAILS", 14, tableY);

      const tableColumn = [
        "Template",
        "Category",
        "Requests",
        "Approved",
        "Usage",
        "Auto-Approve",
      ];
      const tableRows = report.templateDetails.map((template) => [
        template.templateName,
        template.category,
        template.totalRequests.toString(),
        template.approvedRequests.toString(),
        template.usageCount.toString(),
        template.autoApprove ? "Yes" : "No",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: tableY + 5,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 25 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 25 },
        },
      });

      // Monthly Trends (if available)
      if (report.monthlyTrends && report.monthlyTrends.length > 0) {
        const trendsY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text("MONTHLY TRENDS", 14, trendsY);
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");

        report.monthlyTrends.slice(0, 6).forEach((trend, index) => {
          const yPos = trendsY + 10 + index * 6;
          if (yPos < 280) {
            doc.text(
              `${trend.month}: ${trend.total} requests (${trend.approvalRate}% approved)`,
              14,
              yPos
            );
          }
        });
      }

      // Footer
      const finalY =
        doc.lastAutoTable.finalY + (report.monthlyTrends?.length > 0 ? 30 : 15);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Report generated by HR Letter Generation System", 14, finalY);
      doc.text(
        `Page 1 of 1 | Generated on: ${new Date().toLocaleDateString()}`,
        190,
        finalY,
        { align: "right" }
      );

      doc.save(
        `Letter_Usage_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );

      setNotification({
        show: true,
        type: "success",
        message: "Letter Usage Report downloaded as PDF",
      });
    } catch (error) {
      console.error("Error generating letter usage report PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate letter usage report PDF",
      });
    }
  };

  // Download Letter Usage Report as Excel
  const downloadLetterUsageReportExcel = () => {
    try {
      const report = generateLetterUsageReport();

      // Prepare data for Excel
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - LETTER USAGE REPORT"],
        [`Generated: ${new Date().toLocaleDateString()}`],
        [`Report Period: ${formatDate(report.generatedDate)}`],
        [],
        ["SUMMARY STATISTICS"],
        ["Total Templates:", report.summary.totalTemplates],
        ["Total Requests:", report.summary.totalRequests],
        ["Approved Requests:", report.summary.approvedRequests],
        ["Pending Requests:", report.summary.pendingRequests],
        ["Rejected Requests:", report.summary.rejectedRequests],
        ["Approval Rate:", `${report.summary.approvalRate}%`],
        ["Total Downloads:", report.summary.totalDownloads],
        [],
        ["TEMPLATE USAGE DETAILS"],
        [
          "Template Name",
          "Template ID",
          "Category",
          "Total Requests",
          "Approved",
          "Usage Count",
          "Auto-Approve",
          "AI Optimized",
        ],
      ];

      // Add template details
      report.templateDetails.forEach((template) => {
        excelData.push([
          template.templateName,
          template.templateId,
          template.category,
          template.totalRequests,
          template.approvedRequests,
          template.usageCount,
          template.autoApprove ? "Yes" : "No",
          template.aiOptimized ? "Yes" : "No",
        ]);
      });

      // Add monthly trends if available
      if (report.monthlyTrends && report.monthlyTrends.length > 0) {
        excelData.push([]);
        excelData.push(["MONTHLY TRENDS"]);
        excelData.push([
          "Month",
          "Total Requests",
          "Approved",
          "Pending",
          "Rejected",
          "Approval Rate",
        ]);

        report.monthlyTrends.forEach((trend) => {
          excelData.push([
            trend.month,
            trend.total,
            trend.approved,
            trend.pending,
            trend.rejected,
            `${trend.approvalRate}%`,
          ]);
        });
      }

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 25 }, // Template Name
        { wch: 15 }, // Template ID
        { wch: 15 }, // Category
        { wch: 15 }, // Total Requests
        { wch: 15 }, // Approved
        { wch: 15 }, // Usage Count
        { wch: 15 }, // Auto-Approve
        { wch: 15 }, // AI Optimized
        { wch: 15 }, // Month (if trends added)
        { wch: 15 }, // Total Requests (trends)
        { wch: 15 }, // Approved (trends)
        { wch: 15 }, // Pending (trends)
        { wch: 15 }, // Rejected (trends)
        { wch: 15 }, // Approval Rate (trends)
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Letter Usage Report");

      // Generate file
      XLSX.writeFile(
        workbook,
        `Letter_Usage_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      setNotification({
        show: true,
        type: "success",
        message: "Letter Usage Report downloaded as Excel",
      });
    } catch (error) {
      console.error("Error generating letter usage report Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate letter usage report Excel",
      });
    }
  };

  // Download Employee-wise Report as PDF
  const downloadEmployeeWiseReportPDF = () => {
    try {
      const report = generateEmployeeWiseReport();

      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("EMPLOYEE-WISE REPORT", 105, 30, { align: "center" });

      // Report Info
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 45);
      doc.text(`Total Employees: ${report.summary.totalEmployees}`, 14, 52);
      doc.text(`Total Requests: ${report.summary.totalRequests}`, 14, 59);
      doc.text(
        `Avg Requests per Employee: ${report.summary.averageRequestsPerEmployee}`,
        14,
        66
      );

      // Department Analysis Table
      const deptY = 80;
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("DEPARTMENT-WISE ANALYSIS", 14, deptY);

      if (report.departmentAnalysis && report.departmentAnalysis.length > 0) {
        const deptColumns = [
          "Department",
          "Total Requests",
          "Employees",
          "Templates Used",
        ];
        const deptRows = report.departmentAnalysis.map((dept) => [
          dept.department,
          dept.totalRequests.toString(),
          dept.employeeCount.toString(),
          dept.templateCount.toString(),
        ]);

        autoTable(doc, {
          head: [deptColumns],
          body: deptRows,
          startY: deptY + 5,
          theme: "striped",
          headStyles: {
            fillColor: [60, 179, 113], // Green for department analysis
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { cellWidth: 30 },
          },
        });
      }

      // Employee Details Table
      const empY = doc.lastAutoTable
        ? doc.lastAutoTable.finalY + 15
        : deptY + 50;
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("EMPLOYEE DETAILS", 14, empY);

      const empColumns = [
        "Employee",
        "ID",
        "Department",
        "Requests",
        "Approved",
        "Pending",
        "Rejected",
        "Approval Rate",
      ];
      const empRows = report.employees
        .slice(0, 15)
        .map((emp) => [
          emp.employeeName,
          emp.employeeId,
          emp.department,
          emp.totalRequests.toString(),
          emp.approved.toString(),
          emp.pending.toString(),
          emp.rejected.toString(),
          `${emp.approvalRate}%`,
        ]);

      autoTable(doc, {
        head: [empColumns],
        body: empRows,
        startY: empY + 5,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 7, // Smaller font to fit more columns
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Employee Name
          1: { cellWidth: 15 }, // ID
          2: { cellWidth: 20 }, // Department
          3: { cellWidth: 15 }, // Requests
          4: { cellWidth: 15 }, // Approved
          5: { cellWidth: 15 }, // Pending
          6: { cellWidth: 15 }, // Rejected
          7: { cellWidth: 20 }, // Approval Rate
        },
      });

      // Footer with note if more employees exist
      const finalY = doc.lastAutoTable.finalY + 10;
      if (report.employees.length > 15) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `... and ${report.employees.length - 15} more employees`,
          14,
          finalY
        );
      }

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Report generated by HR Letter Generation System",
        14,
        finalY + 10
      );
      doc.text(
        `Page 1 of 1 | Total Employees: ${report.employees.length}`,
        190,
        finalY + 10,
        { align: "right" }
      );

      doc.save(
        `Employee_Wise_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );

      setNotification({
        show: true,
        type: "success",
        message: "Employee-wise Report downloaded as PDF",
      });
    } catch (error) {
      console.error("Error generating employee-wise report PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate employee-wise report PDF",
      });
    }
  };

  // Download Employee-wise Report as Excel
  const downloadEmployeeWiseReportExcel = () => {
    try {
      const report = generateEmployeeWiseReport();

      // Prepare data for Excel
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - EMPLOYEE-WISE REPORT"],
        [`Generated: ${new Date().toLocaleDateString()}`],
        [`Total Employees: ${report.summary.totalEmployees}`],
        [`Total Requests: ${report.summary.totalRequests}`],
        [
          `Average Requests per Employee: ${report.summary.averageRequestsPerEmployee}`,
        ],
        [],
        ["SUMMARY"],
        ["Total Employees:", report.summary.totalEmployees],
        ["Total Requests:", report.summary.totalRequests],
        [
          "Average Requests per Employee:",
          report.summary.averageRequestsPerEmployee,
        ],
        [],
        ["DEPARTMENT ANALYSIS"],
        [
          "Department",
          "Total Requests",
          "Unique Employees",
          "Unique Templates",
          "Requests per Employee",
        ],
      ];

      // Add department analysis
      report.departmentAnalysis.forEach((dept) => {
        const requestsPerEmployee = (
          dept.totalRequests / dept.employeeCount
        ).toFixed(2);
        excelData.push([
          dept.department,
          dept.totalRequests,
          dept.employeeCount,
          dept.templateCount,
          requestsPerEmployee,
        ]);
      });

      // Add employee details
      excelData.push([]);
      excelData.push(["EMPLOYEE DETAILS"]);
      excelData.push([
        "Employee Name",
        "Employee ID",
        "Designation",
        "Department",
        "Total Requests",
        "Approved",
        "Pending",
        "Rejected",
        "Approval Rate",
        "Last Request",
        "Templates Used",
      ]);

      report.employees.forEach((emp) => {
        excelData.push([
          emp.employeeName,
          emp.employeeId,
          emp.designation || "N/A",
          emp.department,
          emp.totalRequests,
          emp.approved,
          emp.pending,
          emp.rejected,
          `${emp.approvalRate}%`,
          formatDate(emp.lastRequestDate),
          emp.templatesUsed.join(", "),
        ]);
      });

      // Add top performers
      excelData.push([]);
      excelData.push(["TOP PERFORMERS"]);
      excelData.push(["Category", "Employee Name", "Employee ID", "Value"]);

      // Top by requests
      const topByRequests = [...report.employees]
        .sort((a, b) => b.totalRequests - a.totalRequests)
        .slice(0, 3);

      topByRequests.forEach((emp, index) => {
        excelData.push([
          index === 0 ? "Most Requests" : "",
          emp.employeeName,
          emp.employeeId,
          `${emp.totalRequests} requests`,
        ]);
      });

      // Top by approval rate
      const topByApproval = [...report.employees]
        .filter((emp) => emp.totalRequests >= 3)
        .sort((a, b) => b.approvalRate - a.approvalRate)
        .slice(0, 3);

      topByApproval.forEach((emp, index) => {
        excelData.push([
          index === 0 ? "Highest Approval Rate" : "",
          emp.employeeName,
          emp.employeeId,
          `${emp.approvalRate}%`,
        ]);
      });

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 25 }, // Employee Name / Department
        { wch: 15 }, // Employee ID / Total Requests
        { wch: 20 }, // Designation / Unique Employees
        { wch: 15 }, // Department / Unique Templates
        { wch: 15 }, // Total Requests / Requests per Employee
        { wch: 15 }, // Approved
        { wch: 15 }, // Pending
        { wch: 15 }, // Rejected
        { wch: 15 }, // Approval Rate
        { wch: 15 }, // Last Request
        { wch: 30 }, // Templates Used
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Report");

      // Generate file
      XLSX.writeFile(
        workbook,
        `Employee_Wise_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      setNotification({
        show: true,
        type: "success",
        message: "Employee-wise Report downloaded as Excel",
      });
    } catch (error) {
      console.error("Error generating employee-wise report Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate employee-wise report Excel",
      });
    }
  };

  // Add these functions to your LetterGeneration component

  // Download Employee Letter as PDF
  const downloadEmployeeLetterPDF = (letter) => {
    try {
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Employee Letter - ${letter.letterId}`,
        subject: letter.templateName,
        author: "HR Letter Generation System",
        keywords: "Employee, Letter, Certificate",
        creator: "Employee Portal",
      });

      // Title - Employee Portal Version
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("EMPLOYEE PORTAL - LETTER DOWNLOAD", 105, 20, {
        align: "center",
      });

      // Letter Information
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(letter.templateName, 105, 30, { align: "center" });

      // Employee Details Section
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("EMPLOYEE INFORMATION", 14, 50);

      doc.setFont(undefined, "normal");
      doc.setFontSize(11);

      const employeeDetails = [
        ["Employee Name:", letter.employeeName || "N/A"],
        ["Employee ID:", letter.employeeId || "N/A"],
        ["Email:", letter.employeeEmail || letter.email || "N/A"],
        ["Purpose:", letter.purpose || "General Purpose"],
        [
          "Generated Date:",
          formatDate(letter.generationDate || letter.generatedDate),
        ],
        ["Download Count:", (letter.downloadCount || 0).toString()],
        [
          "Last Accessed:",
          letter.lastAccessed ? formatDate(letter.lastAccessed) : "Never",
        ],
        ["Status:", letter.status || "Active"],
      ];

      employeeDetails.forEach(([label, value], index) => {
        doc.text(label, 14, 60 + index * 8);
        doc.text(value, 70, 60 + index * 8);
      });

      // Verification Details
      const verificationY = 60 + employeeDetails.length * 8 + 10;
      doc.setFont(undefined, "bold");
      doc.text("VERIFICATION DETAILS", 14, verificationY);

      doc.setFont(undefined, "normal");
      doc.text(
        `Verification Code: ${letter.verificationCode || "N/A"}`,
        14,
        verificationY + 8
      );
      doc.text(
        `Digital Signature: ${
          letter.digitalSignature ? "VERIFIED" : "NOT APPLIED"
        }`,
        14,
        verificationY + 16
      );

      if (letter.digitalSignature) {
        doc.text(
          `Signature Date: ${formatDate(
            letter.generationDate || letter.generatedDate
          )}`,
          14,
          verificationY + 24
        );
      }

      // Footer with download info
      const footerY = 250;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);

      doc.text("Downloaded from Employee Portal", 14, footerY);
      doc.text(
        `Download Date: ${new Date().toLocaleDateString()}`,
        14,
        footerY + 5
      );
      doc.text(
        `Download Time: ${new Date().toLocaleTimeString()}`,
        14,
        footerY + 10
      );
      doc.text("For official use only", 190, footerY + 10, { align: "right" });

      // Add border for professional look
      doc.setDrawColor(200, 200, 200);
      doc.rect(
        5,
        5,
        doc.internal.pageSize.width - 10,
        doc.internal.pageSize.height - 10
      );

      // Save the PDF
      const fileName = `Employee_Letter_${letter.letterId}_${
        letter.employeeName?.replace(/\s+/g, "_") || "Letter"
      }.pdf`;
      doc.save(fileName);

      // Update download count
      const updatedArchive = letterArchive.map((l) =>
        l.id === letter.id
          ? {
              ...l,
              downloadCount: (l.downloadCount || 0) + 1,
              lastAccessed: new Date().toISOString().split("T")[0],
            }
          : l
      );
      setLetterArchive(updatedArchive);

      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: `Letter ${letter.letterId} downloaded as PDF successfully!`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate PDF. Please try again.",
      });
    }
  };

  // Download Employee Data as PDF
  const downloadEmployeeDataPDF = (employee) => {
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("EMPLOYEE PORTAL - DATA EXPORT", 105, 20, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(employee.name, 105, 30, { align: "center" });

      // Employee Information
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("EMPLOYEE PROFILE", 14, 45);

      doc.setFont(undefined, "normal");
      doc.setFontSize(11);

      const profileDetails = [
        ["Employee ID:", employee.id],
        ["Name:", employee.name],
        ["Designation:", employee.designation || "N/A"],
        ["Department:", employee.department || "N/A"],
        ["Email:", employee.email || employee.employeeEmail || "N/A"],
        [
          "Last Promoted:",
          employee.lastPromoted ? formatDate(employee.lastPromoted) : "N/A",
        ],
        ["Export Date:", new Date().toLocaleDateString()],
        ["Export Time:", new Date().toLocaleTimeString()],
      ];

      profileDetails.forEach(([label, value], index) => {
        doc.text(label, 14, 55 + index * 8);
        doc.text(value, 60, 55 + index * 8);
      });

      // Statistics
      const employeeRequests = letterRequests.filter(
        (r) => r.employeeId === employee.id
      );
      const employeeDownloads = letterArchive.filter(
        (l) => l.employeeId === employee.id
      );
      const employeeWorkflows = workflowRequests.filter(
        (w) => w.employeeId === employee.id
      );

      const statsY = 55 + profileDetails.length * 8 + 15;
      doc.setFont(undefined, "bold");
      doc.text("EMPLOYEE STATISTICS", 14, statsY);

      doc.setFont(undefined, "normal");

      const statistics = [
        ["Total Requests:", employeeRequests.length.toString()],
        [
          "Approved Requests:",
          employeeRequests
            .filter((r) => r.status === "approved")
            .length.toString(),
        ],
        [
          "Pending Requests:",
          employeeRequests
            .filter((r) => r.status === "pending")
            .length.toString(),
        ],
        [
          "Total Downloads:",
          employeeDownloads
            .reduce((sum, l) => sum + (l.downloadCount || 0), 0)
            .toString(),
        ],
        [
          "Active Workflows:",
          employeeWorkflows
            .filter((w) => w.workflowStatus === "in_progress")
            .length.toString(),
        ],
        [
          "Completed Workflows:",
          employeeWorkflows
            .filter((w) => w.workflowStatus === "completed")
            .length.toString(),
        ],
      ];

      statistics.forEach(([label, value], index) => {
        doc.text(label, 14, statsY + 10 + index * 8);
        doc.text(value, 80, statsY + 10 + index * 8);
      });

      // Recent Letters (if any)
      if (employeeDownloads.length > 0) {
        const lettersY = statsY + 10 + statistics.length * 8 + 15;
        doc.setFont(undefined, "bold");
        doc.text("RECENT LETTERS", 14, lettersY);

        doc.setFont(undefined, "normal");
        doc.setFontSize(10);

        employeeDownloads.slice(0, 5).forEach((letter, index) => {
          const yPos = lettersY + 10 + index * 6;
          if (yPos < 280) {
            doc.text(
              `• ${letter.templateName} (${letter.letterId}) - ${formatDate(
                letter.generationDate
              )}`,
              14,
              yPos
            );
          }
        });

        if (employeeDownloads.length > 5) {
          doc.text(
            `... and ${employeeDownloads.length - 5} more letters`,
            14,
            lettersY + 10 + 5 * 6
          );
        }
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Generated by Employee Portal - HR Letter Generation System",
        14,
        285
      );
      doc.text(`Page 1 of 1 | Employee ID: ${employee.id}`, 190, 285, {
        align: "right",
      });

      // Save PDF
      doc.save(
        `Employee_Data_${employee.id}_${employee.name.replace(/\s+/g, "_")}.pdf`
      );

      setNotification({
        show: true,
        type: "success",
        message: `Employee data exported as PDF for ${employee.name}`,
      });
    } catch (error) {
      console.error("Error generating employee PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate employee data PDF",
      });
    }
  };

  // Export Employee Data as JSON (existing function, updated)
  const exportEmployeeDataJSON = (employee) => {
    // Get all employee data with proper filtering
    const employeeLetterRequests = letterRequests.filter(
      (r) => r.employeeId === employee.id
    );

    const employeeArchiveLetters = letterArchive.filter(
      (l) => l.employeeId === employee.id
    );

    const employeeWorkflows = workflowRequests.filter(
      (w) => w.employeeId === employee.id
    );

    // Prepare comprehensive employee data
    const employeeData = {
      exportInfo: {
        exportedAt: new Date().toISOString(),
        exportType: "Employee Data Export",
        version: "1.0",
        format: "JSON",
      },
      profile: employee,
      statistics: {
        totalRequests: employeeLetterRequests.length,
        approvedRequests: employeeLetterRequests.filter(
          (r) => r.status === "approved"
        ).length,
        pendingRequests: employeeLetterRequests.filter(
          (r) => r.status === "pending"
        ).length,
        totalDownloads: employeeArchiveLetters.reduce(
          (sum, l) => sum + (l.downloadCount || 0),
          0
        ),
        activeWorkflows: employeeWorkflows.filter(
          (w) => w.workflowStatus === "in_progress"
        ).length,
        completedWorkflows: employeeWorkflows.filter(
          (w) => w.workflowStatus === "completed"
        ).length,
      },
      requests: employeeLetterRequests,
      downloadableLetters: employeeArchiveLetters,
      workflows: employeeWorkflows,
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(employeeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const dataUrl = URL.createObjectURL(dataBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = `${employee.id}_${employee.name.replace(
      /\s+/g,
      "_"
    )}_data.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(dataUrl);

    setNotification({
      show: true,
      type: "success",
      message: `Employee data exported as JSON for ${employee.name}`,
    });
  };
  // Generate Letter Usage Report
  const generateLetterUsageReport = () => {
    const report = {
      title: "Letter Usage Report",
      generatedDate: new Date().toISOString(),
      summary: {
        totalTemplates: letterTemplates.length,
        totalRequests: statistics.totalRequests,
        approvedRequests: statistics.approvedRequests,
        pendingRequests: statistics.pendingRequests,
        rejectedRequests: statistics.rejectedRequests,
        approvalRate:
          statistics.totalRequests > 0
            ? Math.round(
                (statistics.approvedRequests / statistics.totalRequests) * 100
              )
            : 0,
        totalDownloads: statistics.totalDownloads,
      },
      templateDetails: letterTemplates.map((template) => {
        const templateRequests = letterRequests.filter(
          (r) => r.templateType === template.templateType
        );
        return {
          templateName: template.templateName,
          templateId: template.templateId,
          category: template.category,
          totalRequests: templateRequests.length,
          approvedRequests: templateRequests.filter(
            (r) => r.status === "approved"
          ).length,
          usageCount: template.usageCount,
          autoApprove: template.autoApprove,
          aiOptimized: template.aiOptimized,
        };
      }),
      monthlyTrends: getMonthlyTrends(),
    };

    return report;
  };

  // Generate Employee-wise Report
  const generateEmployeeWiseReport = () => {
    const employeeGroups = {};

    letterRequests.forEach((request) => {
      if (!employeeGroups[request.employeeId]) {
        employeeGroups[request.employeeId] = {
          employeeId: request.employeeId,
          employeeName: request.employeeName,
          designation: request.designation,
          department: request.department,
          totalRequests: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          templatesUsed: new Set(),
          lastRequestDate: request.requestDate,
        };
      }

      const employee = employeeGroups[request.employeeId];
      employee.totalRequests++;
      employee.templatesUsed.add(request.templateName);

      if (request.status === "approved") employee.approved++;
      if (request.status === "pending") employee.pending++;
      if (request.status === "rejected") employee.rejected++;

      if (new Date(request.requestDate) > new Date(employee.lastRequestDate)) {
        employee.lastRequestDate = request.requestDate;
      }
    });

    const report = {
      title: "Employee-wise Report",
      generatedDate: new Date().toISOString(),
      summary: {
        totalEmployees: Object.keys(employeeGroups).length,
        totalRequests: statistics.totalRequests,
        averageRequestsPerEmployee:
          Math.round(
            statistics.totalRequests / Object.keys(employeeGroups).length
          ) || 0,
      },
      employees: Object.values(employeeGroups).map((emp) => ({
        ...emp,
        templatesUsed: Array.from(emp.templatesUsed),
        approvalRate:
          emp.totalRequests > 0
            ? Math.round((emp.approved / emp.totalRequests) * 100)
            : 0,
      })),
      departmentAnalysis: getDepartmentAnalysis(),
    };

    return report;
  };

  // Download Audit Trail as PDF
  const downloadAuditTrailPDF = (auditTrail, request) => {
    try {
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Audit Trail - ${request.requestId}`,
        subject: "HR Letter Audit Trail",
        author: "HR Letter Generation System",
        keywords: "HR, Audit, Trail, Activity",
        creator: "HR System",
      });

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("AUDIT TRAIL REPORT", 105, 30, { align: "center" });

      // Request Info
      doc.setFontSize(10);
      doc.text(`Request ID: ${request.requestId}`, 14, 45);
      doc.text(
        `Employee: ${request.employeeName} (${request.employeeId})`,
        14,
        52
      );
      doc.text(`Total Entries: ${auditTrail.length}`, 14, 59);

      // Table headers
      const tableY = 70;
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("AUDIT TRAIL ENTRIES", 14, tableY);

      // Create table
      const tableColumn = ["Timestamp", "Action", "By", "Step", "Details"];
      const tableRows = auditTrail.map((log) => [
        formatDateTime(log.timestamp),
        log.action,
        log.by,
        log.step,
        log.details || "",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: tableY + 5,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 30 }, // Timestamp
          1: { cellWidth: 50 }, // Action
          2: { cellWidth: 25 }, // By
          3: { cellWidth: 35 }, // Step
          4: { cellWidth: 50 }, // Details
        },
      });

      // Summary
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text("SUMMARY", 14, finalY);
      doc.setFontSize(9);

      const approvals = auditTrail.filter((log) =>
        log.action.includes("Approved")
      ).length;
      const rejections = auditTrail.filter((log) =>
        log.action.includes("Rejected")
      ).length;
      const generations = auditTrail.filter((log) =>
        log.action.includes("Generated")
      ).length;

      doc.text(`• Approvals: ${approvals}`, 14, finalY + 7);
      doc.text(`• Rejections: ${rejections}`, 14, finalY + 14);
      doc.text(`• Generations: ${generations}`, 14, finalY + 21);
      doc.text(`• Total Actions: ${auditTrail.length}`, 14, finalY + 28);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Audit Trail Report - For Compliance & Tracking", 14, 280);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 190, 280, {
        align: "right",
      });

      // Save PDF
      doc.save(
        `Audit_Trail_${request.requestId}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      setNotification({
        show: true,
        type: "success",
        message: `Audit trail exported as PDF: ${request.requestId}`,
      });
    } catch (error) {
      console.error("Error generating audit trail PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate audit trail PDF. Please try again.",
      });
    }
  };
  // Add these filter functions
  const handleFilterChange = (filterName, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const removeFilter = (filterName) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: "",
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      status: "",
      priority: "",
      templateType: "",
      department: "",
      employeeId: "",
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");

    setNotification({
      show: true,
      type: "info",
      message: "All filters cleared",
    });
  };

  const applyFilters = () => {
    setShowAdvancedFilters(false);

    const activeFilterCount = Object.values(activeFilters).filter(
      (v) => v
    ).length;
    setNotification({
      show: true,
      type: "success",
      message: `Applied ${activeFilterCount} filter(s)`,
    });
  };

  const saveFilterPreset = () => {
    const presetName = prompt("Enter a name for this filter preset:");
    if (presetName) {
      const presets = JSON.parse(localStorage.getItem("filterPresets") || "[]");
      presets.push({
        name: presetName,
        filters: activeFilters,
        date: new Date().toISOString(),
      });
      localStorage.setItem("filterPresets", JSON.stringify(presets));

      setNotification({
        show: true,
        type: "success",
        message: `Filter preset "${presetName}" saved`,
      });
    }
  };

  const hasActiveFilters = () => {
    return Object.values(activeFilters).some((v) => v);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setNotification({
        show: true,
        type: "info",
        message: `Searching for "${searchTerm}"`,
      });
    }
  };

  const handleRefresh = () => {
    setNotification({
      show: true,
      type: "info",
      message: "Refreshing data...",
    });

    // In a real app, you would fetch fresh data from the server
    setTimeout(() => {
      setNotification({
        show: true,
        type: "success",
        message: "Data refreshed successfully",
      });
    }, 1000);
  };

  const handlePrint = () => {
    // Save current scroll position
    const scrollPosition = window.pageYOffset;

    // Print current section
    const printContent = document.querySelector(".container-fluid");
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent.innerHTML;
    window.print();

    // Restore original content and scroll position
    document.body.innerHTML = originalContent;
    window.scrollTo(0, scrollPosition);

    setNotification({
      show: true,
      type: "success",
      message: "Print preview opened",
    });
  };

  // Helper function for monthly trends
  const getMonthlyTrends = () => {
    const months = {};
    letterRequests.forEach((request) => {
      const month = request.requestDate.substring(0, 7); // YYYY-MM
      if (!months[month]) {
        months[month] = { total: 0, approved: 0, pending: 0, rejected: 0 };
      }
      months[month].total++;
      if (request.status === "approved") months[month].approved++;
      if (request.status === "pending") months[month].pending++;
      if (request.status === "rejected") months[month].rejected++;
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
      approvalRate:
        data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0,
    }));
  };

  // Helper function for department analysis
  const getDepartmentAnalysis = () => {
    const deptAnalysis = {};
    letterRequests.forEach((request) => {
      const dept = request.department || "Unknown";
      if (!deptAnalysis[dept]) {
        deptAnalysis[dept] = {
          total: 0,
          employees: new Set(),
          templates: new Set(),
        };
      }
      deptAnalysis[dept].total++;
      deptAnalysis[dept].employees.add(request.employeeId);
      deptAnalysis[dept].templates.add(request.templateName);
    });

    return Object.entries(deptAnalysis).map(([dept, data]) => ({
      department: dept,
      totalRequests: data.total,
      employeeCount: data.employees.size,
      templateCount: data.templates.size,
    }));
  };

  // Utility Functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    return new Date(dateTimeString.replace(" ", "T")).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="badge bg-success">Approved</span>;
      case "pending":
        return <span className="badge bg-warning">Pending</span>;
      case "rejected":
        return <span className="badge bg-danger">Rejected</span>;
      case "Active":
        return <span className="badge bg-success">Active</span>;
      case "Inactive":
        return <span className="badge bg-secondary">Inactive</span>;
      case "completed":
        return <span className="badge bg-success">Completed</span>;
      case "in_progress":
        return <span className="badge bg-warning">In Progress</span>;
      case "terminated":
        return <span className="badge bg-danger">Terminated</span>;
      default:
        return <span className="badge bg-info">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return <span className="badge bg-danger">High</span>;
      case "Medium":
        return <span className="badge bg-warning">Medium</span>;
      case "Low":
        return <span className="badge bg-info">Low</span>;
      default:
        return <span className="badge bg-secondary">{priority}</span>;
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      FileCheck: FileCheck,
      CheckCircle: CheckCircle,
      DollarSign: DollarSign,
      Shield: Shield,
      TrendingUp: TrendingUp,
      UserCheck: UserCheck,
      MapPin: MapPin,
      CreditCard: CreditCard,
      AlertTriangle: AlertTriangle,
      XCircle: XCircle,
      FileText: FileText,
    };

    const Icon = iconMap[iconName] || FileText;
    return <Icon size={20} />;
  };

  // Add these download functions to your component
  const downloadLetterPDF = (letter) => {
    try {
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Letter - ${letter.letterId}`,
        subject: letter.templateName,
        author: "HR Letter Generation System",
        keywords: "HR, Letter, Certificate",
        creator: "HR System",
      });

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185); // Blue color
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      // Subtitle
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(letter.templateName, 105, 30, { align: "center" });

      // Header Information
      doc.setFontSize(10);
      doc.text(`Letter ID: ${letter.letterId}`, 14, 50);
      doc.text(`Generated: ${formatDate(letter.generatedDate)}`, 14, 56);
      doc.text(
        `Verification Code: ${letter.verificationCode || "N/A"}`,
        14,
        62
      );

      // Horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 68, 196, 68);

      // Employee Details Section
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("EMPLOYEE INFORMATION", 14, 78);

      doc.setFont(undefined, "normal");
      doc.setFontSize(11);

      const details = [
        ["Employee Name:", letter.employeeName],
        ["Employee ID:", letter.employeeId],
        ["Designation:", letter.designation],
        ["Department:", letter.department],
        ["Status:", letter.status],
        ["Purpose:", letter.purpose || "General Purpose"],
      ];

      details.forEach(([label, value], index) => {
        doc.text(label, 14, 88 + index * 8);
        doc.text(value || "N/A", 70, 88 + index * 8);
      });

      // Digital Signature Section
      doc.setFont(undefined, "bold");
      doc.text("DIGITAL SIGNATURE", 14, 138);

      doc.setFont(undefined, "normal");
      doc.text(
        `Status: ${letter.digitalSignature ? "VERIFIED" : "NOT APPLIED"}`,
        14,
        146
      );
      if (letter.digitalSignature) {
        doc.text(`Verified On: ${formatDate(letter.generatedDate)}`, 14, 152);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "This is an official document generated by HR Letter Generation System",
        14,
        180
      );
      doc.text(
        "For verification, contact HR Department | Generated on: " +
          new Date().toLocaleDateString(),
        14,
        185
      );
      doc.text("Page 1 of 1", 190, 185, { align: "right" });

      // Add company logo/text
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Official Company Document", 105, 195, { align: "center" });

      // Save the PDF
      doc.save(
        `${letter.letterId}_${letter.employeeName.replace(/\s+/g, "_")}.pdf`
      );

      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: `PDF downloaded successfully: ${letter.letterId}`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate PDF. Please try again.",
      });
    }
  };

  const downloadLetterExcel = (letter) => {
    try {
      // Prepare the data
      const excelData = [
        ["HR LETTER GENERATION SYSTEM"],
        [letter.templateName],
        [],
        ["LETTER DETAILS"],
        ["Letter ID:", letter.letterId],
        ["Generated Date:", formatDate(letter.generatedDate)],
        ["Verification Code:", letter.verificationCode || "N/A"],
        ["Status:", letter.status],
        ["Digital Signature:", letter.digitalSignature ? "Yes" : "No"],
        [],
        ["EMPLOYEE INFORMATION"],
        ["Employee Name:", letter.employeeName],
        ["Employee ID:", letter.employeeId],
        ["Designation:", letter.designation],
        ["Department:", letter.department],
        ["Purpose:", letter.purpose || "General Purpose"],
        [],
        ["SYSTEM INFORMATION"],
        ["Generated By:", "HR Letter Generation System"],
        ["Export Date:", new Date().toLocaleDateString()],
      ];

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Style the worksheet
      worksheet["!cols"] = [
        { wch: 20 }, // First column width
        { wch: 30 }, // Second column width
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Letter Details");

      // Generate file and trigger download
      XLSX.writeFile(
        workbook,
        `${letter.letterId}_${letter.employeeName.replace(/\s+/g, "_")}.xlsx`
      );

      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: `Excel file downloaded successfully: ${letter.letterId}`,
      });
    } catch (error) {
      console.error("Error generating Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate Excel file. Please try again.",
      });
    }
  };

  const exportAllLettersExcel = () => {
    if (generatedLetters.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No letters available to export",
      });
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - ALL LETTERS REPORT"],
        [
          `Generated: ${new Date().toLocaleDateString()}, Total Letters: ${
            generatedLetters.length
          }`,
        ],
        [],
        [
          "LETTER ID",
          "EMPLOYEE NAME",
          "EMPLOYEE ID",
          "TEMPLATE",
          "DESIGNATION",
          "DEPARTMENT",
          "GENERATED DATE",
          "STATUS",
          "DIGITAL SIGNATURE",
          "VERIFICATION CODE",
        ],
      ];

      // Add all letters
      generatedLetters.forEach((letter) => {
        excelData.push([
          letter.letterId,
          letter.employeeName,
          letter.employeeId,
          letter.templateName,
          letter.designation,
          letter.department,
          formatDate(letter.generatedDate),
          letter.status,
          letter.digitalSignature ? "Yes" : "No",
          letter.verificationCode || "N/A",
        ]);
      });

      // Add summary
      excelData.push([]);
      excelData.push(["SUMMARY"]);
      excelData.push(["Total Letters:", generatedLetters.length]);
      excelData.push([
        "Approved:",
        generatedLetters.filter((l) => l.status === "approved").length,
      ]);
      excelData.push([
        "Pending:",
        generatedLetters.filter((l) => l.status === "pending").length,
      ]);
      excelData.push([
        "Rejected:",
        generatedLetters.filter((l) => l.status === "rejected").length,
      ]);

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 15 }, // Letter ID
        { wch: 25 }, // Employee Name
        { wch: 12 }, // Employee ID
        { wch: 25 }, // Template
        { wch: 20 }, // Designation
        { wch: 15 }, // Department
        { wch: 15 }, // Generated Date
        { wch: 10 }, // Status
        { wch: 15 }, // Digital Signature
        { wch: 20 }, // Verification Code
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Letters");

      // Generate file
      XLSX.writeFile(
        workbook,
        `All_Letters_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      setNotification({
        show: true,
        type: "success",
        message: `All ${generatedLetters.length} letters exported to Excel successfully`,
      });
    } catch (error) {
      console.error("Error exporting all letters to Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export letters to Excel",
      });
    }
  };

  const exportAllLettersPDF = () => {
    if (generatedLetters.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No letters available to export",
      });
      return;
    }

    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("COMPLETE LETTERS REPORT", 105, 30, { align: "center" });

      // Report Info
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 45);
      doc.text(`Total Letters: ${generatedLetters.length}`, 14, 52);

      // Statistics
      const statsY = 65;
      doc.setFontSize(12);
      doc.text("Summary Statistics:", 14, statsY);
      doc.setFontSize(10);
      doc.text(
        `• Approved: ${
          generatedLetters.filter((l) => l.status === "approved").length
        }`,
        14,
        statsY + 7
      );
      doc.text(
        `• Pending: ${
          generatedLetters.filter((l) => l.status === "pending").length
        }`,
        14,
        statsY + 14
      );
      doc.text(
        `• Rejected: ${
          generatedLetters.filter((l) => l.status === "rejected").length
        }`,
        14,
        statsY + 21
      );

      // Table
      const tableColumn = [
        "Letter ID",
        "Employee",
        "Template",
        "Department",
        "Date",
        "Status",
      ];

      const tableRows = generatedLetters.map((letter) => [
        letter.letterId,
        letter.employeeName,
        letter.templateName,
        letter.department,
        formatDate(letter.generatedDate),
        letter.status,
      ]);

      // Use autoTable to create the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        margin: { top: 90 },
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text("Report generated by HR Letter Generation System", 14, finalY);
      doc.text(
        `Page 1 of 1 | Total Records: ${generatedLetters.length}`,
        190,
        finalY,
        { align: "right" }
      );

      doc.save(
        `All_Letters_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );

      setNotification({
        show: true,
        type: "success",
        message: `All ${generatedLetters.length} letters exported to PDF successfully`,
      });
    } catch (error) {
      console.error("Error exporting all letters to PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export letters to PDF",
      });
    }
  };

  // Download Single Request as PDF
  // Download Single Request as PDF
  const downloadRequestPDF = (request) => {
    try {
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Request - ${request.requestId}`,
        subject: request.templateName,
        author: "HR Letter Generation System",
        keywords: "HR, Request, Letter",
        creator: "HR System",
      });

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      // Subtitle
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("REQUEST DETAILS", 105, 30, { align: "center" });

      // Request Information
      doc.setFontSize(10);
      doc.text(`Request ID: ${request.requestId}`, 14, 50);
      doc.text(`Request Date: ${formatDate(request.requestDate)}`, 14, 56);
      doc.text(`Status: ${request.status.toUpperCase()}`, 14, 62);

      // Horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 68, 196, 68);

      // Employee Details
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("EMPLOYEE INFORMATION", 14, 78);

      doc.setFont(undefined, "normal");
      doc.setFontSize(11);

      const details = [
        ["Employee Name:", request.employeeName],
        ["Employee ID:", request.employeeId],
        ["Designation:", request.designation || "Senior Developer"],
        ["Department:", request.department || "Engineering"],
        ["Employee Email:", request.employeeEmail || "N/A"],
        [
          "Last Promoted:",
          request.lastPromoted ? formatDate(request.lastPromoted) : "N/A",
        ],
      ];

      details.forEach(([label, value], index) => {
        doc.text(label, 14, 88 + index * 8);
        doc.text(value || "N/A", 70, 88 + index * 8);
      });

      // Request Details
      const requestY = 138;
      doc.setFont(undefined, "bold");
      doc.text("REQUEST DETAILS", 14, requestY);

      doc.setFont(undefined, "normal");
      doc.setFontSize(11);

      const requestDetails = [
        ["Letter Type:", request.templateName],
        ["Purpose:", request.purpose],
        ["Priority:", request.priority],
        [
          "Template Category:",
          letterTemplates.find((t) => t.templateType === request.templateType)
            ?.category || "N/A",
        ],
        ["Required Approvals:", request.approvedBy?.join(", ") || "Pending"],
        [
          "SLA:",
          letterTemplates.find((t) => t.templateType === request.templateType)
            ?.sla || "24 hours",
        ],
      ];

      requestDetails.forEach(([label, value], index) => {
        doc.text(label, 14, requestY + 10 + index * 8);
        doc.text(value || "N/A", 70, requestY + 10 + index * 8);
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "This is an official document generated by HR Letter Generation System",
        14,
        280
      );
      doc.text(
        "For verification, contact HR Department | Generated on: " +
          new Date().toLocaleDateString(),
        14,
        285
      );
      doc.text("Page 1 of 1", 190, 285, { align: "right" });

      // Save the PDF
      doc.save(
        `${request.requestId}_${request.employeeName.replace(
          /\s+/g,
          "_"
        )}_Request.pdf`
      );

      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: `Request PDF downloaded: ${request.requestId}`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate PDF. Please try again.",
      });
    }
  };

  // Download Single Request as Excel
  // Download Single Request as Excel
  const downloadRequestExcel = (request) => {
    try {
      // Prepare the data
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - REQUEST DETAILS"],
        [`Request ID: ${request.requestId}`],
        [`Generated: ${new Date().toLocaleDateString()}`],
        [],
        ["REQUEST INFORMATION"],
        ["Request ID:", request.requestId],
        ["Request Date:", formatDate(request.requestDate)],
        ["Status:", request.status],
        ["Priority:", request.priority],
        ["Purpose:", request.purpose],
        [],
        ["EMPLOYEE INFORMATION"],
        ["Employee Name:", request.employeeName],
        ["Employee ID:", request.employeeId],
        ["Designation:", request.designation || "Senior Developer"],
        ["Department:", request.department || "Engineering"],
        ["Email:", request.employeeEmail || "N/A"],
        [
          "Last Promoted:",
          request.lastPromoted ? formatDate(request.lastPromoted) : "N/A",
        ],
        [],
        ["LETTER DETAILS"],
        ["Template Name:", request.templateName],
        ["Template Type:", request.templateType],
        [
          "Category:",
          letterTemplates.find((t) => t.templateType === request.templateType)
            ?.category || "N/A",
        ],
        [
          "SLA:",
          letterTemplates.find((t) => t.templateType === request.templateType)
            ?.sla || "24 hours",
        ],
        [
          "Digital Signature:",
          request.digitalSignature ? "Required" : "Not Required",
        ],
        ["Verification Code:", request.verificationCode || "Pending"],
        [],
        ["APPROVAL INFORMATION"],
        ["Approval Status:", request.status],
        ["Approved By:", request.approvedBy?.join(", ") || "Pending"],
        [
          "Approval Date:",
          request.approvalDate ? formatDate(request.approvalDate) : "Pending",
        ],
        [],
        ["AUDIT TRAIL"],
        ["Total Entries:", request.auditTrail?.length || 0],
      ];

      // Add audit trail entries
      if (request.auditTrail && request.auditTrail.length > 0) {
        excelData.push([]);
        excelData.push(["Action", "By", "Timestamp", "Step", "Details"]);
        request.auditTrail.forEach((trail) => {
          excelData.push([
            trail.action,
            trail.by,
            trail.timestamp,
            trail.step,
            trail.details || "",
          ]);
        });
      }

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Style the worksheet
      worksheet["!cols"] = [
        { wch: 25 }, // First column width
        { wch: 35 }, // Second column width
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Request Details");

      // Generate file and trigger download
      XLSX.writeFile(
        workbook,
        `${request.requestId}_${request.employeeName.replace(
          /\s+/g,
          "_"
        )}_Request.xlsx`
      );

      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: `Excel file downloaded: ${request.requestId}`,
      });
    } catch (error) {
      console.error("Error generating Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate Excel file. Please try again.",
      });
    }
  };

  // Export All Requests as PDF
  const exportAllRequestsPDF = () => {
    if (letterRequests.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No requests available to export",
      });
      return;
    }

    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("ALL REQUESTS REPORT", 105, 30, { align: "center" });

      // Report Info
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 45);
      doc.text(`Total Requests: ${letterRequests.length}`, 14, 52);

      // Statistics
      const statsY = 65;
      doc.setFontSize(12);
      doc.text("Summary Statistics:", 14, statsY);
      doc.setFontSize(10);
      doc.text(
        `• Pending: ${
          letterRequests.filter((r) => r.status === "pending").length
        }`,
        14,
        statsY + 7
      );
      doc.text(
        `• Approved: ${
          letterRequests.filter((r) => r.status === "approved").length
        }`,
        14,
        statsY + 14
      );
      doc.text(
        `• Rejected: ${
          letterRequests.filter((r) => r.status === "rejected").length
        }`,
        14,
        statsY + 21
      );

      // Table
      const tableColumn = [
        "Request ID",
        "Employee",
        "Template",
        "Department",
        "Date",
        "Status",
        "Priority",
      ];

      const tableRows = letterRequests.map((request) => [
        request.requestId,
        request.employeeName,
        request.templateName,
        request.department || "Engineering",
        formatDate(request.requestDate),
        request.status,
        request.priority,
      ]);

      // Use autoTable to create the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        margin: { top: 90 },
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text("Report generated by HR Letter Generation System", 14, finalY);
      doc.text(
        `Page 1 of 1 | Total Records: ${letterRequests.length}`,
        190,
        finalY,
        { align: "right" }
      );

      doc.save(
        `All_Requests_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );

      setNotification({
        show: true,
        type: "success",
        message: `All ${letterRequests.length} requests exported to PDF successfully`,
      });
    } catch (error) {
      console.error("Error exporting all requests to PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export requests to PDF",
      });
    }
  };

  // Export All Requests as Excel
  const exportAllRequestsExcel = () => {
    if (letterRequests.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No requests available to export",
      });
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - ALL REQUESTS REPORT"],
        [
          `Generated: ${new Date().toLocaleDateString()}, Total Requests: ${
            letterRequests.length
          }`,
        ],
        [],
        [
          "REQUEST ID",
          "EMPLOYEE NAME",
          "EMPLOYEE ID",
          "TEMPLATE",
          "DESIGNATION",
          "DEPARTMENT",
          "REQUEST DATE",
          "STATUS",
          "PRIORITY",
          "PURPOSE",
          "APPROVED BY",
        ],
      ];

      // Add all requests
      letterRequests.forEach((request) => {
        excelData.push([
          request.requestId,
          request.employeeName,
          request.employeeId,
          request.templateName,
          request.designation || "Senior Developer",
          request.department || "Engineering",
          formatDate(request.requestDate),
          request.status,
          request.priority,
          request.purpose,
          request.approvedBy?.join(", ") || "Pending",
        ]);
      });

      // Add summary
      excelData.push([]);
      excelData.push(["SUMMARY"]);
      excelData.push(["Total Requests:", letterRequests.length]);
      excelData.push([
        "Pending:",
        letterRequests.filter((r) => r.status === "pending").length,
      ]);
      excelData.push([
        "Approved:",
        letterRequests.filter((r) => r.status === "approved").length,
      ]);
      excelData.push([
        "Rejected:",
        letterRequests.filter((r) => r.status === "rejected").length,
      ]);

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 15 }, // Request ID
        { wch: 25 }, // Employee Name
        { wch: 12 }, // Employee ID
        { wch: 25 }, // Template
        { wch: 20 }, // Designation
        { wch: 15 }, // Department
        { wch: 12 }, // Request Date
        { wch: 10 }, // Status
        { wch: 10 }, // Priority
        { wch: 30 }, // Purpose
        { wch: 25 }, // Approved By
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Requests");

      // Generate file
      XLSX.writeFile(
        workbook,
        `All_Requests_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      setNotification({
        show: true,
        type: "success",
        message: `All ${letterRequests.length} requests exported to Excel successfully`,
      });
    } catch (error) {
      console.error("Error exporting all requests to Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export requests to Excel",
      });
    }
  };

  // Export Filtered Requests as PDF
  // Export Filtered Requests as PDF
  const exportFilteredRequestsPDF = () => {
    const filteredRequests = letterRequests.slice(0, 5); // Recent 5 requests
    if (filteredRequests.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No requests available to export",
      });
      return;
    }

    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("RECENT REQUESTS REPORT", 105, 30, { align: "center" });

      // Report Info
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 45);
      doc.text(`Recent Requests: ${filteredRequests.length}`, 14, 52);

      // Statistics
      const statsY = 65;
      doc.setFontSize(12);
      doc.text("Summary Statistics:", 14, statsY);
      doc.setFontSize(10);
      doc.text(
        `• Pending: ${
          filteredRequests.filter((r) => r.status === "pending").length
        }`,
        14,
        statsY + 7
      );
      doc.text(
        `• Approved: ${
          filteredRequests.filter((r) => r.status === "approved").length
        }`,
        14,
        statsY + 14
      );
      doc.text(
        `• Rejected: ${
          filteredRequests.filter((r) => r.status === "rejected").length
        }`,
        14,
        statsY + 21
      );

      // Table
      const tableColumn = [
        "Request ID",
        "Employee",
        "Template",
        "Department",
        "Date",
        "Status",
        "Priority",
      ];

      const tableRows = filteredRequests.map((request) => [
        request.requestId,
        request.employeeName,
        request.templateName,
        request.department || "Engineering",
        formatDate(request.requestDate),
        request.status,
        request.priority,
      ]);

      // Use autoTable to create the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        margin: { top: 90 },
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text("Report generated by HR Letter Generation System", 14, finalY);
      doc.text(
        `Page 1 of 1 | Recent Records: ${filteredRequests.length}`,
        190,
        finalY,
        { align: "right" }
      );

      doc.save(
        `Recent_Requests_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );

      setNotification({
        show: true,
        type: "success",
        message: `${filteredRequests.length} recent requests exported to PDF`,
      });
    } catch (error) {
      console.error("Error exporting recent requests to PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export requests to PDF",
      });
    }
  };
  // Export Filtered Requests as Excel
  // Export Filtered Requests as Excel
  const exportFilteredRequestsExcel = () => {
    const filteredRequests = letterRequests.slice(0, 5); // Recent 5 requests
    if (filteredRequests.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No requests available to export",
      });
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - RECENT REQUESTS REPORT"],
        [
          `Generated: ${new Date().toLocaleDateString()}, Recent Requests: ${
            filteredRequests.length
          }`,
        ],
        [],
        [
          "REQUEST ID",
          "EMPLOYEE NAME",
          "EMPLOYEE ID",
          "TEMPLATE",
          "DESIGNATION",
          "DEPARTMENT",
          "REQUEST DATE",
          "STATUS",
          "PRIORITY",
          "PURPOSE",
          "APPROVED BY",
        ],
      ];

      // Add all requests
      filteredRequests.forEach((request) => {
        excelData.push([
          request.requestId,
          request.employeeName,
          request.employeeId,
          request.templateName,
          request.designation || "Senior Developer",
          request.department || "Engineering",
          formatDate(request.requestDate),
          request.status,
          request.priority,
          request.purpose,
          request.approvedBy?.join(", ") || "Pending",
        ]);
      });

      // Add summary
      excelData.push([]);
      excelData.push(["SUMMARY"]);
      excelData.push(["Total Requests:", filteredRequests.length]);
      excelData.push([
        "Pending:",
        filteredRequests.filter((r) => r.status === "pending").length,
      ]);
      excelData.push([
        "Approved:",
        filteredRequests.filter((r) => r.status === "approved").length,
      ]);
      excelData.push([
        "Rejected:",
        filteredRequests.filter((r) => r.status === "rejected").length,
      ]);

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 15 }, // Request ID
        { wch: 25 }, // Employee Name
        { wch: 12 }, // Employee ID
        { wch: 25 }, // Template
        { wch: 20 }, // Designation
        { wch: 15 }, // Department
        { wch: 12 }, // Request Date
        { wch: 10 }, // Status
        { wch: 10 }, // Priority
        { wch: 30 }, // Purpose
        { wch: 25 }, // Approved By
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Recent Requests");

      // Generate file
      XLSX.writeFile(
        workbook,
        `Recent_Requests_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      setNotification({
        show: true,
        type: "success",
        message: `${filteredRequests.length} recent requests exported to Excel successfully`,
      });
    } catch (error) {
      console.error("Error exporting recent requests to Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export requests to Excel",
      });
    }
  };

  // Handle adding new template
  const handleAddTemplate = (newTemplateData) => {
    const newTemplate = {
      id: letterTemplates.length + 1,
      templateId: `TMP${String(letterTemplates.length + 1).padStart(3, "0")}`,
      ...newTemplateData,
      usageCount: 0,
      lastUsed: new Date().toISOString().split("T")[0],
      status: "Active",
      defaultFields: newTemplateData.defaultFields || [],
      workflowSteps: newTemplateData.workflowSteps || [
        "Request Submission",
        "Approval",
        "Generation",
      ],
      sla: newTemplateData.sla || "24 hours",
      digitalSignature:
        newTemplateData.digitalSignature !== undefined
          ? newTemplateData.digitalSignature
          : true,
      verificationCode:
        newTemplateData.verificationCode !== undefined
          ? newTemplateData.verificationCode
          : true,
      icon: newTemplateData.icon || "FileText",
    };

    setLetterTemplates((prev) => [...prev, newTemplate]);

    setTemplateNotification({
      show: true,
      type: "success",
      title: "Template Created",
      message: `Template "${newTemplate.templateName}" has been created successfully!`,
    });

    setShowTemplateModal(false);
  };
  // Download Single Workflow as PDF
  const downloadWorkflowPDF = (workflow) => {
    try {
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Workflow - ${workflow.requestId}`,
        subject: workflow.templateName,
        author: "HR Letter Generation System",
        keywords: "HR, Workflow, Process",
        creator: "HR System",
      });

      // Title - Centered
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text(
        "HR LETTER GENERATION SYSTEM",
        doc.internal.pageSize.width / 2,
        20,
        { align: "center" }
      );

      // Subtitle - Centered
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("WORKFLOW DETAILS", doc.internal.pageSize.width / 2, 30, {
        align: "center",
      });

      // Horizontal line under title
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 34, doc.internal.pageSize.width - 14, 34);

      // Workflow Information - Left aligned with proper spacing
      doc.setFontSize(12);
      doc.setTextColor(52, 73, 94);
      doc.setFont(undefined, "bold");
      doc.text("WORKFLOW SUMMARY", 14, 48);

      doc.setFont(undefined, "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const workflowInfo = [
        ["Request ID:", workflow.requestId],
        ["Workflow Status:", workflow.workflowStatus.toUpperCase()],
        ["Current Step:", workflow.currentStep],
        ["Priority:", workflow.priority],
      ];

      let yPos = 58;
      workflowInfo.forEach(([label, value]) => {
        doc.setFont(undefined, "bold");
        doc.text(label, 14, yPos);
        doc.setFont(undefined, "normal");
        doc.text(value || "N/A", 60, yPos);
        yPos += 7;
      });

      // Horizontal separator
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos + 3, doc.internal.pageSize.width - 14, yPos + 3);
      yPos += 10;

      // Employee Details - Proper column alignment
      doc.setFontSize(12);
      doc.setTextColor(52, 73, 94);
      doc.setFont(undefined, "bold");
      doc.text("EMPLOYEE INFORMATION", 14, yPos);
      yPos += 8;

      doc.setFont(undefined, "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const employeeDetails = [
        ["Employee Name:", workflow.employeeName || "N/A"],
        ["Employee ID:", workflow.employeeId || "N/A"],
        ["Designation:", workflow.designation || "N/A"],
        ["Department:", workflow.department || "N/A"],
        ["Email:", workflow.employeeEmail || "N/A"],
        [
          "Last Promoted:",
          workflow.lastPromoted ? formatDate(workflow.lastPromoted) : "N/A",
        ],
      ];

      employeeDetails.forEach(([label, value]) => {
        doc.setFont(undefined, "bold");
        doc.text(label, 14, yPos);
        doc.setFont(undefined, "normal");
        // Wrap long text to avoid overflow
        const maxWidth = 120;
        const lines = doc.splitTextToSize(value, maxWidth);
        doc.text(lines, 60, yPos);
        yPos += lines.length * 5 || 7;
      });

      // Check for page break
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      } else {
        yPos += 8;
      }

      // Horizontal separator
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos, doc.internal.pageSize.width - 14, yPos);
      yPos += 10;

      // Workflow Details
      doc.setFontSize(12);
      doc.setTextColor(52, 73, 94);
      doc.setFont(undefined, "bold");
      doc.text("LETTER DETAILS", 14, yPos);
      yPos += 8;

      doc.setFont(undefined, "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const letterTemplates = []; // Assuming this is defined elsewhere
      const template = letterTemplates.find(
        (t) => t.templateType === workflow.templateType
      );

      const workflowDetails = [
        ["Letter Type:", workflow.templateName || "N/A"],
        ["Purpose:", workflow.purpose || "N/A"],
        ["Template Category:", template?.category || "N/A"],
        ["SLA:", template?.sla || "24 hours"],
        ["Auto-approved:", workflow.autoApproved ? "Yes" : "No"],
        [
          "Digital Signature:",
          workflow.digitalSignature ? "Required" : "Not Required",
        ],
      ];

      workflowDetails.forEach(([label, value]) => {
        doc.setFont(undefined, "bold");
        doc.text(label, 14, yPos);
        doc.setFont(undefined, "normal");
        const maxWidth = 120;
        const lines = doc.splitTextToSize(value, maxWidth);
        doc.text(lines, 60, yPos);
        yPos += lines.length * 5 || 7;
      });

      // Check for page break before audit trail
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      } else {
        yPos += 8;
      }

      // Horizontal separator
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos, doc.internal.pageSize.width - 14, yPos);
      yPos += 10;

      // Audit Trail Summary
      doc.setFontSize(12);
      doc.setTextColor(52, 73, 94);
      doc.setFont(undefined, "bold");
      doc.text("RECENT ACTIVITIES", 14, yPos);
      yPos += 8;

      doc.setFont(undefined, "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      if (workflow.auditTrail && workflow.auditTrail.length > 0) {
        const recentActivities = workflow.auditTrail.slice(-5);
        recentActivities.forEach((trail, index) => {
          if (yPos < 280) {
            const date = trail.timestamp
              ? formatDate(trail.timestamp)
              : "Unknown date";
            const activityText = `• ${date} - ${trail.action} by ${trail.by}`;
            const maxWidth = 180;
            const lines = doc.splitTextToSize(activityText, maxWidth);
            lines.forEach((line) => {
              if (yPos < 280) {
                doc.text(line, 14, yPos);
                yPos += 5;
              }
            });
            yPos += 2;
          }
        });

        if (workflow.auditTrail.length > 5) {
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(
            `... and ${workflow.auditTrail.length - 5} more activities`,
            14,
            Math.min(yPos, 280)
          );
          yPos += 5;
        }
      } else {
        doc.text("No audit trail available", 14, yPos);
        yPos += 7;
      }

      // Footer - Always at bottom
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);

      // Company info at bottom left
      doc.text(
        "HR Letter Generation System | Official Document",
        14,
        pageHeight - 15
      );
      doc.text(
        "Generated on: " + new Date().toLocaleDateString(),
        14,
        pageHeight - 10
      );

      // Page info at bottom right
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
        doc.text(
          `Page ${currentPage} of ${totalPages}`,
          doc.internal.pageSize.width - 20,
          pageHeight - 10,
          { align: "right" }
        );
        doc.text(
          "For verification, contact HR Department",
          doc.internal.pageSize.width - 20,
          pageHeight - 15,
          { align: "right" }
        );
      }

      // Optional: Add border to make it look more professional
      doc.setDrawColor(220, 220, 220);
      doc.rect(
        5,
        5,
        doc.internal.pageSize.width - 10,
        doc.internal.pageSize.height - 10
      );

      // Save the PDF
      const fileName = `${workflow.requestId}_${(
        workflow.employeeName || "unknown"
      ).replace(/[^a-z0-9]/gi, "_")}_Workflow.pdf`;
      doc.save(fileName);

      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: `Workflow PDF downloaded: ${workflow.requestId}`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate PDF. Please try again.",
      });
    }
  };

  // Download Single Workflow as Excel
  const downloadWorkflowExcel = (workflow) => {
    try {
      const template = letterTemplates.find(
        (t) => t.templateType === workflow.templateType
      );
      const currentStepIndex =
        template?.workflowSteps?.findIndex(
          (step) => step === workflow.currentStep
        ) || 0;
      const totalSteps = template?.workflowSteps?.length || 0;

      // Prepare the data
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - WORKFLOW DETAILS"],
        [`Workflow ID: ${workflow.requestId}`],
        [`Generated: ${new Date().toLocaleDateString()}`],
        [],
        ["WORKFLOW INFORMATION"],
        ["Request ID:", workflow.requestId],
        ["Workflow Status:", workflow.workflowStatus],
        ["Current Step:", workflow.currentStep],
        ["Step Progress:", `${currentStepIndex + 1}/${totalSteps} steps`],
        [
          "Progress Percentage:",
          `${Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%`,
        ],
        ["Priority:", workflow.priority],
        ["Request Date:", formatDate(workflow.requestDate)],
        ["Purpose:", workflow.purpose],
        [],
        ["EMPLOYEE INFORMATION"],
        ["Employee Name:", workflow.employeeName],
        ["Employee ID:", workflow.employeeId],
        ["Designation:", workflow.designation || "Senior Developer"],
        ["Department:", workflow.department || "Engineering"],
        ["Email:", workflow.employeeEmail || "N/A"],
        [
          "Last Promoted:",
          workflow.lastPromoted ? formatDate(workflow.lastPromoted) : "N/A",
        ],
        [],
        ["LETTER DETAILS"],
        ["Template Name:", workflow.templateName],
        ["Template Type:", workflow.templateType],
        ["Category:", template?.category || "N/A"],
        ["SLA:", template?.sla || "24 hours"],
        ["Auto-approved:", workflow.autoApproved ? "Yes" : "No"],
        [
          "Digital Signature:",
          workflow.digitalSignature ? "Required" : "Not Required",
        ],
        [],
        ["WORKFLOW STEPS"],
        ["Step", "Status", "Description"],
      ];

      // Add workflow steps
      if (template?.workflowSteps) {
        template.workflowSteps.forEach((step, index) => {
          const isCurrent = step === workflow.currentStep;
          const isCompleted = index < currentStepIndex;
          const status = isCurrent
            ? "In Progress"
            : isCompleted
            ? "Completed"
            : "Pending";
          excelData.push([
            step,
            status,
            isCurrent ? "Current step in workflow" : "",
          ]);
        });
      }

      // Add audit trail
      excelData.push([]);
      excelData.push(["AUDIT TRAIL"]);
      excelData.push(["Total Entries:", workflow.auditTrail?.length || 0]);

      if (workflow.auditTrail && workflow.auditTrail.length > 0) {
        excelData.push([]);
        excelData.push(["Action", "By", "Timestamp", "Step", "Details"]);
        workflow.auditTrail.forEach((trail) => {
          excelData.push([
            trail.action,
            trail.by,
            trail.timestamp,
            trail.step,
            trail.details || "",
          ]);
        });
      }

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Style the worksheet
      worksheet["!cols"] = [
        { wch: 25 }, // First column width
        { wch: 20 }, // Second column width
        { wch: 30 }, // Third column width
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Workflow Details");

      // Generate file and trigger download
      XLSX.writeFile(
        workbook,
        `${workflow.requestId}_${workflow.employeeName.replace(
          /\s+/g,
          "_"
        )}_Workflow.xlsx`
      );

      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: `Excel file downloaded: ${workflow.requestId}`,
      });
    } catch (error) {
      console.error("Error generating Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate Excel file. Please try again.",
      });
    }
  };

  // Export All Workflows as PDF
  const exportAllWorkflowsPDF = () => {
    if (workflowRequests.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No workflows available to export",
      });
      return;
    }

    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("ALL WORKFLOWS REPORT", 105, 30, { align: "center" });

      // Report Info
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 45);
      doc.text(`Total Workflows: ${workflowRequests.length}`, 14, 52);

      // Statistics
      const statsY = 65;
      doc.setFontSize(12);
      doc.text("Summary Statistics:", 14, statsY);
      doc.setFontSize(10);
      doc.text(
        `• In Progress: ${
          workflowRequests.filter((r) => r.workflowStatus === "in_progress")
            .length
        }`,
        14,
        statsY + 7
      );
      doc.text(
        `• Completed: ${
          workflowRequests.filter((r) => r.workflowStatus === "completed")
            .length
        }`,
        14,
        statsY + 14
      );
      doc.text(
        `• Pending Approval: ${
          workflowRequests.filter((r) => r.status === "pending_approval").length
        }`,
        14,
        statsY + 21
      );
      doc.text(
        `• Terminated: ${
          workflowRequests.filter((r) => r.workflowStatus === "terminated")
            .length
        }`,
        14,
        statsY + 28
      );

      // Table
      const tableColumn = [
        "Request ID",
        "Employee",
        "Template",
        "Department",
        "Current Step",
        "Status",
        "Priority",
        "SLA",
      ];

      const tableRows = workflowRequests.map((request) => {
        const template = letterTemplates.find(
          (t) => t.templateType === request.templateType
        );
        return [
          request.requestId,
          request.employeeName,
          request.templateName,
          request.department || "Engineering",
          request.currentStep,
          request.workflowStatus,
          request.priority,
          template?.sla || "24h",
        ];
      });

      // Use autoTable to create the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        margin: { top: 90 },
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text("Report generated by HR Letter Generation System", 14, finalY);
      doc.text(
        `Page 1 of 1 | Total Records: ${workflowRequests.length}`,
        190,
        finalY,
        { align: "right" }
      );

      doc.save(
        `All_Workflows_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );

      setNotification({
        show: true,
        type: "success",
        message: `All ${workflowRequests.length} workflows exported to PDF successfully`,
      });
    } catch (error) {
      console.error("Error exporting all workflows to PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export workflows to PDF",
      });
    }
  };

  // Export All Workflows as Excel
  const exportAllWorkflowsExcel = () => {
    if (workflowRequests.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No workflows available to export",
      });
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - ALL WORKFLOWS REPORT"],
        [
          `Generated: ${new Date().toLocaleDateString()}, Total Workflows: ${
            workflowRequests.length
          }`,
        ],
        [],
        [
          "REQUEST ID",
          "EMPLOYEE NAME",
          "EMPLOYEE ID",
          "TEMPLATE",
          "DESIGNATION",
          "DEPARTMENT",
          "CURRENT STEP",
          "WORKFLOW STATUS",
          "PRIORITY",
          "REQUEST DATE",
          "PURPOSE",
        ],
      ];

      // Add all workflows
      workflowRequests.forEach((request) => {
        excelData.push([
          request.requestId,
          request.employeeName,
          request.employeeId,
          request.templateName,
          request.designation || "Senior Developer",
          request.department || "Engineering",
          request.currentStep,
          request.workflowStatus,
          request.priority,
          formatDate(request.requestDate),
          request.purpose,
        ]);
      });

      // Add summary
      excelData.push([]);
      excelData.push(["SUMMARY"]);
      excelData.push(["Total Workflows:", workflowRequests.length]);
      excelData.push([
        "In Progress:",
        workflowRequests.filter((r) => r.workflowStatus === "in_progress")
          .length,
      ]);
      excelData.push([
        "Completed:",
        workflowRequests.filter((r) => r.workflowStatus === "completed").length,
      ]);
      excelData.push([
        "Pending Approval:",
        workflowRequests.filter((r) => r.status === "pending_approval").length,
      ]);
      excelData.push([
        "Terminated:",
        workflowRequests.filter((r) => r.workflowStatus === "terminated")
          .length,
      ]);

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 15 }, // Request ID
        { wch: 25 }, // Employee Name
        { wch: 12 }, // Employee ID
        { wch: 25 }, // Template
        { wch: 20 }, // Designation
        { wch: 15 }, // Department
        { wch: 20 }, // Current Step
        { wch: 15 }, // Workflow Status
        { wch: 10 }, // Priority
        { wch: 12 }, // Request Date
        { wch: 30 }, // Purpose
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "All Workflows");

      // Generate file
      XLSX.writeFile(
        workbook,
        `All_Workflows_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      setNotification({
        show: true,
        type: "success",
        message: `All ${workflowRequests.length} workflows exported to Excel successfully`,
      });
    } catch (error) {
      console.error("Error exporting all workflows to Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export workflows to Excel",
      });
    }
  };

  // Export Filtered Workflows as PDF
  const exportFilteredWorkflowsPDF = () => {
    if (filteredWorkflows.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No filtered workflows to export",
      });
      return;
    }

    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("FILTERED WORKFLOWS REPORT", 105, 30, { align: "center" });

      // Report Info
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 45);
      doc.text(
        `Filtered Workflows: ${filteredWorkflows.length} of ${workflowRequests.length}`,
        14,
        52
      );

      // Show filters
      const filterInfo = [];
      if (workflowView !== "all") filterInfo.push(`View: ${workflowView}`);
      if (workflowFilter.templateType)
        filterInfo.push(`Template: ${workflowFilter.templateType}`);
      if (workflowFilter.priority)
        filterInfo.push(`Priority: ${workflowFilter.priority}`);
      if (workflowFilter.search)
        filterInfo.push(`Search: "${workflowFilter.search}"`);

      if (filterInfo.length > 0) {
        doc.text(`Filters: ${filterInfo.join(", ")}`, 14, 59);
      }

      // Table
      const tableColumn = [
        "Request ID",
        "Employee",
        "Template",
        "Department",
        "Current Step",
        "Status",
        "Priority",
      ];

      const tableRows = filteredWorkflows.map((request) => [
        request.requestId,
        request.employeeName,
        request.templateName,
        request.department || "Engineering",
        request.currentStep,
        request.workflowStatus,
        request.priority,
      ]);

      // Use autoTable to create the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: filterInfo.length > 0 ? 66 : 59,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text("Report generated by HR Letter Generation System", 14, finalY);
      doc.text(
        `Page 1 of 1 | Filtered Records: ${filteredWorkflows.length}`,
        190,
        finalY,
        { align: "right" }
      );

      doc.save(
        `Filtered_Workflows_${new Date().toISOString().split("T")[0]}.pdf`
      );

      setNotification({
        show: true,
        type: "success",
        message: `${filteredWorkflows.length} filtered workflows exported to PDF`,
      });
    } catch (error) {
      console.error("Error exporting filtered workflows to PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export filtered workflows to PDF",
      });
    }
  };

  // Export Filtered Workflows as Excel
  const exportFilteredWorkflowsExcel = () => {
    if (filteredWorkflows.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No filtered workflows to export",
      });
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - FILTERED WORKFLOWS REPORT"],
        [
          `Generated: ${new Date().toLocaleDateString()}, Filtered Workflows: ${
            filteredWorkflows.length
          } of ${workflowRequests.length}`,
        ],
        [],
      ];

      // Add filter information
      const filterInfo = [];
      if (workflowView !== "all") filterInfo.push(`View: ${workflowView}`);
      if (workflowFilter.templateType)
        filterInfo.push(`Template: ${workflowFilter.templateType}`);
      if (workflowFilter.priority)
        filterInfo.push(`Priority: ${workflowFilter.priority}`);
      if (workflowFilter.search)
        filterInfo.push(`Search: "${workflowFilter.search}"`);

      if (filterInfo.length > 0) {
        excelData.push(["FILTERS APPLIED"]);
        filterInfo.forEach((filter) => {
          excelData.push([filter]);
        });
        excelData.push([]);
      }

      // Add headers
      excelData.push([
        "REQUEST ID",
        "EMPLOYEE NAME",
        "EMPLOYEE ID",
        "TEMPLATE",
        "DESIGNATION",
        "DEPARTMENT",
        "CURRENT STEP",
        "WORKFLOW STATUS",
        "PRIORITY",
        "REQUEST DATE",
      ]);

      // Add filtered workflows
      filteredWorkflows.forEach((request) => {
        excelData.push([
          request.requestId,
          request.employeeName,
          request.employeeId,
          request.templateName,
          request.designation || "Senior Developer",
          request.department || "Engineering",
          request.currentStep,
          request.workflowStatus,
          request.priority,
          formatDate(request.requestDate),
        ]);
      });

      // Add summary
      excelData.push([]);
      excelData.push(["SUMMARY"]);
      excelData.push(["Filtered Workflows:", filteredWorkflows.length]);
      excelData.push([
        "In Progress:",
        filteredWorkflows.filter((r) => r.workflowStatus === "in_progress")
          .length,
      ]);
      excelData.push([
        "Completed:",
        filteredWorkflows.filter((r) => r.workflowStatus === "completed")
          .length,
      ]);
      excelData.push([
        "Pending Approval:",
        filteredWorkflows.filter((r) => r.status === "pending_approval").length,
      ]);
      excelData.push([
        "Terminated:",
        filteredWorkflows.filter((r) => r.workflowStatus === "terminated")
          .length,
      ]);

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 15 }, // Request ID
        { wch: 25 }, // Employee Name
        { wch: 12 }, // Employee ID
        { wch: 25 }, // Template
        { wch: 20 }, // Designation
        { wch: 15 }, // Department
        { wch: 20 }, // Current Step
        { wch: 15 }, // Workflow Status
        { wch: 10 }, // Priority
        { wch: 12 }, // Request Date
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Workflows");

      // Generate file name
      let fileName = `Filtered_Workflows_${
        new Date().toISOString().split("T")[0]
      }`;
      if (filterInfo.length > 0) {
        fileName += `_${filterInfo.length}_filters`;
      }

      // Generate file
      XLSX.writeFile(workbook, `${fileName}.xlsx`);

      setNotification({
        show: true,
        type: "success",
        message: `${filteredWorkflows.length} filtered workflows exported to Excel`,
      });
    } catch (error) {
      console.error("Error exporting filtered workflows to Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export filtered workflows to Excel",
      });
    }
  };

  // Archive-specific download functions
  const downloadArchiveLetterPDF = (letter) => {
    try {
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `Letter - ${letter.letterId}`,
        subject: letter.templateName,
        author: "HR Letter Generation System",
        keywords: "HR, Letter, Certificate, Archive",
        creator: "HR System",
      });

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      // Subtitle with Archive label
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${letter.templateName} - ARCHIVED COPY`, 105, 30, {
        align: "center",
      });

      // Header Information
      doc.setFontSize(10);
      doc.text(`Letter ID: ${letter.letterId}`, 14, 50);
      // Use generatedDate or generationDate
      doc.text(
        `Generated: ${formatDate(
          letter.generatedDate || letter.generationDate
        )}`,
        14,
        56
      );
      doc.text(
        `Last Accessed: ${
          letter.lastAccessed ? formatDate(letter.lastAccessed) : "Never"
        }`,
        14,
        62
      );
      doc.text(`Download Count: ${letter.downloadCount || 0}`, 14, 68);

      // Horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 74, 196, 74);

      // Extract data from formData or use direct properties
      const designation =
        letter.formData?.designation ||
        letter.designation ||
        letter.employeeDesignation ||
        "N/A";

      const department =
        letter.formData?.department ||
        letter.department ||
        letter.employeeDepartment ||
        "N/A";

      const email =
        letter.formData?.employeeEmail ||
        letter.formData?.email ||
        letter.employeeEmail ||
        letter.email ||
        "N/A";

      const phone =
        letter.formData?.employeePhone ||
        letter.formData?.phone ||
        letter.employeePhone ||
        letter.phone ||
        "N/A";

      const joiningDate =
        letter.formData?.joiningDate || letter.joiningDate || "N/A";

      const relievingDate =
        letter.formData?.relievingDate || letter.relievingDate || "N/A";

      const currentSalary =
        letter.formData?.currentSalary ||
        letter.formData?.salary ||
        letter.salary ||
        "N/A";

      const lastPromoted =
        letter.formData?.lastPromoted || letter.lastPromoted || "N/A";

      // Employee Details Section
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("EMPLOYEE INFORMATION", 14, 84);

      doc.setFont(undefined, "normal");
      doc.setFontSize(11);

      const details = [
        ["Employee Name:", letter.employeeName || "N/A"],
        ["Employee ID:", letter.employeeId || "N/A"],
        ["Designation:", designation],
        ["Department:", department],
        ["Email:", email],
        ["Phone:", phone],
        ["Status:", letter.status || "Active"],
        ["Purpose:", letter.purpose || "General Purpose"],
        [
          "Joining Date:",
          joiningDate !== "N/A" ? formatDate(joiningDate) : "N/A",
        ],
        [
          "Last Promoted:",
          lastPromoted !== "N/A" ? formatDate(lastPromoted) : "N/A",
        ],
      ];

      details.forEach(([label, value], index) => {
        doc.text(label, 14, 94 + index * 8);
        doc.text(value, 70, 94 + index * 8);
      });

      // Add current salary if available
      let additionalY = 94 + details.length * 8;
      if (currentSalary !== "N/A") {
        additionalY += 8;
        doc.text("Current Salary:", 14, additionalY);
        doc.text(`₹${currentSalary.toLocaleString()}`, 70, additionalY);
      }

      // Add relieving date if available
      if (relievingDate !== "N/A") {
        additionalY += 8;
        doc.text("Relieving Date:", 14, additionalY);
        doc.text(formatDate(relievingDate), 70, additionalY);
      }

      // Verification Section
      doc.setFont(undefined, "bold");
      doc.text("VERIFICATION DETAILS", 14, additionalY + 20);

      doc.setFont(undefined, "normal");
      doc.text(
        `Verification Code: ${letter.verificationCode || "N/A"}`,
        14,
        additionalY + 28
      );
      doc.text(
        `Digital Signature: ${
          letter.digitalSignature ? "VERIFIED" : "NOT APPLIED"
        }`,
        14,
        additionalY + 36
      );
      if (letter.digitalSignature) {
        doc.text(
          `Signature Date: ${formatDate(
            letter.generatedDate || letter.generationDate
          )}`,
          14,
          additionalY + 44
        );
      }

      // Status Information
      let statusY = additionalY + 44;
      if (letter.approvalDate) {
        statusY += 8;
        doc.text(
          `Approval Date: ${formatDate(letter.approvalDate)}`,
          14,
          statusY
        );
      }
      if (letter.rejectionReason) {
        statusY += 8;
        doc.text(`Rejection Reason: ${letter.rejectionReason}`, 14, statusY);
      }

      // Footer
      const footerY = Math.max(statusY + 20, 250); // Ensure minimum footer position
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("ARCHIVED DOCUMENT - FOR RECORDS ONLY", 105, footerY, {
        align: "center",
      });
      doc.text(
        "This document is part of the HR Letter Archive System",
        14,
        footerY + 5
      );
      doc.text(
        `Exported on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        14,
        footerY + 10
      );
      doc.text(`Archive ID: ${letter.id}`, 190, footerY + 10, {
        align: "right",
      });

      // Save the PDF
      const fileName = `${letter.letterId}_${
        letter.employeeName?.replace(/\s+/g, "_") || "Letter"
      }.pdf`;
      doc.save(fileName);

      // Update download count
      const updatedArchive = letterArchive.map((l) =>
        l.id === letter.id
          ? {
              ...l,
              downloadCount: (l.downloadCount || 0) + 1,
              lastAccessed: new Date().toISOString().split("T")[0],
            }
          : l
      );
      setLetterArchive(updatedArchive);

      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: `Archive letter ${
          letter.letterId
        } downloaded as PDF! Download count: ${
          (letter.downloadCount || 0) + 1
        }`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate PDF. Please try again.",
      });
    }
  };

  const downloadArchiveLetterExcel = (letter) => {
    try {
      // Get the actual data from the letter object
      const employeeDesignation =
        letter.designation ||
        letter.employeeDesignation ||
        (letter.formData && letter.formData.designation) ||
        "N/A";

      const employeeDepartment =
        letter.department ||
        letter.employeeDepartment ||
        (letter.formData && letter.formData.department) ||
        "N/A";

      const employeeEmail =
        letter.employeeEmail ||
        letter.email ||
        (letter.formData && letter.formData.email) ||
        "N/A";

      const employeePhone =
        letter.employeePhone ||
        letter.phone ||
        (letter.formData && letter.formData.phone) ||
        "N/A";

      // Prepare the data with actual values from letter
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - ARCHIVED LETTER"],
        [letter.templateName],
        [`Archive ID: ${letter.id}`],
        [],
        ["LETTER DETAILS"],
        ["Letter ID:", letter.letterId],
        [
          "Generated Date:",
          formatDate(letter.generationDate || letter.generatedDate),
        ],
        [
          "Last Accessed:",
          letter.lastAccessed ? formatDate(letter.lastAccessed) : "Never",
        ],
        ["Download Count:", letter.downloadCount || 0],
        ["Status:", letter.status || "Active"],
        ["Format:", letter.format || "PDF"],
        ["Version:", letter.version || "1.0"],
        [],
        ["EMPLOYEE INFORMATION"],
        ["Employee Name:", letter.employeeName],
        ["Employee ID:", letter.employeeId],
        ["Designation:", employeeDesignation],
        ["Department:", employeeDepartment],
        ["Email:", employeeEmail],
        ["Phone:", employeePhone],
        ["Purpose:", letter.purpose || "General Purpose"],
      ];

      // Add additional employment details if available
      if (letter.formData) {
        excelData.push([]);
        excelData.push(["EMPLOYMENT DETAILS"]);

        // Add common employment fields
        const employmentFields = [
          { label: "Joining Date:", field: "joiningDate" },
          { label: "Relieving Date:", field: "relievingDate" },
          { label: "Employment Duration:", field: "employmentDuration" },
          { label: "Current Salary:", field: "currentSalary" },
          { label: "New Salary:", field: "newSalary" },
          { label: "Last Promoted:", field: "lastPromoted" },
          { label: "Reporting Manager:", field: "reportingManager" },
          { label: "Notice Period:", field: "noticePeriod" },
        ];

        employmentFields.forEach(({ label, field }) => {
          if (letter.formData[field]) {
            excelData.push([label, letter.formData[field]]);
          }
        });
      }

      // Add verification and archive information
      excelData.push([]);
      excelData.push(["VERIFICATION DETAILS"]);
      excelData.push(["Verification Code:", letter.verificationCode || "N/A"]);
      excelData.push([
        "Digital Signature:",
        letter.digitalSignature ? "Yes" : "No",
      ]);

      if (letter.approvalDate) {
        excelData.push(["Approval Date:", formatDate(letter.approvalDate)]);
      }

      if (letter.rejectionReason) {
        excelData.push(["Rejection Reason:", letter.rejectionReason]);
      }

      excelData.push([]);
      excelData.push(["ARCHIVE INFORMATION"]);
      excelData.push(["Archive Date:", new Date().toLocaleDateString()]);
      excelData.push([
        "Export Date:",
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
      ]);

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Style the worksheet - adjust column widths based on content
      worksheet["!cols"] = [
        { wch: 25 }, // First column width (labels)
        { wch: 40 }, // Second column width (values)
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Archive Letter");

      // Generate file and trigger download
      XLSX.writeFile(
        workbook,
        `${letter.letterId}_ARCHIVE_${letter.employeeName.replace(
          /\s+/g,
          "_"
        )}.xlsx`
      );

      // Update download count
      const updatedArchive = letterArchive.map((l) =>
        l.id === letter.id
          ? {
              ...l,
              downloadCount: (l.downloadCount || 0) + 1,
              lastAccessed: new Date().toISOString().split("T")[0],
            }
          : l
      );
      setLetterArchive(updatedArchive);

      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: `Archive letter ${letter.letterId} downloaded as Excel!`,
      });
    } catch (error) {
      console.error("Error generating Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to generate Excel file. Please try again.",
      });
    }
  };

  const exportAllArchiveLettersExcel = () => {
    if (letterArchive.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No letters in archive to export",
      });
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = [
        ["HR LETTER GENERATION SYSTEM - ARCHIVE REPORT"],
        [
          `Generated: ${new Date().toLocaleDateString()}, Total Archived Letters: ${
            letterArchive.length
          }`,
        ],
        [],
        [
          "LETTER ID",
          "EMPLOYEE NAME",
          "EMPLOYEE ID",
          "TEMPLATE",
          "DESIGNATION",
          "DEPARTMENT",
          "GENERATED DATE",
          "STATUS",
          "DIGITAL SIGNATURE",
          "VERIFICATION CODE",
          "DOWNLOAD COUNT",
          "LAST ACCESSED",
        ],
      ];

      // Add all archive letters
      letterArchive.forEach((letter) => {
        excelData.push([
          letter.letterId,
          letter.employeeName,
          letter.employeeId,
          letter.templateName,
          letter.designation || "N/A",
          letter.department || "N/A",
          formatDate(letter.generationDate),
          letter.status || "Active",
          letter.digitalSignature ? "Yes" : "No",
          letter.verificationCode || "N/A",
          letter.downloadCount,
          letter.lastAccessed ? formatDate(letter.lastAccessed) : "Never",
        ]);
      });

      // Add summary
      excelData.push([]);
      excelData.push(["ARCHIVE SUMMARY"]);
      excelData.push(["Total Archived Letters:", letterArchive.length]);
      excelData.push([
        "Total Downloads:",
        letterArchive.reduce((sum, l) => sum + l.downloadCount, 0),
      ]);
      excelData.push([
        "With Digital Signature:",
        letterArchive.filter((l) => l.digitalSignature).length,
      ]);
      excelData.push([
        "Approved Letters:",
        letterArchive.filter((l) => l.status === "approved").length,
      ]);
      excelData.push([
        "Pending Letters:",
        letterArchive.filter((l) => l.status === "pending").length,
      ]);

      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      worksheet["!cols"] = [
        { wch: 15 }, // Letter ID
        { wch: 25 }, // Employee Name
        { wch: 12 }, // Employee ID
        { wch: 25 }, // Template
        { wch: 20 }, // Designation
        { wch: 15 }, // Department
        { wch: 15 }, // Generated Date
        { wch: 10 }, // Status
        { wch: 15 }, // Digital Signature
        { wch: 20 }, // Verification Code
        { wch: 12 }, // Download Count
        { wch: 15 }, // Last Accessed
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Archive Report");

      // Generate file
      XLSX.writeFile(
        workbook,
        `Archive_Report_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      setNotification({
        show: true,
        type: "success",
        message: `Archive report exported to Excel successfully (${letterArchive.length} letters)`,
      });
    } catch (error) {
      console.error("Error exporting archive to Excel:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export archive to Excel",
      });
    }
  };

  const exportAllArchiveLettersPDF = () => {
    if (letterArchive.length === 0) {
      setNotification({
        show: true,
        type: "warning",
        message: "No letters in archive to export",
      });
      return;
    }

    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(41, 128, 185);
      doc.text("HR LETTER GENERATION SYSTEM", 105, 20, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("ARCHIVE MASTER REPORT", 105, 30, { align: "center" });

      // Report Info
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 45);
      doc.text(`Total Archived Letters: ${letterArchive.length}`, 14, 52);
      doc.text(
        `Total Downloads: ${letterArchive.reduce(
          (sum, l) => sum + l.downloadCount,
          0
        )}`,
        14,
        59
      );

      // Statistics
      const statsY = 70;
      doc.setFontSize(12);
      doc.text("Archive Statistics:", 14, statsY);
      doc.setFontSize(10);
      doc.text(
        `• Approved: ${
          letterArchive.filter((l) => l.status === "approved").length
        }`,
        14,
        statsY + 7
      );
      doc.text(
        `• Pending: ${
          letterArchive.filter((l) => l.status === "pending").length
        }`,
        14,
        statsY + 14
      );
      doc.text(
        `• With Digital Signature: ${
          letterArchive.filter((l) => l.digitalSignature).length
        }`,
        14,
        statsY + 21
      );

      // Table
      const tableColumn = [
        "Letter ID",
        "Employee",
        "Template",
        "Department",
        "Generated",
        "Downloads",
        "Status",
      ];

      const tableRows = letterArchive.map((letter) => [
        letter.letterId,
        letter.employeeName,
        letter.templateName,
        letter.department || "N/A",
        formatDate(letter.generationDate),
        letter.downloadCount.toString(),
        letter.status || "Active",
      ]);

      // Use autoTable to create the table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 100,
        theme: "striped",
        headStyles: {
          fillColor: [128, 0, 128], // Purple color for archive
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        margin: { top: 100 },
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text("ARCHIVED DOCUMENTS - FOR RECORDS PURPOSES ONLY", 105, finalY, {
        align: "center",
      });
      doc.setFontSize(8);
      doc.text(
        `Report generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        14,
        finalY + 10
      );
      doc.text(`Total Records: ${letterArchive.length}`, 190, finalY + 10, {
        align: "right",
      });

      doc.save(
        `Archive_Master_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );

      setNotification({
        show: true,
        type: "success",
        message: `Archive report exported to PDF successfully (${letterArchive.length} letters)`,
      });
    } catch (error) {
      console.error("Error exporting archive to PDF:", error);
      setNotification({
        show: true,
        type: "danger",
        message: "Failed to export archive to PDF",
      });
    }
  };

  // Add archive-specific edit function
  const handleEditArchiveLetter = (letter) => {
    setEditingLetter(letter);
    setShowEditModal(true);
  };

  // Add archive-specific approve function
  const handleApproveArchiveLetter = (letterId) => {
    const currentDate = new Date().toISOString().split("T")[0];

    // Update archive
    const updatedArchive = letterArchive.map((l) =>
      l.id === letterId
        ? {
            ...l,
            status: "approved",
            approvalDate: currentDate,
            digitalSignature: true,
            verificationCode: `VER-${new Date().getFullYear()}-APPROVED`,
          }
        : l
    );
    setLetterArchive(updatedArchive);

    // Also update letterRequests if exists
    const letter = letterArchive.find((l) => l.id === letterId);
    if (letter && letterRequests.length > 0) {
      setLetterRequests((prev) =>
        prev.map((req) =>
          req.employeeId === letter.employeeId &&
          req.templateName === letter.templateName
            ? {
                ...req,
                status: "approved",
                statusColor: "success",
                workflowStatus: "completed",
                approvalDate: currentDate,
                digitalSignature: true,
              }
            : req
        )
      );
    }

    // Also update workflowRequests if exists
    if (letter && workflowRequests.length > 0) {
      setWorkflowRequests((prev) =>
        prev.map((req) =>
          req.employeeId === letter.employeeId &&
          req.templateName === letter.templateName
            ? {
                ...req,
                status: "approved",
                workflowStatus: "completed",
                approvalDate: currentDate,
              }
            : req
        )
      );
    }

    setNotification({
      show: true,
      type: "success",
      message: `Archive letter ${letter.letterId} approved successfully!`,
    });
  };

  const handleGenerateLetter = (letterData) => {
    const newLetter = {
      id: generatedLetters.length + 1,
      letterId: `LTR-${new Date().getFullYear()}-${String(
        generatedLetters.length + 1
      ).padStart(3, "0")}`,
      templateName: letterData.templateName,
      templateType: letterData.templateType,
      employeeName: letterData.employeeName || "Employee Name",
      employeeId:
        letterData.employeeId || "EMP" + Math.floor(Math.random() * 1000),
      employeeEmail: letterData.employeeEmail || "employee@company.com",
      designation: letterData.designation || "Designation",
      department: letterData.department || "Department",
      generatedDate: new Date().toISOString().split("T")[0],
      purpose: letterData.purpose || "General Purpose",
      status: "pending", // Default status
      downloadCount: 0,
      lastAccessed: null,
      fileSize: "~250 KB",
      digitalSignature: true,
      verificationCode: `VER-${new Date().getFullYear()}-${String(
        generatedLetters.length + 1
      ).padStart(3, "0")}`,
      format: "PDF",
      version: "1.0",
      formData: { ...letterData.formData }, // Store all form data
    };

    // Add to generated letters
    setGeneratedLetters((prev) => [...prev, newLetter]);

    // Also add to letterArchive and letterRequests if needed
    const archiveLetter = {
      id: letterArchive.length + 1,
      ...newLetter,
      workflowId: `WF-${new Date().getFullYear()}-${
        generatedLetters.length + 1
      }`,
    };

    const newRequest = {
      id: letterRequests.length + 1,
      requestId: `LTR-REQ-${new Date().getFullYear()}-${String(
        letterRequests.length + 1
      ).padStart(3, "0")}`,
      ...newLetter,
      status: "pending",
      statusColor: "warning",
      workflowStatus: "in_progress",
      approvedBy: [],
      approvalDate: null,
      generatedDate: new Date().toISOString().split("T")[0],
      auditTrail: [
        {
          action: "Letter Generated",
          by: "HR Manager",
          timestamp: new Date().toLocaleString(),
          step: "Generation",
        },
      ],
    };

    setLetterArchive((prev) => [...prev, archiveLetter]);
    setLetterRequests((prev) => [...prev, newRequest]);
    setShowLetterModal(false);
    setSelectedLetter(null);
    setFormData({});

    setNotification({
      show: true,
      type: "success",
      message: `Letter generated successfully! Letter ID: ${newLetter.letterId}`,
    });
  };

  // Handle viewing letter details
  const handleViewLetterDetails = (letter) => {
    setSelectedLetter(letter);
    setShowLetterDetailsCard(true);
  };

  // Handle editing a letter
  const handleEditLetter = (letter) => {
    setEditingLetter(letter);
    setShowEditModal(true);
  };

  // Handle approving a generated letter
  const handleApproveGeneratedLetter = (letterId) => {
    setGeneratedLetters((prev) =>
      prev.map((letter) =>
        letter.id === letterId
          ? {
              ...letter,
              status: "approved",
              approvalDate: new Date().toISOString().split("T")[0],
              approvedBy: ["HR Manager"],
            }
          : letter
      )
    );

    // Also update letterRequests if it exists
    setLetterRequests((prev) =>
      prev.map((req) =>
        req.employeeId === letterId || req.letterId === letterId
          ? {
              ...req,
              status: "approved",
              statusColor: "success",
              workflowStatus: "completed",
              approvedBy: [...req.approvedBy, "HR Manager"],
              approvalDate: new Date().toISOString().split("T")[0],
              auditTrail: [
                ...req.auditTrail,
                {
                  action: "Approved by HR Manager",
                  by: "HR Manager",
                  timestamp: new Date().toLocaleString(),
                  step: "Approval",
                },
              ],
            }
          : req
      )
    );

    setNotification({
      show: true,
      type: "success",
      message: "Letter approved successfully!",
    });
  };

  // Handle AI submission
  const handleAISubmit = () => {
    if (!aiInput.trim() || isAIProcessing) return;

    const userMessage = aiInput.trim();

    // Add user message to chat
    const userChat = {
      type: "user",
      content: userMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setAiChatHistory((prev) => [...prev, userChat]);
    setAiInput("");
    setIsAIProcessing(true);

    // Scroll to bottom
    setTimeout(() => {
      const container = document.getElementById("aiChatContainer");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);

    // Process AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);

      setAiChatHistory((prev) => [...prev, aiResponse]);
      setIsAIProcessing(false);

      // Scroll to bottom after response
      setTimeout(() => {
        const container = document.getElementById("aiChatContainer");
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    }, 1000 + Math.random() * 1000); // Simulate processing time
  };

  // Generate AI response based on user input
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Template suggestions
    if (
      message.includes("template") ||
      message.includes("which") ||
      message.includes("type")
    ) {
      const suggestedTemplate = suggestTemplate(message);
      return {
        type: "ai",
        content: suggestedTemplate,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        actions: ["Use Template", "Show All Templates", "Template Details"],
      };
    }

    // Letter review
    if (
      message.includes("review") ||
      message.includes("check") ||
      message.includes("improve")
    ) {
      return {
        type: "ai",
        content:
          "I can help review your letter. Based on our HR policies, I suggest:\n\n1. Ensure all employee details are accurate\n2. Include digital signature for authenticity\n3. Add verification code for tracking\n4. Follow the standard template structure\n\nWould you like me to analyze a specific letter?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        actions: [
          "Analyze Current Letter",
          "Review Guidelines",
          "Check Compliance",
        ],
      };
    }

    // Workflow help
    if (
      message.includes("workflow") ||
      message.includes("process") ||
      message.includes("approval")
    ) {
      const workflowInfo = getWorkflowInfo();
      return {
        type: "ai",
        content: workflowInfo,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        actions: ["View Workflow", "Check Status", "Approve Now"],
      };
    }

    // Statistics
    if (
      message.includes("stat") ||
      message.includes("data") ||
      message.includes("report")
    ) {
      const stats = getAIStatistics();
      return {
        type: "ai",
        content: stats,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        actions: ["Generate Report", "Export Data", "View Trends"],
      };
    }

    // HR policies
    if (
      message.includes("policy") ||
      message.includes("rule") ||
      message.includes("compliance")
    ) {
      return {
        type: "ai",
        content:
          "Based on HR policies:\n\n• All letters require at least one approval\n• Digital signatures are mandatory for financial letters\n• Verification codes ensure document authenticity\n• Audit trails track all letter activities\n• SLA compliance is monitored automatically",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        actions: [
          "View Policy Docs",
          "Check Compliance",
          "Generate Compliance Report",
        ],
      };
    }

    // Default response
    return {
      type: "ai",
      content:
        "I understand you're asking about HR letters. I can help you with:\n\n• Selecting appropriate templates\n• Reviewing letter content\n• Understanding workflows\n• Generating reports\n• HR policy guidance\n\nCould you please be more specific about what you need help with?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      actions: ["Template Help", "Workflow Help", "Policy Questions"],
    };
  };

  // Quick action handler
  const handleAIQuickAction = (action) => {
    let response;

    switch (action) {
      case "template_suggestion":
        const randomTemplate =
          letterTemplates[Math.floor(Math.random() * letterTemplates.length)];
        response = `Based on common needs, I suggest the **${
          randomTemplate.templateName
        }** template. \n\n**Why this template?**\n• ${
          randomTemplate.description
        }\n• Used ${randomTemplate.usageCount} times\n• Category: ${
          randomTemplate.category
        }\n• Auto-approval: ${randomTemplate.autoApprove ? "Yes" : "No"}`;
        break;

      case "letter_review":
        response =
          "I can review your letter for:\n\n✅ Policy compliance\n✅ Format correctness\n✅ Required fields\n✅ Digital signature\n✅ Verification code\n\nPlease share the letter content or select a letter to review.";
        break;

      case "workflow_help":
        response = `Current workflow status:\n\n• **Active Workflows**: ${
          workflowRequests.filter((r) => r.workflowStatus === "in_progress")
            .length
        }\n• **Pending Approval**: ${
          workflowRequests.filter((r) => r.status === "pending_approval").length
        }\n• **Completed Today**: ${
          workflowRequests.filter(
            (r) =>
              r.workflowStatus === "completed" &&
              r.approvalDate === new Date().toISOString().split("T")[0]
          ).length
        }\n• **Average SLA**: ${calculateAverageSLA()}`;
        break;

      case "statistics":
        response = `**System Statistics:**\n\n• Total Templates: ${statistics.totalTemplates}\n• Total Requests: ${statistics.totalRequests}\n• Approved: ${statistics.approvedRequests}\n• Pending: ${statistics.pendingRequests}\n• AI Optimized: ${statistics.aiOptimized}\n• Digital Signatures: ${statistics.digitalSignatures}`;
        break;

      case "help":
        response =
          "**Available Commands:**\n\n• 'template for promotion' - Get template suggestions\n• 'review my letter' - Letter review and feedback\n• 'workflow status' - Check workflow progress\n• 'generate report' - Create analytics report\n• 'hr policies' - HR policy guidance\n• 'help' - Show this help message";
        break;

      default:
        response = "I'm here to help! What would you like assistance with?";
    }

    const aiResponse = {
      type: "ai",
      content: response,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      actions:
        action === "template_suggestion"
          ? ["Use This Template", "View Details"]
          : ["Learn More", "Take Action"],
    };

    setAiChatHistory((prev) => [...prev, aiResponse]);
  };

  // Clear chat history
  const clearAIChat = () => {
    setAiChatHistory([]);
    setNotification({
      show: true,
      type: "info",
      message: "AI chat history cleared",
    });
  };

  // Handle AI action buttons
  const handleAIAction = (action) => {
    switch (action) {
      case "Use Template":
      case "Use This Template":
        setShowLetterModal(true);
        break;

      case "Show All Templates":
      case "View All Templates":
        setActiveSection("templates");
        setShowAIAssistant(false);
        break;

      case "Generate Report":
        setShowWorkflowReport(true);
        setShowAIAssistant(false);
        break;

      case "View Workflow":
        setActiveSection("workflow");
        setShowAIAssistant(false);
        break;

      case "Export Data":
        setShowExportCard(true);
        setShowAIAssistant(false);
        break;

      default:
        // Default action - show message
        const response = {
          type: "ai",
          content: `Action "${action}" initiated. What would you like to do next?`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setAiChatHistory((prev) => [...prev, response]);
    }
  };

  // Helper functions
  const suggestTemplate = (query) => {
    let suggested = null;

    if (query.includes("promotion")) {
      suggested = letterTemplates.find((t) => t.templateType === "promotion");
    } else if (query.includes("salary") || query.includes("increment")) {
      suggested =
        letterTemplates.find((t) => t.templateType === "salary") ||
        letterTemplates.find((t) => t.templateType === "increment");
    } else if (query.includes("experience") || query.includes("certificate")) {
      suggested = letterTemplates.find((t) => t.templateType === "experience");
    } else if (query.includes("relieving") || query.includes("exit")) {
      suggested = letterTemplates.find((t) => t.templateType === "relieving");
    } else if (query.includes("warning") || query.includes("disciplinary")) {
      suggested = letterTemplates.find((t) => t.templateType === "warning");
    }

    if (suggested) {
      return `I recommend the **${
        suggested.templateName
      }** template.\n\n**Features:**\n• ${suggested.description}\n• Category: ${
        suggested.category
      }\n• Required Approvals: ${suggested.requiredApprovals.join(
        ", "
      )}\n• SLA: ${suggested.sla}\n• Auto-approval: ${
        suggested.autoApprove ? "Yes" : "No"
      }\n\n**Best for:** ${getTemplateBestFor(suggested.templateType)}`;
    }

    return `Based on your query, here are some template suggestions:\n\n1. **Experience Certificate** - For employment verification\n2. **Salary Certificate** - For loan applications\n3. **Promotion Letter** - For career advancements\n4. **Relieving Letter** - For exit formalities\n\nWhich specific type of letter do you need?`;
  };

  const getTemplateBestFor = (templateType) => {
    const bestFor = {
      experience:
        "Employment verification, visa applications, background checks",
      salary: "Bank loans, visa applications, rental agreements",
      promotion: "Career advancement notifications, salary increments",
      relieving: "Exit formalities, employment termination",
      noc: "Permission for external activities, part-time work",
      warning: "Disciplinary actions, policy violations",
      termination: "Employment termination with settlements",
    };

    return bestFor[templateType] || "Various HR purposes";
  };

  const getWorkflowInfo = () => {
    const total = workflowRequests.length;
    const completed = workflowRequests.filter(
      (r) => r.workflowStatus === "completed"
    ).length;
    const inProgress = workflowRequests.filter(
      (r) => r.workflowStatus === "in_progress"
    ).length;
    const pending = workflowRequests.filter(
      (r) => r.status === "pending_approval"
    ).length;

    return `**Workflow Overview:**\n\n• **Total**: ${total} workflows\n• **Completed**: ${completed} (${
      total > 0 ? Math.round((completed / total) * 100) : 0
    }%)\n• **In Progress**: ${inProgress}\n• **Pending Approval**: ${pending}\n• **Completion Rate**: ${calculateCompletionRate()}%\n\n**Recommendation**: ${
      pending > 0
        ? `You have ${pending} requests pending approval. Consider bulk approval.`
        : "All workflows are progressing well."
    }`;
  };

  const getAIStatistics = () => {
    return `**HR Letter System Statistics**\n\n**Templates:**\n• Total: ${statistics.totalTemplates}\n• AI Optimized: ${statistics.aiOptimized}\n• Auto-approve: ${statistics.autoApprove}\n\n**Requests:**\n• Total: ${statistics.totalRequests}\n• Approved: ${statistics.approvedRequests}\n• Pending: ${statistics.pendingRequests}\n• Rejected: ${statistics.rejectedRequests}\n\n**Performance:**\n• Average Processing: ${statistics.avgProcessingTime}\n• Total Downloads: ${statistics.totalDownloads}\n• Digital Signatures: ${statistics.digitalSignatures}`;
  };
  // Handle rejecting a generated letter
  const handleRejectGeneratedLetter = (
    letterId,
    reason = "Rejected by HR Manager"
  ) => {
    setGeneratedLetters((prev) =>
      prev.map((letter) =>
        letter.id === letterId
          ? {
              ...letter,
              status: "rejected",
              rejectionReason: reason,
              rejectionDate: new Date().toISOString().split("T")[0],
            }
          : letter
      )
    );

    // Also update letterRequests if it exists
    setLetterRequests((prev) =>
      prev.map((req) =>
        req.employeeId === letterId || req.letterId === letterId
          ? {
              ...req,
              status: "rejected",
              statusColor: "danger",
              workflowStatus: "terminated",
              rejectionReason: reason,
              auditTrail: [
                ...req.auditTrail,
                {
                  action: "Rejected by HR Manager",
                  by: "HR Manager",
                  timestamp: new Date().toLocaleString(),
                  step: "Rejection",
                  details: `Reason: ${reason}`,
                },
              ],
            }
          : req
      )
    );

    setNotification({
      show: true,
      type: "danger",
      message: "Letter rejected successfully!",
    });
  };

  // Handle deleting a generated letter
  const handleDeleteGeneratedLetter = (letterId) => {
    setGeneratedLetters((prev) =>
      prev.filter((letter) => letter.id !== letterId)
    );

    // Also remove from letterArchive
    setLetterArchive((prev) => prev.filter((letter) => letter.id !== letterId));

    setNotification({
      show: true,
      type: "info",
      message: "Letter deleted successfully!",
    });
  };

  // Handle saving edited letter
  const handleSaveEditedLetter = (updatedLetter) => {
    setGeneratedLetters((prev) =>
      prev.map((letter) =>
        letter.id === updatedLetter.id ? updatedLetter : letter
      )
    );

    // Also update letterArchive if it exists
    setLetterArchive((prev) =>
      prev.map((letter) =>
        letter.id === updatedLetter.id ? updatedLetter : letter
      )
    );

    setShowEditModal(false);
    setEditingLetter(null);

    setNotification({
      show: true,
      type: "success",
      message: "Letter updated successfully!",
    });
  };

  // Update handleApproveRequest function
  const handleApproveRequest = (requestId) => {
    const request = letterRequests.find((r) => r.id === requestId);
    if (!request) return;

    setLetterRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "approved",
              statusColor: "success",
              workflowStatus: "completed",
              approvedBy: [...req.approvedBy, "HR Manager"],
              approvalDate: new Date().toISOString().split("T")[0],
              generatedDate: new Date().toISOString().split("T")[0],
              digitalSignature: true,
              verificationCode: `VER-${new Date().getFullYear()}-${requestId}`,
              auditTrail: [
                ...req.auditTrail,
                {
                  action: "Approved by HR Manager",
                  by: "HR Manager",
                  timestamp: new Date().toLocaleString(),
                  step: "HR Approval",
                },
              ],
            }
          : req
      )
    );

    // Generate the letter and add to archive
    const newLetter = {
      id: letterArchive.length + 1,
      letterId: `LTR-${new Date().getFullYear()}-${String(
        letterArchive.length + 1
      ).padStart(3, "0")}`,
      templateName: request.templateName,
      employeeName: request.employeeName,
      employeeId: request.employeeId,
      employeeEmail: request.employeeEmail,
      generationDate: new Date().toISOString().split("T")[0],
      purpose: request.purpose,
      downloadCount: 0,
      lastAccessed: null,
      fileSize: "~250 KB",
      status: "Active",
      digitalSignature: true,
      verificationCode: `VER-${new Date().getFullYear()}-${String(
        letterArchive.length + 1
      ).padStart(3, "0")}`,
      format: "PDF",
      version: "1.0",
      workflowId: `WF-${new Date().getFullYear()}-${requestId}`,
    };

    setLetterArchive((prev) => [...prev, newLetter]);

    setActionNotification({
      show: true,
      type: "success",
      title: "Request Approved",
      message: `Request ${request.requestId} approved and letter generated! Letter ID: ${newLetter.letterId}`,
    });
  };

  // Update handleRejectRequest function (use card-based rejection)
  const handleRejectRequest = (requestId) => {
    const request = letterRequests.find((r) => r.id === requestId);
    if (!request) return;

    // Show confirmation or directly reject
    if (
      window.confirm(
        `Are you sure you want to reject request ${request.requestId}?`
      )
    ) {
      setLetterRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "rejected",
                statusColor: "danger",
                workflowStatus: "terminated",
                rejectionReason: "Rejected by HR Manager",
                auditTrail: [
                  ...req.auditTrail,
                  {
                    action: "Rejected by HR Manager",
                    by: "HR Manager",
                    timestamp: new Date().toLocaleString(),
                    step: "Rejection",
                  },
                ],
              }
            : req
        )
      );

      // Also update workflowRequests if they exist
      if (workflowRequests.length > 0) {
        setWorkflowRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status: "rejected",
                  workflowStatus: "terminated",
                  rejectionReason: "Rejected by HR Manager",
                  auditTrail: [
                    ...req.auditTrail,
                    {
                      action: "Rejected by HR Manager",
                      by: "HR Manager",
                      timestamp: new Date().toLocaleString(),
                      step: "Rejection",
                    },
                  ],
                }
              : req
          )
        );
      }

      // Show notification
      setNotification({
        show: true,
        type: "danger",
        message: `Request ${request.requestId} has been rejected.`,
      });
    }
  };

  const handleViewAuditTrail = (request) => {
    setSelectedAuditRequest(request);
    setSelectedAuditTrail(request.auditTrail || []);
    setShowAuditTrailModal(true);
  };

  // Handle workflow approval
  const handleWorkflowApproval = (requestId) => {
    const request = workflowRequests.find((r) => r.id === requestId);
    if (!request) return;

    const template = letterTemplates.find(
      (t) => t.templateType === request.templateType
    );
    const currentStepIndex =
      template?.workflowSteps?.findIndex(
        (step) => step === request.currentStep
      ) || 0;
    const totalSteps = template?.workflowSteps?.length || 0;

    if (currentStepIndex < totalSteps - 1) {
      // Move to next step
      const nextStep =
        template?.workflowSteps?.[currentStepIndex + 1] || "Next Step";

      setWorkflowRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                currentStep: nextStep,
                approvedBy: [...req.approvedBy, "HR Manager"],
                auditTrail: [
                  ...req.auditTrail,
                  {
                    action: `Step Approved: ${req.currentStep}`,
                    by: "HR Manager",
                    timestamp: new Date().toLocaleString(),
                    step: nextStep,
                  },
                ],
              }
            : req
        )
      );

      setNotification({
        show: true,
        type: "success",
        message: `Approved! Moved to: ${nextStep}`,
      });
    } else {
      // Complete workflow
      setWorkflowRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "approved",
                workflowStatus: "completed",
                currentStep: "Completed",
                approvedBy: [...req.approvedBy, "HR Manager"],
                approvalDate: new Date().toISOString().split("T")[0],
                auditTrail: [
                  ...req.auditTrail,
                  {
                    action: "Workflow Completed",
                    by: "HR Manager",
                    timestamp: new Date().toLocaleString(),
                    step: "Completion",
                  },
                ],
              }
            : req
        )
      );

      setNotification({
        show: true,
        type: "success",
        message: "Workflow completed successfully!",
      });
    }
  };

  // Handle advancing workflow
  const handleAdvanceWorkflow = (requestId) => {
    const request = workflowRequests.find((r) => r.id === requestId);
    if (!request) return;

    const template = letterTemplates.find(
      (t) => t.templateType === request.templateType
    );
    const currentStepIndex =
      template?.workflowSteps?.findIndex(
        (step) => step === request.currentStep
      ) || 0;
    const totalSteps = template?.workflowSteps?.length || 0;

    if (currentStepIndex < totalSteps - 1) {
      const nextStep =
        template?.workflowSteps?.[currentStepIndex + 1] || "Next Step";

      setWorkflowRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                currentStep: nextStep,
                auditTrail: [
                  ...req.auditTrail,
                  {
                    action: `Advanced to: ${nextStep}`,
                    by: "HR Manager",
                    timestamp: new Date().toLocaleString(),
                    step: nextStep,
                  },
                ],
              }
            : req
        )
      );

      setNotification({
        show: true,
        type: "success",
        message: `Advanced to: ${nextStep}`,
      });
    }
  };

  // Simulate employee request
  const simulateEmployeeRequest = () => {
    const employees = [
      "RAJESH KUMAR",
      "ANITA DESAI",
      "SANJAY VERMA",
      "ROHAN MEHTA",
    ];
    const purposes = [
      "Promotion Letter",
      "Salary Certificate",
      "Experience Letter",
      "Transfer Letter",
    ];
    const employee = employees[Math.floor(Math.random() * employees.length)];
    const purpose = purposes[Math.floor(Math.random() * purposes.length)];
    const template =
      letterTemplates.find((t) => t.templateType === "experience") ||
      letterTemplates[0];

    const newRequest = {
      id: workflowRequests.length + 1,
      requestId: `LTR-REQ-${new Date().getFullYear()}-${String(
        workflowRequests.length + 1
      ).padStart(3, "0")}`,
      employeeId: `EMP${String(workflowRequests.length + 100).padStart(
        3,
        "0"
      )}`,
      employeeName: employee,
      employeeEmail: `${employee.toLowerCase().replace(" ", ".")}@company.com`,
      templateType: template.templateType,
      templateName: template.templateName,
      requestDate: new Date().toISOString().split("T")[0],
      purpose: purpose,
      priority: "Medium",
      status: "pending_approval",
      workflowStatus: "in_progress",
      currentStep: "Request Submission",
      approvedBy: [],
      approvalDate: null,
      generatedDate: null,
      downloadDate: null,
      downloadCount: 0,
      digitalSignature: true,
      verificationCode: null,
      autoApproved: false,
      hrArchived: false,
      auditTrail: [
        {
          action: "Employee Request Submitted",
          by: employee,
          timestamp: new Date().toLocaleString(),
          step: "Request Submission",
          details: `Simulated request for ${purpose}`,
        },
      ],
    };

    setWorkflowRequests((prev) => [...prev, newRequest]);

    setNotification({
      show: true,
      type: "success",
      message: `Employee request simulated! Request ID: ${newRequest.requestId}`,
    });
  };

  // Handle viewing workflow details
  const handleViewWorkflowDetails = (requestId) => {
    const request = workflowRequests.find((r) => r.id === requestId);
    if (!request) return;
    setSelectedWorkflow(request);
    setShowWorkflowDetails(true);
  };

  // Save workflow configuration
  const saveWorkflowConfig = () => {
    setNotification({
      show: true,
      type: "success",
      message: "Workflow configuration saved successfully!",
    });
  };

  // Save SLA settings
  const saveSLASettings = () => {
    const highSLA = slaHighRef.current?.value || "4";
    const mediumSLA = slaMediumRef.current?.value || "24";
    const lowSLA = slaLowRef.current?.value || "72";

    setNotification({
      show: true,
      type: "success",
      message: `SLA settings updated: High: ${highSLA} hours, Medium: ${mediumSLA} hours, Low: ${lowSLA} hours`,
    });
  };
  // Handle template auto-approve toggle
  const handleTemplateAutoApprove = (templateId, enabled) => {
    setLetterTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, autoApprove: enabled }
          : template
      )
    );
  };

  // Helper functions
  const confirmBulkApprove = () => {
    const pendingRequests = workflowRequests.filter(
      (req) => req.status === "pending_approval"
    );

    const updatedRequests = workflowRequests.map((req) => {
      if (req.status === "pending_approval") {
        return {
          ...req,
          status: "approved",
          workflowStatus: "completed",
          approvedBy: [...req.approvedBy, "HR Manager"],
          approvalDate: new Date().toISOString().split("T")[0],
          auditTrail: [
            ...req.auditTrail,
            {
              action: "Bulk Approved",
              by: "HR Manager",
              timestamp: new Date().toLocaleString(),
              step: "Bulk Approval",
            },
          ],
        };
      }
      return req;
    });

    setWorkflowRequests(updatedRequests);
    setShowBulkApproveConfirm(false);

    setNotification({
      show: true,
      type: "success",
      message: `Successfully approved ${pendingRequests.length} pending requests`,
    });
  };

  const handleConfirmRejection = () => {
    if (!rejectionReason.trim() || !selectedRequestToReject) {
      setNotification({
        show: true,
        type: "warning",
        message: "Please enter a rejection reason before confirming.",
      });
      return;
    }

    // Update workflowRequests
    setWorkflowRequests((prev) =>
      prev.map((req) =>
        req.id === selectedRequestToReject.id
          ? {
              ...req,
              status: "rejected",
              workflowStatus: "terminated",
              rejectionReason: rejectionReason,
              auditTrail: [
                ...req.auditTrail,
                {
                  action: "Workflow Rejected",
                  by: "HR Manager",
                  timestamp: new Date().toLocaleString(),
                  step: "Rejection",
                  details: `Reason: ${rejectionReason}`,
                },
              ],
            }
          : req
      )
    );

    setNotification({
      show: true,
      type: "success",
      message: `Request ${selectedRequestToReject.requestId} has been rejected.`,
    });

    // Reset states
    setShowRejectReasonCard(false);
    setSelectedRequestToReject(null);
    setRejectionReason("");
  };

  // Calculate average SLA
  const calculateAverageSLA = () => {
    const templates = workflowRequests
      .map((req) =>
        letterTemplates.find((t) => t.templateType === req.templateType)
      )
      .filter((t) => t);

    if (templates.length === 0) return "N/A";

    const totalHours = templates.reduce((sum, t) => {
      const sla = t.sla || "24 hours";
      const hours = parseInt(sla) * (sla.includes("day") ? 24 : 1);
      return sum + hours;
    }, 0);

    return `${Math.round(totalHours / templates.length)} hours`;
  };

  const calculateCompletionRate = () => {
    if (workflowRequests.length === 0) return 0;
    const completed = workflowRequests.filter(
      (r) => r.workflowStatus === "completed"
    ).length;
    return Math.round((completed / workflowRequests.length) * 100);
  };
  // Create workflow
  const handleCreateWorkflow = () => {
    if (!newWorkflowTemplate || !newWorkflowPurpose || !newWorkflowEmployee) {
      setNotification({
        show: true,
        type: "warning",
        message: "Please select an employee, template, and enter a purpose",
      });
      return;
    }

    const template = letterTemplates.find(
      (t) => t.templateType === newWorkflowTemplate
    );

    const newWorkflow = {
      id: workflowRequests.length + 1,
      requestId: `LTR-REQ-${new Date().getFullYear()}-${String(
        workflowRequests.length + 1
      ).padStart(3, "0")}`,
      employeeId: newWorkflowEmployee,
      employeeName: newWorkflowEmployeeName,
      employeeEmail: newWorkflowEmployeeEmail,
      designation: newWorkflowDesignation,
      department: newWorkflowDepartment,
      templateType: template.templateType,
      templateName: template.templateName,
      requestDate: new Date().toISOString().split("T")[0],
      purpose: newWorkflowPurpose,
      priority: newWorkflowPriority,
      status: "pending_approval",
      workflowStatus: "in_progress",
      currentStep: template.workflowSteps[0] || "Request Submission",
      approvedBy: [],
      approvalDate: null,
      generatedDate: null,
      downloadDate: null,
      downloadCount: 0,
      digitalSignature: true,
      verificationCode: null,
      autoApproved: template.autoApprove,
      hrArchived: false,
      auditTrail: [
        {
          action: "Workflow Created by HR Manager",
          by: "HR Manager",
          timestamp: new Date().toLocaleString(),
          step: "Creation",
          details: `Priority: ${newWorkflowPriority}`,
        },
      ],
    };

    setWorkflowRequests((prev) => [...prev, newWorkflow]);
    setShowRequestModal(false);

    // Reset form
    setNewWorkflowTemplate("");
    setNewWorkflowPriority("Medium");
    setNewWorkflowPurpose("");
    setNewWorkflowEmployee("");
    setNewWorkflowEmployeeName("");
    setNewWorkflowDesignation("");
    setNewWorkflowDepartment("");
    setNewWorkflowEmployeeEmail("");

    setNotification({
      show: true,
      type: "success",
      message: `New workflow created for ${newWorkflowEmployeeName}! Request ID: ${newWorkflow.requestId}`,
    });
  };

  // Filter templates based on search term
  const filteredTemplates = letterTemplates.filter((template) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.templateType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Active filters
    const matchesFilters =
      (!activeFilters.templateType ||
        template.templateType === activeFilters.templateType) &&
      (!activeFilters.status || template.status === activeFilters.status);

    return matchesSearch && matchesFilters;
  });

  // Filter requests based on search term
  const filteredRequests = letterRequests.filter((request) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    // Active filters
    const matchesFilters =
      (!activeFilters.status || request.status === activeFilters.status) &&
      (!activeFilters.priority ||
        request.priority === activeFilters.priority) &&
      (!activeFilters.templateType ||
        request.templateType === activeFilters.templateType) &&
      (!activeFilters.department ||
        request.department === activeFilters.department) &&
      (!activeFilters.employeeId ||
        request.employeeId === activeFilters.employeeId) &&
      (!activeFilters.startDate ||
        new Date(request.requestDate) >= new Date(activeFilters.startDate)) &&
      (!activeFilters.endDate ||
        new Date(request.requestDate) <= new Date(activeFilters.endDate));

    return matchesSearch && matchesFilters;
  });

  // Filter archive based on search term
  const filteredArchive = letterArchive.filter((letter) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      letter.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.letterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    // Active filters
    const matchesFilters =
      (!activeFilters.status || letter.status === activeFilters.status) &&
      (!activeFilters.templateType ||
        letter.templateName === activeFilters.templateType) &&
      (!activeFilters.department ||
        letter.department === activeFilters.department) &&
      (!activeFilters.employeeId ||
        letter.employeeId === activeFilters.employeeId) &&
      (!activeFilters.startDate ||
        new Date(letter.generationDate) >= new Date(activeFilters.startDate)) &&
      (!activeFilters.endDate ||
        new Date(letter.generationDate) <= new Date(activeFilters.endDate));

    return matchesSearch && matchesFilters;
  });

  // Update workflow filtering logic
  const filteredWorkflows = workflowRequests.filter((request) => {
    // Apply view filter
    if (workflowView === "active" && request.workflowStatus !== "in_progress")
      return false;
    if (workflowView === "pending" && request.status !== "pending_approval")
      return false;
    if (workflowView === "completed" && request.workflowStatus !== "completed")
      return false;

    // Search term filter
    const matchesSearch =
      !workflowFilter.search ||
      request.requestId
        .toLowerCase()
        .includes(workflowFilter.search.toLowerCase()) ||
      request.employeeName
        .toLowerCase()
        .includes(workflowFilter.search.toLowerCase()) ||
      request.employeeId
        .toLowerCase()
        .includes(workflowFilter.search.toLowerCase()) ||
      request.templateName
        .toLowerCase()
        .includes(workflowFilter.search.toLowerCase());

    // Active filters
    const matchesFilters =
      (!activeFilters.templateType ||
        request.templateType === activeFilters.templateType) &&
      (!activeFilters.priority ||
        request.priority === activeFilters.priority) &&
      (!activeFilters.status || request.status === activeFilters.status) &&
      (!activeFilters.department ||
        request.department === activeFilters.department) &&
      (!activeFilters.employeeId ||
        request.employeeId === activeFilters.employeeId) &&
      (!activeFilters.startDate ||
        new Date(request.requestDate) >= new Date(activeFilters.startDate)) &&
      (!activeFilters.endDate ||
        new Date(request.requestDate) <= new Date(activeFilters.endDate));

    return matchesSearch && matchesFilters;
  });
  // Employee Portal View
  const EmployeePortal = () => {
    const [employeeView, setEmployeeView] = useState("myRequests");

    // Get all unique employees from letterRequests and workflowRequests
    const getAllEmployees = () => {
      const employeesMap = new Map();

      // Get employees from letterRequests
      letterRequests.forEach((request) => {
        if (!employeesMap.has(request.employeeId)) {
          employeesMap.set(request.employeeId, {
            id: request.employeeId,
            name: request.employeeName,
            email: request.employeeEmail,
            department: request.department || "Engineering",
            designation: request.designation || "Senior Developer",
            lastPromoted: request.lastPromoted || "2023-06-15",
          });
        }
      });

      // Get employees from workflowRequests
      workflowRequests.forEach((request) => {
        if (!employeesMap.has(request.employeeId)) {
          employeesMap.set(request.employeeId, {
            id: request.employeeId,
            name: request.employeeName,
            email: request.employeeEmail,
            department: request.department || "Engineering",
            designation: request.designation || "Senior Developer",
            lastPromoted: request.lastPromoted || "2023-06-15",
          });
        }
      });

      // Convert map to array and sort by employee ID
      const employees = Array.from(employeesMap.values());
      employees.sort((a, b) => a.id.localeCompare(b.id));

      return employees;
    };

    const allEmployees = getAllEmployees();

    // Initialize selectedEmployee from allEmployees or use first one
    const [selectedEmployee, setSelectedEmployee] = useState(() => {
      // Try to get from localStorage first (for persistence)
      const savedEmployeeId = localStorage.getItem("selectedEmployeeId");
      if (savedEmployeeId) {
        const savedEmployee = allEmployees.find(
          (emp) => emp.id === savedEmployeeId
        );
        if (savedEmployee) return savedEmployee;
      }

      // Otherwise use first employee
      return allEmployees.length > 0
        ? allEmployees[0]
        : {
            id: "EMP001",
            name: "RAHUL SHARMA",
            email: "rahul.sharma@company.com",
            department: "Engineering",
            designation: "Senior Developer",
            lastPromoted: "2023-06-15",
          };
    });

    // Save selected employee to localStorage whenever it changes
    useEffect(() => {
      if (selectedEmployee && selectedEmployee.id) {
        localStorage.setItem("selectedEmployeeId", selectedEmployee.id);
      }
    }, [selectedEmployee]);

    // State for Employee Portal specific features
    const [showEditRequestCard, setShowEditRequestCard] = useState(false);
    const [showDeleteConfirmCard, setShowDeleteConfirmCard] = useState(false);
    const [selectedRequestForEdit, setSelectedRequestForEdit] = useState(null);
    const [selectedRequestForDelete, setSelectedRequestForDelete] =
      useState(null);
    const [editingRequestData, setEditingRequestData] = useState({});
    const [notification, setNotification] = useState({
      show: false,
      type: "",
      message: "",
    });

    // Handle viewing request details
    const handleViewRequestDetails = (request) => {
      setSelectedAuditRequest(request);
      setSelectedAuditTrail(request.auditTrail || []);
      setShowAuditTrailModal(true);
    };

    // Handle editing request
    const handleEditRequest = (request) => {
      setSelectedRequestForEdit(request);
      setEditingRequestData({
        purpose: request.purpose,
        priority: request.priority,
        designation: request.designation || selectedEmployee.designation,
        department: request.department || selectedEmployee.department,
      });
      setShowEditRequestCard(true);
    };

    // Handle saving edited request - FIXED: Maintain selected employee
    const handleSaveEditedRequest = () => {
      if (!selectedRequestForEdit) return;

      const updatedLetterRequests = letterRequests.map((req) =>
        req.id === selectedRequestForEdit.id
          ? {
              ...req,
              ...editingRequestData,
              auditTrail: [
                ...req.auditTrail,
                {
                  action: "Request Updated by Employee",
                  by: selectedEmployee.name,
                  timestamp: new Date().toLocaleString(),
                  step: "Update",
                  details: `Changed purpose to: ${editingRequestData.purpose}, priority to: ${editingRequestData.priority}`,
                },
              ],
            }
          : req
      );

      setLetterRequests(updatedLetterRequests);

      setNotification({
        show: true,
        type: "success",
        message: `Request ${selectedRequestForEdit.requestId} updated successfully`,
      });

      setShowEditRequestCard(false);
      setSelectedRequestForEdit(null);
      setEditingRequestData({});
    };

    // Handle deleting request - FIXED: Maintain selected employee
    const handleDeleteRequest = (request) => {
      setSelectedRequestForDelete(request);
      setShowDeleteConfirmCard(true);
    };

    // Handle confirm delete - FIXED: Maintain selected employee
    const handleConfirmDelete = () => {
      if (!selectedRequestForDelete) return;

      const updatedLetterRequests = letterRequests.filter(
        (req) => req.id !== selectedRequestForDelete.id
      );
      setLetterRequests(updatedLetterRequests);

      // Also remove from workflowRequests if exists
      if (workflowRequests.length > 0) {
        const updatedWorkflowRequests = workflowRequests.filter(
          (req) => req.id !== selectedRequestForDelete.id
        );
        setWorkflowRequests(updatedWorkflowRequests);
      }

      setNotification({
        show: true,
        type: "info",
        message: `Request ${selectedRequestForDelete.requestId} deleted successfully`,
      });

      setShowDeleteConfirmCard(false);
      setSelectedRequestForDelete(null);
    };

    // Handle employee switching - FIXED: Properly update selected employee
    const handleEmployeeChange = (employeeId) => {
      const employee = allEmployees.find((emp) => emp.id === employeeId);
      if (employee) {
        setSelectedEmployee(employee);

        setNotification({
          show: true,
          type: "info",
          message: `Switched to employee: ${employee.name}`,
        });
      }
    };

    return (
      <div className="row g-3">
        <div className="col-12">
          {/* Notification Card */}
          {notification.show && (
            <div className={`card border-${notification.type} mb-3`}>
              <div
                className={`card-header bg-${notification.type} text-white d-flex justify-content-between align-items-center`}
              >
                <div className="d-flex align-items-center">
                  {notification.type === "success" && (
                    <CheckCircle className="me-2" size={20} />
                  )}
                  {notification.type === "warning" && (
                    <AlertTriangle className="me-2" size={20} />
                  )}
                  {notification.type === "info" && (
                    <Info className="me-2" size={20} />
                  )}
                  {notification.type === "danger" && (
                    <XCircle className="me-2" size={20} />
                  )}
                  <h6 className="fw-bold mb-0">
                    {notification.type === "success"
                      ? "Success"
                      : notification.type === "warning"
                      ? "Warning"
                      : notification.type === "danger"
                      ? "Error"
                      : "Information"}
                  </h6>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setNotification({ ...notification, show: false })
                  }
                ></button>
              </div>
              <div className="card-body">
                <p className="mb-0">{notification.message}</p>
              </div>
            </div>
          )}

          {/* Edit Request Card */}
          {showEditRequestCard && selectedRequestForEdit && (
            <div className="card border-warning mb-4 shadow">
              <div className="card-header bg-warning text-white d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Edit className="me-2" size={20} />
                  <h6 className="fw-bold mb-0">
                    Edit Request: {selectedRequestForEdit.requestId}
                  </h6>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowEditRequestCard(false);
                    setSelectedRequestForEdit(null);
                    setEditingRequestData({});
                  }}
                ></button>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Purpose</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editingRequestData.purpose || ""}
                        onChange={(e) =>
                          setEditingRequestData({
                            ...editingRequestData,
                            purpose: e.target.value,
                          })
                        }
                        placeholder="Enter request purpose"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={editingRequestData.priority || "Medium"}
                        onChange={(e) =>
                          setEditingRequestData({
                            ...editingRequestData,
                            priority: e.target.value,
                          })
                        }
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingRequestData.designation || ""}
                        onChange={(e) =>
                          setEditingRequestData({
                            ...editingRequestData,
                            designation: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingRequestData.department || ""}
                        onChange={(e) =>
                          setEditingRequestData({
                            ...editingRequestData,
                            department: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowEditRequestCard(false);
                      setSelectedRequestForEdit(null);
                      setEditingRequestData({});
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-warning text-white"
                    onClick={handleSaveEditedRequest}
                  >
                    <Save className="me-2" size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Card */}
          {showDeleteConfirmCard && selectedRequestForDelete && (
            <div className="card border-danger mb-4 shadow">
              <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Trash2 className="me-2" size={20} />
                  <h6 className="fw-bold mb-0">Confirm Deletion</h6>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowDeleteConfirmCard(false);
                    setSelectedRequestForDelete(null);
                  }}
                ></button>
              </div>
              <div className="card-body">
                <div className="alert alert-warning mb-4">
                  <AlertTriangle className="me-2" size={20} />
                  <strong>Warning:</strong> This action cannot be undone. The
                  request will be permanently deleted.
                </div>

                <div className="card border mb-4">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Request to Delete</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <small className="text-muted d-block">Request ID</small>
                        <span className="fw-bold">
                          {selectedRequestForDelete.requestId}
                        </span>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block">
                          Letter Type
                        </small>
                        <span className="fw-bold">
                          {selectedRequestForDelete.templateName}
                        </span>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <small className="text-muted d-block">Status</small>
                        <span>
                          {getStatusBadge(selectedRequestForDelete.status)}
                        </span>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block">
                          Request Date
                        </small>
                        <span>
                          {formatDate(selectedRequestForDelete.requestDate)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <small className="text-muted d-block">Purpose</small>
                      <p className="mb-0">{selectedRequestForDelete.purpose}</p>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowDeleteConfirmCard(false);
                      setSelectedRequestForDelete(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleConfirmDelete}
                  >
                    <Trash2 className="me-2" size={16} />
                    Delete Request
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-0">Employee Portal</h6>
                  <small className="text-muted">
                    Employee self-service for letter requests
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setNotification({
                        show: true,
                        type: "info",
                        message: `Employee Profile: ${selectedEmployee.name} | ${selectedEmployee.designation} | ${selectedEmployee.department}`,
                      });
                    }}
                  >
                    <User size={14} className="me-1" />
                    Profile
                  </button>
                  <button
                    className="btn btn-outline-info btn-sm"
                    onClick={() => {
                      // Export employee data as PDF
                      downloadEmployeeDataPDF(selectedEmployee);
                    }}
                  >
                    <File size={14} className="me-1" />
                    Export PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Employee Selection - Compact Size */}
              <div className="mb-4">
                <div className="row">
                  <div className="col-12">
                    <label className="form-label fw-bold mb-2 small">
                      Select Employee
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">
                        <User size={14} />
                      </span>
                      <select
                        className="form-select form-select-sm"
                        value={selectedEmployee.id}
                        onChange={(e) => handleEmployeeChange(e.target.value)}
                      >
                        {allEmployees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} ({employee.id}) -{" "}
                            {employee.department}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Profile Stats - Compact Layout */}
              <div className="mb-4">
                <div className="d-flex flex-nowrap gap-1 overflow-auto pb-2">
                  <button
                    className={`btn btn-sm d-flex align-items-center flex-shrink-0 ${
                      employeeView === "myRequests"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setEmployeeView("myRequests")}
                  >
                    <FileText size={14} className="me-1" />
                    <span className="d-none d-sm-inline">My Requests</span>
                    <span className="d-sm-none">My Requests</span>
                    <span className="badge bg-secondary ms-1">
                      {
                        letterRequests.filter(
                          (r) => r.employeeId === selectedEmployee.id
                        ).length
                      }
                    </span>
                  </button>
                  <button
                    className={`btn btn-sm d-flex align-items-center flex-shrink-0 ${
                      employeeView === "requestLetter"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setEmployeeView("requestLetter")}
                  >
                    <Plus size={14} className="me-1" />
                    <span className="d-none d-sm-inline">New Request</span>
                    <span className="d-sm-none">New Request</span>
                  </button>
                  <button
                    className={`btn btn-sm d-flex align-items-center flex-shrink-0 ${
                      employeeView === "downloads"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setEmployeeView("downloads")}
                  >
                    <Download size={14} className="me-1" />
                    <span className="d-none d-sm-inline">Downloads</span>
                    <span className="d-sm-none">Downloads</span>
                    <span className="badge bg-secondary ms-1">
                      {
                        letterArchive.filter(
                          (l) => l.employeeId === selectedEmployee.id
                        ).length
                      }
                    </span>
                  </button>
                </div>
              </div>

              {/* My Requests View */}
              {employeeView === "myRequests" && (
                <>
                  {letterRequests.filter(
                    (r) => r.employeeId === selectedEmployee.id
                  ).length === 0 ? (
                    <div className="text-center py-4">
                      <FileText size={32} className="text-muted mb-2" />
                      <h6 className="text-muted">No requests found</h6>
                      <p className="text-muted small mb-0">
                        Click "Request New" to create your first request
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th className="min-width-100">Request ID</th>
                            <th className="d-none d-md-table-cell min-width-120">
                              Letter Type
                            </th>
                            <th className="min-width-80">Date</th>
                            <th className="min-width-100">Purpose</th>
                            <th className="min-width-80">Status</th>
                            <th className="min-width-200">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {letterRequests
                            .filter((r) => r.employeeId === selectedEmployee.id)
                            .map((request) => (
                              <tr key={request.id}>
                                <td className="small text-truncate">
                                  {request.requestId}
                                  <small className="text-muted d-block d-md-none">
                                    {request.templateName}
                                  </small>
                                </td>
                                <td className="d-none d-md-table-cell text-truncate small">
                                  {request.templateName}
                                </td>
                                <td className="small">
                                  {formatDate(request.requestDate)}
                                </td>
                                <td>
                                  <div
                                    className="text-truncate small"
                                    title={request.purpose}
                                  >
                                    {request.purpose}
                                  </div>
                                </td>
                                <td>{getStatusBadge(request.status)}</td>
                                <td>
                                  <div className="btn-group btn-group-sm">
                                    {/* View Button */}
                                    <button
                                      className="btn btn-outline-info btn-icon"
                                      onClick={() =>
                                        handleViewRequestDetails(request)
                                      }
                                      title="View Details"
                                    >
                                      <Eye size={12} />
                                    </button>

                                    {/* PDF Download Button (only for approved) */}
                                    {request.status === "approved" && (
                                      <button
                                        className="btn btn-outline-success btn-icon"
                                        onClick={() => {
                                          const archiveLetter =
                                            letterArchive.find(
                                              (l) =>
                                                l.employeeId ===
                                                  request.employeeId &&
                                                l.templateName ===
                                                  request.templateName
                                            );
                                          if (archiveLetter) {
                                            downloadEmployeeLetterPDF(
                                              archiveLetter
                                            );
                                          } else {
                                            setNotification({
                                              show: true,
                                              type: "warning",
                                              message:
                                                "Letter not found in archive. Please contact HR.",
                                            });
                                          }
                                        }}
                                        title="Download as PDF"
                                      >
                                        <Download size={12} />
                                      </button>
                                    )}

                                    {/* Edit Button (only for pending) */}
                                    {request.status === "pending" && (
                                      <button
                                        className="btn btn-outline-warning btn-icon"
                                        onClick={() =>
                                          handleEditRequest(request)
                                        }
                                        title="Edit Request"
                                      >
                                        <Edit size={12} />
                                      </button>
                                    )}

                                    {/* Delete Button (only for pending) */}
                                    {request.status === "pending" && (
                                      <button
                                        className="btn btn-outline-danger btn-icon"
                                        onClick={() =>
                                          handleDeleteRequest(request)
                                        }
                                        title="Delete Request"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* Request New Letter View */}
              {employeeView === "requestLetter" && (
                <div className="row g-2">
                  {letterTemplates.map((template) => (
                    <div key={template.id} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100 hover-lift">
                        <div className="card-body d-flex flex-column p-3">
                          <div className="d-flex align-items-start mb-2">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-2">
                              {getIconComponent(template.icon)}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1 small">
                                {template.templateName}
                              </h6>
                              <small className="text-muted d-block text-truncate-2 x-small">
                                {template.description}
                              </small>
                            </div>
                          </div>

                          <div className="mb-2">
                            <span className="badge bg-info me-1 small">
                              {template.category}
                            </span>
                            {template.autoApprove && (
                              <span className="badge bg-success me-1 small">
                                Auto
                              </span>
                            )}
                            <span className="badge bg-light text-dark small">
                              SLA: {template.sla}
                            </span>
                          </div>

                          <div className="mt-auto">
                            <button
                              className="btn btn-primary btn-sm w-100"
                              onClick={() => {
                                // Get only this employee's requests
                                const employeeRequests = letterRequests.filter(
                                  (r) => r.employeeId === selectedEmployee.id
                                );

                                // Create new request for current employee only
                                const newRequest = {
                                  id:
                                    letterRequests.length > 0
                                      ? Math.max(
                                          ...letterRequests.map((r) => r.id)
                                        ) + 1
                                      : 1,
                                  requestId: `LTR-REQ-${new Date().getFullYear()}-${String(
                                    employeeRequests.length + 1
                                  ).padStart(3, "0")}`,
                                  employeeId: selectedEmployee.id,
                                  employeeName: selectedEmployee.name,
                                  employeeEmail: selectedEmployee.email,
                                  designation: selectedEmployee.designation,
                                  department: selectedEmployee.department,
                                  lastPromoted: selectedEmployee.lastPromoted,
                                  templateType: template.templateType,
                                  templateName: template.templateName,
                                  requestDate: new Date()
                                    .toISOString()
                                    .split("T")[0],
                                  purpose: "Employee Request",
                                  priority: "Medium",
                                  status: template.autoApprove
                                    ? "approved"
                                    : "pending",
                                  statusColor: template.autoApprove
                                    ? "success"
                                    : "warning",
                                  workflowStatus: template.autoApprove
                                    ? "completed"
                                    : "in_progress",
                                  approvedBy: [],
                                  approvalDate: null,
                                  generatedDate: null,
                                  downloadDate: null,
                                  downloadCount: 0,
                                  digitalSignature: true,
                                  verificationCode: `VER-${new Date().getFullYear()}-${String(
                                    employeeRequests.length + 1
                                  ).padStart(3, "0")}`,
                                  auditTrail: [
                                    {
                                      action: "Employee Request Submitted",
                                      by: selectedEmployee.name,
                                      timestamp: new Date().toLocaleString(),
                                      step: "Request Submission",
                                    },
                                  ],
                                };

                                // Add request (only affects current employee's view)
                                setLetterRequests((prev) => [
                                  ...prev,
                                  newRequest,
                                ]);

                                // Show success message for current employee
                                setNotification({
                                  show: true,
                                  type: "success",
                                  message: `${selectedEmployee.name}'s request submitted! ID: ${newRequest.requestId}`,
                                });
                              }}
                            >
                              <FileText size={12} className="me-1" />
                              Request Letter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Downloads View */}
              {employeeView === "downloads" && (
                <>
                  {letterArchive.filter(
                    (l) => l.employeeId === selectedEmployee.id
                  ).length === 0 ? (
                    <div className="text-center py-4">
                      <Download size={32} className="text-muted mb-2" />
                      <h6 className="text-muted">No downloads available</h6>
                      <p className="text-muted small mb-0">
                        Download letters after they are approved
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th className="min-width-100">Letter ID</th>
                            <th className="d-none d-md-table-cell min-width-120">
                              Letter Type
                            </th>
                            <th className="min-width-80">Generated</th>
                            <th className="min-width-60">DLs</th>
                            <th className="min-width-150">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {letterArchive
                            .filter((l) => l.employeeId === selectedEmployee.id)
                            .map((letter) => (
                              <tr key={letter.id}>
                                <td className="small text-truncate">
                                  {letter.letterId}
                                </td>
                                <td className="d-none d-md-table-cell text-truncate small">
                                  {letter.templateName}
                                </td>
                                <td className="small">
                                  {formatDate(letter.generationDate)}
                                </td>
                                <td>
                                  <span className="fw-medium">
                                    {letter.downloadCount}
                                  </span>
                                </td>
                                <td>
                                  <div className="btn-group btn-group-sm">
                                    {/* PDF Download Button */}
                                    <button
                                      className="btn btn-primary btn-icon"
                                      onClick={() =>
                                        downloadEmployeeLetterPDF(letter)
                                      }
                                      title="Download as PDF"
                                    >
                                      <Download size={12} />
                                    </button>

                                    <button
                                      className="btn btn-outline-info btn-icon"
                                      onClick={() => {
                                        setSelectedLetter(letter);
                                        setShowLetterDetailsCard(true);
                                      }}
                                      title="View Details"
                                    >
                                      <Eye size={12} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Letter Generator Modal
  const LetterGeneratorModal = () => {
    const [formData, setFormData] = useState({});
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
      if (selectedLetter) {
        const template = letterTemplates.find(
          (t) => t.id === selectedLetter.id
        );
        if (template) {
          setSelectedTemplate(template);
          const initialData = {};
          template.defaultFields.forEach((field) => {
            initialData[field.name] = field.type === "checkbox" ? false : "";
          });
          setFormData(initialData);
        }
      }
    }, [selectedLetter]);

    const handleInputChange = (fieldName, value) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    };

    const handleGenerate = () => {
      if (!selectedTemplate) {
        alert("Please select a template first");
        return;
      }

      // Validate required fields
      const requiredFields = selectedTemplate.defaultFields.filter(
        (field) => field.required
      );
      const missingFields = requiredFields.filter(
        (field) => !formData[field.name]
      );

      if (missingFields.length > 0) {
        alert(
          `Please fill in all required fields: ${missingFields
            .map((f) => f.label)
            .join(", ")}`
        );
        return;
      }

      handleGenerateLetter({
        templateName: selectedTemplate.templateName,
        templateType: selectedTemplate.templateType,
        employeeName: formData.employeeName || "",
        employeeId:
          formData.employeeId || "EMP" + Math.floor(Math.random() * 1000),
        employeeEmail: formData.employeeEmail || "",
        department: formData.department || "",
        purpose: formData.purpose || "General Purpose",
        priority: "Medium",
        digitalSignature: true,
        auditTrail: true,
      });
    };

    const renderField = (field) => {
      switch (field.type) {
        case "text":
          return (
            <input
              type="text"
              className="form-control form-control-sm"
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label}`}
              required={field.required}
            />
          );
        case "number":
          return (
            <input
              type="number"
              className="form-control form-control-sm"
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label}`}
              required={field.required}
            />
          );
        case "date":
          return (
            <input
              type="date"
              className="form-control form-control-sm"
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
            />
          );
        case "textarea":
          return (
            <textarea
              className="form-control form-control-sm"
              rows="3"
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label}`}
              required={field.required}
            />
          );
        case "select":
          return (
            <select
              className="form-select form-select-sm"
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        case "checkbox":
          return (
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData[field.name] || false}
                onChange={(e) =>
                  handleInputChange(field.name, e.target.checked)
                }
                id={field.name}
              />
              <label className="form-check-label" htmlFor={field.name}>
                {field.label}
              </label>
            </div>
          );
        default:
          return (
            <input
              type="text"
              className="form-control form-control-sm"
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label}`}
              required={field.required}
            />
          );
      }
    };

    if (!selectedTemplate && !selectedLetter) {
      return (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white py-3">
                <h5 className="modal-title fw-bold fs-6">
                  <FileEdit className="me-2" />
                  Select Template
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowLetterModal(false)}
                ></button>
              </div>

              <div className="modal-body p-3">
                <div className="alert alert-info mb-3 py-2 small">
                  <Info className="me-2" size={14} />
                  Please select a template to generate a letter.
                </div>

                <div className="row row-cols-1 row-cols-md-2 g-3">
                  {letterTemplates.slice(0, 6).map((template) => (
                    <div key={template.id} className="col">
                      <div
                        className="card border hover-lift cursor-pointer h-100"
                        style={{ minHeight: "140px" }}
                        onClick={() => setSelectedLetter(template)}
                      >
                        <div className="card-body d-flex flex-column p-3">
                          <div className="d-flex align-items-start mb-2">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                              {getIconComponent(template.icon)}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1 text-truncate fs-6">
                                {template.templateName}
                              </h6>
                              <div
                                className="text-muted text-truncate-2 small"
                                style={{ lineHeight: "1.3" }}
                              >
                                {template.description}
                              </div>
                            </div>
                          </div>
                          <div className="mt-auto">
                            <span className="badge bg-info bg-opacity-10 text-info small me-1">
                              {template.category}
                            </span>
                            {template.autoApprove && (
                              <span className="badge bg-success bg-opacity-10 text-success small">
                                Auto-approve
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer p-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setShowLetterModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="modal show d-block"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title fw-bold">
                <FileEdit className="me-2" />
                Generate {selectedTemplate?.templateName}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => {
                  setShowLetterModal(false);
                  setSelectedLetter(null);
                }}
              ></button>
            </div>

            <div className="modal-body">
              <div className="alert alert-info mb-4">
                <Info className="me-2" size={16} />
                Fill in the details below to generate{" "}
                {selectedTemplate?.templateName}.
                <span className="text-danger"> * Required fields</span>
              </div>

              <div className="row g-3">
                {selectedTemplate?.defaultFields.map((field, index) => (
                  <div
                    key={field.name}
                    className={`col-12 ${
                      field.type === "textarea" ? "" : "col-md-6"
                    }`}
                  >
                    <label className="form-label">
                      {field.label}
                      {field.required && (
                        <span className="text-danger"> *</span>
                      )}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h6 className="fw-bold mb-3">Letter Options</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={true}
                        readOnly
                        id="digitalSignature"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="digitalSignature"
                      >
                        Include Digital Signature
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={true}
                        readOnly
                        id="verificationCode"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="verificationCode"
                      >
                        Generate Verification Code
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={true}
                        readOnly
                        id="auditTrail"
                      />
                      <label className="form-check-label" htmlFor="auditTrail">
                        Enable Audit Trail
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={true}
                        readOnly
                        id="workflowTracking"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="workflowTracking"
                      >
                        Enable Workflow Tracking
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setShowLetterModal(false);
                  setSelectedLetter(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleGenerate}
              >
                <FileEdit className="me-2" size={16} />
                Generate Letter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Component
  const mainContent = (
    <div className="container-fluid px-2 px-md-3 py-2 py-md-3">
      <style>
        {`
          /* Custom CSS for responsive design */
          @media (max-width: 768px) {
            .table-responsive {
              font-size: 0.75rem;
            }
            .btn-group .btn {
              padding: 0.2rem 0.4rem;
            }
            .card-header h6 {
              font-size: 0.9rem;
            }
            .stat-card {
              padding: 0.75rem;
            }
            h5 {
              font-size: 1.1rem;
            }
            .btn-sm {
              font-size: 0.7rem;
              padding: 0.2rem 0.4rem;
            }
            .btn-responsive {
              font-size: 0.75rem;
              padding: 0.25rem 0.5rem;
            }
            .modal-dialog {
              margin: 0.5rem;
            }
          }
          
          @media (max-width: 576px) {
            .container-fluid {
              padding-left: 0.5rem;
              padding-right: 0.5rem;
            }
            .btn-responsive {
              font-size: 0.7rem;
              padding: 0.2rem 0.4rem;
            }
            .btn {
              font-size: 0.75rem;
              padding: 0.3rem 0.6rem;
            }
            .modal-dialog {
              margin: 0.25rem;
            }
            .modal-content {
              border-radius: 0.375rem;
            }
            h5 {
              font-size: 1rem;
            }
            .table td, .table th {
              padding: 0.5rem;
            }
            .card-body {
              padding: 1rem;
            }
          }
          
          /* Truncation utilities */
          .text-truncate-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-truncate-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          /* Responsive buttons */
          .btn-responsive {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          /* Icon only buttons on small screens */
          .btn-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
          }
          
          @media (min-width: 768px) {
            .btn-icon {
              width: auto;
              height: auto;
              padding: 0.375rem 0.75rem;
            }
          }
          
          /* Table column min widths */
          .min-width-80 {
            min-width: 80px;
          }
          
          .min-width-100 {
            min-width: 100px;
          }
          
          .min-width-120 {
            min-width: 120px;
          }
          
          .min-width-150 {
            min-width: 150px;
          }
          
          /* Card responsive */
          .card-title-responsive {
            font-size: 1rem;
          }
          
          @media (max-width: 768px) {
            .card-title-responsive {
              font-size: 0.9rem;
            }
          }
          
          /* Hide/show based on screen size */
          .mobile-only {
            display: none !important;
          }
          
          .desktop-only {
            display: block !important;
          }
          
          @media (max-width: 768px) {
            .mobile-only {
              display: block !important;
            }
            .desktop-only {
              display: none !important;
            }
          }
          
          /* Mobile menu */
          .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 1040;
            display: none;
          }
          
          .mobile-menu-overlay.show {
            display: block;
          }
          
          .mobile-nav {
            position: fixed;
            top: 0;
            left: -300px;
            width: 280px;
            height: 100%;
            background-color: white;
            z-index: 1050;
            transition: left 0.3s;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          }
          
          .mobile-nav.show {
            left: 0;
          }
          
          /* Hover effects */
          .hover-lift {
            transition: transform 0.2s, box-shadow 0.2s;
          }
          
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          
          /* Template grid responsiveness */
          .template-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
          }
          
          @media (max-width: 768px) {
            .template-grid {
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 0.75rem;
            }
          }
          
          @media (max-width: 576px) {
            .template-grid {
              grid-template-columns: 1fr;
              gap: 0.5rem;
            }
          }
          
          /* Action buttons container */
          .action-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }
          
          @media (max-width: 768px) {
            .action-buttons {
              gap: 0.25rem;
            }
            .action-buttons .btn {
              flex: 1;
              min-width: 0;
              text-align: center;
            }
          }
          
          /* Template card responsive */
          .template-card {
            height: 100%;
          }
          
          .template-card .btn {
            width: 100%;
          }
          
          @media (max-width: 768px) {
            .template-card {
              margin-bottom: 0.5rem;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center flex-grow-1">
            <button
              className="btn btn-outline-secondary d-md-none me-2 btn-icon"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1 text-truncate">
                HR Letter Generation System
              </h5>
              <p className="text-muted mb-0 d-none d-md-block small text-truncate">
                <FileText className="me-2 text-primary" size={14} />
                Complete HR letter management with 12 templates
              </p>
            </div>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center gap-1 btn-responsive"
              onClick={() => setShowLetterModal(true)}
            >
              <FileEdit size={16} />
              <span className="d-none d-sm-inline">Generate</span>
              <span className="d-sm-none">New</span>
            </button>
            <button
              type="button"
              className="btn btn-success d-flex align-items-center gap-1 btn-responsive"
              onClick={() => setShowTemplateModal(true)}
            >
              <FileText size={16} />
              <span className="d-none d-sm-inline">Template</span>
              <span className="d-sm-none">Add</span>
            </button>
            <button
              type="button"
              className="btn btn-info d-flex align-items-center gap-1 btn-responsive text-white"
              onClick={() => setShowAIAssistant(true)}
            >
              <Bot size={16} />
              <span className="d-none d-sm-inline">AI</span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="p-2 p-md-3 bg-primary bg-opacity-10 rounded mb-3">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-2 gap-md-3 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="spinner-grow spinner-grow-sm text-success"
                    role="status"
                  ></div>
                  <span className="fw-medium small">System Active</span>
                </div>
                <div className="vr d-none d-md-inline"></div>
                <span className="text-muted small">
                  {statistics.totalTemplates} templates
                </span>
                <div className="vr d-none d-md-inline"></div>
                <span className="text-muted small">
                  {statistics.totalRequests} requests
                </span>
              </div>
            </div>
            <div className="col-md-4 text-md-end mt-2 mt-md-0">
              <div className="d-flex flex-wrap gap-1 gap-md-2 justify-content-end">
                <span className="badge bg-success bg-opacity-10 text-success small">
                  <CheckCircle size={10} className="me-1" />
                  {statistics.approvedRequests} Approved
                </span>
                <span className="badge bg-info bg-opacity-10 text-info small">
                  <Sparkles size={10} className="me-1" />
                  {statistics.aiOptimized} AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Responsive */}
      <div className="row g-2 g-md-3 mb-3 mb-md-4">
        <div className="col-6 col-md-3">
          <div className="p-2 p-md-3 bg-white border rounded stat-card h-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Templates</div>
                <div className="h4 h3-md mb-0 fw-bold text-primary">
                  {statistics.totalTemplates}
                </div>
              </div>
              <FileText
                size={20}
                className="text-primary opacity-75 d-none d-md-block"
              />
              <FileText
                size={16}
                className="text-primary opacity-75 d-md-none"
              />
            </div>
            <div className="small text-success mt-2">
              <CheckCircle size={10} className="me-1" />
              {statistics.aiOptimized} AI optimized
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-2 p-md-3 bg-white border rounded stat-card h-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Requests</div>
                <div className="h4 h3-md mb-0 fw-bold text-success">
                  {statistics.totalRequests}
                </div>
              </div>
              <ClipboardList
                size={20}
                className="text-success opacity-75 d-none d-md-block"
              />
              <ClipboardList
                size={16}
                className="text-success opacity-75 d-md-none"
              />
            </div>
            <div className="small text-muted mt-2">
              {statistics.approvedRequests} approved •{" "}
              {statistics.pendingRequests} pending
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-2 p-md-3 bg-white border rounded stat-card h-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Auto-Approved</div>
                <div className="h4 h3-md mb-0 fw-bold text-warning">
                  {statistics.autoApprove}
                </div>
              </div>
              <Zap
                size={20}
                className="text-warning opacity-75 d-none d-md-block"
              />
              <Zap size={16} className="text-warning opacity-75 d-md-none" />
            </div>
            <div className="small text-warning mt-2">Instant approval</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="p-2 p-md-3 bg-white border rounded stat-card h-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Downloads</div>
                <div className="h4 h3-md mb-0 fw-bold text-info">
                  {statistics.totalDownloads}
                </div>
              </div>
              <Download
                size={20}
                className="text-info opacity-75 d-none d-md-block"
              />
              <Download size={16} className="text-info opacity-75 d-md-none" />
            </div>
            <div className="small text-muted mt-2">Letter downloads</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Desktop Only */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex overflow-auto">
            <div className="d-flex flex-nowrap gap-2 w-100">
              {menuItems.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`btn d-flex align-items-center gap-2 px-3 py-2 rounded flex-shrink-0 ${
                    activeSection === section.id
                      ? "btn-primary text-white"
                      : "btn-outline-primary"
                  }`}
                  style={{
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                >
                  {React.cloneElement(section.icon, { size: 16 })}
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-3 mb-md-4">
        <div className="row g-2 g-md-3">
          <div className="col-12 col-md-8">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search templates, requests, letters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-outline-primary d-none d-md-flex align-items-center gap-1"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter size={16} />
                <span>Filter</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-primary d-md-none btn-sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter size={16} />
              </button>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="d-flex gap-1 gap-md-2">
              <button
                type="button"
                className="btn btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center btn-responsive"
                onClick={() => handleRefresh()}
                title="Refresh"
              >
                <RefreshCw size={16} />
                <span className="d-none d-md-inline ms-1">Refresh</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center btn-responsive"
                onClick={() => clearFilters()}
                title="Clear Filters"
              >
                <X size={16} />
                <span className="d-none d-md-inline ms-1">Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="card border mt-3 shadow-sm">
            <div className="card-body">
              <div className="row g-3">
                {/* Status Filter */}
                <div className="col-md-3 col-sm-6">
                  <label className="form-label small fw-bold">Status</label>
                  <select
                    className="form-select form-select-sm"
                    value={activeFilters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="col-md-3 col-sm-6">
                  <label className="form-label small fw-bold">Priority</label>
                  <select
                    className="form-select form-select-sm"
                    value={activeFilters.priority}
                    onChange={(e) =>
                      handleFilterChange("priority", e.target.value)
                    }
                  >
                    <option value="">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Template Type Filter */}
                <div className="col-md-3 col-sm-6">
                  <label className="form-label small fw-bold">
                    Template Type
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={activeFilters.templateType}
                    onChange={(e) =>
                      handleFilterChange("templateType", e.target.value)
                    }
                  >
                    <option value="">All Templates</option>
                    {letterTemplates.map((template) => (
                      <option key={template.id} value={template.templateType}>
                        {template.templateName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department Filter */}
                <div className="col-md-3 col-sm-6">
                  <label className="form-label small fw-bold">Department</label>
                  <select
                    className="form-select form-select-sm"
                    value={activeFilters.department}
                    onChange={(e) =>
                      handleFilterChange("department", e.target.value)
                    }
                  >
                    <option value="">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Technology">Technology</option>
                    <option value="Operations">Operations</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Business Development">
                      Business Development
                    </option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Date Range</label>
                  <div className="row g-2">
                    <div className="col">
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={activeFilters.startDate}
                        onChange={(e) =>
                          handleFilterChange("startDate", e.target.value)
                        }
                        max={
                          activeFilters.endDate ||
                          new Date().toISOString().split("T")[0]
                        }
                      />
                    </div>
                    <div className="col-auto d-flex align-items-center">
                      <span className="text-muted">to</span>
                    </div>
                    <div className="col">
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={activeFilters.endDate}
                        onChange={(e) =>
                          handleFilterChange("endDate", e.target.value)
                        }
                        min={activeFilters.startDate}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>

                {/* Employee Filter */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Employee</label>
                  <select
                    className="form-select form-select-sm"
                    value={activeFilters.employeeId}
                    onChange={(e) =>
                      handleFilterChange("employeeId", e.target.value)
                    }
                  >
                    <option value="">All Employees</option>
                    {Array.from(
                      new Map(
                        letterRequests.map((req) => [req.employeeId, req])
                      )
                    ).map(([id, req]) => (
                      <option key={id} value={id}>
                        {req.employeeName} ({id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="col-12">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => applyFilters()}
                      >
                        <CheckCircle size={14} className="me-1" />
                        Apply Filters
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => saveFilterPreset()}
                      >
                        <Save size={14} className="me-1" />
                        Save Preset
                      </button>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => clearFilters()}
                      >
                        <X size={14} className="me-1" />
                        Clear All
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setShowAdvancedFilters(false)}
                      >
                        <X size={14} className="me-1" />
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Active Filters Tags */}
                  {hasActiveFilters() && (
                    <div className="mt-3">
                      <small className="text-muted d-block mb-2">
                        Active Filters:
                      </small>
                      <div className="d-flex flex-wrap gap-2">
                        {activeFilters.status && (
                          <span className="badge bg-primary d-flex align-items-center">
                            Status: {activeFilters.status}
                            <button
                              className="btn-close btn-close-white btn-close-sm ms-1"
                              onClick={() => removeFilter("status")}
                            />
                          </span>
                        )}
                        {activeFilters.priority && (
                          <span className="badge bg-warning text-dark d-flex align-items-center">
                            Priority: {activeFilters.priority}
                            <button
                              className="btn-close btn-close-dark btn-close-sm ms-1"
                              onClick={() => removeFilter("priority")}
                            />
                          </span>
                        )}
                        {activeFilters.templateType && (
                          <span className="badge bg-info d-flex align-items-center">
                            Template:{" "}
                            {
                              letterTemplates.find(
                                (t) =>
                                  t.templateType === activeFilters.templateType
                              )?.templateName
                            }
                            <button
                              className="btn-close btn-close-white btn-close-sm ms-1"
                              onClick={() => removeFilter("templateType")}
                            />
                          </span>
                        )}
                        {activeFilters.department && (
                          <span className="badge bg-success d-flex align-items-center">
                            Department: {activeFilters.department}
                            <button
                              className="btn-close btn-close-white btn-close-sm ms-1"
                              onClick={() => removeFilter("department")}
                            />
                          </span>
                        )}
                        {activeFilters.employeeId && (
                          <span className="badge bg-secondary d-flex align-items-center">
                            Employee:{" "}
                            {
                              letterRequests.find(
                                (r) => r.employeeId === activeFilters.employeeId
                              )?.employeeName
                            }
                            <button
                              className="btn-close btn-close-white btn-close-sm ms-1"
                              onClick={() => removeFilter("employeeId")}
                            />
                          </span>
                        )}
                        {(activeFilters.startDate || activeFilters.endDate) && (
                          <span className="badge bg-dark d-flex align-items-center">
                            Date: {activeFilters.startDate || "Any"} to{" "}
                            {activeFilters.endDate || "Any"}
                            <button
                              className="btn-close btn-close-white btn-close-sm ms-1"
                              onClick={() => {
                                handleFilterChange("startDate", "");
                                handleFilterChange("endDate", "");
                              }}
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Template Categories Summary */}
      {activeSection === "dashboard" && (
        <div className="mt-4 mb-5 pt-2">
          {" "}
          {/* Good spacing top/bottom */}
          <h6 className="fw-bold mb-3">
            <FileText size={16} className="me-2" />
            Template Categories
          </h6>
          <div className="row g-2 g-md-3">
            {[
              "Employment",
              "Financial",
              "Exit",
              "Legal",
              "Career",
              "Disciplinary",
            ].map((category) => {
              const count = letterTemplates.filter(
                (t) => t.category === category
              ).length;
              return (
                <div key={category} className="col-6 col-md-4 col-lg-2">
                  <div className="p-2 p-md-3 border rounded text-center">
                    <div className="h4 h3-md fw-bold mb-1">{count}</div>
                    <div className="small text-muted">{category}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dashboard Section */}
      {activeSection === "dashboard" && (
        <div className="row g-3">
          {/* Recent Letter Requests Card */}
          <div className="col-12 col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">Recent Letter Requests</h6>
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary px-3 py-2">
                      {letterRequests.length + generatedLetters.length}{" "}
                      Employees
                    </span>
                  </div>

                  {/* Export Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 px-3 py-2"
                      onClick={() => exportAllRequestsPDF()}
                      title="Export All as PDF"
                    >
                      <File size={16} />
                      <span>PDF</span>
                    </button>

                    <button
                      className="btn btn-success text-light btn-sm d-flex align-items-center gap-2 px-3 py-2"
                      onClick={() => exportAllRequestsExcel()}
                      title="Export All as Excel"
                    >
                      <FileSpreadsheet size={16} />
                      <span>Excel</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th className="min-width-120">Request ID</th>
                        <th className="min-width-120">Type</th>
                        <th className="d-none d-md-table-cell min-width-120">
                          Employee
                        </th>
                        <th className="d-none d-lg-table-cell min-width-100">
                          Department
                        </th>
                        <th className="min-width-80">Status</th>
                        <th className="d-none d-sm-table-cell min-width-80">
                          Date
                        </th>
                        <th className="min-width-180">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Combine and sort all requests: letterRequests first, then generatedLetters */}
                      {[
                        ...letterRequests,
                        ...generatedLetters.map((letter) => ({
                          ...letter,
                          // Convert generated letter to request format for display
                          id: letter.id + 1000, // Offset to avoid ID conflicts
                          requestId: letter.letterId,
                          templateName: letter.templateName,
                          employeeName: letter.employeeName,
                          employeeId: letter.employeeId,
                          department: letter.department,
                          designation: letter.designation,
                          requestDate: letter.generatedDate,
                          status: letter.status,
                          purpose: letter.purpose,
                          isGeneratedLetter: true, // Flag to identify generated letters
                        })),
                      ]
                        .sort(
                          (a, b) =>
                            new Date(b.requestDate || b.generatedDate || 0) -
                            new Date(a.requestDate || a.generatedDate || 0)
                        )
                        .slice(0, 8) // Show 8 most recent
                        .map((request) => (
                          <tr key={request.id}>
                            <td className="small text-truncate">
                              {request.requestId || request.letterId}
                              {request.isGeneratedLetter && (
                                <small className="text-success d-block x-small">
                                  <FileEdit size={10} className="me-1" />
                                  Generated
                                </small>
                              )}
                            </td>
                            <td className="text-truncate">
                              <div className="small fw-medium">
                                {request.templateName}
                              </div>
                            </td>
                            <td className="d-none d-md-table-cell text-truncate">
                              {request.employeeName}
                              <small className="text-muted d-block">
                                {request.employeeId}
                              </small>
                            </td>
                            <td className="d-none d-lg-table-cell text-truncate">
                              {request.department || "N/A"}
                            </td>
                            <td>
                              {getStatusBadge(request.status)}
                              {request.isGeneratedLetter &&
                                request.status === "pending" && (
                                  <small className="text-warning d-block x-small">
                                    Needs Review
                                  </small>
                                )}
                            </td>
                            <td className="d-none d-sm-table-cell">
                              {formatDate(
                                request.requestDate || request.generatedDate
                              )}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                {/* View Button - Different handlers based on type */}
                                <button
                                  className="btn btn-outline-info btn-sm btn-icon"
                                  onClick={() => {
                                    if (request.isGeneratedLetter) {
                                      setSelectedLetter(request);
                                      setShowLetterDetailsCard(true);
                                    } else {
                                      handleViewAuditTrail(request);
                                    }
                                  }}
                                  title="View Details"
                                >
                                  <Eye size={12} />
                                </button>

                                {/* Edit Button */}
                                <button
                                  className="btn btn-outline-warning btn-sm btn-icon"
                                  onClick={() => {
                                    if (request.isGeneratedLetter) {
                                      setEditingLetter(request);
                                      setShowEditModal(true);
                                    } else {
                                      handleEditRequest(request);
                                    }
                                  }}
                                  title="Edit"
                                >
                                  <Edit size={12} />
                                </button>

                                {/* Download Button (for approved requests) */}
                                {(request.status === "approved" ||
                                  request.status === "Active") && (
                                  <button
                                    className="btn btn-outline-primary btn-sm btn-icon"
                                    onClick={() => {
                                      if (request.isGeneratedLetter) {
                                        downloadLetterPDF(request);
                                      } else {
                                        // Find the actual request (not the transformed one)
                                        const actualRequest =
                                          letterRequests.find(
                                            (r) => r.id === request.id
                                          );
                                        if (actualRequest) {
                                          downloadRequestPDF(actualRequest);
                                        }
                                      }
                                    }}
                                    title="Download PDF"
                                  >
                                    <File size={12} />
                                  </button>
                                )}

                                {/* Approve/Reject Buttons (for pending requests) */}
                                {request.status === "pending" && (
                                  <>
                                    <button
                                      className="btn btn-outline-success btn-sm btn-icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (request.isGeneratedLetter) {
                                          // Handle generated letter approval
                                          const originalLetterId =
                                            request.id - 1000;
                                          const currentDate = new Date()
                                            .toISOString()
                                            .split("T")[0];

                                          // Update generatedLetters
                                          setGeneratedLetters((prev) =>
                                            prev.map((letter) =>
                                              letter.id === originalLetterId
                                                ? {
                                                    ...letter,
                                                    status: "approved",
                                                    approvalDate: currentDate,
                                                    approvedBy: ["HR Manager"],
                                                    auditTrail: [
                                                      ...(letter.auditTrail ||
                                                        []),
                                                      {
                                                        action:
                                                          "Approved from Dashboard",
                                                        by: "HR Manager",
                                                        timestamp:
                                                          new Date().toLocaleString(),
                                                        step: "Approval",
                                                      },
                                                    ],
                                                  }
                                                : letter
                                            )
                                          );

                                          // Also update letterArchive if exists
                                          setLetterArchive((prev) =>
                                            prev.map((letter) =>
                                              letter.employeeId ===
                                                request.employeeId &&
                                              letter.templateName ===
                                                request.templateName
                                                ? {
                                                    ...letter,
                                                    status: "approved",
                                                    approvalDate: currentDate,
                                                  }
                                                : letter
                                            )
                                          );

                                          // Update letterRequests if exists
                                          setLetterRequests((prev) =>
                                            prev.map((req) =>
                                              req.employeeId ===
                                                request.employeeId &&
                                              req.templateName ===
                                                request.templateName
                                                ? {
                                                    ...req,
                                                    status: "approved",
                                                    statusColor: "success",
                                                    workflowStatus: "completed",
                                                    approvalDate: currentDate,
                                                    approvedBy: [
                                                      ...req.approvedBy,
                                                      "HR Manager",
                                                    ],
                                                    auditTrail: [
                                                      ...req.auditTrail,
                                                      {
                                                        action:
                                                          "Approved from Dashboard",
                                                        by: "HR Manager",
                                                        timestamp:
                                                          new Date().toLocaleString(),
                                                        step: "Approval",
                                                      },
                                                    ],
                                                  }
                                                : req
                                            )
                                          );

                                          // Update workflowRequests if exists
                                          setWorkflowRequests((prev) =>
                                            prev.map((wf) =>
                                              wf.employeeId ===
                                                request.employeeId &&
                                              wf.templateName ===
                                                request.templateName
                                                ? {
                                                    ...wf,
                                                    status: "approved",
                                                    workflowStatus: "completed",
                                                    approvalDate: currentDate,
                                                    auditTrail: [
                                                      ...wf.auditTrail,
                                                      {
                                                        action:
                                                          "Approved from Dashboard",
                                                        by: "HR Manager",
                                                        timestamp:
                                                          new Date().toLocaleString(),
                                                        step: "Approval",
                                                      },
                                                    ],
                                                  }
                                                : wf
                                            )
                                          );

                                          setNotification({
                                            show: true,
                                            type: "success",
                                            message: `Generated letter ${request.letterId} approved successfully!`,
                                          });
                                        } else {
                                          // Handle regular request approval
                                          const currentDate = new Date()
                                            .toISOString()
                                            .split("T")[0];

                                          // Update letterRequests
                                          setLetterRequests((prev) =>
                                            prev.map((req) =>
                                              req.id === request.id
                                                ? {
                                                    ...req,
                                                    status: "approved",
                                                    statusColor: "success",
                                                    workflowStatus: "completed",
                                                    approvedBy: [
                                                      ...req.approvedBy,
                                                      "HR Manager",
                                                    ],
                                                    approvalDate: currentDate,
                                                    generatedDate: currentDate,
                                                    digitalSignature: true,
                                                    verificationCode: `VER-${new Date().getFullYear()}-${
                                                      request.id
                                                    }`,
                                                    auditTrail: [
                                                      ...req.auditTrail,
                                                      {
                                                        action:
                                                          "Approved from Dashboard",
                                                        by: "HR Manager",
                                                        timestamp:
                                                          new Date().toLocaleString(),
                                                        step: "HR Approval",
                                                      },
                                                    ],
                                                  }
                                                : req
                                            )
                                          );

                                          // Also update workflowRequests if exists
                                          setWorkflowRequests((prev) =>
                                            prev.map((wf) =>
                                              wf.id === request.id
                                                ? {
                                                    ...wf,
                                                    status: "approved",
                                                    workflowStatus: "completed",
                                                    approvalDate: currentDate,
                                                    auditTrail: [
                                                      ...wf.auditTrail,
                                                      {
                                                        action:
                                                          "Approved from Dashboard",
                                                        by: "HR Manager",
                                                        timestamp:
                                                          new Date().toLocaleString(),
                                                        step: "Approval",
                                                      },
                                                    ],
                                                  }
                                                : wf
                                            )
                                          );

                                          // Generate and add to archive
                                          const newLetter = {
                                            id: letterArchive.length + 1,
                                            letterId: `LTR-${new Date().getFullYear()}-${String(
                                              letterArchive.length + 1
                                            ).padStart(3, "0")}`,
                                            templateName: request.templateName,
                                            employeeName: request.employeeName,
                                            employeeId: request.employeeId,
                                            employeeEmail:
                                              request.employeeEmail,
                                            generationDate: currentDate,
                                            purpose: request.purpose,
                                            downloadCount: 0,
                                            lastAccessed: null,
                                            fileSize: "~250 KB",
                                            status: "Active",
                                            digitalSignature: true,
                                            verificationCode: `VER-${new Date().getFullYear()}-${String(
                                              letterArchive.length + 1
                                            ).padStart(3, "0")}`,
                                            format: "PDF",
                                            version: "1.0",
                                            workflowId: `WF-${new Date().getFullYear()}-${
                                              request.id
                                            }`,
                                          };

                                          setLetterArchive((prev) => [
                                            ...prev,
                                            newLetter,
                                          ]);

                                          setNotification({
                                            show: true,
                                            type: "success",
                                            message: `Request ${request.requestId} approved and letter generated! Letter ID: ${newLetter.letterId}`,
                                          });
                                        }
                                      }}
                                      title="Approve"
                                    >
                                      <CheckCircle size={12} />
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm btn-icon"
                                      onClick={(e) => {
                                        e.stopPropagation();

                                        // Show confirmation modal/dialog
                                        if (
                                          window.confirm(
                                            `Are you sure you want to reject ${
                                              request.isGeneratedLetter
                                                ? "letter"
                                                : "request"
                                            } ${
                                              request.requestId ||
                                              request.letterId
                                            }?`
                                          )
                                        ) {
                                          if (request.isGeneratedLetter) {
                                            // Handle generated letter rejection
                                            const originalLetterId =
                                              request.id - 1000;
                                            const rejectReason =
                                              "Rejected from Dashboard";

                                            // Update generatedLetters
                                            setGeneratedLetters((prev) =>
                                              prev.map((letter) =>
                                                letter.id === originalLetterId
                                                  ? {
                                                      ...letter,
                                                      status: "rejected",
                                                      rejectionReason:
                                                        rejectReason,
                                                      rejectionDate: new Date()
                                                        .toISOString()
                                                        .split("T")[0],
                                                      auditTrail: [
                                                        ...(letter.auditTrail ||
                                                          []),
                                                        {
                                                          action:
                                                            "Rejected from Dashboard",
                                                          by: "HR Manager",
                                                          timestamp:
                                                            new Date().toLocaleString(),
                                                          step: "Rejection",
                                                          details: `Reason: ${rejectReason}`,
                                                        },
                                                      ],
                                                    }
                                                  : letter
                                              )
                                            );

                                            // Update other states
                                            updateAllStatesOnRejection(
                                              request,
                                              rejectReason
                                            );

                                            setNotification({
                                              show: true,
                                              type: "warning",
                                              message: `Generated letter ${request.letterId} rejected.`,
                                            });
                                          } else {
                                            // Handle regular request rejection
                                            const rejectReason =
                                              "Rejected from Dashboard";

                                            // Update letterRequests
                                            setLetterRequests((prev) =>
                                              prev.map((req) =>
                                                req.id === request.id
                                                  ? {
                                                      ...req,
                                                      status: "rejected",
                                                      statusColor: "danger",
                                                      workflowStatus:
                                                        "terminated",
                                                      rejectionReason:
                                                        rejectReason,
                                                      auditTrail: [
                                                        ...req.auditTrail,
                                                        {
                                                          action:
                                                            "Rejected from Dashboard",
                                                          by: "HR Manager",
                                                          timestamp:
                                                            new Date().toLocaleString(),
                                                          step: "Rejection",
                                                          details: `Reason: ${rejectReason}`,
                                                        },
                                                      ],
                                                    }
                                                  : req
                                              )
                                            );

                                            // Also update workflowRequests if exists
                                            setWorkflowRequests((prev) =>
                                              prev.map((wf) =>
                                                wf.id === request.id
                                                  ? {
                                                      ...wf,
                                                      status: "rejected",
                                                      workflowStatus:
                                                        "terminated",
                                                      rejectionReason:
                                                        rejectReason,
                                                      auditTrail: [
                                                        ...wf.auditTrail,
                                                        {
                                                          action:
                                                            "Rejected from Dashboard",
                                                          by: "HR Manager",
                                                          timestamp:
                                                            new Date().toLocaleString(),
                                                          step: "Rejection",
                                                          details: `Reason: ${rejectReason}`,
                                                        },
                                                      ],
                                                    }
                                                  : wf
                                              )
                                            );

                                            setNotification({
                                              show: true,
                                              type: "warning",
                                              message: `Request ${request.requestId} rejected.`,
                                            });
                                          }
                                        }
                                      }}
                                      title="Reject"
                                    >
                                      <XCircle size={12} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Showing{" "}
                    {Math.min(
                      8,
                      letterRequests.length + generatedLetters.length
                    )}{" "}
                    of {letterRequests.length + generatedLetters.length}{" "}
                    requests
                  </small>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setActiveSection("requests")}
                  >
                    View All Requests
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Section */}
      {activeSection === "templates" && (
        <div className="row g-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-3">
                <h6 className="fw-bold mb-2 mb-md-0 fs-6">
                  <FileText className="me-2" size={18} />
                  All Letter Templates ({letterTemplates.length})
                </h6>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-primary fs-6">
                    {statistics.totalTemplates} templates
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary position-relative"
                    onClick={() => setShowTemplateModal(true)}
                    title="Add Template"
                  >
                    <FileText size={14} />
                    <span className="d-none d-sm-inline ms-1">
                      Add Template
                    </span>
                  </button>
                </div>
              </div>
              <div className="card-body p-3">
                {/* Success/Error Messages for Template Actions */}
                {templateNotification.show && (
                  <div
                    className={`card border-${
                      templateNotification.type === "success"
                        ? "success"
                        : "danger"
                    } mb-4`}
                  >
                    <div
                      className={`card-header bg-${
                        templateNotification.type === "success"
                          ? "success"
                          : "danger"
                      } text-white d-flex justify-content-between align-items-center`}
                    >
                      <div className="d-flex align-items-center">
                        {templateNotification.type === "success" && (
                          <CheckCircle className="me-2" size={20} />
                        )}
                        {templateNotification.type === "danger" && (
                          <XCircle className="me-2" size={20} />
                        )}
                        <h6 className="fw-bold mb-0">
                          {templateNotification.title}
                        </h6>
                      </div>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() =>
                          setTemplateNotification({
                            show: false,
                            type: "",
                            title: "",
                            message: "",
                          })
                        }
                      ></button>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">{templateNotification.message}</p>
                    </div>
                  </div>
                )}

                <div className="row g-3">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="col-12 col-sm-6 col-md-4">
                      <div className="card h-100 border shadow-sm">
                        <div className="card-body d-flex flex-column p-3">
                          {/* Header */}
                          <div className="d-flex align-items-start mb-3">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3 flex-shrink-0">
                              {getIconComponent(template.icon)}
                            </div>

                            <div className="flex-grow-1">
                              <h6
                                className="text-truncate fs-6 fs-sm-4"
                                title={template.templateName}
                              >
                                {template.templateName}
                              </h6>
                              <small className="text-muted text-truncate-2 d-block small">
                                {template.description}
                              </small>
                            </div>
                          </div>

                          <div className="d-flex flex-column align-items-end gap-1 ms-2">
                            {template.aiOptimized && (
                              <span className="badge bg-success d-flex align-items-center">
                                <Sparkles size={10} className="me-1" />
                                AI
                              </span>
                            )}
                            <span className="badge bg-light text-dark border">
                              {template.templateId}
                            </span>
                          </div>

                          {/* Category */}
                          <div className="mb-3">
                            <small className="text-muted d-block mb-1">
                              Category
                            </small>
                            <span className="badge bg-info bg-opacity-10 text-info">
                              {template.category}
                            </span>
                            {template.autoApprove && (
                              <span className="badge bg-success bg-opacity-10 text-success ms-2">
                                Auto-approve
                              </span>
                            )}
                          </div>

                          {/* Approvals */}
                          <div className="mb-3">
                            <small className="text-muted d-block mb-1">
                              Required Approvals
                            </small>
                            <div className="d-flex flex-wrap gap-1">
                              {template.requiredApprovals
                                .slice(0, 2)
                                .map((approval, idx) => (
                                  <span
                                    key={idx}
                                    className="badge bg-light text-dark border"
                                  >
                                    {approval}
                                  </span>
                                ))}
                              {template.requiredApprovals.length > 2 && (
                                <span className="badge bg-light text-dark border">
                                  +{template.requiredApprovals.length - 2}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="mt-auto d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              Used {template.usageCount} times
                            </small>

                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEditTemplate(template)}
                                title="Edit Template"
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleUseTemplate(template)}
                              >
                                Use
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDeleteTemplate(template.id)
                                }
                                title="Delete Template"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* // Generator Section */}
      {activeSection === "generator" && (
        <div className="row g-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h6 className="fw-bold mb-0">
                  <FileEdit className="me-2" size={18} />
                  Letter Generator & Management
                </h6>
                <small>Generate letters and manage all created letters</small>
              </div>
              <div className="card-body">
                {/* Card-based Success/Error Messages */}
                {notification.show && (
                  <div
                    className={`card border-${
                      notification.type === "success"
                        ? "success"
                        : notification.type === "danger"
                        ? "danger"
                        : "info"
                    } mb-4`}
                  >
                    <div
                      className={`card-header bg-${
                        notification.type === "success"
                          ? "success"
                          : notification.type === "danger"
                          ? "danger"
                          : "info"
                      } text-white d-flex justify-content-between align-items-center`}
                    >
                      <div className="d-flex align-items-center">
                        {notification.type === "success" && (
                          <CheckCircle className="me-2" size={20} />
                        )}
                        {notification.type === "danger" && (
                          <XCircle className="me-2" size={20} />
                        )}
                        {notification.type === "info" && (
                          <Info className="me-2" size={20} />
                        )}
                        <h6 className="fw-bold mb-0">
                          {notification.type === "success"
                            ? "Success"
                            : notification.type === "danger"
                            ? "Error"
                            : "Information"}
                        </h6>
                      </div>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() =>
                          setNotification({ ...notification, show: false })
                        }
                      ></button>
                    </div>
                    <div className="card-body">
                      <p className="mb-0">{notification.message}</p>
                    </div>
                  </div>
                )}

                {/* Add Export All Buttons */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center gap-1"
                    onClick={() => setShowLetterModal(true)}
                  >
                    <FileEdit size={16} />
                    Generate New Letter
                  </button>
                  {generatedLetters.length > 0 && (
                    <>
                      <button
                        type="button"
                        className="btn btn-success d-flex align-items-center gap-1"
                        onClick={exportAllLettersExcel}
                      >
                        <FileSpreadsheet size={16} />
                        Export All Excel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger d-flex align-items-center gap-1"
                        onClick={exportAllLettersPDF}
                      >
                        <File size={16} />
                        Export All PDF
                      </button>
                    </>
                  )}
                </div>

                {/* Generation Statistics */}
                <div className="row mb-4">
                  <div className="col-6 col-md-3">
                    <div className="card border">
                      <div className="card-body text-center py-3">
                        <div className="h4 fw-bold text-primary">
                          {generatedLetters.length}
                        </div>
                        <div className="small text-muted">Total Generated</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="card border">
                      <div className="card-body text-center py-3">
                        <div className="h4 fw-bold text-success">
                          {
                            generatedLetters.filter(
                              (l) => l.status === "approved"
                            ).length
                          }
                        </div>
                        <div className="small text-muted">Approved</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="card border">
                      <div className="card-body text-center py-3">
                        <div className="h4 fw-bold text-warning">
                          {
                            generatedLetters.filter(
                              (l) => l.status === "pending"
                            ).length
                          }
                        </div>
                        <div className="small text-muted">Pending</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="card border">
                      <div className="card-body text-center py-3">
                        <div className="h4 fw-bold text-danger">
                          {
                            generatedLetters.filter(
                              (l) => l.status === "rejected"
                            ).length
                          }
                        </div>
                        <div className="small text-muted">Rejected</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generated Letters Table */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th className="min-width-120">Letter ID</th>
                        <th className="min-width-150">Template</th>
                        <th className="min-width-120">Employee</th>
                        <th className="d-none d-md-table-cell min-width-100">
                          Designation
                        </th>
                        <th className="d-none d-lg-table-cell min-width-100">
                          Department
                        </th>
                        <th className="min-width-100">Generated Date</th>
                        <th className="min-width-80">Status</th>
                        <th className="min-width-200">Actions</th>
                        <th className="min-width-100">Export</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedLetters.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-4">
                            <div className="text-muted">
                              <FileEdit size={24} className="mb-2" />
                              <p className="mb-0">No letters generated yet</p>
                              <small>
                                Click "Generate New Letter" to create your first
                                letter
                              </small>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        generatedLetters.map((letter) => (
                          <tr key={letter.id}>
                            <td className="small fw-bold">{letter.letterId}</td>
                            <td className="text-truncate">
                              {letter.templateName}
                            </td>
                            <td>
                              <div className="fw-medium">
                                {letter.employeeName}
                              </div>
                              <small className="text-muted">
                                {letter.employeeId}
                              </small>
                            </td>
                            <td className="d-none d-md-table-cell">
                              {letter.designation}
                            </td>
                            <td className="d-none d-lg-table-cell">
                              {letter.department}
                            </td>
                            <td>{formatDate(letter.generatedDate)}</td>
                            <td>
                              {letter.status === "approved" && (
                                <span className="badge bg-success">
                                  Approved
                                </span>
                              )}
                              {letter.status === "pending" && (
                                <span className="badge bg-warning">
                                  Pending
                                </span>
                              )}
                              {letter.status === "rejected" && (
                                <span className="badge bg-danger">
                                  Rejected
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-info btn-sm"
                                  onClick={() =>
                                    handleViewLetterDetails(letter)
                                  }
                                  title="View Details"
                                >
                                  <Eye size={12} />
                                </button>
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEditLetter(letter)}
                                  title="Edit"
                                >
                                  <Edit size={12} />
                                </button>
                                {letter.status === "pending" && (
                                  <>
                                    <button
                                      className="btn btn-outline-success btn-sm"
                                      onClick={() =>
                                        handleApproveGeneratedLetter(letter.id)
                                      }
                                      title="Approve"
                                    >
                                      <CheckCircle size={12} />
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => {
                                        // Direct reject with a default reason
                                        handleRejectGeneratedLetter(
                                          letter.id,
                                          "Rejected by HR Manager"
                                        );
                                      }}
                                      title="Reject"
                                    >
                                      <XCircle size={12} />
                                    </button>
                                  </>
                                )}
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => {
                                    // Direct delete action
                                    handleDeleteGeneratedLetter(letter.id);
                                  }}
                                  title="Delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => downloadLetterPDF(letter)}
                                  title="Download PDF"
                                >
                                  <File size={12} />
                                </button>
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => downloadLetterExcel(letter)}
                                  title="Download Excel"
                                >
                                  <FileSpreadsheet size={12} />
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
          </div>
        </div>
      )}

      {/* Requests Section */}
      {activeSection === "requests" && (
        <div className="row g-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h6 className="fw-bold mb-2 mb-md-0">
                  <ClipboardList className="me-2" size={18} />
                  Letter Requests ({letterRequests.length})
                </h6>
                <div className="d-flex flex-wrap gap-1 gap-md-2 align-items-center">
                  <span className="badge bg-warning small">
                    {statistics.pendingRequests} pending
                  </span>
                  <span className="badge bg-success small">
                    {statistics.approvedRequests} approved
                  </span>
                  <span className="badge bg-danger small">
                    {statistics.rejectedRequests} rejected
                  </span>
                  {/* Add Export All Button */}
                  {letterRequests.length > 0 && (
                    <div className="dropdown d-inline-block ms-2">
                      <button
                        className="btn btn-sm btn-outline-primary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <Download size={14} className="me-1" />
                        Export
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => exportAllRequestsPDF()}
                          >
                            <File size={14} className="me-2" />
                            Export All as PDF
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => exportAllRequestsExcel()}
                          >
                            <FileSpreadsheet size={14} className="me-2" />
                            Export All as Excel
                          </button>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => exportFilteredRequestsPDF()}
                          >
                            <Filter size={14} className="me-2" />
                            Export Filtered as PDF
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => exportFilteredRequestsExcel()}
                          >
                            <FileSpreadsheet size={14} className="me-2" />
                            Export Filtered as Excel
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="min-width-120">Request ID</th>
                        <th className="d-none d-md-table-cell min-width-120">
                          Employee
                        </th>
                        <th className="d-none d-lg-table-cell min-width-100">
                          Designation
                        </th>
                        <th className="d-none d-xl-table-cell min-width-100">
                          Department
                        </th>
                        <th className="min-width-100">Type</th>
                        <th className="d-none d-sm-table-cell min-width-100">
                          Last Increment
                        </th>
                        <th className="d-none d-sm-table-cell min-width-80">
                          <div className="d-flex align-items-center">
                            Date
                            <button
                              className="btn btn-link p-0 ms-1"
                              onClick={() => {
                                // Sort by date
                                const sorted = [...letterRequests].sort(
                                  (a, b) =>
                                    new Date(b.requestDate || 0) -
                                    new Date(a.requestDate || 0)
                                );
                                setLetterRequests(sorted);
                              }}
                              title="Sort by Date (Newest First)"
                            >
                              <ArrowUpDown size={12} />
                            </button>
                          </div>
                        </th>
                        <th className="min-width-80">Status</th>
                        <th className="d-none d-lg-table-cell min-width-80">
                          Priority
                        </th>
                        <th className="min-width-250">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request) => {
                        // Ensure date is properly formatted
                        const requestDate =
                          request.requestDate ||
                          (() => {
                            // Generate a realistic date if missing
                            const date = new Date();
                            date.setDate(date.getDate() - request.id);
                            return date.toISOString().split("T")[0];
                          })();

                        return (
                          <tr key={request.id}>
                            <td className="small text-truncate">
                              {request.requestId}
                              <div className="d-block d-sm-none small text-muted">
                                {formatDate(requestDate)}
                              </div>
                            </td>
                            <td className="d-none d-md-table-cell">
                              <div className="text-truncate">
                                {request.employeeName}
                              </div>
                              <small className="text-muted d-block text-truncate">
                                {request.employeeId}
                              </small>
                            </td>
                            <td className="d-none d-lg-table-cell text-truncate">
                              {request.designation || "Senior Developer"}
                            </td>
                            <td className="d-none d-xl-table-cell text-truncate">
                              {request.department || "Engineering"}
                            </td>
                            <td
                              className="text-truncate"
                              title={request.templateName}
                            >
                              <div className="small fw-medium">
                                {request.templateName}
                              </div>
                              <small className="text-muted d-block d-md-none">
                                {getPriorityBadge(request.priority)}
                              </small>
                            </td>
                            <td className="d-none d-sm-table-cell">
                              {request.lastIncrement
                                ? formatDate(request.lastIncrement)
                                : "2023-04-15"}
                            </td>
                            <td className="d-none d-sm-table-cell">
                              <div className="d-flex align-items-center">
                                <Calendar
                                  size={12}
                                  className="me-1 text-muted"
                                />
                                <span className="fw-medium">
                                  {formatDate(requestDate)}
                                </span>
                                <button
                                  className="btn btn-link p-0 ms-1"
                                  onClick={() => {
                                    // Edit date functionality
                                    const newDate = prompt(
                                      "Enter new date (YYYY-MM-DD):",
                                      requestDate
                                    );
                                    if (
                                      newDate &&
                                      /^\d{4}-\d{2}-\d{2}$/.test(newDate)
                                    ) {
                                      const updatedRequests =
                                        letterRequests.map((req) =>
                                          req.id === request.id
                                            ? { ...req, requestDate: newDate }
                                            : req
                                        );
                                      setLetterRequests(updatedRequests);

                                      setNotification({
                                        show: true,
                                        type: "info",
                                        message: `Date updated for request ${request.requestId}`,
                                      });
                                    }
                                  }}
                                  title="Edit Date"
                                >
                                  <Edit size={10} />
                                </button>
                              </div>
                            </td>
                            <td>{getStatusBadge(request.status)}</td>
                            <td className="d-none d-lg-table-cell">
                              {getPriorityBadge(request.priority)}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm btn-icon"
                                  onClick={() => handleViewAuditTrail(request)}
                                  title="View Details"
                                >
                                  <Eye size={12} />
                                </button>

                                {request.status === "pending" && (
                                  <>
                                    <button
                                      type="button"
                                      className="btn btn-outline-success btn-sm btn-icon"
                                      onClick={() =>
                                        handleApproveRequest(request.id)
                                      }
                                      title="Approve"
                                    >
                                      <CheckCircle size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm btn-icon"
                                      onClick={() =>
                                        handleRejectRequest(request.id)
                                      }
                                      title="Reject"
                                    >
                                      <XCircle size={12} />
                                    </button>
                                  </>
                                )}

                                {/* Download Individual Request Button */}
                                <button
                                  type="button"
                                  className="btn btn-outline-info btn-sm btn-icon"
                                  onClick={() => downloadRequestPDF(request)}
                                  title="Download as PDF"
                                >
                                  <File size={12} />
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-outline-success btn-sm btn-icon"
                                  onClick={() => downloadRequestExcel(request)}
                                  title="Download as Excel"
                                >
                                  <FileSpreadsheet size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Section */}
      {activeSection === "workflow" && (
        <div className="row g-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-0">
                      <GitBranch className="me-2" size={18} />
                      Letter Generation Workflow
                    </h6>
                    <small>
                      Complete workflow management with employee requests,
                      approvals, digital signatures, and audit trails
                    </small>
                  </div>
                  {/* Add Export Dropdown */}
                  {workflowRequests.length > 0 && (
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-outline-light dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <Download size={14} className="me-1" />
                        Export
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => exportAllWorkflowsPDF()}
                          >
                            <File size={14} className="me-2" />
                            Export All as PDF
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => exportAllWorkflowsExcel()}
                          >
                            <FileSpreadsheet size={14} className="me-2" />
                            Export All as Excel
                          </button>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => exportFilteredWorkflowsPDF()}
                          >
                            <Filter size={14} className="me-2" />
                            Export Filtered as PDF
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => exportFilteredWorkflowsExcel()}
                          >
                            <FileSpreadsheet size={14} className="me-2" />
                            Export Filtered as Excel
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                {/* Notification Card */}
                {notification.show && (
                  <div
                    className={`alert alert-${notification.type} alert-dismissible fade show mb-4`}
                  >
                    <div className="d-flex align-items-center">
                      {notification.type === "success" && (
                        <CheckCircle size={20} className="me-2" />
                      )}
                      {notification.type === "info" && (
                        <Info size={20} className="me-2" />
                      )}
                      {notification.type === "warning" && (
                        <AlertTriangle size={20} className="me-2" />
                      )}
                      {notification.type === "danger" && (
                        <XCircle size={20} className="me-2" />
                      )}
                      <span className="flex-grow-1">
                        {notification.message}
                      </span>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() =>
                          setNotification({
                            show: false,
                            type: "",
                            message: "",
                          })
                        }
                      ></button>
                    </div>
                  </div>
                )}

                {/* Confirmation Card for Bulk Approve */}
                {showBulkApproveConfirm && (
                  <div className="card border-warning mb-4">
                    <div className="card-body">
                      <div className="d-flex">
                        <AlertTriangle
                          size={24}
                          className="text-warning me-3"
                        />
                        <div className="flex-grow-1">
                          <h6 className="fw-bold text-warning mb-2">
                            Confirm Bulk Approval
                          </h6>
                          <p className="mb-0">
                            Are you sure you want to approve all{" "}
                            {pendingRequestsCount} pending requests?
                          </p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setShowBulkApproveConfirm(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={confirmBulkApprove}
                        >
                          Yes, Approve All
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rejection Reason Card */}
                {showRejectReasonCard && selectedRequestToReject && (
                  <div className="card border-danger mb-4 shadow-sm">
                    <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <XCircle className="me-2" size={20} />
                        <h6 className="fw-bold mb-0">Reject Request</h6>
                      </div>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={() => {
                          setShowRejectReasonCard(false);
                          setSelectedRequestToReject(null);
                          setRejectionReason("");
                        }}
                      ></button>
                    </div>

                    <div className="card-body">
                      {/* Request Information - Responsive Grid */}
                      <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6">
                          <div className="card border">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center mb-2">
                                <FileText
                                  size={16}
                                  className="text-muted me-2"
                                />
                                <small className="text-muted">Request ID</small>
                              </div>
                              <div className="fw-bold text-truncate">
                                {selectedRequestToReject.requestId}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="card border">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center mb-2">
                                <User size={16} className="text-muted me-2" />
                                <small className="text-muted">Employee</small>
                              </div>
                              <div className="fw-bold text-truncate">
                                {selectedRequestToReject.employeeName}
                              </div>
                              <small className="text-muted">
                                {selectedRequestToReject.employeeId}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Employee Details - Collapsible on Mobile */}
                      <div className="row g-3 mb-4">
                        <div className="col-12 col-md-4">
                          <div className="card border">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center mb-2">
                                <Briefcase
                                  size={16}
                                  className="text-muted me-2"
                                />
                                <small className="text-muted">
                                  Designation
                                </small>
                              </div>
                              <div className="small fw-medium text-truncate">
                                {selectedRequestToReject.designation ||
                                  "Senior Developer"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="card border">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center mb-2">
                                <Building
                                  size={16}
                                  className="text-muted me-2"
                                />
                                <small className="text-muted">Department</small>
                              </div>
                              <div className="small fw-medium text-truncate">
                                {selectedRequestToReject.department ||
                                  "Engineering"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="card border">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center mb-2">
                                <FileText
                                  size={16}
                                  className="text-muted me-2"
                                />
                                <small className="text-muted">
                                  Letter Type
                                </small>
                              </div>
                              <div className="small fw-medium text-truncate">
                                {selectedRequestToReject.templateName}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rejection Reason Input */}
                      <div className="mb-4">
                        <label className="form-label fw-bold d-flex align-items-center mb-3">
                          <AlertCircle size={18} className="text-danger me-2" />
                          Rejection Reason *
                          <span className="text-danger ms-1">(Required)</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <Edit size={16} className="text-muted" />
                          </span>
                          <textarea
                            className="form-control"
                            rows="4"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a detailed reason for rejection. This will be recorded in the audit trail and may be shared with the employee."
                            style={{ resize: "vertical" }}
                          />
                        </div>
                        <div className="form-text text-muted mt-2">
                          <small>
                            <Info size={12} className="me-1" />
                            Enter a clear and professional reason. This will be
                            visible in the audit trail.
                          </small>
                        </div>
                      </div>

                      {/* Quick Reason Suggestions */}
                      <div className="mb-4">
                        <label className="form-label small fw-bold text-muted mb-2">
                          <Lightbulb size={14} className="me-1" />
                          Quick Suggestions:
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                          {[
                            "Incomplete information provided",
                            "Documentation requirements not met",
                            "Policy violation",
                            "Insufficient justification",
                            "Pending clearance from other departments",
                            "Timeline constraints",
                            "Budgetary restrictions",
                          ].map((reason, index) => (
                            <button
                              key={index}
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                setRejectionReason((prev) =>
                                  prev ? `${prev}\n${reason}` : reason
                                )
                              }
                            >
                              {reason}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons - Responsive Layout */}
                      <div className="row g-2 mt-4">
                        <div className="col-12 col-md-6 order-2 order-md-1">
                          <button
                            className="btn btn-outline-secondary w-100 h-100 d-flex align-items-center justify-content-center py-2"
                            onClick={() => {
                              setShowRejectReasonCard(false);
                              setSelectedRequestToReject(null);
                              setRejectionReason("");
                            }}
                          >
                            <X size={16} className="me-2" />
                            Cancel
                          </button>
                        </div>
                        <div className="col-12 col-md-6 order-1 order-md-2 mb-2 mb-md-0">
                          <button
                            className="btn btn-danger w-100 d-flex align-items-center justify-content-center py-2"
                            onClick={handleConfirmRejection}
                            disabled={!rejectionReason.trim()}
                          >
                            <CheckCircle size={16} className="me-2" />
                            Confirm Rejection
                          </button>
                          {!rejectionReason.trim() && (
                            <small className="text-danger d-block mt-1 text-center">
                              <AlertCircle size={12} className="me-1" />
                              Please enter a rejection reason
                            </small>
                          )}
                        </div>
                      </div>

                      {/* Warning Message */}
                      <div className="alert alert-warning mt-4 p-2 p-md-3">
                        <div className="d-flex">
                          <AlertTriangle
                            size={18}
                            className="me-2 flex-shrink-0"
                          />
                          <div>
                            <small className="fw-bold">Important:</small>
                            <small className="d-block">
                              This action cannot be undone. The request will be
                              marked as rejected in the system audit trail.
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Workflow Report Card */}
                {showWorkflowReport && (
                  <div
                    className="modal show d-block"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1060,
                    }}
                  >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                      <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header bg-info text-white">
                          <div className="d-flex align-items-center">
                            <FileText className="me-2" size={20} />
                            <h5 className="modal-title fw-bold mb-0">
                              Workflow Analytics Report
                            </h5>
                          </div>
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => setShowWorkflowReport(false)}
                            aria-label="Close"
                          ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                          {/* Report Summary */}
                          <div className="alert alert-info mb-4">
                            <div className="d-flex">
                              <Info size={20} className="me-2 flex-shrink-0" />
                              <div>
                                <strong>Report Generated:</strong>{" "}
                                {new Date().toLocaleDateString()}{" "}
                                {new Date().toLocaleTimeString()}
                                <div className="small mt-1">
                                  Showing analytics for all workflow requests
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="card border mb-3 h-100">
                                <div className="card-header bg-light">
                                  <h6 className="fw-bold mb-0 d-flex align-items-center">
                                    <CheckCircle
                                      className="me-2 text-success"
                                      size={18}
                                    />
                                    Status Summary
                                  </h6>
                                </div>
                                <div className="card-body">
                                  <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                    <span>Completed:</span>
                                    <span className="fw-bold text-success fs-5">
                                      {completedCount}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                    <span>In Progress:</span>
                                    <span className="fw-bold text-primary fs-5">
                                      {inProgressCount}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                    <span>Pending Approval:</span>
                                    <span className="fw-bold text-warning fs-5">
                                      {pendingApprovalCount}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span>Terminated:</span>
                                    <span className="fw-bold text-danger fs-5">
                                      {terminatedCount}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="card border mb-3 h-100">
                                <div className="card-header bg-light">
                                  <h6 className="fw-bold mb-0 d-flex align-items-center">
                                    <TrendingUp
                                      className="me-2 text-info"
                                      size={18}
                                    />
                                    Performance Metrics
                                  </h6>
                                </div>
                                <div className="card-body">
                                  <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                    <span>Total Workflows:</span>
                                    <span className="fw-bold fs-5">
                                      {workflowRequests.length}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                    <span>Average SLA:</span>
                                    <span className="fw-bold text-info fs-5">
                                      {calculateAverageSLA()}
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between">
                                    <span>Completion Rate:</span>
                                    <span className="fw-bold text-success fs-5">
                                      {calculateCompletionRate()}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                          <div className="d-flex flex-wrap justify-content-between w-100 align-items-center">
                            <div className="text-muted small">
                              <Clock size={14} className="me-1" />
                              Last updated: {new Date().toLocaleTimeString()}
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-info text-white"
                                onClick={() => setShowWorkflowReport(false)}
                              >
                                Close Report
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Digital Signature Details Card */}
                {showDigitalSignatureCard && selectedSignatureRequest && (
                  <div
                    className="modal show d-block"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1050,
                    }}
                  >
                    <div className="modal-dialog modal-dialog-centered modal-md">
                      <div className="modal-content">
                        <div className="modal-header bg-info text-white">
                          <div className="d-flex align-items-center">
                            <FileSignature className="me-2" size={18} />
                            <h5 className="modal-title fw-bold mb-0 fs-6">
                              Digital Signature Details
                            </h5>
                          </div>
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => {
                              setShowDigitalSignatureCard(false);
                              setSelectedSignatureRequest(null);
                            }}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="mb-3">
                            <div className="card border mb-3">
                              <div className="card-body">
                                <h6 className="fw-bold mb-3">
                                  Signature Information
                                </h6>
                                <div className="row">
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Request ID
                                    </small>
                                    <span className="fw-medium small d-block">
                                      {selectedSignatureRequest.requestId}
                                    </span>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Status
                                    </small>
                                    <span className="badge bg-success small">
                                      VERIFIED
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <small className="text-muted d-block">
                                    Verification Code
                                  </small>
                                  <code className="bg-light p-2 rounded d-block small">
                                    VER-{new Date().getFullYear()}-
                                    {selectedSignatureRequest.id}
                                  </code>
                                </div>
                              </div>
                            </div>

                            <div className="card border">
                              <div className="card-body">
                                <h6 className="fw-bold mb-3">
                                  Verification Details
                                </h6>
                                <div className="row">
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Verified By
                                    </small>
                                    <span className="fw-medium small d-block">
                                      HR Department
                                    </span>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted d-block">
                                      Expiry Date
                                    </small>
                                    <span className="fw-medium small d-block">
                                      {new Date(
                                        Date.now() + 90 * 24 * 60 * 60 * 1000
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <small className="text-muted d-block">
                                    Timestamp
                                  </small>
                                  <span className="fw-medium small d-block">
                                    {new Date().toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            className="btn btn-info text-white btn-sm"
                            onClick={() => {
                              setShowDigitalSignatureCard(false);
                              setSelectedSignatureRequest(null);
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Workflow Actions Section */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowRequestModal(true)}
                  >
                    <Plus size={16} className="me-2" />
                    Start New Workflow
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      setPendingRequestsCount(
                        workflowRequests.filter(
                          (r) => r.status === "pending_approval"
                        ).length
                      );
                      setShowBulkApproveConfirm(true);
                    }}
                  >
                    <CheckCircle size={16} className="me-2" />
                    Bulk Approve All
                  </button>
                  <button
                    className="btn btn-info text-white"
                    onClick={() => {
                      setCompletedCount(
                        workflowRequests.filter(
                          (r) => r.workflowStatus === "completed"
                        ).length
                      );
                      setInProgressCount(
                        workflowRequests.filter(
                          (r) => r.workflowStatus === "in_progress"
                        ).length
                      );
                      setPendingApprovalCount(
                        workflowRequests.filter(
                          (r) => r.status === "pending_approval"
                        ).length
                      );
                      setTerminatedCount(
                        workflowRequests.filter(
                          (r) => r.workflowStatus === "terminated"
                        ).length
                      );
                      setShowWorkflowReport(true);
                    }}
                  >
                    <FileText size={16} className="me-2" />
                    Generate Report
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => simulateEmployeeRequest()}
                  >
                    <User size={16} className="me-2" />
                    Simulate Employee Request
                  </button>
                </div>

                {/* Workflow Statistics */}
                <div className="row mb-4">
                  <div className="col-6 col-md-3">
                    <div className="card border hover-lift">
                      <div className="card-body text-center">
                        <div className="h4 fw-bold text-primary">
                          {
                            workflowRequests.filter(
                              (r) => r.workflowStatus === "in_progress"
                            ).length
                          }
                        </div>
                        <div className="small text-muted">In Progress</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="card border hover-lift">
                      <div className="card-body text-center">
                        <div className="h4 fw-bold text-success">
                          {
                            workflowRequests.filter(
                              (r) => r.workflowStatus === "completed"
                            ).length
                          }
                        </div>
                        <div className="small text-muted">Completed</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="card border hover-lift">
                      <div className="card-body text-center">
                        <div className="h4 fw-bold text-warning">
                          {
                            workflowRequests.filter(
                              (r) => r.status === "pending_approval"
                            ).length
                          }
                        </div>
                        <div className="small text-muted">Pending Approval</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="card border hover-lift">
                      <div className="card-body text-center">
                        <div className="h4 fw-bold text-danger">
                          {
                            workflowRequests.filter(
                              (r) => r.workflowStatus === "terminated"
                            ).length
                          }
                        </div>
                        <div className="small text-muted">Terminated</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow Tabs */}
                <div className="col-12 mb-4 border-light">
                  <div className="d-flex border-bottom overflow-auto">
                    {/* All Workflows */}
                    <button
                      type="button"
                      onClick={() => setWorkflowView("all")}
                      className={`btn btn-link text-decoration-none py-3 px-4 d-flex align-items-center gap-2 flex-shrink-0 ${
                        workflowView === "all"
                          ? "border-bottom border-2 border-primary bg-primary text-light fw-semibold"
                          : "text-muted"
                      }`}
                    >
                      <GitBranch size={18} />
                      <span>All Workflows ({workflowRequests.length})</span>
                    </button>

                    {/* Active */}
                    <button
                      type="button"
                      onClick={() => setWorkflowView("active")}
                      className={`btn btn-link text-decoration-none py-3 px-4 d-flex align-items-center gap-2 flex-shrink-0 ${
                        workflowView === "active"
                          ? "border-bottom border-2 border-primary bg-primary text-light fw-semibold"
                          : "text-muted"
                      }`}
                    >
                      <Clock size={18} />
                      <span>
                        Active (
                        {
                          workflowRequests.filter(
                            (r) => r.workflowStatus === "in_progress"
                          ).length
                        }
                        )
                      </span>
                    </button>

                    {/* Pending */}
                    <button
                      type="button"
                      onClick={() => setWorkflowView("pending")}
                      className={`btn btn-link text-decoration-none py-3 px-4 d-flex align-items-center gap-2 flex-shrink-0 ${
                        workflowView === "pending"
                          ? "border-bottom border-2 border-primary bg-primary text-light fw-semibold"
                          : "text-muted"
                      }`}
                    >
                      <AlertCircle size={18} />
                      <span>
                        Pending (
                        {
                          workflowRequests.filter(
                            (r) => r.status === "pending_approval"
                          ).length
                        }
                        )
                      </span>
                    </button>

                    {/* Completed */}
                    <button
                      type="button"
                      onClick={() => setWorkflowView("completed")}
                      className={`btn btn-link text-decoration-none py-3 px-4 d-flex align-items-center gap-2 flex-shrink-0 ${
                        workflowView === "completed"
                          ? "border-bottom border-2 border-primary bg-primary text-light fw-semibold"
                          : "text-muted"
                      }`}
                    >
                      <CheckCircle size={18} />
                      <span>
                        Completed (
                        {
                          workflowRequests.filter(
                            (r) => r.workflowStatus === "completed"
                          ).length
                        }
                        )
                      </span>
                    </button>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="row mb-4">
                  <div className="col-md-4">
                    <select
                      className="form-select form-select-sm"
                      onChange={(e) =>
                        setWorkflowFilter({
                          ...workflowFilter,
                          templateType: e.target.value,
                        })
                      }
                      value={workflowFilter.templateType}
                    >
                      <option value="">All Templates</option>
                      {letterTemplates.map((template) => (
                        <option key={template.id} value={template.templateType}>
                          {template.templateName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select form-select-sm"
                      onChange={(e) =>
                        setWorkflowFilter({
                          ...workflowFilter,
                          priority: e.target.value,
                        })
                      }
                      value={workflowFilter.priority}
                    >
                      <option value="">All Priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search workflows..."
                        value={workflowFilter.search}
                        onChange={(e) =>
                          setWorkflowFilter({
                            ...workflowFilter,
                            search: e.target.value,
                          })
                        }
                      />
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => {}}
                      >
                        <Search size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Workflow Table */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "120px" }}>Request ID</th>
                        <th style={{ width: "150px" }}>Employee</th>
                        <th style={{ width: "120px" }}>Designation</th>
                        <th style={{ width: "120px" }}>Department</th>
                        <th style={{ width: "120px" }}>Letter Type</th>
                        <th style={{ width: "100px" }}>Current Step</th>
                        <th style={{ width: "100px" }}>Status</th>
                        <th style={{ width: "80px" }}>SLA</th>
                        <th style={{ width: "100px" }}>Last Promoted</th>
                        <th style={{ width: "180px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWorkflows.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center py-4">
                            <div className="text-muted">
                              <GitBranch size={24} className="mb-2" />
                              <p className="mb-0">No workflows found</p>
                              <small>
                                Start a new workflow or adjust your filters
                              </small>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredWorkflows.map((request) => {
                          const template = letterTemplates.find(
                            (t) => t.templateType === request.templateType
                          );
                          const currentStepIndex =
                            template?.workflowSteps?.findIndex(
                              (step) => step === request.currentStep
                            ) || 0;
                          const totalSteps =
                            template?.workflowSteps?.length || 0;
                          const progressPercentage =
                            totalSteps > 0
                              ? ((currentStepIndex + 1) / totalSteps) * 100
                              : 0;

                          return (
                            <tr key={request.id}>
                              <td>
                                <div className="small fw-bold text-truncate">
                                  {request.requestId}
                                </div>
                                <small className="text-muted">
                                  {formatDate(request.requestDate)}
                                </small>
                              </td>
                              <td>
                                <div className="fw-medium text-truncate">
                                  {request.employeeName}
                                </div>
                                <small className="text-muted d-block text-truncate">
                                  {request.employeeId}
                                </small>
                              </td>
                              <td>
                                <div
                                  className="text-truncate"
                                  title={
                                    request.designation || "Senior Developer"
                                  }
                                >
                                  {request.designation || "Senior Developer"}
                                </div>
                              </td>
                              <td>
                                <div
                                  className="text-truncate"
                                  title={request.department || "Engineering"}
                                >
                                  {request.department || "Engineering"}
                                </div>
                              </td>
                              <td>
                                <div className="text-truncate">
                                  {request.templateName}
                                </div>
                                <small className="text-muted d-block">
                                  {getPriorityBadge(request.priority)}
                                </small>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div
                                    className="progress flex-grow-1 me-2"
                                    style={{ height: "4px" }}
                                  >
                                    <div
                                      className="progress-bar"
                                      style={{
                                        width: `${progressPercentage}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <small className="text-nowrap">
                                    {currentStepIndex + 1}/{totalSteps}
                                  </small>
                                </div>
                                <small className="text-muted d-block text-truncate">
                                  {request.currentStep}
                                </small>
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  {getStatusBadge(request.status)}
                                  {request.autoApproved && (
                                    <small className="text-success mt-1">
                                      <Zap size={10} className="me-1" />
                                      Auto-approved
                                    </small>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Clock
                                    size={12}
                                    className="me-1 text-warning"
                                  />
                                  <small>{template?.sla || "24h"}</small>
                                </div>
                              </td>
                              <td>
                                <div className="small">
                                  {request.lastPromoted
                                    ? formatDate(request.lastPromoted)
                                    : "2023-06-15"}
                                </div>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                      handleViewWorkflowDetails(request.id)
                                    }
                                    title="View Details"
                                  >
                                    <Eye size={12} />
                                  </button>

                                  {request.status === "pending_approval" && (
                                    <>
                                      <button
                                        className="btn btn-outline-success"
                                        onClick={() =>
                                          handleWorkflowApproval(request.id)
                                        }
                                        title="Approve"
                                      >
                                        <CheckCircle size={12} />
                                      </button>
                                      <button
                                        className="btn btn-outline-danger"
                                        onClick={() => {
                                          // Set the request for rejection
                                          setSelectedRequestToReject(request);
                                          setShowRejectReasonCard(true);
                                        }}
                                        title="Reject"
                                      >
                                        <XCircle size={12} />
                                      </button>
                                    </>
                                  )}

                                  {request.workflowStatus === "in_progress" &&
                                    request.currentStep && (
                                      <button
                                        className="btn btn-outline-warning"
                                        onClick={() =>
                                          handleAdvanceWorkflow(request.id)
                                        }
                                        title="Advance Step"
                                      >
                                        <ChevronRight size={12} />
                                      </button>
                                    )}

                                  {request.digitalSignature &&
                                    request.workflowStatus === "completed" && (
                                      <button
                                        className="btn btn-outline-info"
                                        onClick={() => {
                                          // Set the signature request
                                          setSelectedSignatureRequest(request);
                                          setShowDigitalSignatureCard(true);
                                        }}
                                        title="View Digital Signature"
                                      >
                                        <FileSignature size={12} />
                                      </button>
                                    )}

                                  {/* Download Individual Workflow Button */}
                                  <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => downloadWorkflowPDF(request)}
                                    title="Download as PDF"
                                  >
                                    <File size={12} />
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

                {/* Workflow Details Modal */}
                {showWorkflowDetails && selectedWorkflow && (
                  <div
                    className="modal show d-block"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1060,
                    }}
                  >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                      <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                          <h5 className="modal-title fw-bold">
                            <GitBranch className="me-2" size={18} />
                            Workflow Details: {selectedWorkflow.requestId}
                          </h5>
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => {
                              setShowWorkflowDetails(false);
                              setSelectedWorkflow(null);
                            }}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="row mb-4">
                            <div className="col-md-6">
                              <div className="card border">
                                <div className="card-body">
                                  <h6 className="fw-bold mb-3">
                                    Request Information
                                  </h6>
                                  <div className="mb-2">
                                    <small className="text-muted d-block">
                                      Request ID
                                    </small>
                                    <span className="fw-medium">
                                      {selectedWorkflow.requestId}
                                    </span>
                                  </div>
                                  <div className="mb-2">
                                    <small className="text-muted d-block">
                                      Employee
                                    </small>
                                    <span className="fw-medium">
                                      {selectedWorkflow.employeeName} (
                                      {selectedWorkflow.employeeId})
                                    </span>
                                  </div>
                                  <div className="mb-2">
                                    <small className="text-muted d-block">
                                      Letter Type
                                    </small>
                                    <span className="fw-medium">
                                      {selectedWorkflow.templateName}
                                    </span>
                                  </div>
                                  <div className="mb-2">
                                    <small className="text-muted d-block">
                                      Purpose
                                    </small>
                                    <span className="fw-medium">
                                      {selectedWorkflow.purpose}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="card border">
                                <div className="card-body">
                                  <h6 className="fw-bold mb-3">
                                    Workflow Status
                                  </h6>
                                  <div className="mb-2">
                                    <small className="text-muted d-block">
                                      Current Status
                                    </small>
                                    {getStatusBadge(selectedWorkflow.status)}
                                  </div>
                                  <div className="mb-2">
                                    <small className="text-muted d-block">
                                      Current Step
                                    </small>
                                    <span className="fw-medium">
                                      {selectedWorkflow.currentStep}
                                    </span>
                                  </div>
                                  <div className="mb-2">
                                    <small className="text-muted d-block">
                                      Priority
                                    </small>
                                    {getPriorityBadge(
                                      selectedWorkflow.priority
                                    )}
                                  </div>
                                  <div className="mb-2">
                                    <small className="text-muted d-block">
                                      Requested On
                                    </small>
                                    <span className="fw-medium">
                                      {formatDate(selectedWorkflow.requestDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="card border mb-4">
                            <div className="card-header">
                              <h6 className="fw-bold mb-0">Audit Trail</h6>
                            </div>
                            <div className="card-body">
                              <div className="timeline">
                                {selectedWorkflow.auditTrail.map(
                                  (trail, index) => (
                                    <div
                                      key={index}
                                      className="timeline-item mb-3"
                                    >
                                      <div className="d-flex">
                                        <div
                                          className="timeline-marker bg-primary rounded-circle"
                                          style={{
                                            width: "12px",
                                            height: "12px",
                                            marginTop: "4px",
                                          }}
                                        ></div>
                                        <div className="ms-3 flex-grow-1">
                                          <div className="d-flex justify-content-between">
                                            <span className="fw-medium">
                                              {trail.action}
                                            </span>
                                            <small className="text-muted">
                                              {formatDateTime(trail.timestamp)}
                                            </small>
                                          </div>
                                          <div className="small text-muted">
                                            By: {trail.by} • Step: {trail.step}
                                          </div>
                                          {trail.details && (
                                            <div className="small mt-1 text-muted">
                                              {trail.details}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Add Download Button in Workflow Details */}
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() =>
                                downloadWorkflowPDF(selectedWorkflow)
                              }
                            >
                              <File size={14} className="me-2" />
                              Download as PDF
                            </button>
                            <button
                              className="btn btn-outline-success"
                              onClick={() =>
                                downloadWorkflowExcel(selectedWorkflow)
                              }
                            >
                              <FileSpreadsheet size={14} className="me-2" />
                              Download as Excel
                            </button>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setShowWorkflowDetails(false);
                              setSelectedWorkflow(null);
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Start New Workflow Modal */}
                {showRequestModal && (
                  <div
                    className="modal show d-block"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.5)",
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1060,
                    }}
                  >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                      <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                          <h5 className="modal-title fw-bold">
                            <Plus className="me-2" size={18} />
                            Start New Workflow
                          </h5>
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => setShowRequestModal(false)}
                          ></button>
                        </div>
                        <div className="modal-body">
                          {/* ... existing modal content ... */}
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setShowRequestModal(false);
                              // Reset form
                              setNewWorkflowTemplate("");
                              setNewWorkflowPriority("Medium");
                              setNewWorkflowPurpose("");
                              setNewWorkflowEmployee("");
                              setNewWorkflowEmployeeName("");
                              setNewWorkflowDesignation("");
                              setNewWorkflowDepartment("");
                              setNewWorkflowEmployeeEmail("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleCreateWorkflow()}
                            disabled={
                              !newWorkflowTemplate ||
                              !newWorkflowPurpose ||
                              !newWorkflowEmployee
                            }
                          >
                            Create Workflow
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Workflow Configuration */}
                <div className="mt-5">
                  <h6 className="fw-bold mb-4">
                    <Settings className="me-2" size={18} />
                    Workflow Configuration
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border">
                        <div className="card-body">
                          <h6 className="fw-bold mb-3">
                            Auto-Approval Configuration
                          </h6>
                          {letterTemplates.map((template) => (
                            <div key={template.id} className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={template.autoApprove}
                                onChange={(e) =>
                                  handleTemplateAutoApprove(
                                    template.id,
                                    e.target.checked
                                  )
                                }
                                id={`auto-${template.id}`}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`auto-${template.id}`}
                              >
                                {template.templateName}
                                <small className="text-muted d-block">
                                  {template.autoApprove
                                    ? "Auto-approved"
                                    : "Requires manual approval"}
                                </small>
                              </label>
                            </div>
                          ))}
                          <div className="mt-3">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setNotification({
                                  show: true,
                                  type: "success",
                                  message:
                                    "Workflow configuration saved successfully!",
                                });
                                saveWorkflowConfig();
                              }}
                            >
                              <Save size={14} className="me-2" />
                              Save Configuration
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border">
                        <div className="card-body">
                          <h6 className="fw-bold mb-3">
                            SLA & Priority Settings
                          </h6>
                          <div className="mb-3">
                            <label className="form-label small fw-bold">
                              High Priority SLA
                            </label>
                            <div className="input-group input-group-sm">
                              <input
                                type="number"
                                className="form-control"
                                defaultValue="4"
                                ref={slaHighRef}
                              />
                              <select
                                className="form-select"
                                style={{ width: "100px" }}
                              >
                                <option>hours</option>
                                <option>days</option>
                              </select>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label small fw-bold">
                              Medium Priority SLA
                            </label>
                            <div className="input-group input-group-sm">
                              <input
                                type="number"
                                className="form-control"
                                defaultValue="24"
                                ref={slaMediumRef}
                              />
                              <select
                                className="form-select"
                                style={{ width: "100px" }}
                              >
                                <option>hours</option>
                                <option>days</option>
                              </select>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label small fw-bold">
                              Low Priority SLA
                            </label>
                            <div className="input-group input-group-sm">
                              <input
                                type="number"
                                className="form-control"
                                defaultValue="72"
                                ref={slaLowRef}
                              />
                              <select
                                className="form-select"
                                style={{ width: "100px" }}
                              >
                                <option>hours</option>
                                <option>days</option>
                              </select>
                            </div>
                          </div>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              const highSLA = slaHighRef.current?.value || "4";
                              const mediumSLA =
                                slaMediumRef.current?.value || "24";
                              const lowSLA = slaLowRef.current?.value || "72";

                              setNotification({
                                show: true,
                                type: "success",
                                message: `SLA settings updated: High: ${highSLA} hours, Medium: ${mediumSLA} hours, Low: ${lowSLA} hours`,
                              });
                              saveSLASettings();
                            }}
                          >
                            <Save size={14} className="me-2" />
                            Update SLA Settings
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
      )}

      {/* Employee Portal Section */}
      {activeSection === "employee" && <EmployeePortal />}

      {/* Archive Section */}
      {activeSection === "archive" && (
        <div className="row g-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h6 className="fw-bold mb-2 mb-md-0">
                  <Archive className="me-2" size={18} />
                  Letter Archive ({letterArchive.length})
                </h6>
                <div className="d-flex flex-wrap gap-1 gap-md-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowLetterModal(true)}
                  >
                    <Plus size={14} className="me-1" />
                    Create New
                  </button>
                  {letterArchive.length > 0 && (
                    <>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={exportAllArchiveLettersExcel}
                      >
                        <FileSpreadsheet size={14} className="me-1" />
                        Export All Excel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={exportAllArchiveLettersPDF}
                      >
                        <File size={14} className="me-1" />
                        Export All PDF
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-body">
                {letterArchive.length === 0 ? (
                  <div className="text-center py-4">
                    <Archive size={32} className="text-muted mb-2" />
                    <h6 className="text-muted">No letters in archive</h6>
                    <p className="text-muted small mb-0">
                      Generated letters will appear here. Click "Create New" to
                      create your first letter.
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th className="min-width-120">Letter ID</th>
                          <th className="d-none d-md-table-cell min-width-120">
                            Type
                          </th>
                          <th className="min-width-120">Employee</th>
                          <th className="d-none d-lg-table-cell min-width-100">
                            Designation
                          </th>
                          <th className="d-none d-xl-table-cell min-width-100">
                            Department
                          </th>
                          <th className="d-none d-lg-table-cell min-width-80">
                            Generated
                          </th>
                          <th className="min-width-80">Downloads</th>
                          <th className="d-none d-sm-table-cell min-width-100">
                            Verification
                          </th>
                          <th className="d-none d-sm-table-cell min-width-80">
                            Status
                          </th>
                          <th className="min-width-250">Actions</th>
                          <th className="min-width-100">Export</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredArchive.map((letter) => (
                          <tr key={letter.id}>
                            <td className="small text-truncate">
                              {letter.letterId}
                              <small className="text-muted d-block d-md-none">
                                {letter.templateName}
                              </small>
                            </td>
                            <td className="d-none d-md-table-cell text-truncate">
                              {letter.templateName}
                            </td>
                            <td>
                              <div className="text-truncate">
                                {letter.employeeName}
                              </div>
                              <small className="text-muted d-block text-truncate">
                                {letter.employeeId}
                              </small>
                              <div className="d-block d-lg-none small">
                                <span className="text-muted">
                                  Designation:{" "}
                                </span>
                                {letter.designation || "Senior Developer"}
                              </div>
                            </td>
                            <td className="d-none d-lg-table-cell text-truncate">
                              {letter.designation || "Senior Developer"}
                            </td>
                            <td className="d-none d-xl-table-cell text-truncate">
                              {letter.department || "Engineering"}
                            </td>
                            <td className="d-none d-lg-table-cell">
                              {/* FIX: Use correct date field - generatedDate instead of generationDate */}
                              {formatDate(
                                letter.generatedDate ||
                                  letter.generationDate ||
                                  letter.approvalDate
                              )}
                              {letter.approvalDate && (
                                <small className="text-success d-block x-small">
                                  Approved: {formatDate(letter.approvalDate)}
                                </small>
                              )}
                            </td>
                            <td>
                              <div className="text-center">
                                <div className="fw-medium">
                                  {letter.downloadCount || 0}
                                </div>
                                {letter.lastAccessed && (
                                  <small className="text-muted d-block x-small">
                                    Last: {formatDate(letter.lastAccessed)}
                                  </small>
                                )}
                              </div>
                            </td>
                            <td className="d-none d-sm-table-cell">
                              <code className="small text-truncate d-block">
                                {letter.verificationCode || "N/A"}
                              </code>
                              {letter.digitalSignature && (
                                <small className="text-success d-block">
                                  <FileSignature size={10} className="me-1" />
                                  Signed
                                </small>
                              )}
                            </td>
                            <td className="d-none d-sm-table-cell">
                              {getStatusBadge(letter.status || "Active")}
                              {letter.rejectionReason && (
                                <small className="text-danger d-block x-small">
                                  Rejected
                                </small>
                              )}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                {/* View Details Button */}
                                <button
                                  className="btn btn-outline-info btn-icon"
                                  onClick={() => {
                                    setSelectedLetter(letter);
                                    setShowLetterDetailsCard(true);
                                  }}
                                  title="View Details"
                                >
                                  <Eye size={12} />
                                </button>

                                {/* Edit Button */}
                                <button
                                  className="btn btn-outline-primary btn-icon"
                                  onClick={() =>
                                    handleEditArchiveLetter(letter)
                                  }
                                  title="Edit Letter"
                                >
                                  <Edit size={12} />
                                </button>

                                {/* Approve Button (only for pending letters) */}
                                {(letter.status === "pending" ||
                                  !letter.status) && (
                                  <button
                                    className="btn btn-outline-success btn-icon"
                                    onClick={() =>
                                      handleApproveArchiveLetter(letter.id)
                                    }
                                    title="Approve Letter"
                                  >
                                    <CheckCircle size={12} />
                                  </button>
                                )}

                                {/* Reject Button (only for pending letters) */}
                                {(letter.status === "pending" ||
                                  !letter.status) && (
                                  <button
                                    className="btn btn-outline-warning btn-icon"
                                    onClick={() => {
                                      setSelectedLetterToReject(letter);
                                      setShowRejectCard(true);
                                    }}
                                    title="Reject Letter"
                                  >
                                    <XCircle size={12} />
                                  </button>
                                )}

                                {/* Delete Button */}
                                <button
                                  className="btn btn-outline-danger btn-icon"
                                  onClick={() => {
                                    setSelectedLetterToDelete(letter);
                                    setShowDeleteConfirm(true);
                                  }}
                                  title="Delete Letter"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                {/* PDF Download Button */}
                                <button
                                  className="btn btn-outline-primary btn-icon"
                                  onClick={() =>
                                    downloadArchiveLetterPDF(letter)
                                  }
                                  title="Download PDF"
                                >
                                  <File size={12} />
                                </button>
                                {/* Excel Download Button */}
                                <button
                                  className="btn btn-outline-success btn-icon"
                                  onClick={() =>
                                    downloadArchiveLetterExcel(letter)
                                  }
                                  title="Download Excel"
                                >
                                  <FileSpreadsheet size={12} />
                                </button>
                              </div>
                            </td>
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
      )}
      {/* Reject Confirmation Card */}
      {showRejectCard && selectedLetterToReject && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h6 className="modal-title fw-bold mb-0">Reject Letter</h6>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowRejectCard(false);
                    setSelectedLetterToReject(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-warning mb-3">
                  <AlertTriangle size={16} className="me-2" />
                  Are you sure you want to reject this letter?
                </div>

                <div className="card border mb-3">
                  <div className="card-body">
                    <h6 className="fw-bold mb-2">Letter Details</h6>
                    <small className="text-muted d-block">Letter ID</small>
                    <span className="fw-bold">
                      {selectedLetterToReject.letterId}
                    </span>

                    <small className="text-muted d-block mt-2">Employee</small>
                    <span>{selectedLetterToReject.employeeName}</span>

                    <small className="text-muted d-block mt-2">
                      Letter Type
                    </small>
                    <span>{selectedLetterToReject.templateName}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Rejection Reason</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <small className="text-muted">
                    This will be recorded in the audit trail
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowRejectCard(false);
                    setSelectedLetterToReject(null);
                    setRejectionReason("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (!rejectionReason.trim()) {
                      setNotification({
                        show: true,
                        type: "warning",
                        message: "Please enter a rejection reason",
                      });
                      return;
                    }

                    const currentDate = new Date().toISOString().split("T")[0];

                    // Update letter archive
                    const updatedArchive = letterArchive.map((l) =>
                      l.id === selectedLetterToReject.id
                        ? {
                            ...l,
                            status: "rejected",
                            rejectionReason: rejectionReason,
                            rejectionDate: currentDate,
                          }
                        : l
                    );
                    setLetterArchive(updatedArchive);

                    // Update letterRequests
                    if (letterRequests.length > 0) {
                      setLetterRequests((prev) =>
                        prev.map((req) =>
                          req.employeeId ===
                            selectedLetterToReject.employeeId &&
                          req.templateName ===
                            selectedLetterToReject.templateName
                            ? {
                                ...req,
                                status: "rejected",
                                statusColor: "danger",
                                workflowStatus: "terminated",
                                rejectionReason: rejectionReason,
                                auditTrail: [
                                  ...req.auditTrail,
                                  {
                                    action: "Letter Rejected from Archive",
                                    by: "HR Manager",
                                    timestamp: new Date().toLocaleString(),
                                    step: "Archive Rejection",
                                    details: `Reason: ${rejectionReason}`,
                                  },
                                ],
                              }
                            : req
                        )
                      );
                    }

                    // Update workflowRequests
                    if (workflowRequests.length > 0) {
                      setWorkflowRequests((prev) =>
                        prev.map((req) =>
                          req.employeeId ===
                            selectedLetterToReject.employeeId &&
                          req.templateName ===
                            selectedLetterToReject.templateName
                            ? {
                                ...req,
                                status: "rejected",
                                workflowStatus: "terminated",
                                rejectionReason: rejectionReason,
                                auditTrail: [
                                  ...req.auditTrail,
                                  {
                                    action: "Letter Rejected from Archive",
                                    by: "HR Manager",
                                    timestamp: new Date().toLocaleString(),
                                    step: "Archive Rejection",
                                    details: `Reason: ${rejectionReason}`,
                                  },
                                ],
                              }
                            : req
                        )
                      );
                    }

                    setNotification({
                      show: true,
                      type: "danger",
                      message: `Letter ${selectedLetterToReject.letterId} rejected with reason: ${rejectionReason}`,
                    });

                    setShowRejectCard(false);
                    setSelectedLetterToReject(null);
                    setRejectionReason("");
                  }}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Card */}
      {showDeleteConfirm && selectedLetterToDelete && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h6 className="modal-title fw-bold mb-0">Delete Letter</h6>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedLetterToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger">
                  <AlertTriangle size={16} className="me-2" />
                  <strong>Warning:</strong> This action cannot be undone.
                </div>
                <p className="mb-0">
                  Are you sure you want to delete letter{" "}
                  <strong>{selectedLetterToDelete.letterId}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedLetterToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    const updatedArchive = letterArchive.filter(
                      (l) => l.id !== selectedLetterToDelete.id
                    );
                    setLetterArchive(updatedArchive);

                    setNotification({
                      show: true,
                      type: "warning",
                      message: `Letter ${selectedLetterToDelete.letterId} deleted from archive`,
                    });

                    setShowDeleteConfirm(false);
                    setSelectedLetterToDelete(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports Section */}
      {activeSection === "reports" && (
        <div className="row g-3">
          {/* Letter Usage Report Card */}
          <div className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">
                  <FileText className="me-2" size={18} />
                  Letter Usage Report
                </h6>
                <span className="badge bg-white text-primary">
                  {letterTemplates.length} Templates
                </span>
              </div>
              <div className="card-body d-flex flex-column">
                <p className="text-muted small">
                  Complete report of letter templates usage, approvals, and
                  downloads.
                </p>
                <div className="mb-3">
                  <h6 className="small fw-bold">Report Includes:</h6>
                  <ul className="small">
                    <li>Template-wise usage statistics</li>
                    <li>Approval and rejection rates</li>
                    <li>Download frequency analysis</li>
                    <li>Monthly trends and patterns</li>
                  </ul>
                </div>

                {/* Quick Stats */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="card border text-center p-2">
                      <div className="fw-bold text-primary">
                        {statistics.totalRequests}
                      </div>
                      <div className="small text-muted">Total Requests</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card border text-center p-2">
                      <div className="fw-bold text-success">
                        {statistics.approvedRequests}
                      </div>
                      <div className="small text-muted">Approved</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-auto">
                  <button
                    type="button"
                    className="btn btn-primary flex-grow-1 btn-sm"
                    onClick={() => {
                      // Generate and Export Report as PDF
                      downloadLetterUsageReportPDF();
                    }}
                  >
                    <File className="me-1" size={14} />
                    PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-success flex-grow-1 btn-sm"
                    onClick={() => {
                      // Generate and Export Report as Excel
                      downloadLetterUsageReportExcel();
                    }}
                  >
                    <FileSpreadsheet className="me-1" size={14} />
                    Excel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Employee-wise Report Card */}
          <div className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0">
                  <Users className="me-2" size={18} />
                  Employee-wise Report
                </h6>
                <span className="badge bg-white text-success">
                  {new Set(letterRequests.map((r) => r.employeeId)).size}{" "}
                  Employees
                </span>
              </div>
              <div className="card-body d-flex flex-column">
                <p className="text-muted small">
                  Detailed report of letter requests and usage by each employee.
                </p>
                <div className="mb-3">
                  <h6 className="small fw-bold">Report Includes:</h6>
                  <ul className="small">
                    <li>Employee-wise request history</li>
                    <li>Most requested letter types</li>
                    <li>Approval status per employee</li>
                    <li>Department-wise analysis</li>
                  </ul>
                </div>

                {/* Quick Stats */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="card border text-center p-2">
                      <div className="fw-bold text-success">
                        {new Set(letterRequests.map((r) => r.employeeId)).size}
                      </div>
                      <div className="small text-muted">Active Employees</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card border text-center p-2">
                      <div className="fw-bold text-warning">
                        {
                          letterRequests.filter((r) => r.status === "pending")
                            .length
                        }
                      </div>
                      <div className="small text-muted">Pending Requests</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-auto">
                  <button
                    type="button"
                    className="btn btn-primary flex-grow-1 btn-sm"
                    onClick={() => {
                      // Generate and Export Report as PDF
                      downloadEmployeeWiseReportPDF();
                    }}
                  >
                    <File className="me-1" size={14} />
                    PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-success flex-grow-1 btn-sm"
                    onClick={() => {
                      // Generate and Export Report as Excel
                      downloadEmployeeWiseReportExcel();
                    }}
                  >
                    <FileSpreadsheet className="me-1" size={14} />
                    Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Section */}
      {activeSection === "settings" && (
        <div className="row g-3">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h6 className="fw-bold mb-0">
                  <Settings className="me-2" size={18} />
                  System Settings
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label small fw-bold">
                        Default Digital Signature
                      </label>
                      <select className="form-select form-select-sm">
                        <option>Enable for all letters</option>
                        <option>Enable based on template</option>
                        <option>Disable by default</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">
                        Auto-Approval Rules
                      </label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked
                        />
                        <label className="form-check-label small">
                          Enable for salary certificates
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label small">
                          Enable for experience certificates
                        </label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">
                        Default Letter Format
                      </label>
                      <select className="form-select form-select-sm">
                        <option>PDF</option>
                        <option>DOCX</option>
                        <option>Both PDF and DOCX</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label small fw-bold">
                        Audit Trail Retention
                      </label>
                      <select className="form-select form-select-sm">
                        <option>30 days</option>
                        <option>90 days</option>
                        <option>1 year</option>
                        <option>Indefinite</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">
                        Notification Settings
                      </label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked
                        />
                        <label className="form-check-label small">
                          Email for new requests
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultChecked
                        />
                        <label className="form-check-label small">
                          Email for approvals
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label small">
                          Email for downloads
                        </label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">
                        Default Workflow SLA
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        defaultValue="24 hours"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="btn btn-primary btn-responsive">
                    <Save className="me-2" size={16} />
                    Save Settings
                  </button>
                  <button className="btn btn-outline-secondary ms-2 btn-responsive">
                    <RefreshCw className="me-2" size={16} />
                    Reset to Default
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Action Notification Component (add this at the top of your workflow section) */}
      {actionNotification.show && (
        <div
          className={`alert alert-${actionNotification.type} alert-dismissible fade show mb-4`}
        >
          <div className="d-flex align-items-center">
            {actionNotification.type === "success" && (
              <CheckCircle size={20} className="me-2" />
            )}
            {actionNotification.type === "warning" && (
              <AlertTriangle size={20} className="me-2" />
            )}
            {actionNotification.type === "danger" && (
              <XCircle size={20} className="me-2" />
            )}
            {actionNotification.type === "info" && (
              <Info size={20} className="me-2" />
            )}
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1">{actionNotification.title}</h6>
              <p className="mb-0">{actionNotification.message}</p>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() =>
                setActionNotification({
                  show: false,
                  type: "",
                  title: "",
                  message: "",
                })
              }
            ></button>
          </div>
        </div>
      )}

      {showAuditTrailModal && selectedAuditRequest && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold mb-0">
                  <Eye className="me-2" size={18} />
                  Request Details & Audit Trail
                </h5>
                <button
                  className="btn btn-sm btn-close btn-close-white"
                  onClick={() => {
                    setShowAuditTrailModal(false);
                    setSelectedAuditRequest(null);
                    setSelectedAuditTrail([]);
                  }}
                ></button>
              </div>

              <div className="modal-body">
                {/* Request Information */}
                <div className="card border mb-4">
                  <div className="card-header bg-light">
                    <h6 className="fw-bold mb-0">Request Information</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <small className="text-muted d-block">
                            Request ID
                          </small>
                          <span className="fw-bold">
                            {selectedAuditRequest.requestId}
                          </span>
                        </div>
                        <div className="mb-3">
                          <small className="text-muted d-block">Employee</small>
                          <div>
                            <span className="fw-bold">
                              {selectedAuditRequest.employeeName}
                            </span>
                            <small className="text-muted d-block">
                              {selectedAuditRequest.employeeId}
                            </small>
                          </div>
                        </div>
                        <div className="mb-3">
                          <small className="text-muted d-block">
                            Letter Type
                          </small>
                          <span className="fw-bold">
                            {selectedAuditRequest.templateName}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <small className="text-muted d-block">Status</small>
                          <div>
                            {getStatusBadge(selectedAuditRequest.status)}
                          </div>
                        </div>
                        <div className="mb-3">
                          <small className="text-muted d-block">Priority</small>
                          <div>
                            {getPriorityBadge(selectedAuditRequest.priority)}
                          </div>
                        </div>
                        <div className="mb-3">
                          <small className="text-muted d-block">
                            Request Date
                          </small>
                          <span className="fw-bold">
                            {formatDate(selectedAuditRequest.requestDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <small className="text-muted d-block">
                            Designation
                          </small>
                          <span>
                            {selectedAuditRequest.designation ||
                              "Senior Developer"}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <small className="text-muted d-block">
                            Department
                          </small>
                          <span>
                            {selectedAuditRequest.department || "Engineering"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted d-block">Purpose</small>
                      <p className="mb-0">{selectedAuditRequest.purpose}</p>
                    </div>

                    {selectedAuditRequest.lastPromoted && (
                      <div className="mb-3">
                        <small className="text-muted d-block">
                          Last Promoted
                        </small>
                        <span>
                          {formatDate(selectedAuditRequest.lastPromoted)}
                        </span>
                      </div>
                    )}

                    {selectedAuditRequest.lastIncrement && (
                      <div className="mb-3">
                        <small className="text-muted d-block">
                          Last Increment
                        </small>
                        <span>
                          {formatDate(selectedAuditRequest.lastIncrement)}
                        </span>
                      </div>
                    )}

                    {selectedAuditRequest.approvalDate && (
                      <div className="mb-3">
                        <small className="text-muted d-block">
                          Approval Date
                        </small>
                        <span className="text-success">
                          {formatDate(selectedAuditRequest.approvalDate)}
                        </span>
                      </div>
                    )}

                    {selectedAuditRequest.approvedBy &&
                      selectedAuditRequest.approvedBy.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted d-block">
                            Approved By
                          </small>
                          <div>
                            {selectedAuditRequest.approvedBy.map(
                              (approver, index) => (
                                <span
                                  key={index}
                                  className="badge bg-success me-1"
                                >
                                  {approver}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {selectedAuditRequest.downloadCount > 0 && (
                      <div className="mb-3">
                        <small className="text-muted d-block">Downloads</small>
                        <span className="fw-bold">
                          {selectedAuditRequest.downloadCount}
                        </span>
                      </div>
                    )}

                    {selectedAuditRequest.verificationCode && (
                      <div className="mb-3">
                        <small className="text-muted d-block">
                          Verification Code
                        </small>
                        <code className="bg-light p-2 rounded d-block">
                          {selectedAuditRequest.verificationCode}
                        </code>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit Trail Section */}
                <div className="card border">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-0">Audit Trail</h6>
                    <span className="badge bg-primary">
                      {selectedAuditTrail.length} entries
                    </span>
                  </div>
                  <div
                    className="card-body"
                    style={{ maxHeight: "350px", overflowY: "auto" }}
                  >
                    {selectedAuditTrail.length === 0 ? (
                      <div className="text-center py-4">
                        <FileWarningIcon
                          size={32}
                          className="text-muted mb-3"
                        />
                        <p className="text-muted">No audit trail available</p>
                        <small className="text-muted">
                          Audit trail will be generated as the request
                          progresses
                        </small>
                      </div>
                    ) : (
                      <div className="timeline">
                        {selectedAuditTrail.map((log, index) => (
                          <div key={index} className="timeline-item mb-4">
                            <div className="d-flex">
                              <div
                                className="timeline-marker bg-primary rounded-circle flex-shrink-0"
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  marginTop: "4px",
                                }}
                              ></div>
                              <div className="ms-3 flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <div className="fw-bold text-primary">
                                      {log.action}
                                    </div>
                                    <div className="small text-muted">
                                      <span className="me-2">
                                        <User size={12} className="me-1" />
                                        {log.by}
                                      </span>
                                      <span className="mx-2">•</span>
                                      <span>
                                        <GitBranch size={12} className="me-1" />
                                        {log.step}
                                      </span>
                                    </div>
                                  </div>
                                  <small className="text-secondary text-nowrap">
                                    {formatDateTime(log.timestamp)}
                                  </small>
                                </div>
                                {log.details && (
                                  <div className="mt-2 small bg-light p-2 rounded">
                                    {log.details}
                                  </div>
                                )}

                                {/* Show additional info for specific actions */}
                                {log.action.includes("Approved") && (
                                  <div className="mt-2">
                                    <span className="badge bg-success">
                                      <CheckIcon size={10} className="me-1" />
                                      Approved
                                    </span>
                                  </div>
                                )}

                                {log.action.includes("Rejected") && (
                                  <div className="mt-2">
                                    <span className="badge bg-danger">
                                      <XIcon size={10} className="me-1" />
                                      Rejected
                                    </span>
                                  </div>
                                )}

                                {log.action.includes("Generated") && (
                                  <div className="mt-2">
                                    <span className="badge bg-info">
                                      <FileText size={10} className="me-1" />
                                      Letter Generated
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setShowAuditTrailModal(false);
                    setSelectedAuditRequest(null);
                    setSelectedAuditTrail([]);
                  }}
                >
                  Close
                </button>

                {/* Additional action buttons */}
                {selectedAuditRequest.status === "approved" && (
                  <button
                    className="btn btn-sm btn-success text-light"
                    onClick={() =>
                      downloadAuditTrailPDF(
                        selectedAuditTrail,
                        selectedAuditRequest
                      )
                    }
                    title="Download Audit Trail as PDF"
                  >
                    <Download size={12} />
                    Download
                  </button>
                )}

                {selectedAuditRequest.status === "pending" && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Approve request ${selectedAuditRequest.requestId}?`
                          )
                        ) {
                          handleApproveRequest(selectedAuditRequest.id);
                          setShowAuditTrailModal(false);
                        }
                      }}
                    >
                      <CheckIcon size={14} className="me-2" />
                      Approve
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Reject request ${selectedAuditRequest.requestId}?`
                          )
                        ) {
                          handleRejectRequest(selectedAuditRequest.id);
                          setShowAuditTrailModal(false);
                        }
                      }}
                    >
                      <XIcon size={14} className="me-2" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAuditTrailCard && selectedRequest && (
        <div
          className="card shadow-lg position-fixed top-50 start-50 translate-middle"
          style={{ width: "650px", zIndex: 1050 }}
        >
          {/* Header */}
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              Request Details – {selectedRequest.requestId}
            </h6>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => setShowAuditTrailCard(false)}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div
            className="card-body"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {/* Basic Info */}
            <div className="mb-3">
              <strong>Employee:</strong> {selectedRequest.employeeName}
              <br />
              <strong>Template:</strong> {selectedRequest.templateName}
              <br />
              <strong>Status:</strong> {getStatusBadge(selectedRequest.status)}
              <br />
              <strong>Priority:</strong>{" "}
              {getPriorityBadge(selectedRequest.priority)}
            </div>

            <hr />

            {/* Audit Trail */}
            <h6 className="mb-2">Audit Trail</h6>

            {selectedRequest.auditTrail?.length > 0 ? (
              <ul className="list-group list-group-flush">
                {selectedRequest.auditTrail.map((log, index) => (
                  <li key={index} className="list-group-item">
                    <div className="fw-bold">{log.action}</div>
                    <small className="text-muted">
                      {log.by} • {log.step}
                    </small>
                    <br />
                    <small className="text-secondary">{log.timestamp}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No audit trail available</p>
            )}
          </div>

          {/* Footer */}
          <div className="card-footer text-end">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAuditTrailCard(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showLetterDetailsCard && selectedLetter && (
        <div
          className="card shadow-lg position-fixed top-50 start-50 translate-middle"
          style={{ width: "600px", zIndex: 1050 }}
        >
          {/* Header */}
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Letter Details – {selectedLetter.letterId}</h6>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => setShowLetterDetailsCard(false)}
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="card-body">
            <div className="mb-2">
              <strong>Employee:</strong> {selectedLetter.employeeName} (
              {selectedLetter.employeeId})
            </div>

            <div className="mb-2">
              <strong>Template:</strong> {selectedLetter.templateName}
            </div>

            <div className="mb-2">
              <strong>Purpose:</strong> {selectedLetter.purpose}
            </div>

            <div className="mb-2">
              <strong>Generated Date:</strong>{" "}
              {formatDate(selectedLetter.generationDate)}
            </div>

            <div className="mb-2">
              <strong>Total Downloads:</strong> {selectedLetter.downloadCount}
            </div>

            <div className="mb-2">
              <strong>Verification Code:</strong>{" "}
              {selectedLetter.verificationCode}
            </div>

            <div className="mb-2">
              <strong>Digital Signature:</strong>{" "}
              {selectedLetter.digitalSignature ? (
                <span className="badge bg-success">Yes</span>
              ) : (
                <span className="badge bg-danger">No</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="card-footer text-end">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowLetterDetailsCard(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showLetterModal && <LetterGeneratorModal />}
      {/* Edit Letter Modal */}
      {showEditModal && editingLetter && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <Edit className="me-2" />
                  Edit Letter: {editingLetter.letterId}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingLetter(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info mb-4">
                  <Info className="me-2" size={16} />
                  Edit the letter details below.
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Employee Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingLetter.employeeName}
                        onChange={(e) =>
                          setEditingLetter({
                            ...editingLetter,
                            employeeName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Employee ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingLetter.employeeId}
                        onChange={(e) =>
                          setEditingLetter({
                            ...editingLetter,
                            employeeId: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingLetter.designation}
                        onChange={(e) =>
                          setEditingLetter({
                            ...editingLetter,
                            designation: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingLetter.department}
                        onChange={(e) =>
                          setEditingLetter({
                            ...editingLetter,
                            department: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Purpose</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editingLetter.purpose}
                        onChange={(e) =>
                          setEditingLetter({
                            ...editingLetter,
                            purpose: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={editingLetter.status}
                        onChange={(e) =>
                          setEditingLetter({
                            ...editingLetter,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingLetter(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSaveEditedLetter(editingLetter)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header bg-primary text-white">
                <div className="d-flex align-items-center">
                  <div className="position-relative">
                    <Bot className="me-3" size={24} />
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">
                      HR Letter AI Assistant
                    </h5>
                    <small className="opacity-75">
                      Powered by AI • Always Active
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAIAssistant(false)}
                ></button>
              </div>

              {/* Modal Body */}
              <div
                className="modal-body d-flex flex-column p-0"
                style={{ height: "500px" }}
              >
                {/* Quick Actions Bar */}
                <div className="p-3 border-bottom">
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      onClick={() => handleAIQuickAction("template_suggestion")}
                    >
                      <FileText size={14} className="me-2" />
                      Suggest Template
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success d-flex align-items-center"
                      onClick={() => handleAIQuickAction("letter_review")}
                    >
                      <Eye size={14} className="me-2" />
                      Review Letter
                    </button>
                    <button
                      className="btn btn-sm btn-outline-info d-flex align-items-center"
                      onClick={() => handleAIQuickAction("workflow_help")}
                    >
                      <GitBranch size={14} className="me-2" />
                      Workflow Help
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning d-flex align-items-center"
                      onClick={() => handleAIQuickAction("statistics")}
                    >
                      <BarChart3 size={14} className="me-2" />
                      Get Stats
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center"
                      onClick={clearAIChat}
                    >
                      <Trash2 size={14} className="me-2" />
                      Clear Chat
                    </button>
                  </div>
                </div>

                {/* Chat Container */}
                <div
                  className="flex-grow-1 overflow-auto p-3"
                  id="aiChatContainer"
                >
                  {/* Welcome Message */}
                  <div className="chat-message ai-message mb-3">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div
                          className="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <Bot size={16} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="fw-bold small">HR AI Assistant</div>
                        <div className="card border-0 bg-light p-2">
                          <p className="mb-1">
                            Hello! I'm your HR Letter AI Assistant. I can help
                            you with:
                          </p>
                          <ul className="small mb-0">
                            <li>Choosing the right letter template</li>
                            <li>Reviewing and improving letter content</li>
                            <li>Workflow guidance and approvals</li>
                            <li>Generating statistics and reports</li>
                            <li>Answering HR policy questions</li>
                          </ul>
                          <div className="mt-2">
                            <small className="text-muted">
                              Try asking: "Which template should I use for a
                              promotion letter?"
                            </small>
                          </div>
                        </div>
                        <small className="text-muted">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  {aiChatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`chat-message ${message.type}-message mb-3`}
                    >
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          {message.type === "ai" ? (
                            <div
                              className="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "32px", height: "32px" }}
                            >
                              <Bot size={16} className="text-white" />
                            </div>
                          ) : (
                            <div
                              className="avatar bg-info rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "32px", height: "32px" }}
                            >
                              <User size={16} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <div className="fw-bold small">
                            {message.type === "ai" ? "HR AI Assistant" : "You"}
                          </div>
                          <div
                            className={`card border-0 p-2 ${
                              message.type === "ai"
                                ? "bg-light"
                                : "bg-primary bg-opacity-10"
                            }`}
                          >
                            {message.content}
                            {message.actions && (
                              <div className="mt-2">
                                {message.actions.map((action, actionIndex) => (
                                  <button
                                    key={actionIndex}
                                    className="btn btn-sm btn-outline-primary me-2 mb-1"
                                    onClick={() => handleAIAction(action)}
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <small className="text-muted">
                            {message.timestamp}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isAIProcessing && (
                    <div className="chat-message ai-message mb-3">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <div
                            className="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <Bot size={16} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <div className="fw-bold small">HR AI Assistant</div>
                          <div className="card border-0 bg-light p-2">
                            <div className="d-flex align-items-center">
                              <div
                                className="spinner-border spinner-border-sm text-primary me-2"
                                role="status"
                              ></div>
                              <span>Processing your request...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-3 border-top">
                  <div className="input-group">
                    <textarea
                      className="form-control"
                      placeholder="Type your question about HR letters, templates, or workflows..."
                      rows="2"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAISubmit();
                        }
                      }}
                      style={{ resize: "none" }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleAISubmit}
                      disabled={isAIProcessing || !aiInput.trim()}
                    >
                      {isAIProcessing ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Processing
                        </>
                      ) : (
                        <>
                          <Send size={16} className="me-2" />
                          Send
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-light">
                <div className="d-flex justify-content-between w-100 align-items-center">
                  <div className="text-muted small">
                    <Sparkles size={14} className="me-1" />
                    AI Assistant v1.0 • Context-aware responses
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowAIAssistant(false)}
                    >
                      Close
                    </button>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => handleAIQuickAction("help")}
                    >
                      <HelpCircle size={14} className="me-1" />
                      Help
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Template Modal */}
      {showEditTemplateModal && selectedTemplateForEdit && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <Edit className="me-2" />
                  Edit Template: {selectedTemplateForEdit.templateName}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowEditTemplateModal(false);
                    setSelectedTemplateForEdit(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info mb-4">
                  <Info className="me-2" size={16} />
                  Edit the template details below.
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Template Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTemplateForEdit.templateName}
                        onChange={(e) =>
                          setSelectedTemplateForEdit({
                            ...selectedTemplateForEdit,
                            templateName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={selectedTemplateForEdit.category}
                        onChange={(e) =>
                          setSelectedTemplateForEdit({
                            ...selectedTemplateForEdit,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="Employment">Employment</option>
                        <option value="Financial">Financial</option>
                        <option value="Exit">Exit</option>
                        <option value="Legal">Legal</option>
                        <option value="Career">Career</option>
                        <option value="Disciplinary">Disciplinary</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={selectedTemplateForEdit.description}
                        onChange={(e) =>
                          setSelectedTemplateForEdit({
                            ...selectedTemplateForEdit,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">SLA</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedTemplateForEdit.sla}
                        onChange={(e) =>
                          setSelectedTemplateForEdit({
                            ...selectedTemplateForEdit,
                            sla: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={selectedTemplateForEdit.status}
                        onChange={(e) =>
                          setSelectedTemplateForEdit({
                            ...selectedTemplateForEdit,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedTemplateForEdit.autoApprove}
                        onChange={(e) =>
                          setSelectedTemplateForEdit({
                            ...selectedTemplateForEdit,
                            autoApprove: e.target.checked,
                          })
                        }
                        id="autoApproveEdit"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="autoApproveEdit"
                      >
                        Auto-approve
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedTemplateForEdit.aiOptimized}
                        onChange={(e) =>
                          setSelectedTemplateForEdit({
                            ...selectedTemplateForEdit,
                            aiOptimized: e.target.checked,
                          })
                        }
                        id="aiOptimizedEdit"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="aiOptimizedEdit"
                      >
                        AI Optimized
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowEditTemplateModal(false);
                    setSelectedTemplateForEdit(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    handleSaveEditedTemplate(selectedTemplateForEdit)
                  }
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Template Modal */}
      {showTemplateModal && (
        <div
          className="modal show d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <FileText className="me-2" />
                  Add New Template
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowTemplateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info mb-4">
                  <Info className="me-2" size={16} />
                  Create a new letter template with custom fields and workflow.
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Template Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="templateName"
                        placeholder="e.g., Experience Certificate"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Template Type *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="templateType"
                        placeholder="e.g., experience, salary, relieving"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Category *</label>
                      <select className="form-select" id="category" required>
                        <option value="">Select Category</option>
                        <option value="Employment">Employment</option>
                        <option value="Financial">Financial</option>
                        <option value="Exit">Exit</option>
                        <option value="Legal">Legal</option>
                        <option value="Career">Career</option>
                        <option value="Disciplinary">Disciplinary</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Icon *</label>
                      <select className="form-select" id="icon" required>
                        <option value="FileText">FileText</option>
                        <option value="FileCheck">FileCheck</option>
                        <option value="CheckCircle">CheckCircle</option>
                        <option value="DollarSign">DollarSign</option>
                        <option value="Shield">Shield</option>
                        <option value="TrendingUp">TrendingUp</option>
                        <option value="UserCheck">UserCheck</option>
                        <option value="MapPin">MapPin</option>
                        <option value="CreditCard">CreditCard</option>
                        <option value="AlertTriangle">AlertTriangle</option>
                        <option value="XCircle">XCircle</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Description *
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        placeholder="Brief description of this template..."
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        SLA (Service Level Agreement)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="sla"
                        placeholder="e.g., 24 hours"
                        defaultValue="24 hours"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Required Approvals *
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          id="approvals"
                          placeholder="e.g., Manager, HR, Finance"
                          defaultValue="Manager, HR"
                        />
                      </div>
                      <div className="form-text">
                        Separate multiple approvals with commas
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="autoApprove"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="autoApprove"
                          >
                            Enable Auto-approval
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="aiOptimized"
                            defaultChecked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="aiOptimized"
                          >
                            Enable AI Optimization
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="digitalSignature"
                            defaultChecked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="digitalSignature"
                          >
                            Enable Digital Signature
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowTemplateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    // Collect form data
                    const templateName =
                      document.getElementById("templateName").value;
                    const templateType =
                      document.getElementById("templateType").value;
                    const category = document.getElementById("category").value;
                    const description =
                      document.getElementById("description").value;
                    const icon = document.getElementById("icon").value;
                    const sla = document.getElementById("sla").value;
                    const approvals = document
                      .getElementById("approvals")
                      .value.split(",")
                      .map((a) => a.trim());
                    const autoApprove =
                      document.getElementById("autoApprove").checked;
                    const aiOptimized =
                      document.getElementById("aiOptimized").checked;
                    const digitalSignature =
                      document.getElementById("digitalSignature").checked;

                    // Validate required fields
                    if (
                      !templateName ||
                      !templateType ||
                      !category ||
                      !description
                    ) {
                      setTemplateNotification({
                        show: true,
                        type: "danger",
                        title: "Validation Error",
                        message:
                          "Please fill in all required fields marked with *",
                      });
                      return;
                    }

                    // Create new template
                    const newTemplate = {
                      templateName,
                      templateType,
                      category,
                      description,
                      icon,
                      sla,
                      requiredApprovals: approvals,
                      autoApprove,
                      aiOptimized,
                      digitalSignature,
                      verificationCode: true,
                    };

                    handleAddTemplate(newTemplate);
                  }}
                >
                  <Save className="me-2" size={16} />
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      userInfo={userInfo}
      appName="HR Letter Generation System"
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    >
      {mainContent}
    </div>
  );
};

export default LetterGeneration;
