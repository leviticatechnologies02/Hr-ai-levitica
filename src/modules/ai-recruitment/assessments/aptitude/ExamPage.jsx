import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, API_ENDPOINTS } from '../../../../shared/constants/api.config';

const OPTION_KEYS = ['A', 'B', 'C', 'D'];

const ExamPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [candidateId, setCandidateId] = useState(null);
  const [examLoading, setExamLoading] = useState(true);
  const [examError, setExamError] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [showWarning, setShowWarning] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(true);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [showAnswerWarning, setShowAnswerWarning] = useState(false);
  const [securityViolations, setSecurityViolations] = useState(0);
  const [showSecurityWarning, setShowSecurityWarning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const securityViolationSkipRef = useRef(0);
  const violationHistoryRef = useRef({ lastType: '', lastTime: 0 });
  const VIOLATION_DEBOUNCE_MS = 1500;

  const shouldSkipSecurityViolation = () => Date.now() < securityViolationSkipRef.current;
  const scheduleSecurityViolationSkip = (duration = 1500) => {
    securityViolationSkipRef.current = Date.now() + duration;
  };

  // Submits real answers to POST /api/assessment/aptitude/submit. Declared before
  // handleAutoSubmit (and included in its deps below) so the callback always sees the
  // latest candidateId/selectedAnswers rather than a stale closure from first render.
  const submitExamToServer = useCallback(async () => {
    if (!candidateId) return null;
    try {
      const answersPayload = {};
      Object.entries(selectedAnswers).forEach(([qId, letter]) => {
        answersPayload[qId] = letter;
      });
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.ASSESSMENT_APTITUDE.SUBMIT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: candidateId, answers: answersPayload }),
      });
      if (!res.ok) throw new Error('Failed to submit the exam');
      const result = await res.json();
      setFinalResult(result);
      return result;
    } catch (err) {
      console.error(err);
      setExamError('Your exam finished but we could not reach the server to submit it. Please contact support.');
      return null;
    }
  }, [candidateId, selectedAnswers]);

  // Auto-submit function (defined early to avoid reference errors)
  const handleAutoSubmit = useCallback(async () => {
    // Hide all warnings before showing success
    setShowWarning(false);
    setShowSecurityWarning(false);
    setShowSubmitConfirm(false);
    setShowTimeUp(false);

    await submitExamToServer();

    setShowSuccess(true);
    setIsExamStarted(false);

    // Exit fullscreen before redirecting
    const exitFullscreen = () => {
      try {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      } catch (error) {
        console.log('Error exiting fullscreen:', error);
      }
    };

    exitFullscreen();

    // Hide success message after 3 seconds and redirect to home
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/'); // Redirect to home page
    }, 3000);
  }, [navigate, submitExamToServer]);

  const registerSecurityViolation = useCallback(({ type = 'generic', autoHide = true, skipDuration = 0 } = {}) => {
    const now = Date.now();
    if (type && violationHistoryRef.current.lastType === type && now - violationHistoryRef.current.lastTime < VIOLATION_DEBOUNCE_MS) {
      return;
    }
    violationHistoryRef.current = { lastType: type, lastTime: now };
    if (skipDuration > 0) {
      scheduleSecurityViolationSkip(skipDuration);
    }
    setShowSecurityWarning(true);
    if (autoHide) {
      setTimeout(() => setShowSecurityWarning(false), 3000);
    }
    setSecurityViolations(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setTimeout(() => {
          handleAutoSubmit();
        }, 2000);
      }
      return newCount;
    });
  }, [handleAutoSubmit]);


  // Real questions fetched from the backend aptitude exam (/api/assessment/aptitude/start).
  // Backend returns options as {A,B,C,D}; we keep them as an ordered array here so the
  // existing radio-button rendering below doesn't need to change, and track the selected
  // OPTION LETTER (not index) in selectedAnswers since that's what /submit expects.
  useEffect(() => {
    const loadExam = async () => {
      setExamLoading(true);
      setExamError(null);
      try {
        const email = localStorage.getItem('aptitude_candidate_email');
        const storedId = localStorage.getItem('aptitude_candidate_id');
        if (!email) {
          setExamError('No verified candidate found. Please log in again.');
          setExamLoading(false);
          return;
        }
        const res = await fetch(`${BASE_URL}${API_ENDPOINTS.ASSESSMENT_APTITUDE.START}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: storedId ? Number(storedId) : 0, email }),
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.detail || 'Failed to start the exam');
        }
        const data = await res.json();
        const mapped = (data.questions || []).map((q) => ({
          id: q.no,
          question: q.question,
          optionKeys: OPTION_KEYS.filter((k) => q.options && q.options[k] !== undefined),
          options: OPTION_KEYS.filter((k) => q.options && q.options[k] !== undefined).map((k) => q.options[k]),
        }));
        setQuestions(mapped);
        setCandidateId(data.candidate_id);
        localStorage.setItem('aptitude_candidate_id', String(data.candidate_id));
      } catch (err) {
        console.error(err);
        setExamError(err.message || 'Failed to load the exam');
      } finally {
        setExamLoading(false);
      }
    };
    loadExam();
  }, []);

  // Time limit comes from /instructions (fetched on the instructions page and cached);
  // fall back to 30 minutes if it isn't available for some reason.
  useEffect(() => {
    const storedLimit = localStorage.getItem('aptitude_time_limit_seconds');
    if (storedLimit) setTimeLeft(Number(storedLimit));
  }, []);


  // Timer effect
  useEffect(() => {
    let interval = null;
    if (!examLoading && isExamStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time's up - show notification and auto submit
      setShowTimeUp(true);
      setTimeout(() => {
        setShowTimeUp(false);
        handleAutoSubmit();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isExamStarted, timeLeft]);


  // Fullscreen and ESC key warning effect
  useEffect(() => {
    // Define requestFullscreen function first, before it's used
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          await document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) {
          await document.documentElement.msRequestFullscreen();
        }
      } catch (error) {
        console.log('Fullscreen not supported or denied:', error);
      }
    };

    // Request fullscreen immediately when exam starts
    requestFullscreen();

    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      registerSecurityViolation({ type: 'contextmenu' });
    };

    // Disable text selection
    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable common keyboard shortcuts and detect Alt+Tab
    const handleSecurityKeyDown = (e) => {
      // Detect Alt+Tab, Alt+Shift+Tab, Ctrl+Alt+Tab
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        registerSecurityViolation({ type: 'alttab', autoHide: false, skipDuration: 2200 });
        return;
      }

      // Detect Windows key combinations
      if (e.key === 'Meta' || (e.metaKey && ['Tab', 'L', 'R', 'D', 'E'].includes(e.key))) {
        e.preventDefault();
        registerSecurityViolation({ type: 'windowsKey' });
        return;
      }

      // Detect Alt+F4 (close window)
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        registerSecurityViolation({ type: 'altF4' });
        return;
      }

      // Detect Ctrl+Alt combinations
      if (e.ctrlKey && e.altKey) {
        e.preventDefault();
        registerSecurityViolation({ type: 'ctrlAlt' });
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        const blockedKeys = ['c', 'C', 'v', 'V', 'a', 'A', 'x', 'X', 's', 'S', 'p', 'P', 'i', 'I', 'u', 'U', 'h', 'H', 'f', 'F', 'g', 'G'];
        if (blockedKeys.includes(e.key)) {
          e.preventDefault();
          registerSecurityViolation({ type: 'keyboardShortcut' });
        }
      }

      // Block function keys
      if (['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
        e.preventDefault();
        registerSecurityViolation({ type: 'functionKey' });
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleSecurityKeyDown);

    // Disable text selection globally
    document.body.style.userSelect = 'none';

    // Window focus and visibility detection
    const handleWindowBlur = () => {
      if (shouldSkipSecurityViolation()) {
        return;
      }
      registerSecurityViolation({ type: 'blur' });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (shouldSkipSecurityViolation()) {
          return;
        }
        registerSecurityViolation({ type: 'visibility' });
      }
    };

    const handleWindowFocus = () => {
      // Re-request fullscreen when window regains focus
      requestFullscreen();
    };

    // Add focus/blur event listeners
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        
        // Immediately try to prevent fullscreen exit by re-entering
        const preventFullscreenExit = () => {
          try {
            if (document.documentElement.requestFullscreen) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else if (document.documentElement.webkitRequestFullscreen) {
              document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
              document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.msRequestFullscreen) {
              document.documentElement.msRequestFullscreen();
            }
          } catch (error) {
            console.log('Error preventing fullscreen exit:', error);
          }
        };
        
        // Try to prevent exit immediately
        preventFullscreenExit();
        setTimeout(preventFullscreenExit, 50);
        setTimeout(preventFullscreenExit, 100);
        
        registerSecurityViolation({ type: 'esc' });
      }
    };

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      if (shouldSkipSecurityViolation()) {
        return;
      }
      if (!document.fullscreenElement && !document.webkitFullscreenElement &&
        !document.mozFullScreenElement && !document.msFullscreenElement) {
        // Check if security warning modal is currently displayed
        const warningModal = document.querySelector('.modal.show');
        const isSecurityWarningShowing = warningModal && warningModal.querySelector('.modal-title')?.textContent?.includes('Security Warning');
        
        // Only show warning and re-enter if security warning is not already showing
        if (!isSecurityWarningShowing) {
          registerSecurityViolation({ type: 'fullscreen' });
          setTimeout(() => {
            requestFullscreen();
          }, 1000);
        } else {
          // If warning is already showing, just try to re-enter fullscreen silently
          // Don't increment violations again
          setTimeout(() => {
            requestFullscreen();
          }, 100);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleSecurityKeyDown);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [registerSecurityViolation]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, optionLetter) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionLetter
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };


  const handlePreviousAnswer = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      console.log("Already at the first question");
    }
  };


  const handleSubmitExam = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = async () => {
    // Hide all warnings before showing success
    setShowSubmitConfirm(false);
    setShowWarning(false);
    setShowSecurityWarning(false);
    setShowTimeUp(false);

    await submitExamToServer();

    setShowSuccess(true);
    setIsExamStarted(false);

    // Exit fullscreen before redirecting
    const exitFullscreen = () => {
      try {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      } catch (error) {
        console.log('Error exiting fullscreen:', error);
      }
    };

    exitFullscreen();

    // Hide success message after 3 seconds and redirect to home
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/');
    }, 3000);
  };

  const cancelSubmit = () => {
    setShowSubmitConfirm(false);
  };

  const handleWarningClose = () => {
    setShowWarning(false);

    // Re-enter fullscreen when warning is closed
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          await document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) {
          await document.documentElement.msRequestFullscreen();
        }
      } catch (error) {
        console.log('Fullscreen not supported or denied:', error);
      }
    };

    setTimeout(() => {
      requestFullscreen();
    }, 200);
  };

  const handleSkipQuestion = () => {
    setSkippedQuestions(prev => [...prev, currentQ.id]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };



  const handleSubmitAnswer = () => {
    // Check if the user has selected an answer
    if (selectedAnswers[currentQ.id] !== undefined) {
      setShowAnswerWarning(false);

      // If not the last question, go to next
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // If it's the last question, submit the exam
        console.log("Exam submitted successfully");
        setIsSubmitted(true);
      }

    } else {
      // Show warning for unanswered question
      setShowAnswerWarning(true);
      setTimeout(() => setShowAnswerWarning(false), 3000);
    }
  };

  const getQuestionStatus = (questionId) => {
    if (selectedAnswers[questionId] !== undefined) {
      return 'answered';
    } else if (skippedQuestions.includes(questionId)) {
      return 'skipped';
    } else if (questionId === currentQ.id) {
      return 'current';
    } else {
      return 'unanswered';
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSecurityWarningClose = () => {
    setShowSecurityWarning(false);
    
    // Re-enter fullscreen when user clicks "Understood"
    const reEnterFullscreen = () => {
      const attemptFullscreen = () => {
        try {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {
              // Retry after a short delay
              setTimeout(attemptFullscreen, 200);
            });
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          }
        } catch (error) {
          console.log('Error re-entering fullscreen:', error);
        }
      };
      
      // First attempt immediately
      attemptFullscreen();
      // Second attempt after delay in case first fails
      setTimeout(attemptFullscreen, 300);
      // Third attempt as backup
      setTimeout(attemptFullscreen, 800);
    };

    reEnterFullscreen();
  };

  if (examLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary">
        <div className="text-white text-center">
          <div className="spinner-border text-white mb-3" role="status"></div>
          <p className="fs-5">Loading your exam…</p>
        </div>
      </div>
    );
  }

  if (examError && questions.length === 0) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary">
        <div className="bg-white rounded-3 shadow-lg p-5 text-center" style={{ maxWidth: '480px' }}>
          <h4 className="text-danger mb-3">Couldn't load the exam</h4>
          <p className="text-muted">{examError}</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/assessment/aptitude/login')}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gradient-primary exam-fullscreen">

      {/* Header */}
      <header className="shadow-lg sticky-top">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            <div className="col-4">
              <h1 className="text-white mb-0 fw-bold fs-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>Appitude Hire</h1>
            </div>
            <div className="col-4 text-center">
              <div className="text-white">
                <div className="fs-4 fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>{formatTime(timeLeft)}</div>
                <div className="small" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>TIME LEFT</div>
              </div>
            </div>
            <div className="col-4 text-end">
              <div className="text-white">
                <div className="small" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>QUESTIONS ATTEMPTED: {Object.keys(selectedAnswers).length}/{questions.length}</div>
                <button
                  className="btn btn-link text-white p-0 text-decoration-underline"
                  onClick={() => setShowSubmitConfirm(true)}
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                >
                  QUIT ASSESSMENT
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container-fluid py-2">
        <div className="row">
          <div className="col-12">
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid py-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="row g-4 h-100">
          {/* Left Side - Question List */}
          <div className="col-lg-3 h-100">
            <div className="bg-primary rounded-3 shadow-lg p-3 h-100">
              <h5 className="text-primary mb-3 fw-bold">Questions</h5>
              <div className="row g-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {questions.map((question, index) => {
                  const status = getQuestionStatus(question.id);
                  return (
                    <div key={question.id} className="col-4 mb-2">
                      <button
                        className={`btn btn-sm w-100 ${status === 'current'
                            ? 'btn-primary'
                            : status === 'answered'
                              ? 'btn-success'
                              : status === 'skipped'
                                ? 'btn-warning'
                                : 'btn-outline-secondary'
                          }`}
                        onClick={() => setCurrentQuestion(index)}
                        style={{ minHeight: '35px' }}
                      >
                        {question.id}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-3">
                <h6 className="text-primary mb-2">Status:</h6>
                <div className="small text-muted">
                  <div className="d-flex align-items-center mb-1">
                    <div className="bg-primary rounded me-2" style={{ width: '12px', height: '12px' }}></div>
                    Current
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <div className="bg-success rounded me-2" style={{ width: '12px', height: '12px' }}></div>
                    Answered
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <div className="bg-danger rounded me-2" style={{ width: '12px', height: '12px' }}></div>
                    Skipped
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Question Content */}
          <div className="col-lg-9 h-100">
            <div className="bg-white rounded-3 shadow-lg p-4 h-100">
              <div className="mb-4">
                <h4 className="text-dark mb-4 fw-bold">
                  {currentQ.question}
                </h4>
                <hr className="border-primary" style={{ borderWidth: '2px' }} />
              </div>

              {/* Answer Options */}
              <div className="mb-4">
                {currentQ.options.map((option, index) => (
                  <div key={index} className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question-${currentQ.id}`}
                        id={`option-${index}`}
                        checked={selectedAnswers[currentQ.id] === currentQ.optionKeys[index]}
                        onChange={() => handleAnswerSelect(currentQ.id, currentQ.optionKeys[index])}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <label
                        className="form-check-label text-dark fw-semibold ms-2"
                        htmlFor={`option-${index}`}
                        style={{ fontSize: '16px' }}
                      >
                        {option}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="text-center">

                <button
                  className="btn btn-outline-primary btn-lg me-3 px-5 py-2"
                  onClick={handlePreviousAnswer}
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  Previous
                </button>
                <button
                  className="btn btn-outline-primary btn-lg px-5 py-2"
                  onClick={handleSkipQuestion}
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  NEXT
                </button>
                
                <button
                  className={`btn ${isSubmitted ? 'btn-primary' : 'btn-outline-primary'} btn-lg me-3 px-5 py-2 m-3`}
                  onClick={handleSubmitExam}
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  SUBMIT
                </button>

              </div>

              {/* Answer Warning */}
              {showAnswerWarning && (
                <div className="mt-3 text-center">
                  <p className="text-danger fw-bold mb-0" style={{ fontSize: '14px' }}>
                    ⚠️ Please select an answer before submitting.
                  </p>
                </div>
              )}

              {/* Skip Instruction */}
              <div className="mt-4 text-center">
                <p className="text-muted small">
                  If you skip, you can attempt this question again after finishing all questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Security Warning Modal */}
      {showSecurityWarning && !showSuccess && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger">
                <h5 className="modal-title text-white fw-bold">🚨 Security Warning</h5>
              </div>
              <div className="modal-body">
                <p className="text-dark">
                  <strong>Security Violation Detected!</strong>
                </p>
                <div className="alert alert-danger">
                  <div className="d-flex align-items-center mb-2">
                    <strong className="me-2">Current Violations:</strong>
                    <span className="badge bg-danger fs-5">{securityViolations} / 5</span>
                  </div>
                  <div className="mt-2">
                    <strong>⚠️ Warning:</strong> You have violated exam security rules {securityViolations} time(s).
                  </div>
                </div>
                
                {securityViolations < 5 ? (
                  <div className="alert alert-warning">
                    <strong>Remaining Warnings:</strong> {5 - securityViolations} more violation(s) before automatic submission.
                    <br />
                    <strong className="text-danger mt-2 d-block">After 5 warnings, your exam will be automatically submitted!</strong>
                  </div>
                ) : (
                  <div className="alert alert-danger">
                    <strong className="fs-5">⚠️ Maximum Warnings Reached!</strong>
                    <br />
                    <strong>Your exam will be automatically submitted now.</strong>
                  </div>
                )}
                
                <div className="alert alert-info mt-3">
                  <strong>⚠️ Important:</strong> Please stay in fullscreen mode during the exam. Click "Understood" to re-enter fullscreen mode.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary btn-lg w-100"
                  onClick={handleSecurityWarningClose}
                  disabled={securityViolations >= 5}
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && !showSuccess && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-info">
                <h5 className="modal-title text-white fw-bold">📝 Submit Exam</h5>
              </div>
              <div className="modal-body">
                <p className="text-dark">
                  <strong>Are you sure you want to submit your exam?</strong>
                </p>
                <p className="text-muted">
                  Once submitted, you cannot make any changes to your answers.
                </p>
                <div className="alert alert-info">
                  <strong>Answered Questions:</strong> {Object.keys(selectedAnswers).length} of {questions.length}
                </div>
                <div className="alert alert-warning">
                  <strong>Note:</strong> Make sure you have reviewed all your answers before submitting.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelSubmit}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={confirmSubmit}
                >
                  Yes, Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Up Notification */}
      {showTimeUp && !showSuccess && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title text-dark fw-bold">⏰ Time's Up!</h5>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <i className="fas fa-clock text-warning" style={{ fontSize: '3rem' }}></i>
                </div>
                <p className="text-dark fw-semibold">
                  Your exam time has expired. The assignment will be automatically submitted.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Success Notification */}
      {showSuccess && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10001 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <span className="me-2">✓</span>
                  Submitted Successfully
                </h5>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <div className="display-4 text-success mb-2">✓</div>
                  <p className="fw-bold fs-5 mb-2">Your assessment has been submitted successfully!</p>
                  {finalResult ? (
                    <p className="text-muted mb-0">
                      Score: {finalResult.score}/{questions.length} — {finalResult.status === 'Qualified' ? 'You qualified for the next round.' : 'Thank you for taking the test.'}
                    </p>
                  ) : (
                    <p className="text-muted mb-0">Thank you for completing the exam.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
