import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const UANModal = ({ isOpen, onClose, onSubmit, employees = [], selectedEmployee: initialEmployee = null }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    uanNumber: '',
    activationDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedEmployee(initialEmployee);
      setFormData({
        uanNumber: '',
        activationDate: new Date().toISOString().split('T')[0]
      });
      setIsSubmitting(false);
    }
  }, [isOpen, initialEmployee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }
    if (!formData.uanNumber) {
      alert('Please enter a UAN number');
      return;
    }
    setIsSubmitting(true);
    onSubmit(selectedEmployee, formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="UAN Activation & Management" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Select Employee <span className="text-rose-500">*</span>
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={selectedEmployee?.id || ''}
            onChange={(e) => {
              const emp = employees.find(emp => emp.id === e.target.value);
              setSelectedEmployee(emp);
            }}
          >
            <option value="">Select employee...</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>
            ))}
          </select>
        </div>

        {selectedEmployee && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  UAN Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength="12"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={formData.uanNumber}
                  onChange={(e) => setFormData({ ...formData, uanNumber: e.target.value })}
                  placeholder="Enter 12-digit UAN"
                />
                <p className="text-xs text-slate-500 mt-1">UAN must be exactly 12 digits</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Activation Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={formData.activationDate}
                  onChange={(e) => setFormData({ ...formData, activationDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                UAN (Universal Account Number) is a 12-digit unique number for each employee.
              </p>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedEmployee || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Activating...
              </>
            ) : (
              <>
                <Icon icon="heroicons:check" className="w-4 h-4" />
                Activate UAN
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UANModal;