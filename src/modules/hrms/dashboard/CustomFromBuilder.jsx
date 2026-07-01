import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Modal from "../../../shared/components/Modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomFormBuilder = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("dynamicFormBuilder");
    return saved
      ? JSON.parse(saved)
      : {
          id: `form_${Date.now()}`,
          title: "New Form",
          description: "",
          category: "General",
          fields: [],
          sections: [],
          configuration: {
            availability: "all",
            departments: [],
            grades: [],
            submissionWindow: "always",
            startDate: "",
            endDate: "",
            submissionType: "single",
            submissionLimit: 1,
            anonymousSubmission: false,
            autoSave: true,
            confirmationMessage: "Thank you for your submission!",
            postActions: { email: false, notification: true, updateData: false },
          },
          version: 1,
          history: [],
          status: "draft",
          created: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        };
  });

  const [selectedField, setSelectedField] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [draggedField, setDraggedField] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const fileInputRef = useRef(null);

  const showNotification = (message, type = "success") => toast[type](message, { position: "top-right" });

  const fieldTypes = [
    { type: "text", label: "Text", icon: "heroicons:bars-3-bottom-left", color: "text-blue-500", bg: "bg-blue-50" },
    { type: "number", label: "Number", icon: "heroicons:hashtag", color: "text-emerald-500", bg: "bg-emerald-50" },
    { type: "email", label: "Email", icon: "heroicons:envelope", color: "text-purple-500", bg: "bg-purple-50" },
    { type: "phone", label: "Phone", icon: "heroicons:phone", color: "text-orange-500", bg: "bg-orange-50" },
    { type: "date", label: "Date", icon: "heroicons:calendar", color: "text-pink-500", bg: "bg-pink-50" },
    { type: "dropdown", label: "Dropdown", icon: "heroicons:chevron-down", color: "text-indigo-500", bg: "bg-indigo-50" },
    { type: "multi-select", label: "Multi Select", icon: "heroicons:list-bullet", color: "text-teal-500", bg: "bg-teal-50" },
    { type: "radio", label: "Radio", icon: "heroicons:adjustments-horizontal", color: "text-orange-500", bg: "bg-orange-50" },
    { type: "checkbox", label: "Checkbox", icon: "heroicons:check-square", color: "text-lime-500", bg: "bg-lime-50" },
    { type: "file", label: "File Upload", icon: "heroicons:cloud-arrow-up", color: "text-cyan-500", bg: "bg-cyan-50" },
    { type: "signature", label: "Signature", icon: "heroicons:pencil", color: "text-purple-500", bg: "bg-purple-50" },
    { type: "rich-text", label: "Rich Text", icon: "heroicons:document-text", color: "text-red-500", bg: "bg-red-50" },
    { type: "rating", label: "Rating", icon: "heroicons:star", color: "text-amber-500", bg: "bg-amber-50" },
    { type: "section", label: "Section", icon: "heroicons:squares-2x2", color: "text-slate-500", bg: "bg-slate-100" },
  ];

  const categories = ["General", "HR", "Finance", "IT", "Operations", "Administrative", "Feedback"];
  const departments = ["HR", "IT", "Finance", "Sales", "Marketing", "Operations", "Customer Service", "R&D"];
  const grades = ["Intern", "Executive", "Senior Executive", "Assistant Manager", "Manager", "Senior Manager", "Director", "Vice President", "President"];

  const calculateTotalPages = () => Math.max(1, currentPage, ...formData.fields.map(f => f.page || 1), ...formData.sections.map(s => s.page || 1));
  const totalPages = calculateTotalPages();

  useEffect(() => localStorage.setItem("dynamicFormBuilder", JSON.stringify(formData)), [formData]);

  const addHistoryEntry = (action) => {
    setFormData((prev) => ({
      ...prev,
      version: prev.version + 1,
      lastModified: new Date().toISOString(),
      history: [{ version: prev.version + 1, timestamp: new Date().toISOString(), action, changedBy: "System" }, ...prev.history],
    }));
  };

  const updateField = (fieldId, updates) => setFormData((prev) => ({ ...prev, fields: prev.fields.map((field) => field.id === fieldId ? { ...field, ...updates } : field) }));
  const deleteField = (fieldId) => { setFormData((prev) => ({ ...prev, fields: prev.fields.filter((field) => field.id !== fieldId) })); if (selectedField === fieldId) setSelectedField(null); };
  
  const moveField = (fieldId, newIndex) => {
    setFormData((prev) => {
      const current = prev.fields.filter(f => f.page === currentPage);
      const other = prev.fields.filter(f => f.page !== currentPage);
      const oldIndex = current.findIndex(f => f.id === fieldId);
      if (oldIndex === -1 || oldIndex === newIndex) return prev;
      const reordered = [...current];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      return { ...prev, fields: [...other, ...reordered] };
    });
  };

  const addFieldFromClick = (fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType.type,
      label: fieldType.label,
      placeholder: fieldType.placeholder || `Enter ${fieldType.label}`,
      helpText: "",
      required: false,
      validation: { pattern: "", minLength: null, maxLength: null, min: null, max: null },
      conditional: null,
      options: ["Option 1", "Option 2", "Option 3"],
      page: currentPage,
      prePopulate: fieldType.prePopulate || false,
    };
    setFormData(prev => ({ ...prev, fields: [...prev.fields, newField] }));
    setSelectedField(newField.id);
  };

  const exportFormAsJson = () => {
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const link = document.createElement("a");
    link.href = dataUri; link.download = `form_${formData.id}.json`;
    link.click();
    showNotification("Form exported as JSON successfully");
  };

  const importFromJson = () => {
    try {
      const data = JSON.parse(importJson);
      setFormData({ ...data, id: `form_${Date.now()}`, lastModified: new Date().toISOString() });
      setShowImportModal(false);
      setImportJson("");
      showNotification("Form imported successfully");
    } catch { showNotification("Invalid JSON format", "error"); }
  };

  const getStatusBadge = (status) => {
    return status === 'published' 
      ? <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">Published</span>
      : <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">Draft</span>;
  };

  const renderFieldProperties = () => {
    const field = formData.fields.find((f) => f.id === selectedField);
    if (!field) return null;
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Field Label</label>
          <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Page</label>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={field.page || 1} onChange={e => updateField(field.id, { page: parseInt(e.target.value) })}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <option key={p} value={p}>Page {p}</option>)}
          </select>
        </div>
        {!["checkbox", "radio"].includes(field.type) && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Placeholder</label>
            <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={field.placeholder} onChange={e => updateField(field.id, { placeholder: e.target.value })} />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Help Text</label>
          <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" value={field.helpText} onChange={e => updateField(field.id, { helpText: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" checked={field.required} onChange={e => updateField(field.id, { required: e.target.checked })} />
          <span className="text-sm font-medium text-slate-700">Required Field</span>
        </label>
        {["dropdown", "radio", "multi-select"].includes(field.type) && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Options</label>
            <div className="space-y-2">
              {field.options.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <input type="text" className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm" value={opt} onChange={e => { const updated = [...field.options]; updated[idx] = e.target.value; updateField(field.id, { options: updated }); }} />
                  <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" onClick={() => updateField(field.id, { options: field.options.filter((_, i) => i !== idx) })}><Icon icon="heroicons:trash" /></button>
                </div>
              ))}
              <button className="text-sm text-blue-600 font-medium" onClick={() => updateField(field.id, { options: [...field.options, `Option ${field.options.length + 1}`] })}>+ Add Option</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPreviewField = (field) => {
    const baseClasses = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
    switch (field.type) {
      case "text": case "email": case "phone": case "number": return <input type={field.type === "number" ? "number" : "text"} className={baseClasses} placeholder={field.placeholder} />;
      case "date": return <input type="date" className={baseClasses} />;
      case "dropdown": return <select className={baseClasses}><option value="">Select option</option>{field.options.map((o, i) => <option key={i}>{o}</option>)}</select>;
      case "multi-select": return <div className="space-y-2">{field.options.map((o, i) => <label key={i} className="flex items-center gap-2"><input type="checkbox" className="rounded" /> <span className="text-sm text-slate-700">{o}</span></label>)}</div>;
      case "radio": return <div className="space-y-2">{field.options.map((o, i) => <label key={i} className="flex items-center gap-2"><input type="radio" name={`preview_${field.id}`} /> <span className="text-sm text-slate-700">{o}</span></label>)}</div>;
      case "checkbox": return <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> <span className="text-sm text-slate-700">{field.label}</span></label>;
      case "file": return <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 text-slate-500"><Icon icon="heroicons:cloud-arrow-up" className="w-8 h-8 mx-auto mb-2" /> Upload file</div>;
      case "rich-text": return <textarea className={baseClasses} rows="4" placeholder={field.placeholder}></textarea>;
      default: return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Icon icon="heroicons:document-text" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Custom Form Builder</h1>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              Manage custom employee forms {getStatusBadge(formData.status)} 
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-slate-50 transition" onClick={() => setShowPreview(true)}>
            <Icon icon="heroicons:eye" className="w-4 h-4" /> Preview
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-slate-50 transition" onClick={() => setShowImportModal(true)}>
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" /> Import
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition" onClick={() => { setFormData(p => ({...p, status: 'published'})); showNotification("Form published!"); }}>
            <Icon icon="heroicons:rocket-launch" className="w-4 h-4" /> Publish Form
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
        <button onClick={() => setActiveTab(0)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          <Icon icon="heroicons:pencil-square" className="w-4 h-4" /> Form Design
        </button>
        <button onClick={() => setActiveTab(1)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === 1 ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          <Icon icon="heroicons:cog-6-tooth" className="w-4 h-4" /> Form Configuration
        </button>
      </div>

      {activeTab === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-slate-800 mb-4">Field Types</h3>
              <div className="grid grid-cols-2 gap-2">
                {fieldTypes.map((f) => (
                  <button key={f.type} onClick={() => addFieldFromClick(f)} className="flex flex-col items-center p-3 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition group">
                    <div className={`w-8 h-8 rounded-lg ${f.bg} ${f.color} flex items-center justify-center mb-1 group-hover:scale-110 transition`}>
                      <Icon icon={f.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-600">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">Form Actions</h3>
              <button onClick={exportFormAsJson} className="w-full px-4 py-2 mb-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition">
                <Icon icon="heroicons:document-arrow-down" /> Export JSON
              </button>
              <button onClick={() => { localStorage.removeItem("dynamicFormBuilder"); window.location.reload(); }} className="w-full px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition">
                <Icon icon="heroicons:trash" /> Reset Builder
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 min-h-[600px]">
              <input type="text" className="w-full text-2xl font-bold text-slate-900 border-none focus:ring-0 p-0 mb-2 placeholder-slate-300" placeholder="Form Title" value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} />
              <textarea className="w-full text-sm text-slate-500 border-none focus:ring-0 p-0 mb-6 placeholder-slate-300 resize-none" placeholder="Add form description..." value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))}></textarea>

              <div className="flex gap-2 mb-6">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-4 py-1.5 text-sm font-semibold rounded-full border ${currentPage === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    Page {p}
                  </button>
                ))}
                <button onClick={() => { setCurrentPage(totalPages + 1); showNotification(`Page ${totalPages + 1} added`); }} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-semibold hover:bg-emerald-100"><Icon icon="heroicons:plus" /></button>
              </div>

              <div className="space-y-4">
                {formData.fields.filter(f => f.page === currentPage).length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Icon icon="heroicons:document-plus" className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-slate-700 font-medium">Page {currentPage} is empty</h4>
                    <p className="text-sm text-slate-500">Click a field type on the left to add it.</p>
                  </div>
                ) : (
                  formData.fields.filter(f => f.page === currentPage).map((f, i) => (
                    <div key={f.id} draggable onDragStart={(e) => { setDraggedField(f.id); e.dataTransfer.effectAllowed = "move"; }} onDragOver={(e) => { e.preventDefault(); setDragOverIndex(i); }} onDrop={(e) => { e.preventDefault(); if (draggedField) moveField(draggedField, i); setDraggedField(null); setDragOverIndex(null); }} onClick={() => setSelectedField(f.id)} className={`p-4 border rounded-xl cursor-pointer relative group transition ${selectedField === f.id ? 'border-blue-500 bg-blue-50/30 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'} ${draggedField === f.id ? 'opacity-50' : ''}`}>
                      <div className="absolute right-4 top-4 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={(e) => { e.stopPropagation(); deleteField(f.id); }} className="p-1.5 bg-red-50 text-red-600 rounded-lg"><Icon icon="heroicons:trash" /></button>
                      </div>
                      <div className="flex gap-3">
                        <div className="mt-1 cursor-grab text-slate-400"><Icon icon="heroicons:bars-2" /></div>
                        <div className="flex-1">
                          <label className="block font-semibold text-slate-800 text-sm mb-1">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
                          {f.helpText && <p className="text-xs text-slate-500 mb-2">{f.helpText}</p>}
                          <div className="pointer-events-none opacity-80">{renderPreviewField(f)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="font-semibold text-slate-800 text-sm">Properties</h3>
              </div>
              <div className="p-4">
                {selectedField ? renderFieldProperties() : (
                  <div className="text-center py-8 text-slate-500">
                    <Icon icon="heroicons:cursor-arrow-rays" className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm">Select a field to edit</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Configuration Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Form Category</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" value={formData.category} onChange={e => setFormData(p => ({...p, category: e.target.value}))}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" value={formData.configuration.availability} onChange={e => setFormData(p => ({...p, configuration: {...p.configuration, availability: e.target.value}}))}>
                <option value="all">All Employees</option>
                <option value="departments">Specific Departments</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Success Message</label>
              <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" rows="3" value={formData.configuration.confirmationMessage} onChange={e => setFormData(p => ({...p, configuration: {...p.configuration, confirmationMessage: e.target.value}}))} />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" checked={formData.configuration.anonymousSubmission} onChange={e => setFormData(p => ({...p, configuration: {...p.configuration, anonymousSubmission: e.target.checked}}))} />
                <span className="text-sm font-medium text-slate-700">Allow Anonymous Submission</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" checked={formData.configuration.autoSave} onChange={e => setFormData(p => ({...p, configuration: {...p.configuration, autoSave: e.target.checked}}))} />
                <span className="text-sm font-medium text-slate-700">Enable Auto-save Progress</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Form Preview" size="lg">
        <div className="p-6 bg-slate-50">
          <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{formData.title}</h2>
            <p className="text-slate-500 mb-8 pb-4 border-b border-slate-100">{formData.description}</p>
            <div className="space-y-6">
              {formData.fields.map(f => (
                <div key={f.id}>
                  <label className="block font-semibold text-slate-800 text-sm mb-1">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
                  {f.helpText && <p className="text-xs text-slate-500 mb-2">{f.helpText}</p>}
                  {renderPreviewField(f)}
                </div>
              ))}
            </div>
            {formData.fields.length > 0 && <button className="mt-8 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl">Submit Response</button>}
          </div>
        </div>
      </Modal>

      <Modal isOpen={showImportModal} onClose={() => setShowImportModal(false)} title="Import JSON" size="md">
        <div className="p-6">
          <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono bg-slate-50 mb-4 h-48" placeholder="Paste JSON here..." value={importJson} onChange={e => setImportJson(e.target.value)} />
          <button onClick={importFromJson} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl">Import Form</button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default CustomFormBuilder;