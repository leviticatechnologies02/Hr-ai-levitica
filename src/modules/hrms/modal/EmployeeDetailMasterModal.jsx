import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const EmployeeDetailMasterModal = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Details" size="lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(item).map(([key, value]) => (
          <div key={key}>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{key}</label>
            <p className="text-sm text-slate-800 mt-1">{String(value)}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button onClick={onClose} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition">Close</button>
      </div>
    </Modal>
  );
};

export default EmployeeDetailMasterModal;