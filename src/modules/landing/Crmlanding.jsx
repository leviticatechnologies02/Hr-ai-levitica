import React from "react";
import { Link } from "react-router-dom";
import Footer from './Footer'
import Navbar from './Navbar'
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
        <h1 style={{ fontSize: "48px", fontWeight: "700" }}>
          Transform Your <span style={{ color: "#ff9800" }}>Customer Relationship Management</span>
          <br /> With AI Powered CRM
        </h1>

        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          Manage customer relationships smarter with our AI-powered CRM
          platform. Track leads, automate follow-ups, analyze customer
          interactions, and boost sales performance with intelligent insights
          and real-time analytics.
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
              Book CRM Demo
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
          src="/assets/images/crmbanner.png"
          alt="crm"
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

// ==================== CRMSection (Flip Cards) ====================
function CRMSection() {
  return (
    <div className="crm-section">
      <h3 className="crm-title">Smart CRM Solutions For Growing Businesses</h3>

      <p className="crm-subtitle">
        Manage customers, automate sales, and gain insights with a
        powerful CRM platform.
      </p>

      <div className="crm-cards">
        {/* Card 1 */}
        <div className="flip-card">
          <div className="flip-inner">
            <div className="flip-front">
              <div className="icon">
                <i className="ri-team-fill"></i>
              </div>
              <h4>Customer Management</h4>
              <p>
                Organize customer profiles and track all interactions
                in one centralized CRM platform.
              </p>
            </div>
            <div className="flip-back">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692"
                alt="CRM"
              />
              <h4>Customer Management</h4>
              <p>
                Build stronger relationships with customers using
                intelligent CRM tools and automated communication.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flip-card">
          <div className="flip-inner">
            <div className="flip-front">
              <div className="icon">
                <i className="ri-rocket-2-fill"></i>
              </div>
              <h4>Sales Automation</h4>
              <p>
                Automate follow-ups, pipeline tracking and lead
                assignments to improve sales efficiency.
              </p>
            </div>
            <div className="flip-back">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978"
                alt="Sales"
              />
              <h4>Sales Automation</h4>
              <p>
                Increase productivity by automating repetitive
                sales workflows and reminders.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flip-card">
          <div className="flip-inner">
            <div className="flip-front">
              <div className="icon">
                <i className="ri-bar-chart-box-fill"></i>
              </div>
              <h4>CRM Analytics</h4>
              <p>
                Analyze sales performance and customer engagement
                with real-time dashboards.
              </p>
            </div>
            <div className="flip-back">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
                alt="Analytics"
              />
              <h4>CRM Analytics</h4>
              <p>
                Use powerful CRM analytics to make smarter
                data-driven business decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .crm-section{
          padding:100px 40px;
          text-align:center;
          max-width:1300px;
          margin:auto;
        }
        .crm-title{
          font-size:32px;
          font-weight:700;
        }
        .crm-subtitle{
          margin-top:10px;
          margin-bottom:60px;
          color:#666;
        }
        .crm-cards{
          display:flex;
          justify-content:center;
          gap:35px;
          flex-wrap:wrap;
        }
        .flip-card{
          width:360px;
          height:420px;
          perspective:1000px;
        }
        .flip-inner{
          position:relative;
          width:100%;
          height:100%;
          transition:transform 0.7s;
          transform-style:preserve-3d;
        }
        .flip-card:hover .flip-inner{
          transform:rotateY(180deg);
        }
        .flip-front{
          position:absolute;
          width:100%;
          height:100%;
          backface-visibility:hidden;
          border-radius:16px;
          background:#ffffff;
          padding:40px 30px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          text-align:center;
          box-shadow:0 10px 30px rgba(0,0,0,0.08);
          transition:all 0.4s ease;
        }
        .flip-card:hover .flip-front{
          transform:translateY(-8px);
          box-shadow:0 20px 40px rgba(0,0,0,0.15);
        }
        .icon{
          width:80px;
          height:80px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg,#2563eb,#4f46e5);
          border-radius:20px;
          font-size:36px;
          color:white;
          margin-bottom:20px;
        }
        .flip-front h4{
          font-size:22px;
          font-weight:600;
          margin-bottom:10px;
          color:#1f2937;
        }
        .flip-front p{
          font-size:15px;
          color:#6b7280;
          line-height:1.6;
          max-width:260px;
        }
        .flip-back{
          position:absolute;
          width:100%;
          height:100%;
          transform:rotateY(180deg);
          backface-visibility:hidden;
          border-radius:16px;
          box-shadow:0 10px 30px rgba(0,0,0,0.1);
          background:#fff;
          padding:25px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
        }
        .flip-back img{
          width:100%;
          height:200px;
          object-fit:cover;
          border-radius:10px;
          margin-bottom:15px;
        }
        .flip-back h4{
          margin-bottom:10px;
        }
        .flip-back p{
          color:#555;
          line-height:1.6;
        }
      `}</style>
    </div>
  );
}

// ==================== CRMHubspotSection (Image + Content) ====================
function CRMHubspotSection() {
  return (
    <div className="crm-wrapper">
      <div className="crm-container">
        {/* LEFT IMAGE */}
        <div className="crm-image">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692"
            alt="CRM Platform"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="crm-content">
          <h3>Powerful CRM Platform for Business Growth</h3>
          <p>
            Our CRM platform helps businesses manage customer
            relationships more efficiently. Track leads, manage
            sales pipelines, and organize customer data in one
            centralized system.
          </p>
          <p>
            With smart automation, real-time analytics, and seamless
            integrations, your team can improve productivity,
            deliver better customer experiences, and grow faster.
          </p>
          <div className="crm-buttons">
            <button className="demo-btn">Book a Demo</button>
            <button className="start-btn">Start Free Trial</button>
          </div>
        </div>
      </div>

      <style>{`
        .crm-wrapper{
          padding:90px 40px;
        }
        .crm-container{
          max-width:1200px;
          margin:auto;
          display:flex;
          align-items:center;
          gap:70px;
          flex-wrap:wrap;
        }
        .crm-image{
          flex:1;
        }
        .crm-image img{
          width:100%;
          border-radius:8px;
          box-shadow:0 15px 40px rgba(0,0,0,0.15);
        }
        .crm-content{
          flex:1;
        }
        .crm-content h3{
          font-size:38px;
          margin-bottom:20px;
          color:#243447;
          font-weight:700;
        }
        .crm-content p{
          font-size:16px;
          color:#555;
          line-height:1.7;
          margin-bottom:15px;
        }
        .crm-buttons{
          margin-top:25px;
          display:flex;
          gap:18px;
        }
        .demo-btn{
          background:#ff5c35;
          color:white;
          border:none;
          padding:14px 28px;
          border-radius:6px;
          font-size:16px;
          cursor:pointer;
        }
        .start-btn{
          background:transparent;
          border:2px solid #ff5c35;
          color:#ff5c35;
          padding:12px 28px;
          border-radius:6px;
          font-size:16px;
          cursor:pointer;
        }
        .start-btn:hover{
          background:#ff5c35;
          color:white;
        }
        .demo-btn:hover{
          opacity:0.9;
        }
      `}</style>
    </div>
  );
}

// ==================== CRMPlatform (Icons + Content) ====================
function CRMPlatform() {
  return (
    <div className="crm-wrapper-platform">
      {/* ICON ROW */}
      <div className="icons-row">
        <div className="icon-item">
          <i className="bi bi-megaphone-fill"></i>
          <p>Marketing Hub</p>
        </div>

        <div className="icon-item">
          <i className="bi bi-bar-chart-line-fill"></i>
          <p>Sales Hub</p>
        </div>

        <div className="icon-item">
          <i className="bi bi-heart-fill"></i>
          <p>Service Hub</p>
        </div>

        <div className="icon-item">
          <i className="bi bi-play-circle-fill"></i>
          <p>Content Hub</p>
        </div>

        <div className="icon-item">
          <i className="bi bi-gear-fill"></i>
          <p>Operations Hub</p>
        </div>

        <div className="icon-item">
          <i className="bi bi-cart-fill"></i>
          <p>Commerce Hub</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="crm-content-platform">
        <h2 className="crm-title-platform">Your complete CRM platform</h2>

        <p>
          Our CRM platform connects marketing, sales, and customer
          service teams in one unified system. Manage leads, automate
          campaigns, track deals, and deliver exceptional customer
          experiences from a single dashboard.
        </p>

        <p>
          With powerful analytics and automation tools, businesses
          gain complete visibility into the customer journey and
          grow faster.
        </p>

        <div className="buttons-platform">
          <button className="demo-platform">Get a demo</button>
          <button className="start-platform">Get started free</button>
        </div>
      </div>

      <style>{`
        .crm-wrapper-platform{
          padding:100px 40px;
          text-align:center;
          max-width:1200px;
          margin:auto;
        }
        .icons-row{
          display:flex;
          justify-content:center;
          align-items:center;
          gap:60px;
          flex-wrap:wrap;
          margin-bottom:60px;
          position:relative;
        }
        .icons-row::before{
          content:"";
          position:absolute;
          top:35px;
          left:5%;
          width:90%;
          height:2px;
          background:#e5e5e5;
          z-index:0;
        }
        .icon-item{
          display:flex;
          flex-direction:column;
          align-items:center;
          font-size:14px;
          color:#333;
          position:relative;
          z-index:1;
          background:white;
          padding:0 10px;
        }
        .icon-item i{
          font-size:30px;
          color:#ff5c35;
          margin-bottom:6px;
        }
        .crm-content-platform h2{
          font-size:36px;
          font-weight:700;
          margin-bottom:15px;
          color:#243447;
        }
        .crm-content-platform p{
          color:#555;
          line-height:1.7;
          max-width:750px;
          margin:10px auto;
        }
        .buttons-platform{
          margin-top:25px;
          display:flex;
          justify-content:center;
          gap:18px;
        }
        .demo-platform{
          background:#ff5c35;
          color:white;
          border:none;
          padding:14px 30px;
          border-radius:6px;
          cursor:pointer;
          font-size:16px;
        }
        .start-platform{
          background:transparent;
          border:2px solid #ff5c35;
          color:#ff5c35;
          padding:12px 30px;
          border-radius:6px;
          cursor:pointer;
          font-size:16px;
        }
        .start-platform:hover{
          background:#ff5c35;
          color:white;
        }
      `}</style>
    </div>
  );
}

// ==================== Card Component for CRMGrid ====================
const Card = ({ icon, title, desc, features }) => {
  return (
    <div className="card">
      <div className="title">
        <i className={`bi ${icon}`}></i>
        <h5>{title}</h5>
      </div>

      <p className="desc">{desc}</p>

      <div className="line"></div>

      <p className="feature-title">Popular Features</p>

      <ul>
        {features.map((f, i) => (
          <li key={i}>
            <i className="bi bi-check-circle-fill"></i>
            {f}
          </li>
        ))}
      </ul>

      <button className="btn">Learn more</button>
    </div>
  );
};

// ==================== CRMGrid Component ====================
function CRMGrid() {
  return (
    <div className="wrapper">
      <div className="grid">
        <Card
          icon="bi-megaphone-fill"
          title="Marketing Hub®"
          desc="AI-powered marketing software that helps generate leads and automate marketing."
          features={[
            "Breeze social media agent",
            "Marketing automation",
            "Analytics"
          ]}
        />

        <Card
          icon="bi-bar-chart-fill"
          title="Sales Hub®"
          desc="Easy-to-adopt sales software that leverages AI to build pipelines."
          features={[
            "Sales workspace",
            "Deal management",
            "Breeze prospecting agent"
          ]}
        />

        <Card
          icon="bi-heart-fill"
          title="Service Hub®"
          desc="Customer service software powered by AI to scale support."
          features={[
            "Omni-channel help desk",
            "Breeze customer agent",
            "Customer success workspace"
          ]}
        />

        <Card
          icon="bi-play-circle-fill"
          title="Content Hub™"
          desc="All-in-one AI-powered content marketing software."
          features={[
            "Scalable CMS",
            "Brand voice",
            "Breeze content agent"
          ]}
        />

        <Card
          icon="bi-gear-fill"
          title="Operations Hub®"
          desc="Operations software that leverages AI to manage data."
          features={[
            "Data sync",
            "Programmable automation",
            "AI-powered data quality automation"
          ]}
        />

        <Card
          icon="bi-arrow-up-right-circle-fill"
          title="Commerce Hub™"
          desc="B2B commerce software designed to collect payments."
          features={[
            "Invoices & subscriptions",
            "Quotes",
            "Payment links"
          ]}
        />

        <Card
          icon="bi-circle-fill"
          title="Smart CRM™"
          desc="AI-powered CRM software that unifies customer data."
          features={[
            "AI-powered reporting",
            "Contact management",
            "Custom properties"
          ]}
        />

        <div className="bundle">
          <h3>Small Business Bundle</h3>

          <p>
            The Starter edition of every HubSpot product bundled together
            at a discounted price for startups and small businesses.
          </p>

          <div className="bundle-icons">
            <i className="bi bi-megaphone-fill"></i>
            <i className="bi bi-bar-chart-fill"></i>
            <i className="bi bi-heart-fill"></i>
            <i className="bi bi-play-circle-fill"></i>
            <i className="bi bi-gear-fill"></i>
            <i className="bi bi-arrow-up-right-circle-fill"></i>
          </div>

          <button className="btn">Learn more</button>
        </div>
      </div>

      <style>{`
        body{
          background:transparent;
          font-family:Arial;
        }
        .wrapper{
          max-width:1100px;
          margin:auto;
          padding:40px;
        }
        .grid{
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:24px;
        }
        .card{
          background:white;
          padding:24px;
          border-radius:12px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          min-height:260px;
          box-shadow:0 4px 10px rgba(0,0,0,0.05);
          transition:0.3s;
        }
        .card:hover{
          transform:translateY(-6px);
          box-shadow:0 10px 20px rgba(0,0,0,0.1);
        }
        .title{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:8px;
        }
        .title i{
          color:#ff5c35;
          font-size:24px;
        }
        .title h5{
          font-size:18px;
          margin:0;
          font-weight:600;
        }
        .desc{
          font-size:14px;
          color:#555;
          line-height:1.6;
          margin-bottom:12px;
        }
        .line{
          height:1px;
          background:#eee;
          margin:12px 0;
        }
        .feature-title{
          font-size:13px;
          color:#666;
          margin-bottom:6px;
          font-weight:600;
        }
        ul{
          list-style:none;
          padding:0;
          margin-bottom:14px;
        }
        ul li{
          display:flex;
          align-items:center;
          gap:8px;
          font-size:13px;
          margin-bottom:6px;
        }
        ul i{
          color:black;
          font-size:13px;
        }
        .btn{
          background:#ff5c35;
          border:none;
          color:white;
          padding:10px 14px;
          border-radius:6px;
          cursor:pointer;
          font-size:13px;
          width:120px;
        }
        .bundle{
          background:white;
          padding:28px;
          border-radius:12px;
          grid-column:span 2;
          text-align:center;
          box-shadow:0 4px 10px rgba(0,0,0,0.05);
        }
        .bundle-icons{
          display:flex;
          justify-content:center;
          gap:22px;
          margin:20px 0;
          font-size:26px;
          color:#ff5c35;
        }
      `}</style>
      
    </div>
  );
}

// ==================== Main Component ====================
export default function CRMFeatures() {
  return (
    <>
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
<Navbar/>
      <HeroSection />
      <CRMSection />
      <CRMHubspotSection />
      <CRMPlatform />
      <Footer/>
   
    </>
  );
}