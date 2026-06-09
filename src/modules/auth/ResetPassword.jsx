import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from "../../shared/constants/api.config";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!token) { setError('Invalid reset link.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || 'Reset failed. The link may have expired.');
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
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
        <h2 className='fw-bold mb-2'>Set new password</h2>
        <p className='text-muted mb-4'>Must be at least 8 characters.</p>

        {success ? (
          <div className='text-center text-success p-3' style={{ background: '#f0fdf4', borderRadius: '0.5rem' }}>
            <p className='fw-semibold mb-1'>Password updated!</p>
            <p className='text-muted' style={{ fontSize: '0.9rem' }}>Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className='mb-3'>
              <label className='form-label fw-semibold'>New password</label>
              <input type='password' className='form-control py-3' value={password} onChange={e => setPassword(e.target.value)} placeholder='Enter new password' style={{ borderRadius: '0.5rem' }} />
            </div>
            <div className='mb-3'>
              <label className='form-label fw-semibold'>Confirm password</label>
              <input type='password' className='form-control py-3' value={confirm} onChange={e => setConfirm(e.target.value)} placeholder='Confirm new password' style={{ borderRadius: '0.5rem' }} />
            </div>
            {error && <div className='text-danger mb-3' style={{ fontSize: '0.85rem' }}>{error}</div>}
            <button className='btn btn-primary w-100 py-3' onClick={handleSubmit} disabled={loading} style={{ borderRadius: '0.5rem', fontWeight: '600', border: 'none' }}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </>
        )}
        <div className='text-center mt-3'>
          <Link to='/login' className='text-primary text-decoration-none' style={{ fontSize: '0.9rem' }}>Back to Sign In</Link>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;