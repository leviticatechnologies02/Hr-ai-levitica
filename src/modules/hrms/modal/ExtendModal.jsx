import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ExtendModal = ({ isOpen, onClose, onSubmit, employee = null }) => {
  const [formData, setFormData] = useState({
    extensionDays: 30,
    newConfirmationDate: '',
    reason: '',
    performancePlan: '',
    notifyEmployee: true,
    notifyManager: true
  });

  useEffect(() => {
    if (isOpen && employee) {
      const newDate = new Date(employee.probationEndDate || employee.confirmationDueDate);
      newDate.setDate(newDate.getDate() + 30);
      setFormData({
        extensionDays: 30,
        newConfirmationDate: newDate.toISOString().split('T')[0],
        reason: '',
        performancePlan: '',
        notifyEmployee: true,
        notifyManager: true
      });
    }
  }, [isOpen, employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'extensionDays') {
      const days = parseInt(value);
      const newDate = new Date(employee.probationEndDate || employee.confirmationDueDate);
      newDate.setDate(newDate.getDate() + days);
      setFormData({
        ...formData,
        extensionDays: days,
        newConfirmationDate: newDate.toISOString().split('T')[0]
      });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reason) {
      alert('Please provide a reason for extension');
      return;
    }
    onSubmit(formData);
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Extend Probation - ${employee.name}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-700">
            Extending probation for <strong>{employee.name}</strong>
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Extension Days <span className="text-rose-500">*</span>
          </label>
          <select
            name="extensionDays"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.extensionDays}
            onChange={handleChange}
            required
          >
            <option value="15">15 Days</option>
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            New Probation End Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="newConfirmationDate"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.newConfirmationDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Reason for Extension <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="reason"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            rows="3"
            placeholder="Provide detailed reason for extension..."
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Performance Improvement Plan</label>
          <textarea
            name="performancePlan"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            rows="2"
            placeholder="Outline performance improvement plan..."
            value={formData.performancePlan}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="notifyManager"
              checked={formData.notifyManager}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Notify manager</span>
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
            className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:clock" className="w-4 h-4" />
            Extend Probation
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExtendModal;