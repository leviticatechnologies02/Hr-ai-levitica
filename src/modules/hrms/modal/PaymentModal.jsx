import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loan = null,
  formatCurrency,
  settlementData = null,
  mode = 'loans' 
}) => {
  const [formData, setFormData] = useState({
    loanId: '',
    amount: '',
    paymentDate: '',
    paymentMethod: 'payroll_deduction',
    transactionId: '',
    remarks: '',
    method: 'Bank Transfer',
    paymentMode: 'NEFT',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    utrNumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'loans' && loan) {
        setFormData({
          loanId: loan.loanId || '',
          amount: loan.monthlyEMI || '',
          paymentDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'payroll_deduction',
          transactionId: '',
          remarks: 'Monthly EMI Payment',
          method: 'Bank Transfer',
          paymentMode: 'NEFT',
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          utrNumber: ''
        });
      } else if (mode === 'settlement' && settlementData) {
        const payment = settlementData.payment || {};
        setFormData({
          loanId: '',
          amount: settlementData.netSettlement || 0,
          paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0],
          paymentMethod: payment.method || 'payroll_deduction',
          transactionId: payment.referenceNumber || '',
          remarks: 'Final Settlement Payment',
          method: payment.method || 'Bank Transfer',
          paymentMode: payment.paymentMode || 'NEFT',
          bankName: payment.bankName || '',
          accountNumber: payment.accountNumber || '',
          ifscCode: payment.ifscCode || '',
          utrNumber: payment.utrNumber || ''
        });
      }
      setIsSubmitting(false);
    }
  }, [isOpen, loan, settlementData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'loans') {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        alert('Please enter a valid payment amount');
        return;
      }
    } else if (mode === 'settlement') {
      if (!formData.bankName || !formData.accountNumber) {
        alert('Please enter bank details');
        return;
      }
    }
    
    setIsSubmitting(true);
    onSubmit(formData);
  };

  const getTitle = () => {
    if (mode === 'loans' && loan) {
      return `Make Payment - ${loan.loanId}`;
    }
    if (mode === 'settlement') {
      return 'Process Payment';
    }
    return 'Make Payment';
  };

  if (mode === 'loans' && !loan) return null;
  if (mode === 'settlement' && !settlementData) return null;

  const getDisplayAmount = () => {
    if (mode === 'loans') {
      return settlementData?.netSettlement || 0;
    }
    return settlementData?.netSettlement || 0;
  };

  const getOutstandingAmount = () => {
    if (mode === 'loans' && loan) {
      return loan.amountPending;
    }
    return 0;
  };

  const getMonthlyEMI = () => {
    if (mode === 'loans' && loan) {
      return loan.monthlyEMI;
    }
    return 0;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size={mode === 'settlement' ? 'lg' : 'md'}>
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        {mode === 'loans' && loan && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Outstanding Amount:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(getOutstandingAmount())}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-500">Monthly EMI:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(getMonthlyEMI())}</span>
            </div>
          </div>
        )}

        {mode === 'settlement' && settlementData && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-700">Net Settlement Amount:</span>
            <span className="text-lg font-bold text-blue-600">{formatCurrency(settlementData.netSettlement)}</span>
          </div>
        )}

        {mode === 'loans' && (
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
        )}

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

        {mode === 'loans' && (
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
        )}

        {mode === 'settlement' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payment Method</label>
              <select
                name="method"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                value={formData.method}
                onChange={handleChange}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="IMPS">IMPS</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payment Mode</label>
              <select
                name="paymentMode"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="IMPS">IMPS</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bank Name</label>
              <input
                type="text"
                name="bankName"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={formData.bankName}
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
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="Enter IFSC code"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">UTR/Reference Number</label>
              <input
                type="text"
                name="utrNumber"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={formData.utrNumber}
                onChange={handleChange}
                placeholder="Enter UTR/Reference number"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payment Remarks</label>
              <textarea
                name="remarks"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Add any payment remarks or notes"
                rows="2"
              />
            </div>
          </div>
        )}

        {mode === 'loans' && (
          <>
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
          </>
        )}

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
            className={`px-4 py-2 ${mode === 'settlement' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isSubmitting || (mode === 'settlement' && (!formData.bankName || !formData.accountNumber))}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                {mode === 'settlement' ? 'Process Payment' : 'Process Payment'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;