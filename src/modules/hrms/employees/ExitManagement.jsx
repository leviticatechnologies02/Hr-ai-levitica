import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Eye,
  MessageSquare,
  Share2,
  CreditCard,
  Send,
  ArrowUp,
  CheckCircle,
  Printer,
  AlertCircle,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Clock,
  XCircle,
  CheckCircle2,
  FileCheck,
  Upload,
  Filter,
  File,
  FileText as FileTextIcon,
  Calculator,
  DollarSign,
  Receipt,
  Wallet,
  Percent,
  Shield
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ModalWrapper = ({ title, onClose, children, size = "modal-lg" }) => {
  return (
    <div
      className="modal fade show"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1055
      }}
    >
      <div className={`modal-dialog ${size}`} style={{ margin: 0, maxWidth: "900px", width: "100%" }}>
        <div className="modal-content">
          {/* Header - Bold Heading */}
          <div className="modal-header">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            />
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {children}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary btn-sm border" onClick={onClose}>
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const ExitManagement = () => {
  const [selectedExits, setSelectedExits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    clearanceType: '',
    exitReason: ''
  });
  const [showClearanceModal, setShowClearanceModal] = useState(false);
  const [selectedExit, setSelectedExit] = useState(null);
  const [viewMode, setViewMode] = useState('exitCases');
  const [showFilters, setShowFilters] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('IT');
  const [showExitInterviewModal, setShowExitInterviewModal] = useState(false);
  const [showKnowledgeTransferModal, setShowKnowledgeTransferModal] = useState(false);
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [showTrendsModal, setShowTrendsModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [exitInterviewData, setExitInterviewData] = useState({});
  const [knowledgeTransferData, setKnowledgeTransferData] = useState({});
  const [clearanceDetails, setClearanceDetails] = useState({});
  const [showEmployeeExitsReport, setShowEmployeeExitsReport] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showNewExitModal, setShowNewExitModal] = useState(false);
  
  // New Exit Form State
  const [newExitForm, setNewExitForm] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    role: '',
    resignationDate: '',
    lastWorkingDay: '',
    noticePeriod: '45 days',
    exitType: 'Resignation',
    exitReason: '',
    status: 'Pending',
    escalationLevel: 0,
    knowledgeTransfer: 'Pending',
    exitInterview: 'Pending',
    settlement: 'Pending',
    clearanceProgress: 0,
    pendingClearances: ['IT', 'Admin', 'Finance', 'HR', 'Department']
  });
  
  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' // success, warning, error
  });

  // Employee Exits Report Filters State
  const [employeeExitsFilters, setEmployeeExitsFilters] = useState({
    location: "",
    department: "",
    exitReason: "",
    fromDate: "",
    toDate: ""
  });

  // Settlement Detail State
  const [settlementDetail, setSettlementDetail] = useState({
    basicSalary: 0,
    leaveEncashment: 0,
    bonusIncentives: 0,
    otherEarnings: 0,
    loanDeductions: 0,
    advanceDeductions: 0,
    taxDeductions: 0,
    otherDeductions: 0,
    netPayable: 0,
    paymentMethod: 'Bank Transfer',
    paymentDate: '',
    bankDetails: {
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      accountHolder: ''
    },
    approvals: {
      finance: false,
      hr: false,
      department: false,
      ceo: false
    },
    status: 'Pending',
    notes: ''
  });

  // Employee Exits Report Data
  const [employeeExitsData, setEmployeeExitsData] = useState([
    {
      id: 1,
      name: "Bogala Chandramouli",
      code: "LEV096",
      location: "Hyderabad",
      department: "Technical Support",
      designation: "Associate Software Engineer",
      joining: "2023-01-15",
      exit: "2024-03-01",
      reason: "Resignation"
    },
    {
      id: 2,
      name: "Dorasala Nagendra",
      code: "LEV097",
      location: "Hyderabad",
      department: "Technical Support",
      designation: "Associate Software Engineer",
      joining: "2023-02-10",
      exit: "2024-02-15",
      reason: "Resignation"
    },
    {
      id: 3,
      name: "Abhilash Gurrampally",
      code: "LEV098",
      location: "Chennai",
      department: "HR Executive",
      designation: "HR Executive",
      joining: "2022-11-01",
      exit: "2024-01-20",
      reason: "Termination"
    },
    {
      id: 4,
      name: "Rajesh Kumar",
      code: "LEV099",
      location: "Mumbai",
      department: "Product Development Team",
      designation: "Software Engineer",
      joining: "2022-08-15",
      exit: "2024-02-28",
      reason: "Retirement"
    },
    {
      id: 5,
      name: "Priya Sharma",
      code: "LEV100",
      location: "Hyderabad",
      department: "Technical Support",
      designation: "Senior Associate",
      joining: "2021-06-01",
      exit: "2024-03-05",
      reason: "Resignation"
    },
    {
      id: 6,
      name: "Amit Patel",
      code: "LEV101",
      location: "Chennai",
      department: "Product Development Team",
      designation: "Lead Developer",
      joining: "2020-03-10",
      exit: "2024-02-10",
      reason: "Resignation"
    },
    {
      id: 7,
      name: "Sneha Reddy",
      code: "LEV102",
      location: "Hyderabad",
      department: "HR Executive",
      designation: "HR Manager",
      joining: "2022-09-15",
      exit: "2024-03-12",
      reason: "Resignation"
    },
    {
      id: 8,
      name: "Vikram Singh",
      code: "LEV103",
      location: "Mumbai",
      department: "Technical Support",
      designation: "Team Lead",
      joining: "2021-12-01",
      exit: "2024-01-31",
      reason: "Termination"
    }
  ]);

  // Helper function to get default clearance structure
  const getDefaultClearanceStructure = () => ({
    IT: {
      status: 'Pending',
      items: {
        laptop: { status: 'Pending', assetId: 'LAP001', condition: '', remarks: '' },
        mobile: { status: 'Pending', assetId: 'MOB001', condition: '', remarks: '' },
        accessCards: { status: 'Pending', cardIds: [], remarks: '' },
        softwareLicenses: { status: 'Pending', licenses: [], remarks: '' }
      },
      clearedBy: '',
      clearedDate: '',
      remarks: ''
    },
    Admin: {
      status: 'Pending',
      items: {
        idCard: { status: 'Pending', cardNumber: '', remarks: '' },
        accessCard: { status: 'Pending', cardNumber: '', remarks: '' },
        parkingSticker: { status: 'Pending', stickerId: '', remarks: '' },
        lockerKeys: { status: 'Pending', lockerNumber: '', remarks: '' }
      },
      clearedBy: '',
      clearedDate: '',
      remarks: ''
    },
    Finance: {
      status: 'Pending',
      items: {
        advanceSettlement: { status: 'Pending', amount: 0, remarks: '' },
        expenseClaims: { status: 'Pending', claims: [], remarks: '' },
        loanOutstanding: { status: 'Pending', amount: 0, remarks: '' }
      },
      clearedBy: '',
      clearedDate: '',
      remarks: ''
    },
    HR: {
      status: 'Pending',
      items: {
        documentation: { status: 'Pending', documents: [], remarks: '' },
        exitInterview: { status: 'Pending', scheduledDate: '', remarks: '' },
        policyViolations: { status: 'Pending', violations: [], remarks: '' }
      },
      clearedBy: '',
      clearedDate: '',
      remarks: ''
    },
    Department: {
      status: 'Pending',
      items: {
        projectHandover: { status: 'Pending', projects: [], remarks: '' },
        knowledgeTransfer: { status: 'Pending', ktStatus: '', remarks: '' },
        filesDocuments: { status: 'Pending', files: [], remarks: '' }
      },
      clearedBy: '',
      clearedDate: '',
      remarks: ''
    }
  });

  // Sample data with enhanced clearance structure
  const [exitCasesData, setExitCasesData] = useState([
    { id: 1, employeeId: 'EMP001', employeeName: 'Rahul Sharma', department: 'Engineering', role: 'Senior Software Engineer', resignationDate: '2024-03-01', lastWorkingDay: '2024-04-15', noticePeriod: '45 days', exitType: 'Resignation', exitReason: 'Better opportunity', clearanceProgress: 40, pendingClearances: ['IT', 'Finance', 'HR'], status: 'In Progress', escalationLevel: 0, knowledgeTransfer: 'In Progress', exitInterview: 'Scheduled', settlement: 'Pending', clearanceDetails: { ...getDefaultClearanceStructure(), IT: { ...getDefaultClearanceStructure().IT, status: 'Pending' }, Finance: { ...getDefaultClearanceStructure().Finance, status: 'Pending' }, HR: { ...getDefaultClearanceStructure().HR, status: 'Pending' }, Admin: { ...getDefaultClearanceStructure().Admin, status: 'Completed' }, Department: { ...getDefaultClearanceStructure().Department, status: 'Completed' } } },
    { id: 2, employeeId: 'EMP002', employeeName: 'Priya Patel', department: 'Marketing', role: 'Marketing Manager', resignationDate: '2024-02-15', lastWorkingDay: '2024-03-30', noticePeriod: '45 days', exitType: 'Resignation', exitReason: 'Career growth', clearanceProgress: 75, pendingClearances: ['Admin'], status: 'In Progress', escalationLevel: 0, knowledgeTransfer: 'Completed', exitInterview: 'Completed', settlement: 'In Progress', clearanceDetails: { ...getDefaultClearanceStructure(), Admin: { ...getDefaultClearanceStructure().Admin, status: 'Pending' } } },
    { id: 3, employeeId: 'EMP003', employeeName: 'Amit Kumar', department: 'Sales', role: 'Sales Executive', resignationDate: '2024-01-20', lastWorkingDay: '2024-02-29', noticePeriod: '30 days', exitType: 'Termination', exitReason: 'Performance', clearanceProgress: 100, pendingClearances: [], status: 'Completed', escalationLevel: 0, knowledgeTransfer: 'Completed', exitInterview: 'Completed', settlement: 'Completed', clearanceDetails: getDefaultClearanceStructure() },
    { id: 4, employeeId: 'EMP004', employeeName: 'Sneha Reddy', department: 'HR', role: 'HR Executive', resignationDate: '2024-03-10', lastWorkingDay: '2024-04-25', noticePeriod: '45 days', exitType: 'Resignation', exitReason: 'Higher studies', clearanceProgress: 25, pendingClearances: ['IT', 'Admin', 'Finance', 'HR', 'Department'], status: 'Pending', escalationLevel: 1, knowledgeTransfer: 'Pending', exitInterview: 'Pending', settlement: 'Pending', clearanceDetails: getDefaultClearanceStructure() },
    { id: 5, employeeId: 'EMP005', employeeName: 'Rajesh Verma', department: 'Finance', role: 'Finance Analyst', resignationDate: '2024-02-28', lastWorkingDay: '2024-04-12', noticePeriod: '45 days', exitType: 'Retirement', exitReason: 'Retirement', clearanceProgress: 90, pendingClearances: ['IT'], status: 'In Progress', escalationLevel: 0, knowledgeTransfer: 'In Progress', exitInterview: 'Scheduled', settlement: 'In Progress', clearanceDetails: { ...getDefaultClearanceStructure(), IT: { ...getDefaultClearanceStructure().IT, status: 'Pending' } } },
    { id: 6, employeeId: 'EMP006', employeeName: 'Meera Joshi', department: 'Engineering', role: 'Frontend Developer', resignationDate: '2024-03-05', lastWorkingDay: '2024-04-19', noticePeriod: '45 days', exitType: 'Resignation', exitReason: 'Relocation', clearanceProgress: 60, pendingClearances: ['Finance', 'Admin'], status: 'In Progress', escalationLevel: 0, knowledgeTransfer: 'In Progress', exitInterview: 'Scheduled', settlement: 'Pending', clearanceDetails: { ...getDefaultClearanceStructure(), Finance: { ...getDefaultClearanceStructure().Finance, status: 'Pending' }, Admin: { ...getDefaultClearanceStructure().Admin, status: 'Pending' } } },
    { id: 7, employeeId: 'EMP007', employeeName: 'Vikram Singh', department: 'Operations', role: 'Operations Manager', resignationDate: '2024-01-15', lastWorkingDay: '2024-01-31', noticePeriod: 'Immediate', exitType: 'Termination', exitReason: 'Policy violation', clearanceProgress: 100, pendingClearances: [], status: 'Completed', escalationLevel: 2, knowledgeTransfer: 'Not Required', exitInterview: 'Not Conducted', settlement: 'Completed', clearanceDetails: getDefaultClearanceStructure() },
    { id: 8, employeeId: 'EMP008', employeeName: 'Anjali Gupta', department: 'Marketing', role: 'Content Writer', resignationDate: '2024-03-12', lastWorkingDay: '2024-04-26', noticePeriod: '45 days', exitType: 'Resignation', exitReason: 'Better opportunity', clearanceProgress: 30, pendingClearances: ['IT', 'Admin', 'HR'], status: 'Pending', escalationLevel: 0, knowledgeTransfer: 'Pending', exitInterview: 'Pending', settlement: 'Pending', clearanceDetails: { ...getDefaultClearanceStructure(), IT: { ...getDefaultClearanceStructure().IT, status: 'Pending' }, Admin: { ...getDefaultClearanceStructure().Admin, status: 'Pending' }, HR: { ...getDefaultClearanceStructure().HR, status: 'Pending' } } }
  ]);

  const exitCases = exitCasesData;

  const [alumniNetwork, setAlumniNetwork] = useState([
    { id: 1, alumniId: 'ALM001', employeeId: 'EMP101', name: 'Rohit Verma', department: 'Engineering', lastRole: 'Tech Lead', exitDate: '2023-12-15', exitReason: 'Higher studies', rehireEligibility: 'Eligible', boomerangStatus: 'Interested', engagementLevel: 'High', totalReferrals: 3, successfulHires: 2 },
    { id: 2, alumniId: 'ALM002', employeeId: 'EMP102', name: 'Priya Sharma', department: 'Marketing', lastRole: 'Marketing Head', exitDate: '2023-10-20', exitReason: 'Startup venture', rehireEligibility: 'Eligible', boomerangStatus: 'Not Interested', engagementLevel: 'Medium', totalReferrals: 5, successfulHires: 3 },
    { id: 3, alumniId: 'ALM003', employeeId: 'EMP103', name: 'Arjun Singh', department: 'Sales', lastRole: 'Sales Director', exitDate: '2023-11-10', exitReason: 'Personal reasons', rehireEligibility: 'Eligible', boomerangStatus: 'Interested', engagementLevel: 'High', totalReferrals: 7, successfulHires: 4 },
    { id: 4, alumniId: 'ALM004', employeeId: 'EMP104', name: 'Neha Kapoor', department: 'HR', lastRole: 'HR Manager', exitDate: '2023-09-05', exitReason: 'Career break', rehireEligibility: 'Not Eligible', boomerangStatus: 'Not Interested', engagementLevel: 'Low', totalReferrals: 1, successfulHires: 0 }
  ]);

  const [settlements, setSettlements] = useState([
    { id: 1, employeeId: 'EMP003', employeeName: 'Amit Kumar', department: 'Sales', netAmount: '₹1,25,000', paymentDate: '2024-03-15', status: 'Completed', approvalStatus: 'All Approved' },
    { id: 2, employeeId: 'EMP007', employeeName: 'Vikram Singh', department: 'Operations', netAmount: '₹85,000', paymentDate: '2024-02-10', status: 'Completed', approvalStatus: 'All Approved' },
    { id: 3, employeeId: 'EMP002', employeeName: 'Priya Patel', department: 'Marketing', netAmount: '₹1,50,000', paymentDate: '2024-04-05', status: 'In Progress', approvalStatus: '2/4 Approved' },
    { id: 4, employeeId: 'EMP005', employeeName: 'Rajesh Verma', department: 'Finance', netAmount: '₹2,00,000', paymentDate: '2024-04-20', status: 'Pending', approvalStatus: '0/4 Approved' }
  ]);

  const insights = {
    totalExitCases: exitCases.length,
    pendingClearances: exitCases.filter(ec => ec.status !== 'Completed').length,
    escalatedCases: exitCases.filter(ec => ec.escalationLevel > 0).length,
    alumniCount: alumniNetwork.length,
    pendingInterviews: exitCases.filter(ec => ec.exitInterview === 'Scheduled' || ec.exitInterview === 'Pending').length,
    pendingSettlements: exitCases.filter(ec => ec.settlement === 'Pending' || ec.settlement === 'In Progress').length,
    rehireEligible: alumniNetwork.filter(a => a.rehireEligibility === 'Eligible').length,
    boomerangCandidates: alumniNetwork.filter(a => a.boomerangStatus === 'Interested').length
  };

  // CSS to remove hover effects from view mode tabs only
  const hoverRemovalCSS = `
    /* Remove hover from view mode tabs only */
    .view-mode-tab-btn:hover,
    .view-mode-tab-btn:focus,
    .view-mode-tab-btn:active {
      background-color: inherit !important;
      color: inherit !important;
      border-color: inherit !important;
      transform: none !important;
      box-shadow: none !important;
      cursor: pointer !important;
    }
    
    /* For active tabs */
    .view-mode-tab-btn.btn-primary:hover,
    .view-mode-tab-btn.btn-primary:focus,
    .view-mode-tab-btn.btn-primary:active {
      background-color: #0d6efd !important;
      color: white !important;
      border-color: #0d6efd !important;
    }
    
    /* For outline tabs */
    .view-mode-tab-btn.btn-outline-primary:hover,
    .view-mode-tab-btn.btn-outline-primary:focus,
    .view-mode-tab-btn.btn-outline-primary:active {
      background-color: transparent !important;
      color: #0d6efd !important;
      border-color: #0d6efd !important;
    }
  `;

  // Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentItems = viewMode === 'exitCases' ? filteredExits :
        viewMode === 'alumni' ? filteredAlumni :
          viewMode === 'settlements' ? filteredSettlements :
            filteredEmployeeExits;
      setSelectedExits(currentItems.map(item => item.id));
    } else {
      setSelectedExits([]);
    }
  };

  const handleSelectExit = (id) => {
    setSelectedExits(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // Handle Delete Selected
  const handleDeleteSelected = () => {
    if (selectedExits.length === 0) {
      showNotification('Please select at least one item to delete.', 'warning');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedExits.length} selected item(s)? This action cannot be undone.`)) {
      // Delete logic based on view mode
      switch(viewMode) {
        case 'exitCases':
          const newExitCases = exitCasesData.filter(exit => !selectedExits.includes(exit.id));
          setExitCasesData(newExitCases);
          showNotification(`${selectedExits.length} exit case(s) deleted successfully.`);
          break;
        case 'alumni':
          const newAlumni = alumniNetwork.filter(alumni => !selectedExits.includes(alumni.id));
          setAlumniNetwork(newAlumni);
          showNotification(`${selectedExits.length} alumni record(s) deleted successfully.`);
          break;
        case 'settlements':
          const newSettlements = settlements.filter(settlement => !selectedExits.includes(settlement.id));
          setSettlements(newSettlements);
          showNotification(`${selectedExits.length} settlement record(s) deleted successfully.`);
          break;
        case 'employeeExits':
          const newEmployeeExits = employeeExitsData.filter(emp => !selectedExits.includes(emp.id));
          setEmployeeExitsData(newEmployeeExits);
          showNotification(`${selectedExits.length} employee exit record(s) deleted successfully.`);
          break;
        default:
          break;
      }
      setSelectedExits([]);
    }
  };

  // Handle Duplicate Selected
  const handleDuplicateSelected = () => {
    if (selectedExits.length === 0) {
      showNotification('Please select at least one item to duplicate.', 'warning');
      return;
    }

    // Duplicate logic based on view mode
    switch(viewMode) {
      case 'exitCases':
        const exitsToDuplicate = exitCasesData.filter(exit => selectedExits.includes(exit.id));
        const duplicatedExits = exitsToDuplicate.map(exit => ({
          ...exit,
          id: Math.max(...exitCasesData.map(e => e.id)) + 1,
          employeeId: `EMP${String(Math.max(...exitCasesData.map(e => parseInt(e.employeeId.replace('EMP', '')))) + 1).padStart(3, '0')}`,
          employeeName: `${exit.employeeName} (Copy)`,
          status: 'Pending',
          clearanceProgress: 0,
          pendingClearances: ['IT', 'Admin', 'Finance', 'HR', 'Department']
        }));
        setExitCasesData([...exitCasesData, ...duplicatedExits]);
        showNotification(`${selectedExits.length} exit case(s) duplicated successfully.`);
        break;
      case 'alumni':
        const alumniToDuplicate = alumniNetwork.filter(alumni => selectedExits.includes(alumni.id));
        const duplicatedAlumni = alumniToDuplicate.map(alumni => ({
          ...alumni,
          id: Math.max(...alumniNetwork.map(a => a.id)) + 1,
          alumniId: `ALM${String(Math.max(...alumniNetwork.map(a => parseInt(a.alumniId.replace('ALM', '')))) + 1).padStart(3, '0')}`,
          employeeId: `EMP${String(Math.max(...alumniNetwork.map(a => parseInt(a.employeeId.replace('EMP', '')))) + 1).padStart(3, '0')}`,
          name: `${alumni.name} (Copy)`
        }));
        setAlumniNetwork([...alumniNetwork, ...duplicatedAlumni]);
        showNotification(`${selectedExits.length} alumni record(s) duplicated successfully.`);
        break;
      case 'settlements':
        const settlementsToDuplicate = settlements.filter(settlement => selectedExits.includes(settlement.id));
        const duplicatedSettlements = settlementsToDuplicate.map(settlement => ({
          ...settlement,
          id: Math.max(...settlements.map(s => s.id)) + 1,
          employeeId: `EMP${String(Math.max(...settlements.map(s => parseInt(s.employeeId.replace('EMP', '')))) + 1).padStart(3, '0')}`,
          employeeName: `${settlement.employeeName} (Copy)`,
          status: 'Pending',
          approvalStatus: '0/4 Approved'
        }));
        setSettlements([...settlements, ...duplicatedSettlements]);
        showNotification(`${selectedExits.length} settlement record(s) duplicated successfully.`);
        break;
      case 'employeeExits':
        const employeesToDuplicate = employeeExitsData.filter(emp => selectedExits.includes(emp.id));
        const duplicatedEmployees = employeesToDuplicate.map(emp => ({
          ...emp,
          id: Math.max(...employeeExitsData.map(e => e.id)) + 1,
          code: `LEV${String(Math.max(...employeeExitsData.map(e => parseInt(e.code.replace('LEV', '')))) + 1).padStart(3, '0')}`,
          name: `${emp.name} (Copy)`
        }));
        setEmployeeExitsData([...employeeExitsData, ...duplicatedEmployees]);
        showNotification(`${selectedExits.length} employee exit record(s) duplicated successfully.`);
        break;
      default:
        break;
    }
    setSelectedExits([]);
  };

  // Handle Generate Certificates
  const handleGenerateCertificates = () => {
    if (selectedExits.length === 0) {
      showNotification('Please select at least one exit case to generate certificates.', 'warning');
      return;
    }

    if (viewMode !== 'exitCases') {
      showNotification('Certificates can only be generated for exit cases.', 'warning');
      return;
    }

    const selectedCases = exitCasesData.filter(exit => selectedExits.includes(exit.id));
    
    // Check if all selected cases are completed
    const pendingCases = selectedCases.filter(caseItem => caseItem.status !== 'Completed');
    if (pendingCases.length > 0) {
      showNotification(`${pendingCases.length} selected case(s) are not completed. Complete clearance first.`, 'error');
      return;
    }

    // Generate certificates
    alert(`Generating certificates for ${selectedExits.length} employees:\n${selectedCases.map(c => `• ${c.employeeName} (${c.employeeId})`).join('\n')}\n\nCertificates have been generated and sent to the print queue.`);
    
    // Simulate certificate generation
    const certificateData = selectedCases.map(caseItem => ({
      employeeName: caseItem.employeeName,
      employeeId: caseItem.employeeId,
      department: caseItem.department,
      lastWorkingDay: caseItem.lastWorkingDay,
      certificateDate: new Date().toLocaleDateString(),
      certificateId: `CERT-${caseItem.employeeId}-${Date.now()}`
    }));

    console.log('Generated Certificates:', certificateData);
    showNotification(`${selectedExits.length} certificate(s) generated successfully.`);
    setSelectedExits([]);
  };

  // Handle New Exit Form Change
  const handleNewExitFormChange = (e) => {
    const { name, value } = e.target;
    setNewExitForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle New Exit Submit
  const handleNewExitSubmit = () => {
    // Validate form
    if (!newExitForm.employeeName.trim() || !newExitForm.employeeId.trim() || !newExitForm.department.trim() || 
        !newExitForm.role.trim() || !newExitForm.resignationDate || !newExitForm.lastWorkingDay) {
      showNotification('Please fill all required fields.', 'error');
      return;
    }

    // Generate new ID
    const newId = Math.max(...exitCasesData.map(e => e.id)) + 1;
    const newEmployeeId = newExitForm.employeeId || `EMP${String(Math.max(...exitCasesData.map(e => parseInt(e.employeeId.replace('EMP', '')))) + 1).padStart(3, '0')}`;
    
    // Calculate days between dates
    const resignationDate = new Date(newExitForm.resignationDate);
    const lastWorkingDay = new Date(newExitForm.lastWorkingDay);
    const daysDifference = Math.ceil((lastWorkingDay - resignationDate) / (1000 * 60 * 60 * 24));
    const noticePeriod = `${daysDifference} days`;
    
    // Create new exit case
    const newExitCase = {
      id: newId,
      employeeId: newEmployeeId,
      employeeName: newExitForm.employeeName,
      department: newExitForm.department,
      role: newExitForm.role,
      resignationDate: newExitForm.resignationDate,
      lastWorkingDay: newExitForm.lastWorkingDay,
      noticePeriod: noticePeriod,
      exitType: newExitForm.exitType,
      exitReason: newExitForm.exitReason,
      clearanceProgress: 0,
      pendingClearances: ['IT', 'Admin', 'Finance', 'HR', 'Department'],
      status: 'Pending',
      escalationLevel: 0,
      knowledgeTransfer: 'Pending',
      exitInterview: 'Pending',
      settlement: 'Pending',
      clearanceDetails: getDefaultClearanceStructure()
    };

    // Add to exit cases
    setExitCasesData(prev => [newExitCase, ...prev]);
    
    // Reset form and close modal
    setNewExitForm({
      employeeName: '',
      employeeId: '',
      department: '',
      role: '',
      resignationDate: '',
      lastWorkingDay: '',
      noticePeriod: '45 days',
      exitType: 'Resignation',
      exitReason: '',
      status: 'Pending',
      escalationLevel: 0,
      knowledgeTransfer: 'Pending',
      exitInterview: 'Pending',
      settlement: 'Pending',
      clearanceProgress: 0,
      pendingClearances: ['IT', 'Admin', 'Finance', 'HR', 'Department']
    });
    
    setShowNewExitModal(false);
    showNotification('New exit case created successfully!');
    
    // Switch to exit cases view
    setViewMode('exitCases');
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Pending': 'bg-secondary-subtle text-secondary border border-secondary-subtle',
      'In Progress': 'bg-primary-subtle text-primary border border-primary-subtle',
      'Completed': 'bg-success-subtle text-success border border-success-subtle',
      'Escalated': 'bg-danger-subtle text-danger border border-danger-subtle',
      'Scheduled': 'bg-warning-subtle text-warning border border-warning-subtle'
    };
    return colors[status] || 'bg-secondary-subtle text-secondary border border-secondary-subtle';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  const getEscalationBadge = (level) => {
    if (level === 0) return null;
    const colors = {
      1: 'bg-warning-subtle text-warning border border-warning-subtle',
      2: 'bg-danger-subtle text-danger border border-danger-subtle',
      3: 'bg-dark-subtle text-dark border border-dark-subtle'
    };
    return colors[level] || 'bg-secondary-subtle text-secondary border border-secondary-subtle';
  };

  // Filter data for different views
  const filteredExits = exitCasesData.filter(exit => {
    const matchesSearch = exit.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exit.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exit.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exit.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = !filters.department || exit.department.toLowerCase() === filters.department.toLowerCase();
    const matchesStatus = !filters.status || exit.status.toLowerCase() === filters.status.toLowerCase();
    const matchesClearanceType = !filters.clearanceType || exit.exitType.toLowerCase() === filters.clearanceType.toLowerCase();
    const matchesExitReason = !filters.exitReason || exit.exitReason.toLowerCase().includes(filters.exitReason.toLowerCase());

    return matchesSearch && matchesDepartment && matchesStatus && matchesClearanceType && matchesExitReason;
  });

  const filteredAlumni = alumniNetwork.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.alumniId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = !filters.department || alumni.department.toLowerCase() === filters.department.toLowerCase();
    const matchesStatus = !filters.status || alumni.rehireEligibility.toLowerCase() === filters.status.toLowerCase();

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch = settlement.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = !filters.department || settlement.department.toLowerCase() === filters.department.toLowerCase();
    const matchesStatus = !filters.status || settlement.status.toLowerCase() === filters.status.toLowerCase();

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Employee Exits Report Functions
  const handleEmployeeExitsFilterChange = (e) => {
    const { name, value } = e.target;
    setEmployeeExitsFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredEmployeeExits = employeeExitsData.filter(emp => {
    const fromDate = employeeExitsFilters.fromDate ? new Date(employeeExitsFilters.fromDate) : null;
    const toDate = employeeExitsFilters.toDate ? new Date(employeeExitsFilters.toDate) : null;
    const exitDate = emp.exit ? new Date(emp.exit) : null;

    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      (employeeExitsFilters.location === "" || emp.location === employeeExitsFilters.location) &&
      (employeeExitsFilters.department === "" || emp.department === employeeExitsFilters.department) &&
      (employeeExitsFilters.exitReason === "" || emp.reason === employeeExitsFilters.exitReason) &&
      (!fromDate || !exitDate || exitDate >= fromDate) &&
      (!toDate || !exitDate || exitDate <= toDate)
    );
  });

  // Get current items
  const getCurrentItems = () => {
    if (viewMode === 'exitCases') return filteredExits;
    if (viewMode === 'alumni') return filteredAlumni;
    if (viewMode === 'settlements') return filteredSettlements;
    if (viewMode === 'employeeExits') return filteredEmployeeExits;
    return [];
  };

  const currentItems = getCurrentItems();
  const totalPages = Math.ceil(currentItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, currentItems.length);
  const currentItemsPage = currentItems.slice(startIndex, endIndex);

  // Reset to page 1 when filters/search/view changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, viewMode, employeeExitsFilters]);

  // Reset to page 1 when items per page changes
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Always reset to page 1 when changing items per page
  };

  // Function to get export data based on view mode
  const getExportData = () => {
    let headers = [];
    let data = [];
    let title = "";

    switch(viewMode) {
      case 'exitCases':
        title = "Exit Management Report - Exit Cases";
        headers = ["Employee ID", "Employee Name", "Department", "Role", "Resignation Date", "Last Working Day", "Exit Type", "Exit Reason", "Status", "Clearance Progress", "Pending Clearances"];
        data = filteredExits.map(exit => [
          exit.employeeId,
          exit.employeeName,
          exit.department,
          exit.role,
          exit.resignationDate,
          exit.lastWorkingDay,
          exit.exitType,
          exit.exitReason,
          exit.status,
          `${exit.clearanceProgress}%`,
          exit.pendingClearances.join(', ')
        ]);
        break;

      case 'alumni':
        title = "Exit Management Report - Alumni Network";
        headers = ["Alumni ID", "Employee ID", "Name", "Department", "Last Role", "Exit Date", "Exit Reason", "Rehire Eligibility", "Boomerang Status", "Engagement Level", "Total Referrals", "Successful Hires"];
        data = filteredAlumni.map(alumni => [
          alumni.alumniId,
          alumni.employeeId,
          alumni.name,
          alumni.department,
          alumni.lastRole,
          alumni.exitDate,
          alumni.exitReason,
          alumni.rehireEligibility,
          alumni.boomerangStatus,
          alumni.engagementLevel,
          alumni.totalReferrals,
          alumni.successfulHires
        ]);
        break;

      case 'settlements':
        title = "Exit Management Report - Settlements";
        headers = ["Employee ID", "Employee Name", "Department", "Net Amount", "Payment Date", "Status", "Approval Status"];
        data = filteredSettlements.map(settlement => [
          settlement.employeeId,
          settlement.employeeName,
          settlement.department,
          settlement.netAmount,
          settlement.paymentDate,
          settlement.status,
          settlement.approvalStatus
        ]);
        break;

      case 'employeeExits':
        title = "Employee Exits Report";
        headers = ["Name", "Code", "Location", "Department", "Designation", "Joining Date", "Exit Date", "Reason of Exit"];
        data = filteredEmployeeExits.map(emp => [
          emp.name,
          emp.code,
          emp.location,
          emp.department,
          emp.designation,
          emp.joining,
          emp.exit,
          emp.reason
        ]);
        break;

      default:
        return { headers: [], data: [], title: "" };
    }

    return { headers, data, title };
  };

  // Function to export as Excel (CSV)
  const handleExportExcel = () => {
    if (currentItems.length === 0) {
      showNotification("No data to export!", "warning");
      return;
    }

    const { headers, data, title } = getExportData();
    
    // Add title as first row
    const csvContent = [
      [title],
      [],
      headers,
      ...data
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename based on view mode
    let filename = '';
    switch(viewMode) {
      case 'exitCases':
        filename = 'Exit_Management_Report_Exit_Cases.csv';
        break;
      case 'alumni':
        filename = 'Exit_Management_Report_Alumni_Network.csv';
        break;
      case 'settlements':
        filename = 'Exit_Management_Report_Settlements.csv';
        break;
      case 'employeeExits':
        filename = 'Employee_Exits_Report.csv';
        break;
      default:
        filename = 'Exit_Management_Report.csv';
    }
    
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification(`${filename} downloaded successfully!`);
  };

  // Function to export as PDF
  const handleExportPDF = () => {
    if (currentItems.length === 0) {
      showNotification("No data to export!", "warning");
      return;
    }

    const { headers, data, title } = getExportData();
    
    // Create PDF content using simple text format
    let pdfContent = `%PDF-1.4\n`;
    pdfContent += `1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n`;
    pdfContent += `2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n`;
    pdfContent += `3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n/Resources <<\n/Font <<\n/F1 5 0 R\n/F2 6 0 R\n>>\n>>\n>>\nendobj\n`;
    
    // Create content stream
    let stream = `BT\n/F2 16 Tf\n72 750 Td\n(${title}) Tj\nET\n`;
    stream += `BT\n/F1 10 Tf\n72 720 Td\n`;
    stream += `(Generated on: ${new Date().toLocaleDateString()}) Tj\nET\n`;
    stream += `BT\n/F1 12 Tf\n72 680 Td\n`;
    
    // Add headers
    stream += `(${headers.join(' | ')}) Tj\n`;
    stream += `72 660 Td\n`;
    
    // Add data rows
    data.forEach((row, index) => {
      if (index < 20) { // Limit to 20 rows per page
        stream += `(${row.join(' | ')}) Tj\n`;
        stream += `72 ${660 - (index + 1) * 20} Td\n`;
      }
    });
    
    stream += `ET`;
    
    // Calculate length
    const streamLength = stream.length;
    
    pdfContent += `4 0 obj\n<<\n/Length ${streamLength}\n>>\nstream\n${stream}\nendstream\nendobj\n`;
    pdfContent += `5 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n`;
    pdfContent += `6 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica-Bold\n>>\nendobj\n`;
    pdfContent += `xref\n0 7\n0000000000 65535 f \n0000000010 00000 n \n0000000079 00000 n \n0000000178 00000 n \n0000000301 00000 n \n0000000456 00000 n \n0000000512 00000 n \ntrailer\n<<\n/Size 7\n/Root 1 0 R\n>>\nstartxref\n720\n%%EOF`;
    
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename based on view mode
    let filename = '';
    switch(viewMode) {
      case 'exitCases':
        filename = 'Exit_Management_Report_Exit_Cases.pdf';
        break;
      case 'alumni':
        filename = 'Exit_Management_Report_Alumni_Network.pdf';
        break;
      case 'settlements':
        filename = 'Exit_Management_Report_Settlements.pdf';
        break;
      case 'employeeExits':
        filename = 'Employee_Exits_Report.pdf';
        break;
      default:
        filename = 'Exit_Management_Report.pdf';
    }
    
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification(`${filename} downloaded successfully!`);
  };

  // Download individual settlement details
  const handleDownloadSettlement = (settlementId, format = 'excel') => {
    const settlement = settlements.find(s => s.id === settlementId);
    if (!settlement) {
      showNotification("Settlement not found!", "error");
      return;
    }

    // Find the corresponding exit case for more details
    const exitCase = exitCases.find(e => e.employeeId === settlement.employeeId);
    
    // Create settlement details object
    const settlementDetails = {
      "Employee ID": settlement.employeeId,
      "Employee Name": settlement.employeeName,
      "Department": settlement.department,
      "Net Amount": settlement.netAmount,
      "Payment Date": settlement.paymentDate,
      "Status": settlement.status,
      "Approval Status": settlement.approvalStatus
    };

    if (exitCase) {
      // Add more details from exit case
      settlementDetails["Resignation Date"] = exitCase.resignationDate;
      settlementDetails["Last Working Day"] = exitCase.lastWorkingDay;
      settlementDetails["Exit Type"] = exitCase.exitType;
      settlementDetails["Exit Reason"] = exitCase.exitReason;
      settlementDetails["Clearance Progress"] = `${exitCase.clearanceProgress}%`;
    }

    if (format === 'excel') {
      // Create CSV content for Excel
      const headers = Object.keys(settlementDetails);
      const values = Object.values(settlementDetails);
      const csvContent = [headers.join(","), values.join(",")].join("\n");
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Settlement_${settlement.employeeId}_${settlement.employeeName.replace(/\s+/g, '_')}.csv`;
      link.click();
      
      URL.revokeObjectURL(url);
      showNotification(`Settlement details for ${settlement.employeeName} downloaded as Excel!`);
    } else {
      // Create PDF content
      let pdfContent = `%PDF-1.4\n`;
      pdfContent += `1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n`;
      pdfContent += `2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n`;
      pdfContent += `3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n/Resources <<\n/Font <<\n/F1 5 0 R\n/F2 6 0 R\n>>\n>>\n>>\nendobj\n`;
      
      // Create content stream
      let stream = `BT\n/F2 16 Tf\n72 750 Td\n(Settlement Details Report) Tj\nET\n`;
      stream += `BT\n/F1 10 Tf\n72 720 Td\n`;
      stream += `(Generated on: ${new Date().toLocaleDateString()}) Tj\nET\n`;
      stream += `BT\n/F1 12 Tf\n72 680 Td\n`;
      
      // Add details
      let yPos = 680;
      Object.entries(settlementDetails).forEach(([key, value]) => {
        stream += `(${key}: ${value}) Tj\n`;
        stream += `72 ${yPos - 20} Td\n`;
        yPos -= 20;
      });
      
      stream += `ET`;
      
      // Calculate length
      const streamLength = stream.length;
      
      pdfContent += `4 0 obj\n<<\n/Length ${streamLength}\n>>\nstream\n${stream}\nendstream\nendobj\n`;
      pdfContent += `5 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n`;
      pdfContent += `6 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica-Bold\n>>\nendobj\n`;
      pdfContent += `xref\n0 7\n0000000000 65535 f \n0000000010 00000 n \n0000000079 00000 n \n0000000178 00000 n \n0000000301 00000 n \n0000000456 00000 n \n0000000512 00000 n \ntrailer\n<<\n/Size 7\n/Root 1 0 R\n>>\nstartxref\n720\n%%EOF`;
      
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Settlement_${settlement.employeeId}_${settlement.employeeName.replace(/\s+/g, '_')}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
      showNotification(`Settlement details for ${settlement.employeeName} downloaded as PDF!`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewExit = (exitId) => {
    if (viewMode === 'exitCases') {
      const exit = exitCases.find(e => e.id === exitId);
      if (exit) {
        setSelectedExit(exit);
        if (exit.clearanceDetails) {
          setClearanceDetails(exit.clearanceDetails);
        } else {
          setClearanceDetails(getDefaultClearanceStructure());
        }
        setActiveModalTab('IT');
        setShowClearanceModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    setShowClearanceModal(false);
    setShowExitInterviewModal(false);
    setShowKnowledgeTransferModal(false);
    setShowAlumniModal(false);
    setShowTrendsModal(false);
    setShowCertificateModal(false);
    setShowSettlementModal(false);
    setShowNewExitModal(false);
    setSelectedExit(null);
    setActiveModalTab('IT');
  };

  const handleOpenExitInterview = (exitId) => {
    const exit = exitCases.find(e => e.id === exitId);
    if (exit) {
      setSelectedExit(exit);
      setExitInterviewData(exit.exitInterviewData || {});
      setShowExitInterviewModal(true);
    }
  };

  const handleOpenKnowledgeTransfer = (exitId) => {
    const exit = exitCases.find(e => e.id === exitId);
    if (exit) {
      setSelectedExit(exit);
      setKnowledgeTransferData(exit.knowledgeTransferData || {});
      setShowKnowledgeTransferModal(true);
    }
  };

  const handleOpenSettlement = (exitId) => {
    const exit = exitCases.find(e => e.id === exitId);
    if (exit) {
      setSelectedExit(exit);
      // Calculate sample settlement values based on role and department
      const roleBasedSalary = exit.role.includes('Senior') || exit.role.includes('Lead') || exit.role.includes('Manager') ? 75000 : 45000;
      const leaveDays = 12;
      const leaveEncashmentVal = leaveDays * (roleBasedSalary / 30);
      const bonus = exit.role.includes('Senior') || exit.role.includes('Lead') || exit.role.includes('Manager') ? 25000 : 15000;
      const loanDeduction = exit.department === 'Finance' ? 15000 : 5000;
      const tax = roleBasedSalary * 0.1;
      const netPayable = roleBasedSalary + leaveEncashmentVal + bonus - loanDeduction - tax;

      setSettlementDetail({
        basicSalary: roleBasedSalary,
        leaveEncashment: leaveEncashmentVal,
        bonusIncentives: bonus,
        otherEarnings: 0,
        loanDeductions: loanDeduction,
        advanceDeductions: 0,
        taxDeductions: tax,
        otherDeductions: 0,
        netPayable: netPayable,
        paymentMethod: 'Bank Transfer',
        paymentDate: exit.lastWorkingDay,
        bankDetails: {
          accountNumber: 'XXXXXX7890',
          bankName: 'HDFC Bank',
          ifscCode: 'HDFC0001234',
          accountHolder: exit.employeeName
        },
        approvals: {
          finance: exit.department === 'Finance' ? true : false,
          hr: false,
          department: true,
          ceo: false
        },
        status: exit.settlement || 'Pending',
        notes: 'Settlement calculation based on company policy'
      });
      setShowSettlementModal(true);
    }
  };

  const handleGenerateCertificate = () => {
    if (selectedExit) {
      setShowCertificateModal(true);
    }
  };

  const handleSettlementChange = (e) => {
    const { name, value } = e.target;
    setSettlementDetail(prev => ({
      ...prev,
      [name]: name.includes('Deductions') || name.includes('Encashment') || name.includes('Salary') || name.includes('bonus') || name.includes('Earnings') ? parseFloat(value) || 0 : value
    }));
  };

  const handleBankDetailChange = (e) => {
    const { name, value } = e.target;
    setSettlementDetail(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [name]: value
      }
    }));
  };

  const handleApprovalChange = (approvalType) => {
    setSettlementDetail(prev => ({
      ...prev,
      approvals: {
        ...prev.approvals,
        [approvalType]: !prev.approvals[approvalType]
      }
    }));
  };

  const calculateNetPayable = () => {
    const totalEarnings = settlementDetail.basicSalary + settlementDetail.leaveEncashment + settlementDetail.bonusIncentives + settlementDetail.otherEarnings;
    const totalDeductions = settlementDetail.loanDeductions + settlementDetail.advanceDeductions + settlementDetail.taxDeductions + settlementDetail.otherDeductions;
    return totalEarnings - totalDeductions;
  };

  // Update net payable when settlement details change
  useEffect(() => {
    const netPayable = calculateNetPayable();
    setSettlementDetail(prev => ({
      ...prev,
      netPayable: netPayable
    }));
  }, [
    settlementDetail.basicSalary,
    settlementDetail.leaveEncashment,
    settlementDetail.bonusIncentives,
    settlementDetail.otherEarnings,
    settlementDetail.loanDeductions,
    settlementDetail.advanceDeductions,
    settlementDetail.taxDeductions,
    settlementDetail.otherDeductions
  ]);

  // Calculate notice period days automatically
  useEffect(() => {
    if (newExitForm.resignationDate && newExitForm.lastWorkingDay) {
      const resignationDate = new Date(newExitForm.resignationDate);
      const lastWorkingDay = new Date(newExitForm.lastWorkingDay);
      const daysDifference = Math.ceil((lastWorkingDay - resignationDate) / (1000 * 60 * 60 * 24));
      
      if (daysDifference > 0) {
        setNewExitForm(prev => ({
          ...prev,
          noticePeriod: `${daysDifference} days`
        }));
      }
    }
  }, [newExitForm.resignationDate, newExitForm.lastWorkingDay]);

  const renderExitCasesTable = () => (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: 40 }} className="text-center d-none d-md-table-cell">
              <input
                type="checkbox"
                className="form-check-input border"
                checked={selectedExits.length === currentItemsPage.length && currentItemsPage.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th className="text-start">EMPLOYEE</th>
            <th className="text-start d-none d-lg-table-cell">DEPT</th>
            <th className="text-start">LAST DAY</th>
            <th className="text-center d-none d-xl-table-cell">PROGRESS</th>
            <th className="text-center d-none d-lg-table-cell">PENDING</th>
            <th className="text-center">STATUS</th>
            <th className="text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {currentItemsPage.map(exit => (
            <tr key={exit.id}>
              <td className="text-center d-none d-md-table-cell">
                <input
                  type="checkbox"
                  className="form-check-input border"
                  checked={selectedExits.includes(exit.id)}
                  onChange={() => handleSelectExit(exit.id)}
                />
              </td>
              <td className="text-start">
                <div className="d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3 border border-primary" style={{ width: '36px', height: '36px', fontSize: '12px' }}>
                    {exit.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="d-flex flex-column">
                    <div className="fw-medium small">{exit.employeeName}</div>
                    <small className="text-muted d-none d-sm-block">{exit.employeeId}</small>
                    <small className="text-muted d-sm-none">{exit.employeeId}</small>
                    <small className="text-muted d-block d-lg-none">{exit.department}</small>
                  </div>
                </div>
              </td>
              <td className="text-start d-none d-lg-table-cell">
                <span className="badge bg-light text-dark border">
                  {exit.department}
                </span>
              </td>
              <td className="text-start">
                <div className="fw-medium small">{exit.lastWorkingDay}</div>
                <small className="text-muted d-none d-sm-block">
                  {Math.ceil((new Date(exit.lastWorkingDay) - new Date()) / (1000 * 60 * 60 * 24))} days left
                </small>
              </td>
              <td className="text-center d-none d-xl-table-cell">
                <div className="d-flex align-items-center gap-2">
                  <div className="flex-grow-1">
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className={`progress-bar ${getProgressColor(exit.clearanceProgress)} border`}
                        style={{ width: `${exit.clearanceProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="fw-medium small">{exit.clearanceProgress}%</div>
                </div>
              </td>
              <td className="text-center d-none d-lg-table-cell">
                {exit.pendingClearances.length > 0 ? (
                  <div>
                    {exit.pendingClearances.slice(0, 1).map((dept, idx) => (
                      <span key={idx} className="badge bg-warning me-1 mb-1 small border border-warning-subtle">
                        {dept}
                      </span>
                    ))}
                    {exit.pendingClearances.length > 1 && (
                      <span className="badge bg-light text-dark small border">
                        +{exit.pendingClearances.length - 1}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="badge bg-success small border border-success-subtle">Cleared</span>
                )}
              </td>
              <td className="text-center">
                <div className="d-flex flex-column gap-1">
                  <span className={`badge ${getStatusBadge(exit.status)} small`}>
                    {exit.status}
                  </span>
                  {exit.escalationLevel > 0 && (
                    <span className={`badge ${getEscalationBadge(exit.escalationLevel)} small`}>
                      <i className="bi bi-exclamation-triangle me-1" style={{ fontSize: '10px', color: exit.escalationLevel === 1 ? '#ffc107' : exit.escalationLevel === 2 ? '#dc3545' : '#6c757d' }}></i>
                      L{exit.escalationLevel}
                    </span>
                  )}
                </div>
              </td>
              <td className="text-center">
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    className="btn btn-icon btn-light p-1 border"
                    title="View Clearance"
                    onClick={() => handleViewExit(exit.id)}
                  >
                    <i className="bi bi-eye text-primary"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-icon btn-light p-1 border d-none d-md-inline"
                    title="Exit Interview"
                    onClick={() => handleOpenExitInterview(exit.id)}
                  >
                    <i className="bi bi-chat-left-text text-info"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-icon btn-light p-1 border d-none d-md-inline"
                    title="Knowledge Transfer"
                    onClick={() => handleOpenKnowledgeTransfer(exit.id)}
                  >
                    <i className="bi bi-share text-success"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-icon btn-light p-1 border d-none d-md-inline"
                    title="Settlement"
                    onClick={() => handleOpenSettlement(exit.id)}
                  >
                    <i className="bi bi-credit-card text-warning"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAlumniTable = () => (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: 40 }} className="text-center d-none d-md-table-cell">
              <input
                type="checkbox"
                className="form-check-input border"
                checked={selectedExits.length === currentItemsPage.length && currentItemsPage.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th className="text-start">ALUMNI</th>
            <th className="text-start d-none d-lg-table-cell">DEPT</th>
            <th className="text-start d-none d-xl-table-cell">EXIT DATE</th>
            <th className="text-center">REHIRE</th>
            <th className="text-center d-none d-lg-table-cell">BOOMERANG</th>
            <th className="text-center d-none d-xl-table-cell">ENGAGEMENT</th>
            <th className="text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {currentItemsPage.map(alumni => (
            <tr key={alumni.id}>
              <td className="text-center d-none d-md-table-cell">
                <input
                  type="checkbox"
                  className="form-check-input border"
                  checked={selectedExits.includes(alumni.id)}
                  onChange={() => handleSelectExit(alumni.id)}
                />
              </td>
              <td className="text-start">
                <div className="d-flex align-items-center">
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3 border border-success" style={{ width: '36px', height: '36px', fontSize: '12px' }}>
                    {alumni.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="d-flex flex-column">
                    <div className="fw-medium small">{alumni.name}</div>
                    <small className="text-muted d-none d-sm-block">{alumni.alumniId}</small>
                    <small className="text-muted d-block d-lg-none">{alumni.department}</small>
                  </div>
                </div>
              </td>
              <td className="text-start d-none d-lg-table-cell">
                <span className="badge bg-light text-dark border">
                  {alumni.department}
                </span>
              </td>
              <td className="text-start d-none d-xl-table-cell">
                <div className="fw-medium small">{alumni.exitDate}</div>
              </td>
              <td className="text-center">
                <span className={`badge ${alumni.rehireEligibility === 'Eligible' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'} small`}>
                  <i className={`bi ${alumni.rehireEligibility === 'Eligible' ? 'bi-check-circle text-success' : 'bi-x-circle text-danger'} me-1`}></i>
                  {alumni.rehireEligibility === 'Eligible' ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="text-center d-none d-lg-table-cell">
                <span className={`badge ${alumni.boomerangStatus === 'Interested' ? 'bg-warning-subtle text-warning border border-warning-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'} small`}>
                  <i className={`bi ${alumni.boomerangStatus === 'Interested' ? 'bi-arrow-return-right text-warning' : 'bi-x-circle text-secondary'} me-1`}></i>
                  {alumni.boomerangStatus === 'Interested' ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="text-center d-none d-xl-table-cell">
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className={`progress-bar border ${alumni.engagementLevel === 'High' ? 'bg-success' : alumni.engagementLevel === 'Medium' ? 'bg-warning' : 'bg-danger'}`}
                    style={{ width: alumni.engagementLevel === 'High' ? '80%' : alumni.engagementLevel === 'Medium' ? '50%' : '30%' }}
                  ></div>
                </div>
                <small className="text-muted d-none d-xxl-block">
                  <i className={`bi ${alumni.engagementLevel === 'High' ? 'bi-arrow-up-circle text-success' : alumni.engagementLevel === 'Medium' ? 'bi-dash-circle text-warning' : 'bi-arrow-down-circle text-danger'} me-1`}></i>
                  {alumni.engagementLevel}
                </small>
              </td>
              <td className="text-center">
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    className="btn btn-icon btn-light p-1 border"
                    title="View"
                    onClick={() => { setSelectedExit(alumni); setShowAlumniModal(true); }}
                  >
                    <i className="bi bi-eye text-primary"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-icon btn-light p-1 border d-none d-md-inline"
                    title="Message"
                    onClick={() => { setSelectedExit(alumni); setShowAlumniModal(true); }}
                  >
                    <i className="bi bi-send text-info"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSettlementsTable = () => (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: 40 }} className="text-center d-none d-md-table-cell">
              <input
                type="checkbox"
                className="form-check-input border"
                checked={selectedExits.length === currentItemsPage.length && currentItemsPage.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th className="text-start">EMPLOYEE</th>
            <th className="text-start d-none d-lg-table-cell">DEPT</th>
            <th className="text-center">AMOUNT</th>
            <th className="text-center d-none d-xl-table-cell">DATE</th>
            <th className="text-center">STATUS</th>
            <th className="text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {currentItemsPage.map(settlement => (
            <tr key={settlement.id}>
              <td className="text-center d-none d-md-table-cell">
                <input
                  type="checkbox"
                  className="form-check-input border"
                  checked={selectedExits.includes(settlement.id)}
                  onChange={() => handleSelectExit(settlement.id)}
                />
              </td>
              <td className="text-start">
                <div className="d-flex align-items-center">
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3 border border-info" style={{ width: '36px', height: '36px', fontSize: '12px' }}>
                    {settlement.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="d-flex flex-column">
                    <div className="fw-medium small">{settlement.employeeName}</div>
                    <small className="text-muted d-none d-sm-block">{settlement.employeeId}</small>
                    <small className="text-muted d-block d-lg-none">{settlement.department}</small>
                  </div>
                </div>
              </td>
              <td className="text-start d-none d-lg-table-cell">
                <span className="badge bg-light text-dark border">
                  {settlement.department}
                </span>
              </td>
              <td className="text-center">
                <div className="fw-bold text-success small">
                  <i className="bi bi-currency-rupee me-1" style={{ color: '#28a745' }}></i>
                  {settlement.netAmount}
                </div>
              </td>
              <td className="text-center d-none d-xl-table-cell">
                <div className="fw-medium small">
                  <i className="bi bi-calendar me-1 text-primary"></i>
                  {settlement.paymentDate}
                </div>
              </td>
              <td className="text-center">
                <span className={`badge ${getStatusBadge(settlement.status)} small`}>
                  <i className={`bi ${settlement.status === 'Completed' ? 'bi-check-circle text-success' : settlement.status === 'In Progress' ? 'bi-clock text-warning' : 'bi-hourglass text-secondary'} me-1`}></i>
                  {settlement.status}
                </span>
              </td>
              <td className="text-center">
                <div className="btn-group btn-group-sm" role="group">
                  <button type="button" className="btn btn-icon btn-light p-1 border" title="View" onClick={() => { setSelectedExit(settlement); handleOpenSettlement(settlement.id); }}>
                    <i className="bi bi-eye text-primary"></i>
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-icon btn-light p-1 border d-none d-md-inline" 
                    title="Download Excel"
                    onClick={() => handleDownloadSettlement(settlement.id, 'excel')}
                  >
                    <i className="bi bi-file-earmark-excel text-success"></i>
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-icon btn-light p-1 border d-none d-md-inline" 
                    title="Download PDF"
                    onClick={() => handleDownloadSettlement(settlement.id, 'pdf')}
                  >
                    <i className="bi bi-file-earmark-pdf text-danger"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEmployeeExitsTable = () => (
    <div className="card border shadow-none">
      <div className="card-body">
        {/* Employee Exits Report Filters */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold">
              Location
            </label>
            <select
              className="form-select form-select-sm border"
              name="location"
              value={employeeExitsFilters.location}
              onChange={handleEmployeeExitsFilterChange}
            >
              <option value="">All Locations</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Mumbai">Mumbai</option>
            </select>
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold">
              Department
            </label>
            <select
              className="form-select form-select-sm border"
              name="department"
              value={employeeExitsFilters.department}
              onChange={handleEmployeeExitsFilterChange}
            >
              <option value="">All Departments</option>
              <option value="Technical Support">Technical Support</option>
              <option value="HR Executive">HR Executive</option>
              <option value="Product Development Team">Product Development Team</option>
            </select>
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label small fw-bold">
              Exit Reason
            </label>
            <select
              className="form-select form-select-sm border"
              name="exitReason"
              value={employeeExitsFilters.exitReason}
              onChange={handleEmployeeExitsFilterChange}
            >
              <option value="">All Reasons</option>
              <option value="Resignation">Resignation</option>
              <option value="Termination">Termination</option>
              <option value="Retirement">Retirement</option>
            </select>
          </div>
          <div className="col-12 col-md-3">
            <div className="row g-2">
              <div className="col-6">
                <label className="form-label small fw-bold">
                  From
                </label>
                <input
                  type="date"
                  className="form-control form-control-sm border"
                  name="fromDate"
                  value={employeeExitsFilters.fromDate}
                  onChange={handleEmployeeExitsFilterChange}
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-bold">
                  To
                </label>
                <input
                  type="date"
                  className="form-control form-control-sm border"
                  name="toDate"
                  value={employeeExitsFilters.toDate}
                  onChange={handleEmployeeExitsFilterChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Exits Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 40 }} className="text-center d-none d-md-table-cell">
                  <input
                    type="checkbox"
                    className="form-check-input border"
                    checked={selectedExits.length === currentItemsPage.length && currentItemsPage.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="text-center fw-bold">SN</th>
                <th className="text-start fw-bold">EMPLOYEE</th>
                <th className="text-start fw-bold">LOCATION</th>
                <th className="text-start fw-bold">DEPARTMENT</th>
                <th className="text-start fw-bold">DESIGNATION</th>
                <th className="text-start fw-bold">JOINING</th>
                <th className="text-start fw-bold">EXIT</th>
                <th className="text-start fw-bold">REASON OF EXIT</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployeeExits.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-4">
                    <i className="bi bi-search display-6 text-muted mb-2"></i>
                    <div className="fw-bold">No employee data found. Try different filters.</div>
                  </td>
                </tr>
              ) : (
                currentItemsPage.map((emp, index) => (
                  <tr key={emp.id}>
                    <td className="text-center d-none d-md-table-cell">
                      <input
                        type="checkbox"
                        className="form-check-input border"
                        checked={selectedExits.includes(emp.id)}
                        onChange={() => handleSelectExit(emp.id)}
                      />
                    </td>
                    <td className="text-center fw-medium">{startIndex + index + 1}</td>
                    <td className="text-start">
                      <div className="d-flex flex-column">
                        <div className="fw-medium small">
                          {emp.name}
                        </div>
                        <small className="text-muted">
                          {emp.code}
                        </small>
                      </div>
                    </td>
                    <td className="text-start">
                      <span className="badge bg-light text-dark border small">
                        {emp.location}
                      </span>
                    </td>
                    <td className="text-start small fw-medium">
                      {emp.department}
                    </td>
                    <td className="text-start small fw-medium">
                      {emp.designation}
                    </td>
                    <td className="text-start small fw-medium">
                      {emp.joining}
                    </td>
                    <td className="text-start">
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle small">
                        {emp.exit}
                      </span>
                    </td>
                    <td className="text-start">
                      <span className={`badge ${emp.reason === 'Resignation' ? 'bg-warning-subtle text-warning border border-warning-subtle' :
                        emp.reason === 'Termination' ? 'bg-danger-subtle text-danger border border-danger-subtle' :
                          'bg-info-subtle text-info border border-info-subtle'
                        } small`}>
                        {emp.reason}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Export Buttons */}
        <div className="d-flex gap-2 mt-4">
          <button
            type="button"
            className="btn btn-success btn-sm border border-success"
            onClick={handleExportExcel}
            disabled={filteredEmployeeExits.length === 0}
          >
            <i className="bi bi-file-earmark-excel me-1 text-white"></i>
            <span className="fw-bold text-white">Download (Excel)</span>
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm border border-danger"
            onClick={handleExportPDF}
            disabled={filteredEmployeeExits.length === 0}
          >
            <i className="bi bi-file-earmark-pdf me-1 text-white"></i>
            <span className="fw-bold text-white">Download (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );

  const styles = {
    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    },
    modal: {
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "400px"
    },
    button: {
      padding: "8px 14px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      cursor: "pointer",
      background: "#f9fafb"
    },
    secondaryButton: {
      background: "#e5e7eb"
    }
  };

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4 py-3">
      {/* CSS to remove hover from view mode tabs */}
      <style>{hoverRemovalCSS}</style>

      {/* Notification Toast */}
      {notification.show && (
        <div className={`toast show position-fixed top-0 end-0 m-4 z-1050 ${notification.type === 'success' ? 'bg-success' : notification.type === 'warning' ? 'bg-warning' : 'bg-danger'}`} style={{ zIndex: 1050 }}>
          <div className="toast-header">
            <i className={`bi ${notification.type === 'success' ? 'bi-check-circle' : notification.type === 'warning' ? 'bi-exclamation-triangle' : 'bi-x-circle'} me-2`}></i>
            <strong className="me-auto">Notification</strong>
            <button type="button" className="btn-close" onClick={() => setNotification({ ...notification, show: false })}></button>
          </div>
          <div className="toast-body text-white">
            {notification.message}
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="mb-3 mb-md-0 flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="text-dark">
              <i className="bi bi-box-arrow-right fs-4 text-primary"></i>
            </div>
            <h5 className="fw-bold mb-0 text-dark">Exit Management & Clearance</h5>
          </div>
          <div className="ms-5 ps-2">
            <p className="text-muted mb-0 small">
              <i className="bi bi-info-circle text-info me-1"></i>
              Manage employee exits, clearance process, settlements, and alumni network
            </p>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 ms-auto">
          {/* Export Dropdown */}
          <div className="dropdown" style={{ position: 'relative' }}>
            <button
              className="btn btn-primary d-flex align-items-center gap-2 btn-sm dropdown-toggle border border-primary"
              type="button"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
            >
              <i className="bi bi-download text-white"></i>
              <span className="d-none d-sm-inline fw-bold text-white">Export</span>
            </button>
            
            {showExportDropdown && (
              <div className="dropdown-menu show border" style={{ 
                display: 'block', 
                position: 'absolute', 
                right: 0, 
                top: '100%',
                zIndex: 1000,
                minWidth: '200px'
              }}>
                <button 
                  className="dropdown-item d-flex align-items-center gap-2 py-2 border-bottom fw-medium"
                  onClick={() => {
                    handleExportExcel();
                    setShowExportDropdown(false);
                  }}
                >
                  <i className="bi bi-file-earmark-excel text-success"></i>
                  <span>Export as Excel (CSV)</span>
                </button>
                <button 
                  className="dropdown-item d-flex align-items-center gap-2 py-2 fw-medium"
                  onClick={() => {
                    handleExportPDF();
                    setShowExportDropdown(false);
                  }}
                >
                  <i className="bi bi-file-earmark-pdf text-danger"></i>
                  <span>Export as PDF</span>
                </button>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary d-flex align-items-center gap-2 btn-sm border border-primary"
            onClick={handlePrint}
            title="Print"
          >
            <i className="bi bi-printer text-white"></i>
            <span className="d-none d-sm-inline fw-bold text-white">Print</span>
          </button>

          {viewMode === 'exitCases' && (
            <button
              className="btn btn-primary d-flex align-items-center gap-2 btn-sm border border-primary"
              onClick={() => setShowNewExitModal(true)}
            >
              <i className="bi bi-plus-circle text-white"></i>
              <span className="d-none d-sm-inline fw-bold text-white">New Exit</span>
            </button>
          )}
        </div>
      </div>

      {/* View Mode Toggle - Mobile Responsive - WITH HOVER REMOVED */}
      <div className="card border shadow-none mb-4">
        <div className="card-body p-2 p-sm-3">
          <div className="d-flex flex-wrap gap-2" role="group">
            <button
              className={`btn ${viewMode === 'exitCases' ? 'btn-primary border border-primary' : 'btn-outline-primary border border-primary-subtle'} btn-sm flex-grow-1 flex-md-grow-0 view-mode-tab-btn`}
              onClick={() => setViewMode('exitCases')}
            >
              <i className={`bi bi-box-arrow-right d-none d-sm-inline me-1 ${viewMode === 'exitCases' ? 'text-white' : 'text-primary'}`}></i>
              <span className={`fw-medium ${viewMode === 'exitCases' ? 'text-white' : 'text-primary'}`}>Exit Cases</span>
            </button>
            <button
              className={`btn ${viewMode === 'alumni' ? 'btn-primary border border-primary' : 'btn-outline-primary border border-primary-subtle'} btn-sm flex-grow-1 flex-md-grow-0 view-mode-tab-btn`}
              onClick={() => setViewMode('alumni')}
            >
              <i className={`bi bi-people d-none d-sm-inline me-1 ${viewMode === 'alumni' ? 'text-white' : 'text-primary'}`}></i>
              <span className={`fw-medium ${viewMode === 'alumni' ? 'text-white' : 'text-primary'}`}>Alumni</span>
            </button>
            <button
              className={`btn ${viewMode === 'settlements' ? 'btn-primary border border-primary' : 'btn-outline-primary border border-primary-subtle'} btn-sm flex-grow-1 flex-md-grow-0 view-mode-tab-btn`}
              onClick={() => setViewMode('settlements')}
            >
              <i className={`bi bi-cash d-none d-sm-inline me-1 ${viewMode === 'settlements' ? 'text-white' : 'text-primary'}`}></i>
              <span className={`fw-medium ${viewMode === 'settlements' ? 'text-white' : 'text-primary'}`}>Settlements</span>
            </button>
            <button
              className={`btn ${viewMode === 'employeeExits' ? 'btn-primary border border-primary' : 'btn-outline-primary border border-primary-subtle'} btn-sm flex-grow-1 flex-md-grow-0 view-mode-tab-btn`}
              onClick={() => setViewMode('employeeExits')}
            >
              <i className={`bi bi-file-earmark-text d-none d-sm-inline me-1 ${viewMode === 'employeeExits' ? 'text-white' : 'text-primary'}`}></i>
              <span className={`fw-medium ${viewMode === 'employeeExits' ? 'text-white' : 'text-primary'}`}>Employee Exits</span>
            </button>
            <button
              className="btn btn-outline-primary btn-sm border border-primary-subtle d-none d-md-inline-flex flex-grow-1 flex-lg-grow-0 view-mode-tab-btn"
              onClick={() => setShowTrendsModal(true)}
            >
              <i className="bi bi-graph-up me-1 text-primary"></i>
              <span className="fw-medium text-primary">Trends</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary - Responsive Grid */}
      <div className="row g-2 g-sm-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border h-100">
            <div className="card-body p-2 p-sm-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold  small text-black">Total Cases</div>
                  <div className="h5 mb-0 fw-bold text-primary">{insights.totalExitCases}</div>
                </div>
                <div className="bg-primary rounded-circle p-1 p-sm-2 border border-primary">
                  <i className="bi bi-box-arrow-right text-white fs-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border h-100">
            <div className="card-body p-2 p-sm-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Pending</div>
                  <div className="h5 mb-0 fw-bold text-warning">{insights.pendingClearances}</div>
                </div>
                <div className="bg-warning rounded-circle p-1 p-sm-2 border border-warning">
                  <i className="bi bi-clock text-white fs-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border h-100">
            <div className="card-body p-2 p-sm-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Escalated</div>
                  <div className="h5 mb-0 fw-bold text-danger">{insights.escalatedCases}</div>
                </div>
                <div className="bg-danger rounded-circle p-1 p-sm-2 border border-danger">
                  <i className="bi bi-exclamation-triangle text-white fs-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card border h-100">
            <div className="card-body p-2 p-sm-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Alumni</div>
                  <div className="h5 mb-0 fw-bold text-success">{insights.alumniCount}</div>
                </div>
                <div className="bg-success rounded-circle p-1 p-sm-2 border border-success">
                  <i className="bi bi-people text-white fs-6"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters - Responsive - Hidden for Employee Exits */}
      {viewMode !== 'employeeExits' && (
        <div className="card border shadow-none mb-4">
          <div className="card-body p-2 p-sm-3">
            <div className="row g-2 g-sm-3 align-items-center">
              <div className="col-12 col-md-6">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border">
                    <i className="bi bi-search text-primary"></i>
                  </span>
                  <input
                    className="form-control border"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-6 col-md-3 d-none d-md-block">
                <select
                  className="form-select form-select-sm border"
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                >
                  <option value="">
                    <i className="bi bi-building me-1"></i>
                    All Departments
                  </option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">HR</option>
                  <option value="finance">Finance</option>
                </select>
              </div>

              <div className="col-6 col-md-3 d-none d-md-block">
                <select
                  className="form-select form-select-sm border"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">
                    <i className="bi bi-funnel me-1"></i>
                    All Status
                  </option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="col-12 d-md-none">
                <button
                  className="btn btn-outline-secondary w-100 btn-sm border border-secondary"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="bi bi-funnel me-1 text-secondary"></i>
                  <span className="fw-medium">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                </button>
              </div>
            </div>

            {/* Mobile Filters Dropdown */}
            {showFilters && (
              <div className="row g-2 mt-3">
                <div className="col-6">
                  <select
                    className="form-select form-select-sm border"
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  >
                    <option value="">All Departments</option>
                    <option value="engineering">Engineering</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="hr">HR</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>

                <div className="col-6">
                  <select
                    className="form-select form-select-sm border"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {viewMode === 'exitCases' && (
                  <>
                    <div className="col-6">
                      <select
                        className="form-select form-select-sm border"
                        value={filters.clearanceType}
                        onChange={(e) => setFilters(prev => ({ ...prev, clearanceType: e.target.value }))}
                      >
                        <option value="">Exit Type</option>
                        <option value="resignation">Resignation</option>
                        <option value="termination">Termination</option>
                        <option value="retirement">Retirement</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <select
                        className="form-select form-select-sm border"
                        value={filters.exitReason}
                        onChange={(e) => setFilters(prev => ({ ...prev, exitReason: e.target.value }))}
                      >
                        <option value="">Exit Reason</option>
                        <option value="better opportunity">Better Opportunity</option>
                        <option value="career growth">Career Growth</option>
                        <option value="higher studies">Higher Studies</option>
                        <option value="relocation">Relocation</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions Bar - Responsive */}
      {selectedExits.length > 0 && viewMode !== 'employeeExits' && (
        <div className="alert alert-info d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4 p-2 p-sm-3 border border-info-subtle">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2 mb-sm-0">
            <span className="fw-bold small">
              <i className="bi bi-check2-circle text-info me-1"></i>
              {selectedExits.length} selected
            </span>
            <div className="vr d-none d-sm-block"></div>
            <div className="d-flex flex-wrap gap-1">
              <button 
                className="btn btn-danger btn-sm py-1 border border-danger"
                onClick={handleDeleteSelected}
              >
                <i className="bi bi-trash text-white"></i>
                <span className="d-none d-sm-inline ms-1 fw-bold text-white">Delete</span>
              </button>
              <button 
                className="btn btn-warning btn-sm py-1 border border-warning"
                onClick={handleDuplicateSelected}
              >
                <i className="bi bi-files text-white"></i>
                <span className="d-none d-sm-inline ms-1 fw-bold text-white">Duplicate</span>
              </button>
              {viewMode === 'exitCases' && (
                <button 
                  className="btn btn-success btn-sm py-1 border border-success"
                  onClick={handleGenerateCertificates}
                >
                  <i className="bi bi-file-earmark-check text-white"></i>
                  <span className="d-none d-sm-inline ms-1 fw-bold text-white">Certificates</span>
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => setSelectedExits([])}
            className="btn btn-link p-0 text-decoration-none small fw-medium align-self-end align-self-sm-center border-0"
          >
            <i className="bi bi-x-circle text-info me-1"></i>
            Clear
          </button>
        </div>
      )}

      {/* Bulk Actions for Employee Exits */}
      {selectedExits.length > 0 && viewMode === 'employeeExits' && (
        <div className="alert alert-info d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4 p-2 p-sm-3 border border-info-subtle">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2 mb-sm-0">
            <span className="fw-bold small">
              <i className="bi bi-check2-circle text-info me-1"></i>
              {selectedExits.length} selected
            </span>
            <div className="vr d-none d-sm-block"></div>
            <div className="d-flex flex-wrap gap-1">
              <button 
                className="btn btn-danger btn-sm py-1 border border-danger"
                onClick={handleDeleteSelected}
              >
                <i className="bi bi-trash text-white"></i>
                <span className="d-none d-sm-inline ms-1 fw-bold text-white">Delete</span>
              </button>
              <button 
                className="btn btn-warning btn-sm py-1 border border-warning"
                onClick={handleDuplicateSelected}
              >
                <i className="bi bi-files text-white"></i>
                <span className="d-none d-sm-inline ms-1 fw-bold text-white">Duplicate</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => setSelectedExits([])}
            className="btn btn-link p-0 text-decoration-none small fw-medium align-self-end align-self-sm-center border-0"
          >
            <i className="bi bi-x-circle text-info me-1"></i>
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mb-4">
        {viewMode === 'exitCases' && (
          <div className="card border shadow-none">
            <div className="card-body p-0">
              {renderExitCasesTable()}
            </div>
          </div>
        )}
        {viewMode === 'alumni' && (
          <div className="card border shadow-none">
            <div className="card-body p-0">
              {renderAlumniTable()}
            </div>
          </div>
        )}
        {viewMode === 'settlements' && (
          <div className="card border shadow-none">
            <div className="card-body p-0">
              {renderSettlementsTable()}
            </div>
          </div>
        )}
        {viewMode === 'employeeExits' && renderEmployeeExitsTable()}
      </div>
      
      {/* Pagination */}
      {viewMode !== 'employeeExits' && totalPages > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body py-3">
            <div className="row align-items-center g-3">
              {/* Showing info */}
              <div className="col-12 col-md-4 text-center text-md-start">
                <small className="text-muted fw-medium">
                  <i className="bi bi-eye text-primary me-1"></i>
                  Showing <strong>{startIndex + 1}</strong> to{" "}
                  <strong>{endIndex}</strong> of{" "}
                  <strong>{currentItems.length}</strong>
                </small>
              </div>

              {/* Pagination controls */}
              <div className="col-12 col-md-4 d-flex justify-content-center">
                <div className="btn-group btn-group-sm">
                  {/* Left arrow */}
                  <button
                    className="btn btn-outline-secondary border"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left text-secondary"></i>
                  </button>

                  {/* Page numbers */}
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;
                    
                    let startPage = 1;
                    let endPage = totalPages;
                    
                    // If total pages more than max visible, show limited pages
                    if (totalPages > maxVisiblePages) {
                      if (currentPage <= Math.floor(maxVisiblePages / 2)) {
                        startPage = 1;
                        endPage = maxVisiblePages;
                      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
                        startPage = totalPages - maxVisiblePages + 1;
                        endPage = totalPages;
                      } else {
                        startPage = currentPage - Math.floor(maxVisiblePages / 2);
                        endPage = currentPage + Math.floor(maxVisiblePages / 2);
                      }
                    }
                    
                    // Always show page 1
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          className={`btn border fw-medium ${1 === currentPage ? "btn-primary border-primary" : "btn-outline-secondary border"}`}
                          onClick={() => setCurrentPage(1)}
                        >
                          1
                        </button>
                      );
                      
                      if (startPage > 2) {
                        pages.push(
                          <button key="dots1" className="btn btn-outline-secondary border" disabled>
                            <i className="bi bi-three-dots text-secondary"></i>
                          </button>
                        );
                      }
                    }
                    
                    // Show page range
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          className={`btn border fw-medium ${i === currentPage ? "btn-primary border-primary" : "btn-outline-secondary border"}`}
                          onClick={() => setCurrentPage(i)}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    // Always show last page if not already shown
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <button key="dots2" className="btn btn-outline-secondary border" disabled>
                            <i className="bi bi-three-dots text-secondary"></i>
                          </button>
                        );
                      }
                      
                      pages.push(
                        <button
                          key={totalPages}
                          className={`btn border fw-medium ${totalPages === currentPage ? "btn-primary border-primary" : "btn-outline-secondary border"}`}
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      );
                    }
                    
                    return pages;
                  })()}

                  {/* Right arrow */}
                  <button
                    className="btn btn-outline-secondary border"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <i className="bi bi-chevron-right text-secondary"></i>
                  </button>
                </div>
              </div>

              {/* Page size */}
              <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-end">
                <div className="d-flex align-items-center gap-2">
                  <small className="text-muted fw-medium">
                    <i className="bi bi-list-ol text-info me-1"></i>
                    Rows per page
                  </small>
                  <select
                    className="form-select form-select-sm w-auto border"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Exits Report Info */}
      {viewMode === 'employeeExits' && (
        <div className="alert alert-info mb-0 border border-info-subtle">
          <div className="d-flex">
            <div className="me-3">
              <i className="bi bi-info-circle fs-4 text-info"></i>
            </div>
            <div>
              <h6 className="alert-heading fw-bold">Employee Exits Report</h6>
              <p className="mb-0 small fw-medium">
                <i className="bi bi-dot text-info me-1"></i>
                View employees exiting during a given date range. Filter by location, department, exit reason, and date range.
                <br />
                <i className="bi bi-dot text-info me-1"></i>
                Export data to Excel (CSV) or PDF format.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* New Exit Modal */}
      {showNewExitModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1051 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border">
              {/* Header with Bold Title */}
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  Create New Exit Case
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="container-fluid">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">
                        Employee Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm border"
                        name="employeeName"
                        value={newExitForm.employeeName}
                        onChange={handleNewExitFormChange}
                        placeholder="Enter employee name"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">
                        Employee ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm border"
                        name="employeeId"
                        value={newExitForm.employeeId}
                        onChange={handleNewExitFormChange}
                        placeholder="Enter employee ID"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">
                        Department <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select form-select-sm border"
                        name="department"
                        value={newExitForm.department}
                        onChange={handleNewExitFormChange}
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                        <option value="Technical Support">Technical Support</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">
                        Role <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm border"
                        name="role"
                        value={newExitForm.role}
                        onChange={handleNewExitFormChange}
                        placeholder="Enter role/designation"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">
                        Resignation Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm border"
                        name="resignationDate"
                        value={newExitForm.resignationDate}
                        onChange={handleNewExitFormChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">
                        Last Working Day <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm border"
                        name="lastWorkingDay"
                        value={newExitForm.lastWorkingDay}
                        onChange={handleNewExitFormChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">
                        Exit Type
                      </label>
                      <select
                        className="form-select form-select-sm border"
                        name="exitType"
                        value={newExitForm.exitType}
                        onChange={handleNewExitFormChange}
                      >
                        <option value="Resignation">Resignation</option>
                        <option value="Termination">Termination</option>
                        <option value="Retirement">Retirement</option>
                        <option value="Contract End">Contract End</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">
                        Exit Reason
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm border"
                        name="exitReason"
                        value={newExitForm.exitReason}
                        onChange={handleNewExitFormChange}
                        placeholder="Enter exit reason"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">
                        Notice Period (Auto-calculated)
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm border bg-light"
                        value={newExitForm.noticePeriod}
                        readOnly
                      />
                      <small className="text-muted fw-medium">
                        Calculated based on resignation date and last working day
                      </small>
                    </div>
                    <div className="col-12">
                      <div className="alert alert-info border border-info-subtle p-2">
                        <i className="bi bi-info-circle me-2 text-info"></i>
                        <small className="fw-medium">
                          A new exit case will be created with default clearance settings. All departments will be marked as pending initially.
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button type="button" className="btn btn-secondary border border-secondary fw-medium" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary border border-primary fw-medium" onClick={handleNewExitSubmit}>
                  <i className="bi bi-check-circle me-1"></i>
                  Create Exit Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clearance Modal */}
      {showClearanceModal && selectedExit && (
        <ModalWrapper
          title={`Exit Clearance – ${selectedExit.employeeName}`}
          onClose={handleCloseModal}
        >
          <div className="container-fluid">
            {/* Employee Info */}
            <div className="row g-4 mb-4">
              <div className="col-12">
                <div className="card border shadow-sm">
                  <div className="card-body">
                    <h6 className="mb-3 fw-bold">
                      Employee Information
                    </h6>
                    <div className="row small">
                      <div className="col-6 mb-2">
                        <span className="text-muted fw-medium">
                          Employee ID
                        </span>
                        <div className="fw-bold">{selectedExit.employeeId}</div>
                      </div>
                      <div className="col-6 mb-2">
                        <span className="text-muted fw-medium">
                          Department
                        </span>
                        <div className="fw-bold">{selectedExit.department}</div>
                      </div>
                      <div className="col-6 mb-2">
                        <span className="text-muted fw-medium">
                          Role
                        </span>
                        <div className="fw-bold">{selectedExit.role}</div>
                      </div>
                      <div className="col-6 mb-2">
                        <span className="text-muted fw-medium">
                          Last Working Day
                        </span>
                        <div className="fw-bold">{selectedExit.lastWorkingDay}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="col-12">
                <div className="card border shadow-sm">
                  <div className="card-body">
                    <h6 className="mb-3 fw-bold">
                      Clearance Progress
                    </h6>
                    <div className="progress mb-2" style={{ height: 10 }}>
                      <div
                        className={`progress-bar ${getProgressColor(selectedExit.clearanceProgress)} border`}
                        style={{ width: `${selectedExit.clearanceProgress}%` }}
                      />
                    </div>
                    <div className="d-flex justify-content-between small fw-medium">
                      <span>
                        <i className="bi bi-check-circle text-success me-1"></i>
                        {selectedExit.clearanceProgress}% Completed
                      </span>
                      <span>
                        <i className="bi bi-clock text-warning me-1"></i>
                        {selectedExit.pendingClearances.length} Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3 border-bottom">
              {["IT", "Admin", "Finance", "HR", "Department"].map(tab => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link border fw-medium ${activeModalTab === tab ? "active border-bottom-0 fw-bold" : ""}`}
                    onClick={() => setActiveModalTab(tab)}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>

            {/* Tab Content */}
            <div className="card border">
              <div className="card-body">
                <h6 className="fw-bold">
                  {activeModalTab} Clearance
                </h6>
                <p className="text-muted small mb-0 fw-medium">
                  Status: <strong>{clearanceDetails[activeModalTab]?.status}</strong>
                </p>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* Exit Interview Modal */}
      {showExitInterviewModal && selectedExit && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1051 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border">
              {/* Header with Bold Title */}
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  Exit Interview - {selectedExit.employeeName}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-bold">
                      Interview Date & Time
                    </label>
                    <input type="datetime-local" className="form-control form-control-sm border" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-bold">
                      Interviewer
                    </label>
                    <input type="text" className="form-control form-control-sm border" placeholder="Interviewer Name" />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Exit Reason Category
                    </label>
                    <select className="form-select form-select-sm border">
                      <option>Better Opportunity</option>
                      <option>Career Growth</option>
                      <option>Higher Studies</option>
                      <option>Relocation</option>
                      <option>Personal Reasons</option>
                      <option>Health Issues</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Feedback on Manager
                    </label>
                    <textarea className="form-control border" rows="3" placeholder="Provide feedback on your manager..."></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Feedback on Team
                    </label>
                    <textarea className="form-control border" rows="3" placeholder="Provide feedback on your team..."></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Feedback on Company
                    </label>
                    <textarea className="form-control border" rows="3" placeholder="Provide feedback on the company..."></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Feedback on Role
                    </label>
                    <textarea className="form-control border" rows="3" placeholder="Provide feedback on your role..."></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Suggestions for Improvement
                    </label>
                    <textarea className="form-control border" rows="3" placeholder="Any suggestions to improve the organization..."></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Rehire Eligibility Assessment
                    </label>
                    <div className="row g-2">
                      <div className="col-12 col-md-6">
                        <select className="form-select form-select-sm border">
                          <option>Eligible</option>
                          <option>Not Eligible</option>
                          <option>Conditional</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-6">
                        <textarea className="form-control form-control-sm border" rows="2" placeholder="Assessment Notes"></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Confidential Notes (Management Only)
                    </label>
                    <textarea className="form-control border" rows="3" placeholder="Confidential feedback for management..."></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button type="button" className="btn btn-secondary border border-secondary fw-medium" onClick={handleCloseModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary border border-primary fw-medium">
                  Save Draft
                </button>
                <button type="button" className="btn btn-success border border-success fw-medium">
                  Complete Interview
                </button>
                <button type="button" className="btn btn-info border border-info fw-medium">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Transfer Modal */}
      {showKnowledgeTransferModal && selectedExit && (
        <div
          className="modal fade show"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1055
          }}
        >
          <div className="modal-dialog modal-xl" style={{ margin: 0, width: "100%", maxWidth: "1000px" }}>
            <div className="modal-content border">
              {/* Header with Bold Title */}
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  Knowledge Transfer – {selectedExit.employeeName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                />
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <h6 className="fw-bold mb-3">
                      KT Checklist
                    </h6>
                    <div className="card border">
                      <div className="card-body">
                        <div className="form-check mb-2">
                          <input className="form-check-input border" type="checkbox" id="kt1" />
                          <label className="form-check-label fw-medium" htmlFor="kt1">
                            Ongoing work documentation completed
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input className="form-check-input border" type="checkbox" id="kt2" />
                          <label className="form-check-label fw-medium" htmlFor="kt2">
                            Critical contacts and stakeholders list shared
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input className="form-check-input border" type="checkbox" id="kt3" />
                          <label className="form-check-label fw-medium" htmlFor="kt3">
                            System access and password documentation provided
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input className="form-check-input border" type="checkbox" id="kt4" />
                          <label className="form-check-label fw-medium" htmlFor="kt4">
                            Project status summary updated
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input className="form-check-input border" type="checkbox" id="kt5" />
                          <label className="form-check-label fw-medium" htmlFor="kt5">
                            KT session scheduled and conducted
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input className="form-check-input border" type="checkbox" id="kt6" />
                          <label className="form-check-label fw-medium" htmlFor="kt6">
                            Documentation uploaded to repository
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Ongoing Work Documentation
                    </label>
                    <textarea className="form-control border" rows="4" placeholder="Document all ongoing work, projects, and responsibilities..."></textarea>
                    <button className="btn btn-sm btn-outline-primary mt-2 border border-primary fw-medium">
                      Upload Document
                    </button>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Critical Contacts & Stakeholders
                    </label>
                    <textarea className="form-control border" rows="4" placeholder="List all critical contacts and stakeholders with their roles..."></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      System Access & Passwords
                    </label>
                    <textarea className="form-control border" rows="4" placeholder="Document all system accesses, credentials (use secure format)..."></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Project Status Summary
                    </label>
                    <textarea className="form-control border" rows="4" placeholder="Summary of all projects, their status, and next steps..."></textarea>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-bold">
                      KT Session Date & Time
                    </label>
                    <input type="datetime-local" className="form-control form-control-sm border" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-bold">
                      KT Session Attendees
                    </label>
                    <input type="text" className="form-control form-control-sm border" placeholder="Attendee names (comma separated)" />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      KT Completion Sign-off
                    </label>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input type="text" className="form-control form-control-sm border" placeholder="Signed by" />
                      </div>
                      <div className="col-md-6">
                        <input type="date" className="form-control form-control-sm border" />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">
                      Documentation Repository
                    </label>
                    <div className="input-group">
                      <input type="text" className="form-control border" placeholder="Repository URL or path" />
                      <button className="btn btn-outline-primary border border-primary fw-medium">
                        Upload Files
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button className="btn btn-secondary border border-secondary fw-medium" onClick={handleCloseModal}>
                  Close
                </button>
                <button className="btn btn-primary border border-primary fw-medium">
                  Save Progress
                </button>
                <button className="btn btn-success border border-success fw-medium">
                  Complete KT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alumni Network Modal */}
      {showAlumniModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1051 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border">
              {/* Header with Bold Title */}
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  Alumni Network Management
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="row g-3">
                  <div className="col-12">
                    <h6 className="fw-bold mb-3">
                      Alumni Engagement
                    </h6>
                    <div className="card border mb-3">
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-bold">
                              Rehire Eligibility
                            </label>
                            <select className="form-select form-select-sm border">
                              <option>Eligible</option>
                              <option>Not Eligible</option>
                              <option>Conditional</option>
                            </select>
                          </div>
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-bold">
                              Boomerang Status
                            </label>
                            <select className="form-select form-select-sm border">
                              <option>Interested</option>
                              <option>Not Interested</option>
                              <option>Open to Discussion</option>
                            </select>
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              Engagement Level
                            </label>
                            <select className="form-select form-select-sm border">
                              <option>High</option>
                              <option>Medium</option>
                              <option>Low</option>
                            </select>
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              Alumni Referral Program
                            </label>
                            <div className="input-group input-group-sm">
                              <input type="number" className="form-control border" placeholder="Total Referrals" />
                              <input type="number" className="form-control border" placeholder="Successful Hires" />
                            </div>
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              Communication Notes
                            </label>
                            <textarea className="form-control border" rows="3" placeholder="Notes from alumni communication..."></textarea>
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-bold">
                              Alumni Events Participation
                            </label>
                            <input type="text" className="form-control form-control-sm border" placeholder="Events attended (comma separated)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button type="button" className="btn btn-secondary border border-secondary fw-medium" onClick={handleCloseModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary border border-primary fw-medium">
                  Save Changes
                </button>
                <button type="button" className="btn btn-info border border-info fw-medium">
                  Send Communication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Settlement Modal */}
      {showSettlementModal && selectedExit && (
        <ModalWrapper
          title={`Final Settlement – ${selectedExit.employeeName}`}
          onClose={handleCloseModal}
          size="modal-lg"
        >
          <div className="container-fluid">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">
                  Basic Salary
                </label>
                <input
                  className="form-control form-control-sm border"
                  value={settlementDetail.basicSalary}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">
                  Leave Encashment
                </label>
                <input
                  className="form-control form-control-sm border"
                  value={settlementDetail.leaveEncashment}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">
                  Bonus / Incentives
                </label>
                <input
                  className="form-control form-control-sm border"
                  value={settlementDetail.bonusIncentives}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">
                  Tax Deduction
                </label>
                <input
                  className="form-control form-control-sm border"
                  value={settlementDetail.taxDeductions}
                  readOnly
                />
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>
                Net Payable
              </span>
              <span className="text-success">
                <i className="bi bi-currency-rupee me-1"></i>
                {settlementDetail.netPayable.toFixed(2)}
              </span>
            </div>
          </div>
        </ModalWrapper>
      )}
      
      {/* Trends Modal */}
      {showTrendsModal && (
        <ModalWrapper
          title="Exit Trend Analysis"
          onClose={handleCloseModal}
          size="modal-xl"
        >
          <div className="container-fluid h-100">
            {/* Filters */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold">
                  Analysis Period
                </label>
                <select className="form-select form-select-sm border">
                  <option>Last 3 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-bold">
                  Filter By Department
                </label>
                <select className="form-select form-select-sm border">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>HR</option>
                  <option>Finance</option>
                </select>
              </div>
            </div>

            {/* CENTERED TREND CARDS */}
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "40vh" }}>
              <div className="w-100" style={{ maxWidth: "700px" }}>
                <div className="row g-4">
                  <div className="col-12">
                    <div className="card border shadow-sm">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1">
                            Exit Rate
                          </h6>
                          <p className="text-muted small mb-0 fw-medium">Overall attrition trend</p>
                        </div>
                        <div className="display-6 fw-bold text-danger">12.5%</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="card border shadow-sm">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1">
                            Avg Tenure
                          </h6>
                          <p className="text-muted small mb-0 fw-medium">Employee stay duration</p>
                        </div>
                        <div className="display-6 fw-bold text-primary">2.8 yrs</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="card border shadow-sm">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1">
                            Top Exit Reason
                          </h6>
                          <p className="text-muted small mb-0 fw-medium">Most common reason</p>
                        </div>
                        <div className="fw-bold fs-5">Better Opportunity</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* Clearance Certificate Modal */}
      {showCertificateModal && selectedExit && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1051 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border">
              {/* Header with Bold Title */}
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  Generate Clearance Certificate
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="card border mb-3">
                  <div className="card-body text-center py-5">
                    <i className="bi bi-file-check text-success" style={{ fontSize: '64px' }}></i>
                    <h4 className="mt-3 fw-bold">Clearance Certificate</h4>
                    <p className="text-muted mb-4 fw-medium">This certifies that all clearance formalities have been completed</p>
                    <div className="text-start">
                      <div className="mb-2 fw-medium">
                        <strong>Employee:</strong> {selectedExit.employeeName}
                      </div>
                      <div className="mb-2 fw-medium">
                        <strong>Employee ID:</strong> {selectedExit.employeeId}
                      </div>
                      <div className="mb-2 fw-medium">
                        <strong>Department:</strong> {selectedExit.department}
                      </div>
                      <div className="mb-2 fw-medium">
                        <strong>Last Working Day:</strong> {selectedExit.lastWorkingDay}
                      </div>
                      <div className="mb-2 fw-medium">
                        <strong>Certificate Date:</strong> {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="alert alert-info border border-info-subtle">
                  <i className="bi bi-info-circle me-2"></i>
                  <small className="fw-medium">All departments have been cleared. The certificate is ready for generation.</small>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button type="button" className="btn btn-secondary border border-secondary fw-medium" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary border border-primary fw-medium">
                  Print
                </button>
                <button type="button" className="btn btn-success border border-success fw-medium">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitManagement;