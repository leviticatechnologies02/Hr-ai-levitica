import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ContactBody = () => {
  const [currentPage, setCurrentPage] = useState("contact"); // "contact", "verification", or "landing"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "", 
    message: "",
    file: null,
    consent: false
  });

  // Generate random 6-digit OTP
  const generateRandomOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const [otp, setOtp] = useState(generateRandomOTP());
  const [userOtp, setUserOtp] = useState(["", "", "", "", "", ""]);
  const [showInvalidOtp, setShowInvalidOtp] = useState(false);
  const [tab, setTab] = useState("recruiter");
  const [showMore, setShowMore] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Timer for resend code
  useEffect(() => {
    let timer;
    if (resendTimer > 0 && !canResend) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, canResend]);

  // Auto redirect to dashboard after success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect to dashboard
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Generate new OTP when navigating to verification
    setOtp(generateRandomOTP());
    setUserOtp(["", "", "", "", "", ""]);
    setShowInvalidOtp(false);
    setResendTimer(30);
    setCanResend(false);
    // Navigate to verification page
    setCurrentPage("verification");
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...userOtp];
      newOtp[index] = value;
      setUserOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerify = () => {
    const enteredOtp = userOtp.join("");
    
    if (enteredOtp === otp) {
      setShowInvalidOtp(false);
      setShowSuccess(true);
      // Don't redirect immediately, show success message first
    } else {
      setShowInvalidOtp(true);
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      // Generate new OTP
      const newOtp = generateRandomOTP();
      setOtp(newOtp);
      setUserOtp(["", "", "", "", "", ""]);
      setShowInvalidOtp(false);
      setResendTimer(30);
      setCanResend(false);
      
      // Show the new OTP (for demo purposes - remove in production)
      alert(`New verification code: ${newOtp}`);
    }
  };

  const handleBackToContact = () => {
    setCurrentPage("contact");
  };

  const handleBackToHome = () => {
    setCurrentPage("contact");
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "jksdh@gmail.com",
      message: "",
      file: null,
      consent: false
    });
  };

  const styles = {
    page: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "80px 20px",
      fontFamily: "'Poppins', sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative"
    },

    container: {
      maxWidth: "1300px",
      width: "100%",
      display: "grid",
      gridTemplateColumns: currentPage === "contact" ? "1fr 1.2fr" : "1fr",
      gap: "40px",
      background: currentPage === "landing" ? "transparent" : "rgba(255, 255, 255, 0.95)",
      borderRadius: "30px",
      boxShadow: currentPage === "landing" ? "none" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
      backdropFilter: currentPage === "landing" ? "none" : "blur(10px)"
    },

    // Landing Page Styles
    landingContainer: {
      maxWidth: "1200px",
      width: "100%",
      margin: "0 auto"
    },

    hero: {
      textAlign: "center",
      color: "white",
      marginBottom: "60px"
    },

    heroTitle: {
      fontSize: "52px",
      fontWeight: 700,
      marginBottom: "20px",
      animation: "fadeInDown 0.8s ease"
    },

    heroSubtitle: {
      fontSize: "18px",
      opacity: 0.9,
      maxWidth: "600px",
      margin: "0 auto",
      animation: "fadeInUp 0.8s ease"
    },

    features: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "30px",
      marginBottom: "60px"
    },

    featureCard: {
      background: "white",
      padding: "40px 30px",
      borderRadius: "20px",
      textAlign: "center",
      boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)",
      animation: "fadeIn 1s ease"
    },

    featureIcon: {
      width: "70px",
      height: "70px",
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 25px",
      color: "white",
      fontSize: "30px"
    },

    featureTitle: {
      fontSize: "22px",
      fontWeight: 600,
      color: "#1f2937",
      marginBottom: "15px"
    },

    featureDesc: {
      fontSize: "14px",
      color: "#6b7280",
      lineHeight: 1.6
    },

    ctaSection: {
      textAlign: "center",
      background: "white",
      padding: "60px",
      borderRadius: "20px",
      boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)"
    },

    ctaTitle: {
      fontSize: "32px",
      fontWeight: 700,
      color: "#1f2937",
      marginBottom: "15px"
    },

    ctaText: {
      fontSize: "16px",
      color: "#6b7280",
      marginBottom: "30px"
    },

    ctaButton: {
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      color: "white",
      border: "none",
      padding: "16px 40px",
      borderRadius: "50px",
      fontSize: "18px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease"
    },

    successMessage: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "white",
      padding: "30px 50px",
      borderRadius: "16px",
      boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.3)",
      textAlign: "center",
      zIndex: 1000,
      animation: "slideUp 0.5s ease"
    },

    successIcon: {
      width: "60px",
      height: "60px",
      background: "#10b981",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 20px",
      color: "white",
      fontSize: "30px"
    },

    successTitle: {
      fontSize: "24px",
      fontWeight: 600,
      color: "#1f2937",
      marginBottom: "10px"
    },

    successText: {
      fontSize: "14px",
      color: "#6b7280"
    },

    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      zIndex: 999
    },

    // Verification Page Styles - Ultra Small Card
    smallCard: {
      background: "white",
      borderRadius: "16px",
      padding: "25px",
      maxWidth: "340px",
      width: "100%",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      position: "relative",
      margin: "0 auto"
    },

    backButton: {
      position: "absolute",
      top: "12px",
      left: "12px",
      background: "#f3f4f6",
      border: "none",
      color: "#4b5563",
      fontSize: "12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "4px 10px",
      borderRadius: "20px",
      transition: "all 0.2s ease"
    },

    cardHeader: {
      textAlign: "center",
      marginBottom: "15px",
      marginTop: "5px"
    },

    iconWrapper: {
      width: "45px",
      height: "45px",
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 10px",
      color: "white",
      fontSize: "20px"
    },

    cardTitle: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#1f2937",
      marginBottom: "4px"
    },

    cardSubtitle: {
      fontSize: "12px",
      color: "#6b7280"
    },

    emailBox: {
      background: "#f9fafb",
      padding: "8px 12px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "15px",
      fontSize: "12px"
    },

    emailText: {
      color: "#374151",
      fontWeight: 500
    },

    otpContainer: {
      display: "flex",
      gap: "6px",
      justifyContent: "center",
      marginBottom: "12px"
    },

    otpInput: {
      width: "38px",
      height: "45px",
      border: "2px solid #e5e7eb",
      borderRadius: "8px",
      fontSize: "18px",
      fontWeight: 600,
      textAlign: "center",
      color: "#1f2937",
      outline: "none",
      background: "white"
    },

    otpDisplay: {
      background: "#f0f9ff",
      padding: "8px",
      borderRadius: "6px",
      textAlign: "center",
      marginBottom: "12px",
      border: "1px dashed #4f46e5"
    },

    otpDisplayText: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#4f46e5",
      letterSpacing: "2px"
    },

    otpDisplayLabel: {
      fontSize: "10px",
      color: "#6b7280",
      marginBottom: "2px"
    },

    invalidOtp: {
      color: "#ef4444",
      fontSize: "11px",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      background: "#fef2f2",
      padding: "6px 10px",
      borderRadius: "6px"
    },

    resendRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "15px",
      padding: "8px 0",
      borderTop: "1px solid #f3f4f6",
      borderBottom: "1px solid #f3f4f6",
      fontSize: "12px"
    },

    timerText: {
      color: "#4f46e5",
      fontWeight: 600,
      marginRight: "8px"
    },

    resendButton: {
      background: "none",
      border: "none",
      color: canResend ? "#4f46e5" : "#9ca3af",
      fontWeight: 600,
      fontSize: "12px",
      cursor: canResend ? "pointer" : "not-allowed",
      padding: "4px 10px"
    },

    verifyButton: {
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      color: "white",
      border: "none",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      width: "100%",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px"
    },

    footerText: {
      fontSize: "10px",
      color: "#9ca3af",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      marginBottom: "8px"
    },

    recaptchaRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      fontSize: "10px",
      color: "#9ca3af"
    },

    recaptchaLink: {
      color: "#4f46e5",
      textDecoration: "none"
    },

    /* LEFT SIDE - Contact Page */
    left: {
      background: "linear-gradient(145deg, #4f46e5 0%, #7c3aed 100%)",
      padding: "50px 40px",
      color: "white",
      position: "relative",
      overflow: "hidden"
    },

    decorativeCircle1: {
      position: "absolute",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      top: "-100px",
      right: "-100px"
    },

    decorativeCircle2: {
      position: "absolute",
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      bottom: "-50px",
      left: "-50px"
    },

    smallTitle: {
      fontSize: "14px",
      fontWeight: 600,
      letterSpacing: "2px",
      textTransform: "uppercase",
      background: "rgba(255, 255, 255, 0.2)",
      display: "inline-block",
      padding: "6px 16px",
      borderRadius: "30px",
      marginBottom: "25px",
      position: "relative",
      zIndex: 1
    },

    title: {
      fontSize: "42px",
      fontWeight: 700,
      lineHeight: 1.2,
      marginBottom: "25px",
      position: "relative",
      zIndex: 1
    },

    description: {
      fontSize: "16px",
      lineHeight: 1.7,
      opacity: 0.9,
      marginBottom: "40px",
      position: "relative",
      zIndex: 1
    },

    productList: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
      marginBottom: "40px",
      position: "relative",
      zIndex: 1
    },

    productItem: {
      background: "rgba(255, 255, 255, 0.1)",
      padding: "10px 15px",
      borderRadius: "30px",
      fontSize: "14px",
      fontWeight: 500,
      backdropFilter: "blur(5px)",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },

    social: {
      display: "flex",
      gap: "15px",
      position: "relative",
      zIndex: 1
    },

    socialIcon: {
      width: "45px",
      height: "45px",
      background: "rgba(255, 255, 255, 0.2)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      color: "white",
      textDecoration: "none",
      border: "none"
    },

    /* RIGHT SIDE - Contact Form */
    formCard: {
      padding: "50px 45px",
      background: "white",
      position: "relative"
    },

    toggleWrap: {
      marginBottom: "35px"
    },

    toggle: {
      display: "flex",
      background: "#f3f4f6",
      padding: "5px",
      borderRadius: "50px",
      position: "relative"
    },

    toggleBtn: (active) => ({
      flex: 1,
      padding: "12px 20px",
      border: "none",
      background: active ? "white" : "transparent",
      color: active ? "#4f46e5" : "#6b7280",
      fontWeight: 600,
      fontSize: "15px",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: active ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    }),

    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "20px"
    },

    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: "20px"
    },

    label: {
      fontSize: "14px",
      fontWeight: 600,
      color: "#374151",
      letterSpacing: "0.3px",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },

    input: {
      padding: "14px 16px",
      borderRadius: "12px",
      border: "2px solid #e5e7eb",
      fontSize: "15px",
      transition: "all 0.3s ease",
      outline: "none",
      width: "100%"
    },

    fullInput: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "12px",
      border: "2px solid #e5e7eb",
      fontSize: "15px",
      transition: "all 0.3s ease",
      outline: "none"
    },

    upload: {
      border: "2px dashed #4f46e5",
      borderRadius: "16px",
      padding: "30px 20px",
      textAlign: "center",
      marginBottom: "25px",
      background: "#f5f3ff",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative"
    },

    uploadText: {
      fontSize: "14px",
      color: "#4f46e5",
      fontWeight: 600,
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },

    uploadSubtext: {
      fontSize: "13px",
      color: "#9ca3af"
    },

    textarea: {
      width: "100%",
      minHeight: "120px",
      borderRadius: "12px",
      border: "2px solid #e5e7eb",
      padding: "14px 16px",
      fontSize: "15px",
      transition: "all 0.3s ease",
      outline: "none",
      fontFamily: "inherit"
    },

    checkbox: {
      fontSize: "14px",
      color: "#6b7280",
      display: "flex",
      gap: "10px",
      marginBottom: "30px",
      lineHeight: 1.6,
      alignItems: "flex-start"
    },

    checkboxInput: {
      width: "18px",
      height: "18px",
      marginTop: "2px",
      cursor: "pointer"
    },

    viewMoreBtn: {
      color: "#4f46e5",
      cursor: "pointer",
      fontWeight: 600,
      marginLeft: "5px",
      background: "none",
      border: "none",
      fontSize: "14px"
    },

    buttons: {
      display: "flex",
      gap: "15px",
      alignItems: "center"
    },

    submit: {
      padding: "16px 32px",
      borderRadius: "50px",
      border: "none",
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      color: "white",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },

    viewJobs: {
      padding: "16px 32px",
      borderRadius: "50px",
      border: "2px solid #e5e7eb",
      background: "white",
      color: "#374151",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    },

    fileName: {
      marginTop: "10px",
      fontSize: "13px",
      color: "#4f46e5",
      fontWeight: 500
    },

    logoutBtn: {
      position: "absolute",
      top: "20px",
      right: "20px",
      background: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "30px",
      color: "#4f46e5",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    },

    dashboardLink: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "white",
      padding: "12px 24px",
      borderRadius: "50px",
      color: "#4f46e5",
      textDecoration: "none",
      fontWeight: 600,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }
  };

  // Add keyframes animation
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translate(-50%, -30%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
  `;
  document.head.appendChild(styleSheet);

  return (
    <>
      <Navbar />
      {showSuccess ? (
        <div style={styles.page}>
          <div style={styles.overlay} />
          <div style={styles.successMessage}>
            <div style={styles.successIcon}>
              <i className="bi bi-check-lg"></i>
            </div>
            <h3 style={styles.successTitle}>Verification Successful!</h3>
            <p style={styles.successText}>Redirecting to dashboard...</p>
          </div>
        </div>
      ) : currentPage === "verification" ? (
        <div style={styles.page}>
          <div style={styles.smallCard}>
            <button style={styles.backButton} onClick={handleBackToContact}>
              <i className="bi bi-arrow-left"></i> Back
            </button>

            <div style={styles.cardHeader}>
              <div style={styles.iconWrapper}>
                <i className="bi bi-shield-check"></i>
              </div>
              <h3 style={styles.cardTitle}>Verify Email</h3>
              <p style={styles.cardSubtitle}>Enter 6-digit code</p>
            </div>

            {/* Email Display */}
            <div style={styles.emailBox}>
              <span style={styles.emailText}>
                <i className="bi bi-envelope" style={{ marginRight: "6px" }}></i>
                {formData.email}
              </span>
              <i className="bi bi-check-circle-fill" style={{ color: "#10b981", fontSize: "14px" }}></i>
            </div>

            {/* OTP Input Boxes */}
            <div style={styles.otpContainer}>
              {userOtp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  style={{
                    ...styles.otpInput,
                    borderColor: showInvalidOtp ? "#ef4444" : "#e5e7eb"
                  }}
                />
              ))}
            </div>

            {/* Demo OTP Display - Remove in production */}
            <div style={styles.otpDisplay}>
              <div style={styles.otpDisplayLabel}>Demo code:</div>
              <div style={styles.otpDisplayText}>{otp}</div>
            </div>

            {/* Invalid OTP Message */}
            {showInvalidOtp && (
              <div style={styles.invalidOtp}>
                <i className="bi bi-exclamation-circle-fill"></i>
                Invalid code
              </div>
            )}

            {/* Resend Row */}
            <div style={styles.resendRow}>
              <span>Didn't get code?</span>
              <div>
                {!canResend && <span style={styles.timerText}>{resendTimer}s</span>}
                <button
                  style={styles.resendButton}
                  onClick={handleResendCode}
                  disabled={!canResend}
                >
                  Resend
                </button>
              </div>
            </div>

            {/* Verify Button */}
            <button style={styles.verifyButton} onClick={handleVerify}>
              Verify <i className="bi bi-check-lg"></i>
            </button>

            {/* Footer */}
            <div style={styles.footerText}>
              <i className="bi bi-shield"></i>
              By verifying, you agree to our terms
            </div>

            <div style={styles.recaptchaRow}>
              <span>
                <i className="bi bi-shield-lock"></i> reCAPTCHA
              </span>
              <a href="#" style={styles.recaptchaLink}>Privacy</a>
              <span>•</span>
              <a href="#" style={styles.recaptchaLink}>Terms</a>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.page}>
          <div style={styles.container}>
            {/* LEFT SIDE */}
            <div style={styles.left}>
              <div style={styles.decorativeCircle1}></div>
              <div style={styles.decorativeCircle2}></div>
              
              <div style={styles.smallTitle}>
                <i className="bi bi-envelope-paper" style={{ marginRight: "8px" }}></i>
                CONTACT US
              </div>
              <div style={styles.title}>
                Let's Create<br />
                Something Amazing
              </div>
              <div style={styles.description}>
                Whether you're looking for product information, demos, pricing, or 
                technical assistance, our team is ready to help you succeed.
              </div>

              {/* PRODUCT LIST with Icons */}
              <div style={styles.productList}>
                <div style={styles.productItem}>
                  <i className="bi bi-people"></i> CRM Solutions
                </div>
                <div style={styles.productItem}>
                  <i className="bi bi-graph-up"></i> Productivity Platform
                </div>
                <div style={styles.productItem}>
                  <i className="bi bi-person-badge"></i> HRMS Management
                </div>
                <div style={styles.productItem}>
                  <i className="bi bi-robot"></i> HR-AI Recruitment
                </div>
              </div>

              {/* SOCIAL ICONS - Bootstrap Icons */}
              <div style={styles.social}>
                <a href="#" style={styles.socialIcon}>
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="#" style={styles.socialIcon}>
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" style={styles.socialIcon}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" style={styles.socialIcon}>
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div style={styles.formCard}>
              {/* Toggle Buttons */}
              <div style={styles.toggleWrap}>
                <div style={styles.toggle}>
                  <button
                    style={styles.toggleBtn(tab === "recruiter")}
                    onClick={() => setTab("recruiter")}
                    type="button"
                  >
                    <i className="bi bi-briefcase"></i> Recruiter
                  </button>
                  <button
                    style={styles.toggleBtn(tab === "candidate")}
                    onClick={() => setTab("candidate")}
                    type="button"
                  >
                    <i className="bi bi-person-check"></i> Candidate
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <i className="bi bi-person"></i> First Name *
                  </label>
                  <input
                    style={styles.input}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <i className="bi bi-person"></i> Last Name
                  </label>
                  <input
                    style={styles.input}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <i className="bi bi-telephone"></i> Phone Number *
                </label>
                <input
                  style={styles.fullInput}
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <i className="bi bi-envelope"></i> Email Address *
                </label>
                <input
                  style={styles.fullInput}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@company.com"
                  type="email"
                  required
                />
              </div>

              {tab === "candidate" && (
                <div style={styles.upload}>
                  <div style={styles.uploadText}>
                    <i className="bi bi-cloud-upload"></i> Click to upload or drag and drop
                  </div>
                  <div style={styles.uploadSubtext}>
                    <i className="bi bi-file-pdf"></i> PDF, DOC, DOCX (Max 10MB)
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{
                      opacity: 0,
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: 0,
                      left: 0,
                      cursor: "pointer"
                    }}
                    onChange={handleFileChange}
                  />
                  {formData.file && (
                    <div style={styles.fileName}>
                      <i className="bi bi-check-circle-fill"></i> {formData.file.name}
                    </div>
                  )}
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <i className="bi bi-chat-dots"></i> How can we help? *
                </label>
                <textarea
                  style={styles.textarea}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your requirements..."
                  required
                ></textarea>
              </div>

              {/* Consent Checkbox */}
              <div style={styles.checkbox}>
                <input
                  type="checkbox"
                  style={styles.checkboxInput}
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                />
                <span>
                  By clicking submit, you agree to our privacy policy and terms of service.
                  <button
                    style={styles.viewMoreBtn}
                    onClick={() => setShowMore(!showMore)}
                    type="button"
                  >
                    {showMore ? "View Less" : "View More"} 
                    <i className={`bi bi-chevron-${showMore ? 'up' : 'down'}`}></i>
                  </button>
                  {showMore && (
                    <span style={{ display: "block", marginTop: "10px", color: "#6b7280" }}>
                      <i className="bi bi-shield-check"></i> We'll use your information to process your request and send relevant updates. 
                      Your data is securely stored and never shared with third parties.
                    </span>
                  )}
                </span>
              </div>

              {/* Buttons */}
              <div style={styles.buttons}>
                <button style={styles.submit} type="submit" onClick={handleSubmit}>
                  Send Message <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ContactBody;













