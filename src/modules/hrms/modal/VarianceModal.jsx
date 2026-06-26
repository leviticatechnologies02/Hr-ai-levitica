import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const VarianceModal = ({ isOpen, onClose, variances, previousMonth, formatCurrency }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Salary Variance Analysis" size="xl">
      <div className="space-y-4">
        {previousMonth && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Previous Month:</span> {previousMonth.month} - 
              Total: {formatCurrency(previousMonth.totalAmount)} | 
              Employees: {previousMonth.employeeCount}
            </p>
          </div>
        )}

        {variances.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 text-left min-w-[100px]">Employee</th>
                  <th className="p-3 text-left min-w-[80px]">Type</th>
                  <th className="p-3 text-left min-w-[120px]">Amount Change</th>
                  <th className="p-3 text-center min-w-[80px]">Percentage</th>
                  <th className="p-3 text-left min-w-[150px]">Reason</th>
                  <th className="p-3 text-center min-w-[80px]">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {variances.map((alert, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-medium text-slate-700">{alert.employeeId}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        alert.type === 'increase' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {alert.type}
                      </span>
                    </td>
                    <td className={`p-3 font-semibold ${alert.type === 'increase' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {alert.type === 'increase' ? '+' : ''}{formatCurrency(alert.amount)}
                    </td>
                    <td className="p-3 text-center font-semibold text-slate-700">
                      {alert.percentage > 0 ? '+' : ''}{alert.percentage.toFixed(2)}%
                    </td>
                    <td className="p-3 text-slate-600">{alert.reason}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                        alert.severity === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Icon icon="heroicons:check-circle" className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
            <p className="font-medium text-slate-600">No variance alerts</p>
            <p className="text-xs">All payroll amounts are within normal range</p>
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

export default VarianceModal;