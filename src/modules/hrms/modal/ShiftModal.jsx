import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ShiftModal = ({
  isOpen,
  onClose,
  editingShift,
  shiftForm,
  setShiftForm,
  handleAddShift,
  addBreakTime,
  updateBreakTime,
  removeBreakTime
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingShift ? "Edit Shift" : "Add New Shift"}
      size="xl"
    >
      <div className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Shift Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={shiftForm.name}
              onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
              placeholder="Enter shift name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Shift Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={shiftForm.code}
              onChange={(e) => setShiftForm({ ...shiftForm, code: e.target.value })}
              placeholder="Enter shift code"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Shift Type</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={shiftForm.type}
              onChange={(e) => setShiftForm({ ...shiftForm, type: e.target.value })}
            >
              <option value="general">General</option>
              <option value="night">Night</option>
              <option value="rotational">Rotational</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          {shiftForm.type === "rotational" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Rotation Pattern</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                value={shiftForm.rotationPattern || "weekly"}
                onChange={(e) => setShiftForm({ ...shiftForm, rotationPattern: e.target.value })}
              >
                <option value="daily">Daily Rotation</option>
                <option value="weekly">Weekly Rotation</option>
                <option value="biweekly">Bi-Weekly Rotation</option>
              </select>
              <p className="text-xs text-slate-400 mt-1">How often shifts rotate</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Duration (hours)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={shiftForm.duration}
              onChange={(e) => setShiftForm({ ...shiftForm, duration: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Start Time</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={shiftForm.startTime}
              onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">End Time</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={shiftForm.endTime}
              onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
            />
          </div>
          {shiftForm.type === "flexible" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Core Hours Start</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={shiftForm.coreHours.start}
                  onChange={(e) => setShiftForm({ ...shiftForm, coreHours: { ...shiftForm.coreHours, start: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Core Hours End</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={shiftForm.coreHours.end}
                  onChange={(e) => setShiftForm({ ...shiftForm, coreHours: { ...shiftForm.coreHours, end: e.target.value } })}
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Grace Period (minutes)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={shiftForm.gracePeriod}
              onChange={(e) => setShiftForm({ ...shiftForm, gracePeriod: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Differential Pay Multiplier</label>
            <input
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={shiftForm.differentialPay}
              onChange={(e) => setShiftForm({ ...shiftForm, differentialPay: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Week Offs</label>
          <div className="flex flex-wrap gap-3">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <label key={day} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  checked={shiftForm.weekOffs.includes(day)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setShiftForm({ ...shiftForm, weekOffs: [...shiftForm.weekOffs, day] });
                    } else {
                      setShiftForm({ ...shiftForm, weekOffs: shiftForm.weekOffs.filter((d) => d !== day) });
                    }
                  }}
                />
                <span className="text-sm text-slate-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-700">Break Times</label>
            <button
              type="button"
              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
              onClick={addBreakTime}
            >
              <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
              Add Break
            </button>
          </div>
          {shiftForm.breakTimes.map((breakTime, index) => (
            <div key={index} className="border border-slate-200 rounded-xl p-3 mb-2 bg-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                <input
                  type="text"
                  className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  placeholder="Break Name"
                  value={breakTime.name}
                  onChange={(e) => updateBreakTime(index, "name", e.target.value)}
                />
                <input
                  type="time"
                  className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={breakTime.start}
                  onChange={(e) => updateBreakTime(index, "start", e.target.value)}
                />
                <input
                  type="time"
                  className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={breakTime.end}
                  onChange={(e) => updateBreakTime(index, "end", e.target.value)}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    checked={breakTime.paid}
                    onChange={(e) => updateBreakTime(index, "paid", e.target.checked)}
                  />
                  <span className="text-sm text-slate-700">Paid</span>
                </label>
                <button
                  type="button"
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  onClick={() => removeBreakTime(index)}
                >
                  <Icon icon="heroicons:trash" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-y"
            rows="3"
            value={shiftForm.description}
            onChange={(e) => setShiftForm({ ...shiftForm, description: e.target.value })}
            placeholder="Enter shift description..."
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              checked={shiftForm.allowMultiplePerDay}
              onChange={(e) => setShiftForm({ ...shiftForm, allowMultiplePerDay: e.target.checked })}
            />
            <span className="text-sm text-slate-700">Allow Multiple Shifts Per Day</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              checked={shiftForm.isActive}
              onChange={(e) => setShiftForm({ ...shiftForm, isActive: e.target.checked })}
            />
            <span className="text-sm text-slate-700">Active</span>
          </label>
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
            onClick={handleAddShift}
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            {editingShift ? "Update" : "Save"} Shift
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShiftModal;