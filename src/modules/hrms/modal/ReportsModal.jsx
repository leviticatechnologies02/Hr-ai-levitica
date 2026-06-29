import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ReportsModal = ({ isOpen, onClose, claims, reimbursements, formatCurrency }) => {
  const totalClaims = claims.length;
  const approvedClaims = claims.filter(c => c.status === 'Approved').length;
  const pendingClaims = claims.filter(c => c.status === 'Pending' || c.status === 'Finance Review').length;
  const rejectedClaims = claims.filter(c => c.status === 'Rejected').length;
  const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);
  const approvedAmount = claims.filter(c => c.status === 'Approved').reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = claims.filter(c => c.status === 'Pending' || c.status === 'Finance Review').reduce((sum, c) => sum + c.amount, 0);
  const totalTaxAmount = claims.reduce((sum, c) => sum + (c.taxAmount || 0), 0);

  // Top employees by claims
  const topEmployees = Object.entries(
    claims.reduce((acc, claim) => {
      if (!acc[claim.employee]) {
        acc[claim.employee] = { count: 0, total: 0 };
      }
      acc[claim.employee].count++;
      acc[claim.employee].total += claim.amount;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reimbursement Analytics & Reports" size="xl">
      <div className="space-y-6 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-600 font-medium">Total Claims</p>
            <p className="text-2xl font-bold text-blue-700">{totalClaims}</p>
            <p className="text-xs text-blue-500">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-sm text-emerald-600 font-medium">Approved</p>
            <p className="text-2xl font-bold text-emerald-700">{approvedClaims}</p>
            <p className="text-xs text-emerald-500">{formatCurrency(approvedAmount)}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-sm text-amber-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-amber-700">{pendingClaims}</p>
            <p className="text-xs text-amber-500">{formatCurrency(pendingAmount)}</p>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
            <p className="text-sm text-rose-600 font-medium">Tax Amount</p>
            <p className="text-2xl font-bold text-rose-700">{formatCurrency(totalTaxAmount)}</p>
            <p className="text-xs text-rose-500">Total taxable</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700">Claims by Status</h6>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Approved</span>
                  <span className="font-semibold text-emerald-600">{approvedClaims} ({formatCurrency(approvedAmount)})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Pending</span>
                  <span className="font-semibold text-amber-600">{pendingClaims} ({formatCurrency(pendingAmount)})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Rejected</span>
                  <span className="font-semibold text-rose-600">{rejectedClaims} ({formatCurrency(claims.filter(c => c.status === 'Rejected').reduce((sum, c) => sum + c.amount, 0))})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700">Top Employees by Claims</h6>
            </div>
            <div className="p-4">
              {topEmployees.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No claims data available</p>
              ) : (
                <div className="space-y-2 text-sm">
                  {topEmployees.map(([employee, data]) => (
                    <div key={employee} className="flex justify-between items-center">
                      <span className="text-slate-600">{employee}</span>
                      <span className="font-semibold text-slate-800">{data.count} claims - {formatCurrency(data.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h6 className="font-bold text-sm text-slate-700">Claims by Type</h6>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 font-semibold text-slate-600">Type</th>
                    <th className="text-center py-2 font-semibold text-slate-600">Count</th>
                    <th className="text-right py-2 font-semibold text-slate-600">Total Amount</th>
                    <th className="text-right py-2 font-semibold text-slate-600">Avg Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {reimbursements.map(r => {
                    const typeClaims = claims.filter(c => c.type === r.name);
                    const total = typeClaims.reduce((sum, c) => sum + c.amount, 0);
                    const avg = typeClaims.length > 0 ? total / typeClaims.length : 0;
                    return (
                      <tr key={r.id} className="border-b border-slate-100">
                        <td className="py-2">
                          <div className="font-medium text-slate-800">{r.name}</div>
                          <div className="text-xs text-slate-500">{r.category}</div>
                        </td>
                        <td className="text-center py-2">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {typeClaims.length}
                          </span>
                        </td>
                        <td className="text-right py-2 font-medium">{formatCurrency(total)}</td>
                        <td className="text-right py-2 text-slate-600">{formatCurrency(avg)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={() => alert('Report exported!')}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportsModal;