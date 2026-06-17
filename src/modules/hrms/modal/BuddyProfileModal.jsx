import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BuddyProfileModal = ({
  isOpen,
  onClose,
  selectedBuddy,
  buddyPrograms = [],
  setAssignmentForm,
  setShowAssignmentModal
}) => {
  const buddy = selectedBuddy;

  if (!buddy) return null;

  const buddyAssignments = buddyPrograms.flatMap((program) =>
    program.assignments?.filter((a) => a.buddy?.id === buddy.id) || []
  );

  const avgFeedbackScore =
    buddyAssignments.length > 0
      ? buddyAssignments.reduce((sum, a) => sum + (a.feedbackScore || 0), 0) /
      buddyAssignments.length
      : 0;

  const handleAssignClick = () => {
    setAssignmentForm((prev) => ({
      ...prev,
      buddyId: buddy.id,
    }));
    onClose();
    setTimeout(() => {
      setShowAssignmentModal(true);
    }, 100);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Buddy Profile - ${buddy.name}`}
      size="xl"
    >
      <div className="space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:border-r md:border-slate-150 pr-0 md:pr-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Icon icon="heroicons:user-badge" className="w-12 h-12" />
            </div>

            <h5 className="text-lg font-bold text-slate-800 mt-4">{buddy.name}</h5>
            <p className="text-xs text-slate-500 mt-1">{buddy.role}</p>

            <div className="flex items-center gap-1.5 mt-3 text-amber-500">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Icon
                  key={idx}
                  icon={idx < Math.floor(buddy.rating || 0) ? "heroicons:star-solid" : "heroicons:star"}
                  className="w-4 h-4"
                />
              ))}
              <span className="text-xs font-bold text-slate-800 ml-1">
                {buddy.rating || '0.0'}/5
              </span>
            </div>

            <div className="mt-4">
              {buddy.currentAssignments < buddy.maxAssignments ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {buddy.availability || 'Available'}
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
                  Full Capacity
                </span>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:envelope" className="w-4 h-4 text-blue-500" />
                  Contact Information
                </h6>
                <div className="flex items-center gap-2 text-slate-600">
                  <Icon icon="heroicons:envelope-solid" className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{buddy.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Icon icon="heroicons:phone-solid" className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{buddy.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Icon icon="heroicons:map-pin-solid" className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{buddy.officeLocation}</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:list-bullet" className="w-4 h-4 text-emerald-500" />
                  Assignment Summary
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Current Pairings:</span>
                  <span className="font-bold text-slate-800">{buddy.currentAssignments}/{buddy.maxAssignments}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Mentees:</span>
                  <span className="font-bold text-slate-800">{buddy.totalMentees}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Average Feedback:</span>
                  <span className="font-bold text-amber-500">{avgFeedbackScore.toFixed(1)}/5</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              <div className="border border-slate-150 p-3 rounded-xl bg-white">
                <span className="text-slate-500 block mb-1">Department</span>
                <span className="font-bold text-slate-800">{buddy.department}</span>
              </div>
              <div className="border border-slate-150 p-3 rounded-xl bg-white">
                <span className="text-slate-500 block mb-1">Tenure</span>
                <span className="font-bold text-slate-800">{buddy.tenure}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Since {buddy.joinDate}</span>
              </div>
              <div className="border border-slate-150 p-3 rounded-xl bg-white">
                <span className="text-slate-500 block mb-1">Status</span>
                <span className={`font-bold ${buddy.currentAssignments < buddy.maxAssignments ? "text-emerald-600" : "text-rose-500"}`}>
                  {buddy.currentAssignments < buddy.maxAssignments ? "Available" : "At Capacity"}
                </span>
              </div>
            </div>

            {buddy.skills?.length > 0 && (
              <div className="space-y-2.5">
                <h6 className="text-sm font-bold text-slate-700">Skills & Expertise</h6>
                <div className="flex flex-wrap gap-1.5">
                  {buddy.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 font-medium border border-blue-100 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h6 className="text-sm font-bold text-slate-800">Current Assignments ({buddyAssignments.length})</h6>
          {buddyAssignments.length > 0 ? (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="p-3">New Joiner</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Match Score</th>
                      <th className="p-3">Progress</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-slate-600">
                    {buddyAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-semibold text-slate-800">{assignment.newJoiner?.name}</td>
                        <td className="p-3">{assignment.newJoiner?.department}</td>
                        <td className="p-3 font-bold text-slate-700">{assignment.matchScore}/100</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{assignment.completionPercentage || 0}%</span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5">
                              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${assignment.completionPercentage || 0}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${assignment.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {assignment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-slate-500">
              No current assignments for this buddy.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          {buddy.currentAssignments < buddy.maxAssignments && (
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleAssignClick}
            >
              Assign to New Joiner
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BuddyProfileModal;
