import React from 'react';
import Modal from '../../../shared/components/Modal';

const InductionEditEmployeeModal = ({
  showEditEmployeeModal,
  setShowEditEmployeeModal,
  editingEmployee,
  setEditingEmployee,
  handleEditEmployee,
  inductionPrograms
}) => {
  if (!editingEmployee) return null;

  return (
    <Modal
      isOpen={showEditEmployeeModal}
      onClose={() => setShowEditEmployeeModal(false)}
      title="Edit Employee"
      size="xl"
    >
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Employee Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={editingEmployee.name}
              onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Employee ID <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={editingEmployee.employeeId}
              onChange={(e) => setEditingEmployee({...editingEmployee, employeeId: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email <span className="text-rose-500">*</span></label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={editingEmployee.email}
              onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={editingEmployee.phone}
              onChange={(e) => setEditingEmployee({...editingEmployee, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Department <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={editingEmployee.department}
              onChange={(e) => setEditingEmployee({...editingEmployee, department: e.target.value})}
            >
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Designation</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={editingEmployee.designation}
              onChange={(e) => setEditingEmployee({...editingEmployee, designation: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Joining Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={editingEmployee.joiningDate}
              onChange={(e) => setEditingEmployee({...editingEmployee, joiningDate: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Assign to Program</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={editingEmployee.programAssigned || ''}
              onChange={(e) => setEditingEmployee({...editingEmployee, programAssigned: e.target.value ? parseInt(e.target.value) : null})}
            >
              <option value="">Not Assigned</option>
              {inductionPrograms.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Attendance Status</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={editingEmployee.attendanceStatus}
              onChange={(e) => setEditingEmployee({...editingEmployee, attendanceStatus: e.target.value})}
            >
              <option value="not_started">Not Marked</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={editingEmployee.status || 'Active'}
              onChange={(e) => setEditingEmployee({...editingEmployee, status: e.target.value})}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowEditEmployeeModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            onClick={handleEditEmployee}
            disabled={!editingEmployee.name || !editingEmployee.email || !editingEmployee.employeeId}
          >
            Update Employee
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InductionEditEmployeeModal;
