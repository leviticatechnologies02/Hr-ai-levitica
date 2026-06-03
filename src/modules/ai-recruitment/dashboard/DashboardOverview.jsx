import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';
import CandidateDetailsView from './components/CandidateDetailsView';
import { BASE_URL } from '../../../shared/constants/api.config';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalJobs: 0,
      totalCandidates: 0,
      totalApplications: 0,
      activeJobs: 0,
      hiredCandidates: 0,
      pendingApplications: 0
    },
    recentApplications: [],
    stageDistribution: {},
    loading: true,
    error: null
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setDashboardData(prev => ({ ...prev, error: 'Please login to view dashboard', loading: false }));
      return;
    }

    try {
      setRefreshing(true);
      const candidatesResponse = await fetch(`${BASE_URL}/api/recruiter_dashboard/candidates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const jobsResponse = await fetch(`${BASE_URL}/api/jobs/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (candidatesResponse.ok && jobsResponse.ok) {
        const candidates = await candidatesResponse.json();
        const jobs = await jobsResponse.json();

        const stats = {
          totalJobs: jobs.length,
          totalCandidates: candidates.length,
          totalApplications: candidates.length,
          activeJobs: jobs.filter(job => job.status === 'Active').length,
          hiredCandidates: candidates.filter(c => c.stage === 'Hired').length,
          pendingApplications: candidates.filter(c => c.stage === 'Applied').length
        };

        const stageDistribution = {};
        candidates.forEach(candidate => {
          stageDistribution[candidate.stage] = (stageDistribution[candidate.stage] || 0) + 1;
        });

        const recentApplications = candidates.slice(0, 5).map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          role: candidate.role,
          stage: candidate.stage,
          appliedAt: new Date().toISOString(),
          skills: candidate.skills,
          fullData: candidate
        }));

        setDashboardData({
          stats,
          recentApplications,
          stageDistribution,
          loading: false,
          error: null
        });
      } else {
        setDashboardData(prev => ({
          ...prev,
          error: 'Failed to fetch dashboard data',
          loading: false
        }));
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setDashboardData(prev => ({
        ...prev,
        error: 'Network error. Please check if backend is running.',
        loading: false
      }));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stageColor = (stage) => {
    const map = {
      Applied: 'primary',
      Screening: 'amber-500',
      Interview: 'indigo-500',
      Offer: 'primary',
      Hired: 'emerald-500',
      Rejected: 'rose-500'
    };
    return map[stage] || 'gray-400';
  };

  const stageBadgeClass = (stage) => {
    const map = {
      Applied: 'bg-primary/10 text-primary',
      Screening: 'bg-amber-50 text-amber-700',
      Interview: 'bg-indigo-50 text-indigo-700',
      Offer: 'bg-primary/10 text-primary',
      Hired: 'bg-emerald-50 text-emerald-700',
      Rejected: 'bg-rose-50 text-rose-700'
    };
    return map[stage] || 'bg-gray-50 text-gray-600';
  };

  const handleViewCandidate = (application) => {
    if (!application) return;
    const candidateData = application.fullData
      ? {
          id: application.fullData.id,
          name: application.fullData.name,
          email: application.fullData.email,
          role: application.fullData.role,
          skills: application.fullData.skills,
          stage: application.fullData.stage,
          status: application.fullData.stage === 'Hired'
            ? 'Completed'
            : application.fullData.stage === 'Interview'
            ? 'In Progress'
            : application.fullData.stage === 'Offer'
            ? 'Awaiting Decision'
            : 'Pending',
          resume_url: application.fullData.resume_url,
          notes: application.fullData.notes,
          recruiter_comments: application.fullData.recruiter_comments,
          resume_screened: application.fullData.resume_screened || 'no',
          fullData: application.fullData
        }
      : application;

    setSelectedCandidate(candidateData);
    setShowCandidateModal(true);
  };

  const handleCloseCandidateModal = () => {
    setShowCandidateModal(false);
    setSelectedCandidate(null);
  };

  if (dashboardData.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-700">
          <Icon icon="heroicons:exclamation-circle" className="h-5 w-5 text-rose-500" />
          <div className="flex-1 text-sm">{dashboardData.error}</div>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, recentApplications, stageDistribution } = dashboardData;
  const totalCandidatesForPct = stats.totalCandidates || 1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-midnight_text">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Recruitment overview</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
        >
          <Icon icon="heroicons:arrow-path" className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-deatail_shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Jobs</p>
              <p className="text-2xl font-bold text-midnight_text mt-1">{stats.totalJobs}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.activeJobs} active</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon icon="heroicons:briefcase" className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-deatail_shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Candidates</p>
              <p className="text-2xl font-bold text-midnight_text mt-1">{stats.totalCandidates}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.pendingApplications} pending</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Icon icon="heroicons:user-group" className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-deatail_shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Applications</p>
              <p className="text-2xl font-bold text-midnight_text mt-1">{stats.totalApplications}</p>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Icon icon="heroicons:document-text" className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-deatail_shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Hired</p>
              <p className="text-2xl font-bold text-midnight_text mt-1">{stats.hiredCandidates}</p>
              <p className="text-xs text-gray-400 mt-1">This month</p>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Icon icon="heroicons:check-badge" className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pipeline & Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pipeline */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-deatail_shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-midnight_text">Pipeline Overview</h2>
              <Icon icon="heroicons:chart-bar" className="h-4 w-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              {Object.entries(stageDistribution).map(([stage, count]) => {
                const color = stageColor(stage);
                return (
                  <div key={stage}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">{stage}</span>
                      <span className="font-semibold text-midnight_text">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`bg-${color} h-full rounded-full`}
                        style={{ width: `${(count / totalCandidatesForPct) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(stageDistribution).length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No pipeline data available</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-deatail_shadow">
            <h2 className="text-base font-semibold text-midnight_text mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Create Job', path: '/jobs/new', icon: 'heroicons:plus' },
                { label: 'View Candidates', path: '/candidates', icon: 'heroicons:eye' },
                { label: 'AI Screening', path: '/resume-screening', icon: 'heroicons:arrow-up-tray' },
                { label: 'Job Listings', path: '/jobslist', icon: 'heroicons:briefcase' },
              ].map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-primary/10 rounded-lg text-sm text-gray-700 hover:text-primary transition-all"
                >
                  <Icon icon={action.icon} className="h-4 w-4" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sourcing Metrics */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-deatail_shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon icon="heroicons:calendar" className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-midnight_text">Weekly Metrics</h2>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Screening Accuracy</p>
                  <p className="text-sm font-medium text-midnight_text">Match Rate</p>
                </div>
                <span className="text-lg font-bold text-emerald-600">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Avg. Match Rating</p>
                  <p className="text-sm font-medium text-midnight_text">Candidate Grade</p>
                </div>
                <span className="text-lg font-bold text-primary">84%</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Time to Hire</p>
                  <p className="text-sm font-medium text-midnight_text">Avg. Duration</p>
                </div>
                <span className="text-sm font-bold text-midnight_text">4.8 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-midnight_text">Recent Applications</h2>
            <p className="text-xs text-gray-500">Latest candidates</p>
          </div>
          <button
            onClick={() => navigate('/candidates')}
            className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            View All
            <Icon icon="heroicons:chevron-right" className="h-3 w-3" />
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {recentApplications.map((application) => (
            <div
              key={application.id}
              className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {application.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-midnight_text">{application.name}</p>
                  <p className="text-xs text-gray-500">{application.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${stageBadgeClass(application.stage)}`}>
                  {application.stage}
                </span>
                <button
                  onClick={() => handleViewCandidate(application)}
                  className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-all"
                >
                  <Icon icon="heroicons:eye" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {recentApplications.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              No recent applications
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showCandidateModal}
        onClose={handleCloseCandidateModal}
        title="Candidate Profile"
        size="2xl"
      >
        {selectedCandidate && (
          <CandidateDetailsView
            candidate={selectedCandidate}
            onClose={handleCloseCandidateModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default DashboardOverview;