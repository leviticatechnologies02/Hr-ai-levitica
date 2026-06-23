import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const EditRelationshipModal = ({ isOpen, onClose, onSubmit, relationship }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    managerId: '',
    managerName: '',
    relationshipType: 'direct',
    effectiveDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isOpen && relationship) {
      setFormData({
        employeeId: relationship.employeeId || '',
        employeeName: relationship.employeeName || '',
        managerId: relationship.managerId || '',
        managerName: relationship.managerName || '',
        relationshipType: relationship.type || 'direct',
        effectiveDate: relationship.effectiveDate || new Date().toISOString().split('T')[0],
        notes: relationship.notes || ''
      });
    }
  }, [isOpen, relationship]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.managerId) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Reporting Relationship" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Employee <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.employeeName}
              onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
              placeholder="Employee name"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Employee ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.employeeId}
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
              placeholder="EMP001"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Manager <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.managerName}
              onChange={(e) => setFormData({...formData, managerName: e.target.value})}
              placeholder="Manager name"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Manager ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.managerId}
              onChange={(e) => setFormData({...formData, managerId: e.target.value})}
              placeholder="MGR001"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Relationship Type
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.relationshipType}
              onChange={(e) => setFormData({...formData, relationshipType: e.target.value})}
            >
              <option value="direct">Direct Report</option>
              <option value="dotted-line">Dotted-Line</option>
              <option value="matrix">Matrix</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Effective Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.effectiveDate}
              onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">
              Notes
            </label>
            <textarea
              rows="2"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes about this relationship..."
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
            <Icon icon="heroicons:check" className="w-4 h-4" />
            Update Relationship
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditRelationshipModal;