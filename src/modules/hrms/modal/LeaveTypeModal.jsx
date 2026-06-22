import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const LeaveTypeModal = ({
  isOpen,
  onClose,
  editingLeaveType,
  leaveTypeForm,
  setLeaveTypeForm,
  handleAddLeaveType
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingLeaveType ? "Edit Leave Type" : "Add New Leave Type"}
      size="md"
    >
      <div className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Leave Type Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={leaveTypeForm.name}
            onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, name: e.target.value })}
            placeholder="Enter leave type name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Code <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={leaveTypeForm.code}
            onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, code: e.target.value })}
            placeholder="CL"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Accrual Type</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={leaveTypeForm.accrualType}
              onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, accrualType: e.target.value })}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
              <option value="on-joining">On Joining</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Accrual Amount</label>
            <input
              type="number"
              step="0.25"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={leaveTypeForm.accrualAmount}
              onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, accrualAmount: parseFloat(e.target.value) })}
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Max Accrual (days)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={leaveTypeForm.maxAccrual}
            onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, maxAccrual: parseInt(e.target.value) })}
            min="1"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              checked={leaveTypeForm.isPaid}
              onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, isPaid: e.target.checked })}
            />
            <span className="text-sm text-slate-700">Paid Leave</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              checked={leaveTypeForm.allowHalfDay}
              onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, allowHalfDay: e.target.checked })}
            />
            <span className="text-sm text-slate-700">Allow Half Day</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              checked={leaveTypeForm.carryForward.enabled}
              onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, carryForward: { ...leaveTypeForm.carryForward, enabled: e.target.checked } })}
            />
            <span className="text-sm text-slate-700">Carry Forward</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-y"
            rows="2"
            value={leaveTypeForm.description}
            onChange={(e) => setLeaveTypeForm({ ...leaveTypeForm, description: e.target.value })}
            placeholder="Enter leave type description..."
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-500/10"
            onClick={handleAddLeaveType}
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            {editingLeaveType ? "Update" : "Save"} Leave Type
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveTypeModal;