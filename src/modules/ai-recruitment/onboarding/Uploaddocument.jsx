import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Uploaddocuments = () => {
  const navigate = useNavigate();
  const maxFileSizeMB = 10;

  // Documents configuration (dynamic)
  const docConfig = [
    { key: "pan", label: "PAN Card", required: true },
    { key: "uan", label: "UAN Card", required: true },
    { key: "esi", label: "ESI Card" },
    { key: "dl", label: "Driving License" },
    { key: "passport", label: "Passport" },
  ];

  const [documents, setDocuments] = useState({
    pan: null,
    uan: null,
    esi: null,
    dl: null,
    passport: null,
  });

  // Upload file handler
  const handleUpload = (key, file) => {
    if (!file) return;
    if (file.size / 1024 / 1024 > maxFileSizeMB) {
      toast.error(`❌ ${file.name} exceeds ${maxFileSizeMB} MB limit`);
      return;
    }

    setDocuments((prev) => ({ ...prev, [key]: file.name }));
    toast.success(`✅ ${file.name} uploaded successfully`);
  };

  // Remove file handler
  const handleRemove = (key) => {
    setDocuments((prev) => ({ ...prev, [key]: null }));
    toast.info("📌 File removed");
  };

  // Back button handler
  const handleBack = () => {
    toast.info("🔙 Going back...");
    navigate(-1); // or navigate("/step10")
  };

  // Continue button handler with validation
  const handleContinue = () => {
    // Check required docs
    for (const doc of docConfig) {
      if (doc.required && !documents[doc.key]) {
        toast.error(`❌ ${doc.label} is required`);
        return;
      }
    }

    console.log("Uploaded documents:", documents);
    toast.success("🎉 All documents submitted successfully");
    navigate("/dashboard"); // or your next step route
  };

  // Render a document row dynamically
  const renderRow = (doc) => (
    <div key={doc.key} style={styles.docRow}>
      <div>
        <span style={doc.required ? styles.required : {}}>{doc.label}</span>
        <div style={styles.fileName}>
          {documents[doc.key] ? documents[doc.key] : "No file selected"}
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
          <h3 style={styles.title}>Onboarding Form: Chandu Thota</h3>
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

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/onboardingbankdetails")}
                        style={{
                            padding: "10px 25px",
                            background: "#e5e7eb",
                            border: "none",
                            color: "#111",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: 600
                        }}
                    >
                        ← Back
                    </button>

                    {/* Continue Button */}
                    <button
                      onClick={() => navigate("/final")}
                        style={{
                            padding: "10px 25px",
                            background: "#0066ff",
                            border: "none",
                            color: "white",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: 600
                        }}
                    >
                        Continue ➜
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
    marginBottom: "20px",
    justifyContent: "space-between",
  },
  logo: {
    height: "40px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#555",
  },
  nightModeIcon: {
    fontSize: "20px",
  },
  sectionTitle: {
    color: "#2563eb",
    // borderBottom: "2px solid #2563eb",
    paddingBottom: "5px",
  },
  progressBar: {
    backgroundColor: "#e5e7eb",
    height: "6px",
    borderRadius: "5px",
    marginTop: "10px",
  },
  progressFill: {
    width: "90%",
    height: "6px",
    backgroundColor: "#2563eb",
    borderRadius: "5px",
  },
  progressText: {
    fontSize: "12px",
    color: "#555",
    marginTop: "6px",
  },
  uploadSection: {
    marginTop: "20px",
  },
  docRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
    padding: "10px 0",
  },
  fileName: {
    fontSize: "12px",
    color: "#666",
  },
  required: {
    color: "#000",
    fontWeight: "bold",
  },
  uploadBtn: {
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  removeBtn: {
    color: "#ef4444",
    cursor: "pointer",
    fontSize: "14px",
    background: "none",
    border: "none",
    fontWeight: "bold",
  },
  footerText: {
    fontSize: "12px",
    color: "#777",
    marginTop: "10px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  backBtn: {
    backgroundColor: "#e5e7eb",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  continueBtn: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Uploaddocuments;
