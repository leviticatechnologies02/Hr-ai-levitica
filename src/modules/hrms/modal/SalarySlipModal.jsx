import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const SalarySlipModal = ({ isOpen, onClose, onSubmit, slip = null, formatCurrency }) => {
  const [formData, setFormData] = useState({
    month: '',
    employeeId: '',
    distributionMethod: 'email',
    passwordProtect: true,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (slip) {
        setFormData({
          month: slip.month || '',
          employeeId: slip.employeeId || '',
          distributionMethod: slip.distributionMethod || 'email',
          passwordProtect: true,
          notes: ''
        });
      } else {
        setFormData({
          month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          employeeId: '',
          distributionMethod: 'email',
          passwordProtect: true,
          notes: ''
        });
      }
    }
  }, [isOpen, slip]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={slip ? 'Edit Salary Slip' : 'Generate Salary Slip'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Month <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              placeholder="March 2024"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Distribution Method <span className="text-rose-500">*</span>
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={formData.distributionMethod}
              onChange={(e) => setFormData({ ...formData, distributionMethod: e.target.value })}
            >
              <option value="email">Email</option>
              <option value="portal">Portal</option>
              <option value="both">Both</option>
              <option value="print">Print</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.passwordProtect}
            onChange={(e) => setFormData({ ...formData, passwordProtect: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label className="text-sm text-slate-700">Protect PDF with password</label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes</label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            rows="3"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add any additional notes..."
          />
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
            <Icon icon="heroicons:document-plus" className="w-4 h-4" />
            {slip ? 'Update' : 'Generate'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SalarySlipModal;