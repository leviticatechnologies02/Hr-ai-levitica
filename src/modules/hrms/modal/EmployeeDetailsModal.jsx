import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const EmployeeDetailModal = ({ isOpen, onClose, employee, calculationResults, formatCurrency }) => {
  if (!employee) return null;

  const calcResult = calculationResults.find(c => c.employeeId === employee.id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Employee Details: ${employee.name}`} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee ID</label>
            <p className="text-sm font-medium text-slate-800 mt-1">{employee.id}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</label>
            <p className="text-sm text-slate-700 mt-1">{employee.name}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</label>
            <p className="text-sm text-slate-700 mt-1">{employee.department}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base Salary</label>
            <p className="text-sm font-bold text-blue-600 mt-1">{formatCurrency(employee.baseSalary)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employment Type</label>
            <p className="text-sm text-slate-700 mt-1">
              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {employee.employmentType}
              </span>
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
            <p className="text-sm text-slate-700 mt-1">
              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                {employee.status}
              </span>
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
            <p className="text-sm text-slate-700 mt-1">{employee.email || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Join Date</label>
            <p className="text-sm text-slate-700 mt-1">{employee.joinDate || 'N/A'}</p>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bank Account</label>
            <p className="text-sm text-slate-700 mt-1">{employee.bankAccount || 'N/A'}</p>
          </div>
        </div>

        {calcResult && (
          <div className="border-t border-slate-200 pt-4">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Latest Payroll Calculation</h6>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(calcResult.netSalary)}</p>
                <p className="text-xs text-slate-500">Net Salary</p>
              </div>
              <div className="bg-rose-50 rounded-xl p-3 text-center border border-rose-200">
                <p className="text-2xl font-bold text-rose-600">{formatCurrency(calcResult.tax)}</p>
                <p className="text-xs text-slate-500">Tax Deduction</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-200">
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(calcResult.pf)}</p>
                <p className="text-xs text-slate-500">PF Contribution</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeDetailModal;