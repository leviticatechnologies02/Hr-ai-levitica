import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const OnboardingDashboard = () => {
  const navigate = useNavigate();

  // Sample data for the chart - Last 12 months
  const newJoiningsData = [
    { month: 'Jan 2025', joinings: 12 },
    { month: 'Feb 2025', joinings: 15 },
    { month: 'Mar 2025', joinings: 20 },
    { month: 'Apr 2025', joinings: 18 },
    { month: 'May 2025', joinings: 20 },
    { month: 'Jun 2025', joinings: 25 },
    { month: 'Jul 2025', joinings: 30 },
    { month: 'Aug 2025', joinings: 35 },
    { month: 'Sep 2025', joinings: 38 },
    { month: 'Oct 2025', joinings: 40 },
    { month: 'Nov 2025', joinings: 45 },
    { month: 'Dec 2025', joinings: 48 }
  ];

  // Onboarding options cards
  const onboardingOptions = [
    {
      id: 'add-employee',
      title: 'Add Employee',
      description: 'Add single employee by entering details',
      icon: 'heroicons:user-plus',
      route: '/hrms/all-employees', // You can change this to a specific add employee route
      color: '#3b82f6'
    },
    {
      id: 'approve',
      title: 'Approve',
      description: 'Approve employees added by other users',
      icon: 'heroicons:check-circle',
      route: '/onboarding/offers', // You can create a dedicated approval page
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
      route: '/onboarding/induction', // You can create a dedicated settings page
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
        {onboardingOptions.map((option, index) => (
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
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={newJoiningsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                domain={[0, 55]}
                ticks={[10, 15, 20, 25, 30, 35, 40, 45, 50, 55]}
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
        </div>
      </div>
    </div>
  );
};

export default OnboardingDashboard;

