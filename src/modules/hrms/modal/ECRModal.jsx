import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ECRModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    month: '',
    totalWages: '',
    epfContribution: '',
    epsContribution: '',
    edliContribution: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        month: initialData.month || '',
        totalWages: initialData.totalWages || '',
        epfContribution: initialData.epfContribution || '',
        epsContribution: initialData.epsContribution || '',
        edliContribution: initialData.edliContribution || ''
      });
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.month) {
      alert('Please select a month');
      return;
    }
    setIsSubmitting(true);
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate ECR (Electronic Challan cum Return)" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Select Month <span className="text-rose-500">*</span>
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
          >
            <option value="">Select month...</option>
            <option value="March 2024">March 2024</option>
            <option value="February 2024">February 2024</option>
            <option value="January 2024">January 2024</option>
            <option value="December 2023">December 2023</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Total Wages (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.totalWages}
              onChange={(e) => setFormData({ ...formData, totalWages: e.target.value })}
              placeholder="Total wages for the month"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              EPF Contribution (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.epfContribution}
              onChange={(e) => setFormData({ ...formData, epfContribution: e.target.value })}
              placeholder="EPF contribution amount"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              EPS Contribution (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.epsContribution}
              onChange={(e) => setFormData({ ...formData, epsContribution: e.target.value })}
              placeholder="EPS contribution amount"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              EDLI Contribution (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.edliContribution}
              onChange={(e) => setFormData({ ...formData, edliContribution: e.target.value })}
              placeholder="EDLI contribution amount"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            ECR will include all eligible employees with their wages, EPF, EPS, and EDLI contributions.
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
                <Icon icon="heroicons:document-plus" className="w-4 h-4" />
                Generate ECR
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ECRModal;