import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const DisbursementModal = ({ isOpen, onClose, onSubmit, loan, formatCurrency }) => {
  const [formData, setFormData] = useState({
    loanId: '',
    method: 'bank_transfer',
    bankDetails: { accountNumber: '', bankName: '' },
    disbursementDate: '',
    transactionId: ''
  });

  useEffect(() => {
    if (isOpen && loan) {
      setFormData({
        loanId: loan.loanId || '',
        method: 'bank_transfer',
        bankDetails: { accountNumber: '', bankName: '' },
        disbursementDate: new Date().toISOString().split('T')[0],
        transactionId: `TXN${Date.now()}`
      });
    }
  }, [isOpen, loan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'bankName' || name === 'accountNumber') {
      setFormData({
        ...formData,
        bankDetails: { ...formData.bankDetails, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bankDetails.bankName || !formData.bankDetails.accountNumber) {
      alert('Please enter bank details');
      return;
    }
    onSubmit(formData);
  };

  if (!loan) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Disburse Loan - ${loan.loanId}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700">Disbursement Amount:</span>
            <span className="font-semibold text-blue-800">{formatCurrency(loan.amount)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Disbursement Method</label>
          <select
            name="method"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.method}
            onChange={handleChange}
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cheque">Cheque</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bank Name</label>
          <input
            type="text"
            name="bankName"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.bankDetails.bankName}
            onChange={handleChange}
            placeholder="Enter bank name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.bankDetails.accountNumber}
            onChange={handleChange}
            placeholder="Enter account number"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Disbursement Date</label>
          <input
            type="date"
            name="disbursementDate"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.disbursementDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Transaction ID</label>
          <input
            type="text"
            name="transactionId"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.transactionId}
            onChange={handleChange}
            placeholder="Enter transaction ID"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Process Disbursement
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DisbursementModal;