import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const RequestModal = ({ isOpen, onClose, onSubmit, newRequest, setNewRequest }) => {
  const [formData, setFormData] = useState(newRequest);

  useEffect(() => {
    if (isOpen) {
      setFormData(newRequest);
    }
  }, [isOpen, newRequest]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit New Request" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Request Type <span className="text-rose-500">*</span></label>
          <select
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            <option value="leave">Leave Request</option>
            <option value="attendance">Attendance Regularization</option>
            <option value="reimbursement">Expense Reimbursement</option>
            <option value="loan">Advance/Loan</option>
          </select>
        </div>

        {formData.type === 'leave' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Start Date <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">End Date <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Reason <span className="text-rose-500">*</span></label>
              <textarea
                rows="3"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Enter reason for leave..."
                required
              />
            </div>
          </>
        )}

        {formData.type === 'reimbursement' && (
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Amount ($) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Enter amount"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Attachment (Optional)</label>
          <input
            type="file"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
            <Icon icon="heroicons:paper-airplane" className="w-4 h-4" />
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestModal;