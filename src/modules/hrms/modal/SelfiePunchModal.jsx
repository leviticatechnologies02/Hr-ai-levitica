import React from "react";
import { Icon } from "@iconify/react";
import Modal from "../../../shared/components/Modal";

const SelfiePunchModal = ({ isOpen, onClose, selectedPunch }) => {
  if (!selectedPunch) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Selfie Punch Images - ${selectedPunch.name}`}
      size="md"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-blue-100 shadow-inner flex items-center justify-center bg-slate-100">
              <img
                src={selectedPunch.registeredFace || "https://placehold.co/150x150.png?text=?"}
                alt="Registered Face"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://placehold.co/150x150.png?text=?";
                }}
              />
            </div>
            <span className="mt-3 text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
              <Icon icon="heroicons:user-circle" className="w-4 h-4 text-blue-500" />
              Registered Face
            </span>
          </div>

          <div className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-emerald-100 shadow-inner flex items-center justify-center bg-slate-100">
              <img
                src={selectedPunch.punchImage || "https://placehold.co/150x150.png?text=?"}
                alt="Punch Image"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://placehold.co/150x150.png?text=?";
                }}
              />
            </div>
            <span className="mt-3 text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
              <Icon icon="heroicons:camera" className="w-4 h-4 text-emerald-500" />
              Punch Image
            </span>
          </div>
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

export default SelfiePunchModal;
