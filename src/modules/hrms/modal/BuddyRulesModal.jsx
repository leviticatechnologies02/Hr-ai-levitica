import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BuddyRulesModal = ({
  isOpen,
  onClose,
  selectedProgram
}) => {
  const program = selectedProgram;

  if (!program) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assignment Rules - ${program.name}`}
      size="lg"
    >
      <div className="space-y-6 ">

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-2.5 text-xs text-blue-800">
          <Icon icon="heroicons:information-circle" className="w-5 h-5 flex-shrink-0 text-blue-600" />
          <div>
            <span className="font-bold block mb-0.5">Matching Algorithm</span>
            These rules determine pairing suitability scores. Mandatory rules must be satisfied, while preferred rules increase compatibility points.
          </div>
        </div>

        <div className="sm:hidden space-y-3">
          {program.assignmentRules?.map((rule) => (
            <div key={rule.id} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="font-semibold text-slate-800 text-xs">{rule.rule}</span>
                <span className="font-bold text-slate-900 text-xs flex-shrink-0">{rule.weight} pts</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                {rule.mandatory ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                    Mandatory
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                    Preferred
                  </span>
                )}
                <span className="text-[10px] text-slate-400">
                  {rule.mandatory ? "Must be met to auto-pair" : "Adds bonus points if met"}
                </span>
              </div>
            </div>
          ))}
          {(!program.assignmentRules || program.assignmentRules.length === 0) && (
            <div className="p-6 text-center text-slate-400 text-xs bg-white border border-slate-200 rounded-2xl">
              No assignment rules defined for this program.
            </div>
          )}
        </div>

        <div className="hidden sm:block border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-700 font-semibold">
                  <th className="p-3">Rule</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">Requirement Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {program.assignmentRules?.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-semibold text-slate-800">{rule.rule}</td>
                    <td className="p-3">
                      {rule.mandatory ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                          Mandatory
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          Preferred
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{rule.weight} pts</td>
                    <td className="p-3 text-slate-400">
                      {rule.mandatory ? "Must be met to auto-pair" : "Adds bonus points if met"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!program.assignmentRules || program.assignmentRules.length === 0) && (
            <div className="p-6 text-center text-slate-400 text-xs bg-white">
              No assignment rules defined for this program.
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
        </div>
      </div>
    </Modal>
  );
};

export default BuddyRulesModal;
