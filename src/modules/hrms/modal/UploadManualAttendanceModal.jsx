import React from "react";
import { Icon } from "@iconify/react";
import Modal from "../../../shared/components/Modal";

const UploadManualAttendanceModal = ({ isOpen, onClose, financialYear, onUpload }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Attendance"
      size="md"
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="text-xs bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
            <span className="text-slate-400 font-medium">Selected Period</span>
            <span className="font-extrabold text-blue-600 uppercase">{financialYear}</span>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Select File</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer relative bg-slate-50/50">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    onUpload(file);
                    onClose();
                  }
                }}
              />
              <Icon icon="heroicons:arrow-up-tray" className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Click to upload or drag & drop</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports .csv files</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadManualAttendanceModal;
