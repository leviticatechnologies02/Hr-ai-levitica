import React, { useRef, useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import StatCard from "../../../shared/components/StatCard";
import {
  sendEmail,
  sendBulkEmails,
  copyEmailToClipboard,
  generateMailtoLink,
} from "../../../shared/services/emailService";
import { bgvAPI } from "../../../shared/utils/api";

import NewBGVRequestModal from "../../hrms/modal/NewBGVRequestModal";
import EditBGVRequestModal from "../../hrms/modal/EditBGVRequestModal";
import EmailModal from "../../hrms/modal/EmailModal";
import DeleteConfirmationModal from "../../hrms/modal/DeleteConfirmationModal";

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
  const [newRequestPhone, setNewRequestPhone] = useState("");
  const [newRequestDepartment, setNewRequestDepartment] = useState("");
  const [newRequestDesignation, setNewRequestDesignation] = useState("");
  const [newRequestEmployeeId, setNewRequestEmployeeId] = useState("");
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [emailUploads, setEmailUploads] = useState([]);
  const [emailUploadedDocuments, setEmailUploadedDocuments] = useState([]);
  const [isExperienced, setIsExperienced] = useState(false);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [currentOrganization, setCurrentOrganization] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [previousExperiences, setPreviousExperiences] = useState([]);
  const [globalUploadedDocuments, setGlobalUploadedDocuments] = useState([]);
  const [newRequestDob, setNewRequestDob] = useState("");
  const [newRequestGender, setNewRequestGender] = useState("");
  const [newRequestMaritalStatus, setNewRequestMaritalStatus] = useState("");

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

  const [educationQualifications, setEducationQualifications] = useState([]);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const [educationLevel, setEducationLevel] = useState("");
  const [schoolCollegeName, setSchoolCollegeName] = useState("");
  const [boardUniversity, setBoardUniversity] = useState("");
  const [passingYear, setPassingYear] = useState("");
  const [joiningYear, setJoiningYear] = useState("");
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [percentage, setPercentage] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [gradingSystem, setGradingSystem] = useState("percentage");
  const [experienceOrgName, setExperienceOrgName] = useState("");
  const [experienceRole, setExperienceRole] = useState("");
  const [experienceType, setExperienceType] = useState("");
  const [experienceLocation, setExperienceLocation] = useState("");
  const [experienceSalary, setExperienceSalary] = useState("");
  const [experienceJoiningDate, setExperienceJoiningDate] = useState("");
  const [experienceRelievingDate, setExperienceRelievingDate] = useState("");
  const [experienceHistory, setExperienceHistory] = useState([]);
  {
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
  const [emailMethod, setEmailMethod] = useState("api"); const [ccEmails, setCcEmails] = useState("");
  const [bccEmails, setBccEmails] = useState("");
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [newRequestEmail, setNewRequestEmail] = useState("");
  const [newRequestName, setNewRequestName] = useState("");
  const [newRequestTemplate, setNewRequestTemplate] = useState("");
  const [newRequestSubject, setNewRequestSubject] = useState(
    "Background Verification - Document Request",
  );

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

    return baseDocuments;
  };
  const requiredDocuments = useMemo(
    () => getRequiredDocuments(),
    [isExperienced],
  );

  useEffect(() => {
    loadEmployees();
    loadDocumentRequests();
  }, []);

  const loadEmployees = async () => {
    try {
      // GET /api/employees/ returns EmployeeListItem shape:
      // { id, employeeId, name, email, phone, department, designation,
      //   location, employmentType, status, joinDate, salary }
      // — a single `name` field, not firstName/middleName/lastName, and
      // no bgvStatus/candidateId (BGV status/candidate linkage isn't on
      // the employee record; the component tracks status locally in
      // state as the workflow progresses, via setEmployees() calls below).
      const data = await bgvAPI.getEmployees();
      if (data && Array.isArray(data)) {
        const employeeList = data.map((profile) => ({
          id: profile.id,
          employeeId: profile.employeeId,
          name: profile.name || "",
          email: profile.email,
          phone: profile.phone,
          department: profile.department,
          designation: profile.designation,
          joiningDate: profile.joinDate,
          status: "Not Started",
          candidateId: null,
        }));
        setEmployees(employeeList);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error loading BGV employees from API:", error);
      setEmployees([]);
    }
  };

  const loadDocumentRequests = async () => {
    try {
      const data = await bgvAPI.getRequests();
      if (data && Array.isArray(data)) {
        const updatedRequests = data.map((request) => ({
          ...request,
          dateOfBirth: request.dateOfBirth || request.dob || "",
          gender: request.gender || "",
          maritalStatus: request.maritalStatus || "",

          personalInfo: request.personalInfo || {
            dob: request.dateOfBirth || request.dob || "",
            gender: request.gender || "",
            maritalStatus: request.maritalStatus || ""
          },

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

          educationQualifications: Array.isArray(request.educationQualifications)
            ? request.educationQualifications
            : request.educationQualifications
              ? [request.educationQualifications] : request.education
                ? (Array.isArray(request.education) ? request.education : [request.education])
                : [],

          department: request.department || "",
          designation: request.designation || "",
          phone: request.phone || "",

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

          isExperienced: request.isExperienced || false,
          yearsOfExperience: request.yearsOfExperience || "",
          experienceData: request.experienceData || request.experience || null,

          completedDate: request.completedDate || null,
          addressVerified: request.addressVerified || null
        }));

        setDocumentRequests(updatedRequests);
      } else {
        setDocumentRequests([]);
      }
    } catch (error) {
      console.error("Error loading BGV document requests from API:", error);
      setDocumentRequests([]);
    }
  };

  const saveDocumentRequests = (requests) => {
    setDocumentRequests(requests);
  };

  const handleDocumentUpload = (event, documentId) => {
    const file = event.target.files[0];
    if (!file) return;

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

    const maxSize = 5 * 1024 * 1024; if (file.size > maxSize) {
      alert("File size should be less than 5MB");
      return;
    }

    const fileUrl = URL.createObjectURL(file);

    const newUploadedDoc = {
      id: documentId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      fileUrl: fileUrl,
      file: file,
    };

    setUploadedDocuments((prev) => {
      const filtered = prev.filter((doc) => doc.id !== documentId);
      return [...filtered, newUploadedDoc];
    });

    event.target.value = "";
  };

  const handleReplaceDocument = (docId, newFile) => {
    const fileUrl = URL.createObjectURL(newFile);

    const updatedDoc = {
      id: docId,
      name: newFile.name,
      file: newFile,
      fileUrl: fileUrl,
      size: newFile.size,
      type: newFile.type,
      uploadDate: new Date().toISOString(),
    };

    setUploadedDocuments((prev) => {
      const oldDoc = prev.find((d) => d.id === docId);
      if (oldDoc && oldDoc.fileUrl) {
        URL.revokeObjectURL(oldDoc.fileUrl);
      }

      return prev.map((doc) => (doc.id === docId ? updatedDoc : doc));
    });

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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
    input.style.display = "none";

    input.onchange = (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          setEmailStatus({
            type: "error",
            message: `File size exceeds 5MB limit. Selected file: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          });
          document.body.removeChild(input);
          return;
        }

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

          setUploadedDocuments((prev) => {
            const oldDoc = prev.find((d) => d.id === docId);
            if (oldDoc && oldDoc.fileUrl) {
              URL.revokeObjectURL(oldDoc.fileUrl);
            }

            return prev.map((doc) => (doc.id === docId ? updatedDoc : doc));
          });

          setEmailStatus({
            type: "success",
            message: "Document replaced successfully",
          });
        }
      }

      document.body.removeChild(input);
    };

    document.body.appendChild(input);
    input.click();
  };
  const handleUpdateExistingDocument = async (docId, newFile, existingDoc) => {
    try {
      const fileUrl = URL.createObjectURL(newFile);

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

      setUploadedDocuments((prev) => {
        const existingUpdateIndex = prev.findIndex(
          (d) => d.id === docId && d.isUpdate,
        );

        if (existingUpdateIndex >= 0) {
          const updated = [...prev];
          if (updated[existingUpdateIndex].fileUrl) {
            URL.revokeObjectURL(updated[existingUpdateIndex].fileUrl);
          }
          updated[existingUpdateIndex] = newVersion;
          return updated;
        } else {
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



  const handleRemoveDocument = (docId) => {
    setUploadedDocuments((prevDocs) => {
      const docToRemove = prevDocs.find((d) => d.id === docId);

      if (docToRemove?.fileUrl) {
        URL.revokeObjectURL(docToRemove.fileUrl);
      }

      return prevDocs.filter((d) => d.id !== docId);
    });
  };

  const handleReuploadDocument = (event, documentId) => {
    const file = event.target.files[0];
    if (!file) return;

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

    const maxSize = 5 * 1024 * 1024; if (file.size > maxSize) {
      setEmailStatus({
        type: "error",
        message: "File size should be less than 5MB",
      });
      return;
    }

    const existingDoc = uploadedDocuments.find((doc) => doc.id === documentId);
    if (existingDoc && existingDoc.fileUrl) {
      URL.revokeObjectURL(existingDoc.fileUrl);
    }

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
      const filtered = prev.filter((doc) => doc.id !== documentId);
      return [...filtered, updatedDoc];
    });

    setEmailStatus({
      type: "success",
      message: "Document updated successfully!",
    });

    event.target.value = "";
  };

  const handleEmailDocumentUpload = (e, docId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);

    setUploadedDocuments((prev) => {
      const filtered = prev.filter((d) => d.id !== docId);
      return [
        ...filtered,
        {
          id: docId,
          name: file.name,
          size: file.size,
          type: file.type,
          fileUrl: blobUrl, uploadDate: new Date().toISOString(),
          file,
        },
      ];
    });
  };

  const handleViewDocument = (document) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, "_blank");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  const generateEmailTemplate = (employeeName) => {
    return `Dear ${employeeName},\n\nWe hope this email finds you well.\n\nAs part of our standard background verification process, we require the following documents from you:\n\n${requiredDocuments
      .filter((doc) => doc.required)
      .map((doc) => `- ${doc.name}`)
      .join(
        "\n",
      )}\n\nPlease submit scanned copies (PDF format) of these documents at your earliest convenience.\n\nYou can upload the documents through our employee portal or send them via email reply.\n\nIf you have any questions or concerns, please feel free to contact us.\n\nBest regards,\nHR Team\n\n---\nThis is an automated email. Please do not reply directly to this message.`;
  };

  const handleNewRequest = () => {
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

    const defaultTemplate = `Dear [Employee Name],\n\nWe hope this email finds you well.\n\nAs part of our standard background verification process, we require the following documents from you:\n\n${getRequiredDocuments()
      .filter((doc) => doc.required)
      .map((doc) => `- ${doc.name}`)
      .join(
        "\n",
      )}\n\nPlease submit scanned copies (PDF format) of these documents at your earliest convenience.\n\nYou can upload the documents through our employee portal or send them via email reply.\n\nIf you have any questions or concerns, please feel free to contact us.\n\nBest regards,\nHR Team\n\n---\nThis is an automated email. Please do not reply directly to this message.`;

    setNewRequestTemplate(defaultTemplate);

    setCcEmails("");
    setBccEmails("");
    setEmailMethod("api");
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

    uploadedDocuments.forEach((doc) => {
      if (doc.fileUrl) {
        URL.revokeObjectURL(doc.fileUrl);
      }
    });

    setUploadedDocuments([]);

    setEmailStatus({ type: "", message: "" });

    setSendingEmail(false);

    setShowNewRequestModal(true);
  };

  const handleSendNewRequest = async () => {
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
        const employeeId = newRequestEmployeeId.trim() || `EXT-${Date.now()}`;

        const allRequiredUploaded = requiredDocuments
          .filter((doc) => doc.required)
          .every((doc) => uploadedDocuments.some((ud) => ud.id === doc.id));

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
              location: experienceLocation, currentSalary: currentSalary,
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
          uploadedFiles: uploadedDocuments.map((doc) => ({
            id: doc.id,
            name: doc.name,
            file: doc.file,
          })),
        };

        const updatedRequests = [...documentRequests, newRequest];
        saveDocumentRequests(updatedRequests);
        bgvAPI.saveRequest(newRequest).catch(err => console.error("Error saving BGV request:", err));

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
            isExperienced: isExperienced,
            yearsOfExperience: isExperienced ? yearsOfExperience : null,

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

          bgvAPI.updateStatus(employeeId, allRequiredUploaded ? "Completed" : "In Progress").catch(err => console.error("Error updating status:", err));
        } else {
          if (allRequiredUploaded) {
            const updatedEmployees = employees.map((emp) => {
              if (emp.email === newRequestEmail) {
                return { ...emp, status: "Completed" };
              }
              return emp;
            });
            setEmployees(updatedEmployees);

            bgvAPI.updateStatus(existingEmp.id, "Completed").catch(err => console.error("Error updating status:", err));
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

  const handleSendEmail = () => {
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee");
      return;
    }

    if (selectedEmployees.length === 1) {
      const employeeId = selectedEmployees[0];
      const employeeRequest = documentRequests.find(
        (req) => req.employeeId === employeeId,
      );
      const employee = employees.find((emp) => emp.id === employeeId);

      if (employeeRequest) {
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

        setUploadedDocuments((prev) => {
          const combined = [...prev];

          existingUploads.forEach((newDoc) => {
            if (!combined.some((existing) => existing.id === newDoc.id)) {
              combined.push(newDoc);
            }
          });

          return combined;
        });

        setNewRequestEmail(employee.email);
        setNewRequestName(employee.name);
        setNewRequestPhone(employee.phone || "");
        setNewRequestDepartment(employee.department || "");
        setNewRequestDesignation(employee.designation || "");
        setNewRequestEmployeeId(employee.employeeId || "");

        if (employeeRequest.isExperienced) {
          setIsExperienced(true);
          setYearsOfExperience(employeeRequest.yearsOfExperience || "");

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

          if (
            employeeRequest.experienceHistory &&
            employeeRequest.experienceHistory.length > 0
          ) {
            setPreviousExperiences(employeeRequest.experienceHistory);
          }
        } else {
          setIsExperienced(false);
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

    const defaultTemplate = generateEmailTemplate(
      selectedEmps[0]?.name || "Employee",
    );

    setEmailTemplate(defaultTemplate);
    setShowEmailModal(true);
  };

  const handleClearEmailUploads = () => {
    if (emailUploads.length === 0) return;

    if (window.confirm("Clear all new document uploads?")) {
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
    const fileInput = document.getElementById(`email-upload-${documentId}`);
    if (fileInput) {
      fileInput.click();
    }
  };

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

      const newRequests = selectedEmps.map((emp) => {
        let employeeDocuments = requiredDocuments.map((doc) => {
          const existingRequest = documentRequests.find(
            (req) => req.employeeId === emp.id,
          );
          const existingDoc = existingRequest?.documents?.find(
            (d) => d.id === doc.id,
          );

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
      newRequests.forEach((newReq) => {
        bgvAPI.saveRequest(newReq).catch(err => console.error("Error saving BGV request:", err));
      });

      const updatedEmployees = employees.map((emp) => {
        if (selectedEmployees.includes(emp.id)) {
          bgvAPI.updateStatus(emp.id, "In Progress").catch(err => console.error("Error updating status:", err));
          return { ...emp, status: "In Progress" };
        }
        return emp;
      });
      setEmployees(updatedEmployees);

      handleClearEmailUploads();

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

  const handleUpdateDocument = (documentId) => {
    const fileInput = document.getElementById(`email-upload-${documentId}`);
    if (fileInput) {
      fileInput.click();
    }
  };

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

  const getDocumentRequest = (employeeId) => {
    return documentRequests.find((req) => req.employeeId === employeeId);
  };

  const getCompletionPercentage = (request) => {
    if (!request) return 0;
    const totalDocs = request.documents.length;
    const completedDocs = request.documents.filter(
      (doc) => doc.status === "Completed",
    ).length;
    return Math.round((completedDocs / totalDocs) * 100);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployeeId(employee.id);
    setEditEmployeeName(employee.name || "");
    setEditEmployeePhone(employee.phone || "");
    setEditEmployeeEmail(employee.email || "");
    setEditEmployeeDepartment(employee.department || "");
    setEditEmployeeDesignation(employee.designation || "");
    setEditEmployeeId(employee.employeeId || "");
  };

  const handleSaveEmployeeEdit = () => {
    if (!editEmployeeName.trim() || !editEmployeeEmail.trim()) {
      setEmailStatus({ type: "error", message: "Please enter name and email" });
      return;
    }

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

    const updatedRequests = documentRequests.map((req) => {
      if (req.employeeId === editingEmployeeId) {
        const updatedReq = {
          ...req,
          employeeName: editEmployeeName,
          email: editEmployeeEmail,
        };
        bgvAPI.saveRequest(updatedReq).catch(err => console.error("Error saving BGV request:", err));
        return updatedReq;
      }
      return req;
    });
    saveDocumentRequests(updatedRequests);

    // Update status on API
    try {
      const targetEmp = updatedEmployees.find(emp => emp.id === editingEmployeeId);
      if (targetEmp) {
        bgvAPI.updateStatus(editingEmployeeId, targetEmp.status).catch(err => console.error(err));
      }
    } catch (err) {
      console.error("Error updating BGV status via API:", err);
    }

    setEmailStatus({
      type: "success",
      message: "Employee details updated successfully!",
    });

    setTimeout(() => {
      setEditingEmployeeId(null);
    }, 1500);
  };

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

    if (editingEmployeeId) {
      handleSaveEmployeeEdit();
    }

    setSendingEmail(true);
    setEmailStatus({ type: "info", message: "Sending emails..." });

    const timestamp = new Date().toISOString();

    try {
      let emailResult;


      const newRequests = selectedEmps.map((emp) => {
        const existingRequest = documentRequests.find(
          (req) => req.employeeId === emp.id,
        );

        if (existingRequest) {
          const updatedDocuments = existingRequest.documents.map((doc) => {
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
        bgvAPI.saveRequest(newReq).catch(err => console.error("Error saving BGV request:", err));
      });
      saveDocumentRequests(updatedRequests);

      const updatedEmployees = employees.map((emp) => {
        if (selectedEmployees.includes(emp.id)) {
          bgvAPI.updateStatus(emp.id, "In Progress").catch(err => console.error("Error updating status:", err));
          return { ...emp, status: "In Progress" };
        }
        return emp;
      });
      setEmployees(updatedEmployees);

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

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await bgvAPI.deleteRequest(employeeId);
    } catch (error) {
      console.error("Error deleting request from API:", error);
    }

    const updatedRequests = documentRequests.filter(
      (req) => req.employeeId !== employeeId,
    );
    setDocumentRequests(updatedRequests);

    const updatedEmployees = employees.filter(
      (emp) => emp.id !== employeeId,
    );
    setEmployees(updatedEmployees);
  };

  const handleApproveVerification = async (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    if (window.confirm(`Approve background verification for ${employee.name}?`)) {
      const updatedEmployees = employees.map((emp) =>
        emp.id === employeeId ? { ...emp, status: "Completed" } : emp
      );
      setEmployees(updatedEmployees);

      const updatedRequests = documentRequests.map((req) => {
        if (req.employeeId === employeeId) {
          const updatedReq = {
            ...req,
            status: "Completed",
            completedDate: new Date().toISOString(),
          };
          bgvAPI.saveRequest(updatedReq).catch(err => console.error("Error saving BGV approval request:", err));
          return updatedReq;
        }
        return req;
      });
      setDocumentRequests(updatedRequests);

      try {
        await bgvAPI.updateStatus(employeeId, "Completed");
      } catch (err) {
        console.error("Error updating BGV status to Completed:", err);
      }

      alert(`Background verification approved for ${employee.name}`);
    }
  };

  const handleRejectVerification = async (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    if (window.confirm(`Reject background verification for ${employee.name}?`)) {
      const updatedEmployees = employees.map((emp) =>
        emp.id === employeeId ? { ...emp, status: "Rejected" } : emp
      );
      setEmployees(updatedEmployees);

      const updatedRequests = documentRequests.map((req) => {
        if (req.employeeId === employeeId) {
          const updatedReq = {
            ...req,
            status: "Rejected",
          };
          bgvAPI.saveRequest(updatedReq).catch(err => console.error("Error saving BGV rejection request:", err));
          return updatedReq;
        }
        return req;
      });
      setDocumentRequests(updatedRequests);

      try {
        await bgvAPI.updateStatus(employeeId, "Rejected");
      } catch (err) {
        console.error("Error updating BGV status to Rejected:", err);
      }

      alert(`Background verification rejected for ${employee.name}`);
    }
  };

  const modalProps = { employees, setEmployees, selectedEmployees, setSelectedEmployees, activeSection, setActiveSection, searchTerm, setSearchTerm, statusFilter, setStatusFilter, selectedRequest, setSelectedRequest, showRequestDetails, setShowRequestDetails, showEmailModal, setShowEmailModal, emailTemplate, setEmailTemplate, newRequestPhone, setNewRequestPhone, newRequestDepartment, setNewRequestDepartment, newRequestDesignation, setNewRequestDesignation, newRequestEmployeeId, setNewRequestEmployeeId, uploadedDocuments, setUploadedDocuments, emailUploads, setEmailUploads, emailUploadedDocuments, setEmailUploadedDocuments, isExperienced, setIsExperienced, yearsOfExperience, setYearsOfExperience, currentOrganization, setCurrentOrganization, currentRole, setCurrentRole, employmentType, setEmploymentType, currentSalary, setCurrentSalary, noticePeriod, setNoticePeriod, previousExperiences, setPreviousExperiences, globalUploadedDocuments, setGlobalUploadedDocuments, newRequestDob, setNewRequestDob, newRequestGender, setNewRequestGender, newRequestMaritalStatus, setNewRequestMaritalStatus, newRequestParentName, setNewRequestParentName, newRequestParentRelationship, setNewRequestParentRelationship, newRequestParentPhone, setNewRequestParentPhone, newRequestParentEmail, setNewRequestParentEmail, newRequestParentEmployment, setNewRequestParentEmployment, newRequestParentOrganization, setNewRequestParentOrganization, newRequestParentDesignation, setNewRequestParentDesignation, newRequestParentIncome, setNewRequestParentIncome, newRequestParentAddress, setNewRequestParentAddress, newRequestIsGuardian, setNewRequestIsGuardian, educationQualifications, setEducationQualifications, showEducationForm, setShowEducationForm, editingEducation, setEditingEducation, educationLevel, setEducationLevel, schoolCollegeName, setSchoolCollegeName, boardUniversity, setBoardUniversity, passingYear, setPassingYear, joiningYear, setJoiningYear, degree, setDegree, branch, setBranch, percentage, setPercentage, cgpa, setCgpa, gradingSystem, setGradingSystem, experienceOrgName, setExperienceOrgName, experienceRole, setExperienceRole, experienceType, setExperienceType, experienceLocation, setExperienceLocation, experienceSalary, setExperienceSalary, experienceJoiningDate, setExperienceJoiningDate, experienceRelievingDate, setExperienceRelievingDate, experienceHistory, setExperienceHistory, currentAddress, setCurrentAddress, permanentAddress, setPermanentAddress, sameAsCurrent, setSameAsCurrent, showDeleteModal, setShowDeleteModal, employeeToDelete, setEmployeeToDelete, deleting, setDeleting, editingEmployeeId, setEditingEmployeeId, editEmployeeName, setEditEmployeeName, editEmployeePhone, setEditEmployeePhone, editEmployeeEmail, setEditEmployeeEmail, editEmployeeDepartment, setEditEmployeeDepartment, editEmployeeDesignation, setEditEmployeeDesignation, editEmployeeId, setEditEmployeeId, emailSubject, setEmailSubject, documentRequests, setDocumentRequests, sendingEmail, setSendingEmail, emailStatus, setEmailStatus, emailMethod, setEmailMethod, ccEmails, setCcEmails, bccEmails, setBccEmails, showNewRequestModal, setShowNewRequestModal, newRequestEmail, setNewRequestEmail, newRequestName, setNewRequestName, newRequestTemplate, setNewRequestTemplate, newRequestSubject, setNewRequestSubject, handleNewRequest, handleSendEmail, getRequiredDocuments, handleDocumentUpload, handleReplaceDocumentClick, handleRemoveDocument, handleViewDocument, handleReuploadDocument, requiredDocuments, handleUpdateExistingDocument, handleSendNewRequest, handleEmailDocumentUpload, handleSelectEmployee, handleSelectAll, handleClearEmailUploads, handleUpdateEmailDocument, handleConfirmSendEmail, handlePreviewDocument, handleUpdateDocument, handleEditEmployee, handleSaveEmployeeEdit, handleConfirmSendEmailWithEdits, handleDeleteEmployee, handleApproveVerification, handleRejectVerification };

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-screen-xl mx-auto space-y-4 sm:space-y-6">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              {activeSection !== "configuration" && (
                <button
                  onClick={() => setActiveSection("configuration")}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Icon icon="heroicons:arrow-left" className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Back to Configuration</span>
                  <span className="xs:hidden">Back</span>
                </button>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <Icon icon="heroicons:shield-check" className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
              <span className="truncate">Background Verification</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Request and track document collection for employee background verification
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleNewRequest}
              className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
            >
              <Icon icon="heroicons:plus-circle" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">New Request</span>
              <span className="xs:hidden">New</span>
            </button>
            {selectedEmployees.length > 0 && (
              <button
                onClick={handleSendEmail}
                className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 text-gray-700 hover:text-primary hover:border-primary rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap"
              >
                <Icon icon="heroicons:envelope" className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Send Request ({selectedEmployees.length})</span>
                <span className="xs:hidden">Send ({selectedEmployees.length})</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Search
              </label>
              <div className="relative">
                <Icon
                  icon="heroicons:magnifying-glass"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                />
                <input
                  type="search"
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-gray-50"
                  placeholder="Search by name, email, or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchTerm("");
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
            </div>

            <div className="w-full sm:w-52 lg:w-64 flex-shrink-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Status Filter
              </label>
              <select
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Not Started">Not Started</option>
                <option value="Pending">Pending</option>
                <option value="Request Sent">Request Sent</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Employees"
            value={employees.length}
            icon="heroicons:users"
            color="blue"
          />

          <StatCard
            title="Pending"
            value={employees.filter((e) => e.status === "Pending" || e.status === "Not Started").length}
            icon="heroicons:clock"
            color="yellow"
          />

          <StatCard
            title="In Progress"
            value={employees.filter((e) => e.status === "In Progress" || e.status === "Request Sent").length}
            icon="heroicons:arrow-path"
            color="cyan"
          />

          <StatCard
            title="Completed"
            value={employees.filter((e) => e.status === "Completed").length}
            icon="heroicons:check-badge"
            color="green"
          />
        </div>



        {documentRequests.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
                Document Requests
              </h4>

              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium">
                {documentRequests.length} Request
                {documentRequests.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {documentRequests.map((request) => {
                const completion = getCompletionPercentage(request);

                return (
                  <div key={request.id} className="h-full">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full justify-between p-4 sm:p-5">
                      <div>
                        <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                          <div className="min-w-0 flex-1">
                            <h6 className="font-semibold text-gray-900 mb-1 truncate text-sm sm:text-base">
                              {request.employeeName}
                            </h6>
                            <p className="text-gray-500 text-xs truncate">
                              {request.email}
                            </p>
                          </div>

                          <span
                            className={`text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-medium whitespace-nowrap ${request.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : request.status === "In Progress" || request.status === "Request Sent"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : "bg-amber-50 text-amber-700 border border-amber-100"
                              }`}
                          >
                            {request.status}
                          </span>
                        </div>

                        <div className="mb-3 sm:mb-4">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs text-gray-500 font-medium">
                              Progress
                            </span>
                            <span className="text-xs font-semibold text-gray-700">
                              {completion}%
                            </span>
                          </div>

                          <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2">
                            <div
                              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${completion === 100 ? "bg-emerald-500" : "bg-blue-500"
                                }`}
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                        </div>

                        <div className="border-b border-gray-100 pb-2 sm:pb-3 mb-3 sm:mb-4">
                          <span className="text-xs text-gray-400 block mb-1">
                            Requested Date
                          </span>
                          <div className="text-xs font-medium text-gray-700">
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
                      </div>

                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition-colors"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRequestDetails(true);
                          }}
                          title="View Details"
                        >
                          <Icon icon="heroicons:eye" className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        <button
                          className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors"
                          onClick={() => {
                            const updatedRequests = documentRequests.filter(
                              (req) => req.id !== request.id,
                            );
                            saveDocumentRequests(updatedRequests);
                          }}
                          title="Delete Request"
                        >
                          <Icon icon="heroicons:trash" className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Employees List</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-3 sm:px-4 lg:px-6 py-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedEmployees.length === filteredEmployees.length &&
                          filteredEmployees.length > 0
                        }
                        onChange={handleSelectAll}
                        className="h-3 w-3 sm:h-4 sm:w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                      />
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Employee
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Contact
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                      Department
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                      Joining Date
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                      Progress
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 sm:py-12">
                        <div className="flex flex-col items-center text-gray-400">
                          <Icon
                            icon="heroicons:inbox"
                            className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 text-gray-300"
                          />
                          <p className="font-semibold text-gray-600 mb-1 text-sm sm:text-base">
                            No employees found
                          </p>
                          <span className="text-xs">
                            Try adjusting your search or filter criteria
                          </span>
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
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-3 sm:px-4 lg:px-6 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedEmployees.includes(employee.id)}
                              onChange={() => handleSelectEmployee(employee.id)}
                              className="h-3 w-3 sm:h-4 sm:w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                            />
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3">
                            <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                              {employee.name}
                            </div>
                            <span className="text-gray-400 text-xs block">
                              ID: {employee.employeeId}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3">
                            <div className="text-gray-800 text-xs sm:text-sm max-w-[120px] sm:max-w-none truncate">
                              {employee.email}
                            </div>
                            <span className="text-gray-400 text-xs block">
                              {employee.phone || "N/A"}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 hidden sm:table-cell">
                            <div className="text-gray-900 text-xs sm:text-sm">
                              {employee.department}
                            </div>
                            <span className="text-gray-400 text-xs block">
                              {employee.designation}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 hidden lg:table-cell text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                            {new Date(employee.joiningDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${employee.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : employee.status === "In Progress" || employee.status === "Request Sent"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : employee.status === "Pending"
                                    ? "bg-amber-50 text-amber-700 border-amber-100"
                                    : "bg-gray-50 text-gray-700 border-gray-100"
                                }`}
                            >
                              {employee.status}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 hidden md:table-cell">
                            {request ? (
                              <div className="w-24 sm:w-32">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-500">
                                    {completion}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full transition-all duration-300 ${completion === 100 ? "bg-emerald-500" : "bg-blue-500"
                                      }`}
                                    style={{ width: `${completion}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                Not Started
                              </span>
                            )}
                          </td>
                          <td className="px-3 sm:px-4 lg:px-6 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg hover:border-blue-100 border border-transparent transition-colors"
                                onClick={() => {
                                  setSelectedEmployees([employee.id]);
                                  handleSendEmail();
                                }}
                                title="Send Document Request"
                              >
                                <Icon icon="heroicons:envelope" className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>

                              {request && (
                                <button
                                  className="p-1 sm:p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg hover:border-cyan-100 border border-transparent transition-colors"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowRequestDetails(true);
                                  }}
                                  title="View Details"
                                >
                                  <Icon icon="heroicons:eye" className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              )}

                              {request && employee.status === "In Progress" && (
                                <button
                                  className="p-1 sm:p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg hover:border-emerald-100 border border-transparent transition-colors"
                                  onClick={() => handleApproveVerification(employee.id)}
                                  title="Approve Verification"
                                >
                                  <Icon icon="heroicons:check" className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              )}

                              {request &&
                                (employee.status === "In Progress" ||
                                  employee.status === "Pending") && (
                                  <button
                                    className="p-1 sm:p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg hover:border-amber-100 border border-transparent transition-colors"
                                    onClick={() => handleRejectVerification(employee.id)}
                                    title="Reject Verification"
                                  >
                                    <Icon icon="heroicons:x-mark" className="w-4 h-4 sm:w-5 sm:h-5" />
                                  </button>
                                )}

                              {request && (
                                <button
                                  className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg hover:border-red-100 border border-transparent transition-colors"
                                  title="Delete Request Permanently"
                                  onClick={() => {
                                    setEmployeeToDelete(employee);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <Icon icon="heroicons:trash" className="w-4 h-4 sm:w-5 sm:h-5" />
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

        <NewBGVRequestModal {...modalProps} />
        <EditBGVRequestModal {...modalProps} />
        <EmailModal {...modalProps} />
        <DeleteConfirmationModal {...modalProps} />

      </div>
    </div>
  );
};

export default BackgroundVerification;