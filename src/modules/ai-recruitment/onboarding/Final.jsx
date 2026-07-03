import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL, API_ENDPOINTS } from "../../../shared/constants/api.config";

// Final review + submit step. Reads the "onboardingDraft" accumulated by
// Basicdetails.jsx and Onboardingcontactdetails.jsx (full_name pieces,
// gender, email) and combines it with joining_date / confirmation_date —
// the two fields the backend's OnboardingCreate schema requires that no
// earlier step collects — then POSTs the combined payload to
// POST /onboarding/ (routers/onboarding/onboarding.py).
const DRAFT_KEY = "onboardingDraft";

export default function OnboardingCompletion() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [joiningDate, setJoiningDate] = useState("");
  const [confirmationDate, setConfirmationDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        setDraft(JSON.parse(raw));
      } catch {
        setDraft(null);
      }
    }
  }, []);

  const fullName = draft
    ? [draft.firstName, draft.middleName, draft.lastName].filter(Boolean).join(" ")
    : "";

  const missingEarlierSteps = !draft || !draft.firstName || !draft.lastName || !draft.gender || !draft.email;

  const handleSubmit = async () => {
    if (missingEarlierSteps) {
      toast.error("⚠️ Some earlier steps are incomplete. Please go back and complete them.");
      return;
    }
    if (!joiningDate) {
      toast.error("⚠️ Please enter your joining date.");
      return;
    }
    if (!confirmationDate) {
      toast.error("⚠️ Please enter your confirmation date.");
      return;
    }

    const payload = {
      full_name: fullName,
      email: draft.email,
      gender: draft.gender,
      joining_date: joiningDate,
      confirmation_date: confirmationDate,
    };

    setSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ONBOARDING_FORMS.SUBMIT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Submission failed");
      }

      // Draft has served its purpose once the backend has the record
      localStorage.removeItem(DRAFT_KEY);

      toast.success("🎉 Submitted Successfully!");
      setTimeout(() => {
        navigate("/onboarding/pre-joining");
      }, 1500);
    } catch (err) {
      toast.error(`⚠️ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "#fff",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img src="/assets/img/icons/logo-1.png" alt="logo" style={{ width: "55px", height: "55px", borderRadius: "50%" }} />
          <div>
            <div style={{ fontSize: "20px", fontWeight: "700" }}>
              Onboarding Form{fullName ? `: ${fullName}` : ""}
            </div>
            <div style={{ fontSize: "14px", color: "#6b6b6b" }}>Levitica Technologies Private Limited</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: "20px", cursor: "pointer" }}>🌙</div>
        </div>

        <hr style={{ marginTop: "20px" }} />

        {missingEarlierSteps && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px 16px",
              background: "#fef3c7",
              border: "1px solid #f59e0b",
              borderRadius: "8px",
              color: "#92400e",
              fontSize: "14px",
            }}
          >
            ⚠️ It looks like some earlier steps weren't completed. Please go{" "}
            <strong>Back</strong> and fill in your basic and contact details first.
          </div>
        )}

        {/* Review summary */}
        {!missingEarlierSteps && (
          <div style={{ marginTop: "25px" }}>
            <h4 style={{ fontWeight: 700, marginBottom: "10px" }}>Review Your Details</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 30px", fontSize: "14px", color: "#374151" }}>
              <div><strong>Name:</strong> {fullName}</div>
              <div><strong>Email:</strong> {draft.email}</div>
              <div><strong>Gender:</strong> {draft.gender}</div>
              <div><strong>Mobile:</strong> {draft.mobile || "—"}</div>
            </div>
          </div>
        )}

        {/* Final missing fields */}
        <div style={{ marginTop: "25px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
          <div>
            <label style={{ fontWeight: 600 }}>
              Joining Date <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cdd2d8", background: "#f8f9fa" }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>
              Confirmation Date <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              value={confirmationDate}
              onChange={(e) => setConfirmationDate(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cdd2d8", background: "#f8f9fa" }}
            />
          </div>
        </div>

        <hr style={{ marginTop: "30px" }} />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2 style={{ fontWeight: "700", marginBottom: "15px" }}>Well Done!</h2>
          <p style={{ fontSize: "16px", color: "#6b6b6b" }}>
            You have completed all the sections. <br />
            Click <strong>Back</strong> to make changes.
          </p>
          <p style={{ fontSize: "16px", marginTop: "10px" }}>
            Click <strong>Submit</strong> to send your information.
          </p>
        </div>

        <hr style={{ marginTop: "30px" }} />

        {/* Buttons */}
        <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => navigate("/uploaddocument")}
            disabled={submitting}
            style={{
              padding: "10px 25px",
              background: "#e5e7eb",
              border: "none",
              color: "#111",
              borderRadius: "8px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            ← Back
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || missingEarlierSteps}
            style={{
              padding: "10px 25px",
              background: submitting || missingEarlierSteps ? "#93c5fd" : "#0066ff",
              border: "none",
              color: "white",
              borderRadius: "8px",
              cursor: submitting || missingEarlierSteps ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
}