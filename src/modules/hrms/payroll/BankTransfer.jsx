// src\components\HRMS\PayrollManagement\BankTransfer.jsx
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Search, Plus, Eye, FileText, Trash2, Download,
  Clock, CheckCircle, XCircle, Lock, RefreshCw, Upload,
  AlertCircle, BanknoteIcon, CreditCard, FileCheck,
  Filter, FileSpreadsheet, Settings, BarChart3, Send,
  TrendingUp, DollarSign, Users, Calendar, PieChart,
  Shield, Key, Bell, Database
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";

const BankTransfer = () => {
  // State declarations
  const [showGeneratePanel, setShowGeneratePanel] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [paymentType, setPaymentType] = useState("NEFT");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [splitByBank, setSplitByBank] = useState(true);
  const [bankFilter, setBankFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showReconciliationPanel, setShowReconciliationPanel] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false); // NEW: Settings modal state
  const [reconciliationData, setReconciliationData] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [selectedPayments, setSelectedPayments] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [showAllPending, setShowAllPending] = useState(false);
  const [showReconDetailModal, setShowReconDetailModal] = useState(false);
  const [selectedReconRecord, setSelectedReconRecord] = useState(null);

  // Settings state
  const [settings, setSettings] = useState({
    autoEncryption: true,
    defaultPaymentType: "NEFT",
    notificationEnabled: true,
    autoReconciliation: false,
    backupEnabled: true,
    retentionPeriod: "90",
  });

  // Advanced filter states
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: "",
    dateTo: "",
    amountFrom: "",
    amountTo: "",
    employeeCountFrom: "",
    employeeCountTo: "",
    paymentMethod: "All",
  });

  // Mock data - Integrated with employee data
  const banks = [
    { id: 1, name: "State Bank of India", code: "SBI001", format: "NEFT", supportedTypes: ["NEFT", "RTGS"] },
    { id: 2, name: "HDFC Bank", code: "HDFC002", format: "CSV", supportedTypes: ["NEFT", "RTGS", "IMPS"] },
    { id: 3, name: "ICICI Bank", code: "ICICI003", format: "XML", supportedTypes: ["NEFT", "RTGS"] },
    { id: 4, name: "Axis Bank", code: "AXIS004", format: "TXT", supportedTypes: ["NEFT", "IMPS"] },
    { id: 5, name: "Kotak Mahindra Bank", code: "KOTAK005", format: "CSV", supportedTypes: ["NEFT", "RTGS", "IMPS"] },
    { id: 6, name: "Punjab National Bank", code: "PNB006", format: "NEFT", supportedTypes: ["NEFT"] },
  ];

  const paymentTypes = [
    { id: "NEFT", name: "NEFT", description: "Next day settlement", cutoffTime: "7:00 PM" },
    { id: "RTGS", name: "RTGS", description: "Real-time gross settlement", minAmount: "₹2,00,000", cutoffTime: "3:30 PM" },
    { id: "IMPS", name: "IMPS", description: "Immediate payment service", maxAmount: "₹2,00,000", cutoffTime: "24x7" },
  ];

  // Employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Abhilash Gurrampally",
      code: "LEV098",
      bankName: "SBI BANK",
      ifscCode: "SBIN0017895",
      accountNumber: "40579942875",
      accountType: "Savings",
      branch: "Hyderabad Main",
      verified: true,
      salary: "₹85,000",
      status: "Active"
    },
    {
      id: 2,
      name: "Anusha Enigalla",
      code: "LEV111",
      bankName: "State Bank of India",
      ifscCode: "SBIN0021729",
      accountNumber: "38762788694",
      accountType: "Savings",
      branch: "Secunderabad",
      verified: true,
      salary: "₹62,000",
      status: "Active"
    },
    {
      id: 3,
      name: "Ashok Kota",
      code: "LEV122",
      bankName: "Canara Bank",
      ifscCode: "CNRB0013494",
      accountNumber: "39493220090427",
      accountType: "Current",
      branch: "Bangalore",
      verified: false,
      salary: "₹95,000",
      status: "Active"
    },
    {
      id: 4,
      name: "Bogala Chandramouli",
      code: "LEV096",
      bankName: "State Bank of India",
      ifscCode: "SBIN0017408",
      accountNumber: "39453293605",
      accountType: "Savings",
      branch: "Chennai",
      verified: true,
      salary: "₹78,000",
      status: "Active"
    },
    {
      id: 5,
      name: "Burri Gowtham",
      code: "LEV092",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0002348",
      accountNumber: "50100619519020",
      accountType: "Salary",
      branch: "Mumbai",
      verified: false,
      salary: "₹1,10,000",
      status: "Active"
    },
  ]);

  const [payments, setPayments] = useState([
    {
      id: 1,
      fileName: "SALARY_OCT_2024_SBI",
      bank: "State Bank of India",
      paymentType: "NEFT",
      status: "Processed",
      totalAmount: "₹1,25,00,000",
      totalEmployees: 85,
      generatedDate: "25 Oct 2024",
      processedDate: "26 Oct 2024",
      encrypted: true,
      splitByBank: true,
      acknowledgment: "Uploaded",
      failedTransactions: 0,
      paymentMethod: "Bulk Transfer",
      fileSize: "2.5 MB",
      referenceNumber: "REF20241025SBI001",
      includedEmployees: [1, 2, 4],
      netAmount: "₹1,24,95,000",
      charges: "₹5,000",
      paymentDate: "2024-10-26",
      batchId: "BATCH001",
    },
    {
      id: 2,
      fileName: "SALARY_OCT_2024_HDFC",
      bank: "HDFC Bank",
      paymentType: "RTGS",
      status: "Failed",
      totalAmount: "₹75,00,000",
      totalEmployees: 42,
      generatedDate: "25 Oct 2024",
      processedDate: "Pending",
      encrypted: true,
      splitByBank: true,
      acknowledgment: "Pending",
      failedTransactions: 2,
      paymentMethod: "Bulk Transfer",
      fileSize: "1.2 MB",
      referenceNumber: "REF20241025HDFC002",
      includedEmployees: [5],
      netAmount: "₹74,98,500",
      charges: "₹1,500",
      paymentDate: "2024-10-26",
      batchId: "BATCH002",
    },
    {
      id: 3,
      fileName: "SALARY_OCT_2024_ICICI",
      bank: "ICICI Bank",
      paymentType: "NEFT",
      status: "Generated",
      totalAmount: "₹50,00,000",
      totalEmployees: 28,
      generatedDate: "25 Oct 2024",
      processedDate: "Pending",
      encrypted: true,
      splitByBank: true,
      acknowledgment: "Pending",
      failedTransactions: 0,
      paymentMethod: "Bulk Transfer",
      fileSize: "850 KB",
      referenceNumber: "REF20241025ICICI003",
      includedEmployees: [3],
      netAmount: "₹49,99,000",
      charges: "₹1,000",
      paymentDate: "2024-10-26",
      batchId: "BATCH003",
    },
    {
      id: 4,
      fileName: "BONUS_OCT_2024_ALL",
      bank: "All Banks",
      paymentType: "IMPS",
      status: "Failed",
      totalAmount: "₹15,00,000",
      totalEmployees: 35,
      generatedDate: "20 Oct 2024",
      processedDate: "20 Oct 2024",
      encrypted: false,
      splitByBank: false,
      acknowledgment: "Uploaded",
      failedTransactions: 5,
      paymentMethod: "Bonus Payment",
      fileSize: "680 KB",
      referenceNumber: "REF20241020BNS001",
      includedEmployees: [],
      netAmount: "₹14,98,000",
      charges: "₹2,000",
      paymentDate: "2024-10-20",
      batchId: "BATCH004",
    },
  ]);

  const [pendingPayments, setPendingPayments] = useState([
    {
      id: 1,
      employeeName: "Rahul Sharma",
      employeeCode: "LEV101",
      amount: "₹85,000",
      bank: "SBI",
      ifscCode: "SBIN0012345",
      accountNumber: "XXXX-XXXX-1234",
      daysPending: 2,
      reason: "Insufficient balance",
      status: "Failed",
      retryCount: 2,
    },
    {
      id: 2,
      employeeName: "Priya Singh",
      employeeCode: "LEV102",
      amount: "₹62,000",
      bank: "HDFC",
      ifscCode: "HDFC0005678",
      accountNumber: "XXXX-XXXX-5678",
      daysPending: 1,
      reason: "Account validation failed",
      status: "Pending",
      retryCount: 1,
    },
    {
      id: 3,
      employeeName: "Amit Kumar",
      employeeCode: "LEV103",
      amount: "₹95,000",
      bank: "ICICI",
      ifscCode: "ICICI0090123",
      accountNumber: "XXXX-XXXX-9012",
      daysPending: 3,
      reason: "Bank server error",
      status: "Failed",
      retryCount: 3,
    },
    {
      id: 4,
      employeeName: "Sneha Patel",
      employeeCode: "LEV104",
      amount: "₹1,20,000",
      bank: "Axis",
      ifscCode: "UTIB0000456",
      accountNumber: "XXXX-XXXX-3456",
      daysPending: 4,
      reason: "Account on hold",
      status: "Pending",
      retryCount: 0,
    },
    {
      id: 5,
      employeeName: "Rajesh Verma",
      employeeCode: "LEV105",
      amount: "₹75,000",
      bank: "Kotak",
      ifscCode: "KKBK0000789",
      accountNumber: "XXXX-XXXX-7890",
      daysPending: 2,
      reason: "IFSC code mismatch",
      status: "Failed",
      retryCount: 1,
    },
  ]);

  // Analytics data
  const analyticsData = {
    monthlySummary: [
      { month: "Oct 2024", amount: "₹2.85Cr", count: 158, successRate: 98.1 },
      { month: "Sep 2024", amount: "₹2.75Cr", count: 152, successRate: 97.5 },
      { month: "Aug 2024", amount: "₹2.65Cr", count: 148, successRate: 98.5 },
      { month: "Jul 2024", amount: "₹2.55Cr", count: 145, successRate: 96.8 },
    ],
    bankDistribution: [
      { bank: "SBI", amount: "₹1.25Cr", percentage: 43.9, count: 85 },
      { bank: "HDFC", amount: "₹75L", percentage: 26.3, count: 42 },
      { bank: "ICICI", amount: "₹50L", percentage: 17.5, count: 28 },
      { bank: "Others", amount: "₹35L", percentage: 12.3, count: 25 },
    ],
    paymentTypeDistribution: [
      { type: "NEFT", count: 120, percentage: 75.9 },
      { type: "RTGS", count: 25, percentage: 15.8 },
      { type: "IMPS", count: 13, percentage: 8.2 },
    ],
    statusTrend: {
      processed: 155,
      failed: 7,
      pending: 3,
      generated: 5,
    },
    topEmployees: [
      { name: "Abhilash Gurrampally", amount: "₹85,000", bank: "SBI", date: "25 Oct 2024" },
      { name: "Anusha Enigalla", amount: "₹62,000", bank: "SBI", date: "25 Oct 2024" },
      { name: "Ashok Kota", amount: "₹95,000", bank: "Canara", date: "25 Oct 2024" },
      { name: "Burri Gowtham", amount: "₹1,10,000", bank: "HDFC", date: "25 Oct 2024" },
      { name: "Bogala Chandramouli", amount: "₹78,000", bank: "SBI", date: "25 Oct 2024" },
    ],
  };

  // Initial reconciliation data
  useEffect(() => {
    const initialReconciliationData = [
      {
        id: 1,
        transactionId: "TXN001",
        employeeCode: "LEV098",
        employeeName: "Abhilash Gurrampally",
        amount: "₹85,000",
        status: "Matched",
        date: "25 Oct 2024",
        reference: "REF20241025SBI001",
        bankReference: "SBIREF12345",
        bank: "SBI",
        accountNumber: "40579942875",
      },
      {
        id: 2,
        transactionId: "TXN002",
        employeeCode: "LEV111",
        employeeName: "Anusha Enigalla",
        amount: "₹62,000",
        status: "Matched",
        date: "25 Oct 2024",
        reference: "REF20241025SBI001",
        bankReference: "SBIREF12346",
        bank: "SBI",
        accountNumber: "38762788694",
      },
      {
        id: 3,
        transactionId: "TXN003",
        employeeCode: "LEV122",
        employeeName: "Ashok Kota",
        amount: "₹95,000",
        status: "Unmatched",
        date: "25 Oct 2024",
        reference: "REF20241025ICICI003",
        bankReference: "",
        bank: "Canara Bank",
        accountNumber: "39493220090427",
      },
      {
        id: 4,
        transactionId: "TXN004",
        employeeCode: "LEV096",
        employeeName: "Bogala Chandramouli",
        amount: "₹78,000",
        status: "Pending",
        date: "25 Oct 2024",
        reference: "REF20241025SBI001",
        bankReference: "",
        bank: "SBI",
        accountNumber: "39453293605",
      },
    ];
    setReconciliationData(initialReconciliationData);
  }, []);

  const reconciliationStats = {
    totalAmount: "₹2,85,00,000",
    matchedTransactions: 155,
    unmatchedTransactions: 3,
    pendingVerification: 2,
    lastReconciliation: "25 Oct 2024",
    successRate: "98.1%",
    totalTransactions: 158,
  };

  // Pagination calculations
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBank = bankFilter === "All" || payment.bank === bankFilter;
    const matchesStatus = statusFilter === "All" || payment.status === statusFilter;

    // Advanced filters
    const matchesDate = !advancedFilters.dateFrom ||
      (payment.generatedDate >= advancedFilters.dateFrom &&
        (!advancedFilters.dateTo || payment.generatedDate <= advancedFilters.dateTo));

    const matchesPaymentMethod = advancedFilters.paymentMethod === "All" ||
      payment.paymentMethod === advancedFilters.paymentMethod;

    return matchesSearch && matchesBank && matchesStatus && matchesDate && matchesPaymentMethod;
  });

  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  // ========== BULK ACTION FUNCTIONS ==========
  const handleSelectPayment = (paymentId) => {
    const newSelection = new Set(selectedPayments);
    if (newSelection.has(paymentId)) {
      newSelection.delete(paymentId);
    } else {
      newSelection.add(paymentId);
    }
    setSelectedPayments(newSelection);
  };

  const handleSelectAllPayments = () => {
    if (selectedPayments.size === filteredPayments.length) {
      setSelectedPayments(new Set());
    } else {
      setSelectedPayments(new Set(filteredPayments.map(payment => payment.id)));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedPayments.size === 0) {
      toast.warning("Please select at least one payment file");
      setBulkAction("");
      return;
    }

    switch (action) {
      case "export":
        exportSelectedPayments();
        break;
      case "retry":
        retrySelectedPayments();
        break;
      case "delete":
        deleteSelectedPayments();
        break;
      case "mark_processed":
        markSelectedAsProcessed();
        break;
      default:
        break;
    }

    // Reset bulk action dropdown
    setBulkAction("");
  };

  const exportSelectedPayments = () => {
    const selectedPaymentData = payments.filter(payment =>
      selectedPayments.has(payment.id)
    );

    if (selectedPaymentData.length === 0) {
      toast.warning("No payments selected");
      return;
    }

    const headers = [
      "File Name", "Bank", "Payment Type", "Status", "Total Amount",
      "Employees", "Generated Date", "Processed Date", "Reference Number",
      "Batch ID", "Encrypted", "Failed Transactions"
    ];

    const data = selectedPaymentData.map(payment => [
      payment.fileName,
      payment.bank,
      payment.paymentType,
      payment.status,
      payment.totalAmount,
      payment.totalEmployees,
      payment.generatedDate,
      payment.processedDate,
      payment.referenceNumber,
      payment.batchId,
      payment.encrypted ? "Yes" : "No",
      payment.failedTransactions
    ]);

    const csvContent = [headers, ...data]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `selected-payments-${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`Exported ${selectedPaymentData.length} payment files`);
  };

  const retrySelectedPayments = () => {
    const selectedCount = selectedPayments.size;
    if (selectedCount === 0) return;

    if (window.confirm(`Retry ${selectedCount} failed payment(s)?`)) {
      setPayments(payments.map(payment =>
        selectedPayments.has(payment.id) && payment.status === "Failed"
          ? { ...payment, status: "In Progress", failedTransactions: 0 }
          : payment
      ));

      // Simulate retry process
      setTimeout(() => {
        setPayments(payments.map(payment =>
          selectedPayments.has(payment.id) && payment.status === "In Progress"
            ? { ...payment, status: "Processed", failedTransactions: 0 }
            : payment
        ));
        toast.success(`Retried ${selectedCount} payment(s) successfully`);
      }, 2000);

      setSelectedPayments(new Set());
    }
  };

  const deleteSelectedPayments = () => {
    const selectedCount = selectedPayments.size;
    if (selectedCount === 0) return;

    if (window.confirm(`Delete ${selectedCount} selected payment file(s)? This action cannot be undone.`)) {
      setPayments(payments.filter(payment => !selectedPayments.has(payment.id)));
      toast.success(`Deleted ${selectedCount} payment file(s)`);
      setSelectedPayments(new Set());
    }
  };

  const markSelectedAsProcessed = () => {
    const selectedCount = selectedPayments.size;
    if (selectedCount === 0) return;

    if (window.confirm(`Mark ${selectedCount} selected payment(s) as processed?`)) {
      setPayments(payments.map(payment =>
        selectedPayments.has(payment.id)
          ? {
            ...payment,
            status: "Processed",
            processedDate: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            acknowledgment: "Auto-processed"
          }
          : payment
      ));

      toast.success(`Marked ${selectedCount} payment(s) as processed`);
      setSelectedPayments(new Set());
    }
  };

  // Download single pending payment
  const downloadPendingPayment = (payment) => {
    const headers = ["Employee Name", "Employee Code", "Amount", "Bank", "IFSC Code", "Account Number", "Days Pending", "Reason", "Status", "Retry Count"];

    const data = [
      payment.employeeName,
      payment.employeeCode,
      payment.amount,
      payment.bank,
      payment.ifscCode,
      payment.accountNumber,
      payment.daysPending,
      payment.reason,
      payment.status,
      payment.retryCount
    ];

    const csvContent = [headers, data]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pending-payment-${payment.employeeCode}-${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`Downloaded pending payment for ${payment.employeeName}`);
  };

  // Download all pending payments
  const downloadAllPendingPayments = () => {
    if (pendingPayments.length === 0) {
      toast.warning("No pending payments to download");
      return;
    }

    const headers = ["Employee Name", "Employee Code", "Amount", "Bank", "IFSC Code", "Account Number", "Days Pending", "Reason", "Status", "Retry Count"];

    const data = pendingPayments.map(payment => [
      payment.employeeName,
      payment.employeeCode,
      payment.amount,
      payment.bank,
      payment.ifscCode,
      payment.accountNumber,
      payment.daysPending,
      payment.reason,
      payment.status,
      payment.retryCount
    ]);

    const csvContent = [headers, ...data]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all-pending-payments-${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`Downloaded ${pendingPayments.length} pending payments`);
  };

  const downloadPaymentFile = (payment) => {
    // Find employees for this payment
    const paymentEmployees = employees.filter(emp =>
      payment.includedEmployees && payment.includedEmployees.includes(emp.id)
    );

    if (paymentEmployees.length === 0) {
      toast.warning("No employee data found for this payment");
      return;
    }

    // Generate file based on bank format
    const bankInfo = banks.find(b => b.name === payment.bank);
    const fileFormats = {
      'CSV': generateCSVFile,
      'XML': generateXMLFile,
      'TXT': generateTXTFile,
      'NEFT': generateNEFTFile,
    };

    const generateFunction = fileFormats[bankInfo?.format || 'CSV'] || generateCSVFile;
    generateFunction(payment, paymentEmployees);
    toast.success(`Downloaded ${payment.fileName}`);
  };
  // ========== END BULK ACTION FUNCTIONS ==========

  // Functions
  const handleGenerateFile = async () => {
    if (!selectedBank) {
      toast.error("Please select a bank");
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const bankInfo = banks.find((b) => b.id === parseInt(selectedBank));
      const selectedEmployeesData = employees.filter(emp => selectedEmployees.has(emp.id));

      const totalAmount = selectedEmployeesData.reduce((sum, emp) => {
        const salary = parseFloat(emp.salary.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(salary) ? 0 : salary);
      }, 0);

      const newPayment = {
        id: payments.length + 1,
        fileName: `SALARY_${new Date()
          .toLocaleDateString("en-GB", { month: "short", year: "numeric" })
          .toUpperCase()}_${bankInfo.code}`,
        bank: bankInfo.name,
        paymentType: paymentType,
        status: "Generated",
        totalAmount: `₹${totalAmount.toLocaleString('en-IN')}`,
        totalEmployees: selectedEmployeesData.length,
        generatedDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        processedDate: "Pending",
        encrypted: encryptionEnabled,
        splitByBank: splitByBank,
        acknowledgment: "Pending",
        failedTransactions: 0,
        paymentMethod: "Bulk Transfer",
        fileSize: "Processing...",
        referenceNumber: `REF${new Date().getTime()}${bankInfo.code}`,
        includedEmployees: Array.from(selectedEmployees),
        netAmount: `₹${(totalAmount - 500).toLocaleString('en-IN')}`,
        charges: "₹500",
        paymentDate: new Date().toISOString().split('T')[0],
        batchId: `BATCH${new Date().getTime()}`,
      };

      setPayments([newPayment, ...payments]);

      // Generate and download the payment file
      generatePaymentFile(newPayment, bankInfo, selectedEmployeesData);

      toast.success(`Payment file generated for ${bankInfo.name} (${paymentType})`, {
        autoClose: 3000,
      });

    } catch (error) {
      toast.error("Failed to generate payment file");
    } finally {
      setIsGenerating(false);
      setShowConfirmModal(false);
      setShowGeneratePanel(false);
      setSelectedBank("");
      setSelectedEmployees(new Set());
      setPaymentType("NEFT");
    }
  };

  const generatePaymentFile = (payment, bankInfo, employeeData) => {
    const fileFormats = {
      'CSV': generateCSVFile,
      'XML': generateXMLFile,
      'TXT': generateTXTFile,
      'NEFT': generateNEFTFile,
    };

    const generateFunction = fileFormats[bankInfo.format] || generateCSVFile;
    generateFunction(payment, employeeData);
  };

  const generateCSVFile = (payment, employeeData) => {
    const headers = ["Employee Code", "Employee Name", "Bank Name", "IFSC Code", "Account Number", "Amount", "Payment Date"];
    const rows = employeeData.map(emp => [
      emp.code,
      emp.name,
      emp.bankName,
      emp.ifscCode,
      emp.accountNumber,
      emp.salary.replace('₹', ''),
      payment.paymentDate
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    downloadFile(csvContent, `${payment.fileName}.csv`, 'text/csv');
  };

  const generateNEFTFile = (payment, employeeData) => {
    const header = `01,${payment.referenceNumber},${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
    const rows = employeeData.map((emp, index) => {
      const amount = emp.salary.replace(/[^0-9.]/g, '');
      return `02,${String(index + 1).padStart(6, '0')},${emp.accountNumber},${emp.ifscCode},${amount.padStart(13, '0')},${emp.name.substring(0, 30)}`;
    });
    const footer = `03,${employeeData.length},${payment.totalAmount.replace(/[^0-9.]/g, '').padStart(13, '0')}`;

    const fileContent = [header, ...rows, footer].join('\n');
    downloadFile(fileContent, `${payment.fileName}.txt`, 'text/plain');
  };

  const generateXMLFile = (payment, employeeData) => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<paymentBatch>
  <header>
    <reference>${payment.referenceNumber}</reference>
    <date>${payment.paymentDate}</date>
    <totalAmount>${payment.totalAmount}</totalAmount>
    <totalEmployees>${payment.totalEmployees}</totalEmployees>
  </header>
  <transactions>
    ${employeeData.map(emp => `
    <transaction>
      <employeeCode>${emp.code}</employeeCode>
      <employeeName>${emp.name}</employeeName>
      <bankName>${emp.bankName}</bankName>
      <ifscCode>${emp.ifscCode}</ifscCode>
      <accountNumber>${emp.accountNumber}</accountNumber>
      <amount>${emp.salary}</amount>
    </transaction>`).join('')}
  </transactions>
</paymentBatch>`;

    downloadFile(xmlContent, `${payment.fileName}.xml`, 'application/xml');
  };

  const generateTXTFile = (payment, employeeData) => {
    const txtContent = `PAYMENT FILE
================
Reference: ${payment.referenceNumber}
Date: ${payment.paymentDate}
Bank: ${payment.bank}
Payment Type: ${payment.paymentType}
Total Amount: ${payment.totalAmount}
Total Employees: ${payment.totalEmployees}

EMPLOYEE PAYMENTS:
${employeeData.map(emp =>
      `${emp.code} | ${emp.name} | ${emp.bankName} | ${emp.ifscCode} | ${emp.accountNumber} | ${emp.salary}`
    ).join('\n')}`;

    downloadFile(txtContent, `${payment.fileName}.txt`, 'text/plain');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportReport = (format = 'csv') => {
    const headers = [
      "File Name", "Bank", "Payment Type", "Status", "Total Amount",
      "Employees", "Generated Date", "Processed Date", "Reference Number",
      "Batch ID", "Encrypted", "Failed Transactions"
    ];

    const data = payments.map(payment => [
      payment.fileName,
      payment.bank,
      payment.paymentType,
      payment.status,
      payment.totalAmount,
      payment.totalEmployees,
      payment.generatedDate,
      payment.processedDate,
      payment.referenceNumber,
      payment.batchId,
      payment.encrypted ? "Yes" : "No",
      payment.failedTransactions
    ]);

    if (format === 'csv') {
      const csvContent = [headers, ...data]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      downloadBlob(blob, 'payment-processing-report.csv');
      toast.success("Report exported in CSV format");
    } else if (format === 'pdf') {
      generatePDFReport(headers, data);
      toast.success("Report exported in PDF format");
    }
  };

  const generatePDFReport = (headers, data) => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Payment Processing Report", 14, 15);

    // Report Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);
    doc.text(`Total Payments: ${payments.length}`, 14, 30);

    // Simple table
    let y = 40;
    doc.setFontSize(12);
    doc.text("Payment Records", 14, y);
    y += 10;

    // Draw table header
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("File Name", 14, y);
    doc.text("Bank", 50, y);
    doc.text("Status", 90, y);
    doc.text("Amount", 120, y);
    doc.text("Employees", 150, y);

    y += 5;
    doc.line(14, y, 200, y);
    y += 5;

    // Draw table data
    doc.setFont("helvetica", "normal");
    data.forEach((row, index) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(row[0].substring(0, 20), 14, y);
      doc.text(row[1].substring(0, 15), 50, y);
      doc.text(row[3], 90, y);
      doc.text(row[4], 120, y);
      doc.text(row[5].toString(), 150, y);
      y += 6;
    });

    doc.save("payment-processing-report.pdf");
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleUploadAcknowledgement = async () => {
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (selectedPayment) {
        const updatedPayments = payments.map((payment) =>
          payment.id === selectedPayment.id
            ? {
              ...payment,
              acknowledgment: "Uploaded",
              status: "Processed",
              processedDate: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            }
            : payment
        );

        setPayments(updatedPayments);
        setSelectedPayment({
          ...selectedPayment,
          acknowledgment: "Uploaded",
          status: "Processed",
          processedDate: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        });

        toast.success("Acknowledgement file uploaded successfully!");
      }

      setUploadFile(null);
      setShowUploadModal(false);
    } catch (error) {
      toast.error("Failed to upload acknowledgement");
    }
  };

  const handleRetryFailed = async (paymentId) => {
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) return;

      setPayments(
        payments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, status: "In Progress", failedTransactions: 0 }
            : payment
        )
      );

      if (selectedPayment?.id === paymentId) {
        setSelectedPayment({
          ...selectedPayment,
          status: "In Progress",
          failedTransactions: 0,
        });
      }

      toast.info("Retrying failed transactions...");

      // Simulate retry process
      setTimeout(() => {
        setPayments(
          payments.map((payment) =>
            payment.id === paymentId
              ? { ...payment, status: "Processed", failedTransactions: 0 }
              : payment
          )
        );
        toast.success("All transactions processed successfully!");
      }, 2000);

    } catch (error) {
      toast.error("Failed to retry transactions");
    }
  };

  const handleReconcile = async () => {
    try {
      toast.info("Starting bank reconciliation...");

      // Simulate reconciliation process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newReconciliationData = [
        {
          id: 1,
          transactionId: "TXN001",
          employeeCode: "LEV098",
          employeeName: "Abhilash Gurrampally",
          amount: "₹85,000",
          status: "Matched",
          date: "25 Oct 2024",
          reference: "REF20241025SBI001",
          bankReference: "SBIREF12345",
          bank: "SBI",
          accountNumber: "40579942875",
        },
        {
          id: 2,
          transactionId: "TXN002",
          employeeCode: "LEV111",
          employeeName: "Anusha Enigalla",
          amount: "₹62,000",
          status: "Matched",
          date: "25 Oct 2024",
          reference: "REF20241025SBI001",
          bankReference: "SBIREF12346",
          bank: "SBI",
          accountNumber: "38762788694",
        },
        {
          id: 3,
          transactionId: "TXN003",
          employeeCode: "LEV122",
          employeeName: "Ashok Kota",
          amount: "₹95,000",
          status: "Unmatched",
          date: "25 Oct 2024",
          reference: "REF20241025ICICI003",
          bankReference: "",
          bank: "Canara Bank",
          accountNumber: "39493220090427",
        },
        {
          id: 4,
          transactionId: "TXN004",
          employeeCode: "LEV096",
          employeeName: "Bogala Chandramouli",
          amount: "₹78,000",
          status: "Pending",
          date: "25 Oct 2024",
          reference: "REF20241025SBI001",
          bankReference: "",
          bank: "SBI",
          accountNumber: "39453293605",
        },
      ];

      setReconciliationData(newReconciliationData);
      setShowReconciliationPanel(true);
      toast.success("Bank reconciliation completed successfully!");
    } catch (error) {
      toast.error("Reconciliation failed");
    }
  };

  const handleSelectEmployee = (employeeId) => {
    const newSelection = new Set(selectedEmployees);
    if (newSelection.has(employeeId)) {
      newSelection.delete(employeeId);
    } else {
      newSelection.add(employeeId);
    }
    setSelectedEmployees(newSelection);
  };

  const handleSelectAllEmployees = () => {
    if (selectedEmployees.size === employees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(employees.map(emp => emp.id)));
    }
  };

  // Function to handle pending payment retry
  const handlePendingRetry = (paymentId) => {
    // Find the payment first
    const paymentToRetry = pendingPayments.find(p => p.id === paymentId);
    const employeeName = paymentToRetry?.employeeName || "Employee";

    setPendingPayments(prevPayments => prevPayments.map(payment =>
      payment.id === paymentId
        ? {
          ...payment,
          status: "Retrying",
          retryCount: payment.retryCount + 1
        }
        : payment
    ));

    // Simulate retry process
    setTimeout(() => {
      setPendingPayments(prevPayments => prevPayments.map(payment =>
        payment.id === paymentId
          ? {
            ...payment,
            status: "Processed",
            reason: "Successfully processed on retry"
          }
          : payment
      ));

      // Remove from pending list after success
      setTimeout(() => {
        setPendingPayments(prevPayments => prevPayments.filter(p => p.id !== paymentId));
        toast.success(`Payment for ${employeeName} processed successfully`);
      }, 500);
    }, 1500);
  };

  // Function to handle View All for pending payments
  const handleViewAllPending = () => {
    setShowAllPending(!showAllPending);
    toast.info(showAllPending ? "Showing limited pending payments" : "Showing all pending payments");
  };

  const getStatusBadge = (status) => {
    const styles = {
      Generated: "bg-primary-subtle text-primary border-primary-subtle",
      "In Progress": "bg-warning-subtle text-warning border-warning-subtle",
      Processed: "bg-success-subtle text-success border-success-subtle",
      Failed: "bg-danger-subtle text-danger border-danger-subtle",
      "Partially Processed": "bg-info-subtle text-info border-info-subtle",
    };

    const icons = {
      Generated: <FileText size={12} />,
      "In Progress": <Clock size={12} />,
      Processed: <CheckCircle size={12} />,
      Failed: <XCircle size={12} />,
      "Partially Processed": <AlertCircle size={12} />,
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

  const getBankBadge = (bank) => {
    const bankColors = {
      "State Bank of India": "bg-info-subtle text-info",
      "HDFC Bank": "bg-primary-subtle text-primary",
      "ICICI Bank": "bg-success-subtle text-success",
      "Axis Bank": "bg-warning-subtle text-warning",
      "Kotak Mahindra Bank": "bg-danger-subtle text-danger",
      "Punjab National Bank": "bg-secondary-subtle text-secondary",
      "All Banks": "bg-dark-subtle text-dark",
    };

    return (
      <span className={`badge ${bankColors[bank] || "bg-light text-dark"}`}>
        {bank}
      </span>
    );
  };

  const PaymentStatusTracker = ({ status }) => {
    const steps = ["Generated", "Encrypted", "Sent to Bank", "Processed"];
    const currentIndex = steps.indexOf(
      status === "In Progress"
        ? "Sent to Bank"
        : status === "Processed"
          ? "Processed"
          : status === "Failed"
            ? "Failed"
            : "Generated"
    );

    return (
      <div className="d-flex align-items-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="d-flex flex-column align-items-center">
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center border-2 ${index <= currentIndex
                  ? "bg-success border-success text-white"
                  : "bg-white border-secondary text-muted"
                  }`}
                style={{ width: "32px", height: "32px" }}
              >
                {step === "Generated" ? (
                  <FileText size={16} />
                ) : step === "Encrypted" ? (
                  <Lock size={16} />
                ) : step === "Sent to Bank" ? (
                  <Send size={16} />
                ) : (
                  <CheckCircle size={16} />
                )}
              </div>
              <span className="small mt-1 text-muted">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`border-top border-2 ${index < currentIndex ? "border-success" : "border-secondary"
                  }`}
                style={{ width: "48px" }}
              />
            )}
          </React.Fragment>
        ))}
        {status === "Failed" && (
          <>
            <div
              className="border-top border-2 border-danger"
              style={{ width: "48px" }}
            />
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center border-2 bg-danger border-danger text-white"
                style={{ width: "32px", height: "32px" }}
              >
                <XCircle size={16} />
              </div>
              <span className="small mt-1 text-muted">Failed</span>
            </div>
          </>
        )}
      </div>
    );
  };

  const handleGoToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="card border shadow-none mb-4 mt-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-start">
              <div>
                <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
                  <Icon icon="heroicons:banknotes" />
                  Bank Transfer & Payment Processing
                </h5>
                <p className="text-muted small mb-0">
                  Generate, track, and reconcile payment files for salary disbursement
                </p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter size={16} className="me-2" />
                {showAdvancedFilters ? "Hide Filters" : "Advanced Filters"}
              </button>
              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={() => setShowGeneratePanel(true)}
              >
                <Plus size={16} className="me-2" />
                Generate Payment File
              </button>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by file name, bank, reference number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={bankFilter}
                onChange={(e) => setBankFilter(e.target.value)}
              >
                <option value="All">All Banks</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
                <option value="All Banks">All Banks</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Generated">Generated</option>
                <option value="In Progress">In Progress</option>
                <option value="Processed">Processed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="card border mt-3">
              <div className="card-body">
                <h6 className="mb-3">Advanced Filters</h6>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Date From</label>
                    <input
                      type="date"
                      className="form-control"
                      value={advancedFilters.dateFrom}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateFrom: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Date To</label>
                    <input
                      type="date"
                      className="form-control"
                      value={advancedFilters.dateTo}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateTo: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      value={advancedFilters.paymentMethod}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, paymentMethod: e.target.value })}
                    >
                      <option value="All">All Methods</option>
                      <option value="Bulk Transfer">Bulk Transfer</option>
                      <option value="Bonus Payment">Bonus Payment</option>
                      <option value="Advance Payment">Advance Payment</option>
                    </select>
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button
                      className="btn btn-secondary w-100"
                      onClick={() => setAdvancedFilters({
                        dateFrom: "",
                        dateTo: "",
                        amountFrom: "",
                        amountTo: "",
                        employeeCountFrom: "",
                        employeeCountTo: "",
                        paymentMethod: "All",
                      })}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border shadow-none">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="w-48-px h-48-px bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <BanknoteIcon size={20} className="text-primary" />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1">Total Processed</h6>
                  <div className="fw-bold fs-4">₹2.85Cr</div>
                  <div className="small text-muted">This month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border shadow-none">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="w-48-px h-48-px bg-success-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <CheckCircle size={20} className="text-success" />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1">Successful</h6>
                  <div className="fw-bold fs-4">158</div>
                  <div className="small text-muted">Transactions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border shadow-none">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="w-48-px h-48-px bg-warning-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <AlertCircle size={20} className="text-warning" />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1">Pending</h6>
                  <div className="fw-bold fs-4">3</div>
                  <div className="small text-muted">Require action</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border shadow-none">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className="w-48-px h-48-px bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <XCircle size={20} className="text-danger" />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1">Failed</h6>
                  <div className="fw-bold fs-4">7</div>
                  <div className="small text-muted">Need retry</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions with Settings working */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card border shadow-none">
            <div className="card-header bg-transparent border-0">
              <h6 className="fw-bold mb-0">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-outline-primary d-flex align-items-center"
                  onClick={() => handleExportReport('csv')}
                >
                  <FileSpreadsheet size={16} className="me-2" />
                  Export CSV
                </button>
                <button
                  className="btn btn-outline-primary d-flex align-items-center"
                  onClick={() => handleExportReport('pdf')}
                >
                  <FileText size={16} className="me-2" />
                  Export PDF
                </button>
                <button
                  className="btn btn-outline-primary d-flex align-items-center"
                  onClick={() => setShowReconciliationPanel(true)}
                >
                  <FileCheck size={16} className="me-2" />
                  Bank Reconciliation
                </button>
                <button
                  className="btn btn-outline-primary d-flex align-items-center"
                  onClick={() => setShowAnalyticsModal(true)}
                >
                  <BarChart3 size={16} className="me-2" />
                  View Analytics
                </button>
                <button
                  className="btn btn-outline-primary d-flex align-items-center"
                  onClick={() => setShowSettingsModal(true)}  // Fixed: Now opens settings modal
                >
                  <Settings size={16} className="me-2" />
                  Settings
                </button>
                <button
                  className="btn btn-outline-primary d-flex align-items-center"
                  onClick={downloadAllPendingPayments}
                >
                  <Download size={16} className="me-2" />
                  Download Pending Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card border shadow-none mb-4">
        <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <h6 className="fw-bold mb-0">Payment Files ({filteredPayments.length})</h6>
            {selectedPayments.size > 0 && (
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary">
                  {selectedPayments.size} selected
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSelectedPayments(new Set())}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <div className="d-flex gap-2">
            <select
              className="form-select form-select-sm w-auto"
              value={bulkAction}
              onChange={(e) => {
                setBulkAction(e.target.value);
                if (e.target.value) {
                  handleBulkAction(e.target.value);
                }
              }}
            >
              <option value="">Bulk Actions</option>
              <option value="export">Export Selected</option>
              <option value="retry">Retry Failed</option>
              <option value="delete">Delete Selected</option>
              <option value="mark_processed">Mark as Processed</option>
            </select>
            <button
              className="btn btn-sm btn-outline-primary d-flex align-items-center"
              onClick={() => handleExportReport('csv')}
            >
              <Download size={14} className="me-1" />
              Export All
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 text-start">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedPayments.size === filteredPayments.length && filteredPayments.length > 0}
                      onChange={handleSelectAllPayments}
                    />
                  </th>
                  <th className="px-4 py-3 text-start">File Name</th>
                  <th className="px-4 py-3 text-start">Bank</th>
                  <th className="px-4 py-3 text-start">Payment Type</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Total Amount</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.length > 0 ? (
                  currentPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-4 py-3 text-start">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedPayments.has(payment.id)}
                          onChange={() => handleSelectPayment(payment.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-start">
                        <div className="fw-medium">{payment.fileName}</div>
                        <div className="small text-muted d-flex align-items-center gap-1">
                          <Clock size={12} />
                          {payment.generatedDate}
                          {payment.referenceNumber && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-primary">{payment.referenceNumber}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-start">
                        {getBankBadge(payment.bank)}
                        <div className="small text-muted mt-1">{payment.batchId}</div>
                      </td>
                      <td className="px-4 py-3 text-start">
                        <div className="fw-medium">{payment.paymentType}</div>
                        <div className="small text-muted">{payment.paymentMethod}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(payment.status)}
                        {payment.failedTransactions > 0 && (
                          <div className="small text-danger mt-1">
                            {payment.failedTransactions} failed
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="fw-bold text-primary">
                          {payment.totalAmount}
                        </div>
                        <div className="small text-muted">
                          {payment.totalEmployees} employees
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowDetailModal(true);
                            }}
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          {payment.status === "Failed" && (
                            <button
                              className="btn btn-sm btn-outline-warning d-flex align-items-center justify-content-center"
                              onClick={() => handleRetryFailed(payment.id)}
                              title="Retry Failed"
                            >
                              <RefreshCw size={14} />
                            </button>
                          )}
                          {payment.status === "Processed" && (
                            <button
                              className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowUploadModal(true);
                              }}
                              title="Upload Acknowledgement"
                            >
                              <Upload size={14} />
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-outline-info d-flex align-items-center justify-content-center"
                            onClick={() => {
                              downloadPaymentFile(payment);
                            }}
                            title="Download File"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this payment record?"
                                )
                              ) {
                                setPayments(
                                  payments.filter((p) => p.id !== payment.id)
                                );
                                toast.success("Payment record deleted");
                              }
                            }}
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
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        <FileText size={48} className="mb-2 opacity-25" />
                        <p>No payment files found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
          <div className="text-muted">
            {selectedPayments.size > 0 ? (
              <span className="text-primary">
                {selectedPayments.size} selected •
              </span>
            ) : null}
            Showing {indexOfFirstPayment + 1} to {Math.min(indexOfLastPayment, filteredPayments.length)} of {filteredPayments.length} payments
          </div>
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handleGoToPage(currentPage - 1)}>
                  Previous
                </button>
              </li>

              {renderPagination().map((page, idx) => (
                <li key={idx} className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                  {page === '...' ? (
                    <span className="page-link">...</span>
                  ) : (
                    <button className="page-link" onClick={() => handleGoToPage(page)}>
                      {page}
                    </button>
                  )}
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handleGoToPage(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Pending Payments with unique layout */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card border shadow-none">
            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-2">
              <div className="d-flex align-items-center gap-2">

                <div>
                  <h6 className="fw-bold mb-0">Pending Payments ({pendingPayments.length})</h6>
                  <div className="small text-muted">Requires immediate attention</div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary d-flex align-items-center"
                  onClick={downloadAllPendingPayments}
                >
                  <Download size={14} className="me-1" />
                  Download All
                </button>
                <button
                  className="btn btn-sm btn-outline-primary d-flex align-items-center"
                  onClick={handleViewAllPending}
                >
                  {showAllPending ? "Show Less" : "View All"}
                </button>
              </div>
            </div>
            <div className="card-body p-2">
              <div className="list-group list-group-flush">
                {pendingPayments
                  .slice(0, showAllPending ? pendingPayments.length : 3)
                  .map((payment) => (
                    <div key={payment.id} className="list-group-item border-0 py-2 px-3 hover-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-start gap-3">
                          <div className="mt-1">
                            <div className="d-flex align-items-center gap-2">
                              <div className="fw-medium small">
                                {payment.employeeName}
                              </div>
                              <span className="badge bg-light text-dark small">
                                {payment.employeeCode}
                              </span>
                            </div>
                            <div className="text-muted smaller mt-1 d-flex align-items-center gap-2">
                              <span className="d-flex align-items-center gap-1">
                                <Icon icon="mdi:bank" width="12" />
                                {payment.bank}
                              </span>
                              <span>•</span>
                              <span>Account: {payment.accountNumber}</span>
                            </div>
                            <div className="small text-danger mt-1 d-flex align-items-center gap-1">
                              <AlertCircle size={12} />
                              {payment.reason}
                            </div>
                            <div className="small mt-1 d-flex align-items-center gap-3">
                              <span className={`badge ${payment.status === "Failed" ? "bg-danger" : payment.status === "Retrying" ? "bg-warning" : "bg-warning"}`}>
                                {payment.status}
                              </span>
                              <span className="text-muted d-flex align-items-center gap-1">
                                <Icon icon="mdi:refresh" width="12" />
                                Retries: {payment.retryCount}
                              </span>
                              <span className="text-muted d-flex align-items-center gap-1">
                                <Icon icon="mdi:calendar-clock" width="12" />
                                {payment.daysPending} day{payment.daysPending !== 1 ? 's' : ''} pending
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-end d-flex align-items-center gap-2">
                          <div className="text-end">
                            <div className="fw-bold text-danger">
                              {payment.amount}
                            </div>
                            <div className="small text-muted">Amount Due</div>
                          </div>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-warning d-flex align-items-center"
                              onClick={() => handlePendingRetry(payment.id)}
                              title="Retry Payment"
                              disabled={payment.status === "Retrying"}
                            >
                              {payment.status === "Retrying" ? (
                                <span className="spinner-border spinner-border-sm me-1"></span>
                              ) : (
                                <RefreshCw size={14} />
                              )}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-info d-flex align-items-center"
                              onClick={() => downloadPendingPayment(payment)}
                              title="Download Details"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {pendingPayments.length === 0 && (
                  <div className="list-group-item border-0 text-center py-4">
                    <div className="text-muted">
                      <CheckCircle size={32} className="mb-2 opacity-25" />
                      <p>No pending payments</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Generate Payment File Modal ================= */}
      {showGeneratePanel && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
          <div
            className="modal fade show d-block"
            style={{
              zIndex: 1050,
              position: "fixed",
              inset: 0,
              overflowY: "auto",
              paddingLeft: "500px",
            }}
          >
            <div
              className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
              style={{ maxWidth: "90%" }}
            >
              <div className="modal-content rounded-4">
                <div className="modal-header">
                  <h5 className="modal-title">Generate Payment File</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowGeneratePanel(false);
                      setSelectedBank("");
                      setPaymentType("NEFT");
                      setEncryptionEnabled(true);
                      setSplitByBank(true);
                      setSelectedEmployees(new Set());
                    }}
                  />
                </div>

                <div className="modal-body">
                  <div className="mb-4">
                    <h6 className="fw-semibold text-muted mb-2">Select Bank</h6>
                    <select
                      className="form-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="">Choose a bank...</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name} ({bank.code}) – Supports:{" "}
                          {bank.supportedTypes.join(", ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-semibold text-muted mb-2">Payment Type</h6>
                    <div className="d-flex flex-column gap-3">
                      {paymentTypes.map((type) => (
                        <div
                          key={type.id}
                          className={`card cursor-pointer ${paymentType === type.id
                            ? "border-primary shadow-sm"
                            : "border"
                            }`}
                          onClick={() => setPaymentType(type.id)}
                        >
                          <div className="card-body d-flex align-items-center gap-3">
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center ${paymentType === type.id ? "bg-primary" : "bg-light"
                                }`}
                              style={{ width: 48, height: 48 }}
                            >
                              <CreditCard
                                size={20}
                                className={
                                  paymentType === type.id ? "text-white" : "text-muted"
                                }
                              />
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-bold">{type.name}</div>
                              <div className="small text-muted">
                                {type.description}
                              </div>
                              <div className="d-flex gap-3 mt-1 flex-wrap">
                                {type.cutoffTime && (
                                  <span className="small text-warning">
                                    Cut-off: {type.cutoffTime}
                                  </span>
                                )}
                                {type.minAmount && (
                                  <span className="small text-info">
                                    Min: {type.minAmount}
                                  </span>
                                )}
                                {type.maxAmount && (
                                  <span className="small text-info">
                                    Max: {type.maxAmount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-semibold text-muted mb-2">
                      Select Employees ({selectedEmployees.size} selected)
                    </h6>
                    <div className="card border">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <div>
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={selectedEmployees.size === employees.length}
                            onChange={handleSelectAllEmployees}
                          />
                          <span className="small">Select All</span>
                        </div>
                        <span className="small text-muted">
                          Total: {employees.length}
                        </span>
                      </div>
                      <div
                        className="card-body"
                        style={{ maxHeight: 220, overflowY: "auto" }}
                      >
                        <div className="d-flex flex-column gap-2">
                          {employees.map((emp) => (
                            <div
                              key={emp.id}
                              className="border rounded p-2 d-flex align-items-center gap-3"
                            >
                              <input
                                className="form-check-input mt-0"
                                type="checkbox"
                                checked={selectedEmployees.has(emp.id)}
                                onChange={() => handleSelectEmployee(emp.id)}
                                id={`emp-${emp.id}`}
                              />
                              <label
                                htmlFor={`emp-${emp.id}`}
                                className="flex-grow-1 mb-0 cursor-pointer"
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <div className="fw-medium small">{emp.name}</div>
                                    <div className="text-muted smaller">{emp.code}</div>
                                  </div>
                                  <div className="text-end">
                                    <div className="text-primary small">{emp.salary}</div>
                                    <div className="text-muted smaller">{emp.bankName}</div>
                                  </div>
                                </div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-semibold text-muted mb-2">
                      Advanced Settings
                    </h6>
                    <div className="bg-light border rounded p-4">
                      <div className="mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={encryptionEnabled}
                          onChange={(e) =>
                            setEncryptionEnabled(e.target.checked)
                          }
                          id="encryptionCheck"
                        />
                        <label
                          className="form-check-label fw-medium"
                          htmlFor="encryptionCheck"
                        >
                          Enable File Encryption
                        </label>
                        <div className="small text-muted">
                          Encrypt payment file using AES-256
                        </div>
                      </div>
                      <div>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={splitByBank}
                          onChange={(e) => setSplitByBank(e.target.checked)}
                          id="splitCheck"
                        />
                        <label
                          className="form-check-label fw-medium"
                          htmlFor="splitCheck"
                        >
                          Split Payment File by Bank
                        </label>
                        <div className="small text-muted">
                          Generate separate files for each bank
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedBank && selectedEmployees.size > 0 && (
                    <div>
                      <h6 className="fw-semibold text-muted mb-2">
                        File Preview
                      </h6>
                      <pre
                        className="p-3 bg-light border rounded mb-0"
                        style={{
                          fontSize: 12,
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {`FILE TYPE: ${paymentType}
BANK: ${banks.find((b) => b.id === parseInt(selectedBank))?.name
                          }
EMPLOYEES: ${selectedEmployees.size}
TOTAL AMOUNT: ₹${employees
                            .filter((emp) => selectedEmployees.has(emp.id))
                            .reduce(
                              (sum, emp) =>
                                sum + parseFloat(emp.salary.replace(/[^0-9.]/g, "")),
                              0
                            )
                            .toLocaleString("en-IN")}
ENCRYPTION: ${encryptionEnabled ? "ENABLED (AES-256)" : "DISABLED"}
SPLIT BY BANK: ${splitByBank ? "YES" : "NO"}
DATE: ${new Date().toLocaleDateString()}
REFERENCE: REF${Date.now()}${banks.find((b) => b.id === parseInt(selectedBank))?.code
                          }`}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="modal-footer d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowGeneratePanel(false);
                      setSelectedBank("");
                      setPaymentType("NEFT");
                      setEncryptionEnabled(true);
                      setSplitByBank(true);
                      setSelectedEmployees(new Set());
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    disabled={!selectedBank || selectedEmployees.size === 0}
                    onClick={() => {
                      if (!selectedBank) {
                        toast.error("Please select a bank");
                        return;
                      }
                      if (selectedEmployees.size === 0) {
                        toast.error("Please select at least one employee");
                        return;
                      }
                      setShowConfirmModal(true);
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText size={16} />
                        Generate File
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-backdrop fade show" style={{ zIndex: 1060 }}></div>
      )}
      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          style={{
            zIndex: 1070,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflowY: 'auto'
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm File Generation</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  Are you sure you want to generate payment file for{" "}
                  <strong>{banks.find((b) => b.id === parseInt(selectedBank))?.name}</strong>?
                </p>
                <div className="bg-light rounded p-3 small">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Payment Type:</span>
                    <span className="fw-medium">{paymentType}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Employees:</span>
                    <span className="fw-medium">{selectedEmployees.size} employees</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Total Amount:</span>
                    <span className="fw-bold text-primary">
                      ₹{employees
                        .filter(emp => selectedEmployees.has(emp.id))
                        .reduce((sum, emp) => sum + parseFloat(emp.salary.replace(/[^0-9.]/g, '')), 0)
                        .toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Encryption:</span>
                    <span className="fw-medium">
                      {encryptionEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Split by Bank:</span>
                    <span className="fw-medium">
                      {splitByBank ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div className="alert alert-warning mt-3 d-flex align-items-center">
                  <AlertCircle size={16} className="me-2" />
                  <div>
                    <strong>Note:</strong> This action cannot be undone. The payment file will be generated and downloaded immediately.
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleGenerateFile}
                >
                  {isGenerating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Generating...
                    </>
                  ) : (
                    "Generate File"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showDetailModal && selectedPayment && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1080 }} />
          <div
            className="modal fade show d-block"
            style={{
              zIndex: 1090,
              position: "fixed",
              inset: 0,
              overflowY: "auto",
              paddingLeft: "500px",
            }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content rounded-4">
                <div className="modal-header py-3">
                  <h6 className="modal-title fw-semibold">Payment Details</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDetailModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <h6 className="small fw-semibold text-muted mb-2">
                      Payment Information
                    </h6>
                    <div className="bg-light rounded p-3">
                      {[
                        { label: "File Name", value: selectedPayment.fileName },
                        { label: "Bank", value: selectedPayment.bank },
                        { label: "Reference Number", value: selectedPayment.referenceNumber, highlight: true },
                        { label: "Batch ID", value: selectedPayment.batchId },
                        { label: "Total Amount", value: selectedPayment.totalAmount, bold: true },
                        { label: "Employees", value: selectedPayment.totalEmployees },
                        { label: "Payment Method", value: selectedPayment.paymentMethod },
                        { label: "Charges", value: selectedPayment.charges, danger: true },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="d-flex justify-content-between border-bottom py-2 small"
                        >
                          <span className="text-muted">{item.label}</span>
                          <span
                            className={`fw-medium ${item.highlight ? "text-primary" : ""
                              } ${item.bold ? "fw-bold" : ""} ${item.danger ? "text-danger" : ""
                              }`}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="small fw-semibold text-muted mb-2">
                      Payment Progress
                    </h6>
                    <div className="bg-light rounded p-4 d-flex justify-content-center">
                      <PaymentStatusTracker status={selectedPayment.status} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="small fw-semibold text-muted mb-2">
                      Payment History
                    </h6>
                    <div className="bg-light rounded p-3">
                      <div className="d-flex gap-3 mb-3">
                        <div className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center"
                          style={{ width: 32, height: 32 }}>
                          <FileText size={16} className="text-primary" />
                        </div>
                        <div>
                          <div className="small fw-medium">File Generated</div>
                          <div className="small text-muted">
                            {selectedPayment.generatedDate}
                          </div>
                        </div>
                      </div>
                      {selectedPayment.processedDate !== "Pending" && (
                        <div className="d-flex gap-3">
                          <div className="rounded-circle bg-success-subtle d-flex align-items-center justify-content-center"
                            style={{ width: 32, height: 32 }}>
                            <Send size={16} className="text-success" />
                          </div>
                          <div>
                            <div className="small fw-medium">Sent to Bank</div>
                            <div className="small text-muted">
                              {selectedPayment.processedDate}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedPayment.includedEmployees?.length > 0 && (
                    <div>
                      <h6 className="small fw-semibold text-muted mb-2">
                        Included Employees ({selectedPayment.includedEmployees.length})
                      </h6>
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered">
                          <thead className="table-light small">
                            <tr>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Bank</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody className="small">
                            {employees
                              .filter(emp =>
                                selectedPayment.includedEmployees.includes(emp.id)
                              )
                              .map(emp => (
                                <tr key={emp.id}>
                                  <td>{emp.code}</td>
                                  <td>{emp.name}</td>
                                  <td>{emp.bankName}</td>
                                  <td>{emp.salary}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <div>
                    {selectedPayment.status === "Failed" && (
                      <button
                        className="btn btn-warning btn-sm d-flex align-items-center gap-2"
                        onClick={() => handleRetryFailed(selectedPayment.id)}
                      >
                        <RefreshCw size={14} />
                        Retry Failed
                      </button>
                    )}
                    {selectedPayment.status === "Processed" && (
                      <button
                        className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
                        onClick={() => {
                          setSelectedPayment(selectedPayment);
                          setShowUploadModal(true);
                          setShowDetailModal(false);
                        }}
                      >
                        <Upload size={14} />
                        Upload Ack
                      </button>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                      onClick={() => downloadPaymentFile(selectedPayment)}
                    >
                      <Download size={14} />
                      Download File
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowDetailModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Upload Acknowledgement Modal */}
      {showUploadModal && (
        <div className="modal-backdrop fade show" style={{ zIndex: 1100 }}></div>
      )}
      {showUploadModal && (
        <div
          className="modal fade show d-block"
          style={{
            zIndex: 1110,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflowY: 'auto'
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Bank Acknowledgement</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Select Acknowledgement File
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      accept=".txt,.csv,.xml,.json,.pdf"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                    />
                  </div>
                  <div className="small text-muted mt-2">
                    Supported formats: TXT, CSV, XML, JSON, PDF (Bank-specific formats)
                  </div>
                </div>
                {uploadFile && (
                  <div className="alert alert-info">
                    <div className="d-flex align-items-center">
                      <FileText size={16} className="me-2" />
                      <div>
                        <strong>Selected file:</strong> {uploadFile.name}
                        <div className="small">
                          Size: {(uploadFile.size / 1024).toFixed(2)} KB
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedPayment && (
                  <div className="alert alert-warning d-flex align-items-start">
                    <AlertCircle size={16} className="me-2 mt-1" />
                    <div>
                      <strong>Payment:</strong> {selectedPayment.fileName}
                      <div className="small mt-1">
                        Reference: {selectedPayment.referenceNumber} |
                        Amount: {selectedPayment.totalAmount}
                      </div>
                    </div>
                  </div>
                )}
                <div className="alert alert-warning d-flex align-items-start">
                  <AlertCircle size={16} className="me-2 mt-1" />
                  <div>
                    <strong>Note:</strong> Uploading acknowledgement will mark the
                    payment as processed and update transaction status.
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleUploadAcknowledgement}
                  disabled={!uploadFile}
                >
                  <Upload size={16} className="me-2" />
                  Upload & Process
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1120 }} />
          <div
            className="modal fade show d-block"
            style={{
              zIndex: 1130,
              position: "fixed",
              inset: 0,
              overflowY: "auto",
              paddingLeft: "500px",
            }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content rounded-4">
                <div className="modal-header py-3">
                  <h6 className="modal-title fw-semibold d-flex align-items-center gap-2">
                    <BarChart3 size={18} />
                    Payment Analytics
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAnalyticsModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="row g-2 mb-3">
                    {[
                      {
                        label: "Total Amount",
                        value: "₹2.85Cr",
                        icon: <DollarSign size={18} />,
                        color: "text-primary",
                        bg: "bg-primary-subtle",
                      },
                      {
                        label: "Success Rate",
                        value: "98.1%",
                        icon: <TrendingUp size={18} />,
                        color: "text-success",
                        bg: "bg-success-subtle",
                      },
                      {
                        label: "Transactions",
                        value: "158",
                        icon: <FileCheck size={18} />,
                        color: "text-info",
                        bg: "bg-info-subtle",
                      },
                      {
                        label: "Avg Time",
                        value: "2.4 hrs",
                        icon: <Clock size={18} />,
                        color: "text-warning",
                        bg: "bg-warning-subtle",
                      },
                    ].map((stat, idx) => (
                      <div key={idx} className="col-12">
                        <div className="card border">
                          <div className="card-body py-2 d-flex align-items-center gap-3">
                            <div
                              className={`rounded-circle ${stat.bg} d-flex align-items-center justify-content-center`}
                              style={{ width: 40, height: 40 }}
                            >
                              <div className={stat.color}>{stat.icon}</div>
                            </div>
                            <div>
                              <div className="fw-bold">{stat.value}</div>
                              <div className="small text-muted">{stat.label}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card border mb-3">
                    <div className="card-header py-2 d-flex justify-content-between align-items-center">
                      <span className="small fw-semibold d-flex align-items-center gap-1">
                        <Calendar size={14} />
                        Monthly Trends
                      </span>
                      <span className="small text-muted">Last 4 months</span>
                    </div>
                    <div className="card-body table-responsive p-2">
                      <table className="table table-sm mb-0">
                        <thead className="table-light small">
                          <tr>
                            <th>Month</th>
                            <th>Amount</th>
                            <th>Txns</th>
                            <th>Success</th>
                          </tr>
                        </thead>
                        <tbody className="small">
                          {analyticsData.monthlySummary.map((m, i) => (
                            <tr key={i}>
                              <td>{m.month}</td>
                              <td className="fw-semibold text-primary">{m.amount}</td>
                              <td>{m.count}</td>
                              <td>
                                <div className="progress" style={{ height: 6 }}>
                                  <div
                                    className="progress-bar bg-success"
                                    style={{ width: `${m.successRate}%` }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="card border mb-3">
                    <div className="card-header py-2 small fw-semibold d-flex align-items-center gap-1">
                      <BanknoteIcon size={14} />
                      Bank-wise Distribution
                    </div>
                    <div className="card-body p-2">
                      {analyticsData.bankDistribution.map((b, i) => (
                        <div key={i} className="mb-2">
                          <div className="d-flex justify-content-between small">
                            <span>{b.bank}</span>
                            <span className="fw-semibold">{b.amount}</span>
                          </div>
                          <div className="progress" style={{ height: 6 }}>
                            <div
                              className="progress-bar bg-primary"
                              style={{ width: `${b.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card border mb-3">
                    <div className="card-header py-2 small fw-semibold d-flex align-items-center gap-1">
                      <PieChart size={14} />
                      Payment Type Distribution
                    </div>
                    <div className="card-body p-2">
                      {analyticsData.paymentTypeDistribution.map((t, i) => (
                        <div key={i} className="mb-2">
                          <div className="d-flex justify-content-between small">
                            <span>{t.type}</span>
                            <span>{t.count}</span>
                          </div>
                          <div className="progress" style={{ height: 6 }}>
                            <div
                              className="progress-bar bg-info"
                              style={{ width: `${t.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card border mb-3">
                    <div className="card-header py-2 small fw-semibold d-flex align-items-center gap-1">
                      <CheckCircle size={14} />
                      Transaction Status
                    </div>
                    <div className="card-body p-2">
                      {[
                        { label: "Processed", val: analyticsData.statusTrend.processed, color: "success" },
                        { label: "Failed", val: analyticsData.statusTrend.failed, color: "danger" },
                        { label: "Pending", val: analyticsData.statusTrend.pending, color: "warning" },
                        { label: "Generated", val: analyticsData.statusTrend.generated, color: "info" },
                      ].map((s, i) => (
                        <div
                          key={i}
                          className="d-flex justify-content-between align-items-center border rounded p-2 mb-2 small"
                        >
                          <span>{s.label}</span>
                          <span className={`fw-bold text-${s.color}`}>{s.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer py-2 d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    onClick={() => handleExportReport("pdf")}
                  >
                    <Download size={14} />
                    Export
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowAnalyticsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* ================= Settings Modal ================= */}
      {showSettingsModal && (
        <>
          {/* Backdrop */}
          <div className="modal-backdrop fade show" style={{ zIndex: 1120 }} />

          {/* Modal */}
          <div
            className="modal fade show d-block"
            style={{
              zIndex: 1130,
              position: "fixed",
              inset: 0,
              overflowY: "auto",
            }}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
              style={{ maxWidth: "600px" }}
            >
              <div className="modal-content rounded-4">

                {/* ================= Header ================= */}
                <div className="modal-header py-3">
                  <h6 className="modal-title fw-semibold d-flex align-items-center gap-2">
                    <Settings size={18} />
                    Payment Settings
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSettingsModal(false)}
                  />
                </div>

                {/* ================= Body ================= */}
                <div className="modal-body">

                  {/* ===== Security Settings ===== */}
                  <div className="mb-4">
                    <h6 className="small fw-semibold text-muted mb-3">
                      Security Settings
                    </h6>

                    <div className="d-flex flex-column gap-3">

                      {/* Auto Encryption */}
                      <div className="d-flex align-items-start">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="autoEncryption"
                            checked={settings.autoEncryption}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                autoEncryption: e.target.checked,
                              })
                            }
                          />
                        </div>
                        <div className="ms-3">
                          <div className="fw-medium d-flex align-items-center gap-2">
                            <Shield size={16} className="text-primary" />
                            Auto File Encryption
                          </div>
                          <div className="small text-muted">
                            Automatically encrypt all payment files
                          </div>
                        </div>
                      </div>

                      {/* Notifications */}
                      <div className="d-flex align-items-start">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="notifications"
                            checked={settings.notificationEnabled}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                notificationEnabled: e.target.checked,
                              })
                            }
                          />
                        </div>
                        <div className="ms-3">
                          <div className="fw-medium d-flex align-items-center gap-2">
                            <Bell size={16} className="text-primary" />
                            Payment Notifications
                          </div>
                          <div className="small text-muted">
                            Send email notifications for payment status
                          </div>
                        </div>
                      </div>

                      {/* Auto Reconciliation */}
                      <div className="d-flex align-items-start">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="autoRecon"
                            checked={settings.autoReconciliation}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                autoReconciliation: e.target.checked,
                              })
                            }
                          />
                        </div>
                        <div className="ms-3">
                          <div className="fw-medium d-flex align-items-center gap-2">
                            <RefreshCw size={16} className="text-primary" />
                            Auto Reconciliation
                          </div>
                          <div className="small text-muted">
                            Automatically reconcile payments daily
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ===== Backup & Retention ===== */}
                  <div className="mb-4">
                    <h6 className="small fw-semibold text-muted mb-3">
                      Backup & Retention
                    </h6>

                    <div className="d-flex align-items-start mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="backup"
                          checked={settings.backupEnabled}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              backupEnabled: e.target.checked,
                            })
                          }
                        />
                      </div>
                      <div className="ms-3">
                        <div className="fw-medium d-flex align-items-center gap-2">
                          <Database size={16} className="text-primary" />
                          Auto Backup
                        </div>
                        <div className="small text-muted">
                          Automatically backup payment files
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label small fw-medium d-flex align-items-center gap-2">
                        <Key size={16} className="text-muted" />
                        Data Retention Period (days)
                      </label>
                      <select
                        className="form-select form-select-sm"
                        value={settings.retentionPeriod}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            retentionPeriod: e.target.value,
                          })
                        }
                      >
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                        <option value="180">180 days</option>
                        <option value="365">365 days</option>
                      </select>
                    </div>
                  </div>

                  {/* ===== Default Payment ===== */}
                  <div>
                    <h6 className="small fw-semibold text-muted mb-3">
                      Default Payment Settings
                    </h6>

                    <label className="form-label small fw-medium">
                      Default Payment Type
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={settings.defaultPaymentType}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultPaymentType: e.target.value,
                        })
                      }
                    >
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                      <option value="IMPS">IMPS</option>
                    </select>
                  </div>

                </div>

                {/* ================= Footer ================= */}
                <div className="modal-footer py-2 d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowSettingsModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      toast.success("Settings saved successfully");
                      setShowSettingsModal(false);
                    }}
                  >
                    Save Settings
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= Reconciliation Panel ================= */}
      {showReconciliationPanel && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1140 }} />
          <div
            className="modal fade show d-block"
            style={{
              zIndex: 1150,
              position: "fixed",
              inset: 0,
              overflowY: "auto",
              paddingLeft: "500px",
            }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
              style={{ maxWidth: "1100px" }}>
              <div className="modal-content rounded-4">
                <div className="modal-header py-3">
                  <h6 className="modal-title fw-semibold">
                    Bank Statement Reconciliation
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowReconciliationPanel(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="row g-2 mb-3">
                    {[
                      {
                        label: "Total Amount",
                        value: reconciliationStats.totalAmount,
                        icon: <BanknoteIcon size={18} />,
                        color: "text-primary",
                      },
                      {
                        label: "Matched",
                        value: reconciliationStats.matchedTransactions,
                        icon: <CheckCircle size={18} />,
                        color: "text-success",
                      },
                      {
                        label: "Unmatched",
                        value: reconciliationStats.unmatchedTransactions,
                        icon: <XCircle size={18} />,
                        color: "text-danger",
                      },
                      {
                        label: "Pending",
                        value: reconciliationStats.pendingVerification,
                        icon: <Clock size={18} />,
                        color: "text-warning",
                      },
                    ].map((stat, idx) => (
                      <div key={idx} className="col-12">
                        <div className="card border">
                          <div className="card-body py-2 d-flex align-items-center gap-3">
                            <div
                              className={`rounded-circle bg-light d-flex align-items-center justify-content-center ${stat.color}`}
                              style={{ width: 36, height: 36 }}
                            >
                              {stat.icon}
                            </div>
                            <div>
                              <div className="fw-bold">{stat.value}</div>
                              <div className="small text-muted">{stat.label}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card border">
                    <div className="card-header py-2 d-flex justify-content-between align-items-center">
                      <span className="small fw-semibold">
                        Reconciliation Details
                      </span>
                      <span className="small text-muted">
                        Success Rate: {reconciliationStats.successRate}
                      </span>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover table-sm mb-0 align-middle">
                        <thead className="table-light small">
                          <tr>
                            <th>Transaction</th>
                            <th>Employee</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Bank Ref</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody className="small">
                          {reconciliationData.map((record) => (
                            <tr key={record.id}>
                              <td>
                                <div className="fw-medium">{record.transactionId}</div>
                                <div className="text-muted">Ref: {record.reference}</div>
                              </td>
                              <td>
                                <div className="fw-medium">{record.employeeName}</div>
                                <div className="text-muted">{record.employeeCode}</div>
                                <div>{record.bank} • {record.accountNumber}</div>
                              </td>
                              <td className="fw-bold">{record.amount}</td>
                              <td>
                                <span
                                  className={`badge ${record.status === "Matched"
                                    ? "bg-success-subtle text-success"
                                    : record.status === "Unmatched"
                                      ? "bg-danger-subtle text-danger"
                                      : "bg-warning-subtle text-warning"
                                    }`}
                                >
                                  {record.status}
                                </span>
                              </td>
                              <td>{record.date}</td>
                              <td>{record.bankReference || "N/A"}</td>
                              <td>
                                <button
                                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                                  onClick={() => {
                                    setSelectedReconRecord(record);
                                    setShowReconDetailModal(true);
                                  }}
                                >
                                  <Eye size={12} />
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h6 className="small fw-semibold mb-2">
                      Reconciliation Actions
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                        onClick={() => handleExportReport("pdf")}
                      >
                        <Download size={14} />
                        Export Report
                      </button>
                      <button
                        className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                        onClick={() => {
                          setReconciliationData(
                            reconciliationData.map((r) => ({
                              ...r,
                              status: "Matched",
                            }))
                          );
                          toast.success("All transactions marked as verified");
                        }}
                      >
                        <CheckCircle size={14} />
                        Mark All Verified
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer py-2 d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowReconciliationPanel(false)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                    onClick={handleReconcile}
                  >
                    <RefreshCw size={14} />
                    Run Reconciliation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reconciliation Details Modal */}
      {showReconDetailModal && selectedReconRecord && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1160 }} />
          <div
            className="modal fade show d-block"
            style={{
              zIndex: 1170,
              position: "fixed",
              inset: 0,
              overflowY: "auto",
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
              style={{ maxWidth: "500px" }}>
              <div className="modal-content rounded-4">
                <div className="modal-header py-3">
                  <h6 className="modal-title fw-semibold small">
                    Transaction Details
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowReconDetailModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="bg-light rounded p-3 small">
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Transaction ID:</span>
                      <span className="fw-medium">{selectedReconRecord.transactionId}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Employee:</span>
                      <span className="fw-medium">{selectedReconRecord.employeeName}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Employee Code:</span>
                      <span className="fw-medium">{selectedReconRecord.employeeCode}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Amount:</span>
                      <span className="fw-bold text-primary">{selectedReconRecord.amount}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Status:</span>
                      <span className={`badge ${selectedReconRecord.status === "Matched" ? "bg-success" : selectedReconRecord.status === "Unmatched" ? "bg-danger" : "bg-warning"}`}>
                        {selectedReconRecord.status}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Date:</span>
                      <span className="fw-medium">{selectedReconRecord.date}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Reference:</span>
                      <span className="fw-medium">{selectedReconRecord.reference}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Bank Reference:</span>
                      <span className="fw-medium">{selectedReconRecord.bankReference || "Not Available"}</span>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <span className="text-muted">Bank:</span>
                      <span className="fw-medium">{selectedReconRecord.bank}</span>
                    </div>
                    <div className="d-flex justify-content-between py-2">
                      <span className="text-muted">Account Number:</span>
                      <span className="fw-medium">{selectedReconRecord.accountNumber}</span>
                    </div>
                  </div>

                  {selectedReconRecord.status === "Unmatched" && (
                    <div className="alert alert-warning mt-3 small">
                      <div className="d-flex align-items-start">
                        <AlertCircle size={16} className="me-2 mt-1" />
                        <div>
                          <strong>Attention Needed:</strong> This transaction doesn't match with bank records.
                          Please verify the amount and account details.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer py-2 d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowReconDetailModal(false)}
                  >
                    Close
                  </button>
                  {selectedReconRecord.status === "Unmatched" && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setReconciliationData(reconciliationData.map(r =>
                          r.id === selectedReconRecord.id ? { ...r, status: "Matched" } : r
                        ));
                        setShowReconDetailModal(false);
                        toast.success("Transaction marked as verified");
                      }}
                    >
                      Mark as Verified
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default BankTransfer;