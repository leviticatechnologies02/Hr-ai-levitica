import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL, API_ENDPOINTS } from "../../../shared/constants/api.config";

export default function OnboardingFamilydetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    maritalStatus: "Single",
    fatherName: "",
    fatherPhone: "",
    fatherDob: "",
    motherName: "",
    motherPhone: "",
    motherDob: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    setSubmitting(true);
    try {
      const payload = {
        marital_status: formData.maritalStatus,
        father_name: formData.fatherName || null,
        father_phone: formData.fatherPhone || null,
        father_dob: formData.fatherDob || null,
        mother_name: formData.motherName || null,
        mother_phone: formData.motherPhone || null,
        mother_dob: formData.motherDob || null,
      };

      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ONBOARDING_FORMS.FAMILY_DETAILS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Failed to save family details");
      }

      toast.success("✅ Family details saved successfully!");
      navigate("/onboardingPresentaddress");
    } catch (err) {
      toast.error(`⚠️ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "#fff",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          margin: "0 auto"
        }}
      >

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src="/assets/img/icons/logo-1.png"
            alt="logo"
            style={{ width: "55px", height: "55px", borderRadius: "50%" }}
          />

          <div>
            <div style={{ fontSize: "20px", fontWeight: "700" }}>
              Onboarding Form: Test
            </div>
            <div style={{ fontSize: "14px", color: "#6b6b6b" }}>
              Levitica Technologies Private Limited
            </div>
          </div>

          <div
            style={{
              marginLeft: "auto",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            🌙
          </div>
        </div>


        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #dedede",
            paddingBottom: "8px",
            marginTop: "20px",
          }}
        >
          <div style={{ fontSize: "17px", fontWeight: "600", color: "#2563eb" }}>
            Family Details
          </div>
          <div style={{ color: "#666" }}>Step 5 of 9</div>
        </div>


        <div style={{ marginTop: "10px" }}>
          <div
            style={{
              width: "100%",
              height: "4px",
              background: "#e5e7eb",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                width: "50%",
                height: "4px",
                background: "#2563eb",
                borderRadius: "10px",
              }}
            ></div>
          </div>
          <div style={{ textAlign: "right", marginTop: "5px", fontSize: "13px" }}>
            50% completed
          </div>
        </div>


        <div style={{ marginTop: "25px" }}>

          <label style={{ fontWeight: 600 }}>Marital Status</label>
          <div style={{ marginTop: "5px", marginBottom: "20px" }}>
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                value="Single"
                checked={formData.maritalStatus === "Single"}
                onChange={() => handleChange("maritalStatus", "Single")}
              />{" "}
              Single
            </label>

            <label>
              <input
                type="radio"
                value="Married"
                checked={formData.maritalStatus === "Married"}
                onChange={() => handleChange("maritalStatus", "Married")}
              />{" "}
              Married
            </label>
          </div>


          <label style={{ fontWeight: 600 }}>Father Name</label>
          <input
            type="text"
            placeholder="Enter Father Name"
            value={formData.fatherName}
            onChange={(e) => handleChange("fatherName", e.target.value.slice(0, 50))}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#f8f9fa",
              marginTop: "5px",
            }}
          />
          <small style={{ color: "#6b7280" }}>{50 - formData.fatherName.length} chars left</small>


          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600 }}>Father Phone</label>
              <input
                type="text"
                placeholder="Enter father Phone"
                value={formData.fatherPhone}
                onChange={(e) => handleChange("fatherPhone", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#f8f9fa",
                  marginTop: "5px",
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600 }}>Father Date of Birth</label>
              <input
                type="date"
                value={formData.fatherDob}
                onChange={(e) => handleChange("fatherDob", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#f8f9fa",
                  marginTop: "5px",
                }}
              />
            </div>
          </div>


          <div style={{ marginTop: "20px" }}>
            <label style={{ fontWeight: 600 }}>Mother Name</label>
            <input
              type="text"
              placeholder="Enter Mother Name"
              value={formData.motherName}
              onChange={(e) => handleChange("motherName", e.target.value.slice(0, 50))}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#f8f9fa",
                marginTop: "5px",
              }}
            />
            <small style={{ color: "#6b7280" }}>{50 - formData.motherName.length} chars left</small>
          </div>


          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600 }}>Mother Phone</label>
              <input
                type="text"
                placeholder="Enter mother Phone"
                value={formData.motherPhone}
                onChange={(e) => handleChange("motherPhone", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#f8f9fa",
                  marginTop: "5px",
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600 }}>Mother Date of Birth</label>
              <input
                type="date"
                value={formData.motherDob}
                onChange={(e) => handleChange("motherDob", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#f8f9fa",
                  marginTop: "5px",
                }}
              />
            </div>
          </div>
        </div>


        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >

          <button
            onClick={() => navigate("/onboardingstatutorydetails")}
            style={{
              padding: "10px 25px",
              background: "#e5e7eb",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
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
            }}
          >
            {submitting ? "Saving..." : "Continue ➜"}
          </button>
        </div>
      </div>
    </div>
  );
}
