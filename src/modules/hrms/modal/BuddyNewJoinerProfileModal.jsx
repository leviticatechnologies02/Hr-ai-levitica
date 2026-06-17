import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BuddyNewJoinerProfileModal = ({
  isOpen,
  onClose,
  selectedNewJoiner,
  buddies = [],
  buddyPrograms = [],
  setAssignmentForm,
  setShowAssignmentModal
}) => {
  const newJoiner = selectedNewJoiner;

  if (!newJoiner) return null;

  const currentBuddy = newJoiner.assignedBuddy
    ? buddies.find((b) => b.name === newJoiner.assignedBuddy)
    : null;

  const handleAssignClick = () => {
    setAssignmentForm((prev) => ({
      ...prev,
      newJoinerId: newJoiner.id,
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
      title={`New Joiner Profile - ${newJoiner.name}`}
      size="xl"
    >
      <div className="space-y-6 p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:border-r md:border-slate-150 pr-0 md:pr-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Icon icon="heroicons:user" className="w-12 h-12" />
            </div>

            <h5 className="text-lg font-bold text-slate-800 mt-4">{newJoiner.name}</h5>
            <p className="text-xs text-slate-500 mt-1">{newJoiner.role}</p>

            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {newJoiner.onboardingStage || 'Orientation'}
              </span>
            </div>

            {newJoiner.assignedBuddy ? (
              <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl w-full text-xs">
                <span className="text-slate-500 block">Assigned Buddy</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{newJoiner.assignedBuddy}</span>
                {currentBuddy && (
                  <span className="text-slate-400 text-[10px] mt-0.5 block">
                    {currentBuddy.department} • {currentBuddy.role}
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-2xl w-full text-xs text-amber-700 font-medium">
                No Buddy Assigned
              </div>
            )}
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
                  <span>{newJoiner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Icon icon="heroicons:phone-solid" className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{newJoiner.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Icon icon="heroicons:map-pin-solid" className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{newJoiner.location}</span>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2 text-xs">
                <h6 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <Icon icon="heroicons:sparkles" className="w-4 h-4 text-emerald-500" />
                  Onboarding Progress
                </h6>
                <div className="flex justify-between text-slate-600">
                  <span>Join Date:</span>
                  <span className="font-bold text-slate-800">{new Date(newJoiner.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Onboarding Status:</span>
                  <span className="font-bold text-slate-800">{newJoiner.onboardingStatus}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Buddy Match Score:</span>
                  <span className="font-bold text-blue-600">
                    {newJoiner.matchScore ? `${newJoiner.matchScore}/100` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              <div className="border border-slate-150 p-3 rounded-xl bg-white">
                <span className="text-slate-500 block mb-1">Department</span>
                <span className="font-bold text-slate-800">{newJoiner.department}</span>
              </div>
              <div className="border border-slate-150 p-3 rounded-xl bg-white">
                <span className="text-slate-500 block mb-1">Manager</span>
                <span className="font-bold text-slate-800">{newJoiner.manager || 'N/A'}</span>
              </div>
              <div className="border border-slate-150 p-3 rounded-xl bg-white">
                <span className="text-slate-500 block mb-1">Office Location</span>
                <span className="font-bold text-slate-800">{newJoiner.location}</span>
              </div>
            </div>

            {newJoiner.skills?.length > 0 && (
              <div className="space-y-2.5">
                <h6 className="text-sm font-bold text-slate-700">Areas of Interest / Skills</h6>
                <div className="flex flex-wrap gap-1.5">
                  {newJoiner.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 font-medium border border-indigo-100 rounded-full"
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
          <h6 className="text-sm font-bold text-slate-800">Onboarding Status Details</h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">IT Setup</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1 mt-1">
                <Icon icon="heroicons:check-circle-solid" className="w-4 h-4 text-emerald-500" />
                Completed
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Documents</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1 mt-1">
                <Icon icon="heroicons:check-circle-solid" className="w-4 h-4 text-emerald-500" />
                Verified
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Training</span>
              <span className="text-xs font-bold text-amber-600 flex items-center justify-center gap-1 mt-1">
                <Icon icon="heroicons:clock-solid" className="w-4 h-4 text-amber-500" />
                In Progress
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Buddy Pairing</span>
              <span className={`text-xs font-bold flex items-center justify-center gap-1 mt-1 ${newJoiner.assignedBuddy ? "text-emerald-600" : "text-rose-600"}`}>
                <Icon icon={newJoiner.assignedBuddy ? "heroicons:check-circle-solid" : "heroicons:exclamation-circle-solid"} className={`w-4 h-4 ${newJoiner.assignedBuddy ? "text-emerald-500" : "text-rose-500"}`} />
                {newJoiner.assignedBuddy ? "Active" : "Required"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          {!newJoiner.assignedBuddy && (
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleAssignClick}
            >
              Find Buddy & Assign
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BuddyNewJoinerProfileModal;
