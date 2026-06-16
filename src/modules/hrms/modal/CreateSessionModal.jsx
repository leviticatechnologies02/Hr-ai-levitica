import React from 'react';
import Modal from '../../../shared/components/Modal';

const CreateSessionModal = ({
  showSessionAgendaModal,
  setShowSessionAgendaModal,
  sessionAgendaForm,
  setSessionAgendaForm,
  inductionPrograms,
  handleCreateSession
}) => {
  return (
    <Modal
      isOpen={showSessionAgendaModal}
      onClose={() => setShowSessionAgendaModal(false)}
      title="Create Session Agenda"
      size="xl"
    >
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Program <span className="text-rose-500">*</span></label>
            <select 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={sessionAgendaForm.programId || ''}
              onChange={(e) => setSessionAgendaForm({
                ...sessionAgendaForm, 
                programId: parseInt(e.target.value)
              })}
            >
              <option value="">Choose program...</option>
              {inductionPrograms.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Session Title <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={sessionAgendaForm.sessionTitle}
              onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, sessionTitle: e.target.value})}
              placeholder="e.g., Company Culture & Values"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Session Date <span className="text-rose-500">*</span></label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={sessionAgendaForm.sessionDate}
              onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, sessionDate: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Start Time <span className="text-rose-500">*</span></label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={sessionAgendaForm.startTime}
              onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, startTime: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">End Time <span className="text-rose-500">*</span></label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={sessionAgendaForm.endTime}
              onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, endTime: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Agenda/Description</label>
          <textarea
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            rows="4"
            value={sessionAgendaForm.agenda}
            onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, agenda: e.target.value})}
            placeholder="Detailed agenda for this session"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {sessionAgendaForm.isVirtual ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Meeting Link <span className="text-rose-500">*</span></label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  value={sessionAgendaForm.meetingLink}
                  onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, meetingLink: e.target.value})}
                  placeholder="https://zoom.us/j/..."
                  required={sessionAgendaForm.isVirtual}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Venue <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  value={sessionAgendaForm.venue}
                  onChange={(e) => setSessionAgendaForm({...sessionAgendaForm, venue: e.target.value})}
                  placeholder="e.g., Conference Room A"
                  required={!sessionAgendaForm.isVirtual}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center pt-6">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sessionAgendaForm.isVirtual}
                onChange={(e) =>
                  setSessionAgendaForm({
                    ...sessionAgendaForm,
                    isVirtual: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Virtual Session</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowSessionAgendaModal(false)}
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            onClick={handleCreateSession}
            disabled={!sessionAgendaForm.programId || !sessionAgendaForm.sessionTitle}
          >
            Create Session
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateSessionModal;
