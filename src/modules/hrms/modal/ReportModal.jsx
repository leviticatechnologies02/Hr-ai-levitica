import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ReportModal = ({ isOpen, onClose, onGenerate, employees = [], departments = [] }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    department: 'all',
    status: 'all',
    exportFormat: 'pdf'
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        department: 'all',
        status: 'all',
        exportFormat: 'pdf'
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const filteredCount = employees.filter(emp => {
    if (formData.department !== 'all' && emp.department !== formData.department) return false;
    if (formData.status !== 'all' && emp.status !== formData.status) return false;
    return true;
  }).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmation Reports" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date</label>
            <input
              type="date"
              name="endDate"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department</label>
            <select
              name="department"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
            <select
              name="status"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="all">All Status</option>
              <option value="pending_review">Pending Review</option>
              <option value="under_review">Under Review</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="confirmed">Confirmed</option>
              <option value="extended">Extended</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Export Format</label>
          <div className="flex gap-4">
            {['pdf', 'excel', 'csv'].map(format => (
              <label key={format} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value={format}
                  checked={formData.exportFormat === format}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 capitalize">{format}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h6 className="font-bold text-sm text-slate-700">Report Preview</h6>
          </div>
          <div className="p-4 space-y-2 text-sm">
            <p>This report will include:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Confirmation statistics and analytics</li>
              <li>Employee-wise confirmation status</li>
              <li>Department-wise confirmation rates</li>
              <li>Extension analysis</li>
              <li>Time-to-confirmation metrics</li>
            </ul>
            <p className="font-medium text-slate-800 mt-2">
              Total records: <span className="text-blue-600">{filteredCount}</span> employees
            </p>
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
            <Icon icon="heroicons:document-chart-bar" className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportModal;