import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const PayrollConfigModal = ({ isOpen, onClose, onSubmit, config, payrollLocked }) => {
  const [formData, setFormData] = useState(config);

  useEffect(() => {
    if (isOpen && config) {
      setFormData(config);
    }
  }, [isOpen, config]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (path, value) => {
    setFormData(prev => {
      const newState = { ...prev };
      let current = newState;
      const parts = path.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newState;
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payroll Configuration" size="xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm max-h-[70vh] overflow-y-auto pr-1">
        {payrollLocked && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
            <Icon icon="heroicons:exclamation-triangle" className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-800">Payroll is Locked</p>
              <p className="text-xs text-amber-700">Changes cannot be saved while payroll is locked. Please unlock payroll first.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Cycle Type</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.cycleType}
              onChange={(e) => updateField('cycleType', e.target.value)}
              disabled={payrollLocked}
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="semi-monthly">Semi-monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Pay Period</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.payPeriod}
              onChange={(e) => updateField('payPeriod', e.target.value)}
              disabled={payrollLocked}
            >
              <option value="standard_month">Standard Month</option>
              <option value="calendar_month">Calendar Month</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>
        </div>

        {formData.payPeriod === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={formData.customStartDate}
                onChange={(e) => updateField('customStartDate', e.target.value)}
                disabled={payrollLocked}
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={formData.customEndDate}
                onChange={(e) => updateField('customEndDate', e.target.value)}
                disabled={payrollLocked}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Processing Day</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.payrollSchedule.processingDay}
              onChange={(e) => updateField('payrollSchedule.processingDay', parseInt(e.target.value))}
              disabled={payrollLocked}
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>{day}th</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Payment Day</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.payrollSchedule.paymentDay}
              onChange={(e) => updateField('payrollSchedule.paymentDay', parseInt(e.target.value))}
              disabled={payrollLocked}
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>{day}th</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.offCycleEnabled}
              onChange={(e) => updateField('offCycleEnabled', e.target.checked)}
              disabled={payrollLocked}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Enable Off-cycle Payroll
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.advanceScheduling.enabled}
              onChange={(e) => updateField('advanceScheduling.enabled', e.target.checked)}
              disabled={payrollLocked}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Enable Advance Payroll Scheduling
          </label>
          {formData.advanceScheduling.enabled && (
            <div className="ml-6">
              <label className="block text-slate-600 text-xs font-medium mb-1">Advance Days</label>
              <input
                type="number"
                className="w-32 px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={formData.advanceScheduling.advanceDays}
                onChange={(e) => updateField('advanceScheduling.advanceDays', parseInt(e.target.value) || 7)}
                disabled={payrollLocked}
                min="1"
                max="30"
              />
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Sales/Commission</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700 col-span-2">
              <input
                type="checkbox"
                checked={formData.salesConfig.commissionEnabled}
                onChange={(e) => updateField('salesConfig.commissionEnabled', e.target.checked)}
                disabled={payrollLocked}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Enable Commission Calculation
            </label>
            {formData.salesConfig.commissionEnabled && (
              <>
                <div>
                  <label className="block text-slate-600 text-xs font-medium mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={formData.salesConfig.commissionRate}
                    onChange={(e) => updateField('salesConfig.commissionRate', parseFloat(e.target.value) || 0)}
                    disabled={payrollLocked}
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-xs font-medium mb-1">Bonus Threshold ($)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={formData.salesConfig.bonusThreshold}
                    onChange={(e) => updateField('salesConfig.bonusThreshold', parseInt(e.target.value) || 0)}
                    disabled={payrollLocked}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Statutory Compliance</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { key: 'taxEnabled', label: 'Tax Calculation' },
              { key: 'epfEnabled', label: 'EPF Contribution' },
              { key: 'esiEnabled', label: 'ESI Contribution' },
              { key: 'tdsEnabled', label: 'TDS Deduction' },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.statutorySettings[item.key]}
                  onChange={(e) => updateField(`statutorySettings.${item.key}`, e.target.checked)}
                  disabled={payrollLocked}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={payrollLocked}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="heroicons:save" className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PayrollConfigModal;