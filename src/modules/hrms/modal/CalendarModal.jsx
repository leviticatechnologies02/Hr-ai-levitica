import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const CalendarModal = ({ isOpen, onClose, calendar, teamCalendar, title }) => {
  // Determine which data to show
  const calendarData = calendar || teamCalendar || [];
  const isPayrollCalendar = !!calendar;

  const getStatusBadge = (status) => {
    const config = {
      'scheduled': { label: 'Scheduled', color: 'blue' },
      'completed': { label: 'Completed', color: 'emerald' },
      'processing': { label: 'Processing', color: 'amber' },
      'pending': { label: 'Pending', color: 'amber' },
      'active': { label: 'Active', color: 'emerald' },
      'inactive': { label: 'Inactive', color: 'gray' },
      'meeting': { label: 'Meeting', color: 'blue' },
      'event': { label: 'Event', color: 'emerald' },
      'holiday': { label: 'Holiday', color: 'rose' },
      'leave': { label: 'Leave', color: 'amber' },
    };
    const { label, color } = config[status] || { label: status || 'Unknown', color: 'gray' };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || (isPayrollCalendar ? 'Payroll Calendar' : 'Team Calendar')} size="lg">
      <div className="space-y-4">
        {calendarData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                <tr>
                  {isPayrollCalendar ? (
                    <>
                      <th className="p-3 text-left min-w-[120px]">Month</th>
                      <th className="p-3 text-left min-w-[120px]">Processing Date</th>
                      <th className="p-3 text-left min-w-[120px]">Payment Date</th>
                      <th className="p-3 text-center min-w-[100px]">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3 text-left min-w-[180px]">Event</th>
                      <th className="p-3 text-left min-w-[120px]">Date</th>
                      <th className="p-3 text-left min-w-[100px]">Time</th>
                      <th className="p-3 text-center min-w-[100px]">Type</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calendarData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    {isPayrollCalendar ? (
                      <>
                        <td className="p-3 font-medium text-slate-700">{item.month}</td>
                        <td className="p-3 text-slate-600">{item.processingDate}</td>
                        <td className="p-3 text-slate-600">{item.paymentDate}</td>
                        <td className="p-3 text-center">{getStatusBadge(item.status)}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 font-medium text-slate-700">{item.title}</td>
                        <td className="p-3 text-slate-600">{item.date}</td>
                        <td className="p-3 text-slate-600">{item.time}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${item.type === 'meeting' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                              item.type === 'event' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                item.type === 'holiday' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                  'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                            {item.type}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Icon icon="heroicons:calendar" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium text-slate-600">No calendar entries found</p>
            <p className="text-xs">Calendar events will appear here</p>
          </div>
        )}

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