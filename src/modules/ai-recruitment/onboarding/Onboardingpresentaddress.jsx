import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL, API_ENDPOINTS } from "../../../shared/constants/api.config";

const Onboardingpresentaddress = () => {
  const totalSteps = 9;
  const [currentStep, setCurrentStep] = useState(6);
  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
  });
  const [submitting, setSubmitting] = useState(false);
const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      toast.info("⬅️ Going back to previous step...");
    } else {
      toast.warning("⚠️ Already at the first step!");
    }
  };

  const handleContinue = async () => {
    const { address1, address2, city, pincode, state, country } = formData;

    if (!address1.trim()) {
      toast.error("⚠️ Address Line 1 is required!");
      return;
    }
    if (!city.trim()) {
      toast.error("⚠️ City is required!");
      return;
    }
    if (!pincode.match(/^[0-9]{6}$/)) {
      toast.error("⚠️ Enter a valid 6-digit pincode!");
      return;
    }
    if (!state.trim()) {
      toast.error("⚠️ State is required!");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        address_line_1: address1,
        address_line_2: address2 || null,
        city,
        pincode,
        state,
        country: country || "India",
      };

      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ONBOARDING_FORMS.PRESENT_ADDRESS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Failed to save present address");
      }

      toast.success("✅ Address details saved successfully!");

      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      }
      navigate("/permanentaddress");
    } catch (err) {
      toast.error(`⚠️ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // progress %
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <img
            src="./assets/img/icons/logo-1.png"
            alt="Logo"
            className="rounded-circle me-3"
            style={{ width: "40px", height: "40px" }}
          />
          <div>
            <h6 className="mb-0">Onboarding Form: </h6>
            <small>Levitica Technologies Private Limited</small>
          </div>
        </div>

        {/* Progress Info */}
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="text-primary mb-0">Present Address</h6>
          <small className="text-muted">Step {currentStep} of {totalSteps}</small>
        </div>

        {/* Thin Progress Bar */}
        <div
          className="progress mt-2"
          style={{ height: "4px", backgroundColor: "#e9ecef" }}
        >
          <div
            className="progress-bar bg-primary border"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <p className="text-end text-muted mb-3">{progress}% completed</p>

        {/* Form */}
        <div className="mb-3">
          <label className="form-label">
            Address Line 1 <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Address Line 1"
            maxLength="100"
          />
          <div className="text-end text-muted" style={{ fontSize: "12px" }}>
            {100 - formData.address1.length} chars left
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Address Line 2</label>
          <input
            type="text"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Address Line 2"
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">
              City <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter city"
              maxLength="50"
            />
            <div className="text-end text-muted" style={{ fontSize: "12px" }}>
              {50 - formData.city.length} chars left
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Pincode <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter 6-digit pincode"
              maxLength="6"
            />
            <div className="text-end text-muted" style={{ fontSize: "12px" }}>
              {6 - formData.pincode.length} chars left
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">
              State <span className="text-danger">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select State</option>
              <option>Telangana</option>
              <option>Andhra Pradesh</option>
              <option>Karnataka</option>
              <option>Tamil Nadu</option>
              <option>Maharashtra</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              className="form-control"
              readOnly
            />
          </div>
        </div>

        {/* Buttons */}
         <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/familydetails")}
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
                        {submitting ? "Saving..." : "Continue ➜"}
                    </button>

                </div>
      </div>
    </div>
  );
};

export default Onboardingpresentaddress;
