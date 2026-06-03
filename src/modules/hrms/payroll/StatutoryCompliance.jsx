import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

const StatutoryCompliance = () => {
  const [activeSection, setActiveSection] = useState('pf');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showUANModal, setShowUANModal] = useState(false);
  const [showECRModal, setShowECRModal] = useState(false);
  const [showRemittanceModal, setShowRemittanceModal] = useState(false);
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [showReconciliationModal, setShowReconciliationModal] = useState(false);
  const [showVPFModal, setShowVPFModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedEmployeeForUAN, setSelectedEmployeeForUAN] = useState(null);
  const [remittanceType, setRemittanceType] = useState('pf');
  const [viewModalData, setViewModalData] = useState(null);
  
  // Modal form states
  const [ecrFormData, setEcrFormData] = useState({
    month: '',
    totalWages: '',
    epfContribution: '',
    epsContribution: '',
    edliContribution: ''
  });

  const [remittanceFormData, setRemittanceFormData] = useState({
    month: '',
    totalContribution: '',
    employeeContribution: '',
    employerContribution: '',
    challanNo: '',
    remittanceDate: ''
  });

  const [challanFormData, setChallanFormData] = useState({
    period: '',
    amount: '',
    paymentDate: '',
    format: 'PDF'
  });

  const [uanFormData, setUanFormData] = useState({
    uanNumber: '',
    activationDate: ''
  });

  const [vpfFormData, setVpfFormData] = useState({
    employeeId: '',
    vpfRate: '',
    month: ''
  });
// Add these with your other useState declarations
const [selectedChallan, setSelectedChallan] = useState(null);
const [showChallanDetailsModal, setShowChallanDetailsModal] = useState(false);
  // PF Configuration State
  const [pfConfig, setPfConfig] = useState({
    employeeContribution: 12,
    employerContribution: 12,
    epfContribution: 8.33,
    epsContribution: 3.67,
    edliContribution: 0.5,
    ceilingLimit: 15000,
    autoCalculation: true,
    uanMandatory: true,
    eligibilityRules: {
      minimumSalary: 0,
      maximumSalary: null,
      employmentType: ['permanent', 'contract'],
      probationPeriod: 0,
      autoEnrollment: true
    },
    vpfEnabled: true,
    vpfRate: 0
  });

  // ESI Configuration State
  const [esiConfig, setEsiConfig] = useState({
    employeeContribution: 0.75,
    employerContribution: 3.25,
    salaryThreshold: 21000,
    autoRegistration: true,
    halfYearlyReturns: true,
    registrationNumber: 'ESI123456789',
    branchCode: 'BR001',
    returnPeriod: 'half-yearly'
  });

  // Professional Tax State
  const [ptConfig, setPtConfig] = useState({
    state: 'Maharashtra',
    slabs: [
      { from: 0, to: 7500, amount: 0 },
      { from: 7501, to: 10000, amount: 175 },
      { from: 10001, to: Infinity, amount: 200 }
    ],
    deductionCycle: 'monthly'
  });

  // TDS Configuration State
  const [tdsConfig, setTdsConfig] = useState({
    taxRegime: 'new',
    financialYear: '2024-25',
    declarationRequired: true,
    form16Generation: true,
    quarterlyTDS: true,
    standardDeduction: 50000,
    advanceTaxEnabled: true,
    selfAssessmentTaxEnabled: true,
    tanNumber: 'TAN12345678'
  });

  // LWF Configuration State
  const [lwfConfig, setLwfConfig] = useState({
    state: 'Maharashtra',
    employeeContribution: 12,
    employerContribution: 12,
    deductionFrequency: 'annual'
  });

  // Gratuity Configuration
  const [gratuityConfig, setGratuityConfig] = useState({
    eligibilityYears: 5,
    calculationMethod: 'last_drawn',
    ceilingLimit: 2000000,
    autoProvisioning: true
  });

  // Bonus Configuration
  const [bonusConfig, setBonusConfig] = useState({
    eligibilityThreshold: 21000,
    calculationRate: 8.33,
    minimumBonus: 100,
    partialYearCalculation: true
  });

  // Employees Data
  const [employees, setEmployees] = useState([]);
  const [pfStatements, setPfStatements] = useState([]);
  const [esiStatements, setEsiStatements] = useState([]);
  const [tdsStatements, setTdsStatements] = useState([]);
  const [complianceForms, setComplianceForms] = useState([]);
  const [declarations, setDeclarations] = useState([]);
  const [reconciliationReports, setReconciliationReports] = useState([]);
  const [pfRemittances, setPfRemittances] = useState([]);
  const [esiRemittances, setEsiRemittances] = useState([]);
  const [ptRemittances, setPtRemittances] = useState([]);
  const [tdsChallans, setTdsChallans] = useState([]);
  const [ecrData, setEcrData] = useState([]);
  const [vpfData, setVpfData] = useState([]);
  const [gratuityPayments, setGratuityPayments] = useState([]);
  const [bonusPayments, setBonusPayments] = useState([]);
  const [advanceTaxData, setAdvanceTaxData] = useState([]);
  const [uanActivations, setUanActivations] = useState([]);

  // Investment Declarations
  const [investmentDeclarations, setInvestmentDeclarations] = useState({
    section80C: 0,
    section80D: 0,
    section80CCD: 0,
    hraExemption: 0,
    ltaExemption: 0,
    homeLoanInterest: 0,
    educationLoanInterest: 0,
    npsContribution: 0,
    totalDeclared: 0
  });

  const itemsPerPage = 6;

  // Calculate KPIs
  const kpis = useMemo(() => {
    const pendingDeclarations = declarations.filter(d => d.status === 'pending').length;
    const pendingForms = complianceForms.filter(f => f.status === 'pending').length;
    const totalPFContribution = employees.reduce((sum, emp) => sum + (emp.pfContribution || 0), 0);
    const totalESIContribution = employees.reduce((sum, emp) => sum + (emp.esiContribution || 0), 0);
    const totalTDSDeduction = employees.reduce((sum, emp) => sum + (emp.tdsDeduction || 0), 0);
    
    return {
      pendingDeclarations,
      pendingForms,
      totalPFContribution,
      totalESIContribution,
      totalTDSDeduction,
      totalEmployees: employees.length,
      eligiblePF: employees.filter(emp => emp.pfEligible).length,
      eligibleESI: employees.filter(emp => emp.esiEligible).length
    };
  }, [employees, declarations, complianceForms]);

  // Filter data based on search and type
  const getFilteredData = () => {
    let data = [];
    switch(activeSection) {
      case 'employees':
        data = employees.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item[filterType] === true);
        }
        break;
      case 'forms':
        data = complianceForms.filter(item => 
          item.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'declarations':
        data = declarations.filter(item => 
          item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.financialYear.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'reports':
        data = reconciliationReports.filter(item => 
          item.reportName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.period.toLowerCase().includes(searchTerm.toLowerCase())
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
    // Employees data
    setEmployees([
      { 
        id: 'EMP001', 
        name: 'John Smith', 
        employeeId: 'EMP001',
        department: 'Engineering',
        basicSalary: 50000,
        grossSalary: 75000,
        pfEligible: true,
        esiEligible: false,
        ptApplicable: true,
        tdsApplicable: true,
        pfUAN: '100123456789',
        esiNumber: '',
        doj: '2022-03-15',
        pfContribution: 6000,
        esiContribution: 0,
        tdsDeduction: 4500,
        ptDeduction: 200,
        lastDeclaration: '2024-03-31'
      },
      { 
        id: 'EMP002', 
        name: 'Sarah Johnson', 
        employeeId: 'EMP002',
        department: 'Marketing',
        basicSalary: 40000,
        grossSalary: 55000,
        pfEligible: true,
        esiEligible: true,
        ptApplicable: true,
        tdsApplicable: true,
        pfUAN: '100987654321',
        esiNumber: 'ESI123456',
        doj: '2021-06-20',
        pfContribution: 4800,
        esiContribution: 412,
        tdsDeduction: 3500,
        ptDeduction: 200,
        lastDeclaration: '2024-03-31'
      },
      { 
        id: 'EMP003', 
        name: 'Mike Chen', 
        employeeId: 'EMP003',
        department: 'Sales',
        basicSalary: 30000,
        grossSalary: 45000,
        pfEligible: true,
        esiEligible: true,
        ptApplicable: true,
        tdsApplicable: true,
        pfUAN: '100555666777',
        esiNumber: 'ESI789012',
        doj: '2023-01-10',
        pfContribution: 3600,
        esiContribution: 337,
        tdsDeduction: 2500,
        ptDeduction: 175,
        lastDeclaration: '2024-03-31'
      },
      { 
        id: 'EMP004', 
        name: 'Emily Davis', 
        employeeId: 'EMP004',
        department: 'HR',
        basicSalary: 35000,
        grossSalary: 48000,
        pfEligible: true,
        esiEligible: true,
        ptApplicable: true,
        tdsApplicable: true,
        pfUAN: '100111222333',
        esiNumber: 'ESI456789',
        doj: '2020-11-05',
        pfContribution: 4200,
        esiContribution: 360,
        tdsDeduction: 3000,
        ptDeduction: 200,
        lastDeclaration: '2024-03-15'
      },
      { 
        id: 'EMP005', 
        name: 'David Wilson', 
        employeeId: 'EMP005',
        department: 'Finance',
        basicSalary: 60000,
        grossSalary: 85000,
        pfEligible: true,
        esiEligible: false,
        ptApplicable: true,
        tdsApplicable: true,
        pfUAN: '100444555666',
        esiNumber: '',
        doj: '2019-08-12',
        pfContribution: 7200,
        esiContribution: 0,
        tdsDeduction: 6000,
        ptDeduction: 200,
        lastDeclaration: '2024-03-31'
      }
    ]);

    // Compliance Forms
    setComplianceForms([
      { id: 1, formName: 'Form 16', employeeName: 'John Smith', financialYear: '2023-24', status: 'generated', generatedDate: '2024-06-15' },
      { id: 2, formName: 'Form 12A', employeeName: 'Sarah Johnson', financialYear: '2023-24', status: 'pending', dueDate: '2024-06-30' },
      { id: 3, formName: 'Form 5', employeeName: 'Mike Chen', financialYear: 'March 2024', status: 'submitted', submittedDate: '2024-04-15' },
      { id: 4, formName: 'ESI Return', employeeName: 'Emily Davis', period: 'Oct 2023 - Mar 2024', status: 'generated', generatedDate: '2024-04-10' },
      { id: 5, formName: 'PT Return', employeeName: 'David Wilson', period: 'March 2024', status: 'submitted', submittedDate: '2024-04-05' }
    ]);

    // Investment Declarations
    setDeclarations([
      { id: 1, employeeName: 'John Smith', financialYear: '2024-25', status: 'submitted', submittedDate: '2024-01-31', verified: true },
      { id: 2, employeeName: 'Sarah Johnson', financialYear: '2024-25', status: 'pending', dueDate: '2024-06-30', verified: false },
      { id: 3, employeeName: 'Mike Chen', financialYear: '2024-25', status: 'draft', lastModified: '2024-03-15', verified: false },
      { id: 4, employeeName: 'Emily Davis', financialYear: '2024-25', status: 'submitted', submittedDate: '2024-01-28', verified: true },
      { id: 5, employeeName: 'David Wilson', financialYear: '2024-25', status: 'submitted', submittedDate: '2024-02-10', verified: true }
    ]);

    // Reconciliation Reports
    setReconciliationReports([
      { id: 1, reportName: 'PF Reconciliation', period: 'March 2024', status: 'completed', generatedDate: '2024-04-10', type: 'pf' },
      { id: 2, reportName: 'ESI Reconciliation', period: 'Oct 2023 - Mar 2024', status: 'completed', generatedDate: '2024-04-05', type: 'esi' },
      { id: 3, reportName: 'TDS Reconciliation', period: 'Q4 FY 2023-24', status: 'pending', dueDate: '2024-05-31', type: 'tds' },
      { id: 4, reportName: 'PT Reconciliation', period: 'March 2024', status: 'completed', generatedDate: '2024-04-12', type: 'pt' },
      { id: 5, reportName: 'Annual Compliance', period: 'FY 2023-24', status: 'in-progress', progress: 60, type: 'consolidated' }
    ]);

    // PF Statements
    setPfStatements([
      { id: 1, employeeId: 'EMP001', month: 'March 2024', employeeContribution: 6000, employerContribution: 6000, total: 12000, status: 'paid' },
      { id: 2, employeeId: 'EMP002', month: 'March 2024', employeeContribution: 4800, employerContribution: 4800, total: 9600, status: 'paid' },
      { id: 3, employeeId: 'EMP003', month: 'March 2024', employeeContribution: 3600, employerContribution: 3600, total: 7200, status: 'paid' }
    ]);

    // ESI Statements
    setEsiStatements([
      { id: 1, employeeId: 'EMP002', month: 'March 2024', employeeContribution: 412, employerContribution: 1788, total: 2200, status: 'paid' },
      { id: 2, employeeId: 'EMP003', month: 'March 2024', employeeContribution: 337, employerContribution: 1463, total: 1800, status: 'paid' },
      { id: 3, employeeId: 'EMP004', month: 'March 2024', employeeContribution: 360, employerContribution: 1560, total: 1920, status: 'paid' }
    ]);

    // TDS Statements
    setTdsStatements([
      { id: 1, employeeId: 'EMP001', quarter: 'Q4 FY 2023-24', tdsAmount: 4500, depositedDate: '2024-04-15', challanNo: 'CH123456' },
      { id: 2, employeeId: 'EMP002', quarter: 'Q4 FY 2023-24', tdsAmount: 3500, depositedDate: '2024-04-15', challanNo: 'CH123457' },
      { id: 3, employeeId: 'EMP003', quarter: 'Q4 FY 2023-24', tdsAmount: 2500, depositedDate: '2024-04-15', challanNo: 'CH123458' }
    ]);

    // PF Remittances
    setPfRemittances([
      { id: 1, month: 'March 2024', totalContribution: 36000, employeeContribution: 18000, employerContribution: 18000, challanNo: 'CH789012', remittanceDate: '2024-04-15', status: 'paid' }
    ]);

    // ESI Remittances
    setEsiRemittances([
      { id: 1, period: 'Oct 2023 - Mar 2024', totalContribution: 5920, employeeContribution: 1109, employerContribution: 4811, challanNo: 'CH789013', remittanceDate: '2024-04-10', status: 'paid' }
    ]);

    // TDS Challans
    setTdsChallans([
      { id: 1, quarter: 'Q4 FY 2023-24', tdsAmount: 19500, challanNo: 'CH281001', depositDate: '2024-04-15', status: 'paid' }
    ]);

    // ECR Data
    setEcrData([
      { id: 1, month: 'February 2024', totalEmployees: 5, totalWages: 308000, epfContribution: 25800, epsContribution: 11500, edliContribution: 1500, status: 'submitted', submittedDate: '2024-03-15' }
    ]);

    // VPF Data
    setVpfData([
      { id: 1, name: 'John Smith', employeeId: 'EMP001', vpfRate: 10, vpfAmount: 5000, month: 'March 2024', status: 'active' }
    ]);

    // UAN Activations
    setUanActivations([
      { id: 1, name: 'Mike Chen', employeeId: 'EMP003', uan: '100555666777', activationDate: '2024-01-15', status: 'active' }
    ]);

    setIsLoading(false);
  };

  // Status badge functions
  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-warning-subtle text-warning',
      'submitted': 'bg-info-subtle text-info',
      'generated': 'bg-success-subtle text-success',
      'completed': 'bg-success-subtle text-success',
      'in-progress': 'bg-warning-subtle text-warning',
      'draft': 'bg-secondary-subtle text-secondary',
      'verified': 'bg-success-subtle text-success',
      'paid': 'bg-success-subtle text-success',
      'overdue': 'bg-danger-subtle text-danger',
      'active': 'bg-success-subtle text-success'
    };

    return (
      <span className={`badge ${styles[status] || 'bg-secondary-subtle text-secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      'pf': 'bg-primary-subtle text-primary',
      'esi': 'bg-info-subtle text-info',
      'tds': 'bg-success-subtle text-success',
      'pt': 'bg-warning-subtle text-warning',
      'lwf': 'bg-danger-subtle text-danger',
      'gratuity': 'bg-dark-subtle text-dark',
      'bonus': 'bg-purple-subtle text-purple',
      'consolidated': 'bg-secondary-subtle text-secondary'
    };

    return (
      <span className={`badge ${styles[type] || 'bg-secondary-subtle text-secondary'}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  // Format functions
  const formatCurrency = (amount) => {
    if (amount >= 10000000) { // 1 crore
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) { // 1 thousand
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to download files
  const downloadFile = (content, fileName, format = 'PDF') => {
    let blob, url;
    
    if (format === 'PDF') {
      // Create a simple PDF-like content
      const pdfContent = `
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .content { margin: 20px 0; }
            </style>
          </head>
          <body>
            <h1>${fileName}</h1>
            <div class="content">${content}</div>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </body>
        </html>
      `;
      blob = new Blob([pdfContent], { type: 'text/html' });
      fileName = `${fileName}.html`;
    } else if (format === 'Excel' || format === 'CSV') {
      blob = new Blob([content], { type: 'text/csv' });
      fileName = `${fileName}.csv`;
    } else {
      blob = new Blob([content], { type: 'text/plain' });
      fileName = `${fileName}.txt`;
    }
    
    url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Form content generation functions
  const generateForm16Content = () => {
    let content = "Form 16 - TDS Certificate\n";
    content += "=============================\n\n";
    content += "Financial Year: 2023-24\n";
    content += "Generated Date: " + new Date().toLocaleDateString() + "\n\n";
    
    if (selectedItem) {
      content += "Employee Details:\n";
      content += "-----------------\n";
      content += "Name: " + selectedItem.name + "\n";
      content += "Employee ID: " + selectedItem.employeeId + "\n";
      content += "PAN: AX" + selectedItem.employeeId + "YZ\n\n";
      
      content += "Salary Details:\n";
      content += "----------------\n";
      content += "Gross Salary: " + formatCurrency(selectedItem.grossSalary) + "\n";
      content += "Basic Salary: " + formatCurrency(selectedItem.basicSalary) + "\n";
      content += "TDS Deducted: " + formatCurrency(selectedItem.tdsDeduction) + "\n";
    } else {
      content += "This Form 16 certificate contains TDS details for the financial year.\n";
      content += "Includes Part A and Part B with complete tax computation.\n";
    }
    
    return content;
  };

  const generateForm5Content = () => {
    let content = "Form 5 - PF Return\n";
    content += "====================\n\n";
    content += "Period: March 2024\n";
    content += "Submission Date: " + new Date().toLocaleDateString() + "\n\n";
    
    content += "Total Employees: " + kpis.totalEmployees + "\n";
    content += "Total PF Contribution: " + formatCurrency(kpis.totalPFContribution) + "\n";
    content += "Employee Contribution: " + formatCurrency(kpis.totalPFContribution * 0.5) + "\n";
    content += "Employer Contribution: " + formatCurrency(kpis.totalPFContribution * 0.5) + "\n\n";
    
    content += "Employee-wise PF Details:\n";
    content += "-------------------------\n";
    employees.forEach(emp => {
      if (emp.pfEligible) {
        content += emp.name + " (" + emp.employeeId + "): " + formatCurrency(emp.pfContribution) + "\n";
      }
    });
    
    return content;
  };

  const generateESIContent = () => {
    let content = "ESI Return - Half Yearly\n";
    content += "==========================\n\n";
    content += "Period: Oct 2023 - Mar 2024\n";
    content += "Registration No: " + esiConfig.registrationNumber + "\n";
    content += "Branch Code: " + esiConfig.branchCode + "\n\n";
    
    content += "Total ESI Contribution: " + formatCurrency(kpis.totalESIContribution) + "\n";
    content += "Employee Contribution: " + formatCurrency(kpis.totalESIContribution * 0.75 / 4) + "\n";
    content += "Employer Contribution: " + formatCurrency(kpis.totalESIContribution * 3.25 / 4) + "\n\n";
    
    return content;
  };

  // NEW: View button handler for detailed data popup
  const handleViewData = (data, type) => {
    setViewModalData({ data, type });
    setShowModal(true);
  };

  // Action handlers
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleGenerateForm = (formType) => {
    setSelectedForm(formType);
    setShowFormModal(true);
  };

  const handleDownloadForm = (formId) => {
    const form = complianceForms.find(f => f.id === formId);
    if (form) {
      let content = "";
      let fileName = "";
      
      switch(form.formName) {
        case 'Form 16':
          content = generateForm16Content();
          fileName = `Form16_${form.employeeName.replace(/\s+/g, '_')}_${form.financialYear}`;
          break;
        case 'Form 5':
          content = generateForm5Content();
          fileName = `Form5_${form.employeeName.replace(/\s+/g, '_')}_March_2024`;
          break;
        case 'ESI Return':
          content = generateESIContent();
          fileName = `ESI_Return_${form.employeeName.replace(/\s+/g, '_')}_${form.period.replace(/\s+/g, '_')}`;
          break;
        default:
          content = `${form.formName}\nEmployee: ${form.employeeName}\nPeriod: ${form.financialYear || form.period}\nStatus: ${form.status}`;
          fileName = `${form.formName.replace(/\s+/g, '_')}_${form.employeeName.replace(/\s+/g, '_')}`;
      }
      
      downloadFile(content, fileName, 'PDF');
    }
  };

  const handleCalculatePF = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const employeeContribution = (employee.basicSalary * pfConfig.employeeContribution) / 100;
      const employerContribution = (employee.basicSalary * pfConfig.employerContribution) / 100;
      
      alert(`PF Calculation for ${employee.name}:
      Employee Contribution (${pfConfig.employeeContribution}%): ${formatCurrency(employeeContribution)}
      Employer Contribution (${pfConfig.employerContribution}%): ${formatCurrency(employerContribution)}
      Total: ${formatCurrency(employeeContribution + employerContribution)}`);
    }
  };

  const handleCalculateESI = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee && employee.grossSalary <= esiConfig.salaryThreshold) {
      const employeeContribution = (employee.grossSalary * esiConfig.employeeContribution) / 100;
      const employerContribution = (employee.grossSalary * esiConfig.employerContribution) / 100;
      
      alert(`ESI Calculation for ${employee.name}:
      Employee Contribution (${esiConfig.employeeContribution}%): ${formatCurrency(employeeContribution)}
      Employer Contribution (${esiConfig.employerContribution}%): ${formatCurrency(employerContribution)}
      Total: ${formatCurrency(employeeContribution + employerContribution)}`);
    } else {
      alert('Employee not eligible for ESI (Salary exceeds threshold)');
    }
  };

  const handleCalculatePT = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const slab = ptConfig.slabs.find(s => 
        employee.grossSalary >= s.from && employee.grossSalary <= s.to
      );
      alert(`Professional Tax for ${employee.name}: ${formatCurrency(slab?.amount || 0)}`);
    }
  };

  const handleCalculateTDS = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const annualSalary = employee.grossSalary * 12;
      const taxableIncome = annualSalary - tdsConfig.standardDeduction;
      let tds = 0;
      
      if (tdsConfig.taxRegime === 'new') {
        if (taxableIncome <= 700000) tds = 0;
        else if (taxableIncome <= 900000) tds = (taxableIncome - 700000) * 0.05 / 12;
        else if (taxableIncome <= 1200000) tds = (10000 + (taxableIncome - 900000) * 0.10) / 12;
        else tds = (25000 + (taxableIncome - 1200000) * 0.15) / 12;
      } else {
        const totalDeductions = investmentDeclarations.section80C + 
                                investmentDeclarations.section80D + 
                                investmentDeclarations.hraExemption + 
                                investmentDeclarations.ltaExemption +
                                investmentDeclarations.homeLoanInterest +
                                investmentDeclarations.npsContribution;
        const taxableIncomeOld = annualSalary - tdsConfig.standardDeduction - totalDeductions;
        
        if (taxableIncomeOld <= 250000) tds = 0;
        else if (taxableIncomeOld <= 500000) tds = (taxableIncomeOld - 250000) * 0.05 / 12;
        else if (taxableIncomeOld <= 1000000) tds = (12500 + (taxableIncomeOld - 500000) * 0.20) / 12;
        else tds = (112500 + (taxableIncomeOld - 1000000) * 0.30) / 12;
      }
      
      alert(`TDS Calculation for ${employee.name}:
      Annual Salary: ${formatCurrency(annualSalary)}
      Standard Deduction: ${formatCurrency(tdsConfig.standardDeduction)}
      Taxable Income: ${formatCurrency(annualSalary - tdsConfig.standardDeduction)}
      Monthly TDS Deduction: ${formatCurrency(tds)}
      Annual Projected TDS: ${formatCurrency(tds * 12)}`);
    }
  };

  const handleCalculateGratuity = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const doj = new Date(employee.doj);
      const now = new Date();
      const yearsOfService = (now - doj) / (1000 * 60 * 60 * 24 * 365.25);
      
      if (yearsOfService >= gratuityConfig.eligibilityYears) {
        const gratuity = (employee.basicSalary * 15 * yearsOfService) / 26;
        const cappedGratuity = Math.min(gratuity, gratuityConfig.ceilingLimit);
        
        alert(`Gratuity Calculation for ${employee.name}:
        Years of Service: ${yearsOfService.toFixed(2)}
        Last Drawn Salary: ${formatCurrency(employee.basicSalary)}
        Calculated Gratuity: ${formatCurrency(gratuity)}
        Capped Amount: ${formatCurrency(cappedGratuity)}`);
      } else {
        alert(`Employee needs ${(gratuityConfig.eligibilityYears - yearsOfService).toFixed(2)} more years for gratuity eligibility`);
      }
    }
  };

  const handleCalculateBonus = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const bonus = Math.max(
        (employee.basicSalary * bonusConfig.calculationRate) / 100,
        bonusConfig.minimumBonus
      );
      
      alert(`Bonus Calculation for ${employee.name}:
      Bonus Amount: ${formatCurrency(bonus)}
      (${bonusConfig.calculationRate}% of basic salary or minimum ${formatCurrency(bonusConfig.minimumBonus)})`);
    }
  };

  const handleUpdateConfig = (section, key, value) => {
    switch(section) {
      case 'pf':
        setPfConfig(prev => ({ ...prev, [key]: value }));
        break;
      case 'esi':
        setEsiConfig(prev => ({ ...prev, [key]: value }));
        break;
      case 'pt':
        setPtConfig(prev => ({ ...prev, [key]: value }));
        break;
      case 'tds':
        setTdsConfig(prev => ({ ...prev, [key]: value }));
        break;
      case 'lwf':
        setLwfConfig(prev => ({ ...prev, [key]: value }));
        break;
      case 'gratuity':
        setGratuityConfig(prev => ({ ...prev, [key]: value }));
        break;
      case 'bonus':
        setBonusConfig(prev => ({ ...prev, [key]: value }));
        break;
      default:
        break;
    }
  };

  // Modal Handlers
  const handleGenerateECR = () => {
    if (!ecrFormData.month) {
      alert('Please select a month');
      return;
    }

    const newECR = {
      id: ecrData.length + 1,
      month: ecrFormData.month,
      totalEmployees: employees.length,
      totalWages: ecrFormData.totalWages || employees.reduce((sum, emp) => sum + emp.grossSalary, 0),
      epfContribution: ecrFormData.epfContribution || kpis.totalPFContribution * 0.6667,
      epsContribution: ecrFormData.epsContribution || kpis.totalPFContribution * 0.3333,
      edliContribution: ecrFormData.edliContribution || kpis.totalPFContribution * 0.005,
      status: 'generated',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setEcrData([...ecrData, newECR]);
    setShowECRModal(false);
    setEcrFormData({
      month: '',
      totalWages: '',
      epfContribution: '',
      epsContribution: '',
      edliContribution: ''
    });
    alert('ECR generated successfully!');
  };

  const handleAddRemittance = () => {
    if (!remittanceFormData.month || !remittanceFormData.totalContribution) {
      alert('Please fill all required fields');
      return;
    }

    const newRemittance = {
      id: remittanceType === 'pf' ? pfRemittances.length + 1 : esiRemittances.length + 1,
      month: remittanceFormData.month,
      totalContribution: parseFloat(remittanceFormData.totalContribution),
      employeeContribution: parseFloat(remittanceFormData.employeeContribution) || parseFloat(remittanceFormData.totalContribution) / 2,
      employerContribution: parseFloat(remittanceFormData.employerContribution) || parseFloat(remittanceFormData.totalContribution) / 2,
      challanNo: remittanceFormData.challanNo || `CH${Math.floor(100000 + Math.random() * 900000)}`,
      remittanceDate: remittanceFormData.remittanceDate || new Date().toISOString().split('T')[0],
      status: 'paid'
    };

    if (remittanceType === 'pf') {
      setPfRemittances([...pfRemittances, newRemittance]);
    } else if (remittanceType === 'esi') {
      setEsiRemittances([...esiRemittances, newRemittance]);
    }

    setShowRemittanceModal(false);
    setRemittanceFormData({
      month: '',
      totalContribution: '',
      employeeContribution: '',
      employerContribution: '',
      challanNo: '',
      remittanceDate: ''
    });
    alert(`${remittanceType.toUpperCase()} remittance added successfully!`);
  };

  const handleGenerateChallan = () => {
    if (!challanFormData.period || !challanFormData.amount) {
      alert('Please fill all required fields');
      return;
    }

    const newChallan = {
      id: tdsChallans.length + 1,
      quarter: challanFormData.period,
      tdsAmount: parseFloat(challanFormData.amount),
      challanNo: `CH281${Math.floor(1000 + Math.random() * 9000)}`,
      depositDate: challanFormData.paymentDate || new Date().toISOString().split('T')[0],
      status: 'generated'
    };

    setTdsChallans([...tdsChallans, newChallan]);
    setShowChallanModal(false);
    setChallanFormData({
      period: '',
      amount: '',
      paymentDate: '',
      format: 'PDF'
    });
    alert('Challan generated successfully!');
  };

  const handleActivateUAN = () => {
    if (!selectedEmployeeForUAN || !uanFormData.uanNumber) {
      alert('Please select employee and enter UAN number');
      return;
    }

    const newUAN = {
      id: uanActivations.length + 1,
      name: selectedEmployeeForUAN.name,
      employeeId: selectedEmployeeForUAN.employeeId,
      uan: uanFormData.uanNumber,
      activationDate: uanFormData.activationDate || new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setUanActivations([...uanActivations, newUAN]);
    
    // Update employee UAN
    setEmployees(prev => prev.map(emp => 
      emp.id === selectedEmployeeForUAN.id 
        ? { ...emp, pfUAN: uanFormData.uanNumber }
        : emp
    ));

    setShowUANModal(false);
    setSelectedEmployeeForUAN(null);
    setUanFormData({
      uanNumber: '',
      activationDate: ''
    });
    alert('UAN activated successfully!');
  };

  const handleAddVPF = () => {
    if (!vpfFormData.employeeId || !vpfFormData.vpfRate) {
      alert('Please select employee and enter VPF rate');
      return;
    }

    const employee = employees.find(emp => emp.id === vpfFormData.employeeId);
    if (!employee) {
      alert('Employee not found');
      return;
    }

    const vpfAmount = (employee.basicSalary * parseFloat(vpfFormData.vpfRate)) / 100;

    const newVPF = {
      id: vpfData.length + 1,
      name: employee.name,
      employeeId: employee.employeeId,
      vpfRate: parseFloat(vpfFormData.vpfRate),
      vpfAmount: vpfAmount,
      month: vpfFormData.month || 'March 2024',
      status: 'active'
    };

    setVpfData([...vpfData, newVPF]);
    setShowVPFModal(false);
    setVpfFormData({
      employeeId: '',
      vpfRate: '',
      month: ''
    });
    alert('VPF added successfully!');
  };

  const handleExportReport = () => {
    let csvData = [];
    let headers = [];
    
    switch(activeSection) {
      case 'employees':
        headers = ['Employee ID', 'Name', 'Department', 'Basic Salary', 'PF Contribution', 'ESI Contribution', 'TDS Deduction'];
        csvData = employees.map(emp => [
          emp.employeeId, 
          emp.name, 
          emp.department, 
          formatCurrency(emp.basicSalary), 
          formatCurrency(emp.pfContribution), 
          formatCurrency(emp.esiContribution), 
          formatCurrency(emp.tdsDeduction)
        ]);
        break;
      case 'forms':
        headers = ['Form Name', 'Employee', 'Financial Year/Period', 'Status', 'Date'];
        csvData = complianceForms.map(form => [
          form.formName, 
          form.employeeName, 
          form.financialYear || form.period, 
          form.status, 
          form.generatedDate || form.submittedDate || 'N/A'
        ]);
        break;
      case 'reports':
        headers = ['Report Name', 'Period', 'Status', 'Generated Date', 'Type'];
        csvData = reconciliationReports.map(report => [
          report.reportName, 
          report.period, 
          report.status, 
          report.generatedDate || 'N/A', 
          report.type
        ]);
        break;
      default:
        headers = ['Data', 'Export'];
        csvData = [['No data to export']];
    }
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance_${activeSection}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadInitialData();
      setCurrentPage(1);
      setSearchTerm('');
      setFilterType('All');
      alert('Compliance data refreshed successfully!');
    }, 1000);
  };

  const handleViewChallan = (challanNo) => {
    const challan = tdsChallans.find(c => c.challanNo === challanNo) || 
                   pfRemittances.find(c => c.challanNo === challanNo) ||
                   esiRemittances.find(c => c.challanNo === challanNo);
    
    if (challan) {
      setSelectedItem(challan);
      setShowModal(true);
    } else {
      alert(`Challan ${challanNo} details not found.`);
    }
  };

  const handleReconcileReport = (reportId) => {
    const report = reconciliationReports.find(r => r.id === reportId);
    if (report) {
      let content = `${report.reportName} - Reconciliation Report\n`;
      content += `Period: ${report.period}\n`;
      content += `Generated: ${new Date().toLocaleDateString()}\n\n`;
      
      if (report.type === 'pf') {
        content += `Total PF Contribution: ${formatCurrency(kpis.totalPFContribution)}\n`;
        content += `Employee Contribution: ${formatCurrency(kpis.totalPFContribution * 0.5)}\n`;
        content += `Employer Contribution: ${formatCurrency(kpis.totalPFContribution * 0.5)}\n`;
      } else if (report.type === 'tds') {
        content += `Total TDS Deducted: ${formatCurrency(kpis.totalTDSDeduction)}\n`;
      }
      
      setReconciliationReports(prev => 
        prev.map(r => r.id === reportId ? { ...r, status: 'completed', generatedDate: new Date().toISOString().split('T')[0] } : r)
      );
      
      downloadFile(content, `Reconciliation_${report.reportName.replace(/\s+/g, '_')}`, 'PDF');
      alert(`Reconciliation report for ${report.reportName} generated successfully!`);
    }
  };

  // Helper components for consistent styling
  const ButtonWithIcon = ({ icon, children, className = '', iconClassName = '', ...props }) => (
    <button className={`btn d-flex align-items-center justify-content-center ${className}`} {...props}>
      <Icon icon={icon} className={`${iconClassName} me-2`} style={{ fontSize: '1rem', lineHeight: 1 }} />
      {children}
    </button>
  );

  const QuickLinkCard = ({ icon, title, description, onClick, color = 'primary' }) => (
    <div className="card border h-100" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-body text-center d-flex flex-column align-items-center justify-content-center">
        <div className={`bg-${color}-subtle text-${color} p-3 rounded-circle mb-3`}>
          <Icon icon={icon} style={{ fontSize: '1.5rem' }} />
        </div>
        <h6 className="fw-bold mb-2">{title}</h6>
        <p className="text-muted small mb-0">{description}</p>
      </div>
    </div>
  );

  // NEW: Function to render view modal content based on data type
  const renderViewModalContent = () => {
    if (!viewModalData) return null;
    
    const { data, type } = viewModalData;
    
    switch(type) {
      case 'employee':
        return (
          <div className="row g-3">
            <div className="col-md-6">
              <label className=" small fw-bold">Employee Name</label>
              <p className="form-control-plaintext ">{data.name}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Employee ID</label>
              <p className="form-control-plaintext">{data.employeeId}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Department</label>
              <p className="form-control-plaintext">{data.department}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Date of Joining</label>
              <p className="form-control-plaintext">{formatDate(data.doj)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Basic Salary</label>
              <p className="form-control-plaintext fw-bold text-primary">{formatCurrency(data.basicSalary)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Gross Salary</label>
              <p className="form-control-plaintext">{formatCurrency(data.grossSalary)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">PF Contribution</label>
              <p className="form-control-plaintext">{formatCurrency(data.pfContribution)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">ESI Contribution</label>
              <p className="form-control-plaintext">{formatCurrency(data.esiContribution)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">TDS Deduction</label>
              <p className="form-control-plaintext">{formatCurrency(data.tdsDeduction)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Professional Tax</label>
              <p className="form-control-plaintext">{formatCurrency(data.ptDeduction)}</p>
            </div>
            <div className="col-12">
              <label className=" small fw-bold">PF UAN Number</label>
              <p className="form-control-plaintext">{data.pfUAN || 'N/A'}</p>
            </div>
            <div className="col-12">
              <label className=" small fw-bold">ESI Number</label>
              <p className="form-control-plaintext">{data.esiNumber || 'N/A'}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">PF Eligible</label>
              <p className="form-control-plaintext">{data.pfEligible ? 'Yes' : 'No'}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">ESI Eligible</label>
              <p className="form-control-plaintext">{data.esiEligible ? 'Yes' : 'No'}</p>
            </div>
          </div>
        );
        
      case 'pfStatement':
        return (
          <div className="row g-3">
            <div className="col-md-6">
              <label className=" small fw-bold">Employee ID</label>
              <p className="form-control-plaintext">{data.employeeId}</p>
            </div>
            <div className="col-md-6">
              <label className="small fw-bold">Month</label>
              <p className="form-control-plaintext">{data.month}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Employee Contribution</label>
              <p className="form-control-plaintext fw-bold text-primary">{formatCurrency(data.employeeContribution)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Employer Contribution</label>
              <p className="form-control-plaintext fw-bold text-success">{formatCurrency(data.employerContribution)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Total PF</label>
              <p className="form-control-plaintext fw-bold">{formatCurrency(data.total)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Status</label>
              <div>{getStatusBadge(data.status)}</div>
            </div>
          </div>
        );
        
      case 'form':
        return (
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Form Name</label>
              <p className="form-control-plaintext fw-bold">{data.formName}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Employee Name</label>
              <p className="form-control-plaintext">{data.employeeName}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">
                {data.financialYear ? 'Financial Year' : 'Period'}
              </label>
              <p className="form-control-plaintext">{data.financialYear || data.period}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Status</label>
              <div>{getStatusBadge(data.status)}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">
                {data.generatedDate ? 'Generated Date' : 
                 data.submittedDate ? 'Submitted Date' : 'Date'}
              </label>
              <p className="form-control-plaintext">
                {data.generatedDate || data.submittedDate || 'N/A'}
              </p>
            </div>
            {data.dueDate && (
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Due Date</label>
                <p className="form-control-plaintext">{formatDate(data.dueDate)}</p>
              </div>
            )}
          </div>
        );
        
      case 'declaration':
        return (
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Employee Name</label>
              <p className="form-control-plaintext fw-bold">{data.employeeName}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Financial Year</label>
              <p className="form-control-plaintext">{data.financialYear}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Status</label>
              <div>{getStatusBadge(data.status)}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Verified</label>
              <p className="form-control-plaintext">
                {data.verified ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Submitted Date</label>
              <p className="form-control-plaintext">{formatDate(data.submittedDate)}</p>
            </div>
            {data.dueDate && (
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Due Date</label>
                <p className="form-control-plaintext">{formatDate(data.dueDate)}</p>
              </div>
            )}
            {data.lastModified && (
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Last Modified</label>
                <p className="form-control-plaintext">{formatDate(data.lastModified)}</p>
              </div>
            )}
          </div>
        );
        
      case 'report':
        return (
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Report Name</label>
              <p className="form-control-plaintext fw-bold">{data.reportName}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Period</label>
              <p className="form-control-plaintext">{data.period}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Type</label>
              <div>{getTypeBadge(data.type)}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Status</label>
              <div>{getStatusBadge(data.status)}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Generated Date</label>
              <p className="form-control-plaintext">{formatDate(data.generatedDate)}</p>
            </div>
            {data.progress && (
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Progress</label>
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${data.progress}%` }}
                  >
                    {data.progress}%
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'ecr':
        return (
          <div className="row g-3">
            <div className="col-md-6">
              <label className=" small fw-bold">Month</label>
              <p className="form-control-plaintext">{data.month}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Total Employees</label>
              <p className="form-control-plaintext">{data.totalEmployees}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Total Wages</label>
              <p className="form-control-plaintext fw-bold text-primary">{formatCurrency(data.totalWages)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">EPF Contribution</label>
              <p className="form-control-plaintext">{formatCurrency(data.epfContribution)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">EPS Contribution</label>
              <p className="form-control-plaintext">{formatCurrency(data.epsContribution)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">EDLI Contribution</label>
              <p className="form-control-plaintext">{formatCurrency(data.edliContribution)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Status</label>
              <div>{getStatusBadge(data.status)}</div>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Submitted Date</label>
              <p className="form-control-plaintext">{formatDate(data.submittedDate)}</p>
            </div>
          </div>
        );
        
      case 'vpf':
        return (
          <div className="row g-3">
            <div className="col-md-6">
              <label className=" small fw-bold">Employee Name</label>
              <p className="form-control-plaintext ">{data.name}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Employee ID</label>
              <p className="form-control-plaintext">{data.employeeId}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">VPF Rate</label>
              <p className="form-control-plaintext fw-bold text-primary">{data.vpfRate}%</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">VPF Amount</label>
              <p className="form-control-plaintext">{formatCurrency(data.vpfAmount)}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Month</label>
              <p className="form-control-plaintext">{data.month}</p>
            </div>
            <div className="col-md-6">
              <label className=" small fw-bold">Status</label>
              <div>{getStatusBadge(data.status)}</div>
            </div>
          </div>
        );
        
      default:
        return (
          <div>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  // Sidebar content
  const sidebarContent = (
    <nav className="space-y-1 p-3">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Compliance Sections
      </div>
      
      <button 
        className={`w-full d-flex align-items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'pf' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('pf')}
      >
        <Icon icon="heroicons:building-library" className="me-3 h-5 w-5" />
        Provident Fund (PF)
      </button>
      
      <button 
        className={`w-full d-flex align-items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'esi' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('esi')}
      >
        <Icon icon="heroicons:heart" className="me-3 h-5 w-5" />
        Employee State Insurance (ESI)
      </button>
      
      <button 
        className={`w-full d-flex align-items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'pt' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('pt')}
      >
        <Icon icon="heroicons:briefcase" className="me-3 h-5 w-5" />
        Professional Tax (PT)
      </button>
      
      <button 
        className={`w-full d-flex align-items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'tds' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('tds')}
      >
        <Icon icon="heroicons:banknotes" className="me-3 h-5 w-5" />
        TDS Management
      </button>
      
      <button 
        className={`w-full d-flex align-items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'lwf' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('lwf')}
      >
        <Icon icon="heroicons:users" className="me-3 h-5 w-5" />
        Labour Welfare Fund
      </button>
      
      <button 
        className={`w-full d-flex align-items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'gratuity' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('gratuity')}
      >
        <Icon icon="heroicons:gift" className="me-3 h-5 w-5" />
        Gratuity Management
      </button>
      
      <button 
        className={`w-full d-flex align-items-center px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'bonus' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
        onClick={() => setActiveSection('bonus')}
      >
        <Icon icon="heroicons:sparkles" className="me-3 h-5 w-5" />
        Bonus Act Compliance
      </button>
      
      <div className="pt-4 border-top border-gray-200 mt-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Compliance Status
        </div>
        <div className="space-y-2">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-sm text-gray-600">Total Employees:</span>
            <span className="font-semibold text-primary">{formatNumber(kpis.totalEmployees)}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-sm text-gray-600">PF Eligible:</span>
            <span className="font-semibold text-success">{formatNumber(kpis.eligiblePF)}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-sm text-gray-600">ESI Eligible:</span>
            <span className="font-semibold text-info">{formatNumber(kpis.eligibleESI)}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-sm text-gray-600">Pending Declarations:</span>
            <span className="font-semibold text-warning">{formatNumber(kpis.pendingDeclarations)}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-sm text-gray-600">Total PF Contribution:</span>
            <span className="font-semibold text-primary">{formatCurrency(kpis.totalPFContribution)}</span>
          </div>
        </div>
      </div>
    </nav>
  );

  // Function to generate form content from modal
  const generateAndDownloadForm = (format = 'PDF') => {
    if (!selectedForm) return;
    
    let formContent = '';
    let fileName = '';
    
    switch(selectedForm) {
      case 'Form16':
        formContent = generateForm16Content();
        fileName = `Form_16_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'Form5':
      case 'PF':
        formContent = generateForm5Content();
        fileName = `Form_5_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'ESI':
        formContent = generateESIContent();
        fileName = `ESI_Return_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'PT':
        formContent = `Professional Tax Return\nPeriod: March 2024\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
        formContent += `Total PT Collection: ${formatCurrency(employees.reduce((sum, emp) => sum + emp.ptDeduction, 0))}\n`;
        formContent += `State: ${ptConfig.state}\n`;
        fileName = `PT_Return_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'Form24Q':
        formContent = `Form 24Q - Quarterly TDS Return\n`;
        formContent += `Quarter: Q4 FY 2023-24\n`;
        formContent += `Total TDS: ${formatCurrency(kpis.totalTDSDeduction)}\n`;
        fileName = `Form24Q_Q4_2023_24`;
        break;
      default:
        formContent = `Form: ${selectedForm}\nGenerated on: ${new Date().toLocaleDateString()}\n`;
        fileName = `${selectedForm}_${new Date().toISOString().split('T')[0]}`;
    }
    
    downloadFile(formContent, fileName, format);
  };

  const renderPF = () => (
    <div className="row g-4">
      {/* PF Configuration */}
      <div className="col-12">
        <div className="card border shadow-none">
          <div className="card-header bg-transparent border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold h6 h2-md">Provident Fund (PF) Configuration</h5>
              <ButtonWithIcon 
                icon="heroicons:document-plus"
                className="btn-primary"
                onClick={() => handleGenerateForm('PF')}
              >
                Generate Form 
              </ButtonWithIcon>
            </div>
          </div>
          <div className="card-body">
            <div className="row g-4">
              {/* Contribution Rates */}
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-header">
                    <h6 className="fw-bold h6 h2-md">Contribution Rates (%)</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="fw-bold form-label">Employee Contribution</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={pfConfig.employeeContribution}
                          onChange={(e) => handleUpdateConfig('pf', 'employeeContribution', parseFloat(e.target.value))}
                          step="0.01"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold form-label">Employer Contribution</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={pfConfig.employerContribution}
                          onChange={(e) => handleUpdateConfig('pf', 'employerContribution', parseFloat(e.target.value))}
                          step="0.01"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className=" fw-bold form-label">EPS Contribution</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={pfConfig.epsContribution}
                          onChange={(e) => handleUpdateConfig('pf', 'epsContribution', parseFloat(e.target.value))}
                          step="0.01"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold  form-label">EDLI Contribution</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={pfConfig.edliContribution}
                          onChange={(e) => handleUpdateConfig('pf', 'edliContribution', parseFloat(e.target.value))}
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-header">
                    <h6 className="fw-bold h6 h2-md">PF Settings</h6>
                  </div>
                  <div className="card-body">
                    <style>
                      {`
                        .form-check-input.custom-checkbox-tick {
                          width: 18px;
                          height: 18px;
                          border: 2px solid #6c757d;
                          border-radius: 3px;
                          cursor: pointer;
                          appearance: none;
                          -webkit-appearance: none;
                          -moz-appearance: none;
                          position: relative;
                          background-color: white;
                          transition: all 0.2s ease;
                        }
                        
                        .form-check-input.custom-checkbox-tick:checked {
                          background-color: #0d6efd;
                          border-color: #0d6efd;
                        }
                        
                        .form-check-input.custom-checkbox-tick:checked::after {
                          content: '✓';
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                          color: white;
                          font-size: 12px;
                          font-weight: bold;
                        }
                        
                        .form-check-input.custom-checkbox-tick:hover {
                          border-color: #0d6efd;
                        }
                        
                        .form-check-input.custom-checkbox-tick:focus {
                          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                          outline: none;
                        }
                        
                        .form-check-label {
                          cursor: pointer;
                          user-select: none;
                          margin-left: 8px;
                        }
                      `}
                    </style>
                    
                    <div className="row g-3">
                      <div className="col-12">
                        <label className=" fw-bold form-label">Ceiling Limit (₹)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={pfConfig.ceilingLimit}
                          onChange={(e) => handleUpdateConfig('pf', 'ceilingLimit', parseFloat(e.target.value))}
                        />
                        <small className=" fw-bold text-muted">PF contribution calculated on basic up to this limit</small>
                      </div>
                      <div className="col-12">
                        <div className="form-check d-flex align-items-center">
                          <input 
                            className="form-check-input custom-checkbox-tick"
                            type="checkbox"
                            id="autoPF"
                            checked={pfConfig.autoCalculation}
                            onChange={(e) => handleUpdateConfig('pf', 'autoCalculation', e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="autoPF">
                            Auto PF Calculation
                          </label>
                        </div>
                        <div className="form-check d-flex align-items-center mt-2">
                          <input 
                            className="form-check-input custom-checkbox-tick"
                            type="checkbox"
                            id="uanMandatory"
                            checked={pfConfig.uanMandatory}
                            onChange={(e) => handleUpdateConfig('pf', 'uanMandatory', e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="uanMandatory">
                            UAN Number Mandatory
                          </label>
                        </div>
                        <div className="form-check d-flex align-items-center mt-2">
                          <input 
                            className="form-check-input custom-checkbox-tick"
                            type="checkbox"
                            id="enableVPF"
                            checked={pfConfig.vpfEnabled}
                            onChange={(e) => handleUpdateConfig('pf', 'vpfEnabled', e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="enableVPF">
                            Enable VPF (Voluntary Provident Fund)
                          </label>
                        </div>
                      </div>
                      {pfConfig.vpfEnabled && (
                        <div className="col-12">
                          <label className=" fw-bold form-label">Default VPF Rate (%)</label>
                          <input 
                            type="number" 
                            className="form-control"
                            value={pfConfig.vpfRate}
                            onChange={(e) => handleUpdateConfig('pf', 'vpfRate', parseFloat(e.target.value))}
                            step="0.01"
                            min="0"
                            max="100"
                          />
                          <small className=" fw-bold text-muted">Default VPF contribution rate (optional, employees can customize)</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* PF Eligibility Rules */}
              <div className="col-md-6">
                <div className="card border h-100">
                  <div className="card-header">
                    <h6 className="fw-bold h6 h2-md">PF Eligibility Rules</h6>
                  </div>
                  <div className="card-body">
                    <style>
                      {`
                        .form-check-input.custom-checkbox-tick {
                          width: 18px;
                          height: 18px;
                          border: 2px solid #6c757d;
                          border-radius: 3px;
                          cursor: pointer;
                          appearance: none;
                          -webkit-appearance: none;
                          -moz-appearance: none;
                          position: relative;
                          background-color: white;
                          transition: all 0.2s ease;
                        }
                        
                        .form-check-input.custom-checkbox-tick:checked {
                          background-color: #0d6efd;
                          border-color: #0d6efd;
                        }
                        
                        .form-check-input.custom-checkbox-tick:checked::after {
                          content: '✓';
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                          color: white;
                          font-size: 12px;
                          font-weight: bold;
                        }
                        
                        .form-check-input.custom-checkbox-tick:hover {
                          border-color: #0d6efd;
                        }
                        
                        .form-check-input.custom-checkbox-tick:focus {
                          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                          outline: none;
                        }
                        
                        .form-check-label {
                          cursor: pointer;
                          user-select: none;
                          margin-left: 8px;
                        }
                      `}
                    </style>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className=" fw-bold form-label">Minimum Salary (₹)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={pfConfig.eligibilityRules.minimumSalary}
                          onChange={(e) => handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, minimumSalary: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className=" fw-bold form-label">Maximum Salary (₹)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={pfConfig.eligibilityRules.maximumSalary || ''}
                          onChange={(e) => handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, maximumSalary: e.target.value ? parseFloat(e.target.value) : null })}
                          placeholder="No limit"
                        />
                      </div>
                      <div className="col-12">
                        <label className=" fw-bold form-label">Employment Types</label>
                        <div className="form-check d-flex align-items-center">
                          <input 
                            className="form-check-input custom-checkbox-tick"
                            type="checkbox"
                            id="empTypePermanent"
                            checked={pfConfig.eligibilityRules.employmentType.includes('permanent')}
                            onChange={(e) => {
                              const types = e.target.checked 
                                ? [...pfConfig.eligibilityRules.employmentType, 'permanent']
                                : pfConfig.eligibilityRules.employmentType.filter(t => t !== 'permanent');
                              handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, employmentType: types });
                            }}
                          />
                          <label className="form-check-label" htmlFor="empTypePermanent">Permanent</label>
                        </div>
                        <div className="form-check d-flex align-items-center">
                          <input 
                            className="form-check-input custom-checkbox-tick"
                            type="checkbox"
                            id="empTypeContract"
                            checked={pfConfig.eligibilityRules.employmentType.includes('contract')}
                            onChange={(e) => {
                              const types = e.target.checked 
                                ? [...pfConfig.eligibilityRules.employmentType, 'contract']
                                : pfConfig.eligibilityRules.employmentType.filter(t => t !== 'contract');
                              handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, employmentType: types });
                            }}
                          />
                          <label className="form-check-label" htmlFor="empTypeContract">Contract</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <label className=" fw-bold form-label">Probation Period (days)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={pfConfig.eligibilityRules.probationPeriod}
                          onChange={(e) => handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, probationPeriod: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="col-12">
                        <div className="form-check d-flex align-items-center">
                          <input 
                            className="form-check-input custom-checkbox-tick"
                            type="checkbox"
                            id="autoEnrollment"
                            checked={pfConfig.eligibilityRules.autoEnrollment}
                            onChange={(e) => handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, autoEnrollment: e.target.checked })}
                          />
                          <label className=" fw-bold form-check-label" htmlFor="autoEnrollment">
                            Auto-enroll eligible employees
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PF Statements */}
              <div className="col-12">
                <div className="card border">
                  <div className="card-header">
                    <h6 className="fw-bold h6 h2-md">PF Statements - March 2024</h6>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Employee Contribution</th>
                            <th>Employer Contribution</th>
                            <th>Total PF</th>
                            <th>UAN Number</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pfStatements.map(statement => {
                            const employee = employees.find(emp => emp.employeeId === statement.employeeId);
                            return (
                              <tr key={statement.id}>
                                <td>{statement.employeeId}</td>
                                <td>{employee?.name || 'N/A'}</td>
                                <td className="text-primary">{formatCurrency(statement.employeeContribution)}</td>
                                <td className="text-success">{formatCurrency(statement.employerContribution)}</td>
                                <td className="fw-bold">{formatCurrency(statement.total)}</td>
                                <td>{employee?.pfUAN || 'N/A'}</td>
                                <td>{getStatusBadge(statement.status)}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <ButtonWithIcon 
                                      icon="heroicons:eye"
                                      className="btn-sm btn-outline-primary d-flex align-items-center"
                                      onClick={() => handleViewData(statement, 'pfStatement')}
                                    >
                                      View
                                    </ButtonWithIcon>
                                    <ButtonWithIcon 
                                      icon="heroicons:calculator"
                                      className="btn-sm btn-outline-success d-flex align-items-center"
                                      onClick={() => handleCalculatePF(employee?.id)}
                                    >
                                      Calculate
                                    </ButtonWithIcon>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* PF Remittance Summary */}
              <div className="col-12">
                <div className="card border">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold h6 h2-md">PF Remittance Summary</h6>
                      <ButtonWithIcon
                        icon="heroicons:plus"
                        className="btn-sm btn-primary"
                        onClick={() => {
                          setRemittanceType('pf');
                          setShowRemittanceModal(true);
                        }}
                      >
                        Add Remittance
                      </ButtonWithIcon>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>Total Contribution</th>
                            <th>Employee Contribution</th>
                            <th>Employer Contribution</th>
                            <th>Challan Number</th>
                            <th>Remittance Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pfRemittances.map(remittance => (
                            <tr key={remittance.id}>
                              <td>{remittance.month}</td>
                              <td className="fw-bold">{formatCurrency(remittance.totalContribution)}</td>
                              <td className="text-primary">{formatCurrency(remittance.employeeContribution)}</td>
                              <td className="text-success">{formatCurrency(remittance.employerContribution)}</td>
                              <td>{remittance.challanNo}</td>
                              <td>{remittance.remittanceDate}</td>
                              <td>{getStatusBadge(remittance.status)}</td>
                              <td>
                              <button 
  className="btn btn-sm btn-outline-primary"
  onClick={() => alert(`Viewing challan: ${remittance.challanNo}`)}
>
  View Challan
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

              {/* ECR Generation */}
              <div className="col-12">
                <div className="card border">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold h6 h2-md">ECR (Electronic Challan cum Return)</h6>
                      <ButtonWithIcon
                        icon="heroicons:document-plus"
                        className="btn-sm btn-success"
                        onClick={() => setShowECRModal(true)}
                      >
                        Generate ECR
                      </ButtonWithIcon>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>Total Employees</th>
                            <th>Total Wages</th>
                            <th>EPF Contribution</th>
                            <th>EPS Contribution</th>
                            <th>EDLI Contribution</th>
                            <th>Status</th>
                            <th>Submitted Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ecrData.map(ecr => (
                            <tr key={ecr.id}>
                              <td>{ecr.month}</td>
                              <td>{ecr.totalEmployees}</td>
                              <td>{formatCurrency(ecr.totalWages)}</td>
                              <td>{formatCurrency(ecr.epfContribution)}</td>
                              <td>{formatCurrency(ecr.epsContribution)}</td>
                              <td>{formatCurrency(ecr.edliContribution)}</td>
                              <td>{getStatusBadge(ecr.status)}</td>
                              <td>{ecr.submittedDate}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleViewData(ecr, 'ecr')}
                                  >
                                    View
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => {
                                      const content = `ECR Report for ${ecr.month}\nTotal Wages: ${formatCurrency(ecr.totalWages)}\nEPF Contribution: ${formatCurrency(ecr.epfContribution)}\nEPS Contribution: ${formatCurrency(ecr.epsContribution)}`;
                                      downloadFile(content, `ECR_${ecr.month.replace(/\s+/g, '_')}`, 'PDF');
                                    }}
                                  >
                                    Download
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

              {/* VPF Management */}
              {pfConfig.vpfEnabled && (
                <div className="col-12">
                  <div className="card border">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold h6 h2-md">VPF (Voluntary Provident Fund) Management</h6>
                        <ButtonWithIcon
                          icon="heroicons:plus"
                          className="btn-sm btn-primary"
                          onClick={() => setShowVPFModal(true)}
                        >
                          Add VPF
                        </ButtonWithIcon>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>VPF Rate (%)</th>
                              <th>VPF Amount</th>
                              <th>Month</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vpfData.map((vpf, idx) => (
                              <tr key={idx}>
                                <td>
                                  <div className="fw-semibold">{vpf.name}</div>
                                  <div className="small text-muted">{vpf.employeeId}</div>
                                </td>
                                <td>{vpf.vpfRate}%</td>
                                <td className="fw-bold text-primary">{formatCurrency(vpf.vpfAmount)}</td>
                                <td>{vpf.month}</td>
                                <td>{getStatusBadge(vpf.status)}</td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleViewData(vpf, 'vpf')}
                                  >
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
              )}

              {/* UAN Management */}
              <div className="col-12">
                <div className="card border">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold h6 h2-md">UAN Activation & Management</h6>
                      <ButtonWithIcon
                        icon="heroicons:plus"
                        className="btn-sm btn-primary"
                        onClick={() => setShowUANModal(true)}
                      >
                        Activate UAN
                      </ButtonWithIcon>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>UAN Number</th>
                            <th>Activation Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uanActivations.map(uan => (
                            <tr key={uan.id}>
                              <td>
                                <div className="fw-semibold">{uan.name}</div>
                                <div className="small text-muted">{uan.employeeId}</div>
                              </td>
                              <td className="fw-bold">{uan.uan}</td>
                              <td>{uan.activationDate}</td>
                              <td>{getStatusBadge(uan.status)}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleViewData(uan, 'employee')}
                                  >
                                    View Details
                                  </button>
                                  {uan.status === 'pending' && (
                                    <button className="btn btn-sm btn-outline-success">
                                      Activate
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

              {/* PF Reports */}
              <div className="col-12">
                <div className="card border">
                  <div className="card-header">
                    <h6 className="fw-bold h6 h2-md">PF Reports & Forms</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-lg-3 col-md-6">
                        <div className="card border h-100">
                          <div className="card-body text-center d-flex flex-column align-items-center justify-content-center">
                            <div className="bg-primary-subtle text-primary p-3 rounded-circle mb-3">
                              <Icon icon="heroicons:document-text" style={{ fontSize: '1.5rem' }} />
                            </div>
                            <h6 className="fw-bold mb-2">Form 5/10C</h6>
                            <p className="text-muted small mb-3">Monthly PF Return</p>
                            <ButtonWithIcon
                              icon="heroicons:document-arrow-down"
                              className="btn-outline-primary w-100"
                              onClick={() => handleGenerateForm('Form5')}
                            >
                              Generate
                            </ButtonWithIcon>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="card border h-100">
                          <div className="card-body text-center d-flex flex-column align-items-center justify-content-center">
                            <div className="bg-warning-subtle text-warning p-3 rounded-circle mb-3">
                              <Icon icon="heroicons:document-duplicate" style={{ fontSize: '1.5rem' }} />
                            </div>
                            <h6 className="fw-bold mb-2">Form 12A</h6>
                            <p className="text-muted small mb-3">Exit/Transfer Form</p>
                            <ButtonWithIcon
                              icon="heroicons:document-arrow-down"
                              className="btn-outline-warning w-100"
                              onClick={() => handleGenerateForm('Form12A')}
                            >
                              Generate
                            </ButtonWithIcon>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="card border h-100">
                          <div className="card-body text-center d-flex flex-column align-items-center justify-content-center">
                            <div className="bg-success-subtle text-success p-3 rounded-circle mb-3">
                              <Icon icon="heroicons:document-chart-bar" style={{ fontSize: '1.5rem' }} />
                            </div>
                            <h6 className="fw-bold mb-2">ReconciliationReport</h6>
                            <p className="text-muted small mb-3">PF Contribution Reconciliation</p>
                            <ButtonWithIcon
                              icon="heroicons:document-arrow-down"
                              className="btn-outline-success w-100"
                              onClick={() => {
                                setShowReconciliationModal(true);
                                setRemittanceType('pf');
                              }}
                            >
                              Generate
                            </ButtonWithIcon>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6">
                        <div className="card border h-100">
                          <div className="card-body text-center d-flex flex-column align-items-center justify-content-center">
                            <div className="bg-info-subtle text-info p-3 rounded-circle mb-3">
                              <Icon icon="heroicons:arrow-down-tray" style={{ fontSize: '1.5rem' }} />
                            </div>
                            <h6 className="fw-bold mb-2">UAN Update</h6>
                            <p className="text-muted small mb-3">Employee UAN Details</p>
                            <ButtonWithIcon
                              icon="heroicons:arrow-down-tray"
                              className="btn-outline-info w-100"
                              onClick={() => {
                                const content = employees.map(emp => `${emp.name},${emp.employeeId},${emp.pfUAN || 'N/A'}`).join('\n');
                                downloadFile(`Name,Employee ID,UAN\n${content}`, 'UAN_Report', 'CSV');
                              }}
                            >
                              Download Report
                            </ButtonWithIcon>
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

  const renderEmployees = () => (
    <div className="card border shadow-none">
      <div className="card-header bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Employee Compliance Status</h5>
          <div className="d-flex gap-2">
            <ButtonWithIcon 
              icon="heroicons:document-arrow-down"
              className="btn-primary"
              onClick={handleExportReport}
            >
              Export
            </ButtonWithIcon>
            <ButtonWithIcon 
              icon="heroicons:arrow-path"
              className="btn-outline-primary"
              onClick={handleRefreshData}
            >
              Refresh
            </ButtonWithIcon>
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
                placeholder="Search employees..."
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
                <option value="All">All Employees</option>
                <option value="pfEligible">PF Eligible</option>
                <option value="esiEligible">ESI Eligible</option>
                <option value="tdsApplicable">TDS Applicable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Employee ID</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Name</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Department</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Basic Salary</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">PF</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">ESI</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">TDS</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Last Declaration</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((employee) => (
                <tr key={employee.id} className="border-bottom">
                  <td className="px-4 py-3">
                    <div className="fw-medium text-dark">{employee.employeeId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="fw-medium text-dark">{employee.name}</div>
                    <div className="small text-muted">{employee.department}</div>
                  </td>
                  <td className="px-4 py-3">{employee.department}</td>
                  <td className="px-4 py-3 fw-bold">{formatCurrency(employee.basicSalary)}</td>
                  <td className="px-4 py-3">
                    <div className={`badge ${employee.pfEligible ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                      {employee.pfEligible ? 'Eligible' : 'Not Eligible'}
                    </div>
                    <div className="small text-muted">{formatCurrency(employee.pfContribution)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`badge ${employee.esiEligible ? 'bg-info-subtle text-info' : 'bg-secondary-subtle text-secondary'}`}>
                      {employee.esiEligible ? 'Eligible' : 'Not Eligible'}
                    </div>
                    <div className="small text-muted">{formatCurrency(employee.esiContribution)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`badge ${employee.tdsApplicable ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'}`}>
                      {employee.tdsApplicable ? 'Applicable' : 'Not Applicable'}
                    </div>
                    <div className="small text-muted">{formatCurrency(employee.tdsDeduction)}</div>
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(employee.lastDeclaration)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleViewData(employee, 'employee')}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </button>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                          Calculate
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button className="dropdown-item" onClick={() => handleCalculatePF(employee.id)}>
                              PF Calculation
                            </button>
                          </li>
                          {employee.esiEligible && (
                            <li>
                              <button className="dropdown-item" onClick={() => handleCalculateESI(employee.id)}>
                                ESI Calculation
                              </button>
                            </li>
                          )}
                          <li>
                            <button className="dropdown-item" onClick={() => handleCalculateTDS(employee.id)}>
                              TDS Calculation
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => handleCalculatePT(employee.id)}>
                              PT Calculation
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => handleCalculateGratuity(employee.id)}>
                              Gratuity Calculation
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => handleCalculateBonus(employee.id)}>
                              Bonus Calculation
                            </button>
                          </li>
                        </ul>
                      </div>
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
            <p>No employees match your search criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between">
            <div className="small text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} employees
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

  const renderForms = () => (
    <div className="card border shadow-none">
      <div className="card-header bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Compliance Forms & Returns</h5>
          <div className="d-flex gap-2">
            <ButtonWithIcon 
              icon="heroicons:document-arrow-down"
              className="btn-primary"
              onClick={handleExportReport}
            >
              Export
            </ButtonWithIcon>
            <ButtonWithIcon 
              icon="heroicons:arrow-path"
              className="btn-outline-primary"
              onClick={handleRefreshData}
            >
              Refresh
            </ButtonWithIcon>
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
                placeholder="Search forms..."
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
                <option value="submitted">Submitted</option>
                <option value="generated">Generated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Forms Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Form Name</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Employee</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Period</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Status</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Date</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((form) => (
                <tr key={form.id} className="border-bottom">
                  <td className="px-4 py-3">
                    <div className="fw-medium text-dark">{form.formName}</div>
                  </td>
                  <td className="px-4 py-3">{form.employeeName}</td>
                  <td className="px-4 py-3">{form.financialYear || form.period}</td>
                  <td className="px-4 py-3">{getStatusBadge(form.status)}</td>
                  <td className="px-4 py-3">{form.generatedDate || form.submittedDate || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleViewData(form, 'form')}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </button>
                      {form.status === 'generated' && (
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleDownloadForm(form.id)}
                        >
                          Download
                        </button>
                      )}
                      {form.status === 'pending' && (
                        <button 
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleGenerateForm(form.formName)}
                        >
                          Generate
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
            <h5>No forms found</h5>
            <p>No forms match your search criteria.</p>
          </div>
        )}

        {/* Form Types Summary */}
        <div className="p-4 border-top">
          <h6 className="mb-3">Available Form Types</h6>
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <QuickLinkCard
                icon="heroicons:document-text"
                title="Form 16"
                description="Generate TDS certificates"
                onClick={() => handleGenerateForm('Form16')}
                color="primary"
              />
            </div>
            <div className="col-md-3 col-6">
              <QuickLinkCard
                icon="heroicons:document-chart-bar"
                title="Form 5/10C"
                description="PF Return"
                onClick={() => handleGenerateForm('Form5')}
                color="success"
              />
            </div>
            <div className="col-md-3 col-6">
              <QuickLinkCard
                icon="heroicons:document-duplicate"
                title="ESI Return"
                description="Half-yearly submission"
                onClick={() => handleGenerateForm('ESI')}
                color="info"
              />
            </div>
            <div className="col-md-3 col-6">
              <QuickLinkCard
                icon="heroicons:document"
                title="PT Return"
                description="Monthly/Annual"
                onClick={() => handleGenerateForm('PT')}
                color="warning"
              />
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between">
            <div className="small text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} forms
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

  const renderDeclarations = () => (
    <div className="card border shadow-none">
      <div className="card-header bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Investment Declarations</h5>
          <div className="d-flex gap-2">
            <ButtonWithIcon 
              icon="heroicons:document-arrow-down"
              className="btn-primary"
              onClick={handleExportReport}
            >
              Export
            </ButtonWithIcon>
            <ButtonWithIcon 
              icon="heroicons:arrow-path"
              className="btn-outline-primary"
              onClick={handleRefreshData}
            >
              Refresh
            </ButtonWithIcon>
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
                placeholder="Search declarations..."
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
                <option value="submitted">Submitted</option>
                <option value="draft">Draft</option>
                <option value="verified">Verified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Declarations Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Employee</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Financial Year</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Status</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Submitted Date</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Verified</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((declaration) => (
                <tr key={declaration.id} className="border-bottom">
                  <td className="px-4 py-3">
                    <div className="fw-medium text-dark">{declaration.employeeName}</div>
                  </td>
                  <td className="px-4 py-3">{declaration.financialYear}</td>
                  <td className="px-4 py-3">{getStatusBadge(declaration.status)}</td>
                  <td className="px-4 py-3">
                    {declaration.submittedDate ? formatDate(declaration.submittedDate) : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    {declaration.verified ? (
                      <span className="badge bg-success-subtle text-success">Yes</span>
                    ) : (
                      <span className="badge bg-warning-subtle text-warning">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewData(declaration, 'declaration')}
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

        {paginatedData.length === 0 && (
          <div className="text-center py-5 text-muted">
            <Icon icon="heroicons:clipboard-document-check" className="text-4xl mb-3" />
            <h5>No declarations found</h5>
            <p>No declarations match your search criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between">
            <div className="small text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} declarations
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

  const renderReports = () => (
    <div className="card border shadow-none">
      <div className="card-header bg-transparent border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Compliance Reports</h5>
          <div className="d-flex gap-2">
            <ButtonWithIcon 
              icon="heroicons:document-arrow-down"
              className="btn-primary"
              onClick={handleExportReport}
            >
              Export
            </ButtonWithIcon>
            <ButtonWithIcon 
              icon="heroicons:arrow-path"
              className="btn-outline-primary"
              onClick={handleRefreshData}
            >
              Refresh
            </ButtonWithIcon>
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
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control ps-5"
              />
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3 text-uppercase fw-bold text-dark">Report Name</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Period</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Type</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Status</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Generated Date</th>
                <th className="border-0 px-3 py-3 text-uppercase fw-bold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((report) => (
                <tr key={report.id} className="border-bottom">
                  <td className="px-4 py-3">
                    <div className="fw-medium text-dark">{report.reportName}</div>
                  </td>
                  <td className="px-4 py-3">{report.period}</td>
                  <td className="px-4 py-3">{getTypeBadge(report.type)}</td>
                  <td className="px-4 py-3">{getStatusBadge(report.status)}</td>
                  <td className="px-4 py-3">
                    {report.generatedDate ? formatDate(report.generatedDate) : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleViewData(report, 'report')}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </button>
                      {report.status === 'completed' && (
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => {
                            const content = `${report.reportName}\nPeriod: ${report.period}\nGenerated: ${new Date().toLocaleDateString()}`;
                            downloadFile(content, report.reportName.replace(/\s+/g, '_'), 'PDF');
                          }}
                        >
                          Download
                        </button>
                      )}
                      {report.status === 'pending' && (
                        <button 
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleReconcileReport(report.id)}
                        >
                          Reconcile
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
            <Icon icon="heroicons:chart-bar" className="text-4xl mb-3" />
            <h5>No reports found</h5>
            <p>No reports match your search criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-top d-flex align-items-center justify-content-between">
            <div className="small text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} reports
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

  const renderContent = () => {
    switch(activeSection) {
      case 'pf':
        return renderPF();
      case 'esi':
        return (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border shadow-none">
                <div className="card-header bg-transparent border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Employee State Insurance (ESI) Configuration</h5>
                    <ButtonWithIcon 
                      icon="heroicons:document-plus"
                      className="btn-primary"
                      onClick={() => handleGenerateForm('ESI')}
                    >
                      Generate ESI Return
                    </ButtonWithIcon>
                  </div>
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <Icon icon="heroicons:information-circle" className="me-2" />
                    ESI section - Use the Generate ESI Return button to create and download ESI forms
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'pt':
        return (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border shadow-none">
                <div className="card-header bg-transparent border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Professional Tax (PT) Configuration</h5>
                    <ButtonWithIcon 
                      icon="heroicons:document-plus"
                      className="btn-primary"
                      onClick={() => handleGenerateForm('PT')}
                    >
                      Generate PT Return
                    </ButtonWithIcon>
                  </div>
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <Icon icon="heroicons:information-circle" className="me-2" />
                    PT section - Use the Generate PT Return button to create and download PT forms
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tds':
        return (
          <div className="row g-4">
            <div className="col-12">
              <div className="card border shadow-none">
                <div className="card-header bg-transparent border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Tax Deducted at Source (TDS) Management</h5>
                    <ButtonWithIcon 
                      icon="heroicons:document-plus"
                      className="btn-primary"
                      onClick={() => handleGenerateForm('Form16')}
                    >
                      Generate Form 16
                    </ButtonWithIcon>
                  </div>
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <Icon icon="heroicons:information-circle" className="me-2" />
                    TDS section - Use the Generate Form 16 button to create and download TDS forms
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'employees':
        return renderEmployees();
      case 'forms':
        return renderForms();
      case 'declarations':
        return renderDeclarations();
      case 'reports':
        return renderReports();
      default:
        return renderPF();
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
    <>
      {/* Add custom styles for better alignment */}
      <style>{`
        .btn-with-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
        }
        
        .btn-with-icon svg {
          flex-shrink: 0;
        }
        
        .card-body-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1.5rem !important;
        }
        
        .card-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin-bottom: 1rem;
        }
        
        .quick-link-card {
          transition: all 0.3s ease;
          border: 1px solid var(--bs-border-color);
          height: 100%;
          cursor: pointer;
        }
        
        .quick-link-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          border-color: var(--bs-primary);
        }
        
        .quick-link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-bottom: 0.75rem;
        }
        
        .table-actions {
          white-space: nowrap;
        }
        
        .card-header-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .kpi-card {
          height: 100%;
          border-left: 4px solid transparent;
        }
        
        .kpi-card.border-primary {
          border-left-color: var(--bs-primary);
        }
        
        .kpi-card.border-info {
          border-left-color: var(--bs-info);
        }
        
        .kpi-card.border-success {
          border-left-color: var(--bs-success);
        }
        
        .kpi-card.border-warning {
          border-left-color: var(--bs-warning);
        }
        
        .kpi-number {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .card-header-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .btn-group-responsive {
            flex-direction: column;
            width: 100%;
          }
          
          .btn-group-responsive .btn {
            width: 100%;
            margin-bottom: 0.5rem;
          }
          
          .quick-link-card {
            margin-bottom: 1rem;
          }
          
          .kpi-number {
            font-size: 1.25rem;
          }
        }
      `}</style>
      
      <div className="container-fluid">
        {/* Header */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            {activeSection !== 'pf' && (
              <ButtonWithIcon
                icon="heroicons:arrow-left"
                className="btn-link text-decoration-none p-0"
                onClick={() => setActiveSection('pf')}
              >
                Back to Compliance
              </ButtonWithIcon>
            )}
          </div>
          <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
            <Icon icon="heroicons:shield-check" className="text-primary" />
            Statutory Compliance Engine 
          </h5>
          <p className="text-muted">
            Manage PF, ESI, TDS, Professional Tax, LWF, Gratuity, and Bonus compliance with automated calculations
          </p>
        </div>

        {/* Compliance Status Summary */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card kpi-card border border-primary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="fw-bold ">Total PF Contribution</p>
                    <h6 className="kpi-number text-primary mb-0">{formatCurrency(kpis.totalPFContribution)}</h6>
                  </div>
                  <div className="bg-primary-subtle text-primary p-2 rounded">
                    <Icon icon="heroicons:building-library" style={{ fontSize: '1rem' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card kpi-card border border-info">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="fw-bold ">Total ESI Contribution</p>
                    <h6 className="kpi-number text-info mb-0">{formatCurrency(kpis.totalESIContribution)}</h6>
                  </div>
                  <div className="bg-info-subtle text-info p-2 rounded">
                    <Icon icon="heroicons:heart" style={{ fontSize: '1rem' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card kpi-card border border-success">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="fw-bold ">Total TDS Deduction</p>
                    <h6 className="kpi-number text-success mb-0">{formatCurrency(kpis.totalTDSDeduction)}</h6>
                  </div>
                  <div className="bg-success-subtle text-success p-2 rounded">
                    <Icon icon="heroicons:banknotes" style={{ fontSize: '1rem' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card kpi-card border border-warning">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="fw-bold ">Pending Declarations</p>
                    <h6 className="kpi-number text-warning mb-0">{formatNumber(kpis.pendingDeclarations)}</h6>
                  </div>
                  <div className="bg-warning-subtle text-warning p-2 rounded">
                    <Icon icon="heroicons:clock" style={{ fontSize: '1rem' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {renderContent()}

        {/* View Data Modal - NEW */}
    {showModal && viewModalData && (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ 
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1050
  }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title d-flex align-items-center gap-2">
            <Icon icon="heroicons:eye" />
            {viewModalData.type === 'employee' ? 'Employee Details' : 
             viewModalData.type === 'pfStatement' ? 'PF Statement Details' :
             viewModalData.type === 'form' ? 'Form Details' :
             viewModalData.type === 'declaration' ? 'Declaration Details' :
             viewModalData.type === 'report' ? 'Report Details' :
             viewModalData.type === 'ecr' ? 'ECR Details' :
             viewModalData.type === 'vpf' ? 'VPF Details' : 'Details'}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setShowModal(false);
              setViewModalData(null);
            }}
          ></button>
        </div>
        <div className="modal-body">
          {renderViewModalContent()}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowModal(false);
              setViewModalData(null);
            }}
          >
            Close
          </button>
          {viewModalData.type === 'form' && viewModalData.data.status === 'generated' && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                handleDownloadForm(viewModalData.data.id);
                setShowModal(false);
                setViewModalData(null);
              }}
            >
              Download Form
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
)}

        {/* Generate Form Modal */}
      {showFormModal && selectedForm && (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h6 className=" fw-bold modal-title d-flex align-items-center gap-2">
            <Icon icon="heroicons:document-plus" />
            Generate {selectedForm} Form
          </h6>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setShowFormModal(false);
              setSelectedForm(null);
            }}
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-4">
            <label className=" fw-bold  mb-2">Select Period</label>
            <select className="form-select">
              <option>March 2024</option>
              <option>Q4 FY 2023-24</option>
              <option>Full Year 2023-24</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className=" fw-bold mb-2">Format</label>
          <div className="d-flex gap-3">
  <div className="form-check">
    <input 
      className="form-check-input" 
      type="radio" 
      name="format" 
      id="pdf" 
      value="pdf" 
      defaultChecked 
      style={{
        width: '1.25em',
        height: '1.25em',
        backgroundColor: '#fff',
        border: '1px solid #adb5bd'
      }}
    />
    <label className="form-check-label" htmlFor="pdf">
      PDF
    </label>
  </div>
  <div className="form-check">
    <input 
      className="form-check-input" 
      type="radio" 
      name="format" 
      id="excel" 
      value="excel"
      style={{
        width: '1.25em',
        height: '1.25em',
        backgroundColor: '#fff',
        border: '1px solid #adb5bd'
      }}
    />
    <label className="form-check-label" htmlFor="excel">
      Excel
    </label>
  </div>
  <div className="form-check">
    <input 
      className="form-check-input" 
      type="radio" 
      name="format" 
      id="csv" 
      value="csv"
      style={{
        width: '1.25em',
        height: '1.25em',
        backgroundColor: '#fff',
        border: '1px solid #adb5bd'
      }}
    />
    <label className="form-check-label" htmlFor="csv">
      CSV
    </label>
  </div>
</div>
          </div>

          <div className="alert alert-info d-flex align-items-start">
            <Icon icon="heroicons:information-circle" className="me-2 flex-shrink-0 mt-1" />
            <div>
              The form will be generated with all relevant employee data and calculations.
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowFormModal(false);
              setSelectedForm(null);
            }}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => {
              const formatInput = document.querySelector('input[name="format"]:checked');
              const format = formatInput ? formatInput.value : 'pdf';
              
              generateAndDownloadForm(format);
              setShowFormModal(false);
              setSelectedForm(null);
            }}
          >
            <Icon icon="heroicons:document-arrow-down" />
            Generate & Download
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* UAN Activation Modal */}
     {showUANModal && (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ 
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1050
  }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h6 className=" fw-bold modal-title">UAN Activation & Management</h6>
          <button type="button" className="btn-close" onClick={() => setShowUANModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="fw-bold ">Select Employee</label>
            <select 
              className="form-select"
              value={selectedEmployeeForUAN?.id || ''}
              onChange={(e) => setSelectedEmployeeForUAN(employees.find(emp => emp.id === e.target.value))}
            >
              <option value="">Select employee...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>
              ))}
            </select>
          </div>
          {selectedEmployeeForUAN && (
            <div className="row g-3">
              <div className="col-md-6">
                <label className="fw-bold ">UAN Number</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Enter 12-digit UAN"
                  maxLength="12"
                  value={uanFormData.uanNumber}
                  onChange={(e) => setUanFormData({...uanFormData, uanNumber: e.target.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Activation Date</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={uanFormData.activationDate}
                  onChange={(e) => setUanFormData({...uanFormData, activationDate: e.target.value})}
                />
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowUANModal(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleActivateUAN}>Activate UAN</button>
        </div>
      </div>
    </div>
  </div>
)}
        {/* ECR Generation Modal */}
    {showECRModal && (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ 
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1050
  }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h6 className=" fw-bold modal-title">Generate ECR (Electronic Challan cum Return)</h6>
          <button type="button" className="btn-close" onClick={() => setShowECRModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="fw-bold ">Select Month</label>
            <select 
              className="form-select"
              value={ecrFormData.month}
              onChange={(e) => setEcrFormData({...ecrFormData, month: e.target.value})}
            >
              <option value="">Select month...</option>
              <option value="March 2024">March 2024</option>
              <option value="February 2024">February 2024</option>
              <option value="January 2024">January 2024</option>
            </select>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="fw-bold ">Total Wages (₹)</label>
              <input 
                type="number" 
                className="form-control"
                value={ecrFormData.totalWages}
                onChange={(e) => setEcrFormData({...ecrFormData, totalWages: e.target.value})}
                placeholder="Total wages for the month"
              />
            </div>
            <div className="col-md-6">
              <label className="fw-bold ">EPF Contribution (₹)</label>
              <input 
                type="number" 
                className="form-control"
                value={ecrFormData.epfContribution}
                onChange={(e) => setEcrFormData({...ecrFormData, epfContribution: e.target.value})}
                placeholder="EPF contribution amount"
              />
            </div>
            <div className="col-md-6">
              <label className="fw-bold ">EPS Contribution (₹)</label>
              <input 
                type="number" 
                className="form-control"
                value={ecrFormData.epsContribution}
                onChange={(e) => setEcrFormData({...ecrFormData, epsContribution: e.target.value})}
                placeholder="EPS contribution amount"
              />
            </div>
            <div className="col-md-6">
              <label className="fw-bold ">EDLI Contribution (₹)</label>
              <input 
                type="number" 
                className="form-control"
                value={ecrFormData.edliContribution}
                onChange={(e) => setEcrFormData({...ecrFormData, edliContribution: e.target.value})}
                placeholder="EDLI contribution amount"
              />
            </div>
          </div>
          <div className="alert alert-info d-flex align-items-start mt-3">
            <Icon icon="heroicons:information-circle" className="me-2 flex-shrink-0 mt-1" />
            <div>
              ECR will include all eligible employees with their wages, EPF, EPS, and EDLI contributions.
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowECRModal(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleGenerateECR}>Generate ECR</button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Remittance Modal */}
     {showRemittanceModal && (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ 
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1050
  }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h6 className=" fw-bold modal-title">
            {remittanceType === 'pf' ? 'PF' : remittanceType === 'esi' ? 'ESI' : 'PT'} Remittance
          </h6>
          <button type="button" className="btn-close" onClick={() => setShowRemittanceModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className=" fw-bold ">Month/Period</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="March 2024" 
                value={remittanceFormData.month}
                onChange={(e) => setRemittanceFormData({...remittanceFormData, month: e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <label className=" fw-bold  ">Challan Number</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter challan number" 
                value={remittanceFormData.challanNo}
                onChange={(e) => setRemittanceFormData({...remittanceFormData, challanNo: e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <label className=" fw-bold">Total Contribution (₹)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Enter amount" 
                value={remittanceFormData.totalContribution}
                onChange={(e) => setRemittanceFormData({...remittanceFormData, totalContribution: e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <label className= " fw-bold ">Employee Contribution (₹)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Employee share" 
                value={remittanceFormData.employeeContribution}
                onChange={(e) => setRemittanceFormData({...remittanceFormData, employeeContribution: e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <label className=" fw-bold ">Employer Contribution (₹)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Employer share" 
                value={remittanceFormData.employerContribution}
                onChange={(e) => setRemittanceFormData({...remittanceFormData, employerContribution: e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <label className=" fw-bold ">Remittance Date</label>
              <input 
                type="date" 
                className="form-control" 
                value={remittanceFormData.remittanceDate}
                onChange={(e) => setRemittanceFormData({...remittanceFormData, remittanceDate: e.target.value})}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowRemittanceModal(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleAddRemittance}>Save Remittance</button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* Challan Modal */}
        {showChallanModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Generate {remittanceType === 'pf' ? 'PF' : remittanceType === 'esi' ? 'ESI' : remittanceType === 'pt' ? 'PT' : 'TDS'} Challan
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowChallanModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Period</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="March 2024" 
                        value={challanFormData.period}
                        onChange={(e) => setChallanFormData({...challanFormData, period: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Amount (₹)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Enter amount" 
                        value={challanFormData.amount}
                        onChange={(e) => setChallanFormData({...challanFormData, amount: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Payment Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={challanFormData.paymentDate}
                        onChange={(e) => setChallanFormData({...challanFormData, paymentDate: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Format</label>
                      <select 
                        className="form-select"
                        value={challanFormData.format}
                        onChange={(e) => setChallanFormData({...challanFormData, format: e.target.value})}
                      >
                        <option value="PDF">PDF</option>
                        <option value="Excel">Excel</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowChallanModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleGenerateChallan}>Generate Challan</button>
                </div>
              </div>
            </div>
          </div>
        )}
    

        {/* Reconciliation Modal */}
      {showReconciliationModal && (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ 
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1050
  }}>
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {remittanceType === 'pf' ? 'PF' : remittanceType === 'esi' ? 'ESI' : 'TDS'} Reconciliation Report
          </h5>
          <button type="button" className="btn-close" onClick={() => setShowReconciliationModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label">Period</label>
              <input type="text" className="form-control" placeholder="March 2024" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Format</label>
              <select className="form-select">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <div className="alert alert-info d-flex align-items-start">
            <Icon icon="heroicons:information-circle" className="me-2 flex-shrink-0 mt-1" />
            <div>
              Reconciliation report will compare deducted vs deposited amounts and highlight any discrepancies.
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowReconciliationModal(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={() => {
            let content = `${remittanceType.toUpperCase()} Reconciliation Report\n`;
            content += `Period: March 2024\n`;
            content += `Generated: ${new Date().toLocaleDateString()}\n\n`;
            
            if (remittanceType === 'pf') {
              content += `Total PF Contribution: ${formatCurrency(kpis.totalPFContribution)}\n`;
              content += `Employee Share: ${formatCurrency(kpis.totalPFContribution * 0.5)}\n`;
              content += `Employer Share: ${formatCurrency(kpis.totalPFContribution * 0.5)}\n`;
            } else if (remittanceType === 'tds') {
              content += `Total TDS Deducted: ${formatCurrency(kpis.totalTDSDeduction)}\n`;
              content += `Total TDS Deposited: ${formatCurrency(kpis.totalTDSDeduction)}\n`;
              content += `Variance: ₹0\n`;
            }
            
            downloadFile(content, `${remittanceType.toUpperCase()}_Reconciliation_Report`, 'PDF');
            setShowReconciliationModal(false);
          }}>Generate Report</button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* VPF Modal */}
       {showVPFModal && (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ 
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1050
  }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h6 className=" fw-bold modal-title">Add VPF (Voluntary Provident Fund)</h6>
          <button type="button" className="btn-close" onClick={() => setShowVPFModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="fw-bold ">Select Employee</label>
              <select 
                className="form-select"
                value={vpfFormData.employeeId}
                onChange={(e) => setVpfFormData({...vpfFormData, employeeId: e.target.value})}
              >
                <option value="">Select employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="fw-bold ">VPF Rate (%)</label>
              <input 
                type="number" 
                className="form-control"
                placeholder="Enter VPF rate"
                min="0"
                max="100"
                step="0.01"
                value={vpfFormData.vpfRate}
                onChange={(e) => setVpfFormData({...vpfFormData, vpfRate: e.target.value})}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-bold ">Effective Month</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="March 2024" 
                value={vpfFormData.month}
                onChange={(e) => setVpfFormData({...vpfFormData, month: e.target.value})}
              />
            </div>
            <div className="col-12">
              <div className="alert alert-info d-flex align-items-start">
                <Icon icon="heroicons:information-circle" className="me-2 flex-shrink-0 mt-1" />
                <div>
                  VPF is a voluntary contribution over and above the statutory PF contribution. Employees can contribute up to 100% of their basic salary.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowVPFModal(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleAddVPF}>Add VPF</button>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
};

export default StatutoryCompliance;