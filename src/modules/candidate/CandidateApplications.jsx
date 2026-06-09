import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../shared/constants/api.config";

const STATUS_COLORS = {
  Applied: '#3b82f6', Interview: '#8b5cf6', Offer: '#10b981',
  Rejected: '#ef4444', Hired: '#059669',
};

const CandidateApplications = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('candidate_token');
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate('/candidate/login'); return; }
    fetch(`${BASE_URL}/api/candidates/applications`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setApps(Array.isArray(data) ? data : []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <nav className='navbar navbar-light bg-white shadow-sm px-4'>
        <span className='navbar-brand fw-bold'>My Applications</span>
        <button className='btn btn-outline-secondary btn-sm' onClick={() => navigate('/candidate/dashboard')}>← Back</button>
      </nav>
      <div className='container py-4'>
        {loading && <p className='text-muted'>Loading...</p>}
        {!loading && apps.length === 0 && <p className='text-muted'>No applications yet. <button className='btn btn-link p-0' onClick={() => navigate('/candidate/jobs')}>Browse jobs</button></p>}
        <div className='d-flex flex-column gap-3'>
          {apps.map((app, i) => (
            <div key={i} className='bg-white rounded-3 p-4 shadow-sm d-flex align-items-center justify-content-between'>
              <div>
                <div className='fw-semibold'>{app.candidate_name || 'Application'}</div>
                <div className='text-muted' style={{ fontSize: '0.85rem' }}>{app.role || 'Position'}</div>
                <div className='text-muted' style={{ fontSize: '0.8rem' }}>{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : ''}</div>
              </div>
              <span className='badge' style={{
                background: `${STATUS_COLORS[app.stage] || '#6b7280'}20`,
                color: STATUS_COLORS[app.stage] || '#6b7280',
                fontWeight: 500, padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem'
              }}>{app.stage || 'Applied'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidateApplications;