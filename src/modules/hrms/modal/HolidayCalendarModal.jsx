import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';
import { attendanceAPI } from '../../../shared/utils/api';

const HolidayCalendarModal = ({
  isOpen,
  onClose,
  calendarForm,
  setCalendarForm,
  isEditCalendar,
  editingCalendarId,
  dispatch,
  locations,
  employeeGroups,
  showNotification
}) => {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!calendarForm.name || !calendarForm.location) {
      showNotification("Please fill all required fields", "warning");
      return;
    }

    setSaving(true);
    try {
      if (isEditCalendar) {
        const updated = await attendanceAPI.updateHolidayCalendar(editingCalendarId, {
          calendar_name: calendarForm.name,
          location: calendarForm.location,
          employee_groups: (calendarForm.employeeGroups || []).join(', ') || null,
          is_default: calendarForm.isDefault,
        });
        dispatch({
          type: "UPDATE_CALENDAR",
          payload: {
            id: updated.id,
            name: updated.calendar_name,
            location: updated.location,
            employeeGroups: updated.employee_groups,
            status: updated.status,
            isDefault: updated.is_default,
            description: updated.description,
            holidayCount: updated.holiday_count,
            createdAt: updated.created_at,
          },
        });
        showNotification("Calendar updated successfully!", "success");
      } else {
        const created = await attendanceAPI.addHolidayCalendar({
          calendar_name: calendarForm.name,
          location: calendarForm.location,
          employee_groups: (calendarForm.employeeGroups || []).join(', ') || 'All Groups',
          is_default: calendarForm.isDefault || false,
        });
        dispatch({
          type: "ADD_CALENDAR",
          payload: {
            id: created.id,
            name: created.calendar_name,
            location: created.location,
            employeeGroups: created.employee_groups,
            status: created.status,
            isDefault: created.is_default,
            description: created.description,
            holidayCount: created.holiday_count,
            createdAt: created.created_at,
          },
        });
        showNotification("Calendar added successfully!", "success");
      }
      onClose();
    } catch (err) {
      showNotification(err.message || "Failed to save calendar", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditCalendar ? "Edit Holiday Calendar" : "Add Holiday Calendar"}
      size="md"
    >
      <div className="space-y-4 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Calendar Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={calendarForm.name}
            onChange={(e) => setCalendarForm({ ...calendarForm, name: e.target.value })}
            placeholder="e.g., Bangalore Office Calendar"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Location <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={calendarForm.location}
            onChange={(e) => setCalendarForm({ ...calendarForm, location: e.target.value })}
          >
            <option value="">Select location...</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Employee Group
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={calendarForm.employeeGroups?.[0] || "all"}
            onChange={(e) => setCalendarForm({ ...calendarForm, employeeGroups: [e.target.value] })}
          >
            <option value="all">All Groups</option>
            {employeeGroups.map((group) => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">Calendar will apply to the selected employee group</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            checked={calendarForm.isDefault}
            onChange={(e) => setCalendarForm({ ...calendarForm, isDefault: e.target.checked })}
            id="isDefault"
          />
          <label htmlFor="isDefault" className="text-sm text-slate-700 cursor-pointer">
            Set as Default Calendar
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
            onClick={handleSave}
          >
            <Icon icon="heroicons:check" className="w-4 h-4" />
            {isEditCalendar ? "Update Calendar" : "Save Calendar"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default HolidayCalendarModal;