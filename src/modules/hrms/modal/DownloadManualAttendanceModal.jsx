import React from "react";
import { Icon } from "@iconify/react";
import Modal from "../../../shared/components/Modal";

const DownloadManualAttendanceModal = ({ isOpen, onClose, financialYear, onDownload }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Download Attendance"
      size="md"
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="text-xs bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between">
            <span className="text-slate-400 font-medium">Selected Period</span>
            <span className="font-extrabold text-blue-600 uppercase">{financialYear}</span>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Location</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700">
              <option>All Locations</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Cost Center</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700">
              <option>All Cost Centers</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-500">Department</label>
            <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700">
              <option>All Departments</option>
            </select>
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
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10"
            onClick={() => {
              onDownload();
              onClose();
            }}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DownloadManualAttendanceModal;
