import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const DeleteSlipModal = ({ isOpen, onClose, onConfirm, slip, formatCurrency }) => {
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfirmText('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmText.toLowerCase() !== 'delete') {
      alert('Please type "delete" to confirm');
      return;
    }
    onConfirm(slip);
  };

  if (!slip) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="md">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Icon icon="heroicons:exclamation-triangle" className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h6 className="font-bold text-rose-800 mb-1">Warning: This action cannot be undone!</h6>
              <p className="text-sm text-rose-700">
                You are about to delete the salary slip for <span className="font-semibold">{slip.employeeName}</span> ({slip.month}).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
          <div>
            <span className="text-slate-500">Employee:</span>
            <span className="font-semibold text-slate-800 block">{slip.employeeName}</span>
          </div>
          <div>
            <span className="text-slate-500">Month:</span>
            <span className="font-semibold text-slate-800 block">{slip.month}</span>
          </div>
          <div>
            <span className="text-slate-500">Slip ID:</span>
            <span className="font-semibold text-slate-800 block">{slip.id}</span>
          </div>
          <div>
            <span className="text-slate-500">Net Salary:</span>
            <span className="font-semibold text-emerald-600 block">{formatCurrency(slip.netSalary)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Type <span className="text-rose-500">"delete"</span> to confirm:
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type 'delete' to confirm"
          />
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
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={confirmText.toLowerCase() !== 'delete'}
          >
            <Icon icon="heroicons:trash" className="w-4 h-4" />
            Delete
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteSlipModal;