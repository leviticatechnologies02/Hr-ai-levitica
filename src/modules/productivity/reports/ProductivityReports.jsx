import React, { useState } from 'react';
import {
  HiOutlineChartBarSquare,
  HiOutlineArrowDownTray,
  HiOutlineCalendarDays,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';
 
const weeklyData = [
  { week: 'W1 May', score: 74, tasks: 89, hours: 37.2 },
  { week: 'W2 May', score: 78, tasks: 94, hours: 38.5 },
  { week: 'W3 May', score: 81, tasks: 102, hours: 39.1 },
  { week: 'W4 May', score: 79, tasks: 97, hours: 38.0 },
  { week: 'W1 Jun', score: 83, tasks: 110, hours: 40.2 },
  { week: 'W2 Jun', score: 82, tasks: 108, hours: 39.8 },
];
 
const deptData = [
  { dept: 'Engineering', score: 87, taskRate: 87, avgHours: 8.2, headcount: 42 },
  { dept: 'Sales', score: 91, taskRate: 91, avgHours: 9.0, headcount: 35 },
  { dept: 'Marketing', score: 74, taskRate: 74, avgHours: 7.5, headcount: 18 },
  { dept: 'Finance', score: 82, taskRate: 82, avgHours: 8.0, headcount: 12 },
  { dept: 'HR & Admin', score: 68, taskRate: 68, avgHours: 7.1, headcount: 8 },
  { dept: 'Product', score: 85, taskRate: 85, avgHours: 8.4, headcount: 20 },
];
 
const monthlyHighlights = [
  { metric: 'Highest Productivity Dept', value: 'Sales — 91%', type: 'success' },
  { metric: 'Most Improved Employee', value: 'Priya Nair (+12%)', type: 'success' },
  { metric: 'Overdue Task Reduction', value: '-27% vs last month', type: 'success' },
  { metric: 'Dept Needing Attention', value: 'HR & Admin (68%)', type: 'warning' },
  { metric: 'Avg Daily Hours', value: '7.9h (Target: 8h)', type: 'info' },
  { metric: 'OKR Completion Rate', value: '71% on track', type: 'info' },
];
 
const ProductivityReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('This Month');
 
  const maxScore = Math.max(...weeklyData.map(d => d.score));
  const maxTasks = Math.max(...weeklyData.map(d => d.tasks));
 
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineChartBarSquare className="text-indigo-500 w-6 h-6" />
            Productivity Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">Aggregated productivity analytics and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-700">
            {['This Week', 'This Month', 'This Quarter', 'This Year'].map(p => <option key={p}>{p}</option>)}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            <HiOutlineArrowDownTray className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
 
      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Productivity', value: '82%', change: '+4.2%', icon: HiOutlineArrowTrendingUp, color: 'bg-blue-50 text-blue-600' },
          { label: 'Task Completion', value: '82.3%', change: '+3.1%', icon: HiOutlineCheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Avg Daily Hours', value: '7.9h', change: '-0.1h', icon: HiOutlineClock, color: 'bg-orange-50 text-orange-600' },
          { label: 'Active Employees', value: '184', change: '+6', icon: HiOutlineUserGroup, color: 'bg-purple-50 text-purple-600' },
        ].map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">{label}</span>
              <div className={`p-1.5 rounded-lg ${color}`}><Icon className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-xs font-semibold mt-0.5 ${change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{change} vs prev period</p>
          </div>
        ))}
      </div>
 
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {['overview', 'by-department', 'trends'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium rounded-md capitalize transition-all ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>
 
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Highlights */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HiOutlineCalendarDays className="w-4 h-4 text-blue-500" />
              Monthly Highlights
            </h2>
            <div className="space-y-3">
              {monthlyHighlights.map(({ metric, value, type }) => (
                <div key={metric} className="flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-600">{metric}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    type === 'success' ? 'bg-green-100 text-green-700' :
                    type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
 
          {/* Weekly Trend Bar Chart (CSS only) */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Weekly Score Trend</h2>
            <div className="flex items-end gap-2 h-40">
              {weeklyData.map(d => (
                <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-blue-600">{d.score}%</span>
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                    style={{ height: `${(d.score / maxScore) * 100}%` }}
                  />
                  <span className="text-xs text-gray-400 text-center leading-tight">{d.week}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
 
      {/* Department Tab */}
      {activeTab === 'by-department' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Headcount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Productivity</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Task Completion</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Avg Hours/Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deptData.sort((a, b) => b.score - a.score).map(dept => (
                <tr key={dept.dept} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-gray-800">{dept.dept}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{dept.headcount}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${dept.score >= 85 ? 'bg-green-500' : dept.score >= 75 ? 'bg-blue-500' : 'bg-orange-400'}`}
                          style={{ width: `${dept.score}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-900">{dept.score}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full bg-purple-500" style={{ width: `${dept.taskRate}%` }} />
                      </div>
                      <span className="font-bold text-gray-900">{dept.taskRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-semibold ${dept.avgHours >= 8 ? 'text-green-600' : dept.avgHours >= 7 ? 'text-blue-600' : 'text-orange-500'}`}>
                      {dept.avgHours}h
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
 
      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Tasks Completed per Week</h2>
            <div className="flex items-end gap-2 h-40">
              {weeklyData.map(d => (
                <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-purple-600">{d.tasks}</span>
                  <div
                    className="w-full bg-purple-400 rounded-t-md hover:bg-purple-500 transition-colors"
                    style={{ height: `${(d.tasks / maxTasks) * 100}%` }}
                  />
                  <span className="text-xs text-gray-400 text-center leading-tight">{d.week}</span>
                </div>
              ))}
            </div>
          </div>
 
          {/* Hours Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Total Team Hours per Week</h2>
            <div className="flex items-end gap-2 h-40">
              {weeklyData.map(d => {
                const maxHours = Math.max(...weeklyData.map(x => x.hours));
                return (
                  <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-green-600">{d.hours}h</span>
                    <div
                      className="w-full bg-green-400 rounded-t-md hover:bg-green-500 transition-colors"
                      style={{ height: `${(d.hours / maxHours) * 100}%` }}
                    />
                    <span className="text-xs text-gray-400 text-center leading-tight">{d.week}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ProductivityReports;
 
 