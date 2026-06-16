// components/modals/ConfirmModal.jsx
import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ConfirmProbationModal = ({
  isOpen,
  onClose,
  selectedEmployee,
  onConfirm
}) => {
  if (!isOpen || !selectedEmployee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Employee"
      size="md"
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon icon="heroicons:check" className="w-8 h-8 text-green-600" />
        </div>
        
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Confirm Employment</h4>
        <p className="text-gray-500 mb-4">
          Confirm <strong className="text-gray-700">{selectedEmployee.name}</strong> as a permanent employee?
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm text-left">
          <span className="font-medium">Success:</span>
          <span className="ml-1">This employee has completed probation successfully.</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          onClick={onConfirm}
        >
          <Icon icon="heroicons:check-circle" className="w-4 h-4" />
          Confirm Employee
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmProbationModal;