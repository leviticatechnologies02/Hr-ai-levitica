import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import LoanDetailsModal from '../modal/LoanDetailsModal';
import LoanApplicationModal from '../modal/LoanApplicationModal';
import EditLoanModal from '../modal/EditLoanModal';
import PaymentModal from '../modal/PaymentModal';
import DisbursementModal from '../modal/DisbursementModal';
import PrepaymentModal from '../modal/PrepaymentModal';
import ForeclosureModal from '../modal/ForeclosureModal';
import CertificateModal from '../modal/CertificateModal';
import DeleteConfirmationModal from '../modal/DeleteConfirmationModal';

const LoansAdvances = () => {
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loanTypeFilter, setLoanTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({
    key: 'employeeName',
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [editingReimbursement, setEditingReimbursement] = useState(null);

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const itemsPerPage = 6;

  const loanTypes = [
    'Personal loan',
    'Vehicle loan',
    'Educational loan',
    'Festival advance',
    'Emergency loan',
    'Salary advance'
  ];

  const statuses = ['All', 'Active', 'Completed', 'Pending', 'Overdue'];

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

  const kpis = useMemo(() => {
    const totalLoans = loans.length;
    const activeLoans = loans.filter(loan => loan.status === 'Active').length;
    const pendingApplications = loans.filter(
      loan => loan.applicationStatus === 'submitted' || loan.applicationStatus === 'under_review'
    ).length;
    const totalAmount = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
    const totalPending = loans.reduce((sum, loan) => sum + (loan.amountPending || 0), 0);
    const totalCollected = loans.reduce((sum, loan) => sum + (loan.amountPaid || 0), 0);
    const completedLoans = loans.filter(loan => loan.status === 'Completed').length;

    return {
      totalLoans,
      activeLoans,
      pendingApplications,
      totalAmount,
      totalPending,
      totalCollected,
      completedLoans
    };
  }, [loans]);

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
    if (!dateString || dateString === 'N/A') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Completed': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Pending': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Rejected': 'bg-rose-50 text-rose-700 border border-rose-200',
      'Overdue': 'bg-red-50 text-red-700 border border-red-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status || 'N/A'}
      </span>
    );
  };

  const getLoanTypeBadge = (type) => {
    const styles = {
      'Personal loan': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Vehicle loan': 'bg-cyan-50 text-cyan-700 border border-cyan-200',
      'Educational loan': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Festival advance': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Emergency loan': 'bg-rose-50 text-rose-700 border border-rose-200',
      'Salary advance': 'bg-purple-50 text-purple-700 border border-purple-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {type || 'N/A'}
      </span>
    );
  };

  const getApplicationStatusBadge = (status) => {
    const styles = {
      'draft': 'bg-slate-50 text-slate-700 border border-slate-200',
      'submitted': 'bg-amber-50 text-amber-700 border border-amber-200',
      'under_review': 'bg-blue-50 text-blue-700 border border-blue-200',
      'approved': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'rejected': 'bg-rose-50 text-rose-700 border border-rose-200',
      'disbursed': 'bg-purple-50 text-purple-700 border border-purple-200'
    };

    const labels = {
      'draft': 'Draft',
      'submitted': 'Submitted',
      'under_review': 'Under Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'disbursed': 'Disbursed'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {labels[status] || status || 'N/A'}
      </span>
    );
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleApplyForLoan = (data) => {
    const amount = parseFloat(data.amount);
    const monthlyEMI = calculateEMI(
      amount,
      parseFloat(data.interestRate),
      parseInt(data.tenureMonths)
    );

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(data.tenureMonths));

    const newLoan = {
      id: loans.length + 1,
      loanId: `LN${String(loans.length + 1).padStart(3, '0')}`,
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      department: data.department || 'N/A',
      designation: data.designation || 'N/A',
      loanType: data.loanType,
      amount: amount,
      interestRate: parseFloat(data.interestRate),
      tenureMonths: parseInt(data.tenureMonths),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      monthlyEMI: monthlyEMI,
      amountPaid: 0,
      amountPending: amount,
      status: 'Pending',
      nextDueDate: 'N/A',
      applicationDate: new Date().toISOString().split('T')[0],
      applicationStatus: 'submitted',
      approvalWorkflow: [
        { level: 'supervisor', status: 'pending', date: null, approvedBy: null },
        { level: 'hr', status: 'pending', date: null, approvedBy: null },
        { level: 'finance', status: 'pending', date: null, approvedBy: null }
      ],
      eligibilityChecks: {
        serviceTenure: { required: '6 months', actual: `${data.serviceTenure || 0} months`, status: 'pass' },
        salaryRatio: { required: '3x', actual: '2.5x', status: 'pass' },
        existingLoans: { count: parseInt(data.existingLoans || 0), status: 'pass' }
      },
      documents: {
        applicationForm: { uploaded: true, verified: false },
        identityProof: { uploaded: false, verified: false },
        salarySlips: { uploaded: false, verified: false },
        agreement: { generated: false, signed: false },
        certificate: { generated: false }
      },
      disbursement: {
        status: 'pending',
        method: '',
        bankDetails: { accountNumber: '', bankName: '' },
        disbursementDate: null,
        disbursementAmount: amount,
        transactionId: ''
      },
      paymentMethod: 'payroll_deduction',
      autoDeduction: {
        enabled: false,
        deductionDate: 5,
        accountDetails: { accountNumber: '', bankName: '' }
      },
      emiSchedule: [],
      prepaymentRules: {
        allowed: true,
        minimumAmount: 10000,
        charges: '2% of prepayment amount'
      },
      foreclosureOptions: {
        allowedAfter: 12,
        charges: '3% of outstanding'
      },
      missedPayments: 0,
      overdueAmount: 0,
      completionStatus: 'pending',
      certificateNumber: null
    };

    setLoans([...loans, newLoan]);
    closeModal();
    showNotification('Loan application submitted successfully!', 'success');
  };

  const handleUpdateLoan = (data) => {
    setLoans(loans.map(loan =>
      loan.id === data.id
        ? {
            ...loan,
            ...data,
            amount: parseFloat(data.amount),
            interestRate: parseFloat(data.interestRate),
            tenureMonths: parseInt(data.tenureMonths),
            monthlyEMI: calculateEMI(
              parseFloat(data.amount),
              parseFloat(data.interestRate),
              parseInt(data.tenureMonths)
            ),
            amountPending: parseFloat(data.amount) - parseFloat(data.amountPaid)
          }
        : loan
    ));
    closeModal();
    showNotification('Loan updated successfully!', 'success');
  };

  const handleDeleteLoan = (loan) => {
    setLoans(loans.filter(l => l.id !== loan.id));
    closeModal();
    showNotification('Loan deleted successfully!', 'success');
  };

  const handleApproveLoan = (loan, level) => {
    setLoans(loans.map(l => {
      if (l.id === loan.id) {
        const updatedWorkflow = [...l.approvalWorkflow];
        const levelIndex = updatedWorkflow.findIndex(w => w.level === level);
        
        if (levelIndex !== -1) {
          updatedWorkflow[levelIndex] = {
            ...updatedWorkflow[levelIndex],
            status: 'approved',
            date: new Date().toISOString().split('T')[0],
            approvedBy: 'Current User'
          };
        }

        const nextLevels = ['supervisor', 'hr', 'finance'];
        const currentIndex = nextLevels.indexOf(level);
        const nextLevel = nextLevels[currentIndex + 1];

        if (nextLevel) {
          const nextLevelIndex = updatedWorkflow.findIndex(w => w.level === nextLevel);
          if (nextLevelIndex !== -1 && updatedWorkflow[nextLevelIndex].status === 'pending') {
            updatedWorkflow[nextLevelIndex] = {
              ...updatedWorkflow[nextLevelIndex],
              status: 'pending'
            };
          }
        }

        let newApplicationStatus = l.applicationStatus;
        if (level === 'supervisor') {
          newApplicationStatus = 'under_review';
        } else if (level === 'hr') {
          newApplicationStatus = 'under_review';
        } else if (level === 'finance') {
          newApplicationStatus = 'approved';
        }

        return {
          ...l,
          approvalWorkflow: updatedWorkflow,
          applicationStatus: newApplicationStatus,
          status: newApplicationStatus === 'approved' ? 'Active' : 'Pending'
        };
      }
      return l;
    }));

    showNotification(`Loan ${level} approval completed!`, 'success');
  };

  const handleRejectLoan = (loan, level) => {
    setLoans(loans.map(l => {
      if (l.id === loan.id) {
        const updatedWorkflow = [...l.approvalWorkflow];
        const levelIndex = updatedWorkflow.findIndex(w => w.level === level);
        if (levelIndex !== -1) {
          updatedWorkflow[levelIndex] = {
            ...updatedWorkflow[levelIndex],
            status: 'rejected',
            date: new Date().toISOString().split('T')[0],
            approvedBy: 'Current User'
          };
        }

        return {
          ...l,
          approvalWorkflow: updatedWorkflow,
          applicationStatus: 'rejected',
          status: 'Rejected'
        };
      }
      return l;
    }));

    showNotification('Loan application rejected!', 'warning');
  };

  const handleProcessPayment = (data) => {
    setLoans(loans.map(loan => {
      if (loan.loanId === data.loanId) {
        const newAmountPaid = loan.amountPaid + parseFloat(data.amount);
        const newAmountPending = Math.max(0, loan.amountPending - parseFloat(data.amount));
        const newStatus = newAmountPending === 0 ? 'Completed' : loan.status;

        const updatedEMISchedule = [...(loan.emiSchedule || [])];
        const currentMonthIndex = updatedEMISchedule.findIndex(emi => emi.status === 'due');
        if (currentMonthIndex !== -1) {
          updatedEMISchedule[currentMonthIndex] = {
            ...updatedEMISchedule[currentMonthIndex],
            status: 'paid',
            paymentDate: data.paymentDate
          };
        }

        return {
          ...loan,
          amountPaid: newAmountPaid,
          amountPending: newAmountPending,
          status: newStatus,
          emiSchedule: updatedEMISchedule,
          nextDueDate: updatedEMISchedule.find(emi => emi.status === 'due')?.dueDate || 'N/A'
        };
      }
      return loan;
    }));

    closeModal();
    showNotification('Payment processed successfully!', 'success');
  };

  const handleProcessDisbursement = (data) => {
    setLoans(loans.map(loan => {
      if (loan.loanId === data.loanId) {
        const emiSchedule = [];
        const startDate = new Date(loan.startDate);

        for (let i = 1; i <= loan.tenureMonths; i++) {
          const dueDate = new Date(startDate);
          dueDate.setMonth(dueDate.getMonth() + i);
          emiSchedule.push({
            month: i,
            dueDate: dueDate.toISOString().split('T')[0],
            amount: loan.monthlyEMI,
            status: i === 1 ? 'due' : 'pending'
          });
        }

        return {
          ...loan,
          disbursement: {
            status: 'completed',
            method: data.method,
            bankDetails: data.bankDetails,
            disbursementDate: data.disbursementDate,
            disbursementAmount: loan.amount,
            transactionId: data.transactionId
          },
          applicationStatus: 'disbursed',
          status: 'Active',
          emiSchedule: emiSchedule,
          nextDueDate: emiSchedule[0]?.dueDate || 'N/A'
        };
      }
      return loan;
    }));

    closeModal();
    showNotification('Loan disbursed successfully!', 'success');
  };

  const handlePrepayment = (data) => {
    setLoans(loans.map(loan => {
      if (loan.id === data.loanId) {
        const newAmountPaid = loan.amountPaid + parseFloat(data.amount);
        const newAmountPending = Math.max(0, loan.amountPending - parseFloat(data.amount));
        const newStatus = newAmountPending === 0 ? 'Completed' : loan.status;

        return {
          ...loan,
          amountPaid: newAmountPaid,
          amountPending: newAmountPending,
          status: newStatus,
          ...(newAmountPending === 0 && {
            completionStatus: 'prepaid',
            documents: {
              ...loan.documents,
              certificate: {
                generated: true,
                certificateNumber: `PREPAID-${Date.now()}`
              }
            }
          })
        };
      }
      return loan;
    }));

    closeModal();
    showNotification('Prepayment processed successfully!', 'success');
  };

  const handleForeclosure = (data) => {
    setLoans(loans.map(loan => {
      if (loan.id === data.loanId) {
        return {
          ...loan,
          amountPaid: loan.amountPaid + loan.amountPending,
          amountPending: 0,
          status: 'Completed',
          completionStatus: 'foreclosed',
          documents: {
            ...loan.documents,
            certificate: {
              generated: true,
              certificateNumber: `FORECLOSED-${Date.now()}`
            }
          }
        };
      }
      return loan;
    }));

    closeModal();
    showNotification('Loan foreclosed successfully!', 'success');
  };

  const handleGenerateCertificate = (loan) => {
    setLoans(loans.map(l => {
      if (l.id === loan.id) {
        const certificateNumber = `CERT${Date.now()}`;
        return {
          ...l,
          documents: {
            ...l.documents,
            certificate: { generated: true, certificateNumber }
          },
          completionStatus: 'completed',
          status: 'Completed'
        };
      }
      return l;
    }));

    showNotification('Certificate generated successfully!', 'success');
  };

  const calculateEMI = (principal, rate, months) => {
    if (rate === 0) return principal / months;
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return parseFloat(emi.toFixed(2));
  };

  const exportToCSV = () => {
    if (sortedData.length === 0) {
      showNotification('No data to export!', 'warning');
      return;
    }

    const headers = [
      'Loan ID', 'Employee ID', 'Employee Name', 'Loan Type', 'Amount',
      'Interest Rate', 'Tenure (Months)', 'Start Date', 'End Date',
      'Monthly EMI', 'Amount Paid', 'Amount Pending', 'Status',
      'Application Status', 'Next Due Date'
    ];

    const csvRows = [
      headers.join(','),
      ...sortedData.map(record => [
        record.loanId,
        record.employeeId,
        `"${record.employeeName}"`,
        `"${record.loanType}"`,
        record.amount,
        record.interestRate,
        record.tenureMonths,
        record.startDate,
        record.endDate,
        record.monthlyEMI,
        record.amountPaid,
        record.amountPending,
        `"${record.status}"`,
        `"${record.applicationStatus}"`,
        record.nextDueDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan_management_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showNotification('Data exported successfully!', 'success');
  };

  const filteredData = useMemo(() => {
    let data = loans;

    if (activeTab === 'pending') {
      data = data.filter(loan =>
        loan.applicationStatus === 'submitted' || loan.applicationStatus === 'under_review'
      );
    } else if (activeTab === 'active') {
      data = data.filter(loan => loan.status === 'Active');
    } else if (activeTab === 'completed') {
      data = data.filter(loan => loan.status === 'Completed');
    } else if (activeTab === 'overdue') {
      data = data.filter(loan => loan.overdueAmount > 0);
    }

    return data.filter(loan => {
      const matchesSearch =
        (loan.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (loan.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (loan.loanId || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLoanType = loanTypeFilter === 'All' || loan.loanType === loanTypeFilter;
      const matchesStatus = statusFilter === 'All' || loan.status === statusFilter;
      return matchesSearch && matchesLoanType && matchesStatus;
    });
  }, [loans, searchTerm, loanTypeFilter, statusFilter, activeTab]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (['amount', 'interestRate', 'amountPending', 'monthlyEMI'].includes(sortConfig.key)) {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (['startDate', 'endDate', 'nextDueDate'].includes(sortConfig.key)) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Loans"
        value={kpis.totalLoans}
        subtitle={`${formatCurrency(kpis.totalAmount)} total`}
        icon="heroicons:banknotes"
        color="blue"
      />
      <StatCard
        title="Active Loans"
        value={kpis.activeLoans}
        subtitle={`${formatCurrency(kpis.totalPending)} pending`}
        icon="heroicons:check-circle"
        color="green"
      />
      <StatCard
        title="Pending Applications"
        value={kpis.pendingApplications}
        subtitle="Awaiting approval"
        icon="heroicons:clock"
        color="yellow"
      />
      <StatCard
        title="Completed"
        value={kpis.completedLoans}
        subtitle={`${formatCurrency(kpis.totalCollected)} collected`}
        icon="heroicons:document-check"
        color="purple"
      />
    </div>
  );

  const renderContent = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800">
            {activeTab === 'all' && 'All Loan Records'}
            {activeTab === 'pending' && 'Pending Applications'}
            {activeTab === 'active' && 'Active Loans'}
            {activeTab === 'completed' && 'Completed Loans'}
          </h5>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={() => openModal('application')}
            >
              <Icon icon="heroicons:plus" className="w-4 h-4" />
              Apply for Loan
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
              placeholder="Search by employee, ID, or loan ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            value={loanTypeFilter}
            onChange={(e) => {
              setLoanTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Loan Types</option>
            {loanTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={exportToCSV}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export
          </button>
        </div>

        {paginatedData.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="heroicons:banknotes" className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h5 className="text-slate-600 font-medium text-lg">No loan records found</h5>
            <p className="text-slate-400 text-sm">Try adjusting your search or apply for a new loan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600" onClick={() => handleSort('employeeName')} style={{ cursor: 'pointer' }}>
                    <div className="flex items-center gap-1">
                      Employee
                      <Icon icon={`heroicons:chevron-${sortConfig.key === 'employeeName' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Loan Type</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600" onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                    <div className="flex items-center justify-end gap-1">
                      Amount
                      <Icon icon={`heroicons:chevron-${sortConfig.key === 'amount' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Application</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">EMI</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map(loan => (
                  <tr key={loan.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-800">{loan.employeeName}</div>
                      <div className="text-xs text-slate-500">{loan.employeeId}</div>
                      <div className="text-xs text-slate-400">{loan.department}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="mb-1">{getLoanTypeBadge(loan.loanType)}</div>
                      <div className="text-xs text-slate-500">{loan.interestRate}% interest</div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="font-medium text-slate-800">{formatCurrency(loan.amount)}</div>
                      <div className="text-xs text-slate-500">Paid: {formatCurrency(loan.amountPaid)}</div>
                      <div className="text-xs text-emerald-600">Pending: {formatCurrency(loan.amountPending)}</div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {getStatusBadge(loan.status)}
                      {loan.nextDueDate && loan.nextDueDate !== 'N/A' && (
                        <div className="text-xs text-slate-500 mt-1">Due: {formatDate(loan.nextDueDate)}</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {getApplicationStatusBadge(loan.applicationStatus)}
                      <div className="text-xs text-slate-500 mt-1">{formatDate(loan.applicationDate)}</div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="font-medium text-slate-800">{formatCurrency(loan.monthlyEMI)}</div>
                      <div className="text-xs text-slate-500">{loan.tenureMonths} months</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center justify-center gap-1">
                        <button
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          onClick={() => openModal('details', loan)}
                          title="View Details"
                        >
                          <Icon icon="heroicons:eye" className="w-4 h-4" />
                        </button>

                        {loan.status === 'Active' && (
                          <button
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                            onClick={() => openModal('payment', loan)}
                            title="Make Payment"
                          >
                            <Icon icon="heroicons:currency-rupee" className="w-4 h-4" />
                          </button>
                        )}

                        {(loan.applicationStatus === 'submitted' || loan.applicationStatus === 'under_review') && (
                          <>
                            {loan.approvalWorkflow?.find(w => w.status === 'pending')?.level === 'supervisor' && (
                              <button
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                onClick={() => handleApproveLoan(loan, 'supervisor')}
                                title="Approve"
                              >
                                <Icon icon="heroicons:check" className="w-4 h-4" />
                              </button>
                            )}
                            {loan.approvalWorkflow?.find(w => w.status === 'pending')?.level === 'hr' && (
                              <button
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                onClick={() => handleApproveLoan(loan, 'hr')}
                                title="Approve"
                              >
                                <Icon icon="heroicons:check" className="w-4 h-4" />
                              </button>
                            )}
                            {loan.approvalWorkflow?.find(w => w.status === 'pending')?.level === 'finance' && (
                              <button
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                onClick={() => handleApproveLoan(loan, 'finance')}
                                title="Approve"
                              >
                                <Icon icon="heroicons:check" className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              onClick={() => {
                                const pendingLevel = loan.approvalWorkflow?.find(w => w.status === 'pending')?.level || 'supervisor';
                                handleRejectLoan(loan, pendingLevel);
                              }}
                              title="Reject"
                            >
                              <Icon icon="heroicons:x-mark" className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {loan.applicationStatus === 'approved' && loan.disbursement?.status !== 'completed' && (
                          <button
                            className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition"
                            onClick={() => openModal('disbursement', loan)}
                            title="Disburse"
                          >
                            <Icon icon="heroicons:arrow-up-tray" className="w-4 h-4" />
                          </button>
                        )}

                        {loan.status === 'Active' && (
                          <>
                            <button
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                              onClick={() => openModal('prepayment', loan)}
                              title="Prepayment"
                            >
                              <Icon icon="heroicons:forward" className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              onClick={() => openModal('foreclosure', loan)}
                              title="Foreclosure"
                            >
                              <Icon icon="heroicons:lock-closed" className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {loan.status === 'Completed' && loan.documents?.certificate?.generated && (
                          <button
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition"
                            onClick={() => openModal('certificate', loan)}
                            title="View Certificate"
                          >
                            <Icon icon="heroicons:document-text" className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                          onClick={() => openModal('edit', loan)}
                          title="Edit"
                        >
                          <Icon icon="heroicons:pencil" className="w-4 h-4" />
                        </button>

                        <button
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          onClick={() => openModal('delete', loan)}
                          title="Delete"
                        >
                          <Icon icon="heroicons:trash" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} loans
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
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

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
            <Icon icon="heroicons:banknotes" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Advances & Loan Management</h1>
            <p className="text-sm text-slate-500">Manage employee loans, advances, EMI schedules, and repayment tracking.</p>
          </div>
        </div>
      </div>

      {renderStats()}

      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
        {[
          { id: 'all', label: 'All Loans', icon: 'heroicons:banknotes' },
          { id: 'pending', label: 'Pending', icon: 'heroicons:clock' },
          { id: 'active', label: 'Active', icon: 'heroicons:check-circle' },
          { id: 'completed', label: 'Completed', icon: 'heroicons:document-check' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon icon={tab.icon} className="w-4 h-4" />
            {tab.label}
            {tab.id === 'pending' && kpis.pendingApplications > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-rose-500 text-white rounded-full">
                {kpis.pendingApplications}
              </span>
            )}
            {tab.id === 'active' && kpis.activeLoans > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-blue-500 text-white rounded-full">
                {kpis.activeLoans}
              </span>
            )}
            {tab.id === 'completed' && kpis.completedLoans > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-emerald-500 text-white rounded-full">
                {kpis.completedLoans}
              </span>
            )}
          </button>
        ))}
      </div>

      {renderContent()}

      <LoanDetailsModal
        isOpen={modalState.isOpen && modalState.type === 'details'}
        onClose={closeModal}
        loan={modalState.data}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
        getLoanTypeBadge={getLoanTypeBadge}
        getApplicationStatusBadge={getApplicationStatusBadge}
      />

      <LoanApplicationModal
        isOpen={modalState.isOpen && modalState.type === 'application'}
        onClose={closeModal}
        onSubmit={handleApplyForLoan}
        loanTypes={loanTypes}
        formatCurrency={formatCurrency}
        calculateEMI={calculateEMI}
      />

      <EditLoanModal
        isOpen={modalState.isOpen && modalState.type === 'edit'}
        onClose={closeModal}
        onSubmit={handleUpdateLoan}
        loan={modalState.data}
        loanTypes={loanTypes}
        formatCurrency={formatCurrency}
      />

      <PaymentModal
        isOpen={modalState.isOpen && modalState.type === 'payment'}
        onClose={closeModal}
        onSubmit={handleProcessPayment}
        loan={modalState.data}
        formatCurrency={formatCurrency}
      />

      <DisbursementModal
        isOpen={modalState.isOpen && modalState.type === 'disbursement'}
        onClose={closeModal}
        onSubmit={handleProcessDisbursement}
        loan={modalState.data}
        formatCurrency={formatCurrency}
      />

      <PrepaymentModal
        isOpen={modalState.isOpen && modalState.type === 'prepayment'}
        onClose={closeModal}
        onSubmit={handlePrepayment}
        loan={modalState.data}
        formatCurrency={formatCurrency}
      />

      <ForeclosureModal
        isOpen={modalState.isOpen && modalState.type === 'foreclosure'}
        onClose={closeModal}
        onSubmit={handleForeclosure}
        loan={modalState.data}
        formatCurrency={formatCurrency}
      />

      <CertificateModal
        isOpen={modalState.isOpen && modalState.type === 'certificate'}
        onClose={closeModal}
        loan={modalState.data}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        onGenerateCertificate={handleGenerateCertificate}
      />

      <DeleteConfirmationModal
        isOpen={modalState.isOpen && modalState.type === 'delete'}
        onClose={closeModal}
        onConfirm={handleDeleteLoan}
        loan={modalState.data}
        formatCurrency={formatCurrency}
        getStatusBadge={getStatusBadge}
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

export default LoansAdvances;