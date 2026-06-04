import React, { useState } from 'react';
import {
  HiOutlineUserGroup,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineFire,
  HiOutlineChartBar,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2';
 
const employees = [
  { id: 1, name: 'Arjun Sharma', dept: 'Engineering', role: 'Senior Developer', score: 96, tasks: 28, completed: 27, avgHours: 8.2, streak: 14, trend: '+5%', status: 'excellent', avatar: 'AS', color: 'bg-blue-500' },
  { id: 2, name: 'Priya Nair', dept: 'Sales', role: 'Sales Lead', score: 94, tasks: 35, completed: 33, avgHours: 9.1, streak: 10, trend: '+8%', status: 'excellent', avatar: 'PN', color: 'bg-purple-500' },
  { id: 3, name: 'Rahul Mehta', dept: 'Marketing', role: 'Marketing Manager', score: 82, tasks: 22, completed: 18, avgHours: 7.6, streak: 5, trend: '+2%', status: 'good', avatar: 'RM', color: 'bg-green-500' },
  { id: 4, name: 'Divya Reddy', dept: 'Finance', role: 'Finance Analyst', score: 79, tasks: 19, completed: 15, avgHours: 7.9, streak: 3, trend: '-2%', status: 'good', avatar: 'DR', color: 'bg-orange-500' },
  { id: 5, name: 'Kiran Patel', dept: 'HR & Admin', role: 'HR Executive', score: 71, tasks: 31, completed: 22, avgHours: 7.1, streak: 2, trend: '-5%', status: 'needs-improvement', avatar: 'KP', color: 'bg-rose-500' },
  { id: 6, name: 'Sneha Joshi', dept: 'Engineering', role: 'Frontend Developer', score: 88, tasks: 25, completed: 22, avgHours: 8.0, streak: 7, trend: '+3%', status: 'good', avatar: 'SJ', color: 'bg-teal-500' },
  { id: 7, name: 'Amit Kulkarni', dept: 'Sales', role: 'Sales Executive', score: 65, tasks: 40, completed: 26, avgHours: 6.5, streak: 1, trend: '-8%', status: 'needs-improvement', avatar: 'AK', color: 'bg-yellow-500' },
  { id: 8, name: 'Pooja Singh', dept: 'Finance', role: 'Senior Accountant', score: 85, tasks: 17, completed: 14, avgHours: 8.3, streak: 9, trend: '+4%', status: 'good', avatar: 'PS', color: 'bg-indigo-500' },
];
 
const statusConfig = {
  excellent: { label: 'Excellent', color: 'bg-green-100 text-green-700' },
  good: { label: 'Good', color: 'bg-blue-100 text-blue-700' },
  'needs-improvement': { label: 'Needs Improvement', color: 'bg-red-100 text-red-600' },
};
 
const EmployeeInsights = () => {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [sortBy, setSortBy] = useState('score');
 
  const depts = ['All', ...new Set(employees.map(e => e.dept))];
  const statuses = ['All', 'excellent', 'good', 'needs-improvement'];
 
  const filtered = employees
    .filter(e =>
      (filterDept === 'All' || e.dept === filterDept) &&
      (filterStatus === 'All' || e.status === filterStatus) &&
      (search === '' || e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => b[sortBy] - a[sortBy]);
 
  const avgScore = Math.round(employees.reduce((s, e) => s + e.score, 0) / employees.length);
 
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineUserGroup className="text-purple-500 w-6 h-6" />
            Employee Insights
          </h1>
          <p className="text-sm text-gray-500 mt-1">Individual productivity scores and performance breakdown</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-2 text-center">
            <p className="text-xl font-bold text-gray-900">{avgScore}%</p>
            <p className="text-xs text-gray-400">Team Average</p>
          </div>
        </div>
      </div>
 
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Excellent', count: employees.filter(e => e.status === 'excellent').length, icon: HiOutlineFire, color: 'text-green-600 bg-green-50' },
          { label: 'Good', count: employees.filter(e => e.status === 'good').length, icon: HiOutlineCheckCircle, color: 'text-blue-600 bg-blue-50' },
          { label: 'Needs Improvement', count: employees.filter(e => e.status === 'needs-improvement').length, icon: HiOutlineExclamationCircle, color: 'text-red-600 bg-red-50' },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${color}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
 
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-700">
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-700">
          {statuses.map(s => <option key={s}>{s === 'All' ? 'All Status' : statusConfig[s]?.label}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-700 ml-auto">
          <option value="score">Sort: Score</option>
          <option value="tasks">Sort: Tasks</option>
          <option value="avgHours">Sort: Avg Hours</option>
          <option value="streak">Sort: Streak</option>
        </select>
      </div>
 
      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(emp => {
          const sc = statusConfig[emp.status];
          const completionRate = Math.round((emp.completed / emp.tasks) * 100);
          return (
            <div
              key={emp.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedEmp(selectedEmp?.id === emp.id ? null : emp)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${emp.color} text-white font-bold flex items-center justify-center text-sm`}>
                    {emp.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{emp.name}</p>
                    <p className="text-xs text-gray-400">{emp.role}</p>
                    <p className="text-xs text-gray-400">{emp.dept}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{emp.score}%</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    {emp.trend.startsWith('+') ? (
                      <HiOutlineArrowTrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <HiOutlineArrowTrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs font-semibold ${emp.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{emp.trend}</span>
                  </div>
                </div>
              </div>
 
              {/* Score Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Productivity Score</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sc.color}`}>{sc.label}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${emp.score >= 90 ? 'bg-green-500' : emp.score >= 75 ? 'bg-blue-500' : 'bg-orange-400'}`}
                    style={{ width: `${emp.score}%` }}
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold text-gray-900">{completionRate}%</p>
                  <p className="text-xs text-gray-400">Task Rate</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{emp.avgHours}h</p>
                  <p className="text-xs text-gray-400">Avg/Day</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{emp.streak}d</p>
                  <p className="text-xs text-gray-400">Streak 🔥</p>
                </div>
              </div>
 
              {/* Expanded Detail */}
              {selectedEmp?.id === emp.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    {[
                      { label: 'Tasks Completed', value: `${emp.completed} / ${emp.tasks}`, icon: HiOutlineCheckCircle },
                      { label: 'Daily Avg Hours', value: `${emp.avgHours}h`, icon: HiOutlineClock },
                      { label: 'Work Streak', value: `${emp.streak} days`, icon: HiOutlineFire },
                      { label: 'Performance', value: sc.label, icon: HiOutlineChartBar },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
 
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <HiOutlineUserGroup className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No employees match your filters</p>
        </div>
      )}
    </div>
  );
};
 
export default EmployeeInsights;
 
 