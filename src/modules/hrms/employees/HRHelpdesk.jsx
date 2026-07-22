import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import TicketModal from '../modal/TicketModal';
import ViewTicketModal from '../modal/ViewTicketModal';
import { BASE_URL } from '../../../shared/constants/api.config';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const helpdeskAPI = {
  stats: () => fetch(`${BASE_URL}/helpdesk/stats`).then((r) => r.json()),
  agents: () => fetch(`${BASE_URL}/helpdesk/agents`).then((r) => r.json()),
  list: () => fetch(`${BASE_URL}/helpdesk/?limit=500`).then((r) => r.json()),
  create: (payload) => fetch(`${BASE_URL}/helpdesk/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  }),
  update: (id, payload) => fetch(`${BASE_URL}/helpdesk/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  }),
  start: (id, payload) => fetch(`${BASE_URL}/helpdesk/${id}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  }),
  resolve: (id, resolution) => fetch(`${BASE_URL}/helpdesk/${id}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ resolution }),
  }),
  close: (id) => fetch(`${BASE_URL}/helpdesk/${id}/close`, { method: 'POST', headers: { ...authHeaders() } }),
  reopen: (id) => fetch(`${BASE_URL}/helpdesk/${id}/reopen`, { method: 'POST', headers: { ...authHeaders() } }),
};

// Real backend enum values — TicketCategory (9 fixed values), TicketPriority
// (LOW|MEDIUM|HIGH|URGENT), TicketStatus (OPEN|IN_PROGRESS|RESOLVED|CLOSED).
// The UI works with these exact strings throughout rather than translating
// to a separate lowercase convention, to avoid a second mapping layer that
// could drift out of sync with the backend enum.
const CATEGORIES = [
  'Payroll queries', 'Leave and attendance issues', 'Policy clarifications',
  'IT access issues', 'Document requests', 'Reimbursement queries',
  'Personal data updates', 'General HR queries', 'Grievances and complaints',
];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const HRHelpdesk = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState('all');

  const [modalState, setModalState] = useState({ type: null, isOpen: false, data: null });

  const [filters, setFilters] = useState({ search: '', category: 'All', priority: 'All', agent: 'All' });
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [internalNotes, setInternalNotes] = useState({});
  const userRole = 'hr_admin';

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [statsRes, ticketsRes, agentsRes] = await Promise.all([
        helpdeskAPI.stats(),
        helpdeskAPI.list(),
        helpdeskAPI.agents(),
      ]);
      setStats(statsRes);
      setTickets(ticketsRes || []);
      setAssignedAgents((agentsRes?.agents || []).map((a) => a.agent_name));
    } catch (err) {
      console.error(err);
      setLoadError('Failed to load helpdesk data from the server');
      toast.error('Failed to load helpdesk data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const openModal = (type, data = null) => setModalState({ type, isOpen: true, data });
  const closeModal = () => setModalState({ type: null, isOpen: false, data: null });
  const showNotification = (message, type = 'success') => toast[type](message, { position: 'top-right', autoClose: 3000 });

  const kpis = useMemo(() => ({
    total: stats?.total_tickets ?? 0,
    open: stats?.open ?? 0,
    inProgress: stats?.in_progress ?? 0,
    resolved: stats?.resolved ?? 0,
    unassigned: stats?.unassigned ?? 0,
    highPriority: stats?.high_priority ?? 0,
    overdue: stats?.overdue ?? 0,
  }), [stats]);

  const filteredData = useMemo(() => {
    let filtered = tickets;

    if (activeTab !== 'all') {
      const statusMap = { open: 'OPEN', 'in-progress': 'IN_PROGRESS', resolved: 'RESOLVED' };
      if (statusMap[activeTab]) filtered = filtered.filter((t) => t.status === statusMap[activeTab]);
    }

    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(s) ||
        t.employee_name?.toLowerCase().includes(s) ||
        String(t.employee_id || '').toLowerCase().includes(s) ||
        t.id.toString().includes(s)
      );
    }
    if (filters.category !== 'All') filtered = filtered.filter((t) => t.category === filters.category);
    if (filters.priority !== 'All') filtered = filtered.filter((t) => t.priority === filters.priority);
    if (filters.agent !== 'All') filtered = filtered.filter((t) => t.assigned_agent === filters.agent);

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key]; let bVal = b[sortConfig.key];
        if (sortConfig.key === 'created_at') { aVal = new Date(aVal).getTime(); bVal = new Date(bVal).getTime(); }
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

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  const handleSort = (key) => setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'HIGH': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOW': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IN_PROGRESS': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CLOSED': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateTicket = async (data) => {
    try {
      const res = await helpdeskAPI.create({
        title: data.subject,
        category: data.category,
        priority: data.priority,
        description: data.description,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to create ticket');
      }
      showNotification('Ticket created successfully!');
      closeModal();
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to create ticket');
    }
  };

  // Backend enforces real state-machine rules (OPEN -> IN_PROGRESS -> RESOLVED
  // -> CLOSED, or CLOSED/RESOLVED -> OPEN via reopen), each via its own
  // endpoint, rather than a single free-form status PATCH.
  const updateTicketStatus = async (ticketId, newStatus, extra = {}) => {
    try {
      let res;
      if (newStatus === 'IN_PROGRESS') {
        res = await helpdeskAPI.start(ticketId, { assigned_agent: extra.assignedAgent || null });
      } else if (newStatus === 'RESOLVED') {
        res = await helpdeskAPI.resolve(ticketId, extra.resolution || 'Resolved.');
      } else if (newStatus === 'CLOSED') {
        res = await helpdeskAPI.close(ticketId);
      } else if (newStatus === 'OPEN') {
        res = await helpdeskAPI.reopen(ticketId);
      } else {
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to update ticket status');
      }
      const updated = await res.json();
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
      if (modalState.data?.id === ticketId) setModalState((s) => ({ ...s, data: updated }));
      showNotification(`Ticket marked as ${newStatus.toLowerCase().replace('_', ' ')}`);
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update ticket status');
    }
  };

  const assignTicket = async (ticketId, agentName) => {
    try {
      const res = await helpdeskAPI.update(ticketId, { assigned_agent: agentName });
      if (!res.ok) throw new Error('Failed to assign ticket');
      const updated = await res.json();
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
      if (modalState.data?.id === ticketId) setModalState((s) => ({ ...s, data: updated }));
      showNotification(`Ticket assigned to ${agentName}`);
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error('Failed to assign ticket');
    }
  };

  // The backend has no internal-notes/comments table for tickets at all —
  // only a single `resolution` text field set when a ticket is resolved.
  // These notes are kept in local state only and will be lost on refresh;
  // ViewTicketModal is told this explicitly rather than silently losing data.
  const addInternalNote = (ticketId, noteContent) => {
    const noteObj = {
      id: Date.now(),
      content: noteContent,
      timestamp: new Date().toISOString(),
      author: userRole === 'hr_admin' ? 'You' : 'HR Support',
      ticketId,
    };
    setInternalNotes((prev) => ({ ...prev, [ticketId]: [...(prev[ticketId] || []), noteObj] }));
    showNotification('Internal note added (not saved to server — see note in ticket view)', 'info');
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <StatCard title="Total Tickets" value={kpis.total} subtitle="All time" icon="heroicons:ticket" color="blue" />
      <StatCard title="Open" value={kpis.open} subtitle="Needs attention" icon="heroicons:envelope-open" color="red" />
      <StatCard title="In Progress" value={kpis.inProgress} subtitle="Being worked on" icon="heroicons:arrow-path" color="purple" />
      <StatCard title="Resolved" value={kpis.resolved} subtitle="Successfully fixed" icon="heroicons:check-circle" color="green" />
      <StatCard title="Unassigned" value={kpis.unassigned} subtitle="Awaiting assignment" icon="heroicons:user-minus" color="amber" />
      <StatCard title="Overdue" value={kpis.overdue} subtitle="Past due date" icon="heroicons:clock" color="cyan" />
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
        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          <Icon icon={tab.icon} className="w-4 h-4" />
          {tab.label}
          <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{tab.count}</span>
        </button>
      ))}
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input type="text" placeholder="Search tickets..." className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="All">All Priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
        </select>
        <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white" value={filters.agent} onChange={(e) => setFilters({ ...filters, agent: e.target.value })}>
          <option value="All">All Agents</option>
          {assignedAgents.map((agent) => <option key={agent} value={agent}>{agent}</option>)}
        </select>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3 flex justify-between items-center">
        <h5 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon icon="heroicons:ticket" className="w-5 h-5 text-blue-500" /> Support Tickets
        </h5>
        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2" onClick={() => openModal('create')}>
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
              <th className="px-4 py-3 text-center font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('created_at')}>Created</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400">Loading…</td></tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <Icon icon="heroicons:inbox" className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <h6 className="text-slate-600 font-medium">No tickets found</h6>
                  <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 text-slate-600 font-medium">#{item.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.employee_name || 'No requester on file'}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">{item.category}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>{item.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>{item.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">
                    {item.assigned_agent ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">{item.assigned_agent.charAt(0)}</div>
                        {item.assigned_agent}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-500 text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition" onClick={() => openModal('view', item)} title="View Ticket">
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
          <div className="text-sm text-slate-500">Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
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

      {loadError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{loadError}</div>}

      {renderStats()}
      {renderTabs()}
      {renderFilters()}
      {renderTable()}

      <TicketModal
        isOpen={modalState.isOpen && modalState.type === 'create'}
        onClose={closeModal}
        onSubmit={handleCreateTicket}
        newTicket={{ subject: '', category: CATEGORIES[0], priority: 'MEDIUM', description: '' }}
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
