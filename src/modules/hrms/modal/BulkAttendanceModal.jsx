import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BulkAttendanceModal = ({
  showBulkAttendanceModal,
  setShowBulkAttendanceModal,
  selectedEmployees,
  setSelectedEmployees,
  employees,
  setEmployees,
  attendanceDate,
  setAttendanceDate,
  selectedProgramForAttendance,
  setSelectedProgramForAttendance,
  inductionPrograms,
  setInductionPrograms,
  userInfo,
  setGlobalAttendanceRecords
}) => {
  const [localRecords, setLocalRecords] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Initialize attendance records when modal opens
  useEffect(() => {
    if (selectedEmployees.length > 0) {
      const initialRecords = selectedEmployees.map(empId => {
        const employee = employees.find(e => e.id === empId);
        return {
          employeeId: empId,
          name: employee?.name || 'Unknown',
          employeeCode: employee?.employeeId || '',
          department: employee?.department || '',
          status: employee?.attendanceStatus || 'present',
          remarks: '',
          checkInTime: '09:00',
          checkOutTime: '17:00'
        };
      });
      setLocalRecords(initialRecords);
      
      // Set default date to today
      if (!attendanceDate) {
        setAttendanceDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [selectedEmployees]);

  // Handle attendance status change for a specific employee
  const handleAttendanceChange = (empId, field, value) => {
    setLocalRecords(prev => 
      prev.map(record => 
        record.employeeId === empId 
          ? { 
              ...record, 
              [field]: value,
              // Auto-update times based on status
              ...(field === 'status' ? { 
                checkInTime: value === 'present' ? '09:00' : '',
                checkOutTime: value === 'present' ? '17:00' : ''
              } : {})
            }
          : record
      )
    );
  };

  // Handle bulk status change for all selected employees
  const handleBulkStatusChange = (status) => {
    setLocalRecords(prev => 
      prev.map(record => ({
        ...record,
        status: status,
        checkInTime: status === 'present' || status === 'late' ? '09:00' : '',
        checkOutTime: status === 'present' || status === 'late' ? '17:00' : ''
      }))
    );
    setIsDropdownOpen(false);
  };

  // Handle Save Attendance
  const handleSaveAttendance = () => {
    if (localRecords.length === 0) {
      alert('Please select at least one employee');
      return;
    }

    if (!attendanceDate) {
      alert('Please select attendance date');
      return;
    }

    if (!selectedProgramForAttendance) {
      alert('Please select a program');
      return;
    }

    setIsSaving(true);

    // Create new attendance records
    const newAttendanceData = localRecords.map(record => {
      const employee = employees.find(e => e.id === record.employeeId);
      return {
        id: Date.now() + record.employeeId,
        employeeId: employee.employeeId,
        employeeName: employee.name,
        department: employee.department,
        programId: selectedProgramForAttendance.id,
        programName: selectedProgramForAttendance.name,
        sessionDate: attendanceDate,
        status: record.status,
        checkInTime: record.checkInTime,
        checkOutTime: record.checkOutTime,
        remarks: record.remarks,
        recordedBy: userInfo?.name || 'System Admin',
        recordedAt: new Date().toISOString()
      };
    });

    // Update employee's program assignment in main employees array
    setEmployees(prev => 
      prev.map(employee => {
        const attendanceRecord = localRecords.find(r => r.employeeId === employee.id);
        if (attendanceRecord) {
          return {
            ...employee,
            programAssigned: selectedProgramForAttendance.id,
            attendanceStatus: attendanceRecord.status,
            lastAttendanceDate: attendanceDate,
            assignedProgramName: selectedProgramForAttendance.name
          };
        }
        return employee;
      })
    );

    // Update program statistics
    setInductionPrograms(prev => prev.map(program => {
      if (program.id === selectedProgramForAttendance.id) {
        const newlyAssignedCount = localRecords.filter(record => {
          const employee = employees.find(e => e.id === record.employeeId);
          return employee && employee.programAssigned !== selectedProgramForAttendance.id;
        }).length;

        const presentCount = localRecords.filter(r => r.status === 'present').length;
        const absentCount = localRecords.filter(r => r.status === 'absent').length;
        const lateCount = localRecords.filter(r => r.status === 'late').length;
        const total = localRecords.length;
        
        const newAttendanceRate = total > 0 ? ((presentCount + lateCount) / total) * 100 : 0;
        const newConfirmedParticipants = (program.confirmedParticipants || 0) + presentCount + lateCount;
        const newTotalParticipants = (program.totalParticipants || 0) + newlyAssignedCount;

        return {
          ...program,
          totalParticipants: newTotalParticipants,
          confirmedParticipants: newConfirmedParticipants,
          attendanceRate: Math.round(newAttendanceRate * 10) / 10,
          attendanceStats: {
            present: (program.attendanceStats?.present || 0) + presentCount,
            absent: (program.attendanceStats?.absent || 0) + absentCount,
            late: (program.attendanceStats?.late || 0) + lateCount,
            total: (program.attendanceStats?.total || 0) + total
          },
          participants: [
            ...(program.participants || []),
            ...localRecords.map(record => {
              const employee = employees.find(e => e.id === record.employeeId);
              return {
                employeeId: employee.employeeId,
                employeeName: employee.name,
                department: employee.department,
                assignedDate: new Date().toISOString().split('T')[0],
                attendanceStatus: record.status
              };
            }).filter(emp => 
              !program.participants?.some(p => p.employeeId === emp.employeeId)
            )
          ]
        };
      }
      return program;
    }));

    // Add to global attendance records
    setGlobalAttendanceRecords(prev => [...prev, ...newAttendanceData]);

    // Show success message
    setTimeout(() => {
      setIsSaving(false);
      setSelectedEmployees([]);
      setLocalRecords([]);
      setAttendanceDate('');
      setSelectedProgramForAttendance(null);
      setShowBulkAttendanceModal(false);
    }, 1000);
  };

  return (
    <Modal
      isOpen={showBulkAttendanceModal}
      onClose={() => {
        setShowBulkAttendanceModal(false);
        setSelectedEmployees([]);
        setLocalRecords([]);
      }}
      title="Bulk Attendance Management"
      size="xl"
    >
      <div className="space-y-6 p-4">
        {/* Summary Alert */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex gap-2.5 items-start">
            <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-sm font-semibold text-blue-800">
                Mark attendance for {selectedEmployees.length} selected employees.
              </span>
              {selectedProgramForAttendance && (
                <p className="text-xs text-blue-600 mt-0.5">
                  This will also assign selected employees to the chosen program.
                </p>
              )}
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200">
            <Icon icon="heroicons:calendar" className="w-3.5 h-3.5 text-slate-400" />
            {attendanceDate || 'Select date'}
          </span>
        </div>

        {/* Program and Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Program <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={selectedProgramForAttendance?.id || ''}
              onChange={(e) => {
                const programId = parseInt(e.target.value);
                const program = inductionPrograms.find(p => p.id === programId);
                setSelectedProgramForAttendance(program);
              }}
              required
            >
              <option value="">Choose program...</option>
              {inductionPrograms.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Attendance Date <span className="text-rose-500">*</span></label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-700">Mark All:</span>
            <div className="relative">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={localRecords.length === 0}
              >
                Select Status
                <Icon icon="heroicons:chevron-down" className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-slate-100">
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-all flex items-center gap-1.5"
                    onClick={() => handleBulkStatusChange('present')}
                  >
                    <Icon icon="heroicons:check-circle" className="w-4 h-4" /> Present
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-1.5"
                    onClick={() => handleBulkStatusChange('absent')}
                  >
                    <Icon icon="heroicons:x-circle" className="w-4 h-4" /> Absent
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-amber-600 hover:bg-amber-50 transition-all flex items-center gap-1.5"
                    onClick={() => handleBulkStatusChange('late')}
                  >
                    <Icon icon="heroicons:clock" className="w-4 h-4" /> Late
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-cyan-600 hover:bg-cyan-50 transition-all flex items-center gap-1.5"
                    onClick={() => handleBulkStatusChange('half_day')}
                  >
                    <Icon icon="heroicons:arrow-path" className="w-4 h-4" /> Half Day
                  </button>
                </div>
              )}
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Icon icon="heroicons:users" className="w-3.5 h-3.5" />
            {localRecords.length} employees selected
          </span>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-3xl">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Employee</th>
                <th className="px-5 py-3.5">Current Program</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100 text-sm">
              {localRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-400">
                    <Icon icon="heroicons:users" className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 mb-1">No employees selected</p>
                    <small className="text-slate-400">Select employees from the Employees Table first</small>
                  </td>
                </tr>
              ) : (
                localRecords.map((record) => {
                  const employee = employees.find(e => e.id === record.employeeId);
                  const currentProgram = employee?.programAssigned ? 
                    inductionPrograms.find(p => p.id === employee.programAssigned) : null;
                  
                  return (
                    <tr key={record.employeeId} className="text-slate-700">
                      <td className="px-5 py-3">
                        <div className="font-bold text-slate-800">{record.name}</div>
                        <small className="text-xs text-slate-400 block font-medium">ID: {record.employeeCode}</small>
                      </td>
                      <td className="px-5 py-3">
                        {currentProgram ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-600 border border-cyan-100">
                              {currentProgram.name}
                            </span>
                            <div className="text-[11px] text-slate-400 font-medium">
                              {selectedProgramForAttendance?.id === currentProgram.id ? 
                                '✓ Will remain assigned' : 
                                `→ Will change to: ${selectedProgramForAttendance?.name || 'New Program'}`
                              }
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Not Assigned</span>
                            <div className="text-[11px] text-emerald-600 font-medium">
                              ✓ Will be assigned to {selectedProgramForAttendance?.name || 'selected program'}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-600">{record.department}</td>
                      <td className="px-5 py-3">
                        <select
                          className={`px-3 py-1.5 border rounded-xl text-xs font-bold bg-white focus:outline-none ${
                            record.status === 'present' ? 'border-emerald-200 text-emerald-600' :
                            record.status === 'absent' ? 'border-rose-200 text-rose-600' :
                            record.status === 'late' ? 'border-amber-200 text-amber-600' :
                            record.status === 'half_day' ? 'border-cyan-200 text-cyan-600' : 'border-slate-200 text-slate-600'
                          }`}
                          value={record.status}
                          onChange={(e) => handleAttendanceChange(record.employeeId, 'status', e.target.value)}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="half_day">Half Day</option>
                          <option value="on_leave">On Leave</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1 items-center max-w-[150px]">
                          <input
                            type="time"
                            className="w-16 px-1.5 py-1 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                            value={record.checkInTime}
                            onChange={(e) => handleAttendanceChange(record.employeeId, 'checkInTime', e.target.value)}
                            disabled={record.status === 'absent' || record.status === 'on_leave'}
                          />
                          <span className="text-slate-300">-</span>
                          <input
                            type="time"
                            className="w-16 px-1.5 py-1 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                            value={record.checkOutTime}
                            onChange={(e) => handleAttendanceChange(record.employeeId, 'checkOutTime', e.target.value)}
                            disabled={record.status === 'absent' || record.status === 'on_leave'}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                          value={record.remarks}
                          onChange={(e) => handleAttendanceChange(record.employeeId, 'remarks', e.target.value)}
                          placeholder="Add remarks..."
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {localRecords.length > 0 && (
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan="6" className="px-5 py-3">
                    <div className="flex flex-wrap gap-3 justify-center text-xs font-bold">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {localRecords.length} Total
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {localRecords.filter(r => r.status === 'present').length} Present
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700">
                        {localRecords.filter(r => r.status === 'absent').length} Absent
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                        {localRecords.filter(r => r.status === 'late').length} Late
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700">
                        {localRecords.filter(r => r.status === 'half_day').length} Half Day
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button 
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            onClick={() => {
              setShowBulkAttendanceModal(false);
              setSelectedEmployees([]);
              setLocalRecords([]);
            }}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
            onClick={handleSaveAttendance}
            disabled={
              isSaving || 
              localRecords.length === 0 || 
              !attendanceDate || 
              !selectedProgramForAttendance
            }
          >
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkAttendanceModal;
