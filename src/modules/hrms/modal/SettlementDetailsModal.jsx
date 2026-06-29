import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const SettlementDetailsModal = ({ 
  isOpen, 
  onClose, 
  item, 
  formatCurrency, 
  formatDate, 
  getStatusBadge,
  activeSection 
}) => {
  if (!item) return null;

  const [activeTab, setActiveTab] = useState('basic');

  const renderBasicDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:user" className="w-4 h-4 text-blue-500" />
            Employee Information
          </h6>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Employee Name:</span>
              <span className="font-semibold text-slate-800">{item.name || item.employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Employee ID:</span>
              <span className="font-semibold text-slate-800">{item.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="text-slate-700">{item.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Last Working Day:</span>
              <span className="font-semibold text-rose-600">{formatDate(item.lastWorkingDay)}</span>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:currency-dollar" className="w-4 h-4 text-emerald-500" />
            Settlement Details
          </h6>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Settlement Amount:</span>
              <span className="font-bold text-emerald-600">{formatCurrency(item.settlementAmount || item.netAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span>{getStatusBadge(item.status)}</span>
            </div>
            {item.paymentDate && (
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date:</span>
                <span className="font-semibold text-slate-800">{formatDate(item.paymentDate)}</span>
              </div>
            )}
            {item.approvedBy && (
              <div className="flex justify-between">
                <span className="text-slate-500">Approved By:</span>
                <span className="font-semibold text-slate-800">{item.approvedBy}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {item.daysPending && (
        <div className="border border-slate-200 p-4 rounded-2xl bg-amber-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-amber-700">Days Pending:</span>
            <span className={`font-bold ${item.daysPending > 7 ? 'text-rose-600' : 'text-amber-600'}`}>
              {item.daysPending} days
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderFormDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:document-text" className="w-4 h-4 text-blue-500" />
            Form Information
          </h6>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Form Name:</span>
              <span className="font-semibold text-slate-800">{item.formName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Employee:</span>
              <span className="text-slate-700">{item.employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type:</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {item.type?.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span>{getStatusBadge(item.status)}</span>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:calendar" className="w-4 h-4 text-amber-500" />
            Dates
          </h6>
          <div className="space-y-2 text-sm">
            {item.financialYear && (
              <div className="flex justify-between">
                <span className="text-slate-500">Financial Year:</span>
                <span className="font-semibold text-slate-800">{item.financialYear}</span>
              </div>
            )}
            {item.generatedDate && (
              <div className="flex justify-between">
                <span className="text-slate-500">Generated Date:</span>
                <span className="text-slate-700">{formatDate(item.generatedDate)}</span>
              </div>
            )}
            {item.issuedDate && (
              <div className="flex justify-between">
                <span className="text-slate-500">Issued Date:</span>
                <span className="text-slate-700">{formatDate(item.issuedDate)}</span>
              </div>
            )}
            {item.dueDate && (
              <div className="flex justify-between">
                <span className="text-slate-500">Due Date:</span>
                <span className="font-semibold text-rose-600">{formatDate(item.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:chart-bar" className="w-4 h-4 text-blue-500" />
            Report Information
          </h6>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Report Name:</span>
              <span className="font-semibold text-slate-800">{item.reportName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Period:</span>
              <span className="text-slate-700">{item.period}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type:</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                {item.type?.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span>{getStatusBadge(item.status)}</span>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2">
          <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:calendar" className="w-4 h-4 text-amber-500" />
            Progress
          </h6>
          <div className="space-y-2 text-sm">
            {item.generatedDate && (
              <div className="flex justify-between">
                <span className="text-slate-500">Generated Date:</span>
                <span className="text-slate-700">{formatDate(item.generatedDate)}</span>
              </div>
            )}
            {item.progress && (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Progress:</span>
                  <span className="font-semibold text-blue-600">{item.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const getTitle = () => {
    if (activeSection === 'forms') return `${item.formName} Details`;
    if (activeSection === 'reports') return `${item.reportName} Details`;
    return `${item.name || item.employeeName} Details`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="lg">
      <div className="space-y-6 p-2">
        {(activeSection === 'employees' || activeSection === 'pending' || activeSection === 'completed') && renderBasicDetails()}
        {activeSection === 'forms' && renderFormDetails()}
        {activeSection === 'reports' && renderReportDetails()}

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
            onClick={() => {
              alert(`Processing ${item.name || item.employeeName || item.formName}...`);
              onClose();
            }}
          >
            <Icon icon="heroicons:cog-6-tooth" className="w-4 h-4" />
            Take Action
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettlementDetailsModal;