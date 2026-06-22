import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const HolidayStatusModal = ({
  isOpen,
  onClose,
  selectedApplication,
  updateApplicationStatus
}) => {
  const getStatusBadge = (status) => {
    const config = {
      Pending: { label: 'Pending', color: 'yellow' },
      Approved: { label: 'Approved', color: 'green' },
      Rejected: { label: 'Rejected', color: 'red' },
    };
    const { label, color } = config[status] || { label: status, color: 'gray' };
    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Application Status"
      size="md"
    >
      <div className="space-y-4 p-2">
        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Holiday:</span>
            <span className="text-sm font-bold text-slate-800">{selectedApplication?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Date:</span>
            <span className="text-sm font-bold text-slate-800">{selectedApplication?.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Current Status:</span>
            {getStatusBadge(selectedApplication?.status)}
          </div>
          {selectedApplication?.reason && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Reason:</span>
              <span className="text-sm text-slate-700">{selectedApplication?.reason}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Update Status To:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              onClick={() => updateApplicationStatus("Pending")}
            >
              <Icon icon="heroicons:clock" className="w-4 h-4" />
              Pending
            </button>
            <button
              type="button"
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              onClick={() => updateApplicationStatus("Approved")}
            >
              <Icon icon="heroicons:check-circle" className="w-4 h-4" />
              Approve
            </button>
            <button
              type="button"
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              onClick={() => updateApplicationStatus("Rejected")}
            >
              <Icon icon="heroicons:x-circle" className="w-4 h-4" />
              Reject
            </button>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HolidayStatusModal;