import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const NoteModal = ({ isOpen, onClose, onSubmit, employee = null }) => {
  const [formData, setFormData] = useState({
    note: '',
    category: 'general',
    priority: 'normal',
    visibleTo: ['manager', 'hr']
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        note: '',
        category: 'general',
        priority: 'normal',
        visibleTo: ['manager', 'hr']
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const visibleTo = formData.visibleTo.includes(value)
        ? formData.visibleTo.filter(v => v !== value)
        : [...formData.visibleTo, value];
      setFormData({ ...formData, visibleTo });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.note.trim()) {
      alert('Please enter a note');
      return;
    }
    onSubmit(formData);
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Note - ${employee.name}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Note <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="note"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            rows="4"
            value={formData.note}
            onChange={handleChange}
            placeholder="Enter your note..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
            <select
              name="category"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="general">General</option>
              <option value="performance">Performance</option>
              <option value="behavior">Behavior</option>
              <option value="achievement">Achievement</option>
              <option value="concern">Concern</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority</label>
            <select
              name="priority"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Visible To</label>
          <div className="flex flex-wrap gap-3">
            {['manager', 'hr', 'skip_level', 'employee'].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.visibleTo.includes(option)}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 capitalize">
                  {option.replace('_', ' ')}
                </span>
              </label>
            ))}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            Save Note
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NoteModal;