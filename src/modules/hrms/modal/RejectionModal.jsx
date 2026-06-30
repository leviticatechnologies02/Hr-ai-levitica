import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const RejectionModal = ({ isOpen, onClose, onSubmit, employee = null }) => {
  const [formData, setFormData] = useState({
    reason: '',
    terminationDate: '',
    noticePeriod: 'serving',
    severance: 'none',
    comments: '',
    exitInterview: true
  });

  useEffect(() => {
    if (isOpen && employee) {
      setFormData({
        reason: '',
        terminationDate: new Date().toISOString().split('T')[0],
        noticePeriod: 'serving',
        severance: 'none',
        comments: '',
        exitInterview: true
      });
    }
  }, [isOpen, employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reason) {
      alert('Please provide a reason for rejection');
      return;
    }
    onSubmit(formData);
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reject Confirmation - ${employee.name}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <p className="text-sm text-rose-700">
            Rejecting confirmation for <strong>{employee.name}</strong>. This will initiate termination.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Reason for Rejection <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="reason"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            rows="3"
            placeholder="Provide detailed reason for rejection..."
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Termination Effective Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="terminationDate"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.terminationDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notice Period</label>
          <select
            name="noticePeriod"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.noticePeriod}
            onChange={handleChange}
          >
            <option value="serving">Serving Notice Period</option>
            <option value="waived">Notice Period Waived</option>
            <option value="payment_in_lieu">Payment in Lieu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Severance</label>
          <select
            name="severance"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.severance}
            onChange={handleChange}
          >
            <option value="none">None</option>
            <option value="standard">Standard Severance</option>
            <option value="enhanced">Enhanced Severance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Additional Comments</label>
          <textarea
            name="comments"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            rows="2"
            placeholder="Any additional comments..."
            value={formData.comments}
            onChange={handleChange}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="exitInterview"
            checked={formData.exitInterview}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Schedule exit interview</span>
        </label>

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
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:x-circle" className="w-4 h-4" />
            Reject Confirmation
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RejectionModal;