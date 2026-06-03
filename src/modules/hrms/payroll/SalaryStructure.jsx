import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Save,
  Eye,
  FileText,
  Trash2,
  Download,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  Edit2,
  Users,
  User,
  Calendar,
  Percent,
  DollarSign,
  Settings,
  Calculator,
  History,
  Layers,
  BarChart,
  Zap,
  MessageSquare, // Add this
} from "lucide-react";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Icon } from "@iconify/react/dist/iconify.js";

const SalaryStructure = () => {
  const [activeTab, setActiveTab] = useState("components");
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showSimulationPanel, setShowSimulationPanel] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showComponentModal, setShowComponentModal] = useState(false);

  // Add these state variables at the beginning of your component, after the existing state declarations
  const [showViewComponentModal, setShowViewComponentModal] = useState(false);
  // Add these state variables with your other state declarations
  // Add these near your other state declarations (around line 40-80)
  const [newStructureSelection, setNewStructureSelection] = useState("");
  const [newEffectiveDate, setNewEffectiveDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [changeReason, setChangeReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  // Add these state variables with your other state declarations
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignmentViewModal, setShowAssignmentViewModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [actionNotification, setActionNotification] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  // Add these states to your main component
  const [showIndividualAssignModal, setShowIndividualAssignModal] =
    useState(false);
  const [showChangeStructure, setShowChangeStructure] = useState(false);
  const [employeeToChange, setEmployeeToChange] = useState(null);

  const [newAssignment, setNewAssignment] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "",
    grade: "",
    level: "",
    structureId: "",
    ctc: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    assignmentType: "initial",
    location: "",
    employeeType: "regular",
    noticePeriod: 30,
    allocationRules: {
      type: "auto",
      basis: "grade_match",
      proRata: true,
      hasCustomRules: false,
      rules: [],
    },
  });
  // Add this state to your component
  const [componentFilters, setComponentFilters] = useState({
    category: "all",
    type: "all",
    taxable: "all",
    statutory: "all",
    calculation: "all",
    proRata: "all",
    status: "active",
  });

  // State for new structure form
  const [newStructure, setNewStructure] = useState({
    name: "",
    grade: "",
    level: "",
    category: "",
    subCategory: "regular",
    employeeType: "regular",
    ctc: "",
    minCTC: "",
    maxCTC: "",
    incrementRange: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    description: "",
    departments: [],
    locations: [],
    customDepartment: "",
    customLocation: "",
    pfEnabled: true,
    pfEmployee: "12",
    pfEmployer: "12",
    esiEnabled: false,
    esiEmployee: "0.75",
    esiEmployer: "3.25",
    ptEnabled: true,
    ptAmount: "200",
    tdsEnabled: false,
    tdsSlab: "as_per_income",
    selectedComponents: [1, 2, 3, 4, 6, 8, 12, 15], // Default components
  });

  // State for simulation
  // Update your state initialization
  const [simulationData, setSimulationData] = useState({
    baseCTC: 1000000,
    variablePercent: 20,
    pfPercent: 12,
    esiPercent: 0.75,
    taxDeduction: 50000,
  });
  // Enhanced component data structure with ALL required fields
  // Update your component structure to include all fields
  const [components, setComponents] = useState({
    earnings: [
      {
        id: 1,
        name: "Basic Salary",
        type: "fixed",
        taxable: true,
        statutory: false,
        calculation: "percentage_of_ctc",
        value: 40,
        base: "CTC",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Basic salary component - 40% of CTC",
        statutoryReference: "",
        requiresProof: false,
        maxAmount: null,
        minAmount: null,
        taxExemptLimit: null,
        calculationOrder: 1,
        formula: "",
        category: "earnings",
      },
      {
        id: 2,
        name: "House Rent Allowance",
        type: "fixed",
        taxable: true,
        statutory: false,
        calculation: "percentage_of_base",
        value: 50,
        base: "Basic",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "House Rent Allowance - 50% of Basic",
        statutoryReference: "",
        requiresProof: false,
        maxAmount: null,
        minAmount: null,
        taxExemptLimit: null,
        calculationOrder: 2,
        formula: "",
        category: "earnings",
      },
      {
        id: 3,
        name: "Conveyance Allowance",
        type: "fixed",
        taxable: false,
        statutory: false,
        calculation: "flat_amount",
        value: 19200,
        base: "fixed",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Monthly conveyance allowance",
        statutoryReference: "",
        requiresProof: false,
        maxAmount: 19200,
        minAmount: 0,
        taxExemptLimit: 19200,
        calculationOrder: 3,
        formula: "",
        category: "earnings",
      },
      {
        id: 4,
        name: "Special Allowance",
        type: "fixed",
        taxable: true,
        statutory: false,
        calculation: "percentage_of_ctc",
        value: 20,
        base: "CTC",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Special allowance component",
        statutoryReference: "",
        requiresProof: false,
        maxAmount: null,
        minAmount: null,
        taxExemptLimit: null,
        calculationOrder: 4,
        formula: "",
        category: "earnings",
      },
      {
        id: 5,
        name: "Performance Bonus",
        type: "variable",
        taxable: true,
        statutory: false,
        calculation: "percentage_of_ctc",
        value: 10,
        base: "CTC",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Performance linked bonus",
        statutoryReference: "",
        requiresProof: false,
        maxAmount: null,
        minAmount: null,
        taxExemptLimit: null,
        calculationOrder: 5,
        formula: "",
        category: "earnings",
      },
    ],
    deductions: [
      {
        id: 6,
        name: "Provident Fund (PF)",
        type: "fixed",
        taxable: false,
        statutory: true,
        calculation: "percentage_of_base",
        value: 12,
        base: "Basic",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Employee PF contribution",
        statutoryReference: "EPF Act, 1952",
        requiresProof: false,
        maxAmount: 1800,
        minAmount: 0,
        taxExemptLimit: null,
        calculationOrder: 1,
        formula: "",
        category: "deductions",
      },
      {
        id: 7,
        name: "ESI Contribution",
        type: "fixed",
        taxable: false,
        statutory: true,
        calculation: "percentage_of_gross",
        value: 0.75,
        base: "Gross",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Employee State Insurance contribution",
        statutoryReference: "ESI Act, 1948",
        requiresProof: false,
        maxAmount: 2100,
        minAmount: 0,
        taxExemptLimit: null,
        calculationOrder: 2,
        formula: "",
        category: "deductions",
      },
      {
        id: 8,
        name: "Professional Tax",
        type: "fixed",
        taxable: false,
        statutory: true,
        calculation: "flat_amount",
        value: 200,
        base: "fixed",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Professional tax deduction",
        statutoryReference: "State Professional Tax Act",
        requiresProof: false,
        maxAmount: 2500,
        minAmount: 0,
        taxExemptLimit: null,
        calculationOrder: 3,
        formula: "",
        category: "deductions",
      },
      {
        id: 9,
        name: "TDS",
        type: "variable",
        taxable: false,
        statutory: true,
        calculation: "percentage_of_base",
        value: 10,
        base: "Taxable",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Tax Deducted at Source",
        statutoryReference: "Income Tax Act, 1961",
        requiresProof: false,
        maxAmount: null,
        minAmount: null,
        taxExemptLimit: null,
        calculationOrder: 4,
        formula: "",
        category: "deductions",
      },
      {
        id: 10,
        name: "Loan EMI",
        type: "fixed",
        taxable: false,
        statutory: false,
        calculation: "flat_amount",
        value: 5000,
        base: "fixed",
        proRata: false,
        rounding: "nearest_integer",
        isActive: true,
        description: "Loan EMI deduction",
        statutoryReference: "",
        requiresProof: false,
        maxAmount: null,
        minAmount: null,
        taxExemptLimit: null,
        calculationOrder: 5,
        formula: "",
        category: "deductions",
      },
      {
        id: 11,
        name: "Advance Salary",
        type: "variable",
        taxable: false,
        statutory: false,
        calculation: "flat_amount",
        value: 0,
        base: "fixed",
        proRata: false,
        rounding: "nearest_integer",
        isActive: true,
        description: "Salary advance recovery",
        statutoryReference: "",
        requiresProof: false,
        maxAmount: null,
        minAmount: null,
        taxExemptLimit: null,
        calculationOrder: 6,
        formula: "",
        category: "deductions",
      },
    ],
    employerContributions: [
      {
        id: 12,
        name: "Employer PF",
        type: "fixed",
        taxable: false,
        statutory: true,
        calculation: "percentage_of_base",
        value: 12,
        base: "Basic",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Employer PF contribution",
        statutoryReference: "EPF Act, 1952",
        requiresProof: false,
        maxAmount: 1800,
        minAmount: 0,
        taxExemptLimit: null,
        calculationOrder: 1,
        formula: "",
        category: "employer_contributions",
      },
      {
        id: 13,
        name: "Employer ESI",
        type: "fixed",
        taxable: false,
        statutory: true,
        calculation: "percentage_of_gross",
        value: 3.25,
        base: "Gross",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Employer ESI contribution",
        statutoryReference: "ESI Act, 1948",
        requiresProof: false,
        maxAmount: 9000,
        minAmount: 0,
        taxExemptLimit: null,
        calculationOrder: 2,
        formula: "",
        category: "employer_contributions",
      },
    ],
    reimbursements: [
      {
        id: 14,
        name: "Medical Reimbursement",
        type: "fixed",
        taxable: false,
        statutory: false,
        calculation: "flat_amount",
        value: 15000,
        base: "fixed",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Annual medical reimbursement",
        statutoryReference: "",
        requiresProof: true,
        maxAmount: 15000,
        minAmount: 0,
        taxExemptLimit: 15000,
        calculationOrder: 1,
        formula: "",
        category: "reimbursements",
      },
      {
        id: 15,
        name: "LTA",
        type: "fixed",
        taxable: false,
        statutory: false,
        calculation: "percentage_of_base",
        value: 8,
        base: "Basic",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Leave Travel Allowance",
        statutoryReference: "",
        requiresProof: true,
        maxAmount: null,
        minAmount: null,
        taxExemptLimit: null,
        calculationOrder: 2,
        formula: "",
        category: "reimbursements",
      },
      {
        id: 16,
        name: "Telephone Allowance",
        type: "fixed",
        taxable: true,
        statutory: false,
        calculation: "flat_amount",
        value: 1000,
        base: "fixed",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Monthly telephone allowance",
        statutoryReference: "",
        requiresProof: true,
        maxAmount: 1000,
        minAmount: 0,
        taxExemptLimit: null,
        calculationOrder: 3,
        formula: "",
        category: "reimbursements",
      },
      {
        id: 17,
        name: "Fuel Allowance",
        type: "fixed",
        taxable: true,
        statutory: false,
        calculation: "percentage_of_base",
        value: 5,
        base: "Basic",
        proRata: true,
        rounding: "nearest_integer",
        isActive: true,
        description: "Monthly fuel allowance",
        statutoryReference: "",
        requiresProof: true,
        maxAmount: null,
        minAmount: null,
        taxExemptLimit: null,
        calculationOrder: 4,
        formula: "",
        category: "reimbursements",
      },
    ],
  });

  // Mock data for salary structures
  const [structures, setStructures] = useState([
    {
      id: 1,
      name: "Grade B - Senior",
      version: "v1.5",
      parentVersion: "v1.4",
      grade: "B",
      level: "L5",
      category: "permanent",
      subCategory: "individual_contributor",
      employeeType: "regular",
      department: ["Engineering", "Design", "Marketing"],
      location: ["Bengaluru", "Pune", "Mumbai"],
      ctc: 1500000,
      effectiveDate: "2024-01-01",
      expiryDate: null,
      status: "active",
      approvalStatus: "approved",
      employeeCount: 120,
      createdAt: "2023-12-10",
      createdBy: "HR Manager",
      lastModified: "2024-05-20",
      lastModifiedBy: "HR Executive",
      changeReason: "Conveyance allowance update",

      componentGroups: {
        earnings: [1, 2, 3, 4],
        deductions: [6, 8, 9],
        employerContributions: [12, 13],
        reimbursements: [15, 17],
      },

      standardDeductions: {
        pf: { enabled: true, employee: 12, employer: 12 },
        esi: { enabled: false },
        professionalTax: { enabled: true, amount: 200 },
        tds: { enabled: true, slab: "as_per_income" },
      },

      minCTC: 1200000,
      maxCTC: 1800000,
      incrementRange: "8-12%",

      versionHistory: [
        {
          version: "v1.0",
          date: "2023-12-10",
          changes: "Initial structure",
          changedBy: "HR Manager",
        },
        {
          version: "v1.5",
          date: "2024-05-20",
          changes: "Updated conveyance allowance",
          changedBy: "HR Executive",
        },
      ],
    },
    {
      id: 2,
      name: "Grade C - Junior",
      version: "v1.2",
      parentVersion: "v1.1",
      grade: "C",
      level: "L4",
      category: "permanent",
      subCategory: "entry_level",
      employeeType: "regular",
      department: ["Engineering", "Operations", "Support"],
      location: ["Bengaluru", "Chennai", "Delhi"],
      ctc: 800000,
      effectiveDate: "2024-01-01",
      expiryDate: null,
      status: "active",
      approvalStatus: "approved",
      employeeCount: 250,
      createdAt: "2023-12-05",
      createdBy: "HR Executive",
      lastModified: "2024-04-10",
      lastModifiedBy: "HR Executive",
      changeReason: "Basic salary adjustment",

      componentGroups: {
        earnings: [1, 2, 3, 4],
        deductions: [6, 8],
        employerContributions: [12],
        reimbursements: [15],
      },

      standardDeductions: {
        pf: { enabled: true, employee: 12, employer: 12 },
        esi: { enabled: true, employee: 0.75, employer: 3.25 },
        professionalTax: { enabled: true, amount: 200 },
        tds: { enabled: false },
      },

      minCTC: 600000,
      maxCTC: 1000000,
      incrementRange: "5-8%",

      versionHistory: [
        {
          version: "v1.0",
          date: "2023-12-05",
          changes: "Initial structure",
          changedBy: "HR Executive",
        },
        {
          version: "v1.2",
          date: "2024-04-10",
          changes: "Basic salary adjustment",
          changedBy: "HR Executive",
        },
      ],
    },
    {
      id: 3,
      name: "Contract - Technical",
      version: "v1.0",
      parentVersion: null,
      grade: "CT",
      level: "L5",
      category: "contract",
      subCategory: "technical",
      employeeType: "contractor",
      department: ["Engineering", "IT"],
      location: ["Bengaluru", "Remote"],
      ctc: 1800000,
      effectiveDate: "2024-04-01",
      expiryDate: "2025-03-31",
      status: "active",
      approvalStatus: "approved",
      employeeCount: 35,
      createdAt: "2024-03-15",
      createdBy: "HR Manager",
      lastModified: "2024-03-15",
      lastModifiedBy: "HR Manager",
      changeReason: "New structure for contractors",

      componentGroups: {
        earnings: [1, 2, 3, 4],
        deductions: [8, 9],
        employerContributions: [],
        reimbursements: [],
      },

      standardDeductions: {
        pf: { enabled: false },
        esi: { enabled: false },
        professionalTax: { enabled: true, amount: 200 },
        tds: { enabled: true, slab: "contractor_10%" },
      },

      minCTC: 1500000,
      maxCTC: 2200000,
      incrementRange: "NA",

      versionHistory: [
        {
          version: "v1.0",
          date: "2024-03-15",
          changes: "Initial structure for contractors",
          changedBy: "HR Manager",
        },
      ],
    },
    {
      id: 4,
      name: "Intern - Tech",
      version: "v1.0",
      parentVersion: null,
      grade: "IN",
      level: "L1",
      category: "intern",
      subCategory: "tech_intern",
      employeeType: "intern",
      department: ["Engineering", "Data Science"],
      location: ["Bengaluru"],
      ctc: 300000,
      effectiveDate: "2024-06-01",
      expiryDate: "2024-11-30",
      status: "active",
      approvalStatus: "approved",
      employeeCount: 50,
      createdAt: "2024-05-20",
      createdBy: "HR Executive",
      lastModified: "2024-05-20",
      lastModifiedBy: "HR Executive",
      changeReason: "New intern structure",

      componentGroups: {
        earnings: [1, 3],
        deductions: [8],
        employerContributions: [],
        reimbursements: [],
      },

      standardDeductions: {
        pf: { enabled: false },
        esi: { enabled: false },
        professionalTax: { enabled: false },
        tds: { enabled: false },
      },

      minCTC: 200000,
      maxCTC: 400000,
      incrementRange: "NA",

      versionHistory: [
        {
          version: "v1.0",
          date: "2024-05-20",
          changes: "Initial intern structure",
          changedBy: "HR Executive",
        },
      ],
    },
    {
      id: 5,
      name: "Grade D - Operations",
      version: "v1.1",
      parentVersion: "v1.0",
      grade: "D",
      level: "L3",
      category: "permanent",
      subCategory: "operations",
      employeeType: "regular",
      department: ["Operations", "Logistics", "Admin"],
      location: ["Mumbai", "Delhi", "Kolkata"],
      ctc: 500000,
      effectiveDate: "2024-01-01",
      expiryDate: null,
      status: "draft",
      approvalStatus: "pending",
      employeeCount: 0,
      createdAt: "2024-06-01",
      createdBy: "HR Admin",
      lastModified: "2024-06-10",
      lastModifiedBy: "HR Admin",
      changeReason: "New structure creation",

      componentGroups: {
        earnings: [1, 2, 3],
        deductions: [6, 8],
        employerContributions: [12],
        reimbursements: [],
      },

      standardDeductions: {
        pf: { enabled: true, employee: 12, employer: 12 },
        esi: { enabled: true, employee: 0.75, employer: 3.25 },
        professionalTax: { enabled: true, amount: 200 },
        tds: { enabled: false },
      },

      minCTC: 400000,
      maxCTC: 600000,
      incrementRange: "3-5%",

      versionHistory: [
        {
          version: "v1.0",
          date: "2024-06-01",
          changes: "Initial draft",
          changedBy: "HR Admin",
        },
        {
          version: "v1.1",
          date: "2024-06-10",
          changes: "Updated components",
          changedBy: "HR Admin",
        },
      ],
    },
  ]);

  // State for structure filters
  const [structureFilters, setStructureFilters] = useState({
    status: "all",
    category: "all",
    grade: "all",
    department: "all",
    location: "all",
  });
  // Mock data for assignments
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      employeeId: "EMP001",
      name: "Nagendra Uggirala",
      email: "nagendra.uggirala@example.com",
      department: "Engineering",
      grade: "A",
      level: "L6",
      currentStructure: "Grade A - Management",
      ctc: 2500000,
      takeHome: 145000,
      grossSalary: 208333,
      effectiveDate: "2024-01-01",
      assignmentType: "revision",

      // New fields added
      allocationRules: {
        type: "auto", // auto, manual, bulk
        basis: "grade_match", // grade_match, department_basis, custom
        proRata: true,
        effectiveFrom: "2024-01-01",
        hasCustomRules: true,
        rules: [
          "Auto-assigned based on Grade A",
          "Management allowance applied",
          "Location: Bengaluru premium",
          "Performance bonus: 15% of CTC",
          "Additional leadership allowance",
        ],
      },
      createdOn: "2023-12-15",
      createdBy: "HR Admin",
      lastModified: "2024-06-15",
      lastModifiedBy: "HR Manager",
      assignmentStatus: "active",
      previousStructure: "Grade A - Senior",
      previousCTC: 2000000,
      changeReason: "Annual salary revision",
      approvalStatus: "approved",
      approvalDate: "2023-12-20",
      approver: "Finance Head",
      comments: "Approved as per budget",
      location: "Bengaluru",
      employeeType: "permanent",
      contractEndDate: null,
      noticePeriod: 90,
      // Salary components breakdown
      salaryBreakdown: {
        basic: 1000000,
        hra: 500000,
        conveyance: 19200,
        specialAllowance: 300000,
        performanceBonus: 375000,
        otherAllowances: 300800,
      },
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Ravi Kumar",
      email: "ravi.kumar@example.com",
      department: "Engineering",
      grade: "B",
      level: "L5",
      currentStructure: "Grade B - Senior",
      ctc: 1500000,
      takeHome: 87500,
      grossSalary: 125000,
      effectiveDate: "2024-01-01",
      assignmentType: "initial",

      allocationRules: {
        type: "bulk",
        basis: "department_basis",
        proRata: false,
        effectiveFrom: "2024-01-01",
        hasCustomRules: false,
        rules: [
          "Bulk assigned with Engineering team",
          "Standard Grade B structure",
          "No location premium",
          "Standard benefits package",
          "Tech stack specialization bonus",
        ],
      },
      createdOn: "2023-12-10",
      createdBy: "HR Executive",
      lastModified: "2024-05-20",
      lastModifiedBy: "HR Executive",
      assignmentStatus: "active",
      previousStructure: null,
      previousCTC: null,
      changeReason: "New hire",
      approvalStatus: "approved",
      approvalDate: "2023-12-08",
      approver: "HR Manager",
      comments: "New engineering hire",
      location: "Hyderabad",
      employeeType: "permanent",
      contractEndDate: null,
      noticePeriod: 60,
      salaryBreakdown: {
        basic: 600000,
        hra: 300000,
        conveyance: 19200,
        specialAllowance: 180000,
        performanceBonus: 150000,
        otherAllowances: 250800,
      },
    },
    {
      id: 3,
      employeeId: "EMP003",
      name: "Sita Rani",
      email: "sita.rani@example.com",
      department: "Design",
      grade: "B",
      level: "L5",
      currentStructure: "Grade B - Senior",
      ctc: 1500000,
      takeHome: 87500,
      grossSalary: 125000,
      effectiveDate: "2024-01-01",
      assignmentType: "promotion",

      allocationRules: {
        type: "manual",
        basis: "custom",
        proRata: true,
        effectiveFrom: "2024-01-01",
        hasCustomRules: true,
        rules: [
          "Manually assigned by HR Manager",
          "Design role specific allowances",
          "Creative team premium",
          "Senior designer bonus structure",
          "UI/UX specialization allowance",
        ],
      },
      createdOn: "2023-12-05",
      createdBy: "HR Manager",
      lastModified: "2024-04-10",
      lastModifiedBy: "HR Manager",
      assignmentStatus: "active",
      previousStructure: "Grade C - Junior",
      previousCTC: 800000,
      changeReason: "Promotion to Senior Designer",
      approvalStatus: "approved",
      approvalDate: "2023-12-01",
      approver: "Design Head",
      comments: "Promoted based on performance",
      location: "Bengaluru",
      employeeType: "permanent",
      contractEndDate: null,
      noticePeriod: 60,
      salaryBreakdown: {
        basic: 600000,
        hra: 300000,
        conveyance: 19200,
        specialAllowance: 180000,
        performanceBonus: 150000,
        otherAllowances: 250800,
      },
    },
    {
      id: 4,
      employeeId: "EMP004",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      department: "Engineering",
      grade: "C",
      level: "L4",
      currentStructure: "Grade C - Junior",
      ctc: 800000,
      takeHome: 46800,
      grossSalary: 66666,
      effectiveDate: "2024-01-01",
      assignmentType: "transfer",

      allocationRules: {
        type: "auto",
        basis: "grade_match",
        proRata: true,
        effectiveFrom: "2024-01-01",
        hasCustomRules: true,
        rules: [
          "Auto-assigned based on Grade C",
          "Entry-level engineering structure",
          "Learning allowance included",
          "Probation benefits applicable",
        ],
      },
      createdOn: "2023-12-01",
      createdBy: "HR Executive",
      lastModified: "2024-03-15",
      lastModifiedBy: "HR Executive",
      assignmentStatus: "active",
      previousStructure: "Intern - Tech",
      previousCTC: 300000,
      changeReason: "Intern to full-time conversion",
      approvalStatus: "approved",
      approvalDate: "2023-11-28",
      approver: "Engineering Manager",
      comments: "Converted from internship",
      location: "Pune",
      employeeType: "permanent",
      contractEndDate: null,
      noticePeriod: 30,
      salaryBreakdown: {
        basic: 320000,
        hra: 160000,
        conveyance: 19200,
        specialAllowance: 96000,
        performanceBonus: 80000,
        otherAllowances: 124800,
      },
    },
    {
      id: 5,
      employeeId: "EMP005",
      name: "Amit Patel",
      email: "amit.patel@example.com",
      department: "Sales",
      grade: "A",
      level: "L6",
      currentStructure: "Grade A - Management",
      ctc: 2500000,
      takeHome: 145000,
      grossSalary: 208333,
      effectiveDate: "2024-01-01",
      assignmentType: "revision",

      allocationRules: {
        type: "manual",
        basis: "custom",
        proRata: false,
        effectiveFrom: "2024-01-01",
        hasCustomRules: true,
        rules: [
          "Custom sales leadership package",
          "Commission structure overrides",
          "Sales target based incentives",
          "Quarterly performance bonuses",
          "Travel and client entertainment allowance",
        ],
      },
      createdOn: "2023-11-30",
      createdBy: "HR Manager",
      lastModified: "2024-06-01",
      lastModifiedBy: "Sales Head",
      assignmentStatus: "active",
      previousStructure: "Grade A - Sales Lead",
      previousCTC: 2200000,
      changeReason: "Sales team restructuring",
      approvalStatus: "approved",
      approvalDate: "2023-11-25",
      approver: "CEO",
      comments: "Sales leadership role approved",
      location: "Mumbai",
      employeeType: "permanent",
      contractEndDate: null,
      noticePeriod: 90,
      salaryBreakdown: {
        basic: 1000000,
        hra: 500000,
        conveyance: 19200,
        specialAllowance: 300000,
        performanceBonus: 375000,
        salesCommission: 300800,
        otherAllowances: 0,
      },
    },
    {
      id: 6,
      employeeId: "EMP006",
      name: "Rahul Verma",
      email: "rahul.verma@example.com",
      department: "Marketing",
      grade: "B",
      level: "L5",
      currentStructure: "Grade B - Senior",
      ctc: 1500000,
      takeHome: 87500,
      grossSalary: 125000,
      effectiveDate: "2024-04-01",
      assignmentType: "contract_renewal",

      allocationRules: {
        type: "auto",
        basis: "grade_match",
        proRata: true,
        effectiveFrom: "2024-04-01",
        hasCustomRules: false,
        rules: [
          "Standard contract renewal structure",
          "Marketing team alignment",
          "Digital marketing specialization",
          "Campaign performance bonuses",
        ],
      },
      createdOn: "2024-03-20",
      createdBy: "HR Executive",
      lastModified: "2024-03-25",
      lastModifiedBy: "HR Executive",
      assignmentStatus: "pending",
      previousStructure: "Grade B - Marketing",
      previousCTC: 1400000,
      changeReason: "Annual contract renewal with increment",
      approvalStatus: "pending",
      approvalDate: null,
      approver: null,
      comments: "Awaiting budget approval",
      location: "Delhi",
      employeeType: "contract",
      contractEndDate: "2025-03-31",
      noticePeriod: 30,
      salaryBreakdown: {
        basic: 600000,
        hra: 300000,
        conveyance: 19200,
        specialAllowance: 180000,
        performanceBonus: 150000,
        otherAllowances: 250800,
      },
    },
    {
      id: 7,
      employeeId: "EMP007",
      name: "Anjali Singh",
      email: "anjali.singh@example.com",
      department: "Product",
      grade: "A",
      level: "L6",
      currentStructure: "Grade A - Management",
      ctc: 2500000,
      takeHome: 145000,
      grossSalary: 208333,
      effectiveDate: "2024-02-01",
      assignmentType: "lateral",

      allocationRules: {
        type: "manual",
        basis: "custom",
        proRata: true,
        effectiveFrom: "2024-02-01",
        hasCustomRules: true,
        rules: [
          "Lateral hire from competitor",
          "Product leadership package",
          "Stock options included",
          "Relocation benefits",
          "Signing bonus",
        ],
      },
      createdOn: "2024-01-15",
      createdBy: "HR Director",
      lastModified: "2024-01-30",
      lastModifiedBy: "Product Head",
      assignmentStatus: "active",
      previousStructure: null,
      previousCTC: 2800000,
      changeReason: "Lateral hire - Product VP",
      approvalStatus: "approved",
      approvalDate: "2024-01-25",
      approver: "CEO",
      comments: "Executive hiring approval",
      location: "Bengaluru",
      employeeType: "permanent",
      contractEndDate: null,
      noticePeriod: 90,
      salaryBreakdown: {
        basic: 1000000,
        hra: 500000,
        conveyance: 19200,
        specialAllowance: 300000,
        performanceBonus: 375000,
        stockOptions: 300800,
        otherAllowances: 0,
      },
    },
    {
      id: 8,
      employeeId: "EMP008",
      name: "Vikram Reddy",
      email: "vikram.reddy@example.com",
      department: "Operations",
      grade: "C",
      level: "L4",
      currentStructure: "Grade C - Junior",
      ctc: 800000,
      takeHome: 46800,
      grossSalary: 66666,
      effectiveDate: "2024-03-01",
      assignmentType: "correction",

      allocationRules: {
        type: "manual",
        basis: "custom",
        proRata: true,
        effectiveFrom: "2024-03-01",
        hasCustomRules: false,
        rules: [
          "Salary correction - previous error",
          "Backdated to March 2024",
          "Standard operations role",
          "Shift allowances included",
        ],
      },
      createdOn: "2024-02-25",
      createdBy: "HR Admin",
      lastModified: "2024-02-28",
      lastModifiedBy: "HR Admin",
      assignmentStatus: "active",
      previousStructure: "Grade C - Operations",
      previousCTC: 750000,
      changeReason: "Salary correction - underpaid",
      approvalStatus: "approved",
      approvalDate: "2024-02-26",
      approver: "Operations Manager",
      comments: "Corrected per audit finding",
      location: "Chennai",
      employeeType: "permanent",
      contractEndDate: null,
      noticePeriod: 30,
      salaryBreakdown: {
        basic: 320000,
        hra: 160000,
        conveyance: 19200,
        specialAllowance: 96000,
        performanceBonus: 80000,
        shiftAllowance: 124800,
      },
    },
  ]);

  // Mock data for versions
  // State for versions
  const [versions, setVersions] = useState([
    {
      id: 1,
      structureId: 1,
      version: "v1.0",
      changes: "Initial structure creation",
      date: "2023-12-15",
      changedBy: "HR Admin",
      approvalStatus: "approved",
    },
    {
      id: 2,
      structureId: 1,
      version: "v2.0",
      changes: "Updated PF percentage from 10% to 12%",
      date: "2024-03-01",
      changedBy: "HR Manager",
      approvalStatus: "approved",
    },
    {
      id: 3,
      structureId: 1,
      version: "v2.1",
      changes: "Added performance bonus component",
      date: "2024-06-15",
      changedBy: "HR Admin",
      approvalStatus: "draft",
    },
    {
      id: 4,
      structureId: 2,
      version: "v1.0",
      changes: "Initial structure",
      date: "2023-12-10",
      changedBy: "HR Manager",
      approvalStatus: "approved",
    },
    {
      id: 5,
      structureId: 2,
      version: "v1.5",
      changes: "Updated conveyance allowance",
      date: "2024-05-20",
      changedBy: "HR Executive",
      approvalStatus: "approved",
    },
    {
      id: 6,
      structureId: 3,
      version: "v1.0",
      changes: "Initial structure",
      date: "2023-12-05",
      changedBy: "HR Executive",
      approvalStatus: "approved",
    },
    {
      id: 7,
      structureId: 3,
      version: "v1.2",
      changes: "Basic salary adjustment",
      date: "2024-04-10",
      changedBy: "HR Executive",
      approvalStatus: "approved",
    },
  ]);
  // Add this with your other state declarations (around line 150-200)
  const [componentFormData, setComponentFormData] = useState({
    name: "",
    category: "",
    type: "",
    calculation: "",
    base: "",
    value: "",
    taxable: false,
    statutory: false,
    proRata: true,
    description: "",
    rounding: "nearest_integer",
    requiresProof: false,
    taxExemptLimit: "",
    maxAmount: "",
    minAmount: "",
    calculationOrder: 1,
    formula: "",
    statutoryReference: "",
  });

  // Add this useEffect to update form when selectedComponent changes
  useEffect(() => {
    if (selectedComponent) {
      setComponentFormData({
        name: selectedComponent.name || "",
        category: selectedComponent.category || "",
        type: selectedComponent.type || "",
        calculation: selectedComponent.calculation || "",
        base: selectedComponent.base || "",
        value: selectedComponent.value || "",
        taxable: selectedComponent.taxable || false,
        statutory: selectedComponent.statutory || false,
        proRata:
          selectedComponent.proRata !== undefined
            ? selectedComponent.proRata
            : true,
        description: selectedComponent.description || "",
        rounding: selectedComponent.rounding || "nearest_integer",
        requiresProof: selectedComponent.requiresProof || false,
        taxExemptLimit: selectedComponent.taxExemptLimit || "",
        maxAmount: selectedComponent.maxAmount || "",
        minAmount: selectedComponent.minAmount || "",
        calculationOrder: selectedComponent.calculationOrder || 1,
        formula: selectedComponent.formula || "",
        statutoryReference: selectedComponent.statutoryReference || "",
      });
    } else {
      // Reset form for new component
      setComponentFormData({
        name: "",
        category: "",
        type: "",
        calculation: "",
        base: "",
        value: "",
        taxable: false,
        statutory: false,
        proRata: true,
        description: "",
        rounding: "nearest_integer",
        requiresProof: false,
        taxExemptLimit: "",
        maxAmount: "",
        minAmount: "",
        calculationOrder: 1,
        formula: "",
        statutoryReference: "",
      });
    }
  }, [selectedComponent, showComponentModal]);

  const getComponentTypeBadge = (type) => {
    const styles = {
      fixed: "bg-info-subtle text-info border-info-subtle",
      variable: "bg-warning-subtle text-warning border-warning-subtle",
      statutory: "bg-danger-subtle text-danger border-danger-subtle",
      non_statutory: "bg-success-subtle text-success border-success-subtle",
    };
    return (
      <span
        className={`badge border small ${
          styles[type] || "bg-secondary-subtle"
        }`}
      >
        {type
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </span>
    );
  };

  const getTaxableBadge = (taxable) => (
    <span
      className={`badge border small ${
        taxable
          ? "bg-danger-subtle text-danger border-danger-subtle"
          : "bg-success-subtle text-success border-success-subtle"
      }`}
    >
      {taxable ? "Taxable" : "Non-Taxable"}
    </span>
  );

  const getStatutoryBadge = (statutory) => (
    <span
      className={`badge border small ${
        statutory
          ? "bg-primary-subtle text-primary border-primary-subtle"
          : "bg-secondary-subtle text-secondary border-secondary-subtle"
      }`}
    >
      {statutory ? "Statutory" : "Non-Statutory"}
    </span>
  );

  // Helper function to get calculation method label
  const getCalculationLabel = (calculation) => {
    const labels = {
      flat_amount: "Flat Amount",
      percentage_of_base: "% of Base",
      percentage_of_gross: "% of Gross",
      percentage_of_ctc: "% of CTC",
      custom_formula: "Custom Formula",
    };
    return labels[calculation] || calculation;
  };

  // Add these functions to your component

  // 4. Export to PDF function
  const handleExportPDF = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();

      // Title
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("Salary Components Report", 14, 20);

      // Subtitle
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Summary statistics
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("Summary Statistics", 14, 45);

      const totalComponents = Object.values(components).flat().length;
      const activeComponents = Object.values(components)
        .flat()
        .filter((c) => c.isActive).length;
      const taxableComponents = Object.values(components)
        .flat()
        .filter((c) => c.taxable).length;
      const statutoryComponents = Object.values(components)
        .flat()
        .filter((c) => c.statutory).length;

      doc.setFontSize(10);
      doc.text(`Total Components: ${totalComponents}`, 14, 55);
      doc.text(`Active Components: ${activeComponents}`, 14, 62);
      doc.text(`Taxable Components: ${taxableComponents}`, 14, 69);
      doc.text(`Statutory Components: ${statutoryComponents}`, 14, 76);

      let yPosition = 85;

      // Export each category separately
      const categories = [
        "earnings",
        "deductions",
        "employer_contributions",
        "reimbursements",
      ];

      categories.forEach((category) => {
        const categoryComponents = components[category];
        if (!categoryComponents || categoryComponents.length === 0) return;

        // Add page break if needed
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Category header
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text(
          `${category.toUpperCase().replace("_", " ")} (${
            categoryComponents.length
          })`,
          14,
          yPosition,
        );
        yPosition += 8;

        // Prepare table data
        const tableData = categoryComponents.map((comp) => [
          comp.name,
          comp.type,
          comp.taxable ? "Yes" : "No",
          comp.statutory ? "Yes" : "No",
          getCalculationLabel(comp.calculation),
          comp.value
            ? comp.calculation === "flat_amount"
              ? `₹${comp.value.toLocaleString()}`
              : `${comp.value}%`
            : "-",
          comp.base || "-",
          comp.proRata ? "Yes" : "No",
          comp.isActive ? "Active" : "Inactive",
        ]);

        // Use autoTable function correctly
        autoTable(doc, {
          startY: yPosition,
          head: [
            [
              "Name",
              "Type",
              "Taxable",
              "Statutory",
              "Calculation",
              "Value",
              "Base",
              "Pro-rata",
              "Status",
            ],
          ],
          body: tableData,
          theme: "striped",
          headStyles: { fillColor: [66, 139, 202], textColor: 255 },
          columnStyles: {
            0: { cellWidth: 30 }, // Name
            1: { cellWidth: 15 }, // Type
            2: { cellWidth: 15 }, // Taxable
            3: { cellWidth: 15 }, // Statutory
            4: { cellWidth: 20 }, // Calculation
            5: { cellWidth: 20 }, // Value
            6: { cellWidth: 15 }, // Base
            7: { cellWidth: 15 }, // Pro-rata
            8: { cellWidth: 15 }, // Status
          },
          styles: { fontSize: 8, cellPadding: 2 },
          margin: { left: 14, right: 14 },
        });

        yPosition = doc.lastAutoTable?.finalY + 10 || yPosition + 100;
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 200, 290, { align: "right" });
        doc.text("Confidential - Internal Use Only", 14, 290);
      }

      // Save the PDF
      const fileName = `salary-components-report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      // Show success notification
      setActionNotification({
        show: true,
        type: "success",
        title: "Export Successful",
        message: `Components exported to ${fileName}`,
      });
    } catch (error) {
      console.error("PDF Export Error:", error);

      // Show error notification
      setActionNotification({
        show: true,
        type: "error",
        title: "Export Failed",
        message: "Failed to generate PDF. Please try again.",
      });
    }
  };

  // 5. CSV Export function (keep as backup)
  const handleExportCSV = () => {
    const csvContent = [
      [
        "Component Name",
        "Category",
        "Type",
        "Taxable",
        "Statutory",
        "Calculation",
        "Value",
        "Base",
        "Pro-rata",
        "Rounding",
        "Status",
      ],
      ...Object.values(components)
        .flat()
        .map((comp) => [
          comp.name,
          comp.category,
          comp.type,
          comp.taxable ? "Yes" : "No",
          comp.statutory ? "Yes" : "No",
          comp.calculation,
          comp.value,
          comp.base,
          comp.proRata ? "Yes" : "No",
          comp.rounding,
          comp.isActive ? "Active" : "Inactive",
        ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `salary-components-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show notification
    setActionNotification({
      show: true,
      type: "success",
      title: "CSV Export Successful",
      message: "Components exported to CSV successfully.",
    });
  };

  // Handle View Component Details
  // Add this function to your component
  const handleViewComponent = (component) => {
    setSelectedComponent(component);
    setShowViewComponentModal(true);
  };

  // Handle Delete Component
  const handleDeleteComponent = (component) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${component.name}"?\nThis action cannot be undone.`,
      )
    ) {
      // Find which category the component belongs to
      let categoryToUpdate = null;

      if (components.earnings.some((c) => c.id === component.id)) {
        categoryToUpdate = "earnings";
      } else if (components.deductions.some((c) => c.id === component.id)) {
        categoryToUpdate = "deductions";
      } else if (
        components.employerContributions.some((c) => c.id === component.id)
      ) {
        categoryToUpdate = "employerContributions";
      } else if (components.reimbursements.some((c) => c.id === component.id)) {
        categoryToUpdate = "reimbursements";
      }

      if (categoryToUpdate) {
        setComponents((prev) => ({
          ...prev,
          [categoryToUpdate]: prev[categoryToUpdate].filter(
            (c) => c.id !== component.id,
          ),
        }));

        // Show success notification
        setActionNotification({
          show: true,
          type: "success",
          title: "Component Deleted",
          message: `"${component.name}" has been deleted successfully.`,
        });
      }
    }
  };

  const handleExportStructuresPDF = () => {
    try {
      const doc = new jsPDF("landscape");

      // Title
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("SALARY STRUCTURE TEMPLATES REPORT", 14, 20);

      // Subtitle
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total Structures: ${structures.length}`, 14, 35);

      // Table data
      const tableData = structures.map((s) => [
        s.name,
        s.grade,
        s.level || "N/A",
        s.category || "N/A",
        `${(s.ctc || 0).toLocaleString()}`,
        s.status,
        s.employeeCount || 0,
        s.effectiveDate || "N/A",
        s.createdBy || "N/A",
        s.version || "v1.0",
      ]);

      autoTable(doc, {
        startY: 65,
        head: [
          [
            "Name",
            "Grade",
            "Level",
            "Category",
            "CTC",
            "Status",
            "Employees",
            "Effective Date",
            "Created By",
            "Version",
          ],
        ],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [13, 110, 253], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 35 },
          4: { cellWidth: 25 },
          9: { cellWidth: 20 },
        },
      });

      // Save PDF
      const fileName = `salary-structures-${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);

      setActionNotification({
        show: true,
        type: "success",
        title: "PDF Export Successful",
        message: `Structures exported to ${fileName}`,
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      setActionNotification({
        show: true,
        type: "error",
        title: "Export Failed",
        message: "Failed to generate PDF",
      });
    }
  };
  // Export single component to PDF
  const handleExportSinglePDF = (component) => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("SALARY COMPONENT DETAILS", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Component ID: ${component.id}`, 14, 35);

      // Main Content
      let yPosition = 45;

      // Basic Information Section
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("BASIC INFORMATION", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(`Name: ${component.name}`, 14, yPosition);
      yPosition += 7;
      doc.text(
        `Category: ${component.category.toUpperCase().replace("_", " ")}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Type: ${
          component.type.charAt(0).toUpperCase() + component.type.slice(1)
        }`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Status: ${component.isActive ? "Active" : "Inactive"}`,
        14,
        yPosition,
      );
      yPosition += 10;

      // Calculation Details
      doc.setFontSize(12);
      doc.text("CALCULATION DETAILS", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(
        `Calculation Method: ${getCalculationLabel(component.calculation)}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(`Value: ${formatValue(component)}`, 14, yPosition);
      yPosition += 7;
      doc.text(`Base: ${formatBase(component)}`, 14, yPosition);
      yPosition += 7;
      doc.text(`Pro-rata: ${component.proRata ? "Yes" : "No"}`, 14, yPosition);
      yPosition += 7;
      doc.text(
        `Rounding: ${
          component.rounding ? getRoundingLabel(component.rounding) : "N/A"
        }`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Calculation Order: ${component.calculationOrder || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 10;

      // Tax & Compliance
      doc.setFontSize(12);
      doc.text("TAX & COMPLIANCE", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(`Taxable: ${component.taxable ? "Yes" : "No"}`, 14, yPosition);
      yPosition += 7;
      doc.text(
        `Statutory: ${component.statutory ? "Yes" : "No"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Statutory Reference: ${component.statutoryReference || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Requires Proof: ${component.requiresProof ? "Yes" : "No"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Tax Exempt Limit: ${
          component.taxExemptLimit ? `₹${component.taxExemptLimit}` : "N/A"
        }`,
        14,
        yPosition,
      );
      yPosition += 10;

      // Limits
      doc.setFontSize(12);
      doc.text("AMOUNT LIMITS", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(
        `Minimum Amount: ${
          component.minAmount ? `₹${component.minAmount}` : "N/A"
        }`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Maximum Amount: ${
          component.maxAmount ? `₹${component.maxAmount}` : "N/A"
        }`,
        14,
        yPosition,
      );
      yPosition += 10;

      // Description
      if (component.description) {
        doc.setFontSize(12);
        doc.text("DESCRIPTION", 14, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        const splitDescription = doc.splitTextToSize(
          component.description,
          180,
        );
        doc.text(splitDescription, 14, yPosition);
        yPosition += splitDescription.length * 7;
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Confidential - Component Details Report", 14, 280);
      doc.text(`Page 1 of 1`, 200, 280, { align: "right" });

      // Save PDF
      const fileName = `${component.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-details.pdf`;
      doc.save(fileName);

      // Show notification
      setActionNotification({
        show: true,
        type: "success",
        title: "PDF Downloaded",
        message: `${component.name} details exported to PDF`,
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      setActionNotification({
        show: true,
        type: "error",
        title: "Export Failed",
        message: "Failed to generate PDF. Please try again.",
      });
    }
  };

  // Export category to PDF
  const handleExportCategoryPDF = (category, componentsList) => {
    try {
      const doc = new jsPDF("landscape");

      // Header
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text(
        `${category.toUpperCase().replace("_", " ")} COMPONENTS REPORT`,
        14,
        20,
      );

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total Components: ${componentsList.length}`, 14, 35);

      // Table data
      const tableData = componentsList.map((comp) => [
        comp.name,
        comp.type.charAt(0).toUpperCase() + comp.type.slice(1),
        comp.taxable ? "Yes" : "No",
        comp.statutory ? "Yes" : "No",
        getCalculationLabel(comp.calculation),
        formatValue(comp),
        formatBase(comp),
        comp.proRata ? "Yes" : "No",
        getRoundingLabel(comp.rounding),
        comp.isActive ? "Active" : "Inactive",
      ]);

      // AutoTable
      autoTable(doc, {
        startY: 45,
        head: [
          [
            "Name",
            "Type",
            "Taxable",
            "Statutory",
            "Calculation",
            "Value",
            "Base",
            "Pro-rata",
            "Rounding",
            "Status",
          ],
        ],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [66, 139, 202], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 25 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 15 },
          8: { cellWidth: 20 },
          9: { cellWidth: 15 },
        },
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page 1 of 1`, 280, 200, { align: "right" });

      // Save
      const fileName = `${category}-components-report.pdf`;
      doc.save(fileName);

      setActionNotification({
        show: true,
        type: "success",
        title: "PDF Exported",
        message: `${componentsList.length} ${category} components exported to PDF`,
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      setActionNotification({
        show: true,
        type: "error",
        title: "Export Failed",
        message: "Failed to generate PDF. Please try again.",
      });
    }
  };

  // Add this function to your main component, with the other export functions
  const handleExportVersionHistoryPDF = () => {
    console.log("Export PDF function called"); // Debug log

    try {
      // Check if required libraries are available
      if (typeof jsPDF === "undefined") {
        throw new Error("jsPDF library not loaded");
      }
      if (typeof autoTable === "undefined") {
        throw new Error("autoTable plugin not loaded");
      }

      // Create new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("VERSION HISTORY REPORT", 105, 20, { align: "center" });

      // Add subtitle
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);
      doc.text(`Total Versions: ${versions.length}`, 14, 40);

      // Prepare table data
      const tableData = versions.map((version) => {
        const structure = structures.find((s) => s.id === version.structureId);
        return [
          version.version || "",
          structure?.name || "N/A",
          version.changes || "",
          version.date || "",
          version.changedBy || "",
        ];
      });

      // Add table using autoTable
      autoTable(doc, {
        startY: 50,
        head: [["Version", "Structure", "Changes", "Date", "Changed By"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 10,
          halign: "center",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak",
          cellWidth: "wrap",
          halign: "left",
        },
        columnStyles: {
          0: { cellWidth: 20, halign: "center" }, // Version
          1: { cellWidth: 30, halign: "left" }, // Structure
          2: { cellWidth: 60, halign: "left" }, // Changes
          3: { cellWidth: 25, halign: "center" }, // Date
          4: { cellWidth: 25, halign: "left" }, // Changed By
          5: { cellWidth: 20, halign: "center" }, // Status
        },
        margin: { left: 14, right: 14 },
        didDrawPage: function (data) {
          // Add page numbers
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10,
          );
          doc.text(
            "Confidential - Version History Report",
            doc.internal.pageSize.width - 14,
            doc.internal.pageSize.height - 10,
            { align: "right" },
          );
        },
      });

      // Save the PDF
      const fileName = `version-history-${new Date().toISOString().split("T")[0]}.pdf`;
      console.log("Saving PDF:", fileName); // Debug log
      doc.save(fileName);

      // Close modal and show success notification
      setShowVersionModal(false);
      setActionNotification({
        show: true,
        type: "success",
        title: "Export Successful",
        message: `Version history exported to ${fileName}`,
      });
    } catch (error) {
      console.error("PDF Export Error:", error);

      // Show error notification
      setActionNotification({
        show: true,
        type: "error",
        title: "Export Failed",
        message: error.message || "Failed to generate PDF. Please try again.",
      });
    }
  };

  // Export Assignments to PDF
  const handleExportAssignmentsPDF = () => {
    try {
      const doc = new jsPDF("landscape");

      // Title
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("STRUCTURE ASSIGNMENTS REPORT", 14, 20);

      // Subtitle
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total Assignments: ${assignments.length}`, 14, 35);

      // Summary Statistics
      const activeAssignments = assignments.filter(
        (a) => a.assignmentStatus === "active",
      ).length;
      const pendingAssignments = assignments.filter(
        (a) => a.assignmentStatus === "pending",
      ).length;

      doc.setFontSize(12);
      doc.text("Summary Statistics", 14, 45);

      doc.setFontSize(10);
      doc.text(`Active Assignments: ${activeAssignments}`, 14, 55);
      doc.text(`Pending Assignments: ${pendingAssignments}`, 14, 62);
      doc.text(`Total Employees: ${assignments.length}`, 14, 69);

      let yPosition = 75;

      // Table Data
      const tableData = assignments.map((assignment) => [
        assignment.employeeId,
        assignment.name,
        assignment.department,
        `Grade ${assignment.grade}`,
        assignment.currentStructure,
        assignment.allocationRules?.type || "N/A",
        `₹${assignment.ctc.toLocaleString()}`,
        `₹${assignment.takeHome.toLocaleString()}`,
        assignment.effectiveDate,
        assignment.assignmentStatus || "active",
      ]);

      // AutoTable
      autoTable(doc, {
        startY: yPosition,
        head: [
          [
            "Employee ID",
            "Name",
            "Department",
            "Grade",
            "Structure",
            "Allocation",
            "CTC",
            "Take-Home",
            "Effective Date",
            "Status",
          ],
        ],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [13, 110, 253],
          textColor: 255,
          fontSize: 10,
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Employee ID
          1: { cellWidth: 30 }, // Name
          2: { cellWidth: 25 }, // Department
          3: { cellWidth: 15 }, // Grade
          4: { cellWidth: 35 }, // Structure
          5: { cellWidth: 20 }, // Allocation
          6: { cellWidth: 25 }, // CTC
          7: { cellWidth: 25 }, // Take-Home
          8: { cellWidth: 25 }, // Effective Date
          9: { cellWidth: 20 }, // Status
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Page ${data.pageNumber} of ${data.pageCount}`,
            doc.internal.pageSize.width - 20,
            doc.internal.pageSize.height - 10,
            { align: "right" },
          );
          doc.text(
            "Confidential - Structure Assignments Report",
            14,
            doc.internal.pageSize.height - 10,
          );
        },
      });

      // Save PDF
      const fileName = `assignments-report-${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
  };

  // Add this function for viewing assignment details
  const handleViewAssignmentDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowAssignmentViewModal(true);
  };

  // Function to download assignment as PDF
  const handleDownloadAssignmentPDF = (assignment) => {
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("EMPLOYEE SALARY ASSIGNMENT REPORT", 14, 20);

      // Subtitle
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Report ID: ${assignment.id}`, 14, 35);

      // Employee Information Section
      let yPosition = 45;
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("EMPLOYEE INFORMATION", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(`Employee ID: ${assignment.employeeId || "N/A"}`, 14, yPosition);
      yPosition += 7;
      doc.text(`Employee Name: ${assignment.name || "N/A"}`, 14, yPosition);
      yPosition += 7;
      doc.text(`Email: ${assignment.email || "N/A"}`, 14, yPosition);
      yPosition += 7;
      doc.text(`Department: ${assignment.department || "N/A"}`, 14, yPosition);
      yPosition += 7;
      doc.text(`Location: ${assignment.location || "N/A"}`, 14, yPosition);
      yPosition += 7;
      doc.text(
        `Employee Type: ${assignment.employeeType || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 10;

      // Assignment Details Section
      doc.setFontSize(12);
      doc.text("ASSIGNMENT DETAILS", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(
        `Current Structure: ${assignment.currentStructure || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(`Grade: ${assignment.grade || "N/A"}`, 14, yPosition);
      yPosition += 7;
      doc.text(`Level: ${assignment.level || "N/A"}`, 14, yPosition);
      yPosition += 7;
      doc.text(
        `Assignment Type: ${assignment.assignmentType || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Assignment Status: ${assignment.assignmentStatus || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Effective Date: ${assignment.effectiveDate || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(`Created On: ${assignment.createdOn || "N/A"}`, 14, yPosition);
      yPosition += 10;

      // Financial Details Section
      doc.setFontSize(12);
      doc.text("FINANCIAL DETAILS", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(
        `Annual CTC: ₹${(assignment.ctc || 0).toLocaleString()}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Monthly Take-Home: ₹${(assignment.takeHome || 0).toLocaleString()}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Monthly Gross Salary: ₹${(assignment.grossSalary || 0).toLocaleString()}`,
        14,
        yPosition,
      );

      if (assignment.annualTakeHome) {
        yPosition += 7;
        doc.text(
          `Annual Take-Home: ₹${assignment.annualTakeHome.toLocaleString()}`,
          14,
          yPosition,
        );
      }

      if (assignment.previousCTC) {
        yPosition += 7;
        doc.text(
          `Previous CTC: ₹${assignment.previousCTC.toLocaleString()}`,
          14,
          yPosition,
        );
      }
      yPosition += 10;

      // Allocation Rules Section
      if (assignment.allocationRules) {
        doc.setFontSize(12);
        doc.text("ALLOCATION RULES", 14, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.text(
          `Type: ${assignment.allocationRules.type || "N/A"}`,
          14,
          yPosition,
        );
        yPosition += 7;
        doc.text(
          `Basis: ${assignment.allocationRules.basis || "N/A"}`,
          14,
          yPosition,
        );
        yPosition += 7;
        doc.text(
          `Pro-rata: ${assignment.allocationRules.proRata ? "Yes" : "No"}`,
          14,
          yPosition,
        );
        yPosition += 7;
        doc.text(
          `Custom Rules: ${assignment.allocationRules.hasCustomRules ? "Yes" : "No"}`,
          14,
          yPosition,
        );
        yPosition += 10;
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Confidential - Employee Assignment Report", 14, 280);
      doc.text(`Page 1 of 1`, 200, 280, { align: "right" });

      // Save the PDF
      const fileName = `${assignment.employeeId}-${assignment.name.replace(/\s+/g, "-")}-assignment.pdf`;
      doc.save(fileName);

      // Show success notification
      setActionNotification({
        show: true,
        type: "success",
        title: "PDF Downloaded",
        message: `Assignment report for ${assignment.name} has been downloaded.`,
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      setActionNotification({
        show: true,
        type: "error",
        title: "Download Failed",
        message: "Failed to generate PDF. Please try again.",
      });
    }
  };

  // Helper function for rounding label
  const getRoundingLabel = (rounding) => {
    const labels = {
      nearest_integer: "Nearest Integer",
      ceil: "Round Up",
      floor: "Round Down",
      two_decimals: "2 Decimal Places",
      no_rounding: "No Rounding",
    };
    return labels[rounding] || rounding;
  };

  // Function to delete assignment silently
  const handleDeleteAssignment = (assignment) => {
    // Simply remove the assignment without any confirmation
    const updatedAssignments = assignments.filter(
      (a) => a.id !== assignment.id,
    );
    setAssignments(updatedAssignments);

    // Update structure employee count if needed
    if (assignment.currentStructure) {
      const updatedStructures = structures.map((structure) => {
        if (structure.name === assignment.currentStructure) {
          return {
            ...structure,
            employeeCount: Math.max(0, (structure.employeeCount || 0) - 1),
          };
        }
        return structure;
      });
      setStructures(updatedStructures);
    }

    // No notification, no popup, just silently delete
    console.log("Assignment deleted silently:", assignment.employeeId);
  };

  const getIncrementRangeFromGrade = (grade) => {
    const ranges = {
      A: "10-15%",
      B: "8-12%",
      C: "5-8%",
      D: "3-5%",
      CT: "NA",
      IN: "NA",
    };
    return ranges[grade] || "5-8%";
  };
  // Enhanced badge components
  const getCalculationBadge = (calculation) => {
    const colors = {
      flat_amount: "bg-light text-dark",
      percentage_of_base: "bg-info-subtle text-info",
      percentage_of_gross: "bg-primary-subtle text-primary",
      percentage_of_ctc: "bg-success-subtle text-success",
      custom_formula: "bg-warning-subtle text-warning",
    };

    return (
      <span
        className={`badge border small ${
          colors[calculation] || "bg-secondary-subtle text-secondary"
        }`}
      >
        {getCalculationLabel(calculation)}
      </span>
    );
  };
  const getProRataBadge = (proRata) => (
    <span
      className={`badge border small ${
        proRata
          ? "bg-success-subtle text-success"
          : "bg-secondary-subtle text-secondary"
      }`}
    >
      {proRata ? "Pro-rata" : "Non-pro-rata"}
    </span>
  );

  const getRoundingBadge = (rounding) => {
    const labels = {
      nearest_integer: "Nearest ₹",
      ceil: "Round Up",
      floor: "Round Down",
      two_decimals: "2 Decimals",
      no_rounding: "No Rounding",
    };

    return (
      <span className="badge bg-light border text-dark small">
        {labels[rounding] || rounding}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-success-subtle text-success border-success-subtle",
      Inactive: "bg-secondary-subtle text-secondary border-secondary-subtle",
      Draft: "bg-warning-subtle text-warning border-warning-subtle",
      Published: "bg-primary-subtle text-primary border-primary-subtle",
    };

    const icons = {
      Active: <CheckCircle size={12} />,
      Inactive: <XCircle size={12} />,
      Draft: <Edit2 size={12} />,
      Published: <FileText size={12} />,
    };

    return (
      <span
        className={`badge border d-inline-flex align-items-center gap-1 ${styles[status]}`}
      >
        {icons[status]}
        {status}
      </span>
    );
  };

  const calculateBreakdown = (structure) => {
    // Safely handle missing structure
    if (!structure) return null;

    // Default values for missing fields
    const ctc = structure.ctc || 0;
    const basic = ctc * 0.4;
    const hra = basic * 0.5;
    const conveyance = 19200;
    const specialAllowance = ctc * 0.2 - conveyance;

    // Safely access standardDeductions with defaults
    const standardDeductions = structure.standardDeductions || {
      pf: { enabled: true, employee: 12, employer: 12 },
      esi: { enabled: false, employee: 0, employer: 0 },
      professionalTax: { enabled: true, amount: 200 },
      tds: { enabled: false, slab: "none" },
    };

    const pf =
      basic *
      (standardDeductions.pf?.enabled
        ? standardDeductions.pf.employee / 100
        : 0);
    const esi = standardDeductions.esi?.enabled
      ? (basic + hra + conveyance + specialAllowance) *
        (standardDeductions.esi.employee / 100)
      : 0;
    const professionalTax = standardDeductions.professionalTax?.enabled
      ? standardDeductions.professionalTax.amount
      : 0;

    // Calculate taxable income
    const taxableIncome = basic + hra + conveyance + specialAllowance;
    const standardDeduction = 50000;
    const tds = standardDeductions.tds?.enabled
      ? (taxableIncome - standardDeduction) * 0.1
      : 0;

    // Employer contributions
    const employerPf =
      basic *
      (standardDeductions.pf?.enabled
        ? standardDeductions.pf.employer / 100
        : 0);
    const employerEsi = standardDeductions.esi?.enabled
      ? (basic + hra + conveyance + specialAllowance) *
        (standardDeductions.esi.employer / 100)
      : 0;

    // Calculations
    const gross = basic + hra + conveyance + specialAllowance;
    const employeeDeductions = pf + esi + professionalTax + tds;
    const takeHome = gross - employeeDeductions;
    const employerCost = ctc + employerPf + employerEsi;
    const ctcVsTakeHome = ctc > 0 ? ((takeHome / ctc) * 100).toFixed(1) : "0.0";

    return {
      basic,
      hra,
      conveyance,
      specialAllowance,
      pf,
      esi,
      professionalTax,
      tds,
      employerPf,
      employerEsi,
      gross,
      employeeDeductions,
      takeHome,
      employerCost,
      ctcVsTakeHome,
      annualTakeHome: takeHome * 12,
      annualEmployerCost: employerCost * 12,
    };
  };

  // Download Single Structure as PDF
  const handleExportSingleStructurePDF = (structure) => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("SALARY STRUCTURE DETAILS", 14, 20);

      // Structure Info
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Structure ID: ${structure.id}`, 14, 35);
      doc.text(`Version: ${structure.version || "v1.0"}`, 14, 40);

      let yPosition = 50;

      // Basic Information
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text("BASIC INFORMATION", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(`Name: ${structure.name}`, 14, yPosition);
      yPosition += 7;
      doc.text(
        `Grade: ${structure.grade} | Level: ${structure.level || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(`Category: ${structure.category || "N/A"}`, 14, yPosition);
      yPosition += 7;
      doc.text(
        `Employee Type: ${structure.employeeType || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Annual CTC: Rs${(structure.ctc || 0).toLocaleString()}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Effective Date: ${structure.effectiveDate || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(`Status: ${structure.status || "N/A"}`, 14, yPosition);
      yPosition += 10;

      // Departments & Locations
      doc.setFontSize(12);
      doc.text("APPLICABILITY", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(
        `Departments: ${(structure.department || []).join(", ") || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Locations: ${(structure.location || []).join(", ") || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 10;

      // Salary Bands
      doc.setFontSize(12);
      doc.text("SALARY BANDS", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(
        `Minimum CTC: Rs${(structure.minCTC || 0).toLocaleString()}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Maximum CTC: Rs${(structure.maxCTC || 0).toLocaleString()}`,
        14,
        yPosition,
      );
      yPosition += 7;
      doc.text(
        `Increment Range: ${structure.incrementRange || "N/A"}`,
        14,
        yPosition,
      );
      yPosition += 10;

      // Standard Deductions
      doc.setFontSize(12);
      doc.text("STANDARD DEDUCTIONS", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      if (structure.standardDeductions?.pf?.enabled) {
        doc.text(
          `PF: ${structure.standardDeductions.pf.employee}% (Employee), ${structure.standardDeductions.pf.employer}% (Employer)`,
          14,
          yPosition,
        );
        yPosition += 7;
      }
      if (structure.standardDeductions?.esi?.enabled) {
        doc.text(
          `ESI: ${structure.standardDeductions.esi.employee}% (Employee), ${structure.standardDeductions.esi.employer}% (Employer)`,
          14,
          yPosition,
        );
        yPosition += 7;
      }
      if (structure.standardDeductions?.professionalTax?.enabled) {
        doc.text(
          `Professional Tax: Rs${structure.standardDeductions.professionalTax.amount}`,
          14,
          yPosition,
        );
        yPosition += 7;
      }
      if (structure.standardDeductions?.tds?.enabled) {
        doc.text(
          `TDS: ${structure.standardDeductions.tds.slab || "Enabled"}`,
          14,
          yPosition,
        );
        yPosition += 7;
      }
      yPosition += 10;

      // Employee Count
      doc.text(
        `Assigned Employees: ${structure.employeeCount || 0}`,
        14,
        yPosition,
      );
      yPosition += 10;

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Confidential - Salary Structure Details", 14, 280);
      doc.text(`Page 1 of 1`, 200, 280, { align: "right" });

      // Save
      const fileName = `${structure.name.toLowerCase().replace(/\s+/g, "-")}-details.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
  };

  // Download Single Structure as Excel
  const handleExportSingleStructureExcel = (structure) => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Structure Details Sheet
      // Structure Details Sheet (Row-wise)
const structureHeaders = [
  "Structure Name",
  "Grade",
  "Level",
  "Category",
  "Sub Category",
  "Employee Type",
  "Annual CTC",
  "Min CTC",
  "Max CTC",
  "Increment Range",
  "Status",
  "Approval Status",
  "Effective Date",
  "Expiry Date",
  "Employee Count",
  "Created On",
  "Created By",
  "Version",
  "Departments",
  "Locations",
  "Description",
  "Change Reason",
];

const structureValues = [
  structure.name,
  structure.grade,
  structure.level || "N/A",
  structure.category || "N/A",
  structure.subCategory || "N/A",
  structure.employeeType || "N/A",
  `₹${(structure.ctc || 0).toLocaleString()}`,
  `₹${(structure.minCTC || 0).toLocaleString()}`,
  `₹${(structure.maxCTC || 0).toLocaleString()}`,
  structure.incrementRange || "N/A",
  structure.status || "N/A",
  structure.approvalStatus || "N/A",
  structure.effectiveDate || "N/A",
  structure.expiryDate || "N/A",
  structure.employeeCount || 0,
  structure.createdAt || "N/A",
  structure.createdBy || "N/A",
  structure.version || "v1.0",
  (structure.department || []).join(", ") || "N/A",
  (structure.location || []).join(", ") || "N/A",
  structure.description || "",
  structure.changeReason || "",
];

const ws = XLSX.utils.aoa_to_sheet([
  structureHeaders,
  structureValues,
]);

XLSX.utils.book_append_sheet(wb, ws, "Structure Details");

      // Standard Deductions Sheet
      const deductionsData = [
        ["Deduction", "Enabled", "Employee %", "Employer %", "Amount", "Slab"],
        [
          "Provident Fund (PF)",
          structure.standardDeductions?.pf?.enabled ? "Yes" : "No",
          structure.standardDeductions?.pf?.employee || "N/A",
          structure.standardDeductions?.pf?.employer || "N/A",
          "N/A",
          "N/A",
        ],
        [
          "ESI Contribution",
          structure.standardDeductions?.esi?.enabled ? "Yes" : "No",
          structure.standardDeductions?.esi?.employee || "N/A",
          structure.standardDeductions?.esi?.employer || "N/A",
          "N/A",
          "N/A",
        ],
        [
          "Professional Tax",
          structure.standardDeductions?.professionalTax?.enabled ? "Yes" : "No",
          "N/A",
          "N/A",
          structure.standardDeductions?.professionalTax?.amount
            ? `₹${structure.standardDeductions.professionalTax.amount}`
            : "N/A",
          "N/A",
        ],
        [
          "TDS",
          structure.standardDeductions?.tds?.enabled ? "Yes" : "No",
          "N/A",
          "N/A",
          "N/A",
          structure.standardDeductions?.tds?.slab || "N/A",
        ],
      ];

      const ws2 = XLSX.utils.aoa_to_sheet(deductionsData);
      XLSX.utils.book_append_sheet(wb, ws2, "Standard Deductions");

      // Version History Sheet
      const versionData = [["Version", "Date", "Changes", "Changed By"]];

      if (structure.versionHistory && structure.versionHistory.length > 0) {
        structure.versionHistory.forEach((version) => {
          versionData.push([
            version.version,
            version.date,
            version.changes,
            version.changedBy,
          ]);
        });
      } else {
        versionData.push(["No version history available"]);
      }

      const ws3 = XLSX.utils.aoa_to_sheet(versionData);
      XLSX.utils.book_append_sheet(wb, ws3, "Version History");

      // Save Excel file
      const fileName = `${structure.name.toLowerCase().replace(/\s+/g, "-")}-details.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Excel Export Error:", error);
    }
  };

  // Filter components based on selected filters
  const filterComponents = (componentList) => {
    return componentList.filter((comp) => {
      const matchesCategory =
        componentFilters.category === "all" ||
        comp.category === componentFilters.category;
      const matchesType =
        componentFilters.type === "all" || comp.type === componentFilters.type;
      const matchesTaxable =
        componentFilters.taxable === "all" ||
        (componentFilters.taxable === "taxable" && comp.taxable) ||
        (componentFilters.taxable === "non_taxable" && !comp.taxable);
      const matchesStatutory =
        componentFilters.statutory === "all" ||
        (componentFilters.statutory === "statutory" && comp.statutory) ||
        (componentFilters.statutory === "non_statutory" && !comp.statutory);
      const matchesCalculation =
        componentFilters.calculation === "all" ||
        comp.calculation === componentFilters.calculation;
      const matchesProRata =
        componentFilters.proRata === "all" ||
        (componentFilters.proRata === "proRata" && comp.proRata) ||
        (componentFilters.proRata === "no_proRata" && !comp.proRata);
      const matchesStatus =
        componentFilters.status === "all" ||
        (componentFilters.status === "active" && comp.isActive) ||
        (componentFilters.status === "inactive" && !comp.isActive);

      return (
        matchesCategory &&
        matchesType &&
        matchesTaxable &&
        matchesStatutory &&
        matchesCalculation &&
        matchesProRata &&
        matchesStatus
      );
    });
  };

  // Format value display
  const formatValue = (component) => {
    if (component.calculation === "flat_amount") {
      return `₹${component.value.toLocaleString()}`;
    } else if (component.calculation === "custom_formula") {
      return component.formula || "Custom";
    } else {
      return `${component.value}%`;
    }
  };
  // Format base display
  const formatBase = (component) => {
    const bases = {
      Basic: "Basic",
      Gross: "Gross",
      CTC: "CTC",
      Taxable: "Taxable Income",
      fixed: "Fixed",
    };
    return bases[component.base] || component.base;
  };

  const AddComponentModal = ({ components, setComponents, onClose }) => {
    const [formData, setFormData] = useState({
      name: "",
      category: "earnings",
      type: "fixed",
      taxable: false,
      statutory: false,
      calculation: "flat_amount",
      value: "",
      base: "fixed",
      proRata: true,
      rounding: "nearest_integer",
      description: "",
      statutoryReference: "",
      requiresProof: false,
      maxAmount: "",
      minAmount: "",
      taxExemptLimit: "",
      calculationOrder: 1,
      formula: "",
      isActive: true,
    });

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleSave = () => {
      // Validation
      if (!formData.name.trim()) {
        alert("Component name is required");
        return;
      }

      if (formData.calculation !== "custom_formula" && !formData.value) {
        alert("Value is required");
        return;
      }

      if (
        formData.calculation === "custom_formula" &&
        !formData.formula.trim()
      ) {
        alert("Custom formula is required");
        return;
      }

      // Generate new ID
      const newId =
        Math.max(
          ...Object.values(components)
            .flat()
            .map((c) => c.id),
          0,
        ) + 1;

      // Create new component
      const newComponent = {
        id: newId,
        name: formData.name,
        category: formData.category,
        type: formData.type,
        taxable: formData.taxable,
        statutory: formData.statutory,
        calculation: formData.calculation,
        value: formData.value ? parseFloat(formData.value) : 0,
        base: formData.base,
        proRata: formData.proRata,
        rounding: formData.rounding,
        isActive: formData.isActive,
        description: formData.description,
        statutoryReference: formData.statutoryReference,
        requiresProof: formData.requiresProof,
        maxAmount: formData.maxAmount ? parseFloat(formData.maxAmount) : null,
        minAmount: formData.minAmount ? parseFloat(formData.minAmount) : null,
        taxExemptLimit: formData.taxExemptLimit
          ? parseFloat(formData.taxExemptLimit)
          : null,
        calculationOrder: parseInt(formData.calculationOrder) || 1,
        formula: formData.formula,
      };

      // Add to components state
      setComponents((prev) => {
        const updated = { ...prev };
        const category = formData.category;

        if (!updated[category]) {
          updated[category] = [];
        }

        updated[category] = [...updated[category], newComponent];
        return updated;
      });

      // Show success notification
      setActionNotification({
        show: true,
        type: "success",
        title: "Component Added",
        message: `"${newComponent.name}" has been added successfully.`,
      });

      onClose();
    };

    const resetForm = () => {
      setFormData({
        name: "",
        category: "earnings",
        type: "fixed",
        taxable: false,
        statutory: false,
        calculation: "flat_amount",
        value: "",
        base: "fixed",
        proRata: true,
        rounding: "nearest_integer",
        description: "",
        statutoryReference: "",
        requiresProof: false,
        maxAmount: "",
        minAmount: "",
        taxExemptLimit: "",
        calculationOrder: 1,
        formula: "",
        isActive: true,
      });
    };

    return (
      <div className="hrms-modal-overlay">
        <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">
          {/* HEADER */}
          <div className="hrms-modal-header">
            <h5 className="hrms-modal-title d-flex align-items-center">
              Add New Component
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                resetForm();
                onClose();
              }}
            ></button>
          </div>

          <div className="hrms-modal-body hrms-modal-body-scroll">
            <div className="row">
              {/* Component Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Component Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Performance Bonus"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Category */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="earnings">Earnings</option>
                  <option value="deductions">Deductions</option>
                  <option value="employer_contributions">
                    Employer Contributions
                  </option>
                  <option value="reimbursements">Reimbursements</option>
                </select>
              </div>

              {/* Component Type */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Component Type <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="fixed">Fixed</option>
                  <option value="variable">Variable</option>
                </select>
              </div>

              {/* Calculation Method */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Calculation Method <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  name="calculation"
                  value={formData.calculation}
                  onChange={handleInputChange}
                >
                  <option value="flat_amount">Flat Amount</option>
                  <option value="percentage_of_base">Percentage of Base</option>
                  <option value="percentage_of_gross">
                    Percentage of Gross
                  </option>
                  <option value="percentage_of_ctc">Percentage of CTC</option>
                  <option value="custom_formula">Custom Formula</option>
                </select>
              </div>

              {/* Base for Calculation - Show only for percentage calculations */}
              {(formData.calculation === "percentage_of_base" ||
                formData.calculation === "percentage_of_gross" ||
                formData.calculation === "percentage_of_ctc") && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">Base for Calculation</label>
                  <select
                    className="form-select"
                    name="base"
                    value={formData.base}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Base</option>
                    {formData.calculation === "percentage_of_base" && (
                      <>
                        <option value="Basic">Basic Salary</option>
                        <option value="Gross">Gross Salary</option>
                        <option value="Taxable">Taxable Amount</option>
                      </>
                    )}
                    {formData.calculation === "percentage_of_gross" && (
                      <option value="Gross">Gross Salary</option>
                    )}
                    {formData.calculation === "percentage_of_ctc" && (
                      <option value="CTC">CTC</option>
                    )}
                  </select>
                </div>
              )}

              {/* Value Field - Hide for custom formula */}
              {formData.calculation !== "custom_formula" && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    {formData.calculation === "flat_amount"
                      ? "Amount (₹)"
                      : "Percentage Value (%)"}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="value"
                    placeholder={
                      formData.calculation === "flat_amount"
                        ? "e.g., 5000"
                        : "e.g., 12.5"
                    }
                    value={formData.value}
                    onChange={handleInputChange}
                    step={formData.calculation === "flat_amount" ? "1" : "0.1"}
                  />
                </div>
              )}

              {/* Formula Field - Show only for custom formula */}
              {formData.calculation === "custom_formula" && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">Custom Formula</label>
                  <input
                    type="text"
                    className="form-control"
                    name="formula"
                    placeholder="e.g., Basic * 0.5 + HRA"
                    value={formData.formula}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {/* Checkboxes */}
              {/* Checkboxes */}
              <div className="col-12 mb-3 d-flex flex-wrap gap-3">
                {/* Taxable */}
                <label
                  htmlFor="taxable"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: `2px solid ${formData.taxable ? "#3B82F6" : "#9CA3AF"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "8px",
                      background: formData.taxable ? "#3B82F6" : "transparent",
                    }}
                  >
                    {formData.taxable && (
                      <span style={{ color: "white", fontSize: "12px" }}>
                        ✓
                      </span>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    id="taxable"
                    name="taxable"
                    checked={formData.taxable}
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                  />

                  <span className="fw-semibold">Taxable</span>
                </label>

                {/* Statutory */}
                <label
                  htmlFor="statutory"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: `2px solid ${formData.statutory ? "#3B82F6" : "#9CA3AF"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "8px",
                      background: formData.statutory
                        ? "#3B82F6"
                        : "transparent",
                    }}
                  >
                    {formData.statutory && (
                      <span style={{ color: "white", fontSize: "12px" }}>
                        ✓
                      </span>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    id="statutory"
                    name="statutory"
                    checked={formData.statutory}
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                  />

                  <span className="fw-semibold">Statutory</span>
                </label>

                {/* Pro-rata */}
                <label
                  htmlFor="proRata"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: `2px solid ${formData.proRata ? "#3B82F6" : "#9CA3AF"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "8px",
                      background: formData.proRata ? "#3B82F6" : "transparent",
                    }}
                  >
                    {formData.proRata && (
                      <span style={{ color: "white", fontSize: "12px" }}>
                        ✓
                      </span>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    id="proRata"
                    name="proRata"
                    checked={formData.proRata}
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                  />

                  <span className="fw-semibold">Pro-rata Calculation</span>
                </label>

                {/* Requires Proof */}
                <label
                  htmlFor="requiresProof"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: `2px solid ${formData.requiresProof ? "#3B82F6" : "#9CA3AF"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "8px",
                      background: formData.requiresProof
                        ? "#3B82F6"
                        : "transparent",
                    }}
                  >
                    {formData.requiresProof && (
                      <span style={{ color: "white", fontSize: "12px" }}>
                        ✓
                      </span>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    id="requiresProof"
                    name="requiresProof"
                    checked={formData.requiresProof}
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                  />

                  <span className="fw-semibold">Requires Proof</span>
                </label>

                {/* Active */}
                <label
                  htmlFor="isActive"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: `2px solid ${formData.isActive ? "#3B82F6" : "#9CA3AF"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "8px",
                      background: formData.isActive ? "#3B82F6" : "transparent",
                    }}
                  >
                    {formData.isActive && (
                      <span style={{ color: "white", fontSize: "12px" }}>
                        ✓
                      </span>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    style={{ display: "none" }}
                  />

                  <span className="fw-semibold">Active</span>
                </label>
              </div>

              {/* Description */}
              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Enter component description..."
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Additional Fields */}
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Rounding Method</label>
                  <select
                    className="form-select"
                    name="rounding"
                    value={formData.rounding}
                    onChange={handleInputChange}
                  >
                    <option value="nearest_integer">Nearest Integer</option>
                    <option value="ceil">Round Up</option>
                    <option value="floor">Round Down</option>
                    <option value="two_decimals">2 Decimal Places</option>
                    <option value="no_rounding">No Rounding</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Calculation Order</label>
                  <input
                    type="number"
                    className="form-control"
                    name="calculationOrder"
                    min="1"
                    value={formData.calculationOrder}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Tax Exempt Limit (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="taxExemptLimit"
                    placeholder="Optional"
                    value={formData.taxExemptLimit}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Max/Min Amounts */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Minimum Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="minAmount"
                    placeholder="Optional"
                    value={formData.minAmount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Maximum Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxAmount"
                    placeholder="Optional"
                    value={formData.maxAmount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Statutory Reference */}
              <div className="col-12 mb-3">
                <label className="form-label">Statutory Reference</label>
                <input
                  type="text"
                  className="form-control"
                  name="statutoryReference"
                  placeholder="e.g., EPF Act, 1952"
                  value={formData.statutoryReference}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer bg-white border-top d-flex">
            <button
              className="cancel-btn"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </button>
            <button className="create-job-btn" onClick={handleSave}>
              <Icon icon="heroicons:arrow-down-tray" width="14" />
              Add Component
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EditComponentModal = ({
    selectedComponent,
    components,
    setComponents,
    onClose,
  }) => {
    const [formData, setFormData] = useState({
      name: selectedComponent.name || "",
      category: selectedComponent.category || "earnings",
      type: selectedComponent.type || "fixed",
      taxable: selectedComponent.taxable || false,
      statutory: selectedComponent.statutory || false,
      calculation: selectedComponent.calculation || "flat_amount",
      value: selectedComponent.value || "",
      base: selectedComponent.base || "fixed",
      proRata: selectedComponent.proRata || true,
      rounding: selectedComponent.rounding || "nearest_integer",
      description: selectedComponent.description || "",
      statutoryReference: selectedComponent.statutoryReference || "",
      requiresProof: selectedComponent.requiresProof || false,
      maxAmount: selectedComponent.maxAmount || "",
      minAmount: selectedComponent.minAmount || "",
      taxExemptLimit: selectedComponent.taxExemptLimit || "",
      calculationOrder: selectedComponent.calculationOrder || 1,
      formula: selectedComponent.formula || "",
      isActive: selectedComponent.isActive || true,
    });

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleUpdate = () => {
      // Validation
      if (!formData.name.trim()) {
        alert("Component name is required");
        return;
      }

      if (formData.calculation !== "custom_formula" && !formData.value) {
        alert("Value is required");
        return;
      }

      if (
        formData.calculation === "custom_formula" &&
        !formData.formula.trim()
      ) {
        alert("Custom formula is required");
        return;
      }

      // Prepare updated component
      const updatedComponent = {
        ...selectedComponent,
        name: formData.name,
        category: formData.category,
        type: formData.type,
        taxable: formData.taxable,
        statutory: formData.statutory,
        calculation: formData.calculation,
        value: formData.value ? parseFloat(formData.value) : 0,
        base: formData.base,
        proRata: formData.proRata,
        rounding: formData.rounding,
        isActive: formData.isActive,
        description: formData.description,
        statutoryReference: formData.statutoryReference,
        requiresProof: formData.requiresProof,
        maxAmount: formData.maxAmount ? parseFloat(formData.maxAmount) : null,
        minAmount: formData.minAmount ? parseFloat(formData.minAmount) : null,
        taxExemptLimit: formData.taxExemptLimit
          ? parseFloat(formData.taxExemptLimit)
          : null,
        calculationOrder: parseInt(formData.calculationOrder) || 1,
        formula: formData.formula,
      };

      // Update components state
      setComponents((prev) => {
        const updated = { ...prev };
        const oldCategory = selectedComponent.category;
        const newCategory = formData.category;

        // Remove from old category if category changed
        if (oldCategory !== newCategory) {
          updated[oldCategory] = updated[oldCategory].filter(
            (c) => c.id !== selectedComponent.id,
          );
        }

        // Add to new category
        if (!updated[newCategory]) {
          updated[newCategory] = [];
        }

        // Check if component already exists in new category
        const existingIndex = updated[newCategory].findIndex(
          (c) => c.id === selectedComponent.id,
        );

        if (existingIndex !== -1) {
          // Update existing
          updated[newCategory][existingIndex] = updatedComponent;
        } else {
          // Add new
          updated[newCategory] = [...updated[newCategory], updatedComponent];
        }

        return updated;
      });

      // Show success notification
      setActionNotification({
        show: true,
        type: "success",
        title: "Component Updated",
        message: `"${updatedComponent.name}" has been updated successfully.`,
      });

      onClose();
    };

    const handleDelete = () => {
      if (
        window.confirm(
          `Are you sure you want to delete "${selectedComponent.name}"?`,
        )
      ) {
        setComponents((prev) => {
          const updated = { ...prev };
          const category = selectedComponent.category;

          if (updated[category]) {
            updated[category] = updated[category].filter(
              (c) => c.id !== selectedComponent.id,
            );
          }

          return updated;
        });

        // Show success notification
        setActionNotification({
          show: true,
          type: "success",
          title: "Component Deleted",
          message: `"${selectedComponent.name}" has been deleted successfully.`,
        });

        onClose();
      }
    };

    return (
      <div  className="hrms-modal-overlay">
         <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

        <div className="hrms-modal-header">
          <h5 className="hrms-modal-title d-flex align-items-center">
            Edit Component: {selectedComponent.name}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>

        <div className="hrms-modal-body hrms-modal-body-scroll">
          <div className="alert alert-info mb-3">
            <small>
              <strong>ID:</strong> {selectedComponent.id} |
              <strong> Created:</strong>{" "}
              {selectedComponent.createdDate || "N/A"} |
              <strong> Last Modified:</strong>{" "}
              {selectedComponent.lastModified || "N/A"}
            </small>
          </div>

          <div className="row">
            {/* Component Name */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Component Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Category - Disabled for existing components */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="earnings">Earnings</option>
                <option value="deductions">Deductions</option>
                <option value="employer_contributions">
                  Employer Contributions
                </option>
                <option value="reimbursements">Reimbursements</option>
              </select>
              <div className="form-text text-warning">
                Changing category may affect existing salary structures
              </div>
            </div>

            {/* Component Type */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Component Type <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="fixed">Fixed</option>
                <option value="variable">Variable</option>
              </select>
            </div>

            {/* Calculation Method */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Calculation Method <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                name="calculation"
                value={formData.calculation}
                onChange={handleInputChange}
              >
                <option value="flat_amount">Flat Amount</option>
                <option value="percentage_of_base">Percentage of Base</option>
                <option value="percentage_of_gross">Percentage of Gross</option>
                <option value="percentage_of_ctc">Percentage of CTC</option>
                <option value="custom_formula">Custom Formula</option>
              </select>
            </div>

            {/* Base for Calculation - Show only for percentage calculations */}
            {(formData.calculation === "percentage_of_base" ||
              formData.calculation === "percentage_of_gross" ||
              formData.calculation === "percentage_of_ctc") && (
              <div className="col-md-6 mb-3">
                <label className="form-label">Base for Calculation</label>
                <select
                  className="form-select"
                  name="base"
                  value={formData.base}
                  onChange={handleInputChange}
                >
                  <option value="">Select Base</option>
                  {formData.calculation === "percentage_of_base" && (
                    <>
                      <option value="Basic">Basic Salary</option>
                      <option value="Gross">Gross Salary</option>
                      <option value="Taxable">Taxable Amount</option>
                    </>
                  )}
                  {formData.calculation === "percentage_of_gross" && (
                    <option value="Gross">Gross Salary</option>
                  )}
                  {formData.calculation === "percentage_of_ctc" && (
                    <option value="CTC">CTC</option>
                  )}
                </select>
              </div>
            )}

            {/* Value Field - Hide for custom formula */}
            {formData.calculation !== "custom_formula" && (
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {formData.calculation === "flat_amount"
                    ? "Amount (₹)"
                    : "Percentage Value (%)"}
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  step={formData.calculation === "flat_amount" ? "1" : "0.1"}
                />
              </div>
            )}

            {/* Formula Field - Show only for custom formula */}
            {formData.calculation === "custom_formula" && (
              <div className="col-md-6 mb-3">
                <label className="form-label">Custom Formula</label>
                <input
                  type="text"
                  className="form-control"
                  name="formula"
                  value={formData.formula}
                  onChange={handleInputChange}
                />
              </div>
            )}

{/* Checkboxes */}
<div className="col-12 mb-3 d-flex flex-wrap gap-3">

  {/* Taxable */}
  <label
    htmlFor="edit-taxable"
    style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "black" }}
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${formData.taxable ? "#3B82F6" : "#9CA3AF"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "8px",
        background: formData.taxable ? "#3B82F6" : "transparent",
        transition: "all 0.3s ease",
      }}
    >
      {formData.taxable && (
        <span style={{ color: "white", fontSize: "12px" }}>✓</span>
      )}
    </div>

    <input
      type="checkbox"
      id="edit-taxable"
      name="taxable"
      checked={formData.taxable}
      onChange={handleInputChange}
      style={{ display: "none" }}
    />

    <span className="fw-semibold">Taxable</span>
  </label>

  {/* Statutory */}
  <label
    htmlFor="edit-statutory"
    style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "black" }}
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${formData.statutory ? "#3B82F6" : "#9CA3AF"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "8px",
        background: formData.statutory ? "#3B82F6" : "transparent",
      }}
    >
      {formData.statutory && (
        <span style={{ color: "white", fontSize: "12px" }}>✓</span>
      )}
    </div>

    <input
      type="checkbox"
      id="edit-statutory"
      name="statutory"
      checked={formData.statutory}
      onChange={handleInputChange}
      style={{ display: "none" }}
    />

    <span className="fw-semibold">Statutory</span>
  </label>

  {/* Pro Rata */}
  <label
    htmlFor="edit-proRata"
    style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "black" }}
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${formData.proRata ? "#3B82F6" : "#9CA3AF"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "8px",
        background: formData.proRata ? "#3B82F6" : "transparent",
      }}
    >
      {formData.proRata && (
        <span style={{ color: "white", fontSize: "12px" }}>✓</span>
      )}
    </div>

    <input
      type="checkbox"
      id="edit-proRata"
      name="proRata"
      checked={formData.proRata}
      onChange={handleInputChange}
      style={{ display: "none" }}
    />

    <span className="fw-semibold">Pro-rata Calculation</span>
  </label>

  {/* Requires Proof */}
  <label
    htmlFor="edit-requiresProof"
    style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "black" }}
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${formData.requiresProof ? "#3B82F6" : "#9CA3AF"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "8px",
        background: formData.requiresProof ? "#3B82F6" : "transparent",
      }}
    >
      {formData.requiresProof && (
        <span style={{ color: "white", fontSize: "12px" }}>✓</span>
      )}
    </div>

    <input
      type="checkbox"
      id="edit-requiresProof"
      name="requiresProof"
      checked={formData.requiresProof}
      onChange={handleInputChange}
      style={{ display: "none" }}
    />

    <span className="fw-semibold">Requires Proof</span>
  </label>

  {/* Active */}
  <label
    htmlFor="edit-isActive"
    style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "black" }}
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${formData.isActive ? "#3B82F6" : "#9CA3AF"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "8px",
        background: formData.isActive ? "#3B82F6" : "transparent",
      }}
    >
      {formData.isActive && (
        <span style={{ color: "white", fontSize: "12px" }}>✓</span>
      )}
    </div>

    <input
      type="checkbox"
      id="edit-isActive"
      name="isActive"
      checked={formData.isActive}
      onChange={handleInputChange}
      style={{ display: "none" }}
    />

    <span className="fw-semibold">Active</span>
  </label>

</div>

            {/* Description */}
            <div className="col-12 mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="2"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Additional Fields */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Rounding Method</label>
                <select
                  className="form-select"
                  name="rounding"
                  value={formData.rounding}
                  onChange={handleInputChange}
                >
                  <option value="nearest_integer">Nearest Integer</option>
                  <option value="ceil">Round Up</option>
                  <option value="floor">Round Down</option>
                  <option value="two_decimals">2 Decimal Places</option>
                  <option value="no_rounding">No Rounding</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Calculation Order</label>
                <input
                  type="number"
                  className="form-control"
                  name="calculationOrder"
                  min="1"
                  value={formData.calculationOrder}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Tax Exempt Limit (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="taxExemptLimit"
                  value={formData.taxExemptLimit}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Max/Min Amounts */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Minimum Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="minAmount"
                  value={formData.minAmount}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Maximum Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="maxAmount"
                  value={formData.maxAmount}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Statutory Reference */}
            <div className="col-12 mb-3">
              <label className="form-label">Statutory Reference</label>
              <input
                type="text"
                className="form-control"
                name="statutoryReference"
                value={formData.statutoryReference}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer bg-white border-top d-flex">
          <button className="delete-btn" onClick={handleDelete}>
            <Trash2 size={16} className="me-2" />
            Delete Component
          </button>
          <div className="d-flex gap-2">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="create-job-btn" onClick={handleUpdate}>
              <Save size={16} className="me-2" />
              Update Component
            </button>
          </div>
        </div>
         </div>  
      </div>
    );
  };

  const renderComponentsTab = () => {
    const filteredEarnings = filterComponents(components.earnings);
    const filteredDeductions = filterComponents(components.deductions);
    const filteredEmployerContributions = filterComponents(
      components.employerContributions,
    );
    const filteredReimbursements = filterComponents(components.reimbursements);

    return (
      <div className="card border shadow-none mb-4">
        <div className="card-body">
          <div className="mb-4">
            <div className="row g-3 align-items-center">
              {/* Title */}
              <div className="col-12 col-md-auto">
                <h5 className="mb-0 d-flex align-items-center">
                  <Layers size={18} className="me-2" />
                  Salary Components Master
                </h5>
              </div>

              {/* Actions */}
              <div className="col-12 col-md">
                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-md-end">

                  {/* Add Component */}
                  <button
                    className="create-job-btn"
                    onClick={() => setShowComponentModal(true)}
                  >
                    <Plus size={16} className="me-2" />
                    Add Component
                  </button>
                                    {/* Export Dropdown */}
                  <div className="dropdown">
                    <button
                      className="add-assignment-btn dropdown-toggle d-flex align-items-center justify-content-center w-100"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FileText size={16} className="me-2" />
                      Export
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={handleExportPDF}
                        >
                          <FileText size={14} className="me-2" />
                          Export as PDF
                        </button>
                      </li>
                      <li>
                        <button
                         className="dropdown-item d-flex align-items-center"
                          onClick={handleExportCSV}
                        >
                          <BarChart size={14} className="me-2" />
                          Export as Excel
                        </button>
                      </li>
                    </ul>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="card bg-light mb-4">
            <div className="card-body">
              <h6 className="mb-3 d-flex align-items-center">
                <Icon
                  icon="heroicons:magnifying-glass"
                  width="18"
                  className="me-2"
                />
                Filter Components
              </h6>

              <div className="row g-3">
                {/* Category */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label className="form-label small">Category</label>
                  <select
                    className="form-select form-select-sm"
                    value={componentFilters.category}
                    onChange={(e) =>
                      setComponentFilters({
                        ...componentFilters,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Categories</option>
                    <option value="earnings">Earnings</option>
                    <option value="deductions">Deductions</option>
                    <option value="employer_contributions">
                      Employer Contributions
                    </option>
                    <option value="reimbursements">Reimbursements</option>
                  </select>
                </div>

                {/* Type */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label className="form-label small">Type</label>
                  <select
                    className="form-select form-select-sm"
                    value={componentFilters.type}
                    onChange={(e) =>
                      setComponentFilters({
                        ...componentFilters,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Types</option>
                    <option value="fixed">Fixed</option>
                    <option value="variable">Variable</option>
                  </select>
                </div>

                {/* Taxable */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label className="form-label small">Taxable</label>
                  <select
                    className="form-select form-select-sm"
                    value={componentFilters.taxable}
                    onChange={(e) =>
                      setComponentFilters({
                        ...componentFilters,
                        taxable: e.target.value,
                      })
                    }
                  >
                    <option value="all">All</option>
                    <option value="taxable">Taxable</option>
                    <option value="non_taxable">Non-Taxable</option>
                  </select>
                </div>

                {/* Statutory */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label className="form-label small">Statutory</label>
                  <select
                    className="form-select form-select-sm"
                    value={componentFilters.statutory}
                    onChange={(e) =>
                      setComponentFilters({
                        ...componentFilters,
                        statutory: e.target.value,
                      })
                    }
                  >
                    <option value="all">All</option>
                    <option value="statutory">Statutory</option>
                    <option value="non_statutory">Non-Statutory</option>
                  </select>
                </div>

                {/* Calculation */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label className="form-label small">Calculation</label>
                  <select
                    className="form-select form-select-sm"
                    value={componentFilters.calculation}
                    onChange={(e) =>
                      setComponentFilters({
                        ...componentFilters,
                        calculation: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Calculations</option>
                    <option value="flat">Flat Amount</option>
                    <option value="percentage_of_base">% of Base</option>
                    <option value="percentage_of_gross">% of Gross</option>
                    <option value="percentage_of_ctc">% of CTC</option>
                  </select>
                </div>

                {/* Pro-rata */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label className="form-label small">Pro-rata</label>
                  <select
                    className="form-select form-select-sm"
                    value={componentFilters.proRata}
                    onChange={(e) =>
                      setComponentFilters({
                        ...componentFilters,
                        proRata: e.target.value,
                      })
                    }
                  >
                    <option value="all">All</option>
                    <option value="proRata">Pro-rata</option>
                    <option value="no_proRata">No Pro-rata</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <label className="form-label small">Status</label>
                  <select
                    className="form-select form-select-sm"
                    value={componentFilters.status}
                    onChange={(e) =>
                      setComponentFilters({
                        ...componentFilters,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="all">All</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-end">
                  <button
                    className="close-btn w-100 text-center"
                    onClick={() =>
                      setComponentFilters({
                        category: "all",
                        type: "all",
                        taxable: "all",
                        statutory: "all",
                        calculation: "all",
                        proRata: "all",
                        status: "active",
                      })
                    }
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Components */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-primary mb-0 d-flex align-items-center">
                <Icon icon="heroicons:banknotes" width="18" className="me-2" />
                Earnings Components ({filteredEarnings.length})
              </h6>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="create-job-btn"
                  onClick={() =>
                    handleExportCategoryPDF("earnings", filteredEarnings)
                  }
                  title="Export Earnings to PDF"
                >
                  <Icon icon="heroicons:arrow-down-tray" width="14" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th width="15%">Component Name</th>
                    <th width="10%">Type</th>
                    <th width="10%">Taxable</th>
                    <th width="10%">Statutory</th>
                    <th width="15%">Calculation</th>
                    <th width="10%">Value</th>
                    <th width="10%">Base</th>
                    <th width="10%">Pro-rata</th>
                    <th width="10%">Rounding</th>
                    <th width="10%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEarnings.map((comp) => (
                    <tr
                      key={comp.id}
                      className={comp.isActive ? "" : "text-muted"}
                    >
                      <td>
                        <div className="fw-medium">{comp.name}</div>
                        <div className="small text-muted">
                          {comp.description}
                        </div>
                        {comp.statutoryReference && (
                          <div className="small text-info">
                            {comp.statutoryReference}
                          </div>
                        )}
                      </td>
                      <td>{getComponentTypeBadge(comp.type)}</td>
                      <td>{getTaxableBadge(comp.taxable)}</td>
                      <td>{getStatutoryBadge(comp.statutory)}</td>
                      <td>{getCalculationBadge(comp.calculation)}</td>
                      <td className="fw-semibold">{formatValue(comp)}</td>
                      <td>
                        <span className="small">{formatBase(comp)}</span>
                      </td>
                      <td>{getProRataBadge(comp.proRata)}</td>
                      <td>{getRoundingBadge(comp.rounding)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          {/* View Button */}
                          <button
                            className="btn btn-sm btn-outline-info"
                            title="View Details"
                            onClick={() => handleViewComponent(comp)}
                          >
                            <Eye size={14} />
                          </button>

                          {/* Edit Button */}
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Edit"
                            onClick={() => {
                              setSelectedComponent(comp);
                              setShowComponentModal(true);
                            }}
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Download Button - PDF */}
                          <button
                            className="btn btn-sm btn-outline-success"
                            title="Download PDF"
                            onClick={() => handleExportSinglePDF(comp)}
                          >
                            <Download size={14} />
                          </button>

                          {/* Delete Button */}
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => handleDeleteComponent(comp)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deductions Components */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-danger mb-0 d-flex align-items-center">
                <Icon
                  icon="heroicons:arrow-trending-down"
                  width="18"
                  className="me-2"
                />
                Deduction Components ({filteredDeductions.length})
              </h6>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="cancel-btn d-flex align-items-center gap-1"
                  onClick={() =>
                    handleExportCategoryPDF("deductions", filteredDeductions)
                  }
                  title="Export Deductions to PDF"
                >
                  <Icon icon="heroicons:arrow-down-tray" width="14" />
                  Download
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th width="15%">Component Name</th>
                    <th width="10%">Type</th>
                    <th width="10%">Taxable</th>
                    <th width="10%">Statutory</th>
                    <th width="15%">Calculation</th>
                    <th width="10%">Value</th>
                    <th width="10%">Base</th>
                    <th width="10%">Pro-rata</th>
                    <th width="10%">Rounding</th>
                    <th width="10%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeductions.map((comp) => (
                    <tr
                      key={comp.id}
                      className={comp.isActive ? "" : "text-muted"}
                    >
                      <td>
                        <div className="fw-medium">{comp.name}</div>
                        <div className="small text-muted">
                          {comp.description}
                        </div>
                        {comp.statutoryReference && (
                          <div className="small text-info">
                            {comp.statutoryReference}
                          </div>
                        )}
                      </td>
                      <td>{getComponentTypeBadge(comp.type)}</td>
                      <td>{getTaxableBadge(comp.taxable)}</td>
                      <td>{getStatutoryBadge(comp.statutory)}</td>
                      <td>{getCalculationBadge(comp.calculation)}</td>
                      <td className="fw-semibold">{formatValue(comp)}</td>
                      <td>
                        <span className="small">{formatBase(comp)}</span>
                      </td>
                      <td>{getProRataBadge(comp.proRata)}</td>
                      <td>{getRoundingBadge(comp.rounding)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          {/* View Button */}
                          <button
                            className="btn btn-sm btn-outline-info"
                            title="View Details"
                            onClick={() => handleViewComponent(comp)}
                          >
                            <Eye size={14} />
                          </button>

                          {/* Edit Button */}
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Edit"
                            onClick={() => {
                              setSelectedComponent(comp);
                              setShowComponentModal(true);
                            }}
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Download Button - PDF */}
                          <button
                            className="btn btn-sm btn-outline-success"
                            title="Download PDF"
                            onClick={() => handleExportSinglePDF(comp)}
                          >
                            <Download size={14} />
                          </button>

                          {/* Delete Button */}
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => handleDeleteComponent(comp)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Other Components Grid */}
          <div className="row">
            {/* Employer Contributions */}
            <div className="col-lg-6 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-info mb-0 d-flex align-items-center">
                  <Icon
                    icon="heroicons:building-office-2"
                    width="18"
                    className="me-2"
                  />
                  Employer Contributions ({filteredEmployerContributions.length}
                  )
                </h6>
                <button
                  className="read-modules-btn d-flex align-items-center gap-1"
                  onClick={() =>
                    handleExportCategoryPDF(
                      "employer_contributions",
                      filteredEmployerContributions,
                    )
                  }
                  title="Export Employer Contributions to PDF"
                >
                  <Icon icon="heroicons:arrow-down-tray" width="14" />
                  Download
                </button>
              </div>

              <div className="list-group">
                {filteredEmployerContributions.map((comp) => (
                  <div
                    key={comp.id}
                    className={`list-group-item ${!comp.isActive ? "text-muted" : ""}`}
                  >
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                      {/* Content */}
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <span className="fw-medium">{comp.name}</span>
                          {getComponentTypeBadge(comp.type)}
                          {getStatutoryBadge(comp.statutory)}
                        </div>

                        <div className="small text-muted mb-1">
                          {comp.description}
                        </div>

                        <div className="d-flex gap-3 flex-wrap">
                          <span className="small">
                            <strong>Value:</strong> {formatValue(comp)}
                          </span>
                          <span className="small">
                            <strong>Base:</strong> {formatBase(comp)}
                          </span>
                          <span className="small">
                            <strong>Pro-rata:</strong>{" "}
                            {comp.proRata ? "Yes" : "No"}
                          </span>
                          <span className="small">
                            <strong>Rounding:</strong>{" "}
                            {getRoundingBadge(comp.rounding)}
                          </span>
                        </div>

                        {comp.statutoryReference && (
                          <div className="small text-info mt-1">
                            {comp.statutoryReference}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-1 align-self-start align-self-md-center">
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="View Details"
                          onClick={() => handleViewComponent(comp)}
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Edit"
                          onClick={() => {
                            setSelectedComponent(comp);
                            setShowComponentModal(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-success"
                          title="Download PDF"
                          onClick={() => handleExportSinglePDF(comp)}
                        >
                          <Download size={14} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDeleteComponent(comp)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reimbursements */}
            <div className="col-lg-6 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-success mb-0 d-flex align-items-center gap-1">
                  <Icon icon="heroicons:arrow-path" width="16" />
                  Reimbursements ({filteredReimbursements.length})
                </h6>
                <button
                  className="add-employee "
                  onClick={() =>
                    handleExportCategoryPDF(
                      "reimbursements",
                      filteredReimbursements,
                    )
                  }
                  title="Export Reimbursements to PDF"
                >
                  <Icon icon="heroicons:arrow-down-tray" width="14" />
                  Download
                </button>
              </div>

              <div className="list-group">
                {filteredReimbursements.map((comp) => (
                  <div
                    key={comp.id}
                    className={`list-group-item ${!comp.isActive ? "text-muted" : ""}`}
                  >
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <span className="fw-medium">{comp.name}</span>
                          {getComponentTypeBadge(comp.type)}
                          {getTaxableBadge(comp.taxable)}
                        </div>

                        <div className="small text-muted mb-1">
                          {comp.description}
                        </div>

                        <div className="d-flex gap-3 flex-wrap">
                          <span className="small">
                            <strong>Value:</strong> {formatValue(comp)}
                          </span>
                          <span className="small">
                            <strong>Base:</strong> {formatBase(comp)}
                          </span>
                          <span className="small">
                            <strong>Pro-rata:</strong>{" "}
                            {comp.proRata ? "Yes" : "No"}
                          </span>
                          <span className="small">
                            <strong>Proof Required:</strong>{" "}
                            {comp.requiresProof ? "Yes" : "No"}
                          </span>
                        </div>

                        {comp.taxExemptLimit && (
                          <div className="small text-success mt-1">
                            Tax exempt up to ₹
                            {comp.taxExemptLimit.toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-1 align-self-start align-self-md-center">
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="View Details"
                          onClick={() => handleViewComponent(comp)}
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Edit"
                          onClick={() => {
                            setSelectedComponent(comp);
                            setShowComponentModal(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-success"
                          title="Download PDF"
                          onClick={() => handleExportSinglePDF(comp)}
                        >
                          <Download size={14} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDeleteComponent(comp)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Component Statistics */}
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="mb-3 d-flex align-items-center">
                <Icon icon="heroicons:chart-bar" width="18" className="me-2" />{" "}
                Component Statistics
              </h6>
              <div className="row">
                <div className="col-md-3 col-6 mb-3">
                  <div className="text-center">
                    <div className="fs-4 fw-bold text-primary">
                      {components.earnings.length}
                    </div>
                    <div className="small text-muted">Earnings Components</div>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-3">
                  <div className="text-center">
                    <div className="fs-4 fw-bold text-danger">
                      {components.deductions.length}
                    </div>
                    <div className="small text-muted">Deduction Components</div>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-3">
                  <div className="text-center">
                    <div className="fs-4 fw-bold text-info">
                      {components.employerContributions.length}
                    </div>
                    <div className="small text-muted">
                      Employer Contributions
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-3">
                  <div className="text-center">
                    <div className="fs-4 fw-bold text-success">
                      {components.reimbursements.length}
                    </div>
                    <div className="small text-muted">Reimbursements</div>
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <div className="small text-muted">
                    <strong>Statutory Components:</strong>{" "}
                    {
                      Object.values(components)
                        .flat()
                        .filter((c) => c.statutory).length
                    }
                  </div>
                  <div className="small text-muted">
                    <strong>Taxable Components:</strong>{" "}
                    {
                      Object.values(components)
                        .flat()
                        .filter((c) => c.taxable).length
                    }
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="small text-muted">
                    <strong>Fixed Components:</strong>{" "}
                    {
                      Object.values(components)
                        .flat()
                        .filter((c) => c.type === "fixed").length
                    }
                  </div>
                  <div className="small text-muted">
                    <strong>Variable Components:</strong>{" "}
                    {
                      Object.values(components)
                        .flat()
                        .filter((c) => c.type === "variable").length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Now update your renderTemplatesTab function to use the state from the main component:
  const renderTemplatesTab = () => {
    // Enhanced calculation breakdown with all fields
    const calculateBreakdown = (structure) => {
      if (!structure) return null;

      const basic = (structure.ctc || 0) * 0.4;
      const hra = basic * 0.5;
      const conveyance = 19200;
      const specialAllowance = (structure.ctc || 0) * 0.2 - conveyance;

      // Safely access standardDeductions
      const standardDeductions = structure.standardDeductions || {
        pf: { enabled: true, employee: 12, employer: 12 },
        esi: { enabled: false, employee: 0.75, employer: 3.25 },
        professionalTax: { enabled: true, amount: 200 },
        tds: { enabled: false },
      };

      const pf =
        basic *
        (standardDeductions.pf?.enabled
          ? standardDeductions.pf.employee / 100
          : 0);
      const esi = standardDeductions.esi?.enabled
        ? (basic + hra + conveyance + specialAllowance) *
          (standardDeductions.esi.employee / 100)
        : 0;
      const professionalTax = standardDeductions.professionalTax?.enabled
        ? standardDeductions.professionalTax.amount
        : 0;

      // Calculate taxable income
      const taxableIncome = basic + hra + conveyance + specialAllowance;
      const standardDeduction = 50000;
      const tds = standardDeductions.tds?.enabled
        ? Math.max(0, (taxableIncome - standardDeduction) * 0.1)
        : 0;

      // Employer contributions
      const employerPf =
        basic *
        (standardDeductions.pf?.enabled
          ? standardDeductions.pf.employer / 100
          : 0);
      const employerEsi = standardDeductions.esi?.enabled
        ? (basic + hra + conveyance + specialAllowance) *
          (standardDeductions.esi.employer / 100)
        : 0;

      // Calculations
      const gross = basic + hra + conveyance + specialAllowance;
      const employeeDeductions = pf + esi + professionalTax + tds;
      const takeHome = gross - employeeDeductions;
      const employerCost = (structure.ctc || 0) + employerPf + employerEsi;
      const ctcVsTakeHome =
        structure.ctc > 0
          ? ((takeHome / structure.ctc) * 100).toFixed(1)
          : "0.0";

      return {
        basic,
        hra,
        conveyance,
        specialAllowance,
        pf,
        esi,
        professionalTax,
        tds,
        employerPf,
        employerEsi,
        gross,
        employeeDeductions,
        takeHome,
        employerCost,
        ctcVsTakeHome,
        annualTakeHome: takeHome * 12,
        annualEmployerCost: employerCost * 12,
      };
    };

    // Enhanced status badge
    const getStatusBadged = (status) => {
      const styles = {
        active: "bg-success-subtle text-success border-success-subtle",
        draft: "bg-warning-subtle text-warning border-warning-subtle",
        inactive: "bg-secondary-subtle text-secondary border-secondary-subtle",
        archived: "bg-dark-subtle text-dark border-dark-subtle",
      };

      const icons = {
        active: <CheckCircle size={12} />,
        draft: <Edit2 size={12} />,
        inactive: <Clock size={12} />,
        archived: <FileText size={12} />,
      };

      return (
        <span
          className={`badge border d-inline-flex align-items-center gap-1 ${
            styles[status] || "bg-light"
          }`}
        >
          {icons[status]}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    };

    // Approval status badge
    const getApprovalBadge = (status) => {
      const styles = {
        approved: "bg-success-subtle text-success border-success-subtle",
        pending: "bg-warning-subtle text-warning border-warning-subtle",
        rejected: "bg-danger-subtle text-danger border-danger-subtle",
        draft: "bg-info-subtle text-info border-info-subtle",
      };

      return (
        <span className={`badge border small ${styles[status] || "bg-light"}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    };

    // Filter structures
    const filteredStructures = structures.filter((structure) => {
      if (
        structureFilters.status !== "all" &&
        structure.status !== structureFilters.status
      )
        return false;
      if (
        structureFilters.category !== "all" &&
        structure.category !== structureFilters.category
      )
        return false;
      if (
        structureFilters.grade !== "all" &&
        structure.grade !== structureFilters.grade
      )
        return false;
      if (
        structureFilters.department !== "all" &&
        !structure.department.includes(structureFilters.department)
      )
        return false;
      if (
        structureFilters.location !== "all" &&
        !structure.location.includes(structureFilters.location)
      )
        return false;
      return true;
    });

    // Function to handle view structure
    const handleViewStructure = (structure) => {
      console.log("Viewing structure:", structure.name);
      setSelectedStructure(structure);
      setShowViewModal(true);
    };

    // Function to handle edit structure
    const handleEditStructure = (structure) => {
      console.log("Editing structure:", structure.name);
      setSelectedStructure(structure);
      setShowEditModal(true);
    };

    // Function to handle delete structure - FIXED VERSION
    // Function to handle delete structure - SILENT VERSION (with employee removal)
    const handleDeleteStructure = (structure) => {
      // If structure has employees, we need to handle that too
      if (structure.employeeCount > 0) {
        // Remove assignments for this structure
        const updatedAssignments = assignments.filter(
          (a) => a.currentStructure !== structure.name,
        );
        setAssignments(updatedAssignments);

        // Update other structures that might reference this one
        const updatedStructures = structures
          .map((s) => {
            if (s.parentVersion === structure.version) {
              return {
                ...s,
                parentVersion: null,
              };
            }
            return s;
          })
          .filter((s) => s.id !== structure.id);

        setStructures(updatedStructures);
      } else {
        // Simple delete for structures without employees
        const updatedStructures = structures.filter(
          (s) => s.id !== structure.id,
        );
        setStructures(updatedStructures);
      }

      // Clear selection if deleted structure was selected
      if (selectedStructure?.id === structure.id) {
        setSelectedStructure(null);
      }

      console.log("Structure deleted silently:", structure.name);
    };

    // Function to toggle structure status
    const handleToggleStatus = (structure) => {
      const newStatus = structure.status === "active" ? "inactive" : "active";
      const updatedStructures = structures.map((s) =>
        s.id === structure.id
          ? {
              ...s,
              status: newStatus,
              lastModified: new Date().toISOString().split("T")[0],
              lastModifiedBy: "Current User",
            }
          : s,
      );

      setStructures(updatedStructures);

      // Use React state for notification
      setActionNotification({
        show: true,
        type: "success",
        title: "Status Updated",
        message: `Structure "${structure.name}" is now ${newStatus}.`,
      });
    };

    // Quick Actions Menu Component - FIXED VERSION
    const QuickActionsMenu = ({ structure }) => {
      const [showMenu, setShowMenu] = useState(false);
      const menuRef = useRef(null);

      useEffect(() => {
        const handleClickOutside = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      return (
        <div className="position-relative" ref={menuRef}>
          <button
            className="btn btn-sm btn-light border"
            onClick={() => setShowMenu(!showMenu)}
            title="More Actions"
          >
            <MoreVertical size={14} />
          </button>

          {showMenu && (
            <div
              className="position-absolute end-0 mt-1 bg-white border rounded shadow z-3"
              style={{ minWidth: "220px" }}
            >
              <div className="p-2">
                <button
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => {
                    handleEditStructure(structure);
                    setShowMenu(false);
                  }}
                >
                  <Edit2 size={14}  />
                  Edit Structure
                </button>

                <button
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => {
                    handleToggleStatus(structure);
                    setShowMenu(false);
                  }}
                >
                  {structure.status === "active" ? (
                    <>
                      <XCircle size={14} className="me-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} className="me-2" />
                      Activate
                    </>
                  )}
                </button>

                {/* Download Buttons Section */}
                <div className="dropdown-divider"></div>

                <div className="small text-muted px-3 py-1">Download</div>

                <button
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => {
                    handleExportSingleStructurePDF(structure);
                    setShowMenu(false);
                  }}
                  title="Download as PDF"
                >
                  <FileText size={14} className="me-2 text-danger" />
                  Download PDF
                </button>

                <button
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => {
                    handleExportSingleStructureExcel(structure);
                    setShowMenu(false);
                  }}
                  title="Download as Excel"
                >
                  <BarChart size={14} className="me-2 text-success" />
                  Download Excel
                </button>

                <div className="dropdown-divider my-1"></div>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="card border shadow-none mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="col-12 col-md-auto">
              <h5 className="mb-0 d-flex align-items-center">
                <FileText size={18} className="me-2" />
                Salary Structure Templates
              </h5>
              <p className="text-muted small mb-0">
                Create, manage, and assign salary structure templates
              </p>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2 align-items-stretch">
              <button
                className="create-job-btn"
                onClick={() => setShowCreatePanel(true)}
              >
                <Plus size={16} className="me-2 flex-shrink-0" />
                Create Template
              </button>

              <button
                className="add-assignment-btn"
                type="button"
                onClick={handleExportStructuresPDF}
              >
                <Download size={16} className="me-2 flex-shrink-0" />
                Export
              </button>

              <button
                className="extend-probation-btn  d-flex align-items-center justify-content-center w-100 w-sm-auto"
                onClick={() => setShowSimulationPanel(true)}
              >
                <Calculator size={16} className="me-2 flex-shrink-0" />
                Simulation
              </button>

              <button
                className="cancel-btn d-flex align-items-center justify-content-center w-100 w-sm-auto"
                onClick={() => setShowVersionModal(true)}
              >
                <History size={16} className="me-2 flex-shrink-0" />
                Versions
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="card bg-light mb-4">
            <div className="card-body">
              <h6 className="mb-3 d-flex align-items-center">
                <Icon
                  icon="heroicons:magnifying-glass"
                  width="18"
                  className="me-2"
                />
                Filter Structures
              </h6>

              <div className="row g-3">
                {/* Status */}
                <div className="col-12 col-sm-6 col-md-2">
                  <label className="form-label small">Status</label>
                  <select
                    className="form-select form-select-sm"
                    value={structureFilters.status}
                    onChange={(e) =>
                      setStructureFilters({
                        ...structureFilters,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Category */}
                <div className="col-12 col-sm-6 col-md-2">
                  <label className="form-label small">Category</label>
                  <select
                    className="form-select form-select-sm"
                    value={structureFilters.category}
                    onChange={(e) =>
                      setStructureFilters({
                        ...structureFilters,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Categories</option>
                    <option value="permanent">Permanent</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>

                {/* Grade */}
                <div className="col-12 col-sm-6 col-md-2">
                  <label className="form-label small">Grade</label>
                  <select
                    className="form-select form-select-sm"
                    value={structureFilters.grade}
                    onChange={(e) =>
                      setStructureFilters({
                        ...structureFilters,
                        grade: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Grades</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                    <option value="D">Grade D</option>
                    <option value="CT">Contract</option>
                    <option value="IN">Intern</option>
                  </select>
                </div>

                {/* Department */}
                <div className="col-12 col-sm-6 col-md-3">
                  <label className="form-label small">Department</label>
                  <select
                    className="form-select form-select-sm"
                    value={structureFilters.department}
                    onChange={(e) =>
                      setStructureFilters({
                        ...structureFilters,
                        department: e.target.value,
                      })
                    }
                  >
                    <option value="all">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="col-12 col-sm-6 col-md-3 d-flex align-items-end">
                  <button
                    className="btn btn-sm btn-outline-secondary w-100"
                    onClick={() =>
                      setStructureFilters({
                        status: "all",
                        category: "all",
                        grade: "all",
                        department: "all",
                        location: "all",
                      })
                    }
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Structure Statistics */}
          <div className="row mb-4 g-4">
            {/* Total Structures */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card bg-primary-subtle border-primary-subtle h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="mb-0 text-primary">Total Structures</h4>
                      <h4 className="mb-0">{structures.length}</h4>
                    </div>
                    <Layers size={32} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Structures */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card bg-success-subtle border-success-subtle h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="mb-0 text-success">Active Structures</h4>
                      <h4 className="mb-0">
                        {structures.filter((s) => s.status === "active").length}
                      </h4>
                    </div>
                    <CheckCircle size={32} className="text-success" />
                  </div>
                </div>
              </div>
            </div>

            {/* Draft Structures */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card bg-info-subtle border-info-subtle h-100">
                <div className="card-body p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="mb-0 text-info">Draft Structures</h4>
                      <h4 className="mb-0">
                        {structures.filter((s) => s.status === "draft").length}
                      </h4>
                    </div>
                    <Edit2 size={32} className="text-info" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Structure Templates Grid */}
          <div className="row">
            {filteredStructures.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-5 px-3">
                  <FileText size={48} className="text-muted mb-3" />
                  <h5>No structures found</h5>
                  <p className="text-muted">
                    Try adjusting your filters or create a new structure
                  </p>
                  <button
                    className="btn btn-primary w-100 w-sm-auto"
                    onClick={() => setShowCreatePanel(true)}
                  >
                    <Plus size={16} className="me-2" />
                    Create New Structure
                  </button>
                </div>
              </div>
            ) : (
              filteredStructures.map((structure) => {
                const breakdown = calculateBreakdown(structure);
                return (
                  <div
                    key={structure.id}
                    className="col-12 col-sm-6 col-lg-4 mb-4"
                  >
                    <div
                      className={`card h-100 ${
                        selectedStructure?.id === structure.id
                          ? "border-primary"
                          : ""
                      }`}
                    >
                      <div className="card-body d-flex flex-column">
                        {/* Card Header */}
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start mb-3 gap-2">
                          <div>
                            <h6 className="card-title mb-1">
                              {structure.name}
                            </h6>
                            <div className="d-flex gap-1 align-items-center mb-2 flex-wrap">
                              <span className="badge bg-light text-dark border">
                                Grade {structure.grade}
                              </span>
                              <span className="badge bg-light text-dark border small">
                                L{structure.level || "N/A"}
                              </span>
                              <span className="badge bg-light text-dark border small">
                                {(structure.category || "N/A")
                                  .charAt(0)
                                  .toUpperCase() +
                                  (structure.category || "N/A").slice(1)}
                              </span>
                              <span className="badge bg-light text-dark border small">
                                v{(structure.version || "v1.0").substring(1)}
                              </span>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-1">
                            {getStatusBadged(structure.status)}
                            <QuickActionsMenu structure={structure} />
                          </div>
                        </div>

                        {/* Structure Details */}
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">Annual CTC</span>
                            <span className="fw-bold">
                              ₹{(structure.ctc || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">Take-Home</span>
                            <span className="fw-bold text-success">
                              ₹{(breakdown?.takeHome || 0).toLocaleString()}
                              /month
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">
                              Employer Cost
                            </span>
                            <span className="fw-bold text-warning">
                              ₹{(breakdown?.employerCost || 0).toLocaleString()}
                              /month
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted small">
                              CTC vs Take-Home
                            </span>
                            <span className="fw-bold text-info">
                              {breakdown?.ctcVsTakeHome || "0.0"}%
                            </span>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                          <div className="d-flex align-items-center">
                            <Users size={14} className="me-1 text-muted" />
                            <span className="small text-muted">
                              {structure.employeeCount || 0} employees
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            <Calendar size={14} className="me-1 text-muted" />
                            <span className="small text-muted">
                              {structure.effectiveDate || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="small text-muted d-flex align-items-center gap-2 flex-wrap">
                            <span className="d-flex align-items-center">
                              <Icon
                                icon="heroicons:map-pin"
                                width="14"
                                className="me-1"
                              />
                              {structure.location?.length || 0} locations
                            </span>

                            <span>·</span>

                            <span className="d-flex align-items-center">
                              <Icon
                                icon="heroicons:building-office-2"
                                width="14"
                                className="me-1"
                              />
                              {structure.department?.length || 0} depts
                            </span>
                          </div>
                          {getApprovalBadge(structure.approvalStatus)}
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-1 mt-auto justify-content-end">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewStructure(structure)}
                          >
                            <Eye size={14} className="me-1" />
                          </button>

                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleEditStructure(structure)}
                          >
                            <Edit2 size={14} className="me-1" />
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteStructure(structure)}
                          >
                            <Trash2 size={14} className="me-1" />
                            {/* Delete */}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAssignmentTab = () => {
    // Function to handle Change Structure button
    const handleChangeStructure = (employee) => {
      setEmployeeToChange(employee);
      setShowChangeStructure(true);
    };

    // Function to handle Individual Assignment
    const handleIndividualAssignment = () => {
      setShowIndividualAssignModal(true);
    };

    return (
      <div className="card border shadow-none mb-4">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
            {/* Title */}
            <h5 className="mb-0 d-flex align-items-center">
              <Users size={18} className="me-2 flex-shrink-0" />
              Structure Assignment
            </h5>

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                className="create-job-btn"
                onClick={handleIndividualAssignment}
              >
                <User size={16} className="me-2 flex-shrink-0" />
                Individual Assignment
              </button>

              <button
                className="add-employee"
                onClick={handleExportAssignmentsPDF}
                title="Export Assignments to PDF"
              >
                <Download size={16} className="me-2 flex-shrink-0" />
                Export
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th width="10%" className="ps-3">
                    Employee ID
                  </th>
                  <th width="15%">Name</th>
                  <th width="8%">Department</th>
                  <th width="8%">Grade</th>
                  <th width="15%">Current Structure</th>
                  <th width="12%">Allocation</th>
                  <th width="10%">CTC</th>
                  <th width="10%">Take-Home</th>
                  <th width="8%">Effective Date</th>
                  <th width="4%" className="pe-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="ps-3">
                      <div className="fw-medium">{assignment.employeeId}</div>
                      <div className="small text-muted">
                        {assignment.employeeType || "Permanent"}
                      </div>
                    </td>
                    <td>
                      <div
                        className="fw-medium text-truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        {assignment.name}
                      </div>
                      {assignment.email && (
                        <div
                          className="small text-muted text-truncate"
                          style={{ maxWidth: "150px" }}
                        >
                          {assignment.email}
                        </div>
                      )}
                      {assignment.location && (
                       <div className="small text-muted d-flex align-items-center">
                         <Icon icon="heroicons:map-pin" width="14" className="me-1" />
                          {assignment.location}</div>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-info border">
                        {assignment.department}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border">
                        Grade {assignment.grade}
                      </span>
                      {assignment.level && (
                        <div className="small text-muted mt-1">
                          {assignment.level}
                        </div>
                      )}
                    </td>
                    <td>
                      <div
                        className="fw-medium text-truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        {assignment.currentStructure}
                      </div>
                      {assignment.structureVersion && (
                        <div className="small text-muted">
                          v{assignment.structureVersion.substring(1)}
                        </div>
                      )}
                      {assignment.assignmentStatus && (
                        <div className="mt-1">
                          <span
                            className={`badge small ${assignment.assignmentStatus === "active" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}
                          >
                            {assignment.assignmentStatus}
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {/* Allocation Rules Display */}
                        {assignment.allocationRules?.type === "auto" ? (
                          <span className="badge bg-success-subtle text-success border small d-flex align-items-center">
                            <Settings
                              size={10}
                              className="me-1 flex-shrink-0"
                            />
                            <span className="text-truncate">Auto</span>
                          </span>
                        ) : assignment.allocationRules?.type === "manual" ? (
                          <span className="badge bg-warning-subtle text-warning border small d-flex align-items-center">
                            <User size={10} className="me-1 flex-shrink-0" />
                            <span className="text-truncate">Manual</span>
                          </span>
                        ) : assignment.allocationRules?.type === "bulk" ? (
                          <span className="badge bg-info-subtle text-info border small d-flex align-items-center">
                            <Users size={10} className="me-1 flex-shrink-0" />
                            <span className="text-truncate">Bulk</span>
                          </span>
                        ) : (
                          <span className="badge bg-secondary-subtle text-secondary border small">
                            Not Set
                          </span>
                        )}

                        {/* Custom Rules Indicator */}
                        {assignment.allocationRules?.hasCustomRules && (
                          <span className="badge bg-primary-subtle text-primary border small">
                            Custom
                          </span>
                        )}

                        {/* Pro-rata Rules */}
                        {assignment.allocationRules?.proRata && (
                          <span className="badge bg-light text-dark border small">
                            Pro-rata
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold">
                        ₹{assignment.ctc.toLocaleString()}
                      </div>
                      {assignment.grossSalary && (
                        <div className="small text-muted">
                          Gross: ₹{assignment.grossSalary.toLocaleString()}
                        </div>
                      )}
                      {assignment.assignmentType && (
                        <div className="small text-muted">
                          {assignment.assignmentType === "initial" && "Initial"}
                          {assignment.assignmentType === "revision" &&
                            "Revision"}
                          {assignment.assignmentType === "promotion" &&
                            "Promotion"}
                          {assignment.assignmentType === "transfer" &&
                            "Transfer"}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold text-success">
                        ₹{assignment.takeHome.toLocaleString()}
                      </div>
                      <div className="small text-muted">/month</div>
                      {assignment.annualTakeHome && (
                        <div className="small text-muted">
                          Annual: ₹{assignment.annualTakeHome.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <div className="small">{assignment.effectiveDate}</div>
                        {assignment.createdOn && (
                          <div className="small text-muted">
                            Created:{" "}
                            {assignment.createdOn
                              .split("-")
                              .reverse()
                              .join("/")}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="pe-3">
                      <div className="d-flex gap-1">
                        {/* Edit/Change Structure Button */}
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleChangeStructure(assignment)}
                          title="Change Salary Structure"
                        >
                          <Edit2 size={14} />
                        </button>

                        {/* View Details Button */}
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() =>
                            handleViewAssignmentDetails(assignment)
                          }
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>

                        {/* Download PDF Button */}
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() =>
                            handleDownloadAssignmentPDF(assignment)
                          }
                          title="Download PDF Report"
                        >
                          <Download size={14} />
                        </button>

                        {/* Delete Button */}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteAssignment(assignment)}
                          title="Delete Assignment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add this function to handle PDF export */}
          {assignments.length === 0 && (
            <div className="text-center py-5">
              <div className="text-muted">
                <Users size={48} className="mb-3" />
                <h5>No Assignments Found</h5>
                <p>Start by assigning salary structures to employees</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Main content area - aligned with sidebar */}
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        {/* Header Card - Now properly placed */}
        <div
          className="card border-0 shadow-sm mb-4"
          style={{ borderRadius: "0" }}
        >
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
                  <Icon icon="heroicons:cog-6-tooth" /> Salary Structure
                  Management
                </h5>
                <p className="text-muted small mb-0">
                  Manage CTC structures, components, and employee assignments
                </p>
              </div>
            </div>
            {/* KPI Statistics */}
            <div className="kpi-row">
              {[
                {
                  title: "Total Structures",
                  value: structures.length,
                  icon: "heroicons:squares-2x2",
                  bg: "kpi-primary",
                  color: "kpi-primary-text",
                  sub1: `Active: ${structures.filter((s) => s.status === "active").length}`,
                  sub2: `Draft: ${structures.filter((s) => s.status === "draft").length}`,
                },
                {
                  title: "Active Assignments",
                  value: assignments.filter(
                    (a) => a.assignmentStatus === "active",
                  ).length,
                  icon: "heroicons:user-group",
                  bg: "kpi-success",
                  color: "kpi-success-text",
                  sub1: `Total: ${assignments.length}`,
                  sub2: `Pending: ${
                    assignments.filter((a) => a.assignmentStatus === "pending")
                      .length
                  }`,
                },
                {
                  title: "Total Components",
                  value:
                    components.earnings.length +
                    components.deductions.length +
                    components.employerContributions.length +
                    components.reimbursements.length,
                  icon: "heroicons:chart-bar",
                  bg: "kpi-warning",
                  color: "kpi-warning-text",
                  sub1: `Active: ${
                    Object.values(components)
                      .flat()
                      .filter((c) => c.isActive).length
                  }`,
                  sub2: `Inactive: ${
                    Object.values(components)
                      .flat()
                      .filter((c) => !c.isActive).length
                  }`,
                },
              ].map((item, index) => (
                <div className="kpi-col" key={index}>
                  <div className="kpi-card">
                    <div className="kpi-card-body">
                      {/* Icon */}
                      <div className={`kpi-icon ${item.bg}`}>
                        <Icon
                          icon={item.icon}
                          className={`kpi-icon-style ${item.color}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="kpi-content">
                        <div className="kpi-title">{item.title}</div>
                        <div className="kpi-value">{item.value}</div>

                        {/* Sub statistics */}
                        <div className="kpi-sub">
                          <small className="text-muted d-block">
                            {item.sub1}
                          </small>
                          <small className="text-muted d-block">
                            {item.sub2}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="col-12 mb-4 border-light">
              <div className="d-flex border-bottom overflow-auto">
                {/* Components Master */}
                <button
                  type="button"
                  onClick={() => setActiveTab("components")}
                  className={`btn btn-link text-decoration-none py-3 px-4 d-flex align-items-center gap-2 flex-shrink-0 ${
                    activeTab === "components"
                      ? "border-bottom-2 bg-primary text-light fw-semibold"
                      : "text-muted"
                  }`}
                >
                  <Layers size={18} />
                  <span>Components Master</span>
                </button>

                {/* Structure Templates */}
                <button
                  type="button"
                  onClick={() => setActiveTab("templates")}
                  className={`btn btn-link text-decoration-none py-3 px-4 d-flex align-items-center gap-2 flex-shrink-0 ${
                    activeTab === "templates"
                      ? "border-bottom-2 bg-primary text-light fw-semibold"
                      : "text-muted"
                  }`}
                >
                  <FileText size={18} />
                  <span>Structure Templates</span>
                </button>

                {/* Structure Assignment */}
                <button
                  type="button"
                  onClick={() => setActiveTab("assignment")}
                  className={`btn btn-link text-decoration-none py-3 px-4 d-flex align-items-center gap-2 flex-shrink-0 ${
                    activeTab === "assignment"
                      ? "border-bottom-2 bg-primary text-light fw-semibold"
                      : "text-muted"
                  }`}
                >
                  <Users size={18} />
                  <span>Structure Assignment</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Directly below header */}
        <div style={{ padding: "0 20px 20px 20px" }}>
          {/* Tab Content */}
          {activeTab === "components" && renderComponentsTab()}
          {activeTab === "templates" && renderTemplatesTab()}
          {activeTab === "assignment" && renderAssignmentTab()}

          {/* Quick Stats */}
        </div>
      </div>

      {/* All modals at root level */}
      {showCreatePanel && (
        <div className="hrms-modal-overlay">
          <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">
           

              {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                  <Plus size={20} className="me-2" />
                  Create New Salary Structure Template
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreatePanel(false)}
                ></button>
              </div>
              <div className="hrms-modal-body hrms-modal-body-scroll">
                <div className="row">
                  {/* Basic Information Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3  d-flex align-items-center">
                      <FileText size={16} className="me-2 text-primary" />
                      Basic Information
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Structure Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Grade A - Management"
                          value={newStructure.name}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">
                          Grade Level <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={newStructure.grade}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              grade: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Grade</option>
                          <option value="A">Grade A </option>
                          <option value="B">Grade B </option>
                          <option value="C">Grade C </option>
                          <option value="D">Grade D </option>
                          <option value="CT">Contract - Technical</option>
                          <option value="IN">Intern</option>
                        </select>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">
                          Level <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={newStructure.level || ""}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              level: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Level</option>
                          <option value="L6">L6 (Senior Management)</option>
                          <option value="L5">L5 (Management)</option>
                          <option value="L4">L4 (Senior)</option>
                          <option value="L3">L3 (Junior)</option>
                          <option value="L2">L2 (Entry)</option>
                          <option value="L1">L1 (Intern/Trainee)</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={newStructure.category || "permanent"}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="permanent">Permanent</option>
                          <option value="contract">Contract</option>
                          <option value="intern">Intern</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Sub Category</label>
                        <select
                          className="form-select"
                          value={newStructure.subCategory || "regular"}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              subCategory: e.target.value,
                            })
                          }
                        >
                          <option value="regular">Regular</option>
                          <option value="management">Management</option>
                          <option value="technical">Technical</option>
                          <option value="operations">Operations</option>
                          <option value="sales">Sales</option>
                          <option value="support">Support</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Employee Type</label>
                        <select
                          className="form-select"
                          value={newStructure.employeeType || "regular"}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              employeeType: e.target.value,
                            })
                          }
                        >
                          <option value="regular">Regular</option>
                          <option value="contractor">Contractor</option>
                          <option value="intern">Intern</option>
                          <option value="temporary">Temporary</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={newStructure.status || "draft"}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="inactive">Inactive</option>
                          <option value="archived">Archived</option>
                        </select>
                        <div className="form-text">
                          New structures are typically created as Draft first
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Annual CTC (₹) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g., 1500000"
                          value={newStructure.ctc}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              ctc: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Salary Bands Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3  d-flex align-items-center">
                      <DollarSign size={16} className="me-2 text-primary" />
                      Salary Bands & Ranges
                    </h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Minimum CTC (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g., 1200000"
                          value={newStructure.minCTC || ""}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              minCTC: e.target.value,
                            })
                          }
                        />
                        <div className="form-text">
                          Minimum salary for this grade
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Maximum CTC (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g., 1800000"
                          value={newStructure.maxCTC || ""}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              maxCTC: e.target.value,
                            })
                          }
                        />
                        <div className="form-text">
                          Maximum salary for this grade
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Increment Range (%)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., 10-15%"
                          value={newStructure.incrementRange || ""}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              incrementRange: e.target.value,
                            })
                          }
                        />
                        <div className="form-text">
                          Annual increment percentage range
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Departments & Locations Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3  d-flex align-items-center">
                      <Users size={16} className="me-2 text-primary" />
                      Applicable Departments & Locations
                    </h6>
<div className="row">

{/* Departments */}
<div className="col-md-6 mb-3">
<label className="form-label">Departments</label>

<div
  className="bg-light p-3 rounded"
  style={{ maxHeight: "150px", overflowY: "auto" }}
>

{[
"Engineering",
"Product",
"Design",
"Marketing",
"Sales",
"Operations",
"Finance",
"HR",
"IT",
"Others"
].map((dept) => {

const isChecked = newStructure.departments?.includes(dept) || false;

return (
<div key={dept}>

<label
htmlFor={`dept-${dept}`}
style={{
display: "flex",
alignItems: "center",
cursor: "pointer",
color: "black",
marginBottom: "8px"
}}
>

<div
style={{
width: "20px",
height: "20px",
borderRadius: "4px",
border: `2px solid ${isChecked ? "#3B82F6" : "#9CA3AF"}`,
display: "flex",
alignItems: "center",
justifyContent: "center",
marginRight: "10px",
background: isChecked ? "#3B82F6" : "transparent",
transition: "all 0.3s ease"
}}
>
{isChecked && (
<span style={{ color: "white", fontSize: "12px" }}>✓</span>
)}
</div>

<input
type="checkbox"
id={`dept-${dept}`}
checked={isChecked}
onChange={(e) => {

const currentDepartments = newStructure.departments || [];

if (e.target.checked) {
setNewStructure({
...newStructure,
departments: [...currentDepartments, dept]
});
} else {
setNewStructure({
...newStructure,
departments: currentDepartments.filter((d) => d !== dept),
...(dept === "Others" && { customDepartment: "" })
});
}

}}
style={{ display: "none" }}
/>

<span>{dept}</span>

</label>


{/* Others input */}
{dept === "Others" && isChecked && (
<input
type="text"
className="form-control mb-2"
placeholder="Enter custom department"
value={newStructure.customDepartment || ""}
onChange={(e) =>
setNewStructure({
...newStructure,
customDepartment: e.target.value
})
}
/>
)}

</div>
);

})}

</div>
</div>


{/* Locations */}
<div className="col-md-6 mb-3">
<label className="form-label">Locations</label>

<div
className="bg-light p-3 rounded"
style={{ maxHeight: "150px", overflowY: "auto" }}
>

{[
"Bengaluru",
"Hyderabad",
"Pune",
"Mumbai",
"Delhi",
"Chennai",
"Remote",
"International",
"Others"
].map((location) => {

const isChecked = newStructure.locations?.includes(location) || false;

return (
<div key={location}>

<label
htmlFor={`loc-${location}`}
style={{
display: "flex",
alignItems: "center",
cursor: "pointer",
color: "black",
marginBottom: "8px"
}}
>

<div
style={{
width: "20px",
height: "20px",
borderRadius: "4px",
border: `2px solid ${isChecked ? "#3B82F6" : "#9CA3AF"}`,
display: "flex",
alignItems: "center",
justifyContent: "center",
marginRight: "10px",
background: isChecked ? "#3B82F6" : "transparent",
transition: "all 0.3s ease"
}}
>
{isChecked && (
<span style={{ color: "white", fontSize: "12px" }}>✓</span>
)}
</div>

<input
type="checkbox"
id={`loc-${location}`}
checked={isChecked}
onChange={(e) => {

const currentLocations = newStructure.locations || [];

if (e.target.checked) {
setNewStructure({
...newStructure,
locations: [...currentLocations, location]
});
} else {
setNewStructure({
...newStructure,
locations: currentLocations.filter((l) => l !== location),
...(location === "Others" && { customLocation: "" })
});
}

}}
style={{ display: "none" }}
/>

<span>{location}</span>

</label>


{/* Others input */}
{location === "Others" && isChecked && (
<input
type="text"
className="form-control mb-2"
placeholder="Enter custom location"
value={newStructure.customLocation || ""}
onChange={(e) =>
setNewStructure({
...newStructure,
customLocation: e.target.value
})
}
/>
)}

</div>
);

})}

</div>
</div>

</div>
                  </div>

                  {/* Dates Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3 d-flex align-items-center">
                      <Calendar size={16} className="me-2 text-primary" />
                      Effective Dates
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Effective Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={
                            newStructure.effectiveDate ||
                            new Date().toISOString().split("T")[0]
                          }
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              effectiveDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Expiry Date (Optional)
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={newStructure.expiryDate || ""}
                          onChange={(e) =>
                            setNewStructure({
                              ...newStructure,
                              expiryDate: e.target.value || null,
                            })
                          }
                        />
                        <div className="form-text">
                          Required for contract/intern structures
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Standard Deductions Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3 d-flex align-items-center">
                      <Percent size={16} className="me-2 text-primary" />
                      Standard Deductions Configuration
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="pfEnabled"
                            checked={newStructure.pfEnabled !== false}
                            onChange={(e) =>
                              setNewStructure({
                                ...newStructure,
                                pfEnabled: e.target.checked,
                              })
                            }
                          />
                          <label
                            className="form-check-label fw-medium"
                            htmlFor="pfEnabled"
                          >
                            Provident Fund (PF)
                          </label>
                        </div>
                        {newStructure.pfEnabled !== false && (
                          <div className="row ms-3">
                            <div className="col-6">
                              <label className="form-label small">
                                Employee %
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="12"
                                value={newStructure.pfEmployee || "12"}
                                onChange={(e) =>
                                  setNewStructure({
                                    ...newStructure,
                                    pfEmployee: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label small">
                                Employer %
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                placeholder="12"
                                value={newStructure.pfEmployer || "12"}
                                onChange={(e) =>
                                  setNewStructure({
                                    ...newStructure,
                                    pfEmployer: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="esiEnabled"
                            checked={newStructure.esiEnabled || false}
                            onChange={(e) =>
                              setNewStructure({
                                ...newStructure,
                                esiEnabled: e.target.checked,
                              })
                            }
                          />
                          <label
                            className="form-check-label fw-medium"
                            htmlFor="esiEnabled"
                          >
                            ESI Contribution
                          </label>
                        </div>
                        {newStructure.esiEnabled && (
                          <div className="row ms-3">
                            <div className="col-6">
                              <label className="form-label small">
                                Employee %
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control form-control-sm"
                                placeholder="0.75"
                                value={newStructure.esiEmployee || "0.75"}
                                onChange={(e) =>
                                  setNewStructure({
                                    ...newStructure,
                                    esiEmployee: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label small">
                                Employer %
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control form-control-sm"
                                placeholder="3.25"
                                value={newStructure.esiEmployer || "3.25"}
                                onChange={(e) =>
                                  setNewStructure({
                                    ...newStructure,
                                    esiEmployer: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="ptEnabled"
                            checked={newStructure.ptEnabled !== false}
                            onChange={(e) =>
                              setNewStructure({
                                ...newStructure,
                                ptEnabled: e.target.checked,
                              })
                            }
                          />
                          <label
                            className="form-check-label fw-medium"
                            htmlFor="ptEnabled"
                          >
                            Professional Tax
                          </label>
                        </div>
                        {newStructure.ptEnabled !== false && (
                          <div className="ms-3">
                            <label className="form-label small">
                              Monthly Amount (₹)
                            </label>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              placeholder="200"
                              value={newStructure.ptAmount || "200"}
                              onChange={(e) =>
                                setNewStructure({
                                  ...newStructure,
                                  ptAmount: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="tdsEnabled"
                            checked={newStructure.tdsEnabled || false}
                            onChange={(e) =>
                              setNewStructure({
                                ...newStructure,
                                tdsEnabled: e.target.checked,
                              })
                            }
                          />
                          <label
                            className="form-check-label fw-medium"
                            htmlFor="tdsEnabled"
                          >
                            TDS Deduction
                          </label>
                        </div>
                        {newStructure.tdsEnabled && (
                          <div className="ms-3">
                            <label className="form-label small">TDS Slab</label>
                            <select
                              className="form-select form-select-sm"
                              value={newStructure.tdsSlab || "as_per_income"}
                              onChange={(e) =>
                                setNewStructure({
                                  ...newStructure,
                                  tdsSlab: e.target.value,
                                })
                              }
                            >
                              <option value="as_per_income">
                                As per Income Tax
                              </option>
                              <option value="contractor_10%">
                                Contractor 10%
                              </option>
                              <option value="fixed_amount">Fixed Amount</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="col-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Describe this salary structure template..."
                      value={newStructure.description || ""}
                      onChange={(e) =>
                        setNewStructure({
                          ...newStructure,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-white border-top d-flex">
                <button
                  className="cancel-btn"
                  onClick={() => setShowCreatePanel(false)}
                >
                  Cancel
                </button>
                <button
                  className="create-job-btn"
                  onClick={() => {
                    // Validate required fields
                    if (
                      !newStructure.name ||
                      !newStructure.grade ||
                      !newStructure.ctc ||
                      !newStructure.level ||
                      !newStructure.category
                    ) {
                      setActionNotification({
                        show: true,
                        type: "error",
                        title: "Validation Error",
                        message: "Please fill all required fields (*).",
                      });
                      return;
                    }

                    // Create new structure object with all fields
                    const newStruct = {
                      id: structures.length + 1,
                      name: newStructure.name,
                      grade: newStructure.grade,
                      level: newStructure.level,
                      category: newStructure.category,
                      subCategory: newStructure.subCategory || "regular",
                      employeeType: newStructure.employeeType || "regular",
                      department: newStructure.departments || ["General"],
                      location: newStructure.locations || ["Head Office"],
                      ctc: parseInt(newStructure.ctc) || 0,
                      effectiveDate:
                        newStructure.effectiveDate ||
                        new Date().toISOString().split("T")[0],
                      expiryDate: newStructure.expiryDate || null,
                      description: newStructure.description || "",
                      status: newStructure.status || "draft",
                      approvalStatus:
                        newStructure.status === "active"
                          ? "approved"
                          : "pending",
                      employeeCount: 0,
                      version: "v1.0",
                      parentVersion: null,
                      createdAt: new Date().toISOString().split("T")[0],
                      createdBy: "Current User",
                      lastModified: new Date().toISOString().split("T")[0],
                      lastModifiedBy: "Current User",
                      changeReason: "New structure creation",

                      // Component Configuration
                      componentGroups: {
                        earnings: newStructure.selectedComponents?.filter(
                          (id) => components.earnings.some((c) => c.id === id),
                        ) || [1, 2, 3, 4],
                        deductions: newStructure.selectedComponents?.filter(
                          (id) =>
                            components.deductions.some((c) => c.id === id),
                        ) || [6, 8],
                        employerContributions:
                          newStructure.selectedComponents?.filter((id) =>
                            components.employerContributions.some(
                              (c) => c.id === id,
                            ),
                          ) || [12],
                        reimbursements: newStructure.selectedComponents?.filter(
                          (id) =>
                            components.reimbursements.some((c) => c.id === id),
                        ) || [15],
                      },

                      // Standard Deductions
                      standardDeductions: {
                        pf: {
                          enabled: newStructure.pfEnabled !== false,
                          employee: parseFloat(newStructure.pfEmployee || 12),
                          employer: parseFloat(newStructure.pfEmployer || 12),
                        },
                        esi: {
                          enabled: newStructure.esiEnabled || false,
                          employee: parseFloat(
                            newStructure.esiEmployee || 0.75,
                          ),
                          employer: parseFloat(
                            newStructure.esiEmployer || 3.25,
                          ),
                        },
                        professionalTax: {
                          enabled: newStructure.ptEnabled !== false,
                          amount: parseInt(newStructure.ptAmount || 200),
                        },
                        tds: {
                          enabled: newStructure.tdsEnabled || false,
                          slab: newStructure.tdsSlab || "as_per_income",
                        },
                      },

                      // Salary Bands
                      minCTC: parseInt(
                        newStructure.minCTC || newStructure.ctc * 0.8,
                      ),
                      maxCTC: parseInt(
                        newStructure.maxCTC || newStructure.ctc * 1.2,
                      ),
                      incrementRange:
                        newStructure.incrementRange ||
                        getIncrementRangeFromGrade(newStructure.grade),

                      // Version History
                      versionHistory: [
                        {
                          version: "v1.0",
                          date: new Date().toISOString().split("T")[0],
                          changes: "Initial structure creation",
                          changedBy: "Current User",
                        },
                      ],
                    };

                    setStructures([...structures, newStruct]);
                    setShowCreatePanel(false);

                    // Reset form
                    setNewStructure({
                      name: "",
                      grade: "",
                      level: "",
                      category: "",
                      ctc: "",
                      effectiveDate: new Date().toISOString().split("T")[0],
                      description: "",
                      departments: [],
                      locations: [],
                      selectedComponents: [],
                    });

                    // Show success notification
                    setActionNotification({
                      show: true,
                      type: "success",
                      title: "Structure Created",
                      message: `"${newStruct.name}" has been created successfully.`,
                    });
                  }}
                >
                  <Save size={16} className="me-2" />
                  Create Structure
                </button>
              </div>

          </div>
        </div>
      )}

      {/* View Structure Modal */}
      {showViewModal && selectedStructure && (
        <div className="hrms-modal-overlay">
          <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                  View Structure: {selectedStructure.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedStructure(null);
                  }}
                ></button>
              </div>

              <div className="hrms-modal-body hrms-modal-body-scroll">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="mb-3">Structure Information</h6>
                        <div className="mb-2">
                          <small className="text-muted d-block">Name</small>
                          <span className="fw-medium">
                            {selectedStructure.name}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">Grade</small>
                          <span className="fw-medium">
                            {selectedStructure.grade}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">Level</small>
                          <span className="fw-medium">
                            {selectedStructure.level || "N/A"}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">Category</small>
                          <span className="fw-medium">
                            {selectedStructure.category || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="mb-3">Financial Details</h6>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Annual CTC
                          </small>
                          <span className="fw-medium">
                            ₹{(selectedStructure.ctc || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Employee Count
                          </small>
                          <span className="fw-medium">
                            {selectedStructure.employeeCount || 0}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Effective Date
                          </small>
                          <span className="fw-medium">
                            {selectedStructure.effectiveDate || "N/A"}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">Status</small>
                          {getStatusBadge(selectedStructure.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown Details */}
                {(() => {
                  const breakdown = calculateBreakdown(selectedStructure);
                  if (!breakdown) return null;

                  return (
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="mb-3">Salary Breakdown</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="d-flex justify-content-between mb-2">
                              <span>Basic Salary:</span>
                              <span className="fw-medium">
                                ₹{breakdown.basic.toLocaleString()}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>HRA:</span>
                              <span className="fw-medium">
                                ₹{breakdown.hra.toLocaleString()}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Conveyance:</span>
                              <span className="fw-medium">
                                ₹{breakdown.conveyance.toLocaleString()}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Special Allowance:</span>
                              <span className="fw-medium">
                                ₹{breakdown.specialAllowance.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex justify-content-between mb-2">
                              <span>PF Deduction:</span>
                              <span className="fw-medium text-danger">
                                -₹{breakdown.pf.toLocaleString()}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>ESI Deduction:</span>
                              <span className="fw-medium text-danger">
                                -₹{breakdown.esi.toLocaleString()}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Professional Tax:</span>
                              <span className="fw-medium text-danger">
                                -₹{breakdown.professionalTax.toLocaleString()}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>TDS:</span>
                              <span className="fw-medium text-danger">
                                -₹{breakdown.tds.toLocaleString()}
                              </span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                              <span className="fw-bold">
                                Monthly Take-Home:
                              </span>
                              <span className="fw-bold text-success">
                                ₹{breakdown.takeHome.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="modal-footer bg-white border-top d-flex">
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedStructure(null);
                  }}
                >
                  Close
                </button>
                <button
                  className="create-job-btn"
                  onClick={() => {
                    setShowViewModal(false);
                    setShowEditModal(true);
                  }}
                >
                  <Edit2 size={16} className="me-2" />
                  Edit Structure
                </button>
              </div>


          </div>
        </div>
      )}

      {/* Edit Structure Modal */}
      {showEditModal && selectedStructure && (
        <div className="hrms-modal-overlay"  >
          <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

<div className="hrms-modal-header d-flex justify-content-between align-items-center">
  <h5 className="hrms-modal-title d-flex align-items-center mb-0">
    <Edit2 size={20} className="me-2" />
    Edit Salary Structure: {selectedStructure.name}
  </h5>

  <button
    type="button"
    className="btn-close"
    onClick={() => {
      setShowEditModal(false);
      setSelectedStructure(null);
    }}
  ></button>
</div>

              <div className="hrms-modal-body hrms-modal-body-scroll">
                <div className="row">
                  {/* Basic Information Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3 d-flex align-items-center">
                      <FileText size={16} className="me-2 text-primary" />
                      Basic Information
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Structure Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedStructure.name}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">
                          Grade Level <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedStructure.grade}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              grade: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Grade</option>
                          <option value="A">Grade A</option>
                          <option value="B">Grade B</option>
                          <option value="C">Grade C</option>
                          <option value="D">Grade D</option>
                          <option value="CT">Contract - Technical</option>
                          <option value="IN">Intern</option>
                        </select>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">
                          Level <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedStructure.level || ""}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              level: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Level</option>
                          <option value="L6">L6 (Senior Management)</option>
                          <option value="L5">L5 (Management)</option>
                          <option value="L4">L4 (Senior)</option>
                          <option value="L3">L3 (Junior)</option>
                          <option value="L2">L2 (Entry)</option>
                          <option value="L1">L1 (Intern/Trainee)</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedStructure.category || "permanent"}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="permanent">Permanent</option>
                          <option value="contract">Contract</option>
                          <option value="intern">Intern</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Sub Category</label>
                        <select
                          className="form-select"
                          value={selectedStructure.subCategory || "regular"}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              subCategory: e.target.value,
                            })
                          }
                        >
                          <option value="regular">Regular</option>
                          <option value="management">Management</option>
                          <option value="technical">Technical</option>
                          <option value="operations">Operations</option>
                          <option value="sales">Sales</option>
                          <option value="support">Support</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Employee Type</label>
                        <select
                          className="form-select"
                          value={selectedStructure.employeeType || "regular"}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              employeeType: e.target.value,
                            })
                          }
                        >
                          <option value="regular">Regular</option>
                          <option value="contractor">Contractor</option>
                          <option value="intern">Intern</option>
                          <option value="temporary">Temporary</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedStructure.status || "draft"}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="inactive">Inactive</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Annual CTC (₹) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={selectedStructure.ctc || 0}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              ctc: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Version</label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedStructure.version || "v1.0"}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              version: e.target.value,
                            })
                          }
                        />
                        <div className="form-text">
                          Current version of this structure
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Salary Bands Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3 d-flex align-items-center">
                      <DollarSign size={16} className="me-2 text-primary" />
                      Salary Bands & Ranges
                    </h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Minimum CTC (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={selectedStructure.minCTC || ""}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              minCTC: e.target.value,
                            })
                          }
                        />
                        <div className="form-text">
                          Minimum salary for this grade
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Maximum CTC (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={selectedStructure.maxCTC || ""}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              maxCTC: e.target.value,
                            })
                          }
                        />
                        <div className="form-text">
                          Maximum salary for this grade
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Increment Range (%)
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedStructure.incrementRange || ""}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              incrementRange: e.target.value,
                            })
                          }
                        />
                        <div className="form-text">
                          Annual increment percentage range
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Departments & Locations Section */}
                  {/* Departments & Locations Section */}
<div className="col-12 mb-4">
  <h6 className="border-bottom pb-2 mb-3 d-flex align-items-center">
    <Users size={16} className="me-2 text-primary" />
    Applicable Departments & Locations
  </h6>

  <div className="row">

    {/* Departments */}
    <div className="col-md-6 mb-3">
      <label className="form-label">Departments</label>

      <div
        className="bg-light p-3 rounded"
        style={{ maxHeight: "150px", overflowY: "auto" }}
      >
        {[
          "Engineering","Product","Design","Marketing","Sales",
          "Operations","Finance","HR","IT","Others"
        ].map((dept) => {

          const isChecked =
            selectedStructure.department?.includes(dept) || false;

          return (
            <div key={dept}>

              <label
                htmlFor={`edit-dept-${dept}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  marginBottom: "8px"
                }}
              >

                {/* Custom Checkbox */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    border: `2px solid ${isChecked ? "#3B82F6" : "#9CA3AF"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    background: isChecked ? "#3B82F6" : "transparent",
                    transition: "all 0.3s ease"
                  }}
                >
                  {isChecked && (
                    <span style={{ color: "white", fontSize: "12px" }}>✓</span>
                  )}
                </div>

                <input
                  type="checkbox"
                  id={`edit-dept-${dept}`}
                  checked={isChecked}
                  style={{ display: "none" }}
                  onChange={(e) => {

                    const currentDepartments =
                      selectedStructure.department || [];

                    if (e.target.checked) {
                      setSelectedStructure({
                        ...selectedStructure,
                        department: [...currentDepartments, dept]
                      });
                    } else {
                      setSelectedStructure({
                        ...selectedStructure,
                        department: currentDepartments.filter(
                          (d) => d !== dept
                        ),
                        ...(dept === "Others" && { customDepartment: "" })
                      });
                    }
                  }}
                />

                <span>{dept}</span>

              </label>

              {dept === "Others" && isChecked && (
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter department"
                  value={selectedStructure.customDepartment || ""}
                  onChange={(e) =>
                    setSelectedStructure({
                      ...selectedStructure,
                      customDepartment: e.target.value
                    })
                  }
                />
              )}

            </div>
          );
        })}
      </div>
    </div>

    {/* Locations */}
    <div className="col-md-6 mb-3">
      <label className="form-label">Locations</label>

      <div
        className="bg-light p-3 rounded"
        style={{ maxHeight: "150px", overflowY: "auto" }}
      >
        {[
          "Bengaluru","Hyderabad","Pune","Mumbai",
          "Delhi","Chennai","Remote","International","Others"
        ].map((location) => {

          const isChecked =
            selectedStructure.location?.includes(location) || false;

          return (
            <div key={location}>

              <label
                htmlFor={`edit-loc-${location}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  marginBottom: "8px"
                }}
              >

                {/* Custom Checkbox */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    border: `2px solid ${isChecked ? "#3B82F6" : "#9CA3AF"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "10px",
                    background: isChecked ? "#3B82F6" : "transparent",
                    transition: "all 0.3s ease"
                  }}
                >
                  {isChecked && (
                    <span style={{ color: "white", fontSize: "12px" }}>✓</span>
                  )}
                </div>

                <input
                  type="checkbox"
                  id={`edit-loc-${location}`}
                  checked={isChecked}
                  style={{ display: "none" }}
                  onChange={(e) => {

                    const currentLocations =
                      selectedStructure.location || [];

                    if (e.target.checked) {
                      setSelectedStructure({
                        ...selectedStructure,
                        location: [...currentLocations, location]
                      });
                    } else {
                      setSelectedStructure({
                        ...selectedStructure,
                        location: currentLocations.filter(
                          (l) => l !== location
                        ),
                        ...(location === "Others" && { customLocation: "" })
                      });
                    }
                  }}
                />

                <span>{location}</span>

              </label>

              {location === "Others" && isChecked && (
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter location"
                  value={selectedStructure.customLocation || ""}
                  onChange={(e) =>
                    setSelectedStructure({
                      ...selectedStructure,
                      customLocation: e.target.value
                    })
                  }
                />
              )}

            </div>
          );
        })}
      </div>
    </div>

  </div>
</div>

                  {/* Dates Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3 d-flex align-items-center">
                      <Calendar size={16} className="me-2 text-primary" />
                      Effective Dates
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Effective Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={selectedStructure.effectiveDate}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              effectiveDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Expiry Date (Optional)
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={selectedStructure.expiryDate || ""}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              expiryDate: e.target.value || null,
                            })
                          }
                        />
                        <div className="form-text">
                          Required for contract/intern structures
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Standard Deductions Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3 d-flex align-items-center">
                      <Percent size={16} className="me-2 text-primary" />
                      Standard Deductions Configuration
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="edit-pfEnabled"
                            checked={
                              selectedStructure.standardDeductions?.pf
                                ?.enabled !== false
                            }
                            onChange={(e) =>
                              setSelectedStructure({
                                ...selectedStructure,
                                standardDeductions: {
                                  ...selectedStructure.standardDeductions,
                                  pf: {
                                    ...selectedStructure.standardDeductions?.pf,
                                    enabled: e.target.checked,
                                  },
                                },
                              })
                            }
                          />
                          <label
                            className="form-check-label fw-medium"
                            htmlFor="edit-pfEnabled"
                          >
                            Provident Fund (PF)
                          </label>
                        </div>
                        {selectedStructure.standardDeductions?.pf?.enabled !==
                          false && (
                          <div className="row ms-3">
                            <div className="col-6">
                              <label className="form-label small">
                                Employee %
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={
                                  selectedStructure.standardDeductions?.pf
                                    ?.employee || "12"
                                }
                                onChange={(e) =>
                                  setSelectedStructure({
                                    ...selectedStructure,
                                    standardDeductions: {
                                      ...selectedStructure.standardDeductions,
                                      pf: {
                                        ...selectedStructure.standardDeductions
                                          ?.pf,
                                        employee: parseFloat(e.target.value),
                                      },
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label small">
                                Employer %
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                value={
                                  selectedStructure.standardDeductions?.pf
                                    ?.employer || "12"
                                }
                                onChange={(e) =>
                                  setSelectedStructure({
                                    ...selectedStructure,
                                    standardDeductions: {
                                      ...selectedStructure.standardDeductions,
                                      pf: {
                                        ...selectedStructure.standardDeductions
                                          ?.pf,
                                        employer: parseFloat(e.target.value),
                                      },
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="edit-esiEnabled"
                            checked={
                              selectedStructure.standardDeductions?.esi
                                ?.enabled || false
                            }
                            onChange={(e) =>
                              setSelectedStructure({
                                ...selectedStructure,
                                standardDeductions: {
                                  ...selectedStructure.standardDeductions,
                                  esi: {
                                    ...selectedStructure.standardDeductions
                                      ?.esi,
                                    enabled: e.target.checked,
                                  },
                                },
                              })
                            }
                          />
                          <label
                            className="form-check-label fw-medium"
                            htmlFor="edit-esiEnabled"
                          >
                            ESI Contribution
                          </label>
                        </div>
                        {selectedStructure.standardDeductions?.esi?.enabled && (
                          <div className="row ms-3">
                            <div className="col-6">
                              <label className="form-label small">
                                Employee %
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control form-control-sm"
                                value={
                                  selectedStructure.standardDeductions?.esi
                                    ?.employee || "0.75"
                                }
                                onChange={(e) =>
                                  setSelectedStructure({
                                    ...selectedStructure,
                                    standardDeductions: {
                                      ...selectedStructure.standardDeductions,
                                      esi: {
                                        ...selectedStructure.standardDeductions
                                          ?.esi,
                                        employee: parseFloat(e.target.value),
                                      },
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label small">
                                Employer %
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control form-control-sm"
                                value={
                                  selectedStructure.standardDeductions?.esi
                                    ?.employer || "3.25"
                                }
                                onChange={(e) =>
                                  setSelectedStructure({
                                    ...selectedStructure,
                                    standardDeductions: {
                                      ...selectedStructure.standardDeductions,
                                      esi: {
                                        ...selectedStructure.standardDeductions
                                          ?.esi,
                                        employer: parseFloat(e.target.value),
                                      },
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="edit-ptEnabled"
                            checked={
                              selectedStructure.standardDeductions
                                ?.professionalTax?.enabled !== false
                            }
                            onChange={(e) =>
                              setSelectedStructure({
                                ...selectedStructure,
                                standardDeductions: {
                                  ...selectedStructure.standardDeductions,
                                  professionalTax: {
                                    ...selectedStructure.standardDeductions
                                      ?.professionalTax,
                                    enabled: e.target.checked,
                                  },
                                },
                              })
                            }
                          />
                          <label
                            className="form-check-label fw-medium"
                            htmlFor="edit-ptEnabled"
                          >
                            Professional Tax
                          </label>
                        </div>
                        {selectedStructure.standardDeductions?.professionalTax
                          ?.enabled !== false && (
                          <div className="ms-3">
                            <label className="form-label small">
                              Monthly Amount (₹)
                            </label>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={
                                selectedStructure.standardDeductions
                                  ?.professionalTax?.amount || "200"
                              }
                              onChange={(e) =>
                                setSelectedStructure({
                                  ...selectedStructure,
                                  standardDeductions: {
                                    ...selectedStructure.standardDeductions,
                                    professionalTax: {
                                      ...selectedStructure.standardDeductions
                                        ?.professionalTax,
                                      amount: parseInt(e.target.value),
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="edit-tdsEnabled"
                            checked={
                              selectedStructure.standardDeductions?.tds
                                ?.enabled || false
                            }
                            onChange={(e) =>
                              setSelectedStructure({
                                ...selectedStructure,
                                standardDeductions: {
                                  ...selectedStructure.standardDeductions,
                                  tds: {
                                    ...selectedStructure.standardDeductions
                                      ?.tds,
                                    enabled: e.target.checked,
                                  },
                                },
                              })
                            }
                          />
                          <label
                            className="form-check-label fw-medium"
                            htmlFor="edit-tdsEnabled"
                          >
                            TDS Deduction
                          </label>
                        </div>
                        {selectedStructure.standardDeductions?.tds?.enabled && (
                          <div className="ms-3">
                            <label className="form-label small">TDS Slab</label>
                            <select
                              className="form-select form-select-sm"
                              value={
                                selectedStructure.standardDeductions?.tds
                                  ?.slab || "as_per_income"
                              }
                              onChange={(e) =>
                                setSelectedStructure({
                                  ...selectedStructure,
                                  standardDeductions: {
                                    ...selectedStructure.standardDeductions,
                                    tds: {
                                      ...selectedStructure.standardDeductions
                                        ?.tds,
                                      slab: e.target.value,
                                    },
                                  },
                                })
                              }
                            >
                              <option value="as_per_income">
                                As per Income Tax
                              </option>
                              <option value="contractor_10%">
                                Contractor 10%
                              </option>
                              <option value="fixed_amount">Fixed Amount</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Change Reason Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3 d-flex align-items-center">
                      <History size={16} className="me-2 text-primary" />
                      Update Information
                    </h6>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label className="form-label">
                          Change Reason <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="Describe the changes made to this structure..."
                          value={selectedStructure.changeReason || ""}
                          onChange={(e) =>
                            setSelectedStructure({
                              ...selectedStructure,
                              changeReason: e.target.value,
                            })
                          }
                        />
                        <div className="form-text">
                          This will be recorded in the version history
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="col-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Describe this salary structure template..."
                      value={selectedStructure.description || ""}
                      onChange={(e) =>
                        setSelectedStructure({
                          ...selectedStructure,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-white border-top d-flex">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStructure(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="create-job-btn"
                  onClick={() => {
                    // Validate required fields
                    if (
                      !selectedStructure.name ||
                      !selectedStructure.grade ||
                      !selectedStructure.ctc ||
                      !selectedStructure.level ||
                      !selectedStructure.category ||
                      !selectedStructure.status
                    ) {
                      setActionNotification({
                        show: true,
                        type: "error",
                        title: "Validation Error",
                        message: "Please fill all required fields (*).",
                      });
                      return;
                    }

                    // Prepare updated structure with version history
                    const updatedStructure = {
                      ...selectedStructure,
                      lastModified: new Date().toISOString().split("T")[0],
                      lastModifiedBy: "Current User",
                      // Update approval status based on new status
                      approvalStatus:
                        selectedStructure.status === "active"
                          ? "approved"
                          : selectedStructure.approvalStatus,
                      // Add to version history if there are significant changes
                      versionHistory: [
                        ...(selectedStructure.versionHistory || []),
                        {
                          version: selectedStructure.version,
                          date: new Date().toISOString().split("T")[0],
                          changes:
                            selectedStructure.changeReason ||
                            "Structure updated",
                          changedBy: "Current User",
                        },
                      ],
                    };

                    // Update the structure in the main structures array
                    const updatedStructures = structures.map((s) =>
                      s.id === selectedStructure.id ? updatedStructure : s,
                    );
                    setStructures(updatedStructures);
                    setShowEditModal(false);

                    // Show success notification
                    setActionNotification({
                      show: true,
                      type: "success",
                      title: "Structure Updated",
                      message: `"${selectedStructure.name}" has been updated successfully.`,
                    });
                  }}
                >
                  <Save size={16} className="me-2" />
                  Save Changes
                </button>
              </div>

          </div>
        </div>
      )}
      {/* What-If Simulation Panel */}
      {showSimulationPanel && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">What-If Salary Simulation</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSimulationPanel(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Base CTC (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={simulationData.baseCTC || ""}
                      onChange={(e) =>
                        setSimulationData({
                          ...simulationData,
                          baseCTC: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Variable Pay (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={simulationData.variablePercent || ""}
                      onChange={(e) =>
                        setSimulationData({
                          ...simulationData,
                          variablePercent: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">PF Contribution (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      step="0.1"
                      value={simulationData.pfPercent || ""}
                      onChange={(e) =>
                        setSimulationData({
                          ...simulationData,
                          pfPercent: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tax Deduction (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={simulationData.taxDeduction || ""}
                      onChange={(e) =>
                        setSimulationData({
                          ...simulationData,
                          taxDeduction: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Simulation Results with safe calculations */}
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="mb-3">Simulation Results</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Basic Salary:</span>
                          <span className="fw-medium">
                            ₹
                            {(
                              (simulationData.baseCTC || 0) * 0.4
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>HRA:</span>
                          <span className="fw-medium">
                            ₹
                            {(
                              (simulationData.baseCTC || 0) *
                              0.4 *
                              0.5
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Variable Pay:</span>
                          <span className="fw-medium">
                            ₹
                            {(
                              ((simulationData.baseCTC || 0) *
                                (simulationData.variablePercent || 0)) /
                              100
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between mb-2">
                          <span>PF Deduction:</span>
                          <span className="fw-medium text-danger">
                            -₹
                            {(
                              ((simulationData.baseCTC || 0) *
                                0.4 *
                                (simulationData.pfPercent || 0)) /
                              100
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Tax:</span>
                          <span className="fw-medium text-danger">
                            -₹
                            {(
                              simulationData.taxDeduction || 0
                            ).toLocaleString()}
                          </span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <span className="fw-bold">Estimated Take-Home:</span>
                          <span className="fw-bold fs-5 text-success">
                            ₹
                            {(
                              (simulationData.baseCTC || 0) * 0.4 +
                              (simulationData.baseCTC || 0) * 0.4 * 0.5 +
                              ((simulationData.baseCTC || 0) *
                                (simulationData.variablePercent || 0)) /
                                100 -
                              ((simulationData.baseCTC || 0) *
                                0.4 *
                                (simulationData.pfPercent || 0)) /
                                100 -
                              (simulationData.taxDeduction || 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="close-btn">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowSimulationPanel(false)}
                >
                  Close
                </button>
                <button
                  className="create-job-btn"
                  onClick={() => {
                    alert(
                      "Simulation saved! You can now create a structure from these values.",
                    );
                    setShowSimulationPanel(false);
                  }}
                >
                  Save as Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionModal && (
        <div className="hrms-modal-overlay">

          <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                  <History size={18} className="me-2" />
                  Version History
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowVersionModal(false)}
                ></button>
              </div>
              <div className="hrms-modal-body hrms-modal-body-scroll">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th width="10%" className="ps-3">
                          Version
                        </th>
                        <th width="25%">Structure</th>
                        <th width="30%">Changes</th>
                        <th width="15%">Date</th>
                        <th width="15%" className="pe-3">
                          Changed By
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {versions.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="text-muted">
                              <FileText size={24} className="mb-2" />
                              <p className="mb-0">No version history found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        versions.map((version) => {
                          const structure = structures.find(
                            (s) => s.id === version.structureId,
                          );
                          return (
                            <tr key={version.id}>
                              <td className="ps-3">
                                <div className="d-flex flex-column align-items-start">
                                  <span className="badge bg-primary bg-opacity-10 text-primary border fw-medium mb-1">
                                    {version.version}
                                  </span>
                                  <small className="text-muted">
                                    ID: {version.id}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <div
                                    className="fw-medium text-truncate"
                                    style={{ maxWidth: "200px" }}
                                  >
                                    {structure?.name || "Unknown Structure"}
                                  </div>
                                  {structure && (
                                    <div className="d-flex gap-2 mt-1">
                                      <span className="badge bg-light text-dark border small">
                                        Grade {structure.grade}
                                      </span>
                                      {structure.level && (
                                        <span className="badge bg-light text-dark border small">
                                          {structure.level}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div
                                  className="text-wrap lh-sm"
                                  style={{
                                    minWidth: "150px",
                                    maxWidth: "250px",
                                  }}
                                >
                                  {version.changes}
                                  {structure?.changeReason &&
                                    version.id ===
                                      structure.versionHistory?.[0]?.id && (
                                      <div className="small text-info mt-1">
                                        <i className="bi bi-info-circle me-1"></i>
                                        {structure.changeReason}
                                      </div>
                                    )}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <div className="d-flex align-items-center gap-1">
                                    <Calendar
                                      size={14}
                                      className="text-muted"
                                    />
                                    <span className="fw-medium">
                                      {version.date}
                                    </span>
                                  </div>
                                  <div className="small text-muted mt-1">
                                    {/* Show time if available */}
                                    {version.time || "N/A"}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex flex-column">
                                  <div className="d-flex align-items-center gap-1">
                                    <User size={14} className="text-muted" />
                                    <span>{version.changedBy}</span>
                                  </div>
                                  {version.approver &&
                                    version.approvalStatus === "approved" && (
                                      <div className="small text-success mt-1">
                                        ✓ Approved by {version.approver}
                                      </div>
                                    )}
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
              <div className="modal-footer bg-white border-top d-flex">
                <button
                  className="close-btn"
                  onClick={() => setShowVersionModal(false)}
                >
                  Close
                </button>
                <button
                  className="create-job-btn"
                  onClick={handleExportVersionHistoryPDF}
                >
                  <Download size={16} className="me-2" />
                  Export History (PDF)
                </button>
              </div>

          </div>
        </div>
      )}
      {/* Add this at the end of your component, before the final closing </div> */}
      {showViewComponentModal && selectedComponent && (
        <div className="hrms-modal-overlay">
          <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">
               {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                  <Eye size={18} className="me-2" />
                  Component Details: {selectedComponent.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowViewComponentModal(false);
                    setSelectedComponent(null);
                  }}
                ></button>
              </div>
              {/* BODY */}
              <div className="hrms-modal-body hrms-modal-body-scroll">
                <div className="row">
                  {/* Left Column */}
                  <div className="col-md-6">
                    <div className="card border mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Basic Information</h6>
                      </div>
                      <div className="card-body">
                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block">
                              Component ID
                            </small>
                            <span className="fw-medium">
                              {selectedComponent.id}
                            </span>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">
                              Category
                            </small>
                            <span className="badge bg-primary-subtle text-primary">
                              {selectedComponent.category
                                ?.toUpperCase()
                                .replace("_", " ") || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block">Type</small>
                            <div>
                              {getComponentTypeBadge(selectedComponent.type)}
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Status</small>
                            <div>
                              {selectedComponent.isActive ? (
                                 <span className="badge bg-success-subtle text-success border d-inline-flex align-items-center gap-1">
                                  <CheckCircle size={12} className="me-1" />
                                  Active
                                </span>
                              ) : (
                                <span className="badge bg-secondary-subtle text-secondary border d-inline-flex align-items-center gap-1">
                                  <XCircle size={12} className="me-1" />
                                  Inactive
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Description
                          </small>
                          <div className="bg-light p-2 rounded small">
                            {selectedComponent.description ||
                              "No description provided"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card border mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Calculation Details</h6>
                      </div>
                      <div className="card-body">
                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block">Method</small>
                            <span className="fw-medium">
                              {getCalculationLabel(
                                selectedComponent.calculation,
                              )}
                            </span>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Value</small>
                            <span className="fw-bold text-primary">
                              {formatValue(selectedComponent)}
                            </span>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block">Base</small>
                            <span className="fw-medium">
                              {formatBase(selectedComponent)}
                            </span>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">
                              Pro-rata
                            </small>
                            <div>
                              {getProRataBadge(selectedComponent.proRata)}
                            </div>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted d-block">
                              Rounding
                            </small>
                            <div>
                              {getRoundingBadge(selectedComponent.rounding)}
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Order</small>
                            <span className="badge bg-light border text-dark">
                              #{selectedComponent.calculationOrder || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-md-6">
                    <div className="card border mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Tax & Compliance</h6>
                      </div>
                      <div className="card-body">
                        <div className="row mb-3">
                          <div className="col-6">
                            <div className="mb-2">
                              {getTaxableBadge(selectedComponent.taxable)}
                            </div>
                            {selectedComponent.taxExemptLimit && (
                              <div className="small text-success">
                                Exempt up to ₹
                                {selectedComponent.taxExemptLimit.toLocaleString()}
                              </div>
                            )}
                          </div>
                          <div className="col-6">
                            <div className="mb-2">
                              {getStatutoryBadge(selectedComponent.statutory)}
                            </div>
                            {selectedComponent.statutoryReference && (
                              <div className="small text-info">
                                {selectedComponent.statutoryReference}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted d-block">
                              Requires Proof
                            </small>
                            <div>
                              {selectedComponent.requiresProof ? (
                                <span className="badge bg-warning-subtle text-warning border">
                                  Yes
                                </span>
                              ) : (
                                <span className="badge bg-light text-muted border">
                                  No
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card border mb-3">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Amount Limits</h6>
                      </div>
                      <div className="card-body">
                        <div className="row mb-3">
                          <div className="col-6">
                            <small className="text-muted d-block">
                              Minimum Amount
                            </small>
                            <div className="fw-medium">
                              {selectedComponent.minAmount ? (
                                <span className="text-success">
                                  ₹
                                  {selectedComponent.minAmount.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-muted">Not Set</span>
                              )}
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">
                              Maximum Amount
                            </small>
                            <div className="fw-medium">
                              {selectedComponent.maxAmount ? (
                                <span className="text-danger">
                                  ₹
                                  {selectedComponent.maxAmount.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-muted">Not Set</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-white border-top d-flex">
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowViewComponentModal(false);
                    setSelectedComponent(null);
                  }}
                >
                  Close
                </button>
                <button
                  className="create-job-btn"
                  onClick={() => {
                    setShowViewComponentModal(false);
                    setShowComponentModal(true);
                  }}
                >
                  <Edit2 size={16} className="me-2" />
                  Edit Component
                </button>
              </div>

          </div>
        </div>
      )}

      {/* Assignment Details View Modal */}
      {showAssignmentViewModal && selectedAssignment && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-light">
                <h5 className="modal-title">
                  <User size={20} className="me-2" />
                  Assignment Details: {selectedAssignment.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAssignmentViewModal(false);
                    setSelectedAssignment(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  {/* Employee Information */}
                  <div className="col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="mb-3">
                          <User size={16} className="me-2 text-primary" />
                          Employee Information
                        </h6>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Employee Name
                          </small>
                          <span className="fw-medium">
                            {selectedAssignment.name}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Employee ID
                          </small>
                          <span className="fw-medium">
                            {selectedAssignment.employeeId}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">Email</small>
                          <span className="fw-medium">
                            {selectedAssignment.email || "N/A"}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Department
                          </small>
                          <span className="fw-medium">
                            {selectedAssignment.department}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">Location</small>
                          <span className="fw-medium">
                            {selectedAssignment.location || "N/A"}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Employee Type
                          </small>
                          <span className="fw-medium">
                            {selectedAssignment.employeeType || "Permanent"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Information */}
                  <div className="col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="mb-3">
                          <FileText size={16} className="me-2 text-primary" />
                          Assignment Information
                        </h6>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Current Structure
                          </small>
                          <span className="fw-medium">
                            {selectedAssignment.currentStructure}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Grade & Level
                          </small>
                          <div className="d-flex gap-2">
                            <span className="badge bg-primary-subtle text-primary border">
                              Grade {selectedAssignment.grade}
                            </span>
                            {selectedAssignment.level && (
                              <span className="badge bg-info-subtle text-info border">
                                {selectedAssignment.level}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Assignment Type
                          </small>
                          <span className="fw-medium text-capitalize">
                            {selectedAssignment.assignmentType || "Initial"}
                          </span>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Assignment Status
                          </small>
                          <div className="mt-1">
                            <span
                              className={`badge ${selectedAssignment.assignmentStatus === "active" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}
                            >
                              {selectedAssignment.assignmentStatus || "Active"}
                            </span>
                          </div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Approval Status
                          </small>
                          <div className="mt-1">
                            <span
                              className={`badge ${selectedAssignment.approvalStatus === "approved" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}`}
                            >
                              {selectedAssignment.approvalStatus || "Approved"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="mb-3">
                          <DollarSign size={16} className="me-2 text-primary" />
                          Financial Details
                        </h6>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Annual CTC:</span>
                          <span className="fw-bold">
                            ₹{selectedAssignment.ctc.toLocaleString()}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Gross Salary (Monthly):</span>
                          <span className="fw-bold">
                            ₹
                            {selectedAssignment.grossSalary?.toLocaleString() ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Take-Home (Monthly):</span>
                          <span className="fw-bold text-success">
                            ₹{selectedAssignment.takeHome.toLocaleString()}
                          </span>
                        </div>
                        {selectedAssignment.annualTakeHome && (
                          <div className="d-flex justify-content-between mb-2">
                            <span>Annual Take-Home:</span>
                            <span className="fw-bold text-success">
                              ₹
                              {selectedAssignment.annualTakeHome.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <hr />
                        <div className="d-flex justify-content-between">
                          <span className="fw-medium">
                            CTC vs Take-Home Ratio:
                          </span>
                          <span className="fw-bold text-info">
                            {selectedAssignment.ctc > 0
                              ? (
                                  ((selectedAssignment.takeHome * 12) /
                                    selectedAssignment.ctc) *
                                  100
                                ).toFixed(1) + "%"
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="mb-3">
                          <Calendar size={16} className="me-2 text-primary" />
                          Timeline Details
                        </h6>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Effective Date
                          </small>
                          <div className="fw-medium">
                            <Calendar size={14} className="me-1 text-muted" />
                            {selectedAssignment.effectiveDate}
                          </div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Created On
                          </small>
                          <div className="fw-medium">
                            <Calendar size={14} className="me-1 text-muted" />
                            {selectedAssignment.createdOn ||
                              selectedAssignment.assignmentDate ||
                              "N/A"}
                          </div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Last Modified
                          </small>
                          <div className="fw-medium">
                            <Clock size={14} className="me-1 text-muted" />
                            {selectedAssignment.lastModified ||
                              selectedAssignment.lastRevisionDate ||
                              "N/A"}
                          </div>
                        </div>
                        {selectedAssignment.contractEndDate && (
                          <div className="mb-2">
                            <small className="text-muted d-block">
                              Contract End Date
                            </small>
                            <div className="fw-medium">
                              <Calendar size={14} className="me-1 text-muted" />
                              {selectedAssignment.contractEndDate}
                            </div>
                          </div>
                        )}
                        {selectedAssignment.noticePeriod && (
                          <div className="mb-2">
                            <small className="text-muted d-block">
                              Notice Period
                            </small>
                            <span className="badge bg-light text-dark border">
                              {selectedAssignment.noticePeriod} days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Allocation Rules & Comments */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="mb-3">
                          <Settings size={16} className="me-2 text-primary" />
                          Allocation Rules
                        </h6>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Allocation Type
                          </small>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {selectedAssignment.allocationRules?.type ===
                            "auto" ? (
                              <span className="badge bg-success-subtle text-success border">
                                Auto Allocation
                              </span>
                            ) : selectedAssignment.allocationRules?.type ===
                              "manual" ? (
                              <span className="badge bg-warning-subtle text-warning border">
                                Manual Allocation
                              </span>
                            ) : selectedAssignment.allocationRules?.type ===
                              "bulk" ? (
                              <span className="badge bg-info-subtle text-info border">
                                Bulk Allocation
                              </span>
                            ) : (
                              <span className="badge bg-secondary-subtle text-secondary border">
                                Not Specified
                              </span>
                            )}

                            {selectedAssignment.allocationRules?.proRata && (
                              <span className="badge bg-light text-dark border">
                                Pro-rata Applicable
                              </span>
                            )}

                            {selectedAssignment.allocationRules
                              ?.hasCustomRules && (
                              <span className="badge bg-primary-subtle text-primary border">
                                Custom Rules Applied
                              </span>
                            )}
                          </div>
                        </div>

                        {selectedAssignment.allocationRules?.rules && (
                          <div className="mt-3">
                            <small className="text-muted d-block">
                              Allocation Rules
                            </small>
                            <div className="bg-light p-2 rounded small mt-1">
                              <ul className="mb-0 ps-3">
                                {selectedAssignment.allocationRules.rules.map(
                                  (rule, index) => (
                                    <li key={index}>{rule}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="mb-3">
                          <MessageSquare
                            size={16}
                            className="me-2 text-primary"
                          />
                          Comments & Approval
                        </h6>
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            Change Reason
                          </small>
                          <div className="fw-medium">
                            {selectedAssignment.changeReason ||
                              "Initial Assignment"}
                          </div>
                        </div>
                        <div className="mb-2">
                          <small className="text-muted d-block">Comments</small>
                          <div className="bg-light p-2 rounded small mt-1">
                            {selectedAssignment.comments ||
                              "No comments available"}
                          </div>
                        </div>
                        {selectedAssignment.approver && (
                          <div className="mb-2">
                            <small className="text-muted d-block">
                              Approved By
                            </small>
                            <div className="fw-medium">
                              <User size={14} className="me-1 text-muted" />
                              {selectedAssignment.approver}
                            </div>
                          </div>
                        )}
                        {selectedAssignment.approvalDate && (
                          <div className="mb-2">
                            <small className="text-muted d-block">
                              Approval Date
                            </small>
                            <div className="fw-medium">
                              <Calendar size={14} className="me-1 text-muted" />
                              {selectedAssignment.approvalDate}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Breakdown */}
                {selectedAssignment.salaryBreakdown && (
                  <div className="card border mb-4">
                    <div className="card-body">
                      <h6 className="mb-3">
                        <Percent size={16} className="me-2 text-primary" />
                        Salary Breakdown
                      </h6>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Basic Salary:</span>
                            <span className="fw-medium">
                              ₹
                              {(
                                selectedAssignment.salaryBreakdown.basic || 0
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>House Rent Allowance:</span>
                            <span className="fw-medium">
                              ₹
                              {(
                                selectedAssignment.salaryBreakdown.hra || 0
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Conveyance Allowance:</span>
                            <span className="fw-medium">
                              ₹
                              {(
                                selectedAssignment.salaryBreakdown.conveyance ||
                                0
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Special Allowance:</span>
                            <span className="fw-medium">
                              ₹
                              {(
                                selectedAssignment.salaryBreakdown
                                  .specialAllowance || 0
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          {selectedAssignment.salaryBreakdown
                            .performanceBonus && (
                            <div className="d-flex justify-content-between mb-2">
                              <span>Performance Bonus:</span>
                              <span className="fw-medium text-success">
                                ₹
                                {(
                                  selectedAssignment.salaryBreakdown
                                    .performanceBonus || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {selectedAssignment.salaryBreakdown
                            .salesCommission && (
                            <div className="d-flex justify-content-between mb-2">
                              <span>Sales Commission:</span>
                              <span className="fw-medium text-success">
                                ₹
                                {(
                                  selectedAssignment.salaryBreakdown
                                    .salesCommission || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {selectedAssignment.salaryBreakdown.stockOptions && (
                            <div className="d-flex justify-content-between mb-2">
                              <span>Stock Options:</span>
                              <span className="fw-medium text-success">
                                ₹
                                {(
                                  selectedAssignment.salaryBreakdown
                                    .stockOptions || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {selectedAssignment.salaryBreakdown
                            .otherAllowances && (
                            <div className="d-flex justify-content-between mb-2">
                              <span>Other Allowances:</span>
                              <span className="fw-medium">
                                ₹
                                {(
                                  selectedAssignment.salaryBreakdown
                                    .otherAllowances || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {selectedAssignment.salaryBreakdown
                            .shiftAllowance && (
                            <div className="d-flex justify-content-between mb-2">
                              <span>Shift Allowance:</span>
                              <span className="fw-medium">
                                ₹
                                {(
                                  selectedAssignment.salaryBreakdown
                                    .shiftAllowance || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAssignmentViewModal(false);
                    setSelectedAssignment(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Structure Modal - FORM VERSION */}
      {showChangeStructure && employeeToChange && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Edit2 size={20} className="me-2" />
                  Edit Employee Assignment: {employeeToChange.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowChangeStructure(false);
                    setEmployeeToChange(null);
                    setNewStructureSelection("");
                    setNewEffectiveDate("");
                    setChangeReason("");
                    setCustomReason("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {/* Employee Information Section - EDITABLE */}
                <div className="card border mb-4">
                  <div className="card-body">
                    <h6 className="border-bottom pb-2 mb-3">
                      <User size={16} className="me-2 text-primary" />
                      Employee Information
                    </h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Employee ID <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={employeeToChange.employeeId || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              employeeId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Employee Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={employeeToChange.name || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={employeeToChange.email || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Department</label>
                        <select
                          className="form-select"
                          value={employeeToChange.department || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              department: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Department</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Product">Product</option>
                          <option value="Design">Design</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                          <option value="Operations">Operations</option>
                          <option value="Finance">Finance</option>
                          <option value="HR">HR</option>
                          <option value="IT">IT</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Location</label>
                        <select
                          className="form-select"
                          value={employeeToChange.location || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              location: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Location</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Pune">Pune</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Remote">Remote</option>
                          <option value="International">International</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Employee Type</label>
                        <select
                          className="form-select"
                          value={employeeToChange.employeeType || "regular"}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              employeeType: e.target.value,
                            })
                          }
                        >
                          <option value="regular">Regular</option>
                          <option value="contractor">Contractor</option>
                          <option value="intern">Intern</option>
                          <option value="temporary">Temporary</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Notice Period (days)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={employeeToChange.noticePeriod || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              noticePeriod: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Contract End Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={employeeToChange.contractEndDate || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              contractEndDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Assignment Section - EDITABLE */}
                <div className="card border mb-4">
                  <div className="card-body">
                    <h6 className="border-bottom pb-2 mb-3">
                      <Clock size={16} className="me-2 text-primary" />
                      Current Assignment Details
                    </h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Current Structure</label>
                        <select
                          className="form-select"
                          value={employeeToChange.currentStructure || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              currentStructure: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Structure</option>
                          {structures.map((structure) => (
                            <option key={structure.id} value={structure.name}>
                              {structure.name} (Grade {structure.grade})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Current Grade</label>
                        <select
                          className="form-select"
                          value={employeeToChange.grade || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              grade: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Grade</option>
                          <option value="A">Grade A</option>
                          <option value="B">Grade B</option>
                          <option value="C">Grade C</option>
                          <option value="D">Grade D</option>
                          <option value="CT">Contract - Technical</option>
                          <option value="IN">Intern</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Current Level</label>
                        <select
                          className="form-select"
                          value={employeeToChange.level || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              level: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Level</option>
                          <option value="L6">L6 (Senior Management)</option>
                          <option value="L5">L5 (Management)</option>
                          <option value="L4">L4 (Senior)</option>
                          <option value="L3">L3 (Junior)</option>
                          <option value="L2">L2 (Entry)</option>
                          <option value="L1">L1 (Intern/Trainee)</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Current CTC (₹) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={employeeToChange.ctc || 0}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              ctc: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Monthly Take-Home (₹)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={employeeToChange.takeHome || 0}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              takeHome: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Monthly Gross Salary (₹)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={employeeToChange.grossSalary || 0}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              grossSalary: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Effective Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={employeeToChange.effectiveDate || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              effectiveDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Assignment Type</label>
                        <select
                          className="form-select"
                          value={employeeToChange.assignmentType || "initial"}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              assignmentType: e.target.value,
                            })
                          }
                        >
                          <option value="initial">Initial</option>
                          <option value="revision">Revision</option>
                          <option value="promotion">Promotion</option>
                          <option value="transfer">Transfer</option>
                          <option value="correction">Correction</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Previous Structure</label>
                        <input
                          type="text"
                          className="form-control"
                          value={employeeToChange.previousStructure || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              previousStructure: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Previous CTC (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={employeeToChange.previousCTC || 0}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              previousCTC: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Created On</label>
                        <input
                          type="date"
                          className="form-control"
                          value={employeeToChange.createdOn || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              createdOn: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Created By</label>
                        <input
                          type="text"
                          className="form-control"
                          value={employeeToChange.createdBy || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              createdBy: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Structure Assignment - NEW STRUCTURE SELECTION */}
                <div className="card border mb-4">
                  <div className="card-body">
                    <h6 className="border-bottom pb-2 mb-3">
                      <Settings size={16} className="me-2 text-success" />
                      Assign New Structure (Optional)
                    </h6>

                    <div className="row">
                      {/* New Structure Selection */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Select New Structure
                        </label>
                        <select
                          className="form-select"
                          value={newStructureSelection || ""}
                          onChange={(e) =>
                            setNewStructureSelection(e.target.value)
                          }
                        >
                          <option value="">
                            Choose a new structure (optional)...
                          </option>
                          {structures
                            .filter((s) => s.status === "active")
                            .map((structure) => (
                              <option key={structure.id} value={structure.id}>
                                {structure.name} • Grade {structure.grade} • ₹
                                {structure.ctc?.toLocaleString()}
                              </option>
                            ))}
                        </select>
                        <div className="form-text">
                          Leave empty if not changing structure
                        </div>
                      </div>

                      {/* New Effective Date */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          New Effective Date (if changing)
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={newEffectiveDate || ""}
                          onChange={(e) => setNewEffectiveDate(e.target.value)}
                        />
                      </div>

                      {/* Change Reason */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Change Reason (if any)
                        </label>
                        <select
                          className="form-select"
                          value={changeReason || ""}
                          onChange={(e) => setChangeReason(e.target.value)}
                        >
                          <option value="">
                            Select reason (if changing)...
                          </option>
                          <option value="promotion">Promotion</option>
                          <option value="salary_revision">
                            Salary Revision
                          </option>
                          <option value="role_change">Role Change</option>
                          <option value="correction">Data Correction</option>
                          <option value="performance">Performance Based</option>
                          <option value="market_adjustment">
                            Market Adjustment
                          </option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Custom Reason */}
                      {changeReason === "other" && (
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Specify Reason</label>
                          <textarea
                            className="form-control"
                            rows="2"
                            placeholder="Please specify the reason..."
                            value={customReason || ""}
                            onChange={(e) => setCustomReason(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Configuration Settings - EDITABLE */}
                <div className="card border mb-4">
                  <div className="card-body">
                    <h6 className="border-bottom pb-2 mb-3">
                      <Zap size={16} className="me-2 text-warning" />
                      Configuration Settings
                    </h6>
                    <div className="row">
                      {/* Allocation Rules */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Allocation Type</label>
                        <select
                          className="form-select"
                          value={
                            employeeToChange.allocationRules?.type || "auto"
                          }
                          onChange={(e) => {
                            setEmployeeToChange({
                              ...employeeToChange,
                              allocationRules: {
                                ...employeeToChange.allocationRules,
                                type: e.target.value,
                              },
                            });
                          }}
                        >
                          <option value="auto">Auto Assignment</option>
                          <option value="manual">Manual Assignment</option>
                          <option value="bulk">Bulk Assignment</option>
                        </select>
                      </div>

                      {/* Assignment Status */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Assignment Status</label>
                        <select
                          className="form-select"
                          value={employeeToChange.assignmentStatus || "active"}
                          onChange={(e) => {
                            setEmployeeToChange({
                              ...employeeToChange,
                              assignmentStatus: e.target.value,
                            });
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="expired">Expired</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>

                      {/* Approval Status */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Approval Status</label>
                        <select
                          className="form-select"
                          value={employeeToChange.approvalStatus || "approved"}
                          onChange={(e) => {
                            setEmployeeToChange({
                              ...employeeToChange,
                              approvalStatus: e.target.value,
                            });
                          }}
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>

                      {/* Approver */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Approver</label>
                        <input
                          type="text"
                          className="form-control"
                          value={employeeToChange.approver || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              approver: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Approval Date */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Approval Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={employeeToChange.approvalDate || ""}
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              approvalDate: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Last Modified */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Last Modified</label>
                        <input
                          type="date"
                          className="form-control"
                          value={
                            employeeToChange.lastModified ||
                            new Date().toISOString().split("T")[0]
                          }
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              lastModified: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Last Modified By */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Last Modified By</label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            employeeToChange.lastModifiedBy || "Current User"
                          }
                          onChange={(e) =>
                            setEmployeeToChange({
                              ...employeeToChange,
                              lastModifiedBy: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Pro-rata Setting */}
                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="proRataEnabled"
                            checked={
                              employeeToChange.allocationRules?.proRata || false
                            }
                            onChange={(e) => {
                              setEmployeeToChange({
                                ...employeeToChange,
                                allocationRules: {
                                  ...employeeToChange.allocationRules,
                                  proRata: e.target.checked,
                                },
                              });
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="proRataEnabled"
                          >
                            Pro-rata Calculation Enabled
                          </label>
                        </div>
                      </div>

                      {/* Custom Rules */}
                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="customRulesEnabled"
                            checked={
                              employeeToChange.allocationRules
                                ?.hasCustomRules || false
                            }
                            onChange={(e) => {
                              setEmployeeToChange({
                                ...employeeToChange,
                                allocationRules: {
                                  ...employeeToChange.allocationRules,
                                  hasCustomRules: e.target.checked,
                                },
                              });
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="customRulesEnabled"
                          >
                            Has Custom Rules
                          </label>
                        </div>
                      </div>

                      {/* Custom Rules Text Area */}
                      {employeeToChange.allocationRules?.hasCustomRules && (
                        <div className="col-12 mb-3">
                          <label className="form-label">Custom Rules</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Enter custom allocation rules..."
                            value={
                              employeeToChange.allocationRules?.rules?.join(
                                "\n",
                              ) || ""
                            }
                            onChange={(e) => {
                              setEmployeeToChange({
                                ...employeeToChange,
                                allocationRules: {
                                  ...employeeToChange.allocationRules,
                                  rules: e.target.value.split("\n"),
                                },
                              });
                            }}
                          />
                        </div>
                      )}

                      {/* Additional Notes */}
                      <div className="col-12 mb-3">
                        <label className="form-label">Additional Notes</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Add any additional notes or comments..."
                          value={employeeToChange.comments || ""}
                          onChange={(e) => {
                            setEmployeeToChange({
                              ...employeeToChange,
                              comments: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structure Comparison (Conditional) */}
                {newStructureSelection && (
                  <div className="card border mb-4">
                    <div className="card-body">
                      <h6 className="border-bottom pb-2 mb-3">
                        <BarChart size={16} className="me-2 text-info" />
                        New Structure Comparison Preview
                      </h6>
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th width="25%">Component</th>
                              <th width="25%" className="text-center">
                                Current
                              </th>
                              <th width="25%" className="text-center">
                                New
                              </th>
                              <th width="25%" className="text-center">
                                Change Impact
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Annual CTC</td>
                              <td className="text-center">
                                ₹{employeeToChange.ctc.toLocaleString()}
                              </td>
                              <td className="text-center">
                                {(() => {
                                  const newStruct = structures.find(
                                    (s) =>
                                      s.id.toString() === newStructureSelection,
                                  );
                                  return newStruct?.ctc
                                    ? `₹${newStruct.ctc.toLocaleString()}`
                                    : "N/A";
                                })()}
                              </td>
                              <td
                                className={`text-center ${(() => {
                                  const newStruct = structures.find(
                                    (s) =>
                                      s.id.toString() === newStructureSelection,
                                  );
                                  const newCTC = newStruct?.ctc || 0;
                                  const change =
                                    newCTC - (employeeToChange.ctc || 0);
                                  return change > 0
                                    ? "text-success"
                                    : change < 0
                                      ? "text-danger"
                                      : "text-muted";
                                })()}`}
                              >
                                {(() => {
                                  const newStruct = structures.find(
                                    (s) =>
                                      s.id.toString() === newStructureSelection,
                                  );
                                  const newCTC = newStruct?.ctc || 0;
                                  const change =
                                    newCTC - (employeeToChange.ctc || 0);
                                  if (change > 0)
                                    return `+₹${change.toLocaleString()} (Increase)`;
                                  if (change < 0)
                                    return `-₹${Math.abs(change).toLocaleString()} (Decrease)`;
                                  return "No Change";
                                })()}
                              </td>
                            </tr>
                            <tr>
                              <td>Monthly Take-Home</td>
                              <td className="text-center">
                                ₹
                                {employeeToChange.takeHome?.toLocaleString() ||
                                  "N/A"}
                              </td>
                              <td className="text-center">
                                {(() => {
                                  const newStruct = structures.find(
                                    (s) =>
                                      s.id.toString() === newStructureSelection,
                                  );
                                  const breakdown =
                                    calculateBreakdown(newStruct);
                                  return breakdown?.takeHome
                                    ? `₹${breakdown.takeHome.toLocaleString()}`
                                    : "N/A";
                                })()}
                              </td>
                              <td
                                className={`text-center ${(() => {
                                  const newStruct = structures.find(
                                    (s) =>
                                      s.id.toString() === newStructureSelection,
                                  );
                                  const breakdown =
                                    calculateBreakdown(newStruct);
                                  const newTakeHome = breakdown?.takeHome || 0;
                                  const change =
                                    newTakeHome -
                                    (employeeToChange.takeHome || 0);
                                  return change > 0
                                    ? "text-success"
                                    : change < 0
                                      ? "text-danger"
                                      : "text-muted";
                                })()}`}
                              >
                                {(() => {
                                  const newStruct = structures.find(
                                    (s) =>
                                      s.id.toString() === newStructureSelection,
                                  );
                                  const breakdown =
                                    calculateBreakdown(newStruct);
                                  const newTakeHome = breakdown?.takeHome || 0;
                                  const change =
                                    newTakeHome -
                                    (employeeToChange.takeHome || 0);
                                  if (change > 0)
                                    return `+₹${change.toLocaleString()}/month`;
                                  if (change < 0)
                                    return `-₹${Math.abs(change).toLocaleString()}/month`;
                                  return "No Change";
                                })()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowChangeStructure(false);
                    setEmployeeToChange(null);
                    setNewStructureSelection("");
                    setNewEffectiveDate("");
                    setChangeReason("");
                    setCustomReason("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    // Validate required fields
                    if (
                      !employeeToChange.employeeId ||
                      !employeeToChange.name ||
                      !employeeToChange.ctc
                    ) {
                      setActionNotification({
                        show: true,
                        type: "error",
                        title: "Validation Error",
                        message:
                          "Please fill Employee ID, Name, and CTC fields.",
                      });
                      return;
                    }

                    const newStruct = newStructureSelection
                      ? structures.find(
                          (s) => s.id.toString() === newStructureSelection,
                        )
                      : null;

                    // Update the assignment
                    const updatedAssignments = assignments.map((a) =>
                      a.id === employeeToChange.id
                        ? {
                            ...a,
                            // Employee Information
                            employeeId: employeeToChange.employeeId,
                            name: employeeToChange.name,
                            email: employeeToChange.email,
                            department: employeeToChange.department,
                            location: employeeToChange.location,
                            employeeType: employeeToChange.employeeType,
                            noticePeriod: employeeToChange.noticePeriod,
                            contractEndDate: employeeToChange.contractEndDate,

                            // Current Assignment
                            currentStructure:
                              newStruct?.name ||
                              employeeToChange.currentStructure,
                            grade: newStruct?.grade || employeeToChange.grade,
                            level: newStruct?.level || employeeToChange.level,
                            ctc: newStruct?.ctc || employeeToChange.ctc,
                            takeHome: newStruct
                              ? calculateBreakdown(newStruct)?.takeHome
                              : employeeToChange.takeHome,
                            grossSalary: newStruct
                              ? calculateBreakdown(newStruct)?.gross
                              : employeeToChange.grossSalary,
                            effectiveDate:
                              newEffectiveDate ||
                              employeeToChange.effectiveDate,
                            assignmentType: employeeToChange.assignmentType,
                            previousStructure:
                              employeeToChange.previousStructure,
                            previousCTC: employeeToChange.previousCTC,
                            createdOn: employeeToChange.createdOn,
                            createdBy: employeeToChange.createdBy,

                            // Configuration
                            assignmentStatus: employeeToChange.assignmentStatus,
                            approvalStatus: employeeToChange.approvalStatus,
                            approver: employeeToChange.approver,
                            approvalDate: employeeToChange.approvalDate,
                            allocationRules: employeeToChange.allocationRules,
                            comments: employeeToChange.comments,
                            changeReason:
                              customReason ||
                              changeReason ||
                              employeeToChange.changeReason,
                            lastModified: new Date()
                              .toISOString()
                              .split("T")[0],
                            lastModifiedBy: "Current User",
                          }
                        : a,
                    );

                    setAssignments(updatedAssignments);

                    // Close modal and reset
                    setShowChangeStructure(false);
                    setEmployeeToChange(null);
                    setNewStructureSelection("");
                    setNewEffectiveDate("");
                    setChangeReason("");
                    setCustomReason("");

                    // Show success notification
                    setActionNotification({
                      show: true,
                      type: "success",
                      title: "Assignment Updated",
                      message: `${employeeToChange.name}'s assignment has been updated successfully.`,
                    });
                  }}
                >
                  <Save size={16} className="me-2" />
                  Save All Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Assignment Modal */}
      {showIndividualAssignModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <User size={20} className="me-2" />
                  Individual Employee Assignment
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowIndividualAssignModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Employee Information Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3">
                      <User size={16} className="me-2 text-primary" />
                      Employee Information
                    </h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Employee ID <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="EMP001"
                          value={newAssignment.employeeId}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              employeeId: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Employee Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="John Doe"
                          value={newAssignment.name}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="john.doe@company.com"
                          value={newAssignment.email}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Department</label>
                        <select
                          className="form-select"
                          value={newAssignment.department}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              department: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Department</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Product">Product</option>
                          <option value="Design">Design</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                          <option value="Operations">Operations</option>
                          <option value="Finance">Finance</option>
                          <option value="HR">HR</option>
                          <option value="IT">IT</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Location</label>
                        <select
                          className="form-select"
                          value={newAssignment.location}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              location: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Location</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Pune">Pune</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Remote">Remote</option>
                          <option value="International">International</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Employee Type</label>
                        <select
                          className="form-select"
                          value={newAssignment.employeeType}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              employeeType: e.target.value,
                            })
                          }
                        >
                          <option value="regular">Regular</option>
                          <option value="contractor">Contractor</option>
                          <option value="intern">Intern</option>
                          <option value="temporary">Temporary</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Salary Structure Assignment Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3">
                      <FileText size={16} className="me-2 text-primary" />
                      Salary Structure Assignment
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Select Structure{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={newAssignment.structureId}
                          onChange={(e) => {
                            const selectedStructureId = e.target.value;
                            const selectedStructure = structures.find(
                              (s) => s.id.toString() === selectedStructureId,
                            );

                            setNewAssignment({
                              ...newAssignment,
                              structureId: selectedStructureId,
                              grade: selectedStructure?.grade || "",
                              level: selectedStructure?.level || "",
                              ctc: selectedStructure?.ctc || "",
                            });
                          }}
                        >
                          <option value="">Select Salary Structure</option>
                          {structures
                            .filter((s) => s.status === "active")
                            .map((structure) => (
                              <option key={structure.id} value={structure.id}>
                                {structure.name} (Grade {structure.grade}, ₹
                                {structure.ctc.toLocaleString()})
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Grade</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newAssignment.grade}
                          readOnly
                        />
                        <div className="form-text">
                          Auto-filled from structure
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Level</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newAssignment.level}
                          readOnly
                        />
                        <div className="form-text">
                          Auto-filled from structure
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Annual CTC (₹) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={newAssignment.ctc}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              ctc: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Effective Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={newAssignment.effectiveDate}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              effectiveDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Assignment Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={newAssignment.assignmentType}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              assignmentType: e.target.value,
                            })
                          }
                        >
                          <option value="initial">Initial Assignment</option>
                          <option value="revision">Salary Revision</option>
                          <option value="promotion">Promotion</option>
                          <option value="transfer">Transfer</option>
                          <option value="correction">Data Correction</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Allocation Rules Section */}
                  <div className="col-12 mb-4">
                    <h6 className="border-bottom pb-2 mb-3">
                      <Settings size={16} className="me-2 text-warning" />
                      Allocation Rules Configuration
                    </h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Allocation Type</label>
                        <select
                          className="form-select"
                          value={newAssignment.allocationRules.type}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              allocationRules: {
                                ...newAssignment.allocationRules,
                                type: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="auto">Auto Assignment</option>
                          <option value="manual">Manual Assignment</option>
                          <option value="bulk">Bulk Assignment</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Allocation Basis</label>
                        <select
                          className="form-select"
                          value={newAssignment.allocationRules.basis}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              allocationRules: {
                                ...newAssignment.allocationRules,
                                basis: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="grade_match">Grade Match</option>
                          <option value="department_basis">
                            Department Basis
                          </option>
                          <option value="location_basis">Location Basis</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3 d-flex align-items-end">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="proRataSwitch"
                            checked={newAssignment.allocationRules.proRata}
                            onChange={(e) =>
                              setNewAssignment({
                                ...newAssignment,
                                allocationRules: {
                                  ...newAssignment.allocationRules,
                                  proRata: e.target.checked,
                                },
                              })
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="proRataSwitch"
                          >
                            Pro-rata Calculation
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="customRulesSwitch"
                            checked={
                              newAssignment.allocationRules.hasCustomRules
                            }
                            onChange={(e) =>
                              setNewAssignment({
                                ...newAssignment,
                                allocationRules: {
                                  ...newAssignment.allocationRules,
                                  hasCustomRules: e.target.checked,
                                },
                              })
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="customRulesSwitch"
                          >
                            Apply Custom Rules
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Notice Period (days)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={newAssignment.noticePeriod}
                          onChange={(e) =>
                            setNewAssignment({
                              ...newAssignment,
                              noticePeriod: parseInt(e.target.value) || 30,
                            })
                          }
                        />
                      </div>
                      {newAssignment.allocationRules.hasCustomRules && (
                        <div className="col-12 mb-3">
                          <label className="form-label">Custom Rules</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Enter custom allocation rules (one per line)..."
                            value={newAssignment.allocationRules.rules.join(
                              "\n",
                            )}
                            onChange={(e) =>
                              setNewAssignment({
                                ...newAssignment,
                                allocationRules: {
                                  ...newAssignment.allocationRules,
                                  rules: e.target.value.split("\n"),
                                },
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview Section */}
                  {newAssignment.structureId && (
                    <div className="col-12 mb-4">
                      <div className="card border">
                        <div className="card-body">
                          <h6 className="border-bottom pb-2 mb-3">
                            <Eye size={16} className="me-2 text-info" />
                            Assignment Preview
                          </h6>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-2">
                                <small className="text-muted">
                                  Selected Structure
                                </small>
                                <div className="fw-medium">
                                  {structures.find(
                                    (s) =>
                                      s.id.toString() ===
                                      newAssignment.structureId,
                                  )?.name || "N/A"}
                                </div>
                              </div>
                              <div className="mb-2">
                                <small className="text-muted">
                                  Grade & Level
                                </small>
                                <div className="fw-medium">
                                  Grade {newAssignment.grade} |{" "}
                                  {newAssignment.level}
                                </div>
                              </div>
                              <div className="mb-2">
                                <small className="text-muted">Annual CTC</small>
                                <div className="fw-bold text-primary">
                                  ₹
                                  {parseInt(
                                    newAssignment.ctc || 0,
                                  ).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-2">
                                <small className="text-muted">
                                  Estimated Take-Home
                                </small>
                                <div className="fw-bold text-success">
                                  {(() => {
                                    const selectedStructure = structures.find(
                                      (s) =>
                                        s.id.toString() ===
                                        newAssignment.structureId,
                                    );
                                    const breakdown =
                                      calculateBreakdown(selectedStructure);
                                    return breakdown?.takeHome
                                      ? `₹${breakdown.takeHome.toLocaleString()}/month`
                                      : "N/A";
                                  })()}
                                </div>
                              </div>
                              <div className="mb-2">
                                <small className="text-muted">
                                  Effective From
                                </small>
                                <div className="fw-medium">
                                  {newAssignment.effectiveDate}
                                </div>
                              </div>
                              <div className="mb-2">
                                <small className="text-muted">
                                  Assignment Type
                                </small>
                                <div className="fw-medium">
                                  {newAssignment.assignmentType
                                    .charAt(0)
                                    .toUpperCase() +
                                    newAssignment.assignmentType.slice(1)}
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
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowIndividualAssignModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    // Validate required fields
                    if (
                      !newAssignment.employeeId ||
                      !newAssignment.name ||
                      !newAssignment.structureId ||
                      !newAssignment.ctc
                    ) {
                      setActionNotification({
                        show: true,
                        type: "error",
                        title: "Validation Error",
                        message: "Please fill all required fields (*).",
                      });
                      return;
                    }

                    const selectedStructure = structures.find(
                      (s) => s.id.toString() === newAssignment.structureId,
                    );
                    const breakdown = calculateBreakdown(selectedStructure);

                    // Create new assignment
                    const newAssignmentObj = {
                      id: assignments.length + 1,
                      employeeId: newAssignment.employeeId,
                      name: newAssignment.name,
                      email: newAssignment.email,
                      department: newAssignment.department,
                      location: newAssignment.location,
                      grade: selectedStructure?.grade || newAssignment.grade,
                      level: selectedStructure?.level || newAssignment.level,
                      currentStructure: selectedStructure?.name || "",
                      ctc: parseInt(newAssignment.ctc) || 0,
                      takeHome: breakdown?.takeHome || 0,
                      grossSalary: breakdown?.gross || 0,
                      effectiveDate: newAssignment.effectiveDate,
                      assignmentType: newAssignment.assignmentType,
                      allocationRules: newAssignment.allocationRules,
                      employeeType: newAssignment.employeeType,
                      noticePeriod: newAssignment.noticePeriod,
                      assignmentStatus: "active",
                      approvalStatus: "approved",
                      createdOn: new Date().toISOString().split("T")[0],
                      createdBy: "Current User",
                      lastModified: new Date().toISOString().split("T")[0],
                      lastModifiedBy: "Current User",
                    };

                    // Add to assignments
                    setAssignments([...assignments, newAssignmentObj]);

                    // Close modal and reset
                    setShowIndividualAssignModal(false);
                    setNewAssignment({
                      employeeId: "",
                      name: "",
                      email: "",
                      department: "",
                      grade: "",
                      level: "",
                      structureId: "",
                      ctc: "",
                      effectiveDate: new Date().toISOString().split("T")[0],
                      assignmentType: "initial",
                      location: "",
                      employeeType: "regular",
                      noticePeriod: 30,
                      allocationRules: {
                        type: "auto",
                        basis: "grade_match",
                        proRata: true,
                        hasCustomRules: false,
                        rules: [],
                      },
                    });

                    // Show success notification
                    setActionNotification({
                      show: true,
                      type: "success",
                      title: "Assignment Created",
                      message: `${newAssignment.name} has been assigned successfully.`,
                    });
                  }}
                >
                  <Save size={16} className="me-2" />
                  Assign Structure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Component Modal */}
      {showComponentModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {selectedComponent ? (
                // EDIT COMPONENT MODAL
                <EditComponentModal
                  selectedComponent={selectedComponent}
                  components={components}
                  setComponents={setComponents}
                  onClose={() => {
                    setShowComponentModal(false);
                    setSelectedComponent(null);
                  }}
                />
              ) : (
                // ADD NEW COMPONENT MODAL
                <AddComponentModal
                  components={components}
                  setComponents={setComponents}
                  onClose={() => setShowComponentModal(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryStructure;
