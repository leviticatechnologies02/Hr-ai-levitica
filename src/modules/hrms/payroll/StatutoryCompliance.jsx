import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import StatCard from '../../../shared/components/StatCard';

import ChallanModal from '../modal/ChallanModal';
import ECRModal from '../modal/ECRModal';
import GenerateFormModal from '../modal/GenerateFormModal';
import ReconciliationModal from '../modal/ReconciliationModal';
import RemittanceModal from '../modal/RemittanceModal';
import UANModal from '../modal/UANModal';
import ViewDetailsModal from '../modal/ViewDetailsModal';
import VPFModal from '../modal/VPFModal';
import { statutoryComplianceAPI, employeeAPI } from '../../../shared/utils/api';

const StatutoryCompliance = () => {
  const [activeSection, setActiveSection] = useState('pf');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedEmployeeForUAN, setSelectedEmployeeForUAN] = useState(null);
  const [remittanceType, setRemittanceType] = useState('pf');

  const [modalState, setModalState] = useState({
    type: null,
    data: null,
    isOpen: false
  });

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

  const [ptConfig, setPtConfig] = useState({
    state: 'Maharashtra',
    slabs: [
      { from: 0, to: 7500, amount: 0 },
      { from: 7501, to: 10000, amount: 175 },
      { from: 10001, to: Infinity, amount: 200 }
    ],
    deductionCycle: 'monthly'
  });

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

  const [lwfConfig, setLwfConfig] = useState({
    state: 'Maharashtra',
    employeeContribution: 12,
    employerContribution: 12,
    deductionFrequency: 'annual'
  });

  const [gratuityConfig, setGratuityConfig] = useState({
    eligibilityYears: 5,
    calculationMethod: 'last_drawn',
    ceilingLimit: 2000000,
    autoProvisioning: true
  });

  const [bonusConfig, setBonusConfig] = useState({
    eligibilityThreshold: 21000,
    calculationRate: 8.33,
    minimumBonus: 100,
    partialYearCalculation: true
  });

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
  const [uanActivations, setUanActivations] = useState([]);

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

  // ------------------------------------------------------------------
  // Backend (/api/payroll/statutory) ONLY implements PF-related features:
  // config, eligibility rule, PF statements, PF remittance, ECR, VPF, UAN.
  // ESI, Professional Tax, TDS/Form16/investment declarations, LWF,
  // Gratuity-config, and Bonus-config have NO backend endpoints at all —
  // esiConfig/ptConfig/tdsConfig/lwfConfig/gratuityConfig/bonusConfig and
  // their "Calculate" buttons remain local-only preview calculators (they
  // already only show a toast, never claim to save anything, so leaving
  // them local isn't misleading). Only the 'pf' branches below are wired.
  // ------------------------------------------------------------------
  const [configId, setConfigId] = useState(null);
  const [eligibilityRuleId, setEligibilityRuleId] = useState(null);

  const mapConfig = (c) => ({
    employeeContribution: c.pf_employee_rate,
    employerContribution: c.pf_employer_rate,
    epfContribution: c.eps_contribution_rate,
    epsContribution: Math.max(0, (c.pf_employer_rate || 0) - (c.eps_contribution_rate || 0)),
    edliContribution: c.edli_contribution_rate,
    ceilingLimit: Number(c.pf_ceiling_limit) || 0,
    autoCalculation: !!c.enable_basic_pf_calc,
    uanMandatory: true,
    vpfEnabled: !!c.enable_vpf,
    vpfRate: c.default_vpf_rate,
  });

  const mapEligibility = (e) => ({
    minimumSalary: Number(e?.minimum_salary) || 0,
    maximumSalary: e?.maximum_salary != null ? Number(e.maximum_salary) : null,
    employmentType: [
      e?.allow_permanent && 'permanent',
      e?.allow_contract && 'contract',
      e?.allow_intern && 'intern',
      e?.allow_part_time && 'part_time',
    ].filter(Boolean),
    probationPeriod: e?.probation_period_days || 0,
    autoEnrollment: e?.auto_enroll_eligible ?? true,
  });

  const loadStatutoryData = () => {
    Promise.all([
      statutoryComplianceAPI.getConfig().catch((err) => { console.error('Failed to load statutory config:', err); return null; }),
      statutoryComplianceAPI.getEligibilityRule().catch((err) => { console.error('Failed to load PF eligibility rule:', err); return null; }),
      statutoryComplianceAPI.listPfStatements().catch((err) => { console.error('Failed to load PF statements:', err); return []; }),
      statutoryComplianceAPI.listRemittance().catch((err) => { console.error('Failed to load PF remittance:', err); return []; }),
      statutoryComplianceAPI.listEcrRecords().catch((err) => { console.error('Failed to load ECR records:', err); return []; }),
      statutoryComplianceAPI.listVpfRecords().catch((err) => { console.error('Failed to load VPF records:', err); return []; }),
      statutoryComplianceAPI.listUanRecords().catch((err) => { console.error('Failed to load UAN records:', err); return []; }),
      employeeAPI.list().catch((err) => { console.error('Failed to load employees:', err); return []; }),
    ]).then(([config, eligibility, pfStatementsData, remittanceData, ecrRecords, vpfRecords, uanRecords, employeesData]) => {
      const employeesList = Array.isArray(employeesData) ? employeesData : [];
      const employeesById = new Map(employeesList.map((e) => [e.id, e]));
      setEmployees(employeesList);

      if (config) {
        setConfigId(config.id);
        setPfConfig((prev) => ({ ...prev, ...mapConfig(config) }));
      }
      if (eligibility) {
        setEligibilityRuleId(eligibility.id);
        setPfConfig((prev) => ({ ...prev, eligibilityRules: mapEligibility(eligibility) }));
      }

      setPfStatements((Array.isArray(pfStatementsData) ? pfStatementsData : []).map((s) => {
        const emp = employeesById.get(s.employee_id);
        return {
          id: s.id,
          employeeId: emp?.employeeId || String(s.employee_id),
          employeeDbId: s.employee_id,
          employeeContribution: Number(s.employee_contribution) || 0,
          employerContribution: Number(s.employer_contribution) || 0,
          total: Number(s.total_pf) || 0,
          status: s.status,
          month: s.month,
          year: s.year,
        };
      }));

      setPfRemittances((Array.isArray(remittanceData) ? remittanceData : []).map((r) => ({
        id: r.id,
        month: `${r.month}/${r.year}`,
        totalContribution: Number(r.total_contribution) || 0,
        employeeContribution: Number(r.employee_contribution) || 0,
        employerContribution: Number(r.employer_contribution) || 0,
        challanNo: r.challan_number || '',
        remittanceDate: r.remittance_date || '',
        status: r.status,
      })));

      setEcrData((Array.isArray(ecrRecords) ? ecrRecords : []).map((e) => ({
        id: e.id,
        month: `${e.month}/${e.year}`,
        totalEmployees: e.total_employees,
        totalWages: Number(e.total_wages) || 0,
        epfContribution: Number(e.epf_contribution) || 0,
        epsContribution: Number(e.eps_contribution) || 0,
        edliContribution: Number(e.edli_contribution) || 0,
        status: e.status,
        submittedDate: e.submitted_date || '',
        rawMonth: e.month,
        rawYear: e.year,
      })));

      setVpfData((Array.isArray(vpfRecords) ? vpfRecords : []).map((v) => {
        const emp = employeesById.get(v.employee_id);
        return {
          id: v.id,
          name: v.employee_name || emp?.name,
          employeeId: emp?.employeeId || String(v.employee_id),
          vpfRate: v.vpf_rate,
          vpfAmount: Number(v.vpf_amount) || 0,
          month: `${v.month}/${v.year}`,
          status: v.status,
        };
      }));

      setUanActivations((Array.isArray(uanRecords) ? uanRecords : []).map((u) => {
        const emp = employeesById.get(u.employee_id);
        return {
          id: u.id,
          name: u.employee_name || emp?.name,
          employeeId: emp?.employeeId || String(u.employee_id),
          uan: u.uan_number || '',
          activationDate: u.activation_date || '',
          status: u.status,
        };
      }));
    });
  };

  useEffect(() => {
    loadStatutoryData();
  }, []);

  const openModal = (type, data = null) => {
    setModalState({ type, data, isOpen: true });
  };

  const closeModal = () => {
    setModalState({ type: null, data: null, isOpen: false });
  };

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

  const getFilteredData = () => {
    let data = [];
    switch(activeSection) {
      case 'employees':
        data = employees.filter(item => 
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item[filterType] === true);
        }
        break;
      case 'forms':
        data = complianceForms.filter(item => 
          item.formName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'declarations':
        data = declarations.filter(item => 
          item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.financialYear?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filterType !== 'All') {
          data = data.filter(item => item.status === filterType);
        }
        break;
      case 'reports':
        data = reconciliationReports.filter(item => 
          item.reportName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.period?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      default:
        data = [];
    }
    return data;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'submitted': 'bg-blue-50 text-blue-700 border border-blue-200',
      'generated': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'completed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'in-progress': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'draft': 'bg-slate-50 text-slate-700 border border-slate-200',
      'verified': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'paid': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'overdue': 'bg-rose-50 text-rose-700 border border-rose-200',
      'active': 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : 'N/A'}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      'pf': 'bg-blue-50 text-blue-700 border border-blue-200',
      'esi': 'bg-cyan-50 text-cyan-700 border border-cyan-200',
      'tds': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'pt': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'lwf': 'bg-rose-50 text-rose-700 border border-rose-200',
      'gratuity': 'bg-slate-50 text-slate-700 border border-slate-200',
      'bonus': 'bg-purple-50 text-purple-700 border border-purple-200',
      'consolidated': 'bg-slate-50 text-slate-700 border border-slate-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {type ? type.toUpperCase() : 'N/A'}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
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

  const downloadFile = (content, fileName, format = 'PDF') => {
    let blob, url;
    
    if (format === 'PDF' || format === 'pdf') {
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
    } else if (format === 'Excel' || format === 'excel' || format === 'CSV' || format === 'csv') {
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

  const generateForm16Content = () => {
    let content = "Form 16 - TDS Certificate\n";
    content += "=============================\n\n";
    content += "Financial Year: 2023-24\n";
    content += "Generated Date: " + new Date().toLocaleDateString() + "\n\n";
    
    if (modalState.data && modalState.data.viewType === 'employee') {
      const item = modalState.data;
      content += "Employee Details:\n";
      content += "-----------------\n";
      content += "Name: " + (item.name || 'N/A') + "\n";
      content += "Employee ID: " + (item.employeeId || 'N/A') + "\n";
      content += "PAN: AX" + (item.employeeId || 'N/A') + "YZ\n\n";
      
      content += "Salary Details:\n";
      content += "----------------\n";
      content += "Gross Salary: " + formatCurrency(item.grossSalary) + "\n";
      content += "Basic Salary: " + formatCurrency(item.basicSalary) + "\n";
      content += "TDS Deducted: " + formatCurrency(item.tdsDeduction) + "\n";
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
        content += (emp.name || 'N/A') + " (" + (emp.employeeId || 'N/A') + "): " + formatCurrency(emp.pfContribution) + "\n";
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

  const handleViewDetails = (item, viewType = 'employee') => {
    openModal('view', { ...item, viewType });
  };

  const handleGenerateForm = (formType) => {
    setSelectedForm(formType);
    openModal('form');
  };

  const handleDownloadForm = (formId) => {
    const form = complianceForms.find(f => f.id === formId);
    if (form) {
      let content = "";
      let fileName = "";
      
      switch(form.formName) {
        case 'Form 16':
          content = generateForm16Content();
          fileName = `Form16_${form.employeeName?.replace(/\s+/g, '_') || 'Unknown'}_${form.financialYear}`;
          break;
        case 'Form 5':
          content = generateForm5Content();
          fileName = `Form5_${form.employeeName?.replace(/\s+/g, '_') || 'Unknown'}_March_2024`;
          break;
        case 'ESI Return':
          content = generateESIContent();
          fileName = `ESI_Return_${form.employeeName?.replace(/\s+/g, '_') || 'Unknown'}_${form.period?.replace(/\s+/g, '_') || 'Unknown'}`;
          break;
        default:
          content = `${form.formName}\nEmployee: ${form.employeeName}\nPeriod: ${form.financialYear || form.period}\nStatus: ${form.status}`;
          fileName = `${form.formName?.replace(/\s+/g, '_') || 'Form'}_${form.employeeName?.replace(/\s+/g, '_') || 'Unknown'}`;
      }
      
      downloadFile(content, fileName, 'PDF');
      toast.success('Form downloaded successfully!');
    }
  };

  const handleGenerateECR = (data) => {
    // ECRModal sends month as "March 2024", not "YYYY-MM" — parse that.
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [monthName, yearStr] = (data.month || '').split(' ');
    const monthIndex = monthNames.indexOf(monthName);
    const month = monthIndex >= 0 ? monthIndex + 1 : new Date().getMonth() + 1;
    const year = yearStr ? Number(yearStr) : new Date().getFullYear();

    // Real server-side generation from actual PF statements on file for
    // this month/year — previously this fabricated totalWages/contributions
    // client-side from whatever local `employees`/`kpis` happened to hold.
    statutoryComplianceAPI.generateEcr(month, year)
      .then(() => loadStatutoryData())
      .then(() => toast.success('ECR generated successfully!'))
      .catch((err) => {
        console.error('Error generating ECR:', err);
        toast.error(err.message || 'Error generating ECR');
      });
  };

  const handleAddRemittance = (data) => {
    if (remittanceType !== 'pf') {
      // ESI remittance has no backend model at all under /api/payroll/
      // statutory (that module is PF-only) — kept local-only rather than
      // silently pretending it's saved.
      const newRemittance = {
        id: esiRemittances.length + 1,
        month: data.month,
        totalContribution: parseFloat(data.totalContribution),
        employeeContribution: parseFloat(data.employeeContribution) || parseFloat(data.totalContribution) / 2,
        employerContribution: parseFloat(data.employerContribution) || parseFloat(data.totalContribution) / 2,
        challanNo: data.challanNo || `CH${Math.floor(100000 + Math.random() * 900000)}`,
        remittanceDate: data.remittanceDate || new Date().toISOString().split('T')[0],
        status: 'paid'
      };
      setEsiRemittances([...esiRemittances, newRemittance]);
      toast.warning('ESI remittance saved locally only — there is no backend support for ESI remittance yet.');
      return;
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [monthName, yearStr] = (data.month || '').split(' ');
    const monthIndex = monthNames.indexOf(monthName);
    const month = monthIndex >= 0 ? monthIndex + 1 : new Date().getMonth() + 1;
    const year = yearStr ? Number(yearStr) : new Date().getFullYear();
    const totalContribution = parseFloat(data.totalContribution);
    const employeeContribution = parseFloat(data.employeeContribution) || totalContribution / 2;
    const employerContribution = parseFloat(data.employerContribution) || totalContribution / 2;

    statutoryComplianceAPI.createRemittance({
      month,
      year,
      total_contribution: totalContribution,
      employee_contribution: employeeContribution,
      employer_contribution: employerContribution,
      challan_number: data.challanNo || undefined,
      remittance_date: data.remittanceDate || new Date().toISOString().split('T')[0],
      status: 'paid',
    })
      .then(() => {
        toast.success('PF remittance added successfully!');
        loadStatutoryData();
      })
      .catch((err) => {
        console.error('Error adding PF remittance:', err);
        toast.error(err.message || 'Error adding PF remittance');
      });
  };

  const handleGenerateChallan = (data) => {
    const newChallan = {
      id: tdsChallans.length + 1,
      quarter: data.period,
      tdsAmount: parseFloat(data.amount),
      challanNo: `CH281${Math.floor(1000 + Math.random() * 9000)}`,
      depositDate: data.paymentDate || new Date().toISOString().split('T')[0],
      status: 'generated'
    };

    setTdsChallans([...tdsChallans, newChallan]);
    toast.success('Challan generated successfully!');
  };

  const handleActivateUAN = (employee, data) => {
    statutoryComplianceAPI.createUanRecord({
      employee_id: employee.id,
      uan_number: data.uanNumber,
      activation_date: data.activationDate || new Date().toISOString().split('T')[0],
      status: 'active',
    })
      .then(() => {
        toast.success('UAN activated successfully!');
        loadStatutoryData();
      })
      .catch((err) => {
        console.error('Error activating UAN:', err);
        toast.error(err.message || 'Error activating UAN');
      });
  };

  const handleAddVPF = (data) => {
    const employee = employees.find(emp => emp.id === data.employeeId);
    if (!employee) {
      toast.error('Employee not found');
      return;
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [monthName, yearStr] = (data.month || '').split(' ');
    const monthIndex = monthNames.indexOf(monthName);
    const now = new Date();
    const month = monthIndex >= 0 ? monthIndex + 1 : now.getMonth() + 1;
    const year = yearStr ? Number(yearStr) : now.getFullYear();

    statutoryComplianceAPI.createVpfRecord({
      employee_id: employee.id,
      month,
      year,
      vpf_rate: parseFloat(data.vpfRate),
      vpf_amount: (employee.basicSalary * parseFloat(data.vpfRate)) / 100,
      status: 'active',
    })
      .then(() => {
        toast.success('VPF added successfully!');
        loadStatutoryData();
      })
      .catch((err) => {
        console.error('Error adding VPF:', err);
        toast.error(err.message || 'Error adding VPF');
      });
  };

  const generateAndDownloadForm = (format) => {
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
        formContent += `Total PT Collection: ${formatCurrency(employees.reduce((sum, emp) => sum + (emp.ptDeduction || 0), 0))}\n`;
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
    toast.success('Form generated and downloaded successfully!');
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
      
      downloadFile(content, `Reconciliation_${report.reportName?.replace(/\s+/g, '_') || 'Report'}`, 'PDF');
      toast.success(`Reconciliation report for ${report.reportName} generated successfully!`);
    }
  };

  const handleUpdateConfig = (section, key, value) => {
    switch(section) {
      case 'pf': {
        setPfConfig(prev => ({ ...prev, [key]: value }));
        // Map the local field name back to the backend's field for the
        // one-off keys that persist; only these 5 map to real config.
        const backendKeyMap = {
          employeeContribution: 'pf_employee_rate',
          employerContribution: 'pf_employer_rate',
          epfContribution: 'eps_contribution_rate',
          edliContribution: 'edli_contribution_rate',
          ceilingLimit: 'pf_ceiling_limit',
          vpfEnabled: 'enable_vpf',
          vpfRate: 'default_vpf_rate',
        };
        const backendKey = backendKeyMap[key];
        if (backendKey && configId) {
          statutoryComplianceAPI.updateConfig(configId, { [backendKey]: value })
            .catch((err) => console.error('Error updating PF config:', err));
        }
        break;
      }
      // NOTE: ESI/PT/TDS/LWF/Gratuity/Bonus config have no backend model at
      // all (no such tables/endpoints exist under /api/payroll/statutory) —
      // these remain local-only. The "Calculate" buttons tied to them are
      // preview-only toasts that never claimed to persist, so this doesn't
      // change their behavior, just makes it explicit.
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

  const handleCalculatePF = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const employeeContribution = (employee.basicSalary * pfConfig.employeeContribution) / 100;
      const employerContribution = (employee.basicSalary * pfConfig.employerContribution) / 100;
      
      toast.info(`PF Calculation for ${employee.name}:
      Employee Contribution (${pfConfig.employeeContribution}%): ${formatCurrency(employeeContribution)}
      Employer Contribution (${pfConfig.employerContribution}%): ${formatCurrency(employerContribution)}
      Total: ${formatCurrency(employeeContribution + employerContribution)}`);
    } else {
      toast.warning('Employee not found');
    }
  };

  const handleCalculateESI = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee && employee.grossSalary <= esiConfig.salaryThreshold) {
      const employeeContribution = (employee.grossSalary * esiConfig.employeeContribution) / 100;
      const employerContribution = (employee.grossSalary * esiConfig.employerContribution) / 100;
      
      toast.info(`ESI Calculation for ${employee.name}:
      Employee Contribution (${esiConfig.employeeContribution}%): ${formatCurrency(employeeContribution)}
      Employer Contribution (${esiConfig.employerContribution}%): ${formatCurrency(employerContribution)}
      Total: ${formatCurrency(employeeContribution + employerContribution)}`);
    } else {
      toast.warning('Employee not eligible for ESI (Salary exceeds threshold) or not found');
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
      
      toast.info(`TDS Calculation for ${employee.name}:
      Annual Salary: ${formatCurrency(annualSalary)}
      Standard Deduction: ${formatCurrency(tdsConfig.standardDeduction)}
      Taxable Income: ${formatCurrency(annualSalary - tdsConfig.standardDeduction)}
      Monthly TDS Deduction: ${formatCurrency(tds)}
      Annual Projected TDS: ${formatCurrency(tds * 12)}`);
    } else {
      toast.warning('Employee not found');
    }
  };

  const handleCalculatePT = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const slab = ptConfig.slabs.find(s => 
        employee.grossSalary >= s.from && employee.grossSalary <= s.to
      );
      toast.info(`Professional Tax for ${employee.name}: ${formatCurrency(slab?.amount || 0)}`);
    } else {
      toast.warning('Employee not found');
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
        
        toast.info(`Gratuity Calculation for ${employee.name}:
        Years of Service: ${yearsOfService.toFixed(2)}
        Last Drawn Salary: ${formatCurrency(employee.basicSalary)}
        Calculated Gratuity: ${formatCurrency(gratuity)}
        Capped Amount: ${formatCurrency(cappedGratuity)}`);
      } else {
        toast.info(`Employee needs ${(gratuityConfig.eligibilityYears - yearsOfService).toFixed(2)} more years for gratuity eligibility`);
      }
    } else {
      toast.warning('Employee not found');
    }
  };

  const handleCalculateBonus = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      const bonus = Math.max(
        (employee.basicSalary * bonusConfig.calculationRate) / 100,
        bonusConfig.minimumBonus
      );
      
      toast.info(`Bonus Calculation for ${employee.name}:
      Bonus Amount: ${formatCurrency(bonus)}
      (${bonusConfig.calculationRate}% of basic salary or minimum ${formatCurrency(bonusConfig.minimumBonus)})`);
    } else {
      toast.warning('Employee not found');
    }
  };

  const handleExportReport = () => {
    if (filteredData.length === 0) {
      toast.warning('No data to export');
      return;
    }
    
    let csvData = [];
    let headers = [];
    
    switch(activeSection) {
      case 'employees':
        headers = ['Employee ID', 'Name', 'Department', 'Basic Salary', 'PF Contribution', 'ESI Contribution', 'TDS Deduction'];
        csvData = employees.map(emp => [
          emp.employeeId || 'N/A', 
          emp.name || 'N/A', 
          emp.department || 'N/A', 
          formatCurrency(emp.basicSalary), 
          formatCurrency(emp.pfContribution), 
          formatCurrency(emp.esiContribution), 
          formatCurrency(emp.tdsDeduction)
        ]);
        break;
      case 'forms':
        headers = ['Form Name', 'Employee', 'Financial Year/Period', 'Status', 'Date'];
        csvData = complianceForms.map(form => [
          form.formName || 'N/A', 
          form.employeeName || 'N/A', 
          form.financialYear || form.period || 'N/A', 
          form.status || 'N/A', 
          form.generatedDate || form.submittedDate || 'N/A'
        ]);
        break;
      case 'reports':
        headers = ['Report Name', 'Period', 'Status', 'Generated Date', 'Type'];
        csvData = reconciliationReports.map(report => [
          report.reportName || 'N/A', 
          report.period || 'N/A', 
          report.status || 'N/A', 
          report.generatedDate || 'N/A', 
          report.type || 'N/A'
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
    toast.success('Report exported successfully!');
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentPage(1);
      setSearchTerm('');
      setFilterType('All');
      toast.success('Compliance data refreshed successfully!');
    }, 1000);
  };

  const QuickLinkCard = ({ icon, title, description, onClick, color = 'primary' }) => {
    const colorMap = {
      primary: 'bg-blue-50 text-blue-600',
      success: 'bg-emerald-50 text-emerald-600',
      info: 'bg-cyan-50 text-cyan-600',
      warning: 'bg-yellow-50 text-yellow-600',
      danger: 'bg-rose-50 text-rose-600',
      secondary: 'bg-slate-50 text-slate-600'
    };

    return (
      <div 
        className="border border-slate-200 rounded-xl h-full cursor-pointer hover:shadow-md transition-shadow p-4 hover:border-blue-300"
        onClick={onClick}
      >
        <div className="text-center flex flex-col items-center justify-center">
          <div className={`${colorMap[color] || colorMap.primary} p-3 rounded-full mb-3`}>
            <Icon icon={icon} className="w-6 h-6" />
          </div>
          <h6 className="font-bold text-sm text-slate-800 mb-1">{title}</h6>
          <p className="text-slate-500 text-xs">{description}</p>
        </div>
      </div>
    );
  };

  const EmptyState = ({ title, description, icon }) => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Icon icon={icon || 'heroicons:database'} className="w-8 h-8 text-slate-300" />
      </div>
      <h4 className="text-slate-600 font-medium text-base mb-1">{title || 'No data available'}</h4>
      <p className="text-slate-400 text-sm">{description || 'Add data to get started'}</p>
    </div>
  );

  const renderPF = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/50 px-3 py-2">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-slate-800">Provident Fund (PF) Configuration</h5>
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
              onClick={() => {
                setSelectedForm('PF');
                openModal('form');
              }}
            >
              <Icon icon="heroicons:document-plus" className="w-4 h-4" />
              Generate Form
            </button>
          </div>
        </div>
        <div className="md:p-4 p-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                <h6 className="font-bold text-sm text-slate-700">Contribution Rates (%)</h6>
              </div>
              <div className="md:p-4 p-3 space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Employee Contribution</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={pfConfig.employeeContribution}
                    onChange={(e) => handleUpdateConfig('pf', 'employeeContribution', parseFloat(e.target.value))}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Employer Contribution</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={pfConfig.employerContribution}
                    onChange={(e) => handleUpdateConfig('pf', 'employerContribution', parseFloat(e.target.value))}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">EPS Contribution</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={pfConfig.epsContribution}
                    onChange={(e) => handleUpdateConfig('pf', 'epsContribution', parseFloat(e.target.value))}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">EDLI Contribution</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={pfConfig.edliContribution}
                    onChange={(e) => handleUpdateConfig('pf', 'edliContribution', parseFloat(e.target.value))}
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                <h6 className="font-bold text-sm text-slate-700">PF Settings</h6>
              </div>
              <div className="md:p-4 p-3 space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ceiling Limit (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={pfConfig.ceilingLimit}
                    onChange={(e) => handleUpdateConfig('pf', 'ceilingLimit', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-slate-500 mt-1">PF contribution calculated on basic up to this limit</p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={pfConfig.autoCalculation}
                      onChange={(e) => handleUpdateConfig('pf', 'autoCalculation', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Auto PF Calculation</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={pfConfig.uanMandatory}
                      onChange={(e) => handleUpdateConfig('pf', 'uanMandatory', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">UAN Number Mandatory</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={pfConfig.vpfEnabled}
                      onChange={(e) => handleUpdateConfig('pf', 'vpfEnabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Enable VPF (Voluntary Provident Fund)</span>
                  </label>
                </div>
                {pfConfig.vpfEnabled && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Default VPF Rate (%)</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      value={pfConfig.vpfRate}
                      onChange={(e) => handleUpdateConfig('pf', 'vpfRate', parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-slate-500 mt-1">Default VPF contribution rate (optional, employees can customize)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700">PF Eligibility Rules</h6>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Minimum Salary (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={pfConfig.eligibilityRules.minimumSalary}
                    onChange={(e) => handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, minimumSalary: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Maximum Salary (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={pfConfig.eligibilityRules.maximumSalary || ''}
                    onChange={(e) => handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, maximumSalary: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="No limit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Employment Types</label>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={pfConfig.eligibilityRules.employmentType.includes('permanent')}
                        onChange={(e) => {
                          const types = e.target.checked 
                            ? [...pfConfig.eligibilityRules.employmentType, 'permanent']
                            : pfConfig.eligibilityRules.employmentType.filter(t => t !== 'permanent');
                          handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, employmentType: types });
                        }}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Permanent</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={pfConfig.eligibilityRules.employmentType.includes('contract')}
                        onChange={(e) => {
                          const types = e.target.checked 
                            ? [...pfConfig.eligibilityRules.employmentType, 'contract']
                            : pfConfig.eligibilityRules.employmentType.filter(t => t !== 'contract');
                          handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, employmentType: types });
                        }}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">Contract</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Probation Period (days)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={pfConfig.eligibilityRules.probationPeriod}
                    onChange={(e) => handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, probationPeriod: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={pfConfig.eligibilityRules.autoEnrollment}
                    onChange={(e) => handleUpdateConfig('pf', 'eligibilityRules', { ...pfConfig.eligibilityRules, autoEnrollment: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Auto-enroll eligible employees</span>
                </label>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700">PF Statements</h6>
            </div>
            <div className="p-4">
              {pfStatements.length === 0 ? (
                <EmptyState 
                  title="No PF Statements" 
                  description="PF statements will appear here once generated"
                  icon="heroicons:document-text"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee ID</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee Name</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee Contribution</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Employer Contribution</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Total PF</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">UAN Number</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Status</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pfStatements.map(statement => {
                        const employee = employees.find(emp => emp.employeeId === statement.employeeId);
                        return (
                          <tr key={statement.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2 text-slate-700">{statement.employeeId}</td>
                            <td className="px-4 py-2 text-slate-700">{employee?.name || 'N/A'}</td>
                            <td className="px-4 py-2 text-blue-600 font-medium">{formatCurrency(statement.employeeContribution)}</td>
                            <td className="px-4 py-2 text-emerald-600 font-medium">{formatCurrency(statement.employerContribution)}</td>
                            <td className="px-4 py-2 font-bold text-slate-800">{formatCurrency(statement.total)}</td>
                            <td className="px-4 py-2 text-slate-700">{employee?.pfUAN || 'N/A'}</td>
                            <td className="px-4 py-2">{getStatusBadge(statement.status)}</td>
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                <button 
                                  className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                  onClick={() => handleViewDetails(statement, 'pfStatement')}
                                >
                                  View
                                </button>
                                <button 
                                  className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                                  onClick={() => handleCalculatePF(employee?.id)}
                                >
                                  Calculate
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <h6 className="font-bold text-sm text-slate-700">PF Remittance Summary</h6>
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                onClick={() => {
                  setRemittanceType('pf');
                  openModal('remittance');
                }}
              >
                <Icon icon="heroicons:plus" className="w-4 h-4" />
                Add Remittance
              </button>
            </div>
            <div className="p-4">
              {pfRemittances.length === 0 ? (
                <EmptyState 
                  title="No Remittances" 
                  description="Add your first PF remittance"
                  icon="heroicons:currency-dollar"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Month</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Total Contribution</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee Contribution</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Employer Contribution</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Challan Number</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Remittance Date</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Status</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pfRemittances.map(remittance => (
                        <tr key={remittance.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2 text-slate-700">{remittance.month}</td>
                          <td className="px-4 py-2 font-bold text-slate-800">{formatCurrency(remittance.totalContribution)}</td>
                          <td className="px-4 py-2 text-blue-600 font-medium">{formatCurrency(remittance.employeeContribution)}</td>
                          <td className="px-4 py-2 text-emerald-600 font-medium">{formatCurrency(remittance.employerContribution)}</td>
                          <td className="px-4 py-2 text-slate-700">{remittance.challanNo}</td>
                          <td className="px-4 py-2 text-slate-700">{remittance.remittanceDate}</td>
                          <td className="px-4 py-2">{getStatusBadge(remittance.status)}</td>
                          <td className="px-4 py-2">
                            <button 
                              className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                              onClick={() => toast.info(`Viewing challan: ${remittance.challanNo}`)}
                            >
                              View Challan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <h6 className="font-bold text-sm text-slate-700">ECR (Electronic Challan cum Return)</h6>
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition"
                onClick={() => openModal('ecr')}
              >
                <Icon icon="heroicons:document-plus" className="w-4 h-4" />
                Generate ECR
              </button>
            </div>
            <div className="p-4">
              {ecrData.length === 0 ? (
                <EmptyState 
                  title="No ECR Records" 
                  description="Generate your first ECR"
                  icon="heroicons:document-text"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Month</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Total Employees</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Total Wages</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">EPF Contribution</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">EPS Contribution</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">EDLI Contribution</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Status</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Submitted Date</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ecrData.map(ecr => (
                        <tr key={ecr.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2 text-slate-700">{ecr.month}</td>
                          <td className="px-4 py-2 text-slate-700">{ecr.totalEmployees}</td>
                          <td className="px-4 py-2 text-blue-600 font-medium">{formatCurrency(ecr.totalWages)}</td>
                          <td className="px-4 py-2 text-slate-700">{formatCurrency(ecr.epfContribution)}</td>
                          <td className="px-4 py-2 text-slate-700">{formatCurrency(ecr.epsContribution)}</td>
                          <td className="px-4 py-2 text-slate-700">{formatCurrency(ecr.edliContribution)}</td>
                          <td className="px-4 py-2">{getStatusBadge(ecr.status)}</td>
                          <td className="px-4 py-2 text-slate-700">{ecr.submittedDate}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <button 
                                className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                onClick={() => handleViewDetails(ecr, 'ecr')}
                              >
                                View
                              </button>
                              <button 
                                className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                                onClick={() => {
                                  const content = `ECR Report for ${ecr.month}\nTotal Wages: ${formatCurrency(ecr.totalWages)}\nEPF Contribution: ${formatCurrency(ecr.epfContribution)}\nEPS Contribution: ${formatCurrency(ecr.epsContribution)}`;
                                  downloadFile(content, `ECR_${ecr.month.replace(/\s+/g, '_')}`, 'PDF');
                                  toast.success('ECR downloaded successfully!');
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
              )}
            </div>
          </div>

          {pfConfig.vpfEnabled && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <h6 className="font-bold text-sm text-slate-700">VPF (Voluntary Provident Fund) Management</h6>
                <button
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                  onClick={() => openModal('vpf')}
                >
                  <Icon icon="heroicons:plus" className="w-4 h-4" />
                  Add VPF
                </button>
              </div>
              <div className="p-4">
                {vpfData.length === 0 ? (
                  <EmptyState 
                    title="No VPF Records" 
                    description="Add your first VPF contribution"
                    icon="heroicons:banknotes"
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50/50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee</th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-600">VPF Rate (%)</th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-600">VPF Amount</th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-600">Month</th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-600">Status</th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {vpfData.map((vpf, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2">
                              <div className="font-semibold text-slate-800">{vpf.name}</div>
                              <div className="text-xs text-slate-500">{vpf.employeeId}</div>
                            </td>
                            <td className="px-4 py-2 text-slate-700">{vpf.vpfRate}%</td>
                            <td className="px-4 py-2 font-bold text-blue-600">{formatCurrency(vpf.vpfAmount)}</td>
                            <td className="px-4 py-2 text-slate-700">{vpf.month}</td>
                            <td className="px-4 py-2">{getStatusBadge(vpf.status)}</td>
                            <td className="px-4 py-2">
                              <button 
                                className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                onClick={() => handleViewDetails(vpf, 'vpf')}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <h6 className="font-bold text-sm text-slate-700">UAN Activation & Management</h6>
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                onClick={() => openModal('uan')}
              >
                <Icon icon="heroicons:plus" className="w-4 h-4" />
                Activate UAN
              </button>
            </div>
            <div className="p-4">
              {uanActivations.length === 0 ? (
                <EmptyState 
                  title="No UAN Records" 
                  description="Activate UAN for employees"
                  icon="heroicons:identification"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">UAN Number</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Activation Date</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Status</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {uanActivations.map(uan => (
                        <tr key={uan.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2">
                            <div className="font-semibold text-slate-800">{uan.name}</div>
                            <div className="text-xs text-slate-500">{uan.employeeId}</div>
                          </td>
                          <td className="px-4 py-2 font-bold text-slate-800">{uan.uan}</td>
                          <td className="px-4 py-2 text-slate-700">{uan.activationDate}</td>
                          <td className="px-4 py-2">{getStatusBadge(uan.status)}</td>
                          <td className="px-4 py-2">
                            <button 
                              className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                              onClick={() => handleViewDetails(uan, 'employee')}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700">PF Reports & Forms</h6>
            </div>
            <div className="md:p-4 p-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <QuickLinkCard
                  icon="heroicons:document-text"
                  title="Form 5/10C"
                  description="Monthly PF Return"
                  onClick={() => {
                    setSelectedForm('Form5');
                    openModal('form');
                  }}
                  color="primary"
                />
                <QuickLinkCard
                  icon="heroicons:document-duplicate"
                  title="Form 12A"
                  description="Exit/Transfer Form"
                  onClick={() => {
                    setSelectedForm('Form12A');
                    openModal('form');
                  }}
                  color="warning"
                />
                <QuickLinkCard
                  icon="heroicons:document-chart-bar"
                  title="Reconciliation Report"
                  description="PF Contribution Reconciliation"
                  onClick={() => {
                    setRemittanceType('pf');
                    openModal('reconciliation');
                  }}
                  color="success"
                />
                <QuickLinkCard
                  icon="heroicons:arrow-down-tray"
                  title="UAN Update"
                  description="Employee UAN Details"
                  onClick={() => {
                    if (employees.length === 0) {
                      toast.warning('No employees found');
                      return;
                    }
                    const content = employees.map(emp => `${emp.name || 'N/A'},${emp.employeeId || 'N/A'},${emp.pfUAN || 'N/A'}`).join('\n');
                    downloadFile(`Name,Employee ID,UAN\n${content}`, 'UAN_Report', 'CSV');
                    toast.success('UAN Report downloaded successfully!');
                  }}
                  color="info"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800">Employee Compliance Status</h5>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
              onClick={handleExportReport}
            >
              <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
              Export
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition"
              onClick={handleRefreshData}
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="min-w-[150px]">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="All">All Employees</option>
              <option value="pfEligible">PF Eligible</option>
              <option value="esiEligible">ESI Eligible</option>
              <option value="tdsApplicable">TDS Applicable</option>
            </select>
          </div>
        </div>

        {employees.length === 0 ? (
          <EmptyState 
            title="No Employees Found" 
            description="Add employees to manage their compliance status"
            icon="heroicons:user-group"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee ID</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Department</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Basic Salary</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">PF</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">ESI</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">TDS</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Last Declaration</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((employee) => (
                    <tr key={employee.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2">
                        <div className="font-medium text-slate-800">{employee.employeeId}</div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-medium text-slate-800">{employee.name}</div>
                        <div className="text-xs text-slate-500">{employee.department}</div>
                      </td>
                      <td className="px-4 py-2 text-slate-700">{employee.department}</td>
                      <td className="px-4 py-2 font-bold text-slate-800">{formatCurrency(employee.basicSalary)}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${employee.pfEligible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                          {employee.pfEligible ? 'Eligible' : 'Not Eligible'}
                        </span>
                        <div className="text-xs text-slate-500">{formatCurrency(employee.pfContribution)}</div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${employee.esiEligible ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-50 text-slate-500'}`}>
                          {employee.esiEligible ? 'Eligible' : 'Not Eligible'}
                        </span>
                        <div className="text-xs text-slate-500">{formatCurrency(employee.esiContribution)}</div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${employee.tdsApplicable ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-50 text-slate-500'}`}>
                          {employee.tdsApplicable ? 'Applicable' : 'Not Applicable'}
                        </span>
                        <div className="text-xs text-slate-500">{formatCurrency(employee.tdsDeduction)}</div>
                      </td>
                      <td className="px-4 py-2 text-slate-700">{formatDate(employee.lastDeclaration)}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(employee, 'employee')}
                            className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          >
                            View
                          </button>
                          <div className="relative group">
                            <button className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition">
                              Calculate
                            </button>
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <div className="py-1">
                                <button className="w-full px-4 py-1.5 text-left text-sm hover:bg-slate-50 transition" onClick={() => handleCalculatePF(employee.id)}>
                                  PF Calculation
                                </button>
                                {employee.esiEligible && (
                                  <button className="w-full px-4 py-1.5 text-left text-sm hover:bg-slate-50 transition" onClick={() => handleCalculateESI(employee.id)}>
                                    ESI Calculation
                                  </button>
                                )}
                                <button className="w-full px-4 py-1.5 text-left text-sm hover:bg-slate-50 transition" onClick={() => handleCalculateTDS(employee.id)}>
                                  TDS Calculation
                                </button>
                                <button className="w-full px-4 py-1.5 text-left text-sm hover:bg-slate-50 transition" onClick={() => handleCalculatePT(employee.id)}>
                                  PT Calculation
                                </button>
                                <button className="w-full px-4 py-1.5 text-left text-sm hover:bg-slate-50 transition" onClick={() => handleCalculateGratuity(employee.id)}>
                                  Gratuity Calculation
                                </button>
                                <button className="w-full px-4 py-1.5 text-left text-sm hover:bg-slate-50 transition" onClick={() => handleCalculateBonus(employee.id)}>
                                  Bonus Calculation
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} employees
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderForms = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800">Compliance Forms & Returns</h5>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
              onClick={handleExportReport}
            >
              <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
              Export
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition"
              onClick={handleRefreshData}
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="min-w-[150px]">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="generated">Generated</option>
            </select>
          </div>
        </div>

        {complianceForms.length === 0 ? (
          <EmptyState 
            title="No Forms Found" 
            description="Generate compliance forms to get started"
            icon="heroicons:document-text"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Form Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Period</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((form) => (
                    <tr key={form.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2 font-medium text-slate-800">{form.formName}</td>
                      <td className="px-4 py-2 text-slate-700">{form.employeeName}</td>
                      <td className="px-4 py-2 text-slate-700">{form.financialYear || form.period}</td>
                      <td className="px-4 py-2">{getStatusBadge(form.status)}</td>
                      <td className="px-4 py-2 text-slate-700">{form.generatedDate || form.submittedDate || 'N/A'}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(form, 'form')}
                            className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          >
                            View
                          </button>
                          {form.status === 'generated' && (
                            <button 
                              className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                              onClick={() => handleDownloadForm(form.id)}
                            >
                              Download
                            </button>
                          )}
                          {form.status === 'pending' && (
                            <button 
                              className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition"
                              onClick={() => {
                                setSelectedForm(form.formName);
                                openModal('form');
                              }}
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

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} forms
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="border-t border-slate-200 pt-4">
          <h6 className="font-semibold text-sm text-slate-700 mb-3">Available Form Types</h6>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickLinkCard
              icon="heroicons:document-text"
              title="Form 16"
              description="Generate TDS certificates"
              onClick={() => {
                setSelectedForm('Form16');
                openModal('form');
              }}
              color="primary"
            />
            <QuickLinkCard
              icon="heroicons:document-chart-bar"
              title="Form 5/10C"
              description="PF Return"
              onClick={() => {
                setSelectedForm('Form5');
                openModal('form');
              }}
              color="success"
            />
            <QuickLinkCard
              icon="heroicons:document-duplicate"
              title="ESI Return"
              description="Half-yearly submission"
              onClick={() => {
                setSelectedForm('ESI');
                openModal('form');
              }}
              color="info"
            />
            <QuickLinkCard
              icon="heroicons:document"
              title="PT Return"
              description="Monthly/Annual"
              onClick={() => {
                setSelectedForm('PT');
                openModal('form');
              }}
              color="warning"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeclarations = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800">Investment Declarations</h5>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
              onClick={handleExportReport}
            >
              <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
              Export
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition"
              onClick={handleRefreshData}
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search declarations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="min-w-[150px]">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="All">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="draft">Draft</option>
              <option value="verified">Verified</option>
            </select>
          </div>
        </div>

        {declarations.length === 0 ? (
          <EmptyState 
            title="No Declarations Found" 
            description="Investment declarations will appear here"
            icon="heroicons:clipboard-document-check"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Employee</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Financial Year</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Submitted Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Verified</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((declaration) => (
                    <tr key={declaration.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2 font-medium text-slate-800">{declaration.employeeName}</td>
                      <td className="px-4 py-2 text-slate-700">{declaration.financialYear}</td>
                      <td className="px-4 py-2">{getStatusBadge(declaration.status)}</td>
                      <td className="px-4 py-2 text-slate-700">{declaration.submittedDate ? formatDate(declaration.submittedDate) : 'N/A'}</td>
                      <td className="px-4 py-2">
                        {declaration.verified ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Yes</span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">No</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleViewDetails(declaration, 'declaration')}
                          className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} declarations
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800">Compliance Reports</h5>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
              onClick={handleExportReport}
            >
              <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
              Export
            </button>
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition"
              onClick={handleRefreshData}
            >
              <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="relative flex-1 min-w-[200px]">
          <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {reconciliationReports.length === 0 ? (
          <EmptyState 
            title="No Reports Found" 
            description="Generate reports to view compliance data"
            icon="heroicons:chart-bar"
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Report Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Period</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Type</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Generated Date</th>
                    <th className="px-4 py-2 text-left font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2 font-medium text-slate-800">{report.reportName}</td>
                      <td className="px-4 py-2 text-slate-700">{report.period}</td>
                      <td className="px-4 py-2">{getTypeBadge(report.type)}</td>
                      <td className="px-4 py-2">{getStatusBadge(report.status)}</td>
                      <td className="px-4 py-2 text-slate-700">{report.generatedDate ? formatDate(report.generatedDate) : 'N/A'}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(report, 'report')}
                            className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          >
                            View
                          </button>
                          {report.status === 'completed' && (
                            <button 
                              className="px-2 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                              onClick={() => {
                                const content = `${report.reportName}\nPeriod: ${report.period}\nGenerated: ${new Date().toLocaleDateString()}`;
                                downloadFile(content, report.reportName?.replace(/\s+/g, '_') || 'Report', 'PDF');
                                toast.success('Report downloaded successfully!');
                              }}
                            >
                              Download
                            </button>
                          )}
                          {report.status === 'pending' && (
                            <button 
                              className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition"
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

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} reports
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
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
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800">Employee State Insurance (ESI) Configuration</h5>
                <button
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                  onClick={() => {
                    setSelectedForm('ESI');
                    openModal('form');
                  }}
                >
                  <Icon icon="heroicons:document-plus" className="w-4 h-4" />
                  Generate ESI Return
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">ESI section - Use the Generate ESI Return button to create and download ESI forms</p>
              </div>
            </div>
          </div>
        );
      case 'pt':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800">Professional Tax (PT) Configuration</h5>
                <button
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                  onClick={() => {
                    setSelectedForm('PT');
                    openModal('form');
                  }}
                >
                  <Icon icon="heroicons:document-plus" className="w-4 h-4" />
                  Generate PT Return
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">PT section - Use the Generate PT Return button to create and download PT forms</p>
              </div>
            </div>
          </div>
        );
      case 'tds':
        return (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800">Tax Deducted at Source (TDS) Management</h5>
                <button
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                  onClick={() => {
                    setSelectedForm('Form16');
                    openModal('form');
                  }}
                >
                  <Icon icon="heroicons:document-plus" className="w-4 h-4" />
                  Generate Form 16
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">TDS section - Use the Generate Form 16 button to create and download TDS forms</p>
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
    <>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {activeSection !== 'pf' && (
              <button
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                onClick={() => setActiveSection('pf')}
              >
                <Icon icon="heroicons:arrow-left" className="w-4 h-4" />
                Back to Compliance
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
              <Icon icon="heroicons:shield-check" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Statutory Compliance Engine</h1>
              <p className="text-sm text-slate-500">Manage PF, ESI, TDS, Professional Tax, LWF, Gratuity, and Bonus compliance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total PF Contribution"
            value={formatCurrency(kpis.totalPFContribution)}
            subtitle="Employee & Employer"
            icon="heroicons:building-library"
            color="blue"
          />
          <StatCard
            title="Total ESI Contribution"
            value={formatCurrency(kpis.totalESIContribution)}
            subtitle="Employee & Employer"
            icon="heroicons:heart"
            color="cyan"
          />
          <StatCard
            title="Total TDS Deduction"
            value={formatCurrency(kpis.totalTDSDeduction)}
            subtitle="Tax deducted at source"
            icon="heroicons:banknotes"
            color="emerald"
          />
          <StatCard
            title="Pending Declarations"
            value={formatNumber(kpis.pendingDeclarations)}
            subtitle="Awaiting verification"
            icon="heroicons:clock"
            color="yellow"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
          {[
            { id: 'pf', label: 'PF', icon: 'heroicons:building-library' },
            { id: 'esi', label: 'ESI', icon: 'heroicons:heart' },
            { id: 'pt', label: 'PT', icon: 'heroicons:briefcase' },
            { id: 'tds', label: 'TDS', icon: 'heroicons:banknotes' },
            { id: 'employees', label: 'Employees', icon: 'heroicons:users' },
            { id: 'forms', label: 'Forms', icon: 'heroicons:document-text' },
            { id: 'declarations', label: 'Declarations', icon: 'heroicons:clipboard-document-check' },
            { id: 'reports', label: 'Reports', icon: 'heroicons:chart-bar' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setCurrentPage(1);
                setSearchTerm('');
                setFilterType('All');
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon icon={item.icon} className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {renderContent()}

        <ViewDetailsModal
          isOpen={modalState.isOpen && modalState.type === 'view'}
          onClose={closeModal}
          data={modalState.data}
          type={modalState.data?.viewType || 'employee'}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
          getTypeBadge={getTypeBadge}
          formatDate={formatDate}
          onDownload={handleDownloadForm}
        />

        <ECRModal
          isOpen={modalState.isOpen && modalState.type === 'ecr'}
          onClose={closeModal}
          onSubmit={(data) => {
            handleGenerateECR(data);
            closeModal();
          }}
        />

        <RemittanceModal
          isOpen={modalState.isOpen && modalState.type === 'remittance'}
          onClose={closeModal}
          onSubmit={(data) => {
            handleAddRemittance(data);
            closeModal();
          }}
          type={remittanceType}
        />

        <UANModal
          isOpen={modalState.isOpen && modalState.type === 'uan'}
          onClose={closeModal}
          onSubmit={(employee, data) => {
            handleActivateUAN(employee, data);
            closeModal();
          }}
          employees={employees}
          selectedEmployee={selectedEmployeeForUAN}
        />

        <VPFModal
          isOpen={modalState.isOpen && modalState.type === 'vpf'}
          onClose={closeModal}
          onSubmit={(data) => {
            handleAddVPF(data);
            closeModal();
          }}
          employees={employees}
        />

        <GenerateFormModal
          isOpen={modalState.isOpen && modalState.type === 'form'}
          onClose={closeModal}
          onSubmit={(data) => {
            generateAndDownloadForm(data.format);
            closeModal();
          }}
          formName={selectedForm || ''}
        />

        <ReconciliationModal
          isOpen={modalState.isOpen && modalState.type === 'reconciliation'}
          onClose={closeModal}
          onSubmit={(data) => {
            const content = `${remittanceType.toUpperCase()} Reconciliation Report\nPeriod: ${data.period}\nGenerated: ${new Date().toLocaleDateString()}`;
            downloadFile(content, `${remittanceType.toUpperCase()}_Reconciliation_${data.period.replace(/\s+/g, '_')}`, data.format);
            toast.success(`${remittanceType.toUpperCase()} Reconciliation report generated!`);
            closeModal();
          }}
          type={remittanceType}
        />

        <ChallanModal
          isOpen={modalState.isOpen && modalState.type === 'challan'}
          onClose={closeModal}
          onSubmit={(data) => {
            handleGenerateChallan(data);
            closeModal();
          }}
          type={remittanceType}
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          className="text-sm"
          toastClassName="rounded-xl shadow-lg"
        />
      </div>
    </>
  );
};

export default StatutoryCompliance;