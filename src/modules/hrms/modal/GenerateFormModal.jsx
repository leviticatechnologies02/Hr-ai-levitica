import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const GenerateFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formName = '',
  employees = [],
  selectedEmployeeId = '',
  format = 'pdf',
  period = 'March 2024',
  mode = 'statutory' 
}) => {
  const [formData, setFormData] = useState({
    format: format || 'pdf',
    period: period || 'March 2024',
    employeeId: selectedEmployeeId || '',
    employeeName: '',
    department: '',
    designation: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'settlement' && employees.length > 0) {
        const defaultEmployee = employees.find(emp => emp.id === selectedEmployeeId) || employees[0];
        setFormData({
          format: format || 'pdf',
          period: period || 'June 2024',
          employeeId: defaultEmployee?.id || '',
          employeeName: defaultEmployee?.name || '',
          department: defaultEmployee?.department || '',
          designation: defaultEmployee?.designation || ''
        });
      } else {
        setFormData({
          format: format || 'pdf',
          period: period || 'March 2024',
          employeeId: selectedEmployeeId || '',
          employeeName: '',
          department: '',
          designation: ''
        });
      }
      setIsSubmitting(false);
    }
  }, [isOpen, format, period, selectedEmployeeId, employees, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'employeeId') {
      const selected = employees.find(emp => emp.id === value);
      setFormData({
        ...formData,
        employeeId: value,
        employeeName: selected?.name || '',
        department: selected?.department || '',
        designation: selected?.designation || ''
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submitData = {
      format: formData.format,
      period: formData.period,
      ...(mode === 'settlement' && {
        employeeId: formData.employeeId,
        employeeName: formData.employeeName,
        department: formData.department,
        designation: formData.designation
      })
    };
    
    onSubmit(submitData);
  };

  const getTitle = () => {
    if (mode === 'settlement') {
      return `Generate ${formName || 'Settlement'} Form`;
    }
    return `Generate ${formName} Form`;
  };

  const getPeriodOptions = () => {
    if (mode === 'settlement') {
      return [
        { value: 'June 2024', label: 'June 2024' },
        { value: 'Q2 2024', label: 'Q2 2024' },
        { value: 'FY 2023-24', label: 'FY 2023-24' }
      ];
    }
    return [
      { value: 'March 2024', label: 'March 2024' },
      { value: 'Q4 FY 2023-24', label: 'Q4 FY 2023-24' },
      { value: 'Full Year 2023-24', label: 'Full Year 2023-24' }
    ];
  };

  const getFormatOptions = () => {
    if (mode === 'settlement') {
      return [
        { value: 'pdf', label: 'PDF', icon: 'heroicons:document' },
        { value: 'excel', label: 'Excel', icon: 'heroicons:table-cells' },
        { value: 'word', label: 'Word', icon: 'heroicons:document-text' }
      ];
    }
    return [
      { value: 'pdf', label: 'PDF', icon: 'heroicons:document' },
      { value: 'excel', label: 'Excel', icon: 'heroicons:table-cells' },
      { value: 'csv', label: 'CSV', icon: 'heroicons:document-text' }
    ];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        {mode === 'settlement' && employees.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Select Employee <span className="text-rose-500">*</span>
            </label>
            <select
              name="employeeId"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.employeeId}
              onChange={handleChange}
            >
              <option value="">Select an employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeId}) - {emp.department}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Select Period <span className="text-rose-500">*</span>
          </label>
          <select
            name="period"
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.period}
            onChange={handleChange}
          >
            {getPeriodOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Format <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-4">
            {getFormatOptions().map((fmt) => (
              <label key={fmt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={fmt.value}
                  checked={formData.format === fmt.value}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <span className="text-sm text-slate-700 capitalize flex items-center gap-1">
                  <Icon icon={fmt.icon} className="w-4 h-4" />
                  {fmt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {mode === 'settlement' && formData.employeeName && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <h6 className="font-semibold text-sm text-slate-700 mb-2">Employee Details</h6>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Name:</span>
                <span className="font-medium text-slate-800 ml-2">{formData.employeeName}</span>
              </div>
              <div>
                <span className="text-slate-500">Department:</span>
                <span className="font-medium text-slate-800 ml-2">{formData.department}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Designation:</span>
                <span className="font-medium text-slate-800 ml-2">{formData.designation}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            {mode === 'settlement' 
              ? 'The form will be generated with all relevant settlement data and calculations.'
              : 'The form will be generated with all relevant employee data and calculations.'
            }
          </p>
        </div>

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
            disabled={isSubmitting || (mode === 'settlement' && !formData.employeeId)}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
                Generate & Download
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GenerateFormModal;