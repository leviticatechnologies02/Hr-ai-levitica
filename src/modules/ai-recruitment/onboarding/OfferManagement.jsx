// src/components/HRMS/Onboarding&Joining/OfferManagement.jsx
import React, { useState, useEffect, Fragment } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import "bootstrap/dist/css/bootstrap.min.css";

import html2pdf from 'html2pdf.js';

const OfferManagement = () => {
  // State management
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
    offerType: "all",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showESignatureModal, setShowESignatureModal] = useState(false);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [showBGVModal, setShowBGVModal] = useState(false);
  const [showReferenceCheckModal, setShowReferenceCheckModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
const [withdrawReason, setWithdrawReason] = useState("");
  const [approvalWorkflowStatus, setApprovalWorkflowStatus] = useState([]);
  const [declineReason, setDeclineReason] = useState("");
  const [showExpiredAlert, setShowExpiredAlert] = useState(true);
  const [showExpiringSoonAlert, setShowExpiringSoonAlert] = useState(true);
  const [emailSettings, setEmailSettings] = useState({
    sendEmail: true,
    sendSMS: false,
    ccRecipients: [],
    emailTemplate: "standard",
  });
  const [eSignatureData, setESignatureData] = useState({
    candidateSignature: null,
    signatureDate: null,
    ipAddress: null,
    deviceInfo: null,
  });
  


  // Offer status types
  const OFFER_STATUS = {
    DRAFT: "draft",
    PENDING_APPROVAL: "pending_approval",
    APPROVED: "approved",
    SENT: "sent",
    ACCEPTED: "accepted",
    DECLINED: "declined",
    EXPIRED: "expired",
    WITHDRAWN: "withdrawn",
  };

  const declineReasonsList = [
    "Accepted another offer",
    "Salary not acceptable",
    "Location not suitable",
    "Role not aligned with expectations",
    "Personal reasons",
    "Other",
  ];

  // Departments
  const DEPARTMENTS = [
    "Engineering",
    "Sales",
    "Human Resources",
    "Marketing",
    "Finance",
    "Operations",
    "IT",
  ];


  const withdrawReasonsList = [
  "Candidate not responding",
  "Position on hold",
  "Position cancelled",
  "Budget constraints",
  "Hiring freeze",
  "Duplicate offer created",
  "Candidate requested withdrawal",
  "Other",
];
  // Offer types
  const OFFER_TYPES = ["Full-time", "Contract", "Internship", "Consultant"];
  // Enhanced Templates with role/level configuration
  const TEMPLATES = [
    {
      id: "standard",
      name: "Standard Offer Letter",
      applicableTo: ["L1", "L2"],
      sections: [
        "header",
        "candidate_info",
        "position_details",
        "ctc_breakup",
        "terms",
        "signatures",
      ],
      customizableFields: ["terms", "probation_period", "notice_period"],
      defaultTerms: `1. This offer is subject to background verification.
2. You will be on probation for 3 months.
3. Standard company policies apply.
4. Please acknowledge acceptance by the expiry date.`,
    },
    {
      id: "executive",
      name: "Executive Offer Letter",
      applicableTo: ["L3", "L4", "L5"],
      sections: [
        "header",
        "candidate_info",
        "position_details",
        "ctc_breakup",
        "stock_options",
        "terms",
        "signatures",
      ],
      customizableFields: [
        "terms",
        "probation_period",
        "notice_period",
        "stock_options",
        "benefits",
      ],
      defaultTerms: `1. This offer is subject to background verification.
2. You will be on probation for 6 months.
3. Executive compensation package includes stock options.
4. Standard company policies apply.
5. Please acknowledge acceptance by the expiry date.`,
    },
    {
      id: "intern",
      name: "Internship Offer Letter",
      applicableTo: ["Intern"],
      sections: [
        "header",
        "candidate_info",
        "position_details",
        "stipend",
        "terms",
        "signatures",
      ],
      customizableFields: ["terms", "duration", "stipend"],
      defaultTerms: `1. This is an internship position for a duration of 6 months.
2. Stipend will be paid monthly.
3. Performance will be evaluated at the end of internship.
4. Conversion to full-time is subject to performance and business needs.`,
    },
    {
      id: "contract",
      name: "Contract Offer Letter",
      applicableTo: ["Contract"],
      sections: [
        "header",
        "candidate_info",
        "position_details",
        "ctc_breakup",
        "contract_terms",
        "signatures",
      ],
      customizableFields: ["terms", "contract_duration", "renewal_terms"],
      defaultTerms: `1. This is a contract position for a specified duration.
2. Contract terms and renewal are subject to project requirements.
3. Standard company policies apply during contract period.`,
    },
    {
      id: "custom",
      name: "Custom Template",
      applicableTo: ["All"],
      sections: [
        "header",
        "candidate_info",
        "position_details",
        "ctc_breakup",
        "terms",
        "signatures",
      ],
      customizableFields: ["all"],
      defaultTerms: `1. This offer is subject to background verification.
2. Standard company policies apply.
3. Please acknowledge acceptance by the expiry date.`,
    },
  ];

  // Enhanced Approval workflows
  const APPROVAL_WORKFLOWS = [
    {
      id: "direct",
      name: "Direct Manager → HR",
      steps: [
        {
          level: 1,
          role: "Direct Manager",
          required: true,
          autoApprove: false,
        },
        { level: 2, role: "HR Manager", required: true, autoApprove: false },
      ],
    },
    {
      id: "multi",
      name: "Manager → HR Head → CEO",
      steps: [
        {
          level: 1,
          role: "Direct Manager",
          required: true,
          autoApprove: false,
        },
        { level: 2, role: "HR Head", required: true, autoApprove: false },
        { level: 3, role: "CEO", required: true, autoApprove: false },
      ],
    },
    {
      id: "auto",
      name: "Auto-approval (Below ₹10L)",
      steps: [
        {
          level: 1,
          role: "Direct Manager",
          required: false,
          autoApprove: true,
        },
        { level: 2, role: "HR Manager", required: true, autoApprove: false },
      ],
      conditions: { maxCTC: 1000000 },
    },
  ];

  // Form data
const [formData, setFormData] = useState({
  candidateName: "",
  email: "",
  phone: "",
  position: "",
  department: "Engineering",
  grade: "L1",
  experience: "",
  noticePeriod: "30 days",
  candidateSource: "",
  customSource: "",
  referralDetails: {
    employeeId: "",
    role: "",
    designation: "",
    experience: ""
  },
  ctc: "",
  gender: "male",
  // New fields for personal details
  relation: "select",
  fatherName: "",
  customRelation: "",
  guardianGender: "",
  guardianPhone: "",
  isLegalGuardian: false,
  // ✅ FIX: Make sure address is properly defined here
  address: {
    street: "",
    city: "",
    district: "",
    state: "",
    customState: "",
    pincode: ""
  },
  ctcBreakup: {
    basic: "",
    hra: "",
    specialAllowance: "",
    conveyance: "",
    telephoneAllowance: "",
    medicalAllowance: "",
    employeePF: "",
    professionalTax: "",
    gratuityEmployee: "",
    employerPF: "",
    groupInsurance: "",
  },
  joiningDate: "",
  offerType: "Full-time",
  template: "standard",
  terms: `1. This offer is subject to background verification.
2. You will be on probation for 3 months.
3. Standard company policies apply.
4. Please acknowledge acceptance by the expiry date.`,
  approvalWorkflow: "direct",
  expiryDate: "",
  notes: "",
  interviewSummary: "",
  salaryNegotiationHistory: "",
  enableBGV: true,
  requireDigitalSignature: false,
  businessUnit: "",
  location: "",
  costCenter: "",
  shiftPolicy: "",
  weekOffPolicy: "",
});
  // Initialize sample data
  useEffect(() => {
    const sampleOffers = [
      {
        id: 1,
        candidateName: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        phone: "+91 9876543210",
        position: "Software Engineer",
        department: "Engineering",
        grade: "L2",
        ctc: "12,00,000",
        joiningDate: "2024-06-01",
        offerStatus: OFFER_STATUS.DRAFT,
        createdDate: "2024-03-15",
        approvedBy: "HR Manager",
        candidateSource: "LinkedIn",
        experience: "3 years",
        noticePeriod: "30 days",
        bgvStatus: "pending",
        bgvDetails: {
          status: "pending",
          initiatedDate: null,
          completedDate: null,
          verifiedBy: null,
          remarks: null,
        },
        offerType: "Full-time",
        template: "Standard",
        templateId: "standard",
        expiryDate: "2024-03-30",
        lastModified: "2024-03-15 14:30",
        notes: "Strong backend skills in Node.js and Python",
        interviewSummary: "Performed well in technical rounds",
        salaryNegotiation: "Initial offer: ₹11,00,000 | Final: ₹12,00,000",
        salaryNegotiationHistory: [
          {
            date: "2024-03-10",
            initialOffer: "₹11,00,000",
            candidateRequest: "₹13,00,000",
            finalOffer: "₹12,00,000",
            status: "Accepted",
          },
        ],
        referenceCheck: {
          status: "completed",
          checkedBy: "HR Manager",
          checkDate: "2024-03-12",
          feedback: "Positive feedback from previous employer",
          references: [
            {
              name: "John Doe",
              company: "Previous Company",
              designation: "Manager",
              feedback: "Excellent performer",
            },
          ],
        },
        attachments: ["resume.pdf", "certificates.zip"],
        emailSent: false,
        emailSentDate: null,
        smsSent: false,
        smsSentDate: null,
        acceptanceDate: null,
        declineReason: null,
        eSignature: null,
        version: 1,
        versionHistory: [],
        approvalWorkflow: {
          workflowId: "direct",
          currentStep: 1,
          steps: [
            {
              level: 1,
              role: "Direct Manager",
              status: "pending",
              approvedBy: null,
              approvedDate: null,
              comments: null,
            },
            {
              level: 2,
              role: "HR Manager",
              status: "pending",
              approvedBy: null,
              approvedDate: null,
              comments: null,
            },
          ],
        },
        history: [
          {
            action: "Offer Created",
            by: "HR Admin",
            date: "2024-03-15 10:00",
            status: OFFER_STATUS.DRAFT,
          },
          {
            action: "Technical Approval",
            by: "Tech Lead",
            date: "2024-03-15 11:30",
            status: OFFER_STATUS.PENDING_APPROVAL,
          },
        ],
        ctcBreakup: {
          basic: "6,00,000",
          hra: "2,40,000",
          conveyance: "19,200",
          specialAllowance: "3,40,800",
        },
      },
      {
        id: 2,
        candidateName: "Priya Singh",
        email: "priya.singh@example.com",
        phone: "+91 9876543211",
        position: "HR Executive",
        department: "Human Resources",
        grade: "L1",
        ctc: "6,50,000",
        joiningDate: "2024-05-15",
        offerStatus: OFFER_STATUS.SENT,
        createdDate: "2024-03-10",
        approvedBy: "HR Head",
        candidateSource: "Referral",
        experience: "2 years",
        noticePeriod: "60 days",
        bgvStatus: "in_progress",
        offerType: "Full-time",
        template: "Executive",
        expiryDate: "2024-03-25",
        lastModified: "2024-03-12 11:20",
        notes: "Internal referral from Manager",
        interviewSummary: "Excellent communication skills",
        salaryNegotiation: "No negotiation",
        referenceCheck: "In progress",
        attachments: ["resume.pdf"],
        history: [
          {
            action: "Offer Created",
            by: "HR Admin",
            date: "2024-03-10 09:00",
            status: OFFER_STATUS.DRAFT,
          },
          {
            action: "HR Approval",
            by: "HR Head",
            date: "2024-03-11 15:30",
            status: OFFER_STATUS.APPROVED,
          },
          {
            action: "Sent to Candidate",
            by: "System",
            date: "2024-03-12 11:20",
            status: OFFER_STATUS.SENT,
          },
        ],
        ctcBreakup: {
          basic: "3,25,000",
          hra: "1,30,000",
          conveyance: "19,200",
          specialAllowance: "1,75,800",
        },
      },
      {
        id: 3,
        candidateName: "Amit Patel",
        email: "amit.patel@example.com",
        phone: "+91 9876543212",
        position: "Sales Manager",
        department: "Sales",
        grade: "L3",
        ctc: "18,00,000",
        joiningDate: "2024-07-01",
        offerStatus: OFFER_STATUS.ACCEPTED,
        createdDate: "2024-03-05",
        approvedBy: "CEO",
        candidateSource: "Naukri",
        experience: "8 years",
        noticePeriod: "90 days",
        bgvStatus: "completed",
        offerType: "Full-time",
        template: "Executive",
        expiryDate: "2024-03-20",
        lastModified: "2024-03-18 16:45",
        notes: "Accepted with revised CTC. Background verification passed.",
        interviewSummary: "Strong sales track record",
        salaryNegotiation: "Initial: ₹16,00,000 | Final: ₹18,00,000",
        referenceCheck: "Completed - Excellent",
        attachments: ["resume.pdf", "certificates.pdf", "offer_acceptance.pdf"],
        history: [
          {
            action: "Offer Created",
            by: "HR Admin",
            date: "2024-03-05 11:00",
            status: OFFER_STATUS.DRAFT,
          },
          {
            action: "Revised Offer",
            by: "HR Manager",
            date: "2024-03-08 14:00",
            status: OFFER_STATUS.PENDING_APPROVAL,
          },
          {
            action: "CEO Approval",
            by: "CEO",
            date: "2024-03-10 10:00",
            status: OFFER_STATUS.APPROVED,
          },
          {
            action: "Sent to Candidate",
            by: "System",
            date: "2024-03-10 11:00",
            status: OFFER_STATUS.SENT,
          },
          {
            action: "Accepted by Candidate",
            by: "Candidate",
            date: "2024-03-15 09:30",
            status: OFFER_STATUS.ACCEPTED,
          },
        ],
        ctcBreakup: {
          basic: "9,00,000",
          hra: "3,60,000",
          conveyance: "19,200",
          specialAllowance: "5,20,800",
          performanceBonus: "3,00,000",
        },
      },
      {
        id: 4,
        candidateName: "Neha Gupta",
        email: "neha.gupta@example.com",
        phone: "+91 9876543213",
        position: "Marketing Intern",
        department: "Marketing",
        grade: "Intern",
        ctc: "3,00,000",
        joiningDate: "2024-04-01",
        offerStatus: OFFER_STATUS.DECLINED,
        createdDate: "2024-03-01",
        approvedBy: "Marketing Head",
        candidateSource: "Campus",
        experience: "Fresher",
        noticePeriod: "15 days",
        bgvStatus: "not_started",
        offerType: "Internship",
        template: "Intern",
        expiryDate: "2024-03-15",
        lastModified: "2024-03-10 14:00",
        notes: "Candidate declined for better offer elsewhere",
        interviewSummary: "Good academic record",
        salaryNegotiation: "No negotiation",
        referenceCheck: "Not required",
        attachments: ["resume.pdf"],
        history: [
          {
            action: "Offer Created",
            by: "HR Admin",
            date: "2024-03-01 09:00",
            status: OFFER_STATUS.DRAFT,
          },
          {
            action: "Department Approval",
            by: "Marketing Head",
            date: "2024-03-03 16:00",
            status: OFFER_STATUS.APPROVED,
          },
          {
            action: "Sent to Candidate",
            by: "System",
            date: "2024-03-04 10:00",
            status: OFFER_STATUS.SENT,
          },
          {
            action: "Declined by Candidate",
            by: "Candidate",
            date: "2024-03-10 14:00",
            status: OFFER_STATUS.DECLINED,
          },
        ],
        ctcBreakup: {
          stipend: "25,000",
        },
      },
    ];

    setTimeout(() => {
      setOffers(sampleOffers);
      setLoading(false);
    }, 500);
  }, []);



  // Handle form input changes
const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name.includes(".")) {
    const [parent, child] = name.split(".");
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value,
      }
    }));

    // Auto-calculate related fields if needed
    if (parent === "ctcBreakup") {
      // You can add auto-calculation logic here
      // For example, auto-calculate PF based on basic salary
      if (child === "basic") {
        const basicValue = parseAmount(value);
        if (basicValue > 0) {
          const pfAmount = Math.min(basicValue * 0.12, 1800); // 12% of basic capped at 1800
          setTimeout(() => {
            setFormData((prev) => ({
              ...prev,
                  [name]: type === "checkbox" ? checked : value,
              ctcBreakup: {
                ...prev.ctcBreakup,
                employeePF: pfAmount.toFixed(0),
                employerPF: pfAmount.toFixed(0)
              }
            }));
          }, 100);
        }
      }
    }
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
};

