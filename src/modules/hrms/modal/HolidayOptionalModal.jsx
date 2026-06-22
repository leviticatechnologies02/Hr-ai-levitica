import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const HolidayOptionalModal = ({
  isOpen,
  onClose,
  holidays,
  selectedOptionalHoliday,
  setSelectedOptionalHoliday,
  optionalReason,
  setOptionalReason,
  applyOptionalHoliday
}) => {
  const optionalHolidays = holidays.filter((h) => h.optional);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply Optional Holiday"
      size="md"
    >
      <div className="space-y-4 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Select Holiday <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={selectedOptionalHoliday}
            onChange={(e) => setSelectedOptionalHoliday(e.target.value)}
          >
            <option value="">Select a holiday</option>
            {optionalHolidays.map((opt) => (
              <option key={opt.id} value={opt.name}>
                {opt.name} ({opt.date})
              </option>
            ))}
          </select>
          {optionalHolidays.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">No optional holidays available</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Reason (Optional)</label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-y"
            rows="3"
            value={optionalReason}
            onChange={(e) => setOptionalReason(e.target.value)}
            placeholder="Enter reason for applying this optional holiday..."
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
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/10"
            onClick={applyOptionalHoliday}
            disabled={!selectedOptionalHoliday}
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            Submit Application
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HolidayOptionalModal;