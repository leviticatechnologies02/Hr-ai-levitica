import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BulkV2Modal = ({ isOpen, onClose, onSubmit, selectedCount = 0 }) => {
  const [formData, setFormData] = useState({
    action: 'send_reminder',
    date: '',
    extensionDays: '30',
    templateId: '',
    notifyEmployees: true,
    notifyManagers: true,
    generateLetters: true,
    message: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        action: 'send_reminder',
        date: new Date().toISOString().split('T')[0],
        extensionDays: '30',
        templateId: '',
        notifyEmployees: true,
        notifyManagers: true,
        generateLetters: true,
        message: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Bulk Actions (${selectedCount} employees)`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700">Apply action to all selected employees</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Select Action <span className="text-rose-500">*</span>
          </label>
          <select
            name="action"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.action}
            onChange={handleChange}
            required
          >
            <option value="send_reminder">Send Reminders</option>
            <option value="schedule_review">Schedule Reviews</option>
            <option value="extend_probation">Extend Probation</option>
            <option value="confirm_employees">Confirm Employees</option>
            <option value="export_data">Export Data</option>
          </select>
        </div>

        {formData.action === 'extend_probation' && (
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
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
            </select>
          </div>
        )}

        {formData.action === 'confirm_employees' && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirmation Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="generateLetters"
                  checked={formData.generateLetters}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Generate confirmation letters</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyEmployees"
                  checked={formData.notifyEmployees}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Notify employees</span>
              </label>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Additional Message</label>
          <textarea
            name="message"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            rows="2"
            value={formData.message}
            onChange={handleChange}
            placeholder="Add any additional message..."
          />
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
            <Icon icon="heroicons:play" className="w-4 h-4" />
            Apply Action
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BulkV2Modal;