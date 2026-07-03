import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';

// The backend has no dedicated "new joinings per month" analytics endpoint
// (checked routers/onboarding/*.py). What it does have is the onboarding
// candidate invite list (GET /api/onboarding-forms/candidates/), where each
// candidate has a created_at timestamp. This component fetches that list
// and aggregates candidates-added-per-month for the last 12 months as a
// real-data stand-in for the "New Joinings" chart, instead of hardcoded
// sample numbers.
const monthLabel = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

const buildLast12MonthsSkeleton = () => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: monthLabel(d), joinings: 0 });
  }
  return months;
};

const OnboardingDashboard = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(buildLast12MonthsSkeleton());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJoinings = async () => {
      setLoading(true);
      setError(null);
      try {
        // per_page set high enough to cover a year of candidates in one call;
        // if the org has more volume than this, this should move to
        // server-side pagination + accumulation.
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.ONBOARDING_CANDIDATE_INVITES.LIST}?page=1&per_page=1000`
        );
        if (!response.ok) throw new Error('Failed to load onboarding candidates');
        const data = await response.json();
        const candidates = data.results || [];

        const skeleton = buildLast12MonthsSkeleton();
        const byKey = Object.fromEntries(skeleton.map((m) => [m.key, m]));

        candidates.forEach((c) => {
          if (!c.created_at) return;
          const d = new Date(c.created_at);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (byKey[key]) byKey[key].joinings += 1;
        });

        setChartData(Object.values(byKey));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinings();
  }, []);

  const onboardingOptions = [
    {
      id: 'add-employee',
      title: 'Add Employee',
      description: 'Add single employee by entering details',
      icon: 'heroicons:user-plus',
      route: '/hrms/all-employees',
      color: '#3b82f6'
    },
    {
      id: 'approve',
      title: 'Approve',
      description: 'Approve employees added by other users',
      icon: 'heroicons:check-circle',
      route: '/onboarding/offers',
      color: '#10b981'
    },
    {
      id: 'bulk-onboard',
      title: 'Bulk Onboard',
      description: 'Send onboarding link to multiple candidates',
      icon: 'heroicons:users',
      route: '/onboarding/pre-joining',
      color: '#8b5cf6'
    },
    {
      id: 'onboarding-forms',
      title: 'Onboarding Forms',
      description: 'View all onboarding forms and take action',
      icon: 'heroicons:document-text',
      route: '/onboarding/joining-day',
      color: '#f59e0b'
    },
    {
      id: 'offer-letter',
      title: 'Offer Letter',
      description: 'Generate offer letter by entering candidate details',
      icon: 'heroicons:document-check',
      route: '/onboarding/offers',
      color: '#ef4444'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Settings to configure onboarding form fields',
      icon: 'heroicons:cog-6-tooth',
      route: '/onboarding/induction',
      color: '#6b7280'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="container-fluid p-4">
      {/* Header Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-2">
          <Icon
            icon="heroicons:user-plus"
            className="me-3"
            style={{ fontSize: '2.5rem', color: '#3b82f6' }}
          />
          <h2 className="mb-0 fw-bold">Onboarding</h2>
        </div>
        <p className="text-muted fs-5">Select an option to start onboarding</p>
      </div>

      {/* Onboarding Options Cards */}
      <div className="row g-4 mb-5">
        {onboardingOptions.map((option) => (
          <div key={option.id} className="col-lg-4 col-md-6">
            <div
              className="card h-100 shadow-sm border-0"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
              onClick={() => handleCardClick(option.route)}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-start mb-3">
                  <div
                    className="rounded-circle p-3 me-3"
                    style={{
                      backgroundColor: `${option.color}15`,
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon
                      icon={option.icon}
                      style={{
                        fontSize: '1.75rem',
                        color: option.color
                      }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="card-title mb-2 fw-bold">{option.title}</h5>
                    <p className="card-text text-muted mb-0 small">
                      {option.description}
                    </p>
                  </div>
                </div>
                <button
                  className="btn btn-primary w-100 mt-3"
                  style={{
                    backgroundColor: option.color,
                    borderColor: option.color,
                    borderRadius: '8px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(option.route);
                  }}
                >
                  Start <Icon icon="heroicons:arrow-right" className="ms-2" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Joinings Chart */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-white border-0 pt-4 px-4">
          <h5 className="mb-0 fw-bold d-flex align-items-center">
            <Icon icon="heroicons:chart-bar" className="me-2" style={{ color: '#3b82f6' }} />
            New Joinings (Last 12 months)
          </h5>
        </div>
        <div className="card-body p-4">
          {loading && <p className="text-muted mb-0">Loading onboarding data...</p>}
          {error && (
            <p className="text-danger mb-0">
              Couldn't load real joinings data ({error}). Showing zeros below.
            </p>
          )}
          {!loading && (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="joinings"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="New Joinings"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingDashboard;