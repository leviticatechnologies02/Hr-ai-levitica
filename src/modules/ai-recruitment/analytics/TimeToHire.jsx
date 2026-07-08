import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Calendar, Clock, TrendingUp, AlertCircle, Download, Filter } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const TimeToHire = () => {
  const [selectedJobRole, setSelectedJobRole] = useState('All Roles');
  const [selectedRecruiter, setSelectedRecruiter] = useState('All Recruiters');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedJobRole !== 'All Roles') params.set('job_role', selectedJobRole);
      if (selectedRecruiter !== 'All Recruiters') params.set('recruiter', selectedRecruiter);
      if (selectedDepartment !== 'All Departments') params.set('department', selectedDepartment);

      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.ANALYTICS.TIME_TO_HIRE_DETAIL}?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load time-to-hire data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load time-to-hire data');
      toast.error('Failed to load time-to-hire data from the server');
    } finally {
      setLoading(false);
    }
  }, [selectedJobRole, selectedRecruiter, selectedDepartment]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const jobRoles = ['All Roles', ...(data?.jobRoles || [])];
  const recruiters = ['All Recruiters', ...(data?.recruiters || [])];
  const departments = ['All Departments', ...(data?.departments || [])];

  const roleData = data?.byRole || [];
  const trendData = data?.trend || [];
  const stageDistribution = data?.currentStageDistribution || [];

  const busiestStage = useMemo(() => {
    if (stageDistribution.length === 0) return 'N/A';
    return stageDistribution.reduce((a, b) => (a.count > b.count ? a : b)).stage;
  }, [stageDistribution]);

  return (
    <div className="container-fluid py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-muted small mb-3">Loading time-to-hire data…</div>}

      <div className="mb-12">
        <h4 className="mb-2">Time to Hire</h4>
        <p className="text-secondary-light mb-0">Analyze average hiring duration by role, department and recruiter.</p>
      </div>

      <div className="card border shadow-none mb-24">
        <div className="card-body p-24">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Filter className="text-secondary-light" />
            <h6 className="mb-0">Filters</h6>
          </div>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label">Job Role</label>
              <select value={selectedJobRole} onChange={(e) => setSelectedJobRole(e.target.value)} className="form-select">
                {jobRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Recruiter</label>
              <select value={selectedRecruiter} onChange={(e) => setSelectedRecruiter(e.target.value)} className="form-select">
                {recruiters.map(recruiter => (
                  <option key={recruiter} value={recruiter}>{recruiter}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Department</label>
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="form-select">
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-24">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border shadow-none h-100">
            <div className="card-body p-24 d-flex align-items-center justify-content-between">
              <div>
                <div className="text-secondary-light text-sm">Average Time to Hire</div>
                <div className="h3 mb-0 text-primary-600">{data?.avgTime ?? 0} days</div>
              </div>
              <Clock className="text-primary-600" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border shadow-none h-100">
            <div className="card-body p-24 d-flex align-items-center justify-content-between">
              <div>
                <div className="text-secondary-light text-sm">Fastest Hire</div>
                <div className="h4 mb-0 text-success">{data?.fastest?.totalDays ?? 0} days</div>
                <div className="text-xs text-secondary-light">{data?.fastest?.candidateName || 'N/A'}</div>
              </div>
              <TrendingUp className="text-success" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border shadow-none h-100">
            <div className="card-body p-24 d-flex align-items-center justify-content-between">
              <div>
                <div className="text-secondary-light text-sm">Slowest Hire</div>
                <div className="h4 mb-0 text-danger">{data?.slowest?.totalDays ?? 0} days</div>
                <div className="text-xs text-secondary-light">{data?.slowest?.candidateName || 'N/A'}</div>
              </div>
              <Calendar className="text-danger" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border shadow-none h-100">
            <div className="card-body p-24 d-flex align-items-center justify-content-between">
              <div>
                <div className="text-secondary-light text-sm">Busiest Current Stage</div>
                <div className="h6 mb-0 text-warning">{busiestStage}</div>
              </div>
              <AlertCircle className="text-warning" />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-24">
        <div className="col-12 col-lg-6">
          <div className="card border shadow-none h-100">
            <div className="card-body p-24">
              <h6 className="mb-3">Time-to-Hire Trend (last 6 months with hires)</h6>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card border shadow-none h-100">
            <div className="card-body p-24">
              <h6 className="mb-3">Time by Job Role</h6>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgTime">
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card border shadow-none mb-24">
        <div className="card-body p-24">
          <h6 className="mb-3">Current Pipeline Stage Distribution</h6>
          {/* NOTE: this shows where applications sit RIGHT NOW, not how long
              each stage historically took — there's no stage-transition
              timestamp history in the schema yet to compute the latter. */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card border shadow-none mb-24">
        <div className="card-body p-24">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="mb-0">Hiring Time by Role</h6>
            <button
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              onClick={() => {
                const rows = [['Job Role', 'Average Days'], ...roleData.map(r => [r.role, r.avgTime])];
                const csv = rows.map(r => r.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'time-to-hire-by-role.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Job Role</th>
                  <th>Avg Time to Hire</th>
                </tr>
              </thead>
              <tbody>
                {roleData.map((role, index) => (
                  <tr key={index}>
                    <td className="fw-medium">{role.role}</td>
                    <td className="fw-semibold">{role.avgTime} days</td>
                  </tr>
                ))}
                {roleData.length === 0 && (
                  <tr>
                    <td colSpan={2} className="text-center text-secondary-light">No hires recorded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeToHire;