import React, { useState, useEffect } from "react";
import { FaRobot, FaUserTie, FaChartLine, FaCheckCircle, FaRocket, } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// ==================== HeroSection ====================
function HeroSection() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
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
      <div style={{ width: "70%" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "750" }}>
          Smart <br></br><span style={{ color: "#ff9800" }}>AI Recruitment</span>
          <br /> For Modern Hiring
        </h1>
        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          Automate your hiring process with our AI-powered recruiter. Screen
          resumes, conduct intelligent interviews, and identify the best
          candidates faster with advanced AI insights.
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
              }} >
              Book AI Demo
            </button>
          </Link>
          <Link to="/contactpage">
            <button
              style={{
                padding: "12px 25px",
                borderRadius: "8px",
                border: "none",
                background: "#2f80ed",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
              }} >
              Start Free Trial
            </button>
          </Link>
        </div>
      </div>
      {/* Right Image */}
      <div style={{ width: "40%", textAlign: "center" }}>
        <img src="./assets/images/hrimage.png" alt="robot"
          style={{
            width: "1100px",
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

// ==================== Features ====================
function Features() {
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowCards(true);
    }, 300);
  }, []);

  const cardStyle = {
    textAlign: "center",
    padding: "20px",
    transition: "all 0.6s ease",
  };

  return (
    <div
      style={{
        background: "#f5f7fb",
        padding: "80px 20px",
        textAlign: "center",
      }}
    >
      {/* Top Heading */}
      <h4 style={{ fontSize: "28px", color: "#2c6fb7", fontWeight: "bold" }}>
        Your Smart AI Hiring Platform:{" "}
        <span style={{ color: "#ff8c00", fontWeight: "bold" }}>
          {" "}
          Automate Recruitment, Hire Faster{" "}
        </span>
      </h4>
      <p
        style={{
          maxWidth: "900px",
          margin: "20px auto 60px",
          fontSize: "18px",
          lineHeight: "28px",
          color: "#333",
        }}
      >
        Our AI-powered HR automation platform streamlines the entire hiring
        process. From intelligent resume screening to AI-driven interviews, our
        system helps recruiters identify the best talent quickly and
        efficiently.
      </p>

      {/* Section Title */}
      <h4 style={{ color: "#2c6fb7", marginBottom: "10px", fontWeight: "bold" }} > Our Features </h4>
      <h5 style={{ fontSize: "40px", marginBottom: "60px", fontWeight: "bold" }} >
        <span style={{ color: "#ff8c00", fontWeight: "bold" }}>AI-Powered</span>{" "}
        Hiring Solutions
      </h5>

      {/* Feature Cards */}
      <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "50px",
          alignItems: "center",
        }} >

        {/* Card 1 */}
        <div
          style={{
            ...cardStyle,
            opacity: showCards ? 1 : 0,
            transform: showCards ? "translateY(0)" : "translateY(40px)",
            textAlign: "center", // Add this to center all content
          }} >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
            alt="AI Screening"
            style={{ 
              width: "70px",
              margin: "0 auto 15px auto",
              display: "block"
            }}
          />
          <h5 style={{ marginBottom: "10px", fontWeight: "bold" }}>AI Resume Screening</h5>
          <p style={{ color: "#555", fontSize: "16px" }}>
            Automatically analyze and shortlist candidates using intelligent AI
            algorithms that match skills and job requirements.
          </p>
        </div>

        {/* Card 2 */}
        <div
          style={{
            ...cardStyle,
            opacity: showCards ? 1 : 0,
            transform: showCards ? "translateY(0)" : "translateY(40px)",
          }}>
          <img
            src="https://i0.wp.com/rayhennessey.com/wp-content/uploads/2025/06/AI_Interviewer-scaled.jpg?resize=768%2C510&ssl=1"
            alt="AI Interview"
            style={{ 
              width: "113px",
              margin: "0 auto 10px auto",
              display: "block"
            }}
          />
          <h5 style={{ marginBottom: "10px", fontWeight: "bold" }}>AI Video Interviews</h5>
          <p style={{ color: "#555", fontSize: "16px" }}>
            Conduct automated AI-powered interviews that evaluate candidate
            responses and communication skills.
          </p>
        </div>

        {/* Card 3 */}
        <div
          style={{
            ...cardStyle,
            opacity: showCards ? 1 : 0,
            transform: showCards ? "translateY(0)" : "translateY(40px)",
          }} >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
            alt="AI Analytics"
            style={{ 
              width: "70px",
              margin: "0 auto 15px auto",
              display: "block"
            }}
          />
          <h5 style={{ marginBottom: "10px", fontWeight: "bold" }}>Hiring Analytics</h5>
          <p style={{ color: "#555", fontSize: "16px" }}>
            Gain powerful insights and hiring recommendations using AI analytics
            to improve recruitment efficiency.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== Services ====================
function Services() {
  const [visibleCards, setVisibleCards] = useState([]);
  useEffect(() => {
    const totalCards = 7;
    const timers = [];
    for (let i = 0; i < totalCards; i++) {
      timers.push(
        setTimeout(() => {
          setVisibleCards((prev) => {
            const newState = [...prev];
            newState[i] = true;
            return newState;
          });
        }, i * 200),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const baseCardStyle = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    background: "#f5f7fb",
    border: "1px solid #d6e0f5",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.6s ease",
    opacity: 0,
    transform: "scale(0.8)",
  };

  const visibleCardStyle = {
    opacity: 1,
    transform: "scale(1)",
  };

  const imgStyle = {
    width: "180px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
  };

  return (
    <div style={{ padding: "70px 40px" }}>
      <h3 style={{ textAlign: "center", color: "#2c6fb7", marginBottom: "50px", fontWeight: "bold" }} > Our AI Recruitment Services </h3>
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }} >
        {/* Card 1 */}
        <div
          style={{
            ...baseCardStyle,
            ...(visibleCards[0] ? visibleCardStyle : {}),
          }}
          className="card-hover" >
          <img
            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c"
            style={imgStyle}
            alt=""
          />
          <div>
            <h5>Simultaneous AI Interviews</h5>
            <p>
              {" "}
              Conduct multiple AI-powered interviews at the same time and
              evaluate candidates quickly.{" "}
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            ...baseCardStyle,
            flexDirection: "row-reverse",
            ...(visibleCards[1] ? visibleCardStyle : {}),
          }}
          className="card-hover" >
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            style={imgStyle}
            alt=""
          />
          <div>
            <h5>Recruitment Analytics</h5>
            <p>
              Track hiring performance and gain insights through AI-driven
              recruitment analytics.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div
          style={{
            ...baseCardStyle,
            ...(visibleCards[2] ? visibleCardStyle : {}),
          }}
          className="card-hover" >
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            style={imgStyle}
            alt=""
          />
          <div>
            <h5>Industry Agnostic Hiring</h5>
            <p>
              Our AI recruiter works across industries helping organizations
              find the right talent faster.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div
          style={{
            ...baseCardStyle,
            flexDirection: "row-reverse",
            ...(visibleCards[3] ? visibleCardStyle : {}),
          }}
          className="card-hover" >
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df"
            style={imgStyle}
            alt=""
          />
          <div>
            <h5>24/7 Candidate Evaluation</h5>
            <p> AI works around the clock to screen resumes and evaluate candidates efficiently. </p>
          </div>
        </div>

        {/* Card 5 */}
        <div
          style={{
            ...baseCardStyle,
            ...(visibleCards[4] ? visibleCardStyle : {}),
          }}
          className="card-hover" >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
            style={imgStyle}
            alt=""
          />
          <div>
            <h5>AI Skill Assessment</h5>
            <p> Automatically evaluate candidate skills through intelligent tests and coding challenges. </p>
          </div>
        </div>

        {/* Card 6 */}
        <div
          style={{
            ...baseCardStyle,
            flexDirection: "row-reverse",
            ...(visibleCards[5] ? visibleCardStyle : {}),
          }}
          className="card-hover" >
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
            style={imgStyle}
            alt=""
          />
          <div>
            <h5>Automated Job Matching</h5>
            <p> Match job descriptions with candidate profiles using AI algorithms for perfect fit. </p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
        .card-hover:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        `}
      </style>
    </div>
  );
}

// ==================== SuccessSection (unchanged) ====================
function SuccessSection() {
  const sectionStyle = {
    background: "#f6f8fc",
    padding: "100px 40px",
  };

  const container = {
    maxWidth: "1300px",
    margin: "auto",
  };

  const cardsGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))",
    gap: "40px",
    marginTop: "60px",
  };

  const card = {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    transition: "background 0.3s ease",
    cursor: "pointer",
  };

  const iconBox = (color) => ({
    background: color,
    width: "60px",
    height: "60px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "24px",
  });

  const listItem = {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "17px",
    color: "#444",
    marginBottom: "10px",
    lineHeight: "1.5",
  };

  return (
    <>
      {/* First Section: AI Recruitment Solutions */}
      <section style={sectionStyle}>
        <div style={container}>
          {/* Heading */}
          <div style={{ textAlign: "center" }}>
            <h3
              style={{
                fontSize: "44px",
                fontWeight: "700",
                marginBottom: "10px",
              }} >
              AI-Powered{" "}
              <span style={{ color: "#2f80ed" }}>Recruitment Solutions</span>
            </h3>
            <p style={{ fontSize: "18px", color: "#6b7280" }}>
              Transform your hiring process with intelligent AI tools designed
              for modern recruiters and companies.
            </p>
          </div>

          {/* Cards */}
          <div style={cardsGrid}>
            {/* Card 1 */}
            <div style={card}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eef2ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
              }} >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <div style={iconBox("#6366f1")}> <FaRobot /> </div>
              </div>
              <h5 style={{ fontSize: "24px", fontWeight: "600", margin: 0, textAlign: "center" }}>
                AI Candidate Screening
              </h5>
              <p style={{ fontSize: "17px", color: "#666", textAlign: "center" }}>
                Automatically analyze resumes and candidate profiles using AI to shortlist the best talent faster.
              </p>
              <div style={listItem}>
                <FaCheckCircle color="#22c55e" /> Smart resume parsing
              </div>
              <div style={listItem}>
                <FaCheckCircle color="#22c55e" /> Skill-based candidate ranking
              </div>
              <div style={listItem}>
                <FaCheckCircle color="#22c55e" /> Automated shortlisting
              </div>
            </div>

            {/* Card 2 */}
            <div style={card}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eef2ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
              }} >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <div style={iconBox("#3b82f6")}>
                  <FaUserTie />
                </div>
              </div>
              <h5 style={{ fontSize: "24px", fontWeight: "600", margin: 0, textAlign: "center" }}>
                AI Interview Assistant
              </h5>
              <p style={{ fontSize: "17px", color: "#666", textAlign: "center" }}>
                Conduct intelligent interviews with AI-driven assessments that evaluate candidate skills and communication.
              </p>
              <div style={listItem}> <FaCheckCircle color="#22c55e" /> Automated interview questions </div>
              <div style={listItem}> <FaCheckCircle color="#22c55e" /> Real-time candidate evaluation </div>
              <div style={listItem}> <FaCheckCircle color="#22c55e" /> Interview performance scoring </div>
            </div>

            {/* Card 3 */}
            <div style={card}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eef2ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
              }} >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                <div style={iconBox("#10b981")}> <FaChartLine /> </div>
              </div>
              <h5 style={{ fontSize: "24px", fontWeight: "600", margin: 0, textAlign: "center" }}>
                Recruitment Analytics
              </h5>
              <p style={{ fontSize: "17px", color: "#666", textAlign: "center" }}>
                Use data-driven insights to improve hiring decisions and track recruitment performance.
              </p>
              <div style={listItem}> <FaCheckCircle color="#22c55e" /> Candidate performance insights </div>
              <div style={listItem}> <FaCheckCircle color="#22c55e" /> Hiring funnel analytics </div>
              <div style={listItem}> <FaCheckCircle color="#22c55e" /> AI hiring recommendations </div>
            </div>
          </div>{/* CTA Section (commented out) */}
        </div>
      </section>

      {/* Second Section: Full‑width AI Automation Banner */}
      <section
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginTop: "0",
          marginBottom: "0",
          padding: "0",
        }} >
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: "320px",
            background:
              "linear-gradient(135deg, #050021 0%, #0B0033 50%, #05001A 100%)",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 0",
          }} >
          {/* Background glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at left, rgba(255,255,255,0.08), transparent 60%)",
            }}
          />
          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "1200px",
              width: "100%",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "0 20px",
            }} >
            <h2
              style={{
                fontSize: "clamp(24px, 4.5vw, 40px)",
                fontWeight: "700",
                lineHeight: "1.25",
                marginBottom: "16px",
              }} >
              Transform Your Recruitment Process <br/> with AI-Powered Automation
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 2.8vw, 15px)",
                color: "#D1D5DB",
                marginBottom: "22px",
                maxWidth: "720px",
              }} >
              Schedule a demo to see how AI recruitment can reduce your hiring time by 70% while improving candidate quality.
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                fontSize: "13px",
                color: "#E5E7EB",
                marginBottom: "28px",
                flexWrap: "wrap",
                justifyContent: "center",
              }} >
              <span>14-day free trial</span>
              <span>|</span>
              <span>No credit card required</span>
              <span>|</span>
              <span>Full ATS integration included</span>
            </div>
            <Link to="/bookademo">
              <button
                style={{
                  background: "#7C6CF6",
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#5F4BCF";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#7C6CF6";
                  e.target.style.transform = "translateY(0)";
                }} >
                BOOK A DEMO
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ==================== Main App Component ====================
function App() {
  return (
    <>
      <Navbar /> {/* ✅ Navbar added at top */}
      <HeroSection />
      <Features />
      <Services />
      <SuccessSection />
      <br></br>
      <Footer /> {/* ✅ Footer added at bottom */}
    </>
  );
}

export default App;