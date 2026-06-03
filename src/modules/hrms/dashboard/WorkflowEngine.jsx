import React, { useState, useEffect } from "react";
import {
  Settings, Users, Clock, AlertCircle, CheckCircle, XCircle,
  Send, Edit, FileText, Calendar, Bell, Zap, Layers, Filter,
  ChevronRight, Plus, Trash2, Copy, Save, Eye, History,
  Download, Upload, RefreshCw, Search, UserPlus, Mail, MessageSquare,
  ExternalLink, RotateCcw, Shield, Lock, Unlock, EyeOff,
  Database, CreditCard, FileText as FileTextIcon, AlertTriangle,
  Cpu, Cloud, CheckSquare, X, GitBranch
} from "lucide-react";

// Import jsPDF
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const WorkflowEngine = () => {
  const [activeSection, setActiveSection] = useState("config");
  const [workflowType, setWorkflowType] = useState("linear");
  const [selectedApprovers, setSelectedApprovers] = useState([]);
  
  // Auto-approval rules state
  const [newAutoRule, setNewAutoRule] = useState({
    condition: "amount",
    operator: "<=",
    value: "",
    action: "auto-approve"
  });
  const [autoApprovalRules, setAutoApprovalRules] = useState([
    { id: 1, condition: "amount", operator: "<=", value: "1000", action: "auto-approve" }
  ]);
  
  // Escalation rules state
  const [escalationRules, setEscalationRules] = useState([
    { 
      id: 1, 
      name: "Primary Approver Timeout", 
      trigger: "timeout", 
      timeout: 48, 
      unit: "hours", 
      action: "escalate",
      target: "skip-level",
      notifyOriginal: true,
      isEnabled: true 
    },
    { 
      id: 2, 
      name: "Out of Office", 
      trigger: "out-of-office", 
      action: "delegate",
      target: "backup-approver",
      notifyOriginal: true,
      isEnabled: true 
    }
  ]);
  
  const [workflowStages, setWorkflowStages] = useState([
    { id: 1, level: "direct-manager", approvers: [], timeout: 24, isEnabled: true }
  ]);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    slack: false,
    whatsapp: false
  });
  const [auditSettings, setAuditSettings] = useState({
    logActions: true,
    trackModifications: true,
    recordIP: false,
    archive: true,
    retentionPeriod: 365
  });
  const [integrationSettings, setIntegrationSettings] = useState({
    updateEmployeeMaster: true,
    triggerPayroll: false,
    generateDocuments: true,
    createCalendarEvents: true,
    updateAttendance: true,
    createTasks: true,
    logAuditTrail: true,
    notifyStakeholders: true,
    syncWithCRM: false,
    updateProjectManagement: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStageModal, setShowStageModal] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [conditionalRules, setConditionalRules] = useState([]);
  const [workflowActions, setWorkflowActions] = useState({
    requireApprovalComments: true,
    requireRejectionReasons: true,
    allowSendBack: true,
    allowRequestInfo: true,
    allowConditionalApproval: true,
    enableBulkApproval: true
  });
  const [delegationSettings, setDelegationSettings] = useState({
    allowDelegation: true,
    requireManagerApproval: false,
    limitDelegationDuration: true,
    maxDelegationDays: 30
  });
  
  // Add state for export menu
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Add CSS for spin animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin {
        animation: spin 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const approvalLevels = [
    { id: "direct-manager", label: "Direct Manager", icon: Users },
    { id: "skip-level", label: "Skip-level Manager", icon: Users },
    { id: "hr", label: "HR", icon: Users },
    { id: "dept-head", label: "Department Head", icon: Users },
    { id: "finance", label: "Finance", icon: Users },
    { id: "admin", label: "Admin", icon: Users },
    { id: "c-suite", label: "C-Suite", icon: Users }
  ];

  const escalationTargets = [
    { id: "skip-level", label: "Skip-level Manager" },
    { id: "dept-head", label: "Department Head" },
    { id: "hr", label: "HR Department" },
    { id: "admin", label: "Administrator" },
    { id: "backup-approver", label: "Backup Approver" },
    { id: "auto-assign", label: "Auto-assign based on availability" }
  ];

  const integrationTypes = [
    { id: "employee-master", label: "Employee Master Data", icon: Database },
    { id: "payroll", label: "Payroll System", icon: CreditCard },
    { id: "documents", label: "Document Generation", icon: FileTextIcon },
    { id: "calendar", label: "Calendar Events", icon: Calendar },
    { id: "attendance", label: "Attendance/Leave Systems", icon: Clock },
    { id: "tasks", label: "Task Management", icon: CheckSquare },
    { id: "audit", label: "Audit Trail", icon: Shield },
    { id: "notifications", label: "Stakeholder Notifications", icon: Bell },
    { id: "crm", label: "CRM Systems", icon: Users },
    { id: "project", label: "Project Management", icon: Layers }
  ];

  const conditions = [
    { id: "amount", label: "Amount", type: "number", operators: ["<=", ">=", "=", "<", ">"] },
    { id: "type", label: "Request Type", type: "select", operators: ["equals", "not equals", "in", "not in"] },
    { id: "department", label: "Department", type: "select", operators: ["equals", "not equals", "in", "not in"] },
    { id: "frequency", label: "Frequency", type: "number", operators: ["<=", ">=", "=", "<", ">"] },
    { id: "field_value", label: "Form Field Value", type: "text", operators: ["equals", "contains", "starts with", "ends with"] }
  ];

  // Button Functionality Handlers
  const handleAddStage = () => {
    const newStage = {
      id: workflowStages.length + 1,
      level: "direct-manager",
      approvers: [],
      timeout: 24,
      isEnabled: true
    };
    setWorkflowStages([...workflowStages, newStage]);
    console.log("Added new workflow stage:", newStage);
  };

  const handleDeleteStage = (stageId) => {
    if (workflowStages.length > 1) {
      const updatedStages = workflowStages.filter(stage => stage.id !== stageId);
      setWorkflowStages(updatedStages);
      console.log("Deleted stage:", stageId);
    } else {
      alert("Cannot delete the last stage. Workflow must have at least one stage.");
    }
  };

  const handleEditStage = (stageId) => {
    const stage = workflowStages.find(s => s.id === stageId);
    if (stage) {
      setEditingStage({ ...stage });
      setShowStageModal(true);
    }
  };

  const handleSaveStage = () => {
    if (editingStage) {
      const updatedStages = workflowStages.map(stage => 
        stage.id === editingStage.id ? editingStage : stage
      );
      setWorkflowStages(updatedStages);
      setShowStageModal(false);
      setEditingStage(null);
      console.log("Stage updated:", editingStage);
    }
  };

  const handleAddConditionalRule = () => {
    const newRule = {
      id: conditionalRules.length + 1,
      field: "",
      operator: "equals",
      value: "",
      routeTo: "direct-manager",
      isEnabled: true
    };
    setConditionalRules([...conditionalRules, newRule]);
  };

  const handleDeleteConditionalRule = (ruleId) => {
    setConditionalRules(conditionalRules.filter(rule => rule.id !== ruleId));
  };

  // Fixed: Auto-approval rule handlers
  const handleUpdateNewAutoRule = (field, value) => {
    setNewAutoRule({
      ...newAutoRule,
      [field]: value
    });
  };

  const handleAddAutoApprovalRule = () => {
    // Validate the new rule
    if (!newAutoRule.value || newAutoRule.value.trim() === "") {
      alert("Please enter a value for the rule");
      return;
    }

    const newRule = {
      id: autoApprovalRules.length + 1,
      condition: newAutoRule.condition,
      operator: newAutoRule.operator,
      value: newAutoRule.value,
      action: newAutoRule.action
    };
    
    setAutoApprovalRules([...autoApprovalRules, newRule]);
    
    // Reset new rule form
    setNewAutoRule({
      condition: "amount",
      operator: "<=",
      value: "",
      action: "auto-approve"
    });
    
    console.log("Added new auto-approval rule:", newRule);
  };

  const handleDeleteAutoApprovalRule = (ruleId) => {
    const updatedRules = autoApprovalRules.filter(rule => rule.id !== ruleId);
    setAutoApprovalRules(updatedRules);
    console.log("Deleted auto-approval rule:", ruleId);
  };

  // Fixed: Escalation rule handlers
  const handleAddEscalationRule = () => {
    const newRule = {
      id: escalationRules.length + 1,
      name: `New Escalation Rule ${escalationRules.length + 1}`,
      trigger: "timeout",
      timeout: 48,
      unit: "hours",
      action: "escalate",
      target: "skip-level",
      notifyOriginal: true,
      isEnabled: true
    };
    setEscalationRules([...escalationRules, newRule]);
    console.log("Added new escalation rule:", newRule);
  };

  const handleDeleteEscalationRule = (ruleId) => {
    const updatedRules = escalationRules.filter(rule => rule.id !== ruleId);
    setEscalationRules(updatedRules);
    console.log("Deleted escalation rule:", ruleId);
  };

  const handleToggleEscalationRule = (ruleId) => {
    const updatedRules = escalationRules.map(rule => 
      rule.id === ruleId ? { ...rule, isEnabled: !rule.isEnabled } : rule
    );
    setEscalationRules(updatedRules);
    console.log("Toggled escalation rule:", ruleId);
  };

  const handleSaveConfiguration = () => {
    setIsSaving(true);
    console.log("Saving configuration...");
    
    const config = {
      workflowType,
      workflowStages,
      autoApprovalRules,
      escalationRules,
      conditionalRules,
      workflowActions,
      delegationSettings,
      notifications,
      auditSettings,
      integrationSettings
    };
    
    // Simulate API call
    setTimeout(() => {
      console.log("Configuration saved:", config);
      setIsSaving(false);
      alert("Configuration saved successfully!");
    }, 1000);
  };

  const handleSaveAsTemplate = () => {
    const templateName = prompt("Enter template name:");
    if (templateName) {
      const template = {
        name: templateName,
        workflowType,
        workflowStages,
        autoApprovalRules,
        escalationRules,
        conditionalRules,
        workflowActions,
        delegationSettings,
        createdAt: new Date().toISOString()
      };
      console.log("Saved as template:", template);
      alert(`Template "${templateName}" saved successfully!`);
    }
  };

  const handlePreviewWorkflow = () => {
    setShowPreview(!showPreview);
    console.log("Preview workflow:", showPreview ? "closed" : "opened");
  };

  // Helper function to generate PDF content
  const generatePDFContent = (config) => {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto;">
        <h1 style="text-align: center; color: #3b82f6; margin-bottom: 10px; font-size: 28px;">Workflow Configuration</h1>
        <p style="text-align: center; color: #64748b; margin-bottom: 30px; font-size: 14px;">
          Generated on: ${new Date().toLocaleString()}
        </p>
        
        <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 20px; margin-top: 30px;">
          Workflow Settings
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: bold; width: 30%;">
              Workflow Type:
            </td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; width: 70%;">
              ${config.workflowType.charAt(0).toUpperCase() + config.workflowType.slice(1)}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: bold;">
              Created:
            </td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">
              ${new Date(config.exportedAt).toLocaleString()}
            </td>
          </tr>
        </table>
        
        <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 20px; margin-top: 30px;">
          Workflow Stages (${config.workflowStages.length})
        </h2>
        ${config.workflowStages.map((stage, index) => `
          <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid #3b82f6; background: #f0f9ff; border-radius: 4px;">
            <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">
              Stage ${index + 1}: ${stage.level.replace(/-/g, ' ').toUpperCase()}
            </h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              <strong>Timeout:</strong> ${stage.timeout} hours | 
              <strong>Approvers:</strong> ${stage.approvers?.length || 0} | 
              <strong>Status:</strong> ${stage.isEnabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        `).join('')}
        
        <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 20px; margin-top: 30px;">
          Auto-Approval Rules (${config.autoApprovalRules.length})
        </h2>
        ${config.autoApprovalRules.length === 0 ? 
          '<p style="color: #64748b; padding: 10px; background: #f8fafc; border-radius: 4px;">No auto-approval rules configured.</p>' : 
          `
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Rule</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Condition</th>
                <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${config.autoApprovalRules.map(rule => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">
                    Rule #${rule.id}
                  </td>
                  <td style="padding: 10px; border: 1px solid #e2e8f0;">
                    ${rule.condition} ${rule.operator} ${rule.value}
                  </td>
                  <td style="padding: 10px; border: 1px solid #e2e8f0;">
                    <span style="color: ${rule.action === 'auto-approve' ? '#10b981' : '#ef4444'}; font-weight: bold;">
                      ${rule.action}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          `
        }
        
        <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 20px; margin-top: 30px;">
          Escalation Rules (${config.escalationRules.length})
        </h2>
        ${config.escalationRules.map(rule => `
          <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid #f59e0b; background: #fef3c7; border-radius: 4px;">
            <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">
              ${rule.name}
            </h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              <strong>Trigger:</strong> ${rule.trigger === 'timeout' ? `${rule.timeout} ${rule.unit} timeout` : 'Out of Office'} | 
              <strong>Action:</strong> ${rule.action} | 
              <strong>Target:</strong> ${rule.target.replace(/-/g, ' ')} | 
              <strong>Status:</strong> ${rule.isEnabled ? 'Active' : 'Inactive'}
            </p>
          </div>
        `).join('')}
        
        <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 20px; margin-top: 30px;">
          Integration Settings
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Integration</th>
              <th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(config.integrationSettings).map(([key, value]) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">
                  ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: center;">
                  ${value ? 
                    '<span style="color: #10b981; font-weight: bold;">✓ Enabled</span>' : 
                    '<span style="color: #ef4444; font-weight: bold;">✗ Disabled</span>'
                  }
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 12px; text-align: center;">
          <p style="margin: 5px 0;">Generated by Approval Workflow System</p>
          <p style="margin: 5px 0;">Document ID: WF-${Date.now().toString().slice(-8)}</p>
          <p style="margin: 5px 0;">This is an automatically generated configuration document</p>
        </div>
      </div>
    `;
  };

  // Main PDF Export Function
  const handleExportConfiguration = async () => {
    setIsSaving(true);
    
    const config = {
      workflowType,
      workflowStages,
      autoApprovalRules,
      escalationRules,
      conditionalRules,
      workflowActions,
      delegationSettings,
      notifications,
      auditSettings,
      integrationSettings,
      exportedAt: new Date().toISOString()
    };
    
    try {
      // Create a temporary element to hold the PDF content
      const element = document.createElement('div');
      element.style.width = '210mm'; // A4 width
      element.style.padding = '20mm';
      element.style.background = 'white';
      element.style.boxSizing = 'border-box';
      element.innerHTML = generatePDFContent(config);
      document.body.appendChild(element);
      
      // Generate canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Remove the temporary element
      document.body.removeChild(element);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let position = 0;
      
      // Add first page
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
      
      // Add additional pages if needed
      let heightLeft = imgHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      const fileName = `workflow-configuration-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      console.log("Exported configuration as PDF:", config);
      alert(`Configuration exported as ${fileName}`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again or export as JSON instead.');
      
      // Fallback to JSON export if PDF generation fails
      const dataStr = JSON.stringify(config, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `workflow-config-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } finally {
      setIsSaving(false);
      setShowExportMenu(false);
    }
  };

  // Alternative JSON Export Function
  const handleExportJSON = () => {
    const config = {
      workflowType,
      workflowStages,
      autoApprovalRules,
      escalationRules,
      conditionalRules,
      workflowActions,
      delegationSettings,
      notifications,
      auditSettings,
      integrationSettings,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `workflow-config-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log("Exported configuration as JSON:", config);
    setShowExportMenu(false);
  };

  const handleImportConfiguration = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target.result);
          console.log("Imported configuration:", config);
          
          if (config.workflowType) setWorkflowType(config.workflowType);
          if (config.workflowStages) setWorkflowStages(config.workflowStages);
          if (config.autoApprovalRules) setAutoApprovalRules(config.autoApprovalRules);
          if (config.escalationRules) setEscalationRules(config.escalationRules);
          if (config.conditionalRules) setConditionalRules(config.conditionalRules);
          if (config.workflowActions) setWorkflowActions(config.workflowActions);
          if (config.delegationSettings) setDelegationSettings(config.delegationSettings);
          if (config.notifications) setNotifications(config.notifications);
          if (config.auditSettings) setAuditSettings(config.auditSettings);
          if (config.integrationSettings) setIntegrationSettings(config.integrationSettings);
          
          alert("Configuration imported successfully!");
        } catch (error) {
          alert("Error importing configuration. Please check the file format.");
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all settings to defaults? This cannot be undone.")) {
      setWorkflowType("linear");
      setWorkflowStages([{ id: 1, level: "direct-manager", approvers: [], timeout: 24, isEnabled: true }]);
      setAutoApprovalRules([{ id: 1, condition: "amount", operator: "<=", value: "1000", action: "auto-approve" }]);
      setEscalationRules([
        { 
          id: 1, 
          name: "Primary Approver Timeout", 
          trigger: "timeout", 
          timeout: 48, 
          unit: "hours", 
          action: "escalate",
          target: "skip-level",
          notifyOriginal: true,
          isEnabled: true 
        },
        { 
          id: 2, 
          name: "Out of Office", 
          trigger: "out-of-office", 
          action: "delegate",
          target: "backup-approver",
          notifyOriginal: true,
          isEnabled: true 
        }
      ]);
      setConditionalRules([]);
      setWorkflowActions({
        requireApprovalComments: true,
        requireRejectionReasons: true,
        allowSendBack: true,
        allowRequestInfo: true,
        allowConditionalApproval: true,
        enableBulkApproval: true
      });
      setDelegationSettings({
        allowDelegation: true,
        requireManagerApproval: false,
        limitDelegationDuration: true,
        maxDelegationDays: 30
      });
      setNotifications({ email: true, sms: false, push: true, slack: false, whatsapp: false });
      setAuditSettings({ logActions: true, trackModifications: true, recordIP: false, archive: true, retentionPeriod: 365 });
      setIntegrationSettings({
        updateEmployeeMaster: true,
        triggerPayroll: false,
        generateDocuments: true,
        createCalendarEvents: true,
        updateAttendance: true,
        createTasks: true,
        logAuditTrail: true,
        notifyStakeholders: true,
        syncWithCRM: false,
        updateProjectManagement: false
      });
      
      // Reset new auto rule form
      setNewAutoRule({
        condition: "amount",
        operator: "<=",
        value: "",
        action: "auto-approve"
      });
      
      console.log("Reset all settings to defaults");
    }
  };

  const handleTestNotifications = () => {
    console.log("Testing notifications...");
    setTimeout(() => {
      alert("Test notifications sent! Check your email and notifications.");
    }, 500);
  };

  const handleViewAuditLog = () => {
    console.log("Opening audit log...");
    alert("Opening audit log...");
  };

  const handleSearchApprovers = () => {
    if (searchQuery.trim()) {
      console.log("Searching approvers for:", searchQuery);
      alert(`Searching approvers: ${searchQuery}`);
    }
  };

  const handleAddApprover = () => {
    console.log("Opening add approver modal...");
    alert("Opening add approver form...");
  };

  const handleSendTestEmail = () => {
    console.log("Sending test email...");
    setTimeout(() => {
      alert("Test email sent successfully!");
    }, 500);
  };

  const handleEnableWorkflow = () => {
    console.log("Enabling workflow...");
    alert("Workflow enabled and activated!");
  };

  const handleDisableWorkflow = () => {
    if (window.confirm("Disable this workflow? Active requests will be paused.")) {
      console.log("Disabling workflow...");
      alert("Workflow disabled!");
    }
  };

  const handleCloneWorkflow = () => {
    const clonedStages = workflowStages.map(stage => ({
      ...stage,
      id: stage.id + 100,
      name: `${stage.level} (Clone)`
    }));
    
    setWorkflowStages([...workflowStages, ...clonedStages]);
    console.log("Cloned workflow stages");
    alert("Workflow stages cloned! Edit the new stages as needed.");
  };

  const handleValidateConfiguration = () => {
    const errors = [];
    
    if (workflowStages.length === 0) {
      errors.push("Workflow must have at least one stage");
    }
    
    if (errors.length > 0) {
      alert("Validation Errors:\n" + errors.join("\n"));
    } else {
      alert("Configuration is valid!");
    }
    
    console.log("Configuration validation:", errors.length > 0 ? "Failed" : "Passed");
  };

  const handleToggleIntegration = (integrationId) => {
    setIntegrationSettings(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
    console.log("Toggled integration:", integrationId, "to", !integrationSettings[integrationId]);
  };

  const styles = {
    container: {
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "24px",
      fontFamily: "'Inter', sans-serif"
    },
    header: {
      background: "white",
      padding: "24px",
      borderRadius: "12px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    mainTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#1e293b",
      margin: "0 0 8px 0",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    subtitle: {
      fontSize: "14px",
      color: "#64748b",
      margin: "0"
    },
    headerActions: {
      display: "flex",
      gap: "12px",
      alignItems: "center"
    },
    searchBox: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      width: "200px"
    },
    navTabs: {
      display: "flex",
      gap: "4px",
      background: "#f1f5f9",
      padding: "4px",
      borderRadius: "8px",
      marginBottom: "24px"
    },
    navTab: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: "6px",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      color: "#64748b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s"
    },
    activeNavTab: {
      background: "white",
      color: "#3b82f6",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    },
    sectionCard: {
      background: "white",
      padding: "24px",
      borderRadius: "12px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1e293b",
      margin: "0 0 20px 0",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },
    grid2Col: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px",
      marginBottom: "24px"
    },
    grid3Col: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
      marginBottom: "24px"
    },
    formGroup: {
      marginBottom: "16px"
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "6px"
    },
    select: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      background: "white",
      cursor: "pointer"
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      fontSize: "14px"
    },
    checkboxGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginTop: "8px"
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      cursor: "pointer"
    },
    button: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      background: "white",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s",
      minHeight: "40px"
    },
    primaryButton: {
      background: "#3b82f6",
      color: "white",
      borderColor: "#3b82f6"
    },
    secondaryButton: {
      background: "#eff6ff",
      color: "#3b82f6",
      borderColor: "#3b82f6"
    },
    outlineButton: {
      background: "white",
      color: "#3b82f6",
      borderColor: "#3b82f6"
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "500",
      background: "#f1f5f9",
      color: "#64748b",
      marginRight: "8px",
      marginBottom: "8px"
    },
    ruleCard: {
      background: "#f8fafc",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "12px",
      border: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    stageCard: {
      background: "#f0f9ff",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "12px",
      borderLeft: "4px solid #3b82f6"
    },
    escalationCard: {
      background: "#fef3c7",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "12px",
      borderLeft: "4px solid #f59e0b"
    },
    integrationCard: {
      background: "#f0f9ff",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "12px",
      border: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    actionButtons: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
      justifyContent: "flex-end",
      flexWrap: "wrap"
    },
    buttonGroup: {
      display: "flex",
      gap: "8px",
      marginTop: "8px"
    },
    smallButton: {
      padding: "6px 12px",
      fontSize: "12px"
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500"
    },
    activeBadge: {
      background: "#d1fae5",
      color: "#065f46"
    },
    inactiveBadge: {
      background: "#f3f4f6",
      color: "#6b7280"
    },
    exportMenu: {
      position: "absolute",
      top: "100%",
      right: 0,
      background: "white",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      zIndex: 100,
      marginTop: "8px",
      minWidth: "180px",
      overflow: "hidden"
    },
    exportMenuItem: {
      padding: "12px 16px",
      border: "none",
      background: "transparent",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      transition: "all 0.2s",
      "&:hover": {
        background: "#f8fafc"
      }
    }
  };

  const renderWorkflowConfig = () => (
    <>
      <div style={styles.sectionCard}>
        <h4 style={styles.sectionTitle}><Settings size={20} />Workflow Configuration</h4>
        
        <div style={styles.grid2Col}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Workflow Type</label>
            <select 
              style={styles.select} 
              value={workflowType}
              onChange={(e) => setWorkflowType(e.target.value)}
            >
              <option value="linear">Linear Approval (Sequential)</option>
              <option value="parallel">Parallel Approval (Simultaneous)</option>
              <option value="conditional">Conditional Routing</option>
              <option value="hybrid">Hybrid Workflow</option>
            </select>
            <small style={{ color: "#64748b", fontSize: "12px", display: "block", marginTop: "4px" }}>
              {workflowType === "linear" && "Approvers review sequentially in order"}
              {workflowType === "parallel" && "All approvers review simultaneously"}
              {workflowType === "conditional" && "Route based on form field values"}
              {workflowType === "hybrid" && "Mix of sequential and parallel stages"}
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Default Timeout</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input 
                type="number" 
                style={styles.input} 
                placeholder="Hours" 
                defaultValue="24" 
              />
              <select style={styles.select}>
                <option>Hours</option>
                <option>Days</option>
                <option>Business Days</option>
              </select>
            </div>
          </div>
        </div>

        {workflowType === "conditional" && (
          <div style={{ marginTop: "24px", padding: "16px", background: "#f0f9ff", borderRadius: "8px", border: "1px solid #bae6fd" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h5 style={{ ...styles.label, fontSize: "16px", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <GitBranch size={16} /> Conditional Routing Rules
              </h5>
              <button 
                style={{ ...styles.button, ...styles.primaryButton, ...styles.smallButton }}
                onClick={handleAddConditionalRule}
              >
                <Plus size={14} /> Add Rule
              </button>
            </div>
            
            {conditionalRules.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                No conditional rules configured. Add rules to route requests based on form field values.
              </p>
            ) : (
              conditionalRules.map(rule => (
                <div key={rule.id} style={{ ...styles.ruleCard, marginBottom: "12px", background: "white" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 2fr", gap: "12px", alignItems: "center" }}>
                      <select 
                        style={styles.select}
                        value={rule.field}
                        onChange={(e) => {
                          const updatedRules = conditionalRules.map(r => 
                            r.id === rule.id ? { ...r, field: e.target.value } : r
                          );
                          setConditionalRules(updatedRules);
                        }}
                      >
                        <option value="">Select Field</option>
                        <option value="amount">Amount</option>
                        <option value="department">Department</option>
                        <option value="request_type">Request Type</option>
                        <option value="priority">Priority</option>
                      </select>
                      <select 
                        style={styles.select}
                        value={rule.operator}
                        onChange={(e) => {
                          const updatedRules = conditionalRules.map(r => 
                            r.id === rule.id ? { ...r, operator: e.target.value } : r
                          );
                          setConditionalRules(updatedRules);
                        }}
                      >
                        <option value="equals">equals</option>
                        <option value="not equals">not equals</option>
                        <option value=">">greater than</option>
                        <option value="<">less than</option>
                        <option value=">=">greater than or equal</option>
                        <option value="<=">less than or equal</option>
                        <option value="contains">contains</option>
                      </select>
                      <input 
                        type="text"
                        style={styles.input}
                        placeholder="Value"
                        value={rule.value}
                        onChange={(e) => {
                          const updatedRules = conditionalRules.map(r => 
                            r.id === rule.id ? { ...r, value: e.target.value } : r
                          );
                          setConditionalRules(updatedRules);
                        }}
                      />
                      <select 
                        style={styles.select}
                        value={rule.routeTo}
                        onChange={(e) => {
                          const updatedRules = conditionalRules.map(r => 
                            r.id === rule.id ? { ...r, routeTo: e.target.value } : r
                          );
                          setConditionalRules(updatedRules);
                        }}
                      >
                        {approvalLevels.map(level => (
                          <option key={level.id} value={level.id}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button 
                    style={{ ...styles.button, ...styles.secondaryButton, ...styles.smallButton, marginLeft: "12px" }}
                    onClick={() => handleDeleteConditionalRule(rule.id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        <div style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h5 style={{ ...styles.label, fontSize: "16px", margin: 0 }}>Workflow Stages</h5>
            <div style={styles.buttonGroup}>
              <button 
                style={{ ...styles.button, ...styles.primaryButton, ...styles.smallButton }}
                onClick={handleAddStage}
              >
                <Plus size={14} /> Add Stage
              </button>
              <button 
                style={{ ...styles.button, ...styles.secondaryButton, ...styles.smallButton }}
                onClick={handleCloneWorkflow}
              >
                <Copy size={14} /> Clone
              </button>
            </div>
          </div>
          
          {workflowStages.map((stage, index) => (
            <div key={stage.id} style={styles.stageCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <h6 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>
                    Stage {index + 1}: {approvalLevels.find(l => l.id === stage.level)?.label}
                  </h6>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "#64748b" }}>
                    <span>Timeout: {stage.timeout} hours</span>
                    <span>Approvers: {stage.approvers?.length || 0}</span>
                    <span style={{ 
                      ...styles.statusBadge, 
                      ...(stage.isEnabled ? styles.activeBadge : styles.inactiveBadge)
                    }}>
                      {stage.isEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                <div style={styles.buttonGroup}>
                  <button 
                    style={{ ...styles.button, ...styles.outlineButton, ...styles.smallButton }}
                    onClick={() => handleEditStage(stage.id)}
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button 
                    style={{ ...styles.button, ...styles.secondaryButton, ...styles.smallButton }}
                    onClick={() => handleDeleteStage(stage.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage Configuration Modal */}
      {showStageModal && editingStage && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            maxWidth: "700px",
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h4 style={{ margin: 0 }}>Configure Stage</h4>
              <button 
                style={{ ...styles.button, ...styles.secondaryButton, ...styles.smallButton }}
                onClick={() => {
                  setShowStageModal(false);
                  setEditingStage(null);
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Approval Level</label>
              <select 
                style={styles.select}
                value={editingStage.level}
                onChange={(e) => setEditingStage({ ...editingStage, level: e.target.value })}
              >
                {approvalLevels.map(level => (
                  <option key={level.id} value={level.id}>{level.label}</option>
                ))}
              </select>
            </div>

            <div style={styles.grid2Col}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Timeout (hours)</label>
                <input 
                  type="number"
                  style={styles.input}
                  value={editingStage.timeout}
                  onChange={(e) => setEditingStage({ ...editingStage, timeout: parseInt(e.target.value) || 24 })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select 
                  style={styles.select}
                  value={editingStage.isEnabled ? "enabled" : "disabled"}
                  onChange={(e) => setEditingStage({ ...editingStage, isEnabled: e.target.value === "enabled" })}
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Approvers</label>
              <div style={{ padding: "12px", background: "#f8fafc", borderRadius: "6px", marginTop: "8px" }}>
                <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#64748b" }}>
                  Approvers will be assigned based on the approval level selected. 
                  You can add specific approvers or use role-based assignment.
                </p>
                <button style={{ ...styles.button, ...styles.secondaryButton, ...styles.smallButton }}>
                  <UserPlus size={14} /> Add Approver
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "flex-end" }}>
              <button 
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => {
                  setShowStageModal(false);
                  setEditingStage(null);
                }}
              >
                Cancel
              </button>
              <button 
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={handleSaveStage}
              >
                <Save size={16} /> Save Stage
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderAutoApprovalRules = () => (
    <div style={styles.sectionCard}>
      <h4 style={styles.sectionTitle}><Zap size={20} />Auto-Approval Rules</h4>
      <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 24px 0" }}>
        Configure rules to automatically approve or reject requests based on amount, type, frequency, or other field values.
      </p>

      <div style={{ marginBottom: "24px", padding: "16px", background: "#fef3c7", borderRadius: "8px", border: "1px solid #fcd34d" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h5 style={{ ...styles.label, fontSize: "16px", margin: 0 }}>Create New Rule</h5>
        </div>
        <div style={styles.grid2Col}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Condition Field</label>
            <select 
              style={styles.select}
              value={newAutoRule.condition}
              onChange={(e) => handleUpdateNewAutoRule("condition", e.target.value)}
            >
              <option value="">Select field</option>
              {conditions.map(cond => (
                <option key={cond.id} value={cond.id}>{cond.label}</option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Operator</label>
            <select 
              style={styles.select}
              value={newAutoRule.operator}
              onChange={(e) => handleUpdateNewAutoRule("operator", e.target.value)}
            >
              <option value="<=">Less than or equal (≤)</option>
              <option value=">=">Greater than or equal (≥)</option>
              <option value="=">Equals (=)</option>
              <option value="<">Less than (&lt;)</option>
              <option value=">">Greater than (&gt;)</option>
              <option value="≠">Not equals (≠)</option>
              <option value="contains">Contains</option>
              <option value="equals">Equals</option>
            </select>
          </div>
        </div>
        <div style={styles.grid2Col}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Value</label>
            <input 
              type="text" 
              style={styles.input} 
              placeholder="Enter condition value"
              value={newAutoRule.value}
              onChange={(e) => handleUpdateNewAutoRule("value", e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Action</label>
            <select 
              style={styles.select}
              value={newAutoRule.action}
              onChange={(e) => handleUpdateNewAutoRule("action", e.target.value)}
            >
              <option value="auto-approve">Auto-approve</option>
              <option value="auto-reject">Auto-reject</option>
              <option value="route">Route to specific approver</option>
              <option value="skip">Skip certain levels</option>
            </select>
          </div>
        </div>
        <button 
          style={{ ...styles.button, ...styles.primaryButton, marginTop: "8px" }}
          onClick={handleAddAutoApprovalRule}
        >
          <Plus size={16} /> Add Rule
        </button>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h5 style={{ ...styles.label, fontSize: "16px", marginBottom: "16px" }}>Active Auto-Approval Rules</h5>
        {autoApprovalRules.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "14px", padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
            No auto-approval rules configured. Create rules above to enable automatic processing.
          </p>
        ) : (
          autoApprovalRules.map(rule => (
            <div key={rule.id} style={styles.ruleCard}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <strong style={{ fontSize: "14px" }}>Rule #{rule.id}:</strong>
                  <span style={{
                    ...styles.statusBadge,
                    background: rule.action === "auto-approve" ? "#d1fae5" : "#fee2e2",
                    color: rule.action === "auto-approve" ? "#065f46" : "#991b1b"
                  }}>
                    {rule.action === "auto-approve" ? "Auto-Approve" : 
                     rule.action === "auto-reject" ? "Auto-Reject" : 
                     rule.action === "route" ? "Route" : "Skip"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  {conditions.find(c => c.id === rule.condition)?.label || rule.condition} {rule.operator} {rule.value || "[Not set]"}
                </div>
              </div>
              <button 
                style={{ ...styles.button, ...styles.secondaryButton, ...styles.smallButton }}
                onClick={() => handleDeleteAutoApprovalRule(rule.id)}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderEscalationRules = () => (
    <div style={styles.sectionCard}>
      <h4 style={styles.sectionTitle}><Clock size={20} />Escalation & Delegation Rules</h4>
      
      <div style={styles.grid2Col}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Default Escalation Time</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="number" style={styles.input} defaultValue="48" />
            <select style={styles.select}>
              <option>Hours</option>
              <option>Days</option>
              <option>Business Days</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Default Action on Timeout</label>
          <select style={styles.select}>
            <option>Escalate to next level</option>
            <option>Auto-approve</option>
            <option>Auto-reject</option>
            <option>Send reminder and wait</option>
            <option>Assign to admin for manual handling</option>
          </select>
        </div>
      </div>

      <div style={styles.grid2Col}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Out-of-Office Handling</label>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" defaultChecked />
              <span>Auto-assign to backup approver</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" defaultChecked />
              <span>Send email notification to primary approver</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" defaultChecked />
              <span>Create calendar reminder for follow-up</span>
            </label>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Delegation Rules</label>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={delegationSettings.allowDelegation}
                onChange={(e) => setDelegationSettings({...delegationSettings, allowDelegation: e.target.checked})}
              />
              <span>Allow approvers to delegate</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={delegationSettings.requireManagerApproval}
                onChange={(e) => setDelegationSettings({...delegationSettings, requireManagerApproval: e.target.checked})}
              />
              <span>Require manager approval for delegation</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={delegationSettings.limitDelegationDuration}
                onChange={(e) => setDelegationSettings({...delegationSettings, limitDelegationDuration: e.target.checked})}
              />
              <span>Limit delegation duration</span>
            </label>
          </div>
          {delegationSettings.limitDelegationDuration && (
            <div style={{ marginTop: "12px" }}>
              <label style={styles.label}>Maximum Delegation Duration (days)</label>
              <input 
                type="number"
                style={styles.input}
                value={delegationSettings.maxDelegationDays}
                onChange={(e) => setDelegationSettings({...delegationSettings, maxDelegationDays: parseInt(e.target.value) || 30})}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h5 style={{ ...styles.label, fontSize: "16px", margin: 0 }}>Escalation Rules</h5>
          <button 
            style={{ ...styles.button, ...styles.primaryButton, ...styles.smallButton }}
            onClick={handleAddEscalationRule}
          >
            <Plus size={14} /> Add Rule
          </button>
        </div>
        
        {escalationRules.map(rule => (
          <div key={rule.id} style={styles.escalationCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h6 style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>
                    {rule.name}
                  </h6>
                  <span style={{ 
                    ...styles.statusBadge, 
                    ...(rule.isEnabled ? styles.activeBadge : styles.inactiveBadge)
                  }}>
                    {rule.isEnabled ? "Active" : "Inactive"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                  <div><strong>Trigger:</strong> {rule.trigger === "timeout" ? `${rule.timeout} ${rule.unit} timeout` : "Out of Office"}</div>
                  <div><strong>Action:</strong> {rule.action === "escalate" ? "Escalate to" : "Delegate to"} {escalationTargets.find(t => t.id === rule.target)?.label}</div>
                  <div><strong>Notify Original Approver:</strong> {rule.notifyOriginal ? "Yes" : "No"}</div>
                </div>
              </div>
              <div style={styles.buttonGroup}>
                <button 
                  style={{ ...styles.button, ...styles.outlineButton, ...styles.smallButton }}
                  onClick={() => handleToggleEscalationRule(rule.id)}
                >
                  {rule.isEnabled ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button 
                  style={{ ...styles.button, ...styles.secondaryButton, ...styles.smallButton }}
                  onClick={() => handleDeleteEscalationRule(rule.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkflowActions = () => (
    <div style={styles.sectionCard}>
      <h4 style={styles.sectionTitle}><Send size={20} />Workflow Actions</h4>
      
      <div style={styles.grid3Col}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Approval Actions</label>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={workflowActions.requireApprovalComments}
                onChange={(e) => setWorkflowActions({...workflowActions, requireApprovalComments: e.target.checked})}
              />
              <span>Require comments on approval</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={workflowActions.requireRejectionReasons}
                onChange={(e) => setWorkflowActions({...workflowActions, requireRejectionReasons: e.target.checked})}
              />
              <span>Require reasons on rejection (mandatory)</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={workflowActions.allowSendBack}
                onChange={(e) => setWorkflowActions({...workflowActions, allowSendBack: e.target.checked})}
              />
              <span>Allow send back for modification</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={workflowActions.allowRequestInfo}
                onChange={(e) => setWorkflowActions({...workflowActions, allowRequestInfo: e.target.checked})}
              />
              <span>Request additional information</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={workflowActions.allowConditionalApproval}
                onChange={(e) => setWorkflowActions({...workflowActions, allowConditionalApproval: e.target.checked})}
              />
              <span>Conditional approval (with modifications)</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={workflowActions.enableBulkApproval}
                onChange={(e) => setWorkflowActions({...workflowActions, enableBulkApproval: e.target.checked})}
              />
              <span>Enable bulk approval capability</span>
            </label>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Notifications</label>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={notifications.email}
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
              />
              <span>Email notifications</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={notifications.sms}
                onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
              />
              <span>SMS notifications</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={notifications.push}
                onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
              />
              <span>Push notifications</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={notifications.slack}
                onChange={(e) => setNotifications({...notifications, slack: e.target.checked})}
              />
              <span>Slack/Teams notifications</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={notifications.whatsapp}
                onChange={(e) => setNotifications({...notifications, whatsapp: e.target.checked})}
              />
              <span>WhatsApp notifications</span>
            </label>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Audit & History</label>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={auditSettings.logActions}
                onChange={(e) => setAuditSettings({...auditSettings, logActions: e.target.checked})}
              />
              <span>Log all approval actions</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={auditSettings.trackModifications}
                onChange={(e) => setAuditSettings({...auditSettings, trackModifications: e.target.checked})}
              />
              <span>Track modification history</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={auditSettings.recordIP}
                onChange={(e) => setAuditSettings({...auditSettings, recordIP: e.target.checked})}
              />
              <span>Record IP addresses</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={auditSettings.archive}
                onChange={(e) => setAuditSettings({...auditSettings, archive: e.target.checked})}
              />
              <span>Archive completed workflows</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                defaultChecked
              />
              <span>Approval history and audit trail</span>
            </label>
          </div>
          {auditSettings.archive && (
            <div style={{ marginTop: "12px" }}>
              <label style={styles.label}>Retention Period (days)</label>
              <input 
                type="number"
                style={styles.input}
                value={auditSettings.retentionPeriod}
                onChange={(e) => setAuditSettings({...auditSettings, retentionPeriod: parseInt(e.target.value) || 365})}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button 
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={handleTestNotifications}
        >
          <Bell size={16} /> Test Notifications
        </button>
        <button 
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={handleViewAuditLog}
        >
          <History size={16} /> View Audit Log
        </button>
        <button 
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={handleSendTestEmail}
        >
          <Mail size={16} /> Send Test Email
        </button>
      </div>
    </div>
  );

  const renderIntegrationActions = () => (
    <div style={styles.sectionCard}>
      <h4 style={styles.sectionTitle}><Layers size={20} />Integration Actions</h4>
      
      <div style={{ marginBottom: "24px" }}>
        <h5 style={{ ...styles.label, fontSize: "16px", marginBottom: "16px" }}>System Integrations</h5>
        
        {integrationTypes.map(integration => {
          const Icon = integration.icon;
          const integrationKey = integration.id === "employee-master" ? "updateEmployeeMaster" :
                                integration.id === "payroll" ? "triggerPayroll" :
                                integration.id === "documents" ? "generateDocuments" :
                                integration.id === "calendar" ? "createCalendarEvents" :
                                integration.id === "attendance" ? "updateAttendance" :
                                integration.id === "tasks" ? "createTasks" :
                                integration.id === "audit" ? "logAuditTrail" :
                                integration.id === "notifications" ? "notifyStakeholders" :
                                integration.id === "crm" ? "syncWithCRM" : "updateProjectManagement";
          
          const isEnabled = integrationSettings[integrationKey];
          
          return (
            <div key={integration.id} style={styles.integrationCard}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "8px", 
                  background: isEnabled ? "#dbeafe" : "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Icon size={20} color={isEnabled ? "#3b82f6" : "#6b7280"} />
                </div>
                <div>
                  <div style={{ fontWeight: "500", color: "#1f2937" }}>{integration.label}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {integration.id === "employee-master" ? "Auto-update employee records on approval" :
                     integration.id === "payroll" ? "Trigger payroll changes automatically" :
                     integration.id === "documents" ? "Generate approval letters and contracts" :
                     integration.id === "calendar" ? "Create calendar events for approvals" :
                     integration.id === "attendance" ? "Update attendance and leave systems" :
                     integration.id === "tasks" ? "Create follow-up tasks for departments" :
                     integration.id === "audit" ? "Log activities in system audit trail" :
                     integration.id === "notifications" ? "Send email notifications to stakeholders" :
                     integration.id === "crm" ? "Sync approval status with CRM systems" :
                     "Update project management tools"}
                  </div>
                </div>
              </div>
              <button 
                style={{ 
                  ...styles.button, 
                  ...styles.smallButton,
                  background: isEnabled ? "#3b82f6" : "#f3f4f6",
                  color: isEnabled ? "white" : "#6b7280",
                  borderColor: isEnabled ? "#3b82f6" : "#d1d5db"
                }}
                onClick={() => handleToggleIntegration(integrationKey)}
              >
                {isEnabled ? <CheckSquare size={14} /> : <X size={14} />}
              </button>
            </div>
          );
        })}
      </div>

      <div style={styles.grid2Col}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Integration Mode</label>
          <select style={styles.select}>
            <option>Real-time sync</option>
            <option>Batch processing</option>
            <option>Manual trigger</option>
            <option>Scheduled sync</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Error Handling</label>
          <select style={styles.select}>
            <option>Retry failed integrations</option>
            <option>Send error alerts</option>
            <option>Queue for manual processing</option>
            <option>Skip and continue</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h5 style={{ ...styles.label, fontSize: "16px", marginBottom: "16px" }}>Integration Test</h5>
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => alert("Testing all integrations...")}
          >
            <RefreshCw size={16} /> Test All Integrations
          </button>
          <button 
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => alert("Viewing integration logs...")}
          >
            <FileTextIcon size={16} /> View Integration Logs
          </button>
        </div>
      </div>
    </div>
  );

  const sections = [
    { id: "config", label: "Configuration", icon: Settings },
    { id: "auto-approval", label: "Auto-Approval", icon: Zap },
    { id: "escalation", label: "Escalation", icon: Clock },
    { id: "actions", label: "Actions", icon: Send },
    { id: "integration", label: "Integration", icon: Layers }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h4 style={styles.mainTitle}>
            <Settings size={24} />
            Approval Workflow Configuration
          </h4>
          <p style={styles.subtitle}>
            Configure approval workflows, escalation rules, and integration actions
          </p>
        </div>
        
        <div style={styles.headerActions}>
          <input
            type="text"
            style={styles.searchBox}
            placeholder="Search approvers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleSearchApprovers}
          >
            <Search size={16} />
          </button>
          <button 
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleAddApprover}
          >
            <UserPlus size={16} /> Add Approver
          </button>
        </div>
      </div>

      <div style={styles.navTabs}>
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              style={{
                ...styles.navTab,
                ...(activeSection === section.id ? styles.activeNavTab : {})
              }}
              onClick={() => setActiveSection(section.id)}
            >
              <Icon size={16} />
              {section.label}
            </button>
          );
        })}
      </div>

      {activeSection === "config" && renderWorkflowConfig()}
      {activeSection === "auto-approval" && renderAutoApprovalRules()}
      {activeSection === "escalation" && renderEscalationRules()}
      {activeSection === "actions" && renderWorkflowActions()}
      {activeSection === "integration" && renderIntegrationActions()}

      <div style={styles.actionButtons}>
        <div style={{ display: "flex", gap: "12px", flex: 1 }}>
          <button 
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleValidateConfiguration}
          >
            <Shield size={16} /> Validate
          </button>
          <button 
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleImportConfiguration}
          >
            <Upload size={16} /> Import
          </button>
          
          {/* Export Button with Menu */}
          <div style={{ position: "relative" }}>
            <button 
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={16} /> Export
            </button>
            
            {showExportMenu && (
              <div style={styles.exportMenu}>
                <button 
                  style={styles.exportMenuItem}
                  onClick={handleExportConfiguration}
                  disabled={isSaving}
                >
                  <FileTextIcon size={16} /> Export as PDF
                </button>
                <button 
                  style={styles.exportMenuItem}
                  onClick={handleExportJSON}
                >
                  <Database size={16} /> Export as JSON
                </button>
              </div>
            )}
          </div>
          
          <button 
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleResetToDefaults}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
        
        <div style={{ display: "flex", gap: "12px" }}>
          <button 
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handlePreviewWorkflow}
          >
            <Eye size={16} /> {showPreview ? "Hide Preview" : "Preview Workflow"}
          </button>
          <button 
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleSaveAsTemplate}
          >
            <Copy size={16} /> Save as Template
          </button>
          {workflowStages.some(s => s.isEnabled) ? (
            <button 
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handleDisableWorkflow}
            >
              <Lock size={16} /> Disable Workflow
            </button>
          ) : (
            <button 
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handleEnableWorkflow}
            >
              <Unlock size={16} /> Enable Workflow
            </button>
          )}
          <button 
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleSaveConfiguration}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw size={16} className="spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Save Configuration
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            maxWidth: "800px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h4 style={{ margin: 0 }}>Workflow Preview</h4>
              <button style={{ ...styles.button, ...styles.secondaryButton }} onClick={() => setShowPreview(false)}>✕ Close</button>
            </div>
            <pre style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", overflow: "auto" }}>
              {JSON.stringify({
                workflowType,
                workflowStages,
                autoApprovalRules,
                escalationRules,
                conditionalRules,
                workflowActions,
                delegationSettings,
                notifications,
                auditSettings,
                integrationSettings
              }, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowEngine;