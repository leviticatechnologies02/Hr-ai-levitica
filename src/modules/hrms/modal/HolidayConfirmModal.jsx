import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const HolidayConfirmModal = ({
  isOpen,
  onClose,
  confirmAction
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={confirmAction.title || "Confirm Action"}
      size="sm"
    >
      <div className="space-y-4 p-2">
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <Icon icon="heroicons:exclamation-triangle" className="w-6 h-6 text-amber-500" />
          <div>
            <p className="text-sm text-amber-700">{confirmAction.message}</p>
            <p className="text-xs text-amber-600 mt-1">This action cannot be undone.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => {
              if (confirmAction.onCancel) confirmAction.onCancel();
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-rose-500/10"
            onClick={() => {
              if (confirmAction.onConfirm) confirmAction.onConfirm();
              onClose();
            }}
          >
            <Icon icon="heroicons:trash" className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HolidayConfirmModal;