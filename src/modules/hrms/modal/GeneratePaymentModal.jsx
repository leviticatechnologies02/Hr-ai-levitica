import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const GeneratePaymentModal = ({ isOpen, onClose, onSubmit, banks, paymentTypes, employees, formatCurrency }) => {
  const [formData, setFormData] = useState({
    bankId: '',
    paymentType: 'NEFT',
    employeeIds: [],
    encryptionEnabled: true,
    splitByBank: true
  });

  const [selectedEmployees, setSelectedEmployees] = useState(new Set());

  useEffect(() => {
    if (isOpen) {
      setFormData({
        bankId: '',
        paymentType: 'NEFT',
        employeeIds: [],
        encryptionEnabled: true,
        splitByBank: true
      });
      setSelectedEmployees(new Set());
    }
  }, [isOpen]);

  const handleEmployeeToggle = (employeeId) => {
    const newSelection = new Set(selectedEmployees);
    if (newSelection.has(employeeId)) {
      newSelection.delete(employeeId);
    } else {
      newSelection.add(employeeId);
    }
    setSelectedEmployees(newSelection);
    setFormData({ ...formData, employeeIds: Array.from(newSelection) });
  };

  const handleSelectAll = () => {
    if (selectedEmployees.size === employees.length) {
      setSelectedEmployees(new Set());
      setFormData({ ...formData, employeeIds: [] });
    } else {
      const allIds = employees.map(e => e.id);
      setSelectedEmployees(new Set(allIds));
      setFormData({ ...formData, employeeIds: allIds });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bankId || selectedEmployees.size === 0) {
      alert('Please select a bank and at least one employee');
      return;
    }
    const bank = banks.find(b => b.id === parseInt(formData.bankId));
    const selectedEmployeesData = employees.filter(e => selectedEmployees.has(e.id));
    onSubmit({
      bank,
      paymentType: formData.paymentType,
      employees: selectedEmployeesData,
      encryptionEnabled: formData.encryptionEnabled,
      splitByBank: formData.splitByBank
    });
  };

  const selectedBank = banks.find(b => b.id === parseInt(formData.bankId));
  const totalAmount = employees
    .filter(e => selectedEmployees.has(e.id))
    .reduce((sum, e) => sum + parseFloat(e.salary?.replace(/[^0-9.]/g, '') || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Payment File" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Bank</label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            value={formData.bankId}
            onChange={(e) => setFormData({ ...formData, bankId: e.target.value })}
          >
            <option value="">Choose a bank...</option>
            {banks.map(bank => (
              <option key={bank.id} value={bank.id}>
                {bank.name} ({bank.code}) – Supports: {bank.supportedTypes.join(', ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payment Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {paymentTypes.map(type => (
              <div
                key={type.id}
                className={`border rounded-xl p-3 cursor-pointer transition-all ${
                  formData.paymentType === type.id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
                onClick={() => setFormData({ ...formData, paymentType: type.id })}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    formData.paymentType === type.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon icon="heroicons:credit-card" className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{type.name}</div>
                    <div className="text-xs text-slate-500">{type.description}</div>
                    {type.cutoffTime && (
                      <div className="text-xs text-amber-600">Cut-off: {type.cutoffTime}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">
              Select Employees ({selectedEmployees.size} selected)
            </label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              onClick={handleSelectAll}
            >
              {selectedEmployees.size === employees.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="border border-slate-200 rounded-xl max-h-60 overflow-y-auto">
            {employees.map(emp => (
              <div
                key={emp.id}
                className="flex items-center gap-3 p-2 border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selectedEmployees.has(emp.id)}
                  onChange={() => handleEmployeeToggle(emp.id)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-800 text-sm">{emp.name}</div>
                  <div className="text-xs text-slate-500">{emp.code}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-800 text-sm">{emp.salary}</div>
                  <div className="text-xs text-slate-500">{emp.bankName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Advanced Settings</label>
          <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.encryptionEnabled}
                onChange={(e) => setFormData({ ...formData, encryptionEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Enable File Encryption</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.splitByBank}
                onChange={(e) => setFormData({ ...formData, splitByBank: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Split Payment File by Bank</span>
            </label>
          </div>
        </div>

        {selectedBank && selectedEmployees.size > 0 && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <h6 className="font-semibold text-sm text-slate-700 mb-2">File Preview</h6>
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {`FILE TYPE: ${formData.paymentType}
BANK: ${selectedBank.name}
EMPLOYEES: ${selectedEmployees.size}
TOTAL AMOUNT: ${formatCurrency(totalAmount)}
ENCRYPTION: ${formData.encryptionEnabled ? 'ENABLED (AES-256)' : 'DISABLED'}
SPLIT BY BANK: ${formData.splitByBank ? 'YES' : 'NO'}
DATE: ${new Date().toLocaleDateString()}
REFERENCE: REF${Date.now()}${selectedBank.code}`}
            </pre>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formData.bankId || selectedEmployees.size === 0}
          >
            <Icon icon="heroicons:document-plus" className="w-4 h-4" />
            Generate File
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GeneratePaymentModal;