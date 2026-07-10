import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, UserCheck, TrendingUp, Download, Mail, Filter } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

const DEPT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

const JobPerformance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedJob, setSelectedJob] = useState('All Jobs');
  const [selectedRecruiter, setSelectedRecruiter] = useState('All Recruiters');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.ANALYTICS.JOB_PERFORMANCE}`);
      if (!res.ok) throw new Error('Failed to load job performance data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load job performance data');
      toast.error('Failed to load job performance data from the server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const jobData = data?.jobs || [];
  const trendData = data?.trend || [];
  const departmentData = (data?.departmentData || []).map((d, i) => ({ ...d, fill: DEPT_COLORS[i % DEPT_COLORS.length] }));
  const insights = data?.insights || [];

  const uniqueJobs = ['All Jobs', ...new Set(jobData.map(j => j.jobRole))];
  const uniqueRecruiters = ['All Recruiters', ...new Set(jobData.map(j => j.recruiter))];
  const uniqueDepartments = ['All Departments', ...new Set(jobData.map(j => j.department))];

  const filteredData = useMemo(() => {
    return jobData.filter(job => {
      if (selectedJob !== 'All Jobs' && job.jobRole !== selectedJob) return false;
      if (selectedRecruiter !== 'All Recruiters' && job.recruiter !== selectedRecruiter) return false;
      if (selectedDepartment !== 'All Departments' && job.department !== selectedDepartment) return false;
      return true;
    });
  }, [jobData, selectedJob, selectedRecruiter, selectedDepartment]);

  const kpis = useMemo(() => {
    const totals = filteredData.reduce((acc, job) => ({
      applications: acc.applications + job.applications,
      shortlisted: acc.shortlisted + job.shortlisted,
      interviews: acc.interviews + job.interviews,
      offers: acc.offers + job.offers,
      hires: acc.hires + job.hires
    }), { applications: 0, shortlisted: 0, interviews: 0, offers: 0, hires: 0 });

    return {
      ...totals,
      conversionRate: totals.applications > 0 ? ((totals.hires / totals.applications) * 100).toFixed(1) : 0
    };
  }, [filteredData]);

  const barChartData = filteredData.map(job => ({
    name: job.jobRole,
    applications: job.applications,
    shortlisted: job.shortlisted,
    interviews: job.interviews,
    offers: job.offers,
    hires: job.hires
  }));

  const funnelData = [
    { name: 'Applications', value: kpis.applications },
    { name: 'Shortlisted', value: kpis.shortlisted },
    { name: 'Interviews', value: kpis.interviews },
    { name: 'Offers', value: kpis.offers },
    { name: 'Hires', value: kpis.hires }
  ];

  const exportCsv = () => {
    const rows = [
      ['Job Role', 'Applications', 'Shortlisted', 'Interviews', 'Offers', 'Hires', 'Conversion %', 'Time-to-Hire'],
      ...filteredData.map(job => [
        job.jobRole, job.applications, job.shortlisted, job.interviews, job.offers, job.hires,
        job.applications ? ((job.hires / job.applications) * 100).toFixed(1) : '0',
        job.timeToHire ?? 'N/A',
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-performance.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-muted small mb-3">Loading job performance data…</div>}

      <div className="mb-12">
        <h4 className="mb-2">Job Performance</h4>
        <p className="text-secondary-light mb-0">Track applications, conversion, and hires for each job role.</p>
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
              <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="form-select">
                {uniqueJobs.map(job => <option key={job}>{job}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Recruiter</label>
              <select value={selectedRecruiter} onChange={(e) => setSelectedRecruiter(e.target.value)} className="form-select">
                {uniqueRecruiters.map(recruiter => <option key={recruiter}>{recruiter}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Department</label>
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="form-select">
                {uniqueDepartments.map(dept => <option key={dept}>{dept}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-24 align-items-stretch">
        <div className="col-12 col-sm-6 col-lg-3 d-flex">
          <div className="card border shadow-none w-100">
            <div className="card-body p-16 d-flex align-items-center justify-content-between" style={{minHeight: '96px'}}>
              <div>
                <div className="text-secondary-light text-sm">Applications</div>
                <div className="h4 mb-0 text-primary-600">{kpis.applications}</div>
              </div>
              <Users className="text-primary-600" />
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 d-flex">
          <div className="card border shadow-none w-100">
            <div className="card-body p-16 d-flex align-items-center justify-content-between" style={{minHeight: '96px'}}>
              <div>
                <div className="text-secondary-light text-sm">Shortlisted</div>
                <div className="h4 mb-0 text-success">{kpis.shortlisted}</div>
              </div>
              <UserCheck className="text-success" />
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 d-flex">
          <div className="card border shadow-none w-100">
            <div className="card-body p-16 d-flex align-items-center justify-content-between" style={{minHeight: '96px'}}>
              <div>
                <div className="text-secondary-light text-sm">Interviews</div>
                <div className="h4 mb-0 text-warning">{kpis.interviews}</div>
              </div>
              <Calendar className="text-warning" />
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 d-flex">
          <div className="card border shadow-none w-100">
            <div className="card-body p-16 d-flex align-items-center justify-content-between" style={{minHeight: '96px'}}>
              <div>
                <div className="text-secondary-light text-sm">Hires</div>
                <div className="h4 mb-0 text-primary-600">{kpis.hires}</div>
              </div>
              <UserCheck className="text-primary-600" />
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 d-flex">
          <div className="card border shadow-none w-100">
            <div className="card-body p-16 d-flex align-items-center justify-content-between" style={{minHeight: '96px'}}>
              <div>
                <div className="text-secondary-light text-sm">Conversion</div>
                <div className="h4 mb-0 text-primary-600">{kpis.conversionRate}%</div>
              </div>
              <TrendingUp className="text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-24">
        <div className="col-12 col-lg-6">
          <div className="card border shadow-none h-100">
            <div className="card-body p-24">
              <h6 className="mb-3">Applications by Job Role</h6>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card border shadow-none h-100">
            <div className="card-body p-24">
              <h6 className="mb-3">Hiring Funnel</h6>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="horizontal" data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card border shadow-none h-100">
            <div className="card-body p-24">
              <h6 className="mb-3">Applications Trend (last 6 months with activity)</h6>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card border shadow-none h-100">
            <div className="card-body p-24">
              <h6 className="mb-3">Applications by Department</h6>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={departmentData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} dataKey="value">
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card border shadow-none mb-24">
        <div className="card-body p-24">
          <h6 className="mb-3">Job Performance Table</h6>
          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead>
                <tr>
                  <th>Job Role</th>
                  <th>Applications</th>
                  <th>Shortlisted</th>
                  <th>Interviews</th>
                  <th>Offers</th>
                  <th>Hires</th>
                  <th>Conversion %</th>
                  <th>Time-to-Hire</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((job) => (
                  <tr key={job.id}>
                    <td className="fw-medium">{job.jobRole}</td>
                    <td>{job.applications}</td>
                    <td>{job.shortlisted}</td>
                    <td>{job.interviews}</td>
                    <td>{job.offers}</td>
                    <td>{job.hires}</td>
                    <td>{job.applications ? ((job.hires / job.applications) * 100).toFixed(1) : '0.0'}%</td>
                    <td>{job.timeToHire != null ? `${job.timeToHire} days` : 'N/A'}</td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-secondary-light">No jobs match these filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card border shadow-none mb-24">
        <div className="card-body p-24">
          <h6 className="mb-3">Key Insights</h6>
          <div className="d-grid gap-2">
            {insights.length > 0 ? insights.map((insight, index) => (
              <div key={index} className="d-flex align-items-start gap-2">
                <span className="w-8-px h-8-px rounded-circle bg-primary-600 mt-1 flex-shrink-0"></span>
                <span className="text-secondary-light">{insight}</span>
              </div>
            )) : (
              <span className="text-secondary-light">Not enough data yet to generate insights.</span>
            )}
          </div>
        </div>
      </div>

      <div className="card border shadow-none">
        <div className="card-body p-24">
          <h6 className="mb-3">Export & Reports</h6>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={exportCsv}>
              <Download size={16} />
              <span>Download CSV</span>
            </button>
            {/* NOTE: PDF export and "Email Weekly Report" aren't backed by
                anything yet (no PDF generator or email-scheduling endpoint
                for this report) — left out rather than wired to nothing. */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPerformance;