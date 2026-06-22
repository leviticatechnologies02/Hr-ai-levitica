import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const HolidayCarryForwardModal = ({
  isOpen,
  onClose,
  carryForwardForm,
  setCarryForwardForm,
  handleCarryForward,
  holidays,
  employees
}) => {
  const optionalHolidays = holidays.filter((h) => h.optional && h.allowCarryForward);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Process Holiday Carry Forward"
      size="lg"
    >
      <div className="space-y-4 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Employee <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={carryForwardForm.employeeId}
              onChange={(e) => setCarryForwardForm({ ...carryForwardForm, employeeId: e.target.value })}
            >
              <option value="">Select employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">From Year</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={carryForwardForm.fromYear}
                onChange={(e) => setCarryForwardForm({ ...carryForwardForm, fromYear: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">To Year</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={carryForwardForm.toYear}
                onChange={(e) => setCarryForwardForm({ ...carryForwardForm, toYear: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Select Unused Optional Holidays
          </label>
          <div className="border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto">
            {optionalHolidays.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No optional holidays with carry forward enabled</p>
            ) : (
              optionalHolidays.map((holiday) => (
                <label key={holiday.id} className="flex items-center gap-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-lg px-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    checked={carryForwardForm.holidays.includes(holiday.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCarryForwardForm({
                          ...carryForwardForm,
                          holidays: [...carryForwardForm.holidays, holiday.id],
                        });
                      } else {
                        setCarryForwardForm({
                          ...carryForwardForm,
                          holidays: carryForwardForm.holidays.filter((id) => id !== holiday.id),
                        });
                      }
                    }}
                  />
                  <span className="text-sm text-slate-700">{holiday.name} ({holiday.date})</span>
                </label>
              ))
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">Select holidays to carry forward to the next year</p>
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
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-slate-500/10"
            onClick={handleCarryForward}
            disabled={!carryForwardForm.employeeId || carryForwardForm.holidays.length === 0}
          >
            <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
            Process Carry Forward
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HolidayCarryForwardModal;