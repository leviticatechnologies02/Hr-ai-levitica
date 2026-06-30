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
  mode = 'self-service',
  employee,
  formatDate,
  getEligibilityBadge,
  getRecommendationBadge,
  onAction
}) => {
  const data = employee || item || record;
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

  const renderEmployeeConfirmationDetails = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h5 className="font-bold text-xl text-slate-800">{data.name}</h5>
          <p className="text-sm text-slate-500">{data.designation} • {data.department}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {getStatusBadge && getStatusBadge(data.status)}
            {getEligibilityBadge && getEligibilityBadge(data.confirmationEligibility)}
          </div>
        </div>
        {data.status !== 'confirmed' && data.status !== 'terminated' && onAction && (
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
            onClick={() => onAction('review', data)}
          >
            <Icon icon="heroicons:document-text" className="w-4 h-4" />
            Initiate Review
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-slate-200 rounded-xl p-4 space-y-2">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:clock" className="w-4 h-4 text-blue-500" />
            Probation & Confirmation Details
          </h6>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Joining Date:</span>
              <span className="font-medium text-slate-800">{formatDate ? formatDate(data.joiningDate) : data.joiningDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Confirmation Due:</span>
              <span className="font-medium text-slate-800">{formatDate ? formatDate(data.confirmationDueDate) : data.confirmationDueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Days Remaining:</span>
              <span className={`font-bold ${data.daysRemaining <= 0 ? 'text-rose-600' : data.daysRemaining <= 7 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {data.daysRemaining <= 0 ? Math.abs(data.daysRemaining) + ' days overdue' : data.daysRemaining + ' days'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Probation Period:</span>
              <span className="font-medium text-slate-800">{data.probationPeriod} days</span>
            </div>
            {data.extensionCount > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Extensions:</span>
                <span className="font-medium text-amber-600">{data.extensionCount} times</span>
              </div>
            )}
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 space-y-2">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:check-badge" className="w-4 h-4 text-emerald-500" />
            Approval Workflow
          </h6>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Manager:</span>
              <span>{getRecommendationBadge ? getRecommendationBadge(data.managerRecommendation) : data.managerRecommendation}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">HR:</span>
              <span>{getRecommendationBadge ? getRecommendationBadge(data.hrRecommendation) : data.hrRecommendation}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Department Head:</span>
              <span>{getRecommendationBadge ? getRecommendationBadge(data.departmentHeadApproval) : data.departmentHeadApproval}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Authority:</span>
              <span>{getRecommendationBadge ? getRecommendationBadge(data.confirmationAuthority) : data.confirmationAuthority}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:document-text" className="w-4 h-4 text-blue-500" />
            Review History
          </h6>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'review30', label: '30 Day Review', completed: data.review30?.completed, date: data.review30?.date, rating: data.review30?.rating },
              { key: 'review60', label: '60 Day Review', completed: data.review60?.completed, date: data.review60?.date, rating: data.review60?.rating },
              { key: 'review90', label: '90 Day Review', completed: data.review90?.completed, date: data.review90?.date, rating: data.review90?.rating }
            ].map((review) => (
              <div key={review.key} className="border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-700">{review.label}</span>
                  {review.completed ? (
                    <Icon icon="heroicons:check-circle" className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Icon icon="heroicons:clock" className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                {review.completed ? (
                  <>
                    <p className="text-xs text-slate-500">Date: {formatDate ? formatDate(review.date) : review.date}</p>
                    <p className="text-xs text-slate-500">Rating: {review.rating}</p>
                  </>
                ) : (
                  <p className="text-xs text-slate-400">Pending</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:user" className="w-4 h-4 text-purple-500" />
            Additional Information
          </h6>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-800">{data.contactEmail}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="text-sm font-medium text-slate-800">{data.contactPhone}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Work Location</p>
              <p className="text-sm font-medium text-slate-800">{data.workLocation}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Employment Type</p>
              <p className="text-sm font-medium text-slate-800">{data.employmentType}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Salary</p>
              <p className="text-sm font-medium text-slate-800">{data.salary}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Manager</p>
              <p className="text-sm font-medium text-slate-800">{data.manager}</p>
            </div>
          </div>
        </div>
      </div>

      {data.skills && data.skills.length > 0 && (
        <div className="border border-slate-200 rounded-xl p-4">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2 mb-2">
            <Icon icon="heroicons:sparkles" className="w-4 h-4 text-amber-500" />
            Skills
          </h6>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.managerComments && (
        <div className="border border-slate-200 rounded-xl p-4">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2 mb-2">
            <Icon icon="heroicons:chat-bubble-left-right" className="w-4 h-4 text-blue-500" />
            Manager Comments
          </h6>
          <p className="text-sm text-slate-600">{data.managerComments}</p>
        </div>
      )}
    </div>
  );

  const renderRequestDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Request Type</label>
        <p className="text-sm text-slate-800 mt-1 capitalize">{data.type}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{data.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</div>
      </div>
      {data.amount && (
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</label>
          <p className="text-sm font-semibold text-slate-800 mt-1">{formatValue(data.amount)}</p>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
        <p className="text-sm text-slate-700 mt-1">{data.description}</p>
      </div>
      {data.rejectionReason && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Rejection Reason</label>
          <div className="mt-1 p-3 bg-rose-50 rounded-xl border border-rose-200">
            <p className="text-sm text-rose-700">{data.rejectionReason}</p>
          </div>
        </div>
      )}
      {data.approvalHistory && data.approvalHistory.length > 0 && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approval History</label>
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
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">From</label>
          <p className="text-sm text-slate-800 mt-1">{data.from}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
          <p className="text-sm text-slate-800 mt-1">{data.date}</p>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{data.subject}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</label>
        <div className="mt-1 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{data.content || 'No content available.'}</p>
        </div>
      </div>
    </div>
  );

  const renderTicketDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{data.id}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{data.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</label>
        <div className="mt-1">{getPriorityBadge ? getPriorityBadge(data.priority) : data.priority}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
        <p className="text-sm text-slate-800 mt-1 capitalize">{data.category}</p>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
        <p className="text-sm text-slate-800 mt-1">{data.subject}</p>
      </div>
      {data.description && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
          <p className="text-sm text-slate-700 mt-1">{data.description}</p>
        </div>
      )}
    </div>
  );

  const renderPayslipDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</label>
        <p className="text-sm text-slate-800 mt-1">{data.month}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{formatValue(data.amount)}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</div>
      </div>
    </div>
  );

  const renderAttendanceDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{data.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Check In</label>
        <p className="text-sm text-slate-800 mt-1">{data.checkIn || '-'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Check Out</label>
        <p className="text-sm text-slate-800 mt-1">{data.checkOut || '-'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hours</label>
        <p className="text-sm text-slate-800 mt-1">{data.hours || '0'}</p>
      </div>
    </div>
  );

  const renderDocumentDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Document</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{data.name}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
        <p className="text-sm text-slate-800 mt-1 capitalize">{data.type}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
        <p className="text-sm text-slate-800 mt-1">{data.date}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</label>
        <p className="text-sm text-slate-800 mt-1">{data.size}</p>
      </div>
    </div>
  );

  const renderPayrollRunDetails = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payroll ID</label>
        <p className="text-sm font-medium text-slate-800 mt-1">{data.id}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</label>
        <p className="text-sm text-slate-700 mt-1">{data.month}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
        <p className="text-sm mt-1">{getTypeBadge ? getTypeBadge(data.type) : data.type}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <p className="text-sm mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount</label>
        <p className="text-sm font-bold text-blue-600 mt-1">{formatValue(data.totalAmount)}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employees</label>
        <p className="text-sm text-slate-700 mt-1">{data.employeesCount}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processed Date</label>
        <p className="text-sm text-slate-700 mt-1">{data.processedDate || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid Date</label>
        <p className="text-sm text-slate-700 mt-1">{data.paidDate || 'N/A'}</p>
      </div>
      {data.details && (
        <>
          <div className="sm:col-span-2 border-t border-slate-200 pt-4 mt-2">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Financial Breakdown</h6>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Earnings</label>
            <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.totalEarnings)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Deductions</label>
            <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.totalDeductions)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tax Amount</label>
            <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.taxAmount)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PF Amount</label>
            <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.pfAmount)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ESI Amount</label>
            <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.esiAmount)}</p>
          </div>
          {data.details.arrearsIncluded > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Arrears Included</label>
              <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.arrearsIncluded)}</p>
            </div>
          )}
          {data.details.loanEMI > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loan EMI</label>
              <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.loanEMI)}</p>
            </div>
          )}
          {data.details.advanceRecovery > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Advance Recovery</label>
              <p className="text-sm text-slate-700 mt-1">{formatValue(data.details.advanceRecovery)}</p>
            </div>
          )}
          {data.details.heldEmployeesCount > 0 && (
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Held Employees</label>
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
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Check Name</label>
          <p className="text-sm font-medium text-slate-800 mt-1">{data.checkName}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
          <p className="text-sm mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</label>
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
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
        <div className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-700">{data.description}</p>
        </div>
      </div>
      {data.details && (
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</label>
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
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payroll ID</label>
        <p className="text-sm font-medium text-slate-800 mt-1">{data.payrollId}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approver</label>
        <p className="text-sm text-slate-700 mt-1">{data.approver}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</label>
        <p className="text-sm text-slate-700 mt-1">
          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {data.role}
          </span>
        </p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <p className="text-sm mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted Date</label>
        <p className="text-sm text-slate-700 mt-1">{data.submittedDate}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {data.status === 'approved' ? 'Approved Date' :
           data.status === 'rejected' ? 'Rejected Date' : 'Expected Date'}
        </label>
        <p className="text-sm text-slate-700 mt-1">{data.approvedDate || data.rejectedDate || 'N/A'}</p>
      </div>
      {data.comments && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Comments</label>
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
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee Name</label>
        <p className="text-sm font-medium text-slate-800 mt-1">{data.employeeName}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee ID</label>
        <p className="text-sm text-slate-700 mt-1">{data.employeeId}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</label>
        <p className="text-sm text-slate-700 mt-1">{data.department}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
        <p className="text-sm text-slate-700 mt-1">{data.location}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Basic Salary</label>
        <p className="text-sm font-semibold text-slate-800 mt-1">{formatValue(data.basicSalary)}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Pay</label>
        <p className="text-sm font-bold text-blue-600 mt-1">{formatValue(data.netPay)}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present Days</label>
        <p className="text-sm text-emerald-600 font-semibold mt-1">{data.totalPresent}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Absent Days</label>
        <p className="text-sm text-rose-600 font-semibold mt-1">{data.totalAbsent}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overtime Hours</label>
        <p className="text-sm text-amber-600 font-semibold mt-1">{data.totalOvertime}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
        <div className="mt-1">{getStatusBadge ? getStatusBadge(data.status) : data.status}</div>
      </div>
      {data.lossOfPay > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loss of Pay</label>
          <p className="text-sm text-rose-600 font-semibold mt-1">{formatValue(data.lossOfPay)}</p>
        </div>
      )}
      {data.overtimePay > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overtime Pay</label>
          <p className="text-sm text-emerald-600 font-semibold mt-1">{formatValue(data.overtimePay)}</p>
        </div>
      )}
      {data.holidayPay > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Holiday Pay</label>
          <p className="text-sm text-emerald-600 font-semibold mt-1">{formatValue(data.holidayPay)}</p>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</label>
        <p className="text-sm text-slate-700 mt-1">{data.lastUpdated || 'N/A'}</p>
      </div>
    </div>
  );

  const getTitle = () => {
    if (mode === 'employee-confirmation' || (employee && mode === 'employee')) {
      return `Employee Details - ${data.name || 'Employee'}`;
    }
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
    if (mode === 'employee-confirmation' || (employee && mode === 'employee')) {
      return renderEmployeeConfirmationDetails();
    }
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