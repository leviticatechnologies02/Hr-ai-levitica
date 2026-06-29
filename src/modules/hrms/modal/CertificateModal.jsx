import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const CertificateModal = ({ isOpen, onClose, loan, formatCurrency, formatDate, onGenerateCertificate }) => {
  if (!loan) return null;

  const certificateNumber = loan.documents?.certificate?.certificateNumber || `CERT${Date.now()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Loan Repayment Completion Certificate" size="lg">
      <div className="space-y-6 p-2" id="certificate-content">
        <div className="text-center border-b border-slate-200 pb-4">
          <h6 className="font-bold text-blue-600 text-lg">LOAN REPAYMENT COMPLETION CERTIFICATE</h6>
          <p className="text-sm text-slate-500">Certificate No: {certificateNumber}</p>
        </div>

        <div className="space-y-4 text-sm">
          <p>
            This is to certify that <strong>{loan.employeeName}</strong> (Employee ID: {loan.employeeId})
          </p>
          <p>
            has successfully completed the repayment of the loan with the following details:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
          <div>
            <p><span className="text-slate-500">Loan ID:</span> <strong>{loan.loanId}</strong></p>
            <p><span className="text-slate-500">Loan Type:</span> <strong>{loan.loanType}</strong></p>
            <p><span className="text-slate-500">Loan Amount:</span> <strong>{formatCurrency(loan.amount)}</strong></p>
          </div>
          <div>
            <p><span className="text-slate-500">Start Date:</span> <strong>{formatDate(loan.startDate)}</strong></p>
            <p><span className="text-slate-500">Completion Date:</span> <strong>{formatDate(new Date().toISOString().split('T')[0])}</strong></p>
            <p><span className="text-slate-500">Total Interest Paid:</span> <strong>{formatCurrency(loan.amount * loan.interestRate / 100 * loan.tenureMonths / 12)}</strong></p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-sm text-emerald-700">
            The loan account has been closed and all dues have been cleared.
          </p>
          <p className="text-sm font-semibold text-emerald-700 mt-1">
            No dues certificate is hereby issued.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div>
            <div className="border-t-2 border-slate-800 pt-2">
              <p className="font-semibold">Authorized Signatory</p>
              <p className="text-sm text-slate-500">Finance Department</p>
            </div>
          </div>
          <div className="text-right">
            <div className="border-t-2 border-slate-800 pt-2">
              <p className="font-semibold">Date: {formatDate(new Date().toISOString().split('T')[0])}</p>
              <p className="text-sm text-slate-500">Company Seal</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-100">
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
            onClick={handlePrint}
          >
            <Icon icon="heroicons:printer" className="w-4 h-4" />
            Print
          </button>
          {!loan.documents?.certificate?.generated && onGenerateCertificate && (
            <button
              type="button"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              onClick={() => onGenerateCertificate(loan)}
            >
              <Icon icon="heroicons:check-circle" className="w-4 h-4" />
              Generate Certificate
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @media print {
          .modal-header, .modal-footer {
            display: none !important;
          }
          #certificate-content {
            padding: 0 !important;
          }
        }
      `}</style>
    </Modal>
  );
};

export default CertificateModal;