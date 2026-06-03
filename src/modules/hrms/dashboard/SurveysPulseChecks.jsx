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

const Modal = ({ title, isOpen, onClose, children, width = "600px" }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 3000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        width,
        maxHeight: "90vh",
        overflowY: "auto",
        padding: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "20px",
              color: "#666"
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SurveysPulseChecks = () => {
  // State declarations
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
  const [surveys, setSurveys] = useState([
    {
      id: 1,
      title: "Q1 Engagement Survey 2024",
      questions: 15,
      responses: 1087,
      status: "completed",
      createdAt: "2024-01-15",
      description: "Quarterly engagement survey for Q1 2024",
      audience: "all",
      visibility: "anonymous"
    },
    {
      id: 2,
      title: "Wellness Pulse Check",
      questions: 6,
      responses: 945,
      status: "active",
      createdAt: "2024-02-01",
      description: "Monthly wellness check for employees",
      audience: "all",
      visibility: "anonymous"
    }
  ]);

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

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Survey 'Q1 Engagement' has reached 85% response rate", type: "success", read: false, time: "2 hours ago" },
    { id: 2, message: "Exit Interview survey scheduled for tomorrow", type: "info", read: false, time: "1 day ago" },
    { id: 3, message: "Low response rate for Wellness Pulse Check", type: "warning", read: false, time: "3 days ago" }
  ]);

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

  // Question Bank Management State
  const [questionBank, setQuestionBank] = useState([
    { id: 1, question: "How satisfied are you with your current job role?", type: "rating", category: "engagement", used: 42, tags: ["engagement", "satisfaction"], lastUsed: "2024-03-15" },
    { id: 2, question: "Would you recommend our company as a great place to work?", type: "nps", category: "engagement", used: 38, tags: ["nps", "engagement"], lastUsed: "2024-03-10" },
    { id: 3, question: "What do you enjoy most about working here?", type: "open", category: "satisfaction", used: 35, tags: ["open-ended", "feedback"], lastUsed: "2024-03-12" },
    { id: 4, question: "How would you rate your work-life balance?", type: "rating", category: "wellness", used: 40, tags: ["wellness", "balance"], lastUsed: "2024-03-08" },
    { id: 5, question: "Do you feel supported by your manager?", type: "multiple", category: "management", used: 45, tags: ["management", "support"], lastUsed: "2024-03-14" },
    { id: 6, question: "What areas need improvement in your department?", type: "open", category: "improvement", used: 32, tags: ["improvement", "feedback"], lastUsed: "2024-03-05" },
    { id: 7, question: "Rate your satisfaction with company benefits:", type: "rating", category: "benefits", used: 28, tags: ["benefits", "compensation"], lastUsed: "2024-03-01" },
    { id: 8, question: "How clear are your career growth opportunities?", type: "rating", category: "growth", used: 30, tags: ["career", "growth"], lastUsed: "2024-03-03" }
  ]);

  const [bscQuestionBank, setBscQuestionBank] = useState([
    {
      id: 101,
      question: "How well do you understand our company's strategic objectives?",
      type: "rating",
      category: "strategic-alignment",
      perspective: "learning",
      used: 28,
      tags: ["strategy", "alignment"],
      lastUsed: "2024-03-10"
    },
    {
      id: 102,
      question: "Rate the effectiveness of our internal communication processes",
      type: "rating",
      category: "internal-process",
      perspective: "internal",
      used: 32,
      tags: ["communication", "process"],
      lastUsed: "2024-03-08"
    },
    {
      id: 103,
      question: "How well are customer needs being met by our current processes?",
      type: "rating",
      category: "customer-focus",
      perspective: "customer",
      used: 45,
      tags: ["customer", "satisfaction"],
      lastUsed: "2024-03-12"
    },
    {
      id: 104,
      question: "To what extent do you feel empowered to contribute to strategic goals?",
      type: "rating",
      category: "empowerment",
      perspective: "learning",
      used: 31,
      tags: ["empowerment", "strategy"],
      lastUsed: "2024-03-06"
    },
    {
      id: 105,
      question: "How effectively are resources allocated to strategic initiatives?",
      type: "rating",
      category: "resource-allocation",
      perspective: "financial",
      used: 24,
      tags: ["resources", "strategy"],
      lastUsed: "2024-03-04"
    }
  ]);

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

  // BSC State Variables
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

  // Initialize with current date/time for scheduling
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setScheduleDate(tomorrow.toISOString().split('T')[0]);
    setScheduleTime("09:00");

    // Load drafts from localStorage
    const savedDrafts = localStorage.getItem('surveyDrafts');
    if (savedDrafts) {
      try {
        setDrafts(JSON.parse(savedDrafts));
      } catch (e) {
        console.error("Error loading drafts:", e);
      }
    }

    // Load surveys from localStorage
    const savedSurveys = localStorage.getItem('surveys');
    if (savedSurveys) {
      try {
        setSurveys(JSON.parse(savedSurveys));
      } catch (e) {
        console.error("Error loading surveys:", e);
      }
    }

    // Load BSC objectives
    const savedBscObjectives = localStorage.getItem('bscObjectives');
    if (savedBscObjectives) {
      try {
        setBscObjectives(JSON.parse(savedBscObjectives));
      } catch (e) {
        console.error("Error loading BSC objectives:", e);
      }
    }

    // Load question banks
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

  // Save drafts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('surveyDrafts', JSON.stringify(drafts));
  }, [drafts]);

  // Save surveys to localStorage when they change
  useEffect(() => {
    localStorage.setItem('surveys', JSON.stringify(surveys));
  }, [surveys]);

  // Save BSC objectives
  useEffect(() => {
    localStorage.setItem('bscObjectives', JSON.stringify(bscObjectives));
  }, [bscObjectives]);

  // Save question banks
  useEffect(() => {
    localStorage.setItem('questionBank', JSON.stringify(questionBank));
    localStorage.setItem('bscQuestionBank', JSON.stringify(bscQuestionBank));
  }, [questionBank, bscQuestionBank]);

  // Data arrays
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

  // BSC Templates
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
    { id: "all", label: "All Employees", count: 1250 },
    { id: "department", label: "By Department", count: 450 },
    { id: "location", label: "By Location", count: 320 },
    { id: "role", label: "By Role", count: 280 },
    { id: "tenure", label: "By Tenure", count: 190 },
    { id: "custom", label: "Custom Group", count: 85 }
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
    responseRate: 87,
    completionRate: 91,
    averageNPS: 42,
    totalResponses: 1087,
    departmentComparison: [
      { department: "Engineering", responseRate: 92, satisfaction: 4.2 },
      { department: "Sales", responseRate: 85, satisfaction: 4.0 },
      { department: "Marketing", responseRate: 88, satisfaction: 4.3 },
      { department: "HR", responseRate: 95, satisfaction: 4.5 },
      { department: "Operations", responseRate: 82, satisfaction: 3.9 }
    ],
    trendData: [
      { month: "Jan", engagement: 4.1, responseRate: 84 },
      { month: "Feb", engagement: 4.2, responseRate: 86 },
      { month: "Mar", engagement: 4.3, responseRate: 87 },
      { month: "Apr", engagement: 4.4, responseRate: 89 },
      { month: "May", engagement: 4.3, responseRate: 87 }
    ]
  };

  // BSC Correlation Data
  const bscCorrelationData = {
    perspectives: ["Financial", "Customer", "Internal", "Learning"],
    correlations: [
      [1.0, 0.65, 0.72, 0.58],
      [0.65, 1.0, 0.81, 0.69],
      [0.72, 0.81, 1.0, 0.77],
      [0.58, 0.69, 0.77, 1.0]
    ]
  };

  const maxEngagement = Math.max(...analyticsData.trendData.map(m => m.engagement));
  const minEngagement = Math.min(...analyticsData.trendData.map(m => m.engagement));

  const barColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // purple
    "#ef4444", // red
    "#14b8a6"  // teal
  ];

  // Core Functionality Handlers
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

    // Set perspective for BSC templates
    if (template.perspectives && template.perspectives[0] !== "all") {
      setSelectedPerspective(template.perspectives[0]);
    }

    // Load appropriate questions based on template
    let templateQuestions = [];
    if (template.id.includes("bsc-")) {
      // Load BSC questions
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
      // Load standard questions
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
    
    // Update usage count in question bank
    if (question.perspective) {
      // BSC question
      setBscQuestionBank(prev => prev.map(q => 
        q.id === question.id ? { ...q, used: (q.used || 0) + 1, lastUsed: new Date().toISOString().split('T')[0] } : q
      ));
    } else {
      // Standard question
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

    // Reset form
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

  // Generate PDF Content
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

  // Download PDF
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

  // Generate Excel Content
  const generateExcelData = () => {
    const data = [];

    // Header
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

  // Download Excel
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

  // Combined export handler
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
      // Immediate launch
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

  // FIXED: Proper view survey functionality
  const handleViewSurvey = (survey) => {
    setSelectedSurvey(survey);
    setIsViewMode(true);
    setShowViewModal(true);

    // Load survey data into form
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

  // FIXED: Share link functionality
  const handleShareSurvey = () => {
    // Generate a unique link based on survey title and current timestamp
    const surveyId = selectedSurvey?.id || Date.now();
    const link = `https://survey.company.com/survey/${surveyId}/${surveyTitle.replace(/\s+/g, "-").toLowerCase()}`;
    setShareLink(link);

    // Try to copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link)
        .then(() => {
          showNotification("Survey link copied to clipboard", "success");
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          // Fallback for older browsers
          copyToClipboardFallback(link);
        });
    } else {
      // Fallback for older browsers
      copyToClipboardFallback(link);
    }
  };

  // Fallback clipboard function
  const copyToClipboardFallback = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
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

  // BSC Functions
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

  // Question Bank Management Functions
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
      // Update BSC question
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
      // Update standard question
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

  // FIXED: Add new question to bank function
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

    // Check if we should add to BSC question bank
    if (selectedPerspective !== "all" && selectedPerspective !== "bsc") {
      // Add to BSC question bank with perspective
      newQuestion.perspective = selectedPerspective;
      setBscQuestionBank(prev => [...prev, newQuestion]);
    } else {
      // Add to standard question bank
      setQuestionBank(prev => [...prev, newQuestion]);
    }

    // Reset form
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

  // Preview Functions
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

  // Filter and sort questions
  const filteredQuestions = [...questionBank, ...bscQuestionBank].filter(q => {
    // Filter by search query
    if (searchQuery && !q.question.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (filterCategory !== "all" && q.category !== filterCategory) {
      return false;
    }
    
    // Filter by type
    if (filterType !== "all" && q.type !== filterType) {
      return false;
    }
    
    // Filter by perspective
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
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
      color: white;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      min-width: 300px;
      max-width: 400px;
      font-family: 'Inter', sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Inline Styles
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
      alignItems: "center",
      position: "relative"
    },
    notificationsButton: {
      position: "relative",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      background: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    notificationsBadge: {
      position: "absolute",
      top: "-5px",
      right: "-5px",
      background: "#ef4444",
      color: "white",
      borderRadius: "50%",
      width: "18px",
      height: "18px",
      fontSize: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    notificationsPanel: {
      position: "absolute",
      top: "100%",
      right: 0,
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      width: "300px",
      maxHeight: "400px",
      overflow: "auto",
      zIndex: 1000
    },
    notificationItem: {
      padding: "12px",
      borderBottom: "1px solid #f3f4f6",
      cursor: "pointer",
      transition: "background 0.2s",
      background: "white"
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
    grid4Col: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
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
      fontSize: "14px",
      cursor: "text",
      boxSizing: "border-box"
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      minHeight: "80px",
      resize: "vertical",
      cursor: "text",
      boxSizing: "border-box"
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
    radioGroup: {
      display: "flex",
      gap: "16px",
      marginTop: "8px"
    },
    radioLabel: {
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
    successButton: {
      background: "#10b981",
      color: "white",
      borderColor: "#10b981"
    },
    warningButton: {
      background: "#f59e0b",
      color: "white",
      borderColor: "#f59e0b"
    },
    dangerButton: {
      background: "#ef4444",
      color: "white",
      borderColor: "#ef4444"
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
    card: {
      background: "white",
      padding: "16px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      marginBottom: "12px",
      cursor: "pointer",
      transition: "all 0.2s"
    },
    selectedCard: {
      borderColor: "#3b82f6",
      background: "#f0f9ff",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)"
    },
    questionCard: {
      background: "#f8fafc",
      padding: "16px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      marginBottom: "12px",
      position: "relative"
    },
    metricCard: {
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      textAlign: "center"
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
    searchBox: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
      width: "300px",
      cursor: "text"
    },
    previewContainer: {
      background: "#f9fafb",
      padding: "20px",
      borderRadius: "8px",
      border: "2px dashed #d1d5db",
      minHeight: "200px"
    },
    draftsList: {
      marginTop: "20px",
      paddingTop: "20px",
      borderTop: "1px solid #e5e7eb"
    },
    draftItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      marginBottom: "8px",
      background: "#f9fafb"
    },
    bscPerspectiveCard: {
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "8px",
      borderLeft: "4px solid"
    },
    exportPreview: {
      background: "#f9fafb",
      padding: "16px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      marginTop: "16px",
      maxHeight: "200px",
      overflowY: "auto",
      fontSize: "12px",
      fontFamily: "monospace"
    },
    tag: {
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 8px",
      borderRadius: "12px",
      fontSize: "10px",
      background: "#dbeafe",
      color: "#1e40af",
      marginRight: "4px",
      marginBottom: "4px"
    },
    previewQuestion: {
      marginBottom: "24px",
      padding: "20px",
      background: "white",
      borderRadius: "8px",
      border: "1px solid #e5e7eb"
    }
  };

  // Add CSS for animations
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
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .fade-in {
        animation: fadeIn 0.3s ease-out;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .slide-in {
        animation: slideIn 0.3s ease-out;
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .pulse {
        animation: pulse 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Render Functions
  const renderCreateSurvey = () => (
    <div className="fade-in">
      <div style={styles.sectionCard}>
        <h4 style={styles.sectionTitle}><Plus size={20} />Survey Creation</h4>

        <div style={styles.grid2Col}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Survey Title *</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Enter survey title"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              disabled={isViewMode}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>BSC Perspective (Optional)</label>
            <select
              style={styles.select}
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

        <div style={styles.grid2Col}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Visibility Mode</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  checked={surveyVisibility === "anonymous"}
                  onChange={() => !isViewMode && setSurveyVisibility("anonymous")}
                  disabled={isViewMode}
                />
                <span>Anonymous</span>
              </label>
              <label style={styles.radioLabel}>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Strategic Alignment</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {selectedPerspective !== "all" && (
                <span style={{
                  ...styles.chip,
                  background: bscPerspectives.find(p => p.id === selectedPerspective)?.color + "20",
                  color: bscPerspectives.find(p => p.id === selectedPerspective)?.color,
                  border: `1px solid ${bscPerspectives.find(p => p.id === selectedPerspective)?.color}`
                }}>
                  {bscPerspectives.find(p => p.id === selectedPerspective)?.name}
                </span>
              )}
              <button
                style={{ ...styles.button, ...styles.smallButton }}
                onClick={() => setShowBscModal(true)}
                disabled={isViewMode}
              >
                <Target size={12} /> Align Objectives
              </button>
            </div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Survey Description</label>
          <textarea
            style={styles.textarea}
            placeholder="Describe the purpose of this survey..."
            rows={3}
            value={surveyDescription}
            onChange={(e) => !isViewMode && setSurveyDescription(e.target.value)}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div style={styles.sectionCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h4 style={styles.sectionTitle}><FileText size={20} />Survey Questions ({questions.length})</h4>
          {!isViewMode && (
            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={handleToggleQuestionBank}
              >
                <BookOpen size={16} /> Question Bank
              </button>
              {questions.length > 0 && (
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={handleClearSurvey}
                >
                  <Trash2 size={16} /> Clear All
                </button>
              )}
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={() => setShowAddQuestionModal(true)}
              >
                <Plus size={16} /> Add Question
              </button>
            </div>
          )}
        </div>

        {showQuestionBank && !isViewMode && (
          <div style={{ marginBottom: "24px", animation: "fadeIn 0.3s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h5 style={{ ...styles.label, fontSize: "16px", margin: 0 }}>Question Types</h5>
              <input
                type="text"
                style={styles.searchBox}
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={styles.grid3Col}>
              {questionTypes.map(type => (
                <div
                  key={type.id}
                  style={styles.card}
                  onClick={() => handleAddQuestion(type.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "#dbeafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <type.icon size={20} color="#3b82f6" />
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>{type.label}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>{type.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedPerspective !== "all" && (
              <div style={{ marginTop: "24px" }}>
                <h5 style={{ ...styles.label, fontSize: "16px", marginBottom: "16px" }}>
                  <Target size={16} /> BSC Questions - {bscPerspectives.find(p => p.id === selectedPerspective)?.name}
                </h5>
                {bscQuestionBank
                  .filter(q => q.perspective === selectedPerspective)
                  .map(q => (
                    <div key={q.id} style={styles.questionCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "500", marginBottom: "4px" }}>{q.question}</div>
                          <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#6b7280" }}>
                            <span style={{
                              ...styles.chip,
                              background: bscPerspectives.find(p => p.id === q.perspective)?.color + "20",
                              color: bscPerspectives.find(p => p.id === q.perspective)?.color
                            }}>
                              {q.perspective}
                            </span>
                            <span style={styles.chip}>{q.type}</span>
                            <span style={styles.chip}>Used {q.used} times</span>
                          </div>
                        </div>
                        <button
                          style={{ ...styles.button, ...styles.smallButton }}
                          onClick={() => handleAddFromQuestionBank(q)}
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div style={{ marginTop: "24px" }}>
              <h5 style={{ ...styles.label, fontSize: "16px", marginBottom: "16px" }}>Question Bank</h5>
              {questionBank.map(q => (
                <div key={q.id} style={styles.questionCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "500", marginBottom: "4px" }}>{q.question}</div>
                      <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#6b7280" }}>
                        <span style={styles.chip}>{q.type}</span>
                        <span style={styles.chip}>{q.category}</span>
                        <span style={styles.chip}>Used {q.used} times</span>
                      </div>
                    </div>
                    <button
                      style={{ ...styles.button, ...styles.smallButton }}
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
              <div key={q.id} style={styles.questionCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "600", color: "#3b82f6" }}>Q{index + 1}</span>
                      <input
                        type="text"
                        style={{ ...styles.input, flex: 1 }}
                        placeholder="Enter your question here..."
                        value={q.question}
                        onChange={(e) => !isViewMode && handleQuestionChange(q.id, "question", e.target.value)}
                        disabled={isViewMode}
                      />
                    </div>

                    {/* Question type specific inputs */}
                    {q.type === "rating" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                        <span style={{ fontSize: "13px" }}>Scale:</span>
                        <select
                          style={{ ...styles.select, width: "100px" }}
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
                      <div style={{ marginTop: "12px" }}>
                        <div style={{ fontSize: "13px", marginBottom: "8px" }}>Options:</div>
                        {q.options.map((option, optIndex) => (
                          <div key={optIndex} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                            <input
                              type="text"
                              style={{ ...styles.input, flex: 1 }}
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
                                style={{ ...styles.button, ...styles.smallButton }}
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
                            style={{ ...styles.button, ...styles.outlineButton, ...styles.smallButton }}
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
                    <div style={styles.buttonGroup}>
                      <button
                        style={{ ...styles.button, ...styles.smallButton }}
                        onClick={() => handleRemoveQuestion(q.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <label style={{ ...styles.checkboxLabel, fontSize: "13px" }}>
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => !isViewMode && handleQuestionChange(q.id, "required", e.target.checked)}
                      disabled={isViewMode}
                    />
                    <span>Required question</span>
                  </label>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    {q.type.charAt(0).toUpperCase() + q.type.slice(1)} Question
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.previewContainer}>
            <div style={{ textAlign: "center", color: "#6b7280" }}>
              <FileText size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
              <p style={{ marginBottom: "8px" }}>No questions added yet</p>
              <p style={{ fontSize: "14px" }}>Click "Add Question" to start building your survey</p>
            </div>
          </div>
        )}
      </div>

      {!isViewMode && (
        <div style={styles.sectionCard}>
          <h4 style={styles.sectionTitle}><Clock size={20} />Survey Settings</h4>

          <div style={styles.grid3Col}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Survey Expiry</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="number"
                  style={styles.input}
                  placeholder="7"
                  value={surveyExpiry.value}
                  onChange={(e) => setSurveyExpiry({ ...surveyExpiry, value: parseInt(e.target.value) || 7 })}
                />
                <select
                  style={styles.select}
                  value={surveyExpiry.unit}
                  onChange={(e) => setSurveyExpiry({ ...surveyExpiry, unit: e.target.value })}
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Reminder Settings</label>
              <select
                style={styles.select}
                value={`${reminderSettings.frequency}`}
                onChange={(e) => handleUpdateReminderSettings("frequency", parseInt(e.target.value))}
              >
                <option value="1">Send 1 reminder</option>
                <option value="2">Send 2 reminders</option>
                <option value="3">Send 3 reminders</option>
                <option value="0">No reminders</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Completion Message</label>
              <select
                style={styles.select}
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Survey Logic & Skip Patterns</label>
            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={surveyLogic.skipLogic}
                  onChange={() => handleUpdateSurveyLogic("skipLogic")}
                />
                <span>Enable skip logic based on responses</span>
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={surveyLogic.randomize}
                  onChange={() => handleUpdateSurveyLogic("randomize")}
                />
                <span>Randomize question order</span>
              </label>
              <label style={styles.checkboxLabel}>
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
        <div style={styles.sectionCard}>
          <h4 style={styles.sectionTitle}><Target size={20} />Strategic Objectives Alignment</h4>
          <div style={styles.grid3Col}>
            {bscObjectives.map(obj => (
              <div key={obj.id} style={{
                ...styles.card,
                borderLeft: `4px solid ${bscPerspectives.find(p => p.id === obj.perspective)?.color || "#3b82f6"}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "8px" }}>{obj.name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {bscPerspectives.find(p => p.id === obj.perspective)?.name || "Strategic"}
                    </div>
                    {obj.kpis.length > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <div style={{ fontSize: "11px", color: "#374151", fontWeight: "500" }}>KPIs:</div>
                        <div style={{ fontSize: "11px", color: "#6b7280" }}>
                          {obj.kpis.slice(0, 2).join(", ")}
                          {obj.kpis.length > 2 && ` +${obj.kpis.length - 2} more`}
                        </div>
                      </div>
                    )}
                  </div>
                  {!isViewMode && (
                    <button
                      style={{ ...styles.button, ...styles.smallButton }}
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
      <div style={styles.sectionCard}>
        <h4 style={styles.sectionTitle}><BarChart3 size={20} />Active Surveys</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Survey Title</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Questions</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Responses</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Perspective</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Status</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map(survey => (
                <tr key={survey.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px", fontWeight: "500" }}>{survey.title}</td>
                  <td style={{ padding: "12px" }}>{Array.isArray(survey.questions) ? survey.questions.length : survey.questions || 0}</td>
                  <td style={{ padding: "12px" }}>{survey.responses}</td>
                  <td style={{ padding: "12px" }}>
                    {survey.perspective ? (
                      <span style={{
                        ...styles.chip,
                        background: bscPerspectives.find(p => p.id === survey.perspective)?.color + "20",
                        color: bscPerspectives.find(p => p.id === survey.perspective)?.color
                      }}>
                        {bscPerspectives.find(p => p.id === survey.perspective)?.name}
                      </span>
                    ) : (
                      <span style={styles.chip}>General</span>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      ...styles.chip,
                      background: survey.status === "active" ? "#d1fae5" :
                        survey.status === "completed" ? "#dbeafe" :
                          survey.status === "paused" ? "#fef3c7" : "#f3f4f6",
                      color: survey.status === "active" ? "#065f46" :
                        survey.status === "completed" ? "#1e40af" :
                          survey.status === "paused" ? "#92400e" : "#6b7280"
                    }}>
                      {survey.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{ ...styles.button, ...styles.smallButton }}
                        onClick={() => handleViewSurvey(survey)}
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.smallButton }}
                        onClick={() => handleDuplicateSurvey(survey)}
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.smallButton }}
                        onClick={() => handleSurveyAction(survey.id,
                          survey.status === "active" ? "pause" :
                            survey.status === "paused" ? "resume" : "close")}
                      >
                        {survey.status === "active" ? "⏸" :
                          survey.status === "paused" ? "▶" : "✓"}
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.smallButton }}
                        onClick={() => handleDeleteSurvey(survey.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.smallButton }}
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
        <div style={styles.sectionCard}>
          <h4 style={styles.sectionTitle}><Save size={20} />Saved Drafts</h4>
          <div style={styles.draftsList}>
            {drafts.map(draft => (
              <div key={draft.id} style={styles.draftItem}>
                <div>
                  <div style={{ fontWeight: "500" }}>{draft.title}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {draft.questions?.length || 0} questions • Last saved: {draft.lastSaved}
                    {draft.perspective && draft.perspective !== "all" && (
                      <span style={{
                        ...styles.chip,
                        marginLeft: "8px",
                        background: bscPerspectives.find(p => p.id === draft.perspective)?.color + "20",
                        color: bscPerspectives.find(p => p.id === draft.perspective)?.color,
                        fontSize: "10px"
                      }}>
                        {bscPerspectives.find(p => p.id === draft.perspective)?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    style={{ ...styles.button, ...styles.smallButton }}
                    onClick={() => handleLoadDraft(draft)}
                  >
                    <Eye size={12} /> Load
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.smallButton }}
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
      <div style={styles.sectionCard}>
        <h4 style={styles.sectionTitle}><Send size={20} />Survey Distribution</h4>

        <div style={styles.grid2Col}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Distribution Method</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {distributionMethods.map(method => (
                <div
                  key={method.id}
                  style={{
                    ...styles.card,
                    ...(distributionMethod === method.id ? styles.selectedCard : {})
                  }}
                  onClick={() => !isViewMode && setDistributionMethod(method.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <method.icon size={20} color={distributionMethod === method.id ? "#3b82f6" : "#6b7280"} />
                    <div>
                      <div style={{ fontWeight: "500" }}>{method.label}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>{method.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Scheduling</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {schedulingOptions.map(option => (
                <div
                  key={option.id}
                  style={{
                    ...styles.card,
                    ...(scheduling === option.id ? styles.selectedCard : {})
                  }}
                  onClick={() => !isViewMode && setScheduling(option.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Calendar size={20} color={scheduling === option.id ? "#3b82f6" : "#6b7280"} />
                    <div style={{ fontWeight: "500" }}>{option.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {scheduling === "scheduled" && (
              <div style={{ marginTop: "16px" }}>
                <div style={styles.grid2Col}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Schedule Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={scheduleDate}
                      onChange={(e) => !isViewMode && setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={isViewMode}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Schedule Time</label>
                    <input
                      type="time"
                      style={styles.input}
                      value={scheduleTime}
                      onChange={(e) => !isViewMode && setScheduleTime(e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            )}

            {scheduling === "recurring" && (
              <div style={{ marginTop: "16px" }}>
                <label style={styles.label}>Recurrence Pattern</label>
                <select
                  style={styles.select}
                  value={recurrencePattern}
                  onChange={(e) => !isViewMode && setRecurrencePattern(e.target.value)}
                  disabled={isViewMode}
                >
                  {recurrenceOptions.map(recurrence => (
                    <option key={recurrence.id} value={recurrence.id}>{recurrence.label}</option>
                  ))}
                </select>
                <div style={{ marginTop: "12px", padding: "12px", background: "#f0f9ff", borderRadius: "6px", fontSize: "13px", color: "#1e40af" }}>
                  This survey will be automatically sent {recurrencePattern === "weekly" ? "every week" :
                    recurrencePattern === "monthly" ? "every month" :
                      recurrencePattern === "quarterly" ? "every quarter" :
                        recurrencePattern === "biannual" ? "twice a year" : "annually"}.
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Target Audience</label>
          <div style={styles.grid3Col}>
            {targetAudiences.map(audience => (
              <div
                key={audience.id}
                style={{
                  ...styles.card,
                  ...(selectedAudience === audience.id ? styles.selectedCard : {})
                }}
                onClick={() => !isViewMode && setSelectedAudience(audience.id)}
              >
                <div style={{ textAlign: "center" }}>
                  <UsersIcon size={24} style={{ marginBottom: "8px", color: selectedAudience === audience.id ? "#3b82f6" : "#6b7280" }} />
                  <div style={{ fontWeight: "500", marginBottom: "4px" }}>{audience.label}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{audience.count} employees</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.sectionCard}>
        <h4 style={styles.sectionTitle}><Bell size={20} />Distribution & Participation Tracking</h4>

        <div style={styles.grid4Col}>
          <div style={styles.metricCard}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#3b82f6", marginBottom: "8px" }}>1,250</div>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Total Recipients</div>
            <div style={{ fontSize: "12px", color: "#10b981" }}>100% target audience</div>
          </div>
          <div style={styles.metricCard}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#10b981", marginBottom: "8px" }}>1,087</div>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Emails Sent</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>87% delivery rate</div>
          </div>
          <div style={styles.metricCard}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#f59e0b", marginBottom: "8px" }}>945</div>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Opened</div>
            <div style={{ fontSize: "12px", color: "#10b981" }}>87% open rate</div>
          </div>
          <div style={styles.metricCard}>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#8b5cf6", marginBottom: "8px" }}>782</div>
            <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Started</div>
            <div style={{ fontSize: "12px", color: "#f59e0b" }}>72% start rate</div>
          </div>
        </div>

        <div style={{ marginTop: "24px", padding: "16px", background: "#f0f9ff", borderRadius: "8px", border: "1px solid #bae6fd" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h5 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Survey Completion Status</h5>
            <span style={{ ...styles.chip, background: "#d1fae5", color: "#065f46" }}>
              {Math.round((782 / 1250) * 100)}% Completion Rate
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            <div style={{ padding: "12px", background: "white", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#3b82f6", marginBottom: "4px" }}>782</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Completed</div>
            </div>
            <div style={{ padding: "12px", background: "white", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#f59e0b", marginBottom: "4px" }}>163</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>In Progress</div>
            </div>
            <div style={{ padding: "12px", background: "white", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#ef4444", marginBottom: "4px" }}>305</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Not Started</div>
            </div>
            <div style={{ padding: "12px", background: "white", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#6b7280", marginBottom: "4px" }}>0</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Bounced</div>
            </div>
          </div>
          <div style={{ marginTop: "16px", padding: "12px", background: "white", borderRadius: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>Reminder Status</span>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>2 of 3 reminders sent</span>
            </div>
            <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ width: "67%", height: "100%", background: "#3b82f6", borderRadius: "4px" }}></div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => setShowLaunchModal(true)}
            disabled={isViewMode}
          >
            <Send size={16} /> Launch Survey Now
          </button>

          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => setShowScheduleModal(true)}
            disabled={isViewMode}
          >
            <Calendar size={16} /> Schedule Campaign
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => setShowReminderModal(true)}
            disabled={isViewMode}
          >
            <BellRing size={16} /> Send Reminders
          </button>

          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleShareSurvey}
          >
            <Share2 size={16} /> Share Link
          </button>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
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
      <div style={styles.sectionCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h4 style={styles.sectionTitle}>
            <BarChart3 size={20} />
            {analysisView === "standard" ? "Survey Analytics Dashboard" : "BSC Performance Dashboard"}
          </h4>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
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
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={() => setShowExportModal(true)}
            >
              <DownloadCloud size={16} /> Export Data
            </button>
          </div>
        </div>

        {analysisView === "bsc" ? (
          <>
            {/* BSC Perspective Selection */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  style={{
                    ...styles.button,
                    ...(selectedPerspective === "all" ? styles.primaryButton : {}),
                    fontSize: "12px",
                    padding: "6px 12px"
                  }}
                  onClick={() => handlePerspectiveChange("all")}
                >
                  All Perspectives
                </button>
                {bscPerspectives.map(perspective => (
                  <button
                    key={perspective.id}
                    style={{
                      ...styles.button,
                      background: selectedPerspective === perspective.id ? perspective.color : "white",
                      color: selectedPerspective === perspective.id ? "white" : perspective.color,
                      borderColor: perspective.color,
                      fontSize: "12px",
                      padding: "6px 12px"
                    }}
                    onClick={() => handlePerspectiveChange(perspective.id)}
                  >
                    {perspective.name} ({perspective.weight}%)
                  </button>
                ))}
              </div>
            </div>

            {/* BSC Metrics Overview */}
            <div style={styles.grid4Col}>
              {bscPerspectives.map(perspective => {
                const metric = bscMetrics[perspective.id];
                const Icon = perspective.icon;
                return (
                  <div key={perspective.id} style={{
                    ...styles.metricCard,
                    border: selectedPerspective === perspective.id ? `2px solid ${perspective.color}` : "1px solid #e2e8f0",
                    background: selectedPerspective === perspective.id ? `${perspective.color}10` : "white"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                      <Icon size={20} color={perspective.color} />
                      <div style={{ fontSize: "14px", fontWeight: "600", color: perspective.color }}>
                        {perspective.name}
                      </div>
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "700", color: perspective.color, marginBottom: "4px" }}>
                      {metric.score}
                    </div>
                    <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Performance Score</div>
                    <div style={{ fontSize: "12px", color: metric.trend === "up" ? "#10b981" : metric.trend === "down" ? "#ef4444" : "#6b7280" }}>
                      {metric.trend === "up" ? "↑ 5% from last quarter" : metric.trend === "down" ? "↓ 3% from last quarter" : "↔ No change"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BSC Correlation Matrix */}
            <div style={{ marginTop: "24px", marginBottom: "24px" }}>
              <h5 style={{ ...styles.label, fontSize: "16px", marginBottom: "16px" }}>Perspective Correlation Matrix</h5>
              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "8px", background: "#f8fafc" }}></th>
                      {bscCorrelationData.perspectives.map(perspective => (
                        <th key={perspective} style={{ padding: "8px", background: "#f8fafc", textAlign: "center" }}>
                          {perspective}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bscCorrelationData.correlations.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td style={{ padding: "8px", background: "#f8fafc", fontWeight: "500" }}>
                          {bscCorrelationData.perspectives[rowIndex]}
                        </td>
                        {row.map((correlation, colIndex) => (
                          <td
                            key={colIndex}
                            style={{
                              padding: "12px",
                              textAlign: "center",
                              background: `rgba(59, 130, 246, ${correlation * 0.7})`,
                              color: correlation > 0.7 ? "white" : "#1e293b",
                              fontWeight: "600"
                            }}
                          >
                            {correlation.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
                Note: Higher correlation values indicate stronger relationships between perspectives
              </div>
            </div>

            {/* BSC Objectives Progress */}
            {bscObjectives.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <h5 style={{ ...styles.label, fontSize: "16px", marginBottom: "16px" }}>Strategic Objectives Progress</h5>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Objective</th>
                        <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Perspective</th>
                        <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>KPIs</th>
                        <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Progress</th>
                        <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bscObjectives.map(obj => {
                        const progress = Math.floor(Math.random() * 100);
                        return (
                          <tr key={obj.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "12px", fontWeight: "500" }}>{obj.name}</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{
                                ...styles.chip,
                                background: bscPerspectives.find(p => p.id === obj.perspective)?.color + "20",
                                color: bscPerspectives.find(p => p.id === obj.perspective)?.color
                              }}>
                                {bscPerspectives.find(p => p.id === obj.perspective)?.name}
                              </span>
                            </td>
                            <td style={{ padding: "12px" }}>{obj.kpis.length}</td>
                            <td style={{ padding: "12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "100px", height: "8px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                                  <div style={{
                                    width: `${progress}%`,
                                    height: "100%",
                                    background: progress >= 70 ? "#10b981" : progress >= 40 ? "#f59e0b" : "#ef4444",
                                    borderRadius: "4px"
                                  }}></div>
                                </div>
                                <span style={{ fontSize: "14px" }}>{progress}%</span>
                              </div>
                            </td>
                            <td style={{ padding: "12px" }}>
                              <span style={{
                                ...styles.chip,
                                background: progress >= 70 ? "#d1fae5" : progress >= 40 ? "#fef3c7" : "#fee2e2",
                                color: progress >= 70 ? "#065f46" : progress >= 40 ? "#92400e" : "#dc2626"
                              }}>
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
            <div style={styles.grid4Col}>
              <div style={styles.metricCard}>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "#3b82f6", marginBottom: "8px" }}>
                  {analyticsData.responseRate}%
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Response Rate</div>
                <div style={{ fontSize: "12px", color: "#10b981" }}>↑ 3% from last month</div>
              </div>
              <div style={styles.metricCard}>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "#10b981", marginBottom: "8px" }}>
                  {analyticsData.completionRate}%
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Completion Rate</div>
                <div style={{ fontSize: "12px", color: "#10b981" }}>↑ 2% from last month</div>
              </div>
              <div style={styles.metricCard}>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "#8b5cf6", marginBottom: "8px" }}>
                  {analyticsData.averageNPS}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Average NPS Score</div>
                <div style={{ fontSize: "12px", color: analyticsData.averageNPS >= 50 ? "#10b981" : "#f59e0b" }}>
                  {analyticsData.averageNPS >= 50 ? "Excellent" : analyticsData.averageNPS >= 0 ? "Good" : "Needs Improvement"}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "#f59e0b", marginBottom: "8px" }}>
                  {analyticsData.totalResponses}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Total Responses</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>Out of 1,250 recipients</div>
              </div>
            </div>
          </>
        )}
      </div>

      {analysisView === "standard" && (
        <>
          <div style={styles.sectionCard}>
            <h4 style={styles.sectionTitle}><PieChart size={20} />Department Comparison</h4>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Department</th>
                    <th style={{ textAlign: "center", padding: "12px", fontWeight: "500", color: "#374151" }}>Response Rate</th>
                    <th style={{ textAlign: "center", padding: "12px", fontWeight: "500", color: "#374151" }}>Satisfaction Score</th>
                    <th style={{ textAlign: "center", padding: "12px", fontWeight: "500", color: "#374151" }}>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.departmentComparison.map(dept => (
                    <tr key={dept.department} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px", fontWeight: "500" }}>{dept.department}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <div style={{ fontSize: "14px", fontWeight: "600" }}>{dept.responseRate}%</div>
                          <div style={{
                            width: "60px",
                            height: "6px",
                            background: "#e5e7eb",
                            borderRadius: "3px",
                            overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${dept.responseRate}%`,
                              height: "100%",
                              background: "#3b82f6",
                              borderRadius: "3px"
                            }}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          background: dept.satisfaction >= 4 ? "#d1fae5" : "#fef3c7",
                          color: dept.satisfaction >= 4 ? "#065f46" : "#92400e",
                          borderRadius: "12px",
                          fontWeight: "600"
                        }}>
                          {dept.satisfaction}/5
                        </div>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <TrendingUp size={16} color={dept.responseRate > 85 ? "#10b981" : "#f59e0b"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.sectionCard}>
            <h4 style={styles.sectionTitle}><LineChart size={20} />Trend Analysis</h4>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>Engagement Score Trend</div>
                <div style={{ fontSize: "24px", fontWeight: "600" }}>4.3/5</div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={() => setShowExportModal(true)}
                >
                  <Download size={16} /> Export Data
                </button>
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={handleFilterAnalytics}
                >
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            <div style={{
              display: "flex",
              height: "200px",
              alignItems: "flex-end",
              gap: "20px",
              padding: "20px 0",
              borderTop: "1px solid #e5e7eb"
            }}>
              {analyticsData.trendData.map((month, index) => {
                const isMax = month.engagement === maxEngagement;
                const isMin = month.engagement === minEngagement;

                return (
                  <div key={month.month} style={{ flex: 1, textAlign: "center" }}>
                    <div
                      title={`Engagement: ${month.engagement}\nResponse Rate: ${month.responseRate}%`}
                      style={{
                        height: `${(month.engagement - 3) * 45}px`,
                        background: `linear-gradient(to top, ${barColors[index % barColors.length]}, #e0f2fe)`,
                        borderRadius: "6px 6px 0 0",
                        marginBottom: "8px",
                        position: "relative",
                        transition: "all 0.3s ease",
                        boxShadow: isMax
                          ? "0 0 0 2px #22c55e"
                          : isMin
                            ? "0 0 0 2px #ef4444"
                            : "none"
                      }}
                    >
                      {(isMax || isMin) && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-22px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: isMax ? "#16a34a" : "#dc2626"
                          }}
                        >
                          {isMax ? "▲ Peak" : "▼ Low"}
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {month.month}
                    </div>

                    <div style={{ fontSize: "14px", fontWeight: "600" }}>
                      {month.engagement}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div style={styles.sectionCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h4 style={styles.sectionTitle}><MessageSquare size={20} />Sentiment Analysis</h4>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={() => {
                setExportType("pdf");
                setShowExportModal(true);
              }}
            >
              <File size={16} /> Export PDF
            </button>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => {
                setExportType("excel");
                setShowExportModal(true);
              }}
            >
              <FileSpreadsheet size={16} /> Export Excel
            </button>
          </div>
        </div>

        <div style={styles.grid2Col}>
          <div>
            <h5 style={{ ...styles.label, fontSize: "16px", marginBottom: "16px" }}>Word Cloud</h5>
            <div style={{
              background: "#f9fafb",
              padding: "24px",
              borderRadius: "8px",
              minHeight: "200px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {["Great", "Supportive", "Challenging", "Growth", "Balance", "Collaborative", "Flexible", "Innovative"].map(word => (
                <span key={word} style={{
                  fontSize: `${Math.random() * 20 + 14}px`,
                  fontWeight: "600",
                  color: "#3b82f6",
                  opacity: Math.random() * 0.5 + 0.5
                }}>
                  {word}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h5 style={{ ...styles.label, fontSize: "16px", marginBottom: "16px" }}>Sentiment Breakdown</h5>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px" }}>Positive</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#10b981" }}>68%</span>
              </div>
              <div style={{ height: "12px", background: "#e5e7eb", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ width: "68%", height: "100%", background: "#10b981", borderRadius: "6px" }}></div>
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px" }}>Neutral</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280" }}>22%</span>
              </div>
              <div style={{ height: "12px", background: "#e5e7eb", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ width: "22%", height: "100%", background: "#6b7280", borderRadius: "6px" }}></div>
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px" }}>Negative</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#ef4444" }}>10%</span>
              </div>
              <div style={{ height: "12px", background: "#e5e7eb", borderRadius: "6px", overflow: "hidden" }}>
                <div style={{ width: "10%", height: "100%", background: "#ef4444", borderRadius: "6px" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="fade-in">
      <div style={styles.sectionCard}>
        <h4 style={styles.sectionTitle}><BookOpen size={20} />Survey Templates</h4>

        <div style={{ marginBottom: "24px" }}>
          <input
            type="text"
            style={styles.searchBox}
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* BSC Templates Section */}
        <div style={{ marginBottom: "32px" }}>
          <h5 style={{ ...styles.sectionTitle, fontSize: "16px", marginBottom: "16px" }}>
            <Target size={18} /> Balanced Scorecard Templates
          </h5>
          <div style={styles.grid3Col}>
            {bscSurveyTemplates.map(template => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  style={{
                    ...styles.card,
                    borderLeft: `4px solid ${template.perspectives[0] === "all" ? "#10b981" :
                      bscPerspectives.find(p => p.id === template.perspectives[0])?.color || "#6b7280"
                      }`
                  }}
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      background: "#f0f9ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Icon size={24} color="#0ea5e9" />
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "16px" }}>{template.name}</div>
                      <div style={{ fontSize: "13px", color: "#6b7280" }}>
                        {template.questions} questions • {template.estimatedTime}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ ...styles.chip, background: "#e0f2fe", color: "#0369a1" }}>
                      {template.perspectives[0] === "all" ? "Multi-Perspective" :
                        bscPerspectives.find(p => p.id === template.perspectives[0])?.name}
                    </span>
                    <button
                      style={{ ...styles.button, ...styles.outlineButton, ...styles.smallButton }}
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
          <h5 style={{ ...styles.sectionTitle, fontSize: "16px", marginBottom: "16px" }}>
            <Users size={18} /> Standard Templates
          </h5>
          <div style={styles.grid3Col}>
            {surveyTemplates.map(template => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  style={styles.card}
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      background: "#dbeafe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Icon size={24} color="#3b82f6" />
                    </div>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "16px" }}>{template.name}</div>
                      <div style={{ fontSize: "13px", color: "#6b7280" }}>
                        {template.questions} questions • {template.estimatedTime}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ ...styles.chip, background: "#d1fae5", color: "#065f46" }}>
                      {template.usage}
                    </span>
                    <button
                      style={{ ...styles.button, ...styles.outlineButton, ...styles.smallButton }}
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
      <div style={styles.sectionCard}>
        <h4 style={styles.sectionTitle}><Database size={20} />Question Bank Management</h4>

        {/* Filters and Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <input
            type="text"
            style={styles.searchBox}
            placeholder="Search questions by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
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
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Category:</span>
            <select
              style={{ ...styles.select, width: "150px" }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== "all").map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Type:</span>
            <select
              style={{ ...styles.select, width: "150px" }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {questionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Sort by:</span>
            <select
              style={{ ...styles.select, width: "150px" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="used">Most Used</option>
              <option value="recent">Recently Used</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Perspective:</span>
            <select
              style={{ ...styles.select, width: "150px" }}
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
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            Showing {filteredQuestions.length} questions
          </span>
          <span style={{ fontSize: "14px", color: "#3b82f6", fontWeight: "500" }}>
            Total: {questionBank.length + bscQuestionBank.length} questions in bank
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Question</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Type</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Category</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Perspective</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Times Used</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Last Used</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Tags</th>
                <th style={{ textAlign: "left", padding: "12px", fontWeight: "500", color: "#374151" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map(q => (
                <tr key={q.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px", fontWeight: "500" }}>{q.question}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      ...styles.chip,
                      background: q.type === "rating" ? "#fef3c7" :
                        q.type === "nps" ? "#dbeafe" :
                          q.type === "open" ? "#d1fae5" : "#f3f4f6",
                      color: q.type === "rating" ? "#92400e" :
                        q.type === "nps" ? "#1e40af" :
                          q.type === "open" ? "#065f46" : "#6b7280"
                    }}>
                      {q.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={styles.chip}>{q.category}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {q.perspective ? (
                      <span style={{
                        ...styles.chip,
                        background: bscPerspectives.find(p => p.id === q.perspective)?.color + "20",
                        color: bscPerspectives.find(p => p.id === q.perspective)?.color
                      }}>
                        {bscPerspectives.find(p => p.id === q.perspective)?.name}
                      </span>
                    ) : (
                      <span style={styles.chip}>General</span>
                    )}
                  </td>
                  <td style={{ padding: "12px", fontWeight: "600", textAlign: "center" }}>{q.used || 0}</td>
                  <td style={{ padding: "12px", fontSize: "12px", color: "#6b7280" }}>
                    {q.lastUsed || "Never"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {q.tags && q.tags.map(tag => (
                        <span key={tag} style={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{ ...styles.button, ...styles.smallButton, ...styles.primaryButton }}
                        onClick={() => handleAddFromQuestionBank(q)}
                        title="Add to current survey"
                      >
                        <Plus size={12} /> Add
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.smallButton, ...styles.secondaryButton }}
                        onClick={() => handleEditQuestion(q)}
                        title="Edit question"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.smallButton, ...styles.secondaryButton }}
                        onClick={() => handleDuplicateQuestionInBank(q)}
                        title="Duplicate question"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.smallButton, ...styles.dangerButton }}
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
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <Database size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
            <p>No questions found matching your filters.</p>
            <button
              style={{ ...styles.button, ...styles.primaryButton, marginTop: "16px" }}
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

  // Enhanced Preview Modal Component
  const renderPreviewModal = () => {
    if (!showPreview) return null;

    const answeredQuestions = Object.keys(previewResponses).length;
    const totalQuestions = questions.length;
    const progressPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isPreviewFullscreen ? "white" : "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 4000,
        padding: isPreviewFullscreen ? "0" : "20px"
      }}>
        <div style={{
          background: "white",
          padding: isPreviewFullscreen ? "0" : "24px",
          borderRadius: isPreviewFullscreen ? "0" : "12px",
          maxWidth: isPreviewFullscreen ? "100%" : "800px",
          width: isPreviewFullscreen ? "100%" : "90%",
          maxHeight: isPreviewFullscreen ? "100vh" : "90vh",
          overflow: "auto",
          position: "relative"
        }}>
          {/* Preview Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "1px solid #e5e7eb",
            position: isPreviewFullscreen ? "sticky" : "static",
            top: 0,
            background: "white",
            zIndex: 10
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>Survey Preview</h4>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
                Test how your survey will appear to participants
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
                title={isPreviewFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isPreviewFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={handleResetPreview}
                title="Reset responses"
              >
                <RefreshCw size={16} />
              </button>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => setShowPreview(false)}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>Progress</span>
              <span style={{ fontSize: "14px", color: "#3b82f6", fontWeight: "600" }}>
                {answeredQuestions}/{totalQuestions} questions ({progressPercentage}%)
              </span>
            </div>
            <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: "100%",
                background: "#3b82f6",
                borderRadius: "4px",
                transition: "width 0.3s ease"
              }}></div>
            </div>
          </div>

          {/* Survey Preview Content */}
          <div style={{ background: "#f9fafb", padding: "24px", borderRadius: "8px" }}>
            {/* Survey Header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h3 style={{ marginBottom: "12px", fontSize: "24px", fontWeight: "600" }}>
                {surveyTitle || "Survey Title"}
              </h3>
              {selectedPerspective !== "all" && (
                <div style={{
                  padding: "8px 16px",
                  background: bscPerspectives.find(p => p.id === selectedPerspective)?.color + "20",
                  color: bscPerspectives.find(p => p.id === selectedPerspective)?.color,
                  borderRadius: "20px",
                  display: "inline-block",
                  marginBottom: "16px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  {bscPerspectives.find(p => p.id === selectedPerspective)?.name} Perspective
                </div>
              )}
              <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto" }}>
                {surveyDescription || "Survey description goes here. This is where you explain the purpose of the survey to participants."}
              </p>
              
              {/* Survey Info */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "24px",
                marginTop: "20px",
                fontSize: "14px",
                color: "#6b7280"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Clock size={16} />
                  <span>Estimated time: {Math.ceil(questions.length * 0.5)} minutes</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileText size={16} />
                  <span>{questions.length} questions</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Users size={16} />
                  <span>{surveyVisibility === "anonymous" ? "Anonymous" : "Identified"}</span>
                </div>
              </div>
            </div>

            {/* Questions */}
            {questions.length > 0 ? (
              <div>
                {questions.map((q, index) => (
                  <div key={q.id} style={{
                    ...styles.previewQuestion,
                    borderLeft: previewResponses[q.id] ? "4px solid #10b981" : "1px solid #e5e7eb"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                          <div style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "#3b82f6",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: "600"
                          }}>
                            {index + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px" }}>
                              {q.question || "Your question here"}
                            </div>
                            {q.required && (
                              <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "500" }}>
                                * Required
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Response Indicators */}
                        {previewResponses[q.id] && (
                          <div style={{
                            padding: "8px 12px",
                            background: "#d1fae5",
                            borderRadius: "6px",
                            marginBottom: "12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}>
                            <CheckCircle size={14} color="#059669" />
                            <span style={{ fontSize: "12px", color: "#059669", fontWeight: "500" }}>
                              Answered: {typeof previewResponses[q.id] === 'object' 
                                ? JSON.stringify(previewResponses[q.id]) 
                                : previewResponses[q.id]}
                            </span>
                          </div>
                        )}

                        {/* Question type specific inputs */}
                        {q.type === "rating" && (
                          <div style={{ marginTop: "16px" }}>
                            <div style={{ fontSize: "14px", marginBottom: "12px", color: "#374151" }}>
                              Select a rating from 1 to {q.scale}:
                            </div>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              {Array.from({ length: q.scale }).map((_, i) => (
                                <button
                                  key={i}
                                  style={{
                                    ...styles.button,
                                    width: "50px",
                                    height: "50px",
                                    padding: 0,
                                    background: previewResponses[q.id] === i + 1 ? "#3b82f6" : "white",
                                    color: previewResponses[q.id] === i + 1 ? "white" : "#374151",
                                    borderColor: previewResponses[q.id] === i + 1 ? "#3b82f6" : "#d1d5db",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                  onClick={() => handlePreviewResponse(q.id, i + 1)}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
                              <span>Poor</span>
                              <span>Excellent</span>
                            </div>
                          </div>
                        )}

                        {q.type === "nps" && (
                          <div style={{ marginTop: "16px" }}>
                            <div style={{ fontSize: "14px", marginBottom: "12px", color: "#374151" }}>
                              How likely are you to recommend? (0 = Not likely, 10 = Extremely likely):
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                              {Array.from({ length: 11 }).map((_, i) => (
                                <button
                                  key={i}
                                  style={{
                                    ...styles.button,
                                    width: "40px",
                                    height: "40px",
                                    padding: 0,
                                    background: previewResponses[q.id] === i ? "#3b82f6" : "white",
                                    color: previewResponses[q.id] === i ? "white" : "#374151",
                                    borderColor: previewResponses[q.id] === i ? "#3b82f6" : "#d1d5db",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                  onClick={() => handlePreviewResponse(q.id, i)}
                                >
                                  {i}
                                </button>
                              ))}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
                              <span>Not at all likely</span>
                              <span>Extremely likely</span>
                            </div>
                            
                            {/* NPS Categories */}
                            {previewResponses[q.id] !== undefined && (
                              <div style={{ marginTop: "16px" }}>
                                <div style={{
                                  padding: "12px",
                                  background: previewResponses[q.id] <= 6 ? "#fef3c7" :
                                            previewResponses[q.id] <= 8 ? "#fef9c3" : "#d1fae5",
                                  borderRadius: "6px",
                                  textAlign: "center",
                                  fontWeight: "500",
                                  color: previewResponses[q.id] <= 6 ? "#92400e" :
                                        previewResponses[q.id] <= 8 ? "#854d0e" : "#065f46"
                                }}>
                                  {previewResponses[q.id] <= 6 ? "Detractor" :
                                   previewResponses[q.id] <= 8 ? "Passive" : "Promoter"}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {q.type === "multiple" && (
                          <div style={{ marginTop: "16px" }}>
                            <div style={{ fontSize: "14px", marginBottom: "12px", color: "#374151" }}>
                              Select all that apply:
                            </div>
                            <div>
                              {q.options && q.options.map((option, optIndex) => (
                                <label key={optIndex} style={{
                                  ...styles.checkboxLabel,
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "12px",
                                  marginBottom: "8px",
                                  background: previewResponses[q.id]?.includes(option) ? "#eff6ff" : "white",
                                  border: `1px solid ${previewResponses[q.id]?.includes(option) ? "#3b82f6" : "#d1d5db"}`,
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  transition: "all 0.2s"
                                }}>
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
                                    style={{ marginRight: "12px" }}
                                  />
                                  <span style={{ fontSize: "14px" }}>{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {q.type === "open" && (
                          <div style={{ marginTop: "16px" }}>
                            <div style={{ fontSize: "14px", marginBottom: "12px", color: "#374151" }}>
                              Your response:
                            </div>
                            <textarea
                              style={{
                                ...styles.textarea,
                                width: "100%",
                                minHeight: "100px",
                                borderColor: previewResponses[q.id] ? "#10b981" : "#d1d5db"
                              }}
                              placeholder="Type your answer here..."
                              value={previewResponses[q.id] || ""}
                              onChange={(e) => handlePreviewResponse(q.id, e.target.value)}
                            />
                            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                              Minimum 10 characters recommended
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Question Metadata */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "16px",
                      paddingTop: "12px",
                      borderTop: "1px solid #e5e7eb"
                    }}>
                      <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#6b7280" }}>
                        <span style={{
                          ...styles.chip,
                          background: "#e0f2fe",
                          color: "#0369a1"
                        }}>
                          {q.type.charAt(0).toUpperCase() + q.type.slice(1)}
                        </span>
                        {q.required && (
                          <span style={{
                            ...styles.chip,
                            background: "#fee2e2",
                            color: "#dc2626"
                          }}>
                            Required
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Question {index + 1} of {questions.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
                <FileText size={64} style={{ marginBottom: "16px", opacity: 0.5 }} />
                <p style={{ fontSize: "18px", marginBottom: "8px" }}>No questions added yet</p>
                <p style={{ fontSize: "14px" }}>Add questions to see the preview</p>
              </div>
            )}

            {/* Survey Footer */}
            {questions.length > 0 && (
              <div style={{
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "1px solid #e5e7eb",
                textAlign: "center"
              }}>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                    {answeredQuestions === totalQuestions ? (
                      <span style={{ color: "#10b981", fontWeight: "500" }}>
                        ✓ All questions answered! Ready to submit.
                      </span>
                    ) : (
                      <span>
                        {totalQuestions - answeredQuestions} question{totalQuestions - answeredQuestions !== 1 ? 's' : ''} remaining
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                  <button
                    style={{ ...styles.button, ...styles.secondaryButton }}
                    onClick={handleResetPreview}
                  >
                    <RefreshCw size={16} /> Reset All Responses
                  </button>
                  <button
                    style={{
                      ...styles.button,
                      ...styles.primaryButton,
                      opacity: answeredQuestions === totalQuestions ? 1 : 0.6
                    }}
                    onClick={handleSubmitPreview}
                    disabled={answeredQuestions !== totalQuestions}
                  >
                    <CheckCircle size={16} /> Submit Survey
                  </button>
                </div>
                
                <div style={{
                  marginTop: "20px",
                  padding: "12px",
                  background: "#f0f9ff",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#0369a1",
                  textAlign: "left"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <Bell size={14} />
                    <span style={{ fontWeight: "500" }}>Preview Mode</span>
                  </div>
                  <p style={{ margin: 0 }}>
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

  // Export Modal Component
  const renderExportModal = () => (
    <Modal
      title="Export Survey Data"
      isOpen={showExportModal}
      onClose={() => setShowExportModal(false)}
      width="700px"
    >
      <div style={{ marginBottom: "20px" }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Export Format</label>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <div
              style={{
                ...styles.card,
                flex: 1,
                border: `2px solid ${exportType === "pdf" ? "#ef4444" : "#e5e7eb"}`,
                cursor: "pointer"
              }}
              onClick={() => setExportType("pdf")}
            >
              <div style={{ textAlign: "center" }}>
                <File size={32} color={exportType === "pdf" ? "#ef4444" : "#6b7280"} />
                <div style={{ marginTop: "8px", fontWeight: "600" }}>PDF</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>Portable Document Format</div>
              </div>
            </div>
            <div
              style={{
                ...styles.card,
                flex: 1,
                border: `2px solid ${exportType === "excel" ? "#10b981" : "#e5e7eb"}`,
                cursor: "pointer"
              }}
              onClick={() => setExportType("excel")}
            >
              <div style={{ textAlign: "center" }}>
                <FileSpreadsheet size={32} color={exportType === "excel" ? "#10b981" : "#6b7280"} />
                <div style={{ marginTop: "8px", fontWeight: "600" }}>Excel (CSV)</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>Spreadsheet Format</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Include Data Sections</label>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={exportData.includeQuestions}
                onChange={(e) => setExportData({ ...exportData, includeQuestions: e.target.checked })}
              />
              <span>Survey Questions ({questions.length} questions)</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={exportData.includeAnalytics}
                onChange={(e) => setExportData({ ...exportData, includeAnalytics: e.target.checked })}
              />
              <span>Analytics & Performance Data</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={exportData.includeBscData}
                onChange={(e) => setExportData({ ...exportData, includeBscData: e.target.checked })}
              />
              <span>BSC Objectives & Metrics</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={exportData.includeResponses}
                onChange={(e) => setExportData({ ...exportData, includeResponses: e.target.checked })}
              />
              <span>Response Summary</span>
            </label>
          </div>
        </div>

        <div style={styles.exportPreview}>
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "8px" }}>Preview:</div>
          <div style={{ fontSize: "10px", lineHeight: "1.4" }}>
            {exportType === "pdf" ?
              "PDF Document with selected sections will be generated for download." :
              "CSV/Excel file with structured data will be generated for download."}
            <br /><br />
            <strong>File Name:</strong> {(selectedSurvey?.title || surveyTitle || "survey").replace(/\s+/g, '_')}_survey_report_{new Date().getTime()}.{exportType === "pdf" ? "txt" : "csv"}
            <br />
            <strong>Size:</strong> {exportType === "pdf" ? "~500 KB" : "~100 KB"}
          </div>
        </div>

        <div style={{
          background: exportType === "pdf" ? "#fef2f2" : "#f0f9ff",
          padding: "12px",
          borderRadius: "8px",
          marginTop: "16px",
          border: `1px solid ${exportType === "pdf" ? "#fecaca" : "#bae6fd"}`
        }}>
          <div style={{ fontSize: "13px", fontWeight: "500", color: exportType === "pdf" ? "#dc2626" : "#0ea5e9" }}>
            {exportType === "pdf" ? "PDF Export" : "Excel Export"} Ready
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
            {exportType === "pdf"
              ? "PDF format is best for sharing reports and presentations."
              : "Excel format is best for data analysis and further processing."}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          style={styles.button}
          onClick={() => setShowExportModal(false)}
        >
          Cancel
        </button>
        <button
          style={{
            ...styles.button,
            ...styles.primaryButton,
            background: exportType === "pdf" ? "#ef4444" : "#10b981"
          }}
          onClick={handleExport}
        >
          {exportType === "pdf" ? <File size={16} /> : <FileSpreadsheet size={16} />}
          Export {exportType === "pdf" ? "PDF" : "Excel"}
        </button>
      </div>
    </Modal>
  );

  // Edit Question Modal
  const renderEditQuestionModal = () => (
    <Modal
      title={editingQuestion ? "Edit Question" : "Add New Question"}
      isOpen={showEditQuestionModal}
      onClose={() => {
        setShowEditQuestionModal(false);
        setEditingQuestion(null);
      }}
      width="600px"
    >
      <div style={{ marginBottom: "20px" }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Question Text *</label>
          <textarea
            style={{ ...styles.textarea, minHeight: "80px" }}
            placeholder="Enter your question here..."
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
          />
        </div>

        <div style={styles.grid2Col}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Question Type</label>
            <select
              style={styles.select}
              value={newQuestionType}
              onChange={(e) => setNewQuestionType(e.target.value)}
            >
              {questionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              style={styles.select}
              value={newQuestionCategory}
              onChange={(e) => setNewQuestionCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.filter(c => c !== "all").map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tags</label>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              type="text"
              style={styles.input}
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handleAddTag}
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {newQuestionTags.map(tag => (
              <span key={tag} style={{
                ...styles.tag,
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "10px",
                    color: "#1e40af",
                    padding: "0"
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {editingQuestion && (
          <div style={{
            background: "#f9fafb",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "13px",
            marginTop: "16px"
          }}>
            <div><strong>Question ID:</strong> {editingQuestion.id}</div>
            <div><strong>Times Used:</strong> {editingQuestion.used || 0}</div>
            <div><strong>Last Used:</strong> {editingQuestion.lastUsed || "Never"}</div>
            {editingQuestion.perspective && (
              <div><strong>BSC Perspective:</strong> {bscPerspectives.find(p => p.id === editingQuestion.perspective)?.name}</div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          style={styles.button}
          onClick={() => {
            setShowEditQuestionModal(false);
            setEditingQuestion(null);
          }}
        >
          Cancel
        </button>
        {editingQuestion ? (
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleSaveEditedQuestion}
          >
            <Save size={16} /> Save Changes
          </button>
        ) : (
          <button
            style={{ ...styles.button, ...styles.successButton }}
            onClick={handleAddNewQuestionToBank}
          >
            <Plus size={16} /> Add to Bank
          </button>
        )}
      </div>
    </Modal>
  );

  // View Survey Modal
  const renderViewModal = () => (
    <Modal
      title={`View Survey: ${selectedSurvey?.title || 'Survey'}`}
      isOpen={showViewModal}
      onClose={() => {
        setShowViewModal(false);
        setIsViewMode(false);
        setSelectedSurvey(null);
      }}
      width="800px"
    >
      {selectedSurvey && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Survey Title</label>
              <div style={{ padding: "10px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                {selectedSurvey.title}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <div style={{ padding: "10px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb", minHeight: "60px" }}>
                {selectedSurvey.description || "No description"}
              </div>
            </div>

            <div style={styles.grid2Col}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <div style={{
                  padding: "6px 12px",
                  background: selectedSurvey.status === "active" ? "#d1fae5" :
                    selectedSurvey.status === "completed" ? "#dbeafe" :
                    selectedSurvey.status === "paused" ? "#fef3c7" : "#f3f4f6",
                  color: selectedSurvey.status === "active" ? "#065f46" :
                    selectedSurvey.status === "completed" ? "#1e40af" :
                    selectedSurvey.status === "paused" ? "#92400e" : "#6b7280",
                  borderRadius: "20px",
                  display: "inline-block",
                  fontWeight: "500"
                }}>
                  {selectedSurvey.status}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Created</label>
                <div style={{ padding: "10px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                  {selectedSurvey.createdAt}
                </div>
              </div>
            </div>

            <div style={styles.grid2Col}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Questions</label>
                <div style={{ padding: "10px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                  {Array.isArray(selectedSurvey.questions) ? selectedSurvey.questions.length : selectedSurvey.questions || 0}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Responses</label>
                <div style={{ padding: "10px", background: "#f9fafb", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                  {selectedSurvey.responses || 0}
                </div>
              </div>
            </div>

            {selectedSurvey.perspective && (
              <div style={styles.formGroup}>
                <label style={styles.label}>BSC Perspective</label>
                <div style={{
                  padding: "6px 12px",
                  background: bscPerspectives.find(p => p.id === selectedSurvey.perspective)?.color + "20",
                  color: bscPerspectives.find(p => p.id === selectedSurvey.perspective)?.color,
                  borderRadius: "20px",
                  display: "inline-block",
                  fontWeight: "500"
                }}>
                  {bscPerspectives.find(p => p.id === selectedSurvey.perspective)?.name}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              style={styles.button}
              onClick={() => {
                setShowViewModal(false);
                setIsViewMode(false);
                setSelectedSurvey(null);
              }}
            >
              Close
            </button>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={() => {
                // Switch to edit mode
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
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h4 style={styles.mainTitle}>
            <BarChart3 size={24} />
            Survey & Pulse Check Management
          </h4>
          <p style={styles.subtitle}>
            Create, distribute, and analyze employee surveys and pulse checks
          </p>
        </div>

        <div style={styles.headerActions}>
          <div
            style={styles.notificationsButton}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span style={styles.notificationsBadge}>
                {unreadNotifications}
              </span>
            )}
          </div>

          {showNotifications && (
            <div className="slide-in" style={styles.notificationsPanel}>
              <div style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "500" }}>Notifications</span>
                <button
                  style={{ ...styles.button, ...styles.smallButton }}
                  onClick={handleMarkAllNotificationsRead}
                >
                  Mark all read
                </button>
              </div>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    ...styles.notificationItem,
                    background: notification.read ? "white" : "#f0f9ff"
                  }}
                  onClick={() => handleToggleNotification(notification.id)}
                >
                  <div style={{ fontSize: "14px" }}>{notification.message}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                    {notification.type === "success" ? "✅" : notification.type === "warning" ? "⚠️" : "ℹ️"} {notification.time}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <RefreshCw size={16} className="spin" /> Refreshing...
              </>
            ) : (
              <>
                <RefreshCw size={16} /> Refresh
              </>
            )}
          </button>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => setShowNewSurveyModal(true)}
          >
            <Plus size={16} /> New Survey
          </button>
        </div>
      </div>

      <div style={styles.navTabs}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              style={{
                ...styles.navTab,
                ...(activeTab === tab.id ? styles.activeNavTab : {})
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
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
        <div style={styles.actionButtons}>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={() => setShowDraftModal(true)}
          >
            <Save size={16} /> Save as Draft
          </button>
          <button
            style={{ ...styles.button, ...styles.outlineButton }}
            onClick={() => setShowPreview(true)}
          >
            <Eye size={16} /> Preview
          </button>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => setShowLaunchModal(true)}
          >
            <Send size={16} /> Launch Survey
          </button>
          <button
            style={{ ...styles.button, ...styles.successButton }}
            onClick={() => setShowExportModal(true)}
          >
            <Download size={16} /> Export
          </button>
        </div>
      )}

      {/* All Modals */}
      <Modal
        title="Save Survey as Draft"
        isOpen={showDraftModal}
        onClose={() => setShowDraftModal(false)}
      >
        <p style={{ fontSize: "14px", color: "#374151", marginBottom: "16px" }}>
          Your survey will be saved as a draft and will not be visible to employees.
        </p>

        <div style={styles.formGroup}>
          <label style={styles.label}>Draft Notes (Optional)</label>
          <textarea
            style={{ ...styles.textarea, minHeight: "80px" }}
            placeholder="Add notes for this draft version"
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
          />
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "13px"
          }}
        >
          <div><strong>Survey Title:</strong> {surveyTitle || "Untitled Survey"}</div>
          <div><strong>Total Questions:</strong> {questions.length}</div>
          <div><strong>Perspective:</strong> {selectedPerspective === "all" ? "General" : bscPerspectives.find(p => p.id === selectedPerspective)?.name}</div>
          <div><strong>Status:</strong> Draft</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "20px"
          }}
        >
          <button
            style={styles.button}
            onClick={() => setShowDraftModal(false)}
          >
            Cancel
          </button>

          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        </div>
      </Modal>

      <Modal
        title="Create New Survey"
        isOpen={showNewSurveyModal}
        onClose={() => {
          setShowNewSurveyModal(false);
          setIsViewMode(false);
        }}
        width="700px"
      >
        <div style={{ marginBottom: "14px" }}>
          <label style={styles.label}>Survey Title *</label>
          <input
            type="text"
            style={styles.input}
            placeholder="e.g. Employee Engagement Survey – Q2"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={styles.label}>Description (Optional)</label>
          <textarea
            style={{ ...styles.input, height: "80px" }}
            placeholder="Brief description of the survey purpose"
            value={surveyDescription}
            onChange={(e) => setSurveyDescription(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={styles.label}>BSC Perspective</label>
          <select
            style={styles.input}
            value={selectedPerspective}
            onChange={(e) => setSelectedPerspective(e.target.value)}
          >
            <option value="all">General (No BSC Perspective)</option>
            {bscPerspectives.map(p => (
              <option key={p.id} value={p.id}>{p.name} Perspective</option>
            ))}
          </select>
        </div>

        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#92400e",
            marginBottom: "20px"
          }}
        >
          ⚠ Starting a new survey will remove:
          <ul style={{ margin: "8px 0 0 16px" }}>
            <li>All existing questions</li>
            <li>Unsaved changes</li>
            <li>Current analytics preview</li>
          </ul>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            style={styles.button}
            onClick={() => {
              setShowNewSurveyModal(false);
              setIsViewMode(false);
            }}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.button,
              ...styles.primaryButton,
              opacity: surveyTitle.trim() ? 1 : 0.6
            }}
            disabled={!surveyTitle.trim() || isViewMode}
            onClick={() => {
              handleNewSurvey();
              setShowNewSurveyModal(false);
            }}
          >
            Create Survey
          </button>
        </div>
      </Modal>

      <Modal
        title="Add Question"
        isOpen={showAddQuestionModal}
        onClose={() => setShowAddQuestionModal(false)}
        width="900px"
      >
        <h5 style={{ marginBottom: "12px" }}>Choose Question Type</h5>
        <div style={styles.grid3Col}>
          {questionTypes.map(type => (
            <div
              key={type.id}
              style={styles.card}
              onClick={() => {
                handleAddQuestion(type.id);
                setShowAddQuestionModal(false);
              }}
            >
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <type.icon size={20} color="#3b82f6" />
                </div>
                <div>
                  <strong>{type.label}</strong>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {type.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h5 style={{ margin: "24px 0 12px" }}>Add from Question Bank</h5>

        <input
          type="text"
          style={{ ...styles.input, marginBottom: "12px" }}
          placeholder="Search question bank..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {[...questionBank, ...bscQuestionBank]
            .filter(q =>
              q.question.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(q => (
              <div key={q.id} style={styles.questionCard}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: "500" }}>{q.question}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {q.perspective ? (
                        <span style={{
                          ...styles.chip,
                          background: bscPerspectives.find(p => p.id === q.perspective)?.color + "20",
                          color: bscPerspectives.find(p => p.id === q.perspective)?.color,
                          marginRight: "4px"
                        }}>
                          {bscPerspectives.find(p => p.id === q.perspective)?.name}
                        </span>
                      ) : null}
                      Used {q.used || 0} times
                    </div>
                  </div>
                  <button
                    style={{ ...styles.button, ...styles.smallButton }}
                    onClick={() => {
                      handleAddFromQuestionBank(q);
                      setShowAddQuestionModal(false);
                    }}
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
              </div>
            ))}
        </div>
      </Modal>

      <Modal
        title="Launch Survey"
        isOpen={showLaunchModal}
        onClose={() => setShowLaunchModal(false)}
      >
        <div
          style={{
            background: "#ecfeff",
            border: "1px solid #67e8f9",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#155e75",
            marginBottom: "16px"
          }}
        >
          Launching the survey will immediately make it live for selected employees.
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Survey Audience</label>
          <select
            style={styles.select}
            value={launchAudience}
            onChange={(e) => setLaunchAudience(e.target.value)}
          >
            <option value="all">All Employees</option>
            <option value="department">Specific Departments</option>
            <option value="location">Specific Locations</option>
          </select>
        </div>

        <div style={{ marginTop: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={launchNotify}
              onChange={(e) => setLaunchNotify(e.target.checked)}
            />
            <span style={{ fontSize: "14px" }}>
              Notify employees via email & in-app notification
            </span>
          </label>
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "13px",
            marginTop: "16px"
          }}
        >
          <strong>Launch Summary</strong>
          <div>Audience: <strong>{launchAudience}</strong></div>
          <div>Status: <strong>Live immediately</strong></div>
          <div>Notifications: <strong>{launchNotify ? "Yes" : "No"}</strong></div>
          {selectedPerspective !== "all" && (
            <div>BSC Perspective: <strong>{bscPerspectives.find(p => p.id === selectedPerspective)?.name}</strong></div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "20px"
          }}
        >
          <button
            style={styles.button}
            onClick={() => setShowLaunchModal(false)}
          >
            Cancel
          </button>

          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleLaunchSurvey}
          >
            <Send size={16} /> Launch Now
          </button>
        </div>
      </Modal>

      <Modal
        title="Schedule Survey Campaign"
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      >
        <div
          style={{
            background: "#eff6ff",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#1e40af",
            marginBottom: "16px"
          }}
        >
          Choose when and how often this survey should be sent to participants.
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Schedule Type</label>
          <select
            style={styles.select}
            value={scheduling}
            onChange={(e) => setScheduling(e.target.value)}
          >
            <option value="immediate">Send Immediately</option>
            <option value="scheduled">Schedule for Later</option>
            <option value="recurring">Recurring Campaign</option>
          </select>
        </div>

        {scheduling === "scheduled" && (
          <>
            <div style={styles.grid2Col}>
              <div>
                <label style={styles.label}>Start Date</label>
                <input
                  type="date"
                  style={styles.input}
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label style={styles.label}>Start Time</label>
                <input
                  type="time"
                  style={styles.input}
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
            </div>

            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
              The survey will automatically launch at the selected date and time.
            </p>
          </>
        )}

        {scheduling === "recurring" && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Recurrence Pattern</label>
            <select
              style={styles.select}
              value={recurrencePattern}
              onChange={(e) => setRecurrencePattern(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>

            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
              The survey will repeat automatically based on the selected frequency.
            </p>
          </div>
        )}

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "13px"
          }}
        >
          <strong>Schedule Summary</strong>
          <div style={{ marginTop: "6px" }}>
            Type: <strong>{scheduling}</strong>
          </div>
          {scheduling === "scheduled" && scheduleDate && (
            <div>
              Launch On: <strong>{scheduleDate} at {scheduleTime}</strong>
            </div>
          )}
          {scheduling === "recurring" && (
            <div>
              Frequency: <strong>{recurrencePattern}</strong>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", gap: "12px" }}>
          <button
            style={styles.button}
            onClick={() => setShowScheduleModal(false)}
          >
            Cancel
          </button>

          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleScheduleSurvey}
          >
            Confirm Schedule
          </button>
        </div>
      </Modal>

      <Modal
        title="Send Survey Reminder"
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
      >
        <div
          style={{
            background: "#fff7ed",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "14px",
            color: "#9a3412",
            marginBottom: "16px"
          }}
        >
          Reminders will be sent only to employees who haven't completed the survey.
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Reminder Audience</label>
          <select
            style={styles.select}
            value={reminderAudience}
            onChange={(e) => setReminderAudience(e.target.value)}
          >
            <option value="nonRespondents">Non-Respondents Only</option>
            <option value="all">All Participants</option>
            <option value="partial">Partially Completed</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Delivery Channel</label>
          <select
            style={styles.select}
            value={reminderChannel}
            onChange={(e) => setReminderChannel(e.target.value)}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="inApp">In-App Notification</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Reminder Message</label>
          <textarea
            style={{ ...styles.input, minHeight: "80px" }}
            placeholder="Optional custom reminder message"
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
          />
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
            If left blank, a default reminder message will be used.
          </div>
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "13px",
            marginTop: "16px"
          }}
        >
          <strong>Reminder Summary</strong>
          <div>Audience: <strong>{reminderAudience}</strong></div>
          <div>Channel: <strong>{reminderChannel}</strong></div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "20px"
          }}
        >
          <button
            style={styles.button}
            onClick={() => setShowReminderModal(false)}
          >
            Cancel
          </button>

          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleSendReminders}
          >
            Send Reminder
          </button>
        </div>
      </Modal>

      <Modal
        title="Survey QR Code"
        isOpen={showQRCodeModal}
        onClose={() => setShowQRCodeModal(false)}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "200px",
              height: "200px",
              background: "#f3f4f6",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontWeight: "600",
              fontSize: "14px",
              color: "#6b7280"
            }}
          >
            QR CODE PREVIEW
            <div style={{ fontSize: "10px", marginTop: "8px" }}>
              Scan to open: {shareLink || "Survey Link"}
            </div>
          </div>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Scan to open the survey
          </p>
          <div style={{ marginTop: "16px", fontSize: "12px", color: "#3b82f6", wordBreak: "break-all" }}>
            {shareLink || "No link generated yet"}
          </div>
          <button
            style={{ ...styles.button, ...styles.primaryButton, marginTop: "16px" }}
            onClick={handleShareSurvey}
          >
            <Copy size={16} /> Copy Link
          </button>
        </div>
      </Modal>

      {/* BSC Modal */}
      <Modal
        title="Add Strategic Objective"
        isOpen={showBscModal}
        onClose={() => setShowBscModal(false)}
        width="700px"
      >
        <div style={{ marginBottom: "16px" }}>
          <label style={styles.label}>Objective Name *</label>
          <input
            type="text"
            style={styles.input}
            placeholder="e.g., Improve customer satisfaction score"
            value={strategicAlignment.objective}
            onChange={(e) => setStrategicAlignment({ ...strategicAlignment, objective: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={styles.label}>BSC Perspective</label>
          <select
            style={styles.select}
            value={selectedPerspective}
            onChange={(e) => setSelectedPerspective(e.target.value)}
          >
            <option value="all">Strategic (All Perspectives)</option>
            {bscPerspectives.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.weight}%)</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={styles.label}>Key Performance Indicators (KPIs)</label>
          <textarea
            style={{ ...styles.textarea, minHeight: "100px" }}
            placeholder="Enter KPIs (one per line)"
            value={strategicAlignment.kpis.join('\n')}
            onChange={(e) => setStrategicAlignment({
              ...strategicAlignment,
              kpis: e.target.value.split('\n').filter(kpi => kpi.trim())
            })}
          />
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
            Enter each KPI on a new line
          </div>
        </div>

        <div style={{
          background: "#f0f9ff",
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #bae6fd",
          marginBottom: "20px"
        }}>
          <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
            Strategic Alignment Summary
          </div>
          <div style={{ fontSize: "13px", color: "#374151" }}>
            <div><strong>Perspective:</strong> {bscPerspectives.find(p => p.id === selectedPerspective)?.name || "Strategic"}</div>
            <div><strong>KPIs:</strong> {strategicAlignment.kpis.length} defined</div>
            <div><strong>Weight:</strong> {bscPerspectives.find(p => p.id === selectedPerspective)?.weight || 0}%</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            style={styles.button}
            onClick={() => setShowBscModal(false)}
          >
            Cancel
          </button>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleAddBscObjective}
          >
            <Target size={16} /> Add Objective
          </button>
        </div>
      </Modal>

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
        <div style={{
          fontSize: "14px",
          color: "#374151",
          marginBottom: "16px",
          padding: "12px",
          background: statusModal.type === "success" ? "#d1fae5" :
            statusModal.type === "warning" ? "#fef3c7" : "#dbeafe",
          borderRadius: "8px",
          border: `1px solid ${statusModal.type === "success" ? "#10b981" :
            statusModal.type === "warning" ? "#f59e0b" : "#3b82f6"}`
        }}>
          {statusModal.message}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
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