import React from "react";
import { X, Save, UserPlus } from "lucide-react";
import Modal from "../../../shared/components/Modal";

const WorkflowStageModal = ({
  isOpen,
  onClose,
  editingStage,
  setEditingStage,
  approvalLevels,
  onSave
}) => {
  if (!isOpen || !editingStage) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Stage">
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Approval Level</label>
        <select
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={editingStage.level}
          onChange={(e) => setEditingStage({ ...editingStage, level: e.target.value })}
        >
          {approvalLevels.map(level => (
            <option key={level.id} value={level.id}>{level.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Timeout (hours)</label>
          <input
            type="number"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={editingStage.timeout}
            onChange={(e) => setEditingStage({ ...editingStage, timeout: parseInt(e.target.value) || 24 })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={editingStage.isEnabled ? "enabled" : "disabled"}
            onChange={(e) => setEditingStage({ ...editingStage, isEnabled: e.target.value === "enabled" })}
          >
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Approvers</label>
        <div className="p-3 bg-slate-50 rounded-lg mt-2">
          <p className="m-0 mb-3 text-sm text-slate-500">
            Approvers will be assigned based on the approval level selected.
            You can add specific approvers or use role-based assignment.
          </p>
          <button className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
            <UserPlus size={14} /> Add Approver
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-6 justify-end pt-4 border-t border-slate-200">
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
          onClick={onSave}
        >
          <Save size={16} /> Save Stage
        </button>
      </div>
    </Modal>
  );
};

export default WorkflowStageModal;
