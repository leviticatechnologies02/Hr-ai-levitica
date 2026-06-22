import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const LeaveApplicationModal = ({
  isOpen,
  onClose,
  applicationForm,
  setApplicationForm,
  handleSubmitApplication,
  employees,
  leaveTypes
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Leave Application"
      size="lg"
    >
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Employee <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={applicationForm.employeeId}
              onChange={(e) => setApplicationForm({ ...applicationForm, employeeId: e.target.value })}
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
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Leave Type <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={applicationForm.leaveTypeId}
              onChange={(e) => setApplicationForm({ ...applicationForm, leaveTypeId: parseInt(e.target.value) })}
            >
              <option value="">Select leave type...</option>
              {leaveTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.name} ({lt.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Start Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={applicationForm.startDate}
              onChange={(e) => setApplicationForm({ ...applicationForm, startDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={applicationForm.endDate}
              onChange={(e) => setApplicationForm({ ...applicationForm, endDate: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                checked={applicationForm.halfDay}
                onChange={(e) => setApplicationForm({ ...applicationForm, halfDay: e.target.checked })}
              />
              <span className="text-sm text-slate-700">Half Day Leave</span>
            </label>
            {applicationForm.halfDay && (
              <select
                className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                value={applicationForm.halfDayType}
                onChange={(e) => setApplicationForm({ ...applicationForm, halfDayType: e.target.value })}
              >
                <option value="first">First Half</option>
                <option value="second">Second Half</option>
              </select>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-y"
              rows="3"
              value={applicationForm.reason}
              onChange={(e) => setApplicationForm({ ...applicationForm, reason: e.target.value })}
              placeholder="Enter reason for leave..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Attachment (Optional)</label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setApplicationForm({ ...applicationForm, attachment: e.target.files[0] })}
            />
            {applicationForm.attachment && (
              <p className="text-xs text-slate-500 mt-1">Selected: {applicationForm.attachment.name}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                checked={applicationForm.isBulk}
                onChange={(e) => setApplicationForm({ ...applicationForm, isBulk: e.target.checked })}
              />
              <span className="text-sm text-slate-700">Bulk Leave Application</span>
            </label>
            {applicationForm.isBulk && (
              <div className="mt-2 border border-slate-200 rounded-xl p-3 max-h-40 overflow-y-auto">
                {employees.map((emp) => (
                  <label key={emp.id} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      checked={applicationForm.bulkEmployees.includes(emp.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setApplicationForm({
                            ...applicationForm,
                            bulkEmployees: [...applicationForm.bulkEmployees, emp.id]
                          });
                        } else {
                          setApplicationForm({
                            ...applicationForm,
                            bulkEmployees: applicationForm.bulkEmployees.filter((id) => id !== emp.id)
                          });
                        }
                      }}
                    />
                    <span className="text-sm text-slate-700">{emp.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
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
            onClick={handleSubmitApplication}
          >
            <Icon icon="heroicons:paper-airplane" className="w-4 h-4" />
            Submit Application
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveApplicationModal;