import React from "react";
import { Icon } from "@iconify/react";
import Modal from "../../../shared/components/Modal";

const AllPunchesModal = ({ isOpen, onClose, selectedPunch, punches = [], onDeletePunch }) => {
  if (!selectedPunch) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`All Punches - ${selectedPunch.name} (${selectedPunch.code})`}
      size="md"
    >
      <div className="space-y-4">
        <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2.5">
          {punches.length > 0 ? (
            punches.map((punch) => (
              <div
                key={punch.id}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/70 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800 text-xs sm:text-sm">{punch.time}</div>
                  <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Icon icon="heroicons:fingerprint" className="w-3.5 h-3.5" />
                    {punch.type}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      punch.direction === "IN"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}
                  >
                    {punch.direction}
                  </span>
                  <button
                    type="button"
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    onClick={() => onDeletePunch(punch.id)}
                    title="Delete Punch"
                  >
                    <Icon icon="heroicons:trash" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs sm:text-sm">
              <Icon icon="heroicons:clock" className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
              No punches found for this employee
            </div>
          )}
        </div>

        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 bg-blue-50/50 p-2.5 border border-blue-100/50 rounded-xl">
          <Icon icon="heroicons:information-circle" className="w-4 h-4 text-blue-500" />
          <span>All punches for selected date are shown.</span>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-150">
          <button
            type="button"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AllPunchesModal;
