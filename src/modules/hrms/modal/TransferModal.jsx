import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const TransferModal = ({ isOpen, onClose, onSubmit, employees }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    fromDept: '',
    toDept: '',
    type: 'Inter-department'
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ employeeId: '', fromDept: '', toDept: '', type: 'Inter-department' });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.toDept) {
      alert('Please fill in all required fields');
      return;
    }
    const employee = employees.find(e => e.id === formData.employeeId);
    onSubmit({
      ...formData,
      employeeName: employee?.name || '',
      fromDept: employee?.department || formData.fromDept
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Transfer Request" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Employee <span className="text-rose-500">*</span></label>
          <select
            required
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} - {emp.department}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Transfer Type</label>
          <select
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="Inter-department">Inter-department</option>
            <option value="Inter-location">Inter-location</option>
            <option value="Internal Job Posting">Internal Job Posting</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">To Department/Location <span className="text-rose-500">*</span></label>
          <input
            type="text"
            required
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={formData.toDept}
            onChange={(e) => setFormData({ ...formData, toDept: e.target.value })}
            placeholder="Enter department or location"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition">Cancel</button>
          <button type="submit" className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
            <Icon icon="heroicons:paper-airplane" className="w-4 h-4" /> Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransferModal;