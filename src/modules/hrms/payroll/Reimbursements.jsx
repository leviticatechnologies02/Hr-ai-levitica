import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import NewClaimModal from '../modal/NewClaimModal';
import ClaimDetailsModal from '../modal/ClaimDetailsModal';
import EditReimbursementModal from '../modal/EditReimbursementModal';
import ReportsModal from '../modal/ReportsModal';
import { reimbursementAPI, employeeAPI } from '../../../shared/utils/api';

const Reimbursements = () => {
  const [activeTab, setActiveTab] = useState('master');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingReimbursement, setEditingReimbursement] = useState(null);

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const itemsPerPage = 6;

  const [reimbursements, setReimbursements] = useState([]);
  const [claims, setClaims] = useState([]);
  const [employeeBalances, setEmployeeBalances] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Backend status values (PENDING|FINANCE_REVIEW|APPROVED|REJECTED|PAID) ->
  // the Title-Case-with-space convention getStatusBadge/getApprovalBadge use.
  const statusMap = {
    PENDING: 'Pending',
    FINANCE_REVIEW: 'Finance Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    PAID: 'Paid',
  };

  const mapType = (t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    limit: Number(t.limit_amount) || 0,
    frequency: t.frequency,
    taxable: !!t.is_taxable,
    isActive: t.is_active,
  });

  // Backend ClaimListItem is flat (manager_approval_status/finance_approval_status
  // as separate fields); the UI expects nested { managerApproval: {status,...},
  // financeApproval: {status,...} } objects — reshaped here.
  const mapClaim = (c) => ({
    id: c.id,
    employee: c.employee_name,
    employeeId: c.employee_code,
    employeeDbId: c.employee_id,
    type: c.type_name,
    frequency: c.frequency,
    amount: Number(c.claimed_amount) || 0,
    taxAmount: Number(c.tax_amount) || 0,
    netAmount: Number(c.net_amount) || 0,
    date: c.claim_date ? c.claim_date.split('T')[0] : '',
    status: statusMap[c.status] || c.status,
    file: !!c.receipt_filename,
    receiptFile: c.receipt_filename,
    managerApproval: {
      status: statusMap[c.manager_approval_status] || c.manager_approval_status || 'Pending',
      date: c.manager_approved_at ? c.manager_approved_at.split('T')[0] : null,
      approver: c.manager_approved_by,
    },
    financeApproval: {
      status: statusMap[c.finance_approval_status] || c.finance_approval_status || 'Pending',
      date: c.finance_approved_at ? c.finance_approved_at.split('T')[0] : null,
      approver: c.finance_approved_by,
    },
    payrollProcessed: !!c.payroll_processed,
    payrollDate: c.payroll_processed_date ? c.payroll_processed_date.split('T')[0] : null,
  });

  // Backend returns a flat list, one row per employee+type+period —
  // grouped here into the nested { employee, employeeId, balances: { [type]: {...} } }
  // shape the Balances tab expects.
  const mapBalances = (rows) => {
    const grouped = new Map();
    (rows || []).forEach((b) => {
      const key = b.employee_id;
      if (!grouped.has(key)) {
        grouped.set(key, { employeeId: b.employee_code, employee: b.employee_name, balances: {} });
      }
      grouped.get(key).balances[b.type_name] = {
        limit: Number(b.limit_amount) || 0,
        used: Number(b.used_amount) || 0,
        remaining: Number(b.remaining_amount) || 0,
        period: b.period,
      };
    });
    return Array.from(grouped.values());
  };

  const loadReimbursementData = () => {
    Promise.all([
      reimbursementAPI.listTypes().catch((err) => { console.error('Failed to load reimbursement types:', err); return []; }),
      reimbursementAPI.listClaims({ limit: 500 }).catch((err) => { console.error('Failed to load claims:', err); return []; }),
      reimbursementAPI.listBalances().catch((err) => { console.error('Failed to load balances:', err); return []; }),
      employeeAPI.list().catch((err) => { console.error('Failed to load employees:', err); return []; }),
    ]).then(([typesData, claimsData, balancesData, employeesData]) => {
      setReimbursements((Array.isArray(typesData) ? typesData : []).map(mapType));
      setClaims((Array.isArray(claimsData) ? claimsData : []).map(mapClaim));
      setEmployeeBalances(mapBalances(balancesData));
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
    });
  };

  useEffect(() => {
    loadReimbursementData();
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
      draggable: true,
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
    const totalClaims = claims.length;
    const approvedClaims = claims.filter(c => c.status === 'Approved').length;
    const pendingClaims = claims.filter(c => c.status === 'Pending' || c.status === 'Finance Review').length;
    const totalAmount = claims.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalTaxAmount = claims.reduce((sum, c) => sum + (c.taxAmount || 0), 0);
    
    return {
      totalClaims,
      approvedClaims,
      pendingClaims,
      rejectedClaims: claims.filter(c => c.status === 'Rejected').length,
      totalAmount,
      approvedAmount: claims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + (c.amount || 0), 0),
      pendingAmount: claims.filter(c => c.status === 'Pending' || c.status === 'Finance Review').reduce((sum, c) => sum + (c.amount || 0), 0),
      totalTaxAmount
    };
  }, [claims]);

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
      'Approved': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Rejected': 'bg-rose-50 text-rose-700 border border-rose-200',
      'Pending': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Finance Review': 'bg-blue-50 text-blue-700 border border-blue-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status || 'N/A'}
      </span>
    );
  };

  const getApprovalBadge = (status) => {
    const styles = {
      'Approved': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Rejected': 'bg-rose-50 text-rose-700 border border-rose-200',
      'Pending': 'bg-amber-50 text-amber-700 border border-amber-200'
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status || 'Pending'}
      </span>
    );
  };

  const handleSubmitClaim = (data) => {
    const amount = parseFloat(data.amount);
    const selectedReimbursement = reimbursements.find(r => r.name === data.type);

    if (!selectedReimbursement) {
      showNotification('Reimbursement type not found', 'error');
      return;
    }

    if (amount > selectedReimbursement.limit) {
      showNotification(`Claim amount exceeds the limit of ${formatCurrency(selectedReimbursement.limit)}`, 'error');
      return;
    }

    // NewClaimModal only collects free-text employee name/ID, but the
    // backend needs a real numeric employee_id (FK). Resolve it against the
    // real employee directory rather than sending an invalid/fabricated id —
    // if nothing matches, fail clearly instead of corrupting the claim.
    const matchedEmployee = employees.find(
      (e) => e.employeeId === data.employeeId || e.id === Number(data.employeeId) || e.name === data.employee
    );
    if (!matchedEmployee) {
      showNotification(`No employee found matching "${data.employee}" / "${data.employeeId}". Please check the employee ID.`, 'error');
      return;
    }

    reimbursementAPI.submitClaim({
      employee_id: matchedEmployee.id,
      employee_code: matchedEmployee.employeeId || data.employeeId,
      employee_name: matchedEmployee.name || data.employee,
      type_id: selectedReimbursement.id,
      claimed_amount: amount,
      description: data.description || undefined,
      receipt_filename: data.receipt?.name || undefined,
    })
      .then(() => {
        closeModal();
        showNotification(`Claim submitted successfully for ${data.employee}!`, 'success');
        loadReimbursementData();
      })
      .catch((err) => {
        console.error('Error submitting claim:', err);
        showNotification(err.message || 'Error submitting claim', 'error');
      });
  };

  const handleManagerApproval = (id, action) => {
    const apiCallFn = action === 'Approved' ? reimbursementAPI.managerApprove : reimbursementAPI.managerReject;
    apiCallFn(id, { approved_by: 'Current Manager' })
      .then(() => {
        showNotification(`Claim ${action.toLowerCase()} by manager.`, action === 'Approved' ? 'success' : 'error');
        loadReimbursementData();
      })
      .catch((err) => {
        console.error('Error processing manager approval:', err);
        showNotification(err.message || 'Error processing approval', 'error');
      });
  };

  const handleFinanceApproval = (id, action) => {
    const apiCallFn = action === 'Approved' ? reimbursementAPI.financeApprove : reimbursementAPI.financeReject;
    apiCallFn(id, { approved_by: 'Finance Manager' })
      .then(() => {
        showNotification(`Claim ${action.toLowerCase()} by finance.`, action === 'Approved' ? 'success' : 'error');
        loadReimbursementData();
      })
      .catch((err) => {
        console.error('Error processing finance approval:', err);
        showNotification(err.message || 'Error processing approval', 'error');
      });
  };

  const handleSaveReimbursement = (data) => {
    const payload = {
      name: data.name,
      limit_amount: parseFloat(data.limit),
      is_taxable: data.taxable === 'true' || data.taxable === true,
      frequency: data.frequency,
      description: data.description || undefined,
      category: data.category,
    };

    const request = editingReimbursement
      ? reimbursementAPI.updateType(editingReimbursement.id, payload)
      : reimbursementAPI.createType(payload);

    request
      .then(() => {
        showNotification(`Reimbursement type ${editingReimbursement ? 'updated' : 'added'} successfully!`, 'success');
        loadReimbursementData();
      })
      .catch((err) => {
        console.error('Error saving reimbursement type:', err);
        showNotification(err.message || 'Error saving reimbursement type', 'error');
      });

    closeModal();
    setEditingReimbursement(null);
  };

  const handleDownloadFile = async (claim) => {
    if (!claim.file) {
      showNotification('No receipt uploaded for this claim.', 'error');
      return;
    }

    try {
      const blob = await reimbursementAPI.downloadReceipt(claim.id);
      if (!blob) {
        showNotification('Receipt not found on server.', 'error');
        return;
      }
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
      showNotification(error.message || 'Unable to download file. Please try again.', 'error');
    }
  };

  const handleExportCSV = () => {
    const dataToExport = filteredClaims.length > 0 ? filteredClaims : claims;
    
    if (dataToExport.length === 0) {
      showNotification('No claims data to export!', 'warning');
      return;
    }

    const headers = [
      'ID', 'Employee', 'Employee ID', 'Type', 'Amount', 'Tax', 
      'Net Amount', 'Date', 'Status', 'Manager Approval', 
      'Finance Approval', 'Payroll Status', 'Description'
    ];
    
    const csvRows = [
      headers.join(','),
      ...dataToExport.map(item => [
        item.id,
        `"${item.employee || ''}"`,
        `"${item.employeeId || ''}"`,
        `"${item.type || ''}"`,
        item.amount || 0,
        item.taxAmount || 0,
        item.netAmount || item.amount || 0,
        `"${item.date || ''}"`,
        `"${item.status || ''}"`,
        `"${item.managerApproval?.status || 'Pending'}"`,
        `"${item.financeApproval?.status || 'Pending'}"`,
        item.payrollProcessed ? 'Processed' : 'Pending',
        `"${(item.description || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `claims-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`Exported ${dataToExport.length} claims to CSV file!`, 'success');
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = (claim.employee || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (claim.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (claim.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
    const matchesType = filterType === 'all' || claim.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const paginatedClaims = filteredClaims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Claims"
        value={kpis.totalClaims}
        subtitle={`${formatCurrency(kpis.totalAmount)} total`}
        icon="heroicons:document-text"
        color="blue"
      />
      <StatCard
        title="Approved"
        value={kpis.approvedClaims}
        subtitle={`${formatCurrency(kpis.approvedAmount)} approved`}
        icon="heroicons:check-circle"
        color="green"
      />
      <StatCard
        title="Pending"
        value={kpis.pendingClaims}
        subtitle={`${formatCurrency(kpis.pendingAmount)} pending`}
        icon="heroicons:clock"
        color="yellow"
      />
      <StatCard
        title="Tax Amount"
        value={formatCurrency(kpis.totalTaxAmount)}
        subtitle="Total taxable"
        icon="heroicons:currency-dollar"
        color="red"
      />
    </div>
  );

  const renderMasterTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800">Reimbursement Types Master</h5>
          <button
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
            onClick={() => {
              setEditingReimbursement(null);
              openModal('edit');
            }}
          >
            <Icon icon="heroicons:plus" className="w-4 h-4" />
            Add Type
          </button>
        </div>
      </div>
      <div className="p-4">
        {reimbursements.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="heroicons:layers" className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h5 className="text-slate-600 font-medium text-lg">No reimbursement types</h5>
            <p className="text-slate-400 text-sm">Add your first reimbursement type to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Component</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Category</th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-600">Limit</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Frequency</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Taxable</th>
                  <th className="px-4 py-2 text-center font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reimbursements.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.limit)}</td>
                    <td className="px-4 py-3">{item.frequency}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${item.taxable ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {item.taxable ? 'Taxable' : 'Non-Taxable'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                        onClick={() => {
                          setEditingReimbursement(item);
                          openModal('edit');
                        }}
                        title="Edit"
                      >
                        <Icon icon="heroicons:pencil" className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderClaimsTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800">Claims</h5>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={() => openModal('new')}
            >
              <Icon icon="heroicons:plus" className="w-4 h-4" />
              New Claim
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
              placeholder="Search by employee, type, or ID..."
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
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Finance Review">Finance Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Types</option>
            {reimbursements.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
          <button
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={handleExportCSV}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export
          </button>
        </div>

        {filteredClaims.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="heroicons:document-text" className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h5 className="text-slate-600 font-medium text-lg">No claims found</h5>
            <p className="text-slate-400 text-sm">Try adjusting your search or create a new claim.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Type</th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-600">Amount</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Date</th>
                  <th className="px-4 py-2 text-center font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-2 text-center font-semibold text-slate-600">Approvals</th>
                  <th className="px-4 py-2 text-center font-semibold text-slate-600">Payroll</th>
                  <th className="px-4 py-2 text-center font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedClaims.map(claim => (
                  <tr key={claim.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{claim.employee}</div>
                      <div className="text-xs text-slate-500">{claim.employeeId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{claim.type}</div>
                      <div className="text-xs text-slate-500">{claim.frequency}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(claim.amount)}</td>
                    <td className="px-4 py-3">{claim.date}</td>
                    <td className="px-4 py-3 text-center">{getStatusBadge(claim.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Manager:</span>
                          {getApprovalBadge(claim.managerApproval?.status)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Finance:</span>
                          {getApprovalBadge(claim.financeApproval?.status)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {claim.payrollProcessed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Icon icon="heroicons:check-circle" className="w-3 h-3" />
                          Processed
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          onClick={() => openModal('details', claim)}
                          title="View Details"
                        >
                          <Icon icon="heroicons:eye" className="w-4 h-4" />
                        </button>
                        
                        {(claim.status === 'Pending' && claim.managerApproval?.status === 'Pending') && (
                          <>
                            <button
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                              onClick={() => handleManagerApproval(claim.id, 'Approved')}
                              title="Approve (Manager)"
                            >
                              <Icon icon="heroicons:check" className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              onClick={() => handleManagerApproval(claim.id, 'Rejected')}
                              title="Reject (Manager)"
                            >
                              <Icon icon="heroicons:x-mark" className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {(claim.status === 'Finance Review' && claim.managerApproval?.status === 'Approved' && claim.financeApproval?.status === 'Pending') && (
                          <>
                            <button
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                              onClick={() => handleFinanceApproval(claim.id, 'Approved')}
                              title="Approve (Finance)"
                            >
                              <Icon icon="heroicons:check" className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                              onClick={() => handleFinanceApproval(claim.id, 'Rejected')}
                              title="Reject (Finance)"
                            >
                              <Icon icon="heroicons:x-mark" className="w-4 h-4" />
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
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredClaims.length)} of {filteredClaims.length} claims
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

  const renderBalancesTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <h5 className="font-bold text-slate-800">Employee Reimbursement Balances</h5>
      </div>
      <div className="p-4">
        {employeeBalances.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="heroicons:currency-dollar" className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h5 className="text-slate-600 font-medium text-lg">No employee balances</h5>
            <p className="text-slate-400 text-sm">Employee balances will appear here when claims are processed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Reimbursement Type</th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-600">Limit</th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-600">Used</th>
                  <th className="px-4 py-2 text-right font-semibold text-slate-600">Remaining</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Period</th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employeeBalances.map(emp => (
                  Object.entries(emp.balances).map(([type, balance], index) => (
                    <tr key={`${emp.employeeId}-${type}`} className="hover:bg-slate-50/50">
                      {index === 0 && (
                        <td className="px-4 py-3 align-middle" rowSpan={Object.keys(emp.balances).length}>
                          <div className="font-medium text-slate-800">{emp.employee}</div>
                          <div className="text-xs text-slate-500">{emp.employeeId}</div>
                        </td>
                      )}
                      <td className="px-4 py-3">{type}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(balance.limit)}</td>
                      <td className="px-4 py-3 text-right text-rose-600 font-medium">{formatCurrency(balance.used)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-medium">{formatCurrency(balance.remaining)}</td>
                      <td className="px-4 py-3">{balance.period}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  balance.remaining < balance.limit * 0.2 ? 'bg-rose-500' :
                                  balance.remaining < balance.limit * 0.5 ? 'bg-amber-500' :
                                  'bg-emerald-500'
                                }`}
                                style={{ width: `${(balance.remaining / balance.limit) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs font-medium text-slate-600 min-w-[40px]">
                            {((balance.remaining / balance.limit) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800">Reimbursement Reports & Analytics</h5>
          <button
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
            onClick={() => openModal('reports')}
          >
            <Icon icon="heroicons:chart-bar" className="w-4 h-4" />
            View Reports
          </button>
        </div>
      </div>
      <div className="p-4">
        {claims.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="heroicons:chart-bar" className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h5 className="text-slate-600 font-medium text-lg">No report data available</h5>
            <p className="text-slate-400 text-sm">Reports will appear here once claims are submitted.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-sm text-blue-600 font-medium">Total Claims</p>
                <p className="text-2xl font-bold text-blue-700">{kpis.totalClaims}</p>
                <p className="text-xs text-blue-500">{formatCurrency(kpis.totalAmount)}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-sm text-emerald-600 font-medium">Approved</p>
                <p className="text-2xl font-bold text-emerald-700">{kpis.approvedClaims}</p>
                <p className="text-xs text-emerald-500">{formatCurrency(kpis.approvedAmount)}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-sm text-amber-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-700">{kpis.pendingClaims}</p>
                <p className="text-xs text-amber-500">{formatCurrency(kpis.pendingAmount)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <h6 className="font-bold text-sm text-slate-700">Claims by Type</h6>
                </div>
                <div className="p-4">
                  <div className="space-y-2 text-sm">
                    {reimbursements.slice(0, 5).map(r => {
                      const typeClaims = claims.filter(c => c.type === r.name);
                      const total = typeClaims.reduce((sum, c) => sum + (c.amount || 0), 0);
                      return (
                        <div key={r.id} className="flex justify-between items-center">
                          <span className="text-slate-600">{r.name}</span>
                          <span className="font-medium text-slate-800">
                            {typeClaims.length} claims - {formatCurrency(total)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <h6 className="font-bold text-sm text-slate-700">Tax Analysis</h6>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Taxable Amount:</span>
                    <span className="font-medium text-slate-800">
                      {formatCurrency(claims.filter(c => {
                        const r = reimbursements.find(re => re.name === c.type);
                        return r && r.taxable;
                      }).reduce((sum, c) => sum + (c.amount || 0), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Tax Amount:</span>
                    <span className="font-medium text-rose-600">{formatCurrency(kpis.totalTaxAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Non-Taxable:</span>
                    <span className="font-medium text-emerald-600">
                      {formatCurrency(kpis.totalAmount - claims.filter(c => {
                        const r = reimbursements.find(re => re.name === c.type);
                        return r && r.taxable;
                      }).reduce((sum, c) => sum + (c.amount || 0), 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'master':
        return renderMasterTab();
      case 'claims':
        return renderClaimsTab();
      case 'balances':
        return renderBalancesTab();
      case 'reports':
        return renderReportsTab();
      default:
        return renderClaimsTab();
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
            <Icon icon="heroicons:banknotes" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Reimbursement Management</h1>
            <p className="text-sm text-slate-500">Employee reimbursement workflow and tracking</p>
          </div>
        </div>
      </div>

      {renderStats()}

      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
        {[
          { id: 'master', label: 'Master', icon: 'heroicons:layers' },
          { id: 'claims', label: 'Claims', icon: 'heroicons:users' },
          { id: 'balances', label: 'Balances', icon: 'heroicons:currency-dollar' },
          { id: 'reports', label: 'Reports', icon: 'heroicons:chart-bar' },
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
          </button>
        ))}
      </div>

      {renderContent()}

      <NewClaimModal
        isOpen={modalState.isOpen && modalState.type === 'new'}
        onClose={closeModal}
        onSubmit={handleSubmitClaim}
        reimbursements={reimbursements}
        employeeBalances={employeeBalances}
        initialData={modalState.data || {}}
      />

      <ClaimDetailsModal
        isOpen={modalState.isOpen && modalState.type === 'details'}
        onClose={closeModal}
        claim={modalState.data}
        formatCurrency={formatCurrency}
        getStatusBadge={getStatusBadge}
        onDownload={handleDownloadFile}
      />

      <EditReimbursementModal
        isOpen={modalState.isOpen && modalState.type === 'edit'}
        onClose={closeModal}
        onSubmit={handleSaveReimbursement}
        initialData={editingReimbursement}
      />

      <ReportsModal
        isOpen={modalState.isOpen && modalState.type === 'reports'}
        onClose={closeModal}
        claims={claims}
        reimbursements={reimbursements}
        formatCurrency={formatCurrency}
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

export default Reimbursements;