import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { leadsAPI } from "../../../shared/utils/api";
import {
  FiFilter,
  FiDownload,
  FiFileText,
  FiFile,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiUser,
  FiBriefcase,
  FiTag,
  FiEye,
  FiEyeOff,
  FiUsers,
  FiGlobe,
  FiStar,
  FiChevronDown,
  FiX,
  FiAlertTriangle,
  FiMoreVertical,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';

const initialKanbanState = {
  Contacted: { leads: [], count: 0, amount: "₹0" },
  "Not Contacted": { leads: [], count: 0, amount: "₹0" },
  Closed: { leads: [], count: 0, amount: "₹0" },
  Lost: { leads: [], count: 0, amount: "₹0" },
};

const formatAmount = (value) => {
  if (!value || value === 0) return "₹0";
  const numValue = typeof value === "string" ? parseFloat(value.replace(/[₹,]/g, "")) : value;
  if (isNaN(numValue)) return "₹0";
  return "₹" + numValue.toLocaleString("en-IN");
};

const makeInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Leads = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leadsData, setLeadsData] = useState([]);
  const [leadsKanban, setLeadsKanban] = useState(initialKanbanState);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("Last 7 Days");

  const [formData, setFormData] = useState({
    leadName: "", leadType: "organization", company: "", location: "", value: "",
    currency: "Select", customCurrency: "", phone: "", email: "", source: "", customSource: "",
    industry: "", customIndustry: "", owner: "", customOwner: "", tags: "", description: "",
    visibility: "private", status: "Not Contacted",
  });

  const statusConfig = [
    { status: "Contacted", color: "amber", displayName: "Contacted", icon: FiUser },
    { status: "Not Contacted", color: "gray", displayName: "Not Contacted", icon: FiEyeOff },
    { status: "Closed", color: "emerald", displayName: "Closed", icon: FiCheckCircle },
    { status: "Lost", color: "rose", displayName: "Lost", icon: FiXCircle },
  ];

  const transformLeadsToKanban = useCallback((leads) => {
    if (!Array.isArray(leads)) return initialKanbanState;
    const kanban = {
      Contacted: { leads: [], count: 0, amount: 0 },
      "Not Contacted": { leads: [], count: 0, amount: 0 },
      Closed: { leads: [], count: 0, amount: 0 },
      Lost: { leads: [], count: 0, amount: 0 },
    };
    leads.forEach((lead) => {
      const status = lead.status === "Not_Contacted" ? "Not Contacted" : lead.status || "Not Contacted";
      if (kanban[status]) {
        kanban[status].leads.push({
          ...lead,
          initials: makeInitials(lead.name),
          value: formatAmount(lead.value),
        });
        kanban[status].count += 1;
        const val = parseFloat(String(lead.value).replace(/[₹,]/g, "")) || 0;
        kanban[status].amount += val;
      }
    });
    Object.keys(kanban).forEach((status) => {
      kanban[status].amount = formatAmount(kanban[status].amount);
    });
    return kanban;
  }, []);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leadsAPI.list();
      if (Array.isArray(data)) {
        setLeadsData(data);
        setLeadsKanban(transformLeadsToKanban(data));
      } else {
        setLeadsData([]);
        setLeadsKanban(initialKanbanState);
      }
    } catch (err) {
      console.error("Error loading leads:", err);
      setError("Failed to load leads. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [transformLeadsToKanban]);

  useEffect(() => { loadLeads(); }, [loadLeads]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      leadName: "", leadType: "organization", company: "", location: "", value: "",
      currency: "Select", customCurrency: "", phone: "", email: "", source: "", customSource: "",
      industry: "", customIndustry: "", owner: "", customOwner: "", tags: "", description: "",
      visibility: "private", status: "Not Contacted",
    });
  };

  const handleAddLeadClick = () => {
    setModalType("add");
    setSelectedLead(null);
    resetForm();
    setShowAddLeadModal(true);
  };

  const handleEditLead = async (lead) => {
    const predefinedCurrencies = ["USD", "Euro", "INR"];
    const sources = ["Phone Calls", "Social Media", "Referral Sites"];
    const industries = ["Retail Industry", "Banking", "Hotels"];
    const owners = ["Darlee Robertson", "Sharon Roy", "Vaughan Lewis"];

    try {
      setModalType("edit");
      setSelectedLead(lead);
      let fullLeadData = lead;
      if (lead.id) {
        try { fullLeadData = await leadsAPI.getById(lead.id); } catch (err) { console.error(err); }
      }
      const statusForForm = fullLeadData.status === "Not_Contacted" ? "Not Contacted" : fullLeadData.status || "Not Contacted";
      const vis = fullLeadData.visibility || "Private";
      const visibilityForForm = vis === "Private" ? "private" : vis === "Public" ? "public" : "select_people";
      const tagsForForm = Array.isArray(fullLeadData.tags) ? fullLeadData.tags.join(", ") : fullLeadData.tags || "";

      setFormData({
        leadName: fullLeadData.name || lead.name || "",
        company: fullLeadData.company || "",
        location: fullLeadData.location || "",
        value: fullLeadData.value != null ? String(fullLeadData.value) : "",
        currency: predefinedCurrencies.includes(fullLeadData.currency) ? fullLeadData.currency : fullLeadData.currency ? "Other" : "",
        customCurrency: predefinedCurrencies.includes(fullLeadData.currency) ? "" : fullLeadData.currency || "",
        phone: fullLeadData.phone || "",
        email: fullLeadData.email || "",
        source: sources.includes(fullLeadData.source) ? fullLeadData.source : "Other",
        customSource: sources.includes(fullLeadData.source) ? "" : fullLeadData.source || "",
        industry: industries.includes(fullLeadData.industry) ? fullLeadData.industry : "Other",
        customIndustry: industries.includes(fullLeadData.industry) ? "" : fullLeadData.industry || "",
        owner: owners.includes(fullLeadData.owner) ? fullLeadData.owner : "Other",
        customOwner: owners.includes(fullLeadData.owner) ? "" : fullLeadData.owner || "",
        tags: tagsForForm,
        description: fullLeadData.description || "",
        visibility: visibilityForForm,
        status: statusForForm,
      });
      setShowAddLeadModal(true);
    } catch (err) {
      toast.error("Failed to load lead details.");
    }
  };

  const handleDeleteLead = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (leadToDelete && leadToDelete.id) {
      try {
        await leadsAPI.delete(leadToDelete.id);
        await loadLeads();
        setShowDeleteModal(false);
        setLeadToDelete(null);
        toast.success("Lead deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete lead.");
      }
    }
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const statusForApi = formData.status === "Not Contacted" ? "Not_Contacted" : formData.status || "Not_Contacted";
      const visibilityMap = { private: "Private", public: "Public", select_people: "Team" };
      const visibilityForApi = visibilityMap[formData.visibility] || "Private";
      const rawValue = formData.value ? String(formData.value).replace(/[^0-9.-]/g, "") : "";
      const numValue = rawValue === "" ? null : parseFloat(rawValue);
      const valueForApi = numValue != null && !isNaN(numValue) && numValue >= 0 ? Math.round(numValue) : null;
      const tagsForApi = formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      const currencyForApi = !formData.currency || formData.currency === "Select" ? null : formData.currency === "Other" ? formData.customCurrency || null : formData.currency;

      const leadData = {
        name: formData.leadName || "Untitled Lead",
        company: formData.company || null,
        location: formData.location || null,
        value: valueForApi,
        currency: currencyForApi,
        phone: formData.phone || null,
        email: formData.email || null,
        source: formData.source === "Other" ? formData.customSource : formData.source,
        industry: formData.industry === "Other" ? formData.customIndustry : formData.industry,
        owner: formData.owner === "Other" ? formData.customOwner : formData.owner,
        tags: tagsForApi,
        description: formData.description || null,
        visibility: visibilityForApi,
        status: statusForApi,
      };

      Object.keys(leadData).forEach(key => { if (key !== "tags" && (leadData[key] === "" || leadData[key] === undefined)) leadData[key] = null; });

      if (modalType === "add") await leadsAPI.create(leadData);
      else if (selectedLead && selectedLead.id) await leadsAPI.update(selectedLead.id, leadData);

      await loadLeads();
      setShowAddLeadModal(false);
      resetForm();
      setSelectedLead(null);
      toast.success(modalType === "add" ? "Lead created successfully!" : "Lead updated successfully!");
    } catch (err) {
      toast.error("Failed to save lead.");
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (isExporting) return;
    setIsExporting(true);
    const exportData = leadsData.length > 0 ? leadsData : [];
    const htmlContent = `
      <!DOCTYPE html><html><head><title>Leads Export</title>
      <style>body{font-family:Arial;margin:20px;} h1{color:#0078d4;text-align:center;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background-color:#0078d4;color:white;}</style>
      </head><body><h1>Leads Report</h1><p>Export Date: ${new Date().toLocaleDateString()}</p><p>Total Leads: ${exportData.length}</p>
      <table><thead><tr><th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Location</th><th>Value</th><th>Status</th></tr></thead>
      <tbody>${exportData.map(lead => `<tr><td>${lead.name || ""}</td><td>${lead.company || ""}</td><td>${lead.email || ""}</td><td>${lead.phone || ""}</td><td>${lead.location || ""}</td><td>${formatAmount(lead.value || 0)}</td><td>${lead.status || ""}</td></tr>`).join("")}</tbody></table></body></html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => { toast.success("PDF exported successfully!"); setIsExporting(false); }, 500);
  };

  const exportToExcel = () => {
    if (isExporting) return;
    setIsExporting(true);
    const exportData = leadsData.length > 0 ? leadsData : [];
    const headers = ["Name", "Company", "Email", "Phone", "Location", "Value", "Status"];
    const csvContent = [headers.join(","), ...exportData.map(lead => [`"${lead.name || ""}"`, `"${lead.company || ""}"`, `"${lead.email || ""}"`, `"${lead.phone || ""}"`, `"${lead.location || ""}"`, `"${formatAmount(lead.value || 0)}"`, `"${lead.status || ""}"`].join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => { toast.success("Excel exported successfully!"); setIsExporting(false); }, 500);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Contacted": return <FiUser className="h-4 w-4" />;
      case "Not Contacted": return <FiEyeOff className="h-4 w-4" />;
      case "Closed": return <FiCheckCircle className="h-4 w-4" />;
      case "Lost": return <FiXCircle className="h-4 w-4" />;
      default: return <FiUser className="h-4 w-4" />;
    }
  };

  const getStatusColorClass = (status) => {
    switch(status) {
      case "Contacted": return "amber";
      case "Not Contacted": return "gray";
      case "Closed": return "emerald";
      case "Lost": return "rose";
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
            <p className="text-gray-500 text-sm">Loading leads...</p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiFilter className="text-gray-600 text-xl sm:text-2xl" />
              Leads
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Track potential customers, manage lead information, and convert prospects into opportunities</p>
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
                  <button onClick={() => { exportToPDF(); setShowExportDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg">
                    <FiFileText className="h-4 w-4 text-rose-500" /> Export as PDF
                  </button>
                  <button onClick={() => { exportToExcel(); setShowExportDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-b-lg">
                    <FiFile className="h-4 w-4 text-emerald-500" /> Export as Excel
                  </button>
                </div>
              )}
            </div>
            <button onClick={handleAddLeadClick} className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all">
              <FiPlus className="h-4 w-4" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h6 className="font-semibold text-midnight_text">Leads Grid</h6>
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
                {["Recent", "Last Modified", "Last 7 Days", "Last 30 Days", "Last Month", "Last Year"].map(option => (
                  <button key={option} onClick={() => { setSortBy(option); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <FiChevronDown className="h-4 w-4" /> {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusConfig.map((statusItem) => {
              const statusData = leadsKanban[statusItem.status] || { leads: [], count: 0, amount: "₹0" };
              const statusColor = getStatusColorClass(statusItem.status);
              return (
                <div key={statusItem.status} className="space-y-2">
                  {/* Stage Header */}
                  <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow">
                    <div className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h6 className="font-semibold text-midnight_text flex items-center gap-1 text-sm">
                            <span className={`w-2 h-2 rounded-full bg-${statusColor}`} />
                            <span className={`text-${statusColor}`}>{getStatusIcon(statusItem.status)}</span>
                            {statusItem.displayName}
                          </h6>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FiDollarSign className="h-3 w-3" />
                            {statusData.count} Leads - {statusData.amount}
                          </span>
                        </div>
                        <button onClick={handleAddLeadClick} className="text-gray-400 hover:text-gray-600">
                          <FiMoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Leads Cards */}
                  <div className="space-y-2">
                    {statusData.leads.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                        <FiUser className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">No leads</p>
                      </div>
                    ) : (
                      statusData.leads.map((lead) => (
                        <div key={lead.id || lead.name} className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow hover:shadow-property transition-all">
                          <div className={`h-1 rounded-t-lg bg-${statusColor}`} />
                          <div className="p-3">
                            {/* Header with initials and name */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600">{lead.initials}</span>
                              </div>
                              <h6 className="font-semibold text-midnight_text text-sm truncate flex-1">{lead.name}</h6>
                            </div>

                            {/* Details */}
                            <div className="space-y-1.5 mb-3 text-sm">
                              <div className="flex items-center gap-2">
                                <FiDollarSign className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-gray-700 text-xs">{lead.value}</span>
                              </div>
                              {lead.email && (
                                <div className="flex items-center gap-2">
                                  <FiMail className="h-3.5 w-3.5 text-gray-400" />
                                  <span className="text-gray-600 text-xs truncate">{lead.email}</span>
                                </div>
                              )}
                              {lead.phone && (
                                <div className="flex items-center gap-2">
                                  <FiPhone className="h-3.5 w-3.5 text-gray-400" />
                                  <span className="text-gray-600 text-xs truncate">{lead.phone}</span>
                                </div>
                              )}
                              {lead.location && (
                                <div className="flex items-center gap-2">
                                  <FiMapPin className="h-3.5 w-3.5 text-gray-400" />
                                  <span className="text-gray-600 text-xs truncate">{lead.location}</span>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                              <button onClick={() => handleEditLead(lead)} className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all" title="Edit">
                                <FiEdit2 className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleDeleteLead(lead)} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all" title="Delete">
                                <FiTrash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Lead Modal */}
      <Modal isOpen={showAddLeadModal} onClose={() => { setShowAddLeadModal(false); resetForm(); setSelectedLead(null); }} title={modalType === "add" ? "Add New Lead" : "Edit Lead"} size="lg">
        <form onSubmit={handleAddLead} className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Lead Name <span className="text-rose-500">*</span></label><input name="leadName" value={formData.leadName} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required /></div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lead Type</label>
              <div className="flex gap-4">
                {["person", "organization"].map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="leadType" value={option} checked={formData.leadType === option} onChange={handleFormChange} className="text-primary focus:ring-primary" />
                    <span className="text-sm text-gray-700 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Company <span className="text-rose-500">*</span></label><input name="company" value={formData.company} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input name="location" value={formData.location} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Value</label><input name="value" value={formData.value} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              {formData.currency === "Other" ? (
                <input type="text" placeholder="Enter Currency" value={formData.customCurrency} onChange={(e) => setFormData(prev => ({ ...prev, customCurrency: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
              ) : (
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white" value={formData.currency} onChange={(e) => { const value = e.target.value; if (value === "Other") setFormData(prev => ({ ...prev, currency: "Other", customCurrency: "" })); else setFormData(prev => ({ ...prev, currency: value, customCurrency: "" })); }}>
                  <option value="Select">Select</option><option value="USD">USD</option><option value="Euro">Euro</option><option value="INR">INR</option><option value="Other">Other</option>
                </select>
              )}
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input name="phone" value={formData.phone} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input name="email" value={formData.email} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              {formData.source === "Other" ? (
                <input type="text" placeholder="Enter Source" value={formData.customSource} onChange={(e) => setFormData(prev => ({ ...prev, customSource: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
              ) : (
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white" value={formData.source} onChange={(e) => { const value = e.target.value; if (value === "Other") setFormData(prev => ({ ...prev, source: "Other", customSource: "" })); else setFormData(prev => ({ ...prev, source: value, customSource: "" })); }}>
                  <option value="">Select</option><option value="Phone Calls">Phone Calls</option><option value="Social Media">Social Media</option><option value="Referral Sites">Referral Sites</option><option value="Other">Other</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              {formData.industry === "Other" ? (
                <input type="text" placeholder="Enter Industry" value={formData.customIndustry} onChange={(e) => setFormData(prev => ({ ...prev, customIndustry: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
              ) : (
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white" value={formData.industry} onChange={(e) => { const value = e.target.value; if (value === "Other") setFormData(prev => ({ ...prev, industry: "Other", customIndustry: "" })); else setFormData(prev => ({ ...prev, industry: value, customIndustry: "" })); }}>
                  <option value="">Select</option><option value="Retail Industry">Retail Industry</option><option value="Banking">Banking</option><option value="Hotels">Hotels</option><option value="Other">Other</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
              {formData.owner === "Other" ? (
                <input type="text" placeholder="Enter Owner" value={formData.customOwner} onChange={(e) => setFormData(prev => ({ ...prev, customOwner: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" />
              ) : (
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white" value={formData.owner} onChange={(e) => { const value = e.target.value; if (value === "Other") setFormData(prev => ({ ...prev, owner: "Other", customOwner: "" })); else setFormData(prev => ({ ...prev, owner: value, customOwner: "" })); }}>
                  <option value="">Select</option><option value="Darlee Robertson">Darlee Robertson</option><option value="Sharon Roy">Sharon Roy</option><option value="Vaughan Lewis">Vaughan Lewis</option><option value="Other">Other</option>
                </select>
              )}
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags</label><input name="tags" value={formData.tags} onChange={handleFormChange} placeholder="Add tags (comma separated)" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"></textarea></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
              <div className="flex gap-4">
                {["public", "private", "select_people"].map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="visibility" value={option} checked={formData.visibility === option} onChange={handleFormChange} className="text-primary focus:ring-primary" />
                    <span className="text-sm text-gray-700 capitalize">{option === "select_people" ? "Select People" : option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleFormChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white">
                <option value="">Select</option><option value="Contacted">Contacted</option><option value="Not Contacted">Not Contacted</option><option value="Closed">Closed</option><option value="Lost">Lost</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => { setShowAddLeadModal(false); resetForm(); setSelectedLead(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"><FiPlus className="h-4 w-4" />{modalType === "add" ? "Add Lead" : "Save Changes"}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete" size="md">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="h-8 w-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-midnight_text mb-2">Are you sure?</h3>
          <p className="text-sm text-gray-500">Do you want to delete the lead "{leadToDelete?.name || "this lead"}"? This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
          <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all">Delete Lead</button>
        </div>
      </Modal>
    </div>
  );
};

export default Leads;