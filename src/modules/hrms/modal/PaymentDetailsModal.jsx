import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const PaymentDetailsModal = ({ isOpen, onClose, payment, formatCurrency, formatDate, getStatusBadge, getBankBadge, employees }) => {
  if (!payment) return null;

  const includedEmployees = employees.filter(emp => payment.includedEmployees?.includes(emp.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Details" size="xl">
      <div className="space-y-6 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon="heroicons:information-circle" className="w-4 h-4 text-blue-500" />
              Payment Information
            </h6>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">File Name:</span>
                <span className="font-semibold text-slate-800">{payment.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank:</span>
                <span>{getBankBadge(payment.bank)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reference Number:</span>
                <span className="font-semibold text-blue-600">{payment.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch ID:</span>
                <span className="font-medium text-slate-800">{payment.batchId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-medium text-slate-800">{payment.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon="heroicons:currency-dollar" className="w-4 h-4 text-emerald-500" />
              Amount Details
            </h6>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-bold text-emerald-600">{payment.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Amount:</span>
                <span className="font-medium text-slate-800">{payment.netAmount || payment.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Charges:</span>
                <span className="font-medium text-rose-600">{payment.charges || '₹0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Employees:</span>
                <span className="font-medium text-slate-800">{payment.totalEmployees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span>{getStatusBadge(payment.status)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon="heroicons:clock" className="w-4 h-4 text-amber-500" />
              Payment Timeline
            </h6>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                  <Icon icon="heroicons:document-text" className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Generated</p>
                <p className="text-xs font-medium text-slate-700">{formatDate(payment.generatedDate)}</p>
              </div>
              <div className="flex-1 h-0.5 bg-blue-200 mx-2" />
              <div className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${
                  payment.status === 'Processed' ? 'bg-emerald-100' : 'bg-slate-100'
                }`}>
                  <Icon icon="heroicons:arrow-up-tray" className={`w-5 h-5 ${
                    payment.status === 'Processed' ? 'text-emerald-600' : 'text-slate-400'
                  }`} />
                </div>
                <p className="text-xs text-slate-500 mt-1">Sent to Bank</p>
                <p className="text-xs font-medium text-slate-700">
                  {payment.processedDate !== 'Pending' ? formatDate(payment.processedDate) : 'Pending'}
                </p>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
              <div className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${
                  payment.status === 'Processed' ? 'bg-emerald-100' : 'bg-slate-100'
                }`}>
                  <Icon icon="heroicons:check-circle" className={`w-5 h-5 ${
                    payment.status === 'Processed' ? 'text-emerald-600' : 'text-slate-400'
                  }`} />
                </div>
                <p className="text-xs text-slate-500 mt-1">Processed</p>
                <p className="text-xs font-medium text-slate-700">
                  {payment.processedDate !== 'Pending' ? formatDate(payment.processedDate) : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {includedEmployees.length > 0 && (
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
                <Icon icon="heroicons:users" className="w-4 h-4 text-blue-500" />
                Included Employees ({includedEmployees.length})
              </h6>
            </div>
            <div className="p-4 max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Code</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Name</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">Bank</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {includedEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2 text-slate-700">{emp.code}</td>
                      <td className="px-3 py-2 font-medium text-slate-800">{emp.name}</td>
                      <td className="px-3 py-2 text-slate-700">{emp.bankName}</td>
                      <td className="px-3 py-2 text-right font-medium text-emerald-600">{emp.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          {payment.status === 'Failed' && (
            <button
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors flex items-center gap-2"
              onClick={() => {
                // Retry logic
                onClose();
              }}
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
              Retry Failed
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PaymentDetailsModal;