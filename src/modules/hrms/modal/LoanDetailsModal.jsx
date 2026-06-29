import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const LoanDetailsModal = ({ 
  isOpen, 
  onClose, 
  loan, 
  formatCurrency, 
  formatDate, 
  getStatusBadge, 
  getLoanTypeBadge,
  getApplicationStatusBadge 
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  if (!loan) return null;

  const documentLabels = {
    applicationForm: 'Application Form',
    identityProof: 'Identity Proof',
    salarySlips: 'Salary Slips',
    agreement: 'Agreement',
    certificate: 'Certificate'
  };

  const getDocumentLabel = (docKey) => {
    return documentLabels[docKey] || docKey;
  };

  const renderBasicDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-3">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:information-circle" className="w-4 h-4 text-blue-500" />
            Loan Information
          </h6>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Loan ID:</span>
              <span className="font-semibold text-slate-800">{loan.loanId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Loan Type:</span>
              <span>{getLoanTypeBadge(loan.loanType)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Amount:</span>
              <span className="font-bold text-blue-600">{formatCurrency(loan.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Interest Rate:</span>
              <span className="font-semibold text-slate-800">{loan.interestRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span>{getStatusBadge(loan.status)}</span>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-3">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:user" className="w-4 h-4 text-emerald-500" />
            Employee Information
          </h6>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Employee Name:</span>
              <span className="font-semibold text-slate-800">{loan.employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Employee ID:</span>
              <span className="font-semibold text-slate-800">{loan.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="text-slate-700">{loan.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Designation:</span>
              <span className="text-slate-700">{loan.designation}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-slate-200 p-4 rounded-2xl bg-white">
          <div className="text-center">
            <p className="text-xs text-slate-500">Start Date</p>
            <p className="font-semibold text-slate-800">{formatDate(loan.startDate)}</p>
          </div>
        </div>
        <div className="border border-slate-200 p-4 rounded-2xl bg-white">
          <div className="text-center">
            <p className="text-xs text-slate-500">End Date</p>
            <p className="font-semibold text-slate-800">{formatDate(loan.endDate)}</p>
          </div>
        </div>
        <div className="border border-slate-200 p-4 rounded-2xl bg-white">
          <div className="text-center">
            <p className="text-xs text-slate-500">Tenure</p>
            <p className="font-semibold text-slate-800">{loan.tenureMonths} months</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-slate-200 p-4 rounded-2xl bg-blue-50">
          <div className="text-center">
            <p className="text-xs text-blue-600">Monthly EMI</p>
            <p className="font-bold text-blue-700">{formatCurrency(loan.monthlyEMI)}</p>
          </div>
        </div>
        <div className="border border-slate-200 p-4 rounded-2xl bg-emerald-50">
          <div className="text-center">
            <p className="text-xs text-emerald-600">Amount Paid</p>
            <p className="font-bold text-emerald-700">{formatCurrency(loan.amountPaid)}</p>
          </div>
        </div>
        <div className="border border-slate-200 p-4 rounded-2xl bg-amber-50">
          <div className="text-center">
            <p className="text-xs text-amber-600">Amount Pending</p>
            <p className="font-bold text-amber-700">{formatCurrency(loan.amountPending)}</p>
          </div>
        </div>
      </div>

      {loan.nextDueDate && loan.nextDueDate !== 'N/A' && (
        <div className="border border-slate-200 p-4 rounded-2xl bg-white">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Next Due Date:</span>
            <span className="font-semibold text-rose-600">{formatDate(loan.nextDueDate)}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderApprovalWorkflow = () => (
    <div className="space-y-4">
      {loan.approvalWorkflow?.map((approval, index) => (
        <div key={index} className="flex items-start gap-4 p-4 border border-slate-200 rounded-2xl bg-white">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              approval.status === 'approved' ? 'bg-emerald-100' :
              approval.status === 'rejected' ? 'bg-rose-100' :
              'bg-amber-100'
            }`}>
              <Icon 
                icon={
                  approval.status === 'approved' ? 'heroicons:check-circle' :
                  approval.status === 'rejected' ? 'heroicons:x-circle' :
                  'heroicons:clock'
                }
                className={`w-5 h-5 ${
                  approval.status === 'approved' ? 'text-emerald-600' :
                  approval.status === 'rejected' ? 'text-rose-600' :
                  'text-amber-600'
                }`}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h6 className="font-semibold text-slate-800 capitalize">{approval.level}</h6>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                approval.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                approval.status === 'rejected' ? 'bg-rose-50 text-rose-700' :
                'bg-amber-50 text-amber-700'
              }`}>
                {approval.status}
              </span>
            </div>
            {approval.approvedBy && (
              <p className="text-sm text-slate-600 mt-1">Approved by: {approval.approvedBy}</p>
            )}
            {approval.date && (
              <p className="text-xs text-slate-500 mt-1">Date: {formatDate(approval.date)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-3">
      {loan.documents && Object.entries(loan.documents).map(([doc, status]) => {
        const isCompleted = status.verified || status.generated || status.signed;
        return (
          <div key={doc} className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-white">
            <div className="flex items-center gap-3">
              <Icon icon="heroicons:document-text" className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-slate-800">{getDocumentLabel(doc)}</p>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {status.verified ? 'Verified' :
                   status.generated ? 'Generated' :
                   status.signed ? 'Signed' : 'Pending'}
                </span>
              </div>
            </div>
            <button className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition">
              <Icon icon="heroicons:eye" className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );

  const renderDisbursement = () => (
    <div className="space-y-4">
      {loan.disbursement?.status === 'completed' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2">
            <h6 className="font-semibold text-sm text-slate-700">Disbursement Details</h6>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-medium text-slate-800">{loan.disbursement.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Name:</span>
                <span className="font-medium text-slate-800">{loan.disbursement.bankDetails?.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Number:</span>
                <span className="font-medium text-slate-800">{loan.disbursement.bankDetails?.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursement Date:</span>
                <span className="font-medium text-slate-800">{formatDate(loan.disbursement.disbursementDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-medium text-slate-800">{loan.disbursement.transactionId}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500 font-semibold">Disbursement Amount:</span>
                <span className="font-bold text-blue-600">{formatCurrency(loan.disbursement.disbursementAmount)}</span>
              </div>
            </div>
          </div>

          {loan.emiSchedule && loan.emiSchedule.length > 0 && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <h6 className="font-semibold text-sm text-slate-700">EMI Schedule</h6>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Month</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Due Date</th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-600">Amount</th>
                      <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loan.emiSchedule.map((emi, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 text-slate-700">{emi.month}</td>
                        <td className="px-3 py-2 text-slate-700">{formatDate(emi.dueDate)}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-800">{formatCurrency(emi.amount)}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            emi.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                            emi.status === 'due' ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-50 text-slate-700'
                          }`}>
                            {emi.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon icon="heroicons:clock" className="w-12 h-12 mx-auto text-amber-500 mb-3" />
          <p className="text-slate-600">Disbursement not completed yet.</p>
          <p className="text-sm text-slate-400">The loan has been approved but funds have not been disbursed.</p>
        </div>
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Loan Details - ${loan.loanId}`} size="xl">
      <div className="space-y-6 p-2">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'basic', label: 'Basic Details', icon: 'heroicons:information-circle' },
            { id: 'approval', label: 'Approval Workflow', icon: 'heroicons:check-badge' },
            { id: 'documents', label: 'Documents', icon: 'heroicons:document-text' },
            { id: 'disbursement', label: 'Disbursement', icon: 'heroicons:arrow-up-tray' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon icon={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'basic' && renderBasicDetails()}
          {activeTab === 'approval' && renderApprovalWorkflow()}
          {activeTab === 'documents' && renderDocuments()}
          {activeTab === 'disbursement' && renderDisbursement()}
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

export default LoanDetailsModal;