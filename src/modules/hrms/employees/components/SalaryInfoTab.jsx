import React from 'react';
import { Icon } from '@iconify/react';

const SalaryInfoTab = ({ employee, formatCurrency, formatDate }) => {
  const salaryInfo = employee.salaryInfo || {};
  const ctcBreakdown = salaryInfo.ctcBreakdown || {};
  const bankAccounts = salaryInfo.bankAccounts || {};

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current CTC */}
        <div className="col-span-1 md:col-span-2">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:currency-dollar" />
            </span>
            Current Compensation
          </h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Current CTC (Annual)</label>
          <p className="text-gray-900 text-blue-600 font-bold text-lg">
            {formatCurrency(salaryInfo.currentCTC || 0)}
          </p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Salary Structure</label>
          <p className="text-gray-900">{salaryInfo.salaryStructure || 'N/A'}</p>
        </div>

        {/* CTC Breakdown */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2">CTC Breakdown</h6>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  <th>Component</th>
                  <th className="text-right">Amount (Annual)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic</td>
                  <td className="text-right">{formatCurrency(ctcBreakdown.basic || 0)}</td>
                </tr>
                <tr>
                  <td>HRA</td>
                  <td className="text-right">{formatCurrency(ctcBreakdown.hra || 0)}</td>
                </tr>
                <tr>
                  <td>Special Allowance</td>
                  <td className="text-right">{formatCurrency(ctcBreakdown.specialAllowance || 0)}</td>
                </tr>
                <tr>
                  <td>Transport Allowance</td>
                  <td className="text-right">{formatCurrency(ctcBreakdown.transportAllowance || 0)}</td>
                </tr>
                <tr>
                  <td>Medical Allowance</td>
                  <td className="text-right">{formatCurrency(ctcBreakdown.medicalAllowance || 0)}</td>
                </tr>
                <tr>
                  <td>Other Allowances</td>
                  <td className="text-right">{formatCurrency(ctcBreakdown.otherAllowances || 0)}</td>
                </tr>
                <tr className="table-secondary font-bold">
                  <td>Gross Salary</td>
                  <td className="text-right">
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
                  <td className="text-right">{formatCurrency(ctcBreakdown.providentFund || 0)}</td>
                </tr>
                <tr>
                  <td>Gratuity</td>
                  <td className="text-right">{formatCurrency(ctcBreakdown.gratuity || 0)}</td>
                </tr>
                <tr>
                  <td>Other Deductions</td>
                  <td className="text-right">{formatCurrency(ctcBreakdown.otherDeductions || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2 ">
            <span className="icon-circle text-blue-600">
              <Icon icon="heroicons:building-library" />
            </span>
            Bank Account Details
          </h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Payment Mode</label>
          <p className="text-gray-900">{salaryInfo.paymentMode || 'N/A'}</p>
        </div>

        <div className="col-span-1"></div>

        <div className="col-span-1">
          <h6 className="font-bold text-lg mb-3 text-gray-500 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:banknotes" />
            </span>Primary Bank Account</h6>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 border">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200-body">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Account Number</label>
                <p className="text-gray-900">{bankAccounts.primary?.accountNumber || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">IFSC Code</label>
                <p className="text-gray-900">{bankAccounts.primary?.ifscCode || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Bank Name</label>
                <p className="text-gray-900">{bankAccounts.primary?.bankName || 'N/A'}</p>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Branch</label>
                <p className="text-gray-900">{bankAccounts.primary?.branch || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Account Type</label>
                <p className="text-gray-900">{bankAccounts.primary?.accountType || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        {bankAccounts.secondary && (
          <div className="col-span-1">
            <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
              <span className="text-blue-600">
                <Icon icon="heroicons:plus-circle" />
              </span>Secondary Bank Account</h6>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 border">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200-body">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Account Number</label>
                  <p className="text-gray-900">{bankAccounts.secondary.accountNumber || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">IFSC Code</label>
                  <p className="text-gray-900">{bankAccounts.secondary.ifscCode || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Bank Name</label>
                  <p className="text-gray-900">{bankAccounts.secondary.bankName || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Branch</label>
                  <p className="text-gray-900">{bankAccounts.secondary.branch || 'N/A'}</p>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Account Type</label>
                  <p className="text-gray-900">{bankAccounts.secondary.accountType || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PF & ESI */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:shield-check" />
            </span>
            Provident Fund & ESI
          </h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">PF Account Number</label>
          <p className="text-gray-900">{salaryInfo.pfAccountNumber || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">UAN (Universal Account Number)</label>
          <p className="text-gray-900">{salaryInfo.uan || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">ESI Number</label>
          <p className="text-gray-900">{salaryInfo.esiNumber || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">ESI Medical Nominee</label>
          <p className="text-gray-900">{salaryInfo.esiMedicalNominee || 'N/A'}</p>
        </div>

        {/* Tax & Variable Pay */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:document-check" />
            </span>
            Tax & Benefits
          </h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Tax Regime</label>
          <p className="text-gray-900">{salaryInfo.taxDeclaration?.regime || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Tax Declaration</label>
          <p className="text-gray-900">
            {salaryInfo.taxDeclaration?.declared ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Declared</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Not Declared</span>
            )}
          </p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Variable Pay Eligible</label>
          <p className="text-gray-900">
            {salaryInfo.variablePay?.eligible ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{salaryInfo.variablePay.percentage}%</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Not Eligible</span>
            )}
          </p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Bonus Eligible</label>
          <p className="text-gray-900">
            {salaryInfo.bonusEligibility?.eligible ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{formatCurrency(salaryInfo.bonusEligibility.amount || 0)}</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Not Eligible</span>
            )}
          </p>
        </div>

        {/* Salary Revision History */}
        {salaryInfo.salaryRevisionHistory && salaryInfo.salaryRevisionHistory.length > 0 && (
          <div className="col-span-1 md:col-span-2 mt-6">
            <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
              <span className="text-blue-600">
                <Icon icon="heroicons:chart-bar" />
              </span>
              Salary Revision History
            </h6>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
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
                      <td><span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{revision.status}</span></td>
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

export default SalaryInfoTab;
