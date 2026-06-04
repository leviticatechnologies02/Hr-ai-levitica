import React, { useEffect, useState } from 'react';
import { Zap, FileText, Code, BarChart3, Bot, ShieldCheck, Users, Calendar, Clock, DollarSign } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { getUserRole } from "../../shared/utils/auth";
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "remixicon/fonts/remixicon.css";
import Navbar from './Navbar';
import Footer from './Footer';

// Global Animation Styles
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.2);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .animate-slide-down {
    animation: slideInDown 0.8s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.8s ease-out forwards;
  }

  /* Session Block Styling */
  .session-block {
    border-radius: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  }

  .session-block:hover {
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  /* Button Hover Effects */
  .btn-hover-lift {
    transition: all 0.3s ease;
  }

  .btn-hover-lift:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  /* Smooth Scroll */
  html {
    scroll-behavior: smooth;
  }

  /* FAQ Image Animations */
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.05);
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
  }

  .faq-image-container:hover .faq-image {
    filter: brightness(1.2) contrast(1.2) saturate(1.1);
  }

  /* HRMS Section Styles */
  .hrms-card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hrms-card:hover {
    transform: translateY(-8px) scale(1.02);
  }
  
  .hrms-feature-item {
    transition: all 0.3s ease;
  }
  
  .hrms-feature-item:hover {
    transform: translateX(8px);
    color: #EC4899;
  }
  
  .hrms-feature-item:hover .feature-icon {
    transform: scale(1.2) rotate(5deg);
    background-color: #EC4899;
  }
`;

// AnimatedSection Component
const AnimatedSection = ({ children, delay = 0 }) => {
  return (
    <div
      style={{
        animation: `fadeInUp 0.8s ease-out ${delay}ms forwards`,
        opacity: 0,
      }}
    >
      {children}
    </div>
  );
};

// Custom Hook for Scroll-triggered Animations that reset
const useIntersectionObserver = (resetOnExit = true) => {
  const ref = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const keyRef = React.useRef(0);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (resetOnExit) {
          setIsVisible(false);
          keyRef.current += 1;
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [resetOnExit]);

  return [ref, isVisible, keyRef.current];
};

// Scroll-triggered Animated Card Component
const ScrollAnimatedCard = ({ children, delay = 0, isVisible }) => {
  const [animationKey, setAnimationKey] = React.useState(0);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      setShouldAnimate(false);
      setAnimationKey(prev => prev + 1);
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [isVisible]);

  return (
    <div
      key={`animate-${animationKey}`}
      style={{
        animation: shouldAnimate ? `fadeInUp 0.8s ease-out ${delay}ms forwards` : 'none',
        animationFillMode: 'both',
        opacity: 0,
        transform: 'translateY(30px)'
      }}
    >
      {children}
    </div>
  );
};

// How It Works Section Component (4 Cards in One Line)
const HowItWorksSection = () => {
  const [ref, isVisible] = useIntersectionObserver(true);

const steps = [
  {
    icon: 'bi-briefcase',
    title: 'Create Job',
    description: 'Post your job requirements and let our AI optimize',
    cardColor: '#E3F2FD',
    iconColor: '#4361EE',
    delay: 0
  },
  {
    icon: 'bi-people',
    title: 'Import Candidates',
    description: 'Import candidates from various sources',
    cardColor: '#E6F4EA',
    iconColor: '#06D6A0',
    delay: 150
  },
  {
    icon: 'bi-graph-up',
    title: 'Track Pipeline',
    description: 'Monitor candidate progress through stages',
    cardColor: '#FFF4E1',
    iconColor: '#FF9E00',
    delay: 300
  },
  {
    icon: 'bi-award',
    title: 'Hire & Report',
    description: 'Make offers and generate reports',
    cardColor: '#FFE3E6',
    iconColor: '#E63946',
    delay: 450
  }
];

return (
  <div ref={ref} className='card border-0 shadow-none session-block'>
    <div className='card-body p-3 p-md-5'>
      {/* Section Header */}
      <ScrollAnimatedCard delay={0} isVisible={isVisible}>
        <div className='text-center mb-5'>
          <h3 className='display-6 display-md-5 fw-bold mb-3 text-primary'>How It Works</h3>
          <p className='mt-2 mb-2 px-2 px-md-5 mx-auto' style={{ maxWidth: '800px' }}>
            Simple 4-step process to streamline your recruitment
          </p>
        </div>
      </ScrollAnimatedCard>

      {/* Cards with equal width & height in one row */}
      <div className="d-flex flex-row flex-wrap justify-content-center align-items-stretch gap-3">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <ScrollAnimatedCard delay={step.delay} isVisible={isVisible}>
             <div
  className="card text-center p-4 flex-fill"
  style={{
    backgroundColor: step.cardColor,
    borderRadius: '1rem',
    minWidth: '250px', // increased width
    maxWidth: '300px', // increased width
    height: '180px',    // decreased height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}
>
  <i
    className={`bi ${step.icon} mb-2`}
    style={{ fontSize: '2rem', color: step.iconColor }}
  ></i>
  <h6 className="fw-bold">{step.title}</h6>
  <p className="mb-0">{step.description}</p>
</div>
            </ScrollAnimatedCard>

            {/* Arrow between cards */}
            {index < steps.length - 1 && (
              <div className="d-none d-md-flex align-items-center mx-2">
                <i className="bi bi-arrow-right" style={{ fontSize: '2rem', color: '#aaa' }}></i>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);
};

// Card Component for grid layout
const CardComponent = ({ step }) => (
  <div
    className="border-0 p-3 h-100"
    style={{
      width: '100%',
      backgroundColor: step.bgColor,
      borderTop: `4px solid ${step.color}`, // Top border instead of side
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'translateY(0)',
      cursor: 'pointer',
      margin: 0,
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = `0 20px 30px ${step.color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
    }}
  >
    <div className="d-flex flex-column">
      {/* Top section with icon and title */}
      <div className="d-flex align-items-center gap-2 mb-3">
        {/* Icon Circle */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: '45px',
            height: '45px',
            backgroundColor: step.color,
            fontSize: '1.3rem',
            transition: 'all 0.3s ease',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          }}
        >
          {step.icon}
        </div>

        {/* Title */}
        <h6 className="fw-bold mb-0" style={{
          color: step.color,
          fontSize: '1rem'
        }}>
          {step.title}
        </h6>
      </div>

      {/* Description */}
      <p className="text-muted mb-0 small" style={{
        fontSize: '0.85rem',
        color: '#4B5563',
        lineHeight: '1.4'
      }}>
        {step.description}
      </p>
    </div>
  </div>
);

// Row Animation Component for individual rows
const AnimatedRow = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div ref={ref} className='row g-4'>
      {React.Children.map(children, (child, index) => (
        <ScrollAnimatedCard key={index} delay={delay + (index * 100)} isVisible={isVisible}>
          {child}
        </ScrollAnimatedCard>
      ))}
    </div>
  );
};

// Client Features Section with Animations and Hover Effects
const ClientFeaturesSection = ({ clients }) => {
  const [ref, isVisible] = useIntersectionObserver(true);

  return (
    <div className='container card border shadow-none p-3 p-md-5' ref={ref}>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 d-flex align-items-center justify-content-center p-3 p-md-5">
        <div className="w-100">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
            <ScrollAnimatedCard delay={0} isVisible={isVisible}>
              <div className="text-center text-md-start" style={{ maxWidth: '500px' }}>
                <div
                  style={{
                    overflow: 'hidden',
                    borderRadius: '12px',
                    transition: 'all 0.4s ease',
                    animation: `fadeInUp 0.8s ease-out 0ms forwards`,
                    opacity: 0,
                    width: '100%', // Make container take full width
                    height: '180px', // Set a fixed height or use aspect ratio
                    position: 'relative' // Optional: for better image positioning
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src="https://www.aihr.com/wp-content/uploads/hr-automation-cover.jpg"
                    alt="Powerful Features"
                    style={{
                      width: '100%', // Take full width of container
                      height: '100%', // Take full height of container
                      objectFit: 'cover', // Cover the entire area without distortion
                      display: 'block' // Remove extra space below image
                    }}
                  />
                </div>
                <h4
                  className="text-3xl text-md-4xl fw-bold text-black mb-3 mt-3"
                  style={{
                    animation: `fadeInUp 0.8s ease-out 200ms forwards`,
                    opacity: 0,
                    transition: 'color 0.3s ease'
                  }}
                >
                  All in one: AI Recruiter & HR Automation, CRM, Productivity, HRMS
                </h4>
                <p
                  className="text-base text-md-lg text-dark mb-3"
                  style={{
                    animation: `fadeInUp 0.8s ease-out 400ms forwards`,
                    opacity: 0,
                    transition: 'color 0.3s ease'
                  }}
                >
                  One platform for recruiting, sales, productivity, and HR. Streamline operations and grow with confidence.
                </p>
                <button
                  className="btn btn-primary"
                  style={{
                    animation: `fadeInUp 0.8s ease-out 600ms forwards`,
                    opacity: 0,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Become a client
                </button>
              </div>
            </ScrollAnimatedCard>

            <div className="d-flex flex-column gap-3 w-100" style={{ maxWidth: '500px' }}>
              {clients.map((client, index) => (
                <ScrollAnimatedCard key={index} delay={index * 100 + 200} isVisible={isVisible}>
                  <div
                    className="d-flex align-items-center justify-content-start bg-white rounded-3 p-0 overflow-hidden shadow-sm border border-gray-200 w-100 client-card"
                    style={{
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      animation: `fadeInUp 0.8s ease-out ${(index * 100) + 200}ms forwards`,
                      opacity: 0,
                      minHeight: '80px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(10px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                      e.currentTarget.style.borderColor = '#3B82F6';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    {client.image && (
                      <div className="flex-shrink-0" style={{ width: '90px', height: '80px' }}>
                        <img
                          src={client.image}
                          alt={client.name}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div
                      className="rounded-circle bg-black d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                      style={{
                        width: '44px',
                        height: '44px',
                        marginLeft: client.image ? '0.75rem' : '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)';
                        e.currentTarget.style.backgroundColor = '#3B82F6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                        e.currentTarget.style.backgroundColor = '#000000';
                      }}
                    >
                      {client.icon}
                    </div>
                    <h3 className="h6 fw-bold text-gray-900 mb-0 py-3 pe-3" style={{ transition: 'color 0.3s ease' }}>
                      {client.name}
                    </h3>
                  </div>
                </ScrollAnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shared 4 platform topics
const PLATFORM_TOPICS = [
  {
    id: 'ai-recruiter',
    title: 'AI Recruiter & HR Automation',
    subtitle: 'Source, screen, and hire faster with AI. Automate recruiting and focus on great conversations.',
    badge: '✨ AI Talent Platform',
    points: ['Smart resume screening & shortlisting', 'Automated interview scheduling', 'AI-powered candidate matching', 'Pipeline from job post to offer'],
    bg: 'https://images.pexels.com/photos/3184305/pexels-photo-3184305.jpeg',
    color: '#3B82F6',
    bgLight: '#EFF6FF',
    icon: 'Bot'
  },
  {
    id: 'crm',
    title: 'CRM',
    subtitle: 'Manage leads, deals, and customer relationships in one powerful platform.',
    badge: '📊 Customer Relations',
    points: ['Leads, contacts & deal pipeline', 'Activity tracking & follow-ups', 'Sales forecasting & reports', 'Integrations with email & calendar'],
    bg: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg',
    color: '#10B981',
    bgLight: '#ECFDF5',
    icon: 'BarChart3'
  },
  {
    id: 'productivity',
    title: 'Productivity',
    subtitle: 'Boost team productivity with smart workflows and real-time collaboration.',
    badge: '⚡ Work Smarter',
    points: ['Tasks, projects & deadlines', 'Team dashboards & visibility', 'Workflow automation', 'Docs and knowledge base'],
    bg: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    color: '#F59E0B',
    bgLight: '#FFFBEB',
    icon: 'Zap'
  },
  {
    id: 'hrms',
    title: 'HRMS',
    subtitle: 'Complete HR management: payroll, attendance, leave, and employee lifecycle.',
    badge: '👥 Human Resources',
    points: ['Payroll & compliance', 'Attendance & leave management', 'Onboarding & offboarding', 'Performance & appraisals'],
    bg: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg',
    color: '#EC4899',
    bgLight: '#FDF2F8',
    icon: 'FileText'
  }
];

// New AIRecruiterBody Component (Integrated directly)
const AIRecruiterBody = () => {
  return (
    <>
      {/* HEADING */}

      <div style={{ textAlign: "center", marginBottom: "70px" }}>

        <h2 style={{ fontSize: "40px", fontWeight: "700", color: "#0f2747" }}>
          what  <span style={{ color: "#2b5fab" }}>We Offer</span>
        </h2>



        <p style={{
          marginTop: "15px",
          fontSize: "18px",
          color: "#666",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
          lineHeight: "1.6"
        }}>
          All in one: <b>AI Recruiter & HR Automation</b>, <b>CRM</b>,
          <b>Productivity</b>, and <b>HRMS</b>. Built for hiring teams,
          sales teams, and HR departments to streamline recruitment,
          manage customers, improve productivity, and automate HR operations
          through a single intelligent platform.
        </p>

      </div>


      {/* CARDS */}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,360px)", justifyContent: "center", gap: "40px" }}>


        {/* HRMS CARD */}

        <div style={{ perspective: "1000px" }}>
          <div
            style={{
              position: "relative",
              width: "360px",
              height: "420px",
              transformStyle: "preserve-3d",
              transition: "0.7s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "rotateY(180deg)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "rotateY(0deg)"}
          >

            {/* FRONT */}

            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "#fff",
              padding: "40px",
              borderRadius: "16px",
              boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
              backfaceVisibility: "hidden"
            }}>

              <i className="bi bi-people-fill" style={{ fontSize: "40px", color: "#2b5fab" }}></i>

              <div style={{ fontSize: "26px", fontWeight: "600", marginTop: "15px" }}>
                HRMS
              </div>

              <p style={{ marginTop: "10px", color: "#555" }}>
                Complete HR management system for employee records.
              </p>

              <div style={{ marginTop: "15px", lineHeight: "2" }}>
                <div>✓ Employee Database</div>
                <div>✓ Attendance Tracking</div>
                <div>✓ Payroll Management</div>
                <div>✓ Leave Management</div>
              </div>

            </div>


            {/* BACK */}

            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "#fff",
              borderRadius: "16px",
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              overflow: "hidden"
            }}>

              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978"
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />

              <div style={{ padding: "25px" }}>

                <h3>Smart HRMS Platform</h3>

                <p style={{ color: "#555" }}>
                  Centralized HR system to manage employee lifecycle and payroll efficiently.
                </p>

                <div style={{ marginTop: "10px", lineHeight: "1.8" }}>
                  <div>✔ Employee lifecycle management</div>
                  <div>✔ Automated payroll processing</div>
                  <div>✔ Attendance analytics</div>
                  <div>✔ HR reporting tools</div>
                </div>

              </div>

            </div>

          </div>
        </div>



        {/* HR AI CARD */}

        <div style={{ perspective: "1000px" }}>
          <div
            style={{
              position: "relative",
              width: "360px",
              height: "420px",
              transformStyle: "preserve-3d",
              transition: "0.7s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "rotateY(180deg)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "rotateY(0deg)"}
          >

            {/* FRONT */}

            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "#fff",
              padding: "40px",
              borderRadius: "16px",
              boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
              backfaceVisibility: "hidden"
            }}>

              <i className="bi bi-robot" style={{ fontSize: "40px", color: "#2b5fab" }}></i>

              <div style={{ fontSize: "26px", fontWeight: "600", marginTop: "15px" }}>
                HR AI
              </div>

              <p style={{ marginTop: "10px", color: "#555" }}>
                AI powered recruitment and hiring automation.
              </p>

              <div style={{ marginTop: "15px", lineHeight: "2" }}>
                <div>✓ AI Resume Screening</div>
                <div>✓ Candidate Matching</div>
                <div>✓ Predictive Hiring</div>
                <div>✓ HR Analytics</div>
              </div>

            </div>


            {/* BACK */}

            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "#fff",
              borderRadius: "16px",
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              overflow: "hidden"
            }}>

              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />

              <div style={{ padding: "25px" }}>

                <h3>AI Recruitment</h3>

                <p style={{ color: "#555" }}>
                  Automate hiring workflows and find the best candidates faster.
                </p>

                <div style={{ marginTop: "10px", lineHeight: "1.8" }}>
                  <div>✔ AI resume screening</div>
                  <div>✔ Candidate ranking</div>
                  <div>✔ Interview automation</div>
                  <div>✔ Recruitment analytics</div>
                </div>

              </div>

            </div>

          </div>
        </div>



        {/* PRODUCTIVITY CARD */}

        <div style={{ perspective: "1000px" }}>
          <div
            style={{
              position: "relative",
              width: "360px",
              height: "420px",
              transformStyle: "preserve-3d",
              transition: "0.7s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "rotateY(180deg)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "rotateY(0deg)"}
          >

            {/* FRONT */}

            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "#fff",
              padding: "40px",
              borderRadius: "16px",
              boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
              backfaceVisibility: "hidden"
            }}>

              <i className="bi bi-lightning-charge-fill" style={{ fontSize: "40px", color: "#2b5fab" }}></i>

              <div style={{ fontSize: "26px", fontWeight: "600", marginTop: "15px" }}>
                Productivity
              </div>

              <p style={{ marginTop: "10px", color: "#555" }}>
                Tools designed to improve team performance.
              </p>

              <div style={{ marginTop: "15px", lineHeight: "2" }}>
                <div>✓ Task Automation</div>
                <div>✓ Performance Tracking</div>
                <div>✓ Team Collaboration</div>
                <div>✓ Analytics Dashboard</div>
              </div>

            </div>


            {/* BACK */}

            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "#fff",
              borderRadius: "16px",
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              overflow: "hidden"
            }}>

              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692"
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />

              <div style={{ padding: "25px" }}>

                <h3>Boost Productivity</h3>

                <p style={{ color: "#555" }}>
                  Smart workflow automation tools that help teams work faster and smarter.
                </p>

                <div style={{ marginTop: "10px", lineHeight: "1.8" }}>
                  <div>✔ Workflow automation</div>
                  <div>✔ Performance tracking</div>
                  <div>✔ Team collaboration</div>
                  <div>✔ Business analytics</div>
                </div>

              </div>

            </div>

          </div>
        </div>



        {/* CRM CARD */}

        <div style={{ perspective: "1000px" }}>
          <div
            style={{
              position: "relative",
              width: "360px",
              height: "420px",
              transformStyle: "preserve-3d",
              transition: "0.7s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "rotateY(180deg)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "rotateY(0deg)"}
          >

            {/* FRONT */}

            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "#fff",
              padding: "40px",
              borderRadius: "16px",
              boxShadow: "0 12px 35px rgba(0,0,0,0.08)",
              backfaceVisibility: "hidden"
            }}>

              <i className="bi bi-bar-chart-line-fill" style={{ fontSize: "40px", color: "#2b5fab" }}></i>

              <div style={{ fontSize: "26px", fontWeight: "600", marginTop: "15px" }}>
                CRM
              </div>

              <p style={{ marginTop: "10px", color: "#555" }}>
                Customer relationship management system.
              </p>

              <div style={{ marginTop: "15px", lineHeight: "2" }}>
                <div>✓ Customer Database</div>
                <div>✓ Sales Tracking</div>
                <div>✓ Lead Management</div>
                <div>✓ Client Communication</div>
              </div>

            </div>


            {/* BACK */}

            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "#fff",
              borderRadius: "16px",
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              overflow: "hidden"
            }}>

              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />

              <div style={{ padding: "25px" }}>

                <h3>Customer Management</h3>

                <p style={{ color: "#555" }}>
                  Track leads, manage customer data and improve sales performance.
                </p>

                <div style={{ marginTop: "10px", lineHeight: "1.8" }}>
                  <div>✔ Lead pipeline tracking</div>
                  <div>✔ Customer interaction history</div>
                  <div>✔ Sales analytics</div>
                  <div>✔ Client communication tools</div>
                </div>

              </div>

            </div>

          </div>
        </div>


      </div>
    </>

  );
};


const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of HR",
    company: "TechCorp",
    photo: "SC",
    feedback: "This platform cut our hiring time by 40% and improved candidate quality significantly. Game changer!",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Talent Director",
    company: "InnovateLabs",
    photo: "MJ",
    feedback: "The AI screening is incredibly accurate. We've hired 15 people in 3 months with zero regrets.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "CEO",
    company: "StartupHub",
    photo: "ER",
    feedback: "As a startup, we needed speed and quality. AI Recruiter delivered both beyond our expectations.",
    rating: 5
  }
];

const Landing = () => {
  const [openFAQ, setOpenFAQ] = React.useState(null);
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const userRole = getUserRole();
    if (userRole === 'superadmin') {
      navigate('/super-admin');
    }
  }, [navigate]);

  const pricingPlans = [
    {
      name: 'FREE',
      color: '#E8B4F8',
      monthlyPrice: '₹0',
      yearlyPrice: '₹500',
      features: [
        { text: '50 GB Bandwidth', included: true },
        { text: 'Financial Analysis', included: true },
        { text: '24 hour support', included: false },
        { text: 'Customer Management', included: false },
        { text: 'Advanced Analytics', included: false }
      ]
    },
    {
      name: 'BASIC',
      color: '#FF69B4',
      monthlyPrice: '₹799',
      yearlyPrice: '₹7990',
      features: [
        { text: '50 GB Bandwidth', included: true },
        { text: 'Financial Analysis', included: true },
        { text: '24 hour support', included: true },
        { text: 'Customer Management', included: false },
        { text: 'Advanced Analytics', included: false }
      ]
    },
    {
      name: 'STANDARD',
      color: '#8B5CF6',
      monthlyPrice: '₹1,199',
      yearlyPrice: '₹11,990',
      features: [
        { text: '50 GB Bandwidth', included: true },
        { text: 'Financial Analysis', included: true },
        { text: '24 hour support', included: true },
        { text: 'Customer Management', included: true },
        { text: 'Advanced Analytics', included: false }
      ]
    }
  ];

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const clients = [
    { name: 'AI Recruiter & HR Automation', image: PLATFORM_TOPICS[0].bg, icon: <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10"><path d="M5 10 L20 5 L35 10 L20 35 Z" fill="#3B82F6" /></svg> },
    { name: 'CRM', image: PLATFORM_TOPICS[1].bg, icon: <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10"><path d="M8 12 L14 28 L20 8 L26 28 L32 12" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { name: 'Productivity', image: PLATFORM_TOPICS[2].bg, icon: <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10"><path d="M8 20 L15 12 L22 18 L32 8" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 28 L15 22 L22 26 L32 18" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { name: 'HRMS', image: PLATFORM_TOPICS[3].bg, icon: <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10"><circle cx="20" cy="20" r="12" stroke="#EC4899" strokeWidth="3" fill="none" /><path d="M20 12 L20 20 L26 26" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" /></svg> }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className='min-vh-100 d-flex flex-column'>
      <style>{animationStyles}</style>

      <Navbar />

      {/* Hero Carousel */}
      <section className='hero-carousel-wrapper py-0 px-3 px-md-0 mb-4' style={{ marginBottom: '20px' }}>
        <style>{`
          .hero-carousel-wrapper .slick-slider { overflow: hidden; border-radius: 20px; }
          .hero-carousel-wrapper .slick-list, .hero-carousel-wrapper .slick-track { height: 100%; }
          .hero-carousel-wrapper .slick-slide > div { height: 100%; }
          .hero-carousel-wrapper .hero-slide {
            min-height: 560px;
            display: flex !important;
            align-items: center;
            justify-content: center;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: relative;
          }
          .hero-carousel-wrapper .hero-slide-overlay {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.45);
            border-radius: 20px;
          }
          .hero-carousel-wrapper .hero-slide-content { position: relative; z-index: 2; width: 100%; }
          .hero-carousel-wrapper .slick-prev, .hero-carousel-wrapper .slick-next { z-index: 10; }
          .hero-carousel-wrapper .slick-prev { left: 16px; }
          .hero-carousel-wrapper .slick-next { right: 16px; }
          .hero-carousel-wrapper .slick-dots { bottom: 20px; }
          .hero-carousel-wrapper .slick-dots li button:before { color: rgba(255,255,255,0.8); font-size: 10px; }
          .hero-carousel-wrapper .slick-dots li.slick-active button:before { color: #fff; }
          @media (min-width: 768px) { .hero-carousel-wrapper .hero-slide { min-height: 720px; } }
          .hero-carousel-wrapper .hero-points {
            list-style: none; padding: 0; margin: 0 0 1.25rem 0;
            display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem 1.25rem;
          }
          .hero-carousel-wrapper .hero-points li {
            color: rgba(255,255,255,0.9); font-size: 0.9rem;
            display: flex; align-items: center; gap: 0.35rem;
          }
          .hero-carousel-wrapper .hero-points li::before { content: "✓"; color: #4ade80; font-weight: bold; }
        `}</style>
        <Slider
          dots
          infinite
          speed={600}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay
          autoplaySpeed={2000}
          pauseOnHover
          arrows
          fade
          adaptiveHeight
        >
          {PLATFORM_TOPICS.map((slide, idx) => (
            <div key={slide.id}>
              <div className='hero-slide' style={{ backgroundImage: `url(${slide.bg})` }}>
                <div className='hero-slide-overlay' />
                <div className='container hero-slide-content'>
                  <div className='row align-items-center justify-content-center'>
                    <div className='col-lg-8 text-center text-white'>
                      <div className='mb-3'>
                        <span className='badge bg-primary bg-opacity-90 text-white border-0 px-3 py-2'>{slide.badge}</span>
                      </div>
                      <h1 className='display-5 display-md-4 fw-bold mb-3 px-3'>{slide.title}</h1>
                      <p className='lead mb-3 px-3 text-white-50'>{slide.subtitle}</p>
                      <ul className='hero-points px-3 mb-4'>
                        {slide.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                      <div className='d-flex flex-column flex-sm-row justify-content-center gap-3 px-3'>
                        <Link to='/login' className='btn btn-primary btn-sm btn-md-lg px-4 btn-hover-lift'>Get Started</Link>
                        <Link to='/pricing' className='btn btn-outline-light btn-sm btn-md-lg px-4 btn-hover-lift'>View Pricing</Link>
                      </div>
                      <div className='d-flex justify-content-center text-white-50 mt-4 px-3'>
                        <span className='small'>✅ Trusted by 500+ hiring teams</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>
      <div className="py-4">
        <AIRecruiterBody />
      </div>

      {/* How it works */}
      <section id='how' className='container px-3 px-md-0 pb-5 pb-md-5'>
        <HowItWorksSection />
      </section>

      {/* The duplicate "What We Offer" section has been removed */}

      <section id='platform-features' className='px-3 px-md-5'>
        <ClientFeaturesSection clients={clients} />
      </section>



      {/* About Us */}
      <section className='py-3 py-md-5'>
        <ScrollAnimatedCard delay={0} isVisible={true}>
          <div
            className='container card border shadow-none p-3 p-md-5 about-us-container px-3 px-md-0'
            style={{
              animation: `fadeInUp 0.8s ease-out 0ms forwards`,
              opacity: 0,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className='row g-5 align-items-center'>
              <div className='col-12 col-lg-6'>
                <div className='row'>
                  <div className='col-6 text-end'>
                    <ScrollAnimatedCard delay={200} isVisible={true}>
                      <div
                        className='about-image-container'
                        style={{
                          animation: `scaleIn 0.8s ease-out 200ms forwards`,
                          opacity: 0,
                          transition: 'all 0.4s ease'
                        }}
                        onMouseEnter={(e) => {
                          const img = e.currentTarget.querySelector('.about-image');
                          if (img) {
                            img.style.transform = 'scale(1.05) rotate(2deg)';
                            img.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          const img = e.currentTarget.querySelector('.about-image');
                          if (img) {
                            img.style.transform = 'scale(1) rotate(0deg)';
                            img.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                          }
                        }}
                      >
                        <img
                          className='rounded-3 shadow-sm about-image'
                          src="/assets/images/landing1.png"
                          style={{
                            width: "250px",
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: 'scale(1)',
                            borderRadius: '12px'
                          }}
                          alt="Office team working"
                        />
                        <div
                          className='d-flex align-items-center justify-content-end mt-3 about-stat'
                          style={{
                            animation: `fadeInUp 0.6s ease-out 400ms forwards`,
                            opacity: 0
                          }}
                        >
                          <div className='d-inline-block pe-2'>
                            <h4 className='line-height-100 fw-normal mb-0'>+</h4>
                            <p className='text-dark fw-bold mb-0'>Professionals</p>
                          </div>
                          <div className='d-inline-block'>
                            <h3
                              className='fw-medium display-4 letter-spacing-1 text-primary about-number'
                              style={{
                                transition: 'all 0.3s ease',
                                transform: 'scale(1)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                e.currentTarget.style.color = '#EC4899';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.color = '#3B82F6';
                              }}
                            >35</h3>
                          </div>
                        </div>
                      </div>
                    </ScrollAnimatedCard>
                  </div>
                  <div className='col-6'>
                    <ScrollAnimatedCard delay={300} isVisible={true}>
                      <div
                        className='about-stat-container'
                        style={{
                          animation: `fadeInUp 0.6s ease-out 300ms forwards`,
                          opacity: 0
                        }}
                      >
                        <div className='d-flex align-items-center mb-3'>
                          <div className='d-inline-block'>
                            <h3
                              className='fw-medium display-4 letter-spacing-1 text-primary about-number'
                              style={{
                                transition: 'all 0.3s ease',
                                transform: 'scale(1)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                e.currentTarget.style.color = '#EC4899';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.color = '#3B82F6';
                              }}
                            >14</h3>
                          </div>
                          <div className='d-inline-block ps-2'>
                            <h4 className='line-height-100 fw-normal mb-0'>+</h4>
                            <p className='text-dark fw-bold mb-0'>Years of Experience</p>
                          </div>
                        </div>
                        <div
                          className='about-image-container'
                          style={{
                            transition: 'all 0.4s ease'
                          }}
                          onMouseEnter={(e) => {
                            const img = e.currentTarget.querySelector('.about-image');
                            if (img) {
                              img.style.transform = 'scale(1.05) rotate(-2deg)';
                              img.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            const img = e.currentTarget.querySelector('.about-image');
                            if (img) {
                              img.style.transform = 'scale(1) rotate(0deg)';
                              img.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                            }
                          }}
                        >
                          <img
                            className='rounded-3 shadow-sm about-image'
                            src="/assets/images/landing2.png"
                            style={{
                              width: "250px",
                              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                              transform: 'scale(1)',
                              borderRadius: '12px'
                            }}
                            alt="Team collaboration"
                          />
                        </div>
                      </div>
                    </ScrollAnimatedCard>
                  </div>
                </div>
              </div>
              <div className='col-12 col-lg-6'>
                <ScrollAnimatedCard delay={500} isVisible={true}>
                  <div
                    className='about-content'
                    style={{
                      animation: `fadeInUp 0.8s ease-out 500ms forwards`,
                      opacity: 0
                    }}
                  >
                    <h3
                      className='display-6 fw-normal mb-3 about-title'
                      style={{
                        transition: 'all 0.3s ease',
                        transform: 'translateY(0)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.color = '#3B82F6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.color = 'inherit';
                      }}
                    >
                      All in one: AI Recruiter & HR Automation, CRM, Productivity, HRMS
                    </h3>
                    <p
                      className='text-secondary-light mb-4 about-description'
                      style={{
                        transition: 'all 0.3s ease',
                        animation: `fadeInUp 0.6s ease-out 700ms forwards`,
                        opacity: 0
                      }}
                    >
                      One platform for recruiting, sales, productivity, and HR. Hire, sell, and manage people from a single place.
                    </p>
                    <button
                      type="button"
                      className='btn btn-primary px-4 py-2 about-button'
                      style={{
                        background: 'linear-gradient(90deg, #3B82F6 0%, #EC4899 100%)',
                        border: 'none',
                        borderRadius: '25px',
                        color: 'white',
                        fontWeight: 'bold',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'translateY(0)',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                        animation: `fadeInUp 0.8s ease-out 900ms forwards`,
                        opacity: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                        e.currentTarget.style.background = 'linear-gradient(90deg, #EC4899 0%, #3B82F6 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                        e.currentTarget.style.background = 'linear-gradient(90deg, #3B82F6 0%, #EC4899 100%)';
                      }}
                    >
                      LEARN MORE
                    </button>
                  </div>
                </ScrollAnimatedCard>
              </div>
            </div>
          </div>
        </ScrollAnimatedCard>
      </section>

      {/* Testimonials */}
      <section className='container px-3 pb-5'>
        <h3 className='display-6 display-md-5 fw-bold mb-3 mb-md-4 text-primary text-center'>AI Recruiter, CRM, Productivity & HRMS</h3>

        <Slider {...carouselSettings}>
          {[
            {
              name: "TechNova HR",
              text: "AI Recruitment helped us cut screening time by 60%.",
              color: '#3B82F6',
              bgColor: '#EFF6FF'
            },
            {
              name: "FutureHire",
              text: "The unified dashboard keeps our team perfectly aligned.",
              color: '#10B981',
              bgColor: '#ECFDF5'
            },
            {
              name: "SmartWorks",
              text: "We posted jobs to multiple boards in seconds fantastic tool.",
              color: '#F59E0B',
              bgColor: '#FFFBEB'
            },
            {
              name: "Innova Talent",
              text: "Super intuitive interface and great automation features.",
              color: '#EC4899',
              bgColor: '#FDF2F8'
            },
          ].map((card, i) => (
            <div key={i} className='px-2'>
              <div
                className='card border-0 shadow-sm text-center position-relative'
                style={{
                  minHeight: '200px',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  backgroundColor: card.bgColor,
                  borderTop: `4px solid ${card.color}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 30px ${card.color}40`;
                  e.currentTarget.style.borderTop = `4px solid ${card.color}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderTop = `4px solid ${card.color}`;
                }}
              >
                <div className='card-body p-3 p-md-5 d-flex flex-column justify-content-between'>
                  <p className='mb-4 mb-md-3 fw-bold fs-6' style={{ color: '#1F2937' }}>{card.text}</p>
                  <h6 className='mb-0 fw-bold' style={{ color: card.color }}>{card.name}</h6>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Benefits Infographic */}
      <div className='container px-3'>
        <ScrollAnimatedCard delay={0} isVisible={true}>
          <div className='card border-0 shadow-lg mb-4 mb-md-5 mx-auto' style={{
            borderRadius: '20px',
            overflow: 'hidden',
            animation: `fadeInUp 0.8s ease-out 0ms forwards`,
            opacity: 0,
            maxWidth: '100%'
          }}>
            <div className='row g-0 h-100'>
              <div className='col-12 col-md-4 position-relative' style={{
                backgroundColor: '#7C3AED',
                padding: '3rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '400px'
              }}>
                <div>
                  <h2 className='text-white fw-bold mb-0' style={{ fontSize: '2rem', lineHeight: '1.2' }}>
                    <span style={{ fontSize: '1.9rem' }}>5 KEY</span><br />
                    <span>BENEFITS OF </span><br />
                    <span>AI IN</span><br />
                    <span style={{ fontSize: '3.0rem' }}>RECRUITMENT</span>
                  </h2>
                </div>

                <div className='d-flex justify-content-center align-items-center' style={{ flex: 1 }}>
                  <Bot size={120} color="white" style={{ opacity: 0.9 }} />
                </div>

                <div className='mt-3'>
                  <p className='text-white small mb-0' style={{ fontSize: '0.875rem' }}>recruitcrm.io</p>
                </div>
              </div>

              <div className='col-12 col-md-8 position-relative' style={{
                backgroundColor: '#F3E8FF',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '1.5rem',
                minHeight: '400px'
              }}>
                <div className='position-absolute' style={{
                  top: '-50px',
                  left: '-50px',
                  width: '200px',
                  height: '200px',
                  backgroundColor: '#7C3AED',
                  borderRadius: '50%',
                  opacity: 0.3
                }}></div>
                <div className='position-absolute' style={{
                  bottom: '-30px',
                  left: '-30px',
                  width: '150px',
                  height: '150px',
                  backgroundColor: '#7C3AED',
                  borderRadius: '50%',
                  opacity: 0.2
                }}></div>

                {[
                  { text: 'Increases efficiency' },
                  { text: 'Boosts candidate experience' },
                  { text: 'Reduces hiring bias' },
                  { text: 'Enhances data analysis' },
                  { text: 'Improves candidate matching' }
                ].map((benefit, idx) => (
                  <div
                    key={idx}
                    className='d-flex align-items-center bg-white rounded-pill p-3 shadow-sm position-relative'
                    style={{
                      transition: 'all 0.3s ease',
                      animation: `fadeInUp 0.6s ease-out ${(idx * 100) + 200}ms forwards`,
                      opacity: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(10px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div className='rounded-circle d-flex align-items-center justify-content-center me-3' style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#8B5CF6',
                      flexShrink: 0
                    }}>
                      <i className='ri-check-line text-white fs-5'></i>
                    </div>
                    <span className='fw-semibold text-dark' style={{ fontSize: '1rem' }}>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollAnimatedCard>
      </div>

      {/* Pricing Cards */}
      <section className='px-3 px-md-5'>
        <div className='container card border shadow-none p-3 p-md-5'>
          <div className='text-center text-black mb-4 mb-md-5'>
            <h3 className='display-6 display-md-5 fw-bold text-primary text-center'> Pricing & Plans</h3>
          </div>

          <div className='d-flex justify-content-center mb-5'>
            <div
              className='position-relative d-flex align-items-center'
              style={{
                backgroundColor: 'white',
                borderRadius: '25px',
                padding: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div
                className='position-absolute'
                style={{
                  backgroundColor: '#3B82F6',
                  borderRadius: '20px',
                  height: '36px',
                  width: '50%',
                  left: isYearly ? '50%' : '4px',
                  top: '4px',
                  transition: 'left 0.3s ease',
                  zIndex: 1
                }}
              />

              <button
                className={`position-relative border-0 bg-transparent px-4 py-2 fw-bold text-uppercase ${!isYearly ? 'text-white' : 'text-dark'
                  }`}
                style={{
                  borderRadius: '20px',
                  fontSize: '14px',
                  zIndex: 2,
                  transition: 'color 0.3s ease'
                }}
                onClick={() => setIsYearly(false)}
              >
                MONTHLY
              </button>

              <button
                className={`position-relative border-0 bg-transparent px-4 py-2 fw-bold text-uppercase ${isYearly ? 'text-white' : 'text-dark'
                  }`}
                style={{
                  borderRadius: '20px',
                  fontSize: '14px',
                  zIndex: 2,
                  transition: 'color 0.3s ease'
                }}
                onClick={() => setIsYearly(true)}
              >
                YEARLY
              </button>
            </div>
          </div>

          <div className='row g-3 g-md-4 justify-content-center mb-5'>
            {pricingPlans.map((plan, index) => (
              <div key={index} className='col-12 col-sm-6 col-lg-3'>
                <ScrollAnimatedCard delay={index * 200} isVisible={true}>
                  <div
                    className='card h-100 border-0 shadow-lg position-relative pricing-card'
                    style={{
                      borderRadius: '20px',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: 'translateY(0)',
                      animation: `fadeInUp 0.8s ease-out ${index * 200}ms forwards`,
                      opacity: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div
                      className='position-absolute top-0 start-0 px-3 py-2 text-white fw-bold pricing-tab'
                      style={{
                        backgroundColor: plan.color,
                        borderRadius: '20px 0 20px 0',
                        fontSize: '14px',
                        zIndex: 1,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {plan.name}
                    </div>

                    <div className='card-body p-3 p-md-4 pt-4 pt-md-5'>
                      <div className='text-center mb-3 mb-md-4'>
                        <h4
                          className='display-6 fw-bold text-dark mb-0 pricing-price'
                          style={{
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)'
                          }}
                        >
                          {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                          <span className='fs-6 text-black'>/{isYearly ? 'year' : 'mon'}</span>
                        </h4>
                      </div>

                      <div className='mb-4'>
                        {plan.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className='d-flex align-items-center mb-3 pricing-feature'
                            style={{
                              transition: 'all 0.3s ease',
                              transform: 'translateX(0)',
                              animation: `fadeInUp 0.6s ease-out ${(index * 200) + (featureIndex * 100)}ms forwards`,
                              opacity: 0
                            }}
                          >
                            <div className='me-3'>
                              {feature.included ? (
                                <i className='ri-check-line text-success fs-5'></i>
                              ) : (
                                <i className='ri-close-line text-danger fs-5'></i>
                              )}
                            </div>
                            <span className='text-dark'>{feature.text}</span>
                          </div>
                        ))}
                      </div>

                      <div className='text-center'>
                        <Link to='/pricing' >
                          <button
                            className='btn btn-primary pricing-btn w-100'
                            style={{
                              background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                              border: 'none',
                              borderRadius: '12px',
                              padding: '12px 16px',
                              fontWeight: '600',
                              transition: 'all 0.3s ease',
                              transform: 'translateY(0)',
                              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                              animation: `fadeInUp 0.8s ease-out ${(index * 200) + 400}ms forwards`,
                              opacity: 0
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                            }}
                          >
                            Choose Plan
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollAnimatedCard>
              </div>
            ))}
          </div>

          <ScrollAnimatedCard delay={200} isVisible={true}>
            <div className='card border-0 shadow-lg mb-5 mx-auto' style={{
              borderRadius: '20px',
              overflow: 'hidden',
              animation: `fadeInUp 0.8s ease-out 200ms forwards`,
              opacity: 0,
              maxWidth: '100%'
            }}>
              <div className='row g-0 h-100'>
                <div className='col-12 col-md-4 position-relative' style={{
                  backgroundColor: '#0891B2',
                  padding: '3rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '350px'
                }}>
                  <div>
                    <h2 className='text-white fw-bold mb-0' style={{ fontSize: '2rem', lineHeight: '1.2' }}>
                      <span style={{ fontSize: '2.5rem' }}>WHY CHOOSE</span><br />
                      <span>OUR PRICING</span><br />
                      <span>PLANS?</span>
                    </h2>
                  </div>

                  <div className='d-flex justify-content-center align-items-center' style={{ flex: 1 }}>
                    <BarChart3 size={100} color="white" style={{ opacity: 0.9 }} />
                  </div>

                  <div className='mt-3'>
                    <p className='text-white small mb-0' style={{ fontSize: '0.875rem' }}>AI Recruitment</p>
                  </div>
                </div>

                <div className='col-12 col-md-8 position-relative' style={{
                  backgroundColor: '#CFFAFE',
                  padding: '3rem 2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '1.5rem',
                  minHeight: '350px'
                }}>
                  <div className='position-absolute' style={{
                    top: '-50px',
                    left: '-50px',
                    width: '200px',
                    height: '200px',
                    backgroundColor: '#0891B2',
                    borderRadius: '50%',
                    opacity: 0.3
                  }}></div>
                  <div className='position-absolute' style={{
                    bottom: '-30px',
                    left: '-30px',
                    width: '150px',
                    height: '150px',
                    backgroundColor: '#0891B2',
                    borderRadius: '50%',
                    opacity: 0.2
                  }}></div>

                  {[
                    { text: 'Transparent pricing' },
                    { text: 'No hidden fees' },
                    { text: 'Cancel anytime' },
                    { text: 'All features included' },
                    { text: '24/7 customer support' }
                  ].map((benefit, idx) => (
                    <div
                      key={idx}
                      className='d-flex align-items-center bg-white rounded-pill p-3 shadow-sm position-relative'
                      style={{
                        transition: 'all 0.3s ease',
                        animation: `fadeInUp 0.6s ease-out ${(idx * 100) + 400}ms forwards`,
                        opacity: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(10px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <div className='rounded-circle d-flex align-items-center justify-content-center me-3' style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#06B6D4',
                        flexShrink: 0
                      }}>
                        <i className='ri-check-line text-white fs-5'></i>
                      </div>
                      <span className='fw-semibold text-dark' style={{ fontSize: '1rem' }}>{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollAnimatedCard>
        </div>
      </section>

      {/* FAQ and Video Section */}
      <section className='container p-3 p-md-5'>
        <div className='row align-items-center g-3 g-md-4'>
          <div className='col-lg-6'>
            <div className='d-flex flex-column gap-3'>
              {[
                {
                  question: "Where to start?",
                  answer: "Begin by creating your first job posting and setting up your company profile. Our AI will guide you through the process step by step."
                },
                {
                  question: "Data analytics",
                  answer: "Track your hiring metrics with comprehensive analytics including time-to-hire, candidate quality scores, and pipeline performance."
                },
                {
                  question: "Understanding the market",
                  answer: "Get insights into salary benchmarks, skill demand trends, and competitive analysis to make informed hiring decisions."
                },
                {
                  question: "What can we do to help?",
                  answer: "Our AI-powered platform automates screening, scheduling, and candidate communication, freeing you to focus on building relationships."
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className='card border-0 shadow-sm rounded-3 bg-white'
                  style={{
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.border = '1px solid #3B82F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.border = 'none';
                  }}
                >
                  <div className='card-body p-4'>
                    <div
                      className='d-flex justify-content-between align-items-center cursor-pointer'
                      onClick={() => toggleFAQ(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className='d-flex align-items-center gap-3'>
                        <h6 className='mb-0 fw-semibold' style={{ color: '#ecaa48' }}>{item.question}</h6>
                      </div>
                      <i
                        className={`ri-arrow-down-s-line fs-5 text-secondary transition-all ${openFAQ === index ? 'rotate-180' : ''
                          }`}
                        style={{
                          transform: openFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }}
                      ></i>
                    </div>
                    <div
                      className={`mt-3 overflow-hidden transition-all ${openFAQ === index ? 'max-height-200 opacity-100' : 'max-height-0 opacity-0'
                        }`}
                      style={{
                        maxHeight: openFAQ === index ? '200px' : '0px',
                        opacity: openFAQ === index ? 1 : 0,
                        transition: 'max-height 0.3s ease, opacity 0.3s ease'
                      }}
                    >
                      <p className='text-secondary-light mb-0 lh-base' style={{ color: "#030108ff" }}>{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='col-lg-6'>
            <ScrollAnimatedCard delay={300} isVisible={true}>
              <div
                className='position-relative rounded-3 overflow-hidden shadow-lg faq-image-container'
                style={{
                  animation: `fadeInUp 0.8s ease-out 300ms forwards`,
                  opacity: 0,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
                  const img = e.currentTarget.querySelector('.faq-image');
                  if (img) {
                    img.style.transform = 'scale(1.1) rotate(2deg)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                  const img = e.currentTarget.querySelector('.faq-image');
                  if (img) {
                    img.style.transform = 'scale(1) rotate(0deg)';
                  }
                }}
              >
                <div className='bg-light' style={{ aspectRatio: '16/9', minHeight: '300px' }}>
                  <div className='w-100 h-100 d-flex align-items-center justify-content-center bg-gradient position-relative'
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      overflow: 'hidden'
                    }}>

                    <div
                      className='position-absolute'
                      style={{
                        width: '200px',
                        height: '200px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        top: '-50px',
                        right: '-50px',
                        animation: 'float 6s ease-in-out infinite'
                      }}
                    ></div>
                    <div
                      className='position-absolute'
                      style={{
                        width: '150px',
                        height: '150px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '50%',
                        bottom: '-30px',
                        left: '-30px',
                        animation: 'float 8s ease-in-out infinite reverse'
                      }}
                    ></div>

                    <img
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                      className='w-100 faq-image position-relative'
                      alt='Video Placeholder'
                      style={{
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'scale(1)',
                        filter: 'brightness(1.1) contrast(1.1)',
                        borderRadius: '12px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </ScrollAnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='container pb-5 px-3'>
        <div
          className='card bg-primary text-white border-0'
          style={{
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(13, 110, 253, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className='card-body p-4 p-md-5 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3'>
            <div className='text-center text-md-start'>
              <h5 className='mb-2 mb-md-3 text-white'>Ready to accelerate hiring?</h5>
              <p className='mb-0 text-white small'>Start free, then choose a plan that scales with your team.</p>
            </div>
            <div className='d-flex align-items-center gap-2 w-100 w-md-auto justify-content-center'>
              <Link
                to='/login'
                className='btn btn-light btn-sm'
                style={{
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Get Started
              </Link>
              <Link
                to='/pricing'
                className='btn btn-outline-light btn-sm'
                style={{
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;