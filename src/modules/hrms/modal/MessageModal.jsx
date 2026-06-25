import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const MessageModal = ({ isOpen, onClose, onSubmit, newMessage, setNewMessage }) => {
  const [formData, setFormData] = useState(newMessage);

  useEffect(() => {
    if (isOpen) {
      setFormData(newMessage);
    }
  }, [isOpen, newMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const recipients = [
    { value: 'hr@company.com', label: 'HR Department' },
    { value: 'manager@company.com', label: 'My Manager' },
    { value: 'it@company.com', label: 'IT Support' },
    { value: 'finance@company.com', label: 'Finance Department' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Message" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="block text-slate-700 font-semibold mb-1">To <span className="text-rose-500">*</span></label>
          <select
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            required
          >
            <option value="">Select recipient</option>
            {recipients.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Subject <span className="text-rose-500">*</span></label>
          <input
            type="text"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Enter subject"
            required
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">Message <span className="text-rose-500">*</span></label>
          <textarea
            rows="5"
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Type your message here..."
            required
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
            Send Message
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MessageModal;