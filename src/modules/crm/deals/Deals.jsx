import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { dealsAPI } from "../../../shared/utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiList,
  FiDownload,
  FiFileText,
  FiTable,
  FiPlus,
  FiFilter,
  FiCalendar,
  FiStar,
  FiUser,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiX,
  FiAlertTriangle,
  FiBriefcase,
  FiTag,
  FiClock,
  FiFlag,
  FiFile,
  FiEye,
  FiChevronDown,
  FiMoreVertical
} from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';
import { FaTrophy } from "react-icons/fa";

const stageConfig = [
  { stage: "New", color: "primary", apiStage: "New" },
  { stage: "Prospect", color: "info", apiStage: "Prospect" },
  { stage: "Proposal", color: "warning", apiStage: "Proposal" },
  { stage: "Won", color: "success", apiStage: "Won" },
];

const formatAmount = (value) => {
  if (!value || value === 0) return "₹0";
  let numValue;
  if (typeof value === 'string') {
    numValue = parseFloat(value.replace(/[₹,/-]/g, ''));
  } else {
    numValue = value;
  }
  if (isNaN(numValue) || numValue === 0) return "₹0";
  const formatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 });
  return `₹${formatter.format(numValue)}`;
};

const formatPhoneNumber = (phone) => {
  if (!phone) return "Not available";
  const phoneStr = phone.toString().trim();
  if (!phoneStr) return "Not available";
  if (phoneStr.includes('+91')) return phoneStr;
  const cleaned = phoneStr.replace(/\D/g, '');
  if (!cleaned) return "Not available";
  if (cleaned.length === 10) return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  if (cleaned.length === 11 && cleaned.startsWith('0')) return `+91 ${cleaned.slice(1, 6)} ${cleaned.slice(6)}`;
  if (cleaned.length === 12 && cleaned.startsWith('91')) return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  if (cleaned.length === 10) return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  return cleaned;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  } catch (e) {
    return dateString;
  }
};

const calculateProgress = (deal) => {
  const stageProgress = { "New": 25, "Prospect": 50, "Proposal": 75, "Won": 100 };
  return stageProgress[deal.status || deal.stage || ""] || 0;
};

const makeInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const getFirstLetter = (name) => {
  if (!name || name === "Unassigned") return "?";
  return name.charAt(0).toUpperCase();
};

const extractPhoneNumber = (deal) => {
  const possiblePhoneFields = [
    'phone', 'mobile', 'Phone', 'Mobile', 'contact_number', 'mobile_number', 'phone_number',
    'contactNo', 'mobileNo', 'phoneNo', 'contact_phone', 'contact_mobile', 'primary_phone',
    'primary_mobile', 'customer_phone', 'customer_mobile', 'alternate_phone', 'alternate_mobile',
    'work_phone', 'work_mobile', 'home_phone', 'home_mobile', 'cell', 'cellphone', 'cell_phone',
    'telephone', 'tel', 'contact_tel', 'phone1', 'phone2', 'mobile1', 'mobile2', 'contact_phone_number',
    'contact_mobile_number', 'customer_phone_number', 'customer_mobile_number', 'phone_no', 'mobile_no',
    'contact_no', 'whatsapp', 'whatsapp_number', 'phone_1', 'phone_2', 'mobile_1', 'mobile_2',
    'primary_phone_number', 'secondary_phone', 'phonenumber', 'mobilenumber', 'contactnumber',
    'primaryphone', 'secondaryphone', 'phonenum', 'mobilenum', 'contactnum', 'contactPhone',
    'contactMobile', 'customerPhone', 'customerMobile', 'assigneePhone', 'ownerPhone', 'dealPhone',
    'dealMobile', 'phoneNumber', 'mobileNumber', 'contactNumber', 'phoneNum', 'mobileNum',
    'contactNum', 'contact_phone_num', 'contact_mobile_num', 'customer_phone_num', 'customer_mobile_num'
  ];

  for (const field of possiblePhoneFields) {
    if (deal[field] && deal[field].toString().trim()) return deal[field];
  }
  if (deal.contact && typeof deal.contact === 'object') {
    for (const field of possiblePhoneFields) {
      if (deal.contact[field] && deal.contact[field].toString().trim()) return deal.contact[field];
    }
  }
  return "";
};

const transformDealsToKanban = (dealsData) => {
  if (!Array.isArray(dealsData)) return stageConfig.map(s => ({ ...s, leads: 0, amount: "₹0", deals: [] }));

  return stageConfig.map(stageConfigItem => {
    const stageDeals = dealsData.filter(deal => {
      const dealStage = deal.status || deal.stage || "";
      return dealStage.trim() === stageConfigItem.apiStage;
    }).map(deal => ({
      id: deal.id,
      initials: makeInitials(deal.assignee || deal.owner || deal.deal_name || deal.name || ""),
      title: deal.deal_name || deal.name || "Untitled Deal",
      amount: formatAmount(deal.deal_value || deal.amount || 0),
      email: deal.contact || deal.email || deal.contact_email || "",
      phone: formatPhoneNumber(extractPhoneNumber(deal)),
      rawPhoneForEdit: extractPhoneNumber(deal),
      location: deal.project || deal.location || "India",
      owner: deal.assignee || deal.owner || "",
      ownerName: deal.assignee || deal.owner || "Unassigned",
      progress: calculateProgress(deal),
      date: formatDate(deal.expected_closing_date || deal.closingDate || deal.due_date || new Date()),
      stage: deal.status || deal.stage || stageConfigItem.apiStage,
    }));

    const totalAmount = stageDeals.reduce((sum, deal) => {
      const amount = parseFloat((deal.amount || "₹0").replace(/[₹,/-]/g, '')) || 0;
      return sum + amount;
    }, 0);

    return { ...stageConfigItem, leads: stageDeals.length, amount: formatAmount(totalAmount), deals: stageDeals };
  });
};

export default function Deals() {
  const [dealsState, setDealsState] = useState(stageConfig.map(s => ({ ...s, leads: 0, amount: "₹0", deals: [] })));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDealId, setEditingDealId] = useState(null);
  const [selectedStageIndex, setSelectedStageIndex] = useState(null);
  const [selectedDealIndex, setSelectedDealIndex] = useState(null);
  const [sortBy, setSortBy] = useState("Last 7 Days");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({});

  const initialForm = {
    dealName: "", pipeline: "", stage: "", status: "", dealValue: "", currency: "", customCurrency: "",
    period: "", periodValue: "", contact: "", project: "", customProject: "", dueDate: "", closingDate: "",
    assignee: "", tags: "", followupDate: "", source: "", customSource: "", priority: "", description: "", phone: ""
  };
  const [formData, setFormData] = useState(initialForm);

  const loadDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dealsAPI.list();
      if (Array.isArray(data) && data.length > 0) {
        setDealsState(transformDealsToKanban(data));
      } else {
        setDealsState(stageConfig.map(s => ({ ...s, leads: 0, amount: "₹0", deals: [] })));
        setError("No deals found");
      }
    } catch (err) {
      console.error("Error loading deals:", err);
      setError("Failed to load deals from API. Please try again later.");
      setDealsState(stageConfig.map(s => ({ ...s, leads: 0, amount: "₹0", deals: [] })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDeals(); }, [loadDeals]);

  const handleImageUpload = (e, dealId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImages(prev => ({ ...prev, [dealId]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = (stageIndex) => {
    setSelectedStageIndex(stageIndex);
    setSelectedDealIndex(null);
    setIsEditing(false);
    setEditingDealId(null);
    const selectedStage = dealsState[stageIndex]?.stage || "New";
    setFormData({ ...initialForm, stage: selectedStage, currency: "Rupee", priority: "Medium" });
    setShowAddEditModal(true);
  };

  const openEditModal = (stageIndex, dealIndex) => {
    const deal = dealsState[stageIndex].deals[dealIndex];
    if (!deal) return;

    let rawPhone = "";
    if (deal.rawPhoneForEdit) {
      rawPhone = deal.rawPhoneForEdit.toString().replace(/\D/g, '');
    } else if (deal.phone && deal.phone !== "Not available") {
      rawPhone = deal.phone.toString().replace(/[^\d]/g, '');
      if (rawPhone.startsWith('91') && rawPhone.length > 10) rawPhone = rawPhone.substring(2);
    }
    if (rawPhone && rawPhone.length > 10) rawPhone = rawPhone.slice(-10);

    setFormData({
      ...initialForm,
      dealName: deal.title || "",
      stage: deal.stage || "",
      dealValue: deal.amount ? deal.amount.replace(/[₹,/-]/g, "").trim() : "",
      currency: "Rupee",
      contact: deal.email || "",
      phone: rawPhone,
      project: deal.location || "India",
      assignee: deal.owner || "",
      closingDate: deal.date ? new Date(deal.date).toISOString().split('T')[0] : "",
      priority: "Medium",
    });
    setSelectedStageIndex(stageIndex);
    setSelectedDealIndex(dealIndex);
    setEditingDealId(deal.id);
    setIsEditing(true);
    setShowAddEditModal(true);
  };

  const handleExport = (type) => {
    if (type === "Excel") {
      const worksheet = XLSX.utils.json_to_sheet(dealsState.flatMap(s => s.deals));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Deals");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "deals.xlsx");
      toast.success("Excel exported successfully!");
    } else if (type === "PDF") {
      const doc = new jsPDF();
      doc.text("Deals Report", 10, 10);
      dealsState.forEach((stage, i) => {
        doc.text(`${stage.stage} (${stage.deals.length} deals) - ${stage.amount}`, 10, 20 + i * 10);
      });
      doc.save("deals.pdf");
      toast.success("PDF exported successfully!");
    }
    setShowExportDropdown(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const cleanPhone = formData.phone ? formData.phone.toString().replace(/\D/g, '') : "";
      const dealData = {
        deal_name: formData.dealName || "Untitled Deal",
        deal_value: formData.dealValue ? parseFloat(formData.dealValue.toString().replace(/,/g, '')) : 0,
        status: formData.stage || "New",
        contact: formData.contact || "",
        phone: cleanPhone, mobile: cleanPhone, contact_number: cleanPhone, mobile_number: cleanPhone,
        contact_phone: cleanPhone, customer_phone: cleanPhone, phone_number: cleanPhone,
        project: formData.project || "India",
        assignee: formData.assignee || "",
        expected_closing_date: formData.closingDate || new Date().toISOString().split('T')[0],
        currency: formData.currency || "Rupee",
        priority: formData.priority || "Medium",
        pipeline: formData.pipeline || "Sales",
      };

      if (isEditing && editingDealId) {
        await dealsAPI.update(editingDealId, dealData);
        toast.success("Deal updated successfully!");
      } else {
        await dealsAPI.create(dealData);
        toast.success("Deal created successfully!");
      }

      await loadDeals();
      setShowAddEditModal(false);
      setIsEditing(false);
      setEditingDealId(null);
      setFormData(initialForm);
    } catch (err) {
      console.error("Error saving deal:", err);
      toast.error("Failed to save deal. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (selectedStageIndex === null || selectedDealIndex === null) return;
    const deal = dealsState[selectedStageIndex].deals[selectedDealIndex];
    if (!deal) return;
    try {
      await dealsAPI.delete(deal.id);
      toast.success("Deal deleted successfully!");
      await loadDeals();
      setShowDeleteModal(false);
      setSelectedStageIndex(null);
      setSelectedDealIndex(null);
    } catch (err) {
      toast.error("Failed to delete deal. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStageIcon = (stage) => {
    switch(stage) {
      case "Won": return <FaTrophy className="h-4 w-4" />;
      case "Proposal": return <FiFile className="h-4 w-4" />;
      case "Prospect": return <FiUser className="h-4 w-4" />;
      default: return <FiStar className="h-4 w-4" />;
    }
  };

  const getStageColorClass = (stage) => {
    switch(stage) {
      case "Won": return "emerald";
      case "Proposal": return "amber";
      case "Prospect": return "blue";
      default: return "primary";
    }
  };

  return (
    <div className="">
      <div className="max-w-full mx-auto overflow-x-hidden">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-700">
            <FiAlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <span className="text-sm flex-1">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
            <p className="text-gray-500 text-sm">Loading deals...</p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiList className="text-gray-600 text-xl sm:text-2xl" />
              Deals
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Monitor pipeline performance and move deals smoothly from prospect to closure</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
              >
                <FiDownload className="h-4 w-4" />
                Export
                <FiChevronDown className="h-3 w-3" />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                  <button onClick={() => handleExport("PDF")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg">
                    <FiFileText className="h-4 w-4 text-rose-500" /> Export as PDF
                  </button>
                  <button onClick={() => handleExport("Excel")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-b-lg">
                    <FiTable className="h-4 w-4 text-emerald-500" /> Export as Excel
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => openAddModal(0)} className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all">
              <FiPlus className="h-4 w-4" />
              Add Deal
            </button>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h6 className="font-semibold text-midnight_text">Deals Grid</h6>
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
            >
              <FiFilter className="h-3.5 w-3.5" />
              Sort By: {sortBy}
              <FiChevronDown className="h-3 w-3" />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                {["Last 7 Days", "Monthly", "Weekly", "Yearly"].map(option => (
                  <button key={option} onClick={() => { setSortBy(option); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <FiCalendar className="h-4 w-4" /> {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dealsState.map((stage, stageIndex) => {
            const stageColor = getStageColorClass(stage.stage);
            return (
              <div key={stage.stage} className="space-y-2">
                {/* Stage Header */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow">
                  <div className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h6 className="font-semibold text-midnight_text flex items-center gap-1 text-sm">
                          <span className={`w-2 h-2 rounded-full bg-${stageColor}`} />
                          <span className={`text-${stageColor}`}>{getStageIcon(stage.stage)}</span>
                          {stage.stage}
                        </h6>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FiDollarSign className="h-3 w-3" />
                          {stage.leads} Deals - {stage.amount}
                        </span>
                      </div>
                      <button onClick={() => openAddModal(stageIndex)} className="text-gray-400 hover:text-gray-600">
                        <FiMoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Deals Cards */}
                <div className="space-y-2">
                  {stage.deals.map((deal, dealIndex) => (
                    <div key={deal.id || dealIndex} className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow hover:shadow-property transition-all">
                      <div className={`h-1 rounded-t-lg bg-${stageColor}`} />
                      <div className="p-3">
                        {/* Title */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">{deal.title ? deal.title.charAt(0).toUpperCase() : 'D'}</span>
                          </div>
                          <h6 className="font-semibold text-midnight_text text-sm truncate flex-1" title={deal.title}>{deal.title}</h6>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5 mb-3 text-sm">
                          <div className="flex items-center gap-2">
                            <FiDollarSign className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-gray-700 text-xs">{deal.amount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiMail className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-gray-600 text-xs truncate">{deal.email || "No email"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiPhone className="h-3.5 w-3.5 text-gray-400" />
                            <span className={`text-xs truncate ${deal.phone === "Not available" ? "text-gray-400" : "text-gray-600"}`}>{deal.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiMapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-gray-600 text-xs truncate">{deal.location}</span>
                          </div>
                        </div>

                        {/* Owner */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => document.getElementById(`file-input-${deal.id}`).click()}>
                                {uploadedImages[deal.id] ? (
                                  <img src={uploadedImages[deal.id]} alt={deal.ownerName} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xs font-semibold text-gray-600">{getFirstLetter(deal.ownerName)}</span>
                                )}
                              </div>
                              <input type="file" id={`file-input-${deal.id}`} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, deal.id)} />
                            </div>
                            <div>
                              <span className="font-semibold text-primary text-sm">{getFirstLetter(deal.ownerName)}</span>
                              <span className="text-gray-700 text-sm">{deal.ownerName.substring(1)}</span>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{deal.progress}%</span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-400">{deal.date}</span>
                          <div className="flex gap-1">
                            <button onClick={() => openEditModal(stageIndex, dealIndex)} className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all" title="Edit">
                              <FiEdit2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => { setSelectedStageIndex(stageIndex); setSelectedDealIndex(dealIndex); setShowDeleteModal(true); }} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all" title="Delete">
                              <FiTrash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {stage.deals.length === 0 && (
                    <div className="text-center bg-gray-50 rounded-lg border border-gray-100">
                      <FiFile className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">No deals</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showAddEditModal} onClose={() => setShowAddEditModal(false)} title={isEditing ? "Edit Deal" : "Add New Deal"} size="lg">
        <form onSubmit={handleSave} className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Deal Name <span className="text-rose-500">*</span></label><input name="dealName" value={formData.dealName} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Pipeline <span className="text-rose-500">*</span></label><select name="pipeline" value={formData.pipeline} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="">Select</option><option>Sales</option><option>Marketing</option><option>Calls</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Stage <span className="text-rose-500">*</span></label><select name="stage" value={formData.stage} onChange={(e) => { handleChange(e); setFormData(prev => ({ ...prev, status: e.target.value })); }} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="">Select</option><option value="New">New</option><option value="Prospect">Prospect</option><option value="Proposal">Proposal</option><option value="Won">Won</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData.status || formData.stage} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="">Select</option><option>New</option><option>Prospect</option><option>Proposal</option><option>Won</option><option>Open</option><option>Lost</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Deal Value</label><input name="dealValue" value={formData.dealValue} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              {formData.currency === "Other" ? (
                <input type="text" placeholder="Enter Currency" value={formData.customCurrency || ""} onChange={(e) => setFormData(prev => ({ ...prev, customCurrency: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
              ) : (
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white" value={formData.currency} onChange={(e) => { const value = e.target.value; if (value === "Other") setFormData(prev => ({ ...prev, currency: "Other", customCurrency: "" })); else setFormData(prev => ({ ...prev, currency: value, customCurrency: "" })); }}>
                  <option value="">Select</option><option value="Rupee">Rupee</option><option value="Dollar">Dollar</option><option value="Euro">Euro</option><option value="Other">Other</option>
                </select>
              )}
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact</label><input name="contact" value={formData.contact} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              {formData.project === "Others" ? (
                <input type="text" placeholder="Enter Project" value={formData.customProject} onChange={(e) => setFormData(prev => ({ ...prev, customProject: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
              ) : (
                <select name="project" value={formData.project} onChange={(e) => { const value = e.target.value; if (value === "Others") setFormData(prev => ({ ...prev, project: "Others" })); else handleChange(e); }} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white">
                  <option value="">Select</option><option value="Office Management App">Office Management App</option><option value="Clinic Management">Clinic Management</option><option value="Educational Platform">Educational Platform</option><option value="Others">Others</option>
                </select>
              )}
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label><input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Expected Closing Date</label><input type="date" name="closingDate" value={formData.closingDate} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label><input name="assignee" value={formData.assignee} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags</label><input name="tags" value={formData.tags} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Followup Date</label><input type="date" name="followupDate" value={formData.followupDate} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              {formData.source === "Other" ? (
                <input type="text" placeholder="Enter Source" value={formData.customSource || ""} onChange={(e) => setFormData(prev => ({ ...prev, customSource: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
              ) : (
                <select name="source" value={formData.source} onChange={(e) => { const value = e.target.value; if (value === "Other") setFormData(prev => ({ ...prev, source: "Other", customSource: "" })); else setFormData(prev => ({ ...prev, source: value, customSource: "" })); }} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white">
                  <option value="">Select</option><option value="Phone Calls">Phone Calls</option><option value="Social Media">Social Media</option><option value="Referral Sites">Referral Sites</option><option value="Web Analytics">Web Analytics</option><option value="Previous Purchase">Previous Purchase</option><option value="Other">Other</option>
                </select>
              )}
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label><select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="">Select</option><option>High</option><option>Medium</option><option>Low</option></select></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"></textarea></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setShowAddEditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"><FiBriefcase className="h-4 w-4" />{isEditing ? "Save Deal" : "Add Deal"}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete" size="md">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="h-8 w-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-midnight_text mb-2">Are you sure?</h3>
          <p className="text-sm text-gray-500">Do you want to delete this deal? This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all">Delete Deal</button>
        </div>
      </Modal>
    </div>
  );
}