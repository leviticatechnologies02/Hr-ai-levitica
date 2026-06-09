import { useState } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../shared/constants/api.config";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success (backend doesn't reveal if email exists)
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className='auth forgot-password-page bg-base d-flex flex-wrap min-vh-100' style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className='auth-left d-lg-block d-none flex-grow-1 position-relative' style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
          overflow: 'hidden'
        }}>
          <div className='d-flex align-items-center flex-column h-100 justify-content-center p-5 position-relative' style={{ zIndex: 2 }}>
            <div className='text-center text-white mb-4'>
              <h2 className='display-4 fw-bold mb-3' style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>Reset Password</h2>
              <p className='lead' style={{ opacity: 0.9 }}>We'll help you get back into your account</p>
            </div>
            <img
              src='/assets/images/leviticalogo.png'
              alt='Forgot Password'
              className='img-fluid login-image rounded-4 shadow-lg'
              style={{ maxWidth: '600px', width: '100%', borderRadius: '1rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            />
          </div>
        </div>

        <div className='auth-right py-5 px-4 px-lg-5 d-flex flex-column justify-content-center' style={{
          backgroundColor: '#ffffff', minHeight: '100vh', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
        }}>
          <div className='max-w-464-px mx-auto w-100'>
            <div className='mb-4 mb-md-5'>
              <Link to="/"><img src='/assets/images/leviticalogo_removebg.png' alt='Logo' className='img-fluid mb-3' style={{ height: '60px', width: 'auto' }} /></Link>
              <h2 className='fw-bold mb-2' style={{ fontSize: '2rem', color: '#1a1a1a' }}>Forgot Password</h2>
              <p className='text-muted mb-0' style={{ fontSize: '1rem' }}>
                Enter the email address associated with your account and we will send you a link to reset your password.
              </p>
            </div>

            {sent ? (
              <div className='text-center p-4' style={{ background: '#f0fdf4', borderRadius: '0.75rem', border: '1px solid #bbf7d0' }}>
                <Icon icon='heroicons:envelope' style={{ fontSize: '48px', color: '#16a34a', marginBottom: '12px' }} />
                <h5 className='fw-bold mb-2'>Check your email</h5>
                <p className='text-muted mb-3'>We sent a password reset link to <strong>{email}</strong></p>
                <Link to='/login' className='btn btn-outline-primary'>Back to Sign In</Link>
              </div>
            ) : (
              <>
                <div className='mb-4'>
                  <label className='form-label fw-semibold mb-2' style={{ color: '#495057', fontSize: '0.9rem' }}>Email Address</label>
                  <div className='position-relative'>
                    <span className='position-absolute top-50 start-0 translate-middle-y ms-3' style={{ zIndex: 5, color: '#6c757d' }}>
                      <Icon icon='mage:email' style={{ fontSize: '20px' }} />
                    </span>
                    <input
                      type='email'
                      className='form-control ps-5 py-3'
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      style={{ borderRadius: '0.5rem', border: '1px solid #dee2e6', fontSize: '0.95rem' }}
                    />
                  </div>
                  {error && <div className='text-danger mt-2' style={{ fontSize: '0.85rem' }}>{error}</div>}
                </div>

                <button
                  type='button'
                  className='btn btn-primary w-100 py-3 mb-4'
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', border: 'none' }}
                >
                  {loading ? 'Sending...' : 'Continue'}
                </button>

                <div className='text-center'>
                  <span>If you know your password — </span>
                  <Link to='/login' className='text-primary fw-semibold text-decoration-none'>Back to Sign In</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;