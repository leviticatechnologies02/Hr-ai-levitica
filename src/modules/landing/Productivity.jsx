import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaProjectDiagram, FaChartPie, FaUsers, FaCheckCircle, FaBolt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HeroSection = () => {
    return (
        <section className="relative pt-24 pb-12 lg:pt-28 lg:pb-14 overflow-hidden bg-slate-50">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                <div className="rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px] lg:min-h-[550px] bg-slate-900 flex items-center" data-aos="zoom-in" data-aos-duration="900">
                    <div className="absolute inset-0 z-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('/assets/images/bannerimg.png')` }}
                        >
                            <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/30"></div>
                        </div>
                    </div>

                    <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 py-12 gap-10">
                        <div className="w-full lg:w-1/2 text-left" data-aos="fade-right" data-aos-duration="1200" data-aos-delay="200">
                            <div className="max-w-xl">
                                <span
                                    className="inline-block py-1.5 px-4 rounded-full text-sm font-semibold mb-6 tracking-wide shadow-lg"
                                    style={{ backgroundColor: '#8b5cf6', color: '#fff' }}
                                >
                                    🚀 Ultimate Productivity Suite
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-white">
                                    Supercharge Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Team's Efficiency</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-200 mb-10 font-light leading-relaxed">
                                    Empower your workforce with advanced project management, automated task tracking, and real-time AI-driven performance reports. Eliminate bottlenecks and accelerate growth.
                                </p>

                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <Link
                                        to="/bookademo"
                                        className="px-6 py-3 rounded-full bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/30 transition-all duration-300 w-full sm:w-auto text-center no-underline"
                                    >
                                        Get a Demo
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

                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="400">
                            <div className="relative w-full max-w-[500px] animate-[float_6s_ease-in-out_infinite]">
                                <img
                                    src="/assets/images/productivity.png"
                                    alt="Productivity Dashboard"
                                    className="w-full h-auto drop-shadow-[0_20px_50px_rgba(139,92,246,0.3)]"
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


const Features = () => {
    const features = [
        {
            icon: <FaTasks />,
            title: "Smart Task Management",
            desc: "Assign, organize, and prioritize tasks with ease. AI suggests optimal task allocations based on team capacity.",
            color: "blue"
        },
        {
            icon: <FaProjectDiagram />,
            title: "Project Portfolios",
            desc: "Get a bird's-eye view of all ongoing projects. Track milestones, deadlines, and resource utilization in real-time.",
            color: "purple"
        },
        {
            icon: <FaChartPie />,
            title: "Advanced Reports",
            desc: "Generate comprehensive performance reports and deep analytics dashboards to make data-driven decisions.",
            color: "pink"
        },
        {
            icon: <FaUsers />,
            title: "Team Collaboration",
            desc: "Seamless communication tools built directly into the workflow, ensuring everyone stays aligned and connected.",
            color: "emerald"
        }
    ];

    const getColorClasses = (color) => {
        switch (color) {
            case 'blue': return 'bg-blue-100 text-blue-600 group-hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)]';
            case 'purple': return 'bg-purple-100 text-purple-600 group-hover:shadow-[0_8px_30px_rgba(168,85,247,0.1)]';
            case 'pink': return 'bg-pink-100 text-pink-600 group-hover:shadow-[0_8px_30px_rgba(236,72,153,0.1)]';
            case 'emerald': return 'bg-emerald-100 text-emerald-600 group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)]';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-slate-50 py-10 px-6 md:px-10 text-center">
            <h4 className="text-purple-600 font-bold uppercase tracking-widest text-sm mb-3" data-aos="fade-up">Core Modules</h4>
            <h5 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16" data-aos="fade-up" data-aos-delay="100">
                Everything You Need To <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Scale Faster</span>
            </h5>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((item, index) => (
                    <div key={index} className={`relative p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 overflow-hidden group border border-slate-100 ${getColorClasses(item.color)}`} data-aos="fade-up" data-aos-delay={index * 100}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:-translate-y-2 transition-transform duration-300 ${getColorClasses(item.color).split(' ')[0]} ${getColorClasses(item.color).split(' ')[1]}`}>
                            {item.icon}
                        </div>
                        <h5 className="mb-4 font-bold text-xl text-slate-800">{item.title}</h5>
                        <p className="text-slate-600 text-base leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}


const DashboardPreview = () => {
    return (
        <section className="bg-white py-10 px-6 md:px-10 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div className="w-full lg:w-1/2" data-aos="fade-right">
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                        Centralized Command Center For Your <span className="text-purple-600">Entire Organization</span>
                    </h3>
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                        Stop switching between ten different apps. Our productivity suite integrates Projects, Tasks, and Performance Reports into a single, unified dashboard.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-4">
                            <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1"><FaCheckCircle /></div>
                            <span className="text-slate-700 font-medium">Real-time progress tracking across all departments</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1"><FaCheckCircle /></div>
                            <span className="text-slate-700 font-medium">Identify bottlenecks before they impact deadlines</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 bg-green-100 text-green-600 rounded-full p-1"><FaCheckCircle /></div>
                            <span className="text-slate-700 font-medium">Automated daily reports sent to stakeholders</span>
                        </li>
                    </ul>
                    <Link to="/dashboard">
                        <button className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-md shadow-purple-600/30">
                            Explore Dashboard
                        </button>
                    </Link>
                </div>
                <div className="w-full lg:w-1/2" data-aos="fade-left">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-indigo-500 opacity-20 blur-2xl rounded-3xl"></div>
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
                            alt="Analytics Dashboard"
                            className="relative rounded-2xl shadow-2xl border border-slate-200 object-cover h-[400px] w-full"
                        />
                        {/* Floating UI Elements */}
                        <div className="absolute -left-8 -bottom-8 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-[float_4s_ease-in-out_infinite] flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 text-2xl"><FaBolt /></div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Efficiency</p>
                                <p className="text-xl font-bold text-slate-800">+45%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


const StatsSection = () => {
    return (
        <section className="bg-slate-50 py-10 px-6">
            <div className="max-w-7xl mx-auto bg-gradient-to-r from-purple-900 to-indigo-900 rounded-[40px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl" data-aos="zoom-in">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30"></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
                    <div data-aos="fade-up" data-aos-delay="200">
                        <div className="text-5xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">3x</div>
                        <div className="text-lg md:text-xl font-medium text-purple-100">Faster Project Delivery</div>
                    </div>
                    <div className="pt-12 md:pt-0" data-aos="fade-up" data-aos-delay="400">
                        <div className="text-5xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">40%</div>
                        <div className="text-lg md:text-xl font-medium text-pink-100">Increase in Team Output</div>
                    </div>
                    <div className="pt-12 md:pt-0" data-aos="fade-up" data-aos-delay="600">
                        <div className="text-5xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">100%</div>
                        <div className="text-lg md:text-xl font-medium text-green-100">Visibility &amp; Control</div>
                    </div>
                </div>
            </div>
        </section>
    );
}


const CTASection = () => {
    return (
        <section className="w-full bg-slate-50 pt-10 pb-10 px-6">
            <div className="max-w-5xl mx-auto text-center" data-aos="fade-up">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                    Ready to Maximize Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Team's Potential?</span>
                </h2>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                    Join high-performing teams who have unlocked unprecedented productivity with our centralized platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <Link to="/bookademo">
                        <button className="w-full sm:w-auto px-4 py-3 rounded-full bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-all hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:-translate-y-1">
                            Start Free Trial
                        </button>
                    </Link>
                    <Link to="/contactpage">
                        <button className="w-full sm:w-auto px-4 py-3 rounded-full bg-white text-slate-800 border-2 border-slate-200 font-bold text-lg hover:border-purple-600 hover:text-purple-600 transition-all">
                            Talk to Sales
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}


const ProductivityLanding = () => {
    useEffect(() => {
        AOS.init({
            once: false,
            offset: 80,
            duration: 900,
            easing: "ease-out-cubic",
        });
    }, []);

    return (
        <div className="font-sans antialiased bg-slate-50">
            <Navbar />
            <HeroSection />
            <Features />
            <DashboardPreview />
            <StatsSection />
            <CTASection />
            <Footer />
        </div>
    );
}

export default ProductivityLanding;
