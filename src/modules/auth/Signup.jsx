import React, { useState } from 'react';
import { FiUser, FiBriefcase, FiMail, FiGlobe, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL, API_ENDPOINTS } from "../../shared/constants/api.config";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    companyId: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password || !formData.companyName) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!agreed) {
      setError('Please agree to the Terms & Conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.AUTH.SIGNUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username || formData.name,
          email: formData.email,
          password: formData.password,
          role: 'recruiter',
          company_name: formData.companyName,
          company_website: formData.companyWebsite || null,
          company_id: formData.companyId || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.detail || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="absolute inset-0">
          <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-white/10 rounded-full" />
          <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] bg-white/5 rounded-full" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-8 text-center">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-white mb-3" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              Join Us Today!
            </h2>
            <p className="text-white/90 text-lg">
              Create your account and start your journey with AI Recruitment
            </p>
          </div>
          <img 
            src='/assets/images/leviticalogo.png' 
            alt='Signup' 
            className="max-w-[500px] w-full rounded-2xl shadow-2xl"
          />
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-white overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          {/* Logo and Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src='/assets/images/leviticalogo.png' 
                alt='Logo' 
                className="h-10 w-auto"
              />
              <span className="text-primary font-bold text-lg">AI Recruitment</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Company Signup</h2>
            <p className="text-gray-500 text-sm md:text-base">
              Register your company! Please enter your details to get started
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4 md:space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                <FiAlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {/* Success Alert */}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
                <FiCheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Row 1: Full Name | Company Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Enter your company name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Company Email | Company Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Enter company email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Enter company website"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Company ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company ID <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Enter company ID"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Password | Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Re-enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions - Custom Checkbox */}
            <div className="py-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all mt-0.5 ${
                    agreed 
                      ? 'bg-primary border-primary' 
                      : 'border-gray-300 hover:border-primary'
                  }`}
                  onClick={() => setAgreed(!agreed)}
                >
                  {agreed && <FiCheckCircle className="h-4 w-4 text-white" />}
                </div>
                <span className="text-sm text-gray-600">
                  By creating an account means you agree to the{" "}
                  <Link to="#" className="text-primary font-medium hover:underline">
                    Terms & Conditions
                  </Link>
                  {" "}and our{" "}
                  <Link to="#" className="text-primary font-medium hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {!agreed && error && error.includes('Terms') && (
                <p className="text-xs text-rose-500 mt-1">Please agree to the Terms & Conditions</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creating account...
                </div>
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-primary font-medium hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;