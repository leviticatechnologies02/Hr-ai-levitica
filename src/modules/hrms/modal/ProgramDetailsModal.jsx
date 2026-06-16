import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ProgramDetailsModal = ({
  showProgramDetailsModal,
  setSelectedProgram,
  selectedProgram,
  sessionAgendaForm,
  setSessionAgendaForm,
  setShowSessionAgendaModal
}) => {
  if (!selectedProgram || !showProgramDetailsModal) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
      case 'ongoing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
            Ongoing
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Completed
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
            {status}
          </span>
        );
    }
  };

  return (
    <Modal
      isOpen={showProgramDetailsModal}
      onClose={() => setSelectedProgram(null)}
      title={selectedProgram.name}
      size="xl"
    >
      <div className="space-y-6 p-4">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Program Details */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
            <h6 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-600" />
              Program Details
            </h6>
            <div className="space-y-3">
              <div>
                <small className="text-xs text-slate-400 block font-medium">Description</small>
                <span className="text-sm text-slate-700">{selectedProgram.description}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Type</small>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    selectedProgram.type === 'batch' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                    selectedProgram.type === 'individual' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {selectedProgram.type}
                  </span>
                </div>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Status</small>
                <div>{getStatusBadge(selectedProgram.status)}</div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
            <h6 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon icon="heroicons:calendar" className="w-5 h-5 text-purple-600" />
              Schedule
            </h6>
            <div className="space-y-3">
              <div>
                <small className="text-xs text-slate-400 block font-medium">Duration</small>
                <span className="font-semibold text-slate-800">{selectedProgram.duration}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Start Date</small>
                <span className="font-semibold text-slate-800">{selectedProgram.startDate}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">End Date</small>
                <span className="font-semibold text-slate-800">{selectedProgram.endDate}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Location</small>
                <span className="font-semibold text-slate-800">{selectedProgram.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Participants */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
            <h6 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon icon="heroicons:users" className="w-5 h-5 text-emerald-600" />
              Participants
            </h6>
            <div className="space-y-3">
              <div>
                <small className="text-xs text-slate-400 block font-medium">Total Participants</small>
                <span className="font-semibold text-slate-800">{selectedProgram.totalParticipants}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Confirmed</small>
                <span className="font-semibold text-slate-800">{selectedProgram.confirmedParticipants}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Attendance Rate</small>
                <span className="font-semibold text-slate-800">{selectedProgram.attendanceRate}%</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
            <h6 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon icon="heroicons:chart-bar" className="w-5 h-5 text-amber-600" />
              Progress
            </h6>
            <div className="space-y-3">
              <div>
                <small className="text-xs text-slate-400 block font-medium">Sessions</small>
                <span className="font-semibold text-slate-800">{selectedProgram.completedSessions}/{selectedProgram.totalSessions} completed</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Rating</small>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-bold text-slate-800">{selectedProgram.overallRating}/5</span>
                  <div className="text-amber-400 flex">
                    {'★'.repeat(Math.floor(selectedProgram.overallRating))}
                    {'☆'.repeat(5 - Math.floor(selectedProgram.overallRating))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Sessions Table */}
        {selectedProgram.schedule && selectedProgram.schedule.length > 0 && (
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
            <h6 className="text-sm font-bold text-slate-800 mb-3">Upcoming Sessions</h6>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Session</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Trainer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {selectedProgram.schedule.slice(0, 3).map(session => (
                    <tr key={session.id} className="text-slate-700">
                      <td className="py-2.5 font-medium">{session.title}</td>
                      <td className="py-2.5">{session.date}</td>
                      <td className="py-2.5">{session.startTime} - {session.endTime}</td>
                      <td className="py-2.5">{session.trainer || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setSelectedProgram(null)}
          >
            Close
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all"
            onClick={() => {
              setSelectedProgram(null);
              setSessionAgendaForm({...sessionAgendaForm, programId: selectedProgram.id});
              setShowSessionAgendaModal(true);
            }}
          >
            Add Session
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProgramDetailsModal;
