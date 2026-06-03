import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NewOnboardingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.editMode || false;
  const existingFormData = location.state?.formData || null;
  const formId = location.state?.formId || null;

  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    mobile: "",
    mobileVerification: true,
    panVerification: false,
    bankVerification: false,
    aadhaarVerification: false
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load existing form data when in edit mode
  useEffect(() => {
    if (editMode && existingFormData) {
      setFormData({
        candidateName: existingFormData.candidate || "",
        email: existingFormData.email || "",
        mobile: existingFormData.mobile || "",
        mobileVerification: existingFormData.verificationOptions?.mobile ?? true,
        panVerification: existingFormData.verificationOptions?.pan ?? false,
        bankVerification: existingFormData.verificationOptions?.bank ?? false,
        aadhaarVerification: existingFormData.verificationOptions?.aadhaar ?? false
      });
    }
  }, [editMode, existingFormData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    
    if (!formData.candidateName || !formData.email || !formData.mobile) {
      alert("Please fill all required fields!");
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const handleSubmit = () => {
    if (editMode && formId) {
      // Update existing form entry
      const updatedForm = {
        id: formId,
        candidate: formData.candidateName,
        created: existingFormData?.created || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        email: formData.email,
        mobile: formData.mobile,
        info: "View Form",
        status: existingFormData?.status || "Pending",
        verificationOptions: {
          mobile: formData.mobileVerification,
          pan: formData.panVerification,
          bank: formData.bankVerification,
          aadhaar: formData.aadhaarVerification
        }
      };

      // Navigate back to forms list with updated form data
      navigate("/onboarding/pre-joining", {
        state: { updatedForm, formId }
      });
    } else {
      // Create new form entry
      const newForm = {
        id: Date.now(),
        candidate: formData.candidateName,
        created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        email: formData.email,
        mobile: formData.mobile,
        info: "View Form",
        status: "Pending",
        verificationOptions: {
          mobile: formData.mobileVerification,
          pan: formData.panVerification,
          bank: formData.bankVerification,
          aadhaar: formData.aadhaarVerification
        }
      };

      // Navigate back to forms list with new form data
      navigate("/onboarding/pre-joining", {
        state: { newForm }
      });
    }
  };

  return (
    <div className="page-content" style={{ padding: "30px 0" }}>
      <div className="container-fluid">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb" style={{ marginBottom: 0 }}>
            <li className="breadcrumb-item">
              <Link to="/dashboard/overviews" style={{ color: "#6B7280", textDecoration: "none" }}>
                Dashboard
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/onboarding" style={{ color: "#6B7280", textDecoration: "none" }}>
                Onboarding
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: "#1F2937" }}>
              {editMode ? "Edit Form" : "New Form"}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-4">
          <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, color: "#1F2937" }}>
            {editMode ? "Edit Form" : "New Form"}
          </h2>
          <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 0 }}>
            {editMode 
              ? "Update the onboarding form details for the candidate."
              : "Generate and send self-onboarding form to a candidate."
            }
          </p>
        </div>

        {/* Form Card */}
        <div className="card" style={{ borderRadius: 12, border: "1px solid #E5E7EB" }}>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Left Section: Candidate Details */}
                <div className="col-md-6">
                  <h5 className="fw-bold mb-4" style={{ color: "#1F2937" }}>
                    Part A - Candidate Details
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Candidate Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleChange}
                      placeholder="Enter candidate name"
                      required
                      style={{
                        borderRadius: 8,
                        border: "1px solid #D1D5DB",
                        padding: "10px 12px"
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      E-Mail Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      style={{
                        borderRadius: 8,
                        border: "1px solid #D1D5DB",
                        padding: "10px 12px"
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      maxLength="10"
                      style={{
                        borderRadius: 8,
                        border: "1px solid #D1D5DB",
                        padding: "10px 12px"
                      }}
                    />
                  </div>
                </div>

                {/* Right Section: Verification Options */}
                <div className="col-md-6">
                  <h5 className="fw-bold mb-4" style={{ color: "#1F2937" }}>
                    Select Verification Options
                  </h5>

                  <div className="mb-3">
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="mobileVerification"
                        id="mobileVerification"
                        checked={formData.mobileVerification}
                        onChange={handleChange}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <label className="form-check-label ms-2" htmlFor="mobileVerification" style={{ cursor: "pointer" }}>
                        <span className="fw-semibold">Mobile Verification</span> - <span className="text-success">FREE</span>
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="panVerification"
                        id="panVerification"
                        checked={formData.panVerification}
                        onChange={handleChange}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <label className="form-check-label ms-2" htmlFor="panVerification" style={{ cursor: "pointer" }}>
                        <span className="fw-semibold">PAN Verification</span> - <span className="text-warning">5 Credits</span>
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="bankVerification"
                        id="bankVerification"
                        checked={formData.bankVerification}
                        onChange={handleChange}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <label className="form-check-label ms-2" htmlFor="bankVerification" style={{ cursor: "pointer" }}>
                        <span className="fw-semibold">Bank Verification</span> - <span className="text-warning">5 Credits</span>
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="aadhaarVerification"
                        id="aadhaarVerification"
                        checked={formData.aadhaarVerification}
                        onChange={handleChange}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <label className="form-check-label ms-2" htmlFor="aadhaarVerification" style={{ cursor: "pointer" }}>
                        <span className="fw-semibold">Aadhaar Verification</span> - <span className="text-warning">10 Credits</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 p-3" style={{ background: "#F9FAFB", borderRadius: 8 }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted">Credit Balance:</span>
                      <span className="fw-bold">₹0</span>
                    </div>
                    <a 
                      href="#" 
                      className="text-primary text-decoration-none mt-2 d-inline-block"
                      style={{ fontSize: 14 }}
                    >
                      Buy Credits
                    </a>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="mt-4 pt-3 border-top">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="btn btn-primary"
                  style={{
                    borderRadius: 8,
                    padding: "10px 30px",
                    fontWeight: 500
                  }}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div 
            className="modal show d-block" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: 12, border: "none" }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold" style={{ fontSize: 20, color: "#1F2937" }}>
                    Confirmation
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCancel}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body pt-3">
                  <div className="d-flex align-items-center mb-3">
                    <Icon 
                      icon="heroicons:exclamation-triangle" 
                      className="text-warning me-3"
                      style={{ fontSize: 32 }}
                    />
                    <p className="mb-0" style={{ fontSize: 16, color: "#374151" }}>
                      Are You Sure?
                    </p>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                    {editMode 
                      ? "Do you want to save the changes to this form?"
                      : "Do you want to submit this form and add it to the forms table?"
                    }
                  </p>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    style={{
                      borderRadius: 8,
                      padding: "8px 24px",
                      fontWeight: 500
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    style={{
                      borderRadius: 8,
                      padding: "8px 24px",
                      fontWeight: 500
                    }}
                  >
                    {editMode ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewOnboardingForm;

