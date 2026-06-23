import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const AuditTrailModal = ({ isOpen, onClose, document }) => {
  if (!document) return null;

  const getActionBadge = (action) => {
    const config = {
      approved: { label: 'Approved', color: 'emerald' },
      rejected: { label: 'Rejected', color: 'rose' },
      uploaded: { label: 'Uploaded', color: 'blue' },
      downloaded: { label: 'Downloaded', color: 'cyan' },
      version_updated: { label: 'Version Updated', color: 'purple' }
    };
    const { label, color } = config[action] || { label: action || 'Unknown', color: 'gray' };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Audit Trail - ${document.name}`} size="lg">
      <div className="space-y-4">
        {document.auditTrail && document.auditTrail.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold text-slate-600">Action</th>
                  <th className="p-3 font-semibold text-slate-600">User</th>
                  <th className="p-3 font-semibold text-slate-600">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {document.auditTrail.map((entry, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="p-3">{getActionBadge(entry.action)}</td>
                    <td className="p-3 text-slate-700">{entry.user}</td>
                    <td className="p-3 text-slate-500">{new Date(entry.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Icon icon="heroicons:document-text" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No audit trail available</p>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AuditTrailModal;