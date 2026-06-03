import React, { useState, useEffect } from "react";
import RecruiterDashboardLayout from "../../../app/layouts/RecruiterDashboardLayout";
import {
  Search, Download, Printer, Eye, Check, X, Trash2,
  Calendar, TrendingUp, TrendingDown, AlertTriangle, Users,
  BarChart3, PieChart, Clock, FileText, DollarSign, Filter,
  ChevronDown, ChevronUp, Clock as ClockIcon, User, Mail, Phone,
  CreditCard, Calendar as CalendarIcon, Briefcase, MapPin,
  BookOpen, Heart, Shield, Banknote, PhoneCall, Smartphone, Home,
  Award, GraduationCap, Building, Globe, Hash, Tag, UserCheck,
  PhoneOutgoing, Mailbox
} from "lucide-react";
import { Icon } from "@iconify/react";


/* -----------------------------------------------
   SIDEBAR CONTENT
------------------------------------------------ */
const sidebarContent = (
  <nav className="space-y-1 p-3">
    <h6 className="text-uppercase text-muted mb-2 small">Leave Reports</h6>

    <a className="nav-link d-block py-2 px-3 rounded hover-bg-light" href="#balance">
      <i className="ri-dashboard-line me-2"></i> Leave Balance Reports
    </a>

    <a className="nav-link d-block py-2 px-3 rounded hover-bg-light" href="#utilization">
      <i className="ri-bar-chart-line me-2"></i> Leave Utilization Reports
    </a>

    <a className="nav-link d-block py-2 px-3 rounded hover-bg-light" href="#approvals">
      <i className="ri-file-chart-line me-2"></i> Leave Approval Reports
    </a>

    <a className="nav-link d-block py-2 px-3 rounded hover-bg-light" href="#demographics">
      <i className="ri-user-line me-2"></i> Employee Demographics
    </a>
  </nav>
);

/* -----------------------------------------------
   USER INFO
------------------------------------------------ */
const userInfo = {
  name: "Leave Admin",
  role: "HR Leave Manager",
  email: "leave-admin@company.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeaveAdmin",
};

/* -----------------------------------------------
   SAMPLE DATA WITH ENHANCED EMPLOYEE FIELDS
------------------------------------------------ */
const initialLeaves = [
  {
    id: 1,
    employee: "Priya Sharma",
    employeeCode: "EMP001",
    gender: "Female",
    dob: "1990-05-15",
    doj: "2020-01-01",
    doe: "",
    location: "Hyderabad",
    costCenter: "ENG001",
    department: "Engineering",
    grade: "Senior",
    designation: "Software Engineer",
    pan: "ABCDE1234F",
    esi: "1234567890",
    pfUan: "123456789012",
    aadhaar: "123456789012",
    officeEmail: "priya.sharma@company.com",
    officePhone: "+91-40-12345678",
    mobile: "+91-9876543210",
    bankName: "HDFC Bank",
    bankIfsc: "HDFC0001234",
    bankAccount: "1234567890123456",
    homePhone: "+91-40-87654321",
    personalEmail: "priya.sharma.personal@gmail.com",
    emergencyContact: "Rahul Sharma (Husband)",
    bloodGroup: "O+",
    maritalStatus: "Married",
    spouseName: "Rahul Sharma",
    children: "2",
    leaveType: "Casual Leave",
    fromDate: "2025-11-20",
    toDate: "2025-11-22",
    appliedOn: "2025-11-15",
    status: "Pending",
    reason: "Family function",
  },
  {
    id: 2,
    employee: "Vikas Rao",
    employeeCode: "EMP002",
    gender: "Male",
    dob: "1988-11-22",
    doj: "2019-03-15",
    doe: "",
    location: "Bangalore",
    costCenter: "QA001",
    department: "QA",
    grade: "Senior",
    designation: "QA Engineer",
    pan: "FGHIJ5678K",
    esi: "0987654321",
    pfUan: "987654321098",
    aadhaar: "987654321098",
    officeEmail: "vikas.rao@company.com",
    officePhone: "+91-80-12345678",
    mobile: "+91-9876543211",
    bankName: "ICICI Bank",
    bankIfsc: "ICIC0001234",
    bankAccount: "9876543210987654",
    homePhone: "+91-80-87654321",
    personalEmail: "vikas.rao.personal@gmail.com",
    emergencyContact: "Sunita Rao (Wife)",
    bloodGroup: "A+",
    maritalStatus: "Married",
    spouseName: "Sunita Rao",
    children: "1",
    leaveType: "Sick Leave",
    fromDate: "2025-10-05",
    toDate: "2025-10-06",
    appliedOn: "2025-10-01",
    status: "Approved",
    reason: "Fever",
  },
  {
    id: 3,
    employee: "Sneha Reddy",
    employeeCode: "EMP003",
    gender: "Female",
    dob: "1992-07-10",
    doj: "2021-06-01",
    doe: "",
    location: "Hyderabad",
    costCenter: "DES001",
    department: "Design",
    grade: "Junior",
    designation: "UI/UX Designer",
    pan: "KLMNO9012P",
    esi: "2345678901",
    pfUan: "234567890123",
    aadhaar: "234567890123",
    officeEmail: "sneha.reddy@company.com",
    officePhone: "+91-40-23456789",
    mobile: "+91-9876543212",
    bankName: "Axis Bank",
    bankIfsc: "UTIB0001234",
    bankAccount: "2345678901234567",
    homePhone: "+91-40-76543210",
    personalEmail: "sneha.reddy.personal@gmail.com",
    emergencyContact: "Raj Reddy (Father)",
    bloodGroup: "B+",
    maritalStatus: "Single",
    spouseName: "",
    children: "0",
    leaveType: "Casual Leave",
    fromDate: "2025-09-12",
    toDate: "2025-09-12",
    appliedOn: "2025-09-10",
    status: "Rejected",
    reason: "Short notice",
  },
  {
    id: 4,
    employee: "Arjun Singh",
    employeeCode: "EMP004",
    gender: "Male",
    dob: "1985-12-05",
    doj: "2018-08-20",
    doe: "",
    location: "Bangalore",
    costCenter: "ENG002",
    department: "Engineering",
    grade: "Lead",
    designation: "Tech Lead",
    pan: "PQRST3456U",
    esi: "3456789012",
    pfUan: "345678901234",
    aadhaar: "345678901234",
    officeEmail: "arjun.singh@company.com",
    officePhone: "+91-80-34567890",
    mobile: "+91-9876543213",
    bankName: "SBI",
    bankIfsc: "SBIN0001234",
    bankAccount: "3456789012345678",
    homePhone: "+91-80-65432109",
    personalEmail: "arjun.singh.personal@gmail.com",
    emergencyContact: "Meera Singh (Wife)",
    bloodGroup: "AB+",
    maritalStatus: "Married",
    spouseName: "Meera Singh",
    children: "2",
    leaveType: "Sick Leave",
    fromDate: "2025-08-01",
    toDate: "2025-08-03",
    appliedOn: "2025-07-28",
    status: "Approved",
    reason: "Viral fever",
  },
  {
    id: 5,
    employee: "Neha Gupta",
    employeeCode: "EMP005",
    gender: "Female",
    dob: "1991-03-25",
    doj: "2020-11-10",
    doe: "",
    location: "Hyderabad",
    costCenter: "HR001",
    department: "HR",
    grade: "Manager",
    designation: "HR Manager",
    pan: "UVWXY6789Z",
    esi: "4567890123",
    pfUan: "456789012345",
    aadhaar: "456789012345",
    officeEmail: "neha.gupta@company.com",
    officePhone: "+91-40-45678901",
    mobile: "+91-9876543214",
    bankName: "Kotak Mahindra",
    bankIfsc: "KKBK0001234",
    bankAccount: "4567890123456789",
    homePhone: "+91-40-54321098",
    personalEmail: "neha.gupta.personal@gmail.com",
    emergencyContact: "Amit Gupta (Husband)",
    bloodGroup: "O-",
    maritalStatus: "Married",
    spouseName: "Amit Gupta",
    children: "1",
    leaveType: "Casual Leave",
    fromDate: "2025-11-18",
    toDate: "2025-11-18",
    appliedOn: "2025-11-16",
    status: "Pending",
    reason: "Personal work",
  },
];

/* -----------------------------------------------
   UTILITY FUNCTIONS
------------------------------------------------ */
const parseDate = (s) => (s ? new Date(s) : null);

const diffDays = (from, to) => {
  const f = parseDate(from);
  const t = parseDate(to);
  if (!f || !t) return 0;
  return Math.round((t - f) / (1000 * 60 * 60 * 24)) + 1;
};

const statusBadge = (status) => {
  const map = {
    Pending: "bg-warning-subtle text-warning",
    Approved: "bg-success-subtle text-success",
    Rejected: "bg-danger-subtle text-danger",
  };
  return map[status] || "bg-secondary-subtle text-secondary";
};

const getAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const getTenure = (doj) => {
  const joinDate = new Date(doj);
  const today = new Date();
  let years = today.getFullYear() - joinDate.getFullYear();
  let months = today.getMonth() - joinDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months };
};

/* -----------------------------------------------
   MAIN COMPONENT
------------------------------------------------ */
const LeaveReports = () => {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [activeTab, setActiveTab] = useState("balance");

  const [selected, setSelected] = useState([]);
  const [modalLeave, setModalLeave] = useState(null);

  // prevent background scroll when modal is open
  useEffect(() => {
    if (modalLeave) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [modalLeave]);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Leave Balance Data
  const leaveBalanceData = [
    { employee: "Priya Sharma", employeeId: "EMP001", department: "Engineering", casualLeave: { allocated: 12, used: 8, balance: 4, carryForward: 2 }, sickLeave: { allocated: 10, used: 3, balance: 7, carryForward: 0 }, earnedLeave: { allocated: 15, used: 5, balance: 10, carryForward: 5 }, totalBalance: 21 },
    { employee: "Vikas Rao", employeeId: "EMP002", department: "QA", casualLeave: { allocated: 12, used: 10, balance: 2, carryForward: 0 }, sickLeave: { allocated: 10, used: 7, balance: 3, carryForward: 0 }, earnedLeave: { allocated: 15, used: 12, balance: 3, carryForward: 2 }, totalBalance: 8 },
    { employee: "Arjun Singh", employeeId: "EMP003", department: "Engineering", casualLeave: { allocated: 12, used: 6, balance: 6, carryForward: 0 }, sickLeave: { allocated: 10, used: 4, balance: 6, carryForward: 0 }, earnedLeave: { allocated: 15, used: 8, balance: 7, carryForward: 3 }, totalBalance: 19 },
    { employee: "Neha Gupta", employeeId: "EMP004", department: "HR", casualLeave: { allocated: 12, used: 9, balance: 3, carryForward: 1 }, sickLeave: { allocated: 10, used: 2, balance: 8, carryForward: 0 }, earnedLeave: { allocated: 15, used: 10, balance: 5, carryForward: 4 }, totalBalance: 16 },
  ];

  // Department-wise Leave Liability
  const deptLeaveLiability = [
    { department: "Engineering", totalEmployees: 150, totalBalance: 2450, casualLeave: 680, sickLeave: 950, earnedLeave: 820, encashmentLiability: 245000 },
    { department: "QA", totalEmployees: 45, totalBalance: 680, casualLeave: 180, sickLeave: 220, earnedLeave: 280, encashmentLiability: 68000 },
    { department: "Design", totalEmployees: 25, totalBalance: 420, casualLeave: 120, sickLeave: 150, earnedLeave: 150, encashmentLiability: 42000 },
    { department: "HR", totalEmployees: 30, totalBalance: 520, casualLeave: 140, sickLeave: 180, earnedLeave: 200, encashmentLiability: 52000 },
    { department: "Finance", totalEmployees: 35, totalBalance: 580, casualLeave: 160, sickLeave: 200, earnedLeave: 220, encashmentLiability: 58000 },
    { department: "Support", totalEmployees: 40, totalBalance: 680, casualLeave: 180, sickLeave: 240, earnedLeave: 260, encashmentLiability: 68000 },
  ];

  // Leave Accrual Register
  const leaveAccrualData = [
    { employee: "Priya Sharma", employeeId: "EMP001", department: "Engineering", accrualDate: "2024-01-01", leaveType: "Earned Leave", daysAccrued: 1.25, balanceBefore: 13.75, balanceAfter: 15.00 },
    { employee: "Vikas Rao", employeeId: "EMP002", department: "QA", accrualDate: "2024-01-01", leaveType: "Earned Leave", daysAccrued: 1.25, balanceBefore: 10.75, balanceAfter: 12.00 },
    { employee: "Arjun Singh", employeeId: "EMP003", department: "Engineering", accrualDate: "2024-01-01", leaveType: "Earned Leave", daysAccrued: 1.25, balanceBefore: 5.75, balanceAfter: 7.00 },
  ];

  // Carry-forward Leave Tracking
  const carryForwardData = [
    { employee: "Priya Sharma", employeeId: "EMP001", department: "Engineering", leaveType: "Casual Leave", previousYearBalance: 2, carriedForward: 2, currentYearAllocated: 12, totalAvailable: 14 },
    { employee: "Priya Sharma", employeeId: "EMP001", department: "Engineering", leaveType: "Earned Leave", previousYearBalance: 5, carriedForward: 5, currentYearAllocated: 15, totalAvailable: 20 },
    { employee: "Neha Gupta", employeeId: "EMP004", department: "HR", leaveType: "Casual Leave", previousYearBalance: 1, carriedForward: 1, currentYearAllocated: 12, totalAvailable: 13 },
    { employee: "Neha Gupta", employeeId: "EMP004", department: "HR", leaveType: "Earned Leave", previousYearBalance: 4, carriedForward: 4, currentYearAllocated: 15, totalAvailable: 19 },
  ];

  // Leave Utilization Data
  const monthlyLeaveSummary = [
    { month: "January 2024", totalLeaves: 125, casualLeave: 45, sickLeave: 35, earnedLeave: 40, other: 5, avgDaysPerEmployee: 2.1 },
    { month: "February 2024", totalLeaves: 98, casualLeave: 32, sickLeave: 28, earnedLeave: 35, other: 3, avgDaysPerEmployee: 1.8 },
    { month: "March 2024", totalLeaves: 142, casualLeave: 52, sickLeave: 38, earnedLeave: 48, other: 4, avgDaysPerEmployee: 2.5 },
    { month: "April 2024", totalLeaves: 115, casualLeave: 40, sickLeave: 32, earnedLeave: 40, other: 3, avgDaysPerEmployee: 2.0 },
    { month: "May 2024", totalLeaves: 108, casualLeave: 38, sickLeave: 30, earnedLeave: 37, other: 3, avgDaysPerEmployee: 1.9 },
    { month: "June 2024", totalLeaves: 135, casualLeave: 48, sickLeave: 35, earnedLeave: 49, other: 3, avgDaysPerEmployee: 2.3 },
  ];

  // Leave Type Popularity
  const leaveTypePopularity = [
    { leaveType: "Casual Leave", count: 255, percentage: 38.5, avgDays: 1.5 },
    { leaveType: "Sick Leave", count: 198, percentage: 29.9, avgDays: 2.0 },
    { leaveType: "Earned Leave", count: 249, percentage: 37.6, avgDays: 3.2 },
    { leaveType: "Maternity Leave", count: 8, percentage: 1.2, avgDays: 90.0 },
    { leaveType: "Paternity Leave", count: 12, percentage: 1.8, avgDays: 15.0 },
  ];

  // Seasonal Leave Patterns
  const seasonalPatterns = [
    { quarter: "Q1 (Jan-Mar)", totalLeaves: 365, peakMonth: "March", reason: "Holiday season" },
    { quarter: "Q2 (Apr-Jun)", totalLeaves: 358, peakMonth: "June", reason: "Summer vacation" },
    { quarter: "Q3 (Jul-Sep)", totalLeaves: 342, peakMonth: "September", reason: "Festival season" },
    { quarter: "Q4 (Oct-Dec)", totalLeaves: 385, peakMonth: "December", reason: "Year-end holidays" },
  ];

  // Department-wise Leave Utilization
  const deptUtilization = [
    { department: "Engineering", totalEmployees: 150, avgLeaveDays: 18.5, utilizationRate: 75.2, casualLeave: 680, sickLeave: 450, earnedLeave: 620 },
    { department: "QA", totalEmployees: 45, avgLeaveDays: 16.2, utilizationRate: 68.5, casualLeave: 180, sickLeave: 150, earnedLeave: 220 },
    { department: "Design", totalEmployees: 25, avgLeaveDays: 20.1, utilizationRate: 81.2, casualLeave: 120, sickLeave: 80, earnedLeave: 150 },
    { department: "HR", totalEmployees: 30, avgLeaveDays: 17.8, utilizationRate: 72.1, casualLeave: 140, sickLeave: 120, earnedLeave: 180 },
    { department: "Finance", totalEmployees: 35, avgLeaveDays: 16.5, utilizationRate: 66.8, casualLeave: 160, sickLeave: 140, earnedLeave: 200 },
    { department: "Support", totalEmployees: 40, avgLeaveDays: 17.0, utilizationRate: 69.0, casualLeave: 180, sickLeave: 160, earnedLeave: 240 },
  ];

  // Unutilized Leave Alerts
  const unutilizedLeaveAlerts = [
    { employee: "Priya Sharma", employeeId: "EMP001", department: "Engineering", leaveType: "Earned Leave", balance: 15, threshold: 10, riskLevel: "High" },
    { employee: "Arjun Singh", employeeId: "EMP003", department: "Engineering", leaveType: "Earned Leave", balance: 12, threshold: 10, riskLevel: "High" },
    { employee: "Neha Gupta", employeeId: "EMP004", department: "HR", leaveType: "Sick Leave", balance: 8, threshold: 5, riskLevel: "Medium" },
    { employee: "Karthik Kumar", employeeId: "EMP006", department: "Support", leaveType: "Earned Leave", balance: 11, threshold: 10, riskLevel: "High" },
  ];

  // Leave Clustering
  const leaveClustering = [
    { date: "2024-01-15", totalEmployees: 12, departments: ["Engineering", "QA", "Design"], impact: "High", casualLeave: 8, sickLeave: 2, earnedLeave: 2 },
    { date: "2024-03-20", totalEmployees: 18, departments: ["Engineering", "HR", "Finance"], impact: "Very High", casualLeave: 12, sickLeave: 3, earnedLeave: 3 },
    { date: "2024-06-10", totalEmployees: 15, departments: ["Support", "QA", "Design"], impact: "High", casualLeave: 10, sickLeave: 2, earnedLeave: 3 },
    { date: "2024-12-25", totalEmployees: 25, departments: ["All"], impact: "Critical", casualLeave: 18, sickLeave: 2, earnedLeave: 5 },
  ];

  // Leave Approval Data
  const leaveApprovalData = [
    { id: 1, employee: "Priya Sharma", department: "Engineering", leaveType: "Casual Leave", fromDate: "2024-11-20", toDate: "2024-11-22", appliedOn: "2024-11-15", approvedOn: null, approvalTime: null, status: "Pending", approver: "John Manager" },
    { id: 2, employee: "Vikas Rao", department: "QA", leaveType: "Sick Leave", fromDate: "2024-10-05", toDate: "2024-10-06", appliedOn: "2024-10-01", approvedOn: "2024-10-02", approvalTime: "1 day", status: "Approved", approver: "Sarah Manager" },
    { id: 3, employee: "Neha Gupta", department: "HR", leaveType: "Casual Leave", fromDate: "2024-11-18", toDate: "2024-11-18", appliedOn: "2024-11-16", approvedOn: null, approvalTime: null, status: "Pending", approver: "Mike Manager" },
    { id: 4, employee: "Meera Joshi", department: "Finance", leaveType: "Sick Leave", fromDate: "2024-09-20", toDate: "2024-09-21", appliedOn: "2024-09-19", approvedOn: "2024-09-19", approvalTime: "Same day", status: "Approved", approver: "Lisa Manager" },
  ];

  // Leave Rejection Analysis
  const leaveRejectionData = [
    { employee: "Sneha Reddy", department: "Design", leaveType: "Casual Leave", reason: "Short notice period", rejectionRate: "5.2%", pattern: "Frequent short notice" },
    { employee: "Harsha Nair", department: "QA", leaveType: "Casual Leave", reason: "Urgency not justified", rejectionRate: "3.8%", pattern: "Low justification" },
    { employee: "Rajesh Kumar", department: "Engineering", leaveType: "Earned Leave", reason: "Insufficient team coverage", rejectionRate: "4.1%", pattern: "Resource constraints" },
  ];

  // Leave Cancellation Reports
  const leaveCancellationData = [
    { employee: "Priya Sharma", employeeId: "EMP001", department: "Engineering", leaveType: "Casual Leave", originalFrom: "2024-10-15", originalTo: "2024-10-17", cancelledOn: "2024-10-12", reason: "Work emergency", cancelledBy: "Self" },
    { employee: "Arjun Singh", employeeId: "EMP003", department: "Engineering", leaveType: "Earned Leave", originalFrom: "2024-09-05", originalTo: "2024-09-10", cancelledOn: "2024-09-03", reason: "Project deadline", cancelledBy: "Manager" },
  ];

  // Demographic Data
  const demographicData = [
    { department: "Engineering", totalEmployees: 150, male: 110, female: 38, other: 2, avgAge: 29.5, avgTenure: "2.8 years" },
    { department: "QA", totalEmployees: 45, male: 28, female: 16, other: 1, avgAge: 30.2, avgTenure: "3.1 years" },
    { department: "Design", totalEmployees: 25, male: 10, female: 14, other: 1, avgAge: 28.7, avgTenure: "2.5 years" },
    { department: "HR", totalEmployees: 30, male: 10, female: 20, other: 0, avgAge: 32.1, avgTenure: "4.2 years" },
    { department: "Finance", totalEmployees: 35, male: 15, female: 20, other: 0, avgAge: 33.5, avgTenure: "5.0 years" },
    { department: "Support", totalEmployees: 40, male: 25, female: 15, other: 0, avgAge: 31.2, avgTenure: "3.8 years" },
  ];

  // Bank Information Summary
  const bankInfoSummary = [
    { bankName: "HDFC Bank", employees: 85, percentage: 25.8 },
    { bankName: "ICICI Bank", employees: 72, percentage: 21.8 },
    { bankName: "SBI", employees: 68, percentage: 20.6 },
    { bankName: "Axis Bank", employees: 45, percentage: 13.6 },
    { bankName: "Kotak Mahindra", employees: 35, percentage: 10.6 },
    { bankName: "Others", employees: 25, percentage: 7.6 },
  ];

  /* -------- FILTERING -------- */
  const filtered = leaves.filter((l) => {
    const matchesSearch =
      l.employee.toLowerCase().includes(filter.toLowerCase()) ||
      l.department.toLowerCase().includes(filter.toLowerCase()) ||
      l.leaveType.toLowerCase().includes(filter.toLowerCase()) ||
      l.employeeCode.toLowerCase().includes(filter.toLowerCase()) ||
      l.designation.toLowerCase().includes(filter.toLowerCase());

    const matchesType = !typeFilter || l.leaveType === typeFilter;
    const matchesStatus = !statusFilter || l.status === statusFilter;
    const matchesDept = !deptFilter || l.department === deptFilter;
    const matchesLocation = !locationFilter || l.location === locationFilter;
    const matchesGrade = !gradeFilter || l.grade === gradeFilter;
    const matchesDesignation = !designationFilter || l.designation === designationFilter;
    const matchesGender = !genderFilter || l.gender === genderFilter;

    return matchesSearch && matchesType && matchesStatus && matchesDept &&
      matchesLocation && matchesGrade && matchesDesignation && matchesGender;
  });

  /* -------- PAGINATION -------- */
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const display = filtered.slice(start, start + perPage);

  /* -------- KPIs -------- */
  const kpis = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "Pending").length,
    approved: leaves.filter((l) => l.status === "Approved").length,
    rejected: leaves.filter((l) => l.status === "Rejected").length,
    totalEmployees: new Set(leaves.map(l => l.employeeCode)).size,
    avgAge: Math.round(leaves.reduce((sum, l) => sum + getAge(l.dob), 0) / leaves.length),
  };

  // Helper function to render distribution chart
  const renderDistributionChart = (data, labelKey, valueKey, color = '#3b82f6') => {
    const maxValue = Math.max(...data.map(d => d[valueKey]));
    return (
      <div className="mt-3">
        {data.map((item, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span className="small fw-medium">{item[labelKey]}</span>
              <span className="small text-muted">{item[valueKey]}{item.percentage && ` (${item.percentage}%)`}</span>
            </div>
            <div className="progress" style={{ height: '20px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${(item[valueKey] / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              >
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* -----------------------------------------
     ACTIONS: APPROVE / REJECT / DELETE
  ----------------------------------------- */
  const updateStatus = (id, newStatus) => {
    setLeaves((prev) =>
      prev.map((lv) =>
        lv.id === id ? { ...lv, status: newStatus } : lv
      )
    );
    setModalLeave(null);
  };

  const bulkAction = (action) => {
    setLeaves((prev) =>
      prev.map((lv) =>
        selected.includes(lv.id) ? { ...lv, status: action } : lv
      )
    );
    setSelected([]);
  };

  const bulkDelete = () => {
    setLeaves((prev) => prev.filter((l) => !selected.includes(l.id)));
    setSelected([]);
  };

  /* -------- EXPORT CSV -------- */
  const exportCSV = () => {
    const rows = [
      ["Employee Code", "Employee", "Department", "Leave Type", "From", "To", "Status", "Gender", "Grade", "Designation", "Location", "Mobile", "Email"],
      ...filtered.map((l) => [
        l.employeeCode,
        l.employee,
        l.department,
        l.leaveType,
        l.fromDate,
        l.toDate,
        l.status,
        l.gender,
        l.grade,
        l.designation,
        l.location,
        l.mobile,
        l.personalEmail,
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leave-reports-enhanced.csv";
    a.click();
  };

  return (

    <div className="container-fluid p-4">

      {/* ----------------- TITLE ----------------- */}
      <div className="mb-4">
        <h5 className="text-3xl fw-bold text-dark mb-2  d-flex align-items-center gap-2">
          <Icon icon="heroicons:calendar-days" />

          Leave Reports & Analytics
        </h5>
        <p className="text-muted">Comprehensive leave management reports and analytics dashboard with employee demographics</p>
      </div>

      {/* ----------------- TAB NAVIGATION ----------------- */}
      <div className="card mb-4">
        <div className="card-body">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'balance' ? 'active' : ''}`}
                onClick={() => setActiveTab('balance')}
              >
                <Calendar className="me-2" size={16} />
                Leave Balance Reports
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'utilization' ? 'active' : ''}`}
                onClick={() => setActiveTab('utilization')}
              >
                <BarChart3 className="me-2" size={16} />
                Leave Utilization Reports
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'approvals' ? 'active' : ''}`}
                onClick={() => setActiveTab('approvals')}
              >
                <FileText className="me-2" size={16} />
                Leave Approval Reports
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'demographics' ? 'active' : ''}`}
                onClick={() => setActiveTab('demographics')}
              >
                <Users className="me-2" size={16} />
                Employee Demographics
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ----------------- ENHANCED FILTERS ----------------- */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label small">Search</label>
              <div className="input-group">
                <span className="input-group-text"><Search size={14} /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Department</label>
              <select className="form-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                <option value="">All Departments</option>
                {[...new Set(leaves.map((l) => l.department))].map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Location</label>
              <select className="form-select" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                <option value="">All Locations</option>
                {[...new Set(leaves.map((l) => l.location))].map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Grade</label>
              <select className="form-select" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
                <option value="">All Grades</option>
                {[...new Set(leaves.map((l) => l.grade))].map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Gender</label>
              <select className="form-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                <option value="">All Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small">Status</label>
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- KPIs ----------------- */}
      <div className="row g-3 mb-4">
        <div className="col-sm-2">
          <div className="card p-3">
            <div className="small text-muted">Total Employees</div>
            <div className="h5">{kpis.totalEmployees}</div>
          </div>
        </div>
        <div className="col-sm-2">
          <div className="card p-3">
            <div className="small text-muted">Avg Age</div>
            <div className="h5">{kpis.avgAge} years</div>
          </div>
        </div>
        <div className="col-sm-2">
          <div className="card p-3">
            <div className="small text-muted">Total Leaves</div>
            <div className="h5">{kpis.total}</div>
          </div>
        </div>
        <div className="col-sm-2">
          <div className="card p-3">
            <div className="small text-muted">Pending</div>
            <div className="h5 text-warning">{kpis.pending}</div>
          </div>
        </div>
        <div className="col-sm-2">
          <div className="card p-3">
            <div className="small text-muted">Approved</div>
            <div className="h5 text-success">{kpis.approved}</div>
          </div>
        </div>
        <div className="col-sm-2">
          <div className="card p-3">
            <div className="small text-muted">Rejected</div>
            <div className="h5 text-danger">{kpis.rejected}</div>
          </div>
        </div>
      </div>

      {/* ----------------- LEAVE BALANCE REPORTS ----------------- */}
      {activeTab === 'balance' && (
        <div>
          {/* Employee-wise Leave Balance */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Employee-wise Leave Balance</h5>
              <button
                onClick={() => {
                  const csv = [
                    [
                      "Employee",
                      "Employee ID",
                      "Department",
                      "Grade",
                      "Designation",
                      "Casual Leave (Balance)",
                      "Sick Leave (Balance)",
                      "Earned Leave (Balance)",
                      "Total Balance",
                    ],
                    ...leaveBalanceData.map((l) => [
                      l.employee,
                      l.employeeId,
                      l.department,
                      leaves.find((e) => e.employeeCode === l.employeeId)?.grade || "",
                      leaves.find((e) => e.employeeCode === l.employeeId)?.designation || "",
                      l.casualLeave.balance,
                      l.sickLeave.balance,
                      l.earnedLeave.balance,
                      l.totalBalance,
                    ]),
                  ]
                    .map((r) => r.join(","))
                    .join("\n");

                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "employee-leave-balance.csv";
                  a.click();
                }}
                className="
    inline-flex items-center gap-2
    rounded-md border border-info-500
    bg-info-500 px-3 py-1.5
    text-xs font-medium text-dark-700
    hover:bg-info-100 hover:text-info-800
    focus:outline-none focus:ring-2 focus:ring-info-200
    transition
  "
              >
                <Download size={14} />
                Export
              </button>

            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Grade</th>
                      <th>Designation</th>
                      <th>Casual Leave</th>
                      <th>Sick Leave</th>
                      <th>Earned Leave</th>
                      <th>Total Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveBalanceData.map((emp, idx) => {
                      const employeeDetails = leaves.find(e => e.employeeCode === emp.employeeId);
                      return (
                        <tr key={idx}>
                          <td><strong>{emp.employee}</strong></td>
                          <td><small className="text-muted">{emp.employeeId}</small></td>
                          <td>{emp.department}</td>
                          <td><span className="badge bg-info">{employeeDetails?.grade}</span></td>
                          <td>{employeeDetails?.designation}</td>
                          <td>
                            <small>Used: {emp.casualLeave.used}/{emp.casualLeave.allocated}</small><br />
                            <strong>Balance: {emp.casualLeave.balance}</strong>
                            {emp.casualLeave.carryForward > 0 && <small className="text-info"> (CF: {emp.casualLeave.carryForward})</small>}
                          </td>
                          <td>
                            <small>Used: {emp.sickLeave.used}/{emp.sickLeave.allocated}</small><br />
                            <strong>Balance: {emp.sickLeave.balance}</strong>
                            {emp.sickLeave.carryForward > 0 && <small className="text-info"> (CF: {emp.sickLeave.carryForward})</small>}
                          </td>
                          <td>
                            <small>Used: {emp.earnedLeave.used}/{emp.earnedLeave.allocated}</small><br />
                            <strong>Balance: {emp.earnedLeave.balance}</strong>
                            {emp.earnedLeave.carryForward > 0 && <small className="text-info"> (CF: {emp.earnedLeave.carryForward})</small>}
                          </td>
                          <td><strong className="text-primary">{emp.totalBalance}</strong></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Department-wise Leave Liability */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header">
                  <h6 className="mb-0">Department-wise Leave Liability</h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Employees</th>
                          <th>Total Balance</th>
                          <th>Encashment Liability</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deptLeaveLiability.map((dept, idx) => (
                          <tr key={idx}>
                            <td><strong>{dept.department}</strong></td>
                            <td>{dept.totalEmployees}</td>
                            <td>{dept.totalBalance} days</td>
                            <td>₹{dept.encashmentLiability.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header">
                  <h6 className="mb-0">Leave Type Utilization</h6>
                </div>
                <div className="card-body">
                  {renderDistributionChart(
                    deptLeaveLiability.map(d => ({ department: d.department, value: d.totalBalance })),
                    'department',
                    'value',
                    '#3b82f6'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Leave Accrual Register */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Leave Accrual Register</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Grade</th>
                      <th>Accrual Date</th>
                      <th>Leave Type</th>
                      <th>Days Accrued</th>
                      <th>Balance Before</th>
                      <th>Balance After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveAccrualData.map((accrual, idx) => {
                      const employeeDetails = leaves.find(e => e.employeeCode === accrual.employeeId);
                      return (
                        <tr key={idx}>
                          <td><strong>{accrual.employee}</strong></td>
                          <td><small className="text-muted">{accrual.employeeId}</small></td>
                          <td>{accrual.department}</td>
                          <td><span className="badge bg-secondary">{employeeDetails?.grade}</span></td>
                          <td>{accrual.accrualDate}</td>
                          <td>{accrual.leaveType}</td>
                          <td><strong className="text-success">+{accrual.daysAccrued}</strong></td>
                          <td>{accrual.balanceBefore}</td>
                          <td><strong>{accrual.balanceAfter}</strong></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Carry-forward Leave Tracking */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Carry-forward Leave Tracking</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Grade</th>
                      <th>Leave Type</th>
                      <th>Previous Year Balance</th>
                      <th>Carried Forward</th>
                      <th>Current Year Allocated</th>
                      <th>Total Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carryForwardData.map((cf, idx) => {
                      const employeeDetails = leaves.find(e => e.employeeCode === cf.employeeId);
                      return (
                        <tr key={idx}>
                          <td><strong>{cf.employee}</strong></td>
                          <td><small className="text-muted">{cf.employeeId}</small></td>
                          <td>{cf.department}</td>
                          <td><span className="badge bg-info">{employeeDetails?.grade}</span></td>
                          <td>{cf.leaveType}</td>
                          <td>{cf.previousYearBalance}</td>
                          <td><strong className="text-info">{cf.carriedForward}</strong></td>
                          <td>{cf.currentYearAllocated}</td>
                          <td><strong className="text-primary">{cf.totalAvailable}</strong></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Leave Encashment Liability */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Leave Encashment Liability by Department</h6>
            </div>
            <div className="card-body">
              <div className="row">
                {deptLeaveLiability.map((dept, idx) => (
                  <div key={idx} className="col-md-4 mb-3">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="card-title">{dept.department}</h6>
                        <div className="mb-2">
                          <small className="text-muted">Employees: {dept.totalEmployees}</small>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted">Total Balance: {dept.totalBalance} days</small>
                        </div>
                        <div className="h4 text-primary mb-0">₹{dept.encashmentLiability.toLocaleString()}</div>
                        <small className="text-muted">Encashment Liability</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- LEAVE UTILIZATION REPORTS ----------------- */}
      {activeTab === 'utilization' && (
        <div>
          {/* Monthly Leave Taken Summary */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Monthly Leave Taken Summary</h5>
              <button
                className="
    inline-flex items-center gap-2
    rounded-md border 
    px-3 py-1.5
    text-xs font-medium text-dark-800
    hover:bg-info-600 hover:text-dark-900
    focus:outline-none focus:ring-2 focus:ring-gray-300
    transition
  "
              >
                <Download size={14} />
                Export
              </button>

            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Total Leaves</th>
                      <th>Casual Leave</th>
                      <th>Sick Leave</th>
                      <th>Earned Leave</th>
                      <th>Other</th>
                      <th>Avg Days/Employee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyLeaveSummary.map((month, idx) => (
                      <tr key={idx}>
                        <td><strong>{month.month}</strong></td>
                        <td>{month.totalLeaves}</td>
                        <td>{month.casualLeave}</td>
                        <td>{month.sickLeave}</td>
                        <td>{month.earnedLeave}</td>
                        <td>{month.other}</td>
                        <td><strong>{month.avgDaysPerEmployee}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Leave Type Popularity Analysis */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header">
                  <h6 className="mb-0">Leave Type Popularity Analysis</h6>
                </div>
                <div className="card-body">
                  {renderDistributionChart(
                    leaveTypePopularity,
                    'leaveType',
                    'count',
                    '#10b981'
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header">
                  <h6 className="mb-0">Average Days per Leave Type</h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Leave Type</th>
                          <th>Count</th>
                          <th>Avg Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveTypePopularity.map((type, idx) => (
                          <tr key={idx}>
                            <td>{type.leaveType}</td>
                            <td>{type.count}</td>
                            <td><strong>{type.avgDays}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seasonal Leave Patterns */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Seasonal Leave Patterns</h6>
            </div>
            <div className="card-body">
              <div className="row">
                {seasonalPatterns.map((pattern, idx) => (
                  <div key={idx} className="col-md-3 mb-3">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="card-title">{pattern.quarter}</h6>
                        <div className="h4 text-primary mb-2">{pattern.totalLeaves}</div>
                        <small className="text-muted d-block">Total Leaves</small>
                        <small className="text-info d-block mt-2">Peak: {pattern.peakMonth}</small>
                        <small className="text-secondary">{pattern.reason}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department-wise Leave Utilization */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Department-wise Leave Utilization</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Total Employees</th>
                      <th>Avg Leave Days</th>
                      <th>Utilization Rate</th>
                      <th>Casual Leave</th>
                      <th>Sick Leave</th>
                      <th>Earned Leave</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptUtilization.map((dept, idx) => (
                      <tr key={idx}>
                        <td><strong>{dept.department}</strong></td>
                        <td>{dept.totalEmployees}</td>
                        <td>{dept.avgLeaveDays}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '100px', height: '20px' }}>
                              <div
                                className={`progress-bar ${dept.utilizationRate > 80 ? 'bg-danger' : dept.utilizationRate > 60 ? 'bg-warning' : 'bg-success'}`}
                                style={{ width: `${dept.utilizationRate}%` }}
                              >
                              </div>
                            </div>
                            <span>{dept.utilizationRate}%</span>
                          </div>
                        </td>
                        <td>{dept.casualLeave}</td>
                        <td>{dept.sickLeave}</td>
                        <td>{dept.earnedLeave}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Unutilized Leave Alerts */}
          <div className="card mb-4 border-warning">
            <div className="card-header bg-warning-subtle">
              <h6 className="mb-0 d-flex align-items-center">
                <AlertTriangle className="me-2" size={18} />
                Unutilized Leave Alerts
              </h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Grade</th>
                      <th>Leave Type</th>
                      <th>Balance</th>
                      <th>Threshold</th>
                      <th>Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unutilizedLeaveAlerts.map((alert, idx) => {
                      const employeeDetails = leaves.find(e => e.employeeCode === alert.employeeId);
                      return (
                        <tr key={idx}>
                          <td><strong>{alert.employee}</strong></td>
                          <td><small className="text-muted">{alert.employeeId}</small></td>
                          <td>{alert.department}</td>
                          <td><span className="badge bg-info">{employeeDetails?.grade}</span></td>
                          <td>{alert.leaveType}</td>
                          <td><strong>{alert.balance}</strong></td>
                          <td>{alert.threshold}</td>
                          <td>
                            <span className={`badge bg-${alert.riskLevel === 'High' ? 'danger' : 'warning'}`}>
                              {alert.riskLevel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Leave Clustering */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Leave Clustering (Multiple Employees on Leave)</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Total Employees</th>
                      <th>Departments Affected</th>
                      <th>Impact</th>
                      <th>Casual Leave</th>
                      <th>Sick Leave</th>
                      <th>Earned Leave</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveClustering.map((cluster, idx) => (
                      <tr key={idx}>
                        <td><strong>{cluster.date}</strong></td>
                        <td><strong className="text-danger">{cluster.totalEmployees}</strong></td>
                        <td>{cluster.departments.join(', ')}</td>
                        <td>
                          <span className={`badge bg-${cluster.impact === 'Critical' ? 'danger' :
                            cluster.impact === 'Very High' ? 'warning' : 'info'
                            }`}>
                            {cluster.impact}
                          </span>
                        </td>
                        <td>{cluster.casualLeave}</td>
                        <td>{cluster.sickLeave}</td>
                        <td>{cluster.earnedLeave}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- LEAVE APPROVAL REPORTS ----------------- */}
      {activeTab === 'approvals' && (
        <div>
          {/* Pending Leave Approvals */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pending Leave Approvals</h5>
              <span className="badge bg-warning">{leaveApprovalData.filter(l => l.status === 'Pending').length} Pending</span>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Grade</th>
                      <th>Leave Type</th>
                      <th>From - To</th>
                      <th>Applied On</th>
                      <th>Approver</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveApprovalData.filter(l => l.status === 'Pending').map((leave) => {
                      const employeeDetails = leaves.find(e => e.employee === leave.employee);
                      return (
                        <tr key={leave.id}>
                          <td><strong>{leave.employee}</strong></td>
                          <td><small className="text-muted">{employeeDetails?.employeeCode}</small></td>
                          <td>{leave.department}</td>
                          <td><span className="badge bg-secondary">{employeeDetails?.grade}</span></td>
                          <td>{leave.leaveType}</td>
                          <td>{leave.fromDate} - {leave.toDate}</td>
                          <td>{leave.appliedOn}</td>
                          <td>{leave.approver}</td>
                          <td><span className="badge bg-warning">{leave.status}</span></td>
                          <td>
                            <button className="btn btn-sm btn-success me-1" onClick={() => updateStatus(leave.id, "Approved")}>
                              <Check size={14} />
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => updateStatus(leave.id, "Rejected")}>
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Average Leave Approval Time */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Average Leave Approval Time</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="card border text-center">
                    <div className="card-body">
                      <ClockIcon className="text-primary mb-2" size={32} />
                      <div className="h4 text-primary">1.2</div>
                      <small className="text-muted">Average Days</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border text-center">
                    <div className="card-body">
                      <ClockIcon className="text-success mb-2" size={32} />
                      <div className="h4 text-success">4 hrs</div>
                      <small className="text-muted">Fastest Approval</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border text-center">
                    <div className="card-body">
                      <ClockIcon className="text-warning mb-2" size={32} />
                      <div className="h4 text-warning">3.5 days</div>
                      <small className="text-muted">Slowest Approval</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border text-center">
                    <div className="card-body">
                      <TrendingDown className="text-info mb-2" size={32} />
                      <div className="h4 text-info">-15%</div>
                      <small className="text-muted">vs Last Month</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h6 className="mb-3">Approval Time by Department</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Avg Approval Time</th>
                        <th>Total Approvals</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Engineering</td><td>1.0 day</td><td>45</td></tr>
                      <tr><td>QA</td><td>1.5 days</td><td>28</td></tr>
                      <tr><td>HR</td><td>0.8 days</td><td>32</td></tr>
                      <tr><td>Finance</td><td>1.3 days</td><td>18</td></tr>
                      <tr><td>Support</td><td>1.2 days</td><td>25</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Rejection Analysis */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Leave Rejection Analysis</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Grade</th>
                      <th>Leave Type</th>
                      <th>Rejection Reason</th>
                      <th>Rejection Rate</th>
                      <th>Pattern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRejectionData.map((rejection, idx) => {
                      const employeeDetails = leaves.find(e => e.employee === rejection.employee);
                      return (
                        <tr key={idx}>
                          <td><strong>{rejection.employee}</strong></td>
                          <td><small className="text-muted">{employeeDetails?.employeeCode}</small></td>
                          <td>{rejection.department}</td>
                          <td><span className="badge bg-secondary">{employeeDetails?.grade}</span></td>
                          <td>{rejection.leaveType}</td>
                          <td>{rejection.reason}</td>
                          <td><span className="badge bg-danger">{rejection.rejectionRate}</span></td>
                          <td><small className="text-muted">{rejection.pattern}</small></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <h6 className="mb-3">Overall Rejection Statistics</h6>
                <div className="row">
                  <div className="col-md-4">
                    <div className="card border text-center">
                      <div className="card-body">
                        <div className="h4 text-danger">8.5%</div>
                        <small className="text-muted">Overall Rejection Rate</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border text-center">
                      <div className="card-body">
                        <div className="h4 text-warning">"Short notice"</div>
                        <small className="text-muted">Most Common Reason</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border text-center">
                      <div className="card-body">
                        <div className="h4 text-info">Design</div>
                        <small className="text-muted">Highest Rejection Rate Dept</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Cancellation Reports */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Leave Cancellation Reports</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Grade</th>
                      <th>Leave Type</th>
                      <th>Original Period</th>
                      <th>Cancelled On</th>
                      <th>Reason</th>
                      <th>Cancelled By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveCancellationData.map((cancel, idx) => {
                      const employeeDetails = leaves.find(e => e.employee === cancel.employee);
                      return (
                        <tr key={idx}>
                          <td><strong>{cancel.employee}</strong></td>
                          <td><small className="text-muted">{cancel.employeeId}</small></td>
                          <td>{cancel.department}</td>
                          <td><span className="badge bg-info">{employeeDetails?.grade}</span></td>
                          <td>{cancel.leaveType}</td>
                          <td>{cancel.originalFrom} - {cancel.originalTo}</td>
                          <td>{cancel.cancelledOn}</td>
                          <td>{cancel.reason}</td>
                          <td><span className="badge bg-info">{cancel.cancelledBy}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- EMPLOYEE DEMOGRAPHICS REPORTS ----------------- */}
      {activeTab === 'demographics' && (
        <div>
          {/* Department-wise Gender Distribution */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Department-wise Employee Demographics</h5>
              <button
                onClick={() => {
                  const csv = [
                    [
                      "Employee",
                      "Employee ID",
                      "Department",
                      "Grade",
                      "Designation",
                      "Casual Leave (Balance)",
                      "Sick Leave (Balance)",
                      "Earned Leave (Balance)",
                      "Total Balance",
                    ],
                    ...leaveBalanceData.map((l) => [
                      l.employee,
                      l.employeeId,
                      l.department,
                      leaves.find((e) => e.employeeCode === l.employeeId)?.grade || "",
                      leaves.find((e) => e.employeeCode === l.employeeId)?.designation || "",
                      l.casualLeave.balance,
                      l.sickLeave.balance,
                      l.earnedLeave.balance,
                      l.totalBalance,
                    ]),
                  ]
                    .map((r) => r.join(","))
                    .join("\n");

                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "employee-leave-balance.csv";
                  a.click();
                }}
                className="
    inline-flex items-center gap-2
    rounded-md border border-cyan-500
    bg-cyan-50 px-3 py-1.5
    text-xs font-medium text-dark-700
    hover:bg-info-600 hover:text-cyan-800
    focus:outline-none focus:ring-2 focus:ring-cyan-200
    transition
  "
              >
                <Download size={14} />
                Export
              </button>

            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Total Employees</th>
                      <th>Male</th>
                      <th>Female</th>
                      <th>Other</th>
                      <th>Gender Ratio</th>
                      <th>Avg Age</th>
                      <th>Avg Tenure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demographicData.map((dept, idx) => (
                      <tr key={idx}>
                        <td><strong>{dept.department}</strong></td>
                        <td>{dept.totalEmployees}</td>
                        <td>{dept.male}</td>
                        <td>{dept.female}</td>
                        <td>{dept.other}</td>
                        <td><strong>{dept.male}:{dept.female}</strong></td>
                        <td>{dept.avgAge} years</td>
                        <td>{dept.avgTenure}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Employee Age Distribution */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center">
                  <User className="me-2" size={18} />
                  <h6 className="mb-0">Employee Age Distribution</h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-primary">65</div>
                        <small className="text-muted">20-25 years</small>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-success">120</div>
                        <small className="text-muted">26-30 years</small>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-warning">85</div>
                        <small className="text-muted">31-35 years</small>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-info">60</div>
                        <small className="text-muted">36+ years</small>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h6 className="mb-3">Age Group by Department</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Department</th>
                            <th>20-25</th>
                            <th>26-30</th>
                            <th>31-35</th>
                            <th>36+</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>Engineering</td><td>45</td><td>65</td><td>30</td><td>10</td></tr>
                          <tr><td>QA</td><td>10</td><td>20</td><td>12</td><td>3</td></tr>
                          <tr><td>HR</td><td>2</td><td>8</td><td>12</td><td>8</td></tr>
                          <tr><td>Finance</td><td>1</td><td>5</td><td>15</td><td>14</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center">
                  <CalendarIcon className="me-2" size={18} />
                  <h6 className="mb-0">Employee Tenure Analysis</h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-primary">45%</div>
                        <small className="text-muted">0-2 years</small>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-success">35%</div>
                        <small className="text-muted">2-5 years</small>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-warning">15%</div>
                        <small className="text-muted">5-10 years</small>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-info">5%</div>
                        <small className="text-muted">10+ years</small>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h6 className="mb-3">Avg Tenure by Department</h6>
                    {renderDistributionChart(
                      demographicData.map(d => ({ department: d.department, value: parseFloat(d.avgTenure) })),
                      'department',
                      'value',
                      '#8b5cf6'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Contact Information Summary */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <Phone className="me-2" size={18} />
              <h6 className="mb-0">Employee Contact Information Summary</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Total Employees</th>
                      <th>Mobile Numbers</th>
                      <th>Personal Emails</th>
                      <th>Emergency Contacts</th>
                      <th>Missing Info</th>
                      <th>Contact Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demographicData.map((dept, idx) => {
                      const mobileCoverage = Math.round((dept.totalEmployees - 2) / dept.totalEmployees * 100);
                      const emailCoverage = Math.round((dept.totalEmployees - 3) / dept.totalEmployees * 100);
                      const emergencyCoverage = Math.round((dept.totalEmployees - 1) / dept.totalEmployees * 100);
                      return (
                        <tr key={idx}>
                          <td><strong>{dept.department}</strong></td>
                          <td>{dept.totalEmployees}</td>
                          <td>{dept.totalEmployees - 2} ({mobileCoverage}%)</td>
                          <td>{dept.totalEmployees - 3} ({emailCoverage}%)</td>
                          <td>{dept.totalEmployees - 1} ({emergencyCoverage}%)</td>
                          <td><span className="badge bg-warning">3</span></td>
                          <td>
                            <div className="progress" style={{ height: '20px' }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${mobileCoverage}%` }}
                              ></div>
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

          {/* Bank Information Distribution */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center">
                  <Banknote className="me-2" size={18} />
                  <h6 className="mb-0">Bank Information Distribution</h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Bank Name</th>
                          <th>Employees</th>
                          <th>Percentage</th>
                          <th>Distribution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankInfoSummary.map((bank, idx) => (
                          <tr key={idx}>
                            <td><strong>{bank.bankName}</strong></td>
                            <td>{bank.employees}</td>
                            <td>{bank.percentage}%</td>
                            <td>
                              <div className="progress" style={{ height: '15px' }}>
                                <div
                                  className="progress-bar"
                                  style={{ width: `${bank.percentage}%`, backgroundColor: '#3b82f6' }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center">
                  <Shield className="me-2" size={18} />
                  <h6 className="mb-0">Government ID Coverage</h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-4 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-success">98%</div>
                        <small className="text-muted">PAN Coverage</small>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-primary">95%</div>
                        <small className="text-muted">Aadhaar Coverage</small>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="border rounded p-3">
                        <div className="h4 text-info">92%</div>
                        <small className="text-muted">PF UAN Coverage</small>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h6 className="mb-3">ID Coverage by Department</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Department</th>
                            <th>PAN</th>
                            <th>Aadhaar</th>
                            <th>PF UAN</th>
                            <th>ESI</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>Engineering</td><td>99%</td><td>98%</td><td>95%</td><td>90%</td></tr>
                          <tr><td>QA</td><td>98%</td><td>96%</td><td>94%</td><td>88%</td></tr>
                          <tr><td>HR</td><td>100%</td><td>100%</td><td>100%</td><td>100%</td></tr>
                          <tr><td>Finance</td><td>100%</td><td>97%</td><td>96%</td><td>92%</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location-wise Employee Distribution */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <MapPin className="me-2" size={18} />
              <h6 className="mb-0">Location-wise Employee Distribution</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="card border">
                    <div className="card-body text-center">
                      <div className="h5 text-primary">180</div>
                      <div className="text-muted">Hyderabad</div>
                      <small>60% of total workforce</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border">
                    <div className="card-body text-center">
                      <div className="h5 text-success">120</div>
                      <div className="text-muted">Bangalore</div>
                      <small>40% of total workforce</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border">
                    <div className="card-body text-center">
                      <div className="h5 text-info">0</div>
                      <div className="text-muted">Other Locations</div>
                      <small>Remote/Other offices</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h6 className="mb-3">Location Distribution by Department</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Hyderabad</th>
                        <th>Bangalore</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Engineering</td><td>100</td><td>50</td><td>150</td></tr>
                      <tr><td>QA</td><td>30</td><td>15</td><td>45</td></tr>
                      <tr><td>Design</td><td>15</td><td>10</td><td>25</td></tr>
                      <tr><td>HR</td><td>20</td><td>10</td><td>30</td></tr>
                      <tr><td>Finance</td><td>15</td><td>20</td><td>35</td></tr>
                      <tr><td>Support</td><td>0</td><td>15</td><td>15</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Grade & Designation Distribution */}
          <div className="card mb-4">
            <div className="card-header d-flex align-items-center">
              <Briefcase className="me-2" size={18} />
              <h6 className="mb-0">Employee Grade & Designation Distribution</h6>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card border text-center">
                    <div className="card-body">
                      <div className="h4 text-primary">45%</div>
                      <small className="text-muted">Junior Level</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border text-center">
                    <div className="card-body">
                      <div className="h4 text-success">35%</div>
                      <small className="text-muted">Senior Level</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border text-center">
                    <div className="card-body">
                      <div className="h4 text-warning">15%</div>
                      <small className="text-muted">Lead/Manager</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border text-center">
                    <div className="card-body">
                      <div className="h4 text-info">5%</div>
                      <small className="text-muted">Director+</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Junior</th>
                      <th>Senior</th>
                      <th>Lead/Manager</th>
                      <th>Director+</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Engineering</td><td>60</td><td>65</td><td>20</td><td>5</td><td>150</td></tr>
                    <tr><td>QA</td><td>20</td><td>18</td><td>5</td><td>2</td><td>45</td></tr>
                    <tr><td>Design</td><td>15</td><td>8</td><td>2</td><td>0</td><td>25</td></tr>
                    <tr><td>HR</td><td>5</td><td>15</td><td>8</td><td>2</td><td>30</td></tr>
                    <tr><td>Finance</td><td>8</td><td>15</td><td>10</td><td>2</td><td>35</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- EMPLOYEE LIST TABLE ----------------- */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Employee Leave Records</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Employee Code</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Grade</th>
                  <th>Designation</th>
                  <th>Location</th>
                  <th>Gender</th>
                  <th>Mobile</th>
                  <th>Leave Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {display.map((employee) => (
                  <tr key={employee.id}>
                    <td><strong>{employee.employeeCode}</strong></td>
                    <td>{employee.employee}</td>
                    <td>{employee.department}</td>
                    <td><span className="badge bg-info">{employee.grade}</span></td>
                    <td>{employee.designation}</td>
                    <td>{employee.location}</td>
                    <td>{employee.gender}</td>
                    <td>{employee.mobile}</td>
                    <td>{employee.leaveType}</td>
                    <td>
                      <span className={`badge ${statusBadge(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setModalLeave(employee)}
                        className="
    inline-flex items-center gap-2
    rounded-md border border-blue-500
    px-3 py-1.5
    text-xs font-medium text-blue-600
    hover:bg-blue-50 hover:text-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-200
    transition
  "
                      >
                        <Eye size={14} />
                        View
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">
              Showing <strong>{start + 1}</strong> – <strong>{Math.min(start + perPage, filtered.length)}</strong> of <strong>{filtered.length}</strong>
            </small>
            <div className="btn-group">
              <button className="btn btn-outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "btn btn-primary" : "btn btn-outline-secondary"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button className="btn btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- ENHANCED EMPLOYEE DETAILS MODAL ----------------- */}
      {modalLeave && (
        <div className="modal fade show d-block" style={{
          background: "rgba(0,0,0,0.5)",
          position: "fixed",
          inset: 0,
          zIndex: 1050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          overflow: "auto"
        }}>
          <div className="modal-dialog modal-xl modal-dialog-centered" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            maxWidth: "1200px",
            width: "95%",
            margin: 0,
            padding: '20px'
          }}>
            <div className="modal-content border-0 shadow-lg" style={{
              borderRadius: "12px",
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
              width: '100%'
            }}>
              {/* Modal Header */}
              <div className="modal-header bg-primary text-white" style={{
                padding: "1.2rem 1.5rem",
                borderBottom: "none"
              }}>
                <div className="d-flex align-items-center w-100">
                  <div className="d-flex align-items-center flex-grow-1">
                    <User className="me-3" size={28} />
                    <div>
                      <h5 className="modal-title mb-0 fw-bold">
                        {modalLeave.employee} ({modalLeave.employeeCode})
                      </h5>
                      <small className="text-white-80">
                        {modalLeave.designation} • {modalLeave.department} • {modalLeave.location}
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setModalLeave(null)}
                    style={{ opacity: 1 }}
                  ></button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-0">
                <div className="container-fluid">
                  {/* Employee Overview Cards */}
                  <div className="row gx-3 gy-3 align-items-stretch border-bottom bg-light px-4 py-3">
                    <div className="col-md-3 mb-3">
                      <div className="card border-0 shadow-sm h-100 d-flex flex-column">
                        <div className="card-body text-center p-3 d-flex flex-column justify-content-center">
                          <User className="text-primary mb-2" size={24} />
                          <div className="h5 mb-1">{modalLeave.gender}</div>
                          <small className="text-muted">Gender</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="card border-0 shadow-sm h-100 d-flex flex-column">
                        <div className="card-body text-center p-3 d-flex flex-column justify-content-center">
                          <CalendarIcon className="text-success mb-2" size={24} />
                          <div className="h5 mb-1">{getAge(modalLeave.dob)} years</div>
                          <small className="text-muted">Age</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="card border-0 shadow-sm h-100 d-flex flex-column">
                        <div className="card-body text-center p-3 d-flex flex-column justify-content-center">
                          <Award className="text-warning mb-2" size={24} />
                          <div className="h5 mb-1">{modalLeave.grade}</div>
                          <small className="text-muted">Grade</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="card border-0 shadow-sm h-100 d-flex flex-column">
                        <div className="card-body text-center p-3 d-flex flex-column justify-content-center">
                          <Briefcase className="text-info mb-2" size={24} />
                          <div className="h5 mb-1">{getTenure(modalLeave.doj).years}y {getTenure(modalLeave.doj).months}m</div>
                          <small className="text-muted">Tenure</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Grid */}
                  <div className="row gx-4 gy-4 px-4 py-4">
                    {/* Left Column */}
                    <div className="col-lg-6">
                      {/* Basic Information */}
                      <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light d-flex align-items-center py-3">
                          <UserCheck className="me-2" size={18} />
                          <h6 className="mb-0 fw-semibold">Basic Information</h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "120px" }}>Date of Birth:</div>
                                <div className="fw-medium">{modalLeave.dob}</div>
                              </div>
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "120px" }}>Date of Joining:</div>
                                <div className="fw-medium">{modalLeave.doj}</div>
                              </div>
                              {modalLeave.doe && (
                                <div className="d-flex align-items-center mb-3">
                                  <div className="text-muted me-3" style={{ width: "120px" }}>Date of Exit:</div>
                                  <div className="fw-medium">{modalLeave.doe}</div>
                                </div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "120px" }}>Marital Status:</div>
                                <div className="fw-medium">{modalLeave.maritalStatus}</div>
                              </div>
                              {modalLeave.spouseName && (
                                <div className="d-flex align-items-center mb-3">
                                  <div className="text-muted me-3" style={{ width: "120px" }}>Spouse Name:</div>
                                  <div className="fw-medium">{modalLeave.spouseName}</div>
                                </div>
                              )}
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "120px" }}>Blood Group:</div>
                                <div className="fw-medium">{modalLeave.bloodGroup}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light d-flex align-items-center py-3">
                          <PhoneCall className="me-2" size={18} />
                          <h6 className="mb-0 fw-semibold">Contact Information</h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <Smartphone className="me-2 text-muted" size={16} />
                                <div className="text-muted me-3" style={{ width: "100px" }}>Mobile:</div>
                                <div className="fw-medium">{modalLeave.mobile}</div>
                              </div>
                              <div className="d-flex align-items-center mb-3">
                                <PhoneOutgoing className="me-2 text-muted" size={16} />
                                <div className="text-muted me-3" style={{ width: "100px" }}>Office Phone:</div>
                                <div className="fw-medium">{modalLeave.officePhone}</div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <Home className="me-2 text-muted" size={16} />
                                <div className="text-muted me-3" style={{ width: "100px" }}>Home Phone:</div>
                                <div className="fw-medium">{modalLeave.homePhone}</div>
                              </div>
                              <div className="d-flex align-items-center mb-3">
                                <Mailbox className="me-2 text-muted" size={16} />
                                <div className="text-muted me-3" style={{ width: "100px" }}>Emergency Contact:</div>
                                <div className="fw-medium">{modalLeave.emergencyContact}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Government IDs */}
                      <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light d-flex align-items-center py-3">
                          <Shield className="me-2" size={18} />
                          <h6 className="mb-0 fw-semibold">Government IDs</h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "80px" }}>PAN:</div>
                                <div className="fw-medium">{modalLeave.pan}</div>
                              </div>
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "80px" }}>Aadhaar:</div>
                                <div className="fw-medium">{modalLeave.aadhaar}</div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "80px" }}>PF UAN:</div>
                                <div className="fw-medium">{modalLeave.pfUan}</div>
                              </div>
                              {modalLeave.esi && (
                                <div className="d-flex align-items-center mb-3">
                                  <div className="text-muted me-3" style={{ width: "80px" }}>ESI:</div>
                                  <div className="fw-medium">{modalLeave.esi}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-lg-6">
                      {/* Email Information */}
                      <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light d-flex align-items-center py-3">
                          <Mail className="me-2" size={18} />
                          <h6 className="mb-0 fw-semibold">Email Information</h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <div className="text-muted me-3" style={{ width: "120px" }}>Office Email:</div>
                              <div className="fw-medium text-truncate">{modalLeave.officeEmail}</div>
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="text-muted me-3" style={{ width: "120px" }}>Personal Email:</div>
                              <div className="fw-medium text-truncate">{modalLeave.personalEmail}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bank Information */}
                      <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light d-flex align-items-center py-3">
                          <Banknote className="me-2" size={18} />
                          <h6 className="mb-0 fw-semibold">Bank Information</h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "100px" }}>Bank Name:</div>
                                <div className="fw-medium">{modalLeave.bankName}</div>
                              </div>
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "100px" }}>IFSC Code:</div>
                                <div className="fw-medium">{modalLeave.bankIfsc}</div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "100px" }}>Account No:</div>
                                <div className="fw-medium text-truncate">{modalLeave.bankAccount}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Work Information */}
                      <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light d-flex align-items-center py-3">
                          <Building className="me-2" size={18} />
                          <h6 className="mb-0 fw-semibold">Work Information</h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "120px" }}>Cost Center:</div>
                                <div className="fw-medium">{modalLeave.costCenter}</div>
                              </div>
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "120px" }}>Location:</div>
                                <div className="fw-medium">{modalLeave.location}</div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "120px" }}>Department:</div>
                                <div className="fw-medium">{modalLeave.department}</div>
                              </div>
                              <div className="d-flex align-items-center mb-3">
                                <div className="text-muted me-3" style={{ width: "120px" }}>Designation:</div>
                                <div className="fw-medium">{modalLeave.designation}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leave Information Section */}
                  <div className="row px-4 pb-4">
                    <div className="col-12">
                      <div className="card border-0 shadow-sm" style={{
                        borderLeft: "4px solid #0d6efd",
                        backgroundColor: "#f8f9fa"
                      }}>
                        <div className="card-header bg-white d-flex align-items-center py-3">
                          <Calendar className="me-2 text-primary" size={18} />
                          <h6 className="mb-0 fw-semibold text-primary">Leave Information</h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="d-flex flex-column mb-3">
                                <small className="text-muted mb-1">Leave Type</small>
                                <div className="fw-semibold">{modalLeave.leaveType}</div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="d-flex flex-column mb-3">
                                <small className="text-muted mb-1">Applied On</small>
                                <div className="fw-semibold">{modalLeave.appliedOn}</div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="d-flex flex-column mb-3">
                                <small className="text-muted mb-1">Leave Period</small>
                                <div className="fw-semibold">
                                  {modalLeave.fromDate} → {modalLeave.toDate}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="d-flex flex-column mb-3">
                                <small className="text-muted mb-1">Total Days</small>
                                <div className="fw-semibold">{diffDays(modalLeave.fromDate, modalLeave.toDate)} days</div>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-md-6">
                              <div className="d-flex flex-column mb-3">
                                <small className="text-muted mb-1">Reason</small>
                                <div className="fw-semibold">{modalLeave.reason}</div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="d-flex flex-column mb-3">
                                <small className="text-muted mb-1">Status</small>
                                <div>
                                  <span className={`badge ${statusBadge(modalLeave.status)}`}>
                                    {modalLeave.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="d-flex flex-column mb-3">
                                <small className="text-muted mb-1">Children</small>
                                <div className="fw-semibold">{modalLeave.children}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer d-flex justify-content-between align-items-center py-3 px-4 bg-light border-top">
                <div className="text-muted small">
                  Last updated: {modalLeave.appliedOn}
                </div>
                <div className="d-flex gap-2">
                  {modalLeave.status === "Pending" && (
                    <>
                      <button
                        className="btn btn-success px-4 py-2 d-flex align-items-center"
                        onClick={() => updateStatus(modalLeave.id, "Approved")}
                        style={{ borderRadius: "6px" }}
                      >
                        <Check size={18} className="me-2" /> Approve Leave
                      </button>
                      <button
                        className="btn btn-warning px-4 py-2 d-flex align-items-center"
                        onClick={() => updateStatus(modalLeave.id, "Rejected")}
                        style={{ borderRadius: "6px" }}
                      >
                        <X size={18} className="me-2" /> Reject Leave
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={() => setModalLeave(null)}
                    style={{ borderRadius: "6px" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default LeaveReports;