import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ComponentViewModal = ({ isOpen, onClose, component, onEdit, onDelete }) => {
  if (!component) return null;

  const getCategoryLabel = (category) => {
    const labels = {
      'earnings': 'Earnings',
      'deductions': 'Deductions',
      'employer_contributions': 'Employer Contributions',
      'reimbursements': 'Reimbursements'
    };
    return labels[category] || category;
  };

  const getCalculationLabel = (calculation) => {
    const labels = {
      'flat_amount': 'Flat Amount',
      'percentage_of_base': '% of Base',
      'percentage_of_gross': '% of Gross',
      'percentage_of_ctc': '% of CTC'
    };
    return labels[calculation] || calculation;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Component Details: ${component.name}`} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Component Name</label>
            <p className="text-sm font-medium text-slate-800 mt-1">{component.name}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
            <p className="text-sm text-slate-700 mt-1">{getCategoryLabel(component.category)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
            <p className="text-sm text-slate-700 mt-1 capitalize">{component.type}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Calculation</label>
            <p className="text-sm text-slate-700 mt-1">{getCalculationLabel(component.calculation)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</label>
            <p className="text-sm font-semibold text-slate-800 mt-1">
              {component.calculation === 'flat_amount' ? `₹${component.value.toLocaleString()}` : `${component.value}%`}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base</label>
            <p className="text-sm text-slate-700 mt-1">{component.base || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
            <p className="text-sm mt-1">
              {component.isActive ? (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>
              ) : (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Inactive</span>
              )}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pro-rata</label>
            <p className="text-sm text-slate-700 mt-1">{component.proRata ? 'Yes' : 'No'}</p>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
            <p className="text-sm text-slate-700 mt-1">{component.description || 'No description provided'}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            onClick={onEdit}
          >
            <Icon icon="heroicons:pencil-square" className="w-4 h-4" />
            Edit
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            onClick={onDelete}
          >
            <Icon icon="heroicons:trash" className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ComponentViewModal;