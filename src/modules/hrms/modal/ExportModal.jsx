import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ExportModal = ({ 
  isOpen, 
  onClose, 
  onExport,
  dataCount = 0,
  isLoading = false,
  title = "Export Rules",
  description = "Export all work hour rules as a JSON file?",
  subDescription = "This will include all attendance, overtime, break rules, and settings.",
  mode = 'rules'
}) => {
  const [formData, setFormData] = useState({
    format: 'Excel',
    startDate: '',
    endDate: '',
    include: {
      employeeDetails: true,
      attendanceSummary: true,
      payrollCalculations: true,
      deductions: true,
      additions: true,
      netPay: true
    }
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        format: 'Excel',
        startDate: '',
        endDate: '',
        include: {
          employeeDetails: true,
          attendanceSummary: true,
          payrollCalculations: true,
          deductions: true,
          additions: true,
          netPay: true
        }
      });
    }
  }, [isOpen]);

  const handleIncludeToggle = (key) => {
    setFormData({
      ...formData,
      include: { ...formData.include, [key]: !formData.include[key] }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'rules') {
      onExport();
    } else {
      onExport(formData);
    }
  };

  const selectedCount = Object.values(formData.include).filter(v => v).length;

  const renderRulesMode = () => (
    <div className="space-y-4 p-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-700">{description}</p>
          <p className="text-xs text-blue-600 mt-1">{subDescription}</p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10"
          onClick={onExport}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              Export Now
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Render Payroll/Data mode (full)
  const renderPayrollMode = () => (
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Export Format</label>
        <div className="grid grid-cols-3 gap-3">
          {['PDF', 'Excel', 'CSV'].map(format => (
            <div
              key={format}
              className={`p-4 border rounded-xl cursor-pointer transition text-center ${
                formData.format === format
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
              onClick={() => setFormData({ ...formData, format })}
            >
              <Icon icon={format === 'PDF' ? 'heroicons:document-text' : format === 'Excel' ? 'heroicons:table-cells' : 'heroicons:document'} className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold text-slate-800">{format}</div>
              <div className="text-xs text-slate-500">{format === 'PDF' ? 'For reports' : format === 'Excel' ? 'For analysis' : 'For import'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Include Sections</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(formData.include).map(([key, value]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={() => handleIncludeToggle(key)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <Icon icon="heroicons:document-text" className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-700">Export Summary</span>
        </div>
        <p className="text-sm text-purple-600">
          {selectedCount} sections selected • {formData.format} format • {dataCount} records
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              Export Data
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={mode === 'rules' ? 'md' : 'lg'}>
      {mode === 'rules' ? renderRulesMode() : renderPayrollMode()}
    </Modal>
  );
};

export default ExportModal;