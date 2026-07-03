import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Step 2 of the onboarding wizard. Like Basicdetails.jsx, there is no
// dedicated backend endpoint for "contact details" alone — these fields
// (mobile, email) get merged into the same "onboardingDraft" object in
// localStorage that Final.jsx eventually POSTs to /onboarding/.
//
// NOTE on OTP: the backend has no OTP verification endpoint for onboarding
// contact details (only unrelated OTP flows exist, for aptitude-assessment
// login). The send/verify OTP below remains simulated on purpose — wiring
// it to a real SMS/verification provider is outside this frontend's scope
// and needs a backend endpoint to exist first.
const DRAFT_KEY = "onboardingDraft";

const Onboardingcontactdetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    email: "",
    homePhone: "",
    emergencyContact: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Pre-fill from existing draft (e.g. navigating back to this step)
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        setFormData((prev) => ({
          ...prev,
          mobile: draft.mobile || "",
          email: draft.email || "",
          homePhone: draft.homePhone || "",
          emergencyContact: draft.emergencyContact || "",
        }));
        if (draft.mobileVerified) setOtpVerified(true);
      } catch {
        // ignore malformed draft
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // editing the mobile number after verification invalidates it
    if (name === "mobile") {
      setOtpSent(false);
      setOtpVerified(false);
    }
  };

  const handleSendOtp = () => {
    if (formData.mobile.length !== 10) {
      toast.error("⚠️ Enter a valid 10-digit mobile number!");
      return;
    }
    setOtpSent(true);
    toast.success(`📩 OTP sent to ${formData.mobile}`);
  };

  const handleVerifyOtp = () => {
    if (!otpSent) {
      toast.warning("Please send OTP first!");
      return;
    }
    setOtpVerified(true);
    toast.success("✅ Mobile number verified!");
  };

  const handleContinue = () => {
    const { mobile, email } = formData;

    if (!otpVerified) {
      toast.error("⚠️ Please verify your mobile number before continuing!");
      return;
    }
    if (!email.includes("@")) {
      toast.error("⚠️ Enter a valid email address!");
      return;
    }

    const existing = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    const updated = {
      ...existing,
      ...formData,
      mobileVerified: true,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));

    toast.success("✅ Contact details saved successfully!");
    navigate("/onboardingPersonaldetails");
  };

  const handleBack = () => {
    navigate("/basicdetails");
  };

  return (
    <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
        <div className="d-flex align-items-center mb-3">
          <img
            src="./assets/img/icons/logo-1.png"
            alt="Logo"
            className="rounded-circle me-3"
            style={{ width: "50px", height: "50px" }}
          />
          <div>
            <h6 className="mb-0">Onboarding Form</h6>
            <small>Levitica Technologies Private Limited</small>
          </div>
        </div>

        <hr />

        <h6 className="text-primary">Contact Details</h6>
        <p className="text-end">Step 2 of 9</p>
        <div className="progress mb-3" style={{ height: "4px" }}>
          <div
            className="progress-bar bg-primary border"
            role="progressbar"
            style={{ width: "20%" }}
            aria-valuenow="20"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <p className="text-end">20% completed</p>

        <div className="mb-3 w-50">
          <label className="form-label">
            Mobile Number <span className="text-danger">*</span>
          </label>
          <div className="d-flex gap-2 ">
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-control"
              placeholder="10-digits only"
              maxLength="10"
            />
            <button
              type="button"
              className="btn btn-warning text-dark w-50"
              onClick={handleSendOtp}
              disabled={otpVerified}
            >
              Send OTP <i className="fe fe-send  text-dark"></i>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm w-50"
              onClick={handleVerifyOtp}
              disabled={otpVerified}
            >
              {otpVerified ? "Verified ✓" : "I have an OTP"}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            E-Mail Address <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="someone@example.com"
            maxLength="100"
          />
          <div className="text-end text-muted" style={{ fontSize: "12px" }}>
            {100 - formData.email.length} chars left
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Home Phone</label>
          <input
            type="text"
            name="homePhone"
            value={formData.homePhone}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your residence phone number"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Emergency Contact</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="form-control"
            placeholder="Name and number of emergency contact person"
          />
        </div>

        <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handleBack}
            style={{ padding: "10px 25px", background: "#e5e7eb", border: "none", color: "#111", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: 600 }}
          >
            ← Back
          </button>
          <button
            onClick={handleContinue}
            style={{ padding: "10px 25px", background: "#0066ff", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: 600 }}
          >
            Continue ➜
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboardingcontactdetails;