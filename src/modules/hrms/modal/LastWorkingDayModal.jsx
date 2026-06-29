import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const LastWorkingDayModal = ({ isOpen, onClose, onConfirm, lastWorkingDay }) => {
  const [formData, setFormData] = useState({
    actualLastWorkingDay: '',
    noticeServedFrom: '',
    noticeServedTo: ''
  });

  useEffect(() => {
    if (isOpen && lastWorkingDay) {
      setFormData({
        actualLastWorkingDay: lastWorkingDay.actualLastWorkingDay || new Date().toISOString().split('T')[0],
        noticeServedFrom: lastWorkingDay.noticeServedFrom || '',
        noticeServedTo: lastWorkingDay.noticeServedTo || ''
      });
    }
  }, [isOpen, lastWorkingDay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.actualLastWorkingDay) {
      alert('Please select the last working day');
      return;
    }
    onConfirm(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Last Working Day" size="md">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Actual Last Working Day <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            name="actualLastWorkingDay"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            value={formData.actualLastWorkingDay}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notice Served From</label>
            <input
              type="date"
              name="noticeServedFrom"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.noticeServedFrom}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notice Served To</label>
            <input
              type="date"
              name="noticeServedTo"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              value={formData.noticeServedTo}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
          <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Confirming the last working day will lock the settlement calculation dates.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Confirm Last Working Day
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LastWorkingDayModal;