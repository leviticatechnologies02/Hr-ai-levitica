import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const OrganizationHierarchy = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('organization');
  const [activeAccordion, setActiveAccordion] = useState(['dashboard']);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDate, setSelectedDate] = useState('current');
  const [hierarchyHistory, setHierarchyHistory] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [drillDownPath, setDrillDownPath] = useState(['ceo']);
  const [showDirectReports, setShowDirectReports] = useState(true);
  const [showDottedLineReports, setShowDottedLineReports] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState('current');
  const [isExporting, setIsExporting] = useState(false);
  
  // Mock data for organizational hierarchy
  const [orgHierarchy, setOrgHierarchy] = useState({
    ceo: {
      id: 'CEO001',
      name: 'Sarah Johnson',
      title: 'Chief Executive Officer',
      department: 'Executive',
      location: 'Global',
      reports: ['CTO001', 'CFO001', 'COO001'],
      dottedLineReports: [],
      spanOfControl: 15
    },
    cto: {
      id: 'CTO001',
      name: 'Michael Chen',
      title: 'Chief Technology Officer',
      department: 'Technology',
      location: 'Global',
      reports: ['VP_TECH001', 'VP_PRODUCT001'],
      dottedLineReports: ['VP_RD001'],
      spanOfControl: 45
    },
    cfo: {
      id: 'CFO001',
      name: 'Robert Davis',
      title: 'Chief Financial Officer',
      department: 'Finance',
      location: 'Global',
      reports: ['VP_FINANCE001', 'VP_ACCOUNTS001'],
      dottedLineReports: [],
      spanOfControl: 32
    },
    coo: {
      id: 'COO001',
      name: 'Jennifer Lee',
      title: 'Chief Operations Officer',
      department: 'Operations',
      location: 'Global',
      reports: ['VP_HR001', 'VP_ADMIN001'],
      dottedLineReports: [],
      spanOfControl: 28
    },
    vpTech: {
      id: 'VP_TECH001',
      name: 'David Wilson',
      title: 'VP Engineering',
      department: 'Technology',
      location: 'San Francisco',
      reports: ['DIR_ENG001', 'DIR_QA001'],
      dottedLineReports: ['DIR_DEVOPS001'],
      spanOfControl: 85
    },
    vpProduct: {
      id: 'VP_PRODUCT001',
      name: 'Emma Rodriguez',
      title: 'VP Product',
      department: 'Product',
      location: 'New York',
      reports: ['DIR_PRODUCT001', 'DIR_UX001'],
      dottedLineReports: [],
      spanOfControl: 42
    },
    dirEng: {
      id: 'DIR_ENG001',
      name: 'Alex Turner',
      title: 'Director of Engineering',
      department: 'Technology',
      location: 'San Francisco',
      reports: ['MGR_ENG001', 'MGR_ENG002'],
      dottedLineReports: [],
      spanOfControl: 25
    },
    mgrEng: {
      id: 'MGR_ENG001',
      name: 'Brian Taylor',
      title: 'Engineering Manager',
      department: 'Technology',
      location: 'San Francisco',
      reports: ['EMP001', 'EMP002', 'EMP003'],
      dottedLineReports: [],
      spanOfControl: 8
    }
  });

  // Departments data
  const [departments, setDepartments] = useState([
    { id: 'dept001', name: 'Technology', employees: 245, location: 'San Francisco', head: 'Michael Chen' },
    { id: 'dept002', name: 'Product', employees: 85, location: 'New York', head: 'Emma Rodriguez' },
    { id: 'dept003', name: 'Finance', employees: 65, location: 'Chicago', head: 'Robert Davis' },
    { id: 'dept004', name: 'Operations', employees: 120, location: 'Austin', head: 'Jennifer Lee' },
    { id: 'dept005', name: 'Marketing', employees: 75, location: 'New York', head: 'Amanda Scott' },
    { id: 'dept006', name: 'Sales', employees: 95, location: 'Chicago', head: 'Kevin Brown' },
    { id: 'dept007', name: 'HR', employees: 35, location: 'Austin', head: 'Lisa Wilson' }
  ]);

  // Locations data
  const [locations, setLocations] = useState([
    { id: 'loc001', name: 'San Francisco', employees: 245, departments: 3 },
    { id: 'loc002', name: 'New York', employees: 160, departments: 4 },
    { id: 'loc003', name: 'Chicago', employees: 160, departments: 3 },
    { id: 'loc004', name: 'Austin', employees: 155, departments: 2 },
    { id: 'loc005', name: 'Remote', employees: 180, departments: 6 }
  ]);

  // Reporting relationships data
  const [reportingRelationships, setReportingRelationships] = useState([
    { id: 1, employeeId: 'EMP001', employeeName: 'John Smith', managerId: 'MGR_ENG001', managerName: 'Brian Taylor', type: 'direct', effectiveDate: '2022-03-15' },
    { id: 2, employeeId: 'EMP002', employeeName: 'Sarah Johnson', managerId: 'MGR_ENG001', managerName: 'Brian Taylor', type: 'direct', effectiveDate: '2021-11-20' },
    { id: 3, employeeId: 'EMP003', employeeName: 'David Chen', managerId: 'MGR_ENG001', managerName: 'Brian Taylor', type: 'direct', effectiveDate: '2023-01-10' },
    { id: 4, employeeId: 'VP_RD001', employeeName: 'Sophia Martinez', managerId: 'CTO001', managerName: 'Michael Chen', type: 'dotted-line', effectiveDate: '2023-06-15' },
    { id: 5, employeeId: 'DIR_DEVOPS001', employeeName: 'Ryan Cooper', managerId: 'VP_TECH001', managerName: 'David Wilson', type: 'dotted-line', effectiveDate: '2023-08-01' },
    { id: 6, employeeId: 'EMP004', employeeName: 'Maria Garcia', managerId: 'MGR_ENG002', managerName: 'Olivia Davis', type: 'direct', effectiveDate: '2024-01-15' }
  ]);

  // Matrix reporting structure
  const [matrixReports, setMatrixReports] = useState([
    { id: 1, employeeId: 'EMP005', employeeName: 'James Wilson', primaryManager: 'MGR_ENG001', projectManager: 'PROJ_MGR001', type: 'project-based', effectiveDate: '2024-01-01', project: 'Phoenix Initiative' },
    { id: 2, employeeId: 'EMP006', employeeName: 'Lisa Rodriguez', primaryManager: 'MGR_ENG002', functionalManager: 'DIR_UX001', type: 'functional-matrix', effectiveDate: '2023-09-15', function: 'UX Design' },
    { id: 3, employeeId: 'EMP007', employeeName: 'Alex Turner', primaryManager: 'MGR_ENG001', programManager: 'PROG_MGR001', type: 'program-based', effectiveDate: '2023-11-01', program: 'Digital Transformation' }
  ]);

  // Hierarchy modification requests
  const [modificationRequests, setModificationRequests] = useState([
    { id: 'MOD001', type: 'add-position', position: 'Senior Director', department: 'Technology', requester: 'David Wilson', date: '2024-03-15', status: 'pending', approvalNeeded: ['CTO001', 'HR001'] },
    { id: 'MOD002', type: 'modify-reporting', employee: 'EMP008', currentManager: 'MGR_ENG001', newManager: 'MGR_ENG002', requester: 'Brian Taylor', date: '2024-03-10', status: 'approved', approvalNeeded: ['DIR_ENG001'] },
    { id: 'MOD003', type: 'dotted-line-add', employee: 'EMP009', manager: 'DIR_PRODUCT001', requester: 'Emma Rodriguez', date: '2024-03-05', status: 'rejected', approvalNeeded: ['VP_PRODUCT001', 'HR001'] },
    { id: 'MOD004', type: 'restructure', description: 'Sales team reorganization', department: 'Sales', requester: 'Kevin Brown', date: '2024-03-01', status: 'in-review', approvalNeeded: ['COO001', 'HR001', 'CFO001'] }
  ]);

  // Historical hierarchy data
  const [historicalData, setHistoricalData] = useState([
    { date: '2024-01-01', version: 'v1.0', changes: 'Initial structure setup', by: 'Sarah Johnson' },
    { date: '2024-02-15', version: 'v1.1', changes: 'Added Product department expansion', by: 'Michael Chen' },
    { date: '2024-03-01', version: 'v1.2', changes: 'Sales team reorganization', by: 'Kevin Brown' },
    { date: '2024-03-15', version: 'v1.3', changes: 'Added dotted-line reporting for DevOps', by: 'David Wilson' }
  ]);

  // Span of control analytics
  const [spanAnalytics, setSpanAnalytics] = useState([
    { level: 'CEO', avgSpan: 15, maxSpan: 15, minSpan: 15 },
    { level: 'C-Level', avgSpan: 35, maxSpan: 45, minSpan: 28 },
    { level: 'VP-Level', avgSpan: 63.5, maxSpan: 85, minSpan: 42 },
    { level: 'Director-Level', avgSpan: 25, maxSpan: 25, minSpan: 25 },
    { level: 'Manager-Level', avgSpan: 8, maxSpan: 8, minSpan: 8 },
    { level: 'Overall Average', avgSpan: 29.4, maxSpan: 85, minSpan: 8 }
  ]);

  // Sidebar Menu Items
  const menuItems = [
    {
      title: 'Organizational Hierarchy',
      icon: 'heroicons:building-office',
      link: '/organizational-hierarchy',
      active: true
    },
    {
      title: 'Employee Lifecycle',
      icon: 'heroicons:user-group',
      link: '/employee-lifecycle'
    },
    {
      title: 'Statutory Compliance',
      icon: 'heroicons:shield-check',
      link: '/compliance'
    },
    {
      title: 'Document Vault',
      icon: 'heroicons:folder',
      link: '/documents'
    },
    {
      title: 'Reports',
      icon: 'heroicons:chart-bar',
      link: '/reports'
    },
    {
      title: 'Settings',
      icon: 'heroicons:cog-6-tooth',
      link: '/settings'
    }
  ];

  // User info for sidebar
  const userInfo = {
    name: 'HR Manager',
    role: 'Human Resources',
    email: 'hr.manager@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HR'
  };

  // Initial data loading
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(prev => 
      prev.includes(section) 
        ? prev.filter(item => item !== section)
        : [...prev, section]
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      'completed': 'bg-success-subtle text-success',
      'pending': 'bg-warning-subtle text-warning',
      'approved': 'bg-success-subtle text-success',
      'rejected': 'bg-danger-subtle text-danger',
      'in-review': 'bg-info-subtle text-info',
      'in-process': 'bg-warning-subtle text-warning',
      'active': 'bg-success-subtle text-success',
      'inactive': 'bg-danger-subtle text-danger'
    };

    return (
      <span className={`badge ${styles[status] || 'bg-secondary-subtle text-secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getReportTypeBadge = (type) => {
    const styles = {
      'direct': 'bg-primary-subtle text-primary',
      'dotted-line': 'bg-warning-subtle text-warning',
      'matrix': 'bg-info-subtle text-info'
    };

    return (
      <span className={`badge ${styles[type] || 'bg-secondary-subtle text-secondary'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const handleApproveRequest = (requestId) => {
    setModificationRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status: 'approved' } : request
      )
    );
  };

  const handleRejectRequest = (requestId) => {
    setModificationRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status: 'rejected' } : request
      )
    );
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create export data
      const exportData = {
        format,
        date: new Date().toISOString(),
        hierarchy: orgHierarchy,
        departments,
        locations,
        reportingRelationships,
        matrixReports
      };
      
      if (format === 'pdf') {
        // In real implementation, this would generate a PDF
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `org-chart-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else if (format === 'png') {
        // In real implementation, this would capture the org chart as PNG
        alert('PNG export functionality would capture the visual org chart. In production, use html2canvas or similar library.');
      } else if (format === 'excel') {
        // Create CSV/Excel format
        let csvContent = 'Organization Chart Export\n\n';
        csvContent += 'Employee ID,Name,Title,Department,Location,Manager ID,Report Type\n';
        
        Object.values(orgHierarchy).forEach(emp => {
          csvContent += `${emp.id},${emp.name},${emp.title},${emp.department},${emp.location},,direct\n`;
        });
        
        reportingRelationships.forEach(rel => {
          csvContent += `${rel.employeeId},${rel.employeeName},,${rel.type},${rel.type}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `org-chart-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      
      alert(`Organization chart exported successfully in ${format.toUpperCase()} format!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export organization chart. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDrillDown = (nodeId) => {
    setSelectedNode(nodeId);
    setDrillDownPath([...drillDownPath, nodeId]);
  };

  const handleDrillUp = () => {
    if (drillDownPath.length > 1) {
      const newPath = [...drillDownPath];
      newPath.pop();
      setDrillDownPath(newPath);
      setSelectedNode(newPath[newPath.length - 1]);
    } else {
      setDrillDownPath(['ceo']);
      setSelectedNode(null);
    }
  };

  const getCurrentNode = () => {
    const currentNodeId = drillDownPath[drillDownPath.length - 1];
    return orgHierarchy[currentNodeId] || orgHierarchy.ceo;
  };

  const getDirectReports = (nodeId) => {
    const node = orgHierarchy[nodeId];
    if (!node || !node.reports) return [];
    return node.reports.map(id => {
      // Find employee by ID in orgHierarchy
      const emp = Object.values(orgHierarchy).find(e => e.id === id);
      return emp;
    }).filter(Boolean);
  };

  const getDottedLineReports = (nodeId) => {
    const node = orgHierarchy[nodeId];
    if (!node || !node.dottedLineReports) return [];
    return node.dottedLineReports.map(id => {
      const emp = Object.values(orgHierarchy).find(e => e.id === id);
      return emp;
    }).filter(Boolean);
  };

  const handleTimeTravel = (version) => {
    setSelectedVersion(version);
    if (version === 'current') {
      // Load current structure
      setSelectedDate('current');
    } else {
      // Load historical version
      const historyItem = historicalData.find(h => h.version === version);
      if (historyItem) {
        setSelectedDate(historyItem.date);
        // In real implementation, this would load the historical hierarchy data
        alert(`Loading historical view: ${historyItem.version} from ${historyItem.date}`);
      }
    }
  };

  const renderDashboard = () => (
    <div className="card border shadow-none mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="card-title mb-1">Organizational Hierarchy & Reporting Structure</h5>
            <p className="text-muted mb-0">Visualize and manage organizational structure, reporting relationships, and hierarchy analytics</p>
          </div>
          <div className="d-flex gap-3">
            <button className="btn btn-primary">
              <Icon icon="heroicons:plus" className="me-2" />
              Add Position
            </button>
            <button className="btn btn-outline-primary">
              <Icon icon="heroicons:arrow-down-tray" className="me-2" />
              Export Org Chart
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border shadow-none">
              <div className="card-body text-center">
                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                  <div className="w-40-px h-40-px bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon icon="heroicons:building-office" className="text-primary" />
                  </div>
                  <p className="text-muted mb-0 fw-semibold">Departments</p>
                </div>
                <h4 className="fw-bold mb-0">{departments.length}</h4>
                <p className="text-muted small mb-0">Across all locations</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border shadow-none">
              <div className="card-body text-center">
                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                  <div className="w-40-px h-40-px bg-success-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon icon="heroicons:users" className="text-success" />
                  </div>
                  <p className="text-muted mb-0 fw-semibold">Total Employees</p>
                </div>
                <h4 className="fw-bold mb-0">965</h4>
                <p className="text-muted small mb-0">Active workforce</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border shadow-none">
              <div className="card-body text-center">
                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                  <div className="w-40-px h-40-px bg-warning-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon icon="heroicons:chart-bar" className="text-warning" />
                  </div>
                  <p className="text-muted mb-0 fw-semibold">Avg. Span of Control</p>
                </div>
                <h4 className="fw-bold mb-0">29.4</h4>
                <p className="text-muted small mb-0">Managers average</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border shadow-none">
              <div className="card-body text-center">
                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                  <div className="w-40-px h-40-px bg-info-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon icon="heroicons:arrow-path" className="text-info" />
                  </div>
                  <p className="text-muted mb-0 fw-semibold">Pending Changes</p>
                </div>
                <h4 className="fw-bold mb-0">{modificationRequests.filter(m => m.status === 'pending' || m.status === 'in-review').length}</h4>
                <p className="text-muted small mb-0">Awaiting approval</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border shadow-none h-100">
              <div className="card-body">
                <h6 className="card-title mb-3">Reporting Relationships</h6>
                <div className="list-group list-group-flush">
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Direct Reports</span>
                      <span className="fw-bold">856</span>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Dotted-Line Reports</span>
                      <span className="fw-bold text-warning">67</span>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Matrix Reports</span>
                      <span className="fw-bold text-info">42</span>
                    </div>
                  </div>
                  <div className="list-group-item border-0 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Individual Contributors</span>
                      <span className="fw-bold text-success">687</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border shadow-none h-100">
              <div className="card-body">
                <h6 className="card-title mb-3">Hierarchy Health</h6>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <h4 className="fw-bold text-success mb-1">92%</h4>
                      <p className="text-muted small mb-0">Reporting Completeness</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <h4 className="fw-bold text-warning mb-1">15</h4>
                      <p className="text-muted small mb-0">Overloaded Managers</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <h4 className="fw-bold text-info mb-1">8</h4>
                      <p className="text-muted small mb-0">Underloaded Managers</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-3 bg-light rounded">
                      <h4 className="fw-bold text-primary mb-1">4:1</h4>
                      <p className="text-muted small mb-0">Manager to IC Ratio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrgChart = () => (
    <div className="card border shadow-none mb-4">
      <div className="card-body">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className={`accordion-button ${activeAccordion.includes('org-chart') ? '' : 'collapsed'}`}
              type="button"
              onClick={() => toggleAccordion('org-chart')}
            >
              <Icon icon="heroicons:chart-pie" className="me-2" />
              <strong>Visual Organization Chart</strong>
              <span className="badge bg-primary ms-2">Interactive</span>
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${activeAccordion.includes('org-chart') ? 'show' : ''}`}>
            <div className="accordion-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h6 className="mb-2">Interactive Organizational Chart</h6>
                  <p className="text-muted small mb-0">Click on any node to drill down and explore reporting relationships</p>
                </div>
                <div className="d-flex gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-check-label small">Direct Reports</label>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={showDirectReports}
                        onChange={(e) => setShowDirectReports(e.target.checked)}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-check-label small">Dotted-Line</label>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={showDottedLineReports}
                        onChange={(e) => setShowDottedLineReports(e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Drill Down Breadcrumb */}
              {drillDownPath.length > 1 && (
                <div className="mb-3">
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleDrillUp}
                  >
                    <Icon icon="heroicons:arrow-left" className="me-1" />
                    Back to {drillDownPath.length === 2 ? 'CEO' : 'Previous Level'}
                  </button>
                  <div className="d-inline-flex align-items-center gap-2 ms-3">
                    {drillDownPath.map((nodeId, index) => {
                      const node = orgHierarchy[nodeId];
                      return (
                        <React.Fragment key={nodeId}>
                          <span 
                            className={index === drillDownPath.length - 1 ? 'fw-bold' : 'text-muted'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              const newPath = drillDownPath.slice(0, index + 1);
                              setDrillDownPath(newPath);
                              setSelectedNode(nodeId);
                            }}
                          >
                            {node?.name || nodeId}
                          </span>
                          {index < drillDownPath.length - 1 && <Icon icon="heroicons:chevron-right" className="text-muted" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Org Chart Visualization */}
              <div className="border rounded p-4 mb-4 bg-light" style={{ minHeight: '500px', position: 'relative' }}>
                <div className="text-center">
                  {/* Current Node (CEO or drilled down node) */}
                  <div className="mb-5">
                    <div className="d-flex justify-content-center">
                      <div className="position-relative">
                        <div className={`card ${selectedNode ? 'border-info' : 'border-primary'}`} style={{ width: '300px', cursor: 'pointer' }}
                          onClick={() => handleDrillDown(drillDownPath[drillDownPath.length - 1])}
                        >
                          <div className="card-body text-center">
                            <div className={`w-60-px h-60-px ${selectedNode ? 'bg-info' : 'bg-primary'} rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3`}>
                              <Icon icon="heroicons:user" className="text-white fs-4" />
                            </div>
                            <h6 className="fw-bold mb-1">{getCurrentNode().name}</h6>
                            <p className="text-muted small mb-1">{getCurrentNode().title}</p>
                            <div className="d-flex justify-content-center gap-2">
                              <span className={`badge ${selectedNode ? 'bg-info' : 'bg-primary'}`}>{getCurrentNode().department}</span>
                              <span className="badge bg-secondary">{getCurrentNode().location}</span>
                            </div>
                            <div className="mt-2">
                              <span className="badge bg-warning">Span: {getCurrentNode().spanOfControl}</span>
                            </div>
                            {getDirectReports(drillDownPath[drillDownPath.length - 1]).length > 0 && (
                              <button 
                                className="btn btn-sm btn-outline-primary mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDrillDown(drillDownPath[drillDownPath.length - 1]);
                                }}
                              >
                                <Icon icon="heroicons:chevron-down" className="me-1" />
                                Drill Down ({getDirectReports(drillDownPath[drillDownPath.length - 1]).length} reports)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Reports Section */}
                  {showDirectReports && getDirectReports(drillDownPath[drillDownPath.length - 1]).length > 0 && (
                    <>
                      <div className="mb-4">
                        <div className="d-flex justify-content-center">
                          <div className="text-center">
                            <Icon icon="heroicons:arrow-long-down" className="text-primary fs-3" />
                            <p className="text-muted small mt-2">Direct Reports ({getDirectReports(drillDownPath[drillDownPath.length - 1]).length})</p>
                          </div>
                        </div>
                      </div>

                      {/* Direct Reports Grid */}
                      <div className="row g-4 mb-4 justify-content-center">
                        {getDirectReports(drillDownPath[drillDownPath.length - 1]).map((report, index) => {
                          const reportKey = Object.keys(orgHierarchy).find(key => orgHierarchy[key].id === report.id);
                          return (
                            <div key={report.id} className="col-md-4 col-lg-3">
                              <div 
                                className="card border border-primary" 
                                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                onMouseEnter={(e) => e.currentTarget.classList.add('shadow')}
                                onMouseLeave={(e) => e.currentTarget.classList.remove('shadow')}
                                onClick={() => handleDrillDown(reportKey)}
                              >
                                <div className="card-body text-center">
                                  <div className="w-50-px h-50-px bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2">
                                    <Icon icon="heroicons:user" className="text-white" />
                                  </div>
                                  <h6 className="fw-bold mb-1">{report.name}</h6>
                                  <p className="text-muted small mb-1">{report.title}</p>
                                  <span className="badge bg-primary">{report.department}</span>
                                  {report.spanOfControl > 0 && (
                                    <div className="mt-2">
                                      <span className="badge bg-info">Reports: {report.spanOfControl}</span>
                                    </div>
                                  )}
                                  <div className="mt-2">
                                    <button 
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDrillDown(reportKey);
                                      }}
                                    >
                                      <Icon icon="heroicons:eye" className="me-1" />
                                      View Team
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Dotted-Line Reports Section */}
                  {showDottedLineReports && getDottedLineReports(drillDownPath[drillDownPath.length - 1]).length > 0 && (
                    <>
                      <div className="mb-4 mt-5 pt-4 border-top">
                        <div className="d-flex justify-content-center">
                          <div className="text-center">
                            <Icon icon="heroicons:arrow-long-down" className="text-warning fs-3" style={{ opacity: 0.5 }} />
                            <p className="text-muted small mt-2">Dotted-Line Reports ({getDottedLineReports(drillDownPath[drillDownPath.length - 1]).length})</p>
                          </div>
                        </div>
                      </div>

                      <div className="row g-4 mb-4 justify-content-center">
                        {getDottedLineReports(drillDownPath[drillDownPath.length - 1]).map((report) => {
                          const reportKey = Object.keys(orgHierarchy).find(key => orgHierarchy[key].id === report.id);
                          return (
                            <div key={report.id} className="col-md-4 col-lg-3">
                              <div className="card border border-warning" style={{ borderStyle: 'dashed', opacity: 0.8 }}>
                                <div className="card-body text-center">
                                  <div className="w-50-px h-50-px bg-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2">
                                    <Icon icon="heroicons:user" className="text-white" />
                                  </div>
                                  <h6 className="fw-bold mb-1">{report.name}</h6>
                                  <p className="text-muted small mb-1">{report.title}</p>
                                  <span className="badge bg-warning">Dotted-Line</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Show C-Level if at CEO level */}
                  {drillDownPath.length === 1 && (
                    <>
                      <div className="mb-4">
                        <div className="d-flex justify-content-center">
                          <div className="text-center">
                            <Icon icon="heroicons:arrow-long-down" className="text-primary fs-3" />
                            <p className="text-muted small mt-2">Reports to</p>
                          </div>
                        </div>
                      </div>

                      {/* C-Level Executives */}
                      <div className="row g-4 mb-4 justify-content-center">
                        <div className="col-md-4">
                          <div 
                            className="card border border-success" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDrillDown('cto')}
                          >
                            <div className="card-body text-center">
                              <div className="w-50-px h-50-px bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2">
                                <Icon icon="heroicons:computer-desktop" className="text-white" />
                              </div>
                              <h6 className="fw-bold mb-1">{orgHierarchy.cto.name}</h6>
                              <p className="text-muted small mb-1">{orgHierarchy.cto.title}</p>
                              <span className="badge bg-success">Technology</span>
                              <div className="mt-2">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDrillDown('cto');
                                  }}
                                >
                                  <Icon icon="heroicons:eye" className="me-1" />
                                  View Team ({orgHierarchy.cto.spanOfControl})
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card border border-warning" style={{ cursor: 'pointer' }}
                            onClick={() => handleDrillDown('cfo')}
                          >
                            <div className="card-body text-center">
                              <div className="w-50-px h-50-px bg-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2">
                                <Icon icon="heroicons:banknotes" className="text-white" />
                              </div>
                              <h6 className="fw-bold mb-1">{orgHierarchy.cfo.name}</h6>
                              <p className="text-muted small mb-1">{orgHierarchy.cfo.title}</p>
                              <span className="badge bg-warning">Finance</span>
                              <div className="mt-2">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDrillDown('cfo');
                                  }}
                                >
                                  <Icon icon="heroicons:eye" className="me-1" />
                                  View Team ({orgHierarchy.cfo.spanOfControl})
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card border border-info" style={{ cursor: 'pointer' }}
                            onClick={() => handleDrillDown('coo')}
                          >
                            <div className="card-body text-center">
                              <div className="w-50-px h-50-px bg-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2">
                                <Icon icon="heroicons:cog-6-tooth" className="text-white" />
                              </div>
                              <h6 className="fw-bold mb-1">{orgHierarchy.coo.name}</h6>
                              <p className="text-muted small mb-1">{orgHierarchy.coo.title}</p>
                              <span className="badge bg-info">Operations</span>
                              <div className="mt-2">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDrillDown('coo');
                                  }}
                                >
                                  <Icon icon="heroicons:eye" className="me-1" />
                                  View Team ({orgHierarchy.coo.spanOfControl})
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Legend */}
                  <div className="mt-4">
                    <div className="d-flex justify-content-center gap-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="w-15-px h-15-px bg-primary rounded-circle"></div>
                        <span className="small">Direct Report</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div className="w-15-px h-15-px bg-warning rounded-circle"></div>
                        <span className="small">Dotted-Line Report</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div className="w-15-px h-15-px bg-info rounded-circle"></div>
                        <span className="small">Matrix Report</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Controls */}
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">View By</label>
                  <select 
                    className="form-select"
                    value={selectedView}
                    onChange={(e) => setSelectedView(e.target.value)}
                  >
                    <option value="organization">Organization View</option>
                    <option value="department">Department View</option>
                    <option value="location">Location View</option>
                    <option value="function">Functional View</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Department Filter</label>
                  <select 
                    className="form-select"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Location Filter</label>
                  <select 
                    className="form-select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search and Export */}
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="position-relative" style={{ width: '300px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search in org chart..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Icon icon="heroicons:magnifying-glass" className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => handleExport('pdf')}
                    disabled={isExporting}
                  >
                    <Icon icon="heroicons:document-arrow-down" className="me-2" />
                    {isExporting ? 'Exporting...' : 'Export PDF'}
                  </button>
                  <button 
                    className="btn btn-outline-success"
                    onClick={() => handleExport('png')}
                    disabled={isExporting}
                  >
                    <Icon icon="heroicons:photo" className="me-2" />
                    {isExporting ? 'Exporting...' : 'Export PNG'}
                  </button>
                  <button 
                    className="btn btn-outline-warning"
                    onClick={() => handleExport('excel')}
                    disabled={isExporting}
                  >
                    <Icon icon="heroicons:table-cells" className="me-2" />
                    {isExporting ? 'Exporting...' : 'Export Excel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportingRelationships = () => (
    <div className="card border shadow-none mb-4">
      <div className="card-body">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className={`accordion-button ${activeAccordion.includes('reporting') ? '' : 'collapsed'}`}
              type="button"
              onClick={() => toggleAccordion('reporting')}
            >
              <Icon icon="heroicons:arrow-right-circle" className="me-2" />
              <strong>Reporting Relationships</strong>
              <span className="badge bg-success ms-2">Direct, Dotted-Line & Matrix</span>
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${activeAccordion.includes('reporting') ? 'show' : ''}`}>
            <div className="accordion-body">
              <div className="row g-4">
                {/* Direct Reporting Relationships */}
                <div className="col-md-6">
                  <div className="card border shadow-none h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="card-title mb-0">Direct Reporting Relationships</h6>
                        <button className="btn btn-sm btn-primary">
                          <Icon icon="heroicons:plus" className="me-1" />
                          Add Relationship
                        </button>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>Manager</th>
                              <th>Effective Date</th>
                              <th>Type</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportingRelationships
                              .filter(r => r.type === 'direct')
                              .map(relationship => (
                                <tr key={relationship.id}>
                                  <td>
                                    <div>
                                      <p className="fw-semibold mb-0">{relationship.employeeName}</p>
                                      <p className="text-muted small mb-0">{relationship.employeeId}</p>
                                    </div>
                                  </td>
                                  <td>{relationship.managerName}</td>
                                  <td>{relationship.effectiveDate}</td>
                                  <td>{getReportTypeBadge(relationship.type)}</td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-primary">
                                      Edit
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dotted-Line & Matrix Reporting */}
                <div className="col-md-6">
                  <div className="card border shadow-none h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="card-title mb-0">Matrix & Dotted-Line Reporting</h6>
                        <button className="btn btn-sm btn-warning">
                          <Icon icon="heroicons:plus" className="me-1" />
                          Add Matrix
                        </button>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>Reporting To</th>
                              <th>Type</th>
                              <th>Effective Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportingRelationships
                              .filter(r => r.type === 'dotted-line')
                              .concat(matrixReports.map(m => ({
                                id: m.id,
                                employeeName: m.employeeName,
                                managerName: m.primaryManager,
                                type: m.type,
                                effectiveDate: m.effectiveDate
                              })))
                              .map(relationship => (
                                <tr key={relationship.id}>
                                  <td>
                                    <div>
                                      <p className="fw-semibold mb-0">{relationship.employeeName}</p>
                                      <p className="text-muted small mb-0">
                                        {matrixReports.find(m => m.employeeName === relationship.employeeName)?.project || ''}
                                      </p>
                                    </div>
                                  </td>
                                  <td>{relationship.managerName}</td>
                                  <td>{getReportTypeBadge(relationship.type)}</td>
                                  <td>{relationship.effectiveDate}</td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-warning">
                                      Edit
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Matrix Reporting Details */}
                <div className="col-12">
                  <div className="card border shadow-none">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Matrix Reporting Structure Details</h6>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>Primary Manager</th>
                              <th>Secondary Manager</th>
                              <th>Matrix Type</th>
                              <th>Project/Function</th>
                              <th>Effective Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {matrixReports.map(matrix => (
                              <tr key={matrix.id}>
                                <td>{matrix.employeeName}</td>
                                <td>{matrix.primaryManager}</td>
                                <td>{matrix.projectManager || matrix.functionalManager || matrix.programManager}</td>
                                <td>
                                  <span className="badge bg-info-subtle text-info text-capitalize">
                                    {matrix.type.replace('-', ' ')}
                                  </span>
                                </td>
                                <td>{matrix.project || matrix.function || matrix.program}</td>
                                <td>{matrix.effectiveDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpanAnalytics = () => (
    <div className="card border shadow-none mb-4">
      <div className="card-body">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className={`accordion-button ${activeAccordion.includes('analytics') ? '' : 'collapsed'}`}
              type="button"
              onClick={() => toggleAccordion('analytics')}
            >
              <Icon icon="heroicons:chart-bar" className="me-2" />
              <strong>Span of Control Analytics</strong>
              <span className="badge bg-warning ms-2">Management Insights</span>
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${activeAccordion.includes('analytics') ? 'show' : ''}`}>
            <div className="accordion-body">
              <div className="row g-4">
                {/* Span Analytics Table */}
                <div className="col-md-6">
                  <div className="card border shadow-none h-100">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Span of Control by Level</h6>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Level</th>
                              <th>Average Span</th>
                              <th>Maximum Span</th>
                              <th>Minimum Span</th>
                              <th>Health</th>
                            </tr>
                          </thead>
                          <tbody>
                            {spanAnalytics.map(analytics => (
                              <tr key={analytics.level}>
                                <td className="fw-semibold">{analytics.level}</td>
                                <td>{analytics.avgSpan}</td>
                                <td>{analytics.maxSpan}</td>
                                <td>{analytics.minSpan}</td>
                                <td>
                                  {analytics.level === 'Overall Average' ? (
                                    <span className="badge bg-info">Optimal</span>
                                  ) : analytics.avgSpan > 30 ? (
                                    <span className="badge bg-warning">High</span>
                                  ) : analytics.avgSpan < 5 ? (
                                    <span className="badge bg-danger">Low</span>
                                  ) : (
                                    <span className="badge bg-success">Optimal</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Span Distribution Chart */}
                <div className="col-md-6">
                  <div className="card border shadow-none h-100">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Span Distribution Analysis</h6>
                      <div className="mb-4">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Optimal Range (5-15)</span>
                          <span className="fw-semibold">65% of managers</span>
                        </div>
                        <div className="progress" style={{ height: '20px' }}>
                          <div 
                            className="progress-bar bg-success" 
                            role="progressbar" 
                            style={{ width: '65%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex justify-content-between mb-2">
                          <span>High Span (15)</span>
                          <span className="fw-semibold text-warning">25% of managers</span>
                        </div>
                        <div className="progress" style={{ height: '20px' }}>
                          <div 
                            className="progress-bar bg-warning" 
                            role="progressbar" 
                            style={{ width: '25%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Low Span (5)</span>
                          <span className="fw-semibold text-danger">10% of managers</span>
                        </div>
                        <div className="progress" style={{ height: '20px' }}>
                          <div 
                            className="progress-bar bg-danger" 
                            role="progressbar" 
                            style={{ width: '10%' }}
                          ></div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="mt-4">
                        <h6 className="mb-3">Recommendations</h6>
                        <div className="list-group list-group-flush">
                          <div className="list-group-item border-0 px-0 py-2">
                            <div className="d-flex align-items-center">
                              <Icon icon="heroicons:check-circle" className="text-success me-2" />
                              <span>Consider splitting high-span teams (15+ reports)</span>
                            </div>
                          </div>
                          <div className="list-group-item border-0 px-0 py-2">
                            <div className="d-flex align-items-center">
                              <Icon icon="heroicons:check-circle" className="text-success me-2" />
                              <span>Review low-span managers for consolidation opportunities</span>
                            </div>
                          </div>
                          <div className="list-group-item border-0 px-0 py-2">
                            <div className="d-flex align-items-center">
                              <Icon icon="heroicons:check-circle" className="text-success me-2" />
                              <span>Implement dotted-line reporting for specialized functions</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manager Load Analysis */}
                <div className="col-12">
                  <div className="card border shadow-none">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Manager Load Analysis</h6>
                      <div className="row g-3">
                        <div className="col-md-3">
                          <div className="card border">
                            <div className="card-body text-center">
                              <h3 className="fw-bold text-danger mb-1">15</h3>
                              <p className="text-muted mb-0">Overloaded Managers</p>
                              <p className="text-danger small mb-0">15+ direct reports</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card border">
                            <div className="card-body text-center">
                              <h3 className="fw-bold text-success mb-1">52</h3>
                              <p className="text-muted mb-0">Optimal Managers</p>
                              <p className="text-success small mb-0">5-15 direct reports</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card border">
                            <div className="card-body text-center">
                              <h3 className="fw-bold text-warning mb-1">8</h3>
                              <p className="text-muted mb-0">Underloaded Managers</p>
                              <p className="text-warning small mb-0">Less than 5 reports</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card border">
                            <div className="card-body text-center">
                              <h3 className="fw-bold text-info mb-1">4:1</h3>
                              <p className="text-muted mb-0">Manager to IC Ratio</p>
                              <p className="text-info small mb-0">Industry avg: 5:1</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHierarchyManagement = () => (
    <div className="card border shadow-none mb-4">
      <div className="card-body">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className={`accordion-button ${activeAccordion.includes('management') ? '' : 'collapsed'}`}
              type="button"
              onClick={() => toggleAccordion('management')}
            >
              <Icon icon="heroicons:adjustments-horizontal" className="me-2" />
              <strong>Hierarchy Modification & Approval Workflow</strong>
              <span className="badge bg-info ms-2">{modificationRequests.filter(m => m.status === 'pending' || m.status === 'in-review').length} Pending</span>
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${activeAccordion.includes('management') ? 'show' : ''}`}>
            <div className="accordion-body">
              <div className="row g-4">
                {/* Modification Requests */}
                <div className="col-md-8">
                  <div className="card border shadow-none">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="card-title mb-0">Hierarchy Modification Requests</h6>
                        <button className="btn btn-sm btn-primary">
                          <Icon icon="heroicons:plus" className="me-1" />
                          New Request
                        </button>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Details</th>
                              <th>Requester</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modificationRequests.map(request => (
                              <tr key={request.id}>
                                <td>
                                  <span className="badge bg-primary-subtle text-primary text-capitalize">
                                    {request.type.replace('-', ' ')}
                                  </span>
                                </td>
                                <td>
                                  <div>
                                    <p className="fw-semibold mb-0 small">
                                      {request.type === 'add-position' && `Add ${request.position} in ${request.department}`}
                                      {request.type === 'modify-reporting' && `Move ${request.employee} to ${request.newManager}`}
                                      {request.type === 'dotted-line-add' && `Add dotted-line: ${request.employee} → ${request.manager}`}
                                      {request.type === 'restructure' && request.description}
                                    </p>
                                    <p className="text-muted small mb-0">
                                      Approvals needed: {request.approvalNeeded.join(', ')}
                                    </p>
                                  </div>
                                </td>
                                <td>{request.requester}</td>
                                <td>{request.date}</td>
                                <td>{getStatusBadge(request.status)}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    {request.status === 'pending' && (
                                      <>
                                        <button 
                                          className="btn btn-sm btn-success"
                                          onClick={() => handleApproveRequest(request.id)}
                                        >
                                          Approve
                                        </button>
                                        <button 
                                          className="btn btn-sm btn-danger"
                                          onClick={() => handleRejectRequest(request.id)}
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
                                    <button className="btn btn-sm btn-outline-primary">
                                      View
                                    </button>
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

                {/* Approval Workflow */}
                <div className="col-md-4">
                  <div className="card border shadow-none">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Hierarchy Change Approval Workflow</h6>
                      <div className="stepper">
                        <div className="stepper-item completed mb-4">
                          <div className="stepper-icon">
                            <Icon icon="heroicons:document-text" />
                          </div>
                          <div className="stepper-content">
                            <h6 className="stepper-title">Request Submitted</h6>
                            <p className="text-muted small mb-0">Manager submits change request</p>
                          </div>
                        </div>
                        <div className="stepper-item active mb-4">
                          <div className="stepper-icon">
                            <Icon icon="heroicons:user" />
                          </div>
                          <div className="stepper-content">
                            <h6 className="stepper-title">Department Head Review</h6>
                            <p className="text-muted small mb-0">Department head evaluates impact</p>
                          </div>
                        </div>
                        <div className="stepper-item pending mb-4">
                          <div className="stepper-icon">
                            <Icon icon="heroicons:users" />
                          </div>
                          <div className="stepper-content">
                            <h6 className="stepper-title">HR Business Partner Review</h6>
                            <p className="text-muted small mb-0">HR validates compliance & policy</p>
                          </div>
                        </div>
                        <div className="stepper-item pending">
                          <div className="stepper-icon">
                            <Icon icon="heroicons:check" />
                          </div>
                          <div className="stepper-content">
                            <h6 className="stepper-title">Final Approval</h6>
                            <p className="text-muted small mb-0">HR Head gives final approval</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button className="btn btn-outline-primary w-100">
                          <Icon icon="heroicons:cog-6-tooth" className="me-2" />
                          Configure Workflow
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoricalView = () => (
    <div className="card border shadow-none mb-4">
      <div className="card-body">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className={`accordion-button ${activeAccordion.includes('historical') ? '' : 'collapsed'}`}
              type="button"
              onClick={() => toggleAccordion('historical')}
            >
              <Icon icon="heroicons:clock" className="me-2" />
              <strong>Historical Hierarchy View & Time-Travel</strong>
              <span className="badge bg-secondary ms-2">Version History</span>
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${activeAccordion.includes('historical') ? 'show' : ''}`}>
            <div className="accordion-body">
              <div className="row g-4">
                {/* Time Travel Control */}
                <div className="col-md-4">
                  <div className="card border shadow-none">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Time-Travel Control</h6>
                      <div className="mb-3">
                        <label className="form-label">Select Date</label>
                        <input 
                          type="date" 
                          className="form-control"
                          value={selectedDate === 'current' ? new Date().toISOString().split('T')[0] : selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Or Select Version</label>
                        <select 
                          className="form-select"
                          value={selectedVersion}
                          onChange={(e) => setSelectedVersion(e.target.value)}
                        >
                          <option value="current">Current Structure (v1.3)</option>
                          {historicalData.map(history => (
                            <option key={history.version} value={history.version}>
                              {history.version} - {new Date(history.date).toLocaleDateString()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button 
                        className="btn btn-primary w-100"
                        onClick={() => handleTimeTravel(selectedVersion)}
                      >
                        <Icon icon="heroicons:arrow-path" className="me-2" />
                        Load Historical View
                      </button>
                    </div>
                  </div>
                </div>

                {/* Version History */}
                <div className="col-md-8">
                  <div className="card border shadow-none h-100">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Hierarchy Version History</h6>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Version</th>
                              <th>Date</th>
                              <th>Changes Made</th>
                              <th>Changed By</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {historicalData.map(history => (
                              <tr key={history.version}>
                                <td>
                                  <span className="badge bg-primary">{history.version}</span>
                                </td>
                                <td>{history.date}</td>
                                <td>{history.changes}</td>
                                <td>{history.by}</td>
                                <td>
                                  <button className="btn btn-sm btn-outline-primary">
                                    <Icon icon="heroicons:eye" className="me-1" />
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Historical Comparison */}
                <div className="col-12">
                  <div className="card border shadow-none">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Historical Comparison</h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="card border">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="mb-0">v1.0 (Jan 1, 2024)</h6>
                                <span className="badge bg-secondary">Historical</span>
                              </div>
                              <div className="text-muted small">
                                <p className="mb-2">• Initial organizational structure setup</p>
                                <p className="mb-2">• 850 employees across 6 departments</p>
                                <p className="mb-0">• 5 locations with headquarters in San Francisco</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card border-primary">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="mb-0">Current (v1.3)</h6>
                                <span className="badge bg-primary">Current</span>
                              </div>
                              <div className="text-muted small">
                                <p className="mb-2">• Added dotted-line reporting structure</p>
                                <p className="mb-2">• 965 employees across 7 departments</p>
                                <p className="mb-0">• 5 locations including remote workforce</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <button className="btn btn-outline-primary">
                          <Icon icon="heroicons:arrows-right-left" className="me-2" />
                          Compare Versions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDepartmentsLocations = () => (
    <div className="card border shadow-none">
      <div className="card-body">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className={`accordion-button ${activeAccordion.includes('dept-loc') ? '' : 'collapsed'}`}
              type="button"
              onClick={() => toggleAccordion('dept-loc')}
            >
              <Icon icon="heroicons:building-office-2" className="me-2" />
              <strong>Department & Location Views</strong>
              <span className="badge bg-success ms-2">Filtered Views</span>
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${activeAccordion.includes('dept-loc') ? 'show' : ''}`}>
            <div className="accordion-body">
              <div className="row g-4">
                {/* Departments Overview */}
                <div className="col-md-6">
                  <div className="card border shadow-none h-100">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Department-Wise Hierarchy</h6>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Department</th>
                              <th>Employees</th>
                              <th>Location</th>
                              <th>Department Head</th>
                              <th>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {departments.map(dept => (
                              <tr key={dept.id}>
                                <td>
                                  <div>
                                    <p className="fw-semibold mb-0">{dept.name}</p>
                                    <p className="text-muted small mb-0">ID: {dept.id}</p>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge bg-primary">{dept.employees}</span>
                                </td>
                                <td>{dept.location}</td>
                                <td>{dept.head}</td>
                                <td>
                                  <button className="btn btn-sm btn-outline-primary">
                                    View Org Chart
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Locations Overview */}
                <div className="col-md-6">
                  <div className="card border shadow-none h-100">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Location-Wise Hierarchy</h6>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Location</th>
                              <th>Employees</th>
                              <th>Departments</th>
                              <th>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {locations.map(loc => (
                              <tr key={loc.id}>
                                <td>
                                  <div>
                                    <p className="fw-semibold mb-0">{loc.name}</p>
                                    <p className="text-muted small mb-0">ID: {loc.id}</p>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge bg-success">{loc.employees}</span>
                                </td>
                                <td>{loc.departments}</td>
                                <td>
                                  <button className="btn btn-sm btn-outline-success">
                                    View Location Chart
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="col-12">
                  <div className="card border shadow-none">
                    <div className="card-body">
                      <h6 className="card-title mb-3">Advanced Search & Filter</h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">Search Employee</label>
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search by name, ID, or position..."
                            />
                            <Icon icon="heroicons:magnifying-glass" className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Filter by Department</label>
                          <select className="form-select">
                            <option value="">All Departments</option>
                            <option value="technology">Technology</option>
                            <option value="product">Product</option>
                            <option value="finance">Finance</option>
                            <option value="operations">Operations</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Filter by Location</label>
                          <select className="form-select">
                            <option value="">All Locations</option>
                            <option value="san-francisco">San Francisco</option>
                            <option value="new-york">New York</option>
                            <option value="chicago">Chicago</option>
                            <option value="austin">Austin</option>
                            <option value="remote">Remote</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button className="btn btn-primary me-2">
                          <Icon icon="heroicons:magnifying-glass" className="me-2" />
                          Search
                        </button>
                        <button className="btn btn-outline-secondary">
                          <Icon icon="heroicons:arrow-path" className="me-2" />
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  

  return (
    <>
      <div className="container-fluid px-3 px-md-4 py-3">
        {/* Header */}
        <div className="mb-4">
          <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
            <Icon icon="heroicons:building-office" />
            Organizational Hierarchy & Reporting Structure
          </h5>
          <p className="text-muted">
            Visualize and manage organizational structure, reporting relationships, and hierarchy analytics
          </p>
        </div>
        {/* Render all sections */}
        {renderDashboard()}
        {renderOrgChart()}
        {renderReportingRelationships()}
        {renderSpanAnalytics()}
        {renderHierarchyManagement()}
        {renderHistoricalView()}
        {renderDepartmentsLocations()}

        {/* Quick Links Footer */}
        <div className="card border shadow-none mt-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex gap-3">
                <a href="#" className="text-decoration-none d-flex align-items-center gap-2">
                  <Icon icon="heroicons:question-mark-circle" />
                  <span>Help & Documentation</span>
                </a>
                <a href="#" className="text-decoration-none d-flex align-items-center gap-2">
                  <Icon icon="heroicons:document-arrow-up" />
                  <span>Import Structure</span>
                </a>
                <a href="#" className="text-decoration-none d-flex align-items-center gap-2">
                  <Icon icon="heroicons:cog-6-tooth" />
                  <span>Settings</span>
                </a>
              </div>
              <div className="text-muted small">
                Organizational Hierarchy v2.0 • Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationHierarchy;