import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const InterventionModal = ({ isOpen, onClose, interventions, onResolve }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manual Interventions Required" size="lg">
      <div className="space-y-4">
        {interventions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 text-left min-w-[100px]">Employee</th>
                  <th className="p-3 text-left min-w-[150px]">Issue</th>
                  <th className="p-3 text-left min-w-[140px]">Action Required</th>
                  <th className="p-3 text-left min-w-[120px]">Assigned To</th>
                  <th className="p-3 text-center min-w-[100px]">Status</th>
                  <th className="p-3 text-center min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {interventions.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-medium text-slate-700">{item.employeeId}</td>
                    <td className="p-3 text-slate-600">{item.issue}</td>
                    <td className="p-3 text-slate-600">{item.action}</td>
                    <td className="p-3 text-slate-600">{item.assignedTo}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        item.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {item.status === 'pending' && (
                        <button
                          onClick={() => onResolve(item.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-medium transition"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Icon icon="heroicons:check-circle" className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
            <p className="font-medium text-slate-600">No manual interventions required</p>
            <p className="text-xs">All payroll data is valid and processed automatically</p>
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

export default InterventionModal;