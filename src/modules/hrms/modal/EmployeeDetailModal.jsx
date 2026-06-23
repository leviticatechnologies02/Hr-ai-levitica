import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const EmployeeDetailModal = ({ isOpen, onClose, employee, onEdit, onDelete, formatDate, formatCurrency }) => {
  const [activeTab, setActiveTab] = useState('personal');

  if (!employee) return null;

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

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'heroicons:user-circle' },
    { id: 'employment', label: 'Employment', icon: 'heroicons:briefcase' },
    { id: 'jobHistory', label: 'Job History', icon: 'heroicons:clock' },
    { id: 'salary', label: 'Salary & Compensation', icon: 'heroicons:currency-dollar' },
    { id: 'statutory', label: 'Statutory & Compliance', icon: 'heroicons:document-check' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab employee={employee} formatDate={formatDate} />;
      case 'employment':
        return <EmploymentInfoTab employee={employee} formatDate={formatDate} getStatusBadge={getStatusBadge} getEmploymentTypeBadge={getEmploymentTypeBadge} />;
      case 'jobHistory':
        return <JobHistoryTab employee={employee} formatDate={formatDate} formatCurrency={formatCurrency} />;
      case 'salary':
        return <SalaryInfoTab employee={employee} formatCurrency={formatCurrency} formatDate={formatDate} />;
      case 'statutory':
        return <StatutoryInfoTab employee={employee} formatDate={formatDate} />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${employee.name} - ${(employee.employmentInfo || {}).employeeId || employee.employeeId}`} size="2xl">
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Icon icon="heroicons:user" className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-500">
              {(employee.employmentInfo || {}).employeeId || employee.employeeId}
            </span>
            <span className="text-sm text-slate-400">•</span>
            <span className="text-sm font-medium text-slate-600">
              {(employee.employmentInfo || {}).designation || employee.designation}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500">
              {(employee.employmentInfo || {}).department || employee.department}
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500">
              {(employee.employmentInfo || {}).location || employee.location}
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 flex-shrink-0">
        <div className="flex overflow-x-auto gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2.5 text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon icon={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        {renderTabContent()}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 mt-4 border-t border-slate-200 flex-shrink-0">
        <button
          type="button"
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
          onClick={onClose}
        >
          Close
        </button>
        <button
          type="button"
          className="w-full sm:w-auto px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          onClick={() => onDelete?.(employee.id)}
        >
          <Icon icon="heroicons:trash" className="w-4 h-4" />
          Delete
        </button>
      </div>
    </Modal>
  );
};


const PersonalInfoTab = ({ employee, formatDate }) => {
  const personalInfo = employee.personalInfo || {};
  const identification = personalInfo.identification || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
          <p className="text-sm font-medium text-slate-800 mt-1">{employee.name}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Birth</label>
          <p className="text-sm text-slate-700 mt-1">{personalInfo.dateOfBirth ? formatDate(personalInfo.dateOfBirth) : 'N/A'}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender</label>
          <p className="text-sm text-slate-700 mt-1">{personalInfo.gender || 'N/A'}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Group</label>
          <p className="text-sm text-slate-700 mt-1">{personalInfo.bloodGroup || 'N/A'}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Marital Status</label>
          <p className="text-sm text-slate-700 mt-1">{personalInfo.maritalStatus || 'N/A'}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nationality</label>
          <p className="text-sm text-slate-700 mt-1">{personalInfo.nationality || 'N/A'}</p>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Languages</label>
          <p className="text-sm text-slate-700 mt-1">
            {personalInfo.languages && personalInfo.languages.length > 0 
              ? personalInfo.languages.join(', ') 
              : 'N/A'}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Icon icon="heroicons:phone" className="w-4 h-4" />
          Contact Information
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Personal Email</label>
            <p className="text-sm text-slate-700 mt-1">{personalInfo.personalEmail || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Phone</label>
            <p className="text-sm text-slate-700 mt-1">{personalInfo.phonePrimary || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Secondary Phone</label>
            <p className="text-sm text-slate-700 mt-1">{personalInfo.phoneSecondary || 'N/A'}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Emergency Phone</label>
            <p className="text-sm text-slate-700 mt-1">{personalInfo.phoneEmergency || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Icon icon="heroicons:map-pin" className="w-4 h-4" />
          Address Information
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Address</label>
            <div className="text-sm text-slate-700 mt-1">
              {personalInfo.currentAddress && personalInfo.currentAddress.line1 ? (
                <>
                  <div>{personalInfo.currentAddress.line1}</div>
                  {personalInfo.currentAddress.line2 && <div>{personalInfo.currentAddress.line2}</div>}
                  <div>{personalInfo.currentAddress.city}, {personalInfo.currentAddress.state} {personalInfo.currentAddress.pincode}</div>
                  <div>{personalInfo.currentAddress.country}</div>
                </>
              ) : 'N/A'}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Permanent Address</label>
            <div className="text-sm text-slate-700 mt-1">
              {personalInfo.permanentAddress && personalInfo.permanentAddress.line1 ? (
                <>
                  <div>{personalInfo.permanentAddress.line1}</div>
                  {personalInfo.permanentAddress.line2 && <div>{personalInfo.permanentAddress.line2}</div>}
                  <div>{personalInfo.permanentAddress.city}, {personalInfo.permanentAddress.state} {personalInfo.permanentAddress.pincode}</div>
                  <div>{personalInfo.permanentAddress.country}</div>
                </>
              ) : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Icon icon="heroicons:document-text" className="w-4 h-4" />
          Identification Documents
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PAN Number</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-700">{identification.pan?.number || 'N/A'}</span>
              {identification.pan?.verified && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Verified
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aadhaar Number</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-700">{identification.aadhaar?.number || 'N/A'}</span>
              {identification.aadhaar?.verified && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Verified
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Passport Number</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-700">{identification.passport?.number || 'N/A'}</span>
              {identification.passport?.verified && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Verified
                </span>
              )}
            </div>
            {identification.passport?.expiryDate && (
              <div className="text-xs text-slate-400 mt-0.5">Expiry: {formatDate(identification.passport.expiryDate)}</div>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Voter ID Number</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-700">{identification.voterId?.number || 'N/A'}</span>
              {identification.voterId?.verified && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmploymentInfoTab = ({ employee, formatDate, getStatusBadge, getEmploymentTypeBadge }) => {
  const empInfo = employee.employmentInfo || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee ID</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.employeeId || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Joining</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.dateOfJoining ? formatDate(empInfo.dateOfJoining) : 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmation Date</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.confirmationDate ? formatDate(empInfo.confirmationDate) : 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Probation Period</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.probationPeriod ? `${empInfo.probationPeriod} months` : 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employment Type</label>
        <div className="mt-1">{getEmploymentTypeBadge(empInfo.employmentType)}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employment Status</label>
        <div className="mt-1">{getStatusBadge(empInfo.employmentStatus)}</div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.department || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Designation</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.designation || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.location || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workplace Type</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.workplaceType || 'N/A'}</p>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Work Email</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.workEmail || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Reporting Manager</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.reportingManager?.direct || 'N/A'}</p>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">HR Business Partner</label>
        <p className="text-sm text-slate-700 mt-1">{empInfo.hrBusinessPartner || 'N/A'}</p>
      </div>
    </div>
  );
};

const JobHistoryTab = ({ employee, formatDate, formatCurrency }) => {
  const jobHistory = employee.jobHistory || [];

  if (jobHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Icon icon="heroicons:clock" className="w-12 h-12 mb-3 text-slate-300" />
        <p className="font-medium text-slate-600">No job history records found</p>
        <p className="text-sm">Employment history will appear here</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-3 font-semibold text-slate-600">Date</th>
            <th className="p-3 font-semibold text-slate-600">Type</th>
            <th className="p-3 font-semibold text-slate-600">Department</th>
            <th className="p-3 font-semibold text-slate-600">Designation</th>
            <th className="p-3 font-semibold text-slate-600">Location</th>
            <th className="p-3 font-semibold text-slate-600">Manager</th>
            <th className="p-3 font-semibold text-slate-600 text-right">Salary Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map((history, idx) => (
            <tr key={idx} className="hover:bg-slate-50">
              <td className="p-3 text-slate-600">{formatDate(history.date)}</td>
              <td className="p-3">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  history.type === 'Promotion' ? 'bg-emerald-100 text-emerald-700' :
                  history.type === 'Transfer' ? 'bg-cyan-100 text-cyan-700' :
                  history.type === 'Joining' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {history.type}
                </span>
              </td>
              <td className="p-3 text-slate-600">{history.department}</td>
              <td className="p-3 text-slate-600">{history.designation}</td>
              <td className="p-3 text-slate-600">{history.location}</td>
              <td className="p-3 text-slate-600">{history.manager}</td>
              <td className="p-3 text-right font-semibold text-slate-700">
                {history.salaryChange ? formatCurrency(history.salaryChange) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SalaryInfoTab = ({ employee, formatCurrency, formatDate }) => {
  const salaryInfo = employee.salaryInfo || {};
  const ctcBreakdown = salaryInfo.ctcBreakdown || {};
  const bankAccounts = salaryInfo.bankAccounts || {};

  const calculateGross = () => {
    return (ctcBreakdown.basic || 0) +
      (ctcBreakdown.hra || 0) +
      (ctcBreakdown.specialAllowance || 0) +
      (ctcBreakdown.transportAllowance || 0) +
      (ctcBreakdown.medicalAllowance || 0) +
      (ctcBreakdown.otherAllowances || 0);
  };

  const hasSalaryData = salaryInfo.currentCTC || 
    Object.values(ctcBreakdown).some(v => v > 0) ||
    bankAccounts.primary?.accountNumber;

  if (!hasSalaryData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Icon icon="heroicons:currency-dollar" className="w-12 h-12 mb-3 text-slate-300" />
        <p className="font-medium text-slate-600">No salary information available</p>
        <p className="text-sm">Salary details will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Current CTC (Annual)</label>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(salaryInfo.currentCTC || 0)}</p>
          </div>
          <div className="text-right">
            <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Salary Structure</label>
            <p className="text-sm text-blue-700">{salaryInfo.salaryStructure || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div>
        <h6 className="text-sm font-bold text-slate-800 mb-3">CTC Breakdown</h6>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-3 font-semibold text-slate-600">Component</th>
                <th className="p-3 font-semibold text-slate-600 text-right">Amount (Annual)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { label: 'Basic', value: ctcBreakdown.basic },
                { label: 'HRA', value: ctcBreakdown.hra },
                { label: 'Special Allowance', value: ctcBreakdown.specialAllowance },
                { label: 'Transport Allowance', value: ctcBreakdown.transportAllowance },
                { label: 'Medical Allowance', value: ctcBreakdown.medicalAllowance },
                { label: 'Other Allowances', value: ctcBreakdown.otherAllowances },
              ].map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 text-slate-600">{item.label}</td>
                  <td className="p-3 text-right text-slate-700">{formatCurrency(item.value || 0)}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-semibold">
                <td className="p-3 text-slate-700">Gross Salary</td>
                <td className="p-3 text-right text-slate-800">{formatCurrency(calculateGross())}</td>
              </tr>
              {[
                { label: 'Provident Fund', value: ctcBreakdown.providentFund },
                { label: 'Gratuity', value: ctcBreakdown.gratuity },
                { label: 'Other Deductions', value: ctcBreakdown.otherDeductions },
              ].map((item, idx) => (
                <tr key={idx}>
                  <td className="p-3 text-slate-600">{item.label}</td>
                  <td className="p-3 text-right text-slate-700">{formatCurrency(item.value || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(bankAccounts.primary?.accountNumber || bankAccounts.secondary?.accountNumber) && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:building-library" className="w-4 h-4" />
            Bank Account Details
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Mode</label>
              <p className="text-sm text-slate-700 mt-1">{salaryInfo.paymentMode || 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            {bankAccounts.primary?.accountNumber && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Primary Bank Account</h6>
                <div className="space-y-1 text-sm">
                  <div><span className="text-slate-500">Account:</span> {bankAccounts.primary.accountNumber}</div>
                  <div><span className="text-slate-500">IFSC:</span> {bankAccounts.primary.ifscCode || 'N/A'}</div>
                  <div><span className="text-slate-500">Bank:</span> {bankAccounts.primary.bankName || 'N/A'}</div>
                  <div><span className="text-slate-500">Branch:</span> {bankAccounts.primary.branch || 'N/A'}</div>
                  <div><span className="text-slate-500">Type:</span> {bankAccounts.primary.accountType || 'Savings'}</div>
                </div>
              </div>
            )}
            {bankAccounts.secondary?.accountNumber && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Secondary Bank Account</h6>
                <div className="space-y-1 text-sm">
                  <div><span className="text-slate-500">Account:</span> {bankAccounts.secondary.accountNumber}</div>
                  <div><span className="text-slate-500">IFSC:</span> {bankAccounts.secondary.ifscCode || 'N/A'}</div>
                  <div><span className="text-slate-500">Bank:</span> {bankAccounts.secondary.bankName || 'N/A'}</div>
                  <div><span className="text-slate-500">Branch:</span> {bankAccounts.secondary.branch || 'N/A'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {(salaryInfo.pfAccountNumber || salaryInfo.uan || salaryInfo.esiNumber) && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:shield-check" className="w-4 h-4" />
            Provident Fund & ESI
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PF Account Number</label>
              <p className="text-sm text-slate-700 mt-1">{salaryInfo.pfAccountNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">UAN</label>
              <p className="text-sm text-slate-700 mt-1">{salaryInfo.uan || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ESI Number</label>
              <p className="text-sm text-slate-700 mt-1">{salaryInfo.esiNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ESI Medical Nominee</label>
              <p className="text-sm text-slate-700 mt-1">{salaryInfo.esiMedicalNominee || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {(salaryInfo.taxDeclaration?.regime || salaryInfo.variablePay?.eligible || salaryInfo.bonusEligibility?.eligible) && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:document-check" className="w-4 h-4" />
            Tax & Benefits
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tax Regime</label>
              <p className="text-sm text-slate-700 mt-1">{salaryInfo.taxDeclaration?.regime || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tax Declaration</label>
              <div className="mt-1">
                {salaryInfo.taxDeclaration?.declared ? (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Declared
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                    Not Declared
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Variable Pay</label>
              <div className="mt-1">
                {salaryInfo.variablePay?.eligible ? (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {salaryInfo.variablePay.percentage}%
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    Not Eligible
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bonus</label>
              <div className="mt-1">
                {salaryInfo.bonusEligibility?.eligible ? (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {formatCurrency(salaryInfo.bonusEligibility.amount || 0)}
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    Not Eligible
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {salaryInfo.salaryRevisionHistory && salaryInfo.salaryRevisionHistory.length > 0 && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:chart-bar" className="w-4 h-4" />
            Salary Revision History
          </h6>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold text-slate-600">Effective Date</th>
                  <th className="p-3 font-semibold text-slate-600 text-right">Previous CTC</th>
                  <th className="p-3 font-semibold text-slate-600 text-right">New CTC</th>
                  <th className="p-3 font-semibold text-slate-600 text-right">Increase</th>
                  <th className="p-3 font-semibold text-slate-600">Approved By</th>
                  <th className="p-3 font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salaryInfo.salaryRevisionHistory.map((revision, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-600">{formatDate(revision.effectiveDate)}</td>
                    <td className="p-3 text-right text-slate-600">{formatCurrency(revision.previousCTC)}</td>
                    <td className="p-3 text-right font-semibold text-slate-700">{formatCurrency(revision.newCTC)}</td>
                    <td className="p-3 text-right font-semibold text-emerald-600">{revision.percentageIncrease}%</td>
                    <td className="p-3 text-slate-600">{revision.approvedBy}</td>
                    <td className="p-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {revision.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const StatutoryInfoTab = ({ employee, formatDate }) => {
  const statutoryInfo = employee.statutoryInfo || {};
  
  const hasStatutoryData = statutoryInfo.pan?.number || 
    statutoryInfo.aadhaar?.number ||
    statutoryInfo.pfMembership?.enrolled ||
    statutoryInfo.esiRegistration?.enrolled ||
    statutoryInfo.professionalTax?.applicable ||
    statutoryInfo.gratuity?.eligible ||
    statutoryInfo.bonusAct?.applicable ||
    statutoryInfo.shopsAndEstablishment?.registered;

  if (!hasStatutoryData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Icon icon="heroicons:document-check" className="w-12 h-12 mb-3 text-slate-300" />
        <p className="font-medium text-slate-600">No statutory information available</p>
        <p className="text-sm">Statutory details will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {statutoryInfo.pan?.number && (
        <div>
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:identification" className="w-4 h-4" />
            PAN Card Details
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PAN Number</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-700">{statutoryInfo.pan.number}</span>
                {statutoryInfo.pan?.verified && (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verification Date</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.pan?.verifiedDate ? formatDate(statutoryInfo.pan.verifiedDate) : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {statutoryInfo.aadhaar?.number && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:document-text" className="w-4 h-4" />
            Aadhaar Card Details
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aadhaar Number</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-700">{statutoryInfo.aadhaar.number}</span>
                {statutoryInfo.aadhaar?.verified && (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verification Date</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.aadhaar?.verifiedDate ? formatDate(statutoryInfo.aadhaar.verifiedDate) : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {statutoryInfo.pfMembership?.enrolled && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:shield-check" className="w-4 h-4" />
            Provident Fund Membership
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PF Enrolled</label>
              <div className="mt-1">
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Yes
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PF Account Number</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.pfMembership?.accountNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">UAN</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.pfMembership?.uan || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrollment Date</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.pfMembership?.enrollmentDate ? formatDate(statutoryInfo.pfMembership.enrollmentDate) : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {statutoryInfo.esiRegistration?.enrolled && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:building-library" className="w-4 h-4" />
            ESI Registration
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ESI Enrolled</label>
              <div className="mt-1">
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Yes
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ESI Number</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.esiRegistration?.number || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrollment Date</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.esiRegistration?.enrollmentDate ? formatDate(statutoryInfo.esiRegistration.enrollmentDate) : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {statutoryInfo.professionalTax?.applicable && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:document-check" className="w-4 h-4" />
            Professional Tax
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicable</label>
              <div className="mt-1">
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Yes
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">State</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.professionalTax?.state || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PT Number</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.professionalTax?.ptNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {statutoryInfo.gratuity?.eligible && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:gift" className="w-4 h-4" />
            Gratuity
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Eligible</label>
              <div className="mt-1">
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Yes
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Eligibility Date</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.gratuity?.eligibilityDate ? formatDate(statutoryInfo.gratuity.eligibilityDate) : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {statutoryInfo.bonusAct?.applicable && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:check-badge" className="w-4 h-4" />
            Bonus Act
          </h6>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicable</label>
            <div className="mt-1">
              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                Yes
              </span>
            </div>
          </div>
        </div>
      )}

      {statutoryInfo.shopsAndEstablishment?.registered && (
        <div className="border-t border-slate-200 pt-4">
          <h6 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Icon icon="heroicons:building-office" className="w-4 h-4" />
            Shops and Establishment Act
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered</label>
              <div className="mt-1">
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Yes
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registration Number</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.shopsAndEstablishment?.registrationNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registration Date</label>
              <p className="text-sm text-slate-700 mt-1">{statutoryInfo.shopsAndEstablishment?.registrationDate ? formatDate(statutoryInfo.shopsAndEstablishment.registrationDate) : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetailModal;