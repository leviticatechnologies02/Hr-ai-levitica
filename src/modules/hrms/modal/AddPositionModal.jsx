import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const AddPositionModal = ({ isOpen, onClose, onSubmit, departments }) => {
  const [formData, setFormData] = useState({
    position: '',
    department: '',
    location: '',
    managerId: '',
    title: '',
    reportsTo: '',
    positionType: 'direct',
    level: 'manager',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        position: '',
        department: '',
        location: '',
        managerId: '',
        title: '',
        reportsTo: '',
        positionType: 'direct',
        level: 'manager',
        description: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.position || !formData.department) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Position" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Position Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Location
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., San Francisco"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Level
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
            >
              <option value="entry">Entry Level</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
              <option value="manager">Manager</option>
              <option value="director">Director</option>
              <option value="vp">VP</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Position Type
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.positionType}
              onChange={(e) => setFormData({...formData, positionType: e.target.value})}
            >
              <option value="direct">Direct Report</option>
              <option value="dotted-line">Dotted-Line</option>
              <option value="matrix">Matrix</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Reports To
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={formData.reportsTo}
              onChange={(e) => setFormData({...formData, reportsTo: e.target.value})}
              placeholder="Manager name or ID"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">
              Job Description
            </label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter job description..."
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
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Icon icon="heroicons:plus" className="w-4 h-4" />
            Add Position
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPositionModal;