import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BuddyCreateProgramModal = ({
  isOpen,
  onClose,
  programForm,
  setProgramForm,
  handleCreateProgram,
  programTypes = [],
  departments = [],
  locations = []
}) => {
  const [localProgramForm, setLocalProgramForm] = useState(programForm);

  useEffect(() => {
    setLocalProgramForm(programForm);
  }, [programForm, isOpen]);

  const handleInputChange = (field, value) => {
    setLocalProgramForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRuleChange = (index, field, value) => {
    setLocalProgramForm((prev) => {
      const newRules = [...prev.assignmentRules];
      newRules[index] = {
        ...newRules[index],
        [field]: value,
      };
      return {
        ...prev,
        assignmentRules: newRules,
      };
    });
  };

  const handleSubmit = () => {
    setProgramForm(localProgramForm);
    setTimeout(() => {
      handleCreateProgram();
    }, 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Buddy Program"
      size="xl"
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Program Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={localProgramForm.name || ''}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              placeholder="e.g., Q2 2024 Buddy Program"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Program Type <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
              value={localProgramForm.programType || ''}
              onChange={(e) => handleInputChange("programType", e.target.value)}
            >
              <option value="">Select type...</option>
              {programTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm resize-y"
            rows="3"
            value={localProgramForm.description || ''}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe the program objectives, scope, and expected outcomes"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
              value={localProgramForm.department || ''}
              onChange={(e) => handleInputChange("department", e.target.value)}
            >
              <option value="">Select department...</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Location <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
              value={localProgramForm.location || ''}
              onChange={(e) => handleInputChange("location", e.target.value)}
            >
              <option value="">Select location...</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Start Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={localProgramForm.startDate || ''}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
            <input
              type="date"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={localProgramForm.endDate || ''}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
            <select
              className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
              value={localProgramForm.status || 'active'}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Assignment Rules</label>
          <div className="border border-slate-150 rounded-2xl p-2 sm:p-4 bg-slate-50 space-y-3">
            {localProgramForm.assignmentRules?.map((rule, index) => (
              <div key={rule.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <div className="flex-grow">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                    value={rule.rule}
                    onChange={(e) => handleRuleChange(index, "rule", e.target.value)}
                    placeholder="Rule description"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      checked={rule.mandatory}
                      onChange={(e) => handleRuleChange(index, "mandatory", e.target.checked)}
                    />
                    <span className="text-xs font-medium text-slate-600">Mandatory</span>
                  </label>

                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">Weight:</span>
                    <input
                      type="number"
                      className="w-14 sm:w-16 px-1.5 sm:px-2 py-1.5 border border-slate-200 rounded-lg text-center text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      value={rule.weight}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*$/.test(val)) {
                          handleRuleChange(index, "weight", val === "" ? "" : parseInt(val, 10));
                        }
                      }}
                      onBlur={() => {
                        if (rule.weight === "" || isNaN(rule.weight)) {
                          handleRuleChange(index, "weight", 0);
                        } else {
                          const clamped = Math.min(100, Math.max(0, parseInt(rule.weight, 10) || 0));
                          handleRuleChange(index, "weight", clamped);
                        }
                      }}
                      min="0"
                      max="100"
                    />
                  </div>

                  <button
                    type="button"
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                    onClick={() => {
                      setLocalProgramForm((prev) => {
                        const newRules = prev.assignmentRules.filter((_, i) => i !== index);
                        return { ...prev, assignmentRules: newRules };
                      });
                    }}
                  >
                    <Icon icon="heroicons:trash" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 border border-blue-500 text-blue-600 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-50 transition-colors active:bg-blue-100"
              onClick={() => {
                setLocalProgramForm((prev) => {
                  const newRules = [...(prev.assignmentRules || [])];
                  newRules.push({
                    id: Date.now(),
                    rule: "",
                    mandatory: false,
                    weight: 10,
                  });
                  return { ...prev, assignmentRules: newRules };
                });
              }}
            >
              <Icon icon="heroicons:plus-circle" className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Rule
            </button>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors active:bg-slate-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-blue-800 flex items-center justify-center gap-2 whitespace-nowrap min-w-[140px] sm:min-w-[160px]"
            onClick={handleSubmit}
            disabled={!localProgramForm.name || !localProgramForm.startDate}
          >
            <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
            Create Program
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BuddyCreateProgramModal;