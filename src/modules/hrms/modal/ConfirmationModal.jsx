import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employee = null,
  employees = [],
  mode = 'employee' 
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    confirmationDate: '',
    effectiveDate: '',
    comments: '',
    salaryRevision: false,
    newSalary: '',
    designationChange: false,
    newDesignation: '',
    generateLetter: true,
    notifyEmployee: true,
    notifyManager: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      if (mode === 'employee' && employee) {
        setFormData({
          employeeId: employee.id || '',
          confirmationDate: today,
          effectiveDate: today,
          comments: '',
          salaryRevision: false,
          newSalary: '',
          designationChange: false,
          newDesignation: '',
          generateLetter: true,
          notifyEmployee: true,
          notifyManager: true
        });
      } else if (mode === 'bulk') {
        setFormData({
          employeeId: '',
          confirmationDate: today,
          effectiveDate: today,
          comments: '',
          salaryRevision: false,
          newSalary: '',
          designationChange: false,
          newDesignation: '',
          generateLetter: true,
          notifyEmployee: true,
          notifyManager: true
        });
      } else {
        setFormData({
          employeeId: '',
          confirmationDate: '',
          effectiveDate: '',
          comments: '',
          salaryRevision: false,
          newSalary: '',
          designationChange: false,
          newDesignation: '',
          generateLetter: true,
          notifyEmployee: true,
          notifyManager: true
        });
      }
      setIsSubmitting(false);
    }
  }, [isOpen, employee, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (mode === 'employee' || mode === 'bulk') {
      if (!formData.confirmationDate) {
        alert('Please select a confirmation date');
        setIsSubmitting(false);
        return;
      }
      
      if (mode === 'bulk' && !formData.employeeId) {
        alert('Please select an employee');
        setIsSubmitting(false);
        return;
      }
      
      onSubmit(formData);
    } else {
      if (!formData.employeeId || !formData.confirmationDate) {
        alert('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }
      onSubmit(formData);
    }
  };

  const getTitle = () => {
    if (mode === 'employee' && employee) {
      return `Confirm Employee - ${employee.name || 'Employee'}`;
    }
    if (mode === 'bulk') {
      return 'Confirm Employee';
    }
    return 'Employee Confirmation';
  };

  const renderEmployeeMode = () => (
    <>
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
        <p className="text-sm text-emerald-700">
          Confirming <strong>{employee?.name || 'Employee'}</strong> as permanent employee
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Confirmation Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="confirmationDate"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.confirmationDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Effective Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="effectiveDate"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.effectiveDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Additional Comments</label>
        <textarea
          name="comments"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
          rows="2"
          placeholder="Any additional comments..."
          value={formData.comments}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="generateLetter"
            checked={formData.generateLetter}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Generate confirmation letter</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="notifyEmployee"
            checked={formData.notifyEmployee}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Notify employee</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="notifyManager"
            checked={formData.notifyManager}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Notify manager</span>
        </label>
      </div>
    </>
  );

  const renderBulkMode = () => (
    <>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-700">Confirm selected employee(s) as permanent</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Select Employee <span className="text-rose-500">*</span>
        </label>
        <select
          name="employeeId"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
          value={formData.employeeId}
          onChange={handleChange}
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} - {emp.department}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Confirmation Date <span className="text-rose-500">*</span>
        </label>
        <input
          type="date"
          name="confirmationDate"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          value={formData.confirmationDate}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Comments</label>
        <textarea
          name="comments"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
          rows="3"
          value={formData.comments}
          onChange={handleChange}
          placeholder="Add any additional comments"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="generateLetter"
            checked={formData.generateLetter}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Generate confirmation letter</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="notifyEmployee"
            checked={formData.notifyEmployee}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Notify employee</span>
        </label>
      </div>
    </>
  );

  const renderStandardMode = () => (
    <>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">Employee <span className="text-rose-500">*</span></label>
        <select
          required
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          value={formData.employeeId}
          onChange={handleChange}
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} - {emp.department}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">Confirmation Date <span className="text-rose-500">*</span></label>
        <input
          type="date"
          required
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          value={formData.confirmationDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-slate-700 font-semibold mb-1">Comments</label>
        <textarea
          rows="3"
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          value={formData.comments}
          onChange={handleChange}
          placeholder="Add any additional comments"
        />
      </div>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm p-2">
        {mode === 'employee' ? renderEmployeeMode() :
         mode === 'bulk' ? renderBulkMode() :
         renderStandardMode()}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                {mode === 'employee' ? 'Confirm Employee' : 
                 mode === 'bulk' ? 'Confirm Employee' : 
                 'Confirm Employee'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ConfirmationModal;