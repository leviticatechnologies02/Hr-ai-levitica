import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import html2pdf from 'html2pdf.js';
import StatCard from "../../../shared/components/StatCard";
import Modal from "../../../shared/components/Modal";
import { apiCall } from "../../../shared/utils/api";
import { API_ENDPOINTS } from "../../../shared/constants/api.config";

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [declineReason, setDeclineReason] = useState("");
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
    relation: "select",
    fatherName: "",
    customRelation: "",
    guardianGender: "",
    guardianPhone: "",
    isLegalGuardian: false,
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

  const OFFER_TYPES = ["Full-time", "Contract", "Internship", "Consultant"];

  
  const APPROVAL_WORKFLOWS = [
    {
      id: "direct",
      name: "Direct Manager → HR",
      steps: [
        { level: 1, role: "Direct Manager", required: true, autoApprove: false },
        { level: 2, role: "HR Manager", required: true, autoApprove: false },
      ],
    },
    {
      id: "multi",
      name: "Manager → HR Head → CEO",
      steps: [
        { level: 1, role: "Direct Manager", required: true, autoApprove: false },
        { level: 2, role: "HR Head", required: true, autoApprove: false },
        { level: 3, role: "CEO", required: true, autoApprove: false },
      ],
    },
    {
      id: "auto",
      name: "Auto-approval (Below ₹10L)",
      steps: [
        { level: 1, role: "Direct Manager", required: false, autoApprove: true },
        { level: 2, role: "HR Manager", required: true, autoApprove: false },
      ],
      conditions: { maxCTC: 1000000 },
    },
  ];

  const [kpi, setKpi] = useState(null);
  const [tabCounts, setTabCounts] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    loadOffersFromBackend();
    loadKpiAndTabCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch whenever search/filter/tab change, since the backend does
  // filtering server-side (GET /offer-letters?search=&status=&department=&offer_type=)
  useEffect(() => {
    loadOffersFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filters.status, filters.department, filters.offerType, activeTab]);

  const loadOffersFromBackend = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      // activeTab (the status tabs) takes priority over the status filter dropdown
      const statusParam = activeTab !== "all" ? activeTab : (filters.status !== "all" ? filters.status : "");
      if (statusParam) params.set("status", statusParam);
      if (filters.department !== "all") params.set("department", filters.department);
      if (filters.offerType !== "all") params.set("offer_type", filters.offerType);
      params.set("limit", "200");

      const data = await apiCall(`${API_ENDPOINTS.OFFER_LETTERS.LIST}?${params.toString()}`);
      // Backend returns OfferListItemSchema[] with snake_case fields; adapt
      // to the camelCase shape this component's render code already expects.
      const adapted = (data || []).map(mapOfferFromBackend);
      setOffers(adapted);
    } catch (err) {
      setLoadError(err.message);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadKpiAndTabCounts = async () => {
    try {
      const [kpiData, tabData] = await Promise.all([
        apiCall(API_ENDPOINTS.OFFER_LETTERS.KPI),
        apiCall(API_ENDPOINTS.OFFER_LETTERS.TAB_COUNTS),
      ]);
      setKpi(kpiData);
      setTabCounts(tabData);
    } catch (err) {
      console.error("Failed to load offer KPIs/tab counts:", err.message);
    }
  };

  // Backend (snake_case, OfferListItemSchema) -> this component's existing
  // camelCase field names, so the rest of the render code below doesn't
  // need to change.
  const mapOfferFromBackend = (o) => ({
    id: o.id,
    candidateId: o.candidate_id,
    candidateName: o.candidate_name,
    email: o.candidate_email,
    phone: o.candidate_phone,
    candidateSource: o.candidate_source,
    position: o.position,
    department: o.department,
    offerType: o.employment_type,
    joiningDate: o.join_date,
    grade: o.grade,
    experience: o.experience_required,
    ctc: o.gross_salary,
    ctcBreakup: o.salary_breakdown ? {
      basic: o.salary_breakdown.basic,
      hra: o.salary_breakdown.hra,
      conveyance: o.salary_breakdown.conveyance,
      specialAllowance: o.salary_breakdown.special_allowance,
      // NOTE: the backend's salary breakdown only has these 4 components
      // plus performance_bonus/stipend/other/gross_total. Fields this
      // mock UI also tracks locally (telephoneAllowance, medicalAllowance,
      // employeePF, professionalTax, gratuityEmployee, employerPF,
      // groupInsurance) have no backend column and are NOT persisted.
    } : {},
    offerStatus: o.status,
    history: (o.timeline || []).map((t) => ({
      action: t.event,
      by: t.actor,
      date: t.timestamp,
      status: o.status,
    })),
    expiryDate: o.expiry_date,
    sentDate: o.sent_date,
    responseDate: o.response_date,
    terms: o.offer_content,
    notes: o.notes,
    createdDate: o.created_at,
    lastModified: o.updated_at,
  });

  const parseAmount = (value) => {
    if (!value) return 0;
    return parseFloat(value.toString().replace(/,/g, '')) || 0;
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('en-IN');
  };

  const calculateGrossSalary = (breakup) => {
    const gross = parseAmount(breakup.basic) + parseAmount(breakup.hra) +
      parseAmount(breakup.specialAllowance) + parseAmount(breakup.conveyance) +
      parseAmount(breakup.telephoneAllowance) + parseAmount(breakup.medicalAllowance);
    return formatAmount(gross);
  };

  const calculateTotalDeductions = (breakup) => {
    return parseAmount(breakup.employeePF) + parseAmount(breakup.professionalTax) + parseAmount(breakup.gratuityEmployee);
  };

  const calculateNetTakeHome = (breakup) => {
    const gross = parseAmount(breakup.basic) + parseAmount(breakup.hra) +
      parseAmount(breakup.specialAllowance) + parseAmount(breakup.conveyance) +
      parseAmount(breakup.telephoneAllowance) + parseAmount(breakup.medicalAllowance);
    const deductions = calculateTotalDeductions(breakup);
    return formatAmount(gross - deductions);
  };

  const calculateTotalMonthlyCTC = (breakup) => {
    const gross = parseAmount(breakup.basic) + parseAmount(breakup.hra) +
      parseAmount(breakup.specialAllowance) + parseAmount(breakup.conveyance) +
      parseAmount(breakup.telephoneAllowance) + parseAmount(breakup.medicalAllowance);
    const employerContributions = parseAmount(breakup.employerPF) + parseAmount(breakup.groupInsurance);
    return formatAmount(gross + employerContributions);
  };

  const calculateAnnualCTC = (breakup) => {
    const monthlyCTC = parseAmount(calculateTotalMonthlyCTC(breakup).replace(/,/g, ''));
    return formatAmount(monthlyCTC * 12);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case OFFER_STATUS.DRAFT: return { color: "blue", text: "Draft", icon: "heroicons:document-text", bgClass: "bg-blue-100 text-blue-800", buttonClass: "bg-blue-600" };
      case OFFER_STATUS.PENDING_APPROVAL: return { color: "yellow", text: "Pending Approval", icon: "heroicons:clock", bgClass: "bg-yellow-100 text-yellow-800", buttonClass: "bg-yellow-600" };
      case OFFER_STATUS.APPROVED: return { color: "cyan", text: "Approved", icon: "heroicons:check-circle", bgClass: "bg-cyan-100 text-cyan-800", buttonClass: "bg-cyan-600" };
      case OFFER_STATUS.SENT: return { color: "gray", text: "Sent", icon: "heroicons:paper-airplane", bgClass: "bg-gray-100 text-gray-800", buttonClass: "bg-gray-600" };
      case OFFER_STATUS.ACCEPTED: return { color: "green", text: "Accepted", icon: "heroicons:check-badge", bgClass: "bg-green-100 text-green-800", buttonClass: "bg-green-600" };
      case OFFER_STATUS.DECLINED: return { color: "red", text: "Declined", icon: "heroicons:x-circle", bgClass: "bg-red-100 text-red-800", buttonClass: "bg-red-600" };
      case OFFER_STATUS.EXPIRED: return { color: "dark", text: "Expired", icon: "heroicons:clock", bgClass: "bg-gray-800 text-white", buttonClass: "bg-gray-800" };
      case OFFER_STATUS.WITHDRAWN: return { color: "red", text: "Withdrawn", icon: "heroicons:arrow-uturn-left", bgClass: "bg-red-100 text-red-800", buttonClass: "bg-red-600" };
      default: return { color: "gray", text: "Unknown", icon: "heroicons:question-mark-circle", bgClass: "bg-gray-100 text-gray-800", buttonClass: "bg-gray-600" };
    }
  };

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
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const [savingOffer, setSavingOffer] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Maps this form's field names onto OfferCreateSchema/OfferUpdateSchema.
  // NOTE: several fields the mock UI collects have no home in the backend
  // schema at all (referralDetails, guardian/relation fields, address,
  // approvalWorkflow steps, enableBGV, requireDigitalSignature,
  // businessUnit, costCenter, shiftPolicy, weekOffPolicy, employee PF /
  // professional tax / gratuity / employer PF / group insurance breakup
  // lines). These stay in local form state for the UI to display/collect,
  // but are NOT sent to or persisted by the backend until it's extended.
  const buildOfferPayload = () => ({
    candidate_id: selectedOffer?.candidateId ?? null,
    candidate_name: formData.candidateName,
    candidate_email: formData.email,
    candidate_phone: formData.phone || null,
    candidate_source: formData.candidateSource === "Other" ? formData.customSource : formData.candidateSource || null,
    position: formData.position,
    department: formData.department || null,
    employment_type: formData.offerType || "Full-time",
    join_date: formData.joiningDate || null,
    grade: formData.grade || null,
    experience_required: formData.experience || null,
    gross_salary: parseAmount(formData.ctc) || null,
    basic: parseAmount(formData.ctcBreakup.basic) || null,
    hra: parseAmount(formData.ctcBreakup.hra) || null,
    conveyance: parseAmount(formData.ctcBreakup.conveyance) || null,
    special_allowance: parseAmount(formData.ctcBreakup.specialAllowance) || null,
    offer_content: formData.terms,
    expiry_date: formData.expiryDate || null,
    notes: formData.notes || null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingOffer(true);
    setSaveError(null);

    try {
      const payload = buildOfferPayload();
      if (selectedOffer) {
        await apiCall(API_ENDPOINTS.OFFER_LETTERS.UPDATE(selectedOffer.id), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await apiCall(API_ENDPOINTS.OFFER_LETTERS.CREATE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      await loadOffersFromBackend();
      await loadKpiAndTabCounts();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSavingOffer(false);
    }
  };

  const resetForm = () => {
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
      referralDetails: { employeeId: "", role: "", designation: "", experience: "" },
      ctc: "",
      gender: "male",
      relation: "select",
      fatherName: "",
      customRelation: "",
      guardianGender: "",
      guardianPhone: "",
      isLegalGuardian: false,
      address: { street: "", city: "", district: "", state: "", customState: "", pincode: "" },
      ctcBreakup: {
        basic: "", hra: "", specialAllowance: "", conveyance: "", telephoneAllowance: "",
        medicalAllowance: "", employeePF: "", professionalTax: "", gratuityEmployee: "",
        employerPF: "", groupInsurance: "",
      },
      joiningDate: "",
      offerType: "Full-time",
      template: "standard",
      terms: `1. This offer is subject to background verification.\n2. You will be on probation for 3 months.\n3. Standard company policies apply.\n4. Please acknowledge acceptance by the expiry date.`,
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

  const handleEdit = (offer) => {
    setSelectedOffer(offer);
    setFormData({
      ...formData,
      ...offer,
      address: { ...formData.address, ...(offer.address || {}) },
      referralDetails: { ...formData.referralDetails, ...(offer.referralDetails || {}) },
      ctcBreakup: { ...formData.ctcBreakup, ...(offer.ctcBreakup || {}) },
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await apiCall(API_ENDPOINTS.OFFER_LETTERS.DELETE(id), { method: "DELETE" });
      await loadOffersFromBackend();
      await loadKpiAndTabCounts();
    } catch (err) {
      alert(`Failed to delete offer: ${err.message}`);
    }
  };

  const generateEmailContent = (offer) => {
    const joiningDate = new Date(offer.joiningDate).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric"
    });

    return {
      subject: `Offer Letter - ${offer.position} | Levitica Technologies Pvt. Ltd.`,
      body: `Dear ${offer.candidateName},\n\nWe are pleased to offer you the position of ${offer.position} at Levitica Technologies Pvt. Ltd. Please find your offer letter attached to this email.\n\nYour skills and background align well with our expectations, and we are confident that you will be a valuable addition to our team. As mentioned in the offer, your joining date is ${joiningDate}.\n\nWe kindly request you to carefully review the attached offer letter. If you accept the terms and conditions outlined, please sign the document and send a scanned copy to us at your earliest convenience to confirm your acceptance.\n\nOn-boarding Location:\nPlease report to Office #407 for the on-boarding process. Our team will be available there to assist you.\nLevitica Technologies Pvt.Ltd,\nOffice #407 & #409, 4th Floor,\nJain Sadguru Image's,\nCapital Park Road, Ayyappa Society,\nVIP Hills, Madhapur,\nHyderabad, Telangana – 500081.\n\nNote:\nPlease carry your original certificates including your 10th and Intermediate mark sheets for verification along with Xerox copies.\nBring one passport-size photograph (hard copy + soft copy).\n\nShould you have any questions or need clarification, please feel free to reach out.\n\nWe look forward to welcoming you to the Levitica family and beginning an exciting journey of growth and innovation together.\n\nBest Regards,\nHR Team\nLevitica Technologies Pvt. Ltd.\nhr@leviticatechnologies.com`,
    };
  };

  const handleSendEmailFromPreview = (offer) => {
    if (!offer || !offer.email) {
      alert("Candidate email address is missing!");
      return;
    }

    const { subject, body } = generateEmailContent(offer);

    const updatedOffers = offers.map((o) =>
      o.id === offer.id
        ? {
          ...o,
          offerStatus: OFFER_STATUS.SENT,
          emailSent: true,
          emailSentDate: new Date().toISOString(),
          history: [
            ...(o.history || []),
            { action: "Offer Sent via Email", by: "HR Admin", date: new Date().toISOString(), status: OFFER_STATUS.SENT },
          ],
        }
        : o
    );
    setOffers(updatedOffers);
    alert(`Offer letter sent successfully to ${offer.candidateName} (${offer.email})`);
    setShowPreview(false);
    window.location.href = `mailto:${offer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const generateOfferLetterPDF = (offer) => {
    if (!offer) return;

    const companyName = "Levitica Technologies Private Limited";
    const companyAddress = "Office #409, 4th Floor, Jain Sadguru Image's, Capital Pk Rd, Ayyappa Society, Madhapur, Hyderabad, Telangana 500081";
    const companyPhone = "+91 63056 75199";
    const companyEmail = "hr@leviticatechnologies.com";
    const companyWebsite = "www.leviticatechnologies.com";
    const companyCIN = "U72200TG2013PTC091836";

    const candidateName = offer?.candidateName || "Candidate";
    const position = offer?.position || "Position";
    const joiningDate = offer?.joiningDate || "TBD";
    const ctc = offer?.ctc || "0";
    const gender = offer?.gender || "male";
    const fatherName = offer?.fatherName || "";
    const relation = offer?.relation || "";
    const address = offer?.address || { street: "", city: "", district: "", state: "", pincode: "" };

    const getSalutation = (gender) => {
      switch (gender) {
        case 'female': return 'Ms.';
        case 'male': return 'Mr.';
        default: return 'Mr./Ms.';
      }
    };

    const salutation = getSalutation(gender);
    const currentDate = new Date();
    const currentDateLong = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const ctcBreakup = offer?.ctcBreakup || {
      basic: "0", hra: "0", specialAllowance: "0", conveyance: "0", telephone: "0",
      medical: "0", grossSalary: "0", employeePF: "0", professionalTax: "0",
      gratuity: "0", netTakeHome: "0", employerPF: "0", groupInsurance: "0",
      totalCTCMonthly: "0", performanceBonus: "0"
    };

    
    const validBreakupItems = breakupItems.filter(item => item.amount > 0);
    const calculatedTotal = validBreakupItems.reduce((sum, item) => sum + item.amount, 0);

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #3F2D69;">${companyName}</h2>
          <p>${companyAddress}</p>
          <p>Phone: ${companyPhone} | Email: ${companyEmail}</p>
          <hr />
        </div>
        
        <h3 style="color: #1E4E8C;">LETTER OF EMPLOYMENT</h3>
        
        <p><strong>Date:</strong> ${currentDateLong}</p>
        
        <p><strong>To,</strong><br/>
        ${salutation} ${candidateName}<br/>
        ${relation} ${fatherName}<br/>
        ${address.street}, ${address.city}<br/>
        ${address.district}, ${address.state} - ${address.pincode}
        </p>
        
        <p>Dear <strong>${candidateName}</strong>,</p>
        
        <p>We are pleased to extend an offer for the position of <strong>"${position}"</strong> at Levitica Technologies Pvt. Ltd., with your confirmed joining date of <strong>${joiningDate}</strong>. This offer is subject to the following terms and conditions.</p>
        
        <h4 style="color: #1E4E8C; margin-top: 20px;">1. Compensation & Benefits</h4>
        <p>Your total Annual Cost to Company (CTC) will be INR <strong>${ctc}</strong>.</p>
        
        <h4 style="color: #1E4E8C; margin-top: 20px;">Annexure - A: Compensation Breakup</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #3F2D69; color: white;">
              <th style="padding: 10px; text-align: left;">Component</th>
              <th style="padding: 10px; text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${validBreakupItems.map(item => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.label}</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${formatAmount(item.amount)}</td>
              </tr>
            `).join('')}
            <tr style="font-weight: bold; background-color: #f0f0f0;">
              <td style="padding: 10px;">Total Fixed CTC</td>
              <td style="padding: 10px; text-align: right;">${formatAmount(calculatedTotal)}</td>
            </tr>
          </tbody>
        </table>
        
        <h4 style="color: #1E4E8C; margin-top: 20px;">2. Period of Service</h4>
        <p>A six-month probation period will apply. Your performance will be assessed before confirmation.</p>
        
        <h4 style="color: #1E4E8C; margin-top: 20px;">3. Hours of Work</h4>
        <p>Workdays: 5 days/week. Working hours depend on your project or client location.</p>
        
        <h4 style="color: #1E4E8C; margin-top: 20px;">4. Leaves & Holidays</h4>
        <p>You are entitled to 18 days of leave per year (12 paid + 6 casual), pro-rated from the date of joining.</p>
        
        <h4 style="color: #1E4E8C; margin-top: 20px;">5. Termination of Employment</h4>
        <p>You are required to serve a notice period of two months prior to separation. Failure to serve the notice period will require payment equivalent to your gross salary.</p>
        
        <div style="margin-top: 40px;">
          <p>Sincerely,</p>
          <p><strong>For Levitica Technologies Pvt. Ltd</strong></p>
          <br/>
          <p>Authorized Signature</p>
        </div>
        
        <div style="margin-top: 40px; text-align: center; font-size: 12px; border-top: 1px solid #ccc; padding-top: 10px;">
          <strong>${companyName}</strong><br/>
          ${companyAddress}
        </div>
      </div>
    `;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Offer_Letter_${candidateName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleSendOffer = (offer) => {
    setSelectedOffer(offer);
    setShowSendModal(true);
  };

  const handleConfirmSendOffer = async () => {
    if (!selectedOffer) return;

    try {
      // send-email only sends the email; it does not change status on its
      // own (confirmed in services/offer_letter_service.py), so the status
      // transition to "Sent" needs a separate /action call.
      if (emailSettings.sendEmail) {
        await apiCall(API_ENDPOINTS.OFFER_LETTERS.SEND_EMAIL(selectedOffer.id), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            offer_id: selectedOffer.id,
            recipient_email: selectedOffer.email,
            expiry_days: 30,
          }),
        });
      }
      await apiCall(API_ENDPOINTS.OFFER_LETTERS.ACTION(selectedOffer.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send" }),
      });
      await loadOffersFromBackend();
      await loadKpiAndTabCounts();
      setShowSendModal(false);
      alert(`Offer sent to ${selectedOffer.candidateName}`);
    } catch (err) {
      alert(`Failed to send offer: ${err.message}`);
    }
  };

  const handleAcceptOffer = async (offer) => {
    try {
      await apiCall(API_ENDPOINTS.OFFER_LETTERS.ACTION(offer.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });
      await loadOffersFromBackend();
      await loadKpiAndTabCounts();
      alert(`Offer accepted by ${offer.candidateName}`);
    } catch (err) {
      alert(`Failed to accept offer: ${err.message}`);
    }
  };

  const handleDeclineOffer = (offer) => {
    setSelectedOffer(offer);
    setShowDeclineModal(true);
  };

  const handleConfirmDecline = async () => {
    if (!selectedOffer) return;

    try {
      await apiCall(API_ENDPOINTS.OFFER_LETTERS.ACTION(selectedOffer.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline", remarks: declineReason }),
      });
      await loadOffersFromBackend();
      await loadKpiAndTabCounts();
      setShowDeclineModal(false);
      setDeclineReason("");
      alert(`Offer declined by ${selectedOffer.candidateName}`);
    } catch (err) {
      alert(`Failed to decline offer: ${err.message}`);
    }
  };

  const handleWithdrawOffer = (offer) => {
    setSelectedOffer(offer);
    setShowWithdrawModal(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!selectedOffer || !withdrawReason.trim()) {
      alert("Please provide a reason for withdrawing the offer");
      return;
    }

    try {
      await apiCall(API_ENDPOINTS.OFFER_LETTERS.ACTION(selectedOffer.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "withdraw", remarks: withdrawReason }),
      });
      await loadOffersFromBackend();
      await loadKpiAndTabCounts();
      setShowWithdrawModal(false);
      setWithdrawReason("");
      alert(`Offer withdrawn for ${selectedOffer.candidateName}`);
    } catch (err) {
      alert(`Failed to withdraw offer: ${err.message}`);
    }
  };

  // NOTE: the backend only supports a single "approve" action per offer —
  // there is no multi-level approval-chain concept on the server
  // (ACTION_STATUS_MAP in offer_letter_service.py has exactly one
  // "approve" -> "approved" transition). The mock UI's multi-level
  // APPROVAL_WORKFLOWS (Direct Manager -> HR Manager -> CEO, etc.) has
  // nowhere to persist per-level state, so every level's "Approve" button
  // now calls the same backend action; the offer becomes fully "approved"
  // on the first click rather than progressing level by level. Flagging
  // this rather than faking multi-level state that the backend would
  // silently discard.
  const handleApproveOffer = async (offer, level) => {
    try {
      await apiCall(API_ENDPOINTS.OFFER_LETTERS.ACTION(offer.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      await loadOffersFromBackend();
      await loadKpiAndTabCounts();
      alert(`Offer approved (backend supports a single approval step, not per-level tracking)`);
    } catch (err) {
      alert(`Failed to approve offer: ${err.message}`);
    }
  };

  const getOffersByStatus = (status) => {
    const filtered = offers.filter((offer) => {
      const matchesSearch = offer.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === "all" || offer.offerStatus === filters.status;
      const matchesDepartment = filters.department === "all" || offer.department === filters.department;
      const matchesOfferType = filters.offerType === "all" || offer.offerType === filters.offerType;
      return matchesSearch && matchesStatus && matchesDepartment && matchesOfferType;
    });

    if (status === "all") return filtered;
    return filtered.filter((offer) => offer.offerStatus === status);
  };

  const calculateStats = () => ({
    total: offers.length,
    draft: offers.filter((o) => o.offerStatus === OFFER_STATUS.DRAFT).length,
    pending: offers.filter((o) => o.offerStatus === OFFER_STATUS.PENDING_APPROVAL).length,
    sent: offers.filter((o) => o.offerStatus === OFFER_STATUS.SENT).length,
    accepted: offers.filter((o) => o.offerStatus === OFFER_STATUS.ACCEPTED).length,
    declined: offers.filter((o) => o.offerStatus === OFFER_STATUS.DECLINED).length,
    expired: offers.filter((o) => o.offerStatus === OFFER_STATUS.EXPIRED).length,
  });

  const stats = calculateStats();

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h5 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Icon icon='heroicons:document-check' className="w-7 h-7" />
            Offer Management
          </h5>
          <p className="text-gray-500 text-sm">Manage candidate offers and onboarding process</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Icon icon="heroicons:plus" className="w-5 h-5" />
          Create New Offer
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard title="Total Offers" value={stats.total} icon="heroicons:document-text" color="blue" />
        <StatCard title="Draft" value={stats.draft} icon="heroicons:document-text" color="purple" />
        <StatCard title="Pending Approval" value={stats.pending} icon="heroicons:clock" color="yellow" />
        <StatCard title="Sent" value={stats.sent} icon="heroicons:paper-airplane" color="green" />
        <StatCard title="Accepted" value={stats.accepted} icon="heroicons:check-circle" color="emerald" />
        <StatCard title="Declined" value={stats.declined} icon="heroicons:x-circle" color="red" />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {["all", ...Object.values(OFFER_STATUS)].map((status) => {
              const statusConfig = status === "all"
                ? { text: "All Offers", icon: "heroicons:queue-list", buttonClass: activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700" }
                : getStatusConfig(status);
              return (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === status
                    ? statusConfig.buttonClass + " text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => setActiveTab(status)}
                >
                  <Icon icon={statusConfig.icon} className="w-4 h-4" />
                  {status === "all" ? "All Offers" : statusConfig.text}
                  {status !== "all" && (
                    <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">
                      {offers.filter((o) => o.offerStatus === status).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Icon icon="heroicons:magnifying-glass" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search candidates, position, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              {Object.entries(OFFER_STATUS).map(([key, value]) => (
                <option key={value} value={value}>{key.replace(/_/g, " ")}</option>
              ))}
            </select>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.offerType}
              onChange={(e) => setFilters({ ...filters, offerType: e.target.value })}
            >
              <option value="all">All Offer Types</option>
              {OFFER_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-3 text-gray-500">Loading offers...</p>
            </div>
          ) : getOffersByStatus(activeTab).length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Icon icon="heroicons:document-magnifying-glass" className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No offers found</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 text-sm"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <Icon icon="heroicons:plus" className="w-4 h-4" />
                Create Your First Offer
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Position & Department</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Offer Details</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status & Timeline</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getOffersByStatus(activeTab).map((offer) => {
                    const statusConfig = getStatusConfig(offer.offerStatus);
                    return (
                      <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {offer.candidateName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{offer.candidateName}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                <Icon icon="heroicons:envelope" className="w-3 h-3" />
                                {offer.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                <Icon icon="heroicons:phone" className="w-3 h-3" />
                                {offer.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{offer.position}</div>
                          <div className="text-sm text-gray-500">{offer.department}</div>
                          <div className="text-xs text-gray-400">Grade: {offer.grade} | Exp: {offer.experience || "N/A"}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-green-600">₹{offer.ctc}</div>
                          <div className="text-sm text-gray-500">{offer.offerType} | Join: {offer.joiningDate}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgClass}`}>
                            <Icon icon={statusConfig.icon} className="w-3 h-3 mr-1" />
                            {statusConfig.text}
                          </span>
                          {offer.acceptanceDate && (
                            <div className="text-xs text-green-600 mt-1">Accepted: {new Date(offer.acceptanceDate).toLocaleDateString()}</div>
                          )}
                          {offer.declineReason && (
                            <div className="text-xs text-red-600 mt-1">Reason: {offer.declineReason}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              onClick={() => {
                                setSelectedOffer(offer);
                                setShowPreview(true);
                              }}
                              title="View Details"
                            >
                              <Icon icon="heroicons:eye" className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              onClick={() => handleEdit(offer)}
                              disabled={[OFFER_STATUS.ACCEPTED, OFFER_STATUS.DECLINED, OFFER_STATUS.WITHDRAWN].includes(offer.offerStatus)}
                              title="Edit Offer"
                            >
                              <Icon icon="heroicons:pencil-square" className="w-4 h-4" />
                            </button>
                            {(offer.offerStatus === OFFER_STATUS.DRAFT || offer.offerStatus === OFFER_STATUS.APPROVED) && (
                              <button
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                onClick={() => handleSendOffer(offer)}
                                title="Send Offer"
                              >
                                <Icon icon="heroicons:paper-airplane" className="w-4 h-4" />
                              </button>
                            )}
                            {offer.offerStatus === OFFER_STATUS.SENT && (
                              <>
                                <button
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                  onClick={() => handleAcceptOffer(offer)}
                                  title="Accept Offer"
                                >
                                  <Icon icon="heroicons:check-badge" className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  onClick={() => handleDeclineOffer(offer)}
                                  title="Decline Offer"
                                >
                                  <Icon icon="heroicons:x-circle" className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {offer.offerStatus === OFFER_STATUS.PENDING_APPROVAL && (
                              <button
                                className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                onClick={() => {
                                  setSelectedOffer(offer);
                                  setShowApprovalModal(true);
                                }}
                                title="Approval Status"
                              >
                                <Icon icon="heroicons:clipboard-document-check" className="w-4 h-4" />
                              </button>
                            )}
                            {offer.offerStatus === OFFER_STATUS.ACCEPTED && (
                              <button
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                onClick={() => handleWithdrawOffer(offer)}
                                title="Withdraw Offer"
                              >
                                <Icon icon="heroicons:arrow-uturn-left" className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              onClick={() => handleDelete(offer.id)}
                              disabled={offer.offerStatus === OFFER_STATUS.ACCEPTED}
                              title="Delete Offer"
                            >
                              <Icon icon="heroicons:trash" className="w-4 h-4" />
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

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); resetForm(); }}
        title={selectedOffer ? "Edit Offer" : "Create New Offer"}
        size="xl"
      >
        <form onSubmit={handleSubmit} id="offerForm">
          <div className="mb-6">
            <h6 className="font-bold mb-3 border-b pb-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              <Icon icon="heroicons:user" className="w-4 h-4" />
              Candidate Information
            </h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="candidateName" value={formData.candidateName} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="position" value={formData.position} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="department" value={formData.department} onChange={handleInputChange}>
                  {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade <span className="text-red-500">*</span></label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="grade" value={formData.grade} onChange={handleInputChange}>
                  <option value="Intern">Intern</option>
                  <option value="L1">L1</option>
                  <option value="L2">L2</option>
                  <option value="L3">L3</option>
                  <option value="L4">L4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g., 3 years" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange}>
                  <option value="15 days">15 days</option>
                  <option value="30 days">30 days</option>
                  <option value="60 days">60 days</option>
                  <option value="90 days">90 days</option>
                  <option value="Immediate">Immediate</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h6 className="font-bold mb-3 border-b pb-2 flex items-center gap-2">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              <Icon icon="heroicons:currency-dollar" className="w-4 h-4" />
              Offer Details
            </h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTC (₹) <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="ctc" value={formData.ctc} onChange={handleInputChange} placeholder="12,00,000" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="offerType" value={formData.offerType} onChange={handleInputChange}>
                  {OFFER_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="terms" rows="5" value={formData.terms} onChange={handleInputChange} />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="notes" rows="3" value={formData.notes} onChange={handleInputChange} placeholder="Any special instructions or notes..." />
          </div>
        </form>
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button type="button" className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-semibold shadow-sm shadow-blue-100" form="offerForm">
            <Icon icon="heroicons:check" className="w-4 h-4" />
            {selectedOffer ? "Update Offer" : "Create Offer"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showPreview && !!selectedOffer}
        onClose={() => setShowPreview(false)}
        title="Offer Letter Preview"
        size="xl"
      >
        {selectedOffer && (
          <>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-center mb-6">
                  <h4 className="font-bold text-xl text-gray-900">Levitica Technologies PVT LTD</h4>
                  <p className="text-sm text-gray-600">Office #409, 4th Floor, Jain sadguru image's capital park, Ayyappa Society, VIP Hills, Silicon Valley, Madhapur, Hyderabad, Telangana 500081</p>
                  <hr className="my-3" />
                </div>
                <h5 className="font-bold mb-4">LETTER OF EMPLOYMENT</h5>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <div className="mb-4">
                  <p><strong>To,</strong></p>
                  <p className="font-bold">{selectedOffer.candidateName}</p>
                  <p>{selectedOffer.email}</p>
                  <p>{selectedOffer.phone}</p>
                </div>
                <p>Dear <strong>{selectedOffer.candidateName}</strong>,</p>
                <p className="mt-2">We are delighted to offer you the position of <strong>{selectedOffer.position}</strong> in the <strong>{selectedOffer.department}</strong> department at Levitica Technologies Private Limited.</p>
                <p>Your employment will commence on <strong>{selectedOffer.joiningDate}</strong>. This offer is subject to successful completion of background verification and pre-employment formalities.</p>
                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <h6 className="font-bold mb-3">OFFER DETAILS</h6>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><strong>Position:</strong> {selectedOffer.position}</p>
                    <p><strong>Department:</strong> {selectedOffer.department}</p>
                    <p><strong>Grade:</strong> {selectedOffer.grade}</p>
                    <p><strong>Employment Type:</strong> {selectedOffer.offerType}</p>
                    <p><strong>Joining Date:</strong> {selectedOffer.joiningDate}</p>
                    <p><strong>Annual CTC:</strong> <span className="font-bold text-green-600">₹{selectedOffer.ctc}</span></p>
                  </div>
                </div>
                <div className="mt-6">
                  <h6 className="font-bold mb-2">TERMS AND CONDITIONS</h6>
                  <ol className="text-sm pl-4 space-y-1">
                    <li>Subject to satisfactory background verification.</li>
                    <li>Probation period of 3 months from joining date.</li>
                    <li>Employment governed by company policies.</li>
                    <li>Offer valid until {selectedOffer.expiryDate}.</li>
                  </ol>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8 pt-4 text-center">
                  <div>
                    <p className="font-bold">For Levitica Technologies PVT LTD</p>
                    <div className="border-t border-gray-300 w-48 mx-auto my-2"></div>
                    <p>Authorized Signatory</p>
                  </div>
                  <div>
                    <p className="font-bold">Accepted By</p>
                    <div className="border-t border-gray-300 w-48 mx-auto my-2"></div>
                    <p>{selectedOffer.candidateName}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
              <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium" onClick={() => setShowPreview(false)}>Close</button>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-semibold shadow-sm shadow-blue-100" onClick={() => generateOfferLetterPDF(selectedOffer)}>
                  <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm font-semibold shadow-sm shadow-emerald-100" onClick={() => handleSendEmailFromPreview(selectedOffer)}>
                  <Icon icon="heroicons:envelope" className="w-4 h-4" />
                  Send via Email
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={showSendModal && !!selectedOffer}
        onClose={() => setShowSendModal(false)}
        title="Send Offer Letter"
        size="sm"
      >
        {selectedOffer && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-sm space-y-1">
              <p className="text-slate-600"><strong className="text-slate-800">Candidate:</strong> {selectedOffer.candidateName}</p>
              <p className="text-slate-600"><strong className="text-slate-800">Email:</strong> {selectedOffer.email}</p>
              <p className="text-slate-600"><strong className="text-slate-800">Position:</strong> {selectedOffer.position}</p>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <input type="checkbox" checked={emailSettings.sendEmail} onChange={(e) => setEmailSettings({ ...emailSettings, sendEmail: e.target.checked })} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                <span className="text-sm font-medium text-slate-700">Send via Email</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <input type="checkbox" checked={emailSettings.sendSMS} onChange={(e) => setEmailSettings({ ...emailSettings, sendSMS: e.target.checked })} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                <span className="text-sm font-medium text-slate-700">Send via SMS</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium" onClick={() => setShowSendModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-semibold shadow-sm shadow-blue-100" onClick={handleConfirmSendOffer}>
                <Icon icon="heroicons:paper-airplane" className="w-4 h-4" />
                Send Offer
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showDeclineModal && !!selectedOffer}
        onClose={() => { setShowDeclineModal(false); setDeclineReason(""); }}
        title="Decline Offer"
        size="sm"
      >
        {selectedOffer && (
          <div className="space-y-4">
            <p className="text-slate-700 text-sm">Mark offer for <strong className="text-slate-900">{selectedOffer.candidateName}</strong> as declined?</p>
            <select className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-slate-700" value={declineReason} onChange={(e) => setDeclineReason(e.target.value)}>
              <option value="">-- Select Reason --</option>
              {declineReasonsList.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
            </select>
            {declineReason === "Other" && (
              <textarea className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-slate-700" rows="3" placeholder="Enter custom reason..." value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} />
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium" onClick={() => { setShowDeclineModal(false); setDeclineReason(""); }}>Cancel</button>
              <button className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 text-sm font-semibold shadow-sm shadow-rose-100" onClick={handleConfirmDecline}>
                <Icon icon="heroicons:x-circle" className="w-4 h-4" />
                Confirm Decline
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showWithdrawModal && !!selectedOffer}
        onClose={() => { setShowWithdrawModal(false); setWithdrawReason(""); }}
        title="Withdraw Offer"
        size="sm"
      >
        {selectedOffer && (
          <div className="space-y-4">
            <p className="text-slate-700 text-sm">Withdraw offer for <strong className="text-slate-900">{selectedOffer.candidateName}</strong>?</p>
            <select className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-700" value={withdrawReason} onChange={(e) => setWithdrawReason(e.target.value)}>
              <option value="">-- Select Reason --</option>
              {withdrawReasonsList.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
            </select>
            {withdrawReason === "Other" && (
              <textarea className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-700" rows="3" placeholder="Enter custom reason..." value={withdrawReason} onChange={(e) => setWithdrawReason(e.target.value)} />
            )}
            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <Icon icon="heroicons:exclamation-triangle" className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
              <span>This action cannot be undone. The candidate will be notified.</span>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium" onClick={() => { setShowWithdrawModal(false); setWithdrawReason(""); }}>Cancel</button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2 text-sm font-semibold shadow-sm shadow-amber-100" onClick={handleConfirmWithdraw}>
                <Icon icon="heroicons:arrow-uturn-left" className="w-4 h-4" />
                Confirm Withdrawal
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showApprovalModal && !!selectedOffer}
        onClose={() => setShowApprovalModal(false)}
        title="Approval Workflow"
        size="md"
      >
        {selectedOffer && (
          <div className="space-y-4">
            {selectedOffer.approvalWorkflow?.steps.map((step, idx) => (
              <div key={idx} className={`p-3.5 rounded-2xl border transition-colors ${step.status === "approved" ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-slate-800 text-sm">Level {step.level}: {step.role}</strong>
                    <div className="text-xs mt-1 text-slate-600 flex items-center gap-1.5">
                      Status: <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${step.status === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{step.status === "approved" ? "Approved" : "Pending"}</span>
                    </div>
                    {step.approvedBy && <div className="text-[11px] text-slate-500 mt-1">Approved by: {step.approvedBy}</div>}
                  </div>
                  {step.status === "pending" && (
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm shadow-blue-100" onClick={() => handleApproveOffer(selectedOffer, step.level)}>
                      <Icon icon="heroicons:check" className="w-3.5 h-3.5" />
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors text-sm font-medium" onClick={() => setShowApprovalModal(false)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OfferManagement;