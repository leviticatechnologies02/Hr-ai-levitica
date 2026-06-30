import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const SettlementModal = ({ isOpen, onClose, caseData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    basicSalary: 0,
    leaveEncashment: 0,
    bonusIncentives: 0,
    loanDeductions: 0,
    otherDeductions: 0,
    paymentMethod: 'Bank Transfer'
  });

  const calculateTotal = () => {
    const earnings = Number(formData.basicSalary) + Number(formData.leaveEncashment) + Number(formData.bonusIncentives);
    const deductions = Number(formData.loanDeductions) + Number(formData.otherDeductions);
    return earnings - deductions;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, netAmount: calculateTotal(), caseId: caseData?.id });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Full & Final Settlement" size="md">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        {caseData && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-2">
            <h6 className="font-semibold text-slate-800 text-sm">{caseData.employeeName || caseData.name}</h6>
            <div className="text-xs text-slate-500">{caseData.employeeId || caseData.code} • {caseData.department}</div>
          </div>
        )}

        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 text-sm text-emerald-700">Earnings (+)</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Prorated Salary (₹)</label>
              <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" value={formData.basicSalary} onChange={e => setFormData({...formData, basicSalary: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Leave Encashment (₹)</label>
              <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" value={formData.leaveEncashment} onChange={e => setFormData({...formData, leaveEncashment: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Bonus / Incentives (₹)</label>
            <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" value={formData.bonusIncentives} onChange={e => setFormData({...formData, bonusIncentives: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 text-sm text-rose-700">Deductions (-)</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Loan / Advance Recovery (₹)</label>
              <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" value={formData.loanDeductions} onChange={e => setFormData({...formData, loanDeductions: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Other Deductions (₹)</label>
              <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" value={formData.otherDeductions} onChange={e => setFormData({...formData, otherDeductions: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
          <div className="text-sm font-medium text-blue-800">Net Payable Amount</div>
          <div className="text-xl font-bold text-blue-700">₹{new Intl.NumberFormat('en-IN').format(calculateTotal())}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
            <option>Bank Transfer</option>
            <option>Cheque</option>
            <option>Demand Draft</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            <Icon icon="heroicons:currency-rupee" className="w-4 h-4" /> Process Settlement
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SettlementModal;
