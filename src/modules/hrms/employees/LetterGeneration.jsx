import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import LetterModal from '../modal/LetterModal';
import EmailModal from '../modal/EmailModal';
import ViewModal from '../modal/ViewModal';
import BulkV2Modal from '../modal/BulkV2Modal';

const LetterGeneration = () => {
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const [filters, setFilters] = useState({
    search: '',
    type: 'All',
    status: 'All'
  });

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    setIsLoading(true);
    // TODO: Fetch letters data from API
    setLetters([]);
    setIsLoading(false);
  }, []);

  const openModal = (type, data = null) => {
    setModalState({ type, isOpen: true, data });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false, data: null });
  };

  const showNotification = (message, type = 'success') => {
    toast[type](message, { position: 'top-right', autoClose: 3000 });
  };

  const kpis = useMemo(() => {
    const total = letters.length;
    const pending = letters.filter(l => l.status === 'Draft' || l.status === 'Pending').length;
    const sent = letters.filter(l => l.status === 'Sent').length;
    const signed = letters.filter(l => l.status === 'Signed').length;

    return { total, pending, sent, signed };
  }, [letters]);

  const filteredData = useMemo(() => {
    let filtered = letters;

    if (activeTab !== 'all') {
      const statusMap = { 'drafts': 'Draft', 'sent': 'Sent', 'signed': 'Signed' };
      if (statusMap[activeTab]) {
        filtered = filtered.filter(l => l.status === statusMap[activeTab]);
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(l =>
        l.employeeName?.toLowerCase().includes(searchLower) ||
        l.employeeId?.toLowerCase().includes(searchLower) ||
        l.letterType?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type !== 'All') {
      filtered = filtered.filter(l => l.letterType === filters.type);
    }

    if (filters.status !== 'All') {
      filtered = filtered.filter(l => l.status === filters.status);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === 'date') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [letters, activeTab, filters, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(l => l.id));
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Draft</span>;
      case 'Pending': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'Sent': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Sent</span>;
      case 'Signed': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Signed</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">{status}</span>;
    }
  };

  const EmployeeAvatar = ({ name, size = 'sm' }) => {
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';
    const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
    return (
      <div className={`${sizeClass} bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>
        {initials}
      </div>
    );
  };

  const renderStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard title="Total Generated" value={kpis.total} subtitle="All time" icon="heroicons:document-duplicate" color="blue" />
      <StatCard title="Pending" value={kpis.pending} subtitle="Drafts / Unsent" icon="heroicons:clock" color="orange" />
      <StatCard title="Sent" value={kpis.sent} subtitle="Awaiting signature" icon="heroicons:paper-airplane" color="purple" />
      <StatCard title="Signed" value={kpis.signed} subtitle="Successfully signed" icon="heroicons:check-badge" color="green" />
    </div>
  );

  const renderTabs = () => (
    <div className="flex flex-wrap gap-1 mb-6 border-b border-slate-200">
      {[
        { id: 'all', label: 'All Letters', icon: 'heroicons:document-text', count: kpis.total },
        { id: 'drafts', label: 'Drafts', icon: 'heroicons:pencil-square', count: kpis.pending },
        { id: 'sent', label: 'Sent', icon: 'heroicons:paper-airplane', count: kpis.sent },
        { id: 'signed', label: 'Signed', icon: 'heroicons:check-badge', count: kpis.signed }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <Icon icon={tab.icon} className="w-4 h-4" />
          {tab.label}
          <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search employee or letter type..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="All">All Types</option>
          <option value="Offer Letter">Offer Letter</option>
          <option value="Confirmation Letter">Confirmation Letter</option>
          <option value="Promotion Letter">Promotion Letter</option>
          <option value="Warning Letter">Warning Letter</option>
          <option value="Relieving Letter">Relieving Letter</option>
        </select>
        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="All">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Pending">Pending</option>
          <option value="Sent">Sent</option>
          <option value="Signed">Signed</option>
        </select>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3 flex justify-between items-center">
        <h5 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:document-duplicate" className="w-5 h-5 text-indigo-500" />
          Letters Directory
        </h5>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
            onClick={() => openModal('bulk')}
            disabled={selectedRows.length === 0}
          >
            <Icon icon="heroicons:bars-3-bottom-left" className="w-4 h-4" /> Bulk Actions
          </button>
          <button
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={() => openModal('letter', { letterType: 'Offer Letter', name: 'New Employee', employeeId: 'TBD' })}
          >
            <Icon icon="heroicons:plus" className="w-4 h-4" /> Generate Letter
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('employeeName')}>Employee</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('letterType')}>Letter Type</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('date')}>Generation Date</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('status')}>Status</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Icon icon="heroicons:document-magnifying-glass" className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <h6 className="text-slate-600 font-medium">No letters found</h6>
                  <p className="text-sm text-slate-400">Generate a new letter or adjust your filters</p>
                </td>
              </tr>
            ) : (
              paginatedData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <EmployeeAvatar name={item.employeeName} />
                      <div>
                        <div className="font-medium text-slate-800">{item.employeeName}</div>
                        <div className="text-xs text-slate-500">{item.employeeId} • {item.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{item.letterType}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(item.date)}</td>
                  <td className="px-4 py-3 text-center">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition" title="View" onClick={() => openModal('view', item)}>
                        <Icon icon="heroicons:eye" className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition" title="Send Email" onClick={() => openModal('email', item)}>
                        <Icon icon="heroicons:envelope" className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition" title="Download">
                        <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition" title="Delete">
                        <Icon icon="heroicons:trash" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="border-t border-slate-200 px-4 py-3 flex justify-between items-center">
          <div className="text-sm text-slate-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-xl">
            <Icon icon="heroicons:document-text" className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Letter Generation</h1>
            <p className="text-sm text-slate-500">Generate, manage, and dispatch official HR letters</p>
          </div>
        </div>
      </div>

      {renderStats()}
      {renderTabs()}
      {renderFilters()}
      {renderTable()}

      <LetterModal
        isOpen={modalState.isOpen && modalState.type === 'letter'}
        onClose={closeModal}
        onGenerate={() => {
          showNotification('Letter generated successfully!');
          closeModal();
        }}
        employee={modalState.data}
        formatDate={formatDate}
        letterType={modalState.data?.letterType || 'Offer Letter'}
      />

      <EmailModal
        isOpen={modalState.isOpen && modalState.type === 'email'}
        onClose={closeModal}
        onSendEmail={() => {
          showNotification('Email sent to employee!');
          closeModal();
        }}
        selectedEmployee={modalState.data}
        employee={modalState.data}
      />

      <ViewModal
        isOpen={modalState.isOpen && modalState.type === 'view'}
        onClose={closeModal}
        employee={modalState.data}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
      />

      <BulkV2Modal
        isOpen={modalState.isOpen && modalState.type === 'bulk'}
        onClose={closeModal}
        onSubmit={() => {
          showNotification('Bulk action applied!');
          setSelectedRows([]);
          closeModal();
        }}
        selectedCount={selectedRows.length}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} className="text-xs sm:text-sm" toastClassName="rounded-xl shadow-lg" />
    </div>
  );
};

export default LetterGeneration;
