import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const PayrollProcessingEngine = () => {
  const [activeSection, setActiveSection] = useState('configuration');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showVarianceModal, setShowVarianceModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showHoldSalaryModal, setShowHoldSalaryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [newSalaryComponent, setNewSalaryComponent] = useState({
    name: '',
    type: 'earnings',
    calculation: 'fixed',
    value: '',
    taxable: true
  });
  const [editComponentId, setEditComponentId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Payroll Configuration State
  const [payrollConfig, setPayrollConfig] = useState({
    cycleType: 'monthly',
    payPeriod: 'standard_month',
    customStartDate: '',
    customEndDate: '',
    salaryFreezeDate: '',
    payrollSchedule: {
      processingDay: 25,
      paymentDay: 30
    },
    payrollCalendar: [],
    advanceScheduling: {
      enabled: false,
      advanceDays: 7
    },
    offCycleEnabled: true,
    salesConfig: {
      commissionEnabled: true,
      commissionRate: 5,
      bonusThreshold: 100000
    },
    statutorySettings: {
      taxEnabled: true,
      epfEnabled: true,
      esiEnabled: true,
      tdsEnabled: true
    }
  });

  // Payroll Run State
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [currentPayrollRun, setCurrentPayrollRun] = useState(null);
  const [validationResults, setValidationResults] = useState([]);
  const [calculationResults, setCalculationResults] = useState([]);
  const [payrollLocked, setPayrollLocked] = useState(false);

  // Payroll Data
  const [employees, setEmployees] = useState([]);
  const [salaryComponents, setSalaryComponents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [arrearsData, setArrearsData] = useState([]);
  const [heldEmployees, setHeldEmployees] = useState([]);
  const [salaryRevisions, setSalaryRevisions] = useState([]);
  const [previousMonthPayroll, setPreviousMonthPayroll] = useState(null);
  const [varianceAlerts, setVarianceAlerts] = useState([]);
  const [manualInterventions, setManualInterventions] = useState([]);

  // Review & Approval
  const [approvalWorkflow, setApprovalWorkflow] = useState([]);

  // Settings for calculations
  const [calculationSettings, setCalculationSettings] = useState({
    daysCalculation: true,
    daysCalculationMethod: 'days_worked', // 'days_worked' or 'days_in_month'
    prorateCalculation: true,
    prorateForJoiners: true,
    prorateForExits: true,
    prorateForTransfers: true,
    leaveEncashment: false,
    leaveEncashmentRate: 1.0,
    overtimeCalculation: true,
    overtimeRate: 1.5,
    lossOfPayCalculation: true,
    lossOfPayThreshold: 0.5, // days
    arrearsCalculation: true,
    arrearsInclusion: 'previous_month', // 'previous_month', 'all_pending', 'custom'
    reimbursementProcessing: true,
    loanRecovery: true,
    advanceRecovery: true,
    finalSettlement: true,
    componentDependencies: true,
    taxDependencies: true,
    statutoryDependencies: true,
    salaryRevisionEffectuation: true
  });

  const itemsPerPage = 6;

  // Calculate KPIs
  const kpis = useMemo(() => {
    const pendingApprovals = approvalWorkflow.filter(a => a.status === 'pending').length;
    const failedValidations = validationResults.filter(v => v.status === 'failed').length;
    const completedRuns = payrollRuns.filter(r => r.status === 'completed').length;
    const inProgressRuns = payrollRuns.filter(r => r.status === 'processing').length;
    
    return {
      pendingApprovals,
      failedValidations,
      completedRuns,
      inProgressRuns,
      totalEmployees: employees.length,
      totalAmount: payrollRuns.reduce((sum, run) => sum + (run.totalAmount || 0), 0)
    };
  }, [approvalWorkflow, validationResults, payrollRuns, employees]);

  // Filter data based on search and type
  const getFilteredData = () => {
    let data = [];
    switch(activeSection) {
      case 'runs':
        data = payrollRuns.filter(item => 
          item.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'validation':
        data = validationResults.filter(item => 
          item.checkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'approvals':
        data = approvalWorkflow.filter(item => 
          item.approver.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.payrollId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'employees':
        data = employees.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      default:
        data = [];
    }
    return data;
  };

  // Pagination
  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Initial data loading
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Payroll runs data
    setPayrollRuns([
      { 
        id: 'PAY001', 
        month: 'March 2024', 
        status: 'completed', 
        totalAmount: 1250000,
        employeesCount: 85,
        processedDate: '2024-03-25',
        paidDate: '2024-03-30',
        type: 'regular',
        details: {
          totalEarnings: 1500000,
          totalDeductions: 250000,
          taxAmount: 150000,
          pfAmount: 75000,
          esiAmount: 25000
        }
      },
      { 
        id: 'PAY002', 
        month: 'February 2024', 
        status: 'completed', 
        totalAmount: 1200000,
        employeesCount: 83,
        processedDate: '2024-02-25',
        paidDate: '2024-02-28',
        type: 'regular',
        details: {
          totalEarnings: 1450000,
          totalDeductions: 250000,
          taxAmount: 140000,
          pfAmount: 70000,
          esiAmount: 25000
        }
      },
      { 
        id: 'PAY003', 
        month: 'March 2024 Bonus', 
        status: 'completed', 
        totalAmount: 250000,
        employeesCount: 42,
        processedDate: '2024-03-20',
        paidDate: '2024-03-25',
        type: 'off-cycle',
        details: {
          totalEarnings: 250000,
          totalDeductions: 0,
          taxAmount: 37500,
          pfAmount: 0,
          esiAmount: 0
        }
      },
      { 
        id: 'PAY004', 
        month: 'April 2024', 
        status: 'processing', 
        totalAmount: 0,
        employeesCount: 87,
        processedDate: '',
        paidDate: '',
        type: 'regular',
        details: {
          totalEarnings: 0,
          totalDeductions: 0,
          taxAmount: 0,
          pfAmount: 0,
          esiAmount: 0
        }
      },
      { 
        id: 'PAY005', 
        month: 'January 2024', 
        status: 'completed', 
        totalAmount: 1180000,
        employeesCount: 80,
        processedDate: '2024-01-25',
        paidDate: '2024-01-30',
        type: 'regular',
        details: {
          totalEarnings: 1420000,
          totalDeductions: 240000,
          taxAmount: 135000,
          pfAmount: 68000,
          esiAmount: 24000
        }
      }
    ]);

    // Validation results
    setValidationResults([
      { id: 1, checkName: 'Attendance Data Complete', status: 'passed', description: 'All attendance records verified', details: 'Verified 87 employee records', severity: 'low' },
      { id: 2, checkName: 'Bank Account Validation', status: 'passed', description: 'All bank accounts are valid', details: 'All 87 accounts validated successfully', severity: 'low' },
      { id: 3, checkName: 'Tax Calculation Check', status: 'failed', description: 'Tax calculation mismatch for 2 employees', details: 'EMP003 and EMP007 have incorrect tax calculations', severity: 'high' },
      { id: 4, checkName: 'Leave Balance Verification', status: 'passed', description: 'Leave balances updated', details: 'Leave balances synchronized with HR system', severity: 'medium' },
      { id: 5, checkName: 'Statutory Compliance', status: 'warning', description: 'PF contribution needs verification', details: 'PF rates for 3 employees need confirmation', severity: 'medium' }
    ]);

    // Employees data
    setEmployees([
      { id: 'EMP001', name: 'John Smith', department: 'Engineering', baseSalary: 85000, employmentType: 'Full-time', status: 'Active', email: 'john.smith@company.com', joinDate: '2022-03-15', bankAccount: 'XXXX-XXXX-1234' },
      { id: 'EMP002', name: 'Sarah Johnson', department: 'Marketing', baseSalary: 75000, employmentType: 'Full-time', status: 'Active', email: 'sarah.j@company.com', joinDate: '2021-08-22', bankAccount: 'XXXX-XXXX-5678' },
      { id: 'EMP003', name: 'Mike Chen', department: 'Sales', baseSalary: 65000, employmentType: 'Full-time', status: 'Active', email: 'mike.chen@company.com', joinDate: '2023-01-10', bankAccount: 'XXXX-XXXX-9012' },
      { id: 'EMP004', name: 'Emily Davis', department: 'HR', baseSalary: 70000, employmentType: 'Full-time', status: 'Active', email: 'emily.davis@company.com', joinDate: '2020-11-05', bankAccount: 'XXXX-XXXX-3456' },
      { id: 'EMP005', name: 'David Wilson', department: 'Finance', baseSalary: 90000, employmentType: 'Full-time', status: 'Active', email: 'david.wilson@company.com', joinDate: '2019-06-18', bankAccount: 'XXXX-XXXX-7890' },
      { id: 'EMP006', name: 'Lisa Brown', department: 'Engineering', baseSalary: 80000, employmentType: 'Contract', status: 'Active', email: 'lisa.brown@company.com', joinDate: '2023-04-30', bankAccount: 'XXXX-XXXX-2345' }
    ]);

    // Salary components
    setSalaryComponents([
      { id: 1, name: 'Basic Salary', type: 'earnings', calculation: 'percentage', value: 50, taxable: true, description: 'Basic salary component' },
      { id: 2, name: 'House Rent Allowance', type: 'earnings', calculation: 'percentage', value: 40, taxable: true, description: 'House rent allowance' },
      { id: 3, name: 'Conveyance Allowance', type: 'earnings', calculation: 'fixed', value: 1600, taxable: false, description: 'Conveyance allowance' },
      { id: 4, name: 'Medical Allowance', type: 'earnings', calculation: 'fixed', value: 1250, taxable: false, description: 'Medical reimbursement' },
      { id: 5, name: 'Provident Fund', type: 'deductions', calculation: 'percentage', value: 12, taxable: false, description: 'Employee PF contribution' },
      { id: 6, name: 'Professional Tax', type: 'deductions', calculation: 'fixed', value: 200, taxable: false, description: 'Professional tax deduction' }
    ]);

    // Approval workflow
    setApprovalWorkflow([
      { id: 1, payrollId: 'PAY004', approver: 'Finance Manager', role: 'Finance', status: 'pending', submittedDate: '2024-04-20', comments: 'Awaiting review' },
      { id: 2, payrollId: 'PAY004', approver: 'HR Director', role: 'HR', status: 'pending', submittedDate: '2024-04-20', comments: 'Awaiting HR approval' },
      { id: 3, payrollId: 'PAY003', approver: 'Finance Manager', role: 'Finance', status: 'approved', submittedDate: '2024-03-20', approvedDate: '2024-03-22', comments: 'Approved with no changes' },
      { id: 4, payrollId: 'PAY003', approver: 'HR Director', role: 'HR', status: 'approved', submittedDate: '2024-03-20', approvedDate: '2024-03-22', comments: 'All clear' }
    ]);

    // Calculation results
    setCalculationResults([
      { employeeId: 'EMP001', name: 'John Smith', basic: 42500, allowances: 34000, deductions: 8500, netSalary: 68000, status: 'calculated', tax: 8500, pf: 5100, esi: 1200 },
      { employeeId: 'EMP002', name: 'Sarah Johnson', basic: 37500, allowances: 30000, deductions: 7500, netSalary: 60000, status: 'calculated', tax: 7500, pf: 4500, esi: 1100 },
      { employeeId: 'EMP003', name: 'Mike Chen', basic: 32500, allowances: 26000, deductions: 6500, netSalary: 52000, status: 'calculated', tax: 6500, pf: 3900, esi: 950 },
      { employeeId: 'EMP004', name: 'Emily Davis', basic: 35000, allowances: 28000, deductions: 7000, netSalary: 56000, status: 'calculated', tax: 7000, pf: 4200, esi: 1050 },
      { employeeId: 'EMP005', name: 'David Wilson', basic: 45000, allowances: 36000, deductions: 9000, netSalary: 72000, status: 'calculated', tax: 9000, pf: 5400, esi: 1350 }
    ]);

    // Attendance data
    setAttendanceData([
      { employeeId: 'EMP001', month: 'March 2024', daysPresent: 22, daysAbsent: 0, daysLate: 2, totalHours: 176, overtimeHours: 8 },
      { employeeId: 'EMP002', month: 'March 2024', daysPresent: 20, daysAbsent: 2, daysLate: 1, totalHours: 160, overtimeHours: 4 },
      { employeeId: 'EMP003', month: 'March 2024', daysPresent: 21, daysAbsent: 1, daysLate: 0, totalHours: 168, overtimeHours: 12 }
    ]);

    // Leave data
    setLeaveData([
      { employeeId: 'EMP001', leaveType: 'Annual Leave', daysTaken: 3, balance: 12 },
      { employeeId: 'EMP002', leaveType: 'Sick Leave', daysTaken: 2, balance: 8 },
      { employeeId: 'EMP003', leaveType: 'Annual Leave', daysTaken: 5, balance: 7 }
    ]);

    // Loan data
    setLoanData([
      { employeeId: 'EMP001', loanType: 'Personal Loan', amount: 50000, emi: 5000, balance: 30000 },
      { employeeId: 'EMP002', loanType: 'Vehicle Loan', amount: 200000, emi: 10000, balance: 150000 }
    ]);

    // Reimbursements
    setReimbursements([
      { employeeId: 'EMP001', type: 'Medical', amount: 2500, date: '2024-03-15', status: 'approved' },
      { employeeId: 'EMP002', type: 'Travel', amount: 1800, date: '2024-03-20', status: 'pending' }
    ]);

    setIsLoading(false);
  };

  // Status badge functions
  const getStatusBadge = (status) => {
    const styles = {
      'completed': 'bg-success-subtle text-success',
      'processing': 'bg-warning-subtle text-warning',
      'pending': 'bg-info-subtle text-info',
      'failed': 'bg-danger-subtle text-danger',
      'passed': 'bg-success-subtle text-success',
      'warning': 'bg-warning-subtle text-warning',
      'approved': 'bg-success-subtle text-success',
      'rejected': 'bg-danger-subtle text-danger',
      'locked': 'bg-dark-subtle text-dark',
      'unlocked': 'bg-success-subtle text-success',
      'calculated': 'bg-success-subtle text-success'
    };

    return (
      <span className={`badge ${styles[status] || 'bg-secondary-subtle text-secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      'regular': 'bg-primary-subtle text-primary',
      'off-cycle': 'bg-info-subtle text-info',
      'bonus': 'bg-success-subtle text-success',
      'advance': 'bg-warning-subtle text-warning',
      'settlement': 'bg-danger-subtle text-danger'
    };

    return (
      <span className={`badge ${styles[type] || 'bg-secondary-subtle text-secondary'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
      </span>
    );
  };

  // Format functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
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

  // Action handlers
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleRunPayroll = () => {
    if (payrollLocked) {
      alert('Payroll is locked. Please unlock to run payroll.');
      return;
    }
    setShowRunModal(true);
  };

  const handleStartPayrollProcessing = async (type = 'regular') => {
    if (payrollLocked) {
      alert('Payroll is locked. Please unlock to run payroll.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate automated payroll processing
    setTimeout(() => {
      // Step 1: Auto-fetch attendance data
      console.log('Auto-fetching attendance data...');
      // In real implementation, this would fetch from attendance system
      
      // Step 2: Auto-integrate leave data
      console.log('Auto-integrating leave data...');
      // In real implementation, this would fetch from leave management system
      
      // Step 3: Include previous month arrears
      let arrearsTotal = 0;
      if (calculationSettings.arrearsCalculation) {
        arrearsTotal = arrearsData
          .filter(a => a.status === 'pending')
          .reduce((sum, a) => sum + a.amount, 0);
      }
      
      // Step 4: Calculate loan EMI deductions
      let loanEMITotal = 0;
      if (calculationSettings.loanRecovery) {
        loanEMITotal = loanData.reduce((sum, loan) => sum + loan.emi, 0);
      }
      
      // Step 5: Calculate advance recovery
      let advanceRecoveryTotal = 0;
      if (calculationSettings.advanceRecovery) {
        // Simulated advance recovery
        advanceRecoveryTotal = employees.length * 1000; // Example
      }
      
      // Step 6: Apply salary revisions
      if (calculationSettings.salaryRevisionEffectuation) {
        salaryRevisions
          .filter(rev => rev.status === 'pending')
          .forEach(rev => {
            const emp = employees.find(e => e.id === rev.employeeId);
            if (emp) {
              emp.baseSalary = rev.newSalary;
            }
          });
      }
      
      // Step 7: Exclude held employees
      const activeEmployees = employees.filter(emp => 
        !heldEmployees.some(held => held.employeeId === emp.id)
      );
      
      // Calculate total amount based on employees and type
      let totalAmount = 0;
      let employeesCount = activeEmployees.length;
      
      if (type === 'bonus') {
        // Calculate bonus based on sales config
        totalAmount = activeEmployees.reduce((sum, emp) => {
          return sum + Math.floor(emp.baseSalary * (payrollConfig.salesConfig.commissionRate / 100));
        }, 0);
        employeesCount = activeEmployees.filter(emp => emp.department === 'Sales').length;
      } else if (type === 'regular') {
        // Calculate regular payroll with all components
        totalAmount = activeEmployees.reduce((sum, emp) => {
          let empTotal = emp.baseSalary;
          // Add arrears if applicable
          const empArrears = arrearsData
            .filter(a => a.employeeId === emp.id && a.status === 'pending')
            .reduce((s, a) => s + a.amount, 0);
          empTotal += empArrears;
          return sum + empTotal;
        }, 0);
      } else if (type === 'advance') {
        // Calculate advance (50% of base salary)
        totalAmount = activeEmployees.reduce((sum, emp) => {
          return sum + Math.floor(emp.baseSalary * 0.5);
        }, 0);
      }

      const newRun = {
        id: `PAY${String(payrollRuns.length + 1).padStart(3, '0')}`,
        month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        status: 'processing',
        totalAmount: totalAmount,
        employeesCount: employeesCount,
        processedDate: new Date().toISOString().split('T')[0],
        paidDate: '',
        type: type,
        details: {
          totalEarnings: totalAmount + arrearsTotal,
          totalDeductions: Math.floor(totalAmount * 0.15) + loanEMITotal + advanceRecoveryTotal,
          taxAmount: Math.floor(totalAmount * 0.1),
          pfAmount: Math.floor(totalAmount * 0.12),
          esiAmount: Math.floor(totalAmount * 0.03),
          arrearsIncluded: arrearsTotal,
          loanEMI: loanEMITotal,
          advanceRecovery: advanceRecoveryTotal,
          heldEmployeesCount: heldEmployees.length
        }
      };
      
      setPayrollRuns([newRun, ...payrollRuns]);
      setCurrentPayrollRun(newRun);
      setShowRunModal(false);
      setIsProcessing(false);
      
      // Add to approval workflow
      const newApproval = {
        id: approvalWorkflow.length + 1,
        payrollId: newRun.id,
        approver: 'Finance Manager',
        role: 'Finance',
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
        comments: 'Awaiting review'
      };
      
      setApprovalWorkflow([newApproval, ...approvalWorkflow]);
      
      // Run pre-payroll validation
      runValidationChecks();
      
      // Compare with previous month and generate variance alerts
      if (previousMonthPayroll) {
        const variance = ((totalAmount - previousMonthPayroll.totalAmount) / previousMonthPayroll.totalAmount) * 100;
        if (Math.abs(variance) > 5) {
          setVarianceAlerts(prev => [...prev, {
            employeeId: 'ALL',
            type: variance > 0 ? 'increase' : 'decrease',
            amount: totalAmount - previousMonthPayroll.totalAmount,
            percentage: variance,
            reason: 'Overall payroll variance',
            severity: Math.abs(variance) > 10 ? 'high' : 'warning'
          }]);
        }
      }
      
      alert(`Payroll ${type} run started successfully! Processing will complete shortly.`);
    }, 2000);
  };

  const runValidationChecks = () => {
    const newValidationResults = [
      { id: validationResults.length + 1, checkName: 'Payroll Run Validation', status: 'processing', description: 'Validating new payroll run', details: 'In progress', severity: 'medium' },
      { id: validationResults.length + 2, checkName: 'Employee Data Sync', status: 'passed', description: 'Employee data synchronized', details: 'All employee records up to date', severity: 'low' },
      { id: validationResults.length + 3, checkName: 'Bank Account Verification', status: 'warning', description: 'Bank account verification pending', details: '2 accounts need re-verification', severity: 'medium' }
    ];
    
    setValidationResults([...newValidationResults, ...validationResults]);
  };

  const handleApprovePayroll = (approvalId) => {
    const updatedApprovals = approvalWorkflow.map(approval =>
      approval.id === approvalId 
        ? { 
            ...approval, 
            status: 'approved', 
            approvedDate: new Date().toISOString().split('T')[0],
            comments: 'Approved by ' + userInfo.name
          }
        : approval
    );
    setApprovalWorkflow(updatedApprovals);
    
    // If all approvals are done, update payroll run status
    const approval = approvalWorkflow.find(a => a.id === approvalId);
    if (approval) {
      const relatedApprovals = approvalWorkflow.filter(a => a.payrollId === approval.payrollId);
      const allApproved = relatedApprovals.every(a => a.status === 'approved');
      
      if (allApproved) {
        setPayrollRuns(runs => 
          runs.map(run => 
            run.id === approval.payrollId 
              ? { ...run, status: 'completed', paidDate: new Date().toISOString().split('T')[0] }
              : run
          )
        );
      }
    }
    
    alert('Payroll approved successfully!');
  };

  const handleRejectPayroll = (approvalId) => {
    const comment = prompt('Please enter rejection reason:');
    if (!comment) return;
    
    const updatedApprovals = approvalWorkflow.map(approval =>
      approval.id === approvalId 
        ? { 
            ...approval, 
            status: 'rejected', 
            rejectedDate: new Date().toISOString().split('T')[0],
            comments: comment
          }
        : approval
    );
    setApprovalWorkflow(updatedApprovals);
    alert('Payroll rejected!');
  };

  const handleTogglePayrollLock = () => {
    const newLockedState = !payrollLocked;
    setPayrollLocked(newLockedState);
    alert(`Payroll ${newLockedState ? 'locked' : 'unlocked'} successfully!`);
  };

  const handleUpdateConfig =   (key, value) => {
    if (payrollLocked) {
      alert('Payroll is locked. Please unlock to make changes.');
      return;
    }
    
    setPayrollConfig(prev => {
      if (key.includes('.')) {
        const keys = key.split('.');
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value
          }
        };
      }
      return {
        ...prev,
        [key]: value
      };
    });
  };

  const handleExportReport = () => {
    let csvData = [];
    let headers = [];
    let filename = '';
    
    switch(activeSection) {
      case 'runs':
        headers = ['ID', 'Month', 'Status', 'Total Amount', 'Employees Count', 'Processed Date', 'Paid Date', 'Type'];
        csvData = payrollRuns.map(run => [
          run.id, 
          run.month, 
          run.status, 
          formatCurrency(run.totalAmount), 
          run.employeesCount, 
          run.processedDate, 
          run.paidDate, 
          run.type
        ]);
        filename = 'payroll_runs_export';
        break;
      case 'validation':
        headers = ['Check Name', 'Status', 'Description', 'Details'];
        csvData = validationResults.map(v => [v.checkName, v.status, v.description, v.details || '']);
        filename = 'validation_results_export';
        break;
      case 'calculations':
        headers = ['Employee ID', 'Name', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Tax', 'PF', 'ESI'];
        csvData = calculationResults.map(c => [
          c.employeeId, 
          c.name, 
          formatCurrency(c.basic), 
          formatCurrency(c.allowances), 
          formatCurrency(c.deductions), 
          formatCurrency(c.netSalary), 
          c.status,
          formatCurrency(c.tax),
          formatCurrency(c.pf),
          formatCurrency(c.esi)
        ]);
        filename = 'calculation_results_export';
        break;
      case 'employees':
        headers = ['Employee ID', 'Name', 'Department', 'Base Salary', 'Employment Type', 'Status', 'Email', 'Join Date'];
        csvData = employees.map(e => [
          e.id, 
          e.name, 
          e.department, 
          formatCurrency(e.baseSalary), 
          e.employmentType, 
          e.status,
          e.email || '',
          e.joinDate || ''
        ]);
        filename = 'employee_data_export';
        break;
      default:
        headers = ['Data', 'Export'];
        csvData = [['No data to export']];
        filename = 'payroll_export';
    }
    
    const csvContent = [headers, ...csvData].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert(`Report exported successfully as ${filename}.csv`);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadInitialData();
      setCurrentPage(1);
      setSearchTerm('');
      setFilterType('All');
      alert('Payroll data refreshed successfully!');
    }, 1000);
  };

  const handleAddSalaryComponent = () => {
    if (!newSalaryComponent.name || !newSalaryComponent.value) {
      alert('Please fill all required fields');
      return;
    }

    if (editComponentId) {
      // Edit existing component
      setSalaryComponents(components =>
        components.map(comp =>
          comp.id === editComponentId
            ? { ...newSalaryComponent, id: editComponentId }
            : comp
        )
      );
      alert('Salary component updated successfully!');
    } else {
      // Add new component
      const newComponent = {
        ...newSalaryComponent,
        id: salaryComponents.length + 1
      };
      setSalaryComponents([...salaryComponents, newComponent]);
      alert('Salary component added successfully!');
    }

    // Reset form
    setNewSalaryComponent({
      name: '',
      type: 'earnings',
      calculation: 'fixed',
      value: '',
      taxable: true
    });
    setEditComponentId(null);
    setShowConfigModal(false);
  };

  const handleEditSalaryComponent = (component) => {
    setNewSalaryComponent({
      name: component.name,
      type: component.type,
      calculation: component.calculation,
      value: component.value,
      taxable: component.taxable
    });
    setEditComponentId(component.id);
    setShowConfigModal(true);
  };

  const handleDeleteSalaryComponent = (id) => {
    if (window.confirm('Are you sure you want to delete this salary component?')) {
      setSalaryComponents(components => components.filter(comp => comp.id !== id));
      alert('Salary component deleted successfully!');
    }
  };

  const handleViewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleAdjustEmployeeSalary = (employee) => {
    const newSalary = prompt(`Enter new base salary for ${employee.name}:`, employee.baseSalary);
    if (newSalary && !isNaN(newSalary)) {
      const updatedEmployees = employees.map(emp =>
        emp.id === employee.id
          ? { ...emp, baseSalary: parseInt(newSalary) }
          : emp
      );
      setEmployees(updatedEmployees);
      alert('Employee salary updated successfully!');
    }
  };

  const handleRunCalculations = () => {
    setIsProcessing(true);
    
    // Simulate calculation process
    setTimeout(() => {
      const newCalculationResults = employees.map(employee => {
        const base = employee.baseSalary;
        const basic = Math.floor(base * 0.5);
        const allowances = Math.floor(base * 0.4);
        const deductions = Math.floor(base * 0.1);
        const tax = Math.floor(base * 0.1);
        const pf = Math.floor(base * 0.12);
        const esi = Math.floor(base * 0.03);
        const netSalary = base - (tax + pf + esi);
        
        return {
          employeeId: employee.id,
          name: employee.name,
          basic,
          allowances,
          deductions,
          netSalary,
          status: 'calculated',
          tax,
          pf,
          esi
        };
      });
      
      setCalculationResults(newCalculationResults);
      setIsProcessing(false);
      
      // Add validation check for calculations
      const newValidation = {
        id: validationResults.length + 1,
        checkName: 'Payroll Calculations',
        status: 'passed',
        description: 'Payroll calculations completed successfully',
        details: `Calculated for ${employees.length} employees`,
        severity: 'low'
      };
      
      setValidationResults([newValidation, ...validationResults]);
      
      alert('Payroll calculations completed successfully!');
    }, 1500);
  };

  const handleToggleCalculationSetting = (setting) => {
    setCalculationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleImportData = (type) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx,.xls';
    
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simulate file processing
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          alert(`${type} data imported successfully from ${file.name}`);
          
          // Add validation check
          const newValidation = {
            id: validationResults.length + 1,
            checkName: `${type} Data Import`,
            status: 'passed',
            description: `${type} data imported successfully`,
            details: `Imported from: ${file.name}`,
            severity: 'low'
          };
          
          setValidationResults([newValidation, ...validationResults]);
        }, 2000);
      }
    };
    
    fileInput.click();
  };

  const handleGenerateReport = (reportType) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      
      // Simulate report generation
      const reportData = {
        'Monthly Payroll Summary': payrollRuns.filter(r => r.status === 'completed'),
        'Tax Compliance Report': calculationResults,
        'Department-wise Analysis': employees.reduce((acc, emp) => {
          acc[emp.department] = (acc[emp.department] || 0) + emp.baseSalary;
          return acc;
        }, {}),
        'Employee Earnings Statement': calculationResults,
        'Statutory Compliance Report': payrollRuns.map(run => ({
          ...run,
          pfAmount: run.details?.pfAmount || 0,
          esiAmount: run.details?.esiAmount || 0,
          taxAmount: run.details?.taxAmount || 0
        })),
        'Year-to-Date Analysis': payrollRuns
      };
      
      console.log(`Generated ${reportType}:`, reportData[reportType]);
      alert(`${reportType} generated successfully! Check console for data.`);
      
      // Add to exports
      handleExportReport();
    }, 1500);
  };

  // Sidebar content
  const sidebarContent = (
    <nav className="space-y-1 p-3">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Payroll Engine
      </div>
      
      <button 
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'configuration' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('configuration')}
      >
        <Icon icon="heroicons:cog" className="mr-3 h-5 w-5" />
        Configuration
      </button>
      
      <button 
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'runs' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('runs')}
      >
        <Icon icon="heroicons:play-circle" className="mr-3 h-5 w-5" />
        Payroll Runs
        {kpis.inProgressRuns > 0 && (
          <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium bg-warning-100 text-warning-800 rounded-full">
            {kpis.inProgressRuns}
          </span>
        )}
      </button>
      
      <button 
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'validation' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('validation')}
      >
        <Icon icon="heroicons:shield-check" className="mr-3 h-5 w-5" />
        Validation
        {kpis.failedValidations > 0 && (
          <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium bg-danger-100 text-danger-800 rounded-full">
            {kpis.failedValidations}
          </span>
        )}
      </button>
      
      <button 
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'calculations' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('calculations')}
      >
        <Icon icon="heroicons:calculator" className="mr-3 h-5 w-5" />
        Calculations
      </button>
      
      <button 
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'approvals' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('approvals')}
      >
        <Icon icon="heroicons:document-check" className="mr-3 h-5 w-5" />
        Approvals
        {kpis.pendingApprovals > 0 && (
          <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium bg-info-100 text-info-800 rounded-full">
            {kpis.pendingApprovals}
          </span>
        )}
      </button>
      
      <button 
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'employees' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('employees')}
      >
        <Icon icon="heroicons:users" className="mr-3 h-5 w-5" />
        Employee Data
      </button>
      
      <button 
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'reports' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('reports')}
      >
        <Icon icon="heroicons:chart-bar" className="mr-3 h-5 w-5" />
        Reports & Analytics
      </button>
      
      <div className="pt-4 border-t border-gray-200 mt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Payroll Status
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Employees:</span>
            <span className="font-semibold text-primary">{kpis.totalEmployees}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Pending Approvals:</span>
            <span className="font-semibold text-warning">{kpis.pendingApprovals}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Failed Validations:</span>
            <span className="font-semibold text-danger">{kpis.failedValidations}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Last Month Total:</span>
            <span className="font-semibold text-success">{formatCurrency(kpis.totalAmount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payroll Status:</span>
            <span className={`font-semibold ${payrollLocked ? 'text-danger' : 'text-success'}`}>
              {payrollLocked ? 'Locked' : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );

  // User info for sidebar
  const userInfo = {
    name: 'Payroll Admin',
    role: 'Payroll Manager',
    email: 'payroll@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Payroll'
  };

  // Render different sections
  const renderConfiguration = () => (
    <div className="row g-4">
      {/* Configuration Header */}
      <div className="col-12">
        <div className="card border shadow-none">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-1">Payroll Cycle Configuration</h5>
                <p className="text-muted mb-0">Configure payroll cycles, schedules, and settings</p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <button 
                  className={`btn ${payrollLocked ? 'btn-success' : 'btn-danger'} d-flex align-items-center`}
                  onClick={handleTogglePayrollLock}
                >
                  <Icon icon={payrollLocked ? "heroicons:lock-open" : "heroicons:lock-closed"} className="me-2" />
                  {payrollLocked ? 'Unlock Payroll' : 'Lock Payroll'}
                </button>
                <button className="btn btn-primary d-flex align-items-center" onClick={handleExportReport}>
                  <Icon icon="heroicons:arrow-down-tray" className="me-2" />
                  Export Config
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Cycle Settings */}
      <div className="col-md-6">
        <div className="card border shadow-none h-100">
          <div className="card-header bg-transparent border-0">
            <h6 className="mb-0">Payroll Cycle Settings</h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Cycle Type</label>
                <select 
                  className="form-select"
                  value={payrollConfig.cycleType}
                  onChange={(e) => handleUpdateConfig('cycleType', e.target.value)}
                  disabled={payrollLocked}
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="semi-monthly">Semi-monthly</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Pay Period</label>
                <select 
                  className="form-select"
                  value={payrollConfig.payPeriod}
                  onChange={(e) => handleUpdateConfig('payPeriod', e.target.value)}
                  disabled={payrollLocked}
                >
                  <option value="standard_month">Standard Month (1st - Last)</option>
                  <option value="calendar_month">Calendar Month</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>
              
              {payrollConfig.payPeriod === 'custom' && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Start Date</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={payrollConfig.customStartDate}
                      onChange={(e) => handleUpdateConfig('customStartDate', e.target.value)}
                      disabled={payrollLocked}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">End Date</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={payrollConfig.customEndDate}
                      onChange={(e) => handleUpdateConfig('customEndDate', e.target.value)}
                      disabled={payrollLocked}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Schedule */}
      <div className="col-md-6">
        <div className="card border shadow-none h-100">
          <div className="card-header bg-transparent border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Payroll Schedule</h6>
              <button 
                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                onClick={() => setShowCalendarModal(true)}
                disabled={payrollLocked}
              >
                <Icon icon="heroicons:calendar" className="me-1" />
                View Calendar
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Processing Day</label>
                <select 
                  className="form-select"
                  value={payrollConfig.payrollSchedule.processingDay}
                  onChange={(e) => handleUpdateConfig('payrollSchedule.processingDay', e.target.value)}
                  disabled={payrollLocked}
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}th</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Payment Day</label>
                <select 
                  className="form-select"
                  value={payrollConfig.payrollSchedule.paymentDay}
                  onChange={(e) => handleUpdateConfig('payrollSchedule.paymentDay', e.target.value)}
                  disabled={payrollLocked}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}th</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <div>
                  <input 
                    className="form-check-input" 
                    type="checkbox"
                    checked={payrollConfig.offCycleEnabled}
                    onChange={(e) => handleUpdateConfig('offCycleEnabled', e.target.checked)}
                    disabled={payrollLocked}
                    id="offCycleEnabled"
                  />
                  <label className="form-check-label" htmlFor="offCycleEnabled">
                    Enable Off-cycle Payroll (Bonuses, Advances, Exit Settlements)
                  </label>
                </div>
              </div>
              <div className="col-12">
                <div>
                  <input 
                    className="form-check-input"
                    type="checkbox"
                    checked={payrollConfig.advanceScheduling.enabled}
                    onChange={(e) => handleUpdateConfig('advanceScheduling.enabled', e.target.checked)}
                    disabled={payrollLocked}
                    id="advanceScheduling"
                  />
                  <label className="form-check-label" htmlFor="advanceScheduling">
                    Enable Advance Payroll Scheduling
                  </label>
                </div>
                {payrollConfig.advanceScheduling.enabled && (
                  <div className="mt-2">
                    <label className="form-label small">Advance Days</label>
                    <input 
                      type="number" 
                      className="form-control form-control-sm"
                      value={payrollConfig.advanceScheduling.advanceDays}
                      onChange={(e) => handleUpdateConfig('advanceScheduling.advanceDays', parseInt(e.target.value))}
                      disabled={payrollLocked}
                      min="1"
                      max="30"
                    />
                    <small className="text-muted">Schedule payroll processing N days in advance</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales/Commission Configuration */}
      <div className="col-md-6">
        <div className="card border shadow-none">
          <div className="card-header bg-transparent border-0">
            <h6 className="mb-0">Sales/Commission Configuration</h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <div>
                  <input 
                    className="form-check-input"
                    type="checkbox"
                    checked={payrollConfig.salesConfig.commissionEnabled}
                    onChange={(e) => handleUpdateConfig('salesConfig.commissionEnabled', e.target.checked)}
                    disabled={payrollLocked}
                    id="commissionEnabled"
                  />
                  <label className="form-check-label" htmlFor="commissionEnabled">
                    Enable Commission Calculation
                  </label>
                </div>
              </div>
              
              {payrollConfig.salesConfig.commissionEnabled && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Commission Rate (%)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={payrollConfig.salesConfig.commissionRate}
                      onChange={(e) => handleUpdateConfig('salesConfig.commissionRate', e.target.value)}
                      disabled={payrollLocked}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Bonus Threshold ($)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={payrollConfig.salesConfig.bonusThreshold}
                      onChange={(e) => handleUpdateConfig('salesConfig.bonusThreshold', e.target.value)}
                      disabled={payrollLocked}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Compliance */}
      <div className="col-md-6">
        <div className="card border shadow-none h-100">
          <div className="card-header bg-transparent border-0">
            <h6 className="mb-0">Statutory Compliance Settings</h6>
          </div>
          <div className="card-body d-flex flex-column">
            <div className="row g-3 flex-grow-1">
              <div className="col-md-6">
                <div className="h-100">
                  <input 
                    className="form-check-input"
                    type="checkbox"
                    checked={payrollConfig.statutorySettings.taxEnabled}
                    onChange={(e) => handleUpdateConfig('statutorySettings.taxEnabled', e.target.checked)}
                    disabled={payrollLocked}
                    id="taxEnabled"
                  />
                  <label className="form-check-label d-block" htmlFor="taxEnabled">
                    Tax Calculation
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="h-100">
                  <input 
                    className="form-check-input"
                    type="checkbox"
                    checked={payrollConfig.statutorySettings.epfEnabled}
                    onChange={(e) => handleUpdateConfig('statutorySettings.epfEnabled', e.target.checked)}
                    disabled={payrollLocked}
                    id="epfEnabled"
                  />
                  <label className="form-check-label d-block" htmlFor="epfEnabled">
                    EPF Contribution
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="h-100">
                  <input 
                    className="form-check-input"
                    type="checkbox"
                    checked={payrollConfig.statutorySettings.esiEnabled}
                    onChange={(e) => handleUpdateConfig('statutorySettings.esiEnabled', e.target.checked)}
                    disabled={payrollLocked}
                    id="esiEnabled"
                  />
                  <label className="form-check-label d-block" htmlFor="esiEnabled">
                    ESI Contribution
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="h-100">
                  <input 
                    className="form-check-input"
                    type="checkbox"
                    checked={payrollConfig.statutorySettings.tdsEnabled}
                    onChange={(e) => handleUpdateConfig('statutorySettings.tdsEnabled', e.target.checked)}
                    disabled={payrollLocked}
                    id="tdsEnabled"
                  />
                  <label className="form-check-label d-block" htmlFor="tdsEnabled">
                    TDS Deduction
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Components */}
      <div className="col-12">
        <div className="card border shadow-none">
          <div className="card-header bg-transparent border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Salary Component Configuration</h6>
              <button 
                className="btn btn-sm btn-success d-flex align-items-center" 
                onClick={() => {
                  setNewSalaryComponent({
                    name: '',
                    type: 'earnings',
                    calculation: 'fixed',
                    value: '',
                    taxable: true
                  });
                  setEditComponentId(null);
                  setShowConfigModal(true);
                }}
                disabled={payrollLocked}
              >
                <Icon icon="heroicons:plus" className="me-1" />
                Add Component
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Component Name</th>
                    <th>Type</th>
                    <th>Calculation</th>
                    <th>Value</th>
                    <th>Taxable</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryComponents.map(component => (
                    <tr key={component.id}>
                      <td className="fw-semibold">{component.name}</td>
                      <td>
                        <span className={`badge ${
                          component.type === 'earnings' 
                            ? 'bg-success-subtle text-success' 
                            : 'bg-danger-subtle text-danger'
                        }`}>
                          {component.type}
                        </span>
                      </td>
                      <td>{component.calculation}</td>
                      <td>
                        {component.calculation === 'percentage' 
                          ? `${component.value}%`
                          : formatCurrency(component.value)}
                      </td>
                      <td>
                        {component.taxable ? (
                          <span className="badge bg-warning-subtle text-warning">Yes</span>
                        ) : (
                          <span className="badge bg-success-subtle text-success">No</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditSalaryComponent(component)}
                            disabled={payrollLocked}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteSalaryComponent(component.id)}
                            disabled={payrollLocked}
                          >
                            Delete
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
    </div>
  );

  const renderPayrollRuns = () => (
    <div className="card border shadow-none">
      <div className="card-header bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Payroll Runs</h5>
          <div className="d-flex gap-2">
            <button 
              onClick={handleRunPayroll}
              className="btn btn-success d-flex align-items-center"
              disabled={isProcessing || payrollLocked}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Processing...
                </>
              ) : (
                <>
                  <Icon icon="heroicons:play" className="me-2" />
                  Run Payroll
                </>
              )}
            </button>
            <button 
              onClick={handleRefreshData}
              className="btn btn-outline-primary d-flex align-items-center"
            >
              <Icon icon="heroicons:arrow-path" className="me-2" />
              Refresh
            </button>
            <button 
              onClick={handleExportReport}
              className="btn btn-primary d-flex align-items-center"
            >
              <Icon icon="heroicons:document-arrow-down" className="me-2" />
              Export
            </button>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {/* Filters */}
        <div className="p-4 border-bottom">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className="position-relative flex-fill" style={{ minWidth: '300px' }}>
              <Icon icon="heroicons:magnifying-glass" className="position-absolute top-50 translate-middle-y text-muted ms-3" />
              <input
                type="text"
                placeholder="Search payroll runs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control ps-5"
              />
            </div>
            <div style={{ minWidth: '150px' }}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-select"
              >
                <option value="All">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payroll Runs Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">ID</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Month</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Type</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Employees</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Total Amount</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Status</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((run) => (
                <tr key={run.id} className="border-bottom">
                  <td className="px-4 py-3">
                    <div className="fw-medium text-dark">{run.id}</div>
                  </td>
                  <td className="px-4 py-3">{run.month}</td>
                  <td className="px-4 py-3">{getTypeBadge(run.type)}</td>
                  <td className="px-4 py-3">{run.employeesCount}</td>
                  <td className="px-4 py-3 fw-semibold">{formatCurrency(run.totalAmount)}</td>
                  <td className="px-4 py-3">{getStatusBadge(run.status)}</td>
                  <td className="px-4 py-3">
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleViewDetails(run)}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Details
                      </button>
                      {run.status === 'processing' && (
                        <button className="btn btn-sm btn-outline-warning d-flex align-items-center">
                          <Icon icon="heroicons:arrow-path" />
                        </button>
                      )}
                      {run.status === 'completed' && (
                        <button className="btn btn-sm btn-outline-success d-flex align-items-center" onClick={() => handleExportReport()}>
                          <Icon icon="heroicons:document-arrow-down" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedData.length === 0 && (
          <div className="text-center py-5 text-muted">
            <Icon icon="heroicons:document-text" className="text-4xl mb-3" />
            <h5>No payroll runs found</h5>
            <p>Start a new payroll run to get started.</p>
          </div>
        )}

        {/* Statistics */}
        <div className="p-4 border-top">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="text-center p-3 bg-light rounded">
                <h4 className="fw-bold text-success mb-1">{kpis.completedRuns}</h4>
                <p className="text-muted small mb-0">Completed Runs</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center p-3 bg-light rounded">
                <h4 className="fw-bold text-warning mb-1">{kpis.inProgressRuns}</h4>
                <p className="text-muted small mb-0">In Progress</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center p-3 bg-light rounded">
                <h4 className="fw-bold text-primary mb-1">
                  {formatCurrency(kpis.totalAmount)}
                </h4>
                <p className="text-muted small mb-0">Total Paid</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center p-3 bg-light rounded">
                <h4 className="fw-bold text-info mb-1">{kpis.totalEmployees}</h4>
                <p className="text-muted small mb-0">Total Employees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between">
            <div className="small text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} runs
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
  );

  const renderValidation = () => (
    <div className="card border shadow-none">
      <div className="card-header bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Payroll Validation & Review</h5>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-success d-flex align-items-center"
              onClick={runValidationChecks}
            >
              <Icon icon="heroicons:shield-check" className="me-2" />
              Run Validation
            </button>
            <button 
              onClick={handleRefreshData}
              className="btn btn-outline-primary d-flex align-items-center"
            >
              <Icon icon="heroicons:arrow-path" className="me-2" />
              Refresh
            </button>
            <button 
              onClick={handleExportReport}
              className="btn btn-primary d-flex align-items-center"
            >
              <Icon icon="heroicons:document-arrow-down" className="me-2" />
              Export
            </button>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {/* Filters */}
        <div className="p-4 border-bottom">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className="position-relative flex-fill" style={{ minWidth: '300px' }}>
              <Icon icon="heroicons:magnifying-glass" className="position-absolute top-50 translate-middle-y text-muted ms-3" />
              <input
                type="text"
                placeholder="Search validation checks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control ps-5"
              />
            </div>
            <div style={{ minWidth: '150px' }}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-select"
              >
                <option value="All">All Status</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Validation Results */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Check Name</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Status</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Description</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((check) => (
                <tr key={check.id} className="border-bottom">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className={`w-10-px h-10-px rounded-circle me-3 ${
                        check.status === 'passed' ? 'bg-success' :
                        check.status === 'failed' ? 'bg-danger' :
                        check.status === 'warning' ? 'bg-warning' : 'bg-info'
                      }`}></div>
                      <div className="fw-medium text-dark">{check.checkName}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(check.status)}</td>
                  <td className="px-4 py-3">{check.description}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewDetails(check)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Validation Summary */}
        <div className="p-4 border-top">
          <h6 className="mb-3">Validation Summary</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card border">
                <div className="card-body text-center">
                  <div className="text-success mb-2">
                    <Icon icon="heroicons:check-circle" className="fs-1" />
                  </div>
                  <h4 className="fw-bold">{validationResults.filter(v => v.status === 'passed').length}</h4>
                  <p className="text-muted mb-0">Passed Checks</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border">
                <div className="card-body text-center">
                  <div className="text-danger mb-2">
                    <Icon icon="heroicons:x-circle" className="fs-1" />
                  </div>
                  <h4 className="fw-bold">{validationResults.filter(v => v.status === 'failed').length}</h4>
                  <p className="text-muted mb-0">Failed Checks</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border">
                <div className="card-body text-center">
                  <div className="text-warning mb-2">
                    <Icon icon="heroicons:exclamation-triangle" className="fs-1" />
                  </div>
                  <h4 className="fw-bold">{validationResults.filter(v => v.status === 'warning').length}</h4>
                  <p className="text-muted mb-0">Warnings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {paginatedData.length === 0 && (
          <div className="text-center py-5 text-muted">
            <Icon icon="heroicons:shield-check" className="text-4xl mb-3" />
            <h5>No validation results found</h5>
            <p>Run validation checks to see results.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between">
            <div className="small text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} checks
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
  );

  const renderCalculations = () => (
    <div className="row g-4">
      {/* Calculation Engine */}
      <div className="col-12">
        <div className="card border shadow-none">
          <div className="card-header bg-transparent border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Payroll Calculation Logic</h5>
              <button 
                className="btn btn-primary d-flex align-items-center"
                onClick={handleRunCalculations}
                disabled={isProcessing || payrollLocked}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Icon icon="heroicons:calculator" className="me-2" />
                    Run Calculations
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-4">
              {/* Days Calculation */}
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-body">
                    <h6 className="card-title mb-3">Days Worked Calculation</h6>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="daysCalculation" 
                        checked={calculationSettings.daysCalculation}
                        onChange={() => handleToggleCalculationSetting('daysCalculation')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="daysCalculation">
                        Calculate based on actual days worked
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="prorateCalculation" 
                        checked={calculationSettings.prorateCalculation}
                        onChange={() => handleToggleCalculationSetting('prorateCalculation')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="prorateCalculation">
                        Prorate salary for joiners/leavers
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="leaveEncashment" 
                        checked={calculationSettings.leaveEncashment}
                        onChange={() => handleToggleCalculationSetting('leaveEncashment')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="leaveEncashment">
                        Include leave encashment calculation
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overtime & Arrears */}
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-body">
                    <h6 className="card-title mb-3">Overtime & Arrears</h6>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="overtimeCalculation" 
                        checked={calculationSettings.overtimeCalculation}
                        onChange={() => handleToggleCalculationSetting('overtimeCalculation')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="overtimeCalculation">
                        Calculate overtime pay
                      </label>
                    </div>
                    {calculationSettings.overtimeCalculation && (
                      <div className="ms-4 mb-2">
                        <label className="form-label small">Overtime Rate (multiplier)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="form-control form-control-sm"
                          value={calculationSettings.overtimeRate}
                          onChange={(e) => setCalculationSettings(prev => ({ ...prev, overtimeRate: parseFloat(e.target.value) }))}
                          disabled={payrollLocked}
                        />
                      </div>
                    )}
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="arrearsCalculation" 
                        checked={calculationSettings.arrearsCalculation}
                        onChange={() => handleToggleCalculationSetting('arrearsCalculation')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="arrearsCalculation">
                        Calculate arrears payment
                      </label>
                    </div>
                    {calculationSettings.arrearsCalculation && (
                      <div className="ms-4 mb-2">
                        <label className="form-label small">Arrears Inclusion</label>
                        <select 
                          className="form-select form-select-sm"
                          value={calculationSettings.arrearsInclusion}
                          onChange={(e) => setCalculationSettings(prev => ({ ...prev, arrearsInclusion: e.target.value }))}
                          disabled={payrollLocked}
                        >
                          <option value="previous_month">Previous Month Only</option>
                          <option value="all_pending">All Pending Arrears</option>
                          <option value="custom">Custom Selection</option>
                        </select>
                      </div>
                    )}
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="reimbursementProcessing" 
                        checked={calculationSettings.reimbursementProcessing}
                        onChange={() => handleToggleCalculationSetting('reimbursementProcessing')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="reimbursementProcessing">
                        Process reimbursements
                      </label>
                    </div>
                    <div className="form-check mt-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="salaryRevisionEffectuation" 
                        checked={calculationSettings.salaryRevisionEffectuation}
                        onChange={() => handleToggleCalculationSetting('salaryRevisionEffectuation')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="salaryRevisionEffectuation">
                        Effectuate salary revisions during payroll
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan & Recovery */}
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-body">
                    <h6 className="card-title mb-3">Loan & Recovery Processing</h6>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="loanRecovery" 
                        checked={calculationSettings.loanRecovery}
                        onChange={() => handleToggleCalculationSetting('loanRecovery')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="loanRecovery">
                        Automatic loan recovery
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="advanceRecovery" 
                        checked={calculationSettings.advanceRecovery}
                        onChange={() => handleToggleCalculationSetting('advanceRecovery')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="advanceRecovery">
                        Advance recovery calculation
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="finalSettlement" 
                        checked={calculationSettings.finalSettlement}
                        onChange={() => handleToggleCalculationSetting('finalSettlement')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="finalSettlement">
                        Final settlement calculation
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Component Dependencies */}
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-body">
                    <h6 className="card-title mb-3">Salary Component Dependencies</h6>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="componentDependencies" 
                        checked={calculationSettings.componentDependencies}
                        onChange={() => handleToggleCalculationSetting('componentDependencies')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="componentDependencies">
                        Handle component dependencies
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="taxDependencies" 
                        checked={calculationSettings.taxDependencies}
                        onChange={() => handleToggleCalculationSetting('taxDependencies')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="taxDependencies">
                        Tax calculation dependencies
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="statutoryDependencies" 
                        checked={calculationSettings.statutoryDependencies}
                        onChange={() => handleToggleCalculationSetting('statutoryDependencies')}
                        disabled={payrollLocked}
                      />
                      <label className="form-check-label" htmlFor="statutoryDependencies">
                        Statutory compliance dependencies
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculation Results */}
              <div className="col-12">
                <div className="card border">
                  <div className="card-header bg-transparent border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Latest Calculation Results</h6>
                      <button 
                        onClick={() => handleExportReport()}
                        className="btn btn-sm btn-primary d-flex align-items-center"
                      >
                        <Icon icon="heroicons:document-arrow-down" className="me-1" />
                        Export Results
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Basic</th>
                            <th>Allowances</th>
                            <th>Deductions</th>
                            <th>Tax</th>
                            <th>PF</th>
                            <th>Net Salary</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calculationResults.map(result => (
                            <tr key={result.employeeId}>
                              <td>
                                <div className="fw-semibold">{result.name}</div>
                                <div className="small text-muted">{result.employeeId}</div>
                              </td>
                              <td>{formatCurrency(result.basic)}</td>
                              <td>{formatCurrency(result.allowances)}</td>
                              <td>{formatCurrency(result.deductions)}</td>
                              <td>{formatCurrency(result.tax)}</td>
                              <td>{formatCurrency(result.pf)}</td>
                              <td className="fw-bold text-primary">{formatCurrency(result.netSalary)}</td>
                              <td>
                                <span className="badge bg-success-subtle text-success">
                                  {result.status}
                                </span>
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
          </div>
        </div>
      </div>
    </div>
  );

  const renderApprovals = () => (
    <div className="card border shadow-none">
      <div className="card-header bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Payroll Review & Approval Workflow</h5>
          <div className="d-flex gap-2">
            <button 
              onClick={handleRefreshData}
              className="btn btn-outline-primary d-flex align-items-center"
            >
              <Icon icon="heroicons:arrow-path" className="me-2" />
              Refresh
            </button>
            <button 
              onClick={handleExportReport}
              className="btn btn-primary d-flex align-items-center"
            >
              <Icon icon="heroicons:document-arrow-down" className="me-2" />
              Export
            </button>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {/* Filters */}
        <div className="p-4 border-bottom">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className="position-relative flex-fill" style={{ minWidth: '300px' }}>
              <Icon icon="heroicons:magnifying-glass" className="position-absolute top-50 translate-middle-y text-muted ms-3" />
              <input
                type="text"
                placeholder="Search approvals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control ps-5"
              />
            </div>
            <div style={{ minWidth: '150px' }}>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-select"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Approval Workflow Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Payroll ID</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Approver</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Role</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Status</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Submitted Date</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((approval) => (
                <tr key={approval.id} className="border-bottom">
                  <td className="px-4 py-3">
                    <div className="fw-medium text-dark">{approval.payrollId}</div>
                  </td>
                  <td className="px-4 py-3">{approval.approver}</td>
                  <td className="px-4 py-3">
                    <span className="badge bg-secondary-subtle text-secondary">
                      {approval.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(approval.status)}</td>
                  <td className="px-4 py-3">{approval.submittedDate}</td>
                  <td className="px-4 py-3">
                    <div className="d-flex gap-2">
                      {approval.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprovePayroll(approval.id)}
                            className="btn btn-sm btn-success"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectPayroll(approval.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewDetails(approval)}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Approval Statistics */}
        <div className="p-4 border-top">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card border border-warning">
                <div className="card-body text-center">
                  <div className="text-warning mb-2">
                    <Icon icon="heroicons:clock" className="fs-1" />
                  </div>
                  <h4 className="fw-bold">{approvalWorkflow.filter(a => a.status === 'pending').length}</h4>
                  <p className="text-muted mb-0">Pending Approvals</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border border-success">
                <div className="card-body text-center">
                  <div className="text-success mb-2">
                    <Icon icon="heroicons:check-circle" className="fs-1" />
                  </div>
                  <h4 className="fw-bold">{approvalWorkflow.filter(a => a.status === 'approved').length}</h4>
                  <p className="text-muted mb-0">Approved</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border border-danger">
                <div className="card-body text-center">
                  <div className="text-danger mb-2">
                    <Icon icon="heroicons:x-circle" className="fs-1" />
                  </div>
                  <h4 className="fw-bold">{approvalWorkflow.filter(a => a.status === 'rejected').length}</h4>
                  <p className="text-muted mb-0">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {paginatedData.length === 0 && (
          <div className="text-center py-5 text-muted">
            <Icon icon="heroicons:document-check" className="text-4xl mb-3" />
            <h5>No approval records found</h5>
            <p>No approvals pending at the moment.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between">
            <div className="small text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} approvals
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
  );

  const renderEmployeeData = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="card border shadow-none">
          <div className="card-header bg-transparent border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Employee Data for Payroll</h5>
              <div className="position-relative" style={{ width: '300px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search employees..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Base Salary</th>
                    <th>Employment Type</th>
                    <th>Status</th>
                    <th>Payroll Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(employee => (
                    <tr key={employee.id}>
                      <td className="fw-semibold">{employee.id}</td>
                      <td>
                        <div className="fw-semibold">{employee.name}</div>
                      </td>
                      <td>{employee.department}</td>
                      <td>{formatCurrency(employee.baseSalary)}</td>
                      <td>
                        <span className="badge bg-info-subtle text-info">
                          {employee.employmentType}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success-subtle text-success">
                          {employee.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewEmployeeDetails(employee)}
                          >
                            View Details
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleAdjustEmployeeSalary(employee)}
                            disabled={payrollLocked}
                          >
                            Adjust Salary
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

      {/* Data Import/Export */}
      <div className="col-12">
        <div className="card border shadow-none">
          <div className="card-body">
            <h6 className="card-title mb-3">Data Management</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="card border h-100">
                  <div className="card-body text-center">
                    <Icon icon="heroicons:arrow-up-tray" className="text-primary fs-1 mb-3" />
                    <h6 className="fw-bold">Import Attendance</h6>
                    <p className="text-muted small mb-3">Upload attendance data for payroll processing</p>
                    <button 
                      className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                      onClick={() => handleImportData('Attendance')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Uploading...' : 'Upload CSV'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border h-100">
                  <div className="card-body text-center">
                    <Icon icon="heroicons:arrow-down-tray" className="text-success fs-1 mb-3" />
                    <h6 className="fw-bold">Export Payroll Data</h6>
                    <p className="text-muted small mb-3">Download complete payroll data for reporting</p>
                    <button className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center" onClick={handleExportReport}>
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border h-100">
                  <div className="card-body text-center">
                    <Icon icon="heroicons:document-text" className="text-info fs-1 mb-3" />
                    <h6 className="fw-bold">Generate Reports</h6>
                    <p className="text-muted small mb-3">Create custom payroll reports</p>
                    <button 
                      className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center"
                      onClick={() => handleGenerateReport('Employee Data Report')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="row g-4">
      {/* Reports Dashboard */}
      <div className="col-12">
        <div className="card border shadow-none">
          <div className="card-body">
            <h5 className="card-title mb-4">Payroll Reports & Analytics</h5>
            <div className="row g-4">
              {/* Report Cards */}
              <div className="col-md-3">
                <div className="card border h-100">
                  <div className="card-body text-center">
                    <div className="text-primary mb-3">
                      <Icon icon="heroicons:currency-dollar" className="fs-1" />
                    </div>
                    <h4 className="fw-bold">{formatCurrency(kpis.totalAmount)}</h4>
                    <p className="text-muted mb-0">Total Payroll Cost</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border h-100">
                  <div className="card-body text-center">
                    <div className="text-success mb-3">
                      <Icon icon="heroicons:users" className="fs-1" />
                    </div>
                    <h4 className="fw-bold">{kpis.totalEmployees}</h4>
                    <p className="text-muted mb-0">Total Employees</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border h-100">
                  <div className="card-body text-center">
                    <div className="text-warning mb-3">
                      <Icon icon="heroicons:chart-bar" className="fs-1" />
                    </div>
                    <h4 className="fw-bold">{payrollRuns.length}</h4>
                    <p className="text-muted mb-0">Total Payroll Runs</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border h-100">
                  <div className="card-body text-center">
                    <div className="text-danger mb-3">
                      <Icon icon="heroicons:exclamation-triangle" className="fs-1" />
                    </div>
                    <h4 className="fw-bold">{kpis.failedValidations}</h4>
                    <p className="text-muted mb-0">Failed Validations</p>
                  </div>
                </div>
              </div>

              {/* Report Types */}
              <div className="col-12">
                <div className="card border">
                  <div className="card-header bg-transparent border-0">
                    <h6 className="mb-0">Available Reports</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="card border h-100">
                          <div className="card-body">
                            <h6 className="fw-bold">Monthly Payroll Summary</h6>
                            <p className="text-muted small mb-3">Complete summary of monthly payroll</p>
                            <button 
                              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                              onClick={() => handleGenerateReport('Monthly Payroll Summary')}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Generating...' : 'Generate Report'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border h-100">
                          <div className="card-body">
                            <h6 className="fw-bold">Tax Compliance Report</h6>
                            <p className="text-muted small mb-3">Tax calculations and compliance details</p>
                            <button 
                              className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center"
                              onClick={() => handleGenerateReport('Tax Compliance Report')}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Generating...' : 'Generate Report'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border h-100">
                          <div className="card-body">
                            <h6 className="fw-bold">Department-wise Analysis</h6>
                            <p className="text-muted small mb-3">Payroll analysis by department</p>
                            <button 
                              className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center"
                              onClick={() => handleGenerateReport('Department-wise Analysis')}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Generating...' : 'Generate Report'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border h-100">
                          <div className="card-body">
                            <h6 className="fw-bold">Employee Earnings Statement</h6>
                            <p className="text-muted small mb-3">Detailed earnings statement per employee</p>
                            <button 
                              className="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center"
                              onClick={() => handleGenerateReport('Employee Earnings Statement')}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Generating...' : 'Generate Report'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border h-100">
                          <div className="card-body">
                            <h6 className="fw-bold">Statutory Compliance Report</h6>
                            <p className="text-muted small mb-3">PF, ESI, PT, and other statutory reports</p>
                            <button 
                              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                              onClick={() => handleGenerateReport('Statutory Compliance Report')}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Generating...' : 'Generate Report'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border h-100">
                          <div className="card-body">
                            <h6 className="fw-bold">Year-to-Date Analysis</h6>
                            <p className="text-muted small mb-3">Complete YTD payroll analysis</p>
                            <button 
                              className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center"
                              onClick={() => handleGenerateReport('Year-to-Date Analysis')}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Generating...' : 'Generate Report'}
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
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'configuration':
        return renderConfiguration();
      case 'runs':
        return renderPayrollRuns();
      case 'validation':
        return renderValidation();
      case 'calculations':
        return renderCalculations();
      case 'approvals':
        return renderApprovals();
      case 'employees':
        return renderEmployeeData();
      case 'reports':
        return renderReports();
      default:
        return renderConfiguration();
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container-fluid">
        {/* Header */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            {activeSection !== 'configuration' && (
              <button
                onClick={() => setActiveSection('configuration')}
                className="btn btn-link d-flex align-items-center gap-2"
              >
                <Icon icon="heroicons:arrow-left" />
                Back to Configuration
              </button>
            )}
          </div>
          <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
            <Icon icon="heroicons:cog" />
            Payroll Processing Engine 
          </h5>
          <p className="text-muted">
            Automated payroll processing with configuration, calculation, validation, and approval workflows
          </p>
        </div>

        {/* Payroll Status Alert */}
        <div className="alert alert-warning d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <Icon icon="heroicons:information-circle" className="me-2 fs-5" />
            <span>
              Payroll is currently <strong>{payrollLocked ? 'LOCKED' : 'ACTIVE'}</strong>. 
              {payrollLocked ? ' No changes can be made until unlocked.' : ' All functions are available.'}
            </span>
          </div>
          <button 
            className={`btn btn-sm ${payrollLocked ? 'btn-success' : 'btn-danger'} d-flex align-items-center`}
            onClick={handleTogglePayrollLock}
          >
            <Icon icon={payrollLocked ? "heroicons:lock-open" : "heroicons:lock-closed"} className="me-1" />
            {payrollLocked ? 'Unlock Payroll' : 'Lock Payroll'}
          </button>
        </div>

        {/* Content Area */}
        {renderContent()}

        {/* Run Payroll Modal */}
        {showRunModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:play-circle" />
                    Run Payroll Processing
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowRunModal(false)}
                    disabled={isProcessing}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Select Payroll Type</h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="card border cursor-pointer hover-shadow" onClick={() => handleStartPayrollProcessing('regular')}>
                          <div className="card-body text-center">
                            <Icon icon="heroicons:calendar" className="text-primary fs-1 mb-3" />
                            <h6 className="fw-bold">Regular Payroll</h6>
                            <p className="text-muted small mb-0">Monthly salary processing</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border cursor-pointer hover-shadow" onClick={() => handleStartPayrollProcessing('bonus')}>
                          <div className="card-body text-center">
                            <Icon icon="heroicons:gift" className="text-success fs-1 mb-3" />
                            <h6 className="fw-bold">Bonus Run</h6>
                            <p className="text-muted small mb-0">Bonus and incentive payment</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border cursor-pointer hover-shadow" onClick={() => handleStartPayrollProcessing('advance')}>
                          <div className="card-body text-center">
                            <Icon icon="heroicons:banknotes" className="text-warning fs-1 mb-3" />
                            <h6 className="fw-bold">Advance Salary</h6>
                            <p className="text-muted small mb-0">Salary advance processing</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <Icon icon="heroicons:information-circle" className="me-2" />
                    <strong>Note:</strong> The payroll process will automatically:
                    <ul className="mb-0 mt-2">
                      <li>Fetch attendance data from integrated systems</li>
                      <li>Calculate statutory deductions and compliance</li>
                      <li>Process reimbursements and loan recoveries</li>
                      <li>Generate payslips and reports</li>
                    </ul>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowRunModal(false)}
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary d-flex align-items-center"
                      onClick={() => handleStartPayrollProcessing('regular')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Starting...
                        </>
                      ) : (
                        <>
                          <Icon icon="heroicons:play" className="me-2" />
                          Start Regular Payroll
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Salary Component Configuration Modal */}
        {showConfigModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editComponentId ? 'Edit Salary Component' : 'Add Salary Component'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowConfigModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Component Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newSalaryComponent.name}
                      onChange={(e) => setNewSalaryComponent({...newSalaryComponent, name: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={newSalaryComponent.type}
                      onChange={(e) => setNewSalaryComponent({...newSalaryComponent, type: e.target.value})}
                    >
                      <option value="earnings">Earnings</option>
                      <option value="deductions">Deductions</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Calculation Method</label>
                    <select
                      className="form-select"
                      value={newSalaryComponent.calculation}
                      onChange={(e) => setNewSalaryComponent({...newSalaryComponent, calculation: e.target.value})}
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage of Basic</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      {newSalaryComponent.calculation === 'percentage' ? 'Percentage Value (%)' : 'Fixed Amount ($)'}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={newSalaryComponent.value}
                      onChange={(e) => setNewSalaryComponent({...newSalaryComponent, value: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={newSalaryComponent.taxable}
                      onChange={(e) => setNewSalaryComponent({...newSalaryComponent, taxable: e.target.checked})}
                      id="taxableCheckbox"
                    />
                    <label className="form-check-label" htmlFor="taxableCheckbox">Taxable Component</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowConfigModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddSalaryComponent}
                  >
                    {editComponentId ? 'Update' : 'Add'} Component
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employee Details Modal */}
        {showEmployeeModal && selectedEmployee && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Employee Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEmployeeModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Employee ID</label>
                      <p className="form-control-plaintext fw-bold">{selectedEmployee.id}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Name</label>
                      <p className="form-control-plaintext">{selectedEmployee.name}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Department</label>
                      <p className="form-control-plaintext">{selectedEmployee.department}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Base Salary</label>
                      <p className="form-control-plaintext fw-bold text-primary">{formatCurrency(selectedEmployee.baseSalary)}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Employment Type</label>
                      <p className="form-control-plaintext">
                        <span className="badge bg-info-subtle text-info">{selectedEmployee.employmentType}</span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Status</label>
                      <p className="form-control-plaintext">
                        <span className="badge bg-success-subtle text-success">{selectedEmployee.status}</span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email</label>
                      <p className="form-control-plaintext">{selectedEmployee.email}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Join Date</label>
                      <p className="form-control-plaintext">{selectedEmployee.joinDate}</p>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Bank Account</label>
                      <p className="form-control-plaintext">{selectedEmployee.bankAccount}</p>
                    </div>
                  </div>
                  
                  {/* Employee's calculation if exists */}
                  {calculationResults.find(c => c.employeeId === selectedEmployee.id) && (
                    <div className="mt-4 pt-4 border-top">
                      <h6 className="mb-3">Latest Payroll Calculation</h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="card border">
                            <div className="card-body text-center">
                              <div className="text-success mb-2">
                                <Icon icon="heroicons:currency-dollar" />
                              </div>
                              <h6 className="fw-bold">
                                {formatCurrency(calculationResults.find(c => c.employeeId === selectedEmployee.id)?.netSalary || 0)}
                              </h6>
                              <p className="text-muted small mb-0">Net Salary</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card border">
                            <div className="card-body text-center">
                              <div className="text-danger mb-2">
                                <Icon icon="heroicons:banknotes" />
                              </div>
                              <h6 className="fw-bold">
                                {formatCurrency(calculationResults.find(c => c.employeeId === selectedEmployee.id)?.tax || 0)}
                              </h6>
                              <p className="text-muted small mb-0">Tax Deduction</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card border">
                            <div className="card-body text-center">
                              <div className="text-warning mb-2">
                                <Icon icon="heroicons:chart-bar" />
                              </div>
                              <h6 className="fw-bold">
                                {formatCurrency(calculationResults.find(c => c.employeeId === selectedEmployee.id)?.pf || 0)}
                              </h6>
                              <p className="text-muted small mb-0">PF Contribution</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEmployeeModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setShowEmployeeModal(false);
                      handleAdjustEmployeeSalary(selectedEmployee);
                    }}
                  >
                    Adjust Salary
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showModal && selectedItem && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon="heroicons:eye" />
                    Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {activeSection === 'runs' && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Payroll ID</label>
                        <p className="form-control-plaintext fw-bold">{selectedItem.id}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Month</label>
                        <p className="form-control-plaintext">{selectedItem.month}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Type</label>
                        <p className="form-control-plaintext">{getTypeBadge(selectedItem.type)}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Status</label>
                        <p className="form-control-plaintext">{getStatusBadge(selectedItem.status)}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Total Amount</label>
                        <p className="form-control-plaintext fw-bold text-primary">{formatCurrency(selectedItem.totalAmount)}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Employees Count</label>
                        <p className="form-control-plaintext">{selectedItem.employeesCount}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Processed Date</label>
                        <p className="form-control-plaintext">{selectedItem.processedDate || 'N/A'}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Paid Date</label>
                        <p className="form-control-plaintext">{selectedItem.paidDate || 'N/A'}</p>
                      </div>
                      {selectedItem.details && (
                        <>
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold">Total Earnings</label>
                            <p className="form-control-plaintext">{formatCurrency(selectedItem.details.totalEarnings)}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold">Total Deductions</label>
                            <p className="form-control-plaintext">{formatCurrency(selectedItem.details.totalDeductions)}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold">Tax Amount</label>
                            <p className="form-control-plaintext">{formatCurrency(selectedItem.details.taxAmount)}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small fw-semibold">PF Amount</label>
                            <p className="form-control-plaintext">{formatCurrency(selectedItem.details.pfAmount)}</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {activeSection === 'validation' && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Check Name</label>
                        <p className="form-control-plaintext fw-bold">{selectedItem.checkName}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Status</label>
                        <p className="form-control-plaintext">{getStatusBadge(selectedItem.status)}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Severity</label>
                        <p className="form-control-plaintext">
                          <span className={`badge ${
                            selectedItem.severity === 'high' ? 'bg-danger-subtle text-danger' :
                            selectedItem.severity === 'medium' ? 'bg-warning-subtle text-warning' :
                            'bg-info-subtle text-info'
                          }`}>
                            {selectedItem.severity}
                          </span>
                        </p>
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Description</label>
                        <div className="form-control-plaintext bg-light p-3 rounded">
                          {selectedItem.description}
                        </div>
                      </div>
                      {selectedItem.details && (
                        <div className="col-12">
                          <label className="form-label small fw-semibold">Details</label>
                          <div className="form-control-plaintext bg-light p-3 rounded">
                            {selectedItem.details}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection === 'approvals' && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Payroll ID</label>
                        <p className="form-control-plaintext fw-bold">{selectedItem.payrollId}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Approver</label>
                        <p className="form-control-plaintext">{selectedItem.approver}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Role</label>
                        <p className="form-control-plaintext">{selectedItem.role}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Status</label>
                        <p className="form-control-plaintext">{getStatusBadge(selectedItem.status)}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Submitted Date</label>
                        <p className="form-control-plaintext">{selectedItem.submittedDate}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">
                          {selectedItem.status === 'approved' ? 'Approved Date' : 
                           selectedItem.status === 'rejected' ? 'Rejected Date' : 'Expected Date'}
                        </label>
                        <p className="form-control-plaintext">
                          {selectedItem.approvedDate || selectedItem.rejectedDate || 'N/A'}
                        </p>
                      </div>
                      {selectedItem.comments && (
                        <div className="col-12">
                          <label className="form-label small fw-semibold">Comments</label>
                          <div className="form-control-plaintext bg-light p-3 rounded">
                            {selectedItem.comments}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payroll Calendar Modal */}
        {showCalendarModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Payroll Calendar</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCalendarModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Processing Date</th>
                          <th>Payment Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payrollConfig.payrollCalendar && payrollConfig.payrollCalendar.length > 0 ? (
                          payrollConfig.payrollCalendar.map((cal, idx) => (
                            <tr key={idx}>
                              <td>{cal.month}</td>
                              <td>{cal.processingDate}</td>
                              <td>{cal.paymentDate}</td>
                              <td>
                                <span className={`badge ${
                                  cal.status === 'scheduled' ? 'bg-info-subtle text-info' :
                                  cal.status === 'completed' ? 'bg-success-subtle text-success' :
                                  'bg-warning-subtle text-warning'
                                }`}>
                                  {cal.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-muted py-4">No calendar entries</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCalendarModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variance Analysis Modal */}
        {showVarianceModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Salary Variance Analysis</h5>
                  <button type="button" className="btn-close" onClick={() => setShowVarianceModal(false)}></button>
                </div>
                <div className="modal-body">
                  {previousMonthPayroll && (
                    <div className="alert alert-info mb-4">
                      <strong>Previous Month:</strong> {previousMonthPayroll.month} - Total: {formatCurrency(previousMonthPayroll.totalAmount)} | Employees: {previousMonthPayroll.employeeCount}
                    </div>
                  )}
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Type</th>
                          <th>Amount Change</th>
                          <th>Percentage</th>
                          <th>Reason</th>
                          <th>Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {varianceAlerts.length > 0 ? (
                          varianceAlerts.map((alert, idx) => (
                            <tr key={idx}>
                              <td>{alert.employeeId}</td>
                              <td>
                                <span className={`badge ${
                                  alert.type === 'increase' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                                }`}>
                                  {alert.type}
                                </span>
                              </td>
                              <td className={alert.type === 'increase' ? 'text-success' : 'text-danger'}>
                                {alert.type === 'increase' ? '+' : ''}{formatCurrency(alert.amount)}
                              </td>
                              <td>{alert.percentage > 0 ? '+' : ''}{alert.percentage.toFixed(2)}%</td>
                              <td>{alert.reason}</td>
                              <td>
                                <span className={`badge ${
                                  alert.severity === 'high' ? 'bg-danger-subtle text-danger' :
                                  alert.severity === 'warning' ? 'bg-warning-subtle text-warning' :
                                  'bg-info-subtle text-info'
                                }`}>
                                  {alert.severity}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center text-muted py-4">No variance alerts</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowVarianceModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Intervention Modal */}
        {showInterventionModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Manual Interventions Required</h5>
                  <button type="button" className="btn-close" onClick={() => setShowInterventionModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Issue</th>
                          <th>Action Required</th>
                          <th>Assigned To</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {manualInterventions.length > 0 ? (
                          manualInterventions.map((intervention, idx) => (
                            <tr key={idx}>
                              <td>{intervention.employeeId}</td>
                              <td>{intervention.issue}</td>
                              <td>{intervention.action}</td>
                              <td>{intervention.assignedTo}</td>
                              <td>
                                <span className={`badge ${
                                  intervention.status === 'pending' ? 'bg-warning-subtle text-warning' :
                                  intervention.status === 'resolved' ? 'bg-success-subtle text-success' :
                                  'bg-info-subtle text-info'
                                }`}>
                                  {intervention.status}
                                </span>
                              </td>
                              <td>
                                {intervention.status === 'pending' && (
                                  <button 
                                    className="btn btn-sm btn-success"
                                    onClick={() => {
                                      setManualInterventions(prev => 
                                        prev.map((m, i) => i === idx ? { ...m, status: 'resolved' } : m)
                                      );
                                    }}
                                  >
                                    Mark Resolved
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center text-muted py-4">No manual interventions required</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowInterventionModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hold Salary Modal */}
        {showHoldSalaryModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Hold Salary Management</h5>
                  <button type="button" className="btn-close" onClick={() => setShowHoldSalaryModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Reason</th>
                          <th>Held By</th>
                          <th>Held Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {heldEmployees.length > 0 ? (
                          heldEmployees.map((held, idx) => (
                            <tr key={idx}>
                              <td>{held.employeeId}</td>
                              <td>{held.reason}</td>
                              <td>{held.heldBy}</td>
                              <td>{held.heldDate}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-success"
                                  onClick={() => {
                                    setHeldEmployees(prev => prev.filter((h, i) => i !== idx));
                                    alert('Salary hold released for ' + held.employeeId);
                                  }}
                                >
                                  Release Hold
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center text-muted py-4">No employees with held salary</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowHoldSalaryModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollProcessingEngine;