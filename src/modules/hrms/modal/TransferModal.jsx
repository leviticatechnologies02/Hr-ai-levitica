import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const TransferModal = ({ isOpen, onClose, onSubmit, employees = [], request = null }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    fromDept: '',
    toDept: '',
    type: 'Inter-department',
    effectiveDate: '',
    reason: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (request) {
        setFormData({
          employeeId: request.employeeId || '',
          fromDept: request.currentDepartment || '',
          toDept: request.newDepartment || request.newLocation || '',
          type: request.requestType || 'Inter-department',
          effectiveDate: request.effectiveDate ? new Date(request.effectiveDate).toISOString().split('T')[0] : '',
          reason: request.reason || ''
        });
      } else {
        setFormData({ employeeId: '', fromDept: '', toDept: '', type: 'Inter-department', effectiveDate: '', reason: '' });
      }
    }
  }, [isOpen, request]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.toDept) {
      alert('Please fill in all required fields');
      return;
    }
    const employee = employees.find(e => e.id === formData.employeeId) || { name: request?.employeeName, department: request?.currentDepartment };
    
    onSubmit({
      ...formData,
      employeeName: employee?.name || '',
      fromDept: employee?.department || formData.fromDept
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={request ? "Edit Transfer Request" : "New Transfer Request"} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm p-1">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Employee <span className="text-rose-500">*</span></label>
          <select
            required
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            disabled={!!request}
          >
            <option value="">Select Employee</option>
            {employees.length > 0 ? employees.map(emp => (
              <option key={emp.id || emp.employeeId} value={emp.id || emp.employeeId}>{emp.name} - {emp.department}</option>
            )) : (
              request && <option value={request.employeeId}>{request.employeeName}</option>
            )}
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
            <option value="Location Transfer">Location Transfer</option>
            <option value="Promotion Transfer">Promotion Transfer</option>
            <option value="Department Transfer">Department Transfer</option>
            <option value="Internal Transfer">Internal Transfer</option>
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
            placeholder="Enter new department or location"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Effective Date</label>
          <input
            type="date"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={formData.effectiveDate}
            onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Reason</label>
          <textarea
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Enter reason for transfer"
            rows={3}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition">Cancel</button>
          <button type="submit" className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
            <Icon icon="heroicons:paper-airplane" className="w-4 h-4" /> {request ? 'Update Request' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransferModal;