import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from "../../shared/constants/api.config";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem('candidate_name') || 'Candidate';
  const token = localStorage.getItem('candidate_token');
  const [stats, setStats] = useState({ total: 0, interviews: 0, offers: 0 });

  useEffect(() => {
    if (!token) { navigate('/candidate/login'); return; }
    fetch(`${BASE_URL}/api/candidates/applications`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStats({
            total: data.length,
            interviews: data.filter(a => a.stage === 'Interview').length,
            offers: data.filter(a => a.stage === 'Offer').length,
          });
        }
      })
      .catch(() => {});
  }, [token, navigate]);

  const logout = () => {
    localStorage.removeItem('candidate_token');
    localStorage.removeItem('candidate_id');
    localStorage.removeItem('candidate_name');
    navigate('/candidate/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <nav className='navbar navbar-light bg-white shadow-sm px-4'>
        <span className='navbar-brand fw-bold'>Candidate Portal</span>
        <div className='d-flex align-items-center gap-3'>
          <span className='text-muted'>Hi, {name}</span>
          <button className='btn btn-outline-secondary btn-sm' onClick={logout}>Logout</button>
        </div>
      </nav>
      <div className='container py-5'>
        <h4 className='fw-bold mb-4'>Dashboard</h4>
        <div className='row g-3 mb-4'>
          {[
            { label: 'Total Applications', value: stats.total, color: '#3b82f6' },
            { label: 'Interviews', value: stats.interviews, color: '#8b5cf6' },
            { label: 'Offers', value: stats.offers, color: '#10b981' },
          ].map(s => (
            <div key={s.label} className='col-md-4'>
              <div className='bg-white rounded-3 p-4 shadow-sm text-center'>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div className='text-muted' style={{ fontSize: '0.9rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className='d-flex gap-2 flex-wrap'>
          <Link to='/candidate/jobs' className='btn btn-primary'>Browse Jobs</Link>
          <Link to='/candidate/applications' className='btn btn-outline-primary'>My Applications</Link>
          <Link to='/candidate/profile' className='btn btn-outline-secondary'>My Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;