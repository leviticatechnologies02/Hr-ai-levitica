import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BuddyAssignmentModal = ({
  isOpen,
  onClose,
  assignmentForm,
  setAssignmentForm,
  handleAssignBuddy,
  buddyPrograms = [],
  buddies = [],
  newJoiners = []
}) => {
  const buddy = assignmentForm.buddyId
    ? buddies.find((b) => b.id === assignmentForm.buddyId)
    : null;
  const newJoiner = assignmentForm.newJoinerId
    ? newJoiners.find((n) => n.id === assignmentForm.newJoinerId)
    : null;
  const program = assignmentForm.programId
    ? buddyPrograms.find((p) => p.id === assignmentForm.programId)
    : null;

  const [matchScore, setMatchScore] = useState(0);
  const [localAssignmentDate, setLocalAssignmentDate] = useState(assignmentForm.assignmentDate || '');
  const [localPairingReason, setLocalPairingReason] = useState(assignmentForm.pairingReason || '');
  const [localNotes, setLocalNotes] = useState(assignmentForm.notes || '');

  useEffect(() => {
    if (isOpen) {
      setLocalAssignmentDate(assignmentForm.assignmentDate || new Date().toISOString().split('T')[0]);
      setLocalPairingReason(assignmentForm.pairingReason || '');
      setLocalNotes(assignmentForm.notes || '');
    }
  }, [assignmentForm.assignmentDate, assignmentForm.pairingReason, assignmentForm.notes, isOpen]);

  const calculateMatchScoreLocal = (b, nj, prg) => {
    if (!b || !nj || !prg) return 0;
    let score = 0;
    let maxPossibleScore = 0;

    prg.assignmentRules?.forEach((rule) => {
      maxPossibleScore += rule.weight;
      let ruleMatched = false;

      switch (rule.id) {
        case 1:
          const tenureYears = parseInt(b.tenure) || 0;
          ruleMatched = tenureYears >= 1;
          break;
        case 2:
          ruleMatched = b.department === nj.department;
          break;
        case 3:
        case 4:
          ruleMatched = true;
          break;
        case 5:
          ruleMatched = b.currentAssignments < b.maxAssignments;
          break;
        case 6:
          ruleMatched = b.officeLocation === nj.location;
          break;
        case 7:
          const commonSkills = b.skills?.filter((s) => nj.skills?.includes(s)).length || 0;
          ruleMatched = commonSkills > 0;
          break;
        default:
          ruleMatched = true;
      }

      if (ruleMatched) {
        score += rule.weight;
      }
    });

    return maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;
  };

  useEffect(() => {
    if (buddy && newJoiner && program) {
      const score = calculateMatchScoreLocal(buddy, newJoiner, program);
      setMatchScore(score);

      if (!assignmentForm.pairingReason && !localPairingReason) {
        const reasons = [];
        if (buddy.department === newJoiner.department) {
          reasons.push("Same department");
        }
        if (buddy.officeLocation === newJoiner.location) {
          reasons.push("Same location");
        }
        const commonSkills = buddy.skills?.filter((skill) => newJoiner.skills?.includes(skill)) || [];
        if (commonSkills.length > 0) {
          reasons.push(`${commonSkills.length} shared skills`);
        }

        if (reasons.length > 0) {
          const autoReason = `Auto-matched: ${reasons.join(", ")}`;
          setLocalPairingReason(autoReason);
          setAssignmentForm((prev) => ({ ...prev, pairingReason: autoReason }));
        }
      }
    } else {
      setMatchScore(0);
    }
  }, [buddy, newJoiner, program]);

  const handleAssignmentDateBlur = () => {
    setAssignmentForm((prev) => ({ ...prev, assignmentDate: localAssignmentDate }));
  };

  const handlePairingReasonBlur = () => {
    setAssignmentForm((prev) => ({ ...prev, pairingReason: localPairingReason }));
  };

  const handleNotesBlur = () => {
    setAssignmentForm((prev) => ({ ...prev, notes: localNotes }));
  };

  const handleSubmit = () => {
    setAssignmentForm((prev) => ({
      ...prev,
      assignmentDate: localAssignmentDate,
      pairingReason: localPairingReason,
      notes: localNotes
    }));
    setTimeout(() => {
      handleAssignBuddy();
    }, 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buddy-New Joiner Pairing"
      size="xl"
    >
      <div className="space-y-6 p-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-3 md:p-4 flex flex-col justify-between">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Program <span className="text-rose-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
                value={assignmentForm.programId || ''}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    programId: parseInt(e.target.value) || null,
                  })
                }
              >
                <option value="">Choose program...</option>
                {buddyPrograms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {assignmentForm.programId && program && (
              <div className="mt-4 p-3 bg-white border border-slate-100 rounded-xl text-xs space-y-1">
                <div className="font-bold text-blue-600">{program.name}</div>
                <div className="text-slate-500 flex items-center gap-1 mt-1">
                  <Icon icon="heroicons:calendar" className="w-3.5 h-3.5" />
                  {program.startDate} to {program.endDate}
                </div>
                <div className="text-slate-500 flex items-center gap-1">
                  <Icon icon="heroicons:tag" className="w-3.5 h-3.5" />
                  {program.programType}
                </div>
              </div>
            )}
          </div>

          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Buddy <span className="text-rose-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
                value={assignmentForm.buddyId || ''}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    buddyId: parseInt(e.target.value) || null,
                  })
                }
              >
                <option value="">Choose buddy...</option>
                {buddies
                  .filter((b) => b.currentAssignments < b.maxAssignments || b.id === assignmentForm.buddyId)
                  .sort((a, b) => b.rating - a.rating)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.department}) - {b.currentAssignments}/{b.maxAssignments}
                    </option>
                  ))}
              </select>
            </div>

            {assignmentForm.buddyId && buddy && (
              <div className="mt-4 p-3 bg-white border border-slate-100 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-50 rounded-full p-1.5">
                    <Icon icon="heroicons:user" className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{buddy.name}</div>
                    <div className="text-slate-500">{buddy.department} • {buddy.role}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-slate-600">
                  <div>Rating: <span className="font-bold text-amber-500">{buddy.rating}/5</span></div>
                  <div>Tenure: <span className="font-bold">{buddy.tenure}</span></div>
                  <div className="col-span-2">Assignments: <span className="font-bold">{buddy.currentAssignments}/{buddy.maxAssignments}</span></div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select New Joiner <span className="text-rose-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
                value={assignmentForm.newJoinerId || ''}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    newJoinerId: parseInt(e.target.value) || null,
                  })
                }
              >
                <option value="">Choose new joiner...</option>
                {newJoiners
                  .filter((n) => !n.assignedBuddy || n.id === assignmentForm.newJoinerId)
                  .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
                  .map((nj) => (
                    <option key={nj.id} value={nj.id}>
                      {nj.name} ({nj.department})
                    </option>
                  ))}
              </select>
            </div>

            {assignmentForm.newJoinerId && newJoiner && (
              <div className="mt-4 p-3 bg-white border border-slate-100 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-50 rounded-full p-1.5">
                    <Icon icon="heroicons:user-plus" className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{newJoiner.name}</div>
                    <div className="text-slate-500">{newJoiner.department} • {newJoiner.role}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-slate-600">
                  <div>Joined: <span className="font-bold">{new Date(newJoiner.joinDate).toLocaleDateString()}</span></div>
                  <div>Stage: <span className="font-bold text-indigo-600">{newJoiner.onboardingStage}</span></div>
                  <div className="col-span-2">Location: <span className="font-bold">{newJoiner.location}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {assignmentForm.buddyId && assignmentForm.newJoinerId && buddy && newJoiner && program ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="border border-slate-200 rounded-2xl p-4 space-y-4">
              <h6 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Icon icon="heroicons:presentation-chart-line" className="w-4 h-4 text-blue-500" />
                Match Analysis
              </h6>

              <div className="text-center">
                <div className={`text-3xl font-extrabold ${matchScore >= 80 ? "text-emerald-500" : matchScore >= 60 ? "text-amber-500" : "text-rose-500"}`}>
                  {matchScore}/100
                </div>
                <div className="text-xs text-slate-500 mt-1">Compatibility Score</div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${matchScore >= 80 ? "bg-emerald-500" : matchScore >= 60 ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${matchScore}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-600">Department</div>
                  <div className={`font-semibold mt-1 flex items-center gap-1 ${buddy.department === newJoiner.department ? "text-emerald-600" : "text-rose-500"}`}>
                    <Icon icon={buddy.department === newJoiner.department ? "heroicons:check-circle" : "heroicons:x-circle"} className="w-4 h-4" />
                    {buddy.department === newJoiner.department ? "Match" : "Different"}
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-600">Location</div>
                  <div className={`font-semibold mt-1 flex items-center gap-1 ${buddy.officeLocation === newJoiner.location ? "text-emerald-600" : "text-rose-500"}`}>
                    <Icon icon={buddy.officeLocation === newJoiner.location ? "heroicons:check-circle" : "heroicons:x-circle"} className="w-4 h-4" />
                    {buddy.officeLocation === newJoiner.location ? "Same" : "Different"}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Skills Match</div>
                <div className="flex flex-wrap gap-1.5">
                  {buddy.skills?.map((skill) => {
                    const isShared = newJoiner.skills?.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${isShared ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-50 text-slate-600 border border-slate-150"}`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 space-y-4">
              <h6 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Icon icon="heroicons:clipboard-document-text" className="w-4 h-4 text-blue-500" />
                Assignment Details
              </h6>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Assignment Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    value={localAssignmentDate}
                    onChange={(e) => setLocalAssignmentDate(e.target.value)}
                    onBlur={handleAssignmentDateBlur}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Pairing Reason</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    value={localPairingReason}
                    onChange={(e) => setLocalPairingReason(e.target.value)}
                    onBlur={handlePairingReasonBlur}
                    placeholder="Auto-generated or manual reason"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
                  <textarea
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    rows="2"
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    onBlur={handleNotesBlur}
                    placeholder="Instructions or notes for this pairing"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-blue-800">
                <Icon icon="heroicons:information-circle" className="w-4 h-4 flex-shrink-0 text-blue-600 mt-0.5" />
                <span>Both buddy and new joiner will be notified via email with pairing details and checklist instructions.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center text-slate-500 text-sm flex flex-col items-center gap-2">
            <Icon icon="heroicons:information-circle" className="w-8 h-8 text-slate-400" />
            <span>Please select a program, buddy, and new joiner to view match analysis.</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!assignmentForm.programId || !assignmentForm.buddyId || !assignmentForm.newJoinerId}
          >
            Create Pairing
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BuddyAssignmentModal;
