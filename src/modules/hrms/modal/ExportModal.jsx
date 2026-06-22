import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ExportModal = ({ isOpen, onClose, onExport }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Rules"
      size="md"
    >
      <div className="space-y-4 p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-700">Export all work hour rules as a JSON file?</p>
            <p className="text-xs text-blue-600 mt-1">This will include all attendance, overtime, break rules, and settings.</p>
          </div>
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
            onClick={onExport}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export Now
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;