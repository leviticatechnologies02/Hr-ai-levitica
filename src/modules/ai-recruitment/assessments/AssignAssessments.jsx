import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FiSend,
  FiCalendar,
  FiSearch,
  FiRefreshCw,
  FiMail,
  FiFilter,
  FiUsers,
  FiClipboard,
  FiCheckCircle,
  FiUser,
  FiBriefcase,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { assessmentAPI } from "../../../shared/utils/api";
import { BASE_URL } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';

const ASSESSMENT_SETUP_STORAGE_KEY = 'recruiterAssessmentSetup';

const AssignAssessments = () => {
  const location = useLocation();
  const [assessments, setAssessments] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCandidate, setSearchCandidate] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loadedPreselectedCount, setLoadedPreselectedCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const applyAssessmentSetup = (setup) => {
    if (!setup || typeof setup !== 'object') return;

    if (setup.preselectedAssessmentId) {
      setSelectedAssessment(String(setup.preselectedAssessmentId));
    }

    if (setup.prefilledDueDate) {
      setDueDate(setup.prefilledDueDate);
    }

    if (typeof setup.prefilledSendEmail === 'boolean') {
      setSendEmail(setup.prefilledSendEmail);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [assessmentsData, candidatesResponse, preselectedData] = await Promise.all([
        assessmentAPI.list(),
        fetch(`${BASE_URL}/api/resume/candidates`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }),
        assessmentAPI.getPreselectedCandidates().catch(() => ({ candidate_ids: [], candidate_emails: [] }))
      ]);
      
      let candidatesData = [];
      if (candidatesResponse.ok) {
        candidatesData = await candidatesResponse.json();
      }
      
      setAssessments(assessmentsData || []);
      const allCandidates = candidatesData || [];
      setCandidates(allCandidates);
  
      const preselectedIds = new Set((preselectedData?.candidate_ids || []).map((id) => Number(id)));
      if (preselectedIds.size > 0) {
        const matchedIds = allCandidates
          .map((c) => c.id)
          .filter((id) => preselectedIds.has(Number(id)));
        setSelectedCandidates(matchedIds);
        setLoadedPreselectedCount(matchedIds.length);
      } else {
        setLoadedPreselectedCount(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const stateSetup = location.state;
    const hasSetupState = stateSetup && (
      stateSetup.preselectedAssessmentId ||
      stateSetup.prefilledDueDate ||
      typeof stateSetup.prefilledSendEmail === 'boolean'
    );

    if (hasSetupState) {
      sessionStorage.setItem(ASSESSMENT_SETUP_STORAGE_KEY, JSON.stringify(stateSetup));
      applyAssessmentSetup(stateSetup);
      return;
    }

    const storedSetup = sessionStorage.getItem(ASSESSMENT_SETUP_STORAGE_KEY);
    if (storedSetup) {
      try {
        applyAssessmentSetup(JSON.parse(storedSetup));
      } catch (error) {
        console.error('Failed to parse stored assessment setup:', error);
        sessionStorage.removeItem(ASSESSMENT_SETUP_STORAGE_KEY);
      }
    }
  }, [location.state]);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.candidate_name?.toLowerCase().includes(searchCandidate.toLowerCase()) ||
      candidate.candidate_email?.toLowerCase().includes(searchCandidate.toLowerCase()) ||
      candidate.role?.toLowerCase().includes(searchCandidate.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'Interview Stage' && candidate.score >= 70) ||
      (filterStatus === 'Screening' && candidate.score < 70 && candidate.score >= 50) ||
      (filterStatus === 'Applied' && candidate.score < 50);
    
    return matchesSearch && matchesStatus;
  });

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const selectAllCandidates = () => {
    const allIds = filteredCandidates.map(c => c.id);
    setSelectedCandidates(allIds);
  };

  const clearSelection = () => {
    setSelectedCandidates([]);
    setLoadedPreselectedCount(0);
    assessmentAPI.clearPreselectedCandidates().catch(() => null);
  };

  const sendAssessmentEmail = async (candidate, assessment) => {
    const testLinks = {
      aptitude: `${window.location.origin}/assessment/aptitude?name=${encodeURIComponent(candidate.candidate_name)}&email=${encodeURIComponent(candidate.candidate_email)}`,
      coding: `${window.location.origin}/assessment/coding?name=${encodeURIComponent(candidate.candidate_name)}&email=${encodeURIComponent(candidate.candidate_email)}`,
      communication: `${window.location.origin}/assessment/communication?name=${encodeURIComponent(candidate.candidate_name)}&email=${encodeURIComponent(candidate.candidate_email)}`
    };

    const testLink = testLinks[assessment.type];
    if (!testLink) return;

    const emailBody = `
Dear ${candidate.candidate_name},

You have been assigned to take the ${assessment.name} assessment.

Assessment Details:
- Type: ${assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
- Difficulty: ${assessment.difficulty || 'Medium'}
${dueDate ? `- Due Date: ${new Date(dueDate).toLocaleDateString()}` : ''}

Please click the link below to start your assessment:
${testLink}

Important Instructions:
1. You will receive an OTP to verify your identity
2. Complete the assessment within the time limit
3. Ensure stable internet connection
4. Answer all questions carefully

Good luck!

Best regards,
Recruitment Team
    `.trim();

    try {
      await fetch(`${BASE_URL}/api/send-assessment-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_email: candidate.candidate_email,
          to_name: candidate.candidate_name,
          subject: `Assessment Invitation - ${assessment.name}`,
          body: emailBody,
          test_type: assessment.type,
          test_link: testLink
        })
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleAssign = async () => {
    if (selectedCandidates.length === 0) {
      alert('Please select at least one candidate');
      return;
    }
    if (!selectedAssessment) {
      alert('Please select an assessment');
      return;
    }

    try {
      setLoading(true);
      const assessment = assessments.find(a => a.id === parseInt(selectedAssessment));
      
      for (const candidateId of selectedCandidates) {
        await assessmentAPI.assign(candidateId, parseInt(selectedAssessment), dueDate || null);
      }

      if (sendEmail && assessment) {
        for (const candidateId of selectedCandidates) {
          const candidate = candidates.find(c => c.id === candidateId);
          if (candidate && candidate.candidate_email) {
            await sendAssessmentEmail(candidate, assessment);
          }
        }
      }

      setSuccessData({
        assessmentName: assessment?.name,
        candidateCount: selectedCandidates.length,
        dueDate: dueDate
      });
      setShowSuccessModal(true);
      
      sessionStorage.removeItem(ASSESSMENT_SETUP_STORAGE_KEY);
      await assessmentAPI.clearPreselectedCandidates().catch(() => null);
      setLoadedPreselectedCount(0);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error assigning assessment:', error);
      alert('Failed to assign assessment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCandidates([]);
    setSelectedAssessment('');
    setDueDate('');
    setSendEmail(true);
    setSearchCandidate('');
  };

  const selectedAssessmentDetails = selectedAssessment 
    ? assessments.find(a => a.id === parseInt(selectedAssessment))
    : null;

  const getStatusColor = (score) => {
    if (score >= 70) return 'bg-emerald-50 text-emerald-700';
    if (score >= 50) return 'bg-amber-50 text-amber-700';
    return 'bg-gray-100 text-gray-600';
  };

  const getStatusText = (score) => {
    if (score >= 70) return 'Interview Stage';
    if (score >= 50) return 'Screening';
    return 'Applied';
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiClipboard className="text-gray-600 text-xl sm:text-2xl" />
              Assign Assessment
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Select candidates and assign them an assessment test</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg">
                <FiUsers className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedCandidates.length} selected</span>
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
              >
                <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Preselected Alert */}
        {loadedPreselectedCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <span className="text-sm text-amber-700">
              Loaded {loadedPreselectedCount} candidates from Resume Screening selection.
            </span>
            <button onClick={clearSelection} className="text-sm text-amber-700 hover:text-amber-800 underline">
              Clear preselected
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Candidate Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow">
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h5 className="font-semibold text-midnight_text flex items-center gap-2">
                    <FiUsers className="h-5 w-5 text-primary" />
                    Select Candidates
                  </h5>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllCandidates}
                      className="px-3 py-1.5 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary rounded-lg transition-all"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                {/* Search and Filter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email or role..."
                      value={searchCandidate}
                      onChange={(e) => setSearchCandidate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white appearance-none"
                    >
                      <option value="all">All Status</option>
                      <option value="Interview Stage">Interview Stage</option>
                      <option value="Screening">Screening</option>
                      <option value="Applied">Applied</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Candidate List */}
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {filteredCandidates.length === 0 ? (
                  <div className="text-center py-12">
                    <FiUsers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No candidates found</p>
                  </div>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => toggleCandidateSelection(candidate.id)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedCandidates.includes(candidate.id)
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h6 className="font-semibold text-midnight_text">{candidate.candidate_name}</h6>
                              <p className="text-sm text-gray-600 mt-0.5">{candidate.role || 'N/A'}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{candidate.candidate_email}</p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStatusColor(candidate.score)}`}>
                              {getStatusText(candidate.score)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Assessment & Details */}
          <div className="space-y-4">
            {/* Assessment Selection */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow p-4">
              <h5 className="font-semibold text-midnight_text mb-4 flex items-center gap-2">
                <FiClipboard className="h-5 w-5 text-primary" />
                Assessment Details
              </h5>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Assessment <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedAssessment}
                  onChange={(e) => setSelectedAssessment(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                  required
                >
                  <option value="">Choose an assessment...</option>
                  {assessments.map((assessment) => (
                    <option key={assessment.id} value={assessment.id}>
                      {assessment.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAssessmentDetails && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium text-midnight_text capitalize">{selectedAssessmentDetails.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Difficulty:</span>
                    <span className="font-medium text-midnight_text capitalize">{selectedAssessmentDetails.difficulty || 'Medium'}</span>
                  </div>
                  {selectedAssessmentDetails.question_count && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Questions:</span>
                      <span className="font-medium text-midnight_text">{selectedAssessmentDetails.question_count}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Submissions will be prevented after this date</p>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                {dueDate && (
                  <p className="text-xs text-primary mt-2">
                    📅 Due: {new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <FiMail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Send email notifications</span>
              </label>
            </div>

            {/* Summary Card */}
            <div className="bg-primary/5 rounded-lg border border-primary/20 p-4">
              <h6 className="font-semibold text-midnight_text mb-3">Assignment Summary</h6>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Candidates:</span>
                  <span className="font-medium text-midnight_text">{selectedCandidates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assessment:</span>
                  <span className="font-medium text-midnight_text truncate max-w-[150px]">
                    {selectedAssessmentDetails ? selectedAssessmentDetails.name : 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Due Date:</span>
                  <span className="font-medium text-midnight_text">
                    {dueDate ? new Date(dueDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Assign Button */}
            <button
              onClick={handleAssign}
              disabled={selectedCandidates.length === 0 || !selectedAssessment || !dueDate || loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Assigning...
                </>
              ) : (
                <>
                  <FiSend className="h-4 w-4" />
                  Assign to {selectedCandidates.length} Candidate{selectedCandidates.length !== 1 ? 's' : ''}
                </>
              )}
            </button>

            {/* Validation Messages */}
            {selectedCandidates.length === 0 && (
              <p className="text-xs text-amber-600 text-center">Please select at least one candidate</p>
            )}
            {!selectedAssessment && selectedCandidates.length > 0 && (
              <p className="text-xs text-amber-600 text-center">Please choose an assessment</p>
            )}
            {!dueDate && selectedCandidates.length > 0 && selectedAssessment && (
              <p className="text-xs text-amber-600 text-center">Please set a due date</p>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setShowSuccess(false);
        }}
        title="Assessment Assigned Successfully"
        size="md"
      >
        {successData && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-midnight_text">Successfully Assigned!</h3>
              <p className="text-sm text-gray-500 mt-1">
                Assessment "{successData.assessmentName}" has been assigned to {successData.candidateCount} candidate{successData.candidateCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Due Date:</span>
                <span className="font-medium text-midnight_text">
                  {successData.dueDate ? new Date(successData.dueDate).toLocaleDateString() : 'No deadline'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email Notifications:</span>
                <span className="font-medium text-emerald-600">Sent</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setShowSuccess(false);
              }}
              className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AssignAssessments;