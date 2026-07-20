import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Share, TrendingUp, Users, Target, Filter } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

const CHANNEL_COLORS = ['#0077B5', '#34D399', '#F59E0B', '#8B5CF6', '#EF4444', '#64748B', '#EC4899'];

const CandidateSourcing = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedRole !== 'All Roles') params.set('job_role', selectedRole);
      if (selectedDepartment !== 'All Departments') params.set('department', selectedDepartment);
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.ANALYTICS.CANDIDATE_SOURCING}?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load candidate sourcing data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load candidate sourcing data');
      toast.error('Failed to load candidate sourcing data from the server');
    } finally {
      setLoading(false);
    }
  }, [selectedRole, selectedDepartment]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const channelDistribution = data?.channelDistribution || [];
  const recruiterData = data?.recruiterData || [];

  const channelDistributionWithColor = useMemo(
    () => channelDistribution.map((c, i) => ({ ...c, color: CHANNEL_COLORS[i % CHANNEL_COLORS.length] })),
    [channelDistribution]
  );

  const channelComparisonData = useMemo(
    () => channelDistribution.map((c) => ({
      channel: c.name,
      Candidates: c.count,
      Interviewed: c.interviewed,
      Hired: c.hired,
    })),
    [channelDistribution]
  );

  const bestChannelForVolume = useMemo(() => {
    if (!channelDistribution.length) return null;
    return channelDistribution.reduce((a, b) => (b.count > a.count ? b : a));
  }, [channelDistribution]);

  const bestChannelForConversion = useMemo(() => {
    if (!channelDistribution.length) return null;
    return channelDistribution.reduce((a, b) => (b.conversionRate > a.conversionRate ? b : a));
  }, [channelDistribution]);

  const handleExport = () => {
    if (!channelDistribution.length) return;
    const headers = ['Channel', 'Candidates', 'Percentage', 'Interviewed', 'Hired', 'Conversion %'];
    const rows = channelDistribution.map((c) => [c.name, c.count, `${c.percentage}%`, c.interviewed, c.hired, `${c.conversionRate}%`]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidate-sourcing.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-12 d-flex align-items-start justify-content-between">
        <div>
          <h4 className="mb-2">Candidate Sourcing Analytics</h4>
          <p className="text-secondary-light mb-0">Track sourcing channels and conversion rates from real pipeline data.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={handleExport}>
            <Download size={16} /><span>Export</span>
          </button>
          <button className="btn btn-success d-inline-flex align-items-center gap-2" disabled title="Coming soon">
            <Share size={16} /><span>Share Report</span>
          </button>
        </div>
      </div>

      {loading && <div className="text-muted small mb-3">Loading candidate sourcing data…</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card border shadow-none mb-24">
        <div className="card-body p-24">
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-lg-4">
              <label className="form-label">Job Role</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Frontend Engineer"
                value={selectedRole === 'All Roles' ? '' : selectedRole}
                onChange={(e) => setSelectedRole(e.target.value.trim() === '' ? 'All Roles' : e.target.value)}
              />
              <small className="text-secondary-light">Exact job title match; filters server-side.</small>
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Technology"
                value={selectedDepartment === 'All Departments' ? '' : selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value.trim() === '' ? 'All Departments' : e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row g-3 mb-24 align-items-stretch p-24">
          <div className="col-12 col-sm-6 col-lg-4 d-flex">
            <div className="card border shadow-none w-100">
              <div className="card-body p-16 d-flex align-items-center justify-content-between" style={{ minHeight: '96px' }}>
                <div>
                  <div className="text-secondary-light text-sm">Total Candidates</div>
                  <div className="h4 mb-0">{data?.totalCandidates ?? '—'}</div>
                </div>
                <Users className="text-primary-600" />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4 d-flex">
            <div className="card border shadow-none w-100">
              <div className="card-body p-16 d-flex align-items-center justify-content-between" style={{ minHeight: '96px' }}>
                <div>
                  <div className="text-secondary-light text-sm">Unique Channels</div>
                  <div className="h4 mb-0 text-success">{data?.uniqueChannels ?? '—'}</div>
                </div>
                <Filter className="text-primary-600" />
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4 d-flex">
            <div className="card border shadow-none w-100">
              <div className="card-body p-16 d-flex align-items-center justify-content-between" style={{ minHeight: '96px' }}>
                <div>
                  <div className="text-secondary-light text-sm">Best Channel</div>
                  <div className="h6 mb-0 text-primary-600">{data?.bestChannel ?? '—'}</div>
                </div>
                <TrendingUp className="text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-24">
          <div className="alert alert-light border py-2 px-3 mb-24 small">
            Cost-per-hire isn't shown here — there's no recruiting-spend data in the system to calculate it from.
            Channels labeled "Unknown" are candidates that existed before source tracking was added.
          </div>
        </div>

        <div className="row g-3 mb-24 p-24">
          <div className="col-12 col-lg-6">
            <div className="card border shadow-none h-100">
              <div className="card-body p-24">
                <h6 className="mb-3">Candidate Distribution by Source</h6>
                <div style={{ height: '256px' }}>
                  {channelDistributionWithColor.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channelDistributionWithColor}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={80}
                          dataKey="count"
                        >
                          {channelDistributionWithColor.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} candidates`, props.payload.name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-secondary-light small">No data yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card border shadow-none h-100">
              <div className="card-body p-24">
                <h6 className="mb-3">Channel Performance Comparison</h6>
                <div style={{ height: '256px' }}>
                  {channelComparisonData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={channelComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="channel" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="Candidates" fill="#3B82F6" />
                        <Bar dataKey="Interviewed" fill="#10B981" />
                        <Bar dataKey="Hired" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-secondary-light small">No data yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-24 p-24">
          <div className="col-12">
            <div className="card border shadow-none h-100">
              <div className="card-body p-24">
                <h6 className="mb-3">Candidates Processed by Recruiter</h6>
                <div style={{ height: '256px' }}>
                  {recruiterData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={recruiterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="recruiter" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="candidates" name="Candidates" fill="#3B82F6" />
                        <Bar dataKey="interviews" name="Interviews" fill="#10B981" />
                        <Bar dataKey="hires" name="Hires" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-secondary-light small">No recruiter-linked applications yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card body shadow-none mb-24 p-24">
          <div className="card-body p-24">
            <h6 className="mb-3">Sourcing Performance Table</h6>
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Channel</th>
                    <th>Candidates</th>
                    <th>% of Total</th>
                    <th>Interviewed</th>
                    <th>Hired</th>
                    <th>Conversion %</th>
                  </tr>
                </thead>
                <tbody>
                  {channelDistribution.map((channel, index) => (
                    <tr key={index}>
                      <td className="fw-medium">{channel.name}</td>
                      <td>{channel.count}</td>
                      <td>{channel.percentage}%</td>
                      <td>{channel.interviewed}</td>
                      <td>{channel.hired}</td>
                      <td>
                        <span className={`badge ${channel.conversionRate >= 5 ? 'bg-success-subtle text-success-main' : 'bg-warning-subtle text-warning-main'}`}>
                          {channel.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!channelDistribution.length && !loading && (
                    <tr><td colSpan={6} className="text-center text-secondary-light">No sourcing data available yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {(bestChannelForConversion || bestChannelForVolume) && (
          <div className="row g-3 p-24">
            {bestChannelForConversion && (
              <div className="col-12 col-lg-6">
                <div className="card border shadow-none h-100">
                  <div className="card-body p-24 bg-success-subtle">
                    <h6 className="mb-2 text-success-main">Top Performer</h6>
                    <p className="mb-0 text-success">
                      {bestChannelForConversion.name} has the highest conversion rate at {bestChannelForConversion.conversionRate}%
                      ({bestChannelForConversion.hired} hired out of {bestChannelForConversion.count} candidates).
                    </p>
                  </div>
                </div>
              </div>
            )}
            {bestChannelForVolume && (
              <div className="col-12 col-lg-6">
                <div className="card border shadow-none h-100">
                  <div className="card-body p-24 bg-primary-50">
                    <h6 className="mb-2 text-primary-600">Volume Leader</h6>
                    <p className="mb-0 text-secondary-light">
                      {bestChannelForVolume.name} generates the most candidates ({bestChannelForVolume.count}) at a
                      {' '}{bestChannelForVolume.conversionRate}% conversion rate.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateSourcing;
