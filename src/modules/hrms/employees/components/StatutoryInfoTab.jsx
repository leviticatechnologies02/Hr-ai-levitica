import React from 'react';
import { Icon } from '@iconify/react';

const StatutoryInfoTab = ({ employee, formatDate }) => {
  const statutoryInfo = employee.statutoryInfo || {};

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:shield-check" />
            </span>
            Statutory & Compliance Information
          </h6>
        </div>

        {/* PAN Details */}
        <div className="col-span-1 md:col-span-2">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:credit-bg-white rounded-xl shadow-sm border border-gray-200" />
            </span>PAN Card Details</h6>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">PAN Number</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 mb-0">{statutoryInfo.pan?.number || 'N/A'}</p>
            {statutoryInfo.pan?.verified && (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
            )}
          </div>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Verification Date</label>
          <p className="text-gray-900">{statutoryInfo.pan?.verifiedDate ? formatDate(statutoryInfo.pan.verifiedDate) : 'N/A'}</p>
        </div>

        {/* Aadhaar Details */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:identification" />
            </span>Aadhaar Card Details</h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Aadhaar Number</label>
          <div className="flex items-center gap-2">
            <p className="text-gray-900 mb-0">{statutoryInfo.aadhaar?.number || 'N/A'}</p>
            {statutoryInfo.aadhaar?.verified && (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
            )}
          </div>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Verification Date</label>
          <p className="text-gray-900">{statutoryInfo.aadhaar?.verifiedDate ? formatDate(statutoryInfo.aadhaar.verifiedDate) : 'N/A'}</p>
        </div>

        {/* PF Membership */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:banknotes" />
            </span>Provident Fund Membership</h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">PF Enrolled</label>
          <p className="text-gray-900">
            {statutoryInfo.pfMembership?.enrolled ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
            )}
          </p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">PF Account Number</label>
          <p className="text-gray-900">{statutoryInfo.pfMembership?.accountNumber || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">UAN</label>
          <p className="text-gray-900">{statutoryInfo.pfMembership?.uan || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Enrollment Date</label>
          <p className="text-gray-900">{statutoryInfo.pfMembership?.enrollmentDate ? formatDate(statutoryInfo.pfMembership.enrollmentDate) : 'N/A'}</p>
        </div>

        {/* ESI Registration */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:heart" />
            </span>ESI Registration</h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">ESI Enrolled</label>
          <p className="text-gray-900">
            {statutoryInfo.esiRegistration?.enrolled ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
            )}
          </p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">ESI Number</label>
          <p className="text-gray-900">{statutoryInfo.esiRegistration?.number || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Enrollment Date</label>
          <p className="text-gray-900">{statutoryInfo.esiRegistration?.enrollmentDate ? formatDate(statutoryInfo.esiRegistration.enrollmentDate) : 'N/A'}</p>
        </div>

        {/* Professional Tax */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:document-text" />
            </span>Professional Tax</h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Applicable</label>
          <p className="text-gray-900">
            {statutoryInfo.professionalTax?.applicable ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
            )}
          </p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">State</label>
          <p className="text-gray-900">{statutoryInfo.professionalTax?.state || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">PT Number</label>
          <p className="text-gray-900">{statutoryInfo.professionalTax?.ptNumber || 'N/A'}</p>
        </div>

        {/* Labour Welfare Fund */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:users" />
            </span>Labour Welfare Fund</h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Enrolled</label>
          <p className="text-gray-900">
            {statutoryInfo.labourWelfareFund?.enrolled ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
            )}
          </p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Enrollment Date</label>
          <p className="text-gray-900">{statutoryInfo.labourWelfareFund?.enrollmentDate ? formatDate(statutoryInfo.labourWelfareFund.enrollmentDate) : 'N/A'}</p>
        </div>

        {/* Gratuity */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:gift" />
            </span>Gratuity</h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Eligible</label>
          <p className="text-gray-900">
            {statutoryInfo.gratuity?.eligible ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
            )}
          </p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Eligibility Date</label>
          <p className="text-gray-900">{statutoryInfo.gratuity?.eligibilityDate ? formatDate(statutoryInfo.gratuity.eligibilityDate) : 'N/A'}</p>
        </div>

        {/* Bonus Act */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:currency-rupee" />
            </span>Bonus Act</h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Applicable</label>
          <p className="text-gray-900">
            {statutoryInfo.bonusAct?.applicable ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
            )}
          </p>
        </div>

        {/* Shops and Establishment */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:building-office" />
            </span>Shops and Establishment Act</h6>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Registered</label>
          <p className="text-gray-900">
            {statutoryInfo.shopsAndEstablishment?.registered ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
            ) : (
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
            )}
          </p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Registration Number</label>
          <p className="text-gray-900">{statutoryInfo.shopsAndEstablishment?.registrationNumber || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Registration Date</label>
          <p className="text-gray-900">{statutoryInfo.shopsAndEstablishment?.registrationDate ? formatDate(statutoryInfo.shopsAndEstablishment.registrationDate) : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default StatutoryInfoTab;
