import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import StatCard from '../../../shared/components/StatCard';
import EmployeeDetailMasterModal from '../modal/EmployeeDetailMasterModal';
import TransferModal from '../modal/TransferModal';
import ExitModal from '../modal/ExitModal';
import ProbationModal from '../modal/ProbationModal';
import ContractModal from '../modal/ContractModal';
import ConfirmationModal from '../modal/ConfirmationModal';

import {
  fetchEmployees,
  fetchOnboardingChecklist,
  fetchProbationReviews,
  fetchTransferRequests,
  fetchExitProcesses,
  fetchContractRenewals,
  fetchLifecycleStats,
  updateOnboardingTask,
  approveTransferRequest,
  rejectTransferRequest,
  startProbationReview as startReview,
  completeProbationReview as completeReview,
  initiateExitProcess,
  createTransferRequest,
  createProbationReview,
  createContractRenewal,
  processConfirmation,
  exportLifecycleData
} from '../../../shared/services/lifecycleService';

const EmployeeLifecycle = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showProbationModal, setShowProbationModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [onboardingChecklist, setOnboardingChecklist] = useState([]);
  const [probationReviews, setProbationReviews] = useState([]);
  const [transferRequests, setTransferRequests] = useState([]);
  const [exitProcesses, setExitProcesses] = useState([]);
  const [contractRenewals, setContractRenewals] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    probationEmployees: 0,
    transferRequests: 0,
    exitProcesses: 0,
    contractRenewals: 0,
    onboardingTasks: 0
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'heroicons:home' },
    { id: 'joining', label: 'Joining Process', icon: 'heroicons:user-plus' },
    { id: 'active', label: 'Active Employment', icon: 'heroicons:users' },
    { id: 'transfers', label: 'Transfers', icon: 'heroicons:arrow-right-circle' },
    { id: 'exit', label: 'Exit Management', icon: 'heroicons:user-minus' },
    { id: 'reports', label: 'Reports', icon: 'heroicons:chart-bar' },
  ];

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        employeesData,
        checklistData,
        reviewsData,
        transfersData,
        exitsData,
        contractsData,
        statsData
      ] = await Promise.all([
        fetchEmployees(),
        fetchOnboardingChecklist(),
        fetchProbationReviews(),
        fetchTransferRequests(),
        fetchExitProcesses(),
        fetchContractRenewals(),
        fetchLifecycleStats()
      ]);

      setEmployees(employeesData);
      setOnboardingChecklist(checklistData);
      setProbationReviews(reviewsData);
      setTransferRequests(transfersData);
      setExitProcesses(exitsData);
      setContractRenewals(contractsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!loading) {
      loadFilteredData();
    }
  }, [searchTerm, filterStatus, currentPage]);

  const loadFilteredData = async () => {
    try {
      const params = {
        search: searchTerm || undefined,
        status: filterStatus !== 'All' ? filterStatus : undefined,
        page: currentPage,
        limit: itemsPerPage
      };

      switch (activeTab) {
        case 'joining':
          const checklistData = await fetchOnboardingChecklist(params);
          setOnboardingChecklist(checklistData);
          break;
        case 'transfers':
          const transfersData = await fetchTransferRequests(params);
          setTransferRequests(transfersData);
          break;
        case 'exit':
          const exitsData = await fetchExitProcesses(params);
          setExitProcesses(exitsData);
          break;
        case 'active':
          const employeesData = await fetchEmployees(params);
          setEmployees(employeesData);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Failed to load filtered data:', err);
    }
  };

  const getStageBadge = (stage) => {
    const config = {
      'active': { label: 'Active', color: 'emerald' },
      'probation': { label: 'Probation', color: 'amber' },
      'transfer-pending': { label: 'Transfer Pending', color: 'blue' },
      'exit-process': { label: 'Exit Process', color: 'rose' },
      'contract-renewal': { label: 'Contract Renewal', color: 'purple' }
    };
    const { label, color } = config[stage] || { label: stage || 'Unknown', color: 'gray' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      'completed': { label: 'Completed', color: 'emerald' },
      'pending': { label: 'Pending', color: 'amber' },
      'in-progress': { label: 'In Progress', color: 'blue' },
      'approved': { label: 'Approved', color: 'emerald' },
      'rejected': { label: 'Rejected', color: 'rose' },
      'in-review': { label: 'In Review', color: 'purple' },
      'in-process': { label: 'In Process', color: 'amber' },
      'initiated': { label: 'Initiated', color: 'blue' },
      'scheduled': { label: 'Scheduled', color: 'cyan' }
    };
    const { label, color } = config[status] || { label: status || 'Unknown', color: 'gray' };
    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const handleApproveTransfer = async (id) => {
    try {
      await approveTransferRequest(id);
      const updated = await fetchTransferRequests();
      setTransferRequests(updated);
      toast.success('Transfer approved successfully');

      const statsData = await fetchLifecycleStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to approve transfer:', err);
      toast.error(err.message || 'Failed to approve transfer');
    }
  };

  const handleRejectTransfer = async (id) => {
    try {
      await rejectTransferRequest(id);
      const updated = await fetchTransferRequests();
      setTransferRequests(updated);
      toast.info('Transfer rejected');
    } catch (err) {
      console.error('Failed to reject transfer:', err);
      toast.error(err.message || 'Failed to reject transfer');
    }
  };

  const handleStartProbationReview = async (reviewId) => {
    try {
      await startReview(reviewId);
      const updated = await fetchProbationReviews();
      setProbationReviews(updated);
      toast.info('Probation review started');
    } catch (err) {
      console.error('Failed to start probation review:', err);
      toast.error(err.message || 'Failed to start review');
    }
  };

  const handleCompleteProbationReview = async (reviewId, rating) => {
    try {
      await completeReview(reviewId, rating);
      const updated = await fetchProbationReviews();
      setProbationReviews(updated);
      toast.success(`Probation review completed with rating: ${rating}`);
    } catch (err) {
      console.error('Failed to complete probation review:', err);
      toast.error(err.message || 'Failed to complete review');
    }
  };

  const handleInitiateExit = async (employeeId) => {
    try {
      const employee = employees.find(e => e.id === employeeId);
      if (!employee) return;
      
      await initiateExitProcess(employeeId);
      const updatedExits = await fetchExitProcesses();
      setExitProcesses(updatedExits);
      toast.success(`Exit initiated for ${employee.name}`);

      const statsData = await fetchLifecycleStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to initiate exit:', err);
      toast.error(err.message || 'Failed to initiate exit');
    }
  };

  const handleMarkTaskComplete = async (taskId) => {
    try {
      await updateOnboardingTask(taskId, { status: 'completed' });
      const updated = await fetchOnboardingChecklist();
      setOnboardingChecklist(updated);
      toast.success('Task marked as completed');

      const statsData = await fetchLifecycleStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to mark task complete:', err);
      toast.error(err.message || 'Failed to update task');
    }
  };

  const handleCreateTransfer = async (data) => {
    try {
      await createTransferRequest(data);
      const updated = await fetchTransferRequests();
      setTransferRequests(updated);
      toast.success('Transfer request submitted');
      setShowTransferModal(false);

      const statsData = await fetchLifecycleStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to create transfer:', err);
      toast.error(err.message || 'Failed to create transfer request');
    }
  };

  const handleCreateExit = async (data) => {
    try {
      await initiateExitProcess(data.employeeId, data);
      const updated = await fetchExitProcesses();
      setExitProcesses(updated);
      toast.success(`Exit initiated for employee`);
      setShowExitModal(false);

      const statsData = await fetchLifecycleStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to create exit:', err);
      toast.error(err.message || 'Failed to initiate exit');
    }
  };

  const handleCreateProbationReview = async (data) => {
    try {
      await createProbationReview(data);
      const updated = await fetchProbationReviews();
      setProbationReviews(updated);
      toast.success('Probation review scheduled');
      setShowProbationModal(false);
    } catch (err) {
      console.error('Failed to create probation review:', err);
      toast.error(err.message || 'Failed to schedule review');
    }
  };

  const handleCreateContractRenewal = async (data) => {
    try {
      await createContractRenewal(data);
      const updated = await fetchContractRenewals();
      setContractRenewals(updated);
      toast.success('Contract renewal initiated');
      setShowContractModal(false);
    } catch (err) {
      console.error('Failed to create contract renewal:', err);
      toast.error(err.message || 'Failed to initiate renewal');
    }
  };

  const handleProcessConfirmation = async (data) => {
    try {
      await processConfirmation(data);
      toast.success('Confirmation processed successfully');
      setShowConfirmationModal(false);

      await loadInitialData();
    } catch (err) {
      console.error('Failed to process confirmation:', err);
      toast.error(err.message || 'Failed to process confirmation');
    }
  };

  const handleExport = async (name, type) => {
    try {
      const data = await exportLifecycleData(type);
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Export completed successfully');
    } catch (err) {
      console.error('Failed to export:', err);
      toast.error(err.message || 'Failed to export data');
    }
  };

  const refreshData = () => {
    setSearchTerm('');
    setFilterStatus('All');
    setCurrentPage(1);
    loadInitialData();
    toast.info('Data refreshed');
  };

  const getFilteredList = (list, keyFields = []) => {
    const lower = searchTerm.trim().toLowerCase();
    let filtered = list.filter(item => {
      if (!lower) return true;
      if (keyFields.length) {
        return keyFields.some(k => (String(item[k] || '')).toLowerCase().includes(lower));
      }
      return Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes(lower));
    });

    if (filterStatus !== 'All') {
      filtered = filtered.filter(item => {
        const status = item.status || item.stage || '';
        return status.toLowerCase() === filterStatus.toLowerCase();
      });
    }
    return filtered;
  };

  const paginate = (list) => {
    const total = Math.ceil(list.length / itemsPerPage);
    const page = Math.max(1, Math.min(currentPage, total || 1));
    const start = (page - 1) * itemsPerPage;
    return {
      page,
      total,
      data: list.slice(start, start + itemsPerPage)
    };
  };

  const renderTopActions = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <div className="relative flex-1 min-w-[120px]">
        <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full h-8 sm:h-10 pl-8 sm:pl-10 pr-3 sm:pr-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
        />
      </div>

      <div className="relative flex-1 min-w-[120px]">
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
        <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
      </div>

      <button
        onClick={refreshData}
        className="px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
        disabled={loading}
      >
        <Icon icon="heroicons:arrow-path" className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </button>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Employees" value={stats.totalEmployees} subtitle="Active workforce" icon="heroicons:users" color="blue" />
        <StatCard title="Active" value={stats.activeEmployees} subtitle={`${((stats.activeEmployees / (stats.totalEmployees || 1)) * 100).toFixed(0)}% of total`} icon="heroicons:check-circle" color="green" />
        <StatCard title="Probation" value={stats.probationEmployees} subtitle="Pending confirmation" icon="heroicons:clock" color="yellow" />
        <StatCard title="Pending Transfers" value={stats.transferRequests} subtitle="Awaiting approval" icon="heroicons:arrow-right-circle" color="purple" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Lifecycle Overview</h6>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <Icon icon="heroicons:user-plus" className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-800">{stats.onboardingTasks}</p>
            <p className="text-[10px] text-slate-500">Joining Tasks</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <Icon icon="heroicons:users" className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-800">{stats.activeEmployees}</p>
            <p className="text-[10px] text-slate-500">Active</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <Icon icon="heroicons:clock" className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-800">{stats.probationEmployees}</p>
            <p className="text-[10px] text-slate-500">Probation</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <Icon icon="heroicons:arrow-right-circle" className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-800">{stats.transferRequests}</p>
            <p className="text-[10px] text-slate-500">Transfers</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <Icon icon="heroicons:user-minus" className="w-5 h-5 text-rose-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-slate-800">{stats.exitProcesses}</p>
            <p className="text-[10px] text-slate-500">Exit Process</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 md:p-4">
        <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Quick Actions</h6>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onClick={() => setActiveTab('joining')} className="p-3 md:p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition border border-blue-100">
            <Icon icon="heroicons:user-plus" className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-xs font-medium text-slate-700">New Joining</span>
          </button>
          <button onClick={() => setShowProbationModal(true)} className="p-3 md:p-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-center transition border border-amber-100">
            <Icon icon="heroicons:clipboard-document-check" className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <span className="text-xs font-medium text-slate-700">Probation Review</span>
          </button>
          <button onClick={() => setShowTransferModal(true)} className="p-3 md:p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition border border-purple-100">
            <Icon icon="heroicons:arrow-right-circle" className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-xs font-medium text-slate-700">Transfer Request</span>
          </button>
          <button onClick={() => setShowExitModal(true)} className="p-3 md:p-4 bg-rose-50 hover:bg-rose-100 rounded-xl text-center transition border border-rose-100">
            <Icon icon="heroicons:user-minus" className="w-6 h-6 text-rose-600 mx-auto mb-2" />
            <span className="text-xs font-medium text-slate-700">Initiate Exit</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderJoining = () => {
    const list = getFilteredList(onboardingChecklist, ['task', 'assignedTo', 'status']);
    const { data, total, page } = paginate(list);

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">Onboarding Checklist</h3>
          {renderTopActions()}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 mt-2">Loading tasks...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3 text-left min-w-[180px]">Task</th>
                      <th className="p-3 text-left min-w-[120px]">Assigned To</th>
                      <th className="p-3 text-left min-w-[100px]">Due Date</th>
                      <th className="p-3 text-center min-w-[100px]">Status</th>
                      <th className="p-3 text-center min-w-[120px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-medium text-slate-800">{task.task}</td>
                        <td className="p-3 text-slate-600">{task.assignedTo}</td>
                        <td className="p-3 text-slate-600">{task.dueDate}</td>
                        <td className="p-3 text-center">{getStatusBadge(task.status)}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => { setSelectedItem(task); setShowDetailModal(true); }}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                              title="View"
                            >
                              <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                            </button>
                            {task.status !== 'completed' && (
                              <button
                                onClick={() => handleMarkTaskComplete(task.id)}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                title="Complete"
                              >
                                <Icon icon="heroicons:check" className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Icon icon="heroicons:clipboard-document-list" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-slate-600">No tasks found</p>
                </div>
              )}

              {total > 1 && renderPagination(total, page, list.length)}
            </>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Confirmation Approval Workflow</h6>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
              <Icon icon="heroicons:user" className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h6 className="text-sm font-semibold text-slate-800">Eligibility Check</h6>
              <p className="text-xs text-slate-500">Verify probation completion</p>
              <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
              </div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Completed</span>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center">
              <Icon icon="heroicons:document-check" className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <h6 className="text-sm font-semibold text-slate-800">Manager Review</h6>
              <p className="text-xs text-slate-500">Performance evaluation</p>
              <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }} />
              </div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">In Progress</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
              <Icon icon="heroicons:envelope" className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h6 className="text-sm font-semibold text-slate-800">Letter Generation</h6>
              <p className="text-xs text-slate-500">Generate confirmation letter</p>
              <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 rounded-full" style={{ width: '0%' }} />
              </div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Pending</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActive = () => {
    const list = getFilteredList(employees, ['name', 'email', 'department', 'position']);
    const { data, total, page } = paginate(list);

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">Active Employees</h3>
          {renderTopActions()}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 mt-2">Loading employees...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3 text-left min-w-[180px]">Employee</th>
                      <th className="p-3 text-left min-w-[120px] hidden sm:table-cell">Department</th>
                      <th className="p-3 text-left min-w-[130px] hidden md:table-cell">Position</th>
                      <th className="p-3 text-left min-w-[100px] hidden lg:table-cell">Hire Date</th>
                      <th className="p-3 text-center min-w-[100px]">Stage</th>
                      <th className="p-3 text-center min-w-[120px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-100 flex-shrink-0">
                              <Icon icon="heroicons:user" className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-slate-800 text-xs sm:text-sm truncate">{emp.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{emp.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden sm:table-cell text-slate-600">{emp.department}</td>
                        <td className="p-3 hidden md:table-cell text-slate-600">{emp.position}</td>
                        <td className="p-3 hidden lg:table-cell text-slate-500">{emp.hireDate}</td>
                        <td className="p-3 text-center">{getStageBadge(emp.stage)}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => { setSelectedItem(emp); setShowDetailModal(true); }}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                              title="View"
                            >
                              <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                            </button>
                            {emp.stage !== 'exit-process' && (
                              <button
                                onClick={() => handleInitiateExit(emp.id)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                title="Initiate Exit"
                              >
                                <Icon icon="heroicons:user-minus" className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Icon icon="heroicons:users" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-slate-600">No employees found</p>
                </div>
              )}

              {total > 1 && renderPagination(total, page, list.length)}
            </>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Probation Reviews</h6>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 text-left min-w-[130px]">Employee</th>
                  <th className="p-3 text-left min-w-[100px]">Review Date</th>
                  <th className="p-3 text-left min-w-[120px] hidden sm:table-cell">Manager</th>
                  <th className="p-3 text-center min-w-[100px]">Status</th>
                  <th className="p-3 text-center min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {probationReviews.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-medium text-slate-800">{r.employeeName}</td>
                    <td className="p-3 text-slate-600">{r.reviewDate}</td>
                    <td className="p-3 hidden sm:table-cell text-slate-600">{r.manager || '—'}</td>
                    <td className="p-3 text-center">{getStatusBadge(r.status)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {r.status === 'pending' && (
                          <button
                            onClick={() => handleStartProbationReview(r.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"
                          >
                            Start
                          </button>
                        )}
                        {r.status === 'in-progress' && (
                          <button
                            onClick={() => {
                              const rating = window.prompt('Rating (e.g. Meets Expectations)', 'Meets Expectations');
                              if (rating) handleCompleteProbationReview(r.id, rating);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTransfers = () => {
    const list = getFilteredList(transferRequests, ['employeeName', 'type', 'status']);
    const { data, total, page } = paginate(list);

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">Transfer Requests</h3>
          <div className="flex flex-wrap items-center gap-2">
            {renderTopActions()}
            <button
              onClick={() => setShowTransferModal(true)}
              className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
            >
              <Icon icon="heroicons:plus" className="w-3 h-3 sm:w-4 sm:h-4" />
              New Transfer
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 mt-2">Loading transfers...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3 text-left min-w-[140px]">Employee</th>
                      <th className="p-3 text-left min-w-[100px]">Type</th>
                      <th className="p-3 text-left min-w-[150px] hidden md:table-cell">From → To</th>
                      <th className="p-3 text-left min-w-[100px] hidden lg:table-cell">Request Date</th>
                      <th className="p-3 text-center min-w-[100px]">Status</th>
                      <th className="p-3 text-center min-w-[160px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium text-slate-800">{r.employeeName}</div>
                          <div className="text-[10px] text-slate-400">{r.employeeId}</div>
                        </td>
                        <td className="p-3 text-slate-600">{r.type}</td>
                        <td className="p-3 hidden md:table-cell text-slate-600">
                          <span className="text-xs">{r.fromDept || r.fromLocation}</span>
                          <Icon icon="heroicons:arrow-right" className="w-3 h-3 mx-1 inline" />
                          <span className="text-xs">{r.toDept || r.toLocation}</span>
                        </td>
                        <td className="p-3 hidden lg:table-cell text-slate-500">{r.requestDate}</td>
                        <td className="p-3 text-center">{getStatusBadge(r.status)}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {r.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveTransfer(r.id)}
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                  title="Approve"
                                >
                                  <Icon icon="heroicons:check" className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectTransfer(r.id)}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                  title="Reject"
                                >
                                  <Icon icon="heroicons:x-mark" className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => { setSelectedItem(r); setShowDetailModal(true); }}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                              title="View"
                            >
                              <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Icon icon="heroicons:arrow-right-circle" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-slate-600">No transfer requests found</p>
                </div>
              )}

              {total > 1 && renderPagination(total, page, list.length)}
            </>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Transfer Approval Workflow</h6>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { stage: 'Request Submitted', icon: 'heroicons:document-text', status: 'completed', color: 'emerald' },
              { stage: 'Manager Approval', icon: 'heroicons:user', status: 'active', color: 'blue' },
              { stage: 'HR Review', icon: 'heroicons:users', status: 'pending', color: 'amber' },
              { stage: 'Final Approval', icon: 'heroicons:check', status: 'pending', color: 'gray' },
            ].map((item, index) => (
              <div key={index} className={`text-center p-3 rounded-xl border ${
                item.status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
                item.status === 'active' ? 'border-blue-200 bg-blue-50' :
                'border-slate-200 bg-slate-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  item.status === 'completed' ? 'bg-emerald-500 text-white' :
                  item.status === 'active' ? 'bg-blue-500 text-white' :
                  'bg-slate-200 text-slate-400'
                }`}>
                  <Icon icon={item.icon} className="w-4 h-4" />
                </div>
                <p className={`text-xs font-medium ${
                  item.status === 'completed' ? 'text-emerald-700' :
                  item.status === 'active' ? 'text-blue-700' :
                  'text-slate-500'
                }`}>{item.stage}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderExit = () => {
    const list = getFilteredList(exitProcesses, ['employeeName', 'status']);
    const { data, total, page } = paginate(list);

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-slate-800">Exit Process Tracking</h3>
          <div className="flex flex-wrap items-center gap-2">
            {renderTopActions()}
            <button
              onClick={() => setShowExitModal(true)}
              className="px-3 sm:px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
            >
              <Icon icon="heroicons:plus" className="w-3 h-3 sm:w-4 sm:h-4" />
              Initiate Exit
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs text-slate-500 mt-2">Loading exit processes...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3 text-left min-w-[140px]">Employee</th>
                      <th className="p-3 text-left min-w-[100px] hidden md:table-cell">Last Working Day</th>
                      <th className="p-3 text-left min-w-[120px] hidden lg:table-cell">Notice Period</th>
                      <th className="p-3 text-center min-w-[120px]">Clearance</th>
                      <th className="p-3 text-center min-w-[100px]">Status</th>
                      <th className="p-3 text-center min-w-[120px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium text-slate-800">{e.employeeName}</div>
                          <div className="text-[10px] text-slate-400">{e.employeeId}</div>
                        </td>
                        <td className="p-3 hidden md:table-cell text-slate-600">{e.lastWorkingDay || '-'}</td>
                        <td className="p-3 hidden lg:table-cell text-slate-500">
                          {e.noticePeriodStart ? `${e.noticePeriodStart} → ${e.lastWorkingDay || '-'}` : 'Completed'}
                        </td>
                        <td className="p-3 text-center">
                          {e.clearancePending ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                              {e.clearancePending} departments
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Completed
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">{getStatusBadge(e.status)}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => { setSelectedItem(e); setShowDetailModal(true); }}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                              title="View"
                            >
                              <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                            </button>
                            {e.status === 'in-process' && (
                              <button
                                onClick={() => toast.info('Tracking clearance (demo)')}
                                className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                                title="Track Clearance"
                              >
                                <Icon icon="heroicons:clipboard-document-list" className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Icon icon="heroicons:user-minus" className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium text-slate-600">No exit processes found</p>
                </div>
              )}

              {total > 1 && renderPagination(total, page, list.length)}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Clearance Checklist</h6>
            <div className="space-y-3">
              {[
                { id: 'it', label: 'IT Department', desc: 'Return laptop, deactivate accounts', checked: true },
                { id: 'admin', label: 'Admin Department', desc: 'Return access cards, equipment', checked: false },
                { id: 'finance', label: 'Finance Department', desc: 'Clear dues, final settlement', checked: false },
                { id: 'hr', label: 'HR Department', desc: 'Exit interview, document collection', checked: false },
              ].map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
              <Icon icon="heroicons:document-check" className="w-4 h-4" />
              Generate Relieving Letter
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">Exit Analytics</h6>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-rose-50 rounded-xl border border-rose-200">
                <p className="text-2xl font-bold text-rose-700">12%</p>
                <p className="text-xs text-slate-600">Attrition Rate</p>
                <p className="text-[10px] text-rose-500">↑ 2% from last quarter</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-2xl font-bold text-amber-700">8</p>
                <p className="text-xs text-slate-600">Voluntary Exits</p>
                <p className="text-[10px] text-amber-500">Better opportunities</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-2xl font-bold text-blue-700">3</p>
                <p className="text-xs text-slate-600">Involuntary Exits</p>
                <p className="text-[10px] text-blue-500">Performance related</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-2xl font-bold text-emerald-700">2.4</p>
                <p className="text-xs text-slate-600">Avg. Tenure (Years)</p>
                <p className="text-[10px] text-emerald-500">Industry avg: 2.1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReports = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-800">Lifecycle Reports & Analytics</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Joining Report', icon: 'heroicons:chart-bar', color: 'blue', desc: 'Monthly onboarding summary', type: 'joining' },
          { title: 'Turnover Analysis', icon: 'heroicons:arrow-trending-up', color: 'emerald', desc: 'Exit trends and patterns', type: 'turnover' },
          { title: 'Headcount Report', icon: 'heroicons:user-group', color: 'purple', desc: 'Department-wise employee count', type: 'headcount' },
        ].map((report, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${report.color}-50`}>
                <Icon icon={report.icon} className={`w-5 h-5 text-${report.color}-600`} />
              </div>
              <div className="flex-1">
                <h6 className="text-sm font-semibold text-slate-800">{report.title}</h6>
                <p className="text-xs text-slate-500">{report.desc}</p>
              </div>
              <button
                onClick={() => handleExport(`${report.title.toLowerCase().replace(' ', '_')}_report`, report.type)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                disabled={loading}
              >
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Recent Generated Reports</h6>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
              <tr>
                <th className="p-3 text-left min-w-[180px]">Report Name</th>
                <th className="p-3 text-left min-w-[120px]">Generated Date</th>
                <th className="p-3 text-left min-w-[120px] hidden sm:table-cell">Type</th>
                <th className="p-3 text-left min-w-[130px] hidden md:table-cell">Generated By</th>
                <th className="p-3 text-center min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 font-medium text-slate-800">Q1 2024 Attrition Report</td>
                <td className="p-3 text-slate-600">2024-03-30</td>
                <td className="p-3 hidden sm:table-cell">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">Exit Analysis</span>
                </td>
                <td className="p-3 hidden md:table-cell text-slate-600">HR Manager</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition" title="View">
                      <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                    </button>
                    <button className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition" title="Download">
                      <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 font-medium text-slate-800">March 2024 Joining Report</td>
                <td className="p-3 text-slate-600">2024-03-31</td>
                <td className="p-3 hidden sm:table-cell">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">Joining</span>
                </td>
                <td className="p-3 hidden md:table-cell text-slate-600">HR Manager</td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition" title="View">
                      <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                    </button>
                    <button className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition" title="Download">
                      <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPagination = (total, page, listLength) => (
    <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-[10px] sm:text-xs text-slate-500">
        Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, listLength)} of {listLength} items
      </div>
      <nav className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon icon="heroicons:chevron-left" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
        </button>
        {[...Array(Math.min(total, 5))].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={i}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-semibold transition ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/15'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        {total > 5 && <span className="text-slate-400 text-xs">...</span>}
        <button
          onClick={() => setCurrentPage(p => Math.min(total, p + 1))}
          disabled={page === total}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon icon="heroicons:chevron-right" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
        </button>
      </nav>
    </div>
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Icon icon="heroicons:exclamation-triangle" className="w-12 h-12 text-rose-500 mb-3" />
        <p className="text-sm font-medium text-slate-800">Failed to load data</p>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
        <button
          onClick={loadInitialData}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'joining': return renderJoining();
      case 'active': return renderActive();
      case 'transfers': return renderTransfers();
      case 'exit': return renderExit();
      case 'reports': return renderReports();
      default: return renderDashboard();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 min-h-screen pb-8 sm:pb-10">

      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
              <Icon icon="heroicons:user-group" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
                Employee Lifecycle Management
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 flex flex-wrap items-center gap-1 sm:gap-2">
                <span>Manage complete employee journey</span>
                <span className="w-0.5 h-0.5 rounded-full bg-slate-300 hidden xs:inline"></span>
                <span className="hidden xs:inline">From joining to exit</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-0 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-sm font-semibold transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm('');
              setFilterStatus('All');
              setCurrentPage(1);
            }}
          >
            <Icon icon={tab.icon} className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-3 sm:p-4 md:p-6">
        {loading && activeTab !== 'dashboard' ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 mt-2">Loading data...</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>

      <EmployeeDetailMasterModal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedItem(null); }}
        item={selectedItem}
      />

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onSubmit={handleCreateTransfer}
        employees={employees}
      />

      <ExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onSubmit={handleCreateExit}
        employees={employees}
      />

      <ProbationModal
        isOpen={showProbationModal}
        onClose={() => setShowProbationModal(false)}
        onSubmit={handleCreateProbationReview}
        employees={employees}
      />

      <ContractModal
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        onSubmit={handleCreateContractRenewal}
        employees={employees}
      />

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onSubmit={handleProcessConfirmation}
        employees={employees.filter(e => e.stage === 'probation')}
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

export default EmployeeLifecycle;