import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Icon } from "@iconify/react";

// Initial/static sample forms
const initialForms = [
  {
    id: 1860,
    candidate: "Bantapalli Pradeep",
    created: "29-Sep-2025",
    email: "pradeepchowdary977@gmail.com",
    mobile: "9618181126",
    info: "View Form",
    status: "Approved",
  },
  {
    id: 1858,
    candidate: "Dasireddy Harsha Vardan Naidu",
    created: "29-Sep-2025",
    email: "harshavardhannaidu23@gmail.com",
    mobile: "8328426817",
    info: "View Form",
    status: "Approved",
  },
  {
    id: 1832,
    candidate: "Chandu Thota",
    created: "11-Sep-2025",
    email: "chandupatelthota@gmail.com",
    mobile: "9494231434",
    info: "View Form",
    status: "Approved",
  },
];

export default function OnboardingFormsTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showHelp, setShowHelp] = useState(false);
  const [forms, setForms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Form state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
// Update your formData state initialization:
const [formData, setFormData] = useState({
  candidateName: "",
  email: "",
  mobile: "",
  mobileVerification: true,
  panVerification: false,
  bankVerification: false,
  aadhaarVerification: false,
  selectedCredits: 0, // Add this
  availableCredits: 0, // Add this
  totalCredits: 0, // Add this
});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formIdToEdit, setFormIdToEdit] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [deleteCandidateName, setDeleteCandidateName] = useState("");
  
    // Newhire form state
    const [showNewhireForm, setShowNewhireForm] = useState(false);
    const [currentFormId, setCurrentFormId] = useState(null);
    const [currentCandidateName, setCurrentCandidateName] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    
    // Newhire form data
    const [profilePic, setProfilePic] = useState(null);
    const [basicData, setBasicData] = useState({
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      dob: "",
    });
    const [basicErrors, setBasicErrors] = useState({});
  
    const [contactData, setContactData] = useState({
      mobile: "",
      email: "",
      homePhone: "",
      emergencyContact: "",
    });
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
  
    const [personalData, setPersonalData] = useState({
      bloodGroup: "",
      passport: "",
      drivingLicense: "",
    });
  
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
  
    const [maritalStatus, setMaritalStatus] = useState("");
    const [familyData, setFamilyData] = useState({
      fatherName: "",
      fatherPhone: "",
      fatherDOB: "",
      motherName: "",
      motherPhone: "",
      motherDOB: "",
    });
  
    const [presentAddress, setPresentAddress] = useState({
      address1: "",
      address2: "",
      city: "",
      pincode: "",
      state: "",
      country: "India",
    });
  
    const [permanentAddress, setPermanentAddress] = useState({
      address1: "2-21/A BC WADA",
      address2: "Sardhapor",
      city: "Sircilla",
      pincode: "505301",
      state: "Telangana",
      country: "India",
    });
  
    const [bankData, setBankData] = useState({
      bankName: "",
      ifscCode: "",
      accountNumber: "",
      accountHolder: "",
    });
  
    const [documents, setDocuments] = useState({
      pan: null,
      aadhar: null,
      photo: null,
      uan: null,
      bank: null,
      esi: null,
      dl: null,
      passport: null,
    });
  

  const { formId } = useParams();
  const candidate = location.state?.candidate;
  const processedFormsRef = useRef(new Set()); // Track processed form IDs

  // Load forms from localStorage on component mount
  useEffect(() => {
    const savedForms = localStorage.getItem("onboardingForms");
    const savedProfiles = localStorage.getItem("employeeProfiles");

    if (savedForms) {
      const parsedForms = JSON.parse(savedForms);
      setForms(parsedForms);
    } else if (savedProfiles) {
      // Convert employee profiles to form format
      const profiles = JSON.parse(savedProfiles);
      const convertedForms = profiles.map((profile, index) => ({
        id: parseInt(profile.id) || 1860 + index,
        candidate:
          `${profile.firstName} ${profile.middleName ? profile.middleName + " " : ""}${profile.lastName}`.trim(),
        created: profile.createdAt
          ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
        email: profile.officialEmail || profile.email,
        mobile: profile.phone || "N/A",
        info: "View Form",
        status:
          profile.status === "approved"
            ? "Approved"
            : profile.status === "pending_review"
              ? "Pending"
              : "Sent",
        employeeId: profile.employeeId,
      }));
      setForms(convertedForms);
      localStorage.setItem("onboardingForms", JSON.stringify(convertedForms));
    } else {
      // Use initial forms if no saved data
      setForms(initialForms);
      localStorage.setItem("onboardingForms", JSON.stringify(initialForms));
    }
  }, []);

  // Listen for changes in localStorage (when new employee is created in JoiningDayManagement)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedForms = localStorage.getItem("onboardingForms");
      if (savedForms) {
        const parsedForms = JSON.parse(savedForms);
        setForms(parsedForms);
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for changes (same tab)
    const interval = setInterval(() => {
      const savedForms = localStorage.getItem("onboardingForms");
      if (savedForms) {
        const parsedForms = JSON.parse(savedForms);
        const currentFormsStr = JSON.stringify(forms);
        const savedFormsStr = JSON.stringify(parsedForms);
        if (currentFormsStr !== savedFormsStr) {
          setForms(parsedForms);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [forms]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  // Add new form from navigation state (FinalizeAndSendForm)
  useEffect(() => {
    if (location.state?.newForm) {
      const newForm = location.state.newForm;
      const formId = newForm.id;

      // Check if form already exists or has been processed
      if (!processedFormsRef.current.has(formId)) {
        setForms((prev) => {
          // Double-check if form already exists in the list
          const formExists = prev.some((f) => f.id === formId);
          if (!formExists) {
            processedFormsRef.current.add(formId);
            const updatedForms = [newForm, ...prev];
            localStorage.setItem(
              "onboardingForms",
              JSON.stringify(updatedForms),
            );
            return updatedForms;
          }
          return prev;
        });

        // Clear the location state to prevent re-adding on re-renders
        // Use setTimeout to avoid navigation during render
        setTimeout(() => {
          navigate(location.pathname, { replace: true, state: {} });
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.newForm?.id]);

  // Handle form updates from edit mode
  useEffect(() => {
    if (location.state?.updatedForm && location.state?.formId) {
      const updatedForm = location.state.updatedForm;
      const formId = location.state.formId;

      setForms((prev) => {
        const formIndex = prev.findIndex((f) => f.id === formId);
        if (formIndex !== -1) {
          // Update existing form
          const updatedForms = [...prev];
          updatedForms[formIndex] = updatedForm;
          localStorage.setItem("onboardingForms", JSON.stringify(updatedForms));
          return updatedForms;
        }
        return prev;
      });

      // Clear the location state
      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.updatedForm, location.state?.formId]);

  // Filter + search logic
  const filteredForms = forms.filter((f) => {
    const matchesStatus = filterStatus === "All" || f.status === filterStatus;
    const matchesSearch =
      f.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.mobile.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Handle form input change
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  
  // First update the checkbox state
  const updatedFormData = {
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  };
  
  // If it's a checkbox, recalculate credits
  if (type === "checkbox") {
    // Calculate selected credits based on checked options
    let selectedCredits = 0;
    
    if (updatedFormData.panVerification) selectedCredits += 5;
    if (updatedFormData.bankVerification) selectedCredits += 5;
    if (updatedFormData.aadhaarVerification) selectedCredits += 10;
    
    // Mobile verification is always FREE
    // if (updatedFormData.mobileVerification) selectedCredits += 0;
    
    // Calculate total credits (selected minus available)
    const totalCredits = selectedCredits - updatedFormData.availableCredits;
    
    updatedFormData.selectedCredits = selectedCredits;
    updatedFormData.totalCredits = totalCredits > 0 ? totalCredits : 0;
  }
  
  setFormData(updatedFormData);
};


  // Handle continue button (shows confirmation modal)
  const handleContinue = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // Handle cancel button in modal
  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  // Handle cancel button in form modal
  const handleCancelForm = () => {
    setShowFormModal(false);
    resetForm();
  };

  // Handle form submission
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (editMode && formIdToEdit) {
    // Update existing form
    const updatedForm = {
      id: formIdToEdit,
      candidate: formData.candidateName,
      created: forms.find(f => f.id === formIdToEdit)?.created || new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      email: formData.email,
      mobile: formData.mobile,
      info: "View Form",
      status: "Pending",
      // Store credit data
      mobileVerification: formData.mobileVerification,
      panVerification: formData.panVerification,
      bankVerification: formData.bankVerification,
      aadhaarVerification: formData.aadhaarVerification,
      selectedCredits: formData.selectedCredits,
      availableCredits: formData.availableCredits,
      totalCredits: formData.totalCredits,
    };

    const updatedForms = forms.map(f => 
      f.id === formIdToEdit ? updatedForm : f
    );
    
    setForms(updatedForms);
    localStorage.setItem("onboardingForms", JSON.stringify(updatedForms));
  } else {
    // Create new form
    const newId = forms.length > 0 ? Math.max(...forms.map(f => f.id)) + 1 : 1861;
    const newForm = {
      id: newId,
      candidate: formData.candidateName,
      created: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      email: formData.email,
      mobile: formData.mobile,
      info: "View Form",
      status: "Pending",
      // Store credit data
      mobileVerification: formData.mobileVerification,
      panVerification: formData.panVerification,
      bankVerification: formData.bankVerification,
      aadhaarVerification: formData.aadhaarVerification,
      selectedCredits: formData.selectedCredits,
      availableCredits: formData.availableCredits,
      totalCredits: formData.totalCredits,
    };

    const updatedForms = [newForm, ...forms];
    setForms(updatedForms);
    localStorage.setItem("onboardingForms", JSON.stringify(updatedForms));
  }

  // Reset form and close modals
  resetForm();
  setShowFormModal(false);
  setShowConfirmModal(false);
};

  // Reset form data
const resetForm = () => {
  setFormData({
    candidateName: "",
    email: "",
    mobile: "",
    mobileVerification: true,
    panVerification: false,
    bankVerification: false,
    aadhaarVerification: false,
    selectedCredits: 0,
    availableCredits: 0,
    totalCredits: 0,
  });
  setEditMode(false);
  setFormIdToEdit(null);
};

const handleEdit = (formId) => {
  const form = forms.find((f) => f.id === formId);
  if (form) {
    // Get stored verification data or use defaults
    const mobileVerification = form.mobileVerification !== undefined ? form.mobileVerification : true;
    const panVerification = form.panVerification !== undefined ? form.panVerification : false;
    const bankVerification = form.bankVerification !== undefined ? form.bankVerification : false;
    const aadhaarVerification = form.aadhaarVerification !== undefined ? form.aadhaarVerification : false;
    
    // Calculate credits based on stored verification options
    let selectedCredits = 0;
    if (panVerification) selectedCredits += 5;
    if (bankVerification) selectedCredits += 5;
    if (aadhaarVerification) selectedCredits += 10;
    
    const availableCredits = form.availableCredits || 0;
    const totalCredits = Math.max(0, selectedCredits - availableCredits);
    
    setFormData({
      candidateName: form.candidate,
      email: form.email,
      mobile: form.mobile,
      mobileVerification: mobileVerification,
      panVerification: panVerification,
      bankVerification: bankVerification,
      aadhaarVerification: aadhaarVerification,
      selectedCredits: selectedCredits,
      availableCredits: availableCredits,
      totalCredits: totalCredits,
    });
    setEditMode(true);
    setFormIdToEdit(formId);
    setShowFormModal(true);
  }
};

  const handleViewForm = (formId) => {
    const form = forms.find((f) => f.id === formId);
    navigate("/newhire", {
      state: {
        formId,
        candidateName: form?.candidate || "Chandu Thota",
      },
    });
  };

  const handleReject = (formId) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;

    // Check the current status of the form
    if (form.status === "Pending" || form.status === "Sent") {
      // Update status to Rejected
      const updatedForms = forms.map((f) =>
        f.id === formId ? { ...f, status: "Rejected" } : f,
      );
      setForms(updatedForms);
      localStorage.setItem("onboardingForms", JSON.stringify(updatedForms));

      // Also update the corresponding employee profile status in JoiningDayManagement
      const savedProfiles = localStorage.getItem("employeeProfiles");
      if (savedProfiles && form.employeeId) {
        const profiles = JSON.parse(savedProfiles);
        const updatedProfiles = profiles.map((p) =>
          p.employeeId === form.employeeId
            ? { ...p, status: "rejected", rejectedAt: new Date().toISOString() }
            : p,
        );
        localStorage.setItem(
          "employeeProfiles",
          JSON.stringify(updatedProfiles),
        );
      }

      alert(`Form for ${form.candidate} has been rejected.`);
    } else if (form.status === "Rejected") {
      alert(`Form for ${form.candidate} is already rejected.`);
    } else {
      // For already approved forms, show message
      alert(`Cannot reject an already approved form.`);
    }
  };

  // Update the handleApprove function to be simpler:
  const handleApprove = (formId) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;

    if (form.status === "Pending" || form.status === "Sent") {
      // Update status to Approved
      const updatedForms = forms.map((f) =>
        f.id === formId ? { ...f, status: "Approved" } : f,
      );
      setForms(updatedForms);
      localStorage.setItem("onboardingForms", JSON.stringify(updatedForms));

      // Also update the corresponding employee profile status
      const savedProfiles = localStorage.getItem("employeeProfiles");
      if (savedProfiles && form.employeeId) {
        const profiles = JSON.parse(savedProfiles);
        const updatedProfiles = profiles.map((p) =>
          p.employeeId === form.employeeId
            ? { ...p, status: "approved", approvedAt: new Date().toISOString() }
            : p,
        );
        localStorage.setItem(
          "employeeProfiles",
          JSON.stringify(updatedProfiles),
        );
      }

      alert(`Form for ${form.candidate} has been approved successfully!`);
    } else {
      alert(`Form is already ${form.status}.`);
    }
  };

  const handleDelete = (formId) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;

    // Set the form to delete and show modal
    setFormToDelete(formId);
    setDeleteCandidateName(form.candidate);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!formToDelete) return;

    const updatedForms = forms.filter((f) => f.id !== formToDelete);
    setForms(updatedForms);
    localStorage.setItem("onboardingForms", JSON.stringify(updatedForms));
    // Close modal
    setShowDeleteModal(false);
    setFormToDelete(null);
    setDeleteCandidateName("");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setFormToDelete(null);
    setDeleteCandidateName("");
  };

  // Handle sort click
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, last page, and pages around current page
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pageNumbers;
  };

  // Sort Indicator Component
  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <Icon
          icon="heroicons:arrows-up-down"
          style={{ fontSize: 12, marginLeft: 4, opacity: 0.3 }}
        />
      );
    }

    return sortConfig.direction === "ascending" ? (
      <Icon
        icon="heroicons:chevron-up"
        style={{ fontSize: 12, marginLeft: 4, color: "#3B82F6" }}
      />
    ) : (
      <Icon
        icon="heroicons:chevron-down"
        style={{ fontSize: 12, marginLeft: 4, color: "#3B82F6" }}
      />
    );
  };

  // Sort function
  const sortedForms = useMemo(() => {
    let sortableForms = [...filteredForms];

    if (sortConfig.key) {
      sortableForms.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle date sorting for 'created' field
        if (sortConfig.key === "created") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Handle string sorting (case insensitive)
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableForms;
  }, [filteredForms, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedForms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedForms.length);
  const paginatedForms = sortedForms.slice(startIndex, endIndex);

  return (
    <div className="page-content" >
      <div className="container-fluid">
        {/* Header + Actions */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="mb-4">
            {/* Title */}
            <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
             <Icon icon='heroicons:chat-bubble-left-right'/>
              Forms
            </h5>

            {/* Description */}
            <p className="text-muted">
              Create onboarding forms for new hires. Approve or reject submitted forms.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="create-job-btn"
              onClick={() => {
                resetForm();
                setShowFormModal(true);
              }}
              style={{
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 500,
              }}
            >
              <Icon icon="heroicons:plus" style={{ fontSize: 18 }} />
              <span>Add New</span>
            </button>

            <button
              className="help-btn"
              style={{
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 500,
                color: "#fff",
              }}
              onClick={() => setShowHelp((prev) => !prev)}
            >
              Help
            </button>

          </div>
        </div>

        {/* Filters */}
        <div
          className="card mb-4"
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            className="card-body d-flex align-items-end flex-wrap gap-3"
            style={{ padding: "20px" }}
          >
            <div style={{ flex: "0 0 auto" }}>
              <label
                style={{
                  fontSize: 14,
                  color: "#374151",
                  fontWeight: 500,
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Form Status
              </label>
              <select
                className="form-select"
                style={{
                  minWidth: 150,
                  borderRadius: 8,
                  border: "1px solid #D1D5DB",
                  padding: "8px 12px",
                  fontSize: 14,
                }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>All</option>
                <option>Sent</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Pending</option>
              </select>
            </div>

            <div style={{ flex: "1 1 auto", minWidth: 280 }}>
              <label
                style={{
                  fontSize: 14,
                  color: "#374151",
                  fontWeight: 500,
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Search
              </label>
              <input
                type="text"
                className="form-control"
                style={{
                  borderRadius: 8,
                  border: "1px solid #D1D5DB",
                  padding: "8px 12px",
                  fontSize: 14,
                }}
                placeholder="Candidate name, mobile or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              className="create-job-btn"
              onClick={() => {}}
            >
              <Icon
                icon="heroicons:arrow-path"
                className="me-2"
                style={{ fontSize: 12 }}
              />
              Load
            </button>
          </div>
        </div>

        {/* Table */}
        <div
          className="card"
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            overflow: "hidden",
          }}
        >
          <div className="card-body p-0">
            <div style={{ overflowX: "auto" }}>
              <table
                className="table table-hover mb-0"
                style={{ marginBottom: 0 }}
              >
                <thead style={{ background: "#FAFBFC", fontWeight: 600 }}>
                  <tr>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid #E5E7EB",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                      onClick={() => handleSort("id")}
                    >
                      <span className="d-flex align-items-center">
                        ID
                        <SortIndicator columnKey="id" />
                      </span>
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid #E5E7EB",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                      onClick={() => handleSort("candidate")}
                    >
                      <span className="d-flex align-items-center">
                        CANDIDATE
                        <SortIndicator columnKey="candidate" />
                      </span>
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid #E5E7EB",
                      }}
                    >
                      CONTACT DETAILS
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid #E5E7EB",
                      }}
                    >
                      INFO
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid #E5E7EB",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                      onClick={() => handleSort("status")}
                    >
                      <span className="d-flex align-items-center">
                        STATUS
                        <SortIndicator columnKey="status" />
                      </span>
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        fontSize: 13,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid #E5E7EB",
                        textAlign: "center",
                      }}
                    >
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedForms.length > 0 ? (
                    paginatedForms.map((row, idx) => (
                      <tr
                        key={row.id}
                        style={{
                          background: idx % 2 === 1 ? "#FAFBFC" : "#FFF",
                          borderBottom: "1px solid #E5E7EB",
                        }}
                      >
                        <td
                          style={{
                            color: "#9CA3AF",
                            fontWeight: 500,
                            padding: "20px",
                            fontSize: 14,
                            verticalAlign: "middle",
                          }}
                        >
                          {row.id}
                        </td>

                        <td
                          style={{ padding: "20px", verticalAlign: "middle" }}
                        >
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 15,
                              color: "#1F2937",
                              marginBottom: 4,
                            }}
                          >
                            {row.candidate}
                          </div>
                          <div style={{ color: "#6B7280", fontSize: 13 }}>
                            Created: {row.created}
                          </div>
                        </td>

                        <td
                          style={{ padding: "20px", verticalAlign: "middle" }}
                        >
                          <div
                            style={{
                              color: "#1F2937",
                              fontSize: 14,
                              marginBottom: 4,
                            }}
                          >
                            {row.email}
                          </div>
                          <div style={{ color: "#6B7280", fontSize: 13 }}>
                            {row.mobile}
                          </div>
                        </td>
                        
                        <td style={{ padding: "20px", verticalAlign: "middle" }}>
                          <span onClick={() => handleViewForm(row.id)} className="d-inline-flex align-items-center" style={{ color: "#3B82F6", fontWeight: 500, fontSize: 14, cursor: "pointer", textDecoration: "none" }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}>
                            {row.info}
                            <Icon icon="heroicons:arrow-top-right-on-square" className="ms-1" style={{ fontSize: 14 }} />
                          </span>
                        </td>

                        <td
                          style={{ padding: "20px", verticalAlign: "middle" }}
                        >
                          <span
                            className="badge"
                            style={{
                              background:
                                row.status === "Approved"
                                  ? "#10B981"
                                  : row.status === "Rejected"
                                    ? "#EF4444"
                                    : row.status === "Pending"
                                      ? "#F59E0B"
                                      : "#3B82F6",
                              color: "#FFF",
                              fontWeight: 500,
                              borderRadius: "20px",
                              padding: "6px 14px",
                              fontSize: 12,
                              display: "inline-block",
                            }}
                          >
                            {row.status}
                          </span>
                        </td>

                        <td
                          style={{
                            padding: "20px",
                            verticalAlign: "middle",
                            textAlign: "center",
                            minWidth: 140,
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            {/* Edit Button - Always visible */}
                            <button
                              className="btn btn-light border-primary text-primary text-center d-flex align-items-center justify-content-center"
                              onClick={() => handleEdit(row.id)}
                              title="Edit"
                            >
                              <Icon
                                icon="heroicons:pencil"
                                style={{ fontSize: 16 }}
                              />
                            </button>

                            {/* Status-Based Action Buttons */}
                            {row.status === "Approved" ? (
                              // Show Reassign button for approved forms
                              // Show Approve button for Pending/Sent forms
                              <button
                                className="btn btn-light border-success text-success text-center d-flex align-items-center justify-content-center"
                                onClick={() => handleApprove(row.id)}
                                title="Approve"
                              >
                                <Icon
                                  icon="heroicons:check"
                                  style={{ fontSize: 16 }}
                                />
                              </button>
                            ) : row.status === "Rejected" ? (
                              // Show Restore button for rejected forms
                              <button
                                className="btn btn-light border-warning  text-warning text-center d-flex align-items-center justify-content-center"
                                onClick={() => handleReject(row.id)}
                                title="Reject"
                              >
                                <Icon
                                  icon="heroicons:x-mark"
                                  style={{ fontSize: 16 }}
                                />
                              </button>
                            ) : (
                              // Show Approve button for Pending/Sent forms
                              <button
                                className="btn btn-light border-success text-success text-center d-flex align-items-center justify-content-center"
                                onClick={() => handleApprove(row.id)}
                                title="Approve"
                              >
                                <Icon
                                  icon="heroicons:check"
                                  style={{ fontSize: 16 }}
                                />
                              </button>
                            )}

                            {/* Reject Button - Only for Pending/Sent forms */}
                            {(row.status === "Pending" ||
                              row.status === "Sent") && (
                              <button
                                className="btn btn-light border-warning  text-warning text-center d-flex align-items-center justify-content-center"
                                onClick={() => handleReject(row.id)}
                                title="Reject"
                              >
                                <Icon
                                  icon="heroicons:x-mark"
                                  style={{ fontSize: 16 }}
                                />
                              </button>
                            )}

                            {/* Delete Button - Always visible */}
                            <button
                              className="btn btn-light border-danger text-danger text-center d-flex align-items-center justify-content-center"
                              onClick={() => handleDelete(row.id)}
                              title="Delete"
                            >
                              <Icon
                                icon="heroicons:trash"
                                style={{ fontSize: 16 }}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        style={{ textAlign: "center", padding: "40px 20px" }}
                      >
<div className="d-flex justify-content-center align-items-center mb-3 text-muted fs-4">
  <Icon
    icon="heroicons:document-magnifying-glass"
    className="fs-1 text-secondary"
  />
</div>

                        <div
                          style={{
                            color: "#6B7280",
                            fontSize: 16,
                            fontWeight: 500,
                            marginBottom: 8,
                          }}
                        >
                          No forms found
                        </div>
                        <div style={{ color: "#9CA3AF", fontSize: 14 }}>
                          {searchQuery || filterStatus !== "All"
                            ? "Try adjusting your search or filters"
                            : "Create your first onboarding form to get started"}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer / Pagination */}
        {sortedForms.length > 0 && (
          <div
            className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mt-4 p-3"
            style={{
              fontSize: 14,
              background: "#F9FAFB",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
            }}
          >
            {/* Left section - Items info and page size selector */}
            <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
              <div style={{ color: "#6B7280", fontWeight: 500 }}>
                Showing{" "}
                <span style={{ color: "#10B981", fontWeight: 600 }}>
                  {Math.min(
                    (currentPage - 1) * itemsPerPage + 1,
                    sortedForms.length,
                  )}
                </span>{" "}
                to{" "}
                <span style={{ color: "#10B981", fontWeight: 600 }}>
                  {Math.min(currentPage * itemsPerPage, sortedForms.length)}
                </span>{" "}
                of{" "}
                <span style={{ color: "#10B981", fontWeight: 600 }}>
                  {sortedForms.length}
                </span>{" "}
                results
              </div>

              <div className="d-flex align-items-center gap-2">
                <span style={{ color: "#6B7280", fontSize: 13 }}>Show:</span>
                <select
                  className="form-select form-select-sm"
                  style={{
                    width: "auto",
                    borderRadius: 6,
                    border: "1px solid #D1D5DB",
                    padding: "4px 8px",
                    fontSize: 13,
                    background: "#FFF",
                  }}
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span style={{ color: "#6B7280", fontSize: 13 }}>per page</span>
              </div>
            </div>

            {/* Right section - Pagination controls */}
            <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
              {/* Page info */}
              <div style={{ color: "#6B7280", fontSize: 13 }}>
                Page{" "}
                <span style={{ color: "#3B82F6", fontWeight: 600 }}>
                  {currentPage}
                </span>{" "}
                of{" "}
                <span style={{ color: "#3B82F6", fontWeight: 600 }}>
                  {totalPages}
                </span>
              </div>

              {/* Pagination buttons */}
              <div className="d-flex gap-1">
                {/* Previous Page */}
                <button
                  className="btn btn-light d-flex align-items-center justify-content-center"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: 6,
                    border: "1px solid #D1D5DB",
                    color: currentPage === 1 ? "#9CA3AF" : "#374151",
                    background: "#FFF",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                  title="Previous Page"
                >
                  <Icon
                    icon="heroicons:chevron-left"
                    style={{ fontSize: 14 }}
                  />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNum, index) => (
                  <React.Fragment key={index}>
                    {pageNum === "..." ? (
                      <span
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          minWidth: 36,
                          height: 36,
                          color: "#6B7280",
                          fontSize: 14,
                        }}
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        className="btn d-flex align-items-center justify-content-center"
                        onClick={() => handlePageChange(pageNum)}
                        style={{
                          minWidth: 36,
                          height: 36,
                          borderRadius: 6,
                          border: `1px solid ${currentPage === pageNum ? "#3B82F6" : "#D1D5DB"}`,
                          color: currentPage === pageNum ? "#FFF" : "#374151",
                          background:
                            currentPage === pageNum ? "#3B82F6" : "#FFF",
                          fontWeight: currentPage === pageNum ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage !== pageNum) {
                            e.currentTarget.style.background = "#F3F4F6";
                            e.currentTarget.style.borderColor = "#9CA3AF";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentPage !== pageNum) {
                            e.currentTarget.style.background = "#FFF";
                            e.currentTarget.style.borderColor = "#D1D5DB";
                          }
                        }}
                      >
                        {pageNum}
                      </button>
                    )}
                  </React.Fragment>
                ))}

                {/* Next Page */}
                <button
                  className="btn btn-light d-flex align-items-center justify-content-center"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    minWidth: 36,
                    height: 36,
                    borderRadius: 6,
                    border: "1px solid #D1D5DB",
                    color: currentPage === totalPages ? "#9CA3AF" : "#374151",
                    background: "#FFF",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
                  title="Next Page"
                >
                  <Icon
                    icon="heroicons:chevron-right"
                    style={{ fontSize: 14 }}
                  />
                </button>
              </div>

              {/* Go to page input */}
              <div className="d-flex align-items-center gap-2">
                <span style={{ color: "#6B7280", fontSize: 13 }}>Go to:</span>
                <div className="input-group" style={{ width: 100 }}>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    style={{
                      borderRadius: 6,
                      border: "1px solid #D1D5DB",
                      padding: "4px 8px",
                      fontSize: 13,
                      textAlign: "center",
                    }}
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (!isNaN(page) && page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const page = parseInt(e.target.value);
                        if (!isNaN(page) && page >= 1 && page <= totalPages) {
                          handlePageChange(page);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Creation/Edit Modal */}
{showFormModal && (
  <div
     className="job-modal-overlay"
    onClick={(e) => {
      if (e.target === e.currentTarget) handleCancelForm();
    }}
  >
  <div className="job-modal-dialog">
    <div className="job-modal-content">

      {/* Header */}
      <div className="job-modal-header">
            <div>
              <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                <Icon icon={editMode ? "heroicons:pencil-square" : "heroicons:document-plus"} style={{ fontSize: 24 }} />
                {editMode ? "Edit Form" : "New Form"}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
                {editMode
                  ? "Update the onboarding form details for the candidate."
                  : "Generate and send self-onboarding form to a candidate."
                }
              </p>
            </div>
            <button
              className="btn btn-light fw-bold p-1 d-flex align-items-center justify-content-center"
              onClick={handleCancelForm}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "1px solid #E5E7EB"
              }}
            >
              <Icon
                icon="heroicons:x-mark"
                className="text-dark"
                style={{ fontSize: "18px" }}
              />
            </button>

        </div>

        {/* Modal Body - Form Content */}
        <div className="modal-body p-4 pt-0">
          <form onSubmit={handleContinue}>
            <div className="row g-4">
              {/* Left Section: Candidate Details */}
              <div className="col-md-6">
                <div className="mb-4">
                  <h6 className="fw-bold mb-6" style={{ color: "#1F2937", fontSize: "1rem" }}>
                    Part A - Candidate Details
                  </h6>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
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
                        padding: "10px 12px",
                        fontSize: "0.875rem"
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
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
                        padding: "10px 12px",
                        fontSize: "0.875rem"
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
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
                        padding: "10px 12px",
                        fontSize: "0.875rem"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Section: Verification Options */}
              <div className="col-md-6">
                <div className="mb-4">
                  <h6 className="fw-bold mb-3" style={{ color: "#1F2937", fontSize: "1rem" }}>
                    Select Verification Options
                  </h6>

<div className="mb-3">
  
  {/* Mobile Verification */}
  <div className="form-check mb-3">
    <label
      htmlFor="mobileVerification"
      className={`custom-checkbox ${formData.mobileVerification ? 'checked' : ''}`}
    >
      <div className="checkbox-box">
        {formData.mobileVerification && (
          <span className="checkmark">✓</span>
        )}
      </div>
      <input
        className="form-check-input"
        type="checkbox"
        name="mobileVerification"
        id="mobileVerification"
        checked={formData.mobileVerification}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <span className="checkbox-label">
        <span className="fw-semibold">Mobile Verification</span> - <span className="text-success">FREE</span>
      </span>
    </label>
  </div>

  {/* PAN Verification */}
  <div className="form-check mb-3">
    <label
      htmlFor="panVerification"
      className={`custom-checkbox ${formData.panVerification ? 'checked' : ''}`}
    >
      <div className="checkbox-box">
        {formData.panVerification && (
          <span className="checkmark">✓</span>
        )}
      </div>
      <input
        className="form-check-input"
        type="checkbox"
        name="panVerification"
        id="panVerification"
        checked={formData.panVerification}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <span className="checkbox-label">
        <span className="fw-semibold">PAN Verification</span> - <span className="text-warning">5 Credits</span>
      </span>
    </label>
  </div>

  {/* Bank Verification */}
  <div className="form-check mb-3">
    <label
      htmlFor="bankVerification"
      className={`custom-checkbox ${formData.bankVerification ? 'checked' : ''}`}
    >
      <div className="checkbox-box">
        {formData.bankVerification && (
          <span className="checkmark">✓</span>
        )}
      </div>
      <input
        className="form-check-input"
        type="checkbox"
        name="bankVerification"
        id="bankVerification"
        checked={formData.bankVerification}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <span className="checkbox-label">
        <span className="fw-semibold">Bank Verification</span> - <span className="text-warning">5 Credits</span>
      </span>
    </label>
  </div>

  {/* Aadhaar Verification */}
  <div className="form-check mb-3">
    <label
      htmlFor="aadhaarVerification"
      className={`custom-checkbox ${formData.aadhaarVerification ? 'checked' : ''}`}
    >
      <div className="checkbox-box">
        {formData.aadhaarVerification && (
          <span className="checkmark">✓</span>
        )}
      </div>
      <input
        className="form-check-input"
        type="checkbox"
        name="aadhaarVerification"
        id="aadhaarVerification"
        checked={formData.aadhaarVerification}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <span className="checkbox-label">
        <span className="fw-semibold">Aadhaar Verification</span> - <span className="text-warning">10 Credits</span>
      </span>
    </label>
  </div>

</div>
                  {/* Credit Balance Summary */}
                  <div className="mt-4 p-3" style={{ background: "#F9FAFB", borderRadius: 8 }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted" style={{ fontSize: "0.875rem" }}>Credit Balance:</span>
                      <span className="fw-bold" style={{ 
                        color: formData.totalCredits > 0 ? "#DC2626" : "#059669" 
                      }}>
                        {formData.totalCredits > 0 ? `-₹${formData.totalCredits}` : "₹0"}
                      </span>
                    </div>
                    
                    {/* Credits Breakdown */}
                    <div className="mt-2" style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      <div className="d-flex justify-content-between">
                        <span>Selected Credits:</span>
                        <span className="fw-semibold">₹{formData.selectedCredits}</span>
                      </div>
                      <div className="d-flex justify-content-between mt-1">
                        <span>Available Credits:</span>
                        <span className="fw-semibold">₹{formData.availableCredits}</span>
                      </div>
                    </div>
                    
                    <a 
                      href="#" 
                      className="text-primary text-decoration-none mt-2 d-inline-block"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Buy Credits
                    </a>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Form Buttons */}
            <div className="mt-4 pt-3 border-top">
              <div className="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancelForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-job-btn"
                >
                  Continue
                </button>
              </div>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1060 }}
          tabIndex="-1"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancel();
          }}
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

      {/* Help Modal */}
{showHelp && (
  <div
    className="hrms-modal-overlay"
    onClick={(e) => {
      if (e.target === e.currentTarget) setShowHelp(false);
    }}
  >
    <div className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column">

      {/* HEADER */}
      <div className="hrms-modal-header">
        <h5 className="hrms-modal-title d-flex align-items-center">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Icon
              icon="heroicons:question-mark-circle"
              style={{ fontSize: 24, color: "#fff" }}
            />
          </div>

          <div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              Onboarding Forms Guide
            </div>
            <div style={{ fontSize: "0.9rem", color: "#6B7280" }}>
              Everything you need to know about managing onboarding forms
            </div>
          </div>
        </h5>

        <button
          className="hrms-modal-close"
          onClick={() => setShowHelp(false)}
        >
          ✖
        </button>
      </div>

      {/* BODY */}
      <div className="hrms-modal-body hrms-modal-body-scroll">

          {/* Content */}
          <div className="row g-4">
            {/* Left Column - Basic Operations */}
            <div className="col-md-6">
              <div
                className="card h-100"
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  background: "#fff",
                }}
              >
                <div
                  className="card-header"
                  style={{
                    background: "#F3F4F6",
                    borderBottom: "1px solid #E5E7EB",
                    borderRadius: "12px 12px 0 0",
                    padding: "16px 20px",
                  }}
                >
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    Basic Operations
                  </h6>
                </div>
                <div className="card-body p-4">
                  <ul
                    className="list-unstyled mb-0"
                    style={{ fontSize: "0.95rem" }}
                  >
                    <li className="mb-3 d-flex align-items-start gap-3">
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: "#DBEAFE",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          icon="heroicons:magnifying-glass"
                          style={{ fontSize: 16, color: "#1D4ED8" }}
                        />
                      </div>
                      <div>
                        <strong className="text-primary">Search</strong> -
                        Find candidates by name, email, or mobile number
                      </div>
                    </li>
                    <li className="mb-3 d-flex align-items-start gap-3">
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: "#D1FAE5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          icon="heroicons:funnel"
                          style={{ fontSize: 16, color: "#047857" }}
                        />
                      </div>
                      <div>
                        <strong className="text-success">Filter</strong> -
                        Sort forms by status: Sent, Pending, Approved,
                        Rejected
                      </div>
                    </li>
                    <li className="mb-3 d-flex align-items-start gap-3">
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: "#FEF3C7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          icon="heroicons:document-text"
                          style={{ fontSize: 16, color: "#B45309" }}
                        />
                      </div>
                      <div>
                        <strong className="text-warning">
                          View Form
                        </strong>{" "}
                        - Click to see complete onboarding details
                      </div>
                    </li>
                    <li className="d-flex align-items-start gap-3">
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: "#FEE2E2",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          icon="heroicons:trash"
                          style={{ fontSize: 16, color: "#DC2626" }}
                        />
                      </div>
                      <div>
                        <strong className="text-danger">Delete</strong> -
                        Permanently remove onboarding forms from the
                        system
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Action Buttons */}
            <div className="col-md-6">
              <div
                className="card h-100"
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  background: "#fff",
                }}
              >
                <div
                  className="card-header"
                  style={{
                    background: "#F3F4F6",
                    borderBottom: "1px solid #E5E7EB",
                    borderRadius: "12px 12px 0 0",
                    padding: "16px 20px",
                  }}
                >
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    Action Buttons
                  </h6>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    {/* Edit Button */}
                    <div className="col-12 mb-3">
                      <div
                        className="d-flex flex-column align-items-center p-3"
                        style={{
                          border: "1px solid #E5E7EB",
                          borderRadius: 12,
                          background: "#EFF6FF",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: "#3B82F6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 12,
                          }}
                        >
                          <Icon
                            icon="heroicons:pencil"
                            style={{ fontSize: 18, color: "#fff" }}
                          />
                        </div>
                        <h6 className="fw-bold mb-1">Edit</h6>
                        <p
                          className="text-muted text-center mb-0"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Update form details and information
                        </p>
                      </div>
                    </div>

                    {/* Approve Button */}
                    <div className="col-12 mb-3">
                      <div
                        className="d-flex flex-column align-items-center p-3"
                        style={{
                          border: "1px solid #E5E7EB",
                          borderRadius: 12,
                          background: "#FFFBEB",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            background: "#F59E0B",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 12,
                          }}
                        >
                          <Icon
                            icon="heroicons:bolt"
                            style={{ fontSize: 18, color: "#fff" }}
                          />
                        </div>
                        <h6 className="fw-bold mb-1">Approve</h6>
                        <p
                          className="text-muted text-center mb-0"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Approve submitted onboarding forms
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Guide */}
          <div className="col-12 mt-4">
            <div
              className="p-3"
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                background: "#F9FAFB",
              }}
            >
              <h6 className="fw-bold mb-3" style={{ fontSize: "0.9rem" }}>
                <Icon
                  icon="heroicons:flag"
                  className="me-2"
                  style={{ color: "#6B7280" }}
                />
                Status Guide
              </h6>
              <div className="d-flex flex-wrap gap-2">
                <span
                  className="badge"
                  style={{
                    background: "#10B981",
                    padding: "6px 12px",
                    borderRadius: 20,
                  }}
                >
                  Approved
                </span>
                <span
                  className="badge"
                  style={{
                    background: "#F59E0B",
                    padding: "6px 12px",
                    borderRadius: 20,
                  }}
                >
                  Pending
                </span>
                <span
                  className="badge"
                  style={{
                    background: "#EF4444",
                    padding: "6px 12px",
                    borderRadius: 20,
                  }}
                >
                  Rejected
                </span>
                <span
                  className="badge"
                  style={{
                    background: "#3B82F6",
                    padding: "6px 12px",
                    borderRadius: 20,
                  }}
                >
                  Sent
                </span>
              </div>
            </div>
          </div>
          
          {/* Footer with Quick Tips */}
          <div className="mt-4 pt-4 border-top">
            <div className="d-flex align-items-start gap-3">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon
                  icon="heroicons:light-bulb"
                  style={{ fontSize: 20, color: "#D97706" }}
                />
              </div>
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-2">Pro Tips</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <Icon
                        icon="heroicons:check-circle"
                        style={{ color: "#10B981", fontSize: 14 }}
                      />
                      <span style={{ fontSize: "0.9rem" }}>
                        Forms auto-sync across browser tabs
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <Icon
                        icon="heroicons:check-circle"
                        style={{ color: "#10B981", fontSize: 14 }}
                      />
                      <span style={{ fontSize: "0.9rem" }}>
                        Use Load button to refresh data
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <Icon
                        icon="heroicons:check-circle"
                        style={{ color: "#10B981", fontSize: 14 }}
                      />
                      <span style={{ fontSize: "0.9rem" }}>
                        Export option available in settings
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <Icon
                        icon="heroicons:check-circle"
                        style={{ color: "#10B981", fontSize: 14 }}
                      />
                      <span style={{ fontSize: "0.9rem" }}>
                        Bulk actions coming soon
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
      </div>

      {/* FOOTER */}
      <div className="modal-footer bg-white border-top d-flex justify-content-between">
        <div></div>

        <button
          className="btn btn-warning px-4 py-2"
          onClick={() => setShowHelp(false)}
          style={{
            borderRadius: 8,
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon icon="heroicons:check" />
          Got it, thanks!
        </button>
      </div>

    </div>
  </div>
)}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1055,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelDelete();
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "420px", width: "100%" }}
          >
            <div
              className="modal-content border-0 shadow-lg"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Modal Header */}
              <div
                className="modal-header bg-danger text-light"
                style={{
                  borderBottom: "1px solid #FECACA",
                  padding: "24px 24px 20px",
                }}
              >
                <div className="d-flex align-items-center gap-3 w-100">
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-0">Delete Form</h5>
                    <p
                      className="text-light mb-0"
                      style={{ fontSize: "0.875rem" }}
                    >
                      Confirm deletion
                    </p>
                  </div>
                  <button
                    className="btn btn-light fw-bold p-1 d-flex align-items-center justify-content-center"
                    onClick={cancelDelete}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                    }}
                  >
                    <Icon
                      icon="heroicons:x-mark"
                      className="text-dark"
                      style={{ fontSize: "18px" }}
                    />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4">
                {/* Candidate Info */}
                <div className="text-center mb-4">
                  <div
                    style={{
                      padding: "16px",
                      background: "#F9FAFB",
                      borderRadius: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <Icon
                        icon="heroicons:user-circle"
                        style={{
                          fontSize: 20,
                          color: "#6B7280",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "1rem",
                          color: "#6B7280",
                          fontWeight: 500,
                        }}
                      >
                        Candidate
                      </span>
                    </div>
                    <h4 className="fw-bold mb-0" style={{ color: "#DC2626" }}>
                      {deleteCandidateName}
                    </h4>
                  </div>

                  <p
                    className="text-muted"
                    style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
                  >
                    Are you sure you want to permanently delete this onboarding
                    form?
                  </p>
                </div>

                {/* Warning Alert */}
                <div
                  className="mb-4"
                  style={{
                    padding: "12px 16px",
                    background: "#FEF3C7",
                    border: "1px solid #FBBF24",
                    borderRadius: "8px",
                  }}
                >
                  <div className="d-flex align-items-start gap-3">
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "6px",
                        background: "#F59E0B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      <Icon
                        icon="heroicons:exclamation-triangle"
                        style={{
                          fontSize: 14,
                          color: "#FFFFFF",
                        }}
                      />
                    </div>
                    <div>
                      <h6
                        className="fw-bold mb-1"
                        style={{ color: "#92400E", fontSize: "0.875rem" }}
                      >
                        Irreversible Action
                      </h6>
                      <p
                        className="mb-0"
                        style={{
                          color: "#92400E",
                          fontSize: "0.8125rem",
                          lineHeight: "1.4",
                        }}
                      >
                        This action cannot be undone. All associated data will
                        be permanently removed from the system.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 mt-4">
                  <button
                    className="btn flex-fill"
                    onClick={cancelDelete}
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      fontWeight: 600,
                      background: "#FFFFFF",
                      color: "#374151",
                      border: "2px solid #D1D5DB",
                      transition: "all 0.2s",
                      fontSize: "0.9375rem",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger text-light flex-fill"
                    onClick={confirmDelete}
                    style={{
                      borderRadius: "8px",
                      padding: "12px",
                      fontWeight: 600,
                      background: "#DC2626",
                      color: "#FFFFFF",
                      border: "none",
                      transition: "all 0.2s",
                      fontSize: "0.9375rem",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <Icon icon="heroicons:trash" style={{ fontSize: 16 }} />
                      <span>Delete</span>
                    </div>
                  </button>
                </div>

                {/* Additional Info */}
                <div
                  className="text-center mt-4 pt-3"
                  style={{
                    borderTop: "1px solid #E5E7EB",
                    fontSize: "0.8125rem",
                    color: "#6B7280",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <Icon
                      icon="heroicons:information-circle"
                      style={{ fontSize: 16, color: "#9CA3AF" }}
                    />
                    <span>You can restore from backup if needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}