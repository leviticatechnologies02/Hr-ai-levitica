import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const LeaveDelegationModal = ({
  isOpen,
  onClose,
  delegationForm,
  setDelegationForm,
  setupApprovalDelegation
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Setup Approval Delegation"
      size="md"
    >
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              From Approver <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={delegationForm.fromApprover}
              onChange={(e) => setDelegationForm({ ...delegationForm, fromApprover: e.target.value })}
              placeholder="e.g., Manager, HR"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              To Approver <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={delegationForm.toApprover}
              onChange={(e) => setDelegationForm({ ...delegationForm, toApprover: e.target.value })}
              placeholder="e.g., Deputy Manager"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Start Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={delegationForm.startDate}
              onChange={(e) => setDelegationForm({ ...delegationForm, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              End Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={delegationForm.endDate}
              onChange={(e) => setDelegationForm({ ...delegationForm, endDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-y"
            rows="3"
            value={delegationForm.reason}
            onChange={(e) => setDelegationForm({ ...delegationForm, reason: e.target.value })}
            placeholder="Reason for delegation (e.g., On leave, Out of office)"
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
            onClick={() => {
              setupApprovalDelegation(
                delegationForm.fromApprover,
                delegationForm.toApprover,
                delegationForm.startDate,
                delegationForm.endDate,
                delegationForm.reason
              );
              onClose();
            }}
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            Setup Delegation
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveDelegationModal;