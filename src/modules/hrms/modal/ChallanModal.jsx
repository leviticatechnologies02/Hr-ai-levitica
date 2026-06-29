import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ChallanModal = ({ isOpen, onClose, onSubmit, type = 'tds' }) => {
  const [formData, setFormData] = useState({
    period: '',
    amount: '',
    paymentDate: '',
    format: 'PDF'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        period: '',
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        format: 'PDF'
      });
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.period || !formData.amount) {
      alert('Please fill all required fields');
      return;
    }
    setIsSubmitting(true);
    onSubmit(formData);
  };

  const titleMap = {
    pf: 'Generate PF Challan',
    esi: 'Generate ESI Challan',
    pt: 'Generate PT Challan',
    tds: 'Generate TDS Challan'
  };

  const typeColors = {
    pf: 'blue',
    esi: 'cyan',
    pt: 'yellow',
    tds: 'emerald'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titleMap[type] || 'Generate Challan'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Period <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              placeholder="March 2024"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Payment Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            />
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
              <option value="PDF">PDF</option>
              <option value="Excel">Excel</option>
            </select>
          </div>
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
            className={`px-4 py-2 bg-${typeColors[type] || 'blue'}-600 text-white rounded-xl text-sm font-semibold hover:bg-${typeColors[type] || 'blue'}-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
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
                Generate Challan
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChallanModal;