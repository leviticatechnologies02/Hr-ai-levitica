import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ViewReportModal = ({ isOpen, onClose, report, onExport, onPrint, onGenerate }) => {
  const getStatusBadge = (status) => {
    const config = {
      generated: { label: 'Generated', color: 'emerald' },
      pending: { label: 'Pending', color: 'amber' },
      failed: { label: 'Failed', color: 'rose' },
      Generated: { label: 'Generated', color: 'emerald' },
      Pending: { label: 'Pending', color: 'amber' },
      Failed: { label: 'Failed', color: 'rose' },
    };
    const { label, color } = config[status?.toLowerCase()] || { label: status, color: 'gray' };
    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const config = {
      daily: { label: 'Daily', color: 'blue' },
      monthly: { label: 'Monthly', color: 'emerald' },
      exception: { label: 'Exception', color: 'amber' },
      compliance: { label: 'Compliance', color: 'cyan' },
      standard: { label: 'Standard', color: 'blue' },
      analytics: { label: 'Analytics', color: 'purple' },
    };
    const { label, color } = config[category] || { label: category, color: 'gray' };
    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  if (!report) return null;

  const stats = [
    { label: 'Total Employees', value: report.totalEmployees, color: 'blue' },
    { label: 'Present', value: report.present, color: 'emerald' },
    { label: 'Absent', value: report.absent, color: 'rose' },
    { label: 'On Leave', value: report.onLeave, color: 'amber' },
    { label: 'Late Arrivals', value: report.lateArrivals, color: 'orange' },
    { label: 'Overtime Hours', value: report.overtime, color: 'purple' },
    { label: 'Avg Attendance', value: report.avgAttendance, color: 'cyan' },
    { label: 'Exceptions', value: report.exceptions, color: 'red' },
  ].filter(stat => stat.value !== undefined && stat.value !== null);

  const isPending = report.status?.toLowerCase() === 'pending';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Details" size="lg">
      <div className="space-y-5">
        {/* Report Header */}
        <div className="bg-slate-50 rounded-xl md:p-4 p-3 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-800">{report.reportName || report.type || report.name}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{report.date || `${report.from} to ${report.to}`}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{report.department || 'All Departments'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {report.category && getCategoryBadge(report.category)}
              {getStatusBadge(report.status)}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs">
              <Icon icon="heroicons:clock" className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">Generated: {report.generated || 'N/A'}</span>
            </div>
            {report.frequency && (
              <div className="flex items-center gap-1.5 text-xs">
                <Icon icon="heroicons:arrow-path" className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Frequency: {report.frequency}</span>
              </div>
            )}
            {report.format && (
              <div className="flex items-center gap-1.5 text-xs">
                <Icon icon="heroicons:document-text" className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{report.format}</span>
              </div>
            )}
            {report.size && (
              <div className="flex items-center gap-1.5 text-xs">
                <Icon icon="heroicons:folder" className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{report.size}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {report.description && (
          <div className="bg-white border border-slate-200 rounded-xl md:p-4 p-3">
            <p className="text-sm text-slate-600 leading-relaxed">{report.description}</p>
          </div>
        )}

        {/* Statistics Grid */}
        {stats.length > 0 && (
          <div>
            <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Report Statistics</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                  <div className={`text-lg font-bold text-${stat.color}-600`}>{stat.value}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Columns */}
        {report.columns && report.columns.length > 0 && (
          <div className="bg-slate-50 rounded-xl md:p-4 p-3">
            <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Columns Included</h5>
            <div className="flex flex-wrap gap-2">
              {report.columns.map((col, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {isPending ? (
              <button
                type="button"
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                onClick={() => onGenerate?.(report.id)}
              >
                <Icon icon="heroicons:play" className="w-4 h-4" />
                Generate Now
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  onClick={() => onExport?.(report.id)}
                >
                  <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                  Export
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  onClick={() => onPrint?.(report.id)}
                >
                  <Icon icon="heroicons:printer" className="w-4 h-4" />
                  Print
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewReportModal;