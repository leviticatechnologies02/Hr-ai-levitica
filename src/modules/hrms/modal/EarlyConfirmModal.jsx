import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const EarlyConfirmModal = ({ isOpen, onClose, onSubmit, employee = null }) => {
  const [formData, setFormData] = useState({
    confirmationDate: '',
    effectiveDate: '',
    comments: '',
    generateLetter: true,
    notifyEmployee: true
  });

  useEffect(() => {
    if (isOpen && employee) {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        confirmationDate: today,
        effectiveDate: today,
        comments: '',
        generateLetter: true,
        notifyEmployee: true
      });
    }
  }, [isOpen, employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Early Confirmation - ${employee.name}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-sm text-emerald-700">
            Confirming <strong>{employee.name}</strong> before probation ends
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Confirmation Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="confirmationDate"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.confirmationDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Effective Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="effectiveDate"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.effectiveDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Comments</label>
          <textarea
            name="comments"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            rows="2"
            placeholder="Add any comments..."
            value={formData.comments}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="generateLetter"
              checked={formData.generateLetter}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Generate confirmation letter</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="notifyEmployee"
              checked={formData.notifyEmployee}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Notify employee</span>
          </label>
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
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Confirm Early
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EarlyConfirmModal;