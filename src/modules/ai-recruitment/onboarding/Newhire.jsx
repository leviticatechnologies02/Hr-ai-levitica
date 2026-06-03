import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Newhire = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start at step 0 (welcome card)
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get candidate data from navigation state or use default
  const candidateName = location.state?.candidateName || "Priya Singh";
  const companyName = "Levitica Technologies Private Limited";

  // ===== ALL FORM STATES =====
  // Step 1: Basic Details
  const [profilePic, setProfilePic] = useState(null);
  const [basicData, setBasicData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: ""
  });
  const [basicErrors, setBasicErrors] = useState({});

  // Step 2: Contact Details
  const [contactData, setContactData] = useState({
    mobile: "",
    email: "",
    homePhone: "",
    emergencyContact: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Step 3: Personal Information
  const [personalData, setPersonalData] = useState({
    bloodGroup: "",
    passport: "",
    drivingLicense: "",
  });

  // Step 4: Statutory Details
  const [statutoryData, setStatutoryData] = useState({
    aadhar: "",
    pan: "",
    uan: "",
    esi: "",
  });
  const [statutoryErrors, setStatutoryErrors] = useState({
    aadhar: "",
    pan: "",
  });

  // Step 5: Family Details
  const [maritalStatus, setMaritalStatus] = useState("");
  const [familyData, setFamilyData] = useState({
    fatherName: "",
    fatherPhone: "",
    fatherDOB: "",
    motherName: "",
    motherPhone: "",
    motherDOB: ""
  });

  // Step 6: Present Address
  const [presentAddress, setPresentAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
  });

  // Step 7: Permanent Address
  const [permanentAddress, setPermanentAddress] = useState({
    address1: "2-21/A BC WADA",
    address2: "Sardhapor",
    city: "Sircilla",
    pincode: "505301",
    state: "Telangana",
    country: "India",
  });

  // Step 8: Bank Details
  const [bankData, setBankData] = useState({
    bankName: "",
    ifscCode: "",
    accountNumber: "",
    accountHolder: "",
  });

  // Step 9: Documents
  const [documents, setDocuments] = useState({
    pan: null,
    uan: null,
    esi: null,
    dl: null,
    passport: null,
  });

  // ===== HANDLERS =====
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setProfilePic(URL.createObjectURL(file));
      toast.success("Profile photo uploaded successfully!");
    }
  };

  // Step navigation
  const goToStep = (step) => {
    if (step < 0) step = 0;
    if (step > 10) step = 10;
    setCurrentStep(step);
  };

  const nextStep = () => {
    // For step 0 (welcome card), just move to step 1 without validation
    if (currentStep === 0) {
      setCurrentStep(1);
      toast.success("Starting onboarding process!");
      return;
    }
    
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
      toast.success(`Moving to step ${currentStep + 1}`);
    } else {
      handleFinalSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      toast.info(`Going back to step ${currentStep - 1}`);
    }
  };

  // ===== VALIDATION FUNCTIONS =====
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return validateBasicDetails();
      case 2:
        return validateContactDetails();
      case 4:
        return validateStatutoryDetails();
      case 6:
        return validateAddress(presentAddress, "present");
      case 7:
        return validateAddress(permanentAddress, "permanent");
      case 8:
        return validateBankDetails();
      case 9:
        return validateDocuments();
      default:
        return true; // Other steps are optional
    }
  };

  const validateBasicDetails = () => {
    const newErrors = {};
    
    if (!basicData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!basicData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!basicData.gender) {
      newErrors.gender = "Please select gender";
    }
    if (!basicData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const today = new Date();
      const birthDate = new Date(basicData.dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dob = "Must be at least 18 years old";
      }
    }

    setBasicErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields correctly");
      return false;
    }
    
    toast.success("Basic details saved!");
    return true;
  };

  const validateContactDetails = () => {
    if (!otpVerified) {
      toast.error("Please verify your mobile number before continuing!");
      return false;
    }
    if (!contactData.email.includes("@")) {
      toast.error("Enter a valid email address!");
      return false;
    }
    toast.success("Contact details saved!");
    return true;
  };

  const validateStatutoryDetails = () => {
    const newErrors = {};
    let isValid = true;

    if (!statutoryData.aadhar.trim()) {
      newErrors.aadhar = "Aadhar Number is required";
      isValid = false;
    } else if (!/^\d{12}$/.test(statutoryData.aadhar)) {
      newErrors.aadhar = "Aadhar must be exactly 12 digits";
      isValid = false;
    }

    if (!statutoryData.pan.trim()) {
      newErrors.pan = "PAN Number is required";
      isValid = false;
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(statutoryData.pan)) {
      newErrors.pan = "PAN must be 10 characters (e.g., ABCDE1234F)";
      isValid = false;
    }

    setStatutoryErrors(newErrors);
    
    if (!isValid) {
      toast.error("Please fill all mandatory fields correctly");
      return false;
    }
    
    toast.success("Statutory details saved!");
    return true;
  };

  const validateAddress = (address, type) => {
    const { address1, city, pincode, state, country } = address;

    if (!address1.trim()) {
      toast.error("Address Line 1 is required!");
      return false;
    }
    if (!city.trim()) {
      toast.error("City is required!");
      return false;
    }
    if (!pincode.match(/^\d{6}$/)) {
      toast.error("Enter a valid 6-digit pincode!");
      return false;
    }
    if (!state.trim()) {
      toast.error("State is required!");
      return false;
    }
    if (!country.trim()) {
      toast.error("Country is required!");
      return false;
    }

    toast.success(`${type === 'present' ? 'Present' : 'Permanent'} address saved!`);
    return true;
  };

  const validateBankDetails = () => {
    const { bankName, ifscCode, accountNumber, accountHolder } = bankData;

    if (!bankName.trim()) {
      toast.error("Bank Name is required!");
      return false;
    }
    if (!ifscCode.trim()) {
      toast.error("IFSC Code is required!");
      return false;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      toast.error("IFSC Code must be 11 alphanumeric characters (e.g., SBIN0001234)");
      return false;
    }
    if (!accountNumber.trim()) {
      toast.error("Account Number is required!");
      return false;
    }
    if (!/^\d{9,18}$/.test(accountNumber)) {
      toast.error("Account Number must be 9-18 digits");
      return false;
    }
    if (!accountHolder.trim()) {
      toast.error("Account Holder Name is required!");
      return false;
    }

    toast.success("Bank details saved!");
    return true;
  };

  const validateDocuments = () => {
    const requiredDocs = [
      { key: "Xth", label: "10th Marksheet" },
      { key: "XIIth", label: "12th Marksheet" },
      { key: "graduation", label: "Graduation Certificate" },
      { key: "photo", label: "Photograph" },
      { key: "aadhar", label: "Aadhar Card" },
      { key: "pan", label: "PAN Card" }
    ];

    for (const doc of requiredDocs) {
      if (!documents[doc.key]) {
        toast.error(`${doc.label} is required`);
        return false;
      }
    }

    toast.success("Documents validated!");
    return true;
  };

  // ===== SPECIAL HANDLERS =====
  const handleSendOtp = () => {
    if (contactData.mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number!");
      return;
    }
    setOtpSent(true);
    toast.success(`OTP sent to ${contactData.mobile}`);
  };

  const handleVerifyOtp = () => {
    if (!otpSent) {
      toast.warning("Please send OTP first!");
      return;
    }
    setOtpVerified(true);
    toast.success("Mobile number verified!");
  };

  const copyPresentAddress = () => {
    setPermanentAddress(presentAddress);
    toast.success("Present address copied to permanent address!");
  };

  const handleUpload = (key, file) => {
    if (!file) return;
    if (file.size / 1024 / 1024 > 10) {
      toast.error(`${file.name} exceeds 10 MB limit`);
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG, and PNG files are allowed");
      return;
    }

    setDocuments((prev) => ({ ...prev, [key]: { name: file.name, size: file.size } }));
    toast.success(`${file.name} uploaded successfully`);
  };

  const handleRemove = (key) => {
    setDocuments((prev) => ({ ...prev, [key]: null }));
    toast.info("File removed");
  };

  const handleFinalSubmit = () => {
    toast.success("🎉 Onboarding Completed Successfully!");
    setTimeout(() => {
      navigate("/onboarding/pre-joining");
    }, 1500);
  };

  // ===== RENDER STEP CONTENT =====
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderWelcomeCard();
      case 1:
        return renderBasicDetails();
      case 2:
        return renderContactDetails();
      case 3:
        return renderPersonalDetails();
      case 4:
        return renderStatutoryDetails();
      case 5:
        return renderFamilyDetails();
      case 6:
        return renderAddress("Present Address", presentAddress, setPresentAddress);
      case 7:
        return renderAddress("Permanent Address", permanentAddress, setPermanentAddress, true);
      case 8:
        return renderBankDetails();
      case 9:
        return renderDocuments();
      case 10:
        return renderCompletion();
      default:
        return null;
    }
  };


  // ===== STEP RENDER FUNCTIONS =====
  const renderWelcomeCard = () => (
    <div style={{ 
      minHeight: "100vh", 
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif",
      transition: "background-color 0.3s ease"
    }}>
      <div style={{ 
        maxWidth: "900px", 
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease"
      }}>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start",
          marginBottom: "40px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img
              src="/assets/images/auth/auth-img.png"
              alt="Levitica Logo"
              style={{ height: "50px", width: "50px", objectFit: "contain" }}
            />
            <div>
              <h4 style={{ 
                margin: 0, 
                fontSize: "20px", 
                fontWeight: "700", 
                color: "#1F2937",
                transition: "color 0.3s ease"
              }}>
                {companyName}
              </h4>
              <p style={{ 
                margin: "4px 0 0 0", 
                fontSize: "14px", 
                color: "#6B7280",
                fontWeight: "500",
                transition: "color 0.3s ease"
              }}>
                New Hire Onboarding
              </p>
            </div>
          </div>
        </div>

        {/* Greeting Section */}
        <div style={{ marginBottom: "30px" }}>
          <h5 style={{ 
            color: "#2563EB", 
            fontSize: "28px", 
            fontWeight: "600", 
            marginBottom: "12px",
            transition: "color 0.3s ease"
          }}>
            Welcome, {candidateName}!
          </h5>
          <p style={{ 
            fontSize: "16px", 
            color: "#1F2937",
            marginBottom: "8px",
            lineHeight: "1.6",
            transition: "color 0.3s ease"
          }}>
            <strong>{companyName}</strong> welcomes you onboard!
          </p>
          <p style={{ 
            fontSize: "15px", 
            color: "#4B5563",
            lineHeight: "1.6",
            marginBottom: "30px",
            transition: "color 0.3s ease"
          }}>
            Grab your personal details and keep your documents handy. When ready, click the Continue button to start your onboarding.
          </p>
        </div>

        {/* Continue Button */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <button
            onClick={nextStep}
            style={{
              padding: "14px 40px",
              background: "#0066ff",
              border: "none",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 600,
              transition: "background-color 0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.background = "#0052cc"}
            onMouseOut={(e) => e.target.style.background = "#0066ff"}
          >
            Continue →
          </button>
        </div>

        {/* Notes Section */}
        <div style={{ 
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#F9FAFB",
          borderRadius: "8px",
          transition: "all 0.3s ease"
        }}>
          <p style={{ 
            fontWeight: "600", 
            fontSize: "15px",
             color: "#1F2937",
            marginBottom: "12px",
            transition: "color 0.3s ease"
          }}>
            Notes:
          </p>
          <ul style={{ 
            margin: 0, 
            paddingLeft: "20px",
            listStyle: "disc",
            color: "#4B5563",
            fontSize: "14px",
            lineHeight: "1.8",
            transition: "color 0.3s ease"
          }}>
            <li style={{ marginBottom: "8px" }}>
              There are total 11 sections in this onboarding form.
            </li>
            <li style={{ marginBottom: "8px" }}>
              Your progress will be saved at every step.
            </li>
            <li>
              You can return to this form anytime by using the link provided in your email.
            </li>
          </ul>
        </div>

        {/* Footer */}
        <hr style={{ 
          margin: "40px 0 20px 0", 
          border: "none",
          borderTop: "1px solid #E5E7EB",
          transition: "border-color 0.3s ease"
        }} />
        
        <div style={{ 
          textAlign: "center", 
          fontSize: "14px",
          color: "#6B7280",
          transition: "color 0.3s ease"
        }}>
          <p style={{ 
            marginBottom: "12px",
            fontWeight: "500"
          }}>
            Powered by
          </p>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            gap: "8px",
            marginBottom: "8px"
          }}>
            <img
              src="/assets/images/auth/auth-img.png"
              alt="Runtime HRMS"
              style={{ height: "5%", width: "5%", objectFit: "contain" }}
            /> 
            <span style={{ 
              fontWeight: "600", 
              color: "#2563EB",
              transition: "color 0.3s ease"
            }}>
              Runtime HRMS
            </span>
          </div>
          <a 
            href="https://designcareermetrics.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color:  "#2563EB",
              textDecoration: "none",
              fontSize: "13px",
              transition: "color 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = "underline";
              e.target.style.color = "#1D4ED8";
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = "none";
              e.target.style.color = "#2563EB";
            }}
          >
            Visit us: www.designcareermetrics.com
          </a>
        </div>
        
      </div>

      {/* Toastify Container */}
    </div>
  );

  const renderBasicDetails = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
        {/* First Name */}
        <div>
          <label style={{ fontWeight: 600, color: "#1F2937", marginBottom: "8px", display: "block" }}>
            First Name <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            type="text"
            value={basicData.firstName}
            onChange={(e) => setBasicData({...basicData, firstName: e.target.value})}
            placeholder="Enter first name"
            style={inputStyle(basicErrors.firstName)}
          />
          {basicErrors.firstName && <div style={errorStyle}>{basicErrors.firstName}</div>}
          <small style={charCountStyle}>{100 - basicData.firstName.length} chars left</small>
        </div>

        {/* Photo Upload */}
        <div style={{ textAlign: "center" }}>
          <label style={{ cursor: "pointer", display: "inline-block" }}>
            {profilePic ? (
              <img src={profilePic} alt="profile" style={profileImageStyle} />
            ) : (
              <div style={profilePlaceholderStyle}>
                <i className="bi bi-person-circle"></i>
              </div>
            )}
          </label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} id="uploadInput" />
          <label htmlFor="uploadInput" style={uploadLabelStyle}>
            Upload your photo
          </label>
        </div>

        {/* Middle Name */}
        <div>
          <label style={labelStyle}>Middle Name</label>
          <input
            type="text"
            value={basicData.middleName}
            onChange={(e) => setBasicData({...basicData, middleName: e.target.value})}
            placeholder="Enter middle name (Optional)"
            style={inputStyle()}
          />
          <small style={charCountStyle}>{100 - basicData.middleName.length} chars left</small>
        </div>

        {/* Last Name */}
        <div>
          <label style={labelStyle}>Last Name <span style={{ color: "#DC2626" }}>*</span></label>
          <input
            type="text"
            value={basicData.lastName}
            onChange={(e) => setBasicData({...basicData, lastName: e.target.value})}
            placeholder="Enter last name"
            style={inputStyle(basicErrors.lastName)}
          />
          {basicErrors.lastName && <div style={errorStyle}>{basicErrors.lastName}</div>}
          <small style={charCountStyle}>{100 - basicData.lastName.length} chars left</small>
        </div>

        {/* Gender */}
        <div>
          <label style={labelStyle}>Gender <span style={{ color: "#DC2626" }}>*</span></label>
          <select
            value={basicData.gender}
            onChange={(e) => setBasicData({...basicData, gender: e.target.value})}
            style={selectStyle(basicErrors.gender)}
          >
            <option value="">Please select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {basicErrors.gender && <div style={errorStyle}>{basicErrors.gender}</div>}
        </div>

        {/* DOB */}
        <div>
          <label style={labelStyle}>Date of Birth <span style={{ color: "#DC2626" }}>*</span></label>
          <input
            type="date"
            value={basicData.dob}
            onChange={(e) => setBasicData({...basicData, dob: e.target.value})}
            style={inputStyle(basicErrors.dob)}
          />
          {basicErrors.dob && <div style={errorStyle}>{basicErrors.dob}</div>}
        </div>
      </div>
    </div>
  );

  const renderContactDetails = () => (
    <div>
      {/* Mobile Number */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Mobile Number <span style={{ color: "red" }}>*</span></label>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <input
            type="text"
            value={contactData.mobile}
            onChange={(e) => setContactData({...contactData, mobile: e.target.value})}
            placeholder="10-digits only"
            maxLength="10"
            style={{ ...inputStyle(), flex: 1 }}
          />
          <button type="button" onClick={handleSendOtp} style={otpButtonStyle}>
            Send OTP
          </button>
          <button type="button" onClick={handleVerifyOtp} style={verifyButtonStyle}>
            I have an OTP
          </button>
        </div>
        {otpVerified && (
          <div style={{ color: "#10B981", fontSize: "13px", marginTop: "5px" }}>
            ✅ Mobile number verified
          </div>
        )}
      </div>

      {/* Email */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>E-Mail Address <span style={{ color: "red" }}>*</span></label>
        <input
          type="email"
          value={contactData.email}
          onChange={(e) => setContactData({...contactData, email: e.target.value})}
          placeholder="someone@example.com"
          maxLength="100"
          style={inputStyle()}
        />
        <small style={charCountStyle}>{100 - contactData.email.length} chars left</small>
      </div>

      {/* Home Phone */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Home Phone</label>
        <input
          type="text"
          value={contactData.homePhone}
          onChange={(e) => setContactData({...contactData, homePhone: e.target.value})}
          placeholder="Enter your residence phone number"
          style={inputStyle()}
        />
      </div>

      {/* Emergency Contact */}
      <div style={{ marginBottom: "30px" }}>
        <label style={labelStyle}>Emergency Contact</label>
        <input
          type="text"
          value={contactData.emergencyContact}
          onChange={(e) => setContactData({...contactData, emergencyContact: e.target.value})}
          placeholder="Name and number of emergency contact person"
          style={inputStyle()}
        />
      </div>
    </div>
  );

  const renderPersonalDetails = () => (
    <div>
      <div style={noteStyle}>
        <strong>Note:</strong> All fields in this section are optional.
      </div>

      {/* Blood Group */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Blood Group (Optional)</label>
        <select
          value={personalData.bloodGroup}
          onChange={(e) => setPersonalData({...personalData, bloodGroup: e.target.value})}
          style={selectStyle()}
        >
          <option value="">Select blood group (Optional)</option>
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
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Passport Number (Optional)</label>
        <input
          type="text"
          value={personalData.passport}
          onChange={(e) => setPersonalData({...personalData, passport: e.target.value.toUpperCase()})}
          placeholder="A1234567 (Optional)"
          style={inputStyle()}
        />
      </div>

      {/* Driving License */}
      <div style={{ marginBottom: "30px" }}>
        <label style={labelStyle}>Driving License Number (Optional)</label>
        <input
          type="text"
          value={personalData.drivingLicense}
          onChange={(e) => setPersonalData({...personalData, drivingLicense: e.target.value.toUpperCase()})}
          placeholder="MH-1234567890123 (Optional)"
          style={inputStyle()}
        />
      </div>
    </div>
  );

  const renderStatutoryDetails = () => (
    <div>
      <div style={noteStyle}>
        <strong>Note:</strong> Aadhar and PAN are mandatory. UAN and ESI are optional.
      </div>

      {/* Aadhar */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Aadhar Number <span style={{ color: "red" }}>*</span></label>
        <input
          type="text"
          value={statutoryData.aadhar}
          onChange={(e) => setStatutoryData({...statutoryData, aadhar: e.target.value})}
          placeholder="123456789012"
          maxLength="12"
          style={inputStyle(statutoryErrors.aadhar)}
        />
        {statutoryErrors.aadhar && <div style={errorStyle}>⚠️ {statutoryErrors.aadhar}</div>}
        {!statutoryErrors.aadhar && <div style={helperStyle}>12-digit number required</div>}
      </div>

      {/* PAN */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>PAN Number <span style={{ color: "red" }}>*</span></label>
        <input
          type="text"
          value={statutoryData.pan}
          onChange={(e) => setStatutoryData({...statutoryData, pan: e.target.value.toUpperCase()})}
          placeholder="ABCDE1234F"
          maxLength="10"
          style={inputStyle(statutoryErrors.pan)}
        />
        {statutoryErrors.pan && <div style={errorStyle}>⚠️ {statutoryErrors.pan}</div>}
        {!statutoryErrors.pan && <div style={helperStyle}>10 characters alphanumeric (e.g., ABCDE1234F)</div>}
      </div>

      {/* UAN */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>UAN Number (Optional)</label>
        <input
          type="text"
          value={statutoryData.uan}
          onChange={(e) => setStatutoryData({...statutoryData, uan: e.target.value})}
          placeholder="123456789012 (Optional)"
          maxLength="12"
          style={inputStyle()}
        />
        <div style={helperStyle}>12-digit number (Optional)</div>
      </div>

      {/* ESI */}
      <div style={{ marginBottom: "30px" }}>
        <label style={labelStyle}>ESI Number (Optional)</label>
        <input
          type="text"
          value={statutoryData.esi}
          onChange={(e) => setStatutoryData({...statutoryData, esi: e.target.value})}
          placeholder="31-00-123456-000-0001 (Optional)"
          style={inputStyle()}
        />
        <div style={helperStyle}>Format: XX-XX-XXXXXX-XXX-XXXX (Optional)</div>
      </div>
    </div>
  );

  const renderFamilyDetails = () => (
    <div>
      <div style={noteStyle}>
        <strong>Note:</strong> All family details are optional.
      </div>

      {/* Marital Status */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Marital Status (Optional)</label>
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          {["Single", "Married"].map((status) => (
            <label key={status} style={radioLabelStyle}>
              <div style={radioCircleStyle(maritalStatus === status)}>
                {maritalStatus === status && <div style={radioInnerStyle}></div>}
              </div>
              <input
                type="radio"
                value={status}
                checked={maritalStatus === status}
                onChange={() => setMaritalStatus(status)}
                style={{ display: "none" }}
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Father Name */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Father Name (Optional)</label>
        <input
          type="text"
          value={familyData.fatherName}
          onChange={(e) => setFamilyData({...familyData, fatherName: e.target.value})}
          placeholder="Enter Father Name (Optional)"
          style={inputStyle()}
        />
        <small style={charCountStyle}>{50 - familyData.fatherName.length} chars left</small>
      </div>

      {/* Father Phone + DOB */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Father Phone (Optional)</label>
          <input
            type="text"
            value={familyData.fatherPhone}
            onChange={(e) => setFamilyData({...familyData, fatherPhone: e.target.value})}
            placeholder="Enter father Phone (Optional)"
            style={inputStyle()}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Father Date of Birth (Optional)</label>
          <input
            type="date"
            value={familyData.fatherDOB}
            onChange={(e) => setFamilyData({...familyData, fatherDOB: e.target.value})}
            style={inputStyle()}
          />
        </div>
      </div>

      {/* Mother Name */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Mother Name (Optional)</label>
        <input
          type="text"
          value={familyData.motherName}
          onChange={(e) => setFamilyData({...familyData, motherName: e.target.value})}
          placeholder="Enter Mother Name (Optional)"
          style={inputStyle()}
        />
        <small style={charCountStyle}>{50 - familyData.motherName.length} chars left</small>
      </div>

      {/* Mother Phone + DOB */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Mother Phone (Optional)</label>
          <input
            type="text"
            value={familyData.motherPhone}
            onChange={(e) => setFamilyData({...familyData, motherPhone: e.target.value})}
            placeholder="Enter mother Phone (Optional)"
            style={inputStyle()}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Mother Date of Birth (Optional)</label>
          <input
            type="date"
            value={familyData.motherDOB}
            onChange={(e) => setFamilyData({...familyData, motherDOB: e.target.value})}
            style={inputStyle()}
          />
        </div>
      </div>
    </div>
  );

const renderAddress = (title, address, setAddress, isPermanent = false) => (
    <div>
      {isPermanent && (
        <div style={{ marginBottom: "25px" }}>
          <button onClick={copyPresentAddress} style={copyButtonStyle}>
            📋 Copy Present Address
          </button>
        </div>
      )}

      {/* Address Line 1 */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Address Line 1 <span style={{ color: "#DC2626" }}>*</span></label>
        <input
          type="text"
          value={address.address1}
          onChange={(e) => setAddress({...address, address1: e.target.value})}
          placeholder="Enter Address Line 1"
          maxLength="100"
          style={inputStyle()}
        />
        <small style={charCountStyle}>{100 - address.address1.length} chars left</small>
      </div>

      {/* Address Line 2 */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Address Line 2</label>
        <input
          type="text"
          value={address.address2}
          onChange={(e) => setAddress({...address, address2: e.target.value})}
          placeholder="Enter Address Line 2 (Optional)"
          style={inputStyle()}
        />
      </div>

      {/* City and Pincode */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>City <span style={{ color: "#DC2626" }}>*</span></label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => setAddress({...address, city: e.target.value})}
            placeholder="Enter city"
            maxLength="50"
            style={inputStyle()}
          />
          <small style={charCountStyle}>{50 - address.city.length} chars left</small>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Pincode <span style={{ color: "#DC2626" }}>*</span></label>
          <input
            type="text"
            value={address.pincode}
            onChange={(e) => setAddress({...address, pincode: e.target.value})}
            placeholder="Enter 6-digit pincode"
            maxLength="6"
            style={inputStyle()}
          />
          <small style={charCountStyle}>{6 - address.pincode.length} chars left</small>
        </div>
      </div>

      {/* State and Country - BOTH AS EDITABLE INPUTS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>State <span style={{ color: "#DC2626" }}>*</span></label>
          <input
            type="text"
            value={address.state}
            onChange={(e) => setAddress({...address, state: e.target.value})}
            placeholder="Enter State"
            maxLength="50"
            style={inputStyle()}
          />
          <small style={charCountStyle}>{50 - address.state.length} chars left</small>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Country <span style={{ color: "#DC2626" }}>*</span></label>
          <input
            type="text"
            value={address.country}
            onChange={(e) => setAddress({...address, country: e.target.value})}
            placeholder="Enter Country"
            maxLength="50"
            style={inputStyle()}
          />
          <small style={charCountStyle}>{50 - address.country.length} chars left</small>
        </div>
      </div>
    </div>
  );

  const renderBankDetails = () => (
    <div>
      {/* Bank Name and IFSC */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Bank Name <span style={{ color: "#DC2626" }}>*</span></label>
          <input
            type="text"
            value={bankData.bankName}
            onChange={(e) => setBankData({...bankData, bankName: e.target.value.toUpperCase()})}
            placeholder="Enter Bank Name"
            maxLength="50"
            style={inputStyle()}
          />
          <small style={charCountStyle}>{50 - bankData.bankName.length} chars left</small>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>IFSC Code <span style={{ color: "#DC2626" }}>*</span></label>
          <input
            type="text"
            value={bankData.ifscCode}
            onChange={(e) => setBankData({...bankData, ifscCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')})}
            placeholder="SBIN0001234"
            maxLength="11"
            style={inputStyle()}
          />
          <small style={helperStyle}>Format: 4 letters, 0, 6 alphanumeric (e.g., SBIN0001234)</small>
        </div>
      </div>

      {/* Account Number */}
      <div style={{ marginBottom: "25px" }}>
        <label style={labelStyle}>Account Number <span style={{ color: "#DC2626" }}>*</span></label>
        <input
          type="text"
          value={bankData.accountNumber}
          onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})}
          placeholder="Enter Account Number"
          maxLength="18"
          style={inputStyle()}
        />
        <small style={helperStyle}>Must be 9-18 digits without spaces</small>
      </div>

      {/* Account Holder */}
      <div style={{ marginBottom: "30px", maxWidth: "400px" }}>
        <label style={labelStyle}>Account Holder Name <span style={{ color: "#DC2626" }}>*</span></label>
        <input
          type="text"
          value={bankData.accountHolder}
          onChange={(e) => setBankData({...bankData, accountHolder: e.target.value})}
          placeholder="Enter Account Holder Name"
          maxLength="100"
          style={inputStyle()}
        />
        <small style={charCountStyle}>{100 - bankData.accountHolder.length} chars left</small>
      </div>
    </div>
  );

  const renderDocuments = () => {
    const docConfig = [
      { key:"Xth", label: "10th Marksheet", required: true },
      { key:"XIIth", label: "12th Marksheet", required: true },
      { key: "graduation", label: "Graduation Certificate", required: true },
      { key: "postGraduation", label: "Post Graduation Certificate" },
      {key: "otherEducation", label: "Other Education Certificates" },
      { key: "resume", label: "Resume / CV" },
      { key: "photo", label: "Passport Size Photo", required: true },
      { key: "aadhar", label: "Aadhar Card", required: true },
      { key: "pan", label: "PAN Card", required: true },
      { key: "uan", label: "UAN Card"},
      { key: "esi", label: "ESI Card" },
      { key: "dl", label: "Driving License" },
      { key: "voterId", label: "Voter ID Card" },
      { key: "passport", label: "Passport" },
      { key: "other", label: "Other Relevant Document" }

    ];

    return (
      <div>
        <div style={{ marginTop: "20px" }}>
          {docConfig.map((doc) => {
            const file = documents[doc.key];
            return (
              <div key={doc.key} style={documentRowStyle}>
                <div>
                  <span style={labelStyle}>
                    {doc.label} {doc.required && <span style={{ color: "#DC2626" }}>*</span>}
                  </span>
                  <div style={fileNameStyle}>
                    {file ? `${file.name} (${formatFileSize(file.size)})` : "No file selected"}
                  </div>
                </div>
                {file ? (
                  <button onClick={() => handleRemove(doc.key)} style={removeButtonStyle}>
                    Remove
                  </button>
                ) : (
                  <label style={uploadDocButtonStyle}>
                    Upload
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => handleUpload(doc.key, e.target.files[0])}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>

        <div style={noteStyle}>
          <strong>Accepted formats:</strong> PDF, JPG, PNG • <strong>Max size:</strong> 10MB per file
        </div>
      </div>
    );
  };

  const renderCompletion = () => (
    <div style={{ textAlign: "center", margin: "40px 0", padding: "30px 20px" }}>
      <h4 style={{ fontWeight: "700", marginBottom: "15px", color: "#1F2937", fontSize: "28px" }}>
        Congratulations! 🎉
      </h4>
      
      <div style={{ fontSize: "16px", color: "#6b6b6b", lineHeight: "1.6", marginBottom: "25px" }}>
        <p style={{ marginBottom: "15px" }}>
          You have completed all the sections. <br />
          Click <strong>Back</strong> to make changes.
        </p>
        
        <div style={completionBoxStyle}>
          <p style={{ margin: "10px 0 0 0", fontSize: "14px", color: "#6B7280" }}>
            Click <strong>Submit</strong> to send your information.
          </p>
        </div>
      </div>
    </div>
  );

  // ===== STYLES =====
  const inputStyle = (hasError = false) => ({
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: hasError ? "1px solid #DC2626" : "1px solid #cdd2d8",
    background: "#f8f9fa",
    color: "#1F2937",
    fontSize: "14px"
  });

  const selectStyle = (hasError = false) => ({
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: hasError ? "1px solid #DC2626" : "1px solid #cdd2d8",
    background: "#f8f9fa",
    color: "#1F2937",
    fontSize: "14px",
    cursor: "pointer"
  });

  const readonlyInputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cdd2d8",
    background: "#f8f9fa",
    color: "#6B7280",
    fontSize: "14px"
  };

  const labelStyle = {
    fontWeight: 600,
    color: "#1F2937",
    display: "block",
    marginBottom: "8px"
  };

  const errorStyle = {
    color: "#DC2626",
    fontSize: "12px",
    marginTop: "4px"
  };

  const helperStyle = {
    color: "#6B7280",
    fontSize: "12px",
    marginTop: "5px"
  };

  const charCountStyle = {
    color: "#8b8b8b",
    fontSize: "12px",
    display: "block",
    marginTop: "4px"
  };

  const profileImageStyle = {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #e5e7eb"
  };

  const profilePlaceholderStyle = {
    width: "70px",
    height: "70px",
    background: "#e5e7eb",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "#6b7280"
  };

  const uploadLabelStyle = {
    display: "block",
    marginTop: "8px",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: "14px"
  };

  const otpButtonStyle = {
    padding: "10px 16px",
    background: "#F59E0B",
    border: "none",
    color: "#1F2937",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    whiteSpace: "nowrap"
  };

  const verifyButtonStyle = {
    padding: "10px 16px",
    background: "#2563eb",
    border: "none",
    color: "#FFFFFF",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    whiteSpace: "nowrap"
  };

  const noteStyle = {
    marginBottom: "25px",
    padding: "12px 16px",
    backgroundColor: "#F0F9FF",
    borderLeft: "4px solid #2563eb",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#1E40AF"
  };

  const radioLabelStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#4B5563"
  };

  const radioCircleStyle = (isSelected) => ({
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: `2px solid ${isSelected ? "#2563eb" : "#9CA3AF"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "8px"
  });

  const radioInnerStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#2563eb",
  };

  const copyButtonStyle = {
    padding: "10px 20px",
    background: "#10B981",
    border: "none",
    color: "#FFFFFF",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  const documentRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #E5E7EB",
    padding: "12px 0"
  };

  const fileNameStyle = {
    fontSize: "12px",
    color: "#6B7280",
    marginTop: "4px"
  };

  const removeButtonStyle = {
    padding: "6px 12px",
    background: "#DC2626",
    border: "none",
    color: "#FFFFFF",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500
  };

  const uploadDocButtonStyle = {
    padding: "6px 12px",
    background: "#2563EB",
    border: "none",
    color: "#FFFFFF",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    display: "inline-block"
  };

  const completionBoxStyle = {
    background: "#F3F4F6",
    padding: "15px",
    borderRadius: "8px",
    margin: "20px 0"
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ===== MAIN RENDER =====
  const stepTitles = [
    "Welcome",
    "Basic Details",
    "Contact Details",
    "Personal Information",
    "Statutory Details",
    "Family Details",
    "Present Address",
    "Permanent Address",
    "Bank Details",
    "Upload Documents",
    "Completion"
  ];

  // If on welcome step, render full-screen welcome card without navigation
  if (currentStep === 0) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3F4F6",
        padding: "20px"
      }}>
        {renderWelcomeCard()}
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    );
  }

  // For other steps, render the normal onboarding form with navigation
  return (
    <div style={{ 
      minHeight: "100vh", 
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#F3F4F6"
    }}>
      <div style={{ 
        maxWidth: "900px", 
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
      }}>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start",
          marginBottom: "30px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img
              src="/assets/images/auth/auth-img.png"
              alt="Levitica Logo"
              style={{ height: "50px", width: "50px", objectFit: "contain" }}
            />
            <div>
              <h4 style={{ 
                margin: 0, 
                fontSize: "20px", 
                fontWeight: "700", 
                color: "#1F2937"
              }}>
                {companyName}
              </h4>
              <p style={{ 
                margin: "4px 0 0 0", 
                fontSize: "14px", 
                color: "#6B7280",
                fontWeight: "500"
              }}>
                New Hire Onboarding
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "25px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginBottom: "8px" 
          }}>
            <div style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              color: "#2563eb"
            }}>
              {stepTitles[currentStep]}
            </div>
            <div style={{ 
              color: "#666",
              fontSize: "14px"
            }}>
              Step {currentStep} of {stepTitles.length - 1}
            </div>
          </div>
          
          <div style={{ 
            width: "100%", 
            height: "6px", 
            background: "#E5E7EB", 
            borderRadius: "10px",
            overflow: "hidden"
          }}>
            <div style={{ 
              width: `${(currentStep / (stepTitles.length - 1)) * 100}%`, 
              height: "100%", 
              background: "#2563eb"
            }}></div>
          </div>
          
          <div style={{ 
            marginTop: "8px", 
            fontSize: "13px", 
            color: "#666",
            textAlign: "right"
          }}>
            {Math.round((currentStep / (stepTitles.length - 1)) * 100)}% completed
          </div>
        </div>

        {/* Step Content */}
        <div style={{ marginBottom: "30px" }}>
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between",
          marginTop: "30px"
        }}>
          <button
            onClick={prevStep}
            style={{
              padding: "12px 28px",
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

          <button
            onClick={nextStep}
            style={{
              padding: "12px 28px",
              background: currentStep === stepTitles.length - 1 ? "#10B981" : "#0066ff",
              border: "none",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 600
            }}
          >
            {currentStep === stepTitles.length - 1 ? "Submit" : "Continue"} {currentStep < stepTitles.length - 1 && "➜"}
          </button>
        </div>

                {/* Footer */}
        <hr style={{ 
          margin: "30px 0 20px 0", 
          border: "none",
          borderTop: "1px solid #E5E7EB"
        }} />

      </div>

      {/* Toastify Container */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Newhire;