import React from "react";
import { Link } from "react-router-dom";
import { Globe, FileText, Shield, Award, Users, DollarSign, Calendar, Star, Eye } from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";

// ==================== HeroSection ====================
function HeroSection() {
    return (
        <div
            style={{
                width: "100%",
                minHeight: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 80px",
                backgroundImage: "url('/assets/images/bannerimg.png')",
                backgroundColor: "#1e4f8c",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
            }}
        >
            {/* Left Content */}
            <div style={{ width: "50%" }}>
                <h1 style={{ fontSize: "48px", fontWeight: "700", lineHeight: "1.3" }}>
                    Smart <span style={{ color: "#ff9800" }}>HRMS Platform</span> <br />
                    For Modern Workforce Management
                </h1>

                <p style={{ marginTop: "20px", fontSize: "18px", lineHeight: "1.6" }}>
                    Streamline your HR operations with our all-in-one HRMS solution.
                    Manage employee data, attendance, leave, payroll, and performance
                    seamlessly from a single platform. Automate HR workflows, improve
                    team productivity, and make smarter HR decisions with real-time
                    insights.
                </p>

                <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
                    <Link to="/bookademo">
                        <button
                            style={{
                                padding: "12px 25px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#2f80ed",
                                fontWeight: "600",
                                color: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            Book HRMS Demo
                        </button>
                    </Link>

                    <Link to="/contactpage">
                        <button
                            style={{
                                padding: "12px 25px",
                                borderRadius: "8px",
                                border: "none",
                                background: "#ff9800",
                                color: "white",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Start Free Trial
                        </button>
                    </Link>
                </div>
            </div>

            {/* Right Image */}
            <div style={{ width: "40%", textAlign: "center" }}>
                <img
                    src="https://www.keka.com/media/2025/10/Group-1171281240.png"
                    alt="HRMS"
                    style={{
                        width: "120%",
                        maxWidth: "600px",
                        marginTop: "60px",
                        animation: "float 4s ease-in-out infinite",
                    }}
                />
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
        </div>
    );
}

// ==================== SecuritySection ====================
function SecuritySection() {
    const items = [
        {
            icon: <Globe size={40} color="#2c2c54" />,
            title: "Employee Data Management",
            desc: "Securely store and manage all employee records in one centralized HRMS platform for easy access and better organization."
        },
        {
            icon: <FileText size={40} color="#2c2c54" />,
            title: "Payroll & Statutory Compliance",
            desc: "Automate payroll processing with compliance for PF, ESI, PT, TDS and other statutory regulations across India."
        },
        {
            icon: <Shield size={40} color="#2c2c54" />,
            title: "Secure HR Operations",
            desc: "Enterprise-grade security with role-based access, encrypted employee data, and secure HR workflows."
        }
    ];

    return (
        <section
            style={{
                background: "#f7f8fb",
                padding: "80px 20px"
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    textAlign: "center"
                }}
            >
                <p
                    style={{
                        color: "#ff4d6d",
                        fontWeight: "600",
                        letterSpacing: "1px",
                        marginBottom: "10px"
                    }}
                >
                    SMART HRMS PLATFORM
                </p>

                <h4
                    style={{
                        fontSize: "40px",
                        fontWeight: "700",
                        marginBottom: "15px",
                        color: "#1f2d3d"
                    }}
                >
                    Manage Your Workforce With One Powerful HRMS
                </h4>

                <p
                    style={{
                        fontSize: "18px",
                        color: "#6b7280",
                        maxWidth: "800px",
                        margin: "0 auto 60px"
                    }}
                >
                    Simplify HR operations with a complete HRMS platform designed to manage
                    employee lifecycle, payroll, attendance, and performance efficiently.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4,1fr)",
                        gap: "40px"
                    }}
                >
                    {items.map((item, index) => (
                        <div key={index}>
                            <div style={{ marginBottom: "15px" }}>{item.icon}</div>
                            <h5
                                style={{
                                    fontSize: "17px",
                                    fontWeight: "600",
                                    marginBottom: "10px",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}
                            >
                                {item.title}
                            </h5>
                            <p
                                style={{
                                    color: "#6b7280",
                                    fontSize: "15px",
                                    lineHeight: "1.6"
                                }}
                            >
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ==================== DataHubSection ====================
function DataHubSection() {
    const items = [
        {

            title: "Hire",
            desc: "Automatically move hired candidates into the employee directory and org structure."
        },
        {

            title: "Payroll",
            desc: "Employee profiles sync automatically with payroll for accurate salary processing."
        },
        {

            title: "Time & Attendance",
            desc: "Manage attendance and leave policies across departments."
        },
        {

            title: "Perform",
            desc: "Track employee performance and manage appraisals easily."
        },
        {
            title: "Employee Experience",
            desc: "Improve engagement with surveys, rewards and employee feedback."
        }
    ];

    return (

<section style={{ padding: "90px 20px", textAlign: "center" }}>
  <div style={{ maxWidth: "1200px", margin: "auto" }}>

    {/* Heading */}
    <h4 style={{ fontSize: "40px", fontWeight: "700", marginBottom: "20px" }}>
      Your Data Hub: One source, zero errors
    </h4>

    <p style={{ maxWidth: "850px", margin: "auto", marginBottom: "70px", color: "#555" }}>
      Data flows automatically across HR modules ensuring accurate employee
      information without duplicate entries or manual updates.
    </p>

    {/* Center Hub */}
    <div
      style={{
        background: "#2b6cb0",
        color: "white",
        padding: "24px",
        borderRadius: "14px",
        width: "300px",
        margin: "auto",
        fontSize: "22px",
        fontWeight: "600"
      }}
    >
      CoreHR: Your Data Hub
    </div>

    {/* vertical connector */}
    <div
      style={{
        width: "2px",
        height: "60px",
        background: "#c4cbd6",
        margin: "auto"
      }}
    />

    {/* horizontal connector */}
    <div
      style={{
        width: "85%",
        height: "2px",
        background: "#c4cbd6",
        margin: "0 auto 50px auto"
      }}
    />

    {/* modules */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5,1fr)",
        gap: "30px",
        maxWidth: "1150px",
        margin: "auto",
        textAlign: "center"
      }}
    >
      {items.map((item, index) => (
        <div key={index}>

          {/* small vertical line */}
          <div
            style={{
              width: "2px",
              height: "30px",
              background: "#c4cbd6",
              margin: "auto",
              marginBottom: "14px"
            }}
          />

          <h5 style={{ fontWeight: "600", marginBottom: "10px" }}>
            {item.title}
          </h5>

          <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5" }}>
            {item.desc}
          </p>

        </div>
      ))}
    </div>

  </div>
</section>

    );
}

// ==================== Main Component ====================
function HRMSPage() {
    return (
        <>
        <Navbar/>
            <HeroSection />
            <SecuritySection />
            <DataHubSection />
            <Footer/>
        </>
    );
}

export default HRMSPage;