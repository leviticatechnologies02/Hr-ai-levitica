import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
            postActions: {
              email: false,
              notification: true,
              updateData: false,
            },
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
  const [saveStatus, setSaveStatus] = useState("");
  const [importError, setImportError] = useState("");
  const [draggedField, setDraggedField] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const fieldTypes = [
    { type: "text", label: "Text", icon: "bi-text-left", color: "#3B82F6" },
    { type: "number", label: "Number", icon: "bi-123", color: "#10B981" },
    { type: "email", label: "Email", icon: "bi-envelope", color: "#8B5CF6" },
    { type: "phone", label: "Phone", icon: "bi-telephone", color: "#F59E0B" },
    { type: "date", label: "Date", icon: "bi-calendar", color: "#EC4899" },
    { type: "dropdown", label: "Dropdown", icon: "bi-caret-down", color: "#6366F1" },
    { type: "multi-select", label: "Multi Select", icon: "bi-list-check", color: "#14B8A6" },
    { type: "radio", label: "Radio", icon: "bi-ui-radios", color: "#F97316" },
    { type: "checkbox", label: "Checkbox", icon: "bi-check-square", color: "#84CC16" },
    { type: "file", label: "File Upload", icon: "bi-cloud-upload", color: "#06B6D4" },
    { type: "signature", label: "Signature", icon: "bi-pen", color: "#8B5CF6" },
    { type: "rich-text", label: "Rich Text", icon: "bi-text-paragraph", color: "#EF4444" },
    { type: "rating", label: "Rating", icon: "bi-star", color: "#F59E0B" },
    { type: "section", label: "Section", icon: "bi-layers", color: "#6B7280" },
  ];

  const categories = [
    { value: "General", label: "General" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "IT", label: "IT" },
    { value: "Operations", label: "Operations" },
    { value: "Administrative", label: "Administrative" },
    { value: "Feedback", label: "Feedback" },
  ];

  const departments = ["HR", "IT", "Finance", "Sales", "Marketing", "Operations", "Customer Service", "R&D"];
  const grades = ["Intern", "Executive", "Senior Executive", "Assistant Manager", "Manager", "Senior Manager", "Director", "Vice President", "President"];

  const calculateTotalPages = () => {
    const fieldPages = formData.fields.map(f => f.page || 1);
    const sectionPages = formData.sections.map(s => s.page || 1);
    const allPages = [...fieldPages, ...sectionPages, currentPage];
    return Math.max(...allPages, 1);
  };

  const totalPages = calculateTotalPages();

  useEffect(() => {
    localStorage.setItem("dynamicFormBuilder", JSON.stringify(formData));
  }, [formData]);

  const addHistoryEntry = (action) => {
    setFormData((prev) => ({
      ...prev,
      version: prev.version + 1,
      lastModified: new Date().toISOString(),
      history: [
        ...prev.history,
        {
          version: prev.version + 1,
          timestamp: new Date().toISOString(),
          action,
          changedBy: "System",
        },
      ],
    }));
  };

  const updateField = (fieldId, updates) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    }));
    addHistoryEntry("Updated field properties");
  };

  const deleteField = (fieldId) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }));
    if (selectedField === fieldId) {
      setSelectedField(null);
    }
    addHistoryEntry("Deleted field");
  };

  const duplicateField = (fieldId) => {
    const field = formData.fields.find((f) => f.id === fieldId);
    if (field) {
      const duplicated = {
        ...field,
        id: `field_${Date.now()}`,
        label: `${field.label} (Copy)`,
      };
      setFormData((prev) => ({
        ...prev,
        fields: [...prev.fields, duplicated],
      }));
      addHistoryEntry("Duplicated field");
    }
  };

  const moveField = (fieldId, newIndex) => {
    setFormData((prev) => {
      const currentPageFields = prev.fields.filter((f) => f.page === currentPage);
      const otherPageFields = prev.fields.filter((f) => f.page !== currentPage);
      const oldIndex = currentPageFields.findIndex((f) => f.id === fieldId);
      if (oldIndex === -1 || oldIndex === newIndex) return prev;

      const reorderedFields = [...currentPageFields];
      const [movedField] = reorderedFields.splice(oldIndex, 1);
      reorderedFields.splice(newIndex, 0, movedField);

      return {
        ...prev,
        fields: [...otherPageFields, ...reorderedFields],
      };
    });
    addHistoryEntry("Reordered fields");
  };

  const handleDragStart = (e, fieldId) => {
    setDraggedField(fieldId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedField !== null) {
      moveField(draggedField, targetIndex);
    }
    setDraggedField(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedField(null);
    setDragOverIndex(null);
  };

  const addSection = () => {
    const newSection = {
      id: `section_${Date.now()}`,
      title: `Section ${formData.sections.length + 1}`,
      description: "",
      page: currentPage,
    };
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    addHistoryEntry("Added new section");
  };

  const addPage = () => {
    const newPage = totalPages + 1;
    setCurrentPage(newPage);
    addHistoryEntry(`Added page ${newPage}`);
    setSelectedField(null);
    setSaveStatus(`Page ${newPage} added successfully!`);
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSelectedField(null);
    }
  };

  const deletePage = (pageNumber) => {
    if (totalPages <= 1) {
      setSaveStatus("Cannot delete the only page!");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }

    if (window.confirm(`Are you sure you want to delete Page ${pageNumber}? All fields in this page will be moved to Page 1.`)) {
      const updatedFields = formData.fields.map(field => ({
        ...field,
        page: field.page === pageNumber ? 1 : field.page > pageNumber ? field.page - 1 : field.page
      }));

      const updatedSections = formData.sections.map(section => ({
        ...section,
        page: section.page === pageNumber ? 1 : section.page > pageNumber ? section.page - 1 : section.page
      }));

      setFormData(prev => ({
        ...prev,
        fields: updatedFields,
        sections: updatedSections
      }));

      if (currentPage === pageNumber) {
        setCurrentPage(1);
      } else if (currentPage > pageNumber) {
        setCurrentPage(currentPage - 1);
      }

      addHistoryEntry(`Deleted page ${pageNumber}`);
      setSaveStatus(`Page ${pageNumber} deleted! Fields moved to Page 1.`);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const duplicateForm = () => {
    const duplicated = {
      ...formData,
      id: `form_${Date.now()}`,
      title: `${formData.title} (Copy)`,
      version: 1,
      history: [],
      status: "draft",
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setFormData(duplicated);
    addHistoryEntry("Duplicated form");
  };

  const saveForm = () => {
    try {
      const updated = {
        ...formData,
        status: "published",
        lastModified: new Date().toISOString(),
        history: [
          ...formData.history,
          {
            version: formData.version + 1,
            timestamp: new Date().toISOString(),
            action: "Form Published",
          },
        ],
        version: formData.version + 1,
      };

      setFormData(updated);
      setSaveStatus("Form published successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Publish Error:", error);
      setSaveStatus("Error publishing form!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const quickSave = () => {
    try {
      const updated = {
        ...formData,
        status: "draft",
        lastModified: new Date().toISOString(),
        history: [
          ...formData.history,
          {
            version: formData.version + 1,
            timestamp: new Date().toISOString(),
            action: "Quick Save",
          },
        ],
        version: formData.version + 1,
      };

      setFormData(updated);
      setSaveStatus("Form saved as draft!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Save Error:", error);
      setSaveStatus("Error saving form!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const exportFormAsJson = () => {
    try {
      const dataStr = JSON.stringify(formData, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportFileDefaultName = `form_${formData.id}_${new Date().getTime()}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      addHistoryEntry("Form exported as JSON");
      setSaveStatus("Form exported as JSON successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Export Error:", error);
      setSaveStatus("Error exporting form!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const exportFormAsPdf = async () => {
    try {
      setSaveStatus("Generating PDF...");
      
      // Create a temporary div to generate the PDF content
      const pdfContent = document.createElement('div');
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.width = '794px'; // A4 width in pixels at 96 DPI
      pdfContent.style.padding = '40px';
      pdfContent.style.backgroundColor = 'white';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      
      // Build PDF content
      pdfContent.innerHTML = `
        <div style="margin-bottom: 30px;">
          <h1 style="color: #2c3e50; font-size: 28px; margin-bottom: 10px; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
            ${formData.title}
          </h1>
          ${formData.description ? `<p style="color: #7f8c8d; font-size: 14px; margin-bottom: 20px;">${formData.description}</p>` : ''}
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6c757d;">
              <div><strong>Form ID:</strong> ${formData.id}</div>
              <div><strong>Category:</strong> ${formData.category}</div>
              <div><strong>Version:</strong> ${formData.version}</div>
              <div><strong>Status:</strong> ${formData.status}</div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h2 style="color: #2c3e50; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 8px;">
            Form Configuration
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 13px;">
            <div><strong>Availability:</strong> ${formData.configuration.availability === 'all' ? 'All Employees' : formData.configuration.availability}</div>
            <div><strong>Submission Type:</strong> ${formData.configuration.submissionType === 'single' ? 'Single' : 'Multiple'}</div>
            <div><strong>Anonymous Submission:</strong> ${formData.configuration.anonymousSubmission ? 'Yes' : 'No'}</div>
            <div><strong>Auto-save:</strong> ${formData.configuration.autoSave ? 'Enabled' : 'Disabled'}</div>
            ${formData.configuration.submissionWindow === 'daterange' ? `
              <div><strong>Start Date:</strong> ${formData.configuration.startDate}</div>
              <div><strong>End Date:</strong> ${formData.configuration.endDate}</div>
            ` : ''}
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h2 style="color: #2c3e50; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 8px;">
            Form Fields (${formData.fields.length})
          </h2>
      `;
      
      // Add sections
      const sectionsByPage = {};
      formData.sections.forEach(section => {
        if (!sectionsByPage[section.page || 1]) {
          sectionsByPage[section.page || 1] = [];
        }
        sectionsByPage[section.page || 1].push(section);
      });
      
      // Add fields grouped by page
      const fieldsByPage = {};
      formData.fields.forEach(field => {
        const page = field.page || 1;
        if (!fieldsByPage[page]) {
          fieldsByPage[page] = [];
        }
        fieldsByPage[page].push(field);
      });
      
      // Get all pages
      const allPages = new Set([...Object.keys(fieldsByPage), ...Object.keys(sectionsByPage)]);
      const sortedPages = Array.from(allPages).map(Number).sort((a, b) => a - b);
      
      sortedPages.forEach(pageNumber => {
        pdfContent.innerHTML += `
          <div style="margin-bottom: 25px; page-break-inside: avoid;">
            <div style="background-color: #3498db; color: white; padding: 10px 15px; border-radius: 5px; margin-bottom: 15px;">
              <h3 style="margin: 0; font-size: 16px;">Page ${pageNumber}</h3>
            </div>
        `;
        
        // Add sections for this page
        if (sectionsByPage[pageNumber]) {
          sectionsByPage[pageNumber].forEach(section => {
            pdfContent.innerHTML += `
              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; margin-bottom: 15px; border-radius: 0 5px 5px 0;">
                <h4 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px;">${section.title}</h4>
                ${section.description ? `<p style="margin: 0; color: #7f8c8d; font-size: 13px;">${section.description}</p>` : ''}
                <div style="font-size: 11px; color: #95a5a6; margin-top: 8px;">SECTION</div>
              </div>
            `;
          });
        }
        
        // Add fields for this page
        if (fieldsByPage[pageNumber]) {
          fieldsByPage[pageNumber].forEach(field => {
            const fieldTypeInfo = fieldTypes.find(ft => ft.type === field.type);
            pdfContent.innerHTML += `
              <div style="border: 1px solid #dee2e6; padding: 15px; margin-bottom: 10px; border-radius: 5px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                      <span style="background-color: ${fieldTypeInfo?.color || '#6c757d'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">
                        ${fieldTypeInfo?.label || field.type}
                      </span>
                      ${field.required ? '<span style="background-color: #e74c3c; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">REQUIRED</span>' : ''}
                      ${field.prePopulate ? '<span style="background-color: #3498db; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">AUTO-FILLED</span>' : ''}
                    </div>
                    <h5 style="margin: 0; color: #2c3e50; font-size: 15px;">${field.label}</h5>
                    ${field.placeholder ? `<div style="color: #95a5a6; font-size: 13px; margin-top: 5px;">Placeholder: ${field.placeholder}</div>` : ''}
                  </div>
                  <div style="font-size: 11px; color: #95a5a6; background-color: #f8f9fa; padding: 4px 8px; border-radius: 4px;">
                    Field ID: ${field.id}
                  </div>
                </div>
                
                ${field.helpText ? `<div style="background-color: #f8f9fa; padding: 10px; border-radius: 4px; margin-bottom: 10px; font-size: 13px; color: #6c757d; border-left: 3px solid #95a5a6;">
                  <i>${field.helpText}</i>
                </div>` : ''}
                
                ${field.validation && (field.validation.minLength || field.validation.maxLength || field.validation.min || field.validation.max) ? `
                  <div style="font-size: 12px; color: #7f8c8d; margin-bottom: 8px;">
                    <strong>Validation Rules:</strong>
                    ${field.validation.minLength ? ` Min ${field.validation.minLength} chars` : ''}
                    ${field.validation.maxLength ? ` Max ${field.validation.maxLength} chars` : ''}
                    ${field.validation.min ? ` Min value: ${field.validation.min}` : ''}
                    ${field.validation.max ? ` Max value: ${field.validation.max}` : ''}
                  </div>
                ` : ''}
                
                ${['dropdown', 'radio', 'multi-select'].includes(field.type) && field.options && field.options.length > 0 ? `
                  <div style="font-size: 12px; color: #7f8c8d;">
                    <strong>Options:</strong>
                    <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                      ${field.options.map(opt => `<li>${opt}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                
                ${field.conditional ? `
                  <div style="background-color: #fff8e1; padding: 10px; border-radius: 4px; margin-top: 10px; border-left: 3px solid #ffc107; font-size: 12px;">
                    <strong>Conditional Logic:</strong> Shown when field "${field.conditional.dependsOn}" ${field.conditional.condition} "${field.conditional.value}"
                  </div>
                ` : ''}
              </div>
            `;
          });
        }
        
        pdfContent.innerHTML += `</div>`;
      });
      
      // Add footer
      pdfContent.innerHTML += `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 11px; color: #95a5a6;">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <strong>Generated:</strong> ${new Date().toLocaleString()}
            </div>
            <div>
              <strong>Total Fields:</strong> ${formData.fields.length} | 
              <strong>Total Sections:</strong> ${formData.sections.length} | 
              <strong>Total Pages:</strong> ${totalPages}
            </div>
          </div>
          <div style="text-align: center; margin-top: 10px;">
            Form generated by Custom Form Builder
          </div>
        </div>
      `;
      
      // Append to document
      document.body.appendChild(pdfContent);
      
      // Convert to PDF
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary element
      document.body.removeChild(pdfContent);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      const fileName = `form_${formData.title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      
      addHistoryEntry("Form exported as PDF");
      setSaveStatus("PDF exported successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("PDF Export Error:", error);
      setSaveStatus("Error generating PDF!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const importFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      setImportError("Please select a JSON file (.json)");
      setTimeout(() => setImportError(""), 5000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!importedData.fields || !Array.isArray(importedData.fields)) {
          throw new Error("Invalid form format: Missing fields array");
        }

        if (!importedData.title || typeof importedData.title !== "string") {
          throw new Error("Invalid form format: Missing or invalid title");
        }

        const updatedData = {
          ...importedData,
          id: importedData.id || `form_${Date.now()}`,
          lastModified: new Date().toISOString(),
          history: [
            ...(importedData.history || []),
            {
              version: (importedData.version || 0) + 1,
              timestamp: new Date().toISOString(),
              action: "Form Imported from File",
            },
          ],
        };

        setFormData(updatedData);
        setCurrentPage(1);
        addHistoryEntry("Form imported from file");
        setSaveStatus("Form imported successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
        event.target.value = null;
      } catch (error) {
        console.error("Import Error:", error);
        setImportError(`Import failed: ${error.message}`);
        setTimeout(() => setImportError(""), 5000);
      }
    };

    reader.onerror = () => {
      setImportError("Error reading file");
      setTimeout(() => setImportError(""), 5000);
    };

    reader.readAsText(file);
  };

  const importFromJson = () => {
    try {
      if (!importJson.trim()) {
        setImportError("Please enter JSON data");
        setTimeout(() => setImportError(""), 3000);
        return;
      }

      const importedData = JSON.parse(importJson);

      if (!importedData.fields || !Array.isArray(importedData.fields)) {
        throw new Error("Invalid form format: Missing fields array");
      }

      if (!importedData.title || typeof importedData.title !== "string") {
        throw new Error("Invalid form format: Missing or invalid title");
      }

      const updatedData = {
        ...importedData,
        id: importedData.id || `form_${Date.now()}`,
        lastModified: new Date().toISOString(),
        history: [
          ...(importedData.history || []),
          {
            version: (importedData.version || 0) + 1,
            timestamp: new Date().toISOString(),
            action: "Form Imported via JSON Text",
          },
        ],
      };

      setFormData(updatedData);
      setCurrentPage(1);
      setShowImportModal(false);
      setImportJson("");
      setImportError("");
      addHistoryEntry("Form imported via JSON");
      setSaveStatus("Form imported successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Import Error:", error);
      setImportError(`Import failed: ${error.message}`);
    }
  };

  const clearLocalStorage = () => {
    if (window.confirm("Are you sure you want to clear all saved forms? Current form will remain open.")) {
      localStorage.removeItem("dynamicFormBuilder");
      setSaveStatus("LocalStorage cleared!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const resetFormBuilder = () => {
    if (window.confirm("Are you sure you want to reset the form builder? All unsaved changes will be lost.")) {
      localStorage.removeItem("dynamicFormBuilder");
      setFormData({
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
          postActions: {
            email: false,
            notification: true,
            updateData: false,
          },
        },
        version: 1,
        history: [],
        status: "draft",
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      });
      setSelectedField(null);
      setCurrentPage(1);
      setSaveStatus("Form builder reset!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const currentPageFields = formData.fields.filter((f) => f.page === currentPage);
  const currentPageSections = formData.sections.filter((s) => s.page === currentPage);

  const renderPreviewField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
        return (
          <input
            type={field.type === "number" ? "number" : "text"}
            className="form-control"
            placeholder={field.placeholder}
          />
        );
      case "date":
        return <input type="date" className="form-control" />;
      case "dropdown":
        return (
          <select className="form-select">
            <option value="">Select an option</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "multi-select":
        return (
          <div className="d-flex flex-column gap-2">
            {field.options.map((option, idx) => (
              <div key={idx} className="form-check">
                <input className="form-check-input" type="checkbox" id={`multi_${field.id}_${idx}`} />
                <label className="form-check-label" htmlFor={`multi_${field.id}_${idx}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <div className="d-flex flex-column gap-2">
            {field.options.map((option, idx) => (
              <div key={idx} className="form-check">
                <input className="form-check-input" type="radio" name={`radio_${field.id}`} id={`radio_${field.id}_${idx}`} />
                <label className="form-check-label" htmlFor={`radio_${field.id}_${idx}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id={`checkbox_${field.id}`} />
            <label className="form-check-label" htmlFor={`checkbox_${field.id}`}>
              {field.label}
            </label>
          </div>
        );
      case "file":
        return (
          <div className="border-2 border-dashed rounded p-5 text-center cursor-pointer border-gray-300">
            <i className="bi-cloud-arrow-up fs-2 text-gray-500"></i>
            <p className="mt-2 mb-0 text-gray-600">Click to upload files</p>
          </div>
        );
      case "signature":
        return (
          <div className="border-2 border-dashed rounded p-5 text-center cursor-pointer border-gray-300">
            <i className="bi-pen fs-2 text-gray-500"></i>
            <p className="mt-2 mb-0 text-gray-600">Click to sign</p>
          </div>
        );
      case "rich-text":
        return (
          <textarea className="form-control" placeholder={field.placeholder} rows={4} />
        );
      case "rating":
        return (
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" className="btn btn-link p-1">
                <i className="bi-star-fill text-warning fs-4"></i>
              </button>
            ))}
          </div>
        );
      case "section":
        return (
          <div className="border-bottom border-primary pb-3 mb-4">
            <h3 className="h5 fw-semibold mb-1">{field.label}</h3>
            {field.helpText && (
              <p className="text-muted mb-0">{field.helpText}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderFieldProperties = () => {
    const field = formData.fields.find((f) => f.id === selectedField);
    if (!field) return null;

    return (
      <div className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small fw-medium">Label</label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className="form-control form-control-sm"
          />
        </div>

        <div>
          <label className="form-label small fw-medium">Page</label>
          <select
            className="form-select form-select-sm"
            value={field.page || 1}
            onChange={(e) => updateField(field.id, { page: parseInt(e.target.value) })}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <option key={pageNum} value={pageNum}>
                Page {pageNum}
              </option>
            ))}
          </select>
        </div>

        {field.type !== "checkbox" && field.type !== "radio" && (
          <div>
            <label className="form-label small fw-medium">Placeholder</label>
            <input
              type="text"
              value={field.placeholder}
              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
              className="form-control form-control-sm"
            />
          </div>
        )}

        <div>
          <label className="form-label small fw-medium">Help Text</label>
          <textarea
            value={field.helpText}
            onChange={(e) => updateField(field.id, { helpText: e.target.value })}
            className="form-control form-control-sm"
            rows={2}
          />
        </div>

        <div className="border rounded p-2">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              checked={field.required}
              onChange={(e) => updateField(field.id, { required: e.target.checked })}
            />
            <label className="form-check-label small">Required Field</label>
          </div>
        </div>

        <div className="border rounded p-2">
          <label className="form-label small fw-medium mb-2">Validation Rules</label>
          <div className="mb-2">
            <label className="form-label x-small text-muted">Max Length</label>
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Max characters"
              value={field.validation?.maxLength || ""}
              onChange={(e) =>
                updateField(field.id, {
                  validation: {
                    ...field.validation,
                    maxLength: e.target.value ? parseInt(e.target.value) : null,
                  },
                })
              }
            />
          </div>

          {(field.type === "text" || field.type === "email" || field.type === "phone") && (
            <div className="mb-2">
              <label className="form-label x-small text-muted">Min Length</label>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Min characters"
                value={field.validation?.minLength || ""}
                onChange={(e) =>
                  updateField(field.id, {
                    validation: {
                      ...field.validation,
                      minLength: e.target.value ? parseInt(e.target.value) : null,
                    },
                  })
                }
              />
            </div>
          )}

          {(field.type === "text" || field.type === "email" || field.type === "phone") && (
            <div className="mb-2">
              <label className="form-label x-small text-muted">Pattern (Regex)</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g., [A-Za-z0-9]+"
                value={field.validation?.pattern || ""}
                onChange={(e) =>
                  updateField(field.id, {
                    validation: {
                      ...field.validation,
                      pattern: e.target.value || "",
                    },
                  })
                }
              />
              <small className="text-muted x-small">Optional: Enter regex pattern for validation</small>
            </div>
          )}

          {field.type === "number" && (
            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="form-label x-small text-muted">Min Value</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Min"
                  value={field.validation?.min || ""}
                  onChange={(e) =>
                    updateField(field.id, {
                      validation: {
                        ...field.validation,
                        min: e.target.value ? parseFloat(e.target.value) : null,
                      },
                    })
                  }
                />
              </div>
              <div className="col-6">
                <label className="form-label x-small text-muted">Max Value</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Max"
                  value={field.validation?.max || ""}
                  onChange={(e) =>
                    updateField(field.id, {
                      validation: {
                        ...field.validation,
                        max: e.target.value ? parseFloat(e.target.value) : null,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {["dropdown", "radio", "multi-select"].includes(field.type) && (
          <div>
            <label className="form-label small fw-medium">Options</label>
            {field.options.map((opt, idx) => (
              <div key={idx} className="input-group input-group-sm mb-1">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const updated = [...field.options];
                    updated[idx] = e.target.value;
                    updateField(field.id, { options: updated });
                  }}
                  className="form-control"
                />
                <button className="btn btn-danger" onClick={() => {
                  const updated = field.options.filter((_, i) => i !== idx);
                  updateField(field.id, { options: updated });
                }}>
                  <i className="bi-trash"></i>
                </button>
              </div>
            ))}
            <button className="btn btn-outline-primary btn-sm mt-1" onClick={() =>
              updateField(field.id, {
                options: [...field.options, "New Option"],
              })
            }>
              <i className="bi-plus"></i> Add Option
            </button>
          </div>
        )}

        <div>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <div className="fw-medium small">Conditional Field</div>
              <div className="text-muted x-small">Show/hide based on other field</div>
            </div>
            <button className={`btn btn-sm ${field.conditional ? "btn-outline-danger" : "btn-outline-primary"}`}
              onClick={() =>
                updateField(field.id, {
                  conditional: field.conditional ? null : { dependsOn: "", condition: "equals", value: "" },
                })
              }>
              {field.conditional ? "Remove" : "Add"}
            </button>
          </div>
          {field.conditional && (
            <div className="bg-light border rounded p-2">
              <select className="form-select form-select-sm mb-2" value={field.conditional.dependsOn}
                onChange={(e) =>
                  updateField(field.id, {
                    conditional: { ...field.conditional, dependsOn: e.target.value },
                  })
                }>
                <option value="">Select field</option>
                {formData.fields.filter((f) => f.id !== field.id).map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
              <select className="form-select form-select-sm mb-2" value={field.conditional.condition}
                onChange={(e) =>
                  updateField(field.id, {
                    conditional: { ...field.conditional, condition: e.target.value },
                  })
                }>
                <option value="equals">Equals</option>
                <option value="not-equals">Not equals</option>
                <option value="contains">Contains</option>
                <option value="greater-than">Greater than</option>
                <option value="less-than">Less than</option>
              </select>
              <input type="text" className="form-control form-control-sm" placeholder="Value"
                value={field.conditional.value}
                onChange={(e) =>
                  updateField(field.id, {
                    conditional: { ...field.conditional, value: e.target.value },
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSectionProperties = () => {
    const section = formData.sections.find((s) => s.id === selectedField);
    if (!section) return null;

    return (
      <div className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small fw-medium">Section Title</label>
          <input type="text" value={section.title} onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              sections: prev.sections.map((s) =>
                s.id === section.id ? { ...s, title: e.target.value } : s
              ),
            }))}
            className="form-control form-control-sm"
          />
        </div>
        <div>
          <label className="form-label small fw-medium">Page</label>
          <select className="form-select form-select-sm" value={section.page || 1}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sections: prev.sections.map((s) =>
                  s.id === section.id ? { ...s, page: parseInt(e.target.value) } : s
                ),
              }))}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <option key={pageNum} value={pageNum}>Page {pageNum}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label small fw-medium">Description</label>
          <textarea value={section.description} onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              sections: prev.sections.map((s) =>
                s.id === section.id ? { ...s, description: e.target.value } : s
              ),
            }))}
            className="form-control form-control-sm" rows="2"
          />
        </div>
      </div>
    );
  };

  const addFieldFromClick = (fieldType) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: fieldType.type,
      label: fieldType.label,
      placeholder: fieldType.placeholder || `Enter ${fieldType.label}`,
      helpText: "",
      required: false,
      validation: {
        pattern: "",
        minLength: null,
        maxLength: null,
        min: null,
        max: null,
      },
      conditional: null,
      options: ["Option 1", "Option 2", "Option 3"],
      defaultValue: "",
      page: currentPage,
      section: null,
      prePopulate: fieldType.prePopulate || false,
      prePopulateType: fieldType.prePopulateType || null,
    };

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));

    setSelectedField(newField.id);
    addHistoryEntry(`Added ${fieldType.label} field to Page ${currentPage}`);
  };

  const renderPageTabs = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
      <div className="d-flex gap-1 mb-3 flex-wrap">
        {pages.map(pageNum => (
          <div key={pageNum} className="d-flex align-items-center">
            <button className={`btn ${currentPage === pageNum ? 'btn-primary' : 'btn-outline-primary'} btn-sm d-flex align-items-center gap-1`}
              onClick={() => changePage(pageNum)}>
              <i className="bi-file-text"></i>
              Page {pageNum}
              {formData.fields.filter(f => f.page === pageNum).length > 0 && (
                <span className="badge bg-light text-dark ms-1">
                  {formData.fields.filter(f => f.page === pageNum).length}
                </span>
              )}
            </button>
            {pageNum > 1 && (
              <button className="btn btn-outline-danger btn-sm ms-1" onClick={() => deletePage(pageNum)}
                title={`Delete Page ${pageNum}`}>
                <i className="bi-trash"></i>
              </button>
            )}
          </div>
        ))}
        <button className="btn btn-success btn-sm d-flex align-items-center gap-1" onClick={addPage} title="Add New Page">
          <i className="bi-plus-lg"></i>
          Add Page
        </button>
      </div>
    );
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="bg-white border-bottom">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center py-3">
            <div className="mb-4">
              <h2 className="fw-bold h4 h2-md">Custom Form Builder</h2>
              <p className="text-muted mb-0">Click to add fields - Auto-saves to LocalStorage</p>
            </div>
            {saveStatus && (
              <div className="alert alert-success py-2 mb-0">
                <i className="bi-check-circle me-2"></i>{saveStatus}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <button onClick={() => setShowPreview(true)} className="btn btn-light d-flex align-items-center gap-2">
              <i className="bi-eye"></i><span className="d-none d-sm-inline">Preview</span>
            </button>

            <div className="d-flex gap-2">
              <input type="file" ref={fileInputRef} accept=".json" onChange={importFromFile} className="d-none" />
              
              {/* Export Options Dropdown */}
              <div className="dropdown">
                <button className="btn btn-success dropdown-toggle d-flex align-items-center gap-2" 
                  type="button" 
                  id="exportDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  onClick={() => setShowExportOptions(!showExportOptions)}>
                  <i className="bi-download"></i><span>Export</span>
                </button>
                <ul className="dropdown-menu" aria-labelledby="exportDropdown">
                  <li>
                    <button onClick={exportFormAsPdf} className="dropdown-item d-flex align-items-center gap-2">
                      <i className="bi-file-pdf text-danger"></i>
                      <div>
                        <div className="fw-medium">Export as PDF</div>
                        <small className="text-muted">Download form as PDF document</small>
                      </div>
                    </button>
                  </li>
                  <li>
                    <button onClick={exportFormAsJson} className="dropdown-item d-flex align-items-center gap-2">
                      <i className="bi-file-code text-primary"></i>
                      <div>
                        <div className="fw-medium">Export as JSON</div>
                        <small className="text-muted">Download form as JSON file</small>
                      </div>
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleImportClick} className="dropdown-item d-flex align-items-center gap-2">
                      <i className="bi-upload text-warning"></i>
                      <div>
                        <div className="fw-medium">Import File</div>
                        <small className="text-muted">Import form from JSON file</small>
                      </div>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setShowImportModal(true)} className="dropdown-item d-flex align-items-center gap-2">
                      <i className="bi-code-slash text-info"></i>
                      <div>
                        <div className="fw-medium">Import JSON</div>
                        <small className="text-muted">Import form from JSON text</small>
                      </div>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="dropdown d-lg-none">
                <button className="btn btn-outline-primary dropdown-toggle" type="button" id="actionsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi-three-dots-vertical"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="actionsDropdown">
                  <li><button onClick={quickSave} className="dropdown-item"><i className="bi-save me-2"></i>Quick Save</button></li>
                  <li><button onClick={duplicateForm} className="dropdown-item"><i className="bi-copy me-2"></i>Duplicate Form</button></li>
                  <li><button onClick={saveForm} className="dropdown-item"><i className="bi-cloud-arrow-up me-2"></i>Publish Form</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={clearLocalStorage} className="dropdown-item text-danger"><i className="bi-trash me-2"></i>Clear LocalStorage</button></li>
                  <li><button onClick={resetFormBuilder} className="dropdown-item text-danger"><i className="bi-arrow-clockwise me-2"></i>Reset Builder</button></li>
                </ul>
              </div>

              <div className="d-none d-lg-flex gap-2">
                <button onClick={quickSave} className="btn btn-info d-flex align-items-center gap-2">
                  <i className="bi-save"></i><span>Save</span>
                </button>
                <button onClick={duplicateForm} className="btn btn-light d-flex align-items-center gap-2">
                  <i className="bi-copy"></i><span>Duplicate</span>
                </button>
                <button onClick={saveForm} className="btn btn-primary d-flex align-items-center gap-2">
                  <i className="bi-cloud-arrow-up"></i><span>Publish</span>
                </button>
                <button onClick={clearLocalStorage} className="btn btn-outline-danger d-flex align-items-center gap-2">
                  <i className="bi-trash"></i><span>Clear</span>
                </button>
                <button onClick={resetFormBuilder} className="btn btn-danger d-flex align-items-center gap-2">
                  <i className="bi-arrow-clockwise"></i><span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {importError && (
            <div className="alert alert-danger alert-dismissible fade show mb-3">
              <i className="bi-exclamation-triangle me-2"></i>{importError}
              <button type="button" className="btn-close" onClick={() => setImportError("")}></button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="badge bg-secondary me-2"><i className="bi-clock me-1"></i>Last Modified: {new Date(formData.lastModified).toLocaleTimeString()}</span>
              <span className="badge bg-info me-2"><i className="bi-list-ol me-1"></i>Version: {formData.version}</span>
              <span className={`badge ${formData.status === "published" ? "bg-success" : "bg-warning"}`}><i className="bi-circle-fill me-1"></i>Status: {formData.status}</span>
              <span className="badge bg-primary ms-2"><i className="bi-file-text me-1"></i>Pages: {totalPages}</span>
            </div>
          </div>

          <div className="d-inline-flex bg-light rounded-3 p-1 mb-3 flex-wrap">
            <button onClick={() => setActiveTab(0)} className={`btn py-2 px-3 px-md-4 ${activeTab === 0 ? "btn-primary text-white shadow-sm" : "btn-white text-dark border-0"} me-1 mb-1`}>
              <i className="bi-pencil me-1 me-md-2"></i><span className="d-none d-md-inline">Form Design Interface</span><span className="d-md-none">Design</span>
            </button>
            <button onClick={() => setActiveTab(1)} className={`btn py-2 px-3 px-md-4 ${activeTab === 1 ? "btn-primary text-white shadow-sm" : "btn-white text-dark border-0"} mb-1`}>
              <i className="bi-gear me-1 me-md-2"></i><span className="d-none d-md-inline">Form Configuration</span><span className="d-md-none">Config</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        {activeTab === 0 ? (
          <div className="row g-3">
            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="h6 fw-semibold mb-3">Field Types</h3>
                  <p className="text-muted small mb-3">Click a field to add it to <strong>Page {currentPage}</strong></p>
                  <div className="row g-2">
                    {fieldTypes.map((field) => (
                      <div key={field.type} className="col-6">
                        <div onClick={() => addFieldFromClick(field)} className="border rounded p-3 text-center cursor-pointer"
                          style={{ transition: "all 0.2s" }} onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = field.color;
                            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }} onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "";
                            e.currentTarget.style.boxShadow = "";
                            e.currentTarget.style.transform = "";
                          }} title={`Add ${field.label} field to Page ${currentPage}`}>
                          <i className={`bi ${field.icon} fs-4`} style={{ color: field.color }}></i>
                          <div className="small fw-medium mt-2">{field.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-top">
                    <h4 className="h6 fw-semibold mb-2">Pre-populate from Employee Master</h4>
                    <div className="bg-light rounded p-2 mb-2 small text-muted">Click to add auto-filled fields to <strong>Page {currentPage}</strong></div>
                    <div className="row g-2">
                      {[
                        { type: "employee_name", label: "Employee Name", icon: "bi-person", color: "#3B82F6" },
                        { type: "employee_email", label: "Email Address", icon: "bi-envelope", color: "#8B5CF6" },
                        { type: "employee_department", label: "Department", icon: "bi-building", color: "#10B981" },
                        { type: "employee_grade", label: "Grade/Position", icon: "bi-award", color: "#F59E0B" },
                      ].map((item) => (
                        <div key={item.type} className="col-6">
                          <div onClick={() => addFieldFromClick({
                            type: "text", label: item.label, icon: item.icon, color: item.color,
                            prePopulate: true, prePopulateType: item.type,
                          })} className="border rounded p-2 text-center cursor-pointer bg-info-subtle"
                            style={{ transition: "all 0.2s" }} onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = item.color;
                              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.1)";
                            }} onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "";
                              e.currentTarget.style.boxShadow = "";
                            }}>
                            <i className={`bi ${item.icon} fs-5`} style={{ color: item.color }}></i>
                            <div className="small fw-medium mt-1">{item.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card" style={{ minHeight: "600px" }}>
                <div className="card-body">
                  <div className="mb-4">
                    <input type="text" value={formData.title} onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Form Title" className="form-control-plaintext fs-3 fw-semibold border-0 p-0 mb-2" />
                    <textarea value={formData.description} onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Form Description (optional)" className="form-control-plaintext text-muted border-0 p-0 resize-none" rows="2" />
                    <div className="mt-3">{renderPageTabs()}</div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="text-muted small">Progress: Page {currentPage} of {totalPages}</div>
                        <div className="text-primary small fw-medium">{Math.round((currentPage / totalPages) * 100)}% Complete</div>
                      </div>
                      <div className="progress" style={{ height: "8px" }}>
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                          style={{ width: `${(currentPage / totalPages) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-primary mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0"><i className="bi-file-text me-2"></i>Page {currentPage}</h5>
                        <small className="text-muted">{currentPageFields.length} fields, {currentPageSections.length} sections</small>
                      </div>
                      <div className="d-flex gap-2">
                        <button onClick={addSection} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
                          <i className="bi-layers"></i> Add Section
                        </button>
                        <button onClick={addPage} className="btn btn-primary btn-sm d-flex align-items-center gap-1">
                          <i className="bi-plus"></i> Add Another Page
                        </button>
                      </div>
                    </div>
                  </div>

                  {currentPageSections.map((section) => (
                    <div key={section.id} className="card border-primary mb-3 cursor-pointer" onClick={() => setSelectedField(section.id)}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5 className="mb-1">{section.title}</h5>
                            {section.description && (
                              <p className="text-muted small mb-0">{section.description}</p>
                            )}
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary">Section</span>
                            <span className="badge bg-secondary">Page {section.page || 1}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {currentPageFields.length === 0 && currentPageSections.length === 0 ? (
                    <div className="text-center border-2 border-dashed p-5 bg-light rounded"
                      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
                      onDrop={(e) => { e.preventDefault(); handleDragEnd(); }}>
                      <i className="bi-arrow-down fs-1 text-muted mb-3 d-block"></i>
                      <p className="fw-medium mb-2">Page {currentPage} is empty</p>
                      <p className="text-muted small">Add fields from the left panel or sections to build your form</p>
                      <div className="mt-3">
                        <button className="btn btn-primary me-2" onClick={addSection}><i className="bi-layers me-1"></i> Add Section</button>
                        <button className="btn btn-outline-primary" onClick={addPage}><i className="bi-plus me-1"></i> Add Another Page</button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {currentPageFields.map((field, index) => (
                        <div key={field.id} draggable onDragStart={(e) => handleDragStart(e, field.id)}
                          onDragOver={(e) => handleDragOver(e, index)} onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd} onClick={() => setSelectedField(field.id)}
                          className={`card cursor-pointer position-relative ${selectedField === field.id ? "border-primary bg-primary-subtle" : ""}
                          ${draggedField === field.id ? "opacity-50" : ""} ${dragOverIndex === index && draggedField !== field.id ? "border-warning border-2" : ""}`}
                          style={{ cursor: draggedField === field.id ? "grabbing" : "grab", transition: "all 0.2s ease" }}>
                          <div className="position-absolute" style={{ left: "8px", top: "50%", transform: "translateY(-50%)", cursor: "grab", zIndex: 10 }}
                            onClick={(e) => e.stopPropagation()}>
                            <i className="bi-grip-vertical text-muted fs-5"></i>
                          </div>
                          <div className="card-body" style={{ paddingLeft: "40px" }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <i className={`bi ${fieldTypes.find((ft) => ft.type === field.type)?.icon}`}
                                  style={{ color: fieldTypes.find((ft) => ft.type === field.type)?.color }}></i>
                                <span className="fw-semibold">{field.label}</span>
                                {field.required && <span className="badge bg-danger-subtle text-danger">Required</span>}
                                {field.prePopulate && <span className="badge bg-info-subtle text-info">Auto-filled</span>}
                              </div>
                              <div className="d-flex gap-1">
                                <button onClick={(e) => { e.stopPropagation(); duplicateField(field.id); }}
                                  className="btn btn-sm btn-outline-secondary" title="Duplicate"><i className="bi-copy"></i></button>
                                <button onClick={(e) => { e.stopPropagation(); deleteField(field.id); }}
                                  className="btn btn-sm btn-outline-danger" title="Delete"><i className="bi-trash"></i></button>
                              </div>
                            </div>
                            <div className="text-muted small mb-2">{field.placeholder}
                              {field.validation?.maxLength && (
                                <span className="ms-2 text-info"><i className="bi-text-left me-1"></i>Max {field.validation.maxLength} chars</span>
                              )}
                            </div>
                            {field.helpText && (
                              <div className="alert alert-light small mb-0"><i className="bi-info-circle me-2"></i>{field.helpText}</div>
                            )}
                            {field.conditional && (
                              <div className="mt-2 badge bg-purple-subtle text-purple"><i className="bi-shield-check me-1"></i>Conditional field</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="h6 fw-semibold mb-3">
                    {selectedField ? formData.fields.find((f) => f.id === selectedField) ? "Field Properties" : "Section Properties" : "No Field Selected"}
                  </h3>
                  {selectedField ? (
                    formData.fields.find((f) => f.id === selectedField) ? renderFieldProperties() : renderSectionProperties()
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <i className="bi-cursor fs-2 d-block mb-2"></i>
                      <p className="small mb-0">Select a field or section to edit its properties</p>
                      <div className="mt-3">
                        <div className="alert alert-info small"><i className="bi-info-circle me-2"></i>Currently viewing <strong>Page {currentPage}</strong> of {totalPages}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card mt-3">
                <div className="card-body">
                  <h4 className="h6 fw-semibold mb-3">Version History</h4>
                  <div className="list-group list-group-flush" style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {formData.history.length > 0 ? (
                      formData.history.slice().reverse().map((entry, idx) => (
                        <div key={idx} className="list-group-item px-0 py-2 border-0">
                          <div className="d-flex justify-content-between">
                            <div>
                              <div className="fw-medium small">{entry.action}</div>
                              <div className="text-muted x-small">Version {entry.version} • {entry.changedBy}</div>
                            </div>
                            <span className="text-muted x-small">{new Date(entry.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted small py-2">No version history available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="h5 fw-semibold mb-3">Form Configuration</h2>
                  <div className="d-flex flex-column gap-3">
                    <div><label className="form-label small fw-medium">Form Title</label>
                      <input type="text" className="form-control" value={formData.title} onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))} placeholder="Enter form title" />
                    </div>
                    <div><label className="form-label small fw-medium">Form Description</label>
                      <textarea className="form-control" rows={2} value={formData.description} onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))} placeholder="Short description of form" />
                    </div>
                    <div><label className="form-label small fw-medium">Form Category</label>
                      <select className="form-select" value={formData.category} onChange={(e) =>
                        setFormData((prev) => ({ ...prev, category: e.target.value }))}>
                        {categories.map((cat) => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                      </select>
                    </div>
                    <div><label className="form-label small fw-medium">Availability</label>
                      <select className="form-select" value={formData.configuration.availability} onChange={(e) =>
                        setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration, availability: e.target.value } }))}>
                        <option value="all">All Employees</option><option value="departments">Specific Departments</option>
                        <option value="grades">Specific Grades</option>
                      </select>
                      {formData.configuration.availability === "departments" && (
                        <div className="mt-2 d-flex flex-wrap gap-2">
                          {departments.map((dept) => (<label key={dept} className="form-check">
                            <input type="checkbox" className="form-check-input" checked={formData.configuration.departments.includes(dept)}
                              onChange={(e) => { const newList = e.target.checked ? [...formData.configuration.departments, dept] :
                                formData.configuration.departments.filter((d) => d !== dept);
                                setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration, departments: newList } }));
                              }} /><span className="form-check-label small">{dept}</span></label>))}
                        </div>
                      )}
                      {formData.configuration.availability === "grades" && (
                        <div className="mt-2 d-flex flex-wrap gap-2">
                          {grades.map((grade) => (<label key={grade} className="form-check">
                            <input type="checkbox" className="form-check-input" checked={formData.configuration.grades.includes(grade)}
                              onChange={(e) => { const newList = e.target.checked ? [...formData.configuration.grades, grade] :
                                formData.configuration.grades.filter((g) => g !== grade);
                                setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration, grades: newList } }));
                              }} /><span className="form-check-label small">{grade}</span></label>))}
                        </div>
                      )}
                    </div>
                    <div><label className="form-label small fw-medium">Submission Window</label>
                      <select className="form-select" value={formData.configuration.submissionWindow} onChange={(e) =>
                        setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration, submissionWindow: e.target.value } }))}>
                        <option value="always">Always Available</option><option value="daterange">Date Range</option>
                      </select>
                      {formData.configuration.submissionWindow === "daterange" && (
                        <div className="row g-2 mt-2">
                          <div className="col"><input type="date" className="form-control" value={formData.configuration.startDate}
                            onChange={(e) => setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration, startDate: e.target.value } }))} /></div>
                          <div className="col"><input type="date" className="form-control" value={formData.configuration.endDate}
                            onChange={(e) => setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration, endDate: e.target.value } }))} /></div>
                        </div>
                      )}
                    </div>
                    <div><label className="form-label small fw-medium">Submission Type</label>
                      <div className="d-flex gap-3">
                        <label className="form-check"><input type="radio" name="submissionType" className="form-check-input"
                          checked={formData.configuration.submissionType === "single"} onChange={() =>
                            setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration, submissionType: "single" } }))} />
                          <span className="form-check-label">Single Submission</span>
                        </label>
                        <label className="form-check"><input type="radio" name="submissionType" className="form-check-input"
                          checked={formData.configuration.submissionType === "multiple"} onChange={() =>
                            setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration, submissionType: "multiple" } }))} />
                          <span className="form-check-label">Multiple Submissions</span>
                        </label>
                      </div>
                      {formData.configuration.submissionType === "multiple" && (
                        <div className="mt-2"><label className="form-label small">Submission Limit</label>
                          <input type="number" className="form-control" min="1" value={formData.configuration.submissionLimit}
                            onChange={(e) => setFormData((prev) => ({ ...prev, configuration: {
                              ...prev.configuration, submissionLimit: parseInt(e.target.value) || 1 } }))} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="h5 fw-semibold mb-3">Advanced Settings</h2>
                  <div className="d-flex flex-column gap-3">
                    <div className="border rounded p-3">
                      <label className="form-check form-switch"><input type="checkbox" className="form-check-input"
                        checked={formData.configuration.anonymousSubmission} onChange={(e) =>
                          setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration, anonymousSubmission: e.target.checked } }))} />
                        <span className="form-check-label fw-medium small">Anonymous Submission</span>
                        <div className="text-muted x-small">Allow users to submit without revealing identity</div>
                      </label>
                    </div>
                    <div className="border rounded p-3">
                      <label className="form-check form-switch"><input type="checkbox" className="form-check-input"
                        checked={formData.configuration.autoSave} onChange={(e) =>
                          setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration, autoSave: e.target.checked } }))} />
                        <span className="form-check-label fw-medium small">Auto-save Draft</span>
                        <div className="text-muted x-small">Automatically save user's draft progress</div>
                      </label>
                    </div>
                    <div><label className="form-label small fw-medium">Confirmation Message</label>
                      <textarea className="form-control" rows={3} value={formData.configuration.confirmationMessage}
                        onChange={(e) => setFormData((prev) => ({ ...prev, configuration: {
                          ...prev.configuration, confirmationMessage: e.target.value } }))} />
                    </div>
                    <div><label className="form-label small fw-medium">Post-submission Actions</label>
                      <label className="form-check"><input type="checkbox" className="form-check-input"
                        checked={formData.configuration.postActions.email} onChange={(e) =>
                          setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration,
                            postActions: { ...prev.configuration.postActions, email: e.target.checked } } }))} />
                        <span className="form-check-label small">Send Email Notification</span>
                      </label>
                      <label className="form-check"><input type="checkbox" className="form-check-input"
                        checked={formData.configuration.postActions.notification} onChange={(e) =>
                          setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration,
                            postActions: { ...prev.configuration.postActions, notification: e.target.checked } } }))} />
                        <span className="form-check-label small">Send In-app Notification</span>
                      </label>
                      <label className="form-check"><input type="checkbox" className="form-check-input"
                        checked={formData.configuration.postActions.updateData} onChange={(e) =>
                          setFormData((prev) => ({ ...prev, configuration: { ...prev.configuration,
                            postActions: { ...prev.configuration.postActions, updateData: e.target.checked } } }))} />
                        <span className="form-check-label small">Update Employee Data</span>
                      </label>
                    </div>
                    <div className="border-top pt-3 mt-3">
                      <label className="form-label small fw-medium">Export Options</label>
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex gap-2">
                          <button onClick={exportFormAsPdf} className="btn btn-danger btn-sm flex-fill d-flex align-items-center justify-content-center gap-2">
                            <i className="bi-file-pdf"></i>Export as PDF
                          </button>
                          <button onClick={exportFormAsJson} className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-2">
                            <i className="bi-file-code"></i>Export as JSON
                          </button>
                        </div>
                        <div className="d-flex gap-2">
                          <button onClick={handleImportClick} className="btn btn-warning btn-sm flex-fill d-flex align-items-center justify-content-center gap-2">
                            <i className="bi-upload"></i>Import File
                          </button>
                          <button onClick={() => setShowImportModal(true)} className="btn btn-info btn-sm flex-fill d-flex align-items-center justify-content-center gap-2">
                            <i className="bi-code-slash"></i>Import JSON
                          </button>
                        </div>
                        <button onClick={clearLocalStorage} className="btn btn-outline-danger text-primary btn-sm d-flex align-items-center justify-content-center gap-2">
                          <i className="bi-trash"></i>Clear LocalStorage
                        </button>
                        <button onClick={resetFormBuilder} className="btn btn-danger btn-sm d-flex align-items-center justify-content-center gap-2">
                          <i className="bi-arrow-clockwise"></i>Reset Form Builder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Form Preview</h5>
                <button type="button" className="btn-close" onClick={() => setShowPreview(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <h3 className="h5 fw-semibold mb-1">{formData.title}</h3>
                  {formData.description && <p className="text-muted mb-0">{formData.description}</p>}
                  <div className="alert alert-info mt-2"><i className="bi-info-circle me-2"></i>This form has {totalPages} page(s)</div>
                </div>
                <div className="d-flex flex-column gap-3">
                  {formData.fields.map((field) => (
                    <div key={field.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label fw-medium">{field.label}{field.required && <span className="text-danger ms-1">*</span>}</label>
                        <span className="badge bg-secondary">Page {field.page || 1}</span>
                      </div>
                      {renderPreviewField(field)}
                      {field.helpText && <div className="form-text">{field.helpText}</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPreview(false)}>Cancel</button>
                <button type="button" className="btn btn-primary">Submit Form</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Import Form JSON</h5>
                <button type="button" className="btn-close" onClick={() => { setShowImportModal(false); setImportError(""); }}></button>
              </div>
              <div className="modal-body">
                {importError && (<div className="alert alert-danger mb-3"><i className="bi-exclamation-triangle me-2"></i>{importError}</div>)}
                <div className="mb-3"><label className="form-label">Paste JSON Data</label>
                  <textarea className="form-control" rows={10} value={importJson} onChange={(e) => setImportJson(e.target.value)}
                    placeholder="Paste your form JSON here..." />
                </div>
                <div className="alert alert-info small"><i className="bi-info-circle me-2"></i>Importing will replace your current form. Make sure to export first!</div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowImportModal(false); setImportError(""); setImportJson(""); }}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={importFromJson}>Import JSON</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} accept=".json" onChange={importFromFile} className="d-none" />
    </div>
  );
};

export default CustomFormBuilder;