// components/modals/ExtendModal.jsx
import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ExtendProbationModal = ({
  isOpen,
  onClose,
  selectedEmployee,
  extensionForm,
  setExtensionForm,
  onSubmit,
  formatDate
}) => {
  if (!isOpen || !selectedEmployee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Extend Probation Period"
      size="md"
    >
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-700">
            <span className="font-medium">Extending probation for:</span>
            <span className="ml-1 font-semibold">{selectedEmployee.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current End Date</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                value={formatDate(selectedEmployee.probationEndDate)}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extension Duration <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={extensionForm.extensionDays}
                onChange={(e) => {
                  const days = parseInt(e.target.value);
                  const newDate = new Date(selectedEmployee.probationEndDate);
                  newDate.setDate(newDate.getDate() + days);
                  setExtensionForm({
                    ...extensionForm,
                    extensionDays: days,
                    newEndDate: newDate.toISOString().split('T')[0]
                  });
                }}
                required
              >
                <option value="15">15 Days</option>
                <option value="30">30 Days</option>
                <option value="60">60 Days</option>
                <option value="90">90 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={extensionForm.newEndDate}
                onChange={(e) => setExtensionForm({ ...extensionForm, newEndDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Extension <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Provide detailed reason for probation extension..."
              value={extensionForm.reason}
              onChange={(e) => setExtensionForm({ ...extensionForm, reason: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:calendar-plus" className="w-4 h-4" />
            Extend Probation
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExtendProbationModal;