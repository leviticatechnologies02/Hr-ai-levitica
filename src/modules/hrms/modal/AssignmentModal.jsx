import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const AssignmentModal = ({ isOpen, onClose, onSubmit, structures }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    department: '',
    structureId: '',
    ctc: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    assignmentType: 'initial',
    location: '',
    employeeType: 'regular',
    noticePeriod: 30,
    allocationRules: {
      type: 'auto',
      basis: 'grade_match',
      proRata: true,
      hasCustomRules: false,
      rules: []
    }
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        department: '',
        structureId: '',
        ctc: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        assignmentType: 'initial',
        location: '',
        employeeType: 'regular',
        noticePeriod: 30,
        allocationRules: {
          type: 'auto',
          basis: 'grade_match',
          proRata: true,
          hasCustomRules: false,
          rules: []
        }
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.name || !formData.structureId || !formData.ctc) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'HR', 'IT'];
  const locations = ['Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Chennai', 'Remote', 'International'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Structure to Employee" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Employee ID <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              placeholder="EMP001"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Employee Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john.doe@company.com"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Department <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Location</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Employee Type</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.employeeType}
              onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}
            >
              <option value="regular">Regular</option>
              <option value="contractor">Contractor</option>
              <option value="intern">Intern</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select Structure <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.structureId}
              onChange={(e) => {
                const selectedStructure = structures.find(s => s.id.toString() === e.target.value);
                setFormData({
                  ...formData,
                  structureId: e.target.value,
                  ctc: selectedStructure?.ctc || ''
                });
              }}
              required
            >
              <option value="">Select Structure</option>
              {structures.filter(s => s.status === 'active').map((structure) => (
                <option key={structure.id} value={structure.id}>
                  {structure.name} (Grade {structure.grade}) - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(structure.ctc)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">CTC (Annual) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.ctc}
              onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
              placeholder="1500000"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Effective Date <span className="text-rose-500">*</span></label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.effectiveDate}
              onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Assignment Type</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.assignmentType}
              onChange={(e) => setFormData({ ...formData, assignmentType: e.target.value })}
            >
              <option value="initial">Initial Assignment</option>
              <option value="revision">Salary Revision</option>
              <option value="promotion">Promotion</option>
              <option value="transfer">Transfer</option>
              <option value="correction">Data Correction</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Allocation Rules</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Allocation Type</label>
              <select
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={formData.allocationRules.type}
                onChange={(e) => setFormData({
                  ...formData,
                  allocationRules: { ...formData.allocationRules, type: e.target.value }
                })}
              >
                <option value="auto">Auto Assignment</option>
                <option value="manual">Manual Assignment</option>
                <option value="bulk">Bulk Assignment</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Allocation Basis</label>
              <select
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={formData.allocationRules.basis}
                onChange={(e) => setFormData({
                  ...formData,
                  allocationRules: { ...formData.allocationRules, basis: e.target.value }
                })}
              >
                <option value="grade_match">Grade Match</option>
                <option value="department_basis">Department Basis</option>
                <option value="location_basis">Location Basis</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.allocationRules.proRata}
                onChange={(e) => setFormData({
                  ...formData,
                  allocationRules: { ...formData.allocationRules, proRata: e.target.checked }
                })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Pro-rata Calculation
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.allocationRules.hasCustomRules}
                onChange={(e) => setFormData({
                  ...formData,
                  allocationRules: { ...formData.allocationRules, hasCustomRules: e.target.checked }
                })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Apply Custom Rules
            </label>
          </div>
          {formData.allocationRules.hasCustomRules && (
            <div className="mt-3">
              <label className="block text-slate-700 font-semibold mb-1">Custom Rules</label>
              <textarea
                rows="3"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                value={formData.allocationRules.rules.join('\n')}
                onChange={(e) => setFormData({
                  ...formData,
                  allocationRules: { ...formData.allocationRules, rules: e.target.value.split('\n').filter(r => r.trim()) }
                })}
                placeholder="Enter custom rules (one per line)"
              />
            </div>
          )}
          <div className="mt-3">
            <label className="block text-slate-700 font-semibold mb-1">Notice Period (days)</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.noticePeriod}
              onChange={(e) => setFormData({ ...formData, noticePeriod: parseInt(e.target.value) || 30 })}
            />
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
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Icon icon="heroicons:user-plus" className="w-4 h-4" />
            Assign Structure
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentModal;