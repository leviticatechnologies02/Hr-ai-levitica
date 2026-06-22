import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const LeaveBalanceModal = ({
  isOpen,
  onClose,
  balanceForm,
  setBalanceForm,
  handleAddBalance,
  employees,
  leaveTypes
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Leave Balance"
      size="md"
    >
      <div className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Employee <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={balanceForm.employeeId}
            onChange={(e) => setBalanceForm({ ...balanceForm, employeeId: e.target.value })}
          >
            <option value="">Select employee...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.department})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Leave Type <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={balanceForm.leaveTypeId}
            onChange={(e) => setBalanceForm({ ...balanceForm, leaveTypeId: parseInt(e.target.value) })}
          >
            <option value="">Select leave type...</option>
            {leaveTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>
                {lt.name} ({lt.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Opening Balance</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={balanceForm.openingBalance}
            onChange={(e) => setBalanceForm({ ...balanceForm, openingBalance: parseFloat(e.target.value) })}
            min="0"
            step="0.5"
          />
          <p className="text-xs text-slate-400 mt-1">For new joiners or mid-year adjustments</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Adjustment Type</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={balanceForm.adjustmentType}
              onChange={(e) => setBalanceForm({ ...balanceForm, adjustmentType: e.target.value })}
            >
              <option value="credit">Credit (+)</option>
              <option value="debit">Debit (-)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Adjustment Amount</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={balanceForm.adjustmentAmount}
              onChange={(e) => setBalanceForm({ ...balanceForm, adjustmentAmount: parseFloat(e.target.value) })}
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Effective Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={balanceForm.effectiveDate}
            onChange={(e) => setBalanceForm({ ...balanceForm, effectiveDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-y"
            rows="3"
            value={balanceForm.reason}
            onChange={(e) => setBalanceForm({ ...balanceForm, reason: e.target.value })}
            placeholder="Reason for adjustment (e.g., Opening balance, Leave lapse, Correction)"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10"
            onClick={handleAddBalance}
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            Save Balance
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveBalanceModal;