import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OnboardingFamilydetails() {
  const navigate = useNavigate();

  const [maritalStatus, setMaritalStatus] = useState("Single");

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
          margin: "0 auto"
        }}
      >
        {/* Header */}
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

        {/* Step + Title */}
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

        {/* Progress Bar */}
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

        {/* Form */}
        <div style={{ marginTop: "25px" }}>
          {/* Marital Status */}
          <label style={{ fontWeight: 600 }}>Marital Status</label>
          <div style={{ marginTop: "5px", marginBottom: "20px" }}>
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                value="Single"
                checked={maritalStatus === "Single"}
                onChange={() => setMaritalStatus("Single")}
              />{" "}
              Single
            </label>

            <label>
              <input
                type="radio"
                value="Married"
                checked={maritalStatus === "Married"}
                onChange={() => setMaritalStatus("Married")}
              />{" "}
              Married
            </label>
          </div>

          {/* Father Name */}
          <label style={{ fontWeight: 600 }}>Father Name</label>
          <input
            type="text"
            placeholder="Enter Father Name"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#f8f9fa",
              marginTop: "5px",
            }}
          />
          <small style={{ color: "#6b7280" }}>50 chars left</small>

          {/* Father Phone + DOB */}
          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600 }}>Father Phone</label>
              <input
                type="text"
                placeholder="Enter father Phone"
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

          {/* Mother Name */}
          <div style={{ marginTop: "20px" }}>
            <label style={{ fontWeight: 600 }}>Mother Name</label>
            <input
              type="text"
              placeholder="Enter Mother Name"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#f8f9fa",
                marginTop: "5px",
              }}
            />
            <small style={{ color: "#6b7280" }}>50 chars left</small>
          </div>

          {/* Mother Phone + DOB */}
          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 600 }}>Mother Phone</label>
              <input
                type="text"
                placeholder="Enter mother Phone"
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

        {/* Buttons */}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Back */}
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

          {/* Continue */}
          <button
            onClick={() => navigate("/onboardingPresentaddress")}
            style={{
              padding: "10px 25px",
              background: "#0066ff",
              border: "none",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Continue ➜
          </button>
        </div>
      </div>
    </div>
  );
}
