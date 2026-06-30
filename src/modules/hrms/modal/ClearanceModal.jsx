import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ClearanceModal = ({ isOpen, onClose, caseData = null, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('IT');

  const departments = [
    { id: 'IT', label: 'IT Assets', icon: 'heroicons:computer-desktop' },
    { id: 'Admin', label: 'Admin/Facilities', icon: 'heroicons:building-office' },
    { id: 'Finance', label: 'Finance', icon: 'heroicons:currency-rupee' },
    { id: 'HR', label: 'HR', icon: 'heroicons:users' },
    { id: 'Department', label: 'Department', icon: 'heroicons:briefcase' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ caseId: caseData?.id, clearedDepartment: activeTab });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Process Department Clearances" size="lg">
      <div className="flex flex-col md:flex-row h-full">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-48 border-r border-slate-100 flex flex-col gap-1 pr-4 py-2">
          {departments.map(dept => (
            <button
              key={dept.id}
              onClick={() => setActiveTab(dept.id)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === dept.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon icon={dept.icon} className="w-4 h-4" />
              {dept.label}
              {caseData?.pendingClearances?.includes(dept.id) && (
                <span className="w-2 h-2 rounded-full bg-amber-500 ml-auto"></span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 pl-0 md:pl-6 py-2">
          {caseData && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-6 flex justify-between items-center">
              <div>
                <h6 className="font-semibold text-slate-800 text-sm">{caseData.employeeName}</h6>
                <div className="text-xs text-slate-500">{caseData.employeeId} • {caseData.department}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-700">Clearance Progress</div>
                <div className="text-sm font-bold text-blue-600">{caseData.clearanceProgress || 0}%</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <h4 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">{activeTab} Clearance Checklist</h4>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-slate-700">All applicable physical assets returned</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-slate-700">Access revoked / Credentials disabled</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-slate-700">No pending dues or outstandings</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Clearance Remarks</label>
              <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Add any necessary remarks for this department..."></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition" onClick={onClose}>Close</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition flex items-center gap-2">
                <Icon icon="heroicons:check-badge" className="w-4 h-4" /> Approve {activeTab} Clearance
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ClearanceModal;
