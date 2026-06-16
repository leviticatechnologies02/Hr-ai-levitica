// components/modals/TerminateModal.jsx
import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const TerminateProbationModal = ({
  isOpen,
  onClose,
  selectedEmployee,
  terminationForm,
  setTerminationForm,
  onSubmit
}) => {
  if (!isOpen || !selectedEmployee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terminate Probation"
      size="md"
    >
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
            <span className="font-medium">Terminating probation for:</span>
            <span className="ml-1 font-semibold">{selectedEmployee.name}</span>
            <span className="ml-1 text-xs opacity-70">({selectedEmployee.employeeId})</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Termination <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Provide detailed reason for probation termination..."
              value={terminationForm.reason}
              onChange={(e) => setTerminationForm({ ...terminationForm, reason: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={terminationForm.effectiveDate}
              onChange={(e) => setTerminationForm({ ...terminationForm, effectiveDate: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={terminationForm.noticePeriodWaived}
                onChange={(e) => setTerminationForm({ ...terminationForm, noticePeriodWaived: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Waive notice period</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={terminationForm.severancePackage}
                onChange={(e) => setTerminationForm({ ...terminationForm, severancePackage: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Provide severance package</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Any additional comments..."
              value={terminationForm.comments}
              onChange={(e) => setTerminationForm({ ...terminationForm, comments: e.target.value })}
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
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:x-circle" className="w-4 h-4" />
            Terminate Probation
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TerminateProbationModal;