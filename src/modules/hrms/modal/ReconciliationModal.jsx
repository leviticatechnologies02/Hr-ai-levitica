import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ReconciliationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  // For Statutory Compliance module
  type = 'pf',
  // For Bank Transfer module
  onReconcile,
  reconciliationData,
  formatCurrency,
  formatDate,
  // Mode detection
  mode = 'statutory' // 'statutory', 'bank', 'payment'
}) => {
  const [formData, setFormData] = useState({
    period: 'March 2024',
    format: 'PDF'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localData, setLocalData] = useState(reconciliationData || []);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'bank' || mode === 'payment') {
        setLocalData(reconciliationData || []);
      } else {
        setFormData({
          period: 'March 2024',
          format: 'PDF'
        });
      }
      setIsSubmitting(false);
    }
  }, [isOpen, reconciliationData, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (mode === 'bank' || mode === 'payment') {
      // Bank Transfer mode - call onReconcile
      if (onReconcile) {
        onReconcile();
        setIsSubmitting(false);
      }
    } else {
      // Statutory mode
      if (onSubmit) {
        onSubmit(formData);
      }
    }
  };

  const titleMap = {
    pf: 'PF Reconciliation Report',
    esi: 'ESI Reconciliation Report',
    tds: 'TDS Reconciliation Report',
    bank: 'Bank Statement Reconciliation',
    payment: 'Payment Reconciliation'
  };

  const getTitle = () => {
    if (mode === 'bank' || mode === 'payment') {
      return 'Bank Statement Reconciliation';
    }
    return titleMap[type] || 'Reconciliation Report';
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Matched': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Unmatched': 'bg-rose-50 text-rose-700 border border-rose-200',
      'Pending': 'bg-amber-50 text-amber-700 border border-amber-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status || 'N/A'}
      </span>
    );
  };

  // Calculate stats for bank mode
  const stats = {
    totalAmount: localData.reduce((sum, r) => {
      const amount = parseFloat(r.amount?.replace(/[^0-9.]/g, '') || 0);
      return sum + amount;
    }, 0),
    matched: localData.filter(r => r.status === 'Matched').length,
    unmatched: localData.filter(r => r.status === 'Unmatched').length,
    pending: localData.filter(r => r.status === 'Pending').length,
    total: localData.length
  };

  // Render Statutory mode (PF/ESI/TDS)
  const renderStatutoryMode = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Period <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            placeholder="March 2024"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Format <span className="text-rose-500">*</span>
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
          >
            <option value="PDF">PDF</option>
            <option value="Excel">Excel</option>
            <option value="CSV">CSV</option>
          </select>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
        <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          Reconciliation report will compare deducted vs deposited amounts and highlight any discrepancies.
        </p>
      </div>
    </>
  );

  // Render Bank mode
  const renderBankMode = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-600 font-medium">Total Amount</p>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency ? formatCurrency(stats.totalAmount) : `₹${stats.totalAmount.toLocaleString()}`}
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-sm text-emerald-600 font-medium">Matched</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.matched}</p>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
          <p className="text-sm text-rose-600 font-medium">Unmatched</p>
          <p className="text-2xl font-bold text-rose-700">{stats.unmatched}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-sm text-amber-600 font-medium">Pending</p>
          <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <h6 className="font-bold text-sm text-slate-700">Reconciliation Details</h6>
          <span className="text-sm text-slate-500">
            Success Rate: {stats.total > 0 ? `${((stats.matched / stats.total) * 100).toFixed(1)}%` : '0%'}
          </span>
        </div>
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Transaction</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Employee</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-600">Amount</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Date</th>
                <th className="px-3 py-2 text-center font-semibold text-slate-600">Bank Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {localData.length > 0 ? (
                localData.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-800">{record.transactionId}</div>
                      <div className="text-xs text-slate-500">Ref: {record.reference}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-800">{record.employeeName}</div>
                      <div className="text-xs text-slate-500">{record.employeeCode}</div>
                      <div className="text-xs text-slate-400">{record.bank} • {record.accountNumber}</div>
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-emerald-600">
                      {formatCurrency ? formatCurrency(record.amount) : record.amount}
                    </td>
                    <td className="px-3 py-2 text-center">{getStatusBadge(record.status)}</td>
                    <td className="px-3 py-2 text-center text-slate-700">
                      {formatDate ? formatDate(record.date) : record.date}
                    </td>
                    <td className="px-3 py-2 text-center text-slate-700">{record.bankReference || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    <Icon icon="heroicons:document-text" className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    No reconciliation data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            onClick={() => {
              // Export report
              const headers = ['Transaction ID', 'Employee', 'Amount', 'Status', 'Date', 'Bank Reference'];
              const data = localData.map(r => [
                r.transactionId, r.employeeName, r.amount, r.status, r.date, r.bankReference || 'N/A'
              ]);
              const csvContent = [headers, ...data].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `reconciliation-report-${Date.now()}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export Report
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            onClick={() => {
              setLocalData(localData.map(r => ({ ...r, status: 'Matched' })));
            }}
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Mark All Verified
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size={mode === 'bank' || mode === 'payment' ? 'xl' : 'lg'}>
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        {(mode === 'bank' || mode === 'payment') ? renderBankMode() : renderStatutoryMode()}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || (mode === 'bank' && localData.length === 0)}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === 'bank' || mode === 'payment' ? 'Reconciling...' : 'Generating...'}
              </>
            ) : (
              <>
                <Icon icon={mode === 'bank' || mode === 'payment' ? 'heroicons:arrow-path' : 'heroicons:document-chart-bar'} className="w-4 h-4" />
                {mode === 'bank' || mode === 'payment' ? 'Run Reconciliation' : 'Generate Report'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReconciliationModal;