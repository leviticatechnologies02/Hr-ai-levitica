import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import StatCard from '../../../shared/components/StatCard';
import EmployeeDetailModal from '../modal/EmployeeDetailModal';
import AddEmployeeModal from '../modal/AddEmployeeMasterModal';
import { employeeAPI } from "../../../shared/services/api";

const EmployeeMasterData = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 6;

  const loadEmployees = async () => {
    try {
      const res = await employeeAPI.listMaster();
      if (Array.isArray(res)) {
        setEmployees(res);
      } else if (res.items) {
        setEmployees(res.items);
      } else if (res.data) {
        setEmployees(res.data);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const createEmployeeObject = (baseData) => {
    return {
      ...baseData,
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
      employmentInfo: baseData.employmentInfo || {
        employeeId: baseData.employeeId || '',
        dateOfJoining: baseData.joinDate || '',
        confirmationDate: '',
        probationPeriod: 6,
        employmentType: baseData.employmentType || 'Permanent',
        employmentStatus: baseData.status || 'Active',
        department: baseData.department || '',
        subDepartment: '',
        costCenter: '',
        designation: baseData.designation || '',
        grade: '',
        level: '',
        location: baseData.location || '',
        workplaceType: 'Office',
        workEmail: baseData.email || '',
        extensionNumber: '',
        deskLocation: '',
        employeeCategory: 'Staff',
        noticePeriod: 30,
        reportingManager: {
          direct: '',
          functional: ''
        },
        hrBusinessPartner: ''
      },
      jobHistory: baseData.jobHistory || [],
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
        paymentMode: 'Bank Transfer',
        pfAccountNumber: '',
        uan: '',
        esiNumber: '',
        esiMedicalNominee: '',
        taxDeclaration: {
          regime: 'New',
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
    }, 0) / (totalEmployees || 1);

    return {
      totalEmployees: totalEmployees,
      activeEmployees: activeEmployees,
      departments: departments.length,
      avgSalary: avgSalary
    };
  }, [employees]);

  const filteredData = useMemo(() => {
    return employees.filter(emp => {
      const empInfo = emp.employmentInfo || {};
      const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (empInfo.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'All' || (empInfo.department || emp.department || '') === departmentFilter;
      const matchesStatus = statusFilter === 'All' || (empInfo.employmentStatus || emp.status || '') === statusFilter;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aVal, bVal;
      
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

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    const config = {
      'Active': { label: 'Active', color: 'emerald' },
      'On Leave': { label: 'On Leave', color: 'amber' },
      'Inactive': { label: 'Inactive', color: 'rose' },
      'Resigned': { label: 'Resigned', color: 'gray' },
      'Terminated': { label: 'Terminated', color: 'rose' },
      'On-Hold': { label: 'On-Hold', color: 'blue' }
    };
    const { label, color } = config[status] || { label: status || 'Unknown', color: 'gray' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        <Icon icon={status === 'Active' ? 'heroicons:check-circle' : 'heroicons:clock'} className="w-3.5 h-3.5" />
        {label}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type) => {
    const config = {
      'Full-time': { label: 'Full-time', color: 'blue' },
      'Permanent': { label: 'Permanent', color: 'blue' },
      'Contract': { label: 'Contract', color: 'cyan' },
      'Part-time': { label: 'Part-time', color: 'gray' },
      'Intern': { label: 'Intern', color: 'amber' },
      'Consultant': { label: 'Consultant', color: 'purple' }
    };
    const { label, color } = config[type] || { label: type || 'N/A', color: 'gray' };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.deleteMaster(id);
        await loadEmployees();
        if (selectedEmployee?.id === id) {
            setSelectedEmployee(null);
            setShowDetailModal(false);
          }
        } catch (err) {
            alert(err.message);
      }
      if (selectedEmployee?.id === id) {
        setShowDetailModal(false);
        setSelectedEmployee(null);
      }
    }
  };

  const handleAddEmployee = async (newEmployeeData) => {
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const employeeId = `EMP${String(newId).padStart(3, '0')}`;
    const joinDate = newEmployeeData.employmentInfo.dateOfJoining || new Date().toISOString().split('T')[0];
    
    const newEmp = createEmployeeObject({
      id: newId,
      employeeId: employeeId,
      name: newEmployeeData.name,
      email: newEmployeeData.email || newEmployeeData.employmentInfo.workEmail,
      phone: newEmployeeData.phone || newEmployeeData.personalInfo.phonePrimary,
      salary: parseInt(newEmployeeData.salaryInfo.currentCTC || newEmployeeData.salary) || 0,
      status: newEmployeeData.employmentInfo.employmentStatus || 'Active',
      joinDate: joinDate,
      department: newEmployeeData.employmentInfo.department || newEmployeeData.department,
      designation: newEmployeeData.employmentInfo.designation || newEmployeeData.designation,
      location: newEmployeeData.employmentInfo.location || newEmployeeData.location,
      employmentType: newEmployeeData.employmentInfo.employmentType || newEmployeeData.employmentType,
      personalInfo: {
        ...newEmployeeData.personalInfo,
        personalEmail: newEmployeeData.personalInfo.personalEmail || newEmployeeData.email,
        phonePrimary: newEmployeeData.personalInfo.phonePrimary || newEmployeeData.phone
      },
      employmentInfo: {
        ...newEmployeeData.employmentInfo,
        employeeId: employeeId,
        dateOfJoining: joinDate,
        workEmail: newEmployeeData.employmentInfo.workEmail || newEmployeeData.email
      },
      salaryInfo: {
        ...newEmployeeData.salaryInfo,
        currentCTC: parseInt(newEmployeeData.salaryInfo.currentCTC || newEmployeeData.salary) || 0
      },
      statutoryInfo: {
        ...newEmployeeData.statutoryInfo,
        pan: {
          ...newEmployeeData.statutoryInfo.pan,
          number: newEmployeeData.personalInfo.identification.pan.number || newEmployeeData.statutoryInfo.pan.number
        },
        aadhaar: {
          ...newEmployeeData.statutoryInfo.aadhaar,
          number: newEmployeeData.personalInfo.identification.aadhaar.number || newEmployeeData.statutoryInfo.aadhaar.number
        }
      }
    });
    
    try {
        await employeeAPI.createMaster(newEmp);
        await loadEmployees();
        setShowAddModal(false);
        alert("Employee added successfully");
      } catch (err) {
        console.error(err);
        alert(err.message);
      }   
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

  const refreshData = async () => {
      setCurrentPage(1);
      setSearchTerm("");
      setDepartmentFilter("All");
      setStatusFilter("All");
      setSortConfig({
          key: "name",
          direction: "asc"
      });

      await loadEmployees();
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 md:px-3 min-h-screen pb-8 sm:pb-7">
      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
              <Icon icon="heroicons:user-group" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
                Employee Master Data
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 flex flex-wrap items-center gap-1 sm:gap-2">
                <span>Manage all employee information</span>
                <span className="w-0.5 h-0.5 rounded-full bg-slate-300 hidden xs:inline"></span>
                <span className="hidden xs:inline">Profiles & employment details</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial min-w-[120px] sm:min-w-[200px]">
              <Icon icon="heroicons:magnifying-glass" className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-8 sm:h-10 pl-8 sm:pl-10 pr-3 sm:pr-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Employees"
          value={kpis.totalEmployees}
          subtitle={`${kpis.activeEmployees} active employees`}
          icon="heroicons:users"
          color="blue"
        />
        <StatCard
          title="Active Employees"
          value={kpis.activeEmployees}
          subtitle={`${((kpis.activeEmployees / (kpis.totalEmployees || 1)) * 100).toFixed(1)}% of total`}
          icon="heroicons:check-circle"
          color="green"
        />
        <StatCard
          title="Departments"
          value={kpis.departments}
          subtitle="Total departments"
          icon="heroicons:building-office"
          color="purple"
        />
        <StatCard
          title="Avg. Salary"
          value={formatCurrency(kpis.avgSalary)}
          subtitle="Average annual compensation"
          icon="heroicons:currency-dollar"
          color="yellow"
        />
      </div>

      <div className=" p-3 sm:p-4 md:p-5">
        <button
          className="w-full sm:hidden flex items-center justify-between py-2 text-sm font-semibold text-slate-700"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <span className="flex items-center gap-2">
            <Icon icon="heroicons:funnel" className="w-4 h-4" />
            Filters
          </span>
          <Icon icon={showMobileFilters ? "heroicons:chevron-up" : "heroicons:chevron-down"} className="w-4 h-4" />
        </button>

        <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
            <div className="relative flex-1 min-w-[120px]">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
              >
                <option value="All">All Departments</option>
                {departments.slice(1).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 min-w-[120px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-8 sm:h-10 px-3 sm:px-4 pr-8 sm:pr-10 bg-white border border-slate-200 rounded-xl shadow-sm text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Icon icon="heroicons:chevron-down" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 sm:gap-2"
              >
                <Icon icon="heroicons:user-plus" className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Add</span> Employee
              </button>
              <button
                onClick={exportToCSV}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 sm:gap-2"
              >
                <Icon icon="heroicons:document-arrow-down" className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Export</span> CSV
              </button>
              <button
                onClick={refreshData}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1 sm:gap-2"
              >
                <Icon icon="heroicons:arrow-path" className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h5 className="text-sm sm:text-base font-bold text-slate-800">
            Employee Records
            <span className="ml-2 text-xs font-normal text-slate-400">
              ({sortedData.length} employees)
            </span>
          </h5>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
              <tr>
                <th 
                  className="p-3 text-left min-w-[180px] cursor-pointer hover:bg-slate-100 transition text-xs sm:text-sm"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Employee
                    <Icon 
                      icon={`heroicons:chevron-${sortConfig.key === 'name' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} 
                      className="w-3 h-3" 
                    />
                  </div>
                </th>
                <th 
                  className="p-3 text-left min-w-[120px] cursor-pointer hover:bg-slate-100 transition hidden sm:table-cell"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center gap-2">
                    Department
                    <Icon 
                      icon={`heroicons:chevron-${sortConfig.key === 'department' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} 
                      className="w-3 h-3" 
                    />
                  </div>
                </th>
                <th className="p-3 text-left min-w-[140px] hidden md:table-cell">Contact</th>
                <th 
                  className="p-3 text-left min-w-[100px] cursor-pointer hover:bg-slate-100 transition hidden lg:table-cell"
                  onClick={() => handleSort('salary')}
                >
                  <div className="flex items-center gap-2">
                    Salary
                    <Icon 
                      icon={`heroicons:chevron-${sortConfig.key === 'salary' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} 
                      className="w-3 h-3" 
                    />
                  </div>
                </th>
                <th className="p-3 text-center min-w-[100px]">Status</th>
                <th className="p-3 text-center min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-100 flex-shrink-0">
                          <Icon icon="heroicons:user" className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 text-xs sm:text-sm truncate">{employee.name}</div>
                          <div className="text-[10px] sm:text-xs text-slate-400 truncate">
                            {(employee.employmentInfo || {}).employeeId || employee.employeeId} • {(employee.employmentInfo || {}).designation || employee.designation}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <div className="text-slate-600 text-xs sm:text-sm">{(employee.employmentInfo || {}).department || employee.department}</div>
                      <div className="text-[10px] text-slate-400">{(employee.employmentInfo || {}).location || employee.location}</div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="text-slate-600 text-xs sm:text-sm truncate max-w-[120px]">{employee.email || (employee.employmentInfo || {}).workEmail}</div>
                      <div className="text-[10px] text-slate-400">{employee.phone || (employee.personalInfo || {}).phonePrimary}</div>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="font-semibold text-slate-800 text-xs sm:text-sm">{formatCurrency((employee.salaryInfo || {}).currentCTC || employee.salary || 0)}</div>
                      <div className="mt-0.5">
                        {getEmploymentTypeBadge((employee.employmentInfo || {}).employmentType || employee.employmentType)}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {getStatusBadge((employee.employmentInfo || {}).employmentStatus || employee.status)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleViewDetails(employee)}
                          className="p-1.5 sm:p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          title="View Details"
                        >
                          <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="p-1.5 sm:p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                          title="Delete"
                        >
                          <Icon icon="heroicons:trash" className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    <Icon icon="heroicons:user-group" className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-slate-300" />
                    No employees found
                    <p className="text-[10px] sm:text-xs mt-1 text-slate-400">
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-3 sm:px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[10px] sm:text-xs text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} employees
            </div>
            <nav className="flex items-center gap-1 sm:gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon="heroicons:chevron-left" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
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
              {totalPages > 5 && (
                <span className="text-slate-400 text-xs">...</span>
              )}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon="heroicons:chevron-right" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
              </button>
            </nav>
          </div>
        )}
      </div>

      <EmployeeDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onEdit={(emp) => {
          alert('Edit functionality to be implemented');
        }}
        onDelete={handleDeleteEmployee}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddEmployee}
      />
    </div>
  );
};

export default EmployeeMasterData;