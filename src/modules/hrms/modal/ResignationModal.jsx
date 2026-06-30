import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ResignationModal = ({ isOpen, onClose, onSubmit, employeeData = null }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: 'Engineering',
    role: '',
    resignationDate: new Date().toISOString().split('T')[0],
    noticePeriod: '60',
    resignationReason: 'Better opportunity',
    comments: ''
  });

  useEffect(() => {
    if (employeeData) {
      setFormData(prev => ({ ...prev, ...employeeData }));
    } else {
      setFormData({
        employeeName: '',
        employeeId: '',
        department: 'Engineering',
        role: '',
        resignationDate: new Date().toISOString().split('T')[0],
        noticePeriod: '60',
        resignationReason: 'Better opportunity',
        comments: ''
      });
    }
  }, [employeeData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const reasons = [
    'Better opportunity', 'Career growth', 'Higher studies', 'Relocation',
    'Personal reasons', 'Health issues', 'Work-life balance', 'Compensation'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Initiate Resignation" size="md">
      <form onSubmit={handleSubmit} className="space-y-5 p-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee Name *</label>
            <input type="text" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" value={formData.employeeName} onChange={e => setFormData({...formData, employeeName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID *</label>
            <input type="text" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Resignation Date *</label>
            <input type="date" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" value={formData.resignationDate} onChange={e => setFormData({...formData, resignationDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notice Period (Days) *</label>
            <input type="number" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" value={formData.noticePeriod} onChange={e => setFormData({...formData, noticePeriod: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reason *</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" value={formData.resignationReason} onChange={e => setFormData({...formData, resignationReason: e.target.value})}>
            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Additional Comments</label>
          <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" rows="3" value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})}></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            <Icon icon="heroicons:paper-airplane" className="w-4 h-4" /> Submit Resignation
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ResignationModal;
