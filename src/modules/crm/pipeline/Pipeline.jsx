import React, { useState, useEffect, useCallback } from "react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { crmPipelinesAPI } from "../../../shared/utils/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  FiGrid,
  FiDownload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiTag,
  FiEye,
  FiSave,
  FiMoreVertical
} from 'react-icons/fi';
import Modal from '../../../shared/components/Modal';

const Pipeline = () => {
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState(null);
  const [deletingPipelineId, setDeletingPipelineId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    deals: "",
    stage: "In Pipeline",
    stage_color: "primary",
    created_date: "",
    status: "Active"
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [plansPerPage, setPlansPerPage] = useState(5);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const [dateFilter, setDateFilter] = useState(
    `${dayjs().format("MM/DD/YYYY")} - ${dayjs().format("MM/DD/YYYY")}`
  );

  const stageColorMap = {
    "Won": "emerald",
    "In Pipeline": "primary",
    "Conversation": "blue",
    "Follow Up": "amber",
    "Lost": "rose",
    "Schedule Service": "gray"
  };

  const loadPipelines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (selectedStatus) filters.status = selectedStatus;
      if (selectedPlan) filters.stage = selectedPlan;
      
      const data = await crmPipelinesAPI.list(filters);
      if (Array.isArray(data)) {
        setPipelines(data);
      } else {
        setPipelines([]);
      }
    } catch (err) {
      console.error("Error loading pipelines:", err);
      setError("Failed to load pipelines. Please ensure the backend API is running.");
      setPipelines([]);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedPlan]);

  useEffect(() => {
    loadPipelines();
  }, [loadPipelines]);

  const formatValue = (value) => {
    if (!value) return "$0";
    return `$${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return dayjs().format("DD MMM YYYY");
    try {
      return dayjs(dateString).format("DD MMM YYYY");
    } catch {
      return dateString;
    }
  };

  const transformPipeline = (pipeline) => {
    const statusDisplay = pipeline.status === "active" ? "Active" : 
                         pipeline.status === "inactive" ? "Inactive" : 
                         pipeline.status?.charAt(0).toUpperCase() + pipeline.status?.slice(1).toLowerCase() || "Active";
    const stage = pipeline.stages || pipeline.stage || "In Pipeline";
    
    return {
      id: pipeline.id,
      name: pipeline.pipeline_Name || pipeline.name || "Untitled Pipeline",
      value: formatValue(pipeline.total_deal_value || pipeline.value),
      valueRaw: pipeline.total_deal_value || pipeline.value,
      deals: pipeline.deals || 0,
      stage: stage,
      stageColor: stageColorMap[stage] || "primary",
      date: formatDate(pipeline.created_date || pipeline.created_at),
      status: statusDisplay
    };
  };

  const transformedPipelines = pipelines.map(transformPipeline);

  const handleDateSelect = (option) => {
    const today = dayjs();
    let start, end;

    switch (option) {
      case "Today":
        start = today;
        end = today;
        break;
      case "Yesterday":
        start = today.subtract(1, "day");
        end = today.subtract(1, "day");
        break;
      case "Last 7 Days":
        start = today.subtract(6, "day");
        end = today;
        break;
      case "Last 30 Days":
        start = today.subtract(29, "day");
        end = today;
        break;
      case "This Year":
        start = today.startOf("year");
        end = today;
        break;
      default:
        start = today;
        end = today;
        break;
    }
    setDateFilter(`${start.format("MM/DD/YYYY")} - ${end.format("MM/DD/YYYY")}`);
    setShowDateDropdown(false);
  };

  const filteredPipelines = transformedPipelines.filter((pipe) =>
    pipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortOption === "asc") {
    filteredPipelines.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "desc") {
    filteredPipelines.sort((a, b) => b.name.localeCompare(a.name));
  }

  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = filteredPipelines.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(filteredPipelines.length / plansPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      value: "",
      deals: "",
      stage: "In Pipeline",
      stage_color: "primary",
      created_date: "",
      status: "Active"
    });
  };

  const handleAddPipeline = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      
      const statusValue = formData.status === "Active" ? "active" : 
                         formData.status === "Inactive" ? "inactive" : 
                         formData.status?.toLowerCase() || "active";
      
      const pipelineData = {
        pipeline_Name: formData.name || "Untitled Pipeline",
        total_deal_value: formData.value ? parseFloat(formData.value) : 0,
        deals: formData.deals ? parseInt(formData.deals) : 0,
        stages: formData.stage || "In Pipeline",
        stage_color: formData.stage_color,
        created_date: formData.created_date || new Date().toISOString().split('T')[0],
        status: statusValue
      };

      await crmPipelinesAPI.create(pipelineData);
      toast.success("Pipeline added successfully!");
      setShowAddModal(false);
      resetForm();
      await loadPipelines();
    } catch (err) {
      toast.error("Failed to add pipeline");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPipeline = async (e) => {
    e.preventDefault();
    if (!editingPipeline) return;
    
    try {
      setError(null);
      setLoading(true);
      
      const statusValue = formData.status === "Active" ? "active" : 
                         formData.status === "Inactive" ? "inactive" : 
                         formData.status?.toLowerCase() || "active";
      
      const pipelineData = {
        pipeline_Name: formData.name || "Untitled Pipeline",
        total_deal_value: formData.value ? parseFloat(formData.value) : 0,
        deals: formData.deals ? parseInt(formData.deals) : 0,
        stages: formData.stage || "In Pipeline",
        stage_color: formData.stage_color,
        created_date: formData.created_date || new Date().toISOString().split('T')[0],
        status: statusValue
      };

      await crmPipelinesAPI.update(editingPipeline.id, pipelineData);
      toast.success("Pipeline updated successfully!");
      setShowEditModal(false);
      setEditingPipeline(null);
      resetForm();
      await loadPipelines();
    } catch (err) {
      toast.error("Failed to update pipeline");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePipeline = async () => {
    if (!deletingPipelineId) return;
    
    try {
      setError(null);
      setLoading(true);
      await crmPipelinesAPI.delete(deletingPipelineId);
      toast.success("Pipeline deleted successfully!");
      setShowDeleteModal(false);
      setDeletingPipelineId(null);
      await loadPipelines();
    } catch (err) {
      toast.error("Failed to delete pipeline");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (pipelineId) => {
    try {
      setLoading(true);
      const pipeline = await crmPipelinesAPI.getById(pipelineId);
      if (pipeline) {
        setEditingPipeline(pipeline);
        const statusDisplay = pipeline.status === "active" ? "Active" : 
                             pipeline.status === "inactive" ? "Inactive" : 
                             pipeline.status?.charAt(0).toUpperCase() + pipeline.status?.slice(1).toLowerCase() || "Active";
        
        setFormData({
          name: pipeline.pipeline_Name || pipeline.name || "",
          value: pipeline.total_deal_value || pipeline.value || "",
          deals: pipeline.deals || "",
          stage: pipeline.stages || pipeline.stage || "In Pipeline",
          stage_color: pipeline.stage_color || "primary",
          created_date: pipeline.created_date ? (typeof pipeline.created_date === 'string' ? pipeline.created_date.split('T')[0] : dayjs(pipeline.created_date).format("YYYY-MM-DD")) : "",
          status: statusDisplay
        });
        setShowEditModal(true);
      }
    } catch (err) {
      toast.error("Failed to load pipeline for editing");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (pipelineId) => {
    setDeletingPipelineId(pipelineId);
    setShowDeleteModal(true);
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Pipelines List", 10, 10);

      const tableColumn = ["Name", "Total Deal Value", "No of Deals", "Stage", "Created Date", "Status"];
      const tableRows = filteredPipelines.map(pipeline => [
        pipeline.name, pipeline.value, pipeline.deals, pipeline.stage, pipeline.date, pipeline.status
      ]);

      doc.autoTable(tableColumn, tableRows, { startY: 20 });
      doc.save("pipelines.pdf");
      toast.success("Pipelines exported to PDF successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
    setShowExportDropdown(false);
  };

  const handleExportExcel = () => {
    try {
      const headers = ["Name", "Total Deal Value", "No of Deals", "Stage", "Created Date", "Status"];
      const csvContent = [
        headers.join(','),
        ...filteredPipelines.map(pipeline => [
          `"${pipeline.name}"`, `"${pipeline.value}"`, pipeline.deals, `"${pipeline.stage}"`, `"${pipeline.date}"`, `"${pipeline.status}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pipelines_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Pipelines exported to Excel successfully!");
    } catch (error) {
      toast.error("Failed to export Excel");
    }
    setShowExportDropdown(false);
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
            <p className="text-gray-500 text-sm">Loading pipelines...</p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight_text flex items-center gap-2">
              <FiGrid className="text-gray-600 text-xl sm:text-2xl" />
              Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage and track your sales pipeline stages</p>
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
                  <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg">
                    <FaFilePdf className="h-4 w-4 text-rose-500" /> Export as PDF
                  </button>
                  <button onClick={handleExportExcel} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-b-lg">
                    <FaFileExcel className="h-4 w-4 text-emerald-500" /> Export as Excel
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all"
            >
              <FiPlus className="h-4 w-4" />
              Add Pipeline
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile First */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            placeholder="Search pipeline..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Filters Section - Responsive */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-deatail_shadow">
          {/* Mobile Filter Toggle */}
          <div className="p-3 border-b border-gray-100 block md:hidden">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FiFilter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters</span>
                {selectedPlan || selectedStatus ? (
                  <span className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                    Active
                  </span>
                ) : null}
              </div>
              <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showFiltersMobile ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Dropdowns - Desktop always visible, Mobile toggle */}
          <div className={`${showFiltersMobile ? 'block' : 'hidden'} md:block p-4 border-b border-gray-100`}>
            <div className="flex flex-wrap gap-2">
              {/* Date Range Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
                >
                  <FiCalendar className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{dateFilter}</span>
                  <span className="sm:hidden">Date</span>
                  <FiChevronDown className="h-3 w-3" />
                </button>
                {showDateDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                    {["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Year"].map(opt => (
                      <button key={opt} onClick={() => handleDateSelect(opt)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stage Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStageDropdown(!showStageDropdown)}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
                >
                  <FiTag className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{selectedPlan || "Stage"}</span>
                  <span className="sm:hidden">Stage</span>
                  <FiChevronDown className="h-3 w-3" />
                </button>
                {showStageDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                    <button onClick={() => { setSelectedPlan("Won"); setShowStageDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Won</button>
                    <button onClick={() => { setSelectedPlan("In Pipeline"); setShowStageDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">In Pipeline</button>
                    <button onClick={() => { setSelectedPlan("Conversation"); setShowStageDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Conversation</button>
                    <button onClick={() => { setSelectedPlan("Follow Up"); setShowStageDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Follow Up</button>
                    <button onClick={() => { setSelectedPlan(""); setShowStageDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">All</button>
                  </div>
                )}
              </div>

              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
                >
                  <FiEye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{selectedStatus || "Status"}</span>
                  <span className="sm:hidden">Status</span>
                  <FiChevronDown className="h-3 w-3" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                    <button onClick={() => { setSelectedStatus("Active"); setShowStatusDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Active</button>
                    <button onClick={() => { setSelectedStatus("Inactive"); setShowStatusDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Inactive</button>
                    <button onClick={() => { setSelectedStatus(""); setShowStatusDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">All</button>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-primary hover:border-primary transition-all"
                >
                  <FiFilter className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{sortOption === "asc" ? "Ascending" : sortOption === "desc" ? "Descending" : "Sort"}</span>
                  <span className="sm:hidden">Sort</span>
                  <FiChevronDown className="h-3 w-3" />
                </button>
                {showSortDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                    <button onClick={() => { setSortOption("asc"); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Ascending</button>
                    <button onClick={() => { setSortOption("desc"); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Descending</button>
                    <button onClick={() => { setSortOption(""); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Default</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="w-10 px-4 py-3 text-center"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /></th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Pipeline Name</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Total Deal Value</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">No of Deals</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Stages</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Created Date</th>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Status</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentPlans.map((pipe, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center"><input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /></td>
                    <td className="px-4 py-3"><span className="text-sm font-medium text-midnight_text">{pipe.name}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-gray-600">{pipe.value}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-gray-600">{pipe.deals}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full bg-${pipe.stageColor}`} style={{ width: "100%" }} />
                        </div>
                        <span className={`text-xs font-medium text-${pipe.stageColor}`}>{pipe.stage}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm text-gray-600">{pipe.date}</span></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${pipe.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {pipe.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(pipe.id)} className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all" title="Edit">
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => openDeleteModal(pipe.id)} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all" title="Delete">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Visible only on mobile */}
          <div className="block md:hidden divide-y divide-gray-100">
            {currentPlans.map((pipe, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-midnight_text text-sm truncate">{pipe.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{pipe.date}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => openEditModal(pipe.id)} className="p-1.5 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-all">
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => openDeleteModal(pipe.id)} className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all">
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Deal Value:</span>
                    <span className="text-sm font-semibold text-midnight_text">{pipe.value}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">No of Deals:</span>
                    <span className="text-sm text-gray-700">{pipe.deals}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Stage:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full bg-${pipe.stageColor}`} style={{ width: "100%" }} />
                      </div>
                      <span className={`text-xs font-medium text-${pipe.stageColor}`}>{pipe.stage}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Status:</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${pipe.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                      {pipe.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {currentPlans.length === 0 && !loading && (
            <div className="text-center py-12">
              <FiGrid className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-midnight_text mb-1">No pipelines found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {filteredPipelines.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-100 bg-gray-50/30">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Rows per page:</span>
                <select
                  value={plansPerPage}
                  onChange={(e) => { setPlansPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 text-sm border border-gray-200 rounded-lg bg-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="text-xs text-gray-500">
                Showing {indexOfFirstPlan + 1} – {Math.min(indexOfLastPlan, filteredPipelines.length)} of {filteredPipelines.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-1">
                  {[...Array(Math.min(3, totalPages)).keys()].map(num => (
                    <button
                      key={num + 1}
                      onClick={() => handlePageChange(num + 1)}
                      className={`px-3 py-1 text-sm rounded-lg transition-all ${currentPage === num + 1 ? 'bg-primary text-white' : 'border border-gray-200 hover:bg-white'}`}
                    >
                      {num + 1}
                    </button>
                  ))}
                  {totalPages > 3 && currentPage > 2 && (
                    <span className="px-2 py-1 text-sm text-gray-500">...</span>
                  )}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Pipeline Modal */}
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); resetForm(); }} title="Add Pipeline" size="md">
        <form onSubmit={handleAddPipeline} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Name <span className="text-rose-500">*</span></label><input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Deal Value</label><input type="number" name="value" value={formData.value} onChange={handleInputChange} step="0.01" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">No of Deals</label><input type="number" name="deals" value={formData.deals} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Stage</label><select name="stage" value={formData.stage} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="Won">Won</option><option value="In Pipeline">In Pipeline</option><option value="Conversation">Conversation</option><option value="Follow Up">Follow Up</option><option value="Lost">Lost</option><option value="Schedule Service">Schedule Service</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Stage Color</label><select name="stage_color" value={formData.stage_color} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="success">Success (Green)</option><option value="primary">Primary (Blue)</option><option value="info">Info (Cyan)</option><option value="warning">Warning (Yellow)</option><option value="danger">Danger (Red)</option><option value="secondary">Secondary (Gray)</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label><input type="date" name="created_date" value={formData.created_date} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Completed">Completed</option></select></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"><FiPlus className="h-4 w-4" />Add Pipeline</button>
          </div>
        </form>
      </Modal>

      {/* Edit Pipeline Modal */}
      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setEditingPipeline(null); resetForm(); }} title="Edit Pipeline" size="md">
        <form onSubmit={handleEditPipeline} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Name <span className="text-rose-500">*</span></label><input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Total Deal Value</label><input type="number" name="value" value={formData.value} onChange={handleInputChange} step="0.01" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">No of Deals</label><input type="number" name="deals" value={formData.deals} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Stage</label><select name="stage" value={formData.stage} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="Won">Won</option><option value="In Pipeline">In Pipeline</option><option value="Conversation">Conversation</option><option value="Follow Up">Follow Up</option><option value="Lost">Lost</option><option value="Schedule Service">Schedule Service</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Stage Color</label><select name="stage_color" value={formData.stage_color} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="success">Success (Green)</option><option value="primary">Primary (Blue)</option><option value="info">Info (Cyan)</option><option value="warning">Warning (Yellow)</option><option value="danger">Danger (Red)</option><option value="secondary">Secondary (Gray)</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label><input type="date" name="created_date" value={formData.created_date} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary bg-white"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Completed">Completed</option></select></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => { setShowEditModal(false); setEditingPipeline(null); resetForm(); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"><FiSave className="h-4 w-4" />Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeletingPipelineId(null); }} title="Confirm Delete" size="md">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTrash2 className="h-8 w-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-midnight_text mb-2">Are you sure?</h3>
          <p className="text-sm text-gray-500">Do you want to delete this pipeline? This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={() => { setShowDeleteModal(false); setDeletingPipelineId(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
          <button onClick={handleDeletePipeline} className="px-4 py-2 text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all">Delete Pipeline</button>
        </div>
      </Modal>
    </div>
  );
};

export default Pipeline;