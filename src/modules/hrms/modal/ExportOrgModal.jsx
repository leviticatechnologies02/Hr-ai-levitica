import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [format, setFormat] = useState('pdf');
  const [includeOptions, setIncludeOptions] = useState({
    departments: true,
    locations: true,
    reportingRelationships: true,
    spanAnalytics: true
  });

  const handleExport = () => {
    onExport(format, includeOptions);
    onClose();
  };

  const exportOptions = [
    { id: 'pdf', label: 'PDF Document', desc: 'Best for printing and sharing', icon: 'heroicons:document-text', color: 'rose' },
    { id: 'png', label: 'PNG Image', desc: 'Best for presentations and embedding', icon: 'heroicons:photo', color: 'blue' },
    { id: 'excel', label: 'Excel File', desc: 'Best for data analysis', icon: 'heroicons:table-cells', color: 'emerald' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Organization Chart" size="lg">
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {exportOptions.map((option) => (
              <div
                key={option.id}
                className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                  format === option.id
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setFormat(option.id)}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${option.color}-100`}>
                  <Icon icon={option.icon} className={`w-5 h-5 text-${option.color}-600`} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-semibold text-slate-800">{option.label}</div>
                  <div className="text-[10px] text-slate-500">{option.desc}</div>
                </div>
                {format === option.id && (
                  <Icon icon="heroicons:check-circle" className="w-5 h-5 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Include In Export
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { key: 'departments', label: 'Departments' },
              { key: 'locations', label: 'Locations' },
              { key: 'reportingRelationships', label: 'Reporting Relationships' },
              { key: 'spanAnalytics', label: 'Span Analytics' },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={includeOptions[item.key]}
                  onChange={(e) => setIncludeOptions({...includeOptions, [item.key]: e.target.checked})}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            onClick={handleExport}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;