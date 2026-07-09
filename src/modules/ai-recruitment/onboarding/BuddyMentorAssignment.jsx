import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Icon } from '@iconify/react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL, API_ENDPOINTS } from '../../../shared/constants/api.config';
import StatCard from "../../../shared/components/StatCard";
import BuddyCreateProgramModal from "../../hrms/modal/BuddyCreateProgramModal";
import BuddyAssignmentModal from "../../hrms/modal/BuddyAssignmentModal";
import BuddyFeedbackModal from "../../hrms/modal/BuddyFeedbackModal";
import BuddyAnalyticsModal from "../../hrms/modal/BuddyAnalyticsModal";
import BuddyCommunicationModal from "../../hrms/modal/BuddyCommunicationModal";
import BuddyRulesModal from "../../hrms/modal/BuddyRulesModal";
import BuddyChecklistModal from "../../hrms/modal/BuddyChecklistModal";
import BuddyProfileModal from "../../hrms/modal/BuddyProfileModal";
import BuddyNewJoinerProfileModal from "../../hrms/modal/BuddyNewJoinerProfileModal";

const BuddyMentorAssignment = () => {
  const programTypes = [
    "New Hire Buddy Program",
    "Mentorship Program",
    "Cross Functional Buddy",
  ];

  const departments = [
    "All",
    "Engineering",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Product",
    "Design",
  ];

  const locations = [
    "All",
    "Bangalore",
    "Delhi",
    "Mumbai",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Remote",
    "Global",
  ];

  const communicationTypes = [
    "welcome_call",
    "weekly_checkin",
    "welcome_meeting",
    "strategy_session",
    "training_session",
    "progress_review",
    "feedback_session",
    "other",
  ];

  // ==================== BACKEND DATA ====================
  // `employees` is the real, single source of people (GET /employees) —
  // the backend has no separate "buddy" vs "new joiner" table, any
  // employee can be either, so both lists are derived from this one.
  const [employees, setEmployees] = useState([]);
  const [programsRaw, setProgramsRaw] = useState([]); // BuddyProgramListOut[] from GET /buddy-mentor/programs
  const [selectedProgramDetail, setSelectedProgramDetail] = useState(null); // full program + pairings + analytics
  const [loading, setLoading] = useState(true);

  const loadEmployees = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.EMPLOYEES.LIST}`);
      if (!res.ok) throw new Error('Failed to load employees');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load employees from the server');
    }
  }, []);

  const loadPrograms = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BUDDY_MENTOR.PROGRAMS}`);
      if (!res.ok) throw new Error('Failed to load buddy programs');
      const data = await res.json();
      setProgramsRaw(data);
      return data;
    } catch (err) {
      console.error(err);
      toast.error('Failed to load buddy programs from the server');
      return [];
    }
  }, []);

  // Fetches the full detail (rules + pairings + analytics) for one program,
  // and reshapes it into the {assignments, analytics, ...} structure the
  // rest of this page and all 8 modals already expect.
  const loadProgramDetail = useCallback(async (programId) => {
    if (!programId) {
      setSelectedProgramDetail(null);
      return;
    }
    try {
      const [programRes, pairingsRes, analyticsRes] = await Promise.all([
        fetch(`${BASE_URL}${API_ENDPOINTS.BUDDY_MENTOR.PROGRAM(programId)}`),
        fetch(`${BASE_URL}${API_ENDPOINTS.BUDDY_MENTOR.PROGRAM_PAIRINGS(programId)}`),
        fetch(`${BASE_URL}${API_ENDPOINTS.BUDDY_MENTOR.PROGRAM_ANALYTICS(programId)}`),
      ]);
      if (!programRes.ok) throw new Error('Failed to load program details');
      const program = await programRes.json();
      const pairings = pairingsRes.ok ? await pairingsRes.json() : [];
      const analytics = analyticsRes.ok ? await analyticsRes.json() : null;

      setSelectedProgramDetail(mapProgramDetail(program, pairings, analytics));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load program details from the server');
    }
  }, []);

  // ---- mapping helpers: backend shape -> the shape this page/modals use ----
  const mapProgramSummary = (p) => ({
    id: p.id,
    name: p.program_name,
    programType: p.program_type,
    status: (p.status || 'Active').toLowerCase(),
    department: p.department || 'All',
    location: p.location || 'All',
    startDate: p.start_date,
    endDate: p.end_date,
    totalPairs: p.total_pairs || 0,
    activePairs: p.active_pairs || 0,
    overallRating: p.avg_rating || 0,
  });

  const mapProgramDetail = (program, pairings, analytics) => {
    const assignments = pairings.map((pr) => ({
      id: pr.id,
      buddy: {
        id: pr.buddy_id,
        name: pr.buddy_name || `Employee #${pr.buddy_id}`,
        department: pr.buddy_department || '',
        officeLocation: pr.buddy_department || '',
        tenure: '',
        currentAssignments: 0,
        maxAssignments: 3,
        skills: [],
      },
      newJoiner: {
        id: pr.new_joiner_id,
        name: pr.new_joiner_name || `Employee #${pr.new_joiner_id}`,
        department: pr.new_joiner_department || '',
        location: pr.new_joiner_department || '',
        assignedBuddy: true,
        skills: [],
      },
      assignmentDate: pr.assignment_date,
      status: (pr.status || 'Active').toLowerCase(),
      matchScore: pr.match_score || 0,
      pairingReason: '',
      communicationRecords: [], // loaded lazily per-assignment, see loadCommunications()
      lastCheckIn: pr.last_checkin || null,
      nextCheckIn: null,
      feedbackScore: pr.feedback_score || 0,
      completionPercentage: pr.progress || 0,
      milestones: [],
    }));

    return {
      id: program.id,
      name: program.program_name,
      description: program.description || '',
      programType: program.program_type,
      department: program.department || 'All',
      location: program.location || 'All',
      startDate: program.start_date,
      endDate: program.end_date,
      status: (program.status || 'Active').toLowerCase(),
      createdBy: program.created_by,
      createdAt: program.created_on ? program.created_on.split('T')[0] : '',
      assignmentRules: (program.assignment_rules || []).map((r) => ({
        id: r.id,
        rule: r.rule_text,
        mandatory: r.is_mandatory,
        weight: r.weight_score,
      })),
      assignments,
      feedback: [], // loaded lazily when the Feedback tab / modal needs it
      buddyResponsibilities: [], // NOTE: no backend table for onboarding-checklist tasks yet — see note below
      totalPairs: analytics?.total_pairs ?? assignments.length,
      activePairs: analytics?.active_pairs ?? assignments.filter(a => a.status === 'active').length,
      completionRate: analytics?.completion_rate ?? 0,
      overallRating: analytics?.avg_rating ?? 0,
      analytics: analytics ? {
        totalPairs: analytics.total_pairs,
        activePairs: analytics.active_pairs,
        completedPairs: analytics.completed_pairs,
        averageRating: analytics.avg_rating || 0,
        completionRate: analytics.completion_rate || 0,
        feedbackCount: analytics.feedback_count || 0,
        averageMatchScore: analytics.avg_match_score || 0,
        departmentDistribution: Object.fromEntries((analytics.department_distribution || []).map(d => [d.department, d.count])),
        locationDistribution: Object.fromEntries((analytics.location_distribution || []).map(l => [l.location, l.count])),
        satisfactionScore: analytics.satisfaction_score || 0,
        timeToProductivity: analytics.time_to_productivity_days ? `${analytics.time_to_productivity_days} days` : 'N/A',
      } : {
        totalPairs: 0, activePairs: 0, completedPairs: 0, averageRating: 0,
        completionRate: 0, feedbackCount: 0, averageMatchScore: 0,
        departmentDistribution: {}, locationDistribution: {}, satisfactionScore: 0, timeToProductivity: 'N/A',
      },
    };
  };

  // buddyPrograms: the list view uses summaries; once a program is selected
  // its entry is swapped for the fully-loaded detail (with real assignments).
  const buddyPrograms = useMemo(() => {
    return programsRaw.map((p) =>
      selectedProgramDetail && selectedProgramDetail.id === p.id
        ? selectedProgramDetail
        : mapProgramSummary(p)
    );
  }, [programsRaw, selectedProgramDetail]);

  const employeeToTenure = (joiningDate) => {
    if (!joiningDate) return '0 years';
    const years = (Date.now() - new Date(joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    return `${years.toFixed(1)} years`;
  };

  const employeeName = (e) => [e.first_name, e.middle_name, e.last_name].filter(Boolean).join(' ');

  // Any employee can be a buddy; current/max assignment counts are computed
  // against the SELECTED program's real pairings (maxAssignments has no
  // backend field, defaulted to 3 — a business rule, not persisted data).
  const buddies = useMemo(() => {
    const pairings = selectedProgramDetail?.assignments || [];
    return employees.map((e) => ({
      id: e.id,
      name: employeeName(e),
      department: e.department || '',
      officeLocation: e.location || '',
      tenure: employeeToTenure(e.joining_date),
      currentAssignments: pairings.filter((a) => a.buddy.id === e.id && a.status === 'active').length,
      maxAssignments: 3,
      totalMentees: pairings.filter((a) => a.buddy.id === e.id).length,
      skills: [],
    }));
  }, [employees, selectedProgramDetail]);

  const newJoiners = useMemo(() => {
    const pairings = selectedProgramDetail?.assignments || [];
    return employees.map((e) => ({
      id: e.id,
      name: employeeName(e),
      department: e.department || '',
      location: e.location || '',
      assignedBuddy: pairings.some((a) => a.newJoiner.id === e.id),
      skills: [],
    }));
  }, [employees, selectedProgramDetail]);

  const [showCreateProgram, setShowCreateProgram] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showBuddyProfile, setShowBuddyProfile] = useState(false);
  const [showNewJoinerProfile, setShowNewJoinerProfile] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [selectedNewJoiner, setSelectedNewJoiner] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [programForm, setProgramForm] = useState({
    name: "",
    description: "",
    programType: "New Hire Buddy Program",
    department: "All",
    location: "All",
    startDate: "",
    endDate: "",
    status: "active",
    assignmentRules: [
      {
        id: 1,
        rule: "Buddies must have minimum 1 year tenure",
        mandatory: true,
        weight: 40,
      },
      {
        id: 2,
        rule: "Same department pairing preferred",
        mandatory: false,
        weight: 30,
      },
    ],
  });

  const [assignmentForm, setAssignmentForm] = useState({
    programId: null,
    buddyId: null,
    newJoinerId: null,
    assignmentDate: new Date().toISOString().split("T")[0],
    notes: "",
    pairingReason: "",
  });

  const [feedbackForm, setFeedbackForm] = useState({
    assignmentId: null,
    submittedBy: "",
    role: "newJoiner",
    overallRating: 0,
    categories: [
      { category: "Responsiveness", rating: 0, comment: "" },
      { category: "Knowledge Sharing", rating: 0, comment: "" },
      { category: "Support", rating: 0, comment: "" },
      { category: "Communication", rating: 0, comment: "" },
    ],
    overallComment: "",
    improvementSuggestions: "",
    wouldRecommend: true,
    anonymous: false,
  });

  const [communicationForm, setCommunicationForm] = useState({
    assignmentId: null,
    type: "weekly_checkin",
    date: new Date().toISOString().split("T")[0],
    duration: "",
    topics: "",
    followUp: "",
    notes: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [viewMode, setViewMode] = useState("programs");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadEmployees();
      const programs = await loadPrograms();
      if (programs.length > 0) {
        setSelectedProgram(mapProgramSummary(programs[0]));
        await loadProgramDetail(programs[0].id);
      }
      setLoading(false);
    };
    init();
  }, [loadEmployees, loadPrograms, loadProgramDetail]);

  // Keep selectedProgram in sync with the fully-loaded detail once it arrives
  useEffect(() => {
    if (selectedProgramDetail) {
      setSelectedProgram(selectedProgramDetail);
    }
  }, [selectedProgramDetail]);

  const handleSelectProgram = async (program) => {
    setSelectedProgram(program);
    await loadProgramDetail(program.id);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>,
      completed: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">Completed</span>,
      draft: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-slate-50 text-slate-500 border border-slate-150">Draft</span>,
      archived: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">Archived</span>,
      paused: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">Paused</span>,
    };
    return badges[status] || <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">{status}</span>;
  };

  const getCommunicationTypeBadge = (type) => {
    const badges = {
      welcome_call: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">Welcome Call</span>,
      weekly_checkin: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Weekly Check-in</span>,
      welcome_meeting: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-100">Welcome Meeting</span>,
      strategy_session: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">Strategy Session</span>,
      training_session: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">Training Session</span>,
      progress_review: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-100">Progress Review</span>,
      feedback_session: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">Feedback Session</span>,
    };
    return badges[type] || <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-150">{type.replace(/_/g, ' ')}</span>;
  };

  const calculateMatchScore = (buddy, newJoiner, program) => {
    if (!buddy || !newJoiner || !program) return 0;

    let score = 0;
    let maxPossibleScore = 0;

    program.assignmentRules?.forEach((rule) => {
      maxPossibleScore += rule.weight;

      let ruleMatched = false;

      switch (rule.id) {
        case 1:
          const tenureYears = parseInt(buddy.tenure) || 0;
          ruleMatched = tenureYears >= 1;
          break;
        case 2:
          ruleMatched = buddy.department === newJoiner.department;
          break;
        case 3:
        case 4:
          ruleMatched = true;
          break;
        case 5:
          ruleMatched = buddy.currentAssignments < buddy.maxAssignments;
          break;
        case 6:
          ruleMatched = buddy.officeLocation === newJoiner.location;
          break;
        case 7:
          const commonSkills =
            buddy.skills?.filter((skill) => newJoiner.skills?.includes(skill))
              .length || 0;
          ruleMatched = commonSkills > 0;
          break;
        default:
          ruleMatched = true;
      }

      if (ruleMatched) {
        score += rule.weight;
      }
    });

    return maxPossibleScore > 0 ? Math.round((score / maxPossibleScore) * 100) : 0;
  };

  const filterPrograms = () => {
    let filtered = buddyPrograms;

    if (activeTab !== "all") {
      filtered = filtered.filter((program) => program.status === activeTab);
    }

    if (filterDepartment !== "all") {
      filtered = filtered.filter(
        (program) =>
          program.department === filterDepartment ||
          program.department === "All"
      );
    }

    if (filterLocation !== "all") {
      filtered = filtered.filter(
        (program) =>
          program.location === filterLocation || program.location === "All"
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (program) =>
          program.name.toLowerCase().includes(term) ||
          program.description.toLowerCase().includes(term) ||
          program.programType.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const handleCreateProgram = async () => {
    if (!programForm.name || !programForm.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        program_name: programForm.name,
        program_type: programForm.programType,
        description: programForm.description || null,
        department: programForm.department,
        location: programForm.location,
        start_date: programForm.startDate,
        end_date: programForm.endDate || null,
        status: programForm.status.charAt(0).toUpperCase() + programForm.status.slice(1),
        created_by: "Sarah Johnson", // TODO: replace with real logged-in admin name once available here
        assignment_rules: programForm.assignmentRules.map((r) => ({
          rule_text: r.rule,
          is_mandatory: r.mandatory,
          weight_score: r.weight,
        })),
      };

      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BUDDY_MENTOR.PROGRAMS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ? JSON.stringify(err.detail) : 'Failed to create program');
      }
      const created = await res.json();

      setShowCreateProgram(false);
      setProgramForm({
        name: "",
        description: "",
        programType: "New Hire Buddy Program",
        department: "All",
        location: "All",
        startDate: "",
        endDate: "",
        status: "active",
        assignmentRules: [
          { id: 1, rule: "Buddies must have minimum 1 year tenure", mandatory: true, weight: 40 },
          { id: 2, rule: "Same department pairing preferred", mandatory: false, weight: 30 },
        ],
      });

      toast.success("Buddy program created successfully!");
      const programs = await loadPrograms();
      setSelectedProgram(mapProgramSummary(created));
      await loadProgramDetail(created.id);
      return programs;
    } catch (err) {
      toast.error(err.message || 'Failed to create program');
    }
  };

  const handleAssignBuddy = async () => {
    const {
      programId,
      buddyId,
      newJoinerId,
      assignmentDate,
      notes,
      pairingReason,
    } = assignmentForm;

    if (!programId || !buddyId || !newJoinerId) {
      toast.error("Please select program, buddy, and new joiner");
      return;
    }

    const program = buddyPrograms.find((p) => p.id === programId);
    const buddy = buddies.find((b) => b.id === buddyId);
    const newJoiner = newJoiners.find((n) => n.id === newJoinerId);

    if (!program || !buddy || !newJoiner) {
      toast.error("Invalid selection");
      return;
    }

    if (buddy.currentAssignments >= buddy.maxAssignments) {
      toast.error("Selected buddy has reached maximum assignments");
      return;
    }

    if (newJoiner.assignedBuddy) {
      toast.error("This new joiner already has a buddy assigned");
      return;
    }

    const matchScore = calculateMatchScore(buddy, newJoiner, program);

    try {
      const payload = {
        program_id: programId,
        buddy_id: buddyId,
        new_joiner_id: newJoinerId,
        assignment_date: assignmentDate || new Date().toISOString().split("T")[0],
        match_score: matchScore,
        status: 'Active',
      };

      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BUDDY_MENTOR.PAIRINGS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ? JSON.stringify(err.detail) : 'Failed to assign buddy');
      }

      setShowAssignmentModal(false);
      setAssignmentForm({
        programId: null,
        buddyId: null,
        newJoinerId: null,
        assignmentDate: new Date().toISOString().split("T")[0],
        notes: "",
        pairingReason: "",
      });
      toast.success("Buddy assigned successfully!");
      await loadProgramDetail(programId); // buddies/newJoiners recompute automatically from this
      await loadPrograms();
    } catch (err) {
      toast.error(err.message || 'Failed to assign buddy');
    }
  };

  const handleSubmitFeedback = async (formData) => {
    const {
      assignmentId,
      submittedBy,
      overallRating,
      categories,
      overallComment,
      anonymous,
    } = formData;

    if (!assignmentId || !submittedBy || !overallRating) {
      toast.error("Please fill all required fields");
      return;
    }

    const catByName = (name) => categories.find((c) => c.category === name) || {};

    try {
      const payload = {
        pairing_id: Number(assignmentId),
        submitted_by: anonymous ? 'Anonymous' : submittedBy,
        overall_rating: Math.round(parseFloat(overallRating)),
        responsiveness: catByName('Responsiveness').rating ? Math.round(catByName('Responsiveness').rating) : null,
        knowledge_sharing: catByName('Knowledge Sharing').rating ? Math.round(catByName('Knowledge Sharing').rating) : null,
        support: catByName('Support').rating ? Math.round(catByName('Support').rating) : null,
        communication: catByName('Communication').rating ? Math.round(catByName('Communication').rating) : null,
        overall_comments: overallComment || null,
        responsiveness_comments: catByName('Responsiveness').comment || null,
        knowledge_sharing_comments: catByName('Knowledge Sharing').comment || null,
        support_comments: catByName('Support').comment || null,
        communication_comments: catByName('Communication').comment || null,
      };

      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BUDDY_MENTOR.FEEDBACK}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ? JSON.stringify(err.detail) : 'Failed to submit feedback');
      }

      setShowFeedbackModal(false);
      toast.success("Feedback submitted successfully!");
      if (selectedProgram) await loadProgramDetail(selectedProgram.id);
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback');
    }
  };

  // Frontend offers more granular labels than the backend's 4-value enum —
  // map each to the closest real CommunicationType.
  const communicationTypeToBackend = {
    welcome_call: 'Onboarding Session',
    weekly_checkin: 'Weekly Checkin',
    welcome_meeting: 'Onboarding Session',
    strategy_session: 'Monthly Review',
    training_session: 'Ad Hoc',
    progress_review: 'Monthly Review',
    feedback_session: 'Ad Hoc',
    other: 'Ad Hoc',
  };

  const handleRecordCommunication = async (formData) => {
    const {
      assignmentId,
      type,
      date,
      duration = "",
      topics = "",
      followUp = "",
      notes = "",
    } = formData;

    if (!assignmentId || !date) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      const payload = {
        pairing_id: Number(assignmentId),
        communication_type: communicationTypeToBackend[type] || 'Ad Hoc',
        date,
        duration_minutes: duration ? parseInt(duration, 10) : null,
        topics_discussed: topics || null,
        follow_up_actions: followUp || null,
        additional_notes: notes || null,
      };

      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BUDDY_MENTOR.COMMUNICATIONS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ? JSON.stringify(err.detail) : 'Failed to record communication');
      }

      setShowCommunicationModal(false);
      toast.success("Communication recorded successfully!");
      if (selectedProgram) await loadProgramDetail(selectedProgram.id);
    } catch (err) {
      toast.error(err.message || 'Failed to record communication');
    }
  };

  // NOTE: there is no backend table for onboarding-checklist tasks (the
  // buddy-mentor API covers programs/pairings/feedback/communications only)
  // so this stays local-only and does not persist across a page reload.
  // buddyResponsibilities is always [] from the backend (see
  // mapProgramDetail above), so in practice this is currently a no-op;
  // left in place rather than removed in case a checklist table gets added.
  const handleUpdateTaskStatus = (programId, taskId, newStatus) => {
    toast.info("Checklist tasks aren't saved to the server yet — no backend table exists for them.");
  };

  const handleAutoMatch = async (programId) => {
    const program = buddyPrograms.find((p) => p.id === programId);
    if (!program) return;

    const unassignedNewJoiners = newJoiners.filter((n) => !n.assignedBuddy);
    const availableBuddies = buddies.filter(
      (b) => b.currentAssignments < b.maxAssignments
    );

    if (unassignedNewJoiners.length === 0) {
      toast.error("No unassigned new joiners available");
      return;
    }

    if (availableBuddies.length === 0) {
      toast.error("No available buddies for assignment");
      return;
    }

    // Client-side matching against the program's real assignment rules —
    // the backend's /pairings/auto-match endpoint scores ONE candidate pair
    // at a time rather than searching across all of them, so picking the
    // best pairing still happens here; each chosen match is then persisted
    // as a real pairing via POST /pairings, same as a manual assignment.
    const matches = [];
    const buddyLoad = {}; // local tracker so one buddy isn't over-assigned within this batch

    unassignedNewJoiners.forEach((newJoiner) => {
      let bestMatch = null;
      let bestScore = 0;

      availableBuddies.forEach((buddy) => {
        const used = buddyLoad[buddy.id] || 0;
        if (buddy.currentAssignments + used >= buddy.maxAssignments) return;

        const score = calculateMatchScore(buddy, newJoiner, program);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = buddy;
        }
      });

      if (bestMatch && bestScore >= 60) {
        matches.push({ newJoinerId: newJoiner.id, buddyId: bestMatch.id, score: bestScore });
        buddyLoad[bestMatch.id] = (buddyLoad[bestMatch.id] || 0) + 1;
      }
    });

    if (matches.length === 0) {
      toast.error("No suitable matches found (minimum 60% match score required)");
      return;
    }

    try {
      await Promise.all(
        matches.map((match) =>
          fetch(`${BASE_URL}${API_ENDPOINTS.BUDDY_MENTOR.PAIRINGS}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              program_id: programId,
              buddy_id: match.buddyId,
              new_joiner_id: match.newJoinerId,
              assignment_date: new Date().toISOString().split('T')[0],
              match_score: match.score,
              status: 'Active',
            }),
          })
        )
      );

      toast.success(`${matches.length} new joiners auto-matched with buddies!`);
      await loadProgramDetail(programId);
      await loadPrograms();
    } catch (err) {
      toast.error('Auto-match failed to save one or more pairings');
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleExportData = (type) => {
    let data, filename, contentType;

    switch (type) {
      case "programs":
        data = buddyPrograms;
        filename = "buddy-programs.json";
        contentType = "application/json";
        break;

      case "assignments":
        const allAssignments = buddyPrograms.flatMap((p) => p.assignments || []);
        data = allAssignments;
        filename = "buddy-assignments.json";
        contentType = "application/json";
        break;

      case "analytics":
        if (!selectedProgram?.analytics) return;

        const analytics = selectedProgram.analytics;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Program Analytics Report", 14, 20);

        doc.setFontSize(12);
        doc.text(`Program: ${selectedProgram.name}`, 14, 30);

        autoTable(doc, {
          startY: 40,
          head: [["Metric", "Value"]],
          body: [
            ["Total Pairs", analytics.totalPairs],
            ["Active Pairs", analytics.activePairs],
            ["Completed Pairs", analytics.completedPairs],
            ["Completion Rate", `${analytics.completionRate}%`],
            ["Average Rating", `${analytics.averageRating}/5`],
            ["Feedback Count", analytics.feedbackCount],
            ["Average Match Score", `${analytics.averageMatchScore}/100`],
            ["Satisfaction Score", `${analytics.satisfactionScore}/5`],
            ["Time to Productivity", analytics.timeToProductivity],
          ],
        });

        if (analytics.departmentDistribution) {
          autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["Department", "Pairs"]],
            body: Object.entries(analytics.departmentDistribution),
          });
        }

        if (analytics.locationDistribution) {
          autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["Location", "Pairs"]],
            body: Object.entries(analytics.locationDistribution),
          });
        }

        doc.save(`${selectedProgram.name}_Analytics_Report.pdf`);
        return;

      default:
        return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: contentType,
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Icon icon="svg-spinners:180-ring" className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 text-sm font-semibold">Loading Buddy/Mentor Assignment Module...</p>
      </div>
    );
  }

  const filteredPrograms = filterPrograms();

  return (
    <div className="w-full mx-auto max-w-7xl space-y-4 sm:space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <div className="text-sm text-slate-500">Loading buddy/mentor programs…</div>}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Icon icon="heroicons:user-group" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Buddy / Mentor Assignment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
            Facilitate successful onboarding through structured buddy programs
          </p>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm bg-white"
            onClick={() => setShowAssignmentModal(true)}
          >
            <Icon icon="heroicons:user-plus" className="w-4 h-4 text-slate-500" />
            <span className="hidden xs:inline">Create Pairing</span>
            <span className="xs:hidden">Pairing</span>
          </button>

          <button
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm bg-white"
            onClick={() => setShowCommunicationModal(true)}
          >
            <Icon icon="heroicons:chat-bubble-left-right" className="w-4 h-4 text-slate-500" />
            <span className="hidden xs:inline">Record Communication</span>
            <span className="xs:hidden">Record</span>
          </button>

          <button
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            onClick={() => setShowCreateProgram(true)}
          >
            <Icon icon="heroicons:plus-circle" className="w-4 h-4" />
            <span className="hidden xs:inline">Create Program</span>
            <span className="xs:hidden">Program</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Buddy Programs"
          value={buddyPrograms.length}
          subtitle={`${buddyPrograms.filter((p) => p.status === "active").length} Active Programs`}
          icon="heroicons:folder-open"
          color="skyBlue"
        />
        <StatCard
          title="Total Active Pairings"
          value={buddyPrograms.reduce((sum, program) => sum + (program.totalPairs || 0), 0)}
          subtitle={`${buddyPrograms.reduce((sum, program) => sum + (program.activePairs || 0), 0)} Ongoing`}
          icon="heroicons:users"
          color="cyan"
        />
        <StatCard
          title="Available Buddies"
          value={buddies.filter((b) => b.currentAssignments < b.maxAssignments).length}
          subtitle={`${buddies.length} Total Registered Mentees`}
          icon="heroicons:user-plus"
          color="yellow"
        />
        <StatCard
          title="Avg. Program Rating"
          value={
            buddyPrograms.length > 0
              ? (
                buddyPrograms.reduce((sum, program) => sum + (program.overallRating || 0), 0) /
                buddyPrograms.length
              ).toFixed(1) + "/5"
              : "0.0/5"
          }
          subtitle="Based on mentee feedback"
          icon="heroicons:star"
          color="blue"
        />
      </div>

      <div className="border border-slate-200 bg-slate-50/50 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 overflow-x-auto">
        <div className="flex flex-wrap gap-1 min-w-[280px]">
          <button
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${viewMode === "programs"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
              }`}
            onClick={() => setViewMode("programs")}
          >
            <Icon icon="heroicons:folder" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Buddy Programs</span>
            <span className="xs:hidden">Programs</span>
            <span className="inline-flex items-center justify-center w-4 h-4 text-[8px] sm:text-[9px] font-bold bg-white/20 rounded-full">
              {buddyPrograms.length}
            </span>
          </button>
          <button
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${viewMode === "buddies"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
              }`}
            onClick={() => setViewMode("buddies")}
          >
            <Icon icon="heroicons:identification" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Buddies</span>
            <span className="xs:hidden">Buddies</span>
            <span className="inline-flex items-center justify-center w-4 h-4 text-[8px] sm:text-[9px] font-bold bg-white/20 rounded-full">
              {buddies.length}
            </span>
          </button>
          <button
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${viewMode === "newJoiners"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
              }`}
            onClick={() => setViewMode("newJoiners")}
          >
            <Icon icon="heroicons:user-plus" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">New Joiners</span>
            <span className="xs:hidden">Joiners</span>
            <span className="inline-flex items-center justify-center w-4 h-4 text-[8px] sm:text-[9px] font-bold bg-white/20 rounded-full">
              {newJoiners.filter((n) => !n.assignedBuddy).length}
            </span>
          </button>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-white shadow-sm">
        <h3 className="text-[10px] sm:text-xs font-bold text-slate-800 mb-2.5 sm:mb-3">Quick Operations</h3>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          <button
            className="flex flex-col items-center justify-center p-2 sm:p-3 border border-slate-150 hover:border-blue-500 hover:bg-blue-50/20 rounded-lg sm:rounded-xl transition-all gap-1 text-center group bg-white"
            onClick={() => setShowCreateProgram(true)}
          >
            <Icon icon="heroicons:plus-circle" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] sm:text-xs font-medium text-slate-700 leading-tight">Create Program</span>
          </button>

          <button
            className="flex flex-col items-center justify-center p-2 sm:p-3 border border-slate-150 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-lg sm:rounded-xl transition-all gap-1 text-center group bg-white"
            onClick={() => setShowAssignmentModal(true)}
          >
            <Icon icon="heroicons:user-plus" className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] sm:text-xs font-medium text-slate-700 leading-tight">Create Pairing</span>
          </button>

          <button
            className="flex flex-col items-center justify-center p-2 sm:p-3 border border-slate-150 hover:border-cyan-500 hover:bg-cyan-50/20 rounded-lg sm:rounded-xl transition-all gap-1 text-center group bg-white"
            onClick={() => setShowCommunicationModal(true)}
          >
            <Icon icon="heroicons:chat-bubble-left-right" className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] sm:text-xs font-medium text-slate-700 leading-tight">Record Chat</span>
          </button>

          <button
            className="flex flex-col items-center justify-center p-2 sm:p-3 border border-slate-150 hover:border-amber-500 hover:bg-amber-50/20 rounded-lg sm:rounded-xl transition-all gap-1 text-center group bg-white"
            onClick={() => setShowFeedbackModal(true)}
          >
            <Icon icon="heroicons:star" className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] sm:text-xs font-medium text-slate-700 leading-tight">Submit Feedback</span>
          </button>

          <button
            className="flex flex-col items-center justify-center p-2 sm:p-3 border border-slate-150 hover:border-indigo-500 hover:bg-indigo-50/20 rounded-lg sm:rounded-xl transition-all gap-1 text-center group disabled:opacity-40 bg-white"
            onClick={() => selectedProgram && setShowAnalyticsModal(true)}
            disabled={!selectedProgram}
          >
            <Icon icon="heroicons:presentation-chart-line" className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] sm:text-xs font-medium text-slate-700 leading-tight">View Analytics</span>
          </button>

          <button
            className="flex flex-col items-center justify-center p-2 sm:p-3 border border-slate-150 hover:border-purple-500 hover:bg-purple-50/20 rounded-lg sm:rounded-xl transition-all gap-1 text-center group disabled:opacity-40 bg-white"
            onClick={() => selectedProgram && handleAutoMatch(selectedProgram.id)}
            disabled={!selectedProgram}
          >
            <Icon icon="heroicons:cpu-chip" className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] sm:text-xs font-medium text-slate-700 leading-tight">Auto-match</span>
          </button>
        </div>
      </div>

      {viewMode === "programs" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 bg-white p-3 sm:p-4 border border-slate-200 rounded-xl sm:rounded-2xl">
            <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
              <button
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${activeTab === "all"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                onClick={() => setActiveTab("all")}
              >
                All Programs
              </button>
              <button
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${activeTab === "active"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                onClick={() => setActiveTab("active")}
              >
                Active
              </button>
              <button
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${activeTab === "completed"
                  ? "bg-slate-600 text-white border-slate-600 shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed
              </button>
              <button
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${activeTab === "draft"
                  ? "bg-slate-600 text-white border-slate-650 shadow-sm"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                onClick={() => setActiveTab("draft")}
              >
                Drafts
              </button>

              <select
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 border border-slate-200 rounded-lg sm:rounded-xl text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 bg-white"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments
                  .filter((d) => d !== "All")
                  .map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
              </select>

              <select
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 border border-slate-200 rounded-lg sm:rounded-xl text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 bg-white"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                {locations
                  .filter((l) => l !== "All")
                  .map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
              </select>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Icon icon="heroicons:magnifying-glass" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <input
                type="text"
                className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-450 hover:text-slate-650"
                  onClick={() => setSearchTerm("")}
                >
                  <Icon icon="heroicons:x-mark" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-200 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-800">Buddy Programs List</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                {filteredPrograms.length} Programs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[10px] sm:text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-2 sm:p-3 cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort("name")}>
                      Program Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="p-2 sm:p-3 whitespace-nowrap hidden sm:table-cell">Type</th>
                    <th className="p-2 sm:p-3 whitespace-nowrap">Status</th>
                    <th className="p-2 sm:p-3 whitespace-nowrap hidden xs:table-cell">Pairs</th>
                    <th className="p-2 sm:p-3 whitespace-nowrap hidden md:table-cell">Rating</th>
                    <th className="p-2 sm:p-3 whitespace-nowrap hidden lg:table-cell">Duration</th>
                    <th className="p-2 sm:p-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-600">
                  {filteredPrograms.map((program) => (
                    <tr
                      key={program.id}
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedProgram?.id === program.id ? "bg-blue-50/40" : ""
                        }`}
                      onClick={() => handleSelectProgram(program)}
                    >
                      <td className="p-2 sm:p-3">
                        <div className="font-bold text-slate-800 text-[10px] sm:text-xs">{program.name}</div>
                        <div className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5 line-clamp-1 hidden xs:block">{program.description}</div>
                        <div className="text-[8px] sm:text-[10px] text-slate-500 font-medium mt-0.5 hidden sm:block">{program.department} • {program.location}</div>
                      </td>
                      <td className="p-2 sm:p-3 hidden sm:table-cell">
                        <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">
                          {program.programType}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3">{getStatusBadge(program.status)}</td>
                      <td className="p-2 sm:p-3 hidden xs:table-cell">
                        <div className="font-bold text-slate-800 text-[10px] sm:text-xs">{program.activePairs}/{program.totalPairs}</div>
                        <div className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5">{program.completionRate}% complete</div>
                      </td>
                      <td className="p-2 sm:p-3 hidden md:table-cell">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <span className="font-bold text-slate-700 text-[10px] sm:text-xs">{program.overallRating}</span>
                          <Icon icon="heroicons:star-solid" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 text-slate-500 text-[8px] sm:text-[10px] hidden lg:table-cell">
                        {program.startDate} to {program.endDate}
                      </td>
                      <td className="p-2 sm:p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                          <button
                            className="p-1 sm:p-1.5 hover:bg-slate-50 text-slate-600 border-r border-slate-150"
                            onClick={() => {
                              handleSelectProgram(program);
                              setShowAnalyticsModal(true);
                            }}
                            title="Analytics"
                          >
                            <Icon icon="heroicons:presentation-chart-line" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                          </button>
                          <button
                            className="p-1 sm:p-1.5 hover:bg-slate-50 text-slate-600 border-r border-slate-150"
                            onClick={() => {
                              handleSelectProgram(program);
                              setAssignmentForm((prev) => ({
                                ...prev,
                                programId: program.id,
                              }));
                              setShowAssignmentModal(true);
                            }}
                            title="Create Pairing"
                          >
                            <Icon icon="heroicons:user-plus" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                          </button>
                          <button
                            className="p-1 sm:p-1.5 hover:bg-slate-50 text-slate-600"
                            onClick={() => handleAutoMatch(program.id)}
                            title="Auto-match"
                          >
                            <Icon icon="heroicons:cpu-chip" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPrograms.length === 0 && (
              <div className="p-6 sm:p-8 text-center text-slate-500 space-y-2">
                <Icon icon="heroicons:folder-open" className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-slate-400" />
                <p className="text-[10px] sm:text-xs">No programs found matching the filters.</p>
                <button
                  type="button"
                  className="px-3 sm:px-3.5 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg text-[10px] sm:text-xs font-bold hover:bg-blue-700 transition-colors"
                  onClick={() => setShowCreateProgram(true)}
                >
                  Create Program
                </button>
              </div>
            )}
          </div>

          {selectedProgram && (
            <div className="border border-slate-250 rounded-xl sm:rounded-2xl bg-white shadow-sm overflow-hidden space-y-4 sm:space-y-6 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-2 sm:pb-3">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Program Details: {selectedProgram.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <button
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-lg text-[10px] sm:text-xs font-semibold shadow-sm bg-white"
                    onClick={() => setShowRulesModal(true)}
                  >
                    <Icon icon="heroicons:queue-list" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Rules
                  </button>
                  <button
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 border border-slate-200 text-slate-655 hover:bg-slate-50 rounded-lg text-[10px] sm:text-xs font-semibold shadow-sm bg-white"
                    onClick={() => setShowChecklistModal(true)}
                  >
                    <Icon icon="heroicons:check-circle" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Checklist
                  </button>
                  <button
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 border border-slate-200 text-slate-660 hover:bg-slate-50 rounded-lg text-[10px] sm:text-xs font-semibold shadow-sm bg-white"
                    onClick={() => setShowAnalyticsModal(true)}
                  >
                    <Icon icon="heroicons:presentation-chart-line" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Analytics                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2.5 sm:space-y-3 bg-slate-50/50">
                  <h4 className="text-[10px] sm:text-xs font-extrabold text-slate-800 border-b border-slate-200 pb-1.5 sm:pb-2">Program Information</h4>
                  <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-bold text-slate-750 text-right ml-2">{selectedProgram.programType}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Department</span><span className="font-bold text-slate-750 text-right ml-2">{selectedProgram.department}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="font-bold text-slate-750 text-right ml-2">{selectedProgram.location}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-bold text-slate-750 text-right ml-2 text-[8px] sm:text-[10px]">{selectedProgram.startDate} to {selectedProgram.endDate}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Status</span><span>{getStatusBadge(selectedProgram.status)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Created By</span><span className="font-bold text-slate-750 text-right ml-2">{selectedProgram.createdBy}</span></div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2.5 sm:space-y-3 bg-slate-50/50">
                  <h4 className="text-[10px] sm:text-xs font-extrabold text-slate-800 border-b border-slate-200 pb-1.5 sm:pb-2">Quick Stats</h4>
                  <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Total Pairs</span><span className="font-bold text-slate-750">{selectedProgram.totalPairs}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Active Pairs</span><span className="font-bold text-slate-750">{selectedProgram.activePairs}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Completion Rate</span><span className="font-bold text-slate-750">{selectedProgram.completionRate}%</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Average Rating</span><span className="font-bold text-slate-750">{selectedProgram.overallRating}/5</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Feedback Recv</span><span className="font-bold text-slate-750">{selectedProgram.feedback?.length || 0}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Created On</span><span className="font-bold text-slate-750 text-right ml-2">{selectedProgram.createdAt}</span></div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2.5 sm:space-y-3 bg-slate-50/50">
                  <h4 className="text-[10px] sm:text-xs font-extrabold text-slate-800 border-b border-slate-200 pb-1.5 sm:pb-2">Recent Feedback</h4>
                  {selectedProgram.feedback?.length > 0 ? (
                    <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto pr-1">
                      {selectedProgram.feedback.slice(0, 3).map((fb) => (
                        <div key={fb.id} className="border-b border-slate-150 pb-2 last:border-b-0 last:pb-0 text-[10px] sm:text-xs">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span className="truncate max-w-[60%]">{fb.submittedBy}</span>
                            <span className="text-amber-500 flex items-center gap-0.5 flex-shrink-0">
                              {fb.overallRating}/5 <Icon icon="heroicons:star-solid" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </span>
                          </div>
                          <p className="text-[8px] sm:text-[10px] text-slate-500 mt-0.5 line-clamp-2 italic">"{fb.overallComment}"</p>
                          <span className="text-[7px] sm:text-[9px] text-slate-400 block mt-0.5">{fb.date}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 sm:p-4 bg-white border border-slate-100 rounded-lg sm:rounded-xl text-center text-[10px] sm:text-xs text-slate-400">
                      No feedback yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-white mt-3 sm:mt-4">
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-200 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-extrabold text-slate-800">Pairings Under Program</span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white rounded-lg text-[9px] sm:text-xs font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                      onClick={() => {
                        setAssignmentForm((prev) => ({
                          ...prev,
                          programId: selectedProgram.id,
                        }));
                        setShowAssignmentModal(true);
                      }}
                    >
                      <Icon icon="heroicons:plus" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden xs:inline">Add Assignment</span>
                      <span className="xs:hidden">Add</span>
                    </button>
                    <button
                      className="px-2 sm:px-3 py-1 sm:py-1.5 border border-slate-200 text-slate-600 rounded-lg text-[9px] sm:text-xs font-bold hover:bg-slate-50 transition-colors inline-flex items-center gap-1 bg-white"
                      onClick={() => handleAutoMatch(selectedProgram.id)}
                    >
                      <Icon icon="heroicons:cpu-chip" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500" />
                      <span className="hidden xs:inline">Auto-match</span>
                      <span className="xs:hidden">Match</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[10px] sm:text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                        <th className="p-2 sm:p-3 whitespace-nowrap">Buddy</th>
                        <th className="p-2 sm:p-3 whitespace-nowrap">New Joiner</th>
                        <th className="p-2 sm:p-3 whitespace-nowrap hidden sm:table-cell">Match Score</th>
                        <th className="p-2 sm:p-3 whitespace-nowrap hidden md:table-cell">Assignment Date</th>
                        <th className="p-2 sm:p-3 whitespace-nowrap hidden lg:table-cell">Last Check-in</th>
                        <th className="p-2 sm:p-3 whitespace-nowrap">Progress</th>
                        <th className="p-2 sm:p-3 whitespace-nowrap hidden xl:table-cell">Feedback Score</th>
                        <th className="p-2 sm:p-3 whitespace-nowrap hidden xs:table-cell">Status</th>
                        <th className="p-2 sm:p-3 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-slate-600">
                      {selectedProgram.assignments?.map((assignment) => (
                        <tr key={assignment.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-2 sm:p-3">
                            <div className="font-bold text-slate-850 text-[10px] sm:text-xs">{assignment.buddy.name}</div>
                            <div className="text-[8px] sm:text-[10px] text-slate-400">{assignment.buddy.department}</div>
                          </td>
                          <td className="p-2 sm:p-3">
                            <div className="font-bold text-slate-850 text-[10px] sm:text-xs">{assignment.newJoiner.name}</div>
                            <div className="text-[8px] sm:text-[10px] text-slate-400">{assignment.newJoiner.department}</div>
                          </td>
                          <td className="p-2 sm:p-3 hidden sm:table-cell">
                            <span
                              className={`inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold ${assignment.matchScore >= 80
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : assignment.matchScore >= 60
                                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                                  : "bg-rose-50 text-rose-700 border border-rose-100"
                                }`}
                            >
                              {assignment.matchScore}/100
                            </span>
                          </td>
                          <td className="p-2 sm:p-3 text-slate-500 text-[8px] sm:text-[10px] hidden md:table-cell">{assignment.assignmentDate}</td>
                          <td className="p-2 sm:p-3 text-slate-500 text-[8px] sm:text-[10px] hidden lg:table-cell">
                            {assignment.lastCheckIn
                              ? new Date(assignment.lastCheckIn).toLocaleDateString("en-GB")
                              : "—"}
                          </td>
                          <td className="p-2 sm:p-3">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <span className="font-bold text-slate-800 text-[9px] sm:text-xs">{assignment.completionPercentage || 0}%</span>
                              <div className="w-10 sm:w-16 bg-slate-100 rounded-full h-1 sm:h-1.5">
                                <div
                                  className="bg-emerald-500 h-1 sm:h-1.5 rounded-full"
                                  style={{ width: `${assignment.completionPercentage || 0}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-2 sm:p-3 font-semibold text-slate-800 text-[10px] sm:text-xs hidden xl:table-cell">
                            {assignment.feedbackScore > 0 ? `${assignment.feedbackScore}/5` : "—"}
                          </td>
                          <td className="p-2 sm:p-3 hidden xs:table-cell">{getStatusBadge(assignment.status)}</td>
                          <td className="p-2 sm:p-3 text-right">
                            <div className="inline-flex border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                              <button
                                className="p-1 sm:p-1.5 hover:bg-slate-50 border-r border-slate-150"
                                onClick={() => {
                                  setSelectedAssignment(assignment);
                                  setCommunicationForm((prev) => ({
                                    ...prev,
                                    assignmentId: assignment.id,
                                  }));
                                  setShowCommunicationModal(true);
                                }}
                                title="Record Communication"
                              >
                                <Icon icon="heroicons:chat-bubble-left-right" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                              </button>
                              <button
                                className="p-1 sm:p-1.5 hover:bg-slate-50"
                                onClick={() => {
                                  setSelectedAssignment(assignment);
                                  setFeedbackForm((prev) => ({
                                    ...prev,
                                    assignmentId: assignment.id,
                                    submittedBy: assignment.newJoiner.name,
                                  }));
                                  setShowFeedbackModal(true);
                                }}
                                title="Submit Feedback"
                              >
                                <Icon icon="heroicons:star" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(!selectedProgram.assignments || selectedProgram.assignments.length === 0) && (
                  <div className="p-4 sm:p-6 text-center text-slate-400 text-[10px] sm:text-xs">
                    No pairings created yet. Click "Add Assignment" to create one.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === "buddies" && (
        <div className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-white">
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-200 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
            <span className="text-[10px] sm:text-xs font-extrabold text-slate-800">Buddy Database</span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                {buddies.filter((b) => b.currentAssignments < b.maxAssignments).length} Available
              </span>
              <button
                className="px-2 sm:px-2.5 py-1 border border-slate-200 text-slate-600 rounded-lg text-[9px] sm:text-xs font-bold hover:bg-slate-50 transition-colors inline-flex items-center gap-1 bg-white shadow-sm"
                onClick={() => handleExportData("assignments")}
              >
                <Icon icon="heroicons:arrow-down-tray" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
                <span className="hidden xs:inline">Export</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10px] sm:text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="p-2 sm:p-3 whitespace-nowrap">Name</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap">Department</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap hidden xs:table-cell">Location</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap hidden sm:table-cell">Tenure</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap hidden md:table-cell">Rating</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap">Assignments</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap hidden sm:table-cell">Availability</th>
                  <th className="p-2 sm:p-3 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-600">
                {buddies.map((buddy) => (
                  <tr key={buddy.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3">
                      <div className="font-bold text-slate-850 text-[10px] sm:text-xs">{buddy.name}</div>
                      <div className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5">{buddy.role}</div>
                    </td>
                    <td className="p-2 sm:p-3 text-[10px] sm:text-xs">{buddy.department}</td>
                    <td className="p-2 sm:p-3 text-[10px] sm:text-xs hidden xs:table-cell">{buddy.officeLocation}</td>
                    <td className="p-2 sm:p-3 text-[10px] sm:text-xs hidden sm:table-cell">{buddy.tenure}</td>
                    <td className="p-2 sm:p-3 hidden md:table-cell">
                      <div className="flex items-center gap-0.5 sm:gap-1 font-bold text-slate-700 text-[10px] sm:text-xs">
                        {buddy.rating}
                        <Icon icon="heroicons:star-solid" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="font-bold text-slate-800 text-[10px] sm:text-xs">{buddy.currentAssignments}/{buddy.maxAssignments}</div>
                      <div className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5 hidden xs:block">{buddy.totalMentees} total</div>
                    </td>
                    <td className="p-2 sm:p-3 hidden sm:table-cell">
                      {buddy.currentAssignments < buddy.maxAssignments ? (
                        <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                          At Capacity
                        </span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-right">
                      <button
                        type="button"
                        className="px-1.5 sm:px-2.5 py-1 border border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-slate-50 rounded-lg text-[9px] sm:text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1 bg-white"
                        onClick={() => {
                          setSelectedBuddy(buddy);
                          setShowBuddyProfile(true);
                        }}
                      >
                        <Icon icon="heroicons:eye" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                        <span className="hidden xs:inline">View Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === "newJoiners" && (
        <div className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-white">
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border-b border-slate-200 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
            <span className="text-[10px] sm:text-xs font-extrabold text-slate-800">New Joiners Database</span>
            <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
              {newJoiners.filter((n) => !n.assignedBuddy).length} Unassigned
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[10px] sm:text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="p-2 sm:p-3 whitespace-nowrap">Name</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap">Department</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap hidden xs:table-cell">Location</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap hidden sm:table-cell">Join Date</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap hidden md:table-cell">Stage</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap hidden lg:table-cell">Skills</th>
                  <th className="p-2 sm:p-3 whitespace-nowrap">Status</th>
                  <th className="p-2 sm:p-3 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-600">
                {newJoiners.map((newJoiner) => (
                  <tr key={newJoiner.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 sm:p-3">
                      <div className="font-bold text-slate-850 text-[10px] sm:text-xs">{newJoiner.name}</div>
                      <div className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5">{newJoiner.role}</div>
                    </td>
                    <td className="p-2 sm:p-3 text-[10px] sm:text-xs">{newJoiner.department}</td>
                    <td className="p-2 sm:p-3 text-[10px] sm:text-xs hidden xs:table-cell">{newJoiner.location}</td>
                    <td className="p-2 sm:p-3 text-[10px] sm:text-xs hidden sm:table-cell">{newJoiner.joinDate}</td>
                    <td className="p-2 sm:p-3 hidden md:table-cell">
                      <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {newJoiner.onboardingStage}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-0.5 sm:gap-1">
                        {newJoiner.skills?.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex px-1 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-150"
                          >
                            {skill}
                          </span>
                        ))}
                        {newJoiner.skills?.length > 2 && (
                          <span className="inline-flex px-1 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[10px] font-bold bg-slate-100 text-slate-600">
                            +{newJoiner.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">
                      {newJoiner.assignedBuddy ? (
                        <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Assigned
                        </span>
                      ) : (
                        <span className="inline-flex px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-right">
                      <div className="inline-flex border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button
                          className="p-1 sm:p-1.5 hover:bg-slate-50 border-r border-slate-150"
                          onClick={() => {
                            setSelectedNewJoiner(newJoiner);
                            setShowNewJoinerProfile(true);
                          }}
                          title="View Profile"
                        >
                          <Icon icon="heroicons:eye" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                        </button>
                        {!newJoiner.assignedBuddy && (
                          <button
                            className="p-1 sm:p-1.5 hover:bg-slate-50"
                            onClick={() => {
                              setSelectedNewJoiner(newJoiner);
                              setAssignmentForm((prev) => ({
                                ...prev,
                                newJoinerId: newJoiner.id,
                              }));
                              setShowAssignmentModal(true);
                            }}
                            title="Assign Buddy"
                          >
                            <Icon icon="heroicons:user-plus" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreateProgram && (
        <BuddyCreateProgramModal
          isOpen={showCreateProgram}
          onClose={() => setShowCreateProgram(false)}
          programForm={programForm}
          setProgramForm={setProgramForm}
          handleCreateProgram={handleCreateProgram}
          programTypes={programTypes}
          departments={departments}
          locations={locations}
        />
      )}

      {showAssignmentModal && (
        <BuddyAssignmentModal
          isOpen={showAssignmentModal}
          onClose={() => setShowAssignmentModal(false)}
          assignmentForm={assignmentForm}
          setAssignmentForm={setAssignmentForm}
          handleAssignBuddy={handleAssignBuddy}
          buddyPrograms={buddyPrograms}
          buddies={buddies}
          newJoiners={newJoiners}
        />
      )}

      {showFeedbackModal && (
        <BuddyFeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          feedbackForm={feedbackForm}
          setFeedbackForm={setFeedbackForm}
          handleSubmitFeedback={handleSubmitFeedback}
          buddyPrograms={buddyPrograms}
        />
      )}

      {showAnalyticsModal && (
        <BuddyAnalyticsModal
          isOpen={showAnalyticsModal}
          onClose={() => setShowAnalyticsModal(false)}
          selectedProgram={selectedProgram}
          handleExportData={handleExportData}
        />
      )}

      {showCommunicationModal && (
        <BuddyCommunicationModal
          isOpen={showCommunicationModal}
          onClose={() => setShowCommunicationModal(false)}
          communicationForm={communicationForm}
          setCommunicationForm={setCommunicationForm}
          handleRecordCommunication={handleRecordCommunication}
          buddyPrograms={buddyPrograms}
          communicationTypes={communicationTypes}
        />
      )}

      {showRulesModal && (
        <BuddyRulesModal
          isOpen={showRulesModal}
          onClose={() => setShowRulesModal(false)}
          selectedProgram={selectedProgram}
        />
      )}

      {showChecklistModal && (
        <BuddyChecklistModal
          isOpen={showChecklistModal}
          onClose={() => setShowChecklistModal(false)}
          selectedProgram={selectedProgram}
          handleUpdateTaskStatus={handleUpdateTaskStatus}
        />
      )}

      {showBuddyProfile && (
        <BuddyProfileModal
          isOpen={showBuddyProfile}
          onClose={() => setShowBuddyProfile(false)}
          selectedBuddy={selectedBuddy}
          buddyPrograms={buddyPrograms}
          setAssignmentForm={setAssignmentForm}
          setShowAssignmentModal={setShowAssignmentModal}
        />
      )}

      {showNewJoinerProfile && (
        <BuddyNewJoinerProfileModal
          isOpen={showNewJoinerProfile}
          onClose={() => setShowNewJoinerProfile(false)}
          selectedNewJoiner={selectedNewJoiner}
          buddies={buddies}
          buddyPrograms={buddyPrograms}
          setAssignmentForm={setAssignmentForm}
          setShowAssignmentModal={setShowAssignmentModal}
        />
      )}
    </div>
  );
};

export default BuddyMentorAssignment;