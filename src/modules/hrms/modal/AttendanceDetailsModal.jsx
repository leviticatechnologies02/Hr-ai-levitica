import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const AttendanceDetailsModal = ({
  showAttendanceHistoryModal,
  setShowAttendanceHistoryModal,
  selectedAttendanceRecord
}) => {
  if (!selectedAttendanceRecord) return null;

  return (
    <Modal
      isOpen={showAttendanceHistoryModal}
      onClose={() => setShowAttendanceHistoryModal(false)}
      title="Attendance Details"
      size="lg"
    >
      <div className="space-y-6 p-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee Info Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
            <h6 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon icon="heroicons:user" className="w-5 h-5 text-blue-600" />
              Employee Information
            </h6>
            <div className="space-y-3">
              <div>
                <small className="text-xs text-slate-400 block font-medium">Name</small>
                <span className="font-semibold text-slate-800">{selectedAttendanceRecord.employeeName}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Employee ID</small>
                <span className="font-semibold text-slate-800">{selectedAttendanceRecord.employeeId}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Department</small>
                <span className="font-semibold text-slate-800">{selectedAttendanceRecord.department}</span>
              </div>
            </div>
          </div>

          {/* Attendance Info Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
            <h6 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon icon="heroicons:check-badge" className="w-5 h-5 text-emerald-600" />
              Attendance Information
            </h6>
            <div className="space-y-3">
              <div>
                <small className="text-xs text-slate-400 block font-medium mb-1">Status</small>
                <div>
                  {selectedAttendanceRecord.status === 'present' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Present
                    </span>
                  ) : selectedAttendanceRecord.status === 'absent' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                      Absent
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                      {selectedAttendanceRecord.status}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Date</small>
                <span className="font-semibold text-slate-800">{selectedAttendanceRecord.sessionDate}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Session Time</small>
                <span className="font-semibold text-slate-800">
                  {selectedAttendanceRecord.checkInTime} - {selectedAttendanceRecord.checkOutTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Program Info Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
            <h6 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon icon="heroicons:academic-cap" className="w-5 h-5 text-purple-600" />
              Program Information
            </h6>
            <div className="space-y-3">
              <div>
                <small className="text-xs text-slate-400 block font-medium">Program</small>
                <span className="font-semibold text-slate-800">{selectedAttendanceRecord.programName}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Session Title</small>
                <span className="font-semibold text-slate-800">{selectedAttendanceRecord.sessionTitle}</span>
              </div>
            </div>
          </div>

          {/* Record Info Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
            <h6 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon icon="heroicons:document-text" className="w-5 h-5 text-slate-600" />
              Record Information
            </h6>
            <div className="space-y-3">
              <div>
                <small className="text-xs text-slate-400 block font-medium">Recorded By</small>
                <span className="font-semibold text-slate-800">{selectedAttendanceRecord.recordedBy}</span>
              </div>
              <div>
                <small className="text-xs text-slate-400 block font-medium">Recorded At</small>
                <span className="font-semibold text-slate-800">{selectedAttendanceRecord.recordedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5">
          <h6 className="text-sm font-bold text-slate-800 mb-2">Remarks</h6>
          <p className="text-sm text-slate-600 bg-white border border-slate-100 rounded-xl p-3">
            {selectedAttendanceRecord.remarks || 'No remarks provided'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowAttendanceHistoryModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceDetailsModal;
