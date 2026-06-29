import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ViewDetailsModal = ({ 
  isOpen, 
  onClose, 
  data, 
  type, 
  formatCurrency, 
  getStatusBadge, 
  getTypeBadge, 
  formatDate,
  onDownload 
}) => {
  if (!data) return null;

  const renderContent = () => {
    switch(type) {
      case 'employee':
        return (
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:user" className="w-4 h-4 text-blue-500" />
                  Personal Information
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Employee Name:</span>
                  <span className="font-bold text-slate-800">{data.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Employee ID:</span>
                  <span className="font-bold text-slate-800">{data.employeeId}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Department:</span>
                  <span className="font-bold text-slate-800">{data.department}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Date of Joining:</span>
                  <span className="font-bold text-slate-800">{formatDate(data.doj)}</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:currency-dollar" className="w-4 h-4 text-emerald-500" />
                  Salary Details
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Basic Salary:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(data.basicSalary)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Gross Salary:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(data.grossSalary)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>PF Contribution:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(data.pfContribution)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ESI Contribution:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(data.esiContribution)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>TDS Deduction:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(data.tdsDeduction)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Professional Tax:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(data.ptDeduction)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:identification" className="w-4 h-4 text-purple-500" />
                  Statutory Information
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>PF UAN Number:</span>
                  <span className="font-bold text-slate-800">{data.pfUAN || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ESI Number:</span>
                  <span className="font-bold text-slate-800">{data.esiNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>PF Eligible:</span>
                  <span className="font-bold text-slate-800">{data.pfEligible ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ESI Eligible:</span>
                  <span className="font-bold text-slate-800">{data.esiEligible ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:calendar" className="w-4 h-4 text-amber-500" />
                  Additional Information
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Last Declaration:</span>
                  <span className="font-bold text-slate-800">{formatDate(data.lastDeclaration)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Status:</span>
                  <span>{getStatusBadge(data.status)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pfStatement':
        return (
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:document-text" className="w-4 h-4 text-blue-500" />
                  PF Statement Details
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Employee ID:</span>
                  <span className="font-bold text-slate-800">{data.employeeId}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Month:</span>
                  <span className="font-bold text-slate-800">{data.month}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Status:</span>
                  <span>{getStatusBadge(data.status)}</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:currency-dollar" className="w-4 h-4 text-emerald-500" />
                  Contribution Details
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Employee Contribution:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(data.employeeContribution)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Employer Contribution:</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(data.employerContribution)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total PF:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(data.total)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'form':
        return (
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:document-text" className="w-4 h-4 text-blue-500" />
                  Form Details
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Form Name:</span>
                  <span className="font-bold text-slate-800">{data.formName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Employee Name:</span>
                  <span className="font-bold text-slate-800">{data.employeeName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Period:</span>
                  <span className="font-bold text-slate-800">{data.financialYear || data.period}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Status:</span>
                  <span>{getStatusBadge(data.status)}</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:calendar" className="w-4 h-4 text-amber-500" />
                  Dates
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Generated Date:</span>
                  <span className="font-bold text-slate-800">{formatDate(data.generatedDate)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Submitted Date:</span>
                  <span className="font-bold text-slate-800">{formatDate(data.submittedDate)}</span>
                </div>
                {data.dueDate && (
                  <div className="flex justify-between text-slate-600">
                    <span>Due Date:</span>
                    <span className="font-bold text-rose-600">{formatDate(data.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'ecr':
        return (
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:document-text" className="w-4 h-4 text-blue-500" />
                  ECR Details
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Month:</span>
                  <span className="font-bold text-slate-800">{data.month}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Employees:</span>
                  <span className="font-bold text-slate-800">{data.totalEmployees}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Status:</span>
                  <span>{getStatusBadge(data.status)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Submitted Date:</span>
                  <span className="font-bold text-slate-800">{formatDate(data.submittedDate)}</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:currency-dollar" className="w-4 h-4 text-emerald-500" />
                  Contribution Details
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Total Wages:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(data.totalWages)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>EPF Contribution:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(data.epfContribution)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>EPS Contribution:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(data.epsContribution)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>EDLI Contribution:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(data.edliContribution)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'vpf':
        return (
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:user" className="w-4 h-4 text-blue-500" />
                  Employee Details
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Employee Name:</span>
                  <span className="font-bold text-slate-800">{data.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Employee ID:</span>
                  <span className="font-bold text-slate-800">{data.employeeId}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Month:</span>
                  <span className="font-bold text-slate-800">{data.month}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Status:</span>
                  <span>{getStatusBadge(data.status)}</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:currency-dollar" className="w-4 h-4 text-emerald-500" />
                  VPF Details
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>VPF Rate:</span>
                  <span className="font-bold text-blue-600">{data.vpfRate}%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>VPF Amount:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(data.vpfAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'declaration':
        return (
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:clipboard-document-check" className="w-4 h-4 text-blue-500" />
                  Declaration Details
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Employee Name:</span>
                  <span className="font-bold text-slate-800">{data.employeeName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Financial Year:</span>
                  <span className="font-bold text-slate-800">{data.financialYear}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Status:</span>
                  <span>{getStatusBadge(data.status)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Verified:</span>
                  <span className="font-bold text-slate-800">{data.verified ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:calendar" className="w-4 h-4 text-amber-500" />
                  Dates
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Submitted Date:</span>
                  <span className="font-bold text-slate-800">{formatDate(data.submittedDate)}</span>
                </div>
                {data.dueDate && (
                  <div className="flex justify-between text-slate-600">
                    <span>Due Date:</span>
                    <span className="font-bold text-rose-600">{formatDate(data.dueDate)}</span>
                  </div>
                )}
                {data.lastModified && (
                  <div className="flex justify-between text-slate-600">
                    <span>Last Modified:</span>
                    <span className="font-bold text-slate-800">{formatDate(data.lastModified)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'report':
        return (
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:chart-bar" className="w-4 h-4 text-blue-500" />
                  Report Details
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Report Name:</span>
                  <span className="font-bold text-slate-800">{data.reportName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Period:</span>
                  <span className="font-bold text-slate-800">{data.period}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Type:</span>
                  <span>{getTypeBadge(data.type)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Status:</span>
                  <span>{getStatusBadge(data.status)}</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:calendar" className="w-4 h-4 text-amber-500" />
                  Progress
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Generated Date:</span>
                  <span className="font-bold text-slate-800">{formatDate(data.generatedDate)}</span>
                </div>
                {data.progress && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Progress:</span>
                      <span className="font-bold text-blue-600">{data.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${data.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-slate-50 rounded-xl overflow-x-auto">
            <pre className="text-xs text-slate-700">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'employee': return 'Employee Details';
      case 'pfStatement': return 'PF Statement Details';
      case 'form': return 'Form Details';
      case 'ecr': return 'ECR Details';
      case 'vpf': return 'VPF Details';
      case 'declaration': return 'Declaration Details';
      case 'report': return 'Report Details';
      default: return 'Details';
    }
  };

  const canDownload = ['form', 'report'].includes(type) && data?.status === 'generated';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="xl">
      <div className="space-y-6 p-2">
        {renderContent()}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          {canDownload && onDownload && (
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={() => onDownload(data)}
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewDetailsModal;