import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, API_ENDPOINTS } from '../../../../shared/constants/api.config';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setMessage('OTP expired. Please request a new one.');
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.fullName || !formData.email) return;
    setSending(true);
    setMessage('');
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.ASSESSMENT_APTITUDE.SEND_OTP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.fullName, email: formData.email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to send OTP');
      }
      setIsOtpSent(true);
      setIsTimerActive(true);
      setTimeLeft(300);
      setMessage('OTP sent successfully! Check your email.');
    } catch (err) {
      setMessage(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifying(true);
    setMessage('');
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.ASSESSMENT_APTITUDE.VERIFY_OTP}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Invalid OTP');
      }
      // Persist candidate identity for the instructions/exam pages, which are
      // separate routes and can't receive this via component state/props.
      localStorage.setItem('aptitude_candidate_email', formData.email);
      localStorage.setItem('aptitude_candidate_name', formData.fullName);

      setMessage('OTP verified successfully! Redirecting to instructions...');
      setTimeout(() => {
        navigate('/assessment/aptitude/instructions');
      }, 2000);
    } catch (err) {
      setMessage(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-vh-100">
      {/* Header */}
      <header className="shadow-lg sticky-top">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            <div className="col-6">
              <h1 className="text-primary mb-0 fw-bold fs-3">Appitude Hire</h1>
            </div>
            <div className="col-6 text-end">
              <button className="btn btn-outline-light me-2">Help</button>
              <button className="btn btn-outline-light">Contact</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="row g-4">
              {/* Login Form */}
              <div className="col-lg-6">
                <div className="bg-primary rounded-3 shadow-lg p-4 h-100">
                  <h2 className="text-white text-center mb-4 fw-bold">
                    Verify your identity
                  </h2>
                  
                  <form>
                    {/* Full Name Input */}
                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label text-white">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Email Input */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    {/* Send OTP Button */}
                    <div className="mb-3">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={!formData.fullName || !formData.email || sending}
                        className="btn btn-warning w-100"
                      >
                        {sending ? 'Sending…' : 'Send OTP'}
                      </button>
                    </div>

                    {/* OTP Input (Hidden until OTP is sent) */}
                    {isOtpSent && (
                      <div>
                        <div className="mb-3">
                          <label htmlFor="otp" className="form-label text-white">
                            Enter OTP
                          </label>
                          <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="form-control text-center fs-5"
                            placeholder="000000"
                            maxLength="6"
                            style={{
                              backgroundColor: '#f8f9fa',
                              border: '2px solid #5a7ba7',
                              color: '#2c3e50',
                              fontWeight: 'bold',
                              letterSpacing: '0.2em'
                            }}
                          />
                        </div>

                        {/* Timer */}
                        <div className="text-center mb-3">
                          <p className="text-warning mb-0">
                            OTP valid for {formatTime(timeLeft)}
                          </p>
                        </div>

                        {/* Verify Button */}
                        <div className="mb-3">
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={otp.length !== 6 || verifying}
                            className="btn btn-success w-100"
                          >
                            {verifying ? 'Verifying…' : 'Verify & Start Exam'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Message Display */}
                    {message && (
                      <div className="alert alert-info text-center">
                        {message}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Instructions Panel */}
              <div className="col-lg-6">
                <div className="bg-primary rounded-3 shadow-lg p-4 h-100">
                  <h3 className="text-white mb-4 fw-bold">
                    Exam Instructions
                  </h3>
                  
                  <div className="text-white">
                    <div className="mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-warning rounded-circle me-3 mt-1" style={{width: '8px', height: '8px'}}></div>
                        <p className="mb-0">
                          <strong>Reading Section:</strong> You will have 15 minutes to complete reading comprehension questions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-warning rounded-circle me-3 mt-1" style={{width: '8px', height: '8px'}}></div>
                        <p className="mb-0">
                          <strong>Multiple Choice Questions:</strong> Answer 25 questions covering various aptitude topics.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-warning rounded-circle me-3 mt-1" style={{width: '8px', height: '8px'}}></div>
                        <p className="mb-0">
                          <strong>Timer Countdown:</strong> Each section has a specific time limit. Monitor the timer carefully.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-warning rounded-circle me-3 mt-1" style={{width: '8px', height: '8px'}}></div>
                        <p className="mb-0">
                          <strong>Listening Section:</strong> Audio-based questions will test your comprehension skills.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-warning rounded-circle me-3 mt-1" style={{width: '8px', height: '8px'}}></div>
                        <p className="mb-0">
                          <strong>Results:</strong> Your exam results will be sent to your registered email address.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-warning rounded-circle me-3 mt-1" style={{width: '8px', height: '8px'}}></div>
                        <p className="mb-0">
                          <strong>No Back Navigation:</strong> Once you move to the next question, you cannot go back.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-warning rounded-circle me-3 mt-1" style={{width: '8px', height: '8px'}}></div>
                        <p className="mb-0">
                          <strong>Stable Internet:</strong> Ensure you have a stable internet connection throughout the exam.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-warning bg-opacity-25 border border-warning rounded">
                    <p className="text-warning mb-0 fw-semibold">
                      ⚠️ Important: The exam will automatically submit when the time expires.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
