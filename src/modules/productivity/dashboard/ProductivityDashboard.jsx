import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineBolt,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineCalendarDays,
  HiOutlineSparkles,
  HiOutlineEllipsisHorizontal,
  HiOutlineFire,
} from 'react-icons/hi2';
 
const StatCard = ({ title, value, change, changeType, icon: Icon, color, sub }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    rose: 'bg-rose-50 text-rose-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          {changeType === 'up' ? (
            <HiOutlineArrowTrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <HiOutlineArrowTrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-xs font-semibold ${changeType === 'up' ? 'text-green-600' : 'text-red-500'}`}>
            {change}
          </span>
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
};
 
const departments = [
  { name: 'Engineering', score: 87, tasks: 142, completed: 124, trend: '+5%' },
  { name: 'Marketing', score: 74, tasks: 89, completed: 66, trend: '+2%' },
  { name: 'Sales', score: 91, tasks: 203, completed: 185, trend: '+8%' },
  { name: 'HR & Admin', score: 68, tasks: 56, completed: 38, trend: '-3%' },
  { name: 'Finance', score: 82, tasks: 77, completed: 63, trend: '+1%' },
];
 
const topEmployees = [
  { name: 'Arjun Sharma', role: 'Senior Developer', score: 96, tasks: 28, avatar: 'AS', color: 'bg-blue-500' },
  { name: 'Priya Nair', role: 'Sales Lead', score: 94, tasks: 35, avatar: 'PN', color: 'bg-purple-500' },
  { name: 'Rahul Mehta', role: 'Marketing Mgr', score: 91, tasks: 22, avatar: 'RM', color: 'bg-green-500' },
  { name: 'Divya Reddy', role: 'Finance Analyst', score: 89, tasks: 19, avatar: 'DR', color: 'bg-orange-500' },
  { name: 'Kiran Patel', role: 'HR Executive', score: 87, tasks: 31, avatar: 'KP', color: 'bg-rose-500' },
];
 
const recentActivities = [
  { user: 'Arjun Sharma', action: 'completed Sprint 14 tasks', time: '10 min ago', type: 'success' },
  { user: 'Priya Nair', action: 'submitted weekly report', time: '1 hr ago', type: 'info' },
  { user: 'Sales Team', action: 'missed daily standup', time: '2 hrs ago', type: 'warning' },
  { user: 'Rahul Mehta', action: 'achieved 100% OKR for Q2', time: '3 hrs ago', type: 'success' },
  { user: 'HR Team', action: 'pending 3 task reviews', time: '5 hrs ago', type: 'warning' },
];
 
const ProductivityDashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
 
  const periods = ['This Week', 'This Month', 'This Quarter', 'This Year'];
 
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineBolt className="text-yellow-500 w-6 h-6" />
            Productivity Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track team performance, tasks, and goals</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedPeriod === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/productivity/reports')}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <HiOutlineChartBarSquare className="w-4 h-4" />
            Full Report
          </button>
        </div>
      </div>
 
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Overall Score" value="82%" change="+4.2%" changeType="up" icon={HiOutlineSparkles} color="blue" sub="Company avg" />
        <StatCard title="Tasks Completed" value="567" change="+12%" changeType="up" icon={HiOutlineCheckCircle} color="green" sub="Of 689 assigned" />
        <StatCard title="Avg Hours/Day" value="7.4h" change="-0.2h" changeType="down" icon={HiOutlineClock} color="orange" sub="Target: 8h" />
        <StatCard title="Active Employees" value="184" icon={HiOutlineUserGroup} color="purple" sub="of 201 total" />
        <StatCard title="Overdue Tasks" value="22" change="-8" changeType="up" icon={HiOutlineExclamationCircle} color="rose" sub="vs 30 last month" />
        <StatCard title="OKRs On Track" value="71%" change="+6%" changeType="up" icon={HiOutlineFire} color="indigo" sub="Q2 Goals" />
      </div>
 
      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Scores */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Department Productivity</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <HiOutlineEllipsisHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.name} className="flex items-center gap-4">
                <span className="w-28 text-sm text-gray-700 font-medium truncate">{dept.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${
                      dept.score >= 85 ? 'bg-green-500' : dept.score >= 70 ? 'bg-blue-500' : 'bg-orange-400'
                    }`}
                    style={{ width: `${dept.score}%` }}
                  />
                </div>
                <span className="w-10 text-sm font-bold text-gray-800 text-right">{dept.score}%</span>
                <span className="w-16 text-xs text-center">
                  <span className="text-gray-500">{dept.completed}/</span>
                  <span className="text-gray-400">{dept.tasks}</span>
                </span>
                <span className={`w-12 text-xs font-semibold text-right ${dept.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                  {dept.trend}
                </span>
              </div>
            ))}
          </div>
        </div>
 
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
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
 
      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Top Performers</h2>
            <button
              onClick={() => navigate('/productivity/employee-insights')}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {topEmployees.map((emp, i) => (
              <div key={emp.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <div className={`w-8 h-8 rounded-full ${emp.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {emp.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{emp.name}</p>
                  <p className="text-xs text-gray-400">{emp.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{emp.score}%</p>
                  <p className="text-xs text-gray-400">{emp.tasks} tasks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  act.type === 'success' ? 'bg-green-500' : act.type === 'warning' ? 'bg-orange-400' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{act.user}</span> {act.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ProductivityDashboard;
 
 