import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const DetailsModal = ({
  isOpen,
  onClose,
  item,
  section,
  getStatusBadge,
  getPriorityBadge,
  getTypeBadge,
  formatCurrency
}) => {
  if (!item) return null;

  // Employee Self Service Section Renderers
  const renderRequestDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Request Type</label>
        <p className="text-sm text-slate-800 mt-1 capitalize">{item.type}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{item.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge(item.status)}</div>
      </div>
      {item.amount && (
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</label>
          <p className="text-sm font-semibold text-slate-800 mt-1">{formatCurrency ? formatCurrency(item.amount) : item.amount}</p>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
        <p className="text-sm text-slate-700 mt-1">{item.description}</p>
      </div>
      {item.rejectionReason && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Rejection Reason</label>
          <div className="mt-1 p-3 bg-rose-50 rounded-xl border border-rose-200">
            <p className="text-sm text-rose-700">{item.rejectionReason}</p>
          </div>
        </div>
      )}
      {item.approvalHistory && item.approvalHistory.length > 0 && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approval History</label>
          <div className="mt-2 space-y-2">
            {item.approvalHistory.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-700">{step.step}</p>
                  <p className="text-xs text-slate-500">By: {step.by} • {step.date}</p>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${step.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    step.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                      step.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMessageDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">From</label>
          <p className="text-sm text-slate-800 mt-1">{item.from}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
          <p className="text-sm text-slate-800 mt-1">{item.date}</p>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{item.subject}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</label>
        <div className="mt-1 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{item.content || 'No content available.'}</p>
        </div>
      </div>
    </div>
  );

  const renderTicketDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{item.id}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{item.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge(item.status)}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</label>
        <div className="mt-1">{getPriorityBadge(item.priority)}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
        <p className="text-sm text-slate-800 mt-1 capitalize">{item.category}</p>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
        <p className="text-sm text-slate-800 mt-1">{item.subject}</p>
      </div>
      {item.description && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
          <p className="text-sm text-slate-700 mt-1">{item.description}</p>
        </div>
      )}
    </div>
  );

  const renderPayslipDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</label>
        <p className="text-sm text-slate-800 mt-1">{item.month}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{formatCurrency ? formatCurrency(item.amount) : item.amount}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge(item.status)}</div>
      </div>
    </div>
  );

  const renderAttendanceDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{item.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge(item.status)}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Check In</label>
        <p className="text-sm text-slate-800 mt-1">{item.checkIn || '-'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Check Out</label>
        <p className="text-sm text-slate-800 mt-1">{item.checkOut || '-'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hours</label>
        <p className="text-sm text-slate-800 mt-1">{item.hours || '0'}</p>
      </div>
    </div>
  );

  const renderDocumentDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Document</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{item.name}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
        <p className="text-sm text-slate-800 mt-1 capitalize">{item.type}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{item.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</label>
        <p className="text-sm text-slate-800 mt-1">{item.size}</p>
      </div>
    </div>
  );

  // Payroll Section Renderers
  const renderPayrollRunDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payroll ID</label>
        <p className="text-sm font-medium text-slate-800 mt-1">{item.id}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</label>
        <p className="text-sm text-slate-700 mt-1">{item.month}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
        <p className="text-sm mt-1">{getTypeBadge ? getTypeBadge(item.type) : item.type}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <p className="text-sm mt-1">{getStatusBadge(item.status)}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount</label>
        <p className="text-sm font-bold text-blue-600 mt-1">{formatCurrency ? formatCurrency(item.totalAmount) : item.totalAmount}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employees</label>
        <p className="text-sm text-slate-700 mt-1">{item.employeesCount}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processed Date</label>
        <p className="text-sm text-slate-700 mt-1">{item.processedDate || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid Date</label>
        <p className="text-sm text-slate-700 mt-1">{item.paidDate || 'N/A'}</p>
      </div>
      {item.details && (
        <>
          <div className="sm:col-span-2 border-t border-slate-200 pt-4 mt-2">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Financial Breakdown</h6>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Earnings</label>
            <p className="text-sm text-slate-700 mt-1">{formatCurrency ? formatCurrency(item.details.totalEarnings) : item.details.totalEarnings}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Deductions</label>
            <p className="text-sm text-slate-700 mt-1">{formatCurrency ? formatCurrency(item.details.totalDeductions) : item.details.totalDeductions}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tax Amount</label>
            <p className="text-sm text-slate-700 mt-1">{formatCurrency ? formatCurrency(item.details.taxAmount) : item.details.taxAmount}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PF Amount</label>
            <p className="text-sm text-slate-700 mt-1">{formatCurrency ? formatCurrency(item.details.pfAmount) : item.details.pfAmount}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ESI Amount</label>
            <p className="text-sm text-slate-700 mt-1">{formatCurrency ? formatCurrency(item.details.esiAmount) : item.details.esiAmount}</p>
          </div>
          {item.details.arrearsIncluded > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Arrears Included</label>
              <p className="text-sm text-slate-700 mt-1">{formatCurrency ? formatCurrency(item.details.arrearsIncluded) : item.details.arrearsIncluded}</p>
            </div>
          )}
          {item.details.loanEMI > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loan EMI</label>
              <p className="text-sm text-slate-700 mt-1">{formatCurrency ? formatCurrency(item.details.loanEMI) : item.details.loanEMI}</p>
            </div>
          )}
          {item.details.advanceRecovery > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Advance Recovery</label>
              <p className="text-sm text-slate-700 mt-1">{formatCurrency ? formatCurrency(item.details.advanceRecovery) : item.details.advanceRecovery}</p>
            </div>
          )}
          {item.details.heldEmployeesCount > 0 && (
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Held Employees</label>
              <p className="text-sm text-rose-600 mt-1">{item.details.heldEmployeesCount} employees</p>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderValidationDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Check Name</label>
          <p className="text-sm font-medium text-slate-800 mt-1">{item.checkName}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
          <p className="text-sm mt-1">{getStatusBadge(item.status)}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</label>
          <p className="text-sm mt-1">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${item.severity === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                item.severity === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  'bg-blue-50 text-blue-700 border border-blue-100'
              }`}>
              {item.severity}
            </span>
          </p>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
        <div className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-700">{item.description}</p>
        </div>
      </div>
      {item.details && (
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</label>
          <div className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-700">{item.details}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderApprovalDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payroll ID</label>
        <p className="text-sm font-medium text-slate-800 mt-1">{item.payrollId}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approver</label>
        <p className="text-sm text-slate-700 mt-1">{item.approver}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</label>
        <p className="text-sm text-slate-700 mt-1">
          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {item.role}
          </span>
        </p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <p className="text-sm mt-1">{getStatusBadge(item.status)}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted Date</label>
        <p className="text-sm text-slate-700 mt-1">{item.submittedDate}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {item.status === 'approved' ? 'Approved Date' :
            item.status === 'rejected' ? 'Rejected Date' : 'Expected Date'}
        </label>
        <p className="text-sm text-slate-700 mt-1">{item.approvedDate || item.rejectedDate || 'N/A'}</p>
      </div>
      {item.comments && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Comments</label>
          <div className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-700">{item.comments}</p>
          </div>
        </div>
      )}
    </div>
  );

  const getTitle = () => {
    switch (section) {
      case 'requests': return 'Request Details';
      case 'messages': return 'Message Details';
      case 'tickets': return 'Ticket Details';
      case 'payslips': return 'Payslip Details';
      case 'attendance': return 'Attendance Details';
      case 'documents': return 'Document Details';
      case 'runs': return 'Payroll Run Details';
      case 'validation': return 'Validation Details';
      case 'approvals': return 'Approval Details';
      default: return 'Details';
    }
  };

  const renderContent = () => {
    switch (section) {
      // Employee Self Service sections
      case 'requests': return renderRequestDetails();
      case 'messages': return renderMessageDetails();
      case 'tickets': return renderTicketDetails();
      case 'payslips': return renderPayslipDetails();
      case 'attendance': return renderAttendanceDetails();
      case 'documents': return renderDocumentDetails();
      // Payroll sections
      case 'runs': return renderPayrollRunDetails();
      case 'validation': return renderValidationDetails();
      case 'approvals': return renderApprovalDetails();
      default: return renderRequestDetails();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="lg">
      <div className="space-y-4">
        {renderContent()}
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

export default DetailsModal;