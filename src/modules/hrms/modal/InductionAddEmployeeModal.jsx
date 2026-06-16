import React from 'react';
import Modal from '../../../shared/components/Modal';

const InductionAddEmployeeModal = ({
  showAddEmployeeModal,
  setShowAddEmployeeModal,
  employeeForm,
  setEmployeeForm,
  handleAddEmployee,
  inductionPrograms
}) => {
  return (
    <Modal
      isOpen={showAddEmployeeModal}
      onClose={() => setShowAddEmployeeModal(false)}
      title="Add New Employee"
      size="xl"
    >
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Employee Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={employeeForm.name}
              onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
              required
              placeholder="e.g., John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Employee ID <span className="text-rose-500">*</span></label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={employeeForm.employeeId}
              onChange={(e) => setEmployeeForm({...employeeForm, employeeId: e.target.value})}
              required
              placeholder="e.g., EMP001"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email <span className="text-rose-500">*</span></label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={employeeForm.email}
              onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
              required
              placeholder="e.g., john.doe@company.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={employeeForm.phone}
              onChange={(e) => setEmployeeForm({...employeeForm, phone: e.target.value})}
              placeholder="e.g., +91 9876543210"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Department <span className="text-rose-500">*</span></label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={employeeForm.department}
              onChange={(e) => setEmployeeForm({...employeeForm, department: e.target.value})}
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
              value={employeeForm.designation}
              onChange={(e) => setEmployeeForm({...employeeForm, designation: e.target.value})}
              placeholder="e.g., Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Joining Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              value={employeeForm.joiningDate}
              onChange={(e) => setEmployeeForm({...employeeForm, joiningDate: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Assign to Program</label>
            <select
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-white"
              value={employeeForm.programAssigned || ''}
              onChange={(e) => setEmployeeForm({...employeeForm, programAssigned: e.target.value ? parseInt(e.target.value) : null})}
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

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
            onClick={() => setShowAddEmployeeModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2.5 bg-blue-550 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            onClick={handleAddEmployee}
            disabled={!employeeForm.name || !employeeForm.email || !employeeForm.employeeId}
          >
            Add Employee
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InductionAddEmployeeModal;
