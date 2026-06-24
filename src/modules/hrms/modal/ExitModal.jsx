import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ExitModal = ({ isOpen, onClose, onSubmit, employees }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    lastWorkingDay: '',
    reason: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ employeeId: '', lastWorkingDay: '', reason: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.lastWorkingDay) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Initiate Exit Process" size="md">
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
          <label className="block text-slate-700 font-semibold mb-1">Last Working Day <span className="text-rose-500">*</span></label>
          <input
            type="date"
            required
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={formData.lastWorkingDay}
            onChange={(e) => setFormData({ ...formData, lastWorkingDay: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Reason</label>
          <textarea
            rows="3"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Enter reason for exit (optional)"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition">Cancel</button>
          <button type="submit" className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
            <Icon icon="heroicons:user-minus" className="w-4 h-4" /> Initiate Exit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExitModal;