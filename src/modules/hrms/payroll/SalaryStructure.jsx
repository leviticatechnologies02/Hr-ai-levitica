import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import StatCard from '../../../shared/components/StatCard';
import AssignmentModal from '../modal/AssignmentModal';
import AssignmentViewModal from '../modal/AssignmentViewModal';
import ChangeStructureModal from '../modal/ChangeStructureModal';
import StructureModal from '../modal/StructureModal';
import StructureViewModal from '../modal/StructureViewModal';
import ComponentModal from '../modal/ComponentModal';
import ComponentViewModal from '../modal/ComponentViewModal';
import VersionModal from '../modal/VersionModal';
import SimulationModal from '../modal/SimulationModal';

const SalaryStructure = () => {
  const [activeTab, setActiveTab] = useState('components');
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [showViewComponentModal, setShowViewComponentModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [showViewStructureModal, setShowViewStructureModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showViewAssignmentModal, setShowViewAssignmentModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [showChangeStructureModal, setShowChangeStructureModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [employeeToChange, setEmployeeToChange] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [componentFilters, setComponentFilters] = useState({
    category: 'all',
    type: 'all',
    taxable: 'all',
    statutory: 'all',
    calculation: 'all',
    proRata: 'all',
    status: 'active'
  });

  const [structureFilters, setStructureFilters] = useState({
    status: 'all',
    category: 'all',
    grade: 'all',
    department: 'all',
    location: 'all'
  });

  const [components, setComponents] = useState({
    earnings: [],
    deductions: [],
    employerContributions: [],
    reimbursements: []
  });

  const [structures, setStructures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [versions, setVersions] = useState([]);

  const getStatusBadge = (status) => {
    const config = {
      'active': { label: 'Active', color: 'emerald' },
      'inactive': { label: 'Inactive', color: 'gray' },
      'draft': { label: 'Draft', color: 'amber' },
      'approved': { label: 'Approved', color: 'emerald' },
      'pending': { label: 'Pending', color: 'amber' },
      'rejected': { label: 'Rejected', color: 'rose' },
      'completed': { label: 'Completed', color: 'emerald' },
    };
    const { label, color } = config[status] || { label: status || 'Unknown', color: 'gray' };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const config = {
      'earnings': { label: 'Earnings', color: 'blue' },
      'deductions': { label: 'Deductions', color: 'rose' },
      'employer_contributions': { label: 'Employer Contributions', color: 'purple' },
      'reimbursements': { label: 'Reimbursements', color: 'emerald' },
    };
    const { label, color } = config[category] || { label: category || 'N/A', color: 'gray' };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const config = {
      'fixed': { label: 'Fixed', color: 'blue' },
      'variable': { label: 'Variable', color: 'amber' },
    };
    const { label, color } = config[type] || { label: type || 'N/A', color: 'gray' };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-700 border border-${color}-100`}>
        {label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateBreakdown = (structure) => {
    if (!structure) return null;
    const ctc = structure.ctc || 0;
    const basic = ctc * 0.4;
    const hra = basic * 0.5;
    const conveyance = 19200;
    const specialAllowance = ctc * 0.2 - conveyance;
    const pf = basic * 0.12;
    const professionalTax = 200;
    const gross = basic + hra + conveyance + specialAllowance;
    const employeeDeductions = pf + professionalTax;
    const takeHome = gross - employeeDeductions;
    return { basic, hra, conveyance, specialAllowance, pf, professionalTax, gross, employeeDeductions, takeHome };
  };

  const handleAddComponent = (data) => {
    toast.success('Component added successfully');
    setShowComponentModal(false);
  };

  const handleUpdateComponent = (data) => {
    toast.success('Component updated successfully');
    setShowComponentModal(false);
    setSelectedComponent(null);
  };

  const handleDeleteComponent = (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      toast.success('Component deleted successfully');
      setShowViewComponentModal(false);
      setSelectedComponent(null);
    }
  };

  const handleAddStructure = (data) => {
    toast.success('Structure created successfully');
    setShowStructureModal(false);
  };

  const handleUpdateStructure = (data) => {
    toast.success('Structure updated successfully');
    setShowViewStructureModal(false);
    setSelectedStructure(null);
  };

  const handleDeleteStructure = (id) => {
    if (window.confirm('Are you sure you want to delete this structure?')) {
      toast.success('Structure deleted successfully');
      setShowViewStructureModal(false);
      setSelectedStructure(null);
    }
  };

  const handleAddAssignment = (data) => {
    toast.success('Assignment created successfully');
    setShowAssignmentModal(false);
  };

  const handleUpdateAssignment = (data) => {
    toast.success('Assignment updated successfully');
    setShowChangeStructureModal(false);
    setEmployeeToChange(null);
  };

  const handleDeleteAssignment = (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      toast.success('Assignment deleted successfully');
    }
  };

  const handleExportVersionHistory = () => {
    toast.info('Version history exported successfully');
    setShowVersionModal(false);
  };

  const handleRunSimulation = (data) => {
    toast.success('Simulation completed');
    setShowSimulationModal(false);
  };

  const renderComponentStats = () => {
    const total = Object.values(components).flat().length;
    const active = Object.values(components).flat().filter(c => c.isActive).length;
    const taxable = Object.values(components).flat().filter(c => c.taxable).length;
    const statutory = Object.values(components).flat().filter(c => c.statutory).length;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Components" value={total} subtitle="All components" icon="heroicons:cube" color="blue" />
        <StatCard title="Active" value={active} subtitle={`${((active / (total || 1)) * 100).toFixed(1)}% of total`} icon="heroicons:check-circle" color="green" />
        <StatCard title="Taxable" value={taxable} subtitle="Taxable components" icon="heroicons:currency-dollar" color="yellow" />
        <StatCard title="Statutory" value={statutory} subtitle="Statutory components" icon="heroicons:shield-check" color="red" />
      </div>
    );
  };

  const renderStructureStats = () => {
    const total = structures.length;
    const active = structures.filter(s => s.status === 'active').length;
    const draft = structures.filter(s => s.status === 'draft').length;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Structures" value={total} subtitle="All structures" icon="heroicons:document-text" color="blue" />
        <StatCard title="Active" value={active} subtitle={`${((active / (total || 1)) * 100).toFixed(1)}% of total`} icon="heroicons:check-circle" color="green" />
        <StatCard title="Draft" value={draft} subtitle="Pending approval" icon="heroicons:pencil" color="yellow" />
        <StatCard title="Total Employees" value={structures.reduce((sum, s) => sum + (s.employeeCount || 0), 0)} subtitle="Assigned employees" icon="heroicons:users" color="purple" />
      </div>
    );
  };

  const renderAssignmentStats = () => {
    const total = assignments.length;
    const active = assignments.filter(a => a.assignmentStatus === 'active').length;
    const pending = assignments.filter(a => a.assignmentStatus === 'pending').length;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Assignments" value={total} subtitle="All assignments" icon="heroicons:user-group" color="blue" />
        <StatCard title="Active" value={active} subtitle={`${((active / (total || 1)) * 100).toFixed(1)}% of total`} icon="heroicons:check-circle" color="green" />
        <StatCard title="Pending" value={pending} subtitle="Awaiting approval" icon="heroicons:clock" color="yellow" />
        <StatCard title="Total CTC" value={formatCurrency(assignments.reduce((sum, a) => sum + (a.ctc || 0), 0))} subtitle="Combined annual CTC" icon="heroicons:currency-dollar" color="purple" />
      </div>
    );
  };

  const renderComponentFilters = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Category</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={componentFilters.category}
            onChange={(e) => setComponentFilters({ ...componentFilters, category: e.target.value })}
          >
            <option value="all">All</option>
            <option value="earnings">Earnings</option>
            <option value="deductions">Deductions</option>
            <option value="employer_contributions">Employer Contributions</option>
            <option value="reimbursements">Reimbursements</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Type</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={componentFilters.type}
            onChange={(e) => setComponentFilters({ ...componentFilters, type: e.target.value })}
          >
            <option value="all">All</option>
            <option value="fixed">Fixed</option>
            <option value="variable">Variable</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Taxable</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={componentFilters.taxable}
            onChange={(e) => setComponentFilters({ ...componentFilters, taxable: e.target.value })}
          >
            <option value="all">All</option>
            <option value="taxable">Taxable</option>
            <option value="non_taxable">Non-Taxable</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Statutory</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={componentFilters.statutory}
            onChange={(e) => setComponentFilters({ ...componentFilters, statutory: e.target.value })}
          >
            <option value="all">All</option>
            <option value="statutory">Statutory</option>
            <option value="non_statutory">Non-Statutory</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Calculation</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={componentFilters.calculation}
            onChange={(e) => setComponentFilters({ ...componentFilters, calculation: e.target.value })}
          >
            <option value="all">All</option>
            <option value="flat">Flat Amount</option>
            <option value="percentage_of_base">% of Base</option>
            <option value="percentage_of_ctc">% of CTC</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pro-rata</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={componentFilters.proRata}
            onChange={(e) => setComponentFilters({ ...componentFilters, proRata: e.target.value })}
          >
            <option value="all">All</option>
            <option value="proRata">Pro-rata</option>
            <option value="no_proRata">No Pro-rata</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={componentFilters.status}
            onChange={(e) => setComponentFilters({ ...componentFilters, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => setComponentFilters({
            category: 'all',
            type: 'all',
            taxable: 'all',
            statutory: 'all',
            calculation: 'all',
            proRata: 'all',
            status: 'active'
          })}
          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

  const renderStructureFilters = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={structureFilters.status}
            onChange={(e) => setStructureFilters({ ...structureFilters, status: e.target.value })}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Category</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={structureFilters.category}
            onChange={(e) => setStructureFilters({ ...structureFilters, category: e.target.value })}
          >
            <option value="all">All</option>
            <option value="permanent">Permanent</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Grade</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={structureFilters.grade}
            onChange={(e) => setStructureFilters({ ...structureFilters, grade: e.target.value })}
          >
            <option value="all">All</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="D">Grade D</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Department</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={structureFilters.department}
            onChange={(e) => setStructureFilters({ ...structureFilters, department: e.target.value })}
          >
            <option value="all">All</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Location</label>
          <select
            className="w-full mt-1 h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={structureFilters.location}
            onChange={(e) => setStructureFilters({ ...structureFilters, location: e.target.value })}
          >
            <option value="all">All</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => setStructureFilters({
            status: 'all',
            category: 'all',
            grade: 'all',
            department: 'all',
            location: 'all'
          })}
          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 min-h-screen pb-8 sm:pb-10">

      <div className="">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
              <Icon icon="heroicons:cog-6-tooth" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
                Salary Structure Management
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 flex flex-wrap items-center gap-1 sm:gap-2">
                <span>Manage CTC structures, components, and employee assignments</span>
                <span className="w-0.5 h-0.5 rounded-full bg-slate-300 hidden xs:inline"></span>
                <span className="hidden xs:inline">Configure salary templates</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-0 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        {[
          { id: 'components', label: 'Components Master', icon: 'heroicons:cube' },
          { id: 'structures', label: 'Structure Templates', icon: 'heroicons:document-text' },
          { id: 'assignments', label: 'Structure Assignment', icon: 'heroicons:user-group' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-sm font-semibold transition-all flex items-center gap-1 sm:gap-2 whitespace-nowrap border-b-2 ${activeTab === tab.id
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon icon={tab.icon} className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4 md:p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 mt-2">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'components' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="text-sm font-bold text-slate-800">Salary Components</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedComponent(null);
                        setShowComponentModal(true);
                      }}
                      className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
                    >
                      <Icon icon="heroicons:plus" className="w-3 h-3 sm:w-4 sm:h-4" />
                      Add Component
                    </button>
                    <button
                      onClick={() => toast.info('Export functionality coming soon')}
                      className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
                    >
                      <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3 sm:w-4 sm:h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {renderComponentStats()}
                {renderComponentFilters()}

                <div className="space-y-6">
                  {Object.entries(components).map(([category, items]) => {
                    const filtered = items.filter(c => {
                      if (componentFilters.type !== 'all' && c.type !== componentFilters.type) return false;
                      if (componentFilters.taxable !== 'all' && (componentFilters.taxable === 'taxable' ? !c.taxable : c.taxable)) return false;
                      if (componentFilters.statutory !== 'all' && (componentFilters.statutory === 'statutory' ? !c.statutory : c.statutory)) return false;
                      if (componentFilters.calculation !== 'all' && c.calculation !== componentFilters.calculation) return false;
                      if (componentFilters.proRata !== 'all' && (componentFilters.proRata === 'proRata' ? !c.proRata : c.proRata)) return false;
                      if (componentFilters.status !== 'all' && (componentFilters.status === 'active' ? !c.isActive : c.isActive)) return false;
                      return true;
                    });

                    if (filtered.length === 0) return null;

                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-3">
                          <h6 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                            {category.replace('_', ' ')} ({filtered.length})
                          </h6>
                        </div>
                        <div className="overflow-x-auto border border-slate-200 rounded-xl">
                          <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                              <tr>
                                <th className="p-3 text-left min-w-[160px]">Name</th>
                                <th className="p-3 text-left min-w-[80px] hidden sm:table-cell">Type</th>
                                <th className="p-3 text-left min-w-[80px] hidden md:table-cell">Category</th>
                                <th className="p-3 text-center min-w-[80px]">Value</th>
                                <th className="p-3 text-center min-w-[80px] hidden lg:table-cell">Status</th>
                                <th className="p-3 text-center min-w-[120px]">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filtered.map(comp => (
                                <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-3">
                                    <div className="font-medium text-slate-800">{comp.name}</div>
                                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{comp.description}</div>
                                  </td>
                                  <td className="p-3 hidden sm:table-cell">{getTypeBadge(comp.type)}</td>
                                  <td className="p-3 hidden md:table-cell">{getCategoryBadge(comp.category)}</td>
                                  <td className="p-3 text-center font-semibold text-slate-700">
                                    {comp.calculation === 'flat_amount' ? formatCurrency(comp.value) : `${comp.value}%`}
                                  </td>
                                  <td className="p-3 text-center hidden lg:table-cell">
                                    {comp.isActive ? (
                                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>
                                    ) : (
                                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Inactive</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => {
                                          setSelectedComponent(comp);
                                          setShowViewComponentModal(true);
                                        }}
                                        className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                                        title="View"
                                      >
                                        <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedComponent(comp);
                                          setShowComponentModal(true);
                                        }}
                                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                                        title="Edit"
                                      >
                                        <Icon icon="heroicons:pencil" className="w-3 h-3 sm:w-4 sm:h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteComponent(comp.id)}
                                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                        title="Delete"
                                      >
                                        <Icon icon="heroicons:trash" className="w-3 h-3 sm:w-4 sm:h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {Object.values(components).flat().length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <Icon icon="heroicons:cube" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium text-slate-600">No components found</p>
                    <p className="text-xs mt-1">Click "Add Component" to create your first component</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'structures' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="text-sm font-bold text-slate-800">Salary Structure Templates</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowStructureModal(true)}
                      className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
                    >
                      <Icon icon="heroicons:plus" className="w-3 h-3 sm:w-4 sm:h-4" />
                      Create Template
                    </button>
                    <button
                      onClick={() => setShowSimulationModal(true)}
                      className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
                    >
                      <Icon icon="heroicons:calculator" className="w-3 h-3 sm:w-4 sm:h-4" />
                      Simulation
                    </button>
                    <button
                      onClick={() => setShowVersionModal(true)}
                      className="px-3 sm:px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
                    >
                      <Icon icon="heroicons:clock" className="w-3 h-3 sm:w-4 sm:h-4" />
                      Versions
                    </button>
                  </div>
                </div>

                {renderStructureStats()}
                {renderStructureFilters()}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {structures.map(structure => (
                    <div key={structure.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer" onClick={() => { setSelectedStructure(structure); setShowViewStructureModal(true); }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h6 className="font-semibold text-slate-800">{structure.name}</h6>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">Grade {structure.grade}</span>
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">{structure.level}</span>
                            {getStatusBadge(structure.status)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>CTC:</span>
                          <span className="font-semibold">{formatCurrency(structure.ctc)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Employees:</span>
                          <span>{structure.employeeCount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Effective:</span>
                          <span>{structure.effectiveDate}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200 flex justify-end gap-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedStructure(structure); setShowViewStructureModal(true); }}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                          title="View"
                        >
                          <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedStructure(structure); setShowStructureModal(true); }}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                          title="Edit"
                        >
                          <Icon icon="heroicons:pencil" className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {structures.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <Icon icon="heroicons:document-text" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium text-slate-600">No structures found</p>
                    <p className="text-xs mt-1">Click "Create Template" to create your first structure</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="text-sm font-bold text-slate-800">Structure Assignments</h3>
                  <button
                    onClick={() => setShowAssignmentModal(true)}
                    className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1"
                  >
                    <Icon icon="heroicons:plus" className="w-3 h-3 sm:w-4 sm:h-4" />
                    Assign Structure
                  </button>
                </div>

                {renderAssignmentStats()}

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3 text-left min-w-[120px]">Employee</th>
                        <th className="p-3 text-left min-w-[100px] hidden sm:table-cell">Department</th>
                        <th className="p-3 text-left min-w-[140px] hidden md:table-cell">Structure</th>
                        <th className="p-3 text-center min-w-[100px]">CTC</th>
                        <th className="p-3 text-center min-w-[100px] hidden lg:table-cell">Take-Home</th>
                        <th className="p-3 text-center min-w-[100px]">Status</th>
                        <th className="p-3 text-center min-w-[120px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {assignments.map(assignment => (
                        <tr key={assignment.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3">
                            <div className="font-medium text-slate-800">{assignment.name}</div>
                            <div className="text-[10px] text-slate-400">{assignment.employeeId}</div>
                          </td>
                          <td className="p-3 hidden sm:table-cell text-slate-600">{assignment.department}</td>
                          <td className="p-3 hidden md:table-cell text-slate-600">
                            <div className="truncate max-w-[120px]" title={assignment.currentStructure}>
                              {assignment.currentStructure}
                            </div>
                          </td>
                          <td className="p-3 text-center font-semibold text-slate-700">{formatCurrency(assignment.ctc)}</td>
                          <td className="p-3 text-center hidden lg:table-cell text-slate-600">{formatCurrency(assignment.takeHome)}</td>
                          <td className="p-3 text-center">
                            {assignment.assignmentStatus === 'active' ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Pending</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => { setSelectedAssignment(assignment); setShowViewAssignmentModal(true); }}
                                className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                                title="View"
                              >
                                <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                              </button>
                              <button
                                onClick={() => { setEmployeeToChange(assignment); setShowChangeStructureModal(true); }}
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                                title="Edit"
                              >
                                <Icon icon="heroicons:pencil" className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAssignment(assignment.id)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                title="Delete"
                              >
                                <Icon icon="heroicons:trash" className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {assignments.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <Icon icon="heroicons:user-group" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium text-slate-600">No assignments found</p>
                    <p className="text-xs mt-1">Click "Assign Structure" to create your first assignment</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <ComponentModal
        isOpen={showComponentModal}
        onClose={() => { setShowComponentModal(false); setSelectedComponent(null); }}
        onSubmit={selectedComponent ? handleUpdateComponent : handleAddComponent}
        component={selectedComponent}
      />

      <ComponentViewModal
        isOpen={showViewComponentModal}
        onClose={() => { setShowViewComponentModal(false); setSelectedComponent(null); }}
        component={selectedComponent}
        onEdit={() => {
          setShowViewComponentModal(false);
          setShowComponentModal(true);
        }}
        onDelete={() => handleDeleteComponent(selectedComponent?.id)}
      />

      <StructureModal
        isOpen={showStructureModal}
        onClose={() => { setShowStructureModal(false); setSelectedStructure(null); }}
        onSubmit={selectedStructure ? handleUpdateStructure : handleAddStructure}
        structure={selectedStructure}
        structures={structures}
      />

      <StructureViewModal
        isOpen={showViewStructureModal}
        onClose={() => { setShowViewStructureModal(false); setSelectedStructure(null); }}
        structure={selectedStructure}
        onEdit={() => {
          setShowViewStructureModal(false);
          setShowStructureModal(true);
        }}
        onDelete={() => handleDeleteStructure(selectedStructure?.id)}
        calculateBreakdown={calculateBreakdown}
      />

      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onSubmit={handleAddAssignment}
        structures={structures}
      />

      <AssignmentViewModal
        isOpen={showViewAssignmentModal}
        onClose={() => { setShowViewAssignmentModal(false); setSelectedAssignment(null); }}
        assignment={selectedAssignment}
        onEdit={() => {
          setShowViewAssignmentModal(false);
          setEmployeeToChange(selectedAssignment);
          setShowChangeStructureModal(true);
        }}
        onDelete={() => handleDeleteAssignment(selectedAssignment?.id)}
      />

      <ChangeStructureModal
        isOpen={showChangeStructureModal}
        onClose={() => { setShowChangeStructureModal(false); setEmployeeToChange(null); }}
        onSubmit={handleUpdateAssignment}
        employee={employeeToChange}
        structures={structures}
        calculateBreakdown={calculateBreakdown}
      />

      <VersionModal
        isOpen={showVersionModal}
        onClose={() => setShowVersionModal(false)}
        versions={versions}
        structures={structures}
        onExport={handleExportVersionHistory}
      />

      <SimulationModal
        isOpen={showSimulationModal}
        onClose={() => setShowSimulationModal(false)}
        onSubmit={handleRunSimulation}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        className="text-xs sm:text-sm"
        toastClassName="rounded-xl shadow-lg"
      />
    </div>
  );
};

export default SalaryStructure;