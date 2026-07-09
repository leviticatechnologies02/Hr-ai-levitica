import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, User, Calendar, MapPin, Phone, Mail, FileText, MoreVertical } from 'lucide-react';
import { toast as showToast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

const PipelineDragDrop = () => {

  const getStageBadgeClass = (stageIdOrName) => {
    const key = String(stageIdOrName).toLowerCase();
    if (key.includes('applied')) return 'badge bg-info-subtle text-info-main';
    if (key.includes('phone')) return 'badge bg-primary-subtle text-primary-600';
    if (key.includes('onsite')) return 'badge bg-warning-subtle text-warning-main';
    if (key.includes('offer')) return 'badge bg-success-subtle text-success-main';
    if (key.includes('hired')) return 'badge bg-success-subtle text-success-main';
    if (key.includes('reject')) return 'badge bg-danger-subtle text-danger-main';
    return 'badge bg-neutral-200 text-black';
  };

  const [stages, setStages] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [draggedCandidate, setDraggedCandidate] = useState(null);
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stagesRes, candidatesRes] = await Promise.all([
        fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.STAGES}`),
        fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATES}`),
      ]);
      if (!stagesRes.ok) throw new Error('Failed to load stages');
      if (!candidatesRes.ok) throw new Error('Failed to load candidates');
      const stagesData = await stagesRes.json();
      const candidatesData = await candidatesRes.json();
      setStages(stagesData.sort((a, b) => a.order - b.order).map((s) => ({ id: s.name, name: s.name })));
      setCandidates(candidatesData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load the pipeline board');
      showToast.error('Failed to load the pipeline board from the server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const jobs = ['All Jobs', ...Array.from(new Set(candidates.map((c) => c.role)))];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = selectedJob === 'all' || candidate.role === selectedJob;
    return matchesSearch && matchesJob;
  });

  const candidatesByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = filteredCandidates.filter(candidate => candidate.stage === stage.id);
    return acc;
  }, {});

  const moveCandidateToStage = async (candidate, targetStage) => {
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATE(candidate.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: targetStage }),
      });
      if (!res.ok) throw new Error('Failed to move candidate');

      setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, stage: targetStage } : c));
      setToastMsg(`${candidate.name} moved to ${targetStage}`);
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err) {
      showToast.error(err.message || 'Failed to move candidate');
    }
  };

  const handleDragStart = (e, candidate) => {
    setDraggedCandidate(candidate);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (draggedCandidate && draggedCandidate.stage !== targetStage) {
      moveCandidateToStage(draggedCandidate, targetStage);
    }
    setDraggedCandidate(null);
  };

  const handleReject = (candidate) => {
    const rejectStage = stages.find((s) => s.id.toLowerCase().includes('reject'));
    if (!rejectStage) {
      showToast.info('No "Rejected" stage is configured yet — add one on the Stages page first.');
      return;
    }
    moveCandidateToStage(candidate, rejectStage.id);
    setSelectedCandidate(null);
  };

  const CandidateCard = ({ candidate }) => {
    const handleViewClick = (e) => {
      e.stopPropagation();
      setSelectedCandidate(candidate);
    };

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, candidate)}
        className="card border shadow-none cursor-move"
        style={{ width: '18rem' }}
      >
        <div className="card-body p-16">
          <div className="d-flex align-items-start justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="w-40-px h-40-px bg-primary-600 text-white rounded-circle d-flex justify-content-center align-items-center">
                <User size={18} />
              </span>
              <div>
                <h6 className="mb-2">{candidate.name}</h6>
                <div className="text-secondary-light text-sm">{candidate.role}</div>
              </div>
            </div>
            <MoreVertical size={16} className="text-secondary-light" />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <span className={getStageBadgeClass(candidate.stage)}>
              {candidate.stage}
            </span>
            <button onClick={handleViewClick} className="btn btn-link p-0 text-primary-600">
              View →
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StageRow = ({ stage, candidates: stageCandidates }) => (
    <div className="card border shadow-none">
      <div className="card-body p-24">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <h6 className="mb-0">{stage.name}</h6>
            <span className="badge bg-neutral-200 text-black">{stageCandidates.length} candidates</span>
          </div>
          <span className={getStageBadgeClass(stage.id)}>{stage.name}</span>
        </div>
        <div onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage.id)} style={{ minHeight: '128px' }}>
          {stageCandidates.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {stageCandidates.map(candidate => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center p-24 border rounded">
              <div className="text-center">
                <User size={24} className="mb-2 text-secondary-light" />
                <div className="text-sm">No candidates in this stage yet</div>
                <div className="text-xs text-secondary-light mt-1">Drag candidates here to move them to {stage.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const CandidateModal = ({ candidate, onClose }) => (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex align-items-center gap-3">
                <span className="w-56-px h-56-px bg-primary-600 text-white rounded-circle d-flex justify-content-center align-items-center">
                  <User size={24} />
                </span>
                <div>
                  <h6 className="mb-2">{candidate.name}</h6>
                  <div className="text-secondary-light">{candidate.role}</div>
                  <span className={getStageBadgeClass(candidate.stage)}>{candidate.stage}</span>
                </div>
              </div>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3 mb-3">
                <div className="col-md-6 d-grid gap-2">
                  <div className="d-flex align-items-center gap-2 text-secondary-light">
                    <Mail size={18} />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={18} />
                    {candidate.resume_url ? (
                      <a href={candidate.resume_url} target="_blank" rel="noreferrer" className="btn btn-link p-0">View Resume</a>
                    ) : (
                      <span className="text-secondary-light text-sm">No resume on file</span>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <h6 className="mb-2">Quick Actions</h6>
                  <div className="d-grid gap-2">
                    <button onClick={() => handleReject(candidate)} className="btn btn-danger">
                      Reject Candidate
                    </button>
                  </div>
                  <div className="text-secondary-light text-xs mt-2">
                    Shortlist / interview scheduling actions live on the Interview Scheduling page — not duplicated here.
                  </div>
                </div>
              </div>
              <div>
                <h6 className="mb-2">Notes</h6>
                <div className="text-secondary-light text-sm">
                  {candidate.notes || candidate.recruiter_comments || 'No notes yet.'}
                </div>
                {/* NOTE: a full stage-change timeline/audit-trail isn't tracked
                    in the backend yet (only the current stage is stored) —
                    intentionally not fabricated here. */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );

  return (
    <div className="container-fluid py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-muted small mb-3">Loading pipeline board…</div>}

      <div className="mb-12">
        <h4 className="mb-2">Pipeline (Drag & Drop)</h4>
        <p className="text-secondary-light mb-0">Manage candidate progress by moving them across stages</p>
      </div>

      <div className="card border shadow-none mb-24">
        <div className="card-body p-16">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-6">
              <div className="input-group">
                <span className="input-group-text"><Search size={16} /></span>
                <input type="text" placeholder="Search candidates or roles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control" />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="form-select">
                <option value="all">All Jobs</option>
                {jobs.slice(1).map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-3 d-flex justify-content-md-end">
              <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-2">
                <Filter size={16} />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-grid gap-3">
        {stages.map(stage => (
          <StageRow key={stage.id} stage={stage} candidates={candidatesByStage[stage.id] || []} />
        ))}
      </div>

      {toastMsg && (
        <div className="position-fixed bottom-0 end-0 m-3 alert alert-success shadow" role="alert" style={{ zIndex: 1060 }}>
          {toastMsg}
        </div>
      )}

      {selectedCandidate && (
        <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
      )}
    </div>
  );
};

export default PipelineDragDrop;