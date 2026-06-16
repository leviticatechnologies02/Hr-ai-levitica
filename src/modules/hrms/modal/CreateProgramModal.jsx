import React from 'react';
import Modal from '../../../shared/components/Modal';

const CreateProgramModal = ({
  showCreateProgram,
  setShowCreateProgram,
  programForm,
  setProgramForm,
  handleCreateProgram
}) => {
  return (
    <Modal
      isOpen={showCreateProgram}
      onClose={() => setShowCreateProgram(false)}
      title="Create New Induction Program"
      size="xl"
    >
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Program Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={programForm.name}
              onChange={(e) => setProgramForm({...programForm, name: e.target.value})}
              required
              placeholder="e.g., Q2 2024 Orientation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Program Type <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={programForm.type}
              onChange={(e) => setProgramForm({...programForm, type: e.target.value})}
            >
              <option value="batch">Batch Program</option>
              <option value="individual">Individual</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            rows="3"
            value={programForm.description}
            onChange={(e) => setProgramForm({...programForm, description: e.target.value})}
            placeholder="Program description"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date <span className="text-rose-500">*</span></label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={programForm.startDate}
              onChange={(e) => setProgramForm({...programForm, startDate: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">End Date <span className="text-rose-500">*</span></label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={programForm.endDate}
              onChange={(e) => setProgramForm({...programForm, endDate: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Location <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={programForm.location}
              onChange={(e) => setProgramForm({...programForm, location: e.target.value})}
              required
              placeholder="e.g., Main Auditorium"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Max Participants</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={programForm.maxParticipants}
              onChange={(e) => setProgramForm({...programForm, maxParticipants: parseInt(e.target.value) || 0})}
              min="1"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button 
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowCreateProgram(false)}
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-5 py-2.5 bg-blue-550 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50" 
            onClick={handleCreateProgram}
            disabled={!programForm.name || !programForm.startDate || !programForm.endDate || !programForm.location}
          >
            Create Program
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateProgramModal;
