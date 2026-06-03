import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PersonalInformationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const candidateData = location.state || {};

  const [formData, setFormData] = useState({
    // Basic Information
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    maritalStatus: "",
    nationality: "",
    languages: [],
    profilePhoto: null,

    // Contact Information
    personalEmail: candidateData.email || "",
    phonePrimary: candidateData.mobile || "",
    phoneSecondary: "",
    phoneEmergency: "",

    // Current Address
    currentAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      proof: null
    },

    // Permanent Address
    permanentAddress: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      proof: null
    },

    // Emergency Contacts
    emergencyContacts: [
      { name: "", relation: "", phone: "", priority: "Primary" }
    ],

    // Family Members
    familyMembers: [],

    // Nominees
    nominees: [],

    // Identification
    identification: {
      aadhaar: { number: "", document: null },
      pan: { number: "", document: null },
      passport: { number: "", expiryDate: "", document: null },
      voterId: { number: "", document: null }
    }
  });

  const [currentLanguage, setCurrentLanguage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (name.includes('.')) {
        const [parent, child, subChild] = name.split('.');
        if (subChild) {
          setFormData(prev => ({
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: {
                ...prev[parent][child],
                [subChild]: files[0]
              }
            }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: files[0]
            }
          }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      }
    } else if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      if (subChild) {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddLanguage = () => {
    if (currentLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, currentLanguage.trim()]
      }));
      setCurrentLanguage("");
    }
  };

  const handleRemoveLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleAddEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: "", relation: "", phone: "", priority: "Secondary" }
      ]
    }));
  };

  const handleRemoveEmergencyContact = (index) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  const handleEmergencyContactChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const handleAddFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        { name: "", relation: "", dob: "" }
      ]
    }));
  };

  const handleRemoveFamilyMember = (index) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const handleFamilyMemberChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleAddNominee = () => {
    setFormData(prev => ({
      ...prev,
      nominees: [
        ...prev.nominees,
        { name: "", relation: "", percentage: "" }
      ]
    }));
  };

  const handleRemoveNominee = (index) => {
    setFormData(prev => ({
      ...prev,
      nominees: prev.nominees.filter((_, i) => i !== index)
    }));
  };

  const handleNomineeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      nominees: prev.nominees.map((nominee, i) =>
        i === index ? { ...nominee, [field]: value } : nominee
      )
    }));
  };

  const handleSameAsCurrent = (e) => {
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        permanentAddress: { ...prev.currentAddress }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender) {
      alert("Please fill all required fields!");
      return;
    }

    // Create form entry
    const newForm = {
      id: Date.now(),
      candidate: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
      created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      email: formData.personalEmail,
      mobile: formData.phonePrimary,
      info: "View Form",
      status: "Pending",
      formData: formData
    };

    // Navigate back to forms list with new form data
    navigate("/onboarding/pre-joining", {
      state: { newForm }
    });
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
              Personal Information
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-4">
          <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, color: "#1F2937" }}>
            Personal Information
          </h2>
          <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 0 }}>
            Complete your personal information details
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card mb-4" style={{ borderRadius: 12, border: "1px solid #E5E7EB" }}>
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">
                <Icon icon="heroicons:identification" className="me-2" />
                Basic Information
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label fw-semibold">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label fw-semibold">Middle Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label fw-semibold">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-3 mb-3 text-center">
                  <label className="form-label fw-semibold d-block">Profile Photo</label>
                  {formData.profilePhoto ? (
                    <img
                      src={URL.createObjectURL(formData.profilePhoto)}
                      alt="Profile"
                      className="rounded-circle mb-2"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="rounded-circle border d-flex align-items-center justify-content-center bg-light mx-auto mb-2" style={{ width: "80px", height: "80px" }}>
                      <Icon icon="heroicons:user" className="fs-1 text-muted" />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="image/*"
                    name="profilePhoto"
                    onChange={handleChange}
                    style={{ borderRadius: 8 }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label fw-semibold">
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label fw-semibold">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: 8 }}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label fw-semibold">Blood Group</label>
                  <select
                    className="form-select"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    style={{ borderRadius: 8 }}
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label fw-semibold">Marital Status</label>
                  <select
                    className="form-select"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    style={{ borderRadius: 8 }}
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Nationality</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    placeholder="Enter nationality"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-8 mb-3">
                  <label className="form-label fw-semibold">Languages</label>
                  <div className="d-flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={currentLanguage}
                      onChange={(e) => setCurrentLanguage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                      placeholder="Enter language"
                      style={{ borderRadius: 8 }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleAddLanguage}
                      style={{ borderRadius: 8 }}
                    >
                      Add
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.languages.map((lang, idx) => (
                      <span key={idx} className="badge bg-primary d-flex align-items-center gap-1" style={{ borderRadius: 6, padding: "6px 12px" }}>
                        {lang}
                        <Icon
                          icon="heroicons:x-mark"
                          className="cursor-pointer"
                          onClick={() => handleRemoveLanguage(idx)}
                          style={{ fontSize: 14, cursor: "pointer" }}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card mb-4" style={{ borderRadius: 12, border: "1px solid #E5E7EB" }}>
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">
                <Icon icon="heroicons:phone" className="me-2" />
                Contact Information
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Personal Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    placeholder="personal@email.com"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">
                    Primary Phone <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phonePrimary"
                    value={formData.phonePrimary}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    required
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Secondary Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phoneSecondary"
                    value={formData.phoneSecondary}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4568"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Emergency Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phoneEmergency"
                    value={formData.phoneEmergency}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4569"
                    style={{ borderRadius: 8 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Address */}
          <div className="card mb-4" style={{ borderRadius: 12, border: "1px solid #E5E7EB" }}>
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">
                <Icon icon="heroicons:map-pin" className="me-2" />
                Current Address
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Address Line 1</label>
                  <input
                    type="text"
                    className="form-control"
                    name="currentAddress.line1"
                    value={formData.currentAddress.line1}
                    onChange={handleChange}
                    placeholder="Enter address line 1"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    name="currentAddress.line2"
                    value={formData.currentAddress.line2}
                    onChange={handleChange}
                    placeholder="Enter address line 2"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="currentAddress.city"
                    value={formData.currentAddress.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="currentAddress.state"
                    value={formData.currentAddress.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    name="currentAddress.pincode"
                    value={formData.currentAddress.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="currentAddress.country"
                    value={formData.currentAddress.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Address Proof</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*,.pdf"
                    name="currentAddress.proof"
                    onChange={handleChange}
                    style={{ borderRadius: 8 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Permanent Address */}
          <div className="card mb-4" style={{ borderRadius: 12, border: "1px solid #E5E7EB" }}>
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">
                <Icon icon="heroicons:home" className="me-2" />
                Permanent Address
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="sameAsCurrent"
                    onChange={handleSameAsCurrent}
                  />
                  <label className="form-check-label" htmlFor="sameAsCurrent">
                    Same as Current Address
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Address Line 1</label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanentAddress.line1"
                    value={formData.permanentAddress.line1}
                    onChange={handleChange}
                    placeholder="Enter address line 1"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanentAddress.line2"
                    value={formData.permanentAddress.line2}
                    onChange={handleChange}
                    placeholder="Enter address line 2"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanentAddress.city"
                    value={formData.permanentAddress.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanentAddress.state"
                    value={formData.permanentAddress.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanentAddress.pincode"
                    value={formData.permanentAddress.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanentAddress.country"
                    value={formData.permanentAddress.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    style={{ borderRadius: 8 }}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Address Proof</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*,.pdf"
                    name="permanentAddress.proof"
                    onChange={handleChange}
                    style={{ borderRadius: 8 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="card mb-4" style={{ borderRadius: 12, border: "1px solid #E5E7EB" }}>
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">
                <Icon icon="heroicons:user-group" className="me-2" />
                Emergency Contacts
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleAddEmergencyContact}
                style={{ borderRadius: 8 }}
              >
                <Icon icon="heroicons:plus" className="me-1" />
                Add Contact
              </button>
            </div>
            <div className="card-body p-4">
              {formData.emergencyContacts.map((contact, idx) => (
                <div key={idx} className="row mb-3 pb-3 border-bottom">
                  <div className="col-md-3 mb-2">
                    <label className="form-label fw-semibold">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={contact.name}
                      onChange={(e) => handleEmergencyContactChange(idx, 'name', e.target.value)}
                      placeholder="Contact name"
                      style={{ borderRadius: 8 }}
                    />
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label fw-semibold">Relation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={contact.relation}
                      onChange={(e) => handleEmergencyContactChange(idx, 'relation', e.target.value)}
                      placeholder="Relation"
                      style={{ borderRadius: 8 }}
                    />
                  </div>
                  <div className="col-md-3 mb-2">
                    <label className="form-label fw-semibold">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={contact.phone}
                      onChange={(e) => handleEmergencyContactChange(idx, 'phone', e.target.value)}
                      placeholder="Phone number"
                      style={{ borderRadius: 8 }}
                    />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label className="form-label fw-semibold">Priority</label>
                    <select
                      className="form-select"
                      value={contact.priority}
                      onChange={(e) => handleEmergencyContactChange(idx, 'priority', e.target.value)}
                      style={{ borderRadius: 8 }}
                    >
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                    </select>
                  </div>
                  <div className="col-md-1 mb-2 d-flex align-items-end">
                    {formData.emergencyContacts.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveEmergencyContact(idx)}
                        style={{ borderRadius: 8 }}
                      >
                        <Icon icon="heroicons:trash" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Family Members */}
          <div className="card mb-4" style={{ borderRadius: 12, border: "1px solid #E5E7EB" }}>
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">
                <Icon icon="heroicons:home" className="me-2" />
                Family Members
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleAddFamilyMember}
                style={{ borderRadius: 8 }}
              >
                <Icon icon="heroicons:plus" className="me-1" />
                Add Member
              </button>
            </div>
            <div className="card-body p-4">
              {formData.familyMembers.length === 0 ? (
                <p className="text-muted text-center py-3">No family members added. Click "Add Member" to add one.</p>
              ) : (
                formData.familyMembers.map((member, idx) => (
                  <div key={idx} className="row mb-3 pb-3 border-bottom">
                    <div className="col-md-4 mb-2">
                      <label className="form-label fw-semibold">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={member.name}
                        onChange={(e) => handleFamilyMemberChange(idx, 'name', e.target.value)}
                        placeholder="Member name"
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label fw-semibold">Relation</label>
                      <select
                        className="form-select"
                        value={member.relation}
                        onChange={(e) => handleFamilyMemberChange(idx, 'relation', e.target.value)}
                        style={{ borderRadius: 8 }}
                      >
                        <option value="">Select</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-3 mb-2">
                      <label className="form-label fw-semibold">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        value={member.dob}
                        onChange={(e) => handleFamilyMemberChange(idx, 'dob', e.target.value)}
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                    <div className="col-md-1 mb-2 d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveFamilyMember(idx)}
                        style={{ borderRadius: 8 }}
                      >
                        <Icon icon="heroicons:trash" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Nominees */}
          <div className="card mb-4" style={{ borderRadius: 12, border: "1px solid #E5E7EB" }}>
            <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">
                <Icon icon="heroicons:gift" className="me-2" />
                Nominee Information
              </h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={handleAddNominee}
                style={{ borderRadius: 8 }}
              >
                <Icon icon="heroicons:plus" className="me-1" />
                Add Nominee
              </button>
            </div>
            <div className="card-body p-4">
              {formData.nominees.length === 0 ? (
                <p className="text-muted text-center py-3">No nominees added. Click "Add Nominee" to add one.</p>
              ) : (
                formData.nominees.map((nominee, idx) => (
                  <div key={idx} className="row mb-3 pb-3 border-bottom">
                    <div className="col-md-4 mb-2">
                      <label className="form-label fw-semibold">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nominee.name}
                        onChange={(e) => handleNomineeChange(idx, 'name', e.target.value)}
                        placeholder="Nominee name"
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label fw-semibold">Relation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nominee.relation}
                        onChange={(e) => handleNomineeChange(idx, 'relation', e.target.value)}
                        placeholder="Relation"
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <label className="form-label fw-semibold">Percentage (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={nominee.percentage}
                        onChange={(e) => handleNomineeChange(idx, 'percentage', e.target.value)}
                        placeholder="Percentage"
                        min="0"
                        max="100"
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                    <div className="col-md-1 mb-2 d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveNominee(idx)}
                        style={{ borderRadius: 8 }}
                      >
                        <Icon icon="heroicons:trash" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Identification Documents */}
          <div className="card mb-4" style={{ borderRadius: 12, border: "1px solid #E5E7EB" }}>
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">
                <Icon icon="heroicons:document-text" className="me-2" />
                Identification Documents
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">PAN Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="identification.pan.number"
                    value={formData.identification.pan.number}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    style={{ borderRadius: 8 }}
                  />
                  <input
                    type="file"
                    className="form-control mt-2"
                    accept="image/*,.pdf"
                    name="identification.pan.document"
                    onChange={handleChange}
                    style={{ borderRadius: 8 }}
                  />
                  <small className="text-muted">Upload PAN document</small>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Aadhaar Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="identification.aadhaar.number"
                    value={formData.identification.aadhaar.number}
                    onChange={handleChange}
                    placeholder="1234 5678 9012"
                    style={{ borderRadius: 8 }}
                  />
                  <input
                    type="file"
                    className="form-control mt-2"
                    accept="image/*,.pdf"
                    name="identification.aadhaar.document"
                    onChange={handleChange}
                    style={{ borderRadius: 8 }}
                  />
                  <small className="text-muted">Upload Aadhaar document</small>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Passport Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="identification.passport.number"
                    value={formData.identification.passport.number}
                    onChange={handleChange}
                    placeholder="A1234567"
                    style={{ borderRadius: 8 }}
                  />
                  <div className="row mt-2">
                    <div className="col-6">
                      <input
                        type="date"
                        className="form-control"
                        name="identification.passport.expiryDate"
                        value={formData.identification.passport.expiryDate}
                        onChange={handleChange}
                        placeholder="Expiry Date"
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*,.pdf"
                        name="identification.passport.document"
                        onChange={handleChange}
                        style={{ borderRadius: 8 }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Voter ID Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="identification.voterId.number"
                    value={formData.identification.voterId.number}
                    onChange={handleChange}
                    placeholder="Voter ID number"
                    style={{ borderRadius: 8 }}
                  />
                  <input
                    type="file"
                    className="form-control mt-2"
                    accept="image/*,.pdf"
                    name="identification.voterId.document"
                    onChange={handleChange}
                    style={{ borderRadius: 8 }}
                  />
                  <small className="text-muted">Upload Voter ID document</small>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/onboarding/pre-joining")}
              style={{ borderRadius: 8, padding: "10px 30px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: 8, padding: "10px 30px" }}
            >
              <Icon icon="heroicons:check" className="me-2" />
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformationForm;

