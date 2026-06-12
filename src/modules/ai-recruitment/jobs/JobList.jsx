import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBriefcase,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiSearch,
  FiDownload,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle,
  FiPlus,
  FiMapPin,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical
} from 'react-icons/fi';
import { BASE_URL, API_ENDPOINTS } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';
import StatCard from '../../../shared/components/StatCard';
const formatDisplayDate = (value) => {
  if (!value) return 'Not specified';
  const parsedDate = new Date(value);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  return value;
};

const JobsListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showJobDetailModal, setShowJobDetailModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

  // Backend integration state
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch jobs from backend
  const fetchJobs = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please login to view jobs');
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      const url = `${BASE_URL}${API_ENDPOINTS.JOBS.LIST}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const transformedJobs = data.map(job => ({
          id: job.id,
          title: job.title,
          department: job.department,
          recruiter: job.recruiter?.name || 'System',
          postedOn: new Date(job.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          status: job.status || 'Draft',
          applicants: job.applications?.length || 0,
          fullData: job
        }));

        setJobsData(transformedJobs);
        setError(null);
      } else if (response.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (response.status === 403) {
        setError('You do not have permission to view jobs.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.detail || 'Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // KPI data
  const kpis = {
    totalJobs: jobsData.length,
    openJobs: jobsData.filter(j => j.status === 'Open' || j.status === 'Active').length,
    closedJobs: jobsData.filter(j => j.status === 'Closed').length,
    draftJobs: jobsData.filter(j => j.status === 'Draft').length
  };

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleExport = () => {
    const csv = [
      ['Job Title', 'Department', 'Recruiter', 'Posted On', 'Status', 'Applicants'],
      ...filteredJobs.map(job => [
        job.title, job.department, job.recruiter, job.postedOn, job.status, job.applicants
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobs-list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleView = (jobId) => {
    const job = jobsData.find(j => j.id === jobId);
    setSelectedJob(job);
    setShowJobDetailModal(true);
  };

  const handleEdit = (jobId) => {
    const job = jobsData.find(j => j.id === jobId);
    if (job && job.fullData) {
      navigate('/jobs/new', {
        state: { editMode: true, jobData: job.fullData }
      });
    }
  };

  const handleDelete = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login to delete jobs');
      setShowDeleteModal(false);
      return;
    }

    try {
      const url = `${BASE_URL}${API_ENDPOINTS.JOBS.DELETE(jobToDelete)}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setJobsData(prevJobs => prevJobs.filter(job => job.id !== jobToDelete));
        setSelectedJobs(prevSelected => prevSelected.filter(id => id !== jobToDelete));
        setShowDeleteModal(false);
        setJobToDelete(null);
      } else if (response.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Failed to delete job');
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Network error');
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedJobs(currentJobs.map(job => job.id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (jobId) => {
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
    } else {
      setSelectedJobs([...selectedJobs, jobId]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
      case 'Active': return 'bg-emerald-50 text-emerald-700';
      case 'Closed': return 'bg-rose-50 text-rose-700';
      case 'On Hold': return 'bg-amber-50 text-amber-700';
      case 'Draft': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
        <p className="text-gray-500 text-sm">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiBriefcase className="text-gray-700" />
              Jobs List
            </h1>
            <p className="text-sm text-gray-500 mt-1">View, edit, and manage all job postings</p>
          </div>
          <button
            onClick={fetchJobs}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all md:w-auto"
          >
            <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-700">
            <FiAlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
            <span className="text-sm flex-1">{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobsData.length === 0 && !error && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 md:p-12 text-center">
            <FiBriefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-midnight_text mb-2">No Jobs Found</h3>
            <p className="text-sm text-gray-500 mb-4">You haven't created any jobs yet</p>
            <button
              onClick={() => navigate('/jobs/new')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiPlus className="h-4 w-4" />
              Create New Job
            </button>
          </div>
        )}

        {/* Main Content */}
        {!loading && jobsData.length > 0 && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <StatCard
                title="Total Jobs"
                value={kpis.totalJobs}
                subtitle="All created jobs"
                icon="lucide:briefcase"
                color="blue"
              />
              <StatCard
                title="Active Jobs"
                value={kpis.openJobs}
                subtitle="Currently open"
                icon="lucide:check-circle"
                color="green"
              />
              <StatCard
                title="Draft Jobs"
                value={kpis.draftJobs}
                subtitle="Not yet published"
                icon="lucide:file-text"
                color="yellow"
              />
              <StatCard
                title="Closed Jobs"
                value={kpis.closedJobs}
                subtitle="No longer accepting"
                icon="lucide:x-circle"
                color="purple"
              />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Open">Open</option>
                  <option value="Draft">Draft</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
                >
                  <FiDownload className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedJobs.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary">
                    {selectedJobs.length} job{selectedJobs.length > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={() => setSelectedJobs([])}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Unified Responsive Job List */}
            <div className="w-full bg-white rounded-lg border border-gray-100 shadow-deatail_shadow overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden lg:grid lg:grid-cols-12 bg-gray-50 border-b border-gray-100 px-6 py-3">
                <div className="col-span-4 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedJobs.length === currentJobs.length && currentJobs.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</span>
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recruiter</div>
                <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Posted On</div>
                <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
                <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider lg:text-center">Applicants</div>
                <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>

              {/* Job List */}
              <div className="divide-y divide-gray-100 bg-white">
                {currentJobs.map(job => (
                  <div key={job.id} className="flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-0 px-4 py-4 lg:px-6 hover:bg-gray-50 transition-colors items-start lg:items-center">

                    {/* Checkbox & Job Title */}
                    <div className="col-span-4 flex items-start gap-3 w-full">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.id)}
                        onChange={() => handleSelectJob(job.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary mt-1 lg:mt-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-midnight_text truncate">{job.title}</div>
                        <div className="text-xs text-gray-500 truncate">{job.department}</div>
                      </div>
                    </div>

                    {/* Recruiter */}
                    <div className="col-span-2 flex lg:block justify-between items-center w-full lg:w-auto mt-2 lg:mt-0">
                      <span className="lg:hidden text-xs font-medium text-gray-500 uppercase">Recruiter</span>
                      <div className="text-sm text-gray-600 truncate">{job.recruiter}</div>
                    </div>

                    {/* Posted On */}
                    <div className="col-span-2 flex lg:block justify-between items-center w-full lg:w-auto">
                      <span className="lg:hidden text-xs font-medium text-gray-500 uppercase">Posted</span>
                      <div className="text-sm text-gray-600 truncate">{job.postedOn}</div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex lg:block justify-between items-center w-full lg:w-auto">
                      <span className="lg:hidden text-xs font-medium text-gray-500 uppercase">Status</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>

                    {/* Applicants */}
                    <div className="col-span-1 flex lg:block justify-between items-center w-full lg:w-auto">
                      <span className="lg:hidden text-xs font-medium text-gray-500 uppercase">Applicants</span>
                      <div className="text-sm font-medium text-primary lg:text-center">{job.applicants}</div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex lg:justify-end w-full lg:w-auto mt-3 lg:mt-0 pt-3 lg:pt-0 border-t border-gray-100 lg:border-t-0">
                      <div className="flex items-center justify-end w-full gap-1.5">
                        <button onClick={() => handleView(job.id)} className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all" title="View">
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleEdit(job.id)} className="p-1.5 text-gray-500 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-all" title="Edit">
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(job.id)} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all" title="Delete">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-gray-50/30 rounded-lg">
              <div className="text-xs text-gray-500 text-center sm:text-left">
                Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-1 flex-wrap justify-center">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${currentPage === page
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
                  {totalPages > 3 && currentPage < totalPages - 1 && (
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${currentPage === totalPages
                        ? 'bg-primary text-white'
                        : 'border border-gray-200 hover:bg-white'
                        }`}
                    >
                      {totalPages}
                    </button>
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
          </>
        )}

        {/* Delete Confirmation Modal - Using predefined Modal component */}
        <Modal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          title="Confirm Delete"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-lg border border-rose-100">
              <FiTrash2 className="h-6 w-6 text-rose-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700 font-medium">Are you sure you want to delete this job posting?</p>
                <p className="text-xs text-gray-500 mt-1">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all"
              >
                Delete Job
              </button>
            </div>
          </div>
        </Modal>

        {/* Job Details Modal - Using predefined Modal component */}
        <Modal
          isOpen={showJobDetailModal}
          onClose={() => setShowJobDetailModal(false)}
          title="Job Details"
          size="2xl"
        >
          {selectedJob && (
            <div className="space-y-4">
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(selectedJob.status)}`}>
                  {selectedJob.status || 'Status not set'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                  {selectedJob.fullData?.department || selectedJob.department}
                </span>
                {selectedJob.fullData?.employment_type && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                    {selectedJob.fullData.employment_type}
                  </span>
                )}
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="break-words">{selectedJob.fullData?.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCalendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{formatDisplayDate(selectedJob.fullData?.posting_date || selectedJob.postedOn)}</span>
                </div>
                {selectedJob.fullData?.experience_level && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiBriefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{selectedJob.fullData.experience_level}</span>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Job Summary</h4>
                <p className="text-sm text-gray-600 leading-relaxed break-words">
                  {selectedJob.fullData?.description || 'No description provided.'}
                </p>
              </div>

              {/* Skills */}
              {selectedJob.fullData?.skills && selectedJob.fullData.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.fullData.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary break-words">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default JobsListPage;