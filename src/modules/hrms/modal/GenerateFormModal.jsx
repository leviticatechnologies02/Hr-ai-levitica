import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const GenerateFormModal = ({ isOpen, onClose, onSubmit, formName = '' }) => {
  const [format, setFormat] = useState('pdf');
  const [period, setPeriod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormat('pdf');
      setPeriod('March 2024');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit({ format, period });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Generate ${formName} Form`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Select Period <span className="text-rose-500">*</span>
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="March 2024">March 2024</option>
            <option value="Q4 FY 2023-24">Q4 FY 2023-24</option>
            <option value="Full Year 2023-24">Full Year 2023-24</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Format <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-4">
            {['pdf', 'excel', 'csv'].map((fmt) => (
              <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={fmt}
                  checked={format === fmt}
                  onChange={() => setFormat(fmt)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <span className="text-sm text-slate-700 capitalize">{fmt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            The form will be generated with all relevant employee data and calculations.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
                Generate & Download
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GenerateFormModal;