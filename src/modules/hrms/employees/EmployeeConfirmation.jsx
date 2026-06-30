import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StatCard from '../../../shared/components/StatCard';
import ReportModal from '../modal/ReportModal';
import DetailsModal from '../modal/DetailsModal';
import ExportModal from '../modal/ExportModal';
import LetterModal from '../modal/LetterModal';
import BulkActionModal from '../modal/BulkActionModal';
import RejectionModal from '../modal/RejectionModal';
import ExtensionModal from '../modal/ExtensionModal';
import ConfirmationModal from '../modal/ConfirmationModal';
import ReviewModal from '../modal/ReviewModal';

const EmployeeConfirmation = () => {
  const [employees, setEmployees] = useState([]);

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterEligibility, setFilterEligibility] = useState('all');
  const [sortBy, setSortBy] = useState('confirmationDueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 8;
  const departments = ['Engineering', 'Human Resources', 'Sales', 'Marketing', 'Finance', 'Product', 'Quality Assurance'];

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

  const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status) => {
    const styles = {
      'pending_review': 'bg-amber-50 text-amber-700 border border-amber-200',
      'under_review': 'bg-blue-50 text-blue-700 border border-blue-200',
      'pending_approval': 'bg-purple-50 text-purple-700 border border-purple-200',
      'confirmed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'extended': 'bg-slate-50 text-slate-700 border border-slate-200',
      'overdue': 'bg-rose-50 text-rose-700 border border-rose-200',
      'terminated': 'bg-slate-50 text-slate-700 border border-slate-200'
    };

    const labels = {
      'pending_review': 'Pending Review',
      'under_review': 'Under Review',
      'pending_approval': 'Pending Approval',
      'confirmed': 'Confirmed',
      'extended': 'Extended',
      'overdue': 'Overdue',
      'terminated': 'Terminated'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {labels[status] || status || 'N/A'}
      </span>
    );
  };

  const getEligibilityBadge = (eligibility) => {
    const styles = {
      'eligible': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'conditional': 'bg-amber-50 text-amber-700 border border-amber-200',
      'not_eligible': 'bg-rose-50 text-rose-700 border border-rose-200'
    };

    const labels = {
      'eligible': 'Eligible',
      'conditional': 'Conditional',
      'not_eligible': 'Not Eligible'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[eligibility] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {labels[eligibility] || eligibility || 'N/A'}
      </span>
    );
  };

  const getRecommendationBadge = (recommendation) => {
    const styles = {
      'recommended': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'recommended_with_conditions': 'bg-amber-50 text-amber-700 border border-amber-200',
      'not_recommended': 'bg-rose-50 text-rose-700 border border-rose-200',
      'pending': 'bg-slate-50 text-slate-700 border border-slate-200',
      'approved': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'approved_extension': 'bg-blue-50 text-blue-700 border border-blue-200',
      'rejected': 'bg-rose-50 text-rose-700 border border-rose-200'
    };

    const labels = {
      'recommended': 'Recommended',
      'recommended_with_conditions': 'Conditional',
      'not_recommended': 'Not Recommended',
      'pending': 'Pending',
      'approved': 'Approved',
      'approved_extension': 'Extension Approved',
      'rejected': 'Rejected'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[recommendation] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {labels[recommendation] || recommendation || 'N/A'}
      </span>
    );
  };

  const loadInitialData = () => {
    setEmployees([]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const stats = useMemo(() => {
    const total = employees.length;
    const pendingReview = employees.filter(e => e.status === 'pending_review' || e.status === 'under_review').length;
    const pendingApproval = employees.filter(e => e.status === 'pending_approval').length;
    const confirmed = employees.filter(e => e.status === 'confirmed').length;
    const extended = employees.filter(e => e.status === 'extended').length;
    const overdue = employees.filter(e => e.daysRemaining < 0 && e.status !== 'confirmed' && e.status !== 'extended').length;

    return {
      total,
      pendingReview,
      pendingApproval,
      confirmed,
      extended,
      overdue,
      dueThisWeek: employees.filter(e => e.daysRemaining <= 7 && e.daysRemaining >= 0).length,
      highRisk: employees.filter(e => e.riskLevel === 'high').length,
      eligible: employees.filter(e => e.confirmationEligibility === 'eligible').length,
      conditional: employees.filter(e => e.confirmationEligibility === 'conditional').length
    };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const searchMatch =
          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.designation?.toLowerCase().includes(searchTerm.toLowerCase());

        const statusMatch = filterStatus === 'all' || emp.status === filterStatus;
        const deptMatch = filterDepartment === 'all' || emp.department === filterDepartment;
        const eligibilityMatch = filterEligibility === 'all' || emp.confirmationEligibility === filterEligibility;

        return searchMatch && statusMatch && deptMatch && eligibilityMatch;
      })
      .sort((a, b) => {
        let A = a[sortBy] || '';
        let B = b[sortBy] || '';

        if (sortBy === 'name' || sortBy === 'designation' || sortBy === 'department') {
          A = A.toLowerCase();
          B = B.toLowerCase();
        }

        if (sortBy === 'daysRemaining') {
          A = a.daysRemaining || 0;
          B = b.daysRemaining || 0;
        }

        if (sortBy === 'confirmationDueDate' || sortBy === 'joiningDate' || sortBy === 'confirmationDate') {
          A = new Date(A);
          B = new Date(B);
        }

        if (A < B) return sortOrder === 'asc' ? -1 : 1;
        if (A > B) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [employees, searchTerm, filterStatus, filterDepartment, filterEligibility, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === paginatedEmployees.length && paginatedEmployees.length > 0) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(paginatedEmployees.map(emp => emp.id));
    }
  };

  const handleInitiateReview = (employee) => {
    openModal('review', employee);
  };

  const handleSubmitReview = (data) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === modalState.data.id) {
        const updatedEmp = { ...emp };
        updatedEmp.managerComments = data.managerAssessment;
        updatedEmp.hrComments = data.hrAssessment;
        updatedEmp.currentRating = data.rating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

        if (data.decision === 'confirm') {
          updatedEmp.managerRecommendation = 'recommended';
          updatedEmp.hrRecommendation = 'approved';
          updatedEmp.status = 'pending_approval';
        } else if (data.decision === 'extend') {
          updatedEmp.managerRecommendation = 'recommended_with_conditions';
          updatedEmp.hrRecommendation = 'approved_extension';
          updatedEmp.status = 'pending_approval';
        } else if (data.decision === 'reject') {
          updatedEmp.managerRecommendation = 'not_recommended';
          updatedEmp.hrRecommendation = 'rejected';
          updatedEmp.status = 'pending_approval';
        }

        updatedEmp.review90 = {
          completed: true,
          date: data.reviewDate,
          rating: data.rating.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
        };

        return updatedEmp;
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    closeModal();
    showNotification(`Final review submitted for ${modalState.data.name}`, 'success');
  };

  const handleConfirmEmployee = (employee) => {
    openModal('confirm', employee);
  };

  const handleSubmitConfirmation = (data) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === modalState.data.id) {
        return {
          ...emp,
          status: 'confirmed',
          confirmationDate: data.confirmationDate,
          confirmationEffectiveDate: data.effectiveDate,
          confirmationLetterGenerated: data.generateLetter,
          departmentHeadApproval: 'approved',
          confirmationAuthority: 'approved',
          confirmationStatus: 'confirmed'
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    closeModal();
    showNotification(`${modalState.data.name} has been confirmed as permanent employee`, 'success');
  };

  const handleExtendProbation = (employee) => {
    openModal('extend', employee);
  };

  const handleSubmitExtension = (data) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === modalState.data.id) {
        const newDate = new Date(data.newConfirmationDate);
        const daysRemaining = calculateDaysRemaining(newDate);

        return {
          ...emp,
          status: 'extended',
          confirmationDueDate: data.newConfirmationDate,
          daysRemaining: daysRemaining,
          extensionCount: (emp.extensionCount || 0) + 1,
          extendedTo: data.newConfirmationDate,
          confirmationEligibility: 'conditional',
          riskLevel: 'high',
          departmentHeadApproval: 'approved',
          confirmationAuthority: 'approved_extension',
          confirmationStatus: 'extended'
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    closeModal();
    showNotification(`Probation extended for ${modalState.data.name} until ${formatDate(data.newConfirmationDate)}`, 'success');
  };

  const handleRejectConfirmation = (employee) => {
    openModal('reject', employee);
  };

  const handleSubmitRejection = (data) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === modalState.data.id) {
        return {
          ...emp,
          status: 'terminated',
          confirmationEligibility: 'not_eligible',
          departmentHeadApproval: 'rejected',
          confirmationAuthority: 'rejected',
          confirmationStatus: 'rejected',
          terminationDate: data.terminationDate
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    closeModal();
    showNotification(`Confirmation rejected for ${modalState.data.name}. Termination initiated.`, 'error');
  };

  const handleGenerateLetter = (employee) => {
    openModal('letter', employee);
  };

  const handleSubmitLetter = () => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === modalState.data.id) {
        return { ...emp, confirmationLetterGenerated: true };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    closeModal();
    showNotification(`Confirmation letter generated for ${modalState.data.name}`, 'success');
  };

  const handleBulkAction = (data) => {
    switch (data.action) {
      case 'confirm':
        const confirmedEmployees = employees.map(emp => {
          if (selectedEmployees.includes(emp.id)) {
            return {
              ...emp,
              status: 'confirmed',
              confirmationDate: data.date,
              confirmationEffectiveDate: data.date,
              confirmationLetterGenerated: data.generateLetters,
              departmentHeadApproval: 'approved',
              confirmationAuthority: 'approved',
              confirmationStatus: 'confirmed'
            };
          }
          return emp;
        });
        setEmployees(confirmedEmployees);
        showNotification(`${selectedEmployees.length} employees confirmed`, 'success');
        break;

      case 'extend':
        const extendedEmployees = employees.map(emp => {
          if (selectedEmployees.includes(emp.id)) {
            const newDate = new Date(emp.confirmationDueDate);
            newDate.setDate(newDate.getDate() + parseInt(data.extensionDays || 30));
            return {
              ...emp,
              status: 'extended',
              confirmationDueDate: newDate.toISOString().split('T')[0],
              daysRemaining: calculateDaysRemaining(newDate),
              extensionCount: (emp.extensionCount || 0) + 1,
              confirmationEligibility: 'conditional',
              riskLevel: 'high'
            };
          }
          return emp;
        });
        setEmployees(extendedEmployees);
        showNotification(`Probation extended for ${selectedEmployees.length} employees`, 'success');
        break;

      case 'remind_managers':
        showNotification(`Reminders sent to managers of ${selectedEmployees.length} employees`, 'info');
        break;

      case 'export_data':
        showNotification(`Exporting data for ${selectedEmployees.length} employees`, 'info');
        break;
    }

    setSelectedEmployees([]);
    closeModal();
  };

  const handleGenerateReport = (data) => {
    showNotification(`Report generated for period ${formatDate(data.startDate)} to ${formatDate(data.endDate)}`, 'success');
    closeModal();
  };

  const handleViewDetails = (employee) => {
    openModal('details', employee);
  };

  const handleSendReminders = () => {
    const pendingReviews = employees.filter(
      emp => emp.status === 'pending_review' || emp.status === 'under_review'
    );

    if (pendingReviews.length === 0) {
      showNotification('No pending reviews at this time', 'info');
      return;
    }

    showNotification(`Reminders sent to managers of ${pendingReviews.length} employees for pending reviews`, 'success');
  };

  const handleApprovePending = () => {
    const pendingApprovals = employees.filter(emp => emp.status === 'pending_approval');

    if (pendingApprovals.length === 0) {
      showNotification('No pending approvals at this time', 'info');
      return;
    }

    const updatedEmployees = employees.map(emp => {
      if (emp.status === 'pending_approval') {
        return {
          ...emp,
          departmentHeadApproval: 'approved',
          confirmationAuthority: 'approved',
          status: 'confirmed',
          confirmationDate: new Date().toISOString().split('T')[0]
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    showNotification(`${pendingApprovals.length} pending approvals confirmed`, 'success');
  };

  const handleExportData = () => {
    openModal('report');
  };

  const handleAutoTriggerReviews = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employeesToReview = employees.filter(emp => {
      if (emp.status === 'confirmed' || emp.status === 'terminated' || emp.status === 'extended') {
        return false;
      }

      const dueDate = new Date(emp.confirmationDueDate);
      dueDate.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      return daysUntilDue <= 7 && daysUntilDue >= 0 &&
        (emp.status === 'in_progress' || emp.status === 'pending_review');
    });

    if (employeesToReview.length === 0) {
      showNotification('No employees require auto-triggered reviews at this time', 'info');
      return;
    }

    showNotification(`Auto-triggered reviews for ${employeesToReview.length} employees due within 7 days`, 'info');
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <StatCard
        title="Total"
        value={stats.total}
        subtitle="Employees"
        icon="heroicons:users"
        color="blue"
      />
      <StatCard
        title="Pending Review"
        value={stats.pendingReview}
        subtitle="Awaiting review"
        icon="heroicons:clock"
        color="yellow"
      />
      <StatCard
        title="Pending Approval"
        value={stats.pendingApproval}
        subtitle="Awaiting approval"
        icon="heroicons:document-check"
        color="purple"
      />
      <StatCard
        title="Confirmed"
        value={stats.confirmed}
        subtitle="Permanent"
        icon="heroicons:check-circle"
        color="green"
      />
      <StatCard
        title="Extended"
        value={stats.extended}
        subtitle="Probation extended"
        icon="heroicons:clock"
        color="slate"
      />
      <StatCard
        title="Overdue"
        value={stats.overdue}
        subtitle="Past due date"
        icon="heroicons:exclamation-triangle"
        color="red"
      />
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h6 className="font-bold text-sm text-slate-700">Quick Actions</h6>
          <p className="text-xs text-slate-500">Common confirmation management tasks</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={handleSendReminders}
          >
            <Icon icon="heroicons:bell" className="w-4 h-4" />
            Send Reminders
          </button>
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={handleApprovePending}
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            Approve Pending
          </button>
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={handleExportData}
          >
            <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
            Export Data
          </button>
          <button
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={handleAutoTriggerReviews}
          >
            <Icon icon="heroicons:clock" className="w-4 h-4" />
            Auto-Trigger Reviews
          </button>
        </div>
      </div>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending_review">Pending Review</option>
          <option value="under_review">Under Review</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="confirmed">Confirmed</option>
          <option value="extended">Extended</option>
        </select>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          value={filterEligibility}
          onChange={(e) => setFilterEligibility(e.target.value)}
        >
          <option value="all">All Eligibility</option>
          <option value="eligible">Eligible</option>
          <option value="conditional">Conditional</option>
          <option value="not_eligible">Not Eligible</option>
        </select>
      </div>
    </div>
  );

  const renderEmployeesTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <Icon icon="heroicons:users" className="w-5 h-5 text-blue-500" />
            Employees ({filteredEmployees.length})
          </h5>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => openModal('bulk')}
              disabled={selectedEmployees.length === 0}
            >
              <Icon icon="heroicons:collection" className="w-4 h-4" />
              Bulk ({selectedEmployees.length})
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
                  checked={selectedEmployees.length === paginatedEmployees.length && paginatedEmployees.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600">Employee</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 hidden md:table-cell">Department</th>
              <th className="px-3 py-2 text-center font-semibold text-slate-600 hidden lg:table-cell">Status</th>
              <th className="px-3 py-2 text-center font-semibold text-slate-600">Eligibility</th>
              <th className="px-3 py-2 text-center font-semibold text-slate-600 hidden lg:table-cell">Due Date</th>
              <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12">
                  <Icon icon="heroicons:users" className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <h6 className="text-slate-600 font-medium">No employees found</h6>
                  <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              paginatedEmployees.map(emp => (
                <tr key={emp.id} className={`hover:bg-slate-50/50 ${selectedEmployees.includes(emp.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => handleSelectEmployee(emp.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium text-slate-800">{emp.name}</div>
                    <div className="text-xs text-slate-500">{emp.employeeId} • {emp.designation}</div>
                  </td>
                  <td className="px-3 py-2 text-slate-700 hidden md:table-cell">{emp.department}</td>
                  <td className="px-3 py-2 text-center hidden lg:table-cell">{getStatusBadge(emp.status)}</td>
                  <td className="px-3 py-2 text-center">{getEligibilityBadge(emp.confirmationEligibility)}</td>
                  <td className="px-3 py-2 text-center hidden lg:table-cell">
                    <div className={`font-medium ${emp.daysRemaining <= 0 ? 'text-rose-600' : emp.daysRemaining <= 7 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {emp.daysRemaining <= 0 ? Math.abs(emp.daysRemaining) + ' days overdue' : emp.daysRemaining + ' days'}
                    </div>
                    <div className="text-xs text-slate-400">{formatDate(emp.confirmationDueDate)}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                        onClick={() => handleViewDetails(emp)}
                        title="View Details"
                      >
                        <Icon icon="heroicons:eye" className="w-4 h-4" />
                      </button>

                      {emp.status !== 'confirmed' && emp.status !== 'terminated' && (
                        <>
                          {(emp.status === 'pending_review' || emp.status === 'under_review') && (
                            <button
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                              onClick={() => handleInitiateReview(emp)}
                              title="Initiate Review"
                            >
                              <Icon icon="heroicons:document-text" className="w-4 h-4" />
                            </button>
                          )}

                          {emp.status === 'pending_approval' && (
                            <>
                              <button
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                onClick={() => handleConfirmEmployee(emp)}
                                title="Confirm"
                              >
                                <Icon icon="heroicons:check-circle" className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition"
                                onClick={() => handleExtendProbation(emp)}
                                title="Extend"
                              >
                                <Icon icon="heroicons:clock" className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                onClick={() => handleRejectConfirmation(emp)}
                                title="Reject"
                              >
                                <Icon icon="heroicons:x-circle" className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </>
                      )}

                      {emp.status === 'confirmed' && !emp.confirmationLetterGenerated && (
                        <button
                          className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition"
                          onClick={() => handleGenerateLetter(emp)}
                          title="Generate Letter"
                        >
                          <Icon icon="heroicons:document-text" className="w-4 h-4" />
                        </button>
                      )}
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
          </div>
          <div className="flex gap-2">
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
    <div className="mx-auto max-w-7xl ">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
            <Icon icon="heroicons:document-check" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Employee Confirmation Management</h1>
            <p className="text-sm text-slate-500">Manage employee confirmation processes after probation period</p>
          </div>
        </div>
      </div>

      {renderStats()}
      {renderQuickActions()}
      {renderFilters()}
      {renderEmployeesTable()}

      <ReviewModal
        isOpen={modalState.isOpen && modalState.type === 'review'}
        onClose={closeModal}
        onSubmit={handleSubmitReview}
        employee={modalState.data}
        formatDate={formatDate}
      />

      <ConfirmationModal
        isOpen={modalState.isOpen && modalState.type === 'confirm'}
        onClose={closeModal}
        onSubmit={handleSubmitConfirmation}
        employee={modalState.data}
      />

      <ExtensionModal
        isOpen={modalState.isOpen && modalState.type === 'extend'}
        onClose={closeModal}
        onSubmit={handleSubmitExtension}
        employee={modalState.data}
        formatDate={formatDate}
      />

      <RejectionModal
        isOpen={modalState.isOpen && modalState.type === 'reject'}
        onClose={closeModal}
        onSubmit={handleSubmitRejection}
        employee={modalState.data}
      />

      <BulkActionModal
        isOpen={modalState.isOpen && modalState.type === 'bulk'}
        onClose={closeModal}
        onSubmit={handleBulkAction}
        selectedCount={selectedEmployees.length}
      />

      <LetterModal
        isOpen={modalState.isOpen && modalState.type === 'letter'}
        onClose={closeModal}
        onGenerate={handleSubmitLetter}
        employee={modalState.data}
        formatDate={formatDate}
      />

      <DetailsModal
        isOpen={modalState.isOpen && modalState.type === 'details'}
        onClose={closeModal}
        employee={modalState.data}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
        getEligibilityBadge={getEligibilityBadge}
        getRecommendationBadge={getRecommendationBadge}
        onAction={(action, employee) => {
          closeModal();
          if (action === 'review') handleInitiateReview(employee);
        }}
      />

      <ReportModal
        isOpen={modalState.isOpen && modalState.type === 'report'}
        onClose={closeModal}
        onGenerate={handleGenerateReport}
        employees={employees}
        departments={departments}
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

export default EmployeeConfirmation;