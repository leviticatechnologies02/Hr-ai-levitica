import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const WaiverModal = ({ isOpen, onClose, onSubmit, caseData = null }) => {
  const [formData, setFormData] = useState({
    waiverDays: 15,
    reason: '',
    details: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, caseId: caseData?.id });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Notice Period Waiver" size="md">
      <form onSubmit={handleSubmit} className="space-y-5 p-2">
        {caseData && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
            <h6 className="font-semibold text-slate-800 text-sm">{caseData.employeeName}</h6>
            <div className="text-xs text-slate-500">{caseData.role} • {caseData.department}</div>
            <div className="mt-2 flex gap-4 text-xs font-medium">
              <span className="text-slate-600">Total Notice: {caseData.noticePeriodDays || 60} days</span>
              <span className="text-amber-600">Remaining: {caseData.daysRemaining || 0} days</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Days to Waive *</label>
          <input type="number" required min="1" max={caseData?.daysRemaining || 90} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" value={formData.waiverDays} onChange={e => setFormData({...formData, waiverDays: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reason Category *</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}>
            <option value="">Select Reason...</option>
            <option value="Medical Emergency">Medical Emergency</option>
            <option value="Higher Education">Higher Education</option>
            <option value="Mutual Agreement">Mutual Agreement</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Justification *</label>
          <textarea required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" rows="3" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} placeholder="Provide context for the waiver request..."></textarea>
        </div>

        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-700 flex gap-2">
          <Icon icon="heroicons:information-circle" className="w-5 h-5 flex-shrink-0" />
          <p>Waivers require HR Head and Department Director approval. Employees will not be compensated for waived notice days.</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            <Icon icon="heroicons:paper-airplane" className="w-4 h-4" /> Request Waiver
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WaiverModal;
