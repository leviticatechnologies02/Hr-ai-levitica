import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const EditLoanModal = ({ isOpen, onClose, onSubmit, loan, loanTypes, formatCurrency }) => {
  const [formData, setFormData] = useState({
    id: '',
    employeeName: '',
    employeeId: '',
    loanType: '',
    amount: '',
    interestRate: '',
    tenureMonths: '',
    status: '',
    monthlyEMI: '',
    amountPaid: '',
    amountPending: ''
  });

  useEffect(() => {
    if (isOpen && loan) {
      setFormData({
        id: loan.id || '',
        employeeName: loan.employeeName || '',
        employeeId: loan.employeeId || '',
        loanType: loan.loanType || '',
        amount: loan.amount || '',
        interestRate: loan.interestRate || '',
        tenureMonths: loan.tenureMonths || '',
        status: loan.status || 'Active',
        monthlyEMI: loan.monthlyEMI || '',
        amountPaid: loan.amountPaid || '',
        amountPending: loan.amountPending || ''
      });
    }
  }, [isOpen, loan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!loan) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Loan - ${loan.employeeName}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee Name</label>
            <input
              type="text"
              name="employeeName"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.employeeName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.employeeId}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Loan Type</label>
            <select
              name="loanType"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.loanType}
              onChange={handleChange}
            >
              {loanTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Loan Amount (₹)</label>
            <input
              type="number"
              name="amount"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              name="interestRate"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.interestRate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tenure (Months)</label>
            <input
              type="number"
              name="tenureMonths"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.tenureMonths}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Monthly EMI (₹)</label>
            <input
              type="number"
              name="monthlyEMI"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.monthlyEMI}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Amount Paid (₹)</label>
            <input
              type="number"
              name="amountPaid"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.amountPaid}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
            <select
              name="status"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Update Loan
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditLoanModal;