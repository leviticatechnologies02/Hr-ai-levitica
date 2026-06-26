import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const PayrollRunModal = ({ isOpen, onClose, onSubmit, isProcessing, payrollLocked }) => {
  const handleSubmit = (type) => {
    onSubmit(type);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Run Payroll Processing" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleSubmit('regular')}
            disabled={isProcessing || payrollLocked}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 text-center transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="heroicons:calendar" className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h6 className="font-semibold text-slate-800">Regular Payroll</h6>
            <p className="text-xs text-slate-500">Monthly salary processing</p>
          </button>
          <button
            onClick={() => handleSubmit('bonus')}
            disabled={isProcessing || payrollLocked}
            className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 text-center transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="heroicons:gift" className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h6 className="font-semibold text-slate-800">Bonus Run</h6>
            <p className="text-xs text-slate-500">Bonus and incentive payment</p>
          </button>
          <button
            onClick={() => handleSubmit('advance')}
            disabled={isProcessing || payrollLocked}
            className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 text-center transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="heroicons:banknotes" className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h6 className="font-semibold text-slate-800">Advance Salary</h6>
            <p className="text-xs text-slate-500">Salary advance processing</p>
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Note:</p>
            <p className="text-xs text-blue-600">The payroll process will automatically fetch attendance data, calculate statutory deductions, process reimbursements, and generate payslips.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('regular')}
            disabled={isProcessing || payrollLocked}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Icon icon="svg-spinners:180-ring" className="w-4 h-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Icon icon="heroicons:play" className="w-4 h-4" />
                Start Regular Payroll
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PayrollRunModal;