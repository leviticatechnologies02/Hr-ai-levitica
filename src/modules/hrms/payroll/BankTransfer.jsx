import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import GeneratePaymentModal from '../modal/GeneratePaymentModal';
import PaymentDetailsModal from '../modal/PaymentDetailsModal';
import UploadAcknowledgementModal from '../modal/UploadAcknowledgementModal';
import AnalyticsModal from '../modal/AnalyticsModal';
import SettingsModal from '../modal/SettingsModal';
import { payrollAPI, employeeAPI } from '../../../shared/utils/api';
import ReconciliationModal from '../modal/ReconciliationModal';
import ConfirmModal from '../modal/ConfirmModal';

const BankTransfer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bankFilter, setBankFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayments, setSelectedPayments] = useState(new Set());
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [showAllPending, setShowAllPending] = useState(false);

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const itemsPerPage = 10;

  const [settings, setSettings] = useState({
    autoEncryption: true,
    defaultPaymentType: 'NEFT',
    notificationEnabled: true,
    autoReconciliation: false,
    backupEnabled: true,
    retentionPeriod: '90'
  });

  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    amountFrom: '',
    amountTo: '',
    employeeCountFrom: '',
    employeeCountTo: '',
    paymentMethod: 'All'
  });

  const banks = [
    { id: 1, name: 'State Bank of India', code: 'SBI001', format: 'NEFT', supportedTypes: ['NEFT', 'RTGS'] },
    { id: 2, name: 'HDFC Bank', code: 'HDFC002', format: 'CSV', supportedTypes: ['NEFT', 'RTGS', 'IMPS'] },
    { id: 3, name: 'ICICI Bank', code: 'ICICI003', format: 'XML', supportedTypes: ['NEFT', 'RTGS'] },
    { id: 4, name: 'Axis Bank', code: 'AXIS004', format: 'TXT', supportedTypes: ['NEFT', 'IMPS'] },
    { id: 5, name: 'Kotak Mahindra Bank', code: 'KOTAK005', format: 'CSV', supportedTypes: ['NEFT', 'RTGS', 'IMPS'] },
    { id: 6, name: 'Punjab National Bank', code: 'PNB006', format: 'NEFT', supportedTypes: ['NEFT'] }
  ];

  const paymentTypes = [
    { id: 'NEFT', name: 'NEFT', description: 'Next day settlement', cutoffTime: '7:00 PM' },
    { id: 'RTGS', name: 'RTGS', description: 'Real-time gross settlement', minAmount: '₹2,00,000', cutoffTime: '3:30 PM' },
    { id: 'IMPS', name: 'IMPS', description: 'Immediate payment service', maxAmount: '₹2,00,000', cutoffTime: '24x7' }
  ];

  const [employees, setEmployees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [reconciliationData, setReconciliationData] = useState([]);

  // Backend PaymentFileResponse -> local UI shape used throughout this file.
  const mapPaymentFile = (f) => ({
    id: f.id,
    fileName: f.file_name,
    bank: f.bank_name,
    paymentType: f.payment_type,
    status: f.status,
    totalAmount: Number(f.total_amount) || 0,
    totalEmployees: f.total_employees,
    generatedDate: f.generated_date ? f.generated_date.split('T')[0] : '',
    processedDate: f.processed_date ? f.processed_date.split('T')[0] : '',
    referenceNumber: f.reference_number,
    retryCount: f.failed_count || 0,
  });

  // Backend PendingPaymentResponse -> local UI shape. NOTE: there is no
  // ifsc_code field on PendingPaymentResponse at all — that only lives on
  // BankTransferResponse — so it stays blank here rather than guessed.
  const mapPendingPayment = (p) => ({
    id: p.id,
    employeeName: p.employee_name,
    employeeCode: p.employee_code,
    bank: p.bank_name,
    accountNumber: p.bank_account,
    ifscCode: '',
    amount: Number(p.amount) || 0,
    reason: p.failure_reason,
    daysPending: p.days_pending,
    retryCount: p.retry_count,
    status: p.is_resolved ? 'Resolved' : 'Pending',
  });

  const mapReconciliation = (r) => ({
    id: r.id,
    bank: r.bank_name,
    totalAmount: Number(r.total_amount) || 0,
    matchedCount: r.matched_count,
    unmatchedCount: r.unmatched_count,
    pendingCount: r.pending_count,
    successRate: r.success_rate,
    isVerified: r.is_verified,
    statementFileName: r.statement_file_name,
    runAt: r.run_at ? r.run_at.split('T')[0] : '',
  });

  const loadBankTransferData = () => {
    Promise.all([
      payrollAPI.listPaymentFiles().catch((err) => { console.error('Failed to load payment files:', err); return []; }),
      payrollAPI.listPendingPayments().catch((err) => { console.error('Failed to load pending payments:', err); return []; }),
      payrollAPI.listReconciliations().catch((err) => { console.error('Failed to load reconciliations:', err); return []; }),
      employeeAPI.list().catch((err) => { console.error('Failed to load employees:', err); return []; }),
    ]).then(([filesData, pendingData, reconData, employeesData]) => {
      setPayments((Array.isArray(filesData) ? filesData : []).map(mapPaymentFile));
      setPendingPayments((Array.isArray(pendingData) ? pendingData : []).map(mapPendingPayment));
      setReconciliationData((Array.isArray(reconData) ? reconData : []).map(mapReconciliation));
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
    });

    payrollAPI.getBankTransferSettings()
      .then((s) => {
        if (!s) return;
        setSettings((prev) => ({
          ...prev,
          autoEncryption: s.auto_file_encryption ?? prev.autoEncryption,
          notificationEnabled: s.payment_notifications ?? prev.notificationEnabled,
          autoReconciliation: s.auto_reconciliation ?? prev.autoReconciliation,
          backupEnabled: s.auto_backup ?? prev.backupEnabled,
          retentionPeriod: s.data_retention_period != null ? String(s.data_retention_period) : prev.retentionPeriod,
          defaultPaymentType: s.default_payment_type || prev.defaultPaymentType,
        }));
      })
      .catch((err) => console.error('Failed to load bank transfer settings:', err));
  };

  useEffect(() => {
    loadBankTransferData();
  }, []);

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

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (typeof amount === 'string') {
      amount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
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
      'Generated': 'bg-blue-50 text-blue-700 border border-blue-200',
      'In Progress': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Processed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Failed': 'bg-rose-50 text-rose-700 border border-rose-200',
      'Partially Processed': 'bg-cyan-50 text-cyan-700 border border-cyan-200'
    };

    const icons = {
      'Generated': 'heroicons:document-text',
      'In Progress': 'heroicons:clock',
      'Processed': 'heroicons:check-circle',
      'Failed': 'heroicons:x-circle',
      'Partially Processed': 'heroicons:exclamation-circle'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        <Icon icon={icons[status] || 'heroicons:document-text'} className="w-3 h-3" />
        {status || 'N/A'}
      </span>
    );
  };

  const getBankBadge = (bank) => {
    const colors = {
      'State Bank of India': 'bg-blue-50 text-blue-700 border border-blue-200',
      'HDFC Bank': 'bg-cyan-50 text-cyan-700 border border-cyan-200',
      'ICICI Bank': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Axis Bank': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Kotak Mahindra Bank': 'bg-rose-50 text-rose-700 border border-rose-200',
      'Punjab National Bank': 'bg-purple-50 text-purple-700 border border-purple-200',
      'All Banks': 'bg-slate-50 text-slate-700 border border-slate-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[bank] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {bank || 'N/A'}
      </span>
    );
  };

  const kpis = useMemo(() => {
    const totalPayments = payments.length;
    const processedPayments = payments.filter(p => p.status === 'Processed').length;
    const failedPayments = payments.filter(p => p.status === 'Failed').length;
    const totalAmount = payments.reduce((sum, p) => {
      const amount = parseFloat(p.totalAmount?.replace(/[^0-9.]/g, '') || 0);
      return sum + amount;
    }, 0);
    const totalEmployees = employees.length;

    return {
      totalPayments,
      processedPayments,
      failedPayments,
      pendingPayments: pendingPayments.length,
      totalAmount,
      totalEmployees
    };
  }, [payments, employees, pendingPayments]);

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch =
        (payment.fileName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (payment.bank || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (payment.referenceNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBank = bankFilter === 'All' || payment.bank === bankFilter;
      const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;

      const matchesDate = !advancedFilters.dateFrom ||
        (payment.generatedDate >= advancedFilters.dateFrom &&
          (!advancedFilters.dateTo || payment.generatedDate <= advancedFilters.dateTo));

      const matchesPaymentMethod = advancedFilters.paymentMethod === 'All' ||
        payment.paymentMethod === advancedFilters.paymentMethod;

      return matchesSearch && matchesBank && matchesStatus && matchesDate && matchesPaymentMethod;
    });
  }, [payments, searchQuery, bankFilter, statusFilter, advancedFilters]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const currentPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      showNotification('Please select at least one payment file', 'warning');
      setBulkAction('');
      return;
    }

    if (action === 'export') {
      const selected = payments.filter(p => selectedPayments.has(p.id));
      const headers = ['File Name', 'Bank', 'Payment Type', 'Status', 'Total Amount', 'Employees', 'Generated Date', 'Reference Number'];
      const data = selected.map(p => [
        p.fileName, p.bank, p.paymentType, p.status,
        p.totalAmount, p.totalEmployees, p.generatedDate, p.referenceNumber
      ]);
      const csvContent = [headers, ...data].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selected-payments-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification(`Exported ${selected.length} payment files`, 'success');
    } else if (action === 'delete') {
      if (window.confirm(`Delete ${selectedPayments.size} selected payment file(s)?`)) {
        const idsToDelete = [...selectedPayments];
        Promise.all(idsToDelete.map(id => payrollAPI.deletePaymentFile(id)))
          .then(() => {
            setPayments(payments.filter(p => !selectedPayments.has(p.id)));
            setSelectedPayments(new Set());
            showNotification(`Deleted ${selectedPayments.size} payment file(s)`, 'success');
          })
          .catch((err) => {
            console.error('Error deleting payment files:', err);
            showNotification(err.message || 'Error deleting payment file(s)', 'error');
          });
      }
    } else if (action === 'mark_processed') {
      const idsToUpdate = [...selectedPayments];
      Promise.all(idsToUpdate.map(id => payrollAPI.updatePaymentFile(id, { status: 'Processed', processed_date: new Date().toISOString() })))
        .then(() => {
          setPayments(payments.map(p =>
            selectedPayments.has(p.id)
              ? { ...p, status: 'Processed', processedDate: new Date().toISOString().split('T')[0] }
              : p
          ));
          setSelectedPayments(new Set());
          showNotification('Marked selected payments as processed', 'success');
        })
        .catch((err) => {
          console.error('Error marking payments processed:', err);
          showNotification(err.message || 'Error updating payment file(s)', 'error');
        });
    }

    setBulkAction('');
  };

  const handleExportReport = (format = 'csv') => {
    if (filteredPayments.length === 0) {
      showNotification('No data to export', 'warning');
      return;
    }

    const headers = ['File Name', 'Bank', 'Payment Type', 'Status', 'Total Amount', 'Employees', 'Generated Date', 'Reference Number'];
    const data = filteredPayments.map(p => [
      p.fileName, p.bank, p.paymentType, p.status,
      p.totalAmount, p.totalEmployees, p.generatedDate, p.referenceNumber
    ]);

    if (format === 'csv') {
      const csvContent = [headers, ...data].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-report-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('Report exported successfully', 'success');
    }
  };

  const downloadAllPendingPayments = () => {
    if (pendingPayments.length === 0) {
      showNotification('No pending payments to download', 'warning');
      return;
    }

    const headers = ['Employee Name', 'Employee Code', 'Amount', 'Bank', 'IFSC Code', 'Account Number', 'Days Pending', 'Reason', 'Status'];
    const data = pendingPayments.map(p => [
      p.employeeName, p.employeeCode, p.amount, p.bank,
      p.ifscCode, p.accountNumber, p.daysPending, p.reason, p.status
    ]);

    const csvContent = [headers, ...data].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-payments-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`Downloaded ${pendingPayments.length} pending payments`, 'success');
  };

  const handleReconcile = () => {
    payrollAPI.runReconciliation({})
      .then((result) => {
        if (result) {
          setReconciliationData((prev) => [mapReconciliation(result), ...prev]);
        }
        showNotification('Reconciliation completed successfully!', 'success');
      })
      .catch((err) => {
        console.error('Error running reconciliation:', err);
        showNotification(err.message || 'Error running reconciliation', 'error');
      });
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Processed"
        value={formatCurrency(kpis.totalAmount)}
        subtitle={`${kpis.totalPayments} payments`}
        icon="heroicons:banknotes"
        color="blue"
      />
      <StatCard
        title="Successful"
        value={kpis.processedPayments}
        subtitle="Transactions"
        icon="heroicons:check-circle"
        color="green"
      />
      <StatCard
        title="Pending"
        value={kpis.pendingPayments}
        subtitle="Require action"
        icon="heroicons:clock"
        color="yellow"
      />
      <StatCard
        title="Failed"
        value={kpis.failedPayments}
        subtitle="Need retry"
        icon="heroicons:x-circle"
        color="red"
      />
    </div>
  );

  const renderPaymentsTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:document-text" className="w-5 h-5 text-blue-500" />
            Payment Files ({filteredPayments.length})
          </h5>
          <div className="flex flex-wrap gap-2">
            <select
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={bulkAction}
              onChange={(e) => {
                setBulkAction(e.target.value);
                if (e.target.value) handleBulkAction(e.target.value);
              }}
            >
              <option value="">Bulk Actions</option>
              <option value="export">Export Selected</option>
              <option value="delete">Delete Selected</option>
              <option value="mark_processed">Mark as Processed</option>
            </select>
            <button
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={() => openModal('generate')}
            >
              <Icon icon="heroicons:plus" className="w-4 h-4" />
              Generate File
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
              placeholder="Search by file name, bank, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
          >
            <option value="All">All Banks</option>
            {banks.map(bank => (
              <option key={bank.id} value={bank.name}>{bank.name}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Generated">Generated</option>
            <option value="In Progress">In Progress</option>
            <option value="Processed">Processed</option>
            <option value="Failed">Failed</option>
          </select>
          <button
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Icon icon="heroicons:funnel" className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showAdvancedFilters && (
          <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date From</label>
                <input
                  type="date"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                  value={advancedFilters.dateFrom}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateFrom: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date To</label>
                <input
                  type="date"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                  value={advancedFilters.dateTo}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateTo: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Payment Method</label>
                <select
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                  value={advancedFilters.paymentMethod}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, paymentMethod: e.target.value })}
                >
                  <option value="All">All Methods</option>
                  <option value="Bulk Transfer">Bulk Transfer</option>
                  <option value="Bonus Payment">Bonus Payment</option>
                  <option value="Advance Payment">Advance Payment</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentPayments.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="heroicons:document-text" className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h5 className="text-slate-600 font-medium text-lg">No payment files found</h5>
            <p className="text-slate-400 text-sm">Generate a new payment file to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedPayments.size === filteredPayments.length && filteredPayments.length > 0}
                      onChange={handleSelectAllPayments}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">File Name</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Bank</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Payment Type</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">Amount</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Employees</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedPayments.has(payment.id)}
                        onChange={() => handleSelectPayment(payment.id)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-800">{payment.fileName}</div>
                      <div className="text-xs text-slate-500">{payment.referenceNumber}</div>
                    </td>
                    <td className="px-3 py-2">{getBankBadge(payment.bank)}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-800">{payment.paymentType}</div>
                      <div className="text-xs text-slate-500">{payment.paymentMethod}</div>
                    </td>
                    <td className="px-3 py-2 text-center">{getStatusBadge(payment.status)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-emerald-600">
                      {payment.totalAmount}
                    </td>
                    <td className="px-3 py-2 text-center text-slate-700">{payment.totalEmployees}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          onClick={() => openModal('details', payment)}
                          title="View Details"
                        >
                          <Icon icon="heroicons:eye" className="w-4 h-4" />
                        </button>
                        {payment.status === 'Failed' && (
                          <button
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                            onClick={() => {
                              setPayments(payments.map(p =>
                                p.id === payment.id ? { ...p, status: 'In Progress' } : p
                              ));
                              setTimeout(() => {
                                setPayments(payments.map(p =>
                                  p.id === payment.id ? { ...p, status: 'Processed' } : p
                                ));
                                showNotification('Payment retried successfully', 'success');
                              }, 2000);
                            }}
                            title="Retry"
                          >
                            <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
                          </button>
                        )}
                        {payment.status === 'Processed' && (
                          <button
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                            onClick={() => openModal('upload', payment)}
                            title="Upload Acknowledgement"
                          >
                            <Icon icon="heroicons:arrow-up-tray" className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                          onClick={() => {
                            const blob = new Blob(['Sample payment file content'], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${payment.fileName}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            showNotification('File downloaded', 'success');
                          }}
                          title="Download"
                        >
                          <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
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
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
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

  const renderPendingPayments = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:clock" className="w-5 h-5 text-amber-500" />
            Pending Payments ({pendingPayments.length})
          </h5>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={downloadAllPendingPayments}
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              Download All
            </button>
            <button
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={() => setShowAllPending(!showAllPending)}
            >
              <Icon icon="heroicons:eye" className="w-4 h-4" />
              {showAllPending ? 'Show Less' : 'View All'}
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        {pendingPayments.length === 0 ? (
          <div className="text-center py-8">
            <Icon icon="heroicons:check-circle" className="w-12 h-12 mx-auto text-emerald-300 mb-3" />
            <p className="text-slate-500">No pending payments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingPayments
              .slice(0, showAllPending ? undefined : 3)
              .map(payment => (
                <div key={payment.id} className="border border-slate-200 rounded-xl p-3 hover:bg-slate-50/50 transition">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{payment.employeeName}</span>
                        <span className="text-xs text-slate-500">{payment.employeeCode}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm">
                        <span className="text-slate-600">{payment.bank}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600">Account: {payment.accountNumber}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs">
                        <span className="text-rose-600 flex items-center gap-1">
                          <Icon icon="heroicons:exclamation-circle" className="w-3 h-3" />
                          {payment.reason}
                        </span>
                        <span className="text-slate-500">{payment.daysPending} day(s) pending</span>
                        <span className="text-slate-500">Retries: {payment.retryCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-rose-600">{payment.amount}</div>
                        <div className="text-xs text-slate-500">{getStatusBadge(payment.status)}</div>
                      </div>
                      <button
                        className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                        onClick={() => {
                          setPendingPayments(pendingPayments.map(p =>
                            p.id === payment.id ? { ...p, status: 'Retrying', retryCount: p.retryCount + 1 } : p
                          ));
                          payrollAPI.retryPendingPayment(payment.id)
                            .then(() => {
                              setPendingPayments(prev => prev.filter(p => p.id !== payment.id));
                              showNotification(`Payment for ${payment.employeeName} processed successfully`, 'success');
                            })
                            .catch((err) => {
                              console.error('Error retrying pending payment:', err);
                              setPendingPayments(prev => prev.map(p =>
                                p.id === payment.id ? { ...p, status: 'Pending' } : p
                              ));
                              showNotification(err.message || 'Error retrying payment', 'error');
                            });
                        }}
                        title="Retry"
                      >
                        <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-2">
        <h6 className="font-bold text-sm text-slate-700">Quick Actions</h6>
      </div>
      <div className="p-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={() => handleExportReport('csv')}
          >
            <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
            Export CSV
          </button>
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={() => openModal('reconciliation')}
          >
            <Icon icon="heroicons:check-badge" className="w-4 h-4" />
            Bank Reconciliation
          </button>
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={() => openModal('analytics')}
          >
            <Icon icon="heroicons:chart-bar" className="w-4 h-4" />
            View Analytics
          </button>
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={() => openModal('settings')}
          >
            <Icon icon="heroicons:cog-6-tooth" className="w-4 h-4" />
            Settings
          </button>
        </div>
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
            <h1 className="text-xl font-bold text-slate-900">Bank Transfer & Payment Processing</h1>
            <p className="text-sm text-slate-500">Generate, track, and reconcile payment files for salary disbursement</p>
          </div>
        </div>
      </div>

      {renderStats()}
      {renderQuickActions()}

      <div className="space-y-6">
        {renderPaymentsTable()}
        {renderPendingPayments()}
      </div>

      <GeneratePaymentModal
        isOpen={modalState.isOpen && modalState.type === 'generate'}
        onClose={closeModal}
        onSubmit={(data) => {
          const totalAmount = data.employees.reduce((sum, emp) => {
            const salary = parseFloat(emp.salary?.replace(/[^0-9.]/g, '') || 0);
            return sum + salary;
          }, 0);

          const newPayment = {
            id: payments.length + 1,
            fileName: `SALARY_${new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase()}_${data.bank.code}`,
            bank: data.bank.name,
            paymentType: data.paymentType,
            status: 'Generated',
            totalAmount: formatCurrency(totalAmount),
            totalEmployees: data.employees.length,
            generatedDate: new Date().toISOString().split('T')[0],
            processedDate: 'Pending',
            encrypted: data.encryptionEnabled,
            referenceNumber: `REF${Date.now()}${data.bank.code}`,
            paymentMethod: 'Bulk Transfer',
            includedEmployees: data.employees.map(e => e.id)
          };

          setPayments([newPayment, ...payments]);
          closeModal();
          showNotification(`Payment file generated for ${data.bank.name}`, 'success');
        }}
        banks={banks}
        paymentTypes={paymentTypes}
        employees={employees}
        formatCurrency={formatCurrency}
      />

      <PaymentDetailsModal
        isOpen={modalState.isOpen && modalState.type === 'details'}
        onClose={closeModal}
        payment={modalState.data}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
        getBankBadge={getBankBadge}
        employees={employees}
      />

      <UploadAcknowledgementModal
        isOpen={modalState.isOpen && modalState.type === 'upload'}
        onClose={closeModal}
        onSubmit={(data) => {
          setPayments(payments.map(p =>
            p.id === data.payment.id
              ? { ...p, status: 'Processed', processedDate: new Date().toISOString().split('T')[0] }
              : p
          ));
          closeModal();
          showNotification('Acknowledgement uploaded successfully!', 'success');
        }}
        payment={modalState.data}
      />

      <AnalyticsModal
        isOpen={modalState.isOpen && modalState.type === 'analytics'}
        onClose={closeModal}
        payments={payments}
        formatCurrency={formatCurrency}
      />

      <SettingsModal
        isOpen={modalState.isOpen && modalState.type === 'settings'}
        onClose={closeModal}
        onSaveBankSettings={(data) => {
          setSettings(data);
          closeModal();
          showNotification('Settings saved successfully!', 'success');
        }}
        bankSettings={settings}
        mode="bank"
      />

      <ReconciliationModal
        isOpen={modalState.isOpen && modalState.type === 'reconciliation'}
        onClose={closeModal}
        onReconcile={() => {
          // Run reconciliation logic
          const newData = reconciliationData.map(r => ({
            ...r,
            status: Math.random() > 0.2 ? 'Matched' : 'Unmatched'
          }));
          setReconciliationData(newData);
          toast.success('Reconciliation completed successfully!');
          closeModal();
        }}
        reconciliationData={reconciliationData}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        mode="bank"
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

export default BankTransfer;