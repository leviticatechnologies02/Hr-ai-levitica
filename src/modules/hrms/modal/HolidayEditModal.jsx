import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const HolidayEditModal = ({
  isOpen,
  onClose,
  editHoliday,
  setEditHoliday,
  updateHoliday,
  locations,
  employeeGroups
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Holiday"
      size="md"
    >
      <div className="space-y-4 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Holiday Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={editHoliday.name}
              onChange={(e) => setEditHoliday({ ...editHoliday, name: e.target.value })}
              placeholder="Enter holiday name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={editHoliday.date}
              onChange={(e) => setEditHoliday({ ...editHoliday, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={editHoliday.category}
              onChange={(e) => setEditHoliday({ ...editHoliday, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Public Holiday">Public Holiday</option>
              <option value="National Holiday">National Holiday</option>
              <option value="Festival">Festival</option>
              <option value="State Holiday">State Holiday</option>
              <option value="Regional Holiday">Regional Holiday</option>
              <option value="Local Holiday">Local Holiday</option>
              <option value="Company Holiday">Company Holiday</option>
              <option value="Restricted Holiday">Restricted Holiday</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Holiday Type <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={editHoliday.holidayType}
              onChange={(e) => setEditHoliday({ ...editHoliday, holidayType: e.target.value })}
            >
              <option value="gazetted">Gazetted</option>
              <option value="restricted">Restricted</option>
              <option value="festival">Festival</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Location <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={editHoliday.location}
              onChange={(e) => setEditHoliday({ ...editHoliday, location: e.target.value })}
            >
              <option value="All">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Optional Holiday?
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={editHoliday.optional ? "Yes" : "No"}
              onChange={(e) => setEditHoliday({ ...editHoliday, optional: e.target.value === "Yes" })}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        {editHoliday.optional && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Advance Booking (Days)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                value={editHoliday.advanceBookingDays}
                onChange={(e) => setEditHoliday({ ...editHoliday, advanceBookingDays: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Allow Carry Forward?
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                value={editHoliday.allowCarryForward ? "Yes" : "No"}
                onChange={(e) => setEditHoliday({ ...editHoliday, allowCarryForward: e.target.value === "Yes" })}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            {editHoliday.allowCarryForward && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Carry Forward Limit (days)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={editHoliday.carryForwardLimit}
                  onChange={(e) => setEditHoliday({ ...editHoliday, carryForwardLimit: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Applicable Employee Group
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={editHoliday.applicableGroups?.[0] || "all"}
            onChange={(e) => setEditHoliday({ ...editHoliday, applicableGroups: [e.target.value] })}
          >
            <option value="all">All Groups</option>
            {employeeGroups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">Holiday will apply to the selected employee group</p>
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
            onClick={updateHoliday}
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            Update Holiday
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HolidayEditModal;