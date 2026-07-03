import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Basicdetails is Step 1 of the onboarding wizard. There is no dedicated
// backend endpoint for "basic details" alone — the backend's onboarding
// submit contract (POST /onboarding/) expects a combined payload
// (full_name, email, gender, joining_date, confirmation_date) that is only
// assembled once at the final review step. So this step (and
// Onboardingcontactdetails.jsx after it) accumulate their fields into a
// shared "onboardingDraft" object in localStorage, which Final.jsx reads
// and submits.
const DRAFT_KEY = "onboardingDraft";

export default function Basicdetails() {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
  });

  // Pre-fill from any existing draft (e.g. if the candidate navigated back)
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        setForm((prev) => ({
          ...prev,
          firstName: draft.firstName || "",
          middleName: draft.middleName || "",
          lastName: draft.lastName || "",
          gender: draft.gender || "",
          dob: draft.dob || "",
        }));
        if (draft.profilePicPreview) setProfilePic(draft.profilePicPreview);
      } catch {
        // ignore malformed draft
      }
    }
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePic(previewUrl);
      // Note: only the preview URL is persisted to the draft; the actual
      // File object can't survive localStorage. Photo upload, if required
      // by the backend, should go through the DOCUMENTS_UPLOAD endpoint
      // in Uploaddocument.jsx instead.
    }
  };

  const saveDraftAndContinue = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.gender || !form.dob) {
      toast.error("⚠️ Please fill all required fields!");
      return;
    }

    const existing = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
    const updated = {
      ...existing,
      ...form,
      profilePicPreview: profilePic,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));

    toast.success("✅ Basic details saved");
    navigate("/onboardingcontactdetails");
  };

  return (
    <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div style={{ width: "100%", maxWidth: "900px", background: "#fff", padding: "30px", borderRadius: "18px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
          <img src="/logo192.png" alt="logo" style={{ width: "55px", height: "55px", borderRadius: "50%" }} />
          <div>
            <div style={{ fontSize: "20px", fontWeight: "700" }}>Onboarding Form</div>
            <div style={{ fontSize: "14px", color: "#6b6b6b" }}>Levitica Technologies Private Limited</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: "20px", cursor: "pointer" }}>🌙</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #dedede", paddingBottom: "8px" }}>
          <div style={{ fontSize: "17px", fontWeight: "600", color: "#2563eb" }}>Basic Details</div>
          <div style={{ color: "#666" }}>Step 1 of 9</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", margin: "10px 0 20px" }}>
          <div style={{ width: "120px", height: "4px", background: "#2563eb", borderRadius: "10px" }}></div>
          <div style={{ marginLeft: "12px", fontSize: "13px", color: "#666" }}>5% completed</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>

          <div>
            <label style={{ fontWeight: 600 }}>First Name <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              maxLength={100}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cdd2d8", background: "#f8f9fa" }}
            />
            <small style={{ color: "#8b8b8b" }}>{100 - form.firstName.length} chars left</small>
          </div>

          <div style={{ textAlign: "center" }}>
            <label style={{ cursor: "pointer" }}>
              {profilePic ? (
                <img src={profilePic} alt="profile" style={{ width: "70px", height: "70px", borderRadius: "50%" }} />
              ) : (
                <div style={{ width: "70px", height: "70px", background: "#ddd", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>
                  👤
                </div>
              )}
            </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} id="uploadInput" />
            <label htmlFor="uploadInput" style={{ display: "block", marginTop: "5px", color: "#2563eb", cursor: "pointer" }}>
              Upload your photo
            </label>
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Middle Name</label>
            <input
              type="text"
              placeholder="Middle Name"
              value={form.middleName}
              onChange={(e) => handleChange("middleName", e.target.value)}
              maxLength={100}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cdd2d8", background: "#f8f9fa" }}
            />
            <small style={{ color: "#8b8b8b" }}>{100 - form.middleName.length} chars left</small>
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Last Name <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              maxLength={100}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cdd2d8", background: "#f8f9fa" }}
            />
            <small style={{ color: "#8b8b8b" }}>{100 - form.lastName.length} chars left</small>
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Gender <span style={{ color: "red" }}>*</span></label>
            <select
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cdd2d8", background: "#f8f9fa" }}
            >
              <option value="">Please select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Date of Birth <span style={{ color: "red" }}>*</span></label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => handleChange("dob", e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cdd2d8", background: "#f8f9fa" }}
            />
          </div>

        </div>

        <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => navigate("/newhire")}
            style={{ padding: "10px 25px", background: "#e5e7eb", border: "none", color: "#111", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: 600 }}
          >
            ← Back
          </button>
          <button
            onClick={saveDraftAndContinue}
            style={{ padding: "10px 25px", background: "#0066ff", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: 600 }}
          >
            Continue ➜
          </button>
        </div>

      </div>
    </div>
  );
}