import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Modal from "../../../shared/components/Modal";

const AddPunchModal = ({ isOpen, onClose, selectedPunch, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: { hh: "", mm: "", ss: "" },
    remarks: "",
    type: "selfie",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        time: { hh: "", mm: "", ss: "" },
        remarks: "",
        type: "selfie",
      });
    }
  }, [isOpen]);

  if (!selectedPunch) return null;

  const handleTimeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      time: { ...prev.time, [field]: value },
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Time Punch"
      size="md"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Employee display */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            {selectedPunch.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-800">{selectedPunch.name}</div>
            <div className="text-[10px] text-slate-500">{selectedPunch.code}</div>
          </div>
        </div>

        {/* Punch Date */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Punch Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        {/* Punch Time */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Punch Time <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2">
            {["hh", "mm", "ss"].map((field) => (
              <input
                key={field}
                type="number"
                required
                placeholder={field.toUpperCase()}
                className="w-20 px-3 py-2 border border-slate-200 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
                value={formData.time[field]}
                onChange={(e) => handleTimeChange(field, e.target.value)}
                min="0"
                max={field === "hh" ? "23" : "59"}
              />
            ))}
          </div>
        </div>

        {/* Punch Type */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Punch Type <span className="text-rose-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="selfie">Selfie</option>
            <option value="remote">Remote</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-slate-700 font-semibold mb-1">Remarks</label>
          <input
            type="text"
            placeholder="Enter remarks (optional)"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
          <button
            type="button"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Icon icon="heroicons:plus" className="w-4 h-4" />
            Insert
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPunchModal;
