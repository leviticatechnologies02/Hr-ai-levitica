import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ViewTicketModal = ({ isOpen, onClose, ticket, onUpdateStatus, onAssign, onAddNote, internalNotes = {}, userRole = 'hr_admin', assignedAgents = [] }) => {
  const [note, setNote] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [resolutionText, setResolutionText] = useState('');

  if (!ticket) return null;

  const ticketNotes = internalNotes[ticket.id] || [];

  const handleAddNote = () => {
    if (note.trim()) {
      onAddNote(ticket.id, note);
      setNote('');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'text-rose-700 bg-rose-100 border-rose-300';
      case 'HIGH': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'LOW': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'IN_PROGRESS': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'RESOLVED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'CLOSED': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ticket #${ticket.id}: ${ticket.title}`} size="lg">
      <div className="p-2 space-y-6">
        <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
          <span className={`px-2.5 py-1 border rounded-full text-xs font-semibold uppercase ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority} Priority
          </span>
          <span className={`px-2.5 py-1 border rounded-full text-xs font-semibold capitalize ${getStatusColor(ticket.status)}`}>
            {ticket.status.replace('_', ' ')}
          </span>
          <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold">
            {ticket.category}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Icon icon="heroicons:user" className="w-4 h-4 text-slate-400" />
              Employee Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-medium text-slate-800">{ticket.employee_name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ID:</span>
                <span className="font-medium text-slate-800">{ticket.employee_id ?? 'N/A'}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Icon icon="heroicons:information-circle" className="w-4 h-4 text-slate-400" />
              Ticket Info
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Created:</span>
                <span className="font-medium text-slate-800">{new Date(ticket.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Updated:</span>
                <span className="font-medium text-slate-800">{new Date(ticket.updated_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned To:</span>
                <span className="font-medium text-slate-800">{ticket.assigned_agent || 'Unassigned'}</span>
              </div>
              {ticket.resolved_at && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Resolved:</span>
                  <span className="font-medium text-slate-800 text-emerald-600">{new Date(ticket.resolved_at).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3">Description</h4>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">
            {ticket.description}
          </div>
        </div>

        {userRole === 'hr_admin' && (
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Assign Ticket</h4>
            <div className="flex gap-3">
              <select
                value={assignTo || ticket.assigned_agent || ''}
                onChange={(e) => setAssignTo(e.target.value)}
                className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              >
                <option value="">Select Agent</option>
                {assignedAgents.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
              <button
                onClick={() => onAssign(ticket.id, assignTo)}
                disabled={!assignTo || assignTo === ticket.assigned_agent}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3">Internal Notes</h4>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
            The backend doesn't have a notes/comments table for tickets yet — only a single "resolution" field set when a ticket is resolved. Notes added here are kept in this browser tab only and will be lost on refresh.
          </p>
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {ticketNotes.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-4 italic">No internal notes yet</div>
            ) : (
              ticketNotes.map(n => (
                <div key={n.id} className="bg-blue-50 p-3 rounded-xl border-l-4 border-blue-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-blue-700">{n.author}</span>
                    <span className="text-xs text-slate-500">{new Date(n.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-slate-700">{n.content}</div>
                </div>
              ))
            )}
          </div>
          <div className="flex flex-col gap-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add internal note..."
              rows="2"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none"
            />
            <button
              onClick={handleAddNote}
              disabled={!note.trim()}
              className="self-end px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900 transition disabled:opacity-50"
            >
              Add Note
            </button>
          </div>
        </div>

        {ticket.status === 'IN_PROGRESS' && (
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Resolution Notes <span className="text-rose-500">*</span></h4>
            <textarea
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              placeholder="Describe how this ticket was resolved — required by the backend before it can be marked Resolved..."
              rows="2"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-slate-100">
          <div className="flex gap-2 w-full sm:w-auto">
            {ticket.status === 'OPEN' && (
              <button onClick={() => onUpdateStatus(ticket.id, 'IN_PROGRESS', { assignedAgent: ticket.assigned_agent })} className="flex-1 sm:flex-none px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
                Start Progress
              </button>
            )}
            {ticket.status === 'IN_PROGRESS' && (
              <button
                onClick={() => onUpdateStatus(ticket.id, 'RESOLVED', { resolution: resolutionText })}
                disabled={!resolutionText.trim()}
                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                Mark as Resolved
              </button>
            )}
            {(ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS' || ticket.status === 'RESOLVED') && (
              <button onClick={() => onUpdateStatus(ticket.id, 'CLOSED')} className="flex-1 sm:flex-none px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-300 transition">
                Close Ticket
              </button>
            )}
            {(ticket.status === 'CLOSED' || ticket.status === 'RESOLVED') && (
              <button onClick={() => onUpdateStatus(ticket.id, 'OPEN')} className="flex-1 sm:flex-none px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-200 transition">
                Reopen
              </button>
            )}
          </div>
          <button disabled title="Escalation isn't a concept the backend supports yet — there's no escalation flag or endpoint" className="w-full sm:w-auto px-4 py-2 border border-slate-200 text-slate-400 rounded-xl text-sm font-semibold cursor-not-allowed">
            Escalate
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewTicketModal;
