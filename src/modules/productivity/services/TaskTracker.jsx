import React, { useState } from 'react';
import {
  HiOutlineClipboardDocumentList,
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineFlag,
  HiOutlineUserCircle,
  HiOutlineFunnel,
  HiOutlineMagnifyingGlass,
  HiOutlineTrash,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
 
const STATUSES = ['To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
 
const priorityColor = {
  Low: 'text-gray-500 bg-gray-100',
  Medium: 'text-blue-600 bg-blue-100',
  High: 'text-orange-600 bg-orange-100',
  Critical: 'text-red-600 bg-red-100',
};
 
const statusIcon = {
  'To Do': <HiOutlineClock className="w-4 h-4 text-gray-400" />,
  'In Progress': <HiOutlineArrowPath className="w-4 h-4 text-blue-500" />,
  'In Review': <HiOutlineExclamationCircle className="w-4 h-4 text-yellow-500" />,
  'Done': <HiOutlineCheckCircle className="w-4 h-4 text-green-500" />,
};
 
const initialTasks = [
  { id: 1, title: 'Review Q2 payroll adjustments', assignee: 'Divya Reddy', dept: 'Finance', priority: 'Critical', status: 'In Progress', due: '2025-06-10', tags: ['Payroll'] },
  { id: 2, title: 'Update employee handbook 2025', assignee: 'Kiran Patel', dept: 'HR & Admin', priority: 'High', status: 'To Do', due: '2025-06-15', tags: ['Policy'] },
  { id: 3, title: 'Deploy new authentication module', assignee: 'Arjun Sharma', dept: 'Engineering', priority: 'Critical', status: 'In Review', due: '2025-06-08', tags: ['Dev', 'Security'] },
  { id: 4, title: 'Create onboarding checklist template', assignee: 'Kiran Patel', dept: 'HR & Admin', priority: 'Medium', status: 'Done', due: '2025-06-01', tags: ['Onboarding'] },
  { id: 5, title: 'Prepare sales pipeline report', assignee: 'Priya Nair', dept: 'Sales', priority: 'High', status: 'In Progress', due: '2025-06-12', tags: ['Sales', 'Report'] },
  { id: 6, title: 'Design social media calendar for July', assignee: 'Rahul Mehta', dept: 'Marketing', priority: 'Medium', status: 'To Do', due: '2025-06-20', tags: ['Marketing'] },
  { id: 7, title: 'Audit leave balances for FY 2025', assignee: 'Divya Reddy', dept: 'Finance', priority: 'High', status: 'To Do', due: '2025-06-18', tags: ['Leave'] },
  { id: 8, title: 'Fix attendance sync bug', assignee: 'Arjun Sharma', dept: 'Engineering', priority: 'Critical', status: 'In Progress', due: '2025-06-07', tags: ['Dev', 'Bug'] },
];
 
const TaskTracker = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState('board'); // 'board' | 'list'
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assignee: '', priority: 'Medium', status: 'To Do', due: '', dept: '' });
 
  const filtered = tasks.filter(t =>
    (filterPriority === 'All' || t.priority === filterPriority) &&
    (search === '' || t.title.toLowerCase().includes(search.toLowerCase()) || t.assignee.toLowerCase().includes(search.toLowerCase()))
  );
 
  const tasksByStatus = STATUSES.reduce((acc, s) => {
    acc[s] = filtered.filter(t => t.status === s);
    return acc;
  }, {});
 
  const handleStatusChange = (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };
 
  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };
 
  const handleAddTask = () => {
    if (newTask.title.trim()) {
      setTasks(prev => [...prev, { ...newTask, id: Date.now(), tags: [] }]);
      setNewTask({ title: '', assignee: '', priority: 'Medium', status: 'To Do', due: '', dept: '' });
      setShowModal(false);
    }
  };
 
  const isOverdue = (due) => due && new Date(due) < new Date();
 
  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineClipboardDocumentList className="text-blue-500 w-6 h-6" />
            Task Tracker
          </h1>
          <p className="text-sm text-gray-500 mt-1">Assign, track and manage team tasks</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {['board', 'list'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                  view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>
 
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <HiOutlineFunnel className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1">
            {['All', ...PRIORITIES].map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
                  filterPriority === p ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} tasks</span>
      </div>
 
      {/* Board View */}
      {view === 'board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto">
          {STATUSES.map(status => (
            <div key={status} className="bg-gray-50 rounded-xl p-3 min-w-[220px]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {statusIcon[status]}
                  <span className="text-sm font-semibold text-gray-700">{status}</span>
                </div>
                <span className="text-xs bg-white border border-gray-200 text-gray-500 font-medium px-2 py-0.5 rounded-full">
                  {tasksByStatus[status].length}
                </span>
              </div>
              <div className="space-y-2">
                {tasksByStatus[status].map(task => (
                  <div key={task.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <p className="text-sm font-medium text-gray-800 leading-tight">{task.title}</p>
                      <button onClick={() => handleDelete(task.id)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[task.priority]}`}>
                        {task.priority}
                      </span>
                      {task.due && (
                        <span className={`text-xs ${isOverdue(task.due) && status !== 'Done' ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                          {isOverdue(task.due) && status !== 'Done' ? '⚠ ' : ''}{task.due}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <HiOutlineUserCircle className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500 truncate">{task.assignee}</span>
                    </div>
                    {/* Status change */}
                    <select
                      value={task.status}
                      onChange={e => handleStatusChange(task.id, e.target.value)}
                      className="mt-2 w-full text-xs border border-gray-100 rounded py-1 px-1 focus:outline-none text-gray-600 bg-gray-50"
                    >
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
                {tasksByStatus[status].length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
 
      {/* List View */}
      {view === 'list' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Task</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Assignee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(task => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-gray-400">{task.dept}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-gray-700 text-xs">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={task.status}
                      onChange={e => handleStatusChange(task.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none text-gray-700"
                    >
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${isOverdue(task.due) && task.status !== 'Done' ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                      {task.due || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(task.id)} className="text-gray-300 hover:text-red-500">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">No tasks match your filters</p>
          )}
        </div>
      )}
 
      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Task</h2>
            <div className="space-y-3">
              <input
                placeholder="Task title"
                value={newTask.title}
                onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Assignee name"
                value={newTask.assignee}
                onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newTask.priority}
                  onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
                <select
                  value={newTask.status}
                  onChange={e => setNewTask(p => ({ ...p, status: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <input
                type="date"
                value={newTask.due}
                onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAddTask} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default TaskTracker;
 
 