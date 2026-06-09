import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import RecruiterDashboardLayout from "../../../app/layouts/RecruiterDashboardLayout";

const EmployeeMasterData = () => {
  // Tab state for employee detail view
  const [activeDetailTab, setActiveDetailTab] = useState('personal');
  const [activeAddTab, setActiveAddTab] = useState('personal');

  // Helper function to create complete employee object with all modules
  const createEmployeeObject = (baseData) => {
    return {
      ...baseData,
      // Personal Information Module
      personalInfo: baseData.personalInfo || {
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        maritalStatus: '',
        nationality: '',
        languages: [],
        personalEmail: baseData.email || '',
        phonePrimary: baseData.phone || '',
        phoneSecondary: '',
        phoneEmergency: '',
        currentAddress: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          pincode: '',
          country: ''
        },
        permanentAddress: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          pincode: '',
          country: ''
        },
        emergencyContacts: [],
        familyMembers: [],
        nominees: [],
        profilePhoto: '',
        identification: {
          aadhaar: { number: '', verified: false },
          pan: { number: '', verified: false },
          passport: { number: '', expiryDate: '', verified: false },
          voterId: { number: '', verified: false }
        }
      },
      // Employment Information Module
      employmentInfo: baseData.employmentInfo || {
        employeeId: baseData.employeeId || '',
        dateOfJoining: baseData.joinDate || '',
        confirmationDate: '',
        probationPeriod: 6, // months
        employmentType: baseData.employmentType || 'Permanent',
        employmentStatus: baseData.status || 'Active',
        department: baseData.department || '',
        subDepartment: '',
        costCenter: '',
        designation: baseData.designation || '',
        grade: '',
        level: '',
        location: baseData.location || '',
        workplaceType: 'Office', // Office, Remote, Hybrid
        workEmail: baseData.email || '',
        extensionNumber: '',
        deskLocation: '',
        employeeCategory: 'Staff', // Staff, Management, Executive
        noticePeriod: 30, // days
        reportingManager: {
          direct: '',
          functional: ''
        },
        hrBusinessPartner: ''
      },
      // Job History
      jobHistory: baseData.jobHistory || [],
      // Salary & Compensation
      salaryInfo: baseData.salaryInfo || {
        currentCTC: baseData.salary || 0,
        ctcBreakdown: {
          basic: 0,
          hra: 0,
          specialAllowance: 0,
          transportAllowance: 0,
          medicalAllowance: 0,
          otherAllowances: 0,
          providentFund: 0,
          gratuity: 0,
          otherDeductions: 0
        },
        salaryStructure: '',
        bankAccounts: {
          primary: {
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: '',
            accountType: 'Savings'
          },
          secondary: {
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: '',
            accountType: 'Savings'
          }
        },
        paymentMode: 'Bank Transfer', // Bank Transfer, Cheque, Cash
        pfAccountNumber: '',
        uan: '',
        esiNumber: '',
        esiMedicalNominee: '',
        taxDeclaration: {
          regime: 'New', // Old, New
          declared: false
        },
        variablePay: {
          eligible: false,
          percentage: 0
        },
        bonusEligibility: {
          eligible: false,
          amount: 0
        },
        salaryRevisionHistory: []
      },
      // Statutory & Compliance
      statutoryInfo: baseData.statutoryInfo || {
        pan: {
          number: '',
          verified: false,
          verifiedDate: ''
        },
        aadhaar: {
          number: '',
          verified: false,
          verifiedDate: ''
        },
        pfMembership: {
          enrolled: false,
          accountNumber: '',
          uan: '',
          enrollmentDate: ''
        },
        esiRegistration: {
          enrolled: false,
          number: '',
          enrollmentDate: ''
        },
        professionalTax: {
          applicable: false,
          state: '',
          ptNumber: ''
        },
        labourWelfareFund: {
          enrolled: false,
          enrollmentDate: ''
        },
        gratuity: {
          eligible: false,
          eligibilityDate: ''
        },
        bonusAct: {
          applicable: false
        },
        shopsAndEstablishment: {
          registered: false,
          registrationNumber: '',
          registrationDate: ''
        }
      }
    };
  };

  const [employees, setEmployees] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 6;

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => {
      const status = (emp.employmentInfo || {}).employmentStatus || emp.status;
      return status === 'Active';
    }).length;
    const departments = [...new Set(employees.map(emp => {
      return (emp.employmentInfo || {}).department || emp.department || '';
    }).filter(d => d))];
    const avgSalary = employees.reduce((sum, emp) => {
      const salary = (emp.salaryInfo || {}).currentCTC || emp.salary || 0;
      return sum + salary;
    }, 0) / totalEmployees;
    const recentJoin = employees
      .sort((a, b) => {
        const dateA = (a.employmentInfo || {}).dateOfJoining || a.joinDate || '';
        const dateB = (b.employmentInfo || {}).dateOfJoining || b.joinDate || '';
        return new Date(dateB) - new Date(dateA);
      })[0]?.employmentInfo?.dateOfJoining || employees[0]?.joinDate || 'N/A';

    return {
      totalEmployees: totalEmployees,
      activeEmployees: activeEmployees,
      departments: departments.length,
      avgSalary: avgSalary,
      recentJoin: recentJoin
    };
  }, [employees]);

  // Filter and search
  const filteredData = useMemo(() => {
    return employees.filter(emp => {
      const empInfo = emp.employmentInfo || {};
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (empInfo.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'All' || (empInfo.department || emp.department || '') === departmentFilter;
      const matchesStatus = statusFilter === 'All' || (empInfo.employmentStatus || emp.status || '') === statusFilter;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aVal, bVal;
      
      // Handle different field mappings for new structure
      if (sortConfig.key === 'salary') {
        aVal = (a.salaryInfo || {}).currentCTC || a.salary || 0;
        bVal = (b.salaryInfo || {}).currentCTC || b.salary || 0;
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (sortConfig.key === 'joinDate') {
        aVal = (a.employmentInfo || {}).dateOfJoining || a.joinDate || '';
        bVal = (b.employmentInfo || {}).dateOfJoining || b.joinDate || '';
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (sortConfig.key === 'department') {
        aVal = (a.employmentInfo || {}).department || a.department || '';
        bVal = (b.employmentInfo || {}).department || b.department || '';
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      } else if (sortConfig.key === 'status') {
        aVal = (a.employmentInfo || {}).employmentStatus || a.status || '';
        bVal = (b.employmentInfo || {}).employmentStatus || b.status || '';
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      } else {
        aVal = a[sortConfig.key] || '';
        bVal = b[sortConfig.key] || '';
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique departments for filter
  const departments = ['All', ...new Set(employees.map(emp => {
    const empInfo = emp.employmentInfo || {};
    return empInfo.department || emp.department || '';
  }).filter(d => d))];
  const statuses = ['All', 'Active', 'On Leave', 'Inactive', 'Resigned', 'Terminated', 'On-Hold'];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-success-subtle text-success',
      'On Leave': 'bg-warning-subtle text-warning',
      'Inactive': 'bg-danger-subtle text-danger',
      'Resigned': 'bg-secondary-subtle text-secondary',
      'Terminated': 'bg-danger-subtle text-danger',
      'On-Hold': 'bg-info-subtle text-info'
    };

    const icons = {
      'Active': 'heroicons:check-circle',
      'On Leave': 'heroicons:clock',
      'Inactive': 'heroicons:x-circle',
      'Resigned': 'heroicons:arrow-right-on-rectangle',
      'Terminated': 'heroicons:x-mark',
      'On-Hold': 'heroicons:pause-circle'
    };

    return (
      <span className={`badge d-flex align-items-center ${styles[status] || 'bg-secondary-subtle text-secondary'}`}>
        <Icon icon={icons[status] || 'heroicons:question-mark-circle'} className="me-1" />
        {status}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type) => {
    const styles = {
      'Full-time': 'bg-primary-subtle text-primary',
      'Contract': 'bg-info-subtle text-info',
      'Part-time': 'bg-secondary-subtle text-secondary',
      'Intern': 'bg-light text-dark'
    };

    return (
      <span className={`badge ${styles[type]}`}>
        {type}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
      if (selectedEmployee?.id === id) {
        setShowModal(false);
      }
    }
  };

  const handleAddEmployee = () => {
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const employeeId = `EMP${String(newId).padStart(3, '0')}`;
    const joinDate = newEmployee.employmentInfo.dateOfJoining || new Date().toISOString().split('T')[0];
    
    const newEmp = createEmployeeObject({
      id: newId,
      employeeId: employeeId,
      name: newEmployee.name,
      email: newEmployee.email || newEmployee.employmentInfo.workEmail,
      phone: newEmployee.phone || newEmployee.personalInfo.phonePrimary,
      salary: parseInt(newEmployee.salaryInfo.currentCTC || newEmployee.salary) || 0,
      status: newEmployee.employmentInfo.employmentStatus || 'Active',
      joinDate: joinDate,
      department: newEmployee.employmentInfo.department || newEmployee.department,
      designation: newEmployee.employmentInfo.designation || newEmployee.designation,
      location: newEmployee.employmentInfo.location || newEmployee.location,
      employmentType: newEmployee.employmentInfo.employmentType || newEmployee.employmentType,
      personalInfo: {
        ...newEmployee.personalInfo,
        personalEmail: newEmployee.personalInfo.personalEmail || newEmployee.email,
        phonePrimary: newEmployee.personalInfo.phonePrimary || newEmployee.phone
      },
      employmentInfo: {
        ...newEmployee.employmentInfo,
        employeeId: employeeId,
        dateOfJoining: joinDate,
        workEmail: newEmployee.employmentInfo.workEmail || newEmployee.email
      },
      salaryInfo: {
        ...newEmployee.salaryInfo,
        currentCTC: parseInt(newEmployee.salaryInfo.currentCTC || newEmployee.salary) || 0
      },
      statutoryInfo: {
        ...newEmployee.statutoryInfo,
        pan: {
          ...newEmployee.statutoryInfo.pan,
          number: newEmployee.personalInfo.identification.pan.number || newEmployee.statutoryInfo.pan.number
        },
        aadhaar: {
          ...newEmployee.statutoryInfo.aadhaar,
          number: newEmployee.personalInfo.identification.aadhaar.number || newEmployee.statutoryInfo.aadhaar.number
        }
      }
    });
    
    setEmployees([...employees, newEmp]);
    setShowAddModal(false);
    setActiveAddTab('personal');
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      department: 'Engineering',
      designation: '',
      location: 'New York',
      employmentType: 'Full-time',
      salary: '',
      personalInfo: {
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        maritalStatus: '',
        nationality: '',
        languages: [],
        personalEmail: '',
        phonePrimary: '',
        phoneSecondary: '',
        phoneEmergency: '',
        profilePhoto: '',
        currentAddress: { line1: '', line2: '', city: '', state: '', pincode: '', country: '' },
        permanentAddress: { line1: '', line2: '', city: '', state: '', pincode: '', country: '' },
        emergencyContacts: [],
        familyMembers: [],
        nominees: [],
        identification: { 
          aadhaar: { number: '', document: '' }, 
          pan: { number: '', document: '' }, 
          passport: { number: '', expiryDate: '' }, 
          voterId: { number: '' } 
        }
      },
      employmentInfo: {
        dateOfJoining: new Date().toISOString().split('T')[0],
        confirmationDate: '',
        probationPeriod: 6,
        employmentType: 'Permanent',
        employmentStatus: 'Active',
        department: 'Engineering',
        subDepartment: '',
        costCenter: '',
        designation: '',
        grade: '',
        level: '',
        location: 'New York',
        workplaceType: 'Office',
        workEmail: '',
        extensionNumber: '',
        deskLocation: '',
        employeeCategory: 'Staff',
        noticePeriod: 30,
        reportingManager: { direct: '', functional: '' },
        hrBusinessPartner: ''
      },
      salaryInfo: {
        currentCTC: '',
        ctcBreakdown: { basic: '', hra: '', specialAllowance: '', transportAllowance: '', medicalAllowance: '', otherAllowances: '', providentFund: '', gratuity: '', otherDeductions: '' },
        salaryStructure: '',
        bankAccounts: { primary: { accountNumber: '', ifscCode: '', bankName: '', branch: '', accountType: 'Savings' } },
        paymentMode: 'Bank Transfer',
        pfAccountNumber: '',
        uan: '',
        esiNumber: '',
        taxDeclaration: { regime: 'New', declared: false },
        variablePay: { eligible: false, percentage: 0 }
      },
      statutoryInfo: {
        pan: { number: '', verified: false },
        aadhaar: { number: '', verified: false },
        pfMembership: { enrolled: false, accountNumber: '', uan: '', enrollmentDate: '' },
        esiRegistration: { enrolled: false, number: '', enrollmentDate: '' },
        professionalTax: { applicable: false, state: '', ptNumber: '' },
        labourWelfareFund: { enrolled: false },
        gratuity: { eligible: false },
        bonusAct: { applicable: false },
        shopsAndEstablishment: { registered: false, registrationNumber: '', registrationDate: '' }
      }
    });
  };

  const exportToCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Phone', 'Department', 'Designation', 'Location', 'Employment Type', 'Status', 'Salary', 'Join Date'];
    const csvData = [headers];
    
    sortedData.forEach(record => {
      const empInfo = record.employmentInfo || {};
      const salaryInfo = record.salaryInfo || {};
      csvData.push([
        empInfo.employeeId || record.employeeId,
        record.name,
        empInfo.workEmail || record.email,
        record.personalInfo?.phonePrimary || record.phone,
        empInfo.department || record.department,
        empInfo.designation || record.designation,
        empInfo.location || record.location,
        empInfo.employmentType || record.employmentType,
        empInfo.employmentStatus || record.status,
        formatCurrency(salaryInfo.currentCTC || record.salary || 0),
        formatDate(empInfo.dateOfJoining || record.joinDate)
      ]);
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee_master_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    setCurrentPage(1);
    setSearchTerm('');
    setDepartmentFilter('All');
    setStatusFilter('All');
    setSortConfig({ key: 'name', direction: 'asc' });
    alert('Employee data refreshed successfully!');
  };

  // Sidebar content
  const sidebarContent = (
    <nav className="space-y-1 p-3">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Employee Master
      </div>
      
      <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
        <Icon icon="heroicons:users" className="mr-3 h-5 w-5" />
        All Employees
      </button>
      <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
        <Icon icon="heroicons:user-plus" className="mr-3 h-5 w-5" />
        Add Employee
      </button>
      <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
        <Icon icon="heroicons:document-chart-bar" className="mr-3 h-5 w-5" />
        Reports
      </button>
      
      <div className="pt-4 border-t border-gray-200 mt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Stats
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Employees:</span>
            <span className="font-semibold">{kpis.totalEmployees}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Active:</span>
            <span className="font-semibold text-green-600">{kpis.activeEmployees}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Departments:</span>
            <span className="font-semibold">{kpis.departments}</span>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    
      <div className="container-fluid">
        {/* Header */}
        <div className="mb-4">
          <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
            <Icon icon="heroicons:user-group" />
            Employee Master Data
          </h5>
          <p className="text-muted">
            Manage all employee information, profiles, and employment details in one place.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="w-60-px h-60-px bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon icon="heroicons:users" className="text-primary text-2xl" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-bold mb-1">Total Employees</h6>
                  <div className="text-muted fs-4">{kpis.totalEmployees}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="w-60-px h-60-px bg-success-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon icon="heroicons:check-circle" className="text-success text-2xl" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-bold mb-1">Active Employees</h6>
                  <div className="text-muted fs-4">{kpis.activeEmployees}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="w-60-px h-60-px bg-info-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon icon="heroicons:building-office" className="text-info text-2xl" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-bold mb-1">Departments</h6>
                  <div className="text-muted fs-4">{kpis.departments}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="w-60-px h-60-px bg-warning-subtle rounded-circle d-flex align-items-center justify-content-center">
                    <Icon icon="heroicons:currency-dollar" className="text-warning text-2xl" />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-bold mb-1">Avg. Salary</h6>
                  <div className="text-muted fs-4">{formatCurrency(kpis.avgSalary)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card border shadow-none mb-4">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-3 align-items-center">
              {/* Search */}
              <div className="position-relative flex-fill" style={{ minWidth: '300px' }}>
                <Icon icon="heroicons:magnifying-glass" className="position-absolute top-50 translate-middle-y text-muted ms-3" />
                <input
                  type="text"
                  placeholder="Search by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control ps-5"
                />
              </div>

              {/* Department Filter */}
              <div style={{ minWidth: '150px' }}>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="form-select"
                >
                  <option value="All">All Departments</option>
                  {departments.slice(1).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div style={{ minWidth: '150px' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-success d-flex align-items-center"
                >
                  <Icon icon="heroicons:user-plus" className="me-2" />
                  Add Employee
                </button>
                <button
                  onClick={exportToCSV}
                  className="btn btn-primary d-flex align-items-center"
                >
                  <Icon icon="heroicons:document-arrow-down" className="me-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="card border shadow-none">
          <div className="card-header bg-transparent border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Employee Records</h5>
              <div className="d-flex gap-2">
                <button 
                  onClick={refreshData}
                  className="btn btn-outline-primary"
                >
                  <Icon icon="heroicons:arrow-path" className="me-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th 
                      className="border-0 px-4 py-3 text-uppercase fw-bold text-dark cursor-pointer"
                      onClick={() => handleSort('name')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        Employee
                        <Icon 
                          icon={`heroicons:chevron-${sortConfig.key === 'name' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} 
                          className="small" 
                        />
                      </div>
                    </th>
                    <th 
                      className="border-0 px-3 py-3 text-uppercase fw-bold text-dark cursor-pointer"
                      onClick={() => handleSort('department')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        Department
                        <Icon 
                          icon={`heroicons:chevron-${sortConfig.key === 'department' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} 
                          className="small" 
                        />
                      </div>
                    </th>
                    <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Contact</th>
                    <th 
                      className="border-0 px-3 py-3 text-uppercase fw-bold text-dark cursor-pointer"
                      onClick={() => handleSort('salary')}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        Salary
                        <Icon 
                          icon={`heroicons:chevron-${sortConfig.key === 'salary' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} 
                          className="small" 
                        />
                      </div>
                    </th>
                    <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Status</th>
                    <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((employee) => (
                    <tr key={employee.id} className="border-bottom">
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="w-40-px h-40-px bg-light rounded-circle d-flex align-items-center justify-content-center me-3">
                            <Icon icon="heroicons:user" className="text-muted" />
                          </div>
                          <div>
                            <div className="fw-medium text-dark">{employee.name}</div>
                            <div className="small text-muted">
                              {(employee.employmentInfo || {}).employeeId || employee.employeeId} • {(employee.employmentInfo || {}).designation || employee.designation}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-muted">{(employee.employmentInfo || {}).department || employee.department}</div>
                        <div className="small text-muted">{(employee.employmentInfo || {}).location || employee.location}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-muted">{employee.email || (employee.employmentInfo || {}).workEmail}</div>
                        <div className="small text-muted">{employee.phone || (employee.personalInfo || {}).phonePrimary}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="fw-semibold text-dark">{formatCurrency((employee.salaryInfo || {}).currentCTC || employee.salary || 0)}</div>
                        <div className="small text-muted">
                          {getEmploymentTypeBadge((employee.employmentInfo || {}).employmentType || employee.employmentType)}
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{width:"120px"}}>
                        {getStatusBadge((employee.employmentInfo || {}).employmentStatus || employee.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleViewDetails(employee)}
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          >
                            <Icon icon="heroicons:eye" />
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          >
                            <Icon icon="heroicons:trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedData.length === 0 && (
              <div className="text-center py-5 text-muted">
                <Icon icon="heroicons:user-group" className="text-4xl mb-3" />
                <h5>No employees found</h5>
                <p>No records found matching your search criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between">
                <div className="small text-muted">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} employees
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`btn btn-sm ${
                        currentPage === i + 1
                          ? 'btn-primary'
                          : 'btn-outline-secondary'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Employee Details Modal - Comprehensive Tabbed View */}
        {showModal && selectedEmployee && (
          <div 
            className="modal show d-block" 
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '15px',
              overflow: 'auto'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                setActiveDetailTab('personal');
              }
            }}
          >
            <div 
              className="modal-dialog modal-xl" 
              style={{ 
                maxWidth: '1400px', 
                width: '90%', 
                margin: 'auto',
                maxHeight: '90vh',
                position: 'relative',
                transform: 'none'
              }}
            >
              <div className="modal-content" style={{ maxHeight: '90vh',width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <div className="modal-header bg-primary text-white">
                  <div className="d-flex align-items-center gap-3">
                    {selectedEmployee.personalInfo?.profilePhoto ? (
                      <img 
                        src={selectedEmployee.personalInfo.profilePhoto} 
                        alt={selectedEmployee.name}
                        className="rounded-circle"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                        <Icon icon="heroicons:user" className="fs-3" />
                      </div>
                    )}
                    <div>
                      <h5 className="modal-title mb-0 text-white">
                        {selectedEmployee.name}
                      </h5>
                      <small className="text-white-50">
                        {(selectedEmployee.employmentInfo || {}).employeeId || selectedEmployee.employeeId} • {(selectedEmployee.employmentInfo || {}).designation || selectedEmployee.designation}
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => {
                      setShowModal(false);
                      setActiveDetailTab('personal');
                    }}
                  ></button>
                </div>
                <div className="modal-body p-0" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Tab Navigation */}
                  <ul className="nav nav-tabs border-bottom px-3 pt-3" style={{ flexShrink: 0 }}>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeDetailTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveDetailTab('personal')}
                      >
                        <Icon icon="heroicons:user-circle" className="me-2" />
                        Personal Info
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeDetailTab === 'employment' ? 'active' : ''}`}
                        onClick={() => setActiveDetailTab('employment')}
                      >
                        <Icon icon="heroicons:briefcase" className="me-2" />
                        Employment
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeDetailTab === 'jobHistory' ? 'active' : ''}`}
                        onClick={() => setActiveDetailTab('jobHistory')}
                      >
                        <Icon icon="heroicons:clock" className="me-2" />
                        Job History
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeDetailTab === 'salary' ? 'active' : ''}`}
                        onClick={() => setActiveDetailTab('salary')}
                      >
                        <Icon icon="heroicons:currency-dollar" className="me-2" />
                        Salary & Compensation
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeDetailTab === 'statutory' ? 'active' : ''}`}
                        onClick={() => setActiveDetailTab('statutory')}
                      >
                        <Icon icon="heroicons:document-check" className="me-2" />
                        Statutory & Compliance
                      </button>
                    </li>
                  </ul>

                  {/* Tab Content */}
                  <div className="p-4" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
                    {/* Personal Information Tab */}
                    {activeDetailTab === 'personal' && (
                      <PersonalInfoTab employee={selectedEmployee} formatDate={formatDate} />
                    )}

                    {/* Employment Information Tab */}
                    {activeDetailTab === 'employment' && (
                      <EmploymentInfoTab 
                        employee={selectedEmployee} 
                        formatDate={formatDate}
                        getStatusBadge={getStatusBadge}
                        getEmploymentTypeBadge={getEmploymentTypeBadge}
                      />
                    )}

                    {/* Job History Tab */}
                    {activeDetailTab === 'jobHistory' && (
                      <JobHistoryTab employee={selectedEmployee} formatDate={formatDate} formatCurrency={formatCurrency} />
                    )}

                    {/* Salary & Compensation Tab */}
                    {activeDetailTab === 'salary' && (
                      <SalaryInfoTab employee={selectedEmployee} formatCurrency={formatCurrency} formatDate={formatDate} />
                    )}

                    {/* Statutory & Compliance Tab */}
                    {activeDetailTab === 'statutory' && (
                      <StatutoryInfoTab employee={selectedEmployee} formatDate={formatDate} />
                    )}
                  </div>
                </div>
                <div className="modal-footer" style={{ flexShrink: 0 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setActiveDetailTab('personal');
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      // Edit functionality would go here
                      alert('Edit functionality to be implemented');
                    }}
                  >
                    <Icon icon="heroicons:pencil-square" className="me-2" />
                    Edit Employee
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                  >
                    <Icon icon="heroicons:trash" className="me-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Employee Modal - Comprehensive Tabbed Form */}
        {showAddModal && (
          <div 
            className="modal show d-block" 
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '15px',
              overflow: 'auto'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddModal(false);
                setActiveAddTab('personal');
              }
            }}
          >
            <div 
              className="modal-dialog modal-xl" 
              style={{ 
                maxWidth: '1600px', 
                width: '95%', 
                margin: '0 auto',
                maxHeight: '90vh',
                position: 'relative',
                transform: 'none'
              }}
            >
              <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title d-flex align-items-center gap-2 text-white">
                    <Icon icon="heroicons:user-plus" />
                    Add New Employee
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => {
                      setShowAddModal(false);
                      setActiveAddTab('personal');
                    }}
                  ></button>
                </div>
                <div className="modal-body p-0" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Tab Navigation */}
                  <ul className="nav nav-tabs border-bottom px-3 pt-3" style={{ flexShrink: 0 }}>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeAddTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveAddTab('personal')}
                      >
                        <Icon icon="heroicons:user-circle" className="me-2" />
                        Personal Info
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeAddTab === 'employment' ? 'active' : ''}`}
                        onClick={() => setActiveAddTab('employment')}
                      >
                        <Icon icon="heroicons:briefcase" className="me-2" />
                        Employment
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeAddTab === 'salary' ? 'active' : ''}`}
                        onClick={() => setActiveAddTab('salary')}
                      >
                        <Icon icon="heroicons:currency-dollar" className="me-2" />
                        Salary
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeAddTab === 'statutory' ? 'active' : ''}`}
                        onClick={() => setActiveAddTab('statutory')}
                      >
                        <Icon icon="heroicons:document-check" className="me-2" />
                        Statutory
                      </button>
                    </li>
                  </ul>

                  {/* Tab Content */}
                  <div className="p-4" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
                    {/* Personal Information Tab */}
                    {activeAddTab === 'personal' && (
                      <div className="row g-3">
                        {/* Profile Photo Upload */}
                        <div className="col-12 mb-3">
                          <label className="form-label">Profile Photo</label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="position-relative">
                              {newEmployee.personalInfo.profilePhoto ? (
                                <img 
                                  src={newEmployee.personalInfo.profilePhoto} 
                                  alt="Profile" 
                                  className="rounded-circle border"
                                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                              ) : (
                                <div className="rounded-circle border d-flex align-items-center justify-content-center bg-light" style={{ width: '100px', height: '100px' }}>
                                  <Icon icon="heroicons:user" className="fs-1 text-muted" />
                                </div>
                              )}
                            </div>
                            <div>
                              <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setNewEmployee({
                                        ...newEmployee,
                                        personalInfo: {
                                          ...newEmployee.personalInfo,
                                          profilePhoto: reader.result
                                        }
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <small className="text-muted">Upload employee profile photo (JPG, PNG, max 5MB)</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Full Name <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.name}
                            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Date of Birth</label>
                          <input
                            type="date"
                            className="form-control"
                            value={newEmployee.personalInfo.dateOfBirth}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {...newEmployee.personalInfo, dateOfBirth: e.target.value}
                            })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Gender</label>
                          <select
                            className="form-select"
                            value={newEmployee.personalInfo.gender}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {...newEmployee.personalInfo, gender: e.target.value}
                            })}
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Blood Group</label>
                          <select
                            className="form-select"
                            value={newEmployee.personalInfo.bloodGroup}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {...newEmployee.personalInfo, bloodGroup: e.target.value}
                            })}
                          >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Marital Status</label>
                          <select
                            className="form-select"
                            value={newEmployee.personalInfo.maritalStatus}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {...newEmployee.personalInfo, maritalStatus: e.target.value}
                            })}
                          >
                            <option value="">Select</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Nationality</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.nationality}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {...newEmployee.personalInfo, nationality: e.target.value}
                            })}
                            placeholder="Enter nationality"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Languages</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.languages.join(', ')}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                languages: e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang)
                              }
                            })}
                            placeholder="Enter languages (comma separated, e.g., English, Hindi, Spanish)"
                          />
                          <small className="text-muted">Separate multiple languages with commas</small>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Personal Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={newEmployee.personalInfo.personalEmail}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {...newEmployee.personalInfo, personalEmail: e.target.value}
                            })}
                            placeholder="personal@email.com"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Primary Phone <span className="text-danger">*</span></label>
                          <input
                            type="tel"
                            className="form-control"
                            value={newEmployee.phone || newEmployee.personalInfo.phonePrimary}
                            onChange={(e) => {
                              setNewEmployee({
                                ...newEmployee,
                                phone: e.target.value,
                                personalInfo: {...newEmployee.personalInfo, phonePrimary: e.target.value}
                              });
                            }}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Secondary Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={newEmployee.personalInfo.phoneSecondary}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {...newEmployee.personalInfo, phoneSecondary: e.target.value}
                            })}
                            placeholder="+1 (555) 123-4568"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">PAN Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.identification.pan.number}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                identification: {
                                  ...newEmployee.personalInfo.identification,
                                  pan: {...newEmployee.personalInfo.identification.pan, number: e.target.value}
                                }
                              }
                            })}
                            placeholder="ABCDE1234F"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Aadhaar Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.identification.aadhaar.number}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                identification: {
                                  ...newEmployee.personalInfo.identification,
                                  aadhaar: {...newEmployee.personalInfo.identification.aadhaar, number: e.target.value}
                                }
                              }
                            })}
                            placeholder="1234 5678 9012"
                          />
                        </div>

                        {/* Current Address Section */}
                        <div className="col-12 mt-4">
                          <h6 className="fw-bold mb-3 border-bottom pb-2">
                            <Icon icon="heroicons:map-pin" className="me-2" />
                            Current Address
                          </h6>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Address Line 1</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.currentAddress.line1}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                currentAddress: {...newEmployee.personalInfo.currentAddress, line1: e.target.value}
                              }
                            })}
                            placeholder="Enter address line 1"
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Address Line 2</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.currentAddress.line2}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                currentAddress: {...newEmployee.personalInfo.currentAddress, line2: e.target.value}
                              }
                            })}
                            placeholder="Enter address line 2"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.currentAddress.city}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                currentAddress: {...newEmployee.personalInfo.currentAddress, city: e.target.value}
                              }
                            })}
                            placeholder="Enter city"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">State</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.currentAddress.state}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                currentAddress: {...newEmployee.personalInfo.currentAddress, state: e.target.value}
                              }
                            })}
                            placeholder="Enter state"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Pincode</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.currentAddress.pincode}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                currentAddress: {...newEmployee.personalInfo.currentAddress, pincode: e.target.value}
                              }
                            })}
                            placeholder="Enter pincode"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Country</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.currentAddress.country}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                currentAddress: {...newEmployee.personalInfo.currentAddress, country: e.target.value}
                              }
                            })}
                            placeholder="Enter country"
                          />
                        </div>

                        {/* Permanent Address Section */}
                        <div className="col-12 mt-4">
                          <h6 className="fw-bold mb-3 border-bottom pb-2">
                            <Icon icon="heroicons:home" className="me-2" />
                            Permanent Address
                          </h6>
                        </div>
                        <div className="col-md-12">
                          <div className="form-check mb-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="sameAsCurrent"
                              checked={JSON.stringify(newEmployee.personalInfo.currentAddress) === JSON.stringify(newEmployee.personalInfo.permanentAddress) && 
                                       newEmployee.personalInfo.currentAddress.line1 !== ''}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewEmployee({
                                    ...newEmployee,
                                    personalInfo: {
                                      ...newEmployee.personalInfo,
                                      permanentAddress: {...newEmployee.personalInfo.currentAddress}
                                    }
                                  });
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor="sameAsCurrent">
                              Same as Current Address
                            </label>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Address Line 1</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.permanentAddress.line1}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                permanentAddress: {...newEmployee.personalInfo.permanentAddress, line1: e.target.value}
                              }
                            })}
                            placeholder="Enter address line 1"
                          />
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Address Line 2</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.permanentAddress.line2}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                permanentAddress: {...newEmployee.personalInfo.permanentAddress, line2: e.target.value}
                              }
                            })}
                            placeholder="Enter address line 2"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.permanentAddress.city}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                permanentAddress: {...newEmployee.personalInfo.permanentAddress, city: e.target.value}
                              }
                            })}
                            placeholder="Enter city"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">State</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.permanentAddress.state}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                permanentAddress: {...newEmployee.personalInfo.permanentAddress, state: e.target.value}
                              }
                            })}
                            placeholder="Enter state"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Pincode</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.permanentAddress.pincode}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                permanentAddress: {...newEmployee.personalInfo.permanentAddress, pincode: e.target.value}
                              }
                            })}
                            placeholder="Enter pincode"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Country</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.personalInfo.permanentAddress.country}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                permanentAddress: {...newEmployee.personalInfo.permanentAddress, country: e.target.value}
                              }
                            })}
                            placeholder="Enter country"
                          />
                        </div>

                        {/* Document Upload Section */}
                        <div className="col-12 mt-4">
                          <h6 className="fw-bold mb-3 border-bottom pb-2">
                            <Icon icon="heroicons:document-text" className="me-2" />
                            Document Proof Upload
                          </h6>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">PAN Card Photo</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setNewEmployee({
                                    ...newEmployee,
                                    personalInfo: {
                                      ...newEmployee.personalInfo,
                                      identification: {
                                        ...newEmployee.personalInfo.identification,
                                        pan: {
                                          ...newEmployee.personalInfo.identification.pan,
                                          document: reader.result
                                        }
                                      }
                                    }
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <small className="text-muted">Upload PAN card photo (JPG, PNG, PDF, max 5MB)</small>
                          {newEmployee.personalInfo.identification.pan.document && (
                            <div className="mt-2">
                              <a href={newEmployee.personalInfo.identification.pan.document} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                <Icon icon="heroicons:eye" className="me-1" />
                                View Uploaded
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Aadhaar Card Photo</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setNewEmployee({
                                    ...newEmployee,
                                    personalInfo: {
                                      ...newEmployee.personalInfo,
                                      identification: {
                                        ...newEmployee.personalInfo.identification,
                                        aadhaar: {
                                          ...newEmployee.personalInfo.identification.aadhaar,
                                          document: reader.result
                                        }
                                      }
                                    }
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <small className="text-muted">Upload Aadhaar card photo (JPG, PNG, PDF, max 5MB)</small>
                          {newEmployee.personalInfo.identification.aadhaar.document && (
                            <div className="mt-2">
                              <a href={newEmployee.personalInfo.identification.aadhaar.document} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                <Icon icon="heroicons:eye" className="me-1" />
                                View Uploaded
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Employment Information Tab */}
                    {activeAddTab === 'employment' && (
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Date of Joining <span className="text-danger">*</span></label>
                          <input
                            type="date"
                            className="form-control"
                            value={newEmployee.employmentInfo.dateOfJoining}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              employmentInfo: {...newEmployee.employmentInfo, dateOfJoining: e.target.value}
                            })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Probation Period (months)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={newEmployee.employmentInfo.probationPeriod}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              employmentInfo: {...newEmployee.employmentInfo, probationPeriod: parseInt(e.target.value) || 0}
                            })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Employment Type <span className="text-danger">*</span></label>
                          <select
                            className="form-select"
                            value={newEmployee.employmentInfo.employmentType}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              employmentInfo: {...newEmployee.employmentInfo, employmentType: e.target.value},
                              employmentType: e.target.value === 'Permanent' ? 'Full-time' : e.target.value
                            })}
                          >
                            <option value="Permanent">Permanent</option>
                            <option value="Contract">Contract</option>
                            <option value="Intern">Intern</option>
                            <option value="Consultant">Consultant</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Employment Status</label>
                          <select
                            className="form-select"
                            value={newEmployee.employmentInfo.employmentStatus}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              employmentInfo: {...newEmployee.employmentInfo, employmentStatus: e.target.value}
                            })}
                          >
                            <option value="Active">Active</option>
                            <option value="On-Hold">On-Hold</option>
                            <option value="On Leave">On Leave</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Department <span className="text-danger">*</span></label>
                          <select
                            className="form-select"
                            value={newEmployee.employmentInfo.department || newEmployee.department}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              department: e.target.value,
                              employmentInfo: {...newEmployee.employmentInfo, department: e.target.value}
                            })}
                          >
                            <option value="Engineering">Engineering</option>
                            <option value="Marketing">Marketing</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Sales">Sales</option>
                            <option value="Operations">Operations</option>
                            <option value="IT">IT</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Sub-Department</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.employmentInfo.subDepartment}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              employmentInfo: {...newEmployee.employmentInfo, subDepartment: e.target.value}
                            })}
                            placeholder="Enter sub-department"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Designation <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.employmentInfo.designation || newEmployee.designation}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              designation: e.target.value,
                              employmentInfo: {...newEmployee.employmentInfo, designation: e.target.value}
                            })}
                            placeholder="Enter designation"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Location <span className="text-danger">*</span></label>
                          <select
                            className="form-select"
                            value={newEmployee.employmentInfo.location || newEmployee.location}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              location: e.target.value,
                              employmentInfo: {...newEmployee.employmentInfo, location: e.target.value}
                            })}
                          >
                            <option value="New York">New York</option>
                            <option value="San Francisco">San Francisco</option>
                            <option value="Chicago">Chicago</option>
                            <option value="Boston">Boston</option>
                            <option value="Austin">Austin</option>
                            <option value="Seattle">Seattle</option>
                            <option value="Remote">Remote</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Workplace Type</label>
                          <select
                            className="form-select"
                            value={newEmployee.employmentInfo.workplaceType}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              employmentInfo: {...newEmployee.employmentInfo, workplaceType: e.target.value}
                            })}
                          >
                            <option value="Office">Office</option>
                            <option value="Remote">Remote</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Work Email <span className="text-danger">*</span></label>
                          <input
                            type="email"
                            className="form-control"
                            value={newEmployee.employmentInfo.workEmail || newEmployee.email}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              email: e.target.value,
                              employmentInfo: {...newEmployee.employmentInfo, workEmail: e.target.value}
                            })}
                            placeholder="employee@company.com"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Direct Reporting Manager</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.employmentInfo.reportingManager.direct}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              employmentInfo: {
                                ...newEmployee.employmentInfo,
                                reportingManager: {
                                  ...newEmployee.employmentInfo.reportingManager,
                                  direct: e.target.value
                                }
                              }
                            })}
                            placeholder="Manager name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Notice Period (days)</label>
                          <input
                            type="number"
                            className="form-control"
                            value={newEmployee.employmentInfo.noticePeriod}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              employmentInfo: {...newEmployee.employmentInfo, noticePeriod: parseInt(e.target.value) || 0}
                            })}
                          />
                        </div>
                      </div>
                    )}

                    {/* Salary & Compensation Tab */}
                    {activeAddTab === 'salary' && (
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Current CTC (Annual) <span className="text-danger">*</span></label>
                          <input
                            type="number"
                            className="form-control"
                            value={newEmployee.salaryInfo.currentCTC || newEmployee.salary}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              salary: e.target.value,
                              salaryInfo: {...newEmployee.salaryInfo, currentCTC: parseInt(e.target.value) || 0}
                            })}
                            placeholder="75000"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Payment Mode</label>
                          <select
                            className="form-select"
                            value={newEmployee.salaryInfo.paymentMode}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              salaryInfo: {...newEmployee.salaryInfo, paymentMode: e.target.value}
                            })}
                          >
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Cash">Cash</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Primary Bank Account Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.salaryInfo.bankAccounts.primary.accountNumber}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              salaryInfo: {
                                ...newEmployee.salaryInfo,
                                bankAccounts: {
                                  ...newEmployee.salaryInfo.bankAccounts,
                                  primary: {
                                    ...newEmployee.salaryInfo.bankAccounts.primary,
                                    accountNumber: e.target.value
                                  }
                                }
                              }
                            })}
                            placeholder="1234567890"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">IFSC Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.salaryInfo.bankAccounts.primary.ifscCode}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              salaryInfo: {
                                ...newEmployee.salaryInfo,
                                bankAccounts: {
                                  ...newEmployee.salaryInfo.bankAccounts,
                                  primary: {
                                    ...newEmployee.salaryInfo.bankAccounts.primary,
                                    ifscCode: e.target.value
                                  }
                                }
                              }
                            })}
                            placeholder="BANK0001234"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Bank Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.salaryInfo.bankAccounts.primary.bankName}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              salaryInfo: {
                                ...newEmployee.salaryInfo,
                                bankAccounts: {
                                  ...newEmployee.salaryInfo.bankAccounts,
                                  primary: {
                                    ...newEmployee.salaryInfo.bankAccounts.primary,
                                    bankName: e.target.value
                                  }
                                }
                              }
                            })}
                            placeholder="Bank Name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">UAN (Universal Account Number)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.salaryInfo.uan}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              salaryInfo: {...newEmployee.salaryInfo, uan: e.target.value}
                            })}
                            placeholder="UAN123456789"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">PF Account Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.salaryInfo.pfAccountNumber}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              salaryInfo: {...newEmployee.salaryInfo, pfAccountNumber: e.target.value}
                            })}
                            placeholder="PF123456"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">ESI Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newEmployee.salaryInfo.esiNumber}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              salaryInfo: {...newEmployee.salaryInfo, esiNumber: e.target.value}
                            })}
                            placeholder="ESI123456"
                          />
                        </div>
                      </div>
                    )}

                    {/* Statutory & Compliance Tab */}
                    {activeAddTab === 'statutory' && (
                      <div className="row g-3">
                        <div className="col-12 mb-3">
                          <div className="alert alert-info">
                            <Icon icon="heroicons:information-circle" className="me-2" />
                            <strong>Note:</strong> PAN and Aadhaar numbers are managed in the Personal Info tab. This section is for statutory compliance and verification status.
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">PF Enrolled</label>
                          <select
                            className="form-select"
                            value={newEmployee.statutoryInfo.pfMembership.enrolled}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              statutoryInfo: {
                                ...newEmployee.statutoryInfo,
                                pfMembership: {...newEmployee.statutoryInfo.pfMembership, enrolled: e.target.value === 'true'}
                              }
                            })}
                          >
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">ESI Enrolled</label>
                          <select
                            className="form-select"
                            value={newEmployee.statutoryInfo.esiRegistration.enrolled}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              statutoryInfo: {
                                ...newEmployee.statutoryInfo,
                                esiRegistration: {...newEmployee.statutoryInfo.esiRegistration, enrolled: e.target.value === 'true'}
                              }
                            })}
                          >
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Professional Tax Applicable</label>
                          <select
                            className="form-select"
                            value={newEmployee.statutoryInfo.professionalTax.applicable}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              statutoryInfo: {
                                ...newEmployee.statutoryInfo,
                                professionalTax: {...newEmployee.statutoryInfo.professionalTax, applicable: e.target.value === 'true'}
                              }
                            })}
                          >
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Gratuity Eligible</label>
                          <select
                            className="form-select"
                            value={newEmployee.statutoryInfo.gratuity.eligible}
                            onChange={(e) => setNewEmployee({
                              ...newEmployee,
                              statutoryInfo: {
                                ...newEmployee.statutoryInfo,
                                gratuity: {...newEmployee.statutoryInfo.gratuity, eligible: e.target.value === 'true'}
                              }
                            })}
                          >
                            <option value={false}>No</option>
                            <option value={true}>Yes</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-end gap-2" style={{ flexShrink: 0 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setActiveAddTab('personal');
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success d-flex align-items-center"
                    onClick={handleAddEmployee}
                    disabled={!newEmployee.name || !newEmployee.email || !newEmployee.employmentInfo.designation || !newEmployee.salary}
                  >
                    <Icon icon="heroicons:user-plus" className="me-2" />
                    Add Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

// ==================== TAB COMPONENTS ====================

// Personal Information Tab Component
const PersonalInfoTab = ({ employee, formatDate }) => {
  const personalInfo = employee.personalInfo || {};
  const identification = personalInfo.identification || {};

  return (
    <div>
      <div className="row g-4">
        {/* Basic Information */}
        <div className="col-12">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:identification" className="me-2" />
            Basic Information
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Full Name</label>
          <p className="form-control-plaintext">{employee.name}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Date of Birth</label>
          <p className="form-control-plaintext">{personalInfo.dateOfBirth ? formatDate(personalInfo.dateOfBirth) : 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Gender</label>
          <p className="form-control-plaintext">{personalInfo.gender || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Blood Group</label>
          <p className="form-control-plaintext">{personalInfo.bloodGroup || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Marital Status</label>
          <p className="form-control-plaintext">{personalInfo.maritalStatus || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Nationality</label>
          <p className="form-control-plaintext">{personalInfo.nationality || 'N/A'}</p>
        </div>
        <div className="col-md-12">
          <label className="form-label small fw-semibold">Languages</label>
          <p className="form-control-plaintext">
            {personalInfo.languages && personalInfo.languages.length > 0 
              ? personalInfo.languages.join(', ') 
              : 'N/A'}
          </p>
        </div>

        {/* Contact Information */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:phone" className="me-2" />
            Contact Information
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Personal Email</label>
          <p className="form-control-plaintext">{personalInfo.personalEmail || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Primary Phone</label>
          <p className="form-control-plaintext">{personalInfo.phonePrimary || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Secondary Phone</label>
          <p className="form-control-plaintext">{personalInfo.phoneSecondary || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Emergency Phone</label>
          <p className="form-control-plaintext">{personalInfo.phoneEmergency || 'N/A'}</p>
        </div>

        {/* Address Information */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:map-pin" className="me-2" />
            Address Information
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Current Address</label>
          <div className="form-control-plaintext">
            {personalInfo.currentAddress ? (
              <div>
                <div>{personalInfo.currentAddress.line1}</div>
                {personalInfo.currentAddress.line2 && <div>{personalInfo.currentAddress.line2}</div>}
                <div>{personalInfo.currentAddress.city}, {personalInfo.currentAddress.state} {personalInfo.currentAddress.pincode}</div>
                <div>{personalInfo.currentAddress.country}</div>
              </div>
            ) : 'N/A'}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Permanent Address</label>
          <div className="form-control-plaintext">
            {personalInfo.permanentAddress ? (
              <div>
                <div>{personalInfo.permanentAddress.line1}</div>
                {personalInfo.permanentAddress.line2 && <div>{personalInfo.permanentAddress.line2}</div>}
                <div>{personalInfo.permanentAddress.city}, {personalInfo.permanentAddress.state} {personalInfo.permanentAddress.pincode}</div>
                <div>{personalInfo.permanentAddress.country}</div>
              </div>
            ) : 'N/A'}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:user-group" className="me-2" />
            Emergency Contacts
          </h6>
          {personalInfo.emergencyContacts && personalInfo.emergencyContacts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Relation</th>
                    <th>Phone</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {personalInfo.emergencyContacts.map((contact, idx) => (
                    <tr key={idx}>
                      <td>{contact.name}</td>
                      <td>{contact.relation}</td>
                      <td>{contact.phone}</td>
                      <td><span className="badge bg-primary">{contact.priority}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No emergency contacts added</p>
          )}
        </div>

        {/* Family Members */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:home" className="me-2" />
            Family Members
          </h6>
          {personalInfo.familyMembers && personalInfo.familyMembers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Relation</th>
                    <th>Date of Birth</th>
                  </tr>
                </thead>
                <tbody>
                  {personalInfo.familyMembers.map((member, idx) => (
                    <tr key={idx}>
                      <td>{member.name}</td>
                      <td>{member.relation}</td>
                      <td>{member.dob ? formatDate(member.dob) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No family members added</p>
          )}
        </div>

        {/* Nominees */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:gift" className="me-2" />
            Nominee Information
          </h6>
          {personalInfo.nominees && personalInfo.nominees.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Relation</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {personalInfo.nominees.map((nominee, idx) => (
                    <tr key={idx}>
                      <td>{nominee.name}</td>
                      <td>{nominee.relation}</td>
                      <td>{nominee.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No nominees added</p>
          )}
        </div>

        {/* Identification Documents */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:document-text" className="me-2" />
            Identification Documents
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">PAN Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{identification.pan?.number || 'N/A'}</p>
            {identification.pan?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Aadhaar Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{identification.aadhaar?.number || 'N/A'}</p>
            {identification.aadhaar?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Passport Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{identification.passport?.number || 'N/A'}</p>
            {identification.passport?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
          {identification.passport?.expiryDate && (
            <small className="text-muted">Expiry: {formatDate(identification.passport.expiryDate)}</small>
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Voter ID Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{identification.voterId?.number || 'N/A'}</p>
            {identification.voterId?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Employment Information Tab Component
const EmploymentInfoTab = ({ employee, formatDate, getStatusBadge, getEmploymentTypeBadge }) => {
  const empInfo = employee.employmentInfo || {};

  return (
    <div>
      <div className="row g-4">
        <div className="col-12">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:briefcase" className="me-2" />
            Employment Details
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Employee ID</label>
          <p className="form-control-plaintext">{empInfo.employeeId || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Date of Joining</label>
          <p className="form-control-plaintext">{empInfo.dateOfJoining ? formatDate(empInfo.dateOfJoining) : 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Confirmation Date</label>
          <p className="form-control-plaintext">{empInfo.confirmationDate ? formatDate(empInfo.confirmationDate) : 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Probation Period (months)</label>
          <p className="form-control-plaintext">{empInfo.probationPeriod || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Employment Type</label>
          <p className="form-control-plaintext">{getEmploymentTypeBadge(empInfo.employmentType || 'N/A')}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Employment Status</label>
          <p className="form-control-plaintext">{getStatusBadge(empInfo.employmentStatus || 'N/A')}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Department</label>
          <p className="form-control-plaintext">{empInfo.department || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Sub-Department</label>
          <p className="form-control-plaintext">{empInfo.subDepartment || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Cost Center</label>
          <p className="form-control-plaintext">{empInfo.costCenter || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Designation</label>
          <p className="form-control-plaintext">{empInfo.designation || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Grade</label>
          <p className="form-control-plaintext">{empInfo.grade || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Level</label>
          <p className="form-control-plaintext">{empInfo.level || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Location</label>
          <p className="form-control-plaintext">{empInfo.location || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Workplace Type</label>
          <p className="form-control-plaintext">{empInfo.workplaceType || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Work Email</label>
          <p className="form-control-plaintext">{empInfo.workEmail || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Extension Number</label>
          <p className="form-control-plaintext">{empInfo.extensionNumber || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Desk Location</label>
          <p className="form-control-plaintext">{empInfo.deskLocation || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Employee Category</label>
          <p className="form-control-plaintext">{empInfo.employeeCategory || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Notice Period (days)</label>
          <p className="form-control-plaintext">{empInfo.noticePeriod || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Direct Reporting Manager</label>
          <p className="form-control-plaintext">{empInfo.reportingManager?.direct || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Functional Reporting Manager</label>
          <p className="form-control-plaintext">{empInfo.reportingManager?.functional || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">HR Business Partner</label>
          <p className="form-control-plaintext">{empInfo.hrBusinessPartner || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

// Job History Tab Component
const JobHistoryTab = ({ employee, formatDate, formatCurrency }) => {
  const jobHistory = employee.jobHistory || [];

  return (
    <div>
      <div className="row g-4">
        <div className="col-12">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:clock" className="me-2" />
            Complete Job History
          </h6>
        </div>
        <div className="col-12">
          {jobHistory.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="bg-light">
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Location</th>
                    <th>Manager</th>
                    <th>Salary Change</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {jobHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map((history, idx) => (
                    <tr key={idx}>
                      <td>{formatDate(history.date)}</td>
                      <td>
                        <span className={`badge ${
                          history.type === 'Promotion' ? 'bg-success' :
                          history.type === 'Transfer' ? 'bg-info' :
                          history.type === 'Joining' ? 'bg-primary' :
                          'bg-secondary'
                        }`}>
                          {history.type}
                        </span>
                      </td>
                      <td>{history.department}</td>
                      <td>{history.designation}</td>
                      <td>{history.location}</td>
                      <td>{history.manager}</td>
                      <td>{history.salaryChange ? formatCurrency(history.salaryChange) : '-'}</td>
                      <td><small className="text-muted">{history.notes || '-'}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              <Icon icon="heroicons:information-circle" className="me-2" />
              No job history records found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Salary & Compensation Tab Component
const SalaryInfoTab = ({ employee, formatCurrency, formatDate }) => {
  const salaryInfo = employee.salaryInfo || {};
  const ctcBreakdown = salaryInfo.ctcBreakdown || {};
  const bankAccounts = salaryInfo.bankAccounts || {};

  return (
    <div>
      <div className="row g-4">
        {/* Current CTC */}
        <div className="col-12">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:currency-dollar" className="me-2" />
            Current Compensation
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Current CTC (Annual)</label>
          <p className="form-control-plaintext text-primary fw-bold fs-5">
            {formatCurrency(salaryInfo.currentCTC || 0)}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Salary Structure</label>
          <p className="form-control-plaintext">{salaryInfo.salaryStructure || 'N/A'}</p>
        </div>

        {/* CTC Breakdown */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">CTC Breakdown</h6>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="bg-light">
                <tr>
                  <th>Component</th>
                  <th className="text-end">Amount (Annual)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.basic || 0)}</td>
                </tr>
                <tr>
                  <td>HRA</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.hra || 0)}</td>
                </tr>
                <tr>
                  <td>Special Allowance</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.specialAllowance || 0)}</td>
                </tr>
                <tr>
                  <td>Transport Allowance</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.transportAllowance || 0)}</td>
                </tr>
                <tr>
                  <td>Medical Allowance</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.medicalAllowance || 0)}</td>
                </tr>
                <tr>
                  <td>Other Allowances</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.otherAllowances || 0)}</td>
                </tr>
                <tr className="table-secondary fw-bold">
                  <td>Gross Salary</td>
                  <td className="text-end">
                    {formatCurrency(
                      (ctcBreakdown.basic || 0) +
                      (ctcBreakdown.hra || 0) +
                      (ctcBreakdown.specialAllowance || 0) +
                      (ctcBreakdown.transportAllowance || 0) +
                      (ctcBreakdown.medicalAllowance || 0) +
                      (ctcBreakdown.otherAllowances || 0)
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Provident Fund</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.providentFund || 0)}</td>
                </tr>
                <tr>
                  <td>Gratuity</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.gratuity || 0)}</td>
                </tr>
                <tr>
                  <td>Other Deductions</td>
                  <td className="text-end">{formatCurrency(ctcBreakdown.otherDeductions || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:building-library" className="me-2" />
            Bank Account Details
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Payment Mode</label>
          <p className="form-control-plaintext">{salaryInfo.paymentMode || 'N/A'}</p>
        </div>
        <div className="col-md-6"></div>
        <div className="col-md-6">
          <h6 className="small fw-bold mt-3">Primary Bank Account</h6>
          <div className="card border">
            <div className="card-body">
              <div className="mb-2">
                <label className="form-label small fw-semibold">Account Number</label>
                <p className="form-control-plaintext">{bankAccounts.primary?.accountNumber || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold">IFSC Code</label>
                <p className="form-control-plaintext">{bankAccounts.primary?.ifscCode || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Bank Name</label>
                <p className="form-control-plaintext">{bankAccounts.primary?.bankName || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Branch</label>
                <p className="form-control-plaintext">{bankAccounts.primary?.branch || 'N/A'}</p>
              </div>
              <div>
                <label className="form-label small fw-semibold">Account Type</label>
                <p className="form-control-plaintext">{bankAccounts.primary?.accountType || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        {bankAccounts.secondary && (
          <div className="col-md-6">
            <h6 className="small fw-bold mt-3">Secondary Bank Account</h6>
            <div className="card border">
              <div className="card-body">
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Account Number</label>
                  <p className="form-control-plaintext">{bankAccounts.secondary.accountNumber || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">IFSC Code</label>
                  <p className="form-control-plaintext">{bankAccounts.secondary.ifscCode || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Bank Name</label>
                  <p className="form-control-plaintext">{bankAccounts.secondary.bankName || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PF & ESI */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:shield-check" className="me-2" />
            Provident Fund & ESI
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">PF Account Number</label>
          <p className="form-control-plaintext">{salaryInfo.pfAccountNumber || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">UAN (Universal Account Number)</label>
          <p className="form-control-plaintext">{salaryInfo.uan || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">ESI Number</label>
          <p className="form-control-plaintext">{salaryInfo.esiNumber || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">ESI Medical Nominee</label>
          <p className="form-control-plaintext">{salaryInfo.esiMedicalNominee || 'N/A'}</p>
        </div>

        {/* Tax & Variable Pay */}
        <div className="col-12 mt-4">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:document-check" className="me-2" />
            Tax & Benefits
          </h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Tax Regime</label>
          <p className="form-control-plaintext">{salaryInfo.taxDeclaration?.regime || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Tax Declaration</label>
          <p className="form-control-plaintext">
            {salaryInfo.taxDeclaration?.declared ? (
              <span className="badge bg-success">Declared</span>
            ) : (
              <span className="badge bg-warning">Not Declared</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Variable Pay Eligible</label>
          <p className="form-control-plaintext">
            {salaryInfo.variablePay?.eligible ? (
              <span className="badge bg-success">{salaryInfo.variablePay.percentage}%</span>
            ) : (
              <span className="badge bg-secondary">Not Eligible</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Bonus Eligible</label>
          <p className="form-control-plaintext">
            {salaryInfo.bonusEligibility?.eligible ? (
              <span className="badge bg-success">{formatCurrency(salaryInfo.bonusEligibility.amount || 0)}</span>
            ) : (
              <span className="badge bg-secondary">Not Eligible</span>
            )}
          </p>
        </div>

        {/* Salary Revision History */}
        {salaryInfo.salaryRevisionHistory && salaryInfo.salaryRevisionHistory.length > 0 && (
          <div className="col-12 mt-4">
            <h6 className="fw-bold mb-3 border-bottom pb-2">
              <Icon icon="heroicons:chart-bar" className="me-2" />
              Salary Revision History
            </h6>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Effective Date</th>
                    <th>Previous CTC</th>
                    <th>New CTC</th>
                    <th>Percentage Increase</th>
                    <th>Approved By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryInfo.salaryRevisionHistory.map((revision, idx) => (
                    <tr key={idx}>
                      <td>{formatDate(revision.effectiveDate)}</td>
                      <td>{formatCurrency(revision.previousCTC)}</td>
                      <td>{formatCurrency(revision.newCTC)}</td>
                      <td>{revision.percentageIncrease}%</td>
                      <td>{revision.approvedBy}</td>
                      <td><span className="badge bg-success">{revision.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Statutory & Compliance Tab Component
const StatutoryInfoTab = ({ employee, formatDate }) => {
  const statutoryInfo = employee.statutoryInfo || {};

  return (
    <div>
      <div className="row g-4">
        <div className="col-12">
          <h6 className="fw-bold mb-3 border-bottom pb-2">
            <Icon icon="heroicons:shield-check" className="me-2" />
            Statutory & Compliance Information
          </h6>
        </div>

        {/* PAN Details */}
        <div className="col-12">
          <h6 className="fw-semibold mb-3">PAN Card Details</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">PAN Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{statutoryInfo.pan?.number || 'N/A'}</p>
            {statutoryInfo.pan?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Verification Date</label>
          <p className="form-control-plaintext">{statutoryInfo.pan?.verifiedDate ? formatDate(statutoryInfo.pan.verifiedDate) : 'N/A'}</p>
        </div>

        {/* Aadhaar Details */}
        <div className="col-12 mt-4">
          <h6 className="fw-semibold mb-3">Aadhaar Card Details</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Aadhaar Number</label>
          <div className="d-flex align-items-center gap-2">
            <p className="form-control-plaintext mb-0">{statutoryInfo.aadhaar?.number || 'N/A'}</p>
            {statutoryInfo.aadhaar?.verified && (
              <span className="badge bg-success">Verified</span>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Verification Date</label>
          <p className="form-control-plaintext">{statutoryInfo.aadhaar?.verifiedDate ? formatDate(statutoryInfo.aadhaar.verifiedDate) : 'N/A'}</p>
        </div>

        {/* PF Membership */}
        <div className="col-12 mt-4">
          <h6 className="fw-semibold mb-3">Provident Fund Membership</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">PF Enrolled</label>
          <p className="form-control-plaintext">
            {statutoryInfo.pfMembership?.enrolled ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">PF Account Number</label>
          <p className="form-control-plaintext">{statutoryInfo.pfMembership?.accountNumber || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">UAN</label>
          <p className="form-control-plaintext">{statutoryInfo.pfMembership?.uan || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Enrollment Date</label>
          <p className="form-control-plaintext">{statutoryInfo.pfMembership?.enrollmentDate ? formatDate(statutoryInfo.pfMembership.enrollmentDate) : 'N/A'}</p>
        </div>

        {/* ESI Registration */}
        <div className="col-12 mt-4">
          <h6 className="fw-semibold mb-3">ESI Registration</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">ESI Enrolled</label>
          <p className="form-control-plaintext">
            {statutoryInfo.esiRegistration?.enrolled ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">ESI Number</label>
          <p className="form-control-plaintext">{statutoryInfo.esiRegistration?.number || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Enrollment Date</label>
          <p className="form-control-plaintext">{statutoryInfo.esiRegistration?.enrollmentDate ? formatDate(statutoryInfo.esiRegistration.enrollmentDate) : 'N/A'}</p>
        </div>

        {/* Professional Tax */}
        <div className="col-12 mt-4">
          <h6 className="fw-semibold mb-3">Professional Tax</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Applicable</label>
          <p className="form-control-plaintext">
            {statutoryInfo.professionalTax?.applicable ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">State</label>
          <p className="form-control-plaintext">{statutoryInfo.professionalTax?.state || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">PT Number</label>
          <p className="form-control-plaintext">{statutoryInfo.professionalTax?.ptNumber || 'N/A'}</p>
        </div>

        {/* Labour Welfare Fund */}
        <div className="col-12 mt-4">
          <h6 className="fw-semibold mb-3">Labour Welfare Fund</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Enrolled</label>
          <p className="form-control-plaintext">
            {statutoryInfo.labourWelfareFund?.enrolled ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Enrollment Date</label>
          <p className="form-control-plaintext">{statutoryInfo.labourWelfareFund?.enrollmentDate ? formatDate(statutoryInfo.labourWelfareFund.enrollmentDate) : 'N/A'}</p>
        </div>

        {/* Gratuity */}
        <div className="col-12 mt-4">
          <h6 className="fw-semibold mb-3">Gratuity</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Eligible</label>
          <p className="form-control-plaintext">
            {statutoryInfo.gratuity?.eligible ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Eligibility Date</label>
          <p className="form-control-plaintext">{statutoryInfo.gratuity?.eligibilityDate ? formatDate(statutoryInfo.gratuity.eligibilityDate) : 'N/A'}</p>
        </div>

        {/* Bonus Act */}
        <div className="col-12 mt-4">
          <h6 className="fw-semibold mb-3">Bonus Act</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Applicable</label>
          <p className="form-control-plaintext">
            {statutoryInfo.bonusAct?.applicable ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>

        {/* Shops and Establishment */}
        <div className="col-12 mt-4">
          <h6 className="fw-semibold mb-3">Shops and Establishment Act</h6>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Registered</label>
          <p className="form-control-plaintext">
            {statutoryInfo.shopsAndEstablishment?.registered ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Registration Number</label>
          <p className="form-control-plaintext">{statutoryInfo.shopsAndEstablishment?.registrationNumber || 'N/A'}</p>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">Registration Date</label>
          <p className="form-control-plaintext">{statutoryInfo.shopsAndEstablishment?.registrationDate ? formatDate(statutoryInfo.shopsAndEstablishment.registrationDate) : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMasterData;