import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from './Footer';
import Navbar from './Navbar';
import AOS from "aos";
import "aos/dist/aos.css";

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
                  style={{ backgroundColor: '#ff9800', color: '#fff' }}
                >
                  📊 AI CRM Platform
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-white">
                  Transform Your <br /> <span className="text-orange-400">Customer Relationships</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-200 mb-10 font-light leading-relaxed">
                  Manage customer relationships smarter with our AI-powered CRM
                  platform. Track leads, automate follow-ups, analyze customer
                  interactions, and boost sales performance with intelligent insights.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    to="/bookademo"
                    className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 w-full sm:w-auto text-center no-underline"
                  >
                    Book CRM Demo
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
                  src="/assets/images/crmbanner.png"
                  alt="CRM Banner"
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

const CRMSection = () => {
  return (
    <div className="bg-slate-50 py-10 px-6 md:px-10 text-center">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" data-aos="fade-up">Smart CRM Solutions For Growing Businesses</h3>
        <p className="text-lg text-slate-600 mb-16 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
          Manage customers, automate sales, and gain insights with a powerful CRM platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 perspective-1000">
          {/* Card 1 */}
          <div className="group h-[420px] w-full" data-aos="zoom-in" data-aos-delay="200">
            <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180 cursor-pointer">
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl p-10 flex flex-col justify-center items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
                  <i className="ri-team-fill"></i>
                </div>
                <h4 className="text-2xl font-bold text-slate-800 mb-3">Customer Management</h4>
                <p className="text-slate-600 leading-relaxed">
                  Organize customer profiles and track all interactions in one centralized CRM platform.
                </p>
              </div>
              {/* Back */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center rotate-y-180">
                <img src="https://images.unsplash.com/photo-1551434678-e076c223a692" alt="CRM" className="w-full h-48 object-cover rounded-xl mb-4" />
                <h4 className="text-xl font-bold text-slate-800 mb-2">Customer Management</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Build stronger relationships with customers using intelligent CRM tools and automated communication.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group h-[420px] w-full" data-aos="zoom-in" data-aos-delay="300">
            <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180 cursor-pointer">
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl p-10 flex flex-col justify-center items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
                  <i className="ri-rocket-2-fill"></i>
                </div>
                <h4 className="text-2xl font-bold text-slate-800 mb-3">Sales Automation</h4>
                <p className="text-slate-600 leading-relaxed">
                  Automate follow-ups, pipeline tracking and lead assignments to improve sales efficiency.
                </p>
              </div>
              {/* Back */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center rotate-y-180">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978" alt="Sales" className="w-full h-48 object-cover rounded-xl mb-4" />
                <h4 className="text-xl font-bold text-slate-800 mb-2">Sales Automation</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Increase productivity by automating repetitive sales workflows and reminders.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group h-[420px] w-full" data-aos="zoom-in" data-aos-delay="400">
            <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180 cursor-pointer">
              {/* Front */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl p-10 flex flex-col justify-center items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
                  <i className="ri-bar-chart-box-fill"></i>
                </div>
                <h4 className="text-2xl font-bold text-slate-800 mb-3">CRM Analytics</h4>
                <p className="text-slate-600 leading-relaxed">
                  Analyze sales performance and customer engagement with real-time dashboards.
                </p>
              </div>
              {/* Back */}
              <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center rotate-y-180">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" alt="Analytics" className="w-full h-48 object-cover rounded-xl mb-4" />
                <h4 className="text-xl font-bold text-slate-800 mb-2">CRM Analytics</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Use powerful CRM analytics to make smarter data-driven business decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

const CRMHubspotSection = () => {
  return (
    <div className="py-10 px-6 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT IMAGE */}
        <div className="w-full lg:w-1/2" data-aos="fade-right">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692"
            alt="CRM Platform"
            className="w-full rounded-2xl shadow-2xl"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full lg:w-1/2" data-aos="fade-left">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            Powerful CRM Platform for Business Growth
          </h3>
          <p className="text-lg text-slate-600 mb-4 leading-relaxed">
            Our CRM platform helps businesses manage customer
            relationships more efficiently. Track leads, manage
            sales pipelines, and organize customer data in one
            centralized system.
          </p>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            With smart automation, real-time analytics, and seamless
            integrations, your team can improve productivity,
            deliver better customer experiences, and grow faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/30">Book a Demo</button>
            <button className="px-8 py-3 bg-transparent border-2 border-orange-500 text-orange-500 font-bold rounded-lg hover:bg-orange-500 hover:text-white transition-colors">Start Free Trial</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CRMPlatform = () => {
  const icons = [
    { icon: "bi-megaphone-fill", text: "Marketing Hub" },
    { icon: "bi-bar-chart-line-fill", text: "Sales Hub" },
    { icon: "bi-heart-fill", text: "Service Hub" },
    { icon: "bi-play-circle-fill", text: "Content Hub" },
    { icon: "bi-gear-fill", text: "Operations Hub" },
    { icon: "bi-cart-fill", text: "Commerce Hub" },
  ];

  return (
    <div className="py-10 px-6 md:px-10 bg-slate-50 text-center">
      <div className="max-w-6xl mx-auto">
        {/* ICON ROW */}
        <div className="relative flex justify-center items-center gap-6 md:gap-16 flex-wrap mb-20" data-aos="fade-down">
          {/* Horizontal Line behind icons */}
          <div className="hidden md:block absolute top-1/2 left-[5%] right-[5%] h-[2px] bg-slate-200 -z-0 -translate-y-4"></div>

          {icons.map((item, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center bg-slate-50 px-2 group cursor-pointer hover:-translate-y-2 transition-transform duration-300">
              <i className={`bi ${item.icon} text-3xl text-orange-500 mb-2 group-hover:scale-110 transition-transform`}></i>
              <p className="text-sm font-medium text-slate-700">{item.text}</p>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="max-w-3xl mx-auto" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Your complete CRM platform</h2>
          <p className="text-lg text-slate-600 mb-4 leading-relaxed">
            Our CRM platform connects marketing, sales, and customer
            service teams in one unified system. Manage leads, automate
            campaigns, track deals, and deliver exceptional customer
            experiences from a single dashboard.
          </p>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            With powerful analytics and automation tools, businesses
            gain complete visibility into the customer journey and
            grow faster.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/30">Get a demo</button>
            <button className="px-8 py-3 bg-transparent border-2 border-orange-500 text-orange-500 font-bold rounded-lg hover:bg-orange-500 hover:text-white transition-colors">Get started free</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Card = ({ icon, title, desc, features, delay }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col min-h-[300px] border border-slate-100" data-aos="fade-up" data-aos-delay={delay}>
      <div className="flex items-center gap-3 mb-4">
        <i className={`bi ${icon} text-2xl text-orange-500`}></i>
        <h5 className="text-xl font-bold text-slate-800 m-0">{title}</h5>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed mb-6">{desc}</p>
      <div className="h-[1px] w-full bg-slate-100 mb-6"></div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Popular Features</p>
      <ul className="flex-1 space-y-3 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
            <i className="bi bi-check-circle-fill text-slate-800 mt-0.5"></i>
            {f}
          </li>
        ))}
      </ul>
      <button className="w-full px-6 py-2.5 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
        Learn more
      </button>
    </div>
  );
};

// ==================== Main Component ====================
const CRMFeatures = () => {
  useEffect(() => {
    AOS.init({
      once: false,
      offset: 80,
      duration: 900,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="font-sans antialiased bg-slate-50 overflow-hidden">
      {/* Bootstrap Icons CDN (included once) */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
      />
      {/* Remix Icon CDN for CRMSection */}
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
        rel="stylesheet"
      />

      <Navbar />
      <HeroSection />
      <CRMSection />
      <CRMHubspotSection />
      <CRMPlatform />
      <Footer />
    </div>
  );
}

export default CRMFeatures;