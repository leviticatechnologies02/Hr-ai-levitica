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
  formatCurrency,
  record,
  onExport,
  mode = 'self-service' 
}) => {
  const data = item || record;
  const currentSection = section || 'details';

  if (!data) return null;

  const formatValue = (value) => {
    if (value == null) return 'N/A';
    if (typeof value === 'number' && formatCurrency) {
      return formatCurrency(value);
    }
    if (typeof value === 'string' && value.startsWith('₹')) {
      return value;
    }
    return value;
  };

  const renderRequestDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Request Type</label>
        <p className="text-sm text-slate-800 mt-1 capitalize">{data.type}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{data.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</div>
      </div>
      {data.amount && (
        <div>
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Amount</label>
          <p className="text-sm font-semibold text-slate-800 mt-1">{formatValue(data.amount)}</p>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Description</label>
        <p className="text-sm text-slate-700 mt-1">{data.description}</p>
      </div>
      {data.rejectionReason && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-rose-500  tracking-wider">Rejection Reason</label>
          <div className="mt-1 p-3 bg-rose-50 rounded-xl border border-rose-200">
            <p className="text-sm text-rose-700">{data.rejectionReason}</p>
          </div>
        </div>
      )}
      {data.approvalHistory && data.approvalHistory.length > 0 && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Approval History</label>
          <div className="mt-2 space-y-2">
            {data.approvalHistory.map((step, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-700">{step.step}</p>
                  <p className="text-xs text-slate-500">By: {step.by} • {step.date}</p>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  step.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
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
          <label className="text-xs font-semibold text-slate-500  tracking-wider">From</label>
          <p className="text-sm text-slate-800 mt-1">{data.from}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Date</label>
          <p className="text-sm text-slate-800 mt-1">{data.date}</p>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Subject</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{data.subject}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Message</label>
        <div className="mt-1 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{data.content || 'No content available.'}</p>
        </div>
      </div>
    </div>
  );

  const renderTicketDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Ticket ID</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{data.id}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{data.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Priority</label>
        <div className="mt-1">{getPriorityBadge ? getPriorityBadge(data.priority) : data.priority}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Category</label>
        <p className="text-sm text-slate-800 mt-1 capitalize">{data.category}</p>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Subject</label>
        <p className="text-sm text-slate-800 mt-1">{data.subject}</p>
      </div>
      {data.description && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Description</label>
          <p className="text-sm text-slate-700 mt-1">{data.description}</p>
        </div>
      )}
    </div>
  );

  const renderPayslipDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Month</label>
        <p className="text-sm text-slate-800 mt-1">{data.month}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Amount</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{formatValue(data.amount)}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</div>
      </div>
    </div>
  );

  const renderAttendanceDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{data.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Check In</label>
        <p className="text-sm text-slate-800 mt-1">{data.checkIn || '-'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Check Out</label>
        <p className="text-sm text-slate-800 mt-1">{data.checkOut || '-'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Hours</label>
        <p className="text-sm text-slate-800 mt-1">{data.hours || '0'}</p>
      </div>
    </div>
  );

  const renderDocumentDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Document</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{data.name}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Type</label>
        <p className="text-sm text-slate-800 mt-1 capitalize">{data.type}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{data.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Size</label>
        <p className="text-sm text-slate-800 mt-1">{data.size}</p>
      </div>
    </div>
  );

  const renderPayrollRunDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Payroll ID</label>
        <p className="text-sm font-medium text-slate-800 mt-1">{data.id}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Month</label>
        <p className="text-sm text-slate-700 mt-1">{data.month}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Type</label>
        <p className="text-sm mt-1">{getTypeBadge ? getTypeBadge(data.type) : data.type}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Status</label>
        <p className="text-sm mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Total Amount</label>
        <p className="text-sm font-bold text-blue-600 mt-1">{formatValue(data.totalAmount)}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Employees</label>
        <p className="text-sm text-slate-700 mt-1">{data.employeesCount}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Processed Date</label>
        <p className="text-sm text-slate-700 mt-1">{data.processedDate || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Paid Date</label>
        <p className="text-sm text-slate-700 mt-1">{data.paidDate || 'N/A'}</p>
      </div>
      {data.details && (
        <>
          <div className="sm:col-span-2 border-t border-slate-200 pt-4 mt-2">
            <h6 className="text-xs font-bold text-slate-600  tracking-wider mb-3">Financial Breakdown</h6>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500  tracking-wider">Total Earnings</label>
            <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.totalEarnings)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500  tracking-wider">Total Deductions</label>
            <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.totalDeductions)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500  tracking-wider">Tax Amount</label>
            <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.taxAmount)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500  tracking-wider">PF Amount</label>
            <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.pfAmount)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500  tracking-wider">ESI Amount</label>
            <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.esiAmount)}</p>
          </div>
          {data.details.arrearsIncluded > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500  tracking-wider">Arrears Included</label>
              <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.arrearsIncluded)}</p>
            </div>
          )}
          {data.details.loanEMI > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500  tracking-wider">Loan EMI</label>
              <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.loanEMI)}</p>
            </div>
          )}
          {data.details.advanceRecovery > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500  tracking-wider">Advance Recovery</label>
              <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.advanceRecovery)}</p>
            </div>
          )}
          {data.details.heldEmployeesCount > 0 && (
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500  tracking-wider">Held Employees</label>
              <p className="text-sm text-rose-600 mt-1">{data.details.heldEmployeesCount} employees</p>
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
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Check Name</label>
          <p className="text-sm font-medium text-slate-800 mt-1">{data.checkName}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Status</label>
          <p className="text-sm mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Severity</label>
          <p className="text-sm mt-1">
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
              data.severity === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
              data.severity === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
              'bg-blue-50 text-blue-700 border border-blue-100'
            }`}>
              {data.severity}
            </span>
          </p>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Description</label>
        <div className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-700">{data.description}</p>
        </div>
      </div>
      {data.details && (
        <div>
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Details</label>
          <div className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-700">{data.details}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderApprovalDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Payroll ID</label>
        <p className="text-sm font-medium text-slate-800 mt-1">{data.payrollId}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Approver</label>
        <p className="text-sm text-slate-700 mt-1">{data.approver}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Role</label>
        <p className="text-sm text-slate-700 mt-1">
          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {data.role}
          </span>
        </p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Status</label>
        <p className="text-sm mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Submitted Date</label>
        <p className="text-sm text-slate-700 mt-1">{data.submittedDate}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">
          {data.status === 'approved' ? 'Approved Date' :
           data.status === 'rejected' ? 'Rejected Date' : 'Expected Date'}
        </label>
        <p className="text-sm text-slate-700 mt-1">{data.approvedDate || data.rejectedDate || 'N/A'}</p>
      </div>
      {data.comments && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Comments</label>
          <div className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-700">{data.comments}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderIntegrationDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Employee Name</label>
        <p className="text-sm font-medium text-slate-800 mt-1">{data.employeeName}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Employee ID</label>
        <p className="text-sm text-slate-700 mt-1">{data.employeeId}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Department</label>
        <p className="text-sm text-slate-700 mt-1">{data.department}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Location</label>
        <p className="text-sm text-slate-700 mt-1">{data.location}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Basic Salary</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{formatValue(data.basicSalary)}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Net Pay</label>
        <p className="text-sm font-bold text-blue-600 mt-1">{formatValue(data.netPay)}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Present Days</label>
        <p className="text-sm text-emerald-600 font-semibold mt-1">{data.totalPresent}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Absent Days</label>
        <p className="text-sm text-rose-600 font-semibold mt-1">{data.totalAbsent}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Overtime Hours</label>
        <p className="text-sm text-amber-600 font-semibold mt-1">{data.totalOvertime}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</div>
      </div>
      {data.lossOfPay > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Loss of Pay</label>
          <p className="text-sm text-rose-600 font-semibold mt-1">{formatValue(data.lossOfPay)}</p>
        </div>
      )}
      {data.overtimePay > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Overtime Pay</label>
          <p className="text-sm text-emerald-600 font-semibold mt-1">{formatValue(data.overtimePay)}</p>
        </div>
      )}
      {data.holidayPay > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-500  tracking-wider">Holiday Pay</label>
          <p className="text-sm text-emerald-600 font-semibold mt-1">{formatValue(data.holidayPay)}</p>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-500  tracking-wider">Last Updated</label>
        <p className="text-sm text-slate-700 mt-1">{data.lastUpdated || 'N/A'}</p>
      </div>
    </div>
  );

  const getTitle = () => {
    if (mode === 'integration') {
      return `Payroll Details: ${data.employeeName || 'Employee'}`;
    }
    switch (currentSection) {
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
    if (mode === 'integration') {
      return renderIntegrationDetails();
    }

    switch (currentSection) {
      case 'requests': return renderRequestDetails();
      case 'messages': return renderMessageDetails();
      case 'tickets': return renderTicketDetails();
      case 'payslips': return renderPayslipDetails();
      case 'attendance': return renderAttendanceDetails();
      case 'documents': return renderDocumentDetails();
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
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
          {mode === 'integration' && onExport && (
            <button
              type="button"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
              onClick={() => onExport(data)}
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              Export Details
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DetailsModal;