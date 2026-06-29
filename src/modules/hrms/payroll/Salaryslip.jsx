import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import StatCard from '../../../shared/components/StatCard';
import SalarySlipModal from '../modal/SalarySlipModal';
import BulkDownloadModal from '../modal/BulkDownloadModal';
import DeleteSlipModal from '../modal/DeleteSlipModal';
import SettingsModal from '../modal/SettingsModal';
import NotificationToast from '../../../shared/components/NotificationToast';

const Salaryslip = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [distributionMethod, setDistributionMethod] = useState('email');
  const [passwordProtect, setPasswordProtect] = useState(true);
  const [generationStatus, setGenerationStatus] = useState('idle');
  const [selectedSlips, setSelectedSlips] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    data: null
  });

  const [notification, setNotification] = useState({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const [companySettings, setCompanySettings] = useState({
    name: '',
    address: '',
    logo: '',
    seal: '',
    signatory: '',
    footerText: '',
    confidentiality: '',
    defaultPassword: 'employee_id',
    emailSubject: '',
    emailBody: '',
    retentionPeriod: 12,
    allowRevisions: true,
    revisionDays: 7
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: true,
    portal: true,
    autoSend: true,
    sendTime: '09:00',
    ccHR: true,
    bccAccounts: false
  });

  const [salaryData, setSalaryData] = useState({
    employees: [],
    salarySlips: []
  });

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const openModal = (type, data = null) => {
    setModalState({ type, isOpen: true, data });
  };

  const closeModal = () => {
    setModalState({ type: null, isOpen: false, data: null });
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ isOpen: true, message, type });
  };

  const kpis = useMemo(() => {
    const totalSlips = salaryData.salarySlips.length;
    const distributedSlips = salaryData.salarySlips.filter(s => s.status === 'distributed').length;
    const totalPayout = salaryData.salarySlips.reduce((sum, slip) => sum + (slip.netSalary || 0), 0);
    
    return {
      totalSlips,
      totalEmployees: salaryData.employees.length,
      distributedSlips,
      totalPayout,
      pendingDistribution: salaryData.salarySlips.filter(s => s.status === 'generated').length,
      emailSent: salaryData.salarySlips.filter(s => s.emailSent).length,
      smsSent: salaryData.salarySlips.filter(s => s.smsSent).length
    };
  }, [salaryData]);

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';
    
    const convertLessThanThousand = (n) => {
      if (n === 0) return '';
      
      let word = '';
      
      if (Math.floor(n / 100) > 0) {
        word += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      
      if (n >= 10 && n <= 19) {
        word += teens[n - 10] + ' ';
      } else {
        if (Math.floor(n / 10) > 1) {
          word += tens[Math.floor(n / 10)] + ' ';
          n %= 10;
        }
        if (n > 0) {
          word += ones[n] + ' ';
        }
      }
      
      return word.trim();
    };

    let word = '';
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;

    if (crore > 0) {
      word += convertLessThanThousand(crore) + ' Crore ';
    }
    if (lakh > 0) {
      word += convertLessThanThousand(lakh) + ' Lakh ';
    }
    if (thousand > 0) {
      word += convertLessThanThousand(thousand) + ' Thousand ';
    }
    if (remainder > 0) {
      word += convertLessThanThousand(remainder);
    }

    return word.trim() + ' Rupees Only';
  };

  const calculateTotals = (employee) => {
    if (!employee || !employee.salaryStructure) {
      return {
        earnings: 0,
        deductions: 0,
        grossSalary: 0,
        netSalary: 0,
        words: 'Zero Rupees Only'
      };
    }
    
    const earnings = Object.values(employee.salaryStructure || {}).reduce((a, b) => a + b, 0);
    const deductions = Object.values(employee.deductions || {}).reduce((a, b) => a + b, 0);
    const grossSalary = earnings;
    const netSalary = grossSalary - deductions;
    
    return {
      earnings,
      deductions,
      grossSalary,
      netSalary,
      words: numberToWords(netSalary)
    };
  };

  const generatePassword = (employee) => {
    if (!employee) return 'default123';
    
    if (companySettings.defaultPassword === 'dob') {
      return employee.dob?.replace(/-/g, '') || 'dob123';
    } else if (companySettings.defaultPassword === 'custom') {
      return employee.id + (employee.dob?.replace(/-/g, '') || '0101');
    } else {
      return employee.id || 'emp123';
    }
  };

  const filteredSlips = salaryData.salarySlips.filter(slip =>
    slip.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.month?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slip.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSlips.length / itemsPerPage);
  const paginatedSlips = filteredSlips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const styles = {
      'distributed': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'generated': 'bg-amber-50 text-amber-700 border border-amber-200',
      'pending': 'bg-rose-50 text-rose-700 border border-rose-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
      </span>
    );
  };

  const getMethodBadge = (method) => {
    const styles = {
      'email': 'bg-blue-50 text-blue-700 border border-blue-200',
      'portal': 'bg-purple-50 text-purple-700 border border-purple-200',
      'both': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      'print': 'bg-amber-50 text-amber-700 border border-amber-200',
      'none': 'bg-slate-50 text-slate-700 border border-slate-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[method] || 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
        {method ? method.charAt(0).toUpperCase() + method.slice(1) : 'N/A'}
      </span>
    );
  };

  const handleGenerateSalarySlip = (data) => {
    if (!selectedEmployee) {
      showNotification('Please select an employee', 'error');
      return;
    }

    setGenerationStatus('generating');

    try {
      const totals = calculateTotals(selectedEmployee);
      const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const slipId = `SS${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(salaryData.salarySlips.length + 1).padStart(3, '0')}`;
      const password = generatePassword(selectedEmployee);

      const newSlip = {
        id: slipId,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        month: month,
        period: `${selectedMonth || new Date().toISOString().slice(0, 7)}-01 to ${selectedMonth || new Date().toISOString().slice(0, 7)}-${new Date(new Date(selectedMonth || new Date().toISOString().slice(0, 7) + '-01').getFullYear(), new Date(selectedMonth || new Date().toISOString().slice(0, 7) + '-01').getMonth() + 1, 0).getDate()}`,
        dateGenerated: new Date().toISOString().split('T')[0],
        grossSalary: totals.grossSalary,
        netSalary: totals.netSalary,
        status: 'generated',
        distributionMethod: data.distributionMethod || 'none',
        password: password,
        downloaded: false,
        emailSent: false,
        emailDate: '',
        smsSent: false,
        smsDate: ''
      };

      setSalaryData(prev => ({
        ...prev,
        salarySlips: [newSlip, ...prev.salarySlips]
      }));

      setGenerationStatus('completed');
      closeModal();
      showNotification(`Salary slip generated for ${selectedEmployee.name}`, 'success');

    } catch (error) {
      console.error('Error generating salary slip:', error);
      showNotification('Error generating salary slip. Please try again.', 'error');
      setGenerationStatus('error');
    }
  };

  const handleDownloadPDF = (employee, slipId) => {
    if (!employee) {
      showNotification('Employee not found', 'error');
      return;
    }

    setGenerationStatus('downloading');

    try {
      const totals = calculateTotals(employee);
      const slip = salaryData.salarySlips.find(s => s.id === slipId);
      const month = slip?.month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const period = slip?.period || `${selectedMonth || new Date().toISOString().slice(0, 7)}-01 to ${selectedMonth || new Date().toISOString().slice(0, 7)}-${new Date(new Date(selectedMonth || new Date().toISOString().slice(0, 7) + '-01').getFullYear(), new Date(selectedMonth || new Date().toISOString().slice(0, 7) + '-01').getMonth() + 1, 0).getDate()}`;
      const password = slip?.password || generatePassword(employee);

      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        showNotification('Please allow popups for this site', 'error');
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Salary Slip - ${employee.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .company-address { font-size: 12px; color: #666; margin-bottom: 10px; }
            .salary-slip-title { font-size: 18px; font-weight: bold; color: #2c3e50; margin: 15px 0; }
            .employee-info { margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section-title { background: #f8f9fa; padding: 8px; border-left: 4px solid #3498db; font-weight: bold; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            th { background: #f8f9fa; text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
            td { padding: 8px; border-bottom: 1px solid #eee; }
            .total-row { font-weight: bold; background: #e8f4fc; }
            .text-right { text-align: right; }
            .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 10px; color: #666; }
            .signature { margin-top: 40px; text-align: right; }
            .password { background: #f8f9fa; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
              @page { margin: 20mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${companySettings.name || 'Company Name'}</div>
            <div class="company-address">${companySettings.address || 'Company Address'}</div>
            <div class="salary-slip-title">SALARY SLIP</div>
            <div>For the month of: ${month}</div>
            <div>Period: ${period}</div>
          </div>
          <div class="employee-info">
            <table>
              <tr>
                <td style="width: 50%;">
                  <strong>Employee Name:</strong> ${employee.name || 'N/A'}<br>
                  <strong>Employee ID:</strong> ${employee.id || 'N/A'}<br>
                  <strong>Designation:</strong> ${employee.designation || 'N/A'}<br>
                  <strong>Department:</strong> ${employee.department || 'N/A'}
                </td>
                <td style="width: 50%;">
                  <strong>Bank Name:</strong> ${employee.bankDetails?.bankName || 'N/A'}<br>
                  <strong>Account No:</strong> ${employee.bankDetails?.accountNumber || 'N/A'}<br>
                  <strong>IFSC Code:</strong> ${employee.bankDetails?.ifscCode || 'N/A'}<br>
                  <strong>PAN Number:</strong> ${employee.panNumber || 'N/A'}
                </td>
              </tr>
            </table>
          </div>
          <div class="section">
            <div class="section-title">EARNINGS</div>
            <table>
              ${employee.salaryStructure ? Object.entries(employee.salaryStructure).map(([key, value]) => `
                <tr>
                  <td>${key.replace(/([A-Z])/g, ' $1').toUpperCase()}</td>
                  <td class="text-right">${formatCurrency(value)}</td>
                </tr>
              `).join('') : '<tr><td>No earnings data available</td><td class="text-right">-</td></tr>'}
              <tr class="total-row">
                <td>TOTAL EARNINGS</td>
                <td class="text-right">${formatCurrency(totals.earnings)}</td>
              </tr>
            </table>
          </div>
          <div class="section">
            <div class="section-title">DEDUCTIONS</div>
            <table>
              ${employee.deductions ? Object.entries(employee.deductions).map(([key, value]) => `
                <tr>
                  <td>${key.toUpperCase()}</td>
                  <td class="text-right">${formatCurrency(value)}</td>
                </tr>
              `).join('') : '<tr><td>No deductions data available</td><td class="text-right">-</td></tr>'}
              <tr class="total-row">
                <td>TOTAL DEDUCTIONS</td>
                <td class="text-right">${formatCurrency(totals.deductions)}</td>
              </tr>
            </table>
          </div>
          <div class="section">
            <table>
              <tr class="total-row">
                <td><strong>GROSS SALARY</strong></td>
                <td class="text-right">${formatCurrency(totals.grossSalary)}</td>
              </tr>
              <tr class="total-row">
                <td><strong>TOTAL DEDUCTIONS</strong></td>
                <td class="text-right">${formatCurrency(totals.deductions)}</td>
              </tr>
              <tr style="background: #d4edda;">
                <td><strong>NET SALARY PAYABLE</strong></td>
                <td class="text-right"><strong>${formatCurrency(totals.netSalary)}</strong></td>
              </tr>
              <tr>
                <td colspan="2">
                  <strong>In Words:</strong> ${totals.words}
                </td>
              </tr>
            </table>
          </div>
          ${employee.attendance ? `
          <div class="section">
            <div class="section-title">ATTENDANCE SUMMARY</div>
            <table>
              <tr>
                <td>Present Days</td>
                <td>${employee.attendance.present || 0}</td>
                <td>Casual Leave</td>
                <td>${employee.attendance.casualLeave || 0}</td>
              </tr>
              <tr>
                <td>Sick Leave</td>
                <td>${employee.attendance.sickLeave || 0}</td>
                <td>Overtime Hours</td>
                <td>${employee.attendance.overtimeHours || 0}</td>
              </tr>
              <tr>
                <td>Weekly Off</td>
                <td>${employee.attendance.weeklyOff || 0}</td>
                <td>Holidays</td>
                <td>${employee.attendance.holidays || 0}</td>
              </tr>
            </table>
          </div>
          ` : ''}
          ${employee.reimbursements && employee.reimbursements.total > 0 ? `
          <div class="section">
            <div class="section-title">REIMBURSEMENT DETAILS</div>
            <table>
              <tr>
                <th>Type</th>
                <th class="text-right">Amount</th>
              </tr>
              ${Object.entries(employee.reimbursements).filter(([key]) => key !== 'total').map(([key, value]) => `
                <tr>
                  <td>${key.replace(/([A-Z])/g, ' $1').toUpperCase()}</td>
                  <td class="text-right">${formatCurrency(value)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>TOTAL REIMBURSEMENT</td>
                <td class="text-right">${formatCurrency(employee.reimbursements.total)}</td>
              </tr>
            </table>
          </div>
          ` : ''}
          ${slip && passwordProtect ? `
            <div class="section">
              <div class="section-title">SECURITY INFORMATION</div>
              <div class="password">
                <strong>PDF Password:</strong> ${password}<br>
                <small>Use this password to open the PDF file</small>
              </div>
            </div>
          ` : ''}
          <div class="signature">
            <div style="margin-bottom: 60px;">
              <div style="border-top: 1px solid #000; width: 200px; display: inline-block;"></div><br>
              <strong>${companySettings.signatory || 'Authorized Signatory'}</strong><br>
              Authorized Signatory
            </div>
          </div>
          <div class="footer text-center">
            <div>${companySettings.confidentiality || 'This document is confidential'}</div>
            <div>${companySettings.footerText || 'Generated by HRMS System'}</div>
            <div>Generated on: ${new Date().toLocaleString()}</div>
          </div>
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; margin: 5px;">Print Salary Slip</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; cursor: pointer; margin: 5px;">Close</button>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      if (slip) {
        setSalaryData(prev => ({
          ...prev,
          salarySlips: prev.salarySlips.map(s =>
            s.id === slip.id ? { ...s, downloaded: true } : s
          )
        }));
      }

      setGenerationStatus('completed');
      showNotification('PDF downloaded successfully!', 'success');

    } catch (error) {
      console.error('Error downloading PDF:', error);
      showNotification('Error downloading PDF. Please try again.', 'error');
      setGenerationStatus('error');
    }
  };

  const handleSendEmail = (employee, slipId) => {
    if (!employee) {
      showNotification('Employee not found', 'error');
      return;
    }

    setGenerationStatus('sending');

    try {
      const slip = salaryData.salarySlips.find(s => s.id === slipId);

      if (!slip) {
        showNotification('No salary slip found for this employee.', 'error');
        setGenerationStatus('error');
        return;
      }

      const emailBody = companySettings.emailBody
        .replace('[Employee Name]', employee.name || 'N/A')
        .replace('[Month Year]', slip.month || 'N/A')
        .replace('[Net Amount]', formatCurrency(slip.netSalary))
        .replace('[Payment Date]', formatDate(slip.dateGenerated))
        .replace('[Password]', slip.password || 'N/A');

      setSalaryData(prev => ({
        ...prev,
        salarySlips: prev.salarySlips.map(s =>
          s.id === slip.id ? {
            ...s,
            emailSent: true,
            emailDate: new Date().toISOString().split('T')[0],
            status: 'distributed',
            distributionMethod: 'email'
          } : s
        )
      }));

      setGenerationStatus('completed');
      showNotification(`Salary slip sent via email to ${employee.email || 'employee'}`, 'success');

    } catch (error) {
      console.error('Error sending email:', error);
      showNotification('Error sending email. Please try again.', 'error');
      setGenerationStatus('error');
    }
  };

  const handleDeleteSlip = (slip) => {
    openModal('delete', slip);
  };

  const confirmDeleteSlip = (slip) => {
    setSalaryData(prev => ({
      ...prev,
      salarySlips: prev.salarySlips.filter(s => s.id !== slip.id)
    }));
    setSelectedSlips(prev => prev.filter(id => id !== slip.id));
    closeModal();
    showNotification(`Salary slip for ${slip.employeeName} deleted successfully.`, 'success');
  };

  const handleBulkDownload = (data) => {
    setGenerationStatus('processing');

    try {
      const slipsToDownload = data.month === 'all'
        ? selectedSlips.length > 0
          ? selectedSlips.map(id => salaryData.salarySlips.find(s => s.id === id)).filter(Boolean)
          : salaryData.salarySlips
        : salaryData.salarySlips.filter(slip => {
            const slipMonth = slip.month?.toLowerCase() || '';
            const selectedMonthName = data.month ? new Date(data.month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' }).toLowerCase() : '';
            return slipMonth.includes(selectedMonthName);
          });

      if (slipsToDownload.length === 0) {
        showNotification('No salary slips found for the selected criteria', 'warning');
        setGenerationStatus('idle');
        return;
      }

      if (data.format === 'excel') {
        const excelData = slipsToDownload.map(slip => {
          const employee = salaryData.employees.find(e => e.id === slip.employeeId);
          return {
            'Slip ID': slip.id || '',
            'Employee ID': slip.employeeId || '',
            'Employee Name': slip.employeeName || '',
            'Month': slip.month || '',
            'Period': slip.period || '',
            'Gross Salary': slip.grossSalary || 0,
            'Net Salary': slip.netSalary || 0,
            'Status': slip.status || '',
            'Distribution Method': slip.distributionMethod || '',
            'Password': data.includePassword ? slip.password || '***' : '***',
            'Date Generated': slip.dateGenerated || '',
            'Email Sent': slip.emailSent ? 'Yes' : 'No',
            'SMS Sent': slip.smsSent ? 'Yes' : 'No',
            'Department': employee?.department || '',
            'Designation': employee?.designation || ''
          };
        });

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Salary Slips');
        XLSX.writeFile(wb, `salary_slips_export_${new Date().toISOString().split('T')[0]}.xlsx`);

        showNotification(`Excel export completed. ${slipsToDownload.length} records exported.`, 'success');
      } else {
        setTimeout(() => {
          const blob = new Blob(['Salary slips data'], { type: 'application/octet-stream' });
          saveAs(blob, `salary_slips_${new Date().toISOString().split('T')[0]}.${data.format === 'zip' ? 'zip' : 'pdf'}`);

          setSalaryData(prev => ({
            ...prev,
            salarySlips: prev.salarySlips.map(slip =>
              slipsToDownload.some(s => s.id === slip.id) ? { ...slip, downloaded: true } : slip
            )
          }));

          showNotification(`Download completed. ${slipsToDownload.length} files processed.`, 'success');
        }, 2000);
      }

      closeModal();
      setGenerationStatus('completed');

    } catch (error) {
      console.error('Error in bulk download:', error);
      showNotification('Error processing bulk download. Please try again.', 'error');
      setGenerationStatus('error');
    }
  };

  const handleSaveSettings = (settings, notifications) => {
    setCompanySettings(settings);
    setNotificationSettings(notifications);
    closeModal();
    showNotification('Settings saved successfully!', 'success');
  };

  const toggleSelectSlip = (slipId) => {
    setSelectedSlips(prev =>
      prev.includes(slipId) ? prev.filter(id => id !== slipId) : [...prev, slipId]
    );
  };

  const selectAllSlips = () => {
    if (selectedSlips.length === filteredSlips.length) {
      setSelectedSlips([]);
    } else {
      setSelectedSlips(filteredSlips.map(slip => slip.id));
    }
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Slips"
        value={kpis.totalSlips}
        subtitle="Generated"
        icon="heroicons:document-text"
        color="blue"
      />
      <StatCard
        title="Total Employees"
        value={kpis.totalEmployees}
        subtitle="Active"
        icon="heroicons:users"
        color="green"
      />
      <StatCard
        title="Distributed"
        value={kpis.distributedSlips}
        subtitle="Successfully sent"
        icon="heroicons:envelope"
        color="purple"
      />
      <StatCard
        title="Total Payout"
        value={formatCurrency(kpis.totalPayout)}
        subtitle="Net salary"
        icon="heroicons:currency-rupee"
        color="amber"
      />
    </div>
  );

  const renderGenerateTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <h5 className="font-bold text-slate-800">Generate Salary Slips</h5>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Employee</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={selectedEmployee?.id || ''}
              onChange={(e) => {
                const emp = salaryData.employees.find(emp => emp.id === e.target.value);
                setSelectedEmployee(emp);
              }}
            >
              <option value="">Select an employee</option>
              {salaryData.employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pay Period</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Select month</option>
              <option value="2024-03">March 2024</option>
              <option value="2024-02">February 2024</option>
              <option value="2024-01">January 2024</option>
              <option value="2023-12">December 2023</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Distribution Method</label>
            <select
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
              value={distributionMethod}
              onChange={(e) => setDistributionMethod(e.target.value)}
            >
              <option value="email">Email</option>
              <option value="portal">Portal</option>
              <option value="both">Both</option>
              <option value="print">Print</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={passwordProtect}
                onChange={(e) => setPasswordProtect(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Protect PDF with password</span>
            </label>
          </div>
        </div>

        {selectedEmployee && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{selectedEmployee.name}</p>
                <p className="text-sm text-slate-500">{selectedEmployee.designation} • {selectedEmployee.department}</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                {selectedEmployee.id}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => openModal('generate')}
            disabled={!selectedEmployee || generationStatus === 'generating'}
          >
            {generationStatus === 'generating' ? (
              <>
                <Icon icon="heroicons:arrow-path" className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Icon icon="heroicons:document-plus" className="w-4 h-4" />
                Generate Salary Slip
              </>
            )}
          </button>
          <button
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
            onClick={() => {
              setSelectedEmployee(null);
              showNotification('Generating all salary slips...', 'info');
            }}
          >
            <Icon icon="heroicons:users" className="w-4 h-4" />
            Generate All
          </button>
          <button
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Icon icon="heroicons:eye" className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {showPreview && selectedEmployee && (
          <div className="mt-4 p-4 border border-slate-200 rounded-xl bg-white">
            <div className="flex items-center justify-between mb-4">
              <h6 className="font-bold text-slate-800">Salary Slip Preview</h6>
              <span className="text-sm text-slate-500">{selectedEmployee.name}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500">Employee</p>
                  <p className="font-semibold text-slate-800">{selectedEmployee.name}</p>
                </div>
                <div>
                  <p className="text-slate-500">Designation</p>
                  <p className="font-semibold text-slate-800">{selectedEmployee.designation}</p>
                </div>
                <div>
                  <p className="text-slate-500">Gross Salary</p>
                  <p className="font-semibold text-emerald-600">{formatCurrency(calculateTotals(selectedEmployee).grossSalary)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Net Salary</p>
                  <p className="font-semibold text-blue-600">{formatCurrency(calculateTotals(selectedEmployee).netSalary)}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <p className="text-slate-500 text-xs">Click "Generate Salary Slip" to create the full document</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-3">
          <h5 className="font-bold text-slate-800">Salary Slip History</h5>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={() => openModal('bulk')}
            >
              <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              Bulk Download
            </button>
            <button
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
              onClick={() => {
                setSearchTerm('');
                setSelectedSlips([]);
                setCurrentPage(1);
              }}
            >
              <Icon icon="heroicons:refresh" className="w-4 h-4" />
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
              placeholder="Search by employee, ID, month..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            onClick={selectAllSlips}
          >
            <Icon icon="heroicons:check-circle" className="w-4 h-4" />
            {selectedSlips.length === filteredSlips.length ? 'Deselect All' : 'Select All'}
          </button>
          {selectedSlips.length > 0 && (
            <span className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
              {selectedSlips.length} selected
            </span>
          )}
        </div>

        {filteredSlips.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="heroicons:document-text" className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h5 className="text-slate-600 font-medium text-lg">No salary slips found</h5>
            <p className="text-slate-400 text-sm">Try adjusting your search or generate new salary slips.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSlips.length === filteredSlips.length && filteredSlips.length > 0}
                      onChange={selectAllSlips}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Slip ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Employee</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Month</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">Net Salary</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Status</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Method</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedSlips.map((slip) => {
                  const employee = salaryData.employees.find(e => e.id === slip.employeeId);
                  return (
                    <tr key={slip.id} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedSlips.includes(slip.id)}
                          onChange={() => toggleSelectSlip(slip.id)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-800">{slip.id}</td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-slate-800">{slip.employeeName}</div>
                        <div className="text-xs text-slate-500">{slip.employeeId}</div>
                      </td>
                      <td className="px-3 py-2 text-slate-700">{slip.month}</td>
                      <td className="px-3 py-2 text-right font-semibold text-emerald-600">
                        {formatCurrency(slip.netSalary)}
                      </td>
                      <td className="px-3 py-2 text-center">{getStatusBadge(slip.status)}</td>
                      <td className="px-3 py-2 text-center">{getMethodBadge(slip.distributionMethod)}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                            onClick={() => handleDownloadPDF(employee, slip.id)}
                            title="Download PDF"
                          >
                            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                            onClick={() => handleSendEmail(employee, slip.id)}
                            title="Send Email"
                          >
                            <Icon icon="heroicons:envelope" className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                            onClick={() => handleDeleteSlip(slip)}
                            title="Delete"
                          >
                            <Icon icon="heroicons:trash" className="w-4 h-4" />
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

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="text-sm text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSlips.length)} of {filteredSlips.length} slips
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
      </div>
    </div>
  );

  const renderDistributionTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-slate-800">Distribution Settings</h5>
          <button
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition flex items-center gap-2"
            onClick={() => {
              setCompanySettings({
                name: '',
                address: '',
                logo: '',
                seal: '',
                signatory: '',
                footerText: '',
                confidentiality: '',
                defaultPassword: 'employee_id',
                emailSubject: '',
                emailBody: '',
                retentionPeriod: 12,
                allowRevisions: true,
                revisionDays: 7
              });
              setNotificationSettings({
                email: true,
                sms: true,
                portal: true,
                autoSend: true,
                sendTime: '09:00',
                ccHR: true,
                bccAccounts: false
              });
              showNotification('Settings reset to default values', 'success');
            }}
          >
            <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
            Reset to Default
          </button>
        </div>
      </div>
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h6 className="font-bold text-sm text-slate-700 mb-3">Email Settings</h6>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.email}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, email: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Send automatic email on generation</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.ccHR}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, ccHR: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">CC HR Department</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.bccAccounts}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, bccAccounts: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">BCC Accounts Department</span>
              </label>
              <div className="mt-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Subject</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={companySettings.emailSubject}
                  onChange={(e) => setCompanySettings({ ...companySettings, emailSubject: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <h6 className="font-bold text-sm text-slate-700 mb-3">Portal & SMS Settings</h6>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Default Password</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
                  value={companySettings.defaultPassword}
                  onChange={(e) => setCompanySettings({ ...companySettings, defaultPassword: e.target.value })}
                >
                  <option value="employee_id">Employee ID</option>
                  <option value="dob">Date of Birth</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.sms}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, sms: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Send SMS notification</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.portal}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, portal: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Enable employee portal access</span>
              </label>
              <div className="mt-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Auto-send Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={notificationSettings.sendTime}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, sendTime: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h6 className="font-bold text-sm text-slate-700">Email Template</h6>
            <button
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
              onClick={() => setCompanySettings({ ...companySettings, emailBody: '' })}
            >
              Reset
            </button>
          </div>
          <textarea
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
            rows="6"
            value={companySettings.emailBody}
            onChange={(e) => setCompanySettings({ ...companySettings, emailBody: e.target.value })}
          />
          <p className="text-xs text-slate-500 mt-1">
            <strong>Placeholders:</strong> [Employee Name], [Month Year], [Net Amount], [Payment Date], [Password]
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
            onClick={() => openModal('settings')}
          >
            <Icon icon="heroicons:cog" className="w-4 h-4" />
            Advanced Settings
          </button>
          <button
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            onClick={() => {
              const settingsData = [
                ['Company Settings', ''],
                ['Company Name', companySettings.name || ''],
                ['Company Address', companySettings.address || ''],
                ['Authorized Signatory', companySettings.signatory || ''],
                ['Email Subject', companySettings.emailSubject || ''],
                ['Default Password', companySettings.defaultPassword || ''],
                ['', ''],
                ['Notification Settings', ''],
                ['Email Notifications', notificationSettings.email ? 'Enabled' : 'Disabled'],
                ['SMS Notifications', notificationSettings.sms ? 'Enabled' : 'Disabled'],
                ['Portal Access', notificationSettings.portal ? 'Enabled' : 'Disabled'],
                ['Auto Send', notificationSettings.autoSend ? 'Enabled' : 'Disabled'],
                ['Send Time', notificationSettings.sendTime || ''],
                ['CC HR', notificationSettings.ccHR ? 'Yes' : 'No'],
                ['BCC Accounts', notificationSettings.bccAccounts ? 'Yes' : 'No'],
                ['', ''],
                ['Export Date', new Date().toLocaleString()],
              ];

              const ws = XLSX.utils.aoa_to_sheet(settingsData);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Settings');
              XLSX.writeFile(wb, `salary_slip_settings_${new Date().toISOString().split('T')[0]}.xlsx`);
              showNotification('Settings exported successfully!', 'success');
            }}
          >
            <Icon icon="heroicons:document-arrow-down" className="w-4 h-4" />
            Export Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <h5 className="font-bold text-slate-800">System Settings</h5>
      </div>
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h6 className="font-bold text-sm text-slate-700 mb-3">Company Information</h6>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={companySettings.name}
                  onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Company Address</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                  rows="2"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Authorized Signatory</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={companySettings.signatory}
                  onChange={(e) => setCompanySettings({ ...companySettings, signatory: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <h6 className="font-bold text-sm text-slate-700 mb-3">Document Settings</h6>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Footer Text</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={companySettings.footerText}
                  onChange={(e) => setCompanySettings({ ...companySettings, footerText: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Confidentiality Text</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                  rows="2"
                  value={companySettings.confidentiality}
                  onChange={(e) => setCompanySettings({ ...companySettings, confidentiality: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Retention Period (months)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={companySettings.retentionPeriod}
                  onChange={(e) => setCompanySettings({ ...companySettings, retentionPeriod: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h6 className="font-bold text-sm text-slate-700 mb-3">Advanced Settings</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={companySettings.allowRevisions}
                onChange={(e) => setCompanySettings({ ...companySettings, allowRevisions: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Allow salary slip revisions</span>
            </label>
            {companySettings.allowRevisions && (
              <div>
                <label className="block text-sm text-slate-600">Revision allowed for</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    value={companySettings.revisionDays}
                    onChange={(e) => setCompanySettings({ ...companySettings, revisionDays: parseInt(e.target.value) })}
                  />
                  <span className="text-sm text-slate-600">days</span>
                </div>
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.autoSend}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, autoSend: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Auto-send on generation</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
            onClick={() => openModal('settings')}
          >
            <Icon icon="heroicons:cog" className="w-4 h-4" />
            Open Advanced Settings
          </button>
          <button
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            onClick={() => {
              setCompanySettings({
                name: '',
                address: '',
                logo: '',
                seal: '',
                signatory: '',
                footerText: '',
                confidentiality: '',
                defaultPassword: 'employee_id',
                emailSubject: '',
                emailBody: '',
                retentionPeriod: 12,
                allowRevisions: true,
                revisionDays: 7
              });
              showNotification('Settings reset to default values', 'success');
            }}
          >
            <Icon icon="heroicons:arrow-path" className="w-4 h-4" />
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'generate':
        return renderGenerateTab();
      case 'history':
        return renderHistoryTab();
      case 'distribution':
        return renderDistributionTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderGenerateTab();
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl">
            <Icon icon="heroicons:document-text" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Salary Slip Generation & Distribution</h1>
            <p className="text-sm text-slate-500">Generate, distribute, and manage employee salary slips</p>
          </div>
        </div>
      </div>

      {renderStats()}

      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
        {[
          { id: 'generate', label: 'Generate', icon: 'heroicons:document-plus' },
          { id: 'history', label: 'History', icon: 'heroicons:clock' },
          { id: 'distribution', label: 'Distribution', icon: 'heroicons:paper-airplane' },
          { id: 'settings', label: 'Settings', icon: 'heroicons:cog-6-tooth' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon icon={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {renderContent()}

      <SalarySlipModal
        isOpen={modalState.isOpen && modalState.type === 'generate'}
        onClose={closeModal}
        onSubmit={handleGenerateSalarySlip}
        slip={modalState.data}
        formatCurrency={formatCurrency}
      />

      <BulkDownloadModal
        isOpen={modalState.isOpen && modalState.type === 'bulk'}
        onClose={closeModal}
        onSubmit={handleBulkDownload}
        totalSlips={selectedSlips.length || filteredSlips.length}
        formatCurrency={formatCurrency}
      />

      <DeleteSlipModal
        isOpen={modalState.isOpen && modalState.type === 'delete'}
        onClose={closeModal}
        onConfirm={confirmDeleteSlip}
        slip={modalState.data}
        formatCurrency={formatCurrency}
      />

      <SettingsModal
        isOpen={modalState.isOpen && modalState.type === 'settings'}
        onClose={closeModal}
        onSave={handleSaveSettings}
        settings={companySettings}
        notificationSettings={notificationSettings}
      />

      <NotificationToast
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, isOpen: false })}
      />

      {generationStatus !== 'idle' && generationStatus !== 'completed' && generationStatus !== 'error' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-blue-600 text-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
            <Icon icon="heroicons:arrow-path" className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">
              {generationStatus === 'generating' && 'Generating salary slip...'}
              {generationStatus === 'downloading' && 'Downloading PDF...'}
              {generationStatus === 'sending' && 'Sending email...'}
              {generationStatus === 'processing' && 'Processing...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salaryslip;