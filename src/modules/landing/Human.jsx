import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Globe, FileText, Shield } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

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
                                    style={{ backgroundColor: '#ff9800', color: '#fff' }}
                                >
                                    👥 Smart HRMS Platform
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-white">
                                    Modern <br /> <span className="text-orange-400">Workforce Management</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-200 mb-10 font-light leading-relaxed">
                                    Streamline your HR operations with our all-in-one HRMS solution. Manage employee data, attendance, leave, payroll, and performance seamlessly from a single platform.
                                </p>

                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <Link
                                        to="/bookademo"
                                        className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 w-full sm:w-auto text-center no-underline"
                                    >
                                        Book HRMS Demo
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
                                    src="https://www.keka.com/media/2025/10/Group-1171281240.png"
                                    alt="HRMS Dashboard"
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
};

// ==================== SecuritySection ====================
const SecuritySection = () => {
    const items = [
        {
            icon: <Globe size={40} className="text-blue-600" />,
            title: "Employee Data Management",
            desc: "Securely store and manage all employee records in one centralized HRMS platform for easy access and better organization."
        },
        {
            icon: <FileText size={40} className="text-blue-600" />,
            title: "Payroll & Statutory Compliance",
            desc: "Automate payroll processing with compliance for PF, ESI, PT, TDS and other statutory regulations across India."
        },
        {
            icon: <Shield size={40} className="text-blue-600" />,
            title: "Secure HR Operations",
            desc: "Enterprise-grade security with role-based access, encrypted employee data, and secure HR workflows."
        }
    ];

    return (
        <section className="bg-slate-50 py-10 px-6 md:px-10">
            <div className="max-w-7xl mx-auto text-center">
                <p className="text-pink-500 font-bold tracking-widest text-sm mb-3 uppercase" data-aos="fade-up">SMART HRMS PLATFORM</p>
                <h4 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6" data-aos="fade-up" data-aos-delay="100">
                    Manage Your Workforce With One Powerful HRMS
                </h4>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
                    Simplify HR operations with a complete HRMS platform designed to manage
                    employee lifecycle, payroll, attendance, and performance efficiently.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center"
                            data-aos="zoom-in"
                            data-aos-delay={index * 150}
                        >
                            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                {item.icon}
                            </div>
                            <h5 className="text-xl font-bold text-slate-800 mb-4">{item.title}</h5>
                            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ==================== DataHubSection ====================
const DataHubSection = () => {
    const items = [
        {
            title: "Hire",
            desc: "Automatically move hired candidates into the employee directory and org structure.",
            delay: 100
        },
        {
            title: "Payroll",
            desc: "Employee profiles sync automatically with payroll for accurate salary processing.",
            delay: 200
        },
        {
            title: "Time & Attendance",
            desc: "Manage attendance and leave policies across departments.",
            delay: 300
        },
        {
            title: "Perform",
            desc: "Track employee performance and manage appraisals easily.",
            delay: 400
        },
        {
            title: "Employee Experience",
            desc: "Improve engagement with surveys, rewards and employee feedback.",
            delay: 500
        }
    ];

    return (
        <section className="bg-white py-10 px-6 md:px-10 text-center overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <h4 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6" data-aos="fade-up">
                    Your Data Hub: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">One source, zero errors</span>
                </h4>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed" data-aos="fade-up" data-aos-delay="100">
                    Data flows automatically across HR modules ensuring accurate employee
                    information without duplicate entries or manual updates.
                </p>

                <div className="relative max-w-5xl mx-auto" data-aos="zoom-in" data-aos-delay="200">
                    {/* Center Hub */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-5 rounded-2xl shadow-xl shadow-blue-500/30 inline-block text-xl font-bold mb-8 relative z-10 hover:scale-105 transition-transform duration-300">
                        CoreHR: Your Data Hub
                    </div>

                    {/* Connectors (Hidden on mobile for cleaner layout) */}
                    <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-[60px] w-0.5 h-16 bg-slate-200 -z-0"></div>
                    <div className="hidden lg:block absolute left-[10%] right-[10%] top-[124px] h-0.5 bg-slate-200 -z-0"></div>

                    {/* Modules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-12 lg:mt-0 relative z-10">
                        {items.map((item, index) => (
                            <div key={index} className="flex flex-col items-center" data-aos="fade-up" data-aos-delay={item.delay}>
                                <div className="hidden lg:block w-0.5 h-8 bg-slate-200 mb-6"></div>
                                <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 w-full h-full flex flex-col">
                                    <h5 className="font-bold text-slate-800 text-lg mb-3">{item.title}</h5>
                                    <p className="text-sm text-slate-600 leading-relaxed flex-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ==================== Main Component ====================
const HRMSPage = () => {
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
            <SecuritySection />
            <DataHubSection />
            <Footer />
        </div>
    );
};

export default HRMSPage;