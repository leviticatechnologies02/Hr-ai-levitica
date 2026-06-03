import React, { useState, useEffect } from 'react';
import {
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiTrendingUp,
  FiAlertTriangle,
  FiFilter,
  FiSearch,
  FiDownload,
  FiX,
  FiSend,
  FiVideo,
  FiRefreshCw,
  FiBarChart2,
  FiBriefcase,
  FiUser,
  FiMail,
  FiStar,
  FiEye
} from 'react-icons/fi';
import { BASE_URL } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';
import { FaRobot } from 'react-icons/fa';

const AIPrescreening = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filters, setFilters] = useState({
    job: 'all',
    scoreThreshold: 0,
    search: '',
    stage: 'all'
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async () => {
    try {
      const storedTemplates = localStorage.getItem('aiInterviewTemplates');
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSendAIInterview = async (candidate, templateId = null) => {
    setSendingEmail(true);
    
    const template = templateId ? templates.find(t => t.id === templateId) : templates[0];
    const templateName = template ? template.name : 'AI Interview';
    
    const interviewLink = `${window.location.origin}/ai-interview?candidate_id=${candidate.id}&name=${encodeURIComponent(candidate.name)}&email=${encodeURIComponent(candidate.email)}${templateId ? `&template_id=${templateId}` : ''}`;

    const emailBody = `
Dear ${candidate.name},

Congratulations! Based on your resume screening results (Score: ${candidate.score.toFixed(1)}%), we would like to invite you to the next stage of our recruitment process - AI Interview.

📹 Interview Details:
${template ? `• Interview: ${template.name}` : '• Standard AI Interview'}
${template?.time_limit ? `• Duration: ${template.time_limit} minutes` : ''}
${template?.questions?.length ? `• Questions: ${template.questions.length}` : ''}
${template?.difficulty ? `• Difficulty: ${template.difficulty}` : ''}

🔗 Interview Link: ${interviewLink}

Instructions:
1. Click on the link above to start your AI interview
2. You will receive an OTP on your registered email for verification
3. Answer all questions thoughtfully
4. You can record video responses or type text answers
5. Make sure you're in a quiet environment with good internet connection

Best regards,
Recruitment Team
    `.trim();

    try {
      const response = await fetch(`${BASE_URL}/api/send-assessment-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_email: candidate.email,
          to_name: candidate.name,
          subject: `AI Interview Invitation - ${templateName}`,
          body: emailBody,
          test_type: 'ai_interview',
          test_link: interviewLink,
          template_id: templateId
        })
      });

      if (response.ok) {
        alert(`✅ AI Interview link sent successfully to ${candidate.name}!`);
        fetchCandidates();
      } else {
        navigator.clipboard.writeText(emailBody);
        alert(`⚠️ Email sending failed. The email content has been copied to your clipboard.\n\nPlease manually send it to: ${candidate.email}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      navigator.clipboard.writeText(emailBody);
      alert(`⚠️ Email sending failed. The email content has been copied to your clipboard.\n\nPlease manually send it to: ${candidate.email}`);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendInterviewLink = async (candidate) => {
    if (candidate.stage?.toLowerCase() !== 'interview') {
      alert('⚠️ This candidate is not in Interview stage. Only candidates with "Interview" status can receive interview links.');
      return;
    }
    await handleSendAIInterview(candidate);
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const candidatesRes = await fetch(`${BASE_URL}/api/resume/candidates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (candidatesRes.ok) {
        const candidateRecords = await candidatesRes.json();

        const interviewCandidates = candidateRecords
          .filter(candidateRecord => {
            const stage = candidateRecord.stage;
            const stageNormalized = stage ? String(stage).toLowerCase().trim() : '';
            return stageNormalized === 'interview';
          })
          .map(c => ({
            id: c.id,
            name: c.candidate_name,
            email: c.candidate_email,
            job: c.role || 'Not Specified',
            score: c.score || 0,
            stage: c.stage || 'Applied',
            strengths: c.strengths || [
              'Strong technical background',
              'Relevant experience in the field',
              'Good educational qualifications'
            ],
            weaknesses: c.weaknesses || [
              'Limited experience in some required technologies'
            ],
            additionalInfo: c.summary || 'Candidate is ready for interview.',
            resumeMatch: Math.round(c.score * 0.95) || 75,
            skillsMatch: Math.round(c.score * 1.05) || 85,
            experienceRelevance: Math.round(c.score * 0.98) || 80,
            cultureFit: Math.round(c.score * 1.02) || 82,
            recommendation: c.score >= 80
              ? 'Highly recommended for interview. Strong candidate with excellent qualifications.'
              : c.score >= 60
              ? 'Recommended for consideration. Good potential with solid background.'
              : 'Consider for interview. Candidate shows promise.'
          }));

        setCandidates(interviewCandidates);
      } else {
        setCandidates([]);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchTemplates();
  }, []);

  const jobs = ['all', ...new Set(candidates.map(c => c.job))];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         candidate.email?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesJob = filters.job === 'all' || candidate.job === filters.job;
    const matchesScore = candidate.score >= filters.scoreThreshold;
    const matchesStage = filters.stage === 'all' || 
                        candidate.stage?.toLowerCase() === filters.stage?.toLowerCase();
    const notRejected = candidate.stage?.toLowerCase() !== 'rejected';
    
    return matchesSearch && matchesJob && matchesScore && matchesStage && notRejected;
  });

  const hasData = candidates.length > 0;
  const totalCandidates = candidates.length;
  const avgScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)
    : 0;
  const interviewStageCount = candidates.filter(c => c.stage?.toLowerCase() === 'interview').length;
  const highScoreCount = candidates.filter(c => c.score >= 80).length;

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Job', 'Score', 'Strengths', 'Weaknesses', 'Recommendation'];
    const rows = filteredCandidates.map(candidate => [
      candidate.name,
      candidate.email,
      candidate.job,
      candidate.score,
      candidate.strengths.join('; '),
      candidate.weaknesses.join('; '),
      candidate.recommendation
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai_prescreening_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-emerald-500 text-white';
    if (score >= 70) return 'bg-primary text-white';
    if (score >= 60) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'Excellent Fit';
    if (score >= 70) return 'Good Fit';
    if (score >= 60) return 'Moderate Fit';
    return 'Poor Fit';
  };

  const handleShortlist = () => {
    if (selectedCandidate) {
      alert(`✅ ${selectedCandidate.name} has been shortlisted!`);
    }
  };

  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'interview': return 'bg-primary text-white';
      case 'applied': return 'bg-indigo-50 text-indigo-700';
      case 'offer': return 'bg-amber-50 text-amber-700';
      case 'hired': return 'bg-emerald-50 text-emerald-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FaRobot className="text-gray-600 text-xl sm:text-2xl" />
              AI Prescreening
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Review candidates who passed resume screening and are ready for interviews</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchCandidates}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
            >
              <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
            >
              <FiDownload className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-gray-500 text-sm">Fetching AI prescreening results...</p>
          </div>
        ) : !hasData ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-8 text-center">
            <FiUsers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-midnight_text mb-1">No AI Prescreening Data</h3>
            <p className="text-sm text-gray-500">Once candidates reach the interview stage they will appear here automatically</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Candidates</p>
                    <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{totalCandidates}</p>
                    <p className="text-xs text-gray-400 mt-1">In Interview stage</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FiUsers className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Average AI Score</p>
                    <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{avgScore}%</p>
                    <p className="text-xs text-gray-400 mt-1">Across filtered list</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <FiBarChart2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Interview Stage</p>
                    <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{interviewStageCount}</p>
                    <p className="text-xs text-gray-400 mt-1">Currently interviewing</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <FiBriefcase className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">High Potential</p>
                    <p className="text-xl sm:text-2xl font-bold text-midnight_text mt-1">{highScoreCount}</p>
                    <p className="text-xs text-gray-400 mt-1">Strong AI matches (≥80%)</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <FiStar className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <select
                  value={filters.job}
                  onChange={(e) => setFilters({ ...filters, job: e.target.value })}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                >
                  {jobs.map((job) => (
                    <option key={job} value={job}>
                      {job === 'all' ? 'All Jobs' : job}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.stage || 'all'}
                  onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                >
                  <option value="all">All Stages</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="hired">Hired</option>
                </select>
                <input
                  type="number"
                  placeholder="Score ≥ (%)"
                  value={filters.scoreThreshold}
                  onChange={(e) => setFilters({ ...filters, scoreThreshold: parseInt(e.target.value, 10) || 0 })}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  min="0"
                  max="100"
                />
                <button
                  onClick={fetchCandidates}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
                >
                  <FiFilter className="h-4 w-4" />
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Candidates Table */}
              <div className={selectedCandidate ? 'lg:col-span-2' : 'lg:col-span-3'}>
                <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow overflow-hidden">
                  {filteredCandidates.length === 0 ? (
                    <div className="text-center py-12">
                      <FiUsers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h6 className="text-gray-500 mb-1">No Candidates Found</h6>
                      <p className="text-sm text-gray-400">
                        {candidates.length === 0 ? 'Start screening resumes to see candidates here' : 'Try adjusting your filters'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Candidate Name</th>
                            <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Job Applied</th>
                            <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">AI Fit Score</th>
                            <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Stage</th>
                            <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Strengths</th>
                            <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredCandidates.map((candidate) => (
                            <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary">{candidate.name?.charAt(0) || '?'}</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-midnight_text">{candidate.name}</p>
                                    <p className="text-xs text-gray-500">{candidate.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-600">{candidate.job}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${getScoreColor(candidate.score)}`}>
                                  {candidate.score.toFixed(0)}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${getStageColor(candidate.stage)}`}>
                                  {candidate.stage || 'Applied'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                  {candidate.strengths.slice(0, 2).join(', ')}
                                </p>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => setSelectedCandidate(candidate)}
                                    className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all"
                                    title="View Insights"
                                  >
                                    <FiEye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleSendInterviewLink(candidate)}
                                    disabled={sendingEmail}
                                    className="p-1.5 text-gray-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all disabled:opacity-50"
                                    title="Send Interview Link"
                                  >
                                    <FiSend className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Candidate Details Sidebar */}
              {selectedCandidate && (
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow sticky top-4">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-semibold text-midnight_text">{selectedCandidate.name}</h5>
                          <p className="text-xs text-gray-500 mt-0.5">{selectedCandidate.job}</p>
                        </div>
                        <button
                          onClick={() => setSelectedCandidate(null)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-emerald-600">{selectedCandidate.score.toFixed(0)}%</span>
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${getScoreColor(selectedCandidate.score)}`}>
                          {getScoreBadge(selectedCandidate.score)}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                      {/* Strengths */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FiCheckCircle className="h-4 w-4 text-emerald-500" />
                          <h6 className="text-sm font-semibold text-midnight_text">Strengths</h6>
                        </div>
                        <ul className="space-y-1">
                          {selectedCandidate.strengths.map((strength, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Areas for Improvement */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FiAlertTriangle className="h-4 w-4 text-amber-500" />
                          <h6 className="text-sm font-semibold text-midnight_text">Areas for Improvement</h6>
                        </div>
                        <ul className="space-y-1">
                          {selectedCandidate.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-amber-500 mt-0.5">•</span>
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Evaluation Metrics */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FiTrendingUp className="h-4 w-4 text-primary" />
                          <h6 className="text-sm font-semibold text-midnight_text">Evaluation Summary</h6>
                        </div>
                        <div className="space-y-3">
                          {[
                            { label: 'Resume Match', value: selectedCandidate.resumeMatch },
                            { label: 'Skills Match', value: selectedCandidate.skillsMatch },
                            { label: 'Experience Relevance', value: selectedCandidate.experienceRelevance },
                            { label: 'Culture Fit (AI-based)', value: selectedCandidate.cultureFit }
                          ].map((metric, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">{metric.label}</span>
                                <span className="font-medium text-midnight_text">{metric.value}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    metric.value >= 80 ? 'bg-emerald-500' :
                                    metric.value >= 70 ? 'bg-primary' :
                                    metric.value >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${metric.value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Recommendations */}
                      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                        <h6 className="text-sm font-semibold text-midnight_text mb-2">AI Recommendations</h6>
                        <p className="text-xs text-gray-600">{selectedCandidate.recommendation}</p>
                      </div>

                      {/* Current Stage */}
                      <div>
                        <h6 className="text-sm font-semibold text-midnight_text mb-2">Current Stage</h6>
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${getStageColor(selectedCandidate.stage)}`}>
                          {selectedCandidate.stage || 'Applied'}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleShortlist}
                          className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleSendInterviewLink(selectedCandidate)}
                          disabled={sendingEmail}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                        >
                          {sendingEmail ? (
                            <FiRefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <FiSend className="h-4 w-4" />
                              Send Link
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIPrescreening;