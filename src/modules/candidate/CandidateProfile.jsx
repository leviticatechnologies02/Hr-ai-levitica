import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../shared/constants/api.config";

const CandidateProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('candidate_token');
  const name = localStorage.getItem('candidate_name') || '';
  const [profile, setProfile] = useState({ name, email: '', role: '', skills: '' });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) { navigate('/candidate/login'); return; }
    fetch(`${BASE_URL}/api/candidates/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (data && !data.detail) setProfile(p => ({ ...p, ...data })); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleSave = async () => {
    const res = await fetch(`${BASE_URL}/api/candidates/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  if (loading) return <div className='d-flex justify-content-center align-items-center min-vh-100'><p>Loading...</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <nav className='navbar navbar-light bg-white shadow-sm px-4'>
        <span className='navbar-brand fw-bold'>My Profile</span>
        <button className='btn btn-outline-secondary btn-sm' onClick={() => navigate('/candidate/dashboard')}>← Back</button>
      </nav>
      <div className='container py-4' style={{ maxWidth: '600px' }}>
        <div className='bg-white rounded-3 p-4 shadow-sm'>
          {[
            { label: 'Full Name', key: 'name', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Role / Job Title', key: 'role', type: 'text' },
            { label: 'Skills (comma separated)', key: 'skills', type: 'text' },
          ].map(f => (
            <div key={f.key} className='mb-3'>
              <label className='form-label fw-semibold'>{f.label}</label>
              <input type={f.type} className='form-control py-3' value={profile[f.key] || ''}
                onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ borderRadius: '0.5rem' }} />
            </div>
          ))}
          {saved && <div className='text-success mb-3' style={{ fontSize: '0.85rem' }}>Profile saved!</div>}
          <button className='btn btn-primary w-100 py-3' onClick={handleSave}
            style={{ borderRadius: '0.5rem', fontWeight: '600', border: 'none' }}>Save Profile</button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;