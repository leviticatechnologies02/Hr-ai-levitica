import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OnboardingPersonaldetails() {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    passport: "",
    drivingLicense: "",
  });
const navigate = useNavigate();

  const [progress, setProgress] = useState(0);

  // Update progress dynamically based on filled fields
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

  // Field-level validation on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "bloodGroup" && !value) {
      toast.error("Please select your Blood Group");
    }

    if (name === "passport" && value && !/^[A-PR-WYa-pr-wy][1-9]\d{6}$/.test(value)) {
      toast.error("Passport must be in format: A1234567");
    }

    if (name === "drivingLicense" && value && !/^[A-Z]{2}-\d{13}$/.test(value)) {
      toast.error("Driving License must be in format: MH-1234567890123");
    }
  };

  // Final validation before submit
  const validateForm = () => {
    const { bloodGroup, passport, drivingLicense } = formData;

    if (!bloodGroup) {
      toast.error("Please select your Blood Group");
      return false;
    }

    if (!/^[A-PR-WYa-pr-wy][1-9]\d{6}$/.test(passport)) {
      toast.error("Passport must be in format: A1234567");
      return false;
    }

    if (!/^[A-Z]{2}-\d{13}$/.test(drivingLicense)) {
      toast.error("Driving License must be in format: MH-1234567890123");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success("Personal details submitted successfully ✅");
      console.log("Form Data Submitted:", formData);
    }
  };

  return (
    <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
      <div className="card shadow-sm rounded-4" style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
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
            <h6 className="text-primary">Personal Information</h6>
            <small className="text-muted">Step 3 of 9</small>
          </div>
          <div
            className="progress mb-4"
            style={{ height: "6px", borderRadius: "10px", backgroundColor: "#e9ecef" }}
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
          <div className="text-end">
            <small className="text-muted">{progress}% completed</small>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Blood Group */}
            <div className="mb-3 text-start">
              <label className="form-label">Blood Group</label>
              <select
                className="form-control"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Passport */}
            <div className="mb-3 text-start">
              <label className="form-label">Passport Number</label>
              <input
                type="text"
                className="form-control text-uppercase"
                name="passport"
                value={formData.passport}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="A1234567"
              />
            </div>

            {/* Driving License */}
            <div className="mb-3 text-start">
              <label className="form-label">Driving License Number</label>
              <input
                type="text"
                className="form-control text-uppercase"
                name="drivingLicense"
                value={formData.drivingLicense}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="MH-1234567890123"
              />
            </div>

            {/* Buttons */}
             <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/onboardingcontactdetails")}
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
                      onClick={() => navigate("/onboardingstatutorydetails")}
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

export default OnboardingPersonaldetails;
