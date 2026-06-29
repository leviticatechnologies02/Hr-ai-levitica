import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const AnalyticsModal = ({ isOpen, onClose, payments, formatCurrency }) => {
  const totalAmount = payments.reduce((sum, p) => {
    const amount = parseFloat(p.totalAmount?.replace(/[^0-9.]/g, '') || 0);
    return sum + amount;
  }, 0);

  const statusCounts = payments.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const bankDistribution = payments.reduce((acc, p) => {
    acc[p.bank] = (acc[p.bank] || 0) + 1;
    return acc;
  }, {});

  const monthlyData = payments.reduce((acc, p) => {
    const month = p.generatedDate?.slice(0, 7) || 'Unknown';
    if (!acc[month]) {
      acc[month] = { count: 0, amount: 0 };
    }
    acc[month].count++;
    acc[month].amount += parseFloat(p.totalAmount?.replace(/[^0-9.]/g, '') || 0);
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyData).sort();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Analytics" size="xl">
      <div className="space-y-6 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-600 font-medium">Total Amount</p>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-sm text-emerald-600 font-medium">Success Rate</p>
            <p className="text-2xl font-bold text-emerald-700">
              {payments.length > 0 ? `${((statusCounts['Processed'] || 0) / payments.length * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-center">
            <p className="text-sm text-cyan-600 font-medium">Transactions</p>
            <p className="text-2xl font-bold text-cyan-700">{payments.length}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-sm text-amber-600 font-medium">Avg Time</p>
            <p className="text-2xl font-bold text-amber-700">2.4 hrs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700">Monthly Trends</h6>
            </div>
            <div className="p-4">
              {sortedMonths.length > 0 ? (
                <div className="space-y-3">
                  {sortedMonths.map(month => (
                    <div key={month}>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">{month}</span>
                        <span className="font-semibold text-slate-800">{formatCurrency(monthlyData[month].amount)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{monthlyData[month].count} transactions</span>
                        <span>{((monthlyData[month].amount / totalAmount) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(monthlyData[month].amount / totalAmount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No data available</p>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700">Bank-wise Distribution</h6>
            </div>
            <div className="p-4">
              {Object.keys(bankDistribution).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(bankDistribution).map(([bank, count]) => (
                    <div key={bank}>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">{bank}</span>
                        <span className="font-semibold text-slate-800">{count} files</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${(count / payments.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h6 className="font-bold text-sm text-slate-700">Transaction Status</h6>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Processed', 'Generated', 'In Progress', 'Failed'].map(status => (
                <div key={status} className="text-center p-3 bg-slate-50 rounded-xl">
                  <p className={`text-sm font-semibold ${
                    status === 'Processed' ? 'text-emerald-600' :
                    status === 'Failed' ? 'text-rose-600' :
                    status === 'In Progress' ? 'text-amber-600' :
                    'text-blue-600'
                  }`}>{statusCounts[status] || 0}</p>
                  <p className="text-xs text-slate-500">{status}</p>
                </div>
              ))}
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
        </div>
      </div>
    </Modal>
  );
};

export default AnalyticsModal;