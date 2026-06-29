import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const PaymentModal = ({ isOpen, onClose, onSubmit, loan, formatCurrency }) => {
  const [formData, setFormData] = useState({
    loanId: '',
    amount: '',
    paymentDate: '',
    paymentMethod: 'payroll_deduction',
    transactionId: '',
    remarks: ''
  });

  useEffect(() => {
    if (isOpen && loan) {
      setFormData({
        loanId: loan.loanId || '',
        amount: loan.monthlyEMI || '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'payroll_deduction',
        transactionId: '',
        remarks: 'Monthly EMI Payment'
      });
    }
  }, [isOpen, loan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    onSubmit(formData);
  };

  if (!loan) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Make Payment - ${loan.loanId}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Outstanding Amount:</span>
            <span className="font-semibold text-slate-800">{formatCurrency(loan.amountPending)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-500">Monthly EMI:</span>
            <span className="font-semibold text-slate-800">{formatCurrency(loan.monthlyEMI)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Payment Amount (₹) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            name="amount"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter payment amount"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Payment Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="paymentDate"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.paymentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payment Method</label>
          <select
            name="paymentMethod"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="payroll_deduction">Payroll Deduction</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
          </select>
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

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Remarks</label>
          <textarea
            name="remarks"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Enter remarks"
            rows="2"
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
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Process Payment
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;