import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import BulkV2Modal from '../modal/BulkV2Modal';
import EarlyConfirmModal from '../modal/EarlyConfirmModal';
import ExtendModal from '../modal/ExtendModal';
import NoteModal from '../modal/NoteModal';
import TerminationModal from '../modal/TerminationModal';
import ViewModal from '../modal/ViewModal';
import ReviewModal from '../modal/ReviewModal';
import EmailModal from '../modal/EmailModal';

const PromotionsCareer = () => {
  const [activeTab, setActiveTab] = useState('probation');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const [filters, setFilters] = useState({
    search: '',
    department: 'All',
    location: 'All',
    status: 'All',
    riskLevel: 'All',
    manager: 'All'
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const [probationEmployees, setProbationEmployees] = useState([]);
  const [confirmationEmployees, setConfirmationEmployees] = useState([]);
  const [promotionEmployees, setPromotionEmployees] = useState([]);
  const [buddies, setBuddies] = useState([]);

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

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status) => {
    const styles = {
      'in_progress': 'bg-blue-50 text-blue-700 border border-blue-200',
      'under_review': 'bg-amber-50 text-amber-700 border border-amber-200',
      'extended': 'bg-cyan-50 text-cyan-700 border border-cyan-200',
      'at_risk': 'bg-rose-50 text-rose-700 border border-rose-200',
      'completed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'terminated': 'bg-slate-50 text-slate-700 border border-slate-200',
      'confirmed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'pending_review': 'bg-amber-50 text-amber-700 border border-amber-200',
      'pending_approval': 'bg-purple-50 text-purple-700 border border-purple-200',
      'overdue': 'bg-rose-50 text-rose-700 border border-rose-200',
      'approved': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'rejected': 'bg-rose-50 text-rose-700 border border-rose-200',
      'active': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'inactive': 'bg-slate-50 text-slate-700 border border-slate-200'
    };

    const labels = {
      'in_progress': 'In Progress',
      'under_review': 'Under Review',
      'extended': 'Extended',
      'at_risk': 'At Risk',
      'completed': 'Completed',
      'terminated': 'Terminated',
      'confirmed': 'Confirmed',
      'pending_review': 'Pending Review',
      'pending_approval': 'Pending Approval',
      'overdue': 'Overdue',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'active': 'Active',
      'inactive': 'Inactive'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {labels[status] || status || 'N/A'}
      </span>
    );
  };

  const getRiskBadge = (riskLevel) => {
    const styles = {
      'low': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'medium': 'bg-amber-50 text-amber-700 border border-amber-200',
      'high': 'bg-rose-50 text-rose-700 border border-rose-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[riskLevel] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {riskLevel || 'N/A'}
      </span>
    );
  };

  const getRiskColor = (riskLevel) => {
    const colors = {
      low: 'text-emerald-600',
      medium: 'text-amber-600',
      high: 'text-rose-600'
    };
    return colors[riskLevel] || 'text-slate-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      in_progress: 'text-blue-600',
      under_review: 'text-amber-600',
      extended: 'text-cyan-600',
      at_risk: 'text-rose-600',
      confirmed: 'text-emerald-600',
      pending_approval: 'text-purple-600',
      overdue: 'text-rose-600',
      approved: 'text-emerald-600',
      rejected: 'text-rose-600'
    };
    return colors[status] || 'text-slate-600';
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

  const ProgressBar = ({ progress, size = 'sm', showLabel = true }) => {
    const getColor = (value) => {
      if (value >= 80) return 'bg-emerald-500';
      if (value >= 60) return 'bg-blue-500';
      if (value >= 40) return 'bg-amber-500';
      return 'bg-rose-500';
    };

    return (
      <div className="flex items-center gap-2">
        <div className={`flex-1 ${size === 'sm' ? 'h-1.5' : 'h-2'} bg-slate-100 rounded-full overflow-hidden`}>
          <div
            className={`${getColor(progress)} h-full rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        {showLabel && (
          <span className="text-xs font-medium text-slate-600 min-w-[36px]">
            {Math.min(100, progress).toFixed(0)}%
          </span>
        )}
      </div>
    );
  };

  const RatingStars = ({ rating, max = 5, size = 'sm' }) => {
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(max)].map((_, i) => (
          <Icon
            key={i}
            icon={i < Math.floor(rating) ? 'heroicons:star-solid' : 'heroicons:star'}
            className={`${starSize} ${i < Math.floor(rating) ? 'text-amber-400' : 'text-slate-300'}`}
          />
        ))}
        <span className="text-xs text-slate-500 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const ReviewMilestones = ({ employee }) => {
    const milestones = [
      { key: 'review30', label: '30', milestone: employee.review30 },
      { key: 'review60', label: '60', milestone: employee.review60 },
      { key: 'review90', label: '90', milestone: employee.review90 }
    ];

    return (
      <div className="flex items-center gap-2">
        {milestones.map(({ key, label, milestone }) => (
          <div key={key} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                milestone?.completed
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-400'
              }`}
              title={milestone?.completed ? `${label} Day: ${formatDate(milestone.date)}` : `${label} Day: Pending`}
            >
              {label}
            </div>
            {key !== 'review90' && (
              <div className="w-4 h-0.5 bg-slate-200 mx-1" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const kpis = useMemo(() => {
    return {
      probation: {
        total: probationEmployees.length,
        inProgress: probationEmployees.filter(e => e.status === 'in_progress').length,
        atRisk: probationEmployees.filter(e => e.riskLevel === 'high').length,
        extended: probationEmployees.filter(e => e.status === 'extended').length,
        endingSoon: probationEmployees.filter(e => e.daysRemaining <= 30 && e.daysRemaining > 0).length,
        avgProgress: probationEmployees.length > 0
          ? probationEmployees.reduce((sum, e) => sum + (e.progress || 0), 0) / probationEmployees.length
          : 0
      },
      confirmation: {
        total: confirmationEmployees.length,
        confirmed: confirmationEmployees.filter(e => e.confirmationStatus === 'confirmed').length,
        pending: confirmationEmployees.filter(e => e.confirmationStatus !== 'confirmed').length,
        overdue: confirmationEmployees.filter(e => e.daysRemaining < 0 && e.confirmationStatus !== 'confirmed').length,
        autoTriggered: confirmationEmployees.filter(e => e.autoTriggered).length
      },
      promotions: {
        total: promotionEmployees.length,
        approved: promotionEmployees.filter(e => e.promotionStatus === 'approved').length,
        pending: promotionEmployees.filter(e => e.promotionStatus === 'under_review').length,
        rejected: promotionEmployees.filter(e => e.promotionStatus === 'rejected').length,
        successRate: promotionEmployees.length > 0
          ? (promotionEmployees.filter(e => e.promotionStatus === 'approved').length / promotionEmployees.length) * 100
          : 0
      },
      buddy: {
        active: buddies.filter(b => b.status === 'active').length,
        avgRating: buddies.length > 0
          ? buddies.reduce((sum, b) => sum + (b.averageRating || 0), 0) / buddies.length
          : 0,
        assignments: buddies.reduce((sum, b) => sum + (b.newJoinerCount || 0), 0),
        feedbackCount: buddies.reduce((sum, b) => sum + (b.feedback?.length || 0), 0)
      }
    };
  }, [probationEmployees, confirmationEmployees, promotionEmployees, buddies]);

  const filteredEmployees = useMemo(() => {
    let filtered = [];

    switch (activeTab) {
      case 'probation':
        filtered = probationEmployees;
        break;
      case 'confirmation':
        filtered = confirmationEmployees;
        break;
      case 'promotions':
        filtered = promotionEmployees;
        break;
      case 'buddy':
        filtered = buddies;
        break;
      default:
        filtered = [];
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.name?.toLowerCase().includes(searchLower) ||
        emp.employeeId?.toLowerCase().includes(searchLower) ||
        emp.designation?.toLowerCase().includes(searchLower) ||
        emp.department?.toLowerCase().includes(searchLower) ||
        emp.email?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.department !== 'All') {
      filtered = filtered.filter(emp => emp.department === filters.department);
    }

    if (filters.location !== 'All') {
      filtered = filtered.filter(emp => emp.workLocation === filters.location);
    }

    if (filters.status !== 'All') {
      filtered = filtered.filter(emp => emp.status === filters.status || emp.confirmationStatus === filters.status);
    }

    if (filters.riskLevel !== 'All') {
      filtered = filtered.filter(emp => emp.riskLevel === filters.riskLevel);
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
  }, [activeTab, probationEmployees, confirmationEmployees, promotionEmployees, buddies, filters, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(startIndex, startIndex + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  const loadInitialData = () => {
    setIsLoading(true);
    setProbationEmployees([]);
    setConfirmationEmployees([]);
    setPromotionEmployees([]);
    setBuddies([]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

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

  const renderStats = () => {
    if (activeTab === 'probation') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard
            title="Total Probation"
            value={kpis.probation.total}
            subtitle="Active employees"
            icon="heroicons:users"
            color="blue"
          />
          <StatCard
            title="At Risk"
            value={kpis.probation.atRisk}
            subtitle="Needs attention"
            icon="heroicons:exclamation-triangle"
            color="red"
          />
          <StatCard
            title="Ending Soon"
            value={kpis.probation.endingSoon}
            subtitle="Within 30 days"
            icon="heroicons:clock"
            color="yellow"
          />
          <StatCard
            title="Extended"
            value={kpis.probation.extended}
            subtitle="Probation extended"
            icon="heroicons:arrows-pointing-out"
            color="cyan"
          />
          <StatCard
            title="Avg Progress"
            value={`${kpis.probation.avgProgress.toFixed(0)}%`}
            subtitle="Overall progress"
            icon="heroicons:chart-bar"
            color="green"
          />
          <StatCard
            title="In Progress"
            value={kpis.probation.inProgress}
            subtitle="Active reviews"
            icon="heroicons:document-text"
            color="purple"
          />
        </div>
      );
    }

    if (activeTab === 'confirmation') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard
            title="Total"
            value={kpis.confirmation.total}
            subtitle="For confirmation"
            icon="heroicons:user-plus"
            color="blue"
          />
          <StatCard
            title="Confirmed"
            value={kpis.confirmation.confirmed}
            subtitle="Permanent employees"
            icon="heroicons:check-circle"
            color="green"
          />
          <StatCard
            title="Pending"
            value={kpis.confirmation.pending}
            subtitle="Awaiting approval"
            icon="heroicons:clock"
            color="yellow"
          />
          <StatCard
            title="Overdue"
            value={kpis.confirmation.overdue}
            subtitle="Past due date"
            icon="heroicons:exclamation-triangle"
            color="red"
          />
          <StatCard
            title="Auto-Triggered"
            value={kpis.confirmation.autoTriggered}
            subtitle="Auto-initiated"
            icon="heroicons:rocket-launch"
            color="purple"
          />
          <StatCard
            title="Rate"
            value={`${kpis.confirmation.total > 0 ? ((kpis.confirmation.confirmed / kpis.confirmation.total) * 100).toFixed(0) : 0}%`}
            subtitle="Confirmation rate"
            icon="heroicons:chart-bar"
            color="cyan"
          />
        </div>
      );
    }

    if (activeTab === 'promotions') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard
            title="Nominations"
            value={kpis.promotions.total}
            subtitle="Total nominations"
            icon="heroicons:trophy"
            color="blue"
          />
          <StatCard
            title="Approved"
            value={kpis.promotions.approved}
            subtitle="Promoted"
            icon="heroicons:check-circle"
            color="green"
          />
          <StatCard
            title="Pending"
            value={kpis.promotions.pending}
            subtitle="Under review"
            icon="heroicons:clock"
            color="yellow"
          />
          <StatCard
            title="Rejected"
            value={kpis.promotions.rejected}
            subtitle="Not approved"
            icon="heroicons:x-circle"
            color="red"
          />
          <StatCard
            title="Success Rate"
            value={`${kpis.promotions.successRate.toFixed(0)}%`}
            subtitle="Approval rate"
            icon="heroicons:chart-bar"
            color="emerald"
          />
          <StatCard
            title="Avg Increase"
            value="18.5%"
            subtitle="Salary increase"
            icon="heroicons:trending-up"
            color="purple"
          />
        </div>
      );
    }

    if (activeTab === 'buddy') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard
            title="Active Buddies"
            value={kpis.buddy.active}
            subtitle="Available mentors"
            icon="heroicons:user-group"
            color="blue"
          />
          <StatCard
            title="Avg Rating"
            value={`${kpis.buddy.avgRating.toFixed(1)}/5`}
            subtitle="Performance"
            icon="heroicons:star"
            color="green"
          />
          <StatCard
            title="Assignments"
            value={kpis.buddy.assignments}
            subtitle="Total assigned"
            icon="heroicons:user-plus"
            color="purple"
          />
          <StatCard
            title="Feedback"
            value={kpis.buddy.feedbackCount}
            subtitle="Collected"
            icon="heroicons:chat-bubble-left-right"
            color="yellow"
          />
          <StatCard
            title="Satisfaction"
            value="94%"
            subtitle="Program satisfaction"
            icon="heroicons:emoji-happy"
            color="emerald"
          />
          <StatCard
            title="Capacity"
            value="75%"
            subtitle="Buddy capacity"
            icon="heroicons:chart-bar"
            color="cyan"
          />
        </div>
      );
    }

    return null;
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'probation':
        return (
          <tr>
            <th className="px-3 py-2 w-10">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-3 py-2 text-left font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('name')}>
              Employee Details
            </th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Reviews</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Progress</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Time Left</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Risk</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
          </tr>
        );
      case 'confirmation':
        return (
          <tr>
            <th className="px-3 py-2 w-10">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-3 py-2 text-left font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('name')}>
              Employee Details
            </th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Workflow</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Time Status</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Rating</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
          </tr>
        );
      case 'promotions':
        return (
          <tr>
            <th className="px-3 py-2 w-10">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-3 py-2 text-left font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('name')}>
              Employee Details
            </th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Current → Proposed</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Workflow</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Salary Impact</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
          </tr>
        );
      case 'buddy':
        return (
          <tr>
            <th className="px-3 py-2 w-10">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-3 py-2 text-left font-semibold text-slate-600 cursor-pointer" onClick={() => handleSort('name')}>
              Buddy Details
            </th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Assigned</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Experience</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Rating</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Capacity</th>
            <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (item) => {
    switch (activeTab) {
      case 'probation':
        return (
          <tr key={item.id} className="hover:bg-slate-50/50">
            <td className="px-3 py-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                checked={selectedRows.includes(item.id)}
                onChange={() => handleSelectRow(item.id)}
              />
            </td>
            <td className="px-3 py-2">
              <div className="flex items-center gap-3">
                <EmployeeAvatar name={item.name} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className="text-xs text-slate-400">{item.employeeId}</span>
                  </div>
                  <div className="text-sm text-slate-500">{item.designation}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span>{item.department}</span>
                    <span>•</span>
                    <span>{item.workLocation}</span>
                  </div>
                </div>
              </div>
            </td>
            <td className="px-3 py-2 text-center">{getStatusBadge(item.status)}</td>
            <td className="px-3 py-2">
              <div className="flex justify-center">
                <ReviewMilestones employee={item} />
              </div>
            </td>
            <td className="px-3 py-2">
              <ProgressBar progress={item.progress || calculateProgress(item)} />
            </td>
            <td className="px-3 py-2 text-center">
              <span className={`font-medium ${item.daysRemaining <= 0 ? 'text-rose-600' : item.daysRemaining <= 7 ? 'text-amber-600' : 'text-slate-700'}`}>
                {item.daysRemaining <= 0 ? `${Math.abs(item.daysRemaining)} days overdue` : `${item.daysRemaining} days`}
              </span>
            </td>
            <td className="px-3 py-2 text-center">{getRiskBadge(item.riskLevel)}</td>
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
                  onClick={() => openModal('review', item)}
                  title="Review"
                >
                  <Icon icon="heroicons:clipboard-document-check" className="w-4 h-4" />
                </button>
                <button
                  className="p-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-lg transition"
                  onClick={() => openModal('extend', item)}
                  title="Extend"
                >
                  <Icon icon="heroicons:arrows-pointing-out" className="w-4 h-4" />
                </button>
                <button
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                  onClick={() => openModal('earlyConfirm', item)}
                  title="Early Confirm"
                >
                  <Icon icon="heroicons:check-circle" className="w-4 h-4" />
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
                    <li><hr className="my-1" /></li>
                    <li>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        onClick={() => openModal('termination', item)}
                      >
                        <Icon icon="heroicons:x-circle" className="w-4 h-4" />
                        Terminate
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:users" className="w-5 h-5 text-blue-500" />
            {activeTab === 'probation' && 'Probation Management'}
            {activeTab === 'confirmation' && 'Employee Confirmation'}
            {activeTab === 'promotions' && 'Promotions'}
            {activeTab === 'buddy' && 'Buddy Program'}
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
            {renderTableHeaders()}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={activeTab === 'buddy' ? 8 : 7} className="text-center py-12">
                  <Icon icon="heroicons:inbox" className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <h6 className="text-slate-600 font-medium">No data found</h6>
                  <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              paginatedData.map(item => renderTableRow(item))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-slate-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredEmployees.length)} of {filteredEmployees.length} entries
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
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      currentPage === pageNum
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

  const renderFilters = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        >
          <option value="All">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="Finance">Finance</option>
        </select>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        >
          <option value="All">All Locations</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Hyderabad">Hyderabad</option>
        </select>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="All">All Status</option>
          {activeTab === 'probation' && (
            <>
              <option value="in_progress">In Progress</option>
              <option value="at_risk">At Risk</option>
              <option value="extended">Extended</option>
            </>
          )}
          {activeTab === 'confirmation' && (
            <>
              <option value="confirmed">Confirmed</option>
              <option value="pending_approval">Pending Approval</option>
            </>
          )}
          {activeTab === 'promotions' && (
            <>
              <option value="approved">Approved</option>
              <option value="under_review">Under Review</option>
              <option value="rejected">Rejected</option>
            </>
          )}
          {activeTab === 'buddy' && (
            <>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </>
          )}
        </select>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h6 className="font-bold text-sm text-slate-700">
            {activeTab === 'probation' && 'Probation Quick Actions'}
            {activeTab === 'confirmation' && 'Confirmation Quick Actions'}
            {activeTab === 'promotions' && 'Promotion Quick Actions'}
            {activeTab === 'buddy' && 'Buddy Program Quick Actions'}
          </h6>
          <p className="text-xs text-slate-500">Common management tasks</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeTab === 'probation' && (
            <>
              <button
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => showNotification('Auto-schedule reviews for all employees', 'info')}
              >
                <Icon icon="heroicons:calendar" className="w-4 h-4" />
                Auto-Schedule
              </button>
              <button
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => showNotification('Send milestone reminders', 'info')}
              >
                <Icon icon="heroicons:bell" className="w-4 h-4" />
                Send Reminders
              </button>
              <button
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => openModal('bulk')}
              >
                <Icon icon="heroicons:user-plus" className="w-4 h-4" />
                Bulk Actions
              </button>
            </>
          )}

          {activeTab === 'confirmation' && (
            <>
              <button
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => showNotification('Auto-trigger confirmation process', 'info')}
              >
                <Icon icon="heroicons:play" className="w-4 h-4" />
                Auto-Trigger
              </button>
              <button
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => showNotification('Send approval reminders', 'info')}
              >
                <Icon icon="heroicons:envelope" className="w-4 h-4" />
                Send Reminders
              </button>
              <button
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => openModal('bulk')}
              >
                <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                Bulk Process
              </button>
            </>
          )}

          {activeTab === 'promotions' && (
            <>
              <button
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => showNotification('New nomination form opened', 'info')}
              >
                <Icon icon="heroicons:plus" className="w-4 h-4" />
                New Nomination
              </button>
              <button
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => showNotification('Running eligibility check', 'info')}
              >
                <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                Check Eligibility
              </button>
              <button
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => showNotification('Committee review scheduled', 'info')}
              >
                <Icon icon="heroicons:calendar" className="w-4 h-4" />
                Schedule Review
              </button>
            </>
          )}

          {activeTab === 'buddy' && (
            <>
              <button
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => showNotification('Buddy assignment form opened', 'info')}
              >
                <Icon icon="heroicons:user-plus" className="w-4 h-4" />
                Assign Buddies
              </button>
              <button
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => showNotification('Auto-assign based on rules', 'info')}
              >
                <Icon icon="heroicons:cog" className="w-4 h-4" />
                Auto-Assign
              </button>
              <button
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                onClick={() => showNotification('Feedback collection initiated', 'info')}
              >
                <Icon icon="heroicons:chat-bubble-left-right" className="w-4 h-4" />
                Collect Feedback
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="flex flex-wrap gap-1 mb-6 border-b border-slate-200">
      {[
        { id: 'probation', label: 'Probation Management', icon: 'heroicons:document-search', badge: kpis.probation.atRisk },
        { id: 'confirmation', label: 'Employee Confirmation', icon: 'heroicons:document-check', badge: kpis.confirmation.overdue },
        { id: 'promotions', label: 'Promotions', icon: 'heroicons:trophy', badge: kpis.promotions.total },
        { id: 'buddy', label: 'Buddy Program', icon: 'heroicons:user-group', badge: kpis.buddy.active }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            setCurrentPage(1);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Icon icon={tab.icon} className="w-4 h-4" />
          {tab.label}
          {tab.badge > 0 && (
            <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full ${
              activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
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
            <Icon icon="heroicons:arrow-trending-up" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Promotions & Career Progression</h1>
            <p className="text-sm text-slate-500">Manage probation, confirmation, promotions and buddy programs</p>
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
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
        getRiskBadge={getRiskBadge}
      />

      <ReviewModal
        isOpen={modalState.isOpen && modalState.type === 'review'}
        onClose={closeModal}
        onSubmit={(data) => {
          showNotification('Review submitted successfully!', 'success');
          closeModal();
        }}
        employee={modalState.data}
        mode="probation"
        formatDate={formatDate}
      />

      <ExtendModal
        isOpen={modalState.isOpen && modalState.type === 'extend'}
        onClose={closeModal}
        onSubmit={(data) => {
          showNotification('Probation extended successfully!', 'success');
          closeModal();
        }}
        employee={modalState.data}
      />

      <EarlyConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'earlyConfirm'}
        onClose={closeModal}
        onSubmit={(data) => {
          showNotification('Employee confirmed early!', 'success');
          closeModal();
        }}
        employee={modalState.data}
      />

      <EmailModal
        isOpen={modalState.isOpen && modalState.type === 'email'}
        onClose={closeModal}
        onSendEmail={(data) => {
          showNotification(`Email sent to ${data.employee?.name}`, 'success');
          closeModal();
        }}
        selectedEmployee={modalState.data}
        employee={modalState.data}
        emailSubject="Subject"
        setEmailSubject={() => { }}
        emailTemplate="Message"
        setEmailTemplate={() => { }}
        mode="promotions"
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

      <TerminationModal
        isOpen={modalState.isOpen && modalState.type === 'termination'}
        onClose={closeModal}
        onSubmit={(data) => {
          showNotification('Employee terminated successfully!', 'warning');
          closeModal();
        }}
        employee={modalState.data}
      />

      <BulkV2Modal
        isOpen={modalState.isOpen && modalState.type === 'bulk'}
        onClose={closeModal}
        onSubmit={(data) => {
          showNotification(`Bulk action "${data.action}" applied to selected employees!`, 'success');
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

export default PromotionsCareer;