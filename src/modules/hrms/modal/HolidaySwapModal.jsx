import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const HolidaySwapModal = ({
  isOpen,
  onClose,
  swapForm,
  setSwapForm,
  handleHolidaySwap,
  employees
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Holiday Swap Request"
      size="md"
    >
      <div className="space-y-4 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Employee <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={swapForm.employeeId}
            onChange={(e) => setSwapForm({ ...swapForm, employeeId: e.target.value })}
          >
            <option value="">Select employee...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Holiday Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={swapForm.holidayDate}
              onChange={(e) => setSwapForm({ ...swapForm, holidayDate: e.target.value })}
            />
            <p className="text-xs text-slate-400 mt-1">Date you want to work</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Work Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={swapForm.workDate}
              onChange={(e) => setSwapForm({ ...swapForm, workDate: e.target.value })}
            />
            <p className="text-xs text-slate-400 mt-1">Date you want to take off</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-y"
            rows="3"
            value={swapForm.reason}
            onChange={(e) => setSwapForm({ ...swapForm, reason: e.target.value })}
            placeholder="Enter reason for holiday swap"
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
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-amber-500/10"
            onClick={handleHolidaySwap}
          >
            <Icon icon="heroicons:paper-airplane" className="w-4 h-4" />
            Submit Swap Request
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HolidaySwapModal;