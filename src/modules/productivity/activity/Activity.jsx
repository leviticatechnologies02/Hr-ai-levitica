import React, { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineComputerDesktop,
  HiOutlineCpuChip,
  HiOutlineExclamationTriangle,
  HiOutlineUsers,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
} from 'react-icons/hi2';
import StatCard from '../../../shared/components/StatCard';
import { getAdminMonitoring } from '../services/activityApi';

const Activity = () => {
  const [page, setPage] = useState(1);
  const [employeeId, setEmployeeId] = useState('');
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const limit = 15;

  const loadPage = useCallback((targetPage, replace) => {
    const setLoading = replace ? setIsLoading : setIsLoadingMore;
    setLoading(true);
    setError(null);
    getAdminMonitoring(targetPage, limit, employeeId || null)
      .then((data) => {
        setItems((prev) => (replace ? data.items || [] : [...prev, ...(data.items || [])]));
        setHasMore(Boolean(data.hasMore));
      })
      .catch((err) => {
        console.error('Failed to load monitoring data:', err);
        setError(err.message || 'Failed to load monitoring data');
      })
      .finally(() => setLoading(false));
  }, [employeeId]);

  useEffect(() => {
    setPage(1);
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage, false);
  };

  const stats = {
    totalEmployees: items.length,
    totalApps: items.reduce((acc, emp) => acc + (emp.apps?.length || 0), 0),
    activeApps: items.reduce(
      (acc, emp) => acc + (emp.apps?.filter((a) => a.is_running).length || 0),
      0
    ),
    violations: items.reduce(
      (acc, emp) => acc + (emp.activities?.filter((a) => a.activity_type === 'violation').length || 0),
      0
    ),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineComputerDesktop className="text-blue-600 w-6 h-6" />
            Activity Monitoring
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time tracking of employee activities and applications
          </p>
        </div>
        <input
          type="number"
          placeholder="Filter by Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Employees" value={stats.totalEmployees} subtitle="Tracked today" icon="mdi:account-group-outline" color="blue" />
        <StatCard title="Active Apps" value={stats.activeApps} subtitle="Currently running" icon="mdi:monitor" color="green" />
        <StatCard title="Total Apps" value={stats.totalApps} subtitle="Sessions today" icon="mdi:cpu-64-bit" color="purple" />
        <StatCard title="Violations" value={stats.violations} subtitle="Flagged activities" icon="mdi:alert-circle-outline" color="yellow" />
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading monitoring data…</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-400 text-center">
          No monitoring data available
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((employee) => {
            const isExpanded = expandedId === employee.employee_id;
            const appCount = employee.apps?.length || 0;
            const activeCount = employee.apps?.filter((a) => a.is_running).length || 0;
            const activityCount = employee.activities?.length || 0;

            return (
              <div key={employee.employee_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : employee.employee_id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <div className="font-semibold text-gray-900">{employee.name}</div>
                    <div className="text-xs text-gray-500">{employee.email || `Employee #${employee.employee_id}`}</div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{appCount} apps</div>
                      <div className="text-xs text-gray-500">{activeCount} active</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{activityCount} activities</div>
                    </div>
                    {isExpanded ? (
                      <HiOutlineChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <HiOutlineChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-5">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <HiOutlineCpuChip className="w-4 h-4" /> Applications
                      </h4>
                      {appCount === 0 ? (
                        <div className="text-sm text-gray-400">No application sessions</div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {employee.apps.slice(0, 6).map((app) => (
                            <div key={app.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm text-gray-900 truncate">{app.app_name}</span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    app.is_running ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {app.is_running ? 'Running' : 'Closed'}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>CPU {app.cpu_usage ?? 0}%</span>
                                <span>Mem {app.memory_usage ?? 0}MB</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <HiOutlineExclamationTriangle className="w-4 h-4" /> Recent Activities
                      </h4>
                      {activityCount === 0 ? (
                        <div className="text-sm text-gray-400">No recent activities</div>
                      ) : (
                        <div className="space-y-2">
                          {employee.activities.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg text-sm">
                              <div>
                                <span className="font-medium text-gray-900">{activity.activity_type}</span>
                                {activity.description && (
                                  <span className="text-gray-500 ml-2">{activity.description}</span>
                                )}
                              </div>
                              {activity.duration_seconds != null && (
                                <span className="text-gray-500">
                                  {Math.floor(activity.duration_seconds / 60)}m
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {hasMore && (
            <div className="text-center pt-2">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isLoadingMore ? 'Loading…' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Activity;