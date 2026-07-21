import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const LetterModal = ({ isOpen, onClose, onGenerate, employee = null, formatDate, letterType = 'Confirmation Letter', generating = false }) => {
  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Generate ${letterType} - ${employee?.name}`} size="lg">
      <div className="space-y-4 p-2">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-sm text-emerald-700">
            Generating <strong>{letterType}</strong> for <strong>{employee?.name}</strong> ({employee?.employeeId})
          </p>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h6 className="font-bold text-sm text-slate-700">Letter Details</h6>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmation Date</label>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {formatDate(employee.confirmationDate || new Date().toISOString().split('T')[0])}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Effective Date</label>
                <p className="text-sm font-medium text-slate-800 mt-1">
                  {formatDate(employee.confirmationEffectiveDate || new Date().toISOString().split('T')[0])}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee Name</label>
                <p className="text-sm font-medium text-slate-800 mt-1">{employee.name}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee ID</label>
                <p className="text-sm font-medium text-slate-800 mt-1">{employee.employeeId}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Designation</label>
                <p className="text-sm font-medium text-slate-800 mt-1">{employee.designation}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</label>
                <p className="text-sm font-medium text-slate-800 mt-1">{employee.department}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h6 className="font-bold text-sm text-slate-700">Letter Options</h6>
          </div>
          <div className="p-4 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-slate-700">Include salary details</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-slate-700">Include terms and conditions</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-slate-700">Send letter via email to employee</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-slate-700">CC Manager ({employee.manager})</span>
            </label>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h6 className="font-semibold text-sm text-blue-700 mb-2">Letter Preview</h6>
          <p className="text-sm text-blue-600">The {letterType.toLowerCase()} will be generated in PDF format and include:</p>
          <ul className="text-sm text-blue-600 mt-2 space-y-1">
            <li>• Official {letterType.toLowerCase()} content</li>
            <li>• Employee details and generation date</li>
            <li>• Designation, department, and work location</li>
            <li>• Selected dynamic fields (if selected)</li>
            <li>• Standard terms and conditions</li>
            <li>• Company letterhead and authorized signatures</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-60"
            onClick={onGenerate}
            disabled={generating}
          >
            <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
            {generating ? 'Generating…' : 'Generate & Download'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LetterModal;