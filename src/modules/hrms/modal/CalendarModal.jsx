import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const CalendarModal = ({ isOpen, onClose, teamCalendar }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Team Calendar" size="lg">
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold text-slate-600">Event</th>
                <th className="p-3 font-semibold text-slate-600">Date</th>
                <th className="p-3 font-semibold text-slate-600">Time</th>
                <th className="p-3 font-semibold text-slate-600">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamCalendar.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-700">{event.title}</td>
                  <td className="p-3 text-slate-500">{event.date}</td>
                  <td className="p-3 text-slate-500">{event.time}</td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      event.type === 'meeting' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {event.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CalendarModal;