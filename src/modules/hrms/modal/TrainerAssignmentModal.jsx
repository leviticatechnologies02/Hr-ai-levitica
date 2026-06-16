import React from 'react';
import Modal from '../../../shared/components/Modal';

const TrainerAssignmentModal = ({
  showTrainerAssignmentModal,
  setShowTrainerAssignmentModal,
  trainerAssignmentData,
  setTrainerAssignmentData,
  inductionPrograms,
  handleAssignTrainer
}) => {
  return (
    <Modal
      isOpen={showTrainerAssignmentModal}
      onClose={() => setShowTrainerAssignmentModal(false)}
      title="Assign Trainer"
      size="md"
    >
      <div className="space-y-4 p-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Select Program</label>
          <select 
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
            value={trainerAssignmentData.programId || ''}
            onChange={(e) => setTrainerAssignmentData({
              ...trainerAssignmentData, 
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
          <label className="block text-sm font-semibold text-slate-700 mb-1">Trainer Name <span className="text-rose-500">*</span></label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            value={trainerAssignmentData.trainerName}
            onChange={(e) => setTrainerAssignmentData({...trainerAssignmentData, trainerName: e.target.value})}
            placeholder="Enter trainer name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Trainer Role</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            placeholder="e.g., HR Manager"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Trainer Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            placeholder="trainer@company.com"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowTrainerAssignmentModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-550 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            onClick={handleAssignTrainer}
            disabled={!trainerAssignmentData.programId || !trainerAssignmentData.trainerName}
          >
            Assign Trainer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TrainerAssignmentModal;