// Function to handle sending email from preview
const handleSendEmailFromPreview = (offer) => {
  if (!offer) {
    alert("No offer selected to send");
    return;
  }

  if (!offer.email) {
    alert("Candidate email address is missing!");
    return;
  }

  const sendingButton = document.querySelector('.btn-success');
  const originalText = sendingButton.innerHTML;
  sendingButton.disabled = true;

  setTimeout(() => {
    try {
      //  Generate subject & body from your function
      const { subject, body } = generateEmailContent(offer);

      //  Update offer status
      const updatedOffers = offers.map((o) =>
        o.id === offer.id
          ? {
              ...o,
              offerStatus: OFFER_STATUS.SENT,
              emailSent: true,
              emailSentDate: new Date().toISOString(),
              history: [
                ...(o.history || []),
                {
                  action: "Offer Sent via Email",
                  by: "HR Admin",
                  date: new Date().toISOString(),
                  status: OFFER_STATUS.SENT,
                  details: {
                    method: "email",
                    from: "hr@leviticatechnologies.com",
                    to: offer.email,
                  },
                },
              ],
            }
          : o
      );

      setOffers(updatedOffers);

      alert(
        ` Offer letter sent successfully to ${offer.candidateName} (${offer.email})`
      );

      setShowPreview(false);

      //  Open email client using generated content
      window.location.href = `mailto:${offer.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

    } catch (error) {
      console.error("Error sending email:", error);
      alert("❌ Failed to send email. Please try again.");
    } finally {
      sendingButton.innerHTML = originalText;
      sendingButton.disabled = false;
    }
  }, 1500);
};

const generateOfferLetterPDF = (offer) => {
  if (!offer) return;

  // ==================== COMPANY DETAILS ====================
  const companyName = "Levitica Technologies Private Limited";
  const companyAddress = "Office #409, 4th Floor, Jain Sadguru Image's, Capital Pk Rd, Ayyappa Society, Madhapur, Hyderabad, Telangana 500081";
  const companyPhone = "+91 63056 75199";
  const companyEmail = "hr@leviticatechnologies.com";
  const companyWebsite = "www.leviticatechnologies.com";
  const companyCIN = "U72200TG2013PTC091836";
  
  // ==================== CANDIDATE DETAILS ====================
  const candidateName = offer?.candidateName || "Abcd";
  const position = offer?.position || "Associate Software Engineer";
  const joiningDate = offer?.joiningDate || "16th June 2025";
  const ctc = offer?.ctc || "3,00,000";


 const gender = offer?.gender || "male";
const fatherName = offer?.fatherName || "XYZ";
const relation = offer?.relation || "S/O";
const address = offer?.address || {
  street: "2-63. xyz, avx",
  city: "xyz",
  district: "xyz",
  state: "Andhra Pradesh",
  pincode: "533233"
};

// Determine salutation based on gender
const getSalutation = (gender) => {
  switch(gender) {
    case 'female':
      return 'Ms.';
    case 'male':
      return 'Mr.';
    default:
      return 'Mr./Ms.';
  }
};

const salutation = getSalutation(gender);

// Format the address block
const addressBlock = `
  ${salutation} ${candidateName},<br>
  ${relation} ${fatherName},
  ${address.street},${address.city},<br>
  ${address.district},
  State: ${address.state}.
  PIN Code: ${address.pincode}.
`;

// ==================== CURRENT DATE ====================
// Format the current date in multiple formats for different uses

// Format 1: "June 10, 2025" (for the main date display)
const formatDateLong = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};



// Get current date
const currentDate = new Date();

// Use these in your email/PDF generation
const currentDateLong = formatDateLong(currentDate); // "February 16, 2026"

// ==================== OFFER SPECIFIC DATES ====================
// You can also use the offer creation date if available
const offerDate = offer?.createdDate 
  ? new Date(offer.createdDate) 
  : currentDate;

const offerDateFormatted = formatDateLong(offerDate);


// ==================== CTC BREAKUP CALCULATIONS ====================
const ctcBreakup = offer?.ctcBreakup || {
  basic: "1,50,000",
  hra: "60,000",
  specialAllowance: "60,400",
  conveyance: "9,600",
  telephone: "12,000",
  medical: "15,000",
  grossSalary: "3,07,000",
  employeePF: "18,000",
  professionalTax: "2,400",
  gratuity: "7,200",
  netTakeHome: "2,80,000",
  employerPF: "18,000",
  groupInsurance: "5,000",
  totalCTCMonthly: "25,000",
  performanceBonus: "20,000"
};


// Parse numeric values for calculations (remove commas and convert to number)
const parseAmount = (amount) => {
  if (!amount) return 0;
  return parseFloat(amount.toString().replace(/,/g, '')) || 0;
};

// Calculate percentages based on total CTC
const totalCTC = parseAmount(ctc);

const breakupItems = [
  {
    label: "Basic Salary",
    key: "basic",
    amount: parseAmount(ctcBreakup.basic)
  },
  {
    label: "House Rent Allowance (HRA)",
    key: "hra",
    amount: parseAmount(ctcBreakup.hra)
  },
  {
    label: "Special Allowance",
    key: "specialAllowance",
    amount: parseAmount(ctcBreakup.specialAllowance)
  },
  {
    label: "Conveyance Allowance",
    key: "conveyance",
    amount: parseAmount(ctcBreakup.conveyance)
  },
  {
    label: "Telephone Allowance",
    key: "telephone",
    amount: parseAmount(ctcBreakup.telephone)
  },
  {
    label: "Medical Allowance",
    key: "medical",
    amount: parseAmount(ctcBreakup.medical)
  },
  {
    label: "Gross Salary",
    key: "grossSalary",
    amount: parseAmount(ctcBreakup.grossSalary)
  },
  {
    label: "Employee PF",
    key: "employeePF",
    amount: parseAmount(ctcBreakup.employeePF)
  },
  {
    label: "Professional Tax",
    key: "professionalTax",
    amount: parseAmount(ctcBreakup.professionalTax)
  },
  {
    label: "Gratuity",
    key: "gratuity",
    amount: parseAmount(ctcBreakup.gratuity)
  },
  {
    label: "Net Take Home",
    key: "netTakeHome",
    amount: parseAmount(ctcBreakup.netTakeHome)
  },
  {
    label: "Employer PF",
    key: "employerPF",
    amount: parseAmount(ctcBreakup.employerPF)
  },
  {
    label: "Group Insurance",
    key: "groupInsurance",
    amount: parseAmount(ctcBreakup.groupInsurance)
  },
  {
    label: "Performance Bonus",
    key: "performanceBonus",
    amount: parseAmount(ctcBreakup.performanceBonus)
  },
  {
    label: "Total CTC (Monthly)",
    key: "totalCTCMonthly",
    amount: parseAmount(ctcBreakup.totalCTCMonthly)
  }
];


  
// Filter out items with zero amount and calculate total
const validBreakupItems = breakupItems.filter(item => item.amount > 0);

const calculatedTotal = validBreakupItems.reduce(
  (sum, item) => sum + item.amount, 0);

// Format amount with commas
const formatAmount = (amount) => {
  return amount.toLocaleString('en-IN');
};

// Calculate percentage
const calculatePercentage = (amount) => {
  if (totalCTC === 0) return "0";
  return ((amount / totalCTC) * 100).toFixed(2);
};

  // Create a container element for the PDF content
  const element = document.createElement('div');
  element.style.width = '210mm';
  element.style.padding = '0';
  element.style.margin = '0';
  element.style.fontFamily = 'Arial, sans-serif';
  element.style.backgroundColor = 'white';
  
  // HTML Template for the offer letter with exact PDF formatting
  element.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.3;
          }
          .page {
            page-break-after: always;
            position: relative;
            width: 210mm;
            padding: 15px 20px 60px 20px;
            box-sizing: border-box;
            min-height: 290mm; /* Changed from fixed height */
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            padding-bottom: 10px;
          }
          .header-left {
            width: 50%;
          }
          .headers {
            display: flex;
            justify-content: flex-end;  /* pushes content to right */
            align-items: center;
            gap: 20px;
          }
          .header-lefts {
            text-align: right;
          }
          .header-right {
            width: 40%;
            background-color: #3F2D69;
            color: white;
            padding: 8px 12px;
            border-radius: 0;
          }
          .header-right p {
            margin: 4px 0;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;
            border-top: 2px solid #000;
            padding-top: 8px;
            padding-bottom: 6px;
            font-size: 10px;
          }
          .company-footer-text {
            font-weight: bold;
            font-size: 15px;
            color: #000;
            margin-bottom: 3px;
          }
          .company-name {
            color: #3F2D69;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 0.5px;
            margin: 0;
            line-height: 1.1;
          }
          .company-subtitle {
            font-size: 8px;
            color: #666;
            margin-top: 2px;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 8px;
            color: #1E4E8C;
            padding-bottom: 3px;
            text-transform: uppercase;
          }
          .content {
            font-size: 16px;
            line-height: 1.4;
            height: calc(100% - 20px);
            overflow-y: hidden;
            margin-right: 20px;
            margin-left: 20px;
          }
          .confidential {
            color: #1E4E8C;
            text-align: center;
            font-weight: bold;
            font-size: 22px;
            margin: 15px 0;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 9.5px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 6px 8px;
            text-align: left;
          }
          th {
            background-color: #3F2D69;
            color: white;
            font-weight: bold;
          }
          .signature-line {
            border-bottom: 1px solid #000;
            width: 180px;
            margin: 5px 0 2px;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding-top: 10px;
          }
          .signature-box {
            width: 45%;
          }
          .list-item {
            margin-bottom: 4px;
            padding-left: 15px;
            position: relative;
          }
          .list-item:before {
            position: absolute;
            left: 3px;
            color: #3F2D69;
            font-weight: bold;
          }
  /* Full page center wrapper */
.annexure-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;   /* Remove this if you don't want vertical center */
  min-height: 100vh;
  background-color: #f5f6fa;
}

/* Card styling */
.annexure-card {
  width: 600px;               /* Adjust width as needed */
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Table Styling */
.annexure-table {
  width: 100%;
  border-collapse: collapse;
}

.annexure-table th {
  background-color: #3F2D69;
  color: white;
  font-weight: bold;
  padding: 10px;
  text-align: left;
}

.annexure-table td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.total-row {
  font-weight: bold;
  background-color: #f0f0f0;
}
          .signature-image {
            width: 180px;
            height: 50px;
            background-color: #f9f9f9;
            border: 1px dashed #999;
            margin: 3px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
          }
          .welcome-text {
            font-style: italic;
            margin: 10px 0;
            text-align: center;
          }
          p {
            margin: 5px 0;
          }
          .bold {
            font-weight: bold;
            text-align:left;
          }
          .text-right {
            text-align: left;
          }
          .notes-section {
            margin-top: 25px;
            font-size: 11px;
          }
          .notes-section ul {
            padding-left: 18px;
          }
          .signature-row {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
          }
          .left-sign {
            text-align: left;
          }
          .right-sign {
            text-align: right;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
        </style>
    </head>
    <body>
      <!-- ========== PAGE 1 ========== -->
      <div class="page">
        <div class="header">
    <div class="header-left">
      <img 
        src="/assets/images/auth/forgot-pass-img.png" 
        style="max-width: 180px; height: auto;" 
      />
    </div>
            <div class="header-right">
              <p><i class="bi bi-telephone-fill"></i> ${companyPhone}</p>
              <p><i class="bi bi-envelope-fill"></i> ${companyEmail}</p>
              <p><i class="bi bi-globe"></i> ${companyWebsite}</p>
              <p>CIN: ${companyCIN}</p>
            </div>
          </div>
          <div class="content">
            <p class="confidential">Levitica Technologies PVT.LTD</p>
            <p class="text-right" style="font-size: 17px; margin-bottom: 20px; gap:2px"><span class="bold">Date:</span> ${currentDateLong}</p>
            <p><span class="bold">To,</span></p>
            <p style="margin-left: 20px; margin-bottom: 20px;font-size: 17px;"> ${addressBlock} </p>
            <div style="text-align: center; font-family: Arial, sans-serif;">
              <!-- Heading -->
              <p class="confidential"> Confidential Letter! </p>
              <!-- Paragraph -->
              <p style="
                font-size: 18px;
                line-height: 1.5;
                max-width: 800px;
                margin: 0 auto 25px auto;
                text-align: left;
                margin-left: 30px;
                margin-right: 30px;">
                  We are pleased to extend an offer for the position of 
                  <span style="font-weight: 700;">"${position}"</span> 
                  at Levitica Technologies Pvt. Ltd., with your confirmed joining date of 
                  <span style="font-weight: 700;">${joiningDate}</span>. 
                  This offer is subject to the following terms and conditions.
              </p>
            </div>

          <p class="section-title">1. Compensation & Benefits</p>
          
          <div style="margin-left: 30px; font-size: 16px;">
            <p class="list-item">Your total Annual Cost to Company (CTC) will be INR <span class="bold">${ctc}</span>, detailed in <span class="bold">Annexure - A</span>.</p>
            <p class="list-item">Salary will be reviewed periodically based on performance and company policies.</p>
            <p class="list-item">Provident Fund contributions will be based on the Basic component as per statutory rules.</p>
            <p class="list-item">Remuneration may be altered without prior notice depending on company policies and legal guidelines.</p>
            <p class="list-item">Compensation details are confidential and must not be disclosed to others.</p>
            <p class="list-item">Employees are paid monthly via bank transfer.</p>
            <p class="list-item">Additional: Performance bonuses and employee benefits (health insurance, training) may be provided at the company's discretion.</p>
          </div>
        </div>
        
        <div class="footer">
          <div class="company-footer-text">${companyName}</div>
          ${companyAddress}
        </div>

      </div>

 <!-- ========== PAGE 2 ========== -->
<div class="page">
  <!-- Top Right Logo -->
 <div class="headers">
    <div class="header-lefts">
    <img 
      src="/assets/images/auth/forgot-pass-img.png" 
      style="max-width: 150px; height: auto;" 
    />
  </div>
</div>  

  <!-- Content -->
  <div class="content">

    <!-- Section 2 -->
    <p class="section-title">
      2. Period of Service
    </p>

    <div style="margin-left: 30px; font-size: 16px;">

      <p class="list-item">You are required to sign a one-year training-cum-service agreement.</p>
      <p class="list-item">A six-month probation period will apply. Your performance will be assessed before confirmation.</p>
     <p class="list-item">If performance is unsatisfactory, probation may be extended or employment terminated.</p>
      <p class="list-item">Additional: Breach of the service agreement during this period may result in legal consequences or compensation recovery.</p>
    </div>

    <!-- Section 3 -->
 <p class="section-title">
       3. Hours of Work
    </p>
          <div style="margin-left: 30px; font-size: 16px;">      <p class="list-item">Workdays: 5 days/week. Working hours depend on your project or client location.</p>
      <p class="list-item">Shift work or weekend duty may be required.</p>
      <p class="list-item">The company does not provide overtime compensation.</p>
      <p class="list-item">Additional: Flexible work arrangements may be granted based on managerial approval and project requirements.</p>
    </div>

    <!-- Section 4 -->
<p class="section-title">
      4. Leaves & Holidays
    </p>
          <div style="margin-left: 30px; font-size: 16px;">
      <p class="list-item">You are entitled to 18 days of leave per year (12 paid + 6 casual), pro-rated from the date of joining.</p>
      <p class="list-item">Earned leaves are credited monthly and can be en-cashed as per policy.</p>
      <p class="list-item">Holidays depend on the location of your posting.</p>
      <p class="list-item">Additional: All leave requests must be applied through the company leave management system.</p>
    </div>

    <!-- Section 5 -->
    <p class="section-title">
      5. Unauthorized Absence from Work
    </p>
          <div style="margin-left: 30px; font-size: 16px;">
      <p class="list-item">
        Any unauthorized absence for three or more consecutive days will be deemed as absconding and may result in disciplinary action or legal proceedings.
      </p>
    </div>

  </div>

  <!-- Footer -->
        <div class="footer">
          <div class="company-footer-text">
      ${companyName}
    </div>
      ${companyAddress}

  </div>

</div>


      <!-- ========== PAGE 3 ========== -->
      <div class="page">

  <!-- Header -->
        <div class="headers">
    <div class="header-lefts">
      <img 
        src="/assets/images/auth/forgot-pass-img.png" 
        style="max-width: 150px; height: auto;" 
      />
    </div>
  </div>

  <!-- Content -->
   <div class="content">

    <!-- 6. Disputes -->
    <p class="section-title">
      6. Disputes
    </p>

          <div style="margin-left: 30px; font-size: 16px;">
                <p class="list-item">
        All employment matters shall be governed in accordance with Indian laws, 
        including but not limited to the Indian Contract Act, 1872 and the relevant 
        State Shops and Establishments Act. The Company encourages amicable 
        resolution of disputes through internal grievance redressal mechanisms 
        or arbitration before initiating litigation.
      </p>
      <p class="list-item">
        Legal disputes will fall under Hyderabad jurisdiction unless otherwise 
        specified for overseas assignments.
      </p>
      <p class="list-item">
        In case of non-compete violations, the company may seek damages and 
        injunctive relief.
      </p>
      <p class="list-item">
        Additional: Disputes should first be addressed through mediation or 
        arbitration before legal recourse.
      </p>
    </div>

    <!-- 7. Background Verification -->
    <p class="section-title">
      7. Background Verification
    </p>

          <div style="margin-left: 30px; font-size: 16px;">
                <p class="list-item">
        All background checks will be carried out in compliance with relevant 
        privacy laws. Drug screening, if performed, shall follow best practices 
        and medical confidentiality standards. You are expected to disclose any 
        prior legal issues or employment history honestly as per company norms.
      </p>
      <p class="list-item">
        The Company reserves the right to carry out reference verifications or 
        background checks prior to your joining the Company or during the course 
        of your engagement with this Company. Such background checks and 
        reference verifications, amongst others, would include past engagement 
        and salary (this will include your immediate previous engagement), 
        criminal records, countries resided in or worked in, etc. The Company 
        reserves the right to carry out banned/illegal drugs/narcotics substance 
        screening tests on you at any point of time during your engagement. 
        You understand and acknowledge that this is a requirement and you 
        have no objections whatsoever if such checks and verifications are 
        carried out by the Company or a third party agency engaged by the Company.
      </p>
    </div>

  </div>

  <!-- Footer -->
  <div class="footer">
     <div class="company-footer-text">
      ${companyName}
    </div>

      ${companyAddress}
  </div>

</div>


      <!-- ========== PAGE 4 ========== -->
      <div class="page">
        <div class="headers">
    <div class="header-lefts">
      <img 
        src="/assets/images/auth/forgot-pass-img.png" 
        style="max-width: 180px; height: auto;" 
      />
    </div>
        </div>

<div class="content">

  <!-- Bullet: Verification Clause -->
          <div style="margin-left: 30px; font-size: 16px;">
              <p class="list-item">
      In verification, the information furnished by you in your application is 
      misstated or documents submitted by you are not correct or banned/illegal 
      drugs/narcotics substance screening test results are positive, the Company 
      shall, at its sole discretion, be entitled to forthwith terminate and/or revoke 
      your engagement with the Company, without further reference in the matter. 
      Further, termination under this Clause will not confer on you any right to 
      stake claim of any kind of compensation from the Company.
    </p>
  </div>

  <!-- Section Title -->
  <p class="section-title">
    8. Termination of Employment
  </p>

  <!-- Bullet: Termination Clause -->
          <div style="margin-left: 30px; font-size: 16px;">
              <p class="list-item">
      Termination may be initiated by either party by serving the required notice 
      period as defined under the applicable provisions of the Industrial Disputes Act, 
      1947. Misconduct, fraud, or willful breach of company policy will lead to 
      summary dismissal without notice, subject to disciplinary procedures.
    </p>

    <!-- Bullet: Separation Policy -->
    <p class="list-item">
      Separation Policy
      <ol style="margin-top:8px; padding-left:20px;">
        <li style="margin-bottom:6px;">
          You are required to serve a notice period of two months prior to separation. 
          Failure to serve the notice period will require payment equivalent to your 
          gross salary.
        </li>
        <li style="margin-bottom:6px;">
          The employee must pay the gross salary in lieu of the notice period.
        </li>
        <li style="margin-bottom:6px;">
          Should you choose to resign before completing the stipulated service period, 
          you will be required to pay an amount of INR 2,00,000 in compensation for 
          breaching the service agreement, in addition to serving a notice period of 
          two months or paying equivalent gross salary in lieu thereof.
        </li>
      </ol>
    </p>

    <!-- Final Bullet -->
    <p class="list-item">
      However, should you sign any service agreement with the Company as part of 
      your employment process or later in the course of your employment, you will 
      not be entitled to terminate your employment unless you comply with the 
      terms and conditions of the agreement in addition to the above.
    </p>
  </div>

</div>
        
        <div class="footer">
          <div class="company-footer-text">${companyName}</div>
          ${companyAddress}
        </div>
      </div>

      <!-- ========== PAGE 5 ========== -->
      <div class="page">
        <div class="headers">
    <div class="header-lefts">
      <img 
        src="/assets/images/auth/forgot-pass-img.png" 
        style="max-width: 180px; height: auto;" 
      />
    </div>
        </div>

<div class="content">

  <!-- Bullet 1 -->
          <div style="margin-left: 30px; font-size: 16px;">
               <p class="list-item">
      Any employee leaving the organization before completion of Service agreement 
      from his/her Date of joining will be liable for recovery of any kind of payments 
      made to him at the time of joining (Joining Bonus, Notice Period Payment, 
      Relocation Expenses and any other payment made at the time of joining).
    </p>

    <!-- Bullet 2 with Nested Numbered List -->
     <p class="list-item">
      The company shall have the right to terminate this agreement forthwith, 
      without any notice and without any salary in lieu of notice period 
      in the event of any of the following:
      
      <ol style="margin-top: 8px; padding-left: 20px;">
        <li style="margin-bottom: 6px;">
          Breach on your part of any terms and conditions of this contract and 
          any other rules made applicable to you in respect of your employment with us.
        </li>
        <li style="margin-bottom: 6px;">
          Violation on your part of the company's rule with regards to the 
          authenticity and information declared at the time of joining.
        </li>
        <li style="margin-bottom: 6px;">
          Any misconduct or failure to carry out any of your duties, 
          confidential data and obligations.
        </li>
      </ol>
    </p>
  </div>

  <!-- Section 9 -->
    <p class="section-title">
    9. General Terms & Conditions
  </p>

   <div style="margin-left: 30px; font-size: 12px;">
     <p class="list-item">
      You may be transferred between locations, departments, or entities 
      within the organization.
    </p>
     <p class="list-item">
      You must comply with all policies and procedures in force or introduced later.
    </p>
     <p class="list-item">
      Additional: Any changes to your contact details or personal information 
      must be updated with HR immediately.
    </p>
  </div>

  <!-- Section 10 -->
    <p class="section-title">
    10. Job Description / Role Expectations
  </p>

          <div style="margin-left: 30px; font-size: 16px;">
               <p class="list-item">
      You will handle software development, including coding, testing, debugging, 
      and working in a collaborative environment.
    </p>
     <p class="list-item">
      Detailed job responsibilities will be assigned by your reporting manager.
    </p>
  </div>

</div>
        
        <div class="footer">
          <div class="company-footer-text">${companyName}</div>
          ${companyAddress}
        </div>
      </div>

      <!-- ========== PAGE 6 ========== -->
      <div class="page">
        <div class="headers">
    <div class="header-lefts">
      <img 
        src="/assets/images/auth/forgot-pass-img.png" 
        style="max-width: 180px; height: auto;" 
      />
    </div>
        </div>

<div class="content">

      <p class="section-title">

    11. Reporting Authority
  </p>

          <div style="margin-left: 30px; font-size: 16px;">
                <p class="list-item">
      You will report to your Team Lead or any other authority designated by the company.
    </p>
  </div>

  <p class="section-title">
    12. Code of Conduct / Ethics Clause
  </p>

          <div style="margin-left: 30px; font-size: 16px;">
                <p class="list-item">
      In accordance with the Sexual Harassment of Women at Workplace 
      (Prevention, Prohibition and Redressal) Act, 2013, you are required 
      to comply fully with the Company’s Anti-Sexual Harassment Policy. 
      Violations will result in disciplinary action, which may include 
      termination as per the provisions under the Industrial Employment 
      (Standing Orders) Act and relevant state Shops & Establishments Acts.
    </p>
     <p class="list-item">
      You are expected to maintain high standards of ethics and professionalism.
    </p>
     <p class="list-item">
      You must adhere to the Code of Conduct, Anti-Sexual Harassment Policy, 
      and other policies.
    </p>
     <p class="list-item">
      Additional: Violations will result in disciplinary actions, 
      up to and including termination.
    </p>
  </div>

  <p class="section-title">
    13. Confidentiality & Data Protection Clause
  </p>

          <div style="margin-left: 30px; font-size: 16px;">

     <p class="list-item">
      All inventions, software, processes, source code, documentation, 
      or improvements conceived or developed during the course of employment 
      are deemed to be the exclusive intellectual property of the Company 
      and/or its clients. You are also required to strictly comply with 
      the Information Technology Act, 2000, and its amendments related 
      to data privacy and cybersecurity.
    </p>
   <p class="list-item">
      You must not disclose any confidential, proprietary, or 
      customer-related information during or after your employment.
    </p>
    <p class="list-item">
      All work products (software, systems, ideas) developed during 
      your tenure belong to Levitica Technologies or its clients.
    </p>
  </div>

</div>

        
        <div class="footer">
          <div class="company-footer-text">${companyName}</div>
          ${companyAddress}
        </div>
      </div>

      <!-- ========== PAGE 7 ========== -->
      <div class="page">
        <div class="headers">
    <div class="header-lefts">
      <img 
        src="/assets/images/auth/forgot-pass-img.png" 
        style="max-width: 180px; height: auto;" 
      />
    </div>
        </div>

        <div class="content">
  <p class="section-title">
    14. Health & Wellness Policy
  </p>

          <div style="margin-left: 30px; font-size: 16px;">
                <p class="list-item">Levitica promotes a healthy and inclusive workplace.</p>
    <p class="list-item">You are encouraged to participate in wellness initiatives and access HR support for health issues.</p>
    <p class="list-item">Additional: Mental health and preventive healthcare services may be offered via wellness partners.</p>
  </div>


  <p class="section-title">
    15. Final Clauses
  </p>

          <div style="margin-left: 30px; font-size: 16px;">     <p class="list-item">Full and final settlement will be processed within 45 days from your last working day.</p>
     <p class="list-item">PAN submission is mandatory; failure will result in TDS deduction at higher rates.</p>
     <p class="list-item">You must devote your full time and attention to company business.</p>
     <p class="list-item">This letter is governed by company policy, and Levitica reserves the right to modify any part of it.</p>
  </div>

  <!-- Welcome Text -->
  <p style="margin-top: 20px;">
    We take this opportunity to welcome you to the Levitica family and wish you a 
    satisfying engagement with us.
  </p>

  <!-- Acceptance -->
  <p class="section-title" style="color:#1f4e8c; font-weight:700; margin-top:25px;">
    Acceptance of Joining
  </p>

  <p>
    The terms and conditions of this Appointment Letter are fully acceptable to me.
    I shall report for duties on ____________________.
  </p>

    <p style="margin-top: 25px;">
      Sincerely,<br>
      <strong>For Levitica Technologies Pvt. Ltd</strong>
    </p>
          
  <div style="margin-top: 35px; display: flex; justify-content: space-between;">

    <div style="width: 45%;">
      <p>Sincerely,</p>
      <p><strong>For Levitica Technologies Pvt. Ltd</strong></p>
      <br><br>
      <p>Authorized Signature:</p>
    </div>

    <div style="width: 45%; text-align: right;">
      <p>Employee Name</p>
      <br><br><br>
      <p>Employee Signature</p>
    </div>

  </div>
        </div>
        
        <div class="footer">
          <div class="company-footer-text">${companyName}</div>
          ${companyAddress}
        </div>
      </div>

      <!-- ========== PAGE 8 - Annexure A ========== -->
      <div class="page">
        <div class="headers">
    <div class="header-lefts">
      <img 
        src="/assets/images/auth/forgot-pass-img.png" 
        style="max-width: 180px; height: auto;" 
      />
    </div>
        </div>

        <div class="content">
          <p class="section-title">Annexure - A</p>
          
          <p><span class="bold">Compensation Breakup</span></p>
          
          <p><span class="bold">Annual CTC: INR ${ctc}</span></p>
          
        <table class="annexure-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
${validBreakupItems.map(item => `
  <tr>
    <td>${item.label}</td>
    <td>${formatAmount(item.amount)}</td>
  </tr>
`).join('')}

            <tr class="total-row">
              <td><strong>Total Fixed CTC</strong></td>
              <td><strong>${formatAmount(calculatedTotal)}</strong></td>
            </tr>
          </tbody>
        </table>

       <div class="content">
  <p><strong>Note:</strong></p>
  <div style="margin-left: 30px; font-size: 12px;">
    <p class="list-item">This offer carries a 6-month probation period. Salary will not be revised post confirmation; any salary hike will be considered only after completion of one year.</p>
    <p class="list-item">Health insurance premiums, if opted, will be deducted accordingly.</p>
    <p class="list-item">Annual performance bonus is discretionary and not payable on a pro-rata basis for incomplete cycles.</p>
    <p class="list-item">Salary structure is confidential and should not be disclosed.</p>
  </div>

  <p style="margin-top:20px;">Sincerely,</p>
  <p><strong>For Levitica Technologies Pvt. Ltd</strong></p>

  <div class="signature-row">
    <div class="left-sign">
      <img src="/assets/images/signature.png" style="height:70px;" />
      <p>Authorized Signature</p>
    </div>

    <div class="right-sign">
      <p>Employee Name</p>
      <br><br>
      <p>Employee Signature</p>
    </div>
  </div>
</div>

          
        </div>
        
        <div class="footer">
          <div class="company-footer-text">${companyName}</div>
          ${companyAddress}
        </div>
      </div>
    </body>
    </html>
  `;

  // Configure html2pdf options - REMOVED pagebreak config to avoid double pages
  const opt = {
    margin: [0, 0, 0, 0],
    filename: `Offer_Letter_${candidateName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      letterRendering: true,
      useCORS: true,
      logging: false,
      dpi: 300
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    }
  };

  // Generate and download PDF
  html2pdf().set(opt).from(element).save();
};

const generateEmailContent = (offer) => {
  const joiningDate = new Date(offer.joiningDate).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return {
    subject: `Offer Letter - ${offer.position} | Levitica Technologies Pvt. Ltd.`,

    body: `
Dear Mr. ${offer.candidateName},

We are pleased to offer you the position of ${offer.position} at Levitica Technologies Pvt. Ltd. Please find your offer letter attached to this email.

Your skills and background align well with our expectations, and we are confident that you will be a valuable addition to our team. As mentioned in the offer, your joining date is ${joiningDate}.

We kindly request you to carefully review the attached offer letter. If you accept the terms and conditions outlined, please sign the document and send a scanned copy to us at your earliest convenience to confirm your acceptance.

On-boarding Location:
Please report to Office #407 for the on-boarding process. Our team will be available there to assist you.
Levitica Technologies Pvt.Ltd,
Office #407 & #409, 4th Floor,
Jain Sadguru Image’s,
Capital Park Road, Ayyappa Society,
VIP Hills, Madhapur,
Hyderabad, Telangana – 500081.

Note:
Please carry your original certificates including your 10th and Intermediate mark sheets for verification along with Xerox copies.
Bring one passport-size photograph (hard copy + soft copy).

Should you have any questions or need clarification, please feel free to reach out.

We look forward to welcoming you to the Levitica family and beginning an exciting journey of growth and innovation together.

Best Regards,
HR Team
Levitica Technologies Pvt. Ltd.
hr@leviticatechnologies.com
    `,
  };
};

// Helper functions for CTC calculations
const parseAmount = (value) => {
  if (!value) return 0;
  return parseFloat(value.toString().replace(/,/g, '')) || 0;
};

const formatAmount = (amount) => {
  return amount.toLocaleString('en-IN');
};

const calculateGrossSalary = (breakup) => {
  const gross = 
    parseAmount(breakup.basic) +
    parseAmount(breakup.hra) +
    parseAmount(breakup.specialAllowance) +
    parseAmount(breakup.conveyance) +
    parseAmount(breakup.telephoneAllowance) +
    parseAmount(breakup.medicalAllowance);
  
  return formatAmount(gross);
};

const calculateTotalDeductions = (breakup) => {
  const deductions = 
    parseAmount(breakup.employeePF) +
    parseAmount(breakup.professionalTax) +
    parseAmount(breakup.gratuityEmployee);
  
  return deductions;
};

const calculateNetTakeHome = (breakup) => {
  const gross = 
    parseAmount(breakup.basic) +
    parseAmount(breakup.hra) +
    parseAmount(breakup.specialAllowance) +
    parseAmount(breakup.conveyance) +
    parseAmount(breakup.telephoneAllowance) +
    parseAmount(breakup.medicalAllowance);
  
  const deductions = calculateTotalDeductions(breakup);
  const netTakeHome = gross - deductions;
  
  return formatAmount(netTakeHome);
};

const calculateTotalMonthlyCTC = (breakup) => {
  const gross = 
    parseAmount(breakup.basic) +
    parseAmount(breakup.hra) +
    parseAmount(breakup.specialAllowance) +
    parseAmount(breakup.conveyance) +
    parseAmount(breakup.telephoneAllowance) +
    parseAmount(breakup.medicalAllowance);
  
  const employerContributions = 
    parseAmount(breakup.employerPF) +
    parseAmount(breakup.groupInsurance) +
    parseAmount(breakup.gratuityEmployer);
  
  const totalMonthlyCTC = gross + employerContributions;
  
  return formatAmount(totalMonthlyCTC);
};

const calculateAnnualCTC = (breakup) => {
  const monthlyCTC = parseAmount(calculateTotalMonthlyCTC(breakup).replace(/,/g, ''));
  const annualCTC = monthlyCTC * 12;
  return formatAmount(annualCTC);
};
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newOffer = {
      id: selectedOffer ? selectedOffer.id : offers.length + 1,
      ...formData,
      offerStatus: selectedOffer
        ? selectedOffer.offerStatus
        : OFFER_STATUS.DRAFT,
      createdDate: selectedOffer
        ? selectedOffer.createdDate
        : new Date().toISOString().split("T")[0],
      approvedBy: selectedOffer ? selectedOffer.approvedBy : "HR Admin",
      lastModified: new Date().toISOString(),
      bgvStatus: "pending",
      history: selectedOffer
        ? selectedOffer.history
        : [
            {
              action: "Offer Created",
              by: "HR Admin",
              date: new Date().toISOString(),
              status: OFFER_STATUS.DRAFT,
            },
          ],
    };

    if (selectedOffer) {
      // Update existing offer
      setOffers(offers.map((o) => (o.id === selectedOffer.id ? newOffer : o)));
    } else {
      // Create new offer
      setOffers([newOffer, ...offers]);
    }

    setShowForm(false);
    resetForm();
  };

  // Reset form
const resetForm = () => {
  setFormData({
    candidateName: "",
    email: "",
    phone: "",
    position: "",
    fatherName: "",
    relation: "select", // Make sure this matches the initial value
    department: "Engineering",
    grade: "L1",
    experience: "",
    noticePeriod: "30 days",
    candidateSource: "",
    customSource: "",
    referralDetails: {
      employeeId: "",
      role: "",
      designation: "",
      experience: ""
    },
    gender: "male",
    // Address Information
    address: {
      street: "",
      city: "",
      district: "",
      state: "",
      customState: "",
      pincode: ""
    },
    // Guardian Information
    customRelation: "",
    guardianGender: "",
    guardianPhone: "",
    isLegalGuardian: false,
    ctc: "",
    ctcBreakup: {
      basic: "",
      hra: "",
      specialAllowance: "",
      conveyance: "",
      telephoneAllowance: "",
      medicalAllowance: "",
      employeePF: "",
      professionalTax: "",
      gratuityEmployee: "",
      employerPF: "",
      groupInsurance: "",
    },
    joiningDate: "",
    offerType: "Full-time",
    template: "standard",
    terms: `1. This offer is subject to background verification.
2. You will be on probation for 3 months.
3. Standard company policies apply.
4. Please acknowledge acceptance by the expiry date.`,
    approvalWorkflow: "direct",
    expiryDate: "",
    notes: "",
    interviewSummary: "",
    salaryNegotiationHistory: "",
    enableBGV: true,
    requireDigitalSignature: false,
    businessUnit: "",
    location: "",
    costCenter: "",
    shiftPolicy: "",
    weekOffPolicy: "",
  });
  setSelectedOffer(null);
};

  // CRUD Operations
const handleEdit = (offer) => {
  setSelectedOffer(offer);
  
  setFormData({
    candidateName: "",
    email: "",
    phone: "",
    position: "",
    department: "Engineering",
    grade: "L1",
    experience: "",
    noticePeriod: "30 days",
    candidateSource: "",
    customSource: "",
    ctc: "",
    gender: "male",
    relation: "select",
    fatherName: "",
    customRelation: "",
    guardianGender: "",
    guardianPhone: "",
    isLegalGuardian: false,
    joiningDate: "",
    offerType: "Full-time",
    template: "standard",
    terms: `1. This offer is subject to background verification.
2. You will be on probation for 3 months.
3. Standard company policies apply.
4. Please acknowledge acceptance by the expiry date.`,
    approvalWorkflow: "direct",
    expiryDate: "",
    notes: "",
    interviewSummary: "",
    salaryNegotiationHistory: "",
    enableBGV: true,
    requireDigitalSignature: false,
    businessUnit: "",
    location: "",
    costCenter: "",
    shiftPolicy: "",
    weekOffPolicy: "",
    ...offer,
    address: {
      street: "",
      city: "",
      district: "",
      state: "",
      customState: "",
      pincode: "",
      ...(offer.address || {})
    },
    referralDetails: {
      employeeId: "",
      role: "",
      designation: "",
      experience: "",
      ...(offer.referralDetails || {})
    },
    ctcBreakup: {
      basic: "",
      hra: "",
      specialAllowance: "",
      conveyance: "",
      telephoneAllowance: "",
      medicalAllowance: "",
      employeePF: "",
      professionalTax: "",
      gratuityEmployee: "",
      employerPF: "",
      groupInsurance: "",
      ...(offer.ctcBreakup || {})
    }
  });
  
  setShowForm(true);
};

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setOffers(offers.filter((offer) => offer.id !== id));
    }
  };

  const handleSendOffer = (offer) => {
    setSelectedOffer(offer);
    setShowSendModal(true);
  };

  const handleConfirmSendOffer = () => {
    if (!selectedOffer) return;

    const updatedOffers = offers.map((o) =>
      o.id === selectedOffer.id
        ? {
            ...o,
            offerStatus: OFFER_STATUS.SENT,
            emailSent: emailSettings.sendEmail,
            emailSentDate: emailSettings.sendEmail
              ? new Date().toISOString()
              : null,
            smsSent: emailSettings.sendSMS,
            smsSentDate: emailSettings.sendSMS
              ? new Date().toISOString()
              : null,
            history: [
              ...o.history,
              {
                action: "Sent to Candidate",
                by: "System",
                date: new Date().toISOString(),
                status: OFFER_STATUS.SENT,
                details: {
                  emailSent: emailSettings.sendEmail,
                  smsSent: emailSettings.sendSMS,
                },
              },
            ],
          }
        : o,
    );
    setOffers(updatedOffers);

    // Simulate email/SMS sending
    if (emailSettings.sendEmail) {
      setTimeout(() => {
        console.log(`Email sent to: ${selectedOffer.email}`);
        console.log("Subject: Offer Letter - " + selectedOffer.position);
        console.log("Body: Please find attached your offer letter...");
      }, 500);
    }

    if (emailSettings.sendSMS) {
      setTimeout(() => {
        console.log(`SMS sent to: ${selectedOffer.phone}`);
        console.log(
          "Message: Your offer letter has been sent to your email. Please check and respond.",
        );
      }, 500);
    }

    setShowSendModal(false);
    setEmailSettings({
      sendEmail: true,
      sendSMS: false,
      ccRecipients: [],
      emailTemplate: "standard",
    });
    alert(
      `Offer sent to ${selectedOffer.candidateName}${emailSettings.sendEmail ? " via email" : ""}${emailSettings.sendSMS ? " and SMS" : ""}`,
    );
  };

  const handleAcceptOffer = (offer) => {
    if (offer.requireDigitalSignature) {
      setSelectedOffer(offer);
      setShowESignatureModal(true);
    } else {
      const updatedOffers = offers.map((o) =>
        o.id === offer.id
          ? {
              ...o,
              offerStatus: OFFER_STATUS.ACCEPTED,
              acceptanceDate: new Date().toISOString(),
              history: [
                ...o.history,
                {
                  action: "Accepted by Candidate",
                  by: "Candidate",
                  date: new Date().toISOString(),
                  status: OFFER_STATUS.ACCEPTED,
                },
              ],
            }
          : o,
      );
      setOffers(updatedOffers);
      alert(`Offer accepted by ${offer.candidateName}`);
    }
  };

  const handleConfirmESignature = () => {
    if (!selectedOffer) return;

    const signatureData = {
      candidateSignature:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", // Mock signature
      signatureDate: new Date().toISOString(),
      ipAddress: "192.168.1.1", // Mock IP
      deviceInfo: navigator.userAgent,
    };

    const updatedOffers = offers.map((o) =>
      o.id === selectedOffer.id
        ? {
            ...o,
            offerStatus: OFFER_STATUS.ACCEPTED,
            acceptanceDate: new Date().toISOString(),
            eSignature: signatureData,
            history: [
              ...o.history,
              {
                action: "Accepted by Candidate (E-Signed)",
                by: "Candidate",
                date: new Date().toISOString(),
                status: OFFER_STATUS.ACCEPTED,
                details: {
                  signatureDate: signatureData.signatureDate,
                  ipAddress: signatureData.ipAddress,
                },
              },
            ],
          }
        : o,
    );
    setOffers(updatedOffers);
    setShowESignatureModal(false);
    setESignatureData({
      candidateSignature: null,
      signatureDate: null,
      ipAddress: null,
      deviceInfo: null,
    });
    alert(
      `Offer accepted and digitally signed by ${selectedOffer.candidateName}`,
    );
  };

  const handleDeclineOffer = (offer) => {
    setSelectedOffer(offer);
    setShowDeclineModal(true);
  };

  const handleConfirmDecline = () => {
    if (!selectedOffer || !declineReason.trim()) {
      alert("Please provide a reason for declining the offer");
      return;
    }

    const updatedOffers = offers.map((o) =>
      o.id === selectedOffer.id
        ? {
            ...o,
            offerStatus: OFFER_STATUS.DECLINED,
            declineReason: declineReason,
            history: [
              ...o.history,
              {
                action: "Declined by Candidate",
                by: "Candidate",
                date: new Date().toISOString(),
                status: OFFER_STATUS.DECLINED,
                details: {
                  reason: declineReason,
                },
              },
            ],
          }
        : o,
    );
    setOffers(updatedOffers);
    setShowDeclineModal(false);
    setDeclineReason("");
    alert(
      `Offer declined by ${selectedOffer.candidateName}. Reason: ${declineReason}`,
    );
  };


const handleWithdrawOffer = (offer) => {
  setSelectedOffer(offer);
  setShowWithdrawModal(true);
};

  const handleCreateRevisedOffer = (offer) => {
    const newVersion = offer.version + 1;
    const revisedOffer = {
      ...offer,
      id: offers.length + 1,
      version: newVersion,
      offerStatus: OFFER_STATUS.DRAFT,
      createdDate: new Date().toISOString().split("T")[0],
      history: [
        ...offer.history,
        {
          action: `Revised Offer Created (v${newVersion})`,
          by: "HR Admin",
          date: new Date().toISOString(),
          status: OFFER_STATUS.DRAFT,
          details: {
            previousVersion: offer.version,
            reason: "Offer revision requested",
          },
        },
      ],
      versionHistory: [
        ...(offer.versionHistory || []),
        {
          version: offer.version,
          date: offer.createdDate,
          status: offer.offerStatus,
          ctc: offer.ctc,
        },
      ],
    };
    setOffers([revisedOffer, ...offers]);
    setSelectedOffer(revisedOffer);
    setShowForm(true);
    alert(
      `Revised offer (v${newVersion}) created. You can now edit the details.`,
    );
  };

  const handleApproveOffer = (offer, level) => {
    const workflow = offer.approvalWorkflow || {
      workflowId: "direct",
      currentStep: 1,
      steps: [
        {
          level: 1,
          role: "Direct Manager",
          status: "pending",
          approvedBy: null,
          approvedDate: null,
          comments: null,
        },
        {
          level: 2,
          role: "HR Manager",
          status: "pending",
          approvedBy: null,
          approvedDate: null,
          comments: null,
        },
      ],
    };

    const updatedSteps = workflow.steps.map((step) => {
      if (step.level === level) {
        return {
          ...step,
          status: "approved",
          approvedBy: "Current User",
          approvedDate: new Date().toISOString(),
        };
      }
      return step;
    });

    const allApproved = updatedSteps.every(
      (step) => step.status === "approved",
    );
    const newStatus = allApproved
      ? OFFER_STATUS.APPROVED
      : OFFER_STATUS.PENDING_APPROVAL;

    const updatedOffers = offers.map((o) =>
      o.id === offer.id
        ? {
            ...o,
            offerStatus: newStatus,
            approvalWorkflow: {
              ...workflow,
              currentStep: level + 1,
              steps: updatedSteps,
            },
            history: [
              ...o.history,
              {
                action: `Approved by ${workflow.steps.find((s) => s.level === level)?.role}`,
                by: "Current User",
                date: new Date().toISOString(),
                status: newStatus,
              },
            ],
          }
        : o,
    );
    setOffers(updatedOffers);
    alert(
      `Offer approved at level ${level}. ${allApproved ? "All approvals complete!" : "Pending further approvals."}`,
    );
  };

  // Filter offers
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || offer.offerStatus === filters.status;
    const matchesDepartment =
      filters.department === "all" || offer.department === filters.department;
    const matchesOfferType =
      filters.offerType === "all" || offer.offerType === filters.offerType;

    return (
      matchesSearch && matchesStatus && matchesDepartment && matchesOfferType
    );
  });

  // Get offers by status for tabs
  const getOffersByStatus = (status) => {
    if (status === "all") return filteredOffers;
    return filteredOffers.filter((offer) => offer.offerStatus === status);
  };

  // Get status color and text
  const getStatusConfig = (status) => {
    switch (status) {
      case OFFER_STATUS.DRAFT:
        return {
          color: "primary",
          text: "Draft",
          icon: "heroicons:document-text",
        };
      case OFFER_STATUS.PENDING_APPROVAL:
        return {
          color: "warning",
          text: "Pending Approval",
          icon: "heroicons:clock",
        };
      case OFFER_STATUS.APPROVED:
        return {
          color: "info",
          text: "Approved",
          icon: "heroicons:check-circle",
        };
      case OFFER_STATUS.SENT:
        return {
          color: "secondary",
          text: "Sent",
          icon: "heroicons:paper-airplane",
        };
      case OFFER_STATUS.ACCEPTED:
        return {
          color: "success",
          text: "Accepted",
          icon: "heroicons:check-badge",
        };
      case OFFER_STATUS.DECLINED:
        return {
          color: "danger",
          text: "Declined",
          icon: "heroicons:x-circle",
        };
      case OFFER_STATUS.EXPIRED:
        return { color: "dark", text: "Expired", icon: "heroicons:clock" };
      case OFFER_STATUS.WITHDRAWN:
        return {
          color: "danger",
          text: "Withdrawn",
          icon: "heroicons:arrow-uturn-left",
        };
      default:
        return {
          color: "secondary",
          text: "Unknown",
          icon: "heroicons:question-mark-circle",
        };
    }
  };
  // Calculate statistics
  const calculateStats = () => {
    return {
      total: offers.length,
      draft: offers.filter((o) => o.offerStatus === OFFER_STATUS.DRAFT).length,
      pending: offers.filter(
        (o) => o.offerStatus === OFFER_STATUS.PENDING_APPROVAL,
      ).length,
      sent: offers.filter((o) => o.offerStatus === OFFER_STATUS.SENT).length,
      accepted: offers.filter((o) => o.offerStatus === OFFER_STATUS.ACCEPTED)
        .length,
      declined: offers.filter((o) => o.offerStatus === OFFER_STATUS.DECLINED)
        .length,
      expired: offers.filter((o) => o.offerStatus === OFFER_STATUS.EXPIRED)
        .length,
    };
  };
  // Calculate acceptance rate
  const calculateAcceptanceRate = () => {
    const stats = calculateStats();
    return stats.total > 0
      ? ((stats.accepted / stats.total) * 100).toFixed(1)
      : "0.0";
  };

  // Render CTC breakup
  const renderCTCBreakup = (breakup) => {
    if (!breakup) return null;
    return (
      <div className="mt-2 small">
        {Object.entries(breakup).map(([key, value]) => (
          <div key={key} className="d-flex justify-content-between">
            <span>
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
              :
            </span>
            <span className="fw-bold">₹{value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render offer history
  const renderHistory = (history) => {
    if (!history || history.length === 0) return null;
    return (
      <div className="mt-2 small">
        {history.slice(-3).map((item, index) => (
          <div key={index} className="text-muted mb-1">
            <small>
              {item.action} by {item.by} at{" "}
              {new Date(item.date).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    );
  };
  // Calculate stats and acceptance rate for use in JSX
  const stats = calculateStats();
  const acceptanceRate = calculateAcceptanceRate();
  return (
    <>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="text-3xl fw-bold text-dark mb-2 mt-3 d-flex align-items-center gap-2">
              <Icon icon='heroicons:document-check' />
              Offer Management
            </h5>
            <p className="text-muted">
              Manage candidate offers and onboarding process
            </p>
          </div>
          <button
            className="create-job-btn"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Icon icon="heroicons:plus" className="me-2" />
            Create New Offer
          </button>
        </div>

        
        {/* Statistics Dashboard */}
        <div className="kpi-row">
  {[
    {
      title: "Total Offers",
      value: stats.total,
      icon: "heroicons:document-text",
      bg: "kpi-primary",
      color: "kpi-primary-text",
    },
    {
      title: "Draft",
      value: stats.draft,
      icon: "heroicons:pencil-square",
      bg: "kpi-info",
      color: "kpi-info-text",
    },
    {
      title: "Pending Approval",
      value: stats.pending,
      icon: "heroicons:clock",
      bg: "kpi-warning",
      color: "kpi-warning-text",
    },
    {
      title: "Sent",
      value: stats.sent,
      icon: "heroicons:paper-airplane",
      bg: "kpi-info",
      color: "kpi-info-text",
    },
    {
      title: "Accepted",
      value: stats.accepted,
      icon: "heroicons:check-circle",
      bg: "kpi-success",
      color: "kpi-success-text",
    },
    {
      title: "Declined",
      value: stats.declined,
      icon: "heroicons:x-circle",
      bg: "kpi-warning",
      color: "kpi-warning-text",
    },
  ].map((item, index) => (
    <div className="kpi-col" key={index}>
      <div className="kpi-card">
        <div className="kpi-card-body">

          {/* Icon */}
          <div className={`kpi-icon ${item.bg}`}>
            <Icon icon={item.icon} className={`kpi-icon-style ${item.color}`} />
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

        {/* Filters and Tabs */}
        <div className="card border shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2 mb-3">
              {["all", ...Object.values(OFFER_STATUS)].map((status) => {
                const statusConfig =
                  status === "all"
                    ? {
                        color: "primary",
                        text: "All Offers",
                        icon: "heroicons:queue-list",
                      }
                    : getStatusConfig(status);
                return (
                  <button
                    key={status}
                    className="job-listings-btn"
                    onClick={() => setActiveTab(status)}
                  >
                    <Icon icon={statusConfig.icon} className="me-1" />
                    {status === "all" ? "All Offers" : statusConfig.text}
                    {status !== "all" && (
                      <span className="badge bg-light text-dark ms-1">
                        {offers.filter((o) => o.offerStatus === status).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <Icon icon="heroicons:magnifying-glass" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search candidates, position, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="all">All Status</option>
                  {Object.entries(OFFER_STATUS).map(([key, value]) => (
                    <option key={value} value={value}>
                      {key.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.department}
                  onChange={(e) =>
                    setFilters({ ...filters, department: e.target.value })
                  }
                >
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.offerType}
                  onChange={(e) =>
                    setFilters({ ...filters, offerType: e.target.value })
                  }
                >
                  <option value="all">All Offer Types</option>
                  {OFFER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Offers Table */}
        <div className="card border shadow-sm mb-4">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading offers...</p>
              </div>
            ) : getOffersByStatus(activeTab).length === 0 ? (
  <div className="text-center py-5">
    <div className="d-flex justify-content-center mb-3">
      <Icon
        icon="heroicons:document-magnifying-glass"
        width="40"
        height="40"
        className="text-secondary"
      />
    </div>
    <p className="text-muted mb-0">No offers found</p>
  </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Position & Department</th>
                      <th>Offer Details</th>
                      <th>Status & Timeline</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getOffersByStatus(activeTab).map((offer) => {
                      const statusConfig = getStatusConfig(offer.offerStatus);
                      return (
                        <tr key={offer.id}>
                          
<td>
  <div className="d-flex align-items-start gap-3">
    
    {/* Avatar */}
    <div
      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
      style={{
        width: "42px",
        height: "42px",
        backgroundColor: "#e6f4ff",
        color: "#1677ff",
        fontWeight: "600",
        fontSize: "16px",
      }}
    >
      {offer?.candidateName?.charAt(0)?.toUpperCase() || "?"}
    </div>

    {/* Candidate Details */}
    <div className="flex-grow-1">
      <div className="fw-semibold mb-1">
        {offer.candidateName}
      </div>

      <div className="small text-muted d-flex flex-column gap-1">

        <div className="d-flex align-items-center">
          <Icon icon="heroicons:envelope" width="14" className="me-2" />
          {offer.email}
        </div>

        <div className="d-flex align-items-center">
          <Icon icon="heroicons:device-phone-mobile" width="14" className="me-2" />
          {offer.phone}
        </div>

        <div className="d-flex align-items-center">
          <Icon icon="heroicons:user-circle" width="14" className="me-2" />
          Source: {offer.candidateSource}
        </div>

        {offer.emailSent && (
          <div className="d-flex align-items-center text-success">
            <Icon icon="heroicons:check-circle" width="14" className="me-2" />
            Email sent{" "}
            {offer.emailSentDate &&
              new Date(offer.emailSentDate).toLocaleDateString()}
          </div>
        )}

        {offer.smsSent && (
          <div className="d-flex align-items-center text-info">
            <Icon icon="heroicons:device-phone-mobile" width="14" className="me-2" />
            SMS sent{" "}
            {offer.smsSentDate &&
              new Date(offer.smsSentDate).toLocaleDateString()}
          </div>
        )}

      </div>
    </div>

  </div>
</td>

                          <td>
                            <div>
                              <div className="fw-bold">{offer.position}</div>
                              <div className="text-muted">
                                {offer.department}
                              </div>
                              <div className="small">
                                Grade: {offer.grade} | Exp: {offer.experience}
                              </div>
                            </div>
                          </td>

                          <td>
                            <div>
                              <div className="fw-bold text-success">
                                ₹{offer.ctc}
                              </div>
                              <div className="small text-muted">
                                {offer.offerType} | Join: {offer.joiningDate}
                              </div>
                              {renderCTCBreakup(offer.ctcBreakup)}
                            </div>
                          </td>

                          <td>
                            <div>
                              <span
                                className={`badge bg-${statusConfig.color} d-inline-flex align-items-center gap-1`}
                              >
                                <Icon icon={statusConfig.icon} />
                                {statusConfig.text}
                              </span>
<div className="d-flex flex-column gap-1 small">

  {/* Accepted */}
  {offer.acceptanceDate && (
    <div className="text-success d-flex align-items-center">
      <Icon icon="heroicons:calendar" width="14" className="me-1" />
      Accepted:{" "}
      {new Date(offer.acceptanceDate).toLocaleDateString()}
    </div>
  )}

  {/* Declined */}
  {offer.declineReason && (
    <div className="text-danger d-flex align-items-center">
      <Icon icon="heroicons:information-circle" width="14" className="me-1" />
      Reason: {offer.declineReason}
    </div>
  )}

  {/* Expired */}
  {offer.expiryDate &&
    new Date(offer.expiryDate).getTime() < Date.now() &&
    offer.offerStatus === OFFER_STATUS.SENT && (
      <div className="text-danger d-flex align-items-center">
        <Icon icon="heroicons:exclamation-triangle" width="14" className="me-1" />
        Expired
      </div>
  )}

  {/* Version */}
  {offer.version > 1 && (
    <div className="text-info d-flex align-items-center">
      <Icon icon="heroicons:document-duplicate" width="14" className="me-1" />
      Version {offer.version}
    </div>
  )}

</div>

                              {renderHistory(offer.history)}
                            </div>
                          </td>
                          
                          <td className="align-middle">
                           <div className="my-container">
                              <button
                                className="btn btn-sm btn-outline-info d-flex align-items-center justify-content-center"
                                onClick={() => {
                                  setSelectedOffer(offer);
                                  setShowPreview(true);
                                }}
                                title="View Details"
                              >
                                <Icon icon="heroicons:eye" />
                              </button>
                              {offer.bgvStatus && (
                                <button
                                  className="btn btn-sm btn-outline-warning d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setSelectedOffer(offer);
                                    setShowBGVModal(true);
                                  }}
                                  title="Background Verification"
                                >
                                  <Icon icon="heroicons:shield-check" />
                                </button>
                              )}
                              {offer.referenceCheck && (
                                <button
                                  className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setSelectedOffer(offer);
                                    setShowReferenceCheckModal(true);
                                  }}
                                  title="Reference Check"
                                >
                                  <Icon icon="heroicons:user-group" />
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                                onClick={() => handleEdit(offer)}
                                disabled={[
                                  OFFER_STATUS.ACCEPTED,
                                  OFFER_STATUS.DECLINED,
                                  OFFER_STATUS.WITHDRAWN,
                                ].includes(offer.offerStatus)}
                                title="Edit Offer"
                              >
                                <Icon icon="heroicons:pencil-square" />
                              </button>
                              {offer.offerStatus === OFFER_STATUS.DRAFT ||
                              offer.offerStatus === OFFER_STATUS.APPROVED ? (
                                <button
                                  className="btn btn-sm btn-secondary d-flex align-items-center justify-content-center"
                                  onClick={() => handleSendOffer(offer)}
                                  title="Send Offer"
                                >
                                  <Icon icon="heroicons:paper-airplane" />
                                </button>
                              ) : null}
                              {offer.offerStatus === OFFER_STATUS.SENT ? (
                                <>
                                  <button
                                    className="btn btn-sm btn-success d-flex align-items-center justify-content-center"
                                    onClick={() => handleAcceptOffer(offer)}
                                    title="Mark as Accepted"
                                  >
                                    <Icon icon="heroicons:check-badge" />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger d-flex align-items-center justify-content-center"
                                    onClick={() => handleDeclineOffer(offer)}
                                    title="Mark as Declined"
                                  >
                                    <Icon icon="heroicons:x-circle" />
                                  </button>
                                </>
                              ) : null}
                              {offer.offerStatus ===
                                OFFER_STATUS.PENDING_APPROVAL && (
                                <button
                                  className="btn btn-sm btn-info d-flex align-items-center justify-content-center"
                                  onClick={() => {
                                    setSelectedOffer(offer);
                                    setShowApprovalModal(true);
                                  }}
                                  title="View Approval Status"
                                >
                                  <Icon icon="heroicons:clipboard-document-check" />
                                </button>
                              )}
                              {offer.offerStatus === OFFER_STATUS.APPROVED &&
                                offer.version > 1 && (
                                  <button
                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                                    onClick={() => {
                                      setSelectedOffer(offer);
                                      setShowVersionHistoryModal(true);
                                    }}
                                    title="View Version History"
                                  >
                                    <Icon icon="heroicons:clock" />
                                  </button>
                                )}
                              {offer.offerStatus === OFFER_STATUS.DRAFT && (
                                <button
                                  className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                                  onClick={() =>
                                    handleCreateRevisedOffer(offer)
                                  }
                                  title="Create Revised Offer"
                                >
                                  <Icon icon="heroicons:document-duplicate" />
                                </button>
                              )}
                              {![
                                OFFER_STATUS.ACCEPTED,
                                OFFER_STATUS.WITHDRAWN,
                              ].includes(offer.offerStatus) && (
<button
  className="btn btn-sm btn-warning d-flex align-items-center justify-content-center"
  onClick={() => {
    setSelectedOffer(offer);
    setShowWithdrawModal(true);
  }}
  title="Withdraw Offer"
>
  <Icon icon="heroicons:arrow-uturn-left" />
</button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                                onClick={() => handleDelete(offer.id)}
                                title="Delete Offer"
                                disabled={
                                  offer.offerStatus === OFFER_STATUS.ACCEPTED
                                }
                              >
                                <Icon icon="heroicons:trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        {/* Analytics Section */}
        <div className="card border shadow-sm">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Offer Analytics</h6>
            <div className="row g-3">
              <div className="col-md-3">
                <div className="card border">
                  <div className="card-body">
                    <div className="fw-bold text-secondary small">
                      Acceptance Rate
                    </div>
                    <div className="fw-bold fs-4 text-success">
                      {acceptanceRate}%
                    </div>
                    <div className="progress mt-2" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${acceptanceRate}%` }}
                      ></div>
                    </div>
                    <small className="text-muted">
                      {stats.accepted} accepted out of {stats.total} offers
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border">
                  <div className="card-body">
                    <div className="fw-bold text-secondary small">
                      Average Time to Accept
                    </div>
                    <div className="fw-bold fs-4 text-info">5.2 days</div>
                    <small className="text-muted">
                      From offer sent to acceptance
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border">
                  <div className="card-body">
                    <div className="fw-bold text-secondary small">
                      Top Department
                    </div>
                    <div className="fw-bold fs-4 text-primary">Engineering</div>
                    <small className="text-muted">Most offers extended</small>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border">
                  <div className="card-body">
                    <div className="fw-bold text-secondary small">
                      Monthly Trend
                    </div>
                    <div className="fw-bold fs-4 text-success">+15%</div>
                    <small className="text-muted">vs previous month</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Offer Modal - FIXED WIDTH */}
        {showForm && (
          <div className="hrms-modal-overlay">
            <div
              className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
            >
              {/* Header */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                  <Icon icon="heroicons:document-plus" />
                  {selectedOffer ? "Edit Offer" : "Create New Offer"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div
                 className="hrms-modal-body hrms-modal-body-scroll"
              >
                <form onSubmit={handleSubmit} id="offerForm">
                  {/* Step 1: Candidate Information */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center">
                      <span className="badge bg-primary me-2">1</span>
                      <Icon icon="heroicons:user" className="me-2" />
                      Candidate Information
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Candidate Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="candidateName"
                          value={formData.candidateName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                          {/* New Gender field */}
    <div className="col-md-6">
      <label className="form-label">Gender</label>
      <select
        className="form-select"
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
<div className="col-md-6">
  <label className="form-label">Candidate Source</label>

  {formData.candidateSource === "Other" ? (
    <input
      type="text"
      className="form-control"
      placeholder="Enter Candidate Source"
      name="customSource"
      value={formData.customSource}
      onChange={handleInputChange}
    />
  ) : (
    <select
      className="form-select"
      name="candidateSource"
      value={formData.candidateSource}
      onChange={(e) => {
        handleInputChange(e);

        // Reset extra fields when switching
        if (e.target.value !== "Referral") {
          setFormData(prev => ({
            ...prev,
            referralDetails: {
              employeeId: "",
              role: "",
              designation: "",
              experience: ""
            }
          }));
        }

        if (e.target.value !== "Other") {
          setFormData(prev => ({
            ...prev,
            customSource: ""
          }));
        }
      }}
    >
      <option value="">Select Source</option>
      <option value="LinkedIn">LinkedIn</option>
      <option value="Referral">Referral</option>
      <option value="Naukri">Naukri</option>
      <option value="Campus">Campus</option>
      <option value="AngelList">AngelList</option>
      <option value="Other">Other</option>
    </select>
  )}
</div>

{formData.candidateSource === "Referral" && (
  <>
    <div className="col-md-6">
      <label className="form-label">Employee ID</label>
      <input
        type="text"
        className="form-control"
        name="referralDetails.employeeId"
        value={formData.referralDetails?.employeeId || ''}
        onChange={handleInputChange}
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">Role</label>
      <input
        type="text"
        className="form-control"
        name="referralDetails.role"
        value={formData.referralDetails?.role || ''}
        onChange={handleInputChange}
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">Designation</label>
      <input
        type="text"
        className="form-control"
        name="referralDetails.designation"
        value={formData.referralDetails?.designation || ''}
        onChange={handleInputChange}
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">Experience</label>
      <input
        type="text"
        className="form-control"
        name="referralDetails.experience"
        value={formData.referralDetails?.experience || ''}
        onChange={handleInputChange}
      />
    </div>
  </>
)}

                      <div className="col-md-6">
                        <label className="form-label">
                          Position <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Department <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Grade <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Intern">Intern</option>
                          <option value="L1">L1</option>
                          <option value="L2">L2</option>
                          <option value="L3">L3</option>
                          <option value="L4">L4</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Experience</label>
                        <input
                          type="text"
                          className="form-control"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          placeholder="e.g., 3 years"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Notice Period</label>
                        <select
                          className="form-select"
                          name="noticePeriod"
                          value={formData.noticePeriod}
                          onChange={handleInputChange}
                        >
                          <option value="15 days">15 days</option>
                          <option value="30 days">30 days</option>
                          <option value="60 days">60 days</option>
                          <option value="90 days">90 days</option>
                          <option value="Immediate">Immediate</option>
                        </select>
                      </div>
                    </div>
                  </div>


{/* Step 2: Candidate Information */}
<div className="mb-4">
  <h6 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center">
    <Icon icon="heroicons:user" className="me-2" />
    Personal Information
  </h6>
  <div className="row g-3">

    {/* Relation field */}
    <div className="col-md-6">
      <label className="form-label">Relation</label>
      <select
        className="form-select"
        name="relation"
        value={formData.relation}
        onChange={handleInputChange}
      >
        <option value="select">Select</option>
        <option value="S/O">S/O (Son of)</option>
        <option value="D/O">D/O (Daughter of)</option>
        <option value="C/O">C/O (Care of)</option>
        <option value="Others">Others</option>
      </select>
    </div>

    {/* Father's/Guardian's Name field */}
    <div className="col-md-6">
      <label className="form-label">Father's/Guardian's Name</label>
      <input
        type="text"
        className="form-control"
        name="fatherName"
        value={formData.fatherName}
        onChange={handleInputChange}
        placeholder="Enter father's or guardian's name"
      />
    </div>
    
    {/* Conditional fields when "Others" is selected */}
    {formData.relation === "Others" && (
      <>
        {/* Custom Relation Type */}
        <div className="col-md-6">
          <label className="form-label">
            Specify Relationship <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="customRelation"
            value={formData.customRelation || ''}
            onChange={handleInputChange}
            placeholder="e.g., Uncle, Aunt, Grandfather, etc."
            required
          />
        </div>

        {/* Guardian's Gender */}
        <div className="col-md-6">
          <label className="form-label">Guardian's Gender</label>
          <select
            className="form-select"
            name="guardianGender"
            value={formData.guardianGender || ''}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Guardian's Contact (Optional) */}
        <div className="col-md-6">
          <label className="form-label">Guardian's Contact (Optional)</label>
          <input
            type="tel"
            className="form-control"
            name="guardianPhone"
            value={formData.guardianPhone || ''}
            onChange={handleInputChange}
            placeholder="Guardian's phone number"
          />
        </div>

        {/* Legal Guardian Confirmation */}
<div className="col-md-6">
  <div className="mt-4">
    <label
      htmlFor="isLegalGuardian"
      className={`custom-checkbox ${
        formData.isLegalGuardian ? "checked" : ""
      }`}
    >
      <span className="checkbox-box">
        {formData.isLegalGuardian && (
          <span className="checkmark">✓</span>
        )}
      </span>

      <input
        type="checkbox"
        id="isLegalGuardian"
        name="isLegalGuardian"
        checked={formData.isLegalGuardian || false}
        onChange={handleInputChange}
        hidden
      />

      <span className="checkbox-label">
        This person is my legal guardian
      </span>
    </label>
  </div>
</div>

      </>
    )}
    
    {/* Address Section - Always visible */}
    <div className="col-12 mt-3">
      <h6 className="fw-semibold mb-3">Address Details</h6>
    </div>
    
    <div className="col-md-6">
      <label className="form-label">Address</label>
      <input
        type="text"
        className="form-control"
        name="address.street"
        value={formData.address.street}
        onChange={handleInputChange}
        placeholder="House no., building, street"
      />
    </div>
    
    <div className="col-md-6">
      <label className="form-label">City/Village</label>
      <input
        type="text"
        className="form-control"
        name="address.city"
        value={formData.address.city}
        onChange={handleInputChange}
        placeholder="City or village name"
      />
    </div>
    
    <div className="col-md-4">
      <label className="form-label">District</label>
      <input
        type="text"
        className="form-control"
        name="address.district"
        value={formData.address.district}
        onChange={handleInputChange}
        placeholder="District"
      />
    </div>
    
<div className="col-md-4">
  <label className="form-label">State</label>

  {formData.address.state === "Others" ? (
    <input
      type="text"
      className="form-control"
      placeholder="Enter State Name"
      value={formData.address.customState || ""}
      name="address.customState"
      onChange={handleInputChange}
    />
  ) : (
    <select
      className="form-select"
      name="address.state"
      value={formData.address.state}
      onChange={(e) => {
        handleInputChange(e);

        if (e.target.value !== "Others") {
          handleInputChange({
            target: {
              name: "address.customState",
              value: "",
            },
          });
        }
      }}
    >
      <option value="">Select State</option>
      <option value="Andhra Pradesh">Andhra Pradesh</option>
      <option value="Telangana">Telangana</option>
      <option value="Tamil Nadu">Tamil Nadu</option>
      <option value="Karnataka">Karnataka</option>
      <option value="Maharashtra">Maharashtra</option>
      <option value="Delhi">Delhi</option>
      <option value="Uttar Pradesh">Uttar Pradesh</option>
      <option value="Gujarat">Gujarat</option>
      <option value="Rajasthan">Rajasthan</option>
      <option value="West Bengal">West Bengal</option>
      <option value="Others">Others</option>
    </select>
  )}
</div>
    
    <div className="col-md-4">
      <label className="form-label">PIN Code</label>
      <input
        type="text"
        className="form-control"
        name="address.pincode"
        value={formData.address.pincode}
        onChange={handleInputChange}
        placeholder="6-digit PIN code"
        maxLength="6"
      />
    </div>
    
  </div>
</div>
                  
                  {/* Step 3: Offer Details */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center">
                      <span className="badge bg-primary me-2">2</span>
                      <Icon icon="heroicons:currency-dollar" className="me-2" />
                      Offer Details
                    </h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label">
                          CTC (₹) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="ctc"
                          value={formData.ctc}
                          onChange={handleInputChange}
                          required
                          placeholder="12,00,000"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Joining Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="joiningDate"
                          value={formData.joiningDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Offer Type</label>
                        <select
                          className="form-select"
                          name="offerType"
                          value={formData.offerType}
                          onChange={handleInputChange}
                        >
                          {OFFER_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Template</label>
                        <div className="input-group">
                          <select
                            className="form-select"
                            name="template"
                            value={formData.template}
                            onChange={handleInputChange}
                          >
                            {TEMPLATES.filter(
                              (t) =>
                                t.applicableTo.includes(formData.grade) ||
                                t.applicableTo.includes("All") ||
                                (formData.offerType === "Internship" &&
                                  t.applicableTo.includes("Intern")),
                            ).map((template) => (
                              <option key={template.id} value={template.id}>
                                {template.name}
                              </option>
                            ))}
                          </select>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              const template = TEMPLATES.find(
                                (t) => t.id === formData.template,
                              );
                              if (template) {
                                setSelectedTemplate(template);
                                setShowTemplateModal(true);
                              }
                            }}
                            title="Customize Template"
                          >
                            <Icon icon="heroicons:cog-6-tooth" />
                          </button>
                        </div>
                        <small className="text-muted">
                          Template automatically selected based on grade/level
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Expiry Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Approval Workflow</label>
                        <select
                          className="form-select"
                          name="approvalWorkflow"
                          value={formData.approvalWorkflow}
                          onChange={handleInputChange}
                        >
                          {APPROVAL_WORKFLOWS.map((workflow) => (
                            <option key={workflow.id} value={workflow.id}>
                              {workflow.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* CTC Breakup */}
<div className="mb-4">
  <h6 className="fw-bold mb-3">CTC Breakup</h6>
  
  {/* Earnings Section */}
  <div className="mb-3">
    <h6 className="mb-2">Earnings</h6>
    <div className="row g-3">
      <div className="col-md-4">
        <label className="form-label">Basic Salary</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.basic"
          value={formData.ctcBreakup.basic}
          onChange={handleInputChange}
          placeholder="25,000"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">HRA</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.hra"
          value={formData.ctcBreakup.hra}
          onChange={handleInputChange}
          placeholder="10,000"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Special Allowance</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.specialAllowance"
          value={formData.ctcBreakup.specialAllowance}
          onChange={handleInputChange}
          placeholder="5,000"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Conveyance Allowance</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.conveyance"
          value={formData.ctcBreakup.conveyance}
          onChange={handleInputChange}
          placeholder="1,600"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Telephone Allowance</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.telephoneAllowance"
          value={formData.ctcBreakup.telephoneAllowance || ''}
          onChange={handleInputChange}
          placeholder="1,000"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Medical Allowance</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.medicalAllowance"
          value={formData.ctcBreakup.medicalAllowance || ''}
          onChange={handleInputChange}
          placeholder="1,250"
        />
      </div>
    </div>
  </div>

  {/* Gross Salary Calculation */}
  <div className="mb-3 p-3 bg-light rounded">
    <div className="row">
      <div className="col-md-6 offset-md-6">
        <div className="d-flex justify-content-between align-items-center">
          <strong>Gross Salary (Monthly):</strong>
          <span className="fw-bold text-primary fs-5">
            ₹{calculateGrossSalary(formData.ctcBreakup)}
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* Deductions Section */}
  <div className="mb-3">
    <h6 className="mb-2">Deductions</h6>
    <div className="row g-3">
      <div className="col-md-4">
        <label className="form-label">Employee PF</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.employeePF"
          value={formData.ctcBreakup.employeePF || ''}
          onChange={handleInputChange}
          placeholder="1,800"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Professional Tax</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.professionalTax"
          value={formData.ctcBreakup.professionalTax || ''}
          onChange={handleInputChange}
          placeholder="200"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Gratuity (Employee)</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.gratuityEmployee"
          value={formData.ctcBreakup.gratuityEmployee || ''}
          onChange={handleInputChange}
          placeholder="1,200"
        />
      </div>
    </div>
  </div>

  {/* Net Take Home */}
  <div className="mb-3 p-3 bg-success bg-opacity-10 rounded">
    <div className="row">
      <div className="col-md-6 offset-md-6">
        <div className="d-flex justify-content-between align-items-center">
          <strong className="text-success">Net Take Home (Monthly):</strong>
          <span className="fw-bold text-success fs-4">
            ₹{calculateNetTakeHome(formData.ctcBreakup)}
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* Employer Contributions Section */}
  <div className="mb-3">
    <h6 className="mb-2">Employer Contributions</h6>
    <div className="row g-3">
      <div className="col-md-4">
        <label className="form-label">Employer PF</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.employerPF"
          value={formData.ctcBreakup.employerPF || ''}
          onChange={handleInputChange}
          placeholder="1,800"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Group Insurance</label>
        <input
          type="text"
          className="form-control"
          name="ctcBreakup.groupInsurance"
          value={formData.ctcBreakup.groupInsurance || ''}
          onChange={handleInputChange}
          placeholder="500"
        />
      </div>
      

    </div>
  </div>

  {/* Total Monthly CTC */}
  <div className="mt-4 p-3 bg-primary bg-opacity-10 rounded">
    <div className="row">
      <div className="col-md-6">
        <h6 className="fw-bold mb-2">CTC Summary (Monthly)</h6>
        <table className="table table-sm table-borderless">
          <tbody>
            <tr>
              <td>Gross Salary:</td>
              <td className="text-end">₹{calculateGrossSalary(formData.ctcBreakup)}</td>
            </tr>
            <tr>
              <td>Employer PF:</td>
              <td className="text-end">₹{formData.ctcBreakup.employerPF || '0'}</td>
            </tr>
            <tr>
              <td>Group Insurance:</td>
              <td className="text-end">₹{formData.ctcBreakup.groupInsurance || '0'}</td>
            </tr>
            <tr>
              <td>Employer Gratuity:</td>
              <td className="text-end">₹{formData.ctcBreakup.gratuityEmployer || '0'}</td>
            </tr>
            <tr className="border-top">
              <td><strong>Total Monthly CTC:</strong></td>
              <td className="text-end"><strong className="text-primary fs-5">₹{calculateTotalMonthlyCTC(formData.ctcBreakup)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-md-6">
        <h6 className="fw-bold mb-2">Annual CTC</h6>
        <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded">
          <span>Total Annual CTC:</span>
          <span className="fw-bold text-primary fs-4">
            ₹{calculateAnnualCTC(formData.ctcBreakup)}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
                    {/* Work Profile (Optional) */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center">
                        <Icon icon="heroicons:briefcase" className="me-2" />
                        Work Profile (Optional)
                      </h6>
                      <p className="text-muted small mb-3">
                        Select work profile for this employee. If you do not
                        select these values now, system will assign default
                        values, which you can edit later.
                      </p>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Business Unit</label>
                          <select
                            className="form-select"
                            name="businessUnit"
                            value={formData.businessUnit}
                            onChange={handleInputChange}
                          >
                            <option value="">- Select -</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Operations">Operations</option>
                            <option value="Sales">Sales</option>
                            <option value="Marketing">Marketing</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Location</label>
                          <select
                            className="form-select"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                          >
                            <option value="">- Select -</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Pune">Pune</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Cost Center</label>
                          <select
                            className="form-select"
                            name="costCenter"
                            value={formData.costCenter}
                            onChange={handleInputChange}
                          >
                            <option value="">- Select -</option>
                            <option value="CC001">CC001</option>
                            <option value="CC002">CC002</option>
                            <option value="CC003">CC003</option>
                            <option value="CC004">CC004</option>
                            <option value="CC005">CC005</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Designation</label>
                          <input
                            type="text"
                            className="form-control"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            placeholder="Designation"
                            disabled
                          />
                          <small className="text-muted">Same as Position</small>
                        </div>
                      </div>
                    </div>

                    {/* Policies (Optional) */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center">
                        <Icon
                          icon="heroicons:document-check"
                          className="me-2"
                        />
                        Policies (Optional)
                      </h6>
                      <p className="text-muted small mb-3">
                        Select policies applicable to this employee. If you do
                        not select these values now, system will assign default
                        values, which you can edit later.
                      </p>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Shift Policy</label>
                          <select
                            className="form-select"
                            name="shiftPolicy"
                            value={formData.shiftPolicy}
                            onChange={handleInputChange}
                          >
                            <option value="">- Select -</option>
                            <option value="General">General</option>
                            <option value="Night">Night</option>
                            <option value="Flexible">Flexible</option>
                            <option value="Rotational">Rotational</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Week Off Policy</label>
                          <select
                            className="form-select"
                            name="weekOffPolicy"
                            value={formData.weekOffPolicy}
                            onChange={handleInputChange}
                          >
                            <option value="">- Select -</option>
                            <option value="Sunday">Sunday</option>
                            <option value="Saturday-Sunday">
                              Saturday-Sunday
                            </option>
                            <option value="Flexible">Flexible</option>
                            <option value="Rotational">Rotational</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    {/* Step 4: Interview & Negotiation Details */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center">
                        <span className="badge bg-primary me-2">3</span>
                        <Icon
                          icon="heroicons:clipboard-document-check"
                          className="me-2"
                        />
                        Interview & Negotiation Details
                      </h6>
                      <div className="mb-4">
                        <label className="form-label">Interview Summary</label>
                        <textarea
                          className="form-control"
                          name="interviewSummary"
                          value={formData.interviewSummary}
                          onChange={handleInputChange}
                          rows="4"
                          placeholder="Candidate performance in interviews, technical skills, communication, etc..."
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label">
                          Salary Negotiation History
                        </label>
                        <textarea
                          className="form-control"
                          name="salaryNegotiationHistory"
                          value={formData.salaryNegotiationHistory}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Initial offer: ₹X | Candidate request: ₹Y | Final: ₹Z | Status: Accepted/Rejected"
                        />
                        <small className="text-muted">
                          Document all negotiation rounds and final agreed
                          amount
                        </small>
                      </div>
                    </div>

                    {/* Step 4: Background Verification & References */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3 border-bottom pb-2 d-flex align-items-center">
                        <span className="badge bg-primary me-2">4</span>
                        <Icon icon="heroicons:shield-check" className="me-2" />
                        Background Verification & References
                      </h6>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label">BGV Status</label>
                          <select
                            className="form-select"
                            name="bgvStatus"
                            value={formData.bgvStatus || "pending"}
                            onChange={handleInputChange}
                          >
                            <option value="not_started">Not Started</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Reference Check Status
                          </label>
                          <select className="form-select">
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="not_required">Not Required</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Any special instructions or notes..."
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Terms & Conditions</label>
                      <textarea
                        className="form-control"
                        name="terms"
                        value={formData.terms}
                        onChange={handleInputChange}
                        rows="5"
                      />
                    </div>

                    <div className="row g-3">
  <div className="col-md-6">
    <div className="form-check d-flex align-items-center">
      <label
        className="d-flex align-items-center"
        style={{ cursor: "pointer" }}
      >
        {/* Custom Checkbox UI */}
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            border: `2px solid ${
              formData.enableBGV ? "#3B82F6" : "#9CA3AF"
            }`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "10px",
            transition: "all 0.3s ease",
            background: formData.enableBGV
              ? "#3B82F6"
              : "transparent",
          }}
        >
          {formData.enableBGV && (
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

        {/* Hidden Actual Input */}
        <input
          type="checkbox"
          name="enableBGV"
          checked={formData.enableBGV}
          onChange={handleInputChange}
          style={{ display: "none" }}
        />

        <span className="fw-semibold">
          Enable Background Verification
        </span>
      </label>
    </div>
  </div>

<div className="col-md-6">
  <div className="form-check d-flex align-items-center">
    <label
      className="d-flex align-items-center"
      style={{ cursor: "pointer" }}
    >
      {/* Custom Checkbox UI */}
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "4px",
          border: `2px solid ${
            formData.requireDigitalSignature ? "#3B82F6" : "#9CA3AF"
          }`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "10px",
          transition: "all 0.3s ease",
          background: formData.requireDigitalSignature
            ? "#3B82F6"
            : "transparent",
        }}
      >
        {formData.requireDigitalSignature && (
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

      {/* Hidden Actual Input */}
      <input
        type="checkbox"
        name="requireDigitalSignature"
        checked={formData.requireDigitalSignature}
        onChange={handleInputChange}
        style={{ display: "none" }}
      />

      <span className="fw-semibold">
        Require Digital Signature
      </span>
    </label>
  </div>
</div>

                      
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer bg-light border-top">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-job-btn"
                  form="offerForm"
                >
                  <Icon icon="heroicons:check" width="18" height="18" />
                  <span>{selectedOffer ? "Update Offer" : "Create Offer"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Preview Modal */}
        {showPreview && selectedOffer && (
         <div
            className="hrms-modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowPreview(false);
            }}
          >
            <div
              className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
              onClick={(e) => e.stopPropagation()}
            >
 
              {/* HEADER */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                  <Icon icon="heroicons:eye" className="me-2" />
                  Offer Letter Preview
                </h5>
 
                <button
                  className="hrms-modal-close"
                  onClick={() => setShowPreview(false)}
                >
                  ×
                </button>
              </div>
 
              {/* BODY */}
              <div className="hrms-modal-body hrms-modal-body-scroll">
                <div className="bg-white p-4 rounded shadow-sm">
                  {/* Company Header */}
                  <div className="text-center mb-4">
                    <h4 className="fw-bold text-dark mb-0">
                      Levitica Technologies PVT LTD
                    </h4>
                    <p className="mb-1">
                      Office #409, 4th Floor, Jain sadguru image's capital park, Ayyappa Society, VIP Hills, Silicon Valley, Madhapur, Hyderabad, Telangana 500081
                    </p>
<p className="mb-1 d-flex justify-content-center align-items-center gap-4 flex-wrap text-center">

  <span className="d-flex align-items-center gap-1">
    <Icon icon="heroicons:envelope" width="16" />
    hr@leviticatechnologies.com
  </span>
  |
  <span className="d-flex align-items-center gap-1">
    <Icon icon="heroicons:phone" width="16" />
    +91 6305675199
  </span>
  |
  <span className="d-flex align-items-center gap-1">
    <Icon icon="heroicons:globe-alt" width="16" />
    www.leviticatechnologies.com
  </span>

</p>


                    <hr />
                  </div>

                  {/* Letter Title */}
                  <h5 className="fw-bold mb-3">LETTER OF EMPLOYMENT</h5>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  {/* Candidate Details */}
                  <div className="mb-4">
                    <p className="mb-1">
                      <strong>To,</strong>
                    </p>
                    <p className="mb-1 fw-bold">
                      {selectedOffer.candidateName}
                    </p>
                    <p className="mb-1">{selectedOffer.email}</p>
                    <p>{selectedOffer.phone}</p>
                  </div>

                  <p>
                    Dear <strong>{selectedOffer.candidateName}</strong>,
                  </p>

                  <p>
                    We are delighted to offer you the position of{" "}
                    <strong>{selectedOffer.position}</strong> in the{" "}
                    <strong>{selectedOffer.department}</strong> department at
                    Technovate Solutions Private Limited.
                  </p>

                  <p>
                    Your employment will commence on{" "}
                    <strong>{selectedOffer.joiningDate}</strong>. This offer is
                    subject to successful completion of background verification
                    and pre-employment formalities.
                  </p>

                  {/* Offer Details */}
                  <div className="bg-light p-4 rounded mb-4">
                    <h6 className="fw-bold mb-3">OFFER DETAILS</h6>

                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Position:</strong> {selectedOffer.position}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Department:</strong>{" "}
                          {selectedOffer.department}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Grade:</strong> {selectedOffer.grade}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Employment Type:</strong>{" "}
                          {selectedOffer.offerType}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Joining Date:</strong>{" "}
                          {selectedOffer.joiningDate}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Notice Period:</strong>{" "}
                          {selectedOffer.noticePeriod}
                        </p>
                      </div>
                      <div className="col-12">
                        <p>
                          <strong>Annual CTC:</strong>{" "}
                          <span className="fw-bold text-success">
                            ₹{selectedOffer.ctc}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* CTC Breakup */}
                    {selectedOffer.ctcBreakup && (
                      <div className="mt-3">
                        <h6 className="fw-semibold mb-2">
                          CTC Breakup (Annual)
                        </h6>
                        {Object.entries(selectedOffer.ctcBreakup).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="d-flex justify-content-between border-bottom py-1"
                            >
                              <span>
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                              <span className="fw-bold">₹{value}</span>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-2">TERMS AND CONDITIONS</h6>
                    <ol className="small ps-3">
                      <li>Subject to satisfactory background verification.</li>
                      <li>Probation period of 3 months from joining date.</li>
                      <li>Employment governed by company policies.</li>
                      <li>Offer valid until {selectedOffer.expiryDate}.</li>
                      <li>Return signed copy as acceptance.</li>
                    </ol>
                  </div>

                  {/* Signatures */}
                  <div className="row mt-5">
                    <div className="col-md-6 text-center">
                      <p className="fw-bold">
                        For Levitica Technologies PVT LTD
                      </p>
                      <div
                        className="border-top mx-auto mb-2"
                        style={{ width: "200px" }}
                      ></div>
                      <p className="mb-0">Authorized Signatory</p>
                      <p>HR Department</p>
                    </div>

                    <div className="col-md-6 text-center">
                      <p className="fw-bold">Accepted By</p>
                      <div
                        className="border-top mx-auto mb-2"
                        style={{ width: "200px" }}
                      ></div>
                      <p className="mb-0">{selectedOffer.candidateName}</p>
                      <p>Date: ____________</p>
                    </div>
                  </div>
                </div>
              </div>
                            <div className="modal-footer bg-white border-top d-flex justify-content-between">
                              <button
                                className="close-btn"
                                onClick={() => setShowPreview(false)}
                              >
                                Close
                              </button>
              
                              <div className="d-flex gap-2">
              <button
                className="create-job-btn"
                onClick={() => {
                  if (selectedOffer) {
                    generateOfferLetterPDF(selectedOffer);
                  } else {
                    alert("No offer selected to download");
                  }
                }}
              >
                <Icon icon="heroicons:arrow-down-tray" width="18" />
                Download PDF
              </button>
              
                       <button
                          className="add-employee"
                          onClick={() => handleSendEmailFromPreview(selectedOffer)}
                        >
                          <Icon icon="heroicons:envelope" width="18" />
                          Send via Email
                        </button>
                              </div>
                            </div>
            </div>
          </div>
        )}

        {/* Withdraw Offer Modal */}
{showWithdrawModal && selectedOffer && (
  <div
    className="modal show d-block"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        setShowWithdrawModal(false);
        setWithdrawReason("");
      }
    }}
  >
    <div className="modal-dialog">
      <div className="modal-content">
      {/* Header */}
        <div
          className="modal-header"
          style={{ backgroundColor: "#ffc107", color: "#000" }}
        >
          <h5 className="modal-title d-flex align-items-center gap-2">
            <Icon icon="heroicons:arrow-uturn-left" width="20" />
            Withdraw Offer
          </h5>

          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setShowWithdrawModal(false);
              setWithdrawReason("");
            }}
          />
        </div>

      {/* Body */}
       <div className="modal-body">
        <p style={{ fontSize: "14px", marginBottom: "15px" }}>
          Are you sure you want to withdraw the offer for{" "}
          <strong>{selectedOffer.candidateName}</strong>?
        </p>

        {/* Reason Dropdown */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              fontWeight: "500",
              marginBottom: "5px",
              display: "block",
            }}
          >
            Select Reason <span style={{ color: "#dc3545" }}>*</span>
          </label>

          <select
            value={withdrawReason}
            onChange={(e) => setWithdrawReason(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
            required
          >
            <option value="">-- Select Reason --</option>
            {withdrawReasonsList.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Reason Textarea */}
        {withdrawReason === "Other" && (
          <div>
            <label
              style={{
                fontWeight: "500",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Enter Custom Reason <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <textarea
              rows="3"
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              placeholder="Enter detailed reason for withdrawal..."
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />
          </div>
        )}

        {/* Warning Message */}
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffe69c",
            borderRadius: "6px",
            color: "#997404",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Icon icon="heroicons:exclamation-triangle" width="18" />
          <span>
            This action cannot be undone. The candidate will be notified and the offer will be marked as withdrawn.
          </span>
        </div>
      </div>

      {/* Footer */}
<div className="modal-footer">
        <button
          onClick={() => {
            setShowWithdrawModal(false);
            setWithdrawReason("");
          }}
          className="cancel-btn"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (!withdrawReason.trim()) {
              alert("Please provide a reason for withdrawing the offer");
              return;
            }

            // Update offer status
            const updatedOffers = offers.map((o) =>
              o.id === selectedOffer.id
                ? {
                    ...o,
                    offerStatus: OFFER_STATUS.WITHDRAWN,
                    withdrawReason: withdrawReason,
                    history: [
                      ...o.history,
                      {
                        action: "Offer Withdrawn",
                        by: "HR Admin",
                        date: new Date().toISOString(),
                        status: OFFER_STATUS.WITHDRAWN,
                        details: {
                          reason: withdrawReason,
                        },
                      },
                    ],
                  }
                : o,
            );
            setOffers(updatedOffers);
            
            setShowWithdrawModal(false);
            setWithdrawReason("");
            
            alert(`Offer withdrawn for ${selectedOffer.candidateName}. Reason: ${withdrawReason}`);
          }}
          className="help-btn"

          disabled={!withdrawReason.trim()}
        >
          <Icon icon="heroicons:arrow-uturn-left" width="18" height="18" />
          Confirm Withdrawal
        </button>
      </div>
    </div>
  </div>
  </div>
)}


        {/* Send Offer Modal */}
        {showSendModal && selectedOffer && (
          <div
            className="hrms-modal-overlay"
          >
            <div
              className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
            >
              {/* Header */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                  <Icon icon="heroicons:paper-airplane" className="me-2" />
                  Send Offer Letter
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-black fw-bold"
                  onClick={() => setShowSendModal(false)}
                ></button>
              </div>

              {/* Body */}
               <div className="hrms-modal-body hrms-modal-body-scroll">
                {/* Candidate Info */}
                <div className="mb-4 p-3 border rounded bg-light">
                  <h6 className="fw-bold mb-3 text-primary d-flex align-items-center">
                    <Icon
                      icon="heroicons:user-circle"
                      className="me-2"
                      width="20"
                      height="20"
                    />
                    Candidate Information
                  </h6>

                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Name:</strong> {selectedOffer.candidateName}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedOffer.email || "N/A"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Position:</strong> {selectedOffer.position}
                      </p>
                      <p>
                        <strong>Joining Date:</strong>{" "}
                        {selectedOffer.joiningDate || "TBD"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Offer Summary */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-primary d-flex align-items-center">
                    <Icon
                      icon="heroicons:document-text"
                      className="me-2"
                      width="20"
                      height="20"
                    />
                    Offer Summary
                  </h6>
                  <div className="p-3 border rounded bg-white shadow-sm">
                    <p className="mb-1">
                      <strong>CTC:</strong> ₹
                      {selectedOffer.salary || "Not Defined"}
                    </p>
                    <p className="mb-1">
                      <strong>Department:</strong> {selectedOffer.department}
                    </p>
                    <p className="mb-0">
                      <strong>Status:</strong>{" "}
                      <span className="badge bg-warning text-dark">
                        {selectedOffer.status || "Draft"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Send Options */}
                <div className="mb-4">
                  {/* Heading */}
                  <h6
                    className="fw-bold mb-3 d-flex align-items-center"
                    style={{ color: "#0d6efd", gap: "8px" }}
                  >
                    <Icon icon="heroicons:envelope" width="20" height="20" />
                    Delivery Options
                  </h6>

                  {/* Email Option */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="sendEmail"
                      checked={emailSettings.sendEmail}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          sendEmail: e.target.checked,
                        })
                      }
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        accentColor: "#0d6efd", // Blue tick
                        border: "1.5px solid #0d6efd",
                        borderRadius: "4px",
                        appearance: "auto",
                      }}
                    />

                    <label
                      htmlFor="sendEmail"
                      style={{
                        marginLeft: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      <Icon
                        icon="heroicons:envelope"
                        width="18"
                        style={{ color: "#0d6efd" }}
                      />
                      Send via Email
                    </label>
                  </div>

                  {/* SMS Option */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="sendSMS"
                      checked={emailSettings.sendSMS}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          sendSMS: e.target.checked,
                        })
                      }
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        accentColor: "#0d6efd", // Keep same blue
                        border: "1.5px solid #0d6efd",
                        borderRadius: "4px",
                        appearance: "auto",
                      }}
                    />

                    <label
                      htmlFor="sendSMS"
                      style={{
                        marginLeft: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      <Icon
                        icon="heroicons:chat-bubble-left-right"
                        width="18"
                        style={{ color: "#198754" }}
                      />
                      Send via SMS
                    </label>
                  </div>

                  {/* Validation */}
                  {!emailSettings.sendEmail && !emailSettings.sendSMS && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "13px",
                        marginTop: "10px",
                      }}
                    >
                      Please select at least one delivery method.
                    </div>
                  )}
                </div>

                {/* Email Preview */}
                {emailSettings.sendEmail && (
                  <div className="mb-3">
                    <h6 className="fw-bold text-secondary mb-2">
                      Email Preview
                    </h6>
                    <div className="border rounded p-3 bg-light small">
                      <p>Dear {selectedOffer.candidateName},</p>
                      <p>
                        We are pleased to offer you the position of{" "}
                        <strong>{selectedOffer.position}</strong> at our
                        organization.
                      </p>
                      <p>
                        Please find the attached offer letter for your review
                        and confirmation.
                      </p>
                      <p>
                        Regards,
                        <br />
                        HR Team
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowSendModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="create-job-btn"
                  disabled={!emailSettings.sendEmail && !emailSettings.sendSMS}
                  onClick={handleConfirmSendOffer}
                >
                  <Icon
                    icon="heroicons:paper-airplane"
                    className="me-2"
                    width="20"
                    height="20"
                  />
                  <span>Confirm & Send</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Decline Offer Modal */}
        {showDeclineModal && selectedOffer && (
          <div
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
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDeclineModal(false);
                setDeclineReason("");
              }
            }}
          >
            <div
              style={{
                width: "500px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  padding: "15px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h5
                  style={{ margin: 0, display: "flex", alignItems: "center" }}
                >
                  <Icon
                    icon="heroicons:x-circle"
                    width="20"
                    height="20"
                    style={{ marginRight: "8px" }}
                  />
                  Decline Offer
                </h5>

                  <button
                    type="button"
                    onClick={() => {
                    setShowDeclineModal(false);
                    setDeclineReason("");
                  }}
                  className="btn btn-close"
                  ></button>
              </div>

              {/* Body */}
              <div style={{ padding: "20px" }}>
                <p style={{ fontSize: "14px" }}>
                  Mark offer for <strong>{selectedOffer.candidateName}</strong>{" "}
                  as declined?
                </p>

                {/* Dropdown */}
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      fontWeight: "500",
                      marginBottom: "5px",
                      display: "block",
                    }}
                  >
                    Select Reason (Optional)
                  </label>

                  <select
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">-- Select Reason --</option>

                    {declineReasonsList.map((reason, index) => (
                      <option key={index} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                {/* If Other selected → Show textarea */}
                {declineReason === "Other" && (
                  <div>
                    <label
                      style={{
                        fontWeight: "500",
                        marginBottom: "5px",
                        display: "block",
                      }}
                    >
                      Enter Custom Reason
                    </label>

                    <textarea
                      rows="3"
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Enter custom reason..."
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "15px 20px",
                  borderTop: "1px solid #eee",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => {
                    setShowDeclineModal(false);
                    setDeclineReason("");
                  }}
                  className="close-btn"
                >
                  Close
                </button>

<button
  onClick={handleConfirmDecline}
  className="delete-btn"
>
  <Icon
    icon="heroicons:x-circle"
    width="18"
    height="18"
  />
  Confirm Decline
</button>


              </div>
            </div>
          </div>
        )}

        {/* Approval Workflow Modal */}
        {showApprovalModal && selectedOffer && (
          <div
            className="modal fade show d-block"
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
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowApprovalModal(false);
              }
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                e.stopPropagation();
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title d-flex align-items-center">
                    <Icon
                      icon="heroicons:clipboard-document-check"
                      className="me-2"
                    />
                    Approval Workflow
                  </h5>
                  <button
                    type="button"
                  className="btn-close"
                    onClick={() => setShowApprovalModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {selectedOffer.approvalWorkflow && (
                    <div>
                      <h6 className="mb-3">Approval Steps</h6>
                      {selectedOffer.approvalWorkflow.steps.map(
                        (step, index) => (
                          <div key={index} className="mb-3 p-3 border rounded">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>
                                  Level {step.level}: {step.role}
                                </strong>
                                <div className="small text-muted mt-1">
                                  Status:{" "}
                                  <span
                                    className={`badge bg-${step.status === "approved" ? "success" : step.status === "pending" ? "warning" : "secondary"}`}
                                  >
                                    {step.status}
                                  </span>
                                </div>
                                {step.approvedBy && (
                                  <div className="small text-muted mt-1">
                                    Approved by: {step.approvedBy} on{" "}
                                    {step.approvedDate
                                      ? new Date(
                                          step.approvedDate,
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </div>
                                )}
                              </div>
                              {step.status === "pending" && (
                                <button
                                  className="add-employee"
                                  onClick={() =>
                                    handleApproveOffer(
                                      selectedOffer,
                                      step.level,
                                    )
                                  }
                                >
                                  <Icon
                                    icon="heroicons:check"
                                    className="me-1"
                                  />
                                  Approve
                                </button>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowApprovalModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Background Verification Modal */}
        {showBGVModal && selectedOffer && (
          <div
           className="hrms-modal-overlay"
          >
            <div
              className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column"
            >
              {/* Header */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                  <Icon
                    icon="heroicons:shield-check"
                    className="me-2 text-success"
                  />
                  Background Verification Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBGVModal(false)}
                ></button>
              </div>

              {/* Body */}
              <div className="hrms-modal-body hrms-modal-body-scroll">
                {/* Candidate Information */}
                <div className="mb-4 p-3 border rounded bg-light">
                  <h6 className="fw-semibold mb-3 text-primary d-flex align-items-center">
                    <Icon icon="heroicons:user-circle" className="me-2" />
                    Candidate Information
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Name:</strong> {selectedOffer.candidateName}
                      </p>
                      <p>
                        <strong>Position:</strong> {selectedOffer.position}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Department:</strong> {selectedOffer.department}
                      </p>
                      <p>
                        <strong>Offer Date:</strong> {selectedOffer.offerDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BGV Status Summary */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3 text-success d-flex align-items-center">
                    <Icon
                      icon="heroicons:clipboard-document-check"
                      className="me-2"
                    />
                    Verification Summary
                  </h6>

                  <div className="row">
                    <div className="col-md-4">
                      <strong>Status:</strong>
                      <div>
                        <span
                          className={`badge ${
                            selectedOffer.bgvStatus === "Completed"
                              ? "bg-success"
                              : selectedOffer.bgvStatus === "Rejected"
                                ? "bg-danger"
                                : selectedOffer.bgvStatus === "In Progress"
                                  ? "bg-info"
                                  : "bg-warning text-dark"
                          }`}
                        >
                          {selectedOffer.bgvStatus || "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <strong>Initiated Date:</strong>
                      <div>
                        {selectedOffer.bgvDetails?.initiatedDate || "N/A"}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <strong>Completed Date:</strong>
                      <div>
                        {selectedOffer.bgvDetails?.completedDate || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <strong>Verified By:</strong>{" "}
                    {selectedOffer.bgvDetails?.verifiedBy || "N/A"}
                  </div>

                  {selectedOffer.bgvDetails?.remarks && (
                    <div className="mt-3 p-2 bg-light border rounded">
                      <strong>Remarks:</strong>
                      <div className="small mt-1">
                        {selectedOffer.bgvDetails.remarks}
                      </div>
                    </div>
                  )}
                </div>

                {/* Verification Components */}
                <div>
                  <h6 className="fw-semibold mb-3 text-primary d-flex align-items-center">
                    <Icon icon="heroicons:document-check" className="me-2" />
                    Verification Checks
                  </h6>

                  <div className="row g-3">
                    {[
                      "Education",
                      "Employment",
                      "Criminal Record",
                      "Address",
                    ].map((item, idx) => (
                      <div className="col-md-6" key={idx}>
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1 fw-bold">{item}</h6>
                              <small className="text-muted">
                                Status:{" "}
                                <span className="badge bg-success">
                                  Verified
                                </span>
                              </small>
                            </div>
                            <Icon
                              icon="heroicons:check-circle"
                              className="text-success"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowBGVModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reference Check Modal */}
        {showReferenceCheckModal && selectedOffer && (
          <div className="hrms-modal-overlay">
            <div  className="hrms-modal hrms-modal-offer-xl animate-scale-in d-flex flex-column" >
              {/* Header */}
              <div className="hrms-modal-header">
                <h5 className="hrms-modal-title d-flex align-items-center">
                  <Icon
                    icon="heroicons:user-group"
                    className="me-2 text-primary"
                  />
                  Reference Check Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReferenceCheckModal(false)}
                ></button>
              </div>

              {/* Body */}
              <div className="hrms-modal-body hrms-modal-body-scroll">
                
                {/* Candidate Info */}
                <div className="mb-4 p-3 border rounded bg-light">
                  <h6 className="fw-bold mb-3 text-primary">
                    <Icon icon="heroicons:user-circle" className="me-2" />
                    Candidate Information
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Name:</strong> {selectedOffer.candidateName}
                      </p>
                      <p>
                        <strong>Position:</strong> {selectedOffer.position}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Department:</strong> {selectedOffer.department}
                      </p>
                      <p>
                        <strong>Offer Date:</strong> {selectedOffer.offerDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reference Check Info */}
                {selectedOffer.referenceCheck &&
                typeof selectedOffer.referenceCheck === "object" ? (
                  <>
                    <div className="mb-4">
                      <h6 className="fw-bold text-success mb-3">
                        <Icon
                          icon="heroicons:clipboard-document-check"
                          className="me-2"
                        />
                        Verification Summary
                      </h6>

                      <div className="row mb-3">
                        <div className="col-md-4">
                          <strong>Status:</strong>
                          <div>
                            <span
                              className={`badge ${
                                selectedOffer.referenceCheck.status ===
                                "Approved"
                                  ? "bg-success"
                                  : selectedOffer.referenceCheck.status ===
                                      "Rejected"
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                              }`}
                            >
                              {selectedOffer.referenceCheck.status}
                            </span>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <strong>Checked By:</strong>
                          <div>{selectedOffer.referenceCheck.checkedBy}</div>
                        </div>

                        <div className="col-md-4">
                          <strong>Check Date:</strong>
                          <div>{selectedOffer.referenceCheck.checkDate}</div>
                        </div>
                      </div>

                      {selectedOffer.referenceCheck.feedback && (
                        <div className="mb-3">
                          <strong>Overall Feedback:</strong>
                          <div className="border rounded p-2 bg-light mt-1">
                            {selectedOffer.referenceCheck.feedback}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* References List */}
                    {selectedOffer.referenceCheck.references &&
                      selectedOffer.referenceCheck.references.length > 0 && (
                        <div>
                          <h6 className="fw-bold mb-3 text-primary">
                            <Icon icon="heroicons:users" className="me-2" />
                            Reference Contacts
                          </h6>

                          {selectedOffer.referenceCheck.references.map(
                            (ref, idx) => (
                              <div
                                key={idx}
                                className="card mb-3 shadow-sm border-0"
                              >
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h6 className="mb-1 fw-bold">
                                        {ref.name}
                                      </h6>
                                      <p className="mb-1 text-muted small">
                                        {ref.designation} | {ref.company}
                                      </p>
                                    </div>
                                    <Icon
                                      icon="heroicons:phone"
                                      className="text-secondary"
                                    />
                                  </div>

                                  {ref.feedback && (
                                    <div className="mt-2 p-2 bg-light rounded small">
                                      <strong>Feedback:</strong> {ref.feedback}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                  </>
                ) : (
                  <div className="text-center text-muted py-4">
                    <Icon icon="heroicons:information-circle" width="28" />
                    <p className="mt-2 mb-0">
                      No reference check information available.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowReferenceCheckModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Version History Modal */}
        {showVersionHistoryModal && selectedOffer && (
          <div
            className="modal fade show d-block"
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
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowVersionHistoryModal(false);
              }
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                e.stopPropagation();
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title d-flex align-items-center">
                    <Icon icon="heroicons:clock" className="me-2" />
                    Version History
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowVersionHistoryModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Current Version:</strong>{" "}
                    {selectedOffer.version || 1}
                  </p>
                  {selectedOffer.versionHistory &&
                  selectedOffer.versionHistory.length > 0 ? (
                    <div className="mt-3">
                      <h6>Previous Versions:</h6>
                      {selectedOffer.versionHistory.map((version, idx) => (
                        <div key={idx} className="border p-2 mb-2 rounded">
                          <p>
                            <strong>Version {version.version}</strong> -{" "}
                            {version.date}
                          </p>
                          <p className="small">
                            Status: {version.status} | CTC: {version.ctc}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No previous versions</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowVersionHistoryModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Template Customization Modal */}
        {showTemplateModal && selectedTemplate && (
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
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowTemplateModal(false);
                setSelectedTemplate(null);
              }
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                e.stopPropagation();
              }
            }}
          >
            <div
              className="modal-content bg-white"
              style={{
                width: "60%",
                maxWidth: "900px",
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
              {/* Header */}
              <div className="modal-header bg-white border-bottom">
                  <h5 className="modal-title d-flex align-items-center">
                    <Icon icon="heroicons:document-text" className="me-2" />
                    Customize Template: {selectedTemplate.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowTemplateModal(false);
                      setSelectedTemplate(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <h6>Template Sections:</h6>
                    <ul>
                      {selectedTemplate.sections.map((section, idx) => (
                        <li key={idx}>{section.replace(/_/g, " ")}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <h6>Customizable Fields:</h6>
                    <ul>
                      {selectedTemplate.customizableFields.map((field, idx) => (
                        <li key={idx}>{field.replace(/_/g, " ")}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <h6>Default Terms:</h6>
                    <textarea
                      className="form-control"
                      rows="6"
                      value={formData.terms}
                      onChange={(e) =>
                        setFormData({ ...formData, terms: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowTemplateModal(false);
                      setSelectedTemplate(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary d-inline-flex align-items-center gap-2"
                    onClick={() => {
                      setShowTemplateModal(false);
                      setSelectedTemplate(null);
                    }}
                  >
                    <Icon icon="heroicons:check" className="me-2" />
                    Apply Template
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* E-Signature Modal */}
        {showESignatureModal && selectedOffer && (
          <div
            className="modal fade show d-block"
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
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowESignatureModal(false);
              }
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                e.stopPropagation();
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title d-flex align-items-center">
                    <Icon icon="heroicons:check-badge" className="me-2" />
                    Digital Signature
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowESignatureModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Accept offer with digital signature for{" "}
                    <strong>{selectedOffer.candidateName}</strong>?
                  </p>
                  <div className="alert alert-info">
                    <Icon
                      icon="heroicons:information-circle"
                      className="me-2"
                    />
                    Digital signature will be captured along with IP address and
                    device information.
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowESignatureModal(false)}
                  >
                    Cancel
                  </button>
<button
  type="button"
  className="btn btn-success d-flex align-items-center"
  onClick={handleConfirmESignature}
>
  <Icon icon="heroicons:check-badge" className="me-2" />
  <span>Confirm Signature</span>
</button>

                </div>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </>
  );
};

export default OfferManagement;