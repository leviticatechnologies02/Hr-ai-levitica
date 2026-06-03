import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  Search,
  Download,
  Eye,
  Check,
  X,
  Plus,
  Filter,
  Users,
  Calendar,
  FileText,
  Share2,
  Database,
  Layout,
  BarChart3,
  Clock,
  Edit,
  User,
  MapPin,
  File,
  FileSpreadsheet,
  Settings,
} from "lucide-react";

/* ---------------- PDF Generation Library ---------------- */
import jsPDF from "jspdf";
// IMPORTANT: Import autotable correctly
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/* ---------------- Helpers ---------------- */
const statusBadge = (status) => {
  const map = {
    Draft: "bg-secondary-subtle text-secondary",
    Published: "bg-success-subtle text-success",
    "In Progress": "bg-info-subtle text-info",
    Scheduled: "bg-primary-subtle text-primary",
    Archived: "bg-dark-subtle text-dark",
    Error: "bg-danger-subtle text-danger",
  };
  return map[status] || "bg-light text-muted";
};

// Get icon based on category
const getIconByCategory = (category) => {
  const iconMap = {
    Builder: <Layout size={16} />,
    Data: <Database size={16} />,
    Filter: <Filter size={16} />,
    Analysis: <BarChart3 size={16} />,
    Template: <FileText size={16} />,
    Automation: <Clock size={16} />,
    Sharing: <Share2 size={16} />,
    Export: <Download size={16} />,
    Subscription: <Calendar size={16} />,
    API: <Database size={16} />,
    Employee: <User size={16} />,
  };
  return iconMap[category] || <FileText size={16} />;
};

/* ---------------- Employee Data ---------------- */
const generateEmployeeData = () => {
  const employees = [
    {
      name: "John Smith",
      email: "john.smith@company.com",
      phone: "+1 (555) 123-4567",
    },
    {
      name: "Emma Johnson",
      email: "emma.j@company.com",
      phone: "+1 (555) 234-5678",
    },
    {
      name: "Michael Brown",
      email: "michael.b@company.com",
      phone: "+1 (555) 345-6789",
    },
    {
      name: "Sarah Davis",
      email: "sarah.d@company.com",
      phone: "+1 (555) 456-7890",
    },
    {
      name: "Robert Wilson",
      email: "robert.w@company.com",
      phone: "+1 (555) 567-8901",
    },
    {
      name: "Lisa Miller",
      email: "lisa.m@company.com",
      phone: "+1 (555) 678-9012",
    },
    {
      name: "David Moore",
      email: "david.m@company.com",
      phone: "+1 (555) 789-0123",
    },
    {
      name: "Jennifer Taylor",
      email: "jennifer.t@company.com",
      phone: "+1 (555) 890-1234",
    },
    {
      name: "James Anderson",
      email: "james.a@company.com",
      phone: "+1 (555) 901-2345",
    },
    {
      name: "Patricia Thomas",
      email: "patricia.t@company.com",
      phone: "+1 (555) 012-3456",
    },
  ];

  const locations = [
    "New York",
    "London",
    "Tokyo",
    "Sydney",
    "Berlin",
    "Toronto",
    "Paris",
    "Singapore",
    "Dubai",
    "Mumbai",
  ];
  const costCenters = ["CC-100", "CC-200", "CC-300", "CC-400", "CC-500"];
  const designations = [
    "Manager",
    "Developer",
    "Analyst",
    "Designer",
    "Director",
    "Engineer",
    "Consultant",
  ];
  const managers = [
    "Alex Johnson",
    "Maria Garcia",
    "David Lee",
    "Sophia Chen",
    "Robert Kim",
    "Jessica Wang",
    "Thomas Brown",
  ];
  const departments = ["IT", "HR", "Finance", "Marketing", "Operations"];
  const currencies = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "CAD",
    "AUD",
    "INR",
    "CNY",
    "AED",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const employee = employees[Math.floor(Math.random() * employees.length)];
    const manager = managers[Math.floor(Math.random() * managers.length)];
    const department =
      departments[Math.floor(Math.random() * departments.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];

    // Generate email based on department
    const emailDomains = {
      IT: "it.company.com",
      HR: "hr.company.com",
      Finance: "finance.company.com",
      Marketing: "marketing.company.com",
      Operations: "operations.company.com",
    };

    const domain = emailDomains[department] || "company.com";
    const firstName = employee.name.split(" ")[0].toLowerCase();
    const lastName = employee.name.split(" ")[1].toLowerCase();
    const email = `${firstName}.${lastName}@${domain}`;

    // Generate date for last updated (within last 30 days)
    const today = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const lastUpdatedDate = new Date(today);
    lastUpdatedDate.setDate(today.getDate() - randomDaysAgo);
    const lastUpdated = lastUpdatedDate.toISOString().split("T")[0];

    return {
      id: i + 1000,
      employeeName: employee.name,
      employeeId: `EMP-${String(1000 + i).padStart(4, "0")}`,
      designation:
        designations[Math.floor(Math.random() * designations.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      costCenter: costCenters[Math.floor(Math.random() * costCenters.length)],
      dateTime: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(
        2,
        "0"
      )}-${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )} ${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, "0")}`,
      payDays: Math.floor(Math.random() * 30) + 1,
      salary: Math.floor(Math.random() * 100000) + 50000,
      currency: currency,
      department: department,
      status: ["Active", "On Leave", "Inactive", "Probation", "Contract"][
        Math.floor(Math.random() * 5)
      ],
      email: email,
      phone: employee.phone,
      manager: manager,
      lastUpdated: lastUpdated,
    };
  });
};
/* ---------------- Main Data ---------------- */
const reportBuilderFeaturesList = [
  {
    id: 1,
    name: "Drag-and-drop interface",
    category: "Builder",
    status: "Published",
    lastUpdated: "2025-11-25",
    icon: getIconByCategory("Builder"),
  },
  {
    id: 2,
    name: "Select data sources",
    category: "Data",
    status: "Published",
    lastUpdated: "2025-11-24",
    icon: getIconByCategory("Data"),
  },
  {
    id: 3,
    name: "Choose fields to include",
    category: "Data",
    status: "Published",
    lastUpdated: "2025-11-23",
    icon: getIconByCategory("Data"),
  },
  {
    id: 4,
    name: "Apply filters",
    category: "Filter",
    status: "Published",
    lastUpdated: "2025-11-22",
    icon: getIconByCategory("Filter"),
  },
  {
    id: 5,
    name: "Group by dimensions",
    category: "Analysis",
    status: "In Progress",
    lastUpdated: "2025-11-21",
    icon: getIconByCategory("Analysis"),
  },
  {
    id: 6,
    name: "Add calculations",
    category: "Analysis",
    status: "Published",
    lastUpdated: "2025-11-20",
    icon: getIconByCategory("Analysis"),
  },
  {
    id: 7,
    name: "Sort and order options",
    category: "Builder",
    status: "Published",
    lastUpdated: "2025-11-19",
    icon: getIconByCategory("Builder"),
  },
  {
    id: 8,
    name: "Save report templates",
    category: "Template",
    status: "Published",
    lastUpdated: "2025-11-18",
    icon: getIconByCategory("Template"),
  },
  {
    id: 9,
    name: "Schedule automated generation",
    category: "Automation",
    status: "Scheduled",
    lastUpdated: "2025-11-17",
    icon: getIconByCategory("Automation"),
  },
  {
    id: 10,
    name: "Email distribution list",
    category: "Sharing",
    status: "Published",
    lastUpdated: "2025-11-16",
    icon: getIconByCategory("Sharing"),
  },
  {
    id: 11,
    name: "Export formats",
    category: "Export",
    status: "Published",
    lastUpdated: "2025-11-15",
    icon: getIconByCategory("Export"),
  },
];

const reportSharingList = [
  {
    id: 12,
    name: "Share with specific users/roles",
    category: "Sharing",
    status: "Published",
    lastUpdated: "2025-11-14",
    icon: getIconByCategory("Sharing"),
  },
  {
    id: 13,
    name: "Public dashboard publication",
    category: "Sharing",
    status: "In Progress",
    lastUpdated: "2025-11-13",
    icon: getIconByCategory("Sharing"),
  },
  {
    id: 14,
    name: "Report subscription service",
    category: "Subscription",
    status: "Published",
    lastUpdated: "2025-11-12",
    icon: getIconByCategory("Subscription"),
  },
  {
    id: 15,
    name: "Embed reports in emails",
    category: "Sharing",
    status: "Draft",
    lastUpdated: "2025-11-11",
    icon: getIconByCategory("Sharing"),
  },
  {
    id: 16,
    name: "API access for report data",
    category: "API",
    status: "Published",
    lastUpdated: "2025-11-10",
    icon: getIconByCategory("API"),
  },
];

/* ---------------- Component ---------------- */
const CustomReportBuilder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [features, setFeatures] = useState(reportBuilderFeaturesList);
  const [sharing, setSharing] = useState(reportSharingList);
  const [employeeData, setEmployeeData] = useState(generateEmployeeData());

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isBuilderView, setIsBuilderView] = useState(true);

  const [addReportModalOpen, setAddReportModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newReportData, setNewReportData] = useState({
    id: null,
    name: "",
    category: "Builder",
    status: "Draft",
  });

  // Add these state variables to your component
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    id: null,
    employeeName: "",
    designation: "",
    department: "",
    location: "",
    costCenter: "",
    dateTime: new Date().toISOString().split("T")[0] + " 09:00",
    payDays: 21,
    salary: 50000,
    currency: "USD", // Add currency field
    status: "Active",
    lastUpdated: new Date().toISOString().split("T")[0],
    employeeId: "", // Additional fields
    email: "",
    phone: "",
    manager: "",
  });

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeeFilters, setEmployeeFilters] = useState({
    employeeName: "",
    location: "",
    department: "",
    status: "",
  });

  const [activeTab, setActiveTab] = useState("features"); // "features" or "employees"

  const perPage = 8;

  const dataSource = isBuilderView ? features : sharing;
  const getCategoryOptions = () => [
    ...new Set(dataSource.map((item) => item.category)),
  ];

  // Filter features
  const filteredFeatures = dataSource.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filteredFeatures.length / perPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredFeatures.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * perPage;
  const displayFeatures = filteredFeatures.slice(
    startIndex,
    startIndex + perPage
  );

  const allData = [...features, ...sharing];
  const kpis = {
    total: allData.length,
    published: allData.filter((r) => r.status === "Published").length,
    inProgress: allData.filter((r) => r.status === "In Progress").length,
    scheduled: allData.filter((r) => r.status === "Scheduled").length,
  };

  /* ---------------- Export Functions ---------------- */
  const exportCSV = () => {
    const headers = ["Feature Name", "Category", "Status", "Last Updated"];
    const rows = filteredFeatures.map((r) => [
      r.name,
      r.category,
      r.status,
      r.lastUpdated,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "report_features.csv";
    link.click();
  };

  const exportEmployeePDF = (employee) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Employee Report", 105, 20, { align: "center" });

    // Employee Details
    doc.setFontSize(12);
    doc.text("Employee Information", 14, 40);
    doc.setFontSize(10);

    const details = [
      ["Employee ID:", employee.employeeId || `EMP-${employee.id}`],
      ["Employee Name:", employee.employeeName],
      ["Designation:", employee.designation],
      ["Department:", employee.department],
      ["Location:", employee.location],
      ["Cost Center:", employee.costCenter],
      ["Status:", employee.status],
      ["Date & Time:", employee.dateTime],
      ["Pay Days:", employee.payDays.toString()],
      [
        "Salary:",
        `${employee.currency || "USD"} ${employee.salary.toLocaleString()}`,
      ],
      ["Email:", employee.email || "N/A"],
      ["Phone:", employee.phone || "N/A"],
      ["Reporting Manager:", employee.manager || "N/A"],
    ];

    details.forEach(([label, value], index) => {
      doc.text(label, 14, 50 + index * 7);
      doc.text(value, 60, 50 + index * 7);
    });

    // Footer
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 150);
    doc.text("Confidential", 190, 150, { align: "right" });

    doc.save(
      `Employee_Report_${employee.employeeName.replace(/\s+/g, "_")}.pdf`
    );
  };

  const exportAllEmployeesPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Employee Master Report", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()} | Total Employees: ${filteredEmployees.length
      }`,
      105,
      28,
      { align: "center" }
    );

    // Table
    const tableColumn = [
      "Name",
      "Designation",
      "Department",
      "Location",
      "Cost Center",
      "Salary",
      "Status",
    ];
    const tableRows = filteredEmployees.map((emp) => [
      emp.employeeName,
      emp.designation,
      emp.department,
      emp.location,
      emp.costCenter,
      `$${emp.salary.toLocaleString()}`,
      emp.status,
    ]);

    // Use autoTable function directly
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 40 },
    });

    // Get the final Y position from the autoTable result
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text("Summary:", 14, finalY);
    doc.setFontSize(10);
    doc.text(`• Total Employees: ${filteredEmployees.length}`, 14, finalY + 7);
    doc.text(
      `• Total Salary: $${filteredEmployees
        .reduce((sum, emp) => sum + emp.salary, 0)
        .toLocaleString()}`,
      14,
      finalY + 14
    );
    doc.text(
      `• Average Salary: $${Math.round(
        filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0) /
        filteredEmployees.length
      ).toLocaleString()}`,
      14,
      finalY + 21
    );

    doc.save("All_Employees_Report.pdf");
  };

  const exportEmployeeExcel = (employee) => {
    const worksheet = XLSX.utils.json_to_sheet([employee]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Data");

    XLSX.writeFile(
      workbook,
      `Employee_${employee.employeeName.replace(/\s+/g, "_")}.xlsx`
    );
  };

  const exportAllEmployeesExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEmployees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    XLSX.writeFile(workbook, "All_Employees.xlsx");
  };

  const exportSelectedEmployees = () => {
    if (selectedEmployees.length === 0) {
      alert("Please select employees to export");
      return;
    }

    const selectedData = employeeData.filter((emp) =>
      selectedEmployees.includes(emp.id)
    );
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Employees");

    XLSX.writeFile(workbook, "Selected_Employees.xlsx");
  };

  /* ---------------- Handlers ---------------- */
  const openModal = (feature) => {
    setSelectedFeature(feature);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFeature(null);
  };

  const openEditModal = (feature) => {
    setNewReportData({
      id: feature.id,
      name: feature.name,
      category: feature.category,
      status: feature.status,
    });
    setIsEditing(true);
    setAddReportModalOpen(true);
  };

  const closeAddReportModal = () => {
    setAddReportModalOpen(false);
    setIsEditing(false);
    setNewReportData({
      id: null,
      name: "",
      category: "Builder",
      status: "Draft",
    });
  };

  const isFeatureInBuilderList = (id) => {
    return features.some((f) => f.id === id);
  };

  const handlePublish = (f) => {
    if (isFeatureInBuilderList(f.id)) {
      setFeatures((prev) =>
        prev.map((x) => (x.id === f.id ? { ...x, status: "Published" } : x))
      );
    } else {
      setSharing((prev) =>
        prev.map((x) => (x.id === f.id ? { ...x, status: "Published" } : x))
      );
    }
    closeModal();
  };

  const handleSchedule = (f) => {
    if (isFeatureInBuilderList(f.id)) {
      setFeatures((prev) =>
        prev.map((x) => (x.id === f.id ? { ...x, status: "Scheduled" } : x))
      );
    } else {
      setSharing((prev) =>
        prev.map((x) => (x.id === f.id ? { ...x, status: "Scheduled" } : x))
      );
    }
    closeModal();
  };

  const handleDelete = (f) => {
    if (isFeatureInBuilderList(f.id)) {
      setFeatures((prev) => prev.filter((x) => x.id !== f.id));
    } else {
      setSharing((prev) => prev.filter((x) => x.id !== f.id));
    }
    closeModal();
  };

  const handleSaveReport = () => {
    if (!newReportData.name.trim()) {
      alert("Please enter a report name");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const icon = getIconByCategory(newReportData.category);

    if (isEditing) {
      const updatedReport = {
        id: newReportData.id,
        name: newReportData.name,
        category: newReportData.category,
        status: newReportData.status,
        lastUpdated: today,
        icon: icon,
      };

      if (isFeatureInBuilderList(newReportData.id)) {
        setFeatures((prev) =>
          prev.map((x) => (x.id === newReportData.id ? updatedReport : x))
        );
        setIsBuilderView(true);
      } else {
        setSharing((prev) =>
          prev.map((x) => (x.id === newReportData.id ? updatedReport : x))
        );
        setIsBuilderView(false);
      }
    } else {
      const newReport = {
        id: Date.now(),
        name: newReportData.name,
        category: newReportData.category,
        status: newReportData.status,
        lastUpdated: today,
        icon: icon,
      };

      if (
        isBuilderView ||
        [
          "Builder",
          "Data",
          "Filter",
          "Analysis",
          "Template",
          "Automation",
          "Export",
        ].includes(newReportData.category)
      ) {
        setFeatures((prev) => [newReport, ...prev]);
        setIsBuilderView(true);
      } else {
        setSharing((prev) => [newReport, ...prev]);
        setIsBuilderView(false);
      }
    }

    closeAddReportModal();
    setCurrentPage(1);
  };

  const handleAddNewReport = () => {
    setIsEditing(false);
    setNewReportData({
      id: null,
      name: "",
      category: isBuilderView ? "Builder" : "Sharing",
      status: "Draft",
    });
    setAddReportModalOpen(true);
  };

  const toggleView = (v) => {
    setIsBuilderView(v === "builder");
    setCurrentPage(1);
  };

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const selectAllEmployees = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.id));
    }
  };

  // Add these functions to your component

  // Open employee details modal
  const openEmployeeModal = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeModalOpen(true);
  };

  // Close employee modal
  const closeEmployeeModal = () => {
    setEmployeeModalOpen(false);
    setSelectedEmployee(null);
  };

  // Open edit employee modal
  // Update the openEditEmployeeModal function to include all fields
  const openEditEmployeeModal = (employee) => {
    setNewEmployeeData({
      id: employee.id,
      employeeName: employee.employeeName || "",
      employeeId: employee.employeeId || "",
      designation: employee.designation || "",
      department: employee.department || "",
      location: employee.location || "",
      costCenter: employee.costCenter || "",
      dateTime:
        employee.dateTime || new Date().toISOString().split("T")[0] + " 09:00",
      payDays: employee.payDays || 21,
      salary: employee.salary || 50000,
      currency: employee.currency || "USD",
      status: employee.status || "Active",
      lastUpdated:
        employee.lastUpdated || new Date().toISOString().split("T")[0],
      email: employee.email || "",
      phone: employee.phone || "",
      manager: employee.manager || "",
    });
    setIsEditingEmployee(true);
    setAddEmployeeModalOpen(true);
  };

  // Update the handleAddNewEmployee function
  const handleAddNewEmployee = () => {
    setIsEditingEmployee(false);
    setNewEmployeeData({
      id: null,
      employeeName: "",
      designation: "",
      department: "",
      location: "",
      costCenter: "",
      dateTime: new Date().toISOString().split("T")[0] + " 09:00",
      payDays: 21,
      salary: 50000,
      currency: "USD", // Default currency
      status: "Active",
      lastUpdated: new Date().toISOString().split("T")[0],
      employeeId: "",
      email: "",
      phone: "",
      manager: "",
    });
    setAddEmployeeModalOpen(true);
  };
  // Close add employee modal
  const closeAddEmployeeModal = () => {
    setAddEmployeeModalOpen(false);
    setIsEditingEmployee(false);
    setNewEmployeeData({
      id: null,
      employeeName: "",
      employeeId: "",
      designation: "",
      department: "IT",
      location: "New York",
      costCenter: "CC-100",
      dateTime: new Date().toISOString().split("T")[0] + " 09:00",
      payDays: 21,
      salary: 50000,
      currency: "USD",
      status: "Active",
      lastUpdated: new Date().toISOString().split("T")[0],
      email: "",
      phone: "",
      manager: "",
    });
  };
  // Save employee (add or update)
  // Update the handleSaveEmployee function to handle all fields
  const handleSaveEmployee = () => {
    if (!newEmployeeData.employeeName.trim()) {
      alert("Please enter employee name");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (isEditingEmployee && newEmployeeData.id) {
      // Update existing employee
      setEmployeeData((prev) =>
        prev.map((emp) =>
          emp.id === newEmployeeData.id
            ? {
              ...emp,
              ...newEmployeeData,
              lastUpdated: today,
              // Keep original employeeId if not provided
              employeeId: newEmployeeData.employeeId || emp.employeeId,
            }
            : emp
        )
      );
    } else {
      // Add new employee
      const newEmployee = {
        ...newEmployeeData,
        id: Date.now(),
        lastUpdated: today,
        // Generate employee ID if not provided
        employeeId:
          newEmployeeData.employeeId ||
          `EMP-${Date.now().toString().slice(-6)}`,
        // Set default currency if not provided
        currency: newEmployeeData.currency || "USD",
      };
      setEmployeeData((prev) => [newEmployee, ...prev]);
    }

    closeAddEmployeeModal();
    setSelectedEmployees([]);
  };

  // Delete employee
  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployeeData((prev) => prev.filter((emp) => emp.id !== employeeId));
      setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
    }
  };

  // Also update the filter function to include costCenter
  const filteredEmployees = employeeData.filter((employee) => {
    const matchesName =
      !employeeFilters.employeeName ||
      employee.employeeName
        .toLowerCase()
        .includes(employeeFilters.employeeName.toLowerCase());
    const matchesLocation =
      !employeeFilters.location ||
      employee.location
        .toLowerCase()
        .includes(employeeFilters.location.toLowerCase());
    const matchesDepartment =
      !employeeFilters.department ||
      employee.department
        .toLowerCase()
        .includes(employeeFilters.department.toLowerCase());
    const matchesCostCenter =
      !employeeFilters.costCenter ||
      employee.costCenter
        .toLowerCase()
        .includes(employeeFilters.costCenter.toLowerCase());
    const matchesStatus =
      !employeeFilters.status || employee.status === employeeFilters.status;

    return (
      matchesName &&
      matchesLocation &&
      matchesDepartment &&
      matchesCostCenter &&
      matchesStatus
    );
  });

  // Update resetEmployeeFilters to include costCenter
  const resetEmployeeFilters = () => {
    setEmployeeFilters({
      employeeName: "",
      location: "",
      department: "",
      costCenter: "",
      status: "",
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter, isBuilderView]);

  return (
    <>
      <div className="container-fluid p-4">
        {/* Header */}

        <div className="mb-4">
          <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
            <Icon icon="heroicons: Pencil-Edit" />
            Custom Report Builder
          </h5>
          <p className="text-muted"> Manage report features and generate employee reports</p>
        </div>


        {/* KPIs - Always visible */}
        <div className="row g-2 g-md-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1 text-muted small">Total Features</p>
                    <h4 className="mb-0">{kpis.total}</h4>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-2 rounded">
                    <Database size={20} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1 text-muted small">Published</p>
                    <h4 className="mb-0 text-success">{kpis.published}</h4>
                  </div>
                  <div className="bg-success bg-opacity-10 p-2 rounded">
                    <Check size={20} className="text-success" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1 text-muted small">In Progress</p>
                    <h4 className="mb-0 text-warning">{kpis.inProgress}</h4>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-2 rounded">
                    <Clock size={20} className="text-warning" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1 text-muted small">Scheduled</p>
                    <h4 className="mb-0 text-primary">{kpis.scheduled}</h4>
                  </div>
                  <div className="bg-info bg-opacity-10 p-2 rounded">
                    <Calendar size={20} className="text-info" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-4">
          <div className="d-flex overflow-auto">
            <div className="d-flex flex-nowrap gap-2 w-100">

              {/* Report Builder */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("features");
                  setIsBuilderView(true);
                }}
                className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${activeTab === "features" && isBuilderView
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
                  }`}
              >
                <Settings size={18} />
                <span>Report Builder</span>
              </button>

              {/* Report Sharing */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab("features");
                  setIsBuilderView(false);
                }}
                className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${activeTab === "features" && !isBuilderView
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
                  }`}
              >
                <Share2 size={18} />
                <span>Report Sharing</span>
              </button>

              {/* Employee Reports */}
              <button
                type="button"
                onClick={() => setActiveTab("employees")}
                className={`btn d-flex align-items-center gap-2 px-4 py-2.5 rounded flex-shrink-0 ${activeTab === "employees"
                  ? "btn-primary text-white"
                  : "btn-outline-primary"
                  }`}
              >
                <Users size={18} />
                <span>Employee Reports</span>
              </button>

            </div>
          </div>
        </div>


        {/* FEATURES TAB CONTENT */}
        {activeTab === "features" && (
          <>
            {/* FILTER BAR */}
            <div className="card mb-3">
              <div className="card-body">
                <div className="row g-2">
                  {/* Top Row: Filters on mobile, all in one row on desktop */}
                  <div className="col-12 col-lg-9">
                    <div className="row g-2">
                      {/* Search - Full width on xs, 6 columns on sm+, 4 on lg+ */}
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div className="input-group input-group-sm">
                          <span className="input-group-text bg-white">
                            <Search size={14} />
                          </span>
                          <input
                            className="form-control"
                            placeholder="Search features..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Category Filter */}
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <select
                          className="form-select form-select-sm"
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                          <option value="">All Categories</option>
                          {getCategoryOptions().map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status Filter */}
                      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <select
                          className="form-select form-select-sm"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="">All Status</option>
                          <option value="Draft">Draft</option>
                          <option value="Published">Published</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Buttons Column - Always on right side */}
                  <div className="col-12 col-lg-3">
                    <div className="d-flex flex-column flex-md-row flex-lg-column flex-xl-row gap-2 h-100">
                      <button
                        className="btn btn-dark btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                        onClick={exportCSV}
                      >
                        <Download size={14} />
                        <span className="d-none d-sm-inline">Export CSV</span>
                        <span className="d-sm-none">Export</span>
                      </button>

                      <button
                        className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                        onClick={handleAddNewReport}
                      >
                        <Plus size={14} />
                        <span className="d-none d-sm-inline">Add New Report</span>
                        <span className="d-sm-none">Add</span>
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE DESKTOP */}
            <div className="card desktop-table mb-3">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Icon</th>
                      <th>Feature Name</th>
                      <th>Category</th>
                      <th>Last Updated</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayFeatures.map((item) => (
                      <tr key={item.id}>
                        <td>{item.icon}</td>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {item.category}
                          </span>
                        </td>
                        <td>{item.lastUpdated}</td>
                        <td>
                          <span className={`badge ${statusBadge(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => openModal(item)}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className="btn btn-outline-info btn-sm d-flex align-items-center justify-content-center"
                              onClick={() => openEditModal(item)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>

                            <button
                              className="btn btn-outline-success"
                              onClick={() => handlePublish(item)}
                            >
                              <Check size={14} />
                            </button>
                            <button
                              className="btn btn-outline-warning"
                              onClick={() => handleSchedule(item)}
                            >
                              <Calendar size={14} />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(item)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {displayFeatures.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-5">
                          No matching features.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION */}
            {filteredFeatures.length > perPage && (
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      <small className="text-muted">
                        Showing{" "}
                        <strong>
                          {Math.min(startIndex + 1, filteredFeatures.length)}-
                          {Math.min(
                            startIndex + perPage,
                            filteredFeatures.length
                          )}
                        </strong>{" "}
                        of <strong>{filteredFeatures.length}</strong> features
                      </small>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>

                      <div className="mx-2">
                        <span className="badge bg-light text-dark px-3 py-1">
                          {currentPage} / {totalPages}
                        </span>
                      </div>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* EMPLOYEES TAB CONTENT */}
        {activeTab === "employees" && (
          <div id="employeeReportsSection">
            <div className="mb-3">
              <div className="row g-2 align-items-center">

                {/* Title */}
                <div className="col-12 col-md-auto">
                  <h5 className="mb-0">Employee Reports</h5>
                </div>

                {/* Actions */}
                <div className="col-12 col-md">
                  <div className="d-flex flex-column flex-sm-row flex-wrap gap-2 justify-content-md-end">

                    <button
                      className="btn btn-success d-flex align-items-center justify-content-center"
                      onClick={handleAddNewEmployee}
                    >
                      <Plus size={16} className="me-1" />
                      Add Employee
                    </button>

                    <button
                      className="btn btn-outline-success btn-sm d-flex align-items-center justify-content-center"
                      onClick={exportSelectedEmployees}
                    >
                      <Download size={14} className="me-1" />
                      Export Selected
                    </button>

                    <button
                      className="btn btn-success btn-sm d-flex align-items-center justify-content-center"
                      onClick={exportAllEmployeesExcel}
                    >
                      <FileSpreadsheet size={14} className="me-1" />
                      Export All Excel
                    </button>

                    <button
                      className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                      onClick={exportAllEmployeesPDF}
                    >
                      <File size={14} className="me-1" />
                      Export All PDF
                    </button>

                  </div>
                </div>

              </div>
            </div>


            {/* Employee Filters */}
            <div className="card mb-3">
              <div className="card-body">
                <div className="row g-2">
                  <div className="col-md-2">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">
                        <User size={14} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Employee Name"
                        value={employeeFilters.employeeName}
                        onChange={(e) =>
                          setEmployeeFilters((prev) => ({
                            ...prev,
                            employeeName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">
                        <MapPin size={14} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Location"
                        value={employeeFilters.location}
                        onChange={(e) =>
                          setEmployeeFilters((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">
                        <Users size={14} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Department"
                        value={employeeFilters.department}
                        onChange={(e) =>
                          setEmployeeFilters((prev) => ({
                            ...prev,
                            department: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">
                        <Database size={14} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Cost Center"
                        value={employeeFilters.costCenter}
                        onChange={(e) =>
                          setEmployeeFilters((prev) => ({
                            ...prev,
                            costCenter: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm"
                      value={employeeFilters.status}
                      onChange={(e) =>
                        setEmployeeFilters((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="col-md-2 d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={resetEmployeeFilters}
                    >
                      <Filter size={14} /> Reset
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={selectAllEmployees}
                    >
                      {selectedEmployees.length === filteredEmployees.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Table */}
            <div className="card">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "40px" }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            selectedEmployees.length ===
                            filteredEmployees.length &&
                            filteredEmployees.length > 0
                          }
                          onChange={selectAllEmployees}
                        />
                      </th>
                      <th>Employee Name</th>
                      <th>Designation</th>
                      <th>Department</th>
                      <th>Location</th>
                      <th>Cost Center</th>
                      <th>Date & Time</th>
                      <th>Pay Days</th>
                      <th>Salary</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                      <th className="text-center">Actions</th>
                      <th className="text-center">Export</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() =>
                              toggleEmployeeSelection(employee.id)
                            }
                          />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <User size={14} />
                            <strong>{employee.employeeName}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {employee.designation}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info text-white">
                            {employee.department}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-warning text-dark">
                            {employee.location}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {employee.costCenter}
                          </span>
                        </td>
                        <td>
                          <small>{employee.dateTime}</small>
                        </td>
                        <td>{employee.payDays} days</td>
                        <td>
                          <strong>
                            {employee.currency || "USD"}{" "}
                            {employee.salary.toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <span
                            className={`badge ${employee.status === "Active"
                              ? "bg-success"
                              : employee.status === "On Leave"
                                ? "bg-warning"
                                : "bg-danger"
                              }`}
                          >
                            {employee.status}
                          </span>
                        </td>
                        <td>
                          <small>
                            {employee.lastUpdated ||
                              employee.dateTime.split(" ")[0]}
                          </small>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => openEmployeeModal(employee)}
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className="btn btn-outline-info"
                              onClick={() => openEditEmployeeModal(employee)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteEmployee(employee.id)}
                              title="Delete"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => exportEmployeePDF(employee)}
                              title="Download PDF"
                            >
                              <File size={14} />
                            </button>
                            <button
                              className="btn btn-outline-success"
                              onClick={() => exportEmployeeExcel(employee)}
                              title="Download Excel"
                            >
                              <FileSpreadsheet size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <tr>
                        <td
                          colSpan="13"
                          className="text-center text-muted py-5"
                        >
                          No employees found. Click "Add Employee" to create new
                          records.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FEATURE DETAILS MODAL */}
        {modalOpen && (
          <>
            <div className="modal-backdrop show"></div>
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ zIndex: 1050 }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{selectedFeature.name}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      <strong>Category:</strong> {selectedFeature.category}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedFeature.status}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {selectedFeature.lastUpdated}
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-info"
                      onClick={() => {
                        openEditModal(selectedFeature);
                        closeModal();
                      }}
                    >
                      <Edit size={14} className="me-1" /> Edit
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handlePublish(selectedFeature)}
                    >
                      Publish
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleSchedule(selectedFeature)}
                    >
                      Schedule
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(selectedFeature)}
                    >
                      Delete
                    </button>
                    <button className="btn btn-secondary" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ADD/EDIT REPORT MODAL */}
        {addReportModalOpen && (
          <>
            <div className="modal-backdrop show"></div>
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ zIndex: 1050 }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {isEditing ? "Edit Report" : "Add New Report"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeAddReportModal}
                    ></button>
                  </div>
                  <div className="modal-body d-flex flex-column gap-3">
                    <input
                      className="form-control"
                      placeholder="Report Name"
                      value={newReportData.name}
                      onChange={(e) =>
                        setNewReportData({
                          ...newReportData,
                          name: e.target.value,
                        })
                      }
                    />
                    <select
                      className="form-select"
                      value={newReportData.category}
                      onChange={(e) =>
                        setNewReportData({
                          ...newReportData,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="Builder">Builder</option>
                      <option value="Data">Data</option>
                      <option value="Filter">Filter</option>
                      <option value="Analysis">Analysis</option>
                      <option value="Template">Template</option>
                      <option value="Automation">Automation</option>
                      <option value="Sharing">Sharing</option>
                      <option value="Export">Export</option>
                      <option value="Subscription">Subscription</option>
                      <option value="API">API</option>
                      <option value="Employee">Employee</option>
                    </select>
                    <select
                      className="form-select"
                      value={newReportData.status}
                      onChange={(e) =>
                        setNewReportData({
                          ...newReportData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveReport}
                    >
                      {isEditing ? "Update Report" : "Add Report"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={closeAddReportModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* EMPLOYEE DETAILS MODAL */}
        {employeeModalOpen && selectedEmployee && (
          <>
            <div className="modal-backdrop show"></div>
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ zIndex: 1050 }}
            >
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Employee Details</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeEmployeeModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Employee Name:</strong>{" "}
                          {selectedEmployee.employeeName}
                        </p>
                        <p>
                          <strong>Designation:</strong>{" "}
                          {selectedEmployee.designation}
                        </p>
                        <p>
                          <strong>Department:</strong>{" "}
                          {selectedEmployee.department}
                        </p>
                        <p>
                          <strong>Location:</strong> {selectedEmployee.location}
                        </p>
                        <p>
                          <strong>Cost Center:</strong>{" "}
                          {selectedEmployee.costCenter}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Date & Time:</strong>{" "}
                          {selectedEmployee.dateTime}
                        </p>
                        <p>
                          <strong>Pay Days:</strong> {selectedEmployee.payDays}{" "}
                          days
                        </p>
                        <p>
                          <strong>Salary:</strong> $
                          {selectedEmployee.salary.toLocaleString()}
                        </p>
                        <p>
                          <strong>Status:</strong>
                          <span
                            className={`badge ms-2 ${selectedEmployee.status === "Active"
                              ? "bg-success"
                              : selectedEmployee.status === "On Leave"
                                ? "bg-warning"
                                : "bg-danger"
                              }`}
                          >
                            {selectedEmployee.status}
                          </span>
                        </p>
                        <p>
                          <strong>Last Updated:</strong>{" "}
                          {selectedEmployee.lastUpdated ||
                            selectedEmployee.dateTime.split(" ")[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-info"
                      onClick={() => {
                        openEditEmployeeModal(selectedEmployee);
                        closeEmployeeModal();
                      }}
                    >
                      <Edit size={14} className="me-1" /> Edit
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => exportEmployeePDF(selectedEmployee)}
                    >
                      <File size={14} className="me-1" /> Export PDF
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={closeEmployeeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ADD/EDIT EMPLOYEE MODAL */}
        {addEmployeeModalOpen && (
          <>
            <div className="modal-backdrop show"></div>
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ zIndex: 1050 }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {isEditingEmployee ? "Edit Employee" : "Add New Employee"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeAddEmployeeModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Employee Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter full name"
                          value={newEmployeeData.employeeName}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              employeeName: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Designation</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Senior Developer, HR Manager"
                          value={newEmployeeData.designation}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              designation: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Department</label>
                        <select
                          className="form-select"
                          value={newEmployeeData.department}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              department: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select Department</option>
                          <option value="IT">IT</option>
                          <option value="HR">HR</option>
                          <option value="Finance">Finance</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Operations">Operations</option>
                          <option value="Sales">Sales</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Customer Support">
                            Customer Support
                          </option>
                          <option value="Research & Development">
                            Research & Development
                          </option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., New York Office, Remote"
                          value={newEmployeeData.location}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Cost Center</label>
                        <select
                          className="form-select"
                          value={newEmployeeData.costCenter}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              costCenter: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select Cost Center</option>
                          <option value="CC-100">
                            CC-100 (IT Infrastructure)
                          </option>
                          <option value="CC-200">
                            CC-200 (Human Resources)
                          </option>
                          <option value="CC-300">
                            CC-300 (Finance & Accounting)
                          </option>
                          <option value="CC-400">
                            CC-400 (Marketing & Sales)
                          </option>
                          <option value="CC-500">CC-500 (Operations)</option>
                          <option value="CC-600">
                            CC-600 (Research & Development)
                          </option>
                          <option value="CC-700">
                            CC-700 (Administration)
                          </option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          value={newEmployeeData.status}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                          }
                        >
                          <option value="Active">Active</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Probation">Probation</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={newEmployeeData.dateTime.replace(" ", "T")}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              dateTime: e.target.value.replace("T", " "),
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Pay Days</label>
                        <input
                          type="number"
                          className="form-control"
                          value={newEmployeeData.payDays}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              payDays: parseInt(e.target.value) || 0,
                            }))
                          }
                          min="1"
                          max="31"
                          placeholder="Days"
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Salary</label>
                        <div className="input-group">
                          <select
                            className="form-select"
                            style={{ width: "80px" }}
                            value={newEmployeeData.currency || "USD"}
                            onChange={(e) =>
                              setNewEmployeeData((prev) => ({
                                ...prev,
                                currency: e.target.value,
                              }))
                            }
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="JPY">JPY</option>
                            <option value="CAD">CAD</option>
                            <option value="AUD">AUD</option>
                            <option value="INR">INR</option>
                            <option value="CNY">CNY</option>
                            <option value="AED">AED</option>
                          </select>
                          <input
                            type="number"
                            className="form-control"
                            value={newEmployeeData.salary}
                            onChange={(e) =>
                              setNewEmployeeData((prev) => ({
                                ...prev,
                                salary: parseInt(e.target.value) || 0,
                              }))
                            }
                            min="0"
                            placeholder="Amount"
                          />
                        </div>
                      </div>
                      {/* Additional fields for better data management */}
                      <div className="col-md-6">
                        <label className="form-label">Employee ID</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="EMP-001"
                          value={newEmployeeData.employeeId || ""}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              employeeId: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="employee@company.com"
                          value={newEmployeeData.email || ""}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="+1 (555) 123-4567"
                          value={newEmployeeData.phone || ""}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Reporting Manager</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Manager's name"
                          value={newEmployeeData.manager || ""}
                          onChange={(e) =>
                            setNewEmployeeData((prev) => ({
                              ...prev,
                              manager: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveEmployee}
                    >
                      {isEditingEmployee ? "Update Employee" : "Add Employee"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={closeAddEmployeeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CustomReportBuilder;
