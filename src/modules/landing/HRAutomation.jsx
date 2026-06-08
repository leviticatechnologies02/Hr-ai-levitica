import React, { useEffect } from "react";
import { FaRobot, FaUserTie, FaChartLine, FaCheckCircle, FaRocket, FaBrain, FaSearch, FaHandshake } from "react-icons/fa";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

// ==================== HeroSection ====================
const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-12 lg:pt-28 lg:pb-14 overflow-hidden bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px] lg:min-h-[600px] bg-slate-900 flex items-center" data-aos="zoom-in" data-aos-duration="1000">
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/assets/images/bannerimg.png')` }}
            >
              <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/20"></div>
            </div>
          </div>
          
          <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 py-12 gap-10">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-left" data-aos="fade-right" data-aos-duration="1200" data-aos-delay="200">
              <div className="max-w-xl">
                <span 
                  className="inline-block py-1.5 px-4 rounded-full text-sm font-semibold mb-6 tracking-wide shadow-lg"
                  style={{ backgroundColor: '#3B82F6', color: '#fff' }}
                >
                  ✨ AI Talent Platform
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-white">
                  Smart AI Recruitment <br /> For Modern Hiring
                </h1>
                <p className="text-lg md:text-xl text-slate-200 mb-10 font-light leading-relaxed">
                  Automate your hiring process with our AI-powered recruiter. Screen resumes, conduct intelligent interviews, and identify the best candidates faster with advanced AI insights.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link 
                    to="/bookademo"
                    className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 w-full sm:w-auto text-center no-underline"
                  >
                    Book AI Demo
                  </Link>
                  <Link 
                    to="/contactpage"
                    className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-lg border border-white/30 hover:bg-white/20 transition-all duration-300 w-full sm:w-auto text-center no-underline"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="400">
              <div className="relative w-full max-w-[500px] animate-[float_6s_ease-in-out_infinite]">
                <img
                  src="./assets/images/hrimage.png"
                  alt="AI Robot Recruiter"
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        `}
      </style>
    </section>
  );
}

// Sparkle Icon helper
const FaSparkles = (props) => {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" {...props}>
      <path d="M8 0l1.669 4.697A4.498 4.498 0 0014.062 8l-4.393 3.303a4.498 4.498 0 00-4.393-3.303L8 16l-1.669-4.697a4.498 4.498 0 00-4.393-3.303L6.331 8a4.498 4.498 0 004.393-3.303L8 0z"></path>
    </svg>
  );
}

// ==================== Workflow / How It Works ====================
const Workflow = () => {
  const steps = [
    { icon: <FaSearch />, title: "Smart Sourcing", desc: "AI scans millions of profiles across platforms to find passive candidates that match your exact criteria." },
    { icon: <FaBrain />, title: "Predictive Screening", desc: "Resumes are instantly parsed and scored based on skills, experience, and cultural fit potential." },
    { icon: <FaRobot />, title: "Automated Interviews", desc: "Conduct asynchronous video interviews with AI-driven behavioral analysis and skill assessments." },
    { icon: <FaHandshake />, title: "Seamless Onboarding", desc: "Top candidates are automatically advanced, accelerating the offer phase and improving candidate experience." }
  ];

  return (
    <div className="py-10 px-6 md:px-10 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20" data-aos="fade-down">
          <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">How It Works</h4>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Hiring Workflow</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-[10%] w-[80%] h-1 bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-100 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center group" data-aos="zoom-in-up" data-aos-delay={index * 200}>
              <div className="w-24 h-24 rounded-2xl bg-white border border-gray-100 shadow-xl flex items-center justify-center text-4xl text-blue-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-blue-500/20">
                {step.icon}
              </div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== Features ====================
const Features = () => {
  return (
    <div className="bg-gray-50 py-10 px-6 md:px-10 text-center overflow-hidden">
      <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3" data-aos="fade-up">Our Features</h4>
      <h5 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16" data-aos="fade-up" data-aos-delay="100">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">AI-Powered</span> Hiring Solutions
      </h5>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
        {/* Card 1 */}
        <div className="relative p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] transition-all duration-500 overflow-hidden group border border-gray-100" data-aos="flip-left" data-aos-delay="100">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            alt="AI Screening"
            className="w-20 mx-auto mb-6 group-hover:-translate-y-2 transition-transform duration-300"
          />
          <h5 className="mb-4 font-bold text-2xl text-gray-800">AI Resume Screening</h5>
          <p className="text-gray-600 text-base leading-relaxed">
            Automatically analyze and shortlist candidates using intelligent AI
            algorithms that match skills and job requirements.
          </p>
        </div>

        {/* Card 2 */}
        <div className="relative p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] transition-all duration-500 overflow-hidden group border border-gray-100" data-aos="flip-up" data-aos-delay="200">
          <img
            src="https://i0.wp.com/rayhennessey.com/wp-content/uploads/2025/06/AI_Interviewer-scaled.jpg?resize=768%2C510&ssl=1"
            alt="AI Interview"
            className="w-32 h-24 mx-auto mb-4 rounded-lg object-cover group-hover:-translate-y-2 transition-transform duration-300"
          />
          <h5 className="mb-4 font-bold text-2xl text-gray-800">AI Video Interviews</h5>
          <p className="text-gray-600 text-base leading-relaxed">
            Conduct automated AI-powered interviews that evaluate candidate
            responses and communication skills.
          </p>
        </div>

        {/* Card 3 */}
        <div className="relative p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-500 overflow-hidden group border border-gray-100" data-aos="flip-right" data-aos-delay="300">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
            alt="AI Analytics"
            className="w-20 mx-auto mb-6 group-hover:-translate-y-2 transition-transform duration-300"
          />
          <h5 className="mb-4 font-bold text-2xl text-gray-800">Hiring Analytics</h5>
          <p className="text-gray-600 text-base leading-relaxed">
            Gain powerful insights and hiring recommendations using AI analytics
            to improve recruitment efficiency.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== Services ====================
const Services = () => {
  return (
    <div className="py-10 px-6 md:px-10 overflow-hidden bg-white">
      <h3 className="text-center text-blue-700 mb-14 font-bold text-4xl" data-aos="fade-down">
        Our AI Recruitment Services
      </h3>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 border border-blue-50 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
          <img
            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c"
            className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-md"
            alt="Simultaneous AI Interviews"
          />
          <div className="text-center sm:text-left">
            <h5 className="text-xl font-bold text-gray-800 mb-2">Simultaneous AI Interviews</h5>
            <p className="text-gray-600 text-sm leading-relaxed">
              Conduct multiple AI-powered interviews at the same time and
              evaluate candidates quickly.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 border border-blue-50 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-100" data-aos="fade-up" data-aos-delay="100">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-md"
            alt="Recruitment Analytics"
          />
          <div className="text-center sm:text-left">
            <h5 className="text-xl font-bold text-gray-800 mb-2">Recruitment Analytics</h5>
            <p className="text-gray-600 text-sm leading-relaxed">
              Track hiring performance and gain insights through AI-driven
              recruitment analytics.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 border border-blue-50 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-md"
            alt="Industry Agnostic Hiring"
          />
          <div className="text-center sm:text-left">
            <h5 className="text-xl font-bold text-gray-800 mb-2">Industry Agnostic Hiring</h5>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our AI recruiter works across industries helping organizations
              find the right talent faster.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 border border-blue-50 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="400">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df"
            className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-md"
            alt="24/7 Candidate Evaluation"
          />
          <div className="text-center sm:text-left">
            <h5 className="text-xl font-bold text-gray-800 mb-2">24/7 Candidate Evaluation</h5>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI works around the clock to screen resumes and evaluate candidates efficiently.
            </p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 border border-blue-50 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="500">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
            className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-md"
            alt="AI Skill Assessment"
          />
          <div className="text-center sm:text-left">
            <h5 className="text-xl font-bold text-gray-800 mb-2">AI Skill Assessment</h5>
            <p className="text-gray-600 text-sm leading-relaxed">
              Automatically evaluate candidate skills through intelligent tests and coding challenges.
            </p>
          </div>
        </div>

        {/* Card 6 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 border border-blue-50 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="600">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
            className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-md"
            alt="Automated Job Matching"
          />
          <div className="text-center sm:text-left">
            <h5 className="text-xl font-bold text-gray-800 mb-2">Automated Job Matching</h5>
            <p className="text-gray-600 text-sm leading-relaxed">
              Match job descriptions with candidate profiles using AI algorithms for perfect fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SuccessSection (Stats & Final CTA) ====================
const SuccessSection = () => {
  return (
    <>
      {/* Detailed Success Cards */}
      <section className="bg-gray-50 py-10 px-6 md:px-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center" data-aos="fade-up">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              AI-Powered <span className="text-blue-600">Recruitment Solutions</span>
            </h3>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Transform your hiring process with intelligent AI tools designed
              for modern recruiters and companies.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-2xl shadow-xl hover:bg-indigo-50 transition-colors duration-300 flex flex-col gap-6 cursor-pointer border border-gray-100" data-aos="fade-up" data-aos-delay="100">
              <div className="flex justify-center mb-2">
                <div className="bg-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                  <FaRobot />
                </div>
              </div>
              <h5 className="text-2xl font-bold text-center text-gray-800">
                AI Candidate Screening
              </h5>
              <p className="text-gray-600 text-center leading-relaxed">
                Automatically analyze resumes and candidate profiles using AI to shortlist the best talent faster.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-xl" /> Smart resume parsing
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-xl" /> Skill-based candidate ranking
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-xl" /> Automated shortlisting
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-2xl shadow-xl hover:bg-blue-50 transition-colors duration-300 flex flex-col gap-6 cursor-pointer border border-gray-100" data-aos="fade-up" data-aos-delay="200">
              <div className="flex justify-center mb-2">
                <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                  <FaUserTie />
                </div>
              </div>
              <h5 className="text-2xl font-bold text-center text-gray-800">
                AI Interview Assistant
              </h5>
              <p className="text-gray-600 text-center leading-relaxed">
                Conduct intelligent interviews with AI-driven assessments that evaluate candidate skills and communication.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-xl" /> Automated interview questions
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-xl" /> Real-time candidate evaluation
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-xl" /> Interview performance scoring
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 rounded-2xl shadow-xl hover:bg-emerald-50 transition-colors duration-300 flex flex-col gap-6 cursor-pointer border border-gray-100" data-aos="fade-up" data-aos-delay="300">
              <div className="flex justify-center mb-2">
                <div className="bg-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                  <FaChartLine />
                </div>
              </div>
              <h5 className="text-2xl font-bold text-center text-gray-800">
                Recruitment Analytics
              </h5>
              <p className="text-gray-600 text-center leading-relaxed">
                Use data-driven insights to improve hiring decisions and track recruitment performance.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-xl" /> Candidate performance insights
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-xl" /> Hiring funnel analytics
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-500 flex-shrink-0 text-xl" /> AI hiring recommendations
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-900 to-indigo-900 rounded-[40px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl" data-aos="zoom-in" data-aos-duration="1000">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="text-5xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">70%</div>
              <div className="text-lg md:text-xl font-medium text-blue-100">Reduction in Time-to-Hire</div>
            </div>
            <div className="pt-12 md:pt-0" data-aos="fade-up" data-aos-delay="400">
              <div className="text-5xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">3x</div>
              <div className="text-lg md:text-xl font-medium text-purple-100">Increase in Candidate Quality</div>
            </div>
            <div className="pt-12 md:pt-0" data-aos="fade-up" data-aos-delay="600">
              <div className="text-5xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">95%</div>
              <div className="text-lg md:text-xl font-medium text-green-100">Task Automation Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gray-50 pt-10 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Ready to Build Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Team Faster?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of modern HR teams who have upgraded their recruitment process with our AI automation platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/bookademo">
              <button className="w-full sm:w-auto px-4 py-3 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-1">
                Request a Demo
              </button>
            </Link>
            <Link to="/contactpage">
              <button className="w-full sm:w-auto px-4 py-3 rounded-full bg-white text-gray-800 border-2 border-gray-200 font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all">
                Contact Sales
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ==================== Main App Component ====================
const App = () => {
  useEffect(() => {
    AOS.init({
      once: false,
      offset: 80,
      duration:900,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="font-sans antialiased bg-gray-50">
      <Navbar />
      <HeroSection />
      <Workflow />
      <Features />
      <Services />
      <SuccessSection />
      <Footer />
    </div>
  );
}

export default App;