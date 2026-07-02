import React, { useState, useEffect } from "react";
import {
  Plus, Download, BarChart3, Users, Calendar, Send, BookOpen,
  Eye, Edit, Trash2, Copy, Save, Filter, Search, Clock, Mail,
  Bell, Target, PieChart, TrendingUp, MessageSquare, FileText,
  CheckSquare, Hash, Star, List, Grid, Zap, AlertCircle, XCircle,
  ChevronDown, ChevronUp, Upload, RefreshCw, Share2, Lock, Unlock,
  Users as UsersIcon, Building, MapPin, Tag, DownloadCloud, ExternalLink,
  MessageCircle, LineChart, Cloud, FileBarChart, Database, BellRing,
  DoorClosed, Heart, QrCode as QrCodeIcon, X, File, FileSpreadsheet,
  ThumbsUp, ThumbsDown, CheckCircle, MinusCircle, Maximize2, Minimize2
} from "lucide-react";
import StatCard from "../../../shared/components/StatCard";
import Modal from "../../../shared/components/Modal";
import ExportSurveyModal from "../modal/ExportSurveyModal";
import SaveDraftModal from "../modal/SaveDraftModal";
import CreateNewSurveyModal from "../modal/CreateNewSurveyModal";
import AddSurveyQuestionModal from "../modal/AddSurveyQuestionModal";
import EditSurveyQuestionModal from "../modal/EditSurveyQuestionModal";
import LaunchSurveyModal from "../modal/LaunchSurveyModal";
import ScheduleCampaignModal from "../modal/ScheduleCampaignModal";
import SendReminderModal from "../modal/SendReminderModal";
import SurveyQRCodeModal from "../modal/SurveyQRCodeModal";
import AddStrategicObjectiveModal from "../modal/AddStrategicObjectiveModal";

const SurveysPulseChecks = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [surveyVisibility, setSurveyVisibility] = useState("anonymous");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [distributionMethod, setDistributionMethod] = useState("email");
  const [scheduling, setScheduling] = useState("immediate");
  const [surveys, setSurveys] = useState([]);

  const [drafts, setDrafts] = useState([]);
  const [showNewSurveyModal, setShowNewSurveyModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderAudience, setReminderAudience] = useState("nonRespondents");
  const [reminderMessage, setReminderMessage] = useState("");
  const [reminderChannel, setReminderChannel] = useState("email");
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [launchAudience, setLaunchAudience] = useState("all");
  const [launchNotify, setLaunchNotify] = useState(true);
  const [draftSavedAt, setDraftSavedAt] = useState(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftNote, setDraftNote] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [isViewMode, setIsViewMode] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [previewResponses, setPreviewResponses] = useState({});
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [statusModal, setStatusModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "success"
  });

  const [notifications, setNotifications] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    frequency: 2,
    unit: "days"
  });

  const [surveyExpiry, setSurveyExpiry] = useState({
    value: 7,
    unit: "days"
  });

  const [completionMessage, setCompletionMessage] = useState("show thank you message");
  const [surveyLogic, setSurveyLogic] = useState({
    skipLogic: true,
    randomize: false,
    progressBar: true
  });

  const [scheduledSurveys, setScheduledSurveys] = useState([]);
  const [recurringSurveys, setRecurringSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [recurrencePattern, setRecurrencePattern] = useState("monthly");
  const [correlationData, setCorrelationData] = useState(null);
  const [surveyCategory, setSurveyCategory] = useState("");

  const [questionBank, setQuestionBank] = useState([]);

  const [bscQuestionBank, setBscQuestionBank] = useState([]);

  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("rating");
  const [newQuestionCategory, setNewQuestionCategory] = useState("");
  const [newQuestionTags, setNewQuestionTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("used");

  const [bscPerspectives, setBscPerspectives] = useState([
    { id: "financial", name: "Financial", color: "#10b981", weight: 25, icon: TrendingUp },
    { id: "customer", name: "Customer", color: "#3b82f6", weight: 25, icon: Users },
    { id: "internal", name: "Internal Process", color: "#8b5cf6", weight: 25, icon: BarChart3 },
    { id: "learning", name: "Learning & Growth", color: "#f59e0b", weight: 25, icon: BookOpen }
  ]);

  const [selectedPerspective, setSelectedPerspective] = useState("all");
  const [bscObjectives, setBscObjectives] = useState([]);
  const [showBscModal, setShowBscModal] = useState(false);
  const [strategicAlignment, setStrategicAlignment] = useState({
    objective: "",
    kpis: [],
    targets: {}
  });

  const [bscMetrics, setBscMetrics] = useState({
    financial: { score: 78, trend: "up" },
    customer: { score: 82, trend: "up" },
    internal: { score: 75, trend: "stable" },
    learning: { score: 71, trend: "up" }
  });

  const [analysisView, setAnalysisView] = useState("standard");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState("pdf");
  const [exportData, setExportData] = useState({
    includeQuestions: true,
    includeResponses: true,
    includeAnalytics: true,
    includeBscData: true
  });

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setScheduleDate(tomorrow.toISOString().split('T')[0]);
    setScheduleTime("09:00");

    const savedDrafts = localStorage.getItem('surveyDrafts');
    if (savedDrafts) {
      try {
        setDrafts(JSON.parse(savedDrafts));
      } catch (e) {
        console.error("Error loading drafts:", e);
      }
    }

    const savedSurveys = localStorage.getItem('surveys');
    if (savedSurveys) {
      try {
        setSurveys(JSON.parse(savedSurveys));
      } catch (e) {
        console.error("Error loading surveys:", e);
      }
    }

    const savedBscObjectives = localStorage.getItem('bscObjectives');
    if (savedBscObjectives) {
      try {
        setBscObjectives(JSON.parse(savedBscObjectives));
      } catch (e) {
        console.error("Error loading BSC objectives:", e);
      }
    }

    const savedQuestionBank = localStorage.getItem('questionBank');
    const savedBscQuestionBank = localStorage.getItem('bscQuestionBank');

    if (savedQuestionBank) {
      try {
        setQuestionBank(JSON.parse(savedQuestionBank));
      } catch (e) {
        console.error("Error loading question bank:", e);
      }
    }

    if (savedBscQuestionBank) {
      try {
        setBscQuestionBank(JSON.parse(savedBscQuestionBank));
      } catch (e) {
        console.error("Error loading BSC question bank:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('surveyDrafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    localStorage.setItem('surveys', JSON.stringify(surveys));
  }, [surveys]);

  useEffect(() => {
    localStorage.setItem('bscObjectives', JSON.stringify(bscObjectives));
  }, [bscObjectives]);

  useEffect(() => {
    localStorage.setItem('questionBank', JSON.stringify(questionBank));
    localStorage.setItem('bscQuestionBank', JSON.stringify(bscQuestionBank));
  }, [questionBank, bscQuestionBank]);

  const questionTypes = [
    { id: "rating", label: "Rating Scale", icon: Star, description: "1-5 or 1-10 rating scale" },
    { id: "nps", label: "NPS", icon: TrendingUp, description: "Net Promoter Score (0-10)" },
    { id: "multiple", label: "Multiple Choice", icon: CheckSquare, description: "Select one or multiple options" },
    { id: "open", label: "Open-Ended", icon: MessageSquare, description: "Text-based responses" },
    { id: "matrix", label: "Matrix", icon: Grid, description: "Grid of questions and options" },
    { id: "ranking", label: "Ranking", icon: List, description: "Rank items in order" },
    { id: "dropdown", label: "Dropdown", icon: ChevronDown, description: "Select from dropdown" },
    { id: "slider", label: "Slider", icon: Hash, description: "Visual slider for ratings" }
  ];

  const surveyTemplates = [
    { id: "engagement", name: "Employee Engagement", questions: 15, estimatedTime: "10 min", usage: "Monthly", icon: Users },
    { id: "satisfaction", name: "Job Satisfaction", questions: 12, estimatedTime: "8 min", usage: "Quarterly", icon: Star },
    { id: "exit", name: "Exit Interview", questions: 10, estimatedTime: "15 min", usage: "On Exit", icon: DoorClosed },
    { id: "onboarding", name: "Onboarding Feedback", questions: 8, estimatedTime: "5 min", usage: "After 30 days", icon: Users },
    { id: "training", name: "Training Feedback", questions: 10, estimatedTime: "7 min", usage: "Post-training", icon: BookOpen },
    { id: "wellness", name: "Wellness Pulse Check", questions: 6, estimatedTime: "3 min", usage: "Bi-weekly", icon: Heart }
  ];

  const bscSurveyTemplates = [
    {
      id: "bsc-strategic",
      name: "Strategic Alignment Survey",
      questions: 12,
      estimatedTime: "15 min",
      usage: "Quarterly",
      perspectives: ["all"],
      icon: Target
    },
    {
      id: "bsc-customer",
      name: "Customer Perspective",
      questions: 10,
      estimatedTime: "12 min",
      usage: "Monthly",
      perspectives: ["customer"],
      icon: Users
    },
    {
      id: "bsc-process",
      name: "Process Efficiency",
      questions: 8,
      estimatedTime: "10 min",
      usage: "Bi-weekly",
      perspectives: ["internal"],
      icon: TrendingUp
    },
    {
      id: "bsc-learning",
      name: "Learning & Growth",
      questions: 9,
      estimatedTime: "11 min",
      usage: "Quarterly",
      perspectives: ["learning"],
      icon: BookOpen
    }
  ];

  const targetAudiences = [
    { id: "all", label: "All Employees", count: 0 },
    { id: "department", label: "By Department", count: 0 },
    { id: "location", label: "By Location", count: 0 },
    { id: "role", label: "By Role", count: 0 },
    { id: "tenure", label: "By Tenure", count: 0 },
    { id: "custom", label: "Custom Group", count: 0 }
  ];

  const distributionMethods = [
    { id: "email", label: "Email Campaign", icon: Mail, description: "Send survey link via email" },
    { id: "in-app", label: "In-App Notification", icon: Bell, description: "Display survey within application" },
    { id: "sms", label: "SMS", icon: MessageCircle, description: "Send survey link via SMS" },
    { id: "qr", label: "QR Code", icon: QrCodeIcon, description: "Generate QR code for access" },
    { id: "link", label: "Shareable Link", icon: Share2, description: "Generate shareable survey link" }
  ];

  const schedulingOptions = [
    { id: "immediate", label: "Send Immediately" },
    { id: "scheduled", label: "Schedule for Later" },
    { id: "recurring", label: "Recurring Survey" },
    { id: "trigger", label: "Event-Triggered" }
  ];

  const recurrenceOptions = [
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "quarterly", label: "Quarterly" },
    { id: "biannual", label: "Bi-Annual" },
    { id: "annual", label: "Annual" }
  ];

  const categories = ["all", "engagement", "satisfaction", "wellness", "management", "improvement", "benefits", "growth", "strategic-alignment", "internal-process", "customer-focus", "empowerment", "resource-allocation"];

  const analyticsData = {
    responseRate: 0,
    completionRate: 0,
    averageNPS: 0,
    totalResponses: 0,
    departmentComparison: [],
    trendData: []
  };

  const bscCorrelationData = {
    perspectives: ["Financial", "Customer", "Internal", "Learning"],
    correlations: []
  };

  const maxEngagement = Math.max(...analyticsData.trendData.map(m => m.engagement));
  const minEngagement = Math.min(...analyticsData.trendData.map(m => m.engagement));

  const barColors = [
    "#3b82f6", 
    "#10b981", 
    "#f59e0b", 
    "#8b5cf6", 
    "#ef4444", 
    "#14b8a6"  
  ];

  const handleAddQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: "",
      required: false,
      options: type === "multiple" || type === "dropdown" ? ["Option 1", "Option 2"] : [],
      scale: type === "rating" ? 5 : type === "nps" ? 10 : 5,
      matrixRows: type === "matrix" ? ["Row 1", "Row 2"] : [],
      matrixColumns: type === "matrix" ? ["Column 1", "Column 2", "Column 3"] : [],
      rankingItems: type === "ranking" ? ["Item 1", "Item 2", "Item 3"] : []
    };
    setQuestions([...questions, newQuestion]);
    setShowQuestionBank(false);
    showNotification(`Added ${type} question`, "success");
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
    showNotification("Question removed", "info");
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleUseTemplate = (templateId) => {
    const template = [...surveyTemplates, ...bscSurveyTemplates].find(t => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(template);
    setSurveyTitle(`${template.name} Survey`);

    if (template.perspectives && template.perspectives[0] !== "all") {
      setSelectedPerspective(template.perspectives[0]);
    }

    let templateQuestions = [];
    if (template.id.includes("bsc-")) {
      templateQuestions = bscQuestionBank
        .filter(q => template.perspectives[0] === "all" || q.perspective === template.perspectives[0])
        .slice(0, 3)
        .map((q, index) => ({
          id: Date.now() + index,
          type: q.type,
          question: q.question,
          required: true,
          scale: q.type === "rating" ? 5 : 10,
          options: q.type === "multiple" ? ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] : []
        }));
    } else {
      templateQuestions = [
        {
          id: Date.now(),
          type: "rating",
          question: "How satisfied are you with your current role?",
          required: true,
          scale: 5
        },
        {
          id: Date.now() + 1,
          type: "nps",
          question: "How likely are you to recommend working here?",
          required: true,
          scale: 10
        },
        {
          id: Date.now() + 2,
          type: "multiple",
          question: "What are the main factors contributing to your job satisfaction?",
          required: false,
          options: ["Work-life balance", "Compensation", "Career growth", "Team culture", "Management support"]
        }
      ];
    }

    setQuestions(templateQuestions);
    showNotification(`Template "${template.name}" loaded`, "success");
  };

  const handleAddFromQuestionBank = (question) => {
    const newQuestion = {
      ...question,
      id: Date.now(),
      required: false,
      options: question.type === "multiple" ? ["Option 1", "Option 2", "Option 3"] : [],
      scale: question.type === "rating" ? 5 : question.type === "nps" ? 10 : 5
    };
    setQuestions([...questions, newQuestion]);

    if (question.perspective) {
      setBscQuestionBank(prev => prev.map(q =>
        q.id === question.id ? { ...q, used: (q.used || 0) + 1, lastUsed: new Date().toISOString().split('T')[0] } : q
      ));
    } else {
      setQuestionBank(prev => prev.map(q =>
        q.id === question.id ? { ...q, used: (q.used || 0) + 1, lastUsed: new Date().toISOString().split('T')[0] } : q
      ));
    }

    showNotification(`Question added from bank`, "success");
  };

  const handleLaunchSurvey = () => {
    if (!surveyTitle || questions.length === 0) {
      setStatusModal({
        open: true,
        title: "Cannot Launch Survey",
        message: "Please add a survey title and at least one question before launching.",
        type: "warning"
      });
      return;
    }

    const newSurvey = {
      id: Date.now(),
      title: surveyTitle,
      questions: questions,
      responses: 0,
      status: "active",
      createdAt: new Date().toISOString().split('T')[0],
      description: surveyDescription,
      audience: selectedAudience,
      visibility: surveyVisibility,
      expiry: surveyExpiry,
      perspective: selectedPerspective !== "all" ? selectedPerspective : null
    };

    setSurveys([newSurvey, ...surveys]);

    setShowLaunchModal(false);

    setStatusModal({
      open: true,
      title: "Survey Launched",
      message: `"${surveyTitle}" is now live and available to ${selectedAudience === "all" ? "all employees" : "selected audience"}.`,
      type: "success"
    });

    setSurveyTitle("");
    setQuestions([]);
    setSurveyDescription("");
  };

  const handleSaveDraft = () => {
    if (!surveyTitle) {
      showNotification("Please add a survey title before saving", "warning");
      return;
    }

    const newDraft = {
      id: Date.now(),
      title: surveyTitle,
      questions,
      description: surveyDescription,
      visibility: surveyVisibility,
      audience: selectedAudience,
      distribution: distributionMethod,
      scheduling,
      note: draftNote,
      lastSaved: new Date().toLocaleString(),
      timestamp: Date.now(),
      perspective: selectedPerspective !== "all" ? selectedPerspective : null
    };

    setDrafts([newDraft, ...drafts]);
    setShowDraftModal(false);
    setDraftNote("");

    showNotification("Draft saved successfully", "success");
  };

  const handleExportResults = (format = "pdf") => {
    setExportType(format);
    setShowExportModal(true);
  };

  const generatePDFContent = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    let content = `
      SURVEY EXPORT REPORT
      ===================
      
      Export Date: ${dateStr} ${timeStr}
      Survey Title: ${surveyTitle || "Untitled Survey"}
      Survey Description: ${surveyDescription || "No description provided"}
      Total Questions: ${questions.length}
      ${selectedPerspective !== "all" ? `BSC Perspective: ${bscPerspectives.find(p => p.id === selectedPerspective)?.name}` : ""}
      
      `;

    if (exportData.includeQuestions && questions.length > 0) {
      content += `
      QUESTIONS
      =========
      `;
      questions.forEach((q, index) => {
        content += `${index + 1}. ${q.question || "Untitled question"}
          Type: ${q.type.toUpperCase()}
          Required: ${q.required ? "Yes" : "No"}
          ${q.options ? `Options: ${q.options.join(", ")}` : ""}
          ${q.scale ? `Scale: 1-${q.scale}` : ""}
          
          `;
      });
    }

    if (exportData.includeAnalytics) {
      content += `
      ANALYTICS SUMMARY
      =================
      Response Rate: ${analyticsData.responseRate}%
      Completion Rate: ${analyticsData.completionRate}%
      Average NPS: ${analyticsData.averageNPS}
      Total Responses: ${analyticsData.totalResponses}
      
      Department Performance:
      `;
      analyticsData.departmentComparison.forEach(dept => {
        content += `  - ${dept.department}: ${dept.responseRate}% response rate, ${dept.satisfaction}/5 satisfaction
        `;
      });

      content += `
      Trend Analysis:
      `;
      analyticsData.trendData.forEach(trend => {
        content += `  - ${trend.month}: Engagement ${trend.engagement}/5, Response ${trend.responseRate}%
        `;
      });
    }

    if (exportData.includeBscData && bscObjectives.length > 0) {
      content += `
      BSC OBJECTIVES
      ==============
      `;
      bscObjectives.forEach(obj => {
        const perspective = bscPerspectives.find(p => p.id === obj.perspective);
        content += `Objective: ${obj.name}
          Perspective: ${perspective?.name || "Strategic"}
          KPIs: ${obj.kpis.length > 0 ? obj.kpis.join(", ") : "No KPIs defined"}
          
          `;
      });
    }

    if (exportData.includeBscData) {
      content += `
      BSC PERFORMANCE METRICS
      =======================
      Financial: ${bscMetrics.financial.score}/100 (${bscMetrics.financial.trend})
      Customer: ${bscMetrics.customer.score}/100 (${bscMetrics.customer.trend})
      Internal Process: ${bscMetrics.internal.score}/100 (${bscMetrics.internal.trend})
      Learning & Growth: ${bscMetrics.learning.score}/100 (${bscMetrics.learning.trend})
      
      Correlation Matrix:
      `;
      bscCorrelationData.correlations.forEach((row, i) => {
        content += `  ${bscCorrelationData.perspectives[i]}: ${row.map(r => r.toFixed(2)).join("  ")}
        `;
      });
    }

    return content;
  };

  const handleExportPDF = () => {
    const content = generatePDFContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${surveyTitle.replace(/\s+/g, '_')}_survey_report_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification("PDF exported successfully", "success");
    setShowExportModal(false);
  };

  const generateExcelData = () => {
    const data = [];

    data.push(["SURVEY EXPORT REPORT", "", "", ""]);
    data.push(["Export Date", new Date().toLocaleString(), "", ""]);
    data.push(["Survey Title", surveyTitle || "Untitled Survey", "", ""]);
    data.push(["Survey Description", surveyDescription || "No description provided", "", ""]);
    data.push(["Total Questions", questions.length, "", ""]);
    if (selectedPerspective !== "all") {
      data.push(["BSC Perspective", bscPerspectives.find(p => p.id === selectedPerspective)?.name, "", ""]);
    }
    data.push([""]);

    if (exportData.includeQuestions && questions.length > 0) {
      data.push(["QUESTIONS", "", "", ""]);
      data.push(["No.", "Question", "Type", "Required", "Options/Scale"]);
      questions.forEach((q, index) => {
        data.push([
          index + 1,
          q.question || "Untitled question",
          q.type.toUpperCase(),
          q.required ? "Yes" : "No",
          q.options ? q.options.join(", ") : q.scale ? `1-${q.scale}` : ""
        ]);
      });
      data.push([""]);
    }

    if (exportData.includeAnalytics) {
      data.push(["ANALYTICS SUMMARY", "", "", ""]);
      data.push(["Metric", "Value", "", ""]);
      data.push(["Response Rate", `${analyticsData.responseRate}%`, "", ""]);
      data.push(["Completion Rate", `${analyticsData.completionRate}%`, "", ""]);
      data.push(["Average NPS", analyticsData.averageNPS, "", ""]);
      data.push(["Total Responses", analyticsData.totalResponses, "", ""]);
      data.push([""]);

      data.push(["DEPARTMENT PERFORMANCE", "", "", ""]);
      data.push(["Department", "Response Rate", "Satisfaction Score", ""]);
      analyticsData.departmentComparison.forEach(dept => {
        data.push([dept.department, `${dept.responseRate}%`, `${dept.satisfaction}/5`, ""]);
      });
      data.push([""]);

      data.push(["TREND ANALYSIS", "", "", ""]);
      data.push(["Month", "Engagement Score", "Response Rate", ""]);
      analyticsData.trendData.forEach(trend => {
        data.push([trend.month, `${trend.engagement}/5`, `${trend.responseRate}%`, ""]);
      });
      data.push([""]);
    }

    if (exportData.includeBscData && bscObjectives.length > 0) {
      data.push(["BSC OBJECTIVES", "", "", ""]);
      data.push(["Objective", "Perspective", "KPIs", ""]);
      bscObjectives.forEach(obj => {
        data.push([
          obj.name,
          bscPerspectives.find(p => p.id === obj.perspective)?.name || "Strategic",
          obj.kpis.join("; "),
          ""
        ]);
      });
      data.push([""]);
    }

    if (exportData.includeBscData) {
      data.push(["BSC PERFORMANCE METRICS", "", "", ""]);
      data.push(["Perspective", "Score", "Trend", ""]);
      Object.entries(bscMetrics).forEach(([key, value]) => {
        data.push([
          key.charAt(0).toUpperCase() + key.slice(1),
          `${value.score}/100`,
          value.trend,
          ""
        ]);
      });
      data.push([""]);

      data.push(["CORRELATION MATRIX", "", "", ""]);
      data.push(["", ...bscCorrelationData.perspectives]);
      bscCorrelationData.correlations.forEach((row, i) => {
        data.push([bscCorrelationData.perspectives[i], ...row.map(r => r.toFixed(2))]);
      });
    }

    return data;
  };

  const handleExportExcel = () => {
    const data = generateExcelData();
    let csvContent = "data:text/csv;charset=utf-8,";

    data.forEach(row => {
      csvContent += row.map(cell => {
        if (cell === null || cell === undefined) return '';
        if (typeof cell === 'string') return `"${cell.replace(/"/g, '""')}"`;
        return cell;
      }).join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${surveyTitle.replace(/\s+/g, '_')}_survey_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("Excel (CSV) exported successfully", "success");
    setShowExportModal(false);
  };

  const handleExport = () => {
    if (exportType === "pdf") {
      handleExportPDF();
    } else {
      handleExportExcel();
    }
  };

  const handleSendReminders = () => {
    const payload = {
      audience: reminderAudience,
      channel: reminderChannel,
      message: reminderMessage || "Please complete the pending survey.",
      timestamp: new Date().toISOString()
    };

    console.log("Reminder Payload:", payload);

    setShowReminderModal(false);
    setReminderMessage("");

    showNotification(`Reminders sent to ${reminderAudience} via ${reminderChannel}`, "success");
  };

  const handleScheduleSurvey = () => {
    if (!surveyTitle.trim() || questions.length === 0) {
      showNotification("Please complete survey details before scheduling", "warning");
      return;
    }

    if (scheduling === "scheduled" && (!scheduleDate || !scheduleTime)) {
      showNotification("Please select date and time for scheduled survey", "warning");
      return;
    }

    const surveySchedule = {
      id: Date.now(),
      title: surveyTitle,
      questions,
      method: distributionMethod,
      audience: selectedAudience,
      scheduledFor: scheduling === "immediate" ? new Date().toISOString() : `${scheduleDate}T${scheduleTime}:00`,
      recurrence: scheduling === "recurring" ? recurrencePattern : null,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      perspective: selectedPerspective !== "all" ? selectedPerspective : null
    };

    if (scheduling === "recurring") {
      setRecurringSurveys([...recurringSurveys, surveySchedule]);
      showNotification(`Recurring survey scheduled (${recurrencePattern})`, "success");
    } else if (scheduling === "scheduled") {
      setScheduledSurveys([...scheduledSurveys, surveySchedule]);
      showNotification(`Survey scheduled for ${new Date(surveySchedule.scheduledFor).toLocaleString()}`, "success");
    } else {
      handleLaunchSurvey();
    }

    setShowScheduleModal(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
      showNotification("Data refreshed successfully", "success");
    }, 1500);
  };

  const handleNewSurvey = () => {
    if (questions.length > 0 || surveyTitle) {
      if (!window.confirm("Starting a new survey will clear all current work. Continue?")) {
        return;
      }
    }

    setSurveyTitle("");
    setQuestions([]);
    setSelectedTemplate(null);
    setSurveyVisibility("anonymous");
    setSelectedAudience("all");
    setDistributionMethod("email");
    setScheduling("immediate");
    setSurveyDescription("");
    setActiveTab("create");
    setSelectedPerspective("all");
    setIsViewMode(false);
    setSelectedSurvey(null);

    setShowNewSurveyModal(false);
    showNotification("New survey started", "info");
  };

  const handleDuplicateSurvey = (survey) => {
    const duplicatedSurvey = {
      ...survey,
      id: Date.now(),
      title: `${survey.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      status: "draft"
    };

    setSurveys([duplicatedSurvey, ...surveys]);
    showNotification(`Survey duplicated as "${duplicatedSurvey.title}"`, "success");
  };

  const handleViewSurvey = (survey) => {
    setSelectedSurvey(survey);
    setIsViewMode(true);
    setShowViewModal(true);

    setSurveyTitle(survey.title);
    setQuestions(survey.questions || []);
    setSurveyVisibility(survey.visibility || "anonymous");
    setSelectedAudience(survey.audience || "all");
    setDistributionMethod(survey.distribution || "email");
    setScheduling(survey.scheduling || "immediate");
    setSurveyDescription(survey.description || "");
    setSelectedPerspective(survey.perspective || "all");

    showNotification(`Viewing survey: "${survey.title}"`, "info");
  };

  const handleToggleQuestionBank = () => {
    setShowQuestionBank(!showQuestionBank);
  };

  const handleClearSurvey = () => {
    if (window.confirm("Are you sure you want to clear all questions?")) {
      setQuestions([]);
      showNotification("All questions cleared", "info");
    }
  };

  const handleFilterAnalytics = () => {
    showNotification("Analytics filters applied", "info");
  };

  const handleToggleNotification = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: !notification.read } : notification
    ));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    showNotification("All notifications marked as read", "success");
  };

  const handleShareSurvey = () => {
    const surveyId = selectedSurvey?.id || Date.now();
    const link = `https://survey.company.com/survey/${surveyId}/${surveyTitle.replace(/\s+/g, "-").toLowerCase()}`;
    setShareLink(link);

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link)
        .then(() => {
          showNotification("Survey link copied to clipboard", "success");
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          copyToClipboardFallback(link);
        });
    } else {
      copyToClipboardFallback(link);
    }
  };

  const copyToClipboardFallback = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.className = "fixed -left-[999999px] -top-[999999px]";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showNotification("Survey link copied to clipboard", "success");
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      showNotification("Failed to copy link. Please copy manually: " + text, "warning");
    }
    textArea.remove();
  };

  const handleGenerateQRCode = () => {
    const surveyId = selectedSurvey?.id || Date.now();
    const link = `https://survey.company.com/survey/${surveyId}/${surveyTitle.replace(/\s+/g, "-").toLowerCase()}`;
    setShareLink(link);
    setShowQRCodeModal(true);
    showNotification("QR Code generated for survey access", "success");
  };

  const handleUpdateReminderSettings = (field, value) => {
    setReminderSettings({ ...reminderSettings, [field]: value });
    showNotification("Reminder settings updated", "info");
  };

  const handleUpdateSurveyLogic = (field) => {
    setSurveyLogic({ ...surveyLogic, [field]: !surveyLogic[field] });
    showNotification(`${field.replace(/([A-Z])/g, ' $1')} ${!surveyLogic[field] ? 'enabled' : 'disabled'}`, "info");
  };

  const handleLoadDraft = (draft) => {
    setSurveyTitle(draft.title);
    setQuestions(draft.questions || []);
    setSurveyVisibility(draft.visibility || "anonymous");
    setSelectedAudience(draft.audience || "all");
    setDistributionMethod(draft.distribution || "email");
    setScheduling(draft.scheduling || "immediate");
    setSurveyDescription(draft.description || "");
    setSelectedPerspective(draft.perspective || "all");
    setActiveTab("create");
    setIsViewMode(false);
    setSelectedSurvey(null);

    showNotification(`Draft "${draft.title}" loaded`, "info");
  };

  const handleDeleteDraft = (draftId) => {
    if (window.confirm("Are you sure you want to delete this draft?")) {
      setDrafts(drafts.filter(d => d.id !== draftId));
      showNotification("Draft deleted", "success");
    }
  };

  const handleDeleteSurvey = (surveyId) => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      setSurveys(surveys.filter(s => s.id !== surveyId));
      showNotification("Survey deleted", "success");
    }
  };

  const handleSurveyAction = (surveyId, action) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) return;

    switch (action) {
      case 'pause':
        setSurveys(surveys.map(s =>
          s.id === surveyId ? { ...s, status: 'paused' } : s
        ));
        showNotification(`Survey "${survey.title}" paused`, "info");
        break;
      case 'resume':
        setSurveys(surveys.map(s =>
          s.id === surveyId ? { ...s, status: 'active' } : s
        ));
        showNotification(`Survey "${survey.title}" resumed`, "success");
        break;
      case 'close':
        setSurveys(surveys.map(s =>
          s.id === surveyId ? { ...s, status: 'completed' } : s
        ));
        showNotification(`Survey "${survey.title}" closed`, "info");
        break;
      default:
        break;
    }
  };

  const handlePerspectiveChange = (perspectiveId) => {
    setSelectedPerspective(perspectiveId);
    showNotification(`Filtering by ${perspectiveId === "all" ? "All Perspectives" : perspectiveId}`, "info");
  };

  const handleAddBscObjective = () => {
    if (!strategicAlignment.objective) {
      showNotification("Please enter an objective name", "warning");
      return;
    }

    const newObjective = {
      id: Date.now(),
      name: strategicAlignment.objective,
      perspective: selectedPerspective !== "all" ? selectedPerspective : "strategic",
      kpis: strategicAlignment.kpis,
      targets: strategicAlignment.targets,
      createdAt: new Date().toISOString(),
      status: "active"
    };

    setBscObjectives([...bscObjectives, newObjective]);
    setStrategicAlignment({
      objective: "",
      kpis: [],
      targets: {}
    });
    setShowBscModal(false);
    showNotification("BSC Objective added successfully", "success");
  };

  const handleDeleteBscObjective = (objectiveId) => {
    if (window.confirm("Are you sure you want to delete this BSC objective?")) {
      setBscObjectives(bscObjectives.filter(obj => obj.id !== objectiveId));
      showNotification("BSC objective deleted", "success");
    }
  };

  const handleToggleAnalysisView = () => {
    setAnalysisView(analysisView === "standard" ? "bsc" : "standard");
    showNotification(`Switched to ${analysisView === "standard" ? "BSC Analysis" : "Standard Analysis"} view`, "info");
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setNewQuestionText(question.question);
    setNewQuestionType(question.type);
    setNewQuestionCategory(question.category);
    setNewQuestionTags([...question.tags || []]);
    setShowEditQuestionModal(true);
  };

  const handleSaveEditedQuestion = () => {
    if (!newQuestionText.trim()) {
      showNotification("Question text cannot be empty", "warning");
      return;
    }

    if (editingQuestion.perspective) {
      setBscQuestionBank(prev => prev.map(q =>
        q.id === editingQuestion.id ? {
          ...q,
          question: newQuestionText,
          type: newQuestionType,
          category: newQuestionCategory,
          tags: newQuestionTags,
          lastModified: new Date().toISOString().split('T')[0]
        } : q
      ));
    } else {
      setQuestionBank(prev => prev.map(q =>
        q.id === editingQuestion.id ? {
          ...q,
          question: newQuestionText,
          type: newQuestionType,
          category: newQuestionCategory,
          tags: newQuestionTags,
          lastModified: new Date().toISOString().split('T')[0]
        } : q
      ));
    }

    setShowEditQuestionModal(false);
    setEditingQuestion(null);
    showNotification("Question updated successfully", "success");
  };

  const handleDuplicateQuestionInBank = (question) => {
    const newQuestion = {
      ...question,
      id: Date.now(),
      question: `${question.question} (Copy)`,
      used: 0,
      lastUsed: null,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (question.perspective) {
      setBscQuestionBank(prev => [...prev, newQuestion]);
    } else {
      setQuestionBank(prev => [...prev, newQuestion]);
    }

    showNotification("Question duplicated in bank", "success");
  };

  const handleDeleteQuestionFromBank = (question) => {
    if (window.confirm("Are you sure you want to delete this question from the bank?")) {
      if (question.perspective) {
        setBscQuestionBank(prev => prev.filter(q => q.id !== question.id));
      } else {
        setQuestionBank(prev => prev.filter(q => q.id !== question.id));
      }
      showNotification("Question deleted from bank", "success");
    }
  };

  const handleAddNewQuestionToBank = () => {
    if (!newQuestionText.trim()) {
      showNotification("Question text cannot be empty", "warning");
      return;
    }

    const newQuestion = {
      id: Date.now(),
      question: newQuestionText,
      type: newQuestionType,
      category: newQuestionCategory || "general",
      tags: newQuestionTags,
      used: 0,
      lastUsed: null,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (selectedPerspective !== "all" && selectedPerspective !== "bsc") {
      newQuestion.perspective = selectedPerspective;
      setBscQuestionBank(prev => [...prev, newQuestion]);
    } else {
      setQuestionBank(prev => [...prev, newQuestion]);
    }

    setNewQuestionText("");
    setNewQuestionType("rating");
    setNewQuestionCategory("");
    setNewQuestionTags([]);
    setTagInput("");

    showNotification("Question added to bank", "success");
    setShowEditQuestionModal(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newQuestionTags.includes(tagInput.trim())) {
      setNewQuestionTags([...newQuestionTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewQuestionTags(newQuestionTags.filter(tag => tag !== tagToRemove));
  };

  const handlePreviewResponse = (questionId, response) => {
    setPreviewResponses({
      ...previewResponses,
      [questionId]: response
    });
  };

  const handleResetPreview = () => {
    setPreviewResponses({});
    showNotification("Preview responses reset", "info");
  };

  const handleSubmitPreview = () => {
    const answeredQuestions = Object.keys(previewResponses).length;
    const totalQuestions = questions.length;

    if (answeredQuestions < totalQuestions) {
      showNotification(`You have answered ${answeredQuestions} out of ${totalQuestions} questions. Please complete all questions before submitting.`, "warning");
    } else {
      showNotification("Survey submitted successfully! (Preview Mode)", "success");
      handleResetPreview();
    }
  };

  const filteredQuestions = [...questionBank, ...bscQuestionBank].filter(q => {
    if (searchQuery && !q.question.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filterCategory !== "all" && q.category !== filterCategory) {
      return false;
    }

    if (filterType !== "all" && q.type !== filterType) {
      return false;
    }

    if (selectedPerspective !== "all") {
      if (selectedPerspective === "bsc" && !q.perspective) return false;
      if (selectedPerspective !== "bsc" && q.perspective !== selectedPerspective) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "used":
        return (b.used || 0) - (a.used || 0);
      case "recent":
        const dateA = a.lastUsed || a.createdAt;
        const dateB = b.lastUsed || b.createdAt;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return new Date(dateB) - new Date(dateA);
      case "alphabetical":
        return a.question.localeCompare(b.question);
      default:
        return 0;
    }
  });

  const showNotification = (message, type = "info") => {
    const notification = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-emerald-500' : type === 'warning' ? 'bg-amber-500' : 'bg-blue-500';
    notification.className = `fixed top-5 right-5 px-5 py-3 text-white rounded-lg z-[1000] shadow-md min-w-[300px] max-w-[400px] font-sans transition-all duration-300 translate-x-full opacity-0 ${bgClass}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        notification.className = `fixed top-5 right-5 px-5 py-3 text-white rounded-lg z-[1000] shadow-md min-w-[300px] max-w-[400px] font-sans transition-all duration-300 translate-x-0 opacity-100 ${bgClass}`;
      });
    });

    setTimeout(() => {
      notification.className = `fixed top-5 right-5 px-5 py-3 text-white rounded-lg z-[1000] shadow-md min-w-[300px] max-w-[400px] font-sans transition-all duration-300 translate-x-full opacity-0 ${bgClass}`;
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const renderCreateSurvey = () => (
    <div className="fade-in">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Plus size={20} />Survey Creation</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Survey Title *</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter survey title"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              disabled={isViewMode}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">BSC Perspective (Optional)</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedPerspective}
              onChange={(e) => setSelectedPerspective(e.target.value)}
              disabled={isViewMode}
            >
              <option value="all">All Perspectives</option>
              {bscPerspectives.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.weight}%)</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Visibility Mode</label>
            <div className="flex flex-col gap-2.5 mt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
                <input
                  type="radio"
                  checked={surveyVisibility === "anonymous"}
                  onChange={() => !isViewMode && setSurveyVisibility("anonymous")}
                  disabled={isViewMode}
                />
                <span>Anonymous</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
                <input
                  type="radio"
                  checked={surveyVisibility === "identified"}
                  onChange={() => !isViewMode && setSurveyVisibility("identified")}
                  disabled={isViewMode}
                />
                <span>Identified</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Strategic Alignment</label>
            <div className="flex gap-2">
              {selectedPerspective !== "all" && (
                <span
                  className={`bg-[${bscPerspectives.find(p => p.id === selectedPerspective)?.color}20] text-[${bscPerspectives.find(p => p.id === selectedPerspective)?.color}] border-[${bscPerspectives.find(p => p.id === selectedPerspective)?.color}]`}>
                  {bscPerspectives.find(p => p.id === selectedPerspective)?.name}
                </span>
              )}
              <button
                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setShowBscModal(true)}
                disabled={isViewMode}
              >
                <Target size={12} /> Align Objectives
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Survey Description</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px] resize-y"
            placeholder="Describe the purpose of this survey..."
            rows={3}
            value={surveyDescription}
            onChange={(e) => !isViewMode && setSurveyDescription(e.target.value)}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><FileText size={20} />Survey Questions ({questions.length})</h4>
          {!isViewMode && (
            <div className="flex gap-2 mt-2">
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={handleToggleQuestionBank}
              >
                <BookOpen size={16} /> Question Bank
              </button>
              {questions.length > 0 && (
                <button
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={handleClearSurvey}
                >
                  <Trash2 size={16} /> Clear All
                </button>
              )}
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
                onClick={() => setShowAddQuestionModal(true)}
              >
                <Plus size={16} /> Add Question
              </button>
            </div>
          )}
        </div>

        {showQuestionBank && !isViewMode && (
          <div className="mb-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-base font-semibold text-slate-800 m-0">Question Types</h5>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {questionTypes.map(type => (
                <div
                  key={type.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-4"
                  onClick={() => handleAddQuestion(type.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <type.icon size={20} color="#3b82f6" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{type.label}</div>
                      <div className="text-xs text-slate-500">{type.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedPerspective !== "all" && (
              <div className="mt-6">
                <h5 className="text-base font-semibold text-slate-800 m-0 mb-4">
                  <Target size={16} /> BSC Questions - {bscPerspectives.find(p => p.id === selectedPerspective)?.name}
                </h5>
                {bscQuestionBank
                  .filter(q => q.perspective === selectedPerspective)
                  .map(q => (
                    <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium mb-1">{q.question}</div>
                          <div className="flex gap-2 text-xs text-slate-500">
                            <span className="text-sm">
                              {q.perspective}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block border border-slate-200 bg-slate-100 text-slate-700">{q.type}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block border border-slate-200 bg-slate-100 text-slate-700">Used {q.used} times</span>
                          </div>
                        </div>
                        <button
                          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          onClick={() => handleAddFromQuestionBank(q)}
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="mt-6">
              <h5 className="text-base font-semibold text-slate-800 m-0 mb-4">Question Bank</h5>
              {questionBank.map(q => (
                <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-medium mb-1">{q.question}</div>
                      <div className="flex gap-2 text-xs text-slate-500">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block border border-slate-200 bg-slate-100 text-slate-700">{q.type}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block border border-slate-200 bg-slate-100 text-slate-700">{q.category}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block border border-slate-200 bg-slate-100 text-slate-700">Used {q.used} times</span>
                      </div>
                    </div>
                    <button
                      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      onClick={() => handleAddFromQuestionBank(q)}
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {questions.length > 0 ? (
          <div>
            {questions.map((q, index) => (
              <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-3">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-blue-500">Q{index + 1}</span>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1"
                        placeholder="Enter your question here..."
                        value={q.question}
                        onChange={(e) => !isViewMode && handleQuestionChange(q.id, "question", e.target.value)}
                        disabled={isViewMode}
                      />
                    </div>

                    {/* Question type specific inputs */}
                    {q.type === "rating" && (
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[13px]">Scale:</span>
                        <select
                          className="text-sm"
                          value={q.scale}
                          onChange={(e) => !isViewMode && handleQuestionChange(q.id, "scale", parseInt(e.target.value))}
                          disabled={isViewMode}
                        >
                          <option value="3">1-3</option>
                          <option value="5">1-5</option>
                          <option value="7">1-7</option>
                          <option value="10">1-10</option>
                        </select>
                      </div>
                    )}

                    {q.type === "multiple" && (
                      <div className="mt-3">
                        <div className="text-[13px] mb-2">Options:</div>
                        {q.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1"
                              value={option}
                              onChange={(e) => {
                                if (isViewMode) return;
                                const newOptions = [...q.options];
                                newOptions[optIndex] = e.target.value;
                                handleQuestionChange(q.id, "options", newOptions);
                              }}
                              disabled={isViewMode}
                            />
                            {!isViewMode && (
                              <button
                                className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                onClick={() => {
                                  const newOptions = q.options.filter((_, i) => i !== optIndex);
                                  handleQuestionChange(q.id, "options", newOptions);
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                        {!isViewMode && (
                          <button
                            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-blue-600 transition hover:bg-slate-50"
                            onClick={() => {
                              const newOptions = [...q.options, `Option ${q.options.length + 1}`];
                              handleQuestionChange(q.id, "options", newOptions);
                            }}
                          >
                            <Plus size={12} /> Add Option
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {!isViewMode && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        onClick={() => handleRemoveQuestion(q.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <label className="text-sm">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => !isViewMode && handleQuestionChange(q.id, "required", e.target.checked)}
                      disabled={isViewMode}
                    />
                    <span>Required question</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    {q.type.charAt(0).toUpperCase() + q.type.slice(1)} Question
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-center text-slate-500">
              <FileText size={48} className="mb-4 opacity-50 mx-auto" />
              <p className="mb-2">No questions added yet</p>
              <p className="text-sm">Click "Add Question" to start building your survey</p>
            </div>
          </div>
        )}
      </div>

      {!isViewMode && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Clock size={20} />Survey Settings</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Survey Expiry</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="7"
                  value={surveyExpiry.value}
                  onChange={(e) => setSurveyExpiry({ ...surveyExpiry, value: parseInt(e.target.value) || 7 })}
                />
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={surveyExpiry.unit}
                  onChange={(e) => setSurveyExpiry({ ...surveyExpiry, unit: e.target.value })}
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reminder Settings</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={`${reminderSettings.frequency}`}
                onChange={(e) => handleUpdateReminderSettings("frequency", parseInt(e.target.value))}
              >
                <option value="1">Send 1 reminder</option>
                <option value="2">Send 2 reminders</option>
                <option value="3">Send 3 reminders</option>
                <option value="0">No reminders</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Completion Message</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={completionMessage}
                onChange={(e) => setCompletionMessage(e.target.value)}
              >
                <option value="show thank you message">Show thank you message</option>
                <option value="redirect to website">Redirect to website</option>
                <option value="show results summary">Show results summary</option>
                <option value="custom message">Custom message</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Survey Logic & Skip Patterns</label>
            <div className="flex flex-col gap-2.5 mt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={surveyLogic.skipLogic}
                  onChange={() => handleUpdateSurveyLogic("skipLogic")}
                />
                <span>Enable skip logic based on responses</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={surveyLogic.randomize}
                  onChange={() => handleUpdateSurveyLogic("randomize")}
                />
                <span>Randomize question order</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={surveyLogic.progressBar}
                  onChange={() => handleUpdateSurveyLogic("progressBar")}
                />
                <span>Show progress bar</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* BSC Objectives Section */}
      {bscObjectives.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Target size={20} />Strategic Objectives Alignment</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {bscObjectives.map(obj => (
              <div key={obj.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold mb-2">{obj.name}</div>
                    <div className="text-xs text-slate-500">
                      {bscPerspectives.find(p => p.id === obj.perspective)?.name || "Strategic"}
                    </div>
                    {obj.kpis.length > 0 && (
                      <div className="mt-2">
                        <div className="text-[11px] text-slate-700 font-medium">KPIs:</div>
                        <div className="text-[11px] text-slate-500">
                          {obj.kpis.slice(0, 2).join(", ")}
                          {obj.kpis.length > 2 && ` +${obj.kpis.length - 2} more`}
                        </div>
                      </div>
                    )}
                  </div>
                  {!isViewMode && (
                    <button
                      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      onClick={() => handleDeleteBscObjective(obj.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Surveys Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><BarChart3 size={20} />Active Surveys</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-3 font-medium text-slate-700">Survey Title</th>
                <th className="text-left p-3 font-medium text-slate-700">Questions</th>
                <th className="text-left p-3 font-medium text-slate-700">Responses</th>
                <th className="text-left p-3 font-medium text-slate-700">Perspective</th>
                <th className="text-left p-3 font-medium text-slate-700">Status</th>
                <th className="text-left p-3 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map(survey => (
                <tr key={survey.id} className="border-b border-slate-100">
                  <td className="p-3 font-medium">{survey.title}</td>
                  <td className="p-3">{Array.isArray(survey.questions) ? survey.questions.length : survey.questions || 0}</td>
                  <td className="p-3">{survey.responses}</td>
                  <td className="p-3">
                    {survey.perspective ? (
                      <span className="text-sm">
                        {bscPerspectives.find(p => p.id === survey.perspective)?.name}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block border border-slate-200 bg-slate-100 text-slate-700">General</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="text-sm">
                      {survey.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        onClick={() => handleViewSurvey(survey)}
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        onClick={() => handleDuplicateSurvey(survey)}
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        onClick={() => handleSurveyAction(survey.id,
                          survey.status === "active" ? "pause" :
                            survey.status === "paused" ? "resume" : "close")}
                      >
                        {survey.status === "active" ? "⏸" :
                          survey.status === "paused" ? "▶" : "✓"}
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        onClick={() => handleDeleteSurvey(survey.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        onClick={() => {
                          setSelectedSurvey(survey);
                          setShowExportModal(true);
                        }}
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drafts Section */}
      {drafts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Save size={20} />Saved Drafts</h4>
          <div className="flex flex-col gap-3">
            {drafts.map(draft => (
              <div key={draft.id} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                <div>
                  <div className="font-medium">{draft.title}</div>
                  <div className="text-xs text-slate-500">
                    {draft.questions?.length || 0} questions • Last saved: {draft.lastSaved}
                    {draft.perspective && draft.perspective !== "all" && (
                      <span className="text-sm">
                        {bscPerspectives.find(p => p.id === draft.perspective)?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    onClick={() => handleLoadDraft(draft)}
                  >
                    <Eye size={12} /> Load
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    onClick={() => handleDeleteDraft(draft.id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDistributeSurvey = () => (
    <div className="fade-in">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Send size={20} />Survey Distribution</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Distribution Method</label>
            <div className="flex flex-col gap-3">
              {distributionMethods.map(method => (
                <div
                  key={method.id}

                  onClick={() => !isViewMode && setDistributionMethod(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <method.icon size={20} color={distributionMethod === method.id ? "#3b82f6" : "#6b7280"} />
                    <div>
                      <div className="font-medium">{method.label}</div>
                      <div className="text-xs text-slate-500">{method.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Scheduling</label>
            <div className="flex flex-col gap-3">
              {schedulingOptions.map(option => (
                <div
                  key={option.id}

                  onClick={() => !isViewMode && setScheduling(option.id)}
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={20} color={scheduling === option.id ? "#3b82f6" : "#6b7280"} />
                    <div className="font-medium">{option.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {scheduling === "scheduled" && (
              <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Schedule Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={scheduleDate}
                      onChange={(e) => !isViewMode && setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Schedule Time</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={scheduleTime}
                      onChange={(e) => !isViewMode && setScheduleTime(e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            )}

            {scheduling === "recurring" && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Recurrence Pattern</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={recurrencePattern}
                  onChange={(e) => !isViewMode && setRecurrencePattern(e.target.value)}
                  disabled={isViewMode}
                >
                  {recurrenceOptions.map(recurrence => (
                    <option key={recurrence.id} value={recurrence.id}>{recurrence.label}</option>
                  ))}
                </select>
                <div className="mt-3 p-3 bg-sky-50 rounded-md text-[13px] text-blue-800">
                  This survey will be automatically sent {recurrencePattern === "weekly" ? "every week" :
                    recurrencePattern === "monthly" ? "every month" :
                      recurrencePattern === "quarterly" ? "every quarter" :
                        recurrencePattern === "biannual" ? "twice a year" : "annually"}.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Target Audience</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {targetAudiences.map(audience => (
              <div
                key={audience.id}

                onClick={() => !isViewMode && setSelectedAudience(audience.id)}
              >
                <div className="text-center">
                  <div className="font-medium mb-1">{audience.label}</div>
                  <div className="text-xs text-slate-500">{audience.count} employees</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Bell size={20} />Distribution & Participation Tracking</h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="text-3xl font-bold text-blue-500 mb-2">0</div>
            <div className="text-sm text-slate-500 mb-1">Total Recipients</div>
            <div className="text-xs text-emerald-500">0% target audience</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="text-3xl font-bold text-emerald-500 mb-2">0</div>
            <div className="text-sm text-slate-500 mb-1">Emails Sent</div>
            <div className="text-xs text-slate-500">0% delivery rate</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="text-3xl font-bold text-amber-500 mb-2">0</div>
            <div className="text-sm text-slate-500 mb-1">Opened</div>
            <div className="text-xs text-emerald-500">0% open rate</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="text-3xl font-bold text-purple-500 mb-2">0</div>
            <div className="text-sm text-slate-500 mb-1">Started</div>
            <div className="text-xs text-amber-500">0% start rate</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
          <div className="flex justify-between items-center mb-4">
            <h5 className="m-0 text-base font-semibold">Survey Completion Status</h5>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block">
              {Math.round(0)}% Completion Rate
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-md text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">0</div>
              <div className="text-xs text-slate-500">Completed</div>
            </div>
            <div className="p-3 bg-white rounded-md text-center">
              <div className="text-2xl font-bold text-amber-500 mb-1">0</div>
              <div className="text-xs text-slate-500">In Progress</div>
            </div>
            <div className="p-3 bg-white rounded-md text-center">
              <div className="text-2xl font-bold text-red-500 mb-1">0</div>
              <div className="text-xs text-slate-500">Not Started</div>
            </div>
            <div className="p-3 bg-white rounded-md text-center">
              <div className="text-2xl font-bold text-slate-500 mb-1">0</div>
              <div className="text-xs text-slate-500">Bounced</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Reminder Status</span>
              <span className="text-sm text-slate-500">0 of 0 reminders sent</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-sm overflow-hidden">
              <div className="w-0 h-full bg-blue-500 rounded-sm"></div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={() => setShowLaunchModal(true)}
            disabled={isViewMode}
          >
            <Send size={16} /> Launch Survey Now
          </button>

          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => setShowScheduleModal(true)}
            disabled={isViewMode}
          >
            <Calendar size={16} /> Schedule Campaign
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => setShowReminderModal(true)}
            disabled={isViewMode}
          >
            <BellRing size={16} /> Send Reminders
          </button>

          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={handleShareSurvey}
          >
            <Share2 size={16} /> Share Link
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={handleGenerateQRCode}
          >
            <QrCodeIcon size={16} /> Generate QR
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="fade-in">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <BarChart3 size={20} />
            {analysisView === "standard" ? "Survey Analytics Dashboard" : "BSC Performance Dashboard"}
          </h4>
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={handleToggleAnalysisView}
            >
              {analysisView === "standard" ? (
                <>
                  <Target size={16} /> Switch to BSC View
                </>
              ) : (
                <>
                  <BarChart3 size={16} /> Switch to Standard View
                </>
              )}
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={() => setShowExportModal(true)}
            >
              <DownloadCloud size={16} /> Export Data
            </button>
          </div>
        </div>

        {analysisView === "bsc" ? (
          <>
            {/* BSC Perspective Selection */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  className="text-xs px-3 py-1.5"
                  onClick={() => handlePerspectiveChange("all")}
                >
                  All Perspectives
                </button>
                {bscPerspectives.map(perspective => (
                  <button
                    key={perspective.id}
                    className="text-sm"
                    onClick={() => handlePerspectiveChange(perspective.id)}
                  >
                    {perspective.name} ({perspective.weight}%)
                  </button>
                ))}
              </div>
            </div>

            {/* BSC Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
              {bscPerspectives.map(perspective => {
                const metric = bscMetrics[perspective.id];
                const Icon = perspective.icon;
                return (
                  <div key={perspective.id}
                    className={`border-[${selectedPerspective === perspective.id ? perspective.color : "transparent"}] bg-[${selectedPerspective === perspective.id ? perspective.color + "10" : "white"}]`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon size={20} color={perspective.color} />
                      <div className={`text-sm font-semibold text-[${perspective.color}]`}>
                        {perspective.name}
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-1 text-[${perspective.color}]`}>
                      {metric.score}
                    </div>
                    <div className="text-sm text-slate-500 mb-1">Performance Score</div>
                    <div className={`text-xs ${metric.trend === "up" ? "text-emerald-500" : metric.trend === "down" ? "text-red-500" : "text-slate-500"}`}>
                      {metric.trend === "up" ? "↑ 5% from last quarter" : metric.trend === "down" ? "↓ 3% from last quarter" : "↔ No change"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BSC Correlation Matrix */}
            <div className="my-6">
              <h5 className="text-base font-semibold text-slate-800 m-0 mb-4">Perspective Correlation Matrix</h5>
              <div className="overflow-x-auto">
                <table className="border-collapse w-full">
                  <thead>
                    <tr>
                      <th className="p-2 bg-slate-50"></th>
                      {bscCorrelationData.perspectives.map(perspective => (
                        <th key={perspective} className="p-2 bg-slate-50 text-center">
                          {perspective}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bscCorrelationData.correlations.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="p-2 bg-slate-50 font-medium">
                          {bscCorrelationData.perspectives[rowIndex]}
                        </td>
                        {row.map((correlation, colIndex) => (
                          <td
                            key={colIndex}
                            className={`p-3 text-center font-semibold ${correlation > 0.7 ? "text-white" : "text-slate-800"}`}
                          >
                            {correlation.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Note: Higher correlation values indicate stronger relationships between perspectives
              </div>
            </div>

            {/* BSC Objectives Progress */}
            {bscObjectives.length > 0 && (
              <div className="mt-6">
                <h5 className="text-base font-semibold text-slate-800 m-0 mb-4">Strategic Objectives Progress</h5>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left p-3 font-medium text-slate-700">Objective</th>
                        <th className="text-left p-3 font-medium text-slate-700">Perspective</th>
                        <th className="text-left p-3 font-medium text-slate-700">KPIs</th>
                        <th className="text-left p-3 font-medium text-slate-700">Progress</th>
                        <th className="text-left p-3 font-medium text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bscObjectives.map(obj => {
                        const progress = Math.floor(Math.random() * 100);
                        return (
                          <tr key={obj.id} className="border-b border-slate-100">
                            <td className="p-3 font-medium">{obj.name}</td>
                            <td className="p-3">
                              <span className="text-sm">
                                {bscPerspectives.find(p => p.id === obj.perspective)?.name}
                              </span>
                            </td>
                            <td className="p-3">{obj.kpis.length}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-[100px] h-2 bg-slate-200 rounded-sm overflow-hidden">
                                  <div className={`h-full rounded-sm ${progress >= 70 ? "bg-emerald-500" : progress >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                                  ></div>
                                </div>
                                <span className="text-sm">{progress}%</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-sm">
                                {progress >= 70 ? "On Track" : progress >= 40 ? "Needs Attention" : "At Risk"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Standard Analytics View */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {analyticsData.responseRate}%
                </div>
                <div className="text-sm text-slate-500 mb-1">Response Rate</div>
                <div className="text-xs text-emerald-500"></div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="text-3xl font-bold text-emerald-500 mb-2">
                  {analyticsData.completionRate}%
                </div>
                <div className="text-sm text-slate-500 mb-1">Completion Rate</div>
                <div className="text-xs text-emerald-500"></div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {analyticsData.averageNPS}
                </div>
                <div className="text-sm text-slate-500 mb-1">Average NPS Score</div>
                <div className={`text-xs ${analyticsData.averageNPS >= 50 ? "text-emerald-500" : "text-amber-500"}`}>
                  {analyticsData.averageNPS >= 50 ? "Excellent" : analyticsData.averageNPS >= 0 ? "Good" : "Needs Improvement"}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="text-3xl font-bold text-amber-500 mb-2">
                  {analyticsData.totalResponses}
                </div>
                <div className="text-sm text-slate-500 mb-1">Total Responses</div>
                <div className="text-xs text-slate-500">Out of 0 recipients</div>
              </div>
            </div>
          </>
        )}
      </div>

      {analysisView === "standard" && (
        <>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><PieChart size={20} />Department Comparison</h4>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-3 font-medium text-slate-700">Department</th>
                    <th className="text-center p-3 font-medium text-slate-700">Response Rate</th>
                    <th className="text-center p-3 font-medium text-slate-700">Satisfaction Score</th>
                    <th className="text-center p-3 font-medium text-slate-700">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.departmentComparison.map(dept => (
                    <tr key={dept.department} className="border-b border-slate-100">
                      <td className="p-3 font-medium">{dept.department}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-sm font-semibold">{dept.responseRate}%</div>
                          <div className="w-[60px] h-1.5 bg-slate-200 rounded-[3px] overflow-hidden">
                            <div className={`h-full bg-blue-500 rounded-[3px] w-[${dept.responseRate}%]`}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className={`inline-block px-3 py-1 rounded-full font-semibold ${dept.satisfaction >= 4 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {dept.satisfaction}/5
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <TrendingUp size={16} color={dept.responseRate > 85 ? "#10b981" : "#f59e0b"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><LineChart size={20} />Trend Analysis</h4>

            <div className="flex justify-between items-center mb-5">
              <div>
                <div className="text-sm text-slate-500">Engagement Score Trend</div>
                <div className="text-2xl font-semibold">0/5</div>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download size={16} /> Export Data
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={handleFilterAnalytics}
                >
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            <div className="flex h-[200px] items-end gap-5 py-5 border-t border-slate-200">
              {analyticsData.trendData.map((month, index) => {
                const isMax = month.engagement === maxEngagement;
                const isMin = month.engagement === minEngagement;

                return (
                  <div key={month.month} className="flex-1 text-center">
                    <div
                      title={`Engagement: ${month.engagement}\nResponse Rate: ${month.responseRate}%`}
                      className={`relative mb-2 transition-all duration-300 ease-in rounded-t-md ${isMax ? "ring-2 ring-green-500" : isMin ? "ring-2 ring-red-500" : ""}`}
                    >
                      {(isMax || isMin) && (
                        <div
                          className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold ${isMax ? "text-green-600" : "text-red-600"}`}
                        >
                          {isMax ? "▲ Peak" : "▼ Low"}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-slate-500">
                      {month.month}
                    </div>

                    <div className="text-sm font-semibold">
                      {month.engagement}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><MessageSquare size={20} />Sentiment Analysis</h4>
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={() => {
                setExportType("pdf");
                setShowExportModal(true);
              }}
            >
              <File size={16} /> Export PDF
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => {
                setExportType("excel");
                setShowExportModal(true);
              }}
            >
              <FileSpreadsheet size={16} /> Export Excel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <h5 className="text-base font-semibold text-slate-800 m-0 mb-4">Word Cloud</h5>
            <div className="bg-slate-50 p-6 rounded-lg min-h-[200px] flex flex-wrap gap-2 items-center justify-center">
              {[].map(word => (
                <span key={word}
                  className={`text-[${Math.random() * 20 + 14}px] opacity-[${Math.random() * 0.5 + 0.5}]`}>
                  {word}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-base font-semibold text-slate-800 m-0 mb-4">Sentiment Breakdown</h5>
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Positive</span>
                <span className="text-sm font-semibold text-emerald-500">0%</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-md overflow-hidden">
                <div className="w-0 h-full bg-emerald-500 rounded-md"></div>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Neutral</span>
                <span className="text-sm font-semibold text-slate-500">0%</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-md overflow-hidden">
                <div className="w-0 h-full bg-slate-500 rounded-md"></div>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <span className="text-sm">Negative</span>
                <span className="text-sm font-semibold text-red-500">0%</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-md overflow-hidden">
                <div className="w-0 h-full bg-red-500 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="fade-in">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><BookOpen size={20} />Survey Templates</h4>

        <div className="mb-6">
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* BSC Templates Section */}
        <div className="mb-8">
          <h5 className="flex items-center gap-2 text-base font-semibold text-slate-800 mb-4">
            <Target size={18} /> Balanced Scorecard Templates
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {bscSurveyTemplates.map(template => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm p-3 flex flex-col h-full cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={24} color="#0ea5e9" />
                    </div>
                    <div>
                      <div className="font-semibold text-base">{template.name}</div>
                      <div className="text-[13px] text-slate-500">
                        {template.questions} questions • {template.estimatedTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center flex-wrap gap-2 mt-auto pt-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block bg-sky-100 text-sky-700 whitespace-nowrap">
                      {template.perspectives[0] === "all" ? "Multi-Perspective" :
                        bscPerspectives.find(p => p.id === template.perspectives[0])?.name}
                    </span>
                    <button
                      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-blue-600 transition hover:bg-slate-50 whitespace-nowrap flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template.id);
                      }}
                    >
                      <Copy size={12} /> Use Template
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Standard Templates Section */}
        <div>
          <h5 className="flex items-center gap-2 text-base font-semibold text-slate-800 mb-4">
            <Users size={18} /> Standard Templates
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {surveyTemplates.map(template => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm p-3 flex flex-col h-full cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={24} color="#3b82f6" />
                    </div>
                    <div>
                      <div className="font-semibold text-base">{template.name}</div>
                      <div className="text-[13px] text-slate-500">
                        {template.questions} questions • {template.estimatedTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center flex-wrap gap-2 mt-auto pt-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block bg-emerald-100 text-emerald-800 whitespace-nowrap">
                      {template.usage}
                    </span>
                    <button
                      className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-blue-600 transition hover:bg-slate-50 whitespace-nowrap flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseTemplate(template.id);
                      }}
                    >
                      <Copy size={12} /> Use Template
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuestionBankSection = () => (
    <div className="fade-in">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
        <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4"><Database size={20} />Question Bank Management</h4>

        {/* Filters and Controls */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search questions by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={() => {
                setEditingQuestion(null);
                setNewQuestionText("");
                setNewQuestionType("rating");
                setNewQuestionCategory("");
                setNewQuestionTags([]);
                setTagInput("");
                setShowEditQuestionModal(true);
              }}
            >
              <Plus size={16} /> Add New Question
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Category:</span>
            <select
              className="text-sm"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== "all").map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Type:</span>
            <select
              className="text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {questionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              className="text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="used">Most Used</option>
              <option value="recent">Recently Used</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Perspective:</span>
            <select
              className="text-sm"
              value={selectedPerspective}
              onChange={(e) => setSelectedPerspective(e.target.value)}
            >
              <option value="all">All Perspectives</option>
              <option value="bsc">BSC Questions Only</option>
              {bscPerspectives.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Question Count */}
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm text-slate-500">
            Showing {filteredQuestions.length} questions
          </span>
          <span className="text-sm text-blue-500 font-medium">
            Total: {questionBank.length + bscQuestionBank.length} questions in bank
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-3 font-medium text-slate-700">Question</th>
                <th className="text-left p-3 font-medium text-slate-700">Type</th>
                <th className="text-left p-3 font-medium text-slate-700">Category</th>
                <th className="text-left p-3 font-medium text-slate-700">Perspective</th>
                <th className="text-left p-3 font-medium text-slate-700">Times Used</th>
                <th className="text-left p-3 font-medium text-slate-700">Last Used</th>
                <th className="text-left p-3 font-medium text-slate-700">Tags</th>
                <th className="text-left p-3 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map(q => (
                <tr key={q.id} className="border-b border-slate-100">
                  <td className="p-3 font-medium">{q.question}</td>
                  <td className="p-3">
                    <span className="text-sm">
                      {q.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block border border-slate-200 bg-slate-100 text-slate-700">{q.category}</span>
                  </td>
                  <td className="p-3">
                    {q.perspective ? (
                      <span className="text-sm">
                        {bscPerspectives.find(p => p.id === q.perspective)?.name}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold inline-block border border-slate-200 bg-slate-100 text-slate-700">General</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-center">{q.used || 0}</td>
                  <td className="p-3 text-xs text-slate-500">
                    {q.lastUsed || "Never"}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {q.tags && q.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="text-sm"
                        onClick={() => handleAddFromQuestionBank(q)}
                        title="Add to current survey"
                      >
                        <Plus size={12} /> Add
                      </button>
                      <button
                        className="text-sm"
                        onClick={() => handleEditQuestion(q)}
                        title="Edit question"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        className="text-sm"
                        onClick={() => handleDuplicateQuestionInBank(q)}
                        title="Duplicate question"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        className="text-sm"
                        onClick={() => handleDeleteQuestionFromBank(q)}
                        title="Delete question"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center p-10 text-slate-500">
            <Database size={48} className="mb-4 opacity-50 mx-auto" />
            <p>No questions found matching your filters.</p>
            <button
              className="text-sm"
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("all");
                setFilterType("all");
                setSelectedPerspective("all");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderPreviewModal = () => {
    if (!showPreview) return null;

    const answeredQuestions = Object.keys(previewResponses).length;
    const totalQuestions = questions.length;
    const progressPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    return (
      <div className={`fixed inset-0 flex items-center justify-center z-[4000] ${isPreviewFullscreen ? "bg-white p-0" : "bg-black/50 p-5"}`}>
        <div className={`bg-white overflow-auto relative ${isPreviewFullscreen ? "p-0 rounded-none max-w-full w-full max-h-screen" : "p-6 rounded-xl max-w-[800px] w-[90%] max-h-[90vh]"}`}>
          {/* Preview Header */}
          <div className={`flex justify-between items-center mb-5 pb-4 border-b border-slate-200 bg-white z-10 ${isPreviewFullscreen ? "sticky top-0" : "static"}`}>
            <div>
              <h4 className="m-0 text-xl font-semibold">Survey Preview</h4>
              <p className="mt-1 mb-0 text-sm text-slate-500">
                Test how your survey will appear to participants
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
                title={isPreviewFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isPreviewFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={handleResetPreview}
                title="Reset responses"
              >
                <RefreshCw size={16} />
              </button>
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setShowPreview(false)}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-blue-500 font-semibold">
                {answeredQuestions}/{totalQuestions} questions ({progressPercentage}%)
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-sm overflow-hidden">
              <div className={`h-full bg-blue-500 rounded-sm transition-[width] duration-300 ease-in w-[${progressPercentage}%]`}></div>
            </div>
          </div>

          {/* Survey Preview Content */}
          <div className="bg-slate-50 p-6 rounded-lg">
            {/* Survey Header */}
            <div className="text-center mb-8">
              <h3 className="mb-3 text-2xl font-semibold">
                {surveyTitle || "Survey Title"}
              </h3>
              {selectedPerspective !== "all" && (
                <div className="px-4 py-2 rounded-full inline-block mb-4 text-sm font-medium"
                  className={`bg-[${bscPerspectives.find(p => p.id === selectedPerspective)?.color}20] text-[${bscPerspectives.find(p => p.id === selectedPerspective)?.color}]`}>
                  {bscPerspectives.find(p => p.id === selectedPerspective)?.name} Perspective
                </div>
              )}
              <p className="text-slate-500 text-base leading-relaxed max-w-[600px] mx-auto">
                {surveyDescription || "Survey description goes here. This is where you explain the purpose of the survey to participants."}
              </p>

              {/* Survey Info */}
              <div className="flex justify-center gap-6 mt-5 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span>Estimated time: {Math.ceil(questions.length * 0.5)} minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText size={16} />
                  <span>{questions.length} questions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={16} />
                  <span>{surveyVisibility === "anonymous" ? "Anonymous" : "Identified"}</span>
                </div>
              </div>
            </div>

            {/* Questions */}
            {questions.length > 0 ? (
              <div>
                {questions.map((q, index) => (
                  <div key={q.id} className="text-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-base mb-1">
                              {q.question || "Your question here"}
                            </div>
                            {q.required && (
                              <span className="text-xs text-red-500 font-medium">
                                * Required
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Response Indicators */}
                        {previewResponses[q.id] && (
                          <div className="px-3 py-2 bg-emerald-100 rounded-md mb-3 inline-flex items-center gap-1.5">
                            <CheckCircle size={14} color="#059669" />
                            <span className="text-xs text-emerald-600 font-medium">
                              Answered: {typeof previewResponses[q.id] === 'object'
                                ? JSON.stringify(previewResponses[q.id])
                                : previewResponses[q.id]}
                            </span>
                          </div>
                        )}

                        {/* Question type specific inputs */}
                        {q.type === "rating" && (
                          <div className="mt-4">
                            <div className="text-sm mb-3 text-slate-700">
                              Select a rating from 1 to {q.scale}:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Array.from({ length: q.scale }).map((_, i) => (
                                <button
                                  key={i}
                                  className="text-sm"
                                  onClick={() => handlePreviewResponse(q.id, i + 1)}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-slate-500">
                              <span>Poor</span>
                              <span>Excellent</span>
                            </div>
                          </div>
                        )}

                        {q.type === "nps" && (
                          <div className="mt-4">
                            <div className="text-sm mb-3 text-slate-700">
                              How likely are you to recommend? (0 = Not likely, 10 = Extremely likely):
                            </div>
                            <div className="flex justify-between flex-wrap">
                              {Array.from({ length: 11 }).map((_, i) => (
                                <button
                                  key={i}
                                  className="text-sm"
                                  onClick={() => handlePreviewResponse(q.id, i)}
                                >
                                  {i}
                                </button>
                              ))}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-slate-500">
                              <span>Not at all likely</span>
                              <span>Extremely likely</span>
                            </div>

                            {/* NPS Categories */}
                            {previewResponses[q.id] !== undefined && (
                              <div className="mt-4">
                                <div className={`p-3 rounded-md text-center font-medium ${previewResponses[q.id] <= 6 ? "bg-amber-100 text-amber-800" : previewResponses[q.id] <= 8 ? "bg-yellow-100 text-yellow-800" : "bg-emerald-100 text-emerald-800"}`}>
                                  {previewResponses[q.id] <= 6 ? "Detractor" :
                                    previewResponses[q.id] <= 8 ? "Passive" : "Promoter"}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {q.type === "multiple" && (
                          <div className="mt-4">
                            <div className="text-sm mb-3 text-slate-700">
                              Select all that apply:
                            </div>
                            <div>
                              {q.options && q.options.map((option, optIndex) => (
                                <label key={optIndex} className={`flex items-center p-3 mb-2 rounded-md cursor-pointer transition-all duration-200 border ${previewResponses[q.id]?.includes(option) ? "bg-blue-50 border-blue-500" : "bg-white border-gray-300"}`}>
                                  <input
                                    type="checkbox"
                                    checked={previewResponses[q.id]?.includes(option) || false}
                                    onChange={(e) => {
                                      const currentResponses = previewResponses[q.id] || [];
                                      let newResponses;
                                      if (e.target.checked) {
                                        newResponses = [...currentResponses, option];
                                      } else {
                                        newResponses = currentResponses.filter(r => r !== option);
                                      }
                                      handlePreviewResponse(q.id, newResponses);
                                    }}
                                    className="mr-3"
                                  />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {q.type === "open" && (
                          <div className="mt-4">
                            <div className="text-sm mb-3 text-slate-700">
                              Your response:
                            </div>
                            <textarea
                              className="text-sm"
                              placeholder="Type your answer here..."
                              value={previewResponses[q.id] || ""}
                              onChange={(e) => handlePreviewResponse(q.id, e.target.value)}
                            />
                            <div className="text-xs text-slate-500 mt-1">
                              Minimum 10 characters recommended
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Question Metadata */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200">
                      <div className="flex gap-3 text-xs text-slate-500">
                        <span className="text-sm">
                          {q.type.charAt(0).toUpperCase() + q.type.slice(1)}
                        </span>
                        {q.required && (
                          <span className="text-sm">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Question {index + 1} of {questions.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-15 text-slate-500">
                <FileText size={64} className="mb-4 opacity-50 mx-auto" />
                <p className="text-lg mb-2">No questions added yet</p>
                <p className="text-sm">Add questions to see the preview</p>
              </div>
            )}

            {/* Survey Footer */}
            {questions.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <div className="mb-5">
                  <div className="text-sm text-slate-500 mb-2">
                    {answeredQuestions === totalQuestions ? (
                      <span className="text-emerald-500 font-medium">
                        ✓ All questions answered! Ready to submit.
                      </span>
                    ) : (
                      <span>
                        {totalQuestions - answeredQuestions} question{totalQuestions - answeredQuestions !== 1 ? 's' : ''} remaining
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    onClick={handleResetPreview}
                  >
                    <RefreshCw size={16} /> Reset All Responses
                  </button>
                  <button
                    className="text-sm"
                    onClick={handleSubmitPreview}
                    disabled={answeredQuestions !== totalQuestions}
                  >
                    <CheckCircle size={16} /> Submit Survey
                  </button>
                </div>

                <div className="mt-5 p-3 bg-sky-50 rounded-lg text-xs text-sky-700 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell size={14} />
                    <span className="font-medium">Preview Mode</span>
                  </div>
                  <p className="m-0">
                    This is a preview of how your survey will appear to participants. Responses are not saved.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderExportModal = () => (
    <ExportSurveyModal
      isOpen={showExportModal}
      onClose={() => setShowExportModal(false)}
      questions={questions} surveyTitle={surveyTitle} selectedSurvey={selectedSurvey} exportType={exportType} exportData={exportData} setExportType={setExportType} setExportData={setExportData} handleExport={handleExport}
    />
  );

  const renderEditQuestionModal = () => (
    <EditSurveyQuestionModal
      isOpen={showEditQuestionModal}
      onClose={() => setShowEditQuestionModal(false)}
      editingQuestion={editingQuestion} newQuestionText={newQuestionText} newQuestionType={newQuestionType} newQuestionCategory={newQuestionCategory} newQuestionTags={newQuestionTags} tagInput={tagInput} bscPerspectives={bscPerspectives} setEditingQuestion={setEditingQuestion} setNewQuestionText={setNewQuestionText} setNewQuestionType={setNewQuestionType} setNewQuestionCategory={setNewQuestionCategory} setTagInput={setTagInput} questionTypes={questionTypes}
      categories={categories}
      handleAddTag={handleAddTag}
      handleRemoveTag={handleRemoveTag}
      handleSaveEditedQuestion={handleSaveEditedQuestion}
      handleAddNewQuestionToBank={handleAddNewQuestionToBank}
    />
  );

  const renderViewModal = () => (
    <Modal
      title={`View Survey: ${selectedSurvey?.title || 'Survey'}`}
      isOpen={showViewModal}
      onClose={() => {
        setShowViewModal(false);
        setIsViewMode(false);
        setSelectedSurvey(null);
      }}
      size="lg"
    >
      {selectedSurvey && (
        <div>
          <div className="mb-5">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Survey Title</label>
              <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200">
                {selectedSurvey.title}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200 min-h-[60px]">
                {selectedSurvey.description || "No description"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                <div className={`px-3 py-1.5 rounded-full inline-block font-medium ${selectedSurvey.status === "active" ? "bg-emerald-100 text-emerald-800" : selectedSurvey.status === "completed" ? "bg-blue-100 text-blue-800" : selectedSurvey.status === "paused" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"}`}>
                  {selectedSurvey.status}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Created</label>
                <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200">
                  {selectedSurvey.createdAt}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Questions</label>
                <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200">
                  {Array.isArray(selectedSurvey.questions) ? selectedSurvey.questions.length : selectedSurvey.questions || 0}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Responses</label>
                <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200">
                  {selectedSurvey.responses || 0}
                </div>
              </div>
            </div>

            {selectedSurvey.perspective && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">BSC Perspective</label>
                <div className="px-3 py-1.5 rounded-full inline-block font-medium"
                  className={`bg-[${bscPerspectives.find(p => p.id === selectedSurvey.perspective)?.color}20] text-[${bscPerspectives.find(p => p.id === selectedSurvey.perspective)?.color}]`}>
                  {bscPerspectives.find(p => p.id === selectedSurvey.perspective)?.name}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => {
                setShowViewModal(false);
                setIsViewMode(false);
                setSelectedSurvey(null);
              }}
            >
              Close
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={() => {
                setIsViewMode(false);
                setShowViewModal(false);
                setActiveTab("create");
              }}
            >
              <Edit size={16} /> Edit Survey
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  const tabs = [
    { id: "create", label: "Create Survey", icon: Plus },
    { id: "distribute", label: "Distribute", icon: Send },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "templates", label: "Templates", icon: BookOpen },
    { id: "questionbank", label: "Question Bank", icon: Database }
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Survey & Pulse Check Management</h1>
          <p className="text-slate-500 text-sm">Create, distribute, and analyze employee surveys and pulse checks</p>
        </div>

        <div className="flex gap-3">
          <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
              <Bell size={20} />
            </button>
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadNotifications}
              </span>
            )}
          </div>

          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} /> {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-transparent bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
            onClick={() => setShowNewSurveyModal(true)}
          >
            <Plus size={16} /> New Survey
          </button>
        </div>
      </div>

      {showNotifications && (
        <div className="absolute right-6 top-24 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-[100] overflow-hidden">
          <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <span className="font-semibold text-sm">Notifications</span>
            <button className="text-xs text-blue-600 font-semibold" onClick={handleMarkAllNotificationsRead}>Mark all read</button>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-3 border-b border-slate-100 cursor-pointer transition ${notification.read ? "bg-white hover:bg-slate-50" : "bg-blue-50/50 hover:bg-blue-50"}`}
                onClick={() => handleToggleNotification(notification.id)}
              >
                <div className="text-sm text-slate-800">{notification.message}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {notification.type === "success" ? "✅" : notification.type === "warning" ? "⚠️" : "ℹ️"} {notification.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Surveys"
          value={surveys.length}
          icon="heroicons:chart-bar"
          color="blue"
          description="Currently running surveys"
        />
        <StatCard
          title="Total Responses"
          value={1245}
          icon="heroicons:users"
          color="green"
          description="Across all surveys"
        />
        <StatCard
          title="Avg. Response Rate"
          value="78%"
          icon="heroicons:arrow-trending-up"
          color="purple"
          description="Target: 70%"
        />
        <StatCard
          title="Templates"
          value={12}
          icon="heroicons:document-duplicate"
          color="orange"
          description="Available templates"
        />
      </div>

      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <TabIcon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "create" && renderCreateSurvey()}
      {activeTab === "distribute" && renderDistributeSurvey()}
      {activeTab === "analytics" && renderAnalytics()}
      {activeTab === "templates" && renderTemplates()}
      {activeTab === "questionbank" && renderQuestionBankSection()}

      {/* Action Buttons */}
      {(activeTab === "create" || activeTab === "distribute") && !isViewMode && (
        <div className="flex flex-wrap justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => setShowDraftModal(true)}
          >
            <Save size={16} /> Save as Draft
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-blue-600 transition hover:bg-slate-50"
            onClick={() => setShowPreview(true)}
          >
            <Eye size={16} /> Preview
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={() => setShowLaunchModal(true)}
          >
            <Send size={16} /> Launch Survey
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
            onClick={() => setShowExportModal(true)}
          >
            <Download size={16} /> Export
          </button>
        </div>
      )}

      {/* All Modals */}
      <SaveDraftModal
        isOpen={showDraftModal}
        onClose={() => setShowDraftModal(false)}
        questions={questions} surveyTitle={surveyTitle} draftNote={draftNote} bscPerspectives={bscPerspectives} selectedPerspective={selectedPerspective} setDraftNote={setDraftNote} handleSaveDraft={handleSaveDraft}
      />

      <CreateNewSurveyModal
        isOpen={showNewSurveyModal}
        onClose={() => setShowNewSurveyModal(false)}
        questions={questions} surveyTitle={surveyTitle} surveyDescription={surveyDescription} isViewMode={isViewMode} bscPerspectives={bscPerspectives} selectedPerspective={selectedPerspective} setSurveyTitle={setSurveyTitle} setSurveyDescription={setSurveyDescription} setIsViewMode={setIsViewMode} setSelectedPerspective={setSelectedPerspective}
        handleNewSurvey={handleNewSurvey}
      />

      <AddSurveyQuestionModal
        isOpen={showAddQuestionModal}
        onClose={() => setShowAddQuestionModal(false)}
        searchQuery={searchQuery} questionBank={questionBank} bscQuestionBank={bscQuestionBank} bscPerspectives={bscPerspectives} setSearchQuery={setSearchQuery} handleAddQuestion={handleAddQuestion} questionTypes={questionTypes}

        handleAddFromQuestionBank={handleAddFromQuestionBank}
      />

      <LaunchSurveyModal
        isOpen={showLaunchModal}
        onClose={() => setShowLaunchModal(false)}
        launchAudience={launchAudience} launchNotify={launchNotify} bscPerspectives={bscPerspectives} selectedPerspective={selectedPerspective} setLaunchAudience={setLaunchAudience} setLaunchNotify={setLaunchNotify} handleLaunchSurvey={handleLaunchSurvey}
      />

      <ScheduleCampaignModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        scheduling={scheduling} scheduleDate={scheduleDate} scheduleTime={scheduleTime} recurrencePattern={recurrencePattern} setScheduling={setScheduling} setScheduleDate={setScheduleDate} setScheduleTime={setScheduleTime} setRecurrencePattern={setRecurrencePattern}
        handleScheduleSurvey={handleScheduleSurvey}
      />

      <SendReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        reminderAudience={reminderAudience} reminderMessage={reminderMessage} reminderChannel={reminderChannel} setReminderAudience={setReminderAudience} setReminderMessage={setReminderMessage} setReminderChannel={setReminderChannel}
        handleSendReminders={handleSendReminders}
      />

      <SurveyQRCodeModal
        isOpen={showQRCodeModal}
        onClose={() => setShowQRCodeModal(false)}
        shareLink={shareLink}
        handleShareSurvey={handleShareSurvey}
      />

      {/* BSC Modal */}
      <AddStrategicObjectiveModal
        isOpen={showBscModal}
        onClose={() => setShowBscModal(false)}
        bscPerspectives={bscPerspectives} selectedPerspective={selectedPerspective} strategicAlignment={strategicAlignment} setSelectedPerspective={setSelectedPerspective} setStrategicAlignment={setStrategicAlignment} handleAddBscObjective={handleAddBscObjective}
      />

      {/* Export Modal */}
      {renderExportModal()}

      {/* Edit Question Modal */}
      {renderEditQuestionModal()}

      {/* Preview Modal */}
      {renderPreviewModal()}

      {/* View Modal */}
      {renderViewModal()}

      <Modal
        title={statusModal.title}
        isOpen={statusModal.open}
        onClose={() => setStatusModal({ ...statusModal, open: false })}
      >
        <div className={`text-sm text-slate-700 mb-4 p-3 rounded-lg border ${statusModal.type === "success" ? "bg-emerald-100 border-emerald-500" : statusModal.type === "warning" ? "bg-amber-100 border-amber-500" : "bg-blue-100 border-blue-500"}`}>
          {statusModal.message}
        </div>

        <div className="flex justify-end">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
            onClick={() => setStatusModal({ ...statusModal, open: false })}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SurveysPulseChecks;