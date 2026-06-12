import React from 'react';
import { Icon } from '@iconify/react';

const EmploymentInfoTab = ({ employee, formatDate, getStatusBadge, getEmploymentTypeBadge }) => {
  const empInfo = employee.employmentInfo || {};

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="icon-circle  text-blue-600">
              <Icon icon="heroicons:briefcase" />
            </span>
            <span>Employment Details</span>
          </h6>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Employee ID</label>
          <p className="text-gray-900">{empInfo.employeeId || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Date of Joining</label>
          <p className="text-gray-900">{empInfo.dateOfJoining ? formatDate(empInfo.dateOfJoining) : 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Confirmation Date</label>
          <p className="text-gray-900">{empInfo.confirmationDate ? formatDate(empInfo.confirmationDate) : 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Probation Period (months)</label>
          <p className="text-gray-900">{empInfo.probationPeriod || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Employment Type</label>
          <p className="text-gray-900">{getEmploymentTypeBadge(empInfo.employmentType || 'N/A')}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Employment Status</label>
          <p className="flex items-center">{getStatusBadge(empInfo.employmentStatus || 'N/A')}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Department</label>
          <p className="text-gray-900">{empInfo.department || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Sub-Department</label>
          <p className="text-gray-900">{empInfo.subDepartment || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Cost Center</label>
          <p className="text-gray-900">{empInfo.costCenter || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Designation</label>
          <p className="text-gray-900">{empInfo.designation || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Grade</label>
          <p className="text-gray-900">{empInfo.grade || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Level</label>
          <p className="text-gray-900">{empInfo.level || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Location</label>
          <p className="text-gray-900">{empInfo.location || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Workplace Type</label>
          <p className="text-gray-900">{empInfo.workplaceType || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Email</label>
          <p className="text-gray-900">{empInfo.workEmail || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Extension Number</label>
          <p className="text-gray-900">{empInfo.extensionNumber || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Desk Location</label>
          <p className="text-gray-900">{empInfo.deskLocation || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Employee Category</label>
          <p className="text-gray-900">{empInfo.employeeCategory || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Notice Period (days)</label>
          <p className="text-gray-900">{empInfo.noticePeriod || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Direct Reporting Manager</label>
          <p className="text-gray-900">{empInfo.reportingManager?.direct || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">Functional Reporting Manager</label>
          <p className="text-gray-900">{empInfo.reportingManager?.functional || 'N/A'}</p>
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1 font-bold text-sm font-semibold">HR Business Partner</label>
          <p className="text-gray-900">{empInfo.hrBusinessPartner || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default EmploymentInfoTab;
