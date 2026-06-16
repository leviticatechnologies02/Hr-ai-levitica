import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const SessionDetailsModal = ({
  selectedSession,
  setSelectedSession
}) => {
  if (!selectedSession) return null;

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const [hour, minute] = timeStr.split(':');
      const h = parseInt(hour, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedHour = h % 12 || 12;
      return `${formattedHour}:${minute} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    try {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      let diffMins = (endH * 60 + endM) - (startH * 60 + startM);
      if (diffMins < 0) diffMins += 24 * 60;
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    } catch {
      return '';
    }
  };

  return (
    <Modal
      isOpen={!!selectedSession}
      onClose={() => setSelectedSession(null)}
      title="Session Details"
      size="xl"
    >
      <div className="space-y-6 p-4">
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          <div>
            <small className="text-xs text-slate-400 block font-medium">Program</small>
            <div className="text-base font-bold text-slate-800">{selectedSession.programName || 'N/A'}</div>
          </div>
          <div>
            <small className="text-xs text-slate-400 block font-medium">Date & Time</small>
            <div className="text-sm font-semibold text-slate-700">
              {selectedSession.sessionDate} | {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}
            </div>
            <small className="text-xs text-slate-400 block font-medium mt-0.5">
              Duration: {calculateDuration(selectedSession.startTime, selectedSession.endTime)}
            </small>
          </div>
          <div>
            <small className="text-xs text-slate-400 block font-medium mb-1">Location</small>
            <div>
              {selectedSession.isVirtual ? (
                <a 
                  href={selectedSession.meetingLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                >
                  <Icon icon="heroicons:video-camera" className="w-4 h-4" />
                  Virtual Meeting
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-750">
                  <Icon icon="heroicons:map-pin" className="w-4 h-4 text-slate-400" />
                  {selectedSession.venue}
                </span>
              )}
            </div>
          </div>
        </div>

        {selectedSession.agenda && (
          <div className="bg-white border border-slate-150 rounded-3xl p-5 shadow-sm">
            <h6 className="font-bold text-slate-800 text-sm mb-2.5">Agenda</h6>
            <p className="text-sm text-slate-650 leading-relaxed">{selectedSession.agenda}</p>
          </div>
        )}

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h6 className="font-bold text-slate-800 text-sm mb-3">Session Information</h6>
          <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-slate-650">
            <div>
              <small className="text-xs text-slate-400 block font-medium">Created</small>
              <div>{selectedSession.createdAt || 'N/A'}</div>
            </div>
            <div>
              <small className="text-xs text-slate-400 block font-medium">Last Updated</small>
              <div>{selectedSession.updatedAt || 'N/A'}</div>
            </div>
          </div>
          <div className="mt-4">
            <small className="text-xs text-slate-400 block font-medium mb-1">Status</small>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                selectedSession.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                selectedSession.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                selectedSession.status === 'rescheduled' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                'bg-blue-550 text-white'
              }`}>
                {selectedSession.status || 'scheduled'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button 
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setSelectedSession(null)}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SessionDetailsModal;
