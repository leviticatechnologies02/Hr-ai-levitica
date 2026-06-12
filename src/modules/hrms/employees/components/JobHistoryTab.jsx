import React from 'react';
import { Icon } from '@iconify/react';

const JobHistoryTab = ({ employee, formatDate, formatCurrency }) => {
  const jobHistory = employee.jobHistory || [];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <h6 className="font-bold text-lg mb-3 border-b pb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Icon icon="heroicons:clock" />
            </span>
            Complete Job History
          </h6>
        </div>
        <div className="col-span-1 md:col-span-2">
          {jobHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border table-hover">
                <thead className="bg-gray-50">
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Type</th>
                    <th>Organisation</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Location</th>
                    <th>Manager</th>
                    <th>Salary</th>
                    <th>Duration</th>
                    <th>Notes</th>
                    <th>Achievements</th>
                  </tr>
                </thead>
                <tbody>
                  {jobHistory.sort((a, b) => new Date(b.date) - new Date(a.date)).map((history, idx) => {
                    // Calculate duration if endDate exists
                    const startDate = new Date(history.date);
                    const endDate = history.endDate === 'Present' ? new Date() : new Date(history.endDate || new Date());
                    const durationInMonths = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));

                    // Format duration
                    const years = Math.floor(durationInMonths / 12);
                    const months = durationInMonths % 12;
                    const durationText = years > 0 ?
                      `${years} yr ${months > 0 ? `${months} mo` : ''}` :
                      `${months} mo`;

                    return (
                      <tr key={idx}>
                        <td>{formatDate(history.date)}</td>
                        <td>
                          {history.endDate === 'Present' ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Present</span>
                          ) : history.endDate ? (
                            formatDate(history.endDate)
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          <span className={`badge ${history.type === 'Promotion' ? 'bg-success' :
                            history.type === 'Transfer' ? 'bg-info' :
                              history.type === 'Joining' ? 'bg-primary' :
                                history.type === 'Previous Experience' ? 'bg-warning' :
                                  history.type === 'Salary Revision' ? 'bg-secondary' :
                                    'bg-secondary'
                            }`}>
                            {history.type}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span>{history.organisation || 'N/A'}</span>
                            {history.organisation === 'TechCorp Inc.' && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800-subtle text-blue-600 border border-primary">
                                Current
                              </span>
                            )}
                          </div>
                        </td>
                        <td>{history.department || '-'}</td>
                        <td>
                          <strong>{history.designation || '-'}</strong>
                        </td>
                        <td>{history.location || '-'}</td>
                        <td>{history.manager || '-'}</td>
                        <td>
                          {history.salaryChange ? (
                            <div className="flex flex-column">
                              <span className="text-blue-600 font-semibold">
                                {formatCurrency(history.salaryChange)}
                              </span>
                              {history.type === 'Promotion' && (
                                <text-sm className="text-success">
                                  <Icon icon="heroicons:argrid grid-cols-1 md:grid-cols-2 gap-6-trending-up" className="mr-1" />
                                  Increased
                                </text-sm>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                        <td>
                          <div className="flex flex-column items-center">
                            <span className="fw-medium">{durationText}</span>
                            {history.endDate === 'Present' && (
                              <text-sm className="text-gray-500">Ongoing</text-sm>
                            )}
                          </div>
                        </td>
                        <td>
                          <text-sm className="text-gray-500">{history.notes || '-'}</text-sm>
                          {history.reasonForLeaving && history.reasonForLeaving !== 'N/A' && (
                            <div className="mt-1">
                              <text-sm className="text-red-600">
                                <Icon icon="heroicons:argrid grid-cols-1 md:grid-cols-2 gap-6-right-on-rectangle" className="mr-1" />
                                Reason: {history.reasonForLeaving}
                              </text-sm>
                            </div>
                          )}
                        </td>
                        <td>
                          {history.achievements ? (
                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={history.achievements}>
                              <text-sm>{history.achievements}</text-sm>
                            </div>
                          ) : (
                            <text-sm className="text-gray-500">-</text-sm>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info flex items-center gap-2">
              <Icon icon="heroicons:information-circle" />
              <span>No job history records found</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobHistoryTab;
