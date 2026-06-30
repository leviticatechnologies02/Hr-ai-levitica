import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const ViewModal = ({ isOpen, onClose, employee, formatDate, getStatusBadge, getRiskBadge, mode = 'probation' }) => {
  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Employee Details - ${employee.name}`} size="lg">
      <div className="space-y-6 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon="heroicons:user" className="w-4 h-4 text-blue-500" />
              {mode === 'transfer' ? 'Employee Information' : 'Personal Information'}
            </h6>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Employee ID:</span>
                <span className="font-medium text-slate-800">{employee.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-medium text-slate-800">{employee.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Designation:</span>
                <span className="font-medium text-slate-800">{employee.designation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-medium text-slate-800">{employee.department || employee.currentDepartment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-800">{employee.workLocation || employee.currentLocation}</span>
              </div>
              {(employee.email || mode === 'probation') && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-medium text-slate-800">{employee.email}</span>
                </div>
              )}
              {(employee.phone || mode === 'probation') && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-medium text-slate-800">{employee.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon="heroicons:document-text" className="w-4 h-4 text-emerald-500" />
              {mode === 'transfer' ? 'Transfer Details' : 'Probation Details'}
            </h6>
            <div className="space-y-2 text-sm">
              {mode === 'transfer' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Request Type:</span>
                    <span className="font-medium text-slate-800">{employee.requestType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">From Department:</span>
                    <span className="font-medium text-slate-800">{employee.currentDepartment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">To Department:</span>
                    <span className="font-medium text-slate-800 text-blue-600">{employee.newDepartment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">From Location:</span>
                    <span className="font-medium text-slate-800">{employee.currentLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">To Location:</span>
                    <span className="font-medium text-slate-800 text-blue-600">{employee.newLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transfer Date:</span>
                    <span className="font-medium text-slate-800">{formatDate ? formatDate(employee.transferDate) : new Date(employee.transferDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Effective Date:</span>
                    <span className="font-medium text-slate-800 text-emerald-600">{formatDate ? formatDate(employee.effectiveDate) : new Date(employee.effectiveDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span>{getStatusBadge ? getStatusBadge(employee.status) : <span className="text-blue-600 font-medium">{employee.status}</span>}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Joining Date:</span>
                    <span className="font-medium text-slate-800">{formatDate ? formatDate(employee.joiningDate) : employee.joiningDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Probation End:</span>
                    <span className="font-medium text-slate-800">{formatDate ? formatDate(employee.probationEndDate) : employee.probationEndDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Days Remaining:</span>
                    <span className={`font-medium ${employee.daysRemaining <= 0 ? 'text-rose-600' : employee.daysRemaining <= 7 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {employee.daysRemaining <= 0 ? Math.abs(employee.daysRemaining) + ' days overdue' : employee.daysRemaining + ' days'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span>{getStatusBadge ? getStatusBadge(employee.status) : employee.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Risk Level:</span>
                    <span>{getRiskBadge ? getRiskBadge(employee.riskLevel) : employee.riskLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Salary:</span>
                    <span className="font-medium text-slate-800">{employee.salary}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {mode === 'transfer' && employee.reason && (
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
             <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon="heroicons:chat-bubble-bottom-center-text" className="w-4 h-4 text-purple-500" />
              Transfer Reason & Notes
            </h6>
            <div className="text-sm text-slate-700 space-y-2">
              <p><strong>Reason:</strong> {employee.reason}</p>
              {employee.notes && <p><strong>Notes:</strong> {employee.notes}</p>}
            </div>
          </div>
        )}

        {mode !== 'transfer' && (
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon="heroicons:chart-bar" className="w-4 h-4 text-purple-500" />
              Performance Overview
            </h6>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Performance Score</p>
                <p className="text-xl font-bold text-blue-600">{employee.performanceScore || 'N/A'}</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Engagement Score</p>
                <p className="text-xl font-bold text-emerald-600">{employee.engagementScore || 'N/A'}</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Current Rating</p>
                <p className="text-xl font-bold text-amber-600">{employee.currentRating || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {mode !== 'transfer' && employee.skills && employee.skills.length > 0 && (
          <div className="border border-slate-200 rounded-xl p-4">
            <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2 mb-2">
              <Icon icon="heroicons:sparkles" className="w-4 h-4 text-amber-500" />
              Skills
            </h6>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {mode !== 'transfer' && employee.probationReviews && employee.probationReviews.length > 0 && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <h6 className="font-bold text-sm text-slate-700 flex items-center gap-2">
                <Icon icon="heroicons:document-text" className="w-4 h-4 text-blue-500" />
                Review History
              </h6>
            </div>
            <div className="p-4 space-y-3">
              {employee.probationReviews.map((review, index) => (
                <div key={index} className="border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-800">
                      {review.type === '30_day' ? '30 Day' :
                       review.type === '60_day' ? '60 Day' :
                       '90 Day'} Review
                    </span>
                    <span className="text-xs text-slate-500">{formatDate(review.date)}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Manager Assessment</p>
                      <p className="text-slate-700">{review.managerAssessment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Rating</p>
                      <p className="font-medium text-emerald-600">{review.rating}</p>
                    </div>
                  </div>
                  {review.actionItems && review.actionItems.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500">Action Items</p>
                      <ul className="list-disc list-inside text-sm text-slate-600">
                        {review.actionItems.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewModal;