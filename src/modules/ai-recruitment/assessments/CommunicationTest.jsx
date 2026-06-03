import React, { useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Send, CheckCircle, AlertCircle, RefreshCw, FileText, Mic, ClipboardList, ArrowRight } from 'lucide-react';
import { assessmentAPI } from "../../../shared/utils/api";

const CommunicationTest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isRecruiterMode = searchParams.get('mode') === 'recruiter' || location.state?.mode === 'recruiter';
  
  const [step, setStep] = useState('otp'); // otp, exam, result
  const [candidateData, setCandidateData] = useState({
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || ''
  });
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recruiterSetup, setRecruiterSetup] = useState({
    name: 'Communication Assessment',
    role: '',
    difficulty: 'medium',
    question_count: 3,
    dueDate: '',
    sendEmail: true
  });
  
  // Exam state
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({
    writingAnswer: '',
    listeningAnswer: '',
    mcqAnswers: {}
  });
  
  // Result state
  const [result, setResult] = useState(null);

  // Send OTP
  const handleSendOTP = async () => {
    if (!candidateData.name || !candidateData.email) {
      setError('Please provide name and email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await assessmentAPI.communication.sendOTP(candidateData.name, candidateData.email);
      alert('OTP sent to your email!');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and load exam
  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await assessmentAPI.communication.verifyOTP(candidateData.email, otp);
      if (response.verified) {
        // Fetch exam
        const examResponse = await assessmentAPI.communication.getExam(
          candidateData.name,
          candidateData.email
        );
        setExamData(examResponse.exam);
        setStep('exam');
      } else {
        setError('Invalid OTP');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Submit exam
  const handleSubmitExam = async () => {
    // Validate answers
    if (!answers.writingAnswer.trim()) {
      setError('Please answer the writing section');
      return;
    }
    if (!answers.listeningAnswer.trim()) {
      setError('Please answer the listening section');
      return;
    }
    
    // Check if all MCQs are answered
    const mcqCount = examData?.reading_mcqs?.length || 0;
    const answeredMCQs = Object.keys(answers.mcqAnswers).length;
    if (answeredMCQs < mcqCount) {
      if (!window.confirm(`You've only answered ${answeredMCQs} out of ${mcqCount} reading questions. Submit anyway?`)) {
        return;
      }
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await assessmentAPI.communication.submit(
        candidateData.name,
        candidateData.email,
        answers.writingAnswer,
        answers.listeningAnswer,
        answers.mcqAnswers
      );
      
      setResult(response);
      setStep('result');
    } catch (err) {
      setError(err.message || 'Failed to submit exam');
    } finally {
      setLoading(false);
    }
  };

  // Handle MCQ answer
  const handleMCQAnswer = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      mcqAnswers: {
        ...prev.mcqAnswers,
        [questionIndex]: answer
      }
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
        type: 'communication',
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
          selectedTestType: 'communication'
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to create communication assessment setup');
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
                  Configure Communication Assessment
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
                      placeholder="e.g., Client Success Associate"
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
                        id="communicationRecruiterEmail"
                        type="checkbox"
                        className="form-check-input"
                        checked={recruiterSetup.sendEmail}
                        onChange={(e) => handleRecruiterInputChange('sendEmail', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="communicationRecruiterEmail">
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
              <div className="bg-success-subtle p-3 rounded-circle d-inline-block mb-3">
                <MessageSquare size={48} className="text-success" />
              </div>
              <h4 className="mb-2">Communication Test - OTP Verification</h4>
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
                  Verify & Start Test
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam Step
  if (step === 'exam' && examData) {
    return (
      <div className="min-vh-100 bg-light py-4">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h4 className="mb-0">Communication Assessment</h4>
              <p className="text-secondary-light mb-0">Complete all sections to submit</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <AlertCircle size={20} className="me-2" />
              {error}
            </div>
          )}

          {/* Reading Comprehension Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary-subtle">
              <h5 className="mb-0 d-flex align-items-center">
                <FileText size={20} className="me-2" />
                Section 1: Reading Comprehension
              </h5>
            </div>
            <div className="card-body">
              <div className="bg-light p-4 rounded mb-4">
                <p className="mb-0">{examData.reading_paragraph}</p>
              </div>
              
              <h6 className="mb-3">Answer the following questions:</h6>
              
              {examData.reading_mcqs && examData.reading_mcqs.map((mcq, index) => (
                <div key={index} className="mb-4">
                  <p className="fw-medium mb-2">{index + 1}. {mcq.question}</p>
                  <div className="ms-3">
                    {mcq.options && mcq.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`mcq-${index}`}
                          id={`mcq-${index}-${optionIndex}`}
                          checked={answers.mcqAnswers[index] === option}
                          onChange={() => handleMCQAnswer(index, option)}
                        />
                        <label className="form-check-label" htmlFor={`mcq-${index}-${optionIndex}`}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Writing Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success-subtle">
              <h5 className="mb-0 d-flex align-items-center">
                <FileText size={20} className="me-2" />
                Section 2: Writing
              </h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info mb-3">
                <strong>Topic:</strong> {examData.writing_prompt}
              </div>
              <p className="text-secondary-light mb-3">
                Write a response of at least 150 words.
              </p>
              <textarea
                className="form-control"
                rows="10"
                value={answers.writingAnswer}
                onChange={(e) => setAnswers({ ...answers, writingAnswer: e.target.value })}
                placeholder="Type your response here..."
              ></textarea>
              <small className="text-secondary-light">
                Word count: {answers.writingAnswer.split(/\s+/).filter(word => word.length > 0).length}
              </small>
            </div>
          </div>

          {/* Listening Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-warning-subtle">
              <h5 className="mb-0 d-flex align-items-center">
                <Mic size={20} className="me-2" />
                Section 3: Listening Comprehension
              </h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info mb-3">
                <strong>Instruction:</strong> Read the following paragraph carefully and summarize it in your own words.
              </div>
              <div className="bg-light p-4 rounded mb-3">
                <p className="mb-0">{examData.listening_paragraph}</p>
              </div>
              <p className="text-secondary-light mb-3">
                Write your summary (at least 50 words):
              </p>
              <textarea
                className="form-control"
                rows="5"
                value={answers.listeningAnswer}
                onChange={(e) => setAnswers({ ...answers, listeningAnswer: e.target.value })}
                placeholder="Type your summary here..."
              ></textarea>
              <small className="text-secondary-light">
                Word count: {answers.listeningAnswer.split(/\s+/).filter(word => word.length > 0).length}
              </small>
            </div>
          </div>

          {/* Submit Button */}
          <div className="card shadow-sm">
            <div className="card-body">
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
                    Submit Assessment
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
    const passed = result.passed;
    
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="card-body p-5 text-center">
            <div className={`${passed ? 'bg-success-subtle' : 'bg-warning-subtle'} p-4 rounded-circle d-inline-block mb-4`}>
              {passed ? (
                <CheckCircle size={64} className="text-success" />
              ) : (
                <AlertCircle size={64} className="text-warning" />
              )}
            </div>
            
            <h3 className="mb-3">
              {passed ? 'Congratulations!' : 'Test Complete'}
            </h3>
            
            <p className="text-secondary-light mb-4">
              {passed 
                ? 'You have passed the communication assessment! Check your email for next steps.'
                : 'Thank you for taking the test. Unfortunately, you did not meet the minimum score.'
              }
            </p>

            <div className="bg-light p-4 rounded mb-4">
              <div className="row">
                <div className="col-6 mb-3">
                  <p className="text-secondary-light mb-1">Your Score</p>
                  <h2 className={passed ? 'text-success' : 'text-warning'}>
                    {result.total_score} / {result.max_score}
                  </h2>
                </div>
                <div className="col-6 mb-3">
                  <p className="text-secondary-light mb-1">Status</p>
                  <h5 className={passed ? 'text-success' : 'text-warning'}>
                    {passed ? 'Passed' : 'Not Passed'}
                  </h5>
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

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <RefreshCw size={48} className="spin text-primary" />
    </div>
  );
};

export default CommunicationTest;

