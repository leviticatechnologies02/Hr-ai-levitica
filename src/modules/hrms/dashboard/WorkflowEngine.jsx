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
import StatCard from "../../../shared/components/StatCard";
import WorkflowStageModal from "../modal/WorkflowStageModal";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const WorkflowEngine = () => {
  const [activeSection, setActiveSection] = useState("config");
  const [workflowType, setWorkflowType] = useState("linear");
  const [selectedApprovers, setSelectedApprovers] = useState([]);

  const [newAutoRule, setNewAutoRule] = useState({
    condition: "amount",
    operator: "<=",
    value: "",
    action: "auto-approve"
  });
  const [autoApprovalRules, setAutoApprovalRules] = useState([]);

  const [escalationRules, setEscalationRules] = useState([]);

  const [workflowStages, setWorkflowStages] = useState([]);
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

  const [showExportMenu, setShowExportMenu] = useState(false);

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

  const handleUpdateNewAutoRule = (field, value) => {
    setNewAutoRule({
      ...newAutoRule,
      [field]: value
    });
  };

  const handleAddAutoApprovalRule = () => {
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
      const element = document.createElement('div');
      element.style.width = '210mm';
      element.style.padding = '20mm';
      element.style.background = 'white';
      element.style.boxSizing = 'border-box';
      element.innerHTML = generatePDFContent(config);
      document.body.appendChild(element);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(element);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;

      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);

      let heightLeft = imgHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `workflow-configuration-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      console.log("Exported configuration as PDF:", config);
      alert(`Configuration exported as ${fileName}`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again or export as JSON instead.');

      const dataStr = JSON.stringify(config, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
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
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
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
      setWorkflowStages([]);
      setAutoApprovalRules([]);
      setEscalationRules([]);
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



  const renderWorkflowConfig = () => (
    <>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Settings size={20} />Workflow Configuration</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Workflow Type</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Default Timeout</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Hours"
                defaultValue="24"
              />
              <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none">
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
              <h5 className="flex items-center gap-2 text-base font-semibold text-slate-800 m-0">
                <GitBranch size={16} /> Conditional Routing Rules
              </h5>
              <button
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white transition hover:bg-blue-700"
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
                <div key={rule.id} className="p-4 rounded-xl border border-slate-200 bg-white mb-3">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 2fr", gap: "12px", alignItems: "center" }}>
                      <select
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 ml-3"
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
            <h5 className="text-base font-semibold text-slate-800 m-0">Workflow Stages</h5>
            <div className="flex gap-2 mt-2">
              <button
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white transition hover:bg-blue-700"
                onClick={handleAddStage}
              >
                <Plus size={14} /> Add Stage
              </button>
              <button
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={handleCloneWorkflow}
              >
                <Copy size={14} /> Clone
              </button>
            </div>
          </div>

          {workflowStages.map((stage, index) => (
            <div key={stage.id} className="bg-blue-50/50 p-4 rounded-xl mb-3 border border-blue-100">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <h6 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>
                    Stage {index + 1}: {approvalLevels.find(l => l.id === stage.level)?.label}
                  </h6>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px", color: "#64748b" }}>
                    <span>Timeout: {stage.timeout} hours</span>
                    <span>Approvers: {stage.approvers?.length || 0}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${stage.isEnabled ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {stage.isEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-blue-600 transition hover:bg-slate-50"
                    onClick={() => handleEditStage(stage.id)}
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
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

      <WorkflowStageModal
        isOpen={showStageModal}
        onClose={() => {
          setShowStageModal(false);
          setEditingStage(null);
        }}
        editingStage={editingStage}
        setEditingStage={setEditingStage}
        approvalLevels={approvalLevels}
        onSave={handleSaveStage}
      />
    </>
  );

  const renderAutoApprovalRules = () => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
      <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Zap size={20} />Auto-Approval Rules</h4>
      <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 24px 0" }}>
        Configure rules to automatically approve or reject requests based on amount, type, frequency, or other field values.
      </p>

      <div style={{ marginBottom: "24px", padding: "16px", background: "#fef3c7", borderRadius: "8px", border: "1px solid #fcd34d" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h5 className="text-base font-semibold text-slate-800 m-0">Create New Rule</h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Condition Field</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newAutoRule.condition}
              onChange={(e) => handleUpdateNewAutoRule("condition", e.target.value)}
            >
              <option value="">Select field</option>
              {conditions.map(cond => (
                <option key={cond.id} value={cond.id}>{cond.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Operator</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Value</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter condition value"
              value={newAutoRule.value}
              onChange={(e) => handleUpdateNewAutoRule("value", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Action</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 mt-2"
          onClick={handleAddAutoApprovalRule}
        >
          <Plus size={16} /> Add Rule
        </button>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h5 className="text-base font-semibold text-slate-800 m-0 mb-4">Active Auto-Approval Rules</h5>
        {autoApprovalRules.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "14px", padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
            No auto-approval rules configured. Create rules above to enable automatic processing.
          </p>
        ) : (
          autoApprovalRules.map(rule => (
            <div key={rule.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-3">
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <strong style={{ fontSize: "14px" }}>Rule #{rule.id}:</strong>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${rule.action === "auto-approve" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
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
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
      <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Clock size={20} />Escalation & Delegation Rules</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Default Escalation Time</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="number" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue="48" />
            <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>Hours</option>
              <option>Days</option>
              <option>Business Days</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Default Action on Timeout</label>
          <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option>Escalate to next level</option>
            <option>Auto-approve</option>
            <option>Auto-reject</option>
            <option>Send reminder and wait</option>
            <option>Assign to admin for manual handling</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Out-of-Office Handling</label>
          <div className="flex flex-col gap-2.5 mt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input type="checkbox" defaultChecked />
              <span>Auto-assign to backup approver</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input type="checkbox" defaultChecked />
              <span>Send email notification to primary approver</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input type="checkbox" defaultChecked />
              <span>Create calendar reminder for follow-up</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Delegation Rules</label>
          <div className="flex flex-col gap-2.5 mt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={delegationSettings.allowDelegation}
                onChange={(e) => setDelegationSettings({ ...delegationSettings, allowDelegation: e.target.checked })}
              />
              <span>Allow approvers to delegate</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={delegationSettings.requireManagerApproval}
                onChange={(e) => setDelegationSettings({ ...delegationSettings, requireManagerApproval: e.target.checked })}
              />
              <span>Require manager approval for delegation</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={delegationSettings.limitDelegationDuration}
                onChange={(e) => setDelegationSettings({ ...delegationSettings, limitDelegationDuration: e.target.checked })}
              />
              <span>Limit delegation duration</span>
            </label>
          </div>
          {delegationSettings.limitDelegationDuration && (
            <div style={{ marginTop: "12px" }}>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Maximum Delegation Duration (days)</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={delegationSettings.maxDelegationDays}
                onChange={(e) => setDelegationSettings({ ...delegationSettings, maxDelegationDays: parseInt(e.target.value) || 30 })}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h5 className="text-base font-semibold text-slate-800 m-0">Escalation Rules</h5>
          <button
            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white transition hover:bg-blue-700"
            onClick={handleAddEscalationRule}
          >
            <Plus size={14} /> Add Rule
          </button>
        </div>

        {escalationRules.map(rule => (
          <div key={rule.id} className="bg-amber-50/50 p-4 rounded-xl mb-3 border border-amber-100">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h6 style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>
                    {rule.name}
                  </h6>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${rule.isEnabled ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                    {rule.isEnabled ? "Active" : "Inactive"}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>
                  <div><strong>Trigger:</strong> {rule.trigger === "timeout" ? `${rule.timeout} ${rule.unit} timeout` : "Out of Office"}</div>
                  <div><strong>Action:</strong> {rule.action === "escalate" ? "Escalate to" : "Delegate to"} {escalationTargets.find(t => t.id === rule.target)?.label}</div>
                  <div><strong>Notify Original Approver:</strong> {rule.notifyOriginal ? "Yes" : "No"}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-blue-600 transition hover:bg-slate-50"
                  onClick={() => handleToggleEscalationRule(rule.id)}
                >
                  {rule.isEnabled ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
      <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Send size={20} />Workflow Actions</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Approval Actions</label>
          <div className="flex flex-col gap-2.5 mt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={workflowActions.requireApprovalComments}
                onChange={(e) => setWorkflowActions({ ...workflowActions, requireApprovalComments: e.target.checked })}
              />
              <span>Require comments on approval</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={workflowActions.requireRejectionReasons}
                onChange={(e) => setWorkflowActions({ ...workflowActions, requireRejectionReasons: e.target.checked })}
              />
              <span>Require reasons on rejection (mandatory)</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={workflowActions.allowSendBack}
                onChange={(e) => setWorkflowActions({ ...workflowActions, allowSendBack: e.target.checked })}
              />
              <span>Allow send back for modification</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={workflowActions.allowRequestInfo}
                onChange={(e) => setWorkflowActions({ ...workflowActions, allowRequestInfo: e.target.checked })}
              />
              <span>Request additional information</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={workflowActions.allowConditionalApproval}
                onChange={(e) => setWorkflowActions({ ...workflowActions, allowConditionalApproval: e.target.checked })}
              />
              <span>Conditional approval (with modifications)</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={workflowActions.enableBulkApproval}
                onChange={(e) => setWorkflowActions({ ...workflowActions, enableBulkApproval: e.target.checked })}
              />
              <span>Enable bulk approval capability</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notifications</label>
          <div className="flex flex-col gap-2.5 mt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              />
              <span>Email notifications</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
              />
              <span>SMS notifications</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
              />
              <span>Push notifications</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={notifications.slack}
                onChange={(e) => setNotifications({ ...notifications, slack: e.target.checked })}
              />
              <span>Slack/Teams notifications</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={notifications.whatsapp}
                onChange={(e) => setNotifications({ ...notifications, whatsapp: e.target.checked })}
              />
              <span>WhatsApp notifications</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Audit & History</label>
          <div className="flex flex-col gap-2.5 mt-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={auditSettings.logActions}
                onChange={(e) => setAuditSettings({ ...auditSettings, logActions: e.target.checked })}
              />
              <span>Log all approval actions</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={auditSettings.trackModifications}
                onChange={(e) => setAuditSettings({ ...auditSettings, trackModifications: e.target.checked })}
              />
              <span>Track modification history</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={auditSettings.recordIP}
                onChange={(e) => setAuditSettings({ ...auditSettings, recordIP: e.target.checked })}
              />
              <span>Record IP addresses</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={auditSettings.archive}
                onChange={(e) => setAuditSettings({ ...auditSettings, archive: e.target.checked })}
              />
              <span>Archive completed workflows</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
              <input
                type="checkbox"
                defaultChecked
              />
              <span>Approval history and audit trail</span>
            </label>
          </div>
          {auditSettings.archive && (
            <div style={{ marginTop: "12px" }}>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Retention Period (days)</label>
              <input
                type="number"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={auditSettings.retentionPeriod}
                onChange={(e) => setAuditSettings({ ...auditSettings, retentionPeriod: parseInt(e.target.value) || 365 })}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={handleTestNotifications}
        >
          <Bell size={16} /> Test Notifications
        </button>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={handleViewAuditLog}
        >
          <History size={16} /> View Audit Log
        </button>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={handleSendTestEmail}
        >
          <Mail size={16} /> Send Test Email
        </button>
      </div>
    </div>
  );

  const renderIntegrationActions = () => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
      <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Layers size={20} />Integration Actions</h4>

      <div style={{ marginBottom: "24px" }}>
        <h5 className="text-base font-semibold text-slate-800 m-0 mb-4">System Integrations</h5>

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
            <div key={integration.id} className="flex justify-between items-center bg-white p-4 rounded-xl mb-3 border border-slate-200 shadow-sm">
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
                className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${isEnabled ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200"}`}
                onClick={() => handleToggleIntegration(integrationKey)}
              >
                {isEnabled ? <CheckSquare size={14} /> : <X size={14} />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Integration Mode</label>
          <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option>Real-time sync</option>
            <option>Batch processing</option>
            <option>Manual trigger</option>
            <option>Scheduled sync</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Error Handling</label>
          <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option>Retry failed integrations</option>
            <option>Send error alerts</option>
            <option>Queue for manual processing</option>
            <option>Skip and continue</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h5 className="text-base font-semibold text-slate-800 m-0 mb-4">Integration Test</h5>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => alert("Testing all integrations...")}
          >
            <RefreshCw size={16} /> Test All Integrations
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
    <div className="space-y-6 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Approval Workflow Configuration</h1>
          <p className="text-slate-500 text-sm">Configure approval workflows, escalation rules, and integration actions</p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm w-[200px] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search approvers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            onClick={handleSearchApprovers}
          >
            <Search size={16} />
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-transparent bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
            onClick={handleAddApprover}
          >
            <UserPlus size={16} /> Add Approver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Workflow Stages"
          value={workflowStages.length}
          icon="heroicons:rectangle-stack"
          color="blue"
          description="Active workflow stages"
        />
        <StatCard
          title="Auto-Approval"
          value={autoApprovalRules.length}
          icon="heroicons:bolt"
          color="green"
          description="Configured auto-rules"
        />
        <StatCard
          title="Escalations"
          value={escalationRules.length}
          icon="heroicons:clock"
          color="orange"
          description="Active escalation rules"
        />
        <StatCard
          title="Integrations"
          value="2 Active"
          icon="heroicons:puzzle-piece"
          color="purple"
          description="Connected systems"
        />
      </div>

      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto hide-scrollbar">
        {sections.map(section => {
          const SectionIcon = section.icon;
          return (
            <button
              key={section.id}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeSection === section.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              onClick={() => setActiveSection(section.id)}
            >
              <SectionIcon size={18} />
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

      <div className="flex flex-wrap justify-between gap-3 mt-6 pt-6 border-t border-slate-200">
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={handleValidateConfiguration}
          >
            <Shield size={16} /> Validate
          </button>

          <div className="relative">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <Download size={16} /> Export
            </button>

            {showExportMenu && (
              <div className="absolute bottom-full left-0 bg-white border border-slate-200 rounded-xl shadow-lg z-[100] mb-2 min-w-[180px] overflow-hidden">
                <button
                  className="w-full text-left px-4 py-3 flex items-center gap-2 text-sm bg-transparent border-none cursor-pointer hover:bg-slate-50 transition-all text-slate-700"
                  onClick={handleExportConfiguration}
                  disabled={isSaving}
                >
                  <FileTextIcon size={16} /> Export as PDF
                </button>
                <button
                  className="w-full text-left px-4 py-3 flex items-center gap-2 text-sm bg-transparent border-none cursor-pointer hover:bg-slate-50 transition-all text-slate-700"
                  onClick={handleExportJSON}
                >
                  <Download size={16} /> Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={handleResetToDefaults}
          >
            <RotateCcw size={16} /> Reset
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={handleSaveConfiguration}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
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

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col p-6 overflow-y-auto">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h4 style={{ margin: 0 }}>Workflow Preview</h4>
              <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50" onClick={() => setShowPreview(false)}>✕ Close</button>
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