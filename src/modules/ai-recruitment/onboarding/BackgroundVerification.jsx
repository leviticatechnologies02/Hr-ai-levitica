import React, { useRef, useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  sendEmail,
  sendBulkEmails,
  copyEmailToClipboard,
  generateMailtoLink,
} from "../../../shared/services/emailService";

const BackgroundVerification = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [activeSection, setActiveSection] = useState("configuration");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState("");
  // Add these to your existing useState declarations
  const [newRequestPhone, setNewRequestPhone] = useState("");
  const [newRequestDepartment, setNewRequestDepartment] = useState("");
  const [newRequestDesignation, setNewRequestDesignation] = useState("");
  const [newRequestEmployeeId, setNewRequestEmployeeId] = useState("");
  // Add these to your useState declarations
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  // Add these state variables with your other useState declarations
  const [emailUploads, setEmailUploads] = useState([]);
  const [emailUploadedDocuments, setEmailUploadedDocuments] = useState([]);
  // Add these state variables with your other useState declarations
  const [isExperienced, setIsExperienced] = useState(false);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [currentOrganization, setCurrentOrganization] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [previousExperiences, setPreviousExperiences] = useState([]);
  // Add this with your other state declarations
  const [globalUploadedDocuments, setGlobalUploadedDocuments] = useState([]);
  // Personal Information - NEW FIELDS
const [newRequestDob, setNewRequestDob] = useState("");
const [newRequestGender, setNewRequestGender] = useState("");
const [newRequestMaritalStatus, setNewRequestMaritalStatus] = useState("");

// Parent/Guardian Details - NEW FIELDS
const [newRequestParentName, setNewRequestParentName] = useState("");
const [newRequestParentRelationship, setNewRequestParentRelationship] = useState("");
const [newRequestParentPhone, setNewRequestParentPhone] = useState("");
const [newRequestParentEmail, setNewRequestParentEmail] = useState("");
const [newRequestParentEmployment, setNewRequestParentEmployment] = useState("");
const [newRequestParentOrganization, setNewRequestParentOrganization] = useState("");
const [newRequestParentDesignation, setNewRequestParentDesignation] = useState("");
const [newRequestParentIncome, setNewRequestParentIncome] = useState("");
const [newRequestParentAddress, setNewRequestParentAddress] = useState("");
const [newRequestIsGuardian, setNewRequestIsGuardian] = useState(false);

// Add these state variables with your other useState declarations
const [educationQualifications, setEducationQualifications] = useState([]);
const [showEducationForm, setShowEducationForm] = useState(false);
const [editingEducation, setEditingEducation] = useState(null);

// Education form fields
const [educationLevel, setEducationLevel] = useState("");
const [schoolCollegeName, setSchoolCollegeName] = useState("");
const [boardUniversity, setBoardUniversity] = useState("");
const [passingYear, setPassingYear] = useState("");
const [joiningYear, setJoiningYear] = useState("");
const [degree, setDegree] = useState("");
const [branch, setBranch] = useState("");
const [percentage, setPercentage] = useState("");
const [cgpa, setCgpa] = useState("");
const [gradingSystem, setGradingSystem] = useState("percentage"); // 'percentage' or 'cgpa'

  const [experienceOrgName, setExperienceOrgName] = useState("");
  const [experienceRole, setExperienceRole] = useState("");
  const [experienceType, setExperienceType] = useState("");
  const [experienceLocation, setExperienceLocation] = useState("");
  const [experienceSalary, setExperienceSalary] = useState("");
  const [experienceJoiningDate, setExperienceJoiningDate] = useState("");
  const [experienceRelievingDate, setExperienceRelievingDate] = useState("");
  const [experienceHistory, setExperienceHistory] = useState([]);
  {
    /* Add these new state variables at the top of your component with other useState declarations */
  }
  const [currentAddress, setCurrentAddress] = useState({
    address1: "",
    address2: "",
    country: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    Nationality: "",
  });

  const [permanentAddress, setPermanentAddress] = useState({
    address1: "",
    address2: "",
    country: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    Nationality: "",
  });

  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  // Add these near your other useState declarations
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Add these state variables with your other useState declarations
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editEmployeeName, setEditEmployeeName] = useState("");
  const [editEmployeePhone, setEditEmployeePhone] = useState("");
  const [editEmployeeEmail, setEditEmployeeEmail] = useState("");
  const [editEmployeeDepartment, setEditEmployeeDepartment] = useState("");
  const [editEmployeeDesignation, setEditEmployeeDesignation] = useState("");
  const [editEmployeeId, setEditEmployeeId] = useState("");
  const [emailSubject, setEmailSubject] = useState(
    "Background Verification - Document Request",
  );

  const [documentRequests, setDocumentRequests] = useState([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ type: "", message: "" });
  const [emailMethod, setEmailMethod] = useState("api"); // 'api', 'clipboard', 'mailto'
  const [ccEmails, setCcEmails] = useState("");
  const [bccEmails, setBccEmails] = useState("");
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [newRequestEmail, setNewRequestEmail] = useState("");
  const [newRequestName, setNewRequestName] = useState("");
  const [newRequestTemplate, setNewRequestTemplate] = useState("");
  const [newRequestSubject, setNewRequestSubject] = useState(
    "Background Verification - Document Request",
  );

  // Add this function with your other functions
  const getRequiredDocuments = () => {
    const baseDocuments = [
      { id: "aadhar", name: "Aadhar Card", required: true },
      { id: "pan", name: "PAN Card", required: true },
      { id: "passport", name: "Passport", required: false },
      { id: "driving", name: "Driving License", required: false },
      { id: "education", name: "Education Certificates", required: true },
      { id: "address", name: "Address Proof", required: true },
      { id: "bank", name: "Bank Statement", required: false },
      { id: "photo", name: "Passport Size Photo", required: true },
      { id: "intership", name: "InterShip Certificates", required: false },
    ];

    // If experienced, add experience-related documents
    if (isExperienced) {
      return [
        ...baseDocuments,
        {
          id: "experience_letters",
          name: "Experience Letters",
          required: true,
        },
        { id: "payslips", name: "Payslips", required: true },
        { id: "form16", name: "Form 16 ", required: true },
        { id: "pf_uan", name: "PF/UAN Details", required: true },
      ];
    }

    // For freshers, only include basic documents
    return baseDocuments;
  };
  // Required documents list
  const requiredDocuments = useMemo(
    () => getRequiredDocuments(),
    [isExperienced],
  );

  // Load employees from localStorage
  useEffect(() => {
    loadEmployees();
    loadDocumentRequests();
  }, []);

  const loadEmployees = () => {
    const savedProfiles = localStorage.getItem("employeeProfiles");
    if (savedProfiles) {
      const profiles = JSON.parse(savedProfiles);
      const employeeList = profiles.map((profile) => ({
        id: profile.employeeId || profile.id,
        employeeId: profile.employeeId,
        name: `${profile.firstName} ${profile.middleName ? profile.middleName + " " : ""}${profile.lastName}`.trim(),
        email: profile.officialEmail || profile.email,
        phone: profile.phone,
        department: profile.department,
        designation: profile.designation,
        joiningDate: profile.joiningDate,
        status: profile.bgvStatus || "Not Started",
        candidateId: profile.candidateId,
      }));
      setEmployees(employeeList);
    } else {
      // Sample data if no profiles exist
      const sampleEmployees = [
        {
          id: "EMP001",
          employeeId: "EMP001",
          name: "Rajesh Kumar",
          email: "rajesh.kumar@company.com",
          phone: "+91 98765 43210",
          department: "Engineering",
          designation: "Software Engineer",
          joiningDate: new Date().toISOString().split("T")[0],
          status: "Pending",
          candidateId: "CAND001",
        },
        {
          id: "EMP002",
          employeeId: "EMP002",
          name: "Priya Sharma",
          email: "priya.sharma@company.com",
          phone: "+91 98765 43211",
          department: "Marketing",
          designation: "Marketing Executive",
          joiningDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          status: "In Progress",
          candidateId: "CAND002",
        },
        {
          id: "EMP003",
          employeeId: "EMP003",
          name: "Amit Kumar Patel",
          email: "amit.patel@company.com",
          phone: "+91 98765 43212",
          department: "Sales",
          designation: "Sales Manager",
          joiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          status: "Completed",
          candidateId: "CAND003",
        },
      ];
      setEmployees(sampleEmployees);
    }
  };

const loadDocumentRequests = () => {
  const savedRequests = localStorage.getItem("bgvDocumentRequests");
  if (savedRequests) {
    const parsedRequests = JSON.parse(savedRequests);

    // ===== FIXED: ENSURE ALL FIELDS EXIST IN OLD REQUESTS =====
    const updatedRequests = parsedRequests.map((request) => ({
      ...request,
      // Personal Information
      dateOfBirth: request.dateOfBirth || request.dob || "",
      gender: request.gender || "",
      maritalStatus: request.maritalStatus || "",
      
      // Personal Info object (standardized)
      personalInfo: request.personalInfo || {
        dob: request.dateOfBirth || request.dob || "",
        gender: request.gender || "",
        maritalStatus: request.maritalStatus || ""
      },
      
      // Parent/Guardian Details - Handle multiple possible structures
      parentGuardian: request.parentGuardian || 
                      request.parentGuardianDetails || 
                      {
                        name: request.parentName || request.parentGuardianDetails?.name || "",
                        relationship: request.parentRelationship || request.parentGuardianDetails?.relationship || "",
                        phone: request.parentPhone || request.parentGuardianDetails?.phone || "",
                        employment: request.parentEmployment || request.parentGuardianDetails?.employment || "",
                        organization: request.parentOrganization || request.parentGuardianDetails?.organization || "",
                        designation: request.parentDesignation || request.parentGuardianDetails?.designation || "",
                        isLegalGuardian: request.isGuardian || request.parentGuardianDetails?.isGuardian || false
                      },
      
      // Education Qualifications - Ensure it's an array
      educationQualifications: Array.isArray(request.educationQualifications) 
        ? request.educationQualifications 
        : request.educationQualifications 
          ? [request.educationQualifications] // Convert object to array
          : request.education 
            ? (Array.isArray(request.education) ? request.education : [request.education])
            : [],
      
      // Department & Designation
      department: request.department || "",
      designation: request.designation || "",
      phone: request.phone || "",
      
      // Address fields
      currentAddress: request.currentAddress || {
        address1: "",
        address2: "",
        country: "",
        state: "",
        district: "",
        city: "",
        pincode: "",
        nationality: "",
      },
      permanentAddress: request.permanentAddress || {
        address1: "",
        address2: "",
        country: "",
        state: "",
        district: "",
        city: "",
        pincode: "",
        nationality: "",
      },
      sameAsCurrentAddress: request.sameAsCurrentAddress || false,
      
      // Experience fields
      isExperienced: request.isExperienced || false,
      yearsOfExperience: request.yearsOfExperience || "",
      experienceData: request.experienceData || request.experience || null,
      
      // Completed date
      completedDate: request.completedDate || null,
      addressVerified: request.addressVerified || null
    }));

    setDocumentRequests(updatedRequests);
  }
};

  const saveDocumentRequests = (requests) => {
    localStorage.setItem("bgvDocumentRequests", JSON.stringify(requests));
    setDocumentRequests(requests);
  };

  // Handle document upload
  const handleDocumentUpload = (event, documentId) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload PDF, JPG, PNG, or DOC files only");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size should be less than 5MB");
      return;
    }

    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);

    const newUploadedDoc = {
      id: documentId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      fileUrl: fileUrl,
      file: file, // Store the file object for later use
    };

    setUploadedDocuments((prev) => {
      // Remove if already exists
      const filtered = prev.filter((doc) => doc.id !== documentId);
      return [...filtered, newUploadedDoc];
    });

    // Reset the file input
    event.target.value = "";
  };

  // Function to handle replacing a document in new uploads
  const handleReplaceDocument = (docId, newFile) => {
    // Create object URL for preview
    const fileUrl = URL.createObjectURL(newFile);

    // Create updated document object
    const updatedDoc = {
      id: docId,
      name: newFile.name,
      file: newFile,
      fileUrl: fileUrl,
      size: newFile.size,
      type: newFile.type,
      uploadDate: new Date().toISOString(),
    };

    // Update the uploadedDocuments array
    setUploadedDocuments((prev) => {
      // First, revoke old URL if exists
      const oldDoc = prev.find((d) => d.id === docId);
      if (oldDoc && oldDoc.fileUrl) {
        URL.revokeObjectURL(oldDoc.fileUrl);
      }

      // Replace the document
      return prev.map((doc) => (doc.id === docId ? updatedDoc : doc));
    });

    // Show success message
    setEmailStatus({
      type: "success",
      message: "Document replaced successfully",
    });
  };

  const handleReplaceDocumentClick = (
    docId,
    isFromExistingRequest = false,
    existingDoc = null,
  ) => {
    // Create a hidden file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
    input.style.display = "none";

    input.onchange = (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          setEmailStatus({
            type: "error",
            message: `File size exceeds 5MB limit. Selected file: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          });
          document.body.removeChild(input);
          return;
        }

        // Validate file type
        const validTypes = [
          "application/pdf",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!validTypes.includes(file.type)) {
          setEmailStatus({
            type: "error",
            message:
              "Invalid file type. Please upload PDF, JPG, PNG, or DOC files only.",
          });
          document.body.removeChild(input);
          return;
        }

        if (isFromExistingRequest) {
          handleUpdateExistingDocument(docId, file, existingDoc);
        } else {
          // For new uploads, use handleReplaceDocument
          const fileUrl = URL.createObjectURL(file);

          const updatedDoc = {
            id: docId,
            name: file.name,
            file: file,
            fileUrl: fileUrl,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString(),
          };

          // Update the uploadedDocuments array
          setUploadedDocuments((prev) => {
            // First, revoke old URL if exists
            const oldDoc = prev.find((d) => d.id === docId);
            if (oldDoc && oldDoc.fileUrl) {
              URL.revokeObjectURL(oldDoc.fileUrl);
            }

            // Replace the document
            return prev.map((doc) => (doc.id === docId ? updatedDoc : doc));
          });

          setEmailStatus({
            type: "success",
            message: "Document replaced successfully",
          });
        }
      }

      // Clean up the temporary input
      document.body.removeChild(input);
    };

    // Add to body and trigger click
    document.body.appendChild(input);
    input.click();
  };
  // Function to handle updating existing document requests
  const handleUpdateExistingDocument = async (docId, newFile, existingDoc) => {
    try {
      const fileUrl = URL.createObjectURL(newFile);

      // Create a new version object
      const newVersion = {
        id: docId,
        name: newFile.name,
        file: newFile,
        fileUrl: fileUrl,
        size: newFile.size,
        type: newFile.type,
        uploadDate: new Date().toISOString(),
        isUpdate: true,
        originalDocId: existingDoc?.id,
        originalDocument: existingDoc?.originalDocument,
      };

      // Add to uploadedDocuments as an update
      setUploadedDocuments((prev) => {
        // Check if there's already an update for this document
        const existingUpdateIndex = prev.findIndex(
          (d) => d.id === docId && d.isUpdate,
        );

        if (existingUpdateIndex >= 0) {
          // Replace existing update
          const updated = [...prev];
          if (updated[existingUpdateIndex].fileUrl) {
            URL.revokeObjectURL(updated[existingUpdateIndex].fileUrl);
          }
          updated[existingUpdateIndex] = newVersion;
          return updated;
        } else {
          // Add new update
          return [...prev, newVersion];
        }
      });

      setEmailStatus({
        type: "success",
        message:
          "Document update queued. It will replace the existing document when email is sent.",
      });
    } catch (error) {
      setEmailStatus({
        type: "error",
        message: "Failed to update document: " + error.message,
      });
    }
  };

  const loadDocumentsFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem("bgvUploadedDocuments");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading documents from localStorage:", error);
      return [];
    }
  };

  // Load documents on component mount
  useEffect(() => {
    const savedDocuments = loadDocumentsFromLocalStorage();
    if (savedDocuments.length > 0) {
      setUploadedDocuments(savedDocuments);
    }
  }, []);

  // Handle remove document
  const handleRemoveDocument = (docId) => {
    setUploadedDocuments((prevDocs) => {
      const docToRemove = prevDocs.find((d) => d.id === docId);

      // Clean up object URL (important)
      if (docToRemove?.fileUrl) {
        URL.revokeObjectURL(docToRemove.fileUrl);
      }

      // Remove ONLY from local session uploads
      return prevDocs.filter((d) => d.id !== docId);
    });
  };

  // Handle re-upload/replace document
  const handleReuploadDocument = (event, documentId) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setEmailStatus({
        type: "error",
        message: "Please upload PDF, JPG, PNG, or DOC files only",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setEmailStatus({
        type: "error",
        message: "File size should be less than 5MB",
      });
      return;
    }

    // Find the existing document to revoke its URL
    const existingDoc = uploadedDocuments.find((doc) => doc.id === documentId);
    if (existingDoc && existingDoc.fileUrl) {
      URL.revokeObjectURL(existingDoc.fileUrl);
    }

    // Create a new preview URL
    const fileUrl = URL.createObjectURL(file);

    const updatedDoc = {
      id: documentId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      fileUrl: fileUrl,
      file: file,
    };

    setUploadedDocuments((prev) => {
      // Remove old document and add new one
      const filtered = prev.filter((doc) => doc.id !== documentId);
      return [...filtered, updatedDoc];
    });

    // Show success message
    setEmailStatus({
      type: "success",
      message: "Document updated successfully!",
    });

    // Reset the file input
    event.target.value = "";
  };

  // Add these functions
  const handleEmailDocumentUpload = (e, docId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);

    setUploadedDocuments((prev) => {
      // remove old entry for same doc
      const filtered = prev.filter((d) => d.id !== docId);
      return [
        ...filtered,
        {
          id: docId,
          name: file.name,
          size: file.size,
          type: file.type,
          fileUrl: blobUrl, // ✅ VALID
          uploadDate: new Date().toISOString(),
          file, // keep original file
        },
      ];
    });
  };

  const handleViewDocument = (document) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, "_blank");
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle employee selection
  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((id) => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.id));
    }
  };

  // Generate personalized email template
  const generateEmailTemplate = (employeeName) => {
    return `Dear ${employeeName},\n\nWe hope this email finds you well.\n\nAs part of our standard background verification process, we require the following documents from you:\n\n${requiredDocuments
      .filter((doc) => doc.required)
      .map((doc) => `- ${doc.name}`)
      .join(
        "\n",
      )}\n\nPlease submit scanned copies (PDF format) of these documents at your earliest convenience.\n\nYou can upload the documents through our employee portal or send them via email reply.\n\nIf you have any questions or concerns, please feel free to contact us.\n\nBest regards,\nHR Team\n\n---\nThis is an automated email. Please do not reply directly to this message.`;
  };

  // Handle new request modal open
  const handleNewRequest = () => {
    // Reset all form fields to empty/default values
    setNewRequestEmail("");
    setNewRequestName("");
    setNewRequestPhone("");
    setNewRequestDepartment("");
    setNewRequestDesignation("");
    setNewRequestEmployeeId("");
    setNewRequestDob("");
    setNewRequestGender("");
    setNewRequestMaritalStatus("");

    setNewRequestParentName("");
    setNewRequestParentRelationship("");
    setNewRequestParentPhone("");
    setNewRequestParentEmployment("");
    setNewRequestParentOrganization("");
    setNewRequestParentDesignation("");
    setNewRequestIsGuardian(false);
    // ========== EDUCATION QUALIFICATION RESET ==========
  // Clear all education qualifications array
  setEducationQualifications([]);
  // Reset education form state
  setShowEducationForm(false);
  setEditingEducation(null);
  // Reset education form fields
  setEducationLevel("");
  setSchoolCollegeName("");
  setBoardUniversity("");
  setPassingYear("");
  setJoiningYear("");
  setDegree("");
  setBranch("");
  setPercentage("");
  setCgpa("");
  setGradingSystem("percentage");
    setNewRequestSubject("Background Verification - Document Request");
    setIsExperienced(false);
    setYearsOfExperience("");
    setCurrentOrganization("");
    setCurrentRole("");
    setEmploymentType("");
    setExperienceLocation("");
    setCurrentSalary("");
    setNoticePeriod("");
    setPreviousExperiences([]);
    setExperienceOrgName("");
    setExperienceRole("");
    setExperienceType("");
    setExperienceLocation("");
    setExperienceSalary("");
    setExperienceJoiningDate("");
    setExperienceRelievingDate("");
    setExperienceHistory([]);
    setCurrentAddress({
      address1: "",
      address2: "",
      country: "",
      state: "",
      district: "",
      city: "",
      pincode: "",
      nationality: "",
    });
    setPermanentAddress({
      address1: "",
      address2: "",
      country: "",
      state: "",
      district: "",
      city: "",
      pincode: "",
      nationality: "",
    });
    setSameAsCurrent(false);

    // Reset the email template to default
    const defaultTemplate = `Dear [Employee Name],\n\nWe hope this email finds you well.\n\nAs part of our standard background verification process, we require the following documents from you:\n\n${getRequiredDocuments()
      .filter((doc) => doc.required)
      .map((doc) => `- ${doc.name}`)
      .join(
        "\n",
      )}\n\nPlease submit scanned copies (PDF format) of these documents at your earliest convenience.\n\nYou can upload the documents through our employee portal or send them via email reply.\n\nIf you have any questions or concerns, please feel free to contact us.\n\nBest regards,\nHR Team\n\n---\nThis is an automated email. Please do not reply directly to this message.`;

    setNewRequestTemplate(defaultTemplate);

    // Reset email settings
    setCcEmails("");
    setBccEmails("");
    setEmailMethod("api"); // Reset to default method

    // Reset experience fields
    setIsExperienced(false);
    setYearsOfExperience("");
    setCurrentOrganization("");
    setCurrentRole("");
    setEmploymentType("");
    setExperienceLocation("");
    setCurrentSalary("");
    setNoticePeriod("");
    setPreviousExperiences([]);
    setExperienceOrgName("");
    setExperienceRole("");
    setExperienceType("");
    setExperienceLocation("");
    setExperienceSalary("");
    setExperienceJoiningDate("");
    setExperienceRelievingDate("");
    setExperienceHistory([]);

    // IMPORTANT: Clear all uploaded documents from previous sessions
    // First revoke all object URLs to prevent memory leaks
    uploadedDocuments.forEach((doc) => {
      if (doc.fileUrl) {
        URL.revokeObjectURL(doc.fileUrl);
      }
    });

    // Then clear the uploadedDocuments array
    setUploadedDocuments([]);

    // Clear any previous status messages
    setEmailStatus({ type: "", message: "" });

    // Clear sending state
    setSendingEmail(false);

    // Finally, open the modal
    setShowNewRequestModal(true);
  };

  // Handle send new request
  const handleSendNewRequest = async () => {
    // Replace alerts with setEmailStatus
    if (!newRequestEmail.trim() || !newRequestName.trim()) {
      setEmailStatus({ type: "error", message: "Please enter email and name" });
      return;
    }

    if (!newRequestTemplate.trim() || !newRequestSubject.trim()) {
      setEmailStatus({
        type: "error",
        message: "Please enter subject and email template",
      });
      return;
    }

    setSendingEmail(true);
    setEmailStatus({ type: "info", message: "Sending email..." });

    const timestamp = new Date().toISOString();

    try {
      let emailResult;

      // Personalize template with name
      const personalizedTemplate = newRequestTemplate
        .replace(/\[Employee Name\]/g, newRequestName)
        .replace(/Dear\s+[^,\n]+/, `Dear ${newRequestName}`);

      if (emailMethod === "api") {
        emailResult = await sendBulkEmails(
          [{ email: newRequestEmail, name: newRequestName }],
          newRequestSubject,
          () => personalizedTemplate,
          {
            cc: ccEmails
              ? ccEmails
                  .split(",")
                  .map((e) => e.trim())
                  .filter((e) => e)
              : null,
            bcc: bccEmails
              ? bccEmails
                  .split(",")
                  .map((e) => e.trim())
                  .filter((e) => e)
              : null,
          },
        );
      } else if (emailMethod === "clipboard") {
        const emailContent = `To: ${newRequestEmail}\n${ccEmails ? `CC: ${ccEmails}\n` : ""}${bccEmails ? `BCC: ${bccEmails}\n` : ""}Subject: ${newRequestSubject}\n\n${personalizedTemplate}`;
        await navigator.clipboard.writeText(emailContent);
        emailResult = { success: 1, failed: 0 };
        setEmailStatus({
          type: "success",
          message:
            "Email content copied to clipboard! Please paste it into your email client and send.",
        });
      } else if (emailMethod === "mailto") {
        const mailtoLink = generateMailtoLink(
          newRequestEmail,
          newRequestSubject,
          personalizedTemplate,
        );
        window.location.href = mailtoLink;
        emailResult = { success: 1, failed: 0 };
        setEmailStatus({
          type: "success",
          message: "Opening email client...",
        });
      }

      if (emailResult && emailResult.success > 0) {
        // Generate employee ID if not provided
        const employeeId = newRequestEmployeeId.trim() || `EXT-${Date.now()}`;

        // Check if all required documents are uploaded
        const allRequiredUploaded = requiredDocuments
          .filter((doc) => doc.required)
          .every((doc) => uploadedDocuments.some((ud) => ud.id === doc.id));

        // Determine initial status based on upload completion
        const initialStatus = allRequiredUploaded
          ? "Completed"
          : "Request Sent";

        const newRequest = {
          id: Date.now() + Math.random(),
          employeeId: employeeId,
          employeeName: newRequestName,
          phone: newRequestPhone,
          dateOfBirth: newRequestDob,
          gender: newRequestGender,
          maritalStatus: newRequestMaritalStatus,
          parentGuardianDetails: {
            name: newRequestParentName,
            relationship: newRequestParentRelationship,
            phone: newRequestParentPhone,
            employment: newRequestParentEmployment,
            organization: newRequestParentOrganization,
            designation: newRequestParentDesignation,
            isGuardian: newRequestIsGuardian,
          },
          educationQualifications: {
              educationLevel: educationLevel,
              schoolCollegeName: schoolCollegeName,
              boardUniversity: boardUniversity,
              passingYear: passingYear,
              joiningYear: joiningYear,
              degree: degree,
              branch: branch,
              percentage: percentage,
              cgpa: cgpa,
              gradingSystem: gradingSystem,

          },
          isExperienced: isExperienced,
          department: newRequestDepartment,
          designation: newRequestDesignation,
          email: newRequestEmail,
          status: initialStatus,
          requestedDate: timestamp,
          yearsOfExperience: isExperienced ? yearsOfExperience : null,
          experienceData: isExperienced
            ? {
                yearsOfExperience: yearsOfExperience,
                currentOrganization: currentOrganization,
                currentRole: currentRole,
                employmentType: employmentType,
                location: experienceLocation, // Keep as location, not experienceLocation
                currentSalary: currentSalary,
                noticePeriod: noticePeriod,
                joiningDate: experienceJoiningDate,
                relievingDate: experienceRelievingDate,

                previousExperiences: previousExperiences.map((exp) => ({
                  id: exp.id || Date.now() + Math.random(),
                  organization: exp.organization,
                  role: exp.role,
                  type: exp.type,
                  location: exp.location,
                  salary: exp.salary,
                  years: exp.years,
                  fromDate: exp.fromDate,
                  toDate: exp.toDate,
                })),
              }
            : null,
          // Add address information
          currentAddress: {
            address1: currentAddress.address1,
            address2: currentAddress.address2,
            country: currentAddress.country,
            state: currentAddress.state,
            district: currentAddress.district,
            city: currentAddress.city,
            pincode: currentAddress.pincode,
            nationality: currentAddress.Nationality || "",
          },
          permanentAddress: {
            address1: permanentAddress.address1,
            address2: permanentAddress.address2,
            country: permanentAddress.country,
            state: permanentAddress.state,
            district: permanentAddress.district,
            city: permanentAddress.city,
            pincode: permanentAddress.pincode,
          },
          sameAsCurrentAddress: sameAsCurrent,

          experienceDetails: isExperienced
            ? {
                orgName: experienceOrgName,
                role: experienceRole,
                type: experienceType,
                location: experienceLocation,
                salary: experienceSalary,
                joiningDate: experienceJoiningDate,
                relievingDate: experienceRelievingDate,
              }
            : null,
          experienceHistory: isExperienced ? experienceHistory : [],
          documents: getRequiredDocuments().map((doc) => {
            const uploadedDoc = uploadedDocuments.find(
              (ud) => ud.id === doc.id,
            );
            return {
              id: doc.id,
              name: doc.name,
              required: doc.required,
              status: uploadedDoc ? "Completed" : "Pending",
              uploadedDate: uploadedDoc ? uploadedDoc.uploadDate : null,
              fileUrl: uploadedDoc ? uploadedDoc.fileUrl : null,
              fileName: uploadedDoc ? uploadedDoc.name : null,
              fileType: uploadedDoc ? uploadedDoc.type : null,
              fileSize: uploadedDoc ? uploadedDoc.size : null,
            };
          }),
          emailSent: true,
          emailSentDate: timestamp,
          emailMethod: emailMethod,
          completedDate: allRequiredUploaded ? timestamp : null,
          // Store the actual uploaded files if needed
          uploadedFiles: uploadedDocuments.map((doc) => ({
            id: doc.id,
            name: doc.name,
            file: doc.file,
          })),
        };

        const updatedRequests = [...documentRequests, newRequest];
        saveDocumentRequests(updatedRequests);

        // Add to employees list if not exists
        const existingEmp = employees.find(
          (emp) => emp.email === newRequestEmail,
        );
        if (!existingEmp) {
          const newEmployee = {
            id: employeeId,
            employeeId: employeeId,
            name: newRequestName,
            email: newRequestEmail,
            phone: newRequestPhone || "",
            dateOfBirth: newRequestDob,
            gender: newRequestGender,
            maritalStatus: newRequestMaritalStatus,
            department: newRequestDepartment || "External",
            designation: newRequestDesignation || "Candidate",
            joiningDate: new Date().toISOString().split("T")[0],
            status: allRequiredUploaded ? "Completed" : "In Progress",
            candidateId: `CAND-${Date.now()}`,
            educationQualifications: {
              educationLevel: educationLevel,
              schoolCollegeName: schoolCollegeName,
              boardUniversity: boardUniversity,
              passingYear: passingYear,
              joiningYear: joiningYear,
              degree: degree,
              branch: branch,
              percentage: percentage,
              cgpa: cgpa,
              gradingSystem: gradingSystem,
            },


            parentGuardianDetails: {
              name: newRequestParentName,
              relationship: newRequestParentRelationship,
              phone: newRequestParentPhone,
              employment: newRequestParentEmployment,
              organization: newRequestParentOrganization,
              designation: newRequestParentDesignation,
              isGuardian: newRequestIsGuardian,
            },
            currentAddress: {
              address1: currentAddress.address1,
              address2: currentAddress.address2,
              country: currentAddress.country,
              state: currentAddress.state,
              district: currentAddress.district,
              city: currentAddress.city,
              pincode: currentAddress.pincode,
              nationality: currentAddress.Nationality || "",
            },
            permanentAddress: {
              address1: permanentAddress.address1,
              address2: permanentAddress.address2,
              country: permanentAddress.country,
              state: permanentAddress.state,
              district: permanentAddress.district,
              city: permanentAddress.city,
              pincode: permanentAddress.pincode,
            },
            sameAsCurrentAddress: sameAsCurrent,
            // Add experience info
            isExperienced: isExperienced,
            yearsOfExperience: isExperienced ? yearsOfExperience : null,
            // Add address information

            experienceData: isExperienced
              ? {
                  yearsOfExperience: yearsOfExperience,
                  currentOrganization: currentOrganization,
                  currentRole: currentRole,
                  employmentType: employmentType,
                  location: experienceLocation,
                  currentSalary: currentSalary,
                  noticePeriod: noticePeriod,
                  joiningDate: experienceJoiningDate,
                  relievingDate: experienceRelievingDate,
                  previousExperiences: previousExperiences,
                }
              : null,
            experienceDetails: isExperienced
              ? {
                  yearsOfExperience: yearsOfExperience,
                  currentOrganization: currentOrganization,
                  currentRole: currentRole,
                  employmentType: employmentType,
                  currentSalary: currentSalary,
                  noticePeriod: noticePeriod,
                  previousExperiences: previousExperiences,

                  orgName: experienceOrgName,
                  role: experienceRole,
                  type: experienceType,
                  location: experienceLocation,
                  salary: experienceSalary,
                  joiningDate: experienceJoiningDate,
                  relievingDate: experienceRelievingDate,
                }
              : null,
            experienceHistory: isExperienced ? experienceHistory : [],
          };
          setEmployees([...employees, newEmployee]);

          // Also update localStorage employeeProfiles
          const savedProfiles = localStorage.getItem("employeeProfiles");
          if (savedProfiles) {
            const profiles = JSON.parse(savedProfiles);
            const newProfile = {
              id: employeeId,
              employeeId: employeeId,
              firstName: newRequestName.split(" ")[0] || newRequestName,
              lastName: newRequestName.split(" ").slice(1).join(" ") || "",
              officialEmail: newRequestEmail,
              email: newRequestEmail,
              phone: newRequestPhone || "",
              department: newRequestDepartment || "External",
              designation: newRequestDesignation || "Candidate",
              joiningDate: new Date().toISOString().split("T")[0],
              bgvStatus: allRequiredUploaded ? "Completed" : "In Progress",
              candidateId: `CAND-${Date.now()}`,
            };
            localStorage.setItem(
              "employeeProfiles",
              JSON.stringify([...profiles, newProfile]),
            );
          }
        } else {
          // Update existing employee status if all documents uploaded
          if (allRequiredUploaded) {
            const updatedEmployees = employees.map((emp) => {
              if (emp.email === newRequestEmail) {
                return { ...emp, status: "Completed" };
              }
              return emp;
            });
            setEmployees(updatedEmployees);

            // Update localStorage
            const savedProfiles = localStorage.getItem("employeeProfiles");
            if (savedProfiles) {
              const profiles = JSON.parse(savedProfiles);
              const updatedProfiles = profiles.map((profile) => {
                if (
                  profile.email === newRequestEmail ||
                  profile.officialEmail === newRequestEmail
                ) {
                  return { ...profile, bgvStatus: "Completed" };
                }
                return profile;
              });
              localStorage.setItem(
                "employeeProfiles",
                JSON.stringify(updatedProfiles),
              );
            }
          }
        }

        setEmailStatus({
          type: "success",
          message: allRequiredUploaded
            ? "Request sent successfully! All documents uploaded - Verification marked as Completed."
            : "Request sent successfully!",
        });

        setTimeout(() => {
          setShowNewRequestModal(false);
          // Reset all form fields
          setNewRequestEmail("");
          setNewRequestName("");
          setNewRequestPhone("");
          setNewRequestDepartment("");
          setNewRequestDesignation("");
          setNewRequestEmployeeId("");
          setNewRequestTemplate("");
          setEmailStatus({ type: "", message: "" });
          setCcEmails("");
          setBccEmails("");
          // Clear uploaded documents and revoke URLs
          uploadedDocuments.forEach((doc) => {
            if (doc.fileUrl) {
              URL.revokeObjectURL(doc.fileUrl);
            }
          });
          setUploadedDocuments([]);
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailStatus({
        type: "error",
        message: error.message || "Failed to send email. Please try again.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Handle send email
  const handleSendEmail = () => {
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee");
      return;
    }

    // Load existing uploaded documents for the selected employee
    if (selectedEmployees.length === 1) {
      const employeeId = selectedEmployees[0];
      const employeeRequest = documentRequests.find(
        (req) => req.employeeId === employeeId,
      );
      const employee = employees.find((emp) => emp.id === employeeId);

      if (employeeRequest) {
        // Convert document request documents to uploadedDocuments format
        const existingUploads = employeeRequest.documents
          .filter((doc) => doc.status === "Completed" && doc.fileUrl)
          .map((doc) => ({
            id: doc.id,
            name: doc.fileName || doc.name,
            type: doc.fileType,
            size: doc.fileSize,
            uploadDate: doc.uploadedDate,
            fileUrl: doc.fileUrl,
            uploaded: true,
          }));

        // Merge with any existing uploadedDocuments
        // Also include documents uploaded in New Request modal
        setUploadedDocuments((prev) => {
          const combined = [...prev];

          // Add existing request uploads
          existingUploads.forEach((newDoc) => {
            if (!combined.some((existing) => existing.id === newDoc.id)) {
              combined.push(newDoc);
            }
          });

          return combined;
        });

        // Set employee details in state
        setNewRequestEmail(employee.email);
        setNewRequestName(employee.name);
        setNewRequestPhone(employee.phone || "");
        setNewRequestDepartment(employee.department || "");
        setNewRequestDesignation(employee.designation || "");
        setNewRequestEmployeeId(employee.employeeId || "");

        // Populate experience details from the existing request
        if (employeeRequest.isExperienced) {
          setIsExperienced(true);
          setYearsOfExperience(employeeRequest.yearsOfExperience || "");

          // Populate from experienceDetails if available
          if (employeeRequest.experienceDetails) {
            setCurrentOrganization(
              employeeRequest.experienceDetails.orgName || "",
            );
            setCurrentRole(employeeRequest.experienceDetails.role || "");
            setEmploymentType(employeeRequest.experienceDetails.type || "");
            setExperienceLocation(
              employeeRequest.experienceDetails.location || "",
            );
            setCurrentSalary(employeeRequest.experienceDetails.salary || "");
            setExperienceJoiningDate(
              employeeRequest.experienceDetails.joiningDate || "",
            );
            setExperienceRelievingDate(
              employeeRequest.experienceDetails.relievingDate || "",
            );
          }

          // Populate from experienceHistory if available
          if (
            employeeRequest.experienceHistory &&
            employeeRequest.experienceHistory.length > 0
          ) {
            setPreviousExperiences(employeeRequest.experienceHistory);
          }
        } else {
          setIsExperienced(false);
          // Clear experience fields
          setCurrentOrganization("");
          setCurrentRole("");
          setEmploymentType("");
          setExperienceLocation("");
          setCurrentSalary("");
          setYearsOfExperience("");
          setExperienceJoiningDate("");
          setExperienceRelievingDate("");
          setPreviousExperiences([]);
        }
        if (employeeRequest.currentAddress) {
          setCurrentAddress({
            address1: employeeRequest.currentAddress.address1 || "",
            address2: employeeRequest.currentAddress.address2 || "",
            country: employeeRequest.currentAddress.country || "",
            state: employeeRequest.currentAddress.state || "",
            district: employeeRequest.currentAddress.district || "",
            city: employeeRequest.currentAddress.city || "",
            pincode: employeeRequest.currentAddress.pincode || "",
            nationality: employeeRequest.currentAddress.nationality || "",
          });
        }

        if (employeeRequest.permanentAddress) {
          setPermanentAddress({
            address1: employeeRequest.permanentAddress.address1 || "",
            address2: employeeRequest.permanentAddress.address2 || "",
            country: employeeRequest.permanentAddress.country || "",
            state: employeeRequest.permanentAddress.state || "",
            district: employeeRequest.permanentAddress.district || "",
            city: employeeRequest.permanentAddress.city || "",
            pincode: employeeRequest.permanentAddress.pincode || "",
            nationality: employeeRequest.permanentAddress.nationality || "",
          });
        }

        setSameAsCurrent(employeeRequest.sameAsCurrentAddress || false);
      } else if (employee && employee.currentAddress) {
        // Load from employee object if request doesn't exist
        setCurrentAddress(employee.currentAddress);
        setPermanentAddress(
          employee.permanentAddress || {
            address1: "",
            address2: "",
            country: "",
            state: "",
            district: "",
            city: "",
            pincode: "",
            nationality: "",
          },
        );
        setSameAsCurrent(employee.sameAsCurrentAddress || false);
      }
    }

    const selectedEmps = employees.filter((emp) =>
      selectedEmployees.includes(emp.id),
    );

    // Use first employee's name for template preview
    const defaultTemplate = generateEmailTemplate(
      selectedEmps[0]?.name || "Employee",
    );

    setEmailTemplate(defaultTemplate);
    setShowEmailModal(true);
  };

  const handleClearEmailUploads = () => {
    if (emailUploads.length === 0) return;

    if (window.confirm("Clear all new document uploads?")) {
      // Revoke all object URLs to prevent memory leaks
      emailUploads.forEach((upload) => {
        if (upload.fileUrl) {
          URL.revokeObjectURL(upload.fileUrl);
        }
      });
      setEmailUploads([]);

      setEmailStatus({
        type: "info",
        message: "All new uploads cleared.",
      });
    }
  };

  const handleUpdateEmailDocument = (documentId) => {
    // Trigger file input click
    const fileInput = document.getElementById(`email-upload-${documentId}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  // Update handleConfirmSendEmail to include uploaded documents
  const handleConfirmSendEmail = async () => {
    const selectedEmps = employees.filter((emp) =>
      selectedEmployees.includes(emp.id),
    );
    if (selectedEmps.length === 0) {
      setEmailStatus({
        type: "error",
        message: "Please select at least one employee",
      });
      return;
    }

    setSendingEmail(true);
    setEmailStatus({ type: "info", message: "Sending emails..." });

    const timestamp = new Date().toISOString();

    try {
      let emailResult;

      if (emailMethod === "api") {
        const recipients = selectedEmps.map((emp) => ({
          email: emp.email,
          name: emp.name,
        }));

        const personalizedTemplate = (recipient) => {
          return emailTemplate.replace(
            /Dear\s+[^,\n]+/,
            `Dear ${recipient.name}`,
          );
        };

        emailResult = await sendBulkEmails(
          recipients,
          emailSubject,
          personalizedTemplate,
          {
            cc: ccEmails
              ? ccEmails
                  .split(",")
                  .map((e) => e.trim())
                  .filter((e) => e)
              : null,
            bcc: bccEmails
              ? bccEmails
                  .split(",")
                  .map((e) => e.trim())
                  .filter((e) => e)
              : null,
          },
        );
      }
      // ... rest of your email sending logic

      // Create document requests with uploaded documents
      const newRequests = selectedEmps.map((emp) => {
        // For single employee with uploads, include them
        let employeeDocuments = requiredDocuments.map((doc) => {
          // Check if document exists in existing request
          const existingRequest = documentRequests.find(
            (req) => req.employeeId === emp.id,
          );
          const existingDoc = existingRequest?.documents?.find(
            (d) => d.id === doc.id,
          );

          // Check if there's a new upload for this document
          const newUpload = emailUploads.find(
            (upload) => upload.documentId === doc.id,
          );

          return {
            id: doc.id,
            name: doc.name,
            required: doc.required,
            status: existingDoc?.status || newUpload ? "Completed" : "Pending",
            uploadedDate:
              existingDoc?.uploadedDate || newUpload?.uploadDate || null,
            fileUrl: existingDoc?.fileUrl || newUpload?.fileUrl || null,
            fileName: existingDoc?.fileName || newUpload?.name || null,
          };
        });

        return {
          id: Date.now() + Math.random(),
          employeeId: emp.id,
          employeeName: emp.name,
          email: emp.email,
          status: "Request Sent",
          requestedDate: timestamp,
          documents: employeeDocuments,
          emailSent: true,
          emailSentDate: timestamp,
          emailMethod: emailMethod,
          completedDate: null,
          uploadedFiles: emailUploads.map((upload) => ({
            documentId: upload.documentId,
            name: upload.name,
            file: upload.file,
          })),
        };
      });

      const updatedRequests = [...documentRequests, ...newRequests];
      saveDocumentRequests(updatedRequests);

      // Clear uploads after successful send
      handleClearEmailUploads();

      // ... rest of your success handling
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailStatus({
        type: "error",
        message:
          error.message ||
          "Failed to send emails. Please try again or use a different method.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handlePreviewDocument = (document) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, "_blank");
    }
  };

  // Handle update existing document
  const handleUpdateDocument = (documentId) => {
    const fileInput = document.getElementById(`email-upload-${documentId}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "warning";
      case "Pending":
        return "info";
      case "Not Started":
        return "secondary";
      case "Request Sent":
        return "primary";
      default:
        return "secondary";
    }
  };

  // Get document request for employee
  const getDocumentRequest = (employeeId) => {
    return documentRequests.find((req) => req.employeeId === employeeId);
  };

  // Calculate completion percentage
  const getCompletionPercentage = (request) => {
    if (!request) return 0;
    const totalDocs = request.documents.length;
    const completedDocs = request.documents.filter(
      (doc) => doc.status === "Completed",
    ).length;
    return Math.round((completedDocs / totalDocs) * 100);
  };

  // Handle Edit Employee
  const handleEditEmployee = (employee) => {
    setEditingEmployeeId(employee.id);
    setEditEmployeeName(employee.name || "");
    setEditEmployeePhone(employee.phone || "");
    setEditEmployeeEmail(employee.email || "");
    setEditEmployeeDepartment(employee.department || "");
    setEditEmployeeDesignation(employee.designation || "");
    setEditEmployeeId(employee.employeeId || "");
  };

  // Handle Save Employee Edit
  const handleSaveEmployeeEdit = () => {
    if (!editEmployeeName.trim() || !editEmployeeEmail.trim()) {
      setEmailStatus({ type: "error", message: "Please enter name and email" });
      return;
    }

    // Update employees list
    const updatedEmployees = employees.map((emp) => {
      if (emp.id === editingEmployeeId) {
        return {
          ...emp,
          name: editEmployeeName,
          phone: editEmployeePhone,
          email: editEmployeeEmail,
          department: editEmployeeDepartment,
          designation: editEmployeeDesignation,
          employeeId: editEmployeeId || emp.employeeId,
        };
      }
      return emp;
    });
    setEmployees(updatedEmployees);

    // Update document requests with new employee info
    const updatedRequests = documentRequests.map((req) => {
      if (req.employeeId === editingEmployeeId) {
        return {
          ...req,
          employeeName: editEmployeeName,
          email: editEmployeeEmail,
        };
      }
      return req;
    });
    saveDocumentRequests(updatedRequests);

    // Update localStorage
    const savedProfiles = localStorage.getItem("employeeProfiles");
    if (savedProfiles) {
      const profiles = JSON.parse(savedProfiles);
      const updatedProfiles = profiles.map((profile) => {
        if (
          profile.employeeId === editingEmployeeId ||
          profile.id === editingEmployeeId
        ) {
          const nameParts = editEmployeeName.split(" ");
          return {
            ...profile,
            firstName: nameParts[0] || editEmployeeName,
            lastName: nameParts.slice(1).join(" ") || "",
            officialEmail: editEmployeeEmail,
            email: editEmployeeEmail,
            phone: editEmployeePhone,
            department: editEmployeeDepartment,
            designation: editEmployeeDesignation,
            employeeId: editEmployeeId || profile.employeeId,
          };
        }
        return profile;
      });
      localStorage.setItem("employeeProfiles", JSON.stringify(updatedProfiles));
    }

    setEmailStatus({
      type: "success",
      message: "Employee details updated successfully!",
    });

    // Clear edit form
    setTimeout(() => {
      setEditingEmployeeId(null);
    }, 1500);
  };

  // Updated send email function that includes employee edits
  const handleConfirmSendEmailWithEdits = async () => {
    const selectedEmps = employees.filter((emp) =>
      selectedEmployees.includes(emp.id),
    );
    if (selectedEmps.length === 0) {
      setEmailStatus({
        type: "error",
        message: "Please select at least one employee",
      });
      return;
    }

    // If we're editing an employee, save changes first
    if (editingEmployeeId) {
      handleSaveEmployeeEdit();
    }

    setSendingEmail(true);
    setEmailStatus({ type: "info", message: "Sending emails..." });

    const timestamp = new Date().toISOString();

    try {
      let emailResult;

      // Rest of your existing email sending logic...
      // ... (keep your existing email sending code here)

      // Create/update document requests
      const newRequests = selectedEmps.map((emp) => {
        const existingRequest = documentRequests.find(
          (req) => req.employeeId === emp.id,
        );

        if (existingRequest) {
          // Update existing request
          const updatedDocuments = existingRequest.documents.map((doc) => {
            // Check if this document was uploaded in email uploads
            const uploadedDoc = emailUploads.find(
              (up) => up.documentId === doc.id,
            );
            if (uploadedDoc) {
              return {
                ...doc,
                status: "Completed",
                uploadedDate: timestamp,
                fileUrl: uploadedDoc.fileUrl,
                fileName: uploadedDoc.name,
                fileSize: uploadedDoc.size,
                fileType: uploadedDoc.type,
              };
            }
            return doc;
          });

          return {
            ...existingRequest,
            employeeName: emp.name,
            email: emp.email,
            documents: updatedDocuments,
            emailSent: true,
            emailSentDate: timestamp,
            emailMethod: emailMethod,
            status: "Request Sent",
          };
        } else {
          // Create new request
          return {
            id: Date.now() + Math.random(),
            employeeId: emp.id,
            employeeName: emp.name,
            email: emp.email,
            status: "Request Sent",
            requestedDate: timestamp,
            documents: requiredDocuments.map((doc) => ({
              id: doc.id,
              name: doc.name,
              required: doc.required,
              status: "Pending",
              uploadedDate: null,
              fileUrl: null,
            })),
            emailSent: true,
            emailSentDate: timestamp,
            emailMethod: emailMethod,
            completedDate: null,
          };
        }
      });

      // Update or add requests
      const updatedRequests = [...documentRequests];
      newRequests.forEach((newReq) => {
        const index = updatedRequests.findIndex(
          (req) => req.employeeId === newReq.employeeId,
        );
        if (index >= 0) {
          updatedRequests[index] = newReq;
        } else {
          updatedRequests.push(newReq);
        }
      });
      saveDocumentRequests(updatedRequests);

      // Update employee status
      const updatedEmployees = employees.map((emp) => {
        if (selectedEmployees.includes(emp.id)) {
          return { ...emp, status: "In Progress" };
        }
        return emp;
      });
      setEmployees(updatedEmployees);

      // Update localStorage
      const savedProfiles = localStorage.getItem("employeeProfiles");
      if (savedProfiles) {
        const profiles = JSON.parse(savedProfiles);
        const updatedProfiles = profiles.map((profile) => {
          if (selectedEmployees.includes(profile.employeeId || profile.id)) {
            return { ...profile, bgvStatus: "In Progress" };
          }
          return profile;
        });
        localStorage.setItem(
          "employeeProfiles",
          JSON.stringify(updatedProfiles),
        );
      }

      setEmailStatus({
        type: "success",
        message: `Successfully sent ${selectedEmps.length} email(s)`,
      });

      setTimeout(() => {
        setShowEmailModal(false);
        setSelectedEmployees([]);
        setEmailTemplate("");
        setEmailStatus({ type: "", message: "" });
        setCcEmails("");
        setBccEmails("");
        setEditingEmployeeId(null);
        // Clear email uploads
        emailUploads.forEach((doc) => {
          if (doc.fileUrl) URL.revokeObjectURL(doc.fileUrl);
        });
        setEmailUploads([]);
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailStatus({
        type: "error",
        message:
          error.message ||
          "Failed to send emails. Please try again or use a different method.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="container" >
      {/* Header */}
      <div className="mb-4">
        {/* Back Button */}
        <div className="d-flex align-items-center gap-3 mb-3">
          {activeSection !== "configuration" && (
            <button
              onClick={() => setActiveSection("configuration")}
              className="btn btn-link d-flex align-items-center gap-2"
              style={{ color: "#6B7280", textDecoration: "none" }}
            >
              <Icon icon="heroicons:arrow-left" />
              Back to Configuration
            </button>
          )}
        </div>

        {/* Title and Action Buttons in same row */}
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div style={{ flex: "1 1 auto", minWidth: "300px" }}>
            <h5 className="text-3xl fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <Icon icon="heroicons:shield-check" />
              Background Verification
            </h5>
            <p className="text-muted">
              Request and track document collection for employee background verification
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className="d-flex gap-2 flex-wrap"
            style={{ alignItems: "flex-start" }}
          >
            <button
              className="btn btn-success"
              onClick={handleNewRequest}
              style={{
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 500,
                fontSize: 14,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Icon icon="heroicons:plus-circle" style={{ fontSize: 18 }} />
              New Request
            </button>
            {selectedEmployees.length > 0 && (
              <button
                className="btn btn-primary"
                onClick={handleSendEmail}
                style={{
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontWeight: 500,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Icon icon="heroicons:envelope" style={{ fontSize: 18 }} />
                Send Request ({selectedEmployees.length})
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Filters */}
      <div
        className="card mb-4"
        style={{
          borderRadius: 12,
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div className="card-body" style={{ padding: "20px" }}>
          <div className="row g-3 align-items-end">
            <div className="col-md-8 col-lg-9">
              <label
                style={{
                  fontSize: 14,
                  color: "#374151",
                  fontWeight: 500,
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Search
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{
                    background: "#F9FAFB",
                    border: "1px solid #D1D5DB",
                    borderRight: "none",
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                  }}
                >
                  <Icon
                    icon="heroicons:magnifying-glass"
                    style={{ fontSize: 18, color: "#6B7280" }}
                  />
                </span>
                <input
                  type="search"
                  className="form-control"
                  style={{
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                    border: "1px solid #D1D5DB",
                    borderLeft: "none",
                    padding: "10px 14px",
                    fontSize: 14,
                    transition: "all 0.2s",
                  }}
                  placeholder="Search by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    // Only update searchTerm, don't trigger email validation
                    setSearchTerm(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    // Escape key clears search
                    if (e.key === "Escape") {
                      setSearchTerm("");
                    }
                  }}
                  // Add these attributes to prevent any email-related behaviors
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  // Ensure this doesn't conflict with email inputs
                  name="employeeSearch"
                  id="employeeSearchInput"
                />
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <label
                style={{
                  fontSize: 14,
                  color: "#374151",
                  fontWeight: 500,
                  marginBottom: 8,
                  display: "block",
                }}
              >
                Status Filter
              </label>
              <select
                className="form-select"
                style={{
                  borderRadius: 8,
                  border: "1px solid #D1D5DB",
                  padding: "10px 14px",
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>Not Started</option>
                <option>Pending</option>
                <option>Request Sent</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

{/* Statistics KPI Cards */}
<div className="kpi-row">
  {[
    {
      title: "Total Employees",
      value: employees.length,
      icon: "heroicons:users",
      bg: "kpi-primary",
      color: "kpi-primary-text",
    },
    {
      title: "Pending",
      value: employees.filter(
        (e) => e.status === "Pending" || e.status === "Not Started"
      ).length,
      icon: "heroicons:clock",
      bg: "kpi-warning",
      color: "kpi-warning-text",
    },
    {
      title: "In Progress",
      value: employees.filter(
        (e) => e.status === "In Progress" || e.status === "Request Sent"
      ).length,
      icon: "heroicons:arrow-path",
      bg: "kpi-info",
      color: "kpi-info-text",
    },
    {
      title: "Completed",
      value: employees.filter((e) => e.status === "Completed").length,
      icon: "heroicons:check-badge",
      bg: "kpi-success",
      color: "kpi-success-text",
    },
  ].map((item, index) => (
    <div className="kpi-col" key={index}>
      <div className="kpi-card">
        <div className="kpi-card-body">

          {/* Icon */}
          <div className={`kpi-icon ${item.bg}`}>
            <Icon
              icon={item.icon}
              className={`kpi-icon-style ${item.color}`}
            />
          </div>

          {/* Content */}
          <div className="kpi-content">
            <div className="kpi-title">
              {item.title}
            </div>

            <div className="kpi-value">
              {item.value}
            </div>
          </div>

        </div>
      </div>
    </div>
  ))}
</div>
      
      {/* Document Requests Cards */}
      {documentRequests.length > 0 && (
        <div className="mb-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-semibold fs-3 mb-0 text-dark">
              Document Requests
            </h4>

            <span className="badge bg-secondary px-3 py-2 fs-6">
              {documentRequests.length} Request
              {documentRequests.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Cards Grid */}
          <div className="row g-3">
            {documentRequests.map((request) => {
              const completion = getCompletionPercentage(request);

              return (
                <div key={request.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm rounded-3">
                    <div className="card-body p-4">
                      {/* Employee + Status */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1 text-truncate">
                          <h6 className="fw-semibold text-dark mb-1 text-truncate">
                            {request.employeeName}
                          </h6>
                          <p className="text-muted small mb-0 text-truncate">
                            {request.email}
                          </p>
                        </div>

                        <span
                          className={`badge bg-${getStatusColor(request.status)} rounded-pill ms-2 px-3 py-2 text-uppercase`}
                        >
                          {request.status}
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted fw-medium">
                            Progress
                          </small>
                          <small className="fw-semibold text-dark">
                            {completion}%
                          </small>
                        </div>

                        <div
                          className="progress rounded"
                          style={{ height: "8px" }}
                        >
                          <div
                            className={`progress-bar bg-${completion === 100 ? "success" : "info"}`}
                            role="progressbar"
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                      </div>

                      {/* Requested Date */}
                      <div className="border-bottom pb-2 mb-3">
                        <small className="text-muted d-block mb-1">
                          Requested Date:
                        </small>
                        <div className="fw-medium text-dark small">
                          {new Date(request.requestedDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <button
                          className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRequestDetails(true);
                          }}
                          title="View Details"
                        >
                          <Icon icon="heroicons:eye" className="fs-6" />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                          onClick={() => {
                            const updatedRequests = documentRequests.filter(
                              (req) => req.id !== request.id,
                            );
                            saveDocumentRequests(updatedRequests);
                          }}
                          title="Delete Request"
                        >
                          <Icon icon="heroicons:trash" className="fs-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Employees Table */}
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: 12, overflow: "hidden" }}
      >
        <div
          className="card-header bg-white border-bottom"
          style={{ padding: "20px", borderBottom: "2px solid #E5E7EB" }}
        >
          <h5 className="text-muted fw-bold fs-4 mb-0">Employees List</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="min-width-50">
                    <input
                      type="checkbox"
                      checked={
                        selectedEmployees.length === filteredEmployees.length &&
                        filteredEmployees.length > 0
                      }
                      onChange={handleSelectAll}
                      className="form-check-input"
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th className="min-width-150">Employee</th>
                  <th className="min-width-150">Contact</th>
                  <th className="d-none d-md-table-cell min-width-120">
                    Department
                  </th>
                  <th className="d-none d-lg-table-cell min-width-120">
                    Joining Date
                  </th>
                  <th className="min-width-100">Status</th>
                  <th className="min-width-150">Progress</th>
                  <th className="min-width-180 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="d-flex flex-column align-items-center text-muted">
                        <Icon
                          icon="heroicons:inbox"
                          style={{ fontSize: 36 }}
                          className="mb-3"
                        />
                        <p className="mb-1 fw-medium">No employees found</p>
                        <small>
                          Try adjusting your search or filter criteria
                        </small>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee, idx) => {
                    const request = getDocumentRequest(employee.id);
                    const completion = getCompletionPercentage(request);

                    return (
                      <tr
                        key={employee.id}
                        className={idx % 2 === 1 ? "table-light" : ""}
                      >
                        <td className="align-middle">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => handleSelectEmployee(employee.id)}
                            className="form-check-input"
                            style={{ cursor: "pointer" }}
                          />
                        </td>
                        <td className="align-middle">
                          <div className="fw-semibold">{employee.name}</div>
                          <small className="text-muted">
                            ID: {employee.employeeId}
                          </small>
                        </td>
                        <td className="align-middle">
                          <div
                            className="text-truncate"
                            style={{ maxWidth: "150px" }}
                          >
                            {employee.email}
                          </div>
                          <small className="text-muted">
                            {employee.phone || "N/A"}
                          </small>
                        </td>
                        <td className="d-none d-md-table-cell align-middle">
                          <div>{employee.department}</div>
                          <small className="text-muted">
                            {employee.designation}
                          </small>
                        </td>
                        <td className="d-none d-lg-table-cell align-middle">
                          {new Date(employee.joiningDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>
                        <td className="align-middle">
                          <span
                            className={`badge bg-${getStatusColor(employee.status)}`}
                            style={{
                              fontWeight: 500,
                              borderRadius: "20px",
                              padding: "6px 12px",
                              fontSize: 11,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {employee.status}
                          </span>
                        </td>
                        <td className="align-middle">
                          {request ? (
                            <div>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <small className="text-muted">
                                  {completion}% Complete
                                </small>
                              </div>
                              <div
                                className="progress"
                                style={{ height: "6px" }}
                              >
                                <div
                                  className={`progress-bar bg-${completion === 100 ? "success" : "info"}`}
                                  style={{ width: `${completion}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted small">
                              Not Started
                            </span>
                          )}
                        </td>
                        <td className="align-middle text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setSelectedEmployees([employee.id]);
                                handleSendEmail();
                              }}
                              title="Send Document Request"
                            >
                              <Icon
                                icon="heroicons:envelope"
                                style={{ fontSize: 14 }}
                              />
                            </button>

                            {request && (
                              <button
                                className="btn btn-outline-info btn-sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowRequestDetails(true);
                                }}
                                title="View Details"
                              >
                                <Icon
                                  icon="heroicons:eye"
                                  style={{ fontSize: 14 }}
                                />
                              </button>
                            )}

                            {/* Approve Button */}
                            {request && employee.status === "In Progress" && (
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Approve background verification for ${employee.name}?`,
                                    )
                                  ) {
                                    // Update employee status
                                    const updatedEmployees = employees.map(
                                      (emp) =>
                                        emp.id === employee.id
                                          ? { ...emp, status: "Completed" }
                                          : emp,
                                    );
                                    setEmployees(updatedEmployees);

                                    // Update document request status
                                    const updatedRequests =
                                      documentRequests.map((req) =>
                                        req.employeeId === employee.id
                                          ? {
                                              ...req,
                                              status: "Completed",
                                              completedDate:
                                                new Date().toISOString(),
                                            }
                                          : req,
                                      );
                                    saveDocumentRequests(updatedRequests);

                                    // Update localStorage
                                    const savedProfiles =
                                      localStorage.getItem("employeeProfiles");
                                    if (savedProfiles) {
                                      const profiles =
                                        JSON.parse(savedProfiles);
                                      const updatedProfiles = profiles.map(
                                        (profile) =>
                                          (profile.employeeId || profile.id) ===
                                          employee.id
                                            ? {
                                                ...profile,
                                                bgvStatus: "Completed",
                                              }
                                            : profile,
                                      );
                                      localStorage.setItem(
                                        "employeeProfiles",
                                        JSON.stringify(updatedProfiles),
                                      );
                                    }

                                    alert(
                                      `Background verification approved for ${employee.name}`,
                                    );
                                  }
                                }}
                                title="Approve Verification"
                              >
                                <Icon
                                  icon="heroicons:check"
                                  style={{ fontSize: 14 }}
                                />
                              </button>
                            )}

                            {/* Reject Button */}
                            {request &&
                              (employee.status === "In Progress" ||
                                employee.status === "Pending") && (
                                <button
                                  className="btn btn-outline-warning btn-sm"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Reject background verification for ${employee.name}?`,
                                      )
                                    ) {
                                      // Update employee status
                                      const updatedEmployees = employees.map(
                                        (emp) =>
                                          emp.id === employee.id
                                            ? { ...emp, status: "Rejected" }
                                            : emp,
                                      );
                                      setEmployees(updatedEmployees);

                                      // Update document request status
                                      const updatedRequests =
                                        documentRequests.map((req) =>
                                          req.employeeId === employee.id
                                            ? { ...req, status: "Rejected" }
                                            : req,
                                        );
                                      saveDocumentRequests(updatedRequests);

                                      // Update localStorage
                                      const savedProfiles =
                                        localStorage.getItem(
                                          "employeeProfiles",
                                        );
                                      if (savedProfiles) {
                                        const profiles =
                                          JSON.parse(savedProfiles);
                                        const updatedProfiles = profiles.map(
                                          (profile) =>
                                            (profile.employeeId ||
                                              profile.id) === employee.id
                                              ? {
                                                  ...profile,
                                                  bgvStatus: "Rejected",
                                                }
                                              : profile,
                                        );
                                        localStorage.setItem(
                                          "employeeProfiles",
                                          JSON.stringify(updatedProfiles),
                                        );
                                      }

                                      alert(
                                        `Background verification rejected for ${employee.name}`,
                                      );
                                    }
                                  }}
                                  title="Reject Verification"
                                >
                                  <Icon
                                    icon="heroicons:x-mark"
                                    style={{ fontSize: 14 }}
                                  />
                                </button>
                              )}

                            {request && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Delete Request Permanently"
                                onClick={() => {
                                  setEmployeeToDelete(employee);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Icon icon="heroicons:trash" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Document Request Details Modal */}
{/* Document Request Details Modal */}
{showRequestDetails && selectedRequest && (
  <div
    className="modal show d-block"
    style={{
      backgroundColor: "rgba(0,0,0,0.5)",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1050,
    }}
  >
    <div
      className="modal-content bg-white"
      style={{
        width: "70%",
        maxWidth: "800px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "8px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      }}
    >
      {/* Modal Header */}
      <div className="modal-header bg-info text-dark rounded-top-3">
        <div className="d-flex align-items-center">
          <h5 className="modal-title mb-0 fw-semibold">
            Document Request Details
          </h5>
        </div>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={() => setShowRequestDetails(false)}
        ></button>
      </div>

      {/* Modal Body */}
      <div className="modal-body p-0">
        {/* Employee Info Card */}
        <div className="p-4 border-bottom">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
              <Icon icon="heroicons:user" className="text-primary fs-5" />
            </div>
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1">
                {selectedRequest.employeeName}
              </h5>
              <p className="text-muted small mb-0 d-flex align-items-center gap-1">
                <Icon icon="heroicons:envelope" />
                <span>
                  {selectedRequest.email} | ID:{" "}
                  {selectedRequest.employeeId || "N/A"}
                </span>
              </p>
              <p className="text-muted small mb-0 d-flex align-items-center gap-1">
                <Icon icon="heroicons:phone" />
                <span>{selectedRequest.phone || "No Phone Number"}</span>
              </p>
            </div>
            <span
              className={`badge bg-${getStatusColor(selectedRequest.status)} rounded-pill px-3 py-2`}
            >
              {selectedRequest.status}
            </span>
          </div>
          
          {/* Request Info */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h6 className="fw-semibold mb-3">
                    Request Information
                  </h6>

                  <div className="d-flex mb-2">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Requested:
                    </span>
                    <span className="fw-medium">
                      {new Date(
                        selectedRequest.requestedDate,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="d-flex mb-2">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Department:
                    </span>
                    <span className="fw-medium">
                      {selectedRequest.department || "Not specified"}
                    </span>
                  </div>

                  <div className="d-flex mb-2">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Designation:
                    </span>
                    <span className="fw-medium">
                      {selectedRequest.designation || "Not specified"}
                    </span>
                  </div>

                  <div className="d-flex mb-2">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Email Sent:
                    </span>
                    <span className="fw-medium">
                      {selectedRequest.emailSent ? "Yes" : "No"}
                      {selectedRequest.emailSentDate && (
                        <small className="text-muted ms-2">
                          (
                          {new Date(
                            selectedRequest.emailSentDate,
                          ).toLocaleDateString()}
                          )
                        </small>
                      )}
                    </span>
                  </div>

                  <div className="d-flex">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Email Method:
                    </span>
                    <span className="fw-medium text-capitalize">
                      {selectedRequest.emailMethod || "Not specified"}
                    </span>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <h6 className="fw-semibold mb-3">
                    Candidate Information
                  </h6>

                  <div className="d-flex mb-2">
                    <span
                      className="text-muted me-3"
                      style={{ minWidth: "120px" }}
                    >
                      Candidate Type:
                    </span>
                    <span className="fw-medium">
                      {selectedRequest.isExperienced ? "Experienced" : "Fresher"}
                    </span>
                  </div>

                  {selectedRequest.yearsOfExperience && (
                    <div className="d-flex mb-2">
                      <span
                        className="text-muted me-3"
                        style={{ minWidth: "120px" }}
                      >
                        Total Experience:
                      </span>
                      <span className="fw-medium">
                        {selectedRequest.yearsOfExperience} years
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== PERSONAL INFORMATION SECTION ========== */}
        {selectedRequest.personalInfo && (
          <div className="p-4 border-bottom">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-info bg-opacity-10 border-0">
                <h6 className="mb-0 fw-semibold d-flex align-items-center">
                  <Icon icon="heroicons:user" className="me-2" />
                  Personal Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {/* Date of Birth */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Date of Birth
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:calendar" className="me-2 text-info" />
                      <span className="fw-medium">
                        {selectedRequest.personalInfo.dob 
                          ? new Date(selectedRequest.personalInfo.dob).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : selectedRequest.dob
                            ? new Date(selectedRequest.dob).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Gender
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:user-group" className="me-2 text-info" />
                      <span className="fw-medium">
                        {selectedRequest.personalInfo.gender || 
                         selectedRequest.gender || 
                         "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Marital Status */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Marital Status
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:heart" className="me-2 text-info" />
                      <span className="fw-medium">
                        {selectedRequest.personalInfo.maritalStatus || 
                         selectedRequest.maritalStatus || 
                         "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== ADDRESS DETAILS SECTION ========== */}
        {selectedRequest && (
          <div className="p-4 border-bottom">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary bg-opacity-10 border-0">
                <h6 className="mb-0 fw-semibold d-flex align-items-center">
                  <Icon icon="heroicons:map-pin" className="me-2" />
                  Address Details
                </h6>
              </div>
              <div className="card-body">
                {/* CURRENT ADDRESS */}
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-semibold mb-0 d-flex align-items-center">
                      <Icon
                        icon="heroicons:home"
                        className="me-2 text-primary"
                      />
                      Current Address
                    </h6>
                  </div>

                  <div className="row g-3">
                    {/* Check if current address object exists AND has any non-empty fields */}
                    {selectedRequest.currentAddress &&
                    (selectedRequest.currentAddress.address1 ||
                      selectedRequest.currentAddress.address2 ||
                      selectedRequest.currentAddress.country ||
                      selectedRequest.currentAddress.state ||
                      selectedRequest.currentAddress.district ||
                      selectedRequest.currentAddress.city ||
                      selectedRequest.currentAddress.pincode ||
                      selectedRequest.currentAddress.nationality ||
                      selectedRequest.currentAddress.Nationality) ? (
                      <>
                        {/* Address Line 1 */}
                        <div className="col-12">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Address Line 1
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-start">
                            <Icon
                              icon="heroicons:map"
                              className="me-2 text-primary mt-1"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.address1 ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Address Line 2 */}
                        {selectedRequest.currentAddress.address2 && (
                          <div className="col-12">
                            <label className="form-label fw-semibold text-muted small mb-1">
                              Address Line 2
                            </label>
                            <div className="p-2 bg-light rounded border d-flex align-items-start">
                              <Icon
                                icon="heroicons:map"
                                className="me-2 text-primary mt-1"
                              />
                              <span className="fw-medium">
                                {selectedRequest.currentAddress.address2}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Country */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Country
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:globe-alt"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.country ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* State */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            State
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:map"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.state ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* District */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            District
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:building-library"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.district ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* City */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            City
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:building-office"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.city ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Pincode */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Pincode
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:inbox"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.pincode ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Nationality */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Nationality
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:identification"
                              className="me-2 text-primary"
                            />
                            <span className="fw-medium">
                              {selectedRequest.currentAddress.nationality ||
                                selectedRequest.currentAddress.Nationality ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="col-12">
                        <div className="p-3 bg-light rounded border text-center text-muted d-flex flex-column align-items-center">
                          <Icon
                            icon="heroicons:map-pin"
                            width="28"
                            height="28"
                            className="mb-2"
                          />
                          <span>
                            No current address information available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PERMANENT ADDRESS */}
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-semibold mb-0 d-flex align-items-center">
                      <Icon
                        icon="heroicons:building-office"
                        className="me-2 text-success"
                      />
                      Permanent Address
                    </h6>
                  </div>

                  <div className="row g-3">
                    {/* Check if permanent address exists, has data, and not same as current */}
                    {selectedRequest.permanentAddress &&
                    !selectedRequest.sameAsCurrentAddress &&
                    (selectedRequest.permanentAddress.address1 ||
                      selectedRequest.permanentAddress.address2 ||
                      selectedRequest.permanentAddress.country ||
                      selectedRequest.permanentAddress.state ||
                      selectedRequest.permanentAddress.district ||
                      selectedRequest.permanentAddress.city ||
                      selectedRequest.permanentAddress.pincode ||
                      selectedRequest.permanentAddress.nationality) ? (
                      <>
                        {/* Address Line 1 */}
                        <div className="col-12">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Address Line 1
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-start">
                            <Icon
                              icon="heroicons:map"
                              className="me-2 text-success mt-1"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress
                                .address1 || "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Address Line 2 */}
                        {selectedRequest.permanentAddress.address2 && (
                          <div className="col-12">
                            <label className="form-label fw-semibold text-muted small mb-1">
                              Address Line 2
                            </label>
                            <div className="p-2 bg-light rounded border d-flex align-items-start">
                              <Icon
                                icon="heroicons:map"
                                className="me-2 text-success mt-1"
                              />
                              <span className="fw-medium">
                                {
                                  selectedRequest.permanentAddress
                                    .address2
                                }
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Country */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Country
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:globe-alt"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress.country ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* State */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            State
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:map"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress.state ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* District */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            District
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:building-library"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress
                                .district || "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* City */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            City
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:building-office"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress.city ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Pincode */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Pincode
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:inbox"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress.pincode ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>

                        {/* Nationality */}
                        <div className="col-12 col-md-4">
                          <label className="form-label fw-semibold text-muted small mb-1">
                            Nationality
                          </label>
                          <div className="p-2 bg-light rounded border d-flex align-items-center">
                            <Icon
                              icon="heroicons:identification"
                              className="me-2 text-success"
                            />
                            <span className="fw-medium">
                              {selectedRequest.permanentAddress.nationality ||
                                selectedRequest.permanentAddress.Nationality ||
                                "Not specified"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : selectedRequest.sameAsCurrentAddress ? (
                      <div className="col-12">
                        <div className="p-3 bg-light rounded border">
                          <div className="d-flex align-items-center text-dark">
                            <Icon
                              icon="heroicons:information-circle"
                              className="me-2"
                            />
                            <span className="fw-medium">
                              Permanent address is same as current address
                            </span>
                          </div>
                          {selectedRequest.currentAddress && (
                            <div className="mt-2 ps-4 small text-muted">
                              <div>
                                Address:{" "}
                                {selectedRequest.currentAddress.address1}
                              </div>
                              {selectedRequest.currentAddress
                                .address2 && (
                                <div>
                                  {
                                    selectedRequest.currentAddress
                                      .address2
                                  }
                                </div>
                              )}
                              <div>
                                {[
                                  selectedRequest.currentAddress.city,
                                  selectedRequest.currentAddress.district,
                                  selectedRequest.currentAddress.state,
                                  selectedRequest.currentAddress.pincode,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                              <div>
                                Country:{" "}
                                {selectedRequest.currentAddress.country}
                              </div>
                              <div>
                                Nationality:{" "}
                                {selectedRequest.currentAddress
                                  .nationality ||
                                  selectedRequest.currentAddress
                                    .Nationality}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="col-12">
                        <div className="p-4 bg-light rounded border text-center text-muted d-flex flex-column align-items-center justify-content-center">
                          <Icon
                            icon="heroicons:building-office-2"
                            width="28"
                            height="28"
                            className="mb-2 opacity-75"
                          />
                          <span className="fw-medium">
                            No permanent address information available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Verification Status - Optional */}
                {selectedRequest.addressVerified && (
                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2">
                        <Icon
                          icon="heroicons:check-badge"
                          className="me-1"
                        />
                        Address Verified on{" "}
                        {new Date(
                          selectedRequest.addressVerified,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========== EDUCATION QUALIFICATIONS SECTION ========== */}
        {selectedRequest.educationQualifications && selectedRequest.educationQualifications.length > 0 && (
          <div className="p-4 border-bottom">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-info bg-opacity-10 border-0">
                <h6 className="mb-0 fw-semibold d-flex align-items-center">
                  <Icon icon="heroicons:academic-cap" className="me-2" />
                  Education Qualifications
                </h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-semibold">Level</th>
                        <th className="fw-semibold">Institution/Board</th>
                        <th className="fw-semibold">Degree/Branch</th>
                        <th className="fw-semibold">Year</th>
                        <th className="fw-semibold">Marks/CGPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequest.educationQualifications
                        .sort((a, b) => {
                          const levelOrder = { '10th': 1, '12th': 2, 'diploma': 3, 'graduation': 4, 'post_graduation': 5, 'phd': 6, 'certification': 7 };
                          return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
                        })
                        .map((edu, idx) => (
                          <tr key={edu.id || idx} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
                            <td className="align-middle">
                              <span className="fw-medium">{edu.levelLabel || edu.level}</span>
                            </td>
                            <td className="align-middle">
                              <div>{edu.institution}</div>
                              {edu.boardUniversity && (
                                <small className="text-muted">{edu.boardUniversity}</small>
                              )}
                            </td>
                            <td className="align-middle">
                              {edu.degree && <div className="fw-medium">{edu.degree}</div>}
                              {edu.branch && <small className="text-muted">{edu.branch}</small>}
                            </td>
                            <td className="align-middle">
                              {edu.passingYear && (
                                <>
                                  <div>{edu.passingYear}</div>
                                  {edu.joiningYear && (
                                    <small className="text-muted">
                                      {edu.joiningYear} - {edu.passingYear}
                                    </small>
                                  )}
                                </>
                              )}
                            </td>
                            <td className="align-middle">
                              {edu.percentage && (
                                <span className="badge bg-success bg-opacity-10 text-success p-2">
                                  {edu.percentage}%
                                </span>
                              )}
                              {edu.cgpa && (
                                <span className="badge bg-info bg-opacity-10 text-info p-2">
                                  CGPA: {edu.cgpa}/10
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== PARENT/GUARDIAN DETAILS SECTION ========== */}
        {selectedRequest.parentGuardian && (
          <div className="p-4 border-bottom">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary bg-opacity-10 border-0">
                <h6 className="mb-0 fw-semibold d-flex align-items-center">
                  <Icon icon="heroicons:users" className="me-2" />
                  Parent / Guardian Details
                </h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {/* Parent/Guardian Name */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Parent/Guardian Name
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:user" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.name || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Relationship */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Relationship
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:heart" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.relationship || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Phone Number
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:phone" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.phone || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Employment Status */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Employment Status
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:briefcase" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.employment || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Organization */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Organization
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:building-office-2" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.organization || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Designation
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon icon="heroicons:identification" className="me-2 text-primary" />
                      <span className="fw-medium">
                        {selectedRequest.parentGuardian.designation || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Is Legal Guardian */}
                  <div className="col-12">
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon 
                        icon={selectedRequest.parentGuardian.isLegalGuardian ? "heroicons:check-circle" : "heroicons:minus-circle"} 
                        className={`me-2 ${selectedRequest.parentGuardian.isLegalGuardian ? "text-success" : "text-secondary"}`}
                      />
                      <span className={selectedRequest.parentGuardian.isLegalGuardian ? "fw-medium" : "text-muted"}>
                        {selectedRequest.parentGuardian.isLegalGuardian 
                          ? "This person is the legal guardian" 
                          : "Not a legal guardian"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Experience Information */}
        {selectedRequest.isExperienced && selectedRequest.experienceData && (
          <div className="p-4 border-bottom">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-info bg-opacity-10 border-0">
                <h6 className="mb-0 fw-semibold d-flex align-items-center">
                  <Icon icon="heroicons:briefcase" className="me-2" />
                  Work Experience Details
                </h6>
              </div>
              <div className="card-body">
                {/* Current Experience Section */}
                <div className="row g-3">
                  {/* Current/Last Organization */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Organization Name
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:building-office-2"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.currentOrganization ||
                          selectedRequest.experienceData.orgName ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Current/Last Role */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Role
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:briefcase"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.currentRole ||
                          selectedRequest.experienceData.role ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Employment Type */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Employment Type
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:clock"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.employmentType
                          ? selectedRequest.experienceData.employmentType
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1),
                              )
                              .join(" ")
                          : selectedRequest.experienceData.type
                            ? selectedRequest.experienceData.type
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1),
                                )
                                .join(" ")
                            : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Location
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:map-pin"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.location ||
                          selectedRequest.experienceData.experienceLocation ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Current/Last Salary */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Salary (CTC)
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:currency-rupee"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.currentSalary
                          ? `₹ ${new Intl.NumberFormat("en-IN").format(selectedRequest.experienceData.currentSalary)}`
                          : selectedRequest.experienceData.salary
                            ? `₹ ${new Intl.NumberFormat("en-IN").format(selectedRequest.experienceData.salary)}`
                            : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Notice Period */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Notice Period
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:calendar"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.noticePeriod
                          ? selectedRequest.experienceData.noticePeriod
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1),
                              )
                              .join(" ")
                          : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Years of Experience */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Years of Experience
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:chart-bar"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.yearsOfExperience ||
                          selectedRequest.yearsOfExperience ||
                          "0"}{" "}
                        years
                      </span>
                    </div>
                  </div>

                  {/* Joining Date */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Joining Date
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:calendar-days"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.joiningDate
                          ? new Date(
                              selectedRequest.experienceData.joiningDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : selectedRequest.experienceData.experienceJoiningDate
                            ? new Date(
                                selectedRequest.experienceData.experienceJoiningDate,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Relieving Date */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold text-muted small mb-1">
                      Relieving Date
                    </label>
                    <div className="p-2 bg-light rounded border d-flex align-items-center">
                      <Icon
                        icon="heroicons:calendar-days"
                        className="me-2 text-info"
                      />
                      <span className="fw-medium">
                        {selectedRequest.experienceData.relievingDate
                          ? new Date(
                              selectedRequest.experienceData.relievingDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : selectedRequest.experienceData.experienceRelievingDate
                            ? new Date(
                                selectedRequest.experienceData.experienceRelievingDate,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Previous Work Experience History */}
                {selectedRequest.experienceData.previousExperiences &&
                  selectedRequest.experienceData.previousExperiences.length > 0 && (
                    <div className="mt-5 pt-4 border-top">
                      <div className="d-flex align-items-center mb-4">
                        <div className="bg-info bg-opacity-10 rounded-circle p-2 me-2">
                          <Icon
                            icon="heroicons:briefcase"
                            className="text-info"
                          />
                        </div>
                        <h6 className="fw-semibold mb-0">
                          Previous Work Experience History
                        </h6>
                        <span className="ms-2 badge bg-info bg-opacity-25 text-info border border-info">
                          {selectedRequest.experienceData.previousExperiences.length}{" "}
                          {selectedRequest.experienceData.previousExperiences.length === 1
                            ? "Entry"
                            : "Entries"}
                        </span>
                      </div>

                      {/* Map through each previous experience */}
                      {selectedRequest.experienceData.previousExperiences.map(
                        (exp, index) => (
                          <div
                            key={exp.id || index}
                            className="card mb-4 border-0 shadow-sm"
                          >
                            <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center py-3">
                              <div className="d-flex align-items-center">
                                <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                                  <Icon
                                    icon="heroicons:briefcase"
                                    className="text-info"
                                  />
                                </div>
                                <div>
                                  <h6 className="fw-semibold mb-0">
                                    {exp.organization ||
                                      "Previous Organization"}
                                  </h6>
                                  <small className="text-muted">
                                    {exp.role || "Previous Role"} •
                                    {exp.years
                                      ? ` ${exp.years} years`
                                      : " Not specified"}
                                  </small>
                                </div>
                              </div>
                              <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                                Experience {index + 1}
                              </span>
                            </div>

                            <div className="card-body p-4">
                              <div className="row g-3">
                                {/* Organization */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Organization Name
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:building-office-2"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.organization ||
                                        "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* Role */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Role
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:briefcase"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.role || "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* Employment Type */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Employment Type
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:clock"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.type
                                        ? exp.type
                                            .split("_")
                                            .map(
                                              (word) =>
                                                word
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                word.slice(1),
                                            )
                                            .join(" ")
                                        : "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* Location */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Location
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:map-pin"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.location || "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* Salary */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Salary (CTC)
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:currency-rupee"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.salary
                                        ? `₹ ${new Intl.NumberFormat("en-IN").format(exp.salary)}`
                                        : "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* Years of Experience */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    Experience Duration
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:chart-bar"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.years
                                        ? `${exp.years} years`
                                        : "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* From Date */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    From Date
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:calendar"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.fromDate
                                        ? new Date(
                                            exp.fromDate,
                                          ).toLocaleDateString(
                                            "en-US",
                                            {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                            },
                                          )
                                        : "Not specified"}
                                    </span>
                                  </div>
                                </div>

                                {/* To Date */}
                                <div className="col-12 col-md-6">
                                  <label className="form-label fw-semibold text-muted small mb-1">
                                    To Date
                                  </label>
                                  <div className="p-2 bg-light rounded border d-flex align-items-center">
                                    <Icon
                                      icon="heroicons:calendar"
                                      className="me-2 text-secondary"
                                    />
                                    <span className="fw-medium">
                                      {exp.toDate
                                        ? new Date(
                                            exp.toDate,
                                          ).toLocaleDateString(
                                            "en-US",
                                            {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                            },
                                          )
                                        : "Not specified"}
                                      {!exp.toDate &&
                                        exp.fromDate &&
                                        " (Present)"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                {/* Empty state for no previous experience */}
                {(!selectedRequest.experienceData.previousExperiences ||
                  selectedRequest.experienceData.previousExperiences.length === 0) && (
                  <div className="mt-5 pt-4 border-top text-center">
                    <div className="d-inline-flex align-items-center justify-content-center bg-info bg-opacity-10 rounded-circle p-3 mb-3">
                      <Icon
                        icon="heroicons:briefcase"
                        className="text-info"
                        style={{ fontSize: "24px" }}
                      />
                    </div>
                    <h6 className="fw-semibold mb-1">
                      No Previous Experience
                    </h6>
                    <p className="text-muted small mb-0">
                      This candidate has no previous work experience history recorded.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="p-4 border-bottom">
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Document Collection</span>
              <span className="fw-semibold">
                {getCompletionPercentage(selectedRequest)}%
              </span>
            </div>
            <div className="progress rounded" style={{ height: "10px" }}>
              <div
                className={`progress-bar bg-${getCompletionPercentage(selectedRequest) === 100 ? "success" : "info"}`}
                style={{
                  width: `${getCompletionPercentage(selectedRequest)}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="row text-center">
            <div className="col-4">
              <div className="fw-bold text-success fs-4">
                {
                  selectedRequest.documents.filter(
                    (d) => d.status === "Completed",
                  ).length
                }
              </div>
              <div className="text-muted small">Completed</div>
            </div>
            <div className="col-4">
              <div className="fw-bold text-warning fs-4">
                {
                  selectedRequest.documents.filter(
                    (d) => d.status === "Pending",
                  ).length
                }
              </div>
              <div className="text-muted small">Pending</div>
            </div>
            <div className="col-4">
              <div className="fw-bold text-dark fs-4">
                {selectedRequest.documents.length}
              </div>
              <div className="text-muted small">Total</div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="p-4">
          <h6 className="fw-semibold mb-3">Documents Status</h6>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th
                    className="fw-semibold text-muted"
                    style={{ width: "25%" }}
                  >
                    Document
                  </th>
                  <th
                    className="fw-semibold text-muted"
                    style={{ width: "20%" }}
                  >
                    Details
                  </th>
                  <th
                    className="fw-semibold text-muted text-center"
                    style={{ width: "20%" }}
                  >
                    Type
                  </th>
                  <th
                    className="fw-semibold text-muted text-center"
                    style={{ width: "20%" }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedRequest.documents.map((doc, index) => {
                  const uploadedDate = doc.uploadedDate || doc.lastUpdated;
                  const fileSize = doc.fileSize
                    ? (doc.fileSize / 1024 / 1024).toFixed(2) + " MB"
                    : null;

                  return (
                    <tr
                      key={doc.id}
                      className={index % 2 === 0 ? "table-light" : ""}
                    >
                      {/* Document */}
                      <td className="align-middle">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center bg-${
                              doc.status === "Completed"
                                ? "success"
                                : "warning"
                            }-subtle`}
                            style={{ width: 34, height: 34 }}
                          >
                            <Icon
                              icon={
                                doc.status === "Completed"
                                  ? "heroicons:check-circle"
                                  : "heroicons:clock"
                              }
                              className={`text-${
                                doc.status === "Completed"
                                  ? "success"
                                  : "warning"
                              }`}
                            />
                          </div>

                          <div>
                            <div className="fw-medium">{doc.name}</div>
                            {doc.description && (
                              <small className="text-muted d-block">
                                {doc.description}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Details */}
                      <td>
                        {doc.status === "Completed" ? (
                          <div className="small text-muted">
                            {uploadedDate && (
                              <div>
                                Uploaded:{" "}
                                {new Date(
                                  uploadedDate,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {fileSize && <div>Size: {fileSize}</div>}
                            {doc.fileType && (
                              <div>
                                Type: {doc.fileType.toUpperCase()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted small">
                            Pending submission
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="align-middle text-center">
                        <span
                          className={`badge rounded-pill bg-${
                            doc.required ? "danger" : "secondary"
                          }`}
                        >
                          {doc.required ? "Required" : "Optional"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="align-middle text-center">
                        <span
                          className={`badge rounded-pill bg-${
                            doc.status === "Completed"
                              ? "success"
                              : "warning"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="modal-footer border-top-0">
        <button
          type="button"
          className="close-btn"
          onClick={() => setShowRequestDetails(false)}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm d-flex align-items-center px-3"
          onClick={() => {
            // Find the employee and send email
            const employee = employees.find(
              (e) => e.id === selectedRequest.employeeId,
            );
            if (employee) {
              setSelectedEmployees([employee.id]);
              setShowRequestDetails(false);
              setTimeout(() => handleSendEmail(), 300);
            }
          }}
        >
          <Icon icon="heroicons:envelope" className="me-2" />
          Send Email
        </button>
      </div>
    </div>
  </div>
)}
      {/* Email Modal */}
      {showEmailModal && (
        <div
            className="hrms-modal-overlay"
        >
          <div
              className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"

          >
            {/* Header */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                Send Document Request Email
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowEmailModal(false)}
              />
            </div>

            {/* Body */}
              <div className="hrms-modal-body hrms-modal-body-scroll">
              {/* Email Status */}
              {emailStatus.message && (
                <div
                  className={`alert alert-${emailStatus.type === "success" ? "success" : emailStatus.type === "error" ? "danger" : "info"} d-flex align-items-center mb-4`}
                >
                  <Icon
                    icon={
                      emailStatus.type === "success"
                        ? "heroicons:check-circle"
                        : emailStatus.type === "error"
                          ? "heroicons:exclamation-circle"
                          : "heroicons:information-circle"
                    }
                    className="me-2 flex-shrink-0"
                  />
                  <div className="w-100">{emailStatus.message}</div>
                </div>
              )}

              {/* Recipients with Edit Option */}
              <div className="mb-4">
                <label className="form-label fw-semibold">To:</label>
                <div className="p-3 bg-light rounded">
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {employees
                      .filter((emp) => selectedEmployees.includes(emp.id))
                      .map((emp) => {
                        const existingRequest = documentRequests.find(
                          (req) => req.employeeId === emp.id,
                        );

                        return (
                          <span
                            key={emp.id}
                            className="badge bg-primary d-flex align-items-center"
                          >
                            <Icon
                              icon="heroicons:user-circle"
                              className="me-1"
                            />
                            <span className="d-none d-sm-inline">
                              {emp.name}
                            </span>
                            <span
                              className="d-inline d-sm-none text-truncate"
                              style={{ maxWidth: "80px" }}
                            >
                              {emp.name.split(" ")[0]}
                            </span>
                            <small className="ms-1 opacity-75">
                              ({emp.email})
                            </small>
                            {existingRequest && (
                              <small className="ms-2 text-warning">
                                <Icon
                                  icon="heroicons:document-text"
                                  className="me-1"
                                />
                                Existing
                              </small>
                            )}
                            <button
                              type="button"
                              className="btn btn-link p-0 ms-2 text-white"
                              onClick={() => handleEditEmployee(emp)}
                              title="Edit Employee Details"
                            >
                              <Icon
                                icon="heroicons:pencil-square"
                                className="fs-6"
                              />
                            </button>
                          </span>
                        );
                      })}
                  </div>

                  {/* Edit Employee Form (shown when editing) */}
                  {editingEmployeeId && (
                    <div className="border rounded p-3 bg-white mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-semibold">
                          <Icon
                            icon="heroicons:pencil-square"
                            className="me-2"
                          />
                          Edit Employee Details
                        </h6>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setEditingEmployeeId(null)}
                        />
                      </div>

                      <div className="row g-3">
                        {/* Name */}
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={editEmployeeName}
                            onChange={(e) =>
                              setEditEmployeeName(e.target.value)
                            }
                            placeholder="Enter employee name"
                            disabled={sendingEmail}
                          />
                        </div>

                        {/* Phone Number */}
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            value={editEmployeePhone}
                            onChange={(e) =>
                              setEditEmployeePhone(e.target.value)
                            }
                            placeholder="+91 98765 43210"
                            disabled={sendingEmail}
                          />
                        </div>

                        {/* Email */}
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Email ID <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            value={editEmployeeEmail}
                            onChange={(e) =>
                              setEditEmployeeEmail(e.target.value)
                            }
                            placeholder="Enter email address"
                            disabled={sendingEmail}
                          />
                        </div>

                        {/* Department */}
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Department{" "}
                          </label>
                          <select
                            className="form-select"
                            value={editEmployeeDepartment}
                            onChange={(e) =>
                              setEditEmployeeDepartment(e.target.value)
                            }
                            disabled={sendingEmail}
                          >
                            <option value="">Select Department</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Operations">Operations</option>
                            <option value="External">External</option>
                          </select>
                        </div>

                        {/* Designation */}
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Designation{" "}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={editEmployeeDesignation}
                            onChange={(e) =>
                              setEditEmployeeDesignation(e.target.value)
                            }
                            placeholder="e.g., Software Engineer, Marketing Executive"
                            disabled={sendingEmail}
                          />
                        </div>

                        {/* Employee ID */}
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Employee ID{" "}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={editEmployeeId}
                            onChange={(e) => setEditEmployeeId(e.target.value)}
                            placeholder="EMP001, CAND001, etc."
                            disabled={sendingEmail}
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => setEditingEmployeeId(null)}
                          disabled={sendingEmail}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary d-flex align-items-center gap-2"
                          onClick={handleSaveEmployeeEdit}
                          disabled={
                            sendingEmail ||
                            !editEmployeeName.trim() ||
                            !editEmployeeEmail.trim()
                          }
                        >
                          <Icon icon="heroicons:check" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Method */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Email Sending Method:
                </label>
                <div className="btn-group w-100" role="group">
                  {/* API */}
                  <input
                    type="radio"
                    className="btn-check"
                    name="emailMethod"
                    id="method-api"
                    value="api"
                    checked={emailMethod === "api"}
                    onChange={(e) => setEmailMethod(e.target.value)}
                  />
                  <label
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-1"
                    htmlFor="method-api"
                  >
                    <Icon icon="heroicons:server" />
                    <span>API Send</span>
                  </label>

                  {/* Clipboard */}
                  <input
                    type="radio"
                    className="btn-check"
                    name="emailMethod"
                    id="method-clipboard"
                    value="clipboard"
                    checked={emailMethod === "clipboard"}
                    onChange={(e) => setEmailMethod(e.target.value)}
                  />
                  <label
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-1"
                    htmlFor="method-clipboard"
                  >
                    <Icon icon="heroicons:clipboard" />
                    <span>Copy to Clipboard</span>
                  </label>

                  {/* Mailto */}
                  <input
                    type="radio"
                    className="btn-check"
                    name="emailMethod"
                    id="method-mailto"
                    value="mailto"
                    checked={emailMethod === "mailto"}
                    onChange={(e) => setEmailMethod(e.target.value)}
                    disabled={selectedEmployees.length > 1}
                  />
                  <label
                    className={`btn btn-outline-primary d-flex align-items-center justify-content-center gap-1 ${
                      selectedEmployees.length > 1 ? "disabled" : ""
                    }`}
                    htmlFor="method-mailto"
                  >
                    <Icon icon="heroicons:envelope-open" />
                    <span>Mailto (Single)</span>
                  </label>
                </div>
              </div>

                  {/* CC and BCC */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    CC (Optional):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={ccEmails}
                    onChange={(e) => setCcEmails(e.target.value)}
                    placeholder="email1@example.com, email2@example.com"
                    disabled={emailMethod === "mailto" || sendingEmail}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    BCC (Optional):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={bccEmails}
                    onChange={(e) => setBccEmails(e.target.value)}
                    placeholder="email1@example.com, email2@example.com"
                    disabled={emailMethod === "mailto" || sendingEmail}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Subject:</label>
                <input
                  type="text"
                  className="form-control"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject..."
                  disabled={sendingEmail}
                />
              </div>

        {/* ========== PERSONAL INFORMATION SECTION - ADDED ========== */}
        {selectedEmployees.length === 1 && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-info bg-opacity-10 border-0">
              <h6 className="mb-0 fw-semibold d-flex align-items-center">
                <Icon icon="heroicons:user" className="me-2" />
                Personal Information 
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Date of Birth */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">Date of Birth</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestDob ? new Date(newRequestDob).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : "Not specified"}
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>

                {/* Gender */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">Gender</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestGender || "Not specified"}
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>

                {/* Marital Status */}
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">Marital Status</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestMaritalStatus || "Not specified"}
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}


        {/* ========== EDUCATION QUALIFICATION SECTION - ADDED ========== */}
        {selectedEmployees.length === 1 && educationQualifications && educationQualifications.length > 0 && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-info bg-opacity-10 border-0">
              <h6 className="mb-0 fw-semibold d-flex align-items-center">
                <Icon icon="heroicons:academic-cap" className="me-2" />
                Education Qualifications
              </h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm  mb-0">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Institution/Board</th>
                      <th>Degree/Branch</th>
                      <th>Year</th>
                      <th>Marks/CGPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {educationQualifications
                      .sort((a, b) => {
                        const levelOrder = { '10th': 1, '12th': 2, 'diploma': 3, 'graduation': 4, 'post_graduation': 5, 'phd': 6, 'certification': 7 };
                        return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
                      })
                      .map((edu, idx) => (
                        <tr key={edu.id || idx}>
                          <td className="fw-medium align-middle">{edu.levelLabel || edu.level}</td>
                          <td>
                            {edu.institution}
                            {edu.boardUniversity && <div><small className="text-muted">{edu.boardUniversity}</small></div>}
                          </td>
                          <td>
                            {edu.degree && <div>{edu.degree}</div>}
                            {edu.branch && <small className="text-muted">{edu.branch}</small>}
                          </td>
                          <td>
                            {edu.passingYear}
                            {edu.joiningYear && <div><small className="text-muted">{edu.joiningYear} - {edu.passingYear}</small></div>}
                          </td>
                          <td>
                            {edu.percentage && <span className="badge bg-success bg-opacity-10 text-success p-2">{edu.percentage}%</span>}
                            {edu.cgpa && <span className="badge bg-info bg-opacity-10 text-info p-2">CGPA: {edu.cgpa}/10</span>}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* ========== PARENT/GUARDIAN DETAILS SECTION - ADDED ========== */}
        {selectedEmployees.length === 1 && (
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-primary bg-opacity-10 border-0">
              <h6 className="mb-0 fw-semibold d-flex align-items-center">
                <Icon icon="heroicons:users" className="me-2" />
                Parent / Guardian Details
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {/* Parent/Guardian Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Parent/Guardian Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestParentName || "Not specified"}
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>

                {/* Relationship */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Relationship</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestParentRelationship || "Not specified"}
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>

                {/* Parent/Guardian Phone */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestParentPhone || "Not specified"}
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>

                {/* Employment Status */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Employment Status</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestParentEmployment || "Not specified"}
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>

                {/* Organization */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Organization</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestParentOrganization || "Not specified"}
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>

                {/* Designation */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestParentDesignation || "Not specified"}
                    readOnly
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>

                {/* Is Legal Guardian */}
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <Icon 
                      icon={newRequestIsGuardian ? "heroicons:check-circle" : "heroicons:minus-circle"} 
                      className={`me-2 ${newRequestIsGuardian ? "text-success" : "text-secondary"}`}
                    />
                    <span className={newRequestIsGuardian ? "fw-semibold" : "text-muted"}>
                      {newRequestIsGuardian ? "This person is the legal guardian" : "Not a legal guardian"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

              {/* ========== ADDRESS DETAILS SECTION ========== */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-primary bg-opacity-10 border-0">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center">
                    <Icon icon="heroicons:map-pin" className="me-2" />
                    Address Details
                  </h6>
                </div>
                <div className="card-body">
                  {/* CURRENT ADDRESS */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="fw-semibold mb-0 d-flex align-items-center">
                        <Icon
                          icon="heroicons:home"
                          className="me-2 text-primary"
                        />
                        Current Address
                      </h6>
                    </div>

                    <div className="row g-3">
                      {/* Address Line 1 */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address Line 1 <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.address1}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              address1: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                address1: e.target.value,
                              });
                            }
                          }}
                          placeholder="House/Flat No., Building Name, Street"
                          disabled={
                            sendingEmail || selectedEmployees.length > 1
                          }
                          readOnly={selectedEmployees.length === 1}
                          style={
                            selectedEmployees.length === 1
                              ? { backgroundColor: "#f8f9fa" }
                              : {}
                          }
                        />
                        {selectedEmployees.length === 1 && (
                          <small className="text-muted">
                            <Icon
                              icon="heroicons:information-circle"
                              className="me-1"
                            />
                            Edit address in employee profile or create new
                            request
                          </small>
                        )}
                      </div>

                      {/* Address Line 2 */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address Line 2{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.address2}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              address2: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                address2: e.target.value,
                              });
                            }
                          }}
                          placeholder="Area, Landmark, Colony"
                          disabled={
                            sendingEmail || selectedEmployees.length > 1
                          }
                          readOnly={selectedEmployees.length === 1}
                          style={
                            selectedEmployees.length === 1
                              ? { backgroundColor: "#f8f9fa" }
                              : {}
                          }
                        />
                      </div>

                      {/* Country */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Country <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={currentAddress.country}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              country: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                country: e.target.value,
                              });
                            }
                          }}
                          disabled={
                            sendingEmail || selectedEmployees.length > 1
                          }
                          style={
                            selectedEmployees.length === 1
                              ? {
                                  backgroundColor: "#f8f9fa",
                                  pointerEvents: "none",
                                }
                              : {}
                          }
                        >
                          <option value="">Select Country</option>
                          <option value="India">India</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* State */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          State <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.state}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              state: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                state: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter state"
                          disabled={
                            sendingEmail || selectedEmployees.length > 1
                          }
                          readOnly={selectedEmployees.length === 1}
                          style={
                            selectedEmployees.length === 1
                              ? { backgroundColor: "#f8f9fa" }
                              : {}
                          }
                        />
                      </div>

                      {/* District */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          District <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.district}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              district: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                district: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter district"
                          disabled={
                            sendingEmail || selectedEmployees.length > 1
                          }
                          readOnly={selectedEmployees.length === 1}
                          style={
                            selectedEmployees.length === 1
                              ? { backgroundColor: "#f8f9fa" }
                              : {}
                          }
                        />
                      </div>

                      {/* City */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          City <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.city}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              city: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                city: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter city"
                          disabled={
                            sendingEmail || selectedEmployees.length > 1
                          }
                          readOnly={selectedEmployees.length === 1}
                          style={
                            selectedEmployees.length === 1
                              ? { backgroundColor: "#f8f9fa" }
                              : {}
                          }
                        />
                      </div>

                      {/* Pincode */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Pincode <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.pincode}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              pincode: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                pincode: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter pincode"
                          maxLength="6"
                          disabled={
                            sendingEmail || selectedEmployees.length > 1
                          }
                          readOnly={selectedEmployees.length === 1}
                          style={
                            selectedEmployees.length === 1
                              ? { backgroundColor: "#f8f9fa" }
                              : {}
                          }
                        />
                      </div>

                      {/* Nationality */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Nationality <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.nationality || ""}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              nationality: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                nationality: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter nationality"
                          disabled={
                            sendingEmail || selectedEmployees.length > 1
                          }
                          readOnly={selectedEmployees.length === 1}
                          style={
                            selectedEmployees.length === 1
                              ? { backgroundColor: "#f8f9fa" }
                              : {}
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* PERMANENT ADDRESS */}
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="fw-semibold mb-0 d-flex align-items-center">
                        <Icon
                          icon="heroicons:building-office"
                          className="me-2 text-success"
                        />
                        Permanent Address
                      </h6>
                    </div>

                    <div className="row g-3">
                      {/* Address Line 1 */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address Line 1 <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.address1}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              address1: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="House/Flat No., Building Name, Street"
                          disabled={
                            sendingEmail ||
                            sameAsCurrent ||
                            selectedEmployees.length > 1
                          }
                          readOnly={
                            selectedEmployees.length === 1 && !sameAsCurrent
                          }
                          style={
                            selectedEmployees.length === 1 && !sameAsCurrent
                              ? { backgroundColor: "#f8f9fa" }
                              : sameAsCurrent
                                ? { backgroundColor: "#f8f9fa" }
                                : {}
                          }
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address Line 2{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.address2}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              address2: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Area, Landmark, Colony"
                          disabled={
                            sendingEmail ||
                            sameAsCurrent ||
                            selectedEmployees.length > 1
                          }
                          readOnly={
                            selectedEmployees.length === 1 && !sameAsCurrent
                          }
                          style={
                            selectedEmployees.length === 1 && !sameAsCurrent
                              ? { backgroundColor: "#f8f9fa" }
                              : sameAsCurrent
                                ? { backgroundColor: "#f8f9fa" }
                                : {}
                          }
                        />
                      </div>

                      {/* Country */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Country <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={permanentAddress.country}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              country: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          disabled={
                            sendingEmail ||
                            sameAsCurrent ||
                            selectedEmployees.length > 1
                          }
                          style={
                            selectedEmployees.length === 1 && !sameAsCurrent
                              ? {
                                  backgroundColor: "#f8f9fa",
                                  pointerEvents: "none",
                                }
                              : sameAsCurrent
                                ? {
                                    backgroundColor: "#f8f9fa",
                                    pointerEvents: "none",
                                  }
                                : {}
                          }
                        >
                          <option value="">Select Country</option>
                          <option value="India">India</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* State */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          State <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.state}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              state: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Enter state"
                          disabled={
                            sendingEmail ||
                            sameAsCurrent ||
                            selectedEmployees.length > 1
                          }
                          readOnly={
                            selectedEmployees.length === 1 && !sameAsCurrent
                          }
                          style={
                            selectedEmployees.length === 1 && !sameAsCurrent
                              ? { backgroundColor: "#f8f9fa" }
                              : sameAsCurrent
                                ? { backgroundColor: "#f8f9fa" }
                                : {}
                          }
                        />
                      </div>

                      {/* District */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          District <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.district}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              district: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Enter district"
                          disabled={
                            sendingEmail ||
                            sameAsCurrent ||
                            selectedEmployees.length > 1
                          }
                          readOnly={
                            selectedEmployees.length === 1 && !sameAsCurrent
                          }
                          style={
                            selectedEmployees.length === 1 && !sameAsCurrent
                              ? { backgroundColor: "#f8f9fa" }
                              : sameAsCurrent
                                ? { backgroundColor: "#f8f9fa" }
                                : {}
                          }
                        />
                      </div>

                      {/* City */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          City <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.city}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              city: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Enter city"
                          disabled={
                            sendingEmail ||
                            sameAsCurrent ||
                            selectedEmployees.length > 1
                          }
                          readOnly={
                            selectedEmployees.length === 1 && !sameAsCurrent
                          }
                          style={
                            selectedEmployees.length === 1 && !sameAsCurrent
                              ? { backgroundColor: "#f8f9fa" }
                              : sameAsCurrent
                                ? { backgroundColor: "#f8f9fa" }
                                : {}
                          }
                        />
                      </div>

                      {/* Pincode */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Pincode <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.pincode}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              pincode: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Enter pincode"
                          maxLength="6"
                          disabled={
                            sendingEmail ||
                            sameAsCurrent ||
                            selectedEmployees.length > 1
                          }
                          readOnly={
                            selectedEmployees.length === 1 && !sameAsCurrent
                          }
                          style={
                            selectedEmployees.length === 1 && !sameAsCurrent
                              ? { backgroundColor: "#f8f9fa" }
                              : sameAsCurrent
                                ? { backgroundColor: "#f8f9fa" }
                                : {}
                          }
                        />
                      </div>

                      {/* Nationality */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Nationality <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.nationality || ""}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              nationality: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Enter nationality"
                          disabled={
                            sendingEmail ||
                            sameAsCurrent ||
                            selectedEmployees.length > 1
                          }
                          readOnly={
                            selectedEmployees.length === 1 && !sameAsCurrent
                          }
                          style={
                            selectedEmployees.length === 1 && !sameAsCurrent
                              ? { backgroundColor: "#f8f9fa" }
                              : sameAsCurrent
                                ? { backgroundColor: "#f8f9fa" }
                                : {}
                          }
                        />
                      </div>
                    </div>

                    {/* Manual Edit Hint */}
                    {sameAsCurrent && (
                      <div className="mt-2">
                        <small className="text-muted d-flex align-items-center">
                          <Icon
                            icon="heroicons:information-circle"
                            className="me-1"
                          />
                          Uncheck "Same as Current Address" to edit permanent
                          address independently
                        </small>
                      </div>
                    )}

                    {selectedEmployees.length === 1 && !sameAsCurrent && (
                      <div className="mt-2">
                        <small className="text-muted d-flex align-items-center">
                          <Icon
                            icon="heroicons:information-circle"
                            className="me-1"
                          />
                          Address is read-only. Edit in employee profile or
                          create new request.
                        </small>
                      </div>
                    )}

                    {selectedEmployees.length > 1 && (
                      <div className="mt-2">
                        <small className="text-warning d-flex align-items-center">
                          <Icon
                            icon="heroicons:exclamation-triangle"
                            className="me-1"
                          />
                          Address editing disabled when multiple employees are
                          selected
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Experience Status Display (Read-only Text Field) */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Candidate Type</label>
                <div className="p-3 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <Icon
                      icon={
                        isExperienced ? "heroicons:briefcase" : "heroicons:user"
                      }
                      className={`me-2 ${isExperienced ? "text-success" : "text-secondary"}`}
                    />
                    <input
                      type="text"
                      className="form-control bg-white"
                      value={isExperienced ? "Experienced" : "Fresher"}
                      readOnly
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Experience Details - Display Only for Single Employee */}
              {selectedEmployees.length === 1 && isExperienced && (
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-info bg-opacity-10 border-0">
                    <h6 className="mb-0 fw-semibold d-flex align-items-center">
                      <Icon icon="heroicons:briefcase" className="me-2" />
                      Work Experience Details 
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      {/* Current/Last Organization */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Organization Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentOrganization || "Not specified"}
                          readOnly
                        />
                      </div>

                      {/* Current/Last Role */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">Role</label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentRole || "Not specified"}
                          readOnly
                        />
                      </div>

                      {/* Employment Type */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Employment Type
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            employmentType
                              ? employmentType
                                  .split("_")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1),
                                  )
                                  .join(" ")
                              : "Not specified"
                          }
                          readOnly
                        />
                      </div>

                      {/* Location */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Location
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={experienceLocation || "Not specified"}
                          readOnly
                        />
                      </div>

                      {/* Current/Last Salary */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Salary (CTC)
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="text"
                            className="form-control"
                            value={
                              currentSalary
                                ? new Intl.NumberFormat("en-IN").format(
                                    currentSalary,
                                  )
                                : "Not specified"
                            }
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Notice Period */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Notice Period
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            noticePeriod
                              ? noticePeriod
                                  .split("_")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1),
                                  )
                                  .join(" ")
                              : "Not specified"
                          }
                          readOnly
                        />
                      </div>

                      {/* Years of Experience */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Years of Experience
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={
                              yearsOfExperience
                                ? `${yearsOfExperience} years`
                                : "Not specified"
                            }
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Joining Date */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Joining Date
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            experienceJoiningDate
                              ? new Date(
                                  experienceJoiningDate,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Not specified"
                          }
                          readOnly
                        />
                      </div>

                      {/* Relieving Date */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Relieving Date
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            experienceRelievingDate
                              ? new Date(
                                  experienceRelievingDate,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Not specified"
                          }
                          readOnly
                        />
                      </div>

                      {/* Previous Experiences List */}
                      {previousExperiences &&
                        previousExperiences.length > 0 && (
                          <div className="col-12 mt-3">
                            <label className="form-label fw-semibold">
                              Previous Work Experiences
                            </label>
                            <div className="list-group">
                              {previousExperiences.map((exp, index) => (
                                <div
                                  key={exp.id || index}
                                  className="list-group-item border rounded p-3 mb-2"
                                >
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0 fw-semibold">
                                      Experience +{index + 1}
                                    </h6>
                                  </div>
                                  <div className="row g-2">
                                    <div className="col-md-6">
                                      <small className="text-muted">
                                        Organization:
                                      </small>
                                      <div className="fw-medium">
                                        {exp.organization || "Not specified"}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <small className="text-muted">
                                        Role:
                                      </small>
                                      <div className="fw-medium">
                                        {exp.role || "Not specified"}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <small className="text-muted">
                                        Employment Type:
                                      </small>
                                      <div className="fw-medium">
                                        {exp.type
                                          ? exp.type
                                              .split("_")
                                              .map(
                                                (word) =>
                                                  word.charAt(0).toUpperCase() +
                                                  word.slice(1),
                                              )
                                              .join(" ")
                                          : "Not specified"}
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <small className="text-muted">
                                        Location:
                                      </small>
                                      <div className="fw-medium">
                                        {exp.location || "Not specified"}
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <small className="text-muted">
                                        Salary (CTC):
                                      </small>
                                      <div className="fw-medium">
                                        {exp.salary
                                          ? `₹${new Intl.NumberFormat("en-IN").format(exp.salary)}`
                                          : "Not specified"}
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <small className="text-muted">
                                        Years of Experience:
                                      </small>
                                      <div className="fw-medium">
                                        {exp.years
                                          ? `${exp.years} years`
                                          : "Not specified"}
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <small className="text-muted">
                                        From Date:
                                      </small>
                                      <div className="fw-medium">
                                        {exp.fromDate
                                          ? new Date(
                                              exp.fromDate,
                                            ).toLocaleDateString("en-US")
                                          : "Not specified"}
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <small className="text-muted">
                                        To Date:
                                      </small>
                                      <div className="fw-medium">
                                        {exp.toDate
                                          ? new Date(
                                              exp.toDate,
                                            ).toLocaleDateString("en-US")
                                          : "Not specified"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Document Upload Section - Same as New Request Modal */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Uploaded Documents
                </label>

                <div className="bg-light rounded p-3">
                  <div className="table-responsive">
                    <table className="table table-borderless table-sm mb-0">
                      <thead>
                        <tr>
                          <th
                            className="fw-semibold text-muted"
                            style={{ width: "40%" }}
                          >
                            Document Name
                          </th>
                          <th
                            className="fw-semibold text-muted"
                            style={{ width: "20%" }}
                          >
                            Type
                          </th>
                          <th
                            className="fw-semibold text-muted"
                            style={{ width: "20%" }}
                          >
                            Upload Status
                          </th>
                          <th
                            className="fw-semibold text-muted text-center justify-items-center"
                            style={{ width: "20%" }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {requiredDocuments.map((doc, index) => {
                          // SIMPLE SOLUTION: Only check the global uploadedDocuments state
                          // This contains ALL uploaded files from both modals
                          const uploadedDoc = uploadedDocuments.find(
                            (ud) => ud.id === doc.id,
                          );
                          const isUploaded = !!uploadedDoc;

                          // Function to handle viewing ANY uploaded document
                          const handleViewDocument = () => {
                            if (!uploadedDoc) {
                              setEmailStatus({
                                type: "error",
                                message: "No document found to view",
                              });
                              return;
                            }

                            // TRY MULTIPLE WAYS TO GET THE FILE URL

                            // 1. Direct fileUrl (from object URL)
                            if (
                              uploadedDoc.fileUrl &&
                              typeof uploadedDoc.fileUrl === "string"
                            ) {
                              try {
                                // Test if URL is still valid
                                window.open(uploadedDoc.fileUrl, "_blank");
                                return;
                              } catch (error) {
                                console.warn("Direct URL failed:", error);
                              }
                            }

                            // 2. If there's a File object, create a new URL
                            if (
                              uploadedDoc.file &&
                              uploadedDoc.file instanceof File
                            ) {
                              try {
                                const newUrl = URL.createObjectURL(
                                  uploadedDoc.file,
                                );
                                window.open(newUrl, "_blank");
                                return;
                              } catch (error) {
                                console.warn(
                                  "File object URL creation failed:",
                                  error,
                                );
                              }
                            }

                            // 3. Check for data URL (if stored as base64)
                            if (
                              uploadedDoc.dataUrl &&
                              typeof uploadedDoc.dataUrl === "string"
                            ) {
                              try {
                                window.open(uploadedDoc.dataUrl, "_blank");
                                return;
                              } catch (error) {
                                console.warn("Data URL failed:", error);
                              }
                            }

                            // 4. Check if it's from document requests (for existing requests)
                            if (
                              uploadedDoc.originalDocument &&
                              uploadedDoc.originalDocument.fileUrl
                            ) {
                              try {
                                window.open(
                                  uploadedDoc.originalDocument.fileUrl,
                                  "_blank",
                                );
                                return;
                              } catch (error) {
                                console.warn(
                                  "Original document URL failed:",
                                  error,
                                );
                              }
                            }

                            // If all methods fail, show error
                            setEmailStatus({
                              type: "error",
                              message:
                                "Cannot view document. The file may have been removed or is inaccessible.",
                            });
                          };

                          // Function to handle document replacement
                          const handleReplaceDocument = () => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
                            input.style.display = "none";

                            input.onchange = (e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const file = files[0];

                                // Validate file type
                                const allowedTypes = [
                                  "application/pdf",
                                  "image/jpeg",
                                  "image/jpg",
                                  "image/png",
                                  "application/msword",
                                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                ];

                                if (!allowedTypes.includes(file.type)) {
                                  setEmailStatus({
                                    type: "error",
                                    message:
                                      "Please upload PDF, JPG, PNG, or DOC files only",
                                  });
                                  document.body.removeChild(input);
                                  return;
                                }

                                // Validate file size (5MB max)
                                const maxSize = 5 * 1024 * 1024; // 5MB
                                if (file.size > maxSize) {
                                  setEmailStatus({
                                    type: "error",
                                    message:
                                      "File size should be less than 5MB",
                                  });
                                  document.body.removeChild(input);
                                  return;
                                }

                                // Create object URL for preview
                                const fileUrl = URL.createObjectURL(file);

                                // Create updated document object
                                const updatedDoc = {
                                  id: doc.id,
                                  name: file.name,
                                  file: file,
                                  fileUrl: fileUrl,
                                  size: file.size,
                                  type: file.type,
                                  uploadDate: new Date().toISOString(),
                                };

                                // Update the uploadedDocuments array
                                setUploadedDocuments((prev) => {
                                  // First, revoke old URL if exists
                                  const oldDoc = prev.find(
                                    (d) => d.id === doc.id,
                                  );
                                  if (oldDoc && oldDoc.fileUrl) {
                                    URL.revokeObjectURL(oldDoc.fileUrl);
                                  }

                                  // Replace the document
                                  return prev.map((d) =>
                                    d.id === doc.id ? updatedDoc : d,
                                  );
                                });

                                setEmailStatus({
                                  type: "success",
                                  message: "Document replaced successfully",
                                });
                              }

                              // Clean up the temporary input
                              document.body.removeChild(input);
                            };

                            // Add to body and trigger click
                            document.body.appendChild(input);
                            input.click();
                          };

                          // Function to remove document
                          const handleRemoveDocument = () => {
                            if (uploadedDoc?.fileUrl) {
                              URL.revokeObjectURL(uploadedDoc.fileUrl);
                            }

                            setUploadedDocuments((prev) =>
                              prev.filter((d) => d.id !== doc.id),
                            );

                            setEmailStatus({
                              type: "success",
                              message: "Document removed successfully",
                            });
                          };

                          // Function to handle new upload
                          const handleNewUpload = (e, docId) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            // Validate file type
                            const allowedTypes = [
                              "application/pdf",
                              "image/jpeg",
                              "image/jpg",
                              "image/png",
                              "application/msword",
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            ];

                            if (!allowedTypes.includes(file.type)) {
                              setEmailStatus({
                                type: "error",
                                message:
                                  "Please upload PDF, JPG, PNG, or DOC files only",
                              });
                              return;
                            }

                            // Validate file size (5MB max)
                            const maxSize = 5 * 1024 * 1024; // 5MB
                            if (file.size > maxSize) {
                              setEmailStatus({
                                type: "error",
                                message: "File size should be less than 5MB",
                              });
                              return;
                            }

                            // Create object URL for preview
                            const fileUrl = URL.createObjectURL(file);

                            // Add to uploadedDocuments
                            const newDoc = {
                              id: docId,
                              name: file.name,
                              file: file,
                              fileUrl: fileUrl,
                              size: file.size,
                              type: file.type,
                              uploadDate: new Date().toISOString(),
                            };

                            setUploadedDocuments((prev) => {
                              // Remove if already exists
                              const filtered = prev.filter(
                                (d) => d.id !== docId,
                              );
                              return [...filtered, newDoc];
                            });

                            setEmailStatus({
                              type: "success",
                              message: `${doc.name} uploaded successfully`,
                            });
                          };

                          return (
                            <tr
                              key={doc.id}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-light"
                              }
                            >
                              <td className="align-middle">
                                <div className="d-flex align-items-center">
                                  <Icon
                                    icon={
                                      isUploaded
                                        ? "heroicons:document-check"
                                        : "heroicons:document"
                                    }
                                    className={`me-2 ${isUploaded ? "text-success" : "text-secondary"}`}
                                  />
                                  <div>
                                    <div className="fw-medium">{doc.name}</div>
                                    {uploadedDoc && (
                                      <div>
                                        <small className="text-muted">
                                          Uploaded:{" "}
                                          {new Date(
                                            uploadedDoc.uploadDate ||
                                              new Date(),
                                          ).toLocaleDateString()}
                                        </small>
                                        {uploadedDoc.size && (
                                          <>
                                            <br />
                                            <small className="text-muted">
                                              File: {uploadedDoc.name} (
                                              {(
                                                uploadedDoc.size /
                                                1024 /
                                                1024
                                              ).toFixed(2)}{" "}
                                              MB)
                                            </small>
                                          </>
                                        )}
                                        <br />
                                        <small className="text-muted">
                                          Type: {uploadedDoc.type || "Unknown"}
                                        </small>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="align-middle">
                                <span
                                  className={`badge bg-${doc.required ? "danger" : "secondary"}`}
                                >
                                  {doc.required ? "Required" : "Optional"}
                                </span>
                              </td>
                              <td className="align-middle">
                                {isUploaded ? (
                                  <span className="badge bg-success">
                                    Uploaded
                                  </span>
                                ) : (
                                  <span
                                    className={`badge bg-${doc.required ? "warning" : "secondary"}`}
                                  >
                                    {doc.required ? "Pending" : "Optional"}
                                  </span>
                                )}
                              </td>
                              <td className="align-middle">
                                <div className="d-flex flex-wrap gap-1">
                                  {isUploaded ? (
                                    <>
                                      {/* View Button - FIXED to handle ALL document sources */}
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                        onClick={() => {
                                          // Pass the specific uploadedDoc for this row
                                          handleViewDocument(uploadedDoc);
                                        }}
                                        title="View Document"
                                        disabled={sendingEmail}
                                      >
                                        <Icon
                                          icon="heroicons:eye"
                                          className="fs-6"
                                        />
                                      </button>

                                      {/* Replace Button - Simple unified function */}
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning d-flex align-items-center"
                                        onClick={handleReplaceDocument}
                                        title="Replace Document"
                                        disabled={sendingEmail}
                                      >
                                        <Icon
                                          icon="heroicons:pencil"
                                          className="fs-6"
                                        />
                                      </button>

                                      {/* Remove Button - For all uploaded documents */}
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                        onClick={handleRemoveDocument}
                                        title="Remove Document"
                                        disabled={sendingEmail}
                                      >
                                        <Icon
                                          icon="heroicons:trash"
                                          className="fs-6"
                                        />
                                      </button>
                                    </>
                                  ) : (
                                    // Upload Button (when document is not uploaded)
                                    <div className="w-100">
                                      <input
                                        type="file"
                                        id={`email-upload-${doc.id}`}
                                        className="d-none"
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        onChange={(e) =>
                                          handleNewUpload(e, doc.id)
                                        }
                                        disabled={sendingEmail}
                                      />
                                      <label
                                        htmlFor={`email-upload-${doc.id}`}
                                        className={`btn btn-sm w-100 ${doc.required ? "btn-outline-success" : "btn-outline-secondary"} upload-btn`}
                                        style={{
                                          cursor: "pointer",
                                          height: "60px",
                                          padding: "6px",
                                          gap: "4px",
                                        }}
                                        title={
                                          sendingEmail
                                            ? "Please wait..."
                                            : `Upload ${doc.name}`
                                        }
                                      >
                                        <Icon
                                          icon="heroicons:arrow-up-tray"
                                          className="mb-1"
                                          style={{ fontSize: "18px" }}
                                        />
                                        <span>Upload</span>
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Upload Summary */}
                  {uploadedDocuments.length > 0 && (
                    <div className="mt-3 pt-3 border-top">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">
                            {uploadedDocuments.length} document(s) uploaded in
                            current session
                          </small>
                          <br />
                          <small className="text-muted d-flex align-items-center gap-1">
                            <Icon
                              icon="heroicons:pencil"
                              style={{ fontSize: "12px" }}
                            />
                            <span>
                              Click the pencil icon to replace uploaded
                              documents
                            </span>
                          </small>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Clear all documents uploaded in this session?",
                              )
                            ) {
                              // Revoke all object URLs to prevent memory leaks
                              uploadedDocuments.forEach((doc) => {
                                if (doc.fileUrl) {
                                  URL.revokeObjectURL(doc.fileUrl);
                                }
                              });
                              setUploadedDocuments([]);
                              setEmailStatus({
                                type: "success",
                                message: "All documents cleared from session",
                              });
                            }
                          }}
                          disabled={
                            uploadedDocuments.length === 0 || sendingEmail
                          }
                        >
                          <Icon icon="heroicons:trash" />
                          <span>Clear All</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Email Body */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Email Body:</label>
                <textarea
                  className="form-control"
                  rows="8"
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  placeholder="Enter email content..."
                  disabled={sendingEmail}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Info Alert */}
              <div className="alert alert-info d-flex align-items-start">
                <Icon
                  icon="heroicons:information-circle"
                  className="me-2 mt-1 flex-shrink-0"
                />
                <div>
                  <strong className="d-block mb-1">Note:</strong>
                  This email will request employees to submit scanned copies
                  (PDF format) of the required documents.
                  {selectedEmployees.length > 0 && (
                    <div className="mt-2">
                      <strong>
                        Employee details can be edited by clicking the edit icon
                        next to their name.
                      </strong>{" "}
                      Changes will be saved to the employee record.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer bg-light rounded-bottom-3 px-4 py-3">
              <div className="d-flex flex-column flex-md-row w-100 gap-2">
                <button
                  type="button"
                  className="btn btn-danger order-2 order-md-1 flex-fill"
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailStatus({ type: "", message: "" });
                    setCcEmails("");
                    setBccEmails("");
                    // Clear edit state
                    setEditingEmployeeId(null);
                    // Clear address state
                    setCurrentAddress({
                      address1: "",
                      address2: "",
                      country: "",
                      state: "",
                      district: "",
                      city: "",
                      pincode: "",
                      nationality: "",
                    });
                    setPermanentAddress({
                      address1: "",
                      address2: "",
                      country: "",
                      state: "",
                      district: "",
                      city: "",
                      pincode: "",
                      nationality: "",
                    });
                    setSameAsCurrent(false);
                    // Clear any temporary uploads
                    emailUploads.forEach((doc) => {
                      if (doc.fileUrl) URL.revokeObjectURL(doc.fileUrl);
                    });
                    setEmailUploads([]);
                  }}
                  disabled={sendingEmail}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary order-1 order-md-2 flex-fill d-flex align-items-center justify-content-center"
                  onClick={handleConfirmSendEmailWithEdits}
                  disabled={
                    sendingEmail ||
                    !emailTemplate.trim() ||
                    !emailSubject.trim()
                  }
                >
                  {sendingEmail ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Icon icon="heroicons:paper-airplane" className="me-2" />
                      <span>
                        {emailMethod === "api"
                          ? "Send via API"
                          : emailMethod === "clipboard"
                            ? "Copy to Clipboard"
                            : "Open Email Client"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div
           className="hrms-modal-overlay"
        >
          <div
              className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
          >
            {/* Header */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                New Document Request
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowNewRequestModal(false);
                  setEmailStatus({ type: "", message: "" });
                  setCcEmails("");
                  setBccEmails("");
                }}
              />
            </div>

            {/* Body */}
              <div className="hrms-modal-body hrms-modal-body-scroll">
              {/* Email Status */}
              {emailStatus.message && (
                <div
                  className={`alert alert-${emailStatus.type === "success" ? "success" : emailStatus.type === "error" ? "danger" : "info"} d-flex align-items-center mb-3`}
                >
                  <Icon
                    icon={
                      emailStatus.type === "success"
                        ? "heroicons:check-circle"
                        : emailStatus.type === "error"
                          ? "heroicons:exclamation-circle"
                          : "heroicons:information-circle"
                    }
                    className="me-2"
                  />
                  {emailStatus.message}
                </div>
              )}

              {/* Contact Information Row */}
              <div className="row g-3 mb-3">
                {/* Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestName}
                    onChange={(e) => setNewRequestName(e.target.value)}
                    placeholder="Enter candidate/employee name"
                    disabled={sendingEmail}
                  />
                </div>
                                    {/* Employee ID */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Employee ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestEmployeeId}
                    onChange={(e) => setNewRequestEmployeeId(e.target.value)}
                    placeholder="EMP001, CAND001, etc."
                    disabled={sendingEmail}
                  />
                </div>
              </div>

              {/* Email Row */}
              <div className="row g-3 mb-3">

                     {/* Email */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Email ID <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={newRequestEmail}
                    onChange={(e) => setNewRequestEmail(e.target.value)}
                    placeholder="Enter email address"
                    disabled={sendingEmail}
                  />
                </div>

                     {/* Phone Number */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={newRequestPhone}
                    onChange={(e) => setNewRequestPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    disabled={sendingEmail}
                  />
                </div>

              </div>

                            {/* Additional Info Row */}
              <div className="row g-3 mb-4">
                    {/* Department/Designation */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Department</label>
                  <select
                    className="form-select"
                    value={newRequestDepartment}
                    onChange={(e) => setNewRequestDepartment(e.target.value)}
                    disabled={sendingEmail}
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="External">External</option>
                  </select>
                </div>
                {/* Designation */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRequestDesignation}
                    onChange={(e) => setNewRequestDesignation(e.target.value)}
                    placeholder="e.g., Software Engineer, Marketing Executive"
                    disabled={sendingEmail}
                  />
                </div>
              </div>
              {/* Personal Information Row */}

                  <div className="row g-3 mb-3">
                    {/* Date of Birth */}
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">
                        Date of Birth <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={newRequestDob}
                        onChange={(e) => setNewRequestDob(e.target.value)}
                        max={new Date().toISOString().split('T')[0]} // Prevent future dates
                        disabled={sendingEmail}
                      />
                    </div>
                    {/* Gender - NEW FIELD */}
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">
                        Gender <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={newRequestGender}
                        onChange={(e) => setNewRequestGender(e.target.value)}
                        disabled={sendingEmail}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Marital Status - NEW FIELD */}
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">
                        Marital Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={newRequestMaritalStatus}
                        onChange={(e) => setNewRequestMaritalStatus(e.target.value)}
                        disabled={sendingEmail}
                      >
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Separated">Separated</option>
                      </select>
                    </div>
                  </div>


              {/* Email Method */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Email Sending Method
                </label>
                <div className="btn-group w-100 flex-wrap" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="newRequestEmailMethod"
                    id="method-api"
                    value="api"
                    checked={emailMethod === "api"}
                    onChange={(e) => setEmailMethod(e.target.value)}
                    disabled={sendingEmail}
                  />
                  <label
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                    htmlFor="method-api"
                  >
                    <Icon icon="heroicons:server" className="me-1" />
                    API Send
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="newRequestEmailMethod"
                    id="method-clipboard"
                    value="clipboard"
                    checked={emailMethod === "clipboard"}
                    onChange={(e) => setEmailMethod(e.target.value)}
                    disabled={sendingEmail}
                  />
                  <label
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                    htmlFor="method-clipboard"
                  >
                    <Icon icon="heroicons:clipboard" className="me-1" />
                    Copy to Clipboard
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="newRequestEmailMethod"
                    id="method-mailto"
                    value="mailto"
                    checked={emailMethod === "mailto"}
                    onChange={(e) => setEmailMethod(e.target.value)}
                    disabled={sendingEmail}
                  />
                  <label
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                    htmlFor="method-mailto"
                  >
                    <Icon icon="heroicons:envelope-open" className="me-1" />
                    Mailto
                  </label>
                </div>
              </div>

              {/* CC / BCC */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    CC (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={ccEmails}
                    onChange={(e) => setCcEmails(e.target.value)}
                    placeholder="email1@example.com"
                    disabled={emailMethod === "mailto" || sendingEmail}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    BCC (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={bccEmails}
                    placeholder="email1@example.com"
                    onChange={(e) => setBccEmails(e.target.value)}
                    disabled={emailMethod === "mailto" || sendingEmail}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Subject <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newRequestSubject}
                  onChange={(e) => setNewRequestSubject(e.target.value)}
                  placeholder="Email subject..."
                  disabled={sendingEmail}
                />
              </div>

              {/* ========== EDUCATION QUALIFICATION SECTION ========== */}
<div className="card border-0 shadow-sm mb-4">
  <div className="card-header bg-info bg-opacity-10 border-0 d-flex justify-content-between align-items-center">
    <h6 className="mb-0 fw-semibold d-flex align-items-center">
      <Icon icon="heroicons:academic-cap" className="me-2" />
      Education Qualification
    </h6>
    <button
      type="button"
      className="btn btn-sm btn-outline-primary d-flex align-items-center"
      onClick={() => {
        setShowEducationForm(true);
        setEditingEducation(null);
        // Reset form fields
        setEducationLevel("");
        setSchoolCollegeName("");
        setBoardUniversity("");
        setPassingYear("");
        setJoiningYear("");
        setDegree("");
        setBranch("");
        setPercentage("");
        setCgpa("");
        setGradingSystem("percentage");
      }}
      disabled={sendingEmail}
    >
      <Icon icon="heroicons:plus-circle" className="me-1" />
      Add Education
    </button>
  </div>
  
  <div className="card-body">
    {/* Education Form - Collapsible */}
    {showEducationForm && (
      <div className="border rounded p-3 mb-4 bg-light">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold mb-0">
            {editingEducation ? 'Edit Education' : 'Add New Education'}
          </h6>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setShowEducationForm(false);
              setEditingEducation(null);
            }}
            disabled={sendingEmail}
          />
        </div>
        
        <div className="row g-3">
          {/* Education Level */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              Education Level <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              disabled={sendingEmail}
            >
              <option value="">Select Education Level</option>
              <option value="10th">10th / Matriculation</option>
              <option value="12th">12th / Intermediate</option>
              <option value="diploma">Diploma</option>
              <option value="graduation">Graduation (Bachelor's)</option>
              <option value="post_graduation">Post Graduation (Master's)</option>
              <option value="phd">Ph.D / Doctorate</option>
              <option value="certification">Professional Certification</option>
            </select>
          </div>
          
          {/* School/College Name */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              School/College Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={schoolCollegeName}
              onChange={(e) => setSchoolCollegeName(e.target.value)}
              placeholder="Enter school/college name"
              disabled={sendingEmail}
            />
          </div>
          
          {/* Board/University - For 10th, 12th, Graduation, etc. */}
          {['10th', '12th', 'diploma', 'graduation', 'post_graduation', 'phd'].includes(educationLevel) && (
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                {educationLevel === '10th' || educationLevel === '12th' ? 'Board' : 'University'} 
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={boardUniversity}
                onChange={(e) => setBoardUniversity(e.target.value)}
                placeholder={educationLevel === '10th' || educationLevel === '12th' ? 'e.g., CBSE, ICSE, State Board' : 'e.g., Mumbai University, VTU'}
                disabled={sendingEmail}
              />
            </div>
          )}
          
          {/* Degree Name - For Graduation, Post Graduation, etc. */}
          {['graduation', 'post_graduation', 'diploma', 'phd'].includes(educationLevel) && (
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Degree Name <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                disabled={sendingEmail}
              >
                <option value="">Select Degree</option>
                {educationLevel === 'graduation' && (
                  <>
                    <option value="B.Tech">B.Tech / B.E.</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="B.Com">B.Com</option>
                    <option value="BA">B.A.</option>
                    <option value="BCA">BCA</option>
                    <option value="BBA">BBA</option>
                    <option value="B.Pharm">B.Pharm</option>
                    <option value="Other">Other</option>
                  </>
                )}
                {educationLevel === 'post_graduation' && (
                  <>
                    <option value="M.Tech">M.Tech / M.E.</option>
                    <option value="M.Sc">M.Sc</option>
                    <option value="M.Com">M.Com</option>
                    <option value="MA">M.A.</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="M.Pharm">M.Pharm</option>
                    <option value="Other">Other</option>
                  </>
                )}
                {educationLevel === 'diploma' && (
                  <>
                    <option value="Diploma in Engineering">Diploma in Engineering</option>
                    <option value="Diploma in Computer Science">Diploma in Computer Science</option>
                    <option value="Diploma in Business">Diploma in Business</option>
                    <option value="Other">Other</option>
                  </>
                )}
                {educationLevel === 'phd' && (
                  <>
                    <option value="Ph.D">Ph.D</option>
                    <option value="D.Phil">D.Phil</option>
                    <option value="Other">Other</option>
                  </>
                )}
              </select>
              
              {/* Other Degree Input */}
              {degree === 'Other' && (
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Enter degree name"
                  value={branch} // Reusing branch for custom degree
                  onChange={(e) => setBranch(e.target.value)}
                  disabled={sendingEmail}
                />
              )}
            </div>
          )}
          
          {/* Branch/Specialization - For Graduation, Post Graduation */}
          {['10th', '12th', 'diploma', 'graduation', 'post_graduation', 'phd'].includes(educationLevel) && degree !== 'Other' && (
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">
                Branch / Specialization
              </label>
              <input
                type="text"
                className="form-control"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g., Computer Science, Electronics, Mechanical"
                disabled={sendingEmail}
              />
            </div>
          )}
          
          {/* For 10th and 12th - Only Passing Year */}
          {['10th', '12th'].includes(educationLevel) && (
            <>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Passing Year <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  placeholder="YYYY"
                  disabled={sendingEmail}
                />
              </div>
              
              {/* Percentage/CGPA for 10th/12th */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Percentage / CGPA
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    max="100"
                    step="0.01"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="Enter percentage or CGPA"
                    disabled={sendingEmail}
                  />
                  <span className="input-group-text">%</span>
                </div>
              </div>
            </>
          )}
          
          {/* For Graduation, Post Graduation, Diploma - Joining Year, Passing Year, Marks */}
          {['graduation', 'post_graduation', 'diploma', 'phd'].includes(educationLevel) && (
            <>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Joining Year <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={joiningYear}
                  onChange={(e) => setJoiningYear(e.target.value)}
                  placeholder="YYYY"
                  disabled={sendingEmail}
                />
              </div>
              
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Passing Year <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="1950"
                  max={new Date().getFullYear() + 10}
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  placeholder="YYYY"
                  disabled={sendingEmail}
                />
              </div>
              
              {/* Grading System Selection */}
<div className="col-12 col-md-6">

  <label className="form-label fw-semibold">
    Grading System
  </label>

  <div className="d-flex gap-4">

    {/* Percentage Option */}
    <label
      htmlFor="gradingPercentage"
      style={{
        display: "flex",
        alignItems: "center",
        cursor: sendingEmail ? "not-allowed" : "pointer",
        opacity: sendingEmail ? 0.6 : 1,
      }}
    >
      {/* Custom Radio */}
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: `2px solid ${
            gradingSystem === "percentage" ? "#3B82F6" : "#9CA3AF"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "8px",
          transition: "all 0.2s ease",
        }}
      >
        {gradingSystem === "percentage" && (
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#3B82F6",
            }}
          />
        )}
      </div>

      {/* Hidden Native Radio */}
      <input
        type="radio"
        name="gradingSystem"
        id="gradingPercentage"
        value="percentage"
        checked={gradingSystem === "percentage"}
        onChange={(e) => setGradingSystem(e.target.value)}
        disabled={sendingEmail}
        style={{ display: "none" }}
      />

      <span>Percentage (%)</span>
    </label>


    {/* CGPA Option */}
    <label
      htmlFor="gradingCGPA"
      style={{
        display: "flex",
        alignItems: "center",
        cursor: sendingEmail ? "not-allowed" : "pointer",
        opacity: sendingEmail ? 0.6 : 1,
      }}
    >
      {/* Custom Radio */}
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: `2px solid ${
            gradingSystem === "cgpa" ? "#3B82F6" : "#9CA3AF"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "8px",
          transition: "all 0.2s ease",
        }}
      >
        {gradingSystem === "cgpa" && (
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#3B82F6",
            }}
          />
        )}
      </div>

      {/* Hidden Native Radio */}
      <input
        type="radio"
        name="gradingSystem"
        id="gradingCGPA"
        value="cgpa"
        checked={gradingSystem === "cgpa"}
        onChange={(e) => setGradingSystem(e.target.value)}
        disabled={sendingEmail}
        style={{ display: "none" }}
      />

      <span>CGPA (out of 10)</span>
    </label>

  </div>
</div>

              
              {/* Percentage Input */}
              {gradingSystem === 'percentage' && (
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Percentage <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="100"
                      step="0.01"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      placeholder="Enter percentage"
                      disabled={sendingEmail}
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              )}
              
              {/* CGPA Input */}
              {gradingSystem === 'cgpa' && (
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    CGPA <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      max="10"
                      step="0.01"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="Enter CGPA"
                      disabled={sendingEmail}
                    />
                    <span className="input-group-text">/10</span>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Add/Update Button */}
          <div className="col-12 mt-3">
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowEducationForm(false);
                  setEditingEducation(null);
                }}
                disabled={sendingEmail}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  // Validation
                  if (!educationLevel || !schoolCollegeName) {
                    alert("Please fill all required fields");
                    return;
                  }
                  
                  if (['10th', '12th'].includes(educationLevel) && !passingYear) {
                    alert("Please enter passing year");
                    return;
                  }
                  
                  if (['graduation', 'post_graduation', 'diploma', 'phd'].includes(educationLevel)) {
                    if (!joiningYear || !passingYear) {
                      alert("Please enter joining and passing year");
                      return;
                    }
                    if (gradingSystem === 'percentage' && !percentage) {
                      alert("Please enter percentage");
                      return;
                    }
                    if (gradingSystem === 'cgpa' && !cgpa) {
                      alert("Please enter CGPA");
                      return;
                    }
                  }
                  
                  // Create education entry
                  const educationEntry = {
                    id: editingEducation?.id || Date.now(),
                    level: educationLevel,
                    levelLabel: document.querySelector(`select option[value="${educationLevel}"]`)?.textContent || educationLevel,
                    institution: schoolCollegeName,
                    boardUniversity: boardUniversity,
                    degree: degree,
                    branch: branch,
                    joiningYear: joiningYear,
                    passingYear: passingYear,
                    percentage: percentage,
                    cgpa: cgpa,
                    gradingSystem: gradingSystem,
                    isPursuing: educationLevel === 'phd' ? false : false, // Can add checkbox for pursuing
                  };
                  
                  if (editingEducation) {
                    // Update existing
                    setEducationQualifications(prev => 
                      prev.map(e => e.id === editingEducation.id ? educationEntry : e)
                    );
                  } else {
                    // Add new
                    setEducationQualifications(prev => [...prev, educationEntry]);
                  }
                  
                  // Reset form
                  setShowEducationForm(false);
                  setEditingEducation(null);
                  setEducationLevel("");
                  setSchoolCollegeName("");
                  setBoardUniversity("");
                  setPassingYear("");
                  setJoiningYear("");
                  setDegree("");
                  setBranch("");
                  setPercentage("");
                  setCgpa("");
                  setGradingSystem("percentage");
                }}
                disabled={sendingEmail}
              >
                {editingEducation ? 'Update' : 'Add'} Education
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    
    {/* Education List - Display Added Qualifications */}
    {educationQualifications.length > 0 ? (
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="fw-semibold">Level</th>
              <th className="fw-semibold">Institution/Board</th>
              <th className="fw-semibold">Degree/Branch</th>
              <th className="fw-semibold">Year</th>
              <th className="fw-semibold">Marks</th>
              <th className="fw-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {educationQualifications
              .sort((a, b) => {
                // Sort by education level (10th, 12th, graduation, etc.)
                const levelOrder = { '10th': 1, '12th': 2, 'diploma': 3, 'graduation': 4, 'post_graduation': 5, 'phd': 6, 'certification': 7 };
                return (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99);
              })
              .map((edu, idx) => (
                <tr key={edu.id} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
                  <td className="align-middle">
                    <div className="fw-medium">{edu.levelLabel}</div>
                  </td>
                  <td className="align-middle">
                    <div>{edu.institution}</div>
                    {edu.boardUniversity && (
                      <small className="text-muted">{edu.boardUniversity}</small>
                    )}
                  </td>
                  <td className="align-middle">
                    {edu.degree && <div className="fw-medium">{edu.degree}</div>}
                    {edu.branch && <small className="text-muted">{edu.branch}</small>}
                    {/* {!edu.degree && edu.level === '10th' && <span>Matriculation</span>}
                    {!edu.degree && edu.level === '12th' && <span>Intermediate</span>} */}
                  </td>
                  <td className="align-middle">
                    {edu.passingYear && (
                      <>
                        <div>{edu.passingYear}</div>
                        {edu.joiningYear && (
                          <small className="text-muted">
                            {edu.joiningYear} - {edu.passingYear}
                          </small>
                        )}
                      </>
                    )}
                  </td>
                  <td className="align-middle">
                    {edu.percentage && (
                      <span className="badge bg-success bg-opacity-10 text-success p-2">
                        {edu.percentage}%
                      </span>
                    )}
                    {edu.cgpa && (
                      <span className="badge bg-info bg-opacity-10 text-info p-2">
                        CGPA: {edu.cgpa}/10
                      </span>
                    )}
                  </td>
                  <td className="align-middle">
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setEditingEducation(edu);
                          setEducationLevel(edu.level);
                          setSchoolCollegeName(edu.institution);
                          setBoardUniversity(edu.boardUniversity || "");
                          setPassingYear(edu.passingYear || "");
                          setJoiningYear(edu.joiningYear || "");
                          setDegree(edu.degree || "");
                          setBranch(edu.branch || "");
                          setPercentage(edu.percentage || "");
                          setCgpa(edu.cgpa || "");
                          setGradingSystem(edu.gradingSystem || "percentage");
                          setShowEducationForm(true);
                        }}
                        title="Edit"
                      >
                        <Icon icon="heroicons:pencil-square" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (window.confirm("Remove this education qualification?")) {
                            setEducationQualifications(prev => 
                              prev.filter(e => e.id !== edu.id)
                            );
                          }
                        }}
                        title="Delete"
                      >
                        <Icon icon="heroicons:trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-4">
        <div className="d-flex flex-column align-items-center text-muted">
          <Icon icon="heroicons:academic-cap" style={{ fontSize: "36px" }} className="mb-2 opacity-50" />
          <p className="mb-1 fw-medium">No education qualifications added</p>
          <small>Click "Add Education" button to add educational details</small>
        </div>
      </div>
    )}
  </div>
</div>

                            {/* ========== PARENT/GUARDIAN DETAILS SECTION - NEW ========== */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-primary bg-opacity-10 border-0">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center">
                    <Icon icon="heroicons:users" className="me-2" />
                    Parent / Guardian Details
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {/* Parent/Guardian Name */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Parent/Guardian Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRequestParentName}
                        onChange={(e) => setNewRequestParentName(e.target.value)}
                        placeholder="Enter parent/guardian full name"
                        disabled={sendingEmail}
                      />
                    </div>

                    {/* Relationship */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Relationship <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={newRequestParentRelationship}
                        onChange={(e) => setNewRequestParentRelationship(e.target.value)}
                        disabled={sendingEmail}
                      >
                        <option value="">Select Relationship</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Parent/Guardian Phone Number */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        value={newRequestParentPhone}
                        onChange={(e) => setNewRequestParentPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        disabled={sendingEmail}
                      />
                    </div>


                    {/* Employment Status */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Employment Status
                      </label>
                      <select
                        className="form-select"
                        value={newRequestParentEmployment}
                        onChange={(e) => setNewRequestParentEmployment(e.target.value)}
                        disabled={sendingEmail}
                      >
                        <option value="">Select Status</option>
                        <option value="Employed">Employed</option>
                        <option value="Self Employed">Self Employed</option>
                        <option value="Business">Business</option>
                        <option value="Retired">Retired</option>
                        <option value="Homemaker">Homemaker</option>
                        <option value="Not Employed">Not Employed</option>
                        <option value="Deceased">Deceased</option>
                      </select>
                    </div>

                    {/* Organization/Company */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Organization/Company
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRequestParentOrganization}
                        onChange={(e) => setNewRequestParentOrganization(e.target.value)}
                        placeholder="Company name (if employed)"
                        disabled={sendingEmail}
                      />
                    </div>

                    {/* Designation */}
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">
                        Designation
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRequestParentDesignation}
                        onChange={(e) => setNewRequestParentDesignation(e.target.value)}
                        placeholder="Job title (if employed)"
                        disabled={sendingEmail}
                      />
                    </div>

{/* Is Guardian checkbox */}
<div className="col-12">
  <label
    htmlFor="isLegalGuardian"
    style={{
      display: "flex",
      alignItems: "center",
      cursor: sendingEmail ? "not-allowed" : "pointer",
      opacity: sendingEmail ? 0.6 : 1,
    }}
  >
    {/* Custom Checkbox UI */}
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "4px",
        border: `2px solid ${
          newRequestIsGuardian ? "#3B82F6" : "#9CA3AF"
        }`,
        background: newRequestIsGuardian ? "#3B82F6" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "10px",
        transition: "all 0.2s ease",
      }}
    >
      {newRequestIsGuardian && (
        <span
          style={{
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            lineHeight: 1,
          }}
        >
          ✓
        </span>
      )}
    </div>

    {/* Hidden Native Checkbox */}
    <input
      type="checkbox"
      id="isLegalGuardian"
      checked={newRequestIsGuardian}
      disabled={sendingEmail}
      onChange={(e) => setNewRequestIsGuardian(e.target.checked)}
      style={{ display: "none" }}
    />

    <span>This person is the legal guardian (if not parent)</span>
  </label>
</div>


                  </div>
                </div>
              </div>

              {/* ========== ADDRESS DETAILS SECTION ========== */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-primary bg-opacity-10 border-0">
                  <h6 className="mb-0 fw-semibold d-flex align-items-center">
                    <Icon icon="heroicons:map-pin" className="me-2" />
                    Address Details
                  </h6>
                </div>
                <div className="card-body">
                  {/* CURRENT ADDRESS */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="fw-semibold mb-0 d-flex align-items-center">
                        <Icon
                          icon="heroicons:home"
                          className="me-2 text-primary"
                        />
                        Current Address
                      </h6>
                    </div>

                    <div className="row g-3">
                      {/* Address Line 1 */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address Line 1 <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.address1}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              address1: e.target.value,
                            });
                            // If same as current is checked, update permanent address automatically
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                address1: e.target.value,
                              });
                            }
                          }}
                          placeholder="House/Flat No., Building Name, Street"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address Line 2{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.address2}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              address2: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                address2: e.target.value,
                              });
                            }
                          }}
                          placeholder="Area, Landmark, Colony"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Country */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Country <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={currentAddress.country}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              country: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                country: e.target.value,
                              });
                            }
                          }}
                          disabled={sendingEmail}
                        >
                          <option value="">Select Country</option>
                          <option value="India">India</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* State */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          State <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.state}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              state: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                state: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter state"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* District */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          District <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.district}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              district: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                district: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter district"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* City */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          City <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.city}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              city: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                city: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter city"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Pincode */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Pincode <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.pincode}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              pincode: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                pincode: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter pincode"
                          maxLength="6"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/*Nationality */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Nationality <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentAddress.Nationality || ""}
                          onChange={(e) => {
                            setCurrentAddress({
                              ...currentAddress,
                              Nationality: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setPermanentAddress({
                                ...permanentAddress,
                                Nationality: e.target.value,
                              });
                            }
                          }}
                          placeholder="Enter nationality"
                          disabled={sendingEmail}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SAME AS CURRENT ADDRESS CHECKBOX */}
                  <div className="mb-4 pb-2 border-bottom">
                    <label
                      htmlFor="sameAsCurrentAddress"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: sendingEmail ? "not-allowed" : "pointer",
                        opacity: sendingEmail ? 0.6 : 1,
                      }}
                    >
                      {/* Custom Checkbox */}
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: `2px solid ${
                            sameAsCurrent ? "#3B82F6" : "#9CA3AF"
                          }`,
                          background: sameAsCurrent ? "#3B82F6" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "10px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {sameAsCurrent && (
                          <span
                            style={{
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "bold",
                              lineHeight: 1,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Hidden Native Checkbox */}
                      <input
                        type="checkbox"
                        id="sameAsCurrentAddress"
                        checked={sameAsCurrent}
                        disabled={sendingEmail}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setSameAsCurrent(isChecked);

                          if (isChecked) {
                            setPermanentAddress({
                              address1: currentAddress.address1,
                              address2: currentAddress.address2,
                              country: currentAddress.country,
                              state: currentAddress.state,
                              district: currentAddress.district,
                              city: currentAddress.city,
                              pincode: currentAddress.pincode,
                            });
                          }
                        }}
                        style={{ display: "none" }}
                      />

                      <span className="fw-semibold">
                        Same as Current Address
                      </span>
                    </label>
                  </div>

                  {/* PERMANENT ADDRESS */}
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="fw-semibold mb-0 d-flex align-items-center">
                        <Icon
                          icon="heroicons:building-office"
                          className="me-2 text-success"
                        />
                        Permanent Address
                      </h6>
                    </div>

                    <div className="row g-3">
                      {/* Address Line 1 */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address Line 1 <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.address1}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              address1: e.target.value,
                            });
                            // Uncheck "same as current" if user manually modifies permanent address
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="House/Flat No., Building Name, Street"
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address Line 2{" "}
                          <span className="text-muted">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.address2}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              address2: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Area, Landmark, Colony"
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
                        />
                      </div>

                      {/* Country */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Country <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={permanentAddress.country}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              country: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          disabled={sendingEmail || sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
                        >
                          <option value="">Select Country</option>
                          <option value="India">India</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* State */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          State <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.state}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              state: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Enter state"
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
                        />
                      </div>

                      {/* District */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          District <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.district}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              district: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Enter district"
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
                        />
                      </div>

                      {/* City */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          City <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.city}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              city: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Enter city"
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
                        />
                      </div>

                      {/* Pincode */}
                      <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">
                          Pincode <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={permanentAddress.pincode}
                          onChange={(e) => {
                            setPermanentAddress({
                              ...permanentAddress,
                              pincode: e.target.value,
                            });
                            if (sameAsCurrent) {
                              setSameAsCurrent(false);
                            }
                          }}
                          placeholder="Enter pincode"
                          maxLength="6"
                          disabled={sendingEmail || sameAsCurrent}
                          readOnly={sameAsCurrent}
                          style={
                            sameAsCurrent ? { backgroundColor: "#f8f9fa" } : {}
                          }
                        />
                      </div>
                    </div>

                    {/* Manual Edit Hint */}
                    {sameAsCurrent && (
                      <div className="mt-2">
                        <small className="text-muted d-flex align-items-center">
                          <Icon
                            icon="heroicons:information-circle"
                            className="me-1"
                          />
                          Uncheck "Same as Current Address" to edit permanent
                          address independently
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Experienced Checkbox - Add this new section */}
              <div className="mb-3 justify-items-center">
                <div className="form-check form-switch d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="isExperienced"
                    checked={isExperienced}
                    onChange={(e) => setIsExperienced(e.target.checked)}
                    disabled={sendingEmail}
                    style={{ width: "3em", height: "1.5em" }}
                  />

                  <label
                    className="form-check-label fw-semibold ms-3 d-flex align-items-center cursor-pointer"
                    htmlFor="isExperienced"
                    style={{ cursor: "pointer" }}
                  >
                    {isExperienced ? (
                      <>
                        <Icon
                          icon="heroicons:briefcase"
                          className="me-2 text-success"
                        />
                        <span className="text-success">Experienced</span>
                      </>
                    ) : (
                      <>
                        <Icon
                          icon="heroicons:user"
                          className="me-2 text-secondary"
                        />
                        <span className="text-secondary">Fresher</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Experience Details - Only show when Experienced is checked */}
              {isExperienced && (
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-info bg-opacity-10 border-0">
                    <h6 className="mb-0 fw-semibold d-flex align-items-center">
                      <Icon icon="heroicons:briefcase" className="me-2" />
                      Previous Work Experience Details
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      {/* Current/Last Organization */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Organization Name{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentOrganization}
                          onChange={(e) =>
                            setCurrentOrganization(e.target.value)
                          }
                          placeholder="e.g., ABC Technologies Pvt Ltd"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Current/Last Role */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Role <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={currentRole}
                          onChange={(e) => setCurrentRole(e.target.value)}
                          placeholder="e.g., Senior Software Engineer"
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Employment Type */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Employment Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={employmentType}
                          onChange={(e) => setEmploymentType(e.target.value)}
                          disabled={sendingEmail}
                        >
                          <option value="">Select Type</option>
                          <option value="full_time">Full Time</option>
                          <option value="part_time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="freelance">Freelance</option>
                        </select>
                      </div>

                      {/* Location */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Location <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={experienceLocation}
                          onChange={(e) =>
                            setExperienceLocation(e.target.value)
                          }
                          placeholder="e.g., Bangalore, Remote, etc."
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Current/Last Salary */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Salary (CTC)
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={currentSalary}
                            onChange={(e) => setCurrentSalary(e.target.value)}
                            placeholder="e.g., 1200000"
                            disabled={sendingEmail}
                          />
                        </div>
                      </div>

                      {/* Notice Period */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Notice Period
                        </label>
                        <select
                          className="form-select"
                          value={noticePeriod}
                          onChange={(e) => setNoticePeriod(e.target.value)}
                          disabled={sendingEmail}
                        >
                          <option value="">Select Notice Period</option>
                          <option value="immediate">Immediate</option>
                          <option value="15_days">15 Days</option>
                          <option value="30_days">30 Days</option>
                          <option value="45_days">45 Days</option>
                          <option value="60_days">60 Days</option>
                          <option value="90_days">90 Days</option>
                          <option value="negotiable">Negotiable</option>
                        </select>
                      </div>

                      {/* Years of Experience */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Years of Experience{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            max="50"
                            step="0.5"
                            value={yearsOfExperience}
                            onChange={(e) =>
                              setYearsOfExperience(e.target.value)
                            }
                            placeholder="e.g., 3.5"
                            disabled={sendingEmail}
                          />
                          <span className="input-group-text">years</span>
                        </div>
                      </div>

                      {/* Joining Date */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Joining Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={experienceJoiningDate}
                          onChange={(e) =>
                            setExperienceJoiningDate(e.target.value)
                          }
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Relieving Date */}
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                          Relieving Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={experienceRelievingDate}
                          onChange={(e) =>
                            setExperienceRelievingDate(e.target.value)
                          }
                          disabled={sendingEmail}
                        />
                      </div>

                      {/* Add Previous Experience Button */}
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm d-flex align-items-center"
                          onClick={() => {
                            setPreviousExperiences([
                              ...previousExperiences,
                              {
                                id: Date.now(),
                                organization: "",
                                role: "",
                                type: "",
                                location: "",
                                salary: "",
                                years: "",
                                fromDate: "",
                                toDate: "",
                              },
                            ]);
                          }}
                          disabled={sendingEmail}
                        >
                          <Icon icon="heroicons:plus-circle" className="me-1" />
                          Add Previous Experience
                        </button>
                      </div>

                      {/* Previous Experiences List */}
                      {previousExperiences.map((exp, index) => (
                        <div
                          key={exp.id}
                          className="col-12 border rounded p-3 mt-2"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0 fw-semibold">
                              Previous Experience {index + 1}
                            </h6>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                const updated = previousExperiences.filter(
                                  (e) => e.id !== exp.id,
                                );
                                setPreviousExperiences(updated);
                              }}
                              disabled={sendingEmail}
                            >
                              <Icon icon="heroicons:trash" />
                            </button>
                          </div>

                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Organization
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={exp.organization}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].organization = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                placeholder="Organization name"
                                disabled={sendingEmail}
                              />
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Role
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={exp.role}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].role = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                placeholder="Designation/Role"
                                disabled={sendingEmail}
                              />
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Employment Type
                              </label>
                              <select
                                className="form-select"
                                value={exp.type}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].type = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                disabled={sendingEmail}
                              >
                                <option value="">Select Type</option>
                                <option value="full_time">Full Time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                              </select>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Location
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={exp.location}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].location = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                placeholder="Location"
                                disabled={sendingEmail}
                              />
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Salary (CTC)
                              </label>
                              <div className="input-group">
                                <span className="input-group-text">₹</span>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={exp.salary}
                                  onChange={(e) => {
                                    const updated = [...previousExperiences];
                                    updated[index].salary = e.target.value;
                                    setPreviousExperiences(updated);
                                  }}
                                  placeholder="Annual CTC"
                                  disabled={sendingEmail}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Year of Experience
                              </label>
                              <div className="input-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  min="0"
                                  max="50"
                                  step="0.5"
                                  value={exp.years}
                                  onChange={(e) => {
                                    const updated = [...previousExperiences];
                                    updated[index].years = e.target.value;
                                    setPreviousExperiences(updated);
                                  }}
                                  placeholder="Years of experience"
                                  disabled={sendingEmail}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Joining Date
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                value={exp.fromDate}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].fromDate = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                disabled={sendingEmail}
                              />
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-semibold">
                                Relieving Date
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                value={exp.toDate}
                                onChange={(e) => {
                                  const updated = [...previousExperiences];
                                  updated[index].toDate = e.target.value;
                                  setPreviousExperiences(updated);
                                }}
                                disabled={sendingEmail}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Required Documents */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Required Documents
                </label>
                <div className="bg-light rounded p-3">
                  <div className="table-responsive">
                    <table className="table table-borderless table-sm mb-0">
                      <thead>
                        <tr>
                          <th
                            className="fw-semibold text-muted"
                            style={{ width: "40%" }}
                          >
                            Document Name
                          </th>
                          <th
                            className="fw-semibold text-muted"
                            style={{ width: "20%" }}
                          >
                            Type
                          </th>
                          <th
                            className="fw-semibold text-muted"
                            style={{ width: "20%" }}
                          >
                            Upload Status
                          </th>
                          <th
                            className="fw-semibold text-muted text-center justify-items-center"
                            style={{ width: "20%" }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Dynamic required documents based on experience */}
                        {getRequiredDocuments().map((doc, index) => {
                          // Check if this document is already uploaded
                          const isUploaded = uploadedDocuments.some(
                            (ud) => ud.id === doc.id,
                          );
                          const uploadedDoc = uploadedDocuments.find(
                            (ud) => ud.id === doc.id,
                          );

                          return (
                            <tr
                              key={doc.id}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-light"
                              }
                            >
                              <td className="align-middle">
                                <div className="d-flex align-items-center">
                                  <Icon
                                    icon={
                                      isUploaded
                                        ? "heroicons:document-check"
                                        : "heroicons:document"
                                    }
                                    className={`me-2 ${isUploaded ? "text-success" : "text-secondary"}`}
                                  />
                                  <div>
                                    <div className="fw-medium">{doc.name}</div>
                                    {uploadedDoc && (
                                      <div>
                                        <small className="text-muted">
                                          Uploaded:{" "}
                                          {new Date(
                                            uploadedDoc.uploadDate,
                                          ).toLocaleDateString()}
                                        </small>
                                        <br />
                                        <small className="text-muted">
                                          File: {uploadedDoc.name} (
                                          {(
                                            uploadedDoc.size /
                                            1024 /
                                            1024
                                          ).toFixed(2)}{" "}
                                          MB)
                                        </small>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="align-middle">
                                <span
                                  className={`badge bg-${doc.required ? "danger" : "secondary"}`}
                                >
                                  {doc.required ? "Required" : "Optional"}
                                </span>
                              </td>
                              <td className="align-middle">
                                {isUploaded ? (
                                  <span className="badge bg-success">
                                    Uploaded
                                  </span>
                                ) : (
                                  <span
                                    className={`badge bg-${doc.required ? "warning" : "secondary"}`}
                                  >
                                    {doc.required ? "Pending" : "Optional"}
                                  </span>
                                )}
                              </td>
                              <td className="align-middle justify-items-center">
                                <div className="d-flex flex-nowrap gap-2">
                                  {isUploaded ? (
                                    <>
                                      {/* View Button */}
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                        onClick={() =>
                                          handleViewDocument(uploadedDoc)
                                        }
                                        title="View Document"
                                      >
                                        <Icon
                                          icon="heroicons:eye"
                                          className="fs-6"
                                        />
                                      </button>

                                      {/* Edit/Re-upload Button */}
                                      <div>
                                        <input
                                          type="file"
                                          id={`reupload-${doc.id}`}
                                          className="d-none"
                                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                          onChange={(e) =>
                                            handleReuploadDocument(e, doc.id)
                                          }
                                          disabled={sendingEmail}
                                        />
                                        <label
                                          htmlFor={`reupload-${doc.id}`}
                                          className="btn btn-sm btn-outline-warning d-flex align-items-center"
                                          title="Re-upload Document"
                                          style={{ cursor: "pointer" }}
                                        >
                                          <Icon
                                            icon="heroicons:pencil-square"
                                            className="fs-6"
                                          />
                                        </label>
                                      </div>

                                      {/* Remove Button */}
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                        onClick={() =>
                                          handleRemoveDocument(doc.id)
                                        }
                                        title="Remove Document"
                                      >
                                        <Icon
                                          icon="heroicons:trash"
                                          className="fs-6"
                                        />
                                      </button>
                                    </>
                                  ) : (
                                    <div className="w-100">
                                      <input
                                        type="file"
                                        id={`upload-${doc.id}`}
                                        className="d-none"
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        onChange={(e) =>
                                          handleDocumentUpload(e, doc.id)
                                        }
                                        disabled={sendingEmail}
                                      />
                                      <label
                                        htmlFor={`upload-${doc.id}`}
                                        className={`btn btn-sm w-100 ${doc.required ? "btn-outline-success" : "btn-outline-secondary"} upload-btn`}
                                        style={{
                                          cursor: "pointer",
                                          height: "60px",
                                          padding: "6px",
                                          gap: "4px",
                                        }}
                                      >
                                        <Icon
                                          icon="heroicons:arrow-up-tray"
                                          className="mb-1"
                                          style={{ fontSize: "18px" }}
                                        />
                                        <span>Upload</span>
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Upload Summary */}
                  {uploadedDocuments.length > 0 && (
                    <div className="mt-3 pt-3 border-top">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">
                            {uploadedDocuments.length} of{" "}
                            {getRequiredDocuments().length} documents uploaded
                          </small>
                          <div
                            className="progress mt-1"
                            style={{ height: "6px", width: "200px" }}
                          >
                            <div
                              className="progress-bar bg-success"
                              style={{
                                width: `${(uploadedDocuments.length / getRequiredDocuments().length) * 100}%`,
                              }}
                            ></div>
                          </div>

                          {/* Required Documents Summary */}
                          <div className="mt-2">
                            <small className="text-muted d-block">
                              Required:{" "}
                              {
                                uploadedDocuments.filter((ud) =>
                                  getRequiredDocuments().find(
                                    (rd) => rd.id === ud.id && rd.required,
                                  ),
                                ).length
                              }{" "}
                              of{" "}
                              {
                                getRequiredDocuments().filter((d) => d.required)
                                  .length
                              }
                            </small>
                            <div
                              className="progress mt-1"
                              style={{
                                height: "4px",
                                width: "200px",
                                backgroundColor: "#e9ecef",
                              }}
                            >
                              <div
                                className="progress-bar bg-danger"
                                style={{
                                  width: `${(uploadedDocuments.filter((ud) => getRequiredDocuments().find((rd) => rd.id === ud.id && rd.required)).length / getRequiredDocuments().filter((d) => d.required).length) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          {/* Optional Documents Summary */}
                          {getRequiredDocuments().filter((d) => !d.required)
                            .length > 0 && (
                            <div className="mt-2">
                              <small className="text-muted d-block">
                                Optional:{" "}
                                {
                                  uploadedDocuments.filter((ud) =>
                                    getRequiredDocuments().find(
                                      (rd) => rd.id === ud.id && !rd.required,
                                    ),
                                  ).length
                                }{" "}
                                of{" "}
                                {
                                  getRequiredDocuments().filter(
                                    (d) => !d.required,
                                  ).length
                                }
                              </small>
                              <div
                                className="progress mt-1"
                                style={{
                                  height: "4px",
                                  width: "200px",
                                  backgroundColor: "#e9ecef",
                                }}
                              >
                                <div
                                  className="progress-bar bg-secondary"
                                  style={{
                                    width: `${(uploadedDocuments.filter((ud) => getRequiredDocuments().find((rd) => rd.id === ud.id && !rd.required)).length / getRequiredDocuments().filter((d) => !d.required).length) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to clear all uploaded documents?",
                              )
                            ) {
                              // Revoke object URLs to prevent memory leaks
                              uploadedDocuments.forEach((doc) => {
                                if (doc.fileUrl) {
                                  URL.revokeObjectURL(doc.fileUrl);
                                }
                              });
                              setUploadedDocuments([]);
                            }
                          }}
                          disabled={
                            uploadedDocuments.length === 0 || sendingEmail
                          }
                        >
                          <Icon icon="heroicons:trash" />
                          <span>Clear All</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Template */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email Template <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="8"
                  value={newRequestTemplate}
                  onChange={(e) => setNewRequestTemplate(e.target.value)}
                  disabled={sendingEmail}
                />
                <small className="text-muted">
                  You can use [Employee Name] placeholder which will be replaced
                  automatically
                </small>
              </div>

              {/* Info */}
              <div className="alert alert-info d-flex align-items-start">
                <Icon
                  icon="heroicons:information-circle"
                  className="me-2 mt-1"
                />
                <div>
                  <strong>Note:</strong> This email will request the
                  candidate/employee to submit scanned copies (PDF format) of
                  the required documents.
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer bg-light rounded-bottom-3 px-4 py-3">
              <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                <button
                  type="button"
                  className="btn btn-danger flex-fill"
                  onClick={() => {
                    setShowNewRequestModal(false);
                    setEmailStatus({ type: "", message: "" });
                    setCcEmails("");
                    setBccEmails("");
                    setNewRequestEmail("");
                    setNewRequestName("");
                    setNewRequestPhone("");
                    setNewRequestDepartment("");
                    setNewRequestDesignation("");
                    setNewRequestEmployeeId("");
                    setNewRequestDob("");
                    setNewRequestGender("");
                    setNewRequestMaritalStatus("");
                    setNewRequestTemplate("");
                    setNewRequestSubject("");
                    setEmailMethod("email_client");
                    setNewRequestParentName("");
                    setNewRequestParentRelationship("");
                    setNewRequestParentPhone("");
                    setNewRequestParentEmployment("");
                    setNewRequestParentOrganization("");
                    setNewRequestParentDesignation("");
                    setNewRequestIsGuardian(false);
                        // ===== ADD EDUCATION RESET HERE =====
    setEducationQualifications([]);
    setShowEducationForm(false);
    setEditingEducation(null);
    setEducationLevel("");
    setSchoolCollegeName("");
    setBoardUniversity("");
    setPassingYear("");
    setJoiningYear("");
    setDegree("");
    setBranch("");
    setPercentage("");
    setCgpa("");
    setGradingSystem("percentage");
                    // Reset experience fields
                    setIsExperienced(false);
                    setExperienceOrgName("");
                    setExperienceRole("");
                    setExperienceType("");
                    setExperienceLocation("");
                    setYearsOfExperience("");
                    setExperienceSalary("");
                    setExperienceJoiningDate("");
                    setExperienceRelievingDate("");
                    setExperienceHistory([]);
                    setPreviousExperiences([]);
                    setUploadedDocuments([]);
                    // In the Cancel button onClick handler, add these reset lines:
                    setCurrentAddress({
                      address1: "",
                      address2: "",
                      country: "",
                      state: "",
                      district: "",
                      city: "",
                      pincode: "",
                      nationality: "",
                    });
                    setPermanentAddress({
                      address1: "",
                      address2: "",
                      country: "",
                      state: "",
                      district: "",
                      city: "",
                      pincode: "",
                    });
                    setSameAsCurrent(false);
                  }}
                  disabled={sendingEmail}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-success flex-fill d-flex align-items-center justify-content-center"
                  onClick={handleSendNewRequest}
                  disabled={
                    sendingEmail ||
                    !newRequestTemplate.trim() ||
                    !newRequestSubject.trim() ||
                    !newRequestEmail.trim() ||
                    !newRequestName.trim() ||
                    (isExperienced && !yearsOfExperience) // Validate years if experienced
                  }
                >
                  {sendingEmail ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Icon icon="heroicons:paper-airplane" className="me-2" />
                      {emailMethod === "api"
                        ? "Send via API"
                        : emailMethod === "clipboard"
                          ? "Copy to Clipboard"
                          : "Open Email Client"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && employeeToDelete && (
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
            zIndex: 1060,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setShowDeleteModal(false);
              setEmployeeToDelete(null);
            }
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "450px" }}
          >
            <div className="modal-content border-0 shadow-lg rounded-3">
              {/* Modal Header - Reduced height */}
              <div
                className="modal-header bg-danger text-white border-0 px-4 py-3"
                style={{ borderRadius: "0.5rem 0.5rem 0 0" }}
              >
                <h5 className="modal-title d-flex align-items-center fw-semibold mb-0">
                  <Icon
                    icon="heroicons:exclamation-triangle"
                    className="me-2"
                  />
                  Delete Request
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    if (!deleting) {
                      setShowDeleteModal(false);
                      setEmployeeToDelete(null);
                    }
                  }}
                  disabled={deleting}
                  style={{
                    padding: "0.5rem",
                    margin: "-0.5rem -0.5rem -0.5rem auto",
                  }}
                />
              </div>

              {/* Modal Body - Compact layout */}
              <div className="modal-body p-3">
                <div className="text-center">
                  {/* Compact warning icon */}
                  <div className="mb-2">
                    <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle p-2">
                      <Icon
                        icon="heroicons:trash"
                        className="text-danger"
                        style={{ fontSize: "24px" }}
                      />
                    </div>
                  </div>

                  {/* Main message - more compact */}
                  <h6 className="fw-semibold mb-2">Delete Permanently?</h6>
                  <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
                    Delete document request for{" "}
                    <strong>{employeeToDelete.name}</strong>?
                  </p>

                  {/* Compact warning alert */}
                  <div
                    className="alert alert-warning py-2 mb-3"
                    style={{ fontSize: "13px" }}
                  >
                    <div className="d-flex align-items-start">
                      <Icon
                        icon="heroicons:exclamation-circle"
                        className="me-2 mt-0"
                        style={{ fontSize: "16px" }}
                      />
                      <div>
                        <strong className="d-block mb-0">Warning:</strong>
                        <small>This action cannot be undone.</small>
                      </div>
                    </div>
                  </div>

                  {/* Compact employee details */}
                  <div
                    className="bg-light rounded p-2 mb-3"
                    style={{ fontSize: "13px" }}
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Employee:</span>
                      <span
                        className="fw-semibold text-truncate"
                        style={{ maxWidth: "200px" }}
                      >
                        {employeeToDelete.name}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Email:</span>
                      <span
                        className="fw-semibold text-truncate"
                        style={{ maxWidth: "180px" }}
                      >
                        {employeeToDelete.email}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Employee ID:</span>
                      <span className="fw-semibold">
                        {employeeToDelete.employeeId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer - Compact */}
              <div
                className="modal-footer border-top-0 bg-light px-3 py-2"
                style={{ borderRadius: "0 0 0.5rem 0.5rem" }}
              >
                <div className="d-flex w-100 gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm flex-fill"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setEmployeeToDelete(null);
                      setDeleting(false);
                    }}
                    disabled={deleting}
                    style={{ padding: "0.375rem 0.75rem", fontSize: "14px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm flex-fill d-flex align-items-center justify-content-center"
                    onClick={async () => {
                      setDeleting(true);

                      try {
                        /* 1️⃣ Remove document request completely */
                        const updatedRequests = documentRequests.filter(
                          (req) => req.employeeId !== employeeToDelete.id,
                        );
                        saveDocumentRequests(updatedRequests);

                        /* 2️⃣ Remove employee profile entry from localStorage */
                        const savedProfiles =
                          localStorage.getItem("employeeProfiles");
                        if (savedProfiles) {
                          const profiles = JSON.parse(savedProfiles);
                          const updatedProfiles = profiles.filter(
                            (profile) =>
                              (profile.employeeId || profile.id) !==
                              employeeToDelete.id,
                          );
                          localStorage.setItem(
                            "employeeProfiles",
                            JSON.stringify(updatedProfiles),
                          );
                        }

                        /* 3️⃣ Remove employee from employees list */
                        const updatedEmployees = employees.filter(
                          (emp) => emp.id !== employeeToDelete.id,
                        );
                        setEmployees(updatedEmployees);

                        // Show success status
                        setEmailStatus({
                          type: "success",
                          message: `Successfully deleted request for ${employeeToDelete.name}`,
                        });

                        // Close modal after delay
                        setTimeout(() => {
                          setShowDeleteModal(false);
                          setEmployeeToDelete(null);
                          setDeleting(false);

                          // Clear success message after 3 seconds
                          setTimeout(() => {
                            setEmailStatus({ type: "", message: "" });
                          }, 3000);
                        }, 1000);
                      } catch (error) {
                        console.error("Error deleting request:", error);
                        setEmailStatus({
                          type: "error",
                          message:
                            "Failed to delete request. Please try again.",
                        });
                        setDeleting(false);
                      }
                    }}
                    style={{ padding: "0.375rem 0.75rem", fontSize: "14px" }}
                  >
                    {deleting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Icon
                          icon="heroicons:trash"
                          className="me-1"
                          style={{ fontSize: "16px" }}
                        />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default BackgroundVerification;
