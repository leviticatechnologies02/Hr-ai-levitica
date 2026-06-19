import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const FlexibleArrangementModal = ({
  isOpen,
  onClose,
  flexibleForm,
  setFlexibleForm,
  handleFlexibleArrangement,
  employees
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Flexible Work Arrangement"
      size="xl"
    >
      <div className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Employee <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={flexibleForm.employeeId}
              onChange={(e) => setFlexibleForm({ ...flexibleForm, employeeId: e.target.value })}
            >
              <option value="">Select employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Arrangement Type</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={flexibleForm.arrangementType}
              onChange={(e) => setFlexibleForm({ ...flexibleForm, arrangementType: e.target.value })}
            >
              <option value="flexible">Flexible Timing</option>
              <option value="hybrid">Hybrid Work</option>
              <option value="compressed">Compressed Week</option>
              <option value="remote">Remote Work</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Core Hours Start</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={flexibleForm.coreHours.start}
              onChange={(e) => setFlexibleForm({ ...flexibleForm, coreHours: { ...flexibleForm.coreHours, start: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Core Hours End</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={flexibleForm.coreHours.end}
              onChange={(e) => setFlexibleForm({ ...flexibleForm, coreHours: { ...flexibleForm.coreHours, end: e.target.value } })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Flexible Start Time</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={flexibleForm.flexibleStart}
              onChange={(e) => setFlexibleForm({ ...flexibleForm, flexibleStart: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Flexible End Time</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={flexibleForm.flexibleEnd}
              onChange={(e) => setFlexibleForm({ ...flexibleForm, flexibleEnd: e.target.value })}
            />
          </div>
        </div>

        {(flexibleForm.arrangementType === "remote" || flexibleForm.arrangementType === "flexible") && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Remote Work Days</label>
            <div className="flex flex-wrap gap-3">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <label key={day} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    checked={flexibleForm.remoteWorkDays.includes(day)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFlexibleForm({ ...flexibleForm, remoteWorkDays: [...flexibleForm.remoteWorkDays, day] });
                      } else {
                        setFlexibleForm({ ...flexibleForm, remoteWorkDays: flexibleForm.remoteWorkDays.filter((d) => d !== day) });
                      }
                    }}
                  />
                  <span className="text-sm text-slate-700">{day}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">Select days when employee works remotely</p>
          </div>
        )}

        {flexibleForm.arrangementType === "hybrid" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Office Days</label>
              <div className="flex flex-wrap gap-3">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <label key={day} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      checked={flexibleForm.hybridSchedule.officeDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlexibleForm({
                            ...flexibleForm,
                            hybridSchedule: {
                              ...flexibleForm.hybridSchedule,
                              officeDays: [...flexibleForm.hybridSchedule.officeDays, day],
                              remoteDays: flexibleForm.hybridSchedule.remoteDays.filter((d) => d !== day),
                            },
                          });
                        } else {
                          setFlexibleForm({
                            ...flexibleForm,
                            hybridSchedule: {
                              ...flexibleForm.hybridSchedule,
                              officeDays: flexibleForm.hybridSchedule.officeDays.filter((d) => d !== day),
                            },
                          });
                        }
                      }}
                    />
                    <span className="text-sm text-slate-700">{day}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">Select days when employee works from office</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Remote Days</label>
              <div className="flex flex-wrap gap-3">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <label key={day} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      checked={flexibleForm.hybridSchedule.remoteDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlexibleForm({
                            ...flexibleForm,
                            hybridSchedule: {
                              ...flexibleForm.hybridSchedule,
                              remoteDays: [...flexibleForm.hybridSchedule.remoteDays, day],
                              officeDays: flexibleForm.hybridSchedule.officeDays.filter((d) => d !== day),
                            },
                          });
                        } else {
                          setFlexibleForm({
                            ...flexibleForm,
                            hybridSchedule: {
                              ...flexibleForm.hybridSchedule,
                              remoteDays: flexibleForm.hybridSchedule.remoteDays.filter((d) => d !== day),
                            },
                          });
                        }
                      }}
                    />
                    <span className="text-sm text-slate-700">{day}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">Select days when employee works remotely</p>
            </div>
          </>
        )}

        {flexibleForm.arrangementType === "compressed" && (
          <>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  checked={flexibleForm.compressedWeek.enabled}
                  onChange={(e) => setFlexibleForm({ ...flexibleForm, compressedWeek: { ...flexibleForm.compressedWeek, enabled: e.target.checked } })}
                />
                <span className="text-sm text-slate-700">Enable Compressed Work Week</span>
              </label>
            </div>
            {flexibleForm.compressedWeek.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Work Days Per Week</label>
                  <input
                    type="number"
                    min="3"
                    max="5"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={flexibleForm.compressedWeek.workDays}
                    onChange={(e) => setFlexibleForm({ ...flexibleForm, compressedWeek: { ...flexibleForm.compressedWeek, workDays: parseInt(e.target.value) || 4 } })}
                  />
                  <p className="text-xs text-slate-400 mt-1">Typically 4 days (e.g., Mon-Thu)</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Hours Per Day</label>
                  <input
                    type="number"
                    min="8"
                    max="12"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={flexibleForm.compressedWeek.hoursPerDay}
                    onChange={(e) => setFlexibleForm({ ...flexibleForm, compressedWeek: { ...flexibleForm.compressedWeek, hoursPerDay: parseInt(e.target.value) || 10 } })}
                  />
                  <p className="text-xs text-slate-400 mt-1">Hours to work per day (e.g., 10 hours)</p>
                </div>
                <div className="md:col-span-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-700">
                      <strong>Total Weekly Hours:</strong> {flexibleForm.compressedWeek.workDays * flexibleForm.compressedWeek.hoursPerDay} hours
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      This arrangement allows working {flexibleForm.compressedWeek.workDays} days per week with {flexibleForm.compressedWeek.hoursPerDay} hours per day.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

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
            onClick={handleFlexibleArrangement}
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            Save Arrangement
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FlexibleArrangementModal;