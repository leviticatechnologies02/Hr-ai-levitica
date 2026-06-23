import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const DeleteModal = ({ isOpen, onClose, onConfirm, document }) => {
  if (!document) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Document" size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl border border-rose-200">
          <Icon icon="heroicons:exclamation-triangle" className="w-6 h-6 text-rose-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-slate-700">
              Are you sure you want to delete "<span className="font-semibold">{document.name}</span>"?
            </p>
            <p className="text-xs text-slate-500 mt-1">This action cannot be undone.</p>
          </div>
        </div>

        {document.mandatory && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2">
            <Icon icon="heroicons:exclamation-triangle" className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              This is a mandatory document. Deleting it will affect the employee's document compliance status.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Icon icon="heroicons:trash" className="w-4 h-4" />
            Delete Document
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;