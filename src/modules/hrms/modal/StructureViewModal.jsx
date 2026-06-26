import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const StructureViewModal = ({ isOpen, onClose, structure, onEdit, onDelete, calculateBreakdown }) => {
  if (!structure) return null;

  const breakdown = calculateBreakdown(structure);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Structure: ${structure.name}`} size="xl">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Basic Information</h6>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Name</label>
                <p className="text-sm font-medium text-slate-800">{structure.name}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Grade / Level</label>
                <p className="text-sm text-slate-700">{structure.grade} / {structure.level || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Category</label>
                <p className="text-sm text-slate-700 capitalize">{structure.category}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Status</label>
                <div className="mt-1">
                  {structure.status === 'active' ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>
                  ) : structure.status === 'draft' ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Draft</span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Inactive</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Financial Details</h6>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Annual CTC</label>
                <p className="text-sm font-bold text-blue-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(structure.ctc)}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Min / Max CTC</label>
                <p className="text-sm text-slate-700">
                  {structure.minCTC ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(structure.minCTC) : 'N/A'} 
                  {' - '}
                  {structure.maxCTC ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(structure.maxCTC) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Increment Range</label>
                <p className="text-sm text-slate-700">{structure.incrementRange || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Employees</label>
                <p className="text-sm text-slate-700">{structure.employeeCount || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Departments</h6>
            <div className="flex flex-wrap gap-1.5">
              {structure.department && structure.department.length > 0 ? (
                structure.department.map((dept, idx) => (
                  <span key={idx} className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">{dept}</span>
                ))
              ) : (
                <span className="text-sm text-slate-400">All Departments</span>
              )}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Locations</h6>
            <div className="flex flex-wrap gap-1.5">
              {structure.location && structure.location.length > 0 ? (
                structure.location.map((loc, idx) => (
                  <span key={idx} className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">{loc}</span>
                ))
              ) : (
                <span className="text-sm text-slate-400">All Locations</span>
              )}
            </div>
          </div>
        </div>

        {breakdown && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Salary Breakdown</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(breakdown.basic)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">HRA</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(breakdown.hra)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Conveyance</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(breakdown.conveyance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Special Allowance</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(breakdown.specialAllowance)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">PF Deduction</span>
                  <span className="font-semibold text-rose-600">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(breakdown.pf)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Professional Tax</span>
                  <span className="font-semibold text-rose-600">-{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(breakdown.professionalTax)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-700">Gross Salary</span>
                    <span className="text-blue-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(breakdown.gross)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-700">Take-Home</span>
                  <span className="text-emerald-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(breakdown.takeHome)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

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

export default StructureViewModal;