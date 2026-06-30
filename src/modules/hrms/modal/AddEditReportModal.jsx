import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const AddEditReportModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  report = null, 
  isEditMode = false,
  departments = [] 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'standard',
    description: '',
    frequency: 'Monthly',
    format: ['pdf'],
    department: 'All',
    scheduleType: 'manual',
    recipients: [],
    parameters: {}
  });

  useEffect(() => {
    if (isOpen) {
      if (report && isEditMode) {
        setFormData({
          name: report.name || '',
          category: report.category || 'standard',
          description: report.description || '',
          frequency: report.frequency || 'Monthly',
          format: Array.isArray(report.format) ? report.format : [report.format],
          department: report.department || 'All',
          scheduleType: report.scheduleType || 'manual',
          recipients: report.recipients || [],
          parameters: report.parameters || {}
        });
      } else {
        setFormData({
          name: '',
          category: 'standard',
          description: '',
          frequency: 'Monthly',
          format: ['pdf'],
          department: 'All',
          scheduleType: 'manual',
          recipients: [],
          parameters: {}
        });
      }
    }
  }, [isOpen, report, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'format') {
      const formats = formData.format.includes(value)
        ? formData.format.filter(f => f !== value)
        : [...formData.format, value];
      setFormData({ ...formData, format: formats });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Report name is required');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Report' : 'Add New Report'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Report Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter report name"
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
              <option value="standard">Standard Report</option>
              <option value="compliance">Compliance Report</option>
              <option value="analytics">Analytics Dashboard</option>
              <option value="scheduled">Scheduled Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Frequency</label>
            <select
              name="frequency"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.frequency}
              onChange={handleChange}
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
              <option value="On Demand">On Demand</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
          <textarea
            name="description"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter report description"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Default Format</label>
            <div className="flex gap-3">
              {['pdf', 'excel', 'csv'].map((fmt) => (
                <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="format"
                    value={fmt}
                    checked={formData.format.includes(fmt)}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 capitalize">{fmt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Target Department</label>
            <select
              name="department"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.department}
              onChange={handleChange}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="scheduleType"
            checked={formData.scheduleType === 'auto'}
            onChange={(e) => setFormData({ ...formData, scheduleType: e.target.checked ? 'auto' : 'manual' })}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm text-slate-700 flex items-center gap-2">
            <Icon icon="heroicons:clock" className="w-4 h-4" />
            Enable Auto-Scheduling
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
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            {isEditMode ? 'Update Report' : 'Save Report'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditReportModal;