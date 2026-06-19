import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const DownloadLeaveCorrectionModal = ({
  isOpen,
  onClose,
  financialYear,
  onDownload
}) => {
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [includeAllEmployees, setIncludeAllEmployees] = useState(true);
  const [includeCorrectionHistory, setIncludeCorrectionHistory] = useState(true);

  const formats = [
    { value: 'excel', label: 'Excel (.xlsx)', icon: 'heroicons:document-arrow-down' },
    { value: 'csv', label: 'CSV (.csv)', icon: 'heroicons:document-text' },
    { value: 'pdf', label: 'PDF (.pdf)', icon: 'heroicons:document' },
  ];

  const handleDownload = () => {
    onDownload(selectedFormat);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Download Leave Corrections"
      size="lg"
    >
      <div className="space-y-6 p-4">
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon icon="heroicons:calendar" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h6 className="text-sm font-bold text-slate-800">Period: {financialYear}</h6>
            <p className="text-xs text-slate-500 mt-0.5">Download leave correction data for the selected period</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Select Download Format <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {formats.map((format) => (
              <button
                key={format.value}
                type="button"
                onClick={() => setSelectedFormat(format.value)}
                className={`flex items-center gap-3 p-4 border-2 rounded-2xl transition-all ${
                  selectedFormat === format.value
                    ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedFormat === format.value
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon icon={format.icon} className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-800">{format.label}</div>
                </div>
                {selectedFormat === format.value && (
                  <Icon icon="heroicons:check-circle" className="w-5 h-5 text-blue-600 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
          <h6 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:adjustments-horizontal" className="w-4 h-4 text-slate-500" />
            Download Options
          </h6>
          
          <div className="space-y-2.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAllEmployees}
                onChange={(e) => setIncludeAllEmployees(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Include all employees</span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCorrectionHistory}
                onChange={(e) => setIncludeCorrectionHistory(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Include correction history</span>
            </label>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">File Format</span>
            <span className="font-semibold text-slate-800">
              {formats.find(f => f.value === selectedFormat)?.label}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1.5">
            <span className="text-slate-500">Period</span>
            <span className="font-semibold text-slate-800">{financialYear}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1.5">
            <span className="text-slate-500">Includes</span>
            <span className="font-semibold text-slate-800">
              {[
                includeAllEmployees && 'All Employees',
                includeCorrectionHistory && 'Correction History'
              ].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3 border-t border-slate-100">
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
            onClick={handleDownload}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Download Now
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DownloadLeaveCorrectionModal;