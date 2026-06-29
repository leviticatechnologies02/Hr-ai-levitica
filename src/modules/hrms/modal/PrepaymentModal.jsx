import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const PrepaymentModal = ({ isOpen, onClose, onSubmit, loan, formatCurrency }) => {
  const [formData, setFormData] = useState({
    amount: '',
    charges: 0,
    totalAmount: 0
  });

  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ amount: '', charges: 0, totalAmount: 0 });
      setCalculated(false);
    }
  }, [isOpen]);

  if (!loan) return null;

  const handleCalculate = () => {
    const amount = parseFloat(formData.amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount < loan.prepaymentRules.minimumAmount) {
      alert(`Minimum prepayment amount is ${formatCurrency(loan.prepaymentRules.minimumAmount)}`);
      return;
    }

    const charges = amount * 0.02;
    const totalAmount = amount + charges;

    setFormData({ ...formData, charges, totalAmount });
    setCalculated(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!calculated || formData.totalAmount === 0) {
      alert('Please calculate charges first');
      return;
    }
    onSubmit({ loanId: loan.id, amount: formData.amount });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Prepayment - ${loan.loanId}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 text-center">
            <p className="text-xs text-slate-500">Loan Amount</p>
            <p className="font-bold text-blue-600">{formatCurrency(loan.amount)}</p>
          </div>
          <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 text-center">
            <p className="text-xs text-slate-500">Amount Paid</p>
            <p className="font-bold text-emerald-600">{formatCurrency(loan.amountPaid)}</p>
          </div>
          <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 text-center">
            <p className="text-xs text-slate-500">Outstanding</p>
            <p className="font-bold text-amber-600">{formatCurrency(loan.amountPending)}</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <h6 className="font-semibold text-sm text-amber-700 mb-2">Prepayment Rules</h6>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Minimum Amount:</span>
              <span className="font-semibold text-slate-800 ml-2">{formatCurrency(loan.prepaymentRules.minimumAmount)}</span>
            </div>
            <div>
              <span className="text-slate-600">Charges:</span>
              <span className="font-semibold text-slate-800 ml-2">{loan.prepaymentRules.charges}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Prepayment Amount (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.amount}
              onChange={(e) => {
                setFormData({ ...formData, amount: e.target.value, charges: 0, totalAmount: 0 });
                setCalculated(false);
              }}
              placeholder="Enter prepayment amount"
            />
            <button
              type="button"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
              onClick={handleCalculate}
              disabled={!formData.amount || parseFloat(formData.amount) <= 0}
            >
              <Icon icon="heroicons:calculator" className="w-4 h-4" />
              Calculate
            </button>
          </div>
        </div>

        {calculated && formData.totalAmount > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Prepayment Amount:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(parseFloat(formData.amount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Charges (2%):</span>
                <span className="font-semibold text-rose-600">{formatCurrency(formData.charges)}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 flex justify-between">
                <span className="font-semibold text-slate-700">Total Payable:</span>
                <span className="font-bold text-blue-600 text-lg">{formatCurrency(formData.totalAmount)}</span>
              </div>
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
            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!calculated || formData.totalAmount === 0}
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Confirm Prepayment
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PrepaymentModal;