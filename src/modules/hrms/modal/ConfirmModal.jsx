import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary', // 'primary', 'success', 'danger', 'warning'
  icon = 'heroicons:question-mark-circle',
  iconColor = 'text-blue-500',
  isLoading = false,
  details = null,
  showWarning = false,
  warningText = '',
  size = 'md'
}) => {
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white'
  };

  const iconColors = {
    'text-blue-500': 'bg-blue-50',
    'text-emerald-500': 'bg-emerald-50',
    'text-rose-500': 'bg-rose-50',
    'text-amber-500': 'bg-amber-50',
    'text-purple-500': 'bg-purple-50'
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <div className="p-4">
        <div className="text-center">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${iconColors[iconColor] || 'bg-slate-50'} mb-4`}>
            <Icon icon={icon} className={`w-8 h-8 ${iconColor}`} />
          </div>

          {/* Message */}
          <h6 className="text-lg font-bold text-slate-900 mb-2">{title}</h6>
          <p className="text-slate-500 text-sm mb-4">{message}</p>

          {/* Warning Alert */}
          {showWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left">
              <div className="flex items-start gap-2 text-amber-800 text-sm">
                <Icon icon="heroicons:exclamation-triangle" className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Warning:</strong>
                  <span className="text-xs text-amber-700">{warningText || 'This action cannot be undone.'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Details Section - For showing additional information */}
          {details && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-sm space-y-2 text-left">
              {typeof details === 'string' ? (
                <p className="text-slate-700">{details}</p>
              ) : (
                Object.entries(details).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-slate-500">{key}:</span>
                    <span className="font-semibold text-slate-800">{value}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-3 mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="flex-1 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[confirmVariant] || variantStyles.primary}`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Icon icon={confirmVariant === 'danger' ? 'heroicons:trash' : 'heroicons:check'} className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;