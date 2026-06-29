import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const UploadAcknowledgementModal = ({ isOpen, onClose, onSubmit, payment }) => {
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    onSubmit({ payment, file });
  };

  if (!payment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Bank Acknowledgement" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Select Acknowledgement File <span className="text-rose-500">*</span>
          </label>
          <input
            type="file"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept=".txt,.csv,.xml,.json,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <p className="text-xs text-slate-500 mt-1">Supported formats: TXT, CSV, XML, JSON, PDF</p>
        </div>

        {file && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
            <Icon icon="heroicons:document-text" className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-500">Size: {(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        )}

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-2">
            <Icon icon="heroicons:exclamation-circle" className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-700">Payment: {payment.fileName}</p>
              <p className="text-xs text-amber-600 mt-1">
                Reference: {payment.referenceNumber} | Amount: {payment.totalAmount}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!file}
          >
            <Icon icon="heroicons:arrow-up-tray" className="w-4 h-4" />
            Upload & Process
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadAcknowledgementModal;