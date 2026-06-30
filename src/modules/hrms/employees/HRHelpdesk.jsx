import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import TicketModal from '../modal/TicketModal';
import ViewTicketModal from '../modal/ViewTicketModal';

const HRHelpdesk = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState('all');

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    priority: 'All',
    agent: 'All'
  });

  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [internalNotes, setInternalNotes] = useState({});
  const [assignedAgents] = useState(['John HR', 'Priya Kumar', 'IT Support', 'Admin Team', 'Finance Team']);
  const userRole = 'hr_admin';

  // Sample Data Initialization -> Replaced with empty array as per user request
  useEffect(() => {
    setIsLoading(true);
    // TODO: Fetch from API
    setTickets([]);
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

  const calculateAverageResolutionTime = () => {
    const resolvedTickets = tickets.filter(t => t.resolutionTime && t.status === 'resolved');
    if (resolvedTickets.length === 0) return 0;
    const totalHours = resolvedTickets.reduce((sum, ticket) => {
      const created = new Date(ticket.createdAt);
      const resolved = new Date(ticket.resolutionTime);
      return sum + ((resolved - created) / (1000 * 60 * 60));
    }, 0);
    return Math.round(totalHours / resolvedTickets.length);
  };

  const kpis = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in-progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const unassigned = tickets.filter(t => !t.assignedTo).length;
    const avgResolution = calculateAverageResolutionTime();

    return { total, open, inProgress, resolved, unassigned, avgResolution };
  }, [tickets]);

  const filteredData = useMemo(() => {
    let filtered = tickets;

    if (activeTab !== 'all') {
      filtered = filtered.filter(t => t.status === activeTab);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchLower) ||
        t.employeeName?.toLowerCase().includes(searchLower) ||
        t.employeeId?.toLowerCase().includes(searchLower) ||
        t.id.toString().includes(searchLower)
      );
    }

    if (filters.category !== 'All') filtered = filtered.filter(t => t.category === filters.category);
    if (filters.priority !== 'All') filtered = filtered.filter(t => t.priority === filters.priority);
    if (filters.agent !== 'All') filtered = filtered.filter(t => t.assignedTo === filters.agent);

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === 'createdAt' || sortConfig.key === 'lastUpdated') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [tickets, activeTab, filters, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in-progress': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'closed': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateTicket = (data) => {
    const newTicketObj = {
      id: tickets.length + 1,
      title: data.subject,
      category: data.category,
      priority: data.priority,
      description: data.description,
      status: 'open',
      createdAt: new Date().toISOString(),
      assignedTo: null,
      employeeName: 'Current User', // Mock employee name
      employeeId: 'EMP000',
      department: 'HR',
      resolutionTime: null,
      lastUpdated: new Date().toISOString()
    };
    setTickets([newTicketObj, ...tickets]);
    showNotification('Ticket created successfully!');
    closeModal();
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = { ...t, status: newStatus, lastUpdated: new Date().toISOString() };
        if (newStatus === 'resolved' && !t.resolutionTime) {
          updated.resolutionTime = new Date().toISOString();
        }
        if (modalState.data?.id === ticketId) {
          setModalState(s => ({ ...s, data: updated }));
        }
        return updated;
      }
      return t;
    }));
    showNotification(`Ticket marked as ${newStatus}`);
  };

  const assignTicket = (ticketId, agentName) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = { ...t, assignedTo: agentName, lastUpdated: new Date().toISOString() };
        if (modalState.data?.id === ticketId) {
          setModalState(s => ({ ...s, data: updated }));
        }
        return updated;
      }
      return t;
    }));
    showNotification(`Ticket assigned to ${agentName}`);
  };

  const addInternalNote = (ticketId, noteContent) => {
    const noteObj = {
      id: Date.now(),
      content: noteContent,
      timestamp: new Date().toISOString(),
      author: userRole === 'hr_admin' ? 'You' : 'HR Support',
      ticketId: ticketId
    };
    setInternalNotes(prev => ({
      ...prev,
      [ticketId]: [...(prev[ticketId] || []), noteObj]
    }));
    showNotification('Internal note added');
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <StatCard title="Total Tickets" value={kpis.total} subtitle="All time" icon="heroicons:ticket" color="blue" />
      <StatCard title="Open" value={kpis.open} subtitle="Needs attention" icon="heroicons:envelope-open" color="red" />
      <StatCard title="In Progress" value={kpis.inProgress} subtitle="Being worked on" icon="heroicons:arrow-path" color="purple" />
      <StatCard title="Resolved" value={kpis.resolved} subtitle="Successfully fixed" icon="heroicons:check-circle" color="green" />
      <StatCard title="Unassigned" value={kpis.unassigned} subtitle="Awaiting assignment" icon="heroicons:user-minus" color="amber" />
      <StatCard title="Avg Resolution" value={`${kpis.avgResolution}h`} subtitle="Average time" icon="heroicons:clock" color="cyan" />
    </div>
  );

  const renderTabs = () => (
    <div className="flex flex-wrap gap-1 mb-6 border-b border-slate-200">
      {[
        { id: 'all', label: 'All Tickets', icon: 'heroicons:queue-list', count: kpis.total },
        { id: 'open', label: 'Open', icon: 'heroicons:envelope-open', count: kpis.open },
        { id: 'in-progress', label: 'In Progress', icon: 'heroicons:arrow-path', count: kpis.inProgress },
        { id: 'resolved', label: 'Resolved', icon: 'heroicons:check-circle', count: kpis.resolved },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <Icon icon={tab.icon} className="w-4 h-4" />
          {tab.label}
          <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tickets..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="All">All Categories</option>
          <option value="Payroll queries">Payroll queries</option>
          <option value="Leave and attendance issues">Leave & Attendance</option>
          <option value="IT access issues">IT Access</option>
          <option value="Policy clarifications">Policy</option>
          <option value="Reimbursement queries">Reimbursements</option>
        </select>
        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="All">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.agent}
          onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
        >
          <option value="All">All Agents</option>
          {assignedAgents.map(agent => (
            <option key={agent} value={agent}>{agent}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3 flex justify-between items-center">
        <h5 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:ticket" className="w-5 h-5 text-blue-500" />
          Support Tickets
        </h5>
        <button
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
          onClick={() => openModal('create')}
        >
          <Icon icon="heroicons:plus" className="w-4 h-4" /> New Ticket
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('id')}>ID</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('title')}>Subject & Requester</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Category</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('priority')}>Priority</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('status')}>Status</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600">Assigned To</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('createdAt')}>Created</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <Icon icon="heroicons:inbox" className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <h6 className="text-slate-600 font-medium">No tickets found</h6>
                  <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              paginatedData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 text-slate-600 font-medium">#{item.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.employeeName}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">
                    {item.assignedTo ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                          {item.assignedTo.charAt(0)}
                        </div>
                        {item.assignedTo}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500 text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                        onClick={() => openModal('view', item)}
                        title="View Ticket"
                      >
                        <Icon icon="heroicons:eye" className="w-4 h-4" />
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
            <button
              className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-xl">
            <Icon icon="heroicons:lifebuoy" className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">HR Helpdesk</h1>
            <p className="text-sm text-slate-500">Manage support tickets, assignments, and resolutions</p>
          </div>
        </div>
      </div>

      {renderStats()}
      {renderTabs()}
      {renderFilters()}
      {renderTable()}

      <TicketModal
        isOpen={modalState.isOpen && modalState.type === 'create'}
        onClose={closeModal}
        onSubmit={handleCreateTicket}
        newTicket={{ subject: '', category: 'technical', priority: 'medium', description: '' }}
      />

      <ViewTicketModal
        isOpen={modalState.isOpen && modalState.type === 'view'}
        onClose={closeModal}
        ticket={modalState.data}
        onUpdateStatus={updateTicketStatus}
        onAssign={assignTicket}
        onAddNote={addInternalNote}
        internalNotes={internalNotes}
        userRole={userRole}
        assignedAgents={assignedAgents}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} className="text-xs sm:text-sm" toastClassName="rounded-xl shadow-lg" />
    </div>
  );
};

export default HRHelpdesk;