import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const RuleEditModal = ({ isOpen, onClose, onSave, rule = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    id: null,
    feature: '',
    description: '',
    formula: '',
    multiplier: 1.0,
    enabled: true
  });

  useEffect(() => {
    if (isOpen) {
      if (rule) {
        setFormData({
          id: rule.id || null,
          feature: rule.feature || '',
          description: rule.description || '',
          formula: rule.formula || '',
          multiplier: rule.multiplier || 1.0,
          enabled: rule.enabled !== undefined ? rule.enabled : true
        });
      } else {
        setFormData({
          id: null,
          feature: '',
          description: '',
          formula: '',
          multiplier: 1.0,
          enabled: true
        });
      }
    }
  }, [isOpen, rule]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.feature || !formData.description || !formData.formula) {
      alert('Please fill all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={rule ? 'Edit Calculation Rule' : 'Add Calculation Rule'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Rule Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="feature"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.feature}
            onChange={handleChange}
            placeholder="Enter rule name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="description"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the calculation rule"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Formula <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="formula"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.formula}
            onChange={handleChange}
            placeholder="e.g., Daily Rate × Absent Days"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Multiplier</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              name="multiplier"
              min="0.5"
              max="3.0"
              step="0.1"
              value={formData.multiplier}
              onChange={handleChange}
              className="flex-1"
            />
            <span className="text-sm font-semibold text-blue-600 min-w-[40px]">{formData.multiplier}x</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Adjust the multiplier for this calculation (0.5x to 3.0x)</p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="enabled"
            checked={formData.enabled}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Enable this rule</span>
        </label>

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
                Saving...
              </>
            ) : (
              <>
                <Icon icon="heroicons:check" className="w-4 h-4" />
                {rule ? 'Save Changes' : 'Add Rule'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RuleEditModal;