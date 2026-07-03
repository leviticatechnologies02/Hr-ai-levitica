import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL, API_ENDPOINTS } from "../../../shared/constants/api.config";

const Uploaddocuments = () => {
  const navigate = useNavigate();
  const maxFileSizeMB = 10;

  // Document keys MUST match the backend's multipart field names exactly
  // (routers/onboarding/documents.py -> POST /api/documents/upload)
  const docConfig = [
    { key: "pan_card", label: "PAN Card", required: true },
    { key: "aadhaar_card", label: "Aadhaar Card", required: true },
    { key: "highest_education_proof", label: "Highest Education Proof", required: true },
    { key: "esi_card", label: "ESI Card" },
    { key: "driving_license", label: "Driving License" },
    { key: "passport", label: "Passport" },
    { key: "last_relieving_letter", label: "Last Relieving Letter" },
    { key: "last_salary_slip", label: "Last Salary Slip" },
    { key: "latest_bank_statement", label: "Latest Bank Statement" },
  ];

  const [documents, setDocuments] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Upload file handler (keeps the actual File object now, not just the name)
  const handleUpload = (key, file) => {
    if (!file) return;
    if (file.size / 1024 / 1024 > maxFileSizeMB) {
      toast.error(`❌ ${file.name} exceeds ${maxFileSizeMB} MB limit`);
      return;
    }

    setDocuments((prev) => ({ ...prev, [key]: file }));
    toast.success(`✅ ${file.name} selected`);
  };

  // Remove file handler
  const handleRemove = (key) => {
    setDocuments((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    toast.info("📌 File removed");
  };

  const handleBack = () => {
    navigate("/onboardingbankdetails");
  };

  // Continue button handler with validation + real upload
  const handleContinue = async () => {
    // Check required docs
    for (const doc of docConfig) {
      if (doc.required && !documents[doc.key]) {
        toast.error(`❌ ${doc.label} is required`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(documents).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ONBOARDING_FORMS.DOCUMENTS_UPLOAD}`,
        {
          method: "POST",
          // NOTE: do NOT set Content-Type manually — the browser sets the
          // correct multipart boundary automatically for FormData.
          body: formData,
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Failed to upload documents");
      }

      toast.success("🎉 All documents submitted successfully");
      navigate("/final");
    } catch (err) {
      toast.error(`⚠️ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Render a document row dynamically
  const renderRow = (doc) => (
    <div key={doc.key} style={styles.docRow}>
      <div>
        <span style={doc.required ? styles.required : {}}>{doc.label}</span>
        <div style={styles.fileName}>
          {documents[doc.key] ? documents[doc.key].name : "No file selected"}
        </div>
      </div>
      {documents[doc.key] ? (
        <button
          style={styles.removeBtn}
          onClick={() => handleRemove(doc.key)}
        >
          Remove
        </button>
      ) : (
        <label style={styles.uploadBtn}>
          Upload
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleUpload(doc.key, e.target.files[0])}
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
      <div style={{ ...styles.container, width: "100%", maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={styles.header}>
          <img
            src="/assets/img/icons/logo-1.png"
            alt="Logo"
            style={styles.logo}
          />
          <div>
            <h3 style={styles.title}>Onboarding Form</h3>
            <p style={styles.subtitle}>Levitica Technologies Private Limited</p>
          </div>
          <div style={styles.nightModeIcon}>🌙</div>
        </div>

        <h4 style={styles.sectionTitle}>Upload Documents</h4>
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>
        <div style={styles.progressText}>
          Step 9 of 9 <span style={{ float: "right" }}>90% completed</span>
        </div>

        {/* Upload Section */}
        <div style={styles.uploadSection}>
          {docConfig.map((doc) => renderRow(doc))}
        </div>

        <div style={styles.footerText}>Max File Size: {maxFileSizeMB} MB</div>

        {/* Buttons */}
        <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handleBack}
            disabled={submitting}
            style={{
              padding: "10px 25px",
              background: "#e5e7eb",
              border: "none",
              color: "#111",
              borderRadius: "8px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: 600
            }}
          >
            ← Back
          </button>

          <button
            onClick={handleContinue}
            disabled={submitting}
            style={{
              padding: "10px 25px",
              background: submitting ? "#93c5fd" : "#0066ff",
              border: "none",
              color: "white",
              borderRadius: "8px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "15px",
              fontWeight: 600
            }}
          >
            {submitting ? "Uploading..." : "Continue ➜"}
          </button>
        </div>

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "20px",
    backgroundColor: "#f3f4f6",
    borderRadius: "10px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "10px",
  },
  logo: { width: "55px", height: "55px", borderRadius: "50%" },
  title: { fontSize: "20px", fontWeight: 700, margin: 0 },
  subtitle: { fontSize: "14px", color: "#6b6b6b", margin: 0 },
  nightModeIcon: { marginLeft: "auto", fontSize: "20px", cursor: "pointer" },
  sectionTitle: { marginTop: "20px", fontWeight: 600, color: "#2563eb" },
  progressBar: {
    width: "100%",
    height: "4px",
    background: "#e5e7eb",
    borderRadius: "10px",
    marginTop: "10px",
  },
  progressFill: {
    width: "90%",
    height: "4px",
    background: "#2563eb",
    borderRadius: "10px",
  },
  progressText: { textAlign: "right", marginTop: "5px", fontSize: "13px" },
  uploadSection: { marginTop: "20px" },
  docRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  required: { fontWeight: 600 },
  fileName: { fontSize: "13px", color: "#6b7280", marginTop: "4px" },
  uploadBtn: {
    padding: "8px 16px",
    background: "#0066ff",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  removeBtn: {
    padding: "8px 16px",
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  footerText: { marginTop: "10px", fontSize: "12px", color: "#6b7280" },
};

export default Uploaddocuments;