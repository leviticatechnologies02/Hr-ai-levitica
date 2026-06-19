// modal/ImportModal.jsx
import React, { useRef } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ImportModal = ({ isOpen, onClose, onImport }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Rules"
      size="md"
    >
      <div className="space-y-4 p-4">
        <p className="text-sm text-slate-600">Select a JSON file to import rules:</p>
        
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Icon icon="heroicons:arrow-up-tray" className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Click to select a JSON file
            </p>
            <p className="text-xs text-slate-400">
              or drag and drop your file here
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Icon icon="heroicons:exclamation-triangle" className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">Warning: This will overwrite all existing rules.</p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;