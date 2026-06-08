import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserRole } from "../../shared/utils/auth";
import Navbar from './Navbar';
import Footer from './Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Bot, BarChart3, Zap, FileText, CheckCircle2, ArrowRight, ChevronDown } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-out-cubic',
    });

    const userRole = getUserRole();
    if (userRole === 'superadmin') {
      navigate('/super-admin');
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, [navigate]);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const PLATFORM_TOPICS = [
    {
      id: 'ai-recruiter',
      title: 'AI Recruiter & HR Automation',
      subtitle: 'Source, screen, and hire faster with AI. Automate recruiting and focus on great conversations.',
      badge: '✨ AI Talent Platform',
      points: ['Smart resume screening & shortlisting', 'Automated interview scheduling', 'AI-powered candidate matching', 'Pipeline from job post to offer'],
      bg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
      color: '#3B82F6',
      icon: Bot
    },
    {
      id: 'crm',
      title: 'CRM',
      subtitle: 'Manage leads, deals, and customer relationships in one powerful platform.',
      badge: '📊 Customer Relations',
      points: ['Leads, contacts & deal pipeline', 'Activity tracking & follow-ups', 'Sales forecasting & reports', 'Integrations with email & calendar'],
      bg: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80',
      color: '#10B981',
      icon: BarChart3
    },
    {
      id: 'productivity',
      title: 'Productivity',
      subtitle: 'Boost team productivity with smart workflows and real-time collaboration.',
      badge: '⚡ Work Smarter',
      points: ['Tasks, projects & deadlines', 'Team dashboards & visibility', 'Workflow automation', 'Docs and knowledge base'],
      bg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
      color: '#F59E0B',
      icon: Zap
    },
    {
      id: 'hrms',
      title: 'HRMS',
      subtitle: 'Complete HR management: payroll, attendance, leave, and employee lifecycle.',
      badge: '👥 Human Resources',
      points: ['Payroll & compliance', 'Attendance & leave management', 'Onboarding & offboarding', 'Performance & appraisals'],
      bg: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1920&q=80',
      color: '#EC4899',
      icon: FileText
    }
  ];

  const pricingPlans = [
    {
      name: 'FREE',
      color: 'bg-purple-300',
      textColor: 'text-purple-600',
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
      color: 'bg-pink-400',
      textColor: 'text-pink-600',
      monthlyPrice: '₹799',
      yearlyPrice: '₹7990',
      popular: true,
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
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
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

  const faqs = [
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
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-28 lg:pb-14 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[600px] lg:h-[700px] bg-slate-900" data-aos="zoom-in" data-aos-duration="1000">
            <>
              {PLATFORM_TOPICS.map((slide, index) => (
                <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.bg})` }}
                  >
                    <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                  </div>
                  <div className="relative h-full flex items-center justify-center text-center px-4">
                    <div className="max-w-4xl mx-auto text-white">
                      <span 
                        className="inline-block py-1.5 px-4 rounded-full text-sm font-semibold mb-6 tracking-wide shadow-lg"
                        style={{ backgroundColor: slide.color }}
                      >
                        {slide.badge}
                      </span>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        {slide.subtitle}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                          to="/login"
                          className="px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 w-full sm:w-auto no-underline"
                        >
                          Get Started
                        </Link>
                        <Link 
                          to="/pricing"
                          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-lg border border-white/30 hover:bg-white/20 transition-all duration-300 w-full sm:w-auto no-underline"
                        >
                          View Pricing
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
            
            {/* Dots */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
              {PLATFORM_TOPICS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Simple 4-step process to streamline your workflow and drive results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Create Job', desc: 'Post your job requirements and let our AI optimize', icon: '📝', color: 'bg-blue-50', textColor: 'text-blue-600', delay: '0' },
              { title: 'Import Candidates', desc: 'Import candidates from various sources easily', icon: '👥', color: 'bg-emerald-50', textColor: 'text-emerald-600', delay: '150' },
              { title: 'Track Pipeline', desc: 'Monitor candidate progress through stages', icon: '📊', color: 'bg-amber-50', textColor: 'text-amber-600', delay: '300' },
              { title: 'Hire & Report', desc: 'Make offers and generate insightful reports', icon: '🎯', color: 'bg-pink-50', textColor: 'text-pink-600', delay: '450' }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${step.color}`}
                data-aos="fade-up"
                data-aos-delay={step.delay}
              >
                <div className={`w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-2xl shadow-sm mb-6 ${step.textColor}`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-10 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What We Offer</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              All in one: AI Recruiter & HR Automation, CRM, Productivity, and HRMS. Built for hiring teams, sales teams, and HR departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLATFORM_TOPICS.map((topic, idx) => {
              const Icon = topic.icon;
              return (
                <div 
                  key={idx} 
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  data-aos="fade-up" 
                  data-aos-delay={idx * 100}
                >
                  <div className="p-8">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ backgroundColor: topic.color }}
                    >
                      <Icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{topic.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3">{topic.subtitle}</p>
                    
                    <ul className="space-y-3">
                      {topic.points.slice(0,3).map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 size={16} style={{ color: topic.color }} className="mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div 
                    className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 ease-out group-hover:w-full"
                    style={{ backgroundColor: topic.color }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Us Stats Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl" data-aos="fade-up">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500 blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-pink-500 blur-3xl opacity-20"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Empowering teams to achieve more together.
                </h2>
                <p className="text-slate-300 text-lg mb-8">
                  One platform for recruiting, sales, productivity, and HR. Hire, sell, and manage people from a single intelligent workplace.
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-7 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                  Learn More About Us
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center" data-aos="zoom-in" data-aos-delay="200">
                  <div className="text-4xl md:text-4xl  text-blue-400 mb-2">35+</div>
                  <div className="text-white font-medium">Professionals</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center" data-aos="zoom-in" data-aos-delay="300">
                  <div className="text-4xl md:text-4xl text-pink-400 mb-2">14+</div>
                  <div className="text-white font-medium">Years Experience</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center" data-aos="zoom-in" data-aos-delay="400">
                  <div className="text-4xl md:text-4xl text-emerald-400 mb-2">500+</div>
                  <div className="text-white font-medium">Clients Worldwide</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center" data-aos="zoom-in" data-aos-delay="500">
                  <div className="text-4xl md:text-4xl text-amber-400 mb-2">99%</div>
                  <div className="text-white font-medium">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-10 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Pricing & Plans</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">Transparent pricing that scales with your growing business.</p>
            
            <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-slate-200">
              <button 
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isYearly ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                MONTHLY
              </button>
              <button 
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${isYearly ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                YEARLY <span className="text-xs text-green-400 ml-1">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col ${plan.popular ? 'ring-2 ring-blue-500 scale-105 md:-mt-4 md:mb-4 z-10' : ''}`}
                data-aos="fade-up"
                data-aos-delay={idx * 150}
              >
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-xs font-bold uppercase tracking-wider text-center py-2">
                    Most Popular
                  </div>
                )}
                
                <div className={`py-6 px-8 ${plan.color}`}>
                  <h3 className="text-white text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline text-white">
                    <span className="text-4xl font-bold">{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                    <span className="ml-2 opacity-80">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3">
                        {feature.included ? (
                          <CheckCircle2 size={20} className={plan.textColor} />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center">
                            <div className="w-2.5 h-0.5 bg-slate-200 rounded-full"></div>
                          </div>
                        )}
                        <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/pricing" className={`block w-full py-3 px-6 text-center rounded-xl font-bold transition-all duration-300 ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'} no-underline`}>
                    Choose Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2" data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx} 
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-300 hover:shadow-md"
                  >
                    <button 
                      onClick={() => toggleFAQ(idx)}
                      className="w-full flex items-center justify-between p-5 text-left bg-white focus:outline-none"
                    >
                      <span className="font-semibold text-slate-800 pr-4">{faq.question}</span>
                      <ChevronDown 
                        size={20} 
                        className={`text-slate-400 transition-transform duration-300 ${openFAQ === idx ? 'rotate-180 text-blue-500' : ''}`} 
                      />
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-50 ${openFAQ === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <p className="p-5 text-slate-600 border-t border-slate-100">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-1/2" data-aos="fade-left">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 z-10 mix-blend-overlay"></div>
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop" 
                  alt="Team working" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-12 shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden" data-aos="zoom-in">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to accelerate your hiring?</h3>
              <p className="text-blue-100 text-lg">Start for free today, then choose a plan that scales with your growing team.</p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <Link 
                to="/login"
                className="px-4 py-2 bg-white text-blue-600 font-bold rounded-full hover:bg-slate-50 hover:shadow-lg transition-all duration-300 text-center shadow-md no-underline"
              >
                Get Started Free
              </Link>
              <Link 
                to="/pricing"
                className="px-4 py-2 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 text-center shadow-md no-underline"
              >
                View All Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;