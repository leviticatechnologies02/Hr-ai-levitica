import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ExportModal = ({ 
  isOpen, 
  onClose, 
  onExport, 
  exportFormat, 
  setExportFormat, 
  isExporting, 
  exportProgress,
  itemCount 
}) => {
  const exportOptions = [
    { 
      id: 'pdf', 
      label: 'PDF Document', 
      desc: 'Best for printing and sharing', 
      icon: 'heroicons:document-text',
      color: 'rose'
    },
    { 
      id: 'excel', 
      label: 'Excel File', 
      desc: 'Best for data analysis and editing', 
      icon: 'heroicons:table-cells',
      color: 'emerald'
    },
    { 
      id: 'csv', 
      label: 'CSV File', 
      desc: 'Best for importing to other systems', 
      icon: 'heroicons:document-arrow-down',
      color: 'blue'
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Exceptions" size="md">
      <div className="space-y-5 p-1">
        <p className="text-sm text-slate-600">
          Export <span className="font-semibold text-slate-800">{itemCount}</span> exceptions in selected format
        </p>

        {/* Export Options */}
        <div className="space-y-2">
          {exportOptions.map((option) => (
            <div
              key={option.id}
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                exportFormat === option.id
                  ? `border-${option.color}-500 bg-${option.color}-50`
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
              onClick={() => setExportFormat(option.id)}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${option.color}-100`}>
                <Icon icon={option.icon} className={`w-5 h-5 text-${option.color}-600`} />
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-semibold text-slate-800">{option.label}</div>
                <div className="text-xs text-slate-500">{option.desc}</div>
              </div>
              {exportFormat === option.id && (
                <Icon icon="heroicons:check-circle" className="w-5 h-5 text-blue-600" />
              )}
            </div>
          ))}
        </div>

        {/* Progress */}
        {isExporting && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Icon icon="heroicons:arrow-path" className="w-5 h-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-blue-700">Exporting exceptions...</span>
                  <span className="font-semibold text-blue-700">{exportProgress}%</span>
                </div>
                <div className="mt-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onExport}
            disabled={isExporting || itemCount === 0}
          >
            {isExporting ? (
              <>
                <Icon icon="heroicons:arrow-path" className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                Export ({itemCount})
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;