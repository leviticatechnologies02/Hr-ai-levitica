import React from 'react';
import Modal from '../../../shared/components/Modal';

const EditSessionModal = ({
  showEditSessionModal,
  setShowEditSessionModal,
  editingSession,
  setEditingSession,
  inductionPrograms,
  handleEditSession
}) => {
  if (!editingSession) return null;

  return (
    <Modal
      isOpen={showEditSessionModal}
      onClose={() => setShowEditSessionModal(false)}
      title="Edit Session"
      size="xl"
    >
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Program <span className="text-rose-500">*</span></label>
            <select 
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={editingSession.programId || ''}
              onChange={(e) => setEditingSession({
                ...editingSession, 
                programId: parseInt(e.target.value)
              })}
              required
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
              value={editingSession.sessionTitle || ''}
              onChange={(e) => setEditingSession({...editingSession, sessionTitle: e.target.value})}
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
              value={editingSession.sessionDate || ''}
              onChange={(e) => setEditingSession({...editingSession, sessionDate: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Start Time <span className="text-rose-500">*</span></label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={editingSession.startTime || ''}
              onChange={(e) => setEditingSession({...editingSession, startTime: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">End Time <span className="text-rose-500">*</span></label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={editingSession.endTime || ''}
              onChange={(e) => setEditingSession({...editingSession, endTime: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Agenda/Description</label>
          <textarea
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            rows="4"
            value={editingSession.agenda || ''}
            onChange={(e) => setEditingSession({...editingSession, agenda: e.target.value})}
            placeholder="Detailed agenda for this session"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {editingSession.isVirtual ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Meeting Link <span className="text-rose-500">*</span></label>
                <input
                  type="url"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  value={editingSession.meetingLink || ''}
                  onChange={(e) => setEditingSession({...editingSession, meetingLink: e.target.value})}
                  placeholder="https://zoom.us/j/..."
                  required={editingSession.isVirtual}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Venue <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  value={editingSession.venue || ''}
                  onChange={(e) => setEditingSession({...editingSession, venue: e.target.value})}
                  placeholder="e.g., Conference Room A"
                  required={!editingSession.isVirtual}
                />
              </div>
            )}
            
            <div className="flex items-center pt-4">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editingSession.isVirtual || false}
                  onChange={(e) => setEditingSession({
                    ...editingSession,
                    isVirtual: e.target.checked
                  })}
                  className="w-4 h-4 text-blue-600 border-slate-200 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Virtual Session</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Session Status</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={editingSession.status || 'scheduled'}
              onChange={(e) => setEditingSession({...editingSession, status: e.target.value})}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="postponed">Postponed</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowEditSessionModal(false)}
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50" 
            onClick={() => handleEditSession(editingSession)}
            disabled={!editingSession.sessionTitle || !editingSession.sessionDate || !editingSession.startTime || !editingSession.endTime}
          >
            Update Session
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditSessionModal;
