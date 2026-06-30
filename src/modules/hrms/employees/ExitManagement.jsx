import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import ExitModal from '../modal/ExitModal';
import ClearanceModal from '../modal/ClearanceModal';
import SettlementModal from '../modal/SettlementModal';

const ExitManagement = () => {
  const [activeSection, setActiveSection] = useState('exitCases');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Data States
  const [exitCasesData, setExitCasesData] = useState([]);
  const [alumniNetwork, setAlumniNetwork] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [employeeExitsData, setEmployeeExitsData] = useState([]);

  // Modal States
  const [modalState, setModalState] = useState({ type: null, isOpen: false, data: null });
  const openModal = (type, data = null) => setModalState({ type, isOpen: true, data });
  const closeModal = () => setModalState({ type: null, isOpen: false, data: null });

  const showNotification = (message, type = 'success') => toast[type](message, { position: 'top-right' });

  useEffect(() => {
    // TODO: Fetch actual data from backend API for ExitManagement
    // exitAPI.listExits(), exitAPI.listAlumni(), exitAPI.listSettlements(), etc.
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const tabs = [
    { id: 'exitCases', label: 'Active Exit Cases', icon: 'heroicons:arrow-right-on-rectangle' },
    { id: 'settlements', label: 'F&F Settlements', icon: 'heroicons:banknotes' },
    { id: 'alumni', label: 'Alumni Network', icon: 'heroicons:user-group' },
    { id: 'employeeExits', label: 'Exit Reports', icon: 'heroicons:chart-bar-square' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress': return <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">In Progress</span>;
      case 'Completed': return <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">Completed</span>;
      case 'Pending': return <span className="px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-medium">Pending</span>;
      case 'Escalated': return <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">Escalated</span>;
      default: return <span className="px-2 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const filteredExits = exitCasesData.filter(c =>
    (c.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSettlements = settlements.filter(c =>
    (c.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlumni = alumniNetwork.filter(c =>
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Icon icon="heroicons:arrow-right-on-rectangle" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Exit Management</h1>
            <p className="text-sm text-slate-500">Manage employee offboarding, clearances, and settlements</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-slate-50 transition">
            <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" /> Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition" onClick={() => openModal('exit')}>
            <Icon icon="heroicons:plus" className="w-4 h-4" /> New Exit Case
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Exits" value={exitCasesData.filter(c => c.status !== 'Completed').length} subtitle="Offboarding in progress" icon="heroicons:arrow-right-on-rectangle" color="blue" />
        <StatCard title="Pending Clearance" value={exitCasesData.filter(c => c.clearanceProgress < 100).length} subtitle="Awaiting department sign-offs" icon="heroicons:check-circle" color="orange" />
        <StatCard title="Pending Settlements" value={settlements.filter(s => s.status !== 'Completed').length} subtitle="F&F not disbursed" icon="heroicons:banknotes" color="red" />
        <StatCard title="Total Alumni" value={alumniNetwork.length} subtitle="Exited employees network" icon="heroicons:users" color="green" />
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveSection(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeSection === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <Icon icon={tab.icon} className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-6">
        <div className="relative w-full md:w-96">
          <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search employees by name or ID..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {loading && <div className="p-8 text-center text-slate-500"><Icon icon="heroicons:arrow-path" className="w-8 h-8 animate-spin mx-auto mb-2" /> Loading records...</div>}

      {!loading && activeSection === 'exitCases' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600">Employee Details</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Dates</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Exit Type</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Clearance</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExits.length === 0 ? (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">No active exit cases found.</td></tr>
                ) : (
                  filteredExits.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{c.employeeName}</div>
                        <div className="text-xs text-slate-500">{c.employeeId} • {c.department}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div><span className="text-slate-500">LWD:</span> {c.lastWorkingDay}</div>
                        <div><span className="text-slate-500">Resigned:</span> {c.resignationDate}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">{c.exitType}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full w-24 overflow-hidden">
                            <div className={`h-full ${c.clearanceProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${c.clearanceProgress || 0}%` }}></div>
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{c.clearanceProgress || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg" title="Edit Case" onClick={() => openModal('exit', c)}><Icon icon="heroicons:pencil-square" /></button>
                          <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg" title="Process Clearance" onClick={() => openModal('clearance', c)}><Icon icon="heroicons:check-circle" /></button>
                          <button className="p-1.5 bg-purple-50 text-purple-600 rounded-lg" title="Process Settlement" onClick={() => openModal('settlement', c)}><Icon icon="heroicons:banknotes" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && activeSection === 'settlements' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Employee Details</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Payment Date</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Net Amount</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Approval</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSettlements.length === 0 ? (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">No settlements found.</td></tr>
              ) : (
                filteredSettlements.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{s.employeeName}</div>
                      <div className="text-xs text-slate-500">{s.employeeId} • {s.department}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.paymentDate || 'Pending'}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">{s.netAmount}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{s.approvalStatus}</td>
                    <td className="px-4 py-3">{getStatusBadge(s.status)}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg" title="View Settlement" onClick={() => openModal('settlement', s)}><Icon icon="heroicons:eye" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeSection === 'alumni' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Alumni Details</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Last Role</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Exit Date</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Rehire Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlumni.length === 0 ? (
                <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">No alumni found.</td></tr>
              ) : (
                filteredAlumni.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{a.name}</div>
                      <div className="text-xs text-slate-500">{a.alumniId}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{a.lastRole} • {a.department}</td>
                    <td className="px-4 py-3 text-slate-600">{a.exitDate}</td>
                    <td className="px-4 py-3">{a.rehireEligibility === 'Eligible' ? <span className="text-green-600 font-medium">Eligible</span> : <span className="text-red-600 font-medium">Not Eligible</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <ExitModal isOpen={modalState.isOpen && modalState.type === 'exit'} onClose={closeModal} caseData={modalState.data} onSubmit={(data) => {
        showNotification(data.id ? 'Exit Case updated successfully' : 'Exit Case initiated successfully');
        closeModal();
      }} />

      <ClearanceModal isOpen={modalState.isOpen && modalState.type === 'clearance'} onClose={closeModal} caseData={modalState.data} onSubmit={(data) => {
        showNotification(`${data.clearedDepartment} Clearance processed successfully`);
        closeModal();
      }} />

      <SettlementModal isOpen={modalState.isOpen && modalState.type === 'settlement'} onClose={closeModal} caseData={modalState.data} onSubmit={(data) => {
        showNotification('Settlement details saved successfully');
        closeModal();
      }} />

      <ToastContainer />
    </div>
  );
};

export default ExitManagement;