import React, { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, CheckCircle, XCircle,
  FileText, Layers, Users, Calendar, Download, Filter, Search, BarChart3, TrendingUp, DollarSign, AlertCircle
} from "lucide-react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Reimbursements = () => {

  const [activeTab, setActiveTab] = useState("master");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [editingReimbursement, setEditingReimbursement] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "Health",
    limit: "",
    frequency: "Monthly",
    taxable: "false",
    description: ""
  });
const handleDownloadFile = async (claim) => {
  console.log('Attempting to download file for claim:', claim.id, claim.receiptFile);
  
  try {
    // Check if file exists
    if (!claim.file && !claim.fileUrl) {
      console.error('No file data found for claim:', claim);
      alert('File not found. Please upload the file again.');
      return;
    }

    // Option 1: If file is already a Blob/File object
    if (claim.file instanceof Blob || claim.file instanceof File) {
      console.log('File is Blob/File object:', claim.file);
      const url = URL.createObjectURL(claim.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = claim.receiptFile || 'receipt.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    // Option 2: If file is a base64 string
    if (typeof claim.file === 'string' && claim.file.startsWith('data:')) {
      console.log('File is base64 string');
      const a = document.createElement('a');
      a.href = claim.file;
      a.download = claim.receiptFile || 'receipt.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Option 3: If file is a URL
    if (claim.fileUrl || (typeof claim.file === 'string' && claim.file.startsWith('http'))) {
      const fileUrl = claim.fileUrl || claim.file;
      console.log('Opening URL:', fileUrl);
      window.open(fileUrl, '_blank');
      return;
    }

    // Option 4: If file is just a filename, fetch from server
    console.log('Fetching file from server...');
    const response = await fetch(`/api/receipts/${claim.id}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = claim.receiptFile || 'receipt.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Download failed:', error);
    
    // Show user-friendly error message
    alert(`Unable to download file: ${error.message || 'File may be missing or corrupted'}`);
    
    // Fallback: Open in new tab if it might be a URL
    if (claim.file && typeof claim.file === 'string') {
      console.log('Trying fallback - opening as URL');
      window.open(claim.file, '_blank');
    }
  }
};
const handleExport = (format = 'csv') => {
  // Get data based on current filters
  const dataToExport = filteredClaims.length > 0 ? filteredClaims : claims;
  
  if (dataToExport.length === 0) {
    alert('No claims data to export!');
    return;
  }

  switch (format) {
    case 'csv':
      exportToCSV(dataToExport);
      break;
    case 'excel':
      alert('Excel export would require xlsx library. Using CSV instead.');
      exportToCSV(dataToExport);
      break;
    case 'pdf':
      alert('PDF export functionality would be implemented here!');
      break;
    default:
      exportToCSV(dataToExport);
  }
};

const exportToCSV = (data) => {
  if (data.length === 0) {
    alert('No data to export!');
    return;
  }

  // Prepare CSV content
  const headers = [
    'ID', 'Employee', 'Employee ID', 'Type', 'Amount', 'Tax', 
    'Net Amount', 'Date', 'Status', 'Manager Approval', 
    'Finance Approval', 'Payroll Status', 'Description'
  ];
  
  const csvRows = [
    headers.join(','),
    ...data.map(item => [
      item.id,
      `"${item.employee}"`,
      `"${item.employeeId}"`,
      `"${item.type}"`,
      item.amount,
      item.taxAmount || 0,
      item.netAmount || item.amount,
      `"${item.date}"`,
      `"${item.status}"`,
      `"${item.managerApproval?.status || 'Pending'}"`,
      `"${item.financeApproval?.status || 'Pending'}"`,
      item.payrollProcessed ? 'Processed' : 'Pending',
      `"${item.description?.replace(/"/g, '""') || ''}"`
    ].join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `claims-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert(`Exported ${data.length} claims to CSV file!`);
};
  const [reimbursements, setReimbursements] = useState([
    { id: 1, name: "Medical Reimbursement", limit: 20000, taxable: false, frequency: "Yearly", description: "Medical expenses reimbursement", category: "Health" },
    { id: 2, name: "Telephone / Mobile Reimbursement", limit: 10000, taxable: true, frequency: "Monthly", description: "Phone and mobile bill reimbursement", category: "Communication" },
    { id: 3, name: "Fuel and Conveyance Reimbursement", limit: 15000, taxable: true, frequency: "Monthly", description: "Fuel and travel expenses", category: "Travel" },
    { id: 4, name: "Travel Expense Reimbursement", limit: 30000, taxable: false, frequency: "Ad-hoc", description: "Business travel expenses", category: "Travel" },
    { id: 5, name: "LTA - Leave Travel Allowance", limit: 50000, taxable: false, frequency: "Yearly", description: "Leave travel allowance", category: "Travel" },
    { id: 6, name: "Books and Periodicals", limit: 5000, taxable: false, frequency: "Monthly", description: "Educational books and periodicals", category: "Education" },
    { id: 7, name: "Uniform and Laundry", limit: 10000, taxable: false, frequency: "Quarterly", description: "Uniform and laundry expenses", category: "Other" },
    { id: 8, name: "Other Miscellaneous", limit: 15000, taxable: true, frequency: "Ad-hoc", description: "Other miscellaneous expenses", category: "Other" }
  ]);

  const [claims, setClaims] = useState([
    {
      id: 1,
      employee: "Swetha",
      employeeId: "EMP001",
      type: "Medical Reimbursement",
      amount: 8000,
      date: "2024-03-15",
      status: "Approved",
      file: true,
      frequency: "Yearly",
      managerApproval: { status: "Approved", date: "2024-03-16", approver: "Manager A" },
      financeApproval: { status: "Approved", date: "2024-03-17", approver: "Finance B" },
      payrollProcessed: true,
      payrollDate: "2024-03-20",
      taxAmount: 0,
      netAmount: 8000,
      balanceUsed: 8000,
      balanceRemaining: 12000,
      description: "Medical expenses for family",
      receiptFile: "medical_receipt_001.pdf"
    },
    {
      id: 2,
      employee: "Ravi",
      employeeId: "EMP002",
      type: "Fuel and Conveyance Reimbursement",
      amount: 2500,
      date: "2024-04-01",
      status: "Finance Review",
      file: true,
      frequency: "Monthly",
      managerApproval: { status: "Approved", date: "2024-04-02", approver: "Manager C" },
      financeApproval: { status: "Pending", date: null, approver: null },
      payrollProcessed: false,
      payrollDate: null,
      taxAmount: 750,
      netAmount: 1750,
      balanceUsed: 2500,
      balanceRemaining: 12500,
      description: "Monthly fuel expenses",
      receiptFile: "fuel_receipt_002.pdf"
    },
    {
      id: 3,
      employee: "Priya",
      employeeId: "EMP003",
      type: "Travel Expense Reimbursement",
      amount: 15000,
      date: "2024-04-05",
      status: "Pending",
      file: true,
      frequency: "Ad-hoc",
      managerApproval: { status: "Pending", date: null, approver: null },
      financeApproval: { status: "Pending", date: null, approver: null },
      payrollProcessed: false,
      payrollDate: null,
      taxAmount: 0,
      netAmount: 15000,
      balanceUsed: 15000,
      balanceRemaining: 15000,
      description: "Business travel to Mumbai",
      receiptFile: "travel_receipt_003.pdf"
    }
  ]);

  const [newClaim, setNewClaim] = useState({
    employee: "",
    employeeId: "",
    type: "",
    amount: "",
    frequency: "Monthly",
    receipt: null,
    description: ""
  });

  // Employee balances tracking
  const [employeeBalances, setEmployeeBalances] = useState([
    { employeeId: "EMP001", employee: "Swetha", balances: {
      "Medical Reimbursement": { used: 8000, remaining: 12000, limit: 20000, period: "2024" },
      "Telephone / Mobile Reimbursement": { used: 3000, remaining: 7000, limit: 10000, period: "2024-04" },
      "Fuel and Conveyance Reimbursement": { used: 5000, remaining: 10000, limit: 15000, period: "2024-04" }
    }},
    { employeeId: "EMP002", employee: "Ravi", balances: {
      "Medical Reimbursement": { used: 0, remaining: 20000, limit: 20000, period: "2024" },
      "Telephone / Mobile Reimbursement": { used: 2500, remaining: 7500, limit: 10000, period: "2024-04" },
      "Fuel and Conveyance Reimbursement": { used: 2500, remaining: 12500, limit: 15000, period: "2024-04" }
    }},
    { employeeId: "EMP003", employee: "Priya", balances: {
      "Medical Reimbursement": { used: 5000, remaining: 15000, limit: 20000, period: "2024" },
      "Travel Expense Reimbursement": { used: 15000, remaining: 15000, limit: 30000, period: "2024" }
    }}
  ]);

  const updateClaim = (e) => {
    const { name, value, files } = e.target;
    setNewClaim({ ...newClaim, [name]: files ? files[0] : value });
    
    // Auto-set frequency based on reimbursement type
    if (name === "type" && value) {
      const selectedReimbursement = reimbursements.find(r => r.name === value);
      if (selectedReimbursement) {
        setNewClaim(prev => ({ 
          ...prev, 
          frequency: selectedReimbursement.frequency 
        }));
      }
    }
  };

  const validateClaimLimit = (employeeId, type, amount) => {
    const employeeBalance = employeeBalances.find(eb => eb.employeeId === employeeId);
    if (!employeeBalance) return { valid: true, message: "" };
    
    const balance = employeeBalance.balances[type];
    if (!balance) return { valid: true, message: "" };
    
    if (balance.remaining < amount) {
      return { 
        valid: false, 
        message: `Claim amount exceeds remaining balance. Remaining: ₹${balance.remaining}, Claimed: ₹${amount}` 
      };
    }
    
    return { valid: true, message: `Remaining balance: ₹${balance.remaining - amount}` };
  };

  const calculateTax = (amount, isTaxable) => {
    if (!isTaxable) return 0;
    // Assuming 30% tax rate for taxable reimbursements
    return amount * 0.30;
  };

  const submitClaim = (e) => {
    e.preventDefault();

    if (!newClaim.employee || !newClaim.type || !newClaim.amount || !newClaim.receipt) {
      alert("All fields and bills/receipt required!");
      return;
    }

    const amount = parseFloat(newClaim.amount);
    const selectedReimbursement = reimbursements.find(r => r.name === newClaim.type);
    
    // Validate claim limit
    if (amount > selectedReimbursement.limit) {
      alert(`Claim amount exceeds the limit of ₹${selectedReimbursement.limit} for ${newClaim.type}`);
      return;
    }

    // Validate employee balance
    const validation = validateClaimLimit(newClaim.employeeId, newClaim.type, amount);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const taxAmount = calculateTax(amount, selectedReimbursement.taxable);
    const netAmount = amount - taxAmount;

    const newEntry = {
      id: claims.length + 1,
      employee: newClaim.employee,
      employeeId: newClaim.employeeId,
      type: newClaim.type,
      amount: amount,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      file: true,
      frequency: newClaim.frequency,
      managerApproval: { status: "Pending", date: null, approver: null },
      financeApproval: { status: "Pending", date: null, approver: null },
      payrollProcessed: false,
      payrollDate: null,
      taxAmount: taxAmount,
      netAmount: netAmount,
      balanceUsed: amount,
      balanceRemaining: validation.valid ? (selectedReimbursement.limit - amount) : 0,
      description: newClaim.description || "",
      receiptFile: newClaim.receipt?.name || "receipt.pdf"
    };

    setClaims([...claims, newEntry]);
    setShowModal(false);
    setNewClaim({ employee: "", employeeId: "", type: "", amount: "", frequency: "Monthly", receipt: null, description: "" });
    alert("Claim submitted successfully! Awaiting manager approval.");
  };

  const handleManagerApproval = (id, action) => {
    const claim = claims.find(c => c.id === id);
    if (!claim) return;

    const updatedClaim = {
      ...claim,
      managerApproval: {
        status: action,
        date: new Date().toISOString().split("T")[0],
        approver: "Current Manager"
      },
      status: action === "Approved" ? "Finance Review" : "Rejected"
    };

    setClaims(claims.map(c => c.id === id ? updatedClaim : c));
    alert(`Claim ${action.toLowerCase()} by manager. ${action === "Approved" ? "Sent to finance for review." : ""}`);
  };

  const handleFinanceApproval = (id, action) => {
    const claim = claims.find(c => c.id === id);
    if (!claim) return;

    const updatedClaim = {
      ...claim,
      financeApproval: {
        status: action,
        date: new Date().toISOString().split("T")[0],
        approver: "Finance Manager"
      },
      status: action === "Approved" ? "Approved" : "Rejected",
      payrollProcessed: action === "Approved",
      payrollDate: action === "Approved" ? new Date().toISOString().split("T")[0] : null
    };

    setClaims(claims.map(c => c.id === id ? updatedClaim : c));
    alert(`Claim ${action.toLowerCase()} by finance. ${action === "Approved" ? "Ready for payroll processing." : ""}`);
  };

  const handleAction = (id, action) => {
    const claim = claims.find(c => c.id === id);
    if (!claim) return;

    // Determine which approval to handle
    if (claim.managerApproval.status === "Pending") {
      handleManagerApproval(id, action);
    } else if (claim.financeApproval.status === "Pending") {
      handleFinanceApproval(id, action);
    }
  };

  const totalClaims = claims.length;
  const approvedClaims = claims.filter(c => c.status === "Approved").length;
  const pendingClaims = claims.filter(c => c.status === "Pending" || c.status === "Finance Review").length;
  const rejectedClaims = claims.filter(c => c.status === "Rejected").length;
  const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);
  const approvedAmount = claims.filter(c => c.status === "Approved").reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = claims.filter(c => c.status === "Pending" || c.status === "Finance Review").reduce((sum, c) => sum + c.amount, 0);
  const totalTaxAmount = claims.reduce((sum, c) => sum + (c.taxAmount || 0), 0);

  // Filtered claims
  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || claim.status === filterStatus;
    const matchesType = filterType === "all" || claim.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // Save reimbursement type
  const saveReimbursementType = () => {
    if (!editForm.name || !editForm.limit) {
      alert("Name and limit are required!");
      return;
    }

    const newReimbursement = {
      id: editingReimbursement ? editingReimbursement.id : reimbursements.length + 1,
      name: editForm.name,
      limit: parseInt(editForm.limit),
      taxable: editForm.taxable === "true",
      frequency: editForm.frequency,
      description: editForm.description,
      category: editForm.category
    };

    if (editingReimbursement) {
      // Update existing
      setReimbursements(reimbursements.map(r => 
        r.id === editingReimbursement.id ? newReimbursement : r
      ));
    } else {
      // Add new
      setReimbursements([...reimbursements, newReimbursement]);
    }

    setShowEditModal(false);
    setEditingReimbursement(null);
    setEditForm({
      name: "",
      category: "Health",
      limit: "",
      frequency: "Monthly",
      taxable: "false",
      description: ""
    });
    alert(`Reimbursement type ${editingReimbursement ? 'updated' : 'added'} successfully!`);
  };

  // Initialize edit form when editing
  useEffect(() => {
    if (editingReimbursement) {
      setEditForm({
        name: editingReimbursement.name,
        category: editingReimbursement.category,
        limit: editingReimbursement.limit.toString(),
        frequency: editingReimbursement.frequency,
        taxable: editingReimbursement.taxable ? "true" : "false",
        description: editingReimbursement.description
      });
    }
  }, [editingReimbursement]);

  return (
    <div className="container-fluid p-4">
      {/* HEADER */}
     <div className="d-flex justify-content-between align-items-center mb-4">
 <div className="d-flex">
  <Icon 
    icon="heroicons:banknotes" 
    className="text-primary align-self-start" 
    style={{ 
      fontSize: '1.5rem',
      marginRight: '0.75rem',
      marginTop: '0.25rem' // Adjust this to match heading baseline
    }} 
  />
  <div>
    <h5 className="mb-1 fw-bold">Reimbursement Management</h5>
    <p className="text-muted mb-0">Employee reimbursement workflow and tracking</p>
  </div>
</div>
  <button 
    className="btn btn-primary d-flex align-items-center"
    onClick={() => setShowModal(true)}
  >
    <Plus size={18} className="me-2" />
    New Claim
  </button>
</div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Claims</p>
                  <h4 className="mb-0 fw-bold">{totalClaims}</h4>
                  <small className="text-muted">₹{totalAmount.toLocaleString()}</small>
                </div>
                <div className="bg-info-subtle p-3 rounded">
                  <FileText size={24} className="text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Approved</p>
                  <h4 className="mb-0 fw-bold">{approvedClaims}</h4>
                  <small className="text-muted">₹{approvedAmount.toLocaleString()}</small>
                </div>
                <div className="bg-success-subtle p-3 rounded">
                  <CheckCircle size={24} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Pending</p>
                  <h4 className="mb-0 fw-bold">{pendingClaims}</h4>
                  <small className="text-muted">₹{pendingAmount.toLocaleString()}</small>
                </div>
                <div className="bg-warning-subtle p-3 rounded">
                  <AlertCircle size={24} className="text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Tax Amount</p>
                  <h4 className="mb-0 fw-bold text-danger">₹{totalTaxAmount.toLocaleString()}</h4>
                  <small className="text-muted">Total taxable</small>
                </div>
                <div className="bg-danger-subtle p-3 rounded">
                  <DollarSign size={24} className="text-danger" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-tabs nav-fill border-bottom">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "master" ? "active" : ""} d-flex align-items-center justify-content-center gap-2`}
                onClick={() => setActiveTab("master")}
              >
                <Layers size={18} />
                <span>Master</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "claims" ? "active" : ""} d-flex align-items-center justify-content-center gap-2`}
                onClick={() => setActiveTab("claims")}
              >
                <Users size={18} />
                <span>Claims</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "balances" ? "active" : ""} d-flex align-items-center justify-content-center gap-2`}
                onClick={() => setActiveTab("balances")}
              >
                <DollarSign size={18} />
                <span>Balances</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "reports" ? "active" : ""} d-flex align-items-center justify-content-center gap-2`}
                onClick={() => setActiveTab("reports")}
              >
                <BarChart3 size={18} />
                <span>Reports</span>
              </button>
            </li>
          </ul>

          <div className="p-3">
            {/* MASTER TAB */}
            {activeTab === "master" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-bold">Reimbursement Types Master</h5>
                  <button 
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => { 
                      setEditingReimbursement(null); 
                      setEditForm({
                        name: "",
                        category: "Health",
                        limit: "",
                        frequency: "Monthly",
                        taxable: "false",
                        description: ""
                      });
                      setShowEditModal(true); 
                    }}
                  >
                    <Plus size={16} className="me-1" />
                    Add Type
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th width="20%">Component</th>
                        <th width="15%">Category</th>
                        <th width="15%">Limit (₹)</th>
                        <th width="15%">Frequency</th>
                        <th width="15%">Taxable</th>
                        <th width="20%">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reimbursements.map(item => (
                        <tr key={item.id}>
                          <td>
                            <div className="fw-semibold">{item.name}</div>
                            <small className="text-muted">{item.description}</small>
                          </td>
                          <td>
                            <span className="badge bg-secondary">{item.category}</span>
                          </td>
                          <td className="fw-bold">₹{item.limit.toLocaleString()}</td>
                          <td>{item.frequency}</td>
                          <td>
                            <span className={`badge ${item.taxable ? "bg-danger" : "bg-success"}`}>
                              {item.taxable ? "Taxable" : "Non-Taxable"}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary d-flex align-items-center"
                              onClick={() => { setEditingReimbursement(item); setShowEditModal(true); }}
                            >
                              <Edit2 size={14} className="me-1" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CLAIMS TAB */}
            {activeTab === "claims" && (
              <div>
                <div className="row g-3 mb-3">
                  <div className="col-lg-4 col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <Search size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by employee, type, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-3">
                    <select 
                      className="form-select"
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Finance Review">Finance Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-3">
                    <select 
                      className="form-select"
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      {reimbursements.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                 
                 
                <div className="col-lg-2 col-md-6">
  <div className="dropdown">
    <button 
      className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center dropdown-toggle"
      type="button"
      id="exportDropdown"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <Download size={16} className="me-1" />
      Export
    </button>
    <ul className="dropdown-menu" aria-labelledby="exportDropdown">
      <li>
        <button 
          className="dropdown-item d-flex align-items-center"
          onClick={() => handleExport('csv')}
        >
          <i className="bi bi-filetype-csv me-2"></i>
          Export as CSV
        </button>
      </li>
      <li>
        <button 
          className="dropdown-item d-flex align-items-center"
          onClick={() => handleExport('excel')}
        >
          <i className="bi bi-filetype-xlsx me-2"></i>
          Export as Excel
        </button>
      </li>
      <li><hr className="dropdown-divider" /></li>
      <li>
        <button 
          className="dropdown-item d-flex align-items-center"
          onClick={() => alert('Printing...')}
        >
          <i className="bi bi-printer me-2"></i>
          Print Report
        </button>
      </li>
    </ul>
  </div>
</div>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th width="12%">Employee</th>
                        <th width="12%">Type</th>
                        <th width="10%">Amount</th>
                        <th width="8%">Date</th>
                        <th width="10%">Status</th>
                        <th width="20%">Approval Stage</th>
                        <th width="10%">Payroll</th>
                        <th width="18%">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClaims.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-5">
                            <div className="text-muted">
                              <Search size={32} className="mb-2" />
                              <p className="mb-0">No claims found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredClaims.map(c => (
                          <tr key={c.id}>
                            <td>
                              <div className="fw-semibold">{c.employee}</div>
                              <small className="text-muted">{c.employeeId}</small>
                            </td>
                            <td>
                              <div>{c.type}</div>
                              <small className="text-muted">{c.frequency}</small>
                            </td>
                            <td>
                              <div className="fw-bold">₹{c.amount.toLocaleString()}</div>
                            </td>
                            <td>{c.date}</td>
                            <td>
                              <span className={`badge ${
                                c.status === "Approved" ? "bg-success" :
                                c.status === "Rejected" ? "bg-danger" :
                                c.status === "Finance Review" ? "bg-warning" :
                                "bg-secondary"
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td>
                              <div className="small">
                                <div className="d-flex align-items-center mb-1">
                                  <span className="me-2" style={{ minWidth: '70px' }}>Manager:</span>
                                  <div className="d-flex align-items-center">
                                    <span className={`badge ${c.managerApproval?.status === "Approved" ? "bg-success" : c.managerApproval?.status === "Rejected" ? "bg-danger" : "bg-secondary"}`}>
                                      {c.managerApproval?.status || "Pending"}
                                    </span>
                                    {c.managerApproval?.date && (
                                      <small className="text-muted ms-2">{c.managerApproval.date}</small>
                                    )}
                                  </div>
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="me-2" style={{ minWidth: '70px' }}>Finance:</span>
                                  <div className="d-flex align-items-center">
                                    <span className={`badge ${c.financeApproval?.status === "Approved" ? "bg-success" : c.financeApproval?.status === "Rejected" ? "bg-danger" : "bg-secondary"}`}>
                                      {c.financeApproval?.status || "Pending"}
                                    </span>
                                    {c.financeApproval?.date && (
                                      <small className="text-muted ms-2">{c.financeApproval.date}</small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {c.payrollProcessed ? (
                                  <span className="badge bg-success d-flex align-items-center">
                                    <CheckCircle size={12} className="me-1" />
                                    Processed
                                    {c.payrollDate && (
                                      <small className="ms-1">({c.payrollDate})</small>
                                    )}
                                  </span>
                                ) : (
                                  <span className="badge bg-secondary">Pending</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-1">
                                <button
                                  className="btn btn-sm btn-outline-info d-flex align-items-center"
                                  onClick={() => { setSelectedClaim(c); setShowDetailsModal(true); }}
                                  title="View Details"
                                >
                                  <FileText size={14} className="me-1" />
                                  View
                                </button>
                                
                                {(c.status === "Pending" && c.managerApproval?.status === "Pending") && (
                                  <>
                                    <button
                                      onClick={() => handleManagerApproval(c.id, "Approved")}
                                      className="btn btn-sm btn-success d-flex align-items-center"
                                      title="Approve (Manager)"
                                    >
                                      <CheckCircle size={14} className="me-1" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleManagerApproval(c.id, "Rejected")}
                                      className="btn btn-sm btn-danger d-flex align-items-center"
                                      title="Reject (Manager)"
                                    >
                                      <XCircle size={14} className="me-1" />
                                      Reject
                                    </button>
                                  </>
                                )}
                                
                                {(c.status === "Finance Review" && c.managerApproval?.status === "Approved" && c.financeApproval?.status === "Pending") && (
                                  <>
                                    <button
                                      onClick={() => handleFinanceApproval(c.id, "Approved")}
                                      className="btn btn-sm btn-success d-flex align-items-center"
                                      title="Approve (Finance)"
                                    >
                                      <CheckCircle size={14} className="me-1" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleFinanceApproval(c.id, "Rejected")}
                                      className="btn btn-sm btn-danger d-flex align-items-center"
                                      title="Reject (Finance)"
                                    >
                                      <XCircle size={14} className="me-1" />
                                      Reject
                                    </button>
                                  </>
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
            )}

            {/* BALANCES TAB */}
            {activeTab === "balances" && (
              <div>
                <h5 className="mb-3 fw-bold">Employee Reimbursement Balances</h5>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th width="15%">Employee</th>
                        <th width="25%">Reimbursement Type</th>
                        <th width="10%">Limit</th>
                        <th width="10%">Used</th>
                        <th width="10%">Remaining</th>
                        <th width="10%">Period</th>
                        <th width="20%">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeBalances.map(emp => (
                        Object.entries(emp.balances).map(([type, balance], index) => (
                          <tr key={`${emp.employeeId}-${type}`}>
                            {index === 0 && (
                              <td rowSpan={Object.keys(emp.balances).length} className="align-middle">
                                <div className="fw-semibold">{emp.employee}</div>
                                <small className="text-muted">{emp.employeeId}</small>
                              </td>
                            )}
                            <td>{type}</td>
                            <td className="fw-bold">₹{balance.limit.toLocaleString()}</td>
                            <td className="text-danger fw-bold">₹{balance.used.toLocaleString()}</td>
                            <td className="text-success fw-bold">₹{balance.remaining.toLocaleString()}</td>
                            <td>{balance.period}</td>
                            <td width="200">
                              <div className="d-flex align-items-center">
                                <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                  <div
                                    className={`progress-bar ${balance.remaining < balance.limit * 0.2 ? 'bg-danger' : balance.remaining < balance.limit * 0.5 ? 'bg-warning' : 'bg-success'}`}
                                    role="progressbar"
                                    style={{ width: `${(balance.remaining / balance.limit) * 100}%` }}
                                    aria-valuenow={(balance.remaining / balance.limit) * 100}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  />
                                </div>
                                <small className="text-nowrap">
                                  <span className="fw-bold">
                                    {((balance.remaining / balance.limit) * 100).toFixed(0)}%
                                  </span>
                                  <br />
                                  <small className="text-muted">
                                    {balance.remaining < balance.limit * 0.2 ? 'Low' : 
                                     balance.remaining < balance.limit * 0.5 ? 'Medium' : 'Good'}
                                  </small>
                                </small>
                              </div>
                            </td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === "reports" && (
              <div>
                <h5 className="mb-3 fw-bold">Reimbursement Reports & Analytics</h5>
                <div className="row g-3 mb-4">
                  <div className="col-lg-6">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-header bg-white border-bottom">
                        <h6 className="mb-0 fw-bold">Claims by Type</h6>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-sm align-middle">
                            <thead>
                              <tr>
                                <th>Type</th>
                                <th className="text-end">Count</th>
                                <th className="text-end">Total Amount</th>
                                <th className="text-end">Avg Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reimbursements.map(r => {
                                const typeClaims = claims.filter(c => c.type === r.name);
                                const total = typeClaims.reduce((sum, c) => sum + c.amount, 0);
                                const avg = typeClaims.length > 0 ? total / typeClaims.length : 0;
                                return (
                                  <tr key={r.id}>
                                    <td>
                                      <div className="fw-semibold">{r.name}</div>
                                      <small className="text-muted">{r.category}</small>
                                    </td>
                                    <td className="text-end">
                                      <span className="badge bg-info">{typeClaims.length}</span>
                                    </td>
                                    <td className="text-end fw-bold">₹{total.toLocaleString()}</td>
                                    <td className="text-end">₹{avg.toFixed(0)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-header bg-white border-bottom">
                        <h6 className="mb-0 fw-bold">Tax Analysis</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                            <span>Total Taxable Amount:</span>
                            <strong>₹{claims.filter(c => {
                              const r = reimbursements.find(re => re.name === c.type);
                              return r && r.taxable;
                            }).reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</strong>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                            <span>Total Tax Amount:</span>
                            <strong className="text-danger">₹{totalTaxAmount.toLocaleString()}</strong>
                          </div>
                          <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                            <span>Total Non-Taxable:</span>
                            <strong className="text-success">₹{(totalAmount - claims.filter(c => {
                              const r = reimbursements.find(re => re.name === c.type);
                              return r && r.taxable;
                            }).reduce((sum, c) => sum + c.amount, 0)).toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom">
                    <h6 className="mb-0 fw-bold">Monthly Trend</h6>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th className="text-end">Claims</th>
                            <th className="text-end">Total Amount</th>
                            <th className="text-end">Approved</th>
                            <th className="text-end">Pending</th>
                            <th className="text-end">Rejected</th>
                          </tr>
                        </thead>
                        <tbody>
                          {["January", "February", "March", "April"].map(month => {
                            const monthClaims = claims.filter(c => {
                              const claimDate = new Date(c.date);
                              return claimDate.toLocaleString('default', { month: 'long' }) === month;
                            });
                            return (
                              <tr key={month}>
                                <td className="fw-semibold">{month} 2024</td>
                                <td className="text-end">{monthClaims.length}</td>
                                <td className="text-end fw-bold">₹{monthClaims.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</td>
                                <td className="text-end">
                                  <span className="badge bg-success">
                                    {monthClaims.filter(c => c.status === "Approved").length}
                                  </span>
                                </td>
                                <td className="text-end">
                                  <span className="badge bg-warning">
                                    {monthClaims.filter(c => c.status === "Pending" || c.status === "Finance Review").length}
                                  </span>
                                </td>
                                <td className="text-end">
                                  <span className="badge bg-danger">
                                    {monthClaims.filter(c => c.status === "Rejected").length}
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NEW CLAIM MODAL */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title d-flex align-items-center">
                  <Plus size={20} className="me-2" />
                  Submit Reimbursement Claim
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={submitClaim}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Employee Name *</label>
                      <input
                        className="form-control"
                        name="employee"
                        placeholder="Enter employee name"
                        value={newClaim.employee}
                        onChange={updateClaim}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Employee ID *</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter employee ID"
                        name="employeeId"
                        value={newClaim.employeeId}
                        onChange={updateClaim}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Reimbursement Type *</label>
                      <select
                        className="form-select"
                        name="type"
                        value={newClaim.type}
                        onChange={updateClaim}
                        required
                      >
                        <option value="">Select Type</option>
                        {reimbursements.map(r => (
                          <option key={r.id} value={r.name}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Amount (₹) *</label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Enter amount"
                        name="amount"
                        value={newClaim.amount}
                        onChange={updateClaim}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Frequency</label>
                      <select
                        className="form-select"
                        name="frequency"
                        value={newClaim.frequency}
                        onChange={updateClaim}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="Ad-hoc">Ad-hoc</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Upload Bill/Receipt *</label>
                      <input
                        className="form-control"
                        type="file"
                        name="receipt"
                        onChange={updateClaim}
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description / Purpose</label>
                      <textarea
                        className="form-control"
                        placeholder="Enter description or purpose"
                        name="description"
                        value={newClaim.description}
                        onChange={updateClaim}
                        rows="3"
                      />
                    </div>
                    {newClaim.type && (
                      <div className="col-12">
                        <div className="alert alert-info">
                          <div className="d-flex align-items-center">
                            <AlertCircle size={20} className="me-2 flex-shrink-0" />
                            <div>
                              <strong>Limit Information</strong>
                              <div className="mt-1">
                                <span className="me-3">
                                  <strong>Type Limit:</strong> ₹{reimbursements.find(r => r.name === newClaim.type)?.limit.toLocaleString() || 0}
                                </span>
                                {newClaim.amount && (
                                  <span>
                                    <strong>Remaining Balance:</strong> ₹{(() => {
                                      const empBalance = employeeBalances.find(eb => eb.employeeId === newClaim.employeeId);
                                      if (!empBalance) return "N/A";
                                      const balance = empBalance.balances[newClaim.type];
                                      if (!balance) return "N/A";
                                      return (balance.remaining - parseFloat(newClaim.amount || 0)).toLocaleString();
                                    })()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit Claim</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CLAIM DETAILS MODAL */}
      {showDetailsModal && selectedClaim && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Claim Details - {selectedClaim.employee}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowDetailsModal(false); setSelectedClaim(null); }} />
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Employee</label>
                    <div className="fw-bold">{selectedClaim.employee} ({selectedClaim.employeeId})</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Reimbursement Type</label>
                    <div className="fw-bold">{selectedClaim.type}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Claim Amount</label>
                    <div className="fw-bold">₹{selectedClaim.amount.toLocaleString()}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Tax Amount</label>
                    <div className="fw-bold text-danger">₹{selectedClaim.taxAmount?.toLocaleString() || 0}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Net Amount</label>
                    <div className="fw-bold text-success">₹{selectedClaim.netAmount?.toLocaleString() || selectedClaim.amount.toLocaleString()}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Claim Date</label>
                    <div className="fw-bold">{selectedClaim.date}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted">Description</label>
                  <div className="p-3 bg-light rounded">{selectedClaim.description || "No description provided"}</div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Manager Approval</h6>
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-2">
                          <span className="me-2">Status:</span>
                          <span className={`badge ${selectedClaim.managerApproval?.status === "Approved" ? "bg-success" : selectedClaim.managerApproval?.status === "Rejected" ? "bg-danger" : "bg-secondary"}`}>
                            {selectedClaim.managerApproval?.status || "Pending"}
                          </span>
                        </div>
                        {selectedClaim.managerApproval?.date && (
                          <div className="mb-1">
                            <small className="text-muted">Date:</small>
                            <div>{selectedClaim.managerApproval.date}</div>
                          </div>
                        )}
                        {selectedClaim.managerApproval?.approver && (
                          <div>
                            <small className="text-muted">Approver:</small>
                            <div>{selectedClaim.managerApproval.approver}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">Finance Approval</h6>
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-2">
                          <span className="me-2">Status:</span>
                          <span className={`badge ${selectedClaim.financeApproval?.status === "Approved" ? "bg-success" : selectedClaim.financeApproval?.status === "Rejected" ? "bg-danger" : "bg-secondary"}`}>
                            {selectedClaim.financeApproval?.status || "Pending"}
                          </span>
                        </div>
                        {selectedClaim.financeApproval?.date && (
                          <div className="mb-1">
                            <small className="text-muted">Date:</small>
                            <div>{selectedClaim.financeApproval.date}</div>
                          </div>
                        )}
                        {selectedClaim.financeApproval?.approver && (
                          <div>
                            <small className="text-muted">Approver:</small>
                            <div>{selectedClaim.financeApproval.approver}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="card">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">Payroll Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <span className="me-2">Status:</span>
                        {selectedClaim.payrollProcessed ? (
                          <span className="badge bg-success d-flex align-items-center">
                            <CheckCircle size={14} className="me-1" />
                            Processed
                          </span>
                        ) : (
                          <span className="badge bg-secondary">Pending</span>
                        )}
                      </div>
                      {selectedClaim.payrollDate && (
                        <div>
                          <small className="text-muted">Processed Date:</small>
                          <div>{selectedClaim.payrollDate}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
<div>
  <label className="form-label text-muted">Receipt File</label>
  <div className="d-flex align-items-center">
    <FileText size={20} className="me-2 text-primary flex-shrink-0" />
    <span className="text-truncate" style={{ maxWidth: '200px' }}>
      {selectedClaim.receiptFile || "No file uploaded"}
    </span>
    {selectedClaim.file && (
      <button 
        className="btn btn-sm btn-outline-primary ms-3 d-flex align-items-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDownloadFile(selectedClaim);
        }}
        style={{ 
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <Download size={14} />
        Download
      </button>
    )}
  </div>
</div>
            </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowDetailsModal(false); setSelectedClaim(null); }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT REIMBURSEMENT MODAL */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {editingReimbursement ? "Edit" : "Add"} Reimbursement Type
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowEditModal(false); setEditingReimbursement(null); }} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select" 
                    name="category"
                    value={editForm.category}
                    onChange={handleEditFormChange}
                  >
                    <option value="Health">Health</option>
                    <option value="Travel">Travel</option>
                    <option value="Communication">Communication</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Limit (₹) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="limit"
                    value={editForm.limit}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Frequency</label>
                  <select 
                    className="form-select" 
                    name="frequency"
                    value={editForm.frequency}
                    onChange={handleEditFormChange}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Ad-hoc">Ad-hoc</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Taxable</label>
                  <select 
                    className="form-select" 
                    name="taxable"
                    value={editForm.taxable}
                    onChange={handleEditFormChange}
                  >
                    <option value="false">Non-Taxable</option>
                    <option value="true">Taxable</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    name="description"
                    value={editForm.description}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowEditModal(false); setEditingReimbursement(null); }}>Cancel</button>
                <button className="btn btn-primary" onClick={saveReimbursementType}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS MODAL */}
      {showReportsModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Reimbursement Analytics & Reports</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowReportsModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="card bg-primary text-white">
                      <div className="card-body">
                        <h6>Total Claims</h6>
                        <h3>{totalClaims}</h3>
                        <small>₹{totalAmount.toLocaleString()}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-success text-white">
                      <div className="card-body">
                        <h6>Approved Claims</h6>
                        <h3>{approvedClaims}</h3>
                        <small>₹{approvedAmount.toLocaleString()}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-warning text-white">
                      <div className="card-body">
                        <h6>Pending Claims</h6>
                        <h3>{pendingClaims}</h3>
                        <small>₹{pendingAmount.toLocaleString()}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Claims by Status</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>Count</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Approved</td>
                            <td>{approvedClaims}</td>
                            <td>₹{approvedAmount.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Pending</td>
                            <td>{pendingClaims}</td>
                            <td>₹{pendingAmount.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Rejected</td>
                            <td>{rejectedClaims}</td>
                            <td>₹{claims.filter(c => c.status === "Rejected").reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6>Top Employees by Claims</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Claims</th>
                            <th>Total Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(
                            claims.reduce((acc, claim) => {
                              if (!acc[claim.employee]) {
                                acc[claim.employee] = { count: 0, total: 0 };
                              }
                              acc[claim.employee].count++;
                              acc[claim.employee].total += claim.amount;
                              return acc;
                            }, {})
                          )
                            .sort((a, b) => b[1].total - a[1].total)
                            .slice(0, 5)
                            .map(([employee, data]) => (
                              <tr key={employee}>
                                <td>{employee}</td>
                                <td>{data.count}</td>
                                <td>₹{data.total.toLocaleString()}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary d-flex align-items-center" onClick={() => alert("Report exported!")}>
                  <Download size={16} className="me-2" />
                  Export Report
                </button>
                <button className="btn btn-secondary" onClick={() => setShowReportsModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reimbursements;