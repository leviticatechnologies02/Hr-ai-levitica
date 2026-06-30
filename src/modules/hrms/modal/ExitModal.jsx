import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ExitModal = ({ isOpen, onClose, onSubmit, caseData = null }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    role: '',
    resignationDate: '',
    lastWorkingDay: '',
    noticePeriod: '45 days',
    exitType: 'Resignation',
    exitReason: ''
  });

  useEffect(() => {
    if (caseData) {
      setFormData({
        employeeName: caseData.employeeName || '',
        employeeId: caseData.employeeId || '',
        department: caseData.department || '',
        role: caseData.role || '',
        resignationDate: caseData.resignationDate || '',
        lastWorkingDay: caseData.lastWorkingDay || '',
        noticePeriod: caseData.noticePeriod || '45 days',
        exitType: caseData.exitType || 'Resignation',
        exitReason: caseData.exitReason || ''
      });
    } else {
      setFormData({
        employeeName: '',
        employeeId: '',
        department: '',
        role: '',
        resignationDate: '',
        lastWorkingDay: '',
        noticePeriod: '45 days',
        exitType: 'Resignation',
        exitReason: ''
      });
    }
  }, [caseData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: caseData?.id });
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Design', 'Product', 'Support'];
  const exitTypes = ['Resignation', 'Termination', 'Retirement', 'Absconding', 'Contract Expiry'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={caseData ? "Edit Exit Case" : "Initiate Exit Process"} size="md">
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
            <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role/Designation *</label>
            <input type="text" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Exit Type *</label>
            <select required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" value={formData.exitType} onChange={e => setFormData({...formData, exitType: e.target.value})}>
              {exitTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notice Period *</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" value={formData.noticePeriod} onChange={e => setFormData({...formData, noticePeriod: e.target.value})}>
              <option value="Immediate">Immediate</option>
              <option value="15 days">15 days</option>
              <option value="30 days">30 days</option>
              <option value="45 days">45 days</option>
              <option value="60 days">60 days</option>
              <option value="90 days">90 days</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Resignation/Notice Date *</label>
            <input type="date" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" value={formData.resignationDate} onChange={e => setFormData({...formData, resignationDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Expected Last Working Day *</label>
            <input type="date" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" value={formData.lastWorkingDay} onChange={e => setFormData({...formData, lastWorkingDay: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Primary Exit Reason *</label>
          <textarea required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" rows="3" value={formData.exitReason} onChange={e => setFormData({...formData, exitReason: e.target.value})} placeholder="E.g., Better opportunity, Relocation, Performance issues"></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            <Icon icon="heroicons:paper-airplane" className="w-4 h-4" /> {caseData ? 'Update Exit Case' : 'Initiate Exit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExitModal;