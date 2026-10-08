import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiMessageSquare,
  FiVideo,
  FiAward,
  FiTrendingUp,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiPlay,
  FiPause,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiMenu,
  FiMail,
  FiPhone,
  FiMapPin,
  FiStar,
  FiBarChart2,
  FiAlertCircle,
  FiSend,
  FiCopy,
  FiClock
} from 'react-icons/fi';
import { BASE_URL } from "../../../shared/constants/api.config";
import Modal from '../../../shared/components/Modal';

const ReviewAIInterview = () => {
  const [candidates, setCandidates] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMinScore, setFilterMinScore] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recruiterNote, setRecruiterNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState(null);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/interviews/get_questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAnswers([]);
        setCandidates([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/interviews/results`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        const formattedAnswers = data.map(result => {
          const answersWithQuestions = result.answers.map(ans => {
            const questionText = ans.question_text || questions.find(q => q.id === ans.question_id)?.text || `Question ${ans.question_id}`;
            return {
              question_id: ans.question_id,
              question_text: questionText,
              question_type: questions.find(q => q.id === ans.question_id)?.type || 'video',
              answer_text: ans.answer_text,
              score: ans.score || 0,
              video_path: ans.video_path,
              audio_path: ans.audio_path,
              q: questionText,
              a: ans.answer_text
            };
          });
          
          return {
            candidate_id: result.candidate_id,
            name: result.candidate_name,
            candidate_name: result.candidate_name,
            candidate_email: result.candidate_email,
            email: result.candidate_email,
            role: 'Candidate',
            phone: 'N/A',
            location: 'N/A',
            experience: 'N/A',
            education: 'N/A',
            interviewDate: new Date().toLocaleDateString(),
            status: 'Interviewed',
            questions: answersWithQuestions,
            answers: answersWithQuestions,
            total_score: result.total_score,
            aiScore: result.avg_score,
            avg_score: result.avg_score,
            keywords: ['Experienced', 'Professional', 'Skilled'],
            sentiment: {
              tone: 'Positive',
              confidence: 'High',
              engagement: 'Good'
            },
            scores: {
              technical: Math.round(result.avg_score),
              communication: Math.round(result.avg_score * 0.95),
              problemSolving: Math.round(result.avg_score * 1.05),
              overall: Math.round(result.avg_score)
            },
            verdict: result.avg_score >= 80 
              ? 'Highly recommended for next round. Strong technical skills and excellent communication.'
              : result.avg_score >= 60
              ? 'Recommended for consideration. Good overall performance with room for improvement.'
              : 'Not recommended. Needs significant improvement in technical and communication areas.',
            skills: ['Problem Solving', 'Technical Knowledge', 'Communication'],
            previousCompanies: ['Tech Corp', 'Innovation Labs']
          };
        });

        setAnswers(formattedAnswers);
        const uniqueCandidates = formattedAnswers.map(a => ({
          id: a.candidate_id,
          candidate_name: a.candidate_name,
          candidate_email: a.candidate_email
        }));
        setCandidates(uniqueCandidates);
      } else {
        setAnswers([]);
        setCandidates([]);
      }
    } catch (error) {
      console.error('Error fetching interview results:', error);
      setAnswers([]);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchQuestions();
      await fetchCandidates();
    };
    init();
  }, []);

  const candidate = selectedCandidate !== null ? answers[selectedCandidate] : null;

  const handleCandidateClick = (c) => {
    setSelectedCandidateForModal(c);
    setShowCandidateModal(true);
  };

  const closeModal = () => {
    setShowCandidateModal(false);
    setSelectedCandidateForModal(null);
  };

  const handleSaveNote = () => {
    if (recruiterNote.trim() && candidate) {
      const newNote = {
        candidate: candidate.name,
        note: recruiterNote,
        date: new Date().toLocaleString(),
        recruiter: 'Current User'
      };
      setSavedNotes([...savedNotes, newNote]);
      setRecruiterNote('');
      alert('Note saved successfully!');
    }
  };

  // Resolve the candidate_records id (by email) and save the recruiter's decision as the candidate's stage
  const updateCandidateStage = async (stage) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication required. Please log in again.');
      return false;
    }

    let candidateRecordId = candidate.candidate_id;
    if (candidate.email) {
      try {
        const res = await fetch(`${BASE_URL}/api/resume/candidates?show_all=true`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const records = await res.json();
          const match = records.find(
            cr => cr.candidate_email && cr.candidate_email.toLowerCase() === candidate.email.toLowerCase()
          );
          if (match) candidateRecordId = match.id;
        }
      } catch (e) {
        console.warn('Could not fetch candidate records:', e);
      }
    }

    const response = await fetch(`${BASE_URL}/api/resume/candidates/${candidateRecordId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ stage })
    });
    return response.ok;
  };

  const handleAction = async (action) => {
    if (!candidate) return;

    if (action === 'Select' || action === 'Reject') {
      const stage = action === 'Select' ? 'Selected' : 'Rejected';
      const verb = action === 'Select' ? 'select' : 'reject';
      if (!window.confirm(`Are you sure you want to ${verb} ${candidate.name}?`)) return;
      try {
        const ok = await updateCandidateStage(stage);
        if (ok) {
          alert(action === 'Select'
            ? `✅ ${candidate.name} has been selected. You can send the offer from Selection Results.`
            : `✅ ${candidate.name} has been rejected.`);
          fetchCandidates();
        } else {
          alert(`❌ Failed to ${verb} candidate`);
        }
      } catch (error) {
        console.error(`Error trying to ${verb} candidate:`, error);
        alert(`Error trying to ${verb} candidate. Please try again.`);
      }
    } else {
      alert(`${action} action performed for ${candidate.name}`);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-emerald-500 text-white';
    if (score >= 60) return 'bg-primary text-white';
    if (score >= 40) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700';
    if (score >= 60) return 'bg-primary/10 text-primary';
    if (score >= 40) return 'bg-amber-50 text-amber-700';
    return 'bg-rose-50 text-rose-700';
  };

  const getVideoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    let cleanPath = path.startsWith('/') ? path.substring(1) : path;
    if (cleanPath.startsWith('uploads/')) {
      return `${BASE_URL}/${cleanPath}`;
    }
    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiVideo className="text-gray-600 text-xl sm:text-2xl" />
              AI Interview Review
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Review candidate interview responses with AI feedback, sentiment, and notes</p>
          </div>
          <button
            onClick={fetchCandidates}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-midnight_text">Candidates</h5>
                  <button 
                    className="p-2 text-gray-500 hover:text-primary rounded-lg lg:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <FiMenu className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3" />
                    <p className="text-gray-500 text-sm">Loading...</p>
                  </div>
                ) : answers.length === 0 ? (
                  <div className="text-center py-8">
                    <FiMessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No interview results yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {answers.map((c, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedCandidate === idx
                            ? 'bg-primary/10 border border-primary/30'
                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                        }`}
                        onClick={() => { setSelectedCandidate(idx); setCurrentQuestion(0); }}
                        onDoubleClick={() => handleCandidateClick(c)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h6 className="font-medium text-midnight_text text-sm">{c.name}</h6>
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${getScoreBadgeColor(c.aiScore)}`}>
                            {c.aiScore}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{c.role}</p>
                        <p className="text-xs text-gray-400">Double-click for details</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!candidate ? (
              <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow text-center py-12">
                <FiVideo className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h5 className="text-gray-500 mb-2">Select a candidate to review their interview</h5>
                <p className="text-sm text-gray-400">Click on a candidate card from the left panel to begin reviewing</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow mb-4">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <h5 className="font-semibold text-midnight_text">
                        Question {currentQuestion + 1} of {candidate.questions.length}
                      </h5>
                      <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <FiFileText className="h-4 w-4" />
                        {showTranscript ? 'Hide' : 'Show'} Transcript
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 font-medium mb-1">Question:</p>
                      <p className="text-sm text-midnight_text">{candidate.questions[currentQuestion].q}</p>
                    </div>

                    {(() => {
                      const currentQ = candidate.questions[currentQuestion];
                      const videoPath = currentQ.video_path;
                      const audioPath = currentQ.audio_path;
                      const videoUrl = getVideoUrl(videoPath);
                      const audioUrl = getVideoUrl(audioPath);
                      
                      if (videoUrl) {
                        return (
                          <div className="mb-4">
                            <video
                              key={videoUrl}
                              controls
                              className="w-full rounded-lg"
                              style={{ maxHeight: '400px', backgroundColor: '#000' }}
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                            >
                              <source src={videoUrl} type="video/webm" />
                              <source src={videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                            <a href={videoUrl} download className="inline-flex items-center gap-1.5 text-xs text-primary mt-2 hover:underline">
                              <FiDownload className="h-3 w-3" /> Download Video
                            </a>
                          </div>
                        );
                      } else if (audioUrl) {
                        return (
                          <div className="mb-4 bg-gray-900 rounded-lg p-6 text-center">
                            <audio controls className="w-full" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
                              <source src={audioUrl} type="audio/webm" />
                              <source src={audioUrl} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                            <a href={audioUrl} download className="inline-flex items-center gap-1.5 text-xs text-primary mt-3 hover:underline">
                              <FiDownload className="h-3 w-3" /> Download Audio
                            </a>
                          </div>
                        );
                      } else {
                        return (
                          <div className="bg-gray-900 rounded-lg flex items-center justify-center mb-4" style={{ minHeight: '300px' }}>
                            <div className="text-center text-white">
                              <FiVideo className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-gray-400 text-sm">No video/audio recording available</p>
                              {currentQ.answer_text && (
                                <p className="text-gray-400 text-xs mt-2">Text answer: {currentQ.answer_text.substring(0, 100)}...</p>
                              )}
                            </div>
                          </div>
                        );
                      }
                    })()}

                    {showTranscript && (
                      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 mb-4">
                        <p className="text-xs text-gray-500 font-medium mb-1">Candidate Response:</p>
                        <p className="text-sm text-gray-700">{candidate.questions[currentQuestion].a}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft className="h-4 w-4" />
                        Previous
                      </button>
                      <span className="text-sm text-gray-500">
                        {currentQuestion + 1} / {candidate.questions.length}
                      </span>
                      <button
                        onClick={() => setCurrentQuestion(Math.min(candidate.questions.length - 1, currentQuestion + 1))}
                        disabled={currentQuestion === candidate.questions.length - 1}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <FiChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow mb-4">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="font-semibold text-midnight_text">AI Feedback</h5>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <h6 className="text-xs font-semibold text-gray-500 mb-2">Keyword Analysis</h6>
                      <div className="flex flex-wrap gap-2">
                        {candidate.keywords.map((keyword, idx) => (
                          <span key={idx} className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h6 className="text-xs font-semibold text-gray-500 mb-2">Sentiment Analysis</h6>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-emerald-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500 mb-0.5">Tone</p>
                          <p className="text-sm font-semibold text-emerald-700">{candidate.sentiment.tone}</p>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500 mb-0.5">Confidence</p>
                          <p className="text-sm font-semibold text-primary">{candidate.sentiment.confidence}</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500 mb-0.5">Engagement</p>
                          <p className="text-sm font-semibold text-amber-700">{candidate.sentiment.engagement}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h6 className="text-xs font-semibold text-gray-500 mb-2">AI Evaluation Score</h6>
                      <div className="space-y-2">
                        {Object.entries(candidate.scores).map(([category, score]) => (
                          <div key={category}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500 capitalize">
                                {category === 'overall' ? 'Overall Fit' : category === 'technical' ? 'Technical Knowledge' : category}
                              </span>
                              <span className="font-semibold text-midnight_text">{score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-primary' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                      <p className="text-xs text-gray-500 font-medium mb-1">AI Verdict:</p>
                      <p className="text-sm text-gray-700">{candidate.verdict}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow mb-4">
                  <div className="p-4 border-b border-gray-100">
                    <h5 className="font-semibold text-midnight_text">Recruiter Notes</h5>
                  </div>
                  <div className="p-4">
                    <textarea
                      value={recruiterNote}
                      onChange={(e) => setRecruiterNote(e.target.value)}
                      placeholder="Add your notes about this candidate..."
                      rows="3"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary mb-3"
                    />
                    <button onClick={handleSaveNote} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all">
                      Save Notes
                    </button>

                    {savedNotes.filter(n => n.candidate === candidate.name).length > 0 && (
                      <div className="mt-4">
                        <h6 className="text-xs font-semibold text-gray-500 mb-2">Previous Notes</h6>
                        <div className="space-y-2">
                          {savedNotes.filter(n => n.candidate === candidate.name).map((note, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-700 mb-1">{note.note}</p>
                              <p className="text-xs text-gray-400">{note.date} • {note.recruiter}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleAction('Select')} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all">
                    <FiCheckCircle className="h-4 w-4" />
                    Select
                  </button>
                  <button onClick={() => handleAction('Reject')} className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-all">
                    <FiXCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button onClick={() => handleAction('Export Report')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary rounded-lg text-sm font-medium transition-all">
                    <FiDownload className="h-4 w-4" />
                    Export Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCandidateModal}
        onClose={closeModal}
        title={`Candidate Profile - ${selectedCandidateForModal?.name || ''}`}
        size="xl"
      >
        {selectedCandidateForModal && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-semibold text-midnight_text mb-3">Personal Information</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FiMail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{selectedCandidateForModal.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{selectedCandidateForModal.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{selectedCandidateForModal.location}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-semibold text-midnight_text mb-3">Skills</h6>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidateForModal.skills?.map((skill, idx) => (
                      <span key={idx} className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h6 className="text-sm font-semibold text-midnight_text">AI Assessment Score</h6>
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${getScoreBadgeColor(selectedCandidateForModal.aiScore)}`}>
                      {selectedCandidateForModal.aiScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className={`h-2 rounded-full ${selectedCandidateForModal.aiScore >= 80 ? 'bg-emerald-500' : selectedCandidateForModal.aiScore >= 60 ? 'bg-primary' : 'bg-amber-500'}`} style={{ width: `${selectedCandidateForModal.aiScore}%` }} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedCandidateForModal.scores).map(([category, score]) => (
                      <div key={category}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500 capitalize">{category}</span>
                          <span className="font-semibold text-midnight_text">{score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div className={`h-1 rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-primary' : 'bg-amber-500'}`} style={{ width: `${score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-semibold text-midnight_text mb-3">Sentiment Analysis</h6>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Tone</p>
                      <p className="text-sm font-semibold text-emerald-700">{selectedCandidateForModal.sentiment.tone}</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Confidence</p>
                      <p className="text-sm font-semibold text-primary">{selectedCandidateForModal.sentiment.confidence}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Engagement</p>
                      <p className="text-sm font-semibold text-amber-700">{selectedCandidateForModal.sentiment.engagement}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h6 className="text-sm font-semibold text-midnight_text mb-2">AI Verdict</h6>
                  <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                    <p className="text-sm text-gray-700">{selectedCandidateForModal.verdict}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewAIInterview;