// EmployeeLifecycleManagement.jsx
import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';


/*
  - Kept all original data & sections from your file.
  - Modernized layout, consistent controls (search, filters, refresh, export).
  - Added handlers: approve/reject transfer, start/complete probation, generate/export CSV, modals.
  - Kept Bootstrap classes to fit your app's theme.
*/

const EmployeeLifecycle = () => {
  // ----- core UI state -----
  const [activeTab, setActiveTab] = useState('dashboard');
  

  // search / filter / pagination shared state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // selected item for modals/details
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // ----- original mock data (kept unchanged) -----
  const employees = [
    {
      id: 'EMP001',
      name: 'John Smith',
      email: 'john.smith@company.com',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      stage: 'active',
      hireDate: '2022-03-15',
      probationEndDate: '2022-09-15',
      nextReviewDate: '2024-09-01',
      manager: 'Sarah Johnson'
    },
    {
      id: 'EMP002',
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      department: 'Marketing',
      position: 'Marketing Specialist',
      stage: 'probation',
      hireDate: '2024-01-10',
      probationEndDate: '2024-07-10',
      nextReviewDate: '2024-06-20',
      manager: 'Michael Brown'
    },
    {
      id: 'EMP003',
      name: 'David Chen',
      email: 'david.chen@company.com',
      department: 'Sales',
      position: 'Account Executive',
      stage: 'transfer-pending',
      hireDate: '2021-11-20',
      probationEndDate: '2022-05-20',
      nextReviewDate: '2024-08-15',
      manager: 'Robert Davis'
    },
    {
      id: 'EMP004',
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@company.com',
      department: 'HR',
      position: 'HR Business Partner',
      stage: 'exit-process',
      hireDate: '2020-08-05',
      probationEndDate: '2021-02-05',
      noticePeriodEnd: '2024-06-30',
      manager: 'Jennifer Lee'
    },
    {
      id: 'EMP005',
      name: 'Alex Turner',
      email: 'alex.turner@company.com',
      department: 'Finance',
      position: 'Financial Analyst',
      stage: 'contract-renewal',
      hireDate: '2022-06-15',
      contractEndDate: '2024-06-15',
      nextReviewDate: '2024-05-30',
      manager: 'Thomas Wilson'
    }
  ];

  // Joining checklist
  const [onboardingChecklist, setOnboardingChecklist] = useState([
    { id: 1, task: 'Offer Letter Acceptance', status: 'completed', assignedTo: 'HR', dueDate: '2024-03-01' },
    { id: 2, task: 'Background Verification', status: 'pending', assignedTo: 'HR', dueDate: '2024-03-05' },
    { id: 3, task: 'IT Account Setup', status: 'in-progress', assignedTo: 'IT', dueDate: '2024-03-03' },
    { id: 4, task: 'Equipment Allocation', status: 'pending', assignedTo: 'Admin', dueDate: '2024-03-04' },
    { id: 5, task: 'First Day Orientation', status: 'pending', assignedTo: 'HR', dueDate: '2024-03-06' }
  ]);

  // Probation
  const [probationReviews, setProbationReviews] = useState([
    { id: 1, employeeId: 'EMP002', employeeName: 'Emma Wilson', reviewDate: '2024-04-10', status: 'pending', manager: 'Michael Brown' },
    { id: 2, employeeId: 'EMP006', employeeName: 'Ryan Cooper', reviewDate: '2024-03-25', status: 'completed', rating: 'Exceeds Expectations' },
    { id: 3, employeeId: 'EMP007', employeeName: 'Sophia Martinez', reviewDate: '2024-04-15', status: 'scheduled', manager: 'David Kim' }
  ]);

  // Transfers
  const [transferRequests, setTransferRequests] = useState([
    { id: 'TR001', employeeId: 'EMP003', employeeName: 'David Chen', fromDept: 'Sales', toDept: 'Business Development', type: 'Inter-department', status: 'pending', requestDate: '2024-03-01' },
    { id: 'TR002', employeeId: 'EMP008', employeeName: 'James Wilson', fromLocation: 'New York', toLocation: 'San Francisco', type: 'Inter-location', status: 'approved', requestDate: '2024-02-15', effectiveDate: '2024-04-01' },
    { id: 'TR003', employeeId: 'EMP009', employeeName: 'Maria Garcia', fromDept: 'Marketing', toDept: 'Product', type: 'Internal Job Posting', status: 'in-review', requestDate: '2024-03-05' }
  ]);

  // Exit
  const [exitProcesses, setExitProcesses] = useState([
    { id: 'EX001', employeeId: 'EMP004', employeeName: 'Lisa Rodriguez', noticePeriodStart: '2024-04-01', lastWorkingDay: '2024-06-30', status: 'in-process', clearancePending: 2 },
    { id: 'EX002', employeeId: 'EMP010', employeeName: 'Brian Taylor', lastWorkingDay: '2024-03-20', status: 'completed', exitStatus: 'Processed' },
    { id: 'EX003', employeeId: 'EMP011', employeeName: 'Amanda Scott', noticePeriodStart: '2024-04-15', lastWorkingDay: '2024-07-15', status: 'initiated', clearancePending: 4 }
  ]);

  // Contracts
  const contractRenewals = [
    { id: 'CR001', employeeId: 'EMP005', employeeName: 'Alex Turner', contractType: 'Fixed Term', endDate: '2024-06-15', renewalStatus: 'pending', daysRemaining: 45 },
    { id: 'CR002', employeeId: 'EMP012', employeeName: 'Kevin Brown', contractType: 'Project Based', endDate: '2024-05-30', renewalStatus: 'in-progress', daysRemaining: 30 },
    { id: 'CR003', employeeId: 'EMP013', employeeName: 'Olivia Davis', contractType: 'Fixed Term', endDate: '2024-07-31', renewalStatus: 'pending', daysRemaining: 90 }
  ];

  // Sidebar menu (kept)
  const menuItems = [
    { title: 'Lifecycle Dashboard', icon: 'heroicons:home', id: 'dashboard' },
    { title: 'Joining Process', icon: 'heroicons:user-plus', id: 'joining' },
    { title: 'Active Employment', icon: 'heroicons:users', id: 'active' },
    { title: 'Transfers & Movements', icon: 'heroicons:arrow-right-circle', id: 'transfers' },
    { title: 'Exit Management', icon: 'heroicons:user-minus', id: 'exit' },
    { title: 'Reports & Analytics', icon: 'heroicons:chart-bar', id: 'reports' },
    { title: 'Settings', icon: 'heroicons:cog-6-tooth', id: 'settings' }
  ];

  const userInfo = {
    name: 'HR Manager',
    role: 'Human Resources',
    email: 'hr.manager@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HR'
  };

  // ----- helpers (status badges etc) -----
  const getStageBadge = (stage) => {
    const styles = {
      'active': 'bg-success-subtle text-success',
      'probation': 'bg-warning-subtle text-warning',
      'transfer-pending': 'bg-info-subtle text-info',
      'exit-process': 'bg-danger-subtle text-danger',
      'contract-renewal': 'bg-primary-subtle text-primary'
    };
    const labels = {
      'active': 'Active',
      'probation': 'Probation',
      'transfer-pending': 'Transfer Pending',
      'exit-process': 'Exit Process',
      'contract-renewal': 'Contract Renewal'
    };
    return <span className={`badge ${styles[stage] || 'bg-secondary-subtle text-secondary'}`}>{labels[stage] || stage}</span>;
  };

  const getStatusBadge = (status) => {
    const styles = {
      'completed': 'bg-success-subtle text-success',
      'pending': 'bg-warning-subtle text-warning',
      'in-progress': 'bg-info-subtle text-info',
      'approved': 'bg-success-subtle text-success',
      'rejected': 'bg-danger-subtle text-danger',
      'in-review': 'bg-primary-subtle text-primary',
      'in-process': 'bg-warning-subtle text-warning',
      'initiated': 'bg-info-subtle text-info',
      'scheduled': 'bg-primary-subtle text-primary'
    };
    return <span className={`badge ${styles[status] || 'bg-secondary-subtle text-secondary'}`}>{typeof status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : status}</span>;
  };



  // ----- generic utilities: filter + paginate -----
  const getFilteredList = (list, keyFields = []) => {
    const lower = searchTerm.trim().toLowerCase();
    let filtered = list.filter(item => {
      if (!lower) return true;
      // check fields provided or all string fields
      if (keyFields.length) {
        return keyFields.some(k => (String(item[k] || '')).toLowerCase().includes(lower));
      }
      // fallback: search in all string props
      return Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes(lower));
    });

    if (filterStatus !== 'All') {
      filtered = filtered.filter(item => {
        // item.status or item.stage etc.
        return (item.status || item.stage || '').toLowerCase() === filterStatus.toLowerCase();
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

  // ----- actions (approve/reject etc) -----
  const approveTransfer = (id) => {
    setTransferRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', effectiveDate: new Date().toISOString().split('T')[0] } : r));
    alert('Transfer approved');
  };

  const rejectTransfer = (id) => {
    setTransferRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    alert('Transfer rejected');
  };

  const startProbationReview = (reviewId) => {
    setProbationReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'in-progress' } : r));
    alert('Probation review started');
  };

  const completeProbationReview = (reviewId, rating) => {
    setProbationReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'completed', rating } : r));
    alert('Probation review completed');
  };

  const initiateExit = (employeeId) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;
    setExitProcesses(prev => {
      const newExit = {
        id: `EX${String(prev.length + 1).padStart(3, '0')}`,
        employeeId: emp.id,
        employeeName: emp.name,
        noticePeriodStart: new Date().toISOString().split('T')[0],
        lastWorkingDay: '',
        status: 'initiated',
        clearancePending: 3
      };
      return [newExit, ...prev];
    });
    alert('Exit initiated for ' + emp.name);
  };

  const refreshData = () => {
    
    setTimeout(() => {
     
      setSearchTerm('');
      setFilterStatus('All');
      setCurrentPage(1);
      alert('Data refreshed');
    }, 600);
  };

  const exportCsv = (name, list, headers, mapRow) => {
    const rows = [headers, ...list.map(mapRow)];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // ----- render helpers for each tab (kept content) -----

  const renderTopActions = () => (
    <div className="d-flex flex-wrap gap-3 align-items-center">
      <div className="flex-fill flex-md-grow-0" style={{ minWidth: 0, maxWidth: 720 }}>
        <div className="position-relative">
          <input
            type="text"
            className="form-control ps-3"
            placeholder="Search across current view..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ paddingRight: '2.5rem' }}
          />
          <Icon icon="heroicons:magnifying-glass" className="position-absolute top-50 translate-middle-y end-0 me-3 text-muted" />
        </div>
      </div>

      <select className="form-select w-auto" style={{ minWidth: 140 }} value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
        <option value="All">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      <div className="d-flex gap-2 flex-wrap">
        <button className="btn btn-outline-primary btn-sm" onClick={refreshData}>
          <Icon icon="heroicons:arrow-path" className="me-2" /> Refresh
        </button>

        <button className="btn btn-primary btn-sm" onClick={() => {
          // example export behavior depending on activeTab
          if (activeTab === 'transfers') {
            exportCsv('transfer_requests', transferRequests, ['ID','Employee','From','To','Type','Status','Requested'], r => [r.id, r.employeeName, r.fromDept || r.fromLocation || '-', r.toDept || r.toLocation || '-', r.type, r.status, r.requestDate]);
          } else if (activeTab === 'joining') {
            exportCsv('onboarding_checklist', onboardingChecklist, ['Task','AssignedTo','DueDate','Status'], t => [t.task, t.assignedTo, t.dueDate, t.status]);
          } else if (activeTab === 'exit') {
            exportCsv('exit_processes', exitProcesses, ['ID','Employee','LastWorkingDay','Status','ClearancePending'], e => [e.id, e.employeeName, e.lastWorkingDay || '-', e.status, e.clearancePending || 0]);
          } else {
            alert('Export for this tab not configured — choose Transfers/Joining/Exit.');
          }
        }}>
          <Icon icon="heroicons:document-arrow-down" className="me-2" /> Export
        </button>
      </div>
    </div>
  );

  // --- Dashboard (kept but cleaned) ---
  const renderDashboard = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border shadow-none">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-1">Employee Lifecycle Management</h5>
              <p className="text-muted mb-0">Manage complete employee journey from joining to exit</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary" onClick={() => setActiveTab('joining')}>
                <Icon icon="heroicons:user-plus" className="me-2" /> Joining
              </button>
              <button className="btn btn-outline-primary" onClick={() => setActiveTab('transfers')}>
                <Icon icon="heroicons:arrow-right-circle" className="me-2" /> Transfers
              </button>
              <button className="btn btn-outline-primary" onClick={() => setActiveTab('exit')}>
                <Icon icon="heroicons:user-minus" className="me-2" /> Exit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* simple KPI cards */}
      <div className="col-md-3">
        <div className="card border h-100">
          <div className="card-body text-center">
            <div className="mb-2"><Icon icon="heroicons:user-plus" className="fs-3 text-primary" /></div>
            <p className="text-muted small mb-1">New Joinings</p>
            <h4 className="mb-0">12</h4>
            <p className="text-muted small">This month</p>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border h-100">
          <div className="card-body text-center">
            <div className="mb-2"><Icon icon="heroicons:clock" className="fs-3 text-warning" /></div>
            <p className="text-muted small mb-1">Pending Probation</p>
            <h4 className="mb-0">{probationReviews.filter(r => r.status === 'pending').length}</h4>
            <p className="text-muted small">Pending reviews</p>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border h-100">
          <div className="card-body text-center">
            <div className="mb-2"><Icon icon="heroicons:arrow-right-circle" className="fs-3 text-info" /></div>
            <p className="text-muted small mb-1">Transfer Requests</p>
            <h4 className="mb-0">{transferRequests.filter(t => t.status === 'pending').length}</h4>
            <p className="text-muted small">Awaiting approval</p>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border h-100">
          <div className="card-body text-center">
            <div className="mb-2"><Icon icon="heroicons:user-minus" className="fs-3 text-danger" /></div>
            <p className="text-muted small mb-1">Active Exits</p>
            <h4 className="mb-0">{exitProcesses.filter(e => e.status === 'in-process').length}</h4>
            <p className="text-muted small">In process</p>
          </div>
        </div>
      </div>

      {/* lifecycle stages small panel */}
      <div className="col-12">
        <div className="card border">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
              <div className="d-flex gap-2 align-items-center">
                <div className="px-3 py-2 bg-light rounded">
                  <Icon icon="heroicons:user-plus" className="fs-4 text-primary" />
                </div>
                <div>
                  <h6 className="mb-0">Joining</h6>
                  <small className="text-muted">Onboarding & Probation - {onboardingChecklist.length} tasks</small>
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center">
                <div className="px-3 py-2 bg-light rounded">
                  <Icon icon="heroicons:users" className="fs-4 text-success" />
                </div>
                <div>
                  <h6 className="mb-0">Active</h6>
                  <small className="text-muted">Active employees - {employees.filter(e => e.stage === 'active').length}</small>
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center">
                <div className="px-3 py-2 bg-light rounded">
                  <Icon icon="heroicons:arrow-right-circle" className="fs-4 text-info" />
                </div>
                <div>
                  <h6 className="mb-0">Transfers</h6>
                  <small className="text-muted">Requests - {transferRequests.length}</small>
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center">
                <div className="px-3 py-2 bg-light rounded">
                  <Icon icon="heroicons:user-minus" className="fs-4 text-danger" />
                </div>
                <div>
                  <h6 className="mb-0">Exit</h6>
                  <small className="text-muted">Exit processes - {exitProcesses.length}</small>
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center">
                <div className="px-3 py-2 bg-light rounded">
                  <Icon icon="heroicons:document-text" className="fs-4 text-primary" />
                </div>
                <div>
                  <h6 className="mb-0">Contracts</h6>
                  <small className="text-muted">Renewals - {contractRenewals.length}</small>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Joining tab (improved table / controls) ---
  const renderJoining = () => {
    const list = getFilteredList(onboardingChecklist, ['task', 'assignedTo', 'dueDate', 'status']);
    const { data, total, page } = paginate(list);
    return (
      <div className="row g-4">
        <div className="col-12">
          <div className="card border">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title mb-0">Onboarding Checklist</h6>
                {renderTopActions()}
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Assigned To</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th style={{ width: 140 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(t => (
                      <tr key={t.id}>
                        <td>{t.task}</td>
                        <td>{t.assignedTo}</td>
                        <td>{t.dueDate}</td>
                        <td>{getStatusBadge(t.status)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedItem(t); setShowDetailModal(true); }}>
                              <Icon icon="heroicons:eye" />
                            </button>
                            {t.status !== 'completed' && (
                              <button className="btn btn-sm btn-primary" onClick={() => {
                                setOnboardingChecklist(prev => prev.map(p => p.id === t.id ? { ...p, status: 'completed' } : p));
                                alert('Marked completed');
                              }}>
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

              {total > 1 && (
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <small className="text-muted">Showing page {page} of {total}</small>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
                    <button className="btn btn-sm btn-outline-secondary" disabled={page * itemsPerPage >= list.length} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* small confirmation workflow card (kept content but cleaned) */}
        <div className="col-12">
          <div className="card border">
            <div className="card-body">
              <h6 className="card-title">Confirmation Approval Workflow</h6>
              <div className="row g-3 mt-3">
                <div className="col-md-4">
                  <div className="card border text-center p-3">
                    <div className="mb-3">
                      <Icon icon="heroicons:user" className="fs-3 text-primary" />
                    </div>
                    <h6>Eligibility Check</h6>
                    <p className="text-muted small">Verify probation completion</p>
                    <div className="progress mb-2">
                      <div className="progress-bar" style={{ width: '100%' }}></div>
                    </div>
                    <span className="badge bg-success">Completed</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border text-center p-3">
                    <div className="mb-3">
                      <Icon icon="heroicons:document-check" className="fs-3 text-warning" />
                    </div>
                    <h6>Manager Review</h6>
                    <p className="text-muted small">Performance evaluation</p>
                    <div className="progress mb-2">
                      <div className="progress-bar" style={{ width: '75%' }}></div>
                    </div>
                    <span className="badge bg-warning">In Progress</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border text-center p-3">
                    <div className="mb-3">
                      <Icon icon="heroicons:envelope" className="fs-3 text-muted" />
                    </div>
                    <h6>Letter Generation</h6>
                    <p className="text-muted small">Generate confirmation letter</p>
                    <div className="progress mb-2">
                      <div className="progress-bar" style={{ width: '0%' }}></div>
                    </div>
                    <span className="badge bg-secondary">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  // --- Transfers tab ---
  const renderTransfers = () => {
    const list = getFilteredList(transferRequests, ['employeeName', 'fromDept', 'toDept', 'fromLocation', 'toLocation', 'type', 'status']);
    const { data, total, page } = paginate(list);

    return (
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card border">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Transfer Requests</h6>
                {renderTopActions()}
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>From / To</th>
                      <th>Request Date</th>
                      <th>Status</th>
                      <th style={{ width: 180 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(r => (
                      <tr key={r.id}>
                        <td>
                          <div className="fw-semibold">{r.employeeName}</div>
                          <div className="text-muted small">{r.employeeId}</div>
                        </td>
                        <td>{r.type}</td>
                        <td>
                          <div className="small text-muted">{r.fromDept || r.fromLocation}</div>
                          <div className="small text-muted"><Icon icon="heroicons:arrow-right" className="me-1" />{r.toDept || r.toLocation}</div>
                        </td>
                        <td>{r.requestDate}</td>
                        <td>{getStatusBadge(r.status)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            {r.status === 'pending' && (
                              <>
                                <button className="btn btn-sm btn-success" onClick={() => approveTransfer(r.id)}>Approve</button>
                                <button className="btn btn-sm btn-danger" onClick={() => rejectTransfer(r.id)}>Reject</button>
                              </>
                            )}
                            <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedItem(r); setShowDetailModal(true); }}>View</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {total > 1 && (
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <small className="text-muted">Showing page {page} of {total}</small>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
                    <button className="btn btn-sm btn-outline-secondary" disabled={page * itemsPerPage >= list.length} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Transfer workflow / stepper */}
        <div className="col-md-4">
          <div className="card border">
            <div className="card-body">
              <h6 className="card-title mb-3">Transfer Approval Workflow</h6>
              <div className="stepper">
                <div className="stepper-item completed mb-3">
                  <div className="stepper-icon"><Icon icon="heroicons:document-text" /></div>
                  <div className="stepper-content">
                    <h6 className="mb-0">Request Submitted</h6>
                    <small className="text-muted">Employee submits transfer request</small>
                  </div>
                </div>
                <div className="stepper-item active mb-3">
                  <div className="stepper-icon"><Icon icon="heroicons:user" /></div>
                  <div className="stepper-content">
                    <h6 className="mb-0">Manager Approval</h6>
                    <small className="text-muted">Current manager reviews request</small>
                  </div>
                </div>
                <div className="stepper-item pending mb-3">
                  <div className="stepper-icon"><Icon icon="heroicons:users" /></div>
                  <div className="stepper-content">
                    <h6 className="mb-0">HR Review</h6>
                    <small className="text-muted">HR evaluates transfer feasibility</small>
                  </div>
                </div>
                <div className="stepper-item pending">
                  <div className="stepper-icon"><Icon icon="heroicons:check" /></div>
                  <div className="stepper-content">
                    <h6 className="mb-0">Final Approval</h6>
                    <small className="text-muted">HR Head gives final approval</small>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Exit Management tab ---
  const renderExit = () => {
    const list = getFilteredList(exitProcesses, ['employeeName', 'employeeId', 'status']);
    const { data, total, page } = paginate(list);

    return (
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card border">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Exit Process Tracking</h6>
                {renderTopActions()}
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Last Working Day</th>
                      <th>Notice Period</th>
                      <th>Clearance Pending</th>
                      <th>Status</th>
                      <th style={{ width: 160 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(e => (
                      <tr key={e.id}>
                        <td>
                          <div className="fw-semibold">{e.employeeName}</div>
                          <div className="text-muted small">{e.employeeId}</div>
                        </td>
                        <td>{e.lastWorkingDay || '-'}</td>
                        <td>{e.noticePeriodStart ? `${e.noticePeriodStart} → ${e.lastWorkingDay || '-'}` : 'Completed'}</td>
                        <td>{e.clearancePending ? <span className="badge bg-warning">{e.clearancePending} departments</span> : <span className="badge bg-success">Completed</span>}</td>
                        <td>{getStatusBadge(e.status)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedItem(e); setShowDetailModal(true); }}>View Details</button>
                            {e.status === 'in-process' && <button className="btn btn-sm btn-warning" onClick={() => alert('Tracking clearance (demo)')}>Track Clearance</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {total > 1 && (
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <small className="text-muted">Showing page {page} of {total}</small>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
                    <button className="btn btn-sm btn-outline-secondary" disabled={page * itemsPerPage >= list.length} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border">
            <div className="card-body">
              <h6 className="mb-3">Clearance Checklist</h6>
              <div className="list-group list-group-flush mb-3">
                <div className="list-group-item px-0 py-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="it-clearance" defaultChecked />
                    <label className="form-check-label ms-2" htmlFor="it-clearance">IT Department</label>
                    <div className="text-muted small ms-4">Return laptop, deactivate accounts</div>
                  </div>
                </div>
                <div className="list-group-item px-0 py-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="admin-clearance" />
                    <label className="form-check-label ms-2" htmlFor="admin-clearance">Admin Department</label>
                    <div className="text-muted small ms-4">Return access cards, equipment</div>
                  </div>
                </div>
                <div className="list-group-item px-0 py-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="finance-clearance" />
                    <label className="form-check-label ms-2" htmlFor="finance-clearance">Finance Department</label>
                    <div className="text-muted small ms-4">Clear dues, final settlement</div>
                  </div>
                </div>
                <div className="list-group-item px-0 py-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="hr-clearance" />
                    <label className="form-check-label ms-2" htmlFor="hr-clearance">HR Department</label>
                    <div className="text-muted small ms-4">Exit interview, document collection</div>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary w-100" onClick={() => alert('Relieving letter generated (demo)')}>
                <Icon icon="heroicons:document-check" className="me-2" /> Generate Relieving Letter
              </button>

            </div>
          </div>
        </div>

        {/* Exit analytics kept */}
        <div className="col-12">
          <div className="card border">
            <div className="card-body">
              <h6 className="mb-3">Exit Analytics & Attrition Tracking</h6>
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="card border text-center p-3">
                    <h3 className="fw-bold text-danger mb-1">12%</h3>
                    <p className="text-muted mb-0">Attrition Rate</p>
                    <p className="text-danger small mb-0">↑ 2% from last quarter</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border text-center p-3">
                    <h3 className="fw-bold text-warning mb-1">8</h3>
                    <p className="text-muted mb-0">Voluntary Exits</p>
                    <p className="text-warning small mb-0">Better opportunities</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border text-center p-3">
                    <h3 className="fw-bold text-info mb-1">3</h3>
                    <p className="text-muted mb-0">Involuntary Exits</p>
                    <p className="text-info small mb-0">Performance related</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border text-center p-3">
                    <h3 className="fw-bold text-success mb-1">2.4</h3>
                    <p className="text-muted mb-0">Avg. Tenure (Years)</p>
                    <p className="text-success small mb-0">Industry avg: 2.1 years</p>
                  </div>
                </div>
              </div>

              {/* top exit reasons */}
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Top Exit Reasons</h6>
                  <button className="btn btn-sm btn-outline-primary">View Detailed Report</button>
                </div>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1"><span>Better Opportunity</span><span>45%</span></div>
                      <div className="progress"><div className="progress-bar bg-primary" style={{ width: '45%' }}></div></div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1"><span>Career Growth</span><span>30%</span></div>
                      <div className="progress"><div className="progress-bar bg-info" style={{ width: '30%' }}></div></div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1"><span>Work-Life Balance</span><span>15%</span></div>
                      <div className="progress"><div className="progress-bar bg-warning" style={{ width: '15%' }}></div></div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1"><span>Compensation</span><span>10%</span></div>
                      <div className="progress"><div className="progress-bar bg-danger" style={{ width: '10%' }}></div></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    );
  };

  // --- Reports tab (kept) ---
  const renderReports = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border">
          <div className="card-body">
            <h6 className="mb-3">Lifecycle Reports & Analytics</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="card border">
                  <div className="card-body d-flex align-items-center gap-3">
                    <Icon icon="heroicons:chart-bar" className="text-primary fs-3" />
                    <div>
                      <h6 className="mb-0">Joining Report</h6>
                      <small className="text-muted">Monthly onboarding summary</small>
                    </div>
                    <div className="ms-auto">
                      <button className="btn btn-primary" onClick={() => exportCsv('joining_report', onboardingChecklist, ['Task','AssignedTo','DueDate','Status'], t => [t.task, t.assignedTo, t.dueDate, t.status])}>Generate</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border">
                  <div className="card-body d-flex align-items-center gap-3">
                    <Icon icon="heroicons:arrow-trending-up" className="text-success fs-3" />
                    <div>
                      <h6 className="mb-0">Turnover Analysis</h6>
                      <small className="text-muted">Exit trends and patterns</small>
                    </div>
                    <div className="ms-auto">
                      <button className="btn btn-success" onClick={() => alert('Turnover report generated (demo)')}>Generate</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border">
                  <div className="card-body d-flex align-items-center gap-3">
                    <Icon icon="heroicons:user-group" className="text-info fs-3" />
                    <div>
                      <h6 className="mb-0">Headcount Report</h6>
                      <small className="text-muted">Department-wise employee count</small>
                    </div>
                    <div className="ms-auto">
                      <button className="btn btn-info" onClick={() => alert('Headcount report generated (demo)')}>Generate</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* recent generated reports table (kept content) */}
            <div className="mt-3 table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Generated Date</th>
                    <th>Type</th>
                    <th>Generated By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Q1 2024 Attrition Report</td>
                    <td>2024-03-30</td>
                    <td><span className="badge bg-danger">Exit Analysis</span></td>
                    <td>HR Manager</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">View</button>
                      <button className="btn btn-sm btn-outline-success">Download</button>
                    </td>
                  </tr>
                  <tr>
                    <td>March 2024 Joining Report</td>
                    <td>2024-03-31</td>
                    <td><span className="badge bg-primary">Joining</span></td>
                    <td>HR Manager</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">View</button>
                      <button className="btn btn-sm btn-outline-success">Download</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  // main switcher
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'joining': return renderJoining();
      case 'transfers': return renderTransfers();
      case 'exit': return renderExit();
      case 'reports': return renderReports();
      case 'active': 
        // keep original Active Employment section — simplified search & table here to match style
        const list = getFilteredList(employees, ['name','email','department','position','stage']);
        const { data, total, page } = paginate(list);
        return (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Active Employees</h6>
                    {renderTopActions()}
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Department</th>
                          <th>Position</th>
                          <th>Hire Date</th>
                          <th>Stage</th>
                          <th>Next Review</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map(emp => (
                          <tr key={emp.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="w-40-px h-40-px bg-light rounded-circle d-flex align-items-center justify-content-center me-3"><Icon icon="heroicons:user" className="text-muted" /></div>
                                <div>
                                  <div className="fw-semibold">{emp.name}</div>
                                  <small className="text-muted">{emp.email}</small>
                                </div>
                              </div>
                            </td>
                            <td>{emp.department}</td>
                            <td>{emp.position}</td>
                            <td>{emp.hireDate}</td>
                            <td>{getStageBadge(emp.stage)}</td>
                            <td>{emp.nextReviewDate || '-'}</td>
                            <td>
                              <div className="d-flex gap-2 flex-wrap">
                                <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedItem(emp); setShowDetailModal(true); }}>View</button>
                                <button className="btn btn-sm btn-outline-warning" onClick={() => alert('Update employee (demo)')}>Update</button>
                                {emp.stage !== 'exit-process' && (
                                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => initiateExit(emp.id)}>Initiate exit</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {total > 1 && (
                    <div className="mt-3 d-flex justify-content-between align-items-center">
                      <small className="text-muted">Showing page {page} of {total}</small>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
                        <button className="btn btn-sm btn-outline-secondary" disabled={page * itemsPerPage >= list.length} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card border">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Probation reviews</h6>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Review date</th>
                          <th>Manager</th>
                          <th>Status</th>
                          <th style={{ width: 220 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {probationReviews.map(r => (
                          <tr key={r.id}>
                            <td>
                              <div className="fw-semibold">{r.employeeName}</div>
                              <div className="text-muted small">{r.employeeId}</div>
                            </td>
                            <td>{r.reviewDate}</td>
                            <td>{r.manager || '—'}</td>
                            <td>{getStatusBadge(r.status)}</td>
                            <td>
                              <div className="d-flex gap-2 flex-wrap">
                                {r.status === 'pending' && (
                                  <button type="button" className="btn btn-sm btn-primary" onClick={() => startProbationReview(r.id)}>Start</button>
                                )}
                                {r.status === 'in-progress' && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    onClick={() => {
                                      const rating = window.prompt('Rating (e.g. Meets Expectations)', 'Meets Expectations');
                                      if (rating) completeProbationReview(r.id, rating);
                                    }}
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
            </div>
          </div>
        );

      default: return renderDashboard();
    }
  };

  

  return (
    <div menuItems={menuItems} userInfo={userInfo} appName="Employee Lifecycle Management">
      <div className="container-fluid px-3 px-md-4 py-3">
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2"><Icon icon="heroicons:user-group" /> Employee Lifecycle Management</h5>
          <p className="text-muted">Manage complete employee journey from onboarding, active employment, transfers to exit</p>
        </div>

        {/* Tabs */}
        <div className="card border shadow-none mb-4">
          <div className="card-body p-3">
            <div className="d-flex flex-wrap gap-2">
              {menuItems.slice(0,6).map(item => (
                <button key={item.id} className={`btn ${activeTab === item.id ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => { setActiveTab(item.id); setSearchTerm(''); setFilterStatus('All'); setCurrentPage(1); }}>
                  <Icon icon={item.icon} className="me-2" /> {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="card border shadow-none">
          <div className="card-body">
            {renderContent()}
          </div>
        </div>

        {/* Quick Links footer (kept) */}
        <div className="card border shadow-none mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex gap-3 flex-wrap">
                <button type="button" className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-2" onClick={() => alert('Export all data (demo)')}>
                  <Icon icon="heroicons:document-arrow-down" /> <span>Export All Data</span>
                </button>
                <button type="button" className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-2" onClick={() => alert('Notification preferences (demo)')}>
                  <Icon icon="heroicons:bell-alert" /> <span>Set Notifications</span>
                </button>
                <button type="button" className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-2" onClick={() => alert('Workflow settings (demo)')}>
                  <Icon icon="heroicons:cog-6-tooth" /> <span>Workflow Settings</span>
                </button>
              </div>
              <div className="text-muted small">Employee Lifecycle Management v2.0 • Based on HRMS 1.0 Specifications</div>
            </div>
          </div>
        </div>

        {/* Detail Modal - re-usable for Transfers / Exit / Checklist items / Employee */}
        {showDetailModal && selectedItem && (
          <div
            className="modal show d-block"
            role="dialog"
            aria-modal="true"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => { setShowDetailModal(false); setSelectedItem(null); }}
          >
            <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Details</h5>
                  <button type="button" className="btn-close" onClick={() => { setShowDetailModal(false); setSelectedItem(null); }}></button>
                </div>
                <div className="modal-body">
                  {/* Generic details viewer - show available fields */}
                  <div className="row g-3">
                    {Object.entries(selectedItem).map(([k, v]) => (
                      <div className="col-md-6" key={k}>
                        <label className="form-label small text-muted">{k}</label>
                        <div className="form-control-plaintext">{String(v)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowDetailModal(false); setSelectedItem(null); }}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeLifecycle;
