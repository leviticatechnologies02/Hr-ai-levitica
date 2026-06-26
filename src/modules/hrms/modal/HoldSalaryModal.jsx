import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const HoldSalaryModal = ({ isOpen, onClose, heldEmployees, onRelease }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hold Salary Management" size="lg">
      <div className="space-y-4">
        {heldEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 text-left min-w-[100px]">Employee</th>
                  <th className="p-3 text-left min-w-[150px]">Reason</th>
                  <th className="p-3 text-left min-w-[120px]">Held By</th>
                  <th className="p-3 text-left min-w-[100px]">Held Date</th>
                  <th className="p-3 text-center min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {heldEmployees.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-medium text-slate-700">{item.employeeId}</td>
                    <td className="p-3 text-slate-600">{item.reason}</td>
                    <td className="p-3 text-slate-600">{item.heldBy}</td>
                    <td className="p-3 text-slate-600">{item.heldDate}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onRelease(item.id)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-medium transition"
                      >
                        Release Hold
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Icon icon="heroicons:check-circle" className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
            <p className="font-medium text-slate-600">No employees with held salary</p>
            <p className="text-xs">All salary holds have been released</p>
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

export default HoldSalaryModal;