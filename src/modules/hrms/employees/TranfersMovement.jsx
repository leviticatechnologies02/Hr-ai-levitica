import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import BulkV2Modal from '../modal/BulkV2Modal';
import NoteModal from '../modal/NoteModal';
import ViewModal from '../modal/ViewModal';
import EmailModal from '../modal/EmailModal';
import TransferModal from '../modal/TransferModal';

const TransferMovement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    department: 'All',
    location: 'All',
    type: 'All'
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const [transferRequests, setTransferRequests] = useState([]);

  const openModal = (type, data = null) => {
    setModalState({ type, isOpen: true, data });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false, data: null });
  };

  const showNotification = (message, type = 'success') => {
    const options = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      default:
        toast(message, options);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Approved': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Rejected': 'bg-rose-50 text-rose-700 border border-rose-200',
      'Completed': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Cancelled': 'bg-slate-50 text-slate-700 border border-slate-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status || 'N/A'}
      </span>
    );
  };

  const EmployeeAvatar = ({ name, size = 'sm' }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';

    return (
      <div className={`${sizeClass} bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>
        {initials}
      </div>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    setTransferRequests([]);
    setIsLoading(false);
  }, []);

  const kpis = useMemo(() => {
    const total = transferRequests.length;
    const pending = transferRequests.filter(e => e.status === 'Pending').length;
    const approved = transferRequests.filter(e => e.status === 'Approved' || e.status === 'Completed').length;
    const rejected = transferRequests.filter(e => e.status === 'Rejected').length;

    return {
      total,
      pending,
      approved,
      rejected,
      approvalRate: total > 0 ? ((approved / total) * 100).toFixed(0) : 0,
      avgProcessing: 12
    };
  }, [transferRequests]);

  const filteredData = useMemo(() => {
    let filtered = transferRequests;

    if (activeTab !== 'all') {
      const typeMap = {
        'internal': 'Internal Transfer',
        'location': 'Location Transfer',
        'promotion': 'Promotion Transfer',
        'department': 'Department Transfer'
      };
      if (typeMap[activeTab]) {
        filtered = filtered.filter(emp => emp.requestType === typeMap[activeTab]);
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.employeeName?.toLowerCase().includes(searchLower) ||
        emp.employeeId?.toLowerCase().includes(searchLower) ||
        emp.designation?.toLowerCase().includes(searchLower) ||
        emp.currentDepartment?.toLowerCase().includes(searchLower) ||
        emp.newDepartment?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.department !== 'All') {
      filtered = filtered.filter(emp => emp.currentDepartment === filters.department || emp.newDepartment === filters.department);
    }

    if (filters.location !== 'All') {
      filtered = filtered.filter(emp => emp.currentLocation === filters.location || emp.newLocation === filters.location);
    }

    if (filters.status !== 'All') {
      filtered = filtered.filter(emp => emp.status === filters.status);
    }

    if (filters.type !== 'All') {
      filtered = filtered.filter(emp => emp.requestType === filters.type);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [activeTab, transferRequests, filters, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(emp => emp.id));
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <StatCard
        title="Total Transfers"
        value={kpis.total}
        subtitle="All requests"
        icon="heroicons:arrows-right-left"
        color="blue"
      />
      <StatCard
        title="Pending"
        value={kpis.pending}
        subtitle="Awaiting approval"
        icon="heroicons:clock"
        color="yellow"
      />
      <StatCard
        title="Approved"
        value={kpis.approved}
        subtitle="Successfully approved"
        icon="heroicons:check-circle"
        color="green"
      />
      <StatCard
        title="Rejected"
        value={kpis.rejected}
        subtitle="Declined requests"
        icon="heroicons:x-circle"
        color="red"
      />
      <StatCard
        title="Approval Rate"
        value={`${kpis.approvalRate}%`}
        subtitle="Success ratio"
        icon="heroicons:chart-bar"
        color="purple"
      />
      <StatCard
        title="Avg Processing"
        value={`${kpis.avgProcessing}d`}
        subtitle="Time to complete"
        icon="heroicons:bolt"
        color="cyan"
      />
    </div>
  );

  const renderTabs = () => (
    <div className="flex flex-wrap gap-1 mb-6 border-b border-slate-200">
      {[
        { id: 'all', label: 'All Transfers', icon: 'heroicons:list-bullet', badge: kpis.total },
        { id: 'internal', label: 'Internal', icon: 'heroicons:arrow-path', badge: 0 },
        { id: 'location', label: 'Location', icon: 'heroicons:map-pin', badge: 0 },
        { id: 'promotion', label: 'Promotion', icon: 'heroicons:arrow-trending-up', badge: 0 },
        { id: 'department', label: 'Department', icon: 'heroicons:building-office-2', badge: 0 }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            setCurrentPage(1);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${activeTab === tab.id
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <Icon icon={tab.icon} className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative">
          <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search transfers..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="All">All Types</option>
          <option value="Internal Transfer">Internal Transfer</option>
          <option value="Location Transfer">Location Transfer</option>
          <option value="Promotion Transfer">Promotion Transfer</option>
          <option value="Department Transfer">Department Transfer</option>
        </select>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="All">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Finance">Finance</option>
        </select>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        >
          <option value="All">All Locations</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Chennai">Chennai</option>
          <option value="Hyderabad">Hyderabad</option>
        </select>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h6 className="font-bold text-sm text-slate-700">Quick Actions</h6>
          <p className="text-xs text-slate-500">Manage transfer processes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={() => openModal('transfer')}
          >
            <Icon icon="heroicons:plus" className="w-4 h-4" />
            New Request
          </button>
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={() => showNotification('Data exported as CSV!', 'success')}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export Reports
          </button>
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50"
            onClick={() => openModal('bulk')}
            disabled={selectedRows.length === 0}
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Bulk Actions
          </button>
        </div>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:arrows-right-left" className="w-5 h-5 text-blue-500" />
            Transfer Requests
          </h5>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => openModal('bulk')}
              disabled={selectedRows.length === 0}
            >
              <Icon icon="heroicons:check-circle" className="w-4 h-4" />
              Bulk Actions ({selectedRows.length})
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2 w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('employeeName')}>
                Employee Details
              </th>
              <th className="px-3 py-2 text-center font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('requestType')}>
                Transfer Type
              </th>
              <th className="px-3 py-2 text-center font-semibold text-slate-600">From &rarr; To</th>
              <th className="px-3 py-2 text-center font-semibold text-slate-600">Effective Date</th>
              <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
              <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <Icon icon="heroicons:inbox" className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <h6 className="text-slate-600 font-medium">No data found</h6>
                  <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              paginatedData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleSelectRow(item.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <EmployeeAvatar name={item.employeeName} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{item.employeeName}</span>
                          <span className="text-xs text-slate-400">{item.employeeId}</span>
                        </div>
                        <div className="text-sm text-slate-500">{item.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center text-slate-600 font-medium">
                    {item.requestType}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 truncate max-w-[100px]" title={item.currentDepartment}>{item.currentDepartment}</span>
                        <Icon icon="heroicons:arrow-right" className="w-3 h-3 text-slate-400" />
                        <span className="text-blue-600 font-medium truncate max-w-[100px]" title={item.newDepartment}>{item.newDepartment}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 truncate max-w-[100px]" title={item.currentLocation}>{item.currentLocation}</span>
                        <Icon icon="heroicons:arrow-right" className="w-3 h-3 text-slate-400" />
                        <span className="text-blue-600 font-medium truncate max-w-[100px]" title={item.newLocation}>{item.newLocation}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center text-slate-600">
                    {formatDate(item.effectiveDate)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                        onClick={() => openModal('view', item)}
                        title="View"
                      >
                        <Icon icon="heroicons:eye" className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                        onClick={() => openModal('transfer', item)}
                        title="Edit Transfer"
                      >
                        <Icon icon="heroicons:pencil-square" className="w-4 h-4" />
                      </button>
                      <div className="dropdown relative">
                        <button
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                          data-bs-toggle="dropdown"
                        >
                          <Icon icon="heroicons:ellipsis-vertical" className="w-4 h-4" />
                        </button>
                        <ul className="absolute right-0 mt-1 min-w-[160px] bg-white border border-slate-200 rounded-lg shadow-lg z-10 hidden dropdown-menu">
                          <li>
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                              onClick={() => openModal('email', item)}
                            >
                              <Icon icon="heroicons:envelope" className="w-4 h-4" />
                              Send Email
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                              onClick={() => openModal('note', item)}
                            >
                              <Icon icon="heroicons:chat-bubble-left" className="w-4 h-4" />
                              Add Note
                            </button>
                          </li>
                          <li><hr className="my-1 border-slate-200" /></li>
                          <li>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                              onClick={() => {
                                showNotification('Request Approved!', 'success');
                                const updated = transferRequests.map(req => req.id === item.id ? { ...req, status: 'Approved' } : req);
                                setTransferRequests(updated);
                              }}
                            >
                              <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                              Approve
                            </button>
                          </li>
                          <li>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              onClick={() => {
                                showNotification('Request Rejected!', 'warning');
                                const updated = transferRequests.map(req => req.id === item.id ? { ...req, status: 'Rejected' } : req);
                                setTransferRequests(updated);
                              }}
                            >
                              <Icon icon="heroicons:x-circle" className="w-4 h-4" />
                              Reject
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-slate-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Rows:</span>
              <select
                className="px-2 py-1 border border-slate-200 rounded-lg text-sm bg-white"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="flex gap-1">
              <button
                className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
            <Icon icon="heroicons:arrows-right-left" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Transfers & Movement</h1>
            <p className="text-sm text-slate-500">Manage internal transfers, location changes, and cross-department movements</p>
          </div>
        </div>
      </div>

      {renderStats()}
      {renderTabs()}
      {renderFilters()}
      {renderQuickActions()}
      {renderTable()}

      <ViewModal
        isOpen={modalState.isOpen && modalState.type === 'view'}
        onClose={closeModal}
        employee={modalState.data}
        mode="transfer"
      />

      <TransferModal
        isOpen={modalState.isOpen && modalState.type === 'transfer'}
        onClose={closeModal}
        onSubmit={(data) => {
          showNotification('Transfer request saved successfully!', 'success');
          closeModal();
        }}
        request={modalState.data}
        employees={transferRequests.map(req => ({ id: req.employeeId, name: req.employeeName, department: req.currentDepartment }))}
      />

      <EmailModal
        isOpen={modalState.isOpen && modalState.type === 'email'}
        onClose={closeModal}
        onSendEmail={(data) => {
          showNotification(`Email sent successfully`, 'success');
          closeModal();
        }}
        selectedEmployee={modalState.data}
        employee={modalState.data}
      />

      <NoteModal
        isOpen={modalState.isOpen && modalState.type === 'note'}
        onClose={closeModal}
        onSubmit={(data) => {
          showNotification('Note added successfully!', 'success');
          closeModal();
        }}
        employee={modalState.data}
      />

      <BulkV2Modal
        isOpen={modalState.isOpen && modalState.type === 'bulk'}
        onClose={closeModal}
        onSubmit={(data) => {
          showNotification(`Bulk action applied to selected requests!`, 'success');
          setSelectedRows([]);
          closeModal();
        }}
        selectedCount={selectedRows.length}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        className="text-xs sm:text-sm"
        toastClassName="rounded-xl shadow-lg"
      />
    </div>
  );
};

export default TransferMovement;