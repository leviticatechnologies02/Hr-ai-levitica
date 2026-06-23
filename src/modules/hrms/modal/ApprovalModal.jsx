import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ApprovalModal = ({ isOpen, onClose, onSubmit, document }) => {
  const [formData, setFormData] = useState({
    action: 'approve',
    comments: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ action: 'approve', comments: '' });
    }
  }, [isOpen]);

  if (!document) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.action === 'reject' && !formData.comments) {
      alert('Please provide rejection comments');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve/Reject Document" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <p><span className="font-semibold text-slate-700">Document:</span> {document.name}</p>
          <p><span className="font-semibold text-slate-700">Employee:</span> {document.employee?.name}</p>
          <p><span className="font-semibold text-slate-700">Category:</span> {document.category}</p>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-2">Action</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                formData.action === 'approve'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              onClick={() => setFormData({ ...formData, action: 'approve' })}
            >
              <Icon icon="heroicons:check-circle" className="w-4 h-4" />
              Approve
            </button>
            <button
              type="button"
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                formData.action === 'reject'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              onClick={() => setFormData({ ...formData, action: 'reject' })}
            >
              <Icon icon="heroicons:x-circle" className="w-4 h-4" />
              Reject
            </button>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Comments {formData.action === 'reject' && <span className="text-rose-500">*</span>}
          </label>
          <textarea
            rows="3"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            placeholder={formData.action === 'approve' ? 'Add approval comments (optional)' : 'Please provide rejection reason'}
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
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              formData.action === 'approve'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            <Icon icon={formData.action === 'approve' ? 'heroicons:check' : 'heroicons:x-mark'} className="w-4 h-4" />
            {formData.action === 'approve' ? 'Approve' : 'Reject'} Document
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ApprovalModal;