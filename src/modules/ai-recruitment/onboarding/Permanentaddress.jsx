import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL, API_ENDPOINTS } from "../../../shared/constants/api.config";

const Permanentaddress = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
  });
  const [submitting, setSubmitting] = useState(false);

  const maxAddressChars = 100;
  const maxCityChars = 50;
  const maxPincodeChars = 6;

  const handleChange = (field, value) => {
    if (field === "pincode" && value.length > maxPincodeChars) return;
    if (field === "city" && value.length > maxCityChars) return;
    if (field === "address1" && value.length > maxAddressChars) return;

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // NOTE: "copy present address" needs the present-address record to be
  // fetched from the backend (GET /present-address/{id}); the wizard does
  // not currently carry an address_id between steps, so this is left as a
  // manual re-entry step for now rather than faking a copy with placeholder data.

  const handleBack = () => {
    toast.info("Going back to previous step...");
    navigate(-1);
  };

  const handleContinue = async () => {
    if (!formData.address1 || !formData.city || !formData.pincode || !formData.state) {
      toast.error("Please fill all required fields ❌");
      return;
    }
    if (formData.pincode.length !== 6) {
      toast.error("Pincode must be 6 digits ❌");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        address_line_1: formData.address1,
        address_line_2: formData.address2 || null,
        city: formData.city,
        pincode: formData.pincode,
        state: formData.state,
        country: formData.country || "India",
      };

      const response = await fetch(`${BASE_URL}${API_ENDPOINTS.ONBOARDING_FORMS.PERMANENT_ADDRESS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail ? JSON.stringify(err.detail) : "Failed to save permanent address");
      }

      toast.success("Permanent address saved successfully 🎉");
      navigate("/onboardingbankdetails");
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-content" style={{ padding: "40px 20px", display: "flex", justifyContent: "center", background: "#f5f7fa", minHeight: "100vh" }}>
      <div className="content bg-light p-4 rounded shadow-sm" style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <img src="/assets/img/icons/logo-1.png" alt="Logo" style={{ height: "40px" }} />
        <div>
          <h3 className="fw-bold mb-0">Onboarding Form: Chandu Thota</h3>
          <p className="text-muted mb-0">Levitica Technologies Private Limited</p>
        </div>
        <div className="fs-5">🌙</div>
      </div>

      {/* Section Title */}
      <h4 className="text-primary border-bottom pb-2">Permanent Address</h4>

      {/* Progress Bar */}
      <div className="progress my-2" style={{ height: "6px" }}>
        <div className="progress-bar bg-primary" style={{ width: "70%" }}></div>
      </div>
      <div className="d-flex justify-content-between text-muted small">
        <span>Step 7 of 9</span>
        <span>70% completed</span>
      </div>

      {/* Form Fields */}
      <div className="mb-3">
        <label className="form-label">
          Address Line 1 <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={formData.address1}
          onChange={(e) => handleChange("address1", e.target.value)}
          className="form-control"
        />
        <div className="form-text">
          {maxAddressChars - formData.address1.length} chars left
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Address Line 2</label>
        <input
          type="text"
          value={formData.address2}
          onChange={(e) => handleChange("address2", e.target.value)}
          className="form-control"
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">
            City <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="form-control"
          />
          <div className="form-text">
            {maxCityChars - formData.city.length} chars left
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">
            Pincode <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            value={formData.pincode}
            onChange={(e) => handleChange("pincode", e.target.value)}
            className="form-control"
          />
          <div className="form-text">
            {Math.max(0, maxPincodeChars - formData.pincode.length)} chars left
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">
            State <span className="text-danger">*</span>
          </label>
          <select
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            className="form-select"
          >
            <option>Telangana</option>
            <option>Andhra Pradesh</option>
            <option>Karnataka</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Country</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      {/* Buttons */}
      {/* <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={handleBack}>
          ← Back
        </button>
        <button className="btn btn-success" onClick={copyPresentAddress}>
          Copy Present Address 📋
        </button>
        <button className="btn btn-primary" onClick={handleContinue}>
          Continue ➜
        </button>
      </div> */}
       <div style={{ marginTop: "25px", display: "flex", justifyContent: "space-between" }}>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/onboardingpresentaddress")}
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
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Permanentaddress;
