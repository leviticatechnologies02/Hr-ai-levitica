import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Onboardingbankdetails = () => {
  
  const totalSteps = 9;
  const currentStep = 8;

  const [formData, setFormData] = useState({
    bankName: "",
    ifscCode: "",
    accountNumber: "",
    accountHolder: "",
  });
 const navigate = useNavigate();

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // handle Continue button
  const handleContinue = () => {
    const { bankName, ifscCode, accountNumber, accountHolder } = formData;

    if (!bankName || !ifscCode || !accountNumber || !accountHolder) {
      toast.error("⚠️ Please fill all required fields!");
      return;
    }

    toast.success("✅ Bank details saved successfully!");
  };

  // handle Back button
  const handleBack = () => {
    toast.info("⬅️ Going back to previous step...");
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
            src="../assets/img/icons/logo-1.png"
            alt="Logo"
            className="rounded-circle me-3"
            style={{ width: "50px", height: "50px" }}
          />
          <div>
            <h6 className="mb-0">Onboarding Form: Chandu Thota</h6>
            <small>Levitica Technologies Private Limited</small>
          </div>
        </div>

        <hr />

        {/* Progress */}
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="text-primary mb-0">Bank Details</h6>
          <small className="text-muted">Step {currentStep} of {totalSteps}</small>
        </div>

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
        <div className="d-flex justify-content-between gap-2">
          {/* Bank Name */}
          <div className="mb-3 w-50">
            <label className="form-label">
              Bank Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter Bank Name"
              maxLength="50"
            />
            <div className="text-end text-muted" style={{ fontSize: "12px" }}>
              {50 - formData.bankName.length} left
            </div>
          </div>

          {/* IFSC Code */}
          <div className="mb-3 w-50">
            <label className="form-label ">
              IFSC Code <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter IFSC Code"
              maxLength="11"
            />
            <div className="text-end text-muted" style={{ fontSize: "12px" }}>
              {11 - formData.ifscCode.length} left
            </div>
          </div>
        </div>

        {/* Account Number */}
        <div className="mb-3">
          <label className="form-label">
            Account Number <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Account Number"
            maxLength="20"
          />
          <div className="text-end text-muted" style={{ fontSize: "12px" }}>
            {20 - formData.accountNumber.length} left
          </div>
        </div>

        {/* Account Holder */}
        <div className="mb-3 w-25">
          <label className="form-label">
            Account Holder Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="accountHolder"
            value={formData.accountHolder}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Account Holder Name"
          />
        </div>

        {/* Buttons */}
          <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/permanentaddress")}
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
                      onClick={() => navigate("/uploaddocument")}
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
      </div>
    </div>
  );
};

export default Onboardingbankdetails;
