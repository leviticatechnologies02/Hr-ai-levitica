import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ChangeStructureModal = ({ isOpen, onClose, onSubmit, employee, structures, calculateBreakdown }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    department: '',
    location: '',
    employeeType: 'regular',
    currentStructure: '',
    grade: '',
    level: '',
    ctc: '',
    takeHome: '',
    grossSalary: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    assignmentType: 'revision',
    assignmentStatus: 'active',
    approvalStatus: 'approved',
    changeReason: '',
    comments: '',
    noticePeriod: 30,
    newStructureId: '',
    newEffectiveDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isOpen && employee) {
      setFormData({
        employeeId: employee.employeeId || '',
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        location: employee.location || '',
        employeeType: employee.employeeType || 'regular',
        currentStructure: employee.currentStructure || '',
        grade: employee.grade || '',
        level: employee.level || '',
        ctc: employee.ctc || '',
        takeHome: employee.takeHome || '',
        grossSalary: employee.grossSalary || '',
        effectiveDate: employee.effectiveDate || new Date().toISOString().split('T')[0],
        assignmentType: employee.assignmentType || 'revision',
        assignmentStatus: employee.assignmentStatus || 'active',
        approvalStatus: employee.approvalStatus || 'approved',
        changeReason: employee.changeReason || '',
        comments: employee.comments || '',
        noticePeriod: employee.noticePeriod || 30,
        newStructureId: '',
        newEffectiveDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [isOpen, employee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.name || !formData.ctc) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit({ ...formData, id: employee?.id });
  };

  const selectedStructure = structures.find(s => s.id.toString() === formData.newStructureId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Salary Structure" size="xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Employee ID <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
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
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Department</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Location</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
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
            <label className="block text-slate-700 font-semibold mb-1">Current Structure</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.currentStructure}
              onChange={(e) => setFormData({ ...formData, currentStructure: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Current Grade</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Current CTC (₹) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.ctc}
              onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Effective Date</label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.effectiveDate}
              onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h6 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Assign New Structure (Optional)</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select New Structure</label>
              <select
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={formData.newStructureId}
                onChange={(e) => {
                  const selected = structures.find(s => s.id.toString() === e.target.value);
                  setFormData({
                    ...formData,
                    newStructureId: e.target.value,
                    newCTC: selected?.ctc || ''
                  });
                }}
              >
                <option value="">Choose a new structure...</option>
                {structures.filter(s => s.status === 'active').map((structure) => (
                  <option key={structure.id} value={structure.id}>
                    {structure.name} (Grade {structure.grade})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">New Effective Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={formData.newEffectiveDate}
                onChange={(e) => setFormData({ ...formData, newEffectiveDate: e.target.value })}
              />
            </div>
          </div>

          {selectedStructure && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-700 mb-2">Structure Comparison Preview</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Component</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Current</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">New</span>
                </div>
                <div>
                  <span className="text-slate-600">CTC</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(formData.ctc)}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(selectedStructure.ctc)}</span>
                </div>
                <div>
                  <span className="text-slate-600">Grade</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{formData.grade}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">{selectedStructure.grade}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Change Reason</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.changeReason}
              onChange={(e) => setFormData({ ...formData, changeReason: e.target.value })}
              placeholder="e.g., Promotion, Revision, Transfer"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Assignment Status</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.assignmentStatus}
              onChange={(e) => setFormData({ ...formData, assignmentStatus: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Approval Status</label>
            <select
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.approvalStatus}
              onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value })}
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Notice Period (days)</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.noticePeriod}
              onChange={(e) => setFormData({ ...formData, noticePeriod: parseInt(e.target.value) || 30 })}
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Comments</label>
          <textarea
            rows="2"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            placeholder="Additional comments..."
          />
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
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Icon icon="heroicons:save" className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangeStructureModal;