import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ForeclosureModal = ({ isOpen, onClose, onSubmit, loan, formatCurrency }) => {
  const [formData, setFormData] = useState({
    outstandingAmount: 0,
    charges: 0,
    totalAmount: 0
  });

  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen && loan) {
      const charges = loan.amountPending * 0.03;
      setFormData({
        outstandingAmount: loan.amountPending,
        charges: charges,
        totalAmount: loan.amountPending + charges
      });
      setConfirmed(false);
    }
  }, [isOpen, loan]);

  if (!loan) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmed) {
      alert('Please confirm the foreclosure terms');
      return;
    }
    onSubmit({ loanId: loan.id });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Loan Foreclosure - ${loan.loanId}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 text-center">
            <p className="text-xs text-slate-500">Outstanding Amount</p>
            <p className="font-bold text-amber-600 text-lg">{formatCurrency(formData.outstandingAmount)}</p>
          </div>
          <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 text-center">
            <p className="text-xs text-slate-500">Paid Months</p>
            <p className="font-bold text-slate-800 text-lg">
              {loan.emiSchedule?.filter(emi => emi.status === 'paid').length || 0} of {loan.tenureMonths}
            </p>
          </div>
        </div>

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Icon icon="heroicons:exclamation-triangle" className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <h6 className="font-semibold text-sm text-rose-700">Foreclosure Warning</h6>
              <p className="text-sm text-rose-600">This action will close your loan account permanently. All outstanding dues must be cleared.</p>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h6 className="font-semibold text-sm text-slate-700">Foreclosure Calculation</h6>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Outstanding Principal:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(formData.outstandingAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Foreclosure Charges (3%):</span>
              <span className="font-semibold text-rose-600">{formatCurrency(formData.charges)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between">
              <span className="font-semibold text-slate-700">Total Payable:</span>
              <span className="font-bold text-blue-600 text-lg">{formatCurrency(formData.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl">
          <input
            type="checkbox"
            id="confirmForeclosure"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-5 h-5 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="confirmForeclosure" className="text-sm text-slate-700 cursor-pointer">
            I understand that foreclosure charges are applicable and this action cannot be undone.
          </label>
        </div>

        {confirmed && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <Icon icon="heroicons:check-circle" className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-emerald-700">You have acknowledged the foreclosure terms.</span>
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
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!confirmed}
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Confirm Foreclosure
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ForeclosureModal;