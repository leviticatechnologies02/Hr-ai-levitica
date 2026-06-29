import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ClaimDetailsModal = ({ isOpen, onClose, claim, formatCurrency, getStatusBadge, onDownload }) => {
  if (!claim) return null;

  const getApprovalBadge = (status) => {
    const styles = {
      'Approved': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Rejected': 'bg-rose-50 text-rose-700 border border-rose-200',
      'Pending': 'bg-amber-50 text-amber-700 border border-amber-200'
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status || 'Pending'}
      </span>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Claim Details - ${claim.employee}`} size="xl">
      <div className="space-y-6 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-sm">
            <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
              <Icon icon="heroicons:user" className="w-4 h-4 text-blue-500" />
              Employee Information
            </h6>
            <div className="flex justify-between">
              <span className="text-slate-500">Employee:</span>
              <span className="font-semibold text-slate-800">{claim.employee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Employee ID:</span>
              <span className="font-semibold text-slate-800">{claim.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Claim Type:</span>
              <span className="font-semibold text-slate-800">{claim.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Frequency:</span>
              <span className="font-semibold text-slate-800">{claim.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Claim Date:</span>
              <span className="font-semibold text-slate-800">{claim.date}</span>
            </div>
          </div>

          <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-sm">
            <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
              <Icon icon="heroicons:currency-dollar" className="w-4 h-4 text-emerald-500" />
              Financial Details
            </h6>
            <div className="flex justify-between">
              <span className="text-slate-500">Claim Amount:</span>
              <span className="font-bold text-slate-800">{formatCurrency(claim.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tax Amount:</span>
              <span className="font-bold text-rose-600">{formatCurrency(claim.taxAmount || 0)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500 font-semibold">Net Amount:</span>
              <span className="font-bold text-emerald-600">{formatCurrency(claim.netAmount || claim.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span>{getStatusBadge(claim.status)}</span>
            </div>
            {claim.payrollProcessed && (
              <div className="flex justify-between">
                <span className="text-slate-500">Payroll:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Icon icon="heroicons:check-circle" className="w-3 h-3" />
                  Processed
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                <Icon icon="heroicons:user-circle" className="w-4 h-4 text-blue-500" />
                Manager Approval
              </h6>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span>{getApprovalBadge(claim.managerApproval?.status)}</span>
              </div>
              {claim.managerApproval?.date && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-medium text-slate-800">{claim.managerApproval.date}</span>
                </div>
              )}
              {claim.managerApproval?.approver && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Approver:</span>
                  <span className="font-medium text-slate-800">{claim.managerApproval.approver}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                <Icon icon="heroicons:banknotes" className="w-4 h-4 text-emerald-500" />
                Finance Approval
              </h6>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span>{getApprovalBadge(claim.financeApproval?.status)}</span>
              </div>
              {claim.financeApproval?.date && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-medium text-slate-800">{claim.financeApproval.date}</span>
                </div>
              )}
              {claim.financeApproval?.approver && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Approver:</span>
                  <span className="font-medium text-slate-800">{claim.financeApproval.approver}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {claim.description && (
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
                <Icon icon="heroicons:document-text" className="w-4 h-4 text-slate-500" />
                Description
              </h6>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-700">{claim.description}</p>
            </div>
          </div>
        )}

        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-1.5">
              <Icon icon="heroicons:paper-clip" className="w-4 h-4 text-slate-500" />
              Receipt File
            </h6>
            {claim.file && onDownload && (
              <button
                onClick={() => onDownload(claim)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
              >
                <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                Download
              </button>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Icon icon="heroicons:document" className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">{claim.receiptFile || 'No file uploaded'}</p>
                <p className="text-xs text-slate-500">Click download to view the receipt</p>
              </div>
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

export default ClaimDetailsModal;