import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const RemittanceModal = ({ isOpen, onClose, onSubmit, type = 'pf', initialData = {} }) => {
  const [formData, setFormData] = useState({
    month: '',
    totalContribution: '',
    employeeContribution: '',
    employerContribution: '',
    challanNo: '',
    remittanceDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        month: initialData.month || '',
        totalContribution: initialData.totalContribution || '',
        employeeContribution: initialData.employeeContribution || '',
        employerContribution: initialData.employerContribution || '',
        challanNo: initialData.challanNo || '',
        remittanceDate: initialData.remittanceDate || new Date().toISOString().split('T')[0]
      });
      setIsSubmitting(false);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.month || !formData.totalContribution) {
      alert('Please fill all required fields');
      return;
    }
    setIsSubmitting(true);
    onSubmit(formData);
  };

  const titleMap = {
    pf: 'PF Remittance',
    esi: 'ESI Remittance',
    pt: 'PT Remittance'
  };

  const typeColors = {
    pf: 'blue',
    esi: 'cyan',
    pt: 'yellow'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titleMap[type] || 'Remittance'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Month/Period <span className="text-rose-500">*</span>
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
              Challan Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.challanNo}
              onChange={(e) => setFormData({ ...formData, challanNo: e.target.value })}
              placeholder="Enter challan number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Total Contribution (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.totalContribution}
              onChange={(e) => setFormData({ ...formData, totalContribution: e.target.value })}
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Employee Contribution (₹)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.employeeContribution}
              onChange={(e) => setFormData({ ...formData, employeeContribution: e.target.value })}
              placeholder="Employee share"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Employer Contribution (₹)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.employerContribution}
              onChange={(e) => setFormData({ ...formData, employerContribution: e.target.value })}
              placeholder="Employer share"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Remittance Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.remittanceDate}
              onChange={(e) => setFormData({ ...formData, remittanceDate: e.target.value })}
            />
          </div>
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
            className={`px-4 py-2 bg-${typeColors[type] || 'blue'}-600 text-white rounded-xl text-sm font-semibold hover:bg-${typeColors[type] || 'blue'}-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icon icon="heroicons:plus" className="w-4 h-4" />
                Save Remittance
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RemittanceModal;