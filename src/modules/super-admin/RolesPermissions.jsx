import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RolesPermissions = () => {
  // ==================== MODULES & FEATURES ====================
  const modules = [
    {
      id: 'tenant',
      name: 'Tenant Management',
      features: [
        { id: 'view_tenants', name: 'View Tenants', category: 'read' },
        { id: 'create_tenant', name: 'Create Tenant', category: 'write' },
        { id: 'edit_tenant', name: 'Edit Tenant', category: 'update' },
        { id: 'delete_tenant', name: 'Delete Tenant', category: 'delete' },
        { id: 'manage_billing', name: 'Manage Billing', category: 'manage' }
      ]
    },
    {
      id: 'user',
      name: 'User Management',
      features: [
        { id: 'view_users', name: 'View Users', category: 'read' },
        { id: 'create_user', name: 'Create User', category: 'write' },
        { id: 'edit_user', name: 'Edit User', category: 'update' },
        { id: 'delete_user', name: 'Delete User', category: 'delete' },
        { id: 'reset_password', name: 'Reset Password', category: 'manage' },
        { id: 'manage_roles', name: 'Manage Roles', category: 'manage' }
      ]
    },
    {
      id: 'employee',
      name: 'Employee Management',
      features: [
        { id: 'view_employees', name: 'View Employees', category: 'read' },
        { id: 'create_employee', name: 'Create Employee', category: 'write' },
        { id: 'edit_employee', name: 'Edit Employee', category: 'update' },
        { id: 'delete_employee', name: 'Delete Employee', category: 'delete' },
        { id: 'approve_employee', name: 'Approve Employee', category: 'approve' },
        { id: 'import_employees', name: 'Import Employees', category: 'manage' }
      ]
    },
    {
      id: 'attendance',
      name: 'Attendance Management',
      features: [
        { id: 'view_attendance', name: 'View Attendance', category: 'read' },
        { id: 'mark_attendance', name: 'Mark Attendance', category: 'write' },
        { id: 'edit_attendance', name: 'Edit Attendance', category: 'update' },
        { id: 'approve_attendance', name: 'Approve Attendance', category: 'approve' },
        { id: 'manage_shifts', name: 'Manage Shifts', category: 'manage' }
      ]
    },
    {
      id: 'leave',
      name: 'Leave Management',
      features: [
        { id: 'view_leaves', name: 'View Leaves', category: 'read' },
        { id: 'apply_leave', name: 'Apply Leave', category: 'write' },
        { id: 'approve_leave', name: 'Approve Leave', category: 'approve' },
        { id: 'cancel_leave', name: 'Cancel Leave', category: 'delete' },
        { id: 'manage_policies', name: 'Manage Policies', category: 'manage' }
      ]
    },
    {
      id: 'payroll',
      name: 'Payroll Management',
      features: [
        { id: 'view_payroll', name: 'View Payroll', category: 'read' },
        { id: 'process_payroll', name: 'Process Payroll', category: 'write' },
        { id: 'edit_salary', name: 'Edit Salary', category: 'update' },
        { id: 'approve_payroll', name: 'Approve Payroll', category: 'approve' },
        { id: 'manage_components', name: 'Manage Components', category: 'manage' }
      ]
    }
  ];

  // ==================== PERMISSION CATEGORIES ====================
  const permissionCategories = [
    { id: 'read', name: 'Read', color: 'primary' },
    { id: 'write', name: 'Write', color: 'success' },
    { id: 'update', name: 'Update', color: 'warning' },
    { id: 'delete', name: 'Delete', color: 'danger' },
    { id: 'approve', name: 'Approve', color: 'info' },
    { id: 'manage', name: 'Manage', color: 'dark' }
  ];

  // ==================== DATA LEVEL PERMISSIONS ====================
  const dataLevels = [
    { id: 'own', name: 'Own Data', description: 'Access only personal data' },
    { id: 'team', name: 'Team Data', description: 'Access team member data' },
    { id: 'department', name: 'Department Data', description: 'Access department-wide data' },
    { id: 'all', name: 'All Data', description: 'Access all organization data' }
  ];

  // ==================== ROLE HIERARCHY ====================
  const roleHierarchy = [
    { id: 1, name: 'Super Admin', level: 100, },
    { id: 2, name: 'HR Admin', level: 90,  },
    { id: 3, name: 'HR Manager', level: 80,  },
    { id: 4, name: 'Manager', level: 70,},
    { id: 5, name: 'Employee', level: 60,  }
  ];

  // ==================== PERMISSION TEMPLATES ====================
  const permissionTemplates = [
    {
      id: 'full_access',
      name: 'Full System Access',
      description: 'Complete access to all modules and features',
      modules: ['tenant', 'user', 'employee', 'attendance', 'leave', 'payroll'],
      permissions: {
        tenant: ['read', 'write', 'update', 'delete', 'manage'],
        user: ['read', 'write', 'update', 'delete', 'manage'],
        employee: ['read', 'write', 'update', 'delete', 'approve', 'manage'],
        attendance: ['read', 'write', 'update', 'delete', 'approve', 'manage'],
        leave: ['read', 'write', 'update', 'delete', 'approve', 'manage'],
        payroll: ['read', 'write', 'update', 'delete', 'approve', 'manage']
      }
    },
    {
      id: 'hr_admin',
      name: 'HR Administrator',
      description: 'HR operations and employee management',
      modules: ['user', 'employee', 'attendance', 'leave'],
      permissions: {
        user: ['read', 'write', 'update'],
        employee: ['read', 'write', 'update', 'approve'],
        attendance: ['read', 'update', 'approve'],
        leave: ['read', 'update', 'approve']
      }
    },
    {
      id: 'manager',
      name: 'Team Manager',
      description: 'Team management with approval rights',
      modules: ['employee', 'attendance', 'leave'],
      permissions: {
        employee: ['read'],
        attendance: ['read', 'approve'],
        leave: ['read', 'approve']
      }
    },
    {
      id: 'payroll_admin',
      name: 'Payroll Administrator',
      description: 'Payroll processing and management',
      modules: ['employee', 'payroll'],
      permissions: {
        employee: ['read'],
        payroll: ['read', 'write', 'update', 'approve']
      }
    }
  ];

  // ==================== SAMPLE USERS ====================
  const sampleUsers = [
    { id: 1, name: 'John Doe', email: 'john@techcorp.com', currentRole: 'HR Admin', department: 'HR' },
    { id: 2, name: 'Jane Smith', email: 'jane@techcorp.com', currentRole: 'Manager', department: 'Sales' },
    { id: 3, name: 'Robert Johnson', email: 'robert@techcorp.com', currentRole: 'Employee', department: 'IT' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@techcorp.com', currentRole: 'HR Manager', department: 'HR' },
    { id: 5, name: 'Michael Brown', email: 'michael@techcorp.com', currentRole: 'Employee', department: 'Finance' },
    { id: 6, name: 'Emily Davis', email: 'emily@techcorp.com', currentRole: 'Manager', department: 'Marketing' },
    { id: 7, name: 'David Wilson', email: 'david@techcorp.com', currentRole: 'Employee', department: 'Operations' },
    { id: 8, name: 'Lisa Miller', email: 'lisa@techcorp.com', currentRole: 'Employee', department: 'Customer Support' }
  ];

  // ==================== STATE MANAGEMENT ====================
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      type: 'predefined',
      description: 'Full system access across all tenants and modules',
      hierarchyLevel: 100,
      inheritsFrom: null,
      dataLevel: 'all',
      userCount: 3,
      status: 'active',
      createdAt: '2024-01-01',
      permissions: generateFullPermissions(),
      temporaryAssignments: [],
      conflicts: []
    },
    {
      id: 2,
      name: 'HR Admin',
      type: 'predefined',
      description: 'HR operations management',
      hierarchyLevel: 90,
      inheritsFrom: 'Super Admin',
      dataLevel: 'department',
      userCount: 5,
      status: 'active',
      createdAt: '2024-01-15',
      permissions: generateHRAdminPermissions(),
      temporaryAssignments: [],
      conflicts: []
    },
    {
      id: 3,
      name: 'HR Manager',
      type: 'predefined',
      description: 'Team management and basic HR operations',
      hierarchyLevel: 80,
      inheritsFrom: 'HR Admin',
      dataLevel: 'team',
      userCount: 12,
      status: 'active',
      createdAt: '2024-02-10',
      permissions: generateHRManagerPermissions(),
      temporaryAssignments: [],
      conflicts: []
    },
    {
      id: 4,
      name: 'Manager',
      type: 'predefined',
      description: 'Team lead with limited HR access',
      hierarchyLevel: 70,
      inheritsFrom: 'HR Manager',
      dataLevel: 'team',
      userCount: 25,
      status: 'active',
      createdAt: '2024-03-05',
      permissions: generateManagerPermissions(),
      temporaryAssignments: [],
      conflicts: []
    },
    {
      id: 5,
      name: 'Employee',
      type: 'predefined',
      description: 'Self-service access only',
      hierarchyLevel: 60,
      inheritsFrom: 'Manager',
      dataLevel: 'own',
      userCount: 150,
      status: 'active',
      createdAt: '2024-04-01',
      permissions: generateEmployeePermissions(),
      temporaryAssignments: [],
      conflicts: []
    },
    {
      id: 6,
      name: 'Payroll Specialist',
      type: 'custom',
      description: 'Custom role for payroll processing',
      hierarchyLevel: 75,
      inheritsFrom: 'HR Admin',
      dataLevel: 'department',
      userCount: 4,
      status: 'active',
      createdAt: '2024-05-20',
      permissions: generatePayrollSpecialistPermissions(),
      temporaryAssignments: [
        {
          id: 1,
          userId: 3,
          userName: 'Robert Johnson',
          startDate: '2024-12-01',
          endDate: '2024-12-31',
          reason: 'Temporary payroll coverage',
          status: 'active'
        }
      ],
      conflicts: []
    }
  ]);

  // ==================== PERMISSION CACHE ====================
  const [permissionCache, setPermissionCache] = useState({});
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, userId: 1, userName: 'John Doe', role: 'HR Admin', loginTime: '2024-12-03 09:15:00', ip: '192.168.1.100' },
    { id: 2, userId: 2, userName: 'Jane Smith', role: 'Manager', loginTime: '2024-12-03 10:30:00', ip: '192.168.1.101' },
    { id: 3, userId: 3, userName: 'Robert Johnson', role: 'Employee', loginTime: '2024-12-03 08:45:00', ip: '192.168.1.102' }
  ]);

  // ==================== UI STATES ====================
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTemporaryModal, setShowTemporaryModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    type: 'custom',
    hierarchyLevel: 65,
    inheritsFrom: '',
    dataLevel: 'team',
    status: 'active'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('hierarchyLevel');
  const [sortOrder, setSortOrder] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ==================== HELPER FUNCTIONS ====================
  function generateFullPermissions() {
    const permissions = {};
    modules.forEach(module => {
      permissions[module.id] = {};
      permissionCategories.forEach(category => {
        permissions[module.id][category.id] = true;
      });
    });
    return permissions;
  }

  function generateHRAdminPermissions() {
    return {
      user: { read: true, write: true, update: true, delete: false, approve: false, manage: false },
      employee: { read: true, write: true, update: true, delete: true, approve: true, manage: false },
      attendance: { read: true, write: false, update: true, delete: false, approve: true, manage: false },
      leave: { read: true, write: false, update: true, delete: false, approve: true, manage: false },
      payroll: { read: true, write: false, update: false, delete: false, approve: false, manage: false }
    };
  }

  function generateHRManagerPermissions() {
    return {
      employee: { read: true, write: false, update: true, delete: false, approve: false, manage: false },
      attendance: { read: true, write: false, update: true, delete: false, approve: true, manage: false },
      leave: { read: true, write: false, update: false, delete: false, approve: true, manage: false }
    };
  }

  function generateManagerPermissions() {
    return {
      employee: { read: true, write: false, update: false, delete: false, approve: false, manage: false },
      attendance: { read: true, write: false, update: false, delete: false, approve: true, manage: false },
      leave: { read: true, write: false, update: false, delete: false, approve: true, manage: false }
    };
  }

  function generateEmployeePermissions() {
    return {
      employee: { read: true, write: false, update: false, delete: false, approve: false, manage: false },
      attendance: { read: true, write: true, update: false, delete: false, approve: false, manage: false },
      leave: { read: true, write: true, update: false, delete: false, approve: false, manage: false }
    };
  }

  function generatePayrollSpecialistPermissions() {
    return {
      employee: { read: true, write: false, update: false, delete: false, approve: false, manage: false },
      payroll: { read: true, write: true, update: true, delete: false, approve: true, manage: false }
    };
  }

  // ==================== REAL-TIME PERMISSION EVALUATION ====================
  const evaluatePermission = useCallback((roleId, moduleId, permissionId) => {
    const cacheKey = `${roleId}_${moduleId}_${permissionId}`;
    
    if (permissionCache[cacheKey] !== undefined) {
      return permissionCache[cacheKey];
    }

    const role = roles.find(r => r.id === roleId);
    if (!role) return false;

    const hasDirectPermission = role.permissions[moduleId]?.[permissionId] || false;
    
    let inheritedPermission = false;
    if (role.inheritsFrom) {
      const parentRole = roles.find(r => r.name === role.inheritsFrom);
      if (parentRole) {
        inheritedPermission = evaluatePermission(parentRole.id, moduleId, permissionId);
      }
    }

    const result = hasDirectPermission || inheritedPermission;
    
    setPermissionCache(prev => ({
      ...prev,
      [cacheKey]: result
    }));

    return result;
  }, [roles, permissionCache]);

  // ==================== ROLE CONFLICT DETECTION ====================
  const detectConflicts = useCallback((role) => {
    const conflicts = [];
    
    roles.forEach(otherRole => {
      if (otherRole.id !== role.id) {
        if (otherRole.inheritsFrom === role.name && role.inheritsFrom === otherRole.name) {
          conflicts.push({
            type: 'circular_inheritance',
            message: `Circular inheritance detected with ${otherRole.name}`,
            severity: 'high'
          });
        }
        
        if (role.hierarchyLevel < otherRole.hierarchyLevel) {
          const duplicatePermissions = [];
          Object.keys(role.permissions).forEach(moduleId => {
            Object.keys(role.permissions[moduleId] || {}).forEach(permId => {
              if (role.permissions[moduleId][permId] && 
                  otherRole.permissions[moduleId]?.[permId]) {
                duplicatePermissions.push(`${moduleId}.${permId}`);
              }
            });
          });
          
          if (duplicatePermissions.length > 0) {
            conflicts.push({
              type: 'permission_overlap',
              message: `Permission overlap with higher role ${otherRole.name}`,
              details: duplicatePermissions,
              severity: 'medium'
            });
          }
        }
      }
    });
    
    return conflicts;
  }, [roles]);

  // ==================== PERMISSION CHANGE PROPAGATION ====================
  const propagatePermissionChanges = useCallback((roleId) => {
    const newCache = { ...permissionCache };
    Object.keys(newCache).forEach(key => {
      if (key.startsWith(`${roleId}_`)) {
        delete newCache[key];
      }
    });
    setPermissionCache(newCache);
    
    const affectedSessions = activeSessions.filter(session => {
      const userRole = roles.find(r => r.name === session.role);
      return userRole && (userRole.id === roleId || userRole.inheritsFrom === roles.find(r => r.id === roleId)?.name);
    });
    
    if (affectedSessions.length > 0) {
      console.log(`Permissions updated for ${affectedSessions.length} active sessions`);
      
      if (showSessionModal) {
        setShowSessionModal(true);
      }
    }
  }, [permissionCache, activeSessions, roles]);

  // ==================== STATISTICS ====================
  const stats = {
    total: roles.length,
    active: roles.filter(r => r.status === 'active').length,
    predefined: roles.filter(r => r.type === 'predefined').length,
    custom: roles.filter(r => r.type === 'custom').length,
    totalUsers: roles.reduce((sum, r) => sum + r.userCount, 0),
    conflicts: roles.reduce((sum, r) => sum + (r.conflicts?.length || 0), 0)
  };

  // ==================== SEARCH + FILTER + SORT ====================
  const filteredRoles = roles
    .filter(r => {
      const searchMatch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase());

      const typeMatch = filterType === 'all' || r.type === filterType;
      const statusMatch = filterStatus === 'all' || r.status === filterStatus;

      return searchMatch && typeMatch && statusMatch;
    })
    .sort((a, b) => {
      let A, B;
      
      if (sortBy === 'name') {
        A = a.name.toLowerCase();
        B = b.name.toLowerCase();
      } else if (sortBy === 'userCount') {
        A = a.userCount;
        B = b.userCount;
      } else if (sortBy === 'hierarchyLevel') {
        A = a.hierarchyLevel;
        B = b.hierarchyLevel;
      } else if (sortBy === 'createdAt') {
        A = new Date(a.createdAt);
        B = new Date(b.createdAt);
      } else {
        A = a[sortBy];
        B = b[sortBy];
      }

      if (sortOrder === 'asc') return A > B ? 1 : -1;
      else return A < B ? 1 : -1;
    });

  // ==================== PAGINATION ====================
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ==================== PERMISSION HANDLERS ====================
  const handlePermissionToggle = (moduleId, permissionId) => {
    setRolePermissions(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permissionId]: !prev[moduleId]?.[permissionId]
      }
    }));
  };

  const handleModuleToggle = (moduleId, categoryIds) => {
    const newPermissions = {};
    categoryIds.forEach(catId => {
      newPermissions[catId] = true;
    });
    
    setRolePermissions(prev => ({
      ...prev,
      [moduleId]: newPermissions
    }));
  };

  const handleApplyTemplate = (template) => {
    const newPermissions = {};
    template.modules.forEach(moduleId => {
      newPermissions[moduleId] = {};
      template.permissions[moduleId].forEach(perm => {
        newPermissions[moduleId][perm] = true;
      });
    });
    
    setRolePermissions(newPermissions);
    setShowTemplateModal(false);
  };

  // ==================== TEMPORARY ASSIGNMENT HANDLERS ====================
  const handleAddTempAssignment = (roleId, assignment) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          temporaryAssignments: [
            ...role.temporaryAssignments,
            {
              id: Date.now(),
              ...assignment,
              status: new Date(assignment.endDate) > new Date() ? 'active' : 'expired'
            }
          ]
        };
      }
      return role;
    }));
  };

  // ==================== BULK ASSIGNMENT HANDLERS ====================
  const handleBulkAssign = () => {
    if (!selectedRole || selectedUsers.length === 0) return;
    
    console.log(`Bulk assigning ${selectedRole.name} to ${selectedUsers.length} users`);
    
    setRoles(roles.map(role => {
      if (role.id === selectedRole.id) {
        return {
          ...role,
          userCount: role.userCount + selectedUsers.length
        };
      }
      return role;
    }));
    
    setShowBulkAssignModal(false);
    setSelectedUsers([]);
  };

  // ==================== ROLE CRUD OPERATIONS ====================
  const handleAddRole = (e) => {
    e.preventDefault();

    const newEntry = {
      ...newRole,
      id: roles.length + 1,
      userCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      permissions: rolePermissions,
      temporaryAssignments: [],
      conflicts: detectConflicts({ ...newRole, permissions: rolePermissions })
    };

    setRoles([...roles, newEntry]);
    setShowAddModal(false);

    setNewRole({
      name: '',
      description: '',
      type: 'custom',
      hierarchyLevel: 65,
      inheritsFrom: '',
      dataLevel: 'team',
      status: 'active'
    });
    
    setRolePermissions({});
  };

  const handleUpdateRole = (e) => {
    e.preventDefault();

    const updatedRole = {
      ...selectedRole,
      permissions: rolePermissions,
      conflicts: detectConflicts({ ...selectedRole, permissions: rolePermissions })
    };

    setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));
    
    propagatePermissionChanges(selectedRole.id);
    
    setShowEditModal(false);
  };

  const handleDeleteRole = () => {
    setRoles(roles.filter(r => r.id !== selectedRole.id));
    setShowDeleteModal(false);
  };

  // ==================== BADGE COMPONENTS ====================
  const getStatusBadge = (status) => {
    const colors = { active: "success", inactive: "danger" };
    return (
      <span className={`badge bg-${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const colors = { predefined: "info", custom: "warning" };
    return (
      <span className={`badge bg-${colors[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getDataLevelBadge = (level) => {
    const colors = { own: "secondary", team: "primary", department: "info", all: "success" };
    return (
      <span className={`badge bg-${colors[level]}`}>
        {dataLevels.find(d => d.id === level)?.name || level}
      </span>
    );
  };

  const getConflictBadge = (conflictCount) => {
    if (!conflictCount || conflictCount === 0) return null;
    
    return (
      <span className="badge bg-danger">
        ⚠️ {conflictCount} conflict{conflictCount > 1 ? 's' : ''}
      </span>
    );
  };

  // ==================== PERMISSION SUMMARY ====================
  const getPermissionSummary = (permissions) => {
    if (!permissions) return { moduleCount: 0, permissionCount: 0 };
    
    let moduleCount = 0;
    let permissionCount = 0;
    
    Object.values(permissions).forEach(modulePerms => {
      if (Object.values(modulePerms).some(v => v)) {
        moduleCount++;
        permissionCount += Object.values(modulePerms).filter(v => v).length;
      }
    });
    
    return { moduleCount, permissionCount };
  };

  // ==================== FORMATTERS ====================
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formatDateTime = (datetime) => new Date(datetime).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // ==================== MENU ITEMS ====================
  const menuItems = [
    { title: 'Dashboard', link: '/admin/dashboard', active: false },
    { title: 'Tenant Management', link: '/admin/tenants', active: false },
    { title: 'User Management', link: '/admin/users' },
    { title: 'RBAC Management', link: '/admin/rbac', active: true },
    { title: 'Reports', link: '/admin/reports' },
    { title: 'Settings', link: '/admin/settings' }
  ];

  const userInfo = {
    name: 'Admin User',
    role: 'Super Administrator',
    email: 'admin@hrms.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  };

  // ==================== INITIALIZATION ====================
  useEffect(() => {
    if (selectedRole && showEditModal) {
      setRolePermissions(selectedRole.permissions || {});
    }
  }, [selectedRole, showEditModal]);

  // ==================== MAIN COMPONENT RENDER ====================
  return (
    
      <div className="container-fluid px-3 px-md-4 py-3">

        {/* ==================== HEADER ==================== */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h5 className="fw-bold mb-1">Roles & Permissions</h5>
            <p className="text-muted mb-0">Manage roles, permissions, and access control with real-time evaluation</p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => setShowTemplateModal(true)}
            >
              <span className="d-none d-md-inline">Templates</span>
            </button>

            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <span className="d-none d-md-inline">Create Role</span>
              <span className="d-md-none">New Role</span>
            </button>
          </div>
        </div>

        {/* ==================== STATISTICS ==================== */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border h-100">
              <div className="card-body text-center p-2 p-md-3">
                <h6 className="text-muted mb-1 mb-md-2 small">Total Roles</h6>
                <h4 className="fw-bold mb-0">{stats.total}</h4>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border h-100">
              <div className="card-body text-center p-2 p-md-3">
                <h6 className="text-muted mb-1 mb-md-2 small">Active Users</h6>
                <h4 className="fw-bold text-success mb-0">{stats.totalUsers}</h4>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border h-100">
              <div className="card-body text-center p-2 p-md-3">
                <h6 className="text-muted mb-1 mb-md-2 small">Predefined</h6>
                <h4 className="fw-bold text-info mb-0">{stats.predefined}</h4>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border h-100">
              <div className="card-body text-center p-2 p-md-3">
                <h6 className="text-muted mb-1 mb-md-2 small">Custom</h6>
                <h4 className="fw-bold text-warning mb-0">{stats.custom}</h4>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border h-100">
              <div className="card-body text-center p-2 p-md-3">
                <h6 className="text-muted mb-1 mb-md-2 small">Active Sessions</h6>
                <h4 className="fw-bold text-primary mb-0">{activeSessions.length}</h4>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border h-100">
              <div className="card-body text-center p-2 p-md-3">
                <h6 className="text-muted mb-1 mb-md-2 small">Conflicts</h6>
                <h4 className="fw-bold text-danger mb-0">{stats.conflicts}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== FILTER BAR ==================== */}
        <div className="card border mb-4">
          <div className="card-body p-3">
            <div className="row g-2 g-md-3">
              <div className="col-12 col-md-3 mb-2 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search roles..."
                    className="form-control border-start-0 ps-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-6 col-md-2 mb-2 mb-md-0">
                <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="predefined">Predefined</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="col-6 col-md-2 mb-2 mb-md-0">
                <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="col-6 col-md-3 mb-2 mb-md-0">
                <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="hierarchyLevel">Sort by Level</option>
                  <option value="name">Sort by Name</option>
                  <option value="userCount">Sort by Users</option>
                  <option value="createdAt">Sort by Created</option>
                </select>
              </div>

              <div className="col-6 col-md-2">
                <button
                  className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  <span className="d-none d-md-inline">Sort</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== ROLES TABLE ==================== */}
        <div className="card border">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-3 ps-md-4 py-3 border-0">Role</th>
                    <th className="py-3 border-0 d-none d-md-table-cell">Type</th>
                    <th className="py-3 border-0 d-none d-lg-table-cell">Hierarchy</th>
                    <th className="py-3 border-0 d-none d-lg-table-cell">Data Access</th>
                    <th className="py-3 border-0">Users</th>
                    <th className="py-3 border-0 d-none d-xl-table-cell">Permissions</th>
                    <th className="py-3 border-0 d-none d-md-table-cell">Status</th>
                    <th className="pe-3 pe-md-4 py-3 border-0 text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRoles.map((role) => {
                    const summary = getPermissionSummary(role.permissions);
                    
                    return (
                      <tr key={role.id} className="border-top">
                        {/* Role Name */}
                        <td className="ps-3 ps-md-4 py-3">
                          <div className="d-flex align-items-center gap-2 gap-md-3">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ 
                                width: '36px', 
                                height: '36px', 
                                backgroundColor: roleHierarchy.find(r => r.name === role.name)?.color || '#6c757d',
                                color: 'white'
                              }}
                            >
                              🛡️
                            </div>
                            <div>
                              <div className="d-flex align-items-center gap-2">
                                <strong className="d-block small">{role.name}</strong>
                                {role.conflicts?.length > 0 && getConflictBadge(role.conflicts.length)}
                              </div>
                              <small className="text-muted d-block d-md-none">
                                {getTypeBadge(role.type)} • {role.userCount} users
                              </small>
                              <small className="text-muted d-none d-md-block">
                                {role.description.substring(0, 50)}...
                                {role.inheritsFrom && (
                                  <span className="ms-2">
                                    🔗 <small>Inherits from {role.inheritsFrom}</small>
                                  </span>
                                )}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* Role Type */}
                        <td className="py-3 d-none d-md-table-cell">{getTypeBadge(role.type)}</td>

                        {/* Hierarchy */}
                        <td className="py-3 d-none d-lg-table-cell">
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-light rounded-pill px-2 py-1">
                              <small className="fw-medium">L{role.hierarchyLevel}</small>
                            </div>
                            {role.inheritsFrom && (
                              <small className="text-muted">
                                🔗 {role.inheritsFrom}
                              </small>
                            )}
                          </div>
                        </td>

                        {/* Data Level */}
                        <td className="py-3 d-none d-lg-table-cell">{getDataLevelBadge(role.dataLevel)}</td>

                        {/* Users */}
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2">
                            👥
                            <div>
                              <div className="fw-medium">{role.userCount}</div>
                              {role.temporaryAssignments?.length > 0 && (
                                <small className="text-muted d-block">
                                  +{role.temporaryAssignments.length} temp
                                </small>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Permissions */}
                        <td className="py-3 d-none d-xl-table-cell">
                          <div className="d-flex flex-column">
                            <small className="text-muted">
                              {summary.moduleCount} modules • {summary.permissionCount} permissions
                            </small>
                            <div className="d-flex gap-1 mt-1">
                              {Object.entries(role.permissions).slice(0, 3).map(([moduleId, perms]) => {
                                const activePerms = Object.values(perms).filter(v => v).length;
                                if (activePerms === 0) return null;
                                return (
                                  <span key={moduleId} className="badge bg-light text-dark border small">
                                    {moduleId} ({activePerms})
                                  </span>
                                );
                              })}
                              {summary.moduleCount > 3 && (
                                <span className="badge bg-secondary small">
                                  +{summary.moduleCount - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 d-none d-md-table-cell">{getStatusBadge(role.status)}</td>

                        {/* Actions */}
                        <td className="pe-3 pe-md-4 py-3 text-end">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setSelectedRole(role);
                                setShowViewModal(true);
                              }}
                              title="View Details"
                            >
                              👁️
                            </button>

                            <button
                              className="btn btn-outline-secondary btn-sm d-none d-md-inline-flex"
                              onClick={() => {
                                setSelectedRole({ ...role });
                                setShowEditModal(true);
                              }}
                              title="Edit"
                            >
                              ✏️
                            </button>

                            <button
                              className="btn btn-outline-info btn-sm"
                              onClick={() => {
                                setSelectedRole(role);
                                setShowBulkAssignModal(true);
                              }}
                              title="Bulk Assign"
                            >
                              ➕
                            </button>

                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                setSelectedRole(role);
                                setShowDeleteModal(true);
                              }}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedRoles.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <div className="py-5">
                        
                          <h6 className="text-muted">No roles found</h6>
                          <p className="text-muted mb-0 small">Try adjusting your search or create a new role</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ==================== PAGINATION ==================== */}
          <div className="card-footer bg-transparent border-0 px-3 px-md-4 py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="text-muted small">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRoles.length)} of {filteredRoles.length} roles
            </div>
            
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>
                    Previous
                  </button>
                </li>

                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* ==================== MODALS ==================== */}

        {/* ADD ROLE MODAL */}
        {showAddModal && (
          <AddRoleModal
            newRole={newRole}
            setNewRole={setNewRole}
            rolePermissions={rolePermissions}
            setRolePermissions={setRolePermissions}
            modules={modules}
            permissionCategories={permissionCategories}
            roleHierarchy={roleHierarchy}
            dataLevels={dataLevels}
            handleAddRole={handleAddRole}
            setShowAddModal={setShowAddModal}
            setShowTemplateModal={setShowTemplateModal}
          />
        )}

        {/* EDIT ROLE MODAL */}
        {showEditModal && selectedRole && (
          <EditRoleModal
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            rolePermissions={rolePermissions}
            setRolePermissions={setRolePermissions}
            modules={modules}
            permissionCategories={permissionCategories}
            roleHierarchy={roleHierarchy}
            dataLevels={dataLevels}
            handleUpdateRole={handleUpdateRole}
            setShowEditModal={setShowEditModal}
            setShowTemplateModal={setShowTemplateModal}
          />
        )}

        {/* VIEW ROLE MODAL */}
        {showViewModal && selectedRole && (
          <ViewRoleModal
            selectedRole={selectedRole}
            modules={modules}
            permissionCategories={permissionCategories}
            dataLevels={dataLevels}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            getTypeBadge={getTypeBadge}
            getDataLevelBadge={getDataLevelBadge}
            setShowViewModal={setShowViewModal}
            setShowTemporaryModal={setShowTemporaryModal}
            setShowConflictModal={setShowConflictModal}
          />
        )}

        {/* BULK ASSIGN MODAL */}
        {showBulkAssignModal && selectedRole && (
          <BulkAssignModal
            selectedRole={selectedRole}
            sampleUsers={sampleUsers}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            handleBulkAssign={handleBulkAssign}
            setShowBulkAssignModal={setShowBulkAssignModal}
          />
        )}

        {/* TEMPLATE MODAL */}
        {showTemplateModal && (
          <TemplateModal
            permissionTemplates={permissionTemplates}
            modules={modules}
            handleApplyTemplate={handleApplyTemplate}
            setShowTemplateModal={setShowTemplateModal}
          />
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && selectedRole && (
          <DeleteRoleModal
            selectedRole={selectedRole}
            handleDeleteRole={handleDeleteRole}
            setShowDeleteModal={setShowDeleteModal}
          />
        )}

        {/* SESSION NOTIFICATION MODAL */}
        {showSessionModal && (
          <SessionNotificationModal
            activeSessions={activeSessions}
            setShowSessionModal={setShowSessionModal}
          />
        )}

      </div>
    
  );
};

// ==================== MODAL COMPONENTS ====================

const AddRoleModal = ({
  newRole, setNewRole, rolePermissions, setRolePermissions, modules, permissionCategories,
  roleHierarchy, dataLevels, handleAddRole, setShowAddModal, setShowTemplateModal
}) => (
  <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered modal-xl">
      <div className="modal-content border-0 shadow-lg">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Create New Role</h5>
          <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
        </div>

        <form onSubmit={handleAddRole}>
          <div className="modal-body pt-0">
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-medium">Role Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-medium">Role Type</label>
                <select
                  className="form-select"
                  value={newRole.type}
                  onChange={(e) => setNewRole({ ...newRole, type: e.target.value })}
                >
                  <option value="custom">Custom Role</option>
                  <option value="predefined" disabled>Predefined Role</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-medium">Hierarchy Level</label>
                <select
                  className="form-select"
                  value={newRole.hierarchyLevel}
                  onChange={(e) => setNewRole({ ...newRole, hierarchyLevel: parseInt(e.target.value) })}
                >
                  {[60, 65, 70, 75, 80, 85, 90, 95, 100].map(level => (
                    <option key={level} value={level}>Level {level}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-medium">Inherits From</label>
                <select
                  className="form-select"
                  value={newRole.inheritsFrom}
                  onChange={(e) => setNewRole({ ...newRole, inheritsFrom: e.target.value })}
                >
                  <option value="">No Inheritance</option>
                  {roleHierarchy.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.name} (L{role.level}) {role.inheritsFrom ? `🔗 inherits from ${role.inheritsFrom}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-medium">Data Access Level</label>
                <select
                  className="form-select"
                  value={newRole.dataLevel}
                  onChange={(e) => setNewRole({ ...newRole, dataLevel: e.target.value })}
                >
                  {dataLevels.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Permissions Grid */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Granular Permissions</h6>
                <button
                  type="button"
                  className="btn btn-outline-info btn-sm"
                  onClick={() => setShowTemplateModal(true)}
                >
                  📄 Load Template
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th width="25%">Module & Features</th>
                      <th className="text-center" width="10%">All</th>
                      {permissionCategories.map(cat => (
                        <th key={cat.id} className="text-center" width="10%">
                          <div className="d-flex flex-column align-items-center">
                            <small>{cat.name}</small>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map(module => (
                      <tr key={module.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <strong>{module.name}</strong>
                          </div>
                          <div className="ms-4">
                            {module.features.map(feature => (
                              <div key={feature.id} className="d-flex align-items-center gap-2 small text-muted mb-1">
                                <span>{feature.name}</span>
                                <span className={`badge bg-${permissionCategories.find(c => c.id === feature.category)?.color || 'secondary'} ms-auto`}>
                                  {feature.category}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="text-center align-middle">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={permissionCategories.every(cat => rolePermissions[module.id]?.[cat.id])}
                            onChange={() => {
                              const allPerms = permissionCategories.map(c => c.id);
                              if (permissionCategories.every(cat => rolePermissions[module.id]?.[cat.id])) {
                                const newPerms = { ...rolePermissions };
                                delete newPerms[module.id];
                                setRolePermissions(newPerms);
                              } else {
                                const newPerms = {};
                                allPerms.forEach(perm => {
                                  newPerms[perm] = true;
                                });
                                setRolePermissions({
                                  ...rolePermissions,
                                  [module.id]: newPerms
                                });
                              }
                            }}
                          />
                        </td>
                        {permissionCategories.map(cat => (
                          <td key={cat.id} className="text-center align-middle">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={!!rolePermissions[module.id]?.[cat.id]}
                              onChange={() => {
                                setRolePermissions(prev => ({
                                  ...prev,
                                  [module.id]: {
                                    ...prev[module.id],
                                    [cat.id]: !prev[module.id]?.[cat.id]
                                  }
                                }));
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

const EditRoleModal = ({
  selectedRole, setSelectedRole, rolePermissions, setRolePermissions, modules, permissionCategories,
  roleHierarchy, dataLevels, handleUpdateRole, setShowEditModal, setShowTemplateModal
}) => (
  <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered modal-xl">
      <div className="modal-content border-0 shadow-lg">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Edit Role: {selectedRole.name}</h5>
          <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
        </div>

        <form onSubmit={handleUpdateRole}>
          <div className="modal-body pt-0">
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-medium">Role Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedRole.name}
                  onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-medium">Status</label>
                <select
                  className="form-select"
                  value={selectedRole.status}
                  onChange={(e) => setSelectedRole({ ...selectedRole, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-medium">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-medium">Hierarchy Level</label>
                <select
                  className="form-select"
                  value={selectedRole.hierarchyLevel}
                  onChange={(e) => setSelectedRole({ ...selectedRole, hierarchyLevel: parseInt(e.target.value) })}
                >
                  {[60, 65, 70, 75, 80, 85, 90, 95, 100].map(level => (
                    <option key={level} value={level}>Level {level}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-medium">Inherits From</label>
                <select
                  className="form-select"
                  value={selectedRole.inheritsFrom}
                  onChange={(e) => setSelectedRole({ ...selectedRole, inheritsFrom: e.target.value })}
                >
                  <option value="">No Inheritance</option>
                  {roleHierarchy
                    .filter(role => role.name !== selectedRole.name)
                    .map(role => (
                      <option key={role.id} value={role.name}>
                        {role.name} (L{role.level}) {role.inheritsFrom ? `🔗 inherits from ${role.inheritsFrom}` : ''}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-medium">Data Access Level</label>
                <select
                  className="form-select"
                  value={selectedRole.dataLevel}
                  onChange={(e) => setSelectedRole({ ...selectedRole, dataLevel: e.target.value })}
                >
                  {dataLevels.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Permissions Grid */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Permissions Configuration</h6>
                <button
                  type="button"
                  className="btn btn-outline-info btn-sm"
                  onClick={() => setShowTemplateModal(true)}
                >
                  📄 Load Template
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th width="25%">Module</th>
                      <th className="text-center" width="10%">All</th>
                      {permissionCategories.map(cat => (
                        <th key={cat.id} className="text-center" width="10%">
                          <div className="d-flex flex-column align-items-center">
                            <small>{cat.name}</small>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map(module => (
                      <tr key={module.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span>{module.name}</span>
                          </div>
                        </td>
                        <td className="text-center align-middle">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={permissionCategories.every(cat => rolePermissions[module.id]?.[cat.id])}
                            onChange={() => {
                              const allPerms = permissionCategories.map(c => c.id);
                              if (permissionCategories.every(cat => rolePermissions[module.id]?.[cat.id])) {
                                const newPerms = { ...rolePermissions };
                                delete newPerms[module.id];
                                setRolePermissions(newPerms);
                              } else {
                                const newPerms = {};
                                allPerms.forEach(perm => {
                                  newPerms[perm] = true;
                                });
                                setRolePermissions({
                                  ...rolePermissions,
                                  [module.id]: newPerms
                                });
                              }
                            }}
                          />
                        </td>
                        {permissionCategories.map(cat => (
                          <td key={cat.id} className="text-center align-middle">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={!!rolePermissions[module.id]?.[cat.id]}
                              onChange={() => {
                                setRolePermissions(prev => ({
                                  ...prev,
                                  [module.id]: {
                                    ...prev[module.id],
                                    [cat.id]: !prev[module.id]?.[cat.id]
                                  }
                                }));
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

const ViewRoleModal = ({
  selectedRole, modules, permissionCategories, dataLevels, formatDate,
  getStatusBadge, getTypeBadge, getDataLevelBadge, setShowViewModal,
  setShowTemporaryModal, setShowConflictModal
}) => {
  const summary = Object.entries(selectedRole.permissions || {}).reduce((acc, [moduleId, perms]) => {
    const activePerms = Object.values(perms).filter(v => v).length;
    if (activePerms > 0) {
      acc.moduleCount++;
      acc.permissionCount += activePerms;
    }
    return acc;
  }, { moduleCount: 0, permissionCount: 0 });

  return (
    <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">Role Details: {selectedRole.name}</h5>
            <button className="btn-close" onClick={() => setShowViewModal(false)}></button>
          </div>
          
          <div className="modal-body">
            <div className="row g-3 mb-4">
              <div className="col-12">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: selectedRole.color || '#6c757d',
                      color: 'white'
                    }}
                  >
                    🛡️
                  </div>
                  <div>
                    <h6 className="mb-1">{selectedRole.name}</h6>
                    <p className="text-muted mb-0">{selectedRole.description}</p>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block mb-1">Type</small>
                  {getTypeBadge(selectedRole.type)}
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block mb-1">Status</small>
                  {getStatusBadge(selectedRole.status)}
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block mb-1">Hierarchy</small>
                  <h6 className="mb-0">L{selectedRole.hierarchyLevel}</h6>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block mb-1">Data Level</small>
                  {getDataLevelBadge(selectedRole.dataLevel)}
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block mb-1">Users Assigned</small>
                  <h6 className="mb-0">{selectedRole.userCount} users</h6>
                  {selectedRole.temporaryAssignments?.length > 0 && (
                    <small className="text-muted">
                      +{selectedRole.temporaryAssignments.length} temporary
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="bg-light rounded p-3">
                  <small className="text-muted d-block mb-1">Permissions</small>
                  <h6 className="mb-0">
                    {summary.moduleCount} modules • {summary.permissionCount} permissions
                  </h6>
                </div>
              </div>

              {selectedRole.inheritsFrom && (
                <div className="col-12">
                  <div className="alert alert-info">
                    <div className="d-flex align-items-center gap-2">
                      🔗
                      <span>Inherits from: <strong>{selectedRole.inheritsFrom}</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {selectedRole.conflicts?.length > 0 && (
                <div className="col-12">
                  <div className="alert alert-warning">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        ⚠️
                        <span>Role has {selectedRole.conflicts.length} conflict(s)</span>
                      </div>
                      <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => setShowConflictModal(true)}
                      >
                        View Conflicts
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Temporary Assignments */}
              {selectedRole.temporaryAssignments?.length > 0 && (
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">Temporary Assignments</h6>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setShowTemporaryModal(true)}
                    >
                      Add Assignment
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Reason</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRole.temporaryAssignments.map(assignment => (
                          <tr key={assignment.id}>
                            <td>{assignment.userName}</td>
                            <td>{formatDate(assignment.startDate)}</td>
                            <td>{formatDate(assignment.endDate)}</td>
                            <td>{assignment.reason}</td>
                            <td>
                              {assignment.status === 'active' ? (
                                <span className="badge bg-success">Active</span>
                              ) : (
                                <span className="badge bg-secondary">Expired</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Permissions Detail */}
              <div className="col-12">
                <h6 className="fw-bold mb-3">Permissions Detail</h6>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Module</th>
                        {permissionCategories.map(cat => (
                          <th key={cat.id} className="text-center">
                            <small>{cat.name}</small>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map(module => (
                        selectedRole.permissions[module.id] && (
                          <tr key={module.id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <span>{module.name}</span>
                              </div>
                            </td>
                            {permissionCategories.map(cat => (
                              <td key={cat.id} className="text-center align-middle">
                                {selectedRole.permissions[module.id]?.[cat.id] ? (
                                  <span className="text-success">✓</span>
                                ) : (
                                  <span className="text-secondary opacity-50">✗</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer border-0">
            <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BulkAssignModal = ({
  selectedRole, sampleUsers, selectedUsers, setSelectedUsers, handleBulkAssign, setShowBulkAssignModal
}) => (
  <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content border-0 shadow-lg">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Bulk Assign Role: {selectedRole.name}</h5>
          <button className="btn-close" onClick={() => setShowBulkAssignModal(false)}></button>
        </div>
        
        <div className="modal-body pt-0">
          <div className="alert alert-info mb-4">
            Select users to assign the <strong>{selectedRole.name}</strong> role. This will replace their current roles.
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Select Users</h6>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setSelectedUsers([])}
                >
                  Clear All
                </button>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setSelectedUsers(sampleUsers.map(u => u.id))}
                >
                  Select All
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th width="50">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedUsers.length === sampleUsers.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(sampleUsers.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Current Role</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                            }
                          }}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge bg-secondary">{user.currentRole}</span>
                      </td>
                      <td>{user.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="alert alert-warning">
            <strong>Warning:</strong> This action will assign the {selectedRole.name} role to {selectedUsers.length} users.
            Make sure this is intended.
          </div>
        </div>

        <div className="modal-footer border-0">
          <button type="button" className="btn btn-outline-secondary" onClick={() => setShowBulkAssignModal(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleBulkAssign}
            disabled={selectedUsers.length === 0}
          >
            Assign to {selectedUsers.length} Users
          </button>
        </div>
      </div>
    </div>
  </div>
);

const TemplateModal = ({ permissionTemplates, modules, handleApplyTemplate, setShowTemplateModal }) => (
  <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content border-0 shadow-lg">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Permission Templates</h5>
          <button className="btn-close" onClick={() => setShowTemplateModal(false)}></button>
        </div>
        
        <div className="modal-body pt-0">
          <p className="text-muted mb-4">Select a template to quickly configure permissions for a new role</p>
          
          <div className="row g-3">
            {permissionTemplates.map(template => (
              <div key={template.id} className="col-12 col-md-6">
                <div className="card border h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="card-title mb-0">{template.name}</h6>
                      <span className="badge bg-info">Template</span>
                    </div>
                    <p className="card-text small text-muted mb-3">{template.description}</p>
                    
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Includes:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {template.modules.map(moduleId => {
                          const module = modules.find(m => m.id === moduleId);
                          return module ? (
                            <span key={moduleId} className="badge bg-light text-dark border">
                              {module.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">Permissions:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {Object.entries(template.permissions).map(([moduleId, perms]) => (
                          <span key={moduleId} className="badge bg-primary">
                            {moduleId}: {perms.length}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => handleApplyTemplate(template)}
                    >
                      Apply Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-footer border-0">
          <button className="btn btn-secondary w-100" onClick={() => setShowTemplateModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

const DeleteRoleModal = ({ selectedRole, handleDeleteRole, setShowDeleteModal }) => (
  <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content border-0 shadow-lg">
        <div className="modal-body text-center p-4">
          <div className="mb-3">
            <div className="w-50-px h-50-px bg-danger-subtle rounded-circle d-flex align-items-center justify-content-center mx-auto">
              ⚠️
            </div>
          </div>
          <h6 className="mb-2">Delete Role?</h6>
          <p className="text-muted mb-3 small">
            Are you sure you want to delete <strong>{selectedRole.name}</strong>? 
            {selectedRole.userCount > 0 && (
              <span className="d-block mt-1">
                <strong>{selectedRole.userCount} users</strong> will lose access to this role.
              </span>
            )}
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-outline-secondary w-100" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="btn btn-danger w-100" onClick={handleDeleteRole}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SessionNotificationModal = ({ activeSessions, setShowSessionModal }) => (
  <div className="modal show d-block fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content border-0 shadow-lg">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Permission Changes Applied</h5>
          <button className="btn-close" onClick={() => setShowSessionModal(false)}></button>
        </div>
        
        <div className="modal-body pt-0">
          <div className="alert alert-success mb-4">
            Permission changes have been saved and propagated to active sessions.
          </div>

          <h6 className="fw-bold mb-3">Affected Active Sessions</h6>
          <div className="list-group">
            {activeSessions.map(session => (
              <div key={session.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{session.userName}</h6>
                    <small className="text-muted">Role: {session.role}</small>
                  </div>
                  <div className="text-end">
                    <small className="text-muted d-block">{session.loginTime}</small>
                    <small className="text-muted">{session.ip}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-footer border-0">
          <button className="btn btn-secondary w-100" onClick={() => setShowSessionModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default RolesPermissions;