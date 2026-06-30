import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BuyoutModal = ({ isOpen, onClose, onSubmit, caseData = null }) => {
  const [formData, setFormData] = useState({
    daysToBuyout: 30,
    monthlySalary: '',
    reason: ''
  });

  const [calculatedAmount, setCalculatedAmount] = useState(0);

  useEffect(() => {
    if (formData.monthlySalary && formData.daysToBuyout) {
      const salary = parseInt(String(formData.monthlySalary).replace(/[^0-9]/g, '')) || 0;
      const dailyRate = salary / 30;
      setCalculatedAmount(Math.round(dailyRate * formData.daysToBuyout));
    }
  }, [formData.monthlySalary, formData.daysToBuyout]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, calculatedAmount, caseId: caseData?.id });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Process Notice Period Buyout" size="md">
      <form onSubmit={handleSubmit} className="space-y-5 p-2">
        {caseData && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
            <h6 className="font-semibold text-slate-800 text-sm">{caseData.employeeName}</h6>
            <div className="text-xs text-slate-500">{caseData.role} • {caseData.department}</div>
            <div className="mt-2 text-xs font-medium text-amber-600">Remaining Days: {caseData.daysRemaining || 0}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Days to Buyout *</label>
            <input type="number" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" value={formData.daysToBuyout} onChange={e => setFormData({...formData, daysToBuyout: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Salary (₹) *</label>
            <input type="text" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g., 150000" value={formData.monthlySalary} onChange={e => setFormData({...formData, monthlySalary: e.target.value})} />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-blue-800">Calculated Buyout</div>
            <div className="text-xs text-blue-600 mt-0.5">Estimated based on 30-day month</div>
          </div>
          <div className="text-xl font-bold text-blue-700">₹{new Intl.NumberFormat('en-IN').format(calculatedAmount)}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Justification / Reason *</label>
          <textarea required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" rows="3" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="Why is the buyout requested?"></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            <Icon icon="heroicons:currency-rupee" className="w-4 h-4" /> Process Buyout
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BuyoutModal;
