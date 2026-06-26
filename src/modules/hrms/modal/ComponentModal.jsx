import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ComponentModal = ({ isOpen, onClose, onSubmit, component }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'earnings',
    type: 'fixed',
    taxable: false,
    statutory: false,
    calculation: 'flat_amount',
    value: '',
    base: 'fixed',
    proRata: true,
    rounding: 'nearest_integer',
    description: '',
    isActive: true,
  });

  const isEditing = !!component;

  useEffect(() => {
    if (isOpen && component) {
      setFormData({
        name: component.name || '',
        category: component.category || 'earnings',
        type: component.type || 'fixed',
        taxable: component.taxable || false,
        statutory: component.statutory || false,
        calculation: component.calculation || 'flat_amount',
        value: component.value || '',
        base: component.base || 'fixed',
        proRata: component.proRata !== undefined ? component.proRata : true,
        rounding: component.rounding || 'nearest_integer',
        description: component.description || '',
        isActive: component.isActive !== undefined ? component.isActive : true,
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        category: 'earnings',
        type: 'fixed',
        taxable: false,
        statutory: false,
        calculation: 'flat_amount',
        value: '',
        base: 'fixed',
        proRata: true,
        rounding: 'nearest_integer',
        description: '',
        isActive: true,
      });
    }
  }, [isOpen, component]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.value) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit({ ...formData, id: component?.id });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Component' : 'Add New Component'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Component Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Performance Bonus"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Category <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="earnings">Earnings</option>
              <option value="deductions">Deductions</option>
              <option value="employer_contributions">Employer Contributions</option>
              <option value="reimbursements">Reimbursements</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Type <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="fixed">Fixed</option>
              <option value="variable">Variable</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Calculation <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.calculation}
              onChange={(e) => setFormData({ ...formData, calculation: e.target.value })}
              required
            >
              <option value="flat_amount">Flat Amount</option>
              <option value="percentage_of_base">% of Base</option>
              <option value="percentage_of_gross">% of Gross</option>
              <option value="percentage_of_ctc">% of CTC</option>
            </select>
          </div>
          {formData.calculation !== 'flat_amount' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Base</label>
              <select
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={formData.base}
                onChange={(e) => setFormData({ ...formData, base: e.target.value })}
              >
                <option value="Basic">Basic</option>
                <option value="Gross">Gross</option>
                <option value="CTC">CTC</option>
                <option value="Taxable">Taxable</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {formData.calculation === 'flat_amount' ? 'Amount (₹)' : 'Percentage (%)'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder={formData.calculation === 'flat_amount' ? 'e.g., 5000' : 'e.g., 12.5'}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.taxable}
              onChange={(e) => setFormData({ ...formData, taxable: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Taxable
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.statutory}
              onChange={(e) => setFormData({ ...formData, statutory: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Statutory
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.proRata}
              onChange={(e) => setFormData({ ...formData, proRata: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Pro-rata
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Active
          </label>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Description</label>
          <textarea
            rows="2"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter component description..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Icon icon={isEditing ? 'heroicons:pencil-square' : 'heroicons:plus'} className="w-4 h-4" />
            {isEditing ? 'Update Component' : 'Add Component'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ComponentModal;