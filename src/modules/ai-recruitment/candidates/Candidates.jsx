import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiRefreshCw, 
  FiAlertCircle, 
  FiMessageCircle, 
  FiMail, 
  FiCheckCircle, 
  FiXCircle, 
  FiFileText,
  FiSearch,
  FiDownload,
  FiTrash2,
  FiEye,
  FiUpload,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMoreVertical
} from 'react-icons/fi';
import CandidateProfilePage from './CandidateProfilePage';
import { BASE_URL, API_ENDPOINTS } from "../../../shared/constants/api.config";
import StatCard from '../../../shared/components/StatCard';
const CandidatesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    skills: '',
    job: '',
    stage: '',
    aiScreened: ''
  });
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

  const [candidates, setCandidates] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
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
        const transformedJobs = Array.isArray(data)
          ? data.map(job => ({
              id: job.id,
              title: (job.title || '').toString().trim(),
              department: job.department || '',
              status: job.status || ''
            }))
          : [];
        setJobsData(transformedJobs);
      }
    } catch (err) {
      console.error('Error fetching jobs for filters:', err);
    }
  };

  const [aiScreening, setAiScreening] = useState({
    isProcessing: false,
    currentIndex: 0,
    total: 0,
    results: [],
    showModal: false
  });

  const [aiScreenedEmails, setAiScreenedEmails] = useState(new Set());

  const fetchCandidates = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please login to view candidates');
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      const url = `${BASE_URL}/api/recruiter_dashboard/candidates`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        const transformedCandidates = data.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          role: candidate.role,
          skills: candidate.skills ? candidate.skills.split(',').map(s => s.trim()) : [],
          stage: candidate.stage || 'Applied',
          status: candidate.stage === 'Hired' ? 'Completed' : 
                  candidate.stage === 'Interview' ? 'In Progress' : 
                  candidate.stage === 'Offer' ? 'Awaiting Decision' : 'Pending',
          resume_url: candidate.resume_url,
          notes: candidate.notes || '',
          recruiter_comments: candidate.recruiter_comments || '',
          resume_screened: candidate.resume_screened || 'no',
          fullData: candidate
        }));
        
        setCandidates(transformedCandidates);
        setError(null);
      } else if (response.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (response.status === 403) {
        setError('You do not have permission to view candidates.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.detail || 'Failed to fetch candidates');
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAIScreenedCandidates = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/api/resume/candidates?limit=1000&show_all=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const screenedSet = new Set(
          data
            .filter(c => c.resume_screened === "yes" || c.resume_screened === "Yes")
            .map(c => c.candidate_email?.toLowerCase().trim())
            .filter(Boolean)
        );
        setAiScreenedEmails(screenedSet);
      }
    } catch (error) {
      console.error('Error fetching AI screened candidates:', error);
    }
  };

  useEffect(() => {
    if (candidates.length > 0) {
      const screenedEmails = new Set(
        candidates
          .filter(c => c.resume_screened === "yes" || c.resume_screened === "Yes")
          .map(c => c.email?.toLowerCase().trim())
          .filter(email => email)
      );
      setAiScreenedEmails(screenedEmails);
    }
  }, [candidates]);

  useEffect(() => {
    fetchCandidates();
    fetchAIScreenedCandidates();
    fetchJobs();
  }, []);

  useEffect(() => {
    const stageFromNav = location.state?.stage;
    if (stageFromNav) {
      setFilters(prev => ({ ...prev, stage: String(stageFromNav).toLowerCase() }));
    }
  }, [location.state?.stage]);

  const insights = {
    total: candidates.length,
    inInterview: candidates.filter(c => c.stage === 'Interview').length,
    offersSent: candidates.filter(c => c.stage === 'Offer').length,
    hired: candidates.filter(c => c.stage === 'Hired').length
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCandidates(currentCandidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (id) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const getStageColor = (stage) => {
    const colors = {
      'Applied': 'bg-primary/10 text-primary',
      'Screening': 'bg-amber-50 text-amber-700',
      'Interview': 'bg-indigo-50 text-indigo-700',
      'Offer': 'bg-primary/10 text-primary',
      'Hired': 'bg-emerald-50 text-emerald-700',
      'Rejected': 'bg-rose-50 text-rose-700'
    };
    return colors[stage] || 'bg-gray-100 text-gray-600';
  };

  const jobFilterOptions = React.useMemo(() => {
    const titlesFromJobs = jobsData.map(j => j.title).filter(Boolean);
    const titlesFromCandidates = candidates.map(c => (c.role || '').toString().trim()).filter(Boolean);
    const uniqueTitles = Array.from(new Set((titlesFromJobs.length ? titlesFromJobs : titlesFromCandidates)))
      .sort((a, b) => a.localeCompare(b));
    return uniqueTitles;
  }, [jobsData, candidates]);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkills = !filters.skills || candidate.skills.some(skill => 
      skill.toLowerCase().includes(filters.skills.toLowerCase())
    );
    
    const matchesJob = !filters.job || candidate.role.toLowerCase().trim() === filters.job.toLowerCase().trim();
    const matchesStage = !filters.stage || candidate.stage.toLowerCase() === filters.stage.toLowerCase();
    
    const isAiScreened = (candidate.resume_screened || '').toString().toLowerCase().trim() === 'yes' ||
      aiScreenedEmails.has(candidate.email?.toLowerCase().trim());
    const matchesAiScreened = !filters.aiScreened ||
      (filters.aiScreened === 'yes' ? isAiScreened : !isAiScreened);
    
    return matchesSearch && matchesSkills && matchesJob && matchesStage && matchesAiScreened;
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleExport = () => {
    const csv = [
      ['Candidate Name', 'Job Role', 'Skills', 'Stage', 'Status'],
      ...filteredCandidates.map(candidate => [
        candidate.name,
        candidate.role,
        candidate.skills.join(', '),
        candidate.stage,
        candidate.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'candidates-list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleViewCandidate = (candidateId) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setShowCandidateModal(true);
    }
  };

  const handleCloseCandidateModal = () => {
    setShowCandidateModal(false);
    setSelectedCandidate(null);
  };

  const handleAIScreening = async () => {
    const selectedCandidateData = candidates.filter(c => selectedCandidates.includes(c.id));
    const candidatesWithResumes = selectedCandidateData.filter(c => 
      c.resume_url && c.resume_url.trim() !== '' && c.resume_url !== 'null' && c.resume_url !== 'undefined'
    );
    
    if (candidatesWithResumes.length === 0) {
      alert('No resumes found for selected candidates.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const aiScreenedResponse = await fetch(`${BASE_URL}/api/resume/candidates?limit=1000&show_all=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const aiScreenedCandidates = aiScreenedResponse.ok ? await aiScreenedResponse.json() : [];
      
      const screenedEmails = new Set(
        aiScreenedCandidates
          .filter(c => c.resume_screened === "yes" || c.resume_screened === "Yes")
          .map(c => c.candidate_email?.toLowerCase().trim())
          .filter(email => email)
      );
      
      const notYetScreened = candidatesWithResumes.filter(c => !screenedEmails.has(c.email?.toLowerCase().trim()));
      
      if (notYetScreened.length === 0) {
        alert('All selected candidates have already been screened.');
        return;
      }
      
      candidatesWithResumes.length = 0;
      candidatesWithResumes.push(...notYetScreened);
    } catch (error) {
      console.error('Error checking already screened candidates:', error);
    }

    setAiScreening({
      isProcessing: true,
      currentIndex: 0,
      total: candidatesWithResumes.length,
      results: [],
      showModal: true
    });

    const results = [];
    for (let i = 0; i < candidatesWithResumes.length; i++) {
      const candidate = candidatesWithResumes[i];
      
      setAiScreening(prev => ({ ...prev, currentIndex: i + 1 }));

      try {
        const resumeResponse = await fetch(`${BASE_URL}/${candidate.resume_url}`);
        
        if (!resumeResponse.ok) {
          results.push({
            candidate: candidate.name,
            status: 'error',
            message: 'Resume file not found'
          });
          continue;
        }

        const resumeBlob = await resumeResponse.blob();
        const fileName = candidate.resume_url.split('/').pop();
        
        const formData = new FormData();
        formData.append('file', resumeBlob, fileName);
        formData.append('role', candidate.role);
        formData.append('experience_level', 'mid');
        formData.append('candidate_id', String(candidate.id));
        formData.append('candidate_email', candidate.email || '');

        const screeningResponse = await fetch(`${BASE_URL}/api/resume/process`, {
          method: 'POST',
          body: formData
        });

        if (screeningResponse.ok) {
          const result = await screeningResponse.json();
          results.push({
            candidateId: candidate.id,
            candidate: candidate.name,
            status: result.status,
            score: result.score,
            email_status: result.email_status,
            message: `Score: ${result.score.toFixed(1)}% - ${result.status}`
          });

          const nextStage = result.status === 'rejected' ? 'Rejected' : 'Applied';
          setCandidates(prev =>
            prev.map(c =>
              c.id === candidate.id
                ? {
                    ...c,
                    stage: nextStage,
                    status: nextStage === 'Rejected' ? 'Completed' : 'Pending',
                    resume_screened: 'yes'
                  }
                : c
            )
          );
        } else {
          results.push({
            candidate: candidate.name,
            status: 'error',
            message: 'Processing failed'
          });
        }
      } catch (error) {
        console.error(`Error processing ${candidate.name}:`, error);
        results.push({
          candidate: candidate.name,
          status: 'error',
          message: 'Network error'
        });
      }

      if (i < candidatesWithResumes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setAiScreening(prev => ({ ...prev, isProcessing: false, results: results }));
    setSelectedCandidates([]);
    await fetchCandidates();
    await fetchAIScreenedCandidates();
  };

  const closeAIScreeningModal = () => {
    setAiScreening({
      isProcessing: false,
      currentIndex: 0,
      total: 0,
      results: [],
      showModal: false
    });
  };

  const viewAIScreeningResults = () => {
    closeAIScreeningModal();
    navigate('/resume-screening', { state: { tab: 'candidates' } });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
        <p className="text-gray-500 text-sm">Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiUsers className="text-gray-700" />
              Candidates
            </h1>
            <p className="text-sm text-gray-500 mt-1">View, filter, and manage all job applicants</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={async () => {
                setRefreshing(true);
                await fetchCandidates();
                await fetchAIScreenedCandidates();
                await fetchJobs();
                setRefreshing(false);
              }}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
            >
              <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={async () => {
                try {
                  const response = await fetch(`${BASE_URL}/api/resume/sync-stages`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                  });
                  if (response.ok) {
                    alert('Stages synced successfully!');
                    await fetchCandidates();
                    await fetchAIScreenedCandidates();
                  } else {
                    alert('Failed to sync stages');
                  }
                } catch (error) {
                  console.error('Error syncing stages:', error);
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
            >
              <FiRefreshCw className="h-4 w-4" />
              Sync Stages
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-700">
            <FiAlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
            <span className="text-sm flex-1">{error}</span>
          </div>
        )}

        {!loading && candidates.length === 0 && !error && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 md:p-12 text-center">
            <FiUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-midnight_text mb-2">No Candidates Yet</h3>
            <p className="text-sm text-gray-500 mb-4">No candidates have applied to your jobs yet</p>
            <button
              onClick={() => navigate('/jobslist')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiFileText className="h-4 w-4" />
              View Jobs
            </button>
          </div>
        )}

        {!loading && candidates.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <StatCard 
                title="Total Candidates"
                value={insights.total}
                subtitle="All applicants"
                icon="lucide:users"
                color="blue"
              />
              <StatCard 
                title="In Interview"
                value={insights.inInterview}
                subtitle="Currently active"
                icon="lucide:message-circle"
                color="purple"
              />
              <StatCard 
                title="Offers Sent"
                value={insights.offersSent}
                subtitle="Awaiting response"
                icon="lucide:mail"
                color="yellow"
              />
              <StatCard 
                title="Hired"
                value={insights.hired}
                subtitle="Successfully joined"
                icon="lucide:check-circle"
                color="green"
              />
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                
                <select
                  value={filters.skills}
                  onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
                >
                  <option value="">All Skills</option>
                  <option value="react">React.js</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
                
                <select
                  value={filters.job}
                  onChange={(e) => setFilters(prev => ({ ...prev, job: e.target.value }))}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
                >
                  <option value="">All Jobs</option>
                  {jobFilterOptions.map((title) => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
                
                <select
                  value={filters.stage}
                  onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
                >
                  <option value="">All Stages</option>
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                </select>
                
                <select
                  value={filters.aiScreened}
                  onChange={(e) => setFilters(prev => ({ ...prev, aiScreened: e.target.value }))}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
                >
                  <option value="">AI Screened: All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
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

            {selectedCandidates.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary">
                    {selectedCandidates.length} candidate{selectedCandidates.length > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={() => setSelectedCandidates([])}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAIScreening}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <FiUpload className="h-4 w-4" />
                    AI Screening
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-sm font-medium transition-all">
                    <FiTrash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}

            <div className="block md:hidden space-y-3">
              {currentCandidates.map(candidate => (
                <div key={candidate.id} className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                        disabled={candidate.resume_screened === "yes"}
                        className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-midnight_text">{candidate.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{candidate.role}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMobileMenuOpen(mobileMenuOpen === candidate.id ? null : candidate.id)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <FiMoreVertical className="h-5 w-5" />
                      </button>
                      {mobileMenuOpen === candidate.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                          <button
                            onClick={() => {
                              handleViewCandidate(candidate.id);
                              setMobileMenuOpen(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <FiEye className="h-4 w-4" /> View
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Skills:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {candidate.skills.slice(0, 2).map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 2 && (
                          <span className="text-xs text-gray-500">+{candidate.skills.length - 2}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Resume:</span>
                      {candidate.resume_url && candidate.resume_url.trim() !== '' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                          <FiFileText className="h-3 w-3" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-600">
                          <FiXCircle className="h-3 w-3" />
                          Missing
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">AI Screened:</span>
                      {candidate.resume_screened === "yes" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                          <FiCheckCircle className="h-3 w-3" />
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                          <FiXCircle className="h-3 w-3" />
                          No
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Stage:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStageColor(candidate.stage)}`}>
                        {candidate.stage}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block bg-white rounded-lg border border-gray-100 shadow-deatail_shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="w-10 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.length === currentCandidates.length && currentCandidates.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">CANDIDATE</th>
                      <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">JOB ROLE</th>
                      <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">SKILLS</th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">RESUME</th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">AI SCREENED</th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">STAGE</th>
                      <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentCandidates.map(candidate => (
                      <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedCandidates.includes(candidate.id)}
                            onChange={() => handleSelectCandidate(candidate.id)}
                            disabled={candidate.resume_screened === "yes"}
                            className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-midnight_text">{candidate.name}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{candidate.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 3 && (
                              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                +{candidate.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {candidate.resume_url && candidate.resume_url.trim() !== '' ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                              <FiFileText className="h-3 w-3" />
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-rose-600">
                              <FiXCircle className="h-3 w-3" />
                              Missing
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {candidate.resume_screened === "yes" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                              <FiCheckCircle className="h-3 w-3" />
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                              <FiXCircle className="h-3 w-3" />
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStageColor(candidate.stage)}`}>
                            {candidate.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleViewCandidate(candidate.id)}
                            className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all"
                            title="View Profile"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-gray-50/30 rounded-lg">
              <div className="text-xs text-gray-500 text-center sm:text-left">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length} candidates
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
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
                      onClick={() => setCurrentPage(totalPages)}
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
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
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

        {aiScreening.showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeAIScreeningModal}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-deatail_shadow" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-midnight_text flex items-center gap-2">
                    <FiUpload className="h-5 w-5 text-primary" />
                    AI Resume Screening
                  </h3>
                  {!aiScreening.isProcessing && (
                    <button onClick={closeAIScreeningModal} className="text-gray-400 hover:text-gray-600">
                      <FiX className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-5">
                {aiScreening.isProcessing ? (
                  <>
                    <div className="text-center mb-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-3" />
                      <p className="text-sm font-medium text-midnight_text">
                        Processing {aiScreening.currentIndex} of {aiScreening.total} resumes...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">This may take a few minutes</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(aiScreening.currentIndex / aiScreening.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    {aiScreening.results.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Processed</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {aiScreening.results.map((result, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {result.status === 'shortlisted' && <FiCheckCircle className="h-4 w-4 text-emerald-500" />}
                                {result.status === 'rejected' && <FiXCircle className="h-4 w-4 text-amber-500" />}
                                {result.status === 'error' && <FiXCircle className="h-4 w-4 text-rose-500" />}
                                <span className="text-sm text-midnight_text">{result.candidate}</span>
                              </div>
                              <span className="text-xs text-gray-500">{result.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <FiCheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-midnight_text">Screening Complete!</h3>
                      <p className="text-sm text-gray-500">Processed {aiScreening.total} candidate(s)</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <div className="text-xl font-bold text-emerald-600">
                          {aiScreening.results.filter(r => r.status === 'shortlisted').length}
                        </div>
                        <div className="text-xs text-gray-500">Shortlisted</div>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-xl font-bold text-amber-600">
                          {aiScreening.results.filter(r => r.status === 'rejected').length}
                        </div>
                        <div className="text-xs text-gray-500">Rejected</div>
                      </div>
                      <div className="text-center p-3 bg-rose-50 rounded-lg">
                        <div className="text-xl font-bold text-rose-600">
                          {aiScreening.results.filter(r => r.status === 'error').length}
                        </div>
                        <div className="text-xs text-gray-500">Errors</div>
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {aiScreening.results.map((result, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {result.status === 'shortlisted' && <FiCheckCircle className="h-4 w-4 text-emerald-500" />}
                              {result.status === 'rejected' && <FiXCircle className="h-4 w-4 text-amber-500" />}
                              {result.status === 'error' && <FiXCircle className="h-4 w-4 text-rose-500" />}
                              <span className="text-sm font-medium text-midnight_text">{result.candidate}</span>
                            </div>
                            <p className="text-xs text-gray-500 ml-6">{result.message}</p>
                          </div>
                          {result.status === 'shortlisted' && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-600">Shortlisted</span>
                          )}
                          {result.status === 'rejected' && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-600">Rejected</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {!aiScreening.isProcessing && (
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-3 flex justify-end gap-2">
                  <button onClick={closeAIScreeningModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                    Close
                  </button>
                  <button onClick={viewAIScreeningResults} className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all">
                    View Results
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {showCandidateModal && selectedCandidate && (
          <CandidateProfilePage
            candidate={selectedCandidate}
            onClose={handleCloseCandidateModal}
          />
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;