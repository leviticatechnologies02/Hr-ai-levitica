import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, Send, RefreshCw, ClipboardList, ArrowRight } from 'lucide-react';
import { assessmentAPI } from "../../../../shared/utils/api";

const AptitudeTest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isRecruiterMode = searchParams.get('mode') === 'recruiter' || location.state?.mode === 'recruiter';
  
  const [step, setStep] = useState('otp'); // otp, instructions, exam, result
  const [candidateData, setCandidateData] = useState({
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    studentId: null
  });
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recruiterSetup, setRecruiterSetup] = useState({
    name: 'Aptitude Assessment',
    role: '',
    difficulty: 'medium',
    question_count: 25,
    dueDate: '',
    sendEmail: true
  });
  
  // Exam state
  const [instructions, setInstructions] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [examStarted, setExamStarted] = useState(false);
  
  // Result state
  const [result, setResult] = useState(null);

  // Timer effect
  useEffect(() => {
    if (examStarted && timeRemaining > 0 && step === 'exam') {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && examStarted) {
      handleSubmitExam();
    }
  }, [examStarted, timeRemaining, step]);

  // Format time remaining
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!candidateData.name || !candidateData.email) {
      setError('Please provide name and email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await assessmentAPI.aptitude.sendOTP(candidateData.name, candidateData.email);
      alert('OTP sent to your email!');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await assessmentAPI.aptitude.verifyOTP(candidateData.email, otp);
      if (response.message === 'OTP verified successfully') {
        // Fetch instructions with email to get correct question count
        const instructionsData = await assessmentAPI.aptitude.getInstructions(candidateData.email);
        setInstructions(instructionsData);
        setStep('instructions');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Start Exam
  const handleStartExam = async () => {
    setLoading(true);
    setError('');
    
    try {
      // For simplicity, using email hash as student ID
      const studentId = Math.abs(candidateData.email.split('').reduce((a,b) => ((a << 5) - a) + b.charCodeAt(0), 0));
      setCandidateData(prev => ({ ...prev, studentId }));
      
      const response = await assessmentAPI.aptitude.startExam(studentId, candidateData.email);
      
      // Use the candidate_id returned from backend if available
      if (response.candidate_id) {
        setCandidateData(prev => ({ ...prev, studentId: response.candidate_id }));
      }
      
      setQuestions(response.questions || []);
      setExamStarted(true);
      setStep('exam');
      setTimeRemaining(instructions?.time_limit_seconds || 1800);
    } catch (err) {
      setError(err.message || 'Failed to start exam');
    } finally {
      setLoading(false);
    }
  };

  // Submit Exam
  const handleSubmitExam = async () => {
    if (Object.keys(answers).length === 0) {
      if (!window.confirm('You haven\'t answered any questions. Submit anyway?')) {
        return;
      }
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await assessmentAPI.aptitude.submitExam(candidateData.studentId, answers);
      setResult(response);
      setStep('result');
      setExamStarted(false);
    } catch (err) {
      setError(err.message || 'Failed to submit exam');
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerChange = (questionNo, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionNo]: option
    }));
  };

  const handleRecruiterInputChange = (field, value) => {
    setRecruiterSetup((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinueToAssign = async () => {
    if (!recruiterSetup.name.trim()) {
      setError('Assessment name is required');
      return;
    }

    if (!recruiterSetup.role.trim()) {
      setError('Target role is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId'), 10) : null;
      const createdAssessment = await assessmentAPI.create({
        name: recruiterSetup.name.trim(),
        type: 'aptitude',
        role: recruiterSetup.role.trim(),
        difficulty: recruiterSetup.difficulty,
        question_count: recruiterSetup.question_count,
        created_by: userId
      });

      navigate('/recruiter/assign-assessment', {
        state: {
          source: 'assessment-library',
          preselectedAssessmentId: createdAssessment?.id ? String(createdAssessment.id) : '',
          prefilledDueDate: recruiterSetup.dueDate || '',
          prefilledSendEmail: recruiterSetup.sendEmail,
          selectedTestType: 'aptitude'
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to create assessment setup');
    } finally {
      setLoading(false);
    }
  };

  if (isRecruiterMode) {
    return (
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card shadow-none border">
              <div className="card-header bg-transparent">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <ClipboardList size={18} />
                  Configure Aptitude Assessment
                </h5>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center">
                    <AlertCircle size={16} className="me-2" />
                    {error}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Assessment Name *</label>
                    <input
                      className="form-control"
                      value={recruiterSetup.name}
                      onChange={(e) => handleRecruiterInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Target Role *</label>
                    <input
                      className="form-control"
                      value={recruiterSetup.role}
                      onChange={(e) => handleRecruiterInputChange('role', e.target.value)}
                      placeholder="e.g., Data Analyst"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Difficulty</label>
                    <select
                      className="form-select"
                      value={recruiterSetup.difficulty}
                      onChange={(e) => handleRecruiterInputChange('difficulty', e.target.value)}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Question Count</label>
                    <input
                      type="number"
                      min={1}
                      className="form-control"
                      value={recruiterSetup.question_count}
                      onChange={(e) => handleRecruiterInputChange('question_count', Math.max(1, Number(e.target.value) || 1))}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={recruiterSetup.dueDate}
                      onChange={(e) => handleRecruiterInputChange('dueDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        id="aptitudeRecruiterEmail"
                        type="checkbox"
                        className="form-check-input"
                        checked={recruiterSetup.sendEmail}
                        onChange={(e) => handleRecruiterInputChange('sendEmail', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="aptitudeRecruiterEmail">
                        Send email notifications after assignment
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-transparent d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/recruiter/assessment-library')}
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={handleContinueToAssign}
                  disabled={loading}
                >
                  {loading ? <RefreshCw size={16} className="spin me-2" /> : <ArrowRight size={16} className="me-2" />}
                  Continue to Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OTP Step
  if (step === 'otp') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <div className="bg-primary-subtle p-3 rounded-circle d-inline-block mb-3">
                <CheckCircle size={48} className="text-primary" />
              </div>
              <h4 className="mb-2">Aptitude Test - OTP Verification</h4>
              <p className="text-secondary-light">
                Enter your details to receive an OTP
              </p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center">
                <AlertCircle size={20} className="me-2" />
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={candidateData.name}
                onChange={(e) => setCandidateData({ ...candidateData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                value={candidateData.email}
                onChange={(e) => setCandidateData({ ...candidateData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="btn btn-primary w-100 mb-3"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin me-2" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>

            <hr />

            <div className="mb-3">
              <label className="form-label">Enter OTP *</label>
              <input
                type="text"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || !otp}
              className="btn btn-success w-100"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="spin me-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="me-2" />
                  Verify & Continue
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Instructions Step
  if (step === 'instructions') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-lg" style={{ maxWidth: '700px', width: '100%' }}>
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <div className="bg-info-subtle p-3 rounded-circle d-inline-block mb-3">
                <AlertCircle size={48} className="text-info" />
              </div>
              <h4 className="mb-2">Exam Instructions</h4>
            </div>

            {instructions && (
              <div className="mb-4">
                <div className="bg-light p-4 rounded mb-3">
                  <h5 className="mb-3">Round: {instructions.round_name}</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <Clock className="text-primary me-2" size={20} style={{ display: 'inline' }} />
                      <strong>Time Limit:</strong> {Math.floor(instructions.time_limit_seconds / 60)} minutes
                    </li>
                    <li className="mb-2">
                      <CheckCircle className="text-success me-2" size={20} style={{ display: 'inline' }} />
                      <strong>Total Questions:</strong> {instructions.total_questions}
                    </li>
                  </ul>
                </div>

                <div className="alert alert-warning">
                  <h6 className="alert-heading">⚠️ Important Instructions:</h6>
                  <ul className="mb-0">
                    <li>Answer all questions to the best of your ability</li>
                    <li>Do not refresh or close the browser tab during the exam</li>
                    <li>The timer will start immediately when you begin</li>
                    <li>You can navigate between questions freely</li>
                    <li>Submit before time runs out to avoid auto-submission</li>
                  </ul>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger">
                <AlertCircle size={20} className="me-2" />
                {error}
              </div>
            )}

            <button
              onClick={handleStartExam}
              disabled={loading}
              className="btn btn-primary w-100 btn-lg"
            >
              {loading ? (
                <>
                  <RefreshCw size={20} className="spin me-2" />
                  Starting Exam...
                </>
              ) : (
                'Start Exam'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam Step
  if (step === 'exam') {
    return (
      <div className="min-vh-100 bg-light py-4">
        <div className="container">
          {/* Timer Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Aptitude Test</h5>
                <p className="text-secondary-light mb-0">
                  Answered: {Object.keys(answers).length} / {questions.length}
                </p>
              </div>
              <div className="text-end">
                <div className={`badge ${timeRemaining < 300 ? 'bg-danger' : 'bg-primary'} fs-5 px-4 py-2`}>
                  <Clock size={20} className="me-2" />
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="row">
            {questions.map((q, index) => (
              <div key={q.no || index} className="col-12 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-start mb-3">
                      <div className={`badge ${answers[q.no] ? 'bg-success' : 'bg-secondary'} me-3`}>
                        Q{q.no}
                      </div>
                      <h6 className="mb-0">{q.question}</h6>
                    </div>
                    
                    <div className="ms-5">
                      {q.options && ['A', 'B', 'C', 'D'].map((option) => (
                        <div key={option} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`question-${q.no}`}
                            id={`q${q.no}-${option}`}
                            checked={answers[q.no] === option}
                            onChange={() => handleAnswerChange(q.no, option)}
                          />
                          <label className="form-check-label" htmlFor={`q${q.no}-${option}`}>
                            <strong>{option}.</strong> {q.options[option]}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="card shadow-sm mt-4 sticky-bottom">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger mb-3">
                  <AlertCircle size={20} className="me-2" />
                  {error}
                </div>
              )}
              <button
                onClick={handleSubmitExam}
                disabled={loading}
                className="btn btn-success btn-lg w-100"
              >
                {loading ? (
                  <>
                    <RefreshCw size={20} className="spin me-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} className="me-2" />
                    Submit Exam
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Step
  if (step === 'result' && result) {
    const passed = result.status === 'Qualified';
    
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="card-body p-5 text-center">
            <div className={`${passed ? 'bg-success-subtle' : 'bg-danger-subtle'} p-4 rounded-circle d-inline-block mb-4`}>
              {passed ? (
                <CheckCircle size={64} className="text-success" />
              ) : (
                <XCircle size={64} className="text-danger" />
              )}
            </div>
            
            <h3 className="mb-3">
              {passed ? 'Congratulations!' : 'Test Complete'}
            </h3>
            
            <p className="text-secondary-light mb-4">
              {passed 
                ? 'You have qualified for the next round!'
                : 'Thank you for taking the test. Unfortunately, you did not meet the minimum score.'
              }
            </p>

            <div className="bg-light p-4 rounded mb-4">
              <div className="row">
                <div className="col-6 mb-3">
                  <p className="text-secondary-light mb-1">Your Score</p>
                  <h2 className={passed ? 'text-success' : 'text-danger'}>{result.score}</h2>
                </div>
                <div className="col-6 mb-3">
                  <p className="text-secondary-light mb-1">Status</p>
                  <h5 className={passed ? 'text-success' : 'text-danger'}>{result.status}</h5>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="btn btn-primary btn-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AptitudeTest;

