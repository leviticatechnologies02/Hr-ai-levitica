import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, User, Clock, Send, X, Plus } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const currentUserName = () => localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'You';

const CollaborationTools = () => {
  const [stages, setStages] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalStage, setAddModalStage] = useState('');
  const [newCandidateForm, setNewCandidateForm] = useState({ name: '', email: '', role: '' });
  const [creating, setCreating] = useState(false);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stagesRes, candidatesRes] = await Promise.all([
        fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.STAGES}`),
        fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATES}`, { headers: { ...authHeaders() } }),
      ]);
      if (!stagesRes.ok) throw new Error('Failed to load stages');
      if (!candidatesRes.ok) {
        if (candidatesRes.status === 401) throw new Error('Please log in to view the pipeline board');
        throw new Error('Failed to load candidates');
      }
      const stagesData = await stagesRes.json();
      const candidatesData = await candidatesRes.json();
      setStages(stagesData.sort((a, b) => a.order - b.order).map((s) => s.name));
      setCandidates(candidatesData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load the collaboration board');
      toast.error(err.message || 'Failed to load the collaboration board');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const candidatesByStage = stages.reduce((acc, stage) => {
    acc[stage] = candidates.filter((c) => c.stage === stage);
    return acc;
  }, {});

  const openCandidate = async (candidate) => {
    setSelectedCandidate(candidate);
    setNotesDraft(candidate.notes || '');
    setCommentsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATE_COMMENTS(candidate.id)}`);
      if (!res.ok) throw new Error('Failed to load discussion');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load the discussion for this candidate');
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedCandidate) return;
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATE_COMMENTS(selectedCandidate.id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ author: currentUserName(), text: newComment.trim() }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      const created = await res.json();
      setComments((prev) => [...prev, created]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to post comment');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedCandidate) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATE(selectedCandidate.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ notes: notesDraft }),
      });
      if (!res.ok) throw new Error('Failed to save notes');
      const updated = await res.json();
      setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCandidate(updated);
      toast.success('Notes saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleMoveStage = async (newStage) => {
    if (!selectedCandidate || newStage === selectedCandidate.stage) return;
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATE(selectedCandidate.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) throw new Error('Failed to move candidate');
      const updated = await res.json();
      setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCandidate(updated);
      toast.success(`Moved to ${newStage}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to move candidate');
    }
  };

  const handleAddCandidateClick = (stage) => {
    setAddModalStage(stage);
    setNewCandidateForm({ name: '', email: '', role: '' });
    setShowAddModal(true);
  };

  const handleCreateCandidate = async () => {
    if (!newCandidateForm.name.trim() || !newCandidateForm.email.trim() || !newCandidateForm.role.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PIPELINE.CANDIDATES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ ...newCandidateForm, stage: addModalStage }),
      });
      if (!res.ok) throw new Error('Failed to add candidate');
      const created = await res.json();
      setCandidates((prev) => [...prev, created]);
      setShowAddModal(false);
      toast.success('Candidate added');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add candidate');
    } finally {
      setCreating(false);
    }
  };

  const CandidateCard = ({ candidate }) => (
    <div className="card border shadow-none mb-3 cursor-pointer" onClick={() => openCandidate(candidate)}>
      <div className="card-body p-16">
        <div className="d-flex align-items-start justify-content-between mb-2">
          <div className="d-flex align-items-center gap-2">
            <span className="w-32-px h-32-px bg-primary-600 text-white rounded-circle d-flex justify-content-center align-items-center text-sm fw-semibold">
              {candidate.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h6 className="mb-2">{candidate.name}</h6>
              <div className="text-secondary-light text-sm">{candidate.role}</div>
            </div>
          </div>
        </div>
        {candidate.recruiter_comments && (
          <div className="d-inline-flex align-items-center gap-1 text-primary-600 text-sm">
            <MessageCircle size={14} /><span>Has comments</span>
          </div>
        )}
      </div>
    </div>
  );

  const CollaborationSidebar = () => (
    <div className="card border shadow-none h-100">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h6 className="mb-0">Candidate Details</h6>
        <button onClick={() => setSelectedCandidate(null)} className="btn btn-sm btn-outline-secondary">
          <X size={16} />
        </button>
      </div>
      <div className="card-body p-16 d-flex flex-column">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="w-44-px h-44-px bg-primary-600 text-white rounded-circle d-flex justify-content-center align-items-center fw-semibold">
            {selectedCandidate.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </span>
          <div>
            <h6 className="mb-2">{selectedCandidate.name}</h6>
            <div className="text-secondary-light text-sm">{selectedCandidate.role} · {selectedCandidate.email}</div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Stage</label>
          <select className="form-select" value={selectedCandidate.stage} onChange={(e) => handleMoveStage(e.target.value)}>
            {stages.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea className="form-control" rows={3} value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} />
          <button className="btn btn-sm btn-outline-primary mt-2" onClick={handleSaveNotes} disabled={savingNotes}>
            {savingNotes ? 'Saving…' : 'Save Notes'}
          </button>
        </div>

        <div className="border-top pt-3">
          <h6 className="text-sm text-secondary-light mb-2">Discussion</h6>
        </div>

        <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '280px' }}>
          {commentsLoading && <div className="text-secondary-light small">Loading discussion…</div>}
          {!commentsLoading && comments.length === 0 && (
            <div className="text-secondary-light small">No comments yet. Start the discussion below.</div>
          )}
          <div className="d-grid gap-2">
            {comments.map((comment) => (
              <div key={comment.id} className="d-flex gap-2">
                <span className="w-32-px h-32-px bg-neutral-300 text-black rounded-circle d-flex justify-content-center align-items-center text-sm fw-semibold">
                  {comment.author?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="fw-medium text-sm">{comment.author}</span>
                    <span className="text-xs text-secondary-light">{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-sm">{comment.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-top pt-3">
          <div className="d-flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment…"
              className="form-control"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button onClick={handleAddComment} className="btn btn-primary">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-12 d-flex align-items-center justify-content-between">
        <div>
          <h4 className="mb-2">Pipeline Collaboration</h4>
          <p className="text-secondary-light mb-0">Discuss candidates and track notes with your team, in real time.</p>
        </div>
      </div>

      {loading && <div className="text-muted small mb-3">Loading collaboration board…</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row g-3">
        <div className={selectedCandidate ? 'col-lg-8' : 'col-12'}>
          <div className="row g-3">
            {stages.map((stage) => (
              <div key={stage} className="col-12 col-md-6 col-xl-4">
                <div className="card border shadow-none h-100">
                  <div className="card-body p-16">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="mb-0">{stage}</h6>
                      <span className="badge bg-neutral-200 text-black">{candidatesByStage[stage]?.length || 0}</span>
                    </div>
                    <div>
                      {candidatesByStage[stage]?.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                      ))}
                    </div>
                    <button onClick={() => handleAddCandidateClick(stage)} className="btn btn-outline-secondary w-100 d-inline-flex align-items-center justify-content-center gap-2 mt-2">
                      <Plus size={14} />
                      <span className="text-sm">Add Candidate</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!loading && stages.length === 0 && (
              <div className="col-12 text-secondary-light small">No pipeline stages configured yet. Add stages on the Stages page first.</div>
            )}
          </div>
        </div>

        {selectedCandidate && (
          <div className="col-lg-4">
            <CollaborationSidebar />
          </div>
        )}
      </div>

      {showAddModal && (
        <>
          <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title mb-0">Add New Candidate</h6>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="d-grid gap-2">
                    <div>
                      <label className="form-label">Candidate Name *</label>
                      <input type="text" value={newCandidateForm.name} onChange={(e) => setNewCandidateForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Enter candidate name" className="form-control" />
                    </div>
                    <div>
                      <label className="form-label">Email *</label>
                      <input type="email" value={newCandidateForm.email} onChange={(e) => setNewCandidateForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Enter candidate email" className="form-control" />
                    </div>
                    <div>
                      <label className="form-label">Role *</label>
                      <input type="text" value={newCandidateForm.role} onChange={(e) => setNewCandidateForm((prev) => ({ ...prev, role: e.target.value }))} placeholder="Enter position title" className="form-control" />
                    </div>
                    <div className="text-secondary-light bg-neutral-100 p-2 rounded">
                      <strong>Adding to:</strong> {addModalStage}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={() => setShowAddModal(false)} className="btn btn-outline-secondary">Cancel</button>
                  <button
                    onClick={handleCreateCandidate}
                    disabled={creating || !newCandidateForm.name.trim() || !newCandidateForm.email.trim() || !newCandidateForm.role.trim()}
                    className="btn btn-primary"
                  >
                    {creating ? 'Adding…' : 'Add Candidate'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default CollaborationTools;
