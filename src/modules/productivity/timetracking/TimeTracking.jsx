import React, { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineClock,
  HiOutlineCalendarDays,
} from 'react-icons/hi2';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import StatCard from '../../../shared/components/StatCard';
import { getTimeTrackingOverview, getTimeEntries } from '../services/timeTrackingApi';

const statusStyles = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
};

const TimeTracking = () => {
  const [period, setPeriod] = useState('today');
  const [overview, setOverview] = useState(null);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([getTimeTrackingOverview(period), getTimeEntries(period)])
      .then(([overviewData, entriesData]) => {
        setOverview(overviewData);
        setEntries(Array.isArray(entriesData) ? entriesData : []);
      })
      .catch((err) => {
        console.error('Failed to load time tracking data:', err);
        setError(err.message || 'Failed to load time tracking data');
      })
      .finally(() => setIsLoading(false));
  }, [period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = overview?.stats ?? {
    totalHours: 0,
    averageDaily: 0,
    productivity: 0,
    overtime: 0,
  };
  const currentSession = overview?.current_session ?? overview?.currentSession;

  const chartData = entries.map((e) => ({
    date: e.date,
    hours: e.hours ?? 0,
    productivity: e.productivity ?? 0,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineClock className="text-blue-600 w-6 h-6" />
            Time Tracking
          </h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and manage employee work hours</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading time tracking…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Hours" value={`${stats.totalHours}h`} subtitle="This period" icon="mdi:clock-outline" color="blue" />
            <StatCard title="Daily Average" value={`${stats.averageDaily}h`} subtitle="Per day" icon="mdi:calendar-outline" color="green" />
            <StatCard title="Productivity" value={`${stats.productivity}%`} subtitle="Score" icon="mdi:star-outline" color="purple" />
            <StatCard title="Overtime" value={`${stats.overtime}h`} subtitle="Extra hours" icon="mdi:alarm" color="orange" />
          </div>

          {currentSession && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-1">Current Session</h3>
              <p className="text-sm text-gray-700">
                {currentSession.employee} — {currentSession.project}
              </p>
              <p className="text-xs text-gray-500">Started at {currentSession.startTime}</p>
              <div className="text-2xl font-bold text-blue-600 mt-2">
                {currentSession.duration}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Daily Hours</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hours" strokeWidth={2} stroke="#2563eb" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Productivity Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="productivity" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Time Entries</h3>
            {entries.length === 0 ? (
              <div className="text-sm text-gray-400 py-6 text-center">No time entries found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="py-2 font-medium">Employee</th>
                      <th className="font-medium">Task</th>
                      <th className="font-medium">Date</th>
                      <th className="font-medium">Time</th>
                      <th className="font-medium">Duration</th>
                      <th className="font-medium">Productivity</th>
                      <th className="font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => (
                      <tr key={e.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="py-2 font-medium text-gray-900">{e.employee}</td>
                        <td className="text-gray-700">{e.task}</td>
                        <td className="text-gray-700">{e.date}</td>
                        <td className="text-gray-700">{e.startTime} – {e.endTime}</td>
                        <td className="text-gray-700">{e.duration}</td>
                        <td className="text-gray-700">{e.productivity}%</td>
                        <td>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[e.status] || 'bg-gray-100 text-gray-700'}`}>
                            {e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TimeTracking;