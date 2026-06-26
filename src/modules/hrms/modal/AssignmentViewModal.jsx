import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const AssignmentViewModal = ({ isOpen, onClose, assignment, onEdit, onDelete }) => {
  if (!assignment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assignment: ${assignment.name}`} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Employee Information</h6>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Employee ID</label>
                <p className="text-sm font-medium text-slate-800">{assignment.employeeId}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Name</label>
                <p className="text-sm font-medium text-slate-800">{assignment.name}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Email</label>
                <p className="text-sm text-slate-700">{assignment.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Department</label>
                <p className="text-sm text-slate-700">{assignment.department}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Location</label>
                <p className="text-sm text-slate-700">{assignment.location || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Assignment Details</h6>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Structure</label>
                <p className="text-sm font-medium text-slate-800">{assignment.currentStructure}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Grade / Level</label>
                <p className="text-sm text-slate-700">{assignment.grade} / {assignment.level || 'N/A'}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Assignment Type</label>
                <p className="text-sm text-slate-700 capitalize">{assignment.assignmentType || 'Initial'}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Status</label>
                <div className="mt-1">
                  {assignment.assignmentStatus === 'active' ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Pending</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500">Effective Date</label>
                <p className="text-sm text-slate-700">{assignment.effectiveDate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Financial Details</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Annual CTC</span>
                <span className="font-bold text-blue-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(assignment.ctc)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Gross Salary (Monthly)</span>
                <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(assignment.grossSalary)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Take-Home (Monthly)</span>
                <span className="font-bold text-emerald-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(assignment.takeHome)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">CTC vs Take-Home</span>
                <span className="font-semibold text-purple-600">
                  {assignment.ctc > 0 ? `${((assignment.takeHome * 12 / assignment.ctc) * 100).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {assignment.salaryBreakdown && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Salary Breakdown</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(assignment.salaryBreakdown.basic || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">HRA</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(assignment.salaryBreakdown.hra || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Conveyance</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(assignment.salaryBreakdown.conveyance || 0)}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Special Allowance</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(assignment.salaryBreakdown.specialAllowance || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Performance Bonus</span>
                  <span className="font-semibold text-emerald-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(assignment.salaryBreakdown.performanceBonus || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Other Allowances</span>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(assignment.salaryBreakdown.otherAllowances || 0)}</span>
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

export default AssignmentViewModal;