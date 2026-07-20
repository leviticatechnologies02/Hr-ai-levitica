import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JobList from '../jobs/JobList';
import RecruiterDashboardLayout from '../../../app/layouts/RecruiterDashboardLayout';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const stageColor = (stage) => {
  const s = (stage || '').toLowerCase();
  if (s.includes('reject')) return 'danger';
  if (s.includes('offer') || s.includes('hire')) return 'success';
  if (s.includes('applied')) return 'info';
  return 'primary';
};

const RecruiterDashboardHome = () => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);
  const [showCandidateProfile, setShowCandidateProfile] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const [kpis, setKpis] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiRes, candidatesRes, stagesRes] = await Promise.all([
        fetch(`${BASE_URL}${API_ENDPOINTS.ANALYTICS.KPIS}`),
        fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATES}`, { headers: { ...authHeaders() } }),
        fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.STAGES}`),
      ]);
      if (kpiRes.ok) setKpis(await kpiRes.json());
      if (candidatesRes.ok) {
        setCandidates(await candidatesRes.json());
      } else if (candidatesRes.status === 401) {
        setError('Please log in to view live candidate data.');
      }
      if (stagesRes.ok) {
        const s = await stagesRes.json();
        setStages(s.sort((a, b) => a.order - b.order).map((x) => x.name));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data from the server');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const recentApplicants = candidates.slice(0, 3);

  const AnimatedNumber = ({ value }) => {
    const [current, setCurrent] = useState(0);
    useEffect(() => {
      let start = 0;
      const end = value || 0;
      const increment = Math.max(1, Math.floor(end / 60));
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCurrent(end);
          clearInterval(timer);
        } else {
          setCurrent(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }, [value]);
    return <span>{current.toLocaleString()}</span>;
  };

  const handleViewCandidate = (id) => {
    const c = candidates.find((x) => x.id === id);
    setSelectedCandidate(c);
    setNoteDraft(c?.notes || '');
    setShowCandidateProfile(true);
    setShowCandidates(false);
  };

  const updateCandidateStage = async (candidateId, newStage) => {
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATE(candidateId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) throw new Error('Failed to update stage');
      const updated = await res.json();
      setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCandidate(updated);
      toast.success(`Moved to ${newStage}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update candidate stage');
    }
  };

  const handleMoveToNextStage = () => {
    if (!selectedCandidate || stages.length === 0) return;
    const idx = stages.indexOf(selectedCandidate.stage);
    const next = idx >= 0 && idx < stages.length - 1 ? stages[idx + 1] : null;
    if (!next) {
      toast.info('This candidate is already in the last configured stage.');
      return;
    }
    updateCandidateStage(selectedCandidate.id, next);
  };

  const handleReject = () => {
    if (!selectedCandidate) return;
    const rejectStage = stages.find((s) => s.toLowerCase().includes('reject'));
    if (!rejectStage) {
      toast.info('No "Rejected" stage is configured yet — add one on the Stages page first.');
      return;
    }
    updateCandidateStage(selectedCandidate.id, rejectStage);
  };

  const handleSaveNote = async () => {
    if (!selectedCandidate) return;
    setSavingNote(true);
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATE(selectedCandidate.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ notes: noteDraft }),
      });
      if (!res.ok) throw new Error('Failed to save note');
      const updated = await res.json();
      setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCandidate(updated);
      toast.success('Note saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className='container-fluid py-4 bg-neutral-50'>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className='mb-24'>
        <h4 className='mb-8'>Recruiter Dashboard</h4>
        <p className='text-secondary-light'>Track your hiring progress and manage jobs efficiently.</p>
      </div>

      {loading && <div className="text-muted small mb-3">Loading dashboard…</div>}
      {error && <div className="alert alert-warning py-2">{error}</div>}

      <div className='row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4 mb-24'>
        <div className='col'>
          <div className='card shadow-none border bg-gradient-start-1 h-100'>
            <div className='card-body p-20'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
                <div>
                  <p className='fw-medium text-primary-light mb-1'>Active Jobs</p>
                  <h6 className='mb-0'><AnimatedNumber value={kpis?.active_jobs} /></h6>
                </div>
                <div className='w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center'>
                  <Icon icon='mdi:briefcase-outline' className='text-white text-2xl mb-0' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='card shadow-none border bg-gradient-start-2 h-100'>
            <div className='card-body p-20'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
                <div>
                  <p className='fw-medium text-primary-light mb-1'>Applications Received</p>
                  <h6 className='mb-0'><AnimatedNumber value={kpis?.total_applications} /></h6>
                </div>
                <div className='w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center'>
                  <Icon icon='fa-solid:award' className='text-white text-2xl mb-0' />
                </div>
              </div>
              <p className='fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2'>
                <span className='d-inline-flex align-items-center gap-1 text-primary-600'>
                  <Icon icon='bxs:up-arrow' className='text-xs' /> {kpis?.applications_this_week ?? 0}
                </span>
                New this week
              </p>
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='card shadow-none border bg-gradient-start-3 h-100'>
            <div className='card-body p-20'>
              <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
                <div>
                  <p className='fw-medium text-primary-light mb-1'>Candidates in Pipeline</p>
                  <h6 className='mb-0'><AnimatedNumber value={candidates.length} /></h6>
                </div>
                <div className='w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center'>
                  <Icon icon='fluent:people-20-filled' className='text-white text-2xl mb-0' />
                </div>
              </div>
              {kpis?.avg_time_to_hire_days != null && (
                <p className='fw-medium text-sm text-primary-light mt-12 mb-0'>
                  Avg. time to hire: {kpis.avg_time_to_hire_days} days
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='card border shadow-none mb-24'>
        <div className='card-body'>
          <div className='d-flex align-items-center justify-content-between flex-wrap gap-2 mb-12'>
            <h5 className='mb-0'>Quick Actions</h5>
            <span className='text-secondary-light text-sm'>Need to move fast? Use these actions.</span>
          </div>
          <div className='d-flex flex-wrap justify-content-center gap-3'>
            <Link to='/jobs/new' className='btn btn-outline-primary d-flex align-items-center gap-2'>
              <Icon icon='heroicons:plus'/> <span>Create Job</span>
            </Link>
            <Link to='/candidates' className='btn btn-outline-primary d-flex align-items-center gap-2'>
              <Icon icon='solar:eye-linear'/> <span>View Candidates</span>
            </Link>
            <button className='btn btn-outline-primary d-flex align-items-center gap-2' onClick={() => setShowImportModal(true)}>
              <Icon icon='mdi:tray-arrow-down'/> <span>Import Candidates</span>
            </button>
            <button className='btn btn-outline-primary d-flex align-items-center gap-2' onClick={() => setShowPostModal(true)}>
              <Icon icon='mdi:send-outline'/> <span>Post to Job Board</span>
            </button>
          </div>
        </div>
      </div>

      <div className='card border shadow-none mb-24'>
        <div className='card-body p-0'>
          <JobList />
        </div>
      </div>
      <div className='card border shadow-none'>
        <div className='card-header bg-base border-bottom'>
          <div className='d-flex align-items-center justify-content-between'>
            <h5 className='mb-0'>Recent Applicants</h5>
            <div className='d-flex align-items-center gap-3'>
              <span className='text-secondary-light text-sm'>Showing latest {recentApplicants.length}</span>
              <button onClick={() => setShowCandidates(true)} className='text-primary-600 fw-semibold text-sm border-0 bg-transparent'>View All Applicants →</button>
            </div>
          </div>
        </div>
        <div className='card-body p-0'>
          <div className='table-responsive'>
            <table className='table mb-0'>
              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>ROLE</th>
                  <th>STAGE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentApplicants.map((a) => (
                  <tr key={a.id}>
                    <td className='fw-semibold'>{a.name}</td>
                    <td className='text-secondary-light'>{a.role}</td>
                    <td>
                      <span className={`badge bg-${stageColor(a.stage)}-subtle text-${stageColor(a.stage)}-main`}>{a.stage}</span>
                    </td>
                    <td>
                      <button className='text-primary-600 fw-semibold border-0 bg-transparent' onClick={() => handleViewCandidate(a.id)}>View Profile</button>
                    </td>
                  </tr>
                ))}
                {!loading && recentApplicants.length === 0 && (
                  <tr><td colSpan={4} className='text-center text-secondary-light py-3'>No candidates in your pipeline yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCandidates && (
        <div className='position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3'>
          <div className='card w-100' style={{maxWidth: '960px', maxHeight: '80vh', overflowY: 'auto'}}>
            <div className='card-header d-flex align-items-center justify-content-between'>
              <h6 className='mb-0'>All Candidates</h6>
              <button className='btn btn-sm btn-outline-secondary' onClick={() => setShowCandidates(false)}>Close</button>
            </div>
            <div className='card-body p-0'>
              <div className='table-responsive'>
                <table className='table mb-0'>
                  <thead>
                    <tr>
                      <th>CANDIDATE</th>
                      <th>ROLE</th>
                      <th>EMAIL</th>
                      <th>STAGE</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((a) => (
                      <tr key={a.id}>
                        <td className='fw-medium'>{a.name}</td>
                        <td>{a.role}</td>
                        <td>{a.email}</td>
                        <td><span className={`badge bg-${stageColor(a.stage)}-subtle text-${stageColor(a.stage)}-main`}>{a.stage}</span></td>
                        <td><button className='btn btn-link text-primary-600 p-0' onClick={() => handleViewCandidate(a.id)}>View Profile</button></td>
                      </tr>
                    ))}
                    {candidates.length === 0 && (
                      <tr><td colSpan={5} className='text-center text-secondary-light py-3'>No candidates yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCandidateProfile && selectedCandidate && (
        <div className='position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3'>
          <div className='card w-100' style={{maxWidth: '840px'}}>
            <div className='card-header d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center gap-3'>
                <span className='w-44-px h-44-px bg-primary-600 text-white rounded-circle d-flex justify-content-center align-items-center fw-bold'>
                  {selectedCandidate.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h6 className='mb-4'>{selectedCandidate.name}</h6>
                  <span className='text-primary-600 fw-medium text-sm'>{selectedCandidate.role}</span>
                </div>
              </div>
              <button className='btn btn-sm btn-outline-secondary' onClick={() => { setShowCandidateProfile(false); setSelectedCandidate(null); }}>Close</button>
            </div>
            <div className='card-body'>
              <div className='row g-3'>
                <div className='col-md-6'>
                  <div className='border rounded p-3 mb-3'>
                    <h6 className='mb-12'>Contact Information</h6>
                    <div className='text-secondary-light text-sm'>{selectedCandidate.email}</div>
                  </div>
                  <div className='border rounded p-3 mb-3'>
                    <h6 className='mb-12'>Skills</h6>
                    <div className='text-secondary-light text-sm'>{selectedCandidate.skills || 'Not provided'}</div>
                  </div>
                  {selectedCandidate.resume_url && (
                    <div className='border rounded p-3'>
                      <h6 className='mb-12'>Resume</h6>
                      <a href={selectedCandidate.resume_url} target='_blank' rel='noreferrer' className='text-primary-600 text-sm'>View Resume</a>
                    </div>
                  )}
                </div>
                <div className='col-md-6'>
                  <div className='border rounded p-3 mb-3'>
                    <h6 className='mb-12'>Current Stage</h6>
                    <span className={`badge bg-${stageColor(selectedCandidate.stage)}-subtle text-${stageColor(selectedCandidate.stage)}-main`}>{selectedCandidate.stage}</span>
                  </div>
                  <div className='border rounded p-3 mb-3'>
                    <h6 className='mb-12'>Recruiter Comments</h6>
                    <div className='text-secondary-light text-sm'>{selectedCandidate.recruiter_comments || 'No comments yet.'}</div>
                  </div>
                  <div className='border rounded p-3'>
                    <h6 className='mb-12'>Notes</h6>
                    <textarea className='form-control mb-2' rows={3} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
                    <button className='btn btn-sm btn-outline-primary' onClick={handleSaveNote} disabled={savingNote}>
                      {savingNote ? 'Saving…' : 'Save Note'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='card-footer d-flex flex-wrap justify-content-center gap-2'>
              <button className='btn btn-success btn-sm' onClick={handleMoveToNextStage}>Move to Next Stage</button>
              <button className='btn btn-danger btn-sm' onClick={handleReject}>Reject</button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className='position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3'>
          <div className='card w-100' style={{maxWidth: '520px'}}>
            <div className='card-header d-flex align-items-center justify-content-between'>
              <h6 className='mb-0'>Import Candidates</h6>
              <button className='btn btn-sm btn-outline-secondary' onClick={() => setShowImportModal(false)}>Close</button>
            </div>
            <div className='card-body'>
              <p className='text-secondary-light'>Bulk CSV candidate import isn't wired to a backend endpoint yet — this is a placeholder.</p>
              <button className='btn btn-primary' disabled>Choose CSV File</button>
            </div>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className='position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3'>
          <div className='card w-100' style={{maxWidth: '520px'}}>
            <div className='card-header d-flex align-items-center justify-content-between'>
              <h6 className='mb-0'>Post to Job Board</h6>
              <button className='btn btn-sm btn-outline-secondary' onClick={() => setShowPostModal(false)}>Close</button>
            </div>
            <div className='card-body'>
              <p className='text-secondary-light'>There's no external job-board integration in the backend yet — this is a placeholder for a future feature.</p>
              <div className='d-grid gap-2'>
                {['LinkedIn', 'Indeed', 'Glassdoor', 'Monster', 'AngelList'].map((b) => (
                  <button key={b} disabled className='btn btn-outline-secondary d-flex align-items-center justify-content-between'>
                    <span>{b}</span>
                    <span className='text-sm text-secondary-light'>Not connected</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = () => {
  return (
    <RecruiterDashboardLayout>
      <RecruiterDashboardHome />
    </RecruiterDashboardLayout>
  );
};

export default AdminPanel;
