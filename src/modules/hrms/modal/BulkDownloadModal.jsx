import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BulkDownloadModal = ({ isOpen, onClose, onSubmit, totalSlips = 0, formatCurrency }) => {
  const [formData, setFormData] = useState({
    month: 'all',
    format: 'zip',
    includePassword: true,
    compress: true
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        month: 'all',
        format: 'zip',
        includePassword: true,
        compress: true
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Download Salary Slips" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Month <span className="text-rose-500">*</span>
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            >
              <option value="all">All Months</option>
              <option value="2024-03">March 2024</option>
              <option value="2024-02">February 2024</option>
              <option value="2024-01">January 2024</option>
              <option value="2023-12">December 2023</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Format <span className="text-rose-500">*</span>
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
            >
              <option value="zip">ZIP Archive (All PDFs)</option>
              <option value="pdf">PDF (Individual files)</option>
              <option value="excel">Excel Summary</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.includePassword}
              onChange={(e) => setFormData({ ...formData, includePassword: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Include passwords in export</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.compress}
              onChange={(e) => setFormData({ ...formData, compress: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Compress files (ZIP)</span>
          </label>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-600">
            <span className="font-semibold">{totalSlips}</span> salary slips will be included in this download.
          </p>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Download
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BulkDownloadModal;