import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import SettlementDetailsModal from '../modal/SettlementDetailsModal';
import PaymentModal from '../modal/PaymentModal';
import LastWorkingDayModal from '../modal/LastWorkingDayModal';
import GenerateFormModal from '../modal/GenerateFormModal';
import AssetManagementModal from '../modal/AssetManagementModal';

const FinalSettlement = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [selectedForm, setSelectedForm] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const itemsPerPage = 6;

  const [settlementData, setSettlementData] = useState({
    employee: {
      id: '',
      name: '',
      employeeId: '',
      department: '',
      designation: '',
      doj: '',
      dol: '',
      uan: '',
      pfNumber: ''
    },
    noticePeriod: {
      verified: false,
      daysServed: 0,
      requiredDays: 0,
      shortfallDays: 0,
      recoveryAmount: 0,
      verificationDate: ''
    },
    salary: {
      basic: 0,
      hra: 0,
      specialAllowance: 0,
      daysWorked: 0,
      totalSalary: 0,
      lastWorkingDay: '',
      paymentDueDate: ''
    },
    leave: {
      earnedLeaveBalance: 0,
      casualLeaveBalance: 0,
      sickLeaveBalance: 0,
      encashmentRate: 0,
      totalEncashment: 0,
      encashmentPolicy: 'Earned leave only'
    },
    bonus: {
      annualBonus: 0,
      proRataDays: 0,
      proRataBonus: 0,
      eligibility: false,
      calculationMethod: 'Pro-rata based on days worked'
    },
    gratuity: {
      completedYears: 0,
      lastDrawnSalary: 0,
      gratuityAmount: 0,
      eligibility: false,
      eligibilityYears: 5
    },
    reimbursements: {
      pendingClaims: 0,
      approvedClaims: 0,
      submittedClaims: 0,
      approvedCount: 0
    },
    deductions: {
      loanOutstanding: 0,
      advanceAmount: 0,
      penaltyAmount: 0,
      noticePeriodRecovery: 0,
      otherDeductions: 0,
      idCardDeduction: 0,
      uniformDeduction: 0,
      assetPenalty: 0,
      totalDeductions: 0
    },
    assets: {
      allocatedAssets: [],
      totalAssets: 0,
      returnedAssets: 0,
      pendingAssets: 0,
      totalPenalty: 0
    },
    lastWorkingDay: {
      confirmed: false,
      confirmedDate: null,
      confirmedBy: null,
      actualLastWorkingDay: '',
      noticeServedFrom: '',
      noticeServedTo: '',
      confirmationDate: null
    },
    netSettlement: 0,
    approval: {
      status: 'draft',
      approvedBy: '',
      approvedDate: '',
      initiatedBy: '',
      initiatedDate: '',
      workflow: ['HR', 'Finance', 'Management']
    },
    documents: {
      form16Issued: false,
      pfFormsIssued: false,
      experienceLetter: false,
      relievingLetter: false,
      form19Generated: false,
      form10CGenerated: false
    },
    payment: {
      method: 'Bank Transfer',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      paymentDate: '',
      status: 'pending',
      referenceNumber: '',
      processedBy: null,
      processedDate: null,
      paymentProof: null,
      paymentMode: 'NEFT',
      utrNumber: null
    },
    forms: {
      form16: { generated: false, generatedDate: null, financialYear: '', issued: false, issuedDate: null, downloadUrl: null },
      form19: { generated: false, generatedDate: null, pfAccountNumber: '', downloadUrl: null },
      form10C: { generated: false, generatedDate: null, pfAccountNumber: '', downloadUrl: null },
      experienceLetter: { generated: false, generatedDate: null, issued: false, issuedDate: null, downloadUrl: null },
      relievingLetter: { generated: false, generatedDate: null, issued: false, issuedDate: null, downloadUrl: null }
    }
  });

  const [employees, setEmployees] = useState([]);
  const [pendingSettlements, setPendingSettlements] = useState([]);
  const [completedSettlements, setCompletedSettlements] = useState([]);
  const [settlementForms, setSettlementForms] = useState([]);
  const [reports, setReports] = useState([]);

  const openModal = (type, data = null) => {
    setModalState({ type, isOpen: true, data });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false, data: null });
  };

  const showNotification = (message, type = 'success') => {
    const options = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      default:
        toast(message, options);
    }
  };

  const calculateSettlement = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const dailyRate = (settlementData.salary.basic + settlementData.salary.hra + settlementData.salary.specialAllowance) / 30;
      const salaryForDays = dailyRate * settlementData.salary.daysWorked;
      const leaveEncashment = settlementData.leave.earnedLeaveBalance * settlementData.leave.encashmentRate;
      const proRataBonus = (settlementData.bonus.annualBonus / 365) * settlementData.bonus.proRataDays;
      const gratuityAmount = settlementData.gratuity.completedYears >= 5
        ? (settlementData.gratuity.lastDrawnSalary / 26) * 15 * Math.floor(settlementData.gratuity.completedYears)
        : 0;
      
      const noticeRecovery = Math.max(0, settlementData.noticePeriod.requiredDays - settlementData.noticePeriod.daysServed) * dailyRate;
      
      const assetPenalty = settlementData.assets.allocatedAssets
        .filter(asset => asset.returnStatus === 'pending' || asset.condition === 'Damaged' || asset.condition === 'Lost')
        .reduce((sum, asset) => {
          if (asset.condition === 'Lost') return sum + (asset.category === 'Laptop' ? 50000 : asset.category === 'Mobile' ? 20000 : 5000);
          if (asset.condition === 'Damaged') return sum + (asset.category === 'Laptop' ? 10000 : asset.category === 'Mobile' ? 5000 : 2000);
          if (asset.returnStatus === 'pending') return sum + (asset.category === 'Laptop' ? 5000 : asset.category === 'Mobile' ? 2000 : 1000);
          return sum;
        }, 0);
      
      const totalAdditions = salaryForDays + leaveEncashment + proRataBonus + gratuityAmount + settlementData.reimbursements.approvedClaims;
      const totalDeductions = settlementData.deductions.loanOutstanding +
        settlementData.deductions.advanceAmount +
        settlementData.deductions.penaltyAmount +
        noticeRecovery +
        assetPenalty +
        settlementData.deductions.otherDeductions;
      const netSettlement = totalAdditions - totalDeductions;

      setSettlementData(prev => ({
        ...prev,
        noticePeriod: { ...prev.noticePeriod, shortfallDays: Math.max(0, prev.noticePeriod.requiredDays - prev.noticePeriod.daysServed), recoveryAmount: noticeRecovery },
        salary: { ...prev.salary, totalSalary: salaryForDays },
        leave: { ...prev.leave, totalEncashment: leaveEncashment },
        bonus: { ...prev.bonus, proRataBonus },
        gratuity: { ...prev.gratuity, gratuityAmount, eligibility: prev.gratuity.completedYears >= 5 },
        deductions: { ...prev.deductions, noticePeriodRecovery: noticeRecovery, assetPenalty, totalDeductions },
        assets: { ...prev.assets, totalPenalty: assetPenalty },
        netSettlement: netSettlement > 0 ? netSettlement : 0
      }));

      setIsCalculating(false);
      showNotification('Settlement calculated successfully!', 'success');
    }, 1000);
  };

  const handleConfirmLastWorkingDay = (data) => {
    setSettlementData(prev => ({
      ...prev,
      lastWorkingDay: {
        ...prev.lastWorkingDay,
        confirmed: true,
        confirmedDate: new Date().toISOString().split('T')[0],
        confirmedBy: 'HR Manager',
        confirmationDate: new Date().toISOString().split('T')[0],
        actualLastWorkingDay: data.actualLastWorkingDay,
        noticeServedFrom: data.noticeServedFrom || '',
        noticeServedTo: data.noticeServedTo || ''
      }
    }));
    closeModal();
    showNotification('Last working day confirmed successfully!', 'success');
  };

  const handleAssetReturn = (assetId, returnDate, condition, penalty) => {
    setSettlementData(prev => ({
      ...prev,
      assets: {
        ...prev.assets,
        allocatedAssets: prev.assets.allocatedAssets.map(asset => 
          asset.id === assetId 
            ? { ...asset, returnStatus: 'returned', returnDate, condition, penalty }
            : asset
        ),
        returnedAssets: prev.assets.allocatedAssets.filter(a => a.id === assetId || a.returnStatus === 'returned').length,
        pendingAssets: prev.assets.allocatedAssets.filter(a => a.id !== assetId ? a.returnStatus === 'pending' : false).length
      }
    }));
    calculateSettlement();
    showNotification('Asset return recorded successfully!', 'success');
  };

  const handleProcessPayment = (data) => {
    setSettlementData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        ...data,
        status: 'processed',
        processedBy: 'Finance Manager',
        processedDate: new Date().toISOString().split('T')[0],
        utrNumber: data.utrNumber || `UTR${Math.floor(Math.random() * 10000000000)}`
      },
      approval: {
        ...prev.approval,
        status: 'approved',
        approvedBy: 'Finance Manager',
        approvedDate: new Date().toISOString().split('T')[0]
      }
    }));
    closeModal();
    showNotification('Payment processed successfully!', 'success');
  };

  const handleGenerateForm = (data) => {
    const today = new Date().toISOString().split('T')[0];
    
    setSettlementData(prev => {
      const forms = { ...prev.forms };
      
      if (selectedForm === 'Form16' || selectedForm === 'All') {
        forms.form16 = { ...forms.form16, generated: true, generatedDate: today, downloadUrl: '#', issued: true, issuedDate: today };
      }
      if (selectedForm === 'PF' || selectedForm === 'All') {
        forms.form19 = { ...forms.form19, generated: true, generatedDate: today, downloadUrl: '#' };
        forms.form10C = { ...forms.form10C, generated: true, generatedDate: today, downloadUrl: '#' };
      }
      if (selectedForm === 'Experience' || selectedForm === 'All') {
        forms.experienceLetter = { ...forms.experienceLetter, generated: true, generatedDate: today, downloadUrl: '#', issued: true, issuedDate: today };
      }
      if (selectedForm === 'Relieving' || selectedForm === 'All') {
        forms.relievingLetter = { ...forms.relievingLetter, generated: true, generatedDate: today, downloadUrl: '#', issued: true, issuedDate: today };
      }
      
      return {
        ...prev,
        forms,
        documents: {
          form16Issued: forms.form16.issued,
          pfFormsIssued: forms.form19.generated && forms.form10C.generated,
          experienceLetter: forms.experienceLetter.issued,
          relievingLetter: forms.relievingLetter.issued,
          form19Generated: forms.form19.generated,
          form10CGenerated: forms.form10C.generated
        }
      };
    });
    
    closeModal();
    showNotification(`${selectedForm} form generated successfully!`, 'success');
  };

  const handleApproval = (status) => {
    setSettlementData(prev => ({
      ...prev,
      approval: {
        ...prev.approval,
        status,
        approvedDate: status === 'approved' || status === 'rejected' ? new Date().toISOString().split('T')[0] : '',
        approvedBy: status === 'approved' ? 'Finance Manager' : 
                  status === 'rejected' ? 'HR Manager' : ''
      }
    }));
    showNotification(`Settlement ${status} successfully!`, status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info');
  };

  const handleExportReport = () => {
    if (filteredData.length === 0) {
      showNotification('No data to export!', 'warning');
      return;
    }

    let csvData = [];
    let headers = [];

    switch (activeSection) {
      case 'employees':
        headers = ['Employee ID', 'Name', 'Department', 'Designation', 'Last Working Day', 'Settlement Amount', 'Status'];
        csvData = employees.map(emp => [
          emp.employeeId || '', emp.name || '', emp.department || '', emp.designation || '',
          emp.lastWorkingDay || '', emp.settlementAmount || 0, emp.status || ''
        ]);
        break;
      case 'pending':
        headers = ['Employee ID', 'Name', 'Department', 'Last Working Day', 'Net Amount', 'Status', 'Days Pending'];
        csvData = pendingSettlements.map(set => [
          set.employeeId || '', set.employeeName || '', set.department || '',
          set.lastWorkingDay || '', set.netAmount || 0, set.status || '', set.daysPending || 0
        ]);
        break;
      case 'completed':
        headers = ['Employee ID', 'Name', 'Department', 'Last Working Day', 'Net Amount', 'Payment Date', 'Status'];
        csvData = completedSettlements.map(set => [
          set.employeeId || '', set.employeeName || '', set.department || '',
          set.lastWorkingDay || '', set.netAmount || 0, set.paymentDate || '', set.status || ''
        ]);
        break;
      default:
        headers = ['Data', 'Export'];
        csvData = [['No data to export']];
    }

    const csvContent = [headers, ...csvData].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settlement_${activeSection}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showNotification('Report exported successfully!', 'success');
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage(1);
      setSearchTerm('');
      setFilterType('All');
      showNotification('Data refreshed successfully!', 'success');
    }, 1000);
  };

  const handleGenerateReport = () => {
    const report = `FINAL SETTLEMENT REPORT\n=======================\n\n` +
                  `1. EMPLOYEE DETAILS:\n` +
                  `   - Name: ${settlementData.employee.name || 'N/A'}\n` +
                  `   - Employee ID: ${settlementData.employee.employeeId || 'N/A'}\n` +
                  `   - Department: ${settlementData.employee.department || 'N/A'}\n` +
                  `   - Date of Joining: ${settlementData.employee.doj || 'N/A'}\n` +
                  `   - Last Working Day: ${settlementData.employee.dol || 'N/A'}\n\n` +
                  `2. SETTLEMENT CALCULATIONS:\n` +
                  `   - Total Additions: ${formatCurrency(kpis.totalAdditions)}\n` +
                  `   - Total Deductions: ${formatCurrency(kpis.totalDeductions)}\n` +
                  `   - Net Settlement: ${formatCurrency(kpis.netSettlement)}\n\n` +
                  `3. COMPONENTS:\n` +
                  `   - Salary Payable: ${formatCurrency(settlementData.salary.totalSalary)}\n` +
                  `   - Leave Encashment: ${formatCurrency(settlementData.leave.totalEncashment)}\n` +
                  `   - Pro-rata Bonus: ${formatCurrency(settlementData.bonus.proRataBonus)}\n` +
                  `   - Gratuity: ${formatCurrency(settlementData.gratuity.gratuityAmount)}\n` +
                  `   - Reimbursements: ${formatCurrency(settlementData.reimbursements.approvedClaims)}\n\n` +
                  `Generated on: ${new Date().toLocaleString()}`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Final_Settlement_${settlementData.employee.name || 'Employee'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showNotification('Report generated successfully!', 'success');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'draft': 'bg-slate-50 text-slate-700 border border-slate-200',
      'completed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'approved': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'rejected': 'bg-rose-50 text-rose-700 border border-rose-200',
      'generated': 'bg-blue-50 text-blue-700 border border-blue-200',
      'issued': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'in-progress': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'paid': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'overdue': 'bg-rose-50 text-rose-700 border border-rose-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : 'N/A'}
      </span>
    );
  };

  const kpis = useMemo(() => {
    const totalAdditions = settlementData.salary.totalSalary +
      settlementData.leave.totalEncashment +
      settlementData.bonus.proRataBonus +
      settlementData.gratuity.gratuityAmount +
      settlementData.reimbursements.approvedClaims;

    const totalDeductions = settlementData.deductions.loanOutstanding +
      settlementData.deductions.advanceAmount +
      settlementData.deductions.penaltyAmount +
      settlementData.deductions.noticePeriodRecovery +
      settlementData.deductions.assetPenalty +
      settlementData.deductions.otherDeductions;

    const netSettlement = totalAdditions - totalDeductions;

    return {
      totalAdditions,
      totalDeductions,
      netSettlement: netSettlement > 0 ? netSettlement : 0,
      pendingSettlements: pendingSettlements.length,
      completedSettlements: completedSettlements.length,
      pendingForms: settlementForms.filter(f => f.status === 'pending').length,
      totalEmployees: employees.length
    };
  }, [settlementData, pendingSettlements, completedSettlements, settlementForms, employees]);

  const getFilteredData = () => {
    let data = [];
    switch (activeSection) {
      case 'employees':
        data = employees.filter(item =>
          (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'pending':
        data = pendingSettlements.filter(item =>
          (item.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'completed':
        data = completedSettlements.filter(item =>
          (item.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'forms':
        data = settlementForms.filter(item =>
          (item.formName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'reports':
        data = reports.filter(item =>
          (item.reportName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.period || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      default:
        data = [];
    }
    return data;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Net Settlement"
        value={formatCurrency(kpis.netSettlement)}
        subtitle="Current settlement amount"
        icon="heroicons:banknotes"
        color="blue"
      />
      <StatCard
        title="Total Additions"
        value={formatCurrency(kpis.totalAdditions)}
        subtitle="All earnings"
        icon="heroicons:plus-circle"
        color="green"
      />
      <StatCard
        title="Total Deductions"
        value={formatCurrency(kpis.totalDeductions)}
        subtitle="All recoveries"
        icon="heroicons:minus-circle"
        color="red"
      />
      <StatCard
        title="Approval Status"
        value={settlementData.approval.status.toUpperCase()}
        subtitle="Current stage"
        icon="heroicons:document-check"
        color="yellow"
      />
    </div>
  );

  const renderQuickActions = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {[
        { icon: 'heroicons:calculator', label: 'Recalculate', action: calculateSettlement, color: 'blue' },
        { icon: 'heroicons:check-circle', label: 'Approve', action: () => handleApproval('approved'), color: 'green' },
        { icon: 'heroicons:document-text', label: 'Documents', action: () => setActiveSection('documents'), color: 'amber' },
        { icon: 'heroicons:arrow-down-tray', label: 'Export', action: handleExportReport, color: 'purple' },
        { icon: 'heroicons:arrow-path', label: 'Refresh', action: handleRefreshData, color: 'slate' }
      ].map((item, index) => (
        <button
          key={index}
          className={`p-3 bg-${item.color}-50 hover:bg-${item.color}-100 text-${item.color}-700 rounded-xl border border-${item.color}-200 transition-all hover:shadow-md flex items-center justify-center gap-2`}
          onClick={item.action}
          disabled={isCalculating}
        >
          <Icon icon={item.icon} className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
          <span className="text-sm font-medium sm:hidden">{item.label.charAt(0)}</span>
        </button>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
            <h5 className="font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:user-circle" className="w-5 h-5 text-blue-500" />
              Employee Information
            </h5>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Employee Name:</span>
              <span className="font-semibold text-slate-800">{settlementData.employee.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Employee ID:</span>
              <span className="font-semibold text-slate-800">{settlementData.employee.employeeId || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Department:</span>
              <span className="text-slate-700">{settlementData.employee.department || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Designation:</span>
              <span className="text-slate-700">{settlementData.employee.designation || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date of Joining:</span>
              <span className="text-slate-700">{settlementData.employee.doj || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Last Working Day:</span>
              <span className="font-semibold text-rose-600">{settlementData.employee.dol || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
            <h5 className="font-bold text-slate-800 flex items-center gap-2">
              <Icon icon="heroicons:clock" className="w-5 h-5 text-amber-500" />
              Settlement Timeline
            </h5>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[
                { icon: 'heroicons:bell-alert', label: 'Notice Period Initiated', date: '15 June 2024', color: 'blue' },
                { icon: 'heroicons:document-text', label: 'Document Collection', date: '20 June 2024', color: 'cyan' },
                { icon: 'heroicons:calculator', label: 'Settlement Calculation', date: settlementData.approval.status === 'approved' ? '25 June 2024' : 'Pending', color: settlementData.approval.status === 'approved' ? 'emerald' : 'amber' },
                { icon: 'heroicons:banknotes', label: 'Payment Processing', date: settlementData.approval.status === 'approved' ? '07 July 2024' : 'Pending', color: settlementData.approval.status === 'approved' ? 'emerald' : 'slate' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-${item.color}-100 flex items-center justify-center flex-shrink-0`}>
                    <Icon icon={item.icon} className={`w-4 h-4 text-${item.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:chart-bar" className="w-5 h-5 text-purple-500" />
            Settlement Summary
          </h5>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-600 font-medium">Total Additions</p>
              <p className="text-lg font-bold text-blue-700">{formatCurrency(kpis.totalAdditions)}</p>
            </div>
            <div className="text-center p-3 bg-rose-50 rounded-xl">
              <p className="text-xs text-rose-600 font-medium">Total Deductions</p>
              <p className="text-lg font-bold text-rose-700">{formatCurrency(kpis.totalDeductions)}</p>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-xl col-span-2 sm:col-span-1">
              <p className="text-xs text-emerald-600 font-medium">Net Settlement</p>
              <p className="text-lg font-bold text-emerald-700">{formatCurrency(kpis.netSettlement)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'calculations':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800 flex items-center gap-2">
                  <Icon icon="heroicons:calculator" className="w-5 h-5 text-blue-500" />
                  Settlement Calculations
                </h5>
                <button
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
                  onClick={calculateSettlement}
                  disabled={isCalculating}
                >
                  <Icon icon="heroicons:calculator" className="w-4 h-4" />
                  {isCalculating ? 'Calculating...' : 'Calculate'}
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Icon icon="heroicons:user-circle" className="w-4 h-4 text-blue-500" />
                    Employee Details
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-medium text-slate-800">{settlementData.employee.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Employee ID:</span>
                      <span className="font-medium text-slate-800">{settlementData.employee.employeeId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Department:</span>
                      <span className="font-medium text-slate-800">{settlementData.employee.department || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Working Day:</span>
                      <span className="font-medium text-rose-600">{settlementData.employee.dol || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Icon icon="heroicons:currency-dollar" className="w-4 h-4 text-emerald-500" />
                    Salary Details
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Basic Salary:</span>
                      <span className="font-medium text-slate-800">{formatCurrency(settlementData.salary.basic)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">HRA:</span>
                      <span className="font-medium text-slate-800">{formatCurrency(settlementData.salary.hra)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Days Worked:</span>
                      <span className="font-medium text-slate-800">{settlementData.salary.daysWorked}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="font-semibold text-slate-700">Salary Payable:</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(settlementData.salary.totalSalary)}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Icon icon="heroicons:sun" className="w-4 h-4 text-amber-500" />
                    Leave Encashment
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Earned Leave Balance:</span>
                      <span className="font-medium text-slate-800">{settlementData.leave.earnedLeaveBalance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Encashment Rate/Day:</span>
                      <span className="font-medium text-slate-800">{formatCurrency(settlementData.leave.encashmentRate)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="font-semibold text-slate-700">Total Encashment:</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(settlementData.leave.totalEncashment)}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Icon icon="heroicons:gift" className="w-4 h-4 text-purple-500" />
                    Bonus & Gratuity
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Annual Bonus:</span>
                      <span className="font-medium text-slate-800">{formatCurrency(settlementData.bonus.annualBonus)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pro-rata Bonus:</span>
                      <span className="font-medium text-slate-800">{formatCurrency(settlementData.bonus.proRataBonus)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gratuity:</span>
                      <span className={`font-medium ${settlementData.gratuity.eligibility ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {formatCurrency(settlementData.gratuity.gratuityAmount)}
                        {!settlementData.gratuity.eligibility && ' (Not eligible)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'deductions':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800 flex items-center gap-2">
                  <Icon icon="heroicons:minus-circle" className="w-5 h-5 text-rose-500" />
                  Deductions & Recovery
                </h5>
                <button
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
                  onClick={calculateSettlement}
                  disabled={isCalculating}
                >
                  <Icon icon="heroicons:calculator" className="w-4 h-4" />
                  Calculate
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Icon icon="heroicons:credit-card" className="w-4 h-4 text-blue-500" />
                    Loan & Advances
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Loan Outstanding:</span>
                      <span className="font-medium text-slate-800">{formatCurrency(settlementData.deductions.loanOutstanding)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Advance Amount:</span>
                      <span className="font-medium text-slate-800">{formatCurrency(settlementData.deductions.advanceAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="font-semibold text-slate-700">Total:</span>
                      <span className="font-bold text-rose-600">{formatCurrency(settlementData.deductions.loanOutstanding + settlementData.deductions.advanceAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Icon icon="heroicons:clock" className="w-4 h-4 text-amber-500" />
                    Notice Period Recovery
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Shortfall Days:</span>
                      <span className="font-medium text-slate-800">{settlementData.noticePeriod.shortfallDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Daily Rate:</span>
                      <span className="font-medium text-slate-800">{formatCurrency((settlementData.salary.basic + settlementData.salary.hra + settlementData.salary.specialAllowance) / 30)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="font-semibold text-slate-700">Recovery Amount:</span>
                      <span className="font-bold text-rose-600">{formatCurrency(settlementData.deductions.noticePeriodRecovery)}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Icon icon="heroicons:cube" className="w-4 h-4 text-purple-500" />
                    Asset Penalty
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Assets:</span>
                      <span className="font-medium text-slate-800">{settlementData.assets.totalAssets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Returned:</span>
                      <span className="font-medium text-emerald-600">{settlementData.assets.returnedAssets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pending:</span>
                      <span className="font-medium text-amber-600">{settlementData.assets.pendingAssets}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="font-semibold text-slate-700">Total Penalty:</span>
                      <span className="font-bold text-rose-600">{formatCurrency(settlementData.assets.totalPenalty)}</span>
                    </div>
                    <button
                      className="w-full mt-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                      onClick={() => openModal('assets')}
                    >
                      <Icon icon="heroicons:cog-6-tooth" className="w-4 h-4" />
                      Manage Assets
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Icon icon="heroicons:banknotes" className="w-4 h-4 text-emerald-500" />
                    Net Settlement
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Additions:</span>
                      <span className="font-medium text-emerald-600">{formatCurrency(kpis.totalAdditions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Deductions:</span>
                      <span className="font-medium text-rose-600">{formatCurrency(kpis.totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2">
                      <span className="font-semibold text-slate-700">Net Settlement:</span>
                      <span className="font-bold text-blue-600 text-lg">{formatCurrency(kpis.netSettlement)}</span>
                    </div>
                    <button
                      className="w-full mt-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                      onClick={() => openModal('payment')}
                      disabled={settlementData.approval.status !== 'approved'}
                    >
                      <Icon icon="heroicons:banknotes" className="w-4 h-4" />
                      Process Payment
                    </button>
                    {settlementData.approval.status !== 'approved' && (
                      <p className="text-xs text-amber-600 text-center mt-1">
                        Approval required before payment
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'approval':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800 flex items-center gap-2">
                  <Icon icon="heroicons:document-check" className="w-5 h-5 text-blue-500" />
                  Approval Workflow
                </h5>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
                    onClick={() => handleApproval('approved')}
                  >
                    <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
                    onClick={() => handleApproval('rejected')}
                  >
                    <Icon icon="heroicons:x-circle" className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="mb-3">
                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                      settlementData.approval.status === 'approved' ? 'bg-emerald-100' :
                      settlementData.approval.status === 'rejected' ? 'bg-rose-100' :
                      settlementData.approval.status === 'pending' ? 'bg-amber-100' :
                      'bg-slate-100'
                    }`}>
                      <Icon icon={
                        settlementData.approval.status === 'approved' ? 'heroicons:check-circle' :
                        settlementData.approval.status === 'rejected' ? 'heroicons:x-circle' :
                        settlementData.approval.status === 'pending' ? 'heroicons:clock' :
                        'heroicons:pencil'
                      } className={`w-8 h-8 ${
                        settlementData.approval.status === 'approved' ? 'text-emerald-600' :
                        settlementData.approval.status === 'rejected' ? 'text-rose-600' :
                        settlementData.approval.status === 'pending' ? 'text-amber-600' :
                        'text-slate-600'
                      }`} />
                    </div>
                  </div>
                  <h6 className="font-bold text-lg text-slate-800">{settlementData.approval.status.toUpperCase()}</h6>
                  <p className="text-sm text-slate-500 mt-1">
                    {settlementData.approval.status === 'approved' && 'Settlement has been approved for payment'}
                    {settlementData.approval.status === 'pending' && 'Awaiting approval from management'}
                    {settlementData.approval.status === 'rejected' && 'Settlement has been rejected'}
                    {settlementData.approval.status === 'draft' && 'Settlement is in draft mode'}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700">Workflow Steps</h6>
                  <div className="space-y-3">
                    {[
                      { step: 1, label: 'HR Verification', status: 'completed' },
                      { step: 2, label: 'Finance Calculation', status: settlementData.approval.status === 'draft' ? 'pending' : settlementData.approval.status === 'pending' ? 'in-progress' : 'completed' },
                      { step: 3, label: 'Management Approval', status: settlementData.approval.status === 'approved' ? 'completed' : settlementData.approval.status === 'pending' ? 'in-progress' : 'pending' }
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.status === 'completed' ? 'bg-emerald-100' :
                          item.status === 'in-progress' ? 'bg-amber-100' :
                          'bg-slate-100'
                        }`}>
                          <Icon icon={
                            item.status === 'completed' ? 'heroicons:check-circle' :
                            item.status === 'in-progress' ? 'heroicons:arrow-path' :
                            'heroicons:clock'
                          } className={`w-4 h-4 ${
                            item.status === 'completed' ? 'text-emerald-600' :
                            item.status === 'in-progress' ? 'text-amber-600' :
                            'text-slate-400'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{item.label}</p>
                          <p className="text-xs text-slate-500 capitalize">{item.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800 flex items-center gap-2">
                  <Icon icon="heroicons:document-text" className="w-5 h-5 text-blue-500" />
                  Document Management
                </h5>
                <button
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
                  onClick={() => {
                    setSelectedForm('All');
                    openModal('form');
                  }}
                >
                  <Icon icon="heroicons:document-plus" className="w-4 h-4" />
                  Generate All
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Icon icon="heroicons:clipboard-document-check" className="w-4 h-4 text-blue-500" />
                    Document Checklist
                  </h6>
                  {[
                    { id: 'form16', label: 'Form 16 Issued', checked: settlementData.documents.form16Issued },
                    { id: 'pfForms', label: 'PF Withdrawal Forms', checked: settlementData.documents.pfFormsIssued },
                    { id: 'expLetter', label: 'Experience Letter', checked: settlementData.documents.experienceLetter },
                    { id: 'relLetter', label: 'Relieving Letter', checked: settlementData.documents.relievingLetter }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">{item.label}</span>
                      {item.checked && (
                        <span className="ml-auto text-xs text-emerald-600 flex items-center gap-1">
                          <Icon icon="heroicons:check-circle" className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h6 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Icon icon="heroicons:document-plus" className="w-4 h-4 text-purple-500" />
                    Generate Documents
                  </h6>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Form 16', icon: 'heroicons:document-text', key: 'Form16' },
                      { label: 'PF Forms', icon: 'heroicons:building-library', key: 'PF' },
                      { label: 'Experience Letter', icon: 'heroicons:academic-cap', key: 'Experience' },
                      { label: 'Relieving Letter', icon: 'heroicons:document', key: 'Relieving' }
                    ].map((doc) => (
                      <button
                        key={doc.key}
                        className="p-3 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-center"
                        onClick={() => {
                          setSelectedForm(doc.key);
                          openModal('form');
                        }}
                      >
                        <Icon icon={doc.icon} className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                        <p className="text-xs font-medium text-slate-700">{doc.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'employees':
      case 'pending':
      case 'completed':
      case 'forms':
      case 'reports':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800 flex items-center gap-2">
                  <Icon icon={
                    activeSection === 'employees' ? 'heroicons:users' :
                    activeSection === 'pending' ? 'heroicons:clock' :
                    activeSection === 'completed' ? 'heroicons:check-circle' :
                    activeSection === 'forms' ? 'heroicons:clipboard-document' :
                    'heroicons:chart-bar'
                  } className="w-5 h-5 text-blue-500" />
                  {activeSection === 'employees' && 'All Employees'}
                  {activeSection === 'pending' && 'Pending Settlements'}
                  {activeSection === 'completed' && 'Completed Settlements'}
                  {activeSection === 'forms' && 'Settlement Forms'}
                  {activeSection === 'reports' && 'Reports & Analytics'}
                </h5>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
                    onClick={handleExportReport}
                  >
                    <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                    onClick={handleRefreshData}
                  >
                    <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={`Search ${activeSection === 'employees' ? 'employees' : activeSection === 'pending' ? 'pending settlements' : activeSection === 'completed' ? 'completed settlements' : activeSection === 'forms' ? 'forms' : 'reports'}...`}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                {(activeSection === 'employees' || activeSection === 'pending' || activeSection === 'completed' || activeSection === 'forms') && (
                  <select
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Status</option>
                    {activeSection === 'employees' && (
                      <>
                        <option value="pending">Pending</option>
                        <option value="draft">Draft</option>
                        <option value="completed">Completed</option>
                      </>
                    )}
                    {activeSection === 'pending' && (
                      <>
                        <option value="pending">Pending</option>
                        <option value="draft">Draft</option>
                      </>
                    )}
                    {activeSection === 'completed' && (
                      <>
                        <option value="completed">Completed</option>
                        <option value="paid">Paid</option>
                      </>
                    )}
                    {activeSection === 'forms' && (
                      <>
                        <option value="pending">Pending</option>
                        <option value="generated">Generated</option>
                        <option value="issued">Issued</option>
                      </>
                    )}
                  </select>
                )}
              </div>

              {paginatedData.length === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="heroicons:inbox" className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <h5 className="text-slate-600 font-medium text-lg">No records found</h5>
                  <p className="text-slate-400 text-sm">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        {activeSection === 'employees' && (
                          <>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Employee</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Department</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Last Working Day</th>
                            <th className="px-3 py-2 text-right font-semibold text-slate-600">Amount</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
                          </>
                        )}
                        {(activeSection === 'pending' || activeSection === 'completed') && (
                          <>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Employee</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Last Working Day</th>
                            <th className="px-3 py-2 text-right font-semibold text-slate-600">Net Amount</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                            {activeSection === 'pending' && (
                              <th className="px-3 py-2 text-center font-semibold text-slate-600">Days Pending</th>
                            )}
                            {activeSection === 'completed' && (
                              <th className="px-3 py-2 text-center font-semibold text-slate-600">Payment Date</th>
                            )}
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
                          </>
                        )}
                        {activeSection === 'forms' && (
                          <>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Form Name</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Employee</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Type</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Date</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
                          </>
                        )}
                        {activeSection === 'reports' && (
                          <>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Report Name</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Period</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Type</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Date</th>
                            <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          {(activeSection === 'employees' || activeSection === 'pending' || activeSection === 'completed') && (
                            <>
                              <td className="px-3 py-2">
                                <div className="font-medium text-slate-800">{item.name || item.employeeName}</div>
                                <div className="text-xs text-slate-500">{item.employeeId}</div>
                              </td>
                              {activeSection === 'employees' && (
                                <>
                                  <td className="px-3 py-2 text-slate-700">{item.department}</td>
                                  <td className="px-3 py-2 text-slate-700">{formatDate(item.lastWorkingDay)}</td>
                                </>
                              )}
                              {activeSection !== 'employees' && (
                                <td className="px-3 py-2 text-slate-700">{formatDate(item.lastWorkingDay)}</td>
                              )}
                              <td className="px-3 py-2 text-right font-semibold text-emerald-600">
                                {formatCurrency(item.settlementAmount || item.netAmount)}
                              </td>
                              <td className="px-3 py-2 text-center">{getStatusBadge(item.status)}</td>
                              {activeSection === 'pending' && (
                                <td className="px-3 py-2 text-center">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${item.daysPending > 7 ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {item.daysPending} days
                                  </span>
                                </td>
                              )}
                              {activeSection === 'completed' && (
                                <td className="px-3 py-2 text-center text-slate-700">{formatDate(item.paymentDate)}</td>
                              )}
                              <td className="px-3 py-2">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                                    onClick={() => openModal('details', item)}
                                    title="View Details"
                                  >
                                    <Icon icon="heroicons:eye" className="w-4 h-4" />
                                  </button>
                                  {activeSection === 'pending' && (
                                    <button
                                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                      onClick={() => handleApproval('approved')}
                                      title="Approve"
                                    >
                                      <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                                    </button>
                                  )}
                                  {activeSection === 'completed' && (
                                    <button
                                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                      onClick={() => {
                                        const receipt = `Payment Receipt\n\nEmployee: ${item.employeeName}\nAmount: ${formatCurrency(item.netAmount)}\nPayment Date: ${item.paymentDate}\n\nThank you for your service.`;
                                        const blob = new Blob([receipt], { type: 'text/plain' });
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `Receipt_${item.employeeName}_${item.paymentDate}.txt`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        window.URL.revokeObjectURL(url);
                                        showNotification('Receipt downloaded!', 'success');
                                      }}
                                      title="Download Receipt"
                                    >
                                      <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </>
                          )}

                          {activeSection === 'forms' && (
                            <>
                              <td className="px-3 py-2 font-medium text-slate-800">{item.formName}</td>
                              <td className="px-3 py-2 text-slate-700">{item.employeeName}</td>
                              <td className="px-3 py-2 text-center">
                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                  {item.type?.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-center">{getStatusBadge(item.status)}</td>
                              <td className="px-3 py-2 text-center text-slate-700">
                                {item.generatedDate || item.issuedDate || item.dueDate || 'N/A'}
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                                    onClick={() => openModal('details', item)}
                                    title="View Details"
                                  >
                                    <Icon icon="heroicons:eye" className="w-4 h-4" />
                                  </button>
                                  {item.status === 'generated' && (
                                    <button
                                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                      onClick={() => {
                                        setSelectedForm(item.formName);
                                        openModal('form');
                                      }}
                                      title="Download"
                                    >
                                      <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                                    </button>
                                  )}
                                  {item.status === 'pending' && (
                                    <button
                                      className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                                      onClick={() => {
                                        setSelectedForm(item.formName);
                                        openModal('form');
                                      }}
                                      title="Generate"
                                    >
                                      <Icon icon="heroicons:document-plus" className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </>
                          )}

                          {activeSection === 'reports' && (
                            <>
                              <td className="px-3 py-2 font-medium text-slate-800">{item.reportName}</td>
                              <td className="px-3 py-2 text-slate-700">{item.period}</td>
                              <td className="px-3 py-2 text-center">
                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  {item.type?.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-center">{getStatusBadge(item.status)}</td>
                              <td className="px-3 py-2 text-center text-slate-700">{item.generatedDate || 'N/A'}</td>
                              <td className="px-3 py-2">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                                    onClick={() => openModal('details', item)}
                                    title="View Details"
                                  >
                                    <Icon icon="heroicons:eye" className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                    onClick={() => {
                                      const content = `${item.reportName}\nPeriod: ${item.period}\nGenerated: ${item.generatedDate || 'N/A'}\n\nThis is a sample report.`;
                                      const blob = new Blob([content], { type: 'text/plain' });
                                      const url = window.URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `${item.reportName.replace(/\s+/g, '_')}.txt`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      window.URL.revokeObjectURL(url);
                                      showNotification('Report downloaded!', 'success');
                                    }}
                                    title="Download"
                                  >
                                    <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <div className="text-sm text-slate-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
            <Icon icon="heroicons:banknotes" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Final Settlement Processing</h1>
            <p className="text-sm text-slate-500">Manage full & final settlement with notice period verification, salary calculation, leave encashment, deductions, and approval workflow</p>
          </div>
        </div>
      </div>

      {renderStats()}
      {renderQuickActions()}

      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: 'heroicons:home' },
          { id: 'calculations', label: 'Calculations', icon: 'heroicons:calculator' },
          { id: 'deductions', label: 'Deductions', icon: 'heroicons:minus-circle' },
          { id: 'approval', label: 'Approval', icon: 'heroicons:document-check' },
          { id: 'documents', label: 'Documents', icon: 'heroicons:document-text' },
          { id: 'employees', label: 'Employees', icon: 'heroicons:users' },
          { id: 'pending', label: 'Pending', icon: 'heroicons:clock' },
          { id: 'completed', label: 'Completed', icon: 'heroicons:check-circle' },
          { id: 'forms', label: 'Forms', icon: 'heroicons:clipboard-document' },
          { id: 'reports', label: 'Reports', icon: 'heroicons:chart-bar' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSection(tab.id);
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeSection === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon icon={tab.icon} className="w-4 h-4" />
            {tab.label}
            {tab.id === 'pending' && kpis.pendingSettlements > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {kpis.pendingSettlements}
              </span>
            )}
            {tab.id === 'completed' && kpis.completedSettlements > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-emerald-500 text-white rounded-full">
                {kpis.completedSettlements}
              </span>
            )}
          </button>
        ))}
      </div>

      {renderContent()}

      <SettlementDetailsModal
        isOpen={modalState.isOpen && modalState.type === 'details'}
        onClose={closeModal}
        item={modalState.data}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
        activeSection={activeSection}
      />

          <GenerateFormModal
              isOpen={modalState.isOpen && modalState.type === 'form'}
              onClose={closeModal}
              onSubmit={(data) => {
                  handleGenerateForm(data);
                  closeModal();
              }}
              formName={selectedForm || ''}
              mode="settlement"
              employees={employees}
              selectedEmployeeId={settlementData.employee.id}
          />

          <PaymentModal
              isOpen={modalState.isOpen && modalState.type === 'payment'}
              onClose={closeModal}
              onSubmit={handleProcessPayment}
              settlementData={settlementData}
              formatCurrency={formatCurrency}
              mode="settlement"
          />

      <AssetManagementModal
        isOpen={modalState.isOpen && modalState.type === 'assets'}
        onClose={closeModal}
        assets={settlementData.assets}
        formatCurrency={formatCurrency}
        onAssetReturn={handleAssetReturn}
      />

      <LastWorkingDayModal
        isOpen={modalState.isOpen && modalState.type === 'lastWorkingDay'}
        onClose={closeModal}
        onConfirm={handleConfirmLastWorkingDay}
        lastWorkingDay={settlementData.lastWorkingDay}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        className="text-xs sm:text-sm"
        toastClassName="rounded-xl shadow-lg"
      />
    </div>
  );
};

export default FinalSettlement;