import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const NewClaimModal = ({ isOpen, onClose, onSubmit, reimbursements, employeeBalances, initialData = {} }) => {
  const [formData, setFormData] = useState({
    employee: '',
    employeeId: '',
    type: '',
    amount: '',
    frequency: 'Monthly',
    receipt: null,
    description: ''
  });

  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        employee: initialData.employee || '',
        employeeId: initialData.employeeId || '',
        type: initialData.type || '',
        amount: initialData.amount || '',
        frequency: initialData.frequency || 'Monthly',
        receipt: null,
        description: initialData.description || ''
      });
      setValidationMessage('');
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    
    if (name === 'type' && value) {
      const selectedReimbursement = reimbursements.find(r => r.name === value);
      if (selectedReimbursement) {
        setFormData(prev => ({ ...prev, frequency: selectedReimbursement.frequency }));
      }
    }
    
    if ((name === 'employeeId' || name === 'type' || name === 'amount') && formData.employeeId && formData.type && formData.amount) {
      validateBalance(formData.employeeId, formData.type, parseFloat(formData.amount || 0));
    }
  };

  const validateBalance = (employeeId, type, amount) => {
    const employeeBalance = employeeBalances.find(eb => eb.employeeId === employeeId);
    if (!employeeBalance) {
      setValidationMessage('Employee not found');
      return;
    }
    
    const balance = employeeBalance.balances[type];
    if (!balance) {
      setValidationMessage('No balance found for this reimbursement type');
      return;
    }
    
    if (balance.remaining < amount) {
      setValidationMessage(`⚠️ Claim amount exceeds remaining balance. Remaining: ₹${balance.remaining.toLocaleString()}`);
    } else {
      setValidationMessage(`✅ Remaining balance: ₹${(balance.remaining - amount).toLocaleString()}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employee || !formData.type || !formData.amount || !formData.receipt) {
      alert('All fields and bills/receipt are required!');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Reimbursement Claim" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Employee Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              name="employee"
              placeholder="Enter employee name"
              value={formData.employee}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Employee ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              name="employeeId"
              placeholder="Enter employee ID"
              value={formData.employeeId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Reimbursement Type <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              {reimbursements.map(r => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Frequency</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
              <option value="Ad-hoc">Ad-hoc</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Upload Bill/Receipt <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              name="receipt"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description / Purpose</label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            name="description"
            placeholder="Enter description or purpose"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {formData.type && formData.amount && (
          <div className={`p-3 rounded-xl flex items-start gap-2 ${validationMessage.includes('⚠️') ? 'bg-rose-50 border border-rose-200' : 'bg-emerald-50 border border-emerald-200'}`}>
            <Icon icon={validationMessage.includes('⚠️') ? 'heroicons:exclamation-triangle' : 'heroicons:check-circle'} 
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${validationMessage.includes('⚠️') ? 'text-rose-500' : 'text-emerald-500'}`} />
            <p className={`text-sm ${validationMessage.includes('⚠️') ? 'text-rose-700' : 'text-emerald-700'}`}>
              {validationMessage || (
                <span className="text-slate-500">Select employee, type, and amount to check balance</span>
              )}
            </p>
          </div>
        )}

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
            <Icon icon="heroicons:plus" className="w-4 h-4" />
            Submit Claim
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewClaimModal;