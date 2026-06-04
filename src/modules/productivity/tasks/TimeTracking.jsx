import React, { useState, useEffect, useRef } from 'react';
import {
  HiOutlineClock,
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineStop,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from 'react-icons/hi2';
 
const initialLogs = [
  { id: 1, date: '2025-06-04', project: 'Payroll Module', task: 'Review salary structure logic', hours: 2.5, employee: 'Divya Reddy' },
  { id: 2, date: '2025-06-04', project: 'Auth System', task: 'Fix JWT refresh token bug', hours: 3.0, employee: 'Arjun Sharma' },
  { id: 3, date: '2025-06-03', project: 'CRM Pipeline', task: 'UI for pipeline kanban board', hours: 4.0, employee: 'Arjun Sharma' },
  { id: 4, date: '2025-06-03', project: 'Marketing Campaign', task: 'Draft Q2 email campaign', hours: 2.0, employee: 'Rahul Mehta' },
  { id: 5, date: '2025-06-02', project: 'HR Helpdesk', task: 'Resolve 5 leave queries', hours: 1.5, employee: 'Kiran Patel' },
  { id: 6, date: '2025-06-02', project: 'Sales Outreach', task: 'Cold calls — enterprise segment', hours: 5.0, employee: 'Priya Nair' },
  { id: 7, date: '2025-06-01', project: 'Payroll Module', task: 'ESI and PF calculation testing', hours: 3.5, employee: 'Divya Reddy' },
];
 
const projects = ['Payroll Module', 'Auth System', 'CRM Pipeline', 'Marketing Campaign', 'HR Helpdesk', 'Sales Outreach', 'Recruitment Platform'];
const employees = ['Arjun Sharma', 'Priya Nair', 'Rahul Mehta', 'Kiran Patel', 'Divya Reddy'];
 
const TimeTracking = () => {
  const [logs, setLogs] = useState(initialLogs);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activeTask, setActiveTask] = useState('');
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [activeEmployee, setActiveEmployee] = useState(employees[0]);
  const intervalRef = useRef(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLog, setNewLog] = useState({ date: '', project: projects[0], task: '', hours: '', employee: employees[0] });
 
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);
 
  const formatTime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };
 
  const handleStop = () => {
    if (elapsed > 0 && activeTask.trim()) {
      const hours = parseFloat((elapsed / 3600).toFixed(2));
      setLogs(prev => [{
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        project: activeProject,
        task: activeTask,
        hours,
        employee: activeEmployee,
      }, ...prev]);
    }
    setIsRunning(false);
    setElapsed(0);
  };
 
  const handleAddManual = () => {
    if (newLog.task && newLog.hours && newLog.date) {
      setLogs(prev => [{ ...newLog, id: Date.now(), hours: parseFloat(newLog.hours) }, ...prev]);
      setNewLog({ date: '', project: projects[0], task: '', hours: '', employee: employees[0] });
      setShowAddModal(false);
    }
  };
 
  // Stats
  const todayLogs = logs.filter(l => l.date === new Date().toISOString().split('T')[0]);
  const weekTotal = logs.reduce((s, l) => s + l.hours, 0);
  const byProject = logs.reduce((acc, l) => {
    acc[l.project] = (acc[l.project] || 0) + l.hours;
    return acc;
  }, {});
  const topProject = Object.entries(byProject).sort((a, b) => b[1] - a[1])[0];
 
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineClock className="text-green-500 w-6 h-6" />
            Time Tracking
          </h1>
          <p className="text-sm text-gray-500 mt-1">Log work hours and monitor team time allocation</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Manual Entry
        </button>
      </div>
 
      {/* Timer + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live Timer */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white col-span-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Live Timer</p>
          <div className="text-center">
            <div className={`text-5xl font-mono font-bold mb-5 ${isRunning ? 'text-green-400' : 'text-white'}`}>
              {formatTime(elapsed)}
            </div>
            <input
              placeholder="What are you working on?"
              value={activeTask}
              onChange={e => setActiveTask(e.target.value)}
              className="w-full bg-gray-700 text-white text-sm rounded-lg px-3 py-2 mb-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={activeProject}
              onChange={e => setActiveProject(e.target.value)}
              className="w-full bg-gray-700 text-white text-sm rounded-lg px-3 py-2 mb-4 focus:outline-none"
            >
              {projects.map(p => <option key={p}>{p}</option>)}
            </select>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isRunning ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isRunning ? <HiOutlinePause className="w-4 h-4" /> : <HiOutlinePlay className="w-4 h-4" />}
                {isRunning ? 'Pause' : 'Start'}
              </button>
              {elapsed > 0 && (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-red-500 hover:bg-red-600 text-white"
                >
                  <HiOutlineStop className="w-4 h-4" />
                  Stop & Save
                </button>
              )}
            </div>
          </div>
        </div>
 
        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineCalendarDays className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Today</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{todayLogs.reduce((s, l) => s + l.hours, 0).toFixed(1)}h</p>
            <p className="text-xs text-gray-400 mt-0.5">{todayLogs.length} sessions</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineChartBar className="w-4 h-4 text-green-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase">This Week</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{weekTotal.toFixed(1)}h</p>
            <p className="text-xs text-gray-400 mt-0.5">{logs.length} total logs</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineClock className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Top Project</span>
            </div>
            <p className="text-lg font-bold text-gray-900 truncate">{topProject?.[0] ?? '—'}</p>
            <p className="text-xs text-gray-400 mt-0.5">{topProject?.[1].toFixed(1)}h logged</p>
          </div>
          {/* Project breakdown mini-chart */}
          <div className="col-span-2 sm:col-span-3 bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Hours by Project</p>
            <div className="space-y-2">
              {Object.entries(byProject).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([proj, hrs]) => {
                const pct = Math.round((hrs / weekTotal) * 100);
                return (
                  <div key={proj} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-36 truncate">{proj}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-10 text-right">{hrs.toFixed(1)}h</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
 
      {/* Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Recent Time Logs</h2>
          <span className="text-xs text-gray-400">{logs.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Task</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Hours</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs">{log.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {log.employee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-gray-700 text-xs">{log.employee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{log.project}</td>
                  <td className="px-4 py-3 text-xs text-gray-800">{log.task}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-900">{log.hours}h</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setLogs(prev => prev.filter(l => l.id !== log.id))} className="text-gray-300 hover:text-red-500">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Manual Time Entry</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Date</label>
                  <input type="date" value={newLog.date} onChange={e => setNewLog(p => ({ ...p, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Hours</label>
                  <input type="number" step="0.25" min="0.25" max="24" placeholder="e.g. 2.5" value={newLog.hours}
                    onChange={e => setNewLog(p => ({ ...p, hours: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Employee</label>
                <select value={newLog.employee} onChange={e => setNewLog(p => ({ ...p, employee: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {employees.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Project</label>
                <select value={newLog.project} onChange={e => setNewLog(p => ({ ...p, project: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {projects.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Task Description</label>
                <input placeholder="Brief description of work done" value={newLog.task}
                  onChange={e => setNewLog(p => ({ ...p, task: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddManual} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default TimeTracking;
 
 