import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiFileText, 
  FiCheckCircle, 
  FiXCircle, 
  FiMail, 
  FiBriefcase, 
  FiAlertCircle, 
  FiEye,
  FiUpload,
  FiRefreshCw,
  FiUsers,
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiUser
} from 'react-icons/fi';
import { BASE_URL } from "../../../shared/constants/api.config";
import { assessmentAPI } from "../../../shared/utils/api";
import Modal from '../../../shared/components/Modal';
import StatCard from '../../../shared/components/StatCard';

const ResumeScreening = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'candidates');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    experienceLevel: 'fresher'
  });
  const [errors, setErrors] = useState({});
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [loadedPreselectedCount, setLoadedPreselectedCount] = useState(0);
  const [preselectedCandidateIds, setPreselectedCandidateIds] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [screeningThreshold, setScreeningThreshold] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

  useEffect(() => {
    assessmentAPI
      .getPreselectedCandidates()
      .then((data) => {
        const ids = (data?.candidate_ids || []).map((id) => Number(id)).filter((n) => Number.isFinite(n));
        setPreselectedCandidateIds(ids);
      })
      .catch(() => {
        setPreselectedCandidateIds([]);
        setLoadedPreselectedCount(0);
      });
  }, []);

  useEffect(() => {
    if (!candidates || candidates.length === 0) return;
    if (!preselectedCandidateIds || preselectedCandidateIds.length === 0) return;
    if (selectedCandidateIds.length > 0) return;

    const matchedIds = candidates
      .map((c) => Number(c.id))
      .filter((id) => preselectedCandidateIds.includes(id));

    setSelectedCandidateIds(matchedIds);
    setLoadedPreselectedCount(matchedIds.length);
  }, [candidates, preselectedCandidateIds, selectedCandidateIds.length]);

  useEffect(() => {
    const loadScreeningConfig = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/api/resume/screening-config`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          const t = Number(data?.score_threshold);
          if (Number.isFinite(t)) setScreeningThreshold(t);
        }
      } catch (e) {
        console.warn('Could not load screening-config:', e);
      }
    };
    loadScreeningConfig();
  }, []);

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        setCandidates([]);
        setLoadingCandidates(false);
        return;
      }
      
      const response = await fetch(`${BASE_URL}/api/resume/candidates?limit=1000&show_all=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
        setSelectedCandidateIds((prev) => {
          const visibleIds = new Set((data || []).map((c) => c.id));
          return prev.filter((id) => visibleIds.has(id));
        });
      } else {
        setCandidates([]);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'candidates') {
      fetchCandidates();
    }
  }, [activeTab]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ file: 'Only PDF and DOCX files are allowed' });
        return;
      }
      setSelectedFile(file);
      setErrors({});
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedFile) newErrors.file = 'Please select a resume file';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    setUploadResult(null);

    const formDataToSend = new FormData();
    formDataToSend.append('file', selectedFile);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('experience_level', formData.experienceLevel);

    try {
      const response = await fetch(`${BASE_URL}/api/resume/process`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult(result);
        setShowResultModal(true);
        setSelectedFile(null);
        setFormData({ role: '', experienceLevel: 'fresher' });
        document.getElementById('resume-file-input').value = '';
      } else {
        const errorData = await response.json();
        setUploadResult({
          status: 'error',
          message: errorData.detail || 'Failed to process resume'
        });
        setShowResultModal(true);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult({
        status: 'error',
        message: 'Network error. Please check if backend is running.'
      });
      setShowResultModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  const getCandidateThreshold = (candidate) => {
    const threshold = Number(candidate?.threshold);
    if (Number.isFinite(threshold)) return threshold;
    if (Number.isFinite(screeningThreshold)) return screeningThreshold;
    return null;
  };

  const isCandidateShortlisted = (candidate) => {
    const stage = (candidate?.stage || '').toLowerCase();
    if (stage) return stage !== 'rejected';
    const th = getCandidateThreshold(candidate);
    if (th == null) return false;
    return Number(candidate?.score) >= th;
  };

  // Pagination
  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentCandidates = candidates.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    );
  };

  const allVisibleSelected = currentCandidates.length > 0 && 
    currentCandidates.every(c => selectedCandidateIds.includes(c.id));

  const handleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedCandidateIds(prev => prev.filter(id => !currentCandidates.some(c => c.id === id)));
    } else {
      const newIds = [...selectedCandidateIds];
      currentCandidates.forEach(c => {
        if (!newIds.includes(c.id)) newIds.push(c.id);
      });
      setSelectedCandidateIds(newIds);
    }
  };

  const handleAssignAssessment = async () => {
    if (selectedCandidateIds.length === 0) {
      alert('Please select at least one candidate to assign assessments.');
      return;
    }
    try {
      const selectedCandidates = candidates.filter((c) => selectedCandidateIds.includes(c.id));
      await assessmentAPI.savePreselectedCandidates(
        selectedCandidates.map((c) => c.id),
        selectedCandidates.map((c) => c.candidate_email).filter(Boolean)
      );
      navigate('/recruiter/assign-assessment');
    } catch (error) {
      console.error('Failed to prepare selected candidates:', error);
      alert('Failed to load selected candidates for assignment.');
    }
  };

  // Calculate stats
  const totalScreened = candidates.length;
  const shortlisted = candidates.filter((candidate) => isCandidateShortlisted(candidate)).length;
  const avgScore = candidates.length > 0 ?
    (candidates.reduce((acc, c) => acc + (c.score || 0), 0) / candidates.length).toFixed(1) :
    '0';

  if (loadingCandidates && activeTab === 'candidates' && candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
        <p className="text-gray-500 text-sm">Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
                <FiFileText className="text-gray-700 text-xl sm:text-2xl" />
                AI Resume Screening
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">View all candidates processed through AI resume screening</p>
            </div>
            <button
              onClick={fetchCandidates}
              disabled={loadingCandidates}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all w-full sm:w-auto"
            >
              <FiRefreshCw className={`h-4 w-4 ${loadingCandidates ? 'animate-spin' : ''}`} />
              {loadingCandidates ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <StatCard 
              title="Total Screened"
              value={totalScreened}
              subtitle="All candidates"
              icon="lucide:users"
              color="blue"
            />
            <StatCard 
              title="Shortlisted"
              value={shortlisted}
              subtitle="Passed screening"
              icon="lucide:award"
              color="green"
            />
            <StatCard 
              title="Avg Score"
              value={`${avgScore}%`}
              subtitle="Overall performance"
              icon="lucide:bar-chart-2"
              color="purple"
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow">
            <div className="border-b border-gray-100 px-3 sm:px-4">
              <div className="flex gap-3 sm:gap-4 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('candidates')}
                  className={`py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                    activeTab === 'candidates'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiEye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>View Candidates</span>
                  <span className="ml-1">({candidates.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                    activeTab === 'upload'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FiUpload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Screen Resume</span>
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'candidates' ? (
            <>
              {selectedCandidateIds.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-primary">
                      {selectedCandidateIds.length} candidate{selectedCandidateIds.length > 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={() => setSelectedCandidateIds([])}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  <button
                    onClick={handleAssignAssessment}
                    className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all w-full sm:w-auto"
                  >
                    <FiPlus className="h-4 w-4" />
                    Assign Assessment
                  </button>
                </div>
              )}

              {loadedPreselectedCount > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                  <span className="text-xs sm:text-sm text-amber-700 text-center sm:text-left">
                    Loaded {loadedPreselectedCount} candidates from Resume Screening selection.
                  </span>
                  <button
                    onClick={async () => {
                      try {
                        await assessmentAPI.clearPreselectedCandidates();
                      } catch (e) {
                        console.warn('Failed to clear preselected candidates:', e);
                      } finally {
                        setPreselectedCandidateIds([]);
                        setLoadedPreselectedCount(0);
                        setSelectedCandidateIds([]);
                      }
                    }}
                    className="text-xs sm:text-sm text-amber-700 hover:text-amber-800 underline"
                  >
                    Clear preselected
                  </button>
                </div>
              )}

              <div className="block md:hidden">
                {currentCandidates.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
                    <FiFileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-midnight_text mb-1">No Candidates Yet</h3>
                    <p className="text-sm text-gray-500">Start screening resumes to see candidates here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentCandidates.map((candidate) => (
                      <div key={candidate.id} className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedCandidateIds.includes(candidate.id)}
                              onChange={() => toggleCandidateSelection(candidate.id)}
                              className="rounded border-gray-300 text-primary focus:ring-primary mt-1 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-midnight_text text-sm truncate">{candidate.candidate_name || 'N/A'}</h3>
                              <p className="text-xs text-gray-500 truncate">{candidate.candidate_email || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-500 text-xs flex-shrink-0">Role:</span>
                            <span className="text-xs text-gray-700 truncate text-right">{candidate.role}</span>
                          </div>

                          <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-500 text-xs flex-shrink-0">Experience:</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                              {candidate.experience_level}
                            </span>
                          </div>

                          <div className="flex justify-between items-start gap-2">
                            <span className="text-gray-500 text-xs flex-shrink-0">Skills:</span>
                            <div className="flex flex-wrap gap-1 justify-end flex-1">
                              {candidate.candidate_skills?.split(',').slice(0, 2).map((skill, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                  {skill.trim()}
                                </span>
                              ))}
                              {candidate.candidate_skills?.split(',').length > 2 && (
                                <span className="text-xs text-gray-500">+{candidate.candidate_skills.split(',').length - 2}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-500 text-xs flex-shrink-0">Score:</span>
                            <div className="flex items-center gap-1">
                              <span className={`text-xs font-semibold ${isCandidateShortlisted(candidate) ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {Number(candidate.score || 0).toFixed(1)}%
                              </span>
                              {isCandidateShortlisted(candidate) ? (
                                <FiCheckCircle className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <FiXCircle className="h-3 w-3 text-rose-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-500 text-xs flex-shrink-0">Email:</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${candidate.email_sent === 'yes' ? 'bg-emerald-50 text-emerald-700' :
                                candidate.email_sent === 'no' ? 'bg-gray-100 text-gray-600' : 'bg-rose-50 text-rose-700'
                              }`}>
                              {candidate.email_sent === 'yes' ? 'Sent' : candidate.email_sent === 'no' ? 'Not Sent' : 'Failed'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-500 text-xs flex-shrink-0">Screened On:</span>
                            <div className="flex items-center gap-1">
                              <FiCalendar className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {new Date(candidate.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden md:block">
                {candidates.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
                    <FiFileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-midnight_text mb-1">No Candidates Yet</h3>
                    <p className="text-sm text-gray-500">Start screening resumes to see candidates here</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="w-10 px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={allVisibleSelected}
                                  onChange={handleSelectAllVisible}
                                  className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              </th>
                              <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">CANDIDATE</th>
                              <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">ROLE</th>
                              <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">EXPERIENCE</th>
                              <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">SKILLS</th>
                              <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">SCORE</th>
                              <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">EMAIL STATUS</th>
                              <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">SCREENED ON</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {currentCandidates.map((candidate) => (
                              <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedCandidateIds.includes(candidate.id)}
                                    onChange={() => toggleCandidateSelection(candidate.id)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <div>
                                    <p className="text-sm font-medium text-midnight_text">{candidate.candidate_name || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{candidate.candidate_email || 'N/A'}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <FiBriefcase className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{candidate.role}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                                    {candidate.experience_level}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {candidate.candidate_skills?.split(',').slice(0, 2).map((skill, idx) => (
                                      <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                        {skill.trim()}
                                      </span>
                                    ))}
                                    {candidate.candidate_skills?.split(',').length > 2 && (
                                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                                        +{candidate.candidate_skills.split(',').length - 2}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <span className={`text-sm font-semibold ${isCandidateShortlisted(candidate) ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {Number(candidate.score || 0).toFixed(1)}%
                                    </span>
                                    {isCandidateShortlisted(candidate) ? (
                                      <FiCheckCircle className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                      <FiXCircle className="h-4 w-4 text-rose-500" />
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                                    candidate.email_sent === 'yes' ? 'bg-emerald-50 text-emerald-700' :
                                    candidate.email_sent === 'no' ? 'bg-gray-100 text-gray-600' : 'bg-rose-50 text-rose-700'
                                  }`}>
                                    {candidate.email_sent === 'yes' ? 'Sent' : candidate.email_sent === 'no' ? 'Not Sent' : 'Failed'}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-xs text-gray-500">
                                    {new Date(candidate.created_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-gray-50/30 rounded-lg">
                      <div className="text-xs text-gray-500 text-center sm:text-left">
                        Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, candidates.length)} of {candidates.length} candidates
                      </div>
                      <div className="flex items-center gap-2 flex-wrap justify-center">
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
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4 sm:p-6 md:p-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-midnight_text mb-1">Screen a Resume</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Upload a resume to automatically extract information and calculate match score</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume File <span className="text-rose-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors">
                      <input
                        id="resume-file-input"
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="resume-file-input"
                        className="flex flex-col items-center justify-center gap-2 py-6 sm:py-8 px-4 cursor-pointer"
                      >
                        <FiUpload className="h-8 w-8 text-gray-400" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700 text-center break-words max-w-full px-2">
                          {selectedFile ? selectedFile.name : 'Click to upload PDF or DOCX'}
                        </span>
                        <span className="text-xs text-gray-400">Maximum file size: 10MB</span>
                      </label>
                    </div>
                    {errors.file && <p className="text-xs text-rose-600 mt-1">{errors.file}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role / Position <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Software Engineer, Data Analyst"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                      />
                      {errors.role && <p className="text-xs text-rose-600 mt-1">{errors.role}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.experienceLevel}
                        onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
                      >
                        <option value="fresher">Fresher / Entry Level</option>
                        <option value="junior">Junior (1-3 years)</option>
                        <option value="mid">Mid-Level (3-5 years)</option>
                        <option value="senior">Senior (5-10 years)</option>
                        <option value="lead">Lead / Principal (10+ years)</option>
                      </select>
                      {errors.experienceLevel && <p className="text-xs text-rose-600 mt-1">{errors.experienceLevel}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <FiRefreshCw className="h-4 w-4 animate-spin" />
                        Processing Resume...
                      </>
                    ) : (
                      <>
                        <FiUpload className="h-4 w-4" />
                        Screen Resume with AI
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          if (activeTab === 'candidates') {
            fetchCandidates();
          }
        }}
        title="Screening Result"
        size="lg"
      >
        {uploadResult && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            {uploadResult.status === 'error' ? (
              <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-lg border border-rose-100">
                <FiAlertCircle className="h-6 w-6 text-rose-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-rose-700">Processing Failed</h4>
                  <p className="text-sm text-rose-600">{uploadResult.message}</p>
                </div>
              </div>
            ) : (
              <>
                <div className={`flex items-center gap-3 p-4 rounded-lg border ${
                  uploadResult.status === 'shortlisted' 
                    ? 'bg-emerald-50 border-emerald-100' 
                    : 'bg-amber-50 border-amber-100'
                }`}>
                  {uploadResult.status === 'shortlisted' ? (
                    <FiCheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <FiAlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className={`font-semibold ${
                      uploadResult.status === 'shortlisted' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {uploadResult.status === 'shortlisted' ? 'Candidate Shortlisted!' : 'Candidate Rejected'}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-semibold text-midnight_text break-words">{uploadResult.candidate?.name || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-semibold text-midnight_text break-words">{uploadResult.candidate?.email || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm font-semibold text-midnight_text break-words">{uploadResult.role}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-semibold text-midnight_text capitalize">{uploadResult.experience_level}</p>
                  </div>
                </div>

                {uploadResult.candidate?.skills && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(uploadResult.candidate.skills)
                        ? uploadResult.candidate.skills
                        : uploadResult.candidate.skills.split(',')
                      ).map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary break-words">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Match Score</span>
                    <span className={`text-lg font-bold ${
                      uploadResult.score >= uploadResult.threshold ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {uploadResult.score.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        uploadResult.score >= uploadResult.threshold ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${uploadResult.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Threshold: {uploadResult.threshold}%</p>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <FiMail className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">
                    Email Status:{' '}
                    <span className={`font-medium ${
                      uploadResult.email_status === 'yes' ? 'text-emerald-600' : 
                      uploadResult.email_status === 'skipped' ? 'text-gray-500' : 'text-rose-600'
                    }`}>
                      {uploadResult.email_status === 'yes' ? 'Sent Successfully' : 
                       uploadResult.email_status === 'skipped' ? 'Skipped (Not Shortlisted)' : 'Failed'}
                    </span>
                  </span>
                </div>

                {uploadResult.jd_preview && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Generated Job Description (Preview)</p>
                    <div className="bg-gray-50 rounded-lg p-3 text-xs sm:text-sm text-gray-600 max-h-40 overflow-y-auto break-words">
                      {uploadResult.jd_preview}...
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResumeScreening;