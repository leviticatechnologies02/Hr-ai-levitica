import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const LoanApplicationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loanTypes, 
  formatCurrency,
  calculateEMI 
}) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    designation: '',
    loanType: 'Personal loan',
    amount: '',
    purpose: '',
    interestRate: '8.5',
    tenureMonths: '12',
    serviceTenure: '',
    monthlySalary: '',
    existingLoans: '0'
  });

  const [calculatedEMI, setCalculatedEMI] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        employeeName: '',
        employeeId: '',
        department: '',
        designation: '',
        loanType: 'Personal loan',
        amount: '',
        purpose: '',
        interestRate: '8.5',
        tenureMonths: '12',
        serviceTenure: '',
        monthlySalary: '',
        existingLoans: '0'
      });
      setCalculatedEMI(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.amount && formData.interestRate && formData.tenureMonths) {
      const emi = calculateEMI(
        parseFloat(formData.amount),
        parseFloat(formData.interestRate),
        parseInt(formData.tenureMonths)
      );
      setCalculatedEMI(emi);
    } else {
      setCalculatedEMI(0);
    }
  }, [formData.amount, formData.interestRate, formData.tenureMonths, calculateEMI]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.employeeId || !formData.amount || !formData.tenureMonths) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(formData);
  };

  const isFormValid = formData.employeeName && formData.employeeId && formData.amount && formData.tenureMonths;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Loan" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Employee Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="employeeName"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.employeeName}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Employee ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="employeeId"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Enter employee ID"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
            <input
              type="text"
              name="department"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter department"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Designation</label>
            <input
              type="text"
              name="designation"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter designation"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Loan Type <span className="text-rose-500">*</span>
            </label>
            <select
              name="loanType"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.loanType}
              onChange={handleChange}
              required
            >
              {loanTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Loan Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter loan amount"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Purpose of Loan</label>
            <textarea
              name="purpose"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Enter loan purpose"
              rows="2"
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
              placeholder="Enter interest rate"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tenure (Months) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="tenureMonths"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.tenureMonths}
              onChange={handleChange}
              placeholder="Enter tenure in months"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Service Tenure (Months)
            </label>
            <input
              type="number"
              name="serviceTenure"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.serviceTenure}
              onChange={handleChange}
              placeholder="Enter service tenure"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Monthly Salary (₹)
            </label>
            <input
              type="number"
              name="monthlySalary"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.monthlySalary}
              onChange={handleChange}
              placeholder="Enter monthly salary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Existing Loans Count
            </label>
            <input
              type="number"
              name="existingLoans"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.existingLoans}
              onChange={handleChange}
              placeholder="Enter existing loans count"
            />
          </div>
        </div>

        {calculatedEMI > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-700">Calculated Monthly EMI:</span>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(calculatedEMI)}</span>
            </div>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFormValid}
          >
            <Icon icon="heroicons:paper-airplane" className="w-4 h-4" />
            Submit Application
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LoanApplicationModal;