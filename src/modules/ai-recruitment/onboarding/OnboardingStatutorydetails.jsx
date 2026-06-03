import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OnboardingStatutorydetails() {
  const [formData, setFormData] = useState({
    aadhar: "",
    pan: "",
    uan: "",
    esi: "",
  });
const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // Update progress dynamically
  useEffect(() => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(
      (val) => val.trim() !== ""
    ).length;
    setProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { aadhar, pan, uan, esi } = formData;

    if (!/^\d{12}$/.test(aadhar)) {
      toast.error("Aadhar must be a 12-digit number");
      return false;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      toast.error("PAN must be in format: ABCDE1234F");
      return false;
    }

    if (!/^\d{12}$/.test(uan)) {
      toast.error("UAN must be a 12-digit number");
      return false;
    }

    if (!/^\d{2}-\d{2}-\d{6}-\d{3}-\d{4}$/.test(esi)) {
      toast.error("ESI must be in format: 31-00-123456-000-0001");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success("Form submitted successfully ✅");
      console.log("Form Data Submitted:", formData);
    }
  };

  return (
    <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
      <div className="card shadow-sm rounded-4 border-0" style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
        <div className="card-body">
          {/* Header */}
          <div className="d-flex align-items-center mb-3">
            <img
              src="/assets/img/icons/logo-1.png"
              alt="Logo"
              className="rounded-circle me-2"
              style={{ width: "50px", height: "50px" }}
            />
            <div>
              <h5 className="mb-0">Onboarding Form: </h5>
              <small className="text-muted">
                Levitica Technologies Private Limited
              </small>
            </div>
          </div>

          {/* Progress */}
          <div className="d-flex justify-content-between mb-2">
            <h6 className="text-primary">Statutory Details</h6>
            <small className="text-muted">Step 4 of 9</small>
          </div>
          <div
            className="progress mb-2"
            style={{
              height: "6px",
              borderRadius: "10px",
              backgroundColor: "#e9ecef",
            }}
          >
            <div
              className="progress-bar bg-primary border"
              role="progressbar"
              style={{
                width: `${progress}%`,
                borderRadius: "10px",
                transition: "width 0.5s ease",
              }}
            ></div>
          </div>
          <div className="text-end mb-4">
            <small className="text-muted">{progress}% completed</small>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label className="form-label">Aadhar Number</label>
              <input
                type="text"
                className="form-control"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
                placeholder="123456789012"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">PAN Number</label>
              <input
                type="text"
                className="form-control text-uppercase"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">UAN Number</label>
              <input
                type="text"
                className="form-control"
                name="uan"
                value={formData.uan}
                onChange={handleChange}
                placeholder="123456789012"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">ESI Number</label>
              <input
                type="text"
                className="form-control"
                name="esi"
                value={formData.esi}
                onChange={handleChange}
                placeholder="31-00-123456-000-0001"
              />
            </div>

            {/* Buttons */}
            <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/onboardingPersonaldetails")}
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
                      onClick={() => navigate("/familydetails")}
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
          </form>
        </div>
      </div>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default OnboardingStatutorydetails;
