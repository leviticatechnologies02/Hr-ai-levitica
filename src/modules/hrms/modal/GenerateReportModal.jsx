import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const GenerateReportModal = ({ isOpen, onClose, onSubmit, reportTypes }) => {
  const [formData, setFormData] = useState({
    reportType: 'Daily Attendance Summary',
    category: 'daily',
    startDate: '',
    endDate: '',
    department: 'All',
    reason: ''
  });

  const [selectedCategory, setSelectedCategory] = useState('daily');

  const categories = [
    { id: 'daily', name: 'Daily Reports', icon: 'heroicons:calendar' },
    { id: 'monthly', name: 'Monthly Reports', icon: 'heroicons:calendar-days' },
    { id: 'exception', name: 'Exception Reports', icon: 'heroicons:exclamation-triangle' },
    { id: 'compliance', name: 'Compliance Reports', icon: 'heroicons:shield-check' },
    { id: 'analytics', name: 'Analytics', icon: 'heroicons:chart-bar' },
    { id: 'standard', name: 'Standard', icon: 'heroicons:document-text' },
  ];

  const departments = ['All', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
    setFormData({
      reportType: 'Daily Attendance Summary',
      category: 'daily',
      startDate: '',
      endDate: '',
      department: 'All',
      reason: ''
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      reportType: 'Daily Attendance Summary',
      category: 'daily',
      startDate: '',
      endDate: '',
      department: 'All',
      reason: ''
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Generate New Report" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 p-1">
          {/* Report Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Report Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setFormData({ ...formData, category: cat.id });
                  }}
                >
                  <Icon icon={cat.icon} className="w-4 h-4" />
                  {cat.name.replace(' Reports', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Report Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-700"
              required
            >
              {reportTypes?.[selectedCategory]?.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-700"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-700"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-700"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Reason / Comments
            </label>
            <textarea
              rows="3"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Enter reason for generating this report..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-700 resize-none"
            />
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5">
            <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-800">Report Generation Info</p>
              <p className="text-[11px] text-blue-600">Daily reports are auto-generated at 9:00 AM | Monthly reports on 1st of each month</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
            >
              <Icon icon="heroicons:play" className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default GenerateReportModal;