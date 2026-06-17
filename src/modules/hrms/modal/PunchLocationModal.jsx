import React from "react";
import { Icon } from "@iconify/react";
import Modal from "../../../shared/components/Modal";

const PunchLocationModal = ({ isOpen, onClose, selectedPunch }) => {
  if (!selectedPunch) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Punch Location - ${selectedPunch.name} (${selectedPunch.code})`}
      size="lg"
    >
      <div className="space-y-4">
        {selectedPunch.locationUrl ? (
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
              src={selectedPunch.locationUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Punch Location Map"
              className="w-full"
            ></iframe>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-500">
            <Icon icon="heroicons:map" className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs font-semibold">Location data not available for this punch</p>
          </div>
        )}

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

export default PunchLocationModal;
