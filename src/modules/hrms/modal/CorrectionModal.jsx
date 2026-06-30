import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const CorrectionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employees = [],
  correctionData = {},
  formatCurrency,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    correctionType: 'Status Change',
    originalValue: '',
    correctedValue: '',
    reason: '',
    impact: 0
  });

  useEffect(() => {
    if (isOpen) {
      if (correctionData && Object.keys(correctionData).length > 0) {
        setFormData({
          employeeId: correctionData.employeeId || '',
          date: correctionData.date || '',
          correctionType: correctionData.correctionType || 'Status Change',
          originalValue: correctionData.originalValue || '',
          correctedValue: correctionData.correctedValue || '',
          reason: correctionData.reason || '',
          impact: correctionData.impact || 0
        });
      } else {
        setFormData({
          employeeId: '',
          date: '',
          correctionType: 'Status Change',
          originalValue: '',
          correctedValue: '',
          reason: '',
          impact: 0
        });
      }
    }
  }, [isOpen, correctionData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCorrectionTypeChange = (type) => {
    const impacts = {
      'Status Change': 150,
      'Time Correction': 0,
      'Overtime Update': 75,
      'Holiday Work Addition': 200,
      'Post-Payroll Adjustment': -140
    };
    
    setFormData({
      ...formData,
      correctionType: type,
      impact: impacts[type] || 0
    });
  };

  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee && formatCurrency) {
      const dailyRate = employee.basicSalary / 30;
      const impacts = {
        'Status Change': dailyRate,
        'Time Correction': 0,
        'Overtime Update': dailyRate / 8 * 1.5 * 2,
        'Holiday Work Addition': dailyRate * 2,
        'Post-Payroll Adjustment': -dailyRate
      };
      
      setFormData({
        ...formData,
        employeeId,
        impact: impacts[formData.correctionType] || 0
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.date || !formData.originalValue || !formData.correctedValue) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(formData);
  };

  const correctionTypes = ['Status Change', 'Time Correction', 'Overtime Update', 'Holiday Work Addition', 'Post-Payroll Adjustment'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Attendance Correction" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Employee <span className="text-rose-500">*</span>
            </label>
            <select
              name="employeeId"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.employeeId}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Date <span className="text-rose-500">*</span>
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
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correction Type</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {correctionTypes.map(type => (
              <button
                key={type}
                type="button"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                  formData.correctionType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                onClick={() => handleCorrectionTypeChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Original Value <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="originalValue"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.originalValue}
              onChange={handleChange}
              placeholder="e.g., Absent or 09:30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Corrected Value <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="correctedValue"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.correctedValue}
              onChange={handleChange}
              placeholder="e.g., Present or 09:00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reason for Correction</label>
          <textarea
            name="reason"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Explain the reason for this correction..."
            rows="3"
          />
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Payroll Impact Analysis</span>
            <span className={`text-lg font-bold ${
              formData.impact > 0 ? 'text-emerald-600' :
              formData.impact < 0 ? 'text-rose-600' :
              'text-slate-500'
            }`}>
              {formData.impact > 0 ? '+' : ''}{formatCurrency ? formatCurrency(Math.abs(formData.impact)) : `$${Math.abs(formData.impact).toFixed(2)}`}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            This {formData.impact > 0 ? 'addition' : formData.impact < 0 ? 'deduction' : 'change'} will affect the next payroll run.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                Submit Correction
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CorrectionModal;