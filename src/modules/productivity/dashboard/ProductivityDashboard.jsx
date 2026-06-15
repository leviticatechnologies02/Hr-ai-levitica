import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineBolt,
  HiOutlineCheckCircle,
  HiOutlineCalendarDays,
  HiOutlineSparkles,
  HiOutlineFire,
} from 'react-icons/hi2';
import StatCard from '../../../shared/components/StatCard';
import {
  getProductivitySummary,
  getEmployeeProductivity,
} from '../services/productivityApi';

const ProductivityDashboard = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  const [employeeId, setEmployeeId] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [isFetchingEmployee, setIsFetchingEmployee] = useState(false);
  const [employeeError, setEmployeeError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getProductivitySummary()
      .then((data) => {
        if (isMounted) setSummary(data);
      })
      .catch((err) => {
        console.error('Failed to load productivity summary:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingSummary(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFetchEmployee = () => {
    if (!employeeId) return;
    setIsFetchingEmployee(true);
    setEmployeeError(null);
    getEmployeeProductivity(employeeId)
      .then((data) => setEmployeeData(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Failed to load employee productivity:', err);
        setEmployeeError(err.message || 'Failed to load data');
        setEmployeeData([]);
      })
      .finally(() => setIsFetchingEmployee(false));
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineBolt className="text-yellow-500 w-6 h-6" />
            Productivity Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track team performance, tasks, and goals
          </p>
        </div>
        <button
          onClick={() => navigate('/productivity/reports')}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <HiOutlineChartBarSquare className="w-4 h-4" />
          Full Report
        </button>
      </div>

      {/* Summary Cards */}
      {isLoadingSummary ? (
        <div className="text-sm text-gray-500">Loading summary…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Overall Score"
            value={summary?.overall_score?.toFixed(2) ?? '—'}
            subtitle="Company average"
            icon="mdi:star-outline"
            color="blue"
          />
          <StatCard
            title="Average Hours"
            value={summary?.average_hours?.toFixed(2) ?? '—'}
            subtitle="Per employee"
            icon="mdi:clock-outline"
            color="green"
          />
          <StatCard
            title="Tasks Completed"
            value={summary?.tasks_completed ?? '—'}
            subtitle="Across organization"
            icon="mdi:checkbox-marked-circle-outline"
            color="purple"
          />
        </div>
      )}

      {/* Employee Productivity Lookup */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Employee Productivity
          </h2>

          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Employee ID"
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-32 sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <button
              onClick={handleFetchEmployee}
              disabled={!employeeId || isFetchingEmployee}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isFetchingEmployee ? 'Loading…' : 'Get Data'}
            </button>
          </div>
        </div>

        {employeeError && (
          <div className="text-sm text-red-500 mb-3">{employeeError}</div>
        )}

        {isFetchingEmployee ? (
          <div className="text-sm text-gray-500">Loading data…</div>
        ) : employeeData.length === 0 ? (
          <div className="text-sm text-gray-400">No data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 font-medium">Date</th>
                  <th className="font-medium">Score</th>
                  <th className="font-medium">Created At</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 text-gray-800">{formatDate(record.date)}</td>
                    <td className="text-gray-800">{record.score ?? '-'}</td>
                    <td className="text-gray-800">{formatDate(record.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Goals & OKRs', icon: HiOutlineFire, path: '/productivity/goals', color: 'text-orange-600 bg-orange-50' },
            { label: 'Task Tracker', icon: HiOutlineClipboardDocumentList, path: '/productivity/tasks', color: 'text-blue-600 bg-blue-50' },
            { label: 'Time Logs', icon: HiOutlineClock, path: '/productivity/time-tracking', color: 'text-green-600 bg-green-50' },
            { label: 'Team Insights', icon: HiOutlineUserGroup, path: '/productivity/employee-insights', color: 'text-purple-600 bg-purple-50' },
            { label: 'Reports', icon: HiOutlineChartBarSquare, path: '/productivity/reports', color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Meetings', icon: HiOutlineCalendarDays, path: '/productivity/meetings', color: 'text-rose-600 bg-rose-50' },
          ].map(({ label, icon: Icon, path, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all text-center"
            >
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-700 leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductivityDashboard;