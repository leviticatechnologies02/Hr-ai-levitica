import React, { useState, useMemo, useEffect } from 'react';
import { employeeAPI } from '../../../shared/utils/api';
import { Icon } from '@iconify/react/dist/iconify.js';
import AddEmployeeModal from '../modal/AddEmployeeModal';
import EditEmployeeModal from '../modal/EditEmployeeModal';
import PersonalInfoTab from './components/PersonalInfoTab';
import EmploymentInfoTab from './components/EmploymentInfoTab';
import JobHistoryTab from './components/JobHistoryTab';
import SalaryInfoTab from './components/SalaryInfoTab';
import StatutoryInfoTab from './components/StatutoryInfoTab';
import StatCard from '../../../shared/components/StatCard';

const AllEmployees = () => {
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
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    employeeAPI.list()
      .then(data => {
        if (data && Array.isArray(data)) {
          const mapped = data.map(emp => createEmployeeObject({
            id: emp.id,
            employeeId: emp.employee_id || emp.employeeId || `EMP${emp.id}`,
            name: emp.name || emp.full_name || '',
            email: emp.work_email || emp.email || '',
            phone: emp.phone_primary || emp.phone || '',
            department: emp.department || '',
            designation: emp.designation || '',
            location: emp.location || '',
            employmentType: emp.employment_type || emp.employmentType || 'Permanent',
            status: emp.employment_status || emp.status || 'Active',
            joinDate: emp.date_of_joining || emp.joinDate || '',
            salary: emp.current_ctc || emp.salary || 0,
            personalInfo: emp.personalInfo || {},
            employmentInfo: emp.employmentInfo || {},
            jobHistory: emp.jobHistory || [],
            salaryInfo: emp.salaryInfo || {},
            statutoryInfo: emp.statutoryInfo || {}
          }));
          setEmployees(mapped);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load employees:', err);
        setApiError(err.message);
        setLoading(false);
      });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editEmployeeData, setEditEmployeeData] = useState(null);
  const [activeEditTab, setActiveEditTab] = useState('personal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
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
  const itemsPerPage = 6;

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
      const personalInfo = emp.personalInfo || {};
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (empInfo.workEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (personalInfo.personalEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const departments = ['All', ...new Set(employees.map(emp => (emp.employmentInfo || {}).department || emp.department || '').filter(d => d))];
  const statuses = ['All', 'Active', 'On Leave', 'Inactive', 'Resigned', 'Terminated', 'On-Hold'];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-green-100 text-green-800',
      'On Leave': 'bg-yellow-100 text-yellow-800',
      'Inactive': 'bg-red-100 text-red-800',
      'Resigned': 'bg-gray-100 text-gray-800',
      'Terminated': 'bg-red-100 text-red-800',
      'On-Hold': 'bg-blue-100 text-blue-800'
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
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        <Icon icon={icons[status] || 'heroicons:question-mark-circle'} className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type) => {
    const styles = {
      'Full-time': 'bg-blue-100 text-blue-800',
      'Contract': 'bg-cyan-100 text-cyan-800',
      'Part-time': 'bg-gray-100 text-gray-800',
      'Intern': 'bg-purple-100 text-purple-800',
      'Permanent': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedEmployee(null);
    setActiveDetailTab('personal');
  };

  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setDeletingId(id);
    try {
      await employeeAPI.remove(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      if (selectedEmployee?.id === id) {
        handleBackToList();
      }
    } catch (err) {
      alert(`Failed to delete employee: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.employmentInfo.designation) {
      alert('Please fill in all required fields (Name, Email, and Designation)');
      return;
    }

    // id/employeeId are now generated by the backend on create — no longer
    // computed client-side.
    const joinDate = newEmployee.employmentInfo.dateOfJoining || new Date().toISOString().split('T')[0];

    const processedJobHistory = Array.isArray(newEmployee.jobHistory)
      ? newEmployee.jobHistory
          .filter(history => history.date && history.type)
          .map(history => ({
            id: history.id || Date.now(),
            date: history.date,
            type: history.type,
            organisation: history.organisation || '',
            department: history.department || '',
            designation: history.designation || '',
            location: history.location || '',
            manager: history.manager || '',
            salaryChange: parseInt(history.salaryChange) || 0,
            notes: history.notes || '',
            achievements: history.achievements || '',
            reasonForLeaving: history.reasonForLeaving || '',
            endDate: history.endDate || ''
          }))
      : [];

    const processedSalaryRevisionHistory = Array.isArray(newEmployee.salaryInfo?.salaryRevisionHistory)
      ? newEmployee.salaryInfo.salaryRevisionHistory
          .filter(revision => revision.effectiveDate)
          .map(revision => ({
            id: revision.id || Date.now(),
            effectiveDate: revision.effectiveDate,
            previousCTC: parseInt(revision.previousCTC) || 0,
            newCTC: parseInt(revision.newCTC) || 0,
            percentageIncrease: parseInt(revision.percentageIncrease) || 0,
            approvedBy: revision.approvedBy || '',
            status: revision.status || 'Pending'
          }))
      : [];

    const processedEmergencyContacts = Array.isArray(newEmployee.personalInfo?.emergencyContacts)
      ? newEmployee.personalInfo.emergencyContacts
          .filter(contact => contact.name && contact.phone)
          .map(contact => ({
            name: contact.name,
            relation: contact.relation || '',
            phone: contact.phone,
            priority: contact.priority || 'Primary'
          }))
      : [];

    const processedFamilyMembers = Array.isArray(newEmployee.personalInfo?.familyMembers)
      ? newEmployee.personalInfo.familyMembers
          .filter(member => member.name)
          .map(member => ({
            name: member.name,
            relation: member.relation || '',
            dob: member.dateOfBirth || '',
            contactNo: member.contactNo || ''
          }))
      : [];

    const processedNominees = Array.isArray(newEmployee.personalInfo?.nominees)
      ? newEmployee.personalInfo.nominees
          .filter(nominee => nominee.name)
          .map(nominee => ({
            name: nominee.name,
            relation: nominee.relation || '',
            phone: nominee.phone || nominee.contactNo || '',
            percentage: parseInt(nominee.percentage) || 0,
            isNomineeAccepted: nominee.isNomineeAccepted || false,
          }))
      : [];

    const totalNomineePercentage = processedNominees.reduce((sum, nominee) => sum + nominee.percentage, 0);
    if (processedNominees.length > 0 && totalNomineePercentage !== 100) {
      alert(`Total nominee percentage is ${totalNomineePercentage}%. It should be exactly 100%.`);
      return;
    }

    setSavingEmployee(true);
    try {
      // newEmployee's shape (name/email/phone + personalInfo/employmentInfo/
      // jobHistory/salaryInfo/statutoryInfo) maps directly onto
      // EmployeeCreateRequest — no translation layer needed here, unlike
      // most of the onboarding-module files.
      const created = await employeeAPI.create({
        name: newEmployee.name.trim(),
        email: newEmployee.email.trim() || newEmployee.employmentInfo.workEmail?.trim(),
        phone: newEmployee.phone?.trim() || newEmployee.personalInfo?.phonePrimary?.trim() || '',
        department: newEmployee.employmentInfo?.department || newEmployee.department,
        designation: newEmployee.employmentInfo?.designation || newEmployee.designation,
        location: newEmployee.employmentInfo?.location || newEmployee.location,
        employmentType: newEmployee.employmentInfo?.employmentType || newEmployee.employmentType,
        status: newEmployee.employmentInfo?.employmentStatus || 'Active',
        joinDate,
        salary: parseInt(newEmployee.salaryInfo?.currentCTC || newEmployee.salary || 0) || 0,
        personalInfo: newEmployee.personalInfo,
        employmentInfo: { ...newEmployee.employmentInfo, dateOfJoining: joinDate },
        jobHistory: processedJobHistory,
        salaryInfo: { ...newEmployee.salaryInfo, salaryRevisionHistory: processedSalaryRevisionHistory },
        statutoryInfo: newEmployee.statutoryInfo,
      });

      const newEmp = createEmployeeObject({
        id: created.id,
        employeeId: created.employeeId,
        name: created.name,
        email: created.email,
        phone: created.phone,
        salary: created.salary,
        status: created.status,
        joinDate: created.joinDate,
        department: created.department,
        designation: created.designation,
        location: created.location,
        employmentType: created.employmentType,
        personalInfo: created.personalInfo || newEmployee.personalInfo,
        employmentInfo: created.employmentInfo || newEmployee.employmentInfo,
        jobHistory: created.jobHistory || processedJobHistory,
        salaryInfo: created.salaryInfo || newEmployee.salaryInfo,
        statutoryInfo: created.statutoryInfo || newEmployee.statutoryInfo,
      });

      setEmployees(prev => [...prev, newEmp]);
      setShowAddModal(false);
      setActiveAddTab('personal');
      alert(`Employee ${newEmp.name} added successfully! Employee ID: ${newEmp.employeeId}`);
      resetNewEmployeeForm();
    } catch (err) {
      alert(`Failed to add employee: ${err.message}`);
    } finally {
      setSavingEmployee(false);
    }
  };

  const resetNewEmployeeForm = () => {
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      department: 'Engineering',
      designation: '',
      location: '',
      employmentType: 'Full-time',
      salary: '',
      jobHistory: [],
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
          aadhaar: { number: '', document: '', verified: false },
          pan: { number: '', document: '', verified: false },
          passport: { number: '', expiryDate: '', verified: false, document: '' },
          voterId: { number: '', verified: false, document: '' }
        }
      },
      employmentInfo: {
        employeeId: '',
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
        location: '',
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
        ctcBreakdown: {
          basic: '', hra: '', specialAllowance: '', transportAllowance: '',
          medicalAllowance: '', otherAllowances: '', providentFund: '',
          gratuity: '', otherDeductions: ''
        },
        salaryStructure: '',
        bankAccounts: {
          primary: { accountNumber: '', ifscCode: '', bankName: '', branch: '', accountType: 'Savings' }
        },
        paymentMode: 'Bank Transfer',
        pfAccountNumber: '',
        uan: '',
        esiNumber: '',
        esiMedicalNominee: '',
        taxDeclaration: { regime: 'New', declared: false },
        variablePay: { eligible: false, percentage: 0 },
        bonusEligibility: { eligible: false, amount: 0 },
        salaryRevisionHistory: []
      },
      statutoryInfo: {
        pan: { number: '', verified: false, verifiedDate: '' },
        aadhaar: { number: '', verified: false, verifiedDate: '' },
        pfMembership: { enrolled: false, accountNumber: '', uan: '', enrollmentDate: '', accountType: '' },
        esiRegistration: { enrolled: false, number: '', enrollmentDate: '' },
        professionalTax: { applicable: false, state: '', ptNumber: '' },
        labourWelfareFund: { enrolled: false, enrollmentDate: '' },
        gratuity: { eligible: false, eligibilityDate: '' },
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

  const handleSaveEditedEmployee = async () => {
    if (!editEmployeeData || !editingEmployee) return;

    setSavingEdit(true);
    try {
      const updated = await employeeAPI.update(editingEmployee.id, {
        name: editEmployeeData.name,
        email: editEmployeeData.email,
        phone: editEmployeeData.phone,
        salary: editEmployeeData.salaryInfo?.currentCTC || editEmployeeData.salary,
        status: editEmployeeData.employmentInfo?.employmentStatus || editEmployeeData.status,
        joinDate: editEmployeeData.employmentInfo?.dateOfJoining || editEmployeeData.joinDate,
        department: editEmployeeData.employmentInfo?.department || editEmployeeData.department,
        designation: editEmployeeData.employmentInfo?.designation || editEmployeeData.designation,
        location: editEmployeeData.employmentInfo?.location || editEmployeeData.location,
        employmentType: editEmployeeData.employmentInfo?.employmentType || editEmployeeData.employmentType,
        personalInfo: editEmployeeData.personalInfo,
        employmentInfo: editEmployeeData.employmentInfo,
        jobHistory: editEmployeeData.jobHistory,
        salaryInfo: editEmployeeData.salaryInfo,
        statutoryInfo: editEmployeeData.statutoryInfo,
      });

      const updatedEmployee = createEmployeeObject({
        id: editingEmployee.id,
        employeeId: updated.employeeId,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        salary: updated.salary,
        status: updated.status,
        joinDate: updated.joinDate,
        department: updated.department,
        designation: updated.designation,
        location: updated.location,
        employmentType: updated.employmentType,
        personalInfo: updated.personalInfo || editEmployeeData.personalInfo,
        employmentInfo: updated.employmentInfo || editEmployeeData.employmentInfo,
        jobHistory: updated.jobHistory || editEmployeeData.jobHistory,
        salaryInfo: updated.salaryInfo || editEmployeeData.salaryInfo,
        statutoryInfo: updated.statutoryInfo || editEmployeeData.statutoryInfo,
      });

      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.id === editingEmployee.id ? updatedEmployee : emp
        )
      );
      if (selectedEmployee?.id === editingEmployee.id) {
        setSelectedEmployee(updatedEmployee);
      }
      setShowEditModal(false);
      setEditingEmployee(null);
      setEditEmployeeData(null);
      setActiveEditTab('personal');
      alert('Employee updated successfully!');
    } catch (err) {
      alert(`Failed to update employee: ${err.message}`);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleEditInputChange = (field, value, nestedPath = null) => {
    setEditEmployeeData(prev => {
      const newData = { ...prev };
      if (nestedPath) {
        const pathParts = nestedPath.split('.');
        let current = newData;
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {};
          }
          current = current[pathParts[i]];
        }
        const lastKey = pathParts[pathParts.length - 1];
        if (value === 'true' || value === 'false') {
          current[lastKey] = value === 'true';
        } else {
          current[lastKey] = value;
        }
      } else {
        newData[field] = value;
      }
      return newData;
    });
  };

  const handleEditArrayUpdate = (arrayPath, index, field, value) => {
    setEditEmployeeData(prev => {
      const newData = { ...prev };
      const pathParts = arrayPath.split('.');
      let current = newData;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      const arrayField = pathParts[pathParts.length - 1];
      if (!current[arrayField]) {
        current[arrayField] = [];
      }
      if (Array.isArray(current[arrayField]) && current[arrayField][index]) {
        const updatedArray = [...current[arrayField]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        current[arrayField] = updatedArray;
      }
      return newData;
    });
  };

  const handleEditAddToArray = (path, newItem) => {
    setEditEmployeeData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      if (!Array.isArray(current[lastKey])) {
        current[lastKey] = [];
      }
      current[lastKey] = [...current[lastKey], newItem];
      return newData;
    });
  };

  const handleEditRemoveFromArray = (arrayPath, index) => {
    setEditEmployeeData(prev => {
      const newData = { ...prev };
      const pathParts = arrayPath.split('.');
      let current = newData;
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      const arrayField = pathParts[pathParts.length - 1];
      if (Array.isArray(current[arrayField])) {
        const updatedArray = current[arrayField].filter((_, i) => i !== index);
        current[arrayField] = updatedArray;
      }
      return newData;
    });
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingEmployee(null);
    setEditEmployeeData(null);
    setActiveEditTab('personal');
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    const employeeData = JSON.parse(JSON.stringify(employee));
    const processedData = {
      id: employeeData.id,
      name: employeeData.name || '',
      email: employeeData.email || employeeData.employmentInfo?.workEmail || '',
      phone: employeeData.phone || employeeData.personalInfo?.phonePrimary || '',
      salary: employeeData.salary || employeeData.salaryInfo?.currentCTC || 0,
      department: employeeData.department || employeeData.employmentInfo?.department || '',
      designation: employeeData.designation || employeeData.employmentInfo?.designation || '',
      location: employeeData.location || employeeData.employmentInfo?.location || '',
      employmentType: employeeData.employmentType || employeeData.employmentInfo?.employmentType || 'Permanent',
      status: employeeData.status || employeeData.employmentInfo?.employmentStatus || 'Active',
      joinDate: employeeData.joinDate || employeeData.employmentInfo?.dateOfJoining || '',
      employeeId: employeeData.employeeId || employeeData.employmentInfo?.employeeId || '',
      personalInfo: employeeData.personalInfo || {},
      employmentInfo: employeeData.employmentInfo || {},
      jobHistory: employeeData.jobHistory || [],
      salaryInfo: employeeData.salaryInfo || {},
      statutoryInfo: employeeData.statutoryInfo || {}
    };
    setEditEmployeeData(processedData);
    setShowEditModal(true);
    setActiveEditTab('personal');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
          <Icon icon="heroicons:exclamation-triangle" className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 text-sm">{apiError}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 md:p-3 rounded-xl">
                <Icon icon="heroicons:user-group" className="text-blue-600 text-xl md:text-2xl" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Employee Master Data</h1>
                <p className="text-sm text-gray-500 mt-1 hidden sm:block">Manage all employee information, profiles, and employment details in one place.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={refreshData}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <StatCard title="Total Employees" value={kpis.totalEmployees} icon="heroicons:users" color="blue" />
          <StatCard title="Active Employees" value={kpis.activeEmployees} icon="heroicons:check-circle" color="green" />
          <StatCard title="Departments" value={kpis.departments} icon="heroicons:building-office" color="purple" />
          <StatCard title="Avg. Salary" value={formatCurrency(kpis.avgSalary)} icon="heroicons:currency-dollar" color="yellow" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="search"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search by name, email, or employee ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                >
                  <option value="All">All Departments</option>
                  {departments.slice(1).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    resetNewEmployeeForm();
                    setActiveAddTab('personal');
                    setShowAddModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                >
                  <Icon icon="heroicons:user-plus" className="text-lg" />
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Table or Detail View */}
        {!showDetailView ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Employee Records</h2>
                <div className="text-sm text-gray-500">
                  Showing {sortedData.length} employee{sortedData.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="w-full">
              {/* Desktop Header */}
              <div className="hidden lg:grid lg:grid-cols-12 bg-gray-50 border-b border-gray-100 px-6 py-3">
                <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 flex items-center gap-2" onClick={() => handleSort('name')}>
                  Employee <Icon icon={`heroicons:chevron-${sortConfig.key === 'name' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} className="w-4 h-4" />
                </div>
                <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 flex items-center gap-2" onClick={() => handleSort('department')}>
                  Department <Icon icon={`heroicons:chevron-${sortConfig.key === 'department' && sortConfig.direction === 'asc' ? 'up' : 'down'}`} className="w-4 h-4" />
                </div>
                <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</div>
                <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
                <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>

              {/* Employee List */}
              <div className="divide-y divide-gray-100 bg-white">
                {paginatedData.map((employee) => {
                  const empInfo = employee.employmentInfo || {};
                  const personalInfo = employee.personalInfo || {};
                  return (
                    <div key={employee.id} className="flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-0 px-4 py-4 lg:px-6 hover:bg-gray-50 transition-colors items-start lg:items-center">
                      
                      {/* Employee Info */}
                      <div className="col-span-4 flex items-center gap-3 w-full">
                        {personalInfo.profilePhoto ? (
                          <img
                            src={personalInfo.profilePhoto}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-500 font-medium text-sm">
                              {employee.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{employee.name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {empInfo.employeeId || employee.employeeId} • {empInfo.designation || employee.designation}
                          </div>
                        </div>
                      </div>

                      {/* Department */}
                      <div className="col-span-3 flex lg:block justify-between items-center w-full lg:w-auto mt-2 lg:mt-0">
                        <span className="lg:hidden text-xs font-medium text-gray-500 uppercase">Department</span>
                        <div className="text-right lg:text-left min-w-0">
                          <div className="text-sm text-gray-900 truncate">{empInfo.department || employee.department}</div>
                          <div className="text-xs text-gray-500 truncate">{empInfo.location || employee.location}</div>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="col-span-3 flex lg:block justify-between items-center w-full lg:w-auto">
                        <span className="lg:hidden text-xs font-medium text-gray-500 uppercase">Contact</span>
                        <div className="text-right lg:text-left min-w-0">
                          <div className="text-sm text-gray-900 truncate">{employee.email || empInfo.workEmail}</div>
                          <div className="text-xs text-gray-500 truncate">{employee.phone || personalInfo.phonePrimary}</div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-1 flex lg:block justify-between items-center w-full lg:w-auto">
                        <span className="lg:hidden text-xs font-medium text-gray-500 uppercase">Status</span>
                        <div>{getStatusBadge(empInfo.employmentStatus || employee.status)}</div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex lg:justify-end w-full lg:w-auto mt-3 lg:mt-0 pt-3 lg:pt-0 border-t border-gray-100 lg:border-t-0">
                        <div className="flex items-center justify-end w-full gap-3">
                          <button onClick={() => handleViewDetails(employee)} className="p-2 lg:p-0 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                            <Icon icon="heroicons:eye" className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleEditEmployee(employee)} className="p-2 lg:p-0 text-gray-400 hover:text-yellow-600 transition-colors" title="Edit Employee">
                            <Icon icon="heroicons:pencil-square" className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDeleteEmployee(employee.id)} className="p-2 lg:p-0 text-gray-400 hover:text-red-600 transition-colors" title="Delete Employee">
                            <Icon icon="heroicons:trash" className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {paginatedData.length === 0 && (
              <div className="text-center py-12">
                <Icon icon="heroicons:user-group" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
                <p className="text-gray-500 text-sm">No records found matching your search criteria.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500 order-2 sm:order-1">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} employees
                  </div>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        if (totalPages > 7 && (i < currentPage - 3 || i > currentPage + 1) && i !== 0 && i !== totalPages - 1) {
                          if (i === currentPage - 2 || i === currentPage + 2) {
                            return <span key={i} className="px-2 py-1 text-sm text-gray-500">...</span>;
                          }
                          return null;
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                              currentPage === i + 1
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          selectedEmployee && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {selectedEmployee.personalInfo?.profilePhoto ? (
                      <img
                        src={selectedEmployee.personalInfo.profilePhoto}
                        alt={selectedEmployee.name}
                        className="w-14 h-14 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Icon icon="heroicons:user" className="w-7 h-7" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedEmployee.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {(selectedEmployee.employmentInfo || {}).employeeId || selectedEmployee.employeeId} • {(selectedEmployee.employmentInfo || {}).designation || selectedEmployee.designation}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleBackToList}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
                  >
                    <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
                    Back to List
                  </button>
                </div>
              </div>

              <div className="border-b border-gray-200 overflow-x-auto">
                <div className="flex px-4 gap-1 min-w-max">
                  <button
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeDetailTab === 'personal' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveDetailTab('personal')}
                  >
                    <Icon icon="heroicons:user-circle" className="w-5 h-5" />
                    Personal Info
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeDetailTab === 'employment' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveDetailTab('employment')}
                  >
                    <Icon icon="heroicons:briefcase" className="w-5 h-5" />
                    Employment
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeDetailTab === 'jobHistory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveDetailTab('jobHistory')}
                  >
                    <Icon icon="heroicons:clock" className="w-5 h-5" />
                    Service History
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeDetailTab === 'salary' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveDetailTab('salary')}
                  >
                    <Icon icon="heroicons:currency-dollar" className="w-5 h-5" />
                    Salary & Compensation
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeDetailTab === 'statutory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    onClick={() => setActiveDetailTab('statutory')}
                  >
                    <Icon icon="heroicons:document-check" className="w-5 h-5" />
                    Statutory & Compliance
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeDetailTab === 'personal' && <PersonalInfoTab employee={selectedEmployee} formatDate={formatDate} />}
                {activeDetailTab === 'employment' && <EmploymentInfoTab employee={selectedEmployee} formatDate={formatDate} getStatusBadge={getStatusBadge} getEmploymentTypeBadge={getEmploymentTypeBadge} />}
                {activeDetailTab === 'jobHistory' && <JobHistoryTab employee={selectedEmployee} formatDate={formatDate} />}
                {activeDetailTab === 'salary' && <SalaryInfoTab employee={selectedEmployee} formatCurrency={formatCurrency} formatDate={formatDate} />}
                {activeDetailTab === 'statutory' && <StatutoryInfoTab employee={selectedEmployee} formatDate={formatDate} />}
              </div>
            </div>
          )
        )}
      </div>

      <AddEmployeeModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        activeAddTab={activeAddTab}
        setActiveAddTab={setActiveAddTab}
        newEmployee={newEmployee}
        setNewEmployee={setNewEmployee}
        handleAddEmployee={handleAddEmployee}
        employees={employees}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />

      <EditEmployeeModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        activeEditTab={activeEditTab}
        setActiveEditTab={setActiveEditTab}
        editEmployeeData={editEmployeeData}
        setEditEmployeeData={setEditEmployeeData}
        handleEditInputChange={handleEditInputChange}
        handleEditArrayUpdate={handleEditArrayUpdate}
        handleEditAddToArray={handleEditAddToArray}
        handleEditRemoveFromArray={handleEditRemoveFromArray}
        handleSaveEdit={handleSaveEditedEmployee}
        handleCancelEdit={handleCancelEdit}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default AllEmployees;