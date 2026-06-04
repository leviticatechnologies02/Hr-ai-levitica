import React, { useState } from 'react';
import {
  HiOutlineFire,
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2';
 
const initialOKRs = [
  {
    id: 1,
    objective: 'Increase overall company revenue by 30%',
    owner: 'Sales Team',
    quarter: 'Q2 2025',
    status: 'on-track',
    progress: 72,
    keyResults: [
      { id: 1, title: 'Close 50 new enterprise deals', current: 36, target: 50, unit: 'deals' },
      { id: 2, title: 'Achieve ₹5Cr monthly recurring revenue', current: 3.6, target: 5, unit: 'Cr' },
      { id: 3, title: 'Reduce churn to below 3%', current: 4.1, target: 3, unit: '%', inverse: true },
    ],
    expanded: true,
  },
  {
    id: 2,
    objective: 'Build a world-class engineering team',
    owner: 'Engineering',
    quarter: 'Q2 2025',
    status: 'at-risk',
    progress: 48,
    keyResults: [
      { id: 1, title: 'Hire 15 senior engineers', current: 7, target: 15, unit: 'hires' },
      { id: 2, title: 'Achieve 90% sprint completion rate', current: 76, target: 90, unit: '%' },
      { id: 3, title: 'Reduce bug backlog by 50%', current: 30, target: 50, unit: '%' },
    ],
    expanded: false,
  },
  {
    id: 3,
    objective: 'Improve employee satisfaction score to 85+',
    owner: 'HR & Admin',
    quarter: 'Q2 2025',
    status: 'completed',
    progress: 100,
    keyResults: [
      { id: 1, title: 'Conduct quarterly eNPS surveys', current: 2, target: 2, unit: 'surveys' },
      { id: 2, title: 'Launch L&D program for all teams', current: 5, target: 5, unit: 'programs' },
      { id: 3, title: 'Achieve 85+ eNPS score', current: 87, target: 85, unit: 'score' },
    ],
    expanded: false,
  },
  {
    id: 4,
    objective: 'Expand to 3 new product markets',
    owner: 'Product & Marketing',
    quarter: 'Q2 2025',
    status: 'behind',
    progress: 25,
    keyResults: [
      { id: 1, title: 'Launch CRM module to market', current: 0, target: 1, unit: 'launch' },
      { id: 2, title: 'Acquire 500 beta users', current: 120, target: 500, unit: 'users' },
      { id: 3, title: 'Publish 20 industry case studies', current: 5, target: 20, unit: 'cases' },
    ],
    expanded: false,
  },
];
 
const statusConfig = {
  'on-track': { label: 'On Track', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  'at-risk': { label: 'At Risk', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  'completed': { label: 'Completed', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  'behind': { label: 'Behind', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};
 
const Projects = () => {
  const [okrs, setOkrs] = useState(initialOKRs);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newObjective, setNewObjective] = useState('');
 
  const toggleExpand = (id) => {
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, expanded: !o.expanded } : o));
  };
 
  const filtered = filterStatus === 'all' ? okrs : okrs.filter(o => o.status === filterStatus);
 
  const summary = {
    total: okrs.length,
    completed: okrs.filter(o => o.status === 'completed').length,
    onTrack: okrs.filter(o => o.status === 'on-track').length,
    atRisk: okrs.filter(o => o.status === 'at-risk').length,
    behind: okrs.filter(o => o.status === 'behind').length,
  };
 
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HiOutlineFire className="text-orange-500 w-6 h-6" />
            Goals & OKRs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track objectives and key results across the organization</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" />
          New Objective
        </button>
      </div>
 
      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Completed', value: summary.completed, icon: HiOutlineCheckCircle, color: 'text-blue-600 bg-blue-50' },
          { label: 'On Track', value: summary.onTrack, icon: HiOutlineFire, color: 'text-green-600 bg-green-50' },
          { label: 'At Risk', value: summary.atRisk, icon: HiOutlineClock, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Behind', value: summary.behind, icon: HiOutlineXCircle, color: 'text-red-600 bg-red-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
 
      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'on-track', 'at-risk', 'behind', 'completed'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
              filterStatus === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {s === 'all' ? 'All OKRs' : statusConfig[s].label}
          </button>
        ))}
        <span className="text-xs text-gray-400 ml-2">{filtered.length} objectives</span>
      </div>
 
      {/* OKR List */}
      <div className="space-y-4">
        {filtered.map((okr) => {
          const sc = statusConfig[okr.status];
          return (
            <div key={okr.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Objective Header */}
              <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpand(okr.id)}
              >
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{okr.objective}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{okr.owner} · {okr.quarter}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-28 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          okr.status === 'completed' ? 'bg-blue-500' :
                          okr.status === 'on-track' ? 'bg-green-500' :
                          okr.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${okr.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8">{okr.progress}%</span>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${sc.color}`}>
                    {sc.label}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <button className="p-1 hover:text-blue-600" onClick={(e) => e.stopPropagation()}>
                      <HiOutlinePencilSquare className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:text-red-500" onClick={(e) => e.stopPropagation()}>
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                  {okr.expanded ? <HiOutlineChevronUp className="w-4 h-4 text-gray-400" /> : <HiOutlineChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
 
              {/* Key Results */}
              {okr.expanded && (
                <div className="border-t border-gray-100 px-5 pb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-3">Key Results</p>
                  <div className="space-y-3">
                    {okr.keyResults.map((kr) => {
                      const pct = kr.inverse
                        ? Math.min(100, Math.round((1 - (kr.current - kr.target) / kr.target) * 100))
                        : Math.min(100, Math.round((kr.current / kr.target) * 100));
                      return (
                        <div key={kr.id} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${pct >= 100 ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {pct >= 100 ? <HiOutlineCheckCircle className="w-3.5 h-3.5 text-green-600" /> : <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 truncate">{kr.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                <div
                                  className="h-1.5 rounded-full bg-blue-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {kr.current} / {kr.target} {kr.unit}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-700 w-8 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
 
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Objective</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Objective</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Increase customer retention by 20%"
                  value={newObjective}
                  onChange={e => setNewObjective(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Owner</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Quarter</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option>Q2 2025</option>
                    <option>Q3 2025</option>
                    <option>Q4 2025</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newObjective.trim()) {
                    setOkrs(prev => [...prev, {
                      id: Date.now(),
                      objective: newObjective.trim(),
                      owner: 'Engineering',
                      quarter: 'Q2 2025',
                      status: 'on-track',
                      progress: 0,
                      keyResults: [],
                      expanded: true,
                    }]);
                    setNewObjective('');
                    setShowAddModal(false);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Create Objective
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
const departments = ['Engineering', 'Marketing', 'Sales', 'HR & Admin', 'Finance', 'Product'];
 
export default Projects;
 
 