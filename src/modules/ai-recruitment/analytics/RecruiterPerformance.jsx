import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  FiUsers, 
  FiCalendar, 
  FiClock, 
  FiTrendingUp, 
  FiAward, 
  FiDownload, 
  FiFilter, 
  FiEye, 
  FiArrowUp, 
  FiArrowDown, 
  FiTarget, 
  FiX, 
  FiRefreshCw, 
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';
import { BASE_URL } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';
import { FaTrophy } from 'react-icons/fa';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function RecruiterPerformance() {
  const navigate = useNavigate();
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const [selectedRecruiter, setSelectedRecruiter] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [jobRole, setJobRole] = useState('all');
  const [showDrillDown, setShowDrillDown] = useState(null);
  const [selectedRecruiterDetails, setSelectedRecruiterDetails] = useState(null);
  const [sortBy, setSortBy] = useState('hires');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch all data from backend
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please login to view recruiter performance');
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      setError(null);

      const recruitersResponse = await fetch(`${BASE_URL}/api/admin/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (recruitersResponse.ok) {
        const allUsers = await recruitersResponse.json();
        const recruiterUsers = Array.isArray(allUsers) 
          ? allUsers.filter(user => user.role?.toLowerCase() === 'recruiter' || user.role?.toLowerCase() === 'admin')
          : [];
        setRecruiters(recruiterUsers);
      }

      const jobsResponse = await fetch(`${BASE_URL}/api/jobs/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      }

      const candidatesResponse = await fetch(`${BASE_URL}/api/recruiter_dashboard/candidates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (candidatesResponse.ok) {
        const candidatesData = await candidatesResponse.json();
        setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDateFilter = () => {
    const days = parseInt(dateRange);
    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      return startDate;
    }
    return null;
  };

  const recruiterPerformanceData = useMemo(() => {
    if (!recruiters.length || !jobs.length || !candidates.length) {
      return [];
    }

    const startDate = getDateFilter();
    
    return recruiters.map(recruiter => {
      const recruiterJobs = jobs.filter(job => 
        job.recruiter_id === recruiter.id || 
        (job.recruiter && job.recruiter.id === recruiter.id)
      );

      const jobIds = recruiterJobs.map(job => job.id);

      let recruiterCandidates = candidates.filter(candidate => 
        jobIds.includes(candidate.job_id) || 
        (candidate.job && jobIds.includes(candidate.job.id))
      );

      if (startDate) {
        recruiterCandidates = recruiterCandidates.filter(candidate => {
          const candidateDate = new Date(candidate.created_at || candidate.applied_at);
          return candidateDate >= startDate;
        });
      }

      if (jobRole !== 'all') {
        recruiterCandidates = recruiterCandidates.filter(candidate => {
          const candidateJob = recruiterJobs.find(j => j.id === (candidate.job_id || candidate.job?.id));
          return candidateJob && candidateJob.role?.toLowerCase().includes(jobRole.toLowerCase());
        });
      }

      const candidatesAdded = recruiterCandidates.length;
      const interviewsScheduled = recruiterCandidates.filter(c => 
        c.stage === 'Interview' || c.stage === 'Offer' || c.stage === 'Hired'
      ).length;
      
      const hiredCandidates = recruiterCandidates.filter(c => c.stage === 'Hired');
      const hires = hiredCandidates.length;

      let timeToHire = 0;
      if (hiredCandidates.length > 0) {
        const timeToHireValues = hiredCandidates
          .map(c => {
            const appliedDate = new Date(c.created_at || c.applied_at);
            const hiredDate = new Date(c.updated_at || new Date());
            return Math.max(0, Math.floor((hiredDate - appliedDate) / (1000 * 60 * 60 * 24)));
          })
          .filter(days => days > 0);
        
        if (timeToHireValues.length > 0) {
          timeToHire = Math.round(
            timeToHireValues.reduce((sum, days) => sum + days, 0) / timeToHireValues.length
          );
        }
      }

      const offersSent = recruiterCandidates.filter(c => c.stage === 'Offer' || c.stage === 'Hired').length;
      const offerAcceptanceRate = offersSent > 0 
        ? Math.round((hires / offersSent) * 100) 
        : 0;

      const pipelineData = {
        applied: recruiterCandidates.filter(c => c.stage === 'Applied' || !c.stage).length,
        screening: recruiterCandidates.filter(c => c.stage === 'Screening').length,
        interview: recruiterCandidates.filter(c => c.stage === 'Interview').length,
        offer: recruiterCandidates.filter(c => c.stage === 'Offer').length,
        hired: hires
      };

      const monthlyHires = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      
      for (let i = 3; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const monthHired = hiredCandidates.filter(c => {
          const hiredDate = new Date(c.updated_at || c.created_at);
          return hiredDate >= monthDate && hiredDate <= monthEnd;
        }).length;

        const monthTimeToHire = monthHired > 0 
          ? Math.round(
              hiredCandidates
                .filter(c => {
                  const hiredDate = new Date(c.updated_at || c.created_at);
                  return hiredDate >= monthDate && hiredDate <= monthEnd;
                })
                .map(c => {
                  const appliedDate = new Date(c.created_at || c.applied_at);
                  const hiredDate = new Date(c.updated_at || c.created_at);
                  return Math.max(0, Math.floor((hiredDate - appliedDate) / (1000 * 60 * 60 * 24)));
                })
                .filter(days => days > 0)
                .reduce((sum, days, _, arr) => sum + days / arr.length, 0)
            )
          : 0;

        monthlyHires.push({
          month: months[monthDate.getMonth()],
          hires: monthHired,
          timeToHire: monthTimeToHire
        });
      }

      return {
        id: recruiter.id,
        name: recruiter.name || recruiter.email || 'Unknown',
        email: recruiter.email,
        candidatesAdded,
        interviewsScheduled,
        timeToHire,
        offerAcceptanceRate,
        hires,
        pipelineData,
        monthlyHires
      };
    }).filter(r => r.candidatesAdded > 0);
  }, [recruiters, jobs, candidates, dateRange, jobRole]);

  const filteredData = useMemo(() => {
    let data = [...recruiterPerformanceData];
    
    if (selectedRecruiter !== 'all') {
      data = data.filter(r => r.id === parseInt(selectedRecruiter));
    }

    data.sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });

    return data;
  }, [recruiterPerformanceData, selectedRecruiter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const totalMetrics = useMemo(() => {
    if (filteredData.length === 0) {
      return { activeJobs: 0, avgTimeToHire: 0, applicationsThisWeek: 0, totalHires: 0 };
    }

    const activeJobs = jobs.filter(job => 
      job.status === 'active' || job.status === 'Active' || job.status === 'Open'
    ).length;

    const avgTimeToHire = Math.round(
      filteredData.reduce((sum, r) => sum + (r.timeToHire || 0), 0) / filteredData.length
    );

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const applicationsThisWeek = candidates.filter(c => {
      const candidateDate = new Date(c.created_at || c.applied_at);
      return candidateDate >= weekAgo;
    }).length;

    const totalHires = filteredData.reduce((sum, r) => sum + (r.hires || 0), 0);

    return { activeJobs, avgTimeToHire, applicationsThisWeek, totalHires };
  }, [filteredData, jobs, candidates]);

  const uniqueJobRoles = useMemo(() => {
    const roles = new Set();
    jobs.forEach(job => {
      if (job.role) roles.add(job.role);
    });
    return Array.from(roles).sort();
  }, [jobs]);

  const barChartData = useMemo(() => filteredData.map(r => ({
    name: r.name.split(' ')[0],
    candidates: r.candidatesAdded,
    interviews: r.interviewsScheduled,
    hires: r.hires
  })), [filteredData]);

  const timeToHireData = useMemo(() => filteredData[0]?.monthlyHires || [], [filteredData]);

  const pipelineData = useMemo(() => {
    if (selectedRecruiter !== 'all' && filteredData.length === 1) {
      return Object.entries(filteredData[0].pipelineData).map(([stage, count]) => ({
        name: stage.charAt(0).toUpperCase() + stage.slice(1),
        value: count
      }));
    }
    return [
      { name: 'Applied', value: filteredData.reduce((sum, r) => sum + (r.pipelineData?.applied || 0), 0) },
      { name: 'Screening', value: filteredData.reduce((sum, r) => sum + (r.pipelineData?.screening || 0), 0) },
      { name: 'Interview', value: filteredData.reduce((sum, r) => sum + (r.pipelineData?.interview || 0), 0) },
      { name: 'Offer', value: filteredData.reduce((sum, r) => sum + (r.pipelineData?.offer || 0), 0) },
      { name: 'Hired', value: filteredData.reduce((sum, r) => sum + (r.pipelineData?.hired || 0), 0) }
    ];
  }, [selectedRecruiter, filteredData]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'desc' ? <FiArrowDown className="h-3 w-3 inline ml-1" /> : <FiArrowUp className="h-3 w-3 inline ml-1" />;
  };

  const exportRecruiterDetails = (details) => {
    if (!details) return;
    const csvEscape = (val) => {
      if (val === null || val === undefined) return '""';
      return '"' + String(val).replace(/"/g, '""') + '"';
    };

    const parts = [];
    parts.push('Metric,Value');
    parts.push(['Name', details.name].map(csvEscape).join(','));
    parts.push(['Candidates', details.candidatesAdded].map(csvEscape).join(','));
    parts.push(['Interviews', details.interviewsScheduled].map(csvEscape).join(','));
    parts.push(['Avg Time To Hire (days)', details.timeToHire].map(csvEscape).join(','));
    parts.push(['Offer Acceptance Rate (%)', details.offerAcceptanceRate].map(csvEscape).join(','));
    parts.push(['Hires', details.hires].map(csvEscape).join(','));

    const csv = parts.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const fileNameSafe = details.name ? details.name.replace(/[^a-z0-9-_\. ]/gi, '_') : 'recruiter';
    const a = document.createElement('a');
    a.href = url;
    a.download = `recruiter-${fileNameSafe}-details.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportReport = () => {
    const csvEscape = (val) => {
      if (val === null || val === undefined) return '""';
      return '"' + String(val).replace(/"/g, '""') + '"';
    };

    const parts = [];
    parts.push(`Filters,Date Range=${dateRange},Recruiter=${selectedRecruiter},JobRole=${jobRole}`);
    parts.push('');
    parts.push('Summary,Value');
    parts.push(['Total Recruiters', filteredData.length].map(csvEscape).join(','));
    parts.push(['Total Candidates (sum)', filteredData.reduce((s, r) => s + r.candidatesAdded, 0)].map(csvEscape).join(','));
    parts.push(['Total Hires (sum)', filteredData.reduce((s, r) => s + r.hires, 0)].map(csvEscape).join(','));
    parts.push('');
    parts.push('Recruiter,Candidates,Interviews,TimeToHire,OfferAcceptanceRate,Hires');
    filteredData.forEach(r => {
      parts.push([
        r.name,
        r.candidatesAdded,
        r.interviewsScheduled,
        r.timeToHire,
        r.offerAcceptanceRate,
        r.hires
      ].map(csvEscape).join(','));
    });

    const csv = parts.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date().toISOString().slice(0,19).replace(/[:T]/g, '-');
    a.download = `recruiter-report-${now}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
        <p className="text-gray-500 text-sm">Loading recruiter performance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-700">
          <FiAlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
          <div className="flex-1 text-sm">{error}</div>
          <button onClick={fetchData} className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-all">
            <FiRefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiUsers className="text-gray-700 text-xl sm:text-2xl" />
              Recruiter Performance
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Track performance and efficiency of recruiters</p>
          </div>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all w-full sm:w-auto"
          >
            <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Active Jobs</p>
                <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{totalMetrics.activeJobs}</p>
                <p className="text-xs text-gray-400 mt-1">Open or active</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FiTarget className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Avg. Time-to-Hire</p>
                <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{totalMetrics.avgTimeToHire} days</p>
                <p className="text-xs text-gray-400 mt-1">Across selected range</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <FiClock className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Applications This Week</p>
                <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{totalMetrics.applicationsThisWeek}</p>
                <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FiCalendar className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Total Hires</p>
                <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{totalMetrics.totalHires}</p>
                <p className="text-xs text-gray-400 mt-1">In current view</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <FaTrophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Date range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 6 months</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Recruiter</label>
              <select
                value={selectedRecruiter}
                onChange={(e) => setSelectedRecruiter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="all">All Recruiters</option>
                {recruiterPerformanceData.map((recruiter) => (
                  <option key={recruiter.id} value={recruiter.id}>
                    {recruiter.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-semibold mb-1">Job role</label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
              >
                <option value="all">All Job Roles</option>
                {uniqueJobRoles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={exportReport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
              >
                <FiDownload className="h-4 w-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
            <FiUsers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-midnight_text mb-1">No Data Available</h3>
            <p className="text-sm text-gray-500">No recruiter performance data found for the selected filters.</p>
          </div>
        ) : (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
                <h6 className="font-semibold text-midnight_text mb-3">Candidates Processed by Recruiter</h6>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="candidates" fill="#3b82f6" name="Candidates" />
                    <Bar dataKey="interviews" fill="#10b981" name="Interviews" />
                    <Bar dataKey="hires" fill="#f59e0b" name="Hires" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
                <h6 className="font-semibold text-midnight_text mb-3">Time-to-Hire Trend</h6>
                {timeToHireData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={timeToHireData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="timeToHire" stroke="#3b82f6" strokeWidth={2} name="Time to Hire (days)" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-400 py-8">No time-to-hire data available</div>
                )}
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
                <h6 className="font-semibold text-midnight_text mb-3">Pipeline Distribution</h6>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie 
                      data={pipelineData} 
                      cx="50%" 
                      cy="50%" 
                      labelLine={false} 
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} 
                      outerRadius={80} 
                      dataKey="value"
                    >
                      {pipelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
                <h6 className="font-semibold text-midnight_text mb-3">Top Performers</h6>
                <div className="space-y-2">
                  {filteredData.slice(0, 3).map((recruiter, index) => (
                    <div key={recruiter.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-midnight_text truncate">{recruiter.name}</p>
                        <p className="text-xs text-gray-500">{recruiter.hires} hires • {recruiter.timeToHire}d avg</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-600">{recruiter.offerAcceptanceRate}%</p>
                        <p className="text-xs text-gray-400">accept</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recruiter Comparison Table */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/30">
                <h6 className="font-semibold text-midnight_text">Recruiter Comparison</h6>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Recruiter</th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3 cursor-pointer" onClick={() => handleSort('candidatesAdded')}>
                        Candidates Added {getSortIcon('candidatesAdded')}
                      </th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3 cursor-pointer" onClick={() => handleSort('interviewsScheduled')}>
                        Interviews {getSortIcon('interviewsScheduled')}
                      </th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3 cursor-pointer" onClick={() => handleSort('hires')}>
                        Hires {getSortIcon('hires')}
                      </th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3 cursor-pointer" onClick={() => handleSort('timeToHire')}>
                        Time-to-Hire {getSortIcon('timeToHire')}
                      </th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3 cursor-pointer" onClick={() => handleSort('offerAcceptanceRate')}>
                        Offer % {getSortIcon('offerAcceptanceRate')}
                      </th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentData.map((recruiter) => (
                      <tr key={recruiter.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                              {recruiter.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <span className="text-sm font-medium text-midnight_text">{recruiter.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-midnight_text">{recruiter.candidatesAdded}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-midnight_text">{recruiter.interviewsScheduled}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                            {recruiter.hires}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-semibold text-midnight_text">{recruiter.timeToHire} days</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="flex-1 max-w-[80px] bg-gray-200 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${recruiter.offerAcceptanceRate}%` }} />
                            </div>
                            <span className="text-sm font-semibold text-midnight_text">{recruiter.offerAcceptanceRate}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => setSelectedRecruiterDetails(recruiter)} 
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:text-primary hover:border-primary transition-all"
                          >
                            <FiEye className="h-3.5 w-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                <div className="text-xs text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} recruiters
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm rounded-lg transition-all ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'border border-gray-200 hover:bg-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    {totalPages > 3 && currentPage > 2 && (
                      <span className="px-2 py-1 text-sm text-gray-500">...</span>
                    )}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                  <select
                    value={itemsPerPage}
                    onChange={e => handleItemsPerPageChange(Number(e.target.value))}
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg bg-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recruiter Details Modal */}
      <Modal
        isOpen={!!selectedRecruiterDetails}
        onClose={() => setSelectedRecruiterDetails(null)}
        title="Recruiter Performance Details"
        size="xl"
      >
        {selectedRecruiterDetails && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-primary">{selectedRecruiterDetails.candidatesAdded}</div>
                <div className="text-xs text-gray-500">Candidates</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-emerald-600">{selectedRecruiterDetails.interviewsScheduled}</div>
                <div className="text-xs text-gray-500">Interviews</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-amber-600">{selectedRecruiterDetails.timeToHire}</div>
                <div className="text-xs text-gray-500">Days Avg</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-primary">{selectedRecruiterDetails.offerAcceptanceRate}%</div>
                <div className="text-xs text-gray-500">Acceptance</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-emerald-600">{selectedRecruiterDetails.hires}</div>
                <div className="text-xs text-gray-500">Hires</div>
              </div>
            </div>

            <div>
              <h6 className="font-semibold text-midnight_text mb-3">Pipeline Breakdown</h6>
              <div className="space-y-2">
                {Object.entries(selectedRecruiterDetails.pipelineData).map(([stage, count]) => {
                  const percentage = selectedRecruiterDetails.candidatesAdded > 0
                    ? Math.round((count / selectedRecruiterDetails.candidatesAdded) * 100)
                    : 0;
                  return (
                    <div key={stage} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm capitalize text-gray-600 w-20">{stage}:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[200px]">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-midnight_text">
                        {count} <span className="text-xs text-gray-500">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedRecruiterDetails.monthlyHires && selectedRecruiterDetails.monthlyHires.length > 0 && (
              <div>
                <h6 className="font-semibold text-midnight_text mb-3">Monthly Performance</h6>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={selectedRecruiterDetails.monthlyHires}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hires" fill="#3b82f6" name="Hires" />
                    <Bar dataKey="timeToHire" fill="#10b981" name="Time to Hire (days)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h6 className="font-semibold text-midnight_text mb-3">Performance Insights</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-sm text-gray-600">
                    <strong>Conversion Rate:</strong> {
                      selectedRecruiterDetails.candidatesAdded > 0
                        ? Math.round((selectedRecruiterDetails.hires / selectedRecruiterDetails.candidatesAdded) * 100)
                        : 0
                    }% from candidates to hires
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p className="text-sm text-gray-600">
                    <strong>Interview Success:</strong> {
                      selectedRecruiterDetails.interviewsScheduled > 0
                        ? Math.round((selectedRecruiterDetails.hires / selectedRecruiterDetails.interviewsScheduled) * 100)
                        : 0
                    }% of interviews lead to hires
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-sm text-gray-600">
                    <strong>Efficiency:</strong> {
                      selectedRecruiterDetails.timeToHire < 15 ? 'Above Average' : 
                      selectedRecruiterDetails.timeToHire === 15 ? 'Average' : 'Below Average'
                    } time-to-hire
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <p className="text-sm text-gray-600">
                    <strong>Offer Success:</strong> {
                      selectedRecruiterDetails.offerAcceptanceRate > 80 ? 'Excellent' : 
                      selectedRecruiterDetails.offerAcceptanceRate > 70 ? 'Good' : 'Needs Improvement'
                    } offer acceptance rate
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setSelectedRecruiterDetails(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                Close
              </button>
              <button
                onClick={() => exportRecruiterDetails(selectedRecruiterDetails)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
              >
                <FiDownload className="h-4 w-4" />
                Export Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}