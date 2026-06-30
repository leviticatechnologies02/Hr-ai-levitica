import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import ResignationModal from '../modal/ResignationModal';
import BuyoutModal from '../modal/BuyoutModal';
import WaiverModal from '../modal/WaiverModal';
import DeleteModal from '../modal/DeleteModal';

const NoticePeriodTracking = () => {
  const [activeSection, setActiveSection] = useState('cases');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Core Data States
  const [noticePeriodCases, setNoticePeriodCases] = useState([]);
  const [buyoutRequests, setBuyoutRequests] = useState([]);
  const [waiverRequests, setWaiverRequests] = useState([]);
  const [counterOffers, setCounterOffers] = useState([]);
  const [extensionRequests, setExtensionRequests] = useState([]);

  // Modal States
  const [modalState, setModalState] = useState({ type: null, isOpen: false, data: null });
  const openModal = (type, data = null) => setModalState({ type, isOpen: true, data });
  const closeModal = () => setModalState({ type: null, isOpen: false, data: null });

  const showNotification = (message, type = 'success') => toast[type](message, { position: 'top-right' });

  useEffect(() => {
    // TODO: Fetch actual data from backend API for NoticePeriodTracking
    // assetsAPI.listResignations(), assetsAPI.listBuyouts(), etc.
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const filteredCases = noticePeriodCases.filter(c =>
    (c.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskBadge = (daysRemaining) => {
    if (daysRemaining <= 7) return <span className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-medium">High Risk ({daysRemaining}d)</span>;
    if (daysRemaining <= 14) return <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">Medium Risk ({daysRemaining}d)</span>;
    return <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">On Track ({daysRemaining}d)</span>;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">Active</span>;
      case 'Completed': return <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">Completed</span>;
      case 'Pending': return <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">Pending</span>;
      case 'Approved': return <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">Approved</span>;
      default: return <span className="px-2 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const tabs = [
    { id: 'cases', label: 'All Cases', icon: 'heroicons:users' },
    { id: 'buyout', label: 'Buyout Requests', icon: 'heroicons:currency-rupee' },
    { id: 'waiver', label: 'Waiver Requests', icon: 'heroicons:document-minus' },
    { id: 'extension', label: 'Extensions', icon: 'heroicons:calendar-days' },
    { id: 'counter', label: 'Counter Offers', icon: 'heroicons:arrow-path-rounded-square' }
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <Icon icon="heroicons:arrow-right-on-rectangle" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notice Period & Offboarding</h1>
            <p className="text-sm text-slate-500">Track resignations, buyouts, and exit clearances</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-slate-50 transition">
            <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" /> Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-700 transition" onClick={() => openModal('resignation')}>
            <Icon icon="heroicons:plus" className="w-4 h-4" /> Initiate Resignation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Active Resignations" value={noticePeriodCases.filter(c => c.status === 'Active').length} subtitle="Currently serving notice" icon="heroicons:user-minus" color="blue" />
        <StatCard title="Pending Buyouts" value={buyoutRequests.filter(r => r.status === 'Pending').length} subtitle="Requires HR approval" icon="heroicons:currency-rupee" color="orange" />
        <StatCard title="Pending Waivers" value={waiverRequests.filter(r => r.status === 'Pending').length} subtitle="Pending manager approval" icon="heroicons:document-minus" color="red" />
        <StatCard title="Retention Rate" value="0%" subtitle="Counter offers accepted" icon="heroicons:arrow-trending-up" color="green" />
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

      {!loading && activeSection === 'cases' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600">Employee Details</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Resignation Date</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Expected LWD</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Risk Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.length === 0 ? (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">No active resignation cases found.</td></tr>
                ) : (
                  filteredCases.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{c.employeeName}</div>
                        <div className="text-xs text-slate-500">{c.employeeId} • {c.department}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c.resignationDate}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{c.lastWorkingDay}</td>
                      <td className="px-4 py-3">{getRiskBadge(c.daysRemaining)}</td>
                      <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg" title="Edit/View" onClick={() => openModal('resignation', c)}><Icon icon="heroicons:pencil-square" /></button>
                          <button className="p-1.5 bg-amber-50 text-amber-600 rounded-lg" title="Process Buyout" onClick={() => openModal('buyout', c)}><Icon icon="heroicons:currency-rupee" /></button>
                          <button className="p-1.5 bg-rose-50 text-rose-600 rounded-lg" title="Process Waiver" onClick={() => openModal('waiver', c)}><Icon icon="heroicons:document-minus" /></button>
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

      {!loading && activeSection !== 'cases' && (
        <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Icon icon="heroicons:inbox" className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="font-medium text-slate-800 mb-1">No {tabs.find(t => t.id === activeSection)?.label} found</h3>
          <p className="text-sm">There are currently no records in this category.</p>
        </div>
      )}

      {/* Modals */}
      <ResignationModal isOpen={modalState.isOpen && modalState.type === 'resignation'} onClose={closeModal} employeeData={modalState.data} onSubmit={(data) => {
        showNotification('Resignation processed successfully');
        closeModal();
      }} />

      <BuyoutModal isOpen={modalState.isOpen && modalState.type === 'buyout'} onClose={closeModal} caseData={modalState.data} onSubmit={(data) => {
        showNotification('Buyout request submitted for approval');
        closeModal();
      }} />

      <WaiverModal isOpen={modalState.isOpen && modalState.type === 'waiver'} onClose={closeModal} caseData={modalState.data} onSubmit={(data) => {
        showNotification('Waiver request submitted for approval');
        closeModal();
      }} />

      <ToastContainer />
    </div>
  );
};

export default NoticePeriodTracking;