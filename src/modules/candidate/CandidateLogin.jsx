import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from "../../shared/constants/api.config";

const CandidateLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BASE_URL}/api/candidate/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || 'Login failed.'); return; }
      localStorage.setItem('candidate_token', data.access_token);
      localStorage.setItem('candidate_id', data.candidate_id);
      localStorage.setItem('candidate_name', data.name);
      navigate('/candidate/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='d-flex align-items-center justify-content-center min-vh-100' style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className='bg-white p-5 rounded-4 shadow' style={{ width: '100%', maxWidth: '420px' }}>
        <Link to="/"><img src='/assets/images/leviticalogo_removebg.png' alt='Logo' style={{ height: '50px', marginBottom: '24px' }} /></Link>
        <h2 className='fw-bold mb-1'>Candidate Login</h2>
        <p className='text-muted mb-4'>Sign in to track your applications</p>

        <div className='mb-3'>
          <label className='form-label fw-semibold'>Email</label>
          <input type='email' className='form-control py-3' value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder='you@example.com' style={{ borderRadius: '0.5rem' }} />
        </div>
        <div className='mb-3'>
          <label className='form-label fw-semibold'>Password</label>
          <input type='password' className='form-control py-3' value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder='Your password' style={{ borderRadius: '0.5rem' }} />
        </div>
        {error && <div className='text-danger mb-3' style={{ fontSize: '0.85rem' }}>{error}</div>}
        <button className='btn btn-primary w-100 py-3 mb-3' onClick={handleLogin} disabled={loading}
          style={{ borderRadius: '0.5rem', fontWeight: '600', border: 'none' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className='text-center'>
          <span className='text-muted' style={{ fontSize: '0.9rem' }}>Don't have an account? </span>
          <Link to='/signup' className='text-primary fw-semibold text-decoration-none' style={{ fontSize: '0.9rem' }}>Sign up</Link>
        </div>
      </div>
    </section>
  );
};

export default CandidateLogin;