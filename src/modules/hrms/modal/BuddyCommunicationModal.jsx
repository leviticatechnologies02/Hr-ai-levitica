import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BuddyCommunicationModal = ({
  isOpen,
  onClose,
  communicationForm,
  setCommunicationForm,
  handleRecordCommunication,
  buddyPrograms = [],
  communicationTypes = []
}) => {
  const [localForm, setLocalForm] = useState(communicationForm);

  useEffect(() => {
    if (isOpen) {
      setLocalForm(communicationForm);
    }
  }, [communicationForm, isOpen]);

  const assignment = localForm.assignmentId
    ? buddyPrograms
      .flatMap((p) => p.assignments)
      .find((a) => a.id === Number(localForm.assignmentId))
    : null;

  const handleChange = (field, value) => {
    setLocalForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setCommunicationForm(localForm);
    setTimeout(() => {
      handleRecordCommunication(localForm);
    }, 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Communication"
      size="xl"
    >
      <div className="space-y-4 sm:space-y-6 p-2 ">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
            Select Assignment <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
            value={localForm.assignmentId || ""}
            onChange={(e) =>
              handleChange("assignmentId", parseInt(e.target.value) || null)
            }
          >
            <option value="">Select assignment...</option>
            {buddyPrograms.flatMap((program) =>
              program.assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.buddy.name} → {assignment.newJoiner.name} ({program.name})
                </option>
              ))
            )}
          </select>
        </div>

        {assignment && (
          <div className="p-3 sm:p-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 block text-[10px] sm:text-xs">Buddy</span>
              <span className="font-bold text-slate-800 text-sm sm:text-base truncate block">{assignment.buddy.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] sm:text-xs">New Joiner</span>
              <span className="font-bold text-slate-800 text-sm sm:text-base truncate block">{assignment.newJoiner.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] sm:text-xs">Last Check-in</span>
              <span className="font-bold text-slate-800 text-sm sm:text-base">{assignment.lastCheckIn || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] sm:text-xs">Next Check-in</span>
              <span className="font-bold text-slate-800 text-sm sm:text-base">{assignment.nextCheckIn || "N/A"}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Communication Type <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
              value={localForm.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              {communicationTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={localForm.date}
              onChange={(e) => handleChange("date", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={localForm.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
              placeholder="e.g., 30"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Next Check-in Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              value={
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]
              }
              disabled
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Topics Discussed</label>
          <textarea
            className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm resize-y"
            rows="2"
            value={localForm.topics}
            onChange={(e) => handleChange("topics", e.target.value)}
            placeholder="Separate topics with commas (e.g. Introduction, Team structure, Tool accesses)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Follow-up Actions</label>
          <textarea
            className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm resize-y"
            rows="2"
            value={localForm.followUp}
            onChange={(e) => handleChange("followUp", e.target.value)}
            placeholder="Separate actions with commas (e.g. Grant GitHub access, Setup intro call with PM)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Additional Notes</label>
          <textarea
            className="w-full px-3 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm resize-y"
            rows="3"
            value={localForm.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Enter any other important details or observations..."
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors active:bg-slate-100 whitespace-nowrap"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-blue-800 whitespace-nowrap min-w-[140px] sm:min-w-[160px] flex items-center justify-center gap-2"
            onClick={handleSubmit}
            disabled={!localForm.assignmentId || !localForm.date}
          >
            <Icon icon="heroicons:chat-bubble-left-right" className="w-4 h-4" />
            Record Communication
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BuddyCommunicationModal;